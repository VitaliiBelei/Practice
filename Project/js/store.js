const LS_KEY_RECIPES = 'cookbook_recipes';
const LS_KEY_PROFILE = 'cookbook_profile';
const LS_KEY_SESSION = 'cookbook_session';

const demoRecipes = [
  {
    id: "r1",
    title: "Omelet",
    category: "breakfasts",
    time: 10,
    servings: 2,
    ingredients: [
        { name: "Eggs", qty: 3, unit: "pcs" }
    ],
    steps: ["Beat the eggs", "Fry"],
    isFavorite: true,
    type: "local",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "r2",
    title: "Vegetable salad",
    category: "salads",
    time: 15,
    servings: 3,
    ingredients: [
        { name: "Cucumber", qty: 2, unit: "pcs" },
        { name: "Tomato", qty: 2, unit: "pcs" },
        { name: "Onion", qty: 0.5, unit: "pcs" },
        { name: "Sunflower oil", qty: 2, unit: "tbsp" },
        { name: "Salt", qty: 1, unit: "pinch" }
    ],
    steps: [
        "Cut the vegetables into cubes",
        "Add oil and salt",
        "Stir"
    ],
    isFavorite: false,
    type: "local",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];



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



function hydrate() {
    const list = loadRecipes();
    if (list.length === 0) {
        saveRecipes(demoRecipes);
    }
}
hydrate();

