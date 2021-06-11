const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const maxEmailAccounts = config.MAX_EMAIL_EXISTS
const nodeoutlook = require('./nodeoutlook')
const cookieParser = require('cookie-parser')

// MongoDB Connection
const mongoUtil = require('../src/mongoUtil')
const db = mongoUtil.getDb()

const sendLoginCodeEmail = (email, loginCode) => {
    nodeoutlook.sendEmail({
        auth: {
            user: "hi.ate@outlook.com",
            pass: "jzhipster0222225678"
        },
        from: 'hi.ate@outlook.com',
        to: email,
        subject: `Your temporary ATE-Dashboard`,
        html: `
            <p>Hi there, your login code is <strong>${loginCode}</strong></p>
            <p>Please input code <a href="${config.HOST}/accounts/login/code" target="_blank">here</a></p>
        `,
        onError: (e) => console.log(e),
        onSuccess: (i) => console.log(i)
    });
}

exports.register = async (req, res) => {

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt)

    const username = req.body.username
    const emailAddress = req.body.email_address

    try {

        this.checkUsername()

        const firstName = req.body.first_name
        const lastName = req.body.last_name
        const isActive = req.body.is_active
        const isStaff = req.body.is_staff
        const isSuperuser = req.body.is_superuser

        const dateRegister = Date.now()
        const loginCode = null
        const lastAttemptLogin = null
        const lastSuccessLogin = null
        const loginCodeExpiredTime = null

        let new_user = {
            username: username,
            password: hashPassword,
            first_name: firstName,
            last_name: lastName,
            email_address: emailAddress,
            is_active: isActive,
            is_superuser: isSuperuser,
            is_staff: isStaff,
            date_register: dateRegister,
            login_code: loginCode,
            login_code_expired_time: loginCodeExpiredTime,
            last_attempt_login: lastAttemptLogin,
            last_success_login: lastSuccessLogin,
        }

        // Save a new user in database
        const result = await db.collection("auth_users").insertOne(new_user)
        console.log(`New account is created with the following id: ${result.insertedId}`)

        res.status(200).send({ 'message': `Registration is successful. Please login again` })
    }
    catch (err) {
        console.log('Error registration: ', err);
    }
}

exports.login = async (req, res) => {

    // read cookies
    const userQuery = {
        username: req.body.username,
    }

    const result = await db.collection("auth_users").findOne(userQuery)

    if (result) {
        const validPass = await bcrypt.compare(req.body.password, result.password)
        // If password doesn't match
        if (!validPass) return res.status(401).send({ 'error': 'Credential is wrong' });

        // TODO add if (validPass & localstorage keeplogin)

        if (config.TWO_FACTOR_AUTHENTICATION) {
            // If matches, client redirects to login code page
            const loginCode = Math.floor(100000 + Math.random() * 900000) /*create 6 digits random number*/

            const maxAge = config.NORMAL_LOGIN_DAYS; // login code expiry time after login 
            const currentDate = new Date();
            const loginCodeExpired = new Date(currentDate.getTime() + minutesToAdd * 60000);

            // send login code email
            sendLoginCodeEmail(result.email_address, loginCode)

            let newValues = { $set: { login_code: loginCode, login_code_expired_time: loginCodeExpired } };
            db.collection("auth_users").updateOne(userQuery, newValues, (err, res) => {
                if (err) throw err;
                console.log("1 document updated");
                console.log(`Login Attempts ${req.body.username} with code: ${loginCode}`)
            });

            const token = jwt.sign(payload, config.TOKEN_SECRET, { expiresIn: maxAge * 60000 }) /* Expires token in 5 minutes */
            res.cookie('token', token, { maxAge: maxAge * 60000 })
            console.log(res)
            return res.status(200).send({ token, 'message': `One more step, please input the login code` })

        } else {
            let payload = {
                id: result._id,
                username: result.username,
                email_address: result.email_address,
            }
            const token = jwt.sign(payload, config.TOKEN_SECRET, { expiresIn: `${config.NORMAL_LOGIN_DAYS} days` })
            return res.status(200).send({ token, 'message': `Login is successful` })
        }

    } else {
        res.status(401).send({ 'error': 'Credential is wrong' })
    }
}

exports.submitLoginCode = async (req, res) => {

    // put in client const token = window.sessionStorage.getItem('dashboard-login');

    const token = req.body.token
    const userToken = jwt.verify(token, config.TOKEN_SECRET)

    const loginCode = req.body.login_code

    if (userToken.allowLogin) {

        const userQuery = {
            login_code: loginCode,
            username: userToken.username,
            email_address: userToken.email_address
        }

        const result = await db.collection("auth_users").findOne(userQuery)
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
            date_joined: result.date_joined,
        };

        const dayLoginExpiry = keepLogin ? config.KEEP_LOGIN_DAYS : config.NORMAL_LOGIN_DAYS

        const token = jwt.sign(payload, config.TOKEN_SECRET, { expiresIn: `${dayLoginExpiry} days` });

        // put inside client window.localStorage.setItem('dashboard-user', token);
        res.status(200).header("auth-token", token).send({ "token": token });
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


exports.checkMaxEmailUsage = async (req, res) => {

    const emailAddress = req.body.email_address

    const countEmailExists = await db
        .collection("auth_users")
        .find({
            email_address: emailAddress
        })
        .count()

    // * If email exceeds 'maxEmailAccounts' variable, then return error
    if (countEmailExists > maxEmailAccounts) {
        console.log('Email exceeds maximum standard');
        return res.status(200).send({ 'error': 'Email exceeds maximum standard' })
    }

    return res.status(200).send({ 'message': 'Email is valid' })
}

exports.checkUsername = async (req, res) => {

    const username = req.body.username
    // Check whether username 
    const isUsernameExists = await db
        .collection("auth_users")
        .findOne({
            username: username
        })

    // * If username does exist, then return error
    if (isUsernameExists) {
        console.log('Username does already exist. Please use other username');
        return res.status(200).send({ 'error': 'Username does already exist. Please use other username' })
    }

    return res.status(200).send({ 'message': 'Username is valid' })
}