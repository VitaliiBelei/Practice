import { loadSession, loadProfile, clearSession, updateProfile, deleteProfile } from "../store.js";
import { loadProfilePage, editProfile } from "../ui/profile.js";
import { createNavigation } from "../ui/navigation.js";
import { handleFileInput } from "../utils/fileHandler.js";

// Settings rendering function (moved from ui/settings.js)
function renderSettings() {
    const app = document.getElementById("app");
    if (!app) return;
    app.innerHTML = `
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
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System Default</option>
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
        `;
}

function setupEditProfileForm(profile, session) {
    const editProfileForm = document.getElementById("editProfileForm");
    if (!editProfileForm) return;
    
    const fotoInput = editProfileForm.querySelector("input[name='foto']");
    let fotoData = profile.foto || "img/foto.png";

    if (fotoInput) {
            handleFileInput(fotoInput, (result) => {
                fotoData = result;
                // Update preview image if it exists
                const imagePreview = document.getElementById("imagePreview-profile");
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

function setupSettingsForm(profile, session) {
    const settingsMessage = document.getElementById("settingsMessage");
    const languageSelect = document.getElementById("language");
    const themeSelect = document.getElementById("theme");
    const unitsSelect = document.getElementById("units");

    if (profile && profile.settings) {
        languageSelect.value = profile.settings.language;
        themeSelect.value = profile.settings.theme;
        unitsSelect.value = profile.settings.units;
    }

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
        setTimeout(() => { window.location.hash = "#/profile"; }, 2000);
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
        window.location.hash = "#/profile";
    });

    const deleteAccountBtn = document.getElementById("deleteAccountBtn");
    deleteAccountBtn.addEventListener("click", () => {
        if (!profile) return;
        const confirmed = confirm("Are you sure you want to delete your account? This action cannot be undone.");
        if (!confirmed) return;
        deleteProfile(profile.profileId);
        clearSession();
        window.location.hash = "#/home";
    });
}

export async function profilePage(){
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
            setupEditProfileForm(profile, session);
        }, 100);
        return;
    }
    
    if (action === 'settings' && profile) {
        renderSettings();
        setTimeout(() => {
            setupSettingsForm(profile, session);
        }, 100);
        return;
    }
    
    // Default profile page view
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
                renderSettings();
                setTimeout(() => {
                    setupSettingsForm(profile, session);
                }, 100);
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
    if (profilePageLoad) {
        profilePageLoad.addEventListener("click", async () => {
            await profilePage();
        });
    }
    
    const settingsBtn = document.getElementById("settingsBtn");
    if (settingsBtn) {
        settingsBtn.disabled = false;
        settingsBtn.classList.remove("disabled");
        settingsBtn.onclick = () => {
            renderSettings();
            setTimeout(() => {
                setupSettingsForm(profile, session);
            }, 100);
        };
    };
};