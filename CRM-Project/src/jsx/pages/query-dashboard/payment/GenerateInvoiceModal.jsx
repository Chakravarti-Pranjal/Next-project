import { useState, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import AgentPaymentInvoice from "./agentPaymentRequest/AgentPaymentInvoice";

const GenerateInvoiceModal = ({ show, handleCloselgShow, totalAmount }) => {
  const iframeRef = useRef(null);

  const handlePrint = () => {
    const iframe = iframeRef.current;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    }
  };
  return (
    <div>
      <Modal
        size="xl"
        show={show}
        onHide={handleCloselgShow}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Generate Invoice
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "10px" }}>
          {/* <iframe
            ref={iframeRef}
            src="/templates/reservationRequest.html"
            title="HTML Popup"
            width="100%"
            height="450px"
            style={{ border: "none" }}
          ></iframe> */}
          <AgentPaymentInvoice
            // show={show}
            handleCloselgShow={handleCloselgShow}
            totalAmount={totalAmount}
          />
          <hr />
          {/* <div className="d-flex justify-content-end">
            <button
              className="btn btn-primary btn-custom-size"
              onClick={handlePrint}
            >
              Print Invoice
            </button>
          </div> */}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default GenerateInvoiceModal;
