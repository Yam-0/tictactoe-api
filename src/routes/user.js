const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const config = require("../config");
const bcrypt = require("bcrypt");
const {
  SuccessResponse,
  FailResponse,
  ErrorResponse,
} = require("../dto/response");

router.post("/register", async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.body["username"],
    });

    if (user !== null) {
      return res.json(
        new FailResponse({
          username: "Username already exists",
        })
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body["password"], salt);

    const newUser = new User({
      username: req.body["username"],
      hash: hash,
      first_name: req.body["first_name"],
      last_name: req.body["last_name"],
    });
    const result = await newUser.save();
    return res.json(new SuccessResponse(result));
  } catch (err) {
    console.log("Error upon registration attempt: ", err);
    return res.json(
      new ErrorResponse("Something went wrong, try again later.")
    );
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.body["username"],
    });

    if (user) {
      const correctPassword = await bcrypt.compare(
        req.body["password"],
        user["hash"]
      );

      if (correctPassword) {
        const payload = {
          user: { _id: user["_id"] },
        };
        const token = jwt.sign(payload, config.SECRET);
        return res.json(new SuccessResponse({ token }));
      }
    }

    return res.json(
      new FailResponse({
        username: "Maybe the user doesn't exist",
        password: "Maybe the password is wrong",
      })
    );
  } catch (err) {
    console.log("Error upon login attempt: ", err);
    return res.json(
      new ErrorResponse("Something went wrong, try again later.")
    );
  }
});

module.exports = router;
