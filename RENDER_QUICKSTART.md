# 🚀 Quick Deploy to Render - 10 Minutes

## Prerequisites
- GitHub account with your code pushed
- MongoDB Atlas free tier account

---

## Step 1: MongoDB Atlas Setup (3 minutes)

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas) → Sign up
2. Create cluster → Choose "M0 Free" → Select region
3. Wait for initialization
4. **Database Access** → Add user (save password!)
5. **Databases** → Create database: `job_listing_portal`
6. **Connect** → Get connection string
   - Copy the `mongodb+srv://...` URL
   - Replace `<username>:<password>` with your credentials

**Your connection string should look like:**
```
mongodb+srv://portal_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/job_listing_portal?retryWrites=true&w=majority
```

---

## Step 2: Deploy to Render (5 minutes)

1. Go to [render.com](https://render.com) → Sign up with GitHub
2. Click **"+ New"** → **"Web Service"**
3. Select your `job-listing-portal` repository
4. Fill in:
   - **Name**: `job-listing-portal-api`
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. Go to **Environment** tab and add these variables:

| Key | Value |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `MONGODB_URI` | _(paste your MongoDB Atlas connection string)_ |
| `JWT_SECRET` | _(generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)_ |
| `CLIENT_URL` | _(your Netlify frontend URL, add later)_ |

6. Click **"Create Web Service"** → Wait 2-3 minutes

**When done**, you'll see your backend URL: `https://job-listing-portal-api.onrender.com` ✅

---

## Step 3: Update Frontend (2 minutes)

1. In **Netlify dashboard** for your site
2. Go to **Site settings** → **Build & deploy** → **Environment**
3. Add variable:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://job-listing-portal-api.onrender.com/api`

4. Also update Render's `CLIENT_URL` to your Netlify domain (e.g., `https://your-site.netlify.app`)

5. Redeploy frontend:
   ```powershell
   cd client
   netlify deploy --prod
   ```

---

## ✅ Test It!

1. Visit your Netlify frontend
2. Try to **Register** and **Login**
3. If it works → **🎉 You're live!**
4. If it fails → Check console errors (F12)

---

## ⚠️ Important Notes

- **Render free tier**: App auto-sleeps after 15 min without traffic
  - Upgrade to paid ($7/month) to keep always-on
- **File uploads**: Won't persist on Render (use S3/Cloudinary for production)
- **MongoDB**: Atlas free tier allows 512 MB storage (plenty for testing)

---

## 🆘 Troubleshooting

| Error | Fix |
|---|---|
| CORS error | Update `CLIENT_URL` in Render env vars |
| Cannot connect to MongoDB | Check connection string, verify IP whitelist in Atlas |
| 502 Bad Gateway | Check Render logs, likely build or startup error |
| API calls fail in production | Ensure `VITE_API_BASE_URL` is set + site redeployed |

---

## 📚 Full Documentation

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed setup with file uploads, email, custom domains, etc.
