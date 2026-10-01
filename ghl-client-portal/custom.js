/* =========================================================
   Innate Chiropractic | GHL Client Portal Custom JS
   Paste into: Memberships > Client Portal > Branding >
   Advanced > Custom JS  (no <script> tags needed)
   ========================================================= */

(function () {
  /* ---------- 1. SETTINGS (edit these) ---------- */
  var CONFIG = {
    welcomeText: 'Welcome to the <strong>Innate Chiropractic</strong> Member Portal. Live a Life of Abundance.',
    welcomeLink: { label: 'Book your next visit', url: 'https://appointment.innatechiropractic.org/existing-patient-appointment' },

    // Buttons shown in the quick links bar under the banner.
    // "primary: true" makes the button filled instead of outlined.
    quickLinks: [
      { label: 'Book Appointment', url: 'https://appointment.innatechiropractic.org/existing-patient-appointment', primary: true },
      { label: 'Dry Needling', url: 'https://appointment.innatechiropractic.org/functional-dry-needling' },
      { label: 'Class 4 Laser Therapy', url: 'https://appointment.innatechiropractic.org/class-4-laser-therapy' },
      { label: 'Call or Text 603-542-7726', url: 'tel:+16035427726' },
      { label: 'Office Hours', url: 'https://innatechiropractic.org/opening-hours/' },
      { label: 'Shop Supplements', url: 'https://us.fullscript.com/' },
      { label: 'Visit Our Website', url: 'https://innatechiropractic.org/' }
    ],

    // Extra links added to the portal's own menu/tabs.
    navLinks: [
      { label: 'Book Appointment', url: 'https://appointment.innatechiropractic.org/existing-patient-appointment' },
      { label: 'Dry Needling', url: 'https://appointment.innatechiropractic.org/functional-dry-needling' },
      { label: 'Class 4 Laser Therapy', url: 'https://appointment.innatechiropractic.org/class-4-laser-therapy' },
      { label: 'Supplements', url: 'https://us.fullscript.com/' }
    ],

    showBanner: true,
    showQuickLinks: true,
    showNavLinks: true
  };

  /* ---------- 2. HELPERS ---------- */
  function isExternal(url) {
    return /^https?:\/\//i.test(url) && url.indexOf(location.hostname) === -1;
  }

  function makeLink(item, className) {
    var a = document.createElement('a');
    a.href = item.url;
    a.textContent = item.label;
    if (className) a.className = className;
    if (isExternal(item.url)) {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }
    return a;
  }

  /* ---------- 3. WELCOME BANNER ---------- */
  function addBanner() {
    if (!CONFIG.showBanner || document.getElementById('ic-welcome-banner')) return;
    var banner = document.createElement('div');
    banner.id = 'ic-welcome-banner';
    banner.innerHTML = CONFIG.welcomeText;
    if (CONFIG.welcomeLink && CONFIG.welcomeLink.url) {
      banner.appendChild(document.createTextNode(' '));
      banner.appendChild(makeLink(CONFIG.welcomeLink));
    }
    document.body.prepend(banner);
  }

  /* ---------- 4. QUICK LINKS BAR ---------- */
  function addQuickLinks() {
    if (!CONFIG.showQuickLinks || document.getElementById('ic-quick-links')) return;
    var bar = document.createElement('div');
    bar.id = 'ic-quick-links';
    CONFIG.quickLinks.forEach(function (item) {
      bar.appendChild(makeLink(item, item.primary ? 'ic-primary' : ''));
    });
    var banner = document.getElementById('ic-welcome-banner');
    if (banner) banner.after(bar);
    else document.body.prepend(bar);
  }

  /* ---------- 5. EXTRA LINKS IN THE PORTAL MENU ---------- */
  // GHL builds its menu after the page loads, so we look for it and
  // copy the style of an existing menu item so the new links blend in.
  function addNavLinks() {
    if (!CONFIG.showNavLinks || document.querySelector('.ic-nav-link')) return;

    var nav = document.querySelector('nav, [class*="sidebar"], [class*="navbar"], [role="navigation"]');
    if (!nav) return;

    var sample = nav.querySelector('a');
    if (!sample) return;

    var container = sample.parentElement;
    var wrapItem = container && container.tagName === 'LI';

    CONFIG.navLinks.forEach(function (item) {
      var a = makeLink(item, (sample.className || '') + ' ic-nav-link');
      a.classList.remove('active', 'router-link-active', 'router-link-exact-active');
      if (wrapItem) {
        var li = document.createElement('li');
        li.className = container.className;
        li.appendChild(a);
        container.parentElement.appendChild(li);
      } else {
        container.appendChild(a);
      }
    });
  }

  /* ---------- 6. RUN (and re-run when the portal changes pages) ---------- */
  function run() {
    addBanner();
    addQuickLinks();
    addNavLinks();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

  var timer;
  new MutationObserver(function () {
    clearTimeout(timer);
    timer = setTimeout(run, 300);
  }).observe(document.body, { childList: true, subtree: true });
})();
