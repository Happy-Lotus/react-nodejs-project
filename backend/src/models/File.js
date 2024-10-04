const maria = require("mysql");
const conn = require("../config/database");
const moment = require("moment");
const { upload } = require("../config/storage");
const fs = require("fs");

// 파일 생성
exports.create = async function (boardId, fileInfos) {
  const sql =
    "INSERT INTO file (filename, uploadtime, filesize, boardid, url, originalname) VALUES (?, ?, ?, ?, ?, ?)";

  try {
    for (const fileInfo of fileInfos) {
      const { filename, originalname, size, url } = fileInfo;
      const now = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
      const var_array = [filename, now, size, boardId, url, originalname];

      conn.query(sql, var_array, (error, results) => {
        if (error) {
          console.error("Database error: ", error);
        } else {
          console.log("File created successfully");
        }
      });
    }
  } catch (error) {
    console.error("Error: ", error);
  }
};

// 파일 조회
exports.readOption = async function (boardId) {
  try {
    const sql =
      "SELECT filename, filepath, filesize FROM file WHERE boardid = ? ORDER BY uploadtime ASC";
    return new Promise((resolve, reject) => {
      conn.query(sql, boardId, (error, results) => {
        if (error) {
          console.error("Database error: ", error);
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  } catch (error) {
    console.error("Error: ", error);
  }
};

// 파일 삭제
exports.delete = async function (fileid) {
  try {
    const sql = "DELETE FROM file WHERE fileid = ?";

    conn.query(sql, fileid, (error, results) => {
      if (error) {
        console.error("Database error: ", error);
      } else {
        console.log("File delete");
      }
    });
  } catch (error) {
    console.error("Error: ", error);
  }
};

exports.imageUpload = async function (req, res) {
  if (err) {
    return res.status(500).json({ error: "File upload failed." });
  }
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  // 파일 URL 생성
  const fileUrl = `http://localhost:4000/uploads/${req.file.filename}`;
  console.log(req.file);
  return res.json({ url: fileUrl });
};

exports.downloadFiles = (req, res) => {
  const filename = req.params.filename;

  try {
    const isFileExist = fs.existsSync(`uploads/${filename}`);

    if (!isFileExist) {
      return res.status(400).json({ error: "No File" });
    } else {
      return res.download(`uploads/${filename}`);
    }
  } catch (error) {}
};
