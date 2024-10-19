import React, { useState } from "react";
import axios from "axios";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  AccessibilityHelp,
  Alignment,
  Autoformat,
  AutoImage,
  AutoLink,
  Autosave,
  BlockQuote,
  Bold,
  CKBox,
  CloudServices,
  Code,
  CodeBlock,
  Essentials,
  GeneralHtmlSupport,
  Heading,
  HorizontalLine,
  HtmlEmbed,
  ImageBlock,
  ImageCaption,
  ImageInline,
  ImageInsert,
  ImageInsertViaUrl,
  ImageResize,
  ImageStyle,
  ImageTextAlternative,
  ImageToolbar,
  ImageUpload,
  Indent,
  IndentBlock,
  Italic,
  Link,
  LinkImage,
  List,
  ListProperties,
  Markdown,
  Paragraph,
  PasteFromMarkdownExperimental,
  PictureEditing,
  SelectAll,
  ShowBlocks,
  Style,
  TextTransformation,
  TodoList,
  Undo,
} from "ckeditor5";
import translations from "ckeditor5/translations/ko.js";

import "ckeditor5/ckeditor5.css";

const Editor = ({ content, setContent }) => {
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
          const formData = new FormData();
          loader.file.then(async (file) => {
            try {
              console.log(file);
              formData.append("name", file.name);
              formData.append("image", file);
              console.log(formData);
              // const reader = new FileReader();
              // reader.onloadend = () => {
              //   setImageUrl(render.result);
              // };
              // reader.readAsDataURL(file);

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

  const editorConfig = {
    toolbar: {
      items: [
        "undo",
        "redo",
        "|",
        "showBlocks",
        "|",
        "heading",
        "style",
        "|",
        "bold",
        "italic",
        "code",
        "|",
        "horizontalLine",
        "link",
        "insertImage",
        "ckbox",
        "blockQuote",
        "codeBlock",
        "htmlEmbed",
        "|",
        "alignment",
        "|",
        "bulletedList",
        "numberedList",
        "todoList",
        "outdent",
        "indent",
      ],
      shouldNotGroupWhenFull: false,
    },
    plugins: [
      AccessibilityHelp,
      Alignment,
      Autoformat,
      AutoImage,
      AutoLink,
      Autosave,
      BlockQuote,
      Bold,
      CKBox,
      CloudServices,
      Code,
      CodeBlock,
      Essentials,
      GeneralHtmlSupport,
      Heading,
      HorizontalLine,
      HtmlEmbed,
      ImageBlock,
      ImageCaption,
      ImageInline,
      ImageInsert,
      ImageInsertViaUrl,
      ImageResize,
      ImageStyle,
      ImageTextAlternative,
      ImageToolbar,
      ImageUpload,
      Indent,
      IndentBlock,
      Italic,
      Link,
      LinkImage,
      List,
      ListProperties,
      Markdown,
      Paragraph,
      PasteFromMarkdownExperimental,
      PictureEditing,
      SelectAll,
      ShowBlocks,
      Style,
      TextTransformation,
      TodoList,
      Undo,
      uploadPlugin,
    ],
    heading: {
      options: [
        {
          model: "paragraph",
          title: "Paragraph",
          class: "ck-heading_paragraph",
        },
        {
          model: "heading1",
          view: "h1",
          title: "Heading 1",
          class: "ck-heading_heading1",
        },
        {
          model: "heading2",
          view: "h2",
          title: "Heading 2",
          class: "ck-heading_heading2",
        },
        {
          model: "heading3",
          view: "h3",
          title: "Heading 3",
          class: "ck-heading_heading3",
        },
        {
          model: "heading4",
          view: "h4",
          title: "Heading 4",
          class: "ck-heading_heading4",
        },
        {
          model: "heading5",
          view: "h5",
          title: "Heading 5",
          class: "ck-heading_heading5",
        },
        {
          model: "heading6",
          view: "h6",
          title: "Heading 6",
          class: "ck-heading_heading6",
        },
      ],
    },
    htmlSupport: {
      allow: [
        {
          name: /^.*$/,
          styles: true,
          attributes: true,
          classes: true,
        },
      ],
    },
    image: {
      toolbar: [
        "toggleImageCaption",
        "imageTextAlternative",
        "|",
        "imageStyle:inline",
        "imageStyle:wrapText",
        "imageStyle:breakText",
        "|",
        "resizeImage",
      ],
    },
    initialData: "",
    language: "ko",
    link: {
      addTargetToExternalLinks: true,
      defaultProtocol: "https://",
      decorators: {
        toggleDownloadable: {
          mode: "manual",
          label: "Downloadable",
          attributes: {
            download: "file",
          },
        },
      },
    },
    list: {
      properties: {
        styles: true,
        startIndex: true,
        reversed: true,
      },
    },
    placeholder: "Type or paste your content here!",
    style: {
      definitions: [
        {
          name: "Article category",
          element: "h3",
          classes: ["category"],
        },
        {
          name: "Title",
          element: "h2",
          classes: ["document-title"],
        },
        {
          name: "Subtitle",
          element: "h3",
          classes: ["document-subtitle"],
        },
        {
          name: "Info box",
          element: "p",
          classes: ["info-box"],
        },
        {
          name: "Side quote",
          element: "blockquote",
          classes: ["side-quote"],
        },
        {
          name: "Marker",
          element: "span",
          classes: ["marker"],
        },
        {
          name: "Spoiler",
          element: "span",
          classes: ["spoiler"],
        },
        {
          name: "Code (dark)",
          element: "pre",
          classes: ["fancy-code", "fancy-code-dark"],
        },
        {
          name: "Code (bright)",
          element: "pre",
          classes: ["fancy-code", "fancy-code-bright"],
        },
      ],
    },
    translations: [translations],
  };

  return (
    <CKEditor
      editor={ClassicEditor}
      config={editorConfig}
      data="<h2>Congratulations on setting up CKEditor 5! 🎉</h2>"
      // onReady={(editor) => {
      //   // You can store the "editor" and use when it is needed.
      //   console.log("Editor is ready to use!", editor);
      // }}
      onChange={(event, editor) => {
        const data = editor.getData();
        console.log({ event, editor, data });
        setContent(data); // 부모 컴포넌트의 상태 업데이트
      }}
    />
  );
};

export default Editor;
