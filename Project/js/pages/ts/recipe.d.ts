export type Ingredient = {
  name: string;
  qty: number;
  unit: string;
};

export type Recipe = {
  id?: string;
  title: string;
  time: number;
  category: string;
  servings: number;
  ingredients: Ingredient[];
  steps: string[];
  type: "local";
  isFavorite: boolean;
  profileId: string;
  mainImage: string;
  youtubeUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
};
