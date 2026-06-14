# Film Discovery App

A personalized entertainment guide that solves decision fatigue by helping you find the perfect film or TV show based on your mood, preferences, and group watch settings.

## Project Overview

**Problem Solved:** With thousands of titles spread across dozens of streaming platforms, finding something that matches your mood is overwhelming. Film Discovery takes the guesswork out of selecting what to watch.

**Target Audience:** Families, Couples, Friend groups

## Features

### 1. Mood-Based Discovery
Select your current mood and receive tailored recommendations mapped to matching genres, tones, and content tags.

### 2. Genre Browse
Browse content by genre with layered filters for release year, runtime, age rating, and language.

### 3. Trending Content Feed
Regularly updated feeds showcasing trending content organized by category:
- Trending This Week
- New Releases
- Most Talked About

### 4. Movie & Show Detail Pages
Each title displays:
- Synopsis and cast information
- User ratings and reviews
- Trailer links
- Age ratings and runtime
- Streaming platform availability

### 5. Group Watch Mode
Each participant inputs their preferences independently, and the app finds the best overlapping title match.

### 6. Personalized Recommendations
The app learns from user ratings, saved titles, and mood history to serve increasingly relevant suggestions.

### 7. Watchlist / Save for Later
Users save titles to a personal backlog, sortable and easy to access for planning movie nights.

### 8. Search Functionality
Search by title, actor, director, or keyword with quick-glance results.

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

## Troubleshooting

### "API Error: 401"
- Check if your API keys are correct in `modules/api.js`
- Verify keys are active in TMDB and Google Cloud Console

### Trailers not loading
- Make sure `YOUTUBE_API_KEY` is a YouTube Data API key, not an OAuth client ID
- If the value ends with `.apps.googleusercontent.com`, create an API key in Google Cloud Console and paste that instead

### Images not loading
- Check if the image paths are being constructed correctly
- Verify TMDB API key has image access permissions

### Search not working
- Ensure you're connected to the internet
- Check browser console for API errors
- Verify TMDB API is returning results

### LocalStorage errors
- Clear browser cache and cookies
- Check if LocalStorage is enabled in browser settings

## License

This project is for educational purposes.

## Support

For issues or questions:
1. Check the browser console for error messages
2. Verify API keys are configured correctly
3. Test with different movies/TV shows
4. Clear browser cache and try again

---

**Built with ❤️ for film lovers everywhere.**
