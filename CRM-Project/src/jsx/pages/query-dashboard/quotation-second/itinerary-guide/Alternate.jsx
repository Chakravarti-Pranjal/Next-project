import React, { useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { axiosOther } from "../../../../../http/axios_base_url";
import { itineraryGuideIntialValue } from "../qoutation_initial_value";
import { notifyError, notifySuccess } from "../../../../../helper/notify";
import GuideIcon from "../../../../../images/itinerary/guide.svg";
import {
  setGuidePrice,
  setTogglePriceState,
  setTotalGuidePricePax,
} from "../../../../../store/actions/PriceAction";
import { setItineraryGuideData } from "../../../../../store/actions/itineraryDataAction";
import { checkPrice } from "../../../../../helper/checkPrice";
import {
  FaChevronCircleUp,
  FaChevronCircleDown,
  FaMinus,
  FaPlus,
} from "react-icons/fa";
import { setGuideServiceForm } from "../../../../../store/actions/ItineraryServiceAction";
import { Modal, Row, Col, Button } from "react-bootstrap";
import { setQoutationResponseData } from "../../../../../store/actions/queryAction";

import { setQoutationData } from "../../../../../store/actions/queryAction";
import Supplier from "../../../masters/supplier";
import moment from "moment";
import IsDataLoading from "../IsDataLoading";

const Guidealternate = ({ Type, checkBoxes, headerDropdown }) => {
  console.log(checkBoxes, "checkBoxes");

  const { qoutationData, queryData, dayTypeArr, isItineraryEditing } =
    useSelector((data) => data?.queryReducer);
  const { AutoGuideCheck } = useSelector(
    (data) => data?.ItineraryServiceReducer
  );

  const apiDataLoad = useSelector(
    (state) => state.inineraryServiceDataLoadReducer.guide
  );

  const [originalGuideForm, setOriginalGuideForm] = useState([]);
  const [copyChecked, setCopyChecked] = useState(false);
  const [showDetails, setShowDetails] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [backupGuideForms, setBackupGuideForms] = useState([]);
  const [guideTotals, setGuideTotals] = useState({});
  const [laTotals, setLaTotals] = useState({});
  const [othersTotals, setOthersTotals] = useState({});
  const [guideFormValue, setGuideFormValue] = useState([]);
  const [languageList, setLanguageList] = useState([]);
  const [destinationList, setDestinationList] = useState([]);
  const [rowsPerIndex, setRowsPerIndex] = useState({});
  const [selectedRowData, setSelectedRowData] = useState(null);
  const hasInitialized = useRef(false);
  const [guideList, setGuideList] = useState([]);
  const prevRateListRef = useRef([]);
  const prevGuideFormValueRef = useRef([]);

  const [isMergeAllowed, setIsMergeAllowed] = useState(false);
  const [languageValue, setLanguageValue] = useState([]);
  const { guideFormData } = useSelector((data) => data?.itineraryReducer);
  const [rateList, setRateList] = useState([]);
  const [supplement, setSupplement] = useState(false);
  const [defaultLanguage, setDefaultLanguage] = useState("610");
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isRateLoading, setIsRateLoading] = useState(true);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState({
    original: false,
    copy: false,
  });
  const [guideCopy, setGuideCopy] = useState(false);
  const { GuideService } = useSelector((data) => data?.ItineraryServiceReducer);
  const [hikePercent, setHikePercent] = useState(0);
  const [indexrow, setindexrow] = useState(null);
  const [serviceCostData, setServiceCostData] = useState([
    {
      StartPax: "",
      EndPax: "",

      ServiceGuideFee: "",
      ServiceGuideMarkupValue: "",
      TotalGuideFeeMarkup: "",
      TotalGuideServiceCost: "",

      ServiceLanguageCost: "",
      ServiceLanguageMarkupValue: "",
      TotalLanguageMarkup: "",
      TotalLanguageServiceCost: "",

      ServiceOtherCost: "",
      ServiceOtherMarkupValue: "0",
      TotalOtherMarkup: "",
      TotalOtherServiceCost: "0",

      ServiceTotalCost: "",
      ServiceTotalMarkupValue: "",
      TotalSerrviceMarkup: "",
      TotalServiceCost: "",
    },
  ]);
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
  const [isAlternate, setIsAlternate] = useState(false);
  const [guideRateCalculation, setGuideRateCalculation] = useState({
    Price: {
      GuideFee: "",
      Allowence: "",
      Other: "",
      Total: "",
    },
    Markup: {
      GuideFee: "",
      LanguageAllowance: "",
      OtherCost: "",
      Total: "",
    },
    MarkupOfCost: {
      GuideFee: "",
      LanguageAllowance: "",
      OtherCost: "",
      Total: "",
    },
  });
  const [fromToDestinationList, setFromToDestinationList] = useState([]);
  const [isRateMerge, setIsRateMerge] = useState(true);

  // Itinerary tab change
  const itinerarayTab = useSelector(
    (state) => state.tabWiseDataLoadReducer.tab
  );

  // guide table form initial value
  // console.log(dayTypeArr,"dayTypeArr")
  const formValueInitialization = () => {
    if (qoutationData?.Days) {
      const data = qoutationData?.Days;
      const allDayServicesEmpty = data?.every(
        (day) => day?.DayServices?.length === 0
      );

      const selectedTab =
        itinerarayTab.charAt(0).toUpperCase() + itinerarayTab.slice(1);

      const dataLocalForeigner = qoutationData?.ExcortDays?.find(
        (item) => item.Type === selectedTab
      )?.Days;

      let isExcortDaysCreated = dataLocalForeigner?.every(
        (day) => day.DayServices.length === 0
      );

      if (isExcortDaysCreated === undefined) {
        isExcortDaysCreated = true;
      }

      const isDayServiceCreated =
        itinerarayTab === "main-itinerary"
          ? allDayServicesEmpty
          : isExcortDaysCreated;

      if (!isDayServiceCreated) {
        let tabWiseData = [];

        if (!isExcortDaysCreated && itinerarayTab) {
          const dataDayWise = qoutationData?.ExcortDays?.find(
            (item) => item.Type === selectedTab
          )?.Days;

          tabWiseData = dataDayWise?.filter((day, index, daysArray) => {
            const previousEnrouteId = daysArray[index - 1]?.EnrouteId;
            if (
              previousEnrouteId != null &&
              previousEnrouteId !== "" &&
              previousEnrouteId === day?.DestinationId
            ) {
              return false;
            }
            return true;
          });
        } else {
          tabWiseData = qoutationData?.Days?.filter((day, index, daysArray) => {
            const previousEnrouteId = daysArray[index - 1]?.EnrouteId;
            if (
              previousEnrouteId != null &&
              previousEnrouteId !== "" &&
              previousEnrouteId === day?.DestinationId
            ) {
              return false;
            }
            return true;
          });
        }

        const initialFormValue = tabWiseData.map((day) => {
          const service = day?.DayServices?.filter(
            (service) =>
              service?.ServiceType == "Guide" &&
              service?.ServiceMainType == "Guide Suppliment"
          )[0];

          if (service?.DestinationId) {
            service.DestinationId = parseInt(service.DestinationId);
            service.LanguageId = parseInt(service.LanguageId);
          }

          const details = service?.ServiceDetails.flat(1)[0] || "";
          console.log(service, "serviceGuideSuppliment");

          return {
            id: queryData?.QueryId,
            Type: Type,
            DayNo: day.Day,
            Date: day?.Date,
            Destination: day?.DestinationId,
            DestinationUniqueId: day?.DestinationUniqueId,
            QuatationNo: qoutationData?.QuotationNumber,
            DayUniqueId: day?.DayUniqueId,
            ItemFromDate: qoutationData?.TourSummary?.FromDate,
            ItemToDate: qoutationData?.TourSummary?.ToDate,
            ServiceId: service?.ServiceId || " ",
            RateUniqueId: "",
            Escort: "1",
            FromDay: "",
            ToDay: "",
            ItemFromTime: "",
            ItemToTime: "",
            ServiceMainType: "Yes",
            Language: "",
            Supplier: details?.ItemSupplierDetail?.ItemSupplierId,
            Language: service?.LanguageId,
            LanguageAllowance: details?.ItemUnitCost?.LanguageAllowance,
            GuideFee: details?.ItemUnitCost?.GuideCost,
            OtherCost: details?.ItemUnitCost?.OtherCost,
            PaxSlab: "4",
            PaxInfo: {
              Adults: qoutationData?.Pax?.AdultCount,
              Child: qoutationData?.Pax?.ChildCount,
              Infant: qoutationData?.Pax?.Infant,
              Escort: "",
            },
            ForiegnerPaxInfo: {
              Adults: service?.ForiegnerPaxInfo?.PaxInfo?.Adults,
              Child: service?.ForiegnerPaxInfo?.PaxInfo?.Child,
              Infant: service?.ForiegnerPaxInfo?.PaxInfo?.Infant,
              Escort: service?.ForiegnerPaxInfo?.PaxInfo?.Escort,
            },
          };
        });

        const guideInitialValue = tabWiseData?.map((day, ind) => {
          return {
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
            Type: Type,
            PaxInfo: {
              Adults: qoutationData?.Pax?.AdultCount,
              Child: qoutationData?.Pax?.ChildCount,
              Infant: qoutationData?.Pax?.Infant,
              Escort: "",
            },
          };
        });
        dispatch(setGuideServiceForm(guideInitialValue));
        setGuideFormValue(initialFormValue);
        setOriginalGuideForm(initialFormValue);
        const initialRows = {};

        qoutationData?.Days?.forEach((day, index) => {
          const service = day?.DayServices?.find(
            (service) =>
              service?.ServiceType === "Guide" &&
              service?.ServiceMainType == "Guide Suppliment"
          );

          const mappedRows =
            Array.isArray(service?.Rates) && service.Rates.length > 0
              ? service.Rates.map((cost) => ({
                StartPax: cost?.StartPax ?? "",
                EndPax: cost?.EndPax ?? "",
                GuideFee: cost?.GuideFee ?? "",
                LAFee: cost?.LAFee ?? "",
                OthersFee: cost?.OthersFee ?? "",
                Remarks: cost?.Remarks ?? "",
              }))
              : [
                {
                  StartPax: "",
                  EndPax: "",
                  GuideFee: "",
                  LAFee: "",
                  OthersFee: "",
                  Remarks: "",
                },
              ];

          initialRows[index] = mappedRows;
        });

        setRowsPerIndex(initialRows);
      } else {
        let tabWiseData = [];

        if (itinerarayTab === "local" || itinerarayTab === "foreigner") {
          const dataDayWise = qoutationData?.ExcortDays?.find(
            (item) => item.Type === selectedTab
          )?.Days;

          tabWiseData = dataDayWise?.filter((day, index, daysArray) => {
            const previousEnrouteId = daysArray[index - 1]?.EnrouteId;
            if (
              previousEnrouteId != null &&
              previousEnrouteId !== "" &&
              previousEnrouteId === day?.DestinationId
            ) {
              return false;
            }
            return true;
          });
        } else {
          tabWiseData = qoutationData?.Days?.filter((day, index, daysArray) => {
            const previousEnrouteId = daysArray[index - 1]?.EnrouteId;
            if (
              previousEnrouteId != null &&
              previousEnrouteId !== "" &&
              previousEnrouteId === day?.DestinationId
            ) {
              return false;
            }
            return true;
          });
        }

        const guideInitialValue = tabWiseData.map((day, ind) => {
          return {
            ...itineraryGuideIntialValue,
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
            Type: Type,
            PaxInfo: {
              Adults: qoutationData?.Pax?.AdultCount,
              Child: qoutationData?.Pax?.ChildCount,
              Infant: qoutationData?.Pax?.Infant,
              Escort: "",
            },
          };
        });
        setGuideFormValue(guideInitialValue);
        setOriginalGuideForm(guideInitialValue);
        dispatch(setGuideServiceForm(guideInitialValue));
      }
    }
  };

  useEffect(() => {
    formValueInitialization();
  }, [qoutationData, checkBoxes, itinerarayTab]);
  // console.log(guideFormValue?.ServiceId,"checkserviceidd")

  // =================================================
  console.log(guideFormValue, "guideforvaluealternate");

  // set value into for it's first value from list
  const setFirstValueIntoForm = (index) => {
    const guideId = guideList?.length > 0 ? guideList[index]?.[0]?.id : "";
    const defaultLanguage = languageList?.length > 0 ? languageList[0]?.id : "";

    const supplier =
      supplierList[index] != undefined ? supplierList[index][0]?.id : "";
    console.log(guideId, supplier, "supplier00");

    setGuideFormValue((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = {
        ...newArr[index],
        ServiceId: guideId,
        Supplier: supplier,
        Language: defaultLanguage,
      };
      return newArr;
    });
    setOriginalGuideForm((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = {
        ...newArr[index],
        ServiceId: guideId,
        Supplier: supplier,
      };
      return newArr;
    });
  };
  console.log("checkBoxes1", checkBoxes);
  useEffect(() => {
    console.log("USEEFFECT TRIGGERED");
    console.log("guideFormValue before update:", guideFormValue);

    console.log("checkBoxes:", checkBoxes);

    // qoutationData?.Days?.forEach((day, i) => {
    //   // console.log(`Day ${i} DayServices:`, day.DayServices);
    // });
    // console.log(guideFormValue,"guideFormValue");

    const allDaysEmpty =
      Array.isArray(qoutationData?.Days) &&
      qoutationData.Days.every((day) => {
        if (!Array.isArray(day.DayServices)) return true;
        const guideServices = day.DayServices.filter(
          (service) =>
            service.ServiceType === "Guide" &&
            service?.ServiceMainType == "Guide Suppliment"
        );
        return guideServices.length === 0;
      });
    // console.log("allDaysEmpty:", allDaysEmpty);

    // console.log("allDaysEmpty (Guide):", allDaysEmpty);
    // console.log("checkBoxes includes guide:", checkBoxes?.includes("guide"));

    if (
      allDaysEmpty &&
      Array.isArray(checkBoxes) &&
      checkBoxes.includes("guide")
    ) {
      guideFormValue?.forEach((form, index) => {
        // console.log(`Setting first value into form at index ${index}`);
        setFirstValueIntoForm(index);
      });
    }
  }, [qoutationData, guideList, supplierList, languageList, checkBoxes]);

  // set guide language
  const changeDefaultLanguage = (index) => {
    setLanguageValue((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = defaultLanguage;
      return newArr;
    });
  };

  useEffect(() => {
    guideFormValue.forEach((_, index) => {
      changeDefaultLanguage(index);
    });
  }, [
    guideFormValue?.map((guide) => guide?.ServiceId).join(","),
    defaultLanguage,
  ]);

  // set full type data into form
  const settingDayTypeFunction = (index) => {
    const selectedDayType = dayTypeArr[index];

    console.log(dayTypeArr, "dayTypeArr");

    if (dayTypeArr[index] !== undefined) {
      setGuideFormValue((prevArr) => {
        const current = prevArr[index];

        if (current?.DayType === selectedDayType) return prevArr;
        console.log(selectedDayType, "selectedDayType");

        const updated = [...prevArr];
        updated[index] = {
          ...current,
          DayType: selectedDayType,

          ...(selectedDayType ? {} : { ServiceId: "" }),
        };
        return updated;
      });

      setOriginalGuideForm((prevArr) => {
        const current = prevArr[index];

        if (current?.DayType === selectedDayType) return prevArr;

        const updated = [...prevArr];
        updated[index] = {
          ...current,
          DayType: selectedDayType,
        };
        return updated;
      });
    }
  };

  useEffect(() => {
    if (AutoGuideCheck) {
      guideFormValue?.forEach((_, index) => {
        settingDayTypeFunction(index);
      });
    }
  }, [dayTypeArr, guideFormValue?.map((guide) => guide?.ServiceId).join(",")]);
  // console.log(destination,"destination")

  const postDataToServer = async (destination) => {
    try {
      setIsDataLoading(true);
      try {
        const { data } = await axiosOther.post("languagelist");
        setLanguageList(data?.DataList);
      } catch (error) {
        console.log("error", error);
      }
      try {
        const { data } = await axiosOther.post("destinationlist");
        setDestinationList(data?.DataList);
      } catch (error) {
        console.log("error", error);
      }
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    if (!apiDataLoad) return;
    postDataToServer();
    // getGuideListData()
  }, [apiDataLoad]);

  const getGuideListData = async (type, index, destination) => {
    console.log(type, index, destination, "checkdattaa");
    try {
      const { data } = await axiosOther.post("guideservicelist", {
        Destination: destination,
      });

      console.log(data, "data223");
      // setGuideList(data?.DataList || []);

      setGuideList((prev) => {
        const newArr = [...prev];
        newArr[index] = data?.DataList;
        return newArr;
      });
    } catch (error) {
      console.log("error", error);
    }
  };
  console.log(guideList, "guidelistt");

  useEffect(() => {
    if (!apiDataLoad) return;
    guideFormValue?.forEach((item, index) => {
      getGuideListData(item?.ServiceType, index, item?.Destination);
    });
  }, [guideFormValue?.map((item) => item?.Destination).join(","), apiDataLoad]);

  const handleHotelTableIncrement = (index) => {
    const indexHotel = guideFormValue[index];
    setGuideFormValue((prevArr) => {
      const newArr = [...prevArr];
      newArr.splice(index + 1, 0, { ...indexHotel, isCopied: true });
      return newArr;
    });
    setOriginalGuideForm((prevArr) => {
      const newArr = [...prevArr];
      newArr.splice(index + 1, 0, { ...indexHotel, isCopied: true });
      return newArr;
    });
  };

  const handleHotelTableDecrement = (index) => {
    const filteredTable = guideFormValue?.filter((item, ind) => ind != index);
    setGuideFormValue(filteredTable);
    setOriginalGuideForm(filteredTable);
  };

  // useEffect(()=>{
  //   guideFormValue?.map((form, index)=>{ // convert total calculation into useEffect
  //     const newForm = [...form];
  //   })
  // }, [
  //   guideFormValue?.map((form)=> form?.GuideFee),
  //   guideFormValue?.map((form)=> form?.LanguageAllowance),
  //   guideFormValue?.map((form)=> form?.OtherCost),
  // ])

  const CountedTotalCost = (index) => {
    const totalCost =
      parseInt(guideFormValue[index]?.GuideFee || 0) +
      parseInt(guideFormValue[index]?.LanguageAllowance || 0) +
      parseInt(guideFormValue[index]?.OtherCost || 0);
    return totalCost;
  };

  // const mergeGuideRateJson = (serviceInd) => {
  //   if (isRateMerge) {
  //     const guideRate = guideFormValue?.map((guide,index) => {
  //       const rate = rateList[index];

  //       console.log(rate,"rate");
  //       if (rate) {
  //         const findedRate = rate[0]?.RateJson?.ServiceCost;
  //         console.log(rate,"rateee");
  //         console.log(findedRate,"findedRate");

  //         return {
  //           ...guide,
  //           Rates: {
  //             ...Rates,
  //             StartPax: checkPrice(findedRate?.StartPax),
  //             EndPax: checkPrice(findedRate?.EndPax),
  //             GuideFullDayFee: checkPrice(findedRate?.GuideFullDayFee),
  //             GuideHalfDayFee: checkPrice(findedRate?.GuideHalfDayFee),
  //             LAFullDayFee: checkPrice(findedRate?.LAFullDayFee),
  //             OthersFullDayFee: checkPrice(findedRate?.LAHalfDayFee),
  //             LAHalfDayFee: checkPrice(findedRate?.OthersFullDayFee),
  //             OthersHalfDayFee: checkPrice(findedRate?.OthersHalfDayFee),
  //             Remarks: checkPrice(findedRate?.Remarks),
  //           }
  //         };

  //       } else {
  //         return {
  //           ...guide,
  //           Rates: {
  //             ...Rates,
  //             StartPax: 0,
  //             EndPax: 0,
  //             GuideFullDayFee: 0,
  //             GuideHalfDayFee: 0,
  //             LAFullDayFee: 0,
  //             LAHalfDayFee: 0,
  //             OthersFullDayFee: 0,
  //             OthersHalfDayFee: 0,
  //             Remarks: 0
  //           }
  //         };
  //       }
  //     });
  //        setRowsPerIndex(guideRate)

  //     if (guideFormValue.length > 0) {
  //       setIsRateMerge(true);
  //       setGuideFormValue(guideRate);

  //       setOriginalGuideForm(guideRate);
  //     }
  //   } else {
  //     const rate = rateList[serviceInd];

  //     if (rate) {
  //       const findedRate = rate[0]?.RateJson;
  //       setGuideFormValue((prevArr) => {
  //         let newArr = [...prevArr];
  //         newArr[serviceInd] = {
  //           ...newArr[serviceInd],
  //           LanguageAllowance: checkPrice(findedRate?.LangAllowance),
  //           GuideFee: checkPrice(findedRate?.ServiceCost),
  //           OtherCost: checkPrice(findedRate?.OtherCost),
  //         };
  //         return newArr;
  //       });
  //     } else {
  //       setGuideFormValue((prevArr) => {
  //         let newArr = [...prevArr];
  //         newArr[serviceInd] = {
  //           ...newArr[serviceInd],
  //           LanguageAllowance: 0,
  //           GuideFee: 0,
  //           OtherCost: 0,
  //         };
  //         return newArr;
  //       });
  //     }
  //   }
  // };

  console.log(rateList, "indexrow5");
  console.log(rowsPerIndex, "rowsPerIndex11");
  const mergeGuideRateJson = (index) => {
    const form = guideFormValue[index];
    const rate = rateList[index];

    // Default service cost
    const defaultServiceCost = [
      {
        StartPax: "0",
        EndPax: "0",
        GuideFullDayFee: "0",
        GuideHalfDayFee: "0",
        LAFullDayFee: "0",
        LAHalfDayFee: "0",
        OthersFullDayFee: "0",
        OthersHalfDayFee: "0",
        Remarks: "0",
      },
    ];

    // Use existing data if rate is invalid, otherwise format new data
    let formattedServiceCost = defaultServiceCost;
    if (
      rate &&
      Array.isArray(rate) &&
      rate.length > 0 &&
      rate[0]?.RateJson?.ServiceCost
    ) {
      formattedServiceCost = rate[0].RateJson.ServiceCost.map((row) => ({
        StartPax: row.StartPax || "0",
        EndPax: row.EndPax || "0",
        GuideFullDayFee: row.GuideFullDayFee || "0",
        GuideHalfDayFee: row.GuideHalfDayFee || "0",
        LAFullDayFee: row.LAFullDayFee || "0",
        LAHalfDayFee: row.LAHalfDayFee || "0",
        OthersFullDayFee: row.OthersFullDayFee || "0",
        OthersHalfDayFee: row.OthersHalfDayFee || "0",
        Remarks: row.Remarks || "0",
      }));
    } else {
      // Preserve existing data if available
      formattedServiceCost = rowsPerIndex[index] || defaultServiceCost;
    }

    console.log("Before mergeGuideRateJson:", {
      guideFormValue,
      rateList,
      rowsPerIndex,
      index,
    });
    setRowsPerIndex((prev) => ({
      ...prev, // Preserve all existing keys
      [index]: formattedServiceCost, // Update only the specific index
    }));
    console.log("After mergeGuideRateJson:", { rowsPerIndex });
  };

  // Track previous ServiceIds to detect changes
  const prevServiceIds = useRef([]);

  useEffect(() => {
    if (isMergeAllowed && Array.isArray(guideFormValue)) {
      guideFormValue.forEach((guide, index) => {
        const currentServiceId = guide?.ServiceId;
        const prevServiceId = prevServiceIds.current[index];

        // Only update if ServiceId has changed
        if (currentServiceId !== prevServiceId) {
          mergeGuideRateJson(index);
        }
      });

      // Update previous ServiceIds
      prevServiceIds.current = guideFormValue.map((item) => item?.ServiceId);

      // Reset merge flag
      setIsMergeAllowed(false);
    }
  }, [guideFormValue.map((item) => item?.ServiceId), rateList, isMergeAllowed]);

  // Track previous ServiceIds to detect changes

  // useEffect(() => {
  //   if (isMergeAllowed && Array.isArray(guideFormValue)) {
  //     guideFormValue.forEach((guide, index) => {
  //       const currentServiceId = guide?.ServiceId;
  //       const prevServiceId = prevServiceIds.current[index];

  //       // Only update if ServiceId has changed or is new
  //       if (currentServiceId !== prevServiceId) {
  //         mergeGuideRateJson(index);
  //       }
  //     });

  //     // Update previous ServiceIds
  //     prevServiceIds.current = guideFormValue.map((item) => item?.ServiceId);

  //     // Reset merge flag
  //     setIsMergeAllowed(false);
  //   }
  // }, [guideFormValue, rateList, isMergeAllowed]);
  console.log(selectedIndex, "selectedIndex");

  const handleGuideFormChange = (index, name, value, rowIndex = null) => {
    ////console.log(`Updating index ${index}: ${name} = ${value}, rowIndex: ${rowIndex}`); // Debug log

    if (rowIndex !== null) {
      // Handle row-level changes (previously handled by handleChange)
      const key = index;
      const updatedRows = [...(rowsPerIndex[key] || [])];

      // Safeguard in case the row is missing
      if (!updatedRows[rowIndex]) updatedRows[rowIndex] = {};

      updatedRows[rowIndex][name] = value;

      setRowsPerIndex((prev) => ({
        ...prev,
        [key]: updatedRows,
      }));
    } else {
      // Handle form-level changes (previously handled by handleGuideFormChange)
      setGuideFormValue((prevArr) => {
        const newArr = [...prevArr];
        newArr[index] = { ...newArr[index], [name]: value };
        ////console.log("Updated guideFormValue:",newArr[index]); // Debug log
        return newArr;
      });
      setOriginalGuideForm((prevArr) => {
        const newArr = [...prevArr];
        newArr[index] = { ...newArr[index], [name]: value };
        return newArr;
      });
    }
  };

  const getQueryQuotation = JSON.parse(localStorage.getItem("Query_Qoutation"));

  const getQoutationList = async () => {
    const payload = {
      QueryId: getQueryQuotation?.QueryID,
      QuotationNo: getQueryQuotation?.QoutationNum,
    };
    try {
      const { data } = await axiosOther.post("listqueryquotation", payload);
      if (data?.success) {
        dispatch(setQoutationData(data?.data[0]));
      }
    } catch (e) {
      console.log(e);
    }
  };

  console.log(Type, "Type");

  const handleSupplementChange = (e) => {
    setSupplement(e.target.checked);
  };
  const handleFinalSave = async () => {
    const finalFormValue = guideFormValue?.map((form, index) => {
      return {
        ...form,
        Hike: hikePercent,
        Type: "Main",
        Supplier: guideFormValue[index]?.Supplier || "",
        Rates: rowsPerIndex[index] || [],
        ServiceMainType: "Yes",
        Suppliment: supplement ? "Yes" : "No",
        // Language:languageValue,
        Sector: fromToDestinationList[index],
        TotalCosting: serviceCostData || [],
      };
    });

    console.log("GuideRequest", finalFormValue);
    console.log("finalFormValue", guideFormValue);

    try {
      const { data } = await axiosOther.post(
        "updateguidequatation",
        finalFormValue
      );
      const totalGuideCost = guideFormValue?.reduce((total, item) => {
        const guideFee = parseFloat(item.GuideFee) || 0;
        const languageAllowance = parseFloat(item.LanguageAllowance) || 0;
        const otherCost = parseFloat(item.OtherCost) || 0;
        return total + guideFee + languageAllowance + otherCost;
      }, 0);
      if (data?.status == 1) {
        // console.log(finalFormValue,"finalvalue")
        notifySuccess("Services Added !");
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
  };

  const getSupplierList = async (index, id) => {
    try {
      const { data } = await axiosOther.post("supplierlist", {
        Name: "",
        id: "",
        SupplierService: [1],
        DestinationId: [id],
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
    guideFormValue?.forEach((item, index) => {
      if (item?.Destination != "") {
        getSupplierList(index, item?.Destination);
      }
    });
  }, [
    guideFormValue?.map((item) => item?.Destination)?.join(","),
    apiDataLoad,
  ]);

  const handleLanguageChange = (index, e) => {
    const { value } = e.target;
    setGuideFormValue((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = { ...newArr[index], Language: value };
      return newArr;
    });
    setOriginalGuideForm((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = { ...newArr[index], Language: value };
      return newArr;
    });
  };

  useEffect(() => {
    const costArr = guideFormValue?.map((guide) => {
      if (guide?.ServiceId != "") {
        let arr = [guide?.LanguageAllowance, guide?.GuideFee, guide?.OtherCost];

        arr.map((value, index) => {
          if (value === null || value === undefined || value === "") {
            arr[index] = 0;
          }
          if (typeof value === "string" && !isNaN(value)) {
            arr[index] = parseFloat(value);
          }
          return value;
        });

        const rate = arr.reduce((acc, curr) => acc + curr, 0);
        return rate;
      } else {
        return 0;
      }
    });
  }, [
    guideFormValue
      ?.map(
        (guide) => guide?.LanguageAllowance + guide?.GuideFee + guide?.OtherCost
      )
      ?.join(","),
    guideFormValue?.map((item) => item?.ServiceId).join(","),
  ]);

  // storing guide form into redux store
  useEffect(() => {
    if (Type == "Main") {
      dispatch(setItineraryGuideData(guideFormValue));
    }
  }, [guideFormValue]);
  console.log(guideFormValue, "guideFormValue");
  // console.log(guideFormValue[index]?.ServiceId,"ServiceId")
  // console.log(qoutationData?.Pax?.AdultCount, "paxcheck");
  // console.log(guideList, "guidelistt");
  console.log(supplierList, "supplierlistt");
  const getGuideRateApi = async (destination, index, date, serviceid) => {
    // let GuideUID = "";
    ////console.log(guideList,"guideList001");

    let GuideUID =
      guideList[index] && guideList[index].length > 0
        ? guideList[index]?.[0]
        : null;
    ////console.log(GuideUID,"GuideUID");

    // let SupplierID =;
    let supplierid =
      supplierList[index] != undefined
        ? supplierList[index]?.find(
          (sup) => sup?.id == guideFormValue[index]?.Supplier
        )
        : " ";

    ////console.log(GuideUID,"GuideUID");
    // ////console.log(supplierid,"supplierid");

    let token = localStorage.getItem("token");
    let companyid = JSON.parse(token);
    ////console.log(token,"token")

    try {
      const { data } = await axiosOther.post("filter-guiderate-data", {
        id: "",
        GuideUID: GuideUID?.UniqueID,
        CompanyId: companyid?.CompanyUniqueId,
        date: date,
        QueryId: queryData?.QueryId,
        QuatationNo: qoutationData?.QuotationNumber,
        SupplierId: supplierid?.UniqueID,
        ServiceType: "",
        StartPax: "",
        // EndPax: qoutationData?.Pax?.AdultCount,
        Destination: destination,
        GuideServiceName: "",
        // Year: headerDropdown?.Year,
        DestinationType: "",
      });
      const result = data?.Status == 0 ? [] : data?.Data || [];

      ////console.log(data?.Data,"result");

      //   if (
      //     data?.TotalRecords > 0 &&
      //     data?.Data &&
      //     data.Data.length > 0 &&
      //     data.Data[0]?.RateJson?.ServiceCost &&
      //     data.Data[0].RateJson.ServiceCost.length > 0
      //   ) {
      //     setRowsPerIndex((prevArr) => {
      //       const safePrevArr = Array.isArray(prevArr) ? prevArr : [];
      //       const updated = [...safePrevArr];
      //       updated[index] = result;
      //       ////console.log(updated,"indexrow4");

      //       // mergeGuideRateJson(index,updated);
      //       return updated;
      //     });

      //     ////console.log(rowsPerIndex,"indexrow41");
      //   } else {
      //     // Clear the rate list
      //     // setRateList([]);
      //     // setRowsPerIndex({})
      //     ////console.log("No valid data found. Rate list reset.");
      // //   }
      // ////console.log(guideFormValue[index]?.DayType,"dayTypearr");
      // ////console.log(dayTypeArr,"dayTypearr2");

      const dayType = guideFormValue[index]?.DayType;
      const isFullDay = dayType === "Full Day";
      const isHalfDay = dayType === "Half Day";

      // Determine which fields to populate based on day type
      const GuideFeeKey = isFullDay
        ? "GuideFullDayFee"
        : isHalfDay
          ? "GuideHalfDayFee"
          : null;

      const LAFeeKey = isFullDay
        ? "LAFullDayFee"
        : isHalfDay
          ? "LAHalfDayFee"
          : null;

      const OthersFeeKey = isFullDay
        ? "OthersFullDayFee"
        : isHalfDay
          ? "OthersHalfDayFee"
          : null;

      ////console.log("GuideFeeKey:",GuideFeeKey);

      if (
        Array.isArray(result) &&
        result.length > 0 &&
        result[0]?.RateJson?.ServiceCost
      ) {
        ////console.log("ServiceCost Data:",result[0].RateJson.ServiceCost); // Debug the input data

        const formattedServiceCost = result[0].RateJson.ServiceCost.map(
          (row) => {
            ////console.log("Row Data:",row); // Debug each row
            return {
              StartPax: String(row.StartPax ?? "0"),
              EndPax: String(row.EndPax ?? "0"),
              GuideFee: String(row[GuideFeeKey] ?? row.GuideFee ?? "0"), // Adjusted access
              LAFee: String(row[LAFeeKey] ?? row.LAFee ?? "0"),
              OthersFee: String(row[OthersFeeKey] ?? row.OthersFee ?? "0"),
              Remarks: row.Remarks ?? "",
            };
          }
        );

        ////console.log("Formatted ServiceCost:",formattedServiceCost);

        setRowsPerIndex((prev) => ({
          ...prev,
          [index]: formattedServiceCost,
        }));
      } else {
        const defaultRow = {
          StartPax: "0",
          EndPax: "0",
          Remarks: "",
        };

        // Conditionally add fee properties only if they are not null
        if (GuideFeeKey) defaultRow[GuideFeeKey] = "0";
        if (LAFeeKey) defaultRow[LAFeeKey] = "0";
        if (OthersFeeKey) defaultRow[OthersFeeKey] = "0";

        // setRowsPerIndex((prev) => ({
        //   ...prev,
        //   [index]: [defaultRow],
        // }));
      }
    } catch (error) {
      ////console.log("error",error);
    }
  };
  const prevValuesRef = useRef([]);
  useEffect(() => {
    if (!apiDataLoad) return;
    guideFormValue.forEach((form, index) => {
      getGuideRateApi(form?.DestinationUniqueId, index, form?.Date);
    });
  }, [guideFormValue, guideList, apiDataLoad]);

  // useEffect(() => {
  //   if (!Array.isArray(guideFormValue)) return;

  //   guideFormValue.forEach((form,index) => {
  //     const prev = prevValuesRef.current[index] || {};

  //     const hasChanged =
  //       form?.DestinationUniqueId !== prev?.DestinationUniqueId ||
  //       form?.Date !== prev?.Date ||
  //       form?.DayType !== prev?.DayType;

  //     if (hasChanged) {
  //       getGuideRateApi(form?.DestinationUniqueId,index,form?.Date);
  //     }
  //   });

  //   // Update previous values
  //   prevValuesRef.current = guideFormValue.map(form => ({
  //     DestinationUniqueId: form?.DestinationUniqueId,
  //     Date: form?.Date,
  //     DayType: form?.DayType,
  //   }));
  // },[guideFormValue,guideList]);

  // toggle of default value in form
  useEffect(() => {
    if (!checkBoxes?.includes("monument")) {
      formValueInitialization();
    }
  }, [checkBoxes]);

  useEffect(() => {
    if (guideCopy) {
      if (isAlternate) {
        setGuideCopy(true);
        const guideSupplment = GuideService?.map((form) => ({
          ...form,
          ServiceMainType: "Yes",
        }));
        const newFormArr = [...guideFormValue, ...guideSupplment];
        setGuideFormValue(newFormArr);
        setOriginalGuideForm(newFormArr);
      } else {
        setGuideCopy(false);
        const removedCopiedForm = guideFormValue?.filter(
          (form, index) => form?.ServiceMainType == "No"
        );
        setGuideFormValue(removedCopiedForm);
        setOriginalGuideForm(removedCopiedForm);
      }
    }
  }, [isAlternate]);

  const handlePaxChange = (index, e) => {
    const { name, value } = e.target;
    setPaxFormValue({ ...paxFormValue, [name]: value });
  };

  const handlePaxModalClick = (index) => {
    setModalCentered({ modalIndex: index, isShow: true });

    const form = guideFormValue?.filter((form, ind) => ind == index)[0];
    setPaxFormValue({
      Adults: form?.PaxInfo?.Adults,
      Child: form?.PaxInfo?.Child,
      Infant: form?.PaxInfo?.Infant,
    });
  };

  const handlePaxSave = () => {
    setGuideFormValue((prevForm) => {
      const newForm = [...prevForm];
      newForm[modalCentered?.modalIndex] = {
        ...newForm[modalCentered?.modalIndex],
        PaxInfo: paxFormValue,
      };
      return newForm;
    });
    setOriginalGuideForm((prevForm) => {
      const newForm = [...prevForm];
      newForm[modalCentered?.modalIndex] = {
        ...newForm[modalCentered?.modalIndex],
        PaxInfo: paxFormValue,
      };
      return newForm;
    });
    setModalCentered({ modalIndex: "", isShow: false });
  };

  const handleAlternateGuide = (e) => {
    setIsAlternate(true);
    setGuideCopy(true);
    e.stopPropagation();
  };

  const handleHikeChange = (e) => {
    const { value } = e.target;
    const hikePercent = parseFloat(value);
    setHikePercent(value);

    const updatedData = originalGuideForm?.map((item) => {
      return {
        ...item,
        Hike: value,
        GuideFee:
          item?.GuideFee && !isNaN(item?.GuideFee)
            ? Math.floor(
              parseFloat(item?.GuideFee) +
              (parseFloat(item?.GuideFee) * value) / 100
            )
            : item?.GuideFee,
        LanguageAllowance:
          item?.LanguageAllowance && !isNaN(item?.LanguageAllowance)
            ? Math.floor(
              parseFloat(item?.LanguageAllowance) +
              (parseFloat(item?.LanguageAllowance) * value) / 100
            )
            : item?.LanguageAllowance,
        OtherCost:
          item?.OtherCost && !isNaN(item?.OtherCost)
            ? Math.floor(
              parseFloat(item?.OtherCost) +
              (parseFloat(item?.OtherCost) * value) / 100
            )
            : item?.OtherCost,
      };
    });
    setGuideFormValue(updatedData);
  };

  useEffect(() => {
    const calculateTotalPrice = (data) => {
      let totalGuideFee = 0;
      let totalLanguageAllowance = 0;
      let totalOtherCost = 0;
      let allTotalCost = 0;

      data.forEach((item, index) => {
        totalGuideFee += parseFloat(item.GuideFee) || 0;
        totalLanguageAllowance += parseFloat(item.LanguageAllowance) || 0;
        totalOtherCost += parseFloat(item.OtherCost) || 0;
        allTotalCost += CountedTotalCost(index);
      });

      return {
        totalGuideFee,
        totalLanguageAllowance,
        totalOtherCost,
        allTotalCost,
      };
    };

    const filteredGuide = guideFormValue?.filter(
      (form) => form?.ServiceId != ""
    );

    const {
      totalGuideFee,
      totalLanguageAllowance,
      totalOtherCost,
      allTotalCost,
    } = calculateTotalPrice(filteredGuide);

    const totalPriceForPax =
      totalGuideFee +
      totalLanguageAllowance +
      totalOtherCost +
      ((totalGuideFee + totalLanguageAllowance + totalOtherCost) * 5) / 100;

    dispatch(setGuidePrice(totalPriceForPax));
    dispatch(setTogglePriceState());

    setGuideRateCalculation((prevData) => ({
      ...prevData,
      Price: {
        GuideFee: totalGuideFee,
        Allowence: totalLanguageAllowance,
        Other: totalOtherCost,
        Total: allTotalCost,
      },
      MarkupOfCost: {
        GuideFee: (totalGuideFee * 5) / 100,
        LanguageAllowance: (totalLanguageAllowance * 5) / 100,
        OtherCost: (totalOtherCost * 5) / 100,
        Total: (allTotalCost * 5) / 100,
      },
    }));
  }, [
    guideFormValue?.map((item) => item.GuideFee).join(","),
    guideFormValue?.map((item) => item.LanguageAllowance).join(","),
    guideFormValue?.map((item) => item.OtherCost).join(","),
    guideFormValue?.map((item) => item.ServiceId).join(","),
  ]);

  // useEffect(() => { // it's not using right now - ansar
  //   const calculateTotalGuideFee = (data) => {
  //     let totalGuideFee = 0;
  //     data.forEach((item) => {
  //       totalGuideFee += parseFloat(item.GuideFee) || 0;
  //     });
  //     return totalGuideFee;
  //   };
  //   const calculateTotalLanguageAllowance = (data) => {
  //     let totalLanguageAllowance = 0;
  //     data.forEach((item) => {
  //       totalLanguageAllowance += parseFloat(item.LanguageAllowance) || 0;
  //     });
  //     return totalLanguageAllowance;
  //   };
  //   const calculateTotalOtherCost = (data) => {
  //     let totalOtherCost = 0;
  //     data.forEach((item) => {
  //       totalOtherCost += parseFloat(item.OtherCost) || 0;
  //     });
  //     return totalOtherCost;
  //   };
  //   // Getting the total values for GuideFee, LanguageAllowance, and OtherCost
  //   const totalGuideFee = calculateTotalGuideFee(originalGuideForm);
  //   const totalLanguageAllowance =
  //     calculateTotalLanguageAllowance(originalGuideForm);
  //   const totalOtherCost = calculateTotalOtherCost(originalGuideForm);
  //   // Calculating the markup
  //   const GuideFeeMarkup = (totalGuideFee * hikePercent) / 100;
  //   const LanguageAllowanceMarkup =
  //     (totalLanguageAllowance * hikePercent) / 100;
  //   const OtherCostMarkup = (totalOtherCost * hikePercent) / 100;
  //   // Updating state with the calculated markup
  //   setGuideRateCalculation((prevData) => ({
  //     ...prevData,
  //     Markup: {
  //       GuideFee: GuideFeeMarkup,
  //       LanguageAllowance: LanguageAllowanceMarkup,
  //       OtherCost: OtherCostMarkup,
  //     },
  //   }));
  // }, [hikePercent, originalGuideForm]);

  useEffect(() => {
    const GuideTotalCost =
      (guideRateCalculation?.Price?.GuideFee || 0) +
      (guideRateCalculation?.Price?.Allowence || 0) +
      (guideRateCalculation?.Price?.Other || 0);
  }, [guideRateCalculation]);

  // calculating from destination & to destination
  useEffect(() => {
    const destinations = guideFormValue?.map((guide, index, guideArr) => {
      return {
        From: guide?.Destination,
        To: guideArr[index + 1]?.Destination,
      };
    });

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
    guideFormValue?.map((guide) => guide?.Destination).join(","),
    destinationList,
  ]);

  const applyDefaultLanguageToAll = (newDefaultLanguage) => {
    if (!newDefaultLanguage) return;

    setGuideFormValue((prevArr) => {
      return prevArr.map((guide) => ({
        ...guide,
        Language: newDefaultLanguage,
      }));
    });

    setOriginalGuideForm((prevArr) => {
      return prevArr.map((guide) => ({
        ...guide,
        Language: newDefaultLanguage,
      }));
    });
  };

  const [dataIsLoaded, setDataIsLoaded] = useState(true);

  const handleIsOpen = () => {
    if (dataIsLoaded) {
      dispatch({
        type: "SET_GUIDE_DATA_LOAD",
        payload: true,
      });
      setDataIsLoaded(false);
    }

    setIsOpen({ ...isOpen, original: !isOpen?.original });
  };

  useEffect(() => {
    return () => {
      dispatch({
        type: "SET_GUIDE_DATA_LOAD",
        payload: false,
      });
    };
  }, []);
  // ==================================================

  // implement copy functionality

  useEffect(() => {
    if (Type !== "Main" && guideFormData?.length > 0) {
      if (copyChecked) {
        // When copying is enabled
        setBackupGuideForms(guideFormValue); // Save current state
        setGuideFormValue(guideFormData); // Copy from main
        setOriginalGuideForm(guideFormData);
      } else if (backupGuideForms.length > 0) {
        // When copying is disabled
        setGuideFormValue(backupGuideForms); // Restore original
        setOriginalGuideForm(backupGuideForms);
        setBackupGuideForms([]);
      }
    }
  }, [copyChecked, guideFormData]);

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
      StartPax: "",
      EndPax: "",
      GuideFullDayFee: "",
      GuideHalfDayFee: "",
      LAFullDayFee: "",
      LAHalfDayFee: "",
      OthersFullDayFee: "",
      OthersHalfDayFee: "",
      Remarks: "",
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
              StartPax: "",
              EndPax: "",
              GuideFullDayFee: "",
              GuideHalfDayFee: "",
              LAFullDayFee: "",
              LAHalfDayFee: "",
              OthersFullDayFee: "",
              OthersHalfDayFee: "",
              Remarks: "",
            },
          ],
        }));
      }
    }
  };
  {
    console.log(rowsPerIndex, "rowData");
  }
  useEffect(() => {
    if (!hasInitialized.current && guideFormValue.length > 0) {
      const firstItem = guideFormValue[0];
      setSelectedIndex(0);
      setSelectedRowData(firstItem);
      setShowDetails(true);

      setRowsPerIndex((prev) => {
        if (!prev[0]) {
          return {
            ...prev,
            0: [
              {
                StartPax: "",
                EndPax: "",
                GuideFullDayFee: "",
                GuideHalfDayFee: "",
                LAFullDayFee: "",
                LAHalfDayFee: "",
                OthersFullDayFee: "",
                OthersHalfDayFee: "",
                Remarks: "",
              },
            ],
          };
        }
        return prev;
      });

      hasInitialized.current = true;
    }
  }, [guideFormValue]);

  useEffect(() => {
    if (Object.keys(rowsPerIndex).length > 0) {
      calculateTotalAmount(rowsPerIndex);
    }
  }, [rowsPerIndex]);
  ////console.log(rowsPerIndex,"rowperindex");
  // ////console.log(gui,"rowperindex");

  const calculateTotalAmount = (rowsMap) => {
    console.log(rowsMap, "rowsMap");

    // ✅ First Part: Use rowsPerIndex to calculate slab-wise totals
    const totalIndexes = Object.keys(rowsPerIndex);
    const rowCount = rowsPerIndex[totalIndexes[0]]?.length || 0;

    const newGuideTotals = [];
    const newLaTotals = [];
    const newOthersTotals = [];

    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      let guideSum = 0;
      let laSum = 0;
      let othersSum = 0;

      totalIndexes.forEach((key) => {
        const row = rowsPerIndex[key]?.[rowIndex];
        if (row) {
          guideSum += parseFloat(row.GuideFee) || 0;
          laSum += parseFloat(row.LAFee) || 0;
          othersSum += parseFloat(row.OthersFee) || 0;
        }
      });

      newGuideTotals.push(guideSum);
      newLaTotals.push(laSum);
      newOthersTotals.push(othersSum);
    }

    setGuideTotals(newGuideTotals);
    setLaTotals(newLaTotals);
    setOthersTotals(newOthersTotals);

    // ✅ Second Part: Merge season-wise costs per slab
    if (!rowsMap || typeof rowsMap !== "object") {
      console.error("Invalid rowsMap:", rowsMap);
      return;
    }

    const seasonKeys = Object.keys(rowsMap);
    const slabCount = rowsMap[seasonKeys[0]]?.length || 0;

    const mergedCosts = [];

    for (let slabIndex = 0; slabIndex < slabCount; slabIndex++) {
      let merged = {
        StartPax: 0,
        EndPax: 0,
        ServiceGuideFee: 0,
        ServiceGuideMarkupValue: 5,
        TotalGuideFeeMarkup: 0,
        TotalGuideServiceCost: 0,
        ServiceLanguageCost: 0,
        ServiceLanguageMarkupValue: 5,
        TotalLanguageMarkup: 0,
        TotalLanguageServiceCost: 0,
        ServiceOtherCost: 0,
        ServiceOtherMarkupValue: 5,
        TotalOtherMarkup: 0,
        TotalOtherServiceCost: 0,
        ServiceTotalCost: 0,
        ServiceTotalMarkupValue: 15,
        TotalSerrviceMarkup: 0,
        TotalServiceCost: 0,
      };

      for (let seasonKey of seasonKeys) {
        const slab = rowsMap[seasonKey]?.[slabIndex];
        if (!slab) continue;

        if (!merged.StartPax && slab.StartPax)
          merged.StartPax = parseFloat(slab.StartPax);
        if (!merged.EndPax && slab.EndPax)
          merged.EndPax = parseFloat(slab.EndPax);

        const ServiceGuideFee = parseFloat(slab?.GuideFee) || 0;
        const GuideMarkup =
          (ServiceGuideFee * merged.ServiceGuideMarkupValue) / 100;
        const TotalGuideServiceCost = ServiceGuideFee + GuideMarkup;

        const ServiceLanguageCost = parseFloat(slab?.LAFee) || 0;
        const LanguageMarkup =
          (ServiceLanguageCost * merged.ServiceLanguageMarkupValue) / 100;
        const TotalLanguageServiceCost = ServiceLanguageCost + LanguageMarkup;

        const ServiceOtherCost = parseFloat(slab?.OthersFee) || 0;
        const OtherMarkup =
          (ServiceOtherCost * merged.ServiceOtherMarkupValue) / 100;
        const TotalOtherServiceCost = ServiceOtherCost + OtherMarkup;

        merged.ServiceGuideFee += ServiceGuideFee;
        merged.TotalGuideFeeMarkup += GuideMarkup;
        merged.TotalGuideServiceCost += TotalGuideServiceCost;

        merged.ServiceLanguageCost += ServiceLanguageCost;
        merged.TotalLanguageMarkup += LanguageMarkup;
        merged.TotalLanguageServiceCost += TotalLanguageServiceCost;

        merged.ServiceOtherCost += ServiceOtherCost;
        merged.TotalOtherMarkup += OtherMarkup;
        merged.TotalOtherServiceCost += TotalOtherServiceCost;

        merged.ServiceTotalCost +=
          ServiceGuideFee + ServiceLanguageCost + ServiceOtherCost;
        merged.TotalSerrviceMarkup +=
          GuideMarkup + LanguageMarkup + OtherMarkup;
        merged.TotalServiceCost +=
          TotalGuideServiceCost +
          TotalLanguageServiceCost +
          TotalOtherServiceCost;
      }

      mergedCosts.push(merged);
    }

    // ✅ Update state with final merged cost per slab
    setServiceCostData(mergedCosts);
  };
  const maxSlabs = useMemo(() => {
    return Math.max(
      ...Object.values(rowsPerIndex).map((rows) =>
        Array.isArray(rows) ? rows.length : 0
      ),
      3
    );
  }, [rowsPerIndex]);

  return (
    <>
      <div className="row mt-3 m-0">
        <div
          className="col-12 px-1 py-2 d-flex gap-4 itinerary-head-bg align-items-center justify-content-between"
          onClick={handleIsOpen}
        >
          <div className="d-flex gap-4 align-items-center">
            <div className="d-flex gap-2 align-items-center">
              <img src={GuideIcon} alt="GuideIcon" />
              <label htmlFor="" className="fs-5">
                Guide
              </label>
            </div>
            {Type !== "Main" && (
              <div
                className="d-flex gap-1 form-check"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  className="form-check-input check-md"
                  id="copy-guide"
                  checked={copyChecked}
                  onChange={(e) => setCopyChecked(e.target.checked)}
                />
                <label className="fontSize11px m-0 ms-1" htmlFor="copy-guide">
                  Copy
                </label>
              </div>
            )}
            <div>
              <select
                name="Language"
                id=""
                className="formControl1 language"
                onClick={(e) => e.stopPropagation()}
                value={defaultLanguage}
                onChange={(e) => {
                  const newDefault = e.target.value;
                  setDefaultLanguage(newDefault);
                  applyDefaultLanguageToAll(newDefault);
                }}
              >
                <option value="">Select</option>
                {languageList?.map((language, index) => {
                  return (
                    <option value={language?.id} key={index + "n"}>
                      {language?.Name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div
              className="d-flex  align-items-center ms-auto justify-content-start"
              onClick={(e) => e.stopPropagation()}
            >
              {Type !== "Main" && (
                <div className="form-check check-sm">
                  <label htmlFor="supplement-checkbox" className="me-2">
                    Supplement
                  </label>
                  <input
                    type="checkbox"
                    className="form-check-input check-md"
                    id="supplement-checkbox"
                    name="Suppliment"
                    checked={supplement}
                    onChange={handleSupplementChange}
                  />
                </div>
              )}
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
                  name="Escort"
                  type="number"
                  className={`formControl3`}
                  value={hikePercent}
                  onChange={handleHikeChange}
                />
                <span className="fs-6">%</span>
              </div>
            )}
            {Type == "Main" && (
              <div
                className="hike-input d-flex align-items-center cursor-pointer"
                id="copy_transport"
                name="copy_transport_form"
                onClick={handleAlternateGuide}
              >
                <label
                  className="fontSize11px cursor-pointer"
                  htmlFor="copy_transport"
                >
                  <FaPlus className="m-0 p-0" /> Alternate
                </label>
              </div>
            )}
            <span className="cursor-pointer fs-5">
              {!isOpen?.original ? (
                <FaChevronCircleUp
                  className="text-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen({ ...isOpen, original: !isOpen?.original });
                  }}
                />
              ) : (
                <FaChevronCircleDown
                  className="text-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen({ ...isOpen, original: !isOpen?.original });
                  }}
                />
              )}
            </span>
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
              onClick={() =>
                setModalCentered({ modalIndex: "", isShow: false })
              }
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
              onClick={() =>
                setModalCentered({ modalIndex: "", isShow: false })
              }
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
        {isOpen?.original && (
          (isDataLoading) ? (
            <IsDataLoading />
          ) : (
            <>
              <div className="col-12 px-0 mt-2">
                <PerfectScrollbar>
                  <table class="table table-bordered itinerary-table">
                    <thead>
                      <tr>
                        <th colSpan={6}> .</th>

                        {Array.from({ length: maxSlabs }).map((_, slabIndex) => {
                          const representativeRow = Object.values(
                            rowsPerIndex
                          ).find((rows) => rows && rows[slabIndex])?.[
                            slabIndex
                          ] || { StartPax: "", EndPax: "" };
                          return (
                            <th
                              key={`range-${slabIndex}`}
                              colSpan={3}
                              className="align-middle text-center"
                            >
                              {representativeRow.StartPax || "0"} to{" "}
                              {representativeRow.EndPax || "0"}
                            </th>
                          );
                        })}
                      </tr>
                      <tr>
                        <th className="text-center days-width-9">
                          {" "}
                          {guideFormValue[0]?.Date ? "Day / Date" : "Day"}
                        </th>

                        {/* <th rowSpan={2} className="py-1 align-middle">
                        Escort
                      </th> */}

                        <th>City</th>
                        <th>FD</th>
                        <th>HD</th>
                        <th>Language</th>
                        <th>Supplier</th>
                        {/* <th>Guide Fee</th>
                      <th>Language Allowence</th>
                      <th>Other Cost</th>
                      <th>Total Cost</th> */}
                        {Array.from({ length: maxSlabs }).map((_, slabIndex) => (
                          <React.Fragment key={`labels-${slabIndex}`}>
                            <th>Guide</th>
                            <th>LA</th>
                            <th>Others</th>
                          </React.Fragment>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {guideFormValue
                        ?.map((form, index) => ({
                          item: form,
                          originalIndex: index,
                        }))
                        ?.map(({ item, originalIndex }, index) => {
                          return (
                            <tr
                              key={index + 1}
                              onClick={() => setindexrow(index)}
                              className={
                                selectedIndex === index
                                  ? "selectedIndexActive"
                                  : ""
                              }
                            >
                              <td onClick={() => handleShowDetails(item, index)}>
                                <div className="d-flex gap-1 justify-content-start">
                                  <div className="d-flex gap-1">
                                    <div
                                      className="d-flex align-items-center pax-icon"
                                      onClick={() =>
                                        handlePaxModalClick(originalIndex)
                                      }
                                    >
                                      <i className="fa-solid fa-person"></i>
                                    </div>
                                    <span
                                      onClick={() =>
                                        handleHotelTableIncrement(originalIndex)
                                      }
                                    >
                                      <i className="la la-plus border cursor-pointer bg-success text-white rounded-pill fontSize10px padding1px"></i>
                                    </span>
                                    <span
                                      onClick={() =>
                                        handleHotelTableDecrement(originalIndex)
                                      }
                                    >
                                      <i className="la la-minus  border cursor-pointer bg-primary text-white rounded-pill fontSize10px padding1px"></i>
                                    </span>
                                  </div>
                                  <div>
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
                                  </div>
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
                                      value={
                                        guideFormValue[originalIndex]?.Escort
                                      }
                                      onChange={(e) =>
                                        handleGuideFormChange(originalIndex, e)
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
                                    value={
                                      guideFormValue[originalIndex]?.Destination
                                    }
                                    onChange={(e) =>
                                      handleGuideFormChange(originalIndex, e)
                                    }
                                  >
                                    <option value="">Select</option>
                                    {qoutationData?.Days?.map((qout, index) => {
                                      return (
                                        <option
                                          value={qout?.DestinationId}
                                          key={index + 1}
                                        >
                                          {qout?.DestinationName}
                                        </option>
                                      );
                                    })}
                                  </select>
                                </div>
                              </td>
                              <td>
                                <div className="form-check d-flex align-items-center justify-content-center">
                                  <input
                                    type="radio"
                                    name={`DayType-${originalIndex}`}
                                    className="form-check-input height-em-1 width-em-1"
                                    checked={
                                      guideFormValue[originalIndex]?.DayType ===
                                      "Full Day"
                                    }
                                    onChange={() =>
                                      handleGuideFormChange(
                                        originalIndex,
                                        "DayType",
                                        "Full Day"
                                      )
                                    }
                                    value="Full Day"
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="form-check d-flex align-items-center justify-content-center">
                                  <input
                                    type="radio"
                                    name={`DayType-${originalIndex}`}
                                    className="form-check-input height-em-1 width-em-1"
                                    checked={
                                      guideFormValue[originalIndex]?.DayType ===
                                      "Half Day"
                                    }
                                    onChange={() =>
                                      handleGuideFormChange(
                                        originalIndex,
                                        "DayType",
                                        "Half Day"
                                      )
                                    }
                                    value="Half Day"
                                  />
                                </div>
                              </td>
                              <td>
                                <div>
                                  <select
                                    name="Language"
                                    className="formControl1"
                                    value={
                                      guideFormValue[originalIndex]?.Language ||
                                      ""
                                    }
                                    onChange={(e) =>
                                      handleLanguageChange(originalIndex, e)
                                    }
                                  >
                                    <option value="">Select</option>
                                    {languageList?.map((language, index) => (
                                      <option value={language?.id} key={index}>
                                        {language?.Name}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </td>
                              <td>
                                <div>
                                  <select
                                    name="Supplier"
                                    id=""
                                    className="formControl1"
                                    value={
                                      guideFormValue[originalIndex]?.Supplier
                                    }
                                    onChange={(e) =>
                                      handleGuideFormChange(originalIndex, e)
                                    }
                                  >
                                    <option value="">Select</option>
                                    {supplierList[index]?.map((supp, index) => {
                                      return (
                                        <option value={supp?.id} key={index}>
                                          {supp?.Name}
                                        </option>
                                      );
                                    })}
                                  </select>
                                </div>
                              </td>
                              {Array.from({ length: maxSlabs }).map(
                                (_, slabIndex) => {
                                  const rowData = rowsPerIndex[index]?.[
                                    slabIndex
                                  ] || {
                                    GuideFee: "",
                                    LAFee: "",
                                    OthersFee: "",
                                    StartPax: "",
                                    EndPax: "",
                                    Remarks: "",
                                  };
                                  return (
                                    <React.Fragment key={`inputs-${slabIndex}`}>
                                      <td>
                                        <input
                                          type="number"
                                          name="GuideFee"
                                          className="formControl1"
                                          value={rowData.GuideFee || ""}
                                          onChange={(e) =>
                                            handleGuideFormChange(
                                              index,
                                              "GuideFee",
                                              e.target.value,
                                              slabIndex
                                            )
                                          }
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type="number"
                                          name="LAFee"
                                          className="formControl1"
                                          value={rowData.LAFee || ""}
                                          onChange={(e) =>
                                            handleGuideFormChange(
                                              index,
                                              "LAFee",
                                              e.target.value,
                                              slabIndex
                                            )
                                          }
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type="number"
                                          name="OthersFee"
                                          className="formControl1"
                                          value={rowData.OthersFee || ""}
                                          onChange={(e) =>
                                            handleGuideFormChange(
                                              index,
                                              "OthersFee",
                                              e.target.value,
                                              slabIndex
                                            )
                                          }
                                        />
                                      </td>
                                    </React.Fragment>
                                  );
                                }
                              )}
                              {/* <td>
                              <div className="d-flex justify-content-center gap-2 flex-wrap">
                                <input
                                  type="number"
                                  name="GuideFee"
                                  className="formControl1 width100px"
                                  value={
                                    guideFormValue[originalIndex]?.GuideFee
                                  }
                                  onChange={(e) =>
                                    handleGuideFormChange(originalIndex, e)
                                  }
                                />
                              </div>
                            </td>
                            <td>
                              <div className="d-flex justify-content-center gap-2 flex-wrap">
                                <input
                                  type="number"
                                  name="LanguageAllowance"
                                  className="formControl1 width100px"
                                  value={
                                    guideFormValue[originalIndex]
                                      ?.LanguageAllowance
                                  }
                                  onChange={(e) =>
                                    handleGuideFormChange(originalIndex, e)
                                  }
                                />
                              </div>
                            </td>
                            <td>
                              <div className="d-flex justify-content-center gap-2 flex-wrap">
                                <input
                                  type="number"
                                  name="OtherCost"
                                  className="formControl1 width100px"
                                  value={
                                    guideFormValue[originalIndex]?.OtherCost
                                  }
                                  onChange={(e) =>
                                    handleGuideFormChange(originalIndex, e)
                                  }
                                />
                              </div>
                            </td>
                            <td>
                              <div className="d-flex justify-content-center gap-2 flex-wrap">
                                <input
                                  type="number"
                                  name="LanguageAllowence"
                                  className="formControl1 width100px"
                                  value={CountedTotalCost(originalIndex)}
                                  readOnly
                                />
                              </div>
                            </td> */}
                            </tr>
                          );
                        })}
                      <tr className="costing-td">
                        <td colSpan={5} rowSpan={3} className="text-center fs-6">
                          Total
                        </td>
                        <td colSpan={1}>Guide Cost</td>

                        {Array.from({ length: maxSlabs }).map((_, slabIndex) => (
                          <React.Fragment key={`costs-${slabIndex}`}>
                            <td colSpan={1}>{guideTotals[slabIndex] || 0}</td>
                            <td colSpan={1}>{laTotals[slabIndex] || 0}</td>
                            <td colSpan={1}>{othersTotals[slabIndex] || 0}</td>
                          </React.Fragment>
                        ))}

                        {/* <td colSpan={12}>{totalAmount}</td> */}

                        {/* <td>{guideRateCalculation?.Price?.Allowence}</td>
                                            <td>{guideRateCalculation?.Price?.Other}</td>
                                            <td>{guideRateCalculation?.Price?.Total}</td> */}
                      </tr>
                      <tr className="costing-td">
                        <td colSpan={1}>Markup(5) %</td>
                        {Array.from({ length: maxSlabs }).map((_, slabIndex) => {
                          const guide = guideTotals[slabIndex] || 0;
                          const la = laTotals[slabIndex] || 0;
                          const others = othersTotals[slabIndex] || 0;
                          const guideWithMarkup = (guide * 5) / 100;
                          const laWithMarkup = (la * 5) / 100;
                          const othersWithMarkup = (others * 5) / 100;
                          return (
                            <React.Fragment key={`markup-${slabIndex}`}>
                              <td colSpan={1}>{guideWithMarkup.toFixed(2)}</td>
                              <td colSpan={1}>{laWithMarkup.toFixed(2)}</td>
                              <td colSpan={1}>{othersWithMarkup.toFixed(2)}</td>
                            </React.Fragment>
                          );
                        })}
                      </tr>
                      <tr className="costing-td">
                        <td colSpan={1}> Grand Total</td>
                        {Array.from({ length: maxSlabs }).map((_, slabIndex) => {
                          const guide = guideTotals[slabIndex] || 0;
                          const la = laTotals[slabIndex] || 0;
                          const others = othersTotals[slabIndex] || 0;
                          const guideWithMarkup = guide + (guide * 5) / 100;
                          const laWithMarkup = la + (la * 5) / 100;
                          const othersWithMarkup = others + (others * 5) / 100;
                          return (
                            <React.Fragment key={`grand-total-${slabIndex}`}>
                              <td colSpan={1}>{guideWithMarkup.toFixed(2)}</td>
                              <td colSpan={1}>{laWithMarkup.toFixed(2)}</td>
                              <td colSpan={1}>{othersWithMarkup.toFixed(2)}</td>
                            </React.Fragment>
                          );
                        })}
                      </tr>
                      {/* <tr className="costing-td">
                      <td
                        colSpan={Type == "Local" || Type == "Foreigner" ? 6 : 5}
                        // rowSpan={3}
                        className="text-center fs-6"
                      >
                        Total
                      </td>
                      <td>Guide Cost</td>
                      <td>{guideRateCalculation?.Price?.GuideFee}</td>
                      <td>{guideRateCalculation?.Price?.Allowence}</td>
                      <td>{guideRateCalculation?.Price?.Other}</td>
                      <td>{guideRateCalculation?.Price?.Total}</td>
                    </tr> */}
                      {/* <tr className="costing-td">
                      <td>Markup(5) %</td>
                      <td>{guideRateCalculation?.MarkupOfCost?.GuideFee}</td>
                      <td>
                        {guideRateCalculation?.MarkupOfCost?.LanguageAllowance}
                      </td>
                      <td>{guideRateCalculation?.MarkupOfCost?.OtherCost}</td>
                      <td>{guideRateCalculation?.MarkupOfCost?.Total}</td>
                    </tr> */}
                      {/* <tr className="costing-td">
                      <td>Total</td>
                      <td>
                        {(
                          parseFloat(
                            guideRateCalculation?.Price?.GuideFee || 0
                          ) +
                          parseFloat(
                            guideRateCalculation?.MarkupOfCost?.GuideFee || 0
                          )
                        ).toFixed(2)}
                      </td>
                      <td>
                        {(
                          parseFloat(
                            guideRateCalculation?.Price?.Allowence || 0
                          ) +
                          parseFloat(
                            guideRateCalculation?.MarkupOfCost
                              ?.LanguageAllowance || 0
                          )
                        ).toFixed(2)}
                      </td>
                      <td>
                        {(
                          parseFloat(guideRateCalculation?.Price?.Other || 0) +
                          parseFloat(
                            guideRateCalculation?.MarkupOfCost?.OtherCost || 0
                          )
                        ).toFixed(2)}
                      </td>
                      <td>
                        {(
                          parseFloat(guideRateCalculation?.Price?.Total || 0) +
                          parseFloat(
                            guideRateCalculation?.MarkupOfCost?.Total || 0
                          )
                        ).toFixed(2)}
                      </td>
                    </tr> */}
                    </tbody>
                  </table>
                </PerfectScrollbar>
              </div>
              {/* {showDetails && (
              <div className="col-6 px-0 mt-2 ps-2">
                <PerfectScrollbar>
                  <table className="table table-bordered itinerary-table text-center">
                    <thead>
                      <tr>
                        <th colSpan={2} className="align-middle text-center">
                          Particulars
                        </th>
                        <th colSpan={2} className="align-middle text-center">
                          Guide Fee
                        </th>
                        <th colSpan={2} className="align-middle text-center">
                          Language Allowence
                        </th>
                        <th colSpan={2} className="align-middle text-center">
                          Other Cost
                        </th>
                        <th className="align-middle text-center">
                          Remarks
                        </th>
                      </tr>
                      <tr>
                        <th>Start Pax</th>
                        <th>End Pax</th>
                        <th>Full Day</th>
                        <th>Half Day</th>
                        <th>Full Day</th>
                        <th>Half Day</th>
                        <th>Full Day</th>
                        <th>Half Day</th>
                        <th>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(rowsPerIndex[selectedIndex]) &&
                        rowsPerIndex[selectedIndex].map((rowData,index) => (


                          <tr key={index}
                            >

                            <td>
                              <input
                                type="number"

                                className="formControl1"
                                value={rowData.StartPax}
                                onChange={(e) =>
                                  handleChange(index,"StartPax",e.target.value)
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="formControl1"
                                value={rowData.EndPax}
                                onChange={(e) =>
                                  handleChange(index,"EndPax",e.target.value)
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="formControl1"
                                value={rowData.GuideFullDayFee}
                                onChange={(e) =>
                                  handleChange(index,"GuideFullDayFee",e.target.value)
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="formControl1"
                                value={rowData.GuideHalfDayFee}
                                onChange={(e) =>
                                  handleChange(index,"GuideHalfDayFee",e.target.value)
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="formControl1"
                                value={rowData.LAFullDayFee}
                                onChange={(e) =>
                                  handleChange(index,"LAFullDayFee",e.target.value)
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="formControl1"
                                value={rowData.LAHalfDayFee}
                                onChange={(e) =>
                                  handleChange(index,"LAHalfDayFee",e.target.value)
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="formControl1"
                                value={rowData.OthersFullDayFee}
                                onChange={(e) =>
                                  handleChange(index,"OthersFullDayFee",e.target.value)

                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="formControl1"
                                value={rowData.OthersHalfDayFee}
                                onChange={(e) =>
                                  handleChange(index,"OthersHalfDayFee",e.target.value)
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="formControl1"
                                value={rowData.Remarks}
                                onChange={(e) =>
                                  handleChange(index,"Remarks",e.target.value)
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
                                  className="fs-4 text-danger"
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
                </PerfectScrollbar>
              </div>
            )} */}
            </>
          )
        )}
      </div>
      {guideCopy && (
        <div className="row mt-3 m-0">
          <div
            className="col-12 px-1 py-2 d-flex gap-4 itinerary-head-bg align-items-center justify-content-between"
            onClick={() => setIsOpen({ ...isOpen, copy: !isOpen?.copy })}
          >
            <div className="d-flex gap-4 align-items-center">
              <div className="d-flex gap-2 align-items-center">
                <div className="d-flex gap-2 align-items-center">
                  <img src={GuideIcon} alt="GuideIcon" />
                  <label htmlFor="" className="fs-5">
                    Guide
                  </label>
                </div>
              </div>
              <div>
                <select
                  name="Language"
                  id=""
                  className="formControl1 language"
                  onClick={(e) => e.stopPropagation()}
                  value={defaultLanguage}
                  onChange={(e) => setDefaultLanguage(e.target.value)}
                >
                  <option value="">Select</option>
                  {languageList?.map((language, index) => {
                    return (
                      <option value={language?.id} key={index + "n"}>
                        {language?.Name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div
                className="d-flex gap-2 align-items-center hike-input"
                onClick={(e) => e.stopPropagation()}
              >
                <label htmlFor="" className="fs-6">
                  Hike
                </label>
                <input name="Escort" type="number" className={`formControl3`} />
                <span className="fs-6">%</span>
              </div>
            </div>
            <div className="d-flex gap-4 algin-items-center">
              {Type == "Main" && (
                <div
                  className="hike-input d-flex align-items-center cursor-pointer"
                  id="copy_transport"
                  name="copy_transport_form"
                  onClick={(e) => {
                    setIsAlternate(false), e.stopPropagation();
                  }}
                >
                  <label
                    className="fontSize11px cursor-pointer"
                    htmlFor="copy_transport"
                  >
                    <FaMinus className="m-0 p-0" /> Remove
                  </label>
                </div>
              )}
              <span className="cursor-pointer fs-5">
                {!isOpen?.original ? (
                  <FaChevronCircleUp
                    className="text-primary"
                    onClick={(e) => {
                      e.stopPropagation(),
                        setIsOpen({ ...isOpen, copy: !isOpen?.copy });
                    }}
                  />
                ) : (
                  <FaChevronCircleDown
                    className="text-primary"
                    onClick={(e) => {
                      e.stopPropagation(),
                        setIsOpen({ ...isOpen, copy: !isOpen?.copy });
                    }}
                  />
                )}
              </span>
            </div>
          </div>
        </div>
      )}
      {isOpen?.original && (
        (isDataLoading) ? (
          ""
        ) : (
          <div className="row mt-3 m-0">
            <div className="col-12 d-flex justify-content-end align-items-end">
              <button
                className="btn btn-primary py-1 px-2 radius-4"
                onClick={handleFinalSave}
              >
                <i className="fa-solid fa-floppy-disk fs-4"></i>
              </button>
            </div>
          </div>
        )
      )}
    </>
  );
};

export default React.memo(Guidealternate);
