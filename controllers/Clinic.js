const Clinic = require("../models/Clinic");
const Doctor = require("../models/Doctor");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { uploadImageToCloud, DeleteImageFromCloud } = require("../utils/helper");
const _ = require("lodash");
const moment = require("moment");
const Appointment = require("../models/Appointment")


/**
 * Login
 * ✅
 */
exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const clinic = await Clinic.findOne({ email });
    if (!clinic) {
      return res.status(404).json({
        msg: "Sorry the email is wrong,try another email!",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, clinic.password);
    if (!isMatch) {
      return res
        .status(201)
        .json({ msg: "Password is incorrect", success: false });
    }
    const token = jwt.sign({ id: clinic._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "30d",
    });
    res.status(201).json({
      token,
      msg: "Login successfully",
      success: true,
      clinic: _.omit(clinic.toObject(), [
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

/**
 * Update info of clinic
 * ✅
 */
exports.UpdateClinicInfo = async (req, res) => {
  try {
    const { userId } = req.body;
    const { file } = req;
    const clinic = await Clinic.findById(userId);

    if (file) {
      const public_id1 = clinic.logo?.public_id;
      if (public_id1 && file) {
        const { result } = await DeleteImageFromCloud(public_id1);
        if (result !== "ok") {
          return res
            .status(401)
            .json({ msg: "Could not remove image from cloud!" });
        }
      }
      const { url, public_id } = await uploadImageToCloud(
        file.path,
        `Hospital/${clinic.name}-clinic/logo`
      );
      req.body.logo = { url, public_id };
      await Clinic.findByIdAndUpdate(userId, { ...req.body }, { new: true });
      res.status(200).json({
        msg: "Clinic info updated successfully",
        success: true,
      });
    } else {
      await Clinic.findByIdAndUpdate(userId, { ...req.body }, { new: true });
      res.status(200).json({
        msg: "Clinic info updated successfully",
        success: true,
      });
    }
  } catch (err) {
    console.log(err.message);
    res
      .status(5000)
      .json({ msg: "Error get Clinic info by_Id", success: false });
  }
};

/**
 * Create a new doctor in clinic
 * ✅
 */
exports.AddDoctorToClinic = async (req, res) => {
  try {
    const {
      name,
      password,
      email,
      mobile,
      gender,
      specialist,
      clinic,
      userId,
    } = req.body;
    const { file } = req;

    const clinic_ = await Clinic.findById(userId).populate("doctors");
    if (clinic_.doctors.length === 0) {
      const slat = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, slat);
      const doctor = new Doctor({
        name,
        password: hashPassword,
        email,
        mobile,
        gender,
        specialist,
        clinic,
      });
      if (file) {
        const { url, public_id } = await uploadImageToCloud(
          file.path,
          `Hospital/${clinic_.name}-clinic/Doctors/${name}-logo`
        );
        doctor.avatar = { url, public_id };
        
      } else {
        return res
          .status(400)
          .json({ msg: "Avatar is required", success: false });
      }

      await doctor.save();
      clinic_.doctors.push(doctor);
      await clinic_.save();

      return res
        .status(201)
        .json({ msg: "Created Successfully!", doctor, success: true });
    } else {
      const InClinic = clinic_.doctors.filter(
        (element) => element.email === email
      );
      if (InClinic.length) {
        return res.status(401).json({ msg: "Doctor is already exists!" });
      } else {
        const slat = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, slat);
        const doctor = new Doctor({
          name,
          password: hashPassword,
          email,
          mobile,
          gender,
          specialist,
          clinic,
        });
        if (file) {
          const { url, public_id } = await uploadImageToCloud(
            file.path,
            `Hospital/${clinic_.name}-clinic/Doctors/${name}-logo`
          );
          doctor.avatar = { url, public_id };
        } else {
          return res
            .status(400)
            .json({ msg: "Avatar is required", success: false });
        }
        await doctor.save();
        clinic_.doctors.push(doctor);
        await clinic_.save();
        return res
          .status(201)
          .json({ msg: "Created Successfully!", success: true });
      }
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ err: "something wrong!" });
  }
};

exports.getClinicInfo = async (req, res) => {
  try {
    const { userId } = req.body;
    const clinic = await Clinic.findById(userId);
    const doctors = await Clinic.findById(userId).populate("doctors");
    const appointments = await Appointment.find({ clinic: userId });
    return res.status(200).json({
      success: true,
      appointments,
      clinic: _.omit(clinic.toObject(), [
        "password",
        "createdAt",
        "updatedAt",
        "__v",
      ]),
      doctors: doctors.doctors.map((element) => {
        return _.omit(element.toObject(), ["password", "__v", "role"]);
      }),
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ err: "something wrong!" });
  }
};

exports.getClinicInfoById = async (req, res) => {
  try {
    const { clinicId } = req.body;
    const clinic = await Clinic.findById(clinicId).populate("doctors");
    return res.status(200).json({
      success: true,
      clinic: _.omit(clinic.toObject(), [
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
exports.getAppointmentsToday = async (req, res) => {
  try {
    const today = moment.utc().toISOString();
    const { userId } = req.body;
    let todayAppointments = await Appointment.find({
      clinic: { $eq: userId },
      date: { $eq: moment.utc(today, "YYYY-MM-DD").toISOString() },
    })
      .populate("patient", "address , name , mobile")
      .sort("time");
    res.status(201).json({
      success: true,
      todayAppointments,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ err: "something wrong!" });
  }
};
exports.getAppointmentsDoctorToday = async (req, res) => {
  try {
    const today = moment.utc().toISOString();

    const { clinicId } = req.body;
    let todayAppointments = await Appointment.find({
      clinic: { $eq: clinicId },
      date: { $eq: moment.utc(today, "YYYY-MM-DD").toISOString() },
    })
      .populate("patient", "address , name , mobile")
      .populate("clinic", "visitDuration")
      .sort("time");
    res.status(201).json({
      success: true,
      todayAppointments,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ err: "something wrong!" });
  }
};
exports.DeleteDoctor = async (req, res) => {
  try {
    const { doctorId, userId } = req.body;
    const clinic = await Clinic.findById(userId);
    const doctor = await Doctor.findById(doctorId);

    if (clinic.doctors.length === 0) {
      return res
        .status(404)
        .json({ msg: "There is no doctor in this clinic" });
    } else {
      clinic.doctors = clinic.doctors.filter(
        (element) => element.toString() !== doctorId
      );
      const public_id = doctor.avatar?.public_id;
      if (public_id) {
        const { result } = await DeleteImageFromCloud(public_id);
        if (result !== "ok") {
          return res
            .status(401)
            .json({ msg: "Could not remove image from cloud!" });
        }
      }
      await clinic.save();
      await Doctor.findByIdAndDelete(doctorId);
      return res
        .status(201)
        .json({ success: true, msg: "Doctor deleted successfully" });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ err: "something wrong!" });
  }
};
exports.ChangeAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      { _id: appointmentId },
      { status },
      { new: true }
    );
    res
      .status(201)
      .json({ msg: "updated successfully!", appointment, success: true });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ err: "something wrong!" });
  }
};