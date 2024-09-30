const maria = require('mysql')
const conn = require('../config/database')
const File = require('./File');
const moment = require('moment')
const multer = require('multer')
const fs = require('fs')

//게시물 생성
exports.create = async function(req,res){

    const {title, content, writer, email} = req.body.board[0]

    try{

        const sql1 ='INSERT INTO board (title, content, writer, regdate, moddate, userid) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const now = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        const var_array1 = [title, content, writer, now, now, email];


        conn.query(sql1,var_array1,(error,results) => {
            if(error){
                console.error('Database error: ',error);
                return res.status(500).json({ result: "Database error:" + email});
            }else{
                if(results.affectedRows > 0){

                    if(req.body.file[0].length > 0){
                        const file = req.body.file[0];
                        try{
                            const boardId = results.insertId;
                            File.create(boardId,file);
                            return res.status(201).json({result: "File and Post upload OK"});
                        }catch(error){
                            console.error('File upload error: ',error);
                            return res.status(500).json({result: "File upload error"});
                        }
                    }else{
                        return res.status(201).json({result: "Post created successfully"});
                    }
                }else{
                    return res.status(400).json({result : "Error"})
                }
            }
        });

    }catch(error){
        console.error('Error: ',error);
        return res.status(500).json({ result: "Server error:"}); 
    }
}

//게시물 전체 조회(글 목록)
exports.readAll = async function(req,res){

    try{
        const sql = 'SELECT boardid, title, content, writer, regdate, isfile FROM board'

        conn.query(sql,(error,results) => {
            if(error){
                console.error('Database error: ',error);
                return res.status(500).json({ result: "Database error"});
            }else{
                //이미지 썸네일 전달 필요 
                if(results){
                    return res.status(201).json(results);
                }else{
                    return res.status(400).json({result : "Error"})
                }
            }
        })
    }catch(error){
        console.error('Error: ',error);
        return res.status(500).json({ result: "Server error:"}); 
    }
}

//게시물 옵션 조회
exports.readOption = async function(req,res){
    const option = req.params.option;
    const content = req.query.content;
    let sql;


    try{
        if(option === 'title') {
            sql =  `SELECT * FROM board WHERE title LIKE '%${content}%'`;
        } else{
            sql =  `SELECT * FROM board WHERE content LIKE '%${content}%'`;
        }

        conn.query(sql,(error,results) => {
            if(error){
                console.error('Database error: ',error);
                return res.status(500).json({ result: "Database error:" + userid});
            }else{
                if(results){
                    
                    return res.status(201).json(results); 
                }else{
                    return res.status(400).json({result : "Error"})
                }
            }
        })
    }catch(error){
        console.error('Error: ',error);
        return res.status(500).json({ result: "Server error:"}); 
    }
}

//게시물 단일 조회
exports.read = async function(req,res){
    const boardid = req.params.postid;


    try{
        const sql = 'SELECT title, content, writer, regdate, isfile FROM board WHERE boardid = ?';

        
        conn.query(sql,boardid,async (error,results) => {
            if(error){
                console.error('Database error: ',error);
                return res.status(500).json({ result: "Database error:" + boardid});

            }else{
                const file = await File.readOption(boardid);
                return res.status(201).json({board: results, filelist: file});
            }
        })
    }catch(error){
        console.error('Error: ',error);
        return res.status(500).json({ result: "Server error:"}); 
    }

}

//게시물 수정(patch)
exports.update = async function(req,res){
    const {boardid, title, content} = req.body.board[0]

    try{
        const sql1 = 'UPDATE board SET title = ?, content = ? WHERE boardid = ?'
        const var_array = [title, content, boardid]

        conn.query(sql1, var_array, (error,results) => {
            if(error){
                console.error('Database error: ',error);
                return res.status(500).json({ result: "Database error:" + userid});
            }else{
                if(results.affectedRows > 0){

                    const file = req.body.file[0];
             
                    try{
                        if(file.add.length > 0){
                            for(const newFile of file.add){
                                File.create(boardid,newFile)
                            }
                        }

                        if(file.delete.length > 0){
                            for(const oldFile of file.delete){
                                File.delete(oldFile);
                            }
                        }

                        return res.status(201).json({result: "File update OK"});
                    }catch(error){
                        console.error('File upload error: ',error);
                        return res.status(500).json({result: "File upload error"});
                    }
                }else{
                    return res.status(400).json({result : "Error"})
                }
            }
        });
    }catch(error){
        console.error('Error: ',error);
        return res.status(500).json({ result: "Server error:"}); 
    }

}

//게시물 삭제
exports.delete = async function(req,res){    
    const boardid = parseInt(req.params.postid);

    try{
        const sql ='DELETE FROM board WHERE boardid = ?';
        const var_array = [boardid];

        conn.query(sql,var_array,(error,results) => {
            if(error){
                console.error('Database error: ',error);
                return res.status(500).json({ result: "Database error:" + userid});
            }else{
                res.status(201).json({result: "File and Post deleted"});
            }
        });
    }catch(error){
        console.error('Error: ',error);
        return res.status(500).json({ result: "Server error:"}); 
    }
}
