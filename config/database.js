const mongoose = require("mongoose");
const { MONGODB_URL } = require(".");

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URL);
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
