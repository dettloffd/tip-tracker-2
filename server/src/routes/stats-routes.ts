import express from "express";
const router = express.Router();

const statsControllers = require("../controllers/stats-controllers");

// router.get("/", statsControllers.testing);
router.get("/user/:uid/avgBetweenDates", statsControllers.avgVarByTimeBetweenDates);
router.get("/user/:uid/avg", statsControllers.avgVarByTimeGetAll);

module.exports = router;