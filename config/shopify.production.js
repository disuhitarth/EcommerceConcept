/**
 * Shopify Configuration - Production Version
 *
 * This file is safe to commit to GitHub.
 * Storefront token is public (read-only access).
 * Admin token is kept server-side only.
 */

const shopifyConfig = {
    // Your Shopify store domain
    domain: 'themerchconcept.myshopify.com',

    // Storefront API Access Token (public, safe to commit)
    storefrontAccessToken: '286378202a411205690b709625cb2aad',

    // Admin token is server-side only, accessed via API
    adminAccessToken: null, // Never expose admin token client-side

    // API Version
    apiVersion: '2024-01'
};

// ==================== API URLs ====================

const SHOPIFY_URLS = {
    storefront: `https://${shopifyConfig.domain}/api/${shopifyConfig.apiVersion}/graphql.json`,
    admin: `https://${shopifyConfig.domain}/admin`,
    // Admin API calls go through our backend at /api/products
    adminProxy: '/api' // Local: http://localhost:3000/api, Production: /api
};

// ==================== Error Messages ====================

const SHOPIFY_ERRORS = {
    NOT_CONFIGURED: 'Shopify is not configured. Please set up your credentials.',
    ADMIN_NOT_CONFIGURED: 'Shopify Admin API is not configured.',
    INVALID_RESPONSE: 'Invalid response from Shopify API.',
    NETWORK_ERROR: 'Network error connecting to Shopify.'
};

// ==================== Configuration Validation ====================

const isConfigured = () => {
    return shopifyConfig.domain
        && shopifyConfig.storefrontAccessToken
        && shopifyConfig.storefrontAccessToken.length > 20;
};

// ==================== GraphQL Headers ====================

const getStorefrontHeaders = () => {
    return {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': shopifyConfig.storefrontAccessToken
    };
};

// ==================== Export Configuration ====================

// Export for browser (window object)
if (typeof window !== 'undefined') {
    window.ShopifyConfig = {
        ...shopifyConfig,
        urls: SHOPIFY_URLS,
        errors: SHOPIFY_ERRORS,
        isConfigured,
        getStorefrontHeaders
    };
}

// Export for Node.js (module.exports)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ...shopifyConfig,
        urls: SHOPIFY_URLS,
        errors: SHOPIFY_ERRORS,
        isConfigured,
        getStorefrontHeaders
    };
}
