# 🚀 Deployment Guide - Placement Tracking System

## Prerequisites
- Git
- Python 3.11+
- Node.js 18+
- PostgreSQL (for production)
- Docker & Docker Compose (optional)

---

## 📋 Quick Deployment Checklist

### 1. **Environment Setup**

**Backend:**
```bash
cd backend
cp .env.example .env
```

Edit `.env` file with your production values:
```bash
SECRET_KEY=<generate-new-secret-key>
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DATABASE_ENGINE=django.db.backends.postgresql
DATABASE_NAME=placement_db
DATABASE_USER=your_db_user
DATABASE_PASSWORD=your_secure_password
DATABASE_HOST=localhost
DATABASE_PORT=5432
CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

**Generate SECRET_KEY:**
```python
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

**Frontend:**
```bash
cd frontend
cp .env.production.example .env.production
```

Edit `.env.production`:
```bash
REACT_APP_API_URL=https://api.yourdomain.com/api
```

### 2. **Database Setup (PostgreSQL)**

```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql
CREATE DATABASE placement_db;
CREATE USER your_db_user WITH PASSWORD 'your_secure_password';
ALTER ROLE your_db_user SET client_encoding TO 'utf8';
ALTER ROLE your_db_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE your_db_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE placement_db TO your_db_user;
\q
```

### 3. **Backend Deployment**

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic --noinput

# Test production server
gunicorn placement_system.wsgi:application --bind 0.0.0.0:8000
```

### 4. **Frontend Deployment**

```bash
cd frontend

# Install dependencies
npm ci --only=production

# Build for production
npm run build

# The build folder contains your production-ready files
```

---

## 🐳 Docker Deployment (Recommended)

### **Using Docker Compose:**

1. **Setup environment:**
```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your values

# Frontend  
cd ../frontend
cp .env.production.example .env.production
# Edit with your API URL
```

2. **Build and run:**
```bash
# From project root
docker-compose up -d --build

# Run migrations
docker-compose exec backend python manage.py migrate

# Create superuser
docker-compose exec backend python manage.py createsuperuser

# Collect static files
docker-compose exec backend python manage.py collectstatic --noinput
```

3. **Access the application:**
- Frontend: http://localhost
- Backend API: http://localhost/api/
- Admin Panel: http://localhost/admin/

---

## ☁️ Platform-Specific Deployment

### **Heroku**

```bash
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set SECRET_KEY="your-secret-key"
heroku config:set DEBUG=False
heroku config:set ALLOWED_HOSTS="your-app-name.herokuapp.com"

# Deploy backend
cd backend
git init
git add .
git commit -m "Initial commit"
heroku git:remote -a your-app-name
git push heroku main

# Run migrations
heroku run python manage.py migrate
heroku run python manage.py createsuperuser
heroku run python manage.py collectstatic --noinput
```

**For frontend (separate app):**
```bash
cd frontend
heroku create your-frontend-app
heroku config:set REACT_APP_API_URL="https://your-app-name.herokuapp.com/api"
git init
git add .
git commit -m "Initial commit"
git push heroku main
```

### **Railway**

1. Go to [railway.app](https://railway.app)
2. Create new project → Deploy from GitHub
3. Add PostgreSQL database
4. Set environment variables from `.env.example`
5. Deploy automatically on push

### **Render**

1. Go to [render.com](https://render.com)
2. New → Web Service → Connect repository
3. **Backend:**
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn placement_system.wsgi:application`
   - Add environment variables
4. **Frontend:**
   - Build Command: `npm install && npm run build`
   - Publish directory: `build`

### **DigitalOcean / AWS / VPS**

```bash
# SSH into server
ssh user@your-server-ip

# Install dependencies
sudo apt update
sudo apt install python3.11 python3-pip postgresql nginx

# Clone repository
git clone https://github.com/yourusername/placement-tracking-system.git
cd placement-tracking-system

# Setup backend (follow steps in Backend Deployment section)

# Setup Nginx
sudo cp nginx.conf /etc/nginx/sites-available/placement
sudo ln -s /etc/nginx/sites-available/placement /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup systemd service for gunicorn
sudo nano /etc/systemd/system/gunicorn.service
```

**gunicorn.service:**
```ini
[Unit]
Description=Gunicorn daemon for Placement System
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/path/to/placement-tracking-system/backend
ExecStart=/path/to/venv/bin/gunicorn --workers 3 --bind unix:/tmp/gunicorn.sock placement_system.wsgi:application

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl start gunicorn
sudo systemctl enable gunicorn
```

---

## 🔒 Security Checklist

- [ ] Changed SECRET_KEY to a new random value
- [ ] Set DEBUG=False
- [ ] Configured ALLOWED_HOSTS with your domain
- [ ] Using HTTPS/SSL certificate (Let's Encrypt)
- [ ] Database credentials are secure
- [ ] CORS configured for production domain only
- [ ] Security headers enabled (already in settings.py)
- [ ] Regular database backups configured
- [ ] Firewall configured (UFW/firewalld)
- [ ] Fail2ban installed for SSH protection

---

## 📊 Post-Deployment

### **Create initial data:**
```bash
python manage.py shell
```

```python
from accounts.models import User
from placements.models import Student

# Create admin user
admin = User.objects.create_superuser(
    username='admin',
    email='admin@example.com',
    password='your-secure-password',
    role='ADMIN'
)
```

### **Monitor application:**
- Set up error tracking (Sentry)
- Configure logging
- Monitor server resources
- Set up uptime monitoring

### **Backup strategy:**
```bash
# Backup database
pg_dump placement_db > backup_$(date +%Y%m%d).sql

# Backup media files
tar -czf media_backup_$(date +%Y%m%d).tar.gz media/
```

---

## 🆘 Troubleshooting

**Static files not loading:**
```bash
python manage.py collectstatic --clear --noinput
```

**Database connection error:**
- Check DATABASE_* environment variables
- Verify PostgreSQL is running: `sudo systemctl status postgresql`
- Check firewall rules

**CORS errors:**
- Verify CORS_ALLOWED_ORIGINS includes your frontend URL
- Check that credentials are enabled

**502 Bad Gateway:**
- Check gunicorn is running: `sudo systemctl status gunicorn`
- Check nginx error logs: `sudo tail -f /var/log/nginx/error.log`

---

## 📞 Support

For issues, please check:
- API Documentation: `backend/API_DOCUMENTATION.md`
- Project README: `README.md`
- GitHub Issues

---

**🎉 Your Placement Tracking System is now deployment-ready!**
