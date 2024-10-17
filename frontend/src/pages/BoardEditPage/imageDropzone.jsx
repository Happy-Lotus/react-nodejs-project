import React from "react";
import { useDropzone } from "react-dropzone";
import styles from "./BoardEditPage.module.scss"; // SCSS 모듈 임포트

const ImageDropzone = ({ onDrop, isDragActive, thumbnail }) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    noClick: true,
    maxFiles: 5,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
      "application/pdf": [],
      "application/x-hwp": [],
    },
  });

  return (
    <section>
      <div
        {...getRootProps({
          className: isDragActive ? styles.drapzoneActive : styles.drapzone,
        })}
      >
        <input {...getInputProps()} />
        <div className={styles.thumbnailPlaceholder}>
          {thumbnail ? (
            <img
              src={thumbnail}
              alt="썸네일 미리보기"
              className={styles.thumbnailPreview}
            />
          ) : (
            <p>썸네일 이미지를 업로드하세요.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ImageDropzone;
