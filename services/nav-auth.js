/**
 * Navigation Authentication Helper
 * Adds dynamic login/account links to navigation
 */

document.addEventListener('DOMContentLoaded', () => {
    updateNavigationAuth();
});

/**
 * Update navigation based on auth state
 */
function updateNavigationAuth() {
    // Check if auth service is available
    if (!window.AuthService) {
        return;
    }

    const isLoggedIn = window.AuthService.isLoggedIn();

    // Find navigation actions container
    const navActions = document.querySelector('.nav-actions');
    if (!navActions) {
        // Try alternative navigation structure
        updateAlternativeNav(isLoggedIn);
        return;
    }

    // Check if auth link already exists
    if (navActions.querySelector('.auth-link')) {
        return;
    }

    // Create auth link
    const authLink = createAuthLink(isLoggedIn);

    // Insert before theme toggle button
    const themeToggle = navActions.querySelector('#themeToggle, .theme-toggle');
    if (themeToggle) {
        navActions.insertBefore(authLink, themeToggle);
    } else {
        // Prepend if no theme toggle found
        navActions.insertBefore(authLink, navActions.firstChild);
    }
}

/**
 * Update alternative navigation structure (for other pages)
 */
function updateAlternativeNav(isLoggedIn) {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;

    // Check if auth link already exists
    if (navLinks.querySelector('.auth-link')) {
        return;
    }

    // Create auth link
    const authLink = createAuthLink(isLoggedIn);
    authLink.style.marginRight = '0.5rem';

    // Insert before theme toggle
    const themeToggle = navLinks.querySelector('#themeToggle');
    if (themeToggle) {
        navLinks.insertBefore(authLink, themeToggle);
    } else {
        navLinks.appendChild(authLink);
    }
}

/**
 * Create auth link element
 */
function createAuthLink(isLoggedIn) {
    const link = document.createElement('a');
    link.className = 'auth-link';
    link.style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        background: var(--primary-color);
        color: white;
        text-decoration: none;
        font-weight: 500;
        font-size: 0.9rem;
        transition: var(--transition);
    `;

    if (isLoggedIn) {
        const customer = window.AuthService.getCustomer();
        const firstName = customer?.firstName || 'Account';

        link.href = 'account.html';
        link.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
            </svg>
            <span>${firstName}</span>
        `;
    } else {
        link.href = 'login.html';
        link.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10 17 15 12 10 7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
            <span>Login</span>
        `;
    }

    // Hover effect
    link.addEventListener('mouseenter', () => {
        link.style.background = 'var(--primary-hover)';
        link.style.transform = 'translateY(-2px)';
    });

    link.addEventListener('mouseleave', () => {
        link.style.background = 'var(--primary-color)';
        link.style.transform = 'translateY(0)';
    });

    return link;
}
