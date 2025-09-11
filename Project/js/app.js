import {loadRecipes,toggleFavorite,deleteRecipe,updateRecipe,getRecipeById} from "./store.js";
import {recipeFormHTML, editFormAdd} from "./ui/recipeForm.js";
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


// Collect ingredients and steps from the edit form
function collectIngredients(editIngredients) {
    const rows = editIngredients.querySelectorAll(".ingredient-row");
    const ingredients = [];
    rows.forEach(row => {
        const nameInput = row.querySelector(`input[name^="ing"][name$="[name]"]`); 
        const qtyInput = row.querySelector(`input[name^="ing"][name$="[qty]"]`);
        const unitSelect = row.querySelector(`select[name^="ing"][name$="[unit]"]`);
        const name = nameInput.value.trim();
        const qty = parseFloat(String(qtyInput.value).replace(",", "."));
        const unit = unitSelect.value;
        if (name) {
            ingredients.push({ name, qty: isNaN(qty) ? 0 : qty, unit });
        };
    });
    return ingredients;
};

function collectSteps(editSteps) {
    const rows = editSteps.querySelectorAll(".step-row");
    const steps = [];
    rows.forEach(row => {
        const stepTextarea = row.querySelector(`textarea[name^="step"]`);
        const step = stepTextarea.value.trim();
        if (step) {
            steps.push(step);
        };
    });
    return steps;
};


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
    }

    function refresh() {
        searchRecipe({ type: "refresh", preventDefault(){} });
    }

    const recipesContainer = document.getElementById("recipes");
    recipesContainer.addEventListener("click", event => {
        const btn = event.target.closest("button");
        if (!btn) return;

        if (btn.classList.contains("fav-btn")) {
            const article = btn.closest("article");
            if (!article) return;
            const id = article.dataset.id;
            if (!id) return;
            toggleFavorite(id);
            refresh();
            return;
        }

        else if (btn.classList.contains("delete-btn")) {
            const article = btn.closest("article");
            if (!article) return;
            const id = article.dataset.id;
            if (confirm("Delete recipe?")) {
            deleteRecipe(id);
            refresh();
            }
            return;
        }

        else if (btn.classList.contains("edit-btn")) {
            const article = btn.closest("article");
            if (!article) return;
            const id = article.dataset.id;
            const recipe = getRecipeById(id);
            const existingForm = document.querySelector('[id^="editForm-"]');
            if (existingForm) existingForm.remove();
                               
            article.insertAdjacentHTML("afterend", recipeFormHTML(recipe)); 

            const editForm = document.getElementById(`editForm-${id}`);
            const editTitle = document.getElementById(`editTitle-${id}`);
            const editTime = document.getElementById(`editTime-${id}`);
            const editCategory = document.getElementById(`editCategory-${id}`);
            const editServings = document.getElementById(`editServings-${id}`);
            const editIngredients = document.getElementById(`editIngredients-${id}`);
            const editSteps = document.getElementById(`editSteps-${id}`);
            editCategory.value = recipe.category;

            editFormAdd(id);

            collectIngredients(editIngredients);

            collectSteps(editSteps);

            editForm.addEventListener("submit", (event) => {                
            event.preventDefault();

            if (!editForm) return;

            const patch = {
                title: editTitle.value.trim(),
                time: Number(editTime.value),
                category: editCategory.value,
                servings: Number(editServings.value),
                ingredients: collectIngredients(editIngredients),
                steps: collectSteps(editSteps),
            };

            const valid = validateRecipe(patch);
            if (!valid) return;
            
            updateRecipe(id, patch);

            refresh();

            editForm.remove();

            return;
            });

            document.getElementById(`cancelEdit-${id}`).addEventListener("click", () => {
                editForm.remove();
                document.querySelector(`article[data-id="${id}"] .edit-btn`)?.focus();
            });
            
        }
    })
}

export function addPage() {
    const recipe = {
        id: "",
        title: "",
        category: "breakfasts",
        time: 1,
        servings: 1,
        ingredients: [],
        steps: [],
        isFavorite: false
    };
    const app = document.getElementById("app");
    app.innerHTML = `
        <h2>Add New Recipe</h2>
        ${recipeFormHTML(recipe)}
    `;
}
    
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
    )

    renderRecipes(filtered);     

    if (filtered.length === 0) {
        document.getElementById("recipes").innerHTML = `<p>No favorite recipes yet</p>`;
        const c = document.getElementById("counter");
        if (c) c.textContent = "Find: 0";
    }        
}

export function homePage(){ document.getElementById("app").innerHTML="<h2>Home</h2>"; }
