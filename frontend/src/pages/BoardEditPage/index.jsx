import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import styles from "./BoardEditPage.module.scss"; // SCSS 모듈 임포트
import Editor from "./Editor";

const BoardEditPage = () => {
  // const { postId } = useParams(); // URL 파라미터에서 postId 가져오기
  // const [post, setPost] = useState(null); // 게시물 데이터를 저장할 상태
  // const [files,setFile] = useState([])
  // const [loading, setLoading] = useState(true); // 로딩 상태
  const [mountainContent, setMountainContent] = useState({
    title: "",
    content: "",
  });

  const [viewConent, setViewContent] = useState([]);
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
          <input name="title" className={styles.title__input}></input>
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
              content={mountainContent.content}
              setContent={(data) =>
                setMountainContent({ ...mountainContent, content: data })
              }
            />
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

export default BoardEditPage;
