//db 설정 
const maria = require('mysql');
require('dotenv').config();

const pool = maria.createConnection({
  host: 'localhost',
  port: 3307,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

});

module.exports = pool;