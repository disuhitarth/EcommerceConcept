// Product Data
let products = [
    {
        id: 1,
        name: 'AI Builder Hoodie',
        category: 'hoodies',
        price: 59.99,
        description: 'Premium hoodie for AI-powered developers',
        emoji: '👨‍💻'
    },
    {
        id: 2,
        name: 'Chat with AI Tee',
        category: 'tees',
        price: 29.99,
        description: 'Comfortable t-shirt celebrating AI builders',
        emoji: '💬'
    },
    {
        id: 3,
        name: 'Code Generator Hoodie',
        category: 'hoodies',
        price: 64.99,
        description: 'Stay warm while building with AI',
        emoji: '⚡'
    },
    {
        id: 4,
        name: 'Lovable Sticker Pack',
        category: 'stickers',
        price: 9.99,
        description: 'Set of 10 premium stickers',
        emoji: '✨'
    },
    {
        id: 5,
        name: 'AI Developer Tee',
        category: 'tees',
        price: 27.99,
        description: 'Show your AI developer pride',
        emoji: '🤖'
    },
    {
        id: 6,
        name: 'Build Fast Hoodie',
        category: 'hoodies',
        price: 62.99,
        description: 'For developers who ship quickly',
        emoji: '🚀'
    },
    {
        id: 7,
        name: 'Gradient Logo Sticker',
        category: 'stickers',
        price: 4.99,
        description: 'Holographic Lovable logo sticker',
        emoji: '🌈'
    },
    {
        id: 8,
        name: 'AI Powered Tee',
        category: 'tees',
        price: 31.99,
        description: 'Celebrate the AI revolution',
        emoji: '🔥'
    },
    {
        id: 9,
        name: 'Developer Cap',
        category: 'accessories',
        price: 24.99,
        description: 'Adjustable cap with embroidered logo',
        emoji: '🧢'
    },
    {
        id: 10,
        name: 'Coding Mug',
        category: 'accessories',
        price: 16.99,
        description: 'Ceramic mug for your favorite beverage',
        emoji: '☕'
    },
    {
        id: 11,
        name: 'Keyboard Stickers',
        category: 'stickers',
        price: 7.99,
        description: 'Customize your keyboard',
        emoji: '⌨️'
    },
    {
        id: 12,
        name: 'Tech Tote Bag',
        category: 'accessories',
        price: 19.99,
        description: 'Durable canvas tote bag',
        emoji: '🛍️'
    }
];

// Shopping Cart
let cart = [];

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const filterBtns = document.querySelectorAll('.filter-btn');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const lovableBadge = document.getElementById('lovableBadge');
const badgeClose = document.getElementById('badgeClose');
const themeToggle = document.getElementById('themeToggle');

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    loadTheme();
    loadCart();

    // Load products from Shopify if configured
    if (window.ProductLoader) {
        console.log('[Init] ProductLoader found, initializing...');
        try {
            await window.ProductLoader.init();
            // Update global products array
            const loadedProducts = window.ProductLoader.getProducts();
            console.log('[Init] Products loaded:', loadedProducts.length);

            if (loadedProducts && loadedProducts.length > 0) {
                products = loadedProducts;
                console.log(`✓ Loaded ${products.length} products from Shopify`);
                console.log(`  First product: ${products[0]?.name}`);
                console.log(`  Has image: ${products[0]?.image ? 'YES' : 'NO'}`);
                console.log(`  Image URL: ${products[0]?.image || 'none'}`);
            } else {
                console.warn('[Init] No products loaded from Shopify, using default products');
            }
        } catch (error) {
            console.error('[Init] Error loading products:', error);
            console.warn('[Init] Using default products due to error');
        }
    } else {
        console.warn('[Init] ProductLoader not found! Using default products');
        console.log('[Init] Make sure Shopify integration scripts are loaded before script.js');
    }

    renderProducts();
    setupEventListeners();
    checkBadgeVisibility();

    // Force refresh button handler
    const forceRefreshBtn = document.getElementById('forceRefreshBtn');
    if (forceRefreshBtn) {
        forceRefreshBtn.addEventListener('click', async () => {
            forceRefreshBtn.disabled = true;
            forceRefreshBtn.textContent = '⏳ Refreshing...';

            try {
                if (window.ProductLoader) {
                    console.log('Force refreshing products from Shopify...');
                    const refreshedProducts = await window.ProductLoader.refreshProducts();
                    products = refreshedProducts;
                    renderProducts();
                    console.log('Products refreshed successfully!');
                    showNotification('Products refreshed from Shopify!');
                }
            } catch (error) {
                console.error('Error refreshing products:', error);
                showNotification('Error refreshing products');
            } finally {
                forceRefreshBtn.disabled = false;
                forceRefreshBtn.textContent = '🔄 Refresh from Shopify';
            }
        });
    }
});

