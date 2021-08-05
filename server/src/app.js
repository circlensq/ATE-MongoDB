const express = require('express')
// const config = require('../config/config')
const cookieParser = require('cookie-parser')
const path = require('path')

const port = process.env.PORT || 8000
const app = express()

let mongoUtil = require('./mongoUtil')


global.__basedir = path.join(__dirname, '../');

mongoUtil.connectToServer(function (err, client) {
    if (err) console.log(err);
    app.use(cookieParser())
    
    app.use(express.json())
    const authRoute = require('../routers/index')

    app.use(express.static('media/upload/docs'))

    // Route Middlewares
    app.use('/api', authRoute)

    app.listen(port, function (err) {
        if (err) console.log("Error in server setup")
        console.log("Server listening on port", port);
    })
});

