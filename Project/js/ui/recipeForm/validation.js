import { loadProfiles } from "../../store.js";

export function validateRecipe(patch) {
    const form = document.getElementById(`edit-form-${patch.id || "new"}`);
    
    function clearFormErrors(form) {
        form.querySelectorAll('.form-error').forEach(el => el.remove());
        form.querySelectorAll('input, textarea, select').forEach(field => {
            field.style.borderColor = '';
        });
    }
    
    if (form) clearFormErrors(form);

    function showErrorBelow(input, message) {
    
        const oldError = input.parentElement.querySelector('.form-error');
        if (oldError) oldError.remove();

        const error = document.createElement('div');
        error.className = 'form-error';
        error.textContent = message;
        error.style.color = 'red';
        input.parentElement.appendChild(error);

        const firstError = form.querySelector('.form-error');
        if (firstError) {
            if (input) {
                input.focus();
                input.style.borderColor = 'red';
            }
        }
    }

    
    if (!patch.title || patch.title.length < 3) {
        const titleInput = form.querySelector("input[name='title']");
        showErrorBelow(titleInput, "Title must be at least 3 characters");
        return false;
    }
    if (patch.title.length > 120) {
        const titleInput = form.querySelector("input[name='title']");
        showErrorBelow(titleInput, "Title must be no more than 120 characters");
        return false;
    }

    if (!patch.time || patch.time <= 0) {
        const timeInput = form.querySelector("input[name='time']");
        showErrorBelow(timeInput, "Time must be a positive number");
        return false;
    }

    if (!patch.servings || patch.servings <= 0) {
        const servingsInput = form.querySelector("input[name='servings']");
        showErrorBelow(servingsInput, "Servings must be a positive number");
        return false;
    }

    if (!patch.ingredients || patch.ingredients.length === 0) {
        const ingredientsInput = form.querySelector("fieldset[name='ingredients']");
        showErrorBelow(ingredientsInput, "Add at least one ingredient");
        return false;
    }
    for (let index = 0; index < patch.ingredients.length; index++) {
        const ing = patch.ingredients[index];
        if (!ing.name || ing.name.trim().length === 0) {
            const ingInput = form.querySelector(`input[name='ing[${index}][name]']`);
            showErrorBelow(ingInput, "Each ingredient must have a name");
            return false;
        }
        if (isNaN(ing.qty) || ing.qty <= 0) {
            const qtyInput = form.querySelector(`input[name='ing[${index}][qty]']`);
            showErrorBelow(qtyInput, "Quantity must be a positive number");
            return false;
        }
    }

    if (!patch.steps || patch.steps.length === 0) {
        const stepsInput = form.querySelector("fieldset[name='steps']");
        showErrorBelow(stepsInput, "Add at least one step");
        return false;
    }
    for (let index = 0; index < patch.steps.length; index++) {
        const step = patch.steps[index];
        if (!step || step.trim().length === 0) {
            const stepInput = form.querySelector(`textarea[name='step[${index}]']`);
            showErrorBelow(stepInput, "Each step must not be empty");
            return false;
        }
    }

    return true;
};

export async function validateProfile () {
    const registerForm = document.getElementById('registerForm');
    const emailInput = registerForm.querySelector("input[name='email']");
    
    if (!emailInput) {
        console.log('Email input not found');
        return false;
    }
    
    const profiles = await loadProfiles();
    if (!profiles) {
        console.log('Load of profiles is failed');
        return false;
    }
    for (const profile of profiles) {
        if (profile.email === emailInput.value.trim().toLowerCase()) {
            console.log('Email already exist');
            return false;
        }
    }
    return true;
};
