from django.urls import path
from . import views

urlpatterns = [
    path('home/',views.home),
    path('home/english/english.html',views.english),
    path('home/hindi/hindi.html',views.hindi),
]