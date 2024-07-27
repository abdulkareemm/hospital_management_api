const Hospital = require("../models/Hospital");
const Clinic = require("../models/Clinic");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const { uploadImageToCloud } = require("../utils/helper");


exports.Create = async (req, res) => {
  try {
    const {
      name,
      phone1,
      phone2,
      phone3,
      social_Media,
      address,
      email,
      privacy_policy,
      
    } = req.body;
    const {file:logo} = req

    const hospital = new Hospital({
      name,
      phone1,
      phone2,
      phone3,
      social_Media,
      address,
      email,
      privacy_policy,
      password: "123456",
    });
    console.log(logo)
    if (logo) {
      const { url, public_id } = await uploadImageToCloud(logo.path,"Hospital/admin");
      hospital.logo = { url, public_id };
    } else {

      return res
        .status(404)
        .json({ msg: "Logo is required", success: false });
    }

    await hospital.save();

    res.status(201).json({
      msg: "Created Successfully!",
      hospital,
    });
  } catch (err) {
    console.log(err)
    console.log(err.message);
    res.status(500).json({ err: "something wrong!" });
  }
};

exports.Get = async (req, res) => {
  try {
    const Hos = await Hospital.find();
    res.status(200).json(Hos);
  } catch (error) {
    console.log(err.message);
    res.status(500).json({ err: "something wrong!" });
  }
};

exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hospital = await Hospital.findOne({ email });
    if (!hospital) {
      return res
        .status(404)
        .json({ msg: "User doesn't found!", success: false });
    }
    if (password == hospital.password) {
      //return res.status(201).json({ msg: "Login Successfully!", hospital });
      const token = jwt.sign({ id: hospital._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "1d",
      });

      res.status(201).json({
        token,
        msg: "Login successfully",
        success: true,
        hospital: _.omit(hospital.toObject(), [
          "password",
          "createdAt",
          "updatedAt",
          "__v",
        ]),
      });
    } else {
      return res.status(403).json({ msg: "Password doesn't match!" });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ err: "something wrong!" });
  }
};

exports.Create_Clinic = async (req, res) => {
  try {
    const {
      name,
      type,
      startFrom,
      endAt,
      fees,
      color_highlight,
      email,
      mobile,
      admin_hos,
      visitDuration,
      days,
      password,
    } = req.body;
    const { file } = req;

    const hospital = await Hospital.findOne({
      _id: admin_hos._id,
    });
    const clinics = await Hospital.findById(admin_hos._id).populate("clinics");

    if (hospital.clinics.length === 0) {
      const slat = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, slat);
      const clinic = new Clinic({
        name,
        type,
        startFrom,
        endAt,
        fees,
        color_highlight,
        email,
        mobile,
        visitDuration,
        days: days.split(","),
        password: hashPassword,
      });
      // if (file) {
      //   const { url, public_id } = await uploadImageToCloud(file.path);
      //   clinic.logo = { url, public_id };
      // } else {
      //   return res
      //     .status(404)
      //     .json({ msg: "Logo is required", success: false });
      // }
      clinic.logo = {
        url: "https://res.cloudinary.com/akm-dev/image/upload/v1691435705/zbk7i3z7wbcgtdgqaeky.jpg",

        public_id: "zbk7i3z7wbcgtdgqaeky",
      };

      await clinic.save();
      hospital.clinics.push(clinic);
      await hospital.save();
      return res
        .status(201)
        .json({ msg: "Created Successfully!", success: true, clinic });
    } else {
      const InHospital = clinics.clinics.filter(
        (element) => element.name === name
      );
      if (InHospital.length > 0) {
        return res
          .status(401)
          .json({ msg: "Name is already exists!", success: false });
      } else {
        const slat = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, slat);
        const clinic = new Clinic({
          name,
          type,
          startFrom,
          endAt,
          fees,
          color_highlight,
          email,
          mobile,
          visitDuration,
          days: days.split(","),
          password: hashPassword,
        });
        // if (file) {
        //   const { url, public_id } = await uploadImageToCloud(file.path);
        //   clinic.logo = { url, public_id };
        // } else {
        //   return res
        //     .status(404)
        //     .json({ msg: "Logo is required", success: false });
        // }
        clinic.logo = {
          url: "https://res.cloudinary.com/akm-dev/image/upload/v1691435705/zbk7i3z7wbcgtdgqaeky.jpg",

          public_id: "zbk7i3z7wbcgtdgqaeky",
        };
        await clinic.save();
        hospital.clinics.push(clinic);
        await hospital.save();
        return res
          .status(201)
          .json({ msg: "Created Successfully!", success: true, clinic });
      }
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ err: "something wrong!" });
  }
};

exports.Delete_Clinic = async (req, res) => {
  try {
    const { clinic_Id, admin_hos } = req.body;
    const hospital = await Hospital.findById("66a0841f0c9ec23e6eca8e6a");
    const clinic = await Clinic.findById(clinic_Id);

    if (hospital.clinics.length === 0) {
      return res
        .status(404)
        .json({ msg: "There is no clinics in this hospital" });
    } else {
      hospital.clinics = hospital.clinics.filter(
        (element) => element.toString() !== clinic_Id
      );
      // const public_id = clinic.logo?.public_id;
      // if (public_id) {
      //   const { result } = await cloudinary.uploader.destroy(public_id);
      //   if (result !== "ok") {
      //     return res
      //       .status(401)
      //       .json({
      //         msg: "Could not remove image from cloud!",
      //         success: false,
      //       });
      //   }
      // }
      // const doctors = await Clinic.findById(clinic_Id).populate("doctors");
      // console.log(doctors.doctors);
      // if (doctors.doctors.length > 0) {
      //   doctors.doctors.map(async (element) => {
      //     const public_id = element.avatar?.public_id;
      //     if (public_id) {
      //       const { result } = await cloudinary.uploader.destroy(public_id);
      //       if (result !== "ok") {
      //         return res
      //           .status(401)
      //           .json({ msg: "Could not remove image from cloud!" });
      //       }
      //     }
      //     await Doctor.findByIdAndDelete(element._id);
      //   });
      // }
      await hospital.save();
      await Clinic.findByIdAndDelete(clinic_Id);
      return res
        .status(201)
        .json({ success: true, msg: "Delete Clinic Successfully" });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ err: "something wrong!" });
  }
};
