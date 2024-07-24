const { Schema, model } = require("mongoose");
const User = require("./User");
const { Types } = Schema;
const ClinicSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  logo: {
    type: Object,
    url: String,
    public_id: String,
  },
  startFrom: {
    type: String,
    required: true,
  },
  endAt: {
    type: String,
    required: true,
  },
  fees: {
    type: String,
    required: true,
  },
  color_highlight: {
    type: String,
    required: true,
  },
  doctors: [
    {
      type: Types.ObjectId,
      ref: "Doctor",
    },
  ],
  days: {
    type: Array,
    required: true,
  },
  visitDuration: {
    type: String,
    required: true,
  },
  appointments: [
    {
      type: Types.ObjectId,
      ref: "Appointment",
    },
  ],
  role: {
    type: String,
    default: "clinic",
  },
});
const Clinic = User.discriminator("Clinic",ClinicSchema );
module.exports = Clinic;