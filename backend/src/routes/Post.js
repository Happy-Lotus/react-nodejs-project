const express = require("express");
const router = express.Router();

const { upload, imageUpload } = require("../config/storage");
const postController = require("../controllers/post");
const authMiddleware = require("../middleware/authMiddleware");

/*게시물 전체 조회*/
router.get("/", postController.readAll);

/* 게시물 옵션 조회*/
router.get("/:option", authMiddleware, postController.verifyEmail);

/*게시물 상세 조회*/
router.get("/detail/:postid", postController.read);

/* 게시물 작성*/
router.post("/edit", upload.array("files"), postController.create);

/* 게시물 수정*/
router.post(
  "/detail/:postid",
  authMiddleware,
  upload.fields([{ name: "files" }, { name: "thumbnail" }]),
  postController.update
);

//게시물 파일 다운로드
router.get("/:postid/file/:filename", postController.downloadFiles);

module.exports = router;
