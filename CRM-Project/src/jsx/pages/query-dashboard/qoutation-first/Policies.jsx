import React,{ useState } from "react";
// import "quill/dist/quill.snow.css";
// import ReactQuill from "react-quill";

const Polocies = () => {
  const [textEditorValue,setTextEditorValue] = useState({
    Overview: "",
    TourHighlight: "",
    ItenararyIntroduction: "",
    ItenararySummery: "",
    PaymentPolicy: "",
    CancellationPolicy: "",
    Enclusive: "",
    Exclusive: "",
    Remarks: "",
    TermsCondition: "",
  });

  console.log("TextEditorValue",textEditorValue);

  const handleOverview = (content) => {
    setTextEditorValue({ ...textEditorValue,Overview: content });
  };
  const hanldeTourHighlight = (content) => {
    setTextEditorValue({ ...textEditorValue,TourHighlight: content });
  };
  const hanldeItenararyIntroduction = (content) => {
    setTextEditorValue({ ...textEditorValue,ItenararyIntroduction: content });
  };
  const hanldeItenararySummary = (content) => {
    setTextEditorValue({ ...textEditorValue,ItenararySummery: content });
  };
  const handlePaymentPolicy = (content) => {
    setTextEditorValue({ ...textEditorValue,PaymentPolicy: content });
  };
  const handleCancellationPolicy = (content) => {
    setTextEditorValue({ ...textEditorValue,CancellationPolicy: content });
  };
  const handleEnculsive = (content) => {
    setTextEditorValue({ ...textEditorValue,Enclusive: content });
  };
  const handleExculsive = (content) => {
    setTextEditorValue({ ...textEditorValue,Exclusive: content });
  };
  const handleRemarks = (content) => {
    setTextEditorValue({ ...textEditorValue,handleRemarks: content });
  };
  const handleTermsCondition = (content) => {
    setTextEditorValue({ ...textEditorValue,TermsCondition: content });
  };

  return (
    <>
      <div className="row bg-green mb-2 py-1">
        <div className="col-3">
          <div className="d-flex justify-content-between">
            <div className="d-flex gap-30 align-items-center">
              <div className="square"></div>
              <p className="m-0 text-dark font-weight-bold ml-3">
                Overview & Others
              </p>
            </div>
            <div>
              <i className="fa-solid fa-circle-chevron-down fs-6 green-light-color cursor-pointer"></i>
            </div>
          </div>
        </div>
      </div>
      <div className="row my-2">
        <div className="col-2 pl-0">
          <div>
            <label htmlFor="" className="m-0">
              Supplemnt Type
            </label>
            <select
              name=""
              id=""
              className="font-size-12 p-1 text-secondary outline-0"
            >
              <option value="">Supplement Cost</option>
            </select>
          </div>
        </div>
        <div className="col-2 pl-0">
          <div>
            <label htmlFor="" className="m-0">
              Language Type
            </label>
            <select
              name=""
              id=""
              className="font-size-12 p-1 text-secondary outline-0"
            >
              <option value="" className="">
                Supplement Cost
              </option>
            </select>
          </div>
        </div>
        <div className="col d-flex align-items-end">
          <button className="border-0 px-2 bg-success rounded">Select</button>
        </div>
      </div>
      {/* <div className="row mt-2">
          <div className="col-6 pl-0" style={{ height: "260px" }}>
            <p className="m-0 font-weight-bold">Overview</p>
            <ReactQuillComponent
              handleProcedureContentChange={handleOverview}
            />
          </div>
          <div className="col-6 pr-0" style={{ height: "260px" }}>
            <p className="m-0 font-weight-bold">Tour Highlight</p>
            <ReactQuillComponent
              handleProcedureContentChange={hanldeTourHighlight}
            />
          </div>
          <div className="col-6 pl-0" style={{ height: "260px" }}>
            <p className="m-0 font-weight-bold">Itenarary Introduction</p>
            <ReactQuillComponent
              handleProcedureContentChange={hanldeItenararyIntroduction}
            />
          </div>
          <div className="col-6 pr-0" style={{ height: "260px" }}>
            <p className="m-0 font-weight-bold">Itenarary Summary</p>
            <ReactQuillComponent
              handleProcedureContentChange={hanldeItenararySummary}
            />
          </div>
        </div> */}
      <div className="row bg-green mb-2 py-1">
        <div className="col-4">
          <div className="d-flex justify-content-between">
            <div className="d-flex gap-30 align-items-center">
              <div className="square"></div>
              <p className="m-0 text-dark font-weight-bold ml-3">
                Payment Policy & Cancellation Policiy
              </p>
            </div>
            <div>
              <i className="fa-solid fa-circle-chevron-down fs-6 green-light-color cursor-pointer"></i>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-2">
        <div className="col-6 pl-0" style={{ height: "260px" }}>
          <p className="m-0 font-weight-bold">Payment Policy</p>
          {/* <ReactQuillComponent
              handleProcedureContentChange={handlePaymentPolicy}
            /> */}
        </div>
        <div className="col-6 pr-0" style={{ height: "260px" }}>
          <p className="m-0 font-weight-bold">Cancellation Policy</p>
          {/* <ReactQuillComponent
              handleProcedureContentChange={handleCancellationPolicy}
            /> */}
        </div>
      </div>
      <div className="row bg-green mb-2 py-1">
        <div className="col-4">
          <div className="d-flex justify-content-between">
            <div className="d-flex gap-30 align-items-center">
              <div className="square"></div>
              <p className="m-0 text-dark font-weight-bold ml-3">
                Inc. & Exc / Terms & Condition
              </p>
            </div>
            <div>
              <i className="fa-solid fa-circle-chevron-down fs-6 green-light-color cursor-pointer"></i>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-2">
        <div className="col-6 pl-0" style={{ height: "260px" }}>
          <p className="m-0 font-weight-bold">Enclusive</p>
          {/* <ReactQuillComponent
              handleProcedureContentChange={handleEnculsive}
            /> */}
        </div>
        <div className="col-6 pr-0" style={{ height: "260px" }}>
          <p className="m-0 font-weight-bold">Exclusive</p>
          {/* <ReactQuillComponent
              handleProcedureContentChange={handleExculsive}
            /> */}
        </div>
        <div className="col-6 pl-0" style={{ height: "260px" }}>
          <p className="m-0 font-weight-bold">Remarks</p>
          {/* <ReactQuillComponent handleProcedureContentChange={handleRemarks} /> */}
        </div>
        <div className="col-6 pr-0" style={{ height: "260px" }}>
          <p className="m-0 font-weight-bold">Terms & Condition</p>
          {/* <ReactQuillComponent
              handleProcedureContentChange={handleTermsCondition}
            /> */}
        </div>
      </div>
    </>
  );
};

