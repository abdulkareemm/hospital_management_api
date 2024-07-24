const { Schema, model } = require("mongoose");
const User = require("./User")
const { Types } = Schema;
const HospitalSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  logo: {
    type: Object,
    default: {},
  },
  phone1: {
    type: String,
    required: true,
  },
  phone2: {
    type: String,
    required: true,
  },
  phone3: {
    type: String,
    required: true,
  },
  social_Media: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  privacy_policy: {
    type: String,
  },
  clinics: [
    {
      type: Types.ObjectId,
      ref: "Clinic",
    },
  ],
  role: {
    type: String,
    default: "admin",
  }
});
const Hospital = User.discriminator("Hospital", HospitalSchema);
module.exports = Hospital;
