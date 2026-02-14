"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchRecipes = searchRecipes;
exports.getRecipeById = getRecipeById;
exports.getNutritionData = getNutritionData;
// src/services/recipeDB.ts
const axios_1 = __importDefault(require("axios"));
const BASE_URL = process.env.RECIPEDB_BASE_URL || 'https://api.foodoscope.com/recipedb';
const API_KEY = process.env.RECIPEDB_API_KEY || '';
const recipeDBClient = axios_1.default.create({
    baseURL: BASE_URL,
    headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
    },
    timeout: 10000
});
async function searchRecipes(query, limit = 50) {
    try {
        const response = await recipeDBClient.get('/api/recipes/search', {
            params: { query, limit }
        });
        return response.data.recipes || [];
    }
    catch (error) {
        console.error('RecipeDB search error:', error.message);
        return getMockRecipes(query);
    }
}
async function getRecipeById(id) {
    try {
        const response = await recipeDBClient.get(`/api/recipes/${id}`);
        return response.data.recipe;
    }
    catch (error) {
        console.error('RecipeDB get error:', error.message);
        return getMockRecipeDetail(id);
    }
}
async function getNutritionData(ingredient) {
    try {
        const response = await recipeDBClient.get(`/api/nutrition/${ingredient}`);
        return response.data;
    }
    catch (error) {
        console.error('RecipeDB nutrition error:', error.message);
        return null;
    }
}
function getMockRecipes(query) {
    return [
        {
            id: 'mock-1',
            name: 'Classic Pasta Carbonara',
            description: 'Traditional Italian pasta with eggs, cheese, and pancetta',
            cuisine: 'italian',
            prepTime: 15,
            cookTime: 20,
            servings: 4,
            difficulty: 'medium',
            image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400',
            ingredients: [
                { name: 'spaghetti', amount: '400', unit: 'g' },
                { name: 'pancetta', amount: '200', unit: 'g' },
                { name: 'eggs', amount: '4', unit: 'whole' },
                { name: 'parmesan cheese', amount: '100', unit: 'g' },
                { name: 'black pepper', amount: '1', unit: 'tsp' },
                { name: 'salt', amount: '1', unit: 'tsp' }
            ],
            instructions: [
                'Bring a large pot of salted water to boil',
                'Cook spaghetti according to package directions',
                'Meanwhile, cook pancetta in a large skillet until crispy',
                'Beat eggs with parmesan cheese and black pepper',
                'Drain pasta, reserving 1 cup pasta water',
                'Toss hot pasta with pancetta and egg mixture',
                'Add pasta water as needed for creamy sauce',
                'Serve immediately with extra parmesan'
            ],
            nutrition: {
                calories: 520,
                protein: 28,
                carbs: 56,
                fat: 18,
                fiber: 3
            }
        },
        {
            id: 'mock-2',
            name: 'Vegetable Stir Fry',
            description: 'Healthy mix of seasonal vegetables',
            cuisine: 'chinese',
            prepTime: 10,
            cookTime: 15,
            servings: 4,
            difficulty: 'easy',
            image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400',
            ingredients: [
                { name: 'broccoli', amount: '200', unit: 'g' },
                { name: 'carrots', amount: '150', unit: 'g' },
                { name: 'bell peppers', amount: '2', unit: 'whole' },
                { name: 'soy sauce', amount: '3', unit: 'tbsp' },
                { name: 'garlic', amount: '3', unit: 'cloves' },
                { name: 'ginger', amount: '1', unit: 'tbsp' }
            ],
            instructions: [
                'Heat wok or large skillet over high heat',
                'Add oil and swirl to coat',
                'Stir fry garlic and ginger for 30 seconds',
                'Add broccoli and carrots, stir fry 3 minutes',
                'Add bell peppers, cook 2 minutes more',
                'Add soy sauce, toss to coat',
                'Serve hot over rice'
            ],
            nutrition: {
                calories: 180,
                protein: 8,
                carbs: 32,
                fat: 4,
                fiber: 8
            }
        },
        {
            id: 'mock-3',
            name: 'Chicken Tikka Masala',
            description: 'Creamy Indian curry with tender chicken',
            cuisine: 'indian',
            prepTime: 30,
            cookTime: 40,
            servings: 6,
            difficulty: 'medium',
            image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
            ingredients: [
                { name: 'chicken breast', amount: '800', unit: 'g' },
                { name: 'yogurt', amount: '200', unit: 'ml' },
                { name: 'tomato sauce', amount: '400', unit: 'ml' },
                { name: 'cream', amount: '200', unit: 'ml' },
                { name: 'garam masala', amount: '2', unit: 'tbsp' },
                { name: 'garlic', amount: '4', unit: 'cloves' }
            ],
            instructions: [
                'Marinate chicken in yogurt and spices for 30 minutes',
                'Grill or bake chicken until cooked through',
                'Make sauce: sauté onions, garlic, ginger',
                'Add tomato sauce and spices, simmer 10 minutes',
                'Stir in cream',
                'Add cooked chicken to sauce',
                'Simmer 5 minutes to blend flavors',
                'Serve with rice or naan bread'
            ],
            nutrition: {
                calories: 380,
                protein: 35,
                carbs: 15,
                fat: 22,
                fiber: 2
            }
        }
    ];
}
function getMockRecipeDetail(id) {
    const recipes = getMockRecipes('');
    return recipes.find(r => r.id === id) || recipes[0];
}
exports.default = {
    searchRecipes,
    getRecipeById,
    getNutritionData
};
