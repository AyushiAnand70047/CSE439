from django.urls import path
from . import views

urlpatterns = [
    path('home/',views.home,name='content_home'),
    path('home/english/english.html',views.english),
    path('home/hindi/hindi.html',views.hindi),
    path('card/',views.card)
]