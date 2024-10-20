const { check, validationResult } = require("express-validator");

exports.clinicInfoValidator = [
  check("name").trim().not().isEmpty().withMessage("clinic name is missing!"),
  check("startFrom")
    .not()
    .isEmpty()
    .withMessage("start from is a required field!"),
  check("endAt")
    .trim()
    .not()
    .isEmpty()
    .withMessage("end at is a required field!"),
  check("type")
    .trim()
    .not()
    .isEmpty()
    .withMessage("specialist is a required field!!"),
  check("visitDuration")
    .trim()
    .not()
    .isEmpty()
    .withMessage("visit duration  is a required field!!"),
  check("fees")
    .trim()
    .not()
    .isEmpty()
    .withMessage("fees  is a required field!!"),
  check("color_highlight")
    .trim()
    .not()
    .isEmpty()
    .withMessage("color_highlight is a required field!!"),
  check("mobile")
    .trim()
    .not()
    .isEmpty()
    .withMessage("mobile is a required field!"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is missing!")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be 8 to 20 characters long!"),
  check("email").isEmail().withMessage("Email is invalid!"),
];

exports.signInValidator = [
  check("email").isEmail().withMessage("Email is invalid!"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is missing!")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be 8 to 20 characters long!"),
];

exports.patientInfoValidator = [
  check("name").trim().not().isEmpty().withMessage("patient name is missing!"),
  check("email").isEmail().withMessage("Email is invalid!"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is missing!")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be 8 to 20 characters long!"),
  check("address")
    .trim()
    .not()
    .isEmpty()
    .withMessage("address is a required field!"),
  check("gender")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Gender is a required field!"),
  check("mobile")
    .trim()
    .not()
    .isEmpty()
    .withMessage("mobile is a required field!"),
];

exports.doctorInfoValidator = [
  check("name").trim().not().isEmpty().withMessage("doctor name is missing!"),
  check("email").isEmail().withMessage("Email is invalid!"),
  check("gender")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Gender is a required field!"),
  check("specialist")
    .trim()
    .not()
    .isEmpty()
    .withMessage("specialist  is a required field!!"),
  check("mobile")
    .trim()
    .not()
    .isEmpty()
    .withMessage("mobile is a required field!"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is missing!")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be 8 to 20 characters long!"),
];



exports.ReservationInfoValidator = [
  check("clinicId")
    .notEmpty()
    .withMessage("Invalid way to reservation")
    .isMongoId()
    .withMessage("Invalid Clinic Id"),
  check("reason")
    .trim()
    .not()
    .isEmpty()
    .withMessage("reason is a required field!"),
  check("date").trim().not().isEmpty().withMessage("date is a required field!"),
  check("time").trim().not().isEmpty().withMessage("time is a required field!"),
];
exports.DaignosisValidator = [
  check("patientId")
    .notEmpty()
    .withMessage("Invalid way to make diagnosis")
    .isMongoId()
    .withMessage("Invalid patient Id"),
  check("date").trim().not().isEmpty().withMessage("date is a required field!"),
  check("time").trim().not().isEmpty().withMessage("time is a required field!"),
  check("daignosis")
    .trim()
    .not()
    .isEmpty()
    .withMessage("daignosis is a required field!"),
  check("clinicId")
    .notEmpty()
    .withMessage("Invalid way to make diagnosis")
    .isMongoId()
    .withMessage("Invalid clinicId Id"),
];

exports.validate = (req, res, next) => {
  const error = validationResult(req).array();
  if (error.length) {
    return res.json({ error: error[0].msg });
  }

  next();
};
