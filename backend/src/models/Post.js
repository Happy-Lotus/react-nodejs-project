const conn = require("../config/database");
const File = require("./File");
const moment = require("moment");

//게시물 생성
exports.create = async function (req, res) {
  try {
    const { title, content, writer } = JSON.parse(req.body.board);
    const { email, userid } = req.user;
    const files = req.files.files;
    const thumbnail = req.files.thumbnail
      ? `${req.files.thumbnail[0].destination}${req.files.thumbnail[0].filename}`
      : "";

    const sql =
      "INSERT INTO board (title, content, writer, regdate, userid,thumbnail) VALUES (?, ?, ?, ?, ?, ?)";
    const now = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
    const var_array = [title, content, writer, now, userid, thumbnail];
    let fileInfos;
    console.log(fileInfos);

    if (files) {
      fileInfos = files.map((file) => ({
        filename: file.filename,
        originalname: file.originalname,
        size: file.size,
        url: `/uploads/${file.filename}`,
      }));
    }

    console.log(fileInfos);

    conn.query(sql, var_array, (error, results) => {
      if (error) {
        console.error("Database error: ", error);
        return res.status(500).json({ result: "Database error:" + email });
      } else {
        if (results.affectedRows > 0) {
          if (fileInfos) {
            try {
              const boardId = results.insertId;
              if (files) File.create(boardId, fileInfos);
              return res
                .status(201)
                .json({ result: "File and Post upload OK" });
            } catch (error) {
              console.error("File upload error: ", error);
              return res.status(400).json({ result: "File upload error" });
            }
          } else {
            return res
              .status(201)
              .json({ result: "Only Post created successfully" });
          }
        } else {
          return res.status(400).json({ result: "Error" });
        }
      }
    });
  } catch (error) {
    console.error("Error: ", error);
    return res.status(500).json({ result: "Server error:" });
  }
};

//게시물 전체 조회(글 목록)
exports.readAll = async function (req, res) {
  try {
    const sql =
      "SELECT boardid, title, content, writer, regdate, thumbnail FROM board";

    conn.query(sql, async (error, results) => {
      if (error) {
        console.error("Database error: ", error);
        return res.status(500).json({ result: "Database error" });
      } else {
        if (results) {
          const list = [];
          for (const post of results) {
            const files = await File.readOption(post.boardid);
            list.push({ post: post, files: files });
          }

          return res.status(201).json(list);
        } else {
          return res.status(400).json({ result: "Error" });
        }
      }
    });
  } catch (error) {
    console.error("Error: ", error);
    return res.status(500).json({ result: "Server error:" });
  }
};

//게시물 옵션 조회
exports.readOption = async function (req, res) {
  const option = req.params.option;
  const content = req.query.content;
  let sql;

  try {
    if (option === "title") {
      sql = `SELECT * FROM board WHERE title LIKE '%${content}%'`;
    } else {
      sql = `SELECT * FROM board WHERE content LIKE '%${content}%'`;
    }

    conn.query(sql, (error, results) => {
      if (error) {
        console.error("Database error: ", error);
        return res.status(500).json({ result: "Database error:" + userid });
      } else {
        if (results) {
          return res.status(201).json(results);
        } else {
          return res.status(400).json({ result: "Error" });
        }
      }
    });
  } catch (error) {
    console.error("Error: ", error);
    return res.status(500).json({ result: "Server error:" });
  }
};

//게시물 단일 조회
exports.read = async function (req, res) {
  const boardid = req.params.postid;
  try {
    const sql =
      "SELECT title, content, writer, regdate, thumbnail FROM board WHERE boardid = ?";

    conn.query(sql, boardid, async (error, results) => {
      if (error) {
        console.error("Database error: ", error);
        return res.status(500).json({ result: "Database error:" + boardid });
      } else {
        const file = await File.readOption(boardid);
        return res.status(201).json({ board: results, filelist: file });
      }
    });
  } catch (error) {
    console.error("Error: ", error);
    return res.status(500).json({ result: "Server error:" });
  }
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

//게시물 수정(patch)
exports.update = async function (req, res) {
  const { boardid, title, content } = req.body.board[0];

  try {
    const sql1 = "UPDATE board SET title = ?, content = ? WHERE boardid = ?";
    const var_array = [title, content, boardid];

    conn.query(sql1, var_array, (error, results) => {
      if (error) {
        console.error("Database error: ", error);
        return res.status(500).json({ result: "Database error:" + userid });
      } else {
        if (results.affectedRows > 0) {
          const file = req.body.file[0];

          try {
            if (file.add.length > 0) {
              for (const newFile of file.add) {
                File.create(boardid, newFile);
              }
            }

            if (file.delete.length > 0) {
              for (const oldFile of file.delete) {
                File.delete(oldFile);
              }
            }

            return res.status(201).json({ result: "File update OK" });
          } catch (error) {
            console.error("File upload error: ", error);
            return res.status(500).json({ result: "File upload error" });
          }
        } else {
          return res.status(400).json({ result: "Error" });
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
