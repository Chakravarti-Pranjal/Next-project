// @ts-nocheck
import React, { useEffect, useState } from "react";

import {
  Row,
  Card,
  Col,
  Button,
  Nav,
  Container,
  Dropdown,
  CardHeader,
} from "react-bootstrap";
// import transport from "../../../../../images/svg/transport.svg";
// import entrance3 from "../../../../../images/svg/entrance3.svg";

import Swal from "sweetalert2"; // Make sure this import is present
import { axiosOther } from "../../../../../http/axios_base_url";
import SupplierPaymentList from "./SupplierPaymentList";
import SupplierPaymentModal from "./SupplierPaymentModal";

import HotelIcon from "../../../../../images/quotationFour/hotelNew.svg";
import MonumentIcon from "../../../../../images/quotationFour/MonumentNew.svg";
import GuideIcon from "../../../../../images/quotationFour/GuideNew.svg";
import ActivityIcon from "../../../../../images/quotationFour/ActivityNew.svg";
import TransportIcon from "../../../../../images/quotationFour/TransportNew.svg";
import FlightIcon from "../../../../../images/quotationFour/FlightNew.svg";
// import TrainIcon from "../../../../../images/quotationFour/TrainNew.svg";
import AdditionalIcon from "../../../../../images/quotationFour/Additional.svg";

