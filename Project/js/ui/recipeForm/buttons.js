import { toggleFavorite, deleteRecipe, updateRecipe, getRecipeById } from "../../store.js";
import { validateRecipe } from "./validation.js";
import { recipeFormHTML } from "./html.js";
import { editFormAdd } from "./events.js";
import { collectIngredients, collectSteps } from "./data.js";
import { handleFileInput } from "../../utils/fileHandler.js";

let recipeFormButtonsBound = false;

// Handle buttons in recipe cards: favorite, delete, edit
export function recipeFormButtons() {
    if (recipeFormButtonsBound) return;
    recipeFormButtonsBound = true;

    document.addEventListener("click", async event => {
        const btn = event.target instanceof Element ? event.target.closest("button") : null;
        if (!btn) return;
        const isInRecipesList = Boolean(btn.closest("#recipes"));

        if (btn.classList.contains("fav-btn")) {
            event.preventDefault();
            event.stopPropagation();
            const recipeContainer = btn.closest("article[data-id], form[data-id]");
            if (!recipeContainer) return;
            const id = recipeContainer.getAttribute("data-id");
            if (!id) return;
            const updatedRecipe = await toggleFavorite(id);
            btn.setAttribute("aria-label", updatedRecipe.isFavorite ? "Unmark as favorite" : "Mark as favorite");
            btn.setAttribute("aria-pressed", updatedRecipe.isFavorite ? "true" : "false");
            btn.textContent = updatedRecipe.isFavorite ? "★" : "☆";
            return;
        }

        else if (btn.classList.contains("delete-btn")) {
            event.preventDefault();
            if (!isInRecipesList) return;
            const article = btn.closest("article");
            if (!article) return;
            const id = article.getAttribute("data-id");
            if (!id) return;
            if (confirm("Delete recipe?")) {
            await deleteRecipe(id);
            }
            return;
        }

        else if (btn.classList.contains("edit-btn")) {
            event.preventDefault();
            if (!isInRecipesList) return;
            const article = btn.closest("article");
            if (!article) return;
            const id = article.getAttribute("data-id");
            const recipe = await getRecipeById(id);
            const existingForm = document.querySelector('[id^="edit-form-"]');
            if (existingForm) existingForm.remove();
                               
            article.insertAdjacentHTML("afterend", recipeFormHTML(recipe)); 

            /** @type {HTMLFormElement | null} */
            const editForm = /** @type {HTMLFormElement | null} */ (document.getElementById(`edit-form-${id}`));
            /** @type {HTMLInputElement | null} */
            const editTitle = /** @type {HTMLInputElement | null} */ (document.getElementById(`editTitle-${id}`));
            /** @type {HTMLInputElement | null} */
            const editTime = /** @type {HTMLInputElement | null} */ (document.getElementById(`editTime-${id}`));
            /** @type {HTMLSelectElement | null} */
            const editCategory = /** @type {HTMLSelectElement | null} */ (document.getElementById(`editCategory-${id}`));
            /** @type {HTMLInputElement | null} */
            const editServings = /** @type {HTMLInputElement | null} */ (document.getElementById(`editServings-${id}`));
            /** @type {HTMLElement | null} */
            const editIngredients = /** @type {HTMLElement | null} */ (document.getElementById(`editIngredients-${id}`));
            /** @type {HTMLElement | null} */
            const editSteps = /** @type {HTMLElement | null} */ (document.getElementById(`editSteps-${id}`));
            if (!editForm || !editTitle || !editTime || !editCategory || !editServings || !editIngredients || !editSteps) return;
            editCategory.value = recipe.category;

            let mainImageData = "img/norecipe.png";
            /** @type {HTMLInputElement | null} */
            const mainImageInput = /** @type {HTMLInputElement | null} */ (document.querySelector(".add-mainimage"));
            if (mainImageInput) {
                handleFileInput(mainImageInput, (result) => {
                    mainImageData = result;
                    /** @type {HTMLImageElement | null} */
                    const imagePreview = /** @type {HTMLImageElement | null} */ (document.getElementById(`imagePreview-${id}`));
                    if (imagePreview) {
                        imagePreview.src = result;
                    }
                });
            }

            editFormAdd(id);

            collectIngredients(editIngredients);

            collectSteps(editSteps);

            editForm.addEventListener("submit", async (event) => {                
            event.preventDefault();

            const patch = {
                id,
                title: editTitle.value.trim(),
                time: Number(editTime.value),
                category: editCategory.value,
                servings: Number(editServings.value),
                ingredients: collectIngredients(editIngredients),
                steps: collectSteps(editSteps),
                mainImage: mainImageData,
            };

            const valid = validateRecipe(patch);
            if (!valid) return;
            
            await updateRecipe(id, patch);

            editForm.remove();

            return;
            });

            const cancelButton = document.getElementById(`cancelEdit-${id}`);
            if (cancelButton) cancelButton.addEventListener("click", (event) => {
                event.preventDefault();
                editForm.remove();
                const editButton = document.querySelector(`article[data-id="${id}"] .edit-btn`);
                if (editButton instanceof HTMLElement) {
                    editButton.focus();
                }
            });
            
        }
    });
}
