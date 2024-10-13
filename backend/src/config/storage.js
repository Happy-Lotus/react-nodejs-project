const multer = require("multer");
const path = require("path")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, path.join(__dirname,"../uploads"));
  },
  filename: function (req, file, cb) {
    const originalName = file.originalname;
    const encodedName = encodeURIComponent(originalName);
    cb(null, Date.now() + encodedName);
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (["image/jpeg", "image/jpg", "image/png"].includes(file.mimetype))
      cb(null, true);
    else cb(new Error("해당 파일의 형식을 지원하지 않습니다."), false);
  },
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

module.exports = { upload };
