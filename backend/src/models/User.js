const conn = require("../config/database");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();

//사용자 생성
exports.create = async function (data) {
  const { email, pwd, nickname, name } = data;
  console.log(
    data.email + " " + data.pwd + " " + data.nickname + " " + data.name
  );
  const sql =
    "INSERT INTO user (name, email, pwd, regdate, nickname) VALUES (?, ?, ?, ?, ?)";
  const currentDate = new Date().toISOString().slice(0, 23).replace("T", " ");
  const hashedPassword = await bcrypt.hash(pwd, 10);
  const var_array = [name, email, hashedPassword, currentDate, nickname];

  return new Promise((resolve, reject) => {
    conn.query(sql, var_array, (error, results) => {
      if (error) {
        return reject({ statusCode: 400, message: error.sqlMessage });
      } else {
        resolve({ statusCode: 201, message: "회원가입 성공" });
      }
    });
  });
};

//사용자 업데이트
exports.update = async function (columns, changes, email) {
  try {
    for (const column of columns) {
      let i = 0;
      const sql = `UPDATE user SET ${column} = ? WHERE email = ?`;
      const var_array = [changes[i], email];
      conn.query(sql, var_array, (error, results) => {
        if (error) {
          console.error("Database error: ", error);
          return res.status(500).json({ result: "Database error:" + email });
        } else {
          console.log(column + "업데이트 완료");
        }
      });
      i++;
    }
    i = 0;
  } catch (error) {
    return res.status(500).json({ result: "Server error:" });
  }
};

//사용자 삭제
exports.delete = async (req, res) => {
  const sql = "DELETE FROM user WHERE userid = ?";
  const userid = req.params.userid;

  try {
    conn.query(sql, userid, (error, results) => {
      if (error) {
        console.error("Database error: ", error);
        return res.status(500).json({ message: "Database error:" + userid });
      } else {
        res
          .status(200)
          .clearCookie("RefreshToken", { path: "/" })
          .clearCookie("AccessToken", { path: "/" })
          .json({ message: "User deleted" });
      }
    });
  } catch (error) {
    console.error("Error: ", error);
    return res.status(500).json({ message: "Server error:" });
  }
};

exports.readSpec = async (email) => {
  const sql = "SELECT userid, email, pwd, nickname FROM user WHERE email = ?";
  return new Promise((resolve, reject) => {
    conn.query(sql, email, (error, results) => {
      if (error) {
        reject({ statusCode: 500, message: "서버 오류" });
      } else if (results.length === 0) {
        resolve({
          statusCode: 404,
          message: "아이디나 비밀번호가 일치하지 않습니다.",
        });
      } else {
        const user = {
          userid: results[0].userid,
          email: results[0].email,
          pwd: results[0].pwd,
          nickname: results[0].nickname,
        };
        resolve({ statusCode: 200, message: "Success", user });
      }
    });
  });
};

//사용자 정보 읽기(key:value)
exports.read = async function (key, value) {
  const sql = `SELECT userid FROM user WHERE ${key} = ?`;

  try {
    return new Promise((resolve, reject) => {
      conn.query(sql, value, (error, results) => {
        if (error) {
          console.error("Database error: ", error);
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  } catch (error) {
    throw error;
  }
};
