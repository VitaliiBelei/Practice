const LS_KEY_RECIPES = 'cookbook_recipes';
const LS_KEY_SETTINGS = 'cookbook_settings';

const demoRecipes = [
  {
    id: "r1",
    title: "Омлет",
    category: "Сніданок",
    time: 10,
    servings: 2,
    ingredients: [
        { name: "Яйця", qty: 3, unit: "шт" }
    ],
    steps: ["Збити яйця", "Посмажити"],
    isFavorite: false,
    type: "local",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "r2",
    title: "Овочевий салат",
    category: "Салати",
    time: 15,
    servings: 3,
    ingredients: [
        { name: "Огірок", qty: 2, unit: "шт" },
        { name: "Помідор", qty: 2, unit: "шт" },
        { name: "Цибуля", qty: 0.5, unit: "шт" },
        { name: "Олія", qty: 2, unit: "ст.л." },
        { name: "Сіль", qty: 1, unit: "щіпка" }
    ],
    steps: [
        "Нарізати овочі кубиками",
        "Додати олію та сіль",
        "Перемішати"
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
        console.error("Помилка читання з localStorage", e);
        return [];
    }
}

export function saveRecipes(list) {
    try {
        const raw = JSON.stringify(list);
        localStorage.setItem(LS_KEY_RECIPES, raw);
    } catch (e) {
        console.error("Помилка збереження в localStorage", e);
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
    if (index === -1) return console.error("Рецепт не знайдено");

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
    if (index === -1) return console.error("Рецепт не знайдено");
    
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
    } catch (e) {
        console.error("Помилка читання з localStorage", e);
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
    } catch (e) {
        console.error("Помилка збереження в localStorage", e);
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
