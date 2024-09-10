// const aws = require("aws-sdk")
// // const sharp = require('sharp');

// aws.config.update({
//   accessKeyId: "AKIA2O5JCVV7RAQKMDP5",

//   secretAccessKey: "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",

//   region: "eu-north-1",
// })

// let s3 = new aws.S3({ apiVersion: "2006-03-01" })

// const Jimp = require("jimp")

// exports.uploadFile = async (file) => {
//   try {
//     const image = await Jimp.read(file.buffer)
//     await image.resize(800, Jimp.AUTO)
//     await image.quality(70)
//     const optimizedImage = await image.getBufferAsync(Jimp.MIME_JPEG)

//     const params = {
//       ACL: "public-read",
//       Bucket: "charvik-user-or-transaction-image",
//       Key: "transaction_image/" + file.originalname,
//       Body: optimizedImage,
//     }

//     const result = await s3.upload(params).promise()

//     console.log(`File uploaded successfully. ETag: ${result.ETag}`)

//     return result.Location
//   } catch (err) {
//     console.error(err)
//     res.status(500).send("Error uploading file")
//   }
// }
