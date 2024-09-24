//로직 작성
const router = require("express").Router();
const maria = require("../../config/database");

/**
 * @swagger
 * paths:
 *  /:
 *    post:
 *      summary: "로그인 화면"
 *      description: "email, pwd 이용해 사용자 로그인"
 *      tags: [Common]
 *      requestBody:
 *          description: email, pwd JSON 데이터
 *          required: true
 *          content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                   id:
 *                     type: string
 *                     description: "유저 이메일"
 *                   pwd:
 *                     type: string
 *                     description: "유저 비밀번호"
 *      responses:
 *        200:
 *          description: 로그인 성공
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  code:
 *                    type: integer
 *                  user:
 *                    type: object
 *                    example: [{"id":1, "nickname":"유저1"}]
 *        400:
 *          description: Bad Request
 *          content:
 *            application/json:
 *              schema:
 *                type: integer
 *        404:
 *          description: Not Found
 *          content:
 *            application/json:
 *              schema:
 *                type: integer
 *        500:
 *          description: Server Error
 *          content:
 *            application/json:
 *              schema:
 *                type: integer
 */
router.post("/", async (req, res, next) => {
  // maria.query('SELECT * FROM user WHERE userid=1',function(err,rows,fields){
  //     if(!err){
  //         res.send(rows);
  //     }else{
  //         console.log("err : "+ err);
  //         res.send(err);
  //     }
  // });
});

/**
 * @swagger
 * paths:
 *  /sign-up:
 *    post:
 *      summary: "회원가입"
 *      description: "email, pwd, nickname 입력받아 회원가입"
 *      tags: [Common]
 *      requestBody:
 *          description: email, pwd, nickname JSON 데이터
 *          required: true
 *          content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                   id:
 *                     type: string
 *                     description: "유저 이메일"
 *                   pwd:
 *                     type: string
 *                     description: "유저 비밀번호"
 *                   nickname:
 *                     type: string
 *                     description: "유저 닉네임"
 *      responses:
 *        200:
 *          description: 회원가입 성공
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  code:
 *                    type: integer
 *                  data:
 *                    type: object
 *                  msg:
 *                      type: string
 *        400:
 *          description: Bad Request
 *          content:
 *            application/json:
 *              schema:
 *                type: integer
 *        404:
 *          description: Not Found
 *          content:
 *            application/json:
 *              schema:
 *                type: integer
 *        500:
 *          description: Server Error
 *          content:
 *            application/json:
 *              schema:
 *                type: integer
 */
router.post("/sign-up", async (req, res, next) => {});

module.exports = router;
