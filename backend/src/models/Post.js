const { NULL } = require("mysql/lib/protocol/constants/types");
const conn = require("../config/database");
const File = require("./File");
const moment = require("moment");
const { update } = require("./Token");

//게시물 생성
exports.create = async function (postData) {
  const { title, content, writer, userid, thumbnail, files } = postData;

  const sql =
    "INSERT INTO board (title, content, writer, regdate, userid,thumbnail) VALUES (?, ?, ?, ?, ?, ?)";
  const now = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
  const var_array = [title, content, writer, now, userid, thumbnail];
  let fileInfos;

  if (files) {
    fileInfos = files.map((file) => ({
      filename: file.filename,
      originalname: file.originalname,
      size: file.size,
      url: `/uploads/${file.filename}`,
    }));
  }

  console.log(fileInfos);

  return new Promise(async (resolve, reject) => {
    conn.query(sql, var_array, async (error, results) => {
      if (error) {
        return reject({ statusCode: 500, message: error.sqlMessage });
      } else {
        if (results.affectedRows > 0) {
          const boardId = results.insertId;
          if (fileInfos) {
            try {
              await File.create(boardId, fileInfos);
              resolve({ statusCode: 201, message: "File and Post upload OK" });
            } catch (fileError) {
              return reject({
                statusCode: fileError.statusCode,
                message: fileError.message,
              });
            }
          } else {
            resolve({
              statusCode: 201,
              message: "Only Post created successfully",
            });
          }
        } else {
          reject({ statusCode: 404, message: "Request Error" });
        }
      }
    });
  });
};

//게시물 전체 조회(글 목록) => 완료
exports.readAll = async function () {
  const sql =
    "SELECT boardid, title, content, writer, regdate, thumbnail FROM board ORDER BY boardid DESC";
  try {
    return new Promise((resolve, reject) => {
      conn.query(sql, async (error, results) => {
        if (error) {
          return reject({ statusCode: 500, message: error.sqlMessage });
        } else {
          if (results) {
            const list = await Promise.all(
              results.map(async (item) => {
                try {
                  const files = await File.readOption(item.boardid);
                  console.log("files");
                  console.log(files);
                  return {
                    post: {
                      boardid: item.boardid,
                      title: item.title,
                      content: item.content,
                      writer: item.writer,
                      regdate: item.regdate,
                      thumbnail: item.thumbnail,
                    },
                    files: files,
                  };
                } catch (fileError) {
                  return reject({
                    statusCode: fileError.statusCode,
                    message: fileError.message,
                  });
                }
              })
            );

            console.log(list);
            resolve({
              statusCode: 201,
              message: "게시물 전체 조회 성공",
              postData: list,
            });
          } else {
            resolve({ statusCode: 400, message: "데이터 없음" });
          }
        }
      });
    });
  } catch (error) {
    console.error("Error: ", error);
    throw new Error("서버 오류");
  }
};

//게시물 단일 조회 => 완료
exports.read = async function (boardid) {
  const sql =
    "SELECT title, content, writer, regdate, thumbnail FROM board WHERE boardid = ?";

  return new Promise((resolve, reject) => {
    conn.query(sql, boardid, async (error, results) => {
      if (error) {
        return reject({ statusCode: 500, message: error.sqlMessage });
      } else if (results.length === 0) {
        return reject({ statusCode: 404, message: "게시물이 없습니다." });
      } else {
        const post = results[0];
        try {
          const files = await File.readOption(boardid);
          resolve({
            statusCode: 201,
            message: "게시물 데이터 조회 성공",
            postData: {
              post: {
                boardid: boardid,
                title: post.title,
                content: post.content,
                writer: post.writer,
                regdate: post.regdate,
                thumbnail: post.thumbnail,
              },
              files: files,
            },
          });
        } catch (fileError) {
          reject({
            statusCode: fileError.statusCode || 500,
            message: fileError.message || "파일 조회 오류",
          });
        }
      }
    });
  });
};

exports.readByBoardId = async function (boardid) {
  try {
    const sql = "SELECT title, content, thumbnail FROM board WHERE boardid = ?";
    return new Promise((resolve, reject) => {
      conn.query(sql, boardid, (error, results) => {
        if (error) {
          console.error("Database error: ", error);
          reject(error);
        } else {
          resolve(results[0]);
        }
      });
    });
  } catch (error) {
    console.error("Error: ", error);
  }
};

