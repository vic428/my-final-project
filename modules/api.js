/**
 * API Module - Handles all external API calls
 * TMDB (The Movie Database) & YouTube Data API
 */

globalThis.process ??= { env: {} };

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/w1280';

function isPlaceholderValue(value) {
    return !value || /^your_/i.test(value) || /^placeholder/i.test(value);
}

function validateTmdbApiKey() {
    if (isPlaceholderValue(process.env.TMDB_API_KEY)) {
        console.error('TMDB_API_KEY is not configured. Set it in your .env file.');
        return false;
    }

    if (!/^[a-f0-9]{32}$/i.test(process.env.TMDB_API_KEY)) {
        console.error('TMDB_API_KEY is invalid. Use the actual 32-character TMDB API key value, not a label like "TMDB API KEY".');
        return false;
    }

    return true;
}

function validateYoutubeApiKey() {
    if (isPlaceholderValue(process.env.YOUTUBE_API_KEY)) {
        console.warn('YOUTUBE_API_KEY is not configured. Set it in your .env file.');
        return false;
    }

    if (process.env.YOUTUBE_API_KEY.includes('.apps.googleusercontent.com')) {
        console.error('YOUTUBE_API_KEY is using a Google OAuth client ID. Create a YouTube Data API key instead.');
        return false;
    }

    if (!/^AIza[0-9A-Za-z_-]{20,}$/.test(process.env.YOUTUBE_API_KEY)) {
        console.error('YOUTUBE_API_KEY is invalid. Use the actual Google API key value, which usually starts with "AIza".');
        return false;
    }

    return true;
}

/**
 * Make a request to TMDB API
 * @param {string} endpoint - API endpoint
 * @param {object} params - Query parameters
 * @returns {Promise<object>} API response
 */
async function fetchFromTMDB(endpoint, params = {}) {
    if (!validateTmdbApiKey()) {
        throw new Error('TMDB_API_KEY is missing');
    }

    const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
    url.searchParams.append('api_key', process.env.TMDB_API_KEY);
    
    Object.keys(params).forEach(key => {
        url.searchParams.append(key, params[key]);
    });

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error('TMDB API Error:', error);
        throw error;
    }
}

/**
 * Get trending movies/TV this week
 * @param {string} type - 'movie' or 'tv'
 * @returns {Promise<array>} Array of trending items
 */
export async function getTrending(type = 'movie') {
    const data = await fetchFromTMDB(`/trending/${type}/week`);
    return data.results || [];
}

/**
 * Get now playing movies
 * @returns {Promise<array>} Array of movies
 */
export async function getNowPlaying() {
    const data = await fetchFromTMDB('/movie/now_playing', { language: 'en-US' });
    return data.results || [];
}

/**
 * Get upcoming movies
 * @returns {Promise<array>} Array of movies
 */
export async function getUpcoming() {
    const data = await fetchFromTMDB('/movie/upcoming', { language: 'en-US' });
    return data.results || [];
}

/**
 * Get most popular movies/TV
 * @param {string} type - 'movie' or 'tv'
 * @param {number} page - Page number
 * @returns {Promise<array>} Array of items
 */
export async function getPopular(type = 'movie', page = 1) {
    const data = await fetchFromTMDB(`/${type}/popular`, { 
        language: 'en-US',
        page 
    });
    return data.results || [];
}

/**
 * Discover movies with filters
 * @param {object} filters - Filter parameters (genre, year, runtime, rating, etc.)
 * @param {number} page - Page number
 * @returns {Promise<array>} Array of movies
 */
export async function discoverMovies(filters = {}, page = 1) {
    const params = {
        language: 'en-US',
        page,
        sort_by: filters.sortBy || 'popularity.desc',
        include_adult: false
    };

    if (filters.genre) params.with_genres = filters.genre;
    if (filters.year) params.primary_release_year = filters.year;
    if (filters.runtime) params.with_runtime = filters.runtime;
    if (filters.minRating) params['vote_average.gte'] = filters.minRating;

    const data = await fetchFromTMDB('/discover/movie', params);
    return data.results || [];
}

/**
 * Discover TV shows with filters
 * @param {object} filters - Filter parameters
 * @param {number} page - Page number
 * @returns {Promise<array>} Array of TV shows
 */
export async function discoverTV(filters = {}, page = 1) {
    const params = {
        language: 'en-US',
        page,
        sort_by: filters.sortBy || 'popularity.desc'
    };

    if (filters.genre) params.with_genres = filters.genre;
    if (filters.year) params.first_air_date_year = filters.year;

    const data = await fetchFromTMDB('/discover/tv', params);
    return data.results || [];
}

/**
 * Search for movies and TV shows
 * @param {string} query - Search query
 * @param {number} page - Page number
 * @returns {Promise<array>} Array of search results
 */
