import { useEffect, useRef, useState } from "react";
import { HiPrinter } from "react-icons/hi2";
import { axiosOther } from "../../../../http/axios_base_url";
import { notifySuccess, notifyError } from "../../../../helper/notify.jsx";

const AgentWelcomeLetter = ({ setActiveTab }) => {
  const contentRef = useRef(null);
  const printIframeRef = useRef(null);
  const [htmlContent, setHtmlContent] = useState("");
  const [html, setHtml] = useState("");
  const [isUpdate, setIsUpdate] = useState(false)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadURL, setDownloadURL] = useState();
  const [isEditing, setIsEditing] = useState(false);

  const queryQuotation = JSON.parse(localStorage.getItem("Query_Qoutation"));
  const Token = JSON.parse(localStorage.getItem("token"));
  const payload = {
    TemplateName: "Welcome Letter",
    QueryId: queryQuotation?.QueryID,
    QuotationNumber: queryQuotation?.QoutationNum,
    CompanyId: Token?.companyKey,
    TourId: queryQuotation?.TourId,
    ReferenceId: queryQuotation?.ReferenceId,
    Type: "WelcomeLetter",
  };
  const updateNewpayload = {
    QueryId: queryQuotation?.QueryID,
    QuotationNumber: queryQuotation?.QoutationNum,
    TourId: queryQuotation?.TourId,
    Type: "WelcomeLetter"
  };

  useEffect(() => {
    const fetchHtml = async () => {

      try {
        setLoading(true);


        // Step 1: Check list-tour-execution
        const listResponse = await axiosOther.post("list-tour-execution", updateNewpayload);
        // console.log(listResponse?.data?.data[0]?.id);

        if (listResponse?.data?.data[0]?.id) {
          // Data exists, use this data
          setHtmlContent(listResponse?.data?.data[0]?.Html); // Adjust based on actual format
          setHtml(listResponse?.data?.data[0]);       // Optional if required
        } else {
          // No data in list-tour-execution, fallback to generateHtml
          const generateResponse = await axiosOther.post("generateHtml", payload);
          // console.log(generateResponse, "generateResponse111111")
          if (generateResponse?.data) {
            setHtmlContent(generateResponse.data);
            setHtml(generateResponse.data);
            // console.log(generateResponse.data, "generateResponse.data");
          } else {
            setError("No HTML content received from generateHtml API");
          }
        }
      } catch (error) {
        console.error("Error loading HTML:", error);
        setError("Failed to fetch HTML content");
      } finally {
        setLoading(false);
      }


    };

    fetchHtml();
  }, [isUpdate]);

  const handlePrint = () => {
    const printFrame = printIframeRef.current;
    if (printFrame && contentRef.current) {
      const printDoc =
        printFrame.contentDocument || printFrame.contentWindow.document;
      printDoc.open();
      printDoc.write(`
                <html>
                <head>
                    <title>Print Welcome Letter</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; font-size: 14px; }
                    </style>
                </head>
                <body>${contentRef.current.innerHTML}</body>
                </html>
            `);
      printDoc.close();
      printFrame.onload = () => {
        printFrame.contentWindow.focus();
        printFrame.contentWindow.print();
      };
    }
  };

  const handleDownloadWord = async () => {
    try {
      const content = contentRef.current?.innerHTML;

      const response = await axiosOther.post("welcomeletterwordfile", {
        html: content
      });

      const downloadUrl = response?.data?.download_url;

      if (downloadUrl) {
        notifySuccess("Word File Download successfully!")
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = "Welcome_Letter.doc";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Error generating Word file:", error);
    }
  };



  const handleUpdate = async () => {
    const updatedHtml = contentRef.current?.innerHTML;

    const updatePayload = {
      QueryId: queryQuotation?.QueryID,
      QuotationNumber: queryQuotation?.QoutationNum,
      TourId: queryQuotation?.TourId,
      Type: "WelcomeLetter",
      Html: updatedHtml,
      Status: 1,
    };

    try {
      const response = await axiosOther.post("save-update-tour-execution", updatePayload);
      // console.log(response, "responseKKKK");

      if (response?.status == 200) {
        setIsUpdate(true)
        // alert("Content updated successfully!");
        notifySuccess("Welcome Letter updated successfully!")

      }
    } catch (error) {
      console.error("Error updating HTML content:", error);
      alert("Error while updating content");
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-end gap-3">
        <button className="btn btn-dark btn-custom-size" name="SaveButton"
          onClick={() => setActiveTab("TourCard")}
        >
          <span className="me-1">Back</span>
          <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
        </button>
        <button
          className="btn btn-primary btn-custom-size "
          name="SaveButton"
          onClick={() => setActiveTab("Compacttoiurcard")}
        >
          <span className="me-1">Next</span>
          <i className="fa-solid fa-forward text-primary bg-white p-1 rounded"></i>
        </button>
      </div>
      {/* <select
        id="language"
        name="language"
        style={{
          margin: "0px 0px 5px 0",
          borderRadius: "5px",
          padding: "5px",
          fontSize: "0.875rem",
          fontFamily: "'Outfit', sans-serif",
        }}
      >
        <option value="en">English</option>
        <option value="hi">Hindi</option>
      </select> */}

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div
        ref={contentRef}
        contentEditable
        suppressContentEditableWarning={true}
        onFocus={() => setIsEditing(true)}   // Jab click kare to edit mode
        onBlur={() => setIsEditing(false)}   // Jab bahar nikle to normal mode
        style={{
          border: isEditing ? "2px dashed #000" : "1px solid #ccc",
          // border: "1px solid #ccc",
          padding: "20px",
          margin: "10px 0",
          borderRadius: "5px",
          backgroundColor: "white",
          overflowY: "auto",
          fontSize: "0.875rem",
          color: "#000"
        }}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      ></div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "10px",
          justifyContent:"end"
        }}
      >
        <button
          className="btn btn-primary btn-custom-size"
          onClick={handlePrint}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="#fff"
            width="20"
            viewBox="0 0 512 512"
            style={{ marginRight: "5px" }}
          >
            <path d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 144-208 0c-35.3 0-64 28.7-64 64l0 144-48 0c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128zM176 352l32 0c30.9 0 56 25.1 56 56s-25.1 56-56 56l-16 0 0 32c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-48 0-80c0-8.8 7.2-16 16-16zm32 80c13.3 0 24-10.7 24-24s-10.7-24-24-24l-16 0 0 48 16 0zm96-80l32 0c26.5 0 48 21.5 48 48l0 64c0 26.5-21.5 48-48 48l-32 0c-8.8 0-16-7.2-16-16l0-128c0-8.8 7.2-16 16-16zm32 128c8.8 0 16-7.2 16-16l0-64c0-8.8-7.2-16-16-16l-16 0 0 96 16 0zm80-112c0-8.8 7.2-16 16-16l48 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0 0 32 32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0 0 48c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-64 0-64z"></path>
          </svg>
          Print PDF
        </button>
        <button
          className="btn btn-primary btn-custom-size"
          onClick={handleDownloadWord}
        >

          <HiPrinter
            style={{
              fontSize: "1.5rem",
              color: "black",
              marginRight: "5px",
              fill: "#fff",
            }}
          />
          Download Word
        </button>
        <button className="btn btn-success btn-custom-size" onClick={handleUpdate}>
          <i className="fa-solid fa-upload" style={{ marginRight: "5px" }}></i>
          Save Updates
        </button>
      </div>

      <iframe
        ref={printIframeRef}
        title="hidden-print-frame"
        style={{ display: "none" }}
      />
    </div>
  );
};

export default AgentWelcomeLetter;
