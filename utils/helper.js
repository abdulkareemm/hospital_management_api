const cloudinary = require("../cloud");

exports.uploadImageToCloud = async (file) => {
  const { secure_url: url, public_id } = await cloudinary.uploader.upload(file);

  return { url, public_id };
};
