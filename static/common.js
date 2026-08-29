(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // scroll progress bar (rAF-throttled)
  var bar = document.getElementById('progress');
  if (bar) {
    var ticking = false;
    function paint() {
      var d = document.documentElement;
      var max = d.scrollHeight - d.clientHeight;
      var p = max > 0 ? d.scrollTop / max : 0;
      bar.style.transform = 'scaleX(' + p + ')';
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(paint); }
    }, { passive: true });
    paint();
  }

  // theme toggle (persisted) with circular reveal
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

  // logo 3D tilt
  var ring = document.querySelector('.logo-ring');
  if (ring && !reduce) {
    ring.parentElement.style.perspective = '600px';
    ring.addEventListener('mousemove', function (e) {
      var r = ring.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      ring.style.transform = 'rotateY(' + (x * 16) + 'deg) rotateX(' + (-y * 16) + 'deg)';
    });
    ring.addEventListener('mouseleave', function () { ring.style.transform = ''; });
  }

  // button ripple
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
