//express
const express = require("express");
//cors
const cors = require("cors");
//swagger 설정
const { swaggerUi, specs } = require("./config/swagger");
//env
const dotenv = require("dotenv");
const PORT = 4000;
const path = require("path");
//express 사용
const app = express();
const User = require("./models/User");
const Post = require("./models/Post");
const File = require("./models/File");
const adminRouter = require("./routes/User");
const postRouter = require("./routes/Post");
const upload = require("./config/storage").upload;
const imageUploadMulter = require("./config/storage").imageUpload;
dotenv.config();
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
const cookieParser = require("cookie-parser");
const authMiddleware = require("./middleware/authMiddleware");
const session = require("express-session");
const FileStore = require("session-file-store")(session);

app.use(cookieParser());
app.use(
  session({
    store: new FileStore({
      path: "./sessions", // 세션 파일을 저장할 경로
      ttl: 600, // 세션 만료 시간 (초)
    }),
    secret: "Kkb5I86s3B",
    resave: false,
    saveUninitalized: true,
    cookie: { secure: false },
  })
);
app.use(express.urlencoded({ extended: true }));

//swagger
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.use("/", adminRouter);
app.use("/posts", postRouter);

app.get("/uploads/:imageUrl", (req, res) => {
  const imageUrl = req.params.imageUrl;
  File.read(imageUrl, res);
});
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
app.post(
  "/posts/edit",
  authMiddleware,
  upload.fields([{ name: "files" }, { name: "thumbnail" }]),
  (req, res) => {
    console.log("create");
    Post.create(req, res);
  }
);

app.post(
  "/posts/upload",
  // authMiddleware,
  imageUploadMulter.single("image"),
  (req, res) => {
    File.imageUpload(req, res);
  }
);
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
app.delete("/posts/:postid", authMiddleware, (req, res) => {
  Post.delete(req, res);
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
app.post(
  "/posts/detail/:postid",
  authMiddleware,
  upload.fields([{ name: "files" }, { name: "thumbnail" }]),
  (req, res) => {
    console.log("/posts/detail/:postid post update 호출");
    Post.update(req, res);
  }
);

/**
 * @swagger
 * paths:
 *  /posts/{postid}/{filename}:
 *    get:
 *      summary: "파일 다운로드"
 *      description: "파일 다운로드"
 *      tags: [File]
 *      parameters:
 *      - in: path
 *        name: postid
 *        required: true
 *        description: 게시물 아이디
 *        schema:
 *          type: integer
 *      - in: path
 *        name: filename
 *        required: true
 *        description: 파일 이름
 *        schema:
 *          type: string
 *      responses:
 *        200:
 *          description: 파일 다운로드
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  url:
 *                    type: string
 */
app.get("/posts/:postid/:filename", authMiddleware, (req, res) => {
  File.downloadFiles(req, res);
});

app.listen(PORT, () => {
  console.log(`${PORT}번에서 실행이 되었습니다.`);
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
// app.get("/posts/detail/:postid", authMiddleware, (req, res) => {
//   Post.read(req, res);
// });

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
// app.get("/posts/:option", authMiddleware, (req, res) => {
//   Post.readOption(req, res);
// });

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
// app.get("/posts", authMiddleware, (req, res) => {
//   Post.readAll(req, res);
// });
