const { Schema, model } = require("mongoose");
const User = require("./User");
const PatientSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: true,
    },
    role: {
      type: String,
      default: "patient",
    },
  },
);

const Patient = User.discriminator("Patient", PatientSchema);
module.exports = Patient
