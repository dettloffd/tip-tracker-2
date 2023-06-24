"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pgUrl = process.env.DATABASE_URL;
class DbConn {
    constructor() {
        if (DbConn.instance) {
            return DbConn.instance;
        }
        this.pgClient = new pg_1.Client({ connectionString: pgUrl });
        DbConn.instance = this;
    }
    async connect() {
        try {
            await this.pgClient.connect();
            console.log('Connected to DB');
            // const result = await pool.query('SELECT * FROM entries');
            // let pool = dbInstance.getPgClient();
        }
        catch (err) {
            console.log(err);
        }
    }
    getPgClient() {
        return this.pgClient;
    }
}
const databaseInstance = new DbConn();
databaseInstance.connect();
exports.default = databaseInstance;
// module.exports = databaseInstance;
//# sourceMappingURL=db.js.map