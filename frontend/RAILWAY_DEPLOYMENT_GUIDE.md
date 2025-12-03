# 🚀 Hospital SaaS Frontend - Railway Deployment Guide

## 📋 Overview

This guide will help you deploy the Hospital SaaS frontend (Next.js application) to Railway in under 10 minutes.

**Repository**: https://github.com/maanisingh/novoraplus-hospital-saas
**Tech Stack**: Next.js 16, React 19, TypeScript, Tailwind CSS
**Backend API**: Already deployed on Railway

---

## ✅ Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] GitHub account with access to the repository
- [ ] Railway account (free tier works fine)
- [ ] Backend API deployed and running on Railway
- [ ] Backend API URL (from your backend deployment)

---

## 🎯 Quick Deployment (5 Minutes)

### Step 1: Access Railway Dashboard
1. Open your browser and go to: **https://railway.app/new**
2. Click **"Login with GitHub"** if not already logged in
3. Authorize Railway to access your GitHub repositories

### Step 2: Select Repository
1. Click **"Deploy from GitHub repo"**
2. In the repository list, find and select: **`maanisingh/novoraplus-hospital-saas`**
3. Click **"Deploy Now"**

### Step 3: Configure Build Settings
Railway will automatically detect the Dockerfile and configuration. You don't need to change anything.

### Step 4: Add Environment Variables
1. Click on your newly created service
2. Go to the **"Variables"** tab
3. Click **"+ New Variable"** and add these environment variables:

```
NEXT_PUBLIC_DIRECTUS_URL = [Your Backend Railway URL]
NEXT_PUBLIC_APP_NAME = NovoraPlus Hospital
NODE_ENV = production
PORT = 3000
NEXT_TELEMETRY_DISABLED = 1
```

**Important**: Replace `[Your Backend Railway URL]` with your actual backend URL from the backend deployment (e.g., `https://hospital-backend-production-xxxx.up.railway.app`)

### Step 5: Generate Public Domain
1. In your frontend service, go to the **"Settings"** tab
2. Find the **"Networking"** section
3. Click **"Generate Domain"**
4. Railway will give you a URL like: `https://hospital-frontend-production-xxxx.up.railway.app`
5. **Save this URL!** This is your frontend URL.

### Step 6: Update Backend CORS Settings
**IMPORTANT**: You need to update your backend to allow requests from your frontend URL.

1. Go to your backend Railway service
2. Go to **"Variables"** tab
3. Update or add these variables:

```
FRONTEND_URL = https://hospital-frontend-production-xxxx.up.railway.app
CORS_ORIGIN = https://hospital-frontend-production-xxxx.up.railway.app
```

4. Click **"Deploy"** on the backend service to restart it with new CORS settings

### Step 7: Wait for Deployment
1. Go to the **"Deployments"** tab in your frontend service
2. Watch the build progress (takes 3-5 minutes)
3. Wait for the ✅ Success status

### Step 8: Test Your Deployment
Once deployment is complete, open your frontend URL and test:

1. Visit: `https://hospital-frontend-production-xxxx.up.railway.app`
2. You should see the login page
3. Try logging in with test credentials:
   - Email: `superadmin@hospital.com`
   - Password: `password123`

---

## 🔧 Detailed Configuration

### Environment Variables Explained

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `NEXT_PUBLIC_DIRECTUS_URL` | Backend API URL | `https://hospital-backend-production-xxxx.up.railway.app` |
| `NEXT_PUBLIC_APP_NAME` | Application name displayed in UI | `NovoraPlus Hospital` |
| `NODE_ENV` | Node environment | `production` |
| `PORT` | Port for Next.js server | `3000` |
| `NEXT_TELEMETRY_DISABLED` | Disable Next.js telemetry | `1` |

### Dockerfile Configuration

The project includes a multi-stage Dockerfile optimized for Railway:

**Features**:
- ✅ Multi-stage build for smaller image size
- ✅ Node.js 20 Alpine for minimal footprint
- ✅ Caching optimizations for faster builds
- ✅ Production-ready configuration
- ✅ Healthcheck support

### Railway.json Configuration

