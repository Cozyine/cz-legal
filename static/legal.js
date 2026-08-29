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

function tabBase() {
    const path = window.location.pathname;
    let base = path.endsWith('/') ? path.slice(0, -1) : path;
    return base.replace(/\/[^/]*$/, '');
}

function goToTab(target) {
    switchTab(target);
    history.pushState(null, '', tabBase() + '/' + target);
}

buttons.forEach(button => {
    button.addEventListener('click', () => goToTab(button.dataset.target));
});

const path = window.location.pathname;
if (path.endsWith('/tos') || path.endsWith('/tos/')) {
    switchTab('tos');
} else {
    switchTab('privacy');
}
