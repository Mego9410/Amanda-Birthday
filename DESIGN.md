# Amanda's Birthday Website — Design Document

## 1. Vision & Concept

A celebration website for Amanda's birthday that feels like a **festival programme meets a handmade scrapbook**. Drawing inspiration from Glastonbury and Reading Festival's bold, sun-soaked aesthetic — layered textures, collage typography, and an organic imperfection that makes everything feel human and joyful.

The experience should feel like opening a beautiful box of memories: warm, loud, a little chaotic in the best way, and utterly personal.

---

## 2. Design Pillars

| Pillar | Description |
|---|---|
| **Mobile-first** | Every layout decision starts at 375px and expands |
| **Festival energy** | Bold type, sun-drenched colours, layered compositions |
| **Scrapbook warmth** | Polaroids, texture, handwritten accents, imperfect rotation |
| **Celebration motion** | Scroll-triggered reveals, parallax, floating confetti |
| **Gated intimacy** | Password entry feels like getting your wristband |

---

## 3. Colour Palette

| Name | Hex | Usage |
|---|---|---|
| Sunshine Yellow | `#F5C842` | Primary accent, hero elements, CTAs |
| Coral Sunset | `#E8715A` | Secondary accent, highlights |
| Sage Festival | `#7BAF6F` | Tertiary, nature/summer feel |
| Cream Paper | `#FFF8EE` | Page background — warm off-white |
| Deep Earth | `#2C1810` | Primary text, dark contrast |
| Dusty Pink | `#E8B4A0` | Soft accent, polaroid tapes |
| Festival Purple | `#8B6BB1` | Occasional pop, variety |
| Sky Blue | `#87CEEB` | Soft backgrounds, polaroid backing |

---

## 4. Typography

| Role | Font | Weight | Notes |
|---|---|---|---|
| **Display / Hero** | Boogaloo | 400 | Fun, rounded, festival-poster energy |
| **Section Headings** | Playfair Display | 700 | Elegant editorial contrast |
| **Body** | Nunito | 400 / 600 | Friendly, highly readable at all sizes |
| **Handwritten Accent** | Dancing Script | 700 | Polaroid captions, personal touches |
| **Label / Tag** | Nunito | 800 | All-caps small labels |

All fonts via Google Fonts.

---

## 5. Page Architecture

```
┌─────────────────────────────┐
│   PASSWORD GATE (OVERLAY)   │  ← Full-screen, blocks all content
└─────────────────────────────┘
         ↓ (on correct password)
┌─────────────────────────────┐
│   SECTION 1: HERO           │  ← Festival poster, "Happy Birthday Amanda!"
├─────────────────────────────┤
│   SECTION 2: THE STORY      │  ← Intro copy + first polaroid scatter
├─────────────────────────────┤
│   SECTION 3: PHOTO WALL     │  ← Full polaroid collage gallery
├─────────────────────────────┤
│   SECTION 4: MESSAGES       │  ← Birthday wishes cards
├─────────────────────────────┤
│   SECTION 5: CLOSING        │  ← Party banner + final message
└─────────────────────────────┘
```

---

## 6. Section Specifications

### 6.1 Password Gate

- **Full-screen overlay** on top of all content, removed on correct entry
- Visual metaphor: **festival wristband / ticket booth**
- Background: textured dark green (festival field at night)
- Central card styled as a **festival ticket** — tear-edge borders, bold font
- Headline: `"AMANDA FEST 2026"` in display font
- Subline: `"Members Only — Enter Your Wristband Code"`
- Input: large, centred, styled as a ticket-stub input field
- Button: `"GET IN ✦"` — amber/yellow
- On wrong password: ticket "rejects" with a shake animation
- On correct password: confetti burst, overlay fades out with a wipe transition
- Password: `Amanda2026` (hardcoded, case-sensitive)

### 6.2 Hero Section

- **Full viewport height** (100dvh on mobile)
- Layout: layered poster composition
  - Background: gradient from warm amber → coral sunset
  - Large decorative text (outline/ghost style): `"BIRTHDAY"` running across width
  - Main headline: `"Happy Birthday"` + `"Amanda!"` — oversized, stacked
  - Sub-copy: year, a short celebratory line
  - **3 polaroids** floating at angles (left, centre-bottom, right), animated entrance
  - Floating emoji/icons: sun ☀ stars ✦ confetti dots
  - Scroll-down indicator: animated chevron
- **Parallax**: background moves at 0.5x scroll speed
- Mobile: single column, polaroids stack below headline

### 6.3 The Story Section

