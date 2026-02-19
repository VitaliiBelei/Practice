import { recipeFormHTML } from './recipeForm/html.js';
import { updateRecipe } from "../store.js";
import { validateRecipe } from "./recipeForm/validation.js";
import { editFormAdd } from "./recipeForm/events.js";
import { collectIngredients, collectSteps } from "./recipeForm/data.js";
import { handleFileInput } from "../utils/fileHandler.js";
import { extractYouTubeId } from "../utils/youtubeId.js";

// Recipe display components

export function recipeCard(recipe, mode = "list") {
    const category = recipe.category.charAt(0).toUpperCase() + recipe.category.slice(1);
    
    if (mode === "flow") {
        return `
            <article class="recipe-card" >
            <div>
                <h2>${recipe.title}</h2>
                <p><strong>Category:</strong> ${category}</p>
                <p><strong>Time:</strong> ${recipe.time} minutes</p>
                <p><strong>Servings:</strong> ${recipe.servings}</p>
            </div>
            <div class="recipe-image" data-id="${recipe.id}">
                <img src="${recipe.mainImage ?? 'img/norecipe.png'}" alt="Image of ${recipe.title}">
            </div>
        </article>
        `
    }
    return `
        <article class="recipe-card" data-id="${recipe.id}">
            <div>
                <h2>${recipe.title}</h2>
                <p><strong>Category:</strong> ${category}</p>
                <p><strong>Time:</strong> ${recipe.time} minutes</p>
                <p><strong>Servings:</strong> ${recipe.servings}</p>
                <div class="button-group">
                    <button type="button" class="fav-btn" 
                        aria-label="${recipe.isFavorite ? "Unmark as favorite" : "Mark as favorite"}"
                        aria-pressed="${recipe.isFavorite ? "true" : "false"}">
                        ${recipe.isFavorite ? "★" : "☆"}
                    </button>
                    <button type="button" class="delete-btn btn-error" aria-label="Delete recipe">Delete</button>
                </div>
            </div>
            <div class="recipe-image" data-id="${recipe.id}">
                <img src="${recipe.mainImage ?? 'img/norecipe.png'}" alt="Image of ${recipe.title}">
            </div>
        </article>
    `;
}

export function renderRecipeDetail(recipe) {
    const container = document.getElementById('app');
    if (!container) return;

    container.innerHTML = recipeFormHTML(recipe, "view");

    if (recipe.youtubeUrl) {
        const videoId = extractYouTubeId(recipe.youtubeUrl);
        if (videoId) {
            recipe.youtubeUrl = `https://www.youtube.com/embed/${videoId}`;
            const ytModal = document.getElementById("ytModal");
            /** @type {HTMLIFrameElement | null} */
            const ytFrame =/** @type {HTMLIFrameElement | null} */ (document.getElementById("ytFrame"));
            if (ytFrame) {
                ytFrame.src = recipe.youtubeUrl;
                ytModal.classList.remove("hidden");
            }
        } else {
            recipe.youtubeUrl = "";
        }
    }

    const editBtn = document.querySelector(".edit-btn");
    if (editBtn) {
        editBtn.addEventListener("click", (e) => {
            e.preventDefault();
            renderRecipeEdit(container, recipe);
        });
    }

    // Add back button functionality
    const backButton = document.getElementById('backToRecipes');
    if (backButton) {
        backButton.onclick = async () => {
            try {
                const { recipesPage } = await import('../app.js');
                recipesPage();
            } catch (error) {
                console.error('Error importing recipesPage:', error);
                window.location.hash = '#/recipes';
            }
        };
    }
}

function renderRecipeEdit(container, recipe) {
    const id = recipe.id;
    container.innerHTML = recipeFormHTML(recipe, "edit");

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
    /** @type {HTMLInputElement | null} */
    const editYoutubeUrl = /** @type {HTMLInputElement | null} */ (document.getElementById(`editVideoUrl-${id}`));
    if (!editForm || !editTitle || !editTime || !editCategory || !editServings || !editIngredients || !editSteps || !editYoutubeUrl) return;

    let mainImageData = recipe.mainImage ?? "img/norecipe.png";
    /** @type {HTMLInputElement | null} */
    const mainImageInput = /** @type {HTMLInputElement | null} */ (editForm.querySelector(".add-mainimage"));
    if (mainImageInput) {
        handleFileInput(mainImageInput, (result) => {
            mainImageData = result;
            /** @type {HTMLImageElement | null} */
            const imagePreview = /** @type {HTMLImageElement | null} */ (document.getElementById(`imagePreview-${id}`));
            if (imagePreview) imagePreview.src = result;
        });
    }

    editFormAdd(id);

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
            youtubeUrl: editYoutubeUrl.value.trim()
        };

        const valid = validateRecipe(patch);
        if (!valid) return;

        const updated = await updateRecipe(id, patch);
        renderRecipeDetail(updated);
    });

    const cancelButton = document.getElementById(`cancelEdit-${id}`);
    if (cancelButton) {
        cancelButton.addEventListener("click", () => {
            renderRecipeDetail(recipe);
        });
    }
}
