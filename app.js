(() => {
  "use strict";

  const body = document.body;
  const header = document.querySelector("[data-header]");
  const menu = document.querySelector("[data-mobile-menu]");
  const openButton = document.querySelector("[data-menu-toggle]");
  const closeButton = document.querySelector("[data-menu-close]");
  const desktopDropdowns = [
    ...document.querySelectorAll(".nav__item--dropdown"),
  ];

  const setMenuState = (open) => {
    if (!menu || !openButton) return;

    menu.classList.toggle("is-open", open);
    openButton.classList.toggle("is-active", open);
    openButton.setAttribute("aria-expanded", String(open));
    openButton.setAttribute(
      "aria-label",
      open ? "Zavřít menu" : "Otevřít menu",
    );
    menu.setAttribute("aria-hidden", String(!open));
    body.classList.toggle("menu-open", open);

    if (open) {
      requestAnimationFrame(() => closeButton?.focus({ preventScroll: true }));
    } else {
      openButton.focus({ preventScroll: true });
    }
  };

  openButton?.addEventListener("click", () => {
    setMenuState(!menu.classList.contains("is-open"));
  });

  closeButton?.addEventListener("click", () => setMenuState(false));

  menu?.addEventListener("click", (event) => {
    const link = event.target.closest("a");

    if (link) {
      setMenuState(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (menu?.classList.contains("is-open")) {
        setMenuState(false);
      }

      desktopDropdowns.forEach((item) => closeDropdown(item));
    }
  });

  const closeDropdown = (item) => {
    item.classList.remove("is-open");

    item
      .querySelector("button[aria-expanded]")
      ?.setAttribute("aria-expanded", "false");
  };

  desktopDropdowns.forEach((item) => {
    const trigger = item.querySelector("button[aria-expanded]");

    if (!trigger) return;

    trigger.addEventListener("click", (event) => {
      event.stopPropagation();

      const willOpen = !item.classList.contains("is-open");

      desktopDropdowns.forEach((other) => {
        closeDropdown(other);
      });

      item.classList.toggle("is-open", willOpen);
      trigger.setAttribute("aria-expanded", String(willOpen));
    });
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".nav__item--dropdown")) {
      desktopDropdowns.forEach((item) => {
        closeDropdown(item);
      });
    }
  });

  const syncHeader = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 8);
  };

  syncHeader();

  window.addEventListener("scroll", syncHeader, {
    passive: true,
  });

  const desktopQuery = window.matchMedia("(min-width: 981px)");

  desktopQuery.addEventListener("change", (event) => {
    if (event.matches && menu?.classList.contains("is-open")) {
      setMenuState(false);
    }
  });
})();
/* =========================================
   HERO LIVE BUBBLES
   ========================================= */

const heroBubbles = document.querySelector("[data-hero-bubbles]");

if (heroBubbles) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  let bubbleTimer = null;

  const createHeroBubble = () => {
    if (reducedMotion.matches) return;

    const bubble = document.createElement("span");
    bubble.className = "hero-bubble";

    /*
     * Переважно маленькі/середні,
     * іноді велика WOW-бульбашка.
     */
    const random = Math.random();

    let size;

    if (random > 0.88) {
      size = 95 + Math.random() * 65;
      bubble.classList.add("is-large");
    } else if (random < 0.3) {
      size = 10 + Math.random() * 22;
      bubble.classList.add("is-small");
    } else {
      size = 28 + Math.random() * 62;
    }

    /*
     * Бульбашки стартують переважно
     * з нижньої половини HERO.
     */
    const startY =
      10 + Math.random() * Math.max(heroBubbles.offsetHeight * 0.58, 200);

    /*
     * 3.5–7 секунд:
     * значно динамічніше за попередню анімацію.
     */
    const duration = 3.5 + Math.random() * 3.5;

    /*
     * Вліво проходять значну частину hero.
     */
    const drift = heroBubbles.offsetWidth * (0.55 + Math.random() * 0.5);

    /*
     * Паралельно піднімаються вгору.
     */
    const rise = 70 + Math.random() * 240;

    bubble.style.setProperty("--bubble-size", `${size}px`);

    bubble.style.setProperty("--bubble-y", `${startY}px`);

    bubble.style.setProperty("--bubble-duration", `${duration}s`);

    bubble.style.setProperty("--bubble-drift", `${-drift}px`);

    bubble.style.setProperty("--bubble-rise", `${-rise}px`);

    heroBubbles.appendChild(bubble);

    bubble.addEventListener("animationend", () => bubble.remove(), {
      once: true,
    });
  };

  const bubbleLoop = () => {
    createHeroBubble();

    /*
     * Нова bubble приблизно кожні
     * 170–420 ms.
     */
    const nextBubble = 170 + Math.random() * 250;

    bubbleTimer = window.setTimeout(bubbleLoop, nextBubble);
  };

  /*
   * Перший burst одразу після завантаження,
   * щоб HERO не був порожній перші секунди.
   */
  const initialBurst = () => {
    for (let i = 0; i < 12; i++) {
      window.setTimeout(createHeroBubble, i * 75);
    }
  };

  if (!reducedMotion.matches) {
    initialBurst();
    bubbleLoop();
  }

  reducedMotion.addEventListener("change", (event) => {
    if (event.matches) {
      clearTimeout(bubbleTimer);
      heroBubbles.innerHTML = "";
    } else {
      initialBurst();
      bubbleLoop();
    }
  });
}