const SupplierPaymentRequest = ({ selectedQuotationOption }) => {
  const [supplierPaymentList, setSupplierPaymentList] = useState([]);
  const [selectedFormData, setSelectedFormData] = useState({});
  const [paymentTypeList, setPaymentTypeList] = useState([]);
  const [pendingAmount, setPendingAmount] = useState(null);
  const [paidAmount, setPaidAmount] = useState(null);

  const [listFinalSupplierPayment, setListFinalSupplierPayment] = useState([]);
  const [paidAmountList, setPaidAmountList] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);

  const queryQuotation = JSON.parse(localStorage.getItem("Query_Qoutation"));

  console.log(selectedQuotationOption, "selectedQuotationOption");

  const callApiOnSave = async () => {
    try {
      const { data } = await axiosOther.post("list-final-payment", {
        QueryId: queryQuotation?.QueryID,
        QuotationNumber: queryQuotation?.QoutationNum ?? quotationNum,
      });

      setSupplierPaymentList(data?.Data[0]);
      console.log(data?.Data[0]?.PaymentInfo, "GROUP23");
    } catch (error) {
      console.log(error);
    }
  };
  console.log(supplierPaymentList, "supplierPaymentList");

  const getDataFromApi = async (quotationNum) => {
    try {
      const { data } = await axiosOther.post("list-final-payment", {
        QueryId: queryQuotation?.QueryID,
        QuotationNumber: queryQuotation?.QoutationNum ?? quotationNum,
      });

      setSupplierPaymentList(data?.Data[0]);
      console.log(data?.Data[0]?.PaymentInfo, "GROUP23");
    } catch (error) {
      console.log(error);
    }

    try {
      const { data } = await axiosOther.post("paymenttypelist");
      setPaymentTypeList(data?.DataList);
    } catch (error) {
      console.log(error);
    }

    try {
      const { data } = await axiosOther.post("list-supplier-payments", {
        QueryId: queryQuotation?.QueryID,
        QuotationNumber: queryQuotation?.QoutationNum ?? quotationNum,
      });

      console.log(data?.Data, "RATELIST");
      setListFinalSupplierPayment(data?.Data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (selectedQuotationOption) {
      getDataFromApi(selectedQuotationOption);
    }
  }, [selectedQuotationOption]);

  useEffect(() => {
    if (listFinalSupplierPayment.length > 0) {
      const paidList = listFinalSupplierPayment.filter(
        (item) => item.Status === "Paid"
      );
      setPaidAmountList(paidList);
    }
  }, [listFinalSupplierPayment]);

  const showFormPrompt = async (idx) => {
    // Create a form container dynamically
    const form = document.createElement("form");
    form.className = "themeForm";
    form.style.display = "flex";
    form.style.flexDirection = "column";
    form.style.gap = "5px";
    form.style.backgroundColor = "#202020";

    // Create file input
    const fileInput = document.createElement("input");
    fileInput.className = "themeFileInput";
    fileInput.title = "Upload File";
    fileInput.style.backgroundColor = "#202020";
    fileInput.type = "file";
    fileInput.id = "fileInput";
    fileInput.style.marginBottom = "10px";

    // Create textarea
    const textArea = document.createElement("textarea");
    textArea.id = "textArea";
    textArea.placeholder = "Description";
    textArea.style.resize = "none";
    textArea.style.backgroundColor = "#202020";
    textArea.style.height = "40px";
    textArea.style.width = "100%";
    textArea.className = "themeTextArea";
    textArea.required = true;

    // Append inputs
    form.appendChild(fileInput);
    form.appendChild(textArea);

    // SweetAlert
    const { value: formValues } = await Swal.fire({
      title: "Upload Documents",
      text: "Please fill the details",
      html: form,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Upload",
      cancelButtonText: "Cancel",
      preConfirm: () => {
        const selectedFile = fileInput.files[0];
        const additionalInfo = textArea.value.trim();

        if (!selectedFile) {
          Swal.showValidationMessage("No file selected. Please try again.");
          return false;
        }

        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const base64Data = reader.result.split(",")[1]; // base64 only
            resolve({ selectedFile, additionalInfo, base64Data });
          };
          reader.onerror = () => {
            Swal.showValidationMessage("Error reading file!");
            reject();
          };
          reader.readAsDataURL(selectedFile);
        });
      },
    });

    if (formValues) {
      const { selectedFile, additionalInfo, base64Data } = formValues;

      const payload = {
        id: "",
        DocName: selectedFile.name,
        DocPath: base64Data,
        QueryId: queryQuotation?.QueryID,
        QuotationNumber: queryQuotation?.QoutationNum,
        TourId: queryQuotation?.TourId,
        SupplierId: supplierPaymentList?.PaymentInfo?.PaymentBreakup[idx]?.SupplierId,
        Status: 1,
        AddedBy: 1,
        UpdatedBy: 1,
        Description: additionalInfo,
      };

      try {
        const response = await axiosOther.post("store-upload-doc", payload, {
          headers: { "Content-Type": "application/json" },
        });

        Swal.fire("Success", "File uploaded successfully!", "success");
        console.log("Response:", response.data);
      } catch (error) {
        Swal.fire("Error", "File upload failed!", "error");
        console.error("Upload Error:", error);
      }
    }
  };

  // const showFormPrompt = async () => {
  //   // Create a form container dynamically
  //   const form = document.createElement("form");
  //   form.className = "themeForm";
  //   form.style.display = "flex";
  //   form.style.flexDirection = "column";
  //   form.style.gap = "5px";
  //   form.style.backgroundColor = "#202020";

  //   // Create file input
  //   const fileInput = document.createElement("input");
  //   fileInput.className = "themeFileInput";
  //   fileInput.title = "Upload File";
  //   fileInput.style.backgroundColor = "#202020";
  //   fileInput.type = "file";
  //   fileInput.id = "fileInput";
  //   fileInput.style.marginBottom = "10px";

  //   // Create textarea for additional information
  //   const textArea = document.createElement("textarea");
  //   textArea.id = "textArea";
  //   textArea.placeholder = "Description";
  //   textArea.style.resize = "none";
  //   textArea.style.backgroundColor = "#202020";
  //   textArea.style.height = "40px";
  //   textArea.style.width = "100%";
  //   textArea.className = "themeTextArea";
  //   textArea.required = true;

  //   // Append inputs to the form
  //   form.appendChild(fileInput);
  //   form.appendChild(textArea);

  //   // Show SweetAlert with the form inside it
  //   const { value: formValues } = await Swal.fire({
  //     title: "Upload Documents",
  //     text: "Please fill the details",
  //     html: form,
  //     focusConfirm: false,
  //     showCancelButton: true,
  //     confirmButtonText: "Upload",
  //     cancelButtonText: "Cancel",
  //     preConfirm: () => {
  //       const selectedFile = fileInput.files[0];
  //       const additionalInfo = textArea.value.trim();

  //       if (!selectedFile) {
  //         Swal.showValidationMessage("No file selected. Please try again.");
  //         return false;
  //       }

  //       return { selectedFile, additionalInfo };
  //     },
  //   });

  //   if (formValues) {
  //     const { selectedFile, additionalInfo } = formValues;

  //     // ✅ Prepare FormData for API
  //     const formData = new FormData();
  //     formData.append("id", ""); // agar id blank hi bhejni hai
  //     formData.append("DocName", selectedFile.name);
  //     formData.append("DocPath", ""); // backend me handle hoga
  //     formData.append("QueryId", "QRY123"); // yahan aap dynamic value bhi dal sakte ho
  //     formData.append("QuotationNumber", "QT456");
  //     formData.append("TourId", "TID789");
  //     formData.append("SupplierId", 5);
  //     formData.append("Status", 1);
  //     formData.append("AddedBy", 1);
  //     formData.append("UpdatedBy", 1);
  //     formData.append("file", selectedFile); // actual file bhejna jaruri hai

  //     try {
  //       const response = await axiosOther.post(
  //         "store-upload-doc",
  //         formData,
  //         {
  //           headers: { "Content-Type": "multipart/form-data" },
  //         }
  //       );

  //       Swal.fire("Success", "File uploaded successfully!", "success");
  //       console.log("Response:", response.data);

  //     } catch (error) {
  //       Swal.fire("Error", "File upload failed!", "error");
  //       console.error("Upload Error:", error);
  //     }
  //   }
  // };


  // const showFormPrompt = async () => {
  //   // Create a form container dynamically
  //   const form = document.createElement("form");
  //   form.className = "themeForm";
  //   form.style.display = "flex";
  //   form.style.flexDirection = "column";
  //   form.style.gap = "5px";
  //   form.style.backgroundColor = "#202020";

  //   // Create file input
  //   const fileInput = document.createElement("input");
  //   fileInput.className = "themeFileInput";
  //   fileInput.title = "Upload File";
  //   fileInput.style.backgroundColor = "#202020";
  //   fileInput.type = "file";
  //   fileInput.id = "fileInput";
  //   fileInput.style.marginBottom = "10px";

  //   // Create textarea for additional information
  //   const textArea = document.createElement("textarea");
  //   textArea.id = "textArea";
  //   textArea.placeholder = "Description";
  //   textArea.style.resize = "none";
  //   textArea.style.backgroundColor = "#202020";
  //   textArea.style.height = "40px";
  //   textArea.style.width = "100%";
  //   textArea.className = "themeTextArea"; // Add class for theming
  //   textArea.required = true;

  //   // Append inputs to the form
  //   form.appendChild(fileInput);
  //   form.appendChild(textArea);

  //   // Show SweetAlert with the form inside it
  //   const { value: formValues } = await Swal.fire({
  //     title: "Upload Documents",
  //     text: "Please fill the details",
  //     content: form,
  //     buttons: ["Cancel", "Upload"],
  //     dangerMode: true,
  //     customClass: {
  //       popup: "swal-high-zindex",
  //       confirmButton: "bg-primary text-white",
  //     },
  //     html: form,
  //     focusConfirm: false,
  //     showCancelButton: true,
  //     confirmButtonText: "Upload",
  //     cancelButtonText: "Cancel",
  //     preConfirm: () => {
  //       const selectedFile = fileInput.files[0];
  //       const additionalInfo = textArea.value.trim();

  //       // Check if the user has selected a file
  //       if (!selectedFile) {
  //         Swal.showValidationMessage("No file selected. Please try again.");
  //         return false;
  //       }
  //       // else if (!additionalInfo) {
  //       //   Swal.showValidationMessage("Description is required.");
  //       //   return false;
  //       // }

  //       // setSupplierPaymentList({...supplierPaymentList, attachedDoc :selectedFile});

  //       // Return the file and additional information
  //       return { selectedFile, additionalInfo };
  //     },
  //   });

  //   if (formValues) {
  //     // Log the file and additional information
  //     console.log("Selected File:", formValues.selectedFile);
  //     console.log("Additional Information:", formValues.additionalInfo);

  //     // Simulate a successful upload
  //     Swal.fire("Success", "File uploaded successfully!", "success");
  //   }
  // };

  // Helper method that calculate price based on service
  const getTotalCostSum = (services) => {
    return services.reduce((total, service) => {
      const rateSum = service.RateDetails.reduce(
        (rateTotal, rate) => rateTotal + (rate.TotalCost || 0),
        0
      );
      return total + rateSum;
    }, 0);
  };

  // Helper method that get Sum of Hotel Cost
  const getTotalCostFromRates = (rateDetails) => {
    return rateDetails.reduce((sum, rate) => sum + (rate.TotalCost || 0), 0);
  };
  const getTotalServiceCost = (rateDetails) => {
    return rateDetails.reduce((sum, rate) => sum + (rate.ServiceCost || 0), 0);
  };

  const handleSupplierPayment = async (supplier) => {
    if (!(supplier?.SupplierId && supplier?.SupplierName)) {
      const confirmation = await swal({
        title: "Supplier not found.",
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
    }
    setSelectedFormData(supplier);
    setShowModal(true);
  };

  return (
    <div className=" SupplierPaymentRequest m-0 p-0">
      <Row>
        <Col md={12}>
          <Card>
            <div className="heading mt-2 border-0">
              <SupplierPaymentList
                supplierPaymentList={supplierPaymentList}
                listFinalSupplierPayment={listFinalSupplierPayment}
                setListFinalSupplierPayment={setListFinalSupplierPayment}
                paidAmountList={paidAmountList}
              />

              <div className="cardbody">
                {supplierPaymentList?.PaymentInfo?.PaymentBreakup?.map(
                  (supplier, idx) => (
                    <div key={idx} className="supplier-card-2">
                      {/* Heading */}
                      <div className="p-0">
                        <div className="row headings">
                          <div className="row">
                            <div className="supplier col-4 mt-auto mb-auto">
                              <span className=" text-start textaddnew ms-3">
                                <span className="textbig">
                                  SUPPLIER - {supplier.SupplierName}
                                </span>
                              </span>
                            </div>

                            <div className="  d-flex justify-content-center col-4 mt-auto mb-auto gap-2">
                              <div className="">
                                <button
                                  className="btn btn-custom-size btn-primary"
                                  onClick={() => showFormPrompt(idx)}
                                >
                                  <i className="fa-sharp fa-solid fa-plus"></i>{" "}
                                  Upload Document
                                </button>
                              </div>
                              <div className="p-0">
                                <button
                                  onClick={() =>
                                    handleSupplierPayment(supplier)
                                  }
                                  className="btn btn-custom-size btn-warning"
                                >
                                  {" "}
                                  Payment Information
                                </button>
                              </div>
                            </div>
                            <div className="d-flex col-4 tablecol">
                              <div className="col m-2 p-2">
                                <div
                                  className="number"
                                  style={{ color: "#32C100" }}
                                >
                                  {supplier.FinalPrice}
                                </div>
                                <div className="name mt-1">FINAL PRICE</div>
                              </div>
                              <div className="col m-2 p-2">
                                <div
                                  className="number"
                                  style={{ color: "#F0AD00" }}
                                >
                                  {supplier.PendingPrice}
                                </div>
                                <div className="name mt-1">PENDING</div>
                              </div>
                              <div className="col m-2 p-2">
                                <div
                                  className="number"
                                  style={{ color: "#E30000" }}
                                >
                                  {supplier.PaidPrice}
                                </div>
                                <div className="name mt-1">Paid</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {console.log(supplierPaymentList, "supplierPaymentList")}
                      {/* Service Card */}
                      {supplier?.PaymentSupplierBreakup?.map(
                        (service, index) => (
                          <div key={index}>
                            {/* Monument */}
                            {service?.ServiceType === "Monument" && (
                              <div className="p-3 pb-0">
                                <div className="border-bottom p-2">
                                  <div className="headtransport d-flex gap-2 align-items-center">
                                    <img src={MonumentIcon} alt="Monument" />
                                    <h6 className="mb-0">
                                      <p className="d-inline text-dark">
                                        {service?.ServiceType} -{" "}
                                      </p>
                                      {service?.ServiceName}
                                    </h6>
                                  </div>
                                </div>
                                <div className="p-2">
                                  <div className="row headingsss">
                                    <div className="col">Adult Ticket Cost</div>
                                    <div className="col">Child Ticket Cost</div>
                                    <div className="col">
                                      Total Service Cost
                                    </div>
                                    <div className="col">Cost to Company</div>
                                  </div>
                                  <div className="row columnsss">
                                    <div className="col pt-1"></div>
                                    <div className="col pt-1"></div>
                                    <div className="col pt-1">
                                      {service?.RateDetails?.[0]?.ServiceCost}
                                    </div>
                                    <div className="col pt-1">
                                      {service?.RateDetails?.[0]?.TotalCost}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Hotel */}
                            {service?.ServiceType === "Hotel" && (
                              <div className="p-3 pb-0">
                                <div className="border-bottom p-2">
                                  <div className="headtransport d-flex gap-2 align-items-center">
                                    <img src={HotelIcon} alt="Hotel" />
                                    <h6 className="mb-0 fs-6">
                                      <p className="d-inline text-dark">
                                        {service?.ServiceType} -{" "}
                                      </p>
                                      {service?.ServiceName}
                                    </h6>
                                  </div>
                                </div>
                                <div className="p-2">
                                  <div className="row headingsss">
                                    <div className="col p-1">Room Type</div>
                                    <div className="col p-1">Meal Plan</div>
                                    {service?.RateDetails?.map((room, idx2) => (
                                      <div key={idx2} className="col p-1">
                                        {room?.BedTypeName}
                                      </div>
                                    ))}

                                    <div className="col p-1">
                                      Total Cost to Company
                                    </div>
                                  </div>
                                  <div className="row columnsss">
                                    <div className="col p-1">
                                      {service?.RoomType}
                                    </div>
                                    <div className="col p-1">
                                      {service?.MealPlan}
                                    </div>
                                    {service?.RateDetails?.map((room, idx2) => (
                                      <div key={idx2} className="col p-1">
                                        {room.ServiceCost} X {room.NoOfServices}
                                      </div>
                                    ))}

                                    <div className="col p-1">
                                      {getTotalCostFromRates(
                                        service?.RateDetails
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Guide */}
                            {service?.ServiceType === "Guide" && (
                              <div className="p-3 pb-0">
                                <div className="border-bottom p-2">
                                  <div className="headtransport d-flex gap-2 align-items-center ">
                                    <img src={GuideIcon} alt="Guide" />
                                    <h6 className="mb-0 fs-6">
                                      <p className="d-inline text-dark">
                                        {service?.ServiceType} -{" "}
                                      </p>
                                      {service?.ServiceName}
                                    </h6>
                                  </div>
                                </div>
                                <div className="p-2">
                                  <div className="row headingsss">
                                    <div className="col">Per Pax Cost</div>

                                    <div className="col">
                                      Total Service Cost
                                    </div>
                                    <div className="col">Cost to Company</div>
                                  </div>
                                  <div className="row columnsss">
                                    <div className="col pt-1">
                                      {service?.RateDetails?.[0]?.ServiceCost}
                                    </div>

                                    <div className="col pt-1">
                                      {service?.RateDetails?.[0]?.ServiceCost}
                                    </div>
                                    <div className="col pt-1">
                                      {service?.RateDetails?.[0]?.TotalCost}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Activity */}
                            {service?.ServiceType === "Activity" && (
                              <div className="p-3 pb-0">
                                <div className="border-bottom p-2">
                                  <div className="headtransport d-flex gap-2 align-items-center">
                                    <img src={ActivityIcon} alt="Activity" />
                                    <h6 className="mb-0">
                                      <p className="d-inline text-dark">
                                        {service?.ServiceType} -{" "}
                                      </p>
                                      {service?.ServiceName}
                                    </h6>
                                  </div>
                                </div>
                                <div className="p-2">
                                  <div className="row headingsss">
                                    <div className="col">Per Pax Cost</div>

                                    <div className="col">
                                      Total Service Cost
                                    </div>
                                    <div className="col">Cost to Company</div>
                                  </div>
                                  <div className="row columnsss">
                                    <div className="col pt-1">
                                      {service?.RateDetails?.[0]?.ServiceCost}
                                    </div>

                                    <div className="col pt-1">
                                      {service?.RateDetails?.[0]?.ServiceCost}
                                    </div>
                                    <div className="col pt-1">
                                      {service?.RateDetails?.[0]?.TotalCost}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Restaurant */}
                            {service?.ServiceType === "Restaurant" && (
                              <div className="p-3 pb-0">
                                <div className="border-bottom p-2">
                                  <div className="headtransport d-flex gap-2 align-items-center">
                                    <img src={HotelIcon} alt="Restaurant" />
                                    <h6 className="mb-0">
                                      <p className="d-inline text-dark">
                                        {service?.ServiceType} -{" "}
                                      </p>
                                      {service?.ServiceName}
                                    </h6>
                                  </div>
                                </div>
                                <div className="p-2">
                                  <div className="row headingsss">
                                    {console.log(service, "HHY7")}
                                    {service?.RateDetails?.map(
                                      (meal, index2) => (
                                        <div className="col">
                                          {meal?.MealName}
                                        </div>
                                      )
                                    )}

                                    <div className="col">
                                      Total Service Cost
                                    </div>
                                    <div className="col">Cost to Company</div>
                                  </div>
                                  <div className="row columnsss">
                                    {service?.RateDetails?.map(
                                      (meal, index2) => (
                                        <div className="col">
                                          {meal?.ServiceCost}
                                        </div>
                                      )
                                    )}

                                    <div className="col pt-1">
                                      {getTotalCostFromRates(
                                        service?.RateDetails
                                      )}
                                    </div>
                                    <div className="col pt-1">
                                      {getTotalServiceCost(
                                        service?.RateDetails
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Flight */}
                            {service?.ServiceType === "Flight" && (
                              <div className="p-3 pb-0">
                                <div className="border-bottom p-2">
                                  <div className="headtransport d-flex gap-2 align-items-center">
                                    <img src={FlightIcon} alt="Flighticon" />
                                    <h6 className="mb-0">
                                      <p className="d-inline text-dark">
                                        {service?.ServiceType} -{" "}
                                      </p>
                                      {service?.ServiceName}
                                    </h6>
                                  </div>
                                </div>
                                <div className="p-2">
                                  <div className="row headingsss">
                                    <div className="col">Adult Ticket Cost</div>
                                    <div className="col">Child Ticket Cost</div>
                                    <div className="col">
                                      Total Service Cost
                                    </div>
                                    <div className="col">Cost to Company</div>
                                  </div>
                                  <div className="row columnsss">
                                    <div className="col pt-1"></div>
                                    <div className="col pt-1"></div>
                                    <div className="col pt-1">
                                      {service?.RateDetails?.[0]?.ServiceCost}
                                    </div>
                                    <div className="col pt-1">
                                      {service?.RateDetails?.[0]?.TotalCost}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Additional */}
                            {service?.ServiceType === "Additional" && (
                              <div className="p-3 pb-0">
                                <div className="border-bottom p-2">
                                  <div className="headtransport d-flex gap-2 align-items-center">
                                    <img
                                      src={AdditionalIcon}
                                      alt="AdditionalIcon"
                                    />
                                    <h6 className="mb-0">
                                      <p className="d-inline text-dark">
                                        {service?.ServiceType} -{" "}
                                      </p>
                                      {service?.ServiceName}
                                    </h6>
                                  </div>
                                </div>
                                <div className="p-2">
                                  <div className="row headingsss">
                                    <div className="col">Per Pax Cost</div>

                                    <div className="col">
                                      Total Service Cost
                                    </div>
                                    <div className="col">Cost to Company</div>
                                  </div>
                                  <div className="row columnsss">
                                    <div className="col pt-1">
                                      {service?.RateDetails?.[0]?.ServiceCost}
                                    </div>

                                    <div className="col pt-1">
                                      {service?.RateDetails?.[0]?.ServiceCost}
                                    </div>
                                    <div className="col pt-1">
                                      {service?.RateDetails?.[0]?.TotalCost}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Transport */}
                            {service?.ServiceType === "Transport" && (
                              <div className="p-3 pb-0 ">
                                <div className="border-bottom p-2">
                                  <div className="headtransport d-flex gap-2 align-items-center ">
                                    <img
                                      src={TransportIcon}
                                      alt="TransportIcon"
                                    />
                                    <h6 className="mb-0">
                                      <p className="d-inline text-dark">
                                        {service?.ServiceType} -{" "}
                                      </p>
                                      {service?.ServiceName}
                                    </h6>
                                  </div>
                                </div>
                                <div className="p-2">
                                  <div className="row headingsss">
                                    <div className="col">Adult Ticket Cost</div>
                                    <div className="col">Child Ticket Cost</div>
                                    <div className="col">
                                      Total Service Cost
                                    </div>
                                    <div className="col">Cost to Company</div>
                                  </div>
                                  <div className="row columnsss">
                                    <div className="col pt-1"></div>
                                    <div className="col pt-1"></div>
                                    <div className="col pt-1">
                                      {service?.RateDetails?.[0]?.ServiceCost}
                                    </div>
                                    <div className="col pt-1">
                                      {service?.RateDetails?.[0]?.TotalCost}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <SupplierPaymentModal
        selectedFormData={selectedFormData}
        show={showModal}
        handleClose={handleClose}
        paymentTypeList={paymentTypeList}
        pendingAmount={pendingAmount}
        paidAmount={paidAmount}
        listFinalSupplierPayment={listFinalSupplierPayment}
        setListFinalSupplierPayment={setListFinalSupplierPayment}
        selectedQuotationOption={selectedQuotationOption}
        callApiOnSave={callApiOnSave}
      />
    </div>
  );
};

export default SupplierPaymentRequest;
