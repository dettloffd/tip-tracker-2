import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config()

const pgUrl = process.env.DATABASE_URL


class DbConn {
    private static instance: DbConn;
    private pgClient!: Client; 
    
    constructor() {
        if (DbConn.instance) {
            return DbConn.instance;
        }

        this.pgClient = new Client({ connectionString: pgUrl });
        DbConn.instance = this;
    }

    async connect() {
        try {
            await this.pgClient.connect();
            console.log('Connected to DB');
            // const result = await pool.query('SELECT * FROM entries');
            // let pool = dbInstance.getPgClient();
        } catch (err) {
            console.log(err);
        }
    }

    getPgClient() {
        return this.pgClient;
    }
}

const databaseInstance = new DbConn();
databaseInstance.connect();

export default databaseInstance;
// module.exports = databaseInstance;
