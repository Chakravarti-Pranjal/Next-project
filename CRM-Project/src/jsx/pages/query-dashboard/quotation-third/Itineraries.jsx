import React, { lazy, useEffect, useState } from "react";
import { Button, Modal, Nav, Tab } from "react-bootstrap";
import AOS from "aos";
import "aos/dist/aos.css";
import { axiosOther } from "../../../../http/axios_base_url.js";
import { notifyError, notifySuccess } from "../../../../helper/notify.jsx";
import { useDispatch, useSelector } from "react-redux";
import { FaBan } from "react-icons/fa";
import { CiCirclePlus } from "react-icons/ci";
import { toast } from "react-toastify";
import {
  resetQoutationData,
  setQoutationData,
  setItineraryHeading,
  setQueryData,
} from "../../../../store/actions/queryAction.js";
import useQueryData from "../../../../hooks/custom_hooks/useQueryData.jsx";
// const HotelTableForm = lazy(() => import("./itinerary-hotel/index.jsx"));
// import MonumentTableForm from "./itinerary-monument/index.jsx";
// import ItineraryHotel from "./itinerary-hotel/index.jsx";
// import ItineraryRestaurant from "./itinerary-restaurant/index.jsx";
// import ItineraryMonument from "./itinerary-monument/index.jsx";
// import ItineraryTransport from "./itinerary-transport/index.jsx";
// import ItineraryGuide from "./itinerary-guide/index.jsx";
// import Flight from "./itinerary-fligh/index.jsx";
// import Trian from "./itinerary-train/index.jsx";
// import Additional from "./itinerary-additionalService/index.jsx";
// import ItineraryActivity from "./itinerary-activity/index.jsx";
// const GuideTableForm = lazy(() => import("./itinerary-guide/index.jsx"));
// const TransportTableForm = lazy(() =>
//   import("./itinerary-transport/index.jsx")
// );
// const ActivityTableForm = lazy(() => import("./itinerary-activity/index.jsx"));
// const RestaurantTableForm = lazy(() =>
//   import("./itinerary-restaurant/index.jsx")
// );
// const TrainTableForm = lazy(() => import("./itinerary-train/index.jsx"));
// const FlightTableForm = lazy(() => import("./itinerary-fligh/index.jsx"));
// const AdditionalTableForm = lazy(() =>
//   import("./itinerary-additionalService/index.jsx")
// );
import { components } from "react-select";
import { hotelItineraryValue } from "./qoutation_initial_value.js";
import DayWise from "./itinerary-dayWise/index.jsx";

const CostSummaryFormTable = lazy(() => import("./cost-summary/index.jsx"));
const TourEscortFormTable = lazy(() =>
  import("./itinerary-tourEscort/index.jsx")
);
const PaxSlabFormTable = lazy(() =>
  import("./itinerary-pax-slabwise/index.jsx")
);
const PaxSlab = lazy(() => import("./pax-slab-tab/index.jsx"));

const checkedArr = [
  "hotel",
  "mealplan",
  "monument",
  "activity",
  "transfer",
  "transfer",
  "guide",
  "monument",
  "guide",
];

const outstationIntial = {
  Destination: "",
  From: "2",
  To: "",
  Transport: "",
  isShowOutstation: true,
};

