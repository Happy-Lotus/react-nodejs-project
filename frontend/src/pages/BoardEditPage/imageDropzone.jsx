import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import styles from "./ImageDropzone.module.scss"; // SCSS 모듈 임포트
import Resizer from "react-image-file-resizer";
const ImageDropzone = ({
  thumbnail,
  isDragActive,
  setIsDragActive,
  onDrop,
  isThumbnailRemoved,
  handleRemoveThumbnail,
}) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop, // 드래그 앤 드롭 핸들러
    accept: { "image/*": [".jpeg", ".jpg", ".png"] }, // 이미지 파일만 허용
    noClick: true,
    onDragEnter: () => {
      if (!isDragActive) setIsDragActive(true);
      // handleRemoveThumbnail(false);
    },
    onDragLeave: () => {
      if (isDragActive) setIsDragActive(false);
    },
  });

  const imagePreview = thumbnail ? (
    <img
      src={`http://localhost:4000/${thumbnail}`}
      alt="썸네일 미리보기"
      className={styles.thumbnailPreview}
    />
  ) : (
    <p>썸네일 이미지를 업로드하세요.</p>
  );

  return (
    <div className={styles.modalContent}>
      <div className={styles.title__deleteButton}>
        <h2 className={styles.thumbnail__title}>썸네일 업로드</h2>
        {thumbnail && !isThumbnailRemoved && (
          <button
            className={styles.thumbnail__deleteButton}
            onClick={() => {
              setIsDragActive(false);
              handleRemoveThumbnail(true);
            }}
          >
            제거
          </button>
        )}
      </div>

      <div
        className={thumbnail ? styles.imagePresent : styles.thumbnailUploadArea}
      >
        <div
          {...getRootProps({
            className: `${
              thumbnail && !isThumbnailRemoved ? styles.imagePresent : ""
            } ${
              isDragActive && !isThumbnailRemoved
                ? styles.drapzoneActive
                : styles.drapzone
            }`,
          })}
        >
          {imagePreview}
          <input {...getInputProps()} />
        </div>
      </div>
    </div>
  );
};

export default ImageDropzone;