/* =========================================
   SECTION REVEAL
   reusable for next sections
   ========================================= */

const revealSections = document.querySelectorAll("[data-reveal-section]");

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

revealSections.forEach((section) => {
  if (reducedMotion.matches) {
    section.classList.add("is-visible");
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");

        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.17,

      rootMargin: "0px 0px -8% 0px",
    },
  );

  observer.observe(section);
});

/* =========================================
   LIVE SECTION BUBBLES
   reusable
   ========================================= */

const bubbleSections = document.querySelectorAll("[data-section-bubbles]");

bubbleSections.forEach((layer) => {
  let bubbleTimer = null;

  const createBubble = () => {
    if (reducedMotion.matches) {
      return;
    }

    const bubble = document.createElement("span");

    bubble.className = "section-bubble";

    /* size */

    const random = Math.random();

    let size;

    if (random > 0.9) {
      size = 115 + Math.random() * 75;
    } else if (random < 0.28) {
      size = 16 + Math.random() * 25;
    } else {
      size = 35 + Math.random() * 65;
    }

    /* horizontal position */

    const x = Math.random() * 100;

    /* speed */

    const duration = 7 + Math.random() * 6;

    /* side movement */

    const drift = -110 + Math.random() * 220;

    bubble.style.setProperty("--bubble-size", `${size}px`);

    bubble.style.setProperty("--bubble-x", `${x}%`);

    bubble.style.setProperty("--bubble-duration", `${duration}s`);

    bubble.style.setProperty("--bubble-drift", `${drift}px`);

    layer.appendChild(bubble);

    bubble.addEventListener(
      "animationend",
      () => {
        bubble.remove();
      },
      {
        once: true,
      },
    );
  };

  const bubbleLoop = () => {
    createBubble();

    const nextBubble = 450 + Math.random() * 800;

    bubbleTimer = window.setTimeout(bubbleLoop, nextBubble);
  };

  const initialBurst = () => {
    for (let i = 0; i < 6; i++) {
      window.setTimeout(createBubble, i * 180);
    }
  };

  if (!reducedMotion.matches) {
    initialBurst();

    bubbleLoop();
  }

  reducedMotion.addEventListener("change", (event) => {
    clearTimeout(bubbleTimer);

    layer.innerHTML = "";

    if (!event.matches) {
      initialBurst();

      bubbleLoop();
    }
  });
});

/* =========================================
   SERVICE CARDS — MAGNETIC HOVER
   ========================================= */

const serviceCards = document.querySelectorAll("[data-service-card]");

const serviceHoverQuery = window.matchMedia(
  "(hover: hover) and (pointer: fine)",
);

if (serviceHoverQuery.matches) {
  serviceCards.forEach((card) => {
    const image = card.querySelector(".service-card__image");

    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();

      const x = event.clientX - rect.left;

      const y = event.clientY - rect.top;

      const xPercent = x / rect.width - 0.5;

      const yPercent = y / rect.height - 0.5;

      card.style.setProperty("--mouse-x", `${xPercent * 8}px`);

      card.style.setProperty("--mouse-y", `${yPercent * 8}px`);

      if (image) {
        image.style.transform = `
              scale(1.11)
              translate3d(
                ${xPercent * -10}px,
                ${yPercent * -10}px,
                0
              )
            `;
      }
    });

    card.addEventListener("mouseleave", () => {
      if (image) {
        image.style.transform = "";
      }
    });
  });
}

