# Shopify Admin API Setup Guide

## Why You Need This

Your store currently has **Storefront API** access (read-only), which lets customers view products. To **CREATE products** from the add-product page, you need **Admin API** access with write permissions.

---

## Step-by-Step Setup

### 1. Go to Shopify Admin

Visit: [https://themerchconcept.myshopify.com/admin](https://themerchconcept.myshopify.com/admin)

Log in with your store credentials.

---

### 2. Navigate to App Development

1. Click **Settings** (bottom left)
2. Go to **Apps and sales channels**
3. Click **Develop apps** (or **Develop apps for your store**)

If you see "App development is disabled":
- Click **Allow custom app development**
- Click **Allow custom app development** again to confirm

---

### 3. Create a New App

1. Click **Create an app**
2. App name: `Product Manager` (or any name you prefer)
3. App developer: Select yourself
4. Click **Create app**

---

### 4. Configure Admin API Scopes

1. Click **Configure Admin API scopes**
2. Scroll down and find the **Products** section
3. Check these boxes:
   - ✅ `write_products` - Create and update products
   - ✅ `read_products` - Read product data

**Optional but recommended:**
- ✅ `write_inventory` - Manage inventory levels
- ✅ `read_inventory` - Read inventory data
- ✅ `write_product_listings` - Manage product listings
- ✅ `read_product_listings` - Read product listings

4. Click **Save** at the top right

---

### 5. Install the App

1. Click the **API credentials** tab
2. Click **Install app**
3. Click **Install** to confirm

---

### 6. Get Your Admin API Access Token

1. Under **Admin API access token**, click **Reveal token once**
2. **COPY the token immediately** - you'll only see it once!

Example token format:
```
shpat_abc123def456ghi789jkl012mno345pqr
```

⚠️ **IMPORTANT**: This token gives full access to your store. Keep it secure!

---

### 7. Add Token to Your Config

1. Open `config/shopify.js` in your code
2. Find this line:
   ```javascript
   adminAccessToken: 'YOUR_ADMIN_ACCESS_TOKEN',
   ```
3. Replace `YOUR_ADMIN_ACCESS_TOKEN` with your actual token:
   ```javascript
   adminAccessToken: 'shpat_abc123def456ghi789jkl012mno345pqr',
   ```
4. Save the file

---

## Testing the Integration

### 1. Refresh Your Browser

Reload the `add-product.html` page.

### 2. Fill Out the Product Form

- **Product Name**: Test Product
- **Description**: This is a test product
- **Price**: 25.00
- **Category**: Test
- **Upload an image** or **generate with AI**

### 3. Click "Add Product to Shopify"

If everything is set up correctly:
- ✅ You'll see "Creating product in Shopify..."
- ✅ Then "Product created successfully!"
- ✅ Confirmation dialog with link to view in Shopify Admin
- ✅ Product appears in your Shopify store

---

## What Happens When You Create a Product

1. **Product is created** in your Shopify store with:
   - Title, description, price
   - Category, tags, vendor
   - Images (uploaded or AI-generated)
   - Inventory quantity

2. **Product gets a unique URL**:
   - Admin: `https://themerchconcept.myshopify.com/admin/products/[ID]`
   - Storefront: `https://themerchconcept.myshopify.com/products/[handle]`

3. **Product is published** and available for sale immediately

---

## Troubleshooting

### Error: "Shopify Admin API not configured"

**Problem**: Token not added or incorrect

**Fix**:
1. Check `config/shopify.js`
2. Make sure `adminAccessToken` is not `'YOUR_ADMIN_ACCESS_TOKEN'`
3. Token should start with `shpat_`
4. Token should be 30+ characters long

### Error: "Failed to create product. Please check your Admin API token"

**Problem**: Invalid token or missing permissions

**Fix**:
1. Go back to Shopify Admin → Apps → Your app
2. Click **API credentials**
3. Verify `write_products` scope is enabled
4. If needed, regenerate token:
   - Click the **⋮** menu → **Delete app**
   - Create a new app (follow steps 3-6 again)

### Error: 401 Unauthorized

**Problem**: Token is invalid or expired

**Fix**:
1. Regenerate the token (steps 3-6)
2. Update `config/shopify.js` with the new token

### Error: "Image upload failed"

**Problem**: Images too large or invalid format

**Fix**:
- Images must be under 10MB
- Supported formats: PNG, JPG, WEBP
- Try using AI-generated images (always work)
- For external URLs: right-click → Save Image → upload file

---

## Security Best Practices

### ✅ DO:
- Keep your `adminAccessToken` private
- Never commit `config/shopify.js` with real token to GitHub
- Regenerate token if accidentally exposed
- Use environment variables for production

### ❌ DON'T:
- Share your Admin API token publicly
- Commit tokens to version control
- Use the same token across multiple projects
- Screenshot tokens and share online

---

## Current Configuration

Your store is already configured with:
- ✅ Storefront API (read-only)
- ✅ Domain: `themerchconcept.myshopify.com`
- ✅ API Version: `2024-01`

You just need to add:
- ⏳ Admin API token

---

## What Can You Do After Setup?

### Product Management
- ✅ Create new products from add-product page
- ✅ Generate product images with AI
- ✅ Auto-fill product details from images
- ✅ Remove backgrounds from product photos
- ✅ Upscale images with AI
- ✅ Set prices, inventory, and categories
- ✅ Upload multiple images per product

### Workflow Example
1. Upload product photo (or generate with AI)
2. Click "Auto-fill from Images" → AI generates name, description, category
3. Click "Optimize" to improve text for SEO
4. Remove background and upscale images
5. Click "Add Product to Shopify" → Product goes live!

---

## Need Help?

### Check the Console
1. Open browser console (F12)
2. Look for error messages
3. Check logs from `ShopifyAPI.createProduct()`

### Common Issues
- Token not configured → See "Error: Shopify Admin API not configured" above
- Permission denied → Check API scopes in step 4
- Network error → Check internet connection

### Still Stuck?
1. Verify token is correct in `config/shopify.js`
2. Check console for detailed error messages
3. Try regenerating the token
4. Ensure `write_products` scope is enabled

---

## Next Steps

Once you have Admin API configured:

1. **Test product creation** with a simple test product
2. **Try AI features**:
   - Generate product images from text
   - Auto-fill product details from images
   - Remove backgrounds and upscale
3. **Create real products** for your store
4. **Share your store** with customers!

---

**Built with Shopify Admin API + Google Gemini AI**
