from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_page, name='register'),
    path('login/', views.login_user, name='login_user'),
    # path('home/', views.home, name='home'),
]