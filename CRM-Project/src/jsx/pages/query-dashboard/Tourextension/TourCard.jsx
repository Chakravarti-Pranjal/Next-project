import { useEffect, useRef, useState } from "react";
import { HiPrinter } from "react-icons/hi2";
import { axiosOther } from "../../../../http/axios_base_url";
import { notifySuccess, notifyError } from "../../../../helper/notify.jsx";

const TourCard = ({ setActiveTab }) => {
  const contentRef = useRef(null);
  const iframeRef = useRef(null);
  const [htmlContent, setHtmlContent] = useState("");
  const [iframeUrl, setIframeUrl] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const queryQuotation = JSON.parse(localStorage.getItem("Query_Qoutation"));
  const Token = JSON.parse(localStorage.getItem("token"));

  const updatePayload = {
    QueryId: queryQuotation?.QueryID,
    QuotationNumber: queryQuotation?.QoutationNum,
    TourId: queryQuotation?.TourId,
    Type: "TourCard",
  };

  const templatePayload = {
    QueryId: queryQuotation?.QueryID,
    QuotationNumber: queryQuotation?.QoutationNum?.trim().endsWith("Final")
      ? queryQuotation.QoutationNum
      : `${queryQuotation.QoutationNum} Final`,
  };

  useEffect(() => {
    const fetchHtml = async () => {
      try {
        setLoading(true);

        const listRes = await axiosOther.post(
          "list-tour-execution",
          updatePayload
        );
        if (listRes?.data?.data[0]?.Html) {
          setHtmlContent(listRes.data.data[0].Html);
        } else {
          // Fallback to tourStatusTemplate
          const genRes = await axiosOther.post(
            "tourStatusTemplate",
            templatePayload
          );
          console.log(genRes, "genRes");

          if (genRes?.data?.Status === 1 && genRes?.data?.html) {
            setHtmlContent(genRes.data.html);
            setIframeUrl(genRes.data.TemplateUrl);
          } else {
            setError("No HTML found in tourStatusTemplate response");
          }
        }
      } catch (err) {
        console.error("Error loading HTML:", err);
        setError("Failed to fetch content");
      } finally {
        setLoading(false);
      }
    };

    fetchHtml();
  }, [isUpdate]);

  const handlePrint = () => {
    const printFrame = iframeRef.current;
    if (printFrame && contentRef.current) {
      const printDoc =
        printFrame.contentDocument || printFrame.contentWindow.document;
      printDoc.open();
      printDoc.write(`
        <html>
        <head>
          <title>Print Tour Card</title>
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
      const response = await axiosOther.post("tourStatuswordfile", {
        html: content,
      });
      const downloadUrl = response?.data?.download_url;
      if (downloadUrl) {
        notifySuccess("Word File Download successfully!")
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = "Tour_Card.doc";
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
    const savePayload = {
      ...updatePayload,
      Html: updatedHtml,
      Status: 1,
    };

    try {
      const res = await axiosOther.post(
        "save-update-tour-execution",
        savePayload
      );
      if (res?.status === 200) {
        setIsUpdate(true);
        notifySuccess("Tour Card updated successfully!");
      }
    } catch (err) {
      console.error("Error saving update:", err);
      // alert("Update failed");
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-end gap-3 mb-2">
        <button
          className="btn btn-dark btn-custom-size"
          name="SaveButton"
          onClick={() => setActiveTab("TaskScheduling")}
        >
          <span className="me-1">Back</span>
          <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
        </button>
        <button
          className="btn btn-primary btn-custom-size "
          name="SaveButton"
          onClick={() => setActiveTab("AgentWelcomeLetter")}
        >
          <span className="me-1">Next</span>
          <i className="fa-solid fa-forward text-primary bg-white p-1 rounded"></i>
        </button>
      </div>
      {/* Iframe Preview */}
      {/* <iframe
        ref={iframeRef}
        title="Tour Status Document"
        style={{
          width: "100%",
          border: "none",
          background: "#f5f5f5",
          minHeight: "600px",
        }}
        src={iframeUrl}
      /> */}

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div
        ref={contentRef}
        contentEditable
        suppressContentEditableWarning={true}
        style={{
          border: "1px solid #ccc",
          padding: "20px",
          margin: "10px 0",
          borderRadius: "5px",
          backgroundColor: "white",
          overflowY: "auto",
          fontSize: "0.875rem",
          color: "#000",
        }}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      ></div>

      <div style={{ display: "flex", gap: "10px", marginTop: "10px", justifyContent:"end" }}>
        <button
          className="btn btn-primary btn-custom-size"
          onClick={handlePrint}
        >
          <HiPrinter
            style={{ fontSize: "1.5rem", color: "#fff", marginRight: "5px" }}
          />
          Print PDF
        </button>
        <button
          className="btn btn-primary btn-custom-size"
          onClick={handleDownloadWord}
        >
          <HiPrinter
            style={{ fontSize: "1.5rem", color: "#fff", marginRight: "5px" }}
          />
          Download Word
        </button>
        <button
          className="btn btn-success btn-custom-size"
          onClick={handleUpdate}
        >
          <i className="fa-solid fa-upload" style={{ marginRight: "5px" }}></i>
          Save Updates
        </button>
      </div>

      <iframe ref={iframeRef} title="print-frame" style={{ display: "none" }} />
    </div>
  );
};

export default TourCard;
