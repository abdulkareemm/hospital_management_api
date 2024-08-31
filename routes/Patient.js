const is_auth = require("../middleware/is_auth");
const { isPatient } = require("../middleware/is_patient");

const {
  patientInfoValidator,
  signInValidator,
  validate,
  ReservationInfoValidator,
} = require("../middleware/validator");
const router = require("express").Router();

const { register, login, Reservation, CheckDateReservation, getPatientInfoById } = require("../controllers/Patient");

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
