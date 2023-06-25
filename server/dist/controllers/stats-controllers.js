"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../config/db"));
let pool = db_1.default.getPgClient();
const avgVarByTimeBetweenDates = async (req, res, next) => {
    const { startDate, endDate, statVar, timeVar } = req.query;
    const userId = req.params.uid;
    // check if statVar and timeVar are valid
    const validStatVars = ["numTransactions", "avgTip", "tipsTotal"];
    const validTimeVars = ["day", "month", "year"];
    if (!validStatVars.includes(statVar) || !validTimeVars.includes(timeVar)) {
        res.status(400).json({
            success: false,
            message: "Invalid statVar or timeVar",
        });
        return;
    }
    let results;
    try {
        const queryText = `
        WITH date_cte AS (
          SELECT
            entry_id,
            EXTRACT(DOW FROM date) AS day,
            EXTRACT(MONTH FROM date) AS month,
            EXTRACT(year FROM date) AS year
          FROM Entries
        ), something AS (
          SELECT 
            e.*, 
            d.day, 
            d.month, 
            d.year,
            ROUND((e.tips_total::float / NULLIF(e.num_transactions, 0))::numeric, 2) AS avg_tip
          FROM Entries e
          JOIN date_cte d ON e.entry_id = d.entry_id
          WHERE user_id = $1 AND date >= $2 AND date <= $3
        )
        SELECT 
          s.${timeVar}, 
          CAST(ROUND(AVG(s.${convertStatVar(statVar)})::numeric, 2) AS float) AS "${statVar}"
          FROM something s
        GROUP BY s.${timeVar};
      `;
        const queryValues = [userId, startDate, endDate];
        results = await pool.query(queryText, queryValues);
    }
    catch (err) {
        //   console.error(err);
        res.status(500).json({
            success: false,
            message: "Server Error! Please try again later.",
        });
        return;
    }
    let count;
    if (results && results.rows) {
        count = results.rows.length;
    }
    else {
        count = 0;
    }
    const xKey = timeVar;
    const yKey = statVar;
    // const sortedData = [...results.rows].sort((a, b) => Number(a[yKey]) - Number(b[yKey]));
    const sortedData = [...results.rows].sort((a, b) => (a[yKey]) - (b[yKey]));
    const low = sortedData[0];
    const high = sortedData[sortedData.length - 1];
    // console.log(low, high)
    // console.log(sortedData)
    res.json({
        count: count,
        results: results.rows,
        params: { statVar, timeVar },
        dateStuff: { startDate, endDate },
    });
};
const avgVarByTimeGetAll = async (req, res, next) => {
    const { statVar, timeVar } = req.query;
    const userId = req.params.uid;
    // if(statVar === 'avgTip'){
    //     statVar === 'avg_tip'
    // };
    // check if statVar and timeVar are valid
    const validStatVars = ["numTransactions", "avgTip", "tipsTotal"];
    const validTimeVars = ["day", "month", "year"];
    if (!validStatVars.includes(statVar) || !validTimeVars.includes(timeVar)) {
        res.status(400).json({
            success: false,
            message: "Invalid statVar or timeVar",
        });
        return;
    }
    let results;
    try {
        const queryText = `
        WITH date_cte AS (
          SELECT
            entry_id,
            EXTRACT(DOW FROM date) AS day,
            EXTRACT(MONTH FROM date) AS month,
            EXTRACT(year FROM date) AS year
          FROM Entries
        ), something AS (
          SELECT 
            e.*, 
            d.day, 
            d.month, 
            d.year,
            ROUND((e.tips_total::float / NULLIF(e.num_transactions, 0))::numeric, 2) AS avg_tip
          FROM Entries e
          JOIN date_cte d ON e.entry_id = d.entry_id
          WHERE user_id = $1
        )
        SELECT 
          s.${timeVar}, 
          CAST(ROUND(AVG(s.${convertStatVar(statVar)})::numeric, 2) AS float) AS "${statVar}"
          FROM something s
        GROUP BY s.${timeVar};
      `;
        const queryValues = [userId];
        results = await pool.query(queryText, queryValues);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Server Error! Please try again later.",
        });
        return;
    }
    let count;
    if (results && results.rows) {
        count = results.rows.length;
    }
    else {
        count = 0;
    }
    const xKey = timeVar;
    const yKey = statVar;
    // const sortedData = [...results.rows].sort((a, b) => Number(a[yKey]) - Number(b[yKey]));
    const sortedData = [...results.rows].sort((a, b) => (a[yKey]) - (b[yKey]));
    const low = sortedData[0];
    const high = sortedData[sortedData.length - 1];
    // console.log(low, high)
    // console.log(sortedData)
    res.json({
        count: count,
        results: results.rows,
        params: { statVar, timeVar },
        //   dateStuff: { startDate, endDate },
    });
};
const toSnakeCase = (str) => {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};
const convertStatVar = (statVar) => {
    const statVarMap = {
        "numTransactions": "num_transactions",
        "avgTip": "avg_tip",
        "tipsTotal": "tips_total"
    };
    if (!(statVar in statVarMap)) {
        // choose one of the following options:
        // throw an error
        throw new Error(`Invalid statVar: ${statVar}`);
        // or return a default value
        // return 'default_value';
    }
    return statVarMap[statVar];
};
exports.avgVarByTimeBetweenDates = avgVarByTimeBetweenDates;
exports.avgVarByTimeGetAll = avgVarByTimeGetAll;
//# sourceMappingURL=stats-controllers.js.map