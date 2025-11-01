# Deployment Guide - Vercel & Other Platforms

Complete guide to deploy your e-commerce store to production.

---

## 🚀 Deploy to Vercel (Recommended)

Vercel is the easiest platform for deploying this project with zero configuration.

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/disuhitarth/EcommerceConcept)

### Manual Deployment

#### Step 1: Install Vercel CLI

```bash
npm i -g vercel
```

#### Step 2: Login to Vercel

```bash
vercel login
```

#### Step 3: Deploy

```bash
# From your project directory
vercel
```

Follow the prompts:
- **Set up and deploy**? → Yes
- **Which scope**? → Your account
- **Link to existing project**? → No
- **Project name**? → lovable-supply (or your choice)
- **Directory**? → ./ (current directory)

#### Step 4: Configure Environment Variables

After deployment, go to your Vercel dashboard:

1. Select your project
2. Go to **Settings** → **Environment Variables**
3. Add these variables:

```env
SHOPIFY_DOMAIN=your-store.myshopify.com
SHOPIFY_ADMIN_TOKEN=shpat_your_admin_token
SHOPIFY_API_VERSION=2024-01
PORT=3000
```

**How to add:**
- Click "Add New"
- Name: `SHOPIFY_DOMAIN`
- Value: `your-store.myshopify.com`
- Environment: Production, Preview, Development (check all)
- Click "Save"

Repeat for each variable.

#### Step 5: Redeploy

After adding environment variables:

```bash
vercel --prod
```

Your site is now live! 🎉

---

## 📋 Required Environment Variables

### For Vercel/Production Deployment:

| Variable | Description | Where to Get | Required |
|----------|-------------|--------------|----------|
| `SHOPIFY_DOMAIN` | Your Shopify store domain | Shopify Admin → Settings | ✅ Yes |
| `SHOPIFY_ADMIN_TOKEN` | Admin API access token | Shopify Admin → Apps → Develop apps | ✅ Yes |
| `SHOPIFY_API_VERSION` | API version (use 2024-01) | Fixed value | ✅ Yes |
| `PORT` | Server port (default 3000) | Any port number | ⚠️ Optional |

### Not Needed in Vercel (Local Only):

These are client-side configs that stay in gitignored files:

| File | Variable | Where to Get |
|------|----------|--------------|
| `config/shopify.js` | `storefrontAccessToken` | Shopify Admin → Apps |
| `config/gemini.js` | `apiKey` | Google AI Studio |

---

## 🔧 Vercel Configuration

Create `vercel.json` in your project root:

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
- ✅ Serves static files (HTML, CSS, JS)
- ✅ Routes API calls to server.js
- ✅ Enables serverless functions

---

## 🌐 Custom Domain

### Add Custom Domain to Vercel

1. Go to your project in Vercel
2. Click **Settings** → **Domains**
3. Add your domain: `yourdomain.com`
4. Follow DNS configuration instructions

### DNS Configuration

Add these records to your domain provider:

