# Patient Management API (Task 1)

A REST API built with **Python, Django and Django Rest Framework** to manage patients and their visits, using a **PostgreSQL** database.

## Features

- Custom `Patient` model (extends Django's `AbstractUser`), login with **mobile + password**
- `PatientVisit` model linked to a patient with a foreign key
- Full CRUD REST endpoints for patients (with pagination on the list endpoint)
- Creating a visit automatically updates the patient's `total_visits` and `last_visit_date`
- Class-based views only

## Tech Stack

- Python 3.10+
- Django 6.1
- Django Rest Framework
- PostgreSQL
- psycopg2-binary


## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/kallol-Dey229/Django_-_React_Task/new/main/Django_Task
cd Django_Task
```

### 2. Create a virtual environment

```bash
python -m venv venv
```

### 3. Activate the virtual environment

**Windows (PowerShell):**

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
.\venv\Scripts\Activate.ps1
```

**Windows (CMD):**

```cmd
venv\Scripts\activate.bat
```

You should see `(venv)` at the start of your terminal line.

### 4. Install dependencies

```bash
python -m pip install -r requirements.txt
```

If there is no `requirements.txt`, install manually:

```bash
python -m pip install django djangorestframework psycopg2-binary
```

### 5. Create the PostgreSQL database

Open pgAdmin or `psql` and run:

```sql
CREATE DATABASE patient_db;
```

### 6. Configure database settings

Open `config/settings.py` and make sure the `DATABASES` section matches your local PostgreSQL:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'patient_db',
        'USER': 'postgres',
        'PASSWORD': 'postgres',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

AUTH_USER_MODEL = 'patients.Patient'

REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 5,
}
```

### 7. Run migrations

```bash
python manage.py makemigrations
python manage.py migrate
```


It will ask for a mobile number, first name, age, gender, blood group and password.

### 8. Start the development server

```bash
python manage.py runserver
```

The API is now available at `http://127.0.0.1:8000/api/`.

## API Endpoints


| List patients (paginated) | GET | `/api/patients/` |
| Create patient | POST | `/api/patients/` |
| Get one patient | GET | `/api/patients/<id>/` |
| Update patient (full) | PUT | `/api/patients/<id>/` |
| Update patient (partial) | PATCH | `/api/patients/<id>/` |
| Delete patient | DELETE | `/api/patients/<id>/` |
| Add patient visit | POST | `/api/visits/` |

### Pagination

The list endpoint returns 5 patients per page. Use the `page` query parameter:

```
GET /api/patients/?page=2
```

Response format:

```json
{
  "count": 12,
  "next": "http://127.0.0.1:8000/api/patients/?page=2",
  "previous": null,
  "results": [ ... ]
}
```

## Sample Requests

### Create a patient

`POST /api/patients/`

```json
{
  "first_name": "Test",
  "last_name": "User",
  "age": 25,
  "gender": "MALE",
  "blood_group": "O+",
  "address": "Dhaka",
  "mobile": "01700000000",
  "password": "test1234"
}
```

### Update a patient

`PATCH /api/patients/1/`

```json
{
  "age": 26,
  "address": "Chittagong"
}
```

### Add a visit

`POST /api/visits/`

```json
{
  "patient": 1,
  "doctor_name": "Dr. Rahman",
  "visit_date": "2026-09-29",
  "clinical_note": "Fever and headache"
}
```

After this request, the patient's `total_visits` is increased by 1 and `last_visit_date` is set to `2026-09-29`.

### Example with curl

```bash
curl -X POST http://127.0.0.1:8000/api/patients/ \
  -H "Content-Type: application/json" \
  -d '{"first_name":"Test","age":25,"gender":"MALE","blood_group":"O+","mobile":"01700000000","password":"test1234"}'
```

## Database Models

**Patient**


| first_name | CharField | required |
| last_name | CharField | can be blank |
| age | PositiveIntegerField | required |
| gender | CharField | required |
| address | TextField | can be blank |
| blood_group | CharField | required |
| mobile | CharField | unique, used for login |
| password | CharField | stored hashed |
| total_visits | PositiveIntegerField | default 0, auto-updated |
| last_visit_date | DateField | nullable, auto-updated |

**PatientVisit**


| patient | ForeignKey(Patient) | required |
| doctor_name | CharField | required |
| visit_date | DateField | required |
| clinical_note | TextField | can be blank |

## Troubleshooting


| `No module named 'django'` or `'rest_framework'` | Activate the venv, then run `python -m pip install -r requirements.txt` |
| `database "patient_db" does not exist` | Create the database (Step 5) |
| `password authentication failed for user "postgres"` | Update `PASSWORD` in `config/settings.py` |
| `psycopg2` fails to install | Run `python -m pip install "psycopg[binary]"` instead |
| Migration errors about the user model | Make sure `AUTH_USER_MODEL = 'patients.Patient'` is set before the first migration. If the database already has old migrations, drop and recreate `patient_db`, then run the migrations again |
| PowerShell blocks the activate script | Run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned` |