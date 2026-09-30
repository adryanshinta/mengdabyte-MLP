/* ==========================================================================
   Mengdabyte — app.js
   Berisi: konfigurasi, daftar harga, dan cek masa aktif.
   ========================================================================== */
(function (window, document) {
  'use strict';

  /* ------------------------------------------------------------------
     1) KONFIGURASI — ubah bagian ini sesuai kebutuhan
     ------------------------------------------------------------------ */
  var config = {
    name: 'Mengdabyte',

    // Daftar paket voucher. Kosongkan array ([]) bila tidak ingin menampilkan.
    packages: [
      { name: 'Voucher 1 Jam',   price: 'Rp 2.000',  note: 'Cocok untuk cek email' },
      { name: 'Voucher 1 Hari',  price: 'Rp 5.000',  note: 'Unlimited' },
      { name: 'Voucher 3 Hari',  price: 'Rp 12.000', note: 'Hemat' },
      { name: 'Voucher 7 Hari',  price: 'Rp 25.000', note: 'Paling laris' },
      { name: 'Voucher 30 Hari', price: 'Rp 80.000', note: 'Paket bulanan' }
    ],

    // Layanan cek masa aktif (opsional).
    // PENTING: ganti `endpoint` dengan milik Anda, atau set enabled:false.
    // Kosongkan endpoint / set enabled:false untuk menonaktifkan.
    validity: {
      enabled: true,
      endpoint: 'https://desadigital.mikhmon.online/status/status.php',
      session: 'DesaDigital',
      timeoutMs: 6000,
      unavailableText: 'Tidak tersedia'
    }
  };

  /* ------------------------------------------------------------------
     2) Utilitas kecil
     ------------------------------------------------------------------ */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* ------------------------------------------------------------------
     3) Daftar harga
     ------------------------------------------------------------------ */
  function renderPrices() {
    var mount = $('[data-prices]');
    if (!mount || !config.packages || !config.packages.length) return;

    var rows = config.packages.map(function (p) {
      return '<tr>' +
        '<td class="pkg">' + escapeHtml(p.name) + '</td>' +
        '<td class="price-col">' + escapeHtml(p.price) + '</td>' +
        '<td>' + (p.note ? '<span class="badge">' + escapeHtml(p.note) + '</span>' : '') + '</td>' +
      '</tr>';
    }).join('');

    mount.innerHTML =
      '<table class="price">' +
        '<thead><tr><th>Paket</th><th>Harga</th><th>Keterangan</th></tr></thead>' +
        '<tbody>' + rows + '</tbody>' +
      '</table>';
  }

  /* ------------------------------------------------------------------
     4) Cek masa aktif (opsional, gagal dengan aman)
     ------------------------------------------------------------------ */
  function checkValidity() {
    var host = $('[data-validity]');
    if (!host) return;

    var v = config.validity || {};
    var user = (host.getAttribute('data-validity-user') || '').trim();
    var fallback = v.unavailableText || 'Tidak tersedia';

    if (!v.enabled || !v.endpoint || !user) {
      host.textContent = fallback;
      return;
    }

    var url = v.endpoint +
      (v.endpoint.indexOf('?') === -1 ? '?' : '&') +
      'name=' + encodeURIComponent(user) +
      (v.session ? '&session=' + encodeURIComponent(v.session) : '');

    // iframe transparan: hanya teks dari layanan yang tampak, tanpa kotak putih
    // / ikon gambar-rusak ketika layanan tidak dapat dimuat.
    var iframe = document.createElement('iframe');
    iframe.setAttribute('scrolling', 'no');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allowtransparency', 'true');
    iframe.style.cssText =
      'width:100%;height:26px;border:0;background:transparent;' +
      'color-scheme:normal;filter:none;';
    iframe.title = 'Masa aktif';

    var done = false;
    function fail() {
      if (done) return;
      done = true;
      clearTimeout(timer);
      if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
      host.textContent = fallback;
    }

    var timer = setTimeout(fail, v.timeoutMs || 6000);

    iframe.addEventListener('load', function () {
      if (done) return;
      // Deteksi halaman error browser (about:blank / error page) via ukuran konten.
      try {
        var d = iframe.contentDocument;
        if (d && (d.location.href === 'about:blank' || !d.body || d.body.childNodes.length === 0)) {
          fail();
          return;
        }
      } catch (e) {
        // cross-origin: berarti benar-benar termuat dari server, anggap sukses
      }
      done = true;
      clearTimeout(timer);
    });
    iframe.addEventListener('error', fail);

    host.textContent = '';
    host.appendChild(iframe);
    iframe.src = url;
  }

  /* ------------------------------------------------------------------
     5) Inisialisasi
     ------------------------------------------------------------------ */
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  ready(function () {
    renderPrices();
    checkValidity();

    // Judul tab: nama host + halaman
    var titleEl = document.getElementById('title');
    if (titleEl && document.body.hasAttribute('data-page')) {
      titleEl.textContent = window.location.hostname + ' > ' + document.body.getAttribute('data-page');
    }
  });

  // Ekspos agar bisa dipakai inline script / dikustom
  window.Mengdabyte = { config: config, renderPrices: renderPrices };
})(window, document);
