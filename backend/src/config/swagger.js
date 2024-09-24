//swagger 설정
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();

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
        url: `http://localhost:${process.env.PORT}`,
      },
    ],
  },
  apis: [
    "./src/*.js",
    "./src/routes/user/*.js",
    "./src/routes/common/*.js",
    "./src/models/*.js",
  ], //Swagger 파일 연동
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
