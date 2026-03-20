// =============================================
// JAKUB SOJKA – Main JS
// =============================================

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollReveal();
  initSPZ();
  initFAQ();
  initKontaktForm();
  initGoogleReviews();
  initModal();
});

// ======================== NAVBAR ========================
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if (current > 80) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
    if (current > lastScroll && current > 300) navbar.classList.add('hidden');
    else navbar.classList.remove('hidden');
    lastScroll = current;
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#') return; // let modal or other handlers deal with it
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

// ======================== SCROLL REVEAL ========================
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Zpřístupni observer pro reviews.js (dynamicky přidané karty)
  window._revealObserver = observer;
}

// ======================== SPZ ========================
function initSPZ() {
  const spzInput = document.getElementById('spzInput');
  const spzNext = document.getElementById('spzNext');
  const spzFormExpand = document.getElementById('spzFormExpand');
  const spzValue = document.getElementById('spzValue');
  const spzSubmit = document.getElementById('spzSubmit');
  const spzSuccess = document.getElementById('spzSuccess');

  if (!spzInput) return;

  // Auto-formát SPZ
  spzInput.addEventListener('input', e => {
    let v = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (v.length > 3) v = v.slice(0, 3) + ' ' + v.slice(3, 7);
    e.target.value = v;
  });

  spzNext.addEventListener('click', () => {
    const spz = spzInput.value.trim();
    if (spz.length < 4) {
      spzInput.closest('.spz-plate').style.borderColor = '#ef4444';
      spzInput.style.animation = 'shake .3s ease';
      setTimeout(() => {
        spzInput.style.animation = '';
        spzInput.closest('.spz-plate').style.borderColor = '';
      }, 600);
      spzInput.focus();
      return;
    }
    spzValue.textContent = spz;
    spzFormExpand.classList.remove('hidden');
    setTimeout(() => spzFormExpand.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
  });

  spzSubmit.addEventListener('click', async () => {
    const jmeno = document.getElementById('spzJmeno').value.trim();
    const telefon = document.getElementById('spzTelefon').value.trim();
    const email = document.getElementById('spzEmail').value.trim();
    const spz = spzInput.value.trim();

    if (!jmeno || !telefon) {
      alert('Vyplňte prosím jméno a telefon.');
      return;
    }

    spzSubmit.textContent = 'Odesílám...';
    spzSubmit.disabled = true;

    await saveLead({ jmeno, telefon, email, spz, typ: 'spz_pojisteni' });

    spzFormExpand.classList.add('hidden');
    spzSuccess.classList.remove('hidden');
  });
}

// ======================== FAQ ========================
function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-q').addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-a').style.maxHeight = '0';
      });
      if (!isOpen) {
        item.classList.add('open');
        item.querySelector('.faq-a').style.maxHeight = item.querySelector('.faq-a').scrollHeight + 'px';
      }
    });
  });
}

// ======================== KONTAKTNÍ FORMULÁŘ (v modalu) ========================
function initKontaktForm() {
  const form = document.getElementById('kontaktForm');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const jmeno = document.getElementById('kontJmeno').value.trim();
    const telefon = document.getElementById('kontTelefon').value.trim();
    const email = document.getElementById('kontEmail').value.trim();
    const typ = document.getElementById('kontTyp').value || 'jine';
    const zprava = document.getElementById('kontZprava').value.trim();

    const btn = e.target.querySelector('button[type="submit"]');
    btn.textContent = 'Odesílám...';
    btn.disabled = true;

    await saveLead({ jmeno, telefon, email, typ: `kontakt_${typ}`, zprava });

    form.classList.add('hidden');
    document.getElementById('kontaktSuccess').classList.remove('hidden');
  });
}

// ======================== GOOGLE RECENZE ========================
function initGoogleReviews() {
  const GOOGLE_PLACES_ID = 'DOPLNIT_GOOGLE_PLACES_ID';
  const GOOGLE_API_KEY = 'DOPLNIT_GOOGLE_API_KEY';
  const GOOGLE_REVIEW_URL = `https://search.google.com/local/reviews?placeid=${GOOGLE_PLACES_ID}`;

  const reviewLink = document.getElementById('googleReviewLink');
  const allReviewsBtn = document.getElementById('allReviewsBtn');
  if (reviewLink) reviewLink.href = GOOGLE_REVIEW_URL;
  if (allReviewsBtn) allReviewsBtn.href = GOOGLE_REVIEW_URL;

  if (GOOGLE_API_KEY !== 'DOPLNIT_GOOGLE_API_KEY') {
    fetchGoogleReviews(GOOGLE_PLACES_ID, GOOGLE_API_KEY);
  }
}

async function fetchGoogleReviews(placeId, apiKey) {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&language=cs&key=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    if (!data.result?.reviews) return;

    const colors = ['#3b82f6','#8b5cf6','#10b981','#f59e0b','#ef4444','#06b6d4'];
    const grid = document.getElementById('reviewsGrid');
    grid.innerHTML = '';

    data.result.reviews.slice(0, 6).forEach((r, i) => {
      const initials = r.author_name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
      const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
      grid.insertAdjacentHTML('beforeend', `
        <div class="review-card reveal">
          <div class="review-top">
            <div class="review-avatar" style="--av-color:${colors[i % colors.length]}">${initials}</div>
            <div class="review-meta">
              <div class="review-name">${r.author_name}</div>
              <div class="review-stars">${stars}</div>
              <div class="review-date">${r.relative_time_description}</div>
            </div>
          </div>
          <p class="review-text">"${r.text}"</p>
        </div>
      `);
    });

    // Re-apply scroll reveal on new elements
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
      new IntersectionObserver(([e]) => {
        if (e.isIntersecting) { el.classList.add('visible'); }
      }, { threshold: 0.12 }).observe(el);
    });

    if (data.result.rating) document.querySelector('.g-info strong').textContent = data.result.rating.toFixed(1);
    if (data.result.user_ratings_total) document.querySelector('.g-info span').textContent = `· ${data.result.user_ratings_total} recenzí na Google`;
  } catch (e) {
    console.warn('Google Reviews: fallback na statické.', e);
  }
}

// ======================== MODAL ========================
function initModal() {
  const modal = document.getElementById('poptavkaModal');
  const modalClose = document.getElementById('modalClose');

  if (!modal) return;

  function openModal() {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.open-modal, #navCta').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
  });
}
