import { loadProfile, loadSession } from "../store.js";

let systemThemeListenerAdded = false;

export async function applyTheme() {
    let curentTheme = localStorage.getItem("theme");
    if (curentTheme && curentTheme !== "system") {
        saveTheme(curentTheme);
        return;
    }

    const session = loadSession();
    if (session && session.profileId) {
        const profile = await loadProfile(session.profileId);
        if (profile?.settings?.theme) {
            curentTheme = profile.settings.theme;
        }
    }

    // Prevent stale async result from overwriting a user-selected theme just saved.
    const latestLocalTheme = localStorage.getItem("theme");
    if (latestLocalTheme && latestLocalTheme !== "system") {
        saveTheme(latestLocalTheme);
        return;
    }

    if (curentTheme) {
        if (curentTheme === "system") {
            defaultTheme();
        } else {
            saveTheme(curentTheme);
        }
    } else {
        defaultTheme();
    }
}

export function defaultTheme() {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const systemTheme = media.matches ? "dark" : "light";

    saveTheme(systemTheme);
    applyBannerTheme(systemTheme);

    if (!systemThemeListenerAdded) {
        media.addEventListener("change", (e) => {
            const nextTheme = e.matches ? "dark" : "light";
            saveTheme(nextTheme);
        });
        systemThemeListenerAdded = true;
    }
}

export function saveTheme(theme) {
    if (!theme || theme === "system") return;
    localStorage.removeItem("theme");
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute('data-theme', theme);
    applyBannerTheme(theme);
}

function applyBannerTheme(theme) {
  const bannerImg = document.querySelector("#banner img");
  if (!(bannerImg instanceof HTMLImageElement)) return;

  bannerImg.src =
    theme === "dark"
      ? "assets/cookbook-social-dark-banner.png"
      : "assets/cookbook-social-php-banner.png";
}


