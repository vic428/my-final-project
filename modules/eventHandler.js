/**
 * Event Handler Module - Manages all user interactions and events
 */

import * as api from './api.js';
import * as ui from './ui.js';
import * as dataManager from './dataManager.js';

/**
 * Setup all event listeners
 */
export function setupEventListeners() {
    setupSearchEvents();
    setupCardClickEvents();
    setupMoodEvents();
    setupDetailPageEvents();
    setupFilterEvents();
    setupGroupWatchEvents();
    setupWatchlistEvents();
    setupReviewEvents();
}

/**
 * Setup search functionality
 */
function setupSearchEvents() {
    const searchBox = document.getElementById('searchBox');
    if (!searchBox) return;

    searchBox.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter' && searchBox.value.trim()) {
            const query = searchBox.value.trim();
            dataManager.saveSearchHistory(query);
            
            // Navigate to results page
            window.location.href = `results.html?q=${encodeURIComponent(query)}`;
        }
    });
}

/**
 * Setup card click events for navigation to detail page
 */
export function setupCardClickEvents() {
    document.addEventListener('click', (e) => {
        const card = e.target.closest('.card');
        if (card) {
            const itemId = card.dataset.id;
            const type = card.dataset.type || 'movie';
            window.location.href = `detail.html?id=${itemId}&type=${type}`;
        }
    });
}

/**
 * Setup mood selection events
 */
function setupMoodEvents() {
    const moodCards = document.querySelectorAll('.mood-card');
    const surpriseBtn = document.getElementById('surpriseBtn');

    moodCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Remove previous selection
            document.querySelectorAll('.mood-card').forEach(c => c.classList.remove('selected'));
            
            // Add selection to clicked card
            card.classList.add('selected');
            
            const mood = card.dataset.mood;
            dataManager.saveMoodHistory(mood);
            
            // Navigate to discovery with mood filter after a short delay
            setTimeout(() => {
                window.location.href = `discovery.html?mood=${mood}`;
            }, 300);
        });
    });

    if (surpriseBtn) {
        surpriseBtn.addEventListener('click', () => {
            const moods = ['thrilled', 'relaxed', 'emotional', 'adventurous', 'nostalgic', 'playful'];
            const randomMood = moods[Math.floor(Math.random() * moods.length)];
            dataManager.saveMoodHistory(randomMood);
            window.location.href = `discovery.html?mood=${randomMood}`;
        });
    }
}

/**
 * Setup detail page events
 */
function setupDetailPageEvents() {
    const addWatchlistBtn = document.getElementById('addWatchlistBtn');
    const watchTrailerBtn = document.getElementById('watchTrailerBtn');
    const closeTrailerBtn = document.getElementById('closeTrailerBtn');
    const trailerModal = document.getElementById('trailerModal');
    const submitReviewBtn = document.getElementById('submitReviewBtn');

    if (addWatchlistBtn) {
        addWatchlistBtn.addEventListener('click', async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const itemId = parseInt(urlParams.get('id'));
            const type = urlParams.get('type') || 'movie';
            
            try {
                const item = type === 'tv' ? 
                    await api.getTVDetails(itemId) : 
                    await api.getMovieDetails(itemId);
                
                const added = dataManager.addToWatchlist(item, type === 'tv');
                if (added) {
                    ui.showNotification('Added to Watchlist!', 'success');
                    addWatchlistBtn.textContent = '✓ In Watchlist';
                    addWatchlistBtn.disabled = true;
                } else {
                    ui.showNotification('Already in Watchlist', 'info');
                }
            } catch (error) {
                ui.showNotification('Error adding to watchlist', 'error');
            }
        });
    }

    if (watchTrailerBtn) {
        watchTrailerBtn.addEventListener('click', async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const itemId = parseInt(urlParams.get('id'));
            const type = urlParams.get('type') || 'movie';
            
            try {
                const item = type === 'tv' ? 
                    await api.getTVDetails(itemId) : 
                    await api.getMovieDetails(itemId);
                
                let videoId = null;
                
                // Try to get from TMDB videos first
                if (item.videos?.results?.length > 0) {
                    const trailer = item.videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
                    videoId = trailer?.key;
                }
                
                // If not found, search YouTube
                if (!videoId) {
                    const title = item.title || item.name;
                    videoId = await api.searchYoutubeTrailer(title);
                }
                
                if (videoId) {
                    ui.showTrailerModal(videoId);
                } else {
                    ui.showNotification('Trailer not available', 'error');
                }
            } catch (error) {
                ui.showNotification('Error loading trailer', 'error');
            }
        });
    }

    if (closeTrailerBtn) {
        closeTrailerBtn.addEventListener('click', ui.hideTrailerModal);
    }

    if (trailerModal) {
        trailerModal.addEventListener('click', (e) => {
            if (e.target === trailerModal) {
                ui.hideTrailerModal();
            }
        });
    }

    if (submitReviewBtn) {
        submitReviewBtn.addEventListener('click', () => {
            const urlParams = new URLSearchParams(window.location.search);
            const itemId = parseInt(urlParams.get('id'));
            const type = urlParams.get('type') || 'movie';
            const reviewText = document.getElementById('reviewText')?.value;
            
            if (reviewText?.trim()) {
                dataManager.saveUserReview(itemId, reviewText, type);
                ui.showNotification('Review submitted!', 'success');
                document.getElementById('reviewText').value = '';
            } else {
                ui.showNotification('Please enter a review', 'error');
            }
        });
    }
}

