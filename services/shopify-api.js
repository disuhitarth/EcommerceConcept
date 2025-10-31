/**
 * Shopify API Service
 * Handles all API calls to Shopify Storefront API
 */

class ShopifyAPI {
    constructor() {
        this.config = window.ShopifyConfig;
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    }

    /**
     * Make GraphQL request to Shopify Storefront API
     */
    async graphql(query, variables = {}) {
        if (!this.config.isConfigured()) {
            throw new Error(this.config.errors.NOT_CONFIGURED);
        }

        try {
            const response = await fetch(this.config.urls.storefront, {
                method: 'POST',
                headers: this.config.getStorefrontHeaders(),
                body: JSON.stringify({ query, variables })
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            if (data.errors) {
                console.error('GraphQL Errors:', data.errors);
                throw new Error(data.errors[0].message);
            }

            return data.data;
        } catch (error) {
            console.error('Shopify API Error:', error);
            throw error;
        }
    }

    /**
     * Fetch all products from Shopify
     */
    async fetchProducts(first = 50, after = null) {
        const cacheKey = `products_${first}_${after}`;

        // Check cache
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }

        const query = `
            query getProducts($first: Int!, $after: String) {
                products(first: $first, after: $after) {
                    pageInfo {
                        hasNextPage
                        endCursor
                    }
                    edges {
                        cursor
                        node {
                            id
                            title
                            description
                            handle
                            productType
                            tags
                            vendor
                            availableForSale
                            createdAt
                            updatedAt
                            images(first: 5) {
                                edges {
                                    node {
                                        id
                                        url
                                        altText
                                        width
                                        height
                                    }
                                }
                            }
                            variants(first: 10) {
                                edges {
                                    node {
                                        id
                                        title
                                        price {
                                            amount
                                            currencyCode
                                        }
                                        compareAtPrice {
                                            amount
                                            currencyCode
                                        }
                                        availableForSale
                                        quantityAvailable
                                        selectedOptions {
                                            name
                                            value
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        `;

        const data = await this.graphql(query, { first, after });

        // Cache the result
        this.cache.set(cacheKey, {
            data: data.products,
            timestamp: Date.now()
        });

        return data.products;
    }

    /**
     * Fetch single product by handle
     */
    async fetchProductByHandle(handle) {
        const query = `
            query getProduct($handle: String!) {
                product(handle: $handle) {
                    id
                    title
                    description
                    descriptionHtml
                    handle
                    productType
                    tags
                    vendor
                    availableForSale
                    images(first: 10) {
                        edges {
                            node {
                                id
                                url
                                altText
                                width
                                height
                            }
                        }
                    }
                    variants(first: 20) {
                        edges {
                            node {
                                id
                                title
                                price {
                                    amount
                                    currencyCode
                                }
                                compareAtPrice {
                                    amount
                                    currencyCode
                                }
                                availableForSale
                                quantityAvailable
                                selectedOptions {
                                    name
                                    value
                                }
                                image {
                                    url
                                    altText
                                }
                            }
                        }
                    }
                }
            }
        `;

        const data = await this.graphql(query, { handle });
        return data.product;
    }

    /**
     * Create checkout with line items
     */
    async createCheckout(lineItems, customerAccessToken = null) {
        const query = `
            mutation checkoutCreate($input: CheckoutCreateInput!) {
                checkoutCreate(input: $input) {
                    checkout {
                        id
                        webUrl
                        lineItems(first: 50) {
                            edges {
                                node {
                                    id
                                    title
                                    quantity
                                    variant {
                                        id
                                        title
                                        price {
                                            amount
                                            currencyCode
                                        }
                                        image {
                                            url
                                        }
                                    }
                                }
                            }
                        }
                        subtotalPrice {
                            amount
                            currencyCode
                        }
                        totalTax {
                            amount
                            currencyCode
                        }
                        totalPrice {
                            amount
                            currencyCode
                        }
                    }
                    checkoutUserErrors {
                        code
                        field
                        message
                    }
                }
            }
        `;

        const input = {
            lineItems: lineItems.map(item => ({
                variantId: item.variantId,
                quantity: item.quantity
            }))
        };

        if (customerAccessToken) {
            input.customerAccessToken = customerAccessToken;
        }

        const data = await this.graphql(query, { input });

        if (data.checkoutCreate.checkoutUserErrors.length > 0) {
            throw new Error(data.checkoutCreate.checkoutUserErrors[0].message);
        }

        return data.checkoutCreate.checkout;
    }

    /**
     * Create customer account
     */
    async createCustomer(email, password, firstName, lastName) {
        const query = `
            mutation customerCreate($input: CustomerCreateInput!) {
                customerCreate(input: $input) {
                    customer {
                        id
                        email
                        firstName
                        lastName
                        phone
                        acceptsMarketing
                    }
                    customerUserErrors {
                        code
                        field
                        message
                    }
                }
            }
        `;

        const input = {
            email,
            password,
            firstName,
            lastName,
            acceptsMarketing: true
        };

        const data = await this.graphql(query, { input });

        if (data.customerCreate.customerUserErrors.length > 0) {
            throw new Error(data.customerCreate.customerUserErrors[0].message);
        }

        return data.customerCreate.customer;
    }

    /**
     * Login customer and get access token
     */
    async customerLogin(email, password) {
        const query = `
            mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
                customerAccessTokenCreate(input: $input) {
                    customerAccessToken {
                        accessToken
                        expiresAt
                    }
                    customerUserErrors {
                        code
                        field
                        message
                    }
                }
            }
        `;

        const input = { email, password };

        const data = await this.graphql(query, { input });

        if (data.customerAccessTokenCreate.customerUserErrors.length > 0) {
            throw new Error(data.customerAccessTokenCreate.customerUserErrors[0].message);
        }

        return data.customerAccessTokenCreate.customerAccessToken;
    }

    /**
     * Get customer data with access token
     */
    async getCustomer(customerAccessToken) {
        const query = `
            query getCustomer($customerAccessToken: String!) {
                customer(customerAccessToken: $customerAccessToken) {
                    id
                    email
                    firstName
                    lastName
                    phone
                    acceptsMarketing
                    defaultAddress {
                        id
                        address1
                        address2
                        city
                        province
                        country
                        zip
                    }
                    orders(first: 10) {
                        edges {
                            node {
                                id
                                orderNumber
                                processedAt
                                totalPrice {
                                    amount
                                    currencyCode
                                }
                                fulfillmentStatus
                                lineItems(first: 50) {
                                    edges {
                                        node {
                                            title
                                            quantity
                                            variant {
                                                image {
                                                    url
                                                }
                                                price {
                                                    amount
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        `;

        const data = await this.graphql(query, { customerAccessToken });
        return data.customer;
    }

    /**
     * Logout customer (invalidate token)
     */
    async customerLogout(customerAccessToken) {
        const query = `
            mutation customerAccessTokenDelete($customerAccessToken: String!) {
                customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
                    deletedAccessToken
                    deletedCustomerAccessTokenId
                    userErrors {
                        field
                        message
                    }
                }
            }
        `;

        const data = await this.graphql(query, { customerAccessToken });
        return data.customerAccessTokenDelete;
    }

    /**
     * Format products from Shopify to our format
     */
    formatProducts(shopifyProducts) {
        return shopifyProducts.edges.map(({ node }) => {
            const firstVariant = node.variants.edges[0]?.node;
            const firstImage = node.images.edges[0]?.node;

            return {
                id: node.id,
                shopifyId: node.id,
                name: node.title,
                description: node.description,
                price: firstVariant ? parseFloat(firstVariant.price.amount) : 0,
                originalPrice: firstVariant?.compareAtPrice
                    ? parseFloat(firstVariant.compareAtPrice.amount)
                    : null,
                image: firstImage?.url || '',
                images: node.images.edges.map(({ node: img }) => img.url),
                category: node.productType || 'Uncategorized',
                tags: node.tags,
                inStock: node.availableForSale,
                variantId: firstVariant?.id,
                variants: node.variants.edges.map(({ node: variant }) => ({
                    id: variant.id,
                    title: variant.title,
                    price: parseFloat(variant.price.amount),
                    compareAtPrice: variant.compareAtPrice
                        ? parseFloat(variant.compareAtPrice.amount)
                        : null,
                    available: variant.availableForSale,
                    quantityAvailable: variant.quantityAvailable,
                    options: variant.selectedOptions
                })),
                handle: node.handle,
                vendor: node.vendor
            };
        });
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
    }
}

// Create singleton instance
const shopifyAPI = new ShopifyAPI();

// Export for use in other files
if (typeof window !== 'undefined') {
    window.ShopifyAPI = shopifyAPI;
}
