export function recipeFormHTML(recipe) {
    const units = ["pcs", "tsp", "tbsp", "g", "ml"];

    const formId = recipe.id ?? "new";

    const ingRows = (recipe.ingredients?.length ? recipe.ingredients : [{ name: "", qty: "", unit: "pcs" }]).map((ing, index) => 
        `
        <div class="ingredient-row" data-index="${index}">
            <input id="editIngName-${formId}-${index}" name="ing[${index}][name]" type="text" placeholder="Name" value="${ing.name ?? ""}">
            <input id="editIngQty-${formId}-${index}"  name="ing[${index}][qty]"  type="number" placeholder="Qty" min="0" step="0.01" value="${ing.qty ?? ""}">
            <select id="editIngUnit-${formId}-${index}" name="ing[${index}][unit]">
            ${units.map(u => `<option value="${u}" ${ing.unit === u ? "selected" : ""}>${u}</option>`).join("")}
            </select>
            <button type="button" class="remove-ingredient" data-recipe-id="${formId}" data-index="${index}">-</button>
        </div>
        `).join("");

    const stepsRows = (recipe.steps?.length ? recipe.steps : [""]).map((step, index) =>
        `
        <div class="step-row" data-index="${index}">
            <textarea id="editStep-${formId}-${index}" name="step[${index}]" rows="2" placeholder="Step ${index + 1}">${step}</textarea>
            <button type="button" class="remove-step" data-recipe-id="${formId}" data-index="${index}">-</button>
        </div>
        `).join("");

    return `
        <form id="editForm-${formId}">
            <label for="editTitle-${formId}">
                Title
            </label>
            <input id="editTitle-${formId}" name="title" value="${recipe.title ?? ""}">

            <label for="editCategory-${formId}">
                Category
            </label>
            <select id="editCategory-${formId}" name="category">
                <option value="breakfasts" ${recipe.category === "breakfasts" ? "selected" : ""}>Breakfasts</option>
                <option value="dinners"    ${recipe.category === "dinners"    ? "selected" : ""}>Dinners</option>
                <option value="salads"     ${recipe.category === "salads"     ? "selected" : ""}>Salads</option>
                <option value="soups"      ${recipe.category === "soups"      ? "selected" : ""}>Soups</option>
                <option value="meat"       ${recipe.category === "meat"       ? "selected" : ""}>Meat</option>
                <option value="fish"       ${recipe.category === "fish"       ? "selected" : ""}>Fish</option>
            </select>

            <label for="editTime-${formId}">
                Time
            </label>
            <input id="editTime-${formId}" name="time" type="number" min="0" value="${recipe.time ?? 0}">

            <label for="editServings-${formId}">
                Servings
            </label>
            <input id="editServings-${formId}" name="servings" type="number" min="1" value="${recipe.servings ?? 1}">

            <fieldset>
                <legend>Ingredients</legend>
                <div id="editIngredients-${formId}">
                    ${ingRows}
                </div>
                <button type="button" class="add-ingredient" data-recipe-id="${formId}">+ Add ingredient</button>
            </fieldset>


            <fieldset>
                <legend>Steps</legend>
                <div id="editSteps-${formId}">
                    ${stepsRows}
                </div>
                <button type="button" class="add-step" data-recipe-id="${formId}">+ Add step</button>
            </fieldset>
            
            <button type="submit" class="editButton" id="editButton-${formId}">Confirm</button>

            <button type="button" class="editButton" id="cancelEdit-${formId}">Cancel</button>
        </form>
    `;
}


// Add functionality to the edit form for adding/removing ingredients and steps
export function editFormAdd(id) {
    const editForm = document.getElementById(`editForm-${id}`);
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
        };

        const rmStepBtn = e.target.closest(".remove-step");
        if (rmStepBtn) {
            e.preventDefault();
            rmStepBtn.closest(".step-row")?.remove();
        };
    });
};
