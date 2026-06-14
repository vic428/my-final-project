/**
 * Film Discovery App - Main Entry Point
 * Initializes all modules and handles app bootstrap
 */

import * as eventHandler from './modules/eventHandler.js';
import * as animations from './modules/animations.js';
import * as dataManager from './modules/dataManager.js';

async function loadRuntimeEnv() {
    globalThis.process ??= { env: {} };

    try {
        const response = await fetch('env.json', { cache: 'no-store' });
        if (!response.ok) {
            throw new Error(`Runtime env request failed with ${response.status}`);
        }

        const env = await response.json();
        Object.assign(process.env, env);
    } catch (error) {
        console.warn('Runtime environment variables could not be loaded. API-backed features may be unavailable.', error);
    }
}

/**
 * Initialize app on page load
 */
document.addEventListener('DOMContentLoaded', async () => {
    await loadRuntimeEnv();

    // Initialize event listeners
    eventHandler.setupEventListeners();
    
    // Initialize page-specific functionality
    eventHandler.initializePage();
    
    // Setup animations
    animations.fadeInOnScroll('.card');
    animations.slideInOnScroll('.section', 'left');
    
    // Setup data cleanup
    dataManager.cleanSearchCache();
    
    // Add page transition
    animations.pageTransitionIn();
    
    console.log('Film Discovery App Initialized');
});

/**
 * Handle page transitions on link click
 */
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.href && !link.target) {
        const href = link.getAttribute('href');
        
        // Only handle internal links
        if (href.startsWith('http') || href.startsWith('//')) {
            return;
        }
        
        // Don't prevent default for hash links or external links
        if (!href.startsWith('#')) {
            // Animation transition already handled by browser
        }
    }
});

// Handle errors
window.addEventListener('error', (e) => {
    console.error('App Error:', e.error);
});

// Cleanup on unload
window.addEventListener('beforeunload', () => {
    // Could save app state here if needed
});
