//로직 작성 
const router = require("express").Router()
const maria = require('../../config/database')

/**
 * @swagger
 * paths:
 *  /user/users:
 *    get:
 *      summary: "유저 데이터 전체조회"
 *      description: "서버에 데이터를 보내지 않고 Get방식으로 요청"
 *      tags: [Users]
 *      responses:
 *        "200":
 *          description: 전체 유저 정보
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    ok:
 *                      type: boolean
 *                    users:
 *                      type: object
 *                      example:
 *                          [
 *                            { "id": 1, "name": "유저1" },
 *                            { "id": 2, "name": "유저2" },
 *                            { "id": 3, "name": "유저3" },
 *                          ]
 */
router.get("/users", function(req,res){
    maria.query('SELECT * FROM user WHERE userid=1',function(err,rows,fields){
        if(!err){
            res.send(rows);
        }else{
            console.log("err : "+ err);
            res.send(err);
        }
    });
});

module.exports = router;