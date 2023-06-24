"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const statsControllers = require("../controllers/stats-controllers");
// router.get("/", statsControllers.testing);
router.get("/user/:uid/avgBetweenDates", statsControllers.avgVarByTimeBetweenDates);
router.get("/user/:uid/avg", statsControllers.avgVarByTimeGetAll);
module.exports = router;
//# sourceMappingURL=stats-routes.js.map