import { loadSession, saveProfile, saveSession } from "../store.js";
import { registerProfile, loginProfile } from "../ui/auth.js";
import { handleFileInput } from "../utils/fileHandler.js";
import { validateProfile } from "../ui/recipeForm/validation.js";

export function homePage() {
    const session = loadSession();
    if (!session) {
        initProfileButtons();
    } else {
        // User is logged in, redirect to profile
        window.location.hash = "#/profile";
    }

    function initProfileButtons() {
        const app = document.getElementById("app");
        app.innerHTML = `
            <h2>Welcome to the Recipe App</h2>
            <p>Discover and share amazing recipes!</p>
        `;
        const nav = document.getElementById('nav');
        if (!nav) return;
        nav.innerHTML = `
            <button id="registerBtn">Register</button>
            <button id="loginBtn">Login</button>
        `;
    
        const registerBtn = document.getElementById("registerBtn");
        if (registerBtn) {
            registerBtn.addEventListener("click", () => {
                registerProfile();
                setTimeout(() => {
                    const registerForm = document.getElementById("registerForm");
                    if (!registerForm) return;
                    
                    /** @type {HTMLInputElement | null} */
                    const nameInput = /** @type {HTMLInputElement | null} */ (registerForm.querySelector("input[name='name']"));
                    /** @type {HTMLInputElement | null} */
                    const emailInput = /** @type {HTMLInputElement | null} */ (registerForm.querySelector("input[name='email']"));
                    /** @type {HTMLInputElement | null} */
                    const passwordInput = /** @type {HTMLInputElement | null} */ (registerForm.querySelector("input[name='password']"));
                    /** @type {HTMLInputElement | null} */
                    const passwordConfirm = /** @type {HTMLInputElement | null} */ (registerForm.querySelector("input[name='confirm-password']"));
                    /** @type {HTMLInputElement | null} */
                    const fotoInput = /** @type {HTMLInputElement | null} */ (registerForm.querySelector("input[name='foto']"));
                    let fotoData = "img/foto.png";
                    if (!nameInput || !emailInput || !passwordInput || !passwordConfirm) return;
                    
                    if (fotoInput) {
                        handleFileInput(fotoInput, (result) => {
                        fotoData = result;
                        // Update preview image if it exists
                        /** @type {HTMLImageElement | null} */
                        const imagePreview = /** @type {HTMLImageElement | null} */ (document.getElementById("image-preview-profile"));
                        if (imagePreview) {
                            imagePreview.src = result;
                        }
                        });
                    }
                    
                    registerForm.addEventListener("submit", async (e) => {
                        e.preventDefault();
                        const passwordContainer = document.getElementById('password-register');
                        const tagP = passwordContainer.querySelector('p');
                        if (tagP) {
                        tagP.remove();
                        }
                        if (passwordInput.value !== passwordConfirm.value) {
                            const p = document.createElement('p');
                            p.textContent = 'Password does not match!';
                            p.style.color = 'red';
                            passwordContainer.appendChild(p);
                            return;
                        }
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
                        try {
                            const isValid = await validateProfile();
                            if (!isValid) {
                                return;
                            }
                            await saveProfile(profile);
                            const session = {profileId: profile.profileId, status: "login", loggetAt: new Date().toISOString()};
                            saveSession(session);
                            window.location.hash = "#/profile";
                        } catch (error) {
                            console.error("Registration failed:", error);
                            alert("Registration failed: " + error.message);
                        }
                    });
                }, 100);
            });
        }

        const loginBtn = document.getElementById("loginBtn");
        if (loginBtn) {
            loginBtn.addEventListener("click", () => {
                loginProfile();
                setTimeout(() => {
                    const loginForm = document.getElementById("loginForm");
                    if (!loginForm) return;
                    
                    loginForm.addEventListener("submit", async (e) => {
                        e.preventDefault();
                        /** @type {HTMLInputElement | null} */
                        const emailInput = /** @type {HTMLInputElement | null} */ (loginForm.querySelector("input[name='email']"));
                        /** @type {HTMLInputElement | null} */
                        const passwordInput = /** @type {HTMLInputElement | null} */ (loginForm.querySelector("input[name='password']"));
                        if (!emailInput || !passwordInput) return;
                        
                        try {
                            // Get all profiles from server
                            const response = await fetch('http://localhost:3001/profiles');
                            if (!response.ok) throw new Error("Failed to load profiles");
                            const profiles = await response.json();
                            const profile = profiles.find(p => p.email === emailInput.value.trim().toLowerCase());
                            
                            if (!profile) {
                                alert("No user with this email");
                                return;
                            }
                            
                            if (profile.password !== passwordInput.value.trim()) {
                                alert("Wrong password");
                                return;
                            }
                            
                            const session = {profileId: profile.profileId, status: "login", loggetAt: new Date().toISOString()};
                            saveSession(session);
                            window.location.hash = "#/profile";
                        } catch (error) {
                            console.error("Login failed:", error);
                            alert("Login failed. Please try again.");
                        }
                    });
                }, 100);
            });
        }
    }

    // Add title click functionality
    const title = document.getElementById("h1");
    if (title) {
        title.addEventListener("click", () => {
            if (session) {
                window.location.hash = "#/profile";  
            } 
            homePage();
        });
    }
}
