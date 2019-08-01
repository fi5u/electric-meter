require('dotenv').config()

const express = require('express')
const app = express()
const port = 3456
const path = require('path')

app.use(express.static('./'))

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/index.html')))

app.get('/test', async (req, res) => {
    const AWS = require('ibm-cos-sdk');

    const config = {
        endpoint: process.env.CLOUD_ENDPOINT,
        apiKeyId: process.env.CLOUD_API_KEY,
        ibmAuthEndpoint: 'https://iam.cloud.ibm.com/identity/token',
        serviceInstanceId: process.env.CLOUD_INSTANCE,
    }

    const cos = new AWS.S3(config)

    async function createTextFile(bucketName, itemName, fileText) {
        console.log(`Creating new item: ${itemName}`);
        return cos.putObject({
            Bucket: bucketName,
            Key: itemName,
            Body: fileText
        }).promise()
            .then(() => {
                console.log(`Item: ${itemName} created!`);
            })
            .catch((e) => {
                console.error(`ERROR: ${e.code} - ${e.message}\n`);
            });
    }

    await createTextFile('tf-electric-meter', 'MyTestfile', JSON.stringify({ a: 123, b: 'Yes', c: ['a', 'b', 'c'] }))

    res.sendStatus(200)
})

app.listen(port, () => console.log(`Electric meter app listening on port ${port}!`))