/**
 * Product Loader Service
 * Loads products from Shopify or falls back to local products
 */

class ProductLoader {
    constructor() {
        this.products = [];
        this.loading = false;
        this.useShopify = false;
    }

    /**
     * Initialize and load products
     */
    async init() {
        // Check if Shopify is configured
        if (window.ShopifyConfig && window.ShopifyConfig.isConfigured()) {
            console.log('Shopify configured, loading products from Shopify...');
            this.useShopify = true;
            await this.loadFromShopify();
        } else {
            console.log('Shopify not configured, using local products');
            this.loadLocalProducts();
        }
    }

    /**
     * Load products from Shopify
     */
    async loadFromShopify() {
        this.loading = true;

        try {
            // Check if we should use cache (cache for 5 seconds for quick updates)
            const cachedTimestamp = localStorage.getItem('shopify_products_timestamp');
            const cacheAge = Date.now() - (cachedTimestamp || 0);
            const maxCacheAge = 5 * 1000; // 5 seconds for quick updates

            // Always fetch fresh data if cache is old or doesn't exist
            if (!cachedTimestamp || cacheAge > maxCacheAge) {
                console.log('Fetching fresh products from Shopify...');

                // Clear ShopifyAPI internal cache too
                if (window.ShopifyAPI && window.ShopifyAPI.clearCache) {
                    window.ShopifyAPI.clearCache();
                    console.log('Cleared ShopifyAPI cache');
                }

                const shopifyProducts = await window.ShopifyAPI.fetchProducts(100);
                this.products = window.ShopifyAPI.formatProducts(shopifyProducts);

                console.log(`✓ Loaded ${this.products.length} products from Shopify`);

                // Log all products with image status
                this.products.forEach((p, i) => {
                    const hasImage = p.image || (p.images && p.images.length > 0);
                    console.log(`  ${i + 1}. ${p.name}: ${hasImage ? '✓ Has image' : '✗ No image'}`);
                });

                // Store in localStorage for offline access
                localStorage.setItem('shopify_products', JSON.stringify(this.products));
                localStorage.setItem('shopify_products_timestamp', Date.now().toString());
            } else {
                const remainingTime = Math.ceil((maxCacheAge - cacheAge) / 1000);
                console.log(`Using cached products (${remainingTime}s until refresh)`);
                const cached = localStorage.getItem('shopify_products');
                this.products = JSON.parse(cached);
            }

        } catch (error) {
            console.error('Error loading from Shopify:', error);

            // Try to load from cache
            const cached = localStorage.getItem('shopify_products');
            if (cached) {
                console.log('Using cached products due to error');
                this.products = JSON.parse(cached);
            } else {
                console.log('Falling back to local products');
                this.loadLocalProducts();
            }
        } finally {
            this.loading = false;
        }
    }

    /**
     * Force refresh products from Shopify (bypass cache)
     */
    async refreshProducts() {
        // Clear localStorage cache
        localStorage.removeItem('shopify_products');
        localStorage.removeItem('shopify_products_timestamp');

        // Clear ShopifyAPI internal cache
        if (window.ShopifyAPI && window.ShopifyAPI.clearCache) {
            window.ShopifyAPI.clearCache();
        }

        console.log('Force refreshing products from Shopify...');
        await this.loadFromShopify();

        return this.products;
    }

    /**
     * Load local hardcoded products (fallback)
     */
    loadLocalProducts() {
        // Use the global products array from script.js
        if (typeof window.products !== 'undefined') {
            this.products = window.products;
            console.log(`Loaded ${this.products.length} local products`);
        } else {
            this.products = [];
            console.warn('No products available');
        }
    }

    /**
     * Get all products
     */
    getProducts() {
        return this.products;
    }

    /**
     * Get product by ID
     */
    getProductById(id) {
        return this.products.find(p => p.id === id || p.shopifyId === id);
    }

    /**
     * Search products
     */
    searchProducts(query) {
        const lowerQuery = query.toLowerCase();
        return this.products.filter(p =>
            p.name.toLowerCase().includes(lowerQuery) ||
            p.description.toLowerCase().includes(lowerQuery) ||
            (p.tags && p.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
        );
    }

    /**
     * Filter products by category
     */
    filterByCategory(category) {
        if (category === 'all') return this.products;
        return this.products.filter(p => p.category === category);
    }

    /**
     * Check if using Shopify
     */
    isUsingShopify() {
        return this.useShopify;
    }
}

// Create singleton instance
const productLoader = new ProductLoader();

// Export for use in other files
if (typeof window !== 'undefined') {
    window.ProductLoader = productLoader;

    // Global helper function to refresh products
    window.refreshProducts = async function() {
        console.log('🔄 Refreshing products...');
        await window.ProductLoader.refreshProducts();
        console.log(`✅ Refreshed! Now showing ${window.ProductLoader.getProducts().length} products`);

        // Reload the page to update the UI
        window.location.reload();
    };
}
