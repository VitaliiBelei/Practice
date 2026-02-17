import type { Recipe } from "./pages/ts/recipe";
import type { Profile, Session } from "./pages/ts/profile";

export function loadUserRecipes(profileId: string): Promise<Recipe[] | null>;
export function loadAllRecipes(): Promise<Recipe[] | null>;
export function addRecipe(recipe: Recipe): Promise<Recipe>;
export function getRecipeById(id: string): Promise<Recipe>;
export function updateRecipe(id: string, patch: Partial<Recipe>): Promise<Recipe>;
export function deleteRecipe(id: string): Promise<Recipe>;
export function toggleFavorite(id: string): Promise<Recipe>;

export function loadProfiles(): Promise<Profile[] | null>;
export function loadProfile(profileId: string): Promise<Profile | null>;
export function saveProfile(profile: Profile): Promise<Profile>;
export function updateProfile(profileId: string, patch: Partial<Profile>): Promise<Profile>;
export function deleteProfile(profileId: string): Promise<Profile>;

export function saveSession(session: Session): void;
export function loadSession(): Session | null;
export function clearSession(): void;
