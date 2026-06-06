# monvalo.com

**monvalo.com** is a warm, deeply empathetic, production-ready bilingual (Bangla 🇧🇩 & English 🇬🇧) mental health platform focusing on Panic Disorder, Anxiety Disorder, Unexpected Panic Attacks, and persistent fears. 

Rather than adopting a cold, clinical, or hospital-like aesthetic, the platform is designed to feel like a warm personal journal with organic layouts, soft pastel colors, morphing mesh gradients, subtle bokeh animations, and fluid transitions.

---

## 🌐 Features & Capabilities

*   **Bilingual Toggle**: Instantly switch between natural Bangla (`তুমি` tone) and English. Preferences are saved via `localStorage` and all UI elements update immediately.
*   **Dual Themes**: Smooth toggling between Light Mode (warm cream and peach tones: `#FFF8F0`, `#FFE8D6`) and Dark Mode (deep navy charcoal with soft glow accents). Theme choice persists via `localStorage`.
*   **Box Breathing Widget**: Interactive home page widget instructing users through an organic 4-stage box breathing cycle (Inhale, Hold, Exhale, Hold) with automated circle scaling and glowing animations.
*   **Diagnostic Self-Check**: Empathetic tick-box list allowing visitors to trace their symptoms with dynamic count responses and a warm medical disclaimer.
*   **Condition Jargon Explainer**: Interactive detail pages for Panic, Anxiety, Sudden Panic Attacks, and Future Fears, replacing complex clinical phrasing with real-life, compassionate anecdotes.
*   **Actionable Tips**: Card-grid accordion containing grounding exercises (5-4-3-2-1), box breathing, the cold water reset trigger, journaling, and local professional helpline details for Bangladesh.
*   **Premium Shop**: Empathetic e-book cards with manual payment flows (bKash/Nagad/Cards) and dynamic billing request validation overlays.
*   **Pre-written Blogs**: 6 fully pre-written articles accessible via responsive search tags and custom route readers (`#/blog/:id`) with related blog links.
*   **Modern Design Details**: Custom cursor glow, hover-triggered pulsing animations, lift-up cards, glassmorphic banners, and mobile-friendly bottom navigation.

---

## 🛠️ Tech Stack & Directory Structure

Built entirely using **Vanilla HTML5**, **CSS3 (Custom Properties)**, and **JavaScript (ES6)**.
*   No bundlers or compile times (zero `npm` bloat, runs natively on any browser).
*   SEO best-practices implemented (proper headings, meta descriptions, unique test IDs).
*   Fast load times and clean inline SVG vector scaling.

```
d:\mon valo\
├── index.html       - SPA markup shell, sections, forms, and modals
├── style.css        - Typography, CSS variables, keyframe animations, responsive formats
├── translations.js  - Dict of all Bangla/English content strings and blog posts
├── app.js           - Routing logic, breathing timers, i18n, theme selectors, checklists, modals
└── README.md        - Platform documentation (this file)
```

---

## 🚀 How to Run Locally

Since this is a client-side static site, no local server installation is required. You can choose either option:

1.  **Direct File Execution**: 
    Simply double-click `index.html` on your desktop/finder to open it in any modern browser.

2.  **Using Dev Server (Optional)**:
    If you wish to serve it over a local address, you can use any simple HTTP static server, e.g.:
    ```bash
    # using Python
    python -m http.server 8000
    
    # using Node.js
    npx serve .
    ```
    Then, navigate to `http://localhost:8000` or the corresponding address.
