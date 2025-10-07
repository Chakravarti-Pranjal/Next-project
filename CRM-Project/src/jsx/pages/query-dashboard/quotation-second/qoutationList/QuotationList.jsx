import React, { useContext, useEffect, useRef, useState } from "react";
import quotationlistimg1 from "../../../../../images/quotation/quotationlistimg1.svg";
import icon3 from "../../../../../images/quotation/icon3.svg";
import Table from "react-bootstrap/Table";
import { axiosOther } from "../../../../../http/axios_base_url";
import { useLocation, useNavigate } from "react-router-dom";
import { notifyError, notifySuccess } from "../../../../../helper/notify";
import { ToastContainer, Modal, Row, Button } from "react-bootstrap";
import { format } from "date-fns";
import {
  setQoutationData,
  setItineraryEditingTrue,
  setQoutationSubject,
  setQueryData,
  setQuotationDataOperation,
  DayServicesCondition,
} from "../../../../../store/actions/queryAction";
import OutlookLogo from "../../../../../images/outlookLogo.svg";
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from "react-redux";
import { formatDate } from "../../../../../helper/formatDate";
import "./style.css";
import Hotel from "../../../../../images/itinerary/hotel.svg";
import { setCommunicationData } from "../../../../../store/actions/supplierAction";
import moment from "moment";
import useQueryData from "../../../../../hooks/custom_hooks/useQueryData";
import PaxSlab from "../itinerary-pax-slabwise";
import activeQuotation from "/assets/icons/activeIcons/Quotation.svg";
import inactiveQuotation from "/assets/icons/InactiveIcons/Quotation.svg";
import activeAssignie from "/assets/icons/activeIcons/assignUser.svg";
import inactiveAssignie from "/assets/icons/InactiveIcons/assignUser.svg";
import activeCostSheet from "/assets/icons/activeIcons/Costsheet.svg";
import inactiveCostSheet from "/assets/icons/InactiveIcons/Costsheet.svg";
import activeInvoice from "/assets/icons/activeIcons/Invoice.svg";
import inactiveInvoice from "/assets/icons/InactiveIcons/Invoice.svg";
import activeMail from "/assets/icons/activeIcons/clientCommunication.svg";
import inactiveMail from "/assets/icons/InactiveIcons/clientCommunication.svg";
import activePayment from "/assets/icons/activeIcons/Payments.svg";
import inactivePayment from "/assets/icons/InactiveIcons/Payments.svg";
import activeProposal from "/assets/icons/activeIcons/Proposal.svg";
import inactiveProposal from "/assets/icons/InactiveIcons/Proposal.svg";
import activeQueryIcon from "/assets/icons/activeIcons/Query.svg";
import inactiveQueryIcon from "/assets/icons/InactiveIcons/Query.svg";
import activeSupplier from "/assets/icons/activeIcons/supplierCommunication.svg";
import inactiveSupplier from "/assets/icons/InactiveIcons/supplierCommunication.svg";
import activeTour from "/assets/icons/activeIcons/tourExecution.svg";
import inactiveTour from "/assets/icons/InactiveIcons/tourExecution.svg";
import activeVouchers from "/assets/icons/activeIcons/Voucher.svg";
import inactiveVouchers from "/assets/icons/InactiveIcons/Voucher.svg";
import activeDuplicate from "/assets/icons/activeIcons/duplicate.svg";
import activehotelIcon from "/assets/icons/activeIcons/hotelIcon.svg";
import DestinationsCard from "../../../../components/destinationsCard/DestinationsCard";
import QueryDetailedCard from "../../../../components/queryDetailedCard/QueryDetailedCard";
import {
  setFinalQueryAction,
  setFinalQueryDataAction,
} from "../../../../../store/actions/applicationLevelAction/queryFinalAction";
import { ThemeContext } from "../../../../../context/ThemeContext";

