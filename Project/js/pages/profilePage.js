import { loadSession, loadProfile, clearSession, updateProfile, deleteProfile } from "../store.js";
import { loadProfilePage, editProfile } from "../ui/profile.js";
import { createNavigation } from "../ui/navigation.js";
import { handleFileInput } from "../utils/fileHandler.js";
import { saveTheme, defaultTheme, applyTheme } from "../utils/theme.js";

// Settings rendering function (moved from ui/settings.js)
function renderSettings() {
    const app = document.getElementById("app");
    if (!app) return;
    app.innerHTML = `
        <div class="settings-container">
            <h2>Settings</h2>
            <form id="languageForm">
                <label for="language">Choose Language:</label>
                <select name="language" id="language">
                    <option value="en">English</option>
                    <option value="ua">Ukrainian</option>
                    <option value="zh">Chinese</option>
                    <option value="pt">Portuguese</option>
                    <option value="it">Italian</option>
                    <option value="de">German</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                </select>
            </form>
            <form id="themeForm">
                <label for="theme">Choose Theme:</label>
                <select name="theme" id="theme">
                    <option value="system">System Default</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                </select>
            </form>
            <form id="valuesForm">
                <label for="units">Measurement Units:</label>
                <select name="units" id="units">
                    <option value="metric">Metric (grams, liters)</option>
                    <option value="imperial">Imperial (ounces, cups)</option>
                </select>
            </form>
            <button id="saveSettingsBtn">Save Settings</button>
            <button id="resetSettingsBtn">Reset to Default</button>
            <button id="deleteAccountBtn">Delete Account</button>
            <button id="cancelBtn">Cancel</button>
            <div id="settingsMessage"></div>
        </div>
        `;
}

function setupEditProfileForm(profile) {
    /** @type {HTMLFormElement | null} */
    const editProfileForm = /** @type {HTMLFormElement | null} */ (document.getElementById("editProfileForm"));
    if (!editProfileForm) return;
    
    /** @type {HTMLInputElement | null} */
    const fotoInput = /** @type {HTMLInputElement | null} */ (editProfileForm.querySelector("input[name='foto']"));
    let fotoData = profile.foto || "img/foto.png";

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
    
    editProfileForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(editProfileForm);
        const updatedProfile = {
            ...profile,
            name: formData.get("name"),
            email: formData.get("email"),
            location: formData.get("location"),
            fc: formData.get("fc"),
            bio: formData.get("bio"),
            link: formData.get("link"),
            foto: fotoData,
            updatedAt: new Date().toISOString()
        };
        updateProfile(profile.profileId, updatedProfile);
        window.location.hash = "#/profile";
    });
}

function setupSettingsForm(profile) {
    const settingsMessage = document.getElementById("settingsMessage");
    /** @type {HTMLSelectElement | null} */
    const languageSelect = /** @type {HTMLSelectElement | null} */ (document.getElementById("language"));
    /** @type {HTMLSelectElement | null} */
    const themeSelect = /** @type {HTMLSelectElement | null} */ (document.getElementById("theme"));
    /** @type {HTMLSelectElement | null} */
    const unitsSelect = /** @type {HTMLSelectElement | null} */ (document.getElementById("units"));
    if (!languageSelect || !themeSelect || !unitsSelect) return;

    if (profile && profile.settings) {
        languageSelect.value = profile.settings.language;
        themeSelect.value = profile.settings.theme;
        unitsSelect.value = profile.settings.units;
    }

    /** @type {HTMLButtonElement | null} */
    const saveSettingsBtn = /** @type {HTMLButtonElement | null} */ (document.getElementById("saveSettingsBtn"));
    if (!saveSettingsBtn) return;
    saveSettingsBtn.addEventListener("click", async (event) => {
        event.preventDefault();
        if (!profile) return;
        const newSettings = {
            language: languageSelect.value,
            theme: themeSelect.value,
            units: unitsSelect.value
        };
        if (newSettings.theme !=="system") {
            saveTheme(newSettings.theme);
        }
        else {
            defaultTheme();
        }
        try {
            await updateProfile(profile.profileId, { settings: newSettings });            
            if (settingsMessage) settingsMessage.textContent = "Settings saved successfully!";
            setTimeout(() => { window.location.hash = "#/profile"; }, 1200);
        } catch (error) {
            console.error("Error saving settings:", error);
            if (settingsMessage) settingsMessage.textContent = "Failed to save settings.";
        } 
    });

    /** @type {HTMLButtonElement | null} */
    const resetSettingsBtn = /** @type {HTMLButtonElement | null} */ (document.getElementById("resetSettingsBtn"));
    if (!resetSettingsBtn) return;
    resetSettingsBtn.addEventListener("click", async (event) => {
        event.preventDefault();
        if (!profile) return;
        const defaultSettings = {
            language: "en",
            theme: "system",
            units: "metric"
        };
        try {
            await updateProfile(profile.profileId, { settings: defaultSettings });
            profile.settings = defaultSettings;
            languageSelect.value = defaultSettings.language;
            themeSelect.value = defaultSettings.theme;
            unitsSelect.value = defaultSettings.units;
            localStorage.removeItem("theme");
            defaultTheme();
            if (settingsMessage) settingsMessage.textContent = "Settings reset to default!";
        } catch (error) {
            console.error("Error resetting settings:", error);
            if (settingsMessage) settingsMessage.textContent = "Failed to reset settings.";
        }
    });

    const cancelBtn = document.getElementById("cancelBtn");
    if (cancelBtn) {
        cancelBtn.addEventListener("click", (event) => {
            event.preventDefault();
            window.location.hash = "#/profile";
        });
    }

    const deleteAccountBtn = document.getElementById("deleteAccountBtn");
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener("click", async (event) => {
            event.preventDefault();
            if (!profile) return;
            const confirmed = confirm("Are you sure you want to delete your account? This action cannot be undone.");
            if (!confirmed) return;
            try {
                await deleteProfile(profile.profileId);
                clearSession();
                window.location.hash = "#/home";
            } catch (error) {
                console.error("Error deleting account:", error);
                if (settingsMessage) settingsMessage.textContent = "Failed to delete account.";
            }
        });
    }
}

