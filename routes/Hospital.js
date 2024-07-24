const { Create, Get, CreateClinic, Delete_Clinic } = require("../controllers/Hospital");

const router = require("express").Router();


router.post("/create", Create);

router.post(
  "/add-clinic",
//   uploadImage.single("logo"),
//   is_auth,
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
