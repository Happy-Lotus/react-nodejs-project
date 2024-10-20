const conn = require("../config/database");
const dotenv = require("dotenv");
const File = require("../models/File");
const Post = require("../models/Post");
const User = require("../models/User");
const path = require("path"); // path 모듈 추가
dotenv.config();
const moment = require("moment");
const fs = require("fs");

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
    };

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
      .setHeader("Access-Control-Allow-Origin", "http://localhost:3000")
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

// exports.readOption = async (req, res) => {
//   const option = req.params.option;
//   const content = req.query.content;

//   try {
//     const { statusCode, message, post } = await Post.readOption(
//       option,
//       content
//     );
//     return res.status(statusCode).json({ message, post });
//   } catch (error) {
//     return res
//       .status(error.statusCode || 500)
//       .json({ result: error.message || "Server error" });
//   }
// };
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
    const { title, content, thumbnail, deleteFiles } = JSON.parse(
      req.body.post
    );
    const newFiles = req.files;

    console.log("controllers update 함수");
    console.log(title + "\n" + content);
    console.log(thumbnail + "\n" + deleteFiles);
    console.log(newFiles);

    const existThumbnail = await Post.readByBoardId(boardid).then((result) => {
      result.thumbnail;
    });
    const data = {
      title,
      content,
      thumbnail,
      boardid,
      deleteFiles,
      newFiles,
    };

    const { statusCode, message } = await Post.update(data);
    if (statusCode === 201) {
      await Promise.all([
        File.deleteAttachedFiles(deleteFiles),
        File.deleteThumbnail(existThumbnail),
      ]);
    }
    return res.status(statusCode).json({ message });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode).json({ message: error.message });
  }

  // const existThumbnail = await this.readByBoardId(boardid).then((result) => {
  //   result.thumbnail;
  // });

  // let changeThumbnail =
  //   typeof req.files.thumbnail !== "undefined"
  //     ? `${req.files.thumbnail[0].destination}${req.files.thumbnail[0].filename}`
  //     : "";

  // changeThumbnail = await changeThumbnailImg(
  //   existThumbnail,
  //   changeThumbnail,
  //   thumbnail
  // );

  // const add = req.files.files;

  // try {
  //   const sql =
  //     "UPDATE board SET title = ?, content = ?, thumbnail = ? WHERE boardid = ?";
  //   const var_array = [title, content, thumbnail, boardid];

  //   conn.query(sql, var_array, (error, results) => {
  //     if (error) {
  //       console.error("Database error: ", error);
  //       return res.status(500).json({ result: "Database error:" + userid });
  //     } else {
  //       if (results.affectedRows > 0) {

  //         const updateFiles =
  //           typeof req.body.updateFiles !== "undefined"
  //             ? JSON.parse(JSON.parse(req.body.updateFiles).updateFiles)
  //             : [];

  //         try {
  //           if (add && add.length > 0) {
  //             let fileInfos;

  //             if (add) {
  //               fileInfos = add.map((file) => ({
  //                 filename: file.filename,
  //                 originalname: file.originalname,
  //                 size: file.size,
  //                 url: `/uploads/${file.filename}`,
  //               }));
  //             }
  //             File.create(boardid, fileInfos);
  //           }

  //           if (updateFiles.length > 0) {
  //             let fileInfos;
  //             fileInfos = updateFiles.map((filename) => ({
  //               file: { filename: filename },
  //             }));

  //             // for (const oldFile of fileInfos) {
  //             //   File.delete(oldFile[0]);
  //             // }
  //             fileInfos.forEach((fileInfo) => {
  //               File.delete(fileInfo.file);
  //             });
  //             File.deleteAttachedFiles(
  //               fileInfos.map((fileInfo) => fileInfo.file)
  //             );
  //           }

  //           return res.status(201).json({ result: "File update OK" });
  //         } catch (error) {
  //           console.error("File upload error: ", error);
  //           return res.status(500).json({ result: "File upload error" });
  //         }
  //       } else {
  //         return res.status(400).json({ result: error });
  //       }
  //     }
  //   });
  // } catch (error) {
  //   console.error("Error: ", error);
  //   return res.status(500).json({ result: "Server error:" });
  // }
};
