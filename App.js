const express = require('express')
const port = process.env.PORT || 2020;
const bodyParser = require('body-parser')

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
const { getUser, updateBalance, createAccount } = require('./db.js')





app.post('/signup', async (req, res) => {
    const { wallet } = req.body;
    try {
        const existUser = await getUser(wallet);
        if (existUser) {
            res.send('wallet already exist')
        }
        else {
            const account = await createAccount(wallet);
            res.send(account);
        }
    } catch (error) {
        res.send(new Error(error))
    }
});



app.post('/buytoken', async (req, res) => {
    const { wallet, amount } = req.body;
    const user = await getUser(wallet);
    if (user) {
        const new_balance = Number(amount) + Number(user.balance);
        await updateBalance(new_balance, wallet);
        const updatedValue = await getUser(wallet);
        res.send(updatedValue)
    }
    else { res.send('wallet not connected') }
});



app.post('/wallet', async (req, res) => {
    const { wallet } = req.body
    const user = await getUser(wallet);
    res.send(user)
});




app.listen(port, () => { console.log(`Sarubashi server running on port ${port}`) })