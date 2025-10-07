import React, { lazy, useEffect, useState } from "react";
import { Button, Modal, Nav, Tab } from "react-bootstrap";
import AOS from "aos";
import "aos/dist/aos.css";
import { axiosOther } from "../../../../http/axios_base_url.js";
import {
  notifyError,
  notifyHotError,
  notifyHotSuccess,
  notifySuccess,
} from "../../../../helper/notify.jsx";
import { useDispatch, useSelector } from "react-redux";
const OptionHotelTab = lazy(() => import("./options-tabs/option-hotel.jsx"));
const OptionMounumentTab = lazy(() =>
  import("./options-tabs/option-monument.jsx")
);
const OptionRestaurantTab = lazy(() =>
  import("./options-tabs/option-restaurant.jsx")
);
const OptionTrainTab = lazy(() => import("./options-tabs/option-train.jsx"));
const OptionFlightTab = lazy(() => import("./options-tabs/option-flight.jsx"));
const OptionActivityTab = lazy(() =>
  import("./options-tabs/option-activity.jsx")
);
const OptionGuideTab = lazy(() => import("./options-tabs/option-guide.jsx"));
const OptionTransportTab = lazy(() =>
  import("./options-tabs/option-transport.jsx")
);
const OptionAdditionalServiceTab = lazy(() =>
  import("./options-tabs/option-additionalService.jsx")
);
import { FaBan } from "react-icons/fa";
const HotelTableForm = lazy(() => import("./itinerary-hotel/index.jsx"));
const MonumentTableForm = lazy(() => import("./itinerary-monument/index.jsx"));

import { CiCirclePlus } from "react-icons/ci";
import { toast } from "react-toastify";
import {
  resetQoutationData,
  setQoutationData,
  setItineraryHeading,
  setQueryData,
  setQoutationResponseData,
} from "../../../../store/actions/queryAction.js";
import useQueryData from "../../../../hooks/custom_hooks/useQueryData.jsx";
import ItineraryHotel from "./itinerary-hotel/index.jsx";
import ItineraryRestaurant from "./itinerary-restaurant/index.jsx";
import ItineraryMonument from "./itinerary-monument/index.jsx";
import ItineraryTransport from "./itinerary-transport/index.jsx";
import ItineraryGuide from "./itinerary-guide/index.jsx";
import Flight from "./itinerary-fligh/index.jsx";
import Trian from "./itinerary-train/index.jsx";
import Additional from "./itinerary-additionalService/index.jsx";
import ItineraryActivity from "./itinerary-activity/index.jsx";
import { components } from "react-select";
import { hotelItineraryValue } from "./qoutation_initial_value.js";
import { MdCancel } from "react-icons/md";
import { use } from "react";
// import ForeignerTransport from './foreignerEscortService/foreigner-transport/ForeignerTransport.jsx'
import ForeignerHotelForm from "./foreignerEscortService/ForeignerHotelForm.jsx";
import ForeignerMonument from "./foreignerEscortService/ForeignerMonument.jsx";
import ForeignerActivity from "./foreignerEscortService/ForeignerActivity.jsx";
import ForeignerResturant from "./foreignerEscortService/ForeignerResturant.jsx";
import ForeignerTrain from "./foreignerEscortService/foreigner-train/ForeignerTrain.jsx";
import ForeignerFlight from "./foreignerEscortService/ForeignerFlight.jsx";
import ForeignerAdditionalServices from "./foreignerEscortService/foreigner-additional-services/ForeignerAdditionalServices.jsx";
import ForeignerTransport from "./foreignerEscortService/ForeignerTransport.jsx";
// import ForeignerTransport from "./foreignerEscortService/ForeignerTransport.jsx";
const GuideTableForm = lazy(() => import("./itinerary-guide/index.jsx"));
const TransportTableForm = lazy(() =>
  import("./itinerary-transport/index.jsx")
);
const ActivityTableForm = lazy(() => import("./itinerary-activity/index.jsx"));
const RestaurantTableForm = lazy(() =>
  import("./itinerary-restaurant/index.jsx")
);
const TrainTableForm = lazy(() => import("./itinerary-train/index.jsx"));
const FlightTableForm = lazy(() => import("./itinerary-fligh/index.jsx"));
const AdditionalTableForm = lazy(() =>
  import("./itinerary-additionalService/index.jsx")
);
const CostSummaryFormTable = lazy(() => import("./cost-summary/index.jsx"));
const TourEscortFormTable = lazy(() =>
  import("./itinerary-tourEscort/index.jsx")
);
const PaxSlabFormTable = lazy(() =>
  import("./itinerary-pax-slabwise/index.jsx")
);
const PaxSlab = lazy(() => import("./pax-slab-tab/index.jsx"));

import {
  setExcortDayLocal,
  setExcortDayForeigner,
  setOptionQuotationData,
} from "../../../../store/actions/createExcortLocalForeignerAction.js";

import { setItinerayTabChange } from "../../../../store/itinerarayTabAction/itinerarayTabWiseDataLoadAction.js";

// Local Escort Services
import LocalEscortHotelForm from "./localEscortService/LocalEscortHotelForm.jsx";
import LocalEscortMonument from "./localEscortService/LocalEscortMonument.jsx";
import LocalEscortActivityForm from "./localEscortService/LocalEscortActivityForm.jsx";
import LocalEscortRestaurantForm from "./localEscortService/LocalEscortRestaurantForm.jsx";
import LocalEscortTrainForm from "./localEscortService/LocalEscortTrainForm.jsx";
import LocalEscortFlightForm from "./localEscortService/LocalEscortFlightForm.jsx";
import LocalEscortAdditionalForm from "./localEscortService/LocalEscortAdditionalForm.jsx";
import LocalTransportFormValue from "./localEscortService/LocalTransportFormValue.jsx";
import { quotationData } from "../qoutation-first/quotationdata.js";
import ChangeDate from "./ChangeDate.jsx";
import {
  setFlightPrice,
  setMiscAdditionCost,
  setTogglePriceState,
  setTotalActivityPricePax,
  setTotalAdditionalPricePax,
  setTotalGuidePricePax,
  setTotalMonumentPricePax,
  setTotalResturantPricePax,
  setTransportPrice,
} from "../../../../store/actions/PriceAction.js";
import mathRoundHelper from "../helper-methods/math.round.js";
import { TransfertypeValidation } from "../query_validation.js";

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
  From: "",
  To: "",
  Transport: "",
  isOutstationChanged: false,
  isShowOutstation: true,
};

