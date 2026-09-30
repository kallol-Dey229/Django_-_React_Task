from rest_framework import generics
from .models import Patient, PatientVisit
from .serializers import PatientSerializer, PatientVisitSerializer


class PatientListCreateView(generics.ListCreateAPIView):
    queryset = Patient.objects.all().order_by('id')
    serializer_class = PatientSerializer


class PatientDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer


class PatientVisitCreateView(generics.CreateAPIView):
    queryset = PatientVisit.objects.all()
    serializer_class = PatientVisitSerializer

    def perform_create(self, serializer):
        visit = serializer.save()
        patient = visit.patient
        patient.total_visits += 1
        patient.last_visit_date = visit.visit_date
        patient.save()