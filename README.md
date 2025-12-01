# 🎓 Placement Tracking System

A comprehensive full-stack web application for managing college placement activities, built with Django REST Framework and React.

## 🌟 Features

### 🔐 Authentication & Authorization
- **JWT-based authentication** with token refresh and blacklisting
- **Role-based access control** (Student, Admin, Company Representative)
- **User registration and login** with email validation
- **Profile management** with picture upload support
- **Password change** and security features
- **User verification** system for admins

### 👨‍🎓 Student Management
- Complete student profiles with enrollment details
- CGPA tracking and academic information
- Skills and resume management
- Branch and year classification
- Placement status tracking
- Individual placement history

### 🏢 Company Management
- Company profiles with detailed information
- Job role and package details
- Eligibility criteria (CGPA, branches)
- Contact information management
- Active/inactive status tracking
- Company type classification (Product/Service/Startup/MNC)

### 📊 Placement Process Tracking
- Multi-stage placement process
- Application status tracking
- Stage-wise progress monitoring
- Interview scheduling
- Offer management (received/accepted/declined)
- Real-time status updates

### 📈 Analytics & Statistics
- Placement percentage calculations
- Branch-wise placement statistics
- Average package calculations
- Company-wise application tracking
- Status breakdown reports
- Recent activity monitoring

### 📅 Important Dates & Events
- Placement drive schedules
- Application deadlines
- Interview dates
- Result announcements
- Event notifications

## 🛠️ Tech Stack

### Backend
- **Django 4.2.7** - Python web framework
- **Django REST Framework 3.14.0** - RESTful API toolkit
- **djangorestframework-simplejwt 5.3.0** - JWT authentication
- **django-cors-headers 4.3.1** - Cross-origin resource sharing
- **Pillow** - Image processing
- **SQLite** - Development database (easily switchable to PostgreSQL)

### Frontend
- **React 18.2.0** - UI framework
- **React Router DOM 6.20.0** - Client-side routing
- **Axios 1.6.2** - HTTP client
- **Recharts 2.10.3** - Data visualization

## 📋 Prerequisites

- Python 3.8+
- Node.js 14+
- npm or yarn

## 🚀 Installation & Setup

### Backend Setup

1. **Clone the repository:**
```bash
git clone <repository-url>
cd placement-tracking-system/backend
```

2. **Create and activate virtual environment (optional but recommended):**
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Run migrations:**
```bash
python manage.py migrate
```

5. **Seed demo data:**
```bash
python manage.py seed_data
```

6. **Run the development server:**
```bash
python manage.py runserver
```

Backend will be available at: **http://localhost:8000**

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd ../frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm start
```

Frontend will be available at: **http://localhost:3000**

## 🔑 Demo Credentials

### Admin Account (Full Access)
```
Username: admin
Password: admin123
```

### Student Account
```
Username: john.doe
Password: student123
```

### Company Representative
```
Username: company.rep
Password: company123
```

## 📚 API Documentation

### Base URL
```
http://localhost:8000/api/
```

### Authentication Endpoints
```
POST   /auth/register/              - Register new user
POST   /auth/login/                 - Login and receive JWT tokens
POST   /auth/logout/                - Logout and blacklist token
POST   /auth/token/refresh/         - Refresh access token
GET    /auth/check-auth/            - Check authentication status
GET    /auth/profile/               - Get current user profile
PUT    /auth/profile/update/        - Update user profile
POST   /auth/change-password/       - Change password
GET    /auth/users/                 - List all users (Admin only)
POST   /auth/users/{id}/verify/     - Verify user (Admin only)
```

### Student Endpoints
```
GET    /students/                   - List students
POST   /students/                   - Create student profile
GET    /students/{id}/              - Get student details
PUT    /students/{id}/              - Update student
DELETE /students/{id}/              - Delete student
GET    /students/placed_students/   - Get placed students
GET    /students/unplaced_students/ - Get unplaced students
GET    /students/{id}/placement_history/ - Student's placement history
```

### Company Endpoints
```
GET    /companies/                  - List companies
POST   /companies/                  - Create company (Admin only)
GET    /companies/{id}/             - Get company details
PUT    /companies/{id}/             - Update company (Admin only)
DELETE /companies/{id}/             - Delete company (Admin only)
GET    /companies/active_companies/ - Get active companies
GET    /companies/{id}/applicants/  - Get company applicants
```

### Placement Progress Endpoints
```
GET    /placement-progress/         - List placement applications
POST   /placement-progress/         - Apply to company
GET    /placement-progress/{id}/    - Get application details
PUT    /placement-progress/{id}/    - Update application status
GET    /placement-progress/statistics/ - Get placement statistics
GET    /placement-progress/recent_updates/ - Get recent updates
```

### Other Endpoints
```
GET    /stages/                     - List placement stages
POST   /stages/                     - Create stage (Admin only)
GET    /important-dates/            - List important dates
POST   /important-dates/            - Create event (Admin only)
GET    /important-dates/upcoming/   - Get upcoming events
```

**For detailed API documentation, see:** `backend/API_DOCUMENTATION.md`

## 🔒 Security Features

- ✅ Secure password hashing using PBKDF2
- ✅ JWT token-based authentication
- ✅ Token refresh and rotation
- ✅ Token blacklisting on logout
- ✅ CSRF protection
- ✅ CORS configuration
- ✅ Input validation and sanitization
- ✅ Role-based access control
- ✅ User verification system

## 👥 User Roles & Permissions

| Feature | Student | Admin | Company |
|---------|---------|-------|---------|
| View own profile | ✅ | ✅ | ✅ |
| View all students | ❌ | ✅ | ❌ |
| Edit own profile | ✅ | ✅ | ✅ |
| Manage companies | ❌ | ✅ | Own only |
| Apply to jobs | ✅ | ✅ | ❌ |
| View statistics | ✅ | ✅ | Limited |
| Verify users | ❌ | ✅ | ❌ |
| Manage stages | ❌ | ✅ | ❌ |

## 📁 Project Structure

```
placement-tracking-system/
├── backend/
│   ├── accounts/                 # Authentication app
│   │   ├── migrations/
│   │   ├── management/
│   │   │   └── commands/
│   │   │       └── seed_data.py  # Demo data seeder
│   │   ├── models.py             # Custom User model
│   │   ├── serializers.py        # User serializers
│   │   ├── views.py              # Auth views
│   │   ├── permissions.py        # Custom permissions
│   │   └── urls.py               # Auth URLs
│   ├── placements/               # Placements app
│   │   ├── migrations/
│   │   ├── models.py             # Student, Company, etc.
│   │   ├── serializers.py        # Model serializers
│   │   ├── views.py              # API views
│   │   └── urls.py               # Placement URLs
│   ├── placement_system/         # Main project
│   │   ├── settings.py           # Django settings
│   │   ├── urls.py               # URL routing
│   │   └── wsgi.py
│   ├── API_DOCUMENTATION.md      # Complete API docs
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Students.jsx
│   │   │   ├── Companies.jsx
│   │   │   ├── PlacementProgress.jsx
│   │   │   └── ImportantDates.jsx
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── index.js
│   ├── package.json
│   └── README.md
├── AUTHENTICATION_SETUP.md       # Auth setup guide
├── QUICK_START.md                # Quick start guide
└── README.md                     # This file
```

## 🧪 Testing the API

### Using cURL

**Login:**
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"john.doe","password":"student123"}'
```

