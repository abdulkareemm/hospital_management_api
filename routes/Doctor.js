

const { Login } = require("../controllers/Doctor");
const {
  signInValidator,
  validate,
} = require("../middleware/validator");


const router = require("express").Router();

router.post("/login", signInValidator, validate, Login);


module.exports = router;