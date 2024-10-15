import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import styles from "./BoardDetailPage.module.scss"; // SCSS 모듈 임포트
import { fetchPostDetail } from "../../utils/api";

const BoardDetailPage = () => {
  const { postId } = useParams(); // URL 파라미터에서 postId 가져오기
  const [post, setPost] = useState(null); // 게시물 데이터를 저장할 상태
  const [files, setFile] = useState([]);
  const [loading, setLoading] = useState(true); // 로딩 상태
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/posts/detail/${postId}/edit`, {
      state: { post: post, files: files },
    });
  };

  const transform = () => {
    return { __html: post.content };
  };

  useEffect(() => {
    const getPostDetail = async () => {
      try {
        const data = await fetchPostDetail(postId); // API 호출
        setPost(data[0]); // 받아온 데이터로 상태 업데이트
        setFile(data.filelist);
      } catch (error) {
        console.error("Error fetching post detail:", error);
      } finally {
        setLoading(false); // 로딩 완료
      }
    };

    getPostDetail(); // 데이터 가져오기
  }, [postId]);

  if (loading) {
    return <div>Loading...</div>; // 로딩 중일 때 표시할 내용
  }

  if (!post) {
    return <div>게시물을 찾을 수 없습니다.</div>; // 게시물이 없을 때 표시할 내용
  }

  return (
    <div className={styles.board__detail__page}>
      <div className={styles.page__contents__introBox}>
        <span className={styles.wrapper__title}>내용</span>
      </div>
      <div className={styles.content__container}>
        <div className={styles.post}>
          <h2 className={styles.post__title}>{post.title}</h2>
          <div className={styles.post__writer__info}>
            <p>작성자: {post.writer}</p>
            <p>작성시간: {post.regdate}</p>
          </div>
        </div>
        <div
          className={styles.description}
          dangerouslySetInnerHTML={transform()}
        ></div>
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
          <button className={styles.deleteButton}>삭제</button>
          <Link to="/posts">
            <button className={styles.backButton}>목록</button>
          </Link>
          <button className={styles.editButton} onClick={handleEdit}>
            수정
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoardDetailPage;
