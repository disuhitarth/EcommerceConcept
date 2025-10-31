/**
 * Shopify Configuration Template
 *
 * Setup Instructions:
 * 1. Copy this file to shopify.js in the same directory
 * 2. Replace the placeholder values with your actual Shopify credentials
 * 3. Create a Shopify store at https://www.shopify.com
 * 4. Go to Settings → Apps and sales channels → Develop apps
 * 5. Create a new app
 * 6. Configure Storefront API scopes:
 *    - unauthenticated_read_product_listings
 *    - unauthenticated_read_product_inventory
 *    - unauthenticated_write_checkouts
 *    - unauthenticated_read_checkouts
 *    - unauthenticated_write_customers
 *    - unauthenticated_read_customers
 * 7. Get your Storefront Access Token
 * 8. Replace the values below with your actual credentials
 */

const shopifyConfig = {
    // Your Shopify store domain (without https://)
    domain: 'YOUR_STORE_NAME.myshopify.com',

    // Storefront API Access Token
    storefrontAccessToken: 'YOUR_STOREFRONT_ACCESS_TOKEN',

    // API Version - Use latest stable version
    apiVersion: '2024-01',

    // Store metadata
    storeName: 'Your Store Name',
    currency: 'USD',
    locale: 'en-US'
};

// Construct API endpoint URLs
const SHOPIFY_URLS = {
    // Storefront GraphQL API endpoint
    storefront: `https://${shopifyConfig.domain}/api/${shopifyConfig.apiVersion}/graphql.json`,

    // Admin dashboard URL
    admin: `https://${shopifyConfig.domain}/admin`,

    // Products admin page
    productsAdmin: `https://${shopifyConfig.domain}/admin/products`,

    // Orders admin page
    ordersAdmin: `https://${shopifyConfig.domain}/admin/orders`,

    // Analytics admin page
    analyticsAdmin: `https://${shopifyConfig.domain}/admin/analytics/dashboard`,

    // Customers admin page
    customersAdmin: `https://${shopifyConfig.domain}/admin/customers`
};

// API request headers for Storefront API
const getStorefrontHeaders = () => ({
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': shopifyConfig.storefrontAccessToken
});

// API request headers for Admin API (if needed)
const getAdminHeaders = () => ({
    'Content-Type': 'application/json',
    'X-Shopify-Access-Token': shopifyConfig.adminApiPassword
});

// Validation: Check if Shopify is configured
const isShopifyConfigured = () => {
    return shopifyConfig.domain !== 'YOUR_STORE_NAME.myshopify.com'
        && shopifyConfig.storefrontAccessToken !== 'YOUR_STOREFRONT_ACCESS_TOKEN';
};

// Error messages
const SHOPIFY_ERRORS = {
    NOT_CONFIGURED: 'Shopify is not configured. Please update config/shopify.js with your store credentials.',
    API_ERROR: 'Failed to connect to Shopify API. Please check your credentials.',
    NETWORK_ERROR: 'Network error. Please check your internet connection.',
    PRODUCT_NOT_FOUND: 'Product not found.',
    CHECKOUT_ERROR: 'Failed to create checkout. Please try again.',
    AUTH_ERROR: 'Authentication failed. Please check your email and password.'
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = {
        shopifyConfig,
        SHOPIFY_URLS,
        getStorefrontHeaders,
        getAdminHeaders,
        isShopifyConfigured,
        SHOPIFY_ERRORS
    };
}

// Browser environment - attach to window
if (typeof window !== 'undefined') {
    window.ShopifyConfig = {
        config: shopifyConfig,
        urls: SHOPIFY_URLS,
        getStorefrontHeaders,
        getAdminHeaders,
        isConfigured: isShopifyConfigured,
        errors: SHOPIFY_ERRORS
    };
}