// Render Products
function renderProducts(filter = 'all') {
    if (!productsGrid) return;

    productsGrid.innerHTML = '';

    const filteredProducts = filter === 'all'
        ? products
        : products.filter(p => p.category === filter);

    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';

        // Use image if available from Shopify, otherwise use emoji
        const productImage = product.image || product.images?.[0]
            ? `<img src="${product.image || product.images[0]}" alt="${product.name}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;">`
            : `<div class="product-image">${product.emoji || '📦'}</div>`;

        productCard.innerHTML = `
            ${productImage}
            <div class="product-info">
                <div class="product-category">${product.category || product.type}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        `;

        productsGrid.appendChild(productCard);
    });

    // Add event listeners to add-to-cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            addToCart(productId);
        });
    });
}

// Setup Event Listeners
function setupEventListeners() {
    // Theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Cart toggle
    if (cartBtn) {
        cartBtn.addEventListener('click', openCart);
    }
    if (closeCart) {
        closeCart.addEventListener('click', closeCartSidebar);
    }
    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCartSidebar);
    }

    // Filter buttons
    if (filterBtns) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                const category = e.target.dataset.category;
                renderProducts(category);
            });
        });
    }

    // Mobile menu toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            // Could expand to show mobile menu
        });
    }

    // Badge close
    if (badgeClose && lovableBadge) {
        badgeClose.addEventListener('click', () => {
            lovableBadge.style.display = 'none';
            localStorage.setItem('badgeClosed', 'true');
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Cart Functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCart();
    updateCart();
    showNotification('Added to cart!');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCart();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCart();
        }
    }
}

function updateCart() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = totalItems;
    }

    // Update cart total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartTotal) {
        cartTotal.textContent = `$${total.toFixed(2)}`;
    }

    // Render cart items
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = '<div class="cart-empty">Your cart is empty</div>';
        } else {
            cartItems.innerHTML = cart.map(item => {
                // Safety check for item data
                if (!item || typeof item.price !== 'number') {
                    console.warn('[Cart] Invalid item in cart:', item);
                    return '';
                }

                return `
                    <div class="cart-item">
                        <div class="cart-item-image">${item.emoji || '📦'}</div>
                        <div class="cart-item-details">
                            <div class="cart-item-name">${item.name || 'Unknown'}</div>
                            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                            <div class="cart-item-controls">
                                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                                <span class="quantity-display">${item.quantity}</span>
                                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                            </div>
                        </div>
                        <button class="remove-item-btn" onclick="removeFromCart(${item.id})">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"/>
                                <line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                        </button>
                    </div>
                `;
            }).join('');
        }
    }
}

function openCart() {
    if (cartSidebar) {
        cartSidebar.classList.add('open');
    }
    if (cartOverlay) {
        cartOverlay.classList.add('active');
    }
    document.body.style.overflow = 'hidden';
}

function closeCartSidebar() {
    if (cartSidebar) {
        cartSidebar.classList.remove('open');
    }
    if (cartOverlay) {
        cartOverlay.classList.remove('active');
    }
    document.body.style.overflow = '';
}

// Local Storage Functions
function saveCart() {
    localStorage.setItem('lovableCart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('lovableCart');
    if (savedCart) {
        try {
            const parsedCart = JSON.parse(savedCart);
            // Validate cart items - remove any with invalid data
            cart = parsedCart.filter(item => {
                return item &&
                       typeof item.price === 'number' &&
                       typeof item.quantity === 'number' &&
                       item.id;
            });
            console.log(`[Cart] Loaded ${cart.length} items from storage`);
            updateCart();
        } catch (error) {
            console.error('[Cart] Error loading cart, clearing:', error);
            localStorage.removeItem('lovableCart');
            cart = [];
        }
    }
}

// Theme Functions
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Badge Visibility
function checkBadgeVisibility() {
    if (lovableBadge) {
        const badgeClosed = localStorage.getItem('badgeClosed');
        if (badgeClosed === 'true' || window.self !== window.top) {
            lovableBadge.style.display = 'none';
        }
    }
}

// Notification System
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Checkout Button Handler
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('checkout-btn')) {
        if (cart.length === 0) {
            showNotification('Your cart is empty!');
        } else {
            showNotification('Checkout feature coming soon!');
        }
    }
});
