const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const secret = "Kkb5I86s3B";
const Token = require("../models/Token");

const authMiddleware = async (req, res, next) => {
  const accesstoken = req.cookies.AccessToken;
  console.log(req.cookies);
  console.log(req.headers);

  /**
   * 클라이언트 요청의 쿠기에 AccessToken이 존재하지 않는 경우
   * 결과 : 400코드. 다음 미들웨어로 넘어가지 않음.
   */
  if (!accesstoken) {
    return res.status(401).json({
      code: 401,
      msg: "No token provided. Access denied.",
    });
  }

  /**
   * 클라이언트 요청의 쿠키에 AccessToken이 존재하는 경우
   * 결과 : 토큰의 유효성 검사
   */
  jwt.verify(accesstoken, secret, async (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        /**
         * AccessToken이 만료됨.
         * 결과: RefreshToken 확인 진행
         */
        const refreshtoken = req.cookies.RefreshToken;
        let refreshPayload;
        if (!refreshtoken) {
          /**
           * AccessToken 만료, 클라이언트가 RefreshToken 제공하지 않은 경우
           * 결과 : 401코드. 다음 미들웨어로 넘어가지 않음
           */
          return res.status(401).json({
            code: 401,
            msg: "Access token expired and no refresh token provided.",
          });
        } else {
          /**
           * AccessToken 만료, RefreshToken 제공된 경우
           * 결과: RefreshToken 유효성 검사 진행
           */
          refreshPayload = jwt.verify(refreshtoken, secret);
          if (!refreshPayload) {
            /**
             * RefreshToken이 만료되거나 유효하지 않은 경우
             * 결과: 401코드. 다음 미들웨어로 넘어가지 않음
             * 재로그인 요청
             */
            return res
              .status(401)
              .clearCookie("RefreshToken", { path: "/" })
              .clearCookie("AccessToken", { path: "/" })
              .json({
                code: 401,
                msg: "Refresh token expired.",
              });
          }
        }

        /**
         * AccessToken 만료, RefreshToken 유효한 경우
         * 결과: 저장된 RefreshToken과 일치하는지 확인
         */

        const storedRefreshToken = await Token.read(refreshPayload.userid);
        if (storedRefreshToken !== refreshtoken) {
          //결과: 401코드. 다음 미들웨어로 넘어가지 않음
          return res
            .status(401)
            .clearCookie("RefreshToken", { path: "/" })
            .clearCookie("AccessToken", { path: "/" })
            .json({
              code: 401,
              msg: "Refresh token expired or invalid.",
            });
        }

        // 새로운 access token 발급
        const newAccessToken = jwt.sign(refreshPayload, secret, {
          algorithm: "HS256",
        });
        res.clearCookie("AccessToken", { path: "/" });
        res.cookie("AccessToken", newAccessToken, { httpOnly: true });
        console.log("access token update 완료");
        req.user = decoded;
        next();
      } else {
        /**
         * AccessToken이 만료되지 않은 경우. 근데 그외 err 발생
         */
        // const refreshtoken = req.cookies.RefreshToken;
        // const payload = jwt.verify(refresh, secret);
        // if (!payload) {
        //   const newRefreshToken = jwt.sign({ userid: payload.userid }, secret, {
        //     algorithm: "HS256",
        //     expiresIn: "14d",
        //   });

        //   await Token.update(payload.userid, newRefreshToken);
        //   console.log("token update 완료");
        //   res.cookie("RefreshToken", newRefreshToken, { httpOnly: true });
        // }
        // req.user = decoded;
        // next();

        return res
          .status(401)
          .clearCookie("RefreshToken", { path: "/" })
          .clearCookie("AccessToken", { path: "/" })
          .json({
            code: 401,
            msg: "AccessToken Error: " + err,
          });
      }
      return res
        .status(401)
        .clearCookie("RefreshToken", { path: "/" })
        .clearCookie("AccessToken", { path: "/" })
        .json({
          code: 401,
          msg: "Failed to authenticate token.",
        });
    }
    /**
     * AccessToken 유효
     */
    req.user = decoded;
    next();
  });
};

module.exports = authMiddleware;
