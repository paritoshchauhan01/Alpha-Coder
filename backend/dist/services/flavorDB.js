"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFlavorMolecules = getFlavorMolecules;
exports.findSimilarIngredients = findSimilarIngredients;
exports.getPairingScore = getPairingScore;
// src/services/flavorDB.ts
const axios_1 = __importDefault(require("axios"));
const BASE_URL = process.env.FLAVORDB_BASE_URL || 'https://api.foodoscope.com/flavordb';
const API_KEY = process.env.FLAVORDB_API_KEY || '';
const flavorDBClient = axios_1.default.create({
    baseURL: BASE_URL,
    headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
    },
    timeout: 10000
});
async function getFlavorMolecules(ingredient) {
    try {
        const response = await flavorDBClient.get(`/api/ingredients/${ingredient}/molecules`);
        return response.data.molecules || [];
    }
    catch (error) {
        console.error('FlavorDB molecules error:', error.message);
        return getMockMolecules(ingredient);
    }
}
async function findSimilarIngredients(ingredient) {
    try {
        const response = await flavorDBClient.get(`/api/similar/${ingredient}`);
        return response.data.alternatives || [];
    }
    catch (error) {
        console.error('FlavorDB similar error:', error.message);
        return getMockSubstitutions(ingredient);
    }
}
async function getPairingScore(ing1, ing2) {
    try {
        const response = await flavorDBClient.post('/api/pairing', {
            ingredient1: ing1,
            ingredient2: ing2
        });
        return response.data.score || 0;
    }
    catch (error) {
        console.error('FlavorDB pairing error:', error.message);
        return 50;
    }
}
function getMockMolecules(ingredient) {
    const moleculeMap = {
        'pancetta': ['2-methylbutanal', 'dimethyl sulfide', '3-methylbutanal', 'hexanal'],
        'basil': ['linalool', 'eugenol', 'methyl chavicol', '1,8-cineole'],
        'tomato': ['hexanal', '(E)-2-hexenal', 'beta-ionone', '6-methyl-5-hepten-2-one'],
        'garlic': ['diallyl disulfide', 'allicin', 'allyl methyl sulfide'],
        'default': ['limonene', 'linalool', 'hexanal']
    };
    return moleculeMap[ingredient.toLowerCase()] || moleculeMap['default'];
}
function getMockSubstitutions(ingredient) {
    const substitutionMap = {
        'pancetta': [
            {
                name: 'Bacon',
                flavorMatch: 85,
                sharedMolecules: ['2-methylbutanal', 'dimethyl sulfide'],
                reason: 'Similar smoky, savory flavor profile. Shares key molecules: 2-methylbutanal and dimethyl sulfide which provide the characteristic cured meat taste.',
                nutritionImpact: 'Slightly higher fat (+2g per 100g), similar protein content'
            },
            {
                name: 'Guanciale',
                flavorMatch: 95,
                sharedMolecules: ['2-methylbutanal', 'dimethyl sulfide', '3-methylbutanal'],
                reason: 'Traditional Italian alternative. Nearly identical flavor molecules with enhanced richness from higher fat content.',
                nutritionImpact: 'Higher fat (+4g per 100g), same protein, more authentic for carbonara'
            },
            {
                name: 'Smoked Tofu',
                flavorMatch: 65,
                sharedMolecules: ['hexanal'],
                reason: 'Plant-based option with smoky notes from liquid smoke compounds. Less complex flavor profile.',
                nutritionImpact: 'Lower fat (-8g per 100g), lower calories (-80), higher fiber (+3g)'
            }
        ],
        'basil': [
            {
                name: 'Oregano',
                flavorMatch: 85,
                sharedMolecules: ['linalool', 'eugenol'],
                reason: 'Similar aromatic profile with shared terpenes. Both have sweet, slightly spicy notes.',
                nutritionImpact: 'Nearly identical nutrition profile, slightly more pungent flavor'
            },
            {
                name: 'Thai Basil',
                flavorMatch: 90,
                sharedMolecules: ['linalool', 'eugenol', 'methyl chavicol'],
                reason: 'Very close relative with overlapping flavor compounds. Adds slight anise note.',
                nutritionImpact: 'Identical nutritional value, slightly stronger flavor'
            },
            {
                name: 'Mint',
                flavorMatch: 60,
                sharedMolecules: ['linalool'],
                reason: 'Shares cooling compounds but different flavor direction. Use sparingly.',
                nutritionImpact: 'Similar calories and nutrients, distinct cooling sensation'
            }
        ],
        'default': [
            {
                name: 'Similar ingredient 1',
                flavorMatch: 75,
                sharedMolecules: ['limonene', 'linalool'],
                reason: 'Shares major flavor compounds with the original ingredient.',
                nutritionImpact: 'Comparable nutritional profile'
            }
        ]
    };
    return substitutionMap[ingredient.toLowerCase()] || substitutionMap['default'];
}
exports.default = {
    getFlavorMolecules,
    findSimilarIngredients,
    getPairingScore
};
