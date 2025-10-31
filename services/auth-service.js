/**
 * Authentication Service
 * Handles user authentication state and operations
 */

class AuthService {
    constructor() {
        this.storageKey = 'shopify_customer_token';
        this.customerKey = 'shopify_customer_data';
        this.init();
    }

    init() {
        // Check if token is expired on load
        const token = this.getToken();
        if (token) {
            this.validateToken().catch(() => {
                this.logout();
            });
        }
    }

    /**
     * Check if user is logged in
     */
    isLoggedIn() {
        return !!this.getToken();
    }

    /**
     * Get stored access token
     */
    getToken() {
        const tokenData = localStorage.getItem(this.storageKey);
        if (!tokenData) return null;

        try {
            const { token, expiresAt } = JSON.parse(tokenData);

            // Check if token is expired
            if (new Date(expiresAt) < new Date()) {
                this.logout();
                return null;
            }

            return token;
        } catch (error) {
            console.error('Error parsing token:', error);
            return null;
        }
    }

    /**
     * Store access token
     */
    setToken(token, expiresAt) {
        const tokenData = {
            token,
            expiresAt
        };
        localStorage.setItem(this.storageKey, JSON.stringify(tokenData));
    }

    /**
     * Get stored customer data
     */
    getCustomer() {
        const customerData = localStorage.getItem(this.customerKey);
        if (!customerData) return null;

        try {
            return JSON.parse(customerData);
        } catch (error) {
            console.error('Error parsing customer data:', error);
            return null;
        }
    }

    /**
     * Store customer data
     */
    setCustomer(customer) {
        localStorage.setItem(this.customerKey, JSON.stringify(customer));
    }

    /**
     * Login with email and password
     */
    async login(email, password) {
        try {
            // Call Shopify API
            const tokenData = await window.ShopifyAPI.customerLogin(email, password);

            // Store token
            this.setToken(tokenData.accessToken, tokenData.expiresAt);

            // Fetch and store customer data
            const customer = await window.ShopifyAPI.getCustomer(tokenData.accessToken);
            this.setCustomer(customer);

            return { success: true, customer };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Create new customer account
     */
    async signup(email, password, firstName, lastName) {
        try {
            // Create customer
            const customer = await window.ShopifyAPI.createCustomer(
                email,
                password,
                firstName,
                lastName
            );

            // Automatically log in after signup
            return await this.login(email, password);
        } catch (error) {
            console.error('Signup error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Logout current user
     */
    async logout() {
        const token = this.getToken();

        if (token) {
            try {
                await window.ShopifyAPI.customerLogout(token);
            } catch (error) {
                console.error('Logout error:', error);
            }
        }

        // Clear local storage
        localStorage.removeItem(this.storageKey);
        localStorage.removeItem(this.customerKey);

        // Redirect to home
        window.location.href = 'index.html';
    }

    /**
     * Validate stored token
     */
    async validateToken() {
        const token = this.getToken();
        if (!token) return false;

        try {
            const customer = await window.ShopifyAPI.getCustomer(token);
            this.setCustomer(customer);
            return true;
        } catch (error) {
            console.error('Token validation error:', error);
            return false;
        }
    }

    /**
     * Refresh customer data
     */
    async refreshCustomer() {
        const token = this.getToken();
        if (!token) return null;

        try {
            const customer = await window.ShopifyAPI.getCustomer(token);
            this.setCustomer(customer);
            return customer;
        } catch (error) {
            console.error('Error refreshing customer:', error);
            return null;
        }
    }

    /**
     * Get customer orders
     */
    async getOrders() {
        const customer = this.getCustomer();
        if (!customer || !customer.orders) return [];

        return customer.orders.edges.map(({ node }) => ({
            id: node.id,
            orderNumber: node.orderNumber,
            date: new Date(node.processedAt),
            total: parseFloat(node.totalPrice.amount),
            currency: node.totalPrice.currencyCode,
            status: node.fulfillmentStatus,
            items: node.lineItems.edges.map(({ node: item }) => ({
                title: item.title,
                quantity: item.quantity,
                image: item.variant?.image?.url,
                price: parseFloat(item.variant?.price?.amount || 0)
            }))
        }));
    }

    /**
     * Protect route - redirect if not logged in
     */
    requireAuth() {
        if (!this.isLoggedIn()) {
            // Store intended destination
            sessionStorage.setItem('redirect_after_login', window.location.pathname);
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }

    /**
     * Redirect to intended page after login
     */
    redirectAfterLogin() {
        const intended = sessionStorage.getItem('redirect_after_login');
        sessionStorage.removeItem('redirect_after_login');

        if (intended && intended !== '/login.html' && intended !== '/signup.html') {
            window.location.href = intended;
        } else {
            window.location.href = 'account.html';
        }
    }
}

// Create singleton instance
const authService = new AuthService();

// Export for use in other files
if (typeof window !== 'undefined') {
    window.AuthService = authService;
}