/* =========================================
   CONTACT FORM — SERVICE CONTEXT
   ========================================= */

document.querySelectorAll("[data-service-input]").forEach((input) => {
  const service =
    document.body.dataset.service || document.title || window.location.pathname;

  input.value = service;
});

const footerRevealItems = document.querySelectorAll(".footer .reveal");

const footerObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.15,
  },
);

footerRevealItems.forEach((item) => {
  footerObserver.observe(item);
});

/* =========================================================
   DAVAMA — GENERÁLNÍ ÚKLID
   Page specific interactions
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initServiceHero();
  initServiceImageTilt();
  initPriceCounter();
  initServiceSmoothScroll();
});

/* =========================================================
   01. SERVICE HERO
   entrance animation
   ========================================================= */

function initServiceHero() {
  const hero = document.querySelector(".service-hero");

  if (!hero) return;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      hero.classList.add("is-loaded");
    });
  });
}

/* =========================================================
   02. HERO IMAGE — SUBTLE 3D TILT
   desktop only
   ========================================================= */

function initServiceImageTilt() {
  const media = document.querySelector(".service-hero__media");
  const image = document.querySelector(".service-hero__image");

  if (!media || !image) return;

  const canHover = window.matchMedia(
    "(hover: hover) and (pointer: fine)",
  ).matches;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (!canHover || reducedMotion) return;

  let frame = null;

  media.addEventListener("mousemove", (event) => {
    const rect = media.getBoundingClientRect();

    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((mouseX - centerX) / centerX) * 1.8;

    const rotateX = ((centerY - mouseY) / centerY) * 1.4;

    if (frame) {
      cancelAnimationFrame(frame);
    }

    frame = requestAnimationFrame(() => {
      image.style.transform = `
        scale(1.045)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
      `;
    });
  });

  media.addEventListener("mouseleave", () => {
    if (frame) {
      cancelAnimationFrame(frame);
    }

    frame = requestAnimationFrame(() => {
      image.style.transform = `
        scale(1)
        rotateX(0deg)
        rotateY(0deg)
      `;
    });
  });
}

/* =========================================================
   03. PRICE COUNTER
   0 → 350
   ========================================================= */

function initPriceCounter() {
  const counter = document.querySelector("[data-price-counter]");

  if (!counter) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const target = Number(counter.dataset.priceCounter) || 350;

  if (reducedMotion) {
    counter.textContent = target;
    return;
  }

  let hasAnimated = false;

  const observer = new IntersectionObserver(
    (entries, observerInstance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || hasAnimated) return;

        hasAnimated = true;

        animateNumber(counter, target);

        observerInstance.unobserve(entry.target);
      });
    },
    {
      threshold: 0.45,
    },
  );

  observer.observe(counter);
}

/* =========================================================
   NUMBER ANIMATION
   ========================================================= */

function animateNumber(element, target) {
  const duration = 1200;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;

    const progress = Math.min(elapsed / duration, 1);

    const eased = 1 - Math.pow(1 - progress, 3);

    const currentValue = Math.round(target * eased);

    element.textContent = currentValue.toLocaleString("cs-CZ");

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target.toLocaleString("cs-CZ");
    }
  }

  requestAnimationFrame(update);
}

/* =========================================================
   04. SMOOTH SCROLL TO SERVICE FORM
   ========================================================= */

function initServiceSmoothScroll() {
  const buttons = document.querySelectorAll('[href="#poptavka"]');

  const formSection = document.querySelector("#poptavka");

  if (!buttons.length || !formSection) return;

  buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();

      const header = document.querySelector(".site-header");

      const headerHeight = header?.offsetHeight || 0;

      const sectionTop =
        formSection.getBoundingClientRect().top + window.scrollY;

      const offset = 28;

      window.scrollTo({
        top: sectionTop - headerHeight - offset,

        behavior: "smooth",
      });
    });
  });
}

/* =========================================================
   05. SERVICE CARDS — MOUSE POSITION
   subtle interactive highlight
   ========================================================= */

function initServiceCardsGlow() {
  const cards = document.querySelectorAll(".service-detail-card");

  const canHover = window.matchMedia(
    "(hover: hover) and (pointer: fine)",
  ).matches;

  if (!canHover) return;

  cards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();

      const x = event.clientX - rect.left;

      const y = event.clientY - rect.top;

      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });
}

initServiceCardsGlow();

