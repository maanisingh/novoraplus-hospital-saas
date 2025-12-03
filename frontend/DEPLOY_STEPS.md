# 🚀 Hospital SaaS Frontend - Deploy in 8 Steps

## Before You Start

✅ Make sure your **backend is already deployed** on Railway
✅ Have your backend Railway URL ready

---

## Step 1: Open Railway

🔗 **Go to**: https://railway.app/new

![Railway Dashboard](https://railway.app/og.png)

Click **"Login with GitHub"** if not already logged in.

---

## Step 2: Deploy from GitHub

1. Click **"Deploy from GitHub repo"**
2. Find and select: **`maanisingh/novoraplus-hospital-saas`**
3. Click **"Deploy Now"**

Railway will automatically:
- ✅ Detect the Dockerfile
- ✅ Read railway.json configuration
- ✅ Start the build process

---

## Step 3: Configure Environment Variables

Once the service is created:

1. Click on your **service card** (will show as "novoraplus-hospital-saas")
2. Go to the **"Variables"** tab
3. Click **"+ New Variable"**
4. Add these **5 variables** one by one:

### Required Variables

```
Variable Name: NEXT_PUBLIC_DIRECTUS_URL
Value: [YOUR_BACKEND_RAILWAY_URL]
```

```
Variable Name: NEXT_PUBLIC_APP_NAME
Value: NovoraPlus Hospital
```

```
Variable Name: NODE_ENV
Value: production
```

```
Variable Name: PORT
Value: 3000
```

```
Variable Name: NEXT_TELEMETRY_DISABLED
Value: 1
```

**⚠️ IMPORTANT**: Replace `[YOUR_BACKEND_RAILWAY_URL]` with your actual backend URL!

Example:
```
NEXT_PUBLIC_DIRECTUS_URL = https://hospital-backend-production-a1b2.up.railway.app
```

---

## Step 4: Generate Public Domain

1. Still in your service, click the **"Settings"** tab
2. Scroll to the **"Networking"** section
3. Under **"Public Networking"**, click **"Generate Domain"**

Railway will give you a URL like:
```
https://hospital-frontend-production-xxxx.up.railway.app
```

**📝 SAVE THIS URL!** You'll need it in the next step.

---

## Step 5: Update Backend CORS

Now you need to tell your backend to accept requests from your frontend:

1. **Go to your backend Railway service**
2. Click on the **backend service card**
3. Go to **"Variables"** tab
4. Add or update these variables:

```
Variable Name: FRONTEND_URL
Value: [YOUR_FRONTEND_RAILWAY_URL]
```

```
Variable Name: CORS_ORIGIN
Value: [YOUR_FRONTEND_RAILWAY_URL]
```

Replace `[YOUR_FRONTEND_RAILWAY_URL]` with the URL from Step 4.

5. **Click "Deploy"** button to restart backend with new CORS settings

---

## Step 6: Wait for Deployment

Go back to your **frontend service**:

1. Click the **"Deployments"** tab
2. You'll see the build in progress
3. Wait 3-5 minutes for:
   - ⏳ Building Docker image
   - ⏳ Installing dependencies
   - ⏳ Building Next.js application
   - ⏳ Starting the server

4. Look for the **✅ Success** status

---

## Step 7: Test Your Deployment

Once you see ✅ Success:

1. **Click your frontend URL** (or copy/paste into browser)
2. You should see the **login page**
3. Try logging in with:

```
Email: superadmin@hospital.com
Password: password123
```

4. After login, you should see the **dashboard**

---

## Step 8: Verify Everything Works

Test these key features:

- [ ] ✅ Login page loads
- [ ] ✅ Can login with super admin
- [ ] ✅ Dashboard displays correctly
- [ ] ✅ Side navigation works
- [ ] ✅ Can navigate to different pages
- [ ] ✅ No errors in browser console (F12)

---

## 🎉 Deployment Complete!

Your Hospital SaaS frontend is now live on Railway!

**Your URLs**:
- Frontend: `https://hospital-frontend-production-xxxx.up.railway.app`
- Backend: `https://hospital-backend-production-xxxx.up.railway.app`

**Test Account**:
- Email: `superadmin@hospital.com`
- Password: `password123` (change this!)

---

## 🚨 Troubleshooting

### Problem: Can't login / CORS errors

**Solution**:
1. Verify backend `CORS_ORIGIN` includes your frontend URL
2. Make sure you clicked "Deploy" on backend after updating CORS
3. Check backend logs for CORS errors
4. Wait 1-2 minutes for backend to restart

### Problem: Build failed

**Solution**:
1. Check the build logs in Railway
2. Look for specific error messages
3. Verify all environment variables are set
4. Try clicking "Redeploy" button

### Problem: Login page shows but looks broken

**Solution**:
1. Clear browser cache (Ctrl+Shift+R / Cmd+Shift+R)
2. Check browser console for errors (F12)
3. Verify `NEXT_PUBLIC_DIRECTUS_URL` is correct
4. Test backend URL directly in browser

### Problem: "Backend not responding"

**Solution**:
1. Check backend is running (go to backend service in Railway)
2. Test backend health endpoint:
   ```
   curl https://your-backend-url/api/health
   ```
3. Verify backend environment variables
4. Check backend logs for errors

---

## 📝 Quick Reference

### All Environment Variables

**Frontend** (5 variables):
```
NEXT_PUBLIC_DIRECTUS_URL = https://hospital-backend-production-xxxx.up.railway.app
NEXT_PUBLIC_APP_NAME = NovoraPlus Hospital
NODE_ENV = production
PORT = 3000
NEXT_TELEMETRY_DISABLED = 1
```

**Backend CORS** (2 variables):
```
FRONTEND_URL = https://hospital-frontend-production-xxxx.up.railway.app
CORS_ORIGIN = https://hospital-frontend-production-xxxx.up.railway.app
```

### Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Super Admin | superadmin@hospital.com | password123 |
| Admin | admin@hospital.com | password123 |
| Doctor | doctor@hospital.com | password123 |
| Nurse | nurse@hospital.com | password123 |
| Receptionist | receptionist@hospital.com | password123 |

---

## 🔗 Useful Links

- **Railway Dashboard**: https://railway.app/dashboard
- **Railway Docs**: https://docs.railway.com
- **GitHub Repo**: https://github.com/maanisingh/novoraplus-hospital-saas
- **Backend Repo**: https://github.com/maanisingh/hospital-backend

---

## 📖 Need More Help?

- **Detailed Guide**: See `RAILWAY_DEPLOYMENT_GUIDE.md`
- **Backend Guide**: See `/root/hospital-backend/DEPLOY_NOW.md`
- **Railway Support**: https://discord.gg/railway

---

## ⏱️ Typical Deployment Timeline

| Step | Time | Status |
|------|------|--------|
| 1. Open Railway | 30 sec | ⚡ |
| 2. Select Repo | 1 min | ⚡ |
| 3. Add Variables | 2 min | ⚡ |
| 4. Generate Domain | 30 sec | ⚡ |
| 5. Update Backend CORS | 1 min | ⚡ |
| 6. Wait for Build | 3-5 min | ⏳ |
| 7. Test Deployment | 1 min | ⚡ |
| 8. Verify Features | 2 min | ⚡ |
| **Total** | **11-15 min** | ✅ |

---

## 🎯 Success Criteria

You'll know deployment was successful when:

✅ Railway shows "Active" status
✅ Login page loads without errors
✅ Can login with test account
✅ Dashboard displays correctly
✅ Can navigate between pages
✅ No console errors in browser
✅ Backend API calls work

---

## 🚀 You're Ready!

Follow these 8 steps and you'll have your Hospital SaaS frontend live in ~15 minutes!

**Start with Step 1**: https://railway.app/new

---

*Last Updated: December 3, 2025*
*Repository: https://github.com/maanisingh/novoraplus-hospital-saas*
*Estimated Time: 11-15 minutes*
