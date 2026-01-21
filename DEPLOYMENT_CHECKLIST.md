# 🚀 Production Deployment Checklist

## ✅ Pre-Deployment Steps

### 1. Environment Configuration
- [ ] Copy `backend/.env.example` to `backend/.env`
- [ ] Generate new SECRET_KEY: `python backend/generate_secret_key.sh`
- [ ] Set `DEBUG=False` in `.env`
- [ ] Configure `ALLOWED_HOSTS` with your domain
- [ ] Set up PostgreSQL database credentials
- [ ] Configure `CORS_ALLOWED_ORIGINS` with frontend URL
- [ ] Copy `frontend/.env.production.example` to `frontend/.env.production`
- [ ] Set `REACT_APP_API_URL` to your backend API URL

### 2. Database Setup
- [ ] Install PostgreSQL
- [ ] Create database: `placement_db`
- [ ] Create database user with secure password
- [ ] Update `.env` with database credentials
- [ ] Run migrations: `python manage.py migrate`
- [ ] Create superuser: `python manage.py createsuperuser`

### 3. Security Verification
- [ ] SECRET_KEY is unique and not committed to git
- [ ] DEBUG=False in production
- [ ] HTTPS/SSL certificate configured
- [ ] ALLOWED_HOSTS properly configured
- [ ] CORS origins restricted to production domains
- [ ] Database password is strong
- [ ] Firewall configured (ports 80, 443, 22 only)
- [ ] .env files are in .gitignore

### 4. Static Files
- [ ] Run `python manage.py collectstatic --noinput`
- [ ] Build frontend: `npm run build` in frontend directory
- [ ] Verify static files serve correctly

### 5. Dependencies
- [ ] All backend packages installed: `pip install -r requirements.txt`
- [ ] All frontend packages installed: `npm ci --only=production`
- [ ] Gunicorn installed for production server
- [ ] Whitenoise installed for static file serving

## 🐳 Docker Deployment Checklist

- [ ] Environment files configured (`.env`, `.env.production`)
- [ ] Docker and Docker Compose installed
- [ ] Run `docker-compose build`
- [ ] Run `docker-compose up -d`
- [ ] Run migrations: `docker-compose exec backend python manage.py migrate`
- [ ] Create superuser: `docker-compose exec backend python manage.py createsuperuser`
- [ ] Collect static: `docker-compose exec backend python manage.py collectstatic --noinput`
- [ ] Verify all services running: `docker-compose ps`

## ☁️ Platform Deployment (Heroku/Railway/Render)

- [ ] Repository pushed to GitHub
- [ ] Platform account created
- [ ] New project/app created
- [ ] PostgreSQL addon/database added
- [ ] Environment variables configured in platform dashboard
- [ ] Deployment successful
- [ ] Run migrations through platform CLI
- [ ] Create superuser through platform CLI
- [ ] Domain configured (if custom domain)
- [ ] SSL certificate configured

## 🔒 Post-Deployment Security

- [ ] Test login functionality
- [ ] Verify HTTPS redirect works
- [ ] Check security headers (use securityheaders.com)
- [ ] Test CORS from frontend domain
- [ ] Verify admin panel is accessible
- [ ] Test file uploads (if applicable)
- [ ] Set up automated backups
- [ ] Configure error monitoring (Sentry, etc.)
- [ ] Set up uptime monitoring
- [ ] Review application logs

## 📊 Functionality Testing

- [ ] User authentication (login/logout)
- [ ] Student CRUD operations
- [ ] Company CRUD operations
- [ ] Placement progress tracking
- [ ] Calendar/events functionality
- [ ] Search and filter features
- [ ] Admin panel access
- [ ] Password change functionality
- [ ] Profile updates
- [ ] API endpoints responding correctly

## 🔄 Maintenance Setup

- [ ] Database backup schedule configured
- [ ] Media files backup configured
- [ ] Log rotation configured
- [ ] Monitoring alerts set up
- [ ] Update procedure documented
- [ ] Rollback procedure documented
- [ ] Admin contact information documented

## 📝 Documentation

- [ ] README.md updated with production URL
- [ ] API documentation accessible
- [ ] User guide created (if needed)
- [ ] Admin guide created
- [ ] Deployment notes documented

## 🎯 Performance Optimization

- [ ] Database indexes verified
- [ ] Static files cached (Whitenoise/CDN)
- [ ] Frontend production build optimized
- [ ] Database connection pooling (if needed)
- [ ] Rate limiting configured (if needed)

---

## ⚡ Quick Deploy Commands

### Development (Local)
```bash
# Backend
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python manage.py runserver

# Frontend (new terminal)
cd frontend
npm start
```

### Production (Docker)
```bash
docker-compose up -d
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser
```

### Production (Manual)
```bash
./deploy.sh
```

---

## 🆘 Emergency Contacts & Resources

- **Documentation:** DEPLOYMENT.md, README.md
- **API Docs:** backend/API_DOCUMENTATION.md
- **Issue Tracker:** GitHub Issues
- **Support Email:** [Your email]

---

**Last Updated:** [Add date when deploying]
**Deployed By:** [Your name]
**Environment:** [Production/Staging]
**Version:** [Git commit hash or version number]
