# Shopify Integration Setup Guide

Complete guide to integrating your Lovable Supply store with Shopify backend.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Step 1: Create Shopify Store](#step-1-create-shopify-store)
4. [Step 2: Configure Storefront API](#step-2-configure-storefront-api)
5. [Step 3: Add Products to Shopify](#step-3-add-products-to-shopify)
6. [Step 4: Configure Your Website](#step-4-configure-your-website)
7. [Step 5: Test Integration](#step-5-test-integration)
8. [Step 6: Go Live](#step-6-go-live)
9. [Troubleshooting](#troubleshooting)
10. [Next Steps](#next-steps)

---

## Overview

Your website now has complete Shopify backend integration including:

✅ **Authentication** - Customer login/signup
✅ **Product Management** - Dynamic product loading from Shopify
✅ **Checkout** - Secure payment processing
✅ **Order Management** - Track orders via Shopify
✅ **Analytics** - Built-in Shopify analytics
✅ **Admin Dashboard** - Full access to Shopify admin panel

**Time to Complete:** 2-3 hours
**Cost:** Shopify Basic Plan ($29/month) + 2.9% + 30¢ per transaction

---

## Prerequisites

Before starting, you'll need:

- [ ] A Shopify account (create at https://www.shopify.com)
- [ ] Your website files (already created)
- [ ] Product images and descriptions
- [ ] Payment method for Shopify subscription

---

## Step 1: Create Shopify Store

### 1.1 Sign Up for Shopify

1. Go to https://www.shopify.com
2. Click "Start free trial"
3. Enter your email and create a password
4. Complete the store setup wizard:
   - Store name: `lovable-supply` (or your preferred name)
   - Industry: Apparel & Accessories
   - Business type: Choose what applies to you

### 1.2 Choose Your Plan

After the trial, select:
- **Basic Shopify**: $29/month (recommended for starting)
- Includes:
  - Unlimited products
  - 24/7 support
  - Fraud analysis
  - Discount codes
  - Manual order creation

---

## Step 2: Configure Storefront API

### 2.1 Create Custom App

1. In Shopify admin, go to: **Settings** → **Apps and sales channels**
2. Click **"Develop apps"**
3. If prompted, click **"Allow custom app development"**
4. Click **"Create an app"**
5. Name it: `Lovable Supply Storefront`
6. Click **"Create app"**

### 2.2 Configure API Permissions

1. Click on **"Configure Storefront API scopes"**
2. Select the following permissions:

   #### Required Scopes:
   - ✅ `unauthenticated_read_product_listings` - Read products
   - ✅ `unauthenticated_read_product_inventory` - Check stock
   - ✅ `unauthenticated_write_checkouts` - Create checkouts
   - ✅ `unauthenticated_read_checkouts` - Read checkout data
   - ✅ `unauthenticated_write_customers` - Customer signup
   - ✅ `unauthenticated_read_customers` - Customer login
   - ✅ `unauthenticated_read_customer_tags` - Read customer info

3. Click **"Save"**

### 2.3 Get Your Access Token

1. Click **"Install app"** in the top right
2. Go to **"API credentials"** tab
3. Under **"Storefront API access token"**, click **"Reveal token"**
4. **COPY THIS TOKEN** - You'll need it in Step 4

**⚠️ Important:** Keep this token secret! Don't share it publicly or commit it to public repos.

---

## Step 3: Add Products to Shopify

### 3.1 Navigate to Products

1. In Shopify admin, click **"Products"** in the left sidebar
2. Click **"Add product"**

### 3.2 Add Your Products

For each product in your catalog, add:

#### Example: AI Builder Hoodie

**Basic Info:**
- Title: `AI Builder Hoodie`
- Description: `Premium hoodie for AI-powered developers. Made with soft, breathable fabric perfect for long coding sessions.`
- Price: `$59.99`

**Media:**
- Upload product images (or use emoji temporarily)

**Organization:**
- Product type: `Hoodies`
- Vendor: `Lovable Supply`
- Tags: `ai, developer, hoodie, programming`
- Collection: Create "Hoodies" collection

**Variants:**
- Sizes: S, M, L, XL, XXL
- Colors: Black, Navy, Gray

**Inventory:**
- SKU: `LVB-HOODIE-AI-001`
- Track quantity: Yes
- Quantity: 50 (or your stock)

**Shipping:**
- Weight: 1 lb
- Requires shipping: Yes

3. Click **"Save"**

### 3.3 Repeat for All Products

Add all 12 products from your website:
1. AI Builder Hoodie - $59.99
2. Chat with AI Tee - $29.99
3. Code Generator Hoodie - $64.99
4. Lovable Sticker Pack - $9.99
5. AI Developer Tee - $27.99
6. Build Fast Hoodie - $62.99
7. Gradient Logo Sticker - $4.99
8. AI Powered Tee - $31.99
9. Developer Cap - $24.99
10. Coding Mug - $16.99
11. Keyboard Stickers - $7.99
12. Tech Tote Bag - $19.99

**💡 Tip:** Use the "Duplicate product" feature to speed this up!

---

## Step 4: Configure Your Website

### 4.1 Update Shopify Config

1. Open `config/shopify.js` in your website files
2. Update these values:

```javascript
const shopifyConfig = {
    // Replace with your actual store domain
    domain: 'lovable-supply.myshopify.com', // ← Your store name

    // Paste your Storefront Access Token from Step 2.3
    storefrontAccessToken: 'YOUR_ACTUAL_TOKEN_HERE', // ← Paste token here

    // Keep these as is
    apiVersion: '2024-01',
    storeName: 'Lovable Supply',
    currency: 'USD',
    locale: 'en-US'
};
```

### 4.2 Example Configuration

```javascript
const shopifyConfig = {
    domain: 'lovable-supply.myshopify.com',
    storefrontAccessToken: 'shpat_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6', // Example token
    apiVersion: '2024-01',
    storeName: 'Lovable Supply',
    currency: 'USD',
    locale: 'en-US'
};
```

### 4.3 Deploy Your Changes

If using GitHub Pages:
```bash
git add config/shopify.js
git commit -m "Configure Shopify integration"
git push origin main
```

**⚠️ Security Note:** In production, use environment variables instead of committing tokens directly. For GitHub Pages, consider using a build step to inject tokens.

---

## Step 5: Test Integration

### 5.1 Test Product Fetching

1. Open your website
2. Go to the Products page
3. Products should now load from Shopify
4. Check browser console for any errors

**Expected Behavior:**
- Products display with real data from Shopify
- Images, prices, and descriptions match Shopify
- Out of stock items show as unavailable

### 5.2 Test Authentication

1. Click "Sign Up" in navigation
2. Create a test account:
   - Email: `test@example.com`
   - Password: `testpassword123`
   - First/Last Name: Your choice

3. Verify account created in Shopify:
   - Go to Shopify Admin → Customers
   - Should see your test customer

4. Test Login:
   - Logout
   - Login with same credentials
   - Should redirect to account dashboard

### 5.3 Test Checkout

1. Add products to cart
2. Click "Checkout"
3. Should redirect to Shopify checkout page
4. Complete test purchase using Shopify test cards:
   - Card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVV: Any 3 digits

5. Verify order in Shopify Admin → Orders

### 5.4 Test Admin Dashboard

1. Login to your website
2. Go to Account page
3. Scroll to "Store Management" section
4. Click "Open Shopify Admin"
5. Should open Shopify admin in new tab

---

## Step 6: Go Live

### 6.1 Configure Payment Gateway

1. In Shopify Admin, go to **Settings** → **Payments**
2. Choose payment provider:
   - **Shopify Payments** (recommended): 2.9% + 30¢ per transaction
   - **PayPal**: Configure separately
   - **Stripe**: Can integrate via Shopify

3. Enable test mode until ready to accept real payments

### 6.2 Set Up Shipping

1. Go to **Settings** → **Shipping and delivery**
2. Add shipping zones:
   - Domestic shipping rates
   - International shipping (if applicable)

3. Configure shipping rates:
   - Free shipping over $50
   - Standard: $5.99
   - Express: $12.99

### 6.3 Configure Taxes

1. Go to **Settings** → **Taxes and duties**
2. Enable automatic tax calculation
3. Shopify handles tax rates by location

### 6.4 Set Up Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain (e.g., `shop.lovablesupply.com`)
3. Update DNS settings as instructed
4. Enable SSL certificate (automatic with Shopify)

### 6.5 Launch Checklist

Before going live, verify:

- [ ] All products added with correct prices
- [ ] Product images uploaded
- [ ] Shipping rates configured
- [ ] Payment gateway connected
- [ ] Tax settings configured
- [ ] Legal pages created (Privacy, Terms, Refund)
- [ ] Test order completed successfully
- [ ] Customer can create account
- [ ] Emails are sending (order confirmations)
- [ ] Analytics tracking enabled

---

## Troubleshooting

### Problem: "Shopify is not configured" error

**Solution:**
1. Check `config/shopify.js` has correct values
2. Verify `storefrontAccessToken` is not `'YOUR_STOREFRONT_ACCESS_TOKEN'`
3. Ensure domain is correct: `your-store.myshopify.com`

### Problem: Products not loading

**Solution:**
1. Check browser console for errors
2. Verify Storefront API scopes are enabled
3. Ensure products are set to "Online Store" sales channel
4. Check product availability is set to "Online Store"

### Problem: Cannot create customer account

**Solution:**
1. Verify `unauthenticated_write_customers` scope is enabled
2. Check Shopify customer accounts are enabled:
   - Settings → Checkout → Customer accounts → "Accounts are optional"
3. Try with different email address

### Problem: Checkout redirect fails

**Solution:**
1. Verify `unauthenticated_write_checkouts` scope enabled
2. Check variant IDs are correct
3. Ensure products are available for purchase
4. Verify inventory is greater than 0

### Problem: GraphQL API errors

**Solution:**
1. Check API version matches: `2024-01`
2. Update to latest API version if needed
3. Review GraphQL query syntax
4. Check Shopify API status page

---

## Next Steps

### Immediate (Week 1)
- ✅ Add more products
- ✅ Upload professional product images
- ✅ Write detailed product descriptions
- ✅ Set up automated email notifications
- ✅ Configure abandoned cart recovery

### Short-term (Month 1)
- [ ] Set up Google Analytics
- [ ] Add Facebook Pixel for ads
- [ ] Create discount codes
- [ ] Set up email marketing (Klaviyo/Mailchimp)
- [ ] Add product reviews (Judge.me app)

### Medium-term (Month 2-3)
- [ ] Optimize for SEO
- [ ] Add blog for content marketing
- [ ] Set up social media integration
- [ ] Create loyalty program
- [ ] Add live chat support

### Long-term (Month 3+)
- [ ] A/B test checkout process
- [ ] Implement upselling/cross-selling
- [ ] Add subscription products
- [ ] Expand to international markets
- [ ] Consider custom backend if scaling significantly

---

## Useful Resources

### Shopify Documentation
- [Storefront API Docs](https://shopify.dev/api/storefront)
- [GraphQL Reference](https://shopify.dev/api/storefront/reference)
- [Authentication Guide](https://shopify.dev/api/storefront/auth)
- [Checkout Documentation](https://shopify.dev/api/storefront/reference/checkout)

### Your Integration Files
- `config/shopify.js` - Shopify configuration
- `services/shopify-api.js` - API integration
- `services/auth-service.js` - Authentication logic
- `login.html` / `signup.html` - Auth pages
- `account.html` - Customer dashboard
- `IMPLEMENTATION-PLAN.md` - Detailed technical plan

### Support
- **Shopify Support**: 24/7 chat/phone support
- **Shopify Community**: https://community.shopify.com
- **Developer Discord**: https://discord.gg/shopify-developers

---

## Cost Breakdown

### Monthly Costs
- **Shopify Basic**: $29/month
- **Apps** (optional): $0-50/month
  - Email marketing: $0-20/month
  - Reviews app: $15/month
  - Abandoned cart: Free-$30/month

### Transaction Fees
- **Shopify Payments**: 2.9% + 30¢ per transaction
- **Third-party gateway**: Additional 0.5-2% fee

### Example Revenue Calculation
```
Monthly Sales: $5,000
Transactions: 100 orders @ $50 average

Shopify subscription: $29
Transaction fees (2.9% + $0.30): $175
Apps: ~$25

Total costs: $229
Net revenue: $4,771
Profit margin: 95.4%
```

**Note:** This doesn't include product costs, shipping, marketing, etc.

---

## Migration to Custom Backend (Future)

When you reach $10,000+/month, consider custom backend:

**Benefits:**
- Lower transaction fees (save $250+/month)
- Complete data ownership
- Custom features/workflows
- No platform limitations

**Migration Path:**
1. Keep Shopify running
2. Build custom backend in parallel
3. Replicate product data
4. Test thoroughly
5. Gradually migrate customers
6. Keep Shopify as backup for 3 months
7. Cancel Shopify once stable

**Estimated Timeline:** 2-3 months
**Development Cost:** $5,000-15,000 (or free if building yourself)

---

## Security Checklist

- [ ] Storefront Access Token is secret
- [ ] Don't commit tokens to public repos
- [ ] Use HTTPS for all requests
- [ ] Validate all user inputs
- [ ] Implement rate limiting
- [ ] Monitor for suspicious activity
- [ ] Keep Shopify app updated
- [ ] Regular security audits
- [ ] PCI compliance (handled by Shopify)
- [ ] GDPR compliance (configure in Shopify)

---

## Need Help?

**Created:** October 30, 2024
**Last Updated:** October 30, 2024

If you encounter any issues during setup, check:
1. This guide's Troubleshooting section
2. Browser console for errors
3. Shopify Admin → Online Store → Themes → Actions → Edit code
4. Shopify support chat

Good luck with your launch! 🚀
