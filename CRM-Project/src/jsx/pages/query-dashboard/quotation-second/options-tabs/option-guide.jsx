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
import Alternate from "../itinerary-guide/Alternate";
import { quotationData } from "../../qoutation-first/quotationdata";
import moment from "moment";
import IsDataLoading from "../IsDataLoading";
import mathRoundHelper from "../../helper-methods/math.round";

const Guide = ({ Type, checkBoxes, headerDropdown, TabId }) => {
  const { qoutationData, queryData, dayTypeArr, isItineraryEditing } =
    useSelector((data) => data?.queryReducer);
  const { AutoGuideCheck } = useSelector(
    (data) => data?.ItineraryServiceReducer
  );

  const { OptionQoutationData } = useSelector(
    (data) => data?.activeTabOperationReducer
  );

  console.log(OptionQoutationData, "OptionQoutationData");

  const apiDataLoad = useSelector(
    (state) => state.inineraryServiceDataLoadReducer.guide
  );
  // ////console.log(Type,"Type");

  const [originalGuideForm, setOriginalGuideForm] = useState([]);
  const [guideTotals, setGuideTotals] = useState({});
  const [laTotals, setLaTotals] = useState({});
  const [othersTotals, setOthersTotals] = useState({});

  const [copyChecked, setCopyChecked] = useState(false);
  const [showDetails, setShowDetails] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);
  const [dayWiseTotals, setDayWiseTotals] = useState({});
  const [showAlternate, setShowAlternate] = useState(false);
  // const [supplement,setSupplement] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [backupGuideForms, setBackupGuideForms] = useState([]);
  const [guideFormValue, setGuideFormValue] = useState([]);
  const [languageList, setLanguageList] = useState([]);
  const [isAlternateActive, setIsAlternateActive] = useState(false);

  const [destinationList, setDestinationList] = useState([]);
  const [rowsPerIndex, setRowsPerIndex] = useState({});
  const [originalRowsPerIndex, setOriginalRowsPerIndex] = useState({});
  const [selectedRowData, setSelectedRowData] = useState(null);
  const hasInitialized = useRef(false);
  const [guideList, setGuideList] = useState([]);
  const prevRateListRef = useRef([]);
  const prevGuideFormValueRef = useRef([]);

  const [isMergeAllowed, setIsMergeAllowed] = useState(false);
  const [languageValue, setLanguageValue] = useState([]);
  const { guideFormData } = useSelector((data) => data?.itineraryReducer);
  const [rateList, setRateList] = useState([]);
  const [defaultLanguage, setDefaultLanguage] = useState(1);
  const [isDataLoading, setIsDataLoading] = useState(true);
  // console.log(defaultLanguage,"defaultLanguage");

  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState({
    original: false,
    copy: false,
  });
  const [guideCopy, setGuideCopy] = useState(false);
  const { GuideService } = useSelector((data) => data?.ItineraryServiceReducer);
  const [hikePercent, setHikePercent] = useState(0);
  const [indexrow, setindexrow] = useState(null);

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
  // state Markupvalue
  const [markupArray, setMarkupArray] = useState({
    Markup: { Data: [] },
  });

  const GuideData = markupArray?.Markup?.Data?.find(
    (item) => item.Type === "Guide"
  );

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

  const [isRateMerge, setIsRateMerge] = useState(true);

  // Itinerary tab change
  const itinerarayTab = useSelector(
    (state) => state.tabWiseDataLoadReducer.tab
  );
  const [supplement, setSupplement] = useState(false);
  // console.log(supplement, "supplement");

  const handleSupplementChange = (e) => {
    const isChecked = e.target.checked;

    setGuideFormValue((prev) =>
      prev.map((item) => ({
        ...item,
        Suppliment: isChecked ? "Yes" : "No", // or use true/false
      }))
    );
  };

  const formValueInitialization = () => {
    if (OptionQoutationData?.Days) {
      const hasGuideService = OptionQoutationData?.Days.some((day) =>
        day?.DayServices?.some(
          (service) =>
            service.ServiceType === "Guide" &&
            service.ServiceMainType === "Guest"
        )
      );

      console.log(OptionQoutationData?.Days, "hasGuideService");

      if (hasGuideService) {
        const initialFormValue = OptionQoutationData?.Days.map((day) => {
          const service = day?.DayServices?.filter(
            (service) =>
              service?.ServiceType == "Guide" &&
              service?.ServiceMainType == "Guest"
          )[0];

          if (service?.DestinationId) {
            service.DestinationId = parseInt(service.DestinationId);
            service.LanguageId = parseInt(service.LanguageId);
          }

          const details = service?.ServiceDetails.flat(1)[0] || "";
          // console.log(service, "service");

          return {
            id: queryData?.QueryId,
            Type: "Main",
            DayNo: day.Day,
            Date: day?.Date,
            DayType: service?.DayType,
            Destination: day?.DestinationId,
            DestinationUniqueId: day?.DestinationUniqueId,
            QuatationNo: OptionQoutationData?.QuotationNumber,
            DayUniqueId: day?.DayUniqueId,
            ItemFromDate: OptionQoutationData?.TourSummary?.FromDate,
            ItemToDate: OptionQoutationData?.TourSummary?.ToDate,
            ServiceId: service?.ServiceId || " ",
            Suppliment: service?.Suppliment == "Yes" ? "Yes" : "No",
            RateUniqueId: "",
            Escort: "1",
            FromDay: "",
            ToDay: "",
            ItemFromTime: "",
            ItemToTime: "",
            ServiceMainType: "No",
            Language: "",
            Supplier: details?.ItemSupplierDetail?.ItemSupplierId,
            Language: service?.LanguageId,
            LanguageAllowance: details?.ItemUnitCost?.LanguageAllowance,
            GuideFee: details?.ItemUnitCost?.GuideCost,
            OtherCost: details?.ItemUnitCost?.OtherCost,
            PaxSlab: "4",
            PaxInfo: {
              Adults: OptionQoutationData?.Pax?.AdultCount,
              Child: OptionQoutationData?.Pax?.ChildCount,
              Infant: OptionQoutationData?.Pax?.Infant,
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

        const guideInitialValue = OptionQoutationData?.Days?.map((day, ind) => {
          return {
            id: queryData?.QueryId,
            DayNo: day.Day,
            Date: day?.Date,
            Destination: day.DestinationId || "",
            DestinationUniqueId: day?.DestinationUniqueId,
            QuatationNo: OptionQoutationData?.QuotationNumber,
            DayUniqueId: day?.DayUniqueId,
            ItemFromDate: OptionQoutationData?.TourSummary?.FromDate,
            ItemToDate: OptionQoutationData?.TourSummary?.ToDate,
            RateUniqueId: "",
            Type: "Main",
            PaxInfo: {
              Adults: OptionQoutationData?.Pax?.AdultCount,
              Child: OptionQoutationData?.Pax?.ChildCount,
              Infant: OptionQoutationData?.Pax?.Infant,
              Escort: "",
            },
          };
        });
        // dispatch(setGuideServiceForm(guideInitialValue));
        setGuideFormValue(initialFormValue);
        // console.log(initialFormValue, "initialFormValue");

        setOriginalGuideForm(initialFormValue);
        const initialRows = {};

        OptionQoutationData?.Days?.forEach((day, index) => {
          const service = day?.DayServices?.find(
            (service) =>
              service?.ServiceType == "Guide" &&
              service?.ServiceMainType == "Guest"
          );

          const mappedRows =
            Array.isArray(service?.Rates) && service.Rates.length > 0
              ? service.Rates.map((cost) => ({
                StartPax: cost?.StartPax ?? "",
                EndPax: cost?.EndPax ?? "",
                GuideFee: mathRoundHelper(cost?.GuideFee) ?? "",
                LAFee: mathRoundHelper(cost?.LAFee) ?? "",
                OthersFee: mathRoundHelper(cost?.OthersFee) ?? "",
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
        // console.log(initialRows, "initialRows");

        setIsMergeAllowed(true);
      } else {
        const guideInitialValue = OptionQoutationData?.Days.map((day, ind) => {
          return {
            ...itineraryGuideIntialValue,
            id: queryData?.QueryId,
            DayNo: day.Day,
            Date: day?.Date,
            Destination: day.DestinationId || "",
            DestinationUniqueId: day?.DestinationUniqueId,
            QuatationNo: OptionQoutationData?.QuotationNumber,
            DayUniqueId: day?.DayUniqueId,
            ItemFromDate: OptionQoutationData?.TourSummary?.FromDate,
            ItemToDate: OptionQoutationData?.TourSummary?.ToDate,
            RateUniqueId: "",
            Type: "Main",
            PaxInfo: {
              Adults: OptionQoutationData?.Pax?.AdultCount,
              Child: OptionQoutationData?.Pax?.ChildCount,
              Infant: OptionQoutationData?.Pax?.Infant,
              Escort: "",
            },
          };
        });
        setGuideFormValue(guideInitialValue);
        setOriginalGuideForm(guideInitialValue);
        // dispatch(setGuideServiceForm(guideInitialValue));
      }
    }
  };

  useEffect(() => {
    formValueInitialization();
  }, [OptionQoutationData, checkBoxes, itinerarayTab]);
  // ////console.log(guideFormValue?.ServiceId,"checkserviceidd")

  // =================================================

  // set value into for it's first value from list
  const setFirstValueIntoForm = (index) => {
    const guideId = guideList?.length > 0 ? guideList[index]?.[0]?.id : "";
    const defaultLanguage = languageList?.length > 0 ? languageList[0]?.id : "";
    // setDefaultLanguage(defaultLanguage)

    const supplier =
      supplierList[index] != undefined ? supplierList[index][0]?.id : "";
    // console.log(defaultLanguage, "defaultLanguage22");

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
  // console.log(guideFormValue,"guideFormValue2");

  useEffect(() => {
    ////console.log("checkBoxes:2",checkBoxes);
    // ////console.log("useEffect fired:");
    // ////console.log("Days:", OptionQoutationData?.Days);

    OptionQoutationData?.Days?.forEach((day, i) => {
      // ////console.log(`Day ${i} DayServices:`, day.DayServices);
    });

    const allDaysEmpty =
      Array.isArray(OptionQoutationData?.Days) &&
      OptionQoutationData.Days.every((day) => {
        if (!Array.isArray(day.DayServices)) return true;
        const guideServices = day.DayServices.filter(
          (service) =>
            service.ServiceType === "Guide" &&
            service?.ServiceMainType == "Guest"
        );
        return guideServices.length === 0;
      });

    ////console.log("allDaysEmpty (Guide):",allDaysEmpty);
    ////console.log("checkBoxes includes guide:",checkBoxes?.includes("guide"));
    // console.log(allDaysEmpty, "allDaysEmpty");

    if (allDaysEmpty && checkBoxes?.includes("guide")) {
      guideFormValue?.forEach((form, index) => {
        // ////console.log(`Setting first value into form at index ${index}`);
        setFirstValueIntoForm(index);
      });
    }
  }, [OptionQoutationData, guideList, supplierList, languageList, checkBoxes]);

  // ////console.log();

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
  // console.log(guideFormValue, "guideformval1");

  const settingDayTypeFunction = (index) => {
    const selectedDayType = dayTypeArr[index];
    // console.log(selectedDayType, "selectedDayType");

    // console.log(dayTypeArr, "dayTypeArr");

    if (dayTypeArr[index] !== undefined && dayTypeArr[index] !== null) {
      setGuideFormValue((prevArr) => {
        const current = prevArr[index];

        if (current?.DayType === selectedDayType) return prevArr;
        // console.log(selectedDayType, "selectedDayType");

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
  // ////console.log(destination,"destination")

  const postDataToServer = async (destination) => {
    try {
      setIsDataLoading(true);
      try {
        const { data } = await axiosOther.post("languagelist");
        setLanguageList(data?.DataList);
      } catch (error) {
        ////console.log("error",error);
      }
      try {
        const { data } = await axiosOther.post("destinationlist");
        setDestinationList(data?.DataList);
      } catch (error) {
        ////console.log("error",error);
      }
      // Call MarkupValue
      try {
        let CompanyUniqueId = JSON.parse(
          localStorage.getItem("token")
        )?.companyKey;
        const { data } = await axiosOther.post("listCompanySetting", {
          id: "",
          CompanyId: CompanyUniqueId,
        });
        const rawData = data?.DataList?.[0]?.Value || [];
        const transformedData = rawData.map((item) => ({
          Type: item.ProductName,
          Markup: item.MarkupType,
          Value: item.MarkupValue,
        }));

        setMarkupArray({
          Markup: {
            MarkupType: "Service Wise",
            Data: transformedData,
          },
        });
      } catch (error) {
        console.error(error);
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
  // console.log(apiDataLoad,"apiDataLoadcheck");

  const getGuideListData = async (type, index, destination) => {
    //////console.log(type,index,destination,"checkdattaa")
    try {
      const { data } = await axiosOther.post("guideservicelist", {
        Destination: destination,
      });

      //////console.log(data,"data223");
      // setGuideList(data?.DataList || []);

      setGuideList((prev) => {
        const newArr = [...prev];
        newArr[index] = data?.DataList;
        return newArr;
      });
    } catch (error) {
      //////console.log("error",error);
    }
  };
  //////console.log(guideList,"guidelistt");

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
      parseInt(guideFormValue[index]?.StartPax || 0) +
      parseInt(guideFormValue[index]?.EndPax || 0) +
      parseInt(guideFormValue[index]?.GuideHalfDayFee || 0) +
      parseInt(guideFormValue[index]?.LAFullDayFee || 0) +
      parseInt(guideFormValue[index]?.LAHalfDayFee || 0) +
      parseInt(guideFormValue[index]?.OthersFullDayFee || 0) +
      parseInt(guideFormValue[index]?.OthersHalfDayFee || 0) +
      parseInt(guideFormValue[index]?.OtherCost || 0);
    //////console.log(totalCost,"totalCost");

    return totalCost;
  };

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

    // ////console.log("Before mergeGuideRateJson:", { guideFormValue, rateList, rowsPerIndex, index });
    setRowsPerIndex((prev) => ({
      ...prev, // Preserve all existing keys
      [index]: formattedServiceCost, // Update only the specific index
    }));
    // ////console.log("After mergeGuideRateJson:", { rowsPerIndex });
  };

  // Track previous ServiceIds to detect changes
  const prevServiceIds = useRef([]);

  // useEffect(() => {
  //   if (isMergeAllowed && Array.isArray(guideFormValue)) {
  //     guideFormValue.forEach((guide,index) => {
  //       const currentServiceId = guide?.ServiceId;
  //       const prevServiceId = prevServiceIds.current[index];

  //       // Only update if ServiceId has changed
  //       if (currentServiceId !== prevServiceId) {
  //         mergeGuideRateJson(index);
  //       }
  //     });

  //     // Update previous ServiceIds
  //     prevServiceIds.current = guideFormValue.map((item) => item?.ServiceId);

  //     // Reset merge flag
  //     setIsMergeAllowed(false);
  //   }
  // },[guideFormValue.map((item) => item?.ServiceId),rateList,isMergeAllowed]);

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
  ////console.log(selectedIndex,"selectedIndex");

  // Unified handleGuideFormChange function
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

      setOriginalRowsPerIndex((prev) => ({
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
  ////console.log(guideFormValue,"guideformvalue");

  const getQueryQuotation = JSON.parse(localStorage.getItem("Query_Qoutation"));

  const handleFinalSave = async () => {
    const finalFormValue = guideFormValue
      ?.map((form, index) => {
        return {
          ...form,
          Hike: hikePercent,
          Type: "Main",
          OptionId: TabId,
          Supplier: guideFormValue[index]?.Supplier || "",
          Rates: rowsPerIndex[index] || [],
          Sector: fromToDestinationList[index],
          TotalCosting: serviceCostData || [],
        };
      })
      .filter((services) => services?.Type != "None");

    // console.log(finalFormValue, "finalFormValue");
    try {
      const { data } = await axiosOther.post(
        "update-multiple-quatation-guide",
        finalFormValue
      );

      if (data?.status == 1) {
        notifySuccess(data.message || "Service Added.");
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
      ////console.log("error",error);
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
  // useEffect(() => {
  //   if (Type == "Main") {
  //     dispatch(setItineraryGuideData(guideFormValue));
  //   }
  // }, [guideFormValue]);
  ////console.log(guideFormValue,"guideFormValue");
  // ////console.log(guideFormValue[index]?.ServiceId,"ServiceId")
  // ////console.log(OptionQoutationData?.Pax?.AdultCount, "paxcheck");
  ////console.log(guideList,"guidelistt");
  ////console.log(supplierList,"supplierlistt")
  // console.log(guideFormValue,"guideFormValue");

  const getGuideRateApi = async (destination, index, date, serviceid) => {
    // let GuideUID = "";
    ////console.log(guideList,"guideList001");

    let GuideUID =
      guideList[index] && guideList[index].length > 0
        ? guideList[index]?.[0]
        : null;
    if (!GuideUID) return;
    ////console.log(GuideUID,"GuideUID");

    // let SupplierID =;
    let supplierid =
      supplierList[index] != undefined
        ? supplierList[index]?.find(
          (sup) => sup?.id == guideFormValue[index]?.Supplier
        )
        : " ";
    if (!supplierid) return;

    ////console.log(GuideUID,"GuideUID");
    // ////console.log(supplierid,"supplierid");

    let token = localStorage.getItem("token");
    let companyid = JSON.parse(token);
    // console.log(GuideUID,supplierid,companyid,"companyid")

    try {
      const { data } = await axiosOther.post("filter-guiderate-data", {
        id: "",
        GuideUID: GuideUID?.UniqueID,
        CompanyId: companyid?.CompanyUniqueId,
        date: date,
        QueryId: queryData?.QueryId,
        QuatationNo: OptionQoutationData?.QuotationNumber,
        // SupplierId: supplierid?.UniqueID,
        ServiceType: "",
        StartPax: "",
        // EndPax: OptionQoutationData?.Pax?.AdultCount,
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

        setOriginalRowsPerIndex((prev) => ({
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
  // console.log(guideFormValue, "guideformval");

  //  useEffect(()=>{
  //     if (!apiDataLoad) return;
  //     guideFormValue.forEach((form,index)=>{
  //       getGuideRateApi(form?.DestinationUniqueId,index,form?.Date);

  //     })

  //   },[guideFormValue,guideList,apiDataLoad])
  // console.log(apiDataLoad, "apiDataLoad");
  // const prevValuesRef = useRef([]);

  // const prevValuesRef = useRef([]);

  useEffect(() => {
    // console.log("useEffect triggered");
    if (!apiDataLoad) return;
    if (!Array.isArray(guideFormValue)) return;

    const noGuideGuestServices =
      OptionQoutationData?.Days?.every(
        (day) =>
          !day?.DayServices?.some(
            (service) =>
              service?.ServiceType === "Guide" &&
              service?.ServiceMainType === "Guest"
          )
      ) ?? true; // Default to true if OptionQoutationData?.Days is undefined
    // console.log(noGuideGuestServices,"noGuideGuestServices");

    if (noGuideGuestServices) {
      // console.log("Running all getGuideRateApi due to no guest services");
      guideFormValue.forEach((form, index) => {
        // console.log(`Calling getGuideRateApi for index ${index} (all)`);
        // console.log(form?.DestinationUniqueId,"(form?.DestinationUniqueId, index, form?.Date)");

        getGuideRateApi(form?.DestinationUniqueId, index, form?.Date);
      });
    } else {
      // Services exist — only fetch changed entries
      guideFormValue.forEach((form, index) => {
        const prev = prevValuesRef.current[index] || {};

        const hasChanged =
          form?.DestinationUniqueId !== prev?.DestinationUniqueId ||
          form?.Date !== prev?.Date ||
          form?.DayType !== prev?.DayType;

        if (hasChanged) {
          getGuideRateApi(form?.DestinationUniqueId, index, form?.Date);
        }
      });

      // Update previous values
      prevValuesRef.current = guideFormValue.map((form) => ({
        DestinationUniqueId: form?.DestinationUniqueId,
        Date: form?.Date,
        DayType: form?.DayType,
      }));
    }
  }, [
    guideFormValue.map((day) => day?.DayType).join(" "),
    guideList
      ?.map((group) =>
        group
          ?.map((guide) => `${guide?.id}-${guide?.Destination?.id ?? ""}`)
          .join("|")
      )
      .join("||"),
    OptionQoutationData,
    apiDataLoad,
  ]);
  // console.log(guideList,"guidelistt");
  // console.log(guideFormValue,"guideFormValue");

  ////console.log(guideFormValue,"guidedaytype");

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
    // setIsAlternate(true);
    // setGuideCopy(true);
    // e.stopPropagation();
    setShowAlternate((prev) => !prev);
  };

  const handleHikeChange = (e) => {
    const { value } = e.target;
    const hikePercent = parseFloat(value) || 0;
    setHikePercent(value);

    // Update main form values
    const updatedData = originalGuideForm?.map((item) => ({
      ...item,
      Hike: value,
      GuideFee:
        item?.GuideFee && !isNaN(item?.GuideFee)
          ? Math.floor(
            parseFloat(item?.GuideFee) +
            (parseFloat(item?.GuideFee) * hikePercent) / 100
          )
          : item?.GuideFee,
      LanguageAllowance:
        item?.LanguageAllowance && !isNaN(item?.LanguageAllowance)
          ? Math.floor(
            parseFloat(item?.LanguageAllowance) +
            (parseFloat(item?.LanguageAllowance) * hikePercent) / 100
          )
          : item?.LanguageAllowance,
      OtherCost:
        item?.OtherCost && !isNaN(item?.OtherCost)
          ? Math.floor(
            parseFloat(item?.OtherCost) +
            (parseFloat(item?.OtherCost) * hikePercent) / 100
          )
          : item?.OtherCost,
    }));
    setGuideFormValue(updatedData);

    // ✅ Always apply hike on originalRowsPerIndex, not prev!
    setRowsPerIndex(() => {
      const newRows = {};
      Object.keys(originalRowsPerIndex).forEach((key) => {
        newRows[key] = originalRowsPerIndex[key].map((row) => ({
          ...row,
          GuideFee:
            row.GuideFee && !isNaN(row.GuideFee)
              ? Math.floor(
                parseFloat(row.GuideFee) +
                (parseFloat(row.GuideFee) * hikePercent) / 100
              )
              : row.GuideFee,
          LAFee:
            row.LAFee && !isNaN(row.LAFee)
              ? Math.floor(
                parseFloat(row.LAFee) +
                (parseFloat(row.LAFee) * hikePercent) / 100
              )
              : row.LAFee,
          OthersFee:
            row.OthersFee && !isNaN(row.OthersFee)
              ? Math.floor(
                parseFloat(row.OthersFee) +
                (parseFloat(row.OthersFee) * hikePercent) / 100
              )
              : row.OthersFee,
          GuideFullDayFee:
            row.GuideFullDayFee && !isNaN(row.GuideFullDayFee)
              ? Math.floor(
                parseFloat(row.GuideFullDayFee) +
                (parseFloat(row.GuideFullDayFee) * hikePercent) / 100
              )
              : row.GuideFullDayFee,
          GuideHalfDayFee:
            row.GuideHalfDayFee && !isNaN(row.GuideHalfDayFee)
              ? Math.floor(
                parseFloat(row.GuideHalfDayFee) +
                (parseFloat(row.GuideHalfDayFee) * hikePercent) / 100
              )
              : row.GuideHalfDayFee,
          LAFullDayFee:
            row.LAFullDayFee && !isNaN(row.LAFullDayFee)
              ? Math.floor(
                parseFloat(row.LAFullDayFee) +
                (parseFloat(row.LAFullDayFee) * hikePercent) / 100
              )
              : row.LAFullDayFee,
          LAHalfDayFee:
            row.LAHalfDayFee && !isNaN(row.LAHalfDayFee)
              ? Math.floor(
                parseFloat(row.LAHalfDayFee) +
                (parseFloat(row.LAHalfDayFee) * hikePercent) / 100
              )
              : row.LAHalfDayFee,
          OthersFullDayFee:
            row.OthersFullDayFee && !isNaN(row.OthersFullDayFee)
              ? Math.floor(
                parseFloat(row.OthersFullDayFee) +
                (parseFloat(row.OthersFullDayFee) * hikePercent) / 100
              )
              : row.OthersFullDayFee,
          OthersHalfDayFee:
            row.OthersHalfDayFee && !isNaN(row.OthersHalfDayFee)
              ? Math.floor(
                parseFloat(row.OthersHalfDayFee) +
                (parseFloat(row.OthersHalfDayFee) * hikePercent) / 100
              )
              : row.OthersHalfDayFee,
        }));
      });
      return newRows;
    });
  };

  //  useEffect(() => {
  //   if (Object.keys(rowsPerIndex).length > 0) {
  //     calculateTotalPrice(rowsPerIndex);

  //   }
  // },[rowsPerIndex]);
  // ////console.log(rowsPerIndex,"22222");

  // const calculateTotalPrice = (rowsMap) => {
  //   let totalGuideFee = 0;
  //     let totalLanguageAllowance = 0;
  //     let totalOtherCost = 0;
  //     let allTotalCost = 0;
  //     ////console.log(rowsMap,"11111");

  //     rowsMap.forEach((item,index) => {
  //       totalGuideFee += parseFloat(item.GuideFee) || 0;
  //       totalLanguageAllowance += parseFloat(item.LanguageAllowance) || 0;
  //       totalOtherCost += parseFloat(item.OtherCost) || 0;
  //       allTotalCost += CountedTotalCost(index);
  //     });

  //     return {
  //       totalGuideFee,
  //       totalLanguageAllowance,
  //       totalOtherCost,
  //       allTotalCost,
  //     };

  //   // ////console.log("Guide Totals by index:",newGuideTotals);
  //   // ////console.log("LA Totals by index:",newLaTotals);
  //   // ////console.log("Others Totals by index:",newOthersTotals);

  //   // (Optional) your existing logic for day-wise markup totals
  // };

  useEffect(() => {
    const calculateTotalPrice = (data) => {
      let totalGuideFee = 0;
      let totalLanguageAllowance = 0;
      let totalOtherCost = 0;
      let allTotalCost = 0;
      ////console.log(data,"11111");

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
      ((totalGuideFee + totalLanguageAllowance + totalOtherCost) *
        GuideData?.Value) /
      100 || 0; // chnage markup value

    // dispatch(setGuidePrice(totalPriceForPax));
    // dispatch(setTogglePriceState());

    setGuideRateCalculation((prevData) => ({
      ...prevData,
      Price: {
        GuideFee: totalGuideFee,
        Allowence: totalLanguageAllowance,
        Other: totalOtherCost,
        Total: allTotalCost,
      },
      MarkupOfCost: {
        GuideFee: (totalGuideFee * GuideData?.Value) / 100 || 0, // Change Markupvalue
        LanguageAllowance:
          (totalLanguageAllowance * GuideData?.Value) / 100 || 0, // Change Markupvalue
        OtherCost: (totalOtherCost * GuideData?.Value) / 100 || 0, // Change Markupvalue
        Total: (allTotalCost * GuideData?.Value) / 100 || 0, // Change Markupvalue
      },
    }));
  }, [
    guideFormValue?.map((item) => item.GuideFee).join(","),
    guideFormValue?.map((item) => item.LanguageAllowance).join(","),
    guideFormValue?.map((item) => item.OtherCost).join(","),
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

  const handleChange = (index, name, value) => {
    const key = index;
    const updatedRows = [...(rowsPerIndex[key] || [])];

    // Safeguard in case the row is missing
    if (!updatedRows[index]) updatedRows[index] = {};

    updatedRows[index][name] = value;

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
              GuideFee: "",
              LAFee: "",
              OthersFee: "",
              Remarks: "",
            },
          ],
        }));
      }
    }
  };
  // { ////console.log(rowsPerIndex,"rowData") }
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
                GuideFee: "",
                LAFee: "",
                OthersFee: "",
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
    // console.log(rowsMap, "rowsMap");

    // ✅ First Part: Use rowsPerIndex to calculate slab-wise totals

    const totalIndexes = Object.keys(rowsPerIndex);
    // console.log(totalIndexes, "totalIndexes");

    const rowCount = Math.max(
      ...totalIndexes.map((index) => rowsPerIndex[index]?.length || 0)
    );

    const newGuideTotals = [];
    const newLaTotals = [];
    const newOthersTotals = [];

    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      let guideSum = 0;
      let laSum = 0;
      let othersSum = 0;

      totalIndexes.forEach((key) => {
        const row = rowsPerIndex[key]?.[rowIndex];
        // console.log(row, "row");

        if (row) {
          guideSum += parseFloat(row.GuideFee) || 0;
          laSum += parseFloat(row.LAFee) || 0;
          othersSum += parseFloat(row.OthersFee) || 0;
        }
      });
      // console.log(guideSum, "guideSum");

      newGuideTotals.push(guideSum);
      newLaTotals.push(laSum);
      newOthersTotals.push(othersSum);
    }
    // console.log(newGuideTotals, "newGuideTotals");

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
  // console.log(rowsPerIndex,"checkrowperindex");

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
            {/* {Type !== "Main" && (
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
            )} */}
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
              {Type === "Main" && (
                <div className="form-check check-sm">
                  <label htmlFor="supplement-checkbox" className="me-2">
                    Supplement
                  </label>
                  <input
                    type="checkbox"
                    className="form-check-input check-md"
                    id="supplement-checkbox"
                    name="Suppliment"
                    checked={guideFormValue.every(
                      (item) => item?.Suppliment === "Yes"
                    )}
                    onChange={(e) => handleSupplementChange(e)} // ✅ Correct
                  />
                </div>
              )}
            </div>
          </div>

          <div className="d-flex gap-4 align-items-center ms-auto">
            {/* Hike Input */}
            {Type === "Main" && (
              <div
                className="d-flex gap-2 align-items-center hike-input"
                onClick={(e) => e.stopPropagation()}
              >
                <label htmlFor="hike-input" className="fs-6">
                  Hike
                </label>
                <input
                  name="Escort"
                  type="number"
                  id="hike-input"
                  className="formControl3"
                  value={hikePercent}
                  onChange={handleHikeChange}
                />
                <span className="fs-6">%</span>
              </div>
            )}

            {/* Alternate Guide Button */}
            {Type === "Main" && (
              <div
                className="hike-input d-flex align-items-center cursor-pointer"
                id="copy-transport"
                name="copy_transport_form"
                onClick={handleAlternateGuide}
              >
                <label
                  htmlFor="copy-transport"
                  className="fontSize11px cursor-pointer"
                >
                  <FaPlus className="m-0 p-0" /> Alternate
                </label>
              </div>
            )}

            {/* Expand/Collapse Toggle */}
            <span className="cursor-pointer fs-5">
              {isOpen?.original ? (
                <FaChevronCircleDown
                  className="text-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen({ ...isOpen, original: false });
                  }}
                />
              ) : (
                <FaChevronCircleUp
                  className="text-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen({ ...isOpen, original: true });
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

        {isOpen?.original &&
          (isDataLoading ? (
            <IsDataLoading />
          ) : (
            <>
              <div className="col-12 px-0 mt-2">
                <PerfectScrollbar>
                  <table class="table table-bordered itinerary-table">
                    <thead>
                      <tr>
                        <th colSpan={6}> ..</th>

                        {Array.from({ length: maxSlabs }).map(
                          (_, slabIndex) => {
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
                          }
                        )}
                      </tr>
                      <tr>
                        <th className="text-center days-width-9">
                          {" "}
                          {guideFormValue[0]?.Date ? "Day / Date" : "Day"}
                        </th>
                        {(Type == "Local" || Type == "Foreigner") && (
                          <th rowSpan={2} className="py-1 align-middle">
                            Escort
                          </th>
                        )}
                        <th>City</th>
                        <th>FD</th>
                        <th>HD</th>
                        {/* <th>Day Type</th> */}
                        <th>Language</th>
                        <th>Supplier</th>
                        {/* <th>Guide Fee</th>
                      <th>Language Allowence</th>
                      <th>Other Cost</th>
                      <th>Total Cost</th> */}

                        {Array.from({ length: maxSlabs }).map(
                          (_, slabIndex) => (
                            <React.Fragment key={`labels-${slabIndex}`}>
                              <th>Guide</th>
                              <th>LA</th>
                              <th>Others</th>
                            </React.Fragment>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {guideFormValue
                        ?.map((form, index) => ({
                          item: form,
                          originalIndex: index,
                        }))
                        ?.filter(({ item }) => item?.ServiceMainType === "No")
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
                              <td
                                onClick={() => handleShowDetails(item, index)}
                              >
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
                                    {OptionQoutationData?.Days?.map(
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
                                <div className="form-check d-flex align-items-center justify-content-center">
                                  <input
                                    type="checkbox"
                                    className="form-check-input height-em-1 width-em-1"
                                    checked={
                                      guideFormValue[originalIndex]?.DayType ===
                                      "Full Day"
                                    }
                                    onChange={() =>
                                      handleGuideFormChange(
                                        originalIndex,
                                        "DayType",
                                        guideFormValue[originalIndex]
                                          ?.DayType === "Full Day"
                                          ? ""
                                          : "Full Day"
                                      )
                                    }
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="form-check d-flex align-items-center justify-content-center">
                                  <input
                                    type="checkbox"
                                    className="form-check-input height-em-1 width-em-1"
                                    checked={
                                      guideFormValue[originalIndex]?.DayType ===
                                      "Half Day"
                                    }
                                    onChange={() =>
                                      handleGuideFormChange(
                                        originalIndex,
                                        "DayType",
                                        guideFormValue[originalIndex]
                                          ?.DayType === "Half Day"
                                          ? ""
                                          : "Half Day"
                                      )
                                    }
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
                        <td
                          colSpan={5}
                          rowSpan={3}
                          className="text-center fs-6"
                        >
                          Total
                        </td>
                        <td colSpan={1}>Guide Cost</td>

                        {Array.from({ length: maxSlabs }).map(
                          (_, slabIndex) => (
                            <React.Fragment key={`costs-${slabIndex}`}>
                              {/* {console.log(guideTotals, "guideTotals[slabIndex]")
                              } */}
                              <td colSpan={1}>{mathRoundHelper(guideTotals[slabIndex] || 0)}</td>
                              <td colSpan={1}>{mathRoundHelper(laTotals[slabIndex] || 0)}</td>
                              <td colSpan={1}>
                                {mathRoundHelper(othersTotals[slabIndex] || 0)}
                              </td>
                            </React.Fragment>
                          )
                        )}

                        {/* <td colSpan={12}>{totalAmount}</td> */}

                        {/* <td>{guideRateCalculation?.Price?.Allowence}</td>
                      <td>{guideRateCalculation?.Price?.Other}</td>
                      <td>{guideRateCalculation?.Price?.Total}</td> */}
                      </tr>
                      <tr className="costing-td">
                        <td colSpan={1}>
                          Markup ({GuideData?.Value}) {GuideData?.Markup}
                        </td>
                        {Array.from({ length: maxSlabs }).map(
                          (_, slabIndex) => {
                            const guide = guideTotals[slabIndex] || 0;
                            const la = laTotals[slabIndex] || 0;
                            const others = othersTotals[slabIndex] || 0;
                            const guideWithMarkup =
                              (guide * GuideData?.Value) / 100 || 0; // Change Markupvalue
                            const laWithMarkup =
                              (la * GuideData?.Value) / 100 || 0; // Change Markupvalue
                            const othersWithMarkup =
                              (others * GuideData?.Value) / 100 || 0; // Change Markupvalue
                            return (
                              <React.Fragment key={`markup-${slabIndex}`}>
                                <td colSpan={1}>
                                  {mathRoundHelper(guideWithMarkup.toFixed(2))}
                                </td>
                                <td colSpan={1}>{mathRoundHelper(laWithMarkup.toFixed(2))}</td>
                                <td colSpan={1}>
                                  {mathRoundHelper(othersWithMarkup.toFixed(2))}
                                </td>
                              </React.Fragment>
                            );
                          }
                        )}
                      </tr>
                      <tr className="costing-td">
                        <td colSpan={1}> Grand Total</td>
                        {Array.from({ length: maxSlabs }).map(
                          (_, slabIndex) => {
                            const guide = guideTotals[slabIndex] || 0;
                            const la = laTotals[slabIndex] || 0;
                            const others = othersTotals[slabIndex] || 0;
                            const guideWithMarkup =
                              guide + (guide * GuideData?.Value) / 100 || 0; // Change Markupvalue
                            const laWithMarkup =
                              la + (la * GuideData?.Value) / 100 || 0; // Change Markupvalue
                            const othersWithMarkup =
                              others + (others * GuideData?.Value) / 100 || 0; // Change Markupvalue
                            return (
                              <React.Fragment key={`grand-total-${slabIndex}`}>
                                <td colSpan={1}>
                                  {mathRoundHelper(guideWithMarkup.toFixed(2))}
                                </td>
                                <td colSpan={1}>{mathRoundHelper(laWithMarkup.toFixed(2))}</td>
                                <td colSpan={1}>
                                  {mathRoundHelper(othersWithMarkup.toFixed(2))}
                                </td>
                              </React.Fragment>
                            );
                          }
                        )}
                      </tr>
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
                        {rowsPerIndex[selectedIndex]?.map((rowData,index) => (
                          <th key={`range-${index}`} colSpan={3} className="align-middle text-center">
                            {rowData.StartPax} to {rowData.EndPax}
                          </th>
                        ))}
                      </tr>

                      <tr>
                        {rowsPerIndex[selectedIndex]?.map((_,index) => (
                          <React.Fragment key={`labels-${index}`}>
                            <th>Guide</th>
                            <th>LA</th>
                            <th>Others</th>
                          </React.Fragment>
                        ))}
                      </tr>
                    </thead>


                    <tbody>
                      <tr>
                        {rowsPerIndex[selectedIndex]?.map((rowData,index) => {
                          const dayType = guideFormValue[selectedIndex]?.DayType
                          const isFullDay = dayType === "Full Day";
                          // ////console.log(index,"dayType");

                          return (
                            <React.Fragment key={`inputs-${index}`}>
                              <td>
                                <input
                                  type="number"
                                  className="formControl1"
                                  value={isFullDay ? rowData.GuideFullDayFee : rowData.GuideHalfDayFee}
                                  onChange={(e) =>
                                    handleChange(
                                      index,
                                      isFullDay ? "GuideFullDayFee" : "GuideHalfDayFee",
                                      e.target.value
                                    )
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className="formControl1"
                                  value={isFullDay ? rowData.LAFullDayFee : rowData.LAHalfDayFee}
                                  onChange={(e) =>
                                    handleChange(
                                      index,
                                      isFullDay ? "LAFullDayFee" : "LAHalfDayFee",
                                      e.target.value
                                    )
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className="formControl1"
                                  value={isFullDay ? rowData.OthersFullDayFee : rowData.OthersHalfDayFee}
                                  onChange={(e) =>
                                    handleChange(
                                      index,
                                      isFullDay ? "OthersFullDayFee" : "OthersHalfDayFee",
                                      e.target.value
                                    )
                                  }
                                />
                              </td>
                            </React.Fragment>
                          );
                        })}
                      </tr>
                    </tbody>


                  </table>
                </PerfectScrollbar>
              </div>
            )} */}
            </>
          ))}
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
          {isOpen?.copy && (
            <>
              <div className="col-8 px-0 mt-2">
                {/* <div className="col-lg-8"> */}
                <PerfectScrollbar>
                  <table class="table table-bordered itinerary-table">
                    <thead>
                      <tr>
                        <th className="text-center">
                          {" "}
                          {guideFormValue[0]?.Date ? "Day / Date" : "Day"}
                        </th>
                        {(Type == "Local" || Type == "Foreigner") && (
                          <th rowSpan={2} className="py-1 align-middle">
                            Escort
                          </th>
                        )}
                        <th>City</th>
                        <th>FD</th>
                        <th>HD</th>
                        {/* <th>Day Type</th> */}
                        <th>Language</th>
                        <th>Supplier</th>
                        <th>Guide Fee</th>
                        <th>Language Allowence</th>
                        <th>Other Cost</th>
                        <th>Total Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {guideFormValue
                        ?.map((form, index) => ({
                          item: form,
                          originalIndex: index,
                        }))
                        ?.filter(({ item }) => item?.ServiceMainType === "Yes")
                        ?.map(({ item, originalIndex }, index) => {
                          return (
                            <tr key={index}>
                              <td>
                                <div className="d-flex gap-1 justify-content-start">
                                  <div className="d-flex gap-1">
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
                                    {OptionQoutationData?.Days?.map(
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
                                    name="Language"
                                    id=""
                                    className="formControl1"
                                    value={languageValue[index]}
                                    onChange={(e) =>
                                      handleLanguageChange(index, e)
                                    }
                                  >
                                    <option value="">Select</option>
                                    {languageList?.map((language, index) => {
                                      return (
                                        <option
                                          value={language?.id}
                                          key={index + "n"}
                                        >
                                          {language?.Name}
                                        </option>
                                      );
                                    })}
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
                              <td>
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
                              </td>
                            </tr>
                          );
                        })}
                      <tr className="costing-td">
                        <td
                          colSpan={
                            Type == "Local" || Type == "Foreigner" ? 6 : 5
                          }
                          rowSpan={3}
                          className="text-center fs-6"
                        >
                          Total
                        </td>
                        <td>Guide Cost</td>
                        <td>{mathRoundHelper(guideRateCalculation?.Price?.GuideFee)}</td>
                        <td>{mathRoundHelper(guideRateCalculation?.Price?.Allowence)}</td>
                        <td>{mathRoundHelper(guideRateCalculation?.Price?.Other)}</td>
                        <td>{mathRoundHelper(guideRateCalculation?.Price?.Total)}</td>
                      </tr>
                      <tr className="costing-td">
                        <td>Markup(5)%</td>
                        <td>{mathRoundHelper(guideRateCalculation?.MarkupOfCost?.GuideFee)}</td>
                        <td>
                          {
                            mathRoundHelper(guideRateCalculation?.MarkupOfCost
                              ?.LanguageAllowance)
                          }
                        </td>
                        <td>{mathRoundHelper(guideRateCalculation?.MarkupOfCost?.OtherCost)}</td>
                        <td>{mathRoundHelper(guideRateCalculation?.MarkupOfCost?.Total)}</td>
                      </tr>
                      <tr className="costing-td">
                        <td>Total</td>
                        <td>
                          {mathRoundHelper(guideRateCalculation?.Price?.GuideFee +
                            guideRateCalculation?.MarkupOfCost?.GuideFee)}
                        </td>
                        <td>
                          {mathRoundHelper(guideRateCalculation?.Price?.Allowence +
                            guideRateCalculation?.MarkupOfCost
                              ?.LanguageAllowance)}
                        </td>
                        <td>
                          {mathRoundHelper(guideRateCalculation?.Price?.Other +
                            guideRateCalculation?.MarkupOfCost?.OtherCost)}
                        </td>
                        <td>
                          {mathRoundHelper(guideRateCalculation?.Price?.Total +
                            guideRateCalculation?.MarkupOfCost?.Total)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </PerfectScrollbar>
                {/* </div> */}
              </div>
            </>
          )}
        </div>
      )}

      {isOpen?.original &&
        (isDataLoading ? (
          ""
        ) : (
          <>
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
          </>
        ))}
      {showAlternate && <Alternate checkBoxes={checkBoxes} />}
    </>
  );
};

export default React.memo(Guide);
