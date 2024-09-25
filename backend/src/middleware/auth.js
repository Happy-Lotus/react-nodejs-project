const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({
      code: 403,
      msg: "No token provided. Access denied.",
    });
  }

  // 토큰 검증
  jwt.verify(token, "your-secret-key", (err, decoded) => {
    if (err) {
      return res.status(401).json({
        code: 401,
        msg: "Failed to authenticate token.",
      });
    }

    // 토큰이 유효하면 다음으로 넘어감
    req.user = decoded;
    next();
  });
};

module.exports = authMiddleware;
