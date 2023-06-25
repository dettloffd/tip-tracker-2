import { Request, Response, NextFunction } from "express";
import { check } from "express-validator";
import { Entry, User } from "../types/types";
import dbInstance from '../config/db';
const { validationResult } = require("express-validator");

let pool = dbInstance.getPgClient();
let USER_TOKEN_KEY = 'supersecret_dont_share'

interface CustomRequest extends Request {
    userData: {
        userId: User['user_id'];
    };
}

const getEntriesByUserId = async (req: Request, res: Response, next: NextFunction) => {
    // const user_id: number = 1;
    const user_id = req.params.uid;
    let entries: Entry[] | null;

    try {
        const result = await pool.query('SELECT * FROM entries WHERE user_id = $1', [user_id]);
        entries = result.rows;
    } catch (err) {
        return res.status(500).json({
            success: false,
            message:
                "Something went wrong; unable to locate data with provided arguments",
        });
    }

    if (!entries || entries.length === 0) {
        return res.json({
            success: false,
            message: `No entries exist with provided user ID`,
        });
    }

    return res.json({
        success: true,
        count: entries.length,
        message: `Retrieval successful. [${entries.length}] entries located with provided user ID.`,
        entries: entries,
    });
};


const getEntriesByUserIdBetweenDates = async (req: Request, res: Response, next: NextFunction) => {
    const queryString = req.query;
    const startDate = queryString.startDate;
    const endDate = queryString.endDate;
    const userId = req.params.uid;
    let entries: Entry[] | null;

    try {
        const result = await pool.query('SELECT * FROM entries WHERE user_id = $1 AND date BETWEEN $2 AND $3', [userId, startDate, endDate]);
        entries = result.rows;
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message:
                "Something went wrong; unable to locate data with provided arguments",
        });
    }

    if (!entries || entries.length === 0) {
        return res.json({
            success: false,
            message: `No entries exist between ${startDate} and ${endDate} with provided user ID`,
        });
    }

    return res.json({
        success: true,
        count: entries.length,
        message: `Retrieval successful. [${entries.length}] entries located with provided user ID.`,
        entries: entries,
    });

}

const createEntry = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { date, numTransactions, tipsTotal } = req.body;
    // const { date, numTransactions, tipsTotal, creator } = req.body;
    const creator = req.body.userData.userId

    let user: User | undefined;
    try {
        const userResult = await pool.query('SELECT * FROM users WHERE user_id = $1', [creator]);
        user = userResult.rows[0] as User;
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Entry creation failed (server error)",
        });
    }

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User for provided ID not found",
        });
    }

    let newEntry: Entry | undefined;
    try {
        const entryResult = await pool.query(
            `INSERT INTO entries (date, num_transactions, tips_total, user_id)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
            [date, numTransactions, tipsTotal, creator]
        );
        newEntry = entryResult.rows[0] as Entry;
    } catch (err: unknown) {
        console.log(err);
        if (err instanceof Error && err.name === "ValidationError") {
            const messages = Object.values((err as any).errors).map((val: any) => val.message);
            return res.status(422).json({
                success: false,
                message: "Creation failed; required parameters missing",
                messages: messages,
            });
        } else {
            return res.status(500).json({
                success: false,
                message: "Server error",
            });
        }
    }
    res.status(201).json({ success: true, entry: newEntry });
};



const editEntry = async (req: CustomRequest, res: Response, next: NextFunction) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //method on the validator to check if empty
        res.status(422).json({
            success: false,
            message: "Invalid inputs passed! Check data and try again",
        });
    }

    const { date, numTransactions, tipsTotal, userId } = req.body;
    const entryId = req.params.eid;


    // const { date, numTransactions, tipsTotal } = req.body;
    // const userId = req.userData.userId; 
    // After we get JWT set up, we can use

    let entry: Entry | undefined;
    try {
        const result = await pool.query('SELECT * FROM entries WHERE entry_id = $1 AND user_id = $2', [entryId, userId]);
        entry = result.rows[0];
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "something wrong with request",
        });
    }

    if (!entry) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized attempt to edit data - you are not allowed to edit this entry",
        });
    }

    let editedEntry: Entry | undefined;
    try {
        const editEntryResult = await pool.query(
            `UPDATE entries SET date = $1, num_transactions = $2, tips_total = $3, updated_at = CURRENT_TIMESTAMP WHERE entry_id = $4 RETURNING *`,
            [date, numTransactions, tipsTotal, entryId]);
        editedEntry = editEntryResult.rows[0] as Entry;
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: "Something went wrong; cannot update",
        });
    }
    res.status(200).json({
        success: true,
        entry: editedEntry
    });
};


const deleteEntry = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const entryId = req.params.eid;
    // const userId = req.userData.userId;

    const { userId } = req.body;
  
    let entry: Entry | undefined;
    try {
      const result = await pool.query('SELECT * FROM entries WHERE entry_id = $1 AND user_id = $2', [entryId, userId]);
      entry = result.rows[0];
    } catch (err) {
        console.log(err)
      return res.status(500).json({
        success: false,
        message: "Something wrong with request (server error))",
      });
    }
  
    if (!entry) {
      return res.status(401).json({
        success: false,
        message: "No entry found with the provided entry ID and user ID",
    });
    }
  
    try {
      await pool.query('DELETE FROM entries WHERE entry_id = $1', [entryId]);
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Something went wrong; unable to delete entry",
      });
    }
  
    res.json({ success: true, message: "Entry deleted", entryId: entryId });
  };
// const getEntriesByUserId = async (req, res, next) => {
//     const userId = req.params.uid;
//     let entries;

//     try {
//       entries = await Entry.aggregate([
//         { $match: { creator: ObjectId(userId) } },
//         {
//           $project: {
//             date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
//             numTransactions: 1,
//             tipsTotal: 1,
//             creator: 1,
//           },
//         },
//         { $sort: { date: -1 } },
//       ]);
//     } catch (err) {
//       return res.status(500).json({
//         success: false,
//         message:
//           "Something went wrong; unable to locate data with provided arguments",
//       });
//     }

//     if (!entries || entries.length === 0) {
//       return res.json({
//         success: false,
//         message: `No entries exist with provided user ID`,
//       });
//     }

//     return res.json({
//       success: true,
//       count: entries.length,
//       message: `Retrieval successful. [${entries.length}] entries located with provided user ID.`,
//       entries: entries,
//     });
//   };



exports.getEntriesByUserId = getEntriesByUserId;
exports.getEntriesByUserIdBetweenDates = getEntriesByUserIdBetweenDates;
exports.createEntry = createEntry;
exports.editEntry = editEntry;
exports.deleteEntry = deleteEntry;
// exports.getAll = getAll;
// exports.testing = testing;