const Itineraries = ({ onNext }) => {
  const { ForeignerRefreshTrigger } = useSelector(
    (state) => state?.createExcortDayLocalForeignerReducer
  );

  // console.log(ForeignerRefreshTrigger, "ForeignerRefreshTrigger");
  const queryData = useQueryData();
  const [transportFormValue, setTransportFormValue] = useState([]);
  // console.log(queryData, "GHY67");
  const [localTransportFormValue, setLocalTransportFormValue] = useState([]);
  const [optionTransprotFromValue, setOptionTransprotFromValue] = useState([]);

  const [foreignerTransportFormValue, setForeignerTransportFormValue] =
    useState([]);
  const [ActiveOptionId, setActiveOptionId] = useState(null);
  const [checkBoxes, setCheckBoxes] = useState(checkedArr);
  const [hotelCategoryList, setHotelCategoryList] = useState([]);
  const [mealPlanList, setMealPlanList] = useState([]);
  const [headerActivityList, setHeaderActivityList] = useState([]);
  const [vehicleList, setVehicleList] = useState([]);
  const {
    qoutationData,
    isItineraryEditing,
    payloadQueryData,
    FinalMonumentvalue,
    FinalGuidevalue,
    FinalTransportvalue,
    FinalActivityvalue,
    FinalAddtionalvalue,
    FinalRestaurantvalue,
    FinalTrainvalue,
    FinalFlightvalue,
    FinalHotelvalue,
  } = useSelector((data) => data?.queryReducer);
  // console.log(FinalRestaurantvalue, "FinalRestaurantvalue");

  const { monumentFormData } = useSelector((data) => data?.itineraryReducer);
  const [backTenYear, setBackTenYear] = useState([]);
  const [inputCurrentYear, setInputCurrentYear] = useState("");
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

  const queryQuotation = JSON.parse(localStorage.getItem("Query_Qoutation"));

  const getQoutationList = async () => {
    const payload = {
      QueryId: queryQuotation?.QueryID,
      QuotationNo: queryQuotation?.QoutationNum,
    };
    try {
      const { data } = await axiosOther.post("listqueryquotation", payload);
      // console.log(data, "data1234");

      if (data?.success) {
        dispatch(setQoutationData(data?.data[0]));

        const escortDays = Array.isArray(data?.data?.[0]?.ExcortDays)
          ? data.data[0].ExcortDays
          : [];

        let hasDayServices = escortDays.some(
          (escort) =>
            Array.isArray(escort?.Days) &&
            escort.Days.some(
              (day) =>
                Array.isArray(day?.DayServices) && day.DayServices.length > 0
            )
        );

        // Remove escorts from checkedArr if it exists
        // const checkedIndex = checkedArr.indexOf("escorts");
        // if (checkedIndex > -1) {
        //   checkedArr.splice(checkedIndex, 1);
        // }

        // // Only add escorts if there are day services
        // if (Boolean(hasDayServices)) {
        //   if (!checkedArr.includes("escorts")) {
        //     checkedArr.push("escorts");
        //   }
        // }
      }
    } catch (e) {
      console.log(e);
    }
  };

  // console.log(checkedArr, "FGHDY76");

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
    HotelData: null,
  });

  const postDataToServer = async () => {
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
      // let HotelCategory = qoutationData?.Days?.flatMap((day) =>
      //   day?.DayServices?.filter(
      //     (service) =>
      //       service?.ServiceType === "Transport" &&
      //       service?.ServiceMainType === "Guest"
      //   ).map((service) => service)
      // );
      // console.log(HotelCategory,"HotelCategory");

      const firstId = data?.DataList[0]?.id;
      // console.log(queryData?.QueryAllData?.Prefrences?.VehiclePreference,"queryData?.QueryAllData?.Prefrences?.VehiclePreference");
      // console.log(firstId, "firstId");
      // console.log(
      //   queryData?.QueryAllData?.Prefrences?.VehiclePreference,
      //   "TEST987"
      // );

      setHeaderDropdown((prev) => ({
        ...prev,
        Transfer:
          queryData?.QueryAllData?.Prefrences?.VehiclePreference || firstId,
      }));
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    const vehiclePref = queryData?.QueryAllData?.Prefrences?.VehiclePreference;
    if (vehiclePref) {
      postDataToServer();
    }
  }, [queryData?.QueryAllData?.Prefrences?.VehiclePreference]);

  const headerdata = async () => {
    try {
      const { data } = await axiosOther.post("hotelcategorylist");
      setHotelCategoryList(data?.DataList);
      // console.log(data?.DataList,"data?.DataList")

      let HotelCategory = qoutationData?.Days?.flatMap((day) =>
        day?.DayServices?.filter(
          (service) =>
            service?.ServiceType === "Hotel" &&
            service?.ServiceMainType === "Guest"
        ).map((service) => service?.HotelCategoryId)
      );

      // console.log(quotationData,"qoutationData?.Days2");
      // console.log(HotelCategory,"HotelCategory1");
      // console.log(
      //   qoutationData?.Days?.some((day) =>
      //     Array.isArray(day?.DayServices)
      //       ? day.DayServices
      //         .some(
      //           (service) =>
      //             service?.ServiceType == "Hotel" &&
      //             service?.ServiceMainType == "Guest"
      //         )
      //         .map((service) => service?.HotelCategoryId)
      //       : []
      //   ),
      //   "HotelCategory"
      // );

      // console.log(queryData,"queryData11")

      // console.log(queryData, "queryData22");

      const firstId =
        HotelCategory?.[0] != null && HotelCategory?.[0] !== ""
          ? HotelCategory?.[0]
          : queryData?.QueryAllData?.Hotel?.HotelCategory;
      setHeaderDropdown((prev) => ({ ...prev, Hotel: firstId }));
      // console.log(firstId, "firstId");
    } catch (error) {
      console.log("error", error);
    }
    try {
      const { data } = await axiosOther.post("hotelmealplanlist");
      // console.log("R12",data);
      setMealPlanList(data?.DataList);
      let MealPlanId = qoutationData?.Days?.flatMap((day) =>
        day?.DayServices?.filter(
          (service) =>
            service?.ServiceType === "Hotel" &&
            service?.ServiceMainType === "Guest"
        ).map((service) => service?.MealPlanId)
      );
      // console.log(qoutationData, "qoutationDataNew");

      const firstId = MealPlanId?.[0] || queryData?.QueryAllData?.MealPlan;
      setHeaderDropdown((prev) => ({ ...prev, MealPlan: firstId }));
    } catch (error) {
      console.log("error", error);
    }
  };
  // console.log(queryData,"queryData");

  useEffect(() => {
    const hasValidData =
      quotationData &&
      Array.isArray(quotationData.Days) &&
      quotationData.Days.length > 0 &&
      quotationData.Days.some(
        (day) => Array.isArray(day?.DayServices) && day.DayServices.length > 0
      );

    if (hasValidData && queryData) {
      headerdata();
    }
  }, [
    quotationData,
    queryData?.QueryAllData?.Hotel?.HotelCategory,
    queryData?.QueryAllData?.MealPlan,
  ]); // Add queryData as a dependency

  const handleCheckboxes = (e) => {
    const { value, checked } = e.target;
    // console.log("CV5",checked,value);
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
  const [hoteldata, sethotelData] = useState(false);

  const handleHeaderDropdown = (e) => {
    const { name, value } = e.target;
    setHeaderDropdown({ ...headerDropdown, HotelData: false });

    // console.log(name, value, "name, value");
    setHeaderDropdown({
      ...headerDropdown,
      [name]: value,
      ...(name === "Hotel" && { HotelData: value !== "0" }),
    });
    // if (name == "Hotel" && value == "0") {
    //   // handleAllHotelsSelected();
    // }
  };

  // Debug updated state

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const handleQuotationFormChange = (e) => {
    const { name, value, checked } = e.target;

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
        notifyHotSuccess("Data Updated!");
      } else {
        notifyHotError(data?.Message || data?.message || data?.error);
      }
    } catch (error) {
      if (error.response?.data?.Errors || error.response?.data?.error) {
        const data = Object.entries(
          error.response?.data?.Errors || error.response?.data?.error
        );
        notifyHotError(data[0][1]);
      }
    }
  };

  // const getTenYearBack = () => {
  //   const currentYear = new Date().getFullYear();
  //   const allYear = [];
  //   for (let i = 0; i < 10; i++) {
  //     allYear.push(currentYear - i);
  //   }
  //   setBackTenYear(allYear);
  // };
  const getTenYearBack = () => {
    const currentYear = new Date().getFullYear();
    const allYear = [];

    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      allYear.push(i);
    }
    setInputCurrentYear(currentYear);
    setBackTenYear(allYear);
  };

  useEffect(() => {
    getTenYearBack();
  }, []);

  const getTransportList = async (destination, FromDay, ToDay, index) => {
    try {
      // Validate inputs
      const destId =
        destination && !isNaN(parseInt(destination))
          ? parseInt(destination)
          : qoutationData?.Days?.[0]?.DestinationId || 0;
      const fromDayNum = parseInt(FromDay);
      const toDayNum = parseInt(ToDay);
      const noOfDays =
        !isNaN(fromDayNum) && !isNaN(toDayNum) && toDayNum >= fromDayNum
          ? toDayNum - fromDayNum + 1
          : 1;

      if (!destId) {
        // console.log("Invalid DestinationId, skipping API call:", {
        //   destination,
        //   fallback: qoutationData?.Days?.[0]?.DestinationId,
        // });
        setOutstationForm((prevForm) => {
          const newForm = [...prevForm];
          newForm[index] = { ...newForm[index], Transport: "" }; // Keep empty or set default ID if needed
          return newForm;
        });
        return;
      }

      // console.log("API payload:", {
      //   DestinationId: [destId],
      //   NoOfDays: noOfDays,
      //   Default: "Yes", // Set default value as API might expect it
      //   TransferType: "6", // Set default for outstation, adjust as needed
      // });

      const { data } = await axiosOther.post("transportmasterlist", {
        Name: "",
        Status: "",
        id: "",
        DestinationId: [destId],
        Default: "Yes", // Ensure API filters correctly
        TransferType: "6", // Assuming outstation transfers use type 6
        NoOfDays: noOfDays,
      });

      // console.log("Full API response:", data);

      setOutstationForm((prevForm) => {
        const newForm = [...prevForm];
        newForm[index] = {
          ...newForm[index],
          Transport: data?.DataList?.length > 0 ? data.DataList[0].id : "", // Keep empty if no data
        };
        // console.log("Updated outstationForm:", newForm);
        return newForm;
      });

      setTransprotList((prevList) => {
        const newArr = [...prevList];
        newArr[index] = data?.DataList || [];
        return newArr;
      });
    } catch (error) {
      console.error("Error in getTransportList:", error);
      setOutstationForm((prevForm) => {
        const newForm = [...prevForm];
        newForm[index] = { ...newForm[index], Transport: "" }; // Fallback to empty on error
        return newForm;
      });
    }
  };

  useEffect(() => {
    if (outstationForm?.length > 0) {
      outstationForm.forEach((form, index) => {
        if (form?.Destination && form?.From && form?.To) {
          getTransportList(form.Destination, form.From, form.To, index);
        } else {
          console.log(
            "Skipping getTransportList for index:",
            index,
            "due to missing data:",
            form
          );
        }
      });
    }
  }, [
    // outstationForm?.map((form) => `${form?.Destination},${form?.From},${form?.To}`).join("|"),
    JSON.stringify(
      outstationForm?.map((item) => ({
        ToDestination: item?.Destination,
        TransferType: item?.From,
        Mode: item?.To,
      }))
    ),
  ]);
  // console.log(outstationForm, "outstationForm");

  const handleOutstationChange = (e, index) => {
    const { name, value, type, checked } = e.target;

    if (type != "checkbox") {
      setOutstationForm((prevArr) => {
        const newArr = [...prevArr];
        const isChangingFromOrTo =
          name === "From" || name === "To" || name === "Transport";
        newArr[index] = {
          ...newArr[index],
          [name]: value,
          ...(isChangingFromOrTo && { isOutstationChanged: true }),
        };
        return newArr;
      });
    }
    if (type == "checkbox" && checked) {
      setOutstationForm((prevArr) => {
        const newArr = [...prevArr];
        newArr[index] = {
          ...newArr[index],
          isShowOutstation: true,
          isOutstationChanged: true,
        };
        return newArr;
      });
    }

    if (type == "checkbox" && !checked) {
      setOutstationForm((prevArr) => {
        const newArr = [...prevArr];
        newArr[index] = {
          ...newArr[index],
          isShowOutstation: false,
          isOutstationChanged: true,
        };
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
    const hasTransportService = qoutationData?.Days?.some(
      (day) =>
        Array.isArray(day?.DayServices) &&
        day?.DayServices?.some(
          (service) =>
            service?.ServiceType === "Transport" &&
            service?.ServiceMainType === "Guest"
        )
    );

    if (hasTransportService) {
      const initialFormValue =
        qoutationData?.Days?.flatMap((day) => {
          const transportServices = Array.isArray(day?.DayServices)
            ? day.DayServices.filter(
                (service) =>
                  service?.ServiceType === "Transport" &&
                  service?.ServiceMainType === "Guest"
              )
            : [];
          return transportServices.map((service) => service?.Outstation);
        }) || [];

      // Find the first non-empty Outstation array
      const data = initialFormValue.find(
        (arr) => Array.isArray(arr) && arr.length > 0
      );

      if (data && data.length > 0) {
        setOutstationForm(
          data.map((item) => ({
            Destination: item.DestinationId,
            From: item.FromDay,
            To: item.ToDay,
            Transport: item.TransportId,
            isOutstationChanged: false,
            isShowOutstation: true,
          }))
        );
      }
    }
  }, [qoutationData?.Days]);

  useEffect(() => {
    if (
      !outstationForm ||
      outstationForm.length === 0 ||
      !outstationForm[0]?.Destination
    ) {
      const firstDestination = qoutationData?.Days
        ? qoutationData?.Days[0]?.DestinationId
        : "";
      const days = [...new Set(qoutationData?.Days?.map((day) => day?.Day))];
      const lastDay = days[days.length - 1];
      setOutstationForm([
        {
          Destination: firstDestination,
          From: 1,
          To: Number(lastDay),
          Transport: "",
          isOutstationChanged: false,
          isShowOutstation: true,
        },
      ]);
    }
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
  // console.log(headerDropdown,"headerDropdown");

  const [showModal, setShowModal] = useState(false);
  const [tabsByQueryId, setTabsByQueryId] = useState({});
  const [activeTab, setActiveTab] = useState("main-itinerary");
  const [selectedOption, setSelectedOption] = useState("Option-A");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [tabData, setTabData] = useState({});
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleAddTab = () => {
    const currentQueryId = quotationFormValue.QueryId;

    if (!currentQueryId) {
      notifyHotError("No QueryId found");
      return;
    }

    const existingTab = tabsByQueryId[currentQueryId]?.find(
      (tab) => tab.name === selectedOption
    );

    if (existingTab) {
      notifyHotError("Tab already exists");
      return;
    }

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

    // Delay setting active tab slightly to allow UI update (optional workaround)
    setTimeout(() => {
      setActiveTab(newTab.key);
    }, 0);

    FetchQuotationOption({
      OptionName: selectedOption,
      QueryId: currentQueryId,
    });

    // notifyHotSuccess("Added Successfully");
    setSelectedOption("");
    setShowModal(false);
  };
  // console.log(tabsByQueryId, "tabsByQueryId");

  useEffect(() => {
    if (queryData?.QueryAlphaNumId) {
      setQuotationFormValue((prevValue) => ({
        ...prevValue,
        QueryId: queryData?.QueryAlphaNumId,
        QuotationNumber: qoutationData?.QuotationNumber,
      }));
    }
  }, [queryData?.QueryAlphaNumId]);

  const FetchQuotationOption = async (data) => {
    // console.log(data, "data11");

    const QuotationNo = JSON.parse(
      localStorage.getItem("Query_Qoutation")
    )?.QoutationNum;

    const payload = {
      QuatationNo: QuotationNo || qoutationData?.QuotationNumber,
      OptionName: data?.OptionName,
      QueryId: data?.QueryId,
    };

    try {
      await axiosOther.post("multipleQuotation", payload);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleTabClick = async () => {
    // console.log("queryData", queryData);
    try {
      const QuotationNo = JSON.parse(localStorage.getItem("Query_Qoutation"));
      // console.log(QuotationNo?.QoutationNum);

      // if (!QuotationNo?.QoutationNum || !QuotationNo?.QueryID) return
      const { data } = await axiosOther.post("listMultipleQuotations", {
        QuatationNo:
          QuotationNo?.QoutationNum || qoutationData?.QuotationNumber,
        QueryId: QuotationNo?.QueryID || queryData?.QueryAlphaNumId,
      });
      // console.log(data, "GUIDE9887");
      if (data) {
        const groupedTabs = data?.data?.reduce((acc, curr) => {
          const id = QuotationNo?.QueryID;
          if (!acc[id]) {
            acc[id] = [];
          }
          acc[id].push(curr);
          return acc;
        }, {});

        setTabsByQueryId(groupedTabs);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleTabClick();
  }, [tabsByQueryId?.length, selectedOption]);

  // ========================================================

  // fetching data for option tabs

  const getAdditionalData = async () => {
    const queryQuotation = JSON.parse(localStorage.getItem("Query_Qoutation"));
    if (!queryQuotation?.QueryID) {
      console.error("QueryID is missing in localStorage");
      return;
    }

    // console.log(activeTab, "activeTab");

    try {
      const { data } = await axiosOther.post("listMultipleQuotations", {
        QueryId: queryQuotation?.QueryID,
        QuatationNo: queryQuotation?.QoutationNum,
        OptionId: activeTab,
      });
      // console.log(data?.data[0], "data3434rdf");

      dispatch(setOptionQuotationData(data?.data[0]));
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getAdditionalData();
  }, [activeTab]);

  // ========================================================

  // console.log("tabsByQueryId", tabsByQueryId);
  // console.log("ActiveOptionId", ActiveOptionId);

  useEffect(() => {
    getQoutationList();
    getqueryData();
  }, [isItineraryEditing && headerDropdown]);

  const [isMounted, setIsMounted] = useState({
    local: false,
    foreigner: false,
  });

  useEffect(() => {
    if (!isMounted.local) {
      setIsMounted((prevState) => ({ ...prevState, local: true }));
    }
    if (!isMounted.foreigner) {
      setIsMounted((prevState) => ({ ...prevState, foreigner: true }));
    }
  }, []);

  const isExcortDayCreated = useSelector(
    (state) => state.createExcortDayLocalForeignerReducer
  );

  const handleTabSelectLocalForeigner = async (selectedTab) => {
    dispatch(setItinerayTabChange(selectedTab));

    // const isCreated = isExcortDayCreated[selectedTab];

    // if (isCreated) return;

    // const excortType =
    //   selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1);

    // try {
    //   await axiosOther.post("create-excort-days", {
    //     QueryId: queryQuotation?.QueryID,
    //     QuotationNumber: queryQuotation?.QoutationNum,
    //     ExcortType: excortType,
    //     NoOfEscort: "1",
    //   });

    //   if (selectedTab === "local") {
    //     console.log("STR67", selectedTab, isCreated);
    //     dispatch(setExcortDayLocal());
    //   } else if (selectedTab === "foreigner") {
    //     console.log("STR67", selectedTab, isCreated);
    //     dispatch(setExcortDayForeigner());
    //   }
    // } catch (error) {
    //   console.log("Error:", error);
    // }
  };

  useEffect(() => {
    return () => {
      dispatch(setItinerayTabChange("main-itinerary"));
    };
  }, []);
  const mainHotelCopyData = useSelector(
    (state) => state.itineraryServiceCopyReducer.hotelData
  );
  // console.log(mainHotelCopyData, "mainHotelCopyData");
  // Check if it's an update or create scenario
  const isUpdateScenario = () => {
    return qoutationData?.Days?.some((day) =>
      day?.DayServices?.some(
        (service) =>
          service.ServiceType === "Hotel" && service.ServiceMainType === "Guest"
      )
    );
  };

  // Transform the payload to match the second JSON structure
  const transformPayload = (inputPayload) => {
    // console.log(inputPayload, "inputPayload");

    // Ensure inputPayload is valid
    if (
      !inputPayload ||
      !inputPayload.HotelForm ||
      !inputPayload.RoomBedType ||
      !inputPayload.MealType
    ) {
      console.error("Invalid inputPayload structure:", inputPayload);
      return [];
    }

    const transformedHotelForm = inputPayload.HotelForm.map((hotel, index) => {
      const roomBedTypes = inputPayload.RoomBedType[index] || [];
      const mealTypes = inputPayload.MealType[index] || [];

      const transformedRoomBedType = roomBedTypes.map((room) => ({
        RoomBedTypeId: room.RoomBedTypeId || "",
        RoomCost:
          room.RoomCost === "" || room.RoomCost === null
            ? 0
            : parseFloat(room.RoomCost) || 0,
      }));

      // Map HotelRoomBedType for the current hotel entry
      const transformedHotelRoomBedType = roomBedTypes.map((room) => ({
        RoomBedType: room.RoomBedTypeId || "",
        ServiceCost:
          room.RoomCost === "" || room.RoomCost === null
            ? 0
            : parseFloat(room.RoomCost) || 0,
        Markupvalue: 0,
        MarkupTotalValue: 0,
        TotalServiceCost:
          room.RoomCost === "" || room.RoomCost === null
            ? 0
            : parseFloat(room.RoomCost) || 0,
        RoomBedTypeName: room.RoomType || "",
      }));

      // Map MealType for the current hotel entry
      const transformedMealType = mealTypes.map((meal) => ({
        MealTypeId: meal.MealTypeId || "",
        MealCost:
          meal.MealCost === "" || meal.MealCost === null
            ? 0
            : parseFloat(meal.MealCost) || 0,
        MealTypePackage: "No",
      }));

      // Map HotelMealType for the current hotel entry
      const transformedHotelMealType = mealTypes.map((meal) => ({
        id: meal.MealTypeId || "",
        MealTypeName:
          meal.MealTypeId === "1"
            ? "Breakfast"
            : meal.MealTypeId === "2"
            ? "Lunch"
            : "Dinner",
        ServiceCost:
          meal.MealCost === "" || meal.MealCost === null
            ? 0
            : parseFloat(meal.MealCost) || 0,
        Markupvalue: 0,
        MarkupTotalValue: 0,
        TotalServiceCost:
          meal.MealCost === "" || meal.MealCost === null
            ? 0
            : parseFloat(meal.MealCost) || 0,
      }));

      return {
        ...hotel,
        Hike:
          hotel.Hike === "" || hotel.Hike === null
            ? 0
            : parseFloat(hotel.Hike) || 0,
        HotelCategory:
          hotel.HotelCategory === "" || hotel.HotelCategory === null
            ? "5"
            : hotel.HotelCategory,
        RoomBedType: transformedRoomBedType,
        MealType: transformedMealType,
        HotelRoomBedType: transformedHotelRoomBedType,
        HotelMealType: transformedHotelMealType,
      };
    });

    return transformedHotelForm;
  };

  // Updated handleSave function

  // console.log(FinalGuidevalue, "FinalGuidevalue");
  // console.log(FinalRestaurantvalue, "FinalRestaurantvalue22");

  const handleSave = async () => {
    try {
      // console.log("function calllss2");
      // if (!FinalRestaurantvalue) return;
      // console.log("function calllss3");
      const { data } = await axiosOther.post(
        "update-quotation-restaurent",
        FinalRestaurantvalue
      );
      if (data?.status == 1) {
        // notifySuccess(data.message);
        // dispatch(setRestaurantPrice(totalPriceForPax()));
        dispatch(setTogglePriceState());
        dispatch(setQoutationResponseData(data?.data));
      }
    } catch (error) {
      console.log(error, "error");
      if (error.response?.data?.Errors || error.response?.data?.errors) {
        const data = Object.entries(
          error.response?.data?.Errors || error.response?.data?.errors
        );
        notifyError(data[0]?.[1] || "An error occurred");
        // console.log(data, "error");
      } else if (error.response?.data) {
        const data = Object.entries(error.response?.data);
        notifyError(data[0]?.[1] || "An error occurred");
        // console.log(data, "error");
      }
    }
    try {
      if (!FinalHotelvalue) return;
      const { data } = await axiosOther.post(
        "update-quotation-hotel",
        FinalHotelvalue
      );
      // console.log(data, "datacheck");

      notifyHotSuccess(" Data successfully Submit");
      dispatch(setQoutationResponseData(data?.data));
    } catch (error) {
      console.error(error, "error");
      notifyHotError("Submit Unsuccessfully");
    }

    try {
      const totalMonumentAmount = FinalMonumentvalue?.reduce((total, item) => {
        const adultCost = mathRoundHelper(item.ItemUnitCost?.Adult) || 0;
        const childCost = mathRoundHelper(item.ItemUnitCost?.Child) || 0;

        return total + adultCost + childCost;
      }, 0);

      if (!FinalMonumentvalue) return;
      const { data } = await axiosOther.post(
        "update-quotation-monument",
        FinalMonumentvalue
      );

      if (data?.status == 1) {
        // notifySuccess("Services Added !");
        // notifyHotSuccess(data?.message);
        dispatch(setTotalMonumentPricePax(totalMonumentAmount));
        dispatch(setQoutationResponseData(data?.data));
      }
    } catch (error) {
      if (error.response?.data?.Errors || error.response?.data?.errors) {
        const data = Object.entries(
          error.response?.data?.Errors || error.response?.data?.errors
        );
        // notifyError(data[0][1]);
        notifyHotError(data[0][1]);
      }
      if (error.response?.data) {
        const data = Object.entries(error.response?.data);
        notifyHotError(data[0][1]);
      }
    }
    // console.log(FinalGuidevalue, "FinalGuidevalue");

    try {
      if (!Array.isArray(FinalGuidevalue) || FinalGuidevalue.length === 0)
        return;
      const { data } = await axiosOther.post(
        "updateguidequatation",
        FinalGuidevalue
      );
      const totalGuideCost = FinalGuidevalue?.reduce((total, item) => {
        const guideFee = parseFloat(item.GuideFee) || 0;
        const languageAllowance = parseFloat(item.LanguageAllowance) || 0;
        const otherCost = parseFloat(item.OtherCost) || 0;
        return total + guideFee + languageAllowance + otherCost;
      }, 0);
      if (data?.status == 1) {
        // ////console.log(finalFormValue,"finalvalue")
        // notifySuccess("Services Added !");
        // notifySuccess(data.message);
        dispatch(setTotalGuidePricePax(totalGuideCost));
        dispatch(setQoutationResponseData(data?.data));
        // getQoutationList();
      }
    } catch (error) {
      if (error.response?.data?.Errors || error.response?.data?.errors) {
        const data = Object.entries(
          error.response?.data?.Errors || error.response?.data?.errors
        );
        notifyError(data[0][1]);
      }
      if (error.response?.data) {
        const data = Object.entries(error.response?.data);
        notifyError(data[0][1]);
      }
    }
    try {
      const payload = FinalTransportvalue?.filteredFinalForm;
      if (!payload) return;
      await TransfertypeValidation.validate(payload, {
        abortEarly: false,
      });

      // console.log(...filteredFinalJson,"filteredFinalJson");

      const { data } = await axiosOther.post(
        "updateTransportQuatation",
        payload
      );

      if (data?.status == 1) {
        // notifySuccess("Services Added !");
        dispatch(setTransportPrice(FinalTransportvalue?.calculatedRateDetails));
        dispatch(setQoutationResponseData(data?.data));
        dispatch(setTogglePriceState());
      }
    } catch (error) {
      notifyError(error?.message);

      if (error.response?.data?.Errors || error.response?.data?.errors) {
        const data = Object.entries(
          error.response?.data?.Errors || error.response?.data?.errors
        );
        notifyError(data[0][1]);
        // setValidationErrors(data[0][1]);
      }

      if (error.response?.data) {
        const data = Object.entries(error.response?.data);
        notifyError(data[0][1]);
      }
    }
    try {
      if (!FinalActivityvalue) return;
      const { data } = await axiosOther.post(
        "update-quotation-activity",
        FinalActivityvalue
      );

      if (data?.status == 0) {
        notifyHotError(data?.message);
      }

      if (data?.status == 1) {
        // notifySuccess("Services Added!");
        // notifyHotSuccess(data?.message);
        dispatch(
          setTotalActivityPricePax(FinalActivityvalue?.[0]?.TotalCosting?.Cost)
        );
        dispatch(setQoutationResponseData(data?.data));
        // getQoutationList();
      }
    } catch (error) {
      console.log(error, "error");

      if (error.response?.data?.Errors || error.response?.data?.errors) {
        const data = Object.entries(
          error.response?.data?.Errors || error.response?.data?.errors
        );
        // notifyError(data[0][1]);
        notifyHotError(data[0][1]);
      }

      if (error.response?.data) {
        const data = Object.entries(error.response?.data);
        // notifyError(data[0][1]);
        notifyHotError(data[0][1]);
      }
    }
    try {
      const payload = FinalAddtionalvalue?.filteredForm;
      const additionalPriceCalculation =
        FinalAddtionalvalue?.additionalPriceCalculation;
      if (!payload) return;
      const { data } = await axiosOther.post(
        "update-quotation-additional",
        payload
      );
      //console.log(data);
      const filteredArray = FinalAddtionalvalue.map(
        ({ AdultCost, ChildCost, CostType }) => ({
          AdultCost,
          ChildCost,
          CostType,
        })
      );

      if (data?.status == 1) {
        // notifySuccess("Services Added !");
        // notifyHotSuccess(data?.message);
        dispatch(
          setMiscAdditionCost(
            additionalPriceCalculation?.Price?.Adult +
              additionalPriceCalculation?.MarkupOfCost?.Adult +
              (additionalPriceCalculation?.Price?.Child +
                additionalPriceCalculation?.MarkupOfCost?.Child)
          )
        );
        dispatch(setTogglePriceState());
        dispatch(setTotalAdditionalPricePax(filteredArray));
        dispatch(setQoutationResponseData(data?.data));
      }
    } catch (error) {
      if (error.response?.data?.Errors || error.response?.data?.errors) {
        const data = Object.entries(
          error.response?.data?.Errors || error.response?.data?.errors
        );
        // notifyError(data[0][1]);
        notifyHotError(data?.message);
      }
      if (error.response?.data) {
        const data = Object.entries(error.response?.data);
        // notifyError(data[0][1]);
        notifyHotError(data?.message);
      }
    }
    // console.log("function calllss");

    try {
      if (!FinalTrainvalue) return;
      const { data } = await axiosOther.post(
        "update-quotation-train",
        // filteredFinalJson
        FinalTrainvalue
      );
      if (data?.status == 1) {
        // notifySuccess("Services Added !");
        notifySuccess(data.message);
        // dispatch(setTrainPrice(totalPriceForPax()));
        dispatch(setQoutationResponseData(data?.data));
        dispatch(setTogglePriceState());
      }
    } catch (error) {
      if (error.response?.data?.Errors || error.response?.data?.errors) {
        const data = Object.entries(
          error.response?.data?.Errors || error.response?.data?.errors
        );
        notifyError(data[0][1]);
      }
      if (error.response?.data) {
        const data = Object.entries(error.response?.data);
        notifyError(data[0][1]);
      }
    }
    const totalPriceForPax = () => {
      const flightPriceCalculation = FinalFlightvalue?.flightPriceCalculation;
      let firstPrice =
        parseInt(flightPriceCalculation?.Price?.Adult) +
        parseInt(flightPriceCalculation?.MarkupOfCost?.Adult);

      let secondPrice =
        parseInt(flightPriceCalculation?.Price?.Child) +
        parseInt(flightPriceCalculation?.MarkupOfCost?.Child);

      let thirdPrice =
        parseInt(flightPriceCalculation?.Price?.Service) +
        parseInt(flightPriceCalculation?.MarkupOfCost?.Service);

      let fourthPrice =
        parseInt(flightPriceCalculation?.Price?.Handling) +
        parseInt(flightPriceCalculation?.MarkupOfCost?.Handling);

      let fivthPrice =
        parseInt(flightPriceCalculation?.Price?.Guide) +
        parseInt(flightPriceCalculation?.MarkupOfCost?.Guide);

      let allPrice =
        firstPrice + secondPrice + thirdPrice + fourthPrice + fivthPrice;
      return allPrice;
    };
    try {
      const payload = FinalFlightvalue?.updatedData;
      if (!payload) return;
      // console.log(payload, "payload123");

      const { data } = await axiosOther.post(
        "update-quotation-flight",
        // filteredFinalForm
        FinalFlightvalue
      );
      if (data?.status == 1) {
        // notifySuccess("Services Added !");
        notifySuccess(data.message);
        dispatch(setFlightPrice(totalPriceForPax()));
        dispatch(setQoutationResponseData(data?.data));
        dispatch(setTogglePriceState());
      }
    } catch (error) {
      if (error.response?.data?.Errors || error.response?.data?.errors) {
        const data = Object.entries(
          error.response?.data?.Errors || error.response?.data?.errors
        );
        notifyError(data[0][1]);
      }
      if (error.response?.data) {
        const data = Object.entries(error.response?.data);
        notifyError(data[0][1]);
      }
    }
  };

  //   try {
  //     const payload = mainHotelCopyData;
  //     console.log(payload,"payloadhotel");

  //     // Transform the payload to match the "correct" JSON structure
  //     const transformedPayload = {
  //       HotelForm: payload.HotelForm.map((day, index) => {
  //         // For this example, we'll transform only DayNo 1 as per the "correct" JSON
  //         if (day.DayNo == 1) {
  //           console.log(DayServices,"DayServices ");

  //           return {
  //             ...day,
  //             DayServices: day.DayServices.map((service) => ({
  //               ...service,
  //               ServiceDetails: service.ServiceDetails.map((detail) => ({
  //                 ...detail,

  //                   RoomBedType: payload.RoomBedType[index].map((room) => ({
  //                     RoomBedTypeId: room.RoomBedTypeId,
  //                     RoomCost: room.RoomCost || 0,
  //                     RoomBedTypeName: room.RoomType,
  //                   })),
  //                   MealType: payload.MealType[index].map((meal) => ({
  //                     MealTypeId: meal.MealTypeId,
  //                     MealCost: meal.MealCost || 0,
  //                     MealTypePackage: "No",
  //                     MealTypeName: meal.MealTypeId === "1" ? "Breakfast" : meal.MealTypeId === "2" ? "Lunch" : "Dinner",
  //                   })),

  //               })),
  //               TotalCosting: [
  //                 {
  //                   HotelRoomBedType: payload.RoomBedType[index].map((room) => ({
  //                     RoomBedType: room.RoomBedTypeId,
  //                     ServiceCost: room.RoomCost || 0,
  //                     Markupvalue: 0,
  //                     MarkupTotalValue: 0,
  //                     TotalServiceCost: room.RoomCost || 0,
  //                     RoomBedTypeName: room.RoomType,
  //                   })),
  //                   HotelMealType: payload.MealType[index].map((meal) => ({
  //                     id: meal.MealTypeId,
  //                     MealTypeName: meal.MealTypeId === "3" ? "CPAI" : "",
  //                     ServiceCost: meal.MealCost || 0,
  //                     Markupvalue: 0,
  //                     MarkupTotalValue: 0,
  //                     TotalServiceCost: meal.MealCost || 0,
  //                   })),
  //                 },
  //               ],
  //             })),
  //           };
  //         }
  //         return day;
  //       }),
  //     };
  // console.log(transformedPayload?.HotelForm,"transformedPayload?.HotelForm");

  //     // Send the transformed payload
  //     const data = await axiosOther.post("update-quotation-hotel", transformedPayload?.HotelForm);
  //     console.log(data, "datacheck");
  //   } catch (error) {
  //     console.log(error, "error");
  //   }
  //   try {

  //   } catch (error) {

  //   }
  // };

  return (
    <>
      <Tab.Container
        onSelect={handleTabSelectLocalForeigner}
        defaultActiveKey={activeTab}
      >
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
                onClick={() => setActiveOptionId(null)}
                className="query-options-tab d-flex justify-content-center align-items-center fontSize10px p-1"
                style={{
                  color: "#008080",
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
              <CiCirclePlus size={18} color="#008080" />
            </button>

            {/* Dynamic Tabs */}
            {tabsByQueryId[quotationFormValue?.QueryId]?.map((tab, index) => {
              return (
                <Nav.Item
                  key={index}
                  onClick={() => setActiveOptionId(tab.OptionId)}
                  className="flex-item p-0 mt-0 fontSize8px position-relative"
                >
                  {activeTab == tab.OptionId ? (
                    <MdCancel
                      onClick={() => handleDeleteOption(tab.OptionId)}
                      style={{
                        fontSize: "10px",
                        position: "absolute",
                        right: "0",
                        top: "-7px",
                      }}
                    />
                  ) : (
                    ""
                  )}
                  <Nav.Link
                    eventKey={tab.OptionId}
                    onClick={() => setActiveTab(tab.OptionId)}
                    className="query-options-tab p-1 m-0 d-flex justify-content-center align-items-center fontSize10px"
                    style={{
                      color: activeTab === tab.OptionId ? "#008080" : "008080",
                      backgroundColor:
                        activeTab === tab.OptionId
                          ? "transparent"
                          : "transparent",
                    }}
                  >
                    {tab?.OptionName}
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
              );
            })}

            {/* Escorts Tabs */}
            {checkBoxes?.includes("escorts") && (
              <>
                <Nav.Item
                  as="li"
                  data-aos="zoom-in"
                  className="flex-item p-2 m-0"
                >
                  <Nav.Link
                    onClick={() => setActiveOptionId(null)}
                    eventKey={"local"}
                    className="query-options-tab p-1 m-0 d-flex justify-content-center align-items-center fontSize10px"
                    style={{
                      color: "#008080",
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
                    onClick={() => setActiveOptionId(null)}
                    eventKey={"foreigner"}
                    className="query-options-tab p-1 m-0 d-flex justify-content-center align-items-center fontSize10px"
                    style={{
                      color: "#008080",
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

          {/* <div className="d-flex ms-auto">
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
          </div> */}
        </Nav>
        <Tab.Content className="">
          <Tab.Pane eventKey="main-itinerary" className="pb-5">
            {/* top header row */}
            <div className="row borderBottom m-0">
              <div className="col-8 height40px ps-0">
                {/* <div className=" d-flex align-items-center gap-2 h-100 ">
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
                </div> */}
              </div>
              <div className="col-4 ps-0 height40px d-flex align-items-center justify-content-end gap-2 pe-0">
                <ChangeDate qoutationData={qoutationData} />
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
                        <option value={"0"}>All</option>
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
                  {/* {console.log(checkBoxes?.includes("escorts"), "HFG76")} */}
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
                      value={headerDropdown?.Year || inputCurrentYear}
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
              <div className="col-10 d-flex flex-column gap-2 align-items-start">
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
                            {/* {console.log(outstationForm[index]?.To, "To3565")} */}
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
              <div
                className="col-12 col-md-2 d-flex justify-content-end align-items-end"
                // onClick={onNext}
              >
                <button
                  className="btn btn-primary btn-custom-size"
                  onClick={handleSave}
                >
                  <span className="me-1">Save All</span>
                  <i className="fa-solid fa-save text-primary bg-white p-1 rounded"></i>
                </button>
              </div>
            </div>
            {/* hotel table form  */}
            <HotelTableForm
              headerDropdown={headerDropdown}
              ActiveOptionId={ActiveOptionId}
              setHeaderDropdown={setHeaderDropdown}
              Type="Main"
            />
            {/* Restaurant form table */}
            <RestaurantTableForm Type="Main" headerDropdown={headerDropdown} />
            {/* monument form table */}
            <MonumentTableForm
              Type="Main"
              headerDropdown={headerDropdown}
              checkBoxes={checkBoxes}
            />
            {/* guide form table */}
            <GuideTableForm
              Type="Main"
              headerDropdown={headerDropdown}
              checkBoxes={checkBoxes}
            />
            {/* transport form table */}
            <TransportTableForm
              Type="Main"
              headerDropdown={headerDropdown}
              outstation={outstationForm}
              transportFormValue={transportFormValue}
              setTransportFormValue={setTransportFormValue}
            />
            {/* Activity form table */}
            <ActivityTableForm
              headerDropdown={headerDropdown}
              Type="Main"
              checkBoxes={checkBoxes}
            />

            {/* train form table */}
            <TrainTableForm
              Type="Main"
              headerDropdown={headerDropdown}
              transportFormValue={transportFormValue}
            />
            {/* flight form table */}
            <FlightTableForm
              Type="Main"
              headerDropdown={headerDropdown}
              transportFormValue={transportFormValue}
            />
            {/* additional form table */}
            <AdditionalTableForm Type="Main" headerDropdown={headerDropdown} />
            <div className="d-flex mt-3 justify-content-end gap-2">
              <div
                className="d-flex justify-content-end align-items-end"
                // onClick={onNext}
              >
                <button
                  className="btn btn-primary btn-custom-size"
                  onClick={handleSave}
                >
                  <span className="me-1">Save All</span>
                  <i className="fa-solid fa-save text-primary bg-white p-1 rounded"></i>
                </button>
              </div>
              <div className="d-flex justify-content-end align-items-end">
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

            {/* local escort form table */}
            {/* <CostSummaryFormTable Type="Main" /> */}
            {/* <div className="row mt-3">
              
            </div> */}
          </Tab.Pane>
          {/* <Tab.Pane eventKey="pax-slab" className="pb-5">
          <PaxSlab paxSlab={quotationFormValue} />
        </Tab.Pane> */}
          <>
            {checkBoxes?.includes("escorts") && (
              <>
                <Tab.Pane eventKey="local">
                  {isMounted.local && (
                    <>
                      {/* hotel table form  */}
                      {/* <HotelTableForm
                        headerDropdown={headerDropdown}
                        ActiveOptionId={ActiveOptionId}
                        Type="Local"
                      /> */}

                      <LocalEscortHotelForm
                        headerDropdown={headerDropdown}
                        ActiveOptionId={ActiveOptionId}
                        Type="Main"
                      />

                      {/* Restaurant form table */}
                      {/* <RestaurantTableForm
                        Type="Local"
                        headerDropdown={headerDropdown}
                      /> */}

                      <LocalEscortRestaurantForm
                        Type="Main"
                        headerDropdown={headerDropdown}
                      />

                      {/* monument table form */}
                      {/* <MonumentTableForm
                        Type="Local"
                        formData={monumentFormData}
                        checkBoxes={checkBoxes}
                      /> */}

                      <LocalEscortMonument
                        Type="Main"
                        headerDropdown={headerDropdown}
                        checkBoxes={checkBoxes}
                      />

                      {/* guide form table */}
                      {/* <GuideTableForm
                        Type="Local"
                        checkBoxes={checkBoxes}
                        headerDropdown={headerDropdown}
                      /> */}
                      {/* transport form table */}
                      {/* <TransportTableForm
                        Type="Local"
                        outstation={outstationForm}
                        headerDropdown={headerDropdown}
                        transportFormValue={transportFormValue}
                        setTransportFormValue={setTransportFormValue}
                      /> */}

                      <LocalTransportFormValue
                        Type="Main"
                        headerDropdown={headerDropdown}
                        outstation={outstationForm}
                        transportFormValue={localTransportFormValue}
                        setTransportFormValue={setLocalTransportFormValue}
                      />

                      {/* Activity form table */}
                      {/* <ActivityTableForm
                        headerDropdown={headerDropdown}
                        Type="Local"
                        checkBoxes={checkBoxes}
                      /> */}

                      <LocalEscortActivityForm
                        headerDropdown={headerDropdown}
                        Type="Main"
                        checkBoxes={checkBoxes}
                      />

                      {/* train form table */}
                      {/* <TrainTableForm
                        Type="Local"
                        headerDropdown={headerDropdown}
                        transportFormValue={transportFormValue}
                      /> */}

                      <LocalEscortTrainForm
                        Type="Main"
                        headerDropdown={headerDropdown}
                        transportFormValue={localTransportFormValue}
                      />

                      {/* flight form table */}
                      {/* <FlightTableForm
                        Type="Local"
                        headerDropdown={headerDropdown}
                        transportFormValue={transportFormValue}
                      /> */}

                      <LocalEscortFlightForm
                        Type="Main"
                        headerDropdown={headerDropdown}
                        transportFormValue={localTransportFormValue}
                      />

                      {/* additional form table */}
                      {/* <AdditionalTableForm
                        Type="Local"
                        headerDropdown={headerDropdown}
                      /> */}

                      <LocalEscortAdditionalForm
                        Type="Main"
                        headerDropdown={headerDropdown}
                      />

                      {/* tour escort form table */}
                      <TourEscortFormTable />
                      {/* Pax Slab form table*/}
                      {/* <PaxSlabFormTable
                        Type="Local"
                        headerDropdown={headerDropdown}
                      /> */}
                      {/* local escort form table */}
                      {/* <CostSummaryFormTable
                        Type="Local"
                        headerDropdown={headerDropdown}
                      /> */}
                      <div className="row mt-3">
                        <div className="col-12 d-flex justify-content-end align-items-end">
                          <button
                            className="btn btn-primary py-1 px-2 radius-4"
                            onClick={onNext}
                          >
                            {/* <i className="fa-solid fa-floppy-disk fs-4"></i> */}
                            Next
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </Tab.Pane>
                <Tab.Pane eventKey="foreigner">
                  {isMounted.foreigner && (
                    <>
                      {/* hotel table form  */}

                      <ForeignerHotelForm
                        headerDropdown={headerDropdown}
                        ActiveOptionId={ActiveOptionId}
                        Type="Main"
                      />
                      {/* Restaurant form table */}

                      <ForeignerResturant
                        Type="Main"
                        headerDropdown={headerDropdown}
                      />

                      {/* monument form table */}

                      <ForeignerMonument
                        Type="Main"
                        formData={monumentFormData}
                        checkBoxes={checkBoxes}
                        headerDropdown={headerDropdown}
                      />
                      {/* guide form table */}

                      {/* transport form table */}
                      {/* <TransportTableForm
                        Type="Foreigner"
                        outstation={outstationForm}
                        headerDropdown={headerDropdown}
                        transportFormValue={transportFormValue}
                        setTransportFormValue={setTransportFormValue}
                      /> */}
                      {/* <ForeignerTransport

                      
                      
                      Type="Main"
                      outstation={outstationForm}
                      headerDropdown={headerDropdown}
                      transportFormValue={foreignerTransportFormValue}
                      setTransportFormValue={setForeignerTransportFormValue}
                      />  */}

                      <ForeignerTransport
                        Type="Main"
                        headerDropdown={headerDropdown}
                        // outstation={outstationForm}
                        transportFormValue={foreignerTransportFormValue}
                        setTransportFormValue={setForeignerTransportFormValue}
                      />

                      {/* Activity form table */}

                      <ForeignerActivity
                        headerDropdown={headerDropdown}
                        Type="Main"
                        checkBoxes={checkBoxes}
                      />

                      {/* train form table */}

                      <ForeignerTrain
                        Type="Main"
                        headerDropdown={headerDropdown}
                        transportFormValue={foreignerTransportFormValue}
                      />
                      {/* flight form table */}

                      <ForeignerFlight
                        Type="Main"
                        headerDropdown={headerDropdown}
                        transportFormValue={foreignerTransportFormValue}
                      />

                      <ForeignerAdditionalServices Type="Main" />
                      {/* Pax Slab form table*/}
                      <PaxSlabFormTable key={ForeignerRefreshTrigger} />
                      {/* local escort form table */}
                      {/* <CostSummaryFormTable
                        Type="Foreigner"
                        headerDropdown={headerDropdown}
                      /> */}
                      <div className="row mt-3">
                        <div className="col-12 d-flex justify-content-end align-items-end">
                          <button
                            className="btn btn-primary py-1 px-2 radius-4"
                            onClick={onNext}
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </Tab.Pane>
              </>
            )}
          </>
        </Tab.Content>

        {/* Options Tab */}
        <Tab.Content>
          {tabsByQueryId[quotationFormValue.QueryId]?.map((tab, index) => (
            <Tab.Pane eventKey={tab.OptionId} key={index}>
              <OptionHotelTab
                headerDropdown={headerDropdown}
                // handleAllHotelsSelected={handleAllHotelsSelected}
                ActiveOptionId={ActiveOptionId}
                TabId={activeTab}
              />

              <OptionMounumentTab
                formData={monumentFormData}
                checkBoxes={checkBoxes}
                headerDropdown={headerDropdown}
                TabId={activeTab}
              />

              <OptionGuideTab
                Type={"Option"}
                checkBoxes={checkBoxes}
                headerDropdown={headerDropdown}
                TabId={activeTab}
              />

              <OptionTransportTab
                outstation={outstationForm}
                headerDropdown={headerDropdown}
                transportFormValue={optionTransprotFromValue}
                setTransportFormValue={setOptionTransprotFromValue}
                TabId={activeTab}
              />

              <OptionActivityTab
                Type="Main"
                headerDropdown={headerDropdown}
                checkBoxes={checkBoxes}
                TabId={activeTab}
              />

              <OptionRestaurantTab
                Type="Main"
                headerDropdown={headerDropdown}
                TabId={activeTab}
              />

              <OptionTrainTab
                headerDropdown={headerDropdown}
                transportFormValue={optionTransprotFromValue}
                TabId={activeTab}
              />

              <OptionFlightTab
                headerDropdown={headerDropdown}
                transportFormValue={optionTransprotFromValue}
                TabId={activeTab}
              />

              <OptionAdditionalServiceTab TabId={activeTab} />
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
            // defaultValue={selectedOption}
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-primary py-1 px-3 rounded-1"
            onClick={handleAddTab}
          >
            Save
          </button>
          <button
            className="btn btn-primary btn-dark py-1 px-3 rounded-1"
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
