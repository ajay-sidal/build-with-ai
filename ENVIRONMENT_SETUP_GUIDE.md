# 🔧 ENVIRONMENT SETUP GUIDE

## Quick Start - Required Environment Variables

To fix the 404 and 500 errors you're seeing, you need to configure these environment variables in Vercel.

### ⚠️ CRITICAL: Fix 500 Errors (Authentication)

These variables are **REQUIRED** to fix the `/api/auth/session:1 Failed to load resource: the server responded with a status of 500` error:

```bash
# 1. Generate NEXTAUTH_SECRET (run this command locally)
openssl rand -base64 32

# Copy the output and add it to Vercel
```

**Steps to configure in Vercel:**
1. Go to https://vercel.com/dashboard
2. Select your project: `build-with-ai`
3. Click **Settings** → **Environment Variables**
4. Click **Add New**
5. Add these variables:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `NEXTAUTH_SECRET` | (output from `openssl rand -base64 32`) | Production, Preview, Development |
| `NEXTAUTH_URL` | `https://www.buildwithai.digital` | Production |
| `NEXTAUTH_URL` | `https://build-with-ai-git-main.vercel.app` | Preview |
| `NEXTAUTH_URL` | `http://localhost:3000` | Development |
| `ADMIN_SECRET` | `your-secure-password-here` | Production, Preview, Development |

6. Click **Save**
7. **Redeploy** the project (Settings → Deployments → Redeploy)

---

### 📊 OPTIONAL: Enable Additional Features

#### Database (For User Sessions & Orders)
```bash
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=verify-full
```

**Recommended:** Use [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) or [Neon](https://neon.tech)

#### Stripe (For Payments)
```bash
STRIPE_SECRET_KEY=sk_test_...  # or sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Get keys:** https://dashboard.stripe.com/apikeys

#### OpenProvider (For Domain Services)
```bash
OPENPROVIDER_USERNAME=your-username
OPENPROVIDER_PASSWORD=your-password
OPENPROVIDER_BASE_URL=https://api.openprovider.eu/v1beta/
```

**Get credentials:** https://www.openprovider.com

#### OAuth Login (Google & GitHub)

**Google OAuth:**
```bash
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-secret
```

**Setup:** https://console.cloud.google.com/apis/credentials

**GitHub OAuth:**
```bash
GITHUB_ID=your-client-id
GITHUB_SECRET=your-secret
```

**Setup:** https://github.com/settings/developers

#### MARZ AI Assistant
```bash
GROQ_API_KEY=gsk_...
UPSTASH_VECTOR_REST_URL=https://...
UPSTASH_VECTOR_REST_TOKEN=...
```

**Get Groq key:** https://console.groq.com/keys  
**Get Upstash:** https://upstash.com

---

## 🚀 AFTER CONFIGURING ENVIRONMENT VARIABLES

### 1. Redeploy to Vercel

```bash
# Push to trigger automatic deployment
git push origin main

# OR deploy manually
npx vercel --prod
```

### 2. Clear Browser Cache

The 404 errors might be cached in Chrome. Clear them:

1. Open Chrome DevTools (F12)
2. Right-click the **Reload** button
3. Select **"Empty Cache and Hard Reload"**

OR:

1. Go to `chrome://settings/clearBrowserData`
2. Select **Cached images and files**
3. Click **Clear data**

### 3. Verify Fix

Visit these URLs to verify the errors are gone:

- ✅ https://www.buildwithai.digital/ (should load without 404)
- ✅ https://www.buildwithai.digital/login (should work)
- ✅ https://www.buildwithai.digital/signup (should work)
- ✅ https://www.buildwithai.digital/products (should work)

---

## 🐛 TROUBLESHOOTING

### Still Getting 500 Errors?

**Check Vercel Logs:**
1. Go to Vercel Dashboard
2. Click your project
3. Click **Deployments**
4. Click the latest deployment
5. Click **Functions** tab
6. Look for errors in `/api/auth/session` or `/api/auth/_log`

**Common Issues:**

1. **NEXTAUTH_SECRET not set:**
   ```
   Error: NEXTAUTH_SECRET environment variable is required
   ```
   **Fix:** Add `NEXTAUTH_SECRET` to Vercel environment variables

2. **Database connection failed:**
   ```
   Error: Can't reach database server
   ```
   **Fix:** Check `DATABASE_URL` format and credentials

3. **Invalid secret format:**
   ```
   Error: Invalid NEXTAUTH_SECRET format
   ```
   **Fix:** Regenerate with `openssl rand -base64 32`

### Still Getting 404 Errors?

**Check:**
1. The page exists in `src/app/` directory
2. The route is correctly spelled in the URL
3. Vercel deployment completed successfully

**Clear Vercel Cache:**
1. Go to Vercel Dashboard
2. Click your project
3. Click **Settings** → **Deployment**
4. Under **Build & Development Settings**, click **Redeploy**
5. Check **"Use existing Build Cache"** = OFF
6. Click **Redeploy**

---

## ✅ VERIFICATION CHECKLIST

After configuring environment variables:

- [ ] `NEXTAUTH_SECRET` added to Vercel (32+ characters, base64)
- [ ] `NEXTAUTH_URL` added to Vercel
- [ ] `ADMIN_SECRET` added to Vercel
- [ ] Redeployed to Vercel
- [ ] Cleared browser cache
- [ ] Tested https://www.buildwithai.digital/ (no 404)
- [ ] Tested https://www.buildwithai.digital/login (no 500)
- [ ] Checked Vercel logs for errors

---

## 📞 NEED HELP?

**Vercel Documentation:**
- Environment Variables: https://vercel.com/docs/concepts/projects/environment-variables
- Next.js Errors: https://nextjs.org/docs/messages

**NextAuth Documentation:**
- Configuration: https://next-auth.js.org/configuration/options
- Errors: https://next-auth.js.org/errors

**Contact:**
- Check Vercel logs for detailed error messages
- Review browser console (F12) for client-side errors

---

**Last Updated:** February 24, 2026  
**Status:** ✅ Production Ready (after environment configuration)
