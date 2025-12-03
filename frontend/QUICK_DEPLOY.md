# ⚡ Quick Deploy to Railway - 5 Minutes

## 🎯 Super Fast Deployment

Follow these 8 steps to deploy in under 5 minutes:

---

## Step 1: Open Railway
**Go to**: https://railway.app/new

---

## Step 2: Login with GitHub
- Click **"Login with GitHub"**
- Authorize Railway

---

## Step 3: Deploy from GitHub
- Click **"Deploy from GitHub repo"**
- Select: **`maanisingh/novoraplus-hospital-saas`**
- Click **"Deploy Now"**

---

## Step 4: Add Environment Variables
Click your service → **"Variables"** → Add these:

```
NEXT_PUBLIC_DIRECTUS_URL = [YOUR_BACKEND_RAILWAY_URL]
NEXT_PUBLIC_APP_NAME = NovoraPlus Hospital
NODE_ENV = production
PORT = 3000
NEXT_TELEMETRY_DISABLED = 1
```

**⚠️ Replace** `[YOUR_BACKEND_RAILWAY_URL]` with your actual backend URL!

---

## Step 5: Generate Domain
- Go to **"Settings"** tab
- Click **"Generate Domain"**
- Save the URL you get!

---

## Step 6: Update Backend CORS
Go to your **backend** Railway service and add/update:

```
FRONTEND_URL = [YOUR_FRONTEND_RAILWAY_URL]
CORS_ORIGIN = [YOUR_FRONTEND_RAILWAY_URL]
```

Then click **"Deploy"** to restart backend.

---

## Step 7: Wait for Build
- Go to **"Deployments"** tab
- Wait 3-5 minutes
- Look for ✅ **Success**

---

## Step 8: Test It!
Open your frontend URL and login:

**Super Admin**:
- Email: `superadmin@hospital.com`
- Password: `password123`

---

## ✅ Done!

Your Hospital SaaS is now live on Railway!

**Frontend**: `https://hospital-frontend-production-xxxx.up.railway.app`
**Backend**: `https://hospital-backend-production-xxxx.up.railway.app`

---

## 🚨 Troubleshooting

### Can't login?
- Check backend is running
- Verify `NEXT_PUBLIC_DIRECTUS_URL` is correct
- Check browser console for errors

### CORS errors?
- Verify backend `CORS_ORIGIN` includes frontend URL
- Restart backend service after updating CORS

### Build failed?
- Check logs in Railway dashboard
- Verify all files are committed to GitHub
- Try triggering rebuild

---

## 📖 Need More Details?

See the full guide: **RAILWAY_DEPLOYMENT_GUIDE.md**

---

**Repository**: https://github.com/maanisingh/novoraplus-hospital-saas
**Last Updated**: December 3, 2025
