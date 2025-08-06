import React, { forwardRef, useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const QuillEditor = forwardRef(
  (
    {
      value,
      onChange,
      placeholder = "Enter text here...",
      height = "200px",
      readOnly = false,
    },
    ref
  ) => {
    const quillRef = useRef(null);

    // Combine refs if external ref is provided
    useEffect(() => {
      if (ref) {
        if (typeof ref === "function") {
          ref(quillRef.current);
        } else {
          ref.current = quillRef.current;
        }
      }
    }, [ref]);

    return (
      <div style={{ height, marginBottom: "1rem" }}>
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          style={{ height: "100%" }}
          modules={QuillEditor.modules}
          formats={QuillEditor.formats}
        />
      </div>
    );
  }
);

QuillEditor.modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    ["clean"],
  ],
  clipboard: {
    matchVisual: false,
  },
};

QuillEditor.formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "link",
  "image",
];

export default QuillEditor;
