"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.demoLogin = demoLogin;
exports.saveOnboarding = saveOnboarding;
exports.getOnboarding = getOnboarding;
exports.searchRecipes = searchRecipes;
exports.getRecipeById = getRecipeById;
exports.findSubstitutions = findSubstitutions;
exports.getUserProfile = getUserProfile;
exports.getRecentSearches = getRecentSearches;
exports.signup = signup;
const models_1 = require("./models");
const mockDB_1 = require("./mockDB");
const recipeDB = __importStar(require("./services/recipeDB"));
const flavorDB = __importStar(require("./services/flavorDB"));
const scoring = __importStar(require("./services/scoring"));
const utils_1 = require("./utils");
// Flag to track if database is available
let dbAvailable = true;
// Helper to use mock DB as fallback
const withFallback = async (dbOperation, mockOperation) => {
    try {
        return await dbOperation();
    }
    catch (error) {
        if (error.name === 'MongooseError' || error.message?.includes('buffering') || !dbAvailable) {
            console.log('📦 Using mock data (database unavailable)');
            dbAvailable = false;
            return await mockOperation();
        }
        throw error;
    }
};
async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        // Try database first, fallback to mock
        const user = await withFallback(() => models_1.User.findOne({ email: email.toLowerCase() }), () => mockDB_1.mockDB.findUserByEmail(email));
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const isValidPassword = await (0, utils_1.comparePassword)(password, user.passwordHash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const token = (0, utils_1.generateJWT)(user._id.toString(), user.email);
        const userContext = !dbAvailable
            ? await mockDB_1.mockDB.findUserContextByUserId(user._id.toString())
            : await models_1.UserContext.findOne({ userId: user._id });
        res.json({
            token,
            user: { id: user._id, email: user.email, name: user.name },
            onboardingCompleted: !!userContext?.onboardingCompleted
        });
    }
    catch (error) {
        next(error);
    }
}
async function demoLogin(req, res, next) {
    try {
        const email = 'demo@nutricontext.com';
        // Check if demo user already exists
        let demoUser = await withFallback(() => models_1.User.findOne({ email }), () => mockDB_1.mockDB.findUserByEmail(email));
        if (!demoUser) {
            const hashedPassword = await (0, utils_1.hashPassword)('Demo123!');
            demoUser = !dbAvailable
                ? await mockDB_1.mockDB.createUser(email, hashedPassword, 'Demo User')
                : await models_1.User.create({
                    email,
                    passwordHash: hashedPassword,
                    name: 'Demo User'
                });
            // Create user context
            if (!dbAvailable) {
                await mockDB_1.mockDB.saveUserContext(demoUser._id.toString(), {
                    lifeStage: 'new_mother',
                    location: { country: 'USA', climate: 'cold' },
                    allergies: ['peanuts'],
                    dietaryRestrictions: ['vegetarian'],
                    favoriteCuisines: ['italian', 'indian'],
                    onboardingCompleted: true
                });
            }
            else {
                await models_1.UserContext.create({
                    userId: demoUser._id,
                    lifeStage: 'new_mother',
                    location: { country: 'USA', climate: 'cold' },
                    allergies: ['peanuts'],
                    dietaryRestrictions: ['vegetarian'],
                    favoriteCuisines: ['italian', 'indian'],
                    onboardingCompleted: true
                });
            }
        }
        const token = (0, utils_1.generateJWT)(demoUser._id.toString(), demoUser.email);
        res.json({
            token,
            user: { id: demoUser._id, email: demoUser.email, name: demoUser.name },
            onboardingCompleted: true
        });
    }
    catch (error) {
        next(error);
    }
}
async function saveOnboarding(req, res, next) {
    try {
        const userId = req.user.userId;
        const { lifeStage, location, allergies, dietaryRestrictions, favoriteCuisines } = req.body;
        if (!lifeStage || !location?.country || !location?.climate) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const contextData = {
            lifeStage,
            location,
            allergies: allergies || [],
            dietaryRestrictions: dietaryRestrictions || [],
            favoriteCuisines: favoriteCuisines || [],
            onboardingCompleted: true
        };
        let userContext;
        if (!dbAvailable) {
            // Use mock database
            userContext = await mockDB_1.mockDB.saveUserContext(userId, contextData);
        }
        else {
            // Use MongoDB
            userContext = await models_1.UserContext.findOne({ userId });
            if (userContext) {
                userContext.lifeStage = lifeStage;
                userContext.location = location;
                userContext.allergies = allergies || [];
                userContext.dietaryRestrictions = dietaryRestrictions || [];
                userContext.favoriteCuisines = favoriteCuisines || [];
                userContext.onboardingCompleted = true;
                userContext.updatedAt = new Date();
                await userContext.save();
            }
            else {
                userContext = await models_1.UserContext.create({
                    userId,
                    ...contextData
                });
            }
        }
        res.json({ success: true, message: 'Onboarding completed successfully', context: userContext });
    }
    catch (error) {
        next(error);
    }
}
async function getOnboarding(req, res, next) {
    try {
        const userId = req.user.userId;
        const userContext = !dbAvailable
            ? await mockDB_1.mockDB.findUserContextByUserId(userId)
            : await models_1.UserContext.findOne({ userId });
        if (!userContext) {
            return res.status(404).json({ error: 'Onboarding data not found' });
        }
        res.json({ context: userContext });
    }
    catch (error) {
        next(error);
    }
}
async function searchRecipes(req, res, next) {
    try {
        const userId = req.user.userId;
        const { query } = req.body;
        if (!query) {
            return res.status(400).json({ error: 'Search query is required' });
        }
        const userContext = !dbAvailable
            ? await mockDB_1.mockDB.findUserContextByUserId(userId)
            : await models_1.UserContext.findOne({ userId });
        const recipes = await recipeDB.searchRecipes(query, 30);
        const scoredRecipes = scoring.scoreRecipes(recipes, userContext);
        const safeRecipes = scoredRecipes.filter(r => r.matchScore > 0);
        safeRecipes.sort((a, b) => b.matchScore - a.matchScore);
        const topRecipes = safeRecipes.slice(0, 20);
        if (!dbAvailable) {
            await mockDB_1.mockDB.addSearchHistory(userId, query);
        }
        else {
            await models_1.SearchHistory.create({ userId, query, timestamp: new Date() });
        }
        res.json({ recipes: topRecipes, total: topRecipes.length, query });
    }
    catch (error) {
        next(error);
    }
}
async function getRecipeById(req, res, next) {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        let recipe;
        if (!dbAvailable) {
            recipe = await mockDB_1.mockDB.getCachedRecipe(id);
            if (!recipe) {
                recipe = await recipeDB.getRecipeById(id);
                await mockDB_1.mockDB.cacheRecipe(id, recipe);
            }
        }
        else {
            let cachedRecipe = await models_1.RecipeCache.findOne({ recipeId: id });
            if (cachedRecipe) {
                recipe = cachedRecipe.data;
            }
            else {
                recipe = await recipeDB.getRecipeById(id);
                await models_1.RecipeCache.create({ recipeId: id, data: recipe });
            }
        }
        const userContext = !dbAvailable
            ? await mockDB_1.mockDB.findUserContextByUserId(userId)
            : await models_1.UserContext.findOne({ userId });
        const matchScore = scoring.scoreRecipe(recipe, userContext);
        const safetyWarnings = scoring.default.checkAllergies(recipe, userContext?.allergies || []);
        res.json({
            recipe: {
                ...recipe,
                matchScore,
                safetyWarnings: safetyWarnings.safe ? [] : safetyWarnings.allergens.map(a => `Contains allergen: ${a}`)
            }
        });
    }
    catch (error) {
        next(error);
    }
}
async function findSubstitutions(req, res, next) {
    try {
        const userId = req.user.userId;
        const { ingredient, recipeId } = req.body;
        if (!ingredient) {
            return res.status(400).json({ error: 'Ingredient is required' });
        }
        const userContext = !dbAvailable
            ? await mockDB_1.mockDB.findUserContextByUserId(userId)
            : await models_1.UserContext.findOne({ userId });
        const molecules = await flavorDB.getFlavorMolecules(ingredient);
        const alternatives = await flavorDB.findSimilarIngredients(ingredient);
        let safeAlternatives = alternatives;
        if (userContext && userContext.allergies.length > 0) {
            safeAlternatives = alternatives.filter(alt => {
                const altNameLower = alt.name.toLowerCase();
                return !userContext.allergies.some(allergen => altNameLower.includes(allergen.toLowerCase()));
            });
        }
        const topAlternatives = safeAlternatives.slice(0, 3);
        res.json({
            original: ingredient,
            molecules: molecules.slice(0, 5),
            alternatives: topAlternatives,
            totalFound: safeAlternatives.length
        });
    }
    catch (error) {
        next(error);
    }
}
async function getUserProfile(req, res, next) {
    try {
        const userId = req.user.userId;
        let user, userContext;
        if (!dbAvailable) {
            user = { _id: userId, email: 'demo@nutricontext.com', name: 'Demo User', createdAt: new Date() };
            userContext = await mockDB_1.mockDB.findUserContextByUserId(userId);
        }
        else {
            user = await models_1.User.findById(userId).select('-passwordHash');
            userContext = await models_1.UserContext.findOne({ userId });
        }
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({
            user: { id: user._id, email: user.email, name: user.name, createdAt: user.createdAt },
            context: userContext
        });
    }
    catch (error) {
        next(error);
    }
}
async function getRecentSearches(req, res, next) {
    try {
        const userId = req.user.userId;
        let searches;
        if (!dbAvailable) {
            searches = await mockDB_1.mockDB.getSearchHistory(userId, 10);
        }
        else {
            searches = await models_1.SearchHistory.find({ userId }).sort({ timestamp: -1 }).limit(10).select('query timestamp');
        }
        res.json({ searches });
    }
    catch (error) {
        next(error);
    }
}
// Add this function
async function signup(req, res, next) {
    try {
        const { email, password, name } = req.body;
        // Check if user exists
        const existingUser = await models_1.User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }
        // Create new user
        const hashedPassword = await (0, utils_1.hashPassword)(password);
        const user = await models_1.User.create({
            email: email.toLowerCase(),
            passwordHash: hashedPassword,
            name: name || 'User'
        });
        const token = (0, utils_1.generateJWT)(user._id.toString(), user.email);
        res.json({
            token,
            user: { id: user._id, email: user.email, name: user.name },
            onboardingCompleted: false
        });
    }
    catch (error) {
        next(error);
    }
}
