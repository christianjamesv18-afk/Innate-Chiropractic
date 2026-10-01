/* =========================================================
   Innate Chiropractic | GHL Client Portal Custom JS
   Paste into: Memberships > Client Portal > Branding >
   Advanced > Custom JS  (no <script> tags needed)

   What it adds:
   1. A "Book a Visit" section in the left menu, styled like
      the portal's own menu items (also works in the phone menu).
   2. A floating "Book a Visit" button (bottom left) that opens
      a small menu of links. Always shows on phones and tablets;
      on desktop it only shows if the menu section could not be added.
   All styling is included here, so it does not depend on the
   Custom CSS box.
   ========================================================= */

(function () {
  /* ---------- 1. SETTINGS (edit these) ---------- */
  var CONFIG = {
    brandColor: '#1F5F5B',      // main button color
    brandColorDark: '#154542',  // hover color
    accentColor: '#C9A86A',     // small highlight color

    // Section added to the left menu
    menuTitle: 'Book a Visit',
    menuLinks: [
      { label: 'Existing Patient', url: 'https://appointment.innatechiropractic.org/existing-patient-appointment' },
      { label: 'Dry Needling', url: 'https://appointment.innatechiropractic.org/functional-dry-needling' },
      { label: 'Class 4 Laser Therapy', url: 'https://appointment.innatechiropractic.org/class-4-laser-therapy' }
    ],

    // Floating button and its pop up menu
    floatingButtonText: 'Book a Visit',
    floatingLinks: [
      { label: 'Existing Patient Appointment', url: 'https://appointment.innatechiropractic.org/existing-patient-appointment' },
      { label: 'Dry Needling', url: 'https://appointment.innatechiropractic.org/functional-dry-needling' },
      { label: 'Class 4 Laser Therapy', url: 'https://appointment.innatechiropractic.org/class-4-laser-therapy' },
      { divider: true },
      { label: 'Call or Text 603-542-7726', url: 'tel:+16035427726' },
      { label: 'Office Hours', url: 'https://innatechiropractic.org/opening-hours/' },
      { label: 'Visit Our Website', url: 'https://innatechiropractic.org/' }
    ],

    showMenuSection: true,
    showFloatingButton: true
  };

  // Existing menu items used as a style template (any that exist)
  var KNOWN_ITEMS = ['Shared files', 'Invoices', 'Courses', 'Communities', 'Appointments', 'Dashboard'];
  var KNOWN_HEADINGS = ['Business & Operations', 'Finances', 'Memberships'];

  var CALENDAR_ICON =
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" ' +
    'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>' +
    '<line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>';

  /* ---------- 2. STYLES ---------- */
  function addStyles() {
    if (document.getElementById('ic-styles')) return;
    var css =
      '#ic-fab{position:fixed;left:20px;bottom:20px;z-index:2147483000;font-family:inherit}' +
      '#ic-fab-btn{display:flex;align-items:center;gap:8px;background:' + CONFIG.brandColor + ';color:#fff;' +
        'border:none;border-radius:999px;padding:12px 20px;font-size:15px;font-weight:600;cursor:pointer;' +
        'box-shadow:0 4px 14px rgba(0,0,0,.18);transition:background .2s ease}' +
      '#ic-fab-btn:hover{background:' + CONFIG.brandColorDark + '}' +
      '#ic-fab-btn svg{width:18px;height:18px}' +
      '#ic-fab-menu{display:none;position:absolute;left:0;bottom:58px;width:270px;max-width:calc(100vw - 40px);' +
        'background:#fff;border-radius:12px;box-shadow:0 8px 28px rgba(0,0,0,.18);overflow:hidden;' +
        'border-top:4px solid ' + CONFIG.accentColor + '}' +
      '#ic-fab.ic-open #ic-fab-menu{display:block}' +
      '#ic-fab-menu a{display:block;padding:12px 16px;color:#2B2B2B;text-decoration:none;font-size:14px;line-height:1.3}' +
      '#ic-fab-menu a:hover{background:#F3F6F6;color:' + CONFIG.brandColor + '}' +
      '#ic-fab-menu hr{border:none;border-top:1px solid #E5E7EB;margin:4px 0}' +
      '@media (max-width:640px){#ic-fab{left:12px;bottom:12px}#ic-fab-btn{padding:11px 16px;font-size:14px}}' +
      '[data-ic-menu] [data-ic-item]{cursor:pointer}' +
      // On desktop the left menu already has the links, so hide the button there
      '@media (min-width:1024px){html.ic-has-menu #ic-fab{display:none}}';
    var style = document.createElement('style');
    style.id = 'ic-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  /* ---------- 3. HELPERS ---------- */
  function openLink(url) {
    if (/^tel:|^mailto:/i.test(url)) window.location.href = url;
    else window.open(url, '_blank', 'noopener');
  }

  // Finds the visible element whose own text is exactly the label,
  // then climbs to the largest wrapper that still only holds that label.
  function findByText(label, root) {
    var nodes = (root || document.body).querySelectorAll('a, button, li, div, span, p, h1, h2, h3, h4, h5, h6');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.closest('[data-ic-menu]')) continue;
      if (el.children.length > 3) continue;
      if ((el.textContent || '').trim() !== label) continue;
      var item = el;
      while (item.parentElement && item.parentElement !== document.body &&
             (item.parentElement.textContent || '').trim() === label) {
        item = item.parentElement;
      }
      return item;
    }
    return null;
  }

  function isActive(el) {
    var cls = (el.className && el.className.baseVal !== undefined) ? el.className.baseVal : (el.className || '');
    if (/active|selected|current/i.test(cls)) return true;
    return !!el.querySelector('[class*="active"], [aria-current="page"]') || el.getAttribute('aria-current') === 'page';
  }

  function stripActive(el) {
    [el].concat([].slice.call(el.querySelectorAll('*'))).forEach(function (n) {
      if (n.classList) {
        [].slice.call(n.classList).forEach(function (c) {
          if (/active|selected|current/i.test(c)) n.classList.remove(c);
        });
      }
      n.removeAttribute && n.removeAttribute('aria-current');
    });
  }

  // Replaces the text of the deepest text node with a new label
  function setLabel(el, label) {
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    var target = null, n;
    while ((n = walker.nextNode())) { if (n.nodeValue.trim()) target = n; }
    if (target) target.nodeValue = label;
    else el.appendChild(document.createTextNode(label));
  }

  /* ---------- 4. LEFT MENU SECTION ---------- */
  function headingIn(el) {
    var text = (el.textContent || '');
    var hits = KNOWN_HEADINGS.filter(function (hd) { return text.indexOf(hd) !== -1; });
    return hits;
  }

  function addMenuSection() {
    if (!CONFIG.showMenuSection) return;

    // Find a menu item to copy that is not the page you are on
    var template = null, first = null;
    for (var i = 0; i < KNOWN_ITEMS.length; i++) {
      var el = findByText(KNOWN_ITEMS[i]);
      if (!el) continue;
      first = first || el;
      if (!isActive(el)) { template = el; break; }
    }
    template = template || first;
    if (!template) return;

    // Climb to the menu group (the first wrapper that includes a heading)
    var group = template.parentElement;
    while (group && group !== document.body && !headingIn(group).length) group = group.parentElement;
    if (!group || group === document.body) return;

    var headings = headingIn(group);
    var flat = headings.length > 1;            // headings and items share one container
    var root = flat ? group : group.parentElement;
    if (!root || root.querySelector('[data-ic-menu]')) return;

    var heading = findByText(headings[headings.length - 1], group);

    var section = document.createElement('div');
    section.setAttribute('data-ic-menu', '');
    section.style.display = 'contents';        // keeps the portal's own spacing

    if (heading) {
      var headClone = heading.cloneNode(true);
      setLabel(headClone, CONFIG.menuTitle);
      section.appendChild(headClone);
    }

    CONFIG.menuLinks.forEach(function (link) {
      var row = template.cloneNode(true);
      stripActive(row);
      row.setAttribute('data-ic-item', '');
      var svg = row.querySelector('svg');
      if (svg) {
        var holder = document.createElement('span');
        holder.innerHTML = CALENDAR_ICON;
        var icon = holder.firstChild;
        if (svg.getAttribute('class')) icon.setAttribute('class', svg.getAttribute('class'));
        svg.parentNode.replaceChild(icon, svg);
      }
      setLabel(row, link.label);
      var anchors = row.tagName === 'A' ? [row] : [].slice.call(row.querySelectorAll('a'));
      anchors.forEach(function (a) { a.href = link.url; a.target = '_blank'; a.rel = 'noopener noreferrer'; });
      row.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        openLink(link.url);
      });
      section.appendChild(row);
    });

    if (flat) {
      group.appendChild(section);
    } else {
      // Make the wrapper look like the other groups
      section.style.display = '';
      section.className = group.className;
      section.style.cssText = group.style.cssText;
      group.parentNode.insertBefore(section, group.nextSibling);
    }
  }

  /* ---------- 5. FLOATING BUTTON ---------- */
  function addFloatingButton() {
    if (!CONFIG.showFloatingButton || document.getElementById('ic-fab')) return;

    var wrap = document.createElement('div');
    wrap.id = 'ic-fab';

    var menu = document.createElement('div');
    menu.id = 'ic-fab-menu';
    CONFIG.floatingLinks.forEach(function (link) {
      if (link.divider) { menu.appendChild(document.createElement('hr')); return; }
      var a = document.createElement('a');
      a.href = link.url;
      a.textContent = link.label;
      if (!/^tel:|^mailto:/i.test(link.url)) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
      menu.appendChild(a);
    });

    var btn = document.createElement('button');
    btn.id = 'ic-fab-btn';
    btn.type = 'button';
    btn.innerHTML = CALENDAR_ICON + '<span></span>';
    btn.querySelector('span').textContent = CONFIG.floatingButtonText;
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      wrap.classList.toggle('ic-open');
    });

    document.addEventListener('click', function (e) {
      if (!wrap.contains(e.target)) wrap.classList.remove('ic-open');
    });

    wrap.appendChild(menu);
    wrap.appendChild(btn);
    document.body.appendChild(wrap);
  }

  /* ---------- 6. RUN (and re-run when the portal changes pages) ---------- */
  function run() {
    try {
      addStyles();
      addFloatingButton();
      addMenuSection();
      document.documentElement.classList.toggle('ic-has-menu', !!document.querySelector('[data-ic-menu]'));
    } catch (err) {
      if (window.console) console.warn('Innate custom JS:', err);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();

  var timer;
  new MutationObserver(function () {
    clearTimeout(timer);
    timer = setTimeout(run, 300);
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
