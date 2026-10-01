/* Innate Chiropractic portal (Brand Guide v1): Book a Visit links. Paste into Custom JS. */
(function () {
  var DEEP_BLUE = '#001446', SKY_BLUE = '#00A6FF', BLUE = '#0086CB', SEAFOAM = '#00E1EF';
  var LINKS = [
    ['Schedule Appointment', 'https://innatechiropractic.org/schedule-appointment/'],
    ['Existing Patient', 'https://appointment.innatechiropractic.org/existing-patient-appointment'],
    ['Dry Needling', 'https://appointment.innatechiropractic.org/functional-dry-needling'],
    ['Class 4 Laser Therapy', 'https://appointment.innatechiropractic.org/class-4-laser-therapy'],
    ['Call or Text 603-542-7726', 'tel:+16035427726'],
    ['Office Hours', 'https://innatechiropractic.org/opening-hours/']
  ];
  var MENU_COUNT = 4;

  function go(url) {
    if (url.indexOf('tel:') === 0) location.href = url;
    else window.open(url, '_blank');
  }

  function findText(label) {
    var all = document.querySelectorAll('span, p, div, a');
    for (var i = 0; i !== all.length; i++) {
      var t = all[i].children.length === 0 ? all[i].textContent.trim() : '';
      if (t === label || (label.slice(-1) === '*' ? t.indexOf(label.slice(0, -1)) === 0 : false)) {
        if (!all[i].closest('[data-ic]')) return all[i];
      }
    }
    return null;
  }

  function rowOf(el) {
    while (el.parentElement ? el.parentElement.textContent.trim() === el.textContent.trim() : false) {
      el = el.parentElement;
    }
    return el;
  }

  function findLeaf(el) {
    var leaf = el;
    var all = el.querySelectorAll('*');
    for (var i = 0; i !== all.length; i++) {
      if (all[i].children.length === 0 ? all[i].textContent.trim() !== '' : false) leaf = all[i];
    }
    return leaf;
  }

  function addMenu() {
    if (document.querySelector('[data-ic="menu"]')) return;
    var label = findText('Shared files') || findText('Invoices');
    var head = findText('Business*') || findText('Finances');
    if (!label) return;
    var row = rowOf(label);
    var box = document.createElement('div');
    box.setAttribute('data-ic', 'menu');
    box.style.marginTop = '16px';
    if (head) { var h = rowOf(head).cloneNode(true); findLeaf(h).textContent = 'Book a Visit'; box.appendChild(h); }
    LINKS.slice(0, MENU_COUNT).forEach(function (l) {
      var r = row.cloneNode(true);
      findLeaf(r).textContent = l[0];
      r.style.cursor = 'pointer';
      r.style.color = DEEP_BLUE;
      r.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); go(l[1]); });
      box.appendChild(r);
    });
    row.parentElement.appendChild(box);
  }

  function addButton() {
    if (document.getElementById('ic-fab')) return;
    var font = "'Roboto Condensed', Arial, sans-serif";
    var wrap = document.createElement('div');
    wrap.id = 'ic-fab';
    wrap.setAttribute('data-ic', 'fab');
    wrap.style.cssText = 'position:fixed;left:16px;bottom:16px;z-index:2147483000';
    var menu = document.createElement('div');
    menu.style.cssText = 'display:none;margin-bottom:10px;background:#fff;border-radius:10px;overflow:hidden;' +
      'width:260px;max-width:calc(100vw - 32px);box-shadow:0 8px 28px rgba(0,20,70,.25);' +
      'border-top:4px solid ' + SKY_BLUE + ';font-family:' + font;
    LINKS.forEach(function (l, i) {
      var a = document.createElement('div');
      a.textContent = l[0];
      a.style.cssText = 'padding:12px 16px;cursor:pointer;font-size:15px;border-bottom:1px solid #eee;' +
        'color:' + (i === 0 ? '#fff' : DEEP_BLUE) + ';background:' + (i === 0 ? BLUE : '#fff') +
        ';font-weight:' + (i === 0 ? '700' : '400');
      a.onclick = function () { go(l[1]); };
      menu.appendChild(a);
    });
    var btn = document.createElement('button');
    btn.textContent = 'Book a Visit';
    btn.style.cssText = 'background:linear-gradient(135deg,' + DEEP_BLUE + ' 0%,' + BLUE + ' 70%,' + SKY_BLUE + ' 100%);' +
      'color:#fff;border:none;border-radius:999px;padding:13px 22px;font-size:16px;font-weight:700;' +
      'letter-spacing:.3px;cursor:pointer;box-shadow:0 4px 14px rgba(0,20,70,.3);font-family:' + font +
      ';border-bottom:3px solid ' + SEAFOAM;
    btn.onclick = function (e) {
      e.stopPropagation();
      menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    };
    document.addEventListener('click', function () { menu.style.display = 'none'; });
    wrap.appendChild(menu);
    wrap.appendChild(btn);
    document.body.appendChild(wrap);
  }

  function run() {
    try { addMenu(); addButton(); } catch (err) { console.warn('Innate JS', err); }
    var fab = document.getElementById('ic-fab');
    var hasMenu = document.querySelector('[data-ic="menu"]');
    if (fab) fab.style.display = (hasMenu ? matchMedia('(min-width: 1024px)').matches : false) ? 'none' : 'block';
  }

  setInterval(run, 1000);
  run();
})();
