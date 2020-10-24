const config = require("../config");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { FailResponse } = require("../dto/response");

module.exports = async (req, res, next) => {
  try {
    const authToken = req.headers["authorization"];
    if (!authToken) return next();

    const token = authToken.split(" ")[1];

    let payload;
    try {
      payload = await jwt.verify(token, config.SECRET);
    } catch (err) {
      console.log("Invalid token", err);
      return res.json(new FailResponse({ token: "Token invalid" }));
    }

    const user = await User.findById(payload["user"]["_id"]);
    if (user) {
      req.user = user;
    }

    return next();
  } catch (err) {
    console.log("An error during auth check", err);
    return next();
  }
};
