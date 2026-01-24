# Render Deployment Setup Guide

## Problem
Render uses **ephemeral storage** - SQLite database files are deleted on every restart, causing loss of login credentials and data.

## Solution
Use **PostgreSQL** (persistent database) instead of SQLite on Render.

## Setup Steps

### 1. Create PostgreSQL Database on Render

1. Log in to your [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → Select **"PostgreSQL"**
3. Configure your database:
   - **Name**: `placement-tracking-db` (or any name you prefer)
   - **Database**: `placement_tracking` (default is fine)
   - **User**: Auto-generated
   - **Region**: Choose same region as your web service
   - **Plan**: Free tier (or paid if needed)
4. Click **"Create Database"**
5. Wait for database to be created (takes 1-2 minutes)

### 2. Link Database to Your Web Service

1. Go to your **Web Service** (backend) in Render Dashboard
2. Click on **"Environment"** tab
3. Add environment variable:
   - **Key**: `DATABASE_URL`
   - **Value**: Click **"Add from Database"** → Select your PostgreSQL database → Select **"Internal Database URL"**
4. Save Changes

### 3. Deploy Your Service

After linking the database, your service will automatically redeploy and:
- ✓ Run migrations automatically
- ✓ Create a default admin user (username: `admin`, password: `admin123`)
- ✓ Start the server

**Important**: Change the default admin password immediately after first login!

### 4. Verify Everything Works

1. Check the deployment logs - you should see:
   - "Running database migrations..."
   - "Superuser created: username=admin, password=admin123"
2. Visit your backend URL and login with:
   - **Username**: `admin`
   - **Password**: `admin123`
3. **IMPORTANT**: Change this password in your profile settings immediately!
4. Add some test data
5. Manually redeploy to verify data persists ✓

## For Free Tier Users (No Shell Access)

The setup above works perfectly for free tier! The `start.sh` script automatically:
- Runs all database migrations
- Creates a default admin account
- Starts the server

You don't need Shell access at all.

## What Changed in the Code

Updated [`backend/placement_system/settings.py`](backend/placement_system/settings.py):
- Added `dj_database_url` import
- Database configuration now checks for `DATABASE_URL` environment variable
- If `DATABASE_URL` exists (on Render), uses PostgreSQL
- If not (local development), falls back to SQLite

## Environment Variables on Render

Make sure you have these set:

| Variable | Value | Notes |
|----------|-------|-------|
| `DATABASE_URL` | (from database) | Automatically set when you link the database |
| `SECRET_KEY` | (your secret key) | Generate using: `python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'` |
| `DEBUG` | `False` | For production |
| `ALLOWED_HOSTS` | `your-app.onrender.com` | Your Render domain |
| `CORS_ALLOWED_ORIGINS` | `https://your-frontend.vercel.app` | Your frontend URL |

## Important Notes

- **Free tier databases sleep after 90 days of inactivity**
- Always use PostgreSQL for production (never SQLite)
- Local development can still use SQLite (no `DATABASE_URL` set)
- Database backups are automatic on paid plans

## Troubleshooting

**Issue**: Service won't start after adding database
- Check logs in Render dashboard
- Verify `DATABASE_URL` is set correctly
- Ensure `psycopg2-binary` is in requirements.txt ✓

**Issue**: Migration errors
- Clear build cache and redeploy
- Run `python manage.py migrate --run-syncdb` in Shell

**Issue**: Can't connect to database
- Use **Internal Database URL** (not External)
- Check database and web service are in same region

## Benefits of PostgreSQL

✓ **Persistent storage** - Data survives restarts  
✓ **Better performance** - Optimized for production  
✓ **Concurrent connections** - Multiple users at once  
✓ **Advanced features** - Full-text search, JSON support  
✓ **Backup support** - Automatic backups (paid plans)
