from django.urls import path
from . import views

urlpatterns = [
    path('home/',views.home,name='content_home'),
    path('home/basics/alphabet/',views.alphabet),
    path('home/basics/number/',views.number),
    path('home/basics/table/',views.table),
    # path('home/english/english.html',views.english),
    # path('home/hindi/hindi.html',views.hindi),
    # path('home/english/songs/',views.songs),
    # path('test/',views.test)
]