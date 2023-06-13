const mysql = require('mysql2');
const dotenv = require('dotenv')
dotenv.config();
const connection = {
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE
}

const pool = mysql.createPool(connection).promise();


async function createAccount(wallet) {
    const [user] = await pool.query(`
    insert into users(wallet)
    values(?)`, [wallet]);
    return getUser(wallet);
}

async function getUser(wallet) {
    const [details] = await pool.query(`select *from users where wallet = ?`, [wallet]);
    return details[0];
}

const updateBalance = async (wallet, balance) => {
    const [account] = await pool.query(`
    update users set balance = ?
    where wallet = ?`, [wallet, balance]);
    return account;
}

module.exports = { createAccount, getUser, updateBalance }