**For root domain (yourdomain.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Wait 24-48 hours** for DNS propagation.

---

## 🔒 Security Checklist for Production

Before going live, ensure:

- ✅ Environment variables are set in Vercel (not in code)
- ✅ `.env` file is in `.gitignore`
- ✅ `config/shopify.js` is in `.gitignore`
- ✅ `config/gemini.js` is in `.gitignore`
- ✅ No API keys in frontend code
- ✅ HTTPS enabled (automatic with Vercel)
- ✅ CORS configured properly
- ✅ Rate limiting enabled (optional but recommended)

---

## 🚢 Alternative Deployment Options

### Option 1: Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

**Environment Variables:**
Go to Netlify Dashboard → Site Settings → Environment variables

### Option 2: Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
railway up
```

**Environment Variables:**
Go to Railway Dashboard → Your Project → Variables

### Option 3: Render

1. Connect your GitHub repo
2. Create a new Web Service
3. Set environment variables in dashboard
4. Deploy automatically on git push

### Option 4: Heroku

```bash
# Install Heroku CLI
npm i -g heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Add environment variables
heroku config:set SHOPIFY_DOMAIN=your-store.myshopify.com
heroku config:set SHOPIFY_ADMIN_TOKEN=shpat_...

# Deploy
git push heroku main
```

### Option 5: DigitalOcean App Platform

1. Connect GitHub repository
2. Configure environment variables
3. Deploy automatically

---

## 📊 Post-Deployment Checklist

After deploying, test these features:

- [ ] Homepage loads correctly
- [ ] Products page displays items
- [ ] Login/Signup works
- [ ] AI image generation works
- [ ] Product creation works
- [ ] Images upload correctly
- [ ] Shopify integration works
- [ ] All API endpoints respond
- [ ] Environment variables loaded
- [ ] HTTPS enabled
- [ ] Custom domain works (if added)

---

## 🐛 Troubleshooting Deployment

### Build Fails

**Error:** "Cannot find module"
```bash
# Make sure package.json has all dependencies
npm install
npm audit fix
```

**Error:** "Environment variable not found"
- Check Vercel dashboard → Settings → Environment Variables
- Make sure all required variables are added
- Redeploy after adding variables

### Runtime Errors

**Error:** "Shopify API connection failed"
- Check `SHOPIFY_DOMAIN` is correct (no https://)
- Verify `SHOPIFY_ADMIN_TOKEN` is valid
- Check token has correct permissions

**Error:** "CORS policy blocked"
- Ensure `server.js` has `cors()` middleware
- Check frontend calls correct API URL

### Performance Issues

**Slow response times:**
- Enable Vercel Edge Functions
- Add caching headers
- Optimize images
- Use CDN for static assets

---

## 📈 Monitoring & Analytics

### Vercel Analytics

Enable in Vercel dashboard:
1. Go to your project
2. Click **Analytics** tab
3. Enable Web Analytics

### Error Tracking

Add Sentry for error tracking:

```bash
npm install @sentry/node
```

```javascript
// In server.js
const Sentry = require('@sentry/node');
Sentry.init({ dsn: process.env.SENTRY_DSN });
```

### Performance Monitoring

Use Vercel Speed Insights:
- Automatic with Vercel deployment
- View in Analytics dashboard

---

## 🔄 Continuous Deployment

### Auto-Deploy from GitHub

Vercel automatically deploys when you push to GitHub:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

Vercel will:
1. Detect the push
2. Build your project
3. Run tests (if configured)
4. Deploy to production
5. Send notification

### Preview Deployments

Every pull request gets a preview URL:
- Test changes before merging
- Share with team for review
- Automatic deployment on PR

---

## 💰 Cost Estimation

### Vercel Pricing

| Plan | Price | Features |
|------|-------|----------|
| Hobby | **Free** | 100 GB bandwidth, Serverless functions |
| Pro | $20/month | 1 TB bandwidth, Team collaboration |
| Enterprise | Custom | Unlimited, SLA, Support |

**For this project:** Hobby plan is sufficient for up to 10k visitors/month

### Other Costs

- **Shopify**: $29/month (Basic plan)
- **Domain**: $12/year (optional)
- **Gemini API**: Pay-as-you-go (~$0.04 per image)
- **Total**: ~$30-50/month

---

## 🎯 Production Optimization

### 1. Enable Caching

```javascript
// In server.js
app.use((req, res, next) => {
    if (req.url.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg)$/)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
    next();
});
```

### 2. Compress Responses

```bash
npm install compression
```

```javascript
const compression = require('compression');
app.use(compression());
```

### 3. Rate Limiting

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);
```

### 4. Database (Optional)

For production, replace in-memory storage with a database:

**Option A: Supabase (Free tier)**
```bash
npm install @supabase/supabase-js
```

**Option B: MongoDB Atlas (Free tier)**
```bash
npm install mongodb
```

**Option C: PostgreSQL (Railway/Render)**
```bash
npm install pg
```

---

## 📞 Support

### Deployment Issues

1. **Check Vercel Logs**: Dashboard → Your Project → Deployments → View Logs
2. **Check Build Logs**: Look for error messages
3. **Verify Environment Variables**: Settings → Environment Variables

### Getting Help

- **Vercel Discord**: https://vercel.com/discord
- **Documentation**: https://vercel.com/docs
- **Support**: support@vercel.com

---

## 🎉 You're Live!

Once deployed, your store will be accessible at:

**Vercel:** `https://your-project.vercel.app`
**Custom Domain:** `https://yourdomain.com`

Share your store and start selling! 🚀

---

**Next Steps:**
1. Test all features in production
2. Add your products in Shopify
3. Configure payment methods
4. Set up email notifications
5. Add analytics tracking
6. Start marketing!

---

Built with ❤️ for e-commerce entrepreneurs
