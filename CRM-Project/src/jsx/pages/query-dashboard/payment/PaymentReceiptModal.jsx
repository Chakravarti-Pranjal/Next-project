import { useRef } from "react";
import Modal from "react-bootstrap/Modal";

const PaymentReceiptModal = ({ show, handleClose, paymentReceiptURL, paymentReceiptHTML }) => {
  const iframePreviewRef = useRef(null); // For preview
  const iframePrintRef = useRef(null); // For printing

  console.log(paymentReceiptURL, "paymentReceiptURL");
  console.log(paymentReceiptHTML, "paymentReceiptHTML");

  const iframeUrl = paymentReceiptURL ?? "";

  const handlePrint = () => {
    const htmlData = paymentReceiptHTML;
    const iframe = iframePrintRef.current;

    if (iframe && htmlData) {
      const doc = iframe.contentWindow.document;
      doc.open();
      doc.write(htmlData);
      doc.close();
      iframe.onload = () => {
        setTimeout(() => {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
        }, 300);
      };
    } else {
      console.error("No iframe or HTML data available for printing");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>Payment Receipt</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: "10px" }}>
        {/* Iframe for preview */}
        <iframe
          ref={iframePreviewRef}
          src={iframeUrl}
          title="HTML Popup"
          width="100%"
          height="450px"
          style={{ border: "none", background: "#fff" }}
        ></iframe>
        {/* Hidden iframe for printing */}
        <iframe
          ref={iframePrintRef}
          style={{ display: "none" }}
          title="print-frame"
        />
      </Modal.Body>
      <Modal.Footer>
        <div className="d-flex align-items-center gap-1">
          <button
            className="btn btn-primary btn-custom-size"
            onClick={handlePrint}
          >
            Print Invoice as PDF
          </button>
          <button className="btn btn-dark btn-custom-size" onClick={handleClose}>
            Cancel
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default PaymentReceiptModal;