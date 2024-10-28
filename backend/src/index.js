//express
const express = require("express");
//cors
const cors = require("cors");
//swagger 설정
const { swaggerUi, specs } = require("./config/swagger");
//env
const dotenv = require("dotenv");
const path = require("path");
//express 사용
const app = express();
const adminRouter = require("./routes/User");
const postRouter = require("./routes/Post");
dotenv.config();
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
const cookieParser = require("cookie-parser");
const session = require("express-session");
const FileStore = require("session-file-store")(session);

const SECRET_KEY = process.env.SECRET_KEY;
const PORT = process.env.PORT;
app.use(cookieParser());
app.use(
  session({
    store: new FileStore({
      path: "./sessions", // 세션 파일을 저장할 경로
      reapInterval: 60, // 세션 만료 시간 (초)
    }),
    secret: SECRET_KEY,
    resave: false,
    saveUninitalized: true,
    cookie: { secure: false },
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//swagger
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.use("/", adminRouter);
app.use("/posts", postRouter);

app.listen(PORT, () => {
  console.log(`${PORT}번에서 실행이 되었습니다.`);
});