// Helper function to add days to a date
const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const QuotationListsec = () => {
  const { background } = useContext(ThemeContext);

  const storedDataQuery_Type_Status = localStorage.getItem("Query_Type_Status");
  const parsedDataQuery_Type_Status = storedDataQuery_Type_Status
    ? JSON.parse(storedDataQuery_Type_Status)
    : null;
  const queryData = useQueryData();
  // console.log(queryData, "manish");

  const { state } = useLocation();
  // console.log(state, "statee4r3434")
  const [modalCentered, setModalCentered] = useState(false);
  // const [modalSeriesDetail, setModalSeriesDetail] = useState(false);
  const [modalHotelList, setModalHotelList] = useState(false);
  const [qoutationList, setQoutationList] = useState([]);
  const [finalmailtemplate, setFinalmailtemplate] = useState([]);
  const [qoutationListFinal, setQoutationListFinal] = useState([]);
  const [qoutationSeriesList, setQoutationSeriesList] = useState([]);
  const [qoutationSeriesListQueryJson, setQoutationSeriesListQueryJson] =
    useState([]);
  const [queryMasterList, setQueryMasterList] = useState({});
  const [hotelList, setHotelList] = useState([]);
  const [hotelAvailableList, setHotelAvailableList] = useState([]);
  const [servicePrice, setServicePrice] = useState("");
  const [serviceTypeId, setServiceTypeId] = useState("");
  const [showSelected, setShowSelected] = useState(false);
  const [quotationNumber, setQuotationNumber] = useState("");
  const [makeFinalLoding, setMakeFinalLoding] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [lgShow, setLgShow] = useState(false); // State for reservation request modal
  const [selectedHotel, setSelectedHotel] = useState(null); // State to store selected hotel data
  // const [selectedDate, setSelectedDate] = useState(new Date());
  const query = useQueryData();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // console.log(qoutationSeriesListQueryJson, "manish");

  // State for modal visibility
  const [modalSeriesDetail, setModalSeriesDetail] = useState(false);
  // State for selected start date
  const [selectedDate, setSelectedDate] = useState(null);
  // State for rows in the table
  const [rows, setRows] = useState([]);
  // State for editing row
  const [editingRow, setEditingRow] = useState(null);
  // State for interval and number of arrivals
  const [interval, setInterval] = useState("");
  const [noOfArrival, setNoOfArrival] = useState("");
  // State for series name
  const [seriesName, setSeriesName] = useState("");
  // State for selected quotation (for QuotationNo)
  // const [selectedQuotation, setSelectedQuotation] = useState(null);
  // const [modalCentered, setModalCentered] = useState(false);
  // const [qoutationList, setQoutationList] = useState([]);
  const queryQuotation = JSON.parse(localStorage.getItem("Query_Qoutation"));

  // Function to handle adding rows based on Start Date, Interval, and No of Arrival

  const handleAddRows = () => {
    if (!selectedDate || !interval || !noOfArrival) {
      notifyError("Please fill in Start Date, Interval, and No of Arrival");
      return;
    }

    const numArrivals = parseInt(noOfArrival);
    const intervalDays = parseInt(interval);

    if (
      isNaN(numArrivals) ||
      isNaN(intervalDays) ||
      numArrivals <= 0 ||
      intervalDays < 0
    ) {
      notifyError("Please enter valid Interval and No of Arrival");
      return;
    }

    // Generate new rows
    const newRows = [];
    for (let i = 0; i < numArrivals; i++) {
      const newDate = addDays(selectedDate, i * intervalDays);
      newRows.push({
        id: rows.length + i + 1, // Ensure unique IDs
        date: newDate,
        isConfirmed: true, // Default checked
        isGroupBooked: true, // Default checked
      });
    }

    // Update rows state by appending new rows
    setRows([...rows, ...newRows]);

    // Clear inputs after adding
    // setSelectedDate(null);
    // setInterval('');
    // setNoOfArrival('');
  };

  // Function to toggle checkbox values
  const toggleCheckbox = (id, field) => {
    setRows(
      rows.map((row) =>
        row.id === id ? { ...row, [field]: !row[field] } : row
      )
    );
  };

  // Function to update date for a specific row
  const updateDate = (id, date) => {
    setRows(rows.map((row) => (row.id === id ? { ...row, date } : row)));
    setEditingRow(null); // Exit editing mode after updating
  };

  // Function to delete a row
  const deleteRow = (id) => {
    if (rows.length <= 1) {
      notifyError("At least one row must remain in the table");
      return;
    }
    const updatedRows = rows
      .filter((row) => row.id !== id)
      .map((row, index) => ({
        ...row,
        id: index + 1, // Reindex IDs starting from 1
      }));
    setRows(updatedRows);
  };

  // Function to add a single row (for the plus icon)
  const addRow = () => {
    setRows([
      ...rows,
      {
        id: rows.length + 1,
        date: null,
        isConfirmed: true, // Default checked
        isGroupBooked: true, // Default checked
      },
    ]);
  };

  // console.log(selectedQuotation, "setSelectedQuotation");
  // Function to handle series detail modal
  const handleSeriesDetail = (quotation) => {
    setSelectedQuotation(quotation);
    setModalSeriesDetail(true);
  };

  // Function to handle API submission for register-series
  const handleSubmitSeries = async () => {
    if (!seriesName) {
      notifyError("Please enter a Series Name");
      return;
    }
    if (rows.length === 0) {
      notifyError("Please add at least one series detail");
      return;
    }

    // Construct payload for register-series API
    const payload = {
      SeriesName: seriesName, // Use input value
      QueryId: state?.QueryData?.QueryID ?? queryData?.QueryAlphaNumId,
      QuotationNo: selectedQuotation?.QuotationNumber ?? "LKE4QV69-A Final", // Fallback to example value
      SeriesDetails: rows
        .filter((row) => row.date) // Only include rows with valid dates
        .map((row) => ({
          ArriavlDate: row.date
            ? row.date.toLocaleDateString("en-GB").replace(/\//g, "-") // Convert to DD-MM-YYYY
            : "",
          isConfirm: row.isConfirmed ? "Yes" : "No",
          isGroupBooked: row.isGroupBooked ? "Yes" : "No",
        })),
    };

    // Validate that all rows have valid dates
    if (payload.SeriesDetails.some((detail) => !detail.ArriavlDate)) {
      notifyError("All series details must have a valid arrival date");
      return;
    }

    try {
      const { data } = await axiosOther.post("register-series", payload);
      if (data?.success || data?.Status === 1) {
        notifySuccess(data?.Message || "Series registered successfully");
        setModalSeriesDetail(false); // Close modal on success
        setRows([]); // Clear rows
        setSeriesName(""); // Clear series name
        setSelectedDate(null); // Clear date
        setInterval(""); // Clear interval
        setNoOfArrival(""); // Clear number of arrivals
        localStorage.setItem(
          "Query_Type_Status",
          JSON.stringify({
            QueryType: 3,
            QueryStatus: 5,
          })
        );
      } else {
        notifyError(data?.Message || "Failed to register series");
      }
    } catch (error) {
      notifyError(
        error?.response?.data?.message ||
          "An error occurred while registering the series"
      );
    }
  };

  //

  const [isOpen, setIsOpen] = useState({
    check: false,
    ind: "",
  });
  // console.log(state, "state11")

  const { qoutationData, dayServicesCondition } = useSelector(
    (data) => data?.queryReducer
  );

  function hasFinalQuotation(quotations) {
    return quotations.some((item) => item.QuotationNumber.includes("Final"));
  }

  const getQoutationList = async () => {
    try {
      const { data } = await axiosOther.post("listqueryquotation", {
        QueryId: state?.QueryData?.QueryID ?? queryData?.QueryAlphaNumId,
        QuotationNo: "",
      });

      if (data?.success) {
        setQoutationList(data?.data);
        const filteredData = data?.data.filter((item) =>
          item.QuotationNumber.includes("Final")
        );
        setQoutationListFinal(filteredData);
        // console.log(filteredData, "FHRHD988");
        const response = hasFinalQuotation(data?.data);
        dispatch(setFinalQueryAction(response));
        dispatch(setFinalQueryDataAction(filteredData));
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const queryfinalmailtemplate = async () => {
    try {
      const { data } = await axiosOther.post("queryfinalmailtemplate", {
        QueryId: state?.QueryData?.QueryID ?? queryData?.QueryAlphaNumId,
        emailkey: "FinalQuery",
      });

      if (data?.Status == 1) {
        setFinalmailtemplate(data?.Data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  // useEffect(() => {
  //   queryfinalmailtemplate()
  // }, [])

  const getSeriesList = async () => {
    try {
      const { data } = await axiosOther.post("list-register-series", {
        QueryId: "",
        QuotationNo: "",
        // QueryTypeId: "3",
        QueryTypeId: "",
        FkQueryId: state?.QueryData?.QueryID ?? queryData?.QueryAlphaNumId,
      });

      if (data?.Status) {
        setQoutationSeriesList(data?.Data);
        setQoutationSeriesListQueryJson(data?.QueryJson);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getSeriesList();
  }, [
    state?.QueryData?.QueryID ?? queryData?.QueryAlphaNumId,
    modalSeriesDetail,
  ]);

  const getQueryList = async (quotation) => {
    console.log(queryData?.QueryAlphaNumId, "WSTSDSTS3636");
    try {
      const { data } = await axiosOther.post("querymasterlist", {
        QueryId: queryData?.QueryAlphaNumId,
      });

      setQueryMasterList(data?.DataList?.[0]);
      localStorage.setItem("query-data", JSON.stringify(data?.DataList?.[0]));
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
    // console.log(quotatationData, "quotatationData")
    dispatch(
      setQuotationDataOperation({
        ...quotatationData,
        QueryId: state?.QueryData?.QueryID ?? queryData?.QueryAlphaNumId,
        id: queryMasterList?.id,
      })
    );
    // store to localStorage to save data
    localStorage.setItem(
      "Query_Qoutation",
      JSON.stringify({
        TourId: quotatationData?.TourId,
        QoutationNum: quotatationData?.QuotationNumber,
        QueryID: queryData?.QueryAlphaNumId,
        QueryNumId: queryData?.QueryId,
        Subject: quotatationData?.Header?.Subject,
        ReferenceId: quotatationData?.ReferenceId,
        ClientName: queryData?.QueryAllData?.ClientName,
      })
    );

    navigate("/query/supplier-communication", { state: true });
  };

  const handleSeriesOperation = (quotatationData, index) => {
    // console.log(queryMasterList, "quotatationData");
    // array se QueryID lo using index
    const selectedQueryID = qoutationSeriesListQueryJson[index]?.QueryID;
    // console.log(selectedQueryID, "selected QueryID");

    navigate("/query/supplier-communication", { state: quotatationData });
    localStorage.setItem(
      "Query_Qoutation",
      JSON.stringify({
        TourId: quotatationData?.TourId,
        QoutationNum: quotatationData?.QuotationNumber,
        QueryID: selectedQueryID,
        Subject: quotatationData?.Header?.Subject,
        ReferenceId: quotatationData?.ReferenceId,
      })
    );
    localStorage.setItem(
      "Series_Query_Qoutation",
      JSON.stringify({
        QueryType: queryMasterList?.QueryType[0]?.QueryTypeId,
        QueryId: queryMasterList?.QueryID,
        QuotationNumber: qoutationListFinal[0]?.QuotationNumber,
        CompanyId: qoutationListFinal[0]?.CompanyId,
        TourId: qoutationListFinal[0]?.TourId,
        ReferenceId: qoutationListFinal[0]?.ReferenceId,
      })
    );
  };

  const handleDuplicate = async (QuotationNo, status) => {
    // console.log(status, "status");

    const confirmation = await swal({
      title: "Are you sure to save as New?",
      icon: "warning",
      buttons: {
        cancel: {
          text: "Cancel",
          value: false,
          visible: true,
          className: "btn-custom-size btn btn-danger light", // Add your custom class
          closeModal: true,
        },
        confirm: {
          text: "Ok",
          value: true,
          visible: true,
          className: "btn-custom-size btn btn-primary", // Add your custom class
          closeModal: true,
        },
      },
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

  //   const handleSend = (data) => {
  //     dispatch(setCommunicationData(data));
  //     navigate("", {
  //       state: {
  //         ...data,
  //         QueryId: state?.QueryData?.QueryID ?? queryData?.QueryAlphaNumId,
  //       },
  //     });
  //   };
  const handleSend = (hotel) => {
    setSelectedHotel(hotel); // Store the selected hotel data
    setLgShow(true); // Open the reservation request modal
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

  //  const handleHotelAvailability = async (quotatationNo) => {
  //   try {
  //     const { data } = await axiosOther.post(
  //       "listofavailablehotelbyqutationno",
  //       {
  //         QueryId: state?.QueryData?.id ?? queryData?.QueryAlphaNumId,
  //         QutationNo: quotatationNo,
  //         Type: "Hotel",
  //       }
  //     );
  //     if (data?.success || data?.status == 1 || data?.Message) {
  //       setHotelAvailableList(data?.Data);
  //       setModalHotelList(true);
  //     } else {
  //       notifyError(data?.Message);
  //     }
  //   } catch (error) {
  //     console.log("error", error);
  //   }
  // };

  //   //  ===============================================================================================
  const handleHotelAvailability = async (quotatationNo) => {
    // Always set numeric QueryId
    const queryQuotation = JSON.parse(localStorage.getItem("Query_Qoutation"));
    const queryIdToSave =
      state?.QueryData?.id ?? queryMasterList?.id ?? queryQuotation?.QueryID;

    localStorage.setItem(
      "HotelAvailability",
      JSON.stringify({
        QueryId: queryIdToSave,
        QuotationNo: quotatationNo,
      })
    );

    const hotelAvailabilityObj = JSON.parse(
      localStorage.getItem("HotelAvailability")
    );

    try {
      const { data } = await axiosOther.post(
        "listofavailablehotelbyqutationno",
        {
          QueryId: hotelAvailabilityObj?.QueryId,
          QutationNo: hotelAvailabilityObj?.QuotationNo,
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
  //   // =========================================================================================
  const handleMakeFinal = (quotation) => {
    console.log(quotation, "icon");
    setSelectedQuotation(quotation);
    getHotelList(quotation);
    setModalCentered(true);
  };

  // const handleSeriesDetail = () => {
  //   setModalSeriesDetail(true);
  // };

  //   // console.log(state?.QueryData?.id, "STATE766");

  const handleSubmit = async () => {
    // console.log(selectedQuotation, "iconM");
    try {
      setMakeFinalLoding(true);
      try {
        const { data } = await axiosOther.post("quotation-final-submit", {
          id: state?.QueryData?.id ?? queryData?.QueryId,
          QuotationNumber: selectedQuotation?.QuotationNumber,
        });
        if (data?.success || data?.status == 1 || data?.Message) {
          getQoutationList();
          notifySuccess(data?.Message);
          setModalCentered(false);
          if (parsedDataQuery_Type_Status?.QueryType === 3) {
            parsedDataQuery_Type_Status.QueryStatus = 5;
            localStorage.setItem(
              "Query_Type_Status",
              JSON.stringify(parsedDataQuery_Type_Status)
            );
          }
        } else {
          notifyError(data?.Message);
        }
      } catch (error) {
        console.log("error", error);
      }
    } finally {
      setMakeFinalLoding(false);
    }
  };

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

  useEffect(() => {
    getqueryData();
  }, []);

  const redirectToItinerary = (data) => {
    localStorage.removeItem("quotationList");
    dispatch(setQoutationSubject(data?.Header?.Subject));
    localStorage.setItem(
      "Query_Qoutation",
      JSON.stringify({
        QoutationNum: data?.QuotationNumber,
        QueryID: queryData?.QueryAlphaNumId,
      })
    );
    if (window.location.origin === "https://beta.creativetravel.in") {
      navigate("/query/quotation-four");
      return;
    }

    navigate("/query/quotation");
    dispatch(setQoutationData(data));
    dispatch(setItineraryEditingTrue());
  };

  const openPopup = async (quotation, uniqueId) => {
    const loader = document.createElement("div");
    Object.assign(loader.style, {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",

      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    });

    loader.innerHTML = `
          <div class="text-center">
            <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        `;

    document.body.appendChild(loader);
    // console.log(quotation?.QuotationNumber,"sldhgfkd")

    try {
      const response = await axiosOther.post("costsheet-template", {
        QueryId: state?.QueryData?.QueryID ?? queryData?.QueryAlphaNumId,
        QuotationNumber: quotation?.QuotationNumber,
        // UniqueId: uniqueId,
        TemplateType: "FIT-Costsheet",
      });

      if (response.status !== 200) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      let templateUrl = response.data?.TemplateUrl;

      if (!templateUrl) {
        document.body.removeChild(loader);
        throw new Error("Template URL not received from API.");
      }

      // Create Popup Div
      const popupDiv = document.createElement("div");
      popupDiv.classList.add("popupWrapperForTheame");

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
        padding: "1rem",
        paddingBottom: 0,
      });

      // Create the iframe
      const iframe = document.createElement("iframe");
      Object.assign(iframe.style, {
        width: "100%",
        height: "93%",
        border: "none",
        backgroundColor: "white",
      });
      iframe.onload = () => {
        document.body.removeChild(loader);
        iframe.style.width = "2000px";
        iframe.contentWindow.document.querySelector("table").style.width =
          "2000px";
      };

      // iframe.onload = () => {
      //   document.body.removeChild(loader);

      //   try {
      //     const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

      //     const mainTable = iframeDoc.querySelector("table");

      //     if (mainTable) {
      //       mainTable.style.width = "2000px";
      //       console.log("Table width set to 2000px");
      //     } else {
      //       console.warn("No table found inside iframe.");
      //     }
      //   } catch (err) {
      //     console.warn("Cannot access iframe content due to cross-origin restriction.");
      //     // Optional: Visual zoom fallback
      //     // iframe.style.zoom = "1.3"; // Visual only, won't affect export
      //     iframe.style.width = "2000px"
      //     iframe.contentWindow.document.querySelector("table").style.width = "2000px";
      //   }
      // };

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
        marginRight: "2rem",
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
        marginRight: "1rem",
        // marginLeft:"auto",

        // marginLeft: "auto",
        // position: "absolute",
        // top: "93%",
        // left: "92%",
      });

      // Export Button
      const exportButton = document.createElement("button");
      exportButton.innerText = "Export Excel";
      Object.assign(exportButton.style, {
        padding: "0.3125rem 1.25rem",
        fontSize: "1rem",
        color: "white",
        backgroundColor: "#28a745",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginLeft: "auto",
        marginRight: "1rem",
        // position: "absolute",
        // top: "93%",
        // left: "85%",
      });

      const exportButtonPdf = document.createElement("button");
      exportButtonPdf.innerText = "Export Pdf";
      Object.assign(exportButtonPdf.style, {
        padding: "0.3125rem 1.25rem",
        fontSize: "1rem",
        color: "white",
        backgroundColor: "#007bff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginRight: "1rem",
        // position: "absolute",
        // top: "93%",
        // left: "85%",
      });

      const exportButtonWord = document.createElement("button");
      exportButtonWord.innerText = "Export Word";
      Object.assign(exportButtonWord.style, {
        padding: "0.3125rem 1.25rem",
        fontSize: "1rem",
        color: "white",
        backgroundColor: "#28a745",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginRight: "1rem",
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

      exportButton.onclick = () => exportTemplateExcel(templateUrl);
      exportButtonWord.onclick = () => exportTemplateWord(templateUrl);
      // exportButton2.onclick = () => exportTemplate(templateUrl);
      exportButtonPdf.onclick = () => exportTemplatePdf(templateUrl);

      // Append Elements
      // popupDiv.appendChild(exportButton2); hide cause dual export btn
      // popupDiv.appendChild(closeButton); hide cause dual close btn
      popupDiv.appendChild(iframe);
      popupDiv.appendChild(exportButton);
      popupDiv.appendChild(exportButtonPdf);
      // popupDiv.appendChild(exportButtonWord);
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
      document.body.removeChild(loader);
      console.error("Error:", error.response?.data || error.message);
      alert("Failed to generate the template. Please try again later.");
    }
    //   const exportTemplate = async (templateUrl) => {
    //     try {
    //       // Send the HTML content to the API
    //       const response = await axiosOther.post(
    //         "export-html-to-excel",
    //         { htmlContent: templateUrl },
    //         { responseType: "blob" } // Ensure response is treated as a binary file
    //       );

    //       // Create a download link for the exported Excel file
    //       const blob = new Blob([response.data], {
    //         type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    //       });
    //       const link = document.createElement("a");
    //       link.href = URL.createObjectURL(blob);
    //       link.download = "exported_data.xlsx"; // Set the filename
    //       document.body.appendChild(link);
    //       link.click();
    //       document.body.removeChild(link);
    //     } catch (error) {
    //       console.error("Error exporting HTML to Excel:", error);
    //       alert("Export failed. Please try again.");
    //     }
    //   };
    // };

    const exportTemplatePdf = async (templateUrl) => {
      try {
        const response = await axiosOther.post("createViewPdf", {
          url: templateUrl,
        });

        if (response.status !== 200) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const { status, pdf_url } = response.data;

        if (status && pdf_url) {
          // Open the PDF in a new tab
          window.open(pdf_url, "_blank");
        } else {
          alert("PDF generation failed. Please try again.");
        }
      } catch (error) {
        console.error("Error exporting HTML to PDF:", error);
        alert("Export failed. Please try again.");
      }
    };
    const exportTemplateExcel = async (templateUrl) => {
      try {
        const response = await axiosOther.post("createViewExcel", {
          url: templateUrl,
        });

        if (response.status !== 200) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const { status, download_url, message } = response.data;

        // Make sure status is explicitly 1
        if (status === 1 && download_url) {
          const link = document.createElement("a");
          link.href = download_url;

          // Set a default filename using current timestamp if needed
          const fileName = `costsheet_${Date.now()}.xls`;
          link.setAttribute("download", fileName);

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          alert(message || "Excel generation failed. Please try again.");
        }
      } catch (error) {
        console.error("Error exporting HTML to Excel:", error);
        alert("Export failed. Please try again.");
      }
    };

    const exportTemplateWord = async (templateUrl) => {
      try {
        const response = await axiosOther.post("createViewWord", {
          url: templateUrl,
        });

        if (response.status !== 200) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const { status, download_url } = response.data;

        if (status && download_url) {
          // Trigger download automatically
          const link = document.createElement("a");
          link.href = download_url;
          link.download = ""; // Optional: "filename.doc" if you want to set filename
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          alert("Word generation failed. Please try again.");
        }
      } catch (error) {
        console.error("Error exporting HTML to Word:", error);
        alert("Export failed. Please try again.");
      }
    };
  };

  const openPurposal = async (quotation, QuotationList) => {
    try {
      const response = await axiosOther.post("proposal-template", {
        QueryId: state?.QueryData?.QueryID,
        QuotationNumber:
          qoutationList.length > 0 ? qoutationList[0]?.QuotationNumber : "",
      });

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

  const openwordfile = async () => {
    try {
      localStorage.setItem("qoutationList", JSON.stringify(qoutationList));
      localStorage.setItem("query", JSON.stringify(query));
      // const url = `${import.meta.env.VITE_BASE_URL
      //   }/Proposals?${encodeURIComponent(query?.QueryAlphaNumId)}`;
      const url = `Proposals?${encodeURIComponent(query?.QueryAlphaNumId)}`;
      window.open(
        url,
        "_blank",
        "noopener,noreferrer",
        "PopupWindow",
        "width=100%,height=100%,top=100,left=100"
      );
    } catch (err) {
      console.error("Error generating Word file:", err);
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
  const condition = itemVal?.some((item) => item?.length > 0);
  // console.log(condition, "condition");

  useEffect(() => {
    dispatch({ type: "DAY-SERVICES-CONDITION", payload: condition });
  }, [condition]);

  const handlePaymentRequest = () => {
    navigate("/query/payments", { state: { name: "John", age: 30 } });
  };

  // hanlder
  const handleVoucherGenerate = (quotatationData) => {
    localStorage.setItem(
      "Query_Qoutation",
      JSON.stringify({
        TourId: quotatationData?.TourId,
        QoutationNum: quotatationData?.QuotationNumber,
        QueryID: queryData?.QueryAlphaNumId,
        Subject: quotatationData?.Header?.Subject,
        ReferenceId: quotatationData?.ReferenceId,
      })
    );
    navigate("/query/vouchers");
  };

  const htmlRef = useRef(null);
  // const handleCopy = () => {
  //   const range = document.createRange();
  //   range.selectNode(htmlRef.current);

  //   const selection = window.getSelection();
  //   selection.removeAllRanges();
  //   selection.addRange(range);

  //   try {
  //     document.execCommand("copy");
  //     alert("Copied to clipboard!");
  //   } catch (err) {
  //     alert("Failed to copy.");
  //   }

  //   selection.removeAllRanges();
  // };
  const handleCopy = () => {
    if (htmlRef.current) {
      const htmlContent = htmlRef.current.innerHTML; // Styled HTML
      const textContent = htmlRef.current.innerText; // Plain text

      navigator.clipboard
        .write([
          new ClipboardItem({
            "text/html": new Blob([htmlContent], { type: "text/html" }),
            "text/plain": new Blob([textContent], { type: "text/plain" }),
          }),
        ])
        .then(() => {
          alert("Copied to clipboard!");
        })
        .catch(() => {
          alert("Failed to copy.");
        });
    }
  };

  const htmlRefMakeFinal = useRef(null);
  // const handleCopyMakeFinal = () => {
  //   const range = document.createRange();
  //   range.selectNode(htmlRefMakeFinal.current);

  //   const selection = window.getSelection();
  //   selection.removeAllRanges();
  //   selection.addRange(range);

  //   try {
  //     document.execCommand("copy");
  //     alert("Copied to clipboard!");
  //   } catch (err) {
  //     alert("Failed to copy.");
  //   }

  //   selection.removeAllRanges();
  // };

  const handleCopyMakeFinal = () => {
    if (htmlRefMakeFinal.current) {
      const htmlContent = htmlRefMakeFinal.current.innerHTML; // Styled HTML
      const textContent = htmlRefMakeFinal.current.innerText; // Plain text

      navigator.clipboard
        .write([
          new ClipboardItem({
            "text/html": new Blob([htmlContent], { type: "text/html" }),
            "text/plain": new Blob([textContent], { type: "text/plain" }),
          }),
        ])
        .then(() => {
          alert("Copied with styles!");
        })
        .catch(() => {
          alert("Failed to copy.");
        });
    }
  };

  const initialFormValue = {
    PaxDetails: {
      Total: 0,
      TWN: 0,
      DBL: 0,
      TPL: 0,
      SGL: 0,
    },
    // RoomAllocation: {
    //   TWN: 0,
    //   SGL: 0,
    //   Escort: "",
    // },
    FOCDetails: {
      FOC: 0,
      DBL: 0,
      SGL: 0,
    },
    ExecutiveISO: "",
    HandledBy: "",
    RegistrationDate: new Date()
      .toLocaleDateString("en-GB")
      .split("/")
      .join("-"),
    IsSeriesByRegularDeparture: false,
  };

  const [formValue, setFormValue] = useState(initialFormValue);
  const [isomasterlist, setIsomasterlist] = useState([]);
  // const { queryData, qoutationData } = useSelector((state) => state?.queryReducer);

  const fetchIsoMasterList = async () => {
    try {
      const { data } = await axiosOther.post("isomasterlist", {
        Search: "",
        Status: 1,
      });
      setIsomasterlist(data?.DataList || []);
    } catch (err) {
      console.error("Error fetching ISO master list:", err);
    }
  };

  useEffect(() => {
    fetchIsoMasterList();
  }, []);

  useEffect(() => {
    if (!qoutationSeriesList) return;

    const token = localStorage.getItem("token");
    const parsed = JSON.parse(token);
    const userId = parsed?.UserName;

    setFormValue((prev) => ({
      ...prev,
      PaxDetails: {
        Total: qoutationSeriesList[0]?.TourSummary?.PaxCount || "",
        TWN:
          qoutationSeriesList[0]?.QueryInfo?.Accomondation?.RoomInfo[2]
            ?.NoOfPax || "",
        DBL:
          qoutationSeriesList[0]?.QueryInfo?.Accomondation?.RoomInfo[1]
            ?.NoOfPax || "",
        TPL:
          qoutationSeriesList[0]?.QueryInfo?.Accomondation?.RoomInfo[3]
            ?.NoOfPax || "",
        SGL:
          qoutationSeriesList[0]?.QueryInfo?.Accomondation?.RoomInfo[0]
            ?.NoOfPax || "",
      },
      // RoomAllocation: {
      //   TWN: "",
      //   SGL: "",
      //   Escort: "",
      // },
      FOCDetails: {
        FOC: "",
        DBL: "",
        SGL: "",
      },
      ExecutiveISO: qoutationSeriesList[0]?.ISOId?.toString() || "",
      HandledBy: userId || "",
      RegistrationDate: new Date()
        .toLocaleDateString("en-GB")
        .split("/")
        .join("-"),
      IsSeriesByRegularDeparture: false,
    }));
  }, [qoutationSeriesList]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const stringFields = ["ExecutiveISO", "HandledBy"];
    const parsedValue =
      type === "checkbox"
        ? checked
        : stringFields.includes(name)
        ? value
        : parseInt(value) || 0;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormValue((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: parsedValue,
        },
      }));
    } else {
      setFormValue((prev) => ({
        ...prev,
        [name]: parsedValue,
      }));
    }
  };

  const handleDateChange = (date) => {
    const formattedDate = date
      ? date.toLocaleDateString("en-GB").split("/").join("-")
      : "";
    setFormValue((prev) => ({
      ...prev,
      RegistrationDate: formattedDate,
    }));
  };

  const getRegistrationDate = () => {
    if (!formValue?.RegistrationDate) return null;
    const [day, month, year] = formValue.RegistrationDate.split("-");
    const date = new Date(year, month - 1, day);
    return isNaN(date) ? null : date;
  };

  const handleSubmitSeriesPaxUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axiosOther.post("update-series-tour-details", {
        ...formValue,
        QueryId: state?.queryId || queryData?.QueryAlphaNumId,
      });
      if (data?.Status == 1) {
        // notifySuccess(data?.Message);
        notifySuccess("Pax Detail Updated in All the Series Tours");
      } else {
        // notifyError(data?.Message || "Failed to Update Pax Detail");
        notifyError("Failed to Update Pax Detail");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      notifyError("An error occurred while submitting the form");
    }
  };

  const handleDateFormatChange = (date) => {
    let formattedDate;
    if (date) {
      formattedDate = format(date, "dd-MM-yyyy");
      // console.log(formattedDate);
    }
    return formattedDate;
  };

  // console.log(qoutation,"qoutation");

  return (
    <div className="mt-3 p-0 ms-1 m-0">
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
                                      Star | {hotel?.HotelDetails?.HotelAddress}
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
                                        Room Category
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
                                    {/* {hotelList &&
      hotelList?.length > 0 &&
      hotelList.map((item, index) => {
        return ( */}
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
                                        {
                                          hotel?.ItenaryDetails
                                            ?.RoomCategoryName
                                        }
                                      </td>

                                      {/* <td className="text-center text-nowrap  py-2 ">
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
                                      </td> */}

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
              {/* <Button
                    variant="primary"
                    onClick={handleSubmit}
                    className="btn-custom-size"
                  >
                    Save changes
                  </Button> */}
            </Modal.Footer>
          </Modal>

          {/* <div className="row quotationquery">
              <div className="col-12 col-md-2 col-lg-2 p-0 d-flex align-items-center gap-2 d-md-block">
                <p className="m-0 querydetails text-grey">Query Date:</p>
                <p className="m-0 querydetailspara text-grey">
                  {formatDate(queryMasterList?.QueryDate?.Date)} |
                  {moment(queryMasterList?.QueryDate?.Time, "HH:mm:ss").format(
                    "h:mm a"
                  )}
                </p>
              </div>
              <div className="col-12 col-md-1 p-0 d-flex align-items-center gap-2 d-md-block">
                <p className="m-0 querydetails text-grey">Status:</p>
                <p
                  className="m-0  font-weight-bold  badge py-1 px-2 text-grey"
                  style={{ backgroundColor: QueryStatus?.color }}
                >
                  {queryMasterList?.QueryStatus?.Name}
                </p>
              </div>
              <div className="col-12 col-md-2 col-lg-2 p-0 d-flex align-items-center gap-2 d-md-block">
                <p className="m-0 querydetails text-grey  ps-md-4">End Date:</p>
                <p className="m-0 querydetailspara text-grey ps-md-4">
                  {formatDate(TourSummary?.ToDate)} | 12:46
                </p>
              </div>
              <div className="col-12 col-md-3 col-lg-3 p-0 d-flex gap-3 align-items-center">
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
              <div className="col-12 col-md-4  col-lg-4 d-flex justify-content-center align-items-center ps-1 gap-2">
                <div>
                  <button
                    className="btn btn-dark btn-custom-size"
                    onClick={() => navigate("/queries")}
                  >
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

              </div>
            </div> */}
          {/* To be Add this Model Popup */}
          <Modal
            size="lg"
            show={lgShow}
            onHide={() => setLgShow(false)}
            aria-labelledby="example-modal-sizes-title-lg"
          >
            <Modal.Header closeButton>
              <Modal.Title id="example-modal-sizes-title-lg">
                Send Hotel Availabilty
              </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ padding: "10px", paddingTop: "0px" }}>
              <div
                ref={htmlRef}
                // style={{ backgroundColor: "#fff" }}
                style={{
                  color: background?.value === "dark" ? "#fff" : "#000",
                }}
                dangerouslySetInnerHTML={{
                  __html: `<!DOCTYPE html><html lang=\"en\">  <head>    <meta charset=\"UTF-8\" />    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />    <title>Guide</title>  </head>  <body    style=\"      font-family: Arial, sans-serif;      margin: 0;      padding: 0;      max-width: 800px;      margin: 0 auto;      font-size: 10px;    \"  >    <div style=\"margin-top: 10px; padding: 10px\">      <p>Dear Sir / Ma'am,</p>      <p>        Greeting from        <span style=\"color: red\">Indo Asia Tours.</span>      </p>      <p>        We are pleased to send our Hotel Availability for        <span>reservation</span>        request for the        <span>subjected</span>        booking below      </p>      <p>Please confirm the availability and send us a written confirmation.</p>      <p>        You can print this        <span style=\"text-decoration: underline; color: red\">mail</span> or        choose to download it for your reference.      </p>      <p>        Please acknowledge this mail and kindly press REPLY ALL when doing the        same.      </p>    </div>    <!-- Main Container -->    <div style=\"border: 1px dashed #999; padding: 10px; margin: 10px\">      <!-- Header Section -->      <div        style=\"          border-bottom: 1px dashed #999;          padding-bottom: 10px;          display: flex;          align-items: center;        \"      >       <div style=\"width: 20%; padding-right: 10px\">          <div style=\"display: flex; align-items: center; justify-content: center; height: 50px;\">            <img src=\"http://api.nexgenov8.com/storage/company_logo_1745409340_DeboxLogo.jpeg\" alt=\"Company Logo\" style=\"max-width: 100%; max-height: 50px;\" />          </div>          <div style=\"font-size: 8px; margin-top: 2px; color: #666; text-align: center;\">            <!-- Optional subtitle or remove if not needed -->          </div>        </div>        <div style=\"width: 10%; text-align: center\">          <div            style=\"border-left: 1px solid #ccc; height: 50px; margin-left: 10px\"          ></div>        </div>        <div style=\"width: 70%\">          <div style=\"font-weight: bold; color: #555; font-size: 12px\">            Indo Asia Tours          </div>          <div style=\"font-size: 9px; color: #666; margin-top: 5px\">            Sector-62, Noida, UP<br />            7260952977 | deboxglobal@gmail.com |           </div>        </div>      </div>      <!-- Title Section -->          <!-- Letter Section -->      <div style=\"margin-top: 20px\">        <p><b>Favouring [06-05-2025] Rishi,</b></p>        <p><b>Lead Pax / Client Name: Rishi</b></p>        <p>Please provide all services as per below details.</p>      </div>         <!-- Closing Section -->      <div style=\"margin-top: 20px; padding: 10px; border-top: 1px dashed #999\">        <div style=\"margin-top: 3rem\">          <p style=\"text-align: right\">            <b>Rishi Raj Anand</b>          </p>          <p style=\"text-align: right\">AUTHORISED SIGNATORY</p>        </div>      </div>      <!-- Disclaimer Section -->      <div        style=\"          margin-top: 20px;          font-size: 9px;          color: #666;          border-top: 1px dashed #999;          padding-top: 10px;        \"      >        <p>          AUTHORISED SIGNATORY Bill Us For The Above Services & Collect All          Extras Directly.        </p>        <p>ISSUED SUBJECT TO TERMS AND CONDITIONS OVERLEAF</p>      </div>    </div>  </body></html>`,
                }}
              />
              <hr />
              <div className="d-flex justify-content-end gap-3">
                {/* Copy Button */}
                <button
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={handleCopy}
                >
                  <img
                    width={30}
                    src="https://static.vecteezy.com/system/resources/previews/000/423/339/non_2x/copy-icon-vector-illustration.jpg"
                    alt="Copy"
                    title="Copy"
                  />
                </button>

                {/* Outlook Email Button */}

                <button
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    const subject = encodeURIComponent(
                      state?.QueryData?.ContactInfo?.ContactPersonName
                    );
                    const body = encodeURIComponent(
                      htmlRef.current?.innerText || ""
                    );

                    // Open Outlook with subject and body pre-filled
                    const mailtoLink = `mailto:${state?.QueryData?.ContactInfo?.ContactEmail}?subject=${subject}&body=${body}`;
                    window.location.href = mailtoLink;
                  }}
                >
                  <img
                    width={30}
                    src={OutlookLogo}
                    alt="OutlookLogo"
                    title="Send via Outlook"
                  />
                </button>
              </div>
            </Modal.Body>
            {/* <Modal.Footer>
              <Button
                onClick={() => setLgShow(false)}
                variant="danger light"
                className="btn-custom-size"
              >
                Close
              </Button>
            </Modal.Footer> */}
          </Modal>

          <QueryDetailedCard />
        </div>
      </div>

      <div className="row quotation-table mt-3">
        <div
          className="col-md-12  col-lg-9 overflow  tablelist queryListHeight"
          style={{ overflowY: "auto", overflowX: "hidden" }}
        >
          <Table responsive className="quotationlist">
            <thead className="w-100 tableparahead">
              <tr className="w-100 light-gray-text ">
                <th
                  className="p-0 py-2 px-1 border-0 quotationheading"
                  scope="col"
                  style={{ width: "116px" }}
                >
                  {" "}
                  {/* QUOTATION ID */}
                  Quotation Id
                </th>
                {/* <th
                  className="p-0 py-2 px-1 border-0 quotationheading"
                  scope="col"
                  style={{ width: "116px" }}
                >
                  {" "}
                  REFERENCE ID
                </th> */}
                <th
                  className="p-0 py-2 px-1 border-0 quotationheading"
                  scope="col"
                  style={{ width: "116px" }}
                >
                  {" "}
                  Season
                </th>
                <th
                  className="p-0 py-2 px-1 border-0 quotationheading "
                  scope="col"
                  style={{ width: "100px" }}
                >
                  {" "}
                  {/* FROM DATE */}
                  From Date
                </th>
                {/* <th
                  className="p-0 py-2 px-1 border-0 quotationheading"
                  scope="col"
                  style={{ width: "100px" }}
                >
                  {" "}
                  TO DATE
                </th> */}
                <th
                  className="p-0 py-2 px-1 border-0 quotationheading "
                  scope="col"
                  style={{ width: "116px" }}
                >
                  {" "}
                  {/* DURATION */}
                  Duration
                </th>
                <th
                  className="p-0 py-2 px-1 border-0 quotationheading"
                  scope="col"
                  style={{ width: "116px" }}
                >
                  {" "}
                  {/* TOTAL PAX */}
                  Total Pax
                </th>
                <th
                  className="p-0 py-2 px-1 border-0  quotationheading"
                  scope="col"
                >
                  {" "}
                  {/* ACTION */}
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="w-100 tablepara">
              {/* {console.log(qoutationList, "QLT76")} */}
              {qoutationList?.map((qoutation, index) => {
                // console.log(qoutation, "QoutationList");

                const isFinal = qoutation?.QuotationNumber?.endsWith("Final");
                const isSeries =
                  parsedDataQuery_Type_Status?.QueryType === 3 &&
                  parsedDataQuery_Type_Status?.QueryStatus === 5;
                // console.log(isSeries, "isSeries");

                return (
                  <>
                    <tr
                      className={`w-100 my-1 ${
                        isFinal ? "qoutation-final-row" : ""
                      }`}
                      key={index + 1}
                    >
                      <td className=" quotationtext p-0 py-1 px-1 border-0">
                        <span
                          onClick={() => redirectToItinerary(qoutation)}
                          className="text-queryList-primary cursor-pointer"
                        >
                          {qoutation?.QuotationNumber}
                        </span>
                      </td>
                      {/* <td className="quotationtexts p-0 py-2 px-1 border-0  text-light">
                        {qoutation?.ReferenceId}
                      </td> */}
                      <td className="quotationtexts p-0 py-2 px-1 border-0  text-light">
                        {qoutation?.TravelDateInfo?.SeasonType == 18
                          ? "Winter"
                          : qoutation?.TravelDateInfo?.SeasonType == 17
                          ? "Summer"
                          : ""}
                      </td>
                      <td className="quotationtexts p-0 py-2 px-1 border-0  text-light">
                        {handleDateFormatChange(
                          qoutation?.TourSummary?.FromDate
                        )}
                      </td>
                      {/* <td className="quotationtexts p-0 py-2 px-1 border-0 text-light ">
                        {qoutation?.TourSummary?.ToDate}
                      </td> */}
                      <td className="quotationtexts p-0 py-2 px-1 border-0 text-light">
                        {/* {qoutation?.TourSummary?.NumberOfNights}N/
                        {qoutation?.TourSummary?.NumberOfDays}D */}
                        {qoutation?.TravelDateInfo?.TotalNights}N/
                        {qoutation?.TravelDateInfo?.TotalNoOfDays > 0
                          ? qoutation.TravelDateInfo.TotalNoOfDays
                          : 0}
                        D
                      </td>
                      <td className="quotationtexts p-0 py-2 px-1 border-0 text-light ">
                        {qoutation?.TourSummary?.PaxCount} Pax
                      </td>
                      <td className="p-0 py-2 px-1 fs-6 pe-3">
                        <div className="d-flex gap-3 align-items-center">
                          {/* Costsheet Toggle */}
                          {condition && (
                            <div className="icon-container ">
                              <button
                                className="btn btn-primary newBtn costsheet btn-custom-size px-1 quotation-button newQuotationIconButton"
                                onClick={() => openPopup(qoutation)}
                              >
                                {/* Costsheet */}
                                {/* <img
                                  src={activeCostSheet}
                                  alt="icon"
                                  className="icons newQuotationIcon"
                                /> */}
                                <i className="fas fa-dollar-sign fs-4"></i>
                              </button>
                              <p className="tooltip-text py-1 px-1">
                                Costsheet
                              </p>
                            </div>
                          )}

                          {/* Proposal Button */}
                          {condition && (
                            <div className="icon-container ">
                              <button
                                className="btn btn-primary newBtn proposal btn-custom-size px-1 quotation-button newQuotationIconButton"
                                onClick={openwordfile}
                              >
                                {/* Proposal */}
                                <img
                                  src={activeProposal}
                                  alt="icon"
                                  className="icons newQuotationIcon"
                                />
                              </button>
                              <p className="tooltip-text py-1 px-1">Proposal</p>
                            </div>
                          )}

                          {/* Operations Button */}

                          {qoutation?.QuotationNumber?.endsWith("Final") &&
                            qoutation?.QueryStatus?.name == "Confirmed" &&
                            !isSeries && (
                              <div className="icon-container ">
                                <button
                                  className="btn text-white btn-primary btn-custom-size newBtn operation newQuotationIconButton"
                                  // style={{ background: "#e17c00" }}
                                  onClick={() => handleOperation(qoutation)}
                                >
                                  {/* Operations */}
                                  {/* <img
                                  src={activeTour}
                                  alt="icon"
                                  className="icons newQuotationIcon"
                                /> */}
                                  {/* <i className="fas fa-wrench fs-6"></i> */}
                                  <i className="fa-solid fa-screwdriver-wrench fs-4"></i>
                                </button>
                                <p className="tooltip-text py-1 px-1">
                                  Operations
                                </p>
                              </div>
                            )}

                          {/* Vouchers Button */}

                          {qoutation?.QuotationNumber?.endsWith("Final") &&
                            qoutation?.QueryStatus?.name == "Confirmed" &&
                            !isSeries && (
                              <div className="icon-container ">
                                <button
                                  className="btn btn-primary newBtn voucher btn-custom-size px-1 quotation-button newQuotationIconButton"
                                  onClick={() =>
                                    handleVoucherGenerate(qoutation)
                                  }
                                >
                                  {/* Operations */}
                                  <img
                                    src={activeVouchers}
                                    alt="icon"
                                    className="icons newQuotationIcon"
                                  />
                                </button>
                                <p className="tooltip-text py-1 px-1">
                                  Vouchers
                                </p>
                              </div>
                            )}

                          {/* Duplicate Button */}

                          {!isSeries && (
                            <div className="icon-container ">
                              <button
                                className="btn btn-primary btn-custom-size newBtn duplicate newQuotationIconButton"
                                onClick={() =>
                                  handleDuplicate(
                                    qoutation?.QuotationNumber,
                                    qoutation?.QueryStatus?.name
                                  )
                                }
                              >
                                {/* Duplicate */}
                                <img
                                  src={activeDuplicate}
                                  alt="icon"
                                  className="icons newQuotationIcon"
                                  style={{ width: "23px", height: "23px" }}
                                />
                              </button>
                              <p className="tooltip-text py-1 px-1">
                                Duplicate
                              </p>
                            </div>
                          )}

                          {/* Hotel Availability Button */}
                          {!isSeries && (
                            <div className="icon-container ">
                              <button
                                className="btn btn-primary btn-custom-size newBtn hotel-availability newQuotationIconButton"
                                onClick={() =>
                                  handleHotelAvailability(
                                    qoutation?.QuotationNumber
                                  )
                                }
                              >
                                {/* Hotel Availability */}
                                <img
                                  src={activehotelIcon}
                                  alt="icon"
                                  className="icons newQuotationIcon"
                                />
                              </button>
                              <p className="tooltip-text py-1 px-1">
                                Hotel Availability
                              </p>
                            </div>
                          )}

                          {/* Service Request Button (if Confirmed) */}
                          {/* {qoutation?.QueryStatus?.name === "Confirmed" && ( */}
                          {/* {qoutation?.QuotationNumber?.endsWith("Final") &&
                            qoutation?.QueryStatus?.name == "Confirmed" && (!isSeries) && (
                              <div className="icon-container ">
                                <button
                                  className="btn btn-primary btn-custom-size newBtn service-request newQuotationIconButton"
                                >
                                  <img
                                    src={activeSupplier}
                                    alt="icon"
                                    className="icons newQuotationIcon"
                                  />
                                </button>
                                <p className="tooltip-text py-1 px-1">
                                  Service Request
                                </p>
                              </div>
                            )} */}

                          {qoutation?.QuotationNumber?.endsWith("Final") &&
                            qoutation?.QueryStatus?.name == "Confirmed" &&
                            isSeries &&
                            qoutationSeriesListQueryJson.length > 0 && (
                              <div className="icon-container ">
                                <button
                                  // onClick={() => { handleSeriesOperation(service, index) }}
                                  onClick={() => {
                                    handleOperation(qoutation);
                                  }}
                                  className="btn btn-primary btn-custom-size newBtn service-request newQuotationIconButton"
                                >
                                  {/* Service Request */}
                                  <img
                                    src={activeSupplier}
                                    alt="icon"
                                    className="icons newQuotationIcon"
                                  />
                                </button>
                                <p className="tooltip-text py-1 px-1">
                                  Send Request
                                </p>
                              </div>
                            )}

                          {/* Payment Request Button (if Confirmed) */}
                          {/* {qoutation?.QueryStatus?.name === "Confirmed" && ( */}
                          {qoutation?.QuotationNumber?.endsWith("Final") &&
                            qoutation?.QueryStatus?.name == "Confirmed" &&
                            !isSeries && (
                              <div className="icon-container ">
                                <button
                                  onClick={handlePaymentRequest}
                                  className="btn btn-primary btn-custom-size newBtn payment-request newQuotationIconButton"
                                >
                                  {/* Payment Request */}
                                  <img
                                    src={activePayment}
                                    alt="icon"
                                    className="icons newQuotationIcon"
                                  />
                                </button>
                                <p className="tooltip-text py-1 px-1">
                                  Payment Request
                                </p>
                              </div>
                            )}

                          {/* Tour Details */}
                          {qoutation?.QuotationNumber?.endsWith("Final") &&
                            qoutation?.QueryStatus?.name == "Confirmed" &&
                            !isSeries && (
                              <div className="icon-container ">
                                <button
                                  className="btn btn-primary btn-custom-size newBtn tour-details newQuotationIconButton"
                                  // onClick={() =>
                                  //   navigate(
                                  //     "/query/quotation-list/tour-details",
                                  //     {
                                  //       state: {
                                  //         quotationNumber:
                                  //           qoutation?.QuotationNumber,
                                  //         queryId: queryData?.QueryAlphaNumId,
                                  //       },
                                  //     }
                                  //   )
                                  // }
                                  onClick={() => {
                                    // LocalStorage set karo
                                    localStorage.setItem(
                                      "Query_Qoutation",
                                      JSON.stringify({
                                        TourId: qoutation?.TourId,
                                        QoutationNum:
                                          qoutation?.QuotationNumber,
                                        QueryID: queryData?.QueryAlphaNumId,
                                        Subject: qoutation?.Header?.Subject,
                                        ReferenceId: qoutation?.ReferenceId,
                                      })
                                    );

                                    // Navigate bhi karo
                                    navigate(
                                      "/query/quotation-list/tour-details",
                                      {
                                        state: {
                                          quotationNumber:
                                            qoutation?.QuotationNumber,
                                          queryId: queryData?.QueryAlphaNumId,
                                        },
                                      }
                                    );
                                  }}
                                >
                                  {/* Make Final */}
                                  {/* <img
                                src={activeAssignie}
                                alt="icon"
                                className="icons newQuotationIcon"
                              /> */}
                                  <i className="fa-solid fa-location-dot fs-4"></i>
                                </button>
                                <p className="tooltip-text py-1 px-1">
                                  Tour Details
                                </p>
                              </div>
                            )}

                          {/* Series Detail */}
                          {qoutation?.QuotationNumber?.endsWith("Final") &&
                            qoutation?.QueryStatus?.name == "Confirmed" &&
                            isSeries && (
                              <div className="icon-container ">
                                <button
                                  className="btn btn-primary btn-custom-size newBtn series-detail newQuotationIconButton"
                                  onClick={() => handleSeriesDetail(qoutation)}
                                >
                                  <i className="fas fa-users fs-4"></i>
                                </button>
                                <p className="tooltip-text py-1 px-1">
                                  Generate Series
                                </p>
                              </div>
                            )}

                          {/* Make Final Button */}
                          {/* {console.log(qoutation, "sddsfsdqoutation")} */}

                          {qoutation?.QueryStatus?.name !== "Confirmed" ? (
                            <div className="icon-container ">
                              <button
                                className="btn btn-primary btn-custom-size newBtn make-final newQuotationIconButton"
                                onClick={() => {
                                  handleMakeFinal(qoutation);
                                  queryfinalmailtemplate();
                                }}
                              >
                                {/* Make Final */}
                                <img
                                  src={activeAssignie}
                                  alt="icon"
                                  className="icons newQuotationIcon"
                                />
                              </button>
                              <p className="tooltip-text py-1 px-1">
                                Make Final
                              </p>
                            </div>
                          ) : (
                            ""
                          )}

                          {/* Success Icon */}
                          {qoutation?.QuotationNumber?.endsWith("Final") &&
                            qoutation?.QueryStatus?.name == "Confirmed" && (
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

                    {/* <Modal className="fade quotationList" show={modalCentered}> */}
                    <Modal className="fade" size="lg" show={modalCentered}>
                      <Modal.Header>
                        <ToastContainer />
                        <Modal.Title>Make Final/ Select Supplement</Modal.Title>
                        <Button
                          onClick={() => setModalCentered(false)}
                          variant=""
                          className="btn-close"
                        ></Button>
                      </Modal.Header>
                      <Modal.Body
                        style={{ padding: "10px", paddingTop: "0px" }}
                      >
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
                                          {item?.DayServices?.[0]?.ServiceType}
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
                            <div>
                              <div
                                ref={htmlRefMakeFinal}
                                contentEditable={true}
                                style={{
                                  color:
                                    background?.value === "dark"
                                      ? "#fff"
                                      : "#000",
                                }}
                                dangerouslySetInnerHTML={{
                                  __html: `<!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8" /> <meta name="viewport" content="width=device-width, initial-scale=1.0" /> <title>Enquiry Confirmation</title> </head> <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; max-width: 800px; margin: 0 auto; font-size: 10px;"> <div style="margin-top: 20px; padding: 10px"> ${finalmailtemplate} ${
                                    queryMasterList?.Description || ""
                                  } </div> </body> </html>`,
                                }}
                              />
                              <hr />
                              <div className="d-flex justify-content-end gap-3">
                                {/* Copy Button */}
                                <button
                                  style={{
                                    background: "transparent",
                                    border: "none",
                                    cursor: "pointer",
                                  }}
                                  onClick={handleCopyMakeFinal}
                                >
                                  <img
                                    width={30}
                                    src="https://static.vecteezy.com/system/resources/previews/000/423/339/non_2x/copy-icon-vector-illustration.jpg"
                                    alt="Copy"
                                    title="Copy"
                                  />
                                </button>

                                {/* Outlook Email Button */}

                                <button
                                  style={{
                                    background: "transparent",
                                    border: "none",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    const subject = encodeURIComponent(
                                      state?.QueryData?.ContactInfo
                                        ?.ContactPersonName
                                    );
                                    const body = encodeURIComponent(
                                      htmlRefMakeFinal.current?.innerText || ""
                                    );

                                    // Open Outlook with subject and body pre-filled
                                    const mailtoLink = `mailto:${state?.QueryData?.ContactInfo?.ContactEmail}?subject=${subject}&body=${body}`;
                                    window.location.href = mailtoLink;
                                  }}
                                >
                                  <img
                                    width={30}
                                    src={OutlookLogo}
                                    alt="OutlookLogo"
                                    title="Send via Outlook"
                                  />
                                </button>
                              </div>
                            </div>
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
                          // onClick={() => handleSubmit(qoutation)}
                          onClick={() => handleSubmit()}
                          className="btn-custom-size"
                          style={{
                            cursor: makeFinalLoding ? "no-drop" : "pointer",
                            opacity: makeFinalLoding ? 0.7 : 1,
                          }}
                          disabled={makeFinalLoding}
                        >
                          {makeFinalLoding && (
                            <span
                              className="spinner-border spinner-border-sm me-1"
                              role="status"
                              aria-hidden="true"
                            ></span>
                          )}
                          Save & Make Final
                        </Button>
                      </Modal.Footer>
                    </Modal>

                    <Modal className="fade" size="lg" show={modalSeriesDetail}>
                      <Modal.Header>
                        <ToastContainer />
                        <Modal.Title>
                          Generate Series : for Agent -{" "}
                          {
                            qoutationListFinal[0]?.QueryInfo?.ContactInfo
                              ?.ContactPersonName
                          }{" "}
                          ( {qoutationListFinal[0]?.QuotationNumber} ){" "}
                        </Modal.Title>
                        <Button
                          onClick={() => setModalSeriesDetail(false)}
                          variant=""
                          className="btn-close"
                        ></Button>
                      </Modal.Header>
                      <Modal.Body className="py-1">
                        <div className="row">
                          <div className="col-12">
                            <div className="row align-items-end mb-2">
                              <div className="col-md-6 col-lg-3">
                                <label className="m-0">Select View</label>
                                <select
                                  className="form-control form-control-sm"
                                  name="selectview"
                                >
                                  <option value="">Select</option>
                                  <option value="">Option 1</option>
                                </select>
                              </div>
                              <div className="col-md-6 col-lg-4">
                                <label className="m-0">Series Name :</label>
                                <span className="text-danger">*</span>
                                <input
                                  type="text"
                                  placeholder="Series Name"
                                  className="form-control form-control-sm"
                                  name="SeriesName"
                                  value={seriesName}
                                  onChange={(e) =>
                                    setSeriesName(e.target.value)
                                  }
                                />
                              </div>
                              <div className="col-md-6 col-lg-2">
                                <label className="m-0">Start Date:</label>
                                <span className="text-danger">*</span>
                                <DatePicker
                                  className="form-control form-control-sm"
                                  dateFormat="dd-MM-yyyy"
                                  isClearable
                                  todayButton="Today"
                                  selected={selectedDate}
                                  onChange={(date) => setSelectedDate(date)}
                                />
                              </div>
                              <div className="col-1">
                                <label className="m-0">Interval</label>
                                <input
                                  type="number"
                                  placeholder="0"
                                  className="form-control form-control-sm"
                                  name="interval"
                                  value={interval}
                                  onChange={(e) => setInterval(e.target.value)}
                                />
                              </div>
                              <div className="col-1">
                                <label className="m-0">No of Arrival</label>
                                <input
                                  type="number"
                                  placeholder="0"
                                  className="form-control form-control-sm"
                                  name="Arrival"
                                  value={noOfArrival}
                                  onChange={(e) =>
                                    setNoOfArrival(e.target.value)
                                  }
                                />
                              </div>
                              <div className="col-1">
                                <button
                                  onClick={handleAddRows}
                                  className="btn btn-primary btn-custom-size"
                                >
                                  Add
                                </button>
                              </div>
                            </div>
                            {rows.length > 0 && (
                              <div className="row">
                                <div className="col-12">
                                  <label className="m-0">
                                    Series Details :
                                  </label>
                                  <table className="table table-bordered itinerary-table">
                                    <thead>
                                      <tr>
                                        <th>S.No.</th>
                                        <th>Tour Start Date</th>
                                        <th>Is Confirmed</th>
                                        <th>Is Group Booked</th>
                                        <th></th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {rows.map((row) => (
                                        <tr key={row.id}>
                                          <td className="border px-4 py-2">
                                            {row.id}.
                                          </td>
                                          <td className="border px-4 py-2">
                                            {editingRow === row.id ? (
                                              <DatePicker
                                                className="form-control form-control-sm border rounded px-2 py-1"
                                                dateFormat="dd-MM-yyyy"
                                                isClearable
                                                todayButton="Today"
                                                selected={row.date}
                                                onChange={(date) =>
                                                  updateDate(row.id, date)
                                                }
                                              />
                                            ) : (
                                              <span
                                                className="cursor-pointer"
                                                onClick={() =>
                                                  setEditingRow(row.id)
                                                }
                                              >
                                                {row.date
                                                  ? row.date
                                                      .toLocaleDateString(
                                                        "en-GB"
                                                      )
                                                      .replace(/\//g, "-")
                                                  : "Click to select date"}
                                              </span>
                                            )}
                                          </td>
                                          <td className="border px-4 py-2 text-center">
                                            <div className="form-check check-sm d-flex align-items-center justify-content-center">
                                              <input
                                                type="checkbox"
                                                className="form-check-input height-em-1 width-em-1"
                                                checked={row.isConfirmed}
                                                onChange={() =>
                                                  toggleCheckbox(
                                                    row.id,
                                                    "isConfirmed"
                                                  )
                                                }
                                              />
                                            </div>
                                          </td>
                                          <td className="border px-4 py-2 text-center">
                                            <div className="form-check check-sm d-flex align-items-center justify-content-center">
                                              <input
                                                type="checkbox"
                                                className="form-check-input height-em-1 width-em-1"
                                                checked={row.isGroupBooked}
                                                onChange={() =>
                                                  toggleCheckbox(
                                                    row.id,
                                                    "isGroupBooked"
                                                  )
                                                }
                                              />
                                            </div>
                                          </td>
                                          <td>
                                            <div className="d-flex w-100 justify-content-center gap-2">
                                              <span onClick={addRow}>
                                                <i className="la la-plus border cursor-pointer bg-success text-white rounded-pill fontSize10px padding1px"></i>
                                              </span>
                                              <span
                                                onClick={() =>
                                                  deleteRow(row.id)
                                                }
                                              >
                                                <i className="la la-minus border cursor-pointer bg-primary text-white rounded-pill fontSize10px padding1px"></i>
                                              </span>
                                            </div>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button
                          onClick={() => setModalSeriesDetail(false)}
                          variant="danger light"
                          className="btn-custom-size"
                        >
                          Close
                        </Button>
                        <Button
                          variant="primary"
                          onClick={handleSubmitSeries}
                          className="btn-custom-size"
                        >
                          Save
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
                                    {/* {console.log(qoutation?.PaxSlab,"paxlab")} */}
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

          {/* console.log(state?.QueryData?.QueryType[0]?.QueryTypeId, state?.QueryData?.QueryStatus?.id, "state?.QueryType[0].QueryTypeId") */}

          {
            // (state?.QueryData?.QueryType[0]?.QueryTypeId == 3 && state?.QueryData?.QueryStatus?.id == 5) ?

            parsedDataQuery_Type_Status?.QueryType === 3 &&
            parsedDataQuery_Type_Status?.QueryStatus === 5 &&
            qoutationSeriesListQueryJson.length > 0 ? (
              <>
                <table className="table table-bordered itinerary-table">
                  <thead>
                    <tr>
                      {/* <th>Tour Id</th> */}
                      <th>Tour Code</th>
                      <th>Tour Name</th>
                      <th>Arrival Date</th>
                      <th>Departure Date</th>
                      <th>Confirmed</th>
                      {/* <th>Action</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {qoutationSeriesList?.map((service, index) => (
                      <tr key={index}>
                        {/* <td><span>{service?.TourId}</span></td> */}
                        <td>
                          <span>{service?.TourCode}</span>
                        </td>
                        <td>
                          <span>{service?.SeriesName}</span>
                        </td>
                        <td>
                          <span>
                            {handleDateFormatChange(service?.Days[0]?.Date)}
                          </span>
                        </td>
                        <td>
                          <span>
                            {handleDateFormatChange(
                              service?.Days[service?.Days.length - 1]?.Date
                            )}
                          </span>
                        </td>
                        <td>
                          <span>
                            {service?.TravelDateInfo?.TravelData[0]?.isConfirm
                              ? "Yes"
                              : "No"}
                          </span>
                        </td>
                        {/* <td >
                          {console.log(service?.QueryStatus?.name, "service")}
                          <div className="d-flex justify-content-center align-items-center gap-2">
                            <div className="icon-container ">
                              <button
                                className="btn btn-primary btn-custom-size newBtn duplicate newQuotationIconButton"
                                onClick={() =>
                                  handleDuplicate(
                                    service?.QuotationNumber,
                                    "Confirmed"
                                  )
                                }
                              >
                                <img
                                  src={activeDuplicate}
                                  alt="icon"
                                  className="icons newQuotationIcon"
                                  style={{ width: "23px", height: "23px" }}
                                />
                              </button>
                              <p className="tooltip-text py-1 px-1">Duplicate</p>
                            </div>
                            <div className="icon-container ">
                              <button
                                onClick={() => { handleSeriesOperation(service, index) }}
                                className="btn btn-primary btn-custom-size newBtn service-request newQuotationIconButton"
                              >
                                <img
                                  src={activeSupplier}
                                  alt="icon"
                                  className="icons newQuotationIcon"
                                />
                              </button>
                              <p className="tooltip-text py-1 px-1">
                                Service Request
                              </p>
                            </div>
                          </div>
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="row">
                  <div className="col-lg-6 border rounded px-2 py-2 pe-3 me-3 borderrelative">
                    <div className="row">
                      <div className="col-12 col-md-6 col-lg-2">
                        <label className="m-0">Total Pax</label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          name="PaxDetails.Total"
                          value={formValue.PaxDetails.Total}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-12 col-md-6 col-lg-2">
                        <label className="m-0">TWN</label>
                        <input
                          type="number"
                          placeholder="0"
                          className="form-control form-control-sm"
                          name="PaxDetails.TWN"
                          value={formValue.PaxDetails.TWN}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-12 col-md-6 col-lg-2">
                        <label className="m-0">DBL</label>
                        <input
                          type="number"
                          placeholder="0"
                          className="form-control form-control-sm"
                          name="PaxDetails.DBL"
                          value={formValue.PaxDetails.DBL}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-12 col-md-6 col-lg-2">
                        <label className="m-0">TPL</label>
                        <input
                          type="number"
                          placeholder="0"
                          className="form-control form-control-sm"
                          name="PaxDetails.TPL"
                          value={formValue.PaxDetails.TPL}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-12 col-md-6 col-lg-2">
                        <label className="m-0">SGL</label>
                        <input
                          type="number"
                          placeholder="0"
                          className="form-control form-control-sm"
                          name="PaxDetails.SGL"
                          value={formValue.PaxDetails.SGL}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  {/* <div className="position-relative col-12 col-lg-5 mt-3 mt-lg-0">
                    <span
                      className="position-absolute px-2 dateCardFeildSet"
                      style={{
                        top: "-0.55rem",
                        left: "1rem",
                        fontSize: "0.75rem",
                        zIndex: 1,
                      }}
                    >
                      Free Pax
                    </span>
                    <div className="row border rounded px-2 py-2 pe-3 me-3 align-items-center">
                      <div className="col-3">
                        <label className="m-0">Twin</label>
                        <input
                          type="number"
                          placeholder="0"
                          className="form-control form-control-sm"
                          name="RoomAllocation.TWN"
                          value={formValue?.RoomAllocation?.TWN}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-3">
                        <label className="m-0">Single</label>
                        <input
                          type="number"
                          placeholder="0"
                          className="form-control form-control-sm"
                          name="RoomAllocation.SGL"
                          value={formValue?.RoomAllocation?.SGL}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-4">
                        <div className="form-check check-sm d-flex align-items-center">
                          <input
                            type="checkbox"
                            className="form-check-input height-em-1 width-em-1"
                            name="RoomAllocation.Escort"
                            checked={formValue?.RoomAllocation?.Escort}
                            onChange={handleChange}
                          />
                          <label className="fontSize11px m-0 ms-1 mt-1">Escort</label>
                        </div>
                      </div>
                    </div>
                  </div> */}
                  <div className="position-relative col-12 col-lg-5 mt-3 mt-lg-2">
                    <span
                      className="position-absolute px-2 dateCardFeildSet"
                      style={{
                        top: "-0.55rem",
                        left: "1rem",
                        fontSize: "0.75rem",
                        zIndex: 1,
                      }}
                    >
                      FOC Details
                    </span>
                    <div className="row border rounded px-2 py-2 pe-3 me-3 borderrelative">
                      <div className="col-4">
                        <label className="m-0">FOC</label>
                        <input
                          type="number"
                          placeholder="0"
                          className="form-control form-control-sm"
                          name="FOCDetails.FOC"
                          value={formValue?.FOCDetails?.FOC}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-4">
                        <label className="m-0">DBL</label>
                        <input
                          type="number"
                          placeholder="0"
                          className="form-control form-control-sm"
                          name="FOCDetails.DBL"
                          value={formValue?.FOCDetails?.DBL}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-4">
                        <label className="m-0">SGL</label>
                        <input
                          type="number"
                          placeholder="0"
                          className="form-control form-control-sm"
                          name="FOCDetails.SGL"
                          value={formValue?.FOCDetails?.SGL}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row form-row-gap mt-1">
                    <div className="col-12 col-lg-12">
                      <div className="row align-items-end ">
                        <div className="col-12 col-md-6 col-lg-3">
                          <label className="m-0">Executive (ISO)</label>
                          <select
                            className="form-control form-control-sm"
                            name="ExecutiveISO"
                            value={formValue.ExecutiveISO}
                            onChange={handleChange}
                          >
                            <option value="">Select</option>
                            {isomasterlist?.length > 0 &&
                              isomasterlist.map((value, index) => (
                                <option
                                  value={value.id.toString()}
                                  key={index + 1}
                                >
                                  {value.Name}
                                </option>
                              ))}
                          </select>
                        </div>
                        <div className="col-12 col-md-6 col-lg-3">
                          <label className="m-0">Handled By</label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            name="HandledBy"
                            value={formValue.HandledBy}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="col-12 col-md-6 col-lg-3">
                          <label className="m-0">Registration Date</label>
                          <DatePicker
                            className="form-control form-control-sm"
                            dateFormat="dd-MM-yyyy"
                            isClearable
                            todayButton="Today"
                            selected={getRegistrationDate()}
                            onChange={handleDateChange}
                            placeholderText="Registration Date"
                          />
                        </div>
                        <div className="col-12 col-md-6 col-lg-3">
                          <div className="form-check check-sm d-flex align-items-center">
                            <input
                              type="checkbox"
                              className="form-check-input height-em-1 width-em-1"
                              name="IsSeriesByRegularDeparture"
                              checked={formValue.IsSeriesByRegularDeparture}
                              onChange={handleChange}
                            />
                            <label className="fontSize11px m-0 ms-1 mt-1">
                              Is Series By Regular Departure
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-end gap-2 mt-3">
                    <button
                      onClick={handleSubmitSeriesPaxUpdate}
                      className="btn btn-primary btn-custom-size"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </>
            ) : (
              ""
            )
          }
        </div>
        {/* <div className="sidebar-container col-lg-3 col-md-12 col-sm-12 p-2">
          <p className="sidebar-heading text-center fw-semibold text-uppercase small pb-2 mb-1 border-bottom">
            Destinations
          </p>

          <div className="row text-center mb-1">
            <div className="col-4">
              <p className="sidebar-label m-0">From</p>
              <p className="sidebar-value m-0 fw-semibold">DELHI</p>
            </div>
            <div className="col-4 d-flex align-items-center justify-content-center">
              <img src={icon3} alt="arrow icon" className="img-fluid icon-arrow" />
            </div>
            <div className="col-4">
              <p className="sidebar-label m-0">To</p>
              <p className="sidebar-value m-0 fw-semibold">AGRA</p>
            </div>
          </div>

          <div className="mb-4">
            <table className="sidebar-table w-100 text-center" style={{ tableLayout: "fixed" }}>
              <thead>
                <tr className="sidebar-table-header">
                  <th>Duration</th>
                  <th>Destination</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {TourSummary?.TourDetails?.map((tour, index) => (
                  <tr className="sidebar-table-row" key={index}>
                    <td>Day {tour?.DayNo}</td>
                    <td>{tour?.DestinationName}</td>
                    <td>{tour?.Date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>


          <div className="row g-2 mb-3">
            {[
              { label: 'NIGHTS', value: queryMasterList?.TravelDateInfo?.TotalNights },
              { label: 'ADULTS', value: queryMasterList?.PaxInfo?.Adult },
              { label: 'CHILDS', value: queryMasterList?.PaxInfo?.Child }
            ].map((item, idx) => (
              <div className="col-4" key={idx}>
                <div className="sidebar-box">
                  <div className="sidebar-box-label">{item.label}</div>
                  <div className="sidebar-box-value">{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="row g-2 mb-4">
            {QueryInfo?.Accomondation?.RoomInfo?.map((info, idx) => (
              <div className="col-4" key={idx}>
                <div className="sidebar-box">
                  <div className="sidebar-box-label">{info?.RoomType}</div>
                  <div className="sidebar-box-value">{info?.NoOfPax ?? 0}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="row g-2 mb-2">
            <div className="col-6">
              <div className="sidebar-box">
                <div className="sidebar-box-label">BUDGET</div>
                <div className="sidebar-box-value">{queryMasterList?.Budget}</div>
              </div>
            </div>
          </div>

          <div className="border-top py-1 mb-0 sidebar-divider border-bottom" >
            <p className="m-0 small sidebar-label">Room Preference :</p>
          </div>
          <div className="py-1">
            <span className="small sidebar-label">Operation Person</span>
            <div className="fw-bold sidebar-value">{queryMasterList?.Prefrences?.OperationPersonName}</div>
          </div>
        </div> */}
        <DestinationsCard />
      </div>
    </div>
  );
};

export default QuotationListsec;
