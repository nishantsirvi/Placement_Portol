#!/bin/bash

# Production deployment script for Placement Tracking System
# Run this script on your production server

set -e  # Exit on error

echo "🚀 Starting deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f backend/.env ]; then
    echo "${YELLOW}⚠️  .env file not found! Copying from .env.example...${NC}"
    cp backend/.env.example backend/.env
    echo "${YELLOW}⚠️  Please edit backend/.env with your production values before continuing!${NC}"
    exit 1
fi

echo "${GREEN}✓ Environment file found${NC}"

# Backend deployment
echo "📦 Installing backend dependencies..."
cd backend
pip install -r requirements.txt

echo "🗄️  Running database migrations..."
python manage.py migrate

echo "📊 Collecting static files..."
python manage.py collectstatic --noinput

echo "${GREEN}✓ Backend deployment complete${NC}"

# Frontend deployment
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm ci --only=production

echo "🏗️  Building frontend..."
npm run build

echo "${GREEN}✓ Frontend deployment complete${NC}"

echo ""
echo "${GREEN}🎉 Deployment successful!${NC}"
echo ""
echo "Next steps:"
echo "1. Create a superuser: python backend/manage.py createsuperuser"
echo "2. Start the backend: gunicorn placement_system.wsgi:application --bind 0.0.0.0:8000"
echo "3. Serve the frontend build folder with nginx or your web server"
echo ""
