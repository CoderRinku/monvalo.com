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

      // Security Validations
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\+?[0-9\s\-()]{6,20}$/;

      if (name.length < 2 || /<[^>]*>/g.test(name)) {
        alert(currentLang === 'bn' ? 'দয়া করে একটি সঠিক নাম লিখুন।' : 'Please enter a valid name.');
        return;
      }
      if (!emailRegex.test(email)) {
        alert(currentLang === 'bn' ? 'দয়া করে একটি সঠিক ইমেল ঠিকানা দিন।' : 'Please enter a valid email address.');
        return;
      }
      if (!phoneRegex.test(phone)) {
        alert(currentLang === 'bn' ? 'দয়া করে একটি সঠিক মোবাইল নম্বর দিন।' : 'Please enter a valid phone number.');
        return;
      }

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

      // Security Validations
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (name.length < 2 || /<[^>]*>/g.test(name)) {
        alert(currentLang === 'bn' ? 'দয়া করে একটি সঠিক নাম লিখুন।' : 'Please enter a valid name.');
        return;
      }
      if (!emailRegex.test(email)) {
        alert(currentLang === 'bn' ? 'দয়া করে একটি সঠিক ইমেল ঠিকানা দিন।' : 'Please enter a valid email address.');
        return;
      }
      if (msg.length < 5 || /<[^>]*>/g.test(msg)) {
        alert(currentLang === 'bn' ? 'দয়া করে একটি বিস্তারিত বার্তা লিখুন।' : 'Please enter a valid message.');
        return;
      }

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
  // TOOL 1: WORRY BALLOON
  // ==========================================================================
  const worryForm = document.getElementById("worry-form");
  const worryInput = document.getElementById("worry-input");
  const worryBalloon = document.getElementById("worry-balloon");
  const worryBalloonText = document.getElementById("worry-balloon-text");
  const worrySuccess = document.getElementById("worry-success-msg");
  const skyPlaceholder = document.getElementById("sky-placeholder-text");

  if (worryForm && worryInput && worryBalloon && worryBalloonText) {
    worryForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const text = worryInput.value.trim();
      if (!text) return;

      // Set balloon text
      worryBalloonText.innerText = text;
      
      // Reset sky and status
      skyPlaceholder.style.display = "none";
      worrySuccess.style.display = "none";

      // Re-initialize balloon start position
      worryBalloon.style.display = "flex";
      worryBalloon.style.bottom = "-120px";
      worryBalloon.style.left = "50%";
      worryBalloon.style.transform = "translateX(-50%) scale(1)";
      worryBalloon.style.opacity = "1";
      worryBalloon.style.transition = "none";

      // Animate floating up
      setTimeout(() => {
        worryBalloon.style.transition = "bottom 5s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 5s ease, transform 5s ease";
        worryBalloon.style.bottom = "220px";
        worryBalloon.style.opacity = "0";
        worryBalloon.style.transform = "translateX(-50%) scale(0.3)";
      }, 100);

      // Clean up after animation finishes
      setTimeout(() => {
        worryBalloon.style.display = "none";
        worrySuccess.style.display = "block";
        skyPlaceholder.style.display = "block";
        worryInput.value = "";
      }, 5100);
    });
  }

  // ==========================================================================
  // TOOL 2: GROUNDING WIZARD
  // ==========================================================================
  const btnGroundStart = document.getElementById("btn-grounding-start");
  const btnGroundRestart = document.getElementById("btn-grounding-restart");
  const groundingScreens = {
    start: document.getElementById("grounding-screen-start"),
    step5: document.getElementById("grounding-screen-step5"),
    step4: document.getElementById("grounding-screen-step4"),
    step3: document.getElementById("grounding-screen-step3"),
    step2: document.getElementById("grounding-screen-step2"),
    step1: document.getElementById("grounding-screen-step1"),
    finish: document.getElementById("grounding-screen-finish")
  };

  function showGroundingScreen(activeKey) {
    Object.keys(groundingScreens).forEach((key) => {
      const screen = groundingScreens[key];
      if (screen) {
        screen.style.display = key === activeKey ? "block" : "none";
      }
    });
  }

  if (btnGroundStart) {
    btnGroundStart.addEventListener("click", () => {
      showGroundingScreen("step5");
    });
  }
  if (btnGroundRestart) {
    btnGroundRestart.addEventListener("click", () => {
      showGroundingScreen("step5");
    });
  }

  document.querySelectorAll(".btn-grounding-next").forEach((btn) => {
    btn.addEventListener("click", () => {
      const nextStep = btn.getAttribute("data-next");
      showGroundingScreen(nextStep);
    });
  });

  // ==========================================================================
  // TOOL 3: MOOD COMFORT CARDS
  // ==========================================================================
  const comfortCardInner = document.getElementById("comfort-card-inner-box");
  const comfortLetterText = document.getElementById("comfort-letter-text");
  const comfortMoodBtns = document.querySelectorAll(".btn-comfort-mood");

  if (comfortCardInner) {
    // Click on envelope flips it
    comfortCardInner.addEventListener("click", () => {
      comfortCardInner.classList.toggle("flipped");
    });
  }

  comfortMoodBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      comfortMoodBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const mood = btn.getAttribute("data-mood");
      const letterKey = "toolComfortLetter" + mood.charAt(0).toUpperCase() + mood.slice(1);
      
      // If card is already flipped to back, flip it back to front first, change text, then let user open it
      if (comfortCardInner && comfortCardInner.classList.contains("flipped")) {
        comfortCardInner.classList.remove("flipped");
        setTimeout(() => {
          if (comfortLetterText) {
            comfortLetterText.innerHTML = translations[currentLang][letterKey];
          }
        }, 300);
      } else {
        if (comfortLetterText) {
          comfortLetterText.innerHTML = translations[currentLang][letterKey];
        }
      }
    });
  });

  // ==========================================================================
  // TOOL 4: MEDITATIVE SOUND MIXER (Web Audio API)
  // ==========================================================================
  let audioCtx = null;
  let mixerPlaying = false;

  // Nodes holders
  let rainSource = null, rainGain = null;
  let oceanSource = null, oceanGain = null, oceanLfo = null;
  let droneOscs = [], droneGain = null;

  const btnMixerToggle = document.getElementById("btn-mixer-toggle");
  const mixerBtnText = document.getElementById("mixer-btn-text");
  const mixerPlayIcon = document.getElementById("mixer-play-icon");

  const sliderRain = document.getElementById("slider-rain");
  const sliderOcean = document.getElementById("slider-ocean");
  const sliderMeditate = document.getElementById("slider-meditate");

  const volRainVal = document.getElementById("vol-rain-val");
  const volOceanVal = document.getElementById("vol-ocean-val");
  const volMeditateVal = document.getElementById("vol-meditate-val");

  // Helper: Create 2s white noise buffer
  function createNoiseBuffer() {
    const bufferSize = audioCtx.sampleRate * 2;
    const buffer = audioCtx.createBuffer(2, bufferSize, audioCtx.sampleRate);
    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const data = buffer.getChannelData(channel);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    }
    return buffer;
  }

  function initAudio() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  function startMixer() {
    if (!audioCtx) initAudio();
    if (audioCtx.state === "suspended") audioCtx.resume();

    // 1. Rain setup
    const noiseBuffer = createNoiseBuffer();
    rainSource = audioCtx.createBufferSource();
    rainSource.buffer = noiseBuffer;
    rainSource.loop = true;

    const rainFilter = audioCtx.createBiquadFilter();
    rainFilter.type = "lowpass";
    rainFilter.frequency.value = 1000; // soft rain cutoff

    rainGain = audioCtx.createGain();
    rainGain.gain.value = (sliderRain ? sliderRain.value : 0) / 100 * 0.15; // Limit max rain volume

    rainSource.connect(rainFilter);
    rainFilter.connect(rainGain);
    rainGain.connect(audioCtx.destination);
    rainSource.start(0);

    // 2. Ocean Waves setup
    oceanSource = audioCtx.createBufferSource();
    oceanSource.buffer = noiseBuffer;
    oceanSource.loop = true;

    const oceanFilter = audioCtx.createBiquadFilter();
    oceanFilter.type = "lowpass";
    oceanFilter.frequency.value = 500; // deep wave rumble

    oceanGain = audioCtx.createGain();
    oceanGain.gain.value = 0.05; // Base gain

    // Wave swell LFO
    oceanLfo = audioCtx.createOscillator();
    oceanLfo.frequency.value = 0.08; // 12 second wave cycles
    
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.value = 0.1; // modulation amplitude

    oceanLfo.connect(lfoGain);
    lfoGain.connect(oceanGain.gain); // Modulate wave volume

    // Master volume scaler for ocean
    const oceanMasterGain = audioCtx.createGain();
    oceanMasterGain.gain.value = (sliderOcean ? sliderOcean.value : 0) / 100 * 1.5;

    oceanSource.connect(oceanFilter);
    oceanFilter.connect(oceanGain);
    oceanGain.connect(oceanMasterGain);
    oceanMasterGain.connect(audioCtx.destination);

    oceanLfo.start(0);
    oceanSource.start(0);

    // Keep reference to update later
    oceanGain.masterNode = oceanMasterGain;

    // 3. Meditative Drone setup (Sine wave perfect chord: 110Hz, 165Hz, 220Hz)
    droneGain = audioCtx.createGain();
    droneGain.gain.value = (sliderMeditate ? sliderMeditate.value : 0) / 100 * 0.25;

    const frequencies = [110, 165, 220];
    droneOscs = frequencies.map((freq) => {
      const osc = audioCtx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;

      const oscGain = audioCtx.createGain();
      oscGain.gain.value = 0.15;

      osc.connect(oscGain);
      oscGain.connect(droneGain);
      osc.start(0);
      return osc;
    });

    // Slow lowpass to make it warmer
    const droneFilter = audioCtx.createBiquadFilter();
    droneFilter.type = "lowpass";
    droneFilter.frequency.value = 350;

    droneGain.connect(droneFilter);
    droneFilter.connect(audioCtx.destination);
  }

  function stopMixer() {
    if (rainSource) {
      try { rainSource.stop(); } catch(e){}
      rainSource.disconnect();
    }
    if (oceanSource) {
      try { oceanSource.stop(); } catch(e){}
      oceanSource.disconnect();
    }
    if (oceanLfo) {
      try { oceanLfo.stop(); } catch(e){}
      oceanLfo.disconnect();
    }
    droneOscs.forEach((osc) => {
      try { osc.stop(); } catch(e){}
      osc.disconnect();
    });
    droneOscs = [];
    if (audioCtx) {
      audioCtx.suspend();
    }
  }

  if (btnMixerToggle) {
    btnMixerToggle.addEventListener("click", () => {
      if (!mixerPlaying) {
        startMixer();
        mixerPlaying = true;
        mixerBtnText.innerText = currentLang === "bn" ? "সুর বন্ধ করো" : "Stop Mixer";
        if (mixerPlayIcon) {
          mixerPlayIcon.innerHTML = `<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>`;
        }
      } else {
        stopMixer();
        mixerPlaying = false;
        mixerBtnText.innerText = currentLang === "bn" ? "সুর বাজাও" : "Play Mixer";
        if (mixerPlayIcon) {
          mixerPlayIcon.innerHTML = `<polygon points="5 3 19 12 5 21 5 3"></polygon>`;
        }
      }
    });
  }

  // Sliders binding
  if (sliderRain) {
    sliderRain.addEventListener("input", () => {
      const val = sliderRain.value;
      if (volRainVal) volRainVal.innerText = `${val}%`;
      if (rainGain && audioCtx) {
        rainGain.gain.linearRampToValueAtTime(val / 100 * 0.15, audioCtx.currentTime + 0.1);
      }
    });
  }

  // Ocean slider
  if (sliderOcean) {
    sliderOcean.addEventListener("input", () => {
      const val = sliderOcean.value;
      if (volOceanVal) volOceanVal.innerText = `${val}%`;
      if (oceanGain && oceanGain.masterNode && audioCtx) {
        oceanGain.masterNode.gain.linearRampToValueAtTime(val / 100 * 1.5, audioCtx.currentTime + 0.1);
      }
    });
  }

  // Meditate slider
  if (sliderMeditate) {
    sliderMeditate.addEventListener("input", () => {
      const val = sliderMeditate.value;
      if (volMeditateVal) volMeditateVal.innerText = `${val}%`;
      if (droneGain && audioCtx) {
        droneGain.gain.linearRampToValueAtTime(val / 100 * 0.25, audioCtx.currentTime + 0.1);
      }
    });
  }
  // ==========================================================================
  // TOOL 5: EMERGENCY SOS PANIC OVERLAY
  // ==========================================================================
  const sosTrigger = document.getElementById("btn-sos-trigger");
  const sosOverlay = document.getElementById("emergency-sos-overlay");
  const sosClose = document.getElementById("btn-sos-close");
  const btnSosFinish = document.getElementById("btn-sos-finish");
  
  const sosSteps = [
    document.getElementById("sos-step-1"),
    document.getElementById("sos-step-2"),
    document.getElementById("sos-step-3")
  ];
  
  let sosBreatheInterval = null;
  let sosBreatheCounter = 0;

  function showSosStep(stepNum) {
    sosSteps.forEach((step, idx) => {
      if (step) {
        step.style.display = (idx + 1) === stepNum ? "block" : "none";
      }
    });

    // Handle breathing guide on step 3
    if (stepNum === 3) {
      startSosBreathing();
    } else {
      stopSosBreathing();
    }
  }

  function openSosOverlay() {
    if (sosOverlay) {
      sosOverlay.style.display = "flex";
      showSosStep(1);
    }
  }

  function closeSosOverlay() {
    if (sosOverlay) {
      sosOverlay.style.display = "none";
      stopSosBreathing();
    }
  }

  function startSosBreathing() {
    stopSosBreathing();
    const circle = document.getElementById("sos-breathe-circle");
    const status = document.getElementById("sos-breathe-status");
    if (!circle || !status) return;

    sosBreatheCounter = 0;

    const updateSosBreathing = () => {
      const phase = sosBreatheCounter % 16;
      const trans = translations[currentLang];
      
      // Clean up previous classes
      circle.className = "sos-breathing-circle";

      if (phase >= 0 && phase < 4) {
        circle.classList.add("inhale");
        status.innerText = trans.breatheStateInhale || "Inhale";
      } else if (phase >= 4 && phase < 8) {
        circle.classList.add("hold");
        status.innerText = trans.breatheStateHold || "Hold";
      } else if (phase >= 8 && phase < 12) {
        circle.classList.add("exhale");
        status.innerText = trans.breatheStateExhale || "Exhale";
      } else {
        circle.classList.add("rest");
        status.innerText = trans.breatheStateRest || "Rest";
      }
      sosBreatheCounter++;
    };

    updateSosBreathing();
    sosBreatheInterval = setInterval(updateSosBreathing, 1000);
  }

  function stopSosBreathing() {
    if (sosBreatheInterval) {
      clearInterval(sosBreatheInterval);
      sosBreatheInterval = null;
    }
  }

  if (sosTrigger) sosTrigger.addEventListener("click", openSosOverlay);
  if (sosClose) sosClose.addEventListener("click", closeSosOverlay);
  if (btnSosFinish) btnSosFinish.addEventListener("click", closeSosOverlay);

  // Bind Next / Prev buttons
  document.querySelectorAll(".btn-sos-next").forEach((btn) => {
    btn.addEventListener("click", () => {
      const nextStep = parseInt(btn.getAttribute("data-next"), 10);
      showSosStep(nextStep);
    });
  });

  document.querySelectorAll(".btn-sos-prev").forEach((btn) => {
    btn.addEventListener("click", () => {
      const prevStep = parseInt(btn.getAttribute("data-prev"), 10);
      showSosStep(prevStep);
    });
  });

  // ==========================================================================
  // TOOL 6: ZEN DRAWING BOARD (Zen Canvas)
  // ==========================================================================
  const canvas = document.getElementById("zen-canvas");
  const ctx = canvas ? canvas.getContext("2d") : null;
  const btnClearCanvas = document.getElementById("btn-clear-canvas");
  
  let drawing = false;
  let lastX = 0;
  let lastY = 0;

  if (canvas && ctx) {
    // Resize canvas to parent width
    function resizeCanvas() {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height || 320;
      // Re-apply drawing styles after resize
      setupCanvasStyles();
    }

    function setupCanvasStyles() {
      const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() || '#FF6B6B';
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowBlur = 10;
      ctx.shadowColor = primaryColor;
    }

    // Set canvas dimensions
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Fade loop
    function fadeLoop() {
      // Fetch background color based on active theme
      const computedBg = getComputedStyle(canvas.parentElement).backgroundColor;
      let fadeStyle = "rgba(254, 232, 214, 0.03)"; // default light mode
      if (computedBg) {
        if (computedBg.startsWith("rgb")) {
          const rgbValues = computedBg.match(/\d+/g);
          if (rgbValues && rgbValues.length >= 3) {
            fadeStyle = `rgba(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]}, 0.035)`;
          }
        }
      }

      ctx.fillStyle = fadeStyle;
      // Disable shadow blur for the fade rect to avoid glowing edges
      const prevShadowBlur = ctx.shadowBlur;
      ctx.shadowBlur = 0;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.shadowBlur = prevShadowBlur;

      requestAnimationFrame(fadeLoop);
    }
    
    // Start the fade loop
    requestAnimationFrame(fadeLoop);

    // Drawing helper
    function getCoords(e) {
      const rect = canvas.getBoundingClientRect();
      if (e.touches && e.touches.length > 0) {
        return {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top
        };
      } else {
        return {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        };
      }
    }

    function startDrawing(e) {
      drawing = true;
      const coords = getCoords(e);
      lastX = coords.x;
      lastY = coords.y;
      
      // Update primary color in case theme changed
      setupCanvasStyles();
    }

    function draw(e) {
      if (!drawing) return;
      e.preventDefault(); // prevent scrolling while drawing

      const coords = getCoords(e);
      
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();

      lastX = coords.x;
      lastY = coords.y;
    }

    function stopDrawing() {
      drawing = false;
    }

    // Mouse Listeners
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);

    // Touch Listeners
    canvas.addEventListener("touchstart", startDrawing, { passive: false });
    canvas.addEventListener("touchmove", draw, { passive: false });
    canvas.addEventListener("touchend", stopDrawing);

    // Clear Canvas
    if (btnClearCanvas) {
      btnClearCanvas.addEventListener("click", () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      });
    }
  }

  // ==========================================================================
  // TOOL 7: WORRY BURNER
  // ==========================================================================
  const burnInput = document.getElementById("worry-burn-input");
  const burnBtn = document.getElementById("btn-worry-burn");
  const burnOverlay = document.getElementById("worry-burn-overlay");
  const burnWrapper = document.getElementById("burner-wrapper");
  const burnSuccess = document.getElementById("burn-success-msg");

  if (burnInput && burnBtn && burnOverlay && burnWrapper) {
    burnBtn.addEventListener("click", () => {
      const text = burnInput.value.trim();
      if (!text) return;

      // Disable inputs
      burnInput.disabled = true;
      burnBtn.disabled = true;
      burnSuccess.style.display = "none";
      burnWrapper.classList.add("burning");

      // Generate HTML with characters for burning
      let html = "";
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === "\n") {
          html += "<br>";
        } else if (char === " ") {
          html += '<span class="ash-char">&nbsp;</span>';
        } else {
          let escapedChar = char;
          if (char === '<') escapedChar = '&lt;';
          else if (char === '>') escapedChar = '&gt;';
          else if (char === '&') escapedChar = '&amp;';
          else if (char === '"') escapedChar = '&quot;';
          else if (char === "'") escapedChar = '&#x27;';
          else if (char === '/') escapedChar = '&#x2F;';
          html += `<span class="ash-char">${escapedChar}</span>`;
        }
      }

      burnOverlay.innerHTML = html;
      burnOverlay.style.display = "block";
      
      // Hide the textarea input visually
      burnInput.style.opacity = "0";

      // Trigger staggered burn animation
      const spans = burnOverlay.querySelectorAll(".ash-char");
      spans.forEach((span, idx) => {
        const delay = Math.min(idx * 12, 1000); // Max 1s stagger
        span.style.animationDelay = `${delay}ms`;
        span.classList.add("burn");
      });

      // Cleanup and reset after animation completes
      setTimeout(() => {
        burnOverlay.style.display = "none";
        burnOverlay.innerHTML = "";

        burnInput.value = "";
        burnInput.style.opacity = "1";
        burnInput.disabled = false;
        
        burnBtn.disabled = false;
        burnWrapper.classList.remove("burning");

        if (burnSuccess) {
          burnSuccess.style.display = "block";
          setTimeout(() => {
            burnSuccess.style.display = "none";
          }, 5000);
        }
      }, 3500); // 2.5s animation duration + 1s max stagger delay
    });
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
