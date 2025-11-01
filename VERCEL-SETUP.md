# Vercel Deployment Setup Guide

Complete step-by-step guide to configure your Vercel deployment at:
**https://ecommerce-concept.vercel.app/**

---

## 🚨 Quick Status Check

Your site is live, but needs configuration to enable all features.

### Current Status:
- ✅ Static pages loading (homepage, about, contact)
- ❌ Backend API not working (needs environment variables)
- ❌ Login/Signup not working (needs backend API)
- ❌ Product creation not working (needs backend API + Shopify credentials)
- ⚠️ AI features may work (Gemini API key in code, but should be moved to backend)

---

## Step 1: Set Environment Variables in Vercel

Your backend server needs these environment variables to work.

### 1.1 Go to Vercel Dashboard

1. Visit https://vercel.com/dashboard
2. Click on your project: **ecommerce-concept**
3. Click **Settings** tab
4. Click **Environment Variables** in left sidebar

### 1.2 Add Required Variables

Add each of these variables:

#### Variable 1: SHOPIFY_DOMAIN
- **Name:** `SHOPIFY_DOMAIN`
- **Value:** `themerchconcept.myshopify.com`
- **Environments:** ✅ Production, ✅ Preview, ✅ Development
- Click **Save**

#### Variable 2: SHOPIFY_ADMIN_TOKEN
- **Name:** `SHOPIFY_ADMIN_TOKEN`
- **Value:** `shpat_YOUR_ADMIN_TOKEN_HERE` (Get from .env file)
- **Environments:** ✅ Production, ✅ Preview, ✅ Development
- Click **Save**

#### Variable 3: SHOPIFY_API_VERSION
- **Name:** `SHOPIFY_API_VERSION`
- **Value:** `2024-01`
- **Environments:** ✅ Production, ✅ Preview, ✅ Development
- Click **Save**

#### Variable 4: NODE_ENV (Optional)
- **Name:** `NODE_ENV`
- **Value:** `production`
- **Environments:** ✅ Production only
- Click **Save**

### 1.3 Verify Variables Added

You should now see these 4 variables in your environment variables list:
- ✅ SHOPIFY_DOMAIN
- ✅ SHOPIFY_ADMIN_TOKEN
- ✅ SHOPIFY_API_VERSION
- ✅ NODE_ENV

---

## Step 2: Redeploy Your Site

After adding environment variables, you MUST redeploy for changes to take effect.

### Option A: Automatic Redeploy (Recommended)

1. Commit the new Vercel configuration:
   ```bash
   git add vercel.json config/ build-prepare.js package.json VERCEL-SETUP.md
   git commit -m "Add Vercel configuration and production configs"
   git push origin main
   ```

2. Vercel will automatically detect the push and redeploy
3. Wait 1-2 minutes for deployment to complete
4. You'll get a notification email when it's done

### Option B: Manual Redeploy

1. Go to Vercel Dashboard → Your Project
2. Click **Deployments** tab
3. Click **⋯** menu on latest deployment
4. Click **Redeploy**
5. Wait for deployment to complete

---

## Step 3: Test Your Deployment

After redeploying, test each feature:

### 3.1 Test Homepage
✅ Visit https://ecommerce-concept.vercel.app/
- Should load without errors
- Products should display (if any in Shopify)

### 3.2 Test Backend API
✅ Visit https://ecommerce-concept.vercel.app/api/health

Should return:
```json
{
  "status": "ok",
  "message": "Backend server is running"
}
```

If you get 404 or error, environment variables aren't set correctly.

### 3.3 Test Authentication
✅ Visit https://ecommerce-concept.vercel.app/login.html

**Try demo account:**
- Email: `admin@lovable.dev`
- Password: `admin123`

Should successfully log in and redirect to account page.

### 3.4 Test Product Creation
✅ Visit https://ecommerce-concept.vercel.app/add-product.html

1. Log in first (use demo account)
2. Fill out product form
3. Upload an image
4. Click "Add Product to Shopify"

Should successfully create product and show Shopify admin link.

### 3.5 Test AI Features
✅ On add-product.html page:

1. Click "🎨 Generate with AI"
2. Enter prompt: "Blue hoodie with logo"
3. Click Generate

Should generate AI image using Gemini API.

---

## Step 4: Verify Vercel Configuration

Check that `vercel.json` is properly configured:

### Current Configuration:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

This configuration:
- ✅ Builds `server.js` as serverless function
- ✅ Routes all `/api/*` calls to server.js
- ✅ Serves static files directly

---

## 🔧 Troubleshooting

### Problem 1: "Backend API returns 404"

**Cause:** Environment variables not set or vercel.json missing

