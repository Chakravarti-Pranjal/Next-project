import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { axiosOther } from "../../../../../http/axios_base_url";
import { itineraryActivityInitialValue } from "../qoutation_initial_value";
import {
  notifySuccess,
  notifyError,
  notifyHotSuccess,
  notifyHotError,
} from "../../../../../helper/notify";
import ActivityIcon from "../../../../../images/itinerary/activity.svg";
import {
  setActivityPrice,
  setTogglePriceState,
  setTotalActivityPricePax,
} from "../../../../../store/actions/PriceAction";
import {
  setItineraryActivityData,
  setLocalItineraryActivityData,
} from "../../../../../store/actions/itineraryDataAction";
import { FaChevronCircleUp, FaChevronCircleDown } from "react-icons/fa";
import { Modal, Row, Col, Button } from "react-bootstrap";
import { setQoutationResponseData } from "../../../../../store/actions/queryAction";

import styles from "./index.module.css";
import { incrementForeignEscortCharges } from "../../../../../store/actions/createExcortLocalForeignerAction";
import moment from "moment";
import mathRoundHelper from "../../helper-methods/math.round";

const ForeignerActivity = ({ Type, checkBoxes, headerDropdown }) => {
  const { qoutationData, queryData, isItineraryEditing } = useSelector(
    (data) => data?.queryReducer
  );
  const [activityList, setActivityList] = useState([]);
  const [copyChecked, setCopyChecked] = useState(false);
  const hasInitialized = useRef(false);
  const [backupFlightForms, setBackupFlightForms] = useState([]);
  const [destinationList, setDestinationList] = useState([]);
  const [activityFormValue, setActivityFormValue] = useState([]);
  const [originalActivityForm, setOriginalActivityForm] = useState([]);
  const [paxRangePrice, setPaxRangePrice] = useState([]);
  const { activityFormData } = useSelector((data) => data?.itineraryReducer);
  const [rateList, setRateList] = useState([]);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [hikePercent, setHikePercent] = useState(0);
  const [paxFormValue, setPaxFormValue] = useState({
    Adults: "",
    Child: "",
    Infant: "",
  });
  const [modalCentered, setModalCentered] = useState({
    modalIndex: "",
    isShow: false,
  });
  const [supplierList, setSupplierList] = useState([]);
  const [showNoOfActivity, setShowNoOfActivity] = useState(false);
  const [activityPriceCalculation, setActivityPriceCalculation] = useState({
    Price: "",
    Markup: "",
    MarkupOfCost: "",
  });
  const [fromToDestinationList, setFromToDestinationList] = useState([]);
  const [isFirstValueSetted, setIsFirstValueSetted] = useState(false);
  const [isRateMerged, setIsRateMerged] = useState(true);

  // Service cost------------------------------------
  const [rowsPerIndex, setRowsPerIndex] = useState({});

  const [totalAmount, setTotalAmount] = useState(0);
  const [dayWiseTotals, setDayWiseTotals] = useState({});

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isHoveredDetails, setIsHoveredDetails] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const [dataIsLoaded, setDataIsLoaded] = useState(true);
  const apiDataLoad = useSelector(
    (state) => state.inineraryServiceDataLoadReducer.activity
  );
  // console.log(activityFormValue, "activityFormValue");

  const postDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("destinationlist");
      setDestinationList(data?.DataList);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    if (!apiDataLoad) return;
    postDataToServer();
  }, [apiDataLoad]);

  // console.log(rateList, "rateList");

  const qoutationDataForeigner = qoutationData?.ExcortDays?.find(
    (item) => item.Type === "Foreigner"
  );

  const formValueInitialization = () => {
    if (qoutationDataForeigner?.Days) {
      const allDayServicesEmpty = qoutationDataForeigner?.Days.some((day) =>
        day?.DayServices?.some((service) => service.ServiceType === "Activity")
      );
      if (allDayServicesEmpty) {
        setCopyChecked(true);
        const initialFormValue = qoutationDataForeigner?.Days?.map((day) => {
          const service = day?.DayServices?.filter(
            (service) => service?.ServiceType == "Activity"
          )[0];

          const { ItemUnitCost } =
            service != undefined ? service?.ServiceDetails.flat(1)[0] : "";

          if (service?.DestinationId) {
            service.DestinationId = parseInt(service.DestinationId);
            service.ServiceId = parseInt(service.ServiceId);
          }

          return {
            id: queryData?.QueryId,
            QuatationNo: qoutationData?.QuotationNumber,
            DayType: "Foreigner",
            Supplier:
              service?.ServiceDetails?.[0]?.ItemSupplierDetail?.ItemSupplierId,
            DayNo: day.Day,
            Escort: 1,
            ActivityTime: service?.ActivityTime,
            Date: day?.Date,
            Destination: service?.DestinationId,
            DestinationUniqueId: day?.DestinationUniqueId,
            DayUniqueId: day?.DayUniqueId,
            ServiceId: service != undefined ? service?.ServiceId : "",
            ServiceMainType:
              service != undefined ? service?.ServiceMainType : "No",
            Supplement: service != undefined ? service?.Supplement : "No",
            Package: service != undefined ? service?.Package : "No",
            Highlights: service != undefined ? service?.Highlights : "No",
            BeforeSS: service != undefined ? service?.BeforeSS : "No",
            Escort: service != undefined ? service?.Escort : "No",
            Description: service?.Description,
            PaxRange: service?.PaxRange,
            Cost: ItemUnitCost,
            NoOfActivity: 1,
            ServiceType:
              service?.ServiceType != "" ? "Activity" : service?.ServiceType,
            ServiceMainType: "No",
            ItemFromDate: qoutationData?.TourSummary?.FromDate,
            ItemToDate: qoutationData?.TourSummary?.ToDate,
            ItemFromTime: "",
            ItemToTime: "",
            RateUniqueId: "",
            PaxInfo: {
              Adults: qoutationData?.Pax?.AdultCount,
              Child: qoutationData?.Pax?.ChildCount,
              Infant: qoutationData?.Pax?.Infant,
              Escort: service?.PaxDetails?.PaxInfo?.Escort,
            },
            ForiegnerPaxInfo: {
              Adults: service?.ForiegnerPaxInfo?.PaxInfo?.Adults,
              Child: service?.ForiegnerPaxInfo?.PaxInfo?.Child,
              Infant: service?.ForiegnerPaxInfo?.PaxInfo?.Infant,
              Escort: service?.ForiegnerPaxInfo?.PaxInfo?.Escort,
            },
          };
        });
        setActivityFormValue(initialFormValue);
        setOriginalActivityForm(initialFormValue);

        const initialRows = {};

        qoutationDataForeigner?.Days?.forEach((day, index) => {
          const service = day?.DayServices?.find(
            (service) => service?.ServiceType === "Activity"
          );

          const mappedRows =
            Array.isArray(service?.AdditionalCost) &&
            service.AdditionalCost.length > 0
              ? service.AdditionalCost.map((cost) => ({
                  upTo: cost?.UpToPax ?? "",
                  rounds: cost?.Rounds ?? "",
                  class: cost?.Class ?? "",
                  duration: cost?.Duration ?? "",
                  amount: cost?.Amount ?? "",
                  remarks: cost?.Remarks ?? "",
                }))
              : [
                  {
                    upTo: "",
                    rounds: "",
                    class: "",
                    duration: "",
                    amount: "",
                    remarks: "",
                  },
                ];

          initialRows[index] = mappedRows;
        });

        setRowsPerIndex(initialRows);
      } else {
        const activityInitialValue = qoutationDataForeigner?.Days?.map(
          (day, ind) => {
            return {
              ...itineraryActivityInitialValue,
              id: queryData?.QueryId,
              DayNo: day.Day,
              Date: day?.Date,
              Destination: day.DestinationId || "",
              DestinationUniqueId: day?.DestinationUniqueId,
              QuatationNo: qoutationData?.QuotationNumber,
              DayUniqueId: day?.DayUniqueId,
              ItemFromDate: qoutationData?.TourSummary?.FromDate,
              ItemToDate: qoutationData?.TourSummary?.ToDate,
              RateUniqueId: "",
              DayType: "Foreigner",
              PaxInfo: {
                Adults: qoutationData?.Pax?.AdultCount,
                Child: qoutationData?.Pax?.ChildCount,
                Infant: "",
                Escort: "",
              },
            };
          }
        );
        setActivityFormValue(activityInitialValue);
        setOriginalActivityForm(activityInitialValue);
      }
    }
    // }
  };

  // activity table form initial value
  useEffect(() => {
    formValueInitialization();
  }, [qoutationData, checkBoxes]);

  // set value into for it's first value from list
  const setFirstValueIntoForm = (index) => {
    const activityId = activityList[index]?.map((item) => item?.id)[0];
    const supplier =
      supplierList[index] != undefined ? supplierList[index][0]?.id : "";
    // console.log(supplier, "supplier");

    setActivityFormValue((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = {
        ...newArr[index],
        ServiceId: activityId,
        SupplierId: supplier,
      };
      return newArr;
    });

    setOriginalActivityForm((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = {
        ...newArr[index],
        ServiceId: activityId,
        SupplierId: supplier,
      };
      return newArr;
    });
  };

  useEffect(() => {
    if (
      !isItineraryEditing &&
      checkBoxes?.includes("activity") &&
      activityList.length > 0 &&
      supplierList.length > 0 &&
      !isFirstValueSetted
    ) {
      activityFormValue?.forEach((item, index) => {
        setFirstValueIntoForm(index);
      });
      setIsFirstValueSetted(true);
    }
  }, [checkBoxes, activityList, supplierList]);

  // getting activity with and without dependencies of activity type
  const getActivityList = async (type, index, destination) => {
    try {
      const { data } = await axiosOther.post("activitymasterlist", {
        // Type: type,
        DestinationId: destination,
      });
      setActivityList((prevArr) => {
        const newArr = [...prevArr];
        newArr[index] = data?.DataList;
        // console.log(newArr, "newArr");
        return newArr;
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    if (!apiDataLoad) return;
    activityFormValue?.forEach((item, index) => {
      getActivityList(item?.ServiceType, index, item?.Destination);
    });
  }, [
    activityFormValue?.map((item) => item?.ServiceType).join(","),
    apiDataLoad,
  ]);

  const handleTableIncrement = (index) => {
    const indexHotel = activityFormValue[index];
    setActivityFormValue((prevArr) => {
      const newArr = [...prevArr];
      newArr.splice(index + 1, 0, { ...indexHotel, isCopied: true });
      return newArr;
    });
    setOriginalActivityForm((prevArr) => {
      const newArr = [...prevArr];
      newArr.splice(index + 1, 0, { ...indexHotel, isCopied: true });
      return newArr;
    });
  };

  const getSupplierList = async (index, id) => {
    try {
      const { data } = await axiosOther.post("supplierlist", {
        Name: "",
        id: "",
        SupplierService: [3],
        DestinationId: [Number(id)],
      });
      setSupplierList((prevArr) => {
        const newArr = [...prevArr];
        newArr[index] = data?.DataList;
        return newArr;
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    if (!apiDataLoad) return;
    activityFormValue?.forEach((item, index) => {
      if (item?.Destination != "") {
        getSupplierList(index, item?.Destination);
      }
    });
  }, [
    activityFormValue?.map((item) => item?.Destination)?.join(","),
    apiDataLoad,
  ]);

  const handleTableDecrement = (index) => {
    const filteredTable = activityFormValue?.filter(
      (item, ind) => ind != index
    );
    setActivityFormValue(filteredTable);
    setOriginalActivityForm(filteredTable);
  };

  const mergeActivityPrice = (index) => {
    const form = activityFormValue[index];
    const rate = rateList[index];

    if (rate && rate.length > 0) {
      const formattedServiceCost = rate[0].RateJson.ServiceCost.map((row) => ({
        upTo: row.UpToPax ? row.UpToPax : "0",
        rounds: row.Rounds ? row.Rounds : "0",
        class: row.Class ? row.Class : "0",
        duration: row.Duration ? row.Duration : "0",
        amount: row.Amount ? row.Amount : "0",
        remarks: row.Remarks ? row.Remarks : "0",
      }));

      setRowsPerIndex((prev) => {
        const safePrev = Array.isArray(prev) ? prev : [];
        const newData = [...safePrev];
        newData[index] = formattedServiceCost;
        return newData;
      });
    } else {
      const defaultServiceCost = [
        {
          upTo: "0",
          rounds: "0",
          class: "0",
          duration: "0",
          amount: "0",
          remarks: "0",
        },
      ];

      setRowsPerIndex((prev) => {
        const safePrev = Array.isArray(prev) ? prev : [];
        const newData = [...safePrev];
        newData[index] = defaultServiceCost;
        return newData;
      });
    }
  };

  useEffect(() => {
    if (
      rateList?.length == qoutationDataForeigner?.Days?.length &&
      isRateMerged
    )
      activityFormValue?.forEach((activity, index) => {
        mergeActivityPrice(index);
      });
  }, [rateList, activityFormValue?.map((item) => item?.ServiceId).join(",")]);

  const handleActivityFormChange = (ind, e) => {
    const { name, value, checked, type } = e.target;

    if (name === "Destination") {
      // Fetch supplier list for the new destination
      getSupplierList(ind, value);
    }

    if (name == "ServiceId") {
      mergeActivityPrice(ind);
    }

    if (name === "Cost") {
      setPaxRangePrice((prevArr) => {
        const newArr = [...prevArr];
        newArr[ind] = { ...newArr[ind], [name]: value, ["type"]: "upto" };
        return newArr;
      });
    }

    if (type == "checkbox") {
      setActivityFormValue((prevArr) => {
        const newArr = [...prevArr];
        newArr[ind] = { ...newArr[ind], [name]: checked ? "Yes" : "No" };
        return newArr;
      });
    } else {
      setActivityFormValue((prevArr) => {
        const newArr = [...prevArr];
        newArr[ind] = { ...newArr[ind], [name]: value };
        return newArr;
      });
      setActivityFormValue((prevArr) => {
        const newArr = [...prevArr];
        newArr[ind] = { ...newArr[ind], [name]: value };
        return newArr;
      });
    }
  };

  const handleFinalSave = async () => {
    try {
      const finalForm = activityFormValue?.map((form, index) => {
        const rows = rowsPerIndex[index] || [];

        const AdditionalCost = rows.map((row) => ({
          UpToPax: row.upTo || "",
          Rounds: row.rounds || "",
          Class: row.class || "",
          Duration: row.duration || "",
          Amount: mathRoundHelper(row.amount) || "",
          Remarks: row.remarks || "",
        }));

        const dayWiseTotalCost = dayWiseTotals[index];
        return {
          ...form,
          AdditionalCost,
          Hike: hikePercent,
          DayType: "Foreigner",
          Sector: fromToDestinationList[index],
          TotalCosting: dayWiseTotalCost,
        };
      });

      // console.log("Hello World", finalForm);

      const filteredFinalForm = finalForm?.filter(
        (form) => form?.ServiceId != ""
      );

      const { data } = await axiosOther.post(
        "update-quotation-activity",
        filteredFinalForm
      );

      if (data?.status == 0) {
        notifyHotError(data?.message);
      }

      if (data?.status == 1) {
        // notifySuccess("Services Added!");
        dispatch(incrementForeignEscortCharges());
        notifyHotSuccess(data?.message);
        dispatch(setTotalActivityPricePax(finalForm?.[0]?.TotalCosting?.Cost));
        dispatch(setQoutationResponseData(data?.data));
      }
    } catch (error) {
      console.log("Error in Activity: ", error);
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
  };

  useEffect(() => {
    const costArr = activityFormValue?.map((activity) => {
      if (activity?.ServiceId != "") {
        if (
          activity?.Cost === null ||
          activity?.Cost === undefined ||
          activity?.Cost === ""
        ) {
          return 0;
        } else {
          return parseInt(activity?.Cost);
        }
      } else {
        return 0;
      }
    });
  }, [
    activityFormValue?.map((activity) => activity?.Cost)?.join(","),
    activityFormValue?.map((activity) => activity?.ServiceId)?.join(","),
  ]);

  // storing guide form into redux store
  useEffect(() => {
    if (Type == "Main") {
      dispatch(setItineraryActivityData(activityFormValue));
    } else {
      dispatch(setLocalItineraryActivityData(activityFormValue));
    }
  }, [activityFormValue]);

  // function settigCopyFormData(activityForm, passedForm) {
  //   if (passedForm?.length > 0) {
  //     setActivityFormValue(passedForm);
  //     setOriginalActivityForm(passedForm);
  //   } else {
  //     setActivityFormValue(activityForm);
  //     setOriginalActivityForm(activityForm);
  //   }
  // }

  // useEffect(() => {
  //   if (Type != "Main" && activityFormData?.length > 0) {
  //     settigCopyFormData(activityFormValue, activityFormData);
  //   }
  // }, [Type, activityFormData]);

  // getting rate data form api
  const getActivityRateApi = async (
    destination,
    index,
    date,
    srvcId,
    Supplier
  ) => {
    // if (activityFormValue[index]?.ServiceId === 0) {
    //   // Agar ServiceId 0 hai to API call skip
    //   setRateList((prevArr) => {
    //     const updated = [...prevArr];
    //     updated[index] = [];
    //     return updated;
    //   });
    //   console.log("ServiceId is 0, skipping API call.");
    //   return;
    // }

    // console.log(destination, index, date, srvcId, "destination, index, date, srvcId");

    const activtiyUID =
      activityList[0] !== undefined
        ? activityList[index]?.find(
            (activity) => activity?.id == activityFormValue[index]?.ServiceId
          )
        : "";
    const SupplierUID =
      supplierList[0] !== undefined
        ? supplierList[index]?.find((activity) => activity?.id == Supplier)
        : "";

    // console.log(activtiyUID, "activtiyUID");

    let token = localStorage.getItem("token");
    let companyid = JSON.parse(token);

    const queryDataFromLocalStroage = JSON.parse(
      localStorage.getItem("query-data")
    );
    // console.log(queryDataFromLocalStroage, "queryDataFromoLcalStroage");

    try {
      const { data } = await axiosOther.post("activitysearchlist", {
        id: "",
        ActivityUID: activtiyUID?.UniqueId,
        CompanyId: companyid?.CompanyUniqueId,
        Destination: destination,
        Date: "",
        SupplierUID: SupplierUID?.UniqueID,
        Year: "",
        ValidFrom:
          queryDataFromLocalStroage?.TravelDateInfo?.ScheduleType == "Date Wise"
            ? date
            : queryData?.QueryAllData?.TravelDateInfo?.FromDate,
        ValidTo:
          queryDataFromLocalStroage?.TravelDateInfo?.ScheduleType == "Date Wise"
            ? date
            : queryData?.QueryAllData?.TravelDateInfo?.ToDate,
        TotalActivity: "",
        QueryId: queryData?.QueryId,
        QuatationNo: qoutationData?.QuotationNumber,
        Type: "",
      });

      const result = data?.Status == 0 ? [] : data?.Data || [];

      if (
        data?.TotalRecords > 0 &&
        data?.Data &&
        data.Data.length > 0 &&
        data.Data[0]?.RateJson?.ServiceCost &&
        data.Data[0].RateJson.ServiceCost.length > 0
      ) {
        setRateList((prevArr) => {
          const updated = [...prevArr];
          updated[index] = result;
          return updated;
        });
      } else {
        setRateList((prevArr) => {
          const updated = [...prevArr];
          updated[index] = [];
          return updated;
        });
      }
    } catch (error) {
      console.log("rate-err", error);
      setRateList((prevArr) => {
        const updated = [...prevArr];
        updated[index] = [];
        return updated;
      });
    }
  };

  useEffect(() => {
    // if (!apiDataLoad) return;
    activityFormValue?.forEach((form, index) => {
      getActivityRateApi(
        form?.DestinationUniqueId,
        index,
        form?.Date,
        form?.ServiceId,
        form?.Supplier
      );
    });
  }, [
    activityFormValue?.map((form) => form?.Destination)?.join(","),
    activityFormValue?.map((form) => form?.ServiceId)?.join(","),
    // apiDataLoad,
  ]);

  // toggle of default value in form
  useEffect(() => {
    if (!checkBoxes?.includes("activity")) {
      formValueInitialization();
    }
  }, [checkBoxes]);

  const handlePaxChange = (index, e) => {
    const { name, value } = e.target;
    setPaxFormValue({ ...paxFormValue, [name]: value });
  };

  const handlePaxModalClick = (index) => {
    setModalCentered({ modalIndex: index, isShow: true });

    const form = activityFormValue?.filter((form, ind) => ind == index)[0];
    setPaxFormValue({
      Adults: form?.PaxInfo?.Adults,
      Child: form?.PaxInfo?.Child,
      Infant: form?.PaxInfo?.Infant,
    });
  };

  const handlePaxSave = () => {
    setActivityFormValue((prevForm) => {
      const newForm = [...prevForm];
      newForm[modalCentered?.modalIndex] = {
        ...newForm[modalCentered?.modalIndex],
        PaxInfo: paxFormValue,
      };
      return newForm;
    });
    setOriginalActivityForm((prevForm) => {
      const newForm = [...prevForm];
      newForm[modalCentered?.modalIndex] = {
        ...newForm[modalCentered?.modalIndex],
        PaxInfo: paxFormValue,
      };
      return newForm;
    });
    setModalCentered({ modalIndex: "", isShow: false });
  };

  const handleHikeChange = (e) => {
    const { value } = e.target;
    setHikePercent(value);

    const updatedData = originalActivityForm?.map((item) => {
      return {
        ...item,
        Hike: value,
        Cost:
          item?.Cost && !isNaN(item?.Cost)
            ? Math.floor(
                parseFloat(item?.Cost) + (parseFloat(item?.Cost) * value) / 100
              )
            : item?.Cost,
      };
    });
    setActivityFormValue(updatedData);
  };

  useEffect(() => {
    const calculateTotalPrice = (data) => {
      let totalPrice = 0;

      data.forEach((item) => {
        totalPrice += parseFloat(item.Cost) || 0;
      });

      return totalPrice;
    };

    const filteredForm = activityFormValue?.filter(
      (form) => form?.ServiceId != ""
    );
    const totalCost = calculateTotalPrice(filteredForm);

    dispatch(
      setActivityPrice(parseInt(totalCost) + parseInt((totalCost * 5) / 100))
    );
    dispatch(setTogglePriceState());

    setActivityPriceCalculation((prevData) => ({
      ...prevData,
      Price: totalCost,
      MarkupOfCost: (totalCost * 5) / 100,
    }));
  }, [
    activityFormValue?.map((item) => item?.Cost).join(","),
    activityFormValue?.map((item) => item?.ServiceId).join(","),
    hikePercent,
  ]);

  const handleAllSupplementChange = (e) => {
    const { name, value, checked } = e.target;
    setActivityFormValue((prevArr) => {
      const newArr = [...prevArr];
      return newArr.map((form) => {
        return {
          ...form,
          [name]: checked ? "Yes" : "No",
        };
      });
    });
  };

  // calculating from destination & to destination
  useEffect(() => {
    const destinations = activityFormValue?.map(
      (activity, index, activityArr) => {
        return {
          From: activity?.Destination,
          To: activityArr[index + 1]?.Destination,
        };
      }
    );

    const currAndPrevDest = destinations?.map((dest, ind) => {
      const currentAndPrev =
        dest?.From == destinations[ind - 1]?.From
          ? { From: dest?.From, To: "" }
          : { From: dest?.From, To: destinations[ind - 1]?.From };
      return currentAndPrev;
    });

    const FromToDestination = currAndPrevDest?.map((item) => {
      const filteredFromDest = destinationList.find(
        (dests) => dests?.id == item?.From
      );
      const filteredToDest = destinationList.find(
        (dests) => dests?.id == item?.To
      );

      if (filteredToDest != undefined) {
        return `${filteredToDest?.Name} To ${filteredFromDest?.Name}`;
      } else {
        return filteredFromDest?.Name;
      }
    });

    setFromToDestinationList(FromToDestination);
  }, [
    activityFormValue?.map((activity) => activity?.Destination).join(","),
    destinationList,
  ]);

  // Service cost------------------------------------

  useEffect(() => {
    if (!hasInitialized.current && activityFormValue.length > 0) {
      const firstItem = activityFormValue[0];
      setSelectedIndex(0);
      setSelectedRowData(firstItem);
      setShowDetails(true);

      setRowsPerIndex((prev) => {
        if (!prev[0]) {
          return {
            ...prev,
            0: [
              {
                upTo: "",
                rounds: "",
                class: "",
                duration: "",
                amount: "",
                remarks: "",
              },
            ],
          };
        }
        return prev;
      });

      hasInitialized.current = true;
    }
  }, [activityFormValue]);

  useEffect(() => {
    if (Object.keys(rowsPerIndex).length > 0) {
      calculateTotalAmount(rowsPerIndex);
    }
  }, [rowsPerIndex]);

  const calculateTotalAmount = (rowsMap) => {
    let total = 0;
    Object.values(rowsMap).forEach((rows) => {
      const firstvalue = rows?.[0];
      // console.log(firstvalue,"firstvalue")
      if (firstvalue && firstvalue?.amount) {
        total += parseFloat(firstvalue.amount) * firstvalue.rounds || 0;
      }
    });
    setTotalAmount(total);

    // Days Wise total
    const totals = {};

    Object.entries(rowsMap).forEach(([day, rows]) => {
      let totalAmount = 0;

      rows.forEach((row) => {
        const amount = parseFloat(row.amount);
        if (!isNaN(amount)) {
          totalAmount += amount;
        }
      });

      const adultMarkupValue = 5;
      const adultMarkupTotal = (totalAmount * adultMarkupValue) / 100;
      // const total =( totalAmount);

      totals[day] = {
        ActivityCost: mathRoundHelper(total),
        ActivityCostMarkupValue: mathRoundHelper(String(adultMarkupValue)),
        TotalActivityCostMarkup: mathRoundHelper(String(adultMarkupTotal)),
        // TotalActivityCost: String(totalAmount + adultMarkupTotal),
        TotalActivityCost: mathRoundHelper(total + (total * 5) / 100),
      };
      console.log(totals[day], "totals[day]22");
    });
    console.log(totals, "totals22");

    setDayWiseTotals(totals);
  };
  console.log(totalAmount, "totalAmount22");

  const handleChange = (index, field, value) => {
    const key = selectedIndex;
    const updatedRows = [...(rowsPerIndex[key] || [])];
    updatedRows[index][field] = value;
    setRowsPerIndex((prev) => ({
      ...prev,
      [key]: updatedRows,
    }));
  };

  const handleAddRow = () => {
    const key = selectedIndex;
    const newRow = {
      upTo: "",
      rounds: "",
      class: "",
      duration: "",
      amount: "",
      remarks: "",
    };
    setRowsPerIndex((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), newRow],
    }));
  };

  const handleDeleteRow = (index) => {
    const key = selectedIndex;
    const updatedRows = (rowsPerIndex[key] || []).filter((_, i) => i !== index);
    setRowsPerIndex((prev) => ({
      ...prev,
      [key]: updatedRows,
    }));
  };

  const handleShowDetails = (item, index) => {
    if (selectedIndex === index) {
      setSelectedIndex(null);
      setShowDetails(false);
    } else {
      setSelectedIndex(index);
      setSelectedRowData(item);
      setShowDetails(true);

      // Initialize rows for that index if not present
      if (!rowsPerIndex[index]) {
        setRowsPerIndex((prev) => ({
          ...prev,
          [index]: [
            {
              upTo: "",
              rounds: "",
              class: "",
              duration: "",
              amount: "",
              remarks: "",
            },
          ],
        }));
      }
    }
  };

  const handleIsOpen = () => {
    if (dataIsLoaded) {
      dispatch({
        type: "SET_ACTIVITY_DATA_LOAD",
        payload: true,
      });
      setDataIsLoaded(false);
    }

    setIsOpen(!isOpen);
  };

  useEffect(() => {
    return () => {
      dispatch({
        type: "SET_ACTIVITY_DATA_LOAD",
        payload: false,
      });
    };
  }, []);

  // ==============================================

  // console.log(activityFormValue, "activityFormValue");

  // store value in redux store

  // useEffect(() => {
  //   if (Type == "Main") {
  //     dispatch(setItineraryFlightData(flightFormValue));
  //   }
  // }, [flightFormValue]);

  // copy functionality to copy type main to local and foreign

  // useEffect(() => {
  //   if (Type !== "Main" && flightFormData?.length > 0) {
  //     if (copyChecked) {
  //       setBackupFlightForms(flightFormValue);
  //       setFlightFormValue(flightFormData);
  //       setFlightOriginalForm(flightFormData);
  //     } else if (backupFlightForms.length > 0) {
  //       setFlightFormValue(backupFlightForms);
  //       setFlightOriginalForm(backupFlightForms);
  //       setBackupFlightForms([]);
  //     }
  //   }
  // }, [copyChecked, flightFormData]);
  // console.log(totalFAdultCost, "totalFAdultCost");

  // ==============================================
  const mainFormValue = useSelector(
    (state) => state.itineraryServiceCopyReducer.activityData
  );
  const [copyFromValue, setCopyFormValue] = useState([]);
  const [copyCosting, setCopyCosting] = useState([]);
  const additionalCheckbox = useSelector(
    (state) => state.itineraryServiceCopyReducer.activityCheckbox
  );

  // Copy data from main
  const handleCopyDataFromMain = (e) => {
    const { checked } = e.target;
    setCopyFormValue(activityFormValue);
    setCopyCosting(rowsPerIndex);

    if (checked) {
      console.log(mainFormValue, "ACT582", activityFormValue);
      const updatedAdditional = mainFormValue?.ActivityForm?.map(
        (sourceActivity, index) => {
          const formActivity = activityFormValue?.find(
            (h) => h?.DayNo == sourceActivity?.DayNo
          );
          console.log(
            mainFormValue?.ActivityForm?.[index]?.Supplier,
            "formActivity"
          );
          return {
            ...sourceActivity,
            DayType: "Foreigner",
            DayUniqueId: formActivity?.DayUniqueId,
            Supplier: mainFormValue?.ActivityForm?.[index]?.Supplier,
          };
        }
      );
      console.log(updatedAdditional, "GDVCH8777");
      setActivityFormValue(updatedAdditional);
      const updatedCosting = JSON.parse(JSON.stringify(mainFormValue.Costing));
      setRowsPerIndex(updatedCosting);
      setCopyChecked(true);
      // dispatch(setItineraryCopyActivityFormDataCheckbox({ local: false }));
    } else {
      setCopyChecked(false);
      setActivityFormValue(copyFromValue);
      setRowsPerIndex(copyCosting);
    }
  };

  console.log(activityFormValue, "activityFormValue7446");

  return (
    <div className="row mt-3 m-0">
      <div
        className="col-12 px-1 py-2 d-flex justify-content-between itinerary-head-bg foreignerEscort-head-bg"
        onClick={handleIsOpen}
      >
        <div className="d-flex gap-4 align-items-center">
          <div className="d-flex gap-2">
            <img src={ActivityIcon} alt="ActivityIcon" />
            <label htmlFor="" className="fs-5">
              Activity
            </label>
          </div>
          <div className="d-flex gap-4 align-items-center">
            <div
              className="d-flex gap-1 form-check"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="checkbox"
                className="form-check-input check-md"
                id="copy-hotel"
                value="extrabed"
                checked={copyChecked}
                onChange={(e) => handleCopyDataFromMain(e)}
              />
              <label className="fontSize11px m-0 ms-1 " htmlFor="copy-hotel">
                Copy
              </label>
            </div>
          </div>
        </div>
        <div className="d-flex gap-4 align-items-center ms-auto">
          {" "}
          {/* Added ms-auto */}
          {Type == "Main" && (
            <div
              className="d-flex gap-2 align-items-center hike-input"
              onClick={(e) => e.stopPropagation()}
            >
              <label htmlFor="" className="fs-6">
                Hike
              </label>
              <input
                type="number"
                className={`formControl3`}
                value={hikePercent}
                onChange={handleHikeChange}
              />
              <span className="fs-6">%</span>
            </div>
          )}
          <div className="form-check check-sm d-flex align-items-center">
            <input
              type="checkbox"
              className="form-check-input height-em-1 width-em-1"
              id="no_of_activity"
              value="1"
              checked={showNoOfActivity}
              onChange={(e) => setShowNoOfActivity(e.target.checked)}
            />
            <label
              className="fontSize11px m-0 ms-1 mt-1"
              htmlFor="no_of_activity"
            >
              No Of Activity
            </label>
          </div>
          <div>
            <span className="cursor-pointer fs-5">
              {!isOpen ? (
                <FaChevronCircleUp
                  className="text-primary"
                  onClick={(e) => {
                    e.stopPropagation(), setIsOpen(!isOpen);
                  }}
                />
              ) : (
                <FaChevronCircleDown
                  className="text-primary"
                  onClick={(e) => {
                    e.stopPropagation(), setIsOpen(!isOpen);
                  }}
                />
              )}
            </span>
          </div>
        </div>
      </div>
      <Modal
        className="fade bd-example-modal-sm"
        size="sm"
        show={modalCentered?.isShow}
      >
        <Modal.Header>
          <Modal.Title>Add Pax</Modal.Title>
          <Button
            variant=""
            className="btn-close"
            onClick={() => setModalCentered({ modalIndex: "", isShow: false })}
          ></Button>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col className="col-4">
              <label htmlFor="shortName">Adult</label>
              <input
                type="text"
                className={`form-control form-control-sm`}
                name="Adults"
                placeholder="Pax"
                value={paxFormValue?.Adults}
                onChange={(e) => handlePaxChange(modalCentered.modalIndex, e)}
              />
            </Col>
            <Col className="col-4">
              <label htmlFor="shortName">Child</label>
              <input
                type="text"
                className={`form-control form-control-sm`}
                name="Child"
                placeholder="Pax"
                value={paxFormValue?.Child}
                onChange={(e) => handlePaxChange(modalCentered.modalIndex, e)}
              />
            </Col>
            <Col className="col-4">
              <label htmlFor="shortName">Infant</label>
              <input
                type="text"
                className={`form-control form-control-sm`}
                name="Infant"
                placeholder="Pax"
                value={paxFormValue.Infant}
                onChange={(e) => handlePaxChange(modalCentered.modalIndex, e)}
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger light"
            onClick={() => setModalCentered({ modalIndex: "", isShow: false })}
            className="btn-custom-size"
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handlePaxSave}
            className="btn-custom-size"
          >
            Save changes
          </Button>
        </Modal.Footer>
      </Modal>
      {isOpen && (
        <>
          <div className="d-flex gap-4 col-12 px-0 mt-2">
            {/* Left Table ---------------------------------------------------------*/}
            <div className={`${styles.scrollContainer}`}>
              <table class="table table-bordered itinerary-table">
                <thead>
                  <tr>
                    <th
                      className="text-start days-width-9 align-middle px-5"
                      rowSpan={2}
                    >
                      {activityFormValue[0]?.Date ? "Day / Date" : "Day"}
                    </th>
                    {(Type == "Local" || Type == "Foreigner") && (
                      <th rowSpan={2} className="py-1 align-middle">
                        Escort
                      </th>
                    )}
                    <th rowSpan={2} className="align-middle">
                      Destination
                    </th>
                    <th rowSpan={2} className="align-middle">
                      Service Type
                    </th>
                    <th rowSpan={2} className="align-middle">
                      Service
                    </th>
                    <th rowSpan={2} className="align-middle">
                      Supplier
                    </th>
                    <th rowSpan={2} className="align-middle">
                      Time
                    </th>
                    {/* <th>Suplement</th>
                    <th>Package</th>
                    <th>Highlight</th>
                    <th>Before SS</th>
                    <th>Escort</th> */}
                    <th>
                      <div className="form-check check-sm  d-flex align-items-center justify-content-center">
                        <input
                          name="Supplement"
                          type="checkbox"
                          className="form-check-input height-em-1 width-em-1"
                          id="no_of_activity"
                          checked={activityFormValue?.every(
                            (form) => form?.Supplement == "Yes"
                          )}
                          onChange={handleAllSupplementChange}
                        />
                      </div>
                    </th>
                    {/* <th>
                      <div className="form-check check-sm  d-flex align-items-center justify-content-center">
                        <input
                          name="Package"
                          type="checkbox"
                          className="form-check-input height-em-1 width-em-1"
                          id="no_of_activity"
                          checked={activityFormValue?.every(
                            (form) => form?.Package == "Yes"
                          )}
                          onChange={handleAllSupplementChange}
                        />
                      </div>
                    </th> */}
                    <th>
                      <div className="form-check check-sm  d-flex align-items-center justify-content-center">
                        <input
                          name="Highlights"
                          type="checkbox"
                          className="form-check-input height-em-1 width-em-1"
                          id="no_of_activity"
                          checked={activityFormValue?.every(
                            (form) => form?.Highlights == "Yes"
                          )}
                          onChange={handleAllSupplementChange}
                        />
                      </div>
                    </th>
                    <th>
                      <div className="form-check check-sm  d-flex align-items-center justify-content-center">
                        <input
                          name="BeforeSS"
                          type="checkbox"
                          className="form-check-input height-em-1 width-em-1"
                          id="no_of_activity"
                          checked={activityFormValue?.every(
                            (form) => form?.BeforeSS == "Yes"
                          )}
                          onChange={handleAllSupplementChange}
                        />
                      </div>
                    </th>
                    {/* <th>
                      <div className="form-check check-sm  d-flex align-items-center justify-content-center">
                        <input
                          name="Escort"
                          type="checkbox"
                          className="form-check-input height-em-1 width-em-1"
                          id="no_of_activity"
                          checked={activityFormValue?.every(
                            (form) => form?.Escort == "Yes"
                          )}
                          onChange={handleAllSupplementChange}
                        />
                      </div>
                    </th> */}
                    {/* <th rowSpan={2} className="align-middle">
                      Remark
                    </th>
                    <th rowSpan={2} className="align-middle">
                      Pax Range
                    </th> */}
                    {showNoOfActivity && (
                      <th rowSpan={2} className="align-middle">
                        No Of Activity
                      </th>
                    )}
                    {/* <th rowSpan={2} className="align-middle">
                      Cost
                    </th> */}
                  </tr>
                  <tr>
                    <th>Suplement</th>
                    {/* <th>Package</th> */}
                    <th>Highlight</th>
                    <th>Before SS</th>
                    {/* <th>Escort</th> */}
                  </tr>
                </thead>
                <tbody>
                  {activityFormValue?.map((item, index) => {
                    return (
                      <tr
                        className={
                          selectedIndex === index ? "selectedIndexActive" : ""
                        }
                        key={index + 1 + "x"}
                      >
                        <td
                          onClick={() => handleShowDetails(item, index)}
                          onMouseEnter={() => setHoveredIndex(index)}
                          onMouseLeave={() => setHoveredIndex(null)}
                          key={index}
                          className="days-width-9"
                        >
                          <div className="d-flex gap-1 justify-content-start">
                            <div className="d-flex gap-1">
                              <div
                                className="d-flex align-items-center pax-icon"
                                onClick={() => handlePaxModalClick(index)}
                              >
                                <i className="fa-solid fa-person"></i>
                              </div>

                              <span onClick={() => handleTableIncrement(index)}>
                                <i className="la la-plus border cursor-pointer bg-success text-white rounded-pill fontSize10px padding1px"></i>
                              </span>

                              <span onClick={() => handleTableDecrement(index)}>
                                <i className="la la-minus border cursor-pointer bg-primary text-white rounded-pill fontSize10px padding1px"></i>
                              </span>
                            </div>
                            {item?.Date ? (
                              <span
                                style={{
                                  textWrap: "nowrap",
                                  marginRight: "5px",
                                }}
                              >
                                {" "}
                                {item?.Date ? (
                                  <span
                                    style={{
                                      textWrap: "nowrap",
                                      marginRight: "5px",
                                    }}
                                  >
                                    {" "}
                                    <div className="d-flex gap-2">
                                      <div>{`Day ${item?.DayNo}`}</div>
                                      <div>{`${moment(item?.Date).format(
                                        "DD-MM-YYYY"
                                      )}`}</div>
                                    </div>
                                  </span>
                                ) : (
                                  <span>{`Day ${item?.DayNo}`}</span>
                                )}
                              </span>
                            ) : (
                              <span>{`Day ${item?.DayNo}`}</span>
                            )}
                          </div>
                        </td>
                        {(Type == "Local" || Type == "Foreigner") && (
                          <td style={{ width: "30px" }}>
                            <div>
                              <input
                                name="Escort"
                                type="number"
                                style={{ width: "30px" }}
                                className={`formControl1`}
                                value={activityFormValue[index]?.Escort}
                                onChange={(e) =>
                                  handleActivityFormChange(index, e)
                                }
                              />
                            </div>
                          </td>
                        )}
                        <td>
                          <div>
                            <select
                              name="Destination"
                              id=""
                              className="formControl1"
                              value={activityFormValue[index]?.Destination}
                              onChange={(e) =>
                                handleActivityFormChange(index, e)
                              }
                            >
                              <option value="">Select</option>
                              {qoutationDataForeigner?.Days?.map(
                                (qout, index) => {
                                  return (
                                    <option
                                      value={qout?.DestinationId}
                                      key={index + 1}
                                    >
                                      {qout?.DestinationName}
                                    </option>
                                  );
                                }
                              )}
                            </select>
                          </div>
                        </td>
                        <td>
                          <div>
                            <select
                              name="ServiceType"
                              id=""
                              className="formControl1"
                              onChange={(e) =>
                                handleActivityFormChange(index, e)
                              }
                              value={activityFormValue[index]?.ServiceType}
                            >
                              <option value="">Select</option>
                              <option value="Activity">Activity</option>
                              <option value="Experience">Experience</option>
                            </select>
                          </div>
                        </td>
                        <td>
                          <div>
                            <select
                              name="ServiceId"
                              id=""
                              className="formControl1"
                              onChange={(e) =>
                                handleActivityFormChange(index, e)
                              }
                              value={activityFormValue[index]?.ServiceId}
                            >
                              <option value="">Select</option>
                              {activityList[index]?.map((activity, index) => {
                                return (
                                  <option value={activity?.id} key={index}>
                                    {activity?.ServiceName}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        </td>
                        <td>
                          <div>
                            <select
                              name="SupplierId"
                              id=""
                              className="formControl1"
                              value={activityFormValue[index]?.Supplier}
                              onChange={(e) =>
                                handleActivityFormChange(index, e)
                              }
                            >
                              <option value="">Select</option>
                              {supplierList[index]?.map((supp, index) => {
                                return (
                                  <option value={supp?.id} key={index + 1}>
                                    {supp?.Name}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        </td>
                        <td>
                          <div>
                            <select
                              name="ActivityTime"
                              id=""
                              className="formControl1"
                              value={activityFormValue[index]?.ActivityTime}
                              onChange={(e) =>
                                handleActivityFormChange(index, e)
                              }
                            >
                              <option value="None">None</option>
                              <option value="EarlyMorning">
                                Early Morning
                              </option>
                              <option value="Morning">Morning</option>
                              <option value="Afternoon">Afternoon</option>
                              <option value="Evening">Evening</option>
                            </select>
                          </div>
                        </td>
                        <td>
                          <div className="form-check check-sm  d-flex align-items-center justify-content-center">
                            <input
                              name="Supplement"
                              type="checkbox"
                              className="form-check-input height-em-1 width-em-1"
                              id="no_of_activity"
                              checked={
                                activityFormValue[index]?.Supplement == "Yes"
                              }
                              onChange={(e) =>
                                handleActivityFormChange(index, e)
                              }
                            />
                          </div>
                        </td>
                        {/* <td>
                          <div className="form-check check-sm  d-flex align-items-center justify-content-center">
                            <input
                              name="Package"
                              type="checkbox"
                              className="form-check-input height-em-1 width-em-1"
                              id="no_of_activity"
                              checked={
                                activityFormValue[index]?.Package == "Yes"
                              }
                              onChange={(e) =>
                                handleActivityFormChange(index, e)
                              }
                            />
                          </div>
                        </td> */}
                        <td>
                          <div className="form-check check-sm  d-flex align-items-center justify-content-center">
                            <input
                              name="Highlights"
                              type="checkbox"
                              className="form-check-input height-em-1 width-em-1"
                              id="no_of_activity"
                              checked={
                                activityFormValue[index]?.Highlights == "Yes"
                              }
                              onChange={(e) =>
                                handleActivityFormChange(index, e)
                              }
                            />
                          </div>
                        </td>
                        <td>
                          <div className="form-check check-sm  d-flex align-items-center justify-content-center">
                            <input
                              name="BeforeSS"
                              type="checkbox"
                              className="form-check-input height-em-1 width-em-1"
                              id="no_of_activity"
                              checked={
                                activityFormValue[index]?.BeforeSS == "Yes"
                              }
                              onChange={(e) =>
                                handleActivityFormChange(index, e)
                              }
                            />
                          </div>
                        </td>
                        {/* <td>
                          <div className="form-check check-sm  d-flex align-items-center justify-content-center">
                            <input
                              name="Escort"
                              type="checkbox"
                              className="form-check-input height-em-1 width-em-1"
                              id="no_of_activity"
                              checked={
                                activityFormValue[index]?.Escort == "Yes"
                              }
                              onChange={(e) =>
                                handleActivityFormChange(index, e)
                              }
                            />
                          </div>
                        </td> */}
                        {/* <td>
                          <div>
                            <textarea
                              id=""
                              className="formControl1"
                              name="Description"
                              value={activityFormValue[index]?.Description}
                              onChange={(e) =>
                                handleActivityFormChange(index, e)
                              }
                            ></textarea>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex gap-1 justify-content-center align-items-center">
                            <span>
                              <strong>Up To</strong>
                            </span>
                            <input
                              type="number"
                              className="formControl1"
                              name="PaxRange"
                              value={activityFormValue[index]?.PaxRange}
                              onChange={(e) =>
                                handleActivityFormChange(index, e)
                              }
                            />
                          </div>
                        </td> */}
                        {showNoOfActivity && (
                          <td>
                            <div>
                              <input
                                type="number"
                                className="formControl1"
                                name="NoOfActivity"
                                value={activityFormValue[index]?.NoOfActivity}
                                onChange={(e) =>
                                  handleActivityFormChange(index, e)
                                }
                              />
                            </div>
                          </td>
                        )}
                        {/* <td>
                          <div>
                            <input
                              type="number"
                              name="Cost"
                              className="formControl1"
                              value={activityFormValue[index]?.Cost}
                              onChange={(e) =>
                                handleActivityFormChange(index, e)
                              }
                            />
                          </div>
                        </td> */}
                      </tr>
                    );
                  })}
                  {/* <tr className="costing-td">
                    <td
                      colSpan={Type == "Local" || Type == "Foreigner" ? 3 : 5}
                      className="text-center fs-6"
                      rowSpan={3}
                    >
                      Total
                    </td>

                    <td colSpan={3}>Additional Cost</td>
                    <td>{mathRoundHelper(totalAmount)}</td>
                  </tr>
                  <tr className="costing-td">
                    <td colSpan={3}>Markup(5) %</td>
                    <td>{mathRoundHelper((totalAmount * 5) / 100)}</td>
                  </tr>
                  <tr className="costing-td">
                    <td colSpan={3}>Total</td>
                    <td>{mathRoundHelper(totalAmount + (totalAmount * 5) / 100)}</td>
                  </tr> */}
                </tbody>
              </table>
            </div>
            {/* Right Table----------------------------------------------------------- */}
            {showDetails ? (
              <div className={`${styles.tableRight} ${styles.scrollContainer}`}>
                <table className="table table-bordered itinerary-table text-center">
                  <thead>
                    <tr>
                      <th colSpan={7} className="align-middle text-center">
                        Day {selectedRowData?.DayNo} Service Cost
                      </th>
                    </tr>
                    <tr>
                      <th>Up to</th>
                      <th>Rounds</th>
                      <th>Class</th>
                      <th>Duration</th>
                      <th>Amount</th>
                      <th>Remarks</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowsPerIndex[selectedIndex]?.map((rowData, index) => (
                      <tr key={index}>
                        <td>
                          <input
                            type="number"
                            className="formControl1"
                            value={rowData.upTo}
                            onChange={(e) =>
                              handleChange(index, "upTo", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="formControl1"
                            value={rowData.rounds}
                            onChange={(e) =>
                              handleChange(index, "rounds", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="formControl1"
                            value={rowData.class}
                            onChange={(e) =>
                              handleChange(index, "class", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="formControl1"
                            value={rowData.duration}
                            onChange={(e) =>
                              handleChange(index, "duration", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="formControl1"
                            value={rowData.amount}
                            onChange={(e) =>
                              handleChange(index, "amount", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="formControl1"
                            value={rowData.remarks}
                            onChange={(e) =>
                              handleChange(index, "remarks", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          {index === 0 ? (
                            <span className="fs-4" onClick={handleAddRow}>
                              +
                            </span>
                          ) : (
                            <span
                              className="fs-4"
                              onClick={() => handleDeleteRow(index)}
                            >
                              -
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="col-12 d-flex justify-content-end align-items-end">
            <button
              className="btn btn-primary py-1 px-2 radius-4"
              onClick={handleFinalSave}
            >
              <i className="fa-solid fa-floppy-disk fs-4"></i>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ForeignerActivity;
