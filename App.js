const express = require('express')
const port = process.env.PORT || 2020;
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express();
const { insertWallet, updateUser, getWallet, getUser } = require('./sarubashi.js')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors())


// app.get('/account/:wallet', async (req, res) => {
//     const wallet = req.params.wallet
//     const wallets = await getUser(wallet)
//     res.send(wallets)
// });



app.post('/signup', async (req, res) => {
    const { wallet } = req.body;
    try {
        const account = await insertWallet(wallet)
        res.send(account);
    } catch (error) {
        res.send(new Error(error))
    }
});


app.post('/buytoken', async (req, res) => {
    const { wallet, amount } = req.body
    const data = await updateUser(wallet, amount);
    res.send(data)
});



app.listen(port, () => { console.log(`Sarubashi server running on port ${port}`) })