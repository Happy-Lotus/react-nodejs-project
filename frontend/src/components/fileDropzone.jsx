import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaTrash } from "react-icons/fa";
import styles from "./styles/FileDropzone.module.scss"; // 스타일 파일 경로
import { FaUpload } from "react-icons/fa";

const FileDropzone = ({
  onDrop,
  files,
  isDragActive,
  setIsDragActive,
  handleDeleteFile,
  handleFileChange,
}) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    noClick: true,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
      "application/pdf": [],
      "application/x-hwp": [],
      "application/vnd.hancom.hwp": [],
      "application/haansofthwp": [],
    },
    maxFiles: 5,
    onDragEnter: () => {
      if (!isDragActive) setIsDragActive(true);
    },
    onDragLeave: () => {
      if (isDragActive) setIsDragActive(false);
    },
  });

  const filelist =
    files.length > 0 ? (
      <ul className={styles.file__list}>
        {files.map((file) => (
          <li
            key={file.name || file.originalname}
            style={{ paddingBottom: "8px" }}
          >
            <div className={styles.file__item}>
              <button
                onClick={() =>
                  file.name
                    ? handleDeleteFile(file.name)
                    : handleDeleteFile(file.filename)
                }
              >
                <FaTrash />
              </button>
              <span className={styles.filename}>
                {file.name || file.originalname}
              </span>
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <p className={styles.filelist__p}>파일을 여기로 드래그하세요.</p>
    );

  return (
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
          name="files"
        />
      </div>
      <section className={styles.file}>
        <div
          {...getRootProps({
            className: isDragActive ? styles.drapzoneActive : styles.drapzone,
          })}
        >
          <input {...getInputProps()} />
          {filelist}
        </div>
      </section>
      <p className={styles.fileNotice}>
        파일의 최대 크기: 10MB, 최대 첨부 파일 갯수: 5
      </p>
    </div>
  );
};

export default FileDropzone;
