"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.comparePassword = comparePassword;
exports.generateJWT = generateJWT;
exports.verifyJWT = verifyJWT;
exports.extractToken = extractToken;
// src/utils.ts
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_change_this';
const SALT_ROUNDS = 10;
async function hashPassword(password) {
    return await bcrypt_1.default.hash(password, SALT_ROUNDS);
}
async function comparePassword(password, hash) {
    return await bcrypt_1.default.compare(password, hash);
}
function generateJWT(userId, email) {
    return jsonwebtoken_1.default.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' });
}
function verifyJWT(token) {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    catch (error) {
        throw new Error('Invalid or expired token');
    }
}
function extractToken(authHeader) {
    if (!authHeader)
        return null;
    if (authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7);
    }
    return authHeader;
}
