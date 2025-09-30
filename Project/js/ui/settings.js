export function renderSettings() {
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

