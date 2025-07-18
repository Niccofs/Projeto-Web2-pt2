const express = require("express");
require("dotenv").config();
const multer = require("multer");
const storage = multer.memoryStorage();
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, '/tmp'),
//   filename: (req, file, cb) => cb(null, file.originalname),
// });
const upload = multer({ storage });
const configRouter = express.Router();
const SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT || 3000;
const MONGODB_URL = process.env.MONGODB_URL;

configRouter.use(express.json());

module.exports = {
  SECRET,
  PORT,
  MONGODB_URL,
  appConfig: configRouter,
  upload,
};
