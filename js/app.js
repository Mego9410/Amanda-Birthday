/* ============================================================
   AMANDA'S BIRTHDAY — BURN BOOK EDITION
   Cosmos-inspired: continuous canvas, line reveals, word reveals,
   layered parallax, scroll-driven glow
============================================================ */

/* ============================================================
   PHOTO + MESSAGE CONFIG
============================================================ */
/* Photos are discovered at runtime from /api/photos and reshuffled on
   every page load, so the site cycles through whatever is in the photos
   folder. Captions are pulled at random from the Burn Book pool below. */
let PHOTOS = [];

const CAPTION_POOL = [
  'so fetch 💋', 'iconic 👑', 'main character ✨', 'certified baddie 🖤',
  'she\'s a 10 💅', 'pink rules 💗', 'legend 🥂', 'the moment 📸',
  'unbothered 💋', 'too glam 💄', 'pure vibes 🔥', 'queen behaviour 👑',
  'flawless ✨', 'no notes 💯', 'iconic only 💋', 'serving looks 💃',
  'a whole snack 🍒', 'that girl 🌸', 'mood forever 🖤', 'limit does not exist ➗',
];

const GRAD_POOL = [
  'linear-gradient(135deg,#E91E8C,#FF69B4)',
  'linear-gradient(135deg,#C2185B,#E91E8C)',
  'linear-gradient(135deg,#FFB6C1,#FF69B4)',
  'linear-gradient(135deg,#0D0D0D,#C2185B)',
  'linear-gradient(135deg,#E91E8C,#FFB6C1)',
  'linear-gradient(135deg,#FF69B4,#C2185B)',
  'linear-gradient(135deg,#0D0D0D,#E91E8C)',
];

const FALLBACK_PHOTOS = Array.from({ length: 16 }, (_, i) => `photo${i + 1}.jpg`);

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Turn a list of filenames into shuffled photo objects with random captions.
function buildPhotoObjects(files) {
  const shuffledFiles = shuffle(files);
  const shuffledCaps  = shuffle(CAPTION_POOL);
  return shuffledFiles.map((file, i) => ({
    file,
    caption: shuffledCaps[i % shuffledCaps.length],
    grad:    GRAD_POOL[i % GRAD_POOL.length],
  }));
}

let _photosReady = false;
async function ensurePhotos() {
  if (_photosReady) return;
  let files = [];
  try {
    const res = await fetch('/api/photos');
    if (res.ok) files = (await res.json()).photos || [];
  } catch (e) { /* fall through to fallback */ }
  if (!files.length) files = FALLBACK_PHOTOS;
  PHOTOS = buildPhotoObjects(files);
  _photosReady = true;
}

// Override the hardcoded hero / scatter polaroids with shuffled photos.
function decoratePhotoEls(imgSel, capSel, photos, offset = 0) {
  if (!photos.length) return;
  document.querySelectorAll(imgSel).forEach((el, i) => {
    const p = photos[(i + offset) % photos.length];
    el.style.background = `url('./photos/${p.file}') center/cover, ${p.grad}`;
  });
  document.querySelectorAll(capSel).forEach((el, i) => {
    const p = photos[(i + offset) % photos.length];
    el.textContent = p.caption;
  });
}

const TAPE_COLORS = ['#E91E8C','#0D0D0D','#C2185B','#FF69B4','#FFB6C1'];
const ROTATIONS   = [-14,-8,11,-5,9,-12,6,-9,13,-4,8,-15,5,-10,7,-3];

const MESSAGES = [
  { from: '[Your Name]', text: 'Amanda — you are genuinely <span class="redact">one of a kind</span>. Every room you walk into is instantly <span class="redact">better</span>. Wishing you the most <span class="redact">iconic</span> birthday. Love you to bits! 💋',                               icon: '💋' },
  { from: '[Your Name]', text: 'To the funniest, most <span class="redact">fabulous</span> person I know — may your birthday be as <span class="redact">extra</span> as you are. You deserve every single <span class="redact">good thing</span>. Happy birthday! 🖤',                              icon: '🖤' },
  { from: '[Your Name]', text: 'You go, Amanda. You go. Seriously though — you are <span class="redact">amazing</span> and today is <span class="redact">all about YOU</span>. Can\'t wait to <span class="redact">celebrate</span>. Love you always! ✨',                                         icon: '✨' },
  { from: '[Your Name]', text: 'Happy birthday to the person who\'s like, really <span class="redact">pretty</span>, and also incredibly <span class="redact">smart, hilarious</span>, and kind. You\'re <span class="redact">the whole package</span>! 🌸',                                        icon: '🌸' },
  { from: '[Your Name]', text: 'On Wednesdays we wear pink — but every day we celebrate <span class="redact">having Amanda in our lives</span>. You are SO <span class="redact">loved</span>. Have the <span class="redact">best day</span>! 💗',                                                   icon: '💗' },
  { from: '[Your Name]', text: 'The limit does not exist when it comes to how much we <span class="redact">adore you</span>. Here\'s to the most <span class="redact">fetch</span> birthday ever. You absolute <span class="redact">queen</span>! 👑',                                              icon: '👑' },
  { from: '[Your Name]', text: 'The party is at <span class="redact">The Venue, London</span> on <span class="redact">Saturday 15th March</span> from <span class="redact">7:30pm</span>. RSVP below by <span class="redact">1st March</span>. Can\'t wait! 🥂', icon: '📍', classified: true },
];

