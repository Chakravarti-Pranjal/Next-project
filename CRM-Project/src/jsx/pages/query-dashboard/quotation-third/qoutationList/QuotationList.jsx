import React, { useEffect, useState } from "react";
import quotationlistimg1 from "../../../../../images/quotation/quotationlistimg1.svg";
import icon3 from "../../../../../images/quotation/icon3.svg";
import Table from "react-bootstrap/Table";
import { axiosOther } from "../../../../../http/axios_base_url";
import { useLocation, useNavigate } from "react-router-dom";
import { notifyError, notifySuccess } from "../../../../../helper/notify";
import { ToastContainer, Modal, Row, Button } from "react-bootstrap";
import {
  setQoutationData,
  setItineraryEditingTrue,
  setQoutationSubject,
  setQueryData,
  setQuotationDataOperation,
  DayServicesCondition,
} from "../../../../../store/actions/queryAction";
import { useDispatch, useSelector } from "react-redux";
import { formatDate } from "../../../../../helper/formatDate";
import "./style.css";
import Hotel from "../../../../../images/itinerary/hotel.svg";
import { setCommunicationData } from "../../../../../store/actions/supplierAction";
import moment from "moment";
import useQueryData from "../../../../../hooks/custom_hooks/useQueryData";

const QuotationListsec = () => {
  const queryData = useQueryData();

  const { state } = useLocation();
  const [modalCentered, setModalCentered] = useState(false);
  const [modalHotelList, setModalHotelList] = useState(false);
  const [qoutationList, setQoutationList] = useState([]);
  const [queryMasterList, setQueryMasterList] = useState({});
  const [hotelList, setHotelList] = useState([]);
  const [hotelAvailableList, setHotelAvailableList] = useState([]);
  const [servicePrice, setServicePrice] = useState("");
  const [serviceTypeId, setServiceTypeId] = useState("");
  const [showSelected, setShowSelected] = useState(false);
  const [quotationNumber, setQuotationNumber] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState({
    check: false,
    ind: "",
  });

  const { qoutationData, dayServicesCondition } = useSelector(
    (data) => data?.queryReducer
  );

  const getQoutationList = async () => {
    try {
      const { data } = await axiosOther.post("listqueryquotation", {
        QueryId: state?.QueryData?.QueryID ?? queryData?.QueryAlphaNumId,
        QuotationNo: "",
      });
      console.log(data);
      if (data?.success) {
        setQoutationList(data?.data);
        // console.log("QoutationList", data?.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  console.log(dayServicesCondition, "dayServicesCondition");

  const getQueryList = async (quotation) => {
    try {
      const { data } = await axiosOther.post("querymasterlist", {
        QueryId: queryData?.QueryAlphaNumId,
      });

      setQueryMasterList(data?.DataList?.[0]);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getQueryList();
  }, [queryData]);

  const emptyqoutationdata = () => {
    localStorage.setItem(
      "Query_Qoutation",
      JSON.stringify({ QoutationNum: "", QueryID: queryData?.QueryAlphaNumId })
    );
    if (qoutationData != {}) {
      dispatch(setQoutationData({}));
    }
  };

  useEffect(() => {
    emptyqoutationdata();
  }, []);

  useEffect(() => {
    getQoutationList();
  }, [state?.QueryData?.QueryID ?? queryData?.QueryAlphaNumId]);

  const handleOperation = (quotatationData) => {
    dispatch(
      setQuotationDataOperation({
        ...quotatationData,
        QueryId: state?.QueryData?.QueryID ?? queryData?.QueryAlphaNumId,
        id: queryMasterList?.id,
      })
    );
    navigate("/query/supplier-communication", { state: true });
  };

  const handleDuplicate = async (QuotationNo, status) => {
    const confirmation = await swal({
      title: "Are you sure to save as New?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });

    if (confirmation) {
      let data;
      try {
        if (status === "Confirmed") {
          data = await axiosOther.post("copy-final-quotation", {
            id: state?.QueryData?.id ?? queryData?.QueryAlphaNumId,
            QuotationNo: QuotationNo,
          });
        } else {
          data = await axiosOther.post("duplicateQuatation", {
            id: state?.QueryData?.id ?? queryData?.QueryAlphaNumId,
            QuatationNo: QuotationNo,
          });
        }
        if (
          data?.data?.Status == 1 ||
          data?.data?.status == 1 ||
          data?.data?.result ||
          data?.data?.Message
        ) {
          getQoutationList();
          notifySuccess(
            data?.data?.message ||
              data?.data?.Message ||
              data?.data?.result ||
              data?.data?.Message
          );
        }
      } catch (err) {
        if (err) {
          notifyError(err?.message || err?.Message);
        }
      }
    }
  };

  const getHotelList = async (quotation) => {
    setQuotationNumber(quotation?.QuotationNumber);
    try {
      const { data } = await axiosOther.post("final-select-suppliment", {
        QueryId: state?.QueryData?.QueryID ?? queryData?.QueryAlphaNumId,
        QuotationNo: quotation?.QuotationNumber,
      });
      if (data?.success || data?.status == 1) {
        setHotelList(data?.Days);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleFinalQuotation = async (value) => {
    try {
      const { data } = await axiosOther.post("final-select-suppliment-select", {
        id: state?.QueryData?.id ?? queryData?.QueryId,
        QueryId: state?.QueryData?.QueryID ?? queryData?.QueryAlphaNumId,
        QuotationNo: quotationNumber,
        DayUniqueId: value?.DayUniqueId,
        DayNo: value?.Day,
        ServiceType: value?.DayServices?.[0]?.ServiceType,
        ServiceTypeId: serviceTypeId,
      });
      if (data?.success || data?.status == 1) {
        setShowSelected(true);
        getQoutationList();
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleSend = (data) => {
    dispatch(setCommunicationData(data));
    navigate("/query/supplier-communication", {
      state: {
        ...data,
        QueryId: state?.QueryData?.QueryID ?? queryData?.QueryAlphaNumId,
      },
    });
  };

  const handleFormChange = (e) => {
    setServiceTypeId(e.target?.value);
    const price = hotelList.map((data, index) =>
      data.DayServices.filter(
        (item) => String(item?.ServiceId) === String(e.target?.value)
      )
    );
    setServicePrice(price?.[0]?.[0]?.["ServicePrice"]);
  };

  const handleHotelAvailability = async (quotatationNo) => {
    try {
      const { data } = await axiosOther.post(
        "listofavailablehotelbyqutationno",
        {
          QueryId: state?.QueryData?.id ?? queryData?.QueryAlphaNumId,
          QutationNo: quotatationNo,
          Type: "Hotel",
        }
      );
      if (data?.success || data?.status == 1 || data?.Message) {
        setHotelAvailableList(data?.Data);
        setModalHotelList(true);
      } else {
        notifyError(data?.Message);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleMakeFinal = (quotation) => {
    getHotelList(quotation);
    setModalCentered(true);
  };

  const handleSubmit = async (qoutation) => {
    try {
      const { data } = await axiosOther.post("quotation-final-submit", {
        id: state?.QueryData?.id ?? queryData?.QueryAlphaNumId,
        QuotationNumber: qoutation?.QuotationNumber,
      });
      if (data?.success || data?.status == 1 || data?.Message) {
        getQoutationList();
        notifySuccess(data?.Message);
        setModalCentered(false);
      } else {
        notifyError(data?.Message);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const queryQuotation = JSON.parse(localStorage.getItem("Query_Qoutation"));
  const getqueryData = async () => {
    const payload = {
      QueryId: queryQuotation?.QueryID,
    };
    try {
      const { data } = await axiosOther.post("querymasterlist", payload);
      dispatch(
        setQueryData({
          QueryId: data?.DataList[0]?.id,
          QueryAlphaNumId: data?.DataList[0]?.QueryID,
          QueryAllData: data?.DataList[0],
        })
      );
    } catch (e) {
      console.log(e);
    }
  };

  // console.log(queryData, "querydata");

  useEffect(() => {
    getqueryData();
  }, []);

  const redirectToItinerary = (data) => {
    localStorage.removeItem("quotationList");
    +dispatch(setQoutationSubject(data?.Header?.Subject));
    localStorage.setItem(
      "Query_Qoutation",
      JSON.stringify({
        QoutationNum: data?.QuotationNumber,
        QueryID: queryData?.QueryAlphaNumId,
      })
    );
    navigate("/query/quotation");
    dispatch(setQoutationData(data));
    dispatch(setItineraryEditingTrue());
  };

  const openPopup = async (quotation, uniqueId) => {
    try {
      const response = await axiosOther.post("costsheet-template", {
        QueryId: state?.QueryData?.QueryID ?? queryData?.QueryAlphaNumId,
        QuotationNumber: quotation?.QuotationNumber,
        UniqueId: uniqueId,
        TemplateType: "FIT-Costsheet",
      });

      if (response.status !== 200) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const templateUrl = response.data?.TemplateUrl;
      if (!templateUrl) {
        throw new Error("Template URL not received from API.");
      }

      // Create Popup Div
      const popupDiv = document.createElement("div");

      Object.assign(popupDiv.style, {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "90%",
        height: "95vh",
        backgroundColor: "white",
        // backgroundColor: "rgba(0, 0, 0, 0.5)",
        borderRadius: "2rem",
        zIndex: 1000,
        display: "flex",
        flexWrap: "wrap", // Allow items to wrap if needed
        alignItems: "flex-start", // Align items at the top
        justifyContent: "center",
        padding: "1rem 0",
      });

      // Create the iframe
      const iframe = document.createElement("iframe");
      Object.assign(iframe.style, {
        width: "100%",
        height: "85%",
        border: "none",
        // borderRadius: "10px",
        // boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
        backgroundColor: "white",
      });

      iframe.src = templateUrl;

      // Close Button
      const closeButton = document.createElement("div");
      closeButton.innerHTML = "&times;";
      Object.assign(closeButton.style, {
        // position: "absolute",
        top: "10px",
        right: "20px",
        fontSize: "2rem",
        fontWeight: "lighter",
        color: "#bd241a",
        cursor: "pointer",
        zIndex: 1001,
        marginRight: "1rem",
      });

      // Close Button (Second Version)
      const closeButtonAlt = document.createElement("button");
      closeButtonAlt.innerText = "Close";
      Object.assign(closeButtonAlt.style, {
        padding: "0.3125rem 1.25rem",
        fontSize: "1rem",
        color: "white",
        backgroundColor: "#bd241a",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginRight: "2rem",
        // marginLeft:"auto",

        // marginLeft: "auto",
        // position: "absolute",
        // top: "93%",
        // left: "92%",
      });

      // Export Button
      const exportButton = document.createElement("button");
      exportButton.innerText = "Export";
      Object.assign(exportButton.style, {
        padding: "0.3125rem 1.25rem",
        fontSize: "1rem",
        color: "white",
        backgroundColor: "#28a745",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginLeft: "auto",
        marginRight: "3rem",
        // position: "absolute",
        // top: "93%",
        // left: "85%",
      });

      const exportButton2 = document.createElement("button");
      exportButton2.innerText = "Export";
      Object.assign(exportButton2.style, {
        padding: "0.3125rem 1.25rem",
        fontSize: "1rem",
        color: "white",
        backgroundColor: "#28a745",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        // alignSelf:"end"
        marginLeft: "auto",
        marginRight: "7rem",
        // position: "absolute",
        // display:"flex",
        // top: "3%",
        // left: "90%",
      });

      // Close Popup Function
      const closePopup = () => {
        document.body.style.overflow = "auto";
        if (document.body.contains(popupDiv)) {
          document.body.removeChild(popupDiv);
        }
      };

      closeButton.onclick = closePopup;
      closeButtonAlt.onclick = closePopup;

      exportButton.onclick = () => exportTemplate(templateUrl);
      exportButton2.onclick = () => exportTemplate(templateUrl);

      // Append Elements
      popupDiv.appendChild(exportButton2);
      popupDiv.appendChild(closeButton);
      popupDiv.appendChild(iframe);
      popupDiv.appendChild(exportButton);
      popupDiv.appendChild(closeButtonAlt);

      document.body.appendChild(popupDiv);
      document.body.style.overflow = "hidden";

      // Keydown Event for ESC Key
      const keyDownHandler = (event) => {
        if (event.key === "Escape") {
          closePopup();
          document.removeEventListener("keydown", keyDownHandler);
        }
      };

      document.addEventListener("keydown", keyDownHandler);
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert("Failed to generate the template. Please try again later.");
    }
    const exportTemplate = async (templateUrl) => {
      console.log("Exporting:", templateUrl);

      try {
        // Send the HTML content to the API
        const response = await axiosOther.post(
          "export-html-to-excel",
          { htmlContent: templateUrl },
          { responseType: "blob" } // Ensure response is treated as a binary file
        );

        console.log("Export Successful");

        // Create a download link for the exported Excel file
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "exported_data.xlsx"; // Set the filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error exporting HTML to Excel:", error);
        alert("Export failed. Please try again.");
      }
    };
  };

  const openPurposal = async (quotation, QuotationList) => {
    console.log(
      "sss" + state?.QueryData?.QueryID,
      quotation,
      "QuotationNumber"
    );
    try {
      const response = await axiosOther.post("proposal-template", {
        QueryId: state?.QueryData?.QueryID,
        QuotationNumber:
          qoutationList.length > 0 ? qoutationList[0]?.QuotationNumber : "",
      });

      console.log(response);
      if (response.status !== 200) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const templateUrl = response.data.TemplateUrl;
      if (!templateUrl) {
        throw new Error("TemplateUrl is missing in API response");
      }
      // Proceed only if API call is successful
      window.open(
        templateUrl,
        "_blank",
        "noopener,noreferrer",
        "PopupWindow",
        "width=100%,height=100%,top=100,left=100"
      );
    } catch (error) {
      console.error("Error in openProposal:", error);
    }
  };

  const { QueryStatus, TourSummary, QueryInfo, Pax } =
    qoutationList[0] != undefined ? qoutationList[0] : {};

  const qoutationGenerate = async () => {
    try {
      const { data } = await axiosOther.post("addquerywithjson", {
        QueryId: state?.QueryData?.QueryID,
        Subject: "Corenthum",
        HotelCategory: "Single Hotel Category",
        PaxSlabType: "Single Slab",
        HotelMarkupType: "Service Wise Markup",
        HotelStarCategory: [],
        PackageID: "",
      });

      if (data?.status == 1) {
        dispatch(setQoutationData(data?.Response));
        navigate("/query/quotation");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const itemVal = qoutationList[0]?.Days?.map((item) => item?.DayServices);
  const condition = itemVal?.every((item) => item?.length > 0);

  useEffect(() => {
    dispatch({ type: "DAY-SERVICES-CONDITION", payload: condition });
  }, [condition]);

  return (
    <>
      <div className="mt-3 p-0 ms-2 m-0 ">
        <div className="row border quotatation-shadows padding-around  py-2 px-2">
          <div className="col-12 col-lg-12 col-md-12 col-sm-12">
            <ToastContainer />
            <Modal className="fade hotelList" show={modalHotelList}>
              <Modal.Header>
                <ToastContainer />
                <Modal.Title>Check Availabilty</Modal.Title>
                <Button
                  onClick={() => setModalHotelList(false)}
                  variant=""
                  className="btn-close"
                ></Button>
              </Modal.Header>
              <Modal.Body>
                <Row>
                  {hotelAvailableList?.length > 0 &&
                    hotelAvailableList.map((data, outherIndex) => {
                      return (
                        <>
                          {/* <div className="text-danger fs-14 font-w500">
                         Day {data?.Day}
                        </div> */}
                          {data?.HotelAvailibility?.length > 0 ? (
                            data?.HotelAvailibility.map((hotel, index) => {
                              return (
                                <div key={index}>
                                  <div className="col-12 px-1 py-2 d-flex justify-content-between itinerary-head-bg">
                                    <div className=" d-flex justify-content-start gap-2 align-items-center">
                                      <div>
                                        <img
                                          src={Hotel}
                                          alt="hotel"
                                          className="fs-12"
                                        />
                                      </div>
                                      <div className="fs-14">
                                        {hotel?.HotelDetails?.HotelName} |{" "}
                                        {hotel?.HotelDetails?.HotelStarRating}{" "}
                                        Star |{" "}
                                        {hotel?.HotelDetails?.HotelAddress}
                                      </div>
                                    </div>
                                    <div>
                                      <button
                                        className="btn btn-primary btn-custom-size fs-14"
                                        onClick={() => handleSend(hotel)}
                                      >
                                        Send
                                      </button>
                                    </div>
                                  </div>
                                  <Table
                                    responsive
                                    striped
                                    bordered
                                    className="rate-table mt-2"
                                  >
                                    <thead>
                                      <tr>
                                        <th
                                          scope="col"
                                          className="py-2 align-middle "
                                        >
                                          Destination
                                        </th>
                                        <th
                                          scope="col"
                                          className="py-2 align-middle fs-4"
                                        >
                                          From
                                        </th>
                                        <th
                                          scope="col"
                                          className="py-2 align-middle fs-4"
                                        >
                                          To
                                        </th>

                                        <th
                                          scope="col"
                                          className="py-2 align-middle fs-4"
                                        >
                                          Room Type
                                        </th>
                                        <th
                                          scope="col"
                                          className="py-2 align-middle fs-4"
                                        >
                                          Meal Plan
                                        </th>
                                      </tr>
                                    </thead>

                                    <tbody>
                                      <tr className="fs-12">
                                        <td className="text-center text-nowrap  py-2 ">
                                          {hotel?.HotelDetails?.DestinationName}
                                        </td>
                                        <td className="text-center text-nowrap  py-2 ">
                                          {hotel?.ItenaryDetails?.FromDate}
                                        </td>
                                        <td className="text-center text-nowrap  py-2 ">
                                          {hotel?.ItenaryDetails?.ToDate}
                                        </td>

                                        <td className="text-center text-nowrap  py-2 ">
                                          {hotel?.ItenaryDetails?.RoomDetails
                                            ?.length > 0 &&
                                            hotel?.ItenaryDetails?.RoomDetails.map(
                                              (room, innerIndex) => (
                                                <span
                                                  className="fs-12"
                                                  key={innerIndex}
                                                >
                                                  {room?.RoomBedTypeName}
                                                  {innerIndex <
                                                    hotel?.ItenaryDetails
                                                      ?.RoomDetails?.length -
                                                      1 && " ,"}
                                                </span>
                                              )
                                            )}
                                        </td>

                                        <td className="text-center text-nowrap  py-2 ">
                                          {hotel?.ItenaryDetails?.MealDetails
                                            ?.length > 0 &&
                                            hotel?.ItenaryDetails?.MealDetails.map(
                                              (meal, innerIndex) => (
                                                <span
                                                  className="fs-12"
                                                  key={innerIndex}
                                                >
                                                  {meal?.MealTypeName}
                                                  {innerIndex <
                                                    hotel?.ItenaryDetails
                                                      ?.MealDetails?.length -
                                                      1 && " ,"}
                                                </span>
                                              )
                                            )}
                                        </td>
                                      </tr>
                                      {/* ); */}
                                      {/* })} */}
                                    </tbody>
                                  </Table>
                                </div>
                              );
                            })
                          ) : (
                            <div></div>
                          )}
                        </>
                      );
                    })}
                </Row>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  onClick={() => setModalHotelList(false)}
                  variant="danger light"
                  className="btn-custom-size"
                >
                  Close
                </Button>
              </Modal.Footer>
            </Modal>

            <div className="row quotationquery">
              <div className="col-2 col-md-2 col-lg-2 p-0">
                <p className="m-0 querydetails text-grey">Query Date:</p>
                <p className="m-0 querydetailspara text-grey">
                  {formatDate(queryMasterList?.QueryDate?.Date)} |
                  {moment(queryMasterList?.QueryDate?.Time, "HH:mm:ss").format(
                    "h:mm a"
                  )}
                </p>
              </div>
              <div className="col-1 col-md-1 p-0 text-center">
                <p className="m-0 querydetails text-grey">Status:</p>
                <p
                  className="m-0  font-weight-bold  badge py-1 px-2 text-grey"
                  style={{ backgroundColor: QueryStatus?.color }}
                >
                  {queryMasterList?.QueryStatus?.Name}
                </p>
              </div>
              <div className="col-2 col-md-2 col-lg-2 p-0">
                <p className="m-0 querydetails text-grey ps-4">End Date:</p>
                <p className="m-0 querydetailspara text-grey ps-4">
                  {formatDate(TourSummary?.ToDate)} | 12:46
                </p>
              </div>
              <div className="col-3 col-md-3 col-lg-3 p-0 d-flex gap-3 align-items-center">
                <div className="d-flex gap-3">
                  <div className="d-flex align-items-center">
                    <i className="fa-solid fa-circle-user fs-4 text-secondary"></i>
                  </div>
                  <div>
                    <p className="m-0 font-size-14 font-weight-bold">
                      <b>
                        {" "}
                        {queryMasterList?.ServiceDetail?.ServiceCompanyName}
                      </b>
                    </p>
                    <p className="m-0 font-weight-bold font-size-10">
                      <b>{queryMasterList?.ServiceDetail?.CompanyPhone}</b>
                    </p>
                  </div>
                </div>
                <div className="whatsapp-icon">
                  <img src="/assets/icons/whatsapp.svg" alt="" />
                </div>
              </div>
              <div className="col-4 col-md-4  col-lg-4 d-flex justify-content-center align-items-center ps-1 gap-2">
                <div>
                  <button className="btn btn-dark btn-custom-size">
                    <span>Back</span>
                    <i className="fa-solid fa-backward text-dark bg-white p-1 rounded ms-1"></i>
                  </button>
                </div>
                <div>
                  <button
                    className="btn btn-primary btn-custom-size fs-10"
                    onClick={qoutationGenerate}
                  >
                    Add Quotation
                  </button>
                </div>
                {/* <div className="row quotationbuttons "></div> */}
              </div>
            </div>
          </div>
        </div>

        <div className="row quotation-table">
          <div className="col-md-2  col-lg-2 col-sm-2 quotatation-shadows py-2 px-1 quatationdata border-end">
            <p className="text-center Destination font-w500 fs-14 text-grey">
              Destinations
            </p>
            <div className="row quotationstateres">
              <div className="col-4 ">
                <p className="m-0 headings text-grey">From</p>
                <p className="quotationstate m-0 text-grey"> DELHI</p>
              </div>

              <div className="col-4 imagesicon text-grey">
                <img src={icon3} alt="icon3" />
              </div>

              <div className="col-4">
                <p className="m-0 headings text-grey">To</p>
                <p className="quotationstate  m-0  text-grey"> AGRA</p>
              </div>
            </div>
            <div className="row sidetables">
              <div className="mt-3 tables col-sm-12">
                <div className="tabledata m-0 p-0">
                  {/* Header Row */}
                  <div className="row text-center tabless text-grey">
                    <div className="col p-0 px-1 th">Duration</div>
                    <div className="col p-0 px-1 th">Destination</div>
                    <div className="col p-0 px-1 th">Date</div>
                  </div>
                  {/* Data Rows */}
                  {TourSummary?.TourDetails?.map((tour, index) => {
                    return (
                      <div className="row text-center  text-grey" key={index}>
                        <div className="col p-0 p-1 td">Day {tour?.DayNo}</div>
                        <div className="col p-0 p-1 td">
                          {tour?.DestinationName}
                        </div>
                        <div className="col p-0 p-1 td">{tour?.Date}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="my-2 ">
              <div className="row m-0 customgap ">
                <div className="width-30-percent p-0 col-4 pe-1">
                  <div className="border d-flex flex-column">
                    <span className="m-0 p-0 text-center headingdata text-grey">
                      NIGHTS
                    </span>
                    <span className="number text-center text-number-quotationList">
                      {queryMasterList?.TravelDateInfo?.TotalNights}
                    </span>
                  </div>
                </div>
                <div className="width-30-percent p-0 col-4 pe-1">
                  <div className="border d-flex flex-column ">
                    <span className="m-0 p-0 text-center headingdata text-grey">
                      ADULTS
                    </span>
                    <span className="number text-center text-number-quotationList">
                      {queryMasterList?.PaxInfo?.Adult}
                    </span>
                  </div>
                </div>
                <div className="width-30-percent p-0 col-4 pe-1">
                  <div className="border d-flex flex-column">
                    <span className="m-0 text-center headingdata text-grey">
                      CHILDS
                    </span>
                    <span className="number text-center text-number-quotationList">
                      {queryMasterList?.PaxInfo?.Child}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="my-2 ">
              <div className="row m-0">
                {QueryInfo?.Accomondation?.RoomInfo?.map((info, index) => {
                  return (
                    <div
                      className="width-30-percent p-0 col-4 pe-1"
                      key={index}
                    >
                      <div className="border d-flex flex-column">
                        <span className="m-0 text-center headingdata text-grey">
                          {info?.RoomType}
                        </span>
                        <span className="number text-center text-number-quotationList">
                          {info?.NoOfPax != null ? info?.NoOfPax : 0}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="my-2 ">
              <div className="row m-0">
                <div className=" col-6 p-0 ">
                  <div className="border d-flex flex-column">
                    <span className="text-center m-0 headingdata text-grey">
                      BUDGET
                    </span>
                    <span className="text-center m-0 number text-number-quotationList">
                      {queryMasterList?.Budget}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="my-2">
              <div className="row m-0">
                <div className=" col-12 p-0">
                  <div className="border-bottom p-1 py-2 mt-2 border-right-0 border-left-0 ">
                    <p className="m-0  headingdata text-grey">
                      Room Preference :
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="my-2">
              <div className="row m-0">
                <div className=" col-12 ps-1">
                  <div className="d-flex flex-column">
                    <span className="headingdata text-grey">
                      Operation Person
                    </span>
                    <b>{queryMasterList?.Prefrences?.OperationPersonName}</b>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="col-md-10  col-lg-10 col-sm-2 mt-3 overflow  tablelist "
            style={{ height: "50vh", overflowY: "auto", overflowX: "hidden" }}
          >
            <Table responsive className="quotationlist">
              <thead className="w-100">
                <tr className="w-100 light-gray-text ">
                  <th
                    className="p-0 py-2 px-1 border-0 quotationheading"
                    scope="col"
                  >
                    {" "}
                    QUOTATION ID
                  </th>
                  <th
                    className="p-0 py-2 px-1 border-0 quotationheading "
                    scope="col"
                  >
                    {" "}
                    FROM DATE
                  </th>
                  <th
                    className="p-0 py-2 px-1 border-0 quotationheading"
                    scope="col"
                  >
                    {" "}
                    TO DATE
                  </th>
                  <th
                    className="p-0 py-2 px-1 border-0 quotationheading "
                    scope="col"
                  >
                    {" "}
                    DURATION
                  </th>
                  <th
                    className="p-0 py-2 px-1 border-0 quotationheading"
                    scope="col"
                  >
                    {" "}
                    TOTAL PAX
                  </th>
                  <th
                    className="p-0 py-2 px-1 border-0  quotationheading"
                    scope="col"
                  >
                    {" "}
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody className="w-100 tablepara">
                {qoutationList?.map((qoutation, index) => {
                  return (
                    <>
                      <tr className="w-100  my-1" key={index + 1}>
                        <td className=" quotationtext p-0 py-1 px-1 border-0 ">
                          <span
                            onClick={() => redirectToItinerary(qoutation)}
                            className="text-queryList-primary cursor-pointer"
                          >
                            {qoutation?.QuotationNumber}
                          </span>
                        </td>
                        <td className="quotationtexts p-0 py-2 px-1 border-0  text-light">
                          {qoutation?.TourSummary?.FromDate}
                        </td>
                        <td className="quotationtexts p-0 py-2 px-1 border-0 text-light ">
                          {qoutation?.TourSummary?.ToDate}
                        </td>
                        <td className="quotationtexts p-0 py-2 px-1 border-0 text-light">
                          {qoutation?.TourSummary?.NumberOfNights}N/
                          {qoutation?.TourSummary?.NumberOfDays}D
                        </td>
                        <td className="quotationtexts p-0 py-2 px-1 border-0 text-light ">
                          {qoutation?.TourSummary?.PaxCount} Pax
                        </td>
                        <td className="p-0 py-2 px-1 fs-6">
                          <div className="d-flex gap-3 align-items-center">
                            {/* Costsheet Toggle */}
                            {condition && (
                              <div>
                                <button
                                  className="btn btn-primary btn-custom-size px-1 quotation-button"
                                  onClick={() =>
                                    setIsOpen({
                                      check: !isOpen?.check,
                                      ind: index,
                                    })
                                  }
                                >
                                  Costsheet
                                </button>
                              </div>
                            )}

                            {/* Proposal Button */}
                            {condition && (
                              <button
                                className="btn btn-primary btn-custom-size px-1 quotation-button"
                                onClick={openPurposal}
                              >
                                Proposal
                              </button>
                            )}

                            {/* Operations or Duplicate Button */}
                            {qoutation?.QueryStatus?.name === "Confirmed" ? (
                              <button
                                className="btn text-white btn-custom-size"
                                style={{ background: "#e17c00" }}
                                onClick={() => handleOperation(qoutation)}
                              >
                                Operations
                              </button>
                            ) : (
                              <button
                                className="btn btn-primary btn-custom-size"
                                onClick={() =>
                                  handleDuplicate(
                                    qoutation?.QuotationNumber,
                                    qoutation?.QueryStatus?.name
                                  )
                                }
                              >
                                Duplicate
                              </button>
                            )}

                            {/* Payment Request Button (if Confirmed) */}
                            {qoutation?.QueryStatus?.name === "Confirmed" && (
                              <button className="btn btn-primary btn-custom-size">
                                Payment Request
                              </button>
                            )}

                            {/* Hotel Availability Button */}
                            <button
                              className="btn btn-primary btn-custom-size"
                              onClick={() =>
                                handleHotelAvailability(
                                  qoutation?.QuotationNumber
                                )
                              }
                            >
                              Hotel Availability
                            </button>

                            {/* Make Final Button or Success Icon */}
                            {qoutation?.QueryStatus?.name !== "Confirmed" ? (
                              <button
                                className="btn btn-primary btn-custom-size"
                                onClick={() => handleMakeFinal(qoutation)}
                              >
                                Make Final
                              </button>
                            ) : (
                              <div className="successicon m-1">
                                <img
                                  src={quotationlistimg1}
                                  alt="Confirmed"
                                  style={{ height: "1.3rem" }}
                                />
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>

                      <Modal
                        className="fade quotationList"
                        show={modalCentered}
                      >
                        <Modal.Header>
                          <ToastContainer />
                          <Modal.Title>
                            Make Final/ Select Supplement
                          </Modal.Title>
                          <Button
                            onClick={() => setModalCentered(false)}
                            variant=""
                            className="btn-close"
                          ></Button>
                        </Modal.Header>
                        <Modal.Body>
                          <Row>
                            {hotelList?.length > 0 ? (
                              <Table
                                responsive
                                striped
                                bordered
                                className="rate-table mt-2"
                              >
                                <thead>
                                  <tr>
                                    <th
                                      scope="col"
                                      className="py-2 align-middle "
                                    >
                                      Day
                                    </th>
                                    <th
                                      scope="col"
                                      className="py-2 align-middle fs-4"
                                    >
                                      Service Type
                                    </th>
                                    <th
                                      scope="col"
                                      className="py-2 align-middle fs-4"
                                    >
                                      Select Hotel
                                    </th>
                                    <th
                                      scope="col"
                                      className="py-2 align-middle fs-4"
                                    >
                                      Price
                                    </th>
                                    <th
                                      scope="col"
                                      className="py-2 align-middle fs-4"
                                    >
                                      Action
                                    </th>
                                  </tr>
                                </thead>

                                <tbody>
                                  {hotelList &&
                                    hotelList?.length > 0 &&
                                    hotelList.map((item, index) => {
                                      return (
                                        <tr key={index}>
                                          <td className="text-center text-nowrap  py-2 fs-5">
                                            Day {item?.Day}
                                          </td>
                                          <td className="text-center text-nowrap  py-2 fs-5">
                                            {
                                              item?.DayServices?.[0]
                                                ?.ServiceType
                                            }
                                          </td>
                                          <td className="text-center text-nowrap  py-2 fs-5">
                                            <select
                                              name="Status"
                                              id="status"
                                              className="form-control form-control-sm"
                                              // value={formValue?.Status}
                                              onChange={handleFormChange}
                                            >
                                              <option value="">Select</option>
                                              {item?.DayServices?.length > 0 &&
                                                item?.DayServices.map(
                                                  (data, innerIndex) => {
                                                    return (
                                                      <option
                                                        value={data?.ServiceId}
                                                        key={innerIndex}
                                                      >
                                                        {data?.ServiceMainType}
                                                      </option>
                                                    );
                                                  }
                                                )}
                                            </select>
                                          </td>
                                          <td className="text-center text-nowrap  py-2 fs-5">
                                            {servicePrice}
                                          </td>
                                          <td className="text-center text-nowrap  py-2 fs-5">
                                            <button
                                              className="btn btn-primary btn-custom-size fs-14"
                                              onClick={() =>
                                                handleFinalQuotation(item)
                                              }
                                            >
                                              {showSelected
                                                ? "Selected"
                                                : "Select"}
                                            </button>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                </tbody>
                              </Table>
                            ) : (
                              <div>--No Supplement Services--</div>
                            )}
                          </Row>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button
                            onClick={() => setModalCentered(false)}
                            variant="danger light"
                            className="btn-custom-size"
                          >
                            Close
                          </Button>
                          <Button
                            variant="primary"
                            onClick={() => handleSubmit(qoutation)}
                            className="btn-custom-size"
                          >
                            Save & Make Final
                          </Button>
                        </Modal.Footer>
                      </Modal>

                      {isOpen?.check && isOpen?.ind === index && (
                        <tr className="m-0 p-0">
                          <td colSpan="5" className="m-0 p-0"></td>

                          <td className="d-flex justify-content-start align-items-center m-1 p-0">
                            <div>
                              <div className="d-flex justify-content-center align-items-center">
                                <div className="row text-center mx-auto">
                                  <div className="col-12">
                                    <div className="gap-2 d-flex justify-content-center align-items-center">
                                      {qoutation?.PaxSlab?.map((e, index) => (
                                        <div
                                          key={index}
                                          className="badge bg-info rounded-pill cursor-pointer px-3"
                                          onClick={() =>
                                            openPopup(qoutation, e.UniqueId)
                                          }
                                        >
                                          {e.Min} - {e.Max}
                                        </div>
                                      ))}
                                      {/* <div className="badge bg-info rounded-pill cursor-pointer px-3">
                                        2
                                      </div>
                                      <div className="badge bg-info rounded-pill cursor-pointer px-3">
                                        3
                                      </div>
                                      <div className="badge bg-info rounded-pill cursor-pointer px-3">
                                        4
                                      </div> */}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuotationListsec;
