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

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const target = button.dataset.target;
        switchTab(target);
        history.pushState(null, '', '/' + target);
    });
});

const path = window.location.pathname;
if (path.endsWith('/tos') || path.endsWith('/tos/')) {
    switchTab('tos');
} else {
    switchTab('privacy');
}
