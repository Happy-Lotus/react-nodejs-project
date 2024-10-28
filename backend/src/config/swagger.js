//swagger 설정
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();
const URL = process.env.URL;

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Express Service with Swagger",
      version: "1.0.0",
      description: "a Rest api using swagger and express.", // 프로젝트 설명
    },
    servers: [
      {
        url: URL,
      },
    ],
  },
  apis: [
    "./src/*.js",
    "./src/routes/user/*.js",
    "./src/routes/common/*.js",
    "./src/routes/board/*.js",
    "./src/models/*.js",
  ], //Swagger 파일 연동
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
