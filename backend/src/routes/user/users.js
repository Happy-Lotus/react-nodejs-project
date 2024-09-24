//로직 작성
const router = require("express").Router();
const maria = require("../../config/database");

/**
 * @swagger
 * paths:
 *  /user/users:
 *    get:
 *      summary: "유저 데이터 전체 조회"
 *      description: "서버에 데이터를 보내지 않고 Get 방식으로 요청"
 *      tags: [User]
 *      responses:
 *        200:
 *          description: 전체 유저 정보
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
router.get("/users", async (req, res, next) => {
  // maria.query('SELECT * FROM user WHERE userid=1',function(err,rows,fields){
  //     if(!err){
  //         res.send(rows);
  //     }else{
  //         console.log("err : "+ err);
  //         res.send(err);
  //     }
  // });
});

module.exports = router;
