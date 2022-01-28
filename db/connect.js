var mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();



const connectDatabase = () => {
    try {
        const con = mysql.createConnection({
            user: process.env.SQL_USER, 
            password: process.env.SQL_PASSWORD,
            host: process.env.SQL_SERVER,
            database: process.env.SQL_DBNAME
        });

        return con;
    } catch (e) {
        throw new Error(e.message);
    }
};

module.exports = {
    connectDatabase
}
