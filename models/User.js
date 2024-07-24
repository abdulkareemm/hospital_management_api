const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: String,
    password: String,
  },
  { discriminatorKey: "userType", collection: "users" }
);

const User = model("User", userSchema);

module.exports = User;