const Itineraries = ({ onNext }) => {
  const queryData = useQueryData();
  const [transportFormValue, setTransportFormValue] = useState([]);
  const [checkBoxes, setCheckBoxes] = useState(checkedArr);
  const [hotelCategoryList, setHotelCategoryList] = useState([]);
  const [mealPlanList, setMealPlanList] = useState([]);
  const [headerActivityList, setHeaderActivityList] = useState([]);
  const [vehicleList, setVehicleList] = useState([]);
  const { qoutationData, isItineraryEditing, payloadQueryData } = useSelector(
    (data) => data?.queryReducer
  );

  const { monumentFormData } = useSelector((data) => data?.itineraryReducer);
  const [backTenYear, setBackTenYear] = useState([]);
  const [transportList, setTransprotList] = useState([]);
  const [outstationForm, setOutstationForm] = useState([outstationIntial]);
  const dispatch = useDispatch();

  const [quotationFormValue, setQuotationFormValue] = useState({
    QueryId: queryData?.QueryAlphaNumId,
    QuotationNumber: qoutationData?.QuotationNumber,
    HotelCategory: "Single Hotel Category",
    PaxSlabType: "Single Slab",
    HotelMarkupType: "Service Wise Markup",
    HotelStarCategory: [],
    PackageID: "",
  });

  // console.log(quotationFormValue);

  // console.log("quote====", quotationFormValue);

  const queryQuotation = JSON.parse(localStorage.getItem("Query_Qoutation"));
  // console.log(queryQuotation,"queryQuotation")
  const getQoutationList = async () => {
    const payload = {
      QueryId: queryQuotation?.QueryID,
      QuotationNo: queryQuotation?.QoutationNum,
    };
    try {
      const { data } = await axiosOther.post("listqueryquotation", payload);
      if (data?.success) {
        dispatch(setQoutationData(data?.data[0]));
        // console.log(quotatationResponse,"quotatationResponse")
      }
    } catch (e) {
      console.log(e);
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

  // console.log(queryData, "querydata");

  useEffect(() => {
    if (isItineraryEditing) {
      setQuotationFormValue({
        ...quotationFormValue,
        QueryId: queryData?.QueryAlphaNumId,
        QuotationNumber: qoutationData?.QuotationNumber,
        HotelCategory: qoutationData?.Header?.HotelCategory,
        HotelMarkupType: qoutationData?.Header?.HotelMarkupType,
        PaxSlabType: qoutationData?.Header?.PaxSlabType,
        PackageID: qoutationData?.Header?.PackageID,
        HotelStarCategory: qoutationData?.Header?.HotelStarCategories,
      });
    }
  }, [qoutationData, isItineraryEditing]);

  const [headerDropdown, setHeaderDropdown] = useState({
    Hotel: "",
    MealPlan: "",
    MonumentPkg: "",
    Activity: "",
    Transfer: "",
    Guide: "",
    Year: "",
  });

  const postDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("hotelcategorylist");
      setHotelCategoryList(data?.DataList);

      if (data?.DataList?.length > 0) {
        const firstId = queryData?.QueryAllData?.Hotel?.HotelCategory;
        setHeaderDropdown((prev) => ({ ...prev, Hotel: firstId }));
      }
    } catch (error) {
      console.log("error", error);
    }
    try {
      const { data } = await axiosOther.post("hotelmealplanlist");
      setMealPlanList(data?.DataList);
      if (data?.DataList?.length > 0) {
        const firstId = queryData?.QueryAllData?.MealPlan;
        setHeaderDropdown((prev) => ({ ...prev, MealPlan: firstId }));
      }
    } catch (error) {
      console.log("error", error);
    }
    try {
      const { data } = await axiosOther.post("activitymasterlist");
      setHeaderActivityList(data?.DataList);
      if (data?.DataList?.length > 0) {
        const firstId = data?.DataList[0]?.id;
        setHeaderDropdown((prev) => ({ ...prev, Activity: firstId }));
      }
    } catch (error) {
      console.log("error", error);
    }
    try {
      const { data } = await axiosOther.post("vehicletypemasterlist");
      setVehicleList(data?.DataList);
      if (data?.DataList?.length > 0) {
        const firstId = data?.DataList[0]?.id;
        setHeaderDropdown((prev) => ({
          ...prev,
          Transfer:
            queryData?.QueryAllData?.Prefrences?.VehiclePreference || firstId,
        }));
      }
    } catch (error) {
      console.log("error", error);
    }
    // console.log(payloadQueryData, "payloadQueryData");
  };

  useEffect(() => {
    postDataToServer();
  }, []);

  const handleCheckboxes = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setCheckBoxes([...checkBoxes, value]);
    }

    if (!checked) {
      const checkedValues = checkBoxes?.filter(
        (checkValue) => checkValue != value
      );
      setCheckBoxes(checkedValues);
    }
  };

  const handleHeaderDropdown = (e) => {
    const { name, value } = e.target;
    setHeaderDropdown({ ...headerDropdown, [name]: value });
  };

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const handleQuotationFormChange = (e) => {
    const { name, value, checked } = e.target;
    // console.log(value, "value");
    if (checked == undefined) {
      setQuotationFormValue({ ...quotationFormValue, [name]: value });
    }
    if (checked && checked != undefined) {
      setQuotationFormValue({
        ...quotationFormValue,
        HotelStarCategory: [
          ...quotationFormValue?.HotelStarCategory,
          { id: value },
        ],
      });
    }

    if (!checked && checked != undefined) {
      const checkedCategory = quotationFormValue?.HotelStarCategory?.filter(
        (category) => category?.id != value
      );
      setQuotationFormValue({
        ...quotationFormValue,
        HotelStarCategory: checkedCategory,
      });
    }
  };

  const handleQoutationSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axiosOther.post(
        "update-generateQuotation",
        quotationFormValue
      );
      if (data?.status == 1 || data?.Status == 1 || data?.message) {
        // console.log(response);

        setQuotationFormValue({
          ...quotationFormValue,
          QueryId: queryData?.QueryAlphaNumId,
          // Subject: data?.Response?.Header?.Subject,
          HotelCategory: data?.Response?.Header?.HotelCategory,
          PaxSlabType: data?.Response?.Header?.PaxSlabType,
          HotelMarkupType: data?.Response?.Header?.HotelMarkupType,
          HotelStarCategory:
            quotationFormValue?.HotelStarCategory?.length > 0
              ? quotationFormValue?.HotelStarCategory
              : [],
          PackageID: "",
        });
        notifySuccess("Data Updated!");
      } else {
        notifyError(data?.Message || data?.message || data?.error);
      }
    } catch (error) {
      if (error.response?.data?.Errors || error.response?.data?.error) {
        const data = Object.entries(
          error.response?.data?.Errors || error.response?.data?.error
        );
        notifyError(data[0][1]);
      }
    }
  };

  const getTenYearBack = () => {
    const currentYear = new Date().getFullYear();
    const allYear = [];
    for (let i = 0; i < 10; i++) {
      allYear.push(currentYear - i);
    }
    setBackTenYear(allYear);
  };

  useEffect(() => {
    getTenYearBack();
  }, []);

  const getTransportList = async (
    destination = qoutationData?.Days.length > 0 &&
      qoutationData?.Days[0]?.DestinationId,
    FromDay = 1,
    ToDay,
    index
  ) => {
    try {
      const { data } = await axiosOther.post("transportmasterlist", {
        Name: "",
        Status: "",
        id: "",
        DestinationId: [
          destination != ""
            ? parseInt(destination)
            : qoutationData?.Days[0]?.DestinationId,
        ],
        Default: "",
        TransferType: "",
        NoOfDays: ToDay - FromDay,
      });

      setOutstationForm((prevForm) => {
        const newForm = [...prevForm];
        newForm[index] = {
          ...newForm[index],
          Transport: data?.DataList?.length > 0 ? data?.DataList[0]?.id : "",
        };
        return newForm;
      });

      setTransprotList((prevList) => {
        const newArr = [...prevList];
        newArr[index] = data?.DataList;
        return newArr;
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    outstationForm?.forEach((form, index) => {
      console.log(form, "11111");
      
      getTransportList(form?.Destination, form?.From, form?.To, index);
    });
  }, [
    outstationForm?.map((form) => form?.Destination).join(","),
    outstationForm?.map((form) => form?.From).join(","),
    outstationForm?.map((form) => form?.To).join(","),
  ]);

  const handleOutstationChange = (e, index) => {
    const { name, value, type, checked } = e.target;

    if (type != "checkbox") {
      setOutstationForm((prevArr) => {
        const newArr = [...prevArr];
        newArr[index] = { ...newArr[index], [name]: value };
        return newArr;
      });
    }
    if (type == "checkbox" && checked) {
      setOutstationForm((prevArr) => {
        const newArr = [...prevArr];
        newArr[index] = { ...newArr[index], isShowOutstation: true };
        return newArr;
      });
    }

    if (type == "checkbox" && !checked) {
      setOutstationForm((prevArr) => {
        const newArr = [...prevArr];
        newArr[index] = { ...newArr[index], isShowOutstation: false };
        return newArr;
      });
    }
  };

  const handleOutstationIncrement = (index) => {
    const outstationOne = outstationForm[index];
    setOutstationForm([...outstationForm, outstationOne]);
  };

  const handleOutstationDecrement = (index) => {
    const stationForm = [...outstationForm];
    const filteredForm = stationForm?.filter((form, ind) => ind != index);
    setOutstationForm(filteredForm);
  };

  useEffect(() => {
    const firstDestination = qoutationData?.Days
      ? qoutationData?.Days[0]?.DestinationId
      : "";
    const toDays = qoutationData?.Days?.length;
    setOutstationForm((prevForm) => {
      const newForm = [...prevForm];
      newForm[0] = {
        ...prevForm[0],
        Destination: firstDestination,
        To: toDays,
      };
      return newForm;
    });
  }, [qoutationData, queryData]);

  useEffect(() => {
    const name = vehicleList?.find(
      (trans) => trans?.id == headerDropdown?.Transfer
    );
    dispatch(
      setItineraryHeading({
        ...headerDropdown,
        TransferName: name?.VehicleTypeName,
      })
    );
  }, [headerDropdown, transportList]);
  // console.log(qoutationData,"qoutation")

  const [showModal, setShowModal] = useState(false);
  const [tabsByQueryId, setTabsByQueryId] = useState({});
  const [activeTab, setActiveTab] = useState("main-itinerary");
  const [selectedOption, setSelectedOption] = useState("Option-A");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [tabData, setTabData] = useState({});
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // console.log("act", activeTab);
  // http://127.0.0.1:8000/api/multipleQuotation

  const handleAddTab = () => {
    const currentQueryId = quotationFormValue.QueryId;
    // console.log(currentQueryId);

    if (!currentQueryId) {
      notifyError("No QueryId found");
      return;
    }

    const existingTab = tabsByQueryId[currentQueryId]?.find(
      (tab) => tab.name === selectedOption
    );

    if (existingTab) {
      notifyError("Tab already exists");
      return;
    }

    if (existingTab) {
      setActiveTab(existingTab.key);
    } else {
      const newTab = {
        key: `tab-${Date.now()}`,
        name: selectedOption,
        queryId: currentQueryId,
      };

      setTabsByQueryId((prevTabs) => {
        const updatedTabs = { ...prevTabs };
        if (!updatedTabs[currentQueryId]) {
          updatedTabs[currentQueryId] = [];
        }
        updatedTabs[currentQueryId].push(newTab);
        return updatedTabs;
      });
      setActiveTab(newTab.key);
    }
    FetchQuotationOption({
      OptionName: selectedOption,
      QueryId: currentQueryId,
    });
    notifySuccess("Added Successfully");
    setSelectedOption("");
    setShowModal(false);
  };

  useEffect(() => {
    const savedTabs = localStorage.getItem("tabsByQueryId");
    const savedActiveTab = localStorage.getItem("activeTab");

    if (savedTabs) {
      setTabsByQueryId(JSON.parse(savedTabs));
    }
    if (savedActiveTab) {
      setActiveTab(savedActiveTab);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tabsByQueryId", JSON.stringify(tabsByQueryId));
  }, [tabsByQueryId]);

  // Select Option
  // const OptionData = [
  //   {id:1, name:"option 1",value:"option1"},
  //   {id:2, name:"option 2",value:"option2"},
  //   {id:1, name:"option 3",value:"option3"},
  // ]

  // Fetch Quotation Options

  // useEffect(() => {
  //   const FetchQuotationOption = async (data) => {
  //     const QuotationNo = JSON.parse(
  //       localStorage.getItem("Query_Qoutation")
  //     )?.QoutationNum;
  //     const QueryId = JSON.parse(
  //       localStorage.getItem("Query_Qoutation")
  //     )?.QueryID;
  //     const payload = {
  //       // QueryId: QueryId,
  //       QuotationNo: QuotationNo,
  //       // OptionName: selectedOption,
  //       OptionName: data?.selectedOption,
  //       QueryId: data?.currentQueryId,
  //     };
  //     try {
  //       const { data } = await axiosOther.post("multipleQuotation", payload);
  //       console.log("Option.....,,,", data, payload);
  //     } catch (error) {
  //       console.log("error", error);
  //     }
  //   };
  //   // FetchQuotationOption();
  // }, []);

  const FetchQuotationOption = async (data) => {
    // console.log(data);
    const QuotationNo = JSON.parse(
      localStorage.getItem("Query_Qoutation")
    )?.QoutationNum;
    const QueryId = JSON.parse(
      localStorage.getItem("Query_Qoutation")
    )?.QueryID;
    const payload = {
      // QueryId: QueryId,
      QuatationNo: QuotationNo,
      // OptionName: selectedOption,
      OptionName: data?.OptionName,
      QueryId: data?.QueryId,
    };
    try {
      const { data } = await axiosOther.post("multipleQuotation", payload);
      // console.log("Option.....,,,", data, payload);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getQoutationList();
    getqueryData();
  }, [isItineraryEditing && headerDropdown]);
  return (
    <>
      <Tab.Container defaultActiveKey={activeTab}>
        <Nav as="ul" className="nav-pills light d-flex">
          <div className="d-flex align-items-center justify-content-between nav-container gap-2">
            {/* Main Itinerary */}
            <Nav.Item
              as="li"
              onClick={() => toast.dismiss()}
              className="flex-item m-0"
            >
              <Nav.Link
                eventKey={"main-itinerary"}
                className="query-options-tab d-flex justify-content-center align-items-center fontSize10px p-1"
                style={{
                  color: "white",
                  backgroundColor: "transparent",
                }}
              >
                Main Itinerary
                <span
                  style={{
                    content: '""',
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: "2px",
                    transform: "scaleX(0)",
                    transition: "transform 0.3s ease",
                    transformOrigin: "bottom right",
                  }}
                  className="hover-line"
                />
              </Nav.Link>
            </Nav.Item>

            {/* Plus Icon Button */}
            <button
              type="button"
              onClick={handleOpenModal}
              className="flex-item p-0 m-0 border-0 bg-transparent"
              title="Hotel Option"
            >
              <CiCirclePlus size={18} color="red" />
            </button>

            {/* Dynamic Tabs */}
            {tabsByQueryId[quotationFormValue.QueryId]?.map((tab, index) => (
              <Nav.Item key={index} className="flex-item p-0 mt-0 fontSize8px">
                <Nav.Link
                  eventKey={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className="query-options-tab p-1 m-0 d-flex justify-content-center align-items-center fontSize10px"
                  style={{
                    color: activeTab === tab.key ? "white" : "white",
                    backgroundColor:
                      activeTab === tab.key ? "transparent" : "transparent",
                  }}
                >
                  {tab.name}
                  <span
                    style={{
                      content: '""',
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: 0,
                      height: "2px",
                      transform: "scaleX(0)",
                      transition: "transform 0.3s ease",
                      transformOrigin: "bottom right",
                    }}
                    className="hover-line"
                  />
                </Nav.Link>
              </Nav.Item>
            ))}

            {/* Escorts Tabs */}
            {checkBoxes?.includes("escorts") && (
              <>
                <Nav.Item
                  as="li"
                  data-aos="zoom-in"
                  className="flex-item p-2 m-0"
                >
                  <Nav.Link
                    eventKey={"local"}
                    className="query-options-tab p-1 m-0 d-flex justify-content-center align-items-center fontSize10px"
                    style={{
                      color: "white",
                      backgroundColor: "transparent",
                    }}
                  >
                    Local
                    <span
                      style={{
                        content: '""',
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: "5px",
                        height: "2px",
                        transform: "scaleX(0)",
                        transition: "transform 0.3s ease",
                        transformOrigin: "bottom right",
                      }}
                      className="hover-line"
                    />
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item
                  as="li"
                  data-aos="zoom-in"
                  className="flex-item p-0 m-0"
                >
                  <Nav.Link
                    eventKey={"foreigner"}
                    className="query-options-tab p-1 m-0 d-flex justify-content-center align-items-center fontSize10px"
                    style={{
                      color: "white",
                      backgroundColor: "transparent",
                    }}
                  >
                    Foreigner
                    <span
                      style={{
                        content: '""',
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: "2px",
                        transform: "scaleX(0)",
                        transition: "transform 0.3s ease",
                        transformOrigin: "bottom right",
                      }}
                      className="hover-line"
                    />
                  </Nav.Link>
                </Nav.Item>
              </>
            )}
          </div>

          <div className="d-flex ms-auto">
            <Nav.Item as="li" className="my-auto ms-2">
              <select
                name="HotelCategory"
                id=""
                className={`formControl2`}
                value={quotationFormValue?.HotelCategory}
                onChange={handleQuotationFormChange}
              >
                <option value="Single Hotel Category">
                  Single Hotel Category
                </option>
                <option value="Multiple Hotel Category">
                  Multiple Hotel Category
                </option>
              </select>
            </Nav.Item>
            {quotationFormValue?.HotelCategory == "Multiple Hotel Category" && (
              <Nav.Item as="li" className="my-auto ms-2">
                <div
                  className="d-flex align-items-center gap-2 flex-wrap border px-1"
                  style={{ height: "20px", borderRadius: "2px" }}
                >
                  {hotelCategoryList?.map((category, index) => {
                    return (
                      <div
                        className="form-check check-sm d-flex align-items-center"
                        key={index}
                      >
                        <input
                          type="checkbox"
                          className="form-check-input height-em-1 width-em-1"
                          id={`star${index}`}
                          value={category?.id}
                          onChange={handleQuotationFormChange}
                        />
                        <label
                          htmlFor={`star${index}`}
                          className="form-check-label"
                        >
                          {category?.UploadKeyword}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </Nav.Item>
            )}
            <Nav.Item as="li" className="my-auto ms-2">
              <select
                name="PaxSlabType"
                id=""
                className={`formControl2`}
                value={quotationFormValue?.PaxSlabType}
                onChange={handleQuotationFormChange}
              >
                <option value="Single Slab">Single Slab</option>
                <option value="Multiple Slab">Multiple Slab</option>
              </select>
            </Nav.Item>
            <Nav.Item as="li" className="my-auto ms-2">
              <select
                name="HotelMarkupType"
                id=""
                className={`formControl2`}
                value={quotationFormValue?.HotelMarkupType}
                onChange={handleQuotationFormChange}
              >
                <option value="Service wise Markeup">
                  Service Wise Markup
                </option>
                <option value="Hotel wise Markeup">Hotel Wise Markup</option>
              </select>
            </Nav.Item>
            <Nav.Item as="li" className="my-auto ms-2">
              <select
                name="PackageID"
                id=""
                className={`formControl2`}
                value={quotationFormValue?.PackageID}
                onChange={handleQuotationFormChange}
              >
                <option value=""> Select Inbuilt Packages</option>
              </select>
            </Nav.Item>
            <Nav.Item as="li" className="my-auto ms-2">
              <button
                className="qoutation-button"
                onClick={handleQoutationSubmit}
              >
                Submit
              </button>
            </Nav.Item>
          </div>
        </Nav>
        <Tab.Content className="">
          <Tab.Pane eventKey="main-itinerary" className="pb-5">
            {/* top header row */}
            <div className="row borderBottom m-0">
              <div className="col-8 height40px ps-0">
                <div className=" d-flex align-items-center gap-2 h-100 ">
                  {new Array(4).fill(null).map((_, index) => {
                    return (
                      <span
                        className="borderPrimary package-style p-1 rounded3px colorPrimary fontSize8px truncateTextOneLine cursor-pointer"
                        kye={index}
                      >
                        2N Dubai, 3D Abu Dhabi
                      </span>
                    );
                  })}
                </div>
              </div>
              <div className="col-4 ps-0 height40px d-flex align-items-center justify-content-end gap-2 pe-0">
                <div className=" position-relative">
                  <input
                    type="text"
                    placeholder="Search Itinerary Template"
                    className="height30px SearchInput borderRadius15px"
                  />
                  <i className="fa-solid fa-magnifying-glass position-absolute searchIconPosition"></i>
                </div>
                <button className="height30px borderRadius15px fontSize11px width75px colorPrimary borderPrimary SearchButton">
                  Search
                </button>
              </div>
            </div>
            {/* header section all top dropdowns */}
            <div className="row py-2 shadow m-0 custom-row-gap">
              <div className="col-12 d-flex gap-4 flex-wrap form-row-gap px-1">
                <div className="d-flex gap-1 align-items-center">
                  <div className="form-check check-sm d-flex align-items-center">
                    <input
                      type="checkbox"
                      className="form-check-input height-em-1 width-em-1"
                      id="hotel"
                      value="hotel"
                      checked={checkBoxes?.includes("hotel")}
                      onChange={handleCheckboxes}
                    />
                    <label
                      className="fontSize11px m-0 ms-1 mt-1"
                      htmlFor="hotel"
                    >
                      Hotel
                    </label>
                  </div>
                  {checkBoxes?.includes("hotel") && (
                    <div data-aos="zoom-in">
                      <select
                        name="Hotel"
                        id=""
                        className="formControl1"
                        value={headerDropdown?.Hotel}
                        onChange={handleHeaderDropdown}
                      >
                        {hotelCategoryList?.map((category, index) => {
                          return (
                            <option value={category?.id} key={index + "a"}>
                              {category?.UploadKeyword}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  )}
                </div>
                <div className="d-flex gap-1 align-items-center">
                  <div className="form-check check-sm d-flex align-items-center">
                    <input
                      type="checkbox"
                      className="form-check-input height-em-1 width-em-1"
                      id="mealplan"
                      checked={checkBoxes?.includes("mealplan")}
                      value="mealplan"
                      onChange={handleCheckboxes}
                    />
                    <label
                      className="fontSize11px m-0 ms-1 mt-1"
                      htmlFor="mealplan"
                    >
                      Meal Plan
                    </label>
                  </div>
                  {checkBoxes?.includes("mealplan") && (
                    <div data-aos="zoom-in">
                      <select
                        name="MealPlan"
                        className="formControl1"
                        value={headerDropdown?.MealPlan}
                        onChange={handleHeaderDropdown}
                      >
                        {mealPlanList?.map((meal, index) => {
                          return (
                            <option value={meal?.id} key={index + "b"}>
                              {meal?.Name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  )}
                </div>
                <div className="d-flex gap-1 align-items-center">
                  <div className="form-check check-sm d-flex align-items-center">
                    <input
                      type="checkbox"
                      className="form-check-input height-em-1 width-em-1"
                      id="activities"
                      value="activity"
                      checked={checkBoxes?.includes("activity")}
                      onChange={handleCheckboxes}
                    />
                    <label
                      className="fontSize11px m-0 ms-1 nt-1"
                      htmlFor="activities"
                    >
                      Activity
                    </label>
                  </div>
                </div>
                <div className="d-flex gap-1 align-items-center">
                  <div className="form-check check-sm d-flex align-items-center">
                    <input
                      type="checkbox"
                      className="form-check-input height-em-1 width-em-1"
                      id="monuments"
                      value="monument"
                      checked={checkBoxes?.includes("monument")}
                      onChange={handleCheckboxes}
                    />
                    <label
                      className="fontSize11px m-0 ms-1 mt-1"
                      htmlFor="monuments"
                    >
                      Monument
                    </label>
                  </div>
                </div>
                <div className="d-flex gap-1 align-items-center">
                  <div className="form-check check-sm d-flex align-items-center">
                    <input
                      type="checkbox"
                      className="form-check-input height-em-1 width-em-1"
                      id="transfer"
                      value="transfer"
                      checked={checkBoxes?.includes("transfer")}
                      onChange={handleCheckboxes}
                    />
                    <label
                      className="fontSize11px m-0 ms-1 mt-1"
                      htmlFor="transfer"
                    >
                      Transfer
                    </label>
                  </div>
                  {checkBoxes?.includes("transfer") && (
                    <div data-aos="zoom-in">
                      <select
                        name="Transfer"
                        id=""
                        className="formControl1"
                        value={headerDropdown?.Transfer}
                        onChange={handleHeaderDropdown}
                      >
                        {vehicleList?.map((vehicle, index) => {
                          return (
                            <option value={vehicle?.id} key={index + "d"}>
                              {vehicle?.Name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  )}
                </div>
                <div className="d-flex gap-1 align-items-center">
                  <div className="form-check check-sm d-flex align-items-center">
                    <input
                      type="checkbox"
                      className="form-check-input height-em-1 width-em-1"
                      id="guide"
                      value="guide"
                      checked={checkBoxes?.includes("guide")}
                      onChange={handleCheckboxes}
                    />
                    <label
                      className="fontSize11px m-0 ms-1 mt-1"
                      htmlFor="guide"
                    >
                      Guide
                    </label>
                  </div>
                </div>
                <div className="d-flex gap-1 align-items-center">
                  <div className="form-check check-sm d-flex align-items-center">
                    <input
                      type="checkbox"
                      className="form-check-input height-em-1 width-em-1"
                      id="escorts"
                      value="escorts"
                      checked={checkBoxes?.includes("escorts")}
                      onChange={handleCheckboxes}
                    />
                    <label
                      className="fontSize11px m-0 ms-1 mt-1"
                      htmlFor="escorts"
                    >
                      Escorts
                    </label>
                  </div>
                </div>
                <div className="d-flex gap-1 align-items-center">
                  <div>
                    <select
                      name="Year"
                      className="formControl1"
                      value={headerDropdown?.Year}
                      onChange={handleHeaderDropdown}
                    >
                      {backTenYear?.map((year, index) => {
                        return (
                          <option value={year} key={index + 1}>
                            {year}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>
              <span className="border"></span>
              <div className="col-12 d-flex flex-column gap-2 align-items-start">
                {outstationForm?.map((form, index) => {
                  return (
                    <div
                      className={`d-flex gap-2 customStyle_Outstation ${
                        index == 0 && "pe-4"
                      }`}
                      style={{
                        backgroundColor: "#2E2E40",
                        padding: "0.5em",
                        borderRadius: "0.2em",
                      }}
                      key={index + 1}
                    >
                      <div className="form-check check-sm d-flex gap-2 align-items-center">
                        <input
                          type="checkbox"
                          className="form-check-input height-em-1 width-em-1"
                          id={`outstation${index}`}
                          name="isShowOutstation"
                          onChange={(e) => handleOutstationChange(e, index)}
                          checked={outstationForm[index]?.isShowOutstation}
                        />
                        <label
                          className="fontSize11px m-0 p-0 mt-1"
                          htmlFor={`outstation${index}`}
                        >
                          Outstation
                        </label>
                      </div>
                      {outstationForm[index]?.isShowOutstation && (
                        <>
                          <div className="d-flex gap-1 align-items-center mt-1">
                            <label
                              className="fontSize11px m-0 ms-1"
                              htmlFor="outstation-destination"
                              data-aos="zoom-in"
                            >
                              Destination
                            </label>
                            <select
                              name="Destination"
                              id="outstation-destination"
                              className="formControl1"
                              value={outstationForm[index]?.Destination}
                              onChange={(e) => handleOutstationChange(e, index)}
                              data-aos="zoom-in"
                            >
                              {qoutationData?.Days?.map((day, index) => {
                                return (
                                  <option
                                    value={day?.DestinationId}
                                    key={index}
                                  >
                                    {day?.DestinationName}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                          <div className="d-flex gap-1 align-items-center mt-1">
                            <label
                              className="fontSize11px m-0 "
                              htmlFor="outstation-from"
                              data-aos="zoom-in"
                            >
                              From
                            </label>
                            <select
                              name="From"
                              className="formControl1"
                              id="outstation-from"
                              style={{ width: "70px" }}
                              value={outstationForm[index]?.From}
                              onChange={(e) => handleOutstationChange(e, index)}
                              data-aos="zoom-in"
                            >
                              {[
                                ...new Set(
                                  qoutationData?.Days?.map((day) => day?.Day)
                                ),
                              ].map((uniqueDay, index) => {
                                return (
                                  <option value={uniqueDay} key={index}>
                                    Day {uniqueDay}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                          <div className="d-flex gap-1 align-items-center mt-1">
                            <label
                              className="fontSize11px"
                              htmlFor="outstation-to"
                              data-aos="zoom-in"
                            >
                              To
                            </label>
                            <select
                              name="To"
                              className="formControl1"
                              id="outstation-to"
                              style={{ width: "70px" }}
                              value={outstationForm[index]?.To}
                              onChange={(e) => handleOutstationChange(e, index)}
                              data-aos="zoom-in"
                            >
                              {[
                                ...new Set(
                                  qoutationData?.Days?.map((day) => day?.Day)
                                ),
                              ].map((uniqueDay, index) => {
                                return (
                                  <option value={uniqueDay} key={index}>
                                    Day {uniqueDay}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                          <div className="d-flex gap-1 align-items-center mt-1">
                            <label
                              className="fontSize11px"
                              htmlFor="outstation-transoprt"
                              data-aos="zoom-in"
                            >
                              Transport
                            </label>
                            <select
                              name="Transport"
                              className="formControl1"
                              value={outstationForm[index]?.Transport}
                              onChange={(e) => handleOutstationChange(e, index)}
                              style={{ minWidth: "110px" }}
                              data-aos="zoom-in"
                              id="outstation-transoprt"
                            >
                              {transportList[index]?.map((transport, index) => {
                                console.log(transport, "transport");
                                
                                return (
                                  <option value={transport?.id} key={index}>
                                    {transport?.Name}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                          <div className="d-flex gap-1 mt-1">
                            <span
                              onClick={() => handleOutstationIncrement(index)}
                            >
                              <i className="la la-plus border cursor-pointer bg-success text-white rounded-pill fontSize10px padding1px"></i>
                            </span>

                            {index > 0 && (
                              <span
                                onClick={() => handleOutstationDecrement(index)}
                                ariaDisabled={index > 0 ? true : false}
                              >
                                <i className="la la-minus  border cursor-pointer bg-primary text-white rounded-pill fontSize10px padding1px"></i>
                              </span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Manish Work start  */}
            <div className="accodian-dayWise">
              <DayWise />
            </div>
            {/* Manish Work end  */}

            {/* hotel table form  */}
            {/* <HotelTableForm headerDropdown={headerDropdown} Type="Main" /> */}
            {/* monument form table */}
            {/* <MonumentTableForm
              Type="Main"
              headerDropdown={headerDropdown}
              checkBoxes={checkBoxes}
            /> */}
            {/* guide form table */}
            {/* <GuideTableForm
              Type="Main"
              headerDropdown={headerDropdown}
              checkBoxes={checkBoxes}
            /> */}
            {/* transport form table */}
            {/* <TransportTableForm
              Type="Main"
              headerDropdown={headerDropdown}
              outstation={outstationForm}
              transportFormValue={transportFormValue}
              setTransportFormValue={setTransportFormValue}
            /> */}
            {/* Activity form table */}
            {/* <ActivityTableForm
              headerDropdown={headerDropdown}
              Type="Main"
              checkBoxes={checkBoxes}
            /> */}
            {/* Restaurant form table */}
            {/* <RestaurantTableForm Type="Main" headerDropdown={headerDropdown} /> */}
            {/* train form table */}
            {/* <TrainTableForm
              Type="Main"
              headerDropdown={headerDropdown}
              transportFormValue={transportFormValue}
            /> */}
            {/* flight form table */}
            {/* <FlightTableForm
              Type="Main"
              headerDropdown={headerDropdown}
              transportFormValue={transportFormValue}
            /> */}
            {/* additional form table */}
            {/* <AdditionalTableForm Type="Main" headerDropdown={headerDropdown} /> */}
            {/* local escort form table */}
            {/* <CostSummaryFormTable Type="Main" /> */}
            <div className="row mt-3">
              <div className="col-12 d-flex justify-content-end align-items-end">
                <button
                  className="btn btn-primary btn-custom-size"
                  name="SaveButton"
                  onClick={onNext}
                >
                  <span className="me-1">Next</span>
                  <i className="fa-solid fa-forward text-primary bg-white p-1 rounded"></i>
                </button>
              </div>
            </div>
          </Tab.Pane>
          {/* <Tab.Pane eventKey="pax-slab" className="pb-5">
          <PaxSlab paxSlab={quotationFormValue} />
        </Tab.Pane> */}
          {checkBoxes?.includes("escorts") && (
            <>
              <Tab.Pane eventKey="local">
                {/* hotel table form  */}
                <HotelTableForm headerDropdown={headerDropdown} Type="Local" />
                {/* monument table form */}
                <MonumentTableForm
                  Type="Local"
                  formData={monumentFormData}
                  checkBoxes={checkBoxes}
                />
                {/* guide form table */}
                <GuideTableForm
                  Type="Local"
                  checkBoxes={checkBoxes}
                  headerDropdown={headerDropdown}
                />
                {/* transport form table */}
                <TransportTableForm
                  Type="Local"
                  outstation={outstationForm}
                  headerDropdown={headerDropdown}
                  transportFormValue={transportFormValue}
                  setTransportFormValue={setTransportFormValue}
                />
                {/* Activity form table */}
                <ActivityTableForm
                  headerDropdown={headerDropdown}
                  Type="Local"
                  checkBoxes={checkBoxes}
                />
                {/* Restaurant form table */}
                <RestaurantTableForm
                  Type="Local"
                  headerDropdown={headerDropdown}
                />
                {/* train form table */}
                <TrainTableForm
                  Type="Local"
                  headerDropdown={headerDropdown}
                  transportFormValue={transportFormValue}
                />
                {/* flight form table */}
                <FlightTableForm
                  Type="Local"
                  headerDropdown={headerDropdown}
                  transportFormValue={transportFormValue}
                />
                {/* additional form table */}
                <AdditionalTableForm
                  Type="Local"
                  headerDropdown={headerDropdown}
                />
                {/* tour escort form table */}
                <TourEscortFormTable
                  Type="Local"
                  headerDropdown={headerDropdown}
                />
                {/* Pax Slab form table*/}
                <PaxSlabFormTable
                  Type="Local"
                  headerDropdown={headerDropdown}
                />
                {/* local escort form table */}
                <CostSummaryFormTable
                  Type="Local"
                  headerDropdown={headerDropdown}
                />
                <div className="row mt-3">
                  <div className="col-12 d-flex justify-content-end align-items-end">
                    <button
                      className="btn btn-primary py-1 px-2 radius-4"
                      // onClick={handleFinalSave}
                    >
                      {/* <i className="fa-solid fa-floppy-disk fs-4"></i> */}
                      Next
                    </button>
                  </div>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="foreigner">
                {/* hotel table form  */}
                <HotelTableForm
                  headerDropdown={headerDropdown}
                  Type="Foreigner"
                />
                {/* monument form table */}
                <MonumentTableForm
                  Type="Foreigner"
                  formData={monumentFormData}
                  checkBoxes={checkBoxes}
                  headerDropdown={headerDropdown}
                />
                {/* guide form table */}
                <GuideTableForm
                  Type="Foreigner"
                  checkBoxes={checkBoxes}
                  headerDropdown={headerDropdown}
                />
                {/* transport form table */}
                <TransportTableForm
                  Type="Foreigner"
                  outstation={outstationForm}
                  headerDropdown={headerDropdown}
                  transportFormValue={transportFormValue}
                  setTransportFormValue={setTransportFormValue}
                />
                {/* Activity form table */}
                <ActivityTableForm
                  headerDropdown={headerDropdown}
                  Type="Foreigner"
                  checkBoxes={checkBoxes}
                />
                {/* Restaurant form table */}
                <RestaurantTableForm
                  Type="Foreigner"
                  headerDropdown={headerDropdown}
                />
                {/* train form table */}
                <TrainTableForm
                  Type="Foreigner"
                  headerDropdown={headerDropdown}
                  transportFormValue={transportFormValue}
                />
                {/* flight form table */}
                <FlightTableForm
                  Type="Foreigner"
                  headerDropdown={headerDropdown}
                  transportFormValue={transportFormValue}
                />
                <AdditionalTableForm Type="Foreigner" />
                {/* Pax Slab form table*/}
                <PaxSlabFormTable
                  Type="Foreigner"
                  headerDropdown={headerDropdown}
                />
                {/* local escort form table */}
                <CostSummaryFormTable
                  Type="Foreigner"
                  headerDropdown={headerDropdown}
                />
                <div className="row mt-3">
                  <div className="col-12 d-flex justify-content-end align-items-end">
                    <button className="btn btn-primary py-1 px-2 radius-4">
                      Next
                    </button>
                  </div>
                </div>
              </Tab.Pane>
            </>
          )}
        </Tab.Content>
        {/* Options Tab */}
        <Tab.Content>
          {tabsByQueryId[quotationFormValue.QueryId]?.map((tab, index) => (
            <Tab.Pane eventKey={tab.key} key={index}>
              <HotelTableForm headerDropdown={headerDropdown} />
              {/* monument form table */}
              <MonumentTableForm
                formData={monumentFormData}
                checkBoxes={checkBoxes}
                headerDropdown={headerDropdown}
              />
              {/* guide form table */}
              <GuideTableForm
                checkBoxes={checkBoxes}
                headerDropdown={headerDropdown}
              />
              {/* transport form table */}
              <TransportTableForm
                outstation={outstationForm}
                headerDropdown={headerDropdown}
                transportFormValue={transportFormValue}
                setTransportFormValue={setTransportFormValue}
              />
              {/* Activity form table */}
              <ActivityTableForm
                headerDropdown={headerDropdown}
                checkBoxes={checkBoxes}
              />
              {/* Restaurant form table */}
              <RestaurantTableForm headerDropdown={headerDropdown} />
              {/* train form table */}
              <TrainTableForm
                headerDropdown={headerDropdown}
                transportFormValue={transportFormValue}
              />
              {/* flight form table */}
              <FlightTableForm
                headerDropdown={headerDropdown}
                transportFormValue={transportFormValue}
              />
              <AdditionalTableForm />
            </Tab.Pane>
          ))}
        </Tab.Content>
      </Tab.Container>
      {/* Modal for option */}
      <Modal show={showModal} onHide={handleCloseModal} top>
        <Modal.Header closeButton>
          <Modal.Title>Add New Hotels</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Option Hotels"
            defaultValue={selectedOption}
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn-danger btn py-1 px-3 rounded-1"
            onClick={handleAddTab}
          >
            Save
          </button>
          <button
            className="btn-danger btn py-1 px-3 rounded-1"
            onClick={handleCloseModal}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Itineraries;
