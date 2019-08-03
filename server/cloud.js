module.exports = {
    read: async (cos, bucketName, itemName) => {
        console.log(`Retrieving item from bucket: ${bucketName}, key: ${itemName}`)

        try {
            const data = await cos.getObject({
                Bucket: bucketName,
                Key: itemName
            }).promise()

            if (data) {
                return Buffer.from(data.Body).toString()
            }
        } catch (error) {
            throw new Error(error.message)
        }
    },

    write: async (cos, bucketName, itemName, fileText) => {
        console.log(`Creating new item: ${itemName}`)
        try {
            await cos.putObject({
                Bucket: bucketName,
                Key: itemName,
                Body: fileText
            }).promise()

            console.log(`Item: ${itemName} created!`)
        } catch (error) {
            throw new Error(error.message)
        }
    }
}
