const Patient = require("../models/Patient");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

exports.register = async (req, res) => {
  try {
    const { email, password, name, mobile, address, gender } = req.body;
    const patient = await Patient.find({ email });
    if (patient.length > 0) {
      return res.json({ msg: "You already have an account!", success: false });
    }

    const slat = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, slat);
    const newPatient = await Patient({
      name,
      mobile,
      address,
      email,
      password: hashPassword,
      gender,
    });
    await newPatient.save();
    res.status(201).json({
      msg: "user created successfully,Please Login",
      success: true,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ err: "something wrong!" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const patient = await Patient.findOne({ email: email });
    if (!patient) {
      return res
        .status(404)
        .json({ msg: "You don't have an account", success: false });
    }

    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) {
      return res
        .status(201)
        .json({ msg: "Password is incorrect", success: false });
    }
    const token = jwt.sign({ id: patient._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });
    res.status(201).json({
      token,
      msg: "Login successfully",
      success: true,
      patient: _.omit(patient.toObject(), [
        "password",
        "createdAt",
        "updatedAt",
        "__v",
      ]),
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ err: "something wrong!" });
  }
};
