/**
 * Authentication UI Logic
 * Handles login and signup forms
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check if Shopify is configured
    const isConfigured = window.ShopifyConfig && window.ShopifyConfig.isConfigured();

    // Initialize login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Initialize signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }

    // Show demo mode warning if not configured
    if (!isConfigured) {
        showDemoModeWarning();
    }

    // Redirect if already logged in
    if (window.AuthService.isLoggedIn()) {
        const currentPage = window.location.pathname;
        if (currentPage.includes('login.html') || currentPage.includes('signup.html')) {
            window.location.href = 'account.html';
        }
    }
});

/**
 * Handle login form submission
 */
async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    const submitBtn = document.getElementById('loginBtn');

    // Validate
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    // Check if configured
    if (!window.ShopifyConfig.isConfigured()) {
        showNotification('Shopify is not configured. Please check config/shopify.js', 'error');
        return;
    }

    // Show loading state
    setButtonLoading(submitBtn, true);

    try {
        const result = await window.AuthService.login(email, password);

        if (result.success) {
            showNotification('Login successful! Redirecting...', 'success');

            // Wait a moment to show success message
            setTimeout(() => {
                window.AuthService.redirectAfterLogin();
            }, 1000);
        } else {
            showNotification(result.error || 'Login failed', 'error');
            setButtonLoading(submitBtn, false);
        }
    } catch (error) {
        console.error('Login error:', error);
        showNotification('An error occurred. Please try again.', 'error');
        setButtonLoading(submitBtn, false);
    }
}

/**
 * Handle signup form submission
 */
async function handleSignup(e) {
    e.preventDefault();

    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const acceptTerms = document.getElementById('acceptTerms').checked;
    const submitBtn = document.getElementById('signupBtn');

    // Validate
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }

    if (password.length < 8) {
        showNotification('Password must be at least 8 characters', 'error');
        return;
    }

    if (!acceptTerms) {
        showNotification('Please accept the terms and conditions', 'error');
        return;
    }

    // Check if configured
    if (!window.ShopifyConfig.isConfigured()) {
        showNotification('Shopify is not configured. Please check config/shopify.js', 'error');
        return;
    }

    // Show loading state
    setButtonLoading(submitBtn, true);

    try {
        const result = await window.AuthService.signup(email, password, firstName, lastName);

        if (result.success) {
            showNotification('Account created successfully! Redirecting...', 'success');

            // Wait a moment to show success message
            setTimeout(() => {
                window.AuthService.redirectAfterLogin();
            }, 1000);
        } else {
            showNotification(result.error || 'Signup failed', 'error');
            setButtonLoading(submitBtn, false);
        }
    } catch (error) {
        console.error('Signup error:', error);
        showNotification('An error occurred. Please try again.', 'error');
        setButtonLoading(submitBtn, false);
    }
}

/**
 * Set button loading state
 */
function setButtonLoading(button, loading) {
    if (loading) {
        button.classList.add('loading');
        button.disabled = true;
    } else {
        button.classList.remove('loading');
        button.disabled = false;
    }
}

/**
 * Show demo mode warning
 */
function showDemoModeWarning() {
    const demoInfo = document.querySelector('.demo-info');
    if (demoInfo) {
        demoInfo.style.display = 'flex';
    }
}

/**
 * Show notification
 * Note: This uses the global showNotification function from script.js
 * The type parameter is ignored as script.js only accepts message
 */