/* =========================================================
   06. PARALLAX DECORATIVE ELEMENTS
   ========================================================= */

function initServiceParallax() {
  const elements = document.querySelectorAll("[data-service-parallax]");

  if (!elements.length) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (reducedMotion) return;

  let ticking = false;

  function updateParallax() {
    const viewportHeight = window.innerHeight;

    elements.forEach((element) => {
      const rect = element.getBoundingClientRect();

      if (rect.bottom < 0 || rect.top > viewportHeight) {
        return;
      }

      const center = rect.top + rect.height / 2;

      const distance = center - viewportHeight / 2;

      const speed = Number(element.dataset.serviceParallax) || 0.06;

      const movement = distance * speed;

      element.style.transform = `translate3d(0, ${movement}px, 0)`;
    });

    ticking = false;
  }

  function onScroll() {
    if (ticking) return;

    ticking = true;

    requestAnimationFrame(updateParallax);
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  window.addEventListener("resize", onScroll);

  updateParallax();
}

initServiceParallax();

/* =========================================================
   07. SERVICE LIST STAGGER
   ========================================================= */

function initServiceListReveal() {
  const lists = document.querySelectorAll("[data-service-list]");

  if (!lists.length) return;

  const observer = new IntersectionObserver(
    (entries, observerInstance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");

        observerInstance.unobserve(entry.target);
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -8% 0px",
    },
  );

  lists.forEach((list) => {
    observer.observe(list);
  });
}

initServiceListReveal();

/* =========================================================
   08. ACTIVE SERVICE FORM CONTEXT
   ========================================================= */

function initServiceFormContext() {
  const form = document.querySelector(".contact-form");

  if (!form) return;

  const service = form.dataset.service || "Generální úklid";

  const hiddenServiceInput = form.querySelector("[data-service-input]");

  if (hiddenServiceInput) {
    hiddenServiceInput.value = service;
  }
}

initServiceFormContext();

/* =========================================================
   DAVAMA FORM → TELEGRAM
========================================================= */

function initTelegramForm() {
  const form = document.querySelector("#contact-form");

  if (!form) return;

  /* =======================================================
     TELEGRAM SETTINGS
  ======================================================= */

  const BOT_TOKEN = "SEM_VLOZ_SVUJ_BOT_TOKEN";

  const CHAT_ID = "SEM_VLOZ_CHAT_ID";

  const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  /* =======================================================
     ELEMENTS
  ======================================================= */

  const submitButton = form.querySelector(".contact-form__submit");

  const submitText = submitButton?.querySelector("span:first-child");

  let isSending = false;

  /* =======================================================
     ESCAPE HTML
  ======================================================= */

  function escapeHTML(value = "") {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  /* =======================================================
     BUTTON — LOADING
  ======================================================= */

  function setLoading() {
    if (!submitButton) return;

    submitButton.disabled = true;

    submitButton.classList.add("is-loading");

    if (submitText) {
      submitText.textContent = "Odesíláme...";
    }
  }

  /* =======================================================
     BUTTON — SUCCESS
  ======================================================= */

  function setSuccess() {
    if (!submitButton) return;

    submitButton.classList.remove("is-loading");

    submitButton.classList.add("is-success");

    if (submitText) {
      submitText.textContent = "Odesláno ✓";
    }

    setTimeout(() => {
      submitButton.disabled = false;

      submitButton.classList.remove("is-success");

      if (submitText) {
        submitText.textContent = "Odeslat poptávku";
      }
    }, 4000);
  }

  /* =======================================================
     BUTTON — ERROR
  ======================================================= */

  function setError() {
    if (!submitButton) return;

    submitButton.classList.remove("is-loading");

    submitButton.classList.add("is-error");

    if (submitText) {
      submitText.textContent = "Chyba. Zkuste znovu.";
    }

    setTimeout(() => {
      submitButton.disabled = false;

      submitButton.classList.remove("is-error");

      if (submitText) {
        submitText.textContent = "Odeslat poptávku";
      }
    }, 4000);
  }

  /* =======================================================
     FORM SUBMIT
  ======================================================= */

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (isSending) return;

    /* browser validation */

    if (!form.checkValidity()) {
      form.reportValidity();

      return;
    }

    const formData = new FormData(form);

    const name = String(formData.get("name") || "").trim();

    const phone = String(formData.get("phone") || "").trim();

    const address = String(formData.get("address") || "").trim();

    const message = String(formData.get("message") || "").trim();

    /* ===================================================
         DATE / TIME
      =================================================== */

    const now = new Intl.DateTimeFormat("cs-CZ", {
      dateStyle: "medium",

      timeStyle: "short",

      timeZone: "Europe/Prague",
    }).format(new Date());

    /* ===================================================
         TELEGRAM MESSAGE
      =================================================== */

    const telegramMessage = `
🟢 <b>NOVÁ POPTÁVKA Z WEBU</b>

━━━━━━━━━━━━━━━━━━━━

👤 <b>Jméno</b>
${escapeHTML(name)}

📞 <b>Telefon</b>
<code>${escapeHTML(phone)}</code>

📍 <b>Adresa</b>
${escapeHTML(address)}

💬 <b>Zpráva</b>
${message ? escapeHTML(message) : "<i>Bez zprávy</i>"}

━━━━━━━━━━━━━━━━━━━━

🕒 <b>Odesláno</b>
${escapeHTML(now)}

🌐 <b>Stránka</b>
${escapeHTML(document.title)}

🔗 <b>URL</b>
${escapeHTML(window.location.href)}

━━━━━━━━━━━━━━━━━━━━

✨ <b>Nová poptávka čeká na odpověď.</b>
      `.trim();

    /* ===================================================
         SEND
      =================================================== */

    try {
      isSending = true;

      setLoading();

      const response = await fetch(TELEGRAM_API, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          chat_id: CHAT_ID,

          text: telegramMessage,

          parse_mode: "HTML",

          disable_web_page_preview: true,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.description || "Telegram error");
      }

      /* =================================================
           SUCCESS
        ================================================= */

      form.reset();

      setSuccess();

      console.log("DAVAMA: poptávka odeslána");
    } catch (error) {
      console.error("DAVAMA Telegram error:", error);

      setError();
    } finally {
      isSending = false;
    }
  });
}

