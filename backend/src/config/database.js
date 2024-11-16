//db 설정
const maria = require("mysql");
const dotenv = require("dotenv");
dotenv.config();

const DB_USER = process.env.DB_USER;
const DB_PORT = process.env.DB_PORT;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

const pool = maria.createConnection({
  host: "localhost",
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  timezone: "Asia/Seoul",
  dateStrings: true,
  charset: "utf8mb4",
});

module.exports = pool;
