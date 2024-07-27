const { Create, Get, CreateClinic, Delete_Clinic, Login } = require("../controllers/Hospital");
const { uploadImage } = require("../middleware/multer");
const is_auth = require("../middleware/is_auth");
const router = require("express").Router();


router.post("/create", Create);
router.post("/login", Login);
router.post(
  "/add-clinic",
  uploadImage.single("logo"),
  is_auth,
//   isAdmin,
//   clinicInfoValidator,
//   validate,
  CreateClinic
);

router.delete("/delete-clinic", 
// is_auth,
//  isAdmin, 
 Delete_Clinic);

router.get("/", Get);





module.exports = router;
