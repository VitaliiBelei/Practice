import {loadRecipes} from "./store.js";

function renderRecipes(recipes) {
    const container = document.getElementById("recipes");
    if (!container) return;

    container.innerHTML ="";

    if (!recipes || recipes.length === 0) {
        container.innerHTML = `<p>Немає рецептів</p>`;
        const c = document.getElementById("counter");
    if (c) c.textContent = "Знайдено: 0";
    return;
    }

    recipes.forEach(recipe => {
        const card = document.createElement("article");
        card.classList.add("recipe-card");

        card.innerHTML = `
        <h2>${recipe.title}</h2>
        <p>Category: ${recipe.category}</p>
        <p>Time: ${recipe.time}</p>
        <button class="fav-btn">${recipe.isFavorite ? "★" : "☆"}</button>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
        `;

        container.appendChild(card);
    })
    const c = document.getElementById("counter");
    if (c) c.textContent = `Знайдено: ${recipes.length}`;
}

export function recipesPage() {
    const app = document.getElementById("app");
    app.innerHTML = `
        <div id="controls">
            <form id="searchForm">
                <input type="text" id="searchInput" placeholder="Recipe">
                <button type="submit">Search</button>
            </form>
        <select id="category">
            <option value="all">All categories</option>
        </select>
        <label><input type="checkbox" id="onlyFav"> Only favorites</label>
        </div>
        <div id="recipes"></div>
        <p id="counter"></p>
    `;

    const allRecipes = loadRecipes();
    renderRecipes(allRecipes);
}

export function homePage(){ document.getElementById("app").innerHTML="<h2>Home</h2>"; }
export function addPage(){ document.getElementById("app").innerHTML="<h2>Add</h2>"; }
export function favoritesPage(){ document.getElementById("app").innerHTML="<h2>Favorites</h2>"; }