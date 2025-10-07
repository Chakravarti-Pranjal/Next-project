import React, { useState, useRef } from "react";
import Modal from "react-bootstrap/Modal";

import { Row, Card, Col, Button, CardHeader, CardBody } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useNavigate } from "react-router-dom";
import deboxlogo from "../../../../../images/logo/deboxlogo.png";

const invoiceFormInitial = {
  ParticularName: "",
  HSN: "",
  SAC: "",
  Amount: "",
  Tcs: "",
  Tax: "",
  TotalAmount: "",
  IGST: "",
  CGST: "",
  State: "select",
  isExcludeGst: false,
};

const invoiceForm2Initial = {
  Currency_Type: "",
  AccountNumber: "",
  AccountType: "",
  BeneficiaryName: "",
  BranchAddress: "",
  BranchIFSC: "",
  BankName: "",
};

const InvoiceFormModal = ({ show, handleCloseInvoiveForm }) => {
  const navigate = useNavigate();

  const [invoiceForm, setInvoiceForm] = useState([invoiceFormInitial]);
  const [invoiceForm2, setInvoiceForm2] = useState([invoiceForm2Initial]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDated, setSelectedDated] = useState(new Date());
  const [formData, setFormData] = useState({
    ContactType: "Proforma Invoice",
  });
  const [cost, setCost] = useState({
    costType: "Individual",
  });
  const [guestName, setGuestName] = useState("");
  const [termCondition, setTermCondition] = useState("");
  const [paymentDes, setPaymentDesc] = useState("");
  const [selectedTax, setSelectedTax] = useState("");
  const [selectedState, setSelectedState] = useState("Same State");
  const [totalIGST, setTotalIGST] = useState("");
  const [totalCGST, setTotalCGST] = useState("");
  const [totalState, setTotalState] = useState("Same State");
  const [totalIsExcludeGst, setTotalIsExcludeGst] = useState(false);
  const [companyDetails, setCompanyDetails] = useState({
    CompanyName: "DEBOX GLOBAL IT SOLUTION PRIVATE LIMITED",
    Address: "Sector-62 I thum tower C-319",
    Phone: "9898556641",
    Website: "www.deboxglobal.com",
    GstNo: "09AAGCD6966P1ZP",
    Email: "info@deboxglobal.com",
    Cin: "09AAGCD6966P1ZP",
  });
  const [billingData, setBillingData] = useState({
    billTo: "Ruchi Travel",
    address: "Noida sector 15, 310 A",
    phone: "9990003616",
    email: "Rachin@debox.com",
    gstin: "JKHGKJH8767HK",
    pan: "KJYU876HJGJ",
    stateCountry: "",
  });
  const [editMode, setEditMode] = useState(null);
  const [tempData, setTempData] = useState(billingData);
  const [grandTotal, setGrandTotal] = useState(0);
  const [invoiceNo, setInvoiceNo] = useState("");
  const [igst, setIgst] = useState(0);
  const [igstValue, setIgstValue] = useState(0);
  const [cgst, setCgst] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState("INR");
  const [selectedDestination, setSelectedDestination] = useState("");
  const [selectedOfficePlace, setSelectedOfficePlace] = useState("");

  const totalTourCost = invoiceForm.reduce((acc, curr) => {
    const amount = parseFloat(curr.TotalAmount) || 0;
    return acc + amount;
  }, 0);

  const newAmount = totalIsExcludeGst
    ? totalTourCost
    : totalTourCost +
    (totalState === "Other State"
      ? (totalTourCost * (parseFloat(totalIGST) || 0)) / 100
      : totalState === "Same State"
        ? (totalTourCost * (parseFloat(totalIGST) || 0)) / 100 +
        (totalTourCost * (parseFloat(totalCGST) || 0)) / 100
        : 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempData({ ...tempData, [name]: value });
  };

  const handleFieldClick = (fieldName) => {
    setEditMode(fieldName);
  };

  const handleFieldBlur = () => {
    setBillingData(tempData);
    setEditMode(null);
  };

  const handleFormChangeData = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormChangeDatas = (e) => {
    const { name, value } = e.target;
    setCost({ ...cost, [name]: value });
  };

  const handleServiceCostForm = (e, index) => {
    const { name, value, type, checked } = e.target;

    setInvoiceForm((prevArr) => {
      const newArr = [...prevArr];
      const updatedRow = {
        ...newArr[index],
        [name]: type === "checkbox" ? checked : value,
      };

      const amount = parseFloat(updatedRow.Amount) || 0;
      const tcs = parseFloat(updatedRow.Tcs) || 0;
      const tax = parseFloat(updatedRow.Tax) || 0;

      const tcsAmount = (amount * tcs) / 100;
      const taxAmount = (amount * tax) / 100;

      let igstAmount = 0;
      let cgstAmount = 0;
      if (!updatedRow.isExcludeGst) {
        if (updatedRow.State === "Other State") {
          igstAmount = (amount * (parseFloat(updatedRow.IGST) || 0)) / 100;
        } else if (updatedRow.State === "Same State") {
          igstAmount = (amount * (parseFloat(updatedRow.IGST) || 0)) / 100;
          cgstAmount = (amount * (parseFloat(updatedRow.CGST) || 0)) / 100;
        }
      }

      updatedRow.TotalAmount = (
        amount +
        tcsAmount +
        taxAmount +
        igstAmount +
        cgstAmount
      ).toFixed(2);

      newArr[index] = updatedRow;
      return newArr;
    });
  };

  const handleServiceIncrement = () => {
    setInvoiceForm((prevArr) => [...prevArr, invoiceFormInitial]);
  };

  const handleServiceDecrement = (ind) => {
    if (invoiceForm.length > 1) {
      setInvoiceForm((prevArr) => prevArr.filter((_, index) => index !== ind));
    }
  };

  const handleService2CostForm = (e, index) => {
    const { name, value } = e.target;
    setInvoiceForm2((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = { ...newArr[index], [name]: value };
      return newArr;
    });
  };

  const handleService2Increment = () => {
    setInvoiceForm2((prevArr) => [...prevArr, invoiceForm2Initial]);
  };

  const handleService2Decrement = (ind) => {
    if (invoiceForm2.length > 1) {
      setInvoiceForm2((prevArr) => prevArr.filter((_, index) => index !== ind));
    }
  };

  const handleTaxChange = (e) => {
    setSelectedTax(e.target.value);
    setIgst(e.target.value);
  };

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
        onHide={handleCloseInvoiveForm}
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
          <div className="ManualInvoice m-0 p-0">
            <Row>
              <Col md={12}>
                <Card>
                  <CardHeader className="my-0 pt-0 border-0">
                    <div className="col-md-12 d-flex justify-content-between align-item-center gap-1 col-sm-12">
                      <div className="col-lg-2 col-md-6"></div>
                      <div className="col-lg-3 col-md-6 mb-1">
                        <div className="d-flex justify-content-end align-content-center gap-1">
                          <div className="d-flex">
                            <button
                              className="btn btn-dark btn-custom-size"
                              onClick={() => navigate(-1)}
                            >
                              <span className="me-1">Back</span>
                              <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
                            </button>
                          </div>
                          <div className="Save">
                            <button className="btn btn-primary btn-custom-size">
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <div className="">
                      <div className="row">
                        <div className="col-lg-3 col-md-6 mb-3">
                          <label>Contact Type</label>
                          <select
                            name="ContactType"
                            id="contactType"
                            className="form-control form-control-sm"
                            value={formData.ContactType}
                            onChange={handleFormChangeData}
                          >
                            <option value="Proforma Invoice">
                              Proforma Invoice
                            </option>
                            <option value="Tax Invoice">Tax Invoice</option>
                          </select>
                        </div>
                        <div className="col-lg-3 col-md-6 mb-3">
                          <label>Cost Type</label>
                          <select
                            name="costType"
                            id="costType"
                            className="form-control form-control-sm"
                            value={cost.costType}
                            onChange={handleFormChangeDatas}
                          >
                            <option value="Service Wise">Service Wise</option>
                            <option value="Consolidated">Consolidated</option>
                            <option value="Part Invoice">Part Invoice</option>
                            <option value="Pax Wise Invoice">
                              Pax Wise Invoice
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="">
                      <div className="row">
                        <div className="col-lg-3 col-md-6 mb-3">
                          <label>Company</label>
                          <select
                            name="Company"
                            id="Company"
                            className="form-control form-control-sm"
                          >
                            <option value="">Select</option>
                          </select>
                        </div>
                        <div className="col-lg-3 col-md-6 mb-3">
                          <label>City Type</label>
                          <select
                            name="costType"
                            id="costType"
                            className="form-control form-control-sm"
                            value={selectedOfficePlace}
                            onChange={(e) =>
                              setSelectedOfficePlace(e.target.value)
                            }
                          >
                            <option value="">Select City</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {cost.costType === "Consolidated" && (
                      <div className="row">
                        <table className="table table-bordered itinerary-table">
                          <thead>
                            <tr>
                              <th>SRN</th>
                              <th>QUOTATION ID</th>
                              <th></th>
                              <th>TOUR AMOUNT</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>1</td>
                              <td>-</td>
                              <td>coshsheet</td>
                              <td>4836</td>
                            </tr>
                            <tr>
                              <td></td>
                              <td></td>
                              <td>Total</td>
                              <td>4836</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}

                    <div className="row mt-1">
                      <div className="col-lg-12 d-flex justify-content-end align-items-center">
                        <h3>{formData?.ContactType}</h3>
                      </div>
                    </div>

                    <div
                      className=""
                      style={{ background: "var(--rgba-primary-1)" }}
                    >
                      <div className="row pt-2 pb-2 p-1">
                        <div className="col-lg-4 img col-sm-12">
                          <div className="img my-auto">
                            <img
                              src={deboxlogo}
                              alt="Logo"
                              style={{
                                height: "60px",
                                width: "auto",
                                objectFit: "contain",
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-lg-8 col-sm-12 ps-2 my-auto">
                          <div className="row deboxcontact">
                            <div className="heading col-12">
                              <h6>{companyDetails.CompanyName}</h6>
                            </div>
                            <div className="address col-12">
                              <div className="d-flex gap-3">
                                <span>Address : </span>
                                {companyDetails.Address}
                              </div>
                            </div>
                            <div className="Contact col-6">
                              <div className="d-flex gap-3">
                                <span>Contact : </span>
                                {companyDetails.Phone}
                              </div>
                            </div>
                            <div className="Email col-6">
                              <div className="d-flex gap-3">
                                <span>Email : </span>
                                {companyDetails.Email || "info@deboxglobal.com"}
                              </div>
                            </div>
                            <div className="Website col-12">
                              <div className="d-flex gap-3">
                                <span>Website : </span>
                                {companyDetails.Website ||
                                  "www.deboxglobal.com"}
                              </div>
                            </div>
                            <div className="GSTN/UIN col-6">
                              <div className="d-flex gap-1">
                                <span>GSTN/UIN : </span>
                                {companyDetails.GstNo || "ABCDE1234F"}
                              </div>
                            </div>
                            <div className="CIN col-6">
                              <div className="d-flex gap-3">
                                <span>CIN : </span>
                                {companyDetails.Cin || "09AAGCD6966P1ZP"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border">
                      <div className="row">
                        <div className="col-lg-4 billscontact ps-4">
                          <div className="row">
                            <div className="col-12">
                              <div className="row my-2 mt-3">
                                <div className="col-2">
                                  <span className="billHeading">
                                    Bill To :{" "}
                                  </span>
                                </div>
                                <div
                                  className="col-10"
                                  onClick={() => handleFieldClick("billTo")}
                                >
                                  {editMode === "billTo" ? (
                                    <input
                                      type="text"
                                      name="billTo"
                                      className="form-control form-control-sm"
                                      value={tempData.billTo}
                                      onChange={handleChange}
                                      onBlur={handleFieldBlur}
                                      autoFocus
                                    />
                                  ) : (
                                    billingData.billTo
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="col-12 my-2">
                              <div className="row">
                                <div className="col-2">
                                  <span className="billHeading">
                                    Address :{" "}
                                  </span>
                                </div>
                                <div
                                  className="col-10"
                                  onClick={() => handleFieldClick("address")}
                                >
                                  {editMode === "address" ? (
                                    <input
                                      type="text"
                                      name="address"
                                      className="form-control form-control-sm"
                                      value={tempData.address}
                                      onChange={handleChange}
                                      onBlur={handleFieldBlur}
                                      autoFocus
                                    />
                                  ) : (
                                    billingData.address
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="col-12 my-2">
                              <div className="row">
                                <div className="col-2">
                                  <span className="billHeading">Phone : </span>
                                </div>
                                <div
                                  className="col-10"
                                  onClick={() => handleFieldClick("phone")}
                                >
                                  {editMode === "phone" ? (
                                    <input
                                      type="text"
                                      name="phone"
                                      className="form-control form-control-sm"
                                      value={tempData.phone}
                                      onChange={handleChange}
                                      onBlur={handleFieldBlur}
                                      autoFocus
                                    />
                                  ) : (
                                    billingData.phone
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="col-12 my-2">
                              <div className="row">
                                <div className="col-2">
                                  <span className="billHeading">Email : </span>
                                </div>
                                <div
                                  className="col-10"
                                  onClick={() => handleFieldClick("email")}
                                >
                                  {editMode === "email" ? (
                                    <input
                                      type="email"
                                      name="email"
                                      className="form-control form-control-sm"
                                      value={tempData.email}
                                      onChange={handleChange}
                                      onBlur={handleFieldBlur}
                                      autoFocus
                                    />
                                  ) : (
                                    billingData.email
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="col-6 my-2">
                              <div className="row">
                                <div className="col-4">
                                  <span className="billHeading">
                                    GSTIN/UIN :{" "}
                                  </span>
                                </div>
                                <div
                                  className="col-8"
                                  onClick={() => handleFieldClick("gstin")}
                                >
                                  {editMode === "gstin" ? (
                                    <input
                                      type="text"
                                      name="gstin"
                                      className="form-control form-control-sm"
                                      value={tempData.gstin}
                                      onChange={handleChange}
                                      onBlur={handleFieldBlur}
                                      autoFocus
                                    />
                                  ) : (
                                    billingData.gstin
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="col-6 my-2">
                              <div className="row">
                                <div className="col-2">
                                  <span className="billHeading">PAN : </span>
                                </div>
                                <div
                                  className="col-10"
                                  onClick={() => handleFieldClick("pan")}
                                >
                                  {editMode === "pan" ? (
                                    <input
                                      type="text"
                                      name="pan"
                                      className="form-control form-control-sm"
                                      value={tempData.pan}
                                      onChange={handleChange}
                                      onBlur={handleFieldBlur}
                                      autoFocus
                                    />
                                  ) : (
                                    billingData.pan
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="col-12 my-2">
                              <div className="row">
                                <div className="col-3">
                                  <span className="billHeading">
                                    State/Country Name :{" "}
                                  </span>
                                </div>
                                <div
                                  className="col-9"
                                  onClick={() =>
                                    handleFieldClick("stateCountry")
                                  }
                                >
                                  {editMode === "stateCountry" ? (
                                    <input
                                      type="text"
                                      name="stateCountry"
                                      className="form-control form-control-sm"
                                      value={tempData.stateCountry}
                                      onChange={handleChange}
                                      onBlur={handleFieldBlur}
                                      autoFocus
                                    />
                                  ) : (
                                    billingData.stateCountry || "-"
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-8 border-left">
                          <div className="row invoicetable">
                            <div className="col-6 ps-3 pt-3 border-bottom">
                              <div className="row">
                                <div className="col-4">
                                  <span className="billHeading">
                                    Invoice No:{" "}
                                  </span>
                                </div>
                                <div className="col-8">{invoiceNo}</div>
                              </div>
                            </div>
                            <div className="col-6 border-bottom">
                              <div className="row">
                                <div className="col-4 pt-3">
                                  <span className="billHeading">
                                    Invoice Date:{" "}
                                  </span>
                                </div>
                                <div className="col-4">
                                  <DatePicker
                                    className="form-control form-control-sm my-2"
                                    dateFormat="yyyy-MM-dd"
                                    isClearable
                                    todayButton="Today"
                                    selected={selectedDate}
                                    onChange={(date) => setSelectedDate(date)}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-6 ps-3 border-bottom pt-3">
                              <div className="row">
                                <div className="col-4">
                                  <span className="billHeading">
                                    Reference No:{" "}
                                  </span>
                                </div>
                                <div className="col-8">-</div>
                              </div>
                            </div>
                            <div className="col-6 border-bottom">
                              <div className="row">
                                <div className="col-4 pt-3">
                                  <span className="billHeading">
                                    Due Date:{" "}
                                  </span>
                                </div>
                                <div className="col-4">
                                  <DatePicker
                                    className="form-control form-control-sm my-2"
                                    dateFormat="yyyy-MM-dd"
                                    isClearable
                                    todayButton="Today"
                                    selected={selectedDated}
                                    onChange={(date) => setSelectedDated(date)}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-6 ps-3 border-bottom py-2 pt-3">
                              <div className="row">
                                <div className="col-4">
                                  <span className="billHeading">Tour Id: </span>
                                </div>
                                <div className="col-8">-</div>
                              </div>
                            </div>
                            <div className="col-6 border-bottom py-2">
                              <div className="row">
                                <div className="col-4">
                                  <span className="billHeading">
                                    Query Id:{" "}
                                  </span>
                                </div>
                                <div className="col-8">-</div>
                              </div>
                            </div>
                            <div className="col-6 ps-3 border-bottom">
                              <div className="row">
                                <div className="col-4 pt-3">
                                  <span className="billHeading">
                                    Currency:{" "}
                                  </span>
                                </div>
                                <div className="col-4">
                                  <select
                                    name="Currency"
                                    className="form-control form-control-sm my-2"
                                    value={selectedCurrency}
                                    onChange={(e) =>
                                      setSelectedCurrency(e.target.value)
                                    }
                                  >
                                    <option value="INR">INR</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                            <div className="col-6 border-bottom">
                              <div className="row">
                                <div className="col-4 pt-3">
                                  <span className="billHeading">
                                    Guest/ Client Name:{" "}
                                  </span>
                                </div>
                                <div className="col-4">
                                  <input
                                    type="text"
                                    className="form-control form-control-sm my-2"
                                    name="Name"
                                    value={guestName}
                                    onChange={(e) =>
                                      setGuestName(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-12 ps-3">
                              <div className="row items-center">
                                <div className="col-2 pt-3">
                                  <span className="billHeading">
                                    Place of Delivery:{" "}
                                  </span>
                                </div>
                                <div className="col-3">
                                  <select
                                    name="Payment"
                                    className="form-control form-control-sm my-2"
                                    value={selectedDestination}
                                    onChange={(e) =>
                                      setSelectedDestination(e.target.value)
                                    }
                                  >
                                    <option value="">select</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <table className="table table-bordered itinerary-table mt-2">
                      <thead>
                        <tr className="text-center">
                          <th className="p-1">Particulars</th>
                          <th className="p-1">HSN/SAC</th>
                          <th className="p-1">Amount</th>
                          <th className="p-1">TCS (%)</th>
                          <th className="p-1">TAX (%)</th>
                          <th className="p-1">Total Amount</th>
                          <th className="p-1"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoiceForm.map((service, index) => (
                          <React.Fragment key={index}>
                            <tr className="text-center">
                              <td className="w-100">
                                <textarea
                                  name="ParticularName"
                                  className="formControl1 mb-0"
                                  value={service.ParticularName}
                                  onChange={(e) =>
                                    handleServiceCostForm(e, index)
                                  }
                                  style={{
                                    resize: "none",
                                    width: "100%",
                                    display: "block",
                                  }}
                                />
                              </td>
                              <td>
                                <select
                                  name="HSN"
                                  className="formControl1"
                                  style={{ width: "100px" }}
                                  value={service.HSN}
                                  onChange={(e) =>
                                    handleServiceCostForm(e, index)
                                  }
                                >
                                  <option>select</option>
                                </select>
                              </td>
                              <td>
                                <input
                                  type="text"
                                  name="Amount"
                                  className="formControl1 w-100"
                                  value={service.Amount}
                                  onChange={(e) =>
                                    handleServiceCostForm(e, index)
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  name="Tcs"
                                  className="formControl1 w-100"
                                  value={service.Tcs}
                                  onChange={(e) =>
                                    handleServiceCostForm(e, index)
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  name="Tax"
                                  className="formControl1 w-100"
                                  value={service.Tax}
                                  onChange={(e) =>
                                    handleServiceCostForm(e, index)
                                  }
                                />
                              </td>
                              <td>{service.TotalAmount}</td>
                              <td>
                                <div className="d-flex w-100 justify-content-center gap-2">
                                  <span
                                    onClick={() => handleServiceIncrement()}
                                  >
                                    <i className="la la-plus border cursor-pointer bg-success text-white rounded-pill fontSize10px padding1px"></i>
                                  </span>
                                  <span
                                    onClick={() =>
                                      handleServiceDecrement(index)
                                    }
                                  >
                                    <i className="la la-minus border cursor-pointer bg-primary text-white rounded-pill fontSize10px padding1px"></i>
                                  </span>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan={3}></td>
                              <td colSpan={5} className="text-start">
                                <select
                                  className="formControl1"
                                  style={{ marginRight: "6px", width: "100px" }}
                                  name="State"
                                  value={service.State}
                                  onChange={(e) =>
                                    handleServiceCostForm(e, index)
                                  }
                                >
                                  <option value="Same State">Same State</option>
                                  <option value="Other State">
                                    Other State
                                  </option>
                                </select>
                                <select
                                  className="formControl1"
                                  style={{ width: "100px" }}
                                  name="IGST"
                                  value={service.IGST}
                                  onChange={(e) =>
                                    handleServiceCostForm(e, index)
                                  }
                                >
                                  <option value="select">Select GST</option>
                                </select>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan={3}></td>
                              <td colSpan={3} className="text-start">
                                <span>IGST (%)</span>
                              </td>
                              <td colSpan={2} className="text-start">
                                <input
                                  type="text"
                                  className="formControl1 width100px"
                                  name="IGST"
                                  value={service.IGST}
                                  onChange={(e) =>
                                    handleServiceCostForm(e, index)
                                  }
                                />
                              </td>
                            </tr>
                            {service.State !== "Other State" && (
                              <tr>
                                <td colSpan={3}></td>
                                <td colSpan={3} className="text-start">
                                  <span>CGST (%)</span>
                                </td>
                                <td colSpan={2} className="text-start">
                                  <input
                                    type="text"
                                    className="formControl1 width100px"
                                    name="CGST"
                                    value={service.CGST}
                                    onChange={(e) =>
                                      handleServiceCostForm(e, index)
                                    }
                                  />
                                </td>
                              </tr>
                            )}
                            <tr>
                              <td colSpan={2}></td>
                              <td className="text-start">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  name="isExcludeGst"
                                  checked={service.isExcludeGst}
                                  onChange={(e) =>
                                    handleServiceCostForm(e, index)
                                  }
                                  style={{
                                    marginRight: "4px",
                                    borderRadius: "50%",
                                  }}
                                />
                                <span>Excluded GST</span>
                              </td>
                              <td colSpan={3} className="text-start">
                                <span>Total Cost in (INR)</span>
                              </td>
                              <td colSpan={2} className="text-start">
                                {service.TotalAmount}
                              </td>
                            </tr>
                          </React.Fragment>
                        ))}
                        <tr>
                          <td colSpan={2}></td>
                          <td colSpan={5} className="text-start">
                            <select
                              className="formControl1"
                              style={{ marginRight: "6px", width: "100px" }}
                              value={totalState}
                              onChange={(e) => setTotalState(e.target.value)}
                            >
                              <option value="Same State">Same State</option>
                              <option value="Other State">Other State</option>
                            </select>
                            <select
                              className="formControl1"
                              style={{ width: "100px" }}
                              value={totalIGST}
                              onChange={(e) => setTotalIGST(e.target.value)}
                            >
                              <option value="select">Select GST</option>
                            </select>
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={2}></td>
                          <td colSpan={3} className="text-start">
                            <span>IGST (%)</span>
                          </td>
                          <td colSpan={2} className="text-start">
                            <input
                              type="text"
                              className="formControl1 width100px"
                              value={totalIGST}
                              onChange={(e) => setTotalIGST(e.target.value)}
                            />
                          </td>
                        </tr>
                        {totalState !== "Other State" && (
                          <tr>
                            <td colSpan={2}></td>
                            <td colSpan={3} className="text-start">
                              <span>CGST (%)</span>
                            </td>
                            <td colSpan={2} className="text-start">
                              <input
                                type="text"
                                className="formControl1 width100px"
                                value={totalCGST}
                                onChange={(e) => setTotalCGST(e.target.value)}
                              />
                            </td>
                          </tr>
                        )}
                        <tr>
                          <td colSpan={2}></td>
                          <td
                            colSpan={3}
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={totalIsExcludeGst}
                              onChange={() =>
                                setTotalIsExcludeGst((prev) => !prev)
                              }
                              style={{
                                marginRight: "4px",
                                borderRadius: "50%",
                              }}
                            />
                            <p
                              className="mb-0 mt-1"
                              style={{ whiteSpace: "nowrap" }}
                            >
                              Excluded GST (Total)
                            </p>
                          </td>
                          <td colSpan={3} className="text-start">
                            <span>Total Tour Cost in (INR)</span>
                          </td>
                          <td colSpan={2} className="text-start">
                            {newAmount ? newAmount.toFixed(2) : ""}
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <table className="table table-bordered itinerary-table mt-2">
                      <thead>
                        <tr className="">
                          <th className="p-1">SN</th>
                          <th className="p-1">Currency Type</th>
                          <th className="p-1">Bank Name</th>
                          <th className="p-1">Account Number</th>
                          <th className="p-1">Account Type</th>
                          <th className="p-1">Beneficiary Name</th>
                          <th className="p-1">Branch Address</th>
                          <th className="p-1">Branch IFSC</th>
                          <th className="p-1"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoiceForm2.map((value, index) => (
                          <tr key={index} className="text-center">
                            <td>{index + 1}</td>
                            <td>
                              <select
                                name="Currency_Type"
                                className="formControl1 width100px my-2"
                                value={value.Currency_Type}
                                onChange={(e) =>
                                  handleService2CostForm(e, index)
                                }
                              >
                                <option value="INR">INR</option>
                              </select>
                            </td>
                            <td>
                              <input
                                name="BankName"
                                type="text"
                                className="formControl1 width100px"
                                value={value.BankName}
                                onChange={(e) =>
                                  handleService2CostForm(e, index)
                                }
                              />
                            </td>
                            <td>
                              <input
                                name="AccountNumber"
                                type="text"
                                className="formControl1 width100px"
                                value={value.AccountNumber}
                                onChange={(e) =>
                                  handleService2CostForm(e, index)
                                }
                              />
                            </td>
                            <td>
                              <input
                                name="AccountType"
                                type="text"
                                className="formControl1 width100px"
                                value={value.AccountType}
                                onChange={(e) =>
                                  handleService2CostForm(e, index)
                                }
                              />
                            </td>
                            <td>
                              <input
                                name="BeneficiaryName"
                                type="text"
                                className="formControl1 width100px"
                                value={value.BeneficiaryName}
                                onChange={(e) =>
                                  handleService2CostForm(e, index)
                                }
                              />
                            </td>
                            <td>
                              <input
                                name="BranchAddress"
                                type="text"
                                className="formControl1 width100px"
                                value={value.BranchAddress}
                                onChange={(e) =>
                                  handleService2CostForm(e, index)
                                }
                              />
                            </td>
                            <td>
                              <input
                                name="BranchIFSC"
                                type="text"
                                className="formControl1 width100px"
                                value={value.BranchIFSC}
                                onChange={(e) =>
                                  handleService2CostForm(e, index)
                                }
                              />
                            </td>
                            <td>
                              <div className="d-flex w-100 justify-content-center gap-2">
                                <span onClick={() => handleService2Increment()}>
                                  <i className="la la-plus border cursor-pointer bg-success text-white rounded-pill fontSize10px padding1px"></i>
                                </span>
                                <span
                                  onClick={() => handleService2Decrement(index)}
                                >
                                  <i className="la la-minus border cursor-pointer bg-primary text-white rounded-pill fontSize10px padding1px"></i>
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="border-left border-top border-right rounded-1 p-2">
                      <h6>Terms & Conditions</h6>
                      <textarea
                        id="name"
                        className="form-control form-control-sm"
                        name="Address"
                        placeholder="Address"
                        value={termCondition}
                        onChange={(e) => setTermCondition(e.target.value)}
                      ></textarea>
                    </div>
                    <div className="border-left border-bottom border-right p-2">
                      <h6>Payment</h6>
                      <textarea
                        id="name"
                        className="form-control form-control-sm"
                        name="Address"
                        placeholder="Address"
                        value={paymentDes}
                        onChange={(e) => setPaymentDesc(e.target.value)}
                      ></textarea>
                    </div>
                    <div className="pt-2 pb-2">
                      <div className="row d-flex justify-content-end align-items-center">
                        <div className="col-3">
                          <div className="d-flex justify-content-end align-content-center gap-1">
                            <div className="cancel">
                              <button className="btn btn-dark btn-custom-size">
                                Cancel
                              </button>
                            </div>
                            <div className="Save">
                              <button className="btn btn-primary btn-custom-size">
                                Save
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
          <hr />
          <div className="d-flex justify-content-end">
            <button
              className="btn btn-primary btn-custom-size"
              onClick={handlePrint}
            >
              Print Invoice
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default InvoiceFormModal;
