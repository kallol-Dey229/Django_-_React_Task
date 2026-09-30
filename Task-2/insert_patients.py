import os

import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from patients.models import Patient  # noqa: E402

DEFAULT_PASSWORD = "patient1234"

# (name, gender, age, blood_group, mobile)
PATIENT_DATA = [
    ("Ab.Kader", "MALE", 25, "O+", "01677307926"),
    ("Morshed Khan", "MALE", 29, "O+", "01674205677"),
    ("Jhorna", "FEMALE", 26, "B+", "01675216052"),
    ("Dhuku Miah", "MALE", 32, "B+", "01860280511"),
    ("Aklima", "FEMALE", 30, "AB+", "01912850072"),
    ("Aslam", "MALE", 29, "B+", "01854558127"),
    ("Kobir", "MALE", 33, "A+", "01984605450"),
    ("Kamruzzaman", "MALE", 35, "B+", "01925704524"),
    ("Munna", "MALE", 42, "O+", "01747497279"),
    ("Ashraful", "MALE", 38, "O+", "01910786529"),
    ("Kabir", "MALE", 27, "A+", "01700000001"),
]


def split_name(full_name):
    parts = full_name.split(" ", 1)
    first_name = parts[0]
    last_name = parts[1] if len(parts) > 1 else ""
    return first_name, last_name


def run():
    created_count = 0
    updated_count = 0

    for name, gender, age, blood_group, mobile in PATIENT_DATA:
        first_name, last_name = split_name(name)

        patient, created = Patient.objects.update_or_create(
            mobile=mobile,
            defaults={
                "first_name": first_name,
                "last_name": last_name,
                "gender": gender,
                "age": age,
                "blood_group": blood_group,
            },
        )

        if created:
            patient.set_password(DEFAULT_PASSWORD)
            patient.save()
            created_count += 1
            print(f"Created: {patient.first_name} {patient.last_name} ({mobile})")
        else:
            updated_count += 1
            print(f"Already exists, skipped/updated: {mobile}")

    print(f"\nDone. New rows: {created_count}, existing rows: {updated_count}")


if __name__ == "__main__":
    run()