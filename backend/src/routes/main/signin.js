//로직 작성 
const router = require('express').Router;
const maria = require('../../config/database')


router.post("/",async (req,res,next) => {
    try{
        

    }catch(error){
        next(error)
    }
})

module.exports=router;