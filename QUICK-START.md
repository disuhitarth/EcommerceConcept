# Quick Start Guide - Shopify Integration

Get your store live in 2-3 hours!

## ✅ Checklist

### Phase 1: Shopify Setup (30 minutes)
- [ ] Create Shopify account at https://www.shopify.com
- [ ] Choose store name (e.g., `lovable-supply`)
- [ ] Complete store setup wizard
- [ ] Select Basic plan ($29/month after trial)

### Phase 2: API Configuration (15 minutes)
- [ ] Go to: Settings → Apps and sales channels → Develop apps
- [ ] Click "Allow custom app development" (if prompted)
- [ ] Click "Create an app"
- [ ] Name: `Lovable Supply Storefront`
- [ ] Click "Configure Storefront API scopes"
- [ ] Enable these scopes:
  - `unauthenticated_read_product_listings`
  - `unauthenticated_read_product_inventory`
  - `unauthenticated_write_checkouts`
  - `unauthenticated_read_checkouts`
  - `unauthenticated_write_customers`
  - `unauthenticated_read_customers`
- [ ] Click "Save"
- [ ] Click "Install app"
- [ ] Go to "API credentials" tab
- [ ] Copy "Storefront API access token"

### Phase 3: Website Configuration (5 minutes)
- [ ] Open `config/shopify.js` in your editor
- [ ] Replace `YOUR_STORE_NAME.myshopify.com` with your actual store URL
- [ ] Replace `YOUR_STOREFRONT_ACCESS_TOKEN` with your copied token
- [ ] Save the file

```javascript
// config/shopify.js
const shopifyConfig = {
    domain: 'lovable-supply.myshopify.com', // ← Your store URL
    storefrontAccessToken: 'shpat_xxxxx...', // ← Your token here
    apiVersion: '2024-01',
    storeName: 'Lovable Supply',
    currency: 'USD',
    locale: 'en-US'
};
```

### Phase 4: Add Products (45 minutes)
For each of the 12 products, in Shopify Admin:
- [ ] Click "Products" → "Add product"
- [ ] Fill in product details (see below)
- [ ] Click "Save"

#### Product 1: AI Builder Hoodie
```
Title: AI Builder Hoodie
Description: Premium hoodie for AI-powered developers. Made with soft, breathable fabric perfect for long coding sessions.
Price: $59.99
Type: Hoodies
Tags: ai, developer, hoodie, programming
Inventory: 50
```

#### Product 2: Chat with AI Tee
```
Title: Chat with AI Tee
Description: Comfortable t-shirt celebrating AI builders
Price: $29.99
Type: T-Shirts
Tags: ai, tshirt, developer
Inventory: 100
```

#### Product 3: Code Generator Hoodie
```
Title: Code Generator Hoodie
Description: Stay warm while building with AI
Price: $64.99
Type: Hoodies
Tags: ai, hoodie, code
Inventory: 50
```

#### Product 4: Lovable Sticker Pack
```
Title: Lovable Sticker Pack
Description: Set of 10 premium stickers
Price: $9.99
Type: Stickers
Tags: stickers, accessories
Inventory: 200
```

#### Product 5: AI Developer Tee
```
Title: AI Developer Tee
Description: Show your AI developer pride
Price: $27.99
Type: T-Shirts
Tags: ai, tshirt, developer
Inventory: 100
```

#### Product 6: Build Fast Hoodie
```
Title: Build Fast Hoodie
Description: For developers who ship quickly
Price: $62.99
Type: Hoodies
Tags: ai, hoodie, developer
Inventory: 50
```

#### Product 7: Gradient Logo Sticker
```
Title: Gradient Logo Sticker
Description: Holographic Lovable logo sticker
Price: $4.99
Type: Stickers
Tags: stickers, logo
Inventory: 300
```

#### Product 8: AI Powered Tee
```
Title: AI Powered Tee
Description: Celebrate the AI revolution
Price: $31.99
Type: T-Shirts
Tags: ai, tshirt
Inventory: 100
```

#### Product 9: Developer Cap
```
Title: Developer Cap
Description: Adjustable cap with embroidered logo
Price: $24.99
Type: Accessories
Tags: accessories, cap, hat
Inventory: 75
```

#### Product 10: Coding Mug
```
Title: Coding Mug
Description: Ceramic mug for your favorite beverage
Price: $16.99
Type: Accessories
Tags: accessories, mug, coffee
Inventory: 150
```

#### Product 11: Keyboard Stickers
```
Title: Keyboard Stickers
Description: Customize your keyboard
Price: $7.99
Type: Stickers
Tags: stickers, keyboard
Inventory: 200
```

#### Product 12: Tech Tote Bag
```
Title: Tech Tote Bag
Description: Durable canvas tote bag
Price: $19.99
Type: Accessories
Tags: accessories, bag, tote
Inventory: 100
```

**💡 Tip:** Use the "Duplicate product" button to speed up adding products!

### Phase 5: Payment Setup (10 minutes)
- [ ] Go to: Settings → Payments
- [ ] Choose payment provider:
  - **Shopify Payments** (recommended): 2.9% + 30¢
  - Or connect PayPal/Stripe
- [ ] Enable test mode (until ready for real payments)
- [ ] Save settings

### Phase 6: Shipping Setup (10 minutes)
- [ ] Go to: Settings → Shipping and delivery
- [ ] Add shipping zone: United States (or your country)
- [ ] Add shipping rates:
  - Standard: $5.99
  - Free shipping: $50+ (optional)
  - Express: $12.99 (optional)
- [ ] Save settings

### Phase 7: Test Everything (15 minutes)
- [ ] Open your website (index.html)
- [ ] Products should load from Shopify
- [ ] Click "Sign Up" and create test account
- [ ] Login with test account
- [ ] Add product to cart
- [ ] Click checkout
- [ ] Complete test purchase using:
  - Card: `4242 4242 4242 4242`
  - Expiry: Any future date
  - CVV: Any 3 digits
- [ ] Verify order appears in Shopify Admin → Orders

### Phase 8: Deploy (10 minutes)
- [ ] Commit changes to Git:
```bash
git add .
git commit -m "Add Shopify integration"
git push origin main
```
- [ ] Verify GitHub Pages is enabled
- [ ] Test live site

---

## 🆘 Quick Troubleshooting

### "Shopify is not configured" error
→ Check `config/shopify.js` has correct domain and token

### Products not loading
→ Verify API scopes are enabled
→ Check products are set to "Online Store" channel

### Can't create account
→ Enable customer accounts in Settings → Checkout

### Checkout not working
→ Verify `unauthenticated_write_checkouts` scope is enabled

---

## 📞 Get Help

- **Full Guide**: See SHOPIFY-SETUP-GUIDE.md
- **Shopify Support**: 24/7 chat at shopify.com/help
- **Check Setup**: Open browser console for error messages

---

## 🎉 You're Done!

Once all checkboxes are complete:
- ✅ Your store is live
- ✅ Customers can browse and buy
- ✅ Payments are processed securely
- ✅ Orders tracked in Shopify admin
- ✅ Emails sent automatically

**Next steps:**
1. Switch payment gateway from test to live mode
2. Add product images
3. Set up email marketing
4. Configure analytics
5. Launch marketing campaigns

---

**Time to complete: ~2-3 hours**
**Monthly cost: $29 + transaction fees**
**Revenue potential: Unlimited!** 🚀