The `railway.json` file is pre-configured with:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile"
  },
  "deploy": {
    "startCommand": "npm run start",
    "restartPolicyType": "ON_FAILURE",
    "healthcheckPath": "/",
    "healthcheckTimeout": 100
  }
}
```

---

## 🔐 Default Test Users

After deployment, you can login with these test accounts:

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| Super Admin | superadmin@hospital.com | password123 | Full system access |
| Admin | admin@hospital.com | password123 | Hospital admin access |
| Doctor | doctor@hospital.com | password123 | Medical records, prescriptions |
| Nurse | nurse@hospital.com | password123 | Patient care, vitals |
| Receptionist | receptionist@hospital.com | password123 | Appointments, check-in |
| Pharmacist | pharmacist@hospital.com | password123 | Pharmacy, prescriptions |
| Lab Technician | labtech@hospital.com | password123 | Lab tests, results |
| Accountant | accountant@hospital.com | password123 | Billing, invoices |
| Patient | patient@hospital.com | password123 | Patient portal |

**⚠️ IMPORTANT**: Change all default passwords immediately after first login!

---

## 📊 Monitoring and Logs

### View Real-Time Logs
1. Go to your Railway project
2. Click on your frontend service
3. Go to **"Deployments"** tab
4. Click on the active deployment
5. View logs in real-time

### Check Metrics
1. Go to **"Metrics"** tab in your service
2. Monitor:
   - Request count
   - Response times
   - Error rates
   - Memory usage
   - CPU usage

### Set Up Alerts
1. Go to project **"Settings"**
2. Configure **"Notifications"**
3. Add webhook or email for:
   - Deployment failures
   - High error rates
   - Performance issues

---

## 🚨 Troubleshooting

### Build Failed

**Symptoms**: Build fails with npm or dependency errors

**Solutions**:
1. Check the build logs for specific errors
2. Verify all dependencies are in `package.json`
3. Ensure Node.js version compatibility (using Node 20)
4. Check for syntax errors in code

**Common fixes**:
```bash
# If build cache is corrupted, trigger rebuild
# Go to Railway service → Settings → Redeploy
```

### Frontend Loads But Can't Connect to Backend

**Symptoms**: Frontend shows but API calls fail with CORS errors

**Solutions**:
1. Verify `NEXT_PUBLIC_DIRECTUS_URL` is set correctly
2. Ensure backend `CORS_ORIGIN` includes frontend URL
3. Check backend is running and accessible
4. Verify backend CORS middleware is configured

**Quick test**:
```bash
# Test backend health
curl https://your-backend-url.up.railway.app/api/health

