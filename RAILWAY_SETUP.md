# Hospital SaaS - Railway Deployment Guide

## Quick Deploy to Railway

### Step 1: Create Railway Project

1. Go to [Railway](https://railway.app)
2. Create a new project
3. Add services from this repo

### Step 2: Add PostgreSQL Database

1. Click **"+ New"** → **"Database"** → **"PostgreSQL"**
2. Railway will create the database and auto-inject `DATABASE_URL`

### Step 3: Add Redis (Optional but Recommended)

1. Click **"+ New"** → **"Database"** → **"Redis"**
2. Railway will auto-inject `REDIS_URL`

### Step 4: Deploy Directus Backend

1. Click **"+ New"** → **"GitHub Repo"**
2. Select this repo
3. Set **Root Directory**: `directus`
4. Add these environment variables:

```
KEY=generate-a-random-32-char-string
SECRET=generate-another-random-32-char-string
DB_CLIENT=pg
ADMIN_EMAIL=admin@yourhospital.com
ADMIN_PASSWORD=YourSecurePassword123!
CORS_ENABLED=true
CORS_ORIGIN=true
STORAGE_LOCATIONS=local
STORAGE_LOCAL_DRIVER=local
STORAGE_LOCAL_ROOT=/directus/uploads
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=7d
PORT=8055
```

5. Link PostgreSQL: Railway will auto-inject `DATABASE_URL`
6. Link Redis (if added): Set `REDIS=${{Redis.REDIS_URL}}`
7. Generate a domain or use Railway's default

### Step 5: Deploy Next.js Frontend

1. Click **"+ New"** → **"GitHub Repo"**
2. Select this repo
3. Set **Root Directory**: `frontend`
4. Add these environment variables:

```
NEXT_PUBLIC_DIRECTUS_URL=https://your-directus-domain.railway.app
```

5. Generate a domain

### Environment Variables Summary

#### Directus (Backend)
| Variable | Description |
|----------|-------------|
| `KEY` | Random 32+ char string for encryption |
| `SECRET` | Random 32+ char string for JWT |
| `DB_CLIENT` | `pg` for PostgreSQL |
| `DATABASE_URL` | Auto-injected by Railway PostgreSQL |
| `REDIS` | `${{Redis.REDIS_URL}}` if using Redis |
| `ADMIN_EMAIL` | Initial admin email |
| `ADMIN_PASSWORD` | Initial admin password |
| `CORS_ENABLED` | `true` |
| `CORS_ORIGIN` | `true` |
| `PORT` | `8055` |

#### Frontend (Next.js)
| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_DIRECTUS_URL` | URL to Directus backend |

### Post-Deployment Setup

1. Access Directus admin panel at your backend URL
2. Log in with ADMIN_EMAIL/ADMIN_PASSWORD
3. Create collections for: Organizations, Patients, Appointments, Staff, etc.
4. Set up roles and permissions

### Troubleshooting

**Database connection errors:**
- Ensure PostgreSQL is healthy
- Check `DATABASE_URL` is properly injected

**CORS errors:**
- Verify `CORS_ORIGIN=true` in Directus
- Check frontend URL matches

**Frontend can't connect:**
- Verify `NEXT_PUBLIC_DIRECTUS_URL` is correct
- Use HTTPS URLs in production
