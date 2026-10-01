/* Innate Chiropractic | GoHighLevel Client Portal | Custom JS */
(function () {
  var BOOK_URL = "https://innatechiropractic.org/schedule-appointment/";
  var LABEL = "Book Appointment";
  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="12" y1="14" x2="12" y2="18"/><line x1="10" y1="16" x2="14" y2="16"/></svg>';

  function openBooking(e) {
    e.preventDefault();
    e.stopPropagation();
    window.open(BOOK_URL, "_blank", "noopener");
  }

  // Smallest element whose text is exactly the given label (e.g. "Appointments")
  function findByText(text, scope) {
    var els = (scope || document).querySelectorAll("a, button, li, div, span");
    var best = null;
    for (var i = 0; i < els.length; i++) {
      if (els[i].closest(".ic-book-banner, [data-ic-book-tab]")) continue;
      if (els[i].textContent.trim() === text) best = els[i];
    }
    if (!best) return null;
    return best.closest("a, button, [role='link'], [role='menuitem'], li") || best;
  }

  function addSidebarTab() {
    if (document.querySelector("[data-ic-book-tab]")) return;
    var ref = findByText("Appointments") || findByText("Shared files");
    if (!ref) return;

    var tab = ref.cloneNode(true);
    tab.setAttribute("data-ic-book-tab", "");
    tab.removeAttribute("aria-current");
    tab.removeAttribute("id");
    String(tab.className || "").split(/\s+/).forEach(function (c) {
      if (/active|selected|current/i.test(c)) tab.classList.remove(c);
    });

    // Swap the label text
    var walker = document.createTreeWalker(tab, NodeFilter.SHOW_TEXT);
    var node, done = false;
    while ((node = walker.nextNode())) {
      if (!done && node.nodeValue.trim()) { node.nodeValue = LABEL; done = true; }
      else if (node.nodeValue.trim()) node.nodeValue = "";
    }

    // Swap the icon
    var oldIcon = tab.querySelector("svg, img, i");
    if (oldIcon) {
      var wrap = document.createElement("span");
      wrap.innerHTML = ICON;
      wrap.style.display = "inline-flex";
      oldIcon.parentNode.replaceChild(wrap, oldIcon);
    }

    if (tab.tagName === "A") {
      tab.setAttribute("href", BOOK_URL);
      tab.setAttribute("target", "_blank");
      tab.setAttribute("rel", "noopener");
    }
    tab.addEventListener("click", openBooking, true);
    ref.parentNode.insertBefore(tab, ref.nextSibling);
  }

  function addDashboardCard() {
    var existing = document.querySelector(".ic-book-banner");
    if (!/dashboard/i.test(location.pathname)) {
      if (existing) existing.remove();
      return;
    }
    if (existing) return;

    var welcome = null;
    var els = document.querySelectorAll("h1, h2, h3, h4, p, div, span");
    for (var i = 0; i < els.length; i++) {
      if (/^Welcome back/i.test(els[i].textContent.trim())) welcome = els[i];
    }
    if (!welcome) return;
    var block = welcome.parentElement || welcome;

    var card = document.createElement("div");
    card.className = "ic-book-banner";
    card.innerHTML =
      '<div><span class="ic-book-banner__eyebrow">Ready for your next visit?</span>' +
      "<h3>Book Your Appointment</h3>" +
      "<p>Pick a day and time that works best for you.</p></div>" +
      '<a class="ic-book-btn" href="' + BOOK_URL + '" target="_blank" rel="noopener">' + ICON + "Book Now</a>";
    block.parentNode.insertBefore(card, block.nextSibling);
  }

  function addFloatingButton() {
    if (document.querySelector(".ic-book-fab")) return;
    var fab = document.createElement("a");
    fab.className = "ic-book-fab";
    fab.href = BOOK_URL;
    fab.target = "_blank";
    fab.rel = "noopener";
    fab.innerHTML = ICON + "Book";
    document.body.appendChild(fab);
  }

  function run() {
    addSidebarTab();
    addDashboardCard();
    addFloatingButton();
  }

  // The portal loads pages without a full reload, so re-check when the page changes
  var timer = null;
  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(run, 200);
  }

  function start() {
    run();
    new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