/* START */

initTelegramForm();

/* =========================================================
   DAVAMA — COOKIE CONSENT
========================================================= */

function initDavamaCookieConsent() {
  const STORAGE_KEY = "davama_cookie_consent_v1";
  const CONSENT_VERSION = 1;

  let settingsOpenedFromBanner = false;
  let lastFocusedElement = null;

  /* =======================================================
     HELPERS
  ======================================================= */

  const readConsent = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

      if (!saved || saved.version !== CONSENT_VERSION) {
        return null;
      }

      return saved;
    } catch {
      return null;
    }
  };

  const saveConsent = ({ analytics = false, marketing = false }) => {
    const consent = {
      version: CONSENT_VERSION,

      necessary: true,

      analytics: Boolean(analytics),

      marketing: Boolean(marketing),

      updatedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    } catch (error) {
      console.warn("DAVAMA: consent se nepodařilo uložit.", error);
    }

    applyConsent(consent);

    return consent;
  };

  /* =======================================================
     APPLY CONSENT
  ======================================================= */

  const applyConsent = (consent) => {
    if (!consent) return;

    /*
     * Globální stav.
     * Můžeš ho později použít kdekoliv:
     *
     * window.DAVAMA_CONSENT.analytics
     * window.DAVAMA_CONSENT.marketing
     */

    window.DAVAMA_CONSENT = {
      necessary: true,

      analytics: Boolean(consent.analytics),

      marketing: Boolean(consent.marketing),
    };

    document.documentElement.dataset.cookieAnalytics = consent.analytics
      ? "granted"
      : "denied";

    document.documentElement.dataset.cookieMarketing = consent.marketing
      ? "granted"
      : "denied";

    /* =========================================
       GOOGLE CONSENT MODE
       pokud někdy nasadíš GA / Google Ads
    ========================================= */

    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        analytics_storage: consent.analytics ? "granted" : "denied",

        ad_storage: consent.marketing ? "granted" : "denied",

        ad_user_data: consent.marketing ? "granted" : "denied",

        ad_personalization: consent.marketing ? "granted" : "denied",
      });
    }

    /* =========================================
       LOAD OPTIONAL SERVICES
    ========================================= */

    if (consent.analytics) {
      loadDavamaAnalytics();
    }

    if (consent.marketing) {
      loadDavamaMarketing();
    }

    /*
     * Vlastní event pro případ,
     * že ho budeš potřebovat jinde.
     */

    window.dispatchEvent(
      new CustomEvent("davama:consent-change", {
        detail: window.DAVAMA_CONSENT,
      }),
    );
  };

  /* =======================================================
     ANALYTICS
  ======================================================= */

  function loadDavamaAnalytics() {
    if (window.__davamaAnalyticsLoaded) {
      return;
    }

    window.__davamaAnalyticsLoaded = true;

    /*
     * GOOGLE ANALYTICS
     * ----------------
     *
     * Až budeš mít Measurement ID,
     * ODKOMENTUJ tento blok
     * a změň G-XXXXXXXXXX.
     *
     * Nedávej GA script přímo do <head>.
     */

    /*
    const GA_ID =
      "G-XXXXXXXXXX";


    const script =
      document.createElement("script");


    script.async = true;


    script.src =
      `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;


    document.head.appendChild(
      script,
    );


    window.dataLayer =
      window.dataLayer || [];


    window.gtag = function () {
      window.dataLayer.push(
        arguments,
      );
    };


    window.gtag(
      "js",
      new Date(),
    );


    window.gtag(
      "config",
      GA_ID,
      {
        anonymize_ip: true,
      },
    );
    */
  }

  /* =======================================================
     MARKETING
  ======================================================= */

  function loadDavamaMarketing() {
    if (window.__davamaMarketingLoaded) {
      return;
    }

    window.__davamaMarketingLoaded = true;

    /*
     * META PIXEL / GOOGLE ADS
     * -----------------------
     *
     * Pokud ho klientka později bude chtít,
     * jeho inicializace patří sem.
     *
     * Ne přímo do HTML.
     */
  }

  /* =======================================================
     CREATE UI
  ======================================================= */

  const wrapper = document.createElement("div");

  wrapper.className = "cookie-consent";

  wrapper.innerHTML = `

    <!-- =========================================
         COOKIE BANNER
    ========================================== -->

    <section
      class="cookie-banner"
      data-cookie-banner
      aria-label="Nastavení cookies"
    >

      <div
        class="cookie-banner__bubble
               cookie-banner__bubble--1"
        aria-hidden="true"
      ></div>

      <div
        class="cookie-banner__bubble
               cookie-banner__bubble--2"
        aria-hidden="true"
      ></div>

      <div
        class="cookie-banner__bubble
               cookie-banner__bubble--3"
        aria-hidden="true"
      ></div>


      <div class="cookie-banner__inner">

        <div class="cookie-banner__content">

          <div class="cookie-banner__eyebrow">

            <span
              class="cookie-banner__dot"
            ></span>

            DAVAMA · SOUKROMÍ

          </div>


          <h2 class="cookie-banner__title">
            Vaše soukromí
            <span>je pro nás důležité.</span>
          </h2>


          <p class="cookie-banner__text">
            Používáme nezbytné technologie
            pro správné fungování webu.
            S vaším souhlasem můžeme používat
            také analytické a marketingové cookies.
            Volbu můžete kdykoliv změnit.
          </p>


          <button
            class="cookie-banner__details"
            type="button"
            data-cookie-settings
          >
            <span>
              Nastavení cookies
            </span>

            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M5 12h14"></path>
              <path d="m13 6 6 6-6 6"></path>
            </svg>
          </button>

        </div>


        <div class="cookie-banner__actions">

          <button
            class="cookie-btn
                   cookie-btn--primary"
            type="button"
            data-cookie-accept
          >
            <span>
              Přijmout vše
            </span>

            <svg
              viewBox="0 0 44 24"
              aria-hidden="true"
            >
              <path d="M2 12H40"></path>
              <path d="M34 6L40 12L34 18"></path>
            </svg>
          </button>


          <button
            class="cookie-btn
                   cookie-btn--secondary"
            type="button"
            data-cookie-reject
          >
            Pouze nezbytné
          </button>

        </div>

      </div>

    </section>


    <!-- =========================================
         SETTINGS
    ========================================== -->

    <div
      class="cookie-settings"
      data-cookie-modal
      aria-hidden="true"
    >

      <div
        class="cookie-settings__backdrop"
        data-cookie-modal-close
      ></div>


      <section
        class="cookie-settings__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-settings-title"
      >

        <button
          class="cookie-settings__close"
          type="button"
          aria-label="Zavřít nastavení cookies"
          data-cookie-modal-close
        >
          <span></span>
          <span></span>
        </button>


        <div class="cookie-settings__head">

          <div class="cookie-banner__eyebrow">

            <span
              class="cookie-banner__dot"
            ></span>

            NASTAVENÍ SOUKROMÍ

          </div>


          <h2
            class="cookie-settings__title"
            id="cookie-settings-title"
          >
            Cookies
            <span>podle vás.</span>
          </h2>


          <p class="cookie-settings__intro">
            Vyberte, které volitelné cookies
            nám dovolíte používat.
            Nezbytné technologie jsou vždy aktivní.
          </p>

        </div>


        <div class="cookie-settings__list">

          <!-- NECESSARY -->

          <div class="cookie-option">

            <div class="cookie-option__content">

              <div class="cookie-option__top">

                <span
                  class="cookie-option__number"
                >
                  01
                </span>

                <h3>
                  Nezbytné
                </h3>

              </div>


              <p>
                Zajišťují základní funkce webu
                a ukládání vašeho nastavení.
              </p>

            </div>


            <div
              class="cookie-switch
                     is-required"
              aria-label="Nezbytné cookies jsou vždy aktivní"
            >

              <span></span>

              <strong>
                Vždy aktivní
              </strong>

            </div>

          </div>


          <!-- ANALYTICS -->

          <div class="cookie-option">

            <div class="cookie-option__content">

              <div class="cookie-option__top">

                <span
                  class="cookie-option__number"
                >
                  02
                </span>

                <h3>
                  Analytické
                </h3>

              </div>


              <p>
                Pomáhají pochopit,
                jak návštěvníci web používají,
                abychom ho mohli zlepšovat.
              </p>

            </div>


            <label class="cookie-toggle">

              <input
                type="checkbox"
                data-cookie-analytics
              />

              <span
                class="cookie-toggle__track"
              >
                <span
                  class="cookie-toggle__thumb"
                ></span>
              </span>

              <span class="sr-only">
                Povolit analytické cookies
              </span>

            </label>

          </div>


          <!-- MARKETING -->

          <div class="cookie-option">

            <div class="cookie-option__content">

              <div class="cookie-option__top">

                <span
                  class="cookie-option__number"
                >
                  03
                </span>

                <h3>
                  Marketingové
                </h3>

              </div>


              <p>
                Mohou sloužit k měření reklam
                a zobrazování relevantnějšího obsahu.
              </p>

            </div>


            <label class="cookie-toggle">

              <input
                type="checkbox"
                data-cookie-marketing
              />

              <span
                class="cookie-toggle__track"
              >
                <span
                  class="cookie-toggle__thumb"
                ></span>
              </span>

              <span class="sr-only">
                Povolit marketingové cookies
              </span>

            </label>

          </div>

        </div>


        <div class="cookie-settings__actions">

          <button
            class="cookie-btn
                   cookie-btn--secondary"
            type="button"
            data-cookie-settings-reject
          >
            Pouze nezbytné
          </button>


          <button
            class="cookie-btn
                   cookie-btn--primary"
            type="button"
            data-cookie-save
          >

            <span>
              Uložit nastavení
            </span>

            <svg
              viewBox="0 0 44 24"
              aria-hidden="true"
            >
              <path d="M2 12H40"></path>
              <path d="M34 6L40 12L34 18"></path>
            </svg>

          </button>

        </div>

      </section>

    </div>
  `;

  document.body.appendChild(wrapper);

  /* =======================================================
     ELEMENTS
  ======================================================= */

  const banner = wrapper.querySelector("[data-cookie-banner]");

  const modal = wrapper.querySelector("[data-cookie-modal]");

  const analyticsInput = wrapper.querySelector("[data-cookie-analytics]");

  const marketingInput = wrapper.querySelector("[data-cookie-marketing]");

  const acceptButton = wrapper.querySelector("[data-cookie-accept]");

  const rejectButton = wrapper.querySelector("[data-cookie-reject]");

  const settingsButtons = wrapper.querySelectorAll("[data-cookie-settings]");

  const modalCloseButtons = wrapper.querySelectorAll(
    "[data-cookie-modal-close]",
  );

  const saveButton = wrapper.querySelector("[data-cookie-save]");

  const settingsRejectButton = wrapper.querySelector(
    "[data-cookie-settings-reject]",
  );

  /* =======================================================
     FOOTER SETTINGS BUTTON
  ======================================================= */

  const createFooterSettingsButton = () => {
    if (document.querySelector("[data-cookie-footer-settings]")) {
      return;
    }

    const button = document.createElement("button");

    button.type = "button";

    button.className = "cookie-footer-button";

    button.dataset.cookieFooterSettings = "";

    button.innerHTML = `
      <span
        class="cookie-footer-button__dot"
        aria-hidden="true"
      ></span>

      Nastavení cookies
    `;

    const footerCopy = document.querySelector(".site-footer__copy");

    const footerBottom = document.querySelector(".site-footer__bottom");

    if (footerCopy) {
      footerCopy.appendChild(button);
    } else if (footerBottom) {
      footerBottom.appendChild(button);
    } else {
      /*
       * fallback,
       * pokud stránka footer nemá
       */

      button.classList.add("cookie-footer-button--floating");

      document.body.appendChild(button);
    }

    button.addEventListener("click", () => {
      settingsOpenedFromBanner = false;

      openSettings();
    });
  };

  /* =======================================================
     BANNER
  ======================================================= */

  const showBanner = () => {
    banner.classList.add("is-visible");

    requestAnimationFrame(() => {
      banner.classList.add("is-entered");
    });
  };

  const hideBanner = () => {
    banner.classList.remove("is-entered");

    window.setTimeout(() => {
      banner.classList.remove("is-visible");
    }, 500);
  };

  /* =======================================================
     SETTINGS MODAL
  ======================================================= */

  const openSettings = () => {
    lastFocusedElement = document.activeElement;

    const consent = readConsent();

    analyticsInput.checked = Boolean(consent?.analytics);

    marketingInput.checked = Boolean(consent?.marketing);

    modal.classList.add("is-visible");

    modal.setAttribute("aria-hidden", "false");

    document.body.classList.add("cookie-modal-open");

    requestAnimationFrame(() => {
      modal.classList.add("is-entered");

      modal.querySelector(".cookie-settings__close")?.focus({
        preventScroll: true,
      });
    });
  };

  const closeSettings = () => {
    modal.classList.remove("is-entered");

    modal.setAttribute("aria-hidden", "true");

    document.body.classList.remove("cookie-modal-open");

    window.setTimeout(() => {
      modal.classList.remove("is-visible");
    }, 450);

    if (settingsOpenedFromBanner) {
      showBanner();
    }

    lastFocusedElement?.focus?.({
      preventScroll: true,
    });
  };

  /* =======================================================
     ACCEPT ALL
  ======================================================= */

  acceptButton.addEventListener("click", () => {
    saveConsent({
      analytics: true,
      marketing: true,
    });

    hideBanner();

    createFooterSettingsButton();
  });

  /* =======================================================
     ONLY NECESSARY
  ======================================================= */

  const rejectOptional = () => {
    saveConsent({
      analytics: false,
      marketing: false,
    });

    hideBanner();

    modal.classList.remove("is-entered", "is-visible");

    modal.setAttribute("aria-hidden", "true");

    document.body.classList.remove("cookie-modal-open");

    createFooterSettingsButton();
  };

  rejectButton.addEventListener("click", rejectOptional);

  settingsRejectButton.addEventListener("click", rejectOptional);

  /* =======================================================
     SETTINGS
  ======================================================= */

  settingsButtons.forEach((button) => {
    button.addEventListener("click", () => {
      settingsOpenedFromBanner = true;

      hideBanner();

      openSettings();
    });
  });

  /* =======================================================
     SAVE CUSTOM
  ======================================================= */

  saveButton.addEventListener("click", () => {
    saveConsent({
      analytics: analyticsInput.checked,

      marketing: marketingInput.checked,
    });

    settingsOpenedFromBanner = false;

    modal.classList.remove("is-entered");

    modal.setAttribute("aria-hidden", "true");

    document.body.classList.remove("cookie-modal-open");

    window.setTimeout(() => {
      modal.classList.remove("is-visible");
    }, 450);

    createFooterSettingsButton();
  });

  /* =======================================================
     CLOSE SETTINGS
  ======================================================= */

  modalCloseButtons.forEach((button) => {
    button.addEventListener("click", closeSettings);
  });

  /* =======================================================
     ESCAPE
  ======================================================= */

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-visible")) {
      closeSettings();
    }
  });

  /* =======================================================
     INITIAL STATE
  ======================================================= */

  const existingConsent = readConsent();

  if (existingConsent) {
    applyConsent(existingConsent);

    createFooterSettingsButton();
  } else {
    /*
     * krátké zpoždění:
     * nejdřív proběhne hero animation,
     * potom elegantně přijede cookie panel
     */

    window.setTimeout(showBanner, 700);
  }
}

/* START */

initDavamaCookieConsent();
