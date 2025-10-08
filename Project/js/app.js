import {addRecipe, saveProfile, loadProfile, loadProfiles, saveSession, loadSession, clearSession, updateProfile, loadUserRecipes, getRecipeById, deleteProfile } from "./store.js";
import {recipeFormHTML, recipeFormButtons, editFormAdd, collectIngredients, collectSteps} from "./ui/recipeForm.js";
import {recipeCard} from "./ui/recipeCard.js";
import {validateRecipe} from "./ui/validation.js";
import {loadProfilePage, registerProfile, loginProfile, editProfile} from "./ui/profile.js";
import {renderSettings} from "./ui/settings.js";


// Render recipes to the #recipes container
function renderRecipes(recipes) {
    const container = document.getElementById("recipes");
    if (!container) return;

    container.innerHTML ="";

    if (!recipes || recipes.length === 0) {
        container.innerHTML = `<p>No recipes</p>`;
        const c = document.getElementById("counter");
    if (c) c.textContent = "Find: 0";
    return;
    }

    container.innerHTML = recipes.map(recipeCard).join("");

    const c = document.getElementById("counter");
    if (c) c.textContent = `Find: ${recipes.length}`;
}


// Pages
export function recipesPage() {                        
    const app = document.getElementById("app");
    app.innerHTML = `
        <div id="controls">
            <form id="searchForm">
                <label for="searchInput">
                    Search recipes
                    <input type="text" id="searchInput" placeholder="Recipe">
                </label>
                <button type="reset" id="resetBtn">Reset</button>
            </form>
        <select id="category">
            <option value="all">All categories</option>       
            <option value="breakfasts">Breakfasts</option>
            <option value="dinners">Dinners</option>
            <option value="salads">Salads</option>
            <option value="soups">Soups</option>
            <option value="meat">Meat</option>
            <option value="fish">Fish</option>
        </select>
        <label><input type="checkbox" id="onlyFav"> Only favorites</label>
        </div>
        <div id="recipes"></div>
        <p id="counter" aria-live="polite"></p>
    `;

    const session = loadSession();
    const id = session.profileId;
    const allRecipes = loadUserRecipes(id);
    renderRecipes(allRecipes);

    const searchForm = document.getElementById("searchForm")
    const category = document.getElementById("category");
    const onlyFav = document.getElementById("onlyFav");
    const search = document.getElementById("searchInput");  

    onlyFav.addEventListener("change", searchRecipe);
    category.addEventListener("change", searchRecipe);
    search.addEventListener("input", searchRecipe);

    searchForm.addEventListener("reset", () => {
        onlyFav.checked = false;
        category.value = "all";
        search.value = "";
        setTimeout(refresh, 0);
    });

    function searchRecipe () {
    const list = loadUserRecipes(id);
    const q = search.value.trim().toLowerCase();
    const filtered = list.filter(recipe => 
        (!onlyFav.checked || recipe.isFavorite)   &&
        (category.value === "all" || recipe.category === category.value) &&
        (q === "" || recipe.title.toLowerCase().includes(q))
    )
    renderRecipes(filtered);             // сортування
    };

    function refresh() {
        searchRecipe();
    };

    recipeFormButtons(refresh);

    const showRecipeDetail = async (id) => {
        const recipe = getRecipeById(id);
        if (!recipe) return;
        const { renderRecipeDetail } = await import("./ui/recipeDetail.js");
        renderRecipeDetail(recipe);
    };

    const recipesContainer = document.getElementById("recipes");
    if (recipesContainer) {
        recipesContainer.addEventListener("click", (e) => {
            if (e.target.tagName === 'H2') {
                const card = e.target.closest(".recipe-card");
                if (!card) return;
                const id = card.getAttribute("data-id");
                if (!id) return;
                showRecipeDetail(id);
                return;
            }
        });
    }
}

export function addPage() {
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

    form.addEventListener("submit", (e) => {
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
        };
        
        const valid = validateRecipe(newRecipe);

        if (!valid) return;
        addRecipe(newRecipe);

        // Toast/status message
        const toast = document.createElement('div');
        toast.setAttribute('role', 'status');
        toast.style.position = 'relative';
        toast.style.display = 'block';
        toast.style.marginBottom = '1em';
        toast.style.background = '#333';
        toast.style.color = '#fff';
        toast.style.padding = '0.5em 1em';
        toast.style.borderRadius = '6px';
        toast.style.fontSize = '1em';
        toast.style.zIndex = '1000';
        toast.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
        toast.textContent = 'Recipe added!';

        form.parentElement.insertBefore(toast, form);
        setTimeout(() => {
            toast.remove();
            window.location.hash = "#/recipes";
        }, 2000);
    });
};
    
