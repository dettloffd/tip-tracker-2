"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const { check } = require("express-validator");
// const express = require("express");
const express_1 = __importDefault(require("express"));
const usersControllers = require("../controllers/users-controllers");
const router = express_1.default.Router();
router.post("/signup", [
    // check("username").isLength({ min: 2 }),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 8 }),
], usersControllers.signup);
router.post("/login", usersControllers.login);
router.get("/login", (req, res) => {
    res.json({ message: "Test login route is working!" });
});
module.exports = router;
//# sourceMappingURL=users-routes.js.map