const dotenv = require("dotenv");
const Post = require("../models/Post");
const path = require("path"); // path 모듈 추가
dotenv.config();
const fs = require("fs");
const fileController = require("../controllers/file");
const CLIENT_URL = process.env.CLIENT_URL;

//게시물 생성
exports.create = async (req, res) => {
  try {
    const { title, content, thumbnail } = JSON.parse(req.body.post);
    const { email, userid, nickname } = req.user;
    const files = req.files;

    const data = {
      title,
      content,
      writer: nickname,
      userid,
      thumbnail,
      files,
      hasFile: files.length > 0 ? true : false,
    };
    console.log("===========controllers post create===========");
    console.log(data);

    const { statusCode, message } = await Post.create(data);
    return res.status(statusCode).json({ message });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode).json({ message: error.message });
  }
};

exports.readAll = async (req, res) => {
  console.log("readAll");
  try {
    const { statusCode, message, postData } = await Post.readAll();
    return res
      .setHeader("Access-Control-Allow-Credentials", "true")
      .setHeader("Access-Control-Allow-Origin", CLIENT_URL)
      .status(statusCode)
      .json({ message: message, postData });
  } catch (error) {
    console.error("Error: ", error);
    return res
      .status(error.statusCode || 500)
      .json({ result: error.message || "Server error" });
  }
};

exports.verifyEmail = async (req, res) => {};
exports.read = async (req, res) => {
  console.log("controllers post read ");
  const boardid = req.params.postid;
  try {
    const { statusCode, message, postData } = await Post.read(boardid);

    console.log(postData);
    return res
      .header(" X-Content-Type-Options: nosniff")
      .status(statusCode)
      .json({ message: message, postData });
  } catch (error) {
    console.error("Error: ", error);
    return res
      .status(error.statusCode || 500)
      .json({ result: error.message || "Server error" });
  }
};

exports.downloadFiles = async (req, res) => {
  console.log("controllers post downloadFiles");
  const filename = req.params.filename;

  try {
    const filePath = path.join(__dirname, "../uploads", filename);

    if (!fs.existsSync(filePath)) {
      return res.status(400).json({ error: "No File" });
    } else {
      const originalname = filename.substring(filename.indexOf("_") + 1);
      console.log(originalname);
      return res.status(201).download(filePath, originalname);
    }
  } catch (error) {
    console.error("Error: ", error);
    return res.status(500).json({ message: "Server error:" });
  }
};

//게시물 수정
exports.update = async function (req, res) {
  /**
   * req 정보
   * deleteFiles => 삭제할 파일명 리스트
   * thumbnail => 변경일 경우 새로운 thumbnail 주소. uploads/~ 삭제면 ""
   * files => 새로 추가한 파일들
   */
  try {
    const boardid = req.params.postid;
    const { title, content, thumbnail, deleteFiles, hasFile } = JSON.parse(
      req.body.post
    );
    const newFiles = req.files;

    console.log("controllers update 함수");
    console.log(title + "\n" + content);
    console.log(thumbnail + "\n" + deleteFiles);
    console.log(newFiles);

    const result = await Post.readByBoardId(boardid);
    const existThumbnail = result.thumbnail;
    console.log("========existThumbnail=========");
    console.log(existThumbnail);
    console.log(thumbnail);
    const data = {
      title,
      content,
      thumbnail,
      boardid,
      deleteFiles,
      newFiles,
      hasFile,
    };

    const { statusCode, message } = await Post.update(data);
    if (statusCode === 201) {
      console.log("썸네일 삭제 진행");
      if (existThumbnail && existThumbnail !== data.thumbnail) {
        console.log("existThumbnail && existThumbnail !== data.thumbnail");
        await fileController.deleteThumbnail(existThumbnail);
      }
    }
    return res.status(statusCode).json({ message });
  } catch (error) {
    console.error(error);
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Server error" });
  }
};

exports.delete = async function (req, res) {
  try {
    const boardid = req.params.postid;
    const { statusCode, message } = await Post.delete(boardid);
    return res.status(statusCode).json({ message: message });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode).json({ message: error.message });
  }
};

exports.readOption = async function (req, res) {
  try {
    const option = req.query.option;
    const content = req.query.content;
    const page = Number(req.query.page) || 1;
    const perPage = Number(req.query.perPage) || 5;
    console.log(CLIENT_URL);

    const { posts, totalPage, currentPage } = await Post.readOption(
      option,
      content,
      page,
      perPage
    );

    return res.status(201).json({
      message: "게시물 조회 성공",
      posts,
      totalPage,
      currentPage,
    });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode).json({ message: error.message });
  }
};

exports.cancel = async function (req, res) {
  try {
    console.log("cancel 함수");
    console.log(req);
    const { thumbnails, deleteFiles } = req.body;
    const deleteThumbnailPromise = thumbnails.map((thumbnail) =>
      fileController.deleteThumbnail(thumbnail)
    );

    // deleteFiles가 존재하면 deleteAttachedFiles 호출
    const deleteFilesPromise =
      deleteFiles && deleteFiles.length > 0
        ? fileController.deleteAttachedFiles(deleteFiles)
        : Promise.resolve(); // deleteFiles가 없으면 빈 Promise 반환

    // 두 Promise를 동시에 실행
    await Promise.all([deleteThumbnailPromise, deleteFilesPromise]);
  } catch (error) {
    console.error(error);
    res.status(error.statusCode).json({ message: error.message });
  }
};
