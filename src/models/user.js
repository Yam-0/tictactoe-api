const mongoose = require("mongoose");

module.exports = mongoose.model("User", {
  username: String,
  hash: String,
  first_name: String,
  last_name: String,
});
