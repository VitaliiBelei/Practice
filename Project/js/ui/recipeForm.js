export function recipeFormHTML(recipe) {
    return ` <form id="editForm-${recipe.id}">
        <label>
            Title
            <input id="editTitle-${recipe.id}" name="editTitle" value="${recipe.title}">
        </label>

        <label>
            Category
            <select id="editCategory-${recipe.id}" name="editCategory">
                <option value="breakfasts">Breakfasts</option>
                <option value="dinners">Dinners</option>
                <option value="salads">Salads</option>
                <option value="soups">Soups</option>
                <option value="meat">Meat</option>
                <option value="fish">Fish</option>
            </select>
        </label>

        <label>
            Time
            <input id="editTime-${recipe.id}" name="editTime" type="number" min="0" value="${recipe.time}">
        </label>

        <label>
            Servings
            <input id="editServings-${recipe.id}" name="editServings" type="number" min="1" value="${recipe.servings}">
        </label>

        <label>
            Ingredients (one per line, format: name, qty, unit)
            <textarea id="editIngredients-${recipe.id}" name="editIngredients" rows="5">${recipe.ingredients.map(ing => `${ing.name}, ${ing.qty} ${ing.unit}`).join("\n")}</textarea>
        </label>

        <label>
            Steps (one per line)
            <textarea id="editSteps-${recipe.id}" name="editSteps" rows="5">${recipe.steps.join("\n")}</textarea>
        </label>

        <button type="submit" id="editButton-${recipe.id}">Confirm</button>
    </form> `;
}