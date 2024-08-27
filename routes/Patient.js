
const {
  patientInfoValidator,
  validate,
} = require("../middleware/validator");
const router = require("express").Router();

const{register} = require("../controllers/Patient")


router.post("/register", patientInfoValidator, validate, register);





module.exports = router;