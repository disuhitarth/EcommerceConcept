# Lovable Supply - Development Guide

## Development Server with Auto-Reload

The development server automatically reloads the browser when you make changes to HTML, CSS, or JavaScript files.

### Starting the Server

```bash
npm run dev
```

Or directly:

```bash
node dev-server.js
```

The server will start on **http://localhost:8000**

### Features

✅ **Auto-reload** - Browser automatically refreshes when files change
✅ **Shopify Integration** - Fetches products from your Shopify store
✅ **Cache Management** - 1-minute cache during development for faster updates
✅ **Live Watching** - Monitors `.html`, `.css`, `.js`, and `.json` files

### How It Works

1. **File Watching**: The server monitors all files in your project
2. **Change Detection**: When you save a file, it's detected immediately
3. **Browser Reload**: The browser automatically refreshes to show changes
4. **No Manual Refresh**: Just save and see your changes!

### Shopify Product Images

Images are automatically fetched from Shopify with a 1-minute cache:

- **First load**: Fetches fresh data from Shopify
- **Within 1 minute**: Uses cached data
- **After 1 minute**: Automatically fetches fresh data

You can also **force refresh** by clicking the "🔄 Refresh from Shopify" button.

### Console Output

The server provides helpful console messages:

```
✓ Loaded 13 products from Shopify
  1. AI Builder Hoodie: ✓ Has image
  2. Chat with AI Tee: ✓ Has image
  3. Code Generator Hoodie: ✗ No image
  ...
```

This helps you see which products have images uploaded in Shopify.

### Troubleshooting

**Images not showing?**
1. Open browser console (F12)
2. Check if products are loading from Shopify
3. Click "🔄 Refresh from Shopify" button
4. Verify images are uploaded in Shopify admin

**Cache issues?**
```javascript
// Run this in browser console to clear cache:
localStorage.clear();
location.reload();
```

**Port already in use?**
```bash
# Find and kill process on port 8000
lsof -i :8000
kill <PID>
```

### Development Workflow

1. Start the server: `npm run dev`
2. Open http://localhost:8000 in your browser
3. Make changes to your code
4. Save the file
5. Browser automatically refreshes - see your changes!

### Stopping the Server

Press `Ctrl + C` in the terminal where the server is running.

---

## Shopify Configuration

Your store: **themerchconcept.myshopify.com**

Edit configuration in: `config/shopify.js`

### Adding Products to Shopify

1. Go to Shopify Admin → Products
2. Add/Edit products
3. Upload product images
4. Set status to "Active"
5. Publish to "Online Store" channel
6. Refresh your site (or wait 1 minute)

---

**Built with Lovable** 🚀
