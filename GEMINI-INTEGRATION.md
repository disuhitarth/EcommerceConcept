# Google Gemini AI Image Generation Integration

## ⚠️ SECURITY FIRST!

**IMPORTANT:** The API key you shared in our conversation is now **publicly visible**. Please:

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. **DELETE** the key: `AIzaSyCoBOj4Q0yTiAMldCzJfjYnTaWzrFioABc`
3. **Generate a NEW key**
4. Replace it in `config/gemini.js`

---

## What's Integrated

### 🎨 AI Image Generation & Editing Features

Your add-product page now has:

1. **Text-to-Image Generation** - Describe a product, get a professional photo (powered by Gemini 2.5 Flash Image)
2. **Generate Variations** - Create 3 different angles/styles at once
3. **AI Background Removal** - Automatically remove backgrounds from product photos with AI precision
4. **AI Super Resolution** - Upscale and enhance image quality, sharpness, and detail
5. **AI Image Editing** - Select uploaded images and edit them with natural language
6. **🆕 AI Auto-fill** - Analyze product images and automatically fill product name, description, category, and suggested price
7. **🆕 Text Optimization** - Improve existing product names and descriptions with AI to be more SEO-friendly and compelling
8. **Seamless Integration** - All AI features work together:
   - Chain multiple enhancements on the same image
   - Multi-image batch processing
   - Real-time preview updates
   - Original image backup
   - Smart content generation from images

**⚡ Recently Fixed**: Updated to use the correct `gemini-2.5-flash-image` model and proper API authentication headers.

---

## Setup Instructions

### 1. Get Your API Key (Safely)

1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. Click **"Create API Key"**
3. Copy your new key
4. **DO NOT share it publicly!**

### 2. Configure the Integration

```bash
# Open the config file
open config/gemini.js

# Replace YOUR_GEMINI_API_KEY with your actual key
apiKey: 'YOUR_NEW_API_KEY_HERE',
```

### 3. Test It

1. Go to http://localhost:8000/add-product.html
2. In the "AI Image Generation" section, type:
   ```
   Blue hoodie with Lovable logo, studio lighting, white background
   ```
3. Click **"✨ Generate Image"**
4. Wait 10-30 seconds
5. AI-generated image appears! 🎉

---

## How to Use

### Generate Single Image

**Example Prompts:**
```
Red t-shirt with logo, minimal white background, professional product photo

Black baseball cap with embroidered text, side angle, soft lighting

Coffee mug with colorful design, on wooden table, morning light
```

**Tips:**
- Be specific about colors, style, background
- Mention lighting (studio, natural, soft, etc.)
- Specify angle (front, side, 45 degree, etc.)
- Include "professional product photography" for best results

### Generate 3 Variations

Click **"🎨 Generate 3 Variations"** to get:
- Front view with white background
- 45-degree angle with gradient background
- Lifestyle setting with context

Perfect for giving customers multiple views!

---

## Pricing

| Feature | Cost per Image | Notes |
|---------|---------------|-------|
| Text-to-Image Generation | ~$0.04 | Up to 1024x1024px |
| Generate 3 Variations | ~$0.12 | 3 different angles/styles |
| Background Removal | ~$0.04 | Per image processed |
| AI Upscaling | ~$0.04 | Per image enhanced |
| Custom AI Editing | ~$0.04 | Per image edited |
| Auto-fill from Images | ~$0.01 | Per analysis (text-only response) |
| Text Optimization | ~$0.01 | Per field optimized (text-only) |

**Monthly Estimates (per feature):**
- 100 images = $4
- 500 images = $20
- 1000 images = $40

**Example Workflows:**
- Upload + Auto-fill + Optimize = ~$0.02 per product (text only)
- Generate + Remove Background + Upscale = ~$0.12 per product
- Upload + Auto-fill + Remove BG + Upscale = ~$0.09 per product
- Generate 3 variations + Upscale all = ~$0.24 per product set
- Full workflow (Upload + Auto-fill + Optimize + BG Remove + Upscale) = ~$0.10 per product

