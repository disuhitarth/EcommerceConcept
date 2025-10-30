// Enhanced E-commerce Features

// Product State
let currentPage = 1;
let itemsPerPage = 12;
let currentSort = 'featured';
let currentFilter = 'all';
let searchQuery = '';
let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');

// Add ratings and reviews to products
const productReviews = {
    1: { rating: 4.8, reviews: 124 },
    2: { rating: 4.5, reviews: 89 },
    3: { rating: 4.9, reviews: 156 },
    4: { rating: 4.7, reviews: 203 },
    5: { rating: 4.6, reviews: 97 },
    6: { rating: 4.8, reviews: 142 },
    7: { rating: 4.9, reviews: 234 },
    8: { rating: 4.7, reviews: 118 },
    9: { rating: 4.5, reviews: 76 },
    10: { rating: 4.6, reviews: 91 },
    11: { rating: 4.8, reviews: 167 },
    12: { rating: 4.7, reviews: 134 }
};

// Search Functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const clearSearch = document.getElementById('clearSearch');

    if (searchInput) {
        searchInput.addEventListener('input', debounce((e) => {
            searchQuery = e.target.value.toLowerCase();
            currentPage = 1;
            renderProductsWithFeatures();

            if (clearSearch) {
                clearSearch.style.display = searchQuery ? 'block' : 'none';
            }
        }, 300));
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            performSearch();
        });
    }

    if (clearSearch) {
        clearSearch.addEventListener('click', () => {
            searchInput.value = '';
            searchQuery = '';
            clearSearch.style.display = 'none';
            currentPage = 1;
            renderProductsWithFeatures();
        });
    }
}

function performSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchQuery = searchInput.value.toLowerCase();
        currentPage = 1;
        renderProductsWithFeatures();
    }
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Sorting Functionality
function initializeSorting() {
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            currentPage = 1;
            renderProductsWithFeatures();
        });
    }
}

function sortProducts(productsArray) {
    const sorted = [...productsArray];

    switch(currentSort) {
        case 'price-low':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price-high':
            return sorted.sort((a, b) => b.price - a.price);
        case 'name-asc':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        case 'name-desc':
            return sorted.sort((a, b) => b.name.localeCompare(a.name));
        case 'rating':
            return sorted.sort((a, b) => {
                const ratingA = productReviews[a.id]?.rating || 0;
                const ratingB = productReviews[b.id]?.rating || 0;
                return ratingB - ratingA;
            });
        default:
            return sorted;
    }
}

// Filter and Search Products
function filterProducts() {
    let filtered = products;

    // Apply category filter
    if (currentFilter !== 'all') {
        filtered = filtered.filter(p => p.category === currentFilter);
    }

    // Apply search
    if (searchQuery) {
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(searchQuery) ||
            p.description.toLowerCase().includes(searchQuery) ||
            p.category.toLowerCase().includes(searchQuery)
        );
    }

    // Apply sorting
    filtered = sortProducts(filtered);

    return filtered;
}

// Pagination
function paginateProducts(productsArray) {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return productsArray.slice(start, end);
}

function renderPagination(totalProducts) {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;

    const totalPages = Math.ceil(totalProducts / itemsPerPage);

    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }

    let paginationHTML = '<div class="pagination-controls">';

    // Previous button
    paginationHTML += `
        <button class="pagination-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">
            ← Previous
        </button>
    `;

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            paginationHTML += `
                <button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">
                    ${i}
                </button>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            paginationHTML += '<span class="pagination-dots">...</span>';
        }
    }

    // Next button
    paginationHTML += `
        <button class="pagination-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">
            Next →
        </button>
    `;

    paginationHTML += '</div>';
    paginationHTML += `<div class="pagination-info">Showing ${((currentPage - 1) * itemsPerPage) + 1}-${Math.min(currentPage * itemsPerPage, totalProducts)} of ${totalProducts} products</div>`;

    paginationContainer.innerHTML = paginationHTML;
}

function changePage(page) {
    currentPage = page;
    renderProductsWithFeatures();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Lazy Loading with Intersection Observer
let productObserver;

function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        productObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    card.classList.add('lazy-loaded');
                    productObserver.unobserve(card);
                }
            });
        }, {
            rootMargin: '50px',
            threshold: 0.1
        });
    }
}

// Render Products with All Features
function renderProductsWithFeatures() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    const filtered = filterProducts();
    const paginated = paginateProducts(filtered);

    if (filtered.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-results">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search query</p>
            </div>
        `;
        const paginationContainer = document.getElementById('pagination');
        if (paginationContainer) paginationContainer.innerHTML = '';
        return;
    }

    productsGrid.innerHTML = '';

    paginated.forEach((product, index) => {
        const reviews = productReviews[product.id];
        const productCard = document.createElement('div');
        productCard.className = 'product-card lazy-load';

        // Add slight stagger for animation
        productCard.style.animationDelay = `${index * 0.05}s`;

        productCard.innerHTML = `
            <div class="product-image">${product.emoji}</div>
            ${reviews ? `
                <div class="product-rating">
                    <span class="stars">${generateStars(reviews.rating)}</span>
                    <span class="rating-text">${reviews.rating} (${reviews.reviews})</span>
                </div>
            ` : ''}
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    <div class="product-actions">
                        <button class="quick-view-btn" onclick="openQuickView(${product.id})" title="Quick View">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                <circle cx="12" cy="12" r="3"/>
                            </svg>
                        </button>
                        <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
                    </div>
                </div>
            </div>
        `;

        productCard.querySelector('.product-image').addEventListener('click', () => {
            addToRecentlyViewed(product.id);
            openQuickView(product.id);
        });

        productsGrid.appendChild(productCard);

        // Observe card for lazy loading
        if (productObserver) {
            productObserver.observe(productCard);
        } else {
            // Fallback for older browsers
            productCard.classList.add('lazy-loaded');
        }
    });

    // Add event listeners to add-to-cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            addToCart(productId);
        });
    });

    // Render pagination
    renderPagination(filtered.length);
}

