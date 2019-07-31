const express = require('express')
const app = express()
const port = 3456
const path = require('path')

app.use(express.static('./'))

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/index.html')))

app.listen(port, () => console.log(`Electric meter app listening on port ${port}!`))