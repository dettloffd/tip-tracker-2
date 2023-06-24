"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const { check } = require('express-validator');
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
//
// const checkAuth = require("../middleware/check-auth");
const entriesControllers = require("../controllers/entries-controllers");
// router.get("/", entriesControllers.testing);
router.get("/user/:uid", entriesControllers.getEntriesByUserId);
router.get("/user/:uid/between", entriesControllers.getEntriesByUserIdBetweenDates);
// // url example: `http:{url}/api/entries/user/${userId}/between/?startDate=${startDate}&endDate=${endDate}`,
// router.get("/between", entriesControllers.getAllEntriesBetweenDates)
// // ^ No user
// router.get("/user/:uid", entriesControllers.getEntriesByUserId);
// router.use(jwtMiddleware);
// Place jwtMiddleware here - everything after this part must be authenticated
// *** The routes above this middleware require no authentication
router.patch("/:eid", [check("date").not().isEmpty(), check("numTransactions").not().isEmpty(), check("tipsTotal").not().isEmpty()], entriesControllers.editEntry);
router.post("/", [check("date").not().isEmpty(), check("numTransactions").not().isEmpty(), check("tipsTotal").not().isEmpty(), check("creator").not().isEmpty()], entriesControllers.createEntry);
router.delete("/:eid", entriesControllers.deleteEntry);
module.exports = router;
//# sourceMappingURL=entries-routes.js.map