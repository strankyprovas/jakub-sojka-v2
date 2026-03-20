/* ================================================
   Google Places API – automatické recenze
   Jakub Sojka web
   ================================================

   NASTAVENÍ – stačí jen JEDEN krok:
   1. Vlož svůj Google API klíč do PLACES_API_KEY níže
   2. Hotovo! Place ID se najde automaticky.

   ================================================ */

const PLACES_API_KEY = '';   // ← SEM vlož API klíč (AIza...)
const PLACE_ID       = '';   // nemusíš vyplňovat – doplní se automaticky
const SEARCH_QUERY   = 'Jakub Sojka pojišťovací makléř';

const GOOGLE_MAPS_URL = 'https://www.google.com/maps/search/Jakub+Sojka+pojišťovací+makléř/';
const CACHE_KEY       = 'js_reviews_data';
const CACHE_TIME_KEY  = 'js_reviews_time';
const CACHE_HOURS     = 24;
const MAX_REVIEWS     = 6;

const AVATAR_COLORS   = ['#3b82f6','#8b5cf6','#10b981','#f59e0b','#ef4444','#06b6d4'];

/* ---------- inicializace ---------- */
function initReviews() {
  // Pokud není nakonfigurováno, nech statické recenze
  if (!PLACES_API_KEY || !PLACE_ID) return;

  // Nastav odkaz na Google profil
  setGoogleLinks();

  // Zkus cache
  const cached = getCachedReviews();
  if (cached) {
    renderReviews(cached.reviews, cached.rating, cached.total);
    return;
  }

  // Načti Maps JS API
  loadMapsAPI();
}

/* ---------- Google Maps API ---------- */
function loadMapsAPI() {
  if (window.google && window.google.maps && window.google.maps.places) {
    fetchPlaceDetails();
    return;
  }
  const s = document.createElement('script');
  s.src = `https://maps.googleapis.com/maps/api/js?key=${PLACES_API_KEY}&libraries=places&callback=_jsReviewsReady&language=cs`;
  s.async = true;
  s.defer = true;
  document.head.appendChild(s);
}

window._jsReviewsReady = function () {
  // Použij uložené Place ID z cache, nebo ho nejdřív najdi
  const cachedPlaceId = localStorage.getItem('js_place_id');
  if (cachedPlaceId) {
    fetchPlaceDetails(cachedPlaceId);
  } else {
    findPlaceByName();
  }
};

function findPlaceByName() {
  const service = new google.maps.places.PlacesService(document.createElement('div'));
  service.findPlaceFromQuery(
    { query: SEARCH_QUERY, fields: ['place_id'] },
    function (results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK && results && results[0]) {
        const id = results[0].place_id;
        localStorage.setItem('js_place_id', id); // uložíme, ať příště nemusíme znovu hledat
        fetchPlaceDetails(id);
      }
    }
  );
}

function fetchPlaceDetails(placeId) {
  const service = new google.maps.places.PlacesService(document.createElement('div'));
  service.getDetails(
    { placeId: placeId, fields: ['reviews', 'rating', 'user_ratings_total'], language: 'cs' },
    function (place, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK && place && place.reviews) {
        cacheReviews(place.reviews, place.rating, place.user_ratings_total);
        renderReviews(place.reviews, place.rating, place.user_ratings_total);
      }
      // Při chybě zůstanou statické recenze
    }
  );
}

/* ---------- Cache (localStorage, 24 h) ---------- */
function getCachedReviews() {
  try {
    const t = localStorage.getItem(CACHE_TIME_KEY);
    if (!t) return null;
    if ((Date.now() - parseInt(t)) / 3600000 > CACHE_HOURS) return null;
    const d = localStorage.getItem(CACHE_KEY);
    return d ? JSON.parse(d) : null;
  } catch (e) { return null; }
}

function cacheReviews(reviews, rating, total) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ reviews, rating, total }));
    localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
  } catch (e) {}
}

/* ---------- Render ---------- */
function renderReviews(reviews, rating, total) {
  // Aktualizuj hodnocení v hlavičce sekce
  const ratingNum  = document.querySelector('.g-info strong');
  const ratingInfo = document.querySelector('.g-info span');
  if (ratingNum && rating)  ratingNum.textContent  = rating.toFixed(1);
  if (ratingInfo && total)  ratingInfo.textContent = `· ${total}+ recenzí na Google`;

  // Filtruj recenze s textem
  const valid = reviews
    .filter(r => r.text && r.text.trim().length > 15)
    .slice(0, MAX_REVIEWS);

  if (!valid.length) return;

  const grid = document.getElementById('reviewsGrid');
  if (!grid) return;

  grid.innerHTML = valid.map((r, i) => {
    const initials = r.author_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    const color    = AVATAR_COLORS[i % AVATAR_COLORS.length];
    const stars    = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
    const delay    = ['', 'reveal--delay-1', 'reveal--delay-2'][i % 3];

    return `
<div class="review-card reveal ${delay}">
  <div class="review-top">
    <div class="review-avatar" style="--av-color:${color}">${escHtml(initials)}</div>
    <div class="review-meta">
      <div class="review-name">${escHtml(r.author_name)}</div>
      <div class="review-stars">${stars}</div>
      <div class="review-date">${escHtml(r.relative_time_description)}</div>
    </div>
    <div class="google-icon">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#4285f4">
        <path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"/>
      </svg>
    </div>
  </div>
  <p class="review-text">"${escHtml(r.text)}"</p>
</div>`.trim();
  }).join('\n');

  // Spusť reveal observer na nových elementech
  if (window._revealObserver) {
    grid.querySelectorAll('.reveal').forEach(el => window._revealObserver.observe(el));
  }
}

/* ---------- Nastav Google linky ---------- */
function setGoogleLinks() {
  document.querySelectorAll('#googleReviewLink, #allReviewsBtn').forEach(el => {
    el.href = GOOGLE_MAPS_URL;
  });
}

/* ---------- Helper ---------- */
function escHtml(s) {
  return String(s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

/* ---------- Start ---------- */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initReviews);
} else {
  initReviews();
}
