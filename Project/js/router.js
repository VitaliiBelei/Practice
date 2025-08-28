const app = document.getElementById("app");
const routes = new Set(['#/home', '#/recipes', '#/add', '#/favorites']);

function handleRoute() {
    const hash = window.location.hash;
    if (!hash || hash === '#') {
        window.location.replace('#/home');
        const hash = '#/home';
    }
    if (!routes.has(hash)) {
        app.innerHTML = `<h1>404</h1><p>Page not found</p>`;
        updateActiveNav(null);
        return;
    }
    
    render(hash);
    updateActiveNav(hash);
}

function render(hash) {
    switch (hash) {
    case "#/home":
        HomePage();
        break;
    case "#/recipes":
        RecipesPage();
        break;
    case "#/add":
        AddPage();
        break;
    case "#/favorites":
        FavoritesPage();
        break;
  }
}

function updateActiveNav(hash) {
    document.querySelectorAll('#nav a').forEach(a => {
        if (a.getAttribute('href') === hash) {
            a.classList.add('is-active');
            a.setAttribute('aria-current', 'page');
        } else {
            a.classList.remove('is-active');
            a.removeAttribute('aria-current');
        }
  });
}

window.addEventListener('load', handleRoute);
window.addEventListener('hashchange', handleRoute);