/**
 * Setup filter events for discovery page
 */
function setupFilterEvents() {
    const genreFilter = document.getElementById('genreFilter');
    const yearFilter = document.getElementById('yearFilter');
    const runtimeFilter = document.getElementById('runtimeFilter');
    const sortFilter = document.getElementById('sortFilter');
    const categoryTags = document.querySelectorAll('.filter-tag');

    const applyFilters = () => {
        const filters = {
            genre: genreFilter?.value,
            year: yearFilter?.value,
            runtime: runtimeFilter?.value,
            sortBy: sortFilter?.value || 'popularity.desc'
        };
        
        // Trigger discovery fetch with filters
        const event = new CustomEvent('filtersChanged', { detail: filters });
        document.dispatchEvent(event);
    };

    genreFilter?.addEventListener('change', applyFilters);
    yearFilter?.addEventListener('change', applyFilters);
    runtimeFilter?.addEventListener('change', applyFilters);
    sortFilter?.addEventListener('change', applyFilters);

    categoryTags.forEach(tag => {
        tag.addEventListener('click', (e) => {
            categoryTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            
            const category = tag.dataset.category;
            const event = new CustomEvent('categoryChanged', { detail: { category } });
            document.dispatchEvent(event);
        });
    });
}

/**
 * Setup group watch events
 */
function setupGroupWatchEvents() {
    const createGroupBtn = document.getElementById('createGroupBtn');
    const participantCount = document.getElementById('participantCount');
    const findMatchBtn = document.getElementById('findMatchBtn');
    const startOverBtn = document.getElementById('startOverBtn');

    if (createGroupBtn) {
        createGroupBtn.addEventListener('click', () => {
            const count = parseInt(participantCount?.value || 3);
            createGroupUI(count);
        });
    }

    if (findMatchBtn) {
        findMatchBtn.addEventListener('click', findGroupMatch);
    }

    if (startOverBtn) {
        startOverBtn.addEventListener('click', () => {
            document.getElementById('participantsSection').style.display = 'none';
            document.getElementById('resultsSection').style.display = 'none';
            document.getElementById('participantCount').value = '3';
        });
    }
}

/**
 * Create group participant selection UI
 */
function createGroupUI(count) {
    const section = document.getElementById('participantsSection');
    const container = document.getElementById('participantsContainer');
    
    if (!section || !container) return;

    let html = '';
    for (let i = 1; i <= count; i++) {
        html += `
            <div style="background-color: var(--surface-bg); padding: var(--spacing-lg); border-radius: var(--radius-lg); margin-bottom: var(--spacing-lg);">
                <h4>Participant ${i}</h4>
                <div class="filter-group" style="margin-bottom: var(--spacing-md);">
                    <label class="filter-label">Favorite Genre</label>
                    <select class="filter-select participant-genre" data-participant="${i}">
                        <option value="">Any Genre</option>
                        <option value="28">Action</option>
                        <option value="35">Comedy</option>
                        <option value="18">Drama</option>
                        <option value="27">Horror</option>
                        <option value="10749">Romance</option>
                        <option value="878">Sci-Fi</option>
                    </select>
                </div>
                <div class="filter-group">
                    <label class="filter-label">Mood</label>
                    <select class="filter-select participant-mood" data-participant="${i}">
                        <option value="">Any Mood</option>
                        <option value="thrilled">Thrilled</option>
                        <option value="relaxed">Relaxed</option>
                        <option value="emotional">Emotional</option>
                        <option value="adventurous">Adventurous</option>
                        <option value="nostalgic">Nostalgic</option>
                        <option value="playful">Playful</option>
                    </select>
                </div>
            </div>
        `;
    }
    
    container.innerHTML = html;
    section.style.display = 'block';
}

