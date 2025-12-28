import { loadSession, loadUserRecipes, getRecipeById } from "../store.js";
import { recipeFormButtons } from "../ui/recipeForm/buttons.js";
import { createNavigation } from "../ui/navigation.js";
import { renderRecipes } from "../ui/recipeList.js";

export async function favoritesPage() {
    createNavigation();
    
    const app = document.getElementById("app");
    if (!app) return;

    app.innerHTML = `
        <h2>Favorites</h2>
        <div id="recipes"></div>
        <p id="counter" aria-live="polite"></p>
    `;

    const session = loadSession();
    if (!session) return;
    const id = session.profileId;
    const list = await loadUserRecipes(id);
    const filtered = (list ?? []).filter(recipe => !!recipe.isFavorite);

    renderRecipes(filtered);     

    if (filtered.length === 0) {
        document.getElementById("recipes").innerHTML = `<p>No favorite recipes yet</p>`;
        const c = document.getElementById("counter");
        if (c) c.textContent = "Find: 0";
    };
    
    async function refresh() {
        const list = await loadUserRecipes(id);
        const filtered = (list ?? []).filter(r => !!r.isFavorite);
        renderRecipes(filtered);
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
};
