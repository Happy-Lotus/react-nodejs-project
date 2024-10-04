import React, { useState, useRef } from "react";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css"; // Toast UI Editor 스타일
// import "tui-editor/dist/tui-editor-contents.css";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const PostEditor = () => {
  const editorRef = useRef();
  const [files, setFiles] = useState([]);

  // Dropzone 설정
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    maxFiles: 5,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 5) {
        alert("최대 5개의 파일만 업로드 가능합니다.");
      } else {
        setFiles(acceptedFiles);
      }
    },
  });

  const handleSubmit = async () => {
    const formData = new FormData();
    const content = editorRef.current.getInstance().getMarkdown();

    formData.append("content", content);

    files.forEach((file) => {
      formData.append("userfile", file); // 'userfile'은 서버에서 받을 필드명
    });

    try {
      const response = await axios.post("/api/posts/edit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("성공적으로 업로드되었습니다:", response.data);
    } catch (error) {
      console.error("업로드 실패:", error);
    }
  };

  return (
    <div>
      <h1>글 작성</h1>
      <Editor
        initialValue=" "
        previewStyle="vertical"
        height="400px"
        initialEditType="markdown"
        useCommandShortcut={true}
        ref={editorRef}
      />

      {/* 드래그 앤 드롭 영역 */}
      <div
        {...getRootProps()}
        style={{
          border: "2px dashed #007bff",
          padding: "20px",
          textAlign: "center",
          marginTop: "20px",
        }}
      >
        <input {...getInputProps()} />
        <p>파일을 여기에 드래그하거나 클릭하여 업로드하세요. (최대 5개)</p>
        <div>
          {files.map((file, idx) => (
            <p key={idx}>{file.name}</p>
          ))}
        </div>
      </div>

      <button onClick={handleSubmit}>게시글 업로드</button>
    </div>
  );
};

export default PostEditor;
