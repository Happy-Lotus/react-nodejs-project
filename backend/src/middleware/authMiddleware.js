const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const secret = "Kkb5I86s3B";
const Token = require("../models/Token");

const authMiddleware = async (req, res, next) => {
  const accesstoken = req.cookies.AccessToken;

  if (!accesstoken) {
    return res.status(400).json({
      code: 400,
      msg: "No token provided. Access denied.",
    });
  }

  // 토큰 검증
  jwt.verify(accesstoken, secret, async (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        //access token 만료
        const refreshtoken = req.headers.RefreshToken;
        if (!refreshtoken) {
          //access token 만료 & refresh 토큰이 없을 경우
          return res.status(401).json({
            code: 401,
            msg: "Access token expired and no refresh token provided.",
          });
        } else {
          const payload = jwt.verify(refreshtoken, secret);
          if (!payload) {
            //access token 만료 & refresh token 만료
            return res.status(402).json({
              code: 402,
              msg: "Refresh token expired.",
            });
          }
        }

        const storedRefreshToken = await Token.read(decoded.userid);
        if (storedRefreshToken !== refreshtoken) {
          //저장된 refreshtoken과 일치하지 않음
          return res.status(402).json({
            code: 402,
            msg: "Refresh token expired or invalid.",
          });
        }

        // 새로운 access token 발급
        const newAccessToken = jwt.sign(decoded, secret, {
          expiresIn: "1h",
        });
        return res
          .status(201)
          .cookie("Accesstoken", newAccessToken, { httpOnly: true });
      } else {
        //access token이 만료되지 않음
        //인증오류
        req.user = decoded;
        next();
      }
      return res.status(401).json({
        code: 401,
        msg: "Failed to authenticate token.",
      });
    }
    //인증 성공
    req.user = decoded;
    next();
  });
};

module.exports = authMiddleware;
