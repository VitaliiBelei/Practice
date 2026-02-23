// Functions for collecting data from recipe forms

export function collectIngredients(editIngredients) {
    const rows = editIngredients.querySelectorAll(".ingredient-row");
    const ingredients = [];
    rows.forEach(row => {
        const nameInput = row.querySelector(`textarea[name^="ing"][name$="[name]"]`); 
        const qtyInput = row.querySelector(`input[name^="ing"][name$="[qty]"]`);
        const unitSelect = row.querySelector(`select[name^="ing"][name$="[unit]"]`);
        const name = nameInput.value.trim();
        const qty = parseFloat(String(qtyInput.value).replace(",", "."));
        const unit = unitSelect.value;
        ingredients.push({ name, qty: isNaN(qty) ? 0 : qty, unit });
        
    });
    return ingredients;
}

export function collectSteps(editSteps) {
    const rows = editSteps.querySelectorAll(".step-row");
    const steps = [];
    rows.forEach(row => {
        const stepTextarea = row.querySelector(`textarea[name^="step"]`);
        const step = stepTextarea.value.trim();
        steps.push(step);
    });
    return steps;
}

export function collectImage(formId) {
    const imagePreview = /** @type {HTMLImageElement | null} */ (document.getElementById(`imagePreview-${formId}`));
    return imagePreview ? imagePreview.src : "img/norecipe.png";
};