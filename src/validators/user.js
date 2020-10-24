const { header, body } = require("express-validator");

module.exports = {
  register: [
    body("username").exists().isLength({ min: 4, max: 16 }),
    body("password").exists().isLength({ min: 8, max: 32 }),
    body("first_name").exists().isLength({ min: 1, max: 32 }),
    body("last_name").exists().isLength({ min: 1, max: 32 }),
  ],
  login: [body("username").exists(), body("password").exists()],
  profile: [header("authorization").trim("Bearer").trim().isJWT()],
  putUser: [
    header("authorization").trim("Bearer").trim().isJWT(),
    body("username").optional().isLength({ min: 4, max: 16 }),
    body("first_name").optional().isLength({ min: 1, max: 32 }),
    body("last_name").optional().isLength({ min: 1, max: 32 }),
  ],
};
