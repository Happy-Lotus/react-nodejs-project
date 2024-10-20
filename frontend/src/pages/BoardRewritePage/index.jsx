// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { CKEditor } from "@ckeditor/ckeditor5-react";

// import styles from "./BoardRewritePage.module.scss"; // SCSS 모듈 임포트
// import Editor from "./Editor";

// const MAX_FILES = 5; // 최대 파일 개수
// const MAX_FILE_SIZE = 1024 * 1024; // 최대 파일 크기 (1MB)

// const BoardRewritePage = () => {
//   const location = useLocation();
//   const { post, files } = location.state; // 전달된 상태에서 post와 files 가져오기
//   const [loading, setLoading] = useState(false); // 로딩 상태
//   const navigate = useNavigate();
//   const [mountainContent, setMountainContent] = useState({
//     title: post.title,
//     content: post.content,
//   });
//   const [thumbnail, setThumbnail] = useState(post.thumbnail); // 기존 썸네일
//   const [attachedFiles, setAttachedFiles] = useState(files); // 기존 첨부파일
//   const [newFiles, setNewFiles] = useState([]); // 새로 추가할 파일
//   const [deletedFiles, setDeletedFiles] = useState([]); // 삭제할 파일명
//   //   const [viewConent, setViewContent] = useState([]);
//   const handleUpdate = async () => {
//     const formData = new FormData();
//     formData.append("title", mountainContent.title);
//     formData.append("content", mountainContent.content);
//     if (thumbnail) {
//       formData.append("thumbnail", thumbnail); // 썸네일 추가
//     }
//     attachedFiles.forEach((file) => {
//       formData.append("files", file); // 기존 첨부파일 추가
//     });
//     newFiles.forEach((file) => {
//       formData.append("newFiles", file); // 새로 추가할 파일 추가
//     });
//     deletedFiles.forEach((filename) => {
//       formData.append("deletedFiles", filename); // 삭제할 파일명 추가
//     });

//     try {
//       // await axios.put(`http://localhost:4000/posts/${post.id}`, formData, {
//       //   headers: {
//       //     "Content-Type": "multipart/form-data",
//       //   },
//       // });
//       navigate(`/posts/detail/${post.id}`); // 수정 완료 후 게시물 상세 페이지로 이동
//     } catch (error) {
//       console.error("Error updating post:", error);
//     }
//   };

//   const handleThumbnailDrop = (acceptedFiles) => {
//     const file = acceptedFiles[0];
//     if (file && file.type.startsWith("image/")) {
//       // 이미지 파일인지 확인
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setThumbnail(reader.result); // 썸네일 미리보기
//       };
//     } else {
//       alert("썸네일은 이미지 파일만 가능합니다.");
//     }
//   };

//   const handleFileDrop = (acceptedFiles) => {
//     if (
//       attachedFiles.length + newFiles.length + acceptedFiles.length >
//       MAX_FILES
//     ) {
//       alert(`첨부파일은 최대 ${MAX_FILES}개까지 가능합니다.`);
//       return;
//     }

//     acceptedFiles.forEach((file) => {
//       if (file.size > MAX_FILE_SIZE) {
//         alert(`${file.name}의 크기는 1MB를 초과할 수 없습니다.`);
//       } else {
//         setNewFiles((prevFiles) => [...prevFiles, file]); // 새 파일 추가
//       }
//     });
//   };

//   const handleDeleteFile = (filename) => {
//     setDeletedFiles((prev) => [...prev, filename]); // 삭제할 파일명 추가
//     setAttachedFiles((prev) =>
//       prev.filter((file) => file.originalname !== filename)
//     ); // UI에서 파일 제거
//   };

//   return (
//     <div className={styles.board__detail__page}>
//       <div className={styles.page__contents__introBox}>
//         <span className={styles.wrapper__title}>글쓰기</span>
//       </div>
//       <div className={styles.content__container}>
//         <div className={styles.content__titleBox}>
//           <span className={styles.content__title}>제목</span>
//           <input
//             name="title"
//             className={styles.title__input}
//             value={mountainContent.title}
//             onChange={(e) =>
//               setMountainContent({ ...mountainContent, title: e.target.value })
//             }
//           />
//         </div>
//         <div className={styles.content__contentBox}>
//           <span className={styles.content__content}>내용</span>
//           <div className={styles.content__input}>
//             <Editor
//               content={mountainContent.content}
//               setContent={(data) =>
//                 setMountainContent({ ...mountainContent, content: data })
//               }
//             />
//           </div>
//         </div>
//         <div className={styles.attachments}>
//           <h2>첨부파일</h2>
//           <FileDropZone
//             onDrop={handleFileDrop}
//             isDragActive={isDragActive}
//             files={files}
//             setIsDragActive={setIsDragActive}
//             handleDeleteFile={handleDeleteFile}
//             handleFileChange={handleFileChange}
//           />
//           <div className={styles.file}>
//             {files.map((item, index) => (
//               <span key={index}>📄 {item.originalname}</span>
//             ))}
//           </div>
//         </div>
//         <div className={styles.buttons}>
//           <Link to="/posts">
//             <button className={styles.backButton}>취소</button>
//           </Link>
//           <button className={styles.editButton}>완료</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BoardRewritePage;
import React from "react";
import BoardForm from "../BoardEditPage/BoardForm";

const BoardRewritePage = () => {
  return <BoardForm isEditMode={true} />; // 수정 모드
};

export default BoardRewritePage;
