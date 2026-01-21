# 🎓 Placement Tracking System

A production-ready full-stack web application for managing college placement activities with role-based access control.

[![GitHub](https://img.shields.io/badge/GitHub-nishantsirvi-181717?logo=github)](https://github.com/nishantsirvi/Placement_Portol)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-4.2.7-092E20?logo=django)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)

## ✨ Features

- 🔐 **JWT Authentication** - Secure login with role-based access (Student, Admin)
- 👨‍🎓 **Student Management** - Profiles, CGPA tracking, bulk CSV upload, search & filter
- 🏢 **Company Management** - Job postings, eligibility criteria, package details
- 📊 **Placement Tracking** - Application status, interview stages, offers
- 📅 **Calendar View** - Events with monthly grid and list view toggle
- ⚙️ **Settings** - Profile updates and password change
- 🔍 **Search & Filter** - Across students, companies, and applications
- 📈 **Analytics** - Placement statistics and reports (Admin)
- 🚀 **Production Ready** - Docker, environment configs, security hardened

## 🛠️ Tech Stack

**Backend:** Django 4.2.7 • Django REST Framework • JWT • PostgreSQL/SQLite • Gunicorn • Whitenoise  
**Frontend:** React 18.2.0 • React Router • Axios • Recharts  
**Deployment:** Docker • Nginx • Docker Compose

## 🚀 Quick Start (Development)

### Prerequisites
- Python 3.11+
- Node.js 18+
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/nishantsirvi/Placement_Portol.git
cd Placement_Portol

# Backend setup
cd backend
python -m venv venv
venv\Scripts\activate  # Windows (Linux/Mac: source venv/bin/activate)
pip install -r requirements.txt

# Copy environment file
cp .env.example .env
# Edit .env if needed (defaults work for development)

python manage.py migrate
python manage.py createsuperuser
python manage.py runserver  # Runs on http://localhost:8000

# Frontend setup (new terminal)
cd frontend
npm install
npm start  # Runs on http://localhost:3000
```

## 🐳 Quick Start (Docker)

```bash
# Clone repository
git clone https://github.com/nishantsirvi/Placement_Portol.git
cd Placement_Portol

# Setup environment
cd backend && cp .env.example .env && cd ..
cd frontend && cp .env.production.example .env.production && cd ..

# Start all services
docker-compose up -d

# Run migrations and create superuser
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser
docker-compose exec backend python manage.py collectstatic --noinput

# Access at http://localhost
```

## 📦 Deployment

**FREE Deployment Options:**

### Vercel (Frontend Only - Recommended for Free Tier)
```bash
# Frontend on Vercel (FREE)
cd frontend
vercel

# Backend on Railway/Render (FREE tier)
# See VERCEL_DEPLOYMENT.md for complete guide
```

**Complete guides:**
- **Vercel + Railway (FREE):** [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)
- **Docker + All Platforms:** [DEPLOYMENT.md](DEPLOYMENT.md)

### Other Platforms
See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment guide including:
- Environment configuration
- PostgreSQL setup
- Production deployment (Heroku, Railway, Render, AWS, DigitalOcean)
- Docker deployment
- Security checklist
- Troubleshooting

**Quick deploy script:**
```bash
chmod +x deploy.sh
./deploy.sh
```

## 🔑 Default Credentials

After running `seed_data` command:

```
Admin: admin / admin123
Student: student / student123
```

**Note:** When admin creates a student, credentials are auto-generated:
- Username: enrollment number (lowercase)
- Password: firstname + last 4 digits of enrollment

## 📚 API Endpoints

```
POST   /api/auth/login/              - Login
POST   /api/auth/register/           - Register
POST   /api/auth/change-password/    - Change password
GET    /api/students/                - List students
POST   /api/students/                - Create student
GET    /api/companies/               - List companies
GET    /api/placement-progress/      - List applications
GET    /api/important-dates/         - List events
```

**Full API docs:** [API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md)

## 🔐 Security Features

- ✅ Environment-based configuration
- ✅ Secret key protection
- ✅ HTTPS enforcement in production
- ✅ Secure cookies
- ✅ XSS protection
- ✅ CSRF protection
- ✅ CORS configuration
- ✅ SQL injection protection
- ✅ Clickjacking protection

## 📁 Project Structure

```
Placement_Portol/
├── backend/              # Django REST API
│   Deployment Guide:** [DEPLOYMENT.md](DEPLOYMENT.md) - Complete production deployment instructions
- **API Reference:** [API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md) - Full API documentation
- **Project Structure:** See below

## 📁 Project Files

```
placement-tracking-system/
├── backend/
│   ├── accounts/              # Authentication & user management
│   ├── placements/            # Core placement features
│   ├── placement_system/      # Django settings
│   ├── .env.example           # Environment variables template
│   ├── Dockerfile             # Backend Docker config
│   ├── Procfile              # Heroku deployment config
│   ├── requirements.txt       # Python dependencies
│   └── runtime.txt           # Python version
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── services/         # API integration
│   │   └── context/          # React context
│   ├── Dockerfile            # Frontend Docker config
│   ├── .env.production.example  # Frontend env template
│   └── package.json          # Node dependencies
├── docker-compose.yml        # Multi-container orchestration
├── nginx.conf               # Nginx reverse proxy config
├── deploy.sh                # Deployment automation script
├── DEPLOYMENT.md           # Deployment guide
└── README.md              # This file
``
├── frontend/             # React frontend
│   └── src/
│       ├── components/   # UI components
│       └── services/     # API calls
└── README.md
```

## 📖 Documentation

- **Student Access Guide:** `STUDENT_ACCESS_GUIDE.md`
- **Password Management:** `PASSWORD_CHANGE_GUIDE.md`
- **API Reference:** `backend/API_DOCUMENTATION.md`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/NewFeature`)
3. Commit changes (`git commit -m 'Add NewFeature'`)
4. Push to branch (`git push origin feature/NewFeature`)
5. Open Pull Request

## 📝 License

Open source under the [MIT License](LICENSE).

## 👨‍💻 Author

**Nishant Sirvi** - [@nishantsirvi](https://github.com/nishantsirvi)

---

⭐ Star this repo if you find it helpful!
