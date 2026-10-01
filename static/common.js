(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  
  var bar = document.getElementById('progress');
  if (bar) {
    var ticking = false;
    function paintProgress() {
      var d = document.documentElement;
      var max = d.scrollHeight - d.clientHeight;
      var p = max > 0 ? d.scrollTop / max : 0;
      bar.style.transform = 'scaleX(' + p + ')';
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(paintProgress); }
    }, { passive: true });
    paintProgress();
  }

  var rootEl = document.documentElement;
  var accents = ['#C06030', '#3B82F6', '#22C55E', '#A855F7', '#EF4444'];
  var storedAccent = null;
  try { storedAccent = localStorage.getItem('cozine-accent'); } catch (e) {}

  var pinEl = document.querySelector('.badge-pin img');
  var pinPix = null, pinCtx = null, pinSize = 128, pinRaf = 0, pinHex = null;
  var pinBaseL = 0.299 * 207 + 0.587 * 102 + 0.114 * 45;
  function tintPin(hex) {
    if (!pinPix || !pinEl) return;
    var h = hex.replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var n = parseInt(h, 16);
    var ar = (n >> 16) & 255, ag = (n >> 8) & 255, ab = n & 255;
    var src = pinPix.data;
    var out = pinCtx.createImageData(pinSize, pinSize);
    var dst = out.data;
    for (var i = 0; i < src.length; i += 4) {
      var r = src[i], g = src[i + 1], b = src[i + 2], a = src[i + 3];
      var mx = r > g ? (r > b ? r : b) : (g > b ? g : b);
      var mn = r < g ? (r < b ? r : b) : (g < b ? g : b);
      var L = 0.299 * r + 0.587 * g + 0.114 * b;
      if (a === 0 || (mx - mn < 40 && L > 120)) {
        dst[i] = r; dst[i + 1] = g; dst[i + 2] = b; dst[i + 3] = a;
        continue;
      }
      var f = L / pinBaseL;
      var nr = ar * f, ng = ag * f, nb = ab * f;
      dst[i] = nr > 255 ? 255 : (nr + 0.5) | 0;
      dst[i + 1] = ng > 255 ? 255 : (ng + 0.5) | 0;
      dst[i + 2] = nb > 255 ? 255 : (nb + 0.5) | 0;
      dst[i + 3] = a;
    }
    pinCtx.putImageData(out, 0, 0);
    pinEl.src = pinCtx.canvas.toDataURL('image/png');
  }
  function scheduleTint(hex) {
    pinHex = hex;
    if (!pinPix || pinRaf) return;
    pinRaf = requestAnimationFrame(function () {
      pinRaf = 0;
      tintPin(pinHex);
    });
  }
  if (pinEl) {
    var pinSrc = new Image();
    pinSrc.onload = function () {
      var c = document.createElement('canvas');
      c.width = c.height = pinSize;
      pinCtx = c.getContext('2d');
      pinCtx.drawImage(pinSrc, 0, 0, pinSize, pinSize);
      pinPix = pinCtx.getImageData(0, 0, pinSize, pinSize);
      if (pinHex) scheduleTint(pinHex);
    };
    pinSrc.src = pinEl.src;
  }

  function applyAccent(hex) {
    var h = hex.replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var n = parseInt(h, 16);
    var r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    var l = [r, g, b].map(function (v) { return Math.round(v + (255 - v) * 0.45); });
    rootEl.style.setProperty('--accent', hex);
    rootEl.style.setProperty('--accent-2', 'rgb(' + l.join(',') + ')');
    rootEl.style.setProperty('--accent-soft', 'rgba(' + r + ',' + g + ',' + b + ',.16)');
    rootEl.style.setProperty('--accent-glow', 'rgba(' + r + ',' + g + ',' + b + ',.45)');
    rootEl.style.setProperty('--accent-glow-soft', 'rgba(' + r + ',' + g + ',' + b + ',0)');
    var dot = document.querySelector('.color-btn .dot-preview');
    if (dot) dot.style.background = hex;
    document.querySelectorAll('.swatch[data-color]').forEach(function (s) {
      s.classList.toggle('active', s.getAttribute('data-color').toLowerCase() === hex.toLowerCase());
    });
    scheduleTint(hex);
  }
  function saveAccent(hex) {
    applyAccent(hex);
    try { localStorage.setItem('cozine-accent', hex); } catch (e) {}
  }
  if (storedAccent) applyAccent(storedAccent);
  var tog0 = document.getElementById('themeToggle');
  if (tog0) {
    var wrap = document.createElement('span');
    wrap.className = 'color-wrap';
    var cBtn = document.createElement('button');
    cBtn.id = 'colorBtn';
    cBtn.className = 'color-btn';
    cBtn.setAttribute('aria-label', 'Change accent color');
    cBtn.innerHTML = '<span class="dot-preview"></span>';
    wrap.appendChild(cBtn);
    var pop = document.createElement('div');
    pop.className = 'color-pop';
    pop.id = 'colorPop';
    var custom = document.createElement('label');
    custom.className = 'swatch-custom';
    custom.title = 'Custom color';
    var picker = document.createElement('input');
    picker.type = 'color';
    picker.setAttribute('aria-label', 'Custom accent color');
    picker.addEventListener('input', function () { saveAccent(picker.value); });
    custom.appendChild(picker);
    pop.appendChild(custom);
    accents.forEach(function (hex) {
      var s = document.createElement('button');
      s.type = 'button';
      s.className = 'swatch';
      s.setAttribute('data-color', hex);
      s.style.background = hex;
      s.setAttribute('aria-label', 'Accent ' + hex);
      s.addEventListener('click', function () { saveAccent(hex); });
      pop.appendChild(s);
    });
    wrap.appendChild(pop);
    tog0.insertAdjacentElement('afterend', wrap);
    applyAccent(storedAccent || '#C06030');
    cBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      pop.classList.toggle('open');
    });
    document.addEventListener('click', function (e) {
      if (!pop.contains(e.target)) pop.classList.remove('open');
    });
  }

  
  var root = document.body;
  try {
    if (localStorage.getItem('cozine-theme') === 'light') root.classList.add('light');
  } catch (e) {}
  var tog = document.getElementById('themeToggle');
  if (tog) {
    tog.addEventListener('click', function () {
      var light = !root.classList.contains('light');
      var r = tog.getBoundingClientRect();
      document.documentElement.style.setProperty('--vx', (r.left + r.width / 2) + 'px');
      document.documentElement.style.setProperty('--vy', (r.top + r.height / 2) + 'px');
      function apply() {
        root.classList.toggle('light', light);
        try { localStorage.setItem('cozine-theme', light ? 'light' : 'dark'); } catch (e) {}
      }
      if (document.startViewTransition && !reduce) {
        document.startViewTransition(apply);
      } else {
        apply();
      }
    });
  }

  
  var btns = document.querySelectorAll('a.btn');
  btns.forEach(function (btn) {
    if (!reduce) {
      btn.addEventListener('click', function (e) {
        var r = btn.getBoundingClientRect();
        var size = Math.max(r.width, r.height);
        var s = document.createElement('span');
        s.className = 'ripple';
        s.style.width = s.style.height = size + 'px';
        s.style.left = (e.clientX - r.left - size / 2) + 'px';
        s.style.top = (e.clientY - r.top - size / 2) + 'px';
        btn.appendChild(s);
        setTimeout(function () { s.remove(); }, 600);
      });
    }
  });
})();
