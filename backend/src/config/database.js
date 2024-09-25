//db 설정
const maria = require("mysql");
require("dotenv").config();

const pool = maria.createConnection({
  host: "localhost",
  port: 3307,
  user: "root",
  password: "1234",
  database: "testdb",
});

module.exports = pool;