---

## Features

### What Works

✅ Generate product images from text descriptions
✅ Create multiple variations automatically
✅ AI-powered background removal (replaces products with clean backgrounds)
✅ AI super resolution upscaling (enhances quality and sharpness)
✅ Natural language image editing
✅ 🆕 Auto-fill product details from images (name, description, category, price)
✅ 🆕 Optimize existing text content for SEO and conversions
✅ Professional e-commerce quality
✅ Seamless integration with upload system
✅ Batch process multiple images at once
✅ Shows in multi-image preview gallery
✅ Preserves original images as backup

### Advanced Options

The system automatically:
- Adds professional lighting
- Uses e-commerce best practices
- Creates clean compositions
- Removes watermarks (uses SynthID instead)
- Generates 1024x1024px images

---

## File Structure

```
config/
  ├── gemini.js           # Your API key (NOT committed to Git)
  └── gemini.example.js   # Template for sharing

services/
  └── gemini-service.js   # API integration logic

add-product.html          # UI with AI generation section
```

---

## Troubleshooting

### "Gemini API is not configured"

**Fix:** Open `config/gemini.js` and add your API key

### "Failed to generate image"

**Check:**
1. API key is valid
2. You have quota remaining
3. Internet connection is working
4. Prompt is clear and specific

### Images take too long

- Normal: 10-30 seconds for 1 image
- Normal: 30-60 seconds for 3 variations
- Try shorter, simpler prompts

### API Quota Exceeded

Google provides free tier, then pay-as-you-go:
- Free tier: Limited requests per minute
- Paid: $30 per 1 million tokens

