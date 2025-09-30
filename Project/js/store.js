const LS_KEY_RECIPES = 'cookbook_recipes';
const LS_KEY_PROFILE = 'cookbook_profile';
const LS_KEY_SESSION = 'cookbook_session';

export function loadRecipes() {
    const recipe = localStorage.getItem(LS_KEY_RECIPES);
    if (!recipe) {
        return [];
    }
    try {
       return JSON.parse(recipe);
    } catch (e) {
        console.error("Error reading from localStorage", e);
        return [];
    }
}

export function loadUserRecipes(id) {
    const list = loadRecipes();
    return list.filter(recipe => recipe.profileId === id || null);
}

export function saveRecipes(list) {
    try {
        const raw = JSON.stringify(list);
        localStorage.setItem(LS_KEY_RECIPES, raw);
    } catch (e) {
        console.error("Error saving to localStorage", e);
    }
}

export function addRecipe(recipe) {
    const list = loadRecipes();
    recipe.id = "r_" + Date.now().toString();
    recipe.createdAt = new Date().toISOString()
    recipe.updatedAt = recipe.createdAt;
    list.push(recipe);
    saveRecipes(list);
}

export function getRecipeById(id) {
    const list = loadRecipes();
    return list.find(recipe => recipe.id === id) || null;
}

export function updateRecipe(id, patch) {
    const list = loadRecipes();
    const index = list.findIndex(r => r.id === id);
    if (index === -1) return console.error("Resipe is not found");

    list[index] = {
        ...list[index],
        ...patch,
        updatedAt: new Date().toISOString()
    };

    saveRecipes(list);
}

export function deleteRecipe(id) {
    const list = loadRecipes();
    const newList = list.filter(r => r.id !== id);
    saveRecipes(newList);
}

export function toggleFavorite(id) {
    const list = loadRecipes();
    const index = list.findIndex(r => r.id === id);
    if (index === -1) return console.error("Resipe is not found");
    
    list[index] = {
        ...list[index],
        isFavorite: !list[index].isFavorite,
        updatedAt: new Date().toISOString()
    };

    saveRecipes(list);
}

export function loadProfiles () {
    const profiles = localStorage.getItem(LS_KEY_PROFILE);
    if (!profiles) return [];
    try {
        return JSON.parse(profiles);
    } catch (e) {
        console.error("Error reading from localStorage", e);
        return [];
    }
}

export function loadProfile(id) {
    const list = loadProfiles();
    return list.find(profile => profile.profileId === id) || null;
}

export function saveProfile(profile) {
    if (!profile) return console.error("Profile is not defined");
    try {
        const profiles = loadProfiles();
        profiles.push(profile);
        localStorage.setItem(LS_KEY_PROFILE, JSON.stringify(profiles));
    } catch (error) {
        console.error("Error saving to localStorage", error); 
    }
}

export function updateProfile(id, patch) {
    const list = loadProfiles();
    const index = list.findIndex(p => p.profileId === id);
    if (index === -1) return console.error("Profile is not found");
    list[index] = {
        ...list[index],
        ...patch,
        updatedAt: new Date().toISOString()
    };
    try {
        localStorage.setItem(LS_KEY_PROFILE, JSON.stringify(list));
    } catch (error) {
        console.error("Error saving to localStorage", error);
    }
}
export function deleteProfile(id) {
    const list = loadProfiles();
    const newList = list.filter(p => p.profileId !== id);
    try {
        localStorage.setItem(LS_KEY_PROFILE, JSON.stringify(newList));
    } catch (error) {
        console.error("Error saving to localStorage", error);
    }
    const recipes = loadRecipes();
    const newRecipes = recipes.filter(r => r.profileId !== id);
    try {
        localStorage.setItem(LS_KEY_RECIPES, JSON.stringify(newRecipes));
    } catch (error) {
        console.error("Error saving to localStorage", error);
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
