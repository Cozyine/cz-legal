// footer year
var yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// staggered hero entrance
var hero = document.querySelector('.hero');
if (hero) requestAnimationFrame(function () { hero.classList.add('ready'); });

// typewriter tagline (skipped under reduced motion)
var tag = document.querySelector('.hero .tag');
if (tag && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  var text = tag.textContent.trim();
  tag.textContent = '';
  var i = 0;
  var timer = setInterval(function () {
    tag.textContent = text.slice(0, i++);
    if (i > text.length) {
      clearInterval(timer);
      tag.innerHTML = 'A simple tool for server mods to flag and catch roblox <span class="accent">exploiters</span>.';
    }
  }, 22);
}

// click-to-pin the changelog badge
var badge = document.querySelector('.badge');
if (badge) {
  badge.addEventListener('click', function (e) {
    e.stopPropagation();
    if (e.target.closest('.changelog')) return;
    badge.classList.toggle('pinned');
  });
  badge.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      badge.classList.toggle('pinned');
    }
  });
  document.addEventListener('click', function () {
    badge.classList.remove('pinned');
  });
}
