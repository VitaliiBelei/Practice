import { loadSession, loadProfile, clearSession } from "../store.js";
import { loadProfilePage, editProfile } from "./profile.js";
import { registerProfile, loginProfile } from "./auth.js";

export async function createNavigation() {
    const nav = document.getElementById('nav');
    const buttons = document.getElementById('buttons');
    if (!nav) return;

    const session = loadSession();
    const profile = session ? await loadProfile(session.profileId) : null;

    if (session && profile) {
        // Logged in navigation
        nav.innerHTML = `
            <a href="#/profile" id="profilePage">Profile</a>
            <a href="#/recipes">Recipes</a>
            <a href="#/add">Add</a>
            <a href="#/favorites">Favorites</a>
        `;
        buttons.innerHTML = `
            <button id="logoutBtn">Logout</button> 
            <button id="editProfileBtn">Edit Profile</button>
            <button id="settingsBtn">Settings</button>
        `;

        // Add logout functionality
        const logoutBtn = document.getElementById("logoutBtn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", async () => {
                clearSession();
                loadProfilePage(null, "unlogin");
                await createNavigation(); // Recreate navigation
                window.location.hash = "#/home";
            });
        }

        // Add edit profile functionality
        const editProfileBtn = document.getElementById("editProfileBtn");
        if (editProfileBtn) {
            editProfileBtn.addEventListener("click", () => {
                window.location.hash = "#/profile?action=edit";
            });
        }

        // Add settings functionality
        const settingsBtn = document.getElementById("settingsBtn");
        if (settingsBtn) {
            settingsBtn.addEventListener("click", () => {
                window.location.hash = "#/profile?action=settings";
            });
        }
    } else {
        // Not logged in navigation
        nav.innerHTML = `
            <button id="registerBtn">Register</button>
            <button id="loginBtn">Login</button>
        `;
        buttons.innerHTML = '';

        // Add register functionality
        const registerBtn = document.getElementById("registerBtn");
        if (registerBtn) {
            registerBtn.addEventListener("click", () => {
                registerProfile();
            });
        }

        // Add login functionality
        const loginBtn = document.getElementById("loginBtn");
        if (loginBtn) {
            loginBtn.addEventListener("click", () => {
                loginProfile();
            });
        }
    }
}