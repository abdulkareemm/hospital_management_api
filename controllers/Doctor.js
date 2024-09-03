const Doctor = require("../models/Doctor");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Doctor.findOne({ email }).populate({path:"clinic",select:"name id -userType"})
    if (!user) {
      return res.status(403).json({ msg: "Invalid Username/ password" });
    }
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "30d",
      });
      return res.status(201).json({
        token,
        msg: "Login successfully",
        success: true,
        doctor: _.omit(user.toObject(), [
          "password",
          "createdAt",
          "updatedAt",
          "__v",
        ]),
      });
    }
    return res.status(403).json({ msg: "Invalid Username/ password" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: err.message });
  }
};
exports.UpdateDoctorInfo = async (req, res) => {
  try {
    const { email } = req.body;
    const doctor = await Doctor.findOneAndUpdate(
      { email },
      { ...req.body },
      { new: true }
    );
    if (doctor) {
      res.status(200).json({
        msg: "Doctor info updated successfully",
        doctor,
      });
    } else {
      res.status(401).json({
        msg: "Doctor not found!",
      });
    }
  } catch (err) {
    res
      .status(5000)
      .json({ msg: "Error get doctor info by id", success: false });
  }
};