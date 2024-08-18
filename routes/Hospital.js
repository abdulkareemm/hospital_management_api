const {
  Create,
  Get,
  Create_Clinic,
  Delete_Clinic,
  Login,
  getPublicInfo,
} = require("../controllers/Hospital");
const { uploadImage } = require("../middleware/multer");
const is_auth = require("../middleware/is_auth");
const { isAdmin } = require("../middleware/is_admin");
const { clinicInfoValidator, validate } = require("../middleware/validator");

const router = require("express").Router();

router.post("/create", uploadImage.single("logo"), Create);
router.post("/login", Login);
router.post(
  "/add-clinic",
  uploadImage.single("logo"),
  is_auth,
  isAdmin,
  clinicInfoValidator,
  validate,
  Create_Clinic
);
router.get("/info", getPublicInfo);

router.delete("/delete-clinic", is_auth, isAdmin, Delete_Clinic);

router.get("/", Get);

module.exports = router;
