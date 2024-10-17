import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaTrash } from "react-icons/fa";
import styles from "./FileDropzone.module.scss"; // 스타일 파일 경로

const FileDropzone = ({
  onDrop,
  files,
  isDragActive,
  setIsDragActive,
  handleDeleteFile,
}) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    noClick: true,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
      "application/pdf": [],
      "application/x-hwp": [],
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

  return (
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
  );
};

export default FileDropzone;
