// const { createClient } = require('@clickhouse/client')
// const dotenv = require('dotenv');

import { createClient } from '@clickhouse/client'
import dotenv from 'dotenv';

dotenv.config();

const client = createClient({
    host: process.env.CLICKHOUSE_HOST,
    password: '8u95.LznHvfBb',
    username: 'default',
    max_open_connections: "Infinity"
})


async function createTable() {
    const valid = await client.exec({
        query: `
    CREATE TABLE IF NOT EXISTS
    customertable(wallet String, balance int) ORDER BY (wallet)`,
        clickhouse_settings: {
            wait_for_async_insert: true,
        }
    });
    if (valid) {
        return ('success table created')
    }
    else { return ('table already exist') }

}


async function insertUser(wallet) {
    const workload = await client.insert({
        table: `customertable(wallet)`,
        values: { wallet: wallet },
        format: 'JSONEachRow'
    });
    return getUsers()
};

async function getUsers() {
    const data = await client.query({
        query: `select *from customertable`,
        format: 'JSONEachRow'
    });
    return data.json()
}


async function updateUsers(balance, x) {
    const account = await client.query({
        query: `alter table customertable update balance = ${balance} where wallet = ${x}`,
        format: 'JSONEachRow'
    });
    return getUsers()
}


async function deleteUser() {
    await client.query({
        query: `
        ALTER TABLE sarubashi
        DELETE WHERE id = ${1}`,
        format: 'JSONEachRow'
    })
    return 'row deleted'
}

// const table = await createTable();
// const user = await insertUser('wallet2')
const update = await updateUsers(200, "wallet2")
console.log(update)
// module.exports = { insertUser, getUsers, updateUsers, deleteUser }
