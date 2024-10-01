const maria = require("mysql");
const conn = require("../config/database");
const File = require("./File");
const Token = require("./Token");
const JWT = require("../config/jwt");
const moment = require("moment");
const multer = require("multer");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const transporter = require("../config/email");
const crypto = require("crypto");
dotenv.config();
const { JWT_SECRET } = process.env;

//사용자 비밀번호 확인
const checkPassword = async function (dbpwd, pwd) {
  try {
    return new Promise((resolve, reject) => {
      if (bcrypt.compare(dbpwd, pwd)) {
        resolve(true);
      } else {
        reject(false);
      }
    });
  } catch (error) {
    console.error("Error:", error);
  }
};

exports.readByEmail = async function (email) {
  try {
    const sql = "SELECT * FROM user WHERE email = ?";
    return new Promise((resolve, reject) => {
      conn.query(sql, email, (error, results) => {
        if (error) {
          console.error("Database error: ", error);
          reject(error);
        } else if (results.length > 0) {
          reject(false);
        } else {
          resolve(true);
        }
      });
    });
  } catch (error) {
    console.error("Error: ", error);
  }
};

//사용자 생성
exports.register = async function (req, res) {
  const { email, pwd, nickname, name } = req.body;

  console.log(email + " " + pwd + " " + nickname + " " + name);
  try {
    console.log(email);
    const existingUser = await this.readByEmail(email);

    if (!existingUser) {
      return res.status(400).json({ msg: "이미 존재하는 이메일입니다." });
    }

    const sql =
      "INSERT INTO user (name, email, pwd, regdate, nickname, is_verified) VALUES (?, ?, ?, ?, ?, ?)";
    const currentDate = new Date().toISOString().split("T")[0];
    const hashedPassword = await bcrypt.hash(pwd, 10);
    const var_array = [name, email, hashedPassword, currentDate, nickname, 0];

    await conn.query(sql, var_array);
    console.log("user insert");
    const generateRandomNumber = function (min, max) {
      const randNum = Math.floor(Math.random() * (max - min + 1)) + min;
      return randNum;
    };
    const number = generateRandomNumber(111111, 999999);
    const mailOptions = {
      from: "your-email@gmail.com",
      to: email,
      subject: " 이메일인증",
      html: "<h1>인증번호를 입력해주세요 \n\n\n\n\n</h1>" + number,
    };

    transporter.sendMail(mailOptions, async (err, response) => {
      if (err) {
        res.status(400).json({ message: "이메일 전송에 실패하였습니다." });
      } else {
        console.log(response);
        await this.update(["is_verified"], [number], email);
        res.status(201).json({
          message: "회원가입 성공. 이메일을 확인하여 인증을 완료해주세요.",
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류" });
  }
};

//사용자 로그인
exports.login = async function (req, res) {
  const { email, pwd } = req.body;

  try {
    const sql = "SELECT userid, email, pwd, nickname FROM user WHERE email = ?";
    conn.query(sql, email, async (error, results) => {
      if (error) {
        console.error("Database error: ", error);
        return res.status(500).json({ result: "Database error:" + email });
      } else {
        const isCorrectPassword = await checkPassword(results[0].pwd, pwd);
        if (isCorrectPassword) {
          const accessToken = JWT.sign(results[0]);
          const refreshToken = JWT.refresh();
          await Token.create(refreshToken, results[0].userid);

          return res
            .status(201)
            .cookie("AccessToken", accessToken, {
              httpOnly: true,
              path: "/",
              sameSite: "lax",
            })
            .cookie("RefreshToken", refreshToken, {
              httpOnly: true,
              path: "/",
              sameSite: "lax",
            })
            .json({
              email: email,
              nickname: results[0].nickname,
              accessToken: accessToken,
            });
        } else {
          return res.status(400).json({ result: "Password mismatch " });
        }
      }
    });
  } catch (error) {
    return res.status(500).json({ result: "Server Error" });
  }
};

//사용자 로그아웃
exports.logout = async function (req, res) {
  const { email, token } = req.body;

  try {
    res.clearCookie("RefreshToken", { path: "/" });
  } catch (error) {}
};

exports.verifyEmail = async function (req, res) {
  const { verifyNumber, email } = req.body;

  try {
    const sql = "SELECT is_verified FROM user WHERE email = ?";
    conn.query(sql, email, async (error, results) => {
      if (error) {
        console.error("Database error: ", error);
        return res.status(500).json({ result: "Database error:" + email });
      } else {
        if (verifyNumber === results[0].is_verified) {
          await this.update(["is_verified"], [1], email);
          return res.status(201).json({ result: "인증 완료" });
        } else {
          return res.status(400).json({ result: "인증 코드 맞지 않음" });
        }
      }
    });
  } catch (error) {
    console.error("Error: ", error);
    return res.status(500).json({ result: "Server error:" });
  }
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
  } catch (error) {}
};

//사용자 삭제
exports.delete = async function (req, res) {};
