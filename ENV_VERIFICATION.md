# Environment Variables Verification

## ✅ Required Environment Variables

### Critical (Must Have for Core Functionality)

| Variable | Purpose | Status Check |
|----------|---------|--------------|
| `NEXTAUTH_SECRET` | NextAuth JWT sessions | Generate: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | NextAuth callback URL | Should be `https://www.buildwithai.digital` |
| `DATABASE_URL` | Database connection (optional) | PostgreSQL with `?sslmode=verify-full` |
| `ADMIN_SECRET` | Admin dashboard access | Your custom secret |
| `GROQ_API_KEY` | MARZ AI assistant | From https://console.groq.com |

### For MARZ AI (Optional but Recommended)

| Variable | Purpose | Where to Get |
|----------|---------|--------------|
| `UPSTASH_VECTOR_REST_URL` | Vector DB for semantic search | https://upstash.com |
| `UPSTASH_VECTOR_REST_TOKEN` | Vector DB token | https://upstash.com |

### For OAuth Login (Optional)

| Variable | Purpose | Where to Get |
|----------|---------|--------------|
| `GITHUB_ID` | GitHub OAuth login | https://github.com/settings/developers |
| `GITHUB_SECRET` | GitHub OAuth secret | https://github.com/settings/developers |
| `GOOGLE_CLIENT_ID` | Google OAuth login | https://console.cloud.google.com/apis/credentials |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | https://console.cloud.google.com/apis/credentials |

### For Domain Services (Optional)

| Variable | Purpose |
|----------|---------|
| `OPENPROVIDER_BASE_URL` | Domain registrar API |
| `OPENPROVIDER_USERNAME` | OpenProvider username |
| `OPENPROVIDER_PASSWORD` | OpenProvider password |

### For Payments (Optional)

| Variable | Purpose |
|----------|---------|
| `STRIPE_SECRET_KEY` | Stripe payments |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook verification |

---

## 🚀 Vercel Environment Variables

**IMPORTANT:** `.env.local` is ONLY for local development. For production, you MUST add these to Vercel:

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Add each variable from the table above
3. Click **Save**
4. **Redeploy** the project for changes to take effect

---

## ✅ Verification Checklist

### NextAuth (Fixes 500 errors)
- [ ] `NEXTAUTH_SECRET` is set (32+ characters, base64)
- [ ] `NEXTAUTH_URL` matches your domain
- [ ] `DATABASE_URL` is set (optional, for database sessions)

### MARZ AI (Fixes chat errors)
- [ ] `GROQ_API_KEY` starts with `gsk_`
- [ ] `UPSTASH_VECTOR_REST_URL` starts with `https://`
- [ ] `UPSTASH_VECTOR_REST_TOKEN` is set

### Admin Dashboard
- [ ] `ADMIN_SECRET` is set (your custom password)

### OAuth (Optional)
- [ ] `GITHUB_ID` is 20+ characters
- [ ] `GITHUB_SECRET` is 40+ characters
- [ ] `GOOGLE_CLIENT_ID` ends with `.apps.googleusercontent.com`
- [ ] `GOOGLE_CLIENT_SECRET` is 24+ characters

---

## 🧪 Test After Deployment

1. **Test MARZ Chat:**
   - Open https://www.buildwithai.digital
   - Click MARZ floating button
   - Type "Hello"
   - Should get a response (not 500 error)

2. **Test Admin Dashboard:**
   - Go to https://www.buildwithai.digital/admin/dashboard
   - Enter your `ADMIN_SECRET`
   - Should access dashboard

3. **Test OAuth (if configured):**
   - Go to /login
   - Should see "Continue with GitHub/Google" buttons
   - Click and verify login works

4. **Check Console:**
   - Open browser DevTools (F12)
   - Check for errors in Console tab
   - Should see no 500 errors

---

## 🔧 Quick Fix Commands

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

**Test locally:**
```bash
npm run dev
```

**Deploy to Vercel:**
```bash
git push origin main
```

---

## ⚠️ Common Issues

### "500 Internal Server Error" on /api/auth/session
**Cause:** Missing `NEXTAUTH_SECRET`
**Fix:** Add to Vercel Environment Variables

### MARZ responds with "GROQ_API_KEY not configured"
**Cause:** Missing `GROQ_API_KEY`
**Fix:** Get key from https://console.groq.com and add to Vercel

### "Failed to load providers" on login page
**Cause:** OAuth credentials missing (normal if not using OAuth)
**Fix:** Either add OAuth credentials or use admin secret login

### Admin dashboard redirects to login
**Cause:** `ADMIN_SECRET` not set or mismatched
**Fix:** Ensure same secret in `.env.local` and Vercel

---

## 📋 Summary

**Minimum Required for Basic Functionality:**
```env
NEXTAUTH_SECRET=your-generated-secret
ADMIN_SECRET=your-admin-password
GROQ_API_KEY=gsk_...
```

**For Full Features:**
```env
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://www.buildwithai.digital
DATABASE_URL=postgresql://...
ADMIN_SECRET=...
GROQ_API_KEY=gsk_...
UPSTASH_VECTOR_REST_URL=https://...
UPSTASH_VECTOR_REST_TOKEN=...
GITHUB_ID=...
GITHUB_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

**Remember:** After adding variables to Vercel, you MUST redeploy for them to take effect!
