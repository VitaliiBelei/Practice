
window.addEventListener("hashchange", hashChange);
function hashChange() {
    const hash = window.location.hash;
    if (hash !== "") {
        render(hash);
    } else {
        render("#/home");
    }
}
function render(hash) {

    switch (hash) {
    case "#/home":
      HomePage();
      break;
    case "#/about":
      AboutPage();
      break;
    case "#/profile":
      ProfilePage();
      break;
    default:
      app.innerHTML = `<h1>404</h1><p>Сторінку не знайдено</p>`;
  }
}
const app = document.getElementById("app");
function HomePage() {
    app.innerHTML = `
        <h1>Home page</h1>
        <p>Information</p>
    `;
}
function AboutPage() {
    app.innerHTML = `
        <h1>About page</h1>
        <p>Information</p>
    `;
}
function ProfilePage() {
    app.innerHTML = `
        <h1>Profile page</h1>
        <p>Information</p>
    `;
}

hashChange();