// =============================================
// JAKUB SOJKA – Main JS
// =============================================

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollReveal();
  initSPZ();
  initTabs();
  initFAQ();
  initCalc();
  initKontaktForm();
  initCounters();
  initGoogleReviews();
  initKalkSection();
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
      const target = document.querySelector(a.getAttribute('href'));
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
}

// ======================== SPZ ========================
function initSPZ() {
  const spzInput = document.getElementById('spzInput');
  const spzNext = document.getElementById('spzNext');
  const spzFormExpand = document.getElementById('spzFormExpand');
  const spzValue = document.getElementById('spzValue');
  const spzSubmit = document.getElementById('spzSubmit');
  const spzSuccess = document.getElementById('spzSuccess');

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

// ======================== TABY ========================
function initTabs() {
  document.querySelectorAll('.spz-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.spz-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.spz-content').forEach(c => c.classList.add('hidden'));
      document.getElementById(`tab-${tab.dataset.tab}`).classList.remove('hidden');
    });
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

// ======================== COUNTER ANIMACE ========================
function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.target);
      const isDecimal = el.dataset.decimal;
      const duration = 1800;
      const start = performance.now();

      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const value = eased * target;
        el.textContent = isDecimal ? value.toFixed(1) : Math.floor(value).toLocaleString('cs-CZ');
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = isDecimal ? target.toFixed(1) : target.toLocaleString('cs-CZ');
      }

      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

// ======================== HYPOTEČNÍ KALKULAČKA ========================
function initCalc() {
  const vyseRange = document.getElementById('calcVyseRange');
  const sazbaRange = document.getElementById('calcSazbaRange');
  const dobaRange = document.getElementById('calcDobaRange');

  function updateDisplay() {
    const vyse = parseFloat(vyseRange.value);
    const sazba = parseFloat(sazbaRange.value);
    const doba = parseFloat(dobaRange.value);

    // Live labels
    document.getElementById('calcVyseDisplay').textContent = formatCZK(vyse) + ' Kč';
    document.getElementById('calcSazbaDisplay').textContent = sazba.toFixed(1).replace('.', ',') + ' %';
    document.getElementById('calcDobaDisplay').textContent = doba + ' let';

    // Update range gradient
    updateRangeGradient(vyseRange, '#2563eb');
    updateRangeGradient(sazbaRange, '#8b5cf6');
    updateRangeGradient(dobaRange, '#10b981');

    // Výpočet
    const P = vyse;
    const r = sazba / 100 / 12;
    const n = doba * 12;
    const splatka = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const celkem = splatka * n;
    const uroky = celkem - P;

    document.getElementById('calcSplatka').textContent = formatCZK(splatka) + ' Kč';
    document.getElementById('calcCelkem').textContent = formatCZK(celkem) + ' Kč';
    document.getElementById('calcUroky').textContent = formatCZK(uroky) + ' Kč';
    document.getElementById('calcJistina').textContent = formatCZK(P) + ' Kč';
  }

  [vyseRange, sazbaRange, dobaRange].forEach(r => r.addEventListener('input', updateDisplay));
  updateDisplay();

  // Submit
  document.getElementById('calcSubmit').addEventListener('click', async () => {
    const jmeno = document.getElementById('calcJmeno').value.trim();
    const telefon = document.getElementById('calcTelefon').value.trim();
    const email = document.getElementById('calcEmail').value.trim();

    if (!jmeno || !telefon) { alert('Vyplňte prosím jméno a telefon.'); return; }

    const btn = document.getElementById('calcSubmit');
    btn.textContent = 'Odesílám...';
    btn.disabled = true;

    await saveLead({
      jmeno, telefon, email, typ: 'hypoteka',
      kalkulacka_data: {
        vyse: vyseRange.value,
        sazba: sazbaRange.value,
        doba: dobaRange.value,
        splatka: document.getElementById('calcSplatka').textContent
      }
    });

    document.getElementById('calcContactForm').classList.add('hidden');
    document.getElementById('calcSuccess').classList.remove('hidden');
  });
}

function updateRangeGradient(range, color) {
  const min = parseFloat(range.min);
  const max = parseFloat(range.max);
  const val = parseFloat(range.value);
  const pct = ((val - min) / (max - min)) * 100;
  range.style.background = `linear-gradient(to right, ${color} ${pct}%, #e2e8f0 ${pct}%)`;
}

