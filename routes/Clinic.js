const {
  UpdateClinicInfo, Login, AddDoctorToClinic, getClinicInfo, getClinicInfoById, getAppointmentsToday, getAppointmentsDoctorToday,

} = require("../controllers/Clinic");
const { uploadImage } = require("../middleware/multer");
const is_auth = require("../middleware/is_auth");
const { doctorInfoValidator, validate } = require("../middleware/validator");
// const { signInValidator } = require("../middleware/validator");
const router = require("express").Router();

router.post("/login", Login);

router.post(
  "/add-doctor",
  uploadImage.single("avatar"),
  is_auth,
  doctorInfoValidator,
  validate,
  AddDoctorToClinic
);
router.post(
  "/update-info",
  uploadImage.single("logo"),
  is_auth,
  UpdateClinicInfo
);
router.get("/", is_auth, getClinicInfo);
router.post("/", is_auth, getClinicInfoById);

router.get("/get-today-appointments", is_auth, getAppointmentsToday);
router.post("/get-today-appointments", is_auth, getAppointmentsDoctorToday);

module.exports = router;
