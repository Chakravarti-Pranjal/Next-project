import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosOther } from "../../../../http/axios_base_url";
import activeQuotation from "../../../../../public/assets/icons/activeIcons/Quotation.svg";
import inactiveQuotation from "../../../../../public/assets/icons/InactiveIcons/Quotation.svg";
import activeAssignie from "../../../../../public/assets/icons/activeIcons/assignUser.svg";
import inactiveAssignie from "../../../../../public/assets/icons/InactiveIcons/assignUser.svg";
import activeCostSheet from "../../../../../public/assets/icons/activeIcons/Costsheet.svg";
import inactiveCostSheet from "../../../../../public/assets/icons/InactiveIcons/Costsheet.svg";
import activeInvoice from "../../../../../public/assets/icons/activeIcons/Invoice.svg";
import inactiveInvoice from "../../../../../public/assets/icons/InactiveIcons/Invoice.svg";
import activeMail from "../../../../../public/assets/icons/activeIcons/clientCommunication.svg";
import inactiveMail from "../../../../../public/assets/icons/InactiveIcons/clientCommunication.svg";
import activePayment from "../../../../../public/assets/icons/activeIcons/Payments.svg";
import inactivePayment from "../../../../../public/assets/icons/InactiveIcons/Payments.svg";
import activeProposal from "../../../../../public/assets/icons/activeIcons/Proposal.svg";
import inactiveProposal from "../../../../../public/assets/icons/InactiveIcons/Proposal.svg";
import activeQueryIcon from "../../../../../public/assets/icons/activeIcons/Query.svg";
import inactiveQueryIcon from "../../../../../public/assets/icons/InactiveIcons/Query.svg";
import activeSupplier from "../../../../../public/assets/icons/activeIcons/supplierCommunication.svg";
import inactiveSupplier from "../../../../../public/assets/icons/InactiveIcons/supplierCommunication.svg";
import activeTour from "../../../../../public/assets/icons/activeIcons/tourExecution.svg";
import inactiveTour from "../../../../../public/assets/icons/InactiveIcons/tourExecution.svg";
import activeVouchers from "../../../../../public/assets/icons/activeIcons/Voucher.svg";
import inactiveVouchers from "../../../../../public/assets/icons/InactiveIcons/Voucher.svg";
import moment from "moment";
import Stepper from "../Stepper";
import { NavLink, useLocation } from "react-router-dom";
import QueryHeading from "../QueryHeading";
import { useDispatch, useSelector } from "react-redux";
import {
  setItineraryEditingFalse,
  setPolicyData,
  setQoutationData,
  setQoutationSubject,
  setQueryData,
  setQueryUpdateData,
} from "../../../../store/actions/queryAction";
import { currentDate } from "../../../../helper/currentDate";
import { Tune } from "@mui/icons-material";
import { Modal, Row, Table } from "react-bootstrap"; //model
import { setHideSendBtn } from "../../../../store/actions/createExcortLocalForeignerAction";
import QueryNavbar from "../../../components/queryNavbar/QueryNavbar";
const currentQueryGlobalContext = createContext();

