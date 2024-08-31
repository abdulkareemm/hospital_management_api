
const {
  patientInfoValidator,
  signInValidator,
  validate,
} = require("../middleware/validator");
const router = require("express").Router();

const{register, login} = require("../controllers/Patient")


router.post("/register", patientInfoValidator, validate, register);
router.post("/login", signInValidator, validate, login);
router.post(
  "/reservation",
  is_auth,
  isPatient,
  ReservationInfoValidator,
  validate,
  Reservation
);
router.post(
  "/check-reservation",
  is_auth,
  isPatient,
  ReservationInfoValidator,
  validate,
  CheckDateReservation
);
router.get("/get-patient-info", is_auth, isPatient, getPatientInfoById);



module.exports = router;