import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { axiosOther } from "../../../../../http/axios_base_url";
import { notifySuccess } from "../../../../../helper/notify";

const UpdateSupplierModal = ({
  show,
  handleClose,
  selectedUpdatePayment,
  paymentTypeList,
  listFinalSupplierPayment,
  setListFinalSupplierPayment,
  agentId,
  selectedFormData,
  selectedQuotationOption,
  callApiOnSave,
}) => {
  console.log(agentId, "AID098");

  const [formData, setFormData] = useState({
    PaymentTypeId: "",
    PaymentAmount: "",
    Date: "",
    Desc: "",
    BankName: "",
    TransactionId: "",
    ImageData: "",
    ImageName: "",
    SupplierId: "",
  });

  const [errors, setErrors] = useState({});

  const queryQuotation = JSON.parse(localStorage.getItem("Query_Qoutation"));
  const [agentList, setAgentList] = useState([]);

  const getDataFromApi = async () => {
    try {
      const { data } = await axiosOther.post("list-supplier-payments", {
        QueryId: queryQuotation?.QueryID,
        QuotationNumber:
          queryQuotation?.QoutationNum ?? selectedQuotationOption,
      });

      console.log(data?.Data, "RATELIST");
      setListFinalSupplierPayment(data?.Data);
    } catch (error) {
      console.log(error);
    }
  };

  const agentNameFromApi = async (agentID) => {
    const { data } = await axiosOther.post("agentlist", {
      id: String(agentID),
      BussinessType: "",
    });

    console.log(data?.DataList[0]?.ContactList[0]?.CompanyName, "ufhfg");
    const agentName = data?.DataList[0]?.ContactList[0]?.CompanyName;
    setAgentList({
      id: agentID,
      name: agentName,
    });
  };

  useEffect(() => {
    if (agentId) {
      agentNameFromApi(agentId);
    }
  }, [agentId]);

  useEffect(() => {
    setFormData((prevData) => {
      return {
        ...prevData,
        SupplierId: selectedUpdatePayment?.SupplierId || "",
        PaymentTypeId: selectedUpdatePayment?.PaymentTypeId || "",
        PaymentAmount: selectedUpdatePayment?.TotalAmount || "",
        Date: selectedUpdatePayment?.DueDate || "",
        Desc: selectedUpdatePayment?.Remarks || "",
        BankName: selectedUpdatePayment?.BankName || "",
        TransactionId: selectedUpdatePayment?.TransactionId || "",
        UniqueId: selectedUpdatePayment?.UniqueId,
      };
    });
    // Reset errors when form data updates
    setErrors({});
  }, [selectedUpdatePayment]);

  console.log(selectedFormData, "FFT44");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Clear error for the field being edited
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "PaymentTypeId",
      "PaymentAmount",
      "Date",
      // "Desc",
      "BankName",
      "TransactionId",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
      }
    });

    // Additional validation for PaymentAmount
    if (formData.PaymentAmount && Number(formData.PaymentAmount) <= 0) {
      newErrors.PaymentAmount = "Amount must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdatePayment = async () => {
    if (!validateForm()) {
      return;
    }

    const selectedType = paymentTypeList.find(
      (type) => type.id == formData.PaymentTypeId
    );
    console.log(selectedType, "HHY7", formData.PaymentTypeId);

    const payload = {
      QueryId: queryQuotation?.QueryID,
      QuotationNo: queryQuotation?.QoutationNum,
      ...formData,
      PaymentThrough: selectedType?.PaymentTypeName,
      SupplierId: String(formData.SupplierId),
    };
    console.log(payload, "DATAF222");

    try {
      const { data } = await axiosOther.post("update-supplierpayment", payload);
      console.log(data, "FHSNHS88");

      if (data?.Status === 1) {
        notifySuccess(data?.Message || "Payment updated successfully.");
        handleClose();
        await getDataFromApi();
        await callApiOnSave();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="md" centered>
      <Modal.Header closeButton>
        <Modal.Title>UPDATE PAYMENT</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className="row">
          <Form.Group className="col-6">
            <Form.Label>Supplier name</Form.Label>
            <div>
              <input
                className="form-control form-control-sm"
                type="text"
                name="Agent"
                value={selectedFormData?.SupplierName}
                onChange={handleChange}
                disabled
              />
            </div>
          </Form.Group>

          <Form.Group className="col-6">
            <Form.Label>Payment Type</Form.Label>
            <select
              name="PaymentTypeId"
              className={`form-control form-control-sm ${errors.PaymentTypeId ? "is-invalid" : ""
                }`}
              value={formData?.PaymentTypeId}
              onChange={handleChange}
            >
              <option value="">Select</option>
              {paymentTypeList?.length > 0 &&
                paymentTypeList.map((type, idx) => (
                  <option key={idx} value={type.id}>
                    {type.PaymentTypeName}
                  </option>
                ))}
            </select>
            {errors.PaymentTypeId && (
              <div className="invalid-feedback">{errors.PaymentTypeId}</div>
            )}
          </Form.Group>

          <Form.Group className="col-6">
            <Form.Label>Payment Amount</Form.Label>
            <input
              className={`form-control form-control-sm ${errors.PaymentAmount ? "is-invalid" : ""
                }`}
              type="number"
              name="PaymentAmount"
              value={formData?.PaymentAmount}
              onChange={handleChange}
            />
            {errors.PaymentAmount && (
              <div className="invalid-feedback">{errors.PaymentAmount}</div>
            )}
          </Form.Group>

          <Form.Group className="col-6">
            <Form.Label>Date</Form.Label>
            <input
              className={`form-control form-control-sm ${errors.Date ? "is-invalid" : ""
                }`}
              type="date"
              name="Date"
              value={formData?.Date}
              onChange={handleChange}
            />
            {errors.Date && (
              <div className="invalid-feedback">{errors.Date}</div>
            )}
          </Form.Group>

          <Form.Group className="col-6">
            <Form.Label>Bank Name</Form.Label>
            <input
              className={`form-control form-control-sm ${errors.BankName ? "is-invalid" : ""
                }`}
              type="text"
              name="BankName"
              value={formData?.BankName}
              onChange={handleChange}
            />
            {errors.BankName && (
              <div className="invalid-feedback">{errors.BankName}</div>
            )}
          </Form.Group>

          <Form.Group className="col-6">
            <Form.Label>Transaction Id / Cheque Number</Form.Label>
            <input
              className={`form-control form-control-sm ${errors.TransactionId ? "is-invalid" : ""
                }`}
              type="text"
              name="TransactionId"
              value={formData?.TransactionId}
              onChange={handleChange}
            />
            {errors.TransactionId && (
              <div className="invalid-feedback">{errors.TransactionId}</div>
            )}
          </Form.Group>

          <Form.Group className="col-12">
            <Form.Label>Description</Form.Label>
            <textarea
              className={`form-control form-control-sm `}
              name="Desc"
              value={formData?.Desc}
              onChange={handleChange}
            ></textarea>
            {/* {errors.Desc && (
              <div className="invalid-feedback">{errors.Desc}</div>
            )} */}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <button
          className="btn btn-primary btn-custom-size"
          onClick={handleUpdatePayment}
        >
          Save
        </button>
        <button className="btn btn-dark btn-custom-size" onClick={handleClose}>
          Cancel
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateSupplierModal;
