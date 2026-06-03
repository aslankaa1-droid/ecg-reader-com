/* KARDIOSPEC · core script · i18n · theme · reveal · menu */

(function () {
  "use strict";

  const STORAGE = {
    lang: "ks.lang",
    theme: "ks.theme",
    legal: "ks.legal.ack",
  };

  const DEFAULT_LANG = "ru";
  const DEFAULT_THEME = "dark";

  /* ----- helpers ----- */
  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));

  function detectLang() {
    const saved = localStorage.getItem(STORAGE.lang);
    if (saved && window.I18N[saved]) return saved;
    const nav = (navigator.language || "ru").slice(0, 2).toLowerCase();
    if (window.I18N[nav]) return nav;
    return DEFAULT_LANG;
  }

  function applyLang(lang) {
    const dict = window.I18N[lang] || window.I18N[DEFAULT_LANG];
    const rtl = lang === "ar";
    document.documentElement.lang = lang;
    document.documentElement.dir = rtl ? "rtl" : "ltr";

    $$("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const val = dict[key];
      if (val === undefined) return;
      // Allow simple HTML tags from dictionary
      if (/[<>]/.test(val)) el.innerHTML = val;
      else el.textContent = val;
    });
    $$("[data-i18n-attr]").forEach((el) => {
      const spec = el.getAttribute("data-i18n-attr");
      spec.split(",").forEach((pair) => {
        const [attr, key] = pair.trim().split(":");
        if (attr && key && dict[key] !== undefined) {
          el.setAttribute(attr, dict[key]);
        }
      });
    });

    /* lang menu — selected */
    $$("#lang-list button").forEach((b) => {
      b.classList.toggle("active", b.dataset.lang === lang);
    });
    const cur = $("#lang-current");
    if (cur) cur.textContent = lang.toUpperCase();

    localStorage.setItem(STORAGE.lang, lang);
    document.dispatchEvent(new CustomEvent("kardiospec:lang", { detail: { lang } }));
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    $$("#theme-list button").forEach((b) => {
      b.classList.toggle("active", b.dataset.theme === theme);
    });
    const cur = $("#theme-current");
    if (cur) cur.textContent = (window.THEME_LIST.find((t) => t.code === theme) || {}).name || theme;
    localStorage.setItem(STORAGE.theme, theme);
  }

  function initMenus() {
    /* fill lang list */
    const langList = $("#lang-list");
    if (langList) {
      langList.innerHTML = window.LANG_LIST
        .map((l) => `<button data-lang="${l.code}">${l.name}<span class="code">${l.code.toUpperCase()}</span></button>`)
        .join("");
      langList.addEventListener("click", (e) => {
        const b = e.target.closest("button");
        if (!b) return;
        applyLang(b.dataset.lang);
        closeAllMenus();
      });
    }

    /* fill theme list */
    const themeList = $("#theme-list");
    if (themeList) {
      themeList.innerHTML = window.THEME_LIST
        .map((t) => `<button data-theme="${t.code}">${t.name}</button>`)
        .join("");
      themeList.addEventListener("click", (e) => {
        const b = e.target.closest("button");
        if (!b) return;
        applyTheme(b.dataset.theme);
        closeAllMenus();
      });
    }

    $$(".menu").forEach((menu) => {
      const trigger = menu.querySelector(".menu-trigger");
      if (!trigger) return;
      trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = menu.classList.contains("open");
        closeAllMenus();
        if (!isOpen) menu.classList.add("open");
      });
    });
    document.addEventListener("click", closeAllMenus);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeAllMenus();
    });
  }

  function closeAllMenus() {
    $$(".menu.open").forEach((m) => m.classList.remove("open"));
  }

  function initReveal() {
    const els = $$(".reveal");
    if (!("IntersectionObserver" in window) || !els.length) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    );
    els.forEach((el) => io.observe(el));
  }

  function initLegalBar() {
    const bar = $("#legal-bar");
    if (!bar) return;
    if (localStorage.getItem(STORAGE.legal)) {
      bar.remove();
      return;
    }
    const ok = bar.querySelector("[data-act='ok']");
    if (ok) {
      ok.addEventListener("click", () => {
        localStorage.setItem(STORAGE.legal, String(Date.now()));
        bar.classList.add("hidden");
        setTimeout(() => bar.remove(), 350);
      });
    }
  }

  function initNav() {
    const nav = $(".nav");
    if (!nav) return;
    const onScroll = () => {
      nav.classList.toggle("scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    $$('.nav a[href^="#"], a[data-scroll]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const href = a.getAttribute("href");
        if (!href || !href.startsWith("#")) return;
        const target = $(href);
        if (!target) return;
        e.preventDefault();
        const y = target.getBoundingClientRect().top + window.scrollY - 64;
        window.scrollTo({ top: y, behavior: "smooth" });
      });
    });
  }

  /* boot */
  document.addEventListener("DOMContentLoaded", () => {
    applyTheme(localStorage.getItem(STORAGE.theme) || DEFAULT_THEME);
    initMenus();
    applyLang(detectLang());
    initReveal();
    initLegalBar();
    initNav();
  });
})();
