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
