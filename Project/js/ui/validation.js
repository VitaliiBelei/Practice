export function validateRecipe(patch) {

    console.log('patch.ingredients', patch.ingredients);
    
    if (!patch.title || patch.title.length < 3) {
        alert("Title must be at least 3 characters");
        return false;
    }
    if (patch.title.length > 120) {
        alert("Title must be no more than 120 characters");
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
    for (const ing of patch.ingredients) {
        if (!ing.name || ing.name.trim().length === 0) {
            alert("Each ingredient must have a name");
            return false;
        }
    }

    if (!patch.steps || patch.steps.length === 0) {
        alert("Add at least one step");
        return false;
    }
    for (const step of patch.steps) {
        if (!step || step.trim().length === 0) {
            alert("Each step must not be empty");
            return false;
        }
    }

    return true;
}
