# Features Guide - How to Access Everything

## 🎉 Your Website Now Has:

### 1. **Login & Signup** 🔐
**How to access:**
- Look for the **"Login"** button in the top navigation bar
- Or visit directly: `login.html`
- Or visit signup: `signup.html`

**What you can do:**
- Create a customer account
- Login to existing account
- View order history
- Manage profile

**Try it:**
1. Click "Login" button (top right of any page)
2. Click "Sign up" link
3. Enter your details
4. Create an account

---

### 2. **Account Dashboard** 📊
**How to access:**
- After logging in, you'll be redirected automatically
- Or visit directly: `account.html`
- Or click your name in the navigation (after login)

**What you can see:**
- Your profile information
- Order history
- Wishlist
- **Admin Panel** (Shopify management links)

**Admin Panel includes:**
- Products Management
- Orders Processing
- Analytics Dashboard
- Customer Management
- Payment Settings
- Full Shopify Admin Access

---

### 3. **Shopify Products** 🛍️
**How it works:**
- Products now load automatically from your Shopify store
- Updates in real-time when you add/edit products in Shopify

**To see your products:**
1. Open `index.html` or `products.html`
2. Products should load from Shopify
3. Check browser console (F12) to see loading status

---

### 4. **Test the Complete Flow** ✅

#### Test Signup:
1. Open `index.html`
2. Click "Login" button (top navigation)
3. Click "Sign up" link
4. Fill in:
   - First Name: Test
   - Last Name: User
   - Email: test@example.com
   - Password: testpassword123
5. Click "Create Account"

#### Test Login:
1. Go to `login.html`
2. Enter:
   - Email: test@example.com
   - Password: testpassword123
3. Click "Sign In"
4. You'll be redirected to Account Dashboard

#### Test Checkout:
1. Add products to cart
2. Click "Proceed to Checkout"
3. You'll be redirected to Shopify checkout
4. Complete purchase (use test mode)

---

## 🔍 How to Check if Everything is Working

### Check 1: Shopify Connection
1. Open `index.html`
2. Press F12 (open Developer Console)
3. Look for:
   - ✅ "Shopify configured, loading products from Shopify..."
   - ✅ "Loaded X products from Shopify"

If you see errors:
   - ❌ "Shopify is not configured" - Check `config/shopify.js`
   - ❌ API errors - Check your Storefront API token

### Check 2: Login Button
1. Open `index.html`
2. Look at top navigation
3. You should see a purple "Login" button
4. If logged in, it shows your name instead

### Check 3: Products Loading
1. Open `index.html`
2. Scroll to products section
3. Check if you see your Shopify products
4. Product names should match what's in Shopify admin

---

## 📂 New Files Created

```
config/
  └── shopify.js                 ✅ Your credentials here

services/
  ├── shopify-api.js             ✅ API integration
  ├── auth-service.js            ✅ Authentication logic
  ├── product-loader.js          ✅ Loads products from Shopify
  └── nav-auth.js                ✅ Shows login button

Auth Pages:
  ├── login.html                 ✅ Login page
  ├── signup.html                ✅ Signup page
  └── account.html               ✅ Dashboard with admin links

Styles:
  └── auth-styles.css            ✅ Auth UI styles

Scripts:
  ├── auth.js                    ✅ Login/signup logic
  └── account.js                 ✅ Dashboard logic
```

---

## 🐛 Troubleshooting

### "I don't see the Login button"
**Fix:** Clear browser cache and refresh (Ctrl+Shift+R or Cmd+Shift+R)

### "Products still showing old data"
**Fix:**
1. Open browser console (F12)
2. Type: `localStorage.clear()`
3. Press Enter
4. Refresh page (F5)

### "Login doesn't work"
**Possible causes:**
1. Shopify not configured - Check `config/shopify.js`
2. Wrong credentials - Verify in Shopify admin
3. API scopes not enabled - Check Shopify app settings

### "Products not loading from Shopify"
**Check:**
1. Open console (F12)
2. Look for error messages
3. Verify products exist in Shopify admin
4. Check products are published to "Online Store" channel

---

## 🎯 Quick Access Links

When you open your website, you can access:

- **Main Store**: `index.html`
- **All Products**: `products.html`
- **Login**: `login.html` (or click Login button)
- **Signup**: `signup.html`
- **Account Dashboard**: `account.html` (after login)
- **Cart**: `cart.html`
- **Wishlist**: `wishlist.html`

---

## 🔑 Your Credentials (Reference)

**Store URL:** themerchconcept.myshopify.com
**API Token:** Configured in `config/shopify.js`
**Admin URL:** https://admin.shopify.com/store/themerchconcept

---

## 📱 Next Steps

1. **Test the login flow** - Create an account and log in
2. **Check products** - Verify they load from Shopify
3. **Test checkout** - Add to cart and try checking out
4. **Access admin dashboard** - Log in and click admin links
5. **Add product images** - In Shopify admin, add real product photos

---

## 💡 Tips

- **Login button** appears automatically when you open any page
- **After login**, it changes to show your name
- **Admin panel** only shows when Shopify is properly configured
- **Products** automatically sync from Shopify every time you reload
- **Cache** is cleared when you add new products in Shopify

---

**Need help?** Check the browser console (F12) for error messages!
