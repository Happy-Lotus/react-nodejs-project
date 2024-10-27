const express = require("express");
const router = express.Router();

const { upload, imageUpload } = require("../config/storage");
const postController = require("../controllers/post");
const fileController = require("../controllers/file");
const authMiddleware = require("../middleware/authMiddleware");

// /*게시물 전체 조회*/
// router.get("/", authMiddleware, postController.readAll);

// /* 게시물 옵션 조회*/
// router.get("/:option", authMiddleware, postController.verifyEmail);
router.get("/", authMiddleware, postController.readOption);
/*게시물 상세 조회*/
router.get("/detail/:postid", authMiddleware, postController.read);

/* 게시물 작성*/
router.post(
  "/edit",
  authMiddleware,
  upload.array("files"),
  postController.create
);

/* 게시물 수정*/
router.post(
  "/detail/:postid",
  authMiddleware,
  upload.array("newFiles"),
  postController.update
);

//게시물 파일 다운로드
router.get(
  "/:postid/file/:filename",
  authMiddleware,
  postController.downloadFiles
);
router.post("/cancel", authMiddleware, postController.cancel);

//게시물 삭제
router.delete("/:postid", authMiddleware, postController.delete);

//게시물 작성 시 이미지 업로드
router.post(
  "/upload",
  authMiddleware,
  imageUpload.single("image"),
  (req, res) => {
    fileController.imageUpload(req, res);
  }
);

//게시물 이미지 가져오기
router.get("/:imageUrl", authMiddleware, (req, res) => {
  console.log(":imageUrl ");
  const imageUrl = req.params.imageUrl;
  fileController.read(imageUrl, res);
});

module.exports = router;
