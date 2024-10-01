//express
const express = require("express");
//cors
const cors = require("cors");
//swagger 설정
const { swaggerUi, specs } = require("./config/swagger");
//env
const dotenv = require("dotenv");
const PORT = 4000;
//express 사용
const app = express();
// const user = require("./routes/user/users");
const User = require("./models/User");
const Post = require("./models/Post");
dotenv.config();
app.use(cors());
app.use(express.json());
const cookieParser = require("cookie-parser");
app.use(cookieParser());
//swagger
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

/**
 * @swagger
 * tags:
 *   name: User
 *   description: 유저 추가 수정 삭제 조회
 */
// app.use("/user", user);

//게시물 작성
/**
 * @swagger
 * paths:
 *  /posts/edit:
 *    post:
 *      summary: "게시물 작성"
 *      description: "게시물 작성"
 *      tags: [Post]
 *      requestBody:
 *        description: 게시물 데이터
 *        required: true
 *        content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                   board:
 *                     type: object
 *                     example: [{
 *                       "title":"공지사항",
 *                       "content":"중요공지사항",
 *                       "writer":"관리자",
 *                       "userid":"aaa@example.com"
 *                     }]
 *                   file:
 *                     type: object
 *                     example: [{
 *                       "filename":"공지사항.pdf",
 *                       "filepath":"src/pdf",
 *                       "filesize": 4,
 *                       "filetype": "pdf"
 *                     }]
 *      responses:
 *        201:
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                  result: string
 *        400:
 *          description: Not Found
 *          content:
 *           application/json:
 *             schema:
 *              msg: string
 *        500:
 *          description: Server Error
 *          content:
 *           application/json:
 *             schema:
 *              msg: string
 */
app.post("/posts/edit", (req, res) => {
  Post.create(req, res);
});

//게시물 삭제
/**
 * @swagger
 * paths:
 *  /posts/{postid}:
 *    delete:
 *      summary: "게시물 삭제"
 *      description: "게시물 삭제"
 *      tags: [Post]
 *      parameters:
 *      - in: path
 *        name: postid
 *        required: true
 *        description: 아이디
 *        schema:
 *          type: integer
 *      responses:
 *        201:
 *          description: 게시물 삭제
 *          content:
 *            application/json:
 *              schema:
 *               result: string
 *        400:
 *          description: Not Found
 *          content:
 *           application/json:
 *             schema:
 *              result: string
 *        500:
 *          description: Server Error
 *          content:
 *           application/json:
 *             schema:
 *              result: string
 */
app.delete("/posts/:postid", (req, res) => {
  Post.delete(req, res);
});

//게시물 상세 조회
/**
 * @swagger
 * paths:
 *  /posts/detail/{postid}:
 *    get:
 *      summary: "게시물 상세 조회"
 *      description: "특정 게시물 조회 "
 *      tags: [Post]
 *      parameters:
 *      - in: path
 *        name: postid
 *        required: true
 *        description: 테이블 아이디
 *        schema:
 *          type: integer
 *      responses:
 *        201:
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                  list:
 *                   type: object
 *        400:
 *          description: Not Found
 *          content:
 *           application/json:
 *             schema:
 *              msg: string
 *        500:
 *          description: Server Error
 *          content:
 *           application/json:
 *             schema:
 *              msg: string
 */
app.get("/posts/detail/:postid", (req, res) => {
  Post.read(req, res);
});

//특정 게시물 옵션 조회
/**
 * @swagger
 * paths:
 *  /posts/{option}:
 *    get:
 *      summary: "특정 게시물 조회"
 *      description: "특정 게시물 조회 "
 *      tags: [Post]
 *      parameters:
 *      - in: path
 *        name: option
 *        required: true
 *        description: 검색 조건
 *        schema:
 *          type: string
 *      - in: query
 *        name: content
 *        required: true
 *        description: 검색 내용
 *        schema:
 *          type: string
 *      responses:
 *        201:
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                  list:
 *                   type: object
 *        400:
 *          description: Not Found
 *          content:
 *           application/json:
 *             schema:
 *              msg: string
 *        500:
 *          description: Server Error
 *          content:
 *           application/json:
 *             schema:
 *              msg: string
 */
