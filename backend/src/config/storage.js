const multer = require("multer");
const path = require("path");

//file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname !== "post") {
      return cb(null, path.join(__dirname, "../uploads"));
    }
  },
  filename: function (req, file, cb) {
    console.log("file storage");
    console.log(file);
    file.originalname = Buffer.from(file.originalname, "latin1").toString(
      "utf8"
    );
    console.log(file.originalname);
    cb(null, Date.now() + "_" + file.originalname);
  },
});

//content 내 image storage
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    console.log("imageStorage");
    console.log(file);
    file.originalname = Buffer.from(file.originalname, "latin1").toString(
      "utf8"
    );

    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({
  storage,
});
const imageUpload = multer({
  storage: imageStorage,
  fileFilter: (req, file, cb) => {
    if (["image/jpeg", "image/jpg", "image/png"].includes(file.mimetype))
      cb(null, true);
    else cb(new Error("해당 파일의 형식을 지원하지 않습니다."), false);
  },
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

module.exports = { upload, imageUpload };