/* ============================================================
   DOM REFS
============================================================ */
const gateEl      = document.getElementById('gate');
const inputEl     = document.getElementById('gate-input');
const btnEl       = document.getElementById('gate-btn');
const errorEl     = document.getElementById('gate-error');
const bookEl      = document.getElementById('gate-book');
const siteEl      = document.getElementById('site');
const confEl      = document.getElementById('confetti');
const bgGlowEl    = document.getElementById('bg-glow');
const lightboxEl  = document.getElementById('lightbox');
const lbImgEl     = document.getElementById('lb-img');
const lbCaptionEl = document.getElementById('lb-caption');
const lbCloseEl   = document.getElementById('lb-close');
const lbBackdropEl= document.getElementById('lb-backdrop');

/* ============================================================
   PASSWORD GATE
============================================================ */
const PASSWORD_FULL     = 'Amanda2026';
const PASSWORD_REDACTED = '2026Amanda';

function handlePasswordSubmit() {
  const val = inputEl.value.trim();
  if (val === PASSWORD_FULL || val === PASSWORD_REDACTED) {
    const mode = val === PASSWORD_FULL ? 'full' : 'redacted';
    launchConfetti();
    gateEl.classList.add('exiting');
    setTimeout(() => {
      gateEl.hidden = true;
      siteEl.dataset.mode = mode;
      siteEl.hidden = false;
      requestAnimationFrame(() => requestAnimationFrame(async () => {
        await ensurePhotos();
        splitWords();
        decoratePhotoEls('.hero-polaroids .hero-pol-img', '.hero-polaroids .hero-pol-caption', PHOTOS, 0);
        decoratePhotoEls('.story-scatter .scatter-pol-img', '.story-scatter .scatter-pol-cap', PHOTOS, 4);
        buildGallery();
        buildMessages();
        buildHeroCollage();
        initScrollReveal();
        initParallax();
        initRSVP();
        if (mode === 'full') { loadBurnBookEntries(); startBurnBookPolling(); }
      }));
    }, 800);
  } else {
    errorEl.textContent = '"That\'s so not fetch." Try again... 💋';
    bookEl.classList.remove('shake');
    void bookEl.offsetWidth;
    bookEl.classList.add('shake');
    inputEl.value = '';
    inputEl.focus();
    setTimeout(() => { errorEl.textContent = ''; }, 3000);
  }
}

btnEl.addEventListener('click', handlePasswordSubmit);
inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') handlePasswordSubmit(); });
bookEl.addEventListener('animationend', () => bookEl.classList.remove('shake'));

/* ============================================================
   CONFETTI
============================================================ */
const CONF_COLORS = ['#E91E8C','#FF69B4','#0D0D0D','#FFFFFF','#FFB6C1','#C2185B','#CC0000'];

function launchConfetti() {
  for (let i = 0; i < 90; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.cssText = [
      `left:${Math.random() * 100}vw`,
      `width:${Math.random() * 9 + 4}px`,
      `height:${Math.random() * 14 + 6}px`,
      `background:${CONF_COLORS[Math.floor(Math.random() * CONF_COLORS.length)]}`,
      `border-radius:${Math.random() > 0.5 ? '50%' : '1px'}`,
      `animation-delay:${Math.random() * 1.5}s`,
      `animation-duration:${Math.random() * 2 + 2.5}s`,
      `--spin:${Math.random() * 720 - 360}deg`,
      `transform:rotate(${Math.random() * 360}deg)`,
    ].join(';');
    confEl.appendChild(el);
    setTimeout(() => el.remove(), 5500);
  }
}

