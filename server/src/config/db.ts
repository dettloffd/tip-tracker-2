import { Client } from 'pg';
import dotenv from 'dotenv';
import { logger } from '../util/Logger';

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
            logger.info('Connected to DB');
            // const result = await pool.query('SELECT * FROM entries');
            // let pool = dbInstance.getPgClient();
        } catch (err) {
            logger.error(err)
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
