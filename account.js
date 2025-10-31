/**
 * Account Dashboard Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // Require authentication
    if (!window.AuthService.requireAuth()) {
        return;
    }

    // Load customer data
    loadCustomerData();

    // Setup logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Check if user has admin access (you can customize this logic)
    checkAdminAccess();
});

/**
 * Load customer data and populate dashboard
 */
async function loadCustomerData() {
    try {
        // Get customer from cache first
        let customer = window.AuthService.getCustomer();

        // If not in cache or stale, refresh from API
        if (!customer) {
            customer = await window.AuthService.refreshCustomer();
        }

        if (customer) {
            displayCustomerInfo(customer);
            displayOrderSummary(customer);
        } else {
            showNotification('Failed to load customer data', 'error');
        }
    } catch (error) {
        console.error('Error loading customer data:', error);
        showNotification('Error loading account information', 'error');
    }
}

/**
 * Display customer information
 */
function displayCustomerInfo(customer) {
    // Update name in header
    const customerName = document.getElementById('customerName');
    if (customerName) {
        customerName.textContent = customer.firstName || 'Guest';
    }

    // Update account summary
    const accountSummary = document.getElementById('accountSummary');
    if (accountSummary) {
        accountSummary.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.9rem;">
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--text-secondary);">Email:</span>
                    <span style="color: var(--text-primary);">${customer.email}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--text-secondary);">Name:</span>
                    <span style="color: var(--text-primary);">${customer.firstName} ${customer.lastName}</span>
                </div>
                ${customer.phone ? `
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--text-secondary);">Phone:</span>
                    <span style="color: var(--text-primary);">${customer.phone}</span>
                </div>
                ` : ''}
            </div>
        `;
    }
}

/**
 * Display order summary
 */
function displayOrderSummary(customer) {
    const orderSummary = document.getElementById('orderSummary');
    if (!orderSummary) return;

    const orders = customer.orders?.edges || [];

    if (orders.length === 0) {
        orderSummary.innerHTML = `
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">
                You haven't placed any orders yet.
            </p>
            <a href="products.html" class="btn btn-primary" style="width: 100%;">
                Start Shopping
            </a>
        `;
        return;
    }

    // Show recent orders count
    const recentOrders = orders.slice(0, 3);
    const totalOrders = orders.length;

    orderSummary.innerHTML = `
        <div style="margin-bottom: 1rem;">
            <p style="color: var(--text-primary); font-weight: 600; font-size: 1.5rem; margin-bottom: 0.25rem;">
                ${totalOrders}
            </p>
            <p style="color: var(--text-secondary); font-size: 0.85rem;">
                Total ${totalOrders === 1 ? 'Order' : 'Orders'}
            </p>
        </div>
        <div style="border-top: 1px solid var(--border-color); padding-top: 1rem;">
            <h4 style="color: var(--text-primary); margin-bottom: 0.75rem; font-size: 0.9rem;">
                Recent Orders
            </h4>
            ${recentOrders.map(({ node: order }) => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; font-size: 0.85rem; border-bottom: 1px solid var(--border-color);">
                    <div>
                        <div style="color: var(--text-primary); font-weight: 500;">
                            #${order.orderNumber}
                        </div>
                        <div style="color: var(--text-secondary); font-size: 0.8rem;">
                            ${new Date(order.processedAt).toLocaleDateString()}
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="color: var(--text-primary); font-weight: 600;">
                            $${parseFloat(order.totalPrice.amount).toFixed(2)}
                        </div>
                        <div style="color: var(--text-secondary); font-size: 0.8rem;">
                            ${order.fulfillmentStatus || 'Processing'}
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

/**
 * Check if user has admin access
 * This is a simple check - in production, you'd verify this server-side
 */
function checkAdminAccess() {
    // For demo purposes, show admin panel if Shopify is configured
    // In production, you'd check user roles/permissions
    const isConfigured = window.ShopifyConfig && window.ShopifyConfig.isConfigured();

    if (isConfigured) {
        const adminPanel = document.getElementById('adminPanel');
        if (adminPanel) {
            adminPanel.style.display = 'block';
        }
    }
}

/**
 * Open Shopify admin in new tab
 */
function openShopifyAdmin(section = 'admin') {
    if (!window.ShopifyConfig) {
        showNotification('Shopify configuration not found', 'error');
        return;
    }

    const urls = window.ShopifyConfig.urls;
    let url;

    switch (section) {
        case 'products':
            url = urls.productsAdmin;
            break;
        case 'orders':
            url = urls.ordersAdmin;
            break;
        case 'analytics':
            url = urls.analyticsAdmin;
            break;
        case 'customers':
            url = urls.customersAdmin;
            break;
        default:
            url = urls.admin;
    }

    window.open(url, '_blank');
}

/**
 * Handle logout
 */
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        window.AuthService.logout();
    }
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
    } else {
        alert(message);
    }
}

// Make openShopifyAdmin available globally
window.openShopifyAdmin = openShopifyAdmin;
