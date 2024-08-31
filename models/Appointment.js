const { Schema, model } = require("mongoose");
const { Types } = Schema;
const AppointmentSchema = new Schema({
  reason: {
    type: String,
    required: true,
  },
  patient: {
    type: Types.ObjectId,
    ref: "Patient",
  },
  clinic: {
    type: Types.ObjectId,
    ref: "Clinic",
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  visitType: {
    type: String,
    enum: ["Preview", "Review"],
    required: false,
  },
  status: {
    type: String,
    enum: ["Confirmed", "Cancelled", "Completed"],
  },
});

module.exports = model("Appointment", AppointmentSchema);
