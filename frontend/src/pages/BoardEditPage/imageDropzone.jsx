import React from "react";
import { useDropzone } from "react-dropzone";
import styles from "./ImageDropzone.module.scss"; // SCSS 모듈 임포트

const ImageDropzone = ({ thumbnail, handleThumbnailChange, onDrop }) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop, // 드래그 앤 드롭 핸들러
    accept: { "image/*": [".jpeg", ".jpg", ".png"] }, // 이미지 파일만 허용
  });
  return (
    <div className={styles.thumbnailUploadArea} {...getRootProps()}>
      <input
        type="file"
        accept="image/*"
        onChange={handleThumbnailChange}
        style={{ display: "none" }}
        id="thumbnail-upload"
      />
      <label htmlFor="thumbnail-upload" className={styles.thumbnailLabel}>
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
      </label>
      <input {...getInputProps()} />
    </div>
  );
};

export default ImageDropzone;
