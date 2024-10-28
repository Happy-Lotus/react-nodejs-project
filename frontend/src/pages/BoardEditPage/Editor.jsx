import React, { useState, useCallback } from "react";
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
  Paragraph,
  PasteFromMarkdownExperimental,
  PictureEditing,
  SelectAll,
  ShowBlocks,
  Style,
  TextTransformation,
  Undo,
} from "ckeditor5";
import translations from "ckeditor5/translations/ko.js";
import { debounce } from "lodash";

import "ckeditor5/ckeditor5.css";
import "ckeditor5-premium-features/ckeditor5-premium-features.css";
import FileResizer from "react-image-file-resizer";

const Editor = ({ content, setContent }) => {
  const [viewConent, setViewContent] = useState([]);
  const imgLink = "http://localhost:4000/uploads";
  const debouncedSetContent = useCallback(
    debounce((data) => {
      setContent(data);
    }, 1000), // 300ms 지연
    []
  );

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

      FileResizer.imageFileResizer(
        file,
        800,
        800,
        format,
        70,
        0,
        (uri) => {
          resolve(uri);
        },
        "file"
      );
    });
  };

  const customUploadAdapter = (loader) => {
    return {
      upload() {
        return new Promise((resolve, reject) => {
          const formData = new FormData();
          loader.file.then(async (file) => {
            try {
              console.log("=========Editor 사진 업로드=========");
              console.log(file);
              const resizeFiles = await resizeFile(file);
              console.log(resizeFiles);
              formData.append("name", resizeFiles.name);
              formData.append("image", resizeFiles);
              console.log(formData);
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
                attributes: {
                  style: `width: ${resizeFiles.width}px; height: auto;`, // 예시: 너비를 설정
                },
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
      // Markdown,
      Paragraph,
      PasteFromMarkdownExperimental,
      PictureEditing,
      SelectAll,
      ShowBlocks,
      Style,
      TextTransformation,
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
      resizeOptions: [
        {
          name: "resizeImage:original",
          value: null,
          label: "Original",
        },
        {
          name: "resizeImage:custom",
          label: "Custom",
          value: "custom",
        },
        {
          name: "resizeImage:40",
          value: "40",
          label: "40%",
        },
        {
          name: "resizeImage:60",
          value: "60",
          label: "60%",
        },
      ],
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
      data={content}
      onChange={(event, editor) => {
        const data = editor.getData();
        debouncedSetContent(data); // 부모 컴포넌트의 상태 업데이트
      }}
    />
  );
};

export default Editor;
