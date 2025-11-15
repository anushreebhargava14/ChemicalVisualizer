# ChemicalVisualizer

Chemical equipment parameter visualizer — Django backend + React frontend + desktop app.

## Features
- Upload CSV → backend stores summary & last 5 uploads
- Visualize averages & type distributions (Chart.js / Matplotlib)
- Generate PDF reports
- Desktop viewer (PyQt) available

## Repo structure
ChemicalVisualizer/
│
├── backend/                     # Django REST API
│   ├── api/
│   │   ├── migrations/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   └── urls.py
│   ├── backend/                 # Django settings
│   ├── media/                   # Uploaded CSV files
│   ├── manage.py
│   └── requirements.txt
│
├── web-frontend/                # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── UploadSection.jsx
│   │   │   └── ...
│   │   ├── App.jsx
│   │   ├── config.js
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── desktop/                     # Python Desktop App (PyQt/PySide)
│   ├── desktop_app.py
│   ├── ui/                      # UI files if any
│   ├── assets/                  # Icons/images
│   └── requirements.txt
│
├── README.md
└── LICENSE (optional)


## Requirements
- Python 3.11+ (used 3.13 in dev)
- Node 18+
- pip, npm

## Quick start (local)
### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver

### Frontend
cd web-frontend
npm install
npm run dev
# build: npm run build

cd desktop
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python desktop_app.py