**Access Protected Endpoint:**
```bash
curl -X GET http://localhost:8000/api/students/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Using Python Requests

```python
import requests

# Login
response = requests.post('http://localhost:8000/api/auth/login/', json={
    'username': 'john.doe',
    'password': 'student123'
})

tokens = response.json()
access_token = tokens['access']

# Fetch students
headers = {'Authorization': f'Bearer {access_token}'}
students = requests.get('http://localhost:8000/api/students/', headers=headers)
print(students.json())
```

## 🐛 Troubleshooting

### Common Issues

**1. Module not found errors:**
```bash
pip install -r requirements.txt
```

**2. Database errors:**
```bash
python manage.py migrate
```

**3. CORS errors:**
- Check that frontend URL is in `CORS_ALLOWED_ORIGINS` in `settings.py`
- Default allowed: `localhost:3000`, `localhost:5173`

**4. Authentication errors:**
- Ensure Authorization header is included: `Authorization: Bearer <token>`
- Check if token has expired (1 hour for access tokens)

**5. Permission denied:**
- Verify user role has required permissions
- Check if user is verified (some actions require verification)

## 📖 Additional Documentation

- **API Documentation:** `backend/API_DOCUMENTATION.md`
- **Authentication Setup:** `AUTHENTICATION_SETUP.md`
- **Quick Start Guide:** `QUICK_START.md`

## 🔄 Development Workflow

1. **Backend changes:**
   - Modify models → Create migrations → Apply migrations
   - Update serializers if needed
   - Update views and add business logic
   - Test endpoints using browsable API or Postman

2. **Frontend changes:**
   - Create/modify components
   - Update routing if needed
   - Test in browser
   - Check console for errors

## 🚀 Deployment

### Backend (Django)

**Options:**
- Heroku
- Railway
- DigitalOcean
- AWS Elastic Beanstalk
- PythonAnywhere

**Before deployment:**
1. Set `DEBUG = False`
2. Update `ALLOWED_HOSTS`
3. Use PostgreSQL instead of SQLite
4. Set secure `SECRET_KEY`
5. Configure static files serving
6. Set up HTTPS

### Frontend (React)

**Options:**
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

**Build command:**
```bash
npm run build
```

## 🎯 Future Enhancements

### Planned Features
- [ ] Email notifications for placement updates
- [ ] SMS notifications
- [ ] Interview scheduling system
- [ ] Video interview integration
- [ ] Resume builder
- [ ] Mock interview platform
- [ ] AI-based job matching
- [ ] Analytics dashboard with charts
- [ ] Export reports (PDF/Excel)
- [ ] Mobile application
- [ ] Real-time chat system
- [ ] Alumni network integration

### Technical Improvements
- [ ] Unit tests (Django + Jest)
- [ ] Integration tests
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] API documentation with Swagger/OpenAPI
- [ ] Database migration to PostgreSQL
- [ ] Redis caching
- [ ] Celery for background tasks
- [ ] Docker containerization
- [ ] Kubernetes deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is created for educational purposes.

## 👨‍💻 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Django Documentation
- React Documentation
- Django REST Framework
- All open-source contributors

## 📞 Support

For questions or issues:
- Check the documentation files
- Review the API documentation
- Check Django/React documentation
- Open an issue on GitHub

---

**Happy Coding! 🎉**

Made with ❤️ for university project