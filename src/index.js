const express = require("express");
const bodyParser = require("body-parser");
const config = require("./config");
const db = require("./db");

const start = async () => {
  await db.connect();

  const app = express();

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.use("/user", require("./routes/user"));

  app.listen(config.PORT, () => {
    console.log("Server started on port:", config.PORT);
  });
};

start();
