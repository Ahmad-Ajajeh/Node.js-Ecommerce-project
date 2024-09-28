const multer = require("multer");

const ApiError = require("../utils/apiError");

const multerConfig = () => {
  // 1 - disk storage -> stores the file on a file inside the disk
  // const multerStorage = multer.diskStorage({
  //   destination: function (req, file, cb) {
  //     cb(null, "uploads/categories");
  //   },
  //   filename: (req, file, cb) => {
  //     const extension = file.mimetype.split("/")[1];
  //     const filename = `category-${uuidv4()}-${Date.now()}.${extension}`;
  //     cb(null, filename);
  //   },
  // });

  // 2 - memory storage -> stores the file as a buffer in mem
  const multerStorage = multer.memoryStorage();

  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("ONLY IMAGES ARE ALLOWED", 400), false);
    }
  };

  return multer({ storage: multerStorage, fileFilter: multerFilter });
};
exports.uploadSingleImage = (fieldName) => multerConfig().single(fieldName);

exports.uploadMultipleImages = (fields) => multerConfig().fields(fields);
