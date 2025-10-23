import { loadSession, loadUserRecipes, getRecipeById } from "../store.js";
import { recipeFormButtons } from "../ui/recipeForm/buttons.js";
import { createNavigation } from "../ui/navigation.js";
import { renderRecipes } from "../ui/recipeList.js";

export async function recipesPage() {
    createNavigation();
    
    const app = document.getElementById("app");
    app.innerHTML = `
        <div id="controls">
            <form id="searchForm">
                <label for="searchInput">
                    Search recipes
                    <div>
                        <input type="text" id="searchInput" placeholder="Recipe">
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
                        <button type="reset" id="resetBtn">Reset</button>
                    </div>
                </label>
                
            </form>
        
        
        </div>
        <div id="recipes"></div>
        <p id="counter" aria-live="polite"></p>
    `;

    const session = loadSession();
    const id = session.profileId;
    const allRecipes = await loadUserRecipes(id);
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

    async function searchRecipe () {
    const list = await loadUserRecipes(id);
    const q = search.value.trim().toLowerCase();
    const filtered = list.filter(recipe => 
        (!onlyFav.checked || recipe.isFavorite)   &&
        (category.value === "all" || recipe.category === category.value) &&
        (q === "" || recipe.title.toLowerCase().includes(q))
    )
    renderRecipes(filtered);
    };

    function refresh() {
        searchRecipe();
    };

    recipeFormButtons(refresh);

    const showRecipeDetail = async (id) => {
        const recipe = await getRecipeById(id);
        if (!recipe) return;
        const { renderRecipeDetail } = await import("../ui/recipe.js");
        renderRecipeDetail(recipe);
    };

    const recipesContainer = document.getElementById("recipes");
    if (recipesContainer) {
        recipesContainer.addEventListener("click", (e) => {
            if (e.target.tagName === 'H2') {
                const card = e.target.closest(".recipe-card");
                if (!card) return;
                const id = card.getAttribute("data-id");
                if (!id) return;
                showRecipeDetail(id);
                return;
            }
        });
    }
}