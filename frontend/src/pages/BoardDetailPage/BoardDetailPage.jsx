import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { marked } from "marked";
import Prism from "prismjs";
import Swal from "sweetalert2"; // SweetAlert2 임포트

import styles from "./BoardDetailPage.module.scss"; // SCSS 모듈 임포트
import "ckeditor5/ckeditor5.css";
import "ckeditor5-premium-features/ckeditor5-premium-features.css";
import {
  downloadFile,
  fetchPostDetail,
  postDelete,
  useFetchPostDetail,
} from "../../utils/api";
import { useRecoilValue } from "recoil";
import { userState } from "../../state/authState";

const BoardDetailPage = () => {
  const { postId } = useParams(); // URL 파라미터에서 postId 가져오기
  const [post, setPost] = useState(null); // 게시물 데이터를 저장할 상태
  const [files, setFile] = useState([]);
  const [htmlContent, setHtmlContent] = useState(""); // 변환된 HTML 내용을 저장할 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const currentUser = useRecoilValue(userState);
  const { fetchPostDetail } = useFetchPostDetail();

  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/posts/detail/${postId}/edit`, {
      state: { post: post, files: files },
    });
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "이 게시물을 삭제하시겠습니까?",
      text: "삭제된 게시물은 복구되지 않습니다.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "예",
      cancelButtonText: "아니오",
    });

    if (result.isConfirmed) {
      console.log("handleDelete 게시물 삭제 버튼 작동");
      await postDelete(postId);
      alert("삭제가 완료되었습니다.");
      navigate("/posts"); // 예를 클릭하면 /posts로 이동
    }
  };

  const markdownToHtml = async (fileContent) => {
    const renderer = new marked.Renderer();
    renderer.code = function (code, language, escaped) {
      code = this.options.highlight(code, language);
      if (!language) {
        return `<pre><code>${code}</code></pre>`;
      }

      const languageClass = "language-" + language;
      return `<pre class="${languageClass}"><code class="${languageClass}">${code}</code></pre>`;
    };

    marked.setOptions({
      renderer,
      highlight: function (code, language) {
        try {
          return Prism.highlight(code, Prism.languages[language], language);
        } catch {
          return code;
        }
      },
    });

    return marked(fileContent);
  };

  const transform = () => {
    return { __html: htmlContent };
  };

  const fileDownload = (originalname, filename) => {
    console.log(files);
    console.log(filename);
    downloadFile(postId, filename)
      .then((response) => {
        console.log(response.message);
        if (response && response.status === 201) {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", originalname);
          document.body.appendChild(link);
          link.click();
          link.remove();
        }
      })
      .catch((error) => {
        console.error("Error downloading file:", error); // Log any errors
      });
  };

  useEffect(() => {
    const getPostDetail = async () => {
      try {
        const data = await fetchPostDetail(postId); // API 호출
        setFile(data.files);
        const html = await markdownToHtml(data.post.content);
        setHtmlContent(html);
        setPost(data.post);
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
            <p>
              작성자: <strong>{post.writer}</strong>
            </p>
            <p>
              작성시간:{" "}
              <strong>{new Date(post.regdate).toLocaleDateString()}</strong>
            </p>
          </div>
        </div>
        <div
          className={styles.description}
          dangerouslySetInnerHTML={transform()}
        ></div>
        <div className={styles.attachments}>
          <div className={styles.attachments__title}>
            <h2>첨부파일</h2>
          </div>
          <div className={styles.file}>
            {files.map((item, index) => {
              console.log(item.filename);
              return (
                <span
                  key={index}
                  onClick={() => fileDownload(item.originalname, item.filename)}
                  style={{ cursor: "poinster" }}
                >
                  {item.originalname}
                </span>
              );
            })}
            {/* <span>📄 Lorem Ipsum.pdf</span>
            <span>🖼️ sample.jpg</span> */}
          </div>
        </div>
        <div className={styles.buttons}>
          <Link to="/posts">
            <button className={styles.backButton}>목록</button>
          </Link>
          {currentUser.nickname === post.writer && (
            <>
              <button className={styles.editButton} onClick={handleEdit}>
                수정
              </button>
              <button className={styles.deleteButton} onClick={handleDelete}>
                삭제
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BoardDetailPage;
