const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const secret = "Kkb5I86s3B";

module.exports = {
  sign: (user) => {
    // access token 발급
    const payload = {
      // access token에 들어갈 payload
      userid: user.userid,
      email: user.email,
      pwd: user.pwd,
      nickname: user.nickname,
    };

    return jwt.sign(payload, secret, {
      // secret으로 sign하여 발급하고 return
      algorithm: "HS256", // 암호화 알고리즘
      expiresIn: "10m", // 유효기간
    });
  },

  verify: (token) => {
    // access token 검증
    try {
      const decoded = jwt.verify(token, secret, (error, decoded) => {});
      return {
        ok: true,
        email: decoded.email,
        pwd: decoded.pwd,
        nickname: decoded.nickname,
      };
    } catch (err) {
      return {
        ok: false,
        message: err.message,
      };
    }
  },

  refresh: () => {
    // refresh token 발급
    return jwt.sign({}, secret, {
      // refresh token은 payload 없이 발급
      algorithm: "HS256",
      expiresIn: "14d",
    });
  },
  refreshVerify: async (token, storedToken) => {
    // refresh token 검증

    try {
      if (token === storedToken) {
        try {
          jwt.verify(token, secret);
          return true;
        } catch (err) {
          return false;
        }
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  },
};
