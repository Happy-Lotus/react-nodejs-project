import React, { useState } from "react";
import axios from "axios";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { v4 } from "uuid";

const Editor = ({ content, setContent }) => {
  const [flag, setFlag] = useState(false);
  const [viewConent, setViewContent] = useState([]);

  const imgLink = "http://localhost:4000/uploads";

  const customUploadAdapter = (loader) => {
    //서버와의 통신을 처리하는 역할
    //업로드 어댑터 작동 위해 upload 메소드, abort 메소드 선언
    /**
     * upload -> 파일 업로드를 위한 로직. 프로미스 반환
     * resolve 내 default 값으로 이미지를 접근하기 위한 주소 적어주면 img 태그 내에 소스가 삽입된 형태로 반환
     * flag : 프로젝트 내에서 첫 이미지를 썸네일로 설정하는 부분
     * abort -> 업로드가 중간에 중단될 경우
     *
     * loader : 정의한 어댑터에서 파일을 읽고 업로드하는 프로세스를 제어
     */

    return {
      upload() {
        return new Promise((resolve, reject) => {
          loader.file.then(async (file) => {
            const formData = new FormData();
            formData.append("image", file);
            // const filename = v4();
            // const type = file.type.split("/")[1];

            // const signedURL = await axios
            //   .post(process.env.REACT_APP_GET_SIGNEDURL)
            //   .then((body) => {
            //     return body.data;
            //   });

            // await fetch(signedURL, {
            //   method: "PUT",
            //   body: file,
            //   headers: {
            //     "Content-Type": file.type,
            //     "Access-Control-Allow-Origin": "*",
            //     "Access-Control-Allow-Credentials": "true",
            //   },
            // });

            try {
              const response = await axios.post(
                "http://localhost:4000/posts/upload",
                formData,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                }
              );

              resolve({
                default: response.data.url,
              });
            } catch (error) {
              reject(error);
            }
          });
        });
      },
    };
  };

  // 업로드 어댑터를 활성화하기 위해
  function uploadPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return customUploadAdapter(loader);
    };
  }

  return (
    <CKEditor
      editor={ClassicEditor}
      config={{
        extraPlugins: [uploadPlugin],
      }}
      data={content}
      onReady={(editor) => {
        // You can store the "editor" and use when it is needed.
        console.log("Editor is ready to use!", editor);
      }}
      onChange={(event, editor) => {
        const data = editor.getData();
        console.log({ event, editor, data });
        setContent(data); // 부모 컴포넌트의 상태 업데이트
      }}
    />
  );
};

export default Editor;
