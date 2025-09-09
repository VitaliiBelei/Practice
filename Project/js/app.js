import {loadRecipes,toggleFavorite,deleteRecipe,updateRecipe,getRecipeById} from "./store.js";
import {recipeFormHTML} from "./ui/recipeForm.js";

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

    recipes.forEach(recipe => {
        const card = document.createElement("article");
        card.classList.add("recipe-card");
        card.dataset.id = recipe.id;
        const category = recipe.category.charAt(0).toUpperCase() + recipe.category.slice(1);

        card.innerHTML = `
        <h2>${recipe.title}</h2>
        <p>Category: ${category}</p>
        <p>Time: ${recipe.time}</p>
        <button type="button" class="fav-btn" aria-label="${recipe.isFavorite ? 'Unmark as favorite' : 'Mark as favorite'}" aria-pressed="${recipe.isFavorite ? 'true' : 'false'}" >${recipe.isFavorite ? "★" : "☆"}</button>
        <button type="button" class="edit-btn" aria-label="Edit recipe">Edit</button>
        <button type="button" class="delete-btn" aria-label="Delete recipe">Delete</button>
        `;

        container.appendChild(card);
    })
    const c = document.getElementById("counter");
    if (c) c.textContent = `Find: ${recipes.length}`;
}

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
    renderRecipes(filtered);             //доробити скидання фільтрів і сортування
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

            const addIngBtn = editForm.querySelector(".add-ingredient");

            addIngBtn.addEventListener("click", () => {
            const container = editForm.querySelector(`#editIngredients-${id}`);
            const index = container.querySelectorAll(".ingredient-row").length;

            container.insertAdjacentHTML("beforeend", `
                <div class="ingredient-row" data-index="${index}">
                    <input type="text" name="ing[${index}][name]" placeholder="Name">
                    <input type="number" name="ing[${index}][qty]" min="0" step="0.01" placeholder="Qty">
                    <select name="ing[${index}][unit]">
                        <option value="pcs">pcs</option>
                        <option value="tsp">tsp</option>
                        <option value="tbsp">tbsp</option>
                        <option value="g">g</option>
                        <option value="ml">ml</option>
                    </select>
                    <button type="button" class="remove-ingredient" data-recipe-id="${id}" data-index="${index}">-</button>
                </div>
                `);
            });

            const addStepBtn = editForm.querySelector(".add-step");
            addStepBtn.addEventListener("click", () => {
                const container = editForm.querySelector(`#editSteps-${id}`);
                const index = container.querySelectorAll(".step-row").length;
                container.insertAdjacentHTML("beforeend", `
                    <div class="step-row" data-index="${index}">
                        <textarea name="step[${index}]" rows="2" placeholder="Step ${index+1}"></textarea>
                        <button type="button" class="remove-step" data-recipe-id="${id}" data-index="${index}">-</button>
                    </div>
                `);
            });

            editForm.addEventListener("click", (e) => {
                const rmIngBtn = e.target.closest(".remove-ingredient");
                if (rmIngBtn) {
                    e.preventDefault();
                    rmIngBtn.closest(".ingredient-row")?.remove();
                    return;
                }

                const rmStepBtn = e.target.closest(".remove-step");
                if (rmStepBtn) {
                    e.preventDefault();
                    rmStepBtn.closest(".step-row")?.remove();
                }
            });

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
                    }
                });
                return ingredients;
            }

            function collectSteps(editSteps) {
                const rows = editSteps.querySelectorAll(".step-row");
                const steps = [];
                rows.forEach(row => {
                    const stepTextarea = row.querySelector(`textarea[name^="step"]`);
                    const step = stepTextarea.value.trim();
                    if (step) {
                        steps.push(step);
                    }
                });
                return steps;
            }

            editForm.addEventListener("submit", (event) => {                //доробити валідацію
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


            if (!patch.title) {
                alert("Title is required");
            return;
            }

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


export function homePage(){ document.getElementById("app").innerHTML="<h2>Home</h2>"; }
export function addPage(){ document.getElementById("app").innerHTML="<h2>Add</h2>"; }
export function favoritesPage(){ document.getElementById("app").innerHTML="<h2>Favorites</h2>"; }