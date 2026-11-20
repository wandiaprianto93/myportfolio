/* =====================================================
   header.js : navbar bersama untuk semua halaman
   Mau menambah atau mengubah menu? Cukup edit array MENU di bawah.
   ===================================================== */
(function () {
  var WA_LINK = 'https://wa.me/6285250878278?text=Halo%20Borneo%20Tech%20Studio%2C%20saya%20ingin%20konsultasi%20pembuatan%20website%2Faplikasi%20untuk%20bisnis%20saya.';

  /* ---------- DAFTAR MENU (edit di sini) ---------- */
  // href: '#bagian' = bagian di beranda | 'nama-halaman' = file nama-halaman.html (tulis tanpa .html)
  var MENU = [
    { label: 'Layanan',    href: '#layanan' },
    { label: 'Cara kerja', href: '#proses' },
    { label: 'Portofolio', href: '#portofolio' },
    { label: 'Alat Bantu', children: [
      { label: 'PDF Tools (Gabung, Kompress, Edit, Gambar ke PDF)', href: 'pdf-tools' },
      { label: 'Hapus Background Foto',                             href: 'remove-background' },
      { label: 'Kompres & Ubah Ukuran Gambar',                      href: 'image-tools' },
      { label: 'Pas Foto (2x3, 3x4, 4x6)',                          href: 'pas-foto' },
      // { label: 'Perbaiki Foto Lama',                                href: 'restore-photo' }
    ] },
    { label: 'Tanya jawab', href: '#faq' }
  ];
  /* ------------------------------------------------ */

  var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>';
  var BURGER = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>';

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // Folder tempat header.js berada. Semua tautan dihitung dari sini, jadi tetap
  // benar walau situs ada di subfolder (misalnya localhost/myportfolio/).
  var me = document.currentScript;
  var BASE = (me && me.src) ? me.src.replace(/[^\/]*$/, '').replace(/[?#].*$/, '') : location.origin + '/';
  var BASE_PATH = BASE.replace(/^[a-z]+:\/\/[^\/]*/i, '');

  // PENGATURAN LOKAL
  // false = di localhost tautan tanpa .html (butuh .htaccess di XAMPP/Apache, atau 'vercel dev')
  // true  = di localhost tautan diberi .html (pakai ini kalau memakai VS Code Live Server)
  // Dibuka langsung lewat file:// selalu diberi .html. Di situs asli (Vercel) selalu tanpa .html.
  var LOCAL_PAKAI_HTML = false;
  var LOCAL = location.protocol === 'file:' ||
    (LOCAL_PAKAI_HTML && /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname));

  function url(href) {
    var i = href.indexOf('#');
    var page = i < 0 ? href : href.slice(0, i);
    var hash = i < 0 ? '' : href.slice(i);
    if (/^(https?:|mailto:|tel:)/.test(href)) return href;
    if (LOCAL) { if (!page) page = 'index.html'; else if (page.indexOf('.') < 0) page += '.html'; }
    return BASE + page + hash;
  }

  // halaman yang sedang dibuka, relatif terhadap folder situs ('' = beranda)
  var cur = location.pathname;
  if (cur.indexOf(BASE_PATH) === 0) cur = cur.slice(BASE_PATH.length);
  cur = cur.replace(/\.html$/, '').replace(/\/$/, '');
  if (cur === 'index') cur = '';
  function isCurrent(href) {
    return href.charAt(0) !== '#' && href.indexOf('#') < 0 && href.replace(/\.html$/, '') === cur;
  }

  var items = MENU.map(function (m, i) {
    if (m.children) {
      var id = 'dd' + i;
      return '<div class="dd">' +
        '<button type="button" class="dd-btn" aria-expanded="false" aria-controls="' + id + '">' + esc(m.label) + ARROW + '</button>' +
        '<ul class="dd-list" id="' + id + '" hidden>' +
        m.children.map(function (c) {
          return '<li><a href="' + esc(url(c.href)) + '"' + (isCurrent(c.href) ? ' aria-current="page"' : '') + '>' + esc(c.label) + '</a></li>';
        }).join('') +
        '</ul></div>';
    }
    return '<a href="' + esc(url(m.href)) + '"' + (isCurrent(m.href) ? ' aria-current="page"' : '') + '>' + esc(m.label) + '</a>';
  }).join('');

  var html =
    '<header class="top"><div class="hwrap">' +
    '<a href="' + esc(url('')) + '" class="brand"><img src="' + esc(BASE + 'img/logo.png') + '" alt="" width="46" height="38">Borneo Tech Studio</a>' +
    '<button class="menu-btn" id="menuBtn" type="button" aria-label="Buka menu" aria-expanded="false" aria-controls="mainNav">' + BURGER + '</button>' +
    '<nav class="main" id="mainNav">' + items +
    '<a class="nav-wa" href="' + WA_LINK + '" target="_blank" rel="noopener">Chat WhatsApp</a>' +
    '</nav></div></header>';

  // sisipkan tepat di tempat tag script ini ditulis (tanpa kedip)
  if (me && me.parentNode) me.insertAdjacentHTML('beforebegin', html);
  else document.body.insertAdjacentHTML('afterbegin', html);

  /* ---------- perilaku menu ---------- */
  var btn = document.getElementById('menuBtn');
  var nav = document.getElementById('mainNav');

  function setMenu(open) {
    nav.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  btn.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
  nav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });

  document.querySelectorAll('header.top .dd').forEach(function (dd) {
    var b = dd.querySelector('.dd-btn');
    var list = dd.querySelector('.dd-list');
    function setDd(open) {
      b.setAttribute('aria-expanded', open ? 'true' : 'false');
      list.hidden = !open;
    }
    b.addEventListener('click', function (e) {
      e.stopPropagation();
      setDd(b.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('click', function (e) { if (!list.contains(e.target)) setDd(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && b.getAttribute('aria-expanded') === 'true') { setDd(false); b.focus(); }
    });
  });
})();
