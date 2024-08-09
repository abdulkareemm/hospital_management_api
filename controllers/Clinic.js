const Clinic = require("../models/Clinic");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { uploadImageToCloud, DeleteImageFromCloud } = require("../utils/helper");
const _ = require("lodash");    


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
        `Hospital/${name}-clinic/logo`
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