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
import transport from "../../../../../images/svg/transport.svg";
import entrance3 from "../../../../../images/svg/entrance3.svg";

import Swal from "sweetalert2"; // Make sure this import is present
import { axiosOther } from "../../../../../http/axios_base_url";
import SupplierPaymentList from "./SupplierPaymentList";

const SupplierPaymentRequest = () => {
  const [supplierPaymentList, setSupplierPaymentList] = useState([]);
  const [supplierListByGroup, setSupplierListByGroup] = useState({});

  const queryQuotation = JSON.parse(localStorage.getItem("Query_Qoutation"));

  const getDataFromApi = async () => {
    try {
      const { data } = await axiosOther.post("list-final-payment", {
        QueryId: queryQuotation?.QueryID,
        QuotationNumber: queryQuotation?.QoutationNum,
      });

      setSupplierPaymentList(data?.Data[0]);
      console.log(data?.Data[0], "JHU7");

      const supplierGroupData = groupByServiceName(
        data?.Data[0]?.PaymentInfo?.PaymentBreakup?.[0]?.PaymentSupplierBreakup
      );
      setSupplierListByGroup(supplierGroupData);

      console.log(supplierGroupData, "Grouped by ServiceName");
    } catch (error) {
      console.log(error);
    }
  };

  const groupByServiceName = (data) => {
    return data.reduce((acc, item) => {
      const service = item.ServiceName;

      if (!acc[service]) {
        acc[service] = [];
      }

      acc[service].push(item);

      return acc;
    }, {});
  };

  useEffect(() => {
    getDataFromApi();
  }, []);

  const showFormPrompt = async () => {
    // Create a form container dynamically
    const form = document.createElement("form");
    form.className = "themeForm";
    form.style.display = "flex";
    form.style.flexDirection = "column";
    form.style.gap = "5px";
    form.style.backgroundColor = "#202020";

    // Create file input
    const fileInput = document.createElement("input");
    fileInput.className = "themeFileInput"; // Add class for theming
    fileInput.title = "Upload File";
    fileInput.style.backgroundColor = "#202020";
    fileInput.type = "file";
    fileInput.id = "fileInput";
    fileInput.style.marginBottom = "10px";

    // Create textarea for additional information
    const textArea = document.createElement("textarea");
    textArea.id = "textArea";
    textArea.placeholder = "Description";
    textArea.style.resize = "none";
    textArea.style.backgroundColor = "#202020";
    textArea.style.height = "40px";
    textArea.style.width = "100%";
    textArea.className = "themeTextArea"; // Add class for theming

    // Append inputs to the form
    form.appendChild(fileInput);
    form.appendChild(textArea);

    // Show SweetAlert with the form inside it
    const { value: formValues } = await Swal.fire({
      title: "Upload Documents",
      text: "Please fill the details",
      content: form,
      buttons: ["Cancel", "Upload"],
      dangerMode: true,
      customClass: {
        popup: "swal-high-zindex",
        confirmButton: "bg-primary text-white",
      },
      html: form,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Upload",
      cancelButtonText: "Cancel",
      preConfirm: () => {
        const selectedFile = fileInput.files[0];
        const additionalInfo = textArea.value;

        // Check if the user has selected a file
        if (!selectedFile) {
          Swal.showValidationMessage("No file selected. Please try again.");
          return false;
        }

        // Return the file and additional information
        return { selectedFile, additionalInfo };
      },
    });

    if (formValues) {
      // Log the file and additional information
      console.log("Selected File:", formValues.selectedFile);
      console.log("Additional Information:", formValues.additionalInfo);

      // Simulate a successful upload
      Swal.fire("Success", "File uploaded successfully!", "success");
    }
  };

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

  return (
    <div className=" SupplierPaymentRequest m-0 p-0">
      <Row>
        <Col md={12}>
          <Card>
            <div className="heading mt-2 border-0 p-1">
              <SupplierPaymentList supplierPaymentList={supplierPaymentList} />

              <div className="cardbody">
                {Object.entries(supplierListByGroup).map(
                  ([serviceName, services], idx) => (
                    <div key={idx} className="supplier-card-2">
                      {/* Heading */}
                      <div className="mt-4 p-0">
                        <div className="row headings px-1 py-2 m-0 ">
                          <div className="row">
                            <div className="supplier col-4 mt-auto mb-auto">
                              <span className=" text-start textaddnew ms-3">
                                <span className="textbig">
                                  SUPPLIER - {serviceName}
                                </span>
                              </span>
                            </div>

                            <div className="  d-flex justify-content-center col-4 mt-auto mb-auto gap-2">
                              <div className="">
                                <button
                                  className="btn btn-primary py-1 px-2"
                                  onClick={() => showFormPrompt()}
                                >
                                  <i className="fa-sharp fa-solid fa-plus"></i>{" "}
                                  Upload Document
                                </button>
                              </div>
                              <div className="p-0">
                                <button className="btn btn-warning py-1 px-2 ">
                                  {" "}
                                  Payment Information
                                </button>
                              </div>
                            </div>
                            <div className="d-flex col-4 tablecol">
                              <div className="col m-2 p-2">
                                <div
                                  className="number"
                                  style={{ color: "#F0AD00" }}
                                >
                                  {getTotalCostSum(services)}
                                </div>
                                <div className="name mt-1">FINAL PRICE</div>
                              </div>
                              <div className="col m-2 p-2">
                                <div
                                  className="number"
                                  style={{ color: "#32C100" }}
                                >
                                  325663
                                </div>
                                <div className="name mt-1">PENDING</div>
                              </div>
                              <div className="col m-2 p-2">
                                <div
                                  className="number"
                                  style={{ color: "#E30000" }}
                                >
                                  325663
                                </div>
                                <div className="name mt-1">Paid</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {console.log(services, "JHUY78")}
                      {/* Service Card */}
                      {services?.map((list, index) => (
                        <div key={index}>
                          {/* Monument */}
                          {list?.ServiceType === "Monument" && (
                            <div className="mt-2 p-0   ">
                              <div className="border-bottom pb-2">
                                <div className="headtransport d-flex gap-4 align-items-center ms-4 ">
                                  <img src={transport} alt="" />
                                  <h6>{list?.ServiceType}</h6>
                                </div>
                              </div>
                              <div className="ms-5 my-4">
                                <div className="row headingsss">
                                  <div className="col">Adult Ticket Cost</div>
                                  <div className="col">Child Ticket Cost</div>
                                  <div className="col">Total Service Cost</div>
                                  <div className="col">Cost to Company</div>
                                </div>
                                <div className="row columnsss">
                                  <div className="col pt-1"></div>
                                  <div className="col pt-1"></div>
                                  <div className="col pt-1">
                                    {list?.RateDetails?.[0]?.ServiceCost}
                                  </div>
                                  <div className="col pt-1">
                                    {list?.RateDetails?.[0]?.TotalCost}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Hotel */}
                          {list?.ServiceType === "Hotel" && (
                            <div className=" mt-4 p-0">
                              <div className="mt-2 p-0 ">
                                <div className="tables ms-4">
                                  <div className="row">
                                    <div className="col-2  text-center border-top border-bottom border-left">
                                      <div className="Guest pt-4">
                                        {list?.ServiceType}
                                      </div>
                                    </div>
                                    <div className="col-10 border">
                                      <div className="row border-bottom headingsss">
                                        <div className="col p-1">Room Type</div>
                                        <div className="col p-1">Meal Plan</div>
                                        {list?.RateDetails?.map(
                                          (room, idx2) => (
                                            <div key={idx2} className="col p-1">
                                              {room?.BedTypeName}
                                            </div>
                                          )
                                        )}

                                        <div className="col p-1">
                                          Total Cost to Company
                                        </div>
                                      </div>
                                      <div className="row border-bottom columnss">
                                        <div className="col p-1">
                                          {list?.RoomType}
                                        </div>
                                        <div className="col p-1">
                                          {list?.MealPlan}
                                        </div>
                                        {list?.RateDetails?.map(
                                          (room, idx2) => (
                                            <div key={idx2} className="col p-1">
                                              {room.ServiceCost} X{" "}
                                              {room.NoOfServices}
                                            </div>
                                          )
                                        )}

                                        <div className="col p-1">
                                          {getTotalCostFromRates(
                                            list?.RateDetails
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )
                )}
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SupplierPaymentRequest;