/**
 * Find best match for group
 */
async function findGroupMatch() {
    const participants = document.querySelectorAll('.participant-genre');
    const preferences = [];

    participants.forEach(select => {
        preferences.push({
            genre: select.value,
            mood: select.parentElement.parentElement.querySelector('.participant-mood').value
        });
    });

    // For now, use first participant's preferences as base
    const basePrefs = preferences[0];
    
    try {
        ui.showLoading('#matchResults');
        const results = await api.discoverMovies({
            genre: basePrefs.genre || undefined
        });

        const resultsSection = document.getElementById('resultsSection');
        const matchResults = document.getElementById('matchResults');

        if (results.length > 0) {
            // Show top match
            const match = results[0];
            const posterUrl = api.getImageUrl(match.poster_path);
            
            matchResults.innerHTML = `
                <div style="display: grid; grid-template-columns: 250px 1fr; gap: var(--spacing-lg); align-items: start;">
                    <div class="detail-poster">
                        ${posterUrl ? `<img src="${posterUrl}" alt="${match.title}">` : '<div>No Image</div>'}
                    </div>
                    <div>
                        <h3>${match.title}</h3>
                        <p class="muted-text">${match.release_date?.split('-')[0]}</p>
                        <p style="margin: var(--spacing-md) 0;">${match.overview}</p>
                        <a href="detail.html?id=${match.id}&type=movie" class="btn btn-primary">View Details</a>
                    </div>
                </div>
            `;
        } else {
            matchResults.innerHTML = '<p class="muted-text">No matches found for this group</p>';
        }

        document.getElementById('participantsSection').style.display = 'none';
        resultsSection.style.display = 'block';
    } catch (error) {
        ui.showError('Error finding group match', '#matchResults');
    }
}

/**
 * Setup watchlist events
 */
function setupWatchlistEvents() {
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = parseInt(urlParams.get('id'));
    const type = urlParams.get('type') || 'movie';
    const addWatchlistBtn = document.getElementById('addWatchlistBtn');

    if (addWatchlistBtn && dataManager.isInWatchlist(itemId, type)) {
        addWatchlistBtn.textContent = '✓ In Watchlist';
        addWatchlistBtn.disabled = true;
    }
}

/**
 * Setup review events
 */
function setupReviewEvents() {
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = parseInt(urlParams.get('id'));
    const type = urlParams.get('type') || 'movie';
    const reviewText = document.getElementById('reviewText');
    const userRatingStars = document.getElementById('userRatingStars');

    // Load existing review
    if (reviewText) {
        const existingReview = dataManager.getUserReview(itemId, type);
        if (existingReview) {
            reviewText.value = existingReview;
        }
    }

    // Load existing rating
    if (userRatingStars) {
        const existingRating = dataManager.getUserRating(itemId, type);
        const starsHTML = Array(5).fill().map((_, i) => {
            const starNum = i + 1;
            const isSelected = existingRating && starNum <= existingRating;
            return `<span class="star-input ${isSelected ? 'selected' : ''}" data-rating="${starNum}">★</span>`;
        }).join('');
        
        userRatingStars.innerHTML = starsHTML;

        // Add star click events
        userRatingStars.querySelectorAll('.star-input').forEach(star => {
            star.addEventListener('click', () => {
                const rating = parseInt(star.dataset.rating);
                dataManager.saveUserRating(itemId, rating, type);
                
                userRatingStars.querySelectorAll('.star-input').forEach(s => s.classList.remove('selected'));
                for (let i = 0; i < rating; i++) {
                    userRatingStars.querySelectorAll('.star-input')[i].classList.add('selected');
                }
            });
        });
    }
}

/**
 * Setup page-specific initialization
 */
