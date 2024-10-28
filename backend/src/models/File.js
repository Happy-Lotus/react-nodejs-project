const conn = require("../config/database");
const moment = require("moment");

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
};
