
const {
  patientInfoValidator,
  signInValidator,
  validate,
} = require("../middleware/validator");
const router = require("express").Router();

const{register, login} = require("../controllers/Patient")


router.post("/register", patientInfoValidator, validate, register);
router.post("/login", signInValidator, validate, login);




module.exports = router;