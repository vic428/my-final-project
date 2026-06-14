# Film Discovery App

A personalized entertainment guide that solves decision fatigue by helping you find the perfect film or TV show based on your mood, preferences, and group watch settings.

## Project Overview

**Problem Solved:** With thousands of titles spread across dozens of streaming platforms, finding something that matches your mood is overwhelming. Film Discovery takes the guesswork out of selecting what to watch.

**Target Audience:** Families, Couples, Friend groups

## Features

### 1. Mood-Based Discovery
### 2. Genre Browse
### 3. Trending Content Feed
### 4. Movie & Show Detail Pages
### 5. Group Watch Mode
### 6. Personalized Recommendations
### 7. Watchlist / Save for Later
### 8. Search Functionality


## Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6 Modules)
- **APIs:** TMDB (The Movie Database), YouTube Data API
- **Storage:** Browser LocalStorage

## Project Structure

```
my-final-project/
├── index.html              # Home page
├── mood.html               # Mood selection page
├── discovery.html          # Browse by genre page
├── detail.html             # Movie/show detail page
├── group.html              # Group watch mode
├── results.html            # Search results page
├── styles.css              # Complete styling with design system
├── main.js                 # Main entry point
├── modules/
│   ├── api.js             # TMDB & YouTube API integration
│   ├── ui.js              # UI rendering and display logic
│   ├── eventHandler.js    # User interaction events
│   ├── dataManager.js     # LocalStorage management
│   └── animations.js      # CSS animations & transitions
└── README.md              
```

## Design System

### Color Palette
- **Primary Background:** Deep Black (#0A0A0C)
- **Surface/Cards:** Dark Charcoal (#18181F)
- **Primary Accent:** Amber Gold (#E8A020)
- **Secondary Accent:** Electric Teal (#1DB8A0)
- **Primary Text:** Off White (#F0EEE8)
- **Muted Text:** Cool Grey (#888890)
- **Danger/Alert:** Cinematic Red (#E50914)

### Typography
- **Display/Headlines:** Bebas Neue Bold, uppercase, wide letter spacing
- **Body/UI Text:** DM Sans Regular 400, Medium 500
- **Fallback:** System default sans-serif

### Run the App

1. Create a `.env` file in the project root with your API credentials:
```bash
TMDB_API_KEY=your_tmdb_api_key_here
YOUTUBE_API_KEY=your_youtube_api_key_here
```
2. Install the project dependency:
```bash
npm install
```
3. Start the local server that loads environment variables for the browser app:
```bash
npm start
```
4. Open `http://localhost:8000`

This project now reads API keys from environment variables at runtime. Use `npm start` or `node server.js` so the app can read `.env` through the local runtime endpoint.

Static servers such as `python -m http.server`, VS Code Live Server, or opening the HTML files directly will not expose the required `env.json` endpoint, and the app will show API loading errors like `Error loading trending`.

### GitHub Pages Deployment

This project can deploy to GitHub Pages with a public runtime config generated during the workflow. The API keys stay out of git, but they are still delivered to the browser at runtime, so you should restrict them in TMDB and Google Cloud.

1. In your GitHub repository, go to `Settings -> Secrets and variables -> Actions`
2. Add these repository secrets:
   - `TMDB_API_KEY`
   - `YOUTUBE_API_KEY`
   The value must be the real key itself, not a label. For example, do not paste `TMDB API KEY` or `YOUTUBE API KEY` as text.
   `TMDB_API_KEY` should look like a 32-character hex string such as `4aaa...`.
   `YOUTUBE_API_KEY` should usually start with `AIza`.
3. Push to the `main` branch
4. In `Settings -> Pages`, set the source to `GitHub Actions`

The workflow in `.github/workflows/deploy-pages.yml` generates `env.json` during deployment and publishes the site to GitHub Pages without committing the keys to the repository.

For local testing of the same static config file, you can run:
```bash
npm run build:runtime-config
```
That generates a local `env.json` from `.env`, and the file stays ignored by git.

The Pages workflow now publishes a dedicated `dist/` folder so the deployed artifact always includes the generated `env.json`.

If deployment succeeds but the browser shows `401 Unauthorized` with `api_key=TMDB API KEY`, your GitHub secret value is wrong and needs to be replaced with the real API key.



## Module Documentation

### api.js
Handles all external API calls to TMDB and YouTube.

**Key Functions:**
- `getTrending(type)` - Get trending movies/TV
- `discoverMovies(filters)` - Discover movies with filters
- `searchMulti(query)` - Search movies and TV shows
- `getMovieDetails(id)` - Get full movie details
- `getMoviesByMood(mood)` - Get movies matching a mood
- `searchYoutubeTrailer(query)` - Search for trailer

### ui.js
Handles all UI rendering and display logic.

**Key Functions:**
- `createCardHTML(item)` - Create movie card
- `createMoodCardHTML(mood)` - Create mood selection card
- `populateGrid(selector, items)` - Populate grid with items
- `displayDetails(item)` - Display full movie details
- `showTrailerModal(videoId)` - Show trailer video
- `showNotification(message, type)` - Display notifications

### eventHandler.js
Manages all user interactions and events.

**Key Functions:**
- `setupEventListeners()` - Initialize all event listeners
- `initializePage()` - Page-specific initialization
- `setupCardClickEvents()` - Handle card clicks
- `setupMoodEvents()` - Handle mood selection
- `setupDetailPageEvents()` - Handle detail page interactions

### dataManager.js
Manages LocalStorage operations.

**Key Functions:**
- `addToWatchlist(item)` - Add to watchlist
- `getWatchlist()` - Get watchlist
- `saveUserRating(itemId, rating)` - Save rating
- `saveUserReview(itemId, review)` - Save review
- `saveMoodHistory(mood)` - Track mood selections
- `getSearchHistory()` - Get search history
- `exportUserData()` - Export all user data

### animations.js
Handles CSS animations and transitions.

**Key Functions:**
- `animateEntrance(selector, animation)` - Animate entrance
- `fadeInOnScroll(selector)` - Fade in on scroll
- `slideInOnScroll(selector)` - Slide in on scroll
- `scrollToElement(selector)` - Smooth scroll to element
- `pageTransitionIn/Out()` - Page transitions

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimization

The app includes several performance features:

- Lazy loading for images
- Search result caching (1 hour expiration)
- Intersection Observer for scroll animations
- Efficient event delegation
- Minimal DOM manipulation

## Data Privacy

All user data is stored locally in the browser's LocalStorage:
- Watchlist
- Ratings and reviews
- Search history
- Mood preferences

No data is sent to external servers except for API requests to TMDB and YouTube.

### LocalStorage errors
- Clear browser cache and cookies
- Check if LocalStorage is enabled in browser settings

## License

Note: This project is for educational purposes.