export async function searchMulti(query, page = 1) {
    const data = await fetchFromTMDB('/search/multi', {
        query,
        language: 'en-US',
        page
    });
    return data.results || [];
}

/**
 * Search by actor
 * @param {string} query - Actor name
 * @param {number} page - Page number
 * @returns {Promise<array>} Array of actors
 */
export async function searchPerson(query, page = 1) {
    const data = await fetchFromTMDB('/search/person', {
        query,
        language: 'en-US',
        page
    });
    return data.results || [];
}

/**
 * Get movie details
 * @param {number} movieId - Movie ID
 * @returns {Promise<object>} Movie details
 */
export async function getMovieDetails(movieId) {
    const data = await fetchFromTMDB(`/movie/${movieId}`, {
        language: 'en-US',
        append_to_response: 'credits,watch/providers,videos'
    });
    return data;
}

/**
 * Get TV show details
 * @param {number} tvId - TV show ID
 * @returns {Promise<object>} TV show details
 */
export async function getTVDetails(tvId) {
    const data = await fetchFromTMDB(`/tv/${tvId}`, {
        language: 'en-US',
        append_to_response: 'credits,watch/providers,videos'
    });
    return data;
}

/**
 * Get watch providers for a movie
 * @param {number} movieId - Movie ID
 * @returns {Promise<object>} Watch provider info
 */
export async function getMovieProviders(movieId) {
    const data = await fetchFromTMDB(`/movie/${movieId}/watch/providers`);
    return data.results || {};
}

/**
 * Get watch providers for a TV show
 * @param {number} tvId - TV show ID
 * @returns {Promise<object>} Watch provider info
 */
export async function getTVProviders(tvId) {
    const data = await fetchFromTMDB(`/tv/${tvId}/watch/providers`);
    return data.results || {};
}

/**
 * Get similar movies
 * @param {number} movieId - Movie ID
 * @returns {Promise<array>} Array of similar movies
 */
export async function getSimilarMovies(movieId) {
    const data = await fetchFromTMDB(`/movie/${movieId}/similar`);
    return data.results || [];
}

/**
 * Get similar TV shows
 * @param {number} tvId - TV show ID
 * @returns {Promise<array>} Array of similar TV shows
 */
export async function getSimilarTV(tvId) {
    const data = await fetchFromTMDB(`/tv/${tvId}/similar`);
    return data.results || [];
}

/**
 * Get genres list
 * @param {string} type - 'movie' or 'tv'
 * @returns {Promise<array>} Array of genres
 */
export async function getGenres(type = 'movie') {
    const data = await fetchFromTMDB(`/genre/${type}/list`);
    return data.genres || [];
}

/**
 * Search YouTube for trailer
 * @param {string} query - Search query (usually title)
 * @returns {Promise<string>} YouTube video ID
 */
export async function searchYoutubeTrailer(query) {
    if (!validateYoutubeApiKey()) return null;

    const searchQuery = `${query} official trailer`;
    const url = new URL('https://www.googleapis.com/youtube/v3/search');
    url.searchParams.append('q', searchQuery);
    url.searchParams.append('type', 'video');
    url.searchParams.append('part', 'snippet');
    url.searchParams.append('key', process.env.YOUTUBE_API_KEY);
    url.searchParams.append('maxResults', '1');

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            console.error('YouTube API Error:', data.error?.message || response.statusText);
            return null;
        }
        
        if (data.items && data.items.length > 0) {
            return data.items[0].id.videoId;
        }
        return null;
    } catch (error) {
        console.error('YouTube API Error:', error);
        return null;
    }
}

/**
 * Format image URL
 * @param {string} path - Image path from TMDB
 * @param {string} size - 'poster' or 'backdrop'
 * @returns {string} Full image URL
 */
export function getImageUrl(path, size = 'poster') {
    if (!path) return null;
    return size === 'backdrop' ? `${BACKDROP_BASE_URL}${path}` : `${IMAGE_BASE_URL}${path}`;
}

/**
 * Get movies by mood (genre mapping)
 * @param {string} mood - Selected mood
 * @returns {Promise<array>} Array of movies matching mood
 */
export async function getMoviesByMood(mood) {
    const moodGenreMap = {
        thrilled: [28, 53],           // Action, Thriller
        relaxed: [35, 10749, 10751], // Comedy, Romance, Family
        emotional: [18],              // Drama
        adventurous: [12, 878],       // Adventure, Sci-Fi
        nostalgic: [10402, 16],       // Music, Animation
        playful: [35, 10751]          // Comedy, Family
    };

    const genres = moodGenreMap[mood] || [];
    const genreString = genres.join('|');

    if (genreString) {
        return await discoverMovies({ genre: genreString });
    }
    return await getPopular('movie');
}

export { IMAGE_BASE_URL, BACKDROP_BASE_URL };
