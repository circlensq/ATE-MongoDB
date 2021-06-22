const express = require('express')
const app = express()
const port = process.env.PORT || 8000
const config = require('../config/config')
const cookieParser = require('cookie-parser')
const path = require('path')

let mongoUtil = require('./mongoUtil')

global.__basedir = path.join(__dirname, '../');

mongoUtil.connectToServer(function (err, client) {
    if (err) console.log(err);
    app.use(cookieParser(config.TOKEN_SECRET))
    
    app.use(
        express.urlencoded({
            extended: true
        })
    )
    
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

