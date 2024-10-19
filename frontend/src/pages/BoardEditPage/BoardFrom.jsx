import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./BoardEditPage.module.scss"; // SCSS 모듈 임포트
import Editor from "./Editor";
import Swal from "sweetalert2"; // SweetAlert2 임포트
import FileDropzone from "./fileDropzone";
import ImageDropzone from "./imageDropzone";
import { registerPost } from "../../utils/api";

const BoardForm = ({ isEditMode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mountainContent, setMountainContent] = useState({
    title: "",
    content: "",
  });

  const [thumbnail, setThumbnail] = useState(null); //썸네일 상태
  const [isThumbnailRemoved, setIsThumbnailRemoved] = useState(false); // 썸네일 제거 상태
  const [showThumbnailModal, setShowThumbnailModal] = useState(false); //썸네일 창 상태
  const [files, setFiles] = useState([]); // 첨부파일 상태
  const filesRef = useRef(files); // 현재 파일 리스트를 참조하기 위한 ref
  const [isDragActive, setIsDragActive] = useState(false);
  const [isExiting, setIsExiting] = useState(false); // 모달 종료 상태 추가
  const [newFiles, setNewFiles] = useState([]); // 새로 추가할 파일
  const [deletedFiles, setDeletedFiles] = useState([]); // 삭제할 파일명

  // const getValue = (e) => {
  //   const { name, value } = e.target;
  //   setMountainContent((prevContent) => ({
  //     ...prevContent,
  //     [name]: value,
  //   }));
  // };

  useEffect(() => {
    if (isEditMode) {
      //수정 모드
      const { post, files } = location.state || {};
      setMountainContent({
        title: post.title,
        content: post.content,
      });
      setThumbnail(post.thumbnail);
      setFiles(files);
    }
    // filesRef.current = files; // files 상태가 변경될 때마다 ref 업데이트
  }, [isEditMode, location.state]);
  useEffect(() => {
    filesRef.current = files; // files 상태가 변경될 때마다 ref 업데이트
  }, [files]);

  //최종 등록
  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    const postData = {
      title: mountainContent.title,
      content: mountainContent.content,
    };

    //썸네일 처리
    if (isThumbnailRemoved) {
      postData.thumbnail = null;
      //썸네일 제거
    } else if (thumbnail) {
      //썸네일 추가 또는 변경
      postData.thumbnail = `uploads/${thumbnail}`;
    }

    formData.append("post", JSON.stringify(postData));

    //파일 처리
    if (isEditMode) {
      //수정 모드
      files.forEach((file) => {
        formData.append("files", file); //기존 첨부파일 추가
      });
      newFiles.forEach((file) => {
        formData.append("newFiles", file); //새로 추가할 파일 추가
      });
      deletedFiles.forEach((filename) => {
        formData.append("deleteFiles", filename); //삭제할 파일명 추가
      });
    } else {
      //작성 모드. 새로 추가된 파일만 추가
      newFiles.forEach((file) => {
        formData.append("files", file);
      });
      console.log(newFiles);
    }

    try {
      // const url = isEditMode ? `http://localhost:4000/posts/${location.state.post.id}` : `http://localhost:4000/posts`;
      // const method = isEditMode ? 'put' : 'post';
      // await axios[method](url, formData, {
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //   },
      // });
      // navigate(`/posts`); // 수정 또는 작성 완료 후 게시물 목록으로 이동
      await registerPost(formData);
    } catch (error) {}
    // await registerPost(formData);

    // navigate("/posts"); // 저장 후 /posts로 이동
  };

  // 파일 drag&drop -> 완료
  const handleFileDrop = useCallback(
    (acceptedFiles) => {
      //files : 기존 파일 acceptedFiles: 새로 추가된 파일 newFiles: 저장은 안된 기존파일
      if (files.length + acceptedFiles.length + newFiles.length > 5) {
        alert("첨부할 수 있는 파일의 개수는 5개를 초과할 수 없습니다.");
        setIsDragActive(false); // Reset drag state
        return;
      }

      const oversizedFiles = acceptedFiles.filter(
        (file) => file.size > 10 * 1024 * 1024
      ); // 10MB
      if (oversizedFiles.length > 0) {
        alert("첨부할 수 있는 파일의 크기는 10MB를 초과할 수 없습니다.");
        setIsDragActive(false); // Reset drag state
        return;
      }

      if (isEditMode) {
        //수정모드일 경우
        setNewFiles((prevFiles) => [
          ...prevFiles,
          ...acceptedFiles.map((file) =>
            Object.assign(file, { preview: file.name, fieldname: "files" })
          ),
        ]);
      } else {
        setFiles((prevFiles) => [
          ...prevFiles,
          ...acceptedFiles.map((file) =>
            Object.assign(file, { preview: file.name, fieldname: "files" })
          ),
        ]);
      }

      //새 파일 추가

      setIsDragActive(false);
    },
    [files, newFiles]
  );

  //파일 업로드 버튼 이용해 추가 -> 완료
  const handleFileButton = (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (files.length + selectedFiles.length + newFiles.length > 5) {
      alert("첨부할 수 있는 파일의 개수는 5개를 초과할 수 없습니다.");
      setIsDragActive(false); // Reset drag state
      return;
    }

    const oversizedFiles = selectedFiles.filter(
      (file) => file.size > 10 * 1024 * 1024
    ); // 10MB
    if (oversizedFiles.length > 0) {
      alert("첨부할 수 있는 파일의 크기는 10MB를 초과할 수 없습니다.");
      setIsDragActive(false); // Reset drag state
      return;
    }
    if (isEditMode) {
      //수정모드일 경우
      setNewFiles((prevFiles) => [
        ...prevFiles,
        ...selectedFiles.map((file) =>
          Object.assign(file, { preview: file.name, fieldname: "files" })
        ),
      ]);
    } else {
      setFiles((prevFiles) => [
        ...prevFiles,
        ...selectedFiles.map((file) =>
          Object.assign(file, { preview: file.name, fieldname: "files" })
        ),
      ]);
    }
  };

  //파일 삭제 -> 새로 저장한 파일과 기존에 저장된 파일 삭제 로직 구현
  const handleDeleteFile = (filename) => {
    if (isEditMode) {
      const fileToDelete = files.find((file) => file.originalname === filename);

      if (fileToDelete) {
        //기존에 저장된 파일인 경우
        setDeletedFiles((prev) => [...prev, filename]); // 삭제할 파일명 추가
        setFiles((prev) =>
          prev.filter((file) => file.originalname !== filename)
        ); // UI에서 파일 제거
      } else {
        setNewFiles((prev) => prev.filter((file) => file.name !== filename)); // 새로 추가된 파일 리스트에서 제거
        console.log(files);
      }
    } else {
      console.log("handleToDeleteFile");
      console.log(filename);
      console.log(files);
      setFiles((prev) => prev.filter((file) => file.name !== filename)); // UI에서 파일 제거
      console.log(files);
    }
  };

  // 썸네일 drag&drop
  const handleThumbnailDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]; // 첫 번째 파일만 사용
    if (file && file.type.startsWith("image/")) {
      Object.assign(file, { fieldname: "image" }); // fieldname 추가
      const formData = new FormData();
      formData.append("image", file);
      axios
        .post("http://localhost:4000/posts/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          const imageUrl = response.data.url.split("/").pop();
          setThumbnail(imageUrl);
          setIsThumbnailRemoved(false);
        })
        .catch((error) => {
          console.error("Error uploading thumbnail:", error);
        });
    } else {
      alert("썸네일은 이미지 파일만 가능합니다.");
    }
  }, []);

  // 썸네일 변경
  const handleThumbnailChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      Object.assign(file, { fieldname: "thumbnail" }); // fieldname 추가
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnail(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  //썸네일 삭제
  const handleRemoveThumbnail = () => {
    setThumbnail(null); // 썸네일 제거
    setIsThumbnailRemoved(true); // 썸네일 제거 상태를 true로 설정
  };

  //변경 또는 작성 취소 버튼
  const onCancle = async () => {
    const result = await Swal.fire({
      title: "작성한 내용은 저장되지 않습니다.",
      text: "그래도 취소하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "예",
      cancelButtonText: "아니오",
    });

    if (result.isConfirmed) {
      /**저장되지 않은 변경사항 삭제 로직 추가 */
      navigate("/posts"); // 예를 클릭하면 /posts로 이동
    }
  };

  // 썸네일 선택 창 버튼
  const onSubmit = async () => {
    //완료 버튼 클릭 시 수행 -> 완료
    setShowThumbnailModal(true); // 썸네일 모달 표시
  };

  //썸네일 창 끄기 버튼
  const handleCancel = () => {
    setIsExiting(true); // 모달 종료 애니메이션 시작
    setTimeout(() => {
      setShowThumbnailModal(false); // 모달 닫기
      setIsExiting(false); // 종료 상태 초기화
    }, 200); // 애니메이션 시간과 일치
    setThumbnail(null);
  };

  // const handleUpdate = async () => {//수정 모드일 때 api 호출
  //   const formData = new FormData();
  //   formData.append("title", mountainContent.title);
  //   formData.append("content", mountainContent.content);
  //   if (thumbnail) {
  //     formData.append("thumbnail", thumbnail); // 썸네일 추가
  //   }
  //   attachedFiles.forEach((file) => {
  //     formData.append("files", file); // 기존 첨부파일 추가
  //   });
  //   newFiles.forEach((file) => {
  //     formData.append("newFiles", file); // 새로 추가할 파일 추가
  //   });
  //   deletedFiles.forEach((filename) => {
  //     formData.append("deletedFiles", filename); // 삭제할 파일명 추가
  //   });

  //   try {
  //     const url = isEditMode
  //       ? `http://localhost:4000/posts/${location.state.post.id}`
  //       : `http://localhost:4000/posts`;
  //     const method = isEditMode ? "put" : "post";
  //     await axios[method](url, formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });
  //     navigate(`/posts`); // 수정 또는 작성 완료 후 게시물 목록으로 이동
  //   } catch (error) {
  //     console.error("Error saving post:", error);
  //   }
  // };

  // const handleDeleteFile = (fileToDelete) => {
  //   setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToDelete));
  // };

  // const onDrop = useCallback(// 파일 drag&drop
  //   (acceptedFiles) => {
  //     // const existingFileNames = new Set(
  //     //   filesRef.current.map((file) => file.name)
  //     // );

  //     if (files.length + acceptedFiles.length + newFiles.length > 5) {
  //       alert("첨부할 수 있는 파일의 개수는 5개를 초과할 수 없습니다.");
  //       setIsDragActive(false); // Reset drag state
  //       return;
  //     }

  //     const oversizedFiles = acceptedFiles.filter(
  //       (file) => file.size > 10 * 1024 * 1024
  //     ); // 10MB
  //     if (oversizedFiles.length > 0) {
  //       alert("첨부할 수 있는 파일의 크기는 10MB를 초과할 수 없습니다.");
  //       setIsDragActive(false); // Reset drag state
  //       return;
  //     }

  //     // const newFiles = acceptedFiles.filter(
  //     //   (file) => !existingFileNames.has(file.name)
  //     // );

  //     setFiles((prevFiles) => [
  //       ...prevFiles,
  //       ...newFiles.map((file) =>
  //         Object.assign(file, { preview: file.name, fieldname: "files" })
  //       ),
  //     ]);
  //     setIsDragActive(false);
  //   },
  //   [files.length]
  // );

  // const handleThumbnailChange = (event) => {//setThumbnail
  //   const file = event.target.files[0];
  //   if (file) {
  //     Object.assign(file, { fieldname: "thumbnail" }); // fieldname 추가
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setThumbnail(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  // const handleRemoveThumbnail = () => {
  //   setThumbnail(null); // 썸네일 제거
  //   setIsThumbnailRemoved(true); // 썸네일 제거 상태를 true로 설정
  // };

  // const handleRegister = async (e) => {
  //   e.preventDefault();
  //   const formData = new FormData();
  //   const postData = {
  //     title: mountainContent.title,
  //     content: mountainContent.content,
  //     thumbnail: `uploads/${thumbnail}`,
  //   };
  //   files.forEach((file) => {
  //     formData.append("files", file); // 첨부파일 추가
  //   });
  //   formData.append("post", JSON.stringify(postData));

  //   // formData.append("files", files); // 첨부파일 추가
  //   console.log("files 정보");
  //   // console.log(files);
  //   // console.log(thumbnail);

  //   await registerPost(formData);

  //   // navigate("/posts"); // 저장 후 /posts로 이동
  // };

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
            onChange={(e) =>
              setMountainContent({ ...mountainContent, title: e.target.value })
            } // 상태 업데이트}
            value={mountainContent.title}
          ></input>
        </div>
        <div className={styles.content__contentBox}>
          <span className={styles.content__content}>내용</span>
          <div className={styles.content__input}>
            <Editor
              content={mountainContent.content}
              setContent={(data) =>
                setMountainContent({ ...mountainContent, content: data })
              }
            />
          </div>
        </div>
        <FileDropzone
          onDrop={handleFileDrop} //파일드롭
          isDragActive={isDragActive} //드래그 여부
          files={files} //현재 파일들
          setIsDragActive={setIsDragActive} //드래그 설정
          handleDeleteFile={handleDeleteFile} //파일 삭제
          handleFileChange={handleFileButton} //업로드 버튼을 이용한 파일 업로드
        />
        <div className={styles.buttons}>
          <button className={styles.backButton} onClick={onCancle}>
            취소
          </button>
          <button className={styles.editButton} onClick={onSubmit}>
            등록
          </button>
        </div>
        {showThumbnailModal && ( // 썸네일 선택 모달
          <div
            className={`${styles.thumbnailModal} ${
              isExiting ? styles.exit : ""
            }`}
          >
            <ImageDropzone
              thumbnail={thumbnail}
              handleThumbnailChange={handleThumbnailChange}
              onDrop={handleThumbnailDrop}
              setThumbnail={setThumbnail}
              handleCancel={handleCancel}
              handleRegister={handleRegister}
              handleRemoveThumbnail={handleRemoveThumbnail}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardForm;

/**
 * - 파일
 * 1. 파일 업로드 버튼 함수
 * 2. 파일 드래그앤드롭 함수
 * 3. 파일 삭제 또는 추가 함수 -> 이건 수정모드일때만 on 되도록?
 *  ex. 작성 모드 -> 추가되는 파일 모두 setFiles
 *      수정 모드 -> 추가 파일 과 삭제 파일 나누어서 정보 담아 전송.
 * 
 * - 썸네일 
 * 1. 작성 모드일 경우 썸네일을 추가하거나 추가하지 않을수도 있다.
2. 수정 모드일 경우 
2-1. 기존 썸네일이 있는데 제거할수도 있음
2-2. 기존 썸네일이 있는데 다른거로 변경할 수도 있음
2-3. 기존 썸네일이 있는데 변경하지 않을수도 있음
2-4. 기존 썸네일이 없는데 그냥 유지할수도 있음
2-5. 기존 썸네일이 없는데 새로 추가할수도 있음
 */
