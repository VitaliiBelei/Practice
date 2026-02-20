import { loadSession, clearSession } from "../store.js";
import { loadProfilePage } from "./profile.js";
import { registerProfile, loginProfile } from "./auth.js";
import { homePage } from "../app.js";

export function createNavigation() {
    const session = loadSession();
    const nav = document.getElementById('nav');
    const buttons = document.getElementById('buttons');
    if (!nav) return;

    if (session ) {
        // Logged in navigation
        nav.innerHTML = `
            <a href="#/homeLogin" id="homeLoginPage">Home</a>
            <a href="#/recipes">Recipes</a>
            <a href="#/add">Add</a>
        `;
        if (window.location.hash.split('?')[0] !== "#/profile") {
            buttons.innerHTML = `
            <button class="mainbutton" id="profileBtn">Profile</button>
            <button class="mainbutton" id="logoutBtn">Logout</button> 
            `;
        } else {
            buttons.innerHTML = `
            <button class="mainbutton" id="editProfileBtn">Edit Profile</button>
            <button class="mainbutton" id="settingsBtn">Settings</button>
            `;
        };
        // Add logout functionality
        const logoutBtn = document.getElementById("logoutBtn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", async () => {
                clearSession();
                loadProfilePage(null, "unlogin");
                createNavigation(); // Recreate navigation
                window.location.hash = "#/home";
            });
        }

        const profileBtn = document.getElementById("profileBtn");
        if (profileBtn) {
            profileBtn.addEventListener("click", () => {
                window.location.hash = "#/profile";
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
    //Add title click functionality
    const title = document.getElementById("banner");
    if (title) {
        title.addEventListener("click", () => {
            if (session) {
                window.location.hash = "#/homeLogin";  
            }
            else {
                window.location.hash = "#/home";
            }
            homePage();
        });
    }
}