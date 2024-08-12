const cloudinary = require("../cloud");


exports.uploadImageToCloud = async (file, folder) => {
  const { secure_url: url, public_id } = await cloudinary.uploader.upload(
    file,
    { folder }
  );

  return { url, public_id };
};

exports.DeleteImageFromCloud = async function (public_id) {
  const { result } = await cloudinary.uploader.destroy(public_id);
  return result;
};
