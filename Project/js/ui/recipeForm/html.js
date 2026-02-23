export function recipeFormHTML(recipe, mode = "edit") {
    const units = ["pcs", "tsp", "tbsp", "g", "ml"];

    const formId = recipe.id ?? "new";

    const ingRows = (recipe.ingredients?.length ? recipe.ingredients : [{ name: "", qty: "", unit: "pcs" }]).map((ing, index) => 
        `
        <div class="ingredient-row" data-index="${index}">
            <textarea type="text" id="editIngName-${formId}-${index}" name="ing[${index}][name]" placeholder="Name">${ing.name ?? ""}</textarea>
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

    if (mode === 'view') {
        return `
            <article id="edit-form-${formId}" class="recipe-detail recipe-detail--${mode}">
                <button id="backToRecipes" class="mainbutton">← Back to Recipes</button>
                <label for="editTitle-${formId}">
                    Title
                </label>
                <input id="editTitle-${formId}" name="title" value="${recipe.title ?? ""}" disabled>
                <div class='edit-form'>
                    <label for="editCategory-${formId}">
                        Category
                    </label>
                    <select id="editCategory-${formId}" name="category" disabled>
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
                    <input id="editTime-${formId}" name="time" type="number" value="${recipe.time ?? 1}" disabled>

                    <label for="editServings-${formId}">
                        Servings
                    </label>
                    <input id="editServings-${formId}" name="servings" type="number" value="${recipe.servings ?? 1}" disabled>
                </div>

                <div class="main-image-input">
                    <img src="${recipe.mainImage ?? "img/norecipe.png"}" alt="Image of ${recipe.title}" id="imagePreview-${formId}">
                </div>

                <div id="ytModal" class="modal hidden">
                    <iframe id="ytFrame" allowfullscreen></iframe>
                </div>

                <fieldset name="ingredients">
                    <legend>Ingredients</legend>
                    <div id="editIngredients-${formId}" class="ingredients-container">
                        ${(recipe.ingredients ?? []).map((ing, index) => 
                            `
                            <div class="ingredient-row" data-index="${index}">
                                <textarea type="text" id="editIngName-${formId}-${index}" name="ing[${index}][name]" placeholder="Name" disabled>${ing.name ?? ""}</textarea>
                                <input id="editIngQty-${formId}-${index}"  name="ing[${index}][qty]"  type="number" placeholder="Qty" min="0" step="0.01" value="${ing.qty ?? ""}" disabled>
                                <select id="editIngUnit-${formId}-${index}" name="ing[${index}][unit]" disabled>
                                ${units.map(u => `<option value="${u}" ${ing.unit === u ? "selected" : ""}>${u}</option>`).join("")}
                                </select>
                            </div>
                            `
                        ).join("")}
                    </div>
                </fieldset>

                <fieldset name="steps">
                    <legend>Steps</legend>
                    <div id="editSteps-${formId}">
                        ${(recipe.steps ?? []).map((step, index) => 
                            `
                            <div class="step-row" data-index="${index}">
                                <textarea id="editStep-${formId}-${index}" name="step[${index}]" rows="2" placeholder="Step ${index + 1}" disabled>${step}</textarea>
                            </div>
                            `
                        ).join("")}
                    </div>
                </fieldset>

                <button 
                        type="button" 
                        class="fav-btn" 
                        title="Mark/Unmark as favorite"
                        id="favBtn-${formId}"
                        aria-label="${recipe.isFavorite ? 'Unmark as favorite' : 'Mark as favorite'}"
                        aria-pressed="${recipe.isFavorite ? 'true' : 'false'}"
                    >
                        ${recipe.isFavorite ? '★' : '☆'}
                </button>
                
                <button type="button" class="edit-btn" aria-label="Edit recipe">Edit</button>
            </article>
        `
    }

    else return `
        <form id="edit-form-${formId}" class="recipe-detail recipe-detail--${mode}">
            
                <label for="editTitle-${formId}">
                    Title
                </label>
                <input id="editTitle-${formId}" name="title" value="${recipe.title ?? ""}" autofocus>
            <div class='edit-form'>
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
                <input id="editTime-${formId}" name="time" type="number" value="${recipe.time ?? 1}">

                <label for="editServings-${formId}">
                    Servings
                </label>
                <input id="editServings-${formId}" name="servings" type="number" value="${recipe.servings ?? 1}">
            
            
                <button 
                    type="button" 
                    class="fav-btn" 
                    title="Mark/Unmark as favorite"
                    id="favBtn-${formId}"
                    aria-label="${recipe.isFavorite ? 'Unmark as favorite' : 'Mark as favorite'}"
                    aria-pressed="${recipe.isFavorite ? 'true' : 'false'}"
                >
                    ${recipe.isFavorite ? '★' : '☆'}
                </button>
            </div>

            <div class="main-image-input">
                <label for="editImageUrl-${formId}">
                    Add Image
                </label>
                <img src="${recipe.mainImage ?? "img/norecipe.png"}" alt="Image preview" id="imagePreview-${formId}">
                <input type="file" accept="image/*" class="add-mainimage" id="fileInput-${formId}" style="display: none;">
                <button type="button" class="add-mainimage-btn" data-recipe-id="${formId}">Add image</button>
            </div>

            <div class='videoUrl-input'>
                <label for="editVideoUrl-${formId}">
                    YouTube Video URL (optional)
                </label>
                <input id="editVideoUrl-${formId}" name="videoUrl" type="url" placeholder="https://www.youtube.com/watch?v=example" value="${recipe.videoUrl ?? ""}">
            </div>

            <fieldset name="ingredients">
                <legend>Ingredients</legend>
                <div id="editIngredients-${formId}" class="ingredients-container">
                    ${ingRows}
                </div>
                <button type="button" class="add-ingredient" data-recipe-id="${formId}">+ Add ingredient</button>
            </fieldset>

            <fieldset name="steps">
                <legend>Steps</legend>
                <div id="editSteps-${formId}">
                    ${stepsRows}
                </div>
                <button type="button" class="add-step" data-recipe-id="${formId}">+ Add step</button>
            </fieldset>
            
            <div class = 'editButtons'>
                <button type="submit" class="editButton" id="editButton-${formId}">${mode === "add" ? "Add recipe" : "Confirm"}</button>

                <button type="button" class="editButton" id="cancelEdit-${formId}">Cancel</button>
            </div>
        </form>
    `;
};
