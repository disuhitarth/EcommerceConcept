/**
 * Backend Server for Shopify Admin API Proxy
 * Handles product creation requests from frontend
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Load Shopify configuration from environment variables
const shopifyConfig = {
    domain: process.env.SHOPIFY_DOMAIN,
    adminAccessToken: process.env.SHOPIFY_ADMIN_TOKEN,
    apiVersion: process.env.SHOPIFY_API_VERSION || '2024-01'
};

// Validate configuration
if (!shopifyConfig.domain || !shopifyConfig.adminAccessToken) {
    console.error('❌ ERROR: Missing Shopify configuration!');
    console.error('Please create a .env file with:');
    console.error('  SHOPIFY_DOMAIN=your-store.myshopify.com');
    console.error('  SHOPIFY_ADMIN_TOKEN=shpat_your_token_here');
    console.error('  SHOPIFY_API_VERSION=2024-01');
    process.exit(1);
}

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json({ limit: '50mb' })); // Parse JSON with increased limit for images
app.use(express.static('.')); // Serve static files from current directory

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend server is running' });
});

// Create product endpoint
app.post('/api/products', async (req, res) => {
    console.log('=== Received product creation request ===');
    console.log('Product title:', req.body.title);
    console.log('Number of images:', req.body.images?.length || 0);

    try {
        const {
            title,
            description,
            price,
            compareAtPrice,
            category,
            tags,
            vendor,
            images = [],
            variants = [],
            inventory = 100
        } = req.body;

        // Validate required fields
        if (!title || !price) {
            return res.status(400).json({
                success: false,
                error: 'Title and price are required'
            });
        }

        // Build product object for Shopify REST API
        const product = {
            title,
            body_html: description || '',
            vendor: vendor || 'The Merch Concept',
            product_type: category || 'General',
            tags: Array.isArray(tags) ? tags.join(', ') : tags || '',
            status: 'active',
            published: true
        };

        // Add variants with pricing
        if (variants.length > 0) {
            product.variants = variants.map(variant => ({
                option1: variant.option1,
                price: variant.price.toString(),
                compare_at_price: variant.compareAtPrice ? variant.compareAtPrice.toString() : null,
                inventory_quantity: variant.inventory || inventory,
                inventory_management: 'shopify'
            }));
        } else {
            // Default single variant
            product.variants = [{
                price: price.toString(),
                compare_at_price: compareAtPrice ? compareAtPrice.toString() : null,
                inventory_quantity: inventory,
                inventory_management: 'shopify'
            }];
        }

        // Add images
        if (images.length > 0) {
            product.images = images.map((img, index) => {
                // If image is base64, convert to attachment format
                if (img.startsWith('data:image')) {
                    const base64Data = img.split(',')[1];
                    const mimeType = img.match(/data:image\/(\w+);/)?.[1] || 'png';
                    return {
                        attachment: base64Data,
                        filename: `product-image-${index + 1}.${mimeType}`
                    };
                }
                // If image is URL
                return { src: img };
            });
        }

        console.log('Sending request to Shopify Admin API...');

        // Call Shopify Admin API
        const shopifyResponse = await fetch(
            `https://${shopifyConfig.domain}/admin/api/${shopifyConfig.apiVersion}/products.json`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Access-Token': shopifyConfig.adminAccessToken
                },
                body: JSON.stringify({ product })
            }
        );

        console.log('Shopify response status:', shopifyResponse.status);

        if (!shopifyResponse.ok) {
            const errorData = await shopifyResponse.json();
            console.error('Shopify API error:', errorData);
            return res.status(shopifyResponse.status).json({
                success: false,
                error: errorData.errors || 'Failed to create product in Shopify',
                details: errorData
            });
        }

        const data = await shopifyResponse.json();
        console.log('✓ Product created successfully:', data.product.id);

        // Return success response
        res.json({
            success: true,
            product: data.product,
            adminUrl: `https://${shopifyConfig.domain}/admin/products/${data.product.id}`,
            storefront: `https://${shopifyConfig.domain}/products/${data.product.handle}`
        });

    } catch (error) {
        console.error('=== Server Error ===');
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Internal server error'
        });
    }
});

// Get products endpoint (optional - for listing products)
app.get('/api/products', async (req, res) => {
    try {
        const shopifyResponse = await fetch(
            `https://${shopifyConfig.domain}/admin/api/${shopifyConfig.apiVersion}/products.json?limit=50`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Access-Token': shopifyConfig.adminAccessToken
                }
            }
        );

        if (!shopifyResponse.ok) {
            throw new Error(`Shopify API error: ${shopifyResponse.statusText}`);
        }

        const data = await shopifyResponse.json();
        res.json(data);

    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log('╔══════════════════════════════════════════════════╗');
    console.log('║   Shopify Product Manager Backend Server        ║');
    console.log('╚══════════════════════════════════════════════════╝');
    console.log('');
    console.log(`✓ Server running on: http://localhost:${PORT}`);
    console.log(`✓ API endpoint: http://localhost:${PORT}/api/products`);
    console.log(`✓ Frontend: http://localhost:${PORT}/add-product.html`);
    console.log('');
    console.log('Shopify Configuration:');
    console.log(`  Store: ${shopifyConfig.domain}`);
    console.log(`  API Version: ${shopifyConfig.apiVersion}`);
    console.log(`  Admin Token: ${shopifyConfig.adminAccessToken.substring(0, 15)}...`);
    console.log('');
    console.log('Ready to create products! 🚀');
    console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
    });
});
