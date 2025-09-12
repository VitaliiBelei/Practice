export function validateRecipe(patch) {
    
    if (!patch.title || patch.title.length < 3) {
        alert("Title must be at least 3 characters");
        return false;
    }

    if (!patch.time || patch.time <= 0) {
        alert("Time must be a positive number");
        return false;
    }

    if (!patch.servings || patch.servings <= 0) {
        alert("Servings must be a positive number");
        return false;
    }
    if (!patch.ingredients || patch.ingredients.length === 0) {
        alert("Add at least one ingredient");
        return false;
    }
    if (!patch.steps || patch.steps.length === 0) {
        alert("Add at least one step");
        return false;
    }
   
    return true;
}
