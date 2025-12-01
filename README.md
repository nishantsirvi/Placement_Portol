# 🎓 Placement Tracking System

A full-stack web application for managing college placement activities with role-based access control.

[![GitHub](https://img.shields.io/badge/GitHub-nishantsirvi-181717?logo=github)](https://github.com/nishantsirvi/Placement_Portol)
[![Python](https://img.shields.io/badge/Python-3.8+-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-4.2.7-092E20?logo=django)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)

## ✨ Features

- 🔐 **JWT Authentication** - Secure login with role-based access (Student, Admin, Company)
- 👨‍🎓 **Student Management** - Profiles, CGPA tracking, search & filter
- 🏢 **Company Management** - Job postings, eligibility criteria, package details
- 📊 **Placement Tracking** - Application status, interview stages, offers
- 📅 **Calendar View** - Events with monthly grid and list view toggle
- ⚙️ **Settings** - Profile updates and password change
- 🔍 **Search & Filter** - Across students, companies, and applications
- 📈 **Analytics** - Placement statistics and reports (Admin)

## 🛠️ Tech Stack

**Backend:** Django 4.2.7 • Django REST Framework • JWT • SQLite  
**Frontend:** React 18.2.0 • React Router • Axios • Recharts

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 14+
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/nishantsirvi/Placement_Portol.git
cd Placement_Portol

# Backend setup
cd backend
python -m venv venv
venv\Scripts\activate  # On Windows (Linux/Mac: source venv/bin/activate)
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver  # Runs on http://localhost:8000

# Frontend setup (new terminal)
cd frontend
npm install
npm start  # Runs on http://localhost:3000
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

**Full API docs:** `backend/API_DOCUMENTATION.md`

## 📁 Project Structure

```
Placement_Portol/
├── backend/              # Django REST API
│   ├── accounts/         # Authentication
│   ├── placements/       # Core features
│   └── manage.py
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
