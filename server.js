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

// Load Gemini configuration from environment variables
const geminiConfig = {
    apiKey: process.env.GEMINI_API_KEY,
    endpoints: {
        generateContent: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent',
        imageGeneration: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent'
    }
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

// Gemini API is optional but recommended
if (!geminiConfig.apiKey) {
    console.warn('⚠️  WARNING: GEMINI_API_KEY not set. AI features will not work.');
    console.warn('   Add GEMINI_API_KEY=your_key to .env file to enable AI features.');
}

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json({ limit: '50mb' })); // Parse JSON with increased limit for images
app.use(express.static('.')); // Serve static files from current directory

// In-memory user storage (demo mode - in production use a database)
const users = new Map();
const sessions = new Map();

// Demo admin user
users.set('admin@lovable.dev', {
    id: 'user_1',
    email: 'admin@lovable.dev',
    password: 'admin123', // In production, hash passwords!
    firstName: 'Admin',
    lastName: 'User',
    phone: '+1234567890',
    createdAt: new Date().toISOString()
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend server is running' });
});

// Create product endpoint
// Products are created with the following settings to ensure visibility:
// - status: 'active' (not draft or archived)
// - published: true (published immediately)
// - published_scope: 'web' (visible on Online Store sales channel)
// - published_at: current timestamp (publish date set to now)
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
            status: 'active',              // Make product active (not draft/archived)
            published: true,                // Publish the product immediately
            published_scope: 'web',         // Publish to Online Store sales channel
            published_at: new Date().toISOString()  // Set publish date to now
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
        console.log('Product will be published to Online Store (status: active, published_scope: web)');

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

// ==================== Authentication Endpoints ====================

// Signup endpoint
app.post('/api/auth/signup', (req, res) => {
    console.log('=== Signup request ===');
    const { email, password, firstName, lastName } = req.body;

    // Validate input
    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({
            success: false,
            error: 'All fields are required'
        });
    }

    if (password.length < 8) {
        return res.status(400).json({
            success: false,
            error: 'Password must be at least 8 characters'
        });
    }

    // Check if user already exists
    if (users.has(email)) {
        return res.status(400).json({
            success: false,
            error: 'Email already registered'
        });
    }

    // Create new user
    const user = {
        id: `user_${Date.now()}`,
        email,
        password, // In production, hash this!
        firstName,
        lastName,
        phone: '',
        createdAt: new Date().toISOString(),
        orders: []
    };

    users.set(email, user);

    // Create session
    const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

    sessions.set(sessionToken, {
        userId: user.id,
        email: user.email,
        expiresAt
    });

    console.log('✓ User created:', email);

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    res.json({
        success: true,
        user: userWithoutPassword,
        token: sessionToken,
        expiresAt
    });
});

// Login endpoint
app.post('/api/auth/login', (req, res) => {
    console.log('=== Login request ===');
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            error: 'Email and password are required'
        });
    }

    // Check if user exists
    const user = users.get(email);
    if (!user) {
        return res.status(401).json({
            success: false,
            error: 'Invalid email or password'
        });
    }

    // Verify password (in production, use bcrypt.compare!)
    if (user.password !== password) {
        return res.status(401).json({
            success: false,
            error: 'Invalid email or password'
        });
    }

    // Create session
    const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

    sessions.set(sessionToken, {
        userId: user.id,
        email: user.email,
        expiresAt
    });

    console.log('✓ User logged in:', email);

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    res.json({
        success: true,
        user: userWithoutPassword,
        token: sessionToken,
        expiresAt
    });
});

// Logout endpoint
app.post('/api/auth/logout', (req, res) => {
    const { token } = req.body;

    if (token && sessions.has(token)) {
        sessions.delete(token);
        console.log('✓ User logged out');
    }

    res.json({
        success: true,
        message: 'Logged out successfully'
    });
});

// Get current user endpoint
app.get('/api/auth/me', (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token || !sessions.has(token)) {
        return res.status(401).json({
            success: false,
            error: 'Not authenticated'
        });
    }

    const session = sessions.get(token);

    // Check if session expired
    if (new Date(session.expiresAt) < new Date()) {
        sessions.delete(token);
        return res.status(401).json({
            success: false,
            error: 'Session expired'
        });
    }

    const user = Array.from(users.values()).find(u => u.email === session.email);
    if (!user) {
        return res.status(401).json({
            success: false,
            error: 'User not found'
        });
    }

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    res.json({
        success: true,
        user: userWithoutPassword
    });
});

// ==================== Gemini AI Endpoints ====================

