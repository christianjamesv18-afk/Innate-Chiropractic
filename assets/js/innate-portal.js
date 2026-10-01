/* ==========================================================================
   Innate Chiropractic Portal Script
   Vanilla JavaScript, no dependencies. Pairs with assets/css/innate-portal.css.

   Features (all opt-in through data attributes):
     data-ic-nav-toggle        Opens/closes the mobile sidebar drawer
     data-ic-tabs              Accessible tabs
     data-ic-modal-open="id"   Opens a modal; data-ic-modal-close closes it
     data-ic-dismiss           Dismisses the closest .ic-alert
     data-ic-validate          Client side form validation
     data-ic-password-toggle   Show/hide password
     data-ic-greeting          Inserts "Good morning/afternoon/evening"
     data-ic-progress="60"     Animates an .ic-progress__bar to 60%
     .ic-table--stack          Auto-fills data-label on cells for phone layout

   Public API: window.InnatePortal.toast(message, type, timeout)
               window.InnatePortal.openModal(id) / closeModal(id)
   ========================================================================== */
(function () {
  "use strict";

  var MOBILE_NAV_QUERY = window.matchMedia("(max-width: 1024px)");
  var FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function $(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function $$(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  function lockScroll(lock) {
    document.body.classList.toggle("ic-no-scroll", lock);
  }

  function trapFocus(container, event) {
    if (event.key !== "Tab") return;
    var items = $$(FOCUSABLE, container).filter(function (el) {
      return el.offsetParent !== null;
    });
    if (!items.length) return;
    var first = items[0];
    var last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  /* ------------------------------------------------------------------------
     Mobile sidebar drawer
     ------------------------------------------------------------------------ */
  function initSidebar() {
    var sidebar = $(".ic-sidebar");
    if (!sidebar) return;

    var overlay = $(".ic-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "ic-overlay";
      overlay.setAttribute("aria-hidden", "true");
      document.body.appendChild(overlay);
    }

    var toggles = $$("[data-ic-nav-toggle]");
    var lastTrigger = null;

    function setOpen(open) {
      sidebar.classList.toggle("is-open", open);
      overlay.classList.toggle("is-visible", open);
      toggles.forEach(function (btn) {
        btn.setAttribute("aria-expanded", String(open));
      });
      lockScroll(open);
      if (open) {
        var first = $(FOCUSABLE, sidebar);
        if (first) first.focus();
      } else if (lastTrigger) {
        lastTrigger.focus();
      }
    }

    toggles.forEach(function (btn) {
      btn.setAttribute("aria-expanded", "false");
      btn.addEventListener("click", function () {
        lastTrigger = btn;
        setOpen(!sidebar.classList.contains("is-open"));
      });
    });

    overlay.addEventListener("click", function () {
      setOpen(false);
    });

    sidebar.addEventListener("keydown", function (e) {
      if (!sidebar.classList.contains("is-open")) return;
      if (e.key === "Escape") setOpen(false);
      trapFocus(sidebar, e);
    });

    // Close the drawer after choosing a link on mobile
    $$(".ic-nav__link", sidebar).forEach(function (link) {
      link.addEventListener("click", function () {
        if (MOBILE_NAV_QUERY.matches) setOpen(false);
      });
    });

    // Reset if the screen grows back to desktop size
    var onChange = function (e) {
      if (!e.matches && sidebar.classList.contains("is-open")) setOpen(false);
    };
    if (MOBILE_NAV_QUERY.addEventListener) {
      MOBILE_NAV_QUERY.addEventListener("change", onChange);
    } else if (MOBILE_NAV_QUERY.addListener) {
      MOBILE_NAV_QUERY.addListener(onChange);
    }

    // Basic swipe left to close on touch screens
    var startX = null;
    sidebar.addEventListener(
      "touchstart",
      function (e) {
        startX = e.touches[0].clientX;
      },
      { passive: true }
    );
    sidebar.addEventListener(
      "touchend",
      function (e) {
        if (startX === null) return;
        var dx = e.changedTouches[0].clientX - startX;
        if (dx < -60) setOpen(false);
        startX = null;
      },
      { passive: true }
    );
  }

  /* ------------------------------------------------------------------------
     Highlight the current page in sidebar and bottom nav
     ------------------------------------------------------------------------ */
  function initActiveNav() {
    var path = window.location.pathname.split("/").pop() || "index.html";
    $$(".ic-nav__link, .ic-bottom-nav__link").forEach(function (link) {
      var href = (link.getAttribute("href") || "").split("#")[0].split("?")[0];
      if (!href) return;
      if (href.split("/").pop() === path) {
        link.classList.add("is-active");
        link.setAttribute("aria-current", "page");
      }
    });
  }

  /* ------------------------------------------------------------------------
     Header shadow once the page scrolls
     ------------------------------------------------------------------------ */
  function initHeader() {
    var header = $(".ic-header");
    if (!header) return;
    var ticking = false;
    function update() {
      header.classList.toggle("is-scrolled", window.scrollY > 4);
      ticking = false;
    }
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          window.requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true }
    );
    update();
  }

  /* ------------------------------------------------------------------------
     Tabs (keyboard accessible: arrows, Home, End)
     ------------------------------------------------------------------------ */
  function initTabs() {
    $$("[data-ic-tabs]").forEach(function (group) {
      var tabs = $$(".ic-tab", group);
      tabs.forEach(function (tab, i) {
        tab.setAttribute("role", "tab");
        var panel = document.getElementById(tab.getAttribute("aria-controls"));
        if (panel) {
          panel.setAttribute("role", "tabpanel");
          panel.setAttribute("aria-labelledby", tab.id);
        }

        tab.addEventListener("click", function () {
          select(i);
        });

        tab.addEventListener("keydown", function (e) {
          var next = null;
          if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
          if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
          if (e.key === "Home") next = 0;
          if (e.key === "End") next = tabs.length - 1;
          if (next !== null) {
            e.preventDefault();
            select(next);
            tabs[next].focus();
          }
        });
      });

      function select(index) {
        tabs.forEach(function (tab, i) {
          var active = i === index;
          tab.setAttribute("aria-selected", String(active));
          tab.tabIndex = active ? 0 : -1;
          var panel = document.getElementById(tab.getAttribute("aria-controls"));
          if (panel) panel.hidden = !active;
          if (active) {
            tab.scrollIntoView({ block: "nearest", inline: "nearest" });
          }
        });
      }

      var initial = tabs.findIndex(function (t) {
        return t.getAttribute("aria-selected") === "true";
      });
      select(initial < 0 ? 0 : initial);
    });
  }

  /* ------------------------------------------------------------------------
     Modals
     ------------------------------------------------------------------------ */
  var modalReturnFocus = null;

  function openModal(id) {
    var modal = document.getElementById(id);
    if (!modal) return;
    modalReturnFocus = document.activeElement;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    lockScroll(true);
    var first = $(FOCUSABLE, modal);
    if (first) setTimeout(function () { first.focus(); }, 50);
  }

  function closeModal(id) {
    var modal = typeof id === "string" ? document.getElementById(id) : id;
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    lockScroll(false);
    if (modalReturnFocus) modalReturnFocus.focus();
  }

  function initModals() {
    $$(".ic-modal").forEach(function (modal) {
      modal.setAttribute("aria-hidden", "true");
      var dialog = $(".ic-modal__dialog", modal);
      if (dialog) {
        dialog.setAttribute("role", "dialog");
        dialog.setAttribute("aria-modal", "true");
      }
      modal.addEventListener("click", function (e) {
        if (e.target === modal) closeModal(modal);
      });
      modal.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeModal(modal);
        trapFocus(modal, e);
      });
    });

    document.addEventListener("click", function (e) {
      var opener = e.target.closest("[data-ic-modal-open]");
      if (opener) {
        e.preventDefault();
        openModal(opener.getAttribute("data-ic-modal-open"));
        return;
      }
      var closer = e.target.closest("[data-ic-modal-close]");
      if (closer) {
        e.preventDefault();
        closeModal(closer.closest(".ic-modal"));
      }
    });
  }

  /* ------------------------------------------------------------------------
     Toasts
     ------------------------------------------------------------------------ */
  function toast(message, type, timeout) {
    var region = $(".ic-toast-region");
    if (!region) {
      region = document.createElement("div");
      region.className = "ic-toast-region";
      region.setAttribute("aria-live", "polite");
      region.setAttribute("aria-atomic", "false");
      document.body.appendChild(region);
    }

    var el = document.createElement("div");
    el.className = "ic-toast" + (type ? " ic-toast--" + type : "");
    el.setAttribute("role", type === "danger" ? "alert" : "status");

    var text = document.createElement("div");
    text.textContent = message;
    el.appendChild(text);

    var close = document.createElement("button");
    close.className = "ic-toast__close";
    close.type = "button";
    close.setAttribute("aria-label", "Dismiss notification");
    close.innerHTML = "&times;";
    el.appendChild(close);

    function remove() {
      el.classList.add("is-leaving");
      setTimeout(function () {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 250);
    }

    close.addEventListener("click", remove);
    region.appendChild(el);
    setTimeout(remove, typeof timeout === "number" ? timeout : 4500);
    return el;
  }

  function initToastTriggers() {
    document.addEventListener("click", function (e) {
      var trigger = e.target.closest("[data-ic-toast]");
      if (!trigger) return;
      toast(trigger.getAttribute("data-ic-toast"), trigger.getAttribute("data-ic-toast-type"));
    });
  }

  /* ------------------------------------------------------------------------
     Dismissible alerts
     ------------------------------------------------------------------------ */
  function initAlerts() {
    document.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-ic-dismiss]");
      if (!btn) return;
      var alert = btn.closest(".ic-alert");
      if (alert) alert.parentNode.removeChild(alert);
    });
  }

  /* ------------------------------------------------------------------------
     Responsive tables: copy header text into each cell's data-label
     ------------------------------------------------------------------------ */
  function initTables() {
    $$(".ic-table--stack").forEach(function (table) {
      var headers = $$("thead th", table).map(function (th) {
        return th.textContent.trim();
      });
      $$("tbody tr", table).forEach(function (row) {
        $$("td", row).forEach(function (cell, i) {
          if (!cell.hasAttribute("data-label") && headers[i]) {
            cell.setAttribute("data-label", headers[i]);
          }
        });
      });
    });
  }

  /* ------------------------------------------------------------------------
     Form validation
     ------------------------------------------------------------------------ */
  function validateField(input) {
    var field = input.closest(".ic-field");
    if (!field) return true;
    var valid = input.checkValidity();
    field.classList.toggle("is-invalid", !valid);
    input.setAttribute("aria-invalid", String(!valid));

    var error = $(".ic-field__error", field);
    if (!error) {
      error = document.createElement("div");
      error.className = "ic-field__error";
      error.id = (input.id || input.name || "field") + "-error";
      field.appendChild(error);
    }
    if (!valid) {
      error.textContent = input.getAttribute("data-ic-error") || input.validationMessage;
      input.setAttribute("aria-describedby", error.id);
    }
    return valid;
  }

  function initForms() {
    $$("form[data-ic-validate]").forEach(function (form) {
      form.setAttribute("novalidate", "");
      var inputs = $$("input, select, textarea", form);

      inputs.forEach(function (input) {
        input.addEventListener("blur", function () {
          validateField(input);
        });
        input.addEventListener("input", function () {
          var field = input.closest(".ic-field");
          if (field && field.classList.contains("is-invalid")) validateField(input);
        });
      });

      form.addEventListener("submit", function (e) {
        var firstInvalid = null;
        inputs.forEach(function (input) {
          if (!validateField(input) && !firstInvalid) firstInvalid = input;
        });
        if (firstInvalid) {
          e.preventDefault();
          firstInvalid.focus();
          firstInvalid.scrollIntoView({ block: "center", behavior: "smooth" });
          return;
        }
        var message = form.getAttribute("data-ic-success");
        if (message) {
          e.preventDefault();
          toast(message, "success");
          form.reset();
          var modal = form.closest(".ic-modal");
          if (modal) closeModal(modal);
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
     Password show/hide
     ------------------------------------------------------------------------ */
  function initPasswordToggles() {
    $$("[data-ic-password-toggle]").forEach(function (btn) {
      var input = document.getElementById(btn.getAttribute("data-ic-password-toggle"));
      if (!input) return;
      btn.setAttribute("aria-pressed", "false");
      btn.addEventListener("click", function () {
        var show = input.type === "password";
        input.type = show ? "text" : "password";
        btn.setAttribute("aria-pressed", String(show));
        btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
      });
    });
  }

  /* ------------------------------------------------------------------------
     Small touches: greeting, progress bars, current year
     ------------------------------------------------------------------------ */
  function initGreeting() {
    var hour = new Date().getHours();
    var text = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
    $$("[data-ic-greeting]").forEach(function (el) {
      el.textContent = text;
    });
  }

  function initProgress() {
    var bars = $$("[data-ic-progress]");
    if (!bars.length) return;
    var set = function (bar) {
      var value = Math.max(0, Math.min(100, parseFloat(bar.getAttribute("data-ic-progress")) || 0));
      bar.style.width = value + "%";
      var track = bar.parentElement;
      if (track) {
        track.setAttribute("role", "progressbar");
        track.setAttribute("aria-valuemin", "0");
        track.setAttribute("aria-valuemax", "100");
        track.setAttribute("aria-valuenow", String(value));
      }
    };
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            set(entry.target);
            io.unobserve(entry.target);
          }
        });
      });
      bars.forEach(function (bar) { io.observe(bar); });
    } else {
      bars.forEach(set);
    }
  }

  function initYear() {
    $$("[data-ic-year]").forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  /* ------------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------------ */
  function init() {
    initSidebar();
    initActiveNav();
    initHeader();
    initTabs();
    initModals();
    initToastTriggers();
    initAlerts();
    initTables();
    initForms();
    initPasswordToggles();
    initGreeting();
    initProgress();
    initYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.InnatePortal = {
    toast: toast,
    openModal: openModal,
    closeModal: closeModal,
    refreshTables: initTables
  };
})();
