/**
 * Data Manager Module - Handles local storage operations
 */

/**
 * Save item to watchlist
 * @param {object} item - Movie or TV show object
 * @param {boolean} isTV - Whether it's a TV show
 */
export function addToWatchlist(item, isTV = false) {
    let watchlist = getWatchlist();
    
    const itemData = {
        id: item.id,
        title: item.title || item.name,
        posterPath: item.poster_path,
        year: item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0],
        rating: item.vote_average,
        type: isTV ? 'tv' : 'movie',
        addedDate: new Date().toISOString()
    };

    // Check if already in watchlist
    if (watchlist.some(w => w.id === item.id && w.type === itemData.type)) {
        return false;
    }

    watchlist.push(itemData);
    localStorage.setItem('filmDiscovery_watchlist', JSON.stringify(watchlist));
    return true;
}

/**
 * Remove item from watchlist
 * @param {number} itemId - Item ID
 * @param {string} type - 'movie' or 'tv'
 */
export function removeFromWatchlist(itemId, type = 'movie') {
    let watchlist = getWatchlist();
    watchlist = watchlist.filter(w => !(w.id === itemId && w.type === type));
    localStorage.setItem('filmDiscovery_watchlist', JSON.stringify(watchlist));
}

/**
 * Get entire watchlist
 * @returns {array} Array of watchlist items
 */
export function getWatchlist() {
    const data = localStorage.getItem('filmDiscovery_watchlist');
    return data ? JSON.parse(data) : [];
}

/**
 * Check if item is in watchlist
 * @param {number} itemId - Item ID
 * @param {string} type - 'movie' or 'tv'
 * @returns {boolean} Whether item is in watchlist
 */
export function isInWatchlist(itemId, type = 'movie') {
    const watchlist = getWatchlist();
    return watchlist.some(w => w.id === itemId && w.type === type);
}

/**
 * Save user rating for an item
 * @param {number} itemId - Item ID
 * @param {number} rating - Rating 1-5
 * @param {string} type - 'movie' or 'tv'
 */
export function saveUserRating(itemId, rating, type = 'movie') {
    let ratings = getUserRatings();
    
    const existingIndex = ratings.findIndex(r => r.id === itemId && r.type === type);
    
    if (existingIndex !== -1) {
        ratings[existingIndex].rating = rating;
        ratings[existingIndex].updatedDate = new Date().toISOString();
    } else {
        ratings.push({
            id: itemId,
            rating,
            type,
            ratedDate: new Date().toISOString()
        });
    }

    localStorage.setItem('filmDiscovery_ratings', JSON.stringify(ratings));
}

/**
 * Get user rating for an item
 * @param {number} itemId - Item ID
 * @param {string} type - 'movie' or 'tv'
 * @returns {number|null} Rating or null
 */
export function getUserRating(itemId, type = 'movie') {
    const ratings = getUserRatings();
    const found = ratings.find(r => r.id === itemId && r.type === type);
    return found ? found.rating : null;
}

/**
 * Get all user ratings
 * @returns {array} Array of rating objects
 */
export function getUserRatings() {
    const data = localStorage.getItem('filmDiscovery_ratings');
    return data ? JSON.parse(data) : [];
}

/**
 * Save user review for an item
 * @param {number} itemId - Item ID
 * @param {string} review - Review text
 * @param {string} type - 'movie' or 'tv'
 */
export function saveUserReview(itemId, review, type = 'movie') {
    let reviews = getUserReviews();
    
    const existingIndex = reviews.findIndex(r => r.id === itemId && r.type === type);
    
    if (existingIndex !== -1) {
        reviews[existingIndex].review = review;
        reviews[existingIndex].updatedDate = new Date().toISOString();
    } else {
        reviews.push({
            id: itemId,
            review,
            type,
            createdDate: new Date().toISOString()
        });
    }

    localStorage.setItem('filmDiscovery_reviews', JSON.stringify(reviews));
}

/**
 * Get user review for an item
 * @param {number} itemId - Item ID
 * @param {string} type - 'movie' or 'tv'
 * @returns {string|null} Review or null
 */
export function getUserReview(itemId, type = 'movie') {
    const reviews = getUserReviews();
    const found = reviews.find(r => r.id === itemId && r.type === type);
    return found ? found.review : null;
}

/**
 * Get all user reviews
 * @returns {array} Array of review objects
 */
export function getUserReviews() {
    const data = localStorage.getItem('filmDiscovery_reviews');
    return data ? JSON.parse(data) : [];
}

/**
 * Save mood preference history
 * @param {string} mood - Selected mood
 */
export function saveMoodHistory(mood) {
    let history = getMoodHistory();
    
    history.push({
        mood,
        timestamp: new Date().toISOString()
    });

    // Keep only last 50 entries
    if (history.length > 50) {
        history = history.slice(-50);
    }

    localStorage.setItem('filmDiscovery_moodHistory', JSON.stringify(history));
}

