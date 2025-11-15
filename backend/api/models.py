from django.db import models
from django.utils import timezone

class Dataset(models.Model):
    file = models.FileField(upload_to='datasets/')
    filename = models.CharField(max_length=255)
    uploaded_at = models.DateTimeField(default=timezone.now)
    summary = models.JSONField()

    def __str__(self):
        return self.filename
