"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jwtMiddleware = (req, res, next) => {
    // Allow options requests to proceed for CORS pre-flight 
    if (req.method === 'OPTIONS') {
        next();
    }
    try {
        // Check for the existence of Authorization header
        if (!req.headers.authorization) {
            throw new Error();
        }
        const authHeader = req.headers.authorization.split(' ');
        // Check if the Authorization header is correctly structured
        if (authHeader.length !== 2 || authHeader[0].toLowerCase() !== 'bearer') {
            throw new Error();
        }
        const token = authHeader[1];
        // Verify the token
        const decodedToken = jsonwebtoken_1.default.verify(token, `${process.env.USER_TOKEN_KEY}`);
        // Check for the existence of userId
        if (!decodedToken.userId) {
            throw new Error();
        }
        // Pass the user data along
        req.body.userData = { userId: decodedToken.userId };
        next();
    }
    catch (err) {
        return res.status(403).json({
            success: false,
            message: 'Authentication failed!',
        });
    }
};
exports.jwtMiddleware = jwtMiddleware;
//# sourceMappingURL=check-auth.js.map