const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const s3 = new AWS.S3({
  region: process.env.AWS_REGION || "us-east-2"
});

async function uploadToS3(buffer, mimetype, originalname) {
  const fileExt = originalname.split(".").pop();
  const filename = `${uuidv4()}.${fileExt}`;

  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: filename,
    Body: buffer,
    ContentType: mimetype
  };

  const data = await s3.upload(params).promise();
  return data.Location; // URL pública
}

async function streamFromS3(key, range) {
  const head = await s3.headObject({
    Bucket: process.env.S3_BUCKET,
    Key: key,
  }).promise();

  const fileSize = head.ContentLength;

  const start = Number(range.replace(/\D/g, ""));
  const CHUNK_SIZE = 10 ** 6;
  const end = Math.min(start + CHUNK_SIZE - 1, fileSize - 1);

  const stream = s3.getObject({
    Bucket: BUCKET,
    Key: key,
    Range: `bytes=${start}-${end}`,
  }).createReadStream();

  return {
    stream,
    fileSize,
    start,
    end,
  };
}

module.exports = {
    uploadToS3,
    streamFromS3
};