- Background: Cream Paper `#FFF8EE`
- Left/Right alternating layout (desktop) → single column (mobile)
- **Text block**: "This one's for Amanda…" — personal intro paragraph, placeholder for friend to fill in
- **Polaroid scatter**: 4–5 polaroids at −8° to +8° rotation, overlapping slightly
- Each polaroid has:
  - White border (4:3 ratio)
  - Coloured "tape" strip at top (washi tape look)
  - Caption in Dancing Script beneath the photo area
  - Drop shadow
  - Hover: lifts and de-rotates with subtle scale
- Scroll animation: polaroids fly in from left/right on scroll

### 6.4 Photo Wall

- Background: dark textured (cork board / dark wood feel)
- **Masonry/collage grid** of polaroids
  - Desktop: 3–4 column irregular grid
  - Tablet: 2 column
  - Mobile: 2 column tight
- Polaroids vary in:
  - Rotation: −12° to +12°
  - Size: some slightly larger (hero shots)
  - Tape colour: cycles through palette
- Each polaroid clickable → lightbox view (full photo, no rotation)
- Scroll animation: polaroids appear in staggered waves
- Section header: `"THE MEMORIES ✦"` in Playfair Display, reversed out white

### 6.5 Birthday Messages

- Background: wavy/organic section divider from photo wall
- Layout: horizontal scroll on mobile, 2-column grid on desktop
- Each message = **greeting card** style:
  - Coloured card background (cycles through palette shades)
  - Author name in Playfair Display
  - Message in Nunito
  - Small decorative element (star, flower, etc.)
- Placeholder cards pre-populated with fun template messages
- Scroll animation: cards fan in from bottom

### 6.6 Closing Section

- Background: festival sunset gradient (deep coral → purple → navy)
- Central composition:
  - Big "🎉" or star burst
  - `"Here's to you, Amanda"` in display font
  - Looping confetti/particle animation (CSS-only)
  - Tagline: `"Amanda Fest 2026 — One day only"`
- Footer: small, minimal — no clutter

---

## 7. Animation & Motion

| Trigger | Animation | Duration | Easing |
|---|---|---|---|
| Page load (after password) | Confetti burst | 3s | ease-out |
| Scroll enter (text) | Fade up + slide | 0.6s | ease-out |
| Scroll enter (polaroids) | Rotate + slide in | 0.8s | cubic-bezier spring |
| Polaroid hover | Scale 1.05 + de-rotate | 0.3s | ease |
| Parallax (hero BG) | translateY at 0.4x | — | linear |
| Password wrong | Shake horizontal | 0.4s | ease |
| Password correct | Fade out overlay | 0.8s | ease-in |
| Section headers | Letter-by-letter reveal | 0.8s | stagger 0.05s |

All animations respect `prefers-reduced-motion`.

---

## 8. Photo Handling

Since photos will be provided by the user, the codebase will use:
- A `photos/` directory at project root
- Images referenced by filename in a config array in `js/photos.js`
- Placeholder images (solid colour) used until real photos are dropped in
- All images run through CSS `object-fit: cover` inside the polaroid frame

---

## 9. Technical Stack

| Layer | Choice | Reason |
|---|---|---|
| **Structure** | Vanilla HTML5 | Zero dependencies, fast load |
| **Styling** | CSS3 (custom properties, grid, flex) | No build step, maintainable |
| **Animation** | CSS keyframes + Intersection Observer API | Performant, no libraries needed |
| **Fonts** | Google Fonts (preconnect) | Free, fast, beautiful |
| **Lightbox** | Vanilla JS micro-implementation | No bloat |
| **Hosting** | GitHub Pages (static) | Free, push to deploy |

No frameworks, no build tools, no npm — fully self-contained static site.

---

## 10. Accessibility & Performance

- All images have descriptive `alt` text
- Colour contrast AA minimum throughout
- Focus styles visible on all interactive elements
- Fonts load with `font-display: swap`
- Images lazy-loaded below fold
- `prefers-reduced-motion` disables parallax and reduces animations

---

## 11. File Structure

```
Amanda-Birthday/
├── index.html          ← Single-page application shell
├── css/
│   ├── main.css        ← Global styles, variables, reset
│   ├── password.css    ← Password gate styles
│   ├── hero.css        ← Hero section
│   ├── story.css       ← Story section
│   ├── gallery.css     ← Photo wall
│   ├── messages.css    ← Birthday messages
│   └── closing.css     ← Closing section
├── js/
│   ├── password.js     ← Gate logic
│   ├── animations.js   ← Scroll observer, motion
│   ├── gallery.js      ← Lightbox, polaroid grid
│   └── photos.js       ← Photo config array
├── photos/             ← Drop photos here (user-provided)
├── assets/
│   └── textures/       ← Background textures (CSS-generated)
├── wireframe.html      ← This design artefact
└── DESIGN.md           ← This document
```
