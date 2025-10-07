import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { axiosOther } from "../../../../../http/axios_base_url";
import { notifySuccess } from "../../../../../helper/notify";

const PaymentModal = ({
  show,
  handleClose,
  selectedFormData,
  paymentTypeList,
  agentId,
  setAgentPaymentList,
  selectedQuotationOption,
}) => {
  const [agentList, setAgentList] = useState(null);
  const [formData, setFormData] = useState({
    agentName: "",
    paymentType: "",
    paymentAmount: "",
    dueDate: "",
    bankName: "",
    transactionId: "",
    description: "",
    UniqueId: "",
  });
  const [errors, setErrors] = useState({});
  const queryQuotation = JSON.parse(localStorage.getItem("Query_Qoutation"));

  useEffect(() => {
    if (selectedFormData?.Status === "Paid") {
      const updateFormData = {
        agentName: selectedFormData?.AgentName || "",
        paymentType: "",
        paymentAmount: selectedFormData?.TotalAmount || "",
        dueDate: selectedFormData?.DueDate || "",
        bankName: selectedFormData?.BankName || "",
        transactionId: selectedFormData?.TransactionId || "",
        description: selectedFormData?.Desc || "",
        UniqueId: selectedFormData?.UniqueId || "",
      };
      setFormData(updateFormData);
    } else {
      const updatedFormData = {
        agentName: agentList?.name || "",
        paymentType: "",
        paymentAmount: selectedFormData?.TotalAmount || "",
        dueDate: selectedFormData?.DueDate || "",
        bankName: "",
        transactionId: "",
        description: "",
        UniqueId: selectedFormData?.UniqueId || "",
      };
      setFormData(updatedFormData);
    }
    // Reset errors when form data changes
    setErrors({});
  }, [selectedFormData, agentList]);

  const getDataFromApi = async (selectedQuotationOption) => {
    try {
      const { data } = await axiosOther.post("agentlist", {
        id: String(agentId),
        BussinessType: "",
      });

      const agentName = data?.DataList[0]?.ContactList[0]?.CompanyName;
      setAgentList({
        id: agentId,
        name: agentName,
      });

      // Update formData with agentName
      setFormData((prev) => ({ ...prev, agentName }));
    } catch (error) {
      console.log(error);
    }

    try {
      const { data } = await axiosOther.post("list-agent-payments", {
        QueryId: queryQuotation?.QueryID,
        QuotationNumber:
          queryQuotation?.QoutationNum ?? selectedQuotationOption,
        Status: "",
        UniqueId: "",
      });

      setAgentPaymentList(data?.Data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (selectedQuotationOption) {
      getDataFromApi(selectedQuotationOption);
    }
  }, [agentId, selectedQuotationOption]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for the field when user starts typing
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.paymentType) {
      newErrors.paymentType = "Payment Type is required";
    }

    if (!formData.paymentAmount || formData.paymentAmount <= 0) {
      newErrors.paymentAmount = "Payment Amount must be a positive number";
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Date is required";
    }

    if (!formData.bankName) {
      newErrors.bankName = "Bank Name is required";
    }

    if (!formData.transactionId) {
      newErrors.transactionId = "Transaction ID is required";
    }

    // if (!formData.description) {
    //   newErrors.description = "Description is required";
    // }

    return newErrors;
  };

  const handleSave = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const payload = {
      QueryId: queryQuotation?.QueryID,
      QuotationNo: queryQuotation?.QoutationNum ?? selectedQuotationOption,
      UniqueId: formData?.UniqueId,
      AgentId: agentId,
      PaymentThrough: formData?.paymentType,
      PaymentAmount: formData?.paymentAmount,
      BankName: formData?.bankName,
      TransactionId: formData?.transactionId,
      Date: formData?.dueDate,
      Desc: formData?.description,
    };

    try {
      const { data } = await axiosOther.post("update-agentpayment", payload);
      if (data?.Status === 1) {
        notifySuccess(data?.Message || "Payment updated.");
        await getDataFromApi(selectedQuotationOption);
      }
    } catch (error) {
      console.log(error);
    }

    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} size="md" centered>
      <Modal.Header closeButton>
        <Modal.Title>UPDATE PAYMENT</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className="row">
          <Form.Group className="col-6">
            <Form.Label>Agent/Client Name</Form.Label>
            <input
              type="text"
              className="form-control form-control-sm"
              name="agentName"
              value={formData.agentName}
              disabled
            />
          </Form.Group>
          <Form.Group className="col-6">
            <Form.Label>Payment Type</Form.Label>
            <select
              name="paymentType"
              className={`form-control form-control-sm ${
                errors.paymentType ? "is-invalid" : ""
              }`}
              value={formData.paymentType}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              {paymentTypeList?.length > 0 &&
                paymentTypeList.map((type, idx) => (
                  <option key={idx} value={type.PaymentTypeName}>
                    {type.PaymentTypeName}
                  </option>
                ))}
            </select>
            {errors.paymentType && (
              <div className="invalid-feedback">{errors.paymentType}</div>
            )}
          </Form.Group>
          <Form.Group className="col-6">
            <Form.Label>Payment Amount</Form.Label>
            <input
              className={`form-control form-control-sm ${
                errors.paymentAmount ? "is-invalid" : ""
              }`}
              type="number"
              name="paymentAmount"
              value={formData.paymentAmount}
              onChange={handleInputChange}
            />
            {errors.paymentAmount && (
              <div className="invalid-feedback">{errors.paymentAmount}</div>
            )}
          </Form.Group>
          <Form.Group className="col-6">
            <Form.Label>Date</Form.Label>
            <input
              className={`form-control form-control-sm ${
                errors.dueDate ? "is-invalid" : ""
              }`}
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
            />
            {errors.dueDate && (
              <div className="invalid-feedback">{errors.dueDate}</div>
            )}
          </Form.Group>
          <Form.Group className="col-6">
            <Form.Label>Bank Name</Form.Label>
            <input
              className={`form-control form-control-sm ${
                errors.bankName ? "is-invalid" : ""
              }`}
              type="text"
              name="bankName"
              value={formData.bankName}
              onChange={handleInputChange}
            />
            {errors.bankName && (
              <div className="invalid-feedback">{errors.bankName}</div>
            )}
          </Form.Group>
          <Form.Group className="col-6">
            <Form.Label>Transaction Id / Cheque Number</Form.Label>
            <input
              className={`form-control form-control-sm ${
                errors.transactionId ? "is-invalid" : ""
              }`}
              type="text"
              name="transactionId"
              value={formData.transactionId}
              onChange={handleInputChange}
            />
            {errors.transactionId && (
              <div className="invalid-feedback">{errors.transactionId}</div>
            )}
          </Form.Group>
          <Form.Group className="col-12">
            <Form.Label>Description</Form.Label>
            <textarea
              className={`form-control form-control-sm ${
                errors.description ? "is-invalid" : ""
              }`}
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
            {errors.description && (
              <div className="invalid-feedback">{errors.description}</div>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <button
          className="btn btn-primary btn-custom-size"
          onClick={handleSave}
        >
          Update
        </button>
        <button className="btn btn-dark btn-custom-size" onClick={handleClose}>
          Cancel
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default PaymentModal;
