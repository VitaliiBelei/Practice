declare global {
  type Ingredient = import('./recipe').Ingredient;
  type Recipe = import('./recipe').Recipe;
  type ProfileSettings = import('./profile').ProfileSettings;
  type Profile = import('./profile').Profile;
  type Session = import('./profile').Session;
}

export {};
