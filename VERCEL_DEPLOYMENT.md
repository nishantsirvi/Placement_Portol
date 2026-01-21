# Vercel Deployment Guide - Frontend Only

## 🚀 Deploy Frontend to Vercel (FREE)

### Prerequisites
- GitHub account
- Vercel account (sign up at https://vercel.com)
- Backend deployed elsewhere (Railway/Render recommended)

---

## Step 1: Deploy Backend First

### Option A: Railway (Recommended - Free Tier)
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Select `backend` folder as root
6. Add PostgreSQL database (click "New" → "Database" → "Add PostgreSQL")
7. Add environment variables:
   ```
   SECRET_KEY=<generate new key>
   DEBUG=False
   ALLOWED_HOSTS=${{RAILWAY_PUBLIC_DOMAIN}}
   DATABASE_URL=${{DATABASE_URL}}
   CORS_ALLOWED_ORIGINS=https://your-app.vercel.app
   ```
8. Deploy will start automatically
9. Note your backend URL (e.g., `https://your-app.up.railway.app`)

### Option B: Render (Free Tier)
1. Go to https://render.com
2. Sign up with GitHub
3. Click "New" → "Web Service"
4. Connect repository → Select backend folder
5. Configure:
   - **Build Command:** `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate`
   - **Start Command:** `gunicorn placement_system.wsgi:application`
6. Add PostgreSQL database (Free tier available)
7. Add environment variables (same as above)
8. Note your backend URL (e.g., `https://your-app.onrender.com`)

---

## Step 2: Deploy Frontend to Vercel

### Via Vercel Dashboard (Easiest)

1. **Push to GitHub** (if not already):
   ```bash
   git add .
   git commit -m "Add Vercel config"
   git push origin main
   ```

2. **Go to Vercel**:
   - Visit https://vercel.com
   - Click "Add New" → "Project"
   - Import your GitHub repository

3. **Configure Build Settings**:
   - **Framework Preset:** Create React App
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build` (default, should auto-detect)
   - **Output Directory:** `build` (default, should auto-detect)
   - **Install Command:** `npm install` (default)

4. **Add Environment Variable**:
   - Click "Environment Variables"
   - Add:
     ```
     Name: REACT_APP_API_URL
     Value: https://your-backend-url.railway.app/api
     ```
   - Make sure to use your actual backend URL from Step 1!

5. **Deploy**:
   - Click "Deploy"
   - Wait 1-2 minutes
   - Your app will be live at `https://your-app.vercel.app`

### Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Go to frontend directory
cd frontend

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: placement-tracker-frontend
# - Directory: ./
# - Override settings? Yes
# - Build Command: npm run build
# - Output Directory: build
# - Development Command: npm start

# Set environment variable
vercel env add REACT_APP_API_URL production
# Enter your backend URL: https://your-backend-url.railway.app/api

# Deploy to production
vercel --prod
```

---

## Step 3: Configure CORS on Backend

After deploying, update your backend's CORS settings to allow your Vercel domain.

**On Railway/Render**, add/update environment variable:
```
CORS_ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-app-*.vercel.app
```

The `*` wildcard allows preview deployments.

---

## Step 4: Test Deployment

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Try logging in
3. Check browser console for errors
4. Verify API calls are going to your backend URL

---

## 🎯 FREE Tier Limits

### Vercel (Frontend)
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Custom domains
- ⚠️ 100GB bandwidth/month (generous)

### Railway (Backend) - Hobby Plan
- ✅ $5 free credit/month (~500 hours)
- ✅ PostgreSQL included
- ✅ Automatic HTTPS
- ⚠️ Sleeps after inactivity (wakes on request)

### Render (Backend) - Free Tier
- ✅ 750 hours/month free
- ✅ PostgreSQL included (90 days, then paid)
- ✅ Automatic HTTPS
- ⚠️ Spins down after 15 min inactivity
- ⚠️ Slower cold starts

---

## 🔧 Troubleshooting

### CORS Errors
- Verify `REACT_APP_API_URL` is correct
- Check backend `CORS_ALLOWED_ORIGINS` includes Vercel domain
- Don't forget the `/api` at the end of the URL

### Build Fails on Vercel
- Check Node version: Add `engines` to package.json:
  ```json
  "engines": {
    "node": "18.x"
  }
  ```
- Clear build cache: Vercel Dashboard → Settings → Clear Cache

### Backend Connection Fails
- Verify backend is running (visit backend URL directly)
- Check environment variables in Vercel
- Look at Network tab in browser DevTools

### 502/504 Errors
- Backend might be sleeping (free tier)
- Wait a few seconds and retry
- Consider upgrading backend to paid tier for always-on

---

## 🚀 Automatic Deployments

Both Vercel and Railway/Render support automatic deployments:

- **Push to `main` branch** → Production deployment
- **Push to other branches** → Preview deployment
- **Pull Requests** → Preview deployment with unique URL

---

## 💡 Pro Tips

1. **Custom Domain** (Free on Vercel):
   - Vercel Dashboard → Project → Settings → Domains
   - Add your domain and update DNS

2. **Environment Variables by Branch**:
   - Use different backend URLs for preview vs production
   - Vercel Dashboard → Settings → Environment Variables

3. **Performance**:
   - Vercel automatically optimizes images and static assets
   - Enable compression in backend (Whitenoise handles this)

4. **Monitoring**:
   - Vercel Analytics (free basic tier)
   - Railway/Render provide logs and metrics

---

## 📊 Cost Estimate

**Completely FREE setup:**
- Frontend (Vercel): $0/month
- Backend (Railway Hobby): $0/month (with $5 credit)
- Database (included): $0/month
- **Total: $0/month** ✅

**Production-ready setup (~$12/month):**
- Frontend (Vercel Pro): $20/month (optional, for team features)
- Backend (Railway): $5-10/month (always-on)
- Database (included): $0
- **Total: ~$5-10/month** for small traffic

---

## ✅ Deployment Checklist

- [ ] Backend deployed to Railway/Render
- [ ] Backend URL noted
- [ ] PostgreSQL database created
- [ ] Backend environment variables configured
- [ ] Backend migrations run
- [ ] Backend superuser created
- [ ] Frontend pushed to GitHub
- [ ] Vercel project created
- [ ] `REACT_APP_API_URL` environment variable set
- [ ] Frontend deployed successfully
- [ ] CORS configured on backend with Vercel domain
- [ ] Login tested
- [ ] API calls working
- [ ] Custom domain added (optional)

---

**🎉 Your app is now live for FREE!**

Frontend: https://your-app.vercel.app  
Backend: https://your-app.railway.app or https://your-app.onrender.com
