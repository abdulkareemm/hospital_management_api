const Patient = require("../models/Patient");
const bcrypt = require("bcryptjs");

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
