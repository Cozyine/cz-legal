
var yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


var hero = document.querySelector('.hero');
if (hero) requestAnimationFrame(function () { hero.classList.add('ready'); });


var tag = document.querySelector('.hero .tag');
if (tag && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  var accentWord = 'exploiters';
  var fullText = tag.textContent.trim();
  var head = fullText.slice(0, fullText.length - accentWord.length - 1);
  tag.innerHTML = '';
  var i = 0;
  var plainLen = fullText.length;
  var timer = setInterval(function () {
    i++;
    var shown = fullText.slice(0, i);
    if (i >= plainLen) {
      clearInterval(timer);
      tag.innerHTML = head + ' <span class="accent">' + accentWord + '</span>.';
    } else if (shown.length > head.length) {
      tag.innerHTML = head + ' <span class="accent">' + shown.slice(head.length + 1) + '</span>';
    } else {
      tag.textContent = shown;
    }
  }, 22);
}


var badge = document.querySelector('.badge');
if (badge) {
  var log = badge.querySelector('.changelog');
  // Keep the anchored dropdown fully on-screen: shift it left when the
  // badge sits mid-row (a full-width dropdown would otherwise spill past
  // the right edge). It stays attached under the badge bar.
  function placeLog() {
    if (!log) return;
    var m = 8;
    var b = badge.getBoundingClientRect();
    var w = Math.min(268, window.innerWidth - 44);
    var shift = (b.left + w) - (window.innerWidth - m);
    if (shift < 0) shift = 0;
    var maxShift = b.left - m;
    if (shift > maxShift) shift = maxShift > 0 ? maxShift : 0;
    log.style.marginLeft = shift ? (-shift) + 'px' : '';
  }
  function clearLog() { if (log) log.style.marginLeft = ''; }
  function toggleBadge() {
    badge.classList.toggle('pinned');
    if (badge.classList.contains('pinned')) placeLog();
    else clearLog();
  }
  badge.addEventListener('click', function (e) {
    e.stopPropagation();
    if (e.target.closest('.changelog')) return;
    toggleBadge();
  });
  badge.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleBadge();
    }
  });
  document.addEventListener('click', function () {
    badge.classList.remove('pinned');
    clearLog();
  });
  window.addEventListener('resize', function () {
    if (badge.classList.contains('pinned')) placeLog();
  });
}
