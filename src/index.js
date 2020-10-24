const express = require("express");
const bodyParser = require("body-parser");
const config = require("./config");
const db = require("./db");
const authMiddleware = require("./middlewares/auth");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const start = async () => {
  await db.connect();

  const app = express();

  swaggerDocument.host = config.SWAGGER_BASE_URL + ":" + config.PORT;
  swaggerDocument.schemes = [config.SWAGGER_PROTOCOL];

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, {}));

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.use(authMiddleware);
  app.use("/user", require("./routes/user"));

  app.listen(config.PORT, () => {
    console.log("Server started on port:", config.PORT);
  });
};

start();