Check usage: [Google AI Studio](https://aistudio.google.com)

---

## Best Practices

### Good Prompts ✅

```
Navy blue hoodie with white logo, centered, white background, studio lighting

Ceramic coffee mug with colorful gradient design, side view, soft shadows

Laptop sticker pack, colorful designs, flat lay, white surface
```

### Bad Prompts ❌

```
hoodie (too vague)

the best product ever made (not specific)

make it look cool (subjective)
```

### Pro Tips

1. **Be Specific** - Colors, materials, style
2. **Mention Background** - White, gradient, lifestyle
3. **Specify Lighting** - Studio, natural, soft
4. **Include Angle** - Front, side, 45-degree
5. **Add Context** - "professional product photography"

---

## Security Notes

### ✅ Safe Practices

- Store API key in `config/gemini.js` (gitignored)
- Never commit API keys to Git
- Regenerate keys if exposed
- Use environment variables for production

### ❌ Unsafe Practices

- Sharing API keys in conversations/emails
- Committing keys to GitHub
- Using same key across projects
- Sharing API key with unauthorized users

---

## How to Use AI Features

### 1. Background Removal
1. Upload or generate product images
2. Click images to select them (purple border)
3. Click **"🎨 Remove Background"** button
4. Wait 10-30 seconds per image
5. Background is automatically removed, leaving clean white/transparent background

**Perfect for:** Product photos with distracting backgrounds, making professional e-commerce listings

### 2. AI Upscaling (Super Resolution)
1. Upload or generate product images
2. Click images to select them
3. Click **"✨ AI Upscale"** button
4. Wait 10-30 seconds per image
5. Images are enhanced with better quality, sharpness, and detail

**Perfect for:** Low-resolution photos, improving overall image quality, making images look more professional

### 3. Custom AI Editing
1. Upload or generate product images
2. Click images to select them
3. Type custom instructions like:
   - "Change background to gradient blue"
   - "Add soft shadows under the product"
   - "Make lighting brighter and more dramatic"
4. Click **"✨ Edit with AI"**
5. AI processes each image with your custom edits

**Perfect for:** Specific creative edits, lighting adjustments, style changes

### 4. AI Auto-fill from Images
1. Upload product images (or generate with AI)
2. **(Optional)** Click on an image to select which one to analyze
   - If you select images, AI analyzes the first selected image
   - If no selection, AI analyzes the first uploaded image (primary)
   - The hint text updates to show which image will be analyzed
3. Click **"🤖 Auto-fill from Images"** button
4. AI analyzes the chosen image and automatically fills:
   - Product Name (catchy, SEO-friendly)
   - Product Description (detailed, benefit-focused)
   - Product Category
   - Suggested Price Range
5. Review and edit as needed

**Perfect for:** Quickly listing products, getting SEO-optimized content, saving time on product descriptions

**Smart Image Selection:**
- **No selection** → Analyzes first/primary image
- **Image selected** → Analyzes the selected image (gives you full control!)
- **Multiple selected** → Analyzes the first one you selected
- Hint text shows: "Will analyze selected image #2" or "Will analyze primary image (first)"

**Example:** Upload a photo of a blue hoodie → AI generates:
- **Name:** "Premium Cotton Hoodie - Classic Blue"
- **Description:** "Stay comfortable and stylish with this premium cotton hoodie. Features a soft fleece lining, adjustable drawstring hood, and spacious kangaroo pocket. Perfect for casual wear or layering."
- **Category:** "Apparel"
- **Price:** "$35"

**⚠️ Note on External Images:** Images dragged directly from Pinterest or other external sites may not work with AI features due to CORS (security) restrictions. If you see a warning, simply:
1. Right-click the image → "Save Image As..."
2. Upload the downloaded file
3. AI features will work normally

### 5. Text Optimization
Each text field has an **"✨ Optimize"** button:
1. Enter your initial product name or description
2. Click the **"✨ Optimize"** button next to the field
3. AI improves the text to be:
   - More SEO-friendly
   - More compelling and conversion-focused
   - Better structured and professional
4. Review the optimized version

**Perfect for:** Improving draft content, SEO optimization, making descriptions more compelling

**Example Optimizations:**
- **Before:** "Blue hoodie for sale"
- **After:** "Classic Blue Pullover Hoodie - Premium Cotton Comfort"

- **Before:** "This is a nice hoodie that comes in blue"
- **After:** "Experience ultimate comfort with our premium blue pullover hoodie. Crafted from soft, breathable cotton with a cozy fleece lining, this versatile piece is perfect for everyday wear."

### Chain Multiple Features
You can combine AI features for a complete workflow:
1. Upload a raw product photo
2. Click **"🤖 Auto-fill from Images"** → Get product details
3. Click **"✨ Optimize"** on description → Improve the text
4. Select the image → **"🎨 Remove Background"** → Clean photo
5. Select again → **"✨ AI Upscale"** → Higher quality
6. Ready to publish!

Each step builds on the previous one for a professional product listing.

## Integration with Existing Features

All AI-enhanced images work with:

- **Multi-Image Preview** - Navigate with arrows, see thumbnails
- **Image Selection** - Click to select, process multiple at once
- **Form Submit** - Tracks which images have AI enhancements
- **Original Backup** - Each image keeps its original version in memory

---

## API Documentation

Full Gemini API docs:
- https://ai.google.dev/gemini-api/docs/image-generation
- https://aistudio.google.com/apikey

---

## Support

**Issues?**
1. Check API key is valid
2. Check console for errors (F12 → Console)
3. Verify you have internet connection
4. Try a different/simpler prompt

**External Image Issues:**
If AI features don't work with dragged images from Pinterest/other sites:
1. The browser blocks access due to CORS security
2. You'll see: "⚠️ Image added but AI features may not work with external URLs"
3. **Solution:** Right-click → Save Image → Upload the file instead

**Still stuck?**
Open your browser console (F12) and look for error messages.

---

## Next Steps

Want to add more AI features?

### Possible Enhancements:
- **AI Background Replacement** - "Change background to coffee shop"
- **Style Transfer** - "Make it look like watercolor painting"
- **Smart Editing** - "Add dramatic lighting"
- **Product Mockups** - Generate on different items
- **Batch Generation** - Generate entire product line

Let me know what you'd like to add next! 🚀

---

**Built with ❤️ using Google Gemini & Claude Code**
