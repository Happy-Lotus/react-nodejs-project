//로직 작성
const router = require("express").Router();
const maria = require("../../config/database");
const User = require("../../models/User");
const bcrypt = require("bcryptjs")
const jwt = require('../../config/jwt')
const dotenv = require("dotenv");
dotenv.config();
const {JWT_SECRET} = process.env

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
 *                  code:
 *                    type: integer
 *                  user:
 *                    type: object
 *                    example: [{"id":1, "pwd":"1234","token":"adsfasdfwefn"}]
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
  const {email,pwd}= req.body
  try {
    // 데이터베이스에서 사용자 찾기
    await maria.query('SELECT * FROM user WHERE email='+'\''+email+'\'',async (err,rows) =>{
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).send('Server error');
      }

      const user = rows;

      //비밀번호 확인
      // const isPasswordValid = await bcrypt.compare(pwd, user.pwd);
      const isPasswordValid = await bcrypt.compare(pwd, "test2test");

      if (!true) {
        return res.status(401).send('Authentication failed');
      }else{
        const accessToken = jwt.sign(user)
        const refreshToken = jwt.refresh()

        if(!refreshToken){
          const sql = 'UPDATE token SET token='+refreshToken+' WHERE userid='+user.userid;
          maria.query(sql)
        
        }
      }

      const token = jwt.sign({
        email,
        nickname: user.nickname
      },""+JWT_SECRET,{
        expiresIn: '10m'
      });
      // 로그인 성공
      // 여기에 세션 생성 또는 JWT 토큰 생성 로직을 추가할 수 있습니다.
      res.status(200).json({
        message: '로그인 성공',
        user: {
          id: user.email,
          email: user.email,
          token,
        }
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류" });
  }
});

router.get("/", async (req, res, next) => {});

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
router.post("/sign-up", async (req, res, next) => {
  try {
    const { email, password, nickname } = req.body;

    const [existingUser] = await maria.query(
      "SELECT * FROM user WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "이미 존재하는 이메일입니다." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 인증 토큰 생성
    const verificationToken = crypto.randomBytes(20).toString("hex");

    // 사용자 정보 임시 저장
    await maria.query(
      "INSERT INTO users (email, password, nickname, verification_token, is_verified) VALUES (?, ?, ?, ?, ?)",
      [email, hashedPassword, nickname, verificationToken, false]
    );

    // 인증 이메일 발송
    const verificationLink = `http://yourdomain.com/verify/${verificationToken}`;
    const mailOptions = {
      from: "your-email@gmail.com",
      to: email,
      subject: "이메일 인증",
      html: `<p>회원가입을 완료하려면 다음 링크를 클릭하세요: <a href="${verificationLink}">${verificationLink}</a></p>`,
    };

    await transporter.sendMail(mailOptions);

    res
      .status(201)
      .json({
        message: "회원가입 성공. 이메일을 확인하여 인증을 완료해주세요.",
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류" });
  }
});

router.get("/sign-up", async (req, res, next) => {});

router.get("verify-email", async (req, res) => {
  const email = req.query.email;
  const token = req.query.token;

  const verifyToken = await verifyUser(token);
});

module.exports = router;