# Should return: {"status":"ok"}
```

### Login Not Working

**Symptoms**: Login page shows but authentication fails

**Possible causes**:
1. Backend URL is incorrect
2. Backend is not responding
3. CORS blocking requests
4. Test users not created in database

**Solutions**:
1. Check browser console for errors
2. Verify `NEXT_PUBLIC_DIRECTUS_URL` points to backend
3. Test backend login endpoint directly:
```bash
curl -X POST https://your-backend-url/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@hospital.com","password":"password123"}'
```

### 502 Bad Gateway

**Symptoms**: Frontend shows 502 error

**Possible causes**:
1. Next.js server crashed during startup
2. Port configuration issue
3. Memory limit exceeded

**Solutions**:
1. Check deployment logs for crash errors
2. Verify `PORT=3000` is set
3. Restart the service
4. Increase memory if needed (Railway settings)

### Slow Performance

**Symptoms**: Pages load slowly

**Solutions**:
1. Enable Railway caching
2. Optimize images (use Next.js Image component)
3. Enable static page generation where possible
4. Consider upgrading Railway plan for more resources

---

## 🔄 Continuous Deployment

Railway automatically deploys on every push to the `main` branch.

### Enable Auto-Deploy
1. Go to your service in Railway
2. Go to **"Settings"** tab
3. Find **"Deploy Triggers"**
4. Ensure **"Deploy on push"** is enabled

### Disable Auto-Deploy (if needed)
1. Go to service **"Settings"**
2. Find **"Deploy Triggers"**
3. Toggle off **"Deploy on push"**
4. Manual deploys only via Railway dashboard

### Deploy a Specific Branch
1. Go to service **"Settings"**
2. Find **"Source"** section
3. Change **"Branch"** to your desired branch
4. Click **"Save"**

---

## 🌐 Custom Domain (Optional)

Want to use your own domain? Follow these steps:

### Step 1: Add Domain in Railway
1. Go to your frontend service
2. Go to **"Settings"** tab
3. Find **"Domains"** section
4. Click **"+ Add Domain"**
5. Enter your domain (e.g., `hospital.yourdomain.com`)

### Step 2: Configure DNS
Add these DNS records at your domain provider:

**For subdomain (e.g., hospital.yourdomain.com)**:
```
Type: CNAME
Name: hospital
Value: [Railway provides this - copy from dashboard]
```

**For apex domain (e.g., yourdomain.com)**:
```
Type: A
Name: @
Value: [Railway provides this - copy from dashboard]
```

### Step 3: Wait for SSL
Railway automatically provisions SSL certificates. This takes 5-10 minutes.

### Step 4: Update Backend CORS
Update backend environment variables with your custom domain:
```
FRONTEND_URL = https://hospital.yourdomain.com
CORS_ORIGIN = https://hospital.yourdomain.com
```

---

## 💰 Railway Pricing

### Hobby Plan (Free Tier)
- ✅ $5 free credit per month
- ✅ Perfect for development/testing
- ✅ 500 hours execution time
- ✅ 1GB storage
- ✅ 100GB transfer

### Pro Plan
- 💎 $20/month base
- 💎 Pay-as-you-go for resources
- 💎 Unlimited execution time
- 💎 Custom domains
- 💎 Priority support
- 💎 Team collaboration

**Estimated Monthly Cost**:
- Development: **$0-5** (free tier)
- Production (low traffic): **$10-20**
- Production (medium traffic): **$20-40**
- Production (high traffic): **$40-80**

---

## 🔐 Security Best Practices

### After Deployment

1. **Change Default Passwords**
   - Login with each test account
   - Change password immediately
   - Use strong passwords (12+ characters)

2. **Review Permissions**
   - Verify role-based access is working
   - Test each role's permissions
   - Ensure users can only access their authorized sections

3. **Enable Security Headers**
   - Already configured in `next.config.ts`
   - Verify CSP headers if needed
   - Enable HSTS if using custom domain

4. **Monitor Access Logs**
   - Check Railway logs regularly
   - Set up alerts for suspicious activity
   - Monitor failed login attempts

5. **Environment Variables**
   - Never commit `.env` files
   - Keep sensitive data in Railway variables
   - Rotate secrets regularly

---

## 📈 Performance Optimization

### Already Implemented
- ✅ Multi-stage Docker build
- ✅ Production build optimization
- ✅ Next.js Image optimization
- ✅ Code splitting
- ✅ Cache control headers
- ✅ Minimal Alpine Linux image

### Additional Optimizations (Optional)
1. **Enable CDN**
   - Use Cloudflare in front of Railway
   - Cache static assets
   - Reduce latency globally

2. **Database Connection Pooling**
   - Already configured in backend
   - Monitor connection usage
   - Adjust pool size if needed

3. **Image Optimization**
   - Use Next.js Image component everywhere
   - Compress images before upload
   - Use WebP format when possible

4. **Lazy Loading**
   - Already implemented for routes
   - Consider for heavy components
   - Monitor bundle size

---

## 📞 Support and Resources

### Railway Resources
- **Dashboard**: https://railway.app/dashboard
- **Documentation**: https://docs.railway.com
- **Discord**: https://discord.gg/railway
- **Status Page**: https://status.railway.app
- **Pricing**: https://railway.app/pricing

### Project Resources
- **Frontend Repository**: https://github.com/maanisingh/novoraplus-hospital-saas
- **Backend Repository**: https://github.com/maanisingh/hospital-backend
- **Issues**: Report bugs on GitHub Issues

### Getting Help
1. **Railway Discord** - Fast community support
2. **GitHub Issues** - Project-specific problems
3. **Railway Docs** - Comprehensive guides
4. **Railway Support** - For billing/account issues

---

## ✅ Deployment Checklist

Use this checklist to ensure successful deployment:

- [ ] Railway account created
- [ ] GitHub repository access confirmed
- [ ] Backend API deployed and running
- [ ] Backend URL obtained
- [ ] Frontend deployed to Railway
- [ ] Environment variables configured
- [ ] Frontend domain generated
- [ ] Backend CORS updated with frontend URL
- [ ] Login page loads successfully
- [ ] Super admin login works
- [ ] Dashboard loads after login
- [ ] All main features accessible
- [ ] No console errors in browser
- [ ] Mobile responsive design works
- [ ] All test accounts work
- [ ] Default passwords changed
- [ ] Deployment logs reviewed
- [ ] Performance acceptable
- [ ] Monitoring set up

---

## 🎉 Post-Deployment

Once deployed successfully:

### 1. Share URLs
Save and share these URLs with your team:

```
Frontend: https://hospital-frontend-production-xxxx.up.railway.app
Backend: https://hospital-backend-production-xxxx.up.railway.app
Railway Dashboard: https://railway.app/dashboard
```

### 2. Create Documentation
Document your deployment:
- URLs and credentials
- Environment variables
- Custom configurations
- Known issues or limitations

### 3. Set Up Backups
- Railway PostgreSQL has automatic backups
- Consider additional backup strategy
- Test restore procedure

### 4. Plan for Scaling
- Monitor usage and costs
- Plan for traffic growth
- Consider upgrading Railway plan if needed

### 5. Training
- Train team on the platform
- Provide access credentials
- Create user guides if needed

---

## 🚀 You're All Set!

Your Hospital SaaS frontend should now be:
- ✅ Deployed on Railway
- ✅ Connected to backend API
- ✅ Accessible via public URL
- ✅ Ready for use and testing

**Quick Links**:
- Backend API: `https://hospital-backend-production-xxxx.up.railway.app`
- Frontend App: `https://hospital-frontend-production-xxxx.up.railway.app`
- Railway Dashboard: https://railway.app/dashboard

**Default Super Admin**:
- Email: `superadmin@hospital.com`
- Password: `password123` (change immediately!)

---

## 📝 Next Steps

1. **Test all features** with different user roles
2. **Change all default passwords** immediately
3. **Configure custom domain** (optional)
4. **Set up monitoring and alerts**
5. **Train your team** on the platform
6. **Plan for production launch**
7. **Set up regular backups**
8. **Monitor costs and usage**

---

*Last Updated: December 3, 2025*
*Repository: https://github.com/maanisingh/novoraplus-hospital-saas*
*Deployment Platform: Railway (https://railway.app)*
*Tech Stack: Next.js 16, React 19, TypeScript, Tailwind CSS*
