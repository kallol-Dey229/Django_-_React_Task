from django.urls import path
from .views import PatientListCreateView, PatientDetailView, PatientVisitCreateView

urlpatterns = [
    path('patients/', PatientListCreateView.as_view()),
    path('patients/<int:pk>/', PatientDetailView.as_view()),
    path('visits/', PatientVisitCreateView.as_view()),
]