function formatCZK(num) {
  return Math.round(num).toLocaleString('cs-CZ');
}

// ======================== KONTAKTNÍ FORMULÁŘ ========================
function initKontaktForm() {
  document.getElementById('kontaktForm').addEventListener('submit', async e => {
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

    document.getElementById('kontaktForm').classList.add('hidden');
    document.getElementById('kontaktSuccess').classList.remove('hidden');
  });
}

// ======================== GOOGLE RECENZE ========================
function initGoogleReviews() {
  const GOOGLE_PLACES_ID = 'DOPLNIT_GOOGLE_PLACES_ID';
  const GOOGLE_API_KEY = 'DOPLNIT_GOOGLE_API_KEY';
  const GOOGLE_REVIEW_URL = `https://search.google.com/local/reviews?placeid=${GOOGLE_PLACES_ID}`;

  document.getElementById('googleReviewLink').href = GOOGLE_REVIEW_URL;
  document.getElementById('allReviewsBtn').href = GOOGLE_REVIEW_URL;

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

// ======================== KALKULACE SEKCE ========================
function initKalkSection() {
  // Tab switching
  document.querySelectorAll('.kalk-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.kalk-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.kalk-pane').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const pane = document.getElementById('kpane-' + tab.dataset.pane);
      if (pane) pane.classList.add('active');
      const success = document.getElementById('kalkSuccess');
      if (success) success.classList.add('hidden');
    });
  });

  // Pill radio groups
  document.querySelectorAll('.kalk-pills').forEach(group => {
    group.querySelectorAll('.kalk-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        group.querySelectorAll('.kalk-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        // Update LTV if hypoteka
        updateLTV();
        // Toggle dny/rocni
        if (group.dataset.group === 'cestTyp') {
          const dnyGroup = document.getElementById('kCestDnyGroup');
          if (dnyGroup) dnyGroup.style.display = pill.dataset.val === 'rocni' ? 'none' : '';
        }
      });
    });
  });

  // SPZ formatting
  const spz = document.getElementById('kAutoSpz');
  if (spz) {
    spz.addEventListener('input', e => {
      let v = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
      if (v.length > 3) v = v.slice(0, 3) + ' ' + v.slice(3);
      e.target.value = v;
    });
  }

  // Range sliders – live labels
  const sliders = [
    { id: 'kAutoplati',    labelId: 'kAutoPlatiVal',   fmt: v => fmtKc(v) + '/rok' },
    { id: 'kZivotVek',     labelId: 'kZivotVekVal',    fmt: v => v + ' let' },
    { id: 'kZivotBudget',  labelId: 'kZivotBudgetVal', fmt: v => fmtKc(v) + '/měs' },
    { id: 'kMajetekPlocha',labelId: 'kMajetekPlochaVal',fmt: v => v + ' m²' },
    { id: 'kHypHodnota',   labelId: 'kHypHodnotaVal',  fmt: v => fmtKc(v) + ' Kč' },
    { id: 'kHypVyse',      labelId: 'kHypVyseVal',     fmt: v => fmtKc(v) + ' Kč' },
    { id: 'kHypDoba',      labelId: 'kHypDobaVal',     fmt: v => v + ' let' },
    { id: 'kCestDny',      labelId: 'kCestDnyVal',     fmt: v => v + ' dní' },
  ];
  sliders.forEach(({ id, labelId, fmt }) => {
    const el = document.getElementById(id);
    const label = document.getElementById(labelId);
    if (!el || !label) return;
    const update = () => { label.textContent = fmt(el.value); updateLTV(); };
    el.addEventListener('input', update);
    update();
  });

  // Number stepper (cestovní – osoby)
  let osoby = 2;
  const stepVal = document.getElementById('kCestOsobyVal');
  document.getElementById('kCestMinus')?.addEventListener('click', () => {
    if (osoby > 1) { osoby--; if (stepVal) stepVal.textContent = osoby; }
  });
  document.getElementById('kCestPlus')?.addEventListener('click', () => {
    if (osoby < 8) { osoby++; if (stepVal) stepVal.textContent = osoby; }
  });

  // LTV updater
  function updateLTV() {
    const hodEl = document.getElementById('kHypHodnota');
    const vyseEl = document.getElementById('kHypVyse');
    const ltvBadge = document.getElementById('kHypLtv');
    if (!hodEl || !vyseEl || !ltvBadge) return;
    const hod = parseFloat(hodEl.value);
    const vyse = parseFloat(vyseEl.value);
    if (hod > 0) {
      const ltv = Math.round((vyse / hod) * 100);
      ltvBadge.textContent = 'LTV ' + ltv + ' %';
      ltvBadge.style.background = ltv > 90 ? 'var(--red)' : ltv > 80 ? 'var(--amber)' : 'var(--green)';
    }
  }

  // Submit
  document.querySelectorAll('.kalk-odeslat').forEach(btn => {
    btn.addEventListener('click', async () => {
      const pane = btn.closest('.kalk-pane');
      if (!pane) return;
      const jmeno = pane.querySelector('.kalk-f-jmeno')?.value.trim();
      const email = pane.querySelector('.kalk-f-email')?.value.trim();
      const telefon = pane.querySelector('.kalk-f-telefon')?.value.trim();
      if (!jmeno || !email) {
        ['.kalk-f-jmeno', '.kalk-f-email'].forEach(sel => {
          const el = pane.querySelector(sel);
          if (el && !el.value.trim()) { el.style.borderColor = 'var(--red)'; setTimeout(() => el.style.borderColor = '', 2000); }
        });
        return;
      }

      // Active tab
      const activeTab = document.querySelector('.kalk-tab.active');
      const service = activeTab?.dataset.pane || '';

      // Loading state
      btn.textContent = 'Počítám...';
      btn.disabled = true;

      await new Promise(r => setTimeout(r, 1200));

      // Calculate price
      const price = calcPrice(service, osoby);

      // Supabase
      try {
        if (typeof supabase !== 'undefined') {
          await supabase.from('poptavky').insert([{
            jmeno, email, telefon,
            typ: service,
            cena_od: price.od,
            cena_do: price.do,
            zdroj: 'kalkulace-sekce'
          }]);
        }
      } catch (e) { console.warn('Supabase:', e); }

      // Show success
      document.querySelectorAll('.kalk-pane').forEach(p => p.classList.remove('active'));
      const successEl = document.getElementById('kalkSuccess');
      if (successEl) {
        successEl.classList.remove('hidden');
        const priceEl = document.getElementById('kalkPriceResult');
        if (priceEl) priceEl.innerHTML = buildPriceHTML(service, price, email);
      }

      btn.textContent = 'Nezávazně spočítat cenu →';
      btn.disabled = false;
    });
  });

  // Reset
  document.getElementById('kalkReset')?.addEventListener('click', () => {
    const success = document.getElementById('kalkSuccess');
    if (success) success.classList.add('hidden');
    const first = document.querySelector('.kalk-tab');
    if (first) first.click();
  });

  // Helpers
  function fmtKc(v) {
    return parseInt(v).toLocaleString('cs-CZ');
  }

  function calcPrice(service, osoby) {
    let base, mult = 1;
    if (service === 'auto') {
      base = 4500;
      const typ = document.querySelector('[data-group="autoTyp"] .kalk-pill.active')?.dataset.val;
      if (typ === 'havarie') base *= 1.8;
      else if (typ === 'obe') base *= 2.4;
      else base *= 0.7;
      const rok = document.getElementById('kAutoRok')?.value;
      if (rok === '2020') mult *= 1.2;
      else if (rok === '2015') mult *= 1.0;
      else if (rok === '2010') mult *= 0.85;
      else if (rok === '2005') mult *= 0.75;
      else if (rok === '2000') mult *= 0.65;
      const vek = document.getElementById('kAutoVek')?.value;
      if (vek === '18') mult *= 1.5;
      else if (vek === '36') mult *= 0.9;
      else if (vek === '56') mult *= 1.1;
      const result = Math.round(base * mult / 100) * 100;
      return { od: Math.round(result * 0.85 / 100) * 100, do: Math.round(result * 1.15 / 100) * 100, unit: 'Kč/rok', extra: calcAutoSaving(result) };
    }
    if (service === 'zivot') {
      base = 450;
      const vek = parseInt(document.getElementById('kZivotVek')?.value || 35);
      base += Math.max(0, vek - 30) * 8;
      const kurak = document.querySelector('[data-group="zivotKurak"] .kalk-pill.active')?.dataset.val;
      if (kurak === 'ano') base *= 1.35;
      document.querySelectorAll('#kpane-zivot input[type="checkbox"]').forEach(cb => {
        if (cb.checked) {
          if (cb.value === 'smrt') base += 50;
          if (cb.value === 'invalidita') base += 80;
          if (cb.value === 'kriticka') base += 70;
          if (cb.value === 'uraz') base += 40;
          if (cb.value === 'pn') base += 60;
        }
      });
      return { od: Math.round(base * 0.9 / 10) * 10, do: Math.round(base * 1.2 / 10) * 10, unit: 'Kč/měsíc' };
    }
    if (service === 'majetek') {
      const typ = document.querySelector('[data-group="majetekTyp"] .kalk-pill.active')?.dataset.val;
      const plocha = parseInt(document.getElementById('kMajetekPlocha')?.value || 100);
      const perM2 = { dum: 18, byt: 12, domacnost: 8, chata: 14 }[typ] || 12;
      base = perM2 * plocha;
      const rok = document.getElementById('kMajetekRok')?.value;
      if (rok === '1980') base *= 1.1;
      else if (rok === '1960') base *= 1.2;
      else if (rok === '1900') base *= 1.35;
      return { od: Math.round(base * 0.85 / 100) * 100, do: Math.round(base * 1.15 / 100) * 100, unit: 'Kč/rok' };
    }
    if (service === 'hypoteka') {
      const vyse = parseFloat(document.getElementById('kHypVyse')?.value || 3000000);
      const doba = parseInt(document.getElementById('kHypDoba')?.value || 25);
      const r35 = (3.5/100)/12, r45 = (4.5/100)/12, r55 = (5.5/100)/12;
      const spl = (r, P, n) => Math.round(P * r / (1 - Math.pow(1+r, -n)));
      const n = doba * 12;
      return {
        od: spl(r35, vyse, n), do: spl(r55, vyse, n),
        main: spl(r45, vyse, n), unit: 'Kč/měsíc',
        extra: `Celkem zaplatíte: ${fmtKc(spl(r45,vyse,n)*n)} Kč`
      };
    }
    if (service === 'cestovni') {
      const dest = document.querySelector('[data-group="cestDest"] .kalk-pill.active')?.dataset.val;
      const typ = document.querySelector('[data-group="cestTyp"] .kalk-pill.active')?.dataset.val;
      const sport = document.querySelector('[data-group="cestSport"] .kalk-pill.active')?.dataset.val;
      const dny = parseInt(document.getElementById('kCestDny')?.value || 14);
      const denSazba = { evropa: 39, svet: 69, usa: 99 }[dest] || 39;
      const rocniSazba = { evropa: 890, svet: 1490, usa: 2290 }[dest] || 890;
      let base = typ === 'rocni' ? rocniSazba * osoby : denSazba * dny * osoby;
      if (sport === 'rekreacni') base *= 1.2;
      if (sport === 'rizikovy') base *= 1.6;
      return { od: Math.round(base * 0.9 / 10) * 10, do: Math.round(base * 1.1 / 10) * 10, unit: 'Kč' };
    }
    return { od: 0, do: 0, unit: 'Kč' };
  }

  function calcAutoSaving(result) {
    const plati = parseInt(document.getElementById('kAutoplati')?.value || 0);
    if (plati > result * 1.1) {
      return `Potenciální úspora: <span class="kalk-price-saving">~${fmtKc(plati - result)} Kč/rok</span>`;
    }
    return null;
  }

  function buildPriceHTML(service, price, email) {
    let html = '';
    if (service === 'hypoteka' && price.main) {
      html += `<div class="kalk-price-row"><span>Měsíční splátka (při sazbě 4,5 %)</span><strong>${fmtKc(price.main)} Kč/měsíc</strong></div>`;
      html += `<div class="kalk-price-row"><span>Rozsah (3,5 % – 5,5 %)</span><strong>${fmtKc(price.od)} – ${fmtKc(price.do)} Kč/měs</strong></div>`;
      if (price.extra) html += `<div class="kalk-price-row"><span>${price.extra}</span></div>`;
    } else {
      html += `<div class="kalk-price-row"><span>Orientační cena</span><strong>${fmtKc(price.od)} – ${fmtKc(price.do)} ${price.unit}</strong></div>`;
      if (price.extra) html += `<div class="kalk-price-row">${price.extra}</div>`;
    }
    html += `<div class="kalk-price-row" style="border-top:1px solid var(--gray-200);padding-top:10px;margin-top:4px;"><span>Kalkulace odeslána na</span><strong>${email}</strong></div>`;
    return html;
  }
}
