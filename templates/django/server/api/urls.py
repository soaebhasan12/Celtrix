from django.urls import path
from . import views

urlpatterns = [
    path('health/', views.health_check, name='health_check'),
    path('hello/', views.hello_world, name='hello_world'),
    path('examples/', views.example_list, name='example_list'),
    path('examples/<int:pk>/', views.example_detail, name='example_detail'),
]