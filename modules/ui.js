/**
 * UI Module - Handles all UI rendering and display logic
 */

import { getImageUrl } from './api.js';

/**
 * Create a movie/show card HTML
 * @param {object} item - Movie or TV show object
 * @returns {string} HTML string
 */
export function createCardHTML(item) {
    const posterUrl = getImageUrl(item.poster_path, 'poster');
    const title = item.title || item.name;
    const year = item.release_date ? item.release_date.split('-')[0] : item.first_air_date?.split('-')[0] || 'N/A';
    const rating = Math.round((item.vote_average || 0) * 10) / 10;
    const stars = createStarRating(rating);
    const mediaType = item.title ? 'Movie' : 'Series';
    const scoreLabel = rating > 0 ? `${rating}/10` : 'Unrated';

    return `
        <div class="card animate-fade-in" data-id="${item.id}" data-type="${item.title ? 'movie' : 'tv'}">
            <div class="card-image">
                ${posterUrl ? `<img src="${posterUrl}" alt="${title}" loading="lazy">` : '<div class="card-image-placeholder">No Image</div>'}
            </div>
            <div class="card-body">
                <div class="card-chip-row">
                    <span class="card-chip">${mediaType}</span>
                    <span class="card-chip">${year}</span>
                </div>
                <h4 class="card-title">${title}</h4>
                <div class="card-footer">
                    <div class="card-rating">${stars}</div>
                    <span class="card-score">${scoreLabel}</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Create star rating HTML
 * @param {number} rating - Rating from 0-10
 * @returns {string} HTML string with stars
 */
export function createStarRating(rating) {
    let fullStars = Math.floor(rating / 2);
    const hasHalfStar = (rating % 2) >= 1;
    let stars = '';

    for (let i = 0; i < fullStars; i++) {
        stars += '<span class="star">★</span>';
    }
    
    if (hasHalfStar && fullStars < 5) {
        stars += '<span class="star">★</span>';
        fullStars++;
    }

    for (let i = fullStars; i < 5; i++) {
        stars += '<span class="star empty">★</span>';
    }

    return stars;
}

/**
 * Create mood card HTML
 * @param {object} mood - Mood object with title, icon, description
 * @returns {string} HTML string
 */
export function createMoodCardHTML(mood) {
    return `
        <div class="mood-card animate-scale-up" data-mood="${mood.id}">
            <div class="mood-icon">${mood.icon}</div>
            <h3 class="mood-title">${mood.title}</h3>
            <p class="mood-subtitle">${mood.description}</p>
        </div>
    `;
}

/**
 * Create cast member HTML
 * @param {object} member - Cast member object
 * @returns {string} HTML string
 */
export function createCastHTML(member) {
    const imageUrl = member.profile_path ? getImageUrl(member.profile_path, 'poster') : null;

    return `
        <div class="cast-member">
            <div class="cast-image">
                ${imageUrl ? `<img src="${imageUrl}" alt="${member.name}">` : '<div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; background: #888890; color: white;">No Image</div>'}
            </div>
            <h4 class="cast-name">${member.name}</h4>
            <p class="cast-role">${member.character || 'Cast'}</p>
        </div>
    `;
}

/**
 * Create provider badge HTML
 * @param {string} providerName - Provider name
 * @returns {string} HTML string
 */
export function createProviderBadgeHTML(providerName) {
    return `<div class="provider-badge">${providerName}</div>`;
}

/**
 * Populate a grid with cards
 * @param {string} gridSelector - CSS selector for grid container
 * @param {array} items - Array of items to display
 * @param {function} cardCreator - Function to create card HTML
 * @param {boolean} append - Whether to append (true) or replace (false)
 */
export function populateGrid(gridSelector, items, cardCreator = createCardHTML, append = false) {
    const grid = document.querySelector(gridSelector);
    if (!grid) return;

    const html = items.map(item => cardCreator(item)).join('');

    if (append) {
        grid.insertAdjacentHTML('beforeend', html);
    } else {
        grid.innerHTML = html;
    }
}

/**
 * Display movie/show details
 * @param {object} item - Movie or TV show details object
 * @param {boolean} isTV - Whether it's a TV show
 */
export function displayDetails(item, isTV = false) {
    // Backdrop
    const backdrop = document.getElementById('backdrop');
    if (backdrop && item.backdrop_path) {
        backdrop.style.backgroundImage = `url('${getImageUrl(item.backdrop_path, 'backdrop')}')`;
    }

    // Poster
    const poster = document.getElementById('poster');
    if (poster && item.poster_path) {
        poster.src = getImageUrl(item.poster_path, 'poster');
        poster.alt = item.title || item.name;
    }

    // Title
    const title = document.getElementById('title');
    if (title) title.textContent = item.title || item.name;

    // Year
    const yearEl = document.getElementById('year');
    if (yearEl) {
        const date = item.release_date || item.first_air_date;
        yearEl.textContent = date ? date.split('-')[0] : 'N/A';
    }

    // Runtime
    const runtimeEl = document.getElementById('runtime');
    if (runtimeEl) {
        if (isTV && item.episode_run_time) {
            runtimeEl.textContent = `${item.episode_run_time[0] || 'N/A'} min/episode`;
        } else if (item.runtime) {
            runtimeEl.textContent = `${item.runtime} min`;
        } else {
            runtimeEl.textContent = 'N/A';
        }
    }

    // Rating
    const ratingEl = document.getElementById('rating');
    if (ratingEl) {
        ratingEl.textContent = `${item.vote_average?.toFixed(1) || 'N/A'}/10`;
    }

    // Rating Stars
    const ratingStars = document.getElementById('ratingStars');
    if (ratingStars) {
        ratingStars.innerHTML = createStarRating(item.vote_average || 0);
    }

    // Synopsis
    const synopsis = document.getElementById('synopsis');
    if (synopsis) {
        synopsis.textContent = item.overview || 'No description available.';
    }

    // Genres
    const genresList = document.getElementById('genresList');
    if (genresList && item.genres) {
        const genresHTML = item.genres
            .map(g => `<div class="provider-badge">${g.name}</div>`)
            .join('');
        genresList.innerHTML = genresHTML || '<p class="muted-text">No genres available</p>';
    }

    // Cast
    const castGrid = document.getElementById('castGrid');
    if (castGrid && item.credits?.cast) {
        const cast = item.credits.cast.slice(0, 8);
        const castHTML = cast.map(member => createCastHTML(member)).join('');
        castGrid.innerHTML = castHTML || '<p class="muted-text">No cast information available</p>';
    }

    // Streaming Providers
    const streamingEl = document.getElementById('streamingProviders');
    if (streamingEl) {
        let providers = [];
        if (item.watch_providers?.results?.US?.flatrate) {
            providers = item.watch_providers.results.US.flatrate.map(p => p.provider_name);
        }
        
        if (providers.length > 0) {
            streamingEl.innerHTML = providers.map(p => createProviderBadgeHTML(p)).join('');
        } else {
            streamingEl.innerHTML = '<p class="muted-text">Streaming information not available</p>';
        }
    }

    // Similar Titles
    const similarGrid = document.getElementById('similarTitles');
    if (similarGrid && item.similar?.results) {
        populateGrid('#similarTitles', item.similar.results.slice(0, 5));
    }
}

/**
 * Display search/discovery results
 * @param {array} results - Array of items
 * @param {string} gridSelector - CSS selector for grid
 * @param {boolean} append - Whether to append
 */
export function displayResults(results, gridSelector = '#resultsGrid', append = false) {
    if (results.length === 0) {
        const grid = document.querySelector(gridSelector);
        if (grid && !append) {
            grid.innerHTML = '<div class="state-message"><p class="muted-text">No results found. Try a different search.</p></div>';
        }
        return;
    }

    populateGrid(gridSelector, results, createCardHTML, append);
}

/**
 * Show loading state
 * @param {string} selector - CSS selector
 */
export function showLoading(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.innerHTML = '<div class="state-message state-loading"><p class="muted-text animate-pulse">Loading titles...</p></div>';
    }
}

/**
 * Show error message
 * @param {string} message - Error message
 * @param {string} selector - CSS selector
 */
export function showError(message, selector = '#resultsGrid') {
    const element = document.querySelector(selector);
    if (element) {
        element.innerHTML = `<div class="state-message state-error"><p>${message}</p></div>`;
    }
}

/**
 * Show trailer modal
 * @param {string} videoId - YouTube video ID
 */
export function showTrailerModal(videoId) {
    const modal = document.getElementById('trailerModal');
    const frame = document.getElementById('trailerFrame');
    
    if (modal && frame) {
        frame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        modal.style.display = 'flex';
    }
}

/**
 * Hide trailer modal
 */
export function hideTrailerModal() {
    const modal = document.getElementById('trailerModal');
    const frame = document.getElementById('trailerFrame');
    
    if (modal) {
        modal.style.display = 'none';
    }
    if (frame) {
        frame.src = '';
    }
}

/**
 * Display notification
 * @param {string} message - Notification message
 * @param {string} type - 'success', 'error', 'info'
 * @param {number} duration - Duration in ms
 */
export function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        font-weight: 500;
        z-index: 3000;
        animation: slideInRight 0.3s ease-out;
    `;

    const colors = {
        success: { bg: 'var(--secondary-accent)', text: 'var(--primary-bg)' },
        error: { bg: 'var(--danger)', text: 'var(--primary-text)' },
        info: { bg: 'var(--primary-accent)', text: 'var(--primary-bg)' }
    };

    const color = colors[type] || colors.info;
    notification.style.backgroundColor = color.bg;
    notification.style.color = color.text;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'fadeIn 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Truncate text
 * @param {string} text - Text to truncate
 * @param {number} length - Max length
 * @returns {string} Truncated text
 */
export function truncateText(text, length = 100) {
    return text.length > length ? text.substring(0, length) + '...' : text;
}