**Fix:**
1. Check environment variables in Vercel dashboard
2. Make sure `vercel.json` is committed to git
3. Redeploy

### Problem 2: "Login/Signup doesn't work"

**Cause:** Frontend calling localhost:3000 instead of production API

**Fix:**
Check `services/auth-service.js` and update API URLs:
```javascript
// Change from:
const API_URL = 'http://localhost:3000/api/auth';

// To:
const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api/auth'
    : '/api/auth'; // Use relative URL in production
```

### Problem 3: "Product creation fails"

**Cause:** Shopify Admin token not set or expired

**Fix:**
1. Check Vercel environment variables
2. Verify `SHOPIFY_ADMIN_TOKEN` is correct
3. Test token hasn't expired (regenerate if needed)

### Problem 4: "AI features not working"

**Cause:** Gemini API key missing or revoked

**Fix:**
1. Check console for errors
2. If key is revoked, get new key from https://aistudio.google.com/apikey
3. Update `config/gemini.production.js` with new key
4. Commit and push

### Problem 5: "CORS errors in console"

**Cause:** Frontend making requests to wrong origin

**Fix:** Update all API calls to use relative URLs in production:
```javascript
// Good (works everywhere):
fetch('/api/products')

// Bad (only works locally):
fetch('http://localhost:3000/api/products')
```

---

## 📱 Environment-Aware API Calls

Make sure your frontend code detects the environment:

```javascript
// Recommended pattern for API calls
const API_BASE = window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : ''; // Empty string uses same origin

// Then use it:
fetch(`${API_BASE}/api/products`)
```

---

## 🔒 Security Checklist for Production

Before going live with real users:

- ✅ Environment variables set in Vercel (not in code)
- ✅ `.env` file NOT committed to git
- ✅ `config/shopify.js` and `config/gemini.js` NOT committed (gitignored)
- ✅ Only production config files (`*.production.js`) committed
- ✅ Storefront token is public (safe to commit)
- ✅ Admin token is server-side only (environment variable)
- ⚠️ Gemini API key is client-side (consider moving to backend)
- ✅ HTTPS enabled (automatic with Vercel)
- ✅ No API keys visible in browser DevTools Network tab

---

## 🚀 Deployment Checklist

Use this checklist every time you deploy:

- [ ] All changes committed to git
- [ ] Environment variables set in Vercel dashboard
- [ ] `vercel.json` exists and configured
- [ ] Production config files exist (`*.production.js`)
- [ ] Build script runs successfully locally: `npm run build`
- [ ] Push to GitHub: `git push origin main`
- [ ] Wait for Vercel auto-deploy (1-2 minutes)
- [ ] Test `/api/health` endpoint
- [ ] Test login/signup
- [ ] Test product creation
- [ ] Test AI features
- [ ] Check browser console for errors
- [ ] Verify no CORS errors

---

## 📊 Monitoring Your Deployment

### Vercel Dashboard

1. **Deployments:** See all deployments and their status
2. **Analytics:** View page views, load times
3. **Logs:** Real-time server logs for debugging
4. **Speed Insights:** Performance metrics

### View Live Logs

1. Go to Vercel Dashboard → Your Project
2. Click **Deployments** tab
3. Click latest deployment
4. Click **View Function Logs**
5. See real-time server output

---

## 🎯 Next Steps

Once everything is working:

1. **Test with real users**
   - Create test accounts
   - Create test products
   - Process test orders

2. **Set up custom domain** (optional)
   - Go to Vercel Dashboard → Domains
   - Add your domain: `yourdomain.com`
   - Update DNS records

3. **Add monitoring** (optional)
   - Enable Vercel Analytics
   - Add Sentry for error tracking
   - Set up uptime monitoring

4. **Optimize performance**
   - Enable caching headers
   - Compress images
   - Add CDN for static assets

---

## 📞 Getting Help

If you're still having issues:

1. **Check Vercel Logs**
   - Dashboard → Deployments → Latest → Function Logs
   - Look for error messages

2. **Check Browser Console**
   - Open DevTools (F12)
   - Look for red errors
   - Check Network tab for failed requests

3. **Verify Environment Variables**
   - Dashboard → Settings → Environment Variables
   - Make sure all 4 variables are set

4. **Redeploy**
   - Sometimes a fresh deployment fixes issues
   - Deployments → Redeploy

---

## ✅ Final Verification

Your site should now have:

✅ Homepage loading at https://ecommerce-concept.vercel.app/
✅ API endpoint working at https://ecommerce-concept.vercel.app/api/health
✅ Login/Signup working
✅ Product creation working
✅ AI features working
✅ All features working same as localhost

**Congratulations! Your e-commerce store is live! 🎉**

---

Built with ❤️ for e-commerce success
