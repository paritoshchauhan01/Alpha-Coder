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
exports.SearchHistory = exports.RecipeCache = exports.UserContext = exports.User = void 0;
// src/models.ts
const mongoose_1 = __importStar(require("mongoose"));
const UserSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
exports.User = mongoose_1.default.model('User', UserSchema);
const UserContextSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    lifeStage: { type: String, required: true },
    location: {
        country: { type: String, required: true },
        climate: { type: String, required: true }
    },
    allergies: [{ type: String }],
    dietaryRestrictions: [{ type: String }],
    favoriteCuisines: [{ type: String }],
    onboardingCompleted: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
exports.UserContext = mongoose_1.default.model('UserContext', UserContextSchema);
const RecipeCacheSchema = new mongoose_1.Schema({
    recipeId: { type: String, required: true, unique: true },
    data: { type: mongoose_1.Schema.Types.Mixed, required: true },
    createdAt: { type: Date, default: Date.now, expires: 86400 }
});
exports.RecipeCache = mongoose_1.default.model('RecipeCache', RecipeCacheSchema);
const SearchHistorySchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    query: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});
SearchHistorySchema.index({ userId: 1, timestamp: -1 });
exports.SearchHistory = mongoose_1.default.model('SearchHistory', SearchHistorySchema);
