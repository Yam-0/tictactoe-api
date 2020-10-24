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
const { validationResult } = require("express-validator");
const userValidator = require("../validators/user");

router.post("/", userValidator.register, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json(new FailResponse({ validation: errors.array() }));
  }

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

    const { _id, username, first_name, last_name } = result;

    const responseData = {};
    if (_id) responseData["_id"] = _id;
    if (username) responseData["username"] = username;
    if (first_name) responseData["first_name"] = first_name;
    if (last_name) responseData["last_name"] = last_name;

    return res.json(new SuccessResponse(responseData));
  } catch (err) {
    console.log("Error upon registration attempt: ", err);
    return res.json(
      new ErrorResponse("Something went wrong, try again later.")
    );
  }
});

router.put("/", userValidator.putUser, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json(new FailResponse({ validation: errors.array() }));
  }

  try {
    const user = req.user;

    if (user) {
      const { _id, username, first_name, last_name } = req.body;

      const responseData = {};
      if (_id) responseData["_id"] = _id;
      if (username) responseData["username"] = username;
      if (first_name) responseData["first_name"] = first_name;
      if (last_name) responseData["last_name"] = last_name;

      const result = await user.update(responseData);
      return res.json(new SuccessResponse(result));
    }

    return res.json(
      new FailResponse({ token: "No profile found for user token" })
    );
  } catch (err) {
    console.log("Error upon putting profile: ", err);
    return res.json(
      new ErrorResponse("Something went wrong, try again later.")
    );
  }
});

router.post("/login", userValidator.login, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json(new FailResponse({ validation: errors.array() }));
  }

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

router.get("/profile", userValidator.profile, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json(new FailResponse({ validation: errors.array() }));
  }

  try {
    const user = req.user;

    if (user) {
      const responseData = {
        _id: user["_id"],
        first_name: user["first_name"],
        last_name: user["last_name"],
      };
      return res.json(new SuccessResponse(responseData));
    }

    return res.json(
      new FailResponse({ token: "No profile found for user token" })
    );
  } catch (err) {
    console.log("Error upon getting profile: ", err);
    return res.json(
      new ErrorResponse("Something went wrong, try again later.")
    );
  }
});

module.exports = router;
