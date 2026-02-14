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
// src/routes.ts
const express_1 = require("express");
const controllers = __importStar(require("./controllers"));
const middleware_1 = require("./middleware");
const router = (0, express_1.Router)();
// ============== AUTH ROUTES ==============
router.post('/auth/login', controllers.login);
router.post('/auth/signup', controllers.signup);
router.post('/auth/demo', controllers.demoLogin);
// ============== ONBOARDING ROUTES ==============
router.post('/onboarding', middleware_1.requireAuth, controllers.saveOnboarding);
router.get('/onboarding', middleware_1.requireAuth, controllers.getOnboarding);
// ============== RECIPE ROUTES ==============
router.post('/recipes/search', middleware_1.requireAuth, controllers.searchRecipes);
router.get('/recipes/:id', middleware_1.requireAuth, controllers.getRecipeById);
// ============== SUBSTITUTIONS ==============
router.post('/substitutions', middleware_1.requireAuth, controllers.findSubstitutions);
// ============== USER ROUTES ==============
router.get('/user/profile', middleware_1.requireAuth, controllers.getUserProfile);
router.get('/user/searches', middleware_1.requireAuth, controllers.getRecentSearches);
exports.default = router;
