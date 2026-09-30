from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class PatientManager(BaseUserManager):
    def create_user(self, mobile, password=None, **extra_fields):
        if not mobile:
            raise ValueError("Mobile is required")
        user = self.model(mobile=mobile, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, mobile, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(mobile, password, **extra_fields)


class Patient(AbstractUser):
    username = None
    mobile = models.CharField(max_length=15, unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100, blank=True)
    age = models.PositiveIntegerField()
    gender = models.CharField(max_length=10)
    address = models.TextField(blank=True)
    blood_group = models.CharField(max_length=5)
    total_visits = models.PositiveIntegerField(default=0)
    last_visit_date = models.DateField(null=True, blank=True)

    USERNAME_FIELD = 'mobile'
    REQUIRED_FIELDS = ['first_name', 'age', 'gender', 'blood_group']

    objects = PatientManager()

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class PatientVisit(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='visits')
    doctor_name = models.CharField(max_length=100)
    visit_date = models.DateField()
    clinical_note = models.TextField(blank=True)

    def __str__(self):
        return f"{self.patient} - {self.visit_date}"