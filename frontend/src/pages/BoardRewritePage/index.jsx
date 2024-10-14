import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import styles from "./BoardRewritePage.module.scss"; // SCSS 모듈 임포트
import Editor from "./Editor";

const BoardRewritePage = () => {
  const location = useLocation();
  const { post, files } = location.state || {};
  console.log(files);
  const [mountainContent, setMountainContent] = useState({
    title: "",
    content: "",
  });

  //   const [viewConent, setViewContent] = useState([]);
  const getValue = (e) => {
    const { name, value } = e.target;
    setMountainContent((prevContent) => ({
      ...prevContent,
      [name]: value,
    }));
  };

  return (
    <div className={styles.board__detail__page}>
      <div className={styles.page__contents__introBox}>
        <span className={styles.wrapper__title}>글쓰기</span>
      </div>
      <div className={styles.content__container}>
        <div className={styles.content__titleBox}>
          <span className={styles.content__title}>제목</span>
          <input
            name="title"
            className={styles.title__input}
            defaultValue={post.title}
          ></input>
        </div>
        <div className={styles.content__contentBox}>
          <span className={styles.content__content}>내용</span>
          <div className={styles.content__input}>
            {/* <CKEditor
              editor={ClassicEditor}
              data="<p>Hello from CKEditor&nbsp;5!</p>"
              onReady={(editor) => {
                // You can store the "editor" and use when it is needed.
                console.log("Editor is ready to use!", editor);
              }}
              onChange={(event, editor) => {
                const data = editor.getData();
                console.log({ event, editor, data });
                setMountainContent({
                  ...mountainContent,
                  content: data,
                });
              }}
            /> */}
            <Editor
              content={post.content}
              setContent={(data) =>
                setMountainContent({ ...mountainContent, content: data })
              }
            />
          </div>
        </div>
        <div className={styles.attachments}>
          <h2>3. 첨부파일</h2>
          <div className={styles.file}>
            {files.map((item, index) => {
              console.log(item.originalname);
              return <span key={index}>📄 {item.originalname}</span>;
            })}
            {/* <span>📄 Lorem Ipsum.pdf</span>
            <span>🖼️ sample.jpg</span> */}
          </div>
        </div>
        <div className={styles.buttons}>
          <Link to="/posts">
            <button className={styles.backButton}>취소</button>
          </Link>
          <button className={styles.editButton}>등록</button>
        </div>
      </div>
    </div>
  );
};

export default BoardRewritePage;
