#!/usr/bin/env node

/**
 * Build Preparation Script
 * Copies production config files before deployment
 */

const fs = require('fs');
const path = require('path');

console.log('📦 Preparing build for deployment...\n');

const configs = [
    {
        prod: 'config/shopify.production.js',
        target: 'config/shopify.js',
        name: 'Shopify Config'
    },
    {
        prod: 'config/gemini.production.js',
        target: 'config/gemini.js',
        name: 'Gemini Config'
    }
];

configs.forEach(({ prod, target, name }) => {
    const prodPath = path.join(__dirname, prod);
    const targetPath = path.join(__dirname, target);

    // Check if production file exists
    if (!fs.existsSync(prodPath)) {
        console.log(`❌ ${name}: Production file not found at ${prod}`);
        return;
    }

    // Check if target already exists
    if (fs.existsSync(targetPath)) {
        console.log(`✓ ${name}: Already exists at ${target} (skipping)`);
        return;
    }

    // Copy production file to target
    try {
        fs.copyFileSync(prodPath, targetPath);
        console.log(`✓ ${name}: Copied ${prod} → ${target}`);
    } catch (error) {
        console.log(`❌ ${name}: Failed to copy - ${error.message}`);
    }
});

console.log('\n✅ Build preparation complete!\n');
