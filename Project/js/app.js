import {loadRecipes,toggleFavorite,deleteRecipe,updateRecipe} from "./store.js";

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
        card.dataset.id = recipe.id;
        const category = recipe.category.charAt(0).toUpperCase() + recipe.category.slice(1);

        card.innerHTML = `
        <h2>${recipe.title}</h2>
        <p>Category: ${category}</p>
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
            <option value="breakfasts">Breakfasts</option>
            <option value="dinners">Dinners</option>
            <option value="salads">Salads</option>
            <option value="soups">Soups</option>
            <option value="meat">Meat</option>
            <option value="fish">Fish</option>
        </select>
        <label><input type="checkbox" id="onlyFav"> Only favorites</label>
        </div>
        <div id="recipes"></div>
        <p id="counter"></p>
    `;

    const allRecipes = loadRecipes();
    renderRecipes(allRecipes);

    const searchForm = document.getElementById("searchForm")
    const category = document.getElementById("category");
    const onlyFav = document.getElementById("onlyFav");
    const search = document.getElementById("searchInput");  

    searchForm.addEventListener("submit", searchRecipe);
    onlyFav.addEventListener("change", searchRecipe);
    category.addEventListener("change", searchRecipe);
    search.addEventListener("input", searchRecipe);

    function searchRecipe (event) {
    if (event.type === "submit") {
        event.preventDefault();
    }
    const list = loadRecipes();
    const q = search.value.trim().toLowerCase();
    const filtered = list.filter(recipe => 
        (!onlyFav.checked || recipe.isFavorite)   &&
        (category.value === "all" || recipe.category === category.value) &&
        (q === "" || recipe.title.toLowerCase().includes(q))
    )
    renderRecipes(filtered);
    }

    const recipesContainer = document.getElementById("recipes");
    recipesContainer.addEventListener("click", event => {
        if (event.target.classList.contains("fav-btn")) {
            const article = event.target.closest("article");
            const id = article.dataset.id;

            toggleFavorite(id);
            searchRecipe({ type: "refresh", preventDefault(){} });
        }
    } );

    recipesContainer.addEventListener("click", event => {
        if (event.target.classList.contains("delete-btn")) {
            const article = event.target.closest("article");
            const id = article.dataset.id;
            if (confirm("Delete recipe?")) {
            deleteRecipe(id);
            searchRecipe({ type: "refresh", preventDefault(){} });
            }
        }
    } );

    recipesContainer.addEventListener("click", event => {
        if (event.target.classList.contains("edit-btn")) {
            const article = event.target.closest("article");
            const id = article.dataset.id;
            const recipe = allRecipes.find(recipe => recipe.id === id);
                               
            article.insertAdjacentHTML("afterend", 
            ` <form id="editForm-${id}">
                <label>
                    Title
                    <input id="editTitle-${id}" name="editTitle" value="${recipe.title}">
                </label>

                <label>
                    Time
                    <input id="editTime-${id}" name="editTime" type="number" min="0" value="${recipe.time}">
                </label>

                <label>
                    Category
                    <select id="editCategory-${id}" name="editCategory">
                        <option value="breakfasts">Breakfasts</option>
                        <option value="dinners">Dinners</option>
                        <option value="salads">Salads</option>
                        <option value="soups">Soups</option>
                        <option value="meat">Meat</option>
                        <option value="fish">Fish</option>
                    </select>
                </label>

                <button type="submit" id="editButton-${id}">Confirm</button>
            </form> `
            );

            const editForm = document.getElementById(`editForm-${id}`);
            const editTitle = document.getElementById(`editTitle-${id}`);
            const editTime = document.getElementById(`editTime-${id}`);
            const editCategory = document.getElementById(`editCategory-${id}`);
            editCategory.value = recipe.category; 

            editForm.addEventListener("submit", (event) => {                //доробити валідацію
            event.preventDefault();

            const patch = {
                title: editTitle.value.trim(),
                time: Number(editTime.value),
                category: editCategory.value,
            };


            if (!patch.title) {
                alert("Title is required");
            return;
            }

            updateRecipe(id, patch);

            searchRecipe({ type: "refresh", preventDefault(){} });

            editForm.remove();
});
            
        }
    })
}


export function homePage(){ document.getElementById("app").innerHTML="<h2>Home</h2>"; }
export function addPage(){ document.getElementById("app").innerHTML="<h2>Add</h2>"; }
export function favoritesPage(){ document.getElementById("app").innerHTML="<h2>Favorites</h2>"; }