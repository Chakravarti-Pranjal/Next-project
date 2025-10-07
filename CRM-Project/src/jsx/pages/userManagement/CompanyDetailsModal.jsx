import React from "react";
import { Modal } from "react-bootstrap";
import styles from "./companyModal.module.css";

function CompanyDetailsModal({ isOpen, onClose, rowData }) {
  const entries = Object.entries(rowData || {}).filter(
    ([_, value]) => value !== null && value !== "" && typeof value !== "object"
  );

  const GSTArray = Array.isArray(rowData?.GST) ? rowData.GST : [];
  const DESTINATIONArray = Array.isArray(rowData?.DESTINATION)
    ? rowData.DESTINATION
    : [];

  return (
    <Modal show={isOpen} onHide={onClose} dialogClassName={styles.customModal} className="vehicle-details">
      <Modal.Header closeButton>
        <Modal.Title>Details</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
        <div className={styles.tableContainer}>
          <table className={`${styles.table} CustomtableLightMode`}>
            <tbody>
              {/* Flat fields in 3-column layout */}
              {entries.map(([label, value], index) =>
                index % 3 === 0 ? (
                  <tr key={index}>
                    <th>{entries[index]?.[0]}</th>
                    <td>{entries[index]?.[1]}</td>

                    {entries[index + 1] && (
                      <>
                        <th>{entries[index + 1]?.[0]}</th>
                        <td>{entries[index + 1]?.[1]}</td>
                      </>
                    )}

                    {entries[index + 2] && (
                      <>
                        <th>{entries[index + 2]?.[0]}</th>
                        <td>{entries[index + 2]?.[1]}</td>
                      </>
                    )}
                  </tr>
                ) : null
              )}

              {/* GST Section */}
              {GSTArray.length > 0 && (
                <>
                  <tr>
                    <th colSpan="6">GST Details</th>
                  </tr>
                  {GSTArray.map((gst, idx) => (
                    <tr key={`gst-${idx}`}>
                      <th>State</th>
                      <td>{gst.State}</td>
                      <th>GST No</th>
                      <td>{gst.GSTNo}</td>
                      <th>State ID</th>
                      <td>{gst.StateId}</td>
                    </tr>
                  ))}
                </>
              )}

              {/* DESTINATION Section */}
              {DESTINATIONArray.length > 0 && (
                <>
                  <tr>
                    <th colSpan="6">Destination Details</th>
                  </tr>
                  {DESTINATIONArray.map((dest, idx) => (
                    <tr key={`dest-${idx}`}>
                      <td colSpan="6">{dest.DestinationName}</td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-primary btn-custom-size" onClick={onClose}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default CompanyDetailsModal;
