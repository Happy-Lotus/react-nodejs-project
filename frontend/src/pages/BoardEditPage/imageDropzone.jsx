import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import styles from "./ImageDropzone.module.scss"; // SCSS 모듈 임포트

const ImageDropzone = ({
  thumbnail,
  handleThumbnailChange,
  onDrop,
  setThumbnail,
  handleCancel,
  handleRegister,
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop, // 드래그 앤 드롭 핸들러
    accept: { "image/*": [".jpeg", ".jpg", ".png"] }, // 이미지 파일만 허용
    noClick: true,
    onDragEnter: () => {
      if (!isDragActive) setIsDragActive(true);
    },
    onDragLeave: () => {
      if (isDragActive) setIsDragActive(false);
    },
  });

  return (
    <div className={styles.modalContent}>
      <h2 className={styles.thumbnail__title}>썸네일 업로드</h2>
      {thumbnail && (
        <div className={styles.thumbnail__delete}>
          <button
            className={styles.thumbnail__deleteButton}
            onClick={() => {
              setIsDragActive(false);
              setThumbnail(null);
            }}
          >
            제거
          </button>
        </div>
      )}
      <div className={styles.thumbnailUploadArea} {...getRootProps()}>
        <input
          type="file"
          accept="image/*"
          onChange={handleThumbnailChange}
          style={{ display: "none" }}
          id="thumbnail-upload"
          name="thumbnail"
        />
        <div
          className={`${styles.thumbnailPlaceholder} ${
            thumbnail ? styles.imagePresent : ""
          } ${isDragActive ? styles.hoverEffect : ""}`}
        >
          {thumbnail ? (
            <img
              src={`/uploads/${thumbnail}`}
              alt="썸네일 미리보기"
              className={styles.thumbnailPreview}
            />
          ) : (
            <p>썸네일 이미지를 업로드하세요.</p>
          )}
        </div>

        <input {...getInputProps()} />
      </div>
      <div className={styles.modalButtons}>
        <button className={styles.cancleButton} onClick={handleCancel}>
          취소
        </button>
        <button className={styles.registerButton} onClick={handleRegister}>
          등록
        </button>
      </div>
    </div>
  );
};

export default ImageDropzone;
