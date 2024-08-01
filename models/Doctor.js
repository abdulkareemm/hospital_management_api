const { Schema, model, models, Types } = require("mongoose");
const User = require("./User");
const doctorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female"],
    required: true,
  },
  avatar: {
    type: Object,
    url: String,
    public_id: String,
  },
  specialist: {
    type: String,
    required: true,
  },
  clinic: {
    type: Types.ObjectId,
    ref: "Clinic",
  },
  role: {
    type: String,
    default: "doctor",
  },
});

const Doctor  = User.discriminator("Doctor",doctorSchema)
module.exports = Doctor ;
