from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from django.http import FileResponse
from django.conf import settings
import pandas as pd
import io, os

from .models import Dataset
from .serializers import DatasetSerializer


class UploadCSVView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'No file'}, status=400)

        df = pd.read_csv(file)
        df.columns = [x.strip() for x in df.columns]

        summary = {
            "total_count": len(df),
            "avg_flowrate": float(df["Flowrate"].mean()),
            "avg_pressure": float(df["Pressure"].mean()),
            "avg_temperature": float(df["Temperature"].mean()),
            "type_distribution": df["Type"].value_counts().to_dict()
        }

        rows = [
            {
                "name": row.get("Equipment Name", ""),
                "type": row.get("Type", ""),
                "flowrate": row.get("Flowrate", ""),
                "pressure": row.get("Pressure", ""),
                "temperature": row.get("Temperature", "")
            }
            for _, row in df.iterrows()
        ]

        file.seek(0)
        ds = Dataset.objects.create(file=file, filename=file.name, summary=summary)

        all_ds = Dataset.objects.order_by('-uploaded_at')
        if all_ds.count() > 5:
            for extra in all_ds[5:]:
                try:
                    os.remove(os.path.join(settings.MEDIA_ROOT, extra.file.name))
                except:
                    pass
                extra.delete()

        return Response({"summary": summary, "data": rows}, status=201)


class DatasetListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        ds = Dataset.objects.order_by('-uploaded_at')[:5]
        return Response(DatasetSerializer(ds, many=True).data)
        

class GeneratePDFView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        ds = Dataset.objects.get(pk=pk)
        s = ds.summary

        buffer = io.BytesIO()
        c = canvas.Canvas(buffer, pagesize=A4)
        c.drawString(50, 800, f"Dataset Report: {ds.filename}")

        y = 760
        for k, v in s.items():
            c.drawString(50, y, f"{k}: {v}")
            y -= 20

        c.showPage()
        c.save()
        buffer.seek(0)

        return FileResponse(buffer, as_attachment=True, filename=f"{ds.filename}_report.pdf")
