const conn = require("../config/database");

exports.create = async function (token, userid) {
  try {
    const sql = "INSERT INTO token (userid, token) VALUES (?, ?)";
    const var_array = [userid, token];

    return new Promise((resolve, reject) => {
      conn.query(sql, var_array, (error, results) => {
        if (error) {
          console.error("Database error: ", error);
          reject(error);
        } else {
          resolve();
        }
      });
    });
  } catch (error) {
    console.error("Error: ", error);
  }
};

//토큰 삭제
exports.delete = async function (userid) {
  try {
    const sql = "DELETE FROM token WHERE userid = ?";

    return new Promise((resolve, reject) => {
      conn.query(sql, userid, (error, results) => {
        if (error) {
          console.error("Database error: ", error);
          reject(error);
        } else {
          resolve();
        }
      });
    });
  } catch (error) {
    console.error("Error: ", error);
  }
};

//토큰 업데이트
exports.update = async function (token, userid) {
  try {
    const sql = "UPDATE token SET token = ? WHERE userid = ?";
    const var_array = [token, userid];

    conn.query(sql, var_array, (error, results) => {
      if (error) {
        console.error(error);
      } else {
        console.log(userid + " token update successfully");
      }
    });
  } catch (error) {
    console.error(error);
  }
};

//토큰 읽기
exports.read = async function (userid) {
  try {
    const sql = "SELECT token FROM token WHERE userid = ?";

    return new Promise((resolve, reject) => {
      conn.query(sql, userid, (error, results) => {
        if (error) {
          console.error("Database error: ", error);
          reject(error);
        } else {
          resolve(token);
        }
      });
    });
  } catch (error) {
    console.error("Error: ", error);
  }
};
