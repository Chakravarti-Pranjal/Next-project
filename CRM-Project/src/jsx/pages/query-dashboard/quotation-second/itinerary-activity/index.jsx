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
  setItineraryActivityDataServiceCost,
  setLocalItineraryActivityData,
} from "../../../../../store/actions/itineraryDataAction";
import { FaChevronCircleUp, FaChevronCircleDown } from "react-icons/fa";
import { Modal, Row, Col, Button } from "react-bootstrap";
import {
  setQoutationResponseData,
  setActivityFinalData,
} from "../../../../../store/actions/queryAction";
import { setQoutationData } from "../../../../../store/actions/queryAction";
import styles from "./index.module.css";
import {
  setItineraryCopyActivityFormData,
  setItineraryCopyActivityFormDataCheckbox,
} from "../../../../../store/actions/itineraryServiceCopyAction/itineraryServiceCopyAction";
import moment from "moment";
import IsDataLoading from "../IsDataLoading";
import { round } from "lodash";

const Activity = ({ Type, checkBoxes, headerDropdown }) => {
  const { qoutationData, queryData, isItineraryEditing } = useSelector(
    (data) => data?.queryReducer
  );
  const [activityList, setActivityList] = useState([]);
  const hasInitialized = useRef(false);
  const [copyChecked, setCopyChecked] = useState(false);
  const [destinationList, setDestinationList] = useState([]);
  const [activityFormValue, setActivityFormValue] = useState([]);
  const [originalActivityForm, setOriginalActivityForm] = useState([]);
  const [paxRangePrice, setPaxRangePrice] = useState([]);
  const { activityFormData, activityFormDataServiceCost } = useSelector(
    (data) => data?.itineraryReducer
  );
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
  // state to Markup value
  const [markupArray, setMarkupArray] = useState({
    Markup: { Data: [] },
  });
  // console.log(markupArray, "markupArray111");
  const ActivityData = markupArray?.Markup?.Data?.find(
    (item) => item.Type === "Activity"
  );
  // console.log(ActivityData, "ActivityData")

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
  const [isDataLoading, setIsDataLoading] = useState(true);

  const apiDataLoad = useSelector(
    (state) => state.inineraryServiceDataLoadReducer.activity
  );

  // Itinerary tab change
  const itinerarayTab = useSelector(
    (state) => state.tabWiseDataLoadReducer.tab
  );

  // console.log(activityFormValue, "activityFormValue844747");

  const getDestinationUniueId = async (destinationId) => {
    try {
      const { data } = await axiosOther.post("destinationlist", {
        id: destinationId,
      });
      if (data?.Status === 200) {
        const uniqueId = data?.DataList?.[0]?.UniqueID;
        return uniqueId;
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const postDataToServer = async () => {
    try {
      setIsDataLoading(true);
      try {
        const { data } = await axiosOther.post("destinationlist");
        setDestinationList(data?.DataList);
      } catch (error) {
        console.log("error", error);
      }
      //  Markup value call api
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

  useEffect(() => {
    if (!apiDataLoad) return;
    postDataToServer();
  }, [apiDataLoad]);

  const [isChangeDropdown, setIsChangeDropdown] = useState(true);

  // console.log(qoutationData?.Days, "rateList3836");
  const hasMonumentService = qoutationData?.Days?.some((day) =>
    day.DayServices?.some(
      (service) =>
        service?.ServiceType == "Activity" &&
        service?.ServiceMainType == "Guest"
    )
  );
  const [isFinalSaved, setIsFinalSaved] = useState(false);

  const formValueInitialization = () => {
    if (isFinalSaved) return;
    if (qoutationData?.Days) {
      // console.log(qoutationData?.Days, "qoutationData?.Days");

      if (hasMonumentService) {
        const initialFormValue = qoutationData?.Days?.flatMap(
          (day, index, daysArray) => {
            // Skip enroute duplicates
            const previousEnrouteId = daysArray[index - 1]?.EnrouteId;
            if (previousEnrouteId && previousEnrouteId === day?.DestinationId) {
              return [];
            }

            // Get all matching services for this day
            const services =
              day?.DayServices?.filter(
                (service) =>
                  service?.ServiceType === "Activity" &&
                  service?.ServiceMainType === "Guest"
              ) || [];

            // Map each service into a form object
            return services.map((service) => {
              const { ItemUnitCost } =
                service?.ServiceDetails?.flat(1)?.[0] || {};

              if (service?.DestinationId) {
                service.DestinationId = parseInt(service.DestinationId);
                service.ServiceId = parseInt(service.ServiceId);
              }
              // console.log(service, "service1111");

              return {
                id: queryData?.QueryId,
                QuatationNo: qoutationData?.QuotationNumber,
                DayType: Type,
                Supplier:
                  service?.ServiceDetails?.[0]?.ItemSupplierDetail
                    ?.ItemSupplierId,
                DayNo: day.Day,
                ActivityTime: service?.ActivityTime,
                Date: day?.Date,
                Destination: service?.DestinationId,
                DestinationUniqueId: day?.DestinationUniqueId,
                DayUniqueId: day?.DayUniqueId,
                ServiceId: service?.ServiceId ?? " ",
                // ServiceMainType: service?.ServiceMainType ?? "No",
                Supplement: service?.Supplement ?? "No",
                Package: service?.Package ?? "No",
                Highlights: service?.Highlights ?? "No",
                BeforeSS: service?.BeforeSS ?? "No",
                Escort: service?.Escort ?? "No",
                Description: service?.Description,
                PaxRange: service?.PaxRange,
                Cost: ItemUnitCost,
                NoOfActivity: 1,
                ServiceType: "Activity",
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
          }
        );

        setActivityFormValue(initialFormValue);
        setOriginalActivityForm(initialFormValue);

        // Rows per index (now based on multiple services)
        const initialRows = {};
        let rowIndex = undefined;

        qoutationData?.Days?.forEach((day, dayIndex) => {
          const additionalServices = day?.DayServices?.filter(
            (service) => service?.ServiceType === "Activity"
          );

          additionalServices?.forEach((service) => {
            if (rowIndex == undefined) {
              rowIndex = 0;
            } else {
              rowIndex += 1;
            }

            // console.log(rowIndex, "rowIndex46464", dayIndex);
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
            initialRows[rowIndex] = mappedRows;
            // initialRows[service.ServiceUniqueId] = mappedRows;
          });
        });

        // console.log(initialRows, "initialRows145", rowIndex);
        setIsChangeDropdown(false);

        setRowsPerIndex(initialRows);
      } else {
        // console.log(qoutationData?.Days, "qoutationData?.Days");
        const activityInitialValue = qoutationData?.Days?.filter(
          (day, index, daysArray) => {
            const previousEnrouteId = daysArray[index - 1]?.EnrouteId;
            if (
              previousEnrouteId != null &&
              previousEnrouteId !== "" &&
              previousEnrouteId === day?.DestinationId
            ) {
              return false;
            }
            return true;
          }
        )?.map((day, ind) => {
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
            DayType: Type,
            PaxInfo: {
              Adults: qoutationData?.Pax?.AdultCount,
              Child: qoutationData?.Pax?.ChildCount,
              Infant: "",
              Escort: "",
            },
          };
        });
        setActivityFormValue(activityInitialValue);
        setOriginalActivityForm(activityInitialValue);
      }
    }
  };

  // console.log(rowsPerIndex, "VCHDJD8777");

  // activity table form initial value
  useEffect(() => {
    formValueInitialization();
  }, [qoutationData, checkBoxes]);
  // console.log(activityFormValue, "activityformvalue2");

  // console.log(supplierList, "GDVCH9888");

  // set value into for it's first value from list
  const setFirstValueIntoForm = (index) => {
    // console.log(index, "supplierdhdhdh");
    // Updated logic for handling duplicate and unique IDs
    const processActivityIds = (activityList) => {
      const idIndicesMap = {};

      activityList.forEach((subArray, idx) => {
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

      const result = Array(activityList.length).fill(null);

      for (const id in idIndicesMap) {
        const indices = idIndicesMap[id];

        if (indices.length > 1) {
          // Duplicate case: only second gets the ID
          if (indices[1] !== undefined) {
            result[indices[1]] = id;
          }
        } else {
          const idx = indices[0];
          // Single occurrence: only assign if not first or last
          if (idx !== 0 && idx !== activityList.length - 1) {
            result[idx] = id;
          }
        }
      }

      return result;
    };

    // Apply the logic
    const processedIds = processActivityIds(activityList);
    const activityId = processedIds[index] ?? "";

    const supplier =
      supplierList[index] !== undefined ? supplierList[index][0]?.id : "";

    // console.log(allSuppliersLoaded, "HDVDGD(888", supplierList);

    // Update form state with selected ServiceId and Supplier
    setActivityFormValue((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = {
        ...newArr[index],
        ServiceId: activityId,
        Supplier: supplier,
      };
      return newArr;
    });

    setOriginalActivityForm((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = {
        ...newArr[index],
        ServiceId: activityId,
        Supplier: supplier,
      };
      return newArr;
    });

    // Handle rates and rowsPerIndex
    const rate = rateList?.[index];

    // console.log(index, "CVHDGD7777");

    const defaultServiceCost = [
      {
        upTo: "0",
        rounds: "1",
        class: "0",
        duration: "0",
        amount: "0",
        remarks: "0",
      },
    ];

    if (rate && rate.length > 0) {
      const formattedServiceCost = rate[0].RateJson.ServiceCost.map((row) => ({
        upTo: row.UpToPax || "0",
        rounds: row.Rounds || "1",
        class: row.Class || "0",
        duration: row.Duration || "0",
        amount: row.Amount || "0",
        remarks: row.Remarks || "0",
      }));

      setRowsPerIndex((prev) => {
        const safePrev = Array.isArray(prev) ? prev : [];
        const newData = [...safePrev];
        newData[index] = formattedServiceCost;
        return newData;
      });
    } else {
      setRowsPerIndex((prev) => {
        const safePrev = Array.isArray(prev) ? prev : [];
        const newData = [...safePrev];
        newData[index] = defaultServiceCost;
        return newData;
      });
    }
  };

  // useEffect(() => {
  //   if (
  //     !isItineraryEditing &&
  //     checkBoxes?.includes("activity") &&
  //     activityList.length > 0 &&
  //     supplierList.length > 0
  //     // !isFirstValueSetted
  //   ) {
  //     activityFormValue?.forEach((item, index) => {
  //       setFirstValueIntoForm(index);
  //     });
  //     // setIsFirstValueSetted(true);
  //   }
  // }, [checkBoxes, activityList, supplierList]);
  // Add a useRef to track whether the initial setup has been done
  const hasRunInitialSetup = useRef(false);

  useEffect(() => {
    if (hasRunInitialSetup.current) {
      return;
    }

    if (
      qoutationData?.Days?.length > 0 &&
      checkBoxes?.includes("activity") &&
      activityList?.length > 0 &&
      supplierList?.length > 0 &&
      allSuppliersLoaded
    ) {
      const allDaysEmpty =
        Array.isArray(qoutationData?.Days) &&
        qoutationData.Days.every((day) => {
          if (!Array.isArray(day.DayServices)) return true;
          const guideServices = day.DayServices.filter(
            (service) =>
              service.ServiceType === "Activity" &&
              service?.ServiceMainType === "Guest"
          );
          return guideServices.length === 0;
        });

      if (allDaysEmpty && checkBoxes?.includes("activity")) {
        activityFormValue?.forEach((form, index) => {
          // console.log(`Setting first value into form at index ${index}`);
          setFirstValueIntoForm(index);
        });
        // Mark the initial setup as done
        hasRunInitialSetup.current = true;
      }
    }
  }, [qoutationData, checkBoxes, activityList, supplierList, apiDataLoad]);

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
        // console.log(newArr,"newArr")
        return newArr;
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    // if (!apiDataLoad) return;
    activityFormValue?.forEach((item, index) => {
      getActivityList(item?.ServiceType, index, item?.Destination);
    });
  }, [
    activityFormValue?.map((item) => item?.ServiceType).join(","),
    activityFormValue?.map((item) => item?.Destination).join(","),
    // apiDataLoad,
    // activityFormValue?.length,
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

    // Duplicate the rowsPerIndex entry
    setRowsPerIndex((prev) => {
      const newRows = { ...prev };
      // Shift all keys after index up by 1
      const keys = Object.keys(newRows)
        .map(Number)
        .sort((a, b) => b - a); // descending
      keys.forEach((key) => {
        if (key > index) {
          newRows[key + 1] = newRows[key];
        }
      });
      // Insert a copy at index + 1
      newRows[index + 1] = Array.isArray(newRows[index])
        ? newRows[index].map((row) => ({ ...row }))
        : [
            {
              upTo: "",
              rounds: "1",
              class: "",
              duration: "",
              amount: "",
              remarks: "",
            },
          ];
      return newRows;
    });
  };
  // console.log(activityFormValue, "WSTSTTST", rowsPerIndex);
  const [allSuppliersLoaded, setAllSuppliersLoaded] = useState(false);

  const getSupplierList = async (index, id) => {
    try {
      const { data } = await axiosOther.post("supplierlist", {
        Name: "",
        id: "",
        SupplierService: [3],
        DestinationId: [Number(id)],
      });

      // console.log(data, "DHDGDGDJJD8777");
      return { index, data: data?.DataList };
    } catch (error) {
      console.log("error", error);
      return { index, data: [] }; // fallback
    }
  };

  useEffect(() => {
    if (!apiDataLoad) return;

    const destinations = activityFormValue
      ?.map((item, index) => ({ index, dest: item?.Destination }))
      .filter((item) => item.dest !== "");

    if (!destinations?.length) return;

    setAllSuppliersLoaded(false); // reset before loading

    Promise.all(destinations.map((d) => getSupplierList(d.index, d.dest))).then(
      (results) => {
        setSupplierList((prevArr) => {
          const newArr = [...prevArr];
          results.forEach(({ index, data }) => {
            newArr[index] = data;
          });
          return newArr;
        });
        setAllSuppliersLoaded(true); // ✅ notify here
      }
    );
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
  // console.log(activityFormValue,"1133")
  // console.log(rowsPerIndex,"rowperindexx");
  // console.log(rateList,"rateList[index]")
  //   useEffect(() => {
  //   console.log("Updated rowsPerIndex:", rowsPerIndex);
  // }, [rowsPerIndex]);
  // console.log(rateList, "rate1");

  const mergeActivityPrice = (rateList, index) => {
    // console.log(rateList,"rate2");
    const form = activityFormValue[index];
    const rate = rateList[index];
    // console.log(rate, "rate3");

    if (rate && rate.length > 0) {
      const formattedServiceCost = rate[0].RateJson.ServiceCost.map((row) => {
        // console.log("GVCGD7767", row.Rounds);
        return {
          upTo: row.UpToPax ? row.UpToPax : "0",
          rounds: row.Rounds ? row.Rounds : "1",
          class: row.Class ? row.Class : "0",
          duration: row.Duration ? row.Duration : "0",
          amount: row.Amount ? row.Amount : "0",
          remarks: row.Remarks ? row.Remarks : "0",
        };
      });
      // console.log(formattedServiceCost, "formattedServiceCost");

      setRowsPerIndex((prev) => ({
        ...prev,
        [index]: formattedServiceCost,
      }));
    } else {
      const defaultServiceCost = [
        {
          upTo: "0",
          rounds: "1",
          class: "0",
          duration: "0",
          amount: "0",
          remarks: "0",
        },
      ];

      // setRowsPerIndex((prev) => {
      //   const safePrev = Array.isArray(prev) ? prev : [];
      //   const newData = [...safePrev];
      //   newData[index] = defaultServiceCost;
      //   return newData;
      // });
      setRowsPerIndex((prev) => ({
        ...prev, // Preserve all existing keys
        [index]: defaultServiceCost, // Update only the specific index
      }));
    }
  };
  // const prevActivityServiceIds = useRef([]);
  // useEffect(() => {
  //   const allRatesReady =
  //     Array.isArray(rateList) &&
  //     rateList.every((r) => r !== undefined && r !== null);

  //   if (allRatesReady && Array.isArray(activityFormValue)) {
  //     activityFormValue.forEach((activity,index) => {
  //       const currentServiceId = activity?.ServiceId;
  //       const prevServiceId = prevActivityServiceIds.current?.[index];

  //       // Only update if ServiceId has changed
  //       if (currentServiceId !== prevServiceId) {
  //         mergeActivityPrice(index);
  //       }
  //     });

  //     // Update previous ServiceIds
  //     prevActivityServiceIds.current = activityFormValue.map(
  //       (item) => item?.ServiceId
  //     );
  //   }
  // },[
  //   rateList.map((r) => (r ? JSON.stringify(r) : "null")).join("|"),
  //   activityFormValue.map((item) => item?.ServiceId).join(","),
  // ]);
  const prevServiceIdsRefs = useRef([]);
  const prevRateListRef = useRef([]);

  useEffect(() => {
    activityFormValue.forEach((activity, idx) => {
      const currentServiceId = activity?.ServiceId;
      const prevServiceId = prevServiceIdsRefs.current[idx];
      const currentRate = rateList[idx];
      const prevRate = prevRateListRef.current[idx];

      // Run if ServiceId changed and rateList[idx] exists,
      // OR if rateList[idx] is new (first time loaded)
      if (
        currentServiceId &&
        rateList[idx] &&
        (currentServiceId !== prevServiceId || currentRate !== prevRate)
      ) {
        mergeActivityPrice(rateList, idx);
      }
    });

    // Update previous refs after processing
    prevServiceIdsRefs.current = activityFormValue.map(
      (item) => item?.ServiceId
    );
    prevRateListRef.current = [...rateList];
  }, [rateList, activityFormValue.map((item) => item?.ServiceId).join(",")]);

  // console.log(activityFormValue, "VCBSUGD8777");

  const handleActivityFormChange = async (ind, e) => {
    const { name, value, checked, type } = e.target;

    setIsChangeDropdown(true);

    if (name === "Destination") {
      // Fetch supplier list for the new destination
      getSupplierList(ind, value);
      const uniqueId = await getDestinationUniueId(parseInt(value));
      // console.log(uniqueId, "VCHDG877", activityFormValue);
      setActivityFormValue((prev) => {
        const newArr = [...prev];
        newArr[ind] = {
          ...newArr[ind],
          DestinationUniqueId: uniqueId,
        };
        return newArr;
      });
    }

    if (name == "ServiceId") {
      // mergeActivityPrice(ind);
      // getActivityRateApi()
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

  const finalForm = () => {
    const finalFormData = activityFormValue?.map((form, index) => {
      // console.log(rowsPerIndex[index], "VHHDHDHD988", rowsPerIndex);
      const rows = rowsPerIndex[index] || [];
      const AdditionalCost = rows.map((row) => ({
        UpToPax: row.upTo || "",
        Rounds: row.rounds || "",
        Class: row.class || "",
        Duration: row.duration || "",
        Amount: row.amount || "",
        Remarks: row.remarks || "",
      }));
      const dayWiseTotalCost = dayWiseTotals[index];
      return {
        ...form,
        AdditionalCost,
        Hike: hikePercent,
        DayType: Type,
        Sector: fromToDestinationList[index],
        TotalCosting: dayWiseTotalCost,
      };
    });
    // if()
    dispatch(setActivityFinalData(finalFormData));
  };

  useEffect(() => {
    if (!apiDataLoad) return;
    // console.log(apiDataLoad, "apiDataLoadcheckfunction");

    finalForm();
  }, [
    activityFormValue,
    rowsPerIndex,
    dayWiseTotals,
    hikePercent,
    fromToDestinationList,
    Type,
    apiDataLoad,
  ]);
  // console.log(apiDataLoad, "apiDataLoadactivity");

  // console.log(rowsPerIndex, "QYSSFFSFS");

  const handleFinalSave = async () => {
    try {
      const finalForm = activityFormValue?.map((form, index) => {
        const rows = rowsPerIndex[index] || [];

        const AdditionalCost = rows.map((row) => ({
          UpToPax: row.upTo || "",
          Rounds: row.rounds || "",
          Class: row.class || "",
          Duration: row.duration || "",
          Amount: row.amount || "",
          Remarks: row.remarks || "",
        }));

        const dayWiseTotalCost = dayWiseTotals[index];
        return {
          ...form,
          AdditionalCost,
          Hike: hikePercent,
          DayType: Type,
          Sector: fromToDestinationList[index],
          TotalCosting: dayWiseTotalCost,
        };
      });

      const transformedData = finalForm.map(
        ({ ServiceMainType, ...rest }) => rest
      );

      // console.log(transformedData, "GVCGD877", finalForm);

      // console.log("Hello World", finalForm);

      const { data } = await axiosOther.post(
        "update-quotation-activity",
        transformedData
      );

      if (data?.status == 0) {
        notifyHotError(data?.message);
      }

      if (data?.status == 1) {
        // notifySuccess("Services Added!");
        notifyHotSuccess(data?.message);
        setIsFinalSaved(true);
        dispatch(setTotalActivityPricePax(finalForm?.[0]?.TotalCosting?.Cost));
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

  // getting rate data form api
  // const getActivityRateApi = async (destination, index, date, srvcId) => {
  //   console.log(destination, index, date, srvcId, "destination, index, date, srvcId");

  //   // if (activityFormValue[index]?.ServiceId === 0) {
  //   //   // setRateList((prevArr) => {
  //   //   //   const updated = [...prevArr];
  //   //   //   updated[index] = []; // Clear the rate for this index
  //   //   //   return updated;
  //   //   // });
  //   //   // console.log("ServiceId is 0, skipping API call.");
  //   //   return;
  //   // }
  //   // console.log(srvcId,"srvcId")
  //   const activtiyUID =
  //     activityList[0] != undefined
  //       ? activityList[index]?.find((activity) => activity?.id == srvcId)
  //       : "";

  //   console.log(activtiyUID, "ACTI&77");

  //   let token = localStorage.getItem("token");
  //   let companyid = JSON.parse(token);

  //   // console.log(companyid,"persed")
  //   // chnage here to pass date
  //   const queryDataFromLocalStroage = JSON.parse(
  //     localStorage.getItem("query-data")
  //   );
  //   console.log(queryDataFromLocalStroage, "queryDataFromoLcalStroage");

  //   try {
  //     const { data } = await axiosOther.post("activitysearchlist", {
  //       id: "",
  //       ActivityUID: activtiyUID?.UniqueId,
  //       CompanyId: companyid?.CompanyUniqueId,
  //       Destination: destination,
  //       Date: "",
  //       Year: "",
  //       // ValidFrom: queryData?.QueryAllData?.TravelDateInfo?.FromDate,
  //       // ValidTo: queryData?.QueryAllData?.TravelDateInfo?.ToDate,
  //       ValidFrom: queryDataFromLocalStroage?.TravelDateInfo?.ScheduleType == "Date Wise" ? queryDataFromLocalStroage?.TravelDateInfo?.FromDateDateWise : queryData?.QueryAllData?.TravelDateInfo?.FromDate,
  //       ValidTo: queryDataFromLocalStroage?.TravelDateInfo?.ScheduleType == "Date Wise" ? queryDataFromLocalStroage?.TravelDateInfo?.FromDateDateWise : queryData?.QueryAllData?.TravelDateInfo?.ToDate,
  //       TotalActivity: "",
  //       QueryId: queryData?.QueryId,
  //       QuatationNo: qoutationData?.QuotationNumber,
  //       Type: "",
  //     });

  //     const result = data?.Status == 0 ? [] : data?.Data || [];

  //     // console.log(data?.Data, "result");

  //     if (
  //       data?.TotalRecords > 0 &&
  //       data?.Data &&
  //       data.Data.length > 0 &&
  //       data.Data[0]?.RateJson?.ServiceCost &&
  //       data.Data[0].RateJson.ServiceCost.length > 0
  //     ) {
  //       setRateList((prevArr) => {
  //         const updated = [...prevArr];
  //         updated[index] = result;
  //         // console.log("Updated rate list:", updated);

  //         return updated;
  //       });
  //     } else {
  //       // Clear the rate list
  //       setRateList((prevArr) => {
  //         const updated = [...prevArr];
  //         updated[index] = [];
  //         return updated;
  //       });
  //     }

  //     // console.log(rateList,"data12")
  //   } catch (error) {
  //     console.log("rate-err", error);
  //   }
  // };
  const getActivityRateApi = async (
    destination,
    index,
    date,
    srvcId,
    Supplier
  ) => {
    // Agar ServiceId 0 hai to API call skip kar do
    // if (activityFormValue[index]?.ServiceId === 0) {
    //   setRateList((prevArr) => {
    //     const updated = [...prevArr];
    //     updated[index] = []; // is index ka data clear
    //     return updated;
    //   });
    //   console.log("ServiceId is 0, skipping API call.");
    //   return;
    // }

    const activtiyUID =
      activityList[0] !== undefined
        ? activityList[index]?.find((activity) => activity?.id == srvcId)
        : "";
    const SupplierUID =
      supplierList[0] !== undefined
        ? supplierList[index]?.find((activity) => activity?.id == Supplier)
        : "";

    // console.log(index, "VCHDGDG8777", activityList);

    let token = localStorage.getItem("token");
    let companyid = JSON.parse(token);

    const queryDataFromLocalStroage = JSON.parse(
      localStorage.getItem("query-data")
    );
    // console.log(SupplierUID, "UniqueId");

    try {
      const { data } = await axiosOther.post("activitysearchlist", {
        id: "",
        ActivityUID: activtiyUID?.UniqueId,
        CompanyId: companyid?.CompanyUniqueId,
        Destination: destination,
        Date: "",
        Year: "",
        SupplierUID: SupplierUID?.UniqueID,
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
        Type: "Activity",
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

  const prevServiceIdsRef = useRef([]);
  const prevDestIdsRef = useRef([]);

  // console.log(activityList, "VCHDGDGDGDGGDDDG93993");

  useEffect(() => {
    activityFormValue.forEach((activity, idx) => {
      const { ServiceId, DestinationUniqueId, Date, Supplier } = activity || {};
      const prevServiceId = prevServiceIdsRef.current[idx];
      const prevDestId = prevDestIdsRef.current[idx];

      // Only call API if ServiceId or DestinationUniqueId changed for this index
      // console.log(ServiceId,DestinationUniqueId,Date,"checkdataa");
      // console.log(isChangeDropdown, "isChangeDropdown3535");
      if (
        ServiceId &&
        DestinationUniqueId &&
        isChangeDropdown &&
        (ServiceId !== prevServiceId || DestinationUniqueId !== prevDestId)
      ) {
        getActivityRateApi(DestinationUniqueId, idx, Date, ServiceId, Supplier);
      }
    });

    // Update refs after checking
    prevServiceIdsRef.current = activityFormValue.map(
      (item) => item?.ServiceId
    );
    prevDestIdsRef.current = activityFormValue.map(
      (item) => item?.DestinationUniqueId
    );
  }, [
    activityFormValue.map((item) => item?.ServiceId).join(","),
    activityFormValue.map((item) => item?.DestinationUniqueId).join(","),
    activityList,
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
    const hike = parseFloat(value);
    setHikePercent(hike);

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
    // console.log(updatedData, "dkkds47");
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
      setActivityPrice(
        parseInt(totalCost) +
          parseInt((totalCost * ActivityData?.Value) / 100 || 0)
      ) // chnage Markup Value
    );
    dispatch(setTogglePriceState());

    setActivityPriceCalculation((prevData) => ({
      ...prevData,
      Price: totalCost,
      MarkupOfCost: (totalCost * ActivityData?.Value) / 100 || 0, // chnage Markup Value
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
                rounds: "1",
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
      // console.log(firstvalue, "firstvalue");
      if (firstvalue && firstvalue?.amount) {
        total += parseFloat(firstvalue.amount) * firstvalue.rounds || 0;
      }
    });
    setTotalAmount(total);

    // Days Wise total
    const totals = {};

    Object.entries(rowsMap).forEach(([day, rows]) => {
      let totalAmount = 0;

      rows?.forEach((row) => {
        const firstRow = row?.[0]; // 👈 renamed to avoid conflict
        // console.log(row, "checkrow");

        const amount = parseFloat(firstRow?.amount);
        const round = parseFloat(firstRow?.rounds);
        // console.log(round, "round");

        if (!isNaN(amount) && !isNaN(round)) {
          // console.log(amount, "amountffff");
          totalAmount += amount * round;
        }
      });

      const adultMarkupValue = ActivityData?.Value; // Change value to % to Dyanamice
      const adultMarkupTotal = (totalAmount * adultMarkupValue) / 100 || 0;
      // console.log(totalAmount, "11111");

      totals[day] = {
        ActivityCost: totalAmount,
        ActivityCostMarkupValue: String(adultMarkupValue),
        TotalActivityCostMarkup: String(adultMarkupTotal),
        TotalActivityCost: String(totalAmount + adultMarkupTotal),
      };
    });

    setDayWiseTotals(totals);
  };

  // const handleChange = (index, field, value) => {
  //   const key = selectedIndex;
  //   const updatedRows = [...(rowsPerIndex[key] || [])];
  //   updatedRows[index][field] = value;
  //   setRowsPerIndex((prev) => ({
  //     ...prev,
  //     [key]: updatedRows,
  //   }));
  // };
  const handleChange = (index, field, value) => {
    const key = selectedIndex;
    const updatedRows = [...(rowsPerIndex[key] || [])];
    updatedRows[index] = { ...updatedRows[index], [field]: value };

    // Calculate Total (amount) if rounds or class is changed
    if (field === "rounds" || field === "class") {
      const rounds = parseFloat(updatedRows[index].rounds) || 0;
      const classAmount = parseFloat(updatedRows[index].class) || 0;
      updatedRows[index].amount = (rounds * classAmount).toString(); // Calculate Total
    }

    setRowsPerIndex((prev) => ({
      ...prev,
      [key]: updatedRows,
    }));
  };

  const handleAddRow = () => {
    const key = selectedIndex;
    const newRow = {
      upTo: "",
      rounds: "1",
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
              rounds: "1",
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

  // console.log("selectedIndex in table:", selectedIndex);
  // console.log("rowsPerIndex keys:", Object.keys(rowsPerIndex));
  // console.log("matched rows:", rowsPerIndex[selectedIndex]);

  useEffect(() => {
    return () => {
      dispatch({
        type: "SET_ACTIVITY_DATA_LOAD",
        payload: false,
      });
    };
  }, []);

  // ==============================================

  // storing guide form into redux store
  useEffect(() => {
    if (Type == "Main") {
      dispatch(setItineraryActivityData(activityFormValue));
      dispatch(setItineraryActivityDataServiceCost(rowsPerIndex));
    }
  }, [activityFormValue]);

  // copy functionality to copy type main to local and foreign

  const activityCheckbox = useSelector(
    (state) => state.itineraryServiceCopyReducer.activityCheckbox
  );

  useEffect(() => {
    // console.log("COPY67", mainHotelCheckBox);
    if (activityCheckbox.local) {
      dispatch(
        setItineraryCopyActivityFormData({
          ActivityForm: activityFormValue,
          Costing: rowsPerIndex,
        })
      );
    }
  }, [activityFormValue, rowsPerIndex]);

  useEffect(() => {
    return () => {
      dispatch(
        setItineraryCopyActivityFormDataCheckbox({
          local: true,
          foreigner: true,
        })
      );
    };
  }, []);

  //  console.log(activityFormValue,"activityiid");
  // {console.log(activityFormValue,"checkkd")
  // console.log("All Destinations:", qoutationData?.Days);
  //                       }

  return (
    <div className="row mt-3 m-0">
      <div
        className="col-12 px-1 py-2 d-flex justify-content-between itinerary-head-bg"
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
                  checked={copyChecked}
                  onChange={(e) => setCopyChecked(e.target.checked)}
                />
                <label className="fontSize11px m-0 ms-1 " htmlFor="copy-hotel">
                  Copy
                </label>
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
                type="number"
                min="0"
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
      {isOpen &&
        (isDataLoading ? (
          <IsDataLoading />
        ) : (
          <>
            <div className="d-flex gap-2 col-12 px-0 mt-2">
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
                      {/* <th rowSpan={2} className="align-middle">
                        Service Type
                      </th> */}
                      <th
                        style={{ width: "200px" }}
                        rowSpan={2}
                        className="align-middle"
                      >
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
                      {/* <th className="removeOnlyWeb">
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
                      {/* <th className="removeOnlyWeb">
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
                      {/* <th className="removeOnlyWeb">Package</th> */}
                      <th>Highlight</th>
                      <th>Before SS</th>
                      {/* <th className="removeOnlyWeb">Escort</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {console.log(activityFormValue, "ACT564")}
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
                            // onMouseEnter={() => setHoveredIndex(index)}
                            // onMouseLeave={() => setHoveredIndex(null)}
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

                                <span
                                  onClick={() => handleTableIncrement(index)}
                                >
                                  <i className="la la-plus border cursor-pointer bg-success text-white rounded-pill fontSize10px padding1px"></i>
                                </span>

                                <span
                                  onClick={() => handleTableDecrement(index)}
                                >
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
                          {/* <td> 
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
                                <option value="0">Select</option>
                                <option value="Activity">Activity</option>
                                <option value="Experience">Experience</option>
                              </select>
                            </div>
                          </td> */}
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
                                style={{ width: "180px" }}
                              >
                                <option value="0">Select</option>
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
                                name="Supplier"
                                id=""
                                className="formControl1"
                                value={activityFormValue[index]?.Supplier}
                                onChange={(e) =>
                                  handleActivityFormChange(index, e)
                                }
                              >
                                <option value="0">Select</option>
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
                          {/* <td className="removeOnlyWeb">
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
                          {/* <td className="removeOnlyWeb">
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
                  min="0"
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
                                  min="0"
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
                  min="0"
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
                      <td colSpan={3}>{totalAmount}</td>
                    </tr>
                    <tr className="costing-td">
                      <td colSpan={3}>
                        Markup ({ActivityData?.Value}) {ActivityData?.Markup}
                      </td>
                      <td colSpan={3}>
                        {(totalAmount * ActivityData?.Value) / 100 || 0}
                      </td>
                    </tr>
                    <tr className="costing-td">
                      <td colSpan={3}>Total</td>
                      <td colSpan={3}>
                        {totalAmount +
                          (totalAmount * ActivityData?.Value) / 100 || 0}
                      </td>
                    </tr> */}
                  </tbody>
                </table>
              </div>
              {/* Right Table----------------------------------------------------------- */}
              {showDetails ? (
                <div
                  className={`${styles.tableRight} ${styles.scrollContainer}`}
                >
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
                        <th>Amount</th>
                        <th>Duration</th>
                        <th>Total</th>
                        <th>Remarks</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowsPerIndex[selectedIndex]?.map((rowData, index) => (
                        <tr key={index}>
                          <td className="customInputWidth">
                            <input
                              type="number"
                              min="0"
                              className="formControl1"
                              value={rowData.upTo}
                              onChange={(e) =>
                                handleChange(index, "upTo", e.target.value)
                              }
                            />
                          </td>
                          <td className="customInputWidth">
                            <input
                              type="number"
                              min="0"
                              className="formControl1"
                              value={rowData.rounds}
                              onChange={(e) =>
                                handleChange(index, "rounds", e.target.value)
                              }
                            />
                          </td>
                          <td className="customInputWidth">
                            <input
                              type="number"
                              min="0"
                              className="formControl1"
                              // value={rowData.class}
                              // onChange={(e) =>
                              //   handleChange(index, "class", e.target.value)
                              // }
                            />
                          </td>
                          <td className="customInputWidth">
                            <input
                              type="number"
                              min="0"
                              className="formControl1"
                              value={rowData.class}
                              onChange={(e) =>
                                handleChange(index, "class", e.target.value)
                              }
                            />
                          </td>
                          <td className="customInputWidth">
                            <input
                              type="text"
                              className="formControl1"
                              value={rowData.duration}
                              onChange={(e) =>
                                handleChange(index, "duration", e.target.value)
                              }
                            />
                          </td>
                          <td className="customInputWidth">
                            <input
                              type="number"
                              min="0"
                              className="formControl1"
                              value={rowData.amount}
                              onChange={(e) =>
                                handleChange(index, "amount", e.target.value)
                              }
                            />
                          </td>
                          <td className="customInputWidthAmount">
                            <input
                              type="text"
                              className="formControl1"
                              value={rowData.remarks}
                              onChange={(e) =>
                                handleChange(index, "remarks", e.target.value)
                              }
                            />
                          </td>
                          <td className="customInputWidth">
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
                className="btn btn-primary py-1 px-2 radius-4 d-flex align-items-center gap-1"
                onClick={handleFinalSave}
              >
                <i className="fa-solid fa-floppy-disk fs-4"></i>Save
              </button>
            </div>
          </>
        ))}
    </div>
  );
};

export default React.memo(Activity);