// const ReactQuillComponent = ({ handleProcedureContentChange }) => {
//   var modules = {
//     toolbar: [
//       [{ size: ["small", false, "large", "huge"] }],
//       ["bold", "italic", "underline", "strike", "blockquote"],
//       [{ list: "ordered" }, { list: "bullet" }],
//       ["link", "image"],
//       [
//         { list: "ordered" },
//         { list: "bullet" },
//         { indent: "-1" },
//         { indent: "+1" },
//         { align: [] },
//       ],
//       [
//         {
//           color: [
//             "#000000",
//             "#e60000",
//             "#ff9900",
//             "#ffff00",
//             "#008a00",
//             "#0066cc",
//             "#9933ff",
//             "#ffffff",
//             "#facccc",
//             "#ffebcc",
//             "#ffffcc",
//             "#cce8cc",
//             "#cce0f5",
//             "#ebd6ff",
//             "#bbbbbb",
//             "#f06666",
//             "#ffc266",
//             "#ffff66",
//             "#66b966",
//             "#66a3e0",
//             "#c285ff",
//             "#888888",
//             "#a10000",
//             "#b26b00",
//             "#b2b200",
//             "#006100",
//             "#0047b2",
//             "#6b24b2",
//             "#444444",
//             "#5c0000",
//             "#663d00",
//             "#666600",
//             "#003700",
//             "#002966",
//             "#3d1466",
//             "custom-color",
//           ],
//         },
//       ],
//     ],
//   };

//   var formats = [
//     "header",
//     "height",
//     "bold",
//     "italic",
//     "underline",
//     "strike",
//     "blockquote",
//     "list",
//     "color",
//     "bullet",
//     "indent",
//     "link",
//     "image",
//     "align",
//     "size",
//   ];

//   return (
//     <ReactQuill
//       theme="snow"
//       modules={modules}
//       formats={formats}
//       placeholder="write your content ...."
//       onChange={handleProcedureContentChange}
//       style={{ height: "160px" }}
//     />
//   );
// };

export default Polocies;
