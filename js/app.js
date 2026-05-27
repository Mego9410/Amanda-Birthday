/* ============================================================
   AMANDA'S BIRTHDAY — BURN BOOK EDITION
   app.js — Password gate, animations, gallery, lightbox
============================================================ */

/* ============================================================
   PHOTO + MESSAGE CONFIG
   Drop real photos into /photos/ and update entries below.
   The `grad` is used as a fallback if the image isn't found.
============================================================ */
const PHOTOS = [
  { file: 'photo1.jpg',  caption: 'literally iconic 💋',    grad: 'linear-gradient(135deg,#E91E8C,#FF69B4)' },
  { file: 'photo2.jpg',  caption: 'queen behaviour 🖤',     grad: 'linear-gradient(135deg,#0D0D0D,#C2185B)' },
  { file: 'photo3.jpg',  caption: 'best day ever ✨',       grad: 'linear-gradient(135deg,#FF69B4,#FFB6C1)' },
  { file: 'photo4.jpg',  caption: 'pure magic 🌸',          grad: 'linear-gradient(135deg,#C2185B,#E91E8C)' },
  { file: 'photo5.jpg',  caption: 'so obsessed with her',   grad: 'linear-gradient(135deg,#FFB6C1,#E91E8C)' },
  { file: 'photo6.jpg',  caption: 'golden girl ⭐',         grad: 'linear-gradient(135deg,#E91E8C,#0D0D0D)' },
  { file: 'photo7.jpg',  caption: 'iconic tbh 💅',          grad: 'linear-gradient(135deg,#FF69B4,#C2185B)' },
  { file: 'photo8.jpg',  caption: 'the bestie 🖤',          grad: 'linear-gradient(135deg,#0D0D0D,#E91E8C)' },
  { file: 'photo9.jpg',  caption: 'forever & ever 💋',      grad: 'linear-gradient(135deg,#C2185B,#FF69B4)' },
  { file: 'photo10.jpg', caption: 'main character energy',  grad: 'linear-gradient(135deg,#FFB6C1,#C2185B)' },
  { file: 'photo11.jpg', caption: 'grool moment 🌸',        grad: 'linear-gradient(135deg,#E91E8C,#FFB6C1)' },
  { file: 'photo12.jpg', caption: 'here\'s to you 🥂',     grad: 'linear-gradient(135deg,#0D0D0D,#FF69B4)' },
];

const TAPE_COLORS = ['#E91E8C','#0D0D0D','#C2185B','#FF69B4','#FFB6C1'];
const ROTATIONS  = [-10,-7,-5,-3,-1,0,1,3,5,7,9,11];

const MESSAGES = [
  {
    from: '[Your Name]',
    text: 'Amanda — you are genuinely one of a kind. Every room you walk into is instantly better. Wishing you the most iconic birthday. Love you to bits! 💋',
    icon: '💋',
  },
  {
    from: '[Your Name]',
    text: 'To the funniest, most fabulous person I know — may your birthday be as extra as you are. You deserve every single good thing. Happy birthday! 🖤',
    icon: '🖤',
  },
  {
    from: '[Your Name]',
    text: 'You go, Amanda. You go. Seriously though — you are amazing and today is all about YOU. Can\'t wait to celebrate. Love you always! ✨',
    icon: '✨',
  },
  {
    from: '[Your Name]',
    text: 'Happy birthday to the person who\'s like, really pretty, and also incredibly smart, hilarious, and kind. You\'re the whole package! 🌸',
    icon: '🌸',
  },
  {
    from: '[Your Name]',
    text: 'On Wednesdays we wear pink — but every day we celebrate having Amanda in our lives. You are SO loved. Have the best day! 💗',
    icon: '💗',
  },
  {
    from: '[Your Name]',
    text: 'The limit does not exist when it comes to how much we adore you. Here\'s to the most fetch birthday ever. You absolute queen! 👑',
    icon: '👑',
  },
];

/* ============================================================
   PASSWORD GATE
============================================================ */
const PASSWORD = 'Amanda2026';

const gateEl   = document.getElementById('gate');
const inputEl  = document.getElementById('gate-input');
const btnEl    = document.getElementById('gate-btn');
const errorEl  = document.getElementById('gate-error');
const bookEl   = document.getElementById('gate-book');
const siteEl   = document.getElementById('site');
const confEl   = document.getElementById('confetti');

function handlePasswordSubmit() {
  const val = inputEl.value.trim();

  if (val === PASSWORD) {
    // Correct — celebrate and reveal site
    launchConfetti();
    gateEl.classList.add('exiting');
    setTimeout(() => {
      gateEl.hidden = true;
      siteEl.hidden = false;
      // rAF ensures the browser has painted the page before we measure positions
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          initScrollReveal();
          buildGallery();
          buildMessages();
        });
      });
    }, 800);
  } else {
    // Wrong — shake + error message
    errorEl.textContent = '"That\'s so not fetch." Try again... 💋';
    bookEl.classList.remove('shake');
    void bookEl.offsetWidth; // reflow to restart animation
    bookEl.classList.add('shake');
    inputEl.value = '';
    inputEl.focus();
    setTimeout(() => { errorEl.textContent = ''; }, 3000);
  }
}

btnEl.addEventListener('click', handlePasswordSubmit);

inputEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handlePasswordSubmit();
});

// Remove shake class after animation ends
bookEl.addEventListener('animationend', () => {
  bookEl.classList.remove('shake');
});

