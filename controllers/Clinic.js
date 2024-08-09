const Clinic = require("../models/Clinic");
const { uploadImageToCloud, DeleteImageFromCloud } = require("../utils/helper");



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