

const { Login, UpdateDoctorInfo, MakeDaignosis, GetAllDaignosis } = require("../controllers/Doctor");
const is_auth = require("../middleware/is_auth");
const {
  signInValidator,
  validate,
  DaignosisValidator,
} = require("../middleware/validator");


const router = require("express").Router();

router.post("/login", signInValidator, validate, Login);
router.post("/UpdateDoctorInfo", UpdateDoctorInfo);
router.post(
  "/make-daignosis",
  is_auth,
  DaignosisValidator,
  validate,
  MakeDaignosis
);
router.post("/all-daignosis", is_auth, GetAllDaignosis);


module.exports = router;