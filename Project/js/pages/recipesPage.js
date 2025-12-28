import { loadSession, loadUserRecipes, getRecipeById } from "../store.js";
import { recipeFormButtons } from "../ui/recipeForm/buttons.js";
import { createNavigation } from "../ui/navigation.js";
import { renderRecipes } from "../ui/recipeList.js";

export async function recipesPage() {
    createNavigation();
    
    const app = document.getElementById("app");
    if (!app) return;
    app.innerHTML = `
        <div id="controls">
            <form id="search-form">
                <label for="search-input">
                    Search recipes
                    <div>
                        <input type="text" id="search-input" placeholder="Recipe">
                        <select id="category">
                            <option value="all">All categories</option>       
                            <option value="breakfasts">Breakfasts</option>
                            <option value="dinners">Dinners</option>
                            <option value="salads">Salads</option>
                            <option value="soups">Soups</option>
                            <option value="meat">Meat</option>
                            <option value="fish">Fish</option>
                        </select>
                        <label><input type="checkbox" id="only-fav"> Only favorites</label>
                        <button type="reset" id="reset-btn">Reset</button>
                    </div>
                </label>
                
            </form>
        
        
        </div>
        <div id="recipes"></div>
        <p id="counter" aria-live="polite"></p>
    `;

    const session = loadSession();
    if (!session) return;
    const id = session.profileId;
    const allRecipes = await loadUserRecipes(id);
    renderRecipes(allRecipes ?? []);

    /** @type {HTMLFormElement | null} */
    const searchForm = /** @type {HTMLFormElement | null} */ (document.getElementById("search-form"));
    /** @type {HTMLSelectElement | null} */
    const category = /** @type {HTMLSelectElement | null} */ (document.getElementById("category"));
    /** @type {HTMLInputElement | null} */
    const onlyFav = /** @type {HTMLInputElement | null} */ (document.getElementById("only-fav"));
    /** @type {HTMLInputElement | null} */
    const search = /** @type {HTMLInputElement | null} */ (document.getElementById("search-input"));
    if (!searchForm || !category || !onlyFav || !search) return;

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
    const filtered = (list ?? []).filter(recipe => 
        (!onlyFav.checked || recipe.isFavorite)   &&
        (category.value === "all" || recipe.category === category.value) &&
        (q === "" || recipe.title.toLowerCase().includes(q))
    );
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
            if (e.target instanceof Element && e.target.tagName === "H2") {
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
