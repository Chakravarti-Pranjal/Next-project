import React, { useMemo, useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { Toaster } from "react-hot-toast";
import {
  setItineraryCopyMonumentFormData,
  setItineraryCopyMonumentFormDataCheckbox,
} from "../../../../../store/actions/itineraryServiceCopyAction/itineraryServiceCopyAction";
import moment from "moment";
import mathRoundHelper from "../../helper-methods/math.round";

const Monument = ({ Type, checkBoxes, headerDropdown, TabId }) => {
  const { queryData, isItineraryEditing, localMonumentValue } = useSelector(
    (data) => data?.queryReducer
  );
  const { AutoGuideCheck } = useSelector(
    (data) => data?.ItineraryServiceReducer
  );
  const monumentDataLoad = useSelector(
    (state) => state.inineraryServiceDataLoadReducer.monument
  );

  const { OptionQoutationData } = useSelector(
    (data) => data?.activeTabOperationReducer
  );

  // state of markupvalue
  const [markupArray, setMarkupArray] = useState({
    Markup: { Data: [] },
  });
  // console.log(markupArray, "markupArray111");
  const MonumentData = markupArray?.Markup?.Data?.find(
    (item) => item.Type === "Monument"
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
  const { monumentFormData } = useSelector((data) => data?.itineraryReducer);
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

  console.log(OptionQoutationData, "OptionQoutationData");

  const formValueInitialization = () => {
    if (OptionQoutationData?.Days && OptionQoutationData?.OptionId == TabId) {
      const hasMonumentService = OptionQoutationData?.Days.some((day) =>
        day?.DayServices?.some((service) => service.ServiceType === "Monument")
      );

      if (hasMonumentService) {
        const initialFormValue = OptionQoutationData?.Days?.map((day) => {
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
            QuatationNo: OptionQoutationData?.QuotationNumber,
            DayType: Type,
            DayNo: day.Day,
            DayUniqueId: day?.DayUniqueId,
            Destination: day?.DestinationId,
            Date: day?.Date,
            DestinationUniqueId: day?.DestinationUniqueId,
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
              Adult: mathRoundHelper(details?.ItemUnitCost?.AdultCost) || " ",
              Child: mathRoundHelper(details?.ItemUnitCost?.ChildCost) || " ",
              FAdult: mathRoundHelper(details?.ItemUnitCost?.FAdultCost) || " ",
              FChild: mathRoundHelper(details?.ItemUnitCost?.FChildCost) || "",
            },
            MonumentTime: service?.MonumentTime,
            PaxInfo: {
              Adults: OptionQoutationData?.Pax?.AdultCount,
              Child: OptionQoutationData?.Pax?.ChildCount,
              Infant: OptionQoutationData?.Pax?.Infant,
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

        const multipleMonument = OptionQoutationData?.Days?.map((day) => {
          const service = day?.DayServices?.filter(
            (service) => service?.ServiceType == "Monument"
          )[0];
          const monument =
            service != undefined
              ? service?.ServicePackageMonument?.map((item) => {
                return {
                  id: item?.MonumentId,
                  name: item?.MonumentName,
                  RateJson: item?.RateJson || [],
                };
              })
              : [];
          return monument;
        });

        console.log(multipleMonument, "multipleMonument");

        setMultipleMonument(multipleMonument);
        setMonumentFormValue(initialFormValue);
        setOriginalFormValue(initialFormValue);
        dispatch(setLocalMonumentFormValue(initialFormValue));
      } else {
        const monumentInitialValue = OptionQoutationData?.Days?.map((day) => {
          return {
            ...itineraryMonumentInitialValue,
            id: queryData?.QueryId,
            DayType: Type,
            DayNo: day.Day,
            Date: day?.Date,
            Destination: day.DestinationId || "",
            DestinationUniqueId: day?.DestinationUniqueId,
            QuatationNo: OptionQoutationData?.QuotationNumber,
            ItemFromDate: OptionQoutationData?.TourSummary?.FromDate,
            ItemToDate: OptionQoutationData?.TourSummary?.ToDate,
            DayUniqueId: day?.DayUniqueId,
            ServiceIdMonument: [],
            PaxInfo: {
              Adults: OptionQoutationData?.Pax?.AdultCount,
              Child: OptionQoutationData?.Pax?.ChildCount,
              Infant: OptionQoutationData?.Pax?.Infant,
              Escort: "",
            },
          };
        });

        console.log(monumentInitialValue, "monumentInitialValue");

        setMonumentFormValue(monumentInitialValue);
        setOriginalFormValue(monumentInitialValue);
        dispatch(setLocalMonumentFormValue(monumentInitialValue));
      }
    }
  };

  useEffect(() => {
    formValueInitialization();
  }, [OptionQoutationData, queryData?.QueryId, TabId, Type]);

  const setFirstValueIntoForm = (index) => {
    if (
      monumentPackageList[index]?.length > 0 &&
      supplierList[index]?.length > 0
    ) {
      const program = monumentPackageList[index][0];
      const supplier = supplierList[index][0];
      const isFirstOrLast =
        index === 0 || index === monumentPackageList.length - 1;

      const filteredMonument = monumentPackageList[index]?.find(
        (pckg) => pckg?.id === program?.id
      );

      let totalAdultFee = 0;
      let totalChildFee = 0;

      if (filteredMonument?.MultipleMonument) {
        totalAdultFee = filteredMonument.MultipleMonument.reduce(
          (sum, monument) => {
            const fee =
              Number(monument?.RateJson?.[0]?.ForeignerAdultEntFee) || 0;
            return sum + fee;
          },
          0
        );

        totalChildFee = filteredMonument.MultipleMonument.reduce(
          (sum, monument) => {
            const fee = Number(monument?.RateJson?.[0]?.IndianAdultEntFee) || 0;
            return sum + fee;
          },
          0
        );
      }

      setMonumentFormValue((prevArr) => {
        const newArr = [...prevArr];
        newArr[index] = {
          ...newArr[index],
          ServiceId: isFirstOrLast ? null : program?.id || "",
          SupplierId: isFirstOrLast ? null : supplier?.id || "",
          PackageName: isFirstOrLast ? null : program?.PackageName || "",
          SupplierName: supplier?.Name || "",
          MonumentDayType: isFirstOrLast
            ? null
            : filteredMonument?.DayType || "",
          ItemUnitCost: {
            ...newArr[index].ItemUnitCost,
            FAdult: isFirstOrLast ? "" : totalAdultFee,
            Adult: isFirstOrLast ? "" : totalChildFee,
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
          ItemUnitCost: {
            ...newArr[index].ItemUnitCost,
            FAdult: mathRoundHelper(totalAdultFee),
            Adult: mathRoundHelper(totalChildFee),
          },
        };
        return newArr;
      });
    }
  };

  useEffect(() => {
    const days = OptionQoutationData?.Days;
    if (
      Array.isArray(days) &&
      days.every((day) => day?.DayServices?.length === 0) &&
      !isItineraryEditing &&
      checkBoxes?.includes("monument") &&
      monumentFromValue.length > 0 &&
      supplierList.length === days.length &&
      !isPackageLoaded
    ) {
      const allDataLoaded = monumentFromValue.every(
        (_, index) => supplierList[index]?.length > 0
      );

      if (allDataLoaded) {
        monumentFromValue.forEach((_, index) => {
          setFirstValueIntoForm(index); // Call to set the first supplier
        });
        setIsPackageLoaded(true);
      }
    }
  }, [supplierList, monumentFromValue]);

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

  useEffect(() => {
    monumentFromValue?.forEach((item, index) => {
      console.log(item.Destination, "Destination");
      if (item?.Destination) {
        getSupplierList(index, item?.Destination);
      }
    });
  }, [
    monumentFromValue,
    monumentFromValue?.forEach((item) => item?.Destination),
  ]);

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
      if (row.Destination) {
        getMonumentPackageListDependently(row.Destination, index);
      }
    });
  }, [monumentFromValue]);

  const filterMonumentPackageList = (packageId, index) => {
    const filteredMonument = monumentPackageList[index]?.find(
      (pckg) => pckg?.id == packageId
    );
    const newDayType = filteredMonument?.DayType || "";
    const monuments = filteredMonument?.MultipleMonument || [];

    let totalAdultFee = 0;
    let totalChildFee = 0;

    if (Array.isArray(monuments)) {
      totalAdultFee = monuments.reduce((sum, monument) => {
        const fee = Number(monument?.RateJson?.[0]?.ForeignerAdultEntFee) || 0;
        return sum + fee;
      }, 0);

      totalChildFee = monuments.reduce((sum, monument) => {
        const fee = Number(monument?.RateJson?.[0]?.IndianAdultEntFee) || 0;
        return sum + fee;
      }, 0);
    }

    setDayType((prevData) => {
      const newData = [...prevData];
      newData[index] = newDayType;
      return newData;
    });

    setMultipleMonument((prevList) => {
      const newList = [...prevList];
      newList[index] = monuments;
      return newList;
    });

    setMonumentFormValue((prevArr) => {
      const newArr = [...prevArr];
      if (newArr[index]?.ServiceId === packageId) {
        newArr[index] = {
          ...newArr[index],
          MonumentDayType: newDayType,
          DayType: newDayType,
          ItemUnitCost: {
            ...newArr[index].ItemUnitCost,
            FAdult: totalAdultFee || "",
            Adult: totalChildFee || "",
          },
        };
      }
      return newArr;
    });
  };

  useEffect(() => {
    const changedServiceIds = monumentFromValue.reduce((acc, row, index) => {
      if (row.ServiceId && row.ServiceId !== prevServiceIds.current[index]) {
        acc.push({ index, serviceId: row.ServiceId });
      }
      return acc;
    }, []);

    changedServiceIds.forEach(({ index, serviceId }) => {
      filterMonumentPackageList(serviceId, index);
    });

    prevServiceIds.current = monumentFromValue.map((row) => row.ServiceId);
  }, [monumentFromValue.map((row) => row.ServiceId).join(",")]);

  // useEffect(() => {
  //   dispatch(storeMonumentDayType(dayType));
  // }, [dayType]);

  const removeMonument = (monumentInd, index) => {
    const filteredMonument = multipleMonument[index]?.filter(
      (value, ind) => ind !== monumentInd
    );
    setMultipleMonument((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = filteredMonument;
      return newArr;
    });

    // Update costs immediately after removing a monument
    const totalAdultFee = filteredMonument.reduce((sum, monument) => {
      const fee = Number(monument?.RateJson?.[0]?.ForeignerAdultEntFee) || 0;
      return sum + fee;
    }, 0);

    const totalChildFee = filteredMonument.reduce((sum, monument) => {
      const fee = Number(monument?.RateJson?.[0]?.IndianAdultEntFee) || 0;
      return sum + fee;
    }, 0);

    setMonumentFormValue((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = {
        ...newArr[index],
        ItemUnitCost: {
          ...newArr[index].ItemUnitCost,
          FAdult: totalAdultFee || "",
          Adult: totalChildFee || "",
        },
      };
      return newArr;
    });
  };

  const handleMonumentFormChange = (ind, e) => {
    const { name, value, checked } = e.target;

    if (name !== "Leasure") {
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
      (item, ind) => ind !== index
    );
    setMonumentFormValue(filteredTable);
    setOriginalFormValue(filteredTable);
  };

  const handleFinalSave = async () => {
    const finalMonument = monumentFromValue?.map((item, index) => {
      return multipleMonument[index]?.map((monument) => monument?.id) || [];
    });

    const totalAdultServiceCost = monumentFromValue?.reduce((total, item) => {
      const adultCost = mathRoundHelper(item.ItemUnitCost?.FAdult) || 0;
      return total + adultCost;
    }, 0);

    const finalJson = monumentFromValue
      ?.map((row, index) => {
        return {
          ...row,
          OptionId: TabId,
          Hike: hikePercent,
          ServiceIdMonument: finalMonument[index],
          DayType: Type,
          Include: isIncludeMonument,
          Sector: fromToDestinationList[index],
          ItemUnitCost: {
            Adult: mathRoundHelper(row?.ItemUnitCost?.Adult || " "),
            Child: mathRoundHelper(row?.ItemUnitCost?.Child || " "),
            FAdult: mathRoundHelper(row?.ItemUnitCost?.FAdult || " "),
            FChild: mathRoundHelper(row?.ItemUnitCost?.FChild || ""),
          },
          TotalCosting: {
            ServiceAdultCost: mathRoundHelper(monumentRateCalculate?.Price?.Adult),
            ServiceChildCost: mathRoundHelper(monumentRateCalculate?.Price?.Child),
            AdultMarkupValue: mathRoundHelper(5),
            ChildMarkupValue: mathRoundHelper(5),
            AdultMarkupTotal: mathRoundHelper(monumentRateCalculate?.Markup?.Adult),
            ChildMarkupTotal: mathRoundHelper(monumentRateCalculate?.Markup?.Adult),
            TotalAdultServiceCost:
              mathRoundHelper(totalAdultServiceCost +
                (totalAdultServiceCost * MonumentData?.Value) / 100),
            TotalChildServiceCost:
              mathRoundHelper(monumentRateCalculate?.Price?.Child +
                monumentRateCalculate?.Markup?.Child),
          },
        };
      })
      .filter((services) => services?.MonumentDayType !== "None");

    const totalMonumentAmount = monumentFromValue?.reduce((total, item) => {
      const adultCost = mathRoundHelper(item.ItemUnitCost?.Adult) || 0;
      const childCost = mathRoundHelper(item.ItemUnitCost?.Child) || 0;
      return total + adultCost + childCost;
    }, 0);

    try {
      const { data } = await axiosOther.post(
        "update-multiple-quatation-monument",
        finalJson
      );

      if (data?.status === 1) {
        notifyHotSuccess(data?.message);
        dispatch(setTotalMonumentPricePax(totalMonumentAmount));
        dispatch(setQoutationResponseData(data?.data));
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

  const monumentMasterListApit = async (destination = "") => {
    try {
      const { data } = await axiosOther.post("monumentmasterlist", {
        MonumentName: "",
        Destination: destination,
        id: "",
        Default: "",
      });
      setMonumentMasterList(data?.DataList || []);
    } catch (error) {
      console.log("error", error);
    }
  };

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
            Adult: mathRoundHelper(item?.AdultEntFee) || 0,
            Child: mathRoundHelper(item?.ChildEntFee) || 0,
            FAdult: mathRoundHelper(item?.AdultEntFee) || 0,
            FChild: mathRoundHelper(item?.ChildEntFee) || 0,
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
    monumentFromValue.map((monument) => monument?.ServiceId).join(","),
  ]);

  // useEffect(() => {
  //   if (Type === "Main") {
  //     dispatch(setItineraryMonumentData(monumentFromValue));
  //   } else {
  //     dispatch(setLocalItineraryMonumentData(monumentFromValue));
  //   }
  // }, [monumentFromValue, Type]);

  // useEffect(() => {
  //   if (Type === "Main") {
  //     dispatch(setLocalMonumentFormValue(monumentFromValue));
  //   } else {
  //     setMonumentFormValue(localMonumentValue);
  //   }
  // }, [localMonumentValue, Type]);

  const getMonumentRateApi = async (destination, index, date, srvcId) => {
    const monumentUID = monumentPackageList[index]?.find(
      (pckg) => pckg?.id === srvcId
    )?.UniqueID;

    try {
      const { data } = await axiosOther.post("monumentsearchlist", {
        id: "",
        MonumentUID: monumentUID || "",
        Destination: destination,
        CompanyId: tokenData?.CompanyId,
        Date: "",
        ValidFrom: OptionQoutationData?.TourSummary?.FromDate,
        ValidTo: OptionQoutationData?.TourSummary?.ToDate,
        QueryId: OptionQoutationData?.QueryId,
        QuatationNo: OptionQoutationData?.QuotationNumber,
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
      if (form?.DestinationUniqueId && form?.ServiceId) {
        getMonumentRateApi(
          form?.DestinationUniqueId,
          index,
          form?.Date,
          form?.ServiceId
        );
      }
    });
  }, [
    monumentFromValue
      .map((form) => form?.DestinationUniqueId + form?.ServiceId)
      .join(","),
    monumentDataLoad,
  ]);

  useEffect(() => {
    if (!checkBoxes?.includes("monument")) {
      formValueInitialization();
    }
  }, [checkBoxes, TabId]);

  const addTempMonument = () => {
    if (!isEditingMonument?.editing && tempMonument?.id !== "") {
      const checkIsExist = changeMonument.monument?.some(
        (mon) => mon?.id === tempMonument?.id
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
      (item, ind) => ind !== index
    );
    setChangeMonument({ ...changeMonument, monument: filteredMonument });
  };

  const monumentFinalSave = () => {
    if (
      Array.isArray(changeMonument.monument) &&
      typeof changeMonument.index === "number"
    ) {
      // Update multipleMonument
      setMultipleMonument((prevArr) => {
        const newArr = [...prevArr];
        newArr[changeMonument.index] = changeMonument.monument.map((mon) => ({
          id: mon.id,
          name: mon.name,
          RateJson: mon.RateJson || [],
        }));
        return newArr;
      });

      // Calculate and update costs immediately
      const totalAdultFee = changeMonument.monument.reduce((sum, monument) => {
        const fee = Number(monument?.RateJson?.[0]?.ForeignerAdultEntFee) || 0;
        return sum + fee;
      }, 0);

      const totalChildFee = changeMonument.monument.reduce((sum, monument) => {
        const fee = Number(monument?.RateJson?.[0]?.IndianAdultEntFee) || 0;
        return sum + fee;
      }, 0);

      // setMonumentFormValue((prevArr) => {
      //   const newArr = [...prevArr];
      //   newArr[changeMonument.index] = {
      //     ...newArr[changeMonument.index],
      //     ItemUnitCost: {
      //       ...newArr[changeMonument.index].ItemUnitCost,
      //       FAdult: totalAdultFee || "",
      //       Adult: totalChildFee || "",
      //     },
      //   };
      //   return newArr;
      // });
    }

    setTempMonument({ id: "", name: "" });
    setModalCentered(false);
    setChangeMonument({ index: "", monument: [] });
  };

  const handleTempMonumentChange = (e) => {
    const { value } = e.target;
    const filteredMonument = monumentMasterList?.find(
      (mon) => mon?.id === value
    );

    setTempMonument({
      id: filteredMonument?.id,
      name: filteredMonument?.MonumentName,
      RateJson: filteredMonument?.RateJson || [],
    });
  };

  const handlePaxChange = (index, e) => {
    const { name, value } = e.target;
    setPaxFormValue({ ...paxFormValue, [name]: value });
  };

  const handlePaxModalClick = (index) => {
    setPaxModal({ modalIndex: index, isShow: true });

    const form = monumentFromValue?.filter((form, ind) => ind === index)[0];
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

    console.log('Input value:', value, 'hikePercentValue:', hikePercentValue);
    console.log('originalFromValue:', originalFromValue);

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
        dest?.From === destinations[ind - 1]?.From
          ? { From: dest?.From, To: "" }
          : { From: dest?.From, To: destinations[ind - 1]?.From };
      return currentAndPrev;
    });

    const FromToDestination = currAndPrevDest?.map((item) => {
      const filteredFromDest = destinationList.find(
        (dests) => dests?.id === item?.From
      );
      const filteredToDest = destinationList.find(
        (dests) => dests?.id === item?.To
      );

      if (filteredToDest !== undefined) {
        return `${filteredToDest?.Name} To ${filteredFromDest?.Name}`;
      } else {
        return filteredFromDest?.Name || "";
      }
    });

    setFromToDestinationList(FromToDestination);
  }, [
    monumentFromValue.map((hotel) => hotel?.Destination).join(","),
    destinationList,
  ]);

  useEffect(() => {
    if (Type !== "Main" && isCopyHotel) {
      setMonumentFormValue(monumentFormData);
    }
  }, [monumentFormData, Type, isCopyHotel]);

  const handleHotelCopy = (e) => {
    const { checked } = e.target;
    if (checked) {
      setIsCopyHotel(true);
      setMonumentFormValue(monumentFormData);
    } else {
      setIsCopyHotel(false);
      setMonumentFormValue(localMonumentValue);
    }
  };

  const getTotalIndianFee = (index) => {
    if (!Array.isArray(multipleMonument[index])) return 0;

    return multipleMonument[index].reduce((total, curr) => {
      const fee = Number(curr?.RateJson?.[0]?.IndianAdultEntFee) || 0;
      return total + fee;
    }, 0);
  };

  const getTotalforFee = (index) => {
    if (!Array.isArray(multipleMonument[index])) return 0;

    return multipleMonument[index].reduce((total, curr) => {
      const fee = Number(curr?.RateJson?.[0]?.ForeignerAdultEntFee) || 0;
      return total + fee;
    }, 0);
  };

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
  }, [monumentFromValue, multipleMonument, monumentCheckbox]);

  useEffect(() => {
    return () => {
      dispatch(setItineraryCopyMonumentFormDataCheckbox(true));
    };
  }, []);

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
          {
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
                placeholder="0"
              />
              <span className="fs-6">%</span>
            </div>
          }
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
                  e.stopPropagation();
                  setIsOpen(true);
                }}
              />
            ) : (
              <FaChevronCircleDown
                className="text-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
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
                    {(Type === "Local" || Type === "Foreigner") && (
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
                      Leasure
                    </th>
                    <th rowSpan={3} className="py-1 align-middle">
                      Monuments Name
                    </th>
                    <th rowSpan={3} className="py-1 align-middle">
                      Supplier
                    </th>
                    <th colSpan={checkMonumentPrice === "Both" ? 4 : 2}>
                      <div className="form-check check-sm d-flex align-items-center justify-content-center gap-2">
                        <input
                          type="checkbox"
                          className="form-check-input height-em-1 width-em-1"
                          name="Breakfast"
                          value={"Yes"}
                          id="monument_include"
                          checked={isIncludeMonument === "Yes"}
                          onChange={(e) =>
                            setIsIncludeMonument(
                              e.target.checked ? "Yes" : "No"
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
                    {(checkMonumentPrice === "Indian" ||
                      checkMonumentPrice === "Both") && (
                        <th colSpan={2} className="py-1 align-middle">
                          Indian Cost
                        </th>
                      )}
                    {(checkMonumentPrice === "Foreign" ||
                      checkMonumentPrice === "Both") && (
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
                            (form) => form?.Leasure === "Yes"
                          )}
                          onChange={(e) => {
                            setMonumentFormValue((prevArr) =>
                              prevArr.map((form) => ({
                                ...form,
                                Leasure: e.target.checked ? "Yes" : "No",
                              }))
                            );
                          }}
                        />
                      </div>
                    </th>
                    {(checkMonumentPrice === "Indian" ||
                      checkMonumentPrice === "Both") && (
                        <>
                          <th className="py-1 align-middle">Adult</th>
                          <th className="py-1 align-middle">Child</th>
                        </>
                      )}
                    {(checkMonumentPrice === "Foreign" ||
                      checkMonumentPrice === "Both") && (
                        <>
                          <th className="py-1 align-middle">Adult</th>
                          <th className="py-1 align-middle">Child</th>
                        </>
                      )}
                  </tr>
                </thead>
                <tbody>
                  {monumentFromValue?.map((item, index) => (
                    <tr key={index}>
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
                      {(Type === "Local" || Type === "Foreigner") && (
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
                            onChange={(e) => handleMonumentFormChange(index, e)}
                          >
                            <option value="">Select</option>
                            {OptionQoutationData?.Days?.map((qout, index) => (
                              <option value={qout?.DestinationId} key={index}>
                                {qout?.DestinationName}
                              </option>
                            ))}
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
                            }}
                            value={monumentFromValue[index]?.ServiceId}
                          >
                            <option value="0">Select</option>
                            {monumentPackageList[index]?.map(
                              (pckg, pkgIndex) => (
                                <option value={pckg?.id} key={pkgIndex}>
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
                            onChange={(e) => handleMonumentFormChange(index, e)}
                          >
                            <option value="None">None</option>
                            <option value="EarlyMorning">Early Morning</option>
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
                              monumentFromValue[index]?.Leasure === "Yes"
                            }
                            onChange={(e) => handleMonumentFormChange(index, e)}
                          />
                        </div>
                      </td>
                      <td className="position-relative">
                        <div className="d-flex justify-content-center gap-3 flex-wrap pe-3">
                          {multipleMonument[index]?.map(
                            (item, monumentIndex) => (
                              <div
                                className="p-1 border d-inline-block"
                                key={monumentIndex}
                              >
                                <span>{item?.name || "N/A"}</span>
                                <span
                                  className=""
                                  onClick={() =>
                                    removeMonument(monumentIndex, index)
                                  }
                                >
                                  <i className="fa-solid fa-circle-xmark ms-2 cursor-pointer text-primary"></i>
                                </span>
                              </div>
                            )
                          )}
                          {monumentFromValue[index]?.ServiceId !== "" && (
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
                                    monument: multipleMonument[index] || [],
                                  });
                                  monumentMasterListApit(item?.Destination);
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </td>
                      {console.log(supplierList[index], "SUP877")}
                      <td>
                        <div>
                          <select
                            name="SupplierId"
                            id=""
                            className="formControl1"
                            value={monumentFromValue[index]?.SupplierId}
                            onChange={(e) => handleMonumentFormChange(index, e)}
                          >
                            <option value="">Select</option>
                            {supplierList[index]?.map((supp, index) => (
                              <option value={supp?.id} key={index}>
                                {supp?.Name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                      {(checkMonumentPrice === "Indian" ||
                        checkMonumentPrice === "Both") && (
                          <>
                            <td>
                              <div className="d-flex justify-content-center gap-2 flex-wrap">
                                <input
                                  type="number"
                                  className="formControl1"
                                  name="ItemUnitCost.Adult"
                                  value={
                                    monumentFromValue[index]?.ItemUnitCost?.Adult
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
                                    monumentFromValue[index]?.ItemUnitCost?.Child
                                  }
                                  onChange={(e) =>
                                    handleMonumentFormChange(index, e)
                                  }
                                />
                              </div>
                            </td>
                          </>
                        )}
                      {(checkMonumentPrice === "Foreign" ||
                        checkMonumentPrice === "Both") && (
                          <>
                            <td>
                              <div className="d-flex justify-content-center gap-2 flex-wrap">
                                <input
                                  type="number"
                                  className="formControl1"
                                  name="ItemUnitCost.FAdult"
                                  value={
                                    monumentFromValue[index]?.ItemUnitCost?.FAdult
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
                                    monumentFromValue[index]?.ItemUnitCost?.FChild
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
                  ))}
                  <tr className="costing-td">
                    <td
                      colSpan={
                        Type === "Main"
                          ? checkMonumentPrice !== "Both"
                            ? 6
                            : 6
                          : checkMonumentPrice === "Both"
                            ? 7
                            : 7
                      }
                      rowSpan={3}
                      className="text-center fs-6"
                    >
                      Total
                    </td>
                    <td>Monument Cost</td>
                    {(checkMonumentPrice === "Both" ||
                      checkMonumentPrice === "Indian") && (
                        <>
                          <td>{mathRoundHelper(monumentRateCalculate?.Price?.Adult)}</td>
                          <td>{mathRoundHelper(monumentRateCalculate?.Price?.Child)}</td>
                        </>
                      )}
                    {(checkMonumentPrice === "Both" ||
                      checkMonumentPrice === "Foreign") && (
                        <>
                          <td>{mathRoundHelper(monumentRateCalculate?.Price?.FAdult)}</td>
                          <td>{mathRoundHelper(monumentRateCalculate?.Price?.FChild)}</td>
                        </>
                      )}
                  </tr>
                  <tr className="costing-td">
                    <td>
                      Markup({MonumentData?.Value}) {MonumentData?.Markup}
                    </td>
                    {(checkMonumentPrice === "Both" ||
                      checkMonumentPrice === "Indian") && (
                        <>
                          <td>{mathRoundHelper(monumentRateCalculate?.MarkupOfCost?.Adult)}</td>
                          <td>{mathRoundHelper(monumentRateCalculate?.MarkupOfCost?.Child)}</td>
                        </>
                      )}
                    {(checkMonumentPrice === "Both" ||
                      checkMonumentPrice === "Foreign") && (
                        <>
                          <td>{mathRoundHelper(monumentRateCalculate?.MarkupOfCost?.FAdult)}</td>
                          <td>{mathRoundHelper(monumentRateCalculate?.MarkupOfCost?.FChild)}</td>
                        </>
                      )}
                  </tr>
                  <tr className="costing-td">
                    <td>Total</td>
                    {(checkMonumentPrice === "Both" ||
                      checkMonumentPrice === "Indian") && (
                        <>
                          <td>
                            {mathRoundHelper((
                              mathRoundHelper(
                                monumentRateCalculate?.Price?.Adult || 0
                              ) +
                              mathRoundHelper(
                                monumentRateCalculate?.MarkupOfCost?.Adult || 0
                              )
                            ).toFixed(2))}
                          </td>
                          <td>
                            {mathRoundHelper((
                              mathRoundHelper(
                                monumentRateCalculate?.Price?.Child || 0
                              ) +
                              mathRoundHelper(
                                monumentRateCalculate?.MarkupOfCost?.Child || 0
                              )
                            ).toFixed(2))}
                          </td>
                        </>
                      )}
                    {(checkMonumentPrice === "Both" ||
                      checkMonumentPrice === "Foreign") && (
                        <>
                          <td>
                            {mathRoundHelper((
                              mathRoundHelper(
                                monumentRateCalculate?.Price?.FAdult || 0
                              ) +
                              mathRoundHelper(
                                monumentRateCalculate?.MarkupOfCost?.FAdult || 0
                              )
                            ).toFixed(2))}
                          </td>
                          <td>
                            {mathRoundHelper((
                              mathRoundHelper(
                                monumentRateCalculate?.Price?.FChild || 0
                              ) +
                              mathRoundHelper(
                                monumentRateCalculate?.MarkupOfCost?.FChild || 0
                              )
                            ).toFixed(2))}
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
              <Modal.Title>Monument</Modal.Title>
              <Button
                onClick={() => setModalCentered(false)}
                variant=""
                className="btn-close"
              ></Button>
            </Modal.Header>
            <Modal.Body className="py-2">
              <Row className="form-row-gap-2">
                <Col className="col-12">
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
                              monument?.RateJson?.[0]?.ForeignerAdultEntFee ||
                              "-";
                            const indianFee =
                              monument?.RateJson?.[0]?.IndianAdultEntFee || "-";
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
                                    RateJson: selectedMonument.RateJson || [],
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
                                      className="form-check-input"
                                    />
                                  </div>
                                </td>
                                <td>{monument.MonumentName || "N/A"}</td>
                                <td>{indianFee}</td>
                                <td>{foreignerFee}</td>
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
                                  const fee =
                                    Number(
                                      curr?.RateJson?.[0]?.IndianAdultEntFee
                                    ) || 0;
                                  return total + fee;
                                },
                                0
                              )}
                            </td>
                            <td>
                              {changeMonument?.monument.reduce(
                                (total, curr) => {
                                  const fee =
                                    Number(
                                      curr?.RateJson?.[0]?.ForeignerAdultEntFee
                                    ) || 0;
                                  return total + fee;
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

export default React.memo(Monument);
