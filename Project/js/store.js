const LS_KEY_SESSION = 'cookbook_session';

export async function loadUserRecipes(profileId) {
    try {
        const response = await fetch (`http://localhost:3001/recipes?profileId=${profileId}`);
        if (!response.ok) throw new Error("Error loading recipes");
        const recipes = await response.json();
        return recipes || null; 
    } catch (error) {
        console.error("Error loading profile:", error); 
        throw error;
    }
}

export async function addRecipe(recipe) {
    if (!recipe) return console.error("Recipe is not defined");
        try {
            const response = await fetch (`http://localhost:3001/recipes`, {
                method: "POST",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify(recipe)
            });
            if (!response.ok) throw new Error("Error saving recipe");
            return await response.json();
        } catch (error) {
            console.error("Error saving recipe:", error); 
            throw error; 
        }
}

export async function getRecipeById(id) {
    try {
        const response = await fetch(`http://localhost:3001/recipes/${id}`);
        if (!response.ok) throw new Error("Error loading recipe");
        return await response.json();
    } catch (error) {
        console.error("Error loading recipe:", error);
        throw error;
    }
}

export async function updateRecipe(id, patch) {
    try {
        const response = await fetch(`http://localhost:3001/recipes/${id}`);
        if (!response.ok) throw new Error("Error loading recipe");
        const recipe = await response.json();
        
        const updatedRecipe = {
            ...recipe,
            ...patch,
            updatedAt: new Date().toISOString()
        };

        const updateResponse = await fetch(`http://localhost:3001/recipes/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(updatedRecipe)
        });

        if (!updateResponse.ok) throw new Error("Error updating recipe");
        return await updateResponse.json();
    } catch (error) {
        console.error("Error updating recipe:", error);
        throw error;
    }
}

export async function deleteRecipe(id) {
    try {
        const deleteResponse = await fetch(`http://localhost:3001/recipes/${id}`, {
            method: "DELETE",
            headers: {"Content-Type": "application/json"},
        });

        if (!deleteResponse.ok) throw new Error("Error deleting recipe");
        return await deleteResponse.json();
    } catch (error) {
        console.error("Error deleting recipe:", error);
        throw error;
    }
}

export async function toggleFavorite(id) {
    try {
        const response = await fetch(`http://localhost:3001/recipes/${id}`);
        if (!response.ok) throw new Error("Error loading recipe");
        const recipe = await response.json();
        
        const updatedRecipe = {
            ...recipe,
            isFavorite: !recipe.isFavorite,
            updatedAt: new Date().toISOString()
        };

        const updateResponse = await fetch(`http://localhost:3001/recipes/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(updatedRecipe)
        });

        if (!updateResponse.ok) throw new Error("Error updating recipe");
        return await updateResponse.json();
    } catch (error) {
        console.error("Error toggling favorite:", error);
        throw error;
    }
}

export async function loadProfiles() {
    try {
        const response = await fetch ('http://localhost:3001/profiles');
        if (!response.ok) throw new Error("Error loading profile");
        const profiles = await response.json();
        return profiles || null; 
    } catch (error) {
        console.error("Error loading profile:", error); 
        throw error;
    }
}

export async function loadProfile(profileId) {
    try {
        const response = await fetch (`http://localhost:3001/profiles?profileId=${profileId}`);
        if (!response.ok) throw new Error("Error loading profile");
        const profile = await response.json();
        return profile[0] || null; 
    } catch (error) {
        console.error("Error loading profile:", error); 
        throw error;
    }
}

export async function saveProfile(profile) {
    if (!profile) return console.error("Profile is not defined");
    try {
        const response = await fetch (`http://localhost:3001/profiles`, {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify(profile)
        });
        if (!response.ok) throw new Error("Error saving profile");
        return await response.json();
    } catch (error) {
        console.error("Error saving profile:", error); 
        throw error; 
    }
}

export async function updateProfile(profileId, patch) {
    try {
        const response = await fetch(`http://localhost:3001/profiles?profileId=${profileId}`);
        if (!response.ok) throw new Error("Error loading profile");
        const profiles = await response.json();
        
        if (!profiles[0]) throw new Error("Profile not found");
        
        const updatedProfile = {
            ...profiles[0],
            ...patch,
            updatedAt: new Date().toISOString()
        };

        const updateResponse = await fetch(`http://localhost:3001/profiles/${profiles[0].id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(updatedProfile)
        });

        if (!updateResponse.ok) throw new Error("Error updating profile");
        return await updateResponse.json();
    } catch (error) {
        console.error("Error updating profile:", error); 
        throw error;
    }
}

export async function deleteProfile(profileId) {
    try {
        const response = await fetch(`http://localhost:3001/profiles?profileId=${profileId}`);
        if (!response.ok) throw new Error("Error loading profile");
        const profiles = await response.json();
        
        if (!profiles[0]) throw new Error("Profile not found");
        
        const deleteResponse = await fetch(`http://localhost:3001/profiles/${profiles[0].id}`, {
            method: "DELETE",
            headers: {"Content-Type": "application/json"},
        });

        if (!deleteResponse.ok) throw new Error("Error deleting profile");
        return await deleteResponse.json();
    } catch (error) {
        console.error("Error deleting profile:", error); 
        throw error;
    }
}

export function saveSession(session) {
    try {
        const raw = JSON.stringify(session);
        localStorage.setItem(LS_KEY_SESSION, raw);
    } catch (e) {
        console.error("Error saving to localStorage", e);
    }
}

export function loadSession() {
    const session = localStorage.getItem(LS_KEY_SESSION);
    if (!session) {
        return null;
    }
    try {
       return JSON.parse(session);
    } catch (e) {
        console.error("Error reading from localStorage", e);
        return null;
    }
}

export function clearSession() {
    localStorage.removeItem(LS_KEY_SESSION);
}
