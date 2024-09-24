//express
const express = require("express");
const path = require("path");
//cors
const cors = require("cors");
//swagger 설정
const { swaggerUi, specs } = require("./config/swagger");
const PORT = 4000;
//env
const dotenv = require("dotenv");
//express 사용
const app = express();
const user = require("./routes/user/users");
const common = require("./routes/common/common");

const maria = require("./config/database");
maria.connect();
dotenv.config();

app.use(cors());
app.use(express.json());

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
app.use("/user", user);

// /**
//  * @swagger
//  * tags:
//  *   name: Board
//  *   description: 게시판 글 조회, 추가, 수정, 삭제
//  */
// router.use("/board",board)

/**
 * @swagger
 * tags:
 *   name: Common
 *   description: 로그인 회원가입
 */
app.use("/", common);

// db user 데이터 전체 읽기
//  app.get('/test-db', async (req, res) => {
//     maria.query('select * from user',function(err,rows,fields){
//       if(!err){
//         console.log(rows);
//         res.send(rows)
//       }else{
//         console.log("err : "+err);
//       }
//     })
//   });

//   app.get('/users', async (req, res) => {
//     try {
//       const [rows] = await db.query('SELECT * FROM users');
//       res.json(rows);
//     } catch (error) {
//       console.error('Error fetching users:', error);
//       res.status(500).json({ message: 'Error fetching users' });
//     }
//   });

//   app.post('/users', async (req, res) => {
//     const { name, email } = req.body;
//     try {
//       const [result] = await db.query(
//         'INSERT INTO users (name, email) VALUES (?, ?)',
//         [name, email]
//       );
//       res.json({ message: 'User created', userId: result.insertId });
//     } catch (error) {
//       console.error('Error creating user:', error);
//       res.status(500).json({ message: 'Error creating user' });
//     }
//   });

app.listen(PORT, () => {
  console.log(`${PORT}번에서 실행이 되었습니다.`);
});
