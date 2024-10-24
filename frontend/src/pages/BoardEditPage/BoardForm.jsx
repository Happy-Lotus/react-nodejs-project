import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import styles from "./BoardEditPage.module.scss"; // SCSS 모듈 임포트
import Editor from "./Editor";
import Swal from "sweetalert2"; // SweetAlert2 임포트
import FileDropzone from "./fileDropzone";
import ImageDropzone from "./imageDropzone";
import { registerPost, updatePost } from "../../utils/api";
import { toast } from "react-toastify";
import Resizer from "react-image-file-resizer";

const BoardForm = ({ isEditMode }) => {
  const { postId } = useParams(); // URL 파라미터에서 postId 가져오기
  const location = useLocation();
  const navigate = useNavigate();
  const [mountainContent, setMountainContent] = useState({
    title: "",
    content: "",
  });

  const [thumbnail, setThumbnail] = useState(""); //썸네일 상태
  const [isThumbnailRemoved, setIsThumbnailRemoved] = useState(false); // 썸네일 제거 상태
  // const [showThumbnailModal, setShowThumbnailModal] = useState(false); //썸네일 창 상태
  const [files, setFiles] = useState([]); // 첨부파일 상태
  const filesRef = useRef(files); // 현재 파일 리스트를 참조하기 위한 ref
  const [newFiles, setNewFiles] = useState([]); // 새로 추가할 파일
  const newFilesRef = useRef(newFiles);
  const [isDragActive, setIsDragActive] = useState(false);
  // const [isExiting, setIsExiting] = useState(false); // 모달 종료 상태 추가
  const [deletedFiles, setDeletedFiles] = useState([]); // 삭제할 파일명

  useEffect(() => {
    if (isEditMode) {
      //수정 모드
      const { post, files } = location.state || {};
      setMountainContent({
        title: post.title,
        content: post.content,
      });
      setThumbnail(post.thumbnail);
      setFiles(files);
    }
    // filesRef.current = files; // files 상태가 변경될 때마다 ref 업데이트
  }, [isEditMode, location.state]);

  useEffect(() => {
    filesRef.current = files; // files 상태가 변경될 때마다 ref 업데이트
    newFilesRef.current = newFiles;
  }, [files, newFiles]);

  const getValue = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setMountainContent((prevContent) => ({
      ...prevContent,
      [name]: value,
    }));
  };

  //최종 등록
  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    console.log(mountainContent.content);

    const postData = {
      title: mountainContent.title,
      content: mountainContent.content,
      deleteFiles: [],
      thumbnail: thumbnail,
      hasFile: 0,
    };

    if (isThumbnailRemoved) {
      postData.thumbnail = "";
    }

    try {
      //파일 처리
      if (isEditMode) {
        //수정 모드

        newFiles.forEach((file) => {
          formData.append("newFiles", file); //새로 추가할 파일 추가
        });
        deletedFiles.forEach((filename) => {
          postData.deleteFiles.push(filename);
        });

        console.log(postData);
        if (newFiles && newFiles.length > 0) {
          //새 파일이 있을 경우
          postData.hasFile = 1;
        } else if (files.length - deletedFiles.length <= 0) {
          //기존 파일 - 삭제 파일 했을 때 0이거나 음수일 경우
          postData.hasFile = 0;
        } else if (files.length > 0) {
          //기존 파일이 존재하는 경우.
          postData.hasFile = 1;
        }
        formData.append("post", JSON.stringify(postData));

        await updatePost(postId, formData);
        toast.success("게시글 수정 완료 😎");
      } else {
        //작성 모드. 새로 추가된 파일만 추가
        console.log(files);
        files.forEach((file) => {
          formData.append("files", file);
        });
        formData.append("post", JSON.stringify(postData));
        await registerPost(formData);
        toast.success("게시글 작성 완료 😎");
      }
      navigate("/posts"); // 저장 후 /posts로 이동
    } catch (error) {
      toast.error(error);
    }
  };

  // 파일 drag&drop -> 완료
  const handleFileDrop = useCallback(
    (acceptedFiles) => {
      //files : 기존 파일 acceptedFiles: 새로 추가된 파일 newFiles: 저장은 안된 기존파일
      if (files.length + acceptedFiles.length + newFiles.length > 5) {
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
      console.log(isEditMode);
      if (isEditMode) {
        console.log("isEditMode");

        //수정모드일 경우
        setNewFiles((prevFiles) => [
          ...prevFiles,
          ...acceptedFiles.map((file) =>
            Object.assign(file, { preview: file.name, fieldname: "newFiles" })
          ),
        ]);
        setFiles((prevFiles) => [
          ...prevFiles,
          ...acceptedFiles.map((file) =>
            Object.assign(file, { preview: file.name, fieldname: "files" })
          ),
        ]);
      } else {
        setFiles((prevFiles) => [
          ...prevFiles,
          ...acceptedFiles.map((file) =>
            Object.assign(file, { preview: file.name, fieldname: "files" })
          ),
        ]);
      }

      //새 파일 추가

      setIsDragActive(false);
    },
    [files, newFiles]
  );

  //파일 업로드 버튼 이용해 추가 -> 완료
  const handleFileButton = (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (files.length + selectedFiles.length + newFiles.length > 5) {
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
    if (isEditMode) {
      //수정모드일 경우
      setNewFiles((prevFiles) => [
        ...prevFiles,
        ...selectedFiles.map((file) =>
          Object.assign(file, { preview: file.name, fieldname: "newFiles" })
        ),
      ]);
      setFiles((prevFiles) => [
        ...prevFiles,
        ...selectedFiles.map((file) =>
          Object.assign(file, { preview: file.name, fieldname: "files" })
        ),
      ]);
    } else {
      setFiles((prevFiles) => [
        ...prevFiles,
        ...selectedFiles.map((file) =>
          Object.assign(file, { preview: file.name, fieldname: "files" })
        ),
      ]);
    }
  };

  //파일 삭제 -> 새로 저장한 파일과 기존에 저장된 파일 삭제 로직 구현
  const handleDeleteFile = (filename) => {
    if (isEditMode) {
      const fileToDelete = files.find((file) => file.filename === filename);
      console.log(fileToDelete);

      if (fileToDelete) {
        //기존에 저장된 파일인 경우
        setDeletedFiles((prev) => [...prev, filename]); // 삭제할 파일명 추가
        setFiles((prev) => prev.filter((file) => file.filename !== filename)); // UI에서 파일 제거
      } else {
        setNewFiles((prev) => prev.filter((file) => file.name !== filename)); // 새로 추가된 파일 리스트에서 제거
        console.log(files);
      }
    } else {
      console.log("handleToDeleteFile");
      console.log(filename);
      console.log(files);
      setFiles((prev) => prev.filter((file) => file.name !== filename)); // UI에서 파일 제거
      console.log(files);
    }
  };
  const resizeFile = (file) => {
    return new Promise((resolve, reject) => {
      const fileType = file.type;
      let format = "JPEG";
      if (fileType === "image/png") {
        format = "PNG";
      } else if (fileType === "image/jpeg" || fileType === "image/jpg") {
        format = "JPEG";
      } else {
        reject(new Error("지원하지 않는 파일 형식입니다.")); // 지원하지 않는 형식일 경우 에러 처리
        return;
      }

      Resizer.imageFileResizer(
        file,
        800, // 원하는 너비
        800, // 원하는 높이
        format, // 포맷 (JPEG, PNG 등)
        70, // 품질 (0-100)
        0, // 회전 (0-360)
        (uri) => {
          resolve(uri); // 리사이즈된 파일 반환
        },
        "file" // 반환 형식 (file, base64, blob 등)
      );
    });
  };
  // 썸네일 drag&drop
  const handleThumbnailDrop = useCallback(async (acceptedFiles) => {
    console.log(acceptedFiles);
    const file = acceptedFiles[0]; // 첫 번째 파일만 사용
    console.log("=====이미지 리사이징======");
    console.log(file);
    if (file && file.type.startsWith("image/")) {
      const compressedFile = await resizeFile(file);
      console.log(compressedFile);
      Object.assign(compressedFile, { fieldname: "image" }); // fieldname 추가
      const formData = new FormData();
      formData.append("image", compressedFile);
      axios
        .post("http://localhost:4000/posts/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          const imageUrl = `uploads/${response.data.url.split("/").pop()}`;
          setThumbnail(imageUrl);
          console.log(thumbnail);
          setIsThumbnailRemoved(false);
        })
        .catch((error) => {
          console.error("Error uploading thumbnail:", error);
        });
    } else {
      alert("썸네일은 이미지 파일만 가능합니다.");
    }
  }, []);

  // 썸네일 변경
  const handleThumbnailChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      Object.assign(file, { fieldname: "thumbnail" }); // fieldname 추가
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnail(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  //썸네일 삭제
  const handleRemoveThumbnail = () => {
    setIsThumbnailRemoved(true); // 썸네일 제거 상태를 true로 설정
  };

  //변경 또는 작성 취소 버튼
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
            value={mountainContent.title}
          ></input>
        </div>
        <div className={styles.content__contentBox}>
          <span className={styles.content__content}>내용</span>
          <div className={styles.content__input}>
            <Editor
              content={mountainContent.content}
              setContent={(data) =>
                setMountainContent((prev) => ({ ...prev, content: data }))
              }
            />
          </div>
        </div>
        <div className={styles.thumbnail__container}>
          <ImageDropzone
            thumbnail={thumbnail}
            handleThumbnailChange={handleThumbnailChange}
            onDrop={handleThumbnailDrop}
            isThumbnailRemoved={isThumbnailRemoved}
            // handleRegister={handleRegister}
            handleRemoveThumbnail={handleRemoveThumbnail}
          />
        </div>
        <FileDropzone
          onDrop={handleFileDrop} //파일드롭
          isDragActive={isDragActive} //드래그 여부
          files={files} //현재 파일들
          setIsDragActive={setIsDragActive} //드래그 설정
          handleDeleteFile={handleDeleteFile} //파일 삭제
          handleFileChange={handleFileButton} //업로드 버튼을 이용한 파일 업로드
        />
        <div className={styles.buttons}>
          <button className={styles.backButton} onClick={onCancle}>
            취소
          </button>
          <button className={styles.editButton} onClick={onSubmit}>
            등록
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoardForm;
