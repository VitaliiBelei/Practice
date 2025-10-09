// Common recipe list rendering functionality
import { recipeCard } from "./recipe.js";

export function renderRecipes(recipes) {
    const container = document.getElementById("recipes");
    if (!container) return;

    container.innerHTML = "";

    if (!recipes || recipes.length === 0) {
        container.innerHTML = `<p>No recipes</p>`;
        const c = document.getElementById("counter");
        if (c) c.textContent = "Find: 0";
        return;
    }

    const c = document.getElementById("counter");
    if (c) c.textContent = `Find: ${recipes.length}`;
    
    container.innerHTML = recipes.map(recipeCard).join("");
}