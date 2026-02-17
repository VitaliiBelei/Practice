
// Cookie Manager
class CookieManager {
    static set(name, value, options = {}) {
        const defaults = {
            path: '/',
            maxAge: 86400 * 7, // 7 днів
            samesite: 'lax'
        };
        
        options = { ...defaults, ...options };
        
        let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
        
        if (options.maxAge) {
            cookieString += `; max-age=${options.maxAge}`;
        }
        
        if (options.expires) {
            cookieString += `; expires=${options.expires.toUTCString()}`;
        }
        
        if (options.path) {
            cookieString += `; path=${options.path}`;
        }
        
        if (options.domain) {
            cookieString += `; domain=${options.domain}`;
        }
        
        if (options.secure) {
            cookieString += '; secure';
        }
        
        if (options.samesite) {
            cookieString += `; samesite=${options.samesite}`;
        }
        
        document.cookie = cookieString;
    }
    
    static get(name) {
        const matches = document.cookie.match(
            new RegExp('(?:^|; )' + encodeURIComponent(name) + '=([^;]*)')
        );
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }
    
    static delete(name) {
        this.set(name, '', { maxAge: -1 });
    }
    
    static has(name) {
        return this.get(name) !== undefined;
    }
    
    static getAll() {
        return document.cookie.split('; ').reduce((acc, cookie) => {
            const [name, value] = cookie.split('=');
            if (name) {
                acc[decodeURIComponent(name)] = decodeURIComponent(value);
            }
            return acc;
        }, {});
    }
}

export async function loadUserRecipes(profileId) {
    try {
        const response = await fetch (`http://localhost:3001/recipes?profileId=${profileId}`);
        if (!response.ok) throw new Error("Error loading recipes");
        const recipes = await response.json();
        return recipes || null; 
    } catch (error) {
        console.error("Error loading profile:", error); 
        throw error;
    }
}

export async function loadAllRecipes() {
    try {
        const response = await fetch (`http://localhost:3001/recipes`);
        if (!response.ok) throw new Error("Error loading recipes");
        const recipes = await response.json();
        return recipes || null; 
    } catch (error) {
        console.error("Error loading recipes:", error); 
        throw error;
    }
}

export async function addRecipe(recipe) {
    if (!recipe) return console.error("Recipe is not defined");
        try {
            const response = await fetch (`http://localhost:3001/recipes`, {
                method: "POST",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify(recipe)
            });
            if (!response.ok) throw new Error("Error saving recipe");
            return await response.json();
        } catch (error) {
            console.error("Error saving recipe:", error); 
            throw error; 
        }
}

export async function getRecipeById(id) {
    try {
        const response = await fetch(`http://localhost:3001/recipes/${id}`);
        if (!response.ok) throw new Error("Error loading recipe");
        return await response.json();
    } catch (error) {
        console.error("Error loading recipe:", error);
        throw error;
    }
}

export async function updateRecipe(id, patch) {
    try {
        const response = await fetch(`http://localhost:3001/recipes/${id}`);
        if (!response.ok) throw new Error("Error loading recipe");
        const recipe = await response.json();
        
        const updatedRecipe = {
            ...recipe,
            ...patch,
            updatedAt: new Date().toISOString()
        };

        const updateResponse = await fetch(`http://localhost:3001/recipes/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(updatedRecipe)
        });

        if (!updateResponse.ok) throw new Error("Error updating recipe");
        return await updateResponse.json();
    } catch (error) {
        console.error("Error updating recipe:", error);
        throw error;
    }
}

export async function deleteRecipe(id) {
    try {
        const deleteResponse = await fetch(`http://localhost:3001/recipes/${id}`, {
            method: "DELETE",
            headers: {"Content-Type": "application/json"},
        });

        if (!deleteResponse.ok) throw new Error("Error deleting recipe");
        return await deleteResponse.json();
    } catch (error) {
        console.error("Error deleting recipe:", error);
        throw error;
    }
}

export async function toggleFavorite(id) {
    try {
        const response = await fetch(`http://localhost:3001/recipes/${id}`);
        if (!response.ok) throw new Error("Error loading recipe");
        const recipe = await response.json();
        
        const updatedRecipe = {
            ...recipe,
            isFavorite: !recipe.isFavorite,
            updatedAt: new Date().toISOString()
        };

        const updateResponse = await fetch(`http://localhost:3001/recipes/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(updatedRecipe)
        });

        if (!updateResponse.ok) throw new Error("Error updating recipe");
        return await updateResponse.json();
    } catch (error) {
        console.error("Error toggling favorite:", error);
        throw error;
    }
}

export async function loadProfiles() {
    try {
        const response = await fetch ('http://localhost:3001/profiles');
        if (!response.ok) throw new Error("Error loading profile");
        const profiles = await response.json();
        return profiles || null; 
    } catch (error) {
        console.error("Error loading profile:", error); 
        throw error;
    }
}

export async function loadProfile(profileId) {
    try {
        const response = await fetch (`http://localhost:3001/profiles?profileId=${profileId}`);
        if (!response.ok) throw new Error("Error loading profile");
        const profile = await response.json();
        return profile[0] || null; 
    } catch (error) {
        console.error("Error loading profile:", error); 
        throw error;
    }
}

export async function saveProfile(profile) {
    if (!profile) return console.error("Profile is not defined");
    try {
        const response = await fetch (`http://localhost:3001/profiles`, {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify(profile)
        });
        if (!response.ok) throw new Error("Error saving profile");
        return await response.json();
    } catch (error) {
        console.error("Error saving profile:", error); 
        throw error; 
    }
}

export async function updateProfile(profileId, patch) {
    try {
        const response = await fetch(`http://localhost:3001/profiles?profileId=${profileId}`);
        if (!response.ok) throw new Error("Error loading profile");
        const profiles = await response.json();
        
        if (!profiles[0]) throw new Error("Profile not found");
        
        const updatedProfile = {
            ...profiles[0],
            ...patch,
            updatedAt: new Date().toISOString()
        };

        const updateResponse = await fetch(`http://localhost:3001/profiles/${profiles[0].id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(updatedProfile)
        });

        if (!updateResponse.ok) throw new Error("Error updating profile");
        return await updateResponse.json();
    } catch (error) {
        console.error("Error updating profile:", error); 
        throw error;
    }
}

export async function deleteProfile(profileId) {
    try {
        const response = await fetch(`http://localhost:3001/profiles?profileId=${profileId}`);
        if (!response.ok) throw new Error("Error loading profile");
        const profiles = await response.json();
        
        if (!profiles[0]) throw new Error("Profile not found");
        
        const deleteResponse = await fetch(`http://localhost:3001/profiles/${profiles[0].id}`, {
            method: "DELETE",
            headers: {"Content-Type": "application/json"},
        });

        if (!deleteResponse.ok) throw new Error("Error deleting profile");
        return await deleteResponse.json();
    } catch (error) {
        console.error("Error deleting profile:", error); 
        throw error;
    }
}

export function saveSession(session) {
    CookieManager.set('cookbook_session', JSON.stringify(session), {
        maxAge: 86400 * 7,
        secure: true,
        samesite: 'strict'
    });
}

export function loadSession() {
    const data = CookieManager.get('cookbook_session');
    return data ? JSON.parse(data) : null;
}

export function clearSession() {
    CookieManager.delete('cookbook_session');
}
