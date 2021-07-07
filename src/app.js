const express = require('express')
const app = express();
const path = require("path")
const bcrypt = require('bcryptjs')
const bodyParser = require('body-parser')
require("./dbConnection");
const User = require("./model/user")
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000


const JWT_SECRET = 'cskdlmksdmkmfkkicvnosoeinkcoskINKNCSOC@#$%^&*(NIKNDWAWINFEFnifosefnefs'

app.use("/", express.static(path.join(__dirname, '../static')))
app.use(bodyParser.json())

app.post('/user/changepassword/', async (req, res) => {
    const { token, newpassword: plainTextPassword } = req.body
    if (plainTextPassword.length < 3) {
        return res.json({ status: 'error', error: 'password too small' })
    }   
    try {
        const user = jwt.verify(token, JWT_SECRET)
        const _id = user.id
        const password = await bcrypt.hash(plainTextPassword,10)
        await User.updateOne(
            { _id },
            {
                $set: { password }
            }
        )
        res.json({status:'ok'})
        console.log(user)
    } catch (error) {
        return res.json({ status: 'error', error: 'wrong user' })
    }
})

app.post('/user/login', async (req, res) => {
    const { username, password } = req.body

    const user = await User.findOne({ username }).lean()
    if (!user) {
        return res.json({ status: 'error', error: 'invalid username/password' })
    }
    if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET)

        return res.json({ status: 'ok', data: token })
    }
    res.json({ status: 'error', error: 'invalid username/password' })
})

app.post('/user/register', async (req, res) => {
    //console.log(req.body)

    const { username, password: plainTextPassword } = req.body
    const password = await bcrypt.hash(plainTextPassword, 10)
    // console.log(password)
    if (!username || typeof username !== 'string') {
        res.json({ status: 'error', error: 'username required' })
    }
    if (plainTextPassword.length < 3) {
        return res.json({ status: 'error', error: 'password too small' })
    }

    try {
        const response = await User.create({
            username,
            password
        })
        console.log("user created success", response)

    } catch (err) {
        console.log(err.message)
        if (err.code === 11000)
            return res.json({ status: 'error', error: "username exits" })
        throw err
    }

    res.json({ status: 'ok' })
})
app.listen(5000, () =>
    console.log("server is running at ", port)
)