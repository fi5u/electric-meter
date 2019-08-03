require('dotenv').config()

const express = require('express')
const app = express()
const port = 3456
const path = require('path')

const cloudConfig = {
    endpoint: process.env.CLOUD_ENDPOINT,
    apiKeyId: process.env.CLOUD_API_KEY,
    ibmAuthEndpoint: 'https://iam.cloud.ibm.com/identity/token',
    serviceInstanceId: process.env.CLOUD_INSTANCE,
}
const AWS = require('ibm-cos-sdk')
const cos = new AWS.S3(cloudConfig)

const { read: readFromCloud, write: wrightToCloud } = require('./server/cloud.js')

app.use(express.json())
app.use(express.static('./'))

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/index.html')))

app.get('/api/historic_data', async (req, res) => {
    try {
        const historicData = await readFromCloud(cos, 'tf-electric-meter', 'years')

        res.json(historicData)
    } catch (error) {
        console.error('Error in GET historic_data:')
        console.error(error.message)

        res.sendStatus(400)
    }
})

app.post('/api/historic_data', async (req, res) => {
    try {
        const { years } = req.body

        await wrightToCloud(cos, 'tf-electric-meter', 'years', JSON.stringify(years))
        res.sendStatus(200)
    } catch (error) {
        console.error('Error in POST historic_data:')
        console.error(error.message)

        res.sendStatus(400)
    }
})

app.listen(port, () => console.log(`Electric meter app listening on port ${port}!`))