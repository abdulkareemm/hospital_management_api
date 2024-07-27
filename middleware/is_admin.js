const Hospital = require("../models/Hospital");

module.exports.isAdmin = async (req, res, next) => {
  try {
    const admin_hos = await Hospital.findById(req.body.userId);
    if (admin_hos) {
      req.body.admin_hos = admin_hos;
      next();
    } else {
      return res.status(401).json({ msg: "No Authorizations", success: false });
    }
  } catch (err) {
    return res.status(401).json({ msg: "Is admin failed", success: false });
  }
};
