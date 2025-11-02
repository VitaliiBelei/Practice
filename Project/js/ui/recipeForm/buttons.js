import { toggleFavorite, deleteRecipe, updateRecipe, getRecipeById } from "../../store.js";
import { validateRecipe } from "./validation.js";
import { recipeFormHTML } from "./html.js";
import { editFormAdd } from "./events.js";
import { collectIngredients, collectSteps, collectImage } from "./data.js";
import { handleFileInput } from "../../utils/fileHandler.js";

// Handle buttons in recipe cards: favorite, delete, edit
export function recipeFormButtons(onRefresh) {
    const recipesContainer = document.getElementById("recipes");
    recipesContainer.addEventListener("click", async event => {
        const btn = event.target.closest("button");
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
            const existingForm = document.querySelector('[id^="editForm-"]');
            if (existingForm) existingForm.remove();
                               
            article.insertAdjacentHTML("afterend", recipeFormHTML(recipe)); 

            const editForm = document.getElementById(`editForm-${id}`);
            const editTitle = document.getElementById(`editTitle-${id}`);
            const editTime = document.getElementById(`editTime-${id}`);
            const editCategory = document.getElementById(`editCategory-${id}`);
            const editServings = document.getElementById(`editServings-${id}`);
            const editIngredients = document.getElementById(`editIngredients-${id}`);
            const editSteps = document.getElementById(`editSteps-${id}`);
            editCategory.value = recipe.category;

            let mainImageData = "img/norecipe.png";
            const mainImageInput = document.querySelector(".add-mainimage");
            if (mainImageInput) {
                handleFileInput(mainImageInput, (result) => {
                    mainImageData = result;
                    const imagePreview = document.getElementById(`imagePreview-${id}`);
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

            if (!editForm) return;

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

            document.getElementById(`cancelEdit-${id}`).addEventListener("click", () => {
                editForm.remove();
                document.querySelector(`article[data-id="${id}"] .edit-btn`)?.focus();
            });
            
        }
    })
}