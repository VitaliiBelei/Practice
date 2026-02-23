// Event handlers for recipe forms

export function editFormAdd(id) {
    const editForm = document.getElementById(`edit-form-${id}`);
    if (!editForm) return;
    
    // Handle image upload button click (file input handling is done elsewhere)
    const addImageBtn = editForm.querySelector(".add-mainimage-btn");
    /** @type {HTMLInputElement} */
    const fileInput = editForm.querySelector(".add-mainimage");
    
    if (addImageBtn && fileInput) {
        addImageBtn.addEventListener("click", () => {
            fileInput.click();
        });
    }
    
    const addIngBtn = editForm.querySelector(".add-ingredient");

    addIngBtn.addEventListener("click", () => {
    const container = editForm.querySelector(`#editIngredients-${id}`);
    const index = container.querySelectorAll(".ingredient-row").length;

    container.insertAdjacentHTML("beforeend", `
        <div class="ingredient-row" data-index="${index}">
            <textarea type="text" name="ing[${index}][name]" placeholder="Name"></textarea>
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
        if (e.target instanceof Element) {
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
        }
    });
};
