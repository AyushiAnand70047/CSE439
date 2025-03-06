from django.db import models

class VoiceSession(models.Model):
    original_text = models.TextField(blank=True, null=True)
    corrected_text = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Session {self.id} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"