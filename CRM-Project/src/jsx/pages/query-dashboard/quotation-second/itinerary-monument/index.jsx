import React, { useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { axiosOther } from "../../../../../http/axios_base_url";
import { itineraryMonumentInitialValue } from "../qoutation_initial_value";

import {
  notifyError,
  notifyHotError,
  notifyHotSuccess,
  notifySuccess,
} from "../../../../../helper/notify";
import {
  setLocalMonumentFormValue,
  setQoutationResponseData,
  setFinalMonumentFormValue,
  storeMonumentDayType,
  resetFinalMonumentFormValue,
} from "../../../../../store/actions/queryAction";
import monumentIcon from "../../../../../images/itinerary/monument.svg";
import {
  setMonumentPrice,
  setTogglePriceState,
  setTotalMonumentPricePax,
} from "../../../../../store/actions/PriceAction";
import {
  setItineraryMonumentData,
  setLocalItineraryMonumentData,
} from "../../../../../store/actions/itineraryDataAction";
import { FaChevronCircleUp, FaChevronCircleDown } from "react-icons/fa";
import { Modal, Button, Row, Col, Table } from "react-bootstrap";
import { MdEdit } from "react-icons/md";
import PerfectScrollbar from "react-perfect-scrollbar";
import { monumentAutoGuideToggle } from "../../../../../store/actions/ItineraryServiceAction";
import HotelIcon from "../../../../../images/itinerary/hotel.svg";
import { Toaster, toast } from "react-hot-toast";
import { preinit } from "react-dom";
import { quotationData } from "../../qoutation-first/quotationdata";
import {
  setItineraryCopyMonumentFormData,
  setItineraryCopyMonumentFormDataCheckbox,
} from "../../../../../store/actions/itineraryServiceCopyAction/itineraryServiceCopyAction";
import moment from "moment";
import IsDataLoading from "../IsDataLoading";
import mathRoundHelper from "../../helper-methods/math.round";

const Monument = ({ Type, checkBoxes, headerDropdown }) => {
  const { qoutationData, queryData, isItineraryEditing, localMonumentValue } =
    useSelector((data) => data?.queryReducer);
  const { AutoGuideCheck } = useSelector(
    (data) => data?.ItineraryServiceReducer
  );

  const monumentDataLoad = useSelector(
    (state) => state.inineraryServiceDataLoadReducer.monument
  );

  const [monumentDataLoadCount, setMonumentDataLoadCount] = useState(true);
  const [searchMonumenName, setSearchMonumenName] = useState("");
  const dispatch = useDispatch();
  const tokenData = JSON.parse(localStorage.getItem("token"));
  const prevServiceIds = useRef([]);
  const [monumentFromValue, setMonumentFormValue] = useState([]);
  const [monumentFormDatas, setMonumentFormData] = useState([]);
  const [isCopyHotel, setIsCopyHotel] = useState(false);
  const [originalFromValue, setOriginalFormValue] = useState([]);
  const [monumentPackageList, setMonumentPackageList] = useState([]);
  const [isInitializing, setIsInitializing] = useState(true);
  const [monumentPackageLists, setMonumentPackageLists] = useState([]);
  const [multipleMonument, setMultipleMonument] = useState([]);
  const [destinationList, setDestinationList] = useState([]);
  const { monumentFormData, localMonumentFormData } = useSelector(
    (data) => data?.itineraryReducer
  );
  const [dayType, setDayType] = useState([]);
  const [rateList, setRateList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [modalCentered, setModalCentered] = useState(false);
  const [changeMonument, setChangeMonument] = useState({
    index: "",
    monument: [],
  });
  console.log(changeMonument, "changeMonument")
  const [isEditingMonument, setIsEditingMonument] = useState({
    index: "",
    editing: false,
  });
  const [tempMonument, setTempMonument] = useState({
    id: "",
    name: "",
  });
  const [monumentMasterList, setMonumentMasterList] = useState([]);
  const [hikePercent, setHikePercent] = useState("");
  const [paxFormValue, setPaxFormValue] = useState({
    Adults: "",
    Child: "",
    Infant: "",
  });
  const [paxModal, setPaxModal] = useState({
    modalIndex: "",
    isShow: false,
  });
  const [supplierList, setSupplierList] = useState([]);
  const [monumentRateCalculate, setMonumentRateCalculate] = useState({
    Price: {
      Adult: "",
      FAdult: "",
      Child: "",
      FChild: "",
    },
    Markup: {
      Adult: "",
      FAdult: "",
      Child: "",
      FChild: "",
    },
    MarkupOfCost: {
      Adult: "",
      FAdult: "",
      Child: "",
      FChild: "",
    },
  });
  const [checkMonumentPrice, setCheckMonumentPrice] = useState("Foreign");
  const [isIncludeMonument, setIsIncludeMonument] = useState("No");
  const [fromToDestinationList, setFromToDestinationList] = useState([]);
  const [isPackageLoaded, setIsPackageLoaded] = useState(false);
  const [isSupplierLoaded, setIsSupplierLoaded] = useState(false);
  const [isFormValue, setIsFormValue] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [isDataLoading, setIsDataLoading] = useState(true);
  // state of markupvalue
  const [markupArray, setMarkupArray] = useState({
    Markup: { Data: [] },
  });
  // console.log(markupArray, "markupArray111");
  const MonumentData = markupArray?.Markup?.Data?.find(
    (item) => item.Type === "Monument"
  );

  const formValueInitialization = () => {
    if (qoutationData?.Days) {
      const hasMonumentService = qoutationData?.Days.some((day) =>
        day?.DayServices?.some((service) => service.ServiceType === "Monument")
      );

      if (hasMonumentService) {
        const initialFormValue = [];
        const monumentsByDestination = {};
        const destinationDayMap = {};

        // Group days by destination BUT preserve original order
        qoutationData.Days.forEach((day, dayIndex) => {
          const freshDestinationKey = `${day.DestinationId}_${day.DestinationUniqueId}`;
          if (!destinationDayMap[freshDestinationKey]) {
            destinationDayMap[freshDestinationKey] = [];
          }
          destinationDayMap[freshDestinationKey].push({
            ...day,
            originalDayIndex: dayIndex,
          });
        });

        // Sort days within each destination by original day index
        Object.keys(destinationDayMap).forEach((destinationKey) => {
          destinationDayMap[destinationKey].sort(
            (a, b) => a.originalDayIndex - b.originalDayIndex
          );
        });

        // Process destinations in the order they first appear
        const destinationOrder = [];
        qoutationData.Days.forEach((day) => {
          const freshDestinationKey = `${day.DestinationId}_${day.DestinationUniqueId}`;
          if (!destinationOrder.includes(freshDestinationKey)) {
            destinationOrder.push(freshDestinationKey);
          }
        });

        // Process each destination in order
        destinationOrder.forEach((destinationKey) => {
          const daysForDestination = destinationDayMap[destinationKey];

          daysForDestination.forEach((day) => {
            const monumentServices =
              day?.DayServices?.filter((s) => s?.ServiceType === "Monument") ||
              [];

            monumentServices.forEach((service) => {
              const details = service?.ServiceDetails?.[0];

              if (service?.DestinationId) {
                service.DestinationId = parseInt(service.DestinationId);
                service.ServiceId = parseInt(service.ServiceId);
              }

              // fresh destination key for this row
              const freshDestinationKey = `${day.DestinationId}_${day.DestinationUniqueId}`;

              initialFormValue.push({
                id: queryData?.QueryId,
                Leasure: service?.Leasure,
                QuatationNo: qoutationData?.QuotationNumber,
                DayType: Type,
                DayNo: day.Day,
                DayUniqueId: day?.DayUniqueId,
                Destination: service?.DestinationId || day?.DestinationId, // ✅ always fresh
                Date: day?.Date,
                DestinationUniqueId: day?.DestinationUniqueId, // ✅ always fresh
                ServiceIdMonument: [],
                Escort: 1,
                FromDay: "",
                ToDay: "",
                ServiceId: service?.ServiceId || "",
                ServiceUniqueId:
                  service?.ServiceUniqueId ||
                  `${day.DayUniqueId}-${service.ServiceId}`,
                ItemFromDate: details?.TimingDetails?.ItemFromDate,
                ItemFromTime: "",
                ItemToDate: details?.TimingDetails?.ItemToDate,
                SupplierId: details?.ItemSupplierDetail?.ItemSupplierId || "",
                MonumentDayType: service?.MonumentDayType,
                ItemToTime: "",
                ServiceMainType: "No",
                RateUniqueId: "",
                ItemUnitCost: {
                  Adult:
                    mathRoundHelper(details?.ItemUnitCost?.AdultCost) || " ",
                  Child:
                    mathRoundHelper(details?.ItemUnitCost?.ChildCost) || " ",
                  FAdult:
                    mathRoundHelper(details?.ItemUnitCost?.FAdultCost) || " ",
                  FChild:
                    mathRoundHelper(details?.ItemUnitCost?.FChildCost) || "",
                },
                MonumentTime: service?.MonumentTime,
                PaxInfo: {
                  Adults: qoutationData?.Pax?.AdultCount,
                  Child: qoutationData?.Pax?.ChildCount,
                  Infant: qoutationData?.Pax?.Infant,
                  Escort: "",
                },
                ForiegnerPaxInfo: {
                  Adults: "",
                  Child: "",
                  Infant: "",
                  Escort: "",
                },
                DayServices: [service],
                DestinationKey: freshDestinationKey, // ✅ fresh key
                originalDayIndex: day.originalDayIndex,
              });

              // Monuments by destination
              const serviceMonuments =
                service?.ServicePackageMonument?.map((item) => ({
                  id: item?.MonumentId,
                  name: item?.MonumentName,
                  dayUniqueId: day?.DayUniqueId,
                  destinationKey: freshDestinationKey,
                  serviceId: service?.ServiceId,
                  serviceUniqueId:
                    service?.ServiceUniqueId ||
                    `${day.DayUniqueId}-${service.ServiceId}`,
                  RateJson: {
                    ForeignerAdultEntFee:
                      item?.FAdultPrice ||
                      item?.RateJson?.[0]?.ForeignerAdultEntFee ||
                      "0",
                    ForeignerChildEntFee:
                      item?.FChildPrice ||
                      item?.RateJson?.[0]?.ForeignerChildEntFee ||
                      "0",
                    IndianAdultEntFee:
                      item?.IAdultPrice ||
                      item?.RateJson?.[0]?.IndianAdultEntFee ||
                      "0",
                    IndianChildEntFee:
                      item?.IChildPrice ||
                      item?.RateJson?.[0]?.IndianChildEntFee ||
                      "0",
                  },
                })) || [];

              if (!monumentsByDestination[freshDestinationKey]) {
                monumentsByDestination[freshDestinationKey] = [];
              }
              monumentsByDestination[freshDestinationKey].push(
                ...serviceMonuments
              );
            });
          });
        });

        // Sort final form value by original day index
        initialFormValue.sort(
          (a, b) => a.originalDayIndex - b.originalDayIndex
        );

        // ✅ Monuments mapping
        // const monumentsByDay = initialFormValue.map((formRow) => {
        //   if (formRow.isCopied) {
        //     const originalRow = initialFormValue.find(
        //       (r) => !r.isCopied && r.DayUniqueId === formRow.DayUniqueId
        //     );

        //                   console.log(originalRow, 'originalRow')
        //     return originalRow
        //       ? monumentsByDestination[originalRow.DestinationKey]?.filter(
        //           (monument) => monument.dayUniqueId === originalRow.DayUniqueId
        //         ) || []
        //       : [];

        //   } else {
        //     return (
        //       monumentsByDestination[formRow.DestinationKey]?.filter(
        //         (monument) => monument.dayUniqueId === formRow.DayUniqueId
        //       ) || []
        //     );
        //   }
        // });

        const monumentsByDay = initialFormValue.map((formRow, index) => {
          if (index === 0) {
            return [];
          }

          let monuments = [];
          const destinationMonuments =
            monumentsByDestination[formRow.DestinationKey] || [];

          // Prefer ServiceUniqueId mapping first
          monuments = destinationMonuments.filter(
            (m) => m.serviceUniqueId === formRow.ServiceUniqueId
          );

          // Fallback: if nothing found, use DayUniqueId
          if (monuments.length === 0) {
            monuments = destinationMonuments.filter(
              (m) => m.dayUniqueId === formRow.DayUniqueId
            );
          }

          // Deduplicate by monument.id
          const uniqueMonuments = monuments.filter(
            (m, idx, self) => idx === self.findIndex((x) => x.id === m.id)
          );

          return uniqueMonuments;
        });

        // console.log(monumentsByDay, "monumentsByDay");

        setMultipleMonument(monumentsByDay);
        setMonumentFormValue(initialFormValue);
        setOriginalFormValue(initialFormValue);
        dispatch(setLocalMonumentFormValue(initialFormValue));
      } else {
        // No monument services - maintain original day order
        const monumentInitialValue = qoutationData?.Days?.map((day) => ({
          ...itineraryMonumentInitialValue,
          id: queryData?.QueryId,
          DayNo: day.Day,
          Date: day?.Date,
          Destination: day.DestinationId || "",
          DestinationUniqueId: day?.DestinationUniqueId,
          QuatationNo: qoutationData?.QuotationNumber,
          ItemFromDate: qoutationData?.TourSummary?.FromDate,
          ItemToDate: qoutationData?.TourSummary?.ToDate,
          DayUniqueId: day?.DayUniqueId,
          ServiceIdMonument: [],
          PaxInfo: {
            Adults: qoutationData?.Pax?.AdultCount,
            Child: qoutationData?.Pax?.ChildCount,
            Infant: qoutationData?.Pax?.Infant,
            Escort: "",
          },
        }));

        setMonumentFormValue(monumentInitialValue);
        setOriginalFormValue(monumentInitialValue);
        dispatch(setLocalMonumentFormValue(monumentInitialValue));
      }
    }
  };

  useEffect(() => {
    formValueInitialization();
    setIsInitializing(false);
  }, [qoutationData]);

  const getMonumentPackageListDependently = async (cityId, index) => {
    try {
      const { data } = await axiosOther.post("monument-package-list", {
        Destination: cityId,
        Default: "Yes",
      });
      // console.log(data?.DataList, "DataList999");
      //  setFirstValueIntoForm(data?.DataList)

      setMonumentPackageList((prevList) => {
        const newList = [...prevList];
        newList[index] = data?.DataList || [];

        return newList;
      });
    } catch (error) {
      console.log("error", error);
    }
  };
  // console.log(monumentPackageList,"monumentPackageList");
  // console.log(monumentFromValue,"monumentFromValue");

  useEffect(() => {
    // if (!monumentDataLoad) return;
    const fetchAllPackages = async () => {
      const promises = monumentFromValue.map((row, index) =>
        row.Destination
          ? getMonumentPackageListDependently(row.Destination, index)
          : Promise.resolve()
      );

      await Promise.all(promises);
    };
    fetchAllPackages();
  }, [monumentFromValue?.map((row) => row.Destination).join(",")]);

  // useEffect(() => {
  //   setMonumentPackageList(
  //     Array(qoutationData?.Days?.length || 0).fill([])
  //   );
  // }, [qoutationData?.Days?.length]);

  // let fee = getTotalforFee(index)
  //    console.log(fee,"feeefjf")
  // console.log(monumentFromValue,"monumentFromValue");

  const processedIndices = useRef(new Set());

  // useEffect(() => {
  //   setMonumentPackageLists([...monumentPackageList]);
  // }, [monumentPackageList]);
  const setFirstValueIntoForm = (index) => {
    // console.log(index, "index");

    if (
      !Array.isArray(monumentPackageList) ||
      !Array.isArray(monumentPackageList[index]) ||
      monumentPackageList[index].length === 0
    ) {
      // Data not ready yet
      return;
    }

    const processedIndices = new Set();

    // Skip if already processed
    if (processedIndices.has(index)) {
      return;
    }

    // Process monumentPackageList to handle duplicate monument IDs
    const processActivityIds = (monumentPackageList) => {
      const idIndicesMap = {};
      // Group indices by monument ID
      monumentPackageList.forEach((subArray, idx) => {
        if (
          Array.isArray(subArray) &&
          subArray[0]?.id !== undefined &&
          subArray[0]?.id !== null
        ) {
          const id = subArray[0].id;
          if (!idIndicesMap[id]) {
            idIndicesMap[id] = [];
          }
          idIndicesMap[id].push(idx);
        }
      });

      // console.log("idIndicesMap:", idIndicesMap);

      // Initialize result with null values
      const result = Array(monumentPackageList.length).fill(null);

      // Assign IDs: only the second occurrence (index 1) of duplicates gets the ID
      for (const id in idIndicesMap) {
        const indices = idIndicesMap[id];
        if (indices.length > 1) {
          // For duplicates, assign ID to the second occurrence (index 1 in the group)
          result[indices[1]] = id; // Second occurrence gets the ID
        } else {
          // For non-duplicates, assign the ID unless it's first or last index
          if (
            indices[0] !== 0 &&
            indices[0] !== monumentPackageList.length - 1
          ) {
            result[indices[0]] = id;
          }
        }
      }

      // console.log("Processed result:", result);
      return result;
    };

    // Get the processed activity IDs
    const processedIds = processActivityIds(monumentPackageList);
    const activityId = processedIds[index] ?? null; // Ensure null for invalid indices

    const program = monumentPackageList[index]?.[0];
    // const supplier = supplierList[index]?.[0];
    const isFirstOrLast =
      index === 0 || index === monumentPackageList.length - 1;

    let sumFAdult = 0;
    let sumAdult = 0;

    if (program?.MultipleMonument && Array.isArray(program.MultipleMonument)) {
      program.MultipleMonument.forEach((monument) => {
        if (
          monument.RateJson &&
          Array.isArray(monument.RateJson) &&
          monument.RateJson.length > 0
        ) {
          const firstRate = monument.RateJson[0];
          sumFAdult += Number(firstRate.ForeignerAdultEntFee) || 0;
          sumAdult += Number(firstRate.IndianAdultEntFee) || 0;
        }
      });
    }

    // console.log(activityId, "activityId");

    setMonumentFormValue((prevArr) => {
      const current = prevArr[index] || {};
      const newValues = {
        ...current,
        ServiceId: isFirstOrLast ? null : activityId, // First and last indices get null
        // SupplierId:
        //   isFirstOrLast || current.SupplierId
        //     ? current.SupplierId
        //     : supplier?.id || current.SupplierId,
        // SupplierName: supplier?.Name || current.SupplierName,
      };

      const newArr = [...prevArr];
      newArr[index] = newValues;
      return newArr;
    });
    setOriginalFormValue((prevArr) => {
      const current = prevArr[index] || {};
      const newValues = {
        ...current,
        ServiceId: isFirstOrLast ? null : activityId, // First and last indices get null
        // SupplierId:
        //   isFirstOrLast || current.SupplierId
        //     ? current.SupplierId
        //     : supplier?.id || current.SupplierId,
        // SupplierName: supplier?.Name || current.SupplierName,
      };

      const newArr = [...prevArr];
      newArr[index] = newValues;
      return newArr;
    });
    // console.log(monumentFromValue, "monumentFromValue");

    processedIndices.add(index); // Mark index as processed
    // console.log(monumentFromValue, "monumentFromValue");

    if (program?.id) {
      filterMonumentPackageList(program.id, index);
    }
  };

  useEffect(() => {
    if (!monumentDataLoad) return;
    // console.log("Effect triggered");

    const days = qoutationData?.Days || [];
    // console.log("Days:",days);

    const allDaysEmpty =
      Array.isArray(qoutationData?.Days) &&
      qoutationData.Days.every((day) => {
        if (!Array.isArray(day.DayServices)) return true;
        const guideServices = day.DayServices.filter(
          (service) =>
            service.ServiceType === "Monument" &&
            service?.ServiceMainType === "Guest"
        );
        return guideServices.length === 0;
      });
    // console.log("All days empty:",allDaysEmpty);

    if (!allDaysEmpty) return;

    if (
      checkBoxes?.includes("monument") &&
      monumentFromValue.length > 0 &&
      monumentPackageList.length === monumentFromValue.length &&
      !isPackageLoaded &&
      monumentPackageList.every((arr) => Array.isArray(arr))
    ) {
      monumentFromValue.forEach((_, index) => {
        setFirstValueIntoForm(index);
      });
      setIsPackageLoaded(true);
    }

    // Keep this to prevent re-runs after initial load
  }, [
    checkBoxes,
    monumentFromValue?.map((row) => row.Destination).join(","),
    monumentPackageList,
    // supplierList,
    qoutationData,
    isPackageLoaded,
    originalFromValue,
    monumentDataLoad,
  ]);

  // Reset processedIndices when necessary (e.g., when qoutationData changes)
  // useEffect(() => {
  //   processedIndices.current.clear();
  //   setIsPackageLoaded(false); // Reset to allow re-processing
  // }, [qoutationData]); // Adjust trigger based on when you need to reset

  const postDataToServer = async () => {
    try {
      setIsDataLoading(true);
      try {
        try {
          const { data } = await axiosOther.post("destinationlist");
          setDestinationList(data?.DataList);
        } catch (error) {
          console.log("error", error);
        }
      } catch (error) {
        console.log(error);
      }
      // Mrakupvalue
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
        // console.log(value, "value222");
      } catch (error) {
        console.error(error);
      }
    } finally {
      setIsDataLoading(false);
    }
  };

  const getSupplierList = async (index, id) => {
    try {
      const { data } = await axiosOther.post("supplierlist", {
        Name: "",
        id: "",
        SupplierService: [5],
        DestinationId: [id],
      });
      setSupplierList((prevArr) => {
        const newArr = [...prevArr];
        newArr[index] = data?.DataList;
        return newArr;
      });
      setMonumentFormValue((prevArr) => {
        const newArr = [...prevArr];
        newArr[index] = {
          ...newArr[index],
          SupplierId: data?.DataList?.[0]?.id,
        };
        return newArr;
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    if (!monumentDataLoad) return;
    monumentFromValue?.forEach((item, index) => {
      if (item?.Destination != "") {
        getSupplierList(index, item?.Destination);
      }
    });
  }, [
    monumentFromValue?.map((item) => item?.Destination)?.join(","),
    monumentDataLoad,
  ]);

  // monument package dependently

  // filtering monument on the base of monument package list
  const filterMonumentPackageList = (packageId, index) => {
    // console.log("this function calls");

    // console.log(packageId,index,"checkpackage");

    const filteredMonument = monumentPackageList[index]?.filter(
      (pckg) => pckg?.id == packageId
    );
    // console.log(filteredMonument, "filteredMonument");

    // console.log(packageId, index,"checkpackage");

    const newDayType = filteredMonument?.[0]?.DayType || "";
    const monuments = filteredMonument?.[0]?.MultipleMonument || [];
    // console.log(monuments,"monuments");

    // ✅ Normalize all RateJson into flat array form
    const normalizedMonuments = monuments.map((monument) => {
      let normalizedRateJson = [];
      // console.log(normalizedRateJson,"normalizedRateJson");

      if (Array.isArray(monument.RateJson)) {
        normalizedRateJson = monument.RateJson;
      } else if (monument?.RateJson?.Data?.[0]?.RateDetails) {
        normalizedRateJson = monument.RateJson.Data[0].RateDetails;
      }

      return {
        ...monument,
        RateJson: normalizedRateJson,
      };
    });
    // console.log(normalizedMonuments,"normalizedMonuments");

    // ✅ Calculate total foreigner adult fee
    const totalAdultFee = normalizedMonuments.reduce((sum, monument) => {
      const rate = monument?.RateJson?.[0]?.ForeignerAdultEntFee;
      const fee = parseFloat(rate);
      return sum + (isNaN(fee) ? 0 : fee);
    }, 0);

    // ✅ Calculate total Indian adult fee
    const totalChildFee = normalizedMonuments.reduce((sum, monument) => {
      const rate = monument?.RateJson?.[0]?.IndianAdultEntFee;
      const fee = parseFloat(rate);
      return sum + (isNaN(fee) ? 0 : fee);
    }, 0);

    // ✅ Set Day Type

    const initialFormValue = qoutationData?.Days?.map((day) => {
      const service = day?.DayServices?.filter(
        (service) => service?.ServiceType == "Monument"
      )[0];

      setMonumentFormValue((prevArr) => {
        const newArr = [...prevArr];
        const currentItem = prevArr[index];

        if (currentItem?.ServiceId && currentItem.ServiceId === packageId) {
          newArr[index] = {
            ...currentItem,
            MonumentDayType:
              newDayType || monumentFromValue[index]?.MonumentDayType || "",
            DayType: newDayType || " ",
            ItemUnitCost: {
              FAdult:
                totalAdultFee ||
                monumentFromValue[index]?.ItemUnitCost?.FAdult ||
                "",
              Adult:
                totalChildFee ||
                monumentFromValue[index]?.ItemUnitCost?.Adult ||
                "",
            },
          };
        }

        return newArr;
      });
      setOriginalFormValue((prevArr) => {
        const newArr = [...prevArr];
        const currentItem = prevArr[index];
        // console.log(currentItem,"currentItem");

        if (currentItem?.ServiceId && currentItem.ServiceId === packageId) {
          newArr[index] = {
            ...currentItem,
            MonumentDayType:
              newDayType || monumentFromValue[index]?.MonumentDayType || "",
            DayType: newDayType || " ",
            ItemUnitCost: {
              FAdult:
                totalAdultFee ||
                monumentFromValue[index]?.ItemUnitCost?.FAdult ||
                "",
              Adult:
                totalChildFee ||
                monumentFromValue[index]?.ItemUnitCost?.Adult ||
                "",
            },
          };
        }

        return newArr;
      });
    });

    //  console.log(monumentFromValue, "monumentFromValue11");

    setDayType((prevData) => {
      const newData = [...prevData];

      if (monumentFromValue[index]?.ServiceId) {
        newData[index] =
          newDayType || monumentFromValue[index]?.MonumentDayType;
      }

      return newData;
    });

    // console.log(monumentFromValue, "checkmonudd");

    // ✅ Set MultipleMonument state with normalized monuments
    setMultipleMonument((prevList) => {
      const newList = [...prevList];

      if (monumentFromValue[index]?.ServiceId === packageId) {
        // filter only those with RateJson
        // console.log(normalizedMonuments, "normalizedMonuments");

        const monumentsWithRates = normalizedMonuments
          .filter((monument) => Array.isArray(monument.RateJson))
          .map((monument) => ({
            ...monument,
            RateJson: monument.RateJson[0],
          }));

        // console.log(monumentsWithRates, "monumentsWithRates");

        newList[index] =
          monumentsWithRates.length > 0
            ? monumentsWithRates
            : multipleMonument[index] || [];
      } else {
        // condition false → set empty array
        newList[index] = [];
      }

      return newList;
    });

    // console.log(monumentFromValue[index]?.ServiceId, packageId, "packageId2");
    // console.log(filteredMonument, "checkkk");
  };

  useEffect(() => {
    // if (isInitializing) return;
    monumentFromValue.forEach((row, index) => {
      if (row.ServiceId && row.ServiceId !== prevServiceIds.current[index]) {
        filterMonumentPackageList(row.ServiceId, index);
      }
    });

    // update prev values
    prevServiceIds.current = monumentFromValue.map((row) => row.ServiceId);
    // console.log(prevServiceIds.current,"prevServiceIdscurrent");
  }, [monumentFromValue]);
  // dispatching day type to redux store
  useEffect(() => {
    dispatch(storeMonumentDayType(dayType));
  }, [dayType]);
  // console.log(dayType,"storeMonumentDayType")

  const removeMonument = (monumentInd, index) => {
    const filteredMonument = multipleMonument[index]?.filter(
      (value, ind) => ind !== monumentInd
    );

    //Calculate new ItemUnitCost from remaining monuments
    const newItemUnitCost = {
      Adult: filteredMonument.reduce(
        (sum, m) => sum + parseFloat(m?.RateJson?.IndianAdultEntFee ?? 0),
        0
      ),
      Child: filteredMonument.reduce(
        (sum, m) => sum + parseFloat(m?.RateJson?.IndianChildEntFee ?? 0),
        0
      ),
      FAdult: filteredMonument.reduce(
        (sum, m) => sum + parseFloat(m?.RateJson?.ForeignerAdultEntFee ?? 0),
        0
      ),
      FChild: filteredMonument.reduce(
        (sum, m) => sum + parseFloat(m?.RateJson?.ForeignerChildEntFee ?? 0),
        0
      ),
    };

    // Update multipleMonument state
    setMultipleMonument((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = filteredMonument;
      return newArr;
    });

    // Update monumentFormValue for that row with new ItemUnitCost
    setMonumentFormValue((prevArr) => {
      const newArr = [...prevArr];
      if (newArr[index]) {
        newArr[index] = {
          ...newArr[index],
          ItemUnitCost: newItemUnitCost,
        };
      }
      return newArr;
    });
  };

  const handleMonumentFormChange = (ind, e) => {
    const { name, value, checked } = e.target;
    // console.log(name, value,"check11")
    if (name === "Destination") {
      // Clear multipleMonument for this index when destination changes
      setMultipleMonument((prevArr) => {
        const newArr = [...prevArr];
        newArr[ind] = []; // Reset the monument list for this day
        return newArr;
      });

      setDayType((prevArr) => {
        const newArr = [...prevArr];
        newArr[ind] = ""; // or newArr[ind] = "" if you prefer an empty string
        return newArr;
      });

      // Update monumentFormValue and originalFormValue
      setMonumentFormValue((prevArr) => {
        const newArr = [...prevArr];
        newArr[ind] = {
          ...newArr[ind],
          [name]: value,
          ServiceId: "", // Optionally reset ServiceId as well
          ItemUnitCost: {
            Adult: "",
            Child: "",
            FAdult: "",
            FChild: "",
          }, // Reset costs since monuments are cleared
        };
        return newArr;
      });

      setOriginalFormValue((prevArr) => {
        const newArr = [...prevArr];
        newArr[ind] = {
          ...newArr[ind],
          [name]: value,
          ServiceId: "", // Optionally reset ServiceId as well
          ItemUnitCost: {
            Adult: "",
            Child: "",
            FAdult: "",
            FChild: "",
          }, // Reset costs since monuments are cleared
        };
        return newArr;
      });

      // Optionally reset other related states
      setMonumentPackageList((prevList) => {
        const newList = [...prevList];
        newList[ind] = []; // Clear monument package list for this index
        return newList;
      });

      // setSupplierList((prevList) => {
      //   const newList = [...prevList];
      //   newList[ind] = []; // Clear supplier list for this index
      //   return newList;
      // });

      // Fetch new monument package list for the new destination
      if (value) {
        getMonumentPackageListDependently(value, ind);
      }
    }

    if (name != "Leasure") {
      if (name.includes(".")) {
        const [parentKey, childKey] = name.split(".");
        setMonumentFormValue((prevArr) => {
          const newArr = [...prevArr];
          newArr[ind] = {
            ...newArr[ind],
            [parentKey]: { ...newArr[ind][parentKey], [childKey]: value },
          };
          return newArr;
        });
        setOriginalFormValue((prevArr) => {
          const newArr = [...prevArr];
          newArr[ind] = {
            ...newArr[ind],
            [parentKey]: { ...newArr[ind][parentKey], [childKey]: value },
          };
          return newArr;
        });
      } else {
        setMonumentFormValue((prevArr) => {
          const newArr = [...prevArr];
          newArr[ind] = { ...newArr[ind], [name]: value };
          return newArr;
        });
        setOriginalFormValue((prevArr) => {
          const newArr = [...prevArr];
          newArr[ind] = { ...newArr[ind], [name]: value };
          return newArr;
        });
      }
    } else {
      setMonumentFormValue((prevArr) => {
        const newArr = [...prevArr];
        newArr[ind] = { ...newArr[ind], Leasure: checked ? "Yes" : "No" };
        return newArr;
      });
    }
  };

  const handleHotelTableIncrement = (index) => {
    const indexHotel = monumentFromValue[index];
    const indexMonument = multipleMonument[index];

    setMonumentFormValue((prevArr) => {
      const newArr = [...prevArr];
      newArr.splice(index + 1, 0, { ...indexHotel, isCopied: true });
      return newArr;
    });
    setMultipleMonument((prevArr) => {
      const newArr = [...prevArr];

      // normalize to array
      let target = newArr[index + 1];
      if (!Array.isArray(target)) {
        target = Object.values(target || {});
      }

      // replace element at index+1 with merged array
      newArr.splice(index + 1, 0, [...indexMonument]);

      return newArr;
    });

    setOriginalFormValue((prevArr) => {
      const newArr = [...prevArr];
      newArr.splice(index + 1, 0, { ...indexHotel, isCopied: true });
      return newArr;
    });
  };

  const handleHotelTableDecrement = (index) => {
    const filteredTable = monumentFromValue?.filter(
      (item, ind) => ind != index
    );
    const filteredmonumentTable = multipleMonument?.filter(
      (item, ind) => ind != index
    );
    setMonumentFormValue(filteredTable);
    setOriginalFormValue(filteredTable);
    setMultipleMonument(filteredmonumentTable);
  };
  // console.log(multipleMonument,"multipleMonument");
  useEffect(() => {
    dispatch(resetFinalMonumentFormValue());
  }, []);
  const generateFinalJson = () => {
    // if (!monumentDataLoad) {
    //   dispatch(resetFinalMonumentFormValue());
    //   return [];
    // }

    const finalMonumentNested = monumentFromValue?.map((_, parentIndex) => {
      if (!multipleMonument?.[parentIndex]?.length) return [];
      return multipleMonument[parentIndex]
        .map((monument) => {
          let rate = {};
          if (Array.isArray(monument?.RateJson)) {
            rate = monument.RateJson[0] || {};
          } else if (monument?.RateJson?.Data?.[0]?.RateDetails) {
            rate = monument.RateJson.Data[0].RateDetails[0] || {};
          }
          return {
            MonumentId: monument?.id || "",
            MonumentName: monument?.name || "Unknown",
            IAdultPrice: mathRoundHelper(rate?.IndianAdultEntFee) || "0",
            FAdultPrice: mathRoundHelper(rate?.ForeignerAdultEntFee) || "0",
          };
        })
        .filter((monument) => monument.MonumentId !== "");
    });

    const totalAdultServiceCost = monumentFromValue?.reduce((total, item) => {
      const adultCost = mathRoundHelper(item.ItemUnitCost?.FAdult) || 0;
      return total + adultCost;
    }, 0);

    const json = monumentFromValue
      ?.map((row, index) => {
        return {
          ...row,
          Hike: hikePercent,
          ServiceIdMonument: finalMonumentNested[index] || [],
          DayType: Type,
          Include: isIncludeMonument,
          Sector: fromToDestinationList[index],
          TotalCosting: {
            ServiceAdultCost: mathRoundHelper(
              monumentRateCalculate?.Price?.FAdult
            ),
            ServiceChildCost: mathRoundHelper(
              monumentRateCalculate?.Price?.Child
            ),
            AdultMarkupValue: mathRoundHelper(MonumentData?.Value),
            ChildMarkupValue: mathRoundHelper(MonumentData?.Value),
            AdultMarkupTotal: mathRoundHelper(
              monumentRateCalculate?.Markup?.Adult
            ),
            ChildMarkupTotal: mathRoundHelper(
              monumentRateCalculate?.Markup?.Adult
            ),
            TotalAdultServiceCost: mathRoundHelper(
              (totalAdultServiceCost || 0) +
              ((totalAdultServiceCost || 0) * (MonumentData?.Value ?? 0)) /
              100
            ),
            TotalChildServiceCost: mathRoundHelper(
              monumentRateCalculate?.Price?.Child +
              monumentRateCalculate?.Markup?.Child
            ),
          },
        };
      })
      .filter((services) => services?.MonumentDayType != "None");

    return json;
  };

  // useEffect to automatically generate finalJson when dependencies change
  useEffect(() => {
    if (
      !isInitializing &&
      // monumentDataLoad &&
      monumentFromValue?.length > 0 &&
      multipleMonument?.length > 0
    ) {
      const json = generateFinalJson();
      dispatch(setFinalMonumentFormValue(json)); // Store finalJson in monumentFormData state
    }
  }, [
    monumentFromValue,
    multipleMonument,
    hikePercent,
    isIncludeMonument,
    fromToDestinationList,
    monumentRateCalculate,
    MonumentData?.Value,
    // monumentDataLoad,
  ]);
  // console.log(multipleMonument, "multipleMonument");

  const handleFinalSave = async () => {
    const finalMonumentNested =
      monumentFromValue?.map((_, parentIndex) => {
        if (!multipleMonument?.[parentIndex]?.length) return [];

        return multipleMonument[parentIndex]
          .map((monument) => {
            let rate = {};
            if (Array.isArray(monument?.RateJson)) {
              rate = monument.RateJson[0] || {};
            } else if (monument?.RateJson?.Data?.[0]?.RateDetails) {
              rate = monument.RateJson.Data[0].RateDetails[0] || {};
            }
            // console.log(monument, "rate?.ForeignerAdultEntFee)");

            return {
              MonumentId: monument?.id || "",
              MonumentName: monument?.name || "Unknown",
              IAdultPrice:
                mathRoundHelper(rate?.IndianAdultEntFee) ||
                monument.RateJson?.IndianAdultEntFee ||
                "0",
              FAdultPrice:
                mathRoundHelper(rate?.ForeignerAdultEntFee) ||
                monument.RateJson?.ForeignerAdultEntFee ||
                "0",
            };
          })
          .filter((monument) => monument.MonumentId !== "");
      }) || [];
    // console.log(finalMonument,"finalMonument");
    const totalAdultServiceCost = monumentFromValue?.reduce((total, item) => {
      const adultCost = mathRoundHelper(item.ItemUnitCost?.FAdult) || 0;

      return total + adultCost;
    }, 0);
    // console.log(finalMonumentNested, "finalMonumentNested");

    const finalJson = monumentFromValue
      ?.map((row, index) => {
        return {
          ...row,
          Hike: hikePercent,
          ServiceIdMonument: finalMonumentNested[index] || [],
          DayType: Type,
          Include: isIncludeMonument,
          Sector: fromToDestinationList[index],
          TotalCosting: {
            ServiceAdultCost: mathRoundHelper(
              monumentRateCalculate?.Price?.FAdult
            ),
            ServiceChildCost: mathRoundHelper(
              monumentRateCalculate?.Price?.Child
            ),
            AdultMarkupValue: mathRoundHelper(MonumentData?.Value), // Chnahe markup value
            ChildMarkupValue: mathRoundHelper(MonumentData?.Value), // Chnahe markup value
            AdultMarkupTotal: mathRoundHelper(
              monumentRateCalculate?.Markup?.Adult
            ),
            ChildMarkupTotal: mathRoundHelper(
              monumentRateCalculate?.Markup?.Adult
            ),
            TotalAdultServiceCost: mathRoundHelper(
              (totalAdultServiceCost || 0) +
              ((totalAdultServiceCost || 0) * (MonumentData?.Value ?? 0)) /
              100
            ),
            TotalChildServiceCost: mathRoundHelper(
              monumentRateCalculate?.Price?.Child +
              monumentRateCalculate?.Markup?.Child
            ),
          },
        };
      })
      .filter((services) => services?.MonumentDayType != "None");

    const totalMonumentAmount = monumentFromValue?.reduce((total, item) => {
      const adultCost = mathRoundHelper(item.ItemUnitCost?.Adult) || 0;
      const childCost = mathRoundHelper(item.ItemUnitCost?.Child) || 0;

      return total + adultCost + childCost;
    }, 0);

    try {
      const { data } = await axiosOther.post(
        "update-quotation-monument",
        finalJson
      );

      if (data?.status == 1) {
        // notifySuccess("Services Added !");
        notifyHotSuccess(data?.message);
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
  };

  const monumentMasterListApit = async (destination) => {
    const { data } = await axiosOther.post("monumentmasterlist", {
      MonumentName: "",
      Destination: destination,
      id: "",
      Default: "",
    });
    // console.log(data?.DataList, "data?.DataList2222");

    setMonumentMasterList(data?.DataList);
  };

  useEffect(() => {
    const costArr = monumentFromValue?.map((mon) => {
      if (guide?.ServiceId !== "") {
        let arr = [mon?.ItemUnitCost?.Adult, mon?.ItemUnitCost?.Child];

        arr = arr.map((value, index) => {
          if (
            value === null ||
            value === undefined ||
            value === "" ||
            isNaN(value)
          ) {
            arr[index] = 0;
          }
          if (typeof value === "string" && !isNaN(value)) {
            arr[index] = parseFloat(value);
          }
          return arr[index];
        });

        const rate = arr.reduce((acc, curr) => acc + curr, 0);
        return rate;
      } else {
        return 0;
      }
    });
  }, [
    monumentFromValue
      ?.map((mon) => mon?.ItemUnitCost?.Adult + mon?.ItemUnitCost?.Child)
      ?.join(","),
    monumentFromValue?.map((item) => item?.ServiceId).join(","),
  ]);

  useEffect(() => {
    if (!monumentDataLoad) return;
    postDataToServer();
    // monumentMasterListApit("DEST01928");
    monumentMasterListApit();
  }, [monumentDataLoad]);
  // console.log(monumentDataLoad,"monumentDataLoadcheck");

  const mergeMonumentRate = (index) => {
    const rate = rateList[index];
    // console.log(rate,"ratelistt")
    const form = monumentFromValue[index];

    if (rate && rate.length > 0) {
      const item = rate[0]?.RateJson;
      setMonumentFormValue((prevMon) => {
        const newMon = [...prevMon];
        newMon[index] = {
          ...newMon[index],
          ItemUnitCost: {
            Adult: item?.AdultEntFee || 0,
            Child: item?.ChildEntFee || 0,
            FAdult: item?.AdultEntFee || 0,
            FChild: item?.ChildEntFee || 0,
          },
        };
        return newMon;
      });
    } else {
      setMonumentFormValue((prevMon) => {
        const newMon = [...prevMon];
        newMon[index] = {
          ...newMon[index],
          ItemUnitCost: {
            Adult: 0,
            Child: 0,
            FAdult: 0,
            FChild: 0,
          },
        };
        return newMon;
      });
    }
  };

  useEffect(() => {
    monumentFromValue?.forEach((form, index) => {
      if (form?.ServiceId && rateList[index]) {
        mergeMonumentRate(index);
      }
    });
  }, [
    rateList,
    monumentFromValue?.map((monument) => monument?.ServiceId).join(","),
  ]);
  // storing monument form into redux store
  useEffect(() => {
    if (Type == "Main") {
      dispatch(setItineraryMonumentData(monumentFromValue));
    } else {
      dispatch(setLocalItineraryMonumentData(monumentFromValue));
    }
    // else if(Type == "Foreign"){
    //   dispatch()
    // }
  }, [monumentFromValue]);

  useEffect(() => {
    if (Type == "Main") {
      dispatch(setLocalMonumentFormValue(monumentFromValue));
    } else {
      setMonumentFormValue(localMonumentValue);
    }
  }, [monumentFromValue]);

  // getting rate data form api
  // console.log(monumentFromValue,"monumentFromValue");

  const getMonumentRateApi = async (destination, index, date, srvcId) => {
    const monumentUID =
      monumentPackageList[index] != undefined
        ? monumentPackageList[index]?.find((pckg) => pckg?.id == srvcId)
        : "";
    // console.log(monumentUID,"monumentPackageList");

    try {
      const { data } = await axiosOther.post("monumentsearchlist", {
        id: "",
        MonumentUID: monumentUID?.UniqueID,
        Destination: destination,
        CompanyId: tokenData?.CompanyUniqueId,
        Date: "",
        ValidFrom: qoutationData?.TourSummary?.FromDate,
        ValidTo: qoutationData?.TourSummary?.FromDate,
        QueryId: queryData?.QueryId,
        QuatationNo: qoutationData?.QuotationNumber,
        Year: headerDropdown?.Year,
      });

      setRateList((prevArr) => {
        const newArr = [...prevArr];
        newArr[index] = data?.Data;
        return newArr;
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    if (!monumentDataLoad) return;
    monumentFromValue?.forEach((form, index) => {
      // console.log(form,"indexformcheck");

      getMonumentRateApi(
        form?.DestinationUniqueId,
        index,
        form?.Date,
        form?.ServiceId
      );
    });
  }, [
    monumentFromValue?.map((form) => form?.Destination)?.join(","),
    monumentFromValue?.map((form) => form?.ServiceId)?.join(","),
    monumentDataLoad,
  ]);

  // toggle of default value in form
  useEffect(() => {
    if (!checkBoxes?.includes("monument")) {
      formValueInitialization();
    }
  }, [checkBoxes]);

  const addTempMonument = () => {
    if (!isEditingMonument?.editing && tempMonument?.id != "") {
      const checkIsExist = changeMonument.monument?.some(
        (mon) => mon?.id == tempMonument?.id
      );
      if (!checkIsExist) {
        setChangeMonument({
          ...changeMonument,
          monument: [
            ...changeMonument.monument,
            { id: tempMonument?.id, name: tempMonument?.name },
          ],
        });
        setTempMonument({ id: "", name: "" });
        setIsEditingMonument({ index: "", editing: false });
      }
    }
  };

  const checkDeleteMonument = (item, index) => {
    const filteredMonument = changeMonument.monument.filter(
      (item, ind) => ind != index
    );

    setChangeMonument({ ...changeMonument, monument: filteredMonument });
  };

  const monumentFinalSave = () => {
    if (
      Array.isArray(changeMonument.monument) &&
      typeof changeMonument.index === "number"
    ) {
      const newMonArr = [...multipleMonument];

      // Save all selected monuments (with complete data) at the specified index
      newMonArr[changeMonument.index] = changeMonument.monument.map((mon) => ({
        id: mon.id,
        name: mon.name,
        RateJson: mon.RateJson || [], // Keep this if needed in future
      }));
      // console.log(changeMonument,"changeMonumentchangeMonument");

      setMultipleMonument(newMonArr);
      setIsFormValue(true);
    }

    // Reset modal and temp data
    setTempMonument({ id: "", name: "" });
    setModalCentered(false);
  };

  const handleTempMonumentChange = (e) => {
    const { value } = e.target;
    const filteredMonument = monumentMasterList?.find(
      (mon) => mon?.id == value
    );

    setTempMonument({
      id: filteredMonument?.id,
      name: filteredMonument?.MonumentName,
    });
  };

  const handlePaxChange = (index, e) => {
    const { name, value } = e.target;
    setPaxFormValue({ ...paxFormValue, [name]: value });
  };

  const handlePaxModalClick = (index) => {
    setPaxModal({ modalIndex: index, isShow: true });

    const form = monumentFromValue?.filter((form, ind) => ind == index)[0];
    setPaxFormValue({
      Adults: form?.PaxInfo?.Adults,
      Child: form?.PaxInfo?.Child,
      Infant: form?.PaxInfo?.Infant,
    });
  };

  const handlePaxSave = () => {
    setMonumentFormValue((prevForm) => {
      const newForm = [...prevForm];
      newForm[paxModal?.modalIndex] = {
        ...newForm[paxModal?.modalIndex],
        PaxInfo: paxFormValue,
      };
      return newForm;
    });
    setOriginalFormValue((prevForm) => {
      const newForm = [...prevForm];
      newForm[paxModal?.modalIndex] = {
        ...newForm[paxModal?.modalIndex],
        PaxInfo: paxFormValue,
      };
      return newForm;
    });

    setPaxModal({ modalIndex: "", isShow: false });
  };

  const handleHikeChange = (e) => {
    const { value } = e.target;
    const hikePercentValue = parseFloat(value) || 0;

    // Only update hike percent state
    setHikePercent(value);

    // Update form values by mapping over current values, not replacing them entirely
    setMonumentFormValue((prevFormValue) => {
      return prevFormValue.map((item, index) => {
        // Get the corresponding original item
        const originalItem = originalFromValue[index];
        if (!originalItem) return item;
        // console.log(originalFromValue[index],"originalFromValue[index]");

        const originalFAdult =
          parseFloat(originalItem?.ItemUnitCost?.FAdult) || 0;
        const originalAdult =
          parseFloat(originalItem?.ItemUnitCost?.Adult) || 0;
        const originalChild =
          parseFloat(originalItem?.ItemUnitCost?.Child) || 0;
        const originalFChild =
          parseFloat(originalItem?.ItemUnitCost?.FChild) || 0;

        return {
          ...item, // ✅ Keep all existing properties
          Hike: hikePercentValue,
          ItemUnitCost: {
            ...item.ItemUnitCost,
            FAdult:
              originalFAdult > 0
                ? Math.floor(
                  originalFAdult + (originalFAdult * hikePercentValue) / 100
                )
                : originalFAdult,
            Adult:
              originalAdult > 0
                ? Math.floor(
                  originalAdult + (originalAdult * hikePercentValue) / 100
                )
                : originalAdult,
            Child:
              originalChild > 0
                ? Math.floor(
                  originalChild + (originalChild * hikePercentValue) / 100
                )
                : originalChild,
            FChild:
              originalFChild > 0
                ? Math.floor(
                  originalFChild + (originalFChild * hikePercentValue) / 100
                )
                : originalFChild,
          },
        };
      });
    });
  };

  // calculate all sum value
  useEffect(() => {
    const calculateTotalCosts = (data) => {
      let totalAdultCost = 0;
      let totalFAdultCost = 0;
      let totalChildCost = 0;
      let totalFChildCost = 0;

      data.forEach((item) => {
        const adult = parseFloat(item.ItemUnitCost.Adult) || 0;
        const Fadult = parseFloat(item.ItemUnitCost.FAdult) || 0;
        const child = parseFloat(item.ItemUnitCost.Child) || 0;
        const Fchild = parseFloat(item.ItemUnitCost.FChild) || 0;

        totalAdultCost += adult;
        totalFAdultCost += Fadult;
        totalChildCost += child;
        totalFChildCost += Fchild;
      });

      return {
        totalAdultCost,
        totalFAdultCost,
        totalChildCost,
        totalFChildCost,
      };
    };

    const filteredMonumentValue = monumentFromValue?.filter(
      (form) => form?.ServiceId != ""
    );

    const { totalAdultCost, totalFAdultCost, totalChildCost, totalFChildCost } =
      calculateTotalCosts(filteredMonumentValue);

    // Ensure MonumentData?.Value is a valid number, fallback to 0
    const markupValue = parseFloat(MonumentData?.Value) || 0;

    let totalPriceForPax =
      totalAdultCost +
      totalFAdultCost +
      totalChildCost +
      totalFChildCost +
      ((totalAdultCost + totalFAdultCost + totalChildCost + totalFChildCost) *
        markupValue) /
      100; // change markup value

    dispatch(setMonumentPrice(totalPriceForPax));
    dispatch(setTogglePriceState());

    setMonumentRateCalculate((prevData) => ({
      ...prevData,
      Price: {
        Adult: totalAdultCost,
        FAdult: totalFAdultCost,
        Child: totalChildCost,
        FChild: totalFChildCost,
      },
      MarkupOfCost: {
        Adult: parseInt(totalAdultCost * MonumentData?.Value) / 100 || 0, // change markupvalue dynamic
        FAdult: parseInt(totalFAdultCost * MonumentData?.Value) / 100 || 0, // change markupvalue dynamic
        Child: parseInt(totalChildCost * MonumentData?.Value) / 100 || 0, // change markupvalue dynamic
        FChild: parseInt(totalFChildCost * MonumentData?.Value) / 100 || 0, // change markupvalue dynamic
      },
    }));
  }, [
    monumentFromValue?.map((item) => item?.ItemUnitCost?.Adult).join(","),
    monumentFromValue?.map((item) => item?.ItemUnitCost?.FAdult).join(","),
    monumentFromValue?.map((item) => item?.ItemUnitCost?.FChild).join(","),
    monumentFromValue?.map((item) => item?.ItemUnitCost?.Child).join(","),
    monumentFromValue?.map((item) => item?.ServiceId).join(","),
    hikePercent,
    MonumentData?.Value, // Add dependency to react to markup changes
  ]);

  useEffect(() => {
    const destinations = monumentFromValue?.map((hotel, index, hotelArr) => {
      return {
        From: hotel?.Destination,
        To: hotelArr[index + 1]?.Destination,
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
    monumentFromValue?.map((hotel) => hotel?.Destination).join(","),
    destinationList,
  ]);

  // ===================================================

  // copying state will be false on initial render
  useEffect(() => {
    if (Type !== "Main" && isCopyHotel) {
      setMonumentFormValue(monumentFormData);
    }
  }, []);

  const handleHotelCopy = (e) => {
    const { checked } = e.target;
    if (checked) {
      setIsCopyHotel(true);
      setMonumentFormValue(monumentFromValue);
    } else {
      setIsCopyHotel(false);
      setMonumentFormValue(localMonumentValue);
    }
  };

  // const tokenData = JSON.parse(localStorage.getItem("token"));
  // const [changeMonumentData, setChangeMonumentData] = useState([]);
  // const [changeMonuments, setChangeMonuments] = useState({ monument: [] });

  const getTotalIndianFee = (index) => {
    if (!Array.isArray(multipleMonument[index])) {
      return 0;
    }

    return multipleMonument[index].reduce((total, curr) => {
      // Get full monument data from either changeMonument or master list
      const fullMonument =
        changeMonument.monument?.find((m) => m.id === curr.id) ||
        monumentMasterList.find((m) => m.id === curr.id) ||
        curr;

      const rateJson = fullMonument?.RateJson;

      // Handle both array and object RateJson formats
      let fee = 0;

      if (Array.isArray(rateJson) && rateJson.length > 0) {
        fee = rateJson[0]?.IndianAdultEntFee;
      } else if (rateJson && typeof rateJson === "object") {
        fee = rateJson?.IndianAdultEntFee;
      }

      const numericFee = parseFloat(fee) || 0;
      const hikeAmount = numericFee * (hikePercent / 100);

      // Optional debug log
      // console.log(
      //   `Monument ID: ${curr.id}, Name: ${fullMonument?.name || "Not Found"}, Fee: ${fee}, TotalWithHike: ${numericFee + hikeAmount}`
      // );

      return total + numericFee + hikeAmount;
    }, 0);
  };

  const getTotalforFee = (index) => {
    if (!Array.isArray(multipleMonument[index])) return 0;

    // console.log(multipleMonument[index], "multipleMonument[index]");

    return multipleMonument[index].reduce((total, curr) => {
      const fullMonument =
        changeMonument.monument?.find((m) => m.id === curr.id) ||
        monumentMasterList.find((m) => m.id === curr.id) ||
        curr;

      const rateJson = fullMonument?.RateJson;
      // console.log(rateJson, "rateJson112");

      // Handle both object and array structures for RateJson
      let fee = 0;

      if (Array.isArray(rateJson) && rateJson.length > 0) {
        fee = rateJson[0]?.ForeignerAdultEntFee;
      } else if (rateJson && typeof rateJson === "object") {
        fee = rateJson?.ForeignerAdultEntFee;
      }

      const numericFee = parseFloat(fee) || 0;
      const hikeAmount = numericFee * (hikePercent / 100);

      // Optional: Debug logging
      // console.log(
      //   `Monument ID: ${curr.id} | Raw Fee: ${fee} | With Hike: ${numericFee + hikeAmount}`
      // );

      return total + numericFee + hikeAmount;
    }, 0);
  };

  // const getTotalforFee = (index) => {
  //   if (!Array.isArray(multipleMonument[index])) return 0;

  //   const totalFee = multipleMonument[index].reduce((total, curr) => {
  //     const fullMonument = monumentMasterList.find((m) => m.id === curr.id);
  //     const fee =
  //       fullMonument?.RateJson?.Data?.[0]?.RateDetails?.[0]?.ForeignerAdultEntFee;
  //     return total + (parseFloat(fee) || 0);
  //   }, 0);

  //   console.log("totalllFeeeee",totalFee)
  // };
  // console.log(changeMonument, "changeMonument");

  useEffect(() => {
    if (isFormValue && activeIndex !== null) {
      const copiedData = JSON.parse(JSON.stringify(monumentFromValue));

      copiedData[activeIndex].ItemUnitCost.FAdult = getTotalforFee(activeIndex);
      copiedData[activeIndex].ItemUnitCost.Adult =
        getTotalIndianFee(activeIndex);

      // console.log(copiedData,"updatedData");
      setMonumentFormValue(copiedData);
      setIsFormValue(false);
    }
  }, [isFormValue, activeIndex]);
  // console.log(activeIndex,"activeee")

  const handleIsOpen = () => {
    if (monumentDataLoadCount) {
      dispatch({
        type: "SET_MONUMENT_DATA_LOAD",
        payload: true,
      });
      setMonumentDataLoadCount(false);
    }

    setIsOpen(!isOpen);
  };

  useEffect(() => {
    return () => {
      dispatch({
        type: "SET_MONUMENT_DATA_LOAD",
        payload: false,
      });
    };
  }, []);

  // ============================

  const monumentCheckbox = useSelector(
    (state) => state.itineraryServiceCopyReducer.monumentCheckbox
  );

  useEffect(() => {
    if (monumentCheckbox) {
      dispatch(
        setItineraryCopyMonumentFormData({
          MonumentForm: monumentFromValue,
          MultipleMonument: multipleMonument,
        })
      );
    }
  }, [monumentFromValue, multipleMonument]);

  useEffect(() => {
    return () => {
      dispatch(setItineraryCopyMonumentFormDataCheckbox(true));
    };
  }, []);

  const handleIndianFeeChange = (e, monumentId) => {
    const parsed = parseFloat(e.target.value);
    const newValue = isNaN(parsed) ? "" : parsed.toString(); // Convert to string for consistency
    setChangeMonument((prev) => {
      const updatedMonuments = (prev.monument || []).map((m) => {
        if (m.id === monumentId) {
          let updatedRateJson = JSON.parse(JSON.stringify(m.RateJson || {}));
          // console.log(updatedRateJson, "updatedRateJson");
          // Update IndianAdultEntFee directly at the root level
          updatedRateJson = {
            ...updatedRateJson,
            IndianAdultEntFee: newValue,
          };
          // console.log(updatedRateJson, "updatedRateJson");
          return { ...m, RateJson: updatedRateJson };
        }
        return m;
      });
      return { ...prev, monument: updatedMonuments };
    });
  };

  const handleForeignFeeChange = (e, monumentId) => {
    const parsed = parseFloat(e.target.value);
    const newValue = isNaN(parsed) ? "" : parsed.toString(); // Convert to string for consistency
    setChangeMonument((prev) => {
      const updatedMonuments = (prev.monument || []).map((m) => {
        if (m.id === monumentId) {
          let updatedRateJson = JSON.parse(JSON.stringify(m.RateJson || {}));
          // console.log(updatedRateJson, "updatedRateJson");

          // Update ForeignerAdultEntFee directly at the root level
          updatedRateJson = {
            ...updatedRateJson,
            ForeignerAdultEntFee: newValue,
          };

          // console.log(updatedRateJson, "updatedRateJson");
          return { ...m, RateJson: updatedRateJson };
        }
        return m;
      });
      return { ...prev, monument: updatedMonuments };
    });
  };

  // Handle search input change
  const handleSearchMonumenNameChange = (e) => {
    setSearchMonumenName(e.target.value);
  };
  // Filter monuments based on search query
  const filteredMonuments = monumentMasterList?.filter((monument) =>
    monument.MonumentName?.toLowerCase().includes(
      searchMonumenName.toLowerCase()
    )
  );
  // console.log(filteredMonuments, "filteredMonuments");
  // console.log(changeMonument, "changeMonument022");

  return (
    <div className="row mt-3 m-0">
      <Toaster position="top-center" />
      <div
        className="col-12 px-1 py-2 d-flex justify-content-between itinerary-head-bg"
        onClick={handleIsOpen}
      >
        <div className="d-flex gap-4 align-items-center">
          <div className="d-flex gap-2">
            <img src={monumentIcon} alt="monumentIcon" />
            <label htmlFor="" className="fs-5">
              Monument
            </label>
          </div>
          {/* <div className="d-flex gap-4 align-items-center">
            {Type !== "Main" && (
              <div
                className="d-flex gap-1 form-check"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  className="form-check-input check-md"
                  id="copy-hotel"
                  value="extrabed"
                  checked={isCopyHotel}
                  onChange={handleHotelCopy}
                />
                <label className="fontSize11px m-0 ms-1 " htmlFor="copy-hotel">
                  Copy
                </label>
              </div>
            )}
          </div> */}
          <div
            className="form-check check-sm d-flex align-items-center justify-content-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="checkbox"
              className="form-check-input height-em-1 width-em-1"
              name="MonumentCost"
              value={"Yes"}
              id="auto_guide"
              checked={AutoGuideCheck}
              onChange={(e) => dispatch(monumentAutoGuideToggle())}
            />
            <label
              htmlFor="auto_guide"
              className="mt-1"
              style={{ fontSize: "0.8rem" }}
            >
              Auto Guide
            </label>
          </div>
        </div>

        <div
          className="d-flex gap-3 align-items-center"
          onClick={(e) => e.stopPropagation()}
        >
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
                min="0"
                className={`formControl3`}
                value={hikePercent}
                onChange={handleHikeChange}
              />
              <span className="fs-6">%</span>
            </div>
          )}
          <div className="form-check check-sm d-flex align-items-center justify-content-center gap-2">
            <input
              type="radio"
              className="form-check-input height-em-1 width-em-1"
              name="MonumentCost"
              value={"Foreign"}
              id="foreigner_cost"
              checked={checkMonumentPrice == "Foreign"}
              onChange={(e) => {
                e.stopPropagation();
                setCheckMonumentPrice(e.target.value);
              }}
            />
            <label
              htmlFor="foreigner_cost"
              className="mt-1"
              style={{ fontSize: "0.8rem" }}
            >
              Foreigner
            </label>
          </div>
          <div className="form-check check-sm d-flex align-items-center justify-content-center gap-2">
            <input
              type="radio"
              className="form-check-input height-em-1 width-em-1"
              name="MonumentCost"
              value={"Indian"}
              id="indian_cost"
              checked={checkMonumentPrice == "Indian"}
              onChange={(e) => {
                e.stopPropagation();
                setCheckMonumentPrice(e.target.value);
              }}
            />
            <label
              htmlFor="indian_cost"
              className="mt-1"
              style={{ fontSize: "0.8rem" }}
            >
              Indian
            </label>
          </div>
          <div className="form-check check-sm d-flex align-items-center justify-content-center gap-2">
            <input
              type="radio"
              className="form-check-input height-em-1 width-em-1"
              name="MonumentCost"
              value={"Both"}
              id="both_cost"
              checked={checkMonumentPrice == "Both"}
              onChange={(e) => {
                e.stopPropagation();
                setCheckMonumentPrice(e.target.value);
              }}
            />
            <label
              htmlFor="both_cost"
              className="mt-1"
              defaultChecked
              style={{ fontSize: "0.8rem" }}
            >
              Both
            </label>
          </div>
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
      <Modal
        className="fade bd-example-modal-sm"
        size="sm"
        show={paxModal?.isShow}
      >
        <Modal.Header>
          <Modal.Title>Add Pax</Modal.Title>
          <Button
            variant=""
            className="btn-close"
            onClick={() => setPaxModal({ modalIndex: "", isShow: false })}
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
                onChange={(e) => handlePaxChange(paxModal.modalIndex, e)}
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
                onChange={(e) => handlePaxChange(paxModal.modalIndex, e)}
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
                onChange={(e) => handlePaxChange(paxModal.modalIndex, e)}
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger light"
            onClick={() => setPaxModal({ modalIndex: "", isShow: false })}
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
      {isOpen &&
        (isDataLoading ? (
          <IsDataLoading />
        ) : (
          <>
            <div className="col-12 px-0 mt-2">
              <PerfectScrollbar>
                <table class="table table-bordered itinerary-table">
                  <thead>
                    <tr>
                      <th
                        rowSpan={3}
                        className="py-1 align-middle text-center days-width-9"
                      >
                        {monumentFromValue[0]?.Date ? "Day / Date" : "Day"}
                      </th>
                      {(Type == "Local" || Type == "Foreigner") && (
                        <th rowSpan={3} className="py-1 align-middle">
                          Escort
                        </th>
                      )}
                      <th rowSpan={3} className="py-1 align-middle">
                        Destination
                      </th>
                      <th rowSpan={3} className="py-1 align-middle">
                        Program
                      </th>
                      <th
                        rowSpan={3}
                        className="py-1 align-middle column-width-4"
                      >
                        Day Type
                      </th>
                      <th rowSpan={3} className="py-1 align-middle">
                        Time
                      </th>
                      <th
                        rowSpan={2}
                        className="py-1 align-middle column-width-4"
                      >
                        Leisure
                      </th>
                      <th rowSpan={3} className="py-1 align-middle">
                        Monuments Name
                      </th>
                      <th rowSpan={3} className="py-1 align-middle">
                        Supplier
                      </th>
                      <th colSpan={checkMonumentPrice == "Both" ? 4 : 2}>
                        <div className="form-check check-sm d-flex align-items-center justify-content-center gap-2">
                          <input
                            type="checkbox"
                            className="form-check-input height-em-1 width-em-1"
                            name="Breakfast"
                            value={"Yes"}
                            id="monument_include"
                            checked={isIncludeMonument == "Yes"}
                            onChange={(e) =>
                              setIsIncludeMonument(
                                e.target.checked == true ? "Yes" : "No"
                              )
                            }
                          />
                          <label
                            htmlFor="monument_include"
                            className="mt-1"
                            style={{ fontSize: "0.8rem" }}
                          >
                            Include
                          </label>
                        </div>
                      </th>
                    </tr>
                    <tr>
                      {(checkMonumentPrice == "Indian" ||
                        checkMonumentPrice == "Both") && (
                          <th colSpan={2} className="py-1 align-middle">
                            Indian Cost
                          </th>
                        )}
                      {(checkMonumentPrice == "Foreign" ||
                        checkMonumentPrice == "Both") && (
                          <th colSpan={2} className="py-1 align-middle">
                            Foreigner Cost
                          </th>
                        )}
                    </tr>
                    <tr>
                      <th>
                        <div className="form-check check-sm d-flex align-items-center justify-content-center w-100">
                          <input
                            type="checkbox"
                            className="form-check-input height-em-1 width-em-1"
                            name="Leasure"
                            value={"Yes"}
                            checked={monumentFromValue?.every(
                              (form) => form?.Leasure == "Yes"
                            )}
                            onChange={(e) => {
                              setMonumentFormValue((prevArr) => {
                                const newArr = [...prevArr];
                                return newArr.map((form) => {
                                  return {
                                    ...form,
                                    Leasure: e.target.checked ? "Yes" : "No",
                                  };
                                });
                              });
                            }}
                          />
                        </div>
                      </th>
                      {(checkMonumentPrice == "Indian" ||
                        checkMonumentPrice == "Both") && (
                          <>
                            <th className="py-1 align-middle">Adult</th>
                            <th className="py-1 align-middle">Child</th>
                          </>
                        )}
                      {(checkMonumentPrice == "Foreign" ||
                        checkMonumentPrice == "Both") && (
                          <>
                            <th className="py-1 align-middle">Adult</th>
                            <th className="py-1 align-middle">Child</th>
                          </>
                        )}
                    </tr>
                  </thead>
                  <tbody>
                    {monumentFromValue?.map((item, index) => {
                      return (
                        <tr key={index + 1}>
                          <td>
                            <div className="d-flex gap-1 justify-content-start align-items-center">
                              <div className="d-flex gap-1 align-items-center">
                                <div
                                  className="d-flex align-items-center pax-icon"
                                  onClick={() => handlePaxModalClick(index)}
                                >
                                  <i className="fa-solid fa-person"></i>
                                </div>
                                <span
                                  onClick={() =>
                                    handleHotelTableIncrement(index)
                                  }
                                >
                                  <i className="la la-plus border cursor-pointer bg-success text-white rounded-pill fontSize10px padding1px"></i>
                                </span>

                                <span
                                  onClick={() =>
                                    handleHotelTableDecrement(index)
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
                                  min="0"
                                  style={{ width: "30px" }}
                                  className={`formControl1`}
                                  value={monumentFromValue[index]?.Escort}
                                  onChange={(e) =>
                                    handleMonumentFormChange(index, e)
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
                                value={monumentFromValue[index]?.Destination}
                                onChange={(e) =>
                                  handleMonumentFormChange(index, e)
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
                            <div>
                              <select
                                name="ServiceId"
                                id=""
                                className="formControl1"
                                onChange={(e) => {
                                  handleMonumentFormChange(index, e);
                                  // Immediately filter the package when ServiceId changes
                                  filterMonumentPackageList(
                                    e.target.value,
                                    index
                                  );
                                }}
                                value={monumentFromValue[index]?.ServiceId}
                              >
                                <option value="0">Select</option>
                                {monumentPackageList[index]?.map(
                                  (pckg, pkgIndex) => (
                                    <option
                                      value={pckg?.id}
                                      key={pkgIndex + "k"}
                                    >
                                      {pckg?.PackageName}
                                    </option>
                                  )
                                )}
                              </select>
                            </div>
                          </td>
                          <td className="column-width-4">
                            <div className="column-width-4">
                              <span>
                                {monumentFromValue[index]?.MonumentDayType}
                                {/* {   console.log(monumentFromValue[index]?.MonumentDayType,"monu123")} */}
                              </span>
                            </div>
                          </td>
                          <td>
                            <div>
                              <select
                                name="MonumentTime"
                                id=""
                                className="formControl1"
                                value={monumentFromValue[index]?.MonumentTime}
                                onChange={(e) =>
                                  handleMonumentFormChange(index, e)
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
                          <td className="column-width-4">
                            <div className="form-check check-sm d-flex align-items-center justify-content-center w-100">
                              <input
                                type="checkbox"
                                className="form-check-input height-em-1 width-em-1"
                                name="Leasure"
                                value={"Yes"}
                                checked={
                                  monumentFromValue[index]?.Leasure == "Yes"
                                }
                                onChange={(e) =>
                                  handleMonumentFormChange(index, e)
                                }
                              />
                            </div>
                          </td>
                          <td className="position-relative">
                            <div className="d-flex justify-content-center gap-3 flex-wrap pe-3">
                              {multipleMonument[index]?.map(
                                (item, monumentIndex) => {
                                  return (
                                    <div
                                      className="p-1 border d-inline-block"
                                      key={monumentIndex + 1}
                                    >
                                      <span>{item?.name}</span>
                                      <span
                                        className=""
                                        onClick={() =>
                                          removeMonument(monumentIndex, index)
                                        }
                                      >
                                        <i className="fa-solid fa-circle-xmark ms-2 cursor-pointer text-primary"></i>
                                      </span>
                                    </div>
                                  );
                                }
                              )}
                              { }
                              {monumentFromValue[index]?.ServiceId != "" && (
                                <div
                                  className="d-flex align-items-center position-absolute"
                                  style={{ right: "0.4rem", top: "0.5rem" }}
                                >
                                  {/* {console.log(
                                    multipleMonument,
                                    "multipleMonument"
                                  )} */}

                                  <MdEdit
                                    className="fs-5 text-primary cursor-pointer"
                                    onClick={() => {
                                      setModalCentered(true),
                                        setChangeMonument({
                                          index: index,
                                          monument: multipleMonument[index],
                                          dayNo: monumentFromValue[index]?.DayNo,
                                          date: monumentFromValue[index]?.Date
                                          // rateJson:22,
                                        }),
                                        console.log(
                                          multipleMonument[index],
                                          "multipleMonument[index]"
                                        );

                                      monumentMasterListApit(item?.Destination);
                                      setActiveIndex(index);
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          </td>
                          <td>
                            <div>
                              <select
                                name="SupplierId"
                                id=""
                                className="formControl1"
                                value={monumentFromValue[index]?.SupplierId}
                                onChange={(e) =>
                                  handleMonumentFormChange(index, e)
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
                          {(checkMonumentPrice == "Indian" ||
                            checkMonumentPrice == "Both") && (
                              <>
                                <td>
                                  <div className="d-flex justify-content-center gap-2 flex-wrap">
                                    <input
                                      type="number"
                                      min="0"
                                      className="formControl1"
                                      name="ItemUnitCost.Adult"
                                      value={
                                        monumentFromValue[index]?.ItemUnitCost
                                          ?.Adult
                                      }
                                      onChange={(e) =>
                                        handleMonumentFormChange(index, e)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div className="d-flex justify-content-center gap-2 flex-wrap">
                                    <input
                                      type="number"
                                      min="0"
                                      className="formControl1"
                                      name="ItemUnitCost.Child"
                                      value={
                                        monumentFromValue[index]?.ItemUnitCost
                                          ?.Child
                                      }
                                      onChange={(e) =>
                                        handleMonumentFormChange(index, e)
                                      }
                                    />
                                  </div>
                                </td>
                              </>
                            )}
                          {(checkMonumentPrice == "Foreign" ||
                            checkMonumentPrice == "Both") && (
                              <>
                                <td>
                                  <div className="d-flex justify-content-center gap-2 flex-wrap">
                                    <input
                                      type="number"
                                      min="0"
                                      className="formControl1"
                                      name="ItemUnitCost.FAdult"
                                      value={
                                        monumentFromValue[index].ItemUnitCost
                                          .FAdult
                                      }
                                      onChange={(e) =>
                                        handleMonumentFormChange(index, e)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div className="d-flex justify-content-center gap-2 flex-wrap">
                                    <input
                                      type="number"
                                      min="0"
                                      className="formControl1"
                                      name="ItemUnitCost.FChild"
                                      value={
                                        monumentFromValue[index]?.ItemUnitCost
                                          ?.FChild
                                      }
                                      onChange={(e) =>
                                        handleMonumentFormChange(index, e)
                                      }
                                    />
                                  </div>
                                </td>
                              </>
                            )}
                        </tr>
                      );
                    })}
                    <tr className="costing-td">
                      <td
                        colSpan={
                          Type === "Main"
                            ? checkMonumentPrice != "Both"
                              ? 6
                              : 6
                            : checkMonumentPrice == "Both"
                              ? 7
                              : 7
                        }
                        rowSpan={3}
                        className="text-center fs-6"
                      >
                        Total
                      </td>
                      <td colSpan={2}>Monument Cost</td>
                      {(checkMonumentPrice == "Both" ||
                        checkMonumentPrice == "Indian") && (
                          <>
                            <td>
                              {mathRoundHelper(
                                monumentRateCalculate?.Price?.Adult
                              )}
                            </td>
                            <td>
                              {mathRoundHelper(
                                monumentRateCalculate?.Price?.Child
                              )}
                            </td>
                          </>
                        )}
                      {(checkMonumentPrice == "Both" ||
                        checkMonumentPrice == "Foreign") && (
                          <>
                            <td>
                              {mathRoundHelper(
                                monumentRateCalculate?.Price?.FAdult
                              )}
                            </td>
                            <td>
                              {mathRoundHelper(
                                monumentRateCalculate?.Price?.FChild
                              )}
                            </td>
                            {/* {console.log(
                            monumentRateCalculate?.Price?.FAdult,
                            "monumentRateCalculate"
                          )} */}
                          </>
                        )}
                    </tr>
                    <tr className="costing-td">
                      <td colSpan={2}>
                        Markup({MonumentData?.Value}) {MonumentData?.Markup}
                      </td>
                      {(checkMonumentPrice == "Both" ||
                        checkMonumentPrice == "Indian") && (
                          <>
                            <td>
                              {mathRoundHelper(
                                monumentRateCalculate?.MarkupOfCost?.Adult
                              )}
                            </td>
                            <td>
                              {mathRoundHelper(
                                monumentRateCalculate?.MarkupOfCost?.Child
                              )}
                            </td>
                          </>
                        )}
                      {(checkMonumentPrice == "Both" ||
                        checkMonumentPrice == "Foreign") && (
                          <>
                            <td>
                              {mathRoundHelper(
                                monumentRateCalculate?.MarkupOfCost?.FAdult
                              )}
                            </td>
                            <td>
                              {mathRoundHelper(
                                monumentRateCalculate?.MarkupOfCost?.FChild
                              )}
                            </td>
                          </>
                        )}
                    </tr>
                    <tr className="costing-td">
                      <td colSpan={2}>Total</td>
                      {(checkMonumentPrice == "Both" ||
                        checkMonumentPrice == "Indian") && (
                          <>
                            <td>
                              {mathRoundHelper(
                                (
                                  mathRoundHelper(
                                    monumentRateCalculate?.Price?.Adult || 0
                                  ) +
                                  mathRoundHelper(
                                    monumentRateCalculate?.MarkupOfCost?.Adult ||
                                    0
                                  )
                                ).toFixed(2)
                              )}
                            </td>
                            <td>
                              {mathRoundHelper(
                                (
                                  mathRoundHelper(
                                    monumentRateCalculate?.Price?.Child || 0
                                  ) +
                                  mathRoundHelper(
                                    monumentRateCalculate?.MarkupOfCost?.Child ||
                                    0
                                  )
                                ).toFixed(2)
                              )}
                            </td>
                          </>
                        )}
                      {(checkMonumentPrice == "Both" ||
                        checkMonumentPrice == "Foreign") && (
                          <>
                            <td>
                              {mathRoundHelper(
                                (
                                  mathRoundHelper(
                                    monumentRateCalculate?.Price?.FAdult || 0
                                  ) +
                                  mathRoundHelper(
                                    monumentRateCalculate?.MarkupOfCost?.FAdult ||
                                    0
                                  )
                                ).toFixed(2)
                              )}
                            </td>
                            <td>
                              {mathRoundHelper(
                                (
                                  mathRoundHelper(
                                    monumentRateCalculate?.Price?.FChild || 0
                                  ) +
                                  mathRoundHelper(
                                    monumentRateCalculate?.MarkupOfCost?.FChild ||
                                    0
                                  )
                                ).toFixed(2)
                              )}
                            </td>
                          </>
                        )}
                    </tr>
                  </tbody>
                </table>
              </PerfectScrollbar>
            </div>
            <Modal
              className="fade quotationList"
              show={modalCentered}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              dialogClassName="modal-full-height"
            >
              <Modal.Header>
                <Modal.Title>
                  {changeMonument?.dayNo
                    ? changeMonument?.date
                      ? `Monument Day ${changeMonument.dayNo} - Date ${moment(changeMonument.date).format("DD-MM-YYYY")}`
                      : `Monument Day ${changeMonument.dayNo}`
                    : null
                  }
                </Modal.Title>

                <Button
                  onClick={() => setModalCentered(false)}
                  variant=""
                  className="btn-close"
                ></Button>
              </Modal.Header>
              <Modal.Body
                className="py-2"
                style={{ overflowY: "auto", maxHeight: "calc(100vh - 160px)" }}
              >
                <Row className="form-row-gap-2">
                  <Col className="col-12">
                    <Row>
                      {/* <Col className="col-5">
                      <label htmlFor="name">
                        Monument
                        <span className="text-danger">*</span>
                      </label>

                      <select
                        className="form-control"
                        style={{
                          height: "30px",
                          fontSize: "0.7rem",
                          borderRadius: "0.7rem",
                        }}
                        value={tempMonument?.id}
                        onChange={handleTempMonumentChange}
                      >
                        <option value="">Select</option>
                        {monumentMasterList?.map((monument,index) => {
                          return (
                            <option value={monument?.id} key={index + 1}>
                              {monument?.MonumentName}
                            </option>
                          );
                        })}
                      </select>
                    </Col>
                    <Col className="col-3 d-flex align-items-end">
                      <Button
                        type="button"
                        style={{ height: "30px" }}
                        className="d-flex align-items-center justify-content-center"
                        onClick={addTempMonument}
                      >
                        {isEditingMonument?.editing ? "Update" : "Add"}
                      </Button>
                    </Col> */}
                    </Row>
                  </Col>
                  <Col className="col-12 mt-2 position-relative">
                    <div className="mx-auto mb-3 w-50">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Search by Monument Name"
                        value={searchMonumenName}
                        onChange={handleSearchMonumenNameChange}
                      />
                    </div>
                    <div
                      style={{
                        maxHeight: "350px",
                        overflowY: "auto",
                        position: "relative",
                      }}
                    >
                      {Array.isArray(changeMonument?.monument) && (
                        <Table
                          responsive
                          striped
                          bordered
                          className="rate-table mt-0 mb-0"
                        >
                          {/* {  console.log(changeMonument,"changeMonument")} */}
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th style={{ width: "220px" }}>Monument</th>
                              <th>Adult (I)</th>
                              <th>Adult (F)</th>
                              {/* <th style={{ width: "2rem" }}>Action</th> */}
                            </tr>
                          </thead>

                          <tbody>
                            {filteredMonuments?.map((monument) => {
                              const selected = changeMonument?.monument?.find(
                                (m) => m.id == monument.id
                              );
                              // console.log(selected,"selected");
                              // console.log(changeMonument?.monument, "selected");

                              const isChecked = !!selected;

                              // Use selected monument's fee if available, otherwise fallback to master list
                              const selectedRateJson = selected?.RateJson;
                              const masterRateJson =
                                monument?.RateJson?.Data?.[0]?.RateDetails?.[0];
                              // console.log(selectedRateJson, "selectedRateJson");
                              // console.log(masterRateJson, "masterRateJson");

                              const indianFee =
                                selectedRateJson?.IndianAdultEntFee !==
                                  undefined
                                  ? selectedRateJson.IndianAdultEntFee
                                  : masterRateJson?.IndianAdultEntFee ?? "";

                              // console.log(changeMonument, "changeMonument33");

                              const foreignFee =
                                // selected?.RateJson?.Data?.[0]?.RateDetails?.[0]
                                //   ?.ForeignerAdultEntFee ??
                                // monument?.RateJson?.Data?.[0]?.RateDetails?.[0]
                                //   ?.ForeignerAdultEntFee ??
                                // "";
                                selectedRateJson?.ForeignerAdultEntFee !==
                                  undefined
                                  ? selectedRateJson.ForeignerAdultEntFee
                                  : masterRateJson?.ForeignerAdultEntFee ?? "";

                              const handleCheckboxChange = () => {
                                if (isChecked) {
                                  setChangeMonument((prev) => ({
                                    ...prev,
                                    monument: prev.monument.filter(
                                      (m) => m.id !== monument.id
                                    ),
                                  }));
                                  //  console.log(isChecked,"isChecked");
                                } else {
                                  const selectedMonument =
                                    monumentMasterList.find(
                                      (m) => m.id === monument.id
                                    );
                                  if (!selectedMonument) return;

                                  const deepCopiedRateJson = JSON.parse(
                                    JSON.stringify(selectedMonument.RateJson)
                                  );

                                  setChangeMonument((prev) => ({
                                    ...prev,
                                    monument: [
                                      ...prev.monument,
                                      {
                                        id: selectedMonument.id,
                                        name: selectedMonument.MonumentName,
                                        RateJson:
                                          deepCopiedRateJson?.Data?.[0]
                                            ?.RateDetails?.[0] || [],
                                      },
                                    ],
                                  }));
                                }
                              };

                              return (
                                <tr key={monument.id}>
                                  <td>
                                    <div className="d-flex gap-2 flex-wrap px-1">
                                      <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={handleCheckboxChange}
                                        className="form-check-input"
                                      />
                                    </div>
                                  </td>
                                  <td>{monument.MonumentName || "N/A"}</td>
                                  <td>
                                    <input
                                      type="number"
                                      min="0"
                                      value={indianFee}
                                      onChange={(e) =>
                                        handleIndianFeeChange(e, monument.id)
                                      }
                                      style={{ width: "80px" }}
                                      step="1"
                                      className="form-control form-control-sm fs-6"
                                      disabled={!isChecked} // Disable input if monument is not selected
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="number"
                                      min="0"
                                      value={foreignFee}
                                      onChange={(e) =>
                                        handleForeignFeeChange(e, monument.id)
                                      }
                                      style={{ width: "80px" }}
                                      step="1"
                                      className="form-control form-control-sm fs-6"
                                      disabled={!isChecked} // Disable input if monument is not selected
                                    />
                                  </td>
                                </tr>
                              );
                            })}

                            {/* Total row */}
                            {/* <tr>
                              <td className="text-center" colSpan="2">
                                Total
                              </td>

                              <td>
                                {changeMonument?.monument.reduce(
                                  (total, curr) => {
                                    const fee =
                                      Array.isArray(curr?.RateJson) &&
                                        curr?.RateJson[0]?.IndianAdultEntFee
                                        ? curr.RateJson[0].IndianAdultEntFee
                                        : curr?.RateJson?.IndianAdultEntFee &&
                                          parseFloat(
                                            curr.RateJson.IndianAdultEntFee
                                          ) > 0
                                          ? curr.RateJson.IndianAdultEntFee
                                          : curr?.RateJson?.Data?.[0]
                                            ?.RateDetails?.[0]
                                            ?.IndianAdultEntFee;

                                    return total + (parseFloat(fee) || 0);
                                  },
                                  0
                                )}
                              </td>

                              <td>
                                {changeMonument?.monument.reduce(
                                  (total, curr) => {
                                    const fee =
                                      //Priority 1: Nested Data -> RateDetails (manual entry)
                                      curr?.RateJson?.Data?.[0]
                                        ?.RateDetails?.[0]?.ForeignerAdultEntFee
                                        ? curr.RateJson.Data[0].RateDetails[0]
                                          .ForeignerAdultEntFee
                                        : // Priority 2: Array style RateJson
                                        Array.isArray(curr?.RateJson) &&
                                          curr?.RateJson[0]
                                            ?.ForeignerAdultEntFee
                                          ? curr.RateJson[0].ForeignerAdultEntFee
                                          : // Priority 3: Simple object top-level
                                          curr?.RateJson?.ForeignerAdultEntFee;

                                    return total + (parseFloat(fee) || 0);
                                  },
                                  0
                                )}
                              </td>
                            </tr> */}
                          </tbody>
                        </Table>
                      )}
                    </div>
                    {/* Total Table with Matching Columns */}
                    <Table
                      responsive
                      striped
                      bordered
                      className="rate-table mt-0"
                    >
                      <tbody>
                        <tr className="StaticTotalRow">
                          <td
                            style={{ width: "10%" }}
                            className="text-center"
                          ></td>
                          <td
                            style={{ width: "44.5%", fontWeight: "600" }}
                            className="text-center"
                          >
                            Total
                          </td>

                          <td style={{ width: "22.5%" }}>
                            {changeMonument?.monument.reduce((total, curr) => {
                              const fee = curr?.RateJson?.IndianAdultEntFee;

                              return total + (parseFloat(fee) || 0);
                            }, 0)}
                          </td>
                          {/* {console.log(changeMonument, "changeMonument22")} */}

                          <td style={{ width: "24%" }}>
                            {changeMonument?.monument.reduce((total, curr) => {
                              const fee =
                                curr?.RateJson?.ForeignerAdultEntFee ||
                                curr?.RateJson?.[0]?.ForeignerAdultEntFee;
                              // {
                              //   console.log(
                              //     curr,
                              //     "curr?.RateJson?.ForeignerAdultEntFee"
                              //   );
                              // }

                              return total + (parseFloat(fee) || 0);
                            }, 0)}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
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
                  onClick={monumentFinalSave}
                  className="btn-custom-size"
                >
                  Save
                </Button>
              </Modal.Footer>
            </Modal>
            <div className="col-12 d-flex justify-content-end align-items-end">
              <button
                className="btn btn-primary py-1 px-2 radius-4 d-flex align-items-center gap-1"
                onClick={handleFinalSave}
              >
                <i className="fa-solid fa-floppy-disk fs-4"></i> Save
              </button>
            </div>
          </>
        ))}
    </div>
  );
};

export default React.memo(Monument);
