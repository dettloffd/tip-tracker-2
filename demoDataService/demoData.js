const fs = require('fs');
const moment = require('moment');
const { Client } = require('pg');

let entriesData = [];


function generateEntry(date, tipsTotalRange, numTransactionsRange) {
    return [
        4,
        Math.floor(Math.random() * (tipsTotalRange[1] - tipsTotalRange[0] + 1)) + tipsTotalRange[0],
        Math.floor(Math.random() * (numTransactionsRange[1] - numTransactionsRange[0] + 1)) + numTransactionsRange[0],
        `'${moment(date).toISOString()}'`
    ];
}

function shouldSkipDay(day) {
    let chance = Math.floor(Math.random() * 10) + 1;
    return day <= 4 ? chance <= 4 : chance <= 2;
}

let startDate = moment('2019-06-09');
let endDate = moment();

while (startDate.isSameOrBefore(endDate)) {
    let dayOfWeek = startDate.day();

    if (!shouldSkipDay(dayOfWeek)) {
        let entry;
        if (dayOfWeek <= 2) {
            entry = generateEntry(startDate, [50, 80], [9, 16]);
        } else if (dayOfWeek == 3) {
            entry = generateEntry(startDate, [50, 90], [10, 18]);
        } else if (dayOfWeek == 6) {
            entry = generateEntry(startDate, [50, 110], [10, 20]);
        } else {
            entry = generateEntry(startDate, [60, 150], [10, 25]);
        }
        entriesData.push(entry);
    }

    startDate.add(1, 'days');
}
let sql = `INSERT INTO Entries (user_id, tips_total, num_transactions, date) VALUES \n${entriesData.map(row => `(${row.join(', ')})`).join(',\n')};`;

let client;
const processDatabaseEntries = async () => {
    try{
        const client = new Client({
            connectionString: process.env.DB_CONNECTION_STRING,
        });

        await client.connect()
        await dropCurrentEntries(client)
        await writeNewEntriesToDatabase(client)
        
    } catch (err) {
        console.log(err);
    } finally {
        // Check if client is defined and end the connection
        if (client) {
            await client.end();
        }
    }
}

const dropCurrentEntries = async (client) => {
  try {
    const res = await client.query(`
        DELETE FROM Entries
        WHERE user_id = 4;`)
    if (res.rowCount) {
      console.log(`Successfully deleted ${res.rowCount} from database`)
    }
  } catch (err) {
    throw new Error(`Error deleting entries from database: ${err.message}`)
  }
}

const writeNewEntriesToDatabase = async (client) => {
  try {
    const res = await client.query(sql)
    if (res.rowCount) {
      console.log(`Successfully wrote ${res.rowCount} to database`)
    }
  } catch (err) {
    throw new Error(`Error writing entries to database: ${err.message}`)
  }
}

exports.handler = async (event) => {
    await processDatabaseEntries();
    return {statusCode: 200, body: 'Data populated'};
  }