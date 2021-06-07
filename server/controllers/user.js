const { MongoClient } = require('mongodb')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const dbURI = config.DB_HOST
const maxEmailAccounts = 3
const nodeoutlook = require('./nodeoutlook')

const client = new MongoClient(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const sendConfirmationEmail = (email, confirmationCode) => {
    nodeoutlook.sendEmail({
        auth: {
            user: "hi.ate@outlook.com",
            pass: "jzhipster0222225678"
        },
        from: 'hi.ate@outlook.com',
        to: email,
        subject: 'Confirm Your Email Address',
        html: `
            <p>Hi there, your confirmation code is <strong>${confirmationCode}</strong></p>
            <p>Please login again <a href="${config.HOST}/accounts/login" target="_blank">here</a></p>
        `,
        onError: (e) => console.log(e),
        onSuccess: (i) => console.log(i)
    });
}

async function run() {
    try {
        // Connect the client to the server
        await client.connect();
        // Establish and verify connection
        await client.db("test").command({ ping: 1 });
        console.log("Connected successfully to server");
    } catch (err) {
        console.log('Error: ', error);
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}

run().catch(console.error)

exports.register = async (req, res) => {
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt)
    const username = req.body.username
    const emailAddress = req.body.email_address

    try {
        // Check whether username or email exists
        const isUsernameExists = await client.db("ate_mongodb")
            .collection("auth_users")
            .findOne({
                username: username
            })

        const countEmailExists = await client.db("ate_mongodb")
            .collection("auth_users")
            .find({
                email_address: emailAddress
            })
            .count()

        // * If username does exist, then return error
        if (isUsernameExists) {
            console.log('Username does already exist');
            return res.status(200).send({ 'error': 'Username does already exist' })
        }

        // * If email exceeds 'maxEmailAccounts' variable, then return error
        if (countEmailExists > maxEmailAccounts) {
            console.log('Email exceeds maximum standard');
            return res.status(200).send({ 'error': 'Email exceeds maximum standard' })
        }

        const firstName = req.body.first_name
        const lastName = req.body.last_name
        const isActive = req.body.is_active
        const isStaff = req.body.is_staff
        const isSuperuser = req.body.is_superuser

        const confirmationCode = Math.floor(100000 + Math.random() * 900000) /*create 6 digits random number*/
        const isEmailConfirmed = false
        const dateRegister = Date.now()
        const dateConfirmedAccount = null
        const lastLogin = null

        let new_user = {
            username: username,
            password: hashPassword,
            first_name: firstName,
            last_name: lastName,
            email_address: emailAddress,
            is_active: isActive,
            is_superuser: isSuperuser,
            is_staff: isStaff,
            confirmation_code: confirmationCode,
            is_email_confirmed: isEmailConfirmed,
            date_register: dateRegister,
            date_confirmed_account: dateConfirmedAccount,
            last_login: lastLogin
        }

        // Save a new user in database
        sendConfirmationEmail(emailAddress, confirmationCode)
        // const result = await client.db("ate_mongodb").collection("auth_users").insertOne(new_user)
        // console.log(`New account is created with the following id: ${result.insertedId}`)


        // let payload = {
        //     id: result.insertedId,
        //     username: result.ops[0].username,
        //     email_address: result.ops[0].email_address,
        // }

        // const token = jwt.sign(payload, config.TOKEN_SECRET)
        // res.status(200).send({ token, 'message': `Please check your email ${email_address} and confirm your account`})
        res.status(200).send({ 'message': `Please check your email ${emailAddress} and confirm your account` })
    }
    catch (err) {
        console.log('Error registration: ', err);
    }
}

exports.login = async (req, res) => {

    const user = {
        username: req.body.username,
    }

    const result = await client.db("ate_mongodb").collection("auth_users").findOne(user)

    if (result) {
        const validPass = await bcrypt.compare(req.body.password, result.password)

        // If password doesn't match
        if (!validPass) return res.status(401).send("Credential is wrong");

        // Create and assign token
        let payload = {
            id: result._id,
            is_active: result.is_active,
            is_staff: result.is_staff,
            is_superuser: result.is_superuser,
            username: result.username,
            first_name: result.first_name,
            last_name: result.last_name,
            email_address: result.email_address,
            date_joined: result.date_joined
        };

        const token = jwt.sign(payload, config.TOKEN_SECRET);

        res.status(200).header("auth-token", token).send({ "token": token });
    } else {
        res.status(401).send('Credential is wrong')
    }
}


exports.userEvent = (req, res) => {
    let events = [
        {
            "_id": "1",
            "name": "Auto Expo",
            "description": "lorem ipsum",
            "date": "2012-04-23T18:25:43.511Z"
        },
        {
            "_id": "2",
            "name": "Auto Expo",
            "description": "lorem ipsum",
            "date": "2012-04-23T18:25:43.511Z"
        },
        {
            "_id": "3",
            "name": "Auto Expo",
            "description": "lorem ipsum",
            "date": "2012-04-23T18:25:43.511Z"
        }
    ]

    res.json(events)
};
