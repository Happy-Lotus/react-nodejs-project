const conn = require("../config/database");
const Token = require("../models/Token");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const transporter = require("../config/email");
const jwt = require("jsonwebtoken");
const secret = "Kkb5I86s3B";
const User = require("../models/User");
dotenv.config();

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

exports.checkNickname = async (req, res) => {
  const { nickname } = req.body.nickname;
  try {
    const results = await User.read("nickname", nickname); // 닉네임으로 조회
    return res.status(200).json(results);
  } catch (error) {
    console.error("Error checking nickname:", error);
    return res.status(500).json({ message: "서버 오류" });
  }
};

exports.generateCode = async (req, res) => {
  const { email } = req.body;
  try {
    const existingUser = await User.read("email", email);

    if (existingUser.length > 0) {
      return res.status(409).json({ message: "이미 존재하는 이메일입니다." });
    }

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
        req.session.user = {
          email: email,
          code: number,
        };
        console.log("number:" + number);
        console.log("admin.js");
        res.status(201).json({
          message: "이메일을 확인하여 인증을 완료해주세요.",
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류" });
  }
};

exports.verifyEmail = async (req, res) => {
  const { code } = req.body;

  try {
    const user = req.session.user;

    if (!user) {
      return res
        .status(400)
        .json({ message: "인증번호가 세션에 저장되어 있지 않습니다." });
    }

    if (code === user.code) {
      // 인증 성공
      console.log("인증성공" + user.code);
      req.session.user = null;
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

exports.register = async (req, res) => {
  const isVerified = req.body.isVerified;

  try {
    if (!isVerified || isVerified !== 1) {
      return res
        .status(403)
        .json({ message: "아직 인증이 완료되지 않은 이메일입니다." });
    }

    const results = await User.create(req.body);

    if (results.statusCode === 201) {
      req.session.user = null;
    }
    console.log("admin.js register");
    res.status(results.statusCode).json({ message: results.message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류" });
  }
};

exports.login = async (req, res) => {
  const { email, pwd } = req.body;

  try {
    const result = await User.readSpec(email);
    const { statusCode, message, user } = result;

    if (statusCode === 200 && user) {
      const isCorrectPassword = await checkPassword(user.pwd, pwd);
      if (isCorrectPassword) {
        const payload = {
          email: user.email,
          userid: user.userid,
          pwd: user.pwd,
          nickname: user.nickname,
        };

        const accessToken = jwt.sign(payload, secret, {
          algorithm: "HS256",
          expiresIn: "1h",
        });
        const refreshToken = jwt.sign(payload, secret, {
          algorithm: "HS256",
          expiresIn: "14d",
        });
        const existRefreshToken = await Token.read(user.userid);
        //existRefreshToken이 없을 경우 -> 새로 create
        //있다면 token update
        if (!existRefreshToken) {
          await Token.create(refreshToken, user.userid);
        } else {
          await Token.update(refreshToken, user.userid);
        }
        console.log("admin.js login");
        res
          .status(201)
          .setHeader("Access-Control-Allow-Credentials", "true")
          .setHeader("Access-Control-Allow-Headers", "Content-Type")
          .setHeader("Access-Control-Allow-Methods", "POST,OPTIONS")
          .setHeader("Access-Control-Allow-Origin", "http://localhost:3000")
          .cookie("AccessToken", accessToken, {
            maxAge: 3600000,
            httpOnly: true,
            path: "/",
            sameSite: "lax",
          })
          .cookie("RefreshToken", refreshToken, {
            maxAge: 3600000 * 24 * 14,
            httpOnly: true,
            path: "/",
            sameSite: "lax",
          })
          .json({
            email: email,
            nickname: result.nickname,
          });
        return res;
      } else {
        return res.status(401).json({ result: "Password mismatch" });
      }
    } else {
      return res.status(statusCode).json({ result: message });
    }
  } catch (error) {
    return res.status(500).json({ result: "Server Error" });
  }
};

exports.logout = async (req, res) => {
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
