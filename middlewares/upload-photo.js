const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');
// aws.config.update({
//   secretAccessKey: process.env.AWSSecretKey,
//   accessKeyId: process.env.AWSAccessKeyId,
// });

// const s3 = new aws.S3();
let s3 = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWSAccessKeyId,
    secretAccessKey: process.env.AWSSecretKey,
  },
  sslEnabled: false,
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
});
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'smart-price',
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, Date.now().toString() + file.originalname);
    },
  }),
});

module.exports = upload;
