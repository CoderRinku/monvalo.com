// app.js - Main Application Logic for monvalo.com

document.addEventListener("DOMContentLoaded", () => {
  // ==========================================================================
  // STATE MANAGEMENT
  // ==========================================================================
  let currentLang = localStorage.getItem("lang") || "bn";
  let currentTheme = localStorage.getItem("theme") || "light";

  // Set initial classes and trigger update
  document.documentElement.classList.toggle("dark", currentTheme === "dark");
  document.body.classList.toggle("bn-active", currentLang === "bn");

  // ==========================================================================
  // CUSTOM CURSOR
  // ==========================================================================
  const cursorOuter = document.querySelector(".custom-cursor");
  const cursorInner = document.querySelector(".custom-cursor-inner");

  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (!isTouchDevice && cursorOuter && cursorInner) {
    cursorOuter.style.display = "block";
    cursorInner.style.display = "block";

    document.addEventListener("mousemove", (e) => {
      cursorOuter.style.left = `${e.clientX}px`;
      cursorOuter.style.top = `${e.clientY}px`;
      cursorInner.style.left = `${e.clientX}px`;
      cursorInner.style.top = `${e.clientY}px`;
    });

    // Cursor hover animations
    const hoverElements = document.querySelectorAll("a, button, .clickable, .checkbox-label, .blog-card, .shop-card, .tip-card");
    hoverElements.forEach((elem) => {
      elem.addEventListener("mouseenter", () => {
        cursorOuter.style.width = "40px";
        cursorOuter.style.height = "40px";
        cursorOuter.style.borderColor = "var(--color-primary)";
        cursorOuter.style.backgroundColor = "var(--glow-color)";
      });
      elem.addEventListener("mouseleave", () => {
        cursorOuter.style.width = "20px";
        cursorOuter.style.height = "20px";
        cursorOuter.style.borderColor = "var(--color-primary)";
        cursorOuter.style.backgroundColor = "transparent";
      });
    });
  }

  // ==========================================================================
  // THEME MANAGEMENT (Light / Dark)
  // ==========================================================================
  function setTheme(theme) {
    currentTheme = theme;
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
    updateThemeToggleUI();
  }

  function updateThemeToggleUI() {
    const themeToggleButtons = document.querySelectorAll(".btn-toggle-theme");
    themeToggleButtons.forEach((btn) => {
      if (currentTheme === "dark") {
        btn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="18.36" x2="5.64" y2="19.78"></line>
            <line x1="18.36" y1="4.22" x2="19.78" y2="5.64"></line>
          </svg>
          <span data-i18n="themeLight">Light</span>
        `;
      } else {
        btn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
          <span data-i18n="themeDark">Dark</span>
        `;
      }
    });
    // Re-apply translations for theme toggle text
    translatePage();
  }

  // Bind theme buttons
  document.querySelectorAll(".btn-toggle-theme").forEach((btn) => {
    btn.addEventListener("click", () => {
      setTheme(currentTheme === "light" ? "dark" : "light");
    });
  });

  // ==========================================================================
  // TRANSLATION SYSTEM
  // ==========================================================================
  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("lang", lang);
    document.body.classList.toggle("bn-active", lang === "bn");
    
    // Update language toggle buttons text/visual
    const langToggleButtons = document.querySelectorAll(".btn-toggle-lang");
    langToggleButtons.forEach((btn) => {
      btn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
        <span>${translations[lang].toggleLanguage}</span>
      `;
    });

    translatePage();
    renderBlogGrid(); // Render blogs in the target language
    renderShopGrid(); // Render shop items in the target language
    updateChecklistResult(); // Refresh checklist feedback
  }

  function translatePage() {
    const trans = translations[currentLang];
    
    // Find all elements with data-i18n
    document.querySelectorAll("[data-i18n]").forEach((elem) => {
      const key = elem.getAttribute("data-i18n");
      if (trans[key] !== undefined) {
        elem.innerHTML = trans[key];
      }
    });

    // Translate Placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach((elem) => {
      const key = elem.getAttribute("data-i18n-placeholder");
      if (trans[key] !== undefined) {
        elem.setAttribute("placeholder", trans[key]);
      }
    });
  }

  // Bind language buttons
  document.querySelectorAll(".btn-toggle-lang").forEach((btn) => {
    btn.addEventListener("click", () => {
      setLanguage(currentLang === "bn" ? "en" : "bn");
    });
  });

  // ==========================================================================
  // BREATHING WIDGET TIMER
  // ==========================================================================
  const breathingOuter = document.querySelector(".breathing-circle-outer");
  const breathingStatus = document.querySelector(".breathing-status-text");
  
  if (breathingOuter && breathingStatus) {
    let breatheCounter = 0;
    
    const updateBreathingCycle = () => {
      const phase = breatheCounter % 16;
      const trans = translations[currentLang];

      if (phase >= 0 && phase < 4) {
        // Inhale: 4 seconds
        // Scale increases from 0.7 to 1.15
        breathingOuter.style.transition = "transform 4s ease-in-out, box-shadow 4s ease-in-out";
        breathingOuter.style.transform = "scale(1.15)";
        breathingOuter.style.backgroundColor = "var(--bg-secondary)";
        breathingOuter.style.boxShadow = "0 0 40px 15px var(--glow-color)";
        breathingStatus.innerHTML = trans.breatheStateInhale;
      } 
      else if (phase >= 4 && phase < 8) {
        // Hold full: 4 seconds
        // Scale stays at 1.15
        breathingOuter.style.transition = "none";
        breathingOuter.style.transform = "scale(1.15)";
        breathingOuter.style.backgroundColor = "var(--bg-secondary)";
        breathingOuter.style.boxShadow = "0 0 40px 15px var(--glow-color)";
        breathingStatus.innerHTML = trans.breatheStateHold;
      } 
      else if (phase >= 8 && phase < 12) {
        // Exhale: 4 seconds
        // Scale decreases from 1.15 to 0.7
        breathingOuter.style.transition = "transform 4s ease-in-out, box-shadow 4s ease-in-out";
        breathingOuter.style.transform = "scale(0.7)";
        breathingOuter.style.backgroundColor = "var(--bg-card)";
        breathingOuter.style.boxShadow = "0 0 15px 0px var(--glow-color)";
        breathingStatus.innerHTML = trans.breatheStateExhale;
      } 
      else if (phase >= 12 && phase < 16) {
        // Hold empty: 4 seconds
        // Scale stays at 0.7
        breathingOuter.style.transition = "none";
        breathingOuter.style.transform = "scale(0.7)";
        breathingOuter.style.backgroundColor = "var(--bg-card)";
        breathingOuter.style.boxShadow = "0 0 15px 0px var(--glow-color)";
        breathingStatus.innerHTML = trans.breatheStateRest;
      }
      
      breatheCounter++;
    };

    // Run immediately and then set interval
    updateBreathingCycle();
    setInterval(updateBreathingCycle, 1000);
  }

  // ==========================================================================
  // ROTATION & NAVIGATION (Hash-based Routing)
  // ==========================================================================
  const navLinks = document.querySelectorAll(".nav-links a, .mobile-nav-item");
  const sections = document.querySelectorAll(".page-section");
  const blogReaderView = document.getElementById("blog-reader");

  function router() {
    const rawHash = window.location.hash || "#/";
    
    // Reset blog reader view by default
    if (blogReaderView) {
      blogReaderView.classList.remove("active");
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Handle subpage routing (e.g., #/blog/1)
    if (rawHash.startsWith("#/blog/")) {
      const postId = parseInt(rawHash.split("#/blog/")[1], 10);
      if (!isNaN(postId)) {
        renderFullBlogArticle(postId);
        return;
      }
    }

    // Normal routing
    sections.forEach((sec) => {
      const id = sec.getAttribute("id");
      const targetHash = `#/${id === "home" ? "" : id}`;
      
      if (rawHash === targetHash) {
        sec.classList.add("active");
      } else {
        sec.classList.remove("active");
      }
    });

    // Highlight active link
    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (rawHash === href) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  window.addEventListener("hashchange", router);

  // ==========================================================================
  // TIP ACCORDION SYSTEM
  // ==========================================================================
  document.querySelectorAll(".tips-grid").forEach((grid) => {
    grid.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn-expand");
      if (!btn) return;

      const card = btn.closest(".tip-card");
      if (!card) return;

      const isExpanded = card.classList.toggle("expanded");
      const trans = translations[currentLang];

      if (isExpanded) {
        btn.innerHTML = `
          <span>${trans.collapseBtn}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
        `;
      } else {
        btn.innerHTML = `
          <span>${trans.expandBtn}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        `;
      }
    });
  });

  // ==========================================================================
  // SYMPTOM CHECKLIST COUNTER
  // ==========================================================================
  const checklist = document.querySelector(".checklist-container");
  const resultPanel = document.querySelector(".checklist-result-panel");

  if (checklist && resultPanel) {
    checklist.addEventListener("change", updateChecklistResult);
  }

  function updateChecklistResult() {
    if (!checklist || !resultPanel) return;
    
    const checkboxes = checklist.querySelectorAll("input[type='checkbox']");
    let checkedCount = 0;
    checkboxes.forEach((box) => {
      if (box.checked) checkedCount++;
    });

    const trans = translations[currentLang];
    if (checkedCount === 0) {
      resultPanel.innerHTML = trans.checkResultDefault;
      resultPanel.style.backgroundColor = "rgba(181, 131, 141, 0.05)";
      resultPanel.style.borderColor = "var(--border-color)";
    } else if (checkedCount === 1) {
      resultPanel.innerHTML = trans.checkResult1;
      resultPanel.style.backgroundColor = "rgba(131, 197, 190, 0.1)";
      resultPanel.style.borderColor = "var(--color-success)";
    } else if (checkedCount === 2) {
      resultPanel.innerHTML = trans.checkResult2;
      resultPanel.style.backgroundColor = "rgba(131, 197, 190, 0.15)";
      resultPanel.style.borderColor = "var(--color-success)";
    } else {
      resultPanel.innerHTML = trans.checkResult3;
      resultPanel.style.backgroundColor = "rgba(255, 107, 107, 0.08)";
      resultPanel.style.borderColor = "var(--color-primary)";
    }
  }

  // ==========================================================================
  // BLOG POSTS SYSTEM (Filtering & Rendering)
  // ==========================================================================
  const blogContainer = document.querySelector(".blog-grid");
  const categoryTabs = document.querySelectorAll(".category-tab");
  let activeCategory = "all";

  // Category filter click
  categoryTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      categoryTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      activeCategory = tab.getAttribute("data-category");
      renderBlogGrid();
    });
  });

  function renderBlogGrid() {
    if (!blogContainer) return;
    blogContainer.innerHTML = "";

    const trans = translations[currentLang];

    const filtered = blogPosts.filter((post) => {
      return activeCategory === "all" || post.category === activeCategory;
    });

    filtered.forEach((post) => {
      const card = document.createElement("div");
      card.className = "blog-card reveal";
      card.addEventListener("click", () => {
        window.location.hash = `#/blog/${post.id}`;
      });

      // Cover image - use generated files in execution path later
      const coverPath = `assets/blog_${post.id}.jpg`;

      // Fallback check: if images aren't present yet, use styled background color
      card.innerHTML = `
        <div class="blog-card-img">
          <span class="category-tag">${trans["cat" + post.category.charAt(0).toUpperCase() + post.category.slice(1)]}</span>
          <img src="${coverPath}" alt="${post.title[currentLang]}" onerror="this.style.display='none';">
        </div>
        <div class="blog-card-body">
          <div class="blog-card-meta">
            <span>📅 2026</span>
            <span>⏱️ ${trans.readTime} ${post.readTime[currentLang]} ${trans.minutes}</span>
          </div>
          <h3>${post.title[currentLang]}</h3>
          <p>${post.excerpt[currentLang]}</p>
          <span class="read-link">
            <span>${trans.learnMore}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </span>
        </div>
      `;

      blogContainer.appendChild(card);
    });

    // Run trigger observer for new cards
    observeElements();
  }

  function renderFullBlogArticle(postId) {
    const post = blogPosts.find((p) => p.id === postId);
    if (!post || !blogReaderView) return;

    // Hide all normal pages
    sections.forEach((sec) => sec.classList.remove("active"));
    blogReaderView.classList.add("active");

    const trans = translations[currentLang];
    const catName = trans["cat" + post.category.charAt(0).toUpperCase() + post.category.slice(1)];
    const coverPath = `assets/blog_${post.id}.jpg`;

    // Populate Reader View
    blogReaderView.innerHTML = `
      <div class="reader-container">
        <button class="btn-back-blog" onclick="window.location.hash = '#/blog'">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>${trans.backToBlog}</span>
        </button>

        <header class="reader-header">
          <span class="tag-badge">${catName}</span>
          <h1>${post.title[currentLang]}</h1>
          <div class="meta-bar">
            <span>📅 June 2026</span>
            <span>⏱️ ${trans.readTime} ${post.readTime[currentLang]} ${trans.minutes}</span>
          </div>
        </header>

        <article class="reader-article-content">
          ${post.content[currentLang]}
        </article>

        <section class="related-blogs-section">
          <h2>${trans.relatedPosts}</h2>
          <div class="blog-grid" id="related-blogs-grid"></div>
        </section>
      </div>
    `;

    // Render 2 related posts
    const relatedGrid = document.getElementById("related-blogs-grid");
    if (relatedGrid) {
      const related = blogPosts.filter((p) => p.id !== postId).slice(0, 2);
      related.forEach((rel) => {
        const relCard = document.createElement("div");
        relCard.className = "blog-card";
        relCard.addEventListener("click", () => {
          window.location.hash = `#/blog/${rel.id}`;
        });
        const relCat = trans["cat" + rel.category.charAt(0).toUpperCase() + rel.category.slice(1)];
        relCard.innerHTML = `
          <div class="blog-card-img">
            <span class="category-tag">${relCat}</span>
            <img src="assets/blog_${rel.id}.jpg" alt="${rel.title[currentLang]}" onerror="this.style.display='none';">
          </div>
          <div class="blog-card-body">
            <div class="blog-card-meta">
              <span>⏱️ ${rel.readTime[currentLang]} ${trans.minutes}</span>
            </div>
            <h3>${rel.title[currentLang]}</h3>
            <p>${rel.excerpt[currentLang]}</p>
          </div>
        `;
        relatedGrid.appendChild(relCard);
      });
    }

    // Scroll reader view back to top
    window.scrollTo({ top: 0 });
  }

  // ==========================================================================
  // PREMIUM BOOKSHOP SYSTEM
  // ==========================================================================
  const shopContainer = document.querySelector(".shop-grid");
  const checkoutModal = document.getElementById("checkout-modal");
  const orderSuccessModal = document.getElementById("order-success-modal");

  const checkoutForm = document.getElementById("checkout-form");
  let selectedBookId = null;

  function renderShopGrid() {
    if (!shopContainer) return;
    shopContainer.innerHTML = "";

    const trans = translations[currentLang];
    
    // Books list details mapping
    const books = [
      { id: 1, titleKey: "book1Title", descKey: "book1Desc", price: 299 },
      { id: 2, titleKey: "book2Title", descKey: "book2Desc", price: 199 },
      { id: 3, titleKey: "book3Title", descKey: "book3Desc", price: 249 },
      { id: 4, titleKey: "book4Title", descKey: "book4Desc", price: 149 }
    ];

    books.forEach((book) => {
      const card = document.createElement("div");
      card.className = "shop-card reveal";
      
      const coverImg = `assets/book_cover_${book.id}.jpg`;

      card.innerHTML = `
        <div class="book-cover-container">
          <div class="book-cover-mockup">
            <img class="book-cover-img" src="${coverImg}" alt="${trans[book.titleKey]}" onerror="this.outerHTML='<div class=&quot;book-cover-mockup-placeholder&quot; style=&quot;background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-secondary) 100%);&quot;><span class=&quot;logo-small&quot;>monvalo</span><span class=&quot;title-small&quot;>${trans[book.titleKey]}</span><span class=&quot;author-small&quot;>CBT Guide</span></div>';">
          </div>
        </div>
        <div class="shop-card-body">
          <h3>${trans[book.titleKey]}</h3>
          <p>${trans[book.descKey]}</p>
          <div class="shop-card-footer">
            <span class="price-tag">${trans.currency}${book.price}</span>
            <button class="btn-primary btn-buy" data-book-id="${book.id}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <span>${trans.buyNow}</span>
            </button>
          </div>
        </div>
      `;

      shopContainer.appendChild(card);
    });

    // Add click event for buy button
    shopContainer.querySelectorAll(".btn-buy").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        selectedBookId = btn.getAttribute("data-book-id");
        openCheckoutModal();
      });
    });

    observeElements();
  }

  function openCheckoutModal() {
    if (!checkoutModal) return;
    checkoutModal.classList.add("active");
  }

  // Bind close buttons
  document.querySelectorAll(".btn-close-modal").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (checkoutModal) checkoutModal.classList.remove("active");
      if (orderSuccessModal) orderSuccessModal.classList.remove("active");
    });
  });

  // Handle checkout form submit
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const name = document.getElementById("checkout-name").value.trim();
      const email = document.getElementById("checkout-email").value.trim();
      const phone = document.getElementById("checkout-phone").value.trim();

      if (!name || !email || !phone) return;

      // Close checkout modal
      if (checkoutModal) checkoutModal.classList.remove("active");
      checkoutForm.reset();

      // Show success modal
      if (orderSuccessModal) {
        orderSuccessModal.classList.add("active");
      }
    });
  }

  // ==========================================================================
  // CONTACT FORM MOCK SUBMIT
  // ==========================================================================
  const contactForm = document.getElementById("contact-form");
  const contactSuccessModal = document.getElementById("contact-success-modal");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const name = contactForm.querySelector("[type='text']").value.trim();
      const email = contactForm.querySelector("[type='email']").value.trim();
      const msg = contactForm.querySelector("textarea").value.trim();

      if (!name || !email || !msg) return;

      contactForm.reset();

      if (contactSuccessModal) {
        contactSuccessModal.classList.add("active");
      }
    });
  }

  // ==========================================================================
  // SCROLL REVEAL INTERSECTION OBSERVER
  // ==========================================================================
  let observer;

  function observeElements() {
    const elementsToReveal = document.querySelectorAll(".reveal");
    
    if (observer) {
      observer.disconnect();
    }

    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target); // Stop observing once revealed
        }
      });
    }, {
      threshold: 0.15
    });

    elementsToReveal.forEach((el) => observer.observe(el));
  }

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================
  // Initialize Routing
  router();

  // Initialize Language (translates texts and loads items)
  setLanguage(currentLang);
  
  // Set theme UI
  updateThemeToggleUI();

  // Observe elements on load
  observeElements();
});
