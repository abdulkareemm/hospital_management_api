


const {
  patientInfoValidator,
  validate,
} = require("../middleware/validator");




router.post("/register", patientInfoValidator, validate, register);





module.exports = router;