// Generate star rating HTML
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let starsHTML = '';

    for (let i = 0; i < fullStars; i++) {
        starsHTML += '★';
    }
    if (hasHalfStar) {
        starsHTML += '☆';
    }

    return starsHTML;
}

// Quick View Modal
function openQuickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const reviews = productReviews[productId];

    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    modal.innerHTML = `
        <div class="quick-view-overlay" onclick="closeQuickView()"></div>
        <div class="quick-view-content">
            <button class="close-modal" onclick="closeQuickView()">×</button>
            <div class="quick-view-grid">
                <div class="quick-view-image">${product.emoji}</div>
                <div class="quick-view-details">
                    <div class="product-category">${product.category}</div>
                    <h2>${product.name}</h2>
                    ${reviews ? `
                        <div class="product-rating">
                            <span class="stars">${generateStars(reviews.rating)}</span>
                            <span class="rating-text">${reviews.rating} (${reviews.reviews} reviews)</span>
                        </div>
                    ` : ''}
                    <div class="quick-view-price">$${product.price.toFixed(2)}</div>
                    <p class="quick-view-description">${product.description}</p>
                    <div class="quick-view-features">
                        <h4>Features:</h4>
                        <ul>
                            <li>Premium quality materials</li>
                            <li>Sustainable and eco-friendly</li>
                            <li>Available in multiple sizes</li>
                            <li>Free shipping on orders over $75</li>
                        </ul>
                    </div>
                    <div class="quick-view-actions">
                        <button class="add-to-cart-btn-modal" onclick="addToCart(${product.id}); closeQuickView();">
                            Add to Cart
                        </button>
                        <button class="wishlist-btn-modal" onclick="toggleWishlist(${product.id})">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                            </svg>
                            Wishlist
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // Add to recently viewed
    addToRecentlyViewed(productId);
}

function closeQuickView() {
    const modal = document.querySelector('.quick-view-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

// Recently Viewed Products
function addToRecentlyViewed(productId) {
    recentlyViewed = recentlyViewed.filter(id => id !== productId);
    recentlyViewed.unshift(productId);
    recentlyViewed = recentlyViewed.slice(0, 8);
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
    renderRecentlyViewed();
}

function renderRecentlyViewed() {
    const container = document.getElementById('recentlyViewedProducts');
    if (!container || recentlyViewed.length === 0) return;

    const recentProducts = recentlyViewed
        .map(id => products.find(p => p.id === id))
        .filter(p => p);

    if (recentProducts.length === 0) {
        container.style.display = 'none';
        return;
    }

    container.style.display = 'block';
    container.innerHTML = `
        <h3>Recently Viewed</h3>
        <div class="recently-viewed-grid">
            ${recentProducts.map(product => `
                <div class="recently-viewed-item" onclick="openQuickView(${product.id})">
                    <div class="recently-viewed-image">${product.emoji}</div>
                    <div class="recently-viewed-name">${product.name}</div>
                    <div class="recently-viewed-price">$${product.price.toFixed(2)}</div>
                </div>
            `).join('')}
        </div>
    `;
}

// Wishlist Toggle
function toggleWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('lovableWishlist') || '[]');

    if (wishlist.includes(productId)) {
        wishlist = wishlist.filter(id => id !== productId);
        showNotification('Removed from wishlist');
    } else {
        wishlist.push(productId);
        showNotification('Added to wishlist!');
    }

    localStorage.setItem('lovableWishlist', JSON.stringify(wishlist));
}

// Newsletter Signup
function initializeNewsletter() {
    const form = document.getElementById('newsletterForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = form.querySelector('input[type="email"]').value;
            if (email) {
                showNotification('Thanks for subscribing!');
                form.reset();
            }
        });
    }
}

// Initialize Enhanced Features
function initializeEcommerceFeatures() {
    // Initialize lazy loading
    initializeLazyLoading();

    initializeSearch();
    initializeSorting();
    initializeNewsletter();
    renderRecentlyViewed();

    // Update filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.category;
            currentPage = 1;
            renderProductsWithFeatures();
        });
    });

    // Initial render of products with features
    const productsGrid = document.getElementById('productsGrid');
    if (productsGrid) {
        renderProductsWithFeatures();
    }
}

// Run on DOM load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeEcommerceFeatures);
} else {
    initializeEcommerceFeatures();
}
