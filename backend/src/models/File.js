const maria = require("mysql");
const conn = require("../config/database");
const moment = require("moment");
const { upload } = require("../config/storage");
const fs = require("fs").promises;
const path = require("path");

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
      "SELECT filename, uploadtime, filesize, url, originalname FROM file WHERE boardid = ? ORDER BY uploadtime ASC";
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

//파일 삭제
exports.delete = async function (boardid, filename) {
  const sql = "DELETE FROM file WHERE filename = ?";
  const var_array = [filename, boardid];
  console.log("File delete");
  console.log(filename);

  return new Promise((resolve, reject) => {
    conn.query(sql, var_array, (error, results) => {
      if (error) {
        return reject({ statusCode: 400, message: error.sqlMessage });
      } else {
        console.log("파일 삭제 성공" + results.length);
        resolve({ statusCode: 201, message: "파일 삭제 성공" });
      }
    });
  });
  // await new Promise((resolve, reject) => {
  //   conn.query(sql, filename, (error, results) => {
  //     if (error) {
  //       console.error("Database error: ", error);
  //       return reject(new Error("Database error: " + error.message));
  //     }
  //     resolve();
  //   });
  // });
};

exports.imageUpload = async function (req, res) {
  console.log(req.file);
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }
  // 파일 URL 생성
  const imageUrl = `http://localhost:4000/uploads/${req.file.filename}`;
  return res.json({ url: imageUrl });
};

exports.read = async function (url, res) {
  if (!url) {
    return res.status(400).json({ error: "No file uploaded." });
  }
  const fileUrl = `http://localhost:4000/uploads/${url}`;

  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Content-Type", "application/json");

  return res.json({ url: fileUrl });
};

//본문에 포함된 이미지 파일 삭제 함수
exports.deleteFiles = async (urls) => {
  const deletePromises = urls.map(async (url) => {
    const fileName = path.basename(url); // URL에서 파일 이름 추출
    const filePath = path.join(
      __dirname, // 현재 파일의 디렉토리 경로
      "../uploads", // uploads 디렉토리로 경로 설정
      fileName // 파일 이름 추가
    ); // 파일 경로 설정
    console.log(fileName);
    console.log(__dirname);
    try {
      await fs.unlink(filePath); // 파일 삭제
      console.log(`File deleted: ${filePath}`);
    } catch (err) {
      console.error(`Error deleting file: ${filePath}`, err);
      throw new Error(`Failed to delete file: ${filePath}`);
    }
  });

  await Promise.all(deletePromises); // 모든 파일 삭제가 완료될 때까지 대기
};

// 썸네일 파일 삭제 함수
exports.deleteThumbnail = async (thumbnailUrl) => {
  console.log("deleteThumbnail 함수" + thumbnailUrl);
  if (thumbnailUrl) {
    const thumbnailFileName = path.basename(thumbnailUrl);
    console.log(thumbnailFileName);
    const thumbnailFilePath = path.join(
      __dirname, // 현재 파일의 디렉토리 경로
      "../uploads", // uploads 디렉토리로 경로 설정
      thumbnailFileName
    ); // 썸네일 파일 경로 설정
    console.log(thumbnailFilePath);

    try {
      await fs.unlink(thumbnailFilePath); // 썸네일 파일 삭제
      console.log(`Thumbnail deleted: ${thumbnailFilePath}`);
    } catch (err) {
      console.error(`Error deleting thumbnail file: ${thumbnailFilePath}`, err);
      throw new Error(`Failed to delete thumbnail file: ${thumbnailFilePath}`);
    }
  }
};

// 첨부파일 삭제 함수
exports.deleteAttachedFiles = async (filenames) => {
  const deletePromises = filenames.map(async (file) => {
    const filePath = path.join(
      __dirname, // 현재 파일의 디렉토리 경로
      "../uploads", // uploads 디렉토리로 경로 설정
      file // 파일 이름 추가
    ); // 파일 경로 설정

    try {
      await fs.unlink(filePath); // 파일 삭제
      console.log(`Attached file deleted: ${filePath}`);
    } catch (err) {
      console.error(`Error deleting attached file: ${filePath}`, err);
      throw new Error(`Failed to delete attached file: ${filePath}`);
    }
  });

  await Promise.all(deletePromises); // 모든 첨부파일 삭제가 완료될 때까지 대기
};
