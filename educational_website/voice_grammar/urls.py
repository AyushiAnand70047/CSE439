from django.urls import path
from . import views

app_name = 'voice_grammar'

urlpatterns = [
    path('', views.index, name='index'),
    path('process-text/', views.process_text, name='process_text'),
]