export function initializePage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    switch (currentPage) {
        case 'index.html':
            initializeHome();
            break;
        case 'mood.html':
            initializeMood();
            break;
        case 'discovery.html':
            initializeDiscovery();
            break;
        case 'detail.html':
            initializeDetail();
            break;
        case 'results.html':
            initializeResults();
            break;
        case 'group.html':
            initializeGroupWatch();
            break;
    }
}

async function initializeHome() {
    try {
        ui.showLoading('#trendingGrid');
        const trending = await api.getTrending('movie');
        ui.populateGrid('#trendingGrid', trending.slice(0, 5));
    } catch (error) {
        ui.showError('Error loading trending', '#trendingGrid');
    }

    try {
        ui.showLoading('#newReleasesGrid');
        const newReleases = await api.getUpcoming();
        ui.populateGrid('#newReleasesGrid', newReleases.slice(0, 5));
    } catch (error) {
        ui.showError('Error loading new releases', '#newReleasesGrid');
    }

    try {
        ui.showLoading('#popularGrid');
        const popular = await api.getPopular('movie');
        ui.populateGrid('#popularGrid', popular.slice(0, 5));
    } catch (error) {
        ui.showError('Error loading popular', '#popularGrid');
    }
}

async function initializeMood() {
    const moodGrid = document.getElementById('moodGrid');
    const moods = [
        { id: 'thrilled', title: 'Thrilled', icon: '⚡', description: 'Excited and hasty' },
        { id: 'relaxed', title: 'Relaxed', icon: '😌', description: 'Calm and peaceful' },
        { id: 'emotional', title: 'Emotional', icon: '💭', description: 'Feeling deeply' },
        { id: 'adventurous', title: 'Adventurous', icon: '🗺️', description: 'Seeking thrills?' },
        { id: 'nostalgic', title: 'Nostalgic', icon: '⏮️', description: 'Longing for the past' },
        { id: 'playful', title: 'Playful', icon: '🎭', description: 'Light-hearted and fun' }
    ];

    const html = moods.map(mood => ui.createMoodCardHTML(mood)).join('');
    if (moodGrid) moodGrid.innerHTML = html;
}

async function initializeDiscovery() {
    const urlParams = new URLSearchParams(window.location.search);
    const moodParam = urlParams.get('mood');
    const filterParam = urlParams.get('filter');

    try {
        let results = [];
        if (moodParam) {
            results = await api.getMoviesByMood(moodParam);
            document.getElementById('resultsTitle').textContent = `${moodParam.charAt(0).toUpperCase() + moodParam.slice(1)} Movies`;
        } else if (filterParam === 'trending') {
            results = await api.getTrending('movie');
        } else if (filterParam === 'new') {
            results = await api.getUpcoming();
        } else if (filterParam === 'popular') {
            results = await api.getPopular('movie');
        } else {
            results = await api.discoverMovies();
        }

        ui.displayResults(results);
        document.getElementById('resultsCount').textContent = `${results.length} results`;
    } catch (error) {
        ui.showError('Error loading movies', '#resultsGrid');
    }
}

async function initializeDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = parseInt(urlParams.get('id'));
    const type = urlParams.get('type') || 'movie';

    try {
        const item = type === 'tv' ? 
            await api.getTVDetails(itemId) : 
            await api.getMovieDetails(itemId);
        
        ui.displayDetails(item, type === 'tv');
        
        // Load similar titles
        if (type === 'tv') {
            const similar = await api.getSimilarTV(itemId);
            ui.populateGrid('#similarTitles', similar.slice(0, 5));
        } else {
            const similar = await api.getSimilarMovies(itemId);
            ui.populateGrid('#similarTitles', similar.slice(0, 5));
        }
    } catch (error) {
        ui.showError('Error loading movie details', '#detailContent');
    }
}

async function initializeResults() {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');

    if (!query) {
        window.location.href = 'index.html';
        return;
    }

    try {
        ui.showLoading('#resultsGrid');
        const results = await api.searchMulti(query);
        
        if (results.length === 0) {
            document.getElementById('noResults').style.display = 'block';
            document.getElementById('resultsGrid').style.display = 'none';
        } else {
            ui.displayResults(results);
        }
        
        document.getElementById('resultsTitle').textContent = `Search Results for "${query}"`;
        document.getElementById('resultsCount').textContent = `${results.length} results found`;
    } catch (error) {
        ui.showError('Error searching', '#resultsGrid');
    }
}

async function initializeGroupWatch() {
    // Group watch initialization handled by event listeners
}
