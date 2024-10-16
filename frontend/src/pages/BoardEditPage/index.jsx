import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Dropzone, { useDropzone } from "react-dropzone";

import styles from "./BoardEditPage.module.scss"; // SCSS 모듈 임포트
import Editor from "./Editor";
import { FaUpload, FaTrash, FaTrashAlt } from "react-icons/fa";

const BoardEditPage = () => {
  const [mountainContent, setMountainContent] = useState({
    title: "",
    content: "",
  });
  const [files, setFiles] = useState([]); // 첨부파일 상태
  const filesRef = useRef(files); // 현재 파일 리스트를 참조하기 위한 ref
  const navigate = useNavigate();
  const [viewConent, setViewContent] = useState([]);
  const [isDragActive, setIsDragActive] = useState(false);

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

  const onDrop = useCallback((acceptedFiles) => {
    const existingFileNames = new Set(
      filesRef.current.map((file) => file.name)
    );

    const newFiles = acceptedFiles.filter(
      (file) => !existingFileNames.has(file.name)
    );

    setFiles((prevFiles) => [
      ...prevFiles,
      ...newFiles.map((file) => Object.assign(file, { preview: file.name })),
    ]);
    setIsDragActive(false);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
      "application/pdf": [],
      "application/x-hwp": [], // HWP 파일 형식 추가
    },
    onDrop,
    onDragEnter: () => {
      if (!isDragActive) setIsDragActive(true);
    },
    onDragLeave: () => {
      if (isDragActive) setIsDragActive(false);
    },
    noClick: true,
  });
  const filelist =
    files.length > 0 ? (
      <ul className={styles.file__list}>
        {files.map((file) => (
          <li key={file.name} style={{ paddingBottom: "8px" }}>
            <div className={styles.file__item}>
              <button onClick={() => handleDeleteFile(file)}>
                <FaTrash />
              </button>
              <span className={styles.filename}>{file.name}</span>
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <p className={styles.filelist__p}>파일을 여기로 드래그하세요.</p>
    );

  const onSubmit = async () => {
    // await registerPost(mountainContent.title,mountainContent.content);
    navigate("/posts");
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
            <Editor
              content={mountainContent.content}
              setContent={(data) =>
                setMountainContent({ ...mountainContent, content: data })
              }
            />
          </div>
        </div>
        <div className={styles.attachments}>
          <div className={styles.title__uploadButton}>
            <h2 className={styles.attachments__title}>첨부파일</h2>
            <label htmlFor="file-upload" className={styles.fileUploadButton}>
              <FaUpload /> 업로드
            </label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              style={{ display: "none" }}
              id="file-upload"
            />
          </div>
          {/* <div
              {...getRootProps({
                className: isDragActive ? styles.drapzoneActive:styles.file,
              })} 
            >
              <input {...getInputProps()} />
              {filelist}
            </div> */}
          <section className={styles.file}>
            <div
              {...getRootProps({
                className: isDragActive
                  ? styles.drapzoneActive
                  : styles.drapzone,
              })}
            >
              <input {...getInputProps()} />
              {filelist}
            </div>
          </section>
        </div>
        <div className={styles.buttons}>
          <Link to="/posts">
            <button className={styles.backButton}>취소</button>
          </Link>
          <button className={styles.editButton} onClick={onSubmit}>
            등록
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoardEditPage;
