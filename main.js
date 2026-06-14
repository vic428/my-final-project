/**
 * Film Discovery App - Main Entry Point
 * Initializes all modules and handles app bootstrap
 */

import * as eventHandler from './modules/eventHandler.js';
import * as animations from './modules/animations.js';
import * as dataManager from './modules/dataManager.js';

const THEME_META_COLORS = {
    dark: '#0A0A0C',
    light: '#F6F2EB'
};

applyTheme(getInitialTheme());

async function loadRuntimeEnv() {
    globalThis.process ??= { env: {} };

    try {
        const envUrl = new URL('env.json', window.location.href);
        envUrl.searchParams.set('v', Date.now().toString());

        const response = await fetch(envUrl, { cache: 'no-store' });
        if (!response.ok) {
            throw new Error(`Runtime env request failed with ${response.status}`);
        }

        const env = await response.json();
        Object.assign(process.env, env);
    } catch (error) {
        console.warn('Runtime environment variables could not be loaded. API-backed features may be unavailable.', error);
    }
}

function getInitialTheme() {
    try {
        return dataManager.getThemePreference();
    } catch (error) {
        return 'dark';
    }
}

function applyTheme(theme) {
    const resolvedTheme = theme === 'light' ? 'light' : 'dark';
    document.documentElement.dataset.theme = resolvedTheme;
    document.documentElement.style.colorScheme = resolvedTheme;

    if (document.body) {
        document.body.dataset.theme = resolvedTheme;
    }

    updateThemeMetaColor(resolvedTheme);
    updateThemeToggleState(resolvedTheme);
}

function initializeThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    applyTheme(getInitialTheme());

    toggle.addEventListener('click', () => {
        const nextTheme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
        applyTheme(nextTheme);
        dataManager.saveThemePreference(nextTheme);
    });
}

function updateThemeToggleState(theme) {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    const isLight = theme === 'light';
    toggle.dataset.theme = theme;
    toggle.setAttribute('aria-pressed', String(isLight));
    toggle.setAttribute('aria-label', isLight ? 'Activate dark theme' : 'Activate light theme');
}

function updateThemeMetaColor(theme) {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        metaThemeColor.setAttribute('content', THEME_META_COLORS[theme] || THEME_META_COLORS.dark);
    }
}

/**
 * Initialize app on page load
 */
document.addEventListener('DOMContentLoaded', async () => {
    applyTheme(getInitialTheme());
    await loadRuntimeEnv();
    initializeThemeToggle();

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
