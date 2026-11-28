/* Mathe-Base – Zugang für Schüler der Emil-Petri-Schule Arnstadt
   Erstellt von Marion Klugmann (November 2026) mit freundlicher Unterstützung von Claude. */
(function () {
  var P = location.pathname;
  if (/^\/(lehrerzimmer\/|elterninfo)/.test(P)) return;

  var K = 'mb-zugang';
  var Z = 'b9bbe6e2f8add711ceb59a78ead68851f42105fdc85e13a0e5612bdefc075e6d';

  function hex(buf) {
    return Array.prototype.map.call(new Uint8Array(buf), function (b) {
      return ('0' + b.toString(16)).slice(-2);
    }).join('');
  }
  function sha(t) {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(t)).then(hex);
  }

  var gemerkt = null;
  try { gemerkt = localStorage.getItem(K); } catch (e) {}

  /* Seite sofort verdecken, bis der Zugang geprüft ist */
  var deck = document.createElement('style');
  deck.textContent = 'html{background:#0b0820!important}body{visibility:hidden!important}';
  (document.head || document.documentElement).appendChild(deck);

  var tor = null;
  function oeffnen() {
    if (deck.parentNode) deck.parentNode.removeChild(deck);
    if (tor && tor.parentNode) tor.parentNode.removeChild(tor);
    try { window.dispatchEvent(new Event('resize')); } catch (e) {}
  }

  function zeigeTor() {
    tor = document.createElement('mathe-base-tor');
    tor.setAttribute('style', 'position:fixed!important;inset:0!important;z-index:2147483647!important;display:block!important;visibility:visible!important');
    var r = tor.attachShadow ? tor.attachShadow({ mode: 'closed' }) : tor;
    r.innerHTML =
      '<style>' +
      '*{box-sizing:border-box;margin:0;padding:0}' +
      '.bg{position:fixed;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;' +
      'background:radial-gradient(circle at 50% 35%,#2a1a6e 0%,#0b0820 70%);color:#fff;font-family:"Segoe UI",system-ui,-apple-system,sans-serif;overflow:auto}' +
      'form{width:100%;max-width:440px;text-align:center;background:rgba(10,8,40,.78);border:1.5px solid rgba(120,220,255,.7);border-radius:22px;' +
      'padding:32px 26px 28px;box-shadow:0 0 28px rgba(120,220,255,.35)}' +
      '.schule{display:inline-block;border:1.5px solid rgba(120,220,255,.7);border-radius:999px;padding:6px 16px;font-weight:700;font-size:12px;letter-spacing:.14em;text-transform:uppercase}' +
      'h1{margin-top:18px;font-size:34px;line-height:1.1;text-shadow:0 0 18px #c06bff,0 0 40px #7a3cff}' +
      'p{margin-top:14px;font-size:17px;line-height:1.4}' +
      'input{display:block;width:100%;margin-top:22px;padding:14px 16px;font-size:22px;text-align:center;letter-spacing:.18em;border-radius:14px;' +
      'border:2px solid #67d8ff;background:#fff;color:#0b0820;outline:none;-webkit-text-security:disc}' +
      'input:focus{box-shadow:0 0 0 4px rgba(103,216,255,.35)}' +
      'button{margin-top:16px;width:100%;padding:14px;font-size:19px;font-weight:700;border:0;border-radius:14px;cursor:pointer;color:#0b0820;' +
      'background:linear-gradient(90deg,#40e0d0,#67d8ff);box-shadow:0 0 18px rgba(64,224,208,.5)}' +
      '.falsch{min-height:24px;margin-top:12px;color:#ffb3b3;font-weight:600}' +
      '.wackeln{animation:w .4s}@keyframes w{25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}' +
      '.fuss{position:fixed;right:16px;bottom:12px;left:16px;text-align:right;font-size:12px;color:rgba(255,255,255,.75)}' +
      '</style>' +
      '<div class="bg"><form autocomplete="off">' +
      '<div class="schule">Emil-Petri-Schule Arnstadt</div>' +
      '<h1>Mathe-Base</h1>' +
      '<p>Diese Lernplattform ist nur für Schüler der Emil‑Petri‑Schule Arnstadt.</p>' +
      '<input type="text" placeholder="Code eingeben" aria-label="Code" autocapitalize="characters" autocorrect="off" spellcheck="false">' +
      '<button type="submit">Los geht\'s</button>' +
      '<div class="falsch" role="alert"></div>' +
      '</form>' +
      '<div class="fuss">Erstellt von Marion Klugmann (November 2026) mit freundlicher Unterstützung von Claude.</div></div>';
    document.documentElement.appendChild(tor);

    var form = r.querySelector('form'), feld = r.querySelector('input'), falsch = r.querySelector('.falsch');
    setTimeout(function () { try { feld.focus(); } catch (e) {} }, 150);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var c = feld.value.toUpperCase().replace(/[\s\-]/g, '');
      sha('mb·' + c).then(function (t) {
        return sha(t).then(function (z) {
          if (z === Z) {
            try { localStorage.setItem(K, t); } catch (x) {}
            oeffnen();
          } else {
            falsch.textContent = 'Der Code stimmt leider nicht.';
            form.classList.remove('wackeln'); void form.offsetWidth; form.classList.add('wackeln');
            feld.select();
          }
        });
      })['catch'](function () {
        falsch.textContent = 'Bitte die Seite in Safari oder Chrome öffnen.';
      });
    });
  }

  if (gemerkt && window.crypto && crypto.subtle) {
    sha(gemerkt).then(function (z) { if (z === Z) oeffnen(); else zeigeTor(); }, zeigeTor);
  } else {
    zeigeTor();
  }

  /* Suchmaschinen sollen die Seiten nicht aufnehmen */
  var m = document.createElement('meta');
  m.name = 'robots'; m.content = 'noindex, nofollow';
  (document.head || document.documentElement).appendChild(m);
})();