export async function profilePage(){
    await applyTheme();
    createNavigation();
    
    const session = loadSession();
    const profile = session ? await loadProfile(session.profileId) : null;
    
    // Check URL hash parameters for actions
    const hash = window.location.hash;
    const urlParams = new URLSearchParams(hash.split('?')[1] || '');
    const action = urlParams.get('action');
    
    if (action === 'edit' && profile) {
        editProfile(profile);
        setTimeout(() => {
            setupEditProfileForm(profile);
        }, 100);
        return;
    }
    
    if (action === 'settings' && profile) {
        renderSettings();
        setTimeout(() => {
            setupSettingsForm(profile);
        }, 100);
        return;
    }
    
    // Default profile page view
    loadProfilePage(profile, session ? session.status : "unlogin");
    
    function initProfileButtons(profile, session) {
        /** @type {HTMLButtonElement | null} */
        const logoutBtn = /** @type {HTMLButtonElement | null} */ (document.getElementById("logoutBtn"));
        if (logoutBtn) {
            logoutBtn.onclick = (event) => {
                event.preventDefault();
                clearSession();
                loadProfilePage(null, "unlogin");
                initProfileButtons(null, {status: "unlogin"});
                window.location.hash = "#/home";
            };
        }
        /** @type {HTMLButtonElement | null} */
        const settingsBtn = /** @type {HTMLButtonElement | null} */ (document.getElementById("settingsBtn"));
        if (settingsBtn) {
            settingsBtn.onclick = (event) => {
                event.preventDefault();
                renderSettings();
                setTimeout(() => {
                    setupSettingsForm(profile);
                }, 100);
            };
        }

        /** @type {HTMLButtonElement | null} */
        const editProfileBtn = /** @type {HTMLButtonElement | null} */ (document.getElementById("editProfileBtn"));
        if (editProfileBtn) {
            editProfileBtn.onclick = (event) => {
                event.preventDefault();
                if (!profile) return;
                editProfile(profile);
                setTimeout(() => {
                    /** @type {HTMLFormElement | null} */
                    const editProfileForm = /** @type {HTMLFormElement | null} */ (document.getElementById("editProfileForm"));
                    if (!editProfileForm) return;
                    /** @type {HTMLInputElement | null} */
                    const fotoInput = /** @type {HTMLInputElement | null} */ (editProfileForm.querySelector("input[name='foto']"));
                    let fotoData = profile.foto || "img/foto.png";
                    if (fotoInput) {
                        fotoInput.onchange = () => {
                            const file = fotoInput.files ? fotoInput.files[0] : null;
                            if (file) {
                                const reader = new FileReader();
                                reader.onload = function(ev) {
                                    fotoData = ev.target ? ev.target.result : fotoData;
                                };
                                reader.readAsDataURL(file);
                            }
                        };
                    }
                    editProfileForm.onsubmit = (e) => {
                        e.preventDefault();
                        const id = profile.profileId;
                        if (!id) return;
                        /** @type {HTMLInputElement | null} */
                        const nameInput = /** @type {HTMLInputElement | null} */ (editProfileForm.querySelector("input[name='name']"));
                        /** @type {HTMLInputElement | null} */
                        const emailInput = /** @type {HTMLInputElement | null} */ (editProfileForm.querySelector("input[name='email']"));
                        /** @type {HTMLInputElement | null} */
                        const locationInput = /** @type {HTMLInputElement | null} */ (editProfileForm.querySelector("input[name='location']"));
                        /** @type {HTMLInputElement | null} */
                        const fcInput = /** @type {HTMLInputElement | null} */ (editProfileForm.querySelector("input[name='fc']"));
                        /** @type {HTMLTextAreaElement | null} */
                        const bioInput = /** @type {HTMLTextAreaElement | null} */ (editProfileForm.querySelector("textarea[name='bio']"));
                        /** @type {HTMLInputElement | null} */
                        const linkInput = /** @type {HTMLInputElement | null} */ (editProfileForm.querySelector("input[name='link']"));
                        if (!nameInput || !emailInput || !locationInput || !fcInput || !bioInput || !linkInput) return;
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
    if (profilePageLoad) {
        profilePageLoad.addEventListener("click", async (event) => {
            event.preventDefault();
            await profilePage();
        });
    }
    
    /** @type {HTMLButtonElement | null} */
    const settingsBtn = /** @type {HTMLButtonElement | null} */ (document.getElementById("settingsBtn"));
    if (settingsBtn) {
        settingsBtn.onclick = (event) => {
            event.preventDefault();
            renderSettings();
            setTimeout(() => {
                setupSettingsForm(profile);
            }, 100);
        };
    };
};
