from django.urls import path
from .views import UploadCSVView, DatasetListView, GeneratePDFView

urlpatterns = [
    path('upload/', UploadCSVView.as_view()),
    path('datasets/', DatasetListView.as_view()),
    path('datasets/<int:pk>/pdf/', GeneratePDFView.as_view()),
]
