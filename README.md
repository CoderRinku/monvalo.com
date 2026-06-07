# 🇧🇩 🇬🇧 monvalo.com — You Are Not Alone

**monvalo.com** is a warm, deeply empathetic, production-ready bilingual (Bangla & English) mental health platform focusing on Panic Disorder, Anxiety Disorder, Unexpected Panic Attacks, and persistent fears. 

Rather than adopting a cold, clinical, or hospital-like aesthetic, the platform is designed to feel like a warm personal journal with organic layouts, soft pastel colors, morphing mesh gradients, subtle bokeh animations, and fluid transitions.

---

## 🌐 Features & Capabilities

*   **Bilingual Toggle**: Instantly switch between natural Bangla (`তুমি` tone) and English. Preferences are saved via `localStorage` and all UI elements update immediately.
*   **Dual Themes**: Smooth toggling between Light Mode (warm cream and peach tones: `#FFF8F0`, `#FFE8D6`) and Dark Mode (deep navy charcoal with soft glow accents). Theme choice persists via `localStorage`.
*   **Let's Breathe Together (Box Breathing)**: Interactive widget instructing users through an organic 4-stage box breathing cycle (Inhale, Hold, Exhale, Hold) with automated circle scaling and glowing animations to help ground them.
*   **🧘‍♀️ 5-4-3-2-1 Grounding Wizard**: An interactive step-by-step walkthrough to ground users during severe anxiety by calling attention to their senses (sight, touch, hearing, smell, taste).
*   **🎨 Zen Drawing Board (Mandala Mode & Rainbow Brush)**:
    *   **8-Way Radial Symmetry**: Replicates user drawn strokes across 8 rotational segments and mirror reflections, making doodles automatically form gorgeous mandala patterns.
    *   **Rainbow HSL Cycling Brush**: Brush stroke colors cycle smoothly through a glowing HSL spectrum.
    *   **Organic Fade**: Lines slowly fade like clouds over 3 seconds to encourage relaxing, ephemeral doodling.
    *   **Control Toggle**: Seamless toggle button between free drawing and symmetrical mandala mode.
*   **🌧️ Ambient Sound Mixer**: Play and mix synthesized high-quality ambient loops (Rain, Ocean waves, and Meditative drones) to create a personalized acoustic safe space.
*   **🔥 Worry Burner**: A safe, therapeutic digital box where users write down their anxieties or anger and watch them burn stagger-by-stagger into digital ashes.
*   **Diagnostic Self-Check**: Empathetic tick-box checklist allowing visitors to trace their symptoms with dynamic count responses and a warm medical disclaimer.
*   **Actionable Tips**: Card-grid accordion containing grounding exercises, cold water reset triggers, journaling ideas, and emergency contact helplines in Bangladesh.
*   **Premium Shop**: Empathetic e-book cards with manual payment flows (bKash/Nagad/Cards) and dynamic billing validations.
*   **Pre-written Blogs**: 6 fully pre-written articles accessible via responsive search tags and custom route readers (`#/blog/:id`).
*   **Modern Design Details**: Custom cursor glow, hover-triggered pulsing animations, lift-up cards, glassmorphic banners, and mobile-friendly bottom navigation.

---

## 🔒 Cybersecurity & Performance Hardening

*   **Content Security Policy (CSP)**: Integrated HTTP-Equiv CSP directives ensuring only local scripts, styling, and Google fonts run, protecting users from cross-site injection vectors.
*   **DOM-based XSS Defense**: The Worry Burner animates letters individually. Any user-submitted HTML elements are safely escaped to standard HTML text entities (`&lt;`, `&gt;`, etc.) to prevent malicious script execution.
*   **Secure Form Sanitization**: All form submissions (Contact & E-book Checkout) strip unsafe tags and validate against strict regular expressions for emails and telephone syntax before handling requests.

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

Since this is a client-side static site, no local server installation is required:

1.  **Direct File Execution**: 
    Simply double-click `index.html` in your directory to open it in any modern browser.

2.  **Using Dev Server (Optional)**:
    If you wish to serve it over a local address, you can run:
    ```bash
    # using Python
    python -m http.server 8000
    
    # using Node.js
    npx serve .
    ```
    Then, navigate to `http://localhost:8000` or the corresponding address.

---

## 🤝 Contact & Collaborations

If you want to build a similar website, customize this platform, or collaborate on similar mental health and web applications, please feel free to reach out:

*   **LinkedIn**: [Roknusjaman Rinku](https://www.linkedin.com/in/roknusjamanrinku/)
*   **Contact/Email**: You can contact directly via the LinkedIn profile or submit a message through the contact form on [monvalo.com](https://coderrinku.github.io/monvalo.com/#/contact).
