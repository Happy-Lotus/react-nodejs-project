import React, { useCallback, useEffect, useState } from "react";
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
  const navigate = useNavigate();

  const [viewConent, setViewContent] = useState([]);
  const getValue = (e) => {
    const { name, value } = e.target;
    setMountainContent((prevContent) => ({
      ...prevContent,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleDeleteFile = (fileToDelete) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToDelete));
  };
  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
  }, []);
  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
      "application/vnd.ms-excel": [],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
      "application/msword": [],
      "application/pdf": [],
      "application/zip": [],
    },
    noKeyboard: true,
  });
  const filelist = acceptedFiles.map((file) => (
    <li key={file.path}>{file.path}</li>
  ));

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

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
          </div>
          <section className={styles.file}>
            <div
              {...getRootProps({
                className: "dropzone",
                onDrop: (event) => event.stopPropagation(),
              })}
            >
              <input {...getInputProps()} />
              <p>파일을 여기로 드래그하세요.</p>
            </div>
            <h4>Files</h4>
            <ul>{filelist}</ul>
          </section>

          {/* <div
            className={styles.file}
          >
            <Dropzone onDrop={(acceptedFiles) => console.log(acceptedFiles)}>
              {({ getRootProps, getInputProps }) => {
                <section>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <span className={styles.dragMessage}>
                      파일을 여기로 드래그하세요
                    </span>
                  </div>
                </section>;
              }}
            </Dropzone>
            {files.length === 0 && (
              <span className={styles.dragMessage}>
                파일을 여기로 드래그하세요
              </span>
            )}
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              style={{ display: "none" }}
              id="file-upload"
            />

            <div>
              {files.map((file, index) => (
                <div key={index} className={styles.fileItem}>
                  <button onClick={() => handleDeleteFile(file)}>
                    <FaTrash />
                  </button>
                  <span className={styles.fileName}>{file.name}</span>
                </div>
              ))}
            </div>
          </div> */}
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