app.get("/posts/:option", (req, res) => {
  Post.readOption(req, res);
});

//게시물 전체 조회
/**
 * @swagger
 * paths:
 *  /posts:
 *    get:
 *      summary: "게시물 전체 조회"
 *      description: "게시물 목록"
 *      tags: [Post]
 *      responses:
 *        200:
 *          description: 전체 게시물 정보
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  results:
 *                    type: object
 */
app.get("/posts", (req, res) => {
  Post.readAll(req, res);
});

//게시물 수정
/**
 * @swagger
 * paths:
 *  /posts/detail/{postid}:
 *    patch:
 *      summary: "게시물 수정"
 *      description: "게시물 수정"
 *      tags: [Post]
 *      requestBody:
 *        description: 게시물 변경 데이터
 *        required: true
 *        content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                   board:
 *                     type: object
 *                     example: [{
 *                       "boardid":1,
 *                       "title":"공지사항",
 *                       "content":"중요공지사항",
 *                     }]
 *                   file:
 *                     type: object
 *                     example: [{
 *                        "newFile":[],
 *                        "oldFile":[]
 *                     }]
 *      responses:
 *        201:
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                  result: string
 *        400:
 *          description: Not Found
 *          content:
 *           application/json:
 *             schema:
 *              msg: string
 *        500:
 *          description: Server Error
 *          content:
 *           application/json:
 *             schema:
 *              msg: string
 */
app.patch("/posts/detail/:postid", (req, res) => {
  Post.update(req, res);
});

//사용자 로그인
/**
 * @swagger
 * paths:
 *  /login:
 *    post:
 *      summary: "사용자 로그인"
 *      description: "email, pwd 이용해 사용자 로그인"
 *      tags: [User]
 *      requestBody:
 *          description: email, pwd
 *          required: true
 *          content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                   email:
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
 *                  email:
 *                    type: string
 *                  nickname:
 *                    type: string
 *        400:
 *          description: Password mismatch
 *          content:
 *            application/json:
 *              schema:
 *                result: string
 *        500:
 *          description: Server Error
 *          content:
 *            application/json:
 *              schema:
 *                result: string
 */
app.post("/login", (req, res) => {
  User.login(req, res);
});

app.post("/logout", (req, res) => {
  User.logout(req, res);
});

//사용자 회원가입

/**
 * @swagger
 * paths:
 *  /register:
 *    post:
 *      summary: "사용자 회원가입"
 *      description: "사용자 회원가입"
 *      tags: [User]
 *      requestBody:
 *        description: email, pwd, nickname, name 이용해 회원가입
 *        required: true
 *        content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    email:
 *                      type: string
 *                      description: "유저 이메일"
 *                    pwd:
 *                      type: string
 *                      description: "유저 비밀번호"
 *                    nickname:
 *                      type: string
 *                      description: "유저 닉네임"
 *                    name:
 *                      type: string
 *                      description: "유저이름"
 *      responses:
 *        201:
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                  result: string
 *        400:
 *          description: Not Found
 *          content:
 *           application/json:
 *             schema:
 *              msg: string
 *        500:
 *          description: Server Error
 *          content:
 *           application/json:
 *             schema:
 *              msg: string
 */
app.post("/register", (req, res) => {
  User.register(req, res);
});

app.post("/verify-email", (req, res) => {
  User.verifyEmail(req, res);
});
/**
 * @swagger
 * tags:
 *   name: Common
 *   description: 로그인 회원가입
 */
// app.use("/", common);

app.listen(PORT, () => {
  console.log(`${PORT}번에서 실행이 되었습니다.`);
});
