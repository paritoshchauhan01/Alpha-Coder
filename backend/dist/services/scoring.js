"use strict";
// src/services/scoring.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.scoreRecipe = scoreRecipe;
exports.scoreRecipes = scoreRecipes;
function scoreRecipe(recipe, userContext) {
    if (!userContext)
        return 50;
    let score = 100;
    const allergyCheck = checkAllergies(recipe, userContext.allergies);
    if (!allergyCheck.safe)
        return 0;
    const dietCheck = checkDietaryRestrictions(recipe, userContext.dietaryRestrictions);
    if (!dietCheck.safe)
        return 0;
    if (userContext.favoriteCuisines.includes(recipe.cuisine?.toLowerCase())) {
        score += 20;
    }
    score += getClimateBoost(recipe, userContext.location.climate);
    score += getLifeStageBoost(recipe, userContext.lifeStage);
    return Math.min(score, 100);
}
function checkAllergies(recipe, allergies) {
    const foundAllergens = [];
    const recipeIngredients = recipe.ingredients.map(i => i.name.toLowerCase());
    for (const allergen of allergies) {
        const allergenLower = allergen.toLowerCase();
        const hasAllergen = recipeIngredients.some(ingredient => ingredient.includes(allergenLower) || isRelatedAllergen(ingredient, allergenLower));
        if (hasAllergen)
            foundAllergens.push(allergen);
    }
    return { safe: foundAllergens.length === 0, allergens: foundAllergens };
}
function isRelatedAllergen(ingredient, allergen) {
    const allergenGroups = {
        'dairy': ['milk', 'cheese', 'butter', 'cream', 'yogurt', 'whey'],
        'nuts': ['peanut', 'almond', 'cashew', 'walnut', 'pistachio', 'hazelnut'],
        'shellfish': ['shrimp', 'crab', 'lobster', 'clam', 'mussel', 'oyster'],
        'fish': ['salmon', 'tuna', 'cod', 'tilapia', 'sardine'],
        'soy': ['soy', 'tofu', 'tempeh', 'miso'],
        'gluten': ['wheat', 'barley', 'rye', 'flour'],
        'egg': ['egg']
    };
    const relatedIngredients = allergenGroups[allergen] || [];
    return relatedIngredients.some(related => ingredient.includes(related));
}
function checkDietaryRestrictions(recipe, restrictions) {
    const violations = [];
    const recipeIngredients = recipe.ingredients.map(i => i.name.toLowerCase());
    for (const restriction of restrictions) {
        const restrictionLower = restriction.toLowerCase();
        if (restrictionLower === 'vegetarian' || restrictionLower === 'vegan') {
            const meatIngredients = ['chicken', 'beef', 'pork', 'fish', 'lamb', 'turkey', 'duck', 'meat'];
            const hasMeat = recipeIngredients.some(ing => meatIngredients.some(meat => ing.includes(meat)));
            if (hasMeat)
                violations.push(restriction);
            if (restrictionLower === 'vegan') {
                const animalProducts = ['egg', 'milk', 'cheese', 'butter', 'cream', 'honey', 'yogurt'];
                const hasAnimalProduct = recipeIngredients.some(ing => animalProducts.some(product => ing.includes(product)));
                if (hasAnimalProduct)
                    violations.push(restriction);
            }
        }
        if (restrictionLower === 'halal' || restrictionLower === 'kosher') {
            const forbiddenMeats = ['pork', 'bacon', 'ham'];
            const hasForbidden = recipeIngredients.some(ing => forbiddenMeats.some(meat => ing.includes(meat)));
            if (hasForbidden)
                violations.push(restriction);
        }
    }
    return { safe: violations.length === 0, violations };
}
function getClimateBoost(recipe, climate) {
    const recipeName = recipe.name.toLowerCase();
    if (climate === 'cold') {
        if (recipeName.includes('soup') || recipeName.includes('stew') ||
            recipeName.includes('curry') || recipeName.includes('hot')) {
            return 15;
        }
    }
    if (climate === 'hot') {
        if (recipeName.includes('salad') || recipeName.includes('cold') ||
            recipeName.includes('fresh') || recipeName.includes('smoothie')) {
            return 15;
        }
    }
    return 0;
}
function getLifeStageBoost(recipe, lifeStage) {
    if (lifeStage === 'new_mother') {
        const ingredients = recipe.ingredients.map(i => i.name.toLowerCase());
        const hasIron = ingredients.some(i => i.includes('spinach') || i.includes('lentil') || i.includes('beef'));
        if (hasIron || (recipe.nutrition?.protein > 20)) {
            return 10;
        }
    }
    if (lifeStage === 'elderly') {
        if (recipe.difficulty === 'easy' && recipe.prepTime && recipe.prepTime < 30) {
            return 10;
        }
    }
    return 0;
}
function scoreRecipes(recipes, userContext) {
    return recipes.map(recipe => ({
        ...recipe,
        matchScore: scoreRecipe(recipe, userContext),
        safetyWarnings: getSafetyWarnings(recipe, userContext)
    }));
}
function getSafetyWarnings(recipe, userContext) {
    if (!userContext)
        return [];
    const warnings = [];
    const allergyCheck = checkAllergies(recipe, userContext.allergies);
    if (!allergyCheck.safe) {
        warnings.push(`⚠️ Contains allergen: ${allergyCheck.allergens.join(', ')}`);
    }
    const dietCheck = checkDietaryRestrictions(recipe, userContext.dietaryRestrictions);
    if (!dietCheck.safe) {
        warnings.push(`⚠️ Not suitable for: ${dietCheck.violations.join(', ')}`);
    }
    return warnings;
}
exports.default = {
    scoreRecipe,
    scoreRecipes,
    checkAllergies,
    checkDietaryRestrictions
};