export function favoritesPage() {
    const app = document.getElementById("app");

    app.innerHTML = `
        <h2>Favorites</h2>
        <div id="recipes"></div>
        <p id="counter" aria-live="polite"></p>
    `;

    const session = loadSession();
    const id = session.profileId;
    const list = loadUserRecipes(id);
    const filtered = list.filter(recipe => 
        (recipe.isFavorite === "true" || recipe.isFavorite === true)   
    );

    renderRecipes(filtered);     

    if (filtered.length === 0) {
        document.getElementById("recipes").innerHTML = `<p>No favorite recipes yet</p>`;
        const c = document.getElementById("counter");
        if (c) c.textContent = "Find: 0";
    };
    
    function refresh() {
        const filtered = loadUserRecipes(id).filter(r => !!r.isFavorite);
        renderRecipes(filtered);
    };

    recipeFormButtons(refresh);       
};


export function profilePage(){
    
    const session = loadSession();
    const profile = session ? loadProfile(session.profileId) : null;
    loadProfilePage(profile, session ? session.status : "unlogin");
    
    function initProfileButtons(profile, session) {
        const logoutBtn = document.getElementById("logoutBtn");
        if (logoutBtn) {
            logoutBtn.disabled = false;
            logoutBtn.classList.remove("disabled");
            logoutBtn.onclick = () => {
                clearSession();
                loadProfilePage(null, "unlogin");
                initProfileButtons(null, {status: "unlogin"});
                window.location.hash = "#/home";
            };
        }
        const settingsBtn = document.getElementById("settingsBtn");
        if (settingsBtn) {
            settingsBtn.disabled = false;
            settingsBtn.classList.remove("disabled");
            settingsBtn.onclick = () => {
                settingsPage();
            };
        }

        const editProfileBtn = document.getElementById("editProfileBtn");
        if (editProfileBtn) {
            editProfileBtn.disabled = false;
            editProfileBtn.classList.remove("disabled");
            editProfileBtn.onclick = () => {
                editProfile(profile);
                setTimeout(() => {
                    const editProfileForm = document.getElementById("editProfileForm");
                    if (!editProfileForm) return;
                    const fotoInput = editProfileForm.querySelector("input[name='foto']");
                    let fotoData = profile.foto || "img/foto.png";
                    if (fotoInput) {
                        fotoInput.onchange = (e) => {
                            const file = fotoInput.files[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onload = function(ev) {
                                    fotoData = ev.target.result;
                                };
                                reader.readAsDataURL(file);
                            }
                        };
                    }
                    editProfileForm.onsubmit = (e) => {
                        e.preventDefault();
                        const id = profile.profileId;
                        if (!id) return;
                        const nameInput = editProfileForm.querySelector("input[name='name']");
                        const emailInput = editProfileForm.querySelector("input[name='email']");
                        const locationInput = editProfileForm.querySelector("input[name='location']");
                        const fcInput = editProfileForm.querySelector("input[name='fc']");
                        const bioInput = editProfileForm.querySelector("textarea[name='bio']");
                        const linkInput = editProfileForm.querySelector("input[name='link']");
                        const updatedProfile = {
                            ...profile,
                            foto: fotoData,
                            name: nameInput.value.trim(),
                            email: emailInput.value.trim(),
                            location: locationInput.value.trim(),
                            fc: fcInput.value.trim(),
                            bio: bioInput.value.trim(),
                            link: linkInput.value.trim(),
                            updatedAt: new Date().toISOString(),
                        };
                        updateProfile(id, updatedProfile);
                        loadProfilePage(updatedProfile, session ? session.status : "unlogin");
                        initProfileButtons(updatedProfile, session);
                    };
                }, 0);
            };
        }
    }
    initProfileButtons(profile, session);
    const profilePageLoad = document.getElementById("profilePage");
    profilePageLoad.addEventListener("click", () => {
        profilePage();
    });

    function settingsPage() {
        renderSettings();
        const settingsMessage = document.getElementById("settingsMessage");
        const languageSelect = document.getElementById("language");
        const themeSelect = document.getElementById("theme");
        const unitsSelect = document.getElementById("units");
    
        if (profile && profile.settings) {
            languageSelect.value = profile.settings.language;
            themeSelect.value = profile.settings.theme;
            unitsSelect.value = profile.settings.units;
        };
    
        const saveSettingsBtn = document.getElementById("saveSettingsBtn");
        saveSettingsBtn.addEventListener("click", () => {
            if (!profile) return;
            const newSettings = {
                language: languageSelect.value,
                theme: themeSelect.value,
                units: unitsSelect.value
            };

            updateProfile(profile.profileId, { settings: newSettings });
            settingsMessage.textContent = "Settings saved successfully!";
            setTimeout(() => {profilePage()}, 2000);
        });
    
        const resetSettingsBtn = document.getElementById("resetSettingsBtn");
        resetSettingsBtn.addEventListener("click", () => {
            if (!profile) return;
            const defaultSettings = {
                language: "en",
                theme: "system",
                units: "metric"
            };
            updateProfile(profile.profileId, { settings: defaultSettings });
            languageSelect.value = defaultSettings.language;
            themeSelect.value = defaultSettings.theme;
            unitsSelect.value = defaultSettings.units;
            settingsMessage.textContent = "Settings reset to default!";
        });

        const cancelBtn = document.getElementById("cancelBtn");
        cancelBtn.addEventListener("click", () => {
            if (!profile) return;
            loadProfilePage(profile, session ? session.status : "unlogin");
            initProfileButtons(profile, session);
        });

        const deleteAccountBtn = document.getElementById("deleteAccountBtn");
        deleteAccountBtn.addEventListener("click", () => {
            if (!profile) return;
            const confirmed = confirm("Are you sure you want to delete your account? This action cannot be undone.");
            if (!confirmed) return;
            deleteProfile(profile.profileId);
            clearSession();
            loadProfilePage(null, "unlogin");
            initProfileButtons(null, {status: "unlogin"});
            window.location.hash = "#/home";
        });
    };
    
    const settingsBtn = document.getElementById("settingsBtn");
    if (settingsBtn) {
        settingsBtn.disabled = false;
        settingsBtn.classList.remove("disabled");
        settingsBtn.onclick = () => {
           settingsPage();
        };
    };
};

