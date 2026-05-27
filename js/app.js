/* ============================================================
   AMANDA'S BIRTHDAY — BURN BOOK EDITION
   Cosmos-inspired: continuous canvas, line reveals, word reveals,
   layered parallax, scroll-driven glow
============================================================ */

/* ============================================================
   PHOTO + MESSAGE CONFIG
============================================================ */
const PHOTOS = [
  { file: 'photo1.jpg',  caption: 'literally iconic 💋',   grad: 'linear-gradient(135deg,#E91E8C,#FF69B4)' },
  { file: 'photo2.jpg',  caption: 'queen behaviour 🖤',    grad: 'linear-gradient(135deg,#0D0D0D,#C2185B)' },
  { file: 'photo3.jpg',  caption: 'best day ever ✨',      grad: 'linear-gradient(135deg,#FF69B4,#FFB6C1)' },
  { file: 'photo4.jpg',  caption: 'pure magic 🌸',         grad: 'linear-gradient(135deg,#C2185B,#E91E8C)' },
  { file: 'photo5.jpg',  caption: 'so obsessed with her',  grad: 'linear-gradient(135deg,#FFB6C1,#E91E8C)' },
  { file: 'photo6.jpg',  caption: 'golden girl ⭐',        grad: 'linear-gradient(135deg,#E91E8C,#0D0D0D)' },
  { file: 'photo7.jpg',  caption: 'iconic tbh 💅',         grad: 'linear-gradient(135deg,#FF69B4,#C2185B)' },
  { file: 'photo8.jpg',  caption: 'the bestie 🖤',         grad: 'linear-gradient(135deg,#0D0D0D,#E91E8C)' },
  { file: 'photo9.jpg',  caption: 'forever & ever 💋',     grad: 'linear-gradient(135deg,#C2185B,#FF69B4)' },
  { file: 'photo10.jpg', caption: 'main character energy', grad: 'linear-gradient(135deg,#FFB6C1,#C2185B)' },
  { file: 'photo11.jpg', caption: 'grool moment 🌸',       grad: 'linear-gradient(135deg,#E91E8C,#FFB6C1)' },
  { file: 'photo12.jpg', caption: 'here\'s to you 🥂',    grad: 'linear-gradient(135deg,#0D0D0D,#FF69B4)' },
];

const TAPE_COLORS = ['#E91E8C','#0D0D0D','#C2185B','#FF69B4','#FFB6C1'];
const ROTATIONS   = [-10,-7,-5,-3,-1,0,1,3,5,7,9,11];

const MESSAGES = [
  { from: '[Your Name]', text: 'Amanda — you are genuinely one of a kind. Every room you walk into is instantly better. Wishing you the most iconic birthday. Love you to bits! 💋',                                            icon: '💋' },
  { from: '[Your Name]', text: 'To the funniest, most fabulous person I know — may your birthday be as extra as you are. You deserve every single good thing. Happy birthday! 🖤',                                            icon: '🖤' },
  { from: '[Your Name]', text: 'You go, Amanda. You go. Seriously though — you are amazing and today is all about YOU. Can\'t wait to celebrate. Love you always! ✨',                                                       icon: '✨' },
  { from: '[Your Name]', text: 'Happy birthday to the person who\'s like, really pretty, and also incredibly smart, hilarious, and kind. You\'re the whole package! 🌸',                                                    icon: '🌸' },
  { from: '[Your Name]', text: 'On Wednesdays we wear pink — but every day we celebrate having Amanda in our lives. You are SO loved. Have the best day! 💗',                                                               icon: '💗' },
  { from: '[Your Name]', text: 'The limit does not exist when it comes to how much we adore you. Here\'s to the most fetch birthday ever. You absolute queen! 👑',                                                          icon: '👑' },
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
      requestAnimationFrame(() => requestAnimationFrame(() => {
        splitWords();
        buildGallery();
        buildMessages();
        initScrollReveal();
        initParallax();
        initRSVP();
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
function buildGallery() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  PHOTOS.forEach((p, i) => {
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
    card.className = 'msg-card reveal' + (m.classified ? ' classified' : '');
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
    const dietary   = form.dietary.value.trim();
    if (!name)      { showRSVPError('Please enter your full name.'); return; }
    if (!email)     { showRSVPError('Please enter your email address.'); return; }
    if (!attending) { showRSVPError('Please select whether you\'re coming.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    form.hidden = true;
    successEl.hidden = false;
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
});
