import express from "express";
import cors from "cors";
import {
  getAllRecipes,
  getRecipesByProfile,
  getRecipeById,
  addRecipe,
  updateRecipe,
  deleteRecipe,
  getProfiles,
  getProfileByProfileId,
  addProfile,
  updateProfileById,
  deleteProfileById
} from "./store.js";

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// RECIPES
app.get("/recipes", async (req, res) => {
  const { profileId } = req.query;
  const data = profileId ? await getRecipesByProfile(profileId) : await getAllRecipes();
  res.json(data);
});

app.get("/recipes/:id", async (req, res) => {
  const recipe = await getRecipeById(req.params.id);
  if (!recipe) return res.status(404).json({ message: "Recipe not found" });
  res.json(recipe);
});

app.post("/recipes", async (req, res) => {
  const created = await addRecipe(req.body);
  res.status(201).json(created);
});

app.put("/recipes/:id", async (req, res) => {
  const updated = await updateRecipe(req.params.id, req.body);
  if (!updated) return res.status(404).json({ message: "Recipe not found" });
  res.json(updated);
});

app.delete("/recipes/:id", async (req, res) => {
  const removed = await deleteRecipe(req.params.id);
  if (!removed) return res.status(404).json({ message: "Recipe not found" });
  res.json(removed);
});

// PROFILES
app.get("/profiles", async (req, res) => {
  const { profileId } = req.query;
  if (profileId) {
    const profile = await getProfileByProfileId(profileId);
    return res.json(profile ? [profile] : []);
  }

  const profiles = await getProfiles();
  res.json(profiles);
});

app.post("/profiles", async (req, res) => {
  const created = await addProfile(req.body);
  res.status(201).json(created);
});

app.put("/profiles/:id", async (req, res) => {
  const updated = await updateProfileById(req.params.id, req.body);
  if (!updated) return res.status(404).json({ message: "Profile not found" });
  res.json(updated);
});

app.delete("/profiles/:id", async (req, res) => {
  const removed = await deleteProfileById(req.params.id);
  if (!removed) return res.status(404).json({ message: "Profile not found" });
  res.json(removed);
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
