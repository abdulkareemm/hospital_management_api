const { Schema, model } = require("mongoose");
const { Types } = Schema;
const DiagnosisSchema = new Schema({
  patient: {
    type: Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  doctor: {
    type: Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  clinic: {
    type: Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  daignosis: {
    type: String,
    required: true,
  },
});
module.exports = model("Diagnosis", DiagnosisSchema);