/**
 * Get mood preference history
 * @returns {array} Array of mood history entries
 */
export function getMoodHistory() {
    const data = localStorage.getItem('filmDiscovery_moodHistory');
    return data ? JSON.parse(data) : [];
}

/**
 * Get most frequently selected moods
 * @param {number} limit - Number of top moods to return
 * @returns {array} Array of top moods
 */
export function getTopMoods(limit = 5) {
    const history = getMoodHistory();
    const moodCounts = {};

    history.forEach(entry => {
        moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });

    return Object.entries(moodCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([mood]) => mood);
}

/**
 * Save search history
 * @param {string} query - Search query
 */
export function saveSearchHistory(query) {
    let history = getSearchHistory();
    
    // Remove if already exists (to avoid duplicates)
    history = history.filter(item => item.query !== query);
    
    history.unshift({
        query,
        timestamp: new Date().toISOString()
    });

    // Keep only last 20 searches
    if (history.length > 20) {
        history = history.slice(0, 20);
    }

    localStorage.setItem('filmDiscovery_searchHistory', JSON.stringify(history));
}

/**
 * Get search history
 * @returns {array} Array of search history entries
 */
export function getSearchHistory() {
    const data = localStorage.getItem('filmDiscovery_searchHistory');
    return data ? JSON.parse(data) : [];
}

/**
 * Clear search history
 */
export function clearSearchHistory() {
    localStorage.removeItem('filmDiscovery_searchHistory');
}

/**
 * Save user preferences
 * @param {object} preferences - User preferences object
 */
export function saveUserPreferences(preferences) {
    const existing = getUserPreferences();
    const updated = { ...existing, ...preferences, updatedDate: new Date().toISOString() };
    localStorage.setItem('filmDiscovery_preferences', JSON.stringify(updated));
}

/**
 * Get user preferences
 * @returns {object} User preferences object
 */
export function getUserPreferences() {
    const data = localStorage.getItem('filmDiscovery_preferences');
    return data ? JSON.parse(data) : {
        favoriteGenres: [],
        preferredLanguage: 'en',
        theme: 'dark'
    };
}

/**
 * Save theme preference
 * @param {string} theme - 'dark' or 'light'
 */
export function saveThemePreference(theme) {
    saveUserPreferences({ theme });
}

/**
 * Get saved theme preference
 * @returns {string} Theme name
 */
export function getThemePreference() {
    const preferences = getUserPreferences();
    return preferences.theme === 'light' ? 'light' : 'dark';
}

/**
 * Clear all app data
 */
export function clearAllData() {
    localStorage.removeItem('filmDiscovery_watchlist');
    localStorage.removeItem('filmDiscovery_ratings');
    localStorage.removeItem('filmDiscovery_reviews');
    localStorage.removeItem('filmDiscovery_moodHistory');
    localStorage.removeItem('filmDiscovery_searchHistory');
    localStorage.removeItem('filmDiscovery_preferences');
}

/**
 * Export user data as JSON
 * @returns {object} All user data
 */
export function exportUserData() {
    return {
        watchlist: getWatchlist(),
        ratings: getUserRatings(),
        reviews: getUserReviews(),
        moodHistory: getMoodHistory(),
        searchHistory: getSearchHistory(),
        preferences: getUserPreferences(),
        exportedDate: new Date().toISOString()
    };
}

/**
 * Save search results for quick access
 * @param {array} results - Search results
 * @param {string} query - Search query
 */
export function cacheSearchResults(results, query) {
    let cache = getSearchCache();
    cache[query] = {
        results,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('filmDiscovery_searchCache', JSON.stringify(cache));
}

/**
 * Get cached search results
 * @param {string} query - Search query
 * @returns {array|null} Cached results or null
 */
export function getCachedSearchResults(query) {
    const cache = getSearchCache();
    const cached = cache[query];
    
    if (cached) {
        const age = Date.now() - new Date(cached.timestamp).getTime();
        // Cache expires after 1 hour
        if (age < 3600000) {
            return cached.results;
        }
    }
    return null;
}

/**
 * Get search cache object
 * @returns {object} Search cache
 */
export function getSearchCache() {
    const data = localStorage.getItem('filmDiscovery_searchCache');
    return data ? JSON.parse(data) : {};
}

/**
 * Clear old cache entries (older than 1 hour)
 */
export function cleanSearchCache() {
    let cache = getSearchCache();
    const now = Date.now();
    
    Object.keys(cache).forEach(key => {
        const age = now - new Date(cache[key].timestamp).getTime();
        if (age > 3600000) {
            delete cache[key];
        }
    });
    
    localStorage.setItem('filmDiscovery_searchCache', JSON.stringify(cache));
}
