const buttons = document.querySelectorAll('.nav-btn');
const contents = document.querySelectorAll('.content');

function switchTab(tabId) {
    buttons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.target === tabId);
    });
    contents.forEach(content => {
        content.classList.toggle('active', content.id === tabId);
    });
    window.scrollTo(0, 0);
}

function pathToTab() {
    const path = window.location.pathname.split('?')[0].split('#')[0];
    if (path.endsWith('/api-tos') || path.endsWith('/api-tos/')) return 'api-tos';
    if (path.endsWith('/tos') || path.endsWith('/tos/')) return 'tos';
    if (path.endsWith('/privacy') || path.endsWith('/privacy/')) return 'privacy';
    return null;
}

function initReveal() {
    document.body.classList.add('js-reveal');
    const revealEls = document.querySelectorAll('.legal .content h2, .legal .content p, .legal .content ul, .legal .content .highlight');
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (en.isIntersecting) {
                    en.target.classList.add('reveal-in');
                    io.unobserve(en.target);
                }
            });
        }, { threshold: 0.12 });
        revealEls.forEach(function (el) { io.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add('reveal-in'); });
    }
}

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const target = button.dataset.target;
        switchTab(target);
        // Subpath-safe: swap last path segment so project pages
        // (/repo/tos/) stay under /repo/ instead of jumping to domain root.
        try {
            const parts = window.location.pathname.replace(/\/$/, '').split('/');
            parts[parts.length - 1] = target;
            history.pushState(null, '', parts.join('/') + '/');
        } catch (_) {}
    });
});

// Resolve static/ relative to THIS script's own URL — immune to page depth,
// project subpaths, custom domains, and trailing-slash redirects.
function staticUrl(name) {
    try {
        const src = document.currentScript && document.currentScript.src;
        if (src) return new URL('./' + name, src).href;
    } catch (_) {}
    return new URL('../static/' + name, window.location.href).href;
}

window.addEventListener('popstate', () => {
    const t = pathToTab();
    if (t && document.getElementById(t)) switchTab(t);
});

async function loadLegal() {
    // NOTE: no absolute '/static/...' fallback — on project pages
    // (user.github.io/repo/) that resolves to the domain root and can 404
    // or load the wrong file. Script-relative URL is exact; page-relative
    // is the backup.
    const urls = [staticUrl('legal.json'), '../static/legal.json'];
    let data = null;
    for (const u of urls) {
        try {
            const res = await fetch(u, { cache: 'no-store' });
            if (res.ok) { data = await res.json(); break; }
        } catch (_) {}
    }
    if (!data) {
        contents.forEach(c => { c.innerHTML = '<p>Failed to load content. Check your connection and refresh.</p>'; });
    } else {
        for (const id of ['privacy','tos','api-tos']) {
            const el = document.getElementById(id);
            if (el && data[id]) el.innerHTML = data[id];
        }
    }
    // ALWAYS activate a tab — even on fetch failure — so the page is never
    // blank (.content is display:none until .active is set).
    const initial = pathToTab();
    if (initial && document.getElementById(initial)) {
        switchTab(initial);
    } else if (window.location.pathname.includes('/tos')) {
        switchTab('tos');
    } else {
        switchTab('privacy');
    }
    initReveal();
}

loadLegal();
