export function recipeCard(recipe) {
    const category = recipe.category.charAt(0).toUpperCase() + recipe.category.slice(1);

    return `
        <article class="recipe-card" data-id="${recipe.id}">
            <h2>${recipe.title}</h2>
            <p>Category: ${category}</p>
            <p>Time: ${recipe.time}</p>
            <button type="button" class="fav-btn" 
                aria-label="${recipe.isFavorite ? "Unmark as favorite" : "Mark as favorite"}"
                aria-pressed="${recipe.isFavorite ? "true" : "false"}">
                ${recipe.isFavorite ? "★" : "☆"}
            </button>
        <button type="button" class="edit-btn" aria-label="Edit recipe">Edit</button>
        <button type="button" class="delete-btn" aria-label="Delete recipe">Delete</button>
        </article>
    `;
}
