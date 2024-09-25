//로직 작성
const router = require("express").Router();
const maria = require("../../config/database");

/**
 * @swagger
 * paths:
 *  /board/posts:
 *    get:
 *      summary: "게시물 전체 조회"
 *      description: "게시물 목록"
 *      tags: [board]
 *      responses:
 *        200:
 *          description: 전체 게시물 정보
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
 */
router.get("/posts", async (req, res, next) => {
  maria.query('SELECT * FROM board',function(err,rows,fields){
      if(!err){
          res.send(rows);
      }else{
          console.log("err : "+ err);
          res.send(err);
      }
  });
});

/**
 * @swagger
 * paths:
 *  /board/posts?title={title}:
 *    get:
 *      summary: "특정 제목조회 Query 방식"
 *      description: "요청 경로에 값을 담아 서버에 보냄"
 *      tags: [board]
 *      parameters:
 *       - in: query
 *         name: title
 *         required: true
 *         description: 게시물 제목
 *         schema:
 *          type: string
 *      responses:
 *        200:
 *          description: 전체 게시물 정보
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
 */
router.get("/posts/:title", async (req, res, next) => {
  const title = req.query.title;
  console.log(title)

  maria.query('SELECT * FROM board WHERE title='+'\''+title+'\'',function(err,rows,fields){
      if(!err){
          res.send(rows);
      }else{
          console.log("err : "+ err);
          res.send(err);
      }
  });
});





module.exports = router;
