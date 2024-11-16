const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin");
const authMiddleware = require("../middleware/authMiddleware");

/*회원가입*/
router.post("/register", adminController.register);

/* 사용자 인증코드 확인*/
router.post("/verify-email", adminController.verifyEmail);

/*사용자 이메일 인증코드 생성*/
router.post("/generateCode", adminController.generateCode);

/* 사용자 로그인*/
router.post("/login", adminController.login);

/* 사용자 로그아웃*/
router.post("/logout", authMiddleware, adminController.logout);

/**사용자 닉네임 중복 확인 */
router.post("/checkNickname", adminController.checkNickname);

module.exports = router;
