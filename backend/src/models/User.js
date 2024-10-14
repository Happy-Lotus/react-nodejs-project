const conn = require("../config/database");
const Token = require("./Token");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const transporter = require("../config/email");
const jwt = require("jsonwebtoken");
const secret = "Kkb5I86s3B";
dotenv.config();
const { JWT_SECRET } = process.env;
let timeoutId;

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

//사용자 이메일 이용한 사용자 확인
exports.readByEmail = async function (email) {
  try {
    const sql = "SELECT * FROM user WHERE email = ?";
    return new Promise((resolve, reject) => {
      conn.query(sql, email, (error, results) => {
        if (error) {
          console.error("Database error: ", error);
          reject(error);
        } else if (results.length > 0) {
          resolve(false);
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
    const existingUser = await this.readByEmail(email);

    if (!existingUser) {
      return res.status(409).json({ message: "이미 존재하는 이메일입니다." });
    }

    if (req.session[email]) {
      return res
        .status(403)
        .json({ message: "아직 인증이 완료되지 않은 이메일입니다." });
    }

    const sql =
      "INSERT INTO user (name, email, pwd, regdate, nickname) VALUES (?, ?, ?, ?, ?)";
    const currentDate = new Date().toISOString().slice(0, 23).replace("T", " ");
    const hashedPassword = await bcrypt.hash(pwd, 10);
    const var_array = [name, email, hashedPassword, currentDate, nickname];

    await conn.query(sql, var_array, (error, results) => {
      if (error) {
        return res.status(400).json({ message: error.sqlMessage });
      }
    });

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
        res.status(500).json({ message: "이메일 전송에 실패하였습니다." });
      } else {
        console.log(response);
        req.session[email] = number;
        console.log("number:" + number);
        timeoutId = setTimeout(async () => {
          const storedCode = req.session[email];
          console.log("session:" + req.session[email]);
          if (!storedCode) {
            console.log("session delete OK");
          } else {
            delete req.session[email];
            console.log(
              `Session for ${email} has expired and the verification code has been deleted.`
            );
          }
        }, 600000);
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
          const payload = {
            email: results[0].email,
            userid: results[0].userid,
            pwd: results[0].pwd,
          };
          const accessToken = jwt.sign(payload, secret, {
            algorithm: "HS256",
            expiresIn: "1h",
          });
          const refreshToken = jwt.sign(payload, secret, {
            algorithm: "HS256",
            expiresIn: "14d",
          });
          const existRefreshToken = await Token.read(results[0].userid);
          //existRefreshToken이 없을 경우 -> 새로 create
          //있다면 token update
          if (!existRefreshToken) {
            await Token.create(refreshToken, results[0].userid);
          } else {
            await Token.update(refreshToken, results[0].userid);
          }

          res
            .status(201)
            .setHeader("Access-Control-Allow-Credentials", "true")
            .setHeader("Access-Control-Allow-Headers", "Content-Type")
            .setHeader("Access-Control-Allow-Methods", "POST,OPTIONS")
            .setHeader("Access-Control-Allow-Origin", "http://localhost:3000")
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
            });
          return res;
        } else {
          return res.status(401).json({ result: "Password mismatch" });
        }
      }
    });
  } catch (error) {
    return res.status(500).json({ result: "Server Error" });
  }
};

//사용자 로그아웃
exports.logout = async function (req, res) {
  const { userid } = req.user;

  try {
    await Token.delete(userid);
    return res
      .status(204)
      .clearCookie("RefreshToken", { path: "/" })
      .clearCookie("AccessToken", { path: "/" })
      .json({ msg: "로그아웃 완료" });
  } catch (error) {
    console.error("Error: ", error);
    return res.status(500).json({ result: "Server error:" });
  }
};

//사용자 이메일 인증
exports.verifyEmail = async function (req, res) {
  const { email, verifyNumber } = req.body;

  try {
    const storedCode = req.session[email];

    if (!storedCode) {
      return res
        .status(400)
        .json({ message: "인증번호가 세션에 저장되어 있지 않습니다." });
    }

    if (verifyNumber === storedCode) {
      // 인증 성공
      console.log("인증성공" + storedCode);
      delete req.session[email];
      clearTimeout(timeoutId); // 타이머 취소
      console.log("세션번호 삭제:" + req.session[email]);
      return res.status(200).json({ message: "인증 성공!" });
    } else {
      // 인증 실패
      return res
        .status(400)
        .json({ message: "인증번호가 일치하지 않습니다. 다시 입력하세요." });
    }
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
  } catch (error) {
    return res.status(500).json({ result: "Server error:" });
  }
};

//사용자 삭제
exports.delete = async function (req, res) {
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

//사용자 조회
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
    console.error("Error: ", error);
    throw new Error("서버 오류");
  }
};

exports.sessionDelete = async function (email) {
  if (req.session[email]) {
    delete req.session[email];
    res.status(200).json({ msg: "재인증하세요" });
  } else {
    console.log("이미 인증된 이메일입니다." + email);
    res.status(409).json({ message: "이미 인증이 완료된 이메일입니다." });
  }
};
