# Complete Credentials Setup Guide

This document lists all credentials needed to run this project locally and in production.

---

## 📋 Required Credentials Overview

| Credential | Used For | Required | Where to Get |
|------------|----------|----------|--------------|
| Shopify Storefront Token | Display products | ✅ Yes | Shopify Admin → Apps |
| Shopify Admin Token | Create products | ✅ Yes | Shopify Admin → Apps |
| Google Gemini API Key | AI features | ⚠️ Optional | Google AI Studio |

---

## 1️⃣ Shopify Storefront Access Token

### What It's For
- Loading products from Shopify
- Customer authentication
- Creating checkouts
- **Permissions:** Read-only, safe to expose in frontend

### How to Get It

1. **Go to Shopify Admin**
   ```
   https://your-store.myshopify.com/admin
   ```

2. **Navigate to Apps**
   - Click **Settings** (bottom left)
   - Click **Apps and sales channels**
   - Click **Develop apps**

3. **Create New App**
   - Click **Create an app**
   - App name: `Frontend Storefront`
   - Click **Create app**

4. **Configure Storefront API**
   - Click **Configure Storefront API scopes**
   - Check these permissions:
     - ✅ `unauthenticated_read_product_listings`
     - ✅ `unauthenticated_read_product_inventory`
     - ✅ `unauthenticated_read_product_tags`
     - ✅ `unauthenticated_write_checkouts`
     - ✅ `unauthenticated_read_checkouts`
     - ✅ `unauthenticated_write_customers`
     - ✅ `unauthenticated_read_customers`
   - Click **Save**

5. **Install the App**
   - Click **API credentials** tab
   - Click **Install app**
   - Click **Install** to confirm

6. **Get Your Token**
   - Under **Storefront API access token**
   - Copy the token (starts with letters/numbers, ~32 characters)
   - Example: `286378202a411205690b709625cb2aad`

### Where to Add It

**Local Development:**
```javascript
// config/shopify.js
const shopifyConfig = {
    storefrontAccessToken: 'YOUR_STOREFRONT_TOKEN_HERE',
    // ...
};
```

**Production (Vercel):**
Not needed - Storefront token is in `config/shopify.js` (client-side)

---

## 2️⃣ Shopify Admin API Access Token

### What It's For
- Creating products
- Managing inventory
- Admin operations
- **Permissions:** Read/Write, MUST be kept secret

### How to Get It

1. **Go to Shopify Admin**
   ```
   https://your-store.myshopify.com/admin
   ```

2. **Navigate to Apps** (same as above)
   - Settings → Apps and sales channels → Develop apps

3. **Create New App** (or use existing)
   - If creating new: `Backend Admin API`
   - If using existing: Click your app name

4. **Configure Admin API**
   - Click **Configure Admin API scopes**
   - Check these permissions:
     - ✅ `write_products`
     - ✅ `read_products`
     - ✅ `write_inventory` (optional but recommended)
     - ✅ `read_inventory` (optional but recommended)
   - Click **Save**

5. **Install the App** (if not already)
   - Click **API credentials** tab
   - Click **Install app**

6. **Get Your Token**
   - Under **Admin API access token**
   - Click **Reveal token once**
   - ⚠️ **COPY IMMEDIATELY** - you'll only see it once!
   - Example format: `shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Where to Add It

**Local Development:**
```bash
# .env file (create if doesn't exist)
SHOPIFY_ADMIN_TOKEN=shpat_your_admin_token_here
```

**Production (Vercel):**
1. Go to Vercel Dashboard
2. Select your project
3. Settings → Environment Variables
4. Add new variable:
   - Name: `SHOPIFY_ADMIN_TOKEN`
   - Value: `shpat_your_token_here`
   - Environments: Production, Preview, Development (all)
5. Click **Save**
6. Redeploy

---

## 3️⃣ Shopify Domain

### What It's For
- API endpoint construction
- Connecting to your store

### How to Get It

1. **Go to Shopify Admin**
2. Look at the URL: `https://YOUR-STORE.myshopify.com/admin`
3. Your domain is: `YOUR-STORE.myshopify.com`

### Where to Add It

**Local Development:**
```bash
# .env
SHOPIFY_DOMAIN=your-store.myshopify.com

# config/shopify.js
const shopifyConfig = {
    domain: 'your-store.myshopify.com',
    // ...
};
```

**Production (Vercel):**
Add as environment variable:
- Name: `SHOPIFY_DOMAIN`
- Value: `your-store.myshopify.com`

---

## 4️⃣ Google Gemini API Key

### What It's For
- AI image generation
- Background removal
- Image upscaling
- Auto-fill from images
- Text optimization

### How to Get It

1. **Go to Google AI Studio**
   ```
   https://aistudio.google.com/apikey
   ```

2. **Sign In**
   - Use your Google account
   - Accept terms if prompted

3. **Create API Key**
   - Click **"Create API Key"**
   - Select your Google Cloud project (or create new)
   - Click **"Create API Key in existing project"**

4. **Copy Your Key**
   - Key starts with: `AIzaSy...`
   - Example: `AIzaSyBmraiYP3uzuiWu6kFSvl9fxzRY4K2-Qu8`
   - ⚠️ **NEVER share this publicly!**

### Where to Add It

**Local Development:**
```javascript
// config/gemini.js
const geminiConfig = {
    apiKey: 'AIzaSy_your_key_here',
    // ...
};
```