// Generate product image from text
app.post('/api/gemini/generate-image', async (req, res) => {
    console.log('=== Gemini image generation request ===');

    if (!geminiConfig.apiKey) {
        return res.status(503).json({
            success: false,
            error: 'Gemini API is not configured on server'
        });
    }

    try {
        const { prompt, generationConfig, safetySettings } = req.body;

        if (!prompt) {
            return res.status(400).json({
                success: false,
                error: 'Prompt is required'
            });
        }

        console.log('Generating image for prompt:', prompt);

        const response = await fetch(geminiConfig.endpoints.imageGeneration, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-goog-api-key': geminiConfig.apiKey
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: generationConfig || {
                    temperature: 0.4,
                    topK: 32,
                    topP: 1,
                    maxOutputTokens: 4096
                },
                safetySettings: safetySettings || [
                    { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                    { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                    { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                    { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
                ]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Gemini API error:', errorData);
            return res.status(response.status).json({
                success: false,
                error: errorData.error?.message || 'Gemini API error',
                details: errorData
            });
        }

        const data = await response.json();
        console.log('✓ Image generated successfully');

        res.json({
            success: true,
            data: data
        });

    } catch (error) {
        console.error('=== Gemini Generation Error ===');
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Internal server error'
        });
    }
});

// Enhance/edit existing image
app.post('/api/gemini/enhance-image', async (req, res) => {
    console.log('=== Gemini image enhancement request ===');

    if (!geminiConfig.apiKey) {
        return res.status(503).json({
            success: false,
            error: 'Gemini API is not configured on server'
        });
    }

    try {
        const { imageBase64, instructions, generationConfig, safetySettings } = req.body;

        if (!imageBase64 || !instructions) {
            return res.status(400).json({
                success: false,
                error: 'Image and instructions are required'
            });
        }

        console.log('Enhancing image with instructions:', instructions);

        // Remove data URI prefix if present
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

        const response = await fetch(geminiConfig.endpoints.imageGeneration, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-goog-api-key': geminiConfig.apiKey
            },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        {
                            inlineData: {
                                mimeType: 'image/png',
                                data: base64Data
                            }
                        },
                        {
                            text: instructions
                        }
                    ]
                }],
                generationConfig: generationConfig || {
                    temperature: 0.4,
                    topK: 32,
                    topP: 1,
                    maxOutputTokens: 4096
                },
                safetySettings: safetySettings || [
                    { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                    { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                    { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                    { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
                ]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Gemini API error:', errorData);
            return res.status(response.status).json({
                success: false,
                error: errorData.error?.message || 'Gemini API error',
                details: errorData
            });
        }

        const data = await response.json();
        console.log('✓ Image enhanced successfully');

        res.json({
            success: true,
            data: data
        });

    } catch (error) {
        console.error('=== Gemini Enhancement Error ===');
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Internal server error'
        });
    }
});

// Analyze product image
app.post('/api/gemini/analyze-image', async (req, res) => {
    console.log('=== Gemini image analysis request ===');

    if (!geminiConfig.apiKey) {
        return res.status(503).json({
            success: false,
            error: 'Gemini API is not configured on server'
        });
    }

    try {
        const { imageBase64, prompt } = req.body;

        if (!imageBase64 || !prompt) {
            return res.status(400).json({
                success: false,
                error: 'Image and prompt are required'
            });
        }

        console.log('Analyzing product image...');

        // Remove data URI prefix if present
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

        const response = await fetch(geminiConfig.endpoints.generateContent, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-goog-api-key': geminiConfig.apiKey
            },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        {
                            inlineData: {
                                mimeType: 'image/png',
                                data: base64Data
                            }
                        },
                        {
                            text: prompt
                        }
                    ]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Gemini API error:', errorData);
            return res.status(response.status).json({
                success: false,
                error: errorData.error?.message || 'Gemini API error',
                details: errorData
            });
        }

        const data = await response.json();
        console.log('✓ Image analyzed successfully');

        res.json({
            success: true,
            data: data
        });

    } catch (error) {
        console.error('=== Gemini Analysis Error ===');
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Internal server error'
        });
    }
});

// Optimize text content
app.post('/api/gemini/optimize-text', async (req, res) => {
    console.log('=== Gemini text optimization request ===');

    if (!geminiConfig.apiKey) {
        return res.status(503).json({
            success: false,
            error: 'Gemini API is not configured on server'
        });
    }

    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({
                success: false,
                error: 'Prompt is required'
            });
        }

        console.log('Optimizing text...');

        const response = await fetch(geminiConfig.endpoints.generateContent, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-goog-api-key': geminiConfig.apiKey
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 512
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Gemini API error:', errorData);
            return res.status(response.status).json({
                success: false,
                error: errorData.error?.message || 'Gemini API error',
                details: errorData
            });
        }

        const data = await response.json();
        console.log('✓ Text optimized successfully');

        res.json({
            success: true,
            data: data
        });

    } catch (error) {
        console.error('=== Gemini Optimization Error ===');
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Internal server error'
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
    console.log('Authentication:');
    console.log(`  ✓ Demo auth enabled`);
    console.log(`  Demo user: admin@lovable.dev / admin123`);
    console.log(`  Or create new account via /signup.html`);
    console.log('');
    console.log('Gemini AI:');
    if (geminiConfig.apiKey) {
        console.log(`  ✓ Gemini API configured`);
        console.log(`  API Key: ${geminiConfig.apiKey.substring(0, 15)}...`);
    } else {
        console.log(`  ⚠️  Gemini API not configured (AI features disabled)`);
    }
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
