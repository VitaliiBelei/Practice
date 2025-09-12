import {loadRecipes, addRecipe} from "./store.js";
import {recipeFormHTML, recipeFormButtons, editFormAdd, collectIngredients, collectSteps} from "./ui/recipeForm.js";
import {recipeCard} from "./ui/recipeCard.js";
import {validateRecipe} from "./ui/validation.js";


// Render recipes to the #recipes container
function renderRecipes(recipes) {
    const container = document.getElementById("recipes");
    if (!container) return;

    container.innerHTML ="";

    if (!recipes || recipes.length === 0) {
        container.innerHTML = `<p>No recipes</p>`;
        const c = document.getElementById("counter");
    if (c) c.textContent = "Find: 0";
    return;
    }

    container.innerHTML = recipes.map(recipeCard).join("");

    const c = document.getElementById("counter");
    if (c) c.textContent = `Find: ${recipes.length}`;
}


// Pages
export function recipesPage() {                        
    const app = document.getElementById("app");
    app.innerHTML = `
        <div id="controls">
            <form id="searchForm">
                <label for="searchInput">
                    Search recipes
                    <input type="text" id="searchInput" placeholder="Recipe">
                </label>
                <button type="reset" id="resetBtn">Reset</button>
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
        <p id="counter" aria-live="polite"></p>
    `;

    const allRecipes = loadRecipes();
    renderRecipes(allRecipes);

    const searchForm = document.getElementById("searchForm")
    const category = document.getElementById("category");
    const onlyFav = document.getElementById("onlyFav");
    const search = document.getElementById("searchInput");  

    onlyFav.addEventListener("change", searchRecipe);
    category.addEventListener("change", searchRecipe);
    search.addEventListener("input", searchRecipe);

    searchForm.addEventListener("reset", () => {
        onlyFav.checked = false;
        category.value = "all";
        search.value = "";
        setTimeout(refresh, 0);
    });

    function searchRecipe () {
    const list = loadRecipes();
    const q = search.value.trim().toLowerCase();
    const filtered = list.filter(recipe => 
        (!onlyFav.checked || recipe.isFavorite)   &&
        (category.value === "all" || recipe.category === category.value) &&
        (q === "" || recipe.title.toLowerCase().includes(q))
    )
    renderRecipes(filtered);             // сортування
    };

    function refresh() {
        searchRecipe();
    };

    recipeFormButtons(refresh);
}

export function addPage() {
    const emptyRecipe = {
        title: "",
        category: "breakfasts",
        time: 1,
        servings: 1,
        ingredients: [],
        steps: [],
        isFavorite: false,
    };
    const app = document.getElementById("app");
    app.innerHTML = `
        <h2>Add New Recipe</h2>
        ${recipeFormHTML(emptyRecipe, "add")}

    `;
    editFormAdd("new");

    document.getElementById("cancelEdit-new").addEventListener("click", () => {
        window.location.hash = "#/home";
    });

    const form = document.getElementById(`editForm-new`);

    const favBtn = document.getElementById("favBtn-new");

    let isFavorite = false;

    if (favBtn) {
        favBtn.addEventListener("click", () => {
            isFavorite = !isFavorite;
            favBtn.textContent = isFavorite ? "★" : "☆";
            favBtn.setAttribute("aria-pressed", String(isFavorite));
            favBtn.setAttribute("aria-label", isFavorite ? "Unmark as favorite" : "Mark as favorite");
        });
    };

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const editTitle = document.getElementById("editTitle-new");
        const editTime = document.getElementById("editTime-new");
        const editCategory = document.getElementById("editCategory-new");
        const editServings = document.getElementById("editServings-new");
        const editIngredients = document.getElementById("editIngredients-new");
        const editSteps = document.getElementById("editSteps-new");

        const newRecipe = {
            title: editTitle.value.trim(),
            time: Number(editTime.value),
            category: editCategory.value,
            servings: Number(editServings.value),
            ingredients: collectIngredients(editIngredients),
            steps: collectSteps(editSteps),
            type: "local",
            isFavorite,
        };
        
        const valid = validateRecipe(newRecipe);
        if (!valid) {
            alert("Please fix the errors in the form.");
            return;
        };
                    
        addRecipe(newRecipe);

        window.location.hash = "#/recipes";
    });
};
    
export function favoritesPage() {
    const app = document.getElementById("app");

    app.innerHTML = `
        <h2>Favorites</h2>
        <div id="recipes"></div>
        <p id="counter" aria-live="polite"></p>
    `;

    const list = loadRecipes();
    const filtered = list.filter(recipe => 
        (recipe.isFavorite === "true" || recipe.isFavorite === true)   
    );

    renderRecipes(filtered);     

    if (filtered.length === 0) {
        document.getElementById("recipes").innerHTML = `<p>No favorite recipes yet</p>`;
        const c = document.getElementById("counter");
        if (c) c.textContent = "Find: 0";
    };
    
    function refresh() {
        const filtered = loadRecipes().filter(r => !!r.isFavorite);
        renderRecipes(filtered);
    };

    recipeFormButtons(refresh);       
};

export function homePage(){ document.getElementById("app").innerHTML="<h2>Home</h2>"; }
