import { loadSession, addRecipe } from "../store.js";
import { recipeFormHTML } from "../ui/recipeForm/html.js";
import { editFormAdd } from "../ui/recipeForm/events.js";
import { collectIngredients, collectSteps } from "../ui/recipeForm/data.js";
import { validateRecipe } from "../ui/recipeForm/validation.js";
import { createNavigation } from "../ui/navigation.js";
import { handleFileInput } from "../utils/fileHandler.js";

export async function addPage() {
    await createNavigation();
    
    const session = loadSession();
    const emptyRecipe = {
        title: "",
        category: "breakfasts",
        time: 1,
        servings: 1,
        ingredients: [],
        steps: [],
        isFavorite: false,
        profileId: "",
    };
    const app = document.getElementById("app");
    app.innerHTML = `
        <h2>Add New Recipe</h2>
        ${recipeFormHTML(emptyRecipe, "add")}

    `;
    editFormAdd("new");

    document.getElementById("cancelEdit-new").addEventListener("click", () => {
        window.location.hash = "#/profile";
    });

    const form = document.getElementById(`editForm-new`);

    const favBtn = document.getElementById("favBtn-new");

    let isFavorite = false;

    if (favBtn) {
        favBtn.addEventListener("click", () => {
            isFavorite = !isFavorite;
            favBtn.textContent = isFavorite ? "★" : "☆";
            favBtn.setAttribute("aria-pressed", String(isFavorite));
            favBtn.setAttribute("aria-label", isFavorite ? "Unmark as favorite" : "Mark as favorite");
        });
    };

    let mainImageData = "img/norecipe.png";
    
    // Use handleFileInput utility to avoid duplication
    const mainImageInput = document.querySelector(".add-mainimage");
    if (mainImageInput) {
        handleFileInput(mainImageInput, (result) => {
            mainImageData = result;
            // Update preview image if it exists
            const imagePreview = document.getElementById("imagePreview-new");
            if (imagePreview) {
                imagePreview.src = result;
            }
        });
    }
    

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const editTitle = document.getElementById("editTitle-new");
        const editTime = document.getElementById("editTime-new");
        const editCategory = document.getElementById("editCategory-new");
        const editServings = document.getElementById("editServings-new");
        const editIngredients = document.getElementById("editIngredients-new");
        const editSteps = document.getElementById("editSteps-new");

        const newRecipe = {
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
        };
        
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