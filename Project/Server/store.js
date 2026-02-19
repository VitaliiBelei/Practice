import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, "Data", "db.json");

let dbCache = null;
let writeQueue = Promise.resolve();

const recipeIndex = {
  byId: new Map(),
  byProfileId: new Map(),
  byCategory: new Map()
};

function cloneRecipe(r) {
  return { ...r };
}

function rebuildRecipeIndexes(recipes = []) {
  recipeIndex.byId.clear();
  recipeIndex.byProfileId.clear();
  recipeIndex.byCategory.clear();

  for (const r of recipes) {
    const id = String(r.id);
    recipeIndex.byId.set(id, r);

    const pid = String(r.profileId ?? "");
    if (!recipeIndex.byProfileId.has(pid)) recipeIndex.byProfileId.set(pid, []);
    recipeIndex.byProfileId.get(pid).push(r);

    const cat = String(r.category ?? "");
    if (!recipeIndex.byCategory.has(cat)) recipeIndex.byCategory.set(cat, []);
    recipeIndex.byCategory.get(cat).push(r);
  }
}

async function readDb() {
  if (dbCache) return dbCache;
  const raw = await readFile(DB_PATH, "utf-8");
  dbCache = JSON.parse(raw);
  rebuildRecipeIndexes(dbCache.recipes ?? []);
  return dbCache;
}

async function writeDb(db) {
  dbCache = db;
  rebuildRecipeIndexes(dbCache.recipes ?? []);
  const payload = JSON.stringify(dbCache, null, 2);
  writeQueue = writeQueue.then(() => writeFile(DB_PATH, payload, "utf-8"));
  await writeQueue;
}

export async function getAllRecipes() {
  await readDb();
  return Array.from(recipeIndex.byId.values()).map(cloneRecipe);
}

export async function getRecipesByProfile(profileId) {
  await readDb();
  return (recipeIndex.byProfileId.get(String(profileId)) ?? []).map(cloneRecipe);
}

export async function getRecipeById(id) {
  await readDb();
  const r = recipeIndex.byId.get(String(id));
  return r ? cloneRecipe(r) : null;
}

export async function addRecipe(recipe) {
  const db = await readDb();
  const recipes = db.recipes ?? [];
  const nextId = recipes.length
    ? Math.max(...recipes.map((r) => Number(r.id) || 0)) + 1
    : 1;

  const newRecipe = { ...recipe, id: nextId };
  db.recipes = [...recipes, newRecipe];
  await writeDb(db);
  return cloneRecipe(newRecipe);
}

export async function updateRecipe(id, patch) {
  const db = await readDb();
  const idx = (db.recipes ?? []).findIndex((r) => String(r.id) === String(id));
  if (idx === -1) return null;

  const updated = {
    ...db.recipes[idx],
    ...patch,
    updatedAt: new Date().toISOString()
  };

  db.recipes[idx] = updated;
  await writeDb(db);
  return cloneRecipe(updated);
}

export async function deleteRecipe(id) {
  const db = await readDb();
  const idx = (db.recipes ?? []).findIndex((r) => String(r.id) === String(id));
  if (idx === -1) return null;

  const [removed] = db.recipes.splice(idx, 1);
  await writeDb(db);
  return cloneRecipe(removed);
}

// profiles залишай як у тебе зараз:
export async function getProfiles() {
  const db = await readDb();
  return db.profiles ?? [];
}

export async function getProfileByProfileId(profileId) {
  const db = await readDb();
  return (db.profiles ?? []).find((p) => p.profileId === profileId) ?? null;
}

export async function addProfile(profile) {
  const db = await readDb();
  const profiles = db.profiles ?? [];
  const nextId = profiles.length ? Math.max(...profiles.map((p) => Number(p.id) || 0)) + 1 : 1;
  const newProfile = { ...profile, id: nextId };
  db.profiles = [...profiles, newProfile];
  await writeDb(db);
  return newProfile;
}

export async function updateProfileById(id, patch) {
  const db = await readDb();
  const idx = (db.profiles ?? []).findIndex((p) => String(p.id) === String(id));
  if (idx === -1) return null;

  const updated = {
    ...db.profiles[idx],
    ...patch,
    updatedAt: new Date().toISOString()
  };

  db.profiles[idx] = updated;
  await writeDb(db);
  return updated;
}

export async function deleteProfileById(id) {
  const db = await readDb();
  const idx = (db.profiles ?? []).findIndex((p) => String(p.id) === String(id));
  if (idx === -1) return null;

  const [removed] = db.profiles.splice(idx, 1);
  await writeDb(db);
  return removed;
}

