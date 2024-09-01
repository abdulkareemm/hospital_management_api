const Patient = require("../models/Patient");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Clinic = require("../models/Clinic");
const _ = require("lodash");
const moment = require("moment");
const Appointment = require("../models/Appointment");

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
      expiresIn: "30d",
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

exports.CheckDateReservation = async (req, res) => {
  try {
    let { clinicId, time, date, userId } = req.body;
    date = moment.utc(date, "DD-MM-YYYY").toISOString();
    //// first get all appointment in clinic in the day who is input by user
    const appointment = await Clinic.findById(clinicId).populate({
      path: "appointments",
      match: { date: { $eq: date } },
    });
    const endTime = moment
      .utc(
        moment
          .utc(req.body.time, "HH:mm")
          .add(appointment.visitDuration, "minutes")
      )
      .format("HH:mm");

    //// if there are appointments in this day
    if (appointment.appointments.length > 0) {
      const day = moment(date).day();
      //// if day is not off day
      if (appointment.days.includes(day)) {
        //// if time is not in work time
        if (endTime > appointment.endAt || time < appointment.startFrom) {
          return res.status(401).json({ msg: "Time is incorrect" });
        } else {
          appointment.appointments = appointment.appointments.filter(
            (element) => {
              const endTime = moment
                .utc(
                  moment
                    .utc(element.time, "HH:mm")
                    .add(appointment.visitDuration, "minutes")
                )
                .format("HH:mm");
              if (element.time <= time && time <= endTime) return true;
              return false;
            }
          );
          //// if there is appointments duration the time input
          if (appointment.appointments.length > 0) {
            return res
              .status(401)
              .json({ msg: "This time was taken by another user" });
          } else {
            ///// get all appointments user to check if he has appointment in other clinic in the same time
            ///populate with clinic to return name off clinic he has appointment in it
            const anotherAppointment = await Appointment.find({
              patient: { $eq: userId },
              date: { $eq: date },
            }).populate("clinic");

            if (anotherAppointment.length > 0) {
              const prev = anotherAppointment.filter((element) => {
                const end = moment
                  .utc(
                    moment
                      .utc(element.time, "HH:mm")
                      .add(element.clinic.visitDuration, "minutes")
                  )
                  .format("HH:mm");

                if (
                  (element.time <= time && time <= end) ||
                  (element.time >= endTime && endTime <= end)
                )
                  return true;
                return false;
              });
              if (prev.length > 0) {
                return res.status(401).json({
                  msg: `you have another appointment in ${prev[0].clinic.name} duration visit time`,
                });
              }
              const prevAppointment = await Appointment.find({
                patient: { $eq: userId },
                clinic: { $eq: clinicId },
                date: { $gt: moment(date).add("-16", "days").toISOString() },
              });

              return res.status(201).json({
                msg: "accepted time you can reverse!",
                success: true,
                type: prevAppointment.length > 0 ? true : false,
              });
            } else {
              const prevAppointment = await Appointment.find({
                patient: { $eq: userId },
                clinic: { $eq: clinicId },
                date: { $gt: moment(date).add("-16", "days").toISOString() },
              });

              return res.status(201).json({
                msg: "accepted time you can reverse!",
                success: true,
                type: prevAppointment.length > 0 ? true : false,
              });
            }
          }
        }
      }
      //// day is off
      else {
        return res.status(401).json({ msg: "Day is off, try another day!" });
      }
    }
    //// if there are not  appointments in this day
    else {
      const day = moment(date).day();
      if (appointment.days.includes(day)) {
        if (endTime > appointment.endAt || time < appointment.startFrom) {
          return res.status(401).json({ msg: "Time is incorrect" });
        } else {
          ///// get all appointments user to check if he has appointment in other clinic in the same time
          ///populate with clinic to return name off clinic he has appointment in it
          const anotherAppointment = await Appointment.find({
            patient: { $eq: userId },
            date: { $eq: date },
          }).populate("clinic");

          if (anotherAppointment.length > 0) {
            const prev = anotherAppointment.filter((element) => {
              const end = moment
                .utc(
                  moment
                    .utc(element.time, "HH:mm")
                    .add(element.clinic.visitDuration, "minutes")
                )
                .format("HH:mm");

              if (
                (element.time <= time && time <= end) ||
                (element.time >= endTime && endTime <= end)
              )
                return true;
              return false;
            });
            if (prev.length > 0) {
              return res.status(401).json({
                msg: `you have another appointment in ${prev[0].clinic.name} duration visit time`,
              });
            }
            const prevAppointment = await Appointment.find({
              patient: { $eq: userId },
              clinic: { $eq: clinicId },
              date: { $gt: moment(date).add("-16", "days").toISOString() },
            });
            return res.status(201).json({
              msg: "accepted time you can reverse!",
              success: true,
              type: prevAppointment.length > 0 ? true : false,
            });
          } else {
            const prevAppointment = await Appointment.find({
              patient: { $eq: userId },
              clinic: { $eq: clinicId },
              date: { $gt: moment(date).add("-16", "days").toISOString() },
            });
            return res.status(201).json({
              msg: "accepted time you can reverse!",
              success: true,
              type: prevAppointment.length > 0 ? true : false,
            });
          }
        }
      } else {

        return res.status(401).json({ msg: "Day is off, try another day!" });
      }
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ err: "something wrong!" });
  }
};
exports.Reservation = async (req, res) => {
  try {
    let { userId, reason, clinicId, date, time, visitType } = req.body;

    date = moment.utc(date, "DD-MM-YYYY").toISOString();
    const reserve = new Appointment({
      reason,
      patient: userId,
      clinic: clinicId,
      date,
      time,
      visitType,
      status: "Confirmed",
    });
    await Clinic.findByIdAndUpdate(
      clinicId,
      { $push: { appointments: reserve } },
      { new: true }
    );
    await reserve.save();
    return res
      .status(201)
      .json({ msg: "Reservation Done Successfully!", success: true });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ err: "somethig wrong!" });
  }
};
exports.getPatientInfoById = async (req, res) => {
  const { userId } = req.body;
  try {
    const patient = await Patient.findById(userId);
    if (!patient) {
      return res
        .status(200)
        .json({ msg: "Patient does not exite", success: false });
    }
    res.status(200).json({
      msg: "User found",
      success: true,
      patient: _.omit(patient.toObject(), ["password"]),
    });
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Error getting user info", success: false });
  }
};