//게시물 수정(post)
exports.update = async function (req, res) {
  const boardid = req.params.postid;
  const { title, content, thumbnail } = JSON.parse(req.body.board);
  console.log(req.body.updateFiles);

  const existThumbnail = await this.readByBoardId(boardid).then((result) => {
    result.thumbnail;
  });

  let changeThumbnail =
    typeof req.files.thumbnail !== "undefined"
      ? `${req.files.thumbnail[0].destination}${req.files.thumbnail[0].filename}`
      : "";

  changeThumbnail = await changeThumbnailImg(
    existThumbnail,
    changeThumbnail,
    thumbnail
  );

  const add = req.files.files;

  try {
    const sql =
      "UPDATE board SET title = ?, content = ?, thumbnail = ? WHERE boardid = ?";
    const var_array = [title, content, changeThumbnail, boardid];

    conn.query(sql, var_array, (error, results) => {
      if (error) {
        console.error("Database error: ", error);
        return res.status(500).json({ result: "Database error:" + userid });
      } else {
        if (results.affectedRows > 0) {
          console.log("updateFiles");
          console.log(req.body.updateFiles);
          const updateFiles =
            typeof req.body.updateFiles !== "undefined"
              ? JSON.parse(JSON.parse(req.body.updateFiles).updateFiles)
              : [];

          try {
            if (add && add.length > 0) {
              let fileInfos;

              if (add) {
                fileInfos = add.map((file) => ({
                  filename: file.filename,
                  originalname: file.originalname,
                  size: file.size,
                  url: `/uploads/${file.filename}`,
                }));
              }
              File.create(boardid, fileInfos);
            }

            if (updateFiles.length > 0) {
              let fileInfos;
              fileInfos = updateFiles.map((filename) => ({
                file: { filename: filename },
              }));

              // for (const oldFile of fileInfos) {
              //   File.delete(oldFile[0]);
              // }
              fileInfos.forEach((fileInfo) => {
                File.delete(fileInfo.file);
              });
              File.deleteAttachedFiles(
                fileInfos.map((fileInfo) => fileInfo.file)
              );
            }

            return res.status(201).json({ result: "File update OK" });
          } catch (error) {
            console.error("File upload error: ", error);
            return res.status(500).json({ result: "File upload error" });
          }
        } else {
          return res.status(400).json({ result: error });
        }
      }
    });
  } catch (error) {
    console.error("Error: ", error);
    return res.status(500).json({ result: "Server error:" });
  }
};

//게시물 삭제
exports.delete = async function (req, res) {
  const boardid = parseInt(req.params.postid);
  const sql = "DELETE FROM board WHERE boardid = ?";
  const var_array = [boardid];

  try {
    const post = await this.readByBoardId(boardid);
    console.log(post);
    if (!post) {
      return res.status(404).json({ result: "Post not found." });
    }

    const content = post.content;
    const thumbnail = post.thumbnail;
    const imageUrls = extractImageUrls(content);
    const deletePromises = [];
    if (imageUrls.length > 0 && imageUrls) {
      deletePromises.push(File.deleteFiles(imageUrls));
    }
    if (thumbnail && thumbnail.trim() !== "") {
      deletePromises.push(File.deleteThumbnail(thumbnail));
    }
    File.readOption(boardid).then((files) =>
      deletePromises.push(File.deleteAttachedFiles(files))
    );

    // 모든 작업이 완료될 때까지 대기
    await Promise.all(deletePromises);
    await new Promise((resolve, reject) => {
      conn.query(sql, var_array, (error, results) => {
        if (error) {
          console.error("Database error: ", error);
          return reject(new Error("Database error: " + error.message));
        }
        resolve(results);
      });
    });

    res
      .status(200)
      .json({ result: "Post and associated files deleted successfully." });
  } catch (error) {
    console.error("Error: ", error);
    return res.status(500).json({ result: "Server error:" });
  }
};

const extractImageUrls = (content) => {
  const regex = /<img[^>]+src="([^">]+)"/g; // <img> 태그에서 src 속성 추출
  const urls = [];
  let match;

  while ((match = regex.exec(content)) !== null) {
    urls.push(match[1]); // URL 추가
  }
  return urls;
};

const changeThumbnailImg = async (
  existThumbnail,
  changeThumbnail,
  thumbnail
) => {
  if (existThumbnail && existThumbnail.trim() !== "") {
    // 기존 썸네일이 존재하는 경우
    if (thumbnail === existThumbnail) {
      // 1. 이미 썸네일이 있고 다른 이미지로 변경하지 않는 경우
      return existThumbnail;
    } else if (changeThumbnail.trim() !== "") {
      // 2. 이미 썸네일이 있는데 다른 이미지로 변경하는 경우
      await File.deleteThumbnail(existThumbnail);
      console.log("Deleted existing thumbnail:", existThumbnail);
      return changeThumbnail;
    } else {
      // 3. 이미 썸네일이 있는데 삭제하는 경우
      await File.deleteThumbnail(existThumbnail);
      console.log("Deleted existing thumbnail:", existThumbnail);
      return "";
    }
  } else if (changeThumbnail.trim() !== "") {
    // 4. 썸네일 없는데 새로 추가하려는 경우
    console.log("Adding new thumbnail:", changeThumbnail);
    return changeThumbnail;
  }
};

// //게시물 옵션 조회
// exports.readOption = async function (option, content) {
//   const sql = `SELECT * FROM board WHERE ${option} LIKE '%${content}%'`;

//   try {
//     return new Promise((resolve, reject) => {
//       conn.query(sql, (error, results) => {
//         if (error) {
//           return reject({ statusCode: 500, message: error.sqlMessage });
//         } else if (results.length === 0) {
//           return reject({ statusCode: 404, message: "게시물이 없습니다." });
//         }
//         resolve({
//           statusCode: 201,
//           message: `게시물 ${option} 조회 성공`,
//           post: {
//             boardid: boardid,
//             title: results[0].title,
//             content: results[0].content,
//             writer: results[0].writer,
//             regdate: results[0].regdate,
//             thumbnail: results[0].thumbnail,
//           },
//         });
//       });
//     });
//   } catch (error) {
//     throw new Error("서버 오류");
//   }
// };
