/* =========================================================
   PORTFOLIO | LINART — main.js (rewritten)
   ========================================================= */
(() => {
    "use strict";

    const $ = (s, c = document) => c.querySelector(s);
    const $$ = (s, c = document) => [...c.querySelectorAll(s)];
    const root = document.documentElement;
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const menuBtn = $("#menuBtn");
    const navLinks = $("#navLinks");
    const themeToggle = $("#themeToggle");
    const languageToggle = $("#languageToggle");

    let lang = (() => { try { return localStorage.getItem("lang") || "en"; } catch { return "en"; } })();

    /* ---------- Mobile menu ---------- */
    function setMenu(open) {
        navLinks.classList.toggle("active", open);
        menuBtn.setAttribute("aria-expanded", String(open));
        menuBtn.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    }
    menuBtn.addEventListener("click", () => setMenu(!navLinks.classList.contains("active")));
    $$(".nav-links a").forEach(a => a.addEventListener("click", () => setMenu(false)));
    document.addEventListener("click", e => {
        if (!e.target.closest("#navbar")) setMenu(false);
    });
    document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });

    /* ---------- Theme (dark / light) ---------- */
    const themeText = {
        en: { toDark: "Switch to dark mode", toLight: "Switch to light mode" },
        kh: { toDark: "ប្តូរទៅងងឹត", toLight: "ប្តូរទៅភ្លឺ" },
    };

    function paintThemeButton() {
        const dark = root.getAttribute("data-theme") === "dark";
        const label = dark ? themeText[lang].toLight : themeText[lang].toDark;
        const icon = themeToggle.querySelector("i");
        icon.className = dark ? "fa-solid fa-sun" : "fa-solid fa-moon";
        themeToggle.setAttribute("aria-pressed", String(dark));
        themeToggle.setAttribute("aria-label", label);
        themeToggle.title = label;
        const meta = $('meta[name="theme-color"]');
        if (meta) meta.content = dark ? "#0a0c17" : "#6366f1";
    }

    function setTheme(theme, save = true) {
        // enable colour transitions only for the moment of switching
        root.classList.add("theme-anim");
        root.setAttribute("data-theme", theme);
        if (save) { try { localStorage.setItem("theme", theme); } catch {} }
        paintThemeButton();
        clearTimeout(setTheme.t);
        setTheme.t = setTimeout(() => root.classList.remove("theme-anim"), 500);
    }

    themeToggle.addEventListener("click", () => {
        setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
    });

    // follow the OS if the visitor never chose manually
    matchMedia("(prefers-color-scheme: dark)").addEventListener("change", e => {
        let saved = null;
        try { saved = localStorage.getItem("theme"); } catch {}
        if (!saved) setTheme(e.matches ? "dark" : "light", false);
    });

    /* ---------- Typewriter ---------- */
    const typedEl = $("#typed");
    const roles = {
        en: ["Full-Stack Developer", "UX/UI Designer", "Creative Thinker"],
        kh: ["អ្នកអភិវឌ្ឍន៍ Full-Stack", "អ្នករចនា UX/UI", "អ្នកគិតច្នៃប្រឌិត"],
    };
    let typeTimer, rIdx = 0, cIdx = 0, deleting = false;

    function type() {
        const word = roles[lang][rIdx];
        if (reduceMotion) { typedEl.textContent = roles[lang].join(" & "); return; }

        typedEl.textContent = word.slice(0, cIdx);
        let delay = deleting ? 45 : 95;

        if (!deleting && cIdx === word.length) { deleting = true; delay = 1600; }
        else if (deleting && cIdx === 0) { deleting = false; rIdx = (rIdx + 1) % roles[lang].length; delay = 350; }
        else { cIdx += deleting ? -1 : 1; }

        typeTimer = setTimeout(type, delay);
    }
    function restartType() {
        clearTimeout(typeTimer);
        rIdx = 0; cIdx = 0; deleting = false;
        type();
    }

    /* ---------- Language (EN / KH) ---------- */
    function setLanguage(next, save = true) {
        lang = next;
        root.lang = next === "kh" ? "km" : "en";
        if (save) { try { localStorage.setItem("lang", next); } catch {} }

        $$("[data-en][data-kh]").forEach(el => { el.textContent = el.dataset[next]; });

        const label = $("span", languageToggle);
        if (label) label.textContent = next === "en" ? "ខ្មែរ" : "EN";
        const tip = next === "en" ? "Change language to Khmer" : "ប្តូរទៅភាសាអង់គ្លេស";
        languageToggle.setAttribute("aria-label", tip);
        languageToggle.title = tip;

        paintThemeButton();
        restartType();
    }
    languageToggle.addEventListener("click", () => setLanguage(lang === "en" ? "kh" : "en"));

    /* ---------- Scroll reveal ---------- */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("in");
            revealObserver.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

    function observeReveals(scope = document) {
        $$(".reveal:not(.in)", scope).forEach(el => revealObserver.observe(el));
    }

    /* ---------- Active nav link + progress bar + back to top ---------- */
    const progress = $("#scrollProgress");
    const toTop = $("#toTop");
    const navAnchors = $$(".nav-links a");
    const sectionEls = $$("main section[id]");

    const spy = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            navAnchors.forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`));
        });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sectionEls.forEach(s => spy.observe(s));

    let ticking = false;
    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const max = document.documentElement.scrollHeight - innerHeight;
            progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
            toTop.classList.toggle("show", scrollY > 600);
            ticking = false;
        });
    }
    addEventListener("scroll", onScroll, { passive: true });
    toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));

    /* ---------- Dynamic data (skills + projects) ---------- */
    const esc = (s = "") => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

    async function loadPortfolioData() {
        const skillsBox = $("#skillsContainer");
        const projectsBox = $("#projectsContainer");

        try {
            const res = await fetch("./data.json");
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();

            if (skillsBox && Array.isArray(data.skills)) {
                skillsBox.innerHTML = data.skills.map((s, i) => {
                    const pct = Math.max(0, Math.min(100, parseInt(s.level, 10) || 0));
                    return `
                    <div class="skill-card reveal" style="--d:${(i % 4) * 0.08}s; --w:${pct / 100}">
                        <img src="${esc(s.icon)}" alt="${esc(s.name)}" loading="lazy">
                        <h3>${esc(s.name)}</h3>
                        <span class="level">${pct}%</span>
                        <div class="progress"><span class="progress-bar"></span></div>
                    </div>`;
                }).join("");
            }

            if (projectsBox && Array.isArray(data.projects)) {
                projectsBox.innerHTML = data.projects.map((p, i) => `
                    <article class="project-card reveal" style="--d:${(i % 3) * 0.1}s">
                        <div class="project-image">
                            <img src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy">
                            <span class="project-tag">${esc(p.tag)}</span>
                        </div>
                        <div class="project-content">
                            <h3>${esc(p.title)}</h3>
                            <p>${esc(p.description)}</p>
                            <div class="tech-stack">${(p.tech || []).map(t => `<span>${esc(t)}</span>`).join("")}</div>
                            <div class="project-buttons">
                                <a href="${esc(p.demo)}" class="btn-demo" target="_blank" rel="noopener">Live Demo</a>
                                <a href="${esc(p.github)}" class="btn-code" target="_blank" rel="noopener">GitHub</a>
                            </div>
                        </div>
                    </article>`).join("");
            }
        } catch (err) {
            console.error("Error loading data.json:", err);
            if (projectsBox && !projectsBox.children.length) {
                projectsBox.innerHTML = '<p class="empty-state">Projects will appear here soon.</p>';
            }
        }
        observeReveals();
    }

    /* ---------- Contact form (AJAX with status message) ---------- */
    const form = $("#contactForm");
    const formBtn = $("#formBtn");
    const formStatus = $("#formStatus");
    const msgs = {
        en: { ok: "Thank you! Your message has been sent.", err: "Something went wrong. Please try again." },
        kh: { ok: "អរគុណ! សាររបស់អ្នកត្រូវបានផ្ញើរួចហើយ។", err: "មានបញ្ហាកើតឡើង។ សូមព្យាយាមម្តងទៀត។" },
    };
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        formBtn.disabled = true;
        formStatus.className = "form-status";
        formStatus.textContent = "…";
        try {
            const res = await fetch(form.action, {
                method: "POST",
                body: new FormData(form),
                headers: { Accept: "application/json" },
            });
            if (!res.ok) throw new Error();
            form.reset();
            formStatus.classList.add("ok");
            formStatus.textContent = msgs[lang].ok;
        } catch {
            formStatus.classList.add("err");
            formStatus.textContent = msgs[lang].err;
        } finally {
            formBtn.disabled = false;
        }
    });

    /* ---------- Init ---------- */
    paintThemeButton();
    setLanguage(lang, false);
    observeReveals();
    onScroll();
    loadPortfolioData();
})();