import React, { useEffect, useRef, useState } from "react";

const PrintInvoiceComponent = ({ state, htmlResponse }) => {
  const iframeRef = useRef(null);
  const [downloadInvoic, setDownloadInvoic] = useState(true);

  console.log(htmlResponse, "HFGF7575");

  const handlePrint = () => {
    const htmlData = htmlResponse || state?.row?.Html;
    const iframe = iframeRef.current;

    if (iframe) {
      const doc = iframe.contentWindow.document;
      doc.open();
      doc.write(`${htmlData}`);
      doc.close();
      iframe.onload = () => {
        setTimeout(() => {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
        }, 300);
      };
    }
  };

  useEffect(() => {
    if (!state?.convertToTax) {
      if (state?.row?.id) {
        setDownloadInvoic(false);
      }
    }
  }, [state]);

  return (
    <>
      {/* Hidden iframe for printing */}
      <iframe ref={iframeRef} style={{ display: "none" }} title="print-frame" />

      <div className="d-flex align-items-center gap-1">
        {/* {!downloadInvoic && (
          <button
            className="btn btn-dark btn-custom-size"
            style={{ backgroundColor: "#007bff" }}
            
          >
            <span className="me-1">Download</span>
            <i className="fas fa-arrow-down text-dark bg-white p-1 rounded"></i>
          </button>
        )} */}

        {(!downloadInvoic || htmlResponse) && (
          <button
            className="btn btn-dark btn-custom-size"
            onClick={handlePrint}
            style={{ backgroundColor: "#28a745" }}
          >
            <span className="me-1">Print</span>
            <i className="fas fa-print text-dark bg-white p-1 rounded"></i>
          </button>
        )}
      </div>
    </>
  );
};

export default PrintInvoiceComponent;
