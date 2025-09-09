export function recipeFormHTML(recipe) {
    const units = ["pcs", "tsp", "tbsp", "g", "ml"];

    const ingRows = (recipe.ingredients?.length ? recipe.ingredients : [{ name: "", qty: "", unit: "pcs" }]).map((ing, index) => 
        `
        <div class="ingredient-row" data-index="${index}">
            <input id="editIngName-${recipe.id}-${index}" name="ing[${index}][name]" type="text" placeholder="Name" value="${ing.name ?? ""}">
            <input id="editIngQty-${recipe.id}-${index}"  name="ing[${index}][qty]"  type="number" placeholder="Qty" min="0" step="0.01" value="${ing.qty ?? ""}">
            <select id="editIngUnit-${recipe.id}-${index}" name="ing[${index}][unit]">
            ${units.map(u => `<option value="${u}" ${ing.unit === u ? "selected" : ""}>${u}</option>`).join("")}
            </select>
        </div>
        `).join("");

    const stepsRows = (recipe.steps?.length ? recipe.steps : [""]).map((step, index) =>
        `
        <div class="step-row" data-index="${index}">
            <textarea id="editStep-${recipe.id}-${index}" name="step[${index}]" rows="2" placeholder="Step ${index + 1}">${step}</textarea>
        </div>
        `).join("");

    return `
        <form id="editForm-${recipe.id}">
            <label for="editTitle-${recipe.id}">
                Title
            </label>
            <input id="editTitle-${recipe.id}" name="title" value="${recipe.title ?? ""}">

            <label for="editCategory-${recipe.id}">
                Category
            </label>
            <select id="editCategory-${recipe.id}" name="category">
                <option value="breakfasts" ${recipe.category === "breakfasts" ? "selected" : ""}>Breakfasts</option>
                <option value="dinners"    ${recipe.category === "dinners"    ? "selected" : ""}>Dinners</option>
                <option value="salads"     ${recipe.category === "salads"     ? "selected" : ""}>Salads</option>
                <option value="soups"      ${recipe.category === "soups"      ? "selected" : ""}>Soups</option>
                <option value="meat"       ${recipe.category === "meat"       ? "selected" : ""}>Meat</option>
                <option value="fish"       ${recipe.category === "fish"       ? "selected" : ""}>Fish</option>
            </select>

            <label for="editTime-${recipe.id}">
                Time
            </label>
            <input id="editTime-${recipe.id}" name="time" type="number" min="0" value="${recipe.time ?? 0}">

            <label for="editServings-${recipe.id}">
                Servings
            </label>
            <input id="editServings-${recipe.id}" name="servings" type="number" min="1" value="${recipe.servings ?? 1}">

            <fieldset>
                <legend>Ingredients</legend>
                <div id="editIngredients-${recipe.id}">
                    ${ingRows}
                </div>
                <button type="button" class="add-ingredient" data-recipe-id="${recipe.id}">+ Add ingredient</button>
            </fieldset>


            <fieldset>
                <legend>Steps</legend>
                <div id="editSteps-${recipe.id}">
                    ${stepsRows}
                </div>
                <button type="button" class="add-step" data-recipe-id="${recipe.id}">+ Add step</button>
            </fieldset>
            
            <button type="submit" class="editButton" id="editButton-${recipe.id}">Confirm</button>

            <button type="button" class="editButton" id="cancelEdit-${recipe.id}">Cancel</button>
        </form>
    `;
}
