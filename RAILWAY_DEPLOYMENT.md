# Hospital SAAS - Railway Deployment Guide

## Services Required on Railway

You need to create **4 services** on Railway:

### 1. PostgreSQL Database
- **Type**: Railway Template → PostgreSQL
- **Name**: `hospital-postgres`
- **Variables automatically created**:
  - `DATABASE_URL`
  - `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`

### 2. Redis (for Directus caching)
- **Type**: Railway Template → Redis
- **Name**: `hospital-redis`
- **Variables automatically created**:
  - `REDIS_URL`

### 3. Directus Backend
- **Type**: Docker Image
- **Image**: `directus/directus:11`
- **Name**: `hospital-directus`
- **Environment Variables**:
  ```
  KEY=<generate-random-256-bit-key>
  SECRET=<generate-random-256-bit-key>
  ADMIN_EMAIL=superadmin@novoraplus.com
  ADMIN_PASSWORD=Admin123!

  # Database connection (use Railway's reference)
  DB_CLIENT=pg
  DB_HOST=${{hospital-postgres.PGHOST}}
  DB_PORT=${{hospital-postgres.PGPORT}}
  DB_DATABASE=${{hospital-postgres.PGDATABASE}}
  DB_USER=${{hospital-postgres.PGUSER}}
  DB_PASSWORD=${{hospital-postgres.PGPASSWORD}}

  # Redis caching
  CACHE_ENABLED=true
  CACHE_STORE=redis
  CACHE_REDIS=${{hospital-redis.REDIS_URL}}

  # CORS
  CORS_ENABLED=true
  CORS_ORIGIN=*

  # Public URL (update after deployment)
  PUBLIC_URL=https://your-directus-url.railway.app
  ```

### 4. Next.js Frontend
- **Type**: GitHub Repository
- **Repository**: `https://github.com/maanisingh/novoraplus-hospital-saas.git`
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`
- **Name**: `hospital-frontend`
- **Environment Variables**:
  ```
  NEXT_PUBLIC_DIRECTUS_URL=${{hospital-directus.RAILWAY_PUBLIC_DOMAIN}}
  ```

---

## Step-by-Step Deployment

### Step 1: Create New Project
1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click **New Project**
3. Select **Empty Project**

### Step 2: Add PostgreSQL
1. Click **+ New** → **Database** → **Add PostgreSQL**
2. Wait for provisioning
3. Note the connection details

### Step 3: Add Redis
1. Click **+ New** → **Database** → **Add Redis**
2. Wait for provisioning

### Step 4: Add Directus
1. Click **+ New** → **Docker Image**
2. Enter: `directus/directus:11`
3. Add all environment variables listed above
4. Generate domain under Settings → Domains
5. Note the public URL

### Step 5: Add Frontend
1. Click **+ New** → **GitHub Repo**
2. Connect GitHub and select the repository
3. Set Root Directory: `frontend`
4. Add environment variable:
   ```
   NEXT_PUBLIC_DIRECTUS_URL=https://hospital-directus-xxx.up.railway.app
   ```
5. Generate domain under Settings → Domains

---

## Post-Deployment Setup

### 1. Initialize Database Schema
After Directus is running, connect to the PostgreSQL service and run:
```sql
-- Run the SQL files in /scripts/ folder:
-- 1. create_master_data_tables.sql
-- 2. seed_master_data.sql
```

### 2. Configure Directus Collections
1. Access Directus Admin: `https://your-directus-url.railway.app/admin`
2. Login with admin credentials
3. Go to Settings → Data Model
4. For each collection (patients, opd_tokens, etc.), configure:
   - Display template
   - Sort field
   - Archive settings

### 3. Set Up Permissions
1. Go to Settings → Access Control
2. Configure role-based access for:
   - Administrator (full access)
   - Hospital Admin (org-specific access)
   - Doctor, Nurse, Receptionist roles

---

## Environment Variables Reference

### Frontend (.env)
```env
NEXT_PUBLIC_DIRECTUS_URL=https://your-directus-url.railway.app
```

### Directus
```env
KEY=<256-bit-random-key>
SECRET=<256-bit-random-key>
DB_CLIENT=pg
DB_HOST=<postgres-host>
DB_PORT=5432
DB_DATABASE=railway
DB_USER=postgres
DB_PASSWORD=<postgres-password>
CACHE_ENABLED=true
CACHE_STORE=redis
CACHE_REDIS=<redis-url>
CORS_ENABLED=true
CORS_ORIGIN=*
PUBLIC_URL=https://your-directus-url.railway.app
ADMIN_EMAIL=superadmin@novoraplus.com
ADMIN_PASSWORD=Admin123!
```

---

## Custom Domain Setup (Optional)

1. In Railway, go to your service → Settings → Domains
2. Click **+ Custom Domain**
3. Enter your domain (e.g., `hospital.yourdomain.com`)
4. Add the CNAME record to your DNS provider
5. Wait for SSL certificate provisioning

---

## Estimated Costs

Railway pricing is usage-based:
- **Hobby Plan**: $5/month (includes $5 credit)
- **Pro Plan**: $20/month (better for production)

Estimated usage for Hospital SAAS:
- PostgreSQL: ~$5-10/month
- Redis: ~$2-5/month
- Directus: ~$5-10/month
- Frontend: ~$5-10/month

**Total: ~$15-35/month** depending on traffic

---

## Troubleshooting

### Directus Not Starting
- Check environment variables are correct
- Ensure PostgreSQL is running first
- Check logs in Railway dashboard

### Frontend Can't Connect to Backend
- Verify `NEXT_PUBLIC_DIRECTUS_URL` is correct
- Check CORS settings in Directus
- Ensure Directus domain is public

### Database Connection Issues
- Verify PostgreSQL connection string
- Check if database is fully provisioned
- Look for connection timeout in logs
