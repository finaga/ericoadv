/* ════════════════════════════════════════════════════════════════════
   hubbar.js — shared "preview" chrome for pages reached through the hub
   ────────────────────────────────────────────────────────────────────
   A slim fixed bar pinned to the top of any deliverable page (Site A,
   Site B, Downloads, Estratégia, Manual) with a "back to hub" button and
   the current section name. It only appears when the visitor arrived via
   the hub (index.html sets a session flag), so the production firm site
   at erico.law — reached directly — never shows it.

   Per-page wiring lives entirely on the <script> tag, e.g.:
     <script src="hubbar.js"
             data-section="Site B"          (label shown on the right)
             data-offset=".nav,.progress"   (top:0 chrome → snap to bar bottom)
             data-shift=".toggle"           (inset corner pills → shift down,
                                             keeping their original gap)
             data-hide=".back-home"></script>(redundant chrome to hide)

   This file is the ONE allowed shared front-end asset; every deployed
   page is otherwise self-contained (see CLAUDE.md).
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* capture our own <script> synchronously (valid during parse) */
  var me = document.currentScript;
  if (!me) return;

  /* ── gate: show on every staging/preview page, hide only in production ──
     The bar is approval-space chrome. It must NEVER appear on the public
     firm site at erico.law, but should show on EVERY other host
     (ericoadv.vercel.app, *.vercel.app previews, localhost). This mirrors
     the host-scoped noindex in vercel.json. An explicit ?nohub param force-
     hides it for screenshots. */
  var PROD_HOSTS = ['erico.law', 'www.erico.law'];
  if (PROD_HOSTS.indexOf(location.hostname) !== -1) return;
  try { if (new URLSearchParams(location.search).has('nohub')) return; } catch (e) {}

  var section = me.getAttribute('data-section') || document.title || '';
  var offsetSel = me.getAttribute('data-offset') || '';  /* top:0 chrome → snap to bar bottom */
  var shiftSel = me.getAttribute('data-shift') || '';    /* inset pills → shift down, keep their gap */
  var hideSel = me.getAttribute('data-hide') || '';
  var BAR_H = 44;

  function whenBody(fn) {
    if (document.body) return fn();
    document.addEventListener('DOMContentLoaded', fn);
  }

  whenBody(function () {
    var root = document.documentElement;
    root.classList.add('has-hubbar');

    /* ── inject brand fonts (cheap, deduped by URL) ────────────────── */
    if (!document.querySelector('link[data-hubbar-font]')) {
      var fl = document.createElement('link');
      fl.rel = 'stylesheet';
      fl.setAttribute('data-hubbar-font', '');
      fl.href = 'https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=Inter:wght@400;500&display=swap';
      document.head.appendChild(fl);
    }

    /* ── styles: the bar + the layout accommodation ────────────────── */
    var css = [
      'html.has-hubbar{--hubbar-h:' + BAR_H + 'px;}',
      'html.has-hubbar body{padding-top:var(--hubbar-h)!important;}'
    ];
    offsetSel.split(',').forEach(function (s) {
      s = s.trim(); if (s) css.push('html.has-hubbar ' + s + '{top:var(--hubbar-h)!important;}');
    });
    shiftSel.split(',').forEach(function (s) {
      s = s.trim(); if (s) css.push('html.has-hubbar ' + s + '{margin-top:var(--hubbar-h)!important;}');
    });
    hideSel.split(',').forEach(function (s) {
      s = s.trim(); if (s) css.push('html.has-hubbar ' + s + '{display:none!important;}');
    });
    css.push(
      '.hubbar{position:fixed;top:0;left:0;right:0;height:var(--hubbar-h);' +
        'z-index:2147483000;display:flex;align-items:center;justify-content:space-between;' +
        'gap:16px;padding:0 clamp(12px,4vw,24px);box-sizing:border-box;' +
        'background:#1A1A19;color:rgba(243,242,238,.94);' +
        'border-bottom:1px solid rgba(243,242,238,.14);' +
        "font-family:'Inter',system-ui,-apple-system,sans-serif;" +
        '-webkit-font-smoothing:antialiased;' +
        'transform:translateY(-101%);transition:transform .55s cubic-bezier(.22,1,.36,1);}',
      '.hubbar.is-in{transform:translateY(0);}',
      '.hubbar__back{display:inline-flex;align-items:center;gap:8px;flex-shrink:0;' +
        'font-size:12px;font-weight:500;letter-spacing:.02em;line-height:1;' +
        'color:rgba(243,242,238,.94);text-decoration:none;' +
        'padding:7px 14px 7px 11px;border:1px solid rgba(243,242,238,.22);border-radius:999px;' +
        'transition:background .25s,border-color .25s;}',
      '.hubbar__back:hover{background:rgba(243,242,238,.10);border-color:rgba(243,242,238,.42);}',
      '.hubbar__back svg{width:13px;height:13px;display:block;transition:transform .25s cubic-bezier(.22,1,.36,1);}',
      '.hubbar__back:hover svg{transform:translateX(-3px);}',
      '.hubbar__sec{display:inline-flex;align-items:center;gap:10px;min-width:0;' +
        'font-size:11px;letter-spacing:.16em;text-transform:uppercase;' +
        'color:rgba(243,242,238,.55);white-space:nowrap;}',
      '.hubbar__sec b{font-family:\'Syne\',\'Inter\',system-ui,sans-serif;font-weight:700;' +
        'font-size:13px;letter-spacing:.01em;text-transform:none;color:#F3F2EE;}',
      '.hubbar__dot{width:5px;height:5px;border-radius:50%;background:#B28C4D;flex-shrink:0;}',
      '.hubbar__eyebrow{}',
      '@media (max-width:520px){.hubbar__eyebrow{display:none;}.hubbar__sec{letter-spacing:.1em;}}',
      '@media (prefers-reduced-motion:reduce){.hubbar{transition:none;}.hubbar__back svg{transition:none;}}'
    );
    var style = document.createElement('style');
    style.setAttribute('data-hubbar', '');
    style.textContent = css.join('');
    document.head.appendChild(style);

    /* ── the bar itself ────────────────────────────────────────────── */
    var bar = document.createElement('div');
    bar.className = 'hubbar';
    bar.setAttribute('role', 'navigation');
    bar.setAttribute('aria-label', 'Pré-visualização — voltar ao hub');

    var back = document.createElement('a');
    back.className = 'hubbar__back';
    back.href = 'index.html';
    back.setAttribute('aria-label', 'Voltar ao hub do projeto');
    back.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M15 5l-7 7 7 7"/></svg>Voltar ao hub';

    var sec = document.createElement('span');
    sec.className = 'hubbar__sec';
    sec.innerHTML =
      '<span class="hubbar__dot" aria-hidden="true"></span>' +
      '<span class="hubbar__eyebrow">Pré-visualização</span><b></b>';
    sec.querySelector('b').textContent = section;

    bar.appendChild(back);
    bar.appendChild(sec);
    document.body.insertBefore(bar, document.body.firstChild);

    /* ── reveal once the page's own loader has cleared ─────────────── */
    var revealed = false;
    function reveal() {
      if (revealed) return;
      revealed = true;
      bar.classList.add('is-in');
      /* page may use ScrollTrigger; the added top padding changed layout */
      if (window.ScrollTrigger && typeof window.ScrollTrigger.refresh === 'function') {
        window.ScrollTrigger.refresh();
      }
    }
    if (document.readyState === 'complete') { setTimeout(reveal, 220); }
    else { window.addEventListener('load', function () { setTimeout(reveal, 220); }); }
    setTimeout(reveal, 2600); /* fallback — never depend solely on load */
  });
})();
