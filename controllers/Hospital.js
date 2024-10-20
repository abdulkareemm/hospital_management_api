const Hospital = require("../models/Hospital");
const Clinic = require("../models/Clinic");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const { uploadImageToCloud, DeleteImageFromCloud } = require("../utils/helper");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");

/**
 * Create a new hospital
 * ✅
 */
/**
 * ✅ Steps :
 * 1- extract incoming data from request body
 * 2- create new instance of Hospital schema
 * 3- save image in cloudinary , if there false kill instance and return error to user
 * 4- save instance to database
 * 5- return data to user
 */

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
    const { file: logo } = req;

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
    if (logo) {
      const { url, public_id } = await uploadImageToCloud(
        logo.path,
        "Hospital/admin"
      );
      hospital.logo = { url, public_id };
    } else {
      return res.status(404).json({ msg: "Logo is required", success: false });
    }

    await hospital.save();

    res.status(201).json({
      msg: "Created Successfully!",
      hospital,
    });
  } catch (err) {
    console.log(err);
    console.log(err.message);
    res.status(500).json({ err: "something wrong!" });
  }
};

exports.Get = async (req, res) => {
  try {
    const Hos = await Hospital.find().populate("clinics");
    const doctorsCount = await Doctor.countDocuments();
    const patientsCount = await Patient.countDocuments();
    const appointmentsCount = await Appointment.countDocuments();
    res
      .status(200)
      .json({
        success: true,
        Hos,
        doctorsCount,
        patientsCount,
        appointmentsCount,
      });
  } catch (error) {
    console.log(err.message);
    res.status(500).json({ err: "something wrong!" });
  }
};

/**
 * Login hospital
 * ✅
 */
/**
 * ✅ Steps :
 * 1  extract the incoming data from the request body
 * 2  search by email in database
 * 3  check if the password is correct
 * 4  create new token
 * 5  return data
 */
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

/**
 * Create a new Clinic
 * ✅
 */
/**
 * ✅ Steps :
 * 1- extract the incoming data from the request body
 * 2- retrieve hospital information from the database
 * 3- checkout the clinics in hospital
 * 4- we have 2 cases:
 *       -if there is no clinics just make new instance from clinic schema and save it in database
 *       -if there is already clinics check if it exists return new error else make new instance from
 *            clinic schema and save it in database
 * 5- add new clinic to Clinics array in hospital instance
 * 6- save instance hospital
 * 7- return data
 */
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
      if (file) {
        const { url, public_id } = await uploadImageToCloud(
          file.path,
          `Hospital/${name}-clinic/logo`
        );
        clinic.logo = { url, public_id };
      } else {
        return res
          .status(404)
          .json({ msg: "Logo is required", success: false });
      }
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
        if (file) {
          const { url, public_id } = await uploadImageToCloud(
            file.path,
            `Hospital/${name}-clinic/logo`
          );
          clinic.logo = { url, public_id };
        } else {
          return res
            .status(404)
            .json({ msg: "Logo is required", success: false });
        }
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

/**
 * Delete Clinic
 * ✅
 */
/**
 * ✅ Steps :
 * 1- extract the incoming data from the request body
 * 2- retrieve hospital information from the database
 * 3- checkout the clinics in hospital
 * 4- we have 2 cases:
 *       -if there is no clinics just return error to user
 *       -if there is already clinics remove clinic from hospital
 * 5- remove clinic data (doctor , logo.....)
 * 6- save instance hospital
 * 7- return successful message
 */
exports.Delete_Clinic = async (req, res) => {
  try {
    const { clinic_Id, admin_hos } = req.body;
    const hospital = await Hospital.findById(admin_hos._id);
    const clinic = await Clinic.findById(clinic_Id);

    if (hospital.clinics.length === 0) {
      return res
        .status(404)
        .json({ msg: "There is no clinics in this hospital" });
    } else {
      hospital.clinics = hospital.clinics.filter(
        (element) => element.toString() !== clinic_Id
      );
      const public_id = clinic.logo?.public_id;
      if (public_id) {
        const result = await DeleteImageFromCloud(public_id);
        if (result !== "ok") {
          return res.status(401).json({
            msg: "Could not remove image from cloud!",
            success: false,
          });
        }
      }
      const doctors = await Clinic.findById(clinic_Id).populate("doctors");
      if (doctors.doctors.length > 0) {
        doctors.doctors.map(async (element) => {
          const public_id = element.avatar?.public_id;
          if (public_id) {
            const result = await DeleteImageFromCloud(public_id);
            if (result !== "ok") {
              return res
                .status(401)
                .json({ msg: "Could not remove image from cloud!" });
            }
          }
          await Doctor.findByIdAndDelete(element._id);
        });
      }
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

exports.getPublicInfo = async (req, res) => {
  try {
    const hospital = await Hospital.findOne().populate("clinics");
    return res.status(200).json({
      success: true,
      hospital: _.omit(hospital.toObject(), [
        "password",
        "clinics",
        "__v",
        "_id",
      ]),
      clinics: hospital.clinics.map((element) => {
        return _.omit(element.toObject(), ["password", "doctors", "__v"]);
      }),
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ err: "something wrong!" });
  }
};
