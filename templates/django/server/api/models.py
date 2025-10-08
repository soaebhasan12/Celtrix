from django.db import models

# Create your models here.

class ExampleModel(models.Model):
    """
    Example model - you can delete this and create your own models
    """
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'example_model'
        ordering = ['-created_at']

    def __str__(self):
        return self.name