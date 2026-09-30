from rest_framework import serializers
from .models import Patient, PatientVisit


class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ['id', 'first_name', 'last_name', 'age', 'gender', 'address',
                  'blood_group', 'mobile', 'password', 'total_visits', 'last_visit_date']
        read_only_fields = ['total_visits', 'last_visit_date']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        return Patient.objects.create_user(**validated_data)

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class PatientVisitSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientVisit
        fields = '__all__'