import { loadProfile, loadSession } from "../store.js";

let systemThemeListenerAdded = false;
const session = loadSession();

export async function applyTheme() {
    let curentTheme = localStorage.getItem("theme");
    if (curentTheme && curentTheme !== "system") {
        saveTheme(curentTheme);
        return;
    }
    
    else if (session && session.profileId) {
        const profile = await loadProfile(session.profileId);
        if (profile?.settings?.theme) {
            curentTheme = profile.settings.theme;
            saveTheme(curentTheme);
        }
        return;
    }

    else if(curentTheme === "system" || !curentTheme) {
        defaultTheme();
        return;
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


