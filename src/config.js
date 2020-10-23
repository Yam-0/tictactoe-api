require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 3000,
  SECRET: process.env.SECRET || "DUMMYSECRET",
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/test",
  MONGODB_NAME: process.env.MONGODB_NAME || undefined,
};
