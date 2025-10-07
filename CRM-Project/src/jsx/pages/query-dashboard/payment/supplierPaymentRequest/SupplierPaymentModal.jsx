import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import styles from "./modal.module.css";
import { axiosOther } from "../../../../../http/axios_base_url";
import { notifyError, notifySuccess } from "../../../../../helper/notify";
import UpdateSupplierModal from "./UpdateSupplierModal";
import swal from "sweetalert";
import DarkCustomTimePicker from "../../helper-methods/TimePicker";
import ManualInvoice from "../../Invoices/ManaulInvoice";
import SupplierManaulInvoice from "./SupplierManaulInvoice";

const SupplierPaymentModal = ({
  selectedFormData,
  show,
  handleClose,
  paymentTypeList,
  listFinalSupplierPayment,
  setListFinalSupplierPayment,
  selectedQuotationOption,
  callApiOnSave,
}) => {
  const [totalInvoiceAmount, setTotalInvoiceAmount] = useState(0);
  const [formValue, setFormValue] = useState([
    {
      PaymentTypeId: "",
      Type: "Percent",
      PaymentValue: "100",
      TotalAmount: 0,
      DueDate: "",
      DueTime: "",
      Remarks: "",
      Status: "Unpaid",
    },
  ]);
  const [paidAmount, setPaidAmount] = useState(0);
  const [pendingAmount, setPendingAmount] = useState(0);
  const [selectedUpdatePayment, setSelectedUpdatePayment] = useState({});
  const [showUpdate, setShowUpdate] = useState(false);
  const [errors, setErrors] = useState([]);
  const closeUpdate = () => setShowUpdate(false);
  const [listSupplierBreakupPayment, setListSupplierBreakupPayment] = useState(
    []
  );
  const [agentId, setAgentId] = useState(null);
  const [invoiceShow, setInvoiceShow] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(0);

  const handleInvoiceClose = () => setInvoiceShow(false);
  const handleInvoiceShow = (payment) => {
    console.log(payment, "Pamtt77");
    setSelectedAmount(payment);
    setInvoiceShow(true);
  };

  const queryQuotation = JSON.parse(localStorage.getItem("Query_Qoutation"));

  console.log(listFinalSupplierPayment, "listFinalSupplierPayment");

  const getDataFromApiSupplierChange = async (
    supplierId,
    selectedQuotationOption
  ) => {
    console.log(supplierId, "HGY76");
    try {
      const { data } = await axiosOther.post("listSupplierBreakupPayments", {
        QueryId: queryQuotation?.QueryID,
        QuotationNumber:
          queryQuotation?.QoutationNum ?? selectedQuotationOption,
        Status: "",
        UniqueId: "",
        SupplierId: supplierId,
      });

      console.log(data?.Data, "SUP345");
      setListSupplierBreakupPayment(data?.Data);
    } catch (error) {
      console.log(error);
    }
  };

  const getDataFromApi = async (selectedQuotationOption) => {
    try {
      const { data } = await axiosOther.post("lisFinalQuotation", {
        QueryId: queryQuotation?.QueryID,
        QuotationNumber:
          queryQuotation?.QoutationNum ?? selectedQuotationOption,
      });

      setAgentId(
        data?.FilteredQuotations?.[0]?.QueryInfo?.ContactInfo?.ContactId
      );
    } catch (error) {
      console.error(error);
    }
  };

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = `0${today.getMonth() + 1}`.slice(-2);
    const day = `0${today.getDate()}`.slice(-2);
    return `${year}-${month}-${day}`;
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = `0${now.getHours()}`.slice(-2);
    const minutes = `0${now.getMinutes()}`.slice(-2);
    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    if (selectedQuotationOption) {
      getDataFromApi(selectedQuotationOption);
    }
  }, [selectedQuotationOption]);

  useEffect(() => {
    if (selectedFormData?.SupplierId && selectedQuotationOption) {
      getDataFromApiSupplierChange(
        selectedFormData.SupplierId,
        selectedQuotationOption
      );
    }
  }, [selectedFormData, selectedQuotationOption]);

  useEffect(() => {
    const finalPrice = selectedFormData?.FinalPrice || 0;
    setTotalInvoiceAmount(finalPrice);

    let mappedData = [];
    let totalPaid = 0;

    if (listSupplierBreakupPayment?.length > 0) {
      mappedData = listSupplierBreakupPayment.map((breakupItem) => {
        const matchingFinalItem = listFinalSupplierPayment?.find(
          (finalItem) =>
            finalItem.UniqueId === breakupItem.UniqueId &&
            finalItem.Status === "Paid"
        );

        if (matchingFinalItem) {
          totalPaid += parseFloat(matchingFinalItem.TotalAmount) || 0;
          return {
            PaymentTypeId: matchingFinalItem.PaymentTypeId,
            Type: matchingFinalItem.Type,
            PaymentValue: matchingFinalItem.PaymentValue,
            TotalAmount: matchingFinalItem.TotalAmount,
            DueDate: matchingFinalItem.DueDate,
            DueTime: matchingFinalItem.DueTime,
            Remarks: matchingFinalItem.Remarks,
            Status: matchingFinalItem.Status,
            UniqueId: matchingFinalItem.UniqueId,
          };
        } else {
          return {
            PaymentTypeId: breakupItem.PaymentTypeId,
            Type: breakupItem.Type,
            PaymentValue: breakupItem.PaymentValue,
            TotalAmount: breakupItem.TotalAmount,
            DueDate: breakupItem.DueDate,
            DueTime: breakupItem.DueTime,
            Remarks: breakupItem.Remarks,
            Status: breakupItem.Status,
            UniqueId: breakupItem.UniqueId,
          };
        }
      });
    }

    if (mappedData.length > 0) {
      setFormValue(mappedData);
      setPaidAmount(totalPaid);
      setPendingAmount(finalPrice - totalPaid);

      const { remainingAmount, remainingPercent } = calculateRemaining(
        mappedData,
        finalPrice
      );
      if (remainingAmount > 0) {
        setFormValue((prev) => [
          ...prev,
          {
            PaymentTypeId: "2",
            Type: "Percent",
            PaymentValue: remainingPercent.toFixed(2),
            TotalAmount: remainingAmount,
            DueDate: getCurrentDate(),
            DueTime: getCurrentTime(),
            Remarks: "",
            Status: "Unpaid",
          },
        ]);
      }
    } else {
      setFormValue([
        {
          PaymentTypeId: "2",
          Type: "Percent",
          PaymentValue: "100",
          TotalAmount: finalPrice,
          DueDate: getCurrentDate(),
          DueTime: getCurrentTime(),
          Remarks: "",
          Status: "Unpaid",
        },
      ]);
      setPaidAmount(0);
      setPendingAmount(finalPrice);
    }
    setErrors([]); // Reset errors when form data updates
  }, [selectedFormData, listSupplierBreakupPayment, listFinalSupplierPayment]);

  const calculateAmount = (Type, value, total) => {
    if (Type === "Percent") return (value / 100) * total;
    return parseFloat(value) || 0;
  };

  const calculateRemaining = (rows, total) => {
    let remainingAmount = total;
    let remainingPercent = 100;

    rows.forEach((row) => {
      if (row.Type === "Percent") {
        remainingPercent -= parseFloat(row.PaymentValue) || 0;
        remainingAmount -= (parseFloat(row.PaymentValue) / 100) * total;
      } else {
        remainingAmount -= parseFloat(row.PaymentValue) || 0;
        remainingPercent = (remainingAmount / total) * 100;
      }
    });

    return { remainingAmount, remainingPercent };
  };

  const validateRow = (row, index) => {
    const rowErrors = {};
    const requiredFields = [
      "PaymentTypeId",
      "Type",
      "PaymentValue",
      "DueDate",
      "DueTime",
      // "Remarks",
    ];

    requiredFields.forEach((field) => {
      if (!row[field]) {
        rowErrors[field] = "This field is required";
      }
    });

    if (row.PaymentValue && Number(row.PaymentValue) <= 0) {
      rowErrors.PaymentValue = "Value must be greater than 0";
    }

    // Validate if PaymentValue exceeds remaining amount
    const { remainingAmount } = calculateRemaining(
      formValue.filter((_, idx) => idx !== index),
      totalInvoiceAmount
    );
    const enteredAmount = calculateAmount(
      row.Type,
      row.PaymentValue,
      totalInvoiceAmount
    );
    if (enteredAmount > remainingAmount) {
      rowErrors.PaymentValue = `Value exceeds remaining amount (${remainingAmount.toFixed(
        2
      )})`;
    }

    return rowErrors;
  };

  const handleFormValueChange = (index, field, value) => {
    // agar PaymentValue hai to 100 se bada na hone do
    if (field === "PaymentValue") {
      if (Number(value) > 100) {
        value = 100; // forcefully 100 set kar do
      } else if (Number(value) < 0) {
        value = 0; // negative value bhi na allow ho
      }
    }

    setFormValue((prev) =>
      prev.map((row, i) => {
        if (i !== index) return row;
        const updatedRow = { ...row, [field]: value };

        if (field === "Type") {
          const { remainingAmount, remainingPercent } = calculateRemaining(
            prev.filter((_, idx) => idx !== index),
            totalInvoiceAmount
          );
          if (value === "Flat") {
            updatedRow.PaymentValue = remainingAmount.toFixed(2);
            updatedRow.TotalAmount = remainingAmount;
          } else {
            updatedRow.PaymentValue = remainingPercent.toFixed(2);
            updatedRow.TotalAmount = calculateAmount(
              "Percent",
              remainingPercent,
              totalInvoiceAmount
            );
          }
        } else if (field === "PaymentValue") {
          updatedRow.PaymentValue = value;
          updatedRow.TotalAmount = calculateAmount(
            updatedRow.Type,
            value,
            totalInvoiceAmount
          );
        }

        return updatedRow;
      })
    );

    setErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = { ...newErrors[index], [field]: "" };
      return newErrors;
    });
  };

  const handleSave = async (index, row) => {
    const rowErrors = validateRow(row, index);
    if (Object.keys(rowErrors).length > 0) {
      setErrors((prev) => {
        const newErrors = [...prev];
        newErrors[index] = rowErrors;
        return newErrors;
      });
      return;
    }

    const payload = {
      QueryId: queryQuotation?.QueryID,
      QuotationNo: queryQuotation?.QoutationNum ?? selectedQuotationOption,
      SupplierId: selectedFormData?.SupplierId,
      ...row,
    };

    console.log(payload, "FORMV");
    try {
      const { data } = await axiosOther.post("store-supplierpayment", payload);
      console.log(data, "SaveData");

      if (data?.Status === 1) {
        await getDataFromApiSupplierChange(
          selectedFormData.SupplierId,
          selectedQuotationOption
        );
        notifySuccess(data?.Message || "Payment details stored successfully.");
      }
    } catch (error) {
      notifyError("Something went wrong.");
      console.log(error);
    }
  };

  const handleUpdatePayment = (selectedData) => {
    const updatedData = {
      ...selectedData,
      SupplierId: selectedFormData?.SupplierId,
    };

    console.log(updatedData, "SELE34");

    setSelectedUpdatePayment(updatedData);
    setShowUpdate(true);
  };

  const handlePaidUpdate = async () => {
    await swal({
      title: "Payment already paid",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });
  };

  const handleSaved = async () => {
    await swal({
      title: "Payment is already saved",
      icon: "warning",
      buttons: {
        confirm: {
          text: "Ok",
          value: true,
          visible: true,
          className: "btn-custom-size btn btn-primary",
          closeModal: true,
        },
      },
      dangerMode: true,
    });
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        aria-labelledby="example-modal-sizes-title-lg"
        dialogClassName={styles.customModal}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Update Payment - {selectedFormData?.SupplierName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="table-responsive SupplierPaymentRequest">
            <div className="d-flex gap-2 justify-content-start flex-wrap amt mb-2">
              <div className="col p-2 col-2">
                <div className="number" style={{ color: "#32C100" }}>
                  {totalInvoiceAmount.toFixed(2)}
                </div>
                <div className="name mt-1">Total Amount</div>
              </div>
              <div className="col p-2 col-2">
                <div className="number" style={{ color: "#F0AD00" }}>
                  {pendingAmount.toFixed(2)}
                </div>
                <div className="name mt-1">Pending</div>
              </div>
              <div className="col p-2 col-2">
                <div className="number" style={{ color: "#32C100" }}>
                  {paidAmount.toFixed(2)}
                </div>
                <div className="name mt-1">Paid</div>
              </div>
            </div>

            <table className="table table-bordered itinerary-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Payment Type</th>
                  <th style={{ minWidth: "70px" }}>Type</th>
                  <th>Value</th>
                  <th>Amount</th>
                  <th>Due Date</th>
                  <th>Due Time</th>
                  <th>Remarks</th>
                  <th style={{ width: "230px" }}>Actions</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {formValue.map((row, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <select
                        name="PaymentTypeId"
                        className={`form-control form-control-sm mt-2 ${
                          errors[index]?.PaymentTypeId ? "is-invalid" : ""
                        }`}
                        value={row.PaymentTypeId}
                        onChange={(e) =>
                          handleFormValueChange(
                            index,
                            "PaymentTypeId",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select</option>
                        <option value="1">On Credit</option>
                        <option value="2">Advanced Payment</option>
                        <option value="3">Balance Payment</option>
                        <option value="4">Direct Payment</option>
                        <option value="5">Full Payment</option>
                      </select>
                      {errors[index]?.PaymentTypeId && (
                        <div className="invalid-feedback">
                          {errors[index].PaymentTypeId}
                        </div>
                      )}
                    </td>
                    <td>
                      <select
                        name="Type"
                        className={`form-control form-control-sm ${
                          errors[index]?.Type ? "is-invalid" : ""
                        }`}
                        value={row.Type}
                        onChange={(e) =>
                          handleFormValueChange(index, "Type", e.target.value)
                        }
                      >
                        <option value="">Select</option>
                        <option value="Percent">%</option>
                        <option value="Flat">Flat</option>
                      </select>
                      {errors[index]?.Type && (
                        <div className="invalid-feedback">
                          {errors[index].Type}
                        </div>
                      )}
                    </td>
                    <td>
                      <input
                        name="PaymentValue"
                        type="number"
                        className={`form-control form-control-sm ${
                          errors[index]?.PaymentValue ? "is-invalid" : ""
                        }`}
                        placeholder="Enter value"
                        value={row.PaymentValue}
                        onChange={(e) =>
                          handleFormValueChange(
                            index,
                            "PaymentValue",
                            e.target.value
                          )
                        }
                        max="100"
                      />
                      {errors[index]?.PaymentValue && (
                        <div className="invalid-feedback">
                          {errors[index].PaymentValue}
                        </div>
                      )}
                    </td>
                    <td className="text-center">
                      {Math.ceil(row.TotalAmount)}
                    </td>
                    <td>
                      <input
                        type="date"
                        name="DueDate"
                        className={`form-control form-control-sm ${
                          errors[index]?.DueDate ? "is-invalid" : ""
                        }`}
                        placeholder="dd-mm-yyyy"
                        value={row.DueDate}
                        onChange={(e) =>
                          handleFormValueChange(
                            index,
                            "DueDate",
                            e.target.value
                          )
                        }
                      />
                      {errors[index]?.DueDate && (
                        <div className="invalid-feedback">
                          {errors[index].DueDate}
                        </div>
                      )}
                    </td>
                    <td>
                      {/* <input
                        type="time"
                        name="DueTime"
                        className={`form-control form-control-sm ${errors[index]?.DueTime ? "is-invalid" : ""
                          }`}
                        value={row.DueTime}
                        onChange={(e) =>
                          handleFormValueChange(
                            index,
                            "DueTime",
                            e.target.value
                          )
                        }
                      /> */}
                      <DarkCustomTimePicker
                        name="DueTime"
                        className={`form-control form-control-sm ${
                          errors[index]?.DueTime ? "is-invalid" : ""
                        }`}
                        value={row.DueTime}
                        onChange={(e) =>
                          handleFormValueChange(
                            index,
                            "DueTime",
                            e.target.value
                          )
                        }
                      />
                      {errors[index]?.DueTime && (
                        <div className="invalid-feedback">
                          {errors[index].DueTime}
                        </div>
                      )}
                    </td>
                    <td>
                      <input
                        type="text"
                        name="Remarks"
                        className={`form-control form-control-sm ${
                          errors[index]?.Remarks ? "is-invalid" : ""
                        }`}
                        placeholder="Enter remarks"
                        value={row.Remarks}
                        onChange={(e) =>
                          handleFormValueChange(
                            index,
                            "Remarks",
                            e.target.value
                          )
                        }
                      />
                      {errors[index]?.Remarks && (
                        <div className="invalid-feedback">
                          {errors[index].Remarks}
                        </div>
                      )}
                    </td>
                    <td>
                      {row?.UniqueId ? (
                        <button
                          onClick={handleSaved}
                          className="btn btn-custom-size btn-primary me-2"
                        >
                          <span>Saved</span>
                        </button>
                      ) : (
                        <button
                          className="btn btn-custom-size btn-primary me-2"
                          onClick={() => handleSave(index, row)}
                        >
                          <span>Save</span>
                        </button>
                      )}
                      {row?.Status === "Paid" ? (
                        <button
                          onClick={() => handlePaidUpdate()}
                          className="btn btn-custom-size btn-primary me-2"
                        >
                          <span>Update</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdatePayment(row)}
                          className="btn btn-custom-size btn-primary me-2"
                          disabled={!row?.UniqueId}
                        >
                          <span>Update</span>
                        </button>
                      )}
                      <button
                        className="btn btn-custom-size btn-primary me-2"
                        onClick={() => handleInvoiceShow(row.TotalAmount)}
                        disabled={row?.Status !== "Paid"}
                      >
                        <span>Invoice</span>
                      </button>
                    </td>
                    <td>
                      <span
                        className={
                          formValue[index]?.Status === "Unpaid"
                            ? "badge badge-danger light badge"
                            : "badge badge-success light badge"
                        }
                      >
                        {formValue[index]?.Status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal.Body>
      </Modal>

      <Modal size="xl" show={invoiceShow} onHide={handleInvoiceClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Invoice Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {invoiceShow && (
            <SupplierManaulInvoice
              supplierData={selectedFormData}
              totalAmount={selectedAmount}
              handleInvoiceCloses={handleInvoiceClose}
            />
          )}
        </Modal.Body>
        {/* <Modal.Footer>
          <Button variant="secondary" onClick={handleInvoiceClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => alert("Invoice Saved!")}>
            Save
          </Button>
        </Modal.Footer> */}
      </Modal>

      <UpdateSupplierModal
        show={showUpdate}
        handleClose={closeUpdate}
        selectedUpdatePayment={selectedUpdatePayment}
        paymentTypeList={paymentTypeList}
        listFinalSupplierPayment={listFinalSupplierPayment}
        setListFinalSupplierPayment={setListFinalSupplierPayment}
        agentId={agentId}
        selectedFormData={selectedFormData}
        selectedQuotationOption={selectedQuotationOption}
        callApiOnSave={callApiOnSave}
      />
    </>
  );
};

export default SupplierPaymentModal;
