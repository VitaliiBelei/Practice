const LS_KEY_RECIPES = 'cookbook_recipes';
const LS_KEY_SETTINGS = 'cookbook_settings';

const demoRecipes = [
  {
    id: "r1",
    title: "Omelet",
    category: "breakfasts",
    time: 10,
    servings: 2,
    ingredients: [
        { name: "Aggs", qty: 3, unit: "pcs" }
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
        { name: "Cucumber", qty: 2, unit: "шт" },
        { name: "Tomato", qty: 2, unit: "шт" },
        { name: "Onion", qty: 0.5, unit: "шт" },
        { name: "Sunflowers oil", qty: 2, unit: "ст.л." },
        { name: "Salt", qty: 1, unit: "щіпка" }
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

export function saveRecipes(list) {
    try {
        const raw = JSON.stringify(list);
        localStorage.setItem(LS_KEY_RECIPES, raw);
    } catch (e) {
        console.error("Error saving to localStorage", e);
    }
}

export function addRecipe(recipe) {
    if (!recipe.title || !recipe.category) {    //доробити валідацію
        console.error("The fields is empty");
        return;
    }  
    const list = loadRecipes();
    recipe.id = "r_" + Date.now().toString();
    recipe.isFavorite = false;
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

export function loadSettings() {
    const raw = localStorage.getItem(LS_KEY_SETTINGS);
    if (!raw) {
        return {
            category: "all",
            sortBy: "createdAt",
            theme: "light"
        };
    }
    try {
       return JSON.parse(raw);
    } catch (error) {
        console.error("Error reading from localStorage", error);
        return {
            category: "all",
            sortBy: "createdAt",
            theme: "light"
        };
    }
}

export function saveSettings(settings) {
    try {
        const raw = JSON.stringify(settings);
        localStorage.setItem(LS_KEY_SETTINGS, raw);
    } catch (error) {
        console.error("Error saving to localStorage", error);
    }
}

function hydrate() {
    const list = loadRecipes();
    if (list.length === 0) {
        saveRecipes(demoRecipes);
    }
}
hydrate();

export function clearAll () {
    localStorage.removeItem(LS_KEY_RECIPES);
    localStorage.removeItem(LS_KEY_SETTINGS);
}
