const express = require('express')
const morgan = require('morgan')
const fs = require('fs')
const app = express()
const port = process.env.PORT || 8080

const readStream = fs.createReadStream('./uploads/data.txt', { encoding: 'utf8' })

const data = [
    { "id": 1, "name": "Richard" },
    { "id": 2, "name": "Firdaus" },
    { "id": 3, "name": "Oeyliawan" },
]

app.use(morgan('dev'))
app.use(express.json())

app.get('/api/data', (req, res) => {
    res.send(data)
    
})

app.get('/api/uploads', (req, res) => {
    readStream.on('data', (chunk) => {
        res.send(chunk)
    })
    
})

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`);
})



