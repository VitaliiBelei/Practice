import { toggleFavorite, deleteRecipe, updateRecipe, getRecipeById } from "../../store.js";
import { validateRecipe } from "./validation.js";
import { recipeFormHTML } from "./html.js";
import { editFormAdd } from "./events.js";
import { collectIngredients, collectSteps } from "./data.js";
import { handleFileInput } from "../../utils/fileHandler.js";

// Handle buttons in recipe cards: favorite, delete, edit
export function recipeFormButtons(onRefresh) {
    const recipesContainer = document.getElementById("recipes");
    if (!recipesContainer) return;
    recipesContainer.addEventListener("click", async event => {
        const btn = event.target instanceof Element ? event.target.closest("button") : null;
        if (!btn) return;

        if (btn.classList.contains("fav-btn")) {
            const article = btn.closest("article");
            if (!article) return;
            const id = article.dataset.id;
            if (!id) return;
            await toggleFavorite(id);
            onRefresh();
            return;
        }

        else if (btn.classList.contains("delete-btn")) {
            const article = btn.closest("article");
            if (!article) return;
            const id = article.dataset.id;
            if (!id) return;
            if (confirm("Delete recipe?")) {
            await deleteRecipe(id);
            onRefresh();
            }
            return;
        }

        else if (btn.classList.contains("edit-btn")) {
            const article = btn.closest("article");
            if (!article) return;
            const id = article.dataset.id;
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

            onRefresh();

            editForm.remove();

            return;
            });

            const cancelButton = document.getElementById(`cancelEdit-${id}`);
            if (cancelButton) cancelButton.addEventListener("click", () => {
                editForm.remove();
                const editButton = document.querySelector(`article[data-id="${id}"] .edit-btn`);
                if (editButton instanceof HTMLElement) {
                    editButton.focus();
                }
            });
            
        }
    })
}
