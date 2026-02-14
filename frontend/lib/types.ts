export interface User {
  id: string
  email: string
  name: string
}

export interface UserContext {
  lifeStage: string
  location: {
    country: string
    climate: string
  }
  allergies: string[]
  dietaryRestrictions: string[]
  favoriteCuisines: string[]
}

export interface Recipe {
  id: string
  name: string
  description: string
  cuisine: string
  prepTime: number
  cookTime: number
  servings: number
  difficulty: string
  image?: string
  ingredients: Ingredient[]
  instructions?: string[]
  nutrition: Nutrition
  matchScore?: number
  safetyWarnings?: string[]
}

export interface Ingredient {
  name: string
  amount: string
  unit: string
}

export interface Nutrition {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber?: number
}

export interface Substitution {
  name: string
  flavorMatch: number
  sharedMolecules: string[]
  reason: string
  nutritionImpact: string
}