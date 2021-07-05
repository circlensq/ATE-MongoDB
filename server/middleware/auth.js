const config = require("../config/config");
const jwt = require('jsonwebtoken')

exports.verifyUserToken = (req, res, next) => {
    let token = req.headers.authorization
    if (!token) return res.status(401).send('Access Denied / Unauthorized request')

    try {
        token = token.split(' ')[1]
        if (token === 'null' || !token) return unauthorizedMessage

        let verifiedUser = jwt.verify(token, config.TOKEN_SECRET)
        
        if (!verifiedUser) return res.status(401).send('Unauthorized request')

        req.user = verifiedUser
        next()
    } catch (error) {
        res.status(400).send('Invalid Token')
    }
}

exports.IsStaff = async (req, res, next) => {
    if (!req.user.is_staff) {
        return res.status(401).send("Unauthorized!");
    }
    next();
}

exports.IsActive = async (req, res, next) => {
    if (!req.user.is_active) {
        return res.status(401).send("Unauthorized!");
    }
    next();
}

exports.IsSuperuser = async (req, res, next) => {
    if (!req.user.is_superuser) {
        return res.status(401).send("Unauthorized!");
    }
    next();
}