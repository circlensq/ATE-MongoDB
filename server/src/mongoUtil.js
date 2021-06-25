const MongoClient = require('mongodb').MongoClient
const config = require('../config/config')
const dbURI = config.DB_HOST
const dbName = config.DB_NAME

const express = require('express')
const app = express()

const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer);

let _db;

module.exports = {
    connectToServer:
        function (callback) {
            // Connect the client to the server
            MongoClient.connect(dbURI, { useUnifiedTopology: true }, function (err, client) {
                // Establish connection
                _db = client.db(dbName);
                console.log("Connected successfully to server");
                return callback(err);
            });
        },

    getDb: function () {
        return _db;
    }
}