/* ============================================================
   WORD SPLITTER — wraps each word in a <span class="word">
   Called once before reveal observers are set up.
============================================================ */
function splitWords() {
  document.querySelectorAll('.split-words').forEach(el => {
    // Preserve the text content, split on whitespace
    const raw = el.textContent.trim().split(/\s+/);
    el.innerHTML = raw.map((w, i) =>
      `<span class="word" style="--wi:${i}">${w}</span>`
    ).join(' ');
  });
}

/* ============================================================
   SCROLL REVEAL — three distinct observation strategies
============================================================ */
let observers = [];

function initScrollReveal() {
  // Disconnect any existing observers
  observers.forEach(o => o.disconnect());
  observers = [];

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- 1. Line-by-line heading reveals --- */
  const lineObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('lines-visible');
        lineObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.line-reveal-target').forEach(el => {
    if (reducedMotion) {
      el.classList.add('lines-visible');
    } else if (el.getBoundingClientRect().top < window.innerHeight * 0.95) {
      el.classList.add('lines-visible');
    } else {
      lineObserver.observe(el);
    }
  });
  observers.push(lineObserver);

  /* --- 2. Word-by-word paragraph reveals --- */
  const wordObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('words-visible');
        wordObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.split-words').forEach(el => {
    if (reducedMotion) {
      el.classList.add('words-visible');
    } else if (el.getBoundingClientRect().top < window.innerHeight * 0.95) {
      el.classList.add('words-visible');
    } else {
      wordObserver.observe(el);
    }
  });
  observers.push(wordObserver);

  /* --- 3. Generic reveals (.reveal, .reveal-left, .reveal-right) --- */
  const genericObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        genericObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    if (reducedMotion) {
      el.classList.add('visible');
    } else if (el.getBoundingClientRect().top < window.innerHeight * 0.95) {
      el.classList.add('visible');
    } else {
      genericObserver.observe(el);
    }
  });
  observers.push(genericObserver);

  /* --- 4. Polaroid drop-in (gallery-pol) — slightly higher threshold --- */
  const polObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        polObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -20px 0px' });

  document.querySelectorAll('.gallery-pol').forEach((el, i) => {
    // Individual stagger via JS transition-delay
    el.style.transitionDelay = `${(i % 4) * 0.08}s`;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.95) {
      el.classList.add('visible');
    } else {
      polObserver.observe(el);
    }
  });
  observers.push(polObserver);
}

/* ============================================================
   PARALLAX + SCROLL-DRIVEN GLOW
   All scroll work batched into one rAF loop.
============================================================ */
function initParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const heroBg    = document.querySelector('.hero-bg');
  const heroGhost = document.querySelector('.hero-ghost');
  const hp1       = document.querySelector('.hp-1');
  const hp2       = document.querySelector('.hp-2');
  const hp3       = document.querySelector('.hp-3');
  const hp4       = document.querySelector('.hp-4');
  const closingLips = document.querySelectorAll('.closing-lip');

  let ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const sy       = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const progress  = maxScroll > 0 ? sy / maxScroll : 0;

      /* --- Hero layers --- */
      if (heroBg)    heroBg.style.transform    = `translateY(${sy * 0.35}px)`;
      if (heroGhost) heroGhost.style.transform  = `translate(-50%, calc(-50% + ${sy * 0.18}px))`;

      /* --- Hero polaroids — each at a distinct depth --- */
      if (hp1) hp1.style.transform = `rotate(-12deg) translateY(${sy * 0.12}px)`;
      if (hp2) hp2.style.transform = `rotate(9deg)   translateY(${sy * 0.20}px)`;
      if (hp3) hp3.style.transform = `rotate(-6deg)  translateY(${sy * 0.16}px)`;
      if (hp4) hp4.style.transform = `rotate(7deg)   translateY(${sy * 0.09}px)`;

      /* --- Closing lip decorations drift at slightly different rates --- */
      closingLips.forEach((el, i) => {
        el.style.transform = `translateY(${sy * (0.025 + i * 0.008)}px)`;
      });

      /* --- Scroll-driven background glow ---
           Pink radial starts at top (hero), drifts down the page,
           intensity peaks around middle of the scroll journey, fades at bottom.
      */
      if (bgGlowEl) {
        const y         = 5 + progress * 90;                      // 5% → 95% vertical position
        const intensity = Math.sin(progress * Math.PI * 1.1) * 0.14; // 0 → peak → 0
        bgGlowEl.style.background =
          `radial-gradient(ellipse at 50% ${y.toFixed(1)}%, rgba(233,30,140,${Math.max(0, intensity).toFixed(3)}) 0%, transparent 55%)`;
      }

      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Run once immediately to set initial state
  onScroll();
}

