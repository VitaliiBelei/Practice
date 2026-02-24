// @ts-check
import { loadSession, addRecipe } from "../store.js";
import { recipeFormHTML } from "../ui/recipeForm/html.js";
import { editFormAdd } from "../ui/recipeForm/events.js";
import { collectIngredients, collectSteps } from "../ui/recipeForm/data.js";
import { validateRecipe } from "../ui/recipeForm/validation.js";
import { createNavigation } from "../ui/navigation.js";
import { handleFileInput } from "../utils/fileHandler.js";
import { applyTheme } from "../utils/theme.js";

export async function addPage() {
    applyTheme();
    createNavigation();
    
    const session = loadSession();
    if (!session) return;

    /** @type {Recipe} */    
    const emptyRecipe = ({
        title: "",
        category: "breakfasts",
        time: 1,
        servings: 1,
        ingredients: [],
        steps: [],
        isFavorite: false,
        profileId: "",
        type: "local",
        mainImage: "img/norecipe.png",
        youtubeUrl: ""
    });

    const app = document.getElementById("app");
    if (!app) return;
    app.innerHTML = `
        <h2>Add New Recipe</h2>
        ${recipeFormHTML(emptyRecipe, "add")}

    `;
    editFormAdd("new");

    document.getElementById("cancelEdit-new").addEventListener("click", (e) => {
        e.preventDefault();
        window.location.hash = "#/profile";
    });

    /** @type {HTMLFormElement | null} */
    const form = /** @type {HTMLFormElement | null} */ (document.getElementById(`edit-form-new`));
    if (!form) return;

    const favBtn = document.getElementById("favBtn-new");

    let isFavorite = false;

    if (favBtn) {
        favBtn.addEventListener("click", (e) => {
            e.preventDefault();
            isFavorite = !isFavorite;
            favBtn.textContent = isFavorite ? "★" : "☆";
            favBtn.setAttribute("aria-pressed", String(isFavorite));
            favBtn.setAttribute("aria-label", isFavorite ? "Unmark as favorite" : "Mark as favorite");
        });
    };

    let mainImageData = "img/norecipe.png";
    
    // Use handleFileInput utility to avoid duplication
    /** @type {HTMLInputElement | null} */
    const mainImageInput = /** @type {HTMLInputElement | null} */ (document.querySelector(".add-mainimage"));
    if (mainImageInput) {
        handleFileInput(mainImageInput, (result) => {
            mainImageData = result;
            /** @type {HTMLImageElement | null} */
            const imagePreview = /** @type {HTMLImageElement | null} */ (document.getElementById("imagePreview-new"));
            if (imagePreview) {
                imagePreview.src = result;
            }
        });
    }
    

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const editTitle = /** @type {HTMLInputElement} */ (document.getElementById("editTitle-new"));
        const editTime = /** @type {HTMLInputElement} */ (document.getElementById("editTime-new"));
        const editCategory = /** @type {HTMLSelectElement} */ (document.getElementById("editCategory-new"));
        const editServings = /** @type {HTMLInputElement} */ (document.getElementById("editServings-new"));
        const editIngredients = /** @type {HTMLElement} */ (document.getElementById("editIngredients-new"));
        const editSteps = /** @type {HTMLElement} */ (document.getElementById("editSteps-new"));
        const editYoutubeUrl = /** @type {HTMLInputElement} */ (document.getElementById("editVideoUrl-new"));

        /** @type {Recipe} */
        const newRecipe = ({
            title: editTitle.value.trim(),
            time: Number(editTime.value),
            category: editCategory.value,
            servings: Number(editServings.value),
            ingredients: collectIngredients(editIngredients),
            steps: collectSteps(editSteps),
            type: "local",
            isFavorite,
            profileId: session.profileId,
            mainImage: mainImageData,
            youtubeUrl: editYoutubeUrl.value.trim()
        });
        
        const valid = validateRecipe(newRecipe);

        if (!valid) return;
        
        try {
            await addRecipe(newRecipe);
            window.location.hash = "#/recipes";
            window.location.reload();
        } catch (error) {
            console.error("Error adding recipe:", error);
            alert("Failed to add recipe: " + error.message);
        }
    });
};
