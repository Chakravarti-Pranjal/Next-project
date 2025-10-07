import React, { useCallback, useMemo, useRef } from "react";
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
import { quotationData } from "../../qoutation-first/quotationdata";
import { setItineraryCopyMonumentFormDataCheckbox } from "../../../../../store/actions/itineraryServiceCopyAction/itineraryServiceCopyAction";
import {
  incrementForeignEscortCharges,
  incrementLocalEscortCharges,
} from "../../../../../store/actions/createExcortLocalForeignerAction";
import moment from "moment";
import mathRoundHelper from "../../helper-methods/math.round";

const ForeignerMonument = ({ Type, checkBoxes, headerDropdown }) => {
  const { qoutationData, queryData, isItineraryEditing, localMonumentValue } =
    useSelector((data) => data?.queryReducer);
  const { AutoGuideCheck } = useSelector(
    (data) => data?.ItineraryServiceReducer
  );
  const monumentDataLoad = useSelector(
    (state) => state.inineraryServiceDataLoadReducer.monument
  );
  const [monumentDataLoadCount, setMonumentDataLoadCount] = useState(true);
  const dispatch = useDispatch();
  const tokenData = JSON.parse(localStorage.getItem("token"));
  const prevServiceIds = useRef([]);
  const [monumentFromValue, setMonumentFormValue] = useState([]);
  const [isCopyHotel, setIsCopyHotel] = useState(false);
  const [originalFromValue, setOriginalFormValue] = useState([]);
  const [monumentPackageList, setMonumentPackageList] = useState([]);
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
  const [isEditingMonument, setIsEditingMonument] = useState({
    index: "",
    editing: false,
  });
  const [tempMonument, setTempMonument] = useState({
    id: "",
    name: "",
  });
  const [monumentMasterList, setMonumentMasterList] = useState([]);
  const [hikePercent, setHikePercent] = useState(0);
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
  const [copyChecked, setCopyChecked] = useState(false);
  const monumentData = useSelector(
    (state) => state.itineraryServiceCopyReducer.monumentData
  );

  console.log(monumentData, "HLKJ45");
  const [copyMonumentFormValue, setCopyMonumentFormValue] = useState([]);
  const [copyMultipleMonument, setCopyMultipleMonument] = useState([]);
  const monumentCheckbox = useSelector(
    (state) => state.itineraryServiceCopyReducer.monumentCheckbox
  );

  const qoutationDataLocal = useMemo(
    () => qoutationData?.ExcortDays?.find((item) => item.Type === "Foreigner"),
    [qoutationData]
  );

  const formValueInitialization = () => {
    if (qoutationDataLocal?.Days) {
      const hasMonumentService = qoutationDataLocal?.Days.some((day) =>
        day?.DayServices?.some((service) => service.ServiceType === "Monument")
      );

      console.log(hasMonumentService, "HDKFKSDKDSKKF5526", qoutationDataLocal);

      if (hasMonumentService) {
        // setIsCopyHotel(true);
        const initialFormValue = qoutationDataLocal?.Days?.map((day) => {
          const service = day?.DayServices?.filter(
            (service) => service?.ServiceType == "Monument"
          )[0];
          const details =
            service?.ServiceDetails && service?.ServiceDetails.flat(1)[0];

          if (service?.DestinationId) {
            service.DestinationId = parseInt(service.DestinationId);
            service.ServiceId = parseInt(service.ServiceId);
          }

          return {
            id: queryData?.QueryId,
            Leasure: service?.Leasure,
            QuatationNo: qoutationData?.QuotationNumber,
            DayType: "Foreigner",
            DayNo: day.Day,
            DayUniqueId: day?.DayUniqueId,
            Destination: service?.DestinationId,
            Date: day?.Date,
            DestinationUniqueId: service?.DestinationUniqueId,
            ServiceIdMonument: [],
            Escort: 1,
            FromDay: "",
            ToDay: "",
            ServiceId: service != undefined ? service?.ServiceId : "",
            ItemFromDate: details?.TimingDetails?.ItemFromDate,
            ItemFromTime: "",
            ItemToDate: details?.TimingDetails?.ItemToDate,
            SupplierId: details?.ItemSupplierDetail
              ? details?.ItemSupplierDetail?.ItemSupplierId
              : "",
            MonumentDayType: service?.MonumentDayType,
            ItemToTime: "",
            ServiceMainType: "No",
            RateUniqueId: "",
            ItemUnitCost: {
              Adult: mathRoundHelper(details?.ItemUnitCost?.AdultCost) || 0,
              Child: mathRoundHelper(details?.ItemUnitCost?.ChildCost) || 0,
              FAdult: mathRoundHelper(details?.ItemUnitCost?.FAdultCost) || 0,
              FChild: mathRoundHelper(details?.ItemUnitCost?.FChildCost) || 0,
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
          };
        });

        const multipleMonument = qoutationDataLocal?.Days?.map((day) => {
          const service = day?.DayServices?.filter(
            (service) => service?.ServiceType == "Monument"
          )[0];
          const monument =
            service != undefined
              ? service?.ServicePackageMonument?.map((item) => {
                return {
                  id: item?.MonumentId,
                  name: item?.MonumentName,
                };
              })
              : [];

          return monument;
        });

        setMultipleMonument(multipleMonument);
        setMonumentFormValue(initialFormValue);
        setOriginalFormValue(initialFormValue);
        dispatch(setLocalMonumentFormValue(initialFormValue));
      } else {
        const monumentInitialValue = qoutationDataLocal?.Days?.map(
          (day, ind) => {
            return {
              ...itineraryMonumentInitialValue,
              id: queryData?.QueryId,
              DayType: "Foreigner",
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
            };
          }
        );

        setMonumentFormValue(monumentInitialValue);
        setOriginalFormValue(monumentInitialValue);
        dispatch(setLocalMonumentFormValue(monumentInitialValue));
      }
    }
  };

  const memoizedQuotationData = useMemo(() => qoutationData, [qoutationData]);

  useEffect(() => {
    formValueInitialization();
  }, [memoizedQuotationData]);

  const setFirstValueIntoForm = (index) => {
    const filteredMonument = monumentPackageList[index]?.filter(
      (pckg) => pckg?.id == monumentFromValue[index]?.ServiceId
    );

    const monuments = filteredMonument?.[0]?.MultipleMonument || [];
    let totalFee = 0;

    if (Array.isArray(monuments)) {
      totalFee = monuments.reduce((total, curr) => {
        const fullMonument = monumentMasterList.find((m) => m.id === curr.id);
        const fee =
          fullMonument?.RateJson?.Data?.[0]?.RateDetails?.[0]
            ?.ForeignerAdultEntFee;
        return total + (parseFloat(fee) || 0);
      }, 0);
    }

    if (
      monumentPackageList[index]?.length > 0 &&
      supplierList[index]?.length > 0
    ) {
      const program = monumentPackageList[index][0];
      const supplier = supplierList[index][0];

      const isFirstOrLast =
        index === 0 || index === monumentPackageList.length - 1;

      const firstArray = monumentPackageList[index];
      const firstElement = firstArray ? firstArray[0] : null;

      let sum = 0;
      if (
        firstElement &&
        firstElement.MultipleMonument &&
        Array.isArray(firstElement.MultipleMonument)
      ) {
        firstElement.MultipleMonument.forEach((monument) => {
          if (
            monument.RateJson &&
            Array.isArray(monument.RateJson) &&
            monument.RateJson.length > 0
          ) {
            const firstRate = monument.RateJson[0];
            const feeStr = firstRate.ForeignerAdultEntFee;
            const fee = Number(feeStr);
            if (!isNaN(fee)) {
              sum += fee;
            }
          }
        });
      }

      const firstArrays = monumentPackageList[index];
      const firstElements = firstArrays ? firstArrays[0] : null;

      let summ = 0;
      if (
        firstElements &&
        firstElements.MultipleMonument &&
        Array.isArray(firstElements.MultipleMonument)
      ) {
        firstElements.MultipleMonument.forEach((monument) => {
          if (
            monument.RateJson &&
            Array.isArray(monument.RateJson) &&
            monument.RateJson.length > 0
          ) {
            const firstRate = monument.RateJson[0];
            const feeStr = firstRate.IndianAdultEntFee;
            const fee = Number(feeStr);
            if (!isNaN(fee)) {
              summ += fee;
            }
          }
        });
      }

      let Monumentdaytime = monumentPackageList[index]?.[0]?.DayType;
      setMonumentFormValue((prevArr) => {
        const newArr = [...prevArr];
        newArr[index] = {
          ...newArr[index],
          ServiceId: isFirstOrLast ? null : program?.id || "",
          SupplierId: isFirstOrLast ? null : supplier?.id || "",
          PackageName: isFirstOrLast ? null : program?.PackageName || "",
          SupplierName: supplier?.Name || "",
          MonumentDayType: isFirstOrLast ? null : Monumentdaytime || " ",
          ItemUnitCost: {
            FAdult: isFirstOrLast ? null : sum,
            FChild: isFirstOrLast ? null : summ,
          },
        };
        return newArr;
      });

      setOriginalFormValue((prevArr) => {
        const newArr = [...prevArr];
        newArr[index] = {
          ...newArr[index],
          ServiceId: program?.id || "",
          SupplierId: supplier?.id || "",
          PackageName: program?.PackageName || "",
          SupplierName: supplier?.Name || "",
        };
        return newArr;
      });

      if (program?.id) {
        filterMonumentPackageList(program.id, index);
      }
    }
  };
  console.log(monumentFromValue, "monumentFromValue");

  useEffect(() => {
    const days = qoutationDataLocal?.Days;

    if (
      Array.isArray(days) &&
      days.every((day) => day?.DayServices?.length === 0)
    ) {
      if (
        !isItineraryEditing &&
        checkBoxes?.includes("monument") &&
        monumentFromValue.length > 0 &&
        monumentPackageList.length === days.length &&
        supplierList.length === days.length &&
        !isPackageLoaded
      ) {
        const allDataLoaded = monumentFromValue.every(
          (_, index) =>
            monumentPackageList[index]?.length > 0 &&
            supplierList[index]?.length > 0
        );

        if (allDataLoaded) {
          monumentFromValue.forEach((_, index) => {
            // setFirstValueIntoForm(index);
          });
          setIsPackageLoaded(true);
        }
      }
    }
  }, [
    isItineraryEditing,
    checkBoxes,
    // monumentFromValue,
    monumentPackageList,
    supplierList,
    qoutationDataLocal?.Days,
    isPackageLoaded,
  ]);

  // useEffect(() => {
  //   if (
  //     copyChecked &&
  //     monumentData?.MonumentForm &&
  //     monumentData?.MultipleMonument
  //   ) {
  //     // Store current form values as backup
  //     setCopyMonumentFormValue(monumentFromValue);
  //     setCopyMultipleMonument(multipleMonument);

  //     // Map monumentData.MonumentForm to include DayUniqueId from monumentFromValue
  //     const updatedAdditional = monumentData.MonumentForm?.map(
  //       (service, index) => {
  //         const main = monumentFromValue?.find(
  //           (m) => m.DayNo === service.DayNo
  //         );
  //         return {
  //           ...service,
  //           DayType: "Local",
  //           DayUniqueId: main?.DayUniqueId || service.DayUniqueId,
  //         };
  //       }
  //     );

  //     // Update state with new data
  //     setMonumentFormValue(updatedAdditional);
  //     setMultipleMonument(monumentData.MultipleMonument);
  //     dispatch(setItineraryCopyMonumentFormDataCheckbox(false));
  //   }
  // }, [
  //   // monumentData,
  //   // copyChecked,
  //   monumentFromValue,
  //   // dispatch
  // ]);

  const postDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("destinationlist");
      setDestinationList(data?.DataList);
    } catch (error) {
      console.log("error", error);
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
    } catch (error) {
      console.log("error", error);
    }
  };

  // Memoize dependencies
  const serviceIds = useMemo(
    () => monumentFromValue.map((row) => row.ServiceId),
    [monumentFromValue]
  );
  const destinations = useMemo(
    () => monumentFromValue.map((row) => row.Destination),
    [monumentFromValue]
  );
  const destinationUniqueIds = useMemo(
    () => monumentFromValue.map((row) => row.DestinationUniqueId),
    [monumentFromValue]
  );
  const dates = useMemo(
    () => monumentFromValue.map((row) => row.Date),
    [monumentFromValue]
  );

  useEffect(() => {
    monumentFromValue?.forEach((item, index) => {
      if (item?.Destination != "") {
        getSupplierList(index, item?.Destination);
      }
    });
  }, [destinations]);

  const getMonumentPackageListDependently = async (cityId, index) => {
    try {
      const { data } = await axiosOther.post("monument-package-list", {
        Destination: cityId,
        Default: "Yes",
      });

      setMonumentPackageList((prevList) => {
        const newList = [...prevList];
        newList[index] = data?.DataList || [];
        return newList;
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    monumentFromValue.forEach((row, index) => {
      getMonumentPackageListDependently(row.Destination, index);
    });
  }, [destinations]);

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

  useEffect(() => {
    dispatch(storeMonumentDayType(dayType));
  }, [dayType]);

  const removeMonument = (monumentInd, index) => {
    const filteredMonument = multipleMonument?.[index]?.filter(
      (value, ind) => ind != monumentInd
    );
    setMultipleMonument((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = filteredMonument;
      return newArr;
    });
  };

  const handleMonumentFormChange = (ind, e) => {
    const { name, value, checked } = e.target;
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
    setMonumentFormValue((prevArr) => {
      const newArr = [...prevArr];
      newArr.splice(index + 1, 0, { ...indexHotel, isCopied: true });
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
    setMonumentFormValue(filteredTable);
    setOriginalFormValue(filteredTable);
  };

  const handleFinalSave = async () => {
    const finalMonument =
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

            return {
              MonumentId: monument?.id || "",
              MonumentName: monument?.name || "Unknown",
              IAdultPrice: mathRoundHelper(rate?.IndianAdultEntFee) || "0",
              FAdultPrice: mathRoundHelper(rate?.ForeignerAdultEntFee) || "0",
            };
          })
          .filter((monument) => monument.MonumentId !== "");
      }) || [];

    const totalAdultServiceCost = monumentFromValue?.reduce((total, item) => {
      const adultCost = mathRoundHelper(item.ItemUnitCost?.FAdult) || 0;
      return total + adultCost;
    }, 0);

    const finalJson = monumentFromValue
      ?.map((row, index) => {
        return {
          ...row,
          Hike: hikePercent,
          ServiceIdMonument: finalMonument[index],
          DayType: "Foreigner",
          Include: isIncludeMonument,
          Sector: fromToDestinationList[index],
          TotalCosting: {
            ServiceAdultCost: mathRoundHelper(
              monumentRateCalculate?.Price?.Adult
            ),
            ServiceChildCost: mathRoundHelper(
              monumentRateCalculate?.Price?.Child
            ),
            AdultMarkupValue: mathRoundHelper(5),
            ChildMarkupValue: mathRoundHelper(5),
            AdultMarkupTotal: mathRoundHelper(
              monumentRateCalculate?.Markup?.Adult
            ),
            ChildMarkupTotal: mathRoundHelper(
              monumentRateCalculate?.Markup?.Adult
            ),
            TotalAdultServiceCost: mathRoundHelper(
              totalAdultServiceCost + (totalAdultServiceCost * 5) / 100
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
        // dispatch(incrementLocalEscortCharges());
        dispatch(incrementForeignEscortCharges());
        notifyHotSuccess(data?.message);
        // dispatch(setTotalMonumentPricePax(totalMonumentAmount));
        // dispatch(setQoutationResponseData(data?.data));
      }
    } catch (error) {
      if (error.response?.data?.Errors || error.response?.data?.errors) {
        const data = Object.entries(
          error.response?.data?.Errors || error.response?.data?.errors
        );
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

    setMonumentMasterList(data?.DataList);
  };

  useEffect(
    () => {
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
    },
    [
      // monumentFromValue
      //   ?.map((mon) => mon?.ItemUnitCost?.Adult + mon?.ItemUnitCost?.Child)
      //   ?.join(","),
      // monumentFromValue?.map((item) => item?.ServiceId).join(","),
    ]
  );

  useEffect(() => {
    if (!monumentDataLoad) return;
    postDataToServer();
    monumentMasterListApit();
  }, [monumentDataLoad]);

  const mergeMonumentRate = (index) => {
    const rate = rateList[index];
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
    // monumentFromValue?.map((monument) => monument?.ServiceId).join(","),
  ]);

  useEffect(() => {
    if (Type == "Main") {
      dispatch(setItineraryMonumentData(monumentFromValue));
    } else {
      dispatch(setLocalItineraryMonumentData(monumentFromValue));
    }
  }, [monumentFromValue]);

  useEffect(() => {
    if (Type == "Main") {
      dispatch(setLocalMonumentFormValue(monumentFromValue));
    } else {
      setMonumentFormValue(localMonumentValue);
    }
  }, [monumentFromValue]);

  const getMonumentRateApi = async (destination, index, date, srvcId) => {
    const monumentUID =
      monumentPackageList[index] != undefined
        ? monumentPackageList[index]?.find((pckg) => pckg?.id == srvcId)
        : "";
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
      getMonumentRateApi(
        form?.DestinationUniqueId,
        index,
        form?.Date,
        form?.ServiceId
      );
    });
  }, [
    // monumentFromValue?.map((form) => form?.Destination)?.join(","),
    // monumentFromValue?.map((form) => form?.ServiceId)?.join(","),
    monumentDataLoad,
  ]);

  useEffect(() => {
    if (!checkBoxes?.includes("monument")) {
      formValueInitialization();
    }
  }, [checkBoxes]);

  useEffect(
    () => {
      if (
        copyChecked &&
        monumentData?.MonumentForm &&
        monumentData?.MultipleMonument
      ) {
        // Store current form values as backup
        setCopyMonumentFormValue(monumentFromValue);
        setCopyMultipleMonument(multipleMonument);

        // Map monumentData.MonumentForm to include DayUniqueId from monumentFromValue
        const updatedAdditional = monumentData.MonumentForm?.map(
          (service, index) => {
            const main = monumentFromValue?.find(
              (m) => m.DayNo === service.DayNo
            );
            return {
              ...service,
              DayType: "Foreigner",
              DayUniqueId: main?.DayUniqueId || service.DayUniqueId,
            };
          }
        );

        // Update state with new data
        setMonumentFormValue(updatedAdditional);
        setMultipleMonument(monumentData.MultipleMonument);
        // dispatch(setItineraryCopyMonumentFormDataCheckbox(false));
      }
    },
    [
      // monumentData,
      // copyChecked,
      // monumentFromValue
      // dispatch,
    ]
  );

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
      newMonArr[changeMonument.index] = changeMonument.monument.map((mon) => ({
        id: mon.id,
        name: mon.name,
        RateJson: mon.RateJson || [],
      }));

      setMultipleMonument(newMonArr);
      setIsFormValue(true);
    }

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

    // Update hike percent state
    setHikePercent(value);

    // Calculate base costs from multipleMonument or monumentPackageList
    setMonumentFormValue((prevFormValue) => {
      return prevFormValue.map((item, index) => {
        // Get base costs from multipleMonument or monumentPackageList
        const monuments = multipleMonument?.[index] || [];
        let baseFAdult = 0;
        let baseAdult = 0;
        let baseChild = 0;
        let baseFChild = 0;

        if (Array.isArray(monuments)) {
          monuments.forEach((monument) => {
            const fullMonument = monumentMasterList.find(
              (m) => m.id === monument.id
            );
            if (fullMonument?.RateJson?.Data?.[0]?.RateDetails?.[0]) {
              baseFAdult =
                parseFloat(
                  fullMonument.RateJson.Data[0].RateDetails[0]
                    .ForeignerAdultEntFee
                ) || 0;
              baseAdult =
                parseFloat(
                  fullMonument.RateJson.Data[0].RateDetails[0].IndianAdultEntFee
                ) || 0;
              // Assume Child fees are half of Adult fees if not provided
              baseChild =
                parseFloat(
                  fullMonument.RateJson.Data[0].RateDetails[0].IndianChildEntFee
                ) || 0;
              baseFChild =
                parseFloat(
                  fullMonument.RateJson.Data[0].RateDetails[0]
                    .ForeignerChildEntFee
                ) || 0;
            }
          });
        }

        return {
          ...item,
          Hike: hikePercentValue,
          ItemUnitCost: {
            ...item.ItemUnitCost,
            FAdult:
              baseFAdult > 0
                ? Math.floor(baseFAdult + (baseFAdult * hikePercentValue) / 100)
                : item.ItemUnitCost.FAdult,
            Adult:
              baseAdult > 0
                ? Math.floor(baseAdult + (baseAdult * hikePercentValue) / 100)
                : item.ItemUnitCost.Adult,
            // Child: baseChild > 0 ? Math.floor(baseChild + (baseChild * hikePercentValue) / 100) : item.ItemUnitCost.Child,
            // FChild: baseFChild > 0 ? Math.floor(baseFChild + (baseFChild * hikePercentValue) / 100) : item.ItemUnitCost.FChild,
          },
        };
      });
    });
  };

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

    let totalPriceForPax =
      totalAdultCost +
      totalFAdultCost +
      totalChildCost +
      totalFChildCost +
      ((totalAdultCost + totalFAdultCost + totalChildCost + totalFChildCost) *
        5) /
      100;

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
        Adult: parseInt(totalAdultCost * 5) / 100,
        FAdult: parseInt(totalFAdultCost * 5) / 100,
        Child: parseInt(totalChildCost * 5) / 100,
        FChild: parseInt(totalFChildCost * 5) / 100,
      },
    }));
  }, [
    monumentFromValue?.map((item) => item?.ItemUnitCost?.Adult).join(","),
    monumentFromValue?.map((item) => item?.ItemUnitCost?.FAdult).join(","),
    monumentFromValue?.map((item) => item?.ItemUnitCost?.FChild).join(","),
    monumentFromValue?.map((item) => item?.ItemUnitCost?.Child).join(","),
    monumentFromValue?.map((item) => item?.ServiceId).join(","),
    hikePercent,
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
    // monumentFromValue?.map((hotel) => hotel?.Destination).join(","),
    destinationList,
  ]);

  const getTotalIndianFee = (index) => {
    if (!Array.isArray(multipleMonument[index])) return 0;

    return multipleMonument[index].reduce((total, curr) => {
      const fullMonument = monumentMasterList.find((m) => m.id === curr.id);
      const fee =
        fullMonument?.RateJson?.Data?.[0]?.RateDetails?.[0]?.IndianAdultEntFee;
      return total + (parseFloat(fee) || 0);
    }, 0);
  };

  const getTotalforFee = (index) => {
    if (!Array.isArray(multipleMonument[index])) return 0;

    return multipleMonument[index].reduce((total, curr) => {
      const fullMonument = monumentMasterList.find((m) => m.id === curr.id);
      const fee =
        fullMonument?.RateJson?.Data?.[0]?.RateDetails?.[0]
          ?.ForeignerAdultEntFee;
      return total + (parseFloat(fee) || 0);
    }, 0);
  };

  useEffect(() => {
    if (isFormValue && activeIndex !== null) {
      const copiedData = JSON.parse(JSON.stringify(monumentFromValue));

      copiedData[activeIndex].ItemUnitCost.FAdult = getTotalforFee(activeIndex);
      copiedData[activeIndex].ItemUnitCost.Adult =
        getTotalIndianFee(activeIndex);

      setMonumentFormValue(copiedData);
      setIsFormValue(false);
    }
  }, [isFormValue, activeIndex]);

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

  // Copy data from main
  const handleHotelCopy = useCallback(
    (e) => {
      const { checked } = e.target;

      // Store backup
      setCopyMonumentFormValue(monumentFromValue);
      setCopyMultipleMonument(multipleMonument);

      if (checked) {
        if (!monumentData?.MonumentForm || !monumentData?.MultipleMonument) {
          // notifyHotError('Monument data not available for copying');
          return;
        }

        try {
          const updatedAdditional = monumentData.MonumentForm.map(
            (service, index) => {
              const main = monumentFromValue?.find(
                (m) => m.DayNo === service.DayNo
              );
              return {
                ...service,
                DayType: "Foreigner",
                DayUniqueId: main?.DayUniqueId || service.DayUniqueId || "",
                QuatationNo: qoutationData?.QuotationNumber,
                id: queryData?.QueryId,
              };
            }
          );

          // Batch updates
          setCopyChecked(true);
          setMonumentFormValue(updatedAdditional);
          setMultipleMonument(monumentData.MultipleMonument);
          dispatch(setItineraryCopyMonumentFormDataCheckbox(false));
        } catch (error) {
          console.error("Error copying monument data:", error);
          notifyHotError("Failed to copy monument data");
          setCopyChecked(false);
        }
      } else {
        setCopyChecked(false);
        // setMonumentFormValue(copyMonumentFormValue);
        // setMultipleMonument(copyMultipleMonument);
        // dispatch(setItineraryCopyMonumentFormDataCheckbox(false));
      }
    },
    [
      monumentFromValue,
      multipleMonument,
      monumentData?.MonumentForm,
      monumentData?.MultipleMonument,
      qoutationData?.QuotationNumber,
      queryData?.QueryId,
      dispatch,
    ]
  );

  // Alternative: Use a flag to prevent multiple executions
  const [copyOperationComplete, setCopyOperationComplete] = useState(false);

  useEffect(() => {
    if (
      copyChecked &&
      !copyOperationComplete &&
      monumentData?.MonumentForm &&
      monumentData?.MultipleMonument
    ) {
      setCopyOperationComplete(true);
      // Any additional logic that needs to run after copy
    }

    if (!copyChecked) {
      setCopyOperationComplete(false);
    }
  }, [
    copyChecked,
    copyOperationComplete,
    monumentData?.MonumentForm,
    monumentData?.MultipleMonument,
  ]);

  return (
    <div className="row mt-3 m-0">
      <Toaster position="top-center" />
      <div
        className="col-12 px-1 py-2 d-flex justify-content-between itinerary-head-bg localEscort-head-bg"
        onClick={handleIsOpen}
      >
        <div className="d-flex gap-4 align-items-center">
          <div className="d-flex gap-2">
            <img src={monumentIcon} alt="monumentIcon" />
            <label htmlFor="" className="fs-5">
              Monument
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
                onChange={handleHotelCopy}
              />
              <label className="fontSize11px m-0 ms-1 " htmlFor="copy-hotel">
                Copy
              </label>
            </div>
          </div>
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
              checked={checkMonumentPrice === "Foreign"}
              onChange={(e) => setCheckMonumentPrice(e.target.value)}
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
              checked={checkMonumentPrice === "Indian"}
              onChange={(e) => setCheckMonumentPrice(e.target.value)}
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
              checked={checkMonumentPrice === "Both"}
              onChange={(e) => setCheckMonumentPrice(e.target.value)}
            />
            <label
              htmlFor="both_cost"
              className="mt-1"
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
      {isOpen && (
        <>
          <div className="col-12 px-0 mt-2">
            <PerfectScrollbar>
              <table className="table table-bordered itinerary-table">
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
                                onClick={() => handleHotelTableIncrement(index)}
                              >
                                <i className="la la-plus border cursor-pointer bg-success text-white rounded-pill fontSize10px padding1px"></i>
                              </span>
                              <span
                                onClick={() => handleHotelTableDecrement(index)}
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
                              {qoutationDataLocal?.Days?.map((qout, index) => {
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
                                  <option value={pckg?.id} key={pkgIndex + "k"}>
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
                            {multipleMonument?.[index]?.map(
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
                            {monumentFromValue[index]?.ServiceId != "" && (
                              <div
                                className="d-flex align-items-center position-absolute"
                                style={{ right: "0.4rem", top: "0.5rem" }}
                              >
                                <MdEdit
                                  className="fs-5 text-primary cursor-pointer"
                                  onClick={() => {
                                    setModalCentered(true);
                                    setChangeMonument({
                                      index: index,
                                      monument: multipleMonument[index],
                                      dayNo: monumentFromValue[index]?.DayNo,
                                      date: monumentFromValue[index]?.Date
                                    });
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
                                    className="formControl1"
                                    name="ItemUnitCost.FAdult"
                                    value={
                                      monumentFromValue[index].ItemUnitCost.FAdult
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
                            {mathRoundHelper(monumentRateCalculate?.Price?.Adult)}
                          </td>
                          <td>
                            {mathRoundHelper(monumentRateCalculate?.Price?.Child)}
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
                        </>
                      )}
                  </tr>
                  <tr className="costing-td">
                    <td colSpan={2}>Markup(5) %</td>
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
                                  monumentRateCalculate?.MarkupOfCost?.Adult || 0
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
                                  monumentRateCalculate?.MarkupOfCost?.Child || 0
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
                                  monumentRateCalculate?.MarkupOfCost?.FAdult || 0
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
                                  monumentRateCalculate?.MarkupOfCost?.FChild || 0
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
          <Modal className="fade quotationList" show={modalCentered}>
            <Modal.Header>
              {/* <Modal.Title>Monument</Modal.Title> */}
              {changeMonument?.dayNo
                ? changeMonument?.date
                  ? `Monument Day ${changeMonument.dayNo} - Date ${moment(changeMonument.date).format("DD-MM-YYYY")}`
                  : `Monument Day ${changeMonument.dayNo}`
                : null
              }
              <Button
                onClick={() => setModalCentered(false)}
                variant=""
                className="btn-close"
              ></Button>
            </Modal.Header>
            <Modal.Body className="py-2">
              <Row className="form-row-gap-2">
                <Col className="col-12">
                  <Row></Row>
                </Col>
                <Col className="col-12 mt-2">
                  <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                    {Array.isArray(changeMonument?.monument) && (
                      <Table
                        responsive
                        striped
                        bordered
                        className="rate-table mt-2"
                      >
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Monument</th>
                            <th>Adult (I)</th>
                            <th>Adult (F)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {monumentMasterList?.map((monument, index) => {
                            const selected = changeMonument?.monument?.find(
                              (m) => m.id === monument.id
                            );
                            const foreignerFee =
                              monument?.RateJson?.Data?.[0]?.RateDetails?.[0]
                                ?.ForeignerAdultEntFee || "-";
                            const indianFee =
                              monument?.RateJson?.Data?.[0]?.RateDetails?.[0]
                                ?.IndianAdultEntFee || "-";
                            const isChecked = !!selected;

                            const handleCheckboxChange = () => {
                              if (isChecked) {
                                const updated = changeMonument.monument.filter(
                                  (m) => m.id !== monument.id
                                );
                                setChangeMonument((prev) => ({
                                  ...prev,
                                  monument: updated,
                                }));
                              } else {
                                const selectedMonument =
                                  monumentMasterList.find(
                                    (m) => m.id === monument.id
                                  );
                                if (!selectedMonument) return;

                                const updated = [
                                  ...changeMonument.monument,
                                  {
                                    id: selectedMonument.id,
                                    name: selectedMonument.MonumentName,
                                    RateJson: selectedMonument.RateJson,
                                  },
                                ];
                                setChangeMonument((prev) => ({
                                  ...prev,
                                  monument: updated,
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
                                      className=" form-check-input "
                                    />
                                  </div>
                                </td>
                                <td>{monument.MonumentName || "N/A"}</td>
                                <td>{indianFee || "-"}</td>
                                <td>{foreignerFee || "-"}</td>
                              </tr>
                            );
                          })}
                          <tr>
                            <td className="text-center" colSpan="2">
                              Total
                            </td>
                            <td>
                              {changeMonument?.monument.reduce(
                                (total, curr) => {
                                  const fullMonument = monumentMasterList.find(
                                    (m) => m.id === curr.id
                                  );
                                  const fee =
                                    fullMonument?.RateJson?.Data?.[0]
                                      ?.RateDetails?.[0]?.IndianAdultEntFee;
                                  return total + (parseFloat(fee) || 0);
                                },
                                0
                              )}
                            </td>
                            <td>
                              {changeMonument?.monument.reduce(
                                (total, curr) => {
                                  const fullMonument = monumentMasterList.find(
                                    (m) => m.id === curr.id
                                  );
                                  const fee =
                                    fullMonument?.RateJson?.Data?.[0]
                                      ?.RateDetails?.[0]?.ForeignerAdultEntFee;
                                  return total + (parseFloat(fee) || 0);
                                },
                                0
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    )}
                  </div>
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

export default React.memo(ForeignerMonument);
