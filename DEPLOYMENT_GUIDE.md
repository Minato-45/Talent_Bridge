# Deployment Guide - Job Listing Portal

This guide covers deploying the full-stack MERN application across multiple platforms.

## Architecture Overview

```bash
Frontend (React/Vite) → Netlify
Backend (Node.js/Express) → Render
Database (MongoDB) → MongoDB Atlas
```

---

## Part 1: Backend Setup (Render + MongoDB Atlas)

### Step 1: Set Up MongoDB Atlas (Free Tier)

1. **Create an account**
   - Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
   - Sign up with email or Google
   - Verify email address

2. **Create a free cluster**
   - Click "Create" → Select "M0 Free Tier"
   - Choose your preferred region (closest to your users)
   - Click "Create Cluster"
   - Wait 5-10 minutes for cluster to initialize

3. **Set up database user**
   - Go to "Database Access" (left sidebar)
   - Click "Add New Database User"
   - Enter username: `portal_user` (or any name)
   - Enter strong password (save this!)
   - Click "Add User"

4. **Create database**
   - Go to "Collections" tab
   - Click "Create Database"
   - Database Name: `job_listing_portal`
   - Collection Name: `jobs`
   - Click "Create"

5. **Get connection string**
   - Click "Databases" → "Connect"
   - Choose "Connect with the MongoDB shell" or "Drivers"
   - Copy the connection string
   - Replace `<username>` and `<password>` with your credentials
   - Example: `mongodb+srv://portal_user:PASSWORD@cluster.mongodb.net/job_listing_portal?retryWrites=true&w=majority`

### Step 2: Deploy Backend to Render

1. **Create a Render account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub (recommended) or email
   - Link your GitHub account

2. **Push backend to GitHub**

   ```powershell
   cd c:\Users\ramba\Downloads\Job_Listing_Portal
   git add .
   git commit -m "Setup Render deployment"
   git push origin main
   ```

3. **Deploy on Render**
   - Go to [dashboard.render.com](https://dashboard.render.com)
   - Click "+ New" → "Web Service"
   - Select "Deploy an existing repo" or connect your GitHub repo
   - Choose the `job-listing-portal` repository
   - Configure:
     - **Name**: `job-listing-portal-api`
     - **Root Directory**: `server`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Plan**: `Free` (with auto-sleep after 15 min inactivity)

4. **Add Environment Variables**
   - In the Render dashboard, go to **Environment** section
   - Add these variables:

   | Key | Value | Notes |
   | --- | --- | --- |
   | `NODE_ENV` | `production` | Required |
   | `PORT` | `10000` | Render default |
   | `MONGODB_URI` | Your MongoDB Atlas connection string | From Step 1.5 |
   | `JWT_SECRET` | Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` | ⚠️ Must be strong! |
   | `JWT_EXPIRE` | `7d` | Optional |
   | `CLIENT_URL` | Your Netlify frontend URL | e.g., `https://your-site.netlify.app` |
   | `FRONTEND_URL` | Your Netlify frontend URL | e.g., `https://your-site.netlify.app` |
   | `SMTP_HOST` | `smtp.gmail.com` | Optional (for email) |
   | `SMTP_PORT` | `587` | Optional |
   | `SMTP_USER` | Your Gmail | Optional |
   | `SMTP_PASS` | Your Gmail App Password | Optional |

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (2-3 minutes)
   - Once deployed, you'll get a URL like: `https://job-listing-portal-api.onrender.com`
   - **Copy this URL** - you'll need it for the frontend!

### Step 3: Handle File Uploads

**Important**: Render doesn't persist files across deployments. For production uploads, use cloud storage:

### Option A: Use AWS S3 (Recommended)

- Store user resumes and company logos in S3
- Update multer middleware to upload to S3
- [S3 Setup Guide](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/getting-started-browser.html)

### Option B: Use Cloudinary (Easier)


- Sign up at [cloudinary.com](https://cloudinary.com)
- Get API credentials
- Update upload middleware to use Cloudinary
- [Cloudinary Setup](https://cloudinary.com/documentation/node_integration)

**For now**, uploads will work locally but won't persist after redeploy. Files in `server/uploads/` are not backed up.

---

## Part 2: Frontend Setup (Netlify)

### Already Completed ✅

- Vite config optimized
- `.env.example` created
- `netlify.toml` configured
- API configuration made dynamic

### Deploy Frontend

1. **Update API URL**

   - In Netlify dashboard for your site
   - Go to **Site settings** → **Build & deploy** → **Environment**
   - Set `VITE_API_BASE_URL` to your Render backend URL:

     ```bash
     https://job-listing-portal-api.onrender.com/api
     ```

2. **Trigger deployment**

   - Redeploy the site:

     ```powershell
     cd client
     npm run build
     netlify deploy --prod
     ```

3. **Test connection**

   - Visit your Netlify site
   - Try to log in or load a job
   - Check browser console (F12) for API errors
   - Check Render logs for backend errors

---

## Part 3: Verification Checklist

### Backend Health Check

```bash
GET https://job-listing-portal-api.onrender.com/api/health
```

Should return: `{ "status": "ok", "timestamp": "..." }`

### Test API Connection

1. Open your Netlify frontend
1. Go to Network tab (F12 DevTools)
1. Attempt login
1. Verify API calls go to correct backend URL
1. Check for CORS errors

### Database Check

- MongoDB Atlas Dashboard → Collections
- Verify data is being saved (users, jobs, applications)

---

## Common Issues & Fixes

### ❌ CORS Error: Origin not allowed

- Update `CLIENT_URL` in Render environment to match your Netlify domain

### ❌ MongooseError: Cannot connect to MongoDB

- Verify MongoDB Atlas connection string is correct
- Check IP whitelist (MongoDB Atlas → Network Access)
- Add `0.0.0.0/0` to allow Render

### ❌ Cannot find module errors

- Render log shows missing package?
- Run: `npm install` locally first
- Commit `package-lock.json` to GitHub
- Redeploy on Render

### ❌ API calls work locally but fail on production

- Check `VITE_API_BASE_URL` is set in Netlify env vars
- Redeploy frontend after updating env vars
- Clear browser cache

### ❌ Render app keeps going to sleep

- Free tier auto-sleeps after 15 min. Upgrade to paid plan to keep always-on.

---

## Production Checklist

- [ ] MongoDB Atlas cluster created and running
- [ ] Backend deployed to Render with all env vars set
- [ ] Frontend deployed to Netlify

- [ ] `VITE_API_BASE_URL` points to Render backend
- [ ] `CLIENT_URL` in Render points to Netlify frontend
- [ ] CORS enabled correctly
- [ ] Health check endpoint responds (`/api/health`)
- [ ] Database user created with strong password
- [ ] JWT_SECRET is strong (32+ chars)
- [ ] Test login works end-to-end
- [ ] File uploads work (temporary in Render, consider S3 for production)

---

## Next Steps

1. Set up file uploads properly (Cloudinary or S3)
2. Configure email notifications (SMTP settings)
3. Add custom domain to Netlify
4. Set up SSL certificate (automatic on Netlify)
5. Monitor logs in Render dashboard
6. Set up error tracking (Sentry, LogRocket, etc.)
7. Upgrade Render plan if auto-sleep is an issue

---

## Useful Links

- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Netlify Documentation](https://docs.netlify.com/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8949)
- [CORS Troubleshooting](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