/* ============================================================
   GALLERY BUILDER
============================================================ */
const GALLERY_LIMIT = 20; // random subset shown per load — cycles across refreshes

function buildGallery() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  // PHOTOS is already shuffled, so the first N is a fresh random subset.
  PHOTOS.slice(0, GALLERY_LIMIT).forEach((p, i) => {
    const rot  = ROTATIONS[i % ROTATIONS.length];
    const tape = TAPE_COLORS[i % TAPE_COLORS.length];

    const pol = document.createElement('div');
    pol.className = 'gallery-pol';
    pol.style.setProperty('--rot', `${rot}deg`);
    pol.setAttribute('role', 'button');
    pol.setAttribute('tabindex', '0');
    pol.setAttribute('aria-label', `Photo: ${p.caption}`);

    pol.innerHTML = `
      <div class="gallery-pol-tape" style="background:${tape}"></div>
      <div class="gallery-pol-img" style="background-image:url('./photos/${p.file}'),${p.grad}; background-size:cover; background-position:center;"></div>
      <div class="gallery-pol-caption">${p.caption}</div>
    `;

    pol.addEventListener('click', () => openLightbox(p));
    pol.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(p); }
    });

    grid.appendChild(pol);
  });
}

/* ============================================================
   MESSAGES BUILDER
============================================================ */
function buildMessages() {
  const grid = document.getElementById('messages-grid');
  if (!grid) return;

  MESSAGES.forEach(m => {
    const card = document.createElement('div');
    card.className = 'msg-card reveal msg-placeholder' + (m.classified ? ' classified' : '');
    card.innerHTML = `
      <div class="msg-card-accent"></div>
      <span class="msg-icon">${m.icon}</span>
      <div class="msg-author">${m.from}</div>
      <p class="msg-text">${m.text}</p>
    `;
    grid.appendChild(card);
  });
}

/* ============================================================
   BURN BOOK — live entries via API polling
============================================================ */
const _shownEntryIds = new Set();

async function loadBurnBookEntries() {
  try {
    const res = await fetch('/api/entries');
    if (!res.ok) return;
    const { entries } = await res.json();
    // Once the first real memory is approved, clear the placeholder notes.
    if (entries && entries.length) {
      document.querySelectorAll('#messages-grid .msg-placeholder').forEach(el => el.remove());
    }
    (entries || []).forEach(row => {
      if (_shownEntryIds.has(row.id)) return;
      _shownEntryIds.add(row.id);
      addBurnBookMessage(row.full_name, row.quote);
    });
  } catch (e) {
    console.error('Failed to load burn book entries:', e);
  }
}

function startBurnBookPolling() {
  setInterval(loadBurnBookEntries, 30000);
}

/* ============================================================
   RSVP
============================================================ */
function initRSVP() {
  const form        = document.getElementById('rsvp-form');
  const submitBtn   = document.getElementById('rsvp-submit');
  const rsvpErrorEl = document.getElementById('rsvp-error');
  const successEl   = document.getElementById('rsvp-success');
  const attendBtns  = form.querySelectorAll('.attend-btn');
  const attendInput = document.getElementById('rsvp-attending');

  attendBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      attendBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      attendInput.value = btn.dataset.val;
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    rsvpErrorEl.hidden = true;
    const name      = form.full_name.value.trim();
    const email     = form.email.value.trim();
    const attending = attendInput.value;
    const quote     = form.quote.value.trim();
    const dietary   = form.dietary.value.trim();
    if (!name)      { showRSVPError('Please enter your full name.'); return; }
    if (!email)     { showRSVPError('Please enter your email address.'); return; }
    if (!attending) { showRSVPError('Please select whether you\'re coming.'); return; }
    if (!quote)     { showRSVPError('Please share a memory or message for Amanda.'); return; }
    setLoading(true);
    let resData;
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: name, email, attending, dietary: dietary || null, quote }),
      });
      resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Server error');
    } catch (err) {
      setLoading(false);
      showRSVPError('Something went wrong — please try again.');
      console.error(err);
      return;
    }
    setLoading(false);
    form.hidden = true;
    successEl.hidden = false;
    // Memory is now pending admin approval — it will appear in the Burn
    // Book once approved (picked up by the 30s poll), so nothing is shown
    // optimistically here.
  });

  function showRSVPError(msg) {
    rsvpErrorEl.textContent = msg;
    rsvpErrorEl.hidden = false;
  }
  function setLoading(on) {
    submitBtn.disabled = on;
    submitBtn.querySelector('.btn-label').hidden = on;
    submitBtn.querySelector('.btn-loading').hidden = !on;
  }
}

