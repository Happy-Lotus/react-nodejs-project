import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./BoardEditPage.module.scss"; // SCSS 모듈 임포트
import Editor from "./Editor";
import Swal from "sweetalert2"; // SweetAlert2 임포트
import FileDropzone from "./fileDropzone";
import ImageDropzone from "./imageDropzone";
import { registerPost } from "../../utils/api";

const BoardEditPage = () => {
  const [mountainContent, setMountainContent] = useState({
    title: "",
    content: "",
  });
  const [files, setFiles] = useState([]); // 첨부파일 상태
  const filesRef = useRef(files); // 현재 파일 리스트를 참조하기 위한 ref
  const [isDragActive, setIsDragActive] = useState(false);
  const [thumbnail, setThumbnail] = useState(null); //썸네일 상태
  const [showThumbnailModal, setShowThumbnailModal] = useState(false); //썸네일 창 상태
  const [isExiting, setIsExiting] = useState(false); // 모달 종료 상태 추가
  const navigate = useNavigate();

  const getValue = (e) => {
    const { name, value } = e.target;
    setMountainContent((prevContent) => ({
      ...prevContent,
      [name]: value,
    }));
  };

  useEffect(() => {
    filesRef.current = files; // files 상태가 변경될 때마다 ref 업데이트
  }, [files]);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const existingFileNames = new Set(
      filesRef.current.map((file) => file.name)
    );

    if (files.length + selectedFiles.length > 5) {
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

    const newFiles = selectedFiles.filter(
      (file) => !existingFileNames.has(file.name)
    );
    setFiles((prevFiles) => [
      ...prevFiles,
      ...newFiles.map((file) => Object.assign(file, { preview: file.name })),
    ]);
  };

  const handleDeleteFile = (fileToDelete) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToDelete));
  };

  const onDrop = useCallback(
    (acceptedFiles) => {
      const existingFileNames = new Set(
        filesRef.current.map((file) => file.name)
      );

      if (files.length + acceptedFiles.length > 5) {
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

      const newFiles = acceptedFiles.filter(
        (file) => !existingFileNames.has(file.name)
      );

      setFiles((prevFiles) => [
        ...prevFiles,
        ...newFiles.map((file) => Object.assign(file, { preview: file.name })),
      ]);
      setIsDragActive(false);
    },
    [files.length]
  );

  const onSubmit = async () => {
    setShowThumbnailModal(true); // 썸네일 모달 표시
  };

  const onDropThumbnail = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]; // 첫 번째 파일만 사용
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnail(reader.result); // 썸네일 상태 업데이트
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleThumbnailChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnail(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegister = async () => {
    const formData = new FormData();
    formData.append("title", mountainContent.title);
    formData.append("content", mountainContent.content);
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }
    files.forEach((file) => {
      formData.append("files", file); // 첨부파일 추가
    });
    const response = await registerPost(formData);

    navigate("/posts"); // 저장 후 /posts로 이동
  };

  const handleCancel = () => {
    setIsExiting(true); // 모달 종료 애니메이션 시작
    setTimeout(() => {
      setShowThumbnailModal(false); // 모달 닫기
      setIsExiting(false); // 종료 상태 초기화
    }, 200); // 애니메이션 시간과 일치
    setThumbnail(null);
  };

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
      navigate("/posts"); // 예를 클릭하면 /posts로 이동
    }
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
            onChange={getValue}
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
          onDrop={onDrop}
          isDragActive={isDragActive}
          files={files}
          setIsDragActive={setIsDragActive}
          handleDeleteFile={handleDeleteFile}
          handleFileChange={handleFileChange}
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
              onDrop={onDropThumbnail}
              setThumbnail={setThumbnail}
              handleCancel={handleCancel}
              handleRegister={handleRegister}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardEditPage;