**Production:**
AI features run client-side, so keep key in `config/gemini.js` (gitignored)

**⚠️ Security Note:** For better security in production, move Gemini API to backend:
```bash
# Add to .env
GEMINI_API_KEY=AIzaSy_your_key_here
```

Then update `server.js` to proxy Gemini requests.

---

## 📁 File Structure for Credentials

### Local Development Files

```
LovClone/
├── .env                    # Backend environment variables
│   ├── SHOPIFY_DOMAIN
│   ├── SHOPIFY_ADMIN_TOKEN
│   └── SHOPIFY_API_VERSION
│
├── config/
│   ├── shopify.js         # Shopify storefront config
│   │   ├── domain
│   │   ├── storefrontAccessToken
│   │   └── adminAccessToken (not used client-side)
│   │
│   └── gemini.js          # Gemini API config
│       └── apiKey
```

### Gitignored Files (Not Committed)

✅ These files are safe and won't be pushed to GitHub:
- `.env`
- `config/shopify.js`
- `config/gemini.js`

### Committed Template Files

These ARE committed (no real credentials):
- `.env.example`
- `config/shopify.example.js`
- `config/gemini.example.js`

---

## 🔒 Security Best Practices

### ✅ DO:

1. **Use Environment Variables**
   ```bash
   # .env
   SHOPIFY_ADMIN_TOKEN=shpat_...
   ```

2. **Keep Credentials Gitignored**
   ```bash
   # .gitignore
   .env
   config/shopify.js
   config/gemini.js
   ```

3. **Use Different Tokens for Dev/Prod**
   - Development: Test store tokens
   - Production: Live store tokens

4. **Rotate Tokens Regularly**
   - Every 90 days minimum
   - Immediately if exposed

5. **Limit Token Permissions**
   - Only grant necessary scopes
   - Don't use full admin access

### ❌ DON'T:

1. **Never Commit Credentials**
   ```bash
   # ❌ BAD - Don't do this!
   git add .env
   git commit -m "Add credentials"
   ```

2. **Never Share in Screenshots**
   - Blur out API keys
   - Crop sensitive data

3. **Never Hardcode in Code**
   ```javascript
   // ❌ BAD
   const apiKey = 'AIzaSy...';

   // ✅ GOOD
   const apiKey = process.env.GEMINI_API_KEY;
   ```

4. **Never Use Same Token Everywhere**
   - Development: separate tokens
   - Staging: separate tokens
   - Production: separate tokens

---

## 🔑 Environment Variables Summary

### Complete `.env` File Template

```bash
# Shopify Configuration
SHOPIFY_DOMAIN=your-store.myshopify.com
SHOPIFY_ADMIN_TOKEN=shpat_your_admin_token_here
SHOPIFY_API_VERSION=2024-01

# Server Configuration
PORT=3000
NODE_ENV=development

# Optional: Move Gemini to backend for better security
GEMINI_API_KEY=AIzaSy_your_gemini_key_here

# Optional: Database (if using)
DATABASE_URL=postgresql://...

# Optional: Error Tracking
SENTRY_DSN=https://...
```

### Vercel Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

| Variable | Example Value | Environment |
|----------|---------------|-------------|
| `SHOPIFY_DOMAIN` | `yourstore.myshopify.com` | All |
| `SHOPIFY_ADMIN_TOKEN` | `shpat_...` | All |
| `SHOPIFY_API_VERSION` | `2024-01` | All |
| `NODE_ENV` | `production` | Production only |

---

## 📞 Troubleshooting

### "Invalid API credentials"

**Problem:** Shopify API returns 401 Unauthorized

**Solutions:**
1. Check token is copied correctly (no extra spaces)
2. Verify token hasn't been revoked
3. Confirm app is installed
4. Check API scopes are correct

### "Gemini API key leaked"

**Problem:** Google reports key as leaked

**Solutions:**
1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. **Delete** the leaked key
3. **Create** a new key
4. Update `config/gemini.js`
5. **Never** share the new key

### "Environment variable not found"

**Problem:** Server can't read `.env` file

**Solutions:**
1. Check `.env` file exists in project root
2. Verify filename is exactly `.env` (not `.env.txt`)
3. Make sure `dotenv` is installed: `npm install dotenv`
4. Check `server.js` has: `require('dotenv').config()`

---

## ✅ Credentials Checklist

Before deploying, verify you have:

- [ ] Shopify store created
- [ ] Shopify Storefront token obtained
- [ ] Shopify Admin token obtained
- [ ] Google Gemini API key obtained
- [ ] `.env` file created locally
- [ ] `config/shopify.js` configured
- [ ] `config/gemini.js` configured
- [ ] All tokens added to Vercel (for production)
- [ ] Tokens tested and working
- [ ] All sensitive files gitignored

---

## 🎉 You're All Set!

Once all credentials are configured:

1. **Start Local Server**
   ```bash
   npm start
   ```

2. **Test Features**
   - Visit http://localhost:3000
   - Try login/signup
   - Test AI image generation
   - Create a test product

3. **Deploy to Production**
   - Add environment variables to Vercel
   - Deploy with `vercel --prod`
   - Test all features in production

---

**Need Help?**
- See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment guide
- See [SHOPIFY-ADMIN-SETUP.md](SHOPIFY-ADMIN-SETUP.md) for Shopify setup
- See [GEMINI-INTEGRATION.md](GEMINI-INTEGRATION.md) for AI setup

---

Built with ❤️ for secure e-commerce