function addBurnBookMessage(author, text) {
  const grid = document.getElementById('messages-grid');
  if (!grid) return;

  const icons = ['💌', '🥂', '✨', '💗', '🎉', '💫', '🖤', '👑'];
  const icon  = icons[Math.floor(Math.random() * icons.length)];

  const card     = document.createElement('div');
  card.className = 'msg-card';

  const accent   = document.createElement('div');
  accent.className = 'msg-card-accent';

  const iconEl   = document.createElement('span');
  iconEl.className = 'msg-icon';
  iconEl.textContent = icon;

  const authorEl = document.createElement('div');
  authorEl.className = 'msg-author';
  authorEl.textContent = author;

  const textEl   = document.createElement('p');
  textEl.className = 'msg-text';
  textEl.textContent = text;

  card.append(accent, iconEl, authorEl, textEl);

  card.style.opacity   = '0';
  card.style.transform = 'translateY(28px)';
  grid.appendChild(card);

  requestAnimationFrame(() => {
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    card.style.opacity    = '1';
    card.style.transform  = 'translateY(0)';
  });
}

/* ============================================================
   HERO COLLAGE
============================================================ */
const HERO_COL_POS = [
  { x: '-1%',  y: '4%',   rot: -18 },
  { x: '12%',  y: '12%',  rot: 12  },
  { x: '4%',   y: '26%',  rot: -9  },
  { x: '28%',  y: '-3%',  rot: -5  },
  { x: '56%',  y: '1%',   rot: 9   },
  { x: '73%',  y: '5%',   rot: 7   },
  { x: '80%',  y: '8%',   rot: 15  },
  { x: '88%',  y: '22%',  rot: -8  },
  { x: '-2%',  y: '70%',  rot: 14  },
  { x: '9%',   y: '82%',  rot: -16 },
  { x: '20%',  y: '88%',  rot: 8   },
  { x: '35%',  y: '90%',  rot: -6  },
  { x: '55%',  y: '86%',  rot: 11  },
  { x: '74%',  y: '80%',  rot: -12 },
  { x: '85%',  y: '68%',  rot: 10  },
  { x: '-3%',  y: '47%',  rot: -13 },
];
const HC_TAPE_ROTS = [-8, 5, -3, 7, -5, 4, -9, 6];

function buildHeroCollage() {
  const container = document.getElementById('hero-collage');
  if (!container) return;

  // Use a random subset sized to the available collage positions.
  PHOTOS.slice(0, HERO_COL_POS.length).forEach((p, i) => {
    const pos     = HERO_COL_POS[i];
    const tape    = TAPE_COLORS[i % TAPE_COLORS.length];
    const tapeRot = HC_TAPE_ROTS[i % HC_TAPE_ROTS.length];

    const pol = document.createElement('div');
    pol.className = 'hc-pol';
    pol.style.left      = pos.x;
    pol.style.top       = pos.y;
    pol.style.transform = `rotate(${pos.rot}deg)`;

    pol.innerHTML = `
      <div class="hc-pol-tape" style="background:${tape}; transform:translateX(-50%) rotate(${tapeRot}deg)"></div>
      <div class="hc-pol-img" style="background-image:url('./photos/${p.file}'),${p.grad}"></div>
    `;

    container.appendChild(pol);
  });
}

/* ============================================================
   LIGHTBOX
============================================================ */
function openLightbox(photo) {
  lbImgEl.style.backgroundImage = `url('./photos/${photo.file}'),${photo.grad}`;
  lbCaptionEl.textContent        = photo.caption;
  lightboxEl.hidden              = false;
  document.body.style.overflow   = 'hidden';
  lbCloseEl.focus();
}

function closeLightbox() {
  lightboxEl.hidden            = true;
  document.body.style.overflow = '';
}

if (lbCloseEl)    lbCloseEl.addEventListener('click', closeLightbox);
if (lbBackdropEl) lbBackdropEl.addEventListener('click', closeLightbox);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !lightboxEl.hidden) closeLightbox();
});

/* ============================================================
   INIT
============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  inputEl.focus();
  ensurePhotos(); // warm the photo list while the guest types the password
});
