const maria = require('mysql')
const conn = require('../config/database')
const moment = require('moment')

// 파일 생성
exports.create = async function(boardId,fileData){

    const {filename, filepath, filesize, filetype} = fileData;

    try{

        const sql = 'INSERT INTO file (filename, filepath, uploadtime, filesize, filetype, boardid) VALUES (?, ?, ?, ?, ?, ?)'
        const now = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        const var_array = [filename,filepath,now,filesize,filetype,boardId];

        conn.query(sql,var_array,(error,results) => {
            if(error){
                console.error('Database error: ',error);
            }else{
                console.log("File created successfully");
            }
        });

    }catch(error){
        console.error('Error: ',error);
    }
}

// 파일 조회
exports.readOption  = async function(boardId) {
    try{

        const sql = 'SELECT filename, filepath, filesize FROM file WHERE boardid = ? ORDER BY uploadtime ASC';
        return new Promise((resolve, reject) => { 
            conn.query(sql, boardId, (error, results) => {
                if (error) {
                    console.error('Database error: ', error);
                    reject(error); 
                } else {
                    resolve(results); 
                }
            });
        });
    }catch(error){
        console.error('Error: ',error);
    }
}

// 파일 삭제
exports.delete = async function(fileid){

    try{
        const sql ='DELETE FROM file WHERE fileid = ?';

        conn.query(sql,fileid,(error,results) => {
            if(error){
                console.error('Database error: ',error);
            }else{
                console.log('File delete');
            }
        });
    }catch(error){
        console.error('Error: ',error);
    }
}