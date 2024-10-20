const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decode) => {
      if (err) {
        console.log(err);
        console.log("err");
        return res.status(401).json({ msg: "Auth failed", success: false });
      }
      req.body.userId = decode.id;
      next();
    });
  } catch (err) {
    console.log("err");
    console.log(err.message);
    return res.status(401).json({ msg: "auth failed", success: false });
  }
};
