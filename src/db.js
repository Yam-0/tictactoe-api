const config = require("./config");
const mongoose = require("mongoose");

const connect = async () => {
  await mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: config.MONGODB_NAME,
  });
  console.log("Connected to database");
};

module.exports = { connect };