const Preview = () => {
  const [emailTemplateData, setEmailTemplateData] = useState(null); // store emailtemplatedata
  const [open, setopen] = useState(false);
  const [iframeSrc, setIframeSrc] = useState(""); // State to store the iframe source
  const [popupData, setPopupData] = useState(null);
  const { state } = useLocation();
  const { pathname } = useLocation();
  const selector = useSelector((data) => data?.queryReducer);
  const { hideSendBtn } = useSelector(
    (data) => data?.activeTabOperationReducer
  );
  const [headingShow, setHeadingShow] = useState(false);
  const [previewData, setPreviewData] = useState("");
  const { queryUpdateData, queryData } = useSelector(
    (data) => data?.queryReducer
  );
  const [loadingBtn, setLoadingBtn] = useState(false);

  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  // console.log(state, "mmmmS");

  // console.log(popupData, "mmmmQ");
  const getPreviewData = async () => {
    try {
      const { data } = await axiosOther.post("querymasterlist", {
        QueryId: state?.QueryAlphaNumId || queryData?.QueryAlphaNumId,
      });
      localStorage.setItem("query-data", JSON.stringify(data?.DataList[0]));
      setPreviewData(data?.DataList[0]);
      dispatch(
        setQoutationSubject(
          data?.DataList[0]?.ServiceDetail?.ServiceCompanyName +
            " " +
            currentDate(data?.DataList[0]?.QueryDate?.Date)
        )
      );
    } catch (error) {
      console.log(error);
    }
  };
  // console.log(previewData, "previewData")

  const fetchEmailTemplate = async () => {
    try {
      const emailPayload = {
        emailKey: "1", // Replace with the appropriate key if needed
      };
      const emailTemplateResponse = await axiosOther.post(
        "email-template",
        emailPayload
      );
      setEmailTemplateData(emailTemplateResponse);
    } catch (error) {
      console.error("Error fetching email template:", error);
    }
  };
  useEffect(() => {
    getPreviewData();
  }, [queryData?.QueryId]);
  useEffect(() => {
    fetchEmailTemplate();
  }, []);

  const totalPax = useMemo(() => {
    const paxArray =
      previewData?.Hotel?.RoomInfo?.map((room) =>
        room?.NoOfPax == null ? 0 : parseInt(room.NoOfPax)
      ) || [];
    const pax_total = paxArray.reduce((a, b) => a + b, 0);

    return pax_total;
  }, [previewData]);
  const query_type = previewData?.QueryType?.map((item) => item?.QueryTypeName);

  const forGetSubject = useSelector((data) => data);

  const handleFinalSave = async (navigation) => {
    dispatch(
      setQueryData({
        QueryId: previewData?.id,
        QueryAlphaNumId: previewData?.QueryID,
        QueryAllData: previewData,
      })
    );
    dispatch(setItineraryEditingFalse());

    if (navigation === "save") {
      navigate("/queries");
      dispatch(setHideSendBtn(true));
    }

    {
      /* Add  to new Button to Send1 ! */
    }
    if (navigation === "send1") {
      const queryId = previewData?.QueryID;
      const clientName = previewData?.ServiceDetail?.ServiceCompanyName;
      const operationPerson = previewData?.Prefrences?.OperationPersonName;
      const salesPerson = previewData?.Prefrences?.SalesPersonName;
      const groupName = previewData?.GroupName;
      const ContactEmail = previewData?.ContactInfo?.ContactEmail;
      const body = emailTemplateData?.data?.body;
      const totalPax = previewData?.PaxInfo?.TotalPax;
      const BusinessType = previewData?.ServiceDetail?.BusinessTypeName;
      const adult = previewData?.PaxInfo?.Adult;
      const child = previewData?.PaxInfo?.Child;
      const infant = previewData?.PaxInfo?.Infant;
      const destinationsData =
        previewData?.TravelDateInfo?.TravelData?.map((destination, index) => ({
          sn: index + 1,
          date: destination?.Date,
          destination: destination?.DestinationName,
        })) || [];
      // Combine all data into a single object
      const popupDataObject = {
        queryId,
        clientName,
        operationPerson,
        salesPerson,
        groupName,
        adult,
        child,
        infant,
        destinationsData,
        body,
        totalPax,
        BusinessType,
        ContactEmail,
        salesPerson,
        operationPerson,
      };

      setPopupData(popupDataObject);
      // Encode the data as a JSON string and pass it as a query parameter
      // const iframeSrc = `/templates/popMail.html?data=${encodeURIComponent(
      //   JSON.stringify(popupDataObject)
      // )}`;

      localStorage.setItem("popupData", JSON.stringify(popupDataObject));

      const iframeSrc = `/templates/popMail.html`;

      setIframeSrc(iframeSrc); // Set the iframe source dynamically
      setopen(true); // Open the popup
    }

    if (navigation === "send") {
      setLoadingBtn(true);

      try {
        const { data } = await axiosOther.post("addquerywithjson", {
          QueryId: previewData?.QueryID,
          Subject: forGetSubject?.queryReducer?.qoutationSubject,
          HotelCategory: "Single Hotel Category",
          PaxSlabType: "Single Slab",
          HotelMarkupType: "Service Wise Markup",
          HotelStarCategory: [],
          PackageID: "",
        });

        if (data?.checkescort === "No") {
          setTimeout(() => {
            if (window.location.origin === "https://beta.creativetravel.in") {
              navigate("/query/quotation-four");
              return;
            }
            navigate("/query/quotation-list");
          }, 1000);
        }

        const response1 = await axiosOther.post("create-excort-days", {
          QueryId: previewData?.QueryID,
          QuotationNumber: data?.Response?.QuotationNumber,
          ExcortType: "Local",
          NoOfEscort: "1",
        });
        const response2 = await axiosOther.post("create-excort-days", {
          QueryId: previewData?.QueryID,
          QuotationNumber: data?.Response?.QuotationNumber,
          ExcortType: "Foreigner",
          NoOfEscort: "1",
        });

        if (
          data?.status == 1 &&
          response1?.data?.Status == 1 &&
          response2?.data?.Status === 1
        ) {
          if (window.location.origin === "https://beta.creativetravel.in") {
            navigate("/query/quotation-four");
            return;
          }
          navigate("/query/quotation");
          localStorage.setItem(
            "Query_Qoutation",
            JSON.stringify({
              QoutationNum: data?.Response.QuotationNumber,
              QueryID: previewData?.QueryID,
            })
          );
        }
      } catch (error) {
        console.log("error", error);
      } finally {
        setLoadingBtn(false);
      }
    }
  };

  const handlEdit = () => {
    const data = {
      ...previewData,
      routeNavigate: "editByPreview",
    };
    dispatch(setQueryUpdateData(previewData));
    navigate("/query", { state: data });
    // dispatch(setHideSendBtn(true));
  };

  const queryViewList = [
    {
      name: "Query",
      inactiveIcon: inactiveQueryIcon,
      activeIcon: activeQueryIcon,
      Link: "/query-list/query-dashboard/",
      pathname: "",
    },
    {
      name: "Quotation",
      inactiveIcon: inactiveQuotation,
      activeIcon: activeQuotation,
      link: "/query/quotation-list",
      matchPaths: ["/query/quotation-list"],
      // subPathname: localStorage.getItem("policy")
      //   ? localStorage.getItem("policy")
      //   : "",
      // subPathname1: localStorage.getItem("commission")
      //   ? localStorage.getItem("commission")
      //   : "",
      // subPathname2: localStorage.getItem("summary")
      //   ? localStorage.getItem("summary")
      //   : "",
    },
    {
      name: "Cost Sheet",
      inactiveIcon: inactiveCostSheet,
      activeIcon: activeCostSheet,
      Link: "costsheet",
      pathname: "costsheet",
    },
    {
      name: "Proposal",
      inactiveIcon: inactiveProposal,
      activeIcon: activeProposal,
      Link: "proposal",
      pathname: "proposal",
    },
    {
      name: "Client Communication",
      inactiveIcon: inactiveMail,
      activeIcon: activeMail,
      Link: "clientcomm",
      pathname: "clientcomm",
    },
    {
      name: "Supplier Communication",
      inactiveIcon: inactiveSupplier,
      activeIcon: activeSupplier,
      Link: "suppliercomm",
      pathname: "suppliercomm",
    },
    {
      name: "Payments",
      inactiveIcon: inactivePayment,
      activeIcon: activePayment,
      Link: "payments",
      pathname: "payments",
    },
    {
      name: "Vouchers",
      inactiveIcon: inactiveVouchers,
      activeIcon: activeVouchers,
      Link: "vouchers",
      pathname: "vouchers",
    },
    {
      name: "Invoices",
      inactiveIcon: inactiveInvoice,
      activeIcon: activeInvoice,
      Link: "invoices",
      pathname: "invoices",
    },
    {
      name: "Tour Extension",
      inactiveIcon: inactiveTour,
      activeIcon: activeTour,
      Link: "tour-extension",
      pathname: "tourextension",
    },
    {
      name: "Assign User",
      // inactiveIcon: inactiveAssignie,
      // activeIcon: activeAssignie,
      Link: "assignuser",
      pathname: "assignuser",
    },
  ];

  return (
    <>
      <Stepper />
      <div className="row preview">
        {/* mail popup */}
        <Modal show={open} onHide={() => setopen(false)} centered size="xl">
          <Modal.Header closeButton>
            <Modal.Title>Mail Popup</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <iframe
              src={iframeSrc} // Use the dynamic iframe source
              title="HTML Popup"
              width="100%"
              height="500px"
              style={{ border: "none" }}
            ></iframe>
          </Modal.Body>
        </Modal>
        <div className="col-12 mt-2 mb-2">
          {/* <ul className="nav nav-pills-toolbar d-flex flex-nowrap align-items-center justify-content-between p-1 radius-10 dark-border">
            {queryViewList?.length > 0 &&
              queryViewList.map((data, index) => {
                return (
                  <li
                    className="nav-item view-nav-item rounded-pill mb-1"
                    key={index + 1}
                  >
                    <NavLink
                      className={`rounded-pill d-flex align-items-center gap-2 font-weight-500 ${
                        pathname ==
                        `/query-list/query-dashboard${data?.pathname}${
                          data?.subPathname1 || ""
                        }${data?.subPathname2 || ""}${data?.subPathname || ""}`
                          ? "Active"
                          : "text-dark"
                      }`}
                      // onClick={() => handleNavLink()}
                      to={data?.link}
                    >
                      <img
                        src={
                          pathname ===
                          `/querylist/queryview/${data?.pathname}${
                            data?.subPathname1 || ""
                          }${data?.subPathname2 || ""}${
                            data?.subPathname || ""
                          }`
                            ? data?.activeIcon
                            : data?.inactiveIcon
                        }
                        alt="query-icon"
                        className="icons"
                      />
                      <p className="nav-name">{data?.name}</p>
                    </NavLink>
                  </li>
                );
              })}
          </ul> */}
          <QueryNavbar />
        </div>

        <div className="col-lg-12">
          <div className="card">
            <div>
              <currentQueryGlobalContext.Provider
                value={{
                  header: { headingShow, setHeadingShow },
                  currentQuery: { previewData, setPreviewData },
                }}
              >
                <QueryHeading headData={previewData} />
              </currentQueryGlobalContext.Provider>
            </div>
            <div className="card-header  d-flex justify-content-between align-items-center  flex-wrap">
              <h3 className="card-title ">Preview</h3>
              <div className="d-flex justify-content-end align-items-center gap-2 flex-wrap">
                {/* <button
                  type="button"
                  className="btn bg-cancel-preview p-1 py-1   d-flex justify-content-center align-items-center gap-1 font-size-10 rounded-1"
                  onClick={() => navigate("/query-list")}
                >
                  <i className="fa-regular fa-circle-xmark"></i>
                  <p className="m-0 font-size-10">Cancel Query</p>
                </button>
                <button
                  type="button"
                  className="btn bg-history-preview p-1 py-1  font-size-10 d-flex justify-content-center align-items-center gap-1 rounded-1"
                >
                  <i className="fa-solid fa-clock-rotate-left ps-1"></i>
                  <p className="m-0 font-size-10">Query History</p>
                </button>
                <button
                  type="button"
                  className="btn btn-danger p-1  py-1   d-flex justify-content-center align-items-center gap-1 font-size-10 rounded-1"
                >
                  <i className="fa-solid fa-ban ps-1 font-size-10"></i>
                  <p className="m-0 font-size-10">Query Lost</p>
                </button> */}
                <button
                  type="button"
                  className="btn bg-history-preview px-3  py-1  font-size-10 rounded-1"
                  onClick={handlEdit}
                >
                  Edit
                </button>
                {/* {hideSendBtn && (
                  <button
                    type="button"
                    className="btn bg-cancel-preview px-3  py-1  font-size-10 rounded-1"
                    onClick={() => handleFinalSave("send")}
                  >
                    Send
                  </button>
                )} */}

                {/* Add  to new Button to Send1 ! */}
                {/* <button
                  type="button"
                  className="btn bg-cancel-preview px-3  py-1  font-size-10 rounded-1"
                  onClick={() => handleFinalSave("send1")}
                >
                  Send1
                </button> */}

                {/* <button
                  type="button"
                  className="btn edit-query-button-bg px-3  py-1  font-size-10 btn  rounded-1"
                  onClick={() => handleFinalSave("save")}
                >
                  Save
                </button> */}
                <button
                  type="button"
                  className="btn edit-query-button-bg  py-1 font-size-10 rounded-1"
                  onClick={() => handleFinalSave("send1")}
                >
                  Send Acknowledgement
                </button>
                {/* <button
                  type="button"
                  className="btn bg-cancel-preview py-1 font-size-10 rounded-1"
                >
                  Send
                </button> */}
                {/* <button
                  type="button"
                  className="btn btn-primary py-1 font-size-10 rounded-1"
                  onClick={() => handleFinalSave("send")}
                >
                  Submit
                </button> */}

                {/* {hideSendBtn && ( */}
                <button
                  type="button"
                  className="btn btn-primary py-1 font-size-10 rounded-1 d-flex align-items-center gap-1"
                  style={{
                    cursor: loadingBtn ? "no-drop" : "pointer",
                    opacity: loadingBtn ? 0.7 : 1,
                  }}
                  disabled={loadingBtn}
                  onClick={() => handleFinalSave("send")}
                >
                  {loadingBtn && (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  )}
                  {loadingBtn ? "Submitting..." : "Submit"}
                </button>
                {/* )} */}

                <button
                  type="button"
                  className="btn btn-dark  rounded-1  width-100 px-3 py-1 font-size-10"
                  onClick={handlEdit}
                >
                  <span className="me-1">Back</span>
                  <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
                </button>
              </div>
            </div>
            <div className="card-body px-2 pb-3 pt-3">
              <div className="row">
                <div className="col-12">
                  <div className="row my-3">
                    <div className="col-6 col-md-2">
                      <span className="font-size-12">Business Type</span>
                      <h6 className="font-size10">
                        {previewData?.ServiceDetail?.BusinessTypeName}
                      </h6>
                    </div>
                    <div className="col-6 col-md-2">
                      <span className="font-size-12">Agent/Client Name</span>
                      <h6 className="font-size10">
                        {previewData?.ServiceDetail?.ServiceCompanyName}
                        {" / "}
                        {previewData?.ClientName}
                      </h6>
                    </div>
                    <div className="col-6 col-md-2">
                      <span className="font-size-12">Contact Person</span>
                      <h6 className="font-size10">
                        {previewData?.ServiceDetail?.ServiceCompanyName}
                      </h6>
                    </div>
                    <div className="col-6 col-md-4">
                      <span className="font-size-12">Contact Number</span>
                      <h6 className="font-size10">
                        {previewData?.ContactInfo?.ContactNumber}
                      </h6>
                    </div>
                    <div className="col-6 col-md-2">
                      <div>
                        <span className="font-size-12">Email Id</span>
                        <h6 className="font-size10">
                          {previewData?.ContactInfo?.ContactEmail}
                        </h6>
                      </div>
                    </div>
                  </div>
                  <div className="row border-top my-2 pt-2 align-items-center">
                    <div className="position-relative col-6 col-md-4 mt-2">
                      <span
                        className="position-absolute px-2 dateCardFeildSet"
                        style={{
                          top: "-0.55rem",
                          left: "1rem",
                          fontSize: "0.75rem",
                          zIndex: 1,
                        }}
                      >
                        Validity
                      </span>
                      <div className="row border rounded px-2 py-1 me-3">
                        <div className="col-6">
                          <span className="font-size-12">From Date</span>
                          <h6 className="font-size10">
                            {moment(
                              previewData?.TravelDateInfo?.FromDate
                            ).format("DD-MM-YYYY")}
                          </h6>
                        </div>{" "}
                        <div className="col-6">
                          <span className="font-size-12">To Date</span>
                          <h6 className="font-size10">
                            {moment(previewData?.TravelDateInfo?.ToDate).format(
                              "DD-MM-YYYY"
                            )}
                          </h6>
                        </div>
                      </div>
                    </div>

                    <div className="col-6 col-md-2">
                      <span className="font-size-12">Travel Type</span>
                      <h6 className="font-size10">
                        {previewData?.TravelDateInfo?.ScheduleType}
                      </h6>
                    </div>

                    <div className="col-6 col-md-4">
                      <span className="font-size-12">Destination</span>
                      <h6 className="font-size10 fs-6">
                        {previewData?.TravelDateInfo?.TravelData &&
                          previewData?.TravelDateInfo?.TravelData?.length > 0 &&
                          previewData?.TravelDateInfo?.TravelData.map(
                            (destination, index) => (
                              <span key={index}>
                                {destination?.DestinationName}
                                {index <
                                  previewData.TravelDateInfo.TravelData.length -
                                    1 && " || "}
                              </span>
                            )
                          )}
                      </h6>
                    </div>
                    <div className="col-6 col-md-2">
                      <span className="font-size-12">Total Nights</span>
                      <h6 className="font-size10">
                        {previewData?.TravelDateInfo?.TotalNights}
                      </h6>
                    </div>
                  </div>
                  <div className="row border-top my-2 pt-2">
                    <div className="col-md-4">
                      <div className="row  border-end">
                        <div className="col-6 col-md-3">
                          <span className="font-size-12">
                            <i className="fa-solid fa-person pe-1"></i>Adult
                          </span>
                          <h6 className="px-4 font-size10">
                            {previewData?.PaxInfo?.Adult}
                          </h6>
                        </div>
                        <div className="col-6 col-md-3">
                          <span className="font-size-12 text-start">
                            <i className="fa-solid fa-child-reaching pe-1"></i>
                            Child
                          </span>
                          <h6 className="px-4 font-size10">
                            {previewData?.PaxInfo?.Child}
                          </h6>
                        </div>
                        <div className="col-6 col-md-3 pe-1">
                          <span className="font-size-12  text-start">
                            <i className="fa-solid fa-hands-holding-child pe-1"></i>
                            Infant
                          </span>
                          <h6 className="px-4 font-size10">
                            {previewData?.PaxInfo?.Infant}
                          </h6>
                        </div>
                        <div className="col-6 col-md-3 text-start">
                          <span className="font-size-12">Total Pax</span>
                          <h6 className="px-4 font-size10">
                            {previewData?.PaxInfo?.TotalPax}
                          </h6>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-8 ps-lg-5">
                      <div className="d-flex justify-content-between align-items-center gap-2 flex-md-wrap">
                        {previewData?.Hotel?.RoomInfo.map((data, index) => (
                          <div className="px-1">
                            <span
                              className="font-size-12 text-start"
                              style={{ whiteSpace: "nowrap" }}
                            >
                              {data?.RoomType}
                            </span>
                            <h6 className="text-center font-size10">
                              {data?.NoOfPax == null ? 0 : data?.NoOfPax}
                            </h6>
                          </div>
                        ))}

                        <div className="col-6 col-md-2">
                          <span className="font-size-12 text-start">Total</span>
                          <h6 className="px-2 font-size10">{totalPax}</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row border-top my-2 pt-2  ">
                    <div className="col-lg-4 border rounded p-0">
                      {/* <div className="border rounded "> */}
                      <table className="table table-bordered rounded">
                        <thead className="table-fixed-head">
                          <tr>
                            {previewData?.TravelDateInfo?.ScheduleType ==
                              "Day Wise" && (
                              <th className="py-1 font-size-12 text-black">
                                DAY
                              </th>
                            )}
                            {previewData?.TravelDateInfo?.ScheduleType ==
                              "Date Wise" && (
                              <th className="py-1 font-size-12 text-black">
                                DATE
                              </th>
                            )}
                            <th className="py-1 font-size-12 text-black">
                              DESTINATION
                            </th>
                            <th className="py-1 font-size-12 text-black">
                              ENROUTE
                            </th>
                            <th className="py-1 font-size-12 text-black">
                              Mode
                            </th>
                          </tr>
                        </thead>
                        <tbody className="">
                          {previewData?.TravelDateInfo?.TravelData?.map(
                            (item, ind) => {
                              return (
                                <tr key={ind}>
                                  {previewData?.TravelDateInfo?.ScheduleType ==
                                    "Day Wise" && (
                                    <th className="py-1 font-size-10">
                                      Day {item?.DayNo}
                                    </th>
                                  )}
                                  {previewData?.TravelDateInfo?.ScheduleType ==
                                    "Date Wise" && (
                                    <td className="py-1 font-size-10">
                                      {" "}
                                      {moment(item?.Date).format("DD-MM-YYYY")}
                                    </td>
                                  )}
                                  <td className="py-1 font-size-10">
                                    {item?.DestinationName}
                                  </td>
                                  <td className="py-1 font-size-10">
                                    {item?.EnrouteName}
                                  </td>
                                  <td className="py-1 font-size-10">
                                    {item?.Mode}
                                    {/* {item?.EnrouteName} */}
                                  </td>
                                </tr>
                              );
                            }
                          )}
                        </tbody>
                      </table>
                      {/* </div> */}
                    </div>
                    <div className="col-lg-8">
                      <div className="row ">
                        <div className="col-lg-6 gap-3 ">
                          <div className="border rounded p-1">
                            <div className="row">
                              <div className="col-4 col-md-4">
                                <span className="font-size-12">Query Type</span>
                                <p className="fw-semibold text-black font-size-10">
                                  {query_type?.join(",")}
                                </p>
                              </div>
                              <div className="col-4 col-md-4">
                                <span className="font-size-12">
                                  Travel Type
                                </span>
                                <p className="fw-semibold text-black font-size-10">
                                  {previewData?.TravelType}
                                </p>
                              </div>
                              <div className="col-4 col-md-4">
                                <span className="font-size-12">Pax Type</span>
                                <p className="fw-semibold text-black font-size-10">
                                  {previewData?.PaxInfo?.PaxTypeName}
                                </p>
                              </div>
                            </div>
                            <div className="row mt-4">
                              <div className="col-3 col-md-3">
                                <span className="font-size-12">Priority</span>
                                <p className="fw-semibold text-black font-size-10">
                                  {previewData?.Prefrences?.Priority}
                                </p>
                              </div>
                              <div className="col-3 col-md-3">
                                <span className="font-size-12">TAT</span>
                                <p className="fw-semibold text-black font-size-10">
                                  {previewData?.TAT}
                                </p>
                              </div>
                              <div className="col-3 col-md-3">
                                <span className="font-size-12">Meal Plan</span>
                                <p className="fw-semibold text-black font-size-10">
                                  {previewData?.MealPlanName}
                                </p>
                              </div>
                              <div className="col-3 col-md-3">
                                <span className="font-size-12">Budget</span>
                                <p className="fw-semibold text-black font-size-10">
                                  {previewData?.Budget}
                                </p>
                              </div>
                            </div>
                            <div className="row mt-4">
                              <div className="col-4 col-md-4">
                                <span className="font-size-12">
                                  Sales Person
                                </span>
                                <p className="fw-semibold text-black font-size-10">
                                  {previewData?.Prefrences?.SalesPersonName}
                                </p>
                              </div>
                              <div className="col-4 col-md-4">
                                <span className="font-size-12">
                                  Contract Person
                                </span>
                                <p className="fw-semibold text-black font-size-10">
                                  {
                                    previewData?.Prefrences
                                      ?.ContractingPersonName
                                  }
                                </p>
                              </div>
                              <div className="col-4 col-md-4">
                                <span className="font-size-12">
                                  Operation Person
                                </span>
                                <p className="fw-semibold text-black font-size-10">
                                  {previewData?.Prefrences?.OperationPersonName}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 gap-3 ">
                          <div className="border rounded p-1">
                            <div className="row">
                              <div className="col-4 col-md-4">
                                <span className="font-size-12">Tour Type</span>
                                <p className="fw-semibold text-black font-size-10">
                                  {previewData?.Prefrences?.TourTypeName}
                                </p>
                              </div>
                              <div className="col-4 col-md-4">
                                <span className="font-size-12">
                                  Hotel Category
                                </span>
                                <p className="fw-semibold text-black font-size-10">
                                  {" "}
                                  {previewData?.Hotel?.HotelCategoryName} *
                                </p>
                              </div>
                              <div className="col-4 col-md-4">
                                <span className="font-size-12">Hotel Type</span>
                                <p className="fw-semibold text-black font-size-10">
                                  {previewData?.Prefrences?.HotelTypeName}
                                </p>
                              </div>
                            </div>
                            <div className="row mt-4">
                              <div className="col-4 col-md-4">
                                <span className="font-size-12">ISO</span>
                                <p className="fw-semibold text-black font-size-10">
                                  {previewData?.Prefrences?.ISOName}
                                </p>
                              </div>
                              <div className="col-4 col-md-4">
                                <span className="font-size-12">Consortia</span>
                                <p className="fw-semibold text-black font-size-10">
                                  {previewData?.ConsortiaName}
                                </p>
                              </div>
                              {/* <div className="col-4 col-md-4">
                                <span className="font-size-12">Language</span>
                                <p className="fw-semibold text-black font-size-10">
                                  {previewData?.LanguageName}
                                </p>
                              </div> */}
                              <div className="col-4 col-md-4">
                                <span className="font-size-12">
                                  {" "}
                                  <i className="fa-solid fa-car"></i> Vehicle
                                </span>
                                <p className="fw-semibold text-black font-size-10">
                                  {" "}
                                  {
                                    previewData?.Prefrences
                                      ?.VehiclePreferenceName
                                  }
                                </p>
                              </div>
                            </div>
                            <div className="row mt-4">
                              {/* <div className="col-4 col-md-4">
                                <span className="font-size-12">
                                  {" "}
                                  <i className="fa-solid fa-car"></i> Vehicle
                                </span>
                                <p className="fw-semibold text-black font-size-10">
                                  {" "}
                                  {
                                    previewData?.Prefrences
                                      ?.VehiclePreferenceName
                                  }
                                </p>
                              </div> */}
                              <div className="col-4 col-md-4">
                                <span className="font-size-12">
                                  Lead Source
                                </span>
                                <p className="fw-semibold text-black font-size-10">
                                  {previewData?.LeadSourceName}
                                </p>
                              </div>
                              <div className="col-4 col-md-4">
                                <span className="font-size-12">
                                  Lead RefrenceId
                                </span>
                                <p className="fw-semibold text-black font-size-10">
                                  {previewData?.Prefrences?.LeadReferencedId}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-end align-items-center gap-2 mb-2">
              {/* <button
                type="button"
                className="btn bg-cancel-preview py-1 font-size-10 rounded-1"
                onClick={() => navigate("/query-list")}
              >
                Cancel
              </button> */}
              <button
                type="button"
                className="btn bg-history-preview py-1 font-size-10 rounded-1"
                onClick={handlEdit}
              >
                Edit
              </button>

              <button
                type="button"
                className="btn edit-query-button-bg  py-1 font-size-10 rounded-1"
                onClick={() => handleFinalSave("send1")}
              >
                Send Acknowledgement
              </button>
              {/* <button
                type="button"
                className="btn bg-cancel-preview py-1 font-size-10 rounded-1"
              >
                Send
              </button> */}
              {/* {hideSendBtn && ( */}
              <button
                type="button"
                className="btn btn-primary py-1 font-size-10 rounded-1 d-flex align-items-center gap-1"
                style={{
                  cursor: loadingBtn ? "no-drop" : "pointer",
                  opacity: loadingBtn ? 0.7 : 1,
                }}
                disabled={loadingBtn}
                onClick={() => handleFinalSave("send")}
              >
                {loadingBtn && (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                )}
                {loadingBtn ? "Submitting..." : "Submit"}
              </button>
              {/* )} */}
              {/* <button
                type="button"
                className="btn edit-query-button-bg py-1 font-size-10 rounded-1"
                onClick={() => handleFinalSave("save")}
              >
                Save
              </button> */}
              {/* {hideSendBtn && (
                <button
                  type="button"
                  className="btn bg-cancel-preview py-1 font-size-10 rounded-1"
                  onClick={() => handleFinalSave("send")}
                >
                  Send
                </button>
              )} */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Preview;
