require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 3000,
  SECRET: process.env.SECRET || "DUMMYSECRET",
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/test",
  MONGODB_NAME: process.env.MONGODB_NAME || undefined,
  SWAGGER_BASE_URL: process.env.SWAGGER_BASE_URL || "localhost",
  SWAGGER_PROTOCOL: process.env.SWAGGER_PROTOCOL || "http",
};