/* ============================================================
   CONFETTI
============================================================ */
const CONF_COLORS = ['#E91E8C','#FF69B4','#0D0D0D','#FFFFFF','#FFB6C1','#C2185B','#CC0000'];

function launchConfetti() {
  for (let i = 0; i < 90; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';

    const w = Math.random() * 9 + 4;
    const h = Math.random() * 14 + 6;
    el.style.cssText = [
      `left: ${Math.random() * 100}vw`,
      `width: ${w}px`,
      `height: ${h}px`,
      `background: ${CONF_COLORS[Math.floor(Math.random() * CONF_COLORS.length)]}`,
      `border-radius: ${Math.random() > 0.5 ? '50%' : '1px'}`,
      `animation-delay: ${Math.random() * 1.5}s`,
      `animation-duration: ${Math.random() * 2 + 2.5}s`,
      `--spin: ${Math.random() * 720 - 360}deg`,
      `transform: rotate(${Math.random() * 360}deg)`,
    ].join(';');

    confEl.appendChild(el);
    setTimeout(() => el.remove(), 5500);
  }
}

/* ============================================================
   GALLERY BUILDER
============================================================ */
function buildGallery() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  PHOTOS.forEach((p, i) => {
    const rot   = ROTATIONS[i % ROTATIONS.length];
    const tape  = TAPE_COLORS[i % TAPE_COLORS.length];
    const delay = (i % 4) * 0.1;

    const pol = document.createElement('div');
    pol.className = `gallery-pol reveal delay-${(i % 6) + 1}`;
    pol.style.setProperty('--rot', `${rot}deg`);
    pol.dataset.index = i;
    pol.setAttribute('role', 'button');
    pol.setAttribute('tabindex', '0');
    pol.setAttribute('aria-label', `Photo: ${p.caption}`);

    pol.innerHTML = `
      <div class="gallery-pol-tape" style="background:${tape}"></div>
      <div class="gallery-pol-img" style="
        background-image: url('./photos/${p.file}'), ${p.grad};
        background-size: cover;
        background-position: center;
      "></div>
      <div class="gallery-pol-caption">${p.caption}</div>
    `;

    pol.addEventListener('click', () => openLightbox(p, i));
    pol.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(p, i);
      }
    });

    grid.appendChild(pol);
  });

  // Trigger reveal for items already in view after a tick
  setTimeout(() => initScrollReveal(), 50);
}

/* ============================================================
   MESSAGES BUILDER
============================================================ */
function buildMessages() {
  const grid = document.getElementById('messages-grid');
  if (!grid) return;

  MESSAGES.forEach((m, i) => {
    const card = document.createElement('div');
    card.className = `msg-card reveal delay-${(i % 6) + 1}`;
    card.innerHTML = `
      <div class="msg-card-accent"></div>
      <span class="msg-icon">${m.icon}</span>
      <div class="msg-author">${m.from}</div>
      <p class="msg-text">${m.text}</p>
    `;
    grid.appendChild(card);
  });

  setTimeout(() => initScrollReveal(), 50);
}

/* ============================================================
   LIGHTBOX
============================================================ */
const lightboxEl   = document.getElementById('lightbox');
const lbImgEl      = document.getElementById('lb-img');
const lbCaptionEl  = document.getElementById('lb-caption');
const lbCloseEl    = document.getElementById('lb-close');
const lbBackdropEl = document.getElementById('lb-backdrop');

function openLightbox(photo, idx) {
  lbImgEl.style.backgroundImage    = `url('./photos/${photo.file}'), ${photo.grad}`;
  lbCaptionEl.textContent           = photo.caption;
  lightboxEl.hidden                 = false;
  document.body.style.overflow      = 'hidden';
  lbCloseEl.focus();
}

function closeLightbox() {
  lightboxEl.hidden            = true;
  document.body.style.overflow = '';
}

if (lbCloseEl)   lbCloseEl.addEventListener('click', closeLightbox);
if (lbBackdropEl) lbBackdropEl.addEventListener('click', closeLightbox);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !lightboxEl.hidden) closeLightbox();
});

/* ============================================================
   SCROLL REVEAL — Intersection Observer
============================================================ */
let revealObserver;

function initScrollReveal() {
  // Disconnect previous observer if re-called
  if (revealObserver) revealObserver.disconnect();

  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    // If element is already partially visible at load, reveal immediately
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95) {
      el.classList.add('visible');
    } else {
      revealObserver.observe(el);
    }
  });
}

/* ============================================================
   HERO PARALLAX (subtle — desktop only)
============================================================ */
function initParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const heroBg = document.querySelector('.hero-bg');
  const heroGhost = document.querySelector('.hero-ghost');
  if (!heroBg) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (ticking) return;
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      heroBg.style.transform     = `translateY(${scrollY * 0.35}px)`;
      if (heroGhost) heroGhost.style.transform =
        `translate(-50%, calc(-50% + ${scrollY * 0.2}px))`;
      ticking = false;
    });
    ticking = true;
  }, { passive: true });
}

/* ============================================================
   SCATTER POLAROID — ensure proper rotation on mobile too
============================================================ */
function applyScatterRotations() {
  document.querySelectorAll('.scatter-pol').forEach(el => {
    const rot = el.style.getPropertyValue('--rot') || '0deg';
    el.style.transform = `rotate(${rot})`;
  });
}

/* ============================================================
   INIT
============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Focus the gate input on load
  inputEl.focus();

  // Parallax on desktop
  if (window.innerWidth >= 768) initParallax();

  // Apply scatter rotations
  applyScatterRotations();
});
