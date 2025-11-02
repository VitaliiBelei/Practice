// Common recipe list rendering functionality
import { recipeCard } from "./recipe.js";

export function renderRecipes(recipes) {
    const container = document.getElementById("recipes");
    if (!container) return;

    // Add CSS class for grid layout
    container.className = "recipes-container";
    container.innerHTML = "";

    if (!recipes || recipes.length === 0) {
        container.innerHTML = `<p>No recipes found</p>`;
        const c = document.getElementById("counter");
        if (c) c.textContent = "Found: 0 recipes";
        return;
    }

    const c = document.getElementById("counter");
    if (c) c.textContent = `Found: ${recipes.length} recipe${recipes.length !== 1 ? 's' : ''}`;
    
    container.innerHTML = recipes.map(recipeCard).join("");
}