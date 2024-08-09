const {
  UpdateClinicInfo,

} = require("../controllers/Clinic");
const { uploadImage } = require("../middleware/multer");
const is_auth = require("../middleware/is_auth");
// const { signInValidator } = require("../middleware/validator");
// const { doctorInfoValidator, validate } = require("../middleware/validator");
const router = require("express").Router();

// router.post(
//   "/add-doctor",
//   uploadImage.single("avatar"),
//   is_auth,
//   doctorInfoValidator,
//   validate,
//   AddDoctorToClinic
// );
router.post(
  "/update-info",
  uploadImage.single("logo"),
  is_auth,
  UpdateClinicInfo
);
// router.post("/login", signInValidator, validate, Login);
// router.get("/", is_auth, getClinicInfo);
// router.post("/", is_auth, getClinicInfoById);
// router.post("/delete-doctor", is_auth, DeletdoctorfromClinic);
// router.post("/change-state", is_auth, ChangeApoointmentStatus);
// router.get("/get-today-appointemnts", is_auth, getAppointmentsToday);
// router.post("/get-today-appointemnts", is_auth, getAppointmentsDoctorToday);

module.exports = router;
