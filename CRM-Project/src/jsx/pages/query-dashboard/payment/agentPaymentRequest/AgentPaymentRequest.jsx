import React, { useEffect, useState } from "react";
import { Row, Col, Card } from "react-bootstrap";
import DatePicker from "react-datepicker";
import UpdatePaymentModal from "./UpdatePaymentModal";
import PaymentList from "./PaymentList";
import { axiosOther } from "../../../../../http/axios_base_url";
import { notifySuccess, notifyError } from "../../../../../helper/notify";
import GenerateInvoiceModal from "../GenerateInvoiceModal";
import PaymentReceiptModal from "../PaymentReceiptModal";
import swal from "sweetalert";
import InvoiceFormModal from "./InvoiceFormModal";
import PerfectScrollbar from "react-perfect-scrollbar";
import DarkCustomTimePicker from "../../helper-methods/TimePicker";
import AgentTotalInvoice from "./AgentTotalInvoice";

const AgentPaymentRequest = ({ selectedQuotationOption }) => {
  const [formValue, setFormValue] = useState([]);
  const [paymentTypeList, setPaymentTypeList] = useState([]);
  const [finalPaymentList, setFinalPaymentList] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [agentId, setAgentId] = useState("");
  const [lgShow, setLgShow] = useState(false);
  const [errors, setErrors] = useState([]);
  const handleCloselgShow = () => setLgShow(false);
  const [invoiveForm, setInvoiveForm] = useState(false);
  const handleCloseInvoiveForm = () => setInvoiveForm(false);
  const [agentBreakupPayment, setAgentBreakupPayment] = useState([]);
  const [agentPaymentList, setAgentPaymentList] = useState([]);
  const [selectedFormData, setSelectedFormData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const [agentName, setAgentName] = useState("");
  const [selectedAmount, setSelectedAmount] = useState(0);

  const queryQuotation = JSON.parse(localStorage.getItem("Query_Qoutation"));

  const getDataFromApi = async (selectedQuotationOption) => {
    try {
      setLoading(true);
      const { data: paymentTypeData } = await axiosOther.post(
        "paymenttypelist"
      );
      setPaymentTypeList(paymentTypeData?.DataList);

      const { data: finalPaymentData } = await axiosOther.post(
        "list-final-payment",
        {
          QueryId: queryQuotation?.QueryID,
          QuotationNumber:
            queryQuotation?.QoutationNum ?? selectedQuotationOption,
        }
      );
      setFinalPaymentList(finalPaymentData?.Data);

      const { data } = await axiosOther.post("listAgentBreakupPayments", {
        QueryId: queryQuotation?.QueryID,
        QuotationNumber:
          queryQuotation?.QoutationNum ?? selectedQuotationOption,
        Status: "",
        UniqueId: "",
      });
      setAgentBreakupPayment(data?.Data);

      console.log(data?.Data, "DATAF");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }

    try {
      const { data } = await axiosOther.post("lisFinalQuotation", {
        QueryId: queryQuotation?.QueryID,
        QuotationNumber:
          queryQuotation?.QoutationNum ?? selectedQuotationOption,
      });
      console.log(data?.FilteredQuotations?.[0], "HGY676");
      setAgentName(
        data?.FilteredQuotations?.[0]?.QueryInfo?.ContactInfo?.ContactPersonName
      );
      setAgentId(
        data?.FilteredQuotations?.[0]?.QueryInfo?.ContactInfo?.ContactId
      );
    } catch (error) {
      console.error(error);
    }

    try {
      const { data } = await axiosOther.post("list-agent-payments", {
        QueryId: queryQuotation?.QueryID,
        QuotationNumber:
          queryQuotation?.QoutationNum ?? selectedQuotationOption,
        Status: "",
        UniqueId: "",
      });
      console.log(data?.Data, "GHY67");
      setAgentPaymentList(data?.Data);
    } catch (error) {
      console.log(error);
    }
  };

  const getDataFromApiWhenSave = async (selectedQuotationOption) => {
    const { data } = await axiosOther.post("listAgentBreakupPayments", {
      QueryId: queryQuotation?.QueryID,
      QuotationNumber: queryQuotation?.QoutationNum ?? selectedQuotationOption,
      Status: "",
      UniqueId: "",
    });
    setAgentBreakupPayment(data?.Data);
  };

  useEffect(() => {
    if (selectedQuotationOption) {
      getDataFromApi(selectedQuotationOption);
    }
  }, [selectedQuotationOption]);

  useEffect(() => {
    if (
      finalPaymentList?.length > 0 &&
      finalPaymentList[0]?.PaymentInfo?.TotalPaymentInfo?.SellAmount
    ) {
      const newTotalAmount =
        finalPaymentList[0].PaymentInfo.TotalPaymentInfo.SellAmount;
      setTotalAmount(newTotalAmount);

      if (agentBreakupPayment?.length > 0) {
        const formattedPayments = agentBreakupPayment.map((payment) => ({
          PaymentTypeId: payment.PaymentTypeId,
          Type: payment.Type || "Percent",
          PaymentValue: payment.PaymentValue,
          TotalAmount: payment.TotalAmount,
          DueDate: payment.DueDate ? new Date(payment.DueDate) : new Date(),
          DueTime: payment.DueTime || getCurrentTime(),
          Status: payment.Status,
          Remarks: payment.Remarks,
          UniqueId: payment?.UniqueId,
        }));

        const { remainingAmount, remainingPercent } = calculateRemaining(
          formattedPayments,
          newTotalAmount
        );

        // Only add a new row if remainingPercent or remainingAmount is significant
        const newRows = [...formattedPayments];
        if (remainingPercent > 0.01 || remainingAmount > 0.01) {
          const newRow = {
            PaymentTypeId: "2",
            Type: "Percent",
            PaymentValue: remainingPercent,
            TotalAmount: remainingAmount,
            DueDate: new Date(),
            DueTime: getCurrentTime(),
            Status: "Unpaid",
            Remarks: "",
            UniqueId: "",
          };
          newRows.push(newRow);
        }

        setFormValue(newRows);
      } else {
        // If no agentBreakupPayment, initialize with a single row for the full amount
        setFormValue([
          {
            PaymentTypeId: "2",
            Type: "Percent",
            PaymentValue: 100,
            TotalAmount: newTotalAmount,
            DueDate: new Date(),
            DueTime: getCurrentTime(),
            Status: "Unpaid",
            Remarks: "",
          },
        ]);
      }
      setErrors([]); // Reset errors when form data updates
    }
  }, [agentBreakupPayment, finalPaymentList]);

  const formatDateForValue = (dateObj) => {
    if (!dateObj) return "";
    const date = new Date(dateObj);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const calculateAmount = (Type, value, total) => {
    if (Type === "Percent") return (value / 100) * total;
    return parseFloat(value) || 0;
  };

  const calculateRemaining = (formValue, total) => {
    let remainingAmount = total;
    let remainingPercent = 100;

    formValue.forEach((row) => {
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

  function getCurrentTime() {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  }

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
      formValue.filter((_, i) => i !== index),
      totalAmount
    );
    const enteredAmount = calculateAmount(
      row.Type,
      row.PaymentValue,
      totalAmount
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


    const updatedRows = [...formValue];
    updatedRows[index][field] = value;

    if (field === "Type") {
      const { remainingAmount, remainingPercent } = calculateRemaining(
        updatedRows.filter((_, i) => i !== index),
        totalAmount
      );
      if (value === "Flat") {
        updatedRows[index].PaymentValue = remainingAmount;
        updatedRows[index].TotalAmount = remainingAmount;
      } else {
        updatedRows[index].PaymentValue = remainingPercent;
        updatedRows[index].TotalAmount = calculateAmount(
          "Percent",
          remainingPercent,
          totalAmount
        );
      }
    } else if (field === "PaymentValue") {
      updatedRows[index].TotalAmount = calculateAmount(
        updatedRows[index].Type,
        value,
        totalAmount
      );
    }

    setFormValue(updatedRows);
    setErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = { ...newErrors[index], [field]: "" };
      return newErrors;
    });
  };

  const handleSaveIt = async (index) => {
    const formData = formValue[index];
    const rowErrors = validateRow(formData, index);

    if (Object.keys(rowErrors).length > 0) {
      setErrors((prev) => {
        const newErrors = [...prev];
        newErrors[index] = rowErrors;
        return newErrors;
      });
      return;
    }

    const payload = {
      ...formData,
      QueryId: queryQuotation?.QueryID,
      QuotationNo: queryQuotation?.QoutationNum ?? selectedQuotationOption,
      DueDate: formatDateForValue(formData.DueDate),
      Remarks: formData.Remarks,
    };

    // console.log(formData, "PAYLOAD");

    try {
      const { data } = await axiosOther.post("store-agentpayment", payload);
      if (data?.Status === 1) {
        await getDataFromApiWhenSave(selectedQuotationOption);
        notifySuccess(data?.Message || "Payment is saved.");
      }
    } catch (error) {
      console.log(error);
      notifyError("Something went wrong.");
    }
  };
  console.log(paymentTypeList, "paymentTypeList")

  const handleUpdatePayment = (selectedData) => {
    let updatedData;
    const agent = agentPaymentList.find(
      (agent) => agent.UniqueId === selectedData.UniqueId
    );

    if (agent?.Status === "Paid") {
      updatedData = { ...agent, DueDate: formatDateForValue(agent.DueDate) };
      setSelectedFormData(updatedData);
      setShowModal(true);
      console.log(updatedData, "FRT67");
      return;
    }

    updatedData = {
      ...selectedData,
      DueDate: formatDateForValue(selectedData.DueDate),
    };
    setSelectedFormData(updatedData);
    setShowModal(true);
  };

  const handlePaidPayment = async (data) => {
    await swal({
      title: "Payment already paid",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });
  };
  const handleInvoiceShow = (payment) => {
    console.log(payment, "Pamtt77");
    setSelectedAmount(payment);
    setLgShow(true);
  };

  const handleCheckStatus = (row) => {
    const agent = agentPaymentList.find(
      (agent) => agent.UniqueId === row.UniqueId
    );
    console.log("HHG6", agent);
    return agent ? agent.Status : row.Status;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleSaved = async () => {
    const confirmation = await swal({
      title: "Payment is already save",
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

    return;
  };

  return (
    <div className="AgentPaymentRequest m-0 p-0">
      <Row>
        <Col md={12}>
          <Card>
            <div className="heading border-0 p-1">
              <PaymentList
                finalPaymentList={finalPaymentList}
                agentPaymentList={agentPaymentList}
              />
              <div className="cardbody mt-4">
                <div className="d-flex justify-content-between agent mb-1">
                  <h6>Agent - {agentName}</h6>
                  {/* <button className="btn btn-primary btn-custom-size">
                    Send Schedule Payment
                  </button> */}
                </div>
                <PerfectScrollbar options={{ suppressScrollY: true }}>
                  <div className="agenttable border" style={{
                    minWidth: "1200px", // jitna content h utna min-width do
                    // overflowX: "auto",
                    whiteSpace: "nowrap",
                    marginBottom: "14px"
                  }}>
                    <div className="row headingsss">
                      <div className="col-1 border-right border-bottom p-1 text-center">
                        #
                      </div>
                      <div className="col-1 border-right border-bottom p-1 text-center">
                        Payment Type
                      </div>
                      <div className="col-1 border-right border-bottom p-1 text-center">
                        Type
                      </div>
                      <div className="col-1 border-right border-bottom p-1 text-center">
                        Value
                      </div>
                      <div className="col-1 border-right border-bottom p-1 text-center">
                        Amount
                      </div>
                      <div className="col-1 border-right border-bottom p-1 text-center">
                        Due Date
                      </div>
                      <div className="col-1 border-right border-bottom p-1 text-center">
                        Due Time
                      </div>
                      <div className="col-1 border-right border-bottom p-1 text-center">
                        Remark
                      </div>
                      <div className="col-3 border-bottom p-1 text-center">
                        Action
                      </div>
                      <div className="col-1 border-right border-bottom p-1 text-center">
                        Status
                      </div>
                    </div>

                    {formValue.map((row, index) => (

                      <div key={index} className="row agentcolss">
                        {/* {console.log(row,"agentBreakupPayment")} */}
                        <div className="col-1 d-flex justify-content-center gap-5 border-right border-bottom">
                          <p className="m-2">{index + 1}</p>
                        </div>
                        <div className="col-1 border-right border-bottom">
                          <select
                            name="PaymentTypeId"
                            className={`form-control form-control-sm mt-2 ${errors[index]?.PaymentTypeId ? "is-invalid" : ""
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
                            <option value="2">
                              Advanced Payment
                            </option>
                            <option value="3">
                              Balance Payment
                            </option>
                            <option value="4">Direct Payment</option>
                            <option value="F5">Full Payment</option>
                          </select>
                          {errors[index]?.PaymentTypeId && (
                            <div className="invalid-feedback">
                              {errors[index].PaymentTypeId}
                            </div>
                          )}
                        </div>
                        <div className="col-1 border-right border-bottom">
                          <select
                            name="Type"
                            className={`form-control form-control-sm mt-2 ${errors[index]?.Type ? "is-invalid" : ""
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
                        </div>
                        <div className="col-1 border-right border-bottom">
                          <input
                            name="PaymentValue"
                            type="number"
                            className={`form-control form-control-sm mt-2 ${errors[index]?.PaymentValue ? "is-invalid" : ""
                              }`}
                            value={row.PaymentValue}
                            onChange={(e) =>
                              handleFormValueChange(
                                index,
                                "PaymentValue",
                                e.target.value
                              )
                            }
                            max={100}
                          />
                          {errors[index]?.PaymentValue && (
                            <div className="invalid-feedback">
                              {errors[index].PaymentValue}
                            </div>
                          )}
                        </div>
                        <div className="col-1 border-right border-bottom text-center">
                          <p className="mt-2">
                            {isNaN(row.TotalAmount)
                              ? 0
                              : Math.round(row.TotalAmount)}
                          </p>
                        </div>
                        <div className="col-1 border-right border-bottom pt-2">
                          <DatePicker
                            popperProps={{
                              strategy: "fixed", // Ensures the popper is positioned relative to the viewport
                            }}
                            selected={row.DueDate}
                            onChange={(date) =>
                              handleFormValueChange(index, "DueDate", date)
                            }
                            dateFormat="dd-MM-yyyy"
                            placeholderText="dd-mm-yyyy"
                            className={`form-control form-control-sm  ${errors[index]?.DueDate ? "is-invalid" : ""
                              }`}
                            isClearable
                            todayButton="Today"
                          />
                          {errors[index]?.DueDate && (
                            <div className="invalid-feedback">
                              {errors[index].DueDate}
                            </div>
                          )}
                        </div>
                        <div className="col-1 border-right border-bottom mt-2">
                          {/* <input
                            type="time"
                            name="DueTime"
                            value={row.DueTime}
                            onChange={(e) =>
                              handleFormValueChange(
                                index,
                                "DueTime",
                                e.target.value
                              )
                            }
                            className={`form-control form-control-sm mt-2 ${errors[index]?.DueTime ? "is-invalid" : ""
                              }`}
                          /> */}
                          <DarkCustomTimePicker
                            name="DueTime"
                            value={row.DueTime}
                            onChange={(e) =>
                              handleFormValueChange(
                                index,
                                "DueTime",
                                e.target.value
                              )
                            }
                            className={`form-control form-control-sm ${errors[index]?.DueTime ? "is-invalid" : ""
                              }`}
                          />
                          {errors[index]?.DueTime && (
                            <div className="invalid-feedback">
                              {errors[index].DueTime}
                            </div>
                          )}
                        </div>
                        <div className="col-1 border-right border-bottom align-content-center">
                          <input
                            type="text"
                            name="Remarks"
                            className={`form-control form-control-sm `}
                            value={row.Remarks || ""}
                            onChange={(e) =>
                              handleFormValueChange(
                                index,
                                "Remarks",
                                e.target.value
                              )
                            }
                          />
                          {/* {errors[index]?.Remarks && (
                            <div className="invalid-feedback">
                              {errors[index].Remarks}
                            </div>
                          )} */}
                        </div>
                        <div className="col-3 border-bottom d-flex justify-content-center gap-2 align-items-center">
                          {row?.UniqueId ? (
                            <div
                              className="btn btn-primary btn-custom-size buttons flex-shrink-0"
                              style={{ whiteSpace: "nowrap" }}
                              onClick={() => handleSaved()}
                            >
                              Saved
                            </div>
                          ) : (
                            <div
                              className="btn btn-primary btn-custom-size buttons"
                              style={{ whiteSpace: "nowrap" }}
                              onClick={() => handleSaveIt(index)}
                            >
                              Save
                            </div>
                          )}
                          {handleCheckStatus(row) === "Paid" ? (
                            <div
                              onClick={() => handlePaidPayment(row)}
                              className="btn btn-primary btn-custom-size buttons"
                              style={{ whiteSpace: "nowrap" }}
                            >
                              Update Payment
                            </div>
                          ) : (
                            <button
                              onClick={() => handleUpdatePayment(row)}
                              className="btn btn-primary btn-custom-size buttons"
                              style={{ whiteSpace: "nowrap" }}
                              disabled={!row?.UniqueId ? true : false}
                            >
                              Update Payment
                            </button>
                          )}
                          <button
                            className="btn btn-primary btn-custom-size buttons me-1"
                            // onClick={() => setLgShow(true)}
                            onClick={() => handleInvoiceShow(row.TotalAmount)}
                            style={{ whiteSpace: "nowrap" }}
                            disabled={
                              handleCheckStatus(row) === "Paid" ? false : true
                            }
                          >
                            Generate Invoice
                          </button>
                        </div>
                        <div className="col-1 border-left border-bottom align-content-center">
                          <span
                            className={
                              handleCheckStatus(row) === "Unpaid"
                                ? "badge badge-danger light badge"
                                : "badge badge-success light badge"
                            }
                          >
                            {handleCheckStatus(row)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </PerfectScrollbar>
              </div>
              <div className="mt-4">
                <div className="d-flex gap-3 agent mb-1">
                  <button
                    className="btn btn-primary btn-custom-size"
                    onClick={() => setInvoiveForm(true)}
                  >
                    Total Invoice
                  </button>
                  <button
                    className="btn btn-primary btn-custom-size"
                    onClick={() => setInvoiveForm(true)}
                  >
                    Per Person Invoice
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <UpdatePaymentModal
        show={showModal}
        handleClose={handleClose}
        selectedFormData={selectedFormData}
        paymentTypeList={paymentTypeList}
        agentId={agentId}
        setAgentPaymentList={setAgentPaymentList}
        selectedQuotationOption={selectedQuotationOption}
      />

      <GenerateInvoiceModal
        show={lgShow}
        handleCloselgShow={handleCloselgShow}
        totalAmount={selectedAmount}
      />

      <InvoiceFormModal
        show={invoiveForm}
        handleCloseInvoiveForm={handleCloseInvoiveForm}
        totalAmount={selectedAmount}
      />
      {/* <AgentTotalInvoice
        show={invoiveForm}
        handleCloseInvoiveForm={handleCloseInvoiveForm}
        totalAmount={selectedAmount} /> */}
    </div>
  );
};

export default AgentPaymentRequest;
