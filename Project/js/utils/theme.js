import { loadProfile, loadSession } from "../store.js";

let systemThemeListenerAdded = false;

export async function applyTheme() {
    let curentTheme = localStorage.getItem("theme");
    if (curentTheme) {
        document.documentElement.setAttribute('data-theme', curentTheme);
    }
    else {
        const session = loadSession();
        if (session && session.profileId) {
            const profile = await loadProfile(session.profileId);
            if (profile?.settings?.theme) {
                curentTheme = profile.settings.theme;
            }
        }
        if (curentTheme) {
        saveTheme(curentTheme);
        }
        else defaultTheme();
    }
}

export function defaultTheme() {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const systemTheme = media.matches ? "dark" : "light";

    saveTheme(systemTheme);

    if (!systemThemeListenerAdded) {
        media.addEventListener("change", (e) => {
            const nextTheme = e.matches ? "dark" : "light";
            saveTheme(nextTheme);
        });
        systemThemeListenerAdded = true;
    }
}

export function saveTheme(theme) {
    localStorage.removeItem("theme");
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute('data-theme', theme);
}

