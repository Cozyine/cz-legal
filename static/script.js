
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
