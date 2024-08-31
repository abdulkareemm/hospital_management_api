const Patient = require("../models/Patient");

module.exports.isPatient = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.body.userId);
    if (patient) {
      req.body.patient = patient;
      next();
    } else {
      return res
        .status(401)
        .json({ msg: "You have to register patient account", success: false });
    }
  } catch (err) {
    return res.status(401).json({ msg: "Is patient failed", success: false });
  }
};
