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



function loadRecipes() {
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

function saveRecipes(list) {
    try {
        const raw = JSON.stringify(list);
        localStorage.setItem(LS_KEY_RECIPES, raw);
    } catch (e) {
        console.error("Помилка збереження в localStorage", e);
    }
}

function addRecipe(recipe) {
    const list = loadRecipes();
    list.push(recipe);
    saveRecipes(list);
}


// Модель рецепта (описово):
// {
//   id: string,              // унікальний ідентифікатор
//   title: string,           // назва (обов’язково)
//   category: string,        // категорія (обов’язково, зі списку)
//   time: number,            // час у хвилинах (≥0)
//   servings: number,        // кількість порцій (≥1)
//   ingredients: [           // масив інгредієнтів
//     { name: string, qty: number, unit: string }
//   ],
//   steps: [ string ],       // масив рядків із кроками
//   notes: string,           // опціонально
//   isFavorite: boolean,     // true/false
//   type: "local"|"external",// джерело рецепта
//   sourceUrl: string,       // якщо зовнішній
//   previewImage: string,    // URL прев’ю
//   embedCode: string,       // для YouTube/Instagram
//   createdAt: string,       // ISO-дата
//   updatedAt: string        // ISO-дата
// }

// Публічні інтерфейси (API):

// - updateRecipe(id, patch)
// - deleteRecipe(id)
// - toggleFavorite(id)
// - loadSettings()
// - saveSettings(settings)
// - hydrate()        // підкинути seed-дані при першому запуску
// - clearAll()       // очистити все (для дев/тестів)