export function homePage() {
    const session = loadSession();
    if (!session) {
    function initProfileButtons() {
        const app = document.getElementById("app");
        app.innerHTML = `
            <h2>Welcome to the Recipe App</h2>
            <p>Discover and share amazing recipes!</p>
        `;
        const nav = document.getElementById('nav');
        nav.innerHTML = `
            <button id="registerBtn">Register</button>
            <button id="loginBtn">Login</button>
        `;
    
        const registerBtn = document.getElementById("registerBtn");
        if (registerBtn) {
            registerBtn.addEventListener("click", () => {
                registerProfile();
                const registerForm = document.getElementById("registerForm");
                const nameInput = registerForm.querySelector("input[name='name']");
                const emailInput = registerForm.querySelector("input[name='email']");
                const passwordInput = registerForm.querySelector("input[name='password']");
                const fotoInput = registerForm.querySelector("input[name='foto']");
                let fotoData = "img/foto.png";
                if (fotoInput) {
                    fotoInput.addEventListener("change", (e) => {
                        const file = fotoInput.files[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onload = function(ev) {
                                fotoData = ev.target.result;
                            };
                            reader.readAsDataURL(file);
                        }
                    });
                }
                registerForm.addEventListener("submit", (e) => {
                    e.preventDefault();
                    const profile = {
                        name: nameInput.value.trim(),
                        email: emailInput.value.trim(),
                        password: passwordInput.value.trim(),
                        foto: fotoData,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        profileId: 'user_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36),
                        settings: {
                            language: "en",
                            theme: "system",
                            units: "metric"
                        }
                    };
                    saveProfile(profile);
                    const session = {profileId: profile.profileId, status: "login", loggetAt: new Date().toISOString()};
                    loadProfilePage(profile, session.status);
                    saveSession(session);
                });
            });
        };

            const loginBtn = document.getElementById("loginBtn");
            if (loginBtn) {
                loginBtn.addEventListener("click", () => {
                loginProfile();
                const loginForm = document.getElementById("loginForm");
                if (!loginForm) return;
                loginForm.addEventListener("submit", (e) => {
                    e.preventDefault();
                    const emailInput = loginForm.querySelector("input[name='email']");
                    const passwordInput = loginForm.querySelector("input[name='password']");
                    if (!emailInput || !passwordInput) return;
                    const profiles = loadProfiles();
                    const profile = profiles.find(p => p.email === emailInput.value.trim().toLowerCase());
                    if (!profile) {
                        alert("No user with this email");
                        return;
                    }
                    if (profile.password !== passwordInput.value.trim()) {
                        alert("Incorrect password");
                        return;
                    }
                const session = {profileId: profile.profileId, status: "login", loggetAt: new Date().toISOString()};
                loadProfilePage(profile, session.status);
                saveSession(session);
                window.location.hash = "#/profile";
                });
            });
        };
    };
    initProfileButtons();
    const title = document.getElementById("h1");
    title.addEventListener("click", () => {
        if (!session) {
            homePage();
        }
        else {
            window.location.hash = "#/profile";
        };
    });
    }
    else {
        window.location.hash = "#/profile";
    };
};
