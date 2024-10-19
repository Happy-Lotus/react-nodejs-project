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

    // const sql =
    //   "INSERT INTO board (title, content, writer, regdate, userid,thumbnail) VALUES (?, ?, ?, ?, ?, ?)";
    // const now = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
    // const var_array = [title, content, "애니", now, userid, thumbnail];
    // let fileInfos;

    // if (files) {
    //   fileInfos = files.map((file) => ({
    //     filename: file.filename,
    //     originalname: file.originalname,
    //     size: file.size,
    //     url: `/uploads/${file.filename}`,
    //   }));
    // }

    // console.log(fileInfos);

    // conn.query(sql, var_array, (error, results) => {
    //   if (error) {
    //     console.error("Database error: ", error);
    //     return res.status(500).json({ result: "Database error:" + email });
    //   } else {
    //     if (results.affectedRows > 0) {
    //       if (fileInfos) {
    //         try {
    //           const boardId = results.insertId;
    //           if (files) File.create(boardId, fileInfos);
    //           return res
    //             .status(201)
    //             .json({ result: "File and Post upload OK" });
    //         } catch (error) {
    //           console.error("File upload error: ", error);
    //           return res.status(400).json({ result: "File upload error" });
    //         }
    //       } else {
    //         return res
    //           .status(201)
    //           .json({ result: "Only Post created successfully" });
    //       }
    //     } else {
    //       return res.status(400).json({ result: "Error" });
    //     }
    //   }
    // });
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

exports.update = async (req, res) => {};
