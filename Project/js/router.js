import {recipesPage, profilePage, addPage, homePage, homeLogin} from "./app.js";

const app = document.getElementById("app");
const routes = new Set(['#/home', '#/homeLogin', '#/recipes', '#/add', '#/profile']);

function handleRoute() {
    const hash = window.location.hash.split('?')[0]; // Remove URL parameters for route matching
    if (!hash || hash === '#') {
        window.location.replace('#/home');
        return;
    }
    if (!routes.has(hash)) {
        app.innerHTML = `<h1>404</h1><p>Page not found</p>`;
        updateActiveNav(null);
        return;
    }
    
    render(hash);
    setTimeout(() => updateActiveNav(hash), 10);
}

async function render(hash) {
    switch (hash) {
        case "#/home":
            homePage();
            break;
        case "#/homeLogin":
            await homeLogin();
            break;
        case "#/recipes":
            await recipesPage();
            break;
        case "#/add":
            await addPage();
            break;
        case "#/profile":
            await profilePage();
            break;
        default:
            app.innerHTML = "<h1>404</h1><p>Page not found</p>";
    }
}

function updateActiveNav(hash) {
    const nav = document.getElementById('nav');
    if (!nav) return;
    nav.querySelectorAll('a').forEach(a => {
        const href = a.getAttribute('href');
        if (href !== hash) {
            a.classList.remove('is-active');
            a.removeAttribute('aria-current');
            return;
        }
        a.classList.add('is-active');
        a.setAttribute('aria-current', 'page');
    });
}

window.addEventListener('load', handleRoute);
window.addEventListener('hashchange', handleRoute);