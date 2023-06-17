
const { MongoClient } = require('mongodb')
const dotenv = require('dotenv')
dotenv.config();

const url = process.env.MONGO_URI
const client = new MongoClient(url);

async function main() {
  const connection = await client.connect();
  if (connection) {
    return ('Connected successfully to server, done');
  }
  else { return 'unable to connect' }
}


const collection = client.db('Sarubashi').collection('accounts')

async function insertWallet(wallet, balance) {
  const existWallet = await getUser(wallet);
  if (existWallet) {
    return existWallet;
  }
  await collection.insertOne({ wallet: wallet, balance: balance });
  return getUser(wallet)
}


async function getWallet() {
  const data = await collection.find({}).toArray();
  return data;
}


async function getUser(wallet) {
  const data = await collection.findOne({ wallet: wallet });
  return data;
}

async function updateUser(wallet, amount) {
  const balance = await getUser(wallet);
  const newbalance = Number(balance.balance) + Number(amount)
  newbalance.toFixed(2)
  await collection.updateOne({ wallet: wallet }, { $set: { balance: Number(newbalance).toFixed(2) } });
  return getUser(wallet);
}

async function deleteUser(wallet) {
  await collection.deleteOne({ wallet: wallet })
  return getWallet()
}

module.exports = { insertWallet, updateUser, getWallet, getUser }
