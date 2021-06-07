const express = require('express')
const morgan = require('morgan')
const { MongoClient } = require('mongodb')
const fs = require('fs')
const app = express()
const port = process.env.PORT || 8000
const jwt = require('jsonwebtoken')

app.use(
    express.urlencoded({
        extended: true
    })
)
app.use(express.json())
const authRoute = require('../routers/index')

// Route Middlewares
app.use('/api', authRoute)

// const readStream = fs.createReadStream('./uploads/data.txt', { encoding: 'utf8' })
// app.get('/api/uploads', (req, res) => {
//     readStream.on('data', (chunk) => {
//         res.send(chunk)
//     })
// })

// const changeStream = client.watch([
//     { $match: { operationType: "insert" } },
//     {
//         $project: {
//             "fullDocument.name": 1,
//             "fullDocument.address": 1,
//         },
//     },
// ])

// changeStream.on("change", change => {
//     const { name, address } = change.fullDocument;
//     console.log(`New order for ${name} at ${address}.`);
//   });

app.listen(port, function (err) {
    if (err) console.log("Error in server setup")
    console.log("Server listening on port", port);
})