import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Row, Card, Col, Button, CardHeader, CardBody } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PerfectScrollbar from "react-perfect-scrollbar";
import deboxlogo from "../../../../../images/logo/deboxlogo.png";
import AgentTotalInvoice from "./AgentTotalInvoice";

const InvoiceFormModal = ({ show, handleCloseInvoiveForm, totalAmount }) => {
  console.log(totalAmount, "totalAmount")
  const [particularsFormValue, setParticularsFormValue] = useState({
    particulars: [
      {
        particulars: "",
        hsnSac: "",
        amount: "",
        tcs: "",
        tax: "",
        totalAmount: 0,
        state: "",
        gst: "",
        sgst: 0,
        cgst: 0,
        excludedGst: false,
      },
    ],
    totalTourCost: {
      state: "",
      gst: "",
      sgst: 0,
      cgst: 0,
      excludedGst: false,
      totalCost: 0,
    },
  });

  // Function to calculate SGST and CGST based on GST percentage
  const calculateGst = (amount, gstRate) => {
    if (!amount || !gstRate) return { sgst: 0, cgst: 0 };
    const rate = parseFloat(gstRate) / 2; // Split GST equally into SGST and CGST
    const sgst = (parseFloat(amount) * rate) / 100;
    const cgst = sgst;
    return { sgst, cgst };
  };

  // Handle input changes for particulars
  const handleParticularChange = (index, field, value) => {
    const updatedParticulars = [...particularsFormValue.particulars];
    updatedParticulars[index] = {
      ...updatedParticulars[index],
      [field]: value,
    };

    // Recalculate SGST, CGST, and Total Amount
    if (field === "amount" || field === "gst" || field === "excludedGst") {
      const { amount, gst, excludedGst } = updatedParticulars[index];
      const { sgst, cgst } = calculateGst(amount, gst);
      updatedParticulars[index].sgst = sgst;
      updatedParticulars[index].cgst = cgst;
      updatedParticulars[index].totalAmount = excludedGst
        ? parseFloat(amount || 0)
        : parseFloat(amount || 0) + sgst + cgst;
    }

    // Update total tour cost
    const totalCost = updatedParticulars.reduce(
      (sum, item) => sum + (parseFloat(item.totalAmount) || 0),
      0
    );

    setParticularsFormValue({
      ...particularsFormValue,
      particulars: updatedParticulars,
      totalTourCost: {
        ...particularsFormValue.totalTourCost,
        totalCost,
      },
    });
  };

  // Handle total tour cost changes
  const handleTotalTourCostChange = (field, value) => {
    const updatedTotalTourCost = {
      ...particularsFormValue.totalTourCost,
      [field]: value,
    };

    // Recalculate SGST and CGST for total tour cost
    if (field === "gst" || field === "excludedGst") {
      const totalCost = particularsFormValue.particulars.reduce(
        (sum, item) => sum + (parseFloat(item.totalAmount) || 0),
        0
      );
      const { sgst, cgst } = calculateGst(totalCost, updatedTotalTourCost.gst);
      updatedTotalTourCost.sgst = sgst;
      updatedTotalTourCost.cgst = cgst;
      updatedTotalTourCost.totalCost = updatedTotalTourCost.excludedGst
        ? totalCost
        : totalCost + sgst + cgst;
    }

    setParticularsFormValue({
      ...particularsFormValue,
      totalTourCost: updatedTotalTourCost,
    });
  };

  // Add a new particular row
  const addParticular = () => {
    setParticularsFormValue({
      ...particularsFormValue,
      particulars: [
        ...particularsFormValue.particulars,
        {
          particulars: "",
          hsnSac: "",
          amount: "",
          tcs: "",
          tax: "",
          totalAmount: 0,
          state: "",
          gst: "",
          sgst: 0,
          cgst: 0,
          excludedGst: false,
        },
      ],
    });
  };

  // Remove a particular row
  const removeParticular = (index) => {
    const updatedParticulars = particularsFormValue.particulars.filter(
      (_, i) => i !== index
    );
    const totalCost = updatedParticulars.reduce(
      (sum, item) => sum + (parseFloat(item.totalAmount) || 0),
      0
    );

    setParticularsFormValue({
      ...particularsFormValue,
      particulars: updatedParticulars,
      totalTourCost: {
        ...particularsFormValue.totalTourCost,
        totalCost,
      },
    });
  };

  return (
    <div>
      <Modal
        size="xl"
        show={show}
        onHide={handleCloseInvoiveForm}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Generate Invoice
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "10px" }}>
          <div className="ManualInvoice m-0 p-0">
            <Row>
              <Col md={12}>
                <Card>
                  <CardHeader className="my-0 pt-0 border-0">
                    <div className="col-md-12 d-flex justify-content-between align-item-center gap-1 col-sm-12">
                      <div className="col-lg-2 col-md-6"></div>
                      <div className="col-lg-3 col-md-6 mb-1">
                        <div className="d-flex justify-content-end align-content-center gap-1">
                          {/* <div className="d-flex">
                            <button className="btn btn-dark btn-custom-size">
                              <span className="me-1">Back</span>
                              <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
                            </button>
                          </div> */}
                          {/* <div className="Save">
                            <button className="btn btn-primary btn-custom-size">
                              Save
                            </button>
                          </div> */}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <AgentTotalInvoice
                      show={show}
                      handleCloseInvoiveForm={handleCloseInvoiveForm}
                      totalAmount={totalAmount}
                    />
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
          {/* <hr />
          <div className="d-flex justify-content-end gap-2">
            <button className="btn btn-primary btn-custom-size">
              Print Invoice
            </button>
            <div className="cancel">
              <button className="btn btn-dark btn-custom-size" onClick={handleCloseInvoiveForm}>
                Cancel
              </button>
            </div>
            <div className="Save">
              <button className="btn btn-primary btn-custom-size">
                Save
              </button>
            </div>
          </div> */}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default InvoiceFormModal;
