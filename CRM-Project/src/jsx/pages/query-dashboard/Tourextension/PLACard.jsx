import React, { useState, useRef, useEffect } from "react";
import logo from "/invoice/deboxlogo.png";
import html2pdf from "html2pdf.js";
import { axiosOther } from "../../../../http/axios_base_url";

function PLACard({ setActiveTab }) {
  const [isVisible, setIsVisible] = useState(true);
  const [editorText, setEditorText] = useState("");
  const [fontColor, setFontColor] = useState("#000000");
  const [fontSize, setFontSize] = useState("55");
  const [companylogo, setcompanylogo] = useState([]);
  const printRef = useRef();
  const queryQuotation = JSON.parse(localStorage.getItem("token"));

  const getDataForDropdown = async () => {
    try {
      const { data } = await axiosOther.post("listCompanySetting", {
        id: "",
        CompanyId: queryQuotation?.companyKey,
        Key: "mainlogo"
      });
      setcompanylogo(data?.DataList[0]);
    } catch (error) {
      console.log(error);
    }
  };
  // console.log(queryQuotation, companylogo, "setcompanylogo")
  useEffect(() => {
    getDataForDropdown();
  }, []);

  const handleDownload = () => {
    const element = printRef.current;
    html2pdf().from(element).save("document.pdf");
  };

  return (
    <>
      <div className="col-12 d-flex gap-3 justify-content-end w-100 mb-2">
        <button
          className="btn btn-dark btn-custom-size"
          name="SaveButton"
          onClick={() => setActiveTab("FeedbackForm")}
        >
          <span className="me-1">Back</span>
          <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
        </button>

        <button
          className="btn btn-primary btn-custom-size "
          name="SaveButton"
          onClick={() => setActiveTab("TransportAllocationChart")}
        >
          <span className="me-1">Next</span>
          <i className="fa-solid fa-forward text-primary bg-white p-1 rounded"></i>
        </button>
      </div>
      <div className="pla-container">
        <style>
          {`
          .pla-container {
            font-family: Arial, sans-serif;
            font-size: 0.875rem;
            line-height: 1.4;
            background: #fff;
            color: #000;
            padding: 20px;
          }
          .checkbox-container {
            margin-bottom: 15px;
            display: flex;
            align-items: center;
          }
          .checkbox-container input {
            margin-right: 10px;
          }
          .header-card {
            padding: 15px;
            margin-top: 15px;
            display: flex;
            gap: 20px;
            align-items: center;
            justify-content: end;
            color:#000;
          }
          .logo-left, .logo-right {
            width: 100px;
            flex: none;
          }
          .header-content {
            text-align: center;
          }
          .header-content strong {
            margin: 0;
            font-size: 1.4rem;
            border-bottom: 1px solid #000;
            display: block;
          }
          .header-content p {
            margin: 5px 0;
            font-size: 0.9rem;
          }
          .editor-container {
            margin-top: 20px;
          }
          .editor-container textarea {
            width: 100%;
            height: 100px;
            margin-bottom: 10px;
          }
          .controls {
            margin-bottom: 10px;
            display: flex;
            gap: 6px;
            align-items: center;
          }
            .controls input{
            height:17px
          }
          .print-btn {
            margin-top: 10px;
            padding: 5px 10px;
            background-color: #007bff;
            color: white;
            border: none;
            cursor: pointer;
          }
          .print-btn:hover {
            background-color: #0056b3;
          }
            .pdf-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Full page height */
  width: 100%;
}

.pdf-inner {
  text-align: center;
}

        `}
        </style>

        <div className="checkbox-container">
          <input
            type="checkbox"
            id="showHeader"
            checked={isVisible}
            onChange={(e) => setIsVisible(e.target.checked)}
          />
          <label className="fs-6" htmlFor="showHeader">
            Show Header
          </label>
        </div>
        <div className="editor-container">
          <div className="controls">
            <label className="fs-6">Text Color: </label>
            <input
              type="color"
              value={fontColor}
              onChange={(e) => setFontColor(e.target.value)}
            />
            <label className="fs-6"> Text Size: </label>
            <select
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
            >
              {[32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72, 76].map((size) => (
                <option key={size} value={size}>
                  {size}px
                </option>
              ))}
            </select>
          </div>
          <textarea
            value={editorText}
            onChange={(e) => setEditorText(e.target.value)}
            style={{
              padding: "6px",
              color: fontColor,
              fontSize: `${fontSize}px`,
            }}
          />
          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "end"
            }}
          >
            <button
              className="btn btn-primary btn-custom-size"
              onClick={handleDownload}
            >
              Download PDF
            </button>
          </div>
        </div>

        {/* <div ref={printRef}>
          {isVisible && (
            <div className="header-card">
              <img src={logo} alt="DeBöx Logo" className="logo-left" />
              <div className="header-content">
                <strong>Indo Asia Tours</strong>
                <p>
                  Reg. Office: 414, Tower B, iThum, Sector 62, Noida 201301,
                  U.P, India
                  <br />
                  +91-9 910 910 910 | info@deboxglobal.com | www.deboxglobal.com
                </p>
              </div>
            </div>
          )}
          <div
            className="pdf-content"
            style={{ color: fontColor, fontSize: `${fontSize}px` }}
          >
            {editorText}
          </div>
        </div> */}

        <div ref={printRef}>
          {isVisible && (
            <div className="header-card">
              <img
                // src={logo} 
                src={`${import.meta.env.VITE_LOGIN_URI_IMAGE}${companylogo?.Value?.ImageName}`}
                alt="Logo" className="logo-left" />
              {/* <div className="header-content">
                <strong>Indo Asia Tours</strong>
                <p>
                  Reg. Office: 414, Tower B, iThum, Sector 62, Noida 201301, U.P, India
                  <br />
                  +91-9 910 910 910 | info@deboxglobal.com | www.deboxglobal.com

                </p>
              </div> */}
            </div>
          )}
          <div className="pdf-content" style={{ color: fontColor, fontSize: `${fontSize}px` }}>
            {editorText}
          </div>
        </div>


      </div>
    </>
  );
}

export default PLACard;
