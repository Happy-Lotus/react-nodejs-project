const jwt = require("jsonwebtoken");
const dotenv = require('dotenv')
dotenv.config();
const secret = 'Kkb5I86s3B';
const Token = require('../models/Token')
const JWT = require('../config/jwt')

const authMiddleware = (req, res, next) => {
  const accesstoken = req.headers["accesstoken"];
  const refreshtoken = req.headers["refreshtoken"]

  if (!accesstoken) {
    return res.status(403).json({
      code: 403,
      msg: "No token provided. Access denied.",
    });
  }

  // 토큰 검증
  jwt.verify(accesstoken, secret, async (err, decoded) => {

    if (err) {
      if(err.name === "TokenExpiredError"){
        if(!refreshtoken){
          return res.status(401).json({
            code: 401,
            msg: "Access token expired and no refresh token provided.",
          });
        }

        const storedRefreshToken = await Token.read(decoded.userid);
        if(storedRefreshToken !== refreshtoken){
          return res.status(401).json({
            code: 401,
            msg: "Refresh token expired or invalid.",
          });
        }

         // 새로운 access token 발급
         const newAccessToken = jwt.sign({ userId: decoded.userId }, secret, { expiresIn: "1h" });
         return res.status(201)
                .cookie("Accesstoken", newAccessToken, { httpOnly: true });
      }else{
        req.user = decoded;
        next();
      }
      return res.status(401).json({
        code: 401,
        msg: "Failed to authenticate token.",
      });
    }
    req.user = decoded;
    next();
  });
};

module.exports = authMiddleware;
