import React, { useContext, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { axiosOther } from "../../../../../http/axios_base_url";
import { itineraryTransportInitialValue } from "../qoutation_initial_value";
import { notifyError, notifySuccess } from "../../../../../helper/notify";
import TransportIcon from "../../../../../images/itinerary/transport.svg";
import {
  setTogglePriceState,
  setTotalTransportPricePax,
  setTransportPrice,
  setTransTypeDropDownPax,
} from "../../../../../store/actions/PriceAction";
import { setItineraryTransportData } from "../../../../../store/actions/itineraryDataAction";
import { checkPrice } from "../../../../../helper/checkPrice";
import {
  FaChevronCircleUp,
  FaChevronCircleDown,
  FaPlus,
  FaMinus,
} from "react-icons/fa";
// import {  } from "../../../../../store/actions/queryAction";
import extractTextFromHTML from "../../../../../helper/htmlParser";
import { setTransportServiceForm } from "../../../../../store/actions/ItineraryServiceAction";
import Select from "react-select";
import { useMemo } from "react";
import { transportCustomStyle } from "../../../../../css/custom_style";
import { Modal, Row, Col, Button } from "react-bootstrap";
import {
  setQoutationData,
  setQoutationResponseData,
  setTransportFinalForm,
  setQueryData,
} from "../../../../../store/actions/queryAction";
import { Assistant, Mode } from "@mui/icons-material";

import styles from "./index.module.css";
import { addQueryContext } from "../../createQuery";
import { quotationData } from "../../qoutation-first/quotationdata";
import TransportUpgrade from "./TransportUpgrade";
import {
  setItineraryUpgradeFormData,
  setItineraryUpgradeFormDataButton,
} from "../../../../../store/actions/itineraryServiceCopyAction/itinearayUpgradeAction";
import {
  setItineraryCopyTransportFormData,
  setItineraryCopyTransportFormDataCheckbox,
} from "../../../../../store/actions/itineraryServiceCopyAction/itineraryServiceCopyAction";
import moment from "moment";
import mathRoundHelper from "../../helper-methods/math.round";
import { TransfertypeValidation } from "../../query_validation";
// import { addQueryContext } from "../../createQuery/index.jsx";

const Transport = ({
  Type,
  outstation,
  headerDropdown,
  transportFormValue,
  setTransportFormValue,
}) => {
  const {
    qoutationData,
    queryData,
    isItineraryEditing,
    dayTypeArr,
    payloadQueryData,
  } = useSelector((data) => data?.queryReducer);
  // console.log(qoutationData,"qoutationData");

  // console.log(transportFormValue,"intialtransportFormValue");

  const { TourSummary } = qoutationData;
  const dispatch = useDispatch();

  const [transferTypeList, setTransferTypeList] = useState([]);
  const [transportList, setTransportList] = useState([]);
  const [transportSupplierList, setTransportSupplierList] = useState([]);
  const [destinationList, setDestinationList] = useState([]);
  const [vehicleTypeList, setVehicleTypeList] = useState([]);
  const [Assistance, setAssistance] = useState([]);
  const [baseFormattedList, setBaseFormattedList] = useState([]);
  //  const [Assistance,setAssistance]=useState("")
  const { transportFormData } = useSelector((data) => data?.itineraryReducer);
  const [rateList, setRateList] = useState([]);
  const [data, setData] = useState(false);
  const [formattedVehicleList, setFormattedVehicleList] = useState([]);
  const [isManualTransportEdit, setIsManualTransportEdit] = useState(false);
  const [headerDropdownCopy, setHeaderDropdownCopy] = useState();
  const [isIntialValue, setIsIntialValue] = useState(false);
  const [isOpen, setIsOpen] = useState({
    copy: false,
    original: false,
  });
  const [transportCopy, setTransportCopy] = useState(false);
  const { TransportService } = useSelector(
    (data) => data?.ItineraryServiceReducer
  );
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [getMonumentProgram, setGetMonumentProgram] = useState(false);
  const [selectedOptionsSecond, setSelectedOptionSecond] = useState([]);
  const [fromToDestinationList, setFromToDestinationList] = useState([]);
  const [hikePercent, setHikePercent] = useState(" ");
  const [vehicleTypeForm, setVehicleTypeForm] = useState([]);
  const [orignalVehicleTypeForm, setOriginalVehicleTypeForm] = useState([]);
  const [paxFormValue, setPaxFormValue] = useState({
    Adults: "",
    Child: "",
    Infant: "",
  });
  const [modalCentered, setModalCentered] = useState({
    modalIndex: "",
    isShow: false,
  });
  const [isAlternate, setIsAlternate] = useState(false);
  const [noOfVehicleIndex, setNoOfVehilceState] = useState("");
  const [calculatedRateDetails, setCalculatedRateDetails] = useState({});
  const [isVehicleType, setIsVehicleType] = useState({
    original: false,
    copy: false,
  });
  const [isVehicleForm, setIsVehicleForm] = useState(false);
  const [selectedInd, setSelectedInd] = useState({});
  const [isTransportListLoaded, setIsTransportListLoaded] = useState(false);
  const [isSupplierListLoaded, setIsSupplierListLoaded] = useState(false);
  const [isVehicleTypeListLoaded, setIsVehicleTypeListLoaded] = useState(false);
  const [isRateMerged, setIsRateMerged] = useState(true);
  const [isFirstValueSet, setIsFirstValueSet] = useState(false);
  // Add a ref to track TransferType changes
  const isTransferTypeChangeRef = useRef(false);
  const [dataIsLoaded, setDataIsLoaded] = useState(true);
  const [isDayServices, setIsDayServices] = useState(false);
  const [vehicleRateData, setVehicleRateData] = useState([]); // Store API response
  const [selectedVehicleTypes, setSelectedVehicleTypes] = useState([]); // Track checked vehicles
  const [assistanceData, setAssistanceData] = useState([]);
  const [isDestinationReady, setIsDestinationReady] = useState(false);
  const apiDataLoad = useSelector(
    (state) => state.inineraryServiceDataLoadReducer.transportmain
  );
  // console.log(apiDataLoad,"apiDataLoad22");
  console.log(headerDropdown.Transfer, "headerDropdown.Transfer ");

  const [markupArray, setMarkupArray] = useState({
    Markup: { Data: [] },
  });
  //console.log(markupArray,"markupArray111");
  const TransportData = markupArray?.Markup?.Data?.find(
    (item) => item.Type === "Transport"
  );
  //console.log(TransportData,"hotelData")

  const hasTransportService = qoutationData?.Days?.some((day) =>
    day?.DayServices?.some(
      (service) =>
        service.ServiceType === "Transport" &&
        service.ServiceMainType === "Guest"
    )
  );
  //console.log("hasTransportService",hasTransportService);
  //console.log("quotatattata",qoutationData?.Days);
  // console.log(Assistance,"Assistance");
  // console.log(queryData,"queryData");

  useEffect(() => {
    if (qoutationData?.Days) {
      if (hasTransportService) {
        console.log("calls this function2");

        const initialFormValue = [];
        const vehicleForms = [];
        const transportInitialValue = [];

        qoutationData?.Days?.forEach((day, ind) => {
          const transportServices = day?.DayServices?.filter(
            (service) =>
              service?.ServiceType === "Transport" &&
              service.ServiceMainType === "Guest"
          );

          const dayTravelData =
            queryData?.QueryAllData?.TravelDateInfo?.TravelData?.filter(
              (travel) => travel.DayNo === day.Day
            );

          const occurrenceIndex = qoutationData?.Days.slice(0, ind).filter(
            (d) => d.Day === day.Day
          ).length;

          const travelDataEntry =
            (dayTravelData && dayTravelData[occurrenceIndex]) ||
            dayTravelData?.[0] ||
            {};

          transportServices?.forEach((service) => {
            const { TimingDetails, ItemSupplierDetail } =
              service?.ServiceDetails?.flat?.(1)?.[0] || {};

            if (service?.TransferTypeId) {
              service.TransferTypeId = parseInt(service.TransferTypeId);
            }

            // Push to form value
            console.log(service, "service?.TransferTypeId");

            initialFormValue.push({
              id: queryData?.QueryId,
              QuatationNo: qoutationData?.QuotationNumber,
              DayType: Type,
              DayNo: day.Day,
              Date: day?.Date,
              DayUniqueId: day?.DayUniqueId,
              DestinationUniqueId: service?.DestinationUniqueId,
              FromDay: "",
              ToDay: "",
              FromDestination: service?.FromDestinationId || day?.DestinationId,
              ToDestination: service?.ToDestinationId,
              TransferType: service?.TransferTypeId,
              Mode: service?.Mode || travelDataEntry?.Mode,
              Escort: 1,
              Supplier: ItemSupplierDetail?.ItemSupplierId,
              TransportDetails: service?.TransportDetails,
              Remarks: service?.TransportDetails,
              AlternateVehicle: service?.AlternateVehicle,
              CostType: service?.CostType,
              NoOfVehicle:
                service?.NoOfVehicle !== "" ? service?.NoOfVehicle : 1,
              Cost: service?.ServicePrice || "",
              AlternateVehicle: service?.AlterVehicleId,
              AlternateVehicleCost: service?.AlternateVehicleCost,
              NoOfDay: service?.NoOfDay,
              Sector: service?.Sector,
              ServiceId: service?.ServiceId || "",
              ItemFromDate: TimingDetails?.ItemFromDate,
              ItemToDate: TimingDetails?.ItemToDate,
              ItemFromTime: TimingDetails?.ItemFromTime,
              ItemToTime: TimingDetails?.ItemToTime,
              ServiceMainType: "No",
              RateUniqueId: "",
              Assitance: service?.Assitance || "",
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
            });

            // Push vehicle data
            if (service?.VehicleType?.length) {
              vehicleForms.push(
                service.VehicleType.map((vehicle) => ({
                  id: vehicle?.VehicleTypeId,
                  Cost: vehicle?.Cost,
                  isSupplement: vehicle?.isSupplement,
                  Name: vehicle?.VehicleTypeName || vehicle.Name,
                  VehicleTypeId: vehicle?.VehicleTypeId,
                }))
              );
            } else {
              vehicleForms.push([]);
            }

            // Push transport initial template
            transportInitialValue.push({
              ...itineraryTransportInitialValue,
              id: queryData?.QueryId,
              DayType: Type,
              DayNo: day.Day,
              Date: day?.Date,
              DestinationUniqueId: day?.DestinationUniqueId,
              QuatationNo: qoutationData?.QuotationNumber,
              DayUniqueId: day?.DayUniqueId,
              FromDestination: day?.DestinationId,
              ItemFromDate: qoutationData?.TourSummary?.FromDate,
              ItemToDate: qoutationData?.TourSummary?.ToDate,

              RateUniqueId: "",
              PaxInfo: {
                Adults: qoutationData?.Pax?.AdultCount,
                Child: qoutationData?.Pax?.ChildCount,
                Infant: qoutationData?.Pax?.Infant,
                Escort: "",
              },
            });
          });
        });
        console.log("initialFormValue", initialFormValue);

        setTransportFormValue(initialFormValue);

        // format vehicle options from first group (optional)
        const formattedVehicles =
          vehicleForms?.[0]?.map((vehicle) => ({
            label: vehicle?.Name,
            value: vehicle?.VehicleTypeId,
            Cost: vehicle?.Cost,
          })) || [];

        console.log(qoutationData?.Days, "VYEIIDHDHD*77");

        setSelectedOptions(formattedVehicles);
        // console.log("formattedVehicles",formattedVehicles);
        setSelectedOptionSecond(formattedVehicles);
        setFormattedVehicleList(vehicleForms);
        setOriginalVehicleTypeForm(vehicleForms);

        dispatch(setTransportServiceForm(transportInitialValue));
        setIsDayServices(true);
      } else {
        console.log("calls this functiontrans");
        if (queryData?.QueryAllData?.TravelDateInfo?.TravelData == undefined)
          return;

        const transportInitialValue = qoutationData?.Days?.map((day, ind) => {
          console.log(
            queryData?.QueryAllData?.TravelDateInfo?.TravelData,
            "queryData?.QueryAllData?.TravelDateInfo?.TravelData"
          );

          const dayTravelData =
            queryData?.QueryAllData?.TravelDateInfo?.TravelData?.filter(
              (travel) => travel.DayNo === day.Day
            );

          console.log(dayTravelData, "dayTravelData for Day:", day.Day);

          // Calculate which occurrence of the day we are processing
          const occurrenceIndex = qoutationData?.Days.slice(0, ind).filter(
            (d) => d.Day === day.Day
          ).length;
          console.log(occurrenceIndex, "occurrenceIndex for Day:", day.Day);

          // Select the corresponding TravelData entry (or fallback to first if out of bounds)
          const travelDataEntry =
            (dayTravelData && dayTravelData[occurrenceIndex]) ||
            dayTravelData ||
            {};

          console.log(day, "day223");

          return {
            ...itineraryTransportInitialValue,
            id: queryData?.QueryId,
            DayType: Type,
            DayNo: day.Day,
            Date: day?.Date,
            DestinationUniqueId: day?.DestinationUniqueId,
            QuatationNo: qoutationData?.QuotationNumber,
            Mode: travelDataEntry?.Mode || "",
            DayUniqueId: day?.DayUniqueId,
            FromDestination: day?.DestinationId,
            ItemFromDate: qoutationData?.TourSummary?.FromDate,
            ItemToDate: qoutationData?.TourSummary?.ToDate,
            NoOfVehicle: 1,
            RateUniqueId: "",
            // Assitance:   "",
            Assitance: transportFormValue?.Assitance || "",
            PaxInfo: {
              Adults: qoutationData?.Pax?.AdultCount,
              Child: qoutationData?.Pax?.ChildCount,
              Infant: qoutationData?.Pax?.Infant,
              Infant: "",
              Escort: "",
            },
          };
        });

        setIsIntialValue(true);
        console.log("transportFormValueeee,", transportInitialValue);
        setTransportFormValue(transportInitialValue);

        dispatch(setItineraryTransportData(transportInitialValue));
        dispatch(setTransportServiceForm(transportInitialValue));
      }
    }

    // }
  }, [qoutationData, queryData?.QueryAllData?.TravelDateInfo?.TravelData]);

  useEffect(() => {
    setHeaderDropdownCopy(headerDropdown);
  }, [headerDropdown]);
  // set value into for it's first value from list
  const setFirstValueIntoForm = (index) => {
    // const programTypeId =
    //   transferTypeList.length > 0 ? transferTypeList[0]?.id : "";
    const programId =
      transportList[index] && transportList[index].length > 0
        ? transportList[index][0]?.id
        : "";
    const supplierId =
      transportSupplierList[index] && transportSupplierList[index].length > 0
        ? transportSupplierList[index][0]?.id
        : "";

    setTransportFormValue((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = {
        ...newArr[index],
        // TransferType: programTypeId,
        ServiceId: programId,
        Supplier: supplierId,
      };
      return newArr;
    });
    // setIsFirstValueSet(true);
  };

  // console.log(transportFormValue,"transportFormValue");
  // console.log(dayTypeArr,"dayTypeArr112");

  const getProgramTypeForTransport = (list) => {
    // if (!apiDataLoad) return
    // console.log("funnctioncall");

    const data = transferTypeList.length > 0 ? transferTypeList : list;
    // console.log(data,"checkdata");

    const fromDays =
      outstation
        ?.filter(
          (entry) =>
            entry?.isOutstationChanged === true &&
            entry?.From &&
            entry?.Transport !== undefined &&
            entry?.Transport !== null &&
            String(entry?.Transport).trim() !== ""
        )
        .map((entry) => parseInt(entry.From)) || [];
    const arrivalTransfer = data?.find(
      (transfer) => transfer?.Name === "Arrival Transfers"
    );
    const departureTransfer = data?.find(
      (transfer) => transfer?.Name === "Departure Transfer"
    );
    // console.log(arrivalTransfer,"arrivalTransfer");
    // console.log(departureTransfer,"departureTransfer");

    // if (!arrivalTransfer || !departureTransfer) return;
    // console.log(arrivalTransfer,departureTransfer,"departureTransfer");

    // let updatedIndex = null;
    // setTransportFormValue((prevForm) => {
    //   const newForm = prevForm.map((form, index) => {
    //     const currentDay = index + 1;
    //     if (index === 0) {
    //       return { ...form, TransferType: arrivalTransfer?.id };
    //     } else if (index === prevForm.length - 1) {
    //       return { ...form, TransferType: departureTransfer?.id };
    //     } else if (fromDays.includes(currentDay)) {
    //       updatedIndex = index; // track which index was updated
    //       return { ...form, TransferType: 6 };
    //     } else {
    //       const hasDayType =
    //         dayTypeArr[index] !== undefined && dayTypeArr[index] !== "";
    //       return { ...form, TransferType: hasDayType ? 4 : "" };
    //     }
    //   });
    //   return newForm;
    // });
    // setTimeout(() => {
    //   //console.log("updatedIndex",updatedIndex)
    //   console.log("fromDays",fromDays)
    //   if (updatedIndex !== null && fromDays !== null) {
    //     handleTransportChange(updatedIndex, "outstation");
    //   }
    // }, 0);

    let targetIndex = null;
    const dayTypeIndexes = [];

    const tempForm = transportFormValue.map((form, index) => {
      const currentDay = index + 1;

      if (index === 0) {
        return { ...form, TransferType: arrivalTransfer?.id };
      } else if (index === transportFormValue.length - 1) {
        return { ...form, TransferType: departureTransfer?.id };
      } else if (fromDays.includes(currentDay)) {
        targetIndex = index;
        return { ...form, TransferType: 6 };
      } else {
        const hasDayType =
          dayTypeArr[index] !== undefined && dayTypeArr[index] !== "";
        if (hasDayType) {
          dayTypeIndexes.push(index);
        }
        return {
          ...form,
          TransferType: hasDayType
            ? 4
            : transportFormValue[index]?.TransferType || "",
        };
      }
    });
    console.log("tempForm", tempForm);
    if (tempForm.length > 0) {
      setTransportFormValue(tempForm);
      setData(true);
    }

    if (targetIndex !== null) {
      console.log("callllll");

      handleTransportChange(targetIndex, "outstation", 6);
    }
    // dayTypeIndexes.forEach((index) => {
    //   handleTransportChange(index,"dayType",4);
    // });
  };

  const prevDayTypeArrRef = useRef(null);

  useEffect(() => {
    // console.log("dayTypeArr:", dayTypeArr);
    console.log("outstation:111", outstation);

    getProgramTypeForTransport();
  }, [JSON.stringify(dayTypeArr), JSON.stringify(outstation)]);
  console.log(outstation, "outstationchecktimes");

  // console.log("tempFormtempForm2",transportFormValue);

  // getting transfer type list data
  const postDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("transfertypemasterlist");
      setTransferTypeList(data?.DataList);

      if (!hasTransportService && data.DataList.length > 0) {
        getProgramTypeForTransport(data.DataList);
        // setData(true);
      }
    } catch (error) {
      //console.log("error",error);
    }
    try {
      const { data } = await axiosOther.post("destinationlist", {
        Status: 1,
      });
      setDestinationList(data?.DataList);
    } catch (error) {
      console.log("error", error);
    }
    try {
      const { data } = await axiosOther.post("vehicletypemasterlist", {
        // PaxType: TourSummary?.PaxTypeName,
      });

      setVehicleTypeList(data?.DataList);
      const defaultVehicleLabel = data?.DataList?.filter(
        (vehicletype) =>
          headerDropdown.Transfer && vehicletype?.id == headerDropdown.Transfer
      ).map((list) => ({
        label: list?.Name,
        value: list?.id,
      }));

      setSelectedOptions(defaultVehicleLabel);
    } catch (error) {
      console.log("error", error);
    }
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
  };

  useEffect(() => {
    // if (!apiDataLoad) return;
    postDataToServer();
  }, [headerDropdown]);
  console.log("transportFormValue", transportFormValue);

  useEffect(() => {
    // if (!apiDataLoad) return;
    const getVehicleList = async () => {
      try {
        const { data } = await axiosOther.post("vehicletypemasterlist", {
          // PaxType: TourSummary?.PaxTypeName,
        });
        console.log(data?.DataList, "data?.DataList");

        setVehicleTypeList(data?.DataList);
        const defaultVehicleLabel = data?.DataList?.filter(
          (vehicletype) =>
            headerDropdown.Transfer &&
            vehicletype?.id == headerDropdown.Transfer
        ).map((list) => ({
          label: list?.Name,
          value: list?.id,
        }));
        //  console.log(data,"datadata");

        setSelectedOptions(defaultVehicleLabel);
        // ✅ Step 1: Prepare base structure
        if (!hasTransportService) {
          const baseFormattedList = data?.DataList?.map((vehicle) => ({
            ...vehicle,
            Cost: null,
            isSupplement: "no",
          }));

          const initialFormattedList = qoutationData?.Days?.map(
            () => baseFormattedList.map((vehicle) => ({ ...vehicle })) // Deep clone each day
          );
          //console.log("initialFormattedList",initialFormattedList);
          setFormattedVehicleList(initialFormattedList);
          // setFormattedVehicleList(initialFormattedList);
        }
      } catch (error) {
        console.log("error", error);
      }
    };
    if (qoutationData?.Days?.length) {
      getVehicleList();
    }
  }, [qoutationData]);
  // getting program details text for transport table
  const getTransportPorgramDetails = async (index, id, type) => {
    if (Array.isArray(transportList[index])) {
      const details = transportList[index]?.filter((item) => item?.id == id);
      setTransportFormValue((prevArr) => {
        const newArr = [...prevArr];
        newArr[index] = {
          ...newArr[index],
          TransportDetails: details.length > 0 ? details[0]?.Detail : "",
          Remarks: details.length > 0 ? details[0]?.Detail : "",
        };
        return newArr;
      });

      setSelectedInd({ index: index, field: type, value: id });
    } else {
      setTransportFormValue((prevArr) => {
        const newArr = [...prevArr];
        newArr[index] = {
          ...newArr[index],
          TransportDetails: "",
          Remarks: "",
        };
        return newArr;
      });
    }
  };

  // useEffect(() => {
  //   transportFormValue?.forEach((item, index) => {
  //     getTransportPorgramDetails(index, item?.ServiceId);
  //   });
  // }, [transportFormValue?.map((item) => item?.ServiceId).join(",")]);

  // //getting transport master with and without dependency of transfer list
  const getTransportList = async (
    index,
    transferid,
    ToDestination,
    mode,
    FromDestination
  ) => {
    if (isTransferTypeChangeRef.current) return;
    //console.log("transLLISSSttt",index,transferid,ToDestination,mode);
    //console.log("iamreaching to list");
    // console.log(transferid,"value2");
    // console.log("getTransportList called",{ index,transferid,ToDestination,mode });
    console.log(
      "getTransportList called",
      index,
      transferid,
      ToDestination,
      mode,
      FromDestination
    );

    try {
      const DestinationId =
        transferid == 6 || transferid == 2
          ? [Number(FromDestination)]
          : [Number(ToDestination)];
      const { data } = await axiosOther.post("transportmasterlist", {
        DestinationId,
        Default: "Yes",
        TransferType: transferid,
        TransportType: mode,
      });

      console.log("API response for index", index, data?.DataList);

      setTransportList((prevArr) => {
        const newArr = [...prevArr];
        newArr[index] = transferid !== "" ? data?.DataList || [] : [];
        return newArr;
      });
      // console.log('transportList',index,transportList[index]);
      // console.log('form',originalIndex,transportFormValue[originalIndex]);
    } catch (error) {
      //console.log("Error fetching transport list:",error);
    }
  };
  // useEffect(() => {
  //   if (isDayServices && transportFormValue.length > 0) {
  //   transportFormValue?.forEach((item, index) => {
  //     console.log("transsssLIst",item, index)
  //       getTransportList(
  //         index,
  //         item?.TransferType,
  //         item?.FromDestination,
  //         item?.Mode
  //       );
  //     });
  //   }
  // }, [transportFormValue?.map((item) => item?.TransferType)?.join(",")]);
  const destination = useMemo(() => {
    return transportFormValue?.map((item) => item?.ToDestination).join(",");
  }, [transportFormValue?.map((item) => item?.ToDestination).join(",")]);

  useEffect(() => {
    if (!apiDataLoad) return;
    if (isDayServices && transportFormValue.length > 0) {
      transportFormValue?.forEach((item, index) => {
        //console.log("list602",item,index);
        // Run getTransportList for all rows
        getTransportList(
          index,
          item?.TransferType,
          item?.ToDestination,
          item?.Mode,
          item?.FromDestination
        );
        // If the row is copied, also run handleTransportChange
        if (
          item?.isCopied &&
          item?.ToDestination &&
          item?.TransferType &&
          item?.Mode
        ) {
          //console.log("isissiisCopeed",item?.isCopied);
          handleTransportChange(index, "dayType", item.TransferType);
        }
      });
    }
  }, [
    isDayServices,
    transportFormValue?.map((item) => item?.ToDestination).join(","),
    apiDataLoad,
  ]);

  // const getTransportListAndGetFirst = async (index, transferid, fromDestination, mode) => {
  //   console.log("transLLISSSttt",index, transferid, fromDestination, mode)
  //   console.log("iamreaching to list")
  //   try {
  //     const { data } = await axiosOther.post("transportmasterlist", {
  //       DestinationId: fromDestination,
  //       Default: "Yes",
  //       TransferType: transferid,
  //       TransportType: mode,
  //     });

  //     console.log("transportDataaa",data)

  //     setTransportList((prevArr) => {
  //       const newArr = [...prevArr];
  //       newArr[index] = transferid != "" ? data?.DataList : [];
  //       return newArr;
  //     });
  //     const firstProgram = data?.DataList[0];

  //     if (firstProgram) {
  //       setTransportFormValue((prev) => {
  //         const newForm = [...prev];
  //         newForm[index] = {
  //           ...newForm[index],
  //           ServiceId: firstProgram.id,
  //           TransportDetails: firstProgram.Detail || "",
  //           Remarks: firstProgram.Detail || "",
  //         };
  //         return newForm;
  //       });
  //     }
  //   } catch (error) {
  //     console.log("Error fetching transport list:", error);
  //   }
  // };
  //  useEffect(() => {
  //   // Ensure the effect runs when data is ready or transportFormValue changes
  //   if (!apiDataLoad || !data || !transportFormValue?.length) return;

  //   let isActive = true;

  //   const loadAllTransportData = async () => {
  //     const allTransportLists = [];
  //     const allSupplierLists = [];
  //     const updatedForm = [...transportFormValue];

  //     for (let index = 0; index < transportFormValue.length; index++) {
  //       const item = transportFormValue[index];

  //       // if (!item?.ToDestination || !item?.TransferType || !item?.Mode) {
  //       //   // console.log(`Skipping index ${index}: Missing ToDestination, TransferType, or Mode`);
  //       //   allTransportLists[index] = [];
  //       //   allSupplierLists[index] = [];
  //       //   continue;
  //       // }

  //       // Step 1: Get transport list
  //       try {
  //         const { data: transportData } = await axiosOther.post("transportmasterlist", {
  //           DestinationId: item.ToDestination,
  //           Default: "Yes",
  //           TransferType: item.TransferType,
  //           TransportType: item.Mode,
  //         });
  //         allTransportLists[index] = transportData?.DataList || [];
  //       } catch (error) {
  //         console.error(`Error fetching transport list for index ${index}:`, error);
  //         allTransportLists[index] = [];
  //       }

  //       try {
  //         const { data: supplierData } = await axiosOther.post("supplierlist", {
  //           Name: "",
  //           id: "",
  //           SupplierService: [4],
  //           DestinationId: [Number(item.ToDestination)],
  //         });
  //         allSupplierLists[index] = supplierData?.DataList || [];
  //       } catch (error) {
  //         console.error(`Error fetching supplier list for index ${index}:`, error);
  //         allSupplierLists[index] = [];
  //       }

  //       const programId = allTransportLists[index]?.[0]?.id || "";
  //       const supplierId = allSupplierLists[index]?.[0]?.id || "";
  //       const details = allTransportLists[index]?.find((el) => el.id === programId);
  //       // console.log();

  //       updatedForm[index] = {
  //         ...updatedForm[index],
  //         ServiceId: programId,
  //         Supplier: supplierId,
  //         TransportDetails: details?.Detail || "",
  //         Remarks: details?.Detail || "",
  //       };

  //       if (vehicleTypeList.length > 0 && programId && supplierId) {
  //         await getTransportRateApi(
  //           item.DestinationUniqueId,
  //           supplierId,
  //           index,
  //           "",
  //           allTransportLists[index]?.[0]?.UniqueId || ""
  //         );
  //       }
  //     }
  //     console.log(updatedForm,"updatedForm");

  //     if (isActive) {
  //       setTransportList(allTransportLists);
  //       setTransportSupplierList(allSupplierLists);
  //       setTransportFormValue(updatedForm);
  //     }
  //   };

  //   loadAllTransportData();

  //   return () => {
  //     isActive = false; // Cleanup to cancel outdated updates
  //   };
  // }, [
  //   data,
  //   apiDataLoad,
  //   // transportFormValue?.length, // Trigger on length change
  //   // transportFormValue?.map((item) => item?.ToDestination).join(","),
  //   // transportFormValue?.map((item) => item?.TransferType).join(","),
  //   // transportFormValue?.map((item) => item?.Mode).join(","),
  // ]);
  // console.log(transportFormValue,"transportFormValue2");
  const [isTransportDataLoading, setIsTransportDataLoading] = useState(false);
  console.log();

  // useEffect(() => {
  //   console.log("loadAllTransportData effect triggered");
  //   console.log(transportFormValue,"transportFormValue");
  // Add this ref outside the component (if not already present)
  const lastProcessedFormHashRef = useRef(null);

  // Add outstation state
  const [outstationState, setOutstationState] = useState(outstation);

  // Sync outstation prop with state
  useEffect(() => {
    setOutstationState(outstation);
  }, [outstation]);

  useEffect(() => {
    console.log("useEffect triggered, outstationState:");
    console.log(vehicleTypeList, "vehicleTypeList");

    // loadAllTransportData(outstationState);
    if (!Array.isArray(vehicleTypeList) || vehicleTypeList.length === 0) return;
    console.log("useEffect triggered, outstationState:2");
    console.log(
      vehicleTypeList,
      data,
      apiDataLoad,
      isTransferTypeChangeRef.current,
      hasTransportService,
      "!apiDataLoad || isTransferTypeChangeRef.current"
    );

    if (
      !data ||
      !apiDataLoad ||
      isTransferTypeChangeRef.current ||
      hasTransportService
    )
      return;

    const formHash = JSON.stringify(
      transportFormValue?.map((item) => ({
        ToDestination: item?.ToDestination,
        FromDestination: item?.FromDestination,
        TransferType: item?.TransferType,
        Mode: item?.Mode,
      }))
    );
    // if (lastProcessedFormHashRef.current === formHash) return;

    let isActive = true;
    setIsTransportListLoaded(false);

    const loadAllTransportData = async () => {
      const allTransportLists = [];
      const allSupplierLists = [];
      const updatedForm = [...transportFormValue];
      console.log(outstationState, "outstationState111");

      for (let index = 0; index < transportFormValue.length; index++) {
        const item = transportFormValue[index];
        const {
          FromDestination,
          ToDestination,
          TransferType,
          Mode,
          DestinationUniqueId,
          DayNo,
        } = item;

        // console.log(dayTypeArr,"dayTypeArr2");
        console.log(DestinationUniqueId, "DestinationUniqueId");

        if (!ToDestination || !TransferType || !Mode) {
          allTransportLists[index] = [];
          allSupplierLists[index] = [];
          continue;
        }

        const DestinationId =
          TransferType == 2 || TransferType == 6
            ? [Number(transportFormValue[index - 1]?.ToDestination)]
            : [Number(ToDestination)];

        try {
          const { data: transportData } = await axiosOther.post(
            "transportmasterlist",
            {
              DestinationId,
              Default: "Yes",
              TransferType: TransferType,
              TransportType: Mode,
            }
          );
          allTransportLists[index] = transportData?.DataList || [];

          // Determine the first program based on TransferType
          let firstProgram;
          if (TransferType == 6 && outstationState?.[0]?.Transport) {
            // For outstation transfers, prioritize outstationState?.[0]?.Transport
            firstProgram =
              allTransportLists[index]?.find(
                (program) => program.id == outstationState?.[0]?.Transport
              ) || allTransportLists[index]?.[0];
          } else {
            // For non-outstation transfers, use the first program from the API response
            firstProgram = allTransportLists[index]?.[0];
          }
          console.log(firstProgram, "firstProgram");

          if (firstProgram) {
            updatedForm[index] = {
              ...updatedForm[index],
              ServiceId: firstProgram.id,
              TransportDetails: firstProgram.Detail || "",
              Remarks: firstProgram.Detail || "",
            };
            // setTransportFormValue(updatedForm);
          }
        } catch (error) {
          console.error(
            `Error fetching transport list for index ${index}:`,
            error
          );
          allTransportLists[index] = [];
        }

        // Fetch supplier list
        try {
          const { data: supplierData } = await axiosOther.post("supplierlist", {
            Name: "",
            id: "",
            SupplierService: [4],
            DestinationId: [Number(ToDestination)],
          });
          allSupplierLists[index] = supplierData?.DataList || [];
          updatedForm[index] = {
            ...updatedForm[index],
            Supplier: supplierData?.DataList?.[0]?.id || "",
          };
        } catch (error) {
          console.error(
            `Error fetching supplier list for index ${index}:`,
            error
          );
          allSupplierLists[index] = [];
        }

        // Fetch transport rates if necessary
        const programId = allTransportLists[index]?.[0]?.id || "";
        const supplierId = allSupplierLists[index]?.[0]?.id || "";
        if (vehicleTypeList.length > 0 && programId && supplierId) {
          const transportUniqueId = allTransportLists[index]?.[0]?.UniqueId;
          if (transportUniqueId) {
            const { updatedList, Assistances } = await getTransportRateApi(
              ToDestination || "",
              FromDestination || "",
              TransferType || "",

              index,
              item.Date,
              transportUniqueId
            );
            updatedForm[index] = {
              ...updatedForm[index],
              Assitance:
                TransferType == 1 || TransferType == 2 ? Assistances : " ",
            };
          }
        }
      }

      if (isActive) {
        setTransportList(allTransportLists);
        setTransportSupplierList(allSupplierLists);
        setTransportFormValue(updatedForm);
      }
    };

    loadAllTransportData();

    return () => {
      isActive = false;
    };
  }, [
    JSON.stringify(
      transportFormValue?.map((item) => ({
        ToDestination: item?.ToDestination,
        // FromDestination: item?.FromDestination,
        TransferType: item?.TransferType,
        Mode: item?.Mode,
      }))
    ),

    JSON.stringify(vehicleTypeList),
    // outstationState, // Use outstationState instead of outstation
    //  dayTypeArr,
    apiDataLoad,
  ]);

  // Debounce utility function (add outside the component if not present)
  // function debounce(func, wait) {
  //   let timeout;
  //   const debounced = (...args) => {
  //     clearTimeout(timeout);
  //     timeout = setTimeout(() => func(...args), wait);
  //   };
  //   debounced.cancel = () => clearTimeout(timeout);
  //   return debounced;
  // }

  //   if (!Array.isArray(vehicleTypeList) || vehicleTypeList.length === 0) {
  //     // console.warn("vehicleTypeList is empty or not an array in loadAllTransportData, skipping getTransportRateApi calls");
  //     return;
  //   }
  //  if (
  //     !data ||
  //     !apiDataLoad ||
  //     isTransferTypeChangeRef.current ||
  //     hasTransportService ||
  //     !vehicleTypeList
  //   ) {
  //     console.log("loadAllTransportData skipped due to missing data or conditions", {
  //       data,
  //       apiDataLoad,
  //       isTransferTypeChange: isTransferTypeChangeRef.current,
  //       hasTransportService,
  //       vehicleTypeList,
  //     });
  //     return;
  //   }

  //   let isActive = true;
  //   setIsTransportListLoaded(false);
  //   console.log();

  //   const loadAllTransportData = async () => {
  //     const allTransportLists = [];
  //     const allSupplierLists = [];
  //     const updatedForm = [...transportFormValue];

  //     for (let index = 0; index < transportFormValue.length; index++) {
  //       const item = transportFormValue[index];

  //       const { FromDestination,ToDestination, TransferType, Mode, DestinationUniqueId } = item;

  //       // Skip API if critical data is missing
  //       if (!FromDestination ||!ToDestination || !TransferType || !Mode) {
  //         allTransportLists[index] = [];
  //         allSupplierLists[index] = [];
  //         continue;
  //       }
  //       console.log("Fetching transport data for index", index,FromDestination,ToDestination,TransferType,Mode );

  //       console.log(TransferType,FromDestination,ToDestination,"TransferType11");

  //       try {
  //         const DestinationId = TransferType == 6 ? [Number(FromDestination)] : [Number(ToDestination)];
  //         // console.log(DestinationId, "TransferType == 6 ? FromDestination : ToDestination");

  //         // console.log(TransferType,"TransferType111");

  //         const { data: transportData } = await axiosOther.post(
  //           "transportmasterlist",
  //           {
  //            DestinationId,
  //             Default: "Yes",
  //             TransferType: TransferType,
  //             TransportType: Mode,
  //           }
  //         );
  //         allTransportLists[index] = transportData?.DataList || [];
  //       } catch (error) {
  //         console.error(
  //           `Error fetching transport list for index ${index}:`,
  //           error
  //         );
  //         allTransportLists[index] = [];
  //       }

  //       try {
  //         const { data: supplierData } = await axiosOther.post("supplierlist", {
  //           Name: "",
  //           id: "",
  //           SupplierService: [4],
  //           DestinationId: [Number(ToDestination)],
  //         });
  //         allSupplierLists[index] = supplierData?.DataList || [];
  //         console.log(allSupplierLists, "allSupplierLists[index]");
  //       } catch (error) {
  //         console.error(
  //           `Error fetching supplier list for index ${index}:`,
  //           error
  //         );
  //         allSupplierLists[index] = [];
  //       }

  //       const programId = allTransportLists[index]?.[0]?.id || "";
  //       const details = allTransportLists[index]?.[0]?.Name || "";
  //       const Remarks = allTransportLists[index]?.[0]?.Detail || "";
  //       const supplierId = allSupplierLists[index]?.[0]?.id || "";

  //       // Fetch Assistance and vehicle rates
  //       let Assistances = " ";
  //       const transportUniqueId = allTransportLists[index]?.[0]?.UniqueId;
  //       if (transportUniqueId && supplierId) {
  //         const { updatedList, Assistances: fetchedAssistance } =
  //           await getTransportRateApi(
  //             DestinationUniqueId || "",
  //             // supplierId,
  //             index,
  //             "",
  //             transportUniqueId
  //           );
  //         Assistances = fetchedAssistance; // Use the fetched Assistance value
  //       }
  //       console.log(Assistances, "Assistances");
  //       // console.log(transportFormValue[index]?.TransferType,"");

  //       const CostType = transportFormValue[index]?.TransferType == 6 ? 1 : 2;

  //       updatedForm[index] = {
  //         ...updatedForm[index],
  //         ServiceId: programId,
  //         Supplier: supplierId,
  //         CostType: CostType,
  //         TransportDetails: details || "",
  //         Remarks: Remarks || "",
  //         Assitance: Assistances, // Set the Assistance value
  //       };
  //     }

  //     if (isActive) {
  //       setTransportList(allTransportLists);
  //       setTransportSupplierList(allSupplierLists);
  //       setTransportFormValue(updatedForm);
  //     }
  //   };

  //   loadAllTransportData();

  //   return () => {
  //     isActive = false;
  //   };
  // }, [
  //   transportFormValue?.map((item) => item?.ToDestination).join(","),
  //   transportFormValue?.map((item) => item?.FromDestination).join(","),
  //   transportFormValue?.map((item) => item?.TransferType).join(","),
  //   transportFormValue?.map((item) => item?.Mode).join(","),
  //   apiDataLoad,
  //   // vehicleTypeList?.map((item) => item?.id).join(","),
  //   // vehicleTypeList
  // ]);

  // getting supplier for transport list with and without dependently it's dependent on transport city
  const getTransportSupplierList = async (index, id, from, value) => {
    console.log(index, id, from, value, "indexid");

    try {
      const { data } = await axiosOther.post("supplierlist", {
        Name: "",
        id: "",
        SupplierService: [4],
        DestinationId: value == 6 ? [Number(id), Number(from)] : [Number(id)],
      });

      console.log(data, "GDGGD");
      const supplierList = data?.DataList || [];
      setTransportSupplierList((prevArr) => {
        const newArr = [...prevArr];
        newArr[index] = data?.DataList;
        return newArr;
      });

      const firstSupplierId = data?.DataList?.[0]?.id || "";
      setTransportFormValue((prevValue) => {
        const newArr = [...prevValue];
        newArr[index] = {
          ...newArr[index],
          Supplier: firstSupplierId,
        };

        return newArr;
      });
      return supplierList;
    } catch (error) {
      console.log("error", error);
    }
  };
  console.log();

  useEffect(() => {
    if (isManualTransportEdit) return;

    transportFormValue?.forEach((item, index) => {
      //console.log("supplLidhjdsfjdsjfdfdhfhffj725",item,index);
      if (item?.ToDestination != "") {
        console.log("this function callss");

        getTransportSupplierList(
          index,
          item?.ToDestination,
          item?.FromDestination,
          item?.TransferType
        );
      }
    });
  }, [
    transportFormValue?.map((item) => item?.ToDestination)?.join(","),
    // hasTransportService,
    // apiDataLoad,
  ]);
  // here mergint vehicle price
  const mergeTransportRateJson = (serviceInd) => {
    if (isRateMerged) {
      if (formattedVehicleList?.length > 0) {
        let updatedVehicle = formattedVehicleList?.map((form, index) => {
          const vehicleRate = rateList[index];
          return form?.map((subForm) => {
            const foundRate = vehicleRate?.find(
              (rate) => rate?.VehicleTypeId == subForm?.id
            );
            if (foundRate) {
              return {
                ...subForm,
                Cost: foundRate?.VehicleCost,
              };
            } else {
              return {
                ...subForm,
                Cost: 0,
              };
            }
          });
        });
        if (updatedVehicle?.length > 1) {
          setIsRateMerged(false);

          // setVehicleTypeForm(updatedVehicle);
          console.log(updatedVehicle, "VHHDHDHHD");
          setFormattedVehicleList(updatedVehicle);
          setOriginalVehicleTypeForm(updatedVehicle);
        }
      }
    } else {
      if (formattedVehicleList?.length > 0) {
        // let updatedVehicle = formattedVehicleList?.map((form, index) => {
        // });
        const vehicleForm = formattedVehicleList[serviceInd];
        const vehicleRate = rateList[serviceInd];

        let mergedForm = vehicleForm?.map((subForm) => {
          const foundRate = vehicleRate.find(
            (rate) => rate?.VehicleTypeId == subForm?.id
          );
          if (foundRate) {
            return {
              ...subForm,
              Cost: foundRate?.VehicleCost,
            };
          } else {
            return {
              ...subForm,
              Cost: 0,
            };
          }
        });
        if (mergedForm?.length > 1) {
          setIsRateMerged(false);
          // setVehicleTypeForm((prevForm) => {
          //   let newForm = [...prevForm];
          //   newForm[serviceInd] = mergedForm;
          //   return newForm;
          // });
          setFormattedVehicleList((prevForm) => {
            let newForm = [...prevForm];
            newForm[serviceInd] = mergedForm;
            return newForm;
          });
          setOriginalVehicleTypeForm((prevForm) => {
            let newForm = [...prevForm];
            newForm[serviceInd] = mergedForm;
            return newForm;
          });
        }
      }
    }
  };

  useEffect(() => {
    if (rateList?.length == qoutationData?.Days?.length && isRateMerged) {
      mergeTransportRateJson();
    }
  }, [
    rateList,
    transportFormValue?.map((guide) => guide?.ServiceId).join(","),
    transportFormValue?.map((guide) => guide?.ServiceId).join(","),
  ]);
  // console.log(apiDataLoad,"apiDataLoadtrans");
  // console.log(isManualTransportEdit,"isManualTransportEdit");

  const handleTransportChange = async (ind, e, val) => {
    // console.log(ind, e, val, "ind, e, val");

    let name, value;
    if (
      e === "outstation" ||
      e === "dayType" ||
      e?.target?.name === "TransferType"
    ) {
      isTransferTypeChangeRef.current = true;
    }

    if (e && e.target) {
      ({ name, value } = e.target);
      if (name === "NoOfVehicle") {
        setNoOfVehilceState(ind);
      }
      setIsManualTransportEdit(true);
      setTransportFormValue((prevValue) => {
        const newArr = [...prevValue];
        newArr[ind] = { ...prevValue[ind], [name]: value };
        return newArr;
      });
    } else if (e === "outstation" || e === "dayType") {
      name = "TransferType";
      value = val;
    } else if (e?.target?.name === "FromDestination") {
      name = "TransferType";
      value = transportFormValue[ind]?.TransferType;
    }

    if (name === "TransferType" || e === "outstation") {
      // console.log(ind, "checkind");

      const fromDestination = transportFormValue[ind]?.FromDestination;
      const ToDestination = transportFormValue[ind]?.ToDestination;
      const DestinationUniqueId = transportFormValue[ind]?.DestinationUniqueId;
      const mode = transportFormValue[ind]?.Mode;
      const DestinationId =
        value == 6 || value == 2
          ? Number(fromDestination)
          : Number(ToDestination);
      console.log(DestinationId, "DestinationId11");

      const { data } = await axiosOther.post("transportmasterlist", {
        DestinationId: DestinationId,
        Default: "Yes",
        TransferType: value,
        TransportType: mode,
      });
      const programList = data?.DataList || [];
      let firstProgram;
      if (value == 6 && outstation?.[0]?.Transport) {
        // Prioritize outstation?.[0]?.Transport for outstation transfers
        firstProgram =
          programList?.find(
            (program) => program.id == outstation?.[0]?.Transport
          ) || programList?.[0];
      } else {
        // Use the first program from the API response for non-outstation transfers
        firstProgram = programList?.[0];
      }
      console.log(firstProgram.id, "firstProgram");

      const firstProgramId = firstProgram ? firstProgram.id : "";
      await getTransportSupplierList(
        ind,
        ToDestination,
        fromDestination,
        value
      );
      const CostType = value == 6 ? 1 : 2;
      setTransportFormValue((prevValue) => {
        const newArr = [...prevValue];
        newArr[ind] = {
          ...newArr[ind],
          ServiceId: firstProgramId,
          TransportDetails: firstProgram?.Detail || "",
          Remarks: firstProgram?.Detail || "",
          CostType: CostType,
        };
        return newArr;
      });
      setTransportList((prev) => {
        const updated = [...prev];
        updated[ind] = programList;
        return updated;
      });
      setSelectedInd({ index: ind, field: name, value: firstProgramId });
    }
    const updatedForm = [...transportFormValue];

    updatedForm[ind] = {
      ...updatedForm[ind],
      [name]: value,
    };

    // // Update Sector and fromToDestinationList only when FromDestination or ToDestination changes
    if (name === "FromDestination" || name === "ToDestination") {
      const fromDestId = updatedForm[ind].FromDestination;
      const toDestId = updatedForm[ind].ToDestination;
      const fromDest =
        destinationList.find((dest) => dest.id == fromDestId)?.Name || "";
      const toDest =
        destinationList.find((dest) => dest.id == toDestId)?.Name || "";
      // Update Sector for the current row only
      updatedForm[ind].Sector =
        fromDest && toDest
          ? fromDest === toDest
            ? fromDest
            : `${fromDest} To ${toDest}`
          : "";
      // Update only that index in fromToDestinationList
      setFromToDestinationList((prev) => {
        const newList = [...prev]; // clone previous list
        newList[ind] = updatedForm[ind].Sector || ""; // update only current index
        return newList;
      });
      getTransportSupplierList(ind, toDestId);
    }
    if (name === "sector") {
      setFromToDestinationList((prev) => {
        const newList = [...prev]; // clone previous list
        newList[ind] = updatedForm[ind].Sector || ""; // update only current index
        return newList;
      });
    }

    if (name === "ServiceId") {
      console.log(ind, value, name, "this function calla");

      await getTransportPorgramDetails(ind, value, name);
    }

    setTimeout(() => {
      isTransferTypeChangeRef.current = false;
      setIsManualTransportEdit(false);
    }, 100);
  };
  const handleSectorChange = (index, e) => {
    const { value } = e.target;
    setFromToDestinationList((prev) => {
      const newList = [...prev];
      newList[index] = value; // Update Sector with user input
      return newList;
    });
  };
  console.log(fromToDestinationList, "fromToDestinationList");

  const handleTableIncrement = (index) => {
    const template = transportFormValue[index];
    const toDestId = template.ToDestination; // Get ToDestination ID from the row being copied
    const toDestName =
      destinationList.find((dest) => dest.id == toDestId)?.Name || ""; // Get ToDestination name

    // Create a new row with FromDestination set to ToDestination of the previous row
    const newRow = {
      ...template,
      isCopied: true,
      ServiceId: "",
      TransportDetails: "",
      // Mode: "",
      Supplier: "",
      Remarks: "",
      MainVehicleTypeId: "",
      FromDestination: toDestId, // Set FromDestination to ToDestination of the copied row
      // ToDestination: "", // Optionally clear ToDestination or set a default
    };

    // Update transportFormValue
    setTransportFormValue((prevArr) => {
      const newArr = [...prevArr];
      newArr.splice(index + 1, 0, newRow); // Insert after current index
      return newArr;
    });

    // Update formattedVehicleList for only index and index+1
    setFormattedVehicleList((prevVehicleList) => {
      const newVehicleList = [...prevVehicleList];
      const copiedVehicleList = prevVehicleList[index]
        ? [...prevVehicleList[index]]
        : [];
      newVehicleList.splice(index + 1, 0, copiedVehicleList);
      return newVehicleList;
    });

    // Update fromToDestinationList to set Sector to ToDestination name
    setFromToDestinationList((prevList) => {
      const newList = [...prevList];
      newList.splice(index + 1, 0, toDestName); // Set Sector to ToDestination name
      return newList;
    });
  };

  // const handleTableIncrement = (index) => {
  //   const indexHotel = transportFormValue[index];
  //   console.log("indexHotel", indexHotel);

  //   setTransportFormValue((prevArr) => {
  //     const newArr = [...prevArr];
  //     const copiedRow = {
  //       ...structuredClone(indexHotel), // Deep clone to avoid overwrites
  //       isCopied: true,
  //     };
  //     newArr.splice(index + 1, 0, copiedRow);

  //     setFormattedVehicleList((prevVehicleList) => {
  //       const newVehicleList = [...prevVehicleList];
  //       newVehicleList.splice(index + 1, 0, structuredClone(prevVehicleList[index]));
  //       return newVehicleList;
  //     });

  //     console.log("newArr", newArr);
  //     return newArr;
  //   });
  // };

  const handleTableDecrement = (index) => {
    //console.log("indexxxx925",index);

    const updatedFormValue = transportFormValue?.filter(
      (_, ind) => ind !== index
    );
    setTransportFormValue(updatedFormValue);

    // Also clean up transport list
    setTransportList((prev) => prev.filter((_, ind) => ind !== index));

    // Clean supplier list
    setTransportSupplierList((prev) => prev.filter((_, ind) => ind !== index));

    // Clean sector list if you're using one
    setFromToDestinationList((prev) => prev.filter((_, ind) => ind !== index));
  };

  const vehicleCosts = useMemo(() => {
    const costMap = {};

    formattedVehicleList?.forEach((form) => {
      const costValue = form?.Cost ? parseInt(form?.Cost, 10) || 0 : 0;
      costMap[form?.id] = (costMap[form?.id] || 0) + costValue;
    });
    //  console.log(costMap,"costMap");

    return Object.entries(costMap).map(([id, TotalCost]) => ({
      id: Number(id),
      TotalCost,
    }));
  }, [formattedVehicleList]);

  // const handleFinalSave = async () => {
  //   const vehicleTotalCost = Object.keys(calculatedRateDetails).map((key) => ({
  //     VehicleType: key,
  //     ServiceCost: calculatedRateDetails[key].totalCost.toString(),
  //     MarkupValue: calculatedRateDetails[key].markup.toString(),
  //     MarkupTotalValue: calculatedRateDetails[key].markupWithHike.toString(),
  //     TotalServiceCost:
  //       calculatedRateDetails[key].totalCostWithMarkup.toString(),
  //     AssitanceMarkupValue: 5,
  //     AssitanceServiceCost: totalAssistance,
  //     AssitanceTotalMarkupValue: markupValue,
  //     AssitanceTotalCost: grandTotal,
  //   }));

  //   const finalForm = transportFormValue?.map((form, index) => {
  //     const vehicleData = formattedVehicleList[index]?.map((vehicle) => ({
  //       VehicleTypeId: vehicle?.id, // map `id` to `VehicleTypeId`
  //       Cost: vehicle?.Cost ?? null,
  //       isSupplement: vehicle?.isSupplement ?? "no",
  //       Name: vehicle?.Name ?? "", // add Name if required
  //     }));

  //     return {
  //       ...form,
  //       ServiceMainType: "No",
  //       Hike: hikePercent,
  //       Sector: fromToDestinationList[index],
  //       VehicleType: vehicleData,
  //       DayType: Type,
  //       TotalVehicleType: vehicleTotalCost,
  //     };
  //   });
  //   const filteredFinalForm = finalForm?.filter((form) => form != null);
  //   // const totalCost =
  //   // formattedVehicleList
  //   //     .flat()
  //   //     ?.reduce((sum, item) => sum + Number(item.Cost), 0) *
  //   //   (1 + hikePercent / 100);
  //   dispatch(setTotalTransportPricePax(vehicleCosts));

  //   try {
  //     const { data } = await axiosOther.post(
  //       "updateTransportQuatation",
  //       filteredFinalForm
  //     );

  //     if (data?.status == 1) {
  //       notifySuccess("Services Added !");
  //       dispatch(setTransportPrice(calculatedRateDetails));
  //       dispatch(setQoutationResponseData(data?.data));
  //       dispatch(setTogglePriceState());
  //     }
  //   } catch (error) {
  //     if (error.response?.data?.Errors || error.response?.data?.errors) {
  //       const data = Object.entries(
  //         error.response?.data?.Errors || error.response?.data?.errors
  //       );
  //       notifyError(data[0][1]);
  //     }
  //     if (error.response?.data) {
  //       const data = Object.entries(error.response?.data);
  //       notifyError(data[0][1]);
  //     }
  //   }
  // };
  const generateFilteredFinalForm = (
    transportFormValue,
    calculatedRateDetails,
    hikePercent,
    fromToDestinationList,
    formattedVehicleList,
    Type,
    mathRoundHelper
  ) => {
    const vehicleTotalCost = Object.keys(calculatedRateDetails).map((key) => ({
      VehicleType: key,
      ServiceCost: mathRoundHelper(
        calculatedRateDetails[key].totalCost
      ).toString(),
      MarkupValue: mathRoundHelper(
        calculatedRateDetails[key].markup
      ).toString(),
      MarkupTotalValue: mathRoundHelper(
        calculatedRateDetails[key].markupWithHike
      ).toString(),
      TotalServiceCost: mathRoundHelper(
        calculatedRateDetails[key].totalCostWithMarkup
      ).toString(),
      AssitanceMarkupValue: mathRoundHelper(5),
      AssitanceServiceCost: mathRoundHelper(
        transportFormValue.reduce(
          (sum, item) => sum + (Number(item.Assitance) || 0),
          0
        )
      ),
      AssitanceTotalMarkupValue: mathRoundHelper(
        transportFormValue.reduce(
          (sum, item) => sum + (Number(item.Assitance) || 0),
          0
        ) *
          (calculatedRateDetails[key]?.markupWithHike /
            calculatedRateDetails[key]?.totalCost || 0)
      ),
      AssitanceTotalCost: mathRoundHelper(
        transportFormValue.reduce((sum, item) => {
          const totalAssistance = Number(item.Assitance) || 0;
          const markupValue =
            totalAssistance *
            (calculatedRateDetails[key]?.markupWithHike /
              calculatedRateDetails[key]?.totalCost || 0);
          return sum + totalAssistance + markupValue;
        }, 0)
      ),
    }));

    const finalForm = transportFormValue?.map((form, index) => {
      const vehicleData = formattedVehicleList[index]?.map((vehicle) => ({
        VehicleTypeId: vehicle?.id,
        Cost: mathRoundHelper(vehicle?.Cost ?? 0),
        isSupplement: vehicle?.isSupplement ?? "no",
        Name: vehicle?.Name ?? "",
      }));
      const outstationData =
        form?.TransferType == 6
          ? (() => {
              // Find the matching outstation entry for this row
              const match = outstation?.find(
                (o) =>
                  String(o.Destination) === String(form?.FromDestination) &&
                  String(o.Transport) === String(form?.ServiceId)
              );
              return match
                ? [
                    {
                      DestinationId: match.Destination,
                      FromDay: match.From,
                      ToDay: match.To,
                      TransportId: match.Transport,
                    },
                  ]
                : [
                    {
                      DestinationId: form?.FromDestination,
                      FromDay: form?.DayNo,
                      ToDay: form?.DayNo,
                      TransportId: form?.ServiceId,
                    },
                  ];
            })()
          : [];
      return {
        ...form,
        ServiceMainType: "No",
        Hike: hikePercent,
        Sector: fromToDestinationList[index],
        VehicleType: vehicleData,
        DayType: Type,
        TotalVehicleType: vehicleTotalCost,
        Outstation: outstationData,
      };
    });

    return finalForm?.filter((form) => form != null);
  };

  // Hook to automatically generate and dispatch filteredFinalForm when dependencies change

  useEffect(() => {
    if (
      // !isInitializing &&
      transportFormValue?.length > 0 &&
      formattedVehicleList?.length > 0
    ) {
      const filteredFinalForm = generateFilteredFinalForm(
        transportFormValue,
        calculatedRateDetails,
        hikePercent,
        fromToDestinationList,
        formattedVehicleList,
        Type,
        mathRoundHelper
      );
      dispatch(
        setTransportFinalForm({
          filteredFinalForm,
          calculatedRateDetails,
        })
      );
    }
  }, [
    transportFormValue,
    calculatedRateDetails,
    hikePercent,
    fromToDestinationList,
    formattedVehicleList,
    Type,
    mathRoundHelper,
    // isInitializing,
  ]);
  console.log(transportFormValue, "transportFormValue");
  console.log(outstation, "outstationcheckkk");

  const handleFinalSave = async () => {
    const vehicleTotalCost = Object.keys(calculatedRateDetails).map((key) => ({
      VehicleType: key,
      ServiceCost: mathRoundHelper(
        calculatedRateDetails[key].totalCost
      ).toString(),
      MarkupValue: mathRoundHelper(
        calculatedRateDetails[key].markup
      ).toString(),
      MarkupTotalValue: mathRoundHelper(
        calculatedRateDetails[key].markupWithHike
      ).toString(),
      TotalServiceCost: mathRoundHelper(
        calculatedRateDetails[key].totalCostWithMarkup
      ).toString(),
      AssitanceMarkupValue: mathRoundHelper(5),
      AssitanceServiceCost: mathRoundHelper(totalAssistance),
      AssitanceTotalMarkupValue: mathRoundHelper(markupValue),
      AssitanceTotalCost: mathRoundHelper(grandTotal),
    }));

    const finalForm = transportFormValue?.map((form, index) => {
      const vehicleData = formattedVehicleList[index]?.map((vehicle) => ({
        VehicleTypeId: vehicle?.id,
        Cost: mathRoundHelper(vehicle?.Cost ?? 0),
        isSupplement: vehicle?.isSupplement ?? "no",
        Name: vehicle?.Name ?? "",
      }));
      // if ()
      console.log(outstation, "outstationcheckkk");
      const outstationData =
        form?.TransferType == 6
          ? (() => {
              // Find the matching outstation entry for this row
              const match = outstation?.find(
                (o) =>
                  String(o.Destination) === String(form?.FromDestination) &&
                  String(o.Transport) === String(form?.ServiceId)
              );
              return match
                ? [
                    {
                      DestinationId: match.Destination,
                      FromDay: match.From,
                      ToDay: match.To,
                      TransportId: match.Transport,
                    },
                  ]
                : [
                    {
                      DestinationId: form?.FromDestination,
                      FromDay: form?.DayNo,
                      ToDay: form?.DayNo,
                      TransportId: form?.ServiceId,
                    },
                  ];
            })()
          : [];

      return {
        ...form,
        ServiceMainType: "No",
        Hike: hikePercent,
        Sector: fromToDestinationList[index],
        VehicleType: vehicleData,
        DayType: Type,
        TotalVehicleType: vehicleTotalCost,
        Outstation: outstationData,
      };
    });
    const filteredFinalForm = finalForm?.filter((form) => form != null);

    dispatch(setTotalTransportPricePax(vehicleCosts)); // this can also be rounded if needed

    try {
      await TransfertypeValidation.validate(filteredFinalForm, {
        abortEarly: false,
      });

      // console.log(...filteredFinalJson,"filteredFinalJson");

      const { data } = await axiosOther.post(
        "updateTransportQuatation",
        filteredFinalForm
      );

      if (data?.status == 1) {
        notifySuccess("Services Added !");
        dispatch(setTransportPrice(calculatedRateDetails));
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
  };

  useEffect(() => {
    const costArr = transportFormValue?.map((transport) => {
      if (transport?.ServiceId != "") {
        // Check if Cost is empty, null or undefined and return 0
        const cost =
          transport?.Cost === null ||
          transport?.Cost === undefined ||
          transport?.Cost === ""
            ? 0
            : parseFloat(transport?.Cost);

        // Check NoOfVehicle and NoOfDay, return default values if they are invalid
        const vehicleNo =
          transport?.NoOfVehicle === null ||
          transport?.NoOfVehicle === undefined ||
          transport?.NoOfVehicle === ""
            ? 1
            : parseInt(transport?.NoOfVehicle, 10);
        const dayNo =
          transport?.NoOfDay === null ||
          transport?.NoOfDay === undefined ||
          transport?.NoOfDay === ""
            ? 1
            : parseInt(transport?.NoOfDay, 10);
        // Multiply the valid values and return the cost
        return cost * vehicleNo * dayNo;
      } else {
        return 0;
      }
    });
    // Sum up all the costs to get the total transport rate
  }, [
    transportFormValue
      ?.map(
        (transport) =>
          transport?.Cost + transport?.NoOfVehicle + transport?.NoOfDay
      )
      ?.join(","),
    transportFormValue?.map((transport) => transport?.ServiceId).join(","),
  ]); // Depend directly on transportFormValue

  // storing guide form into redux store
  // useEffect(() => {
  //   //console.log("entering itenary dispatch")
  //   if (Type == "Main") {
  //     dispatch(setItineraryTransportData(transportFormValue))
  //   }
  //   //console.log("ending itenary dispatch")
  // }, [transportFormValue]);

  // function settigCopyFormData(transportForm,passedForm) {
  //   if (passedForm?.length > 0) {
  //     setTransportFormValue(passedForm);
  //   } else {
  //     setTransportFormValue(transportForm);
  //   }
  // }

  // useEffect(() => {
  //   if (Type != "Main" && transportFormData?.length > 0) {
  //     settigCopyFormData(transportFormValue,transportFormData);
  //   }
  // },[Type,transportFormData]);

  const isDataReady =
    transportList.length > 0 &&
    transportSupplierList.length > 0 &&
    vehicleTypeList.length > 0 &&
    transportFormValue.length > 0;

  useEffect(() => {
    // if (!apiDataLoad) return
    const { index, field, value } = selectedInd;
    if (index === undefined || !field) return;

    const form = transportFormValue[index];
    //console.log(form,"form22");

    // const currentServiceId = hotelForm?.ServiceId;
    // const selectedHotel = hotelList[index]?.find(
    //   (hotel) => hotel?.id == currentServiceId
    // );
    if (!form) return;
    const supplierUid =
      transportSupplierList[index] != undefined &&
      transportSupplierList[index]?.find((supp) => supp?.id == form?.Supplier);

    const transUID =
      field == "ServiceId"
        ? transportList[index] && transportList[index].length > 0
          ? transportList[index].find((transport) => transport?.id == value)
          : ""
        : transportList[index] && transportList[index].length > 0
        ? transportList[index].find(
            (transport) => transport?.id == form.ServiceId
          )
        : "";

    getTransportRateApi(
      form?.ToDestination,
      form?.FromDestination,
      form?.TransferType,
      // supplierUid?.UniqueID ?? "", // get the actual unique ID
      index,
      form?.Date,
      transUID?.UniqueId ?? ""
    );
  }, [selectedInd]);
  // console.log(selectedInd,"selectedInd");

  // getting rate data form api

  const getTransportRateApi = async (
    ToDestination,
    FromDestination,
    TransferType,
    index,
    date,
    serviceId
  ) => {
    const storedData = localStorage.getItem("token");
    const parsedData = JSON.parse(storedData);
    const companyId = parsedData?.CompanyUniqueId;

    const baseFormattedList = vehicleTypeList.map((v) => ({
      id: v.id,
      Name: v.Name,
      Cost: null,
      isSupplement: "no",
    }));
    console.log(baseFormattedList, vehicleTypeList, "checkvechlist");

    if (serviceId && ToDestination && companyId) {
      try {
        const DestinationId =
          TransferType == 6 || TransferType == 2
            ? [Number(FromDestination)]
            : [Number(ToDestination)];
        const unqiueid = destinationList?.find(
          (item) => item?.id == DestinationId
        )?.UniqueID;
        console.log(destinationList, "destinationList");
        const { data } = await axiosOther.post("transportsearchlist", {
          id: "",
          TransportUID: serviceId,
          Destination: unqiueid,
          SupplierUID: "",
          CurrencyId: "",
          CompanyId: companyId,
          Date: "",
          Year: queryData.QueryAllData.TravelDateInfo.SeasonYear,
          ValidFrom: queryData.QueryAllData.TravelDateInfo.FromDate,
          ValidTo: queryData.QueryAllData.TravelDateInfo.ToDate,
          QueryId: queryData?.QueryId ? queryData?.QueryId : "",
          QuatationNo: qoutationData?.QuotationNumber,
        });

        let updatedList = baseFormattedList;
        let Assistance = "0";
        console.log(data, "dataaa");

        if (data?.Status === 1 && data?.Data?.length > 0) {
          updatedList = baseFormattedList.map((v) => {
            const matchedItem = data.Data.find((item) =>
              item?.RateJson?.VehicleType?.some(
                (vt) => vt?.VehicleTypeId === v.id
              )
            );
            console.log(matchedItem, "matchedItem");

            const matchedVehicle = matchedItem?.RateJson?.VehicleType?.find(
              (vt) => vt?.VehicleTypeId === v.id
            );

            return {
              ...v,
              Cost: mathRoundHelper(matchedVehicle?.GrandTotal) || null,
              isSupplement: matchedItem ? "yes" : "no",
            };
          });
          Assistance =
            data?.Data[0]?.RateJson?.VehicleType?.[0]?.Assistance?.toString() ||
            "0";
        }
        console.log(updatedList, "updatedList");

        setFormattedVehicleList((prev) => {
          const newArr = [...prev];
          newArr[index] = updatedList;
          return newArr;
        });

        setOriginalVehicleTypeForm((prev) => {
          const newArr = [...prev];
          newArr[index] = updatedList;
          return newArr;
        });
        const tType = transportFormValue[index]?.TransferType;
        const Assistances = tType == 1 || tType == 2 ? Assistance : " ";

        setTransportFormValue((prevArr) => {
          const newArr = [...prevArr];
          newArr[index] = {
            ...newArr[index],
            Assitance: Assistances,
          };
          return newArr;
        });

        return { updatedList, Assistances };
      } catch (error) {
        console.error("Error in getTransportRateApi:", error);
        setFormattedVehicleList((prev) => {
          const newArr = [...prev];
          newArr[index] = baseFormattedList;
          return newArr;
        });
        setOriginalVehicleTypeForm((prev) => {
          const newArr = [...prev];
          newArr[index] = baseFormattedList;
          return newArr;
        });
        return { updatedList: baseFormattedList, Assistance: "0" };
      }
    }

    // Fallback if required parameters are missing
    setFormattedVehicleList((prev) => {
      const newArr = [...prev];
      newArr[index] = baseFormattedList;
      return newArr;
    });
    setOriginalVehicleTypeForm((prev) => {
      const newArr = [...prev];
      newArr[index] = baseFormattedList;
      return newArr;
    });
    return { updatedList: baseFormattedList, Assistance: "0" };
  };

  // console.log(formattedVehicleList,"formattedVehicleList2");
  // console.log(transportFormValue,"Assistance21");

  // Usage example: Call this function when a button is clicked for a specific row
  <button onClick={() => updateAssistance(0)}>Set Assistance for Day 1</button>;

  const handleChange = (selected) => {
    setSelectedOptions(selected);
  };

  useEffect(() => {
    const startIndex = transportFormValue?.findIndex(
      (item) => item?.isCopied === true
    );
    if (startIndex === -1) return; // No copied row, do nothing

    const item = transportFormValue[startIndex];

    // Only process the row at startIndex
    if (item?.ToDestination && item?.TransferType && item?.Mode) {
      console.log(
        startIndex,
        "dayType",
        item.TransferType,
        "startIndex, item.TransferType"
      );

      handleTransportChange(startIndex, "dayType", item.TransferType);
    }
  }, [transportFormValue?.map((item) => item?.TransferType)?.join(",")]);

  useEffect(() => {
    console.log("this functioncalls");

    if (
      isManualTransportEdit ||
      transportFormValue?.some((item) => item?.isCopied)
    ) {
      return;
    }
    // console.log("functioncalls");
    const hasTransportService = qoutationData?.Days?.some((day) =>
      day?.DayServices?.some(
        (service) =>
          service.ServiceType === "Transport" &&
          service.ServiceMainType === "Guest"
      )
    );
    // if (!destinationList) return;
    if (hasTransportService) {
      console.log("this function calls");
      const days = qoutationData?.Days || [];
      console.log(days, "days111");

      const updatedArr = transportFormValue?.map((item, index, arr) => {
        console.log(
          "iteememmmwmemwm",
          item?.FromDestination,
          item?.ToDestination,
          index
        );
        const isCopied = item?.isCopied;
        //console.log("isCopied",isCopied);

        // Copied rows — From = To = original ToDestination
        if (isCopied) {
          return {
            ...item,
            FromDestination: item?.ToDestination,
            ToDestination: item?.ToDestination,
          };
        }

        // Use corresponding DestinationId only if within range
        //console.log("quoDayasss",days);

        const destination =
          item?.ToDestination || days[index]?.DestinationId || "";
        //console.log("destination",destination);

        // Last item (may be out of days[] range)

        return {
          ...item,
          FromDestination: item?.FromDestination || "",
          ToDestination: item?.ToDestination,
        };
      });

      // Destination display list (for sectors)
      // const destinations = updatedArr?.map((transport, index) => {
      //   const fromName =
      //     destinationList.find((d) => d?.id == transport?.FromDestination)
      //       ?.Name || "";
      //   const toName =
      //     destinationList.find((d) => d?.id == transport?.ToDestination)
      //       ?.Name || "";

      //   if (index === 0) {
      //     return {
      //       From: transport?.FromDestination,
      //       To: transport?.FromDestination,
      //       Sector: `Arrival at ${fromName}`,
      //     };
      //   } else if (index === updatedArr.length - 1) {
      //     return {
      //       From: transport?.FromDestination,
      //       To: transport?.ToDestination,
      //       Sector: `Departure from ${toName}`,
      //     };
      //   } else {
      //     return {
      //       From: transport?.FromDestination,
      //       To: transport?.ToDestination,
      //       Sector: fromName === toName ? fromName : `${fromName} To ${toName}`,
      //     };
      //   }
      // });
      // console.log("this function calls1");
      // console.log(updatedArr?.Sector, "updatedArr");
      if (updatedArr.length > 0) {
        setTransportFormValue(updatedArr);
        setFromToDestinationList(
          transportFormValue?.map((d) => d.Sector || "")
        );
      }
    } else {
      console.log("this function calls2");
      if (!transportFormValue || !transportFormValue.length) {
        // console.log("transportFormValue is empty or undefined");
        return;
      }

      // Guard clause for destinationList
      if (!destinationList || !destinationList.length) {
        // console.log("destinationList is empty or undefined");
        return;
      }

      const days = qoutationData?.Days || [];

      const updatedArr = transportFormValue?.map((item, index, arr) => {
        //console.log("iteememmmwmemwm",item,index,arr);
        const isCopied = item?.isCopied;
        //console.log("isCopied",isCopied);

        // Copied rows — From = To = original ToDestination
        // if (isCopied) {
        //   return {
        //     ...item,
        //     FromDestination: item?.ToDestination,
        //     ToDestination: item?.ToDestination,
        //   };
        // }

        // Use corresponding DestinationId only if within range
        //console.log("quoDayasss",days);
        const destination =
          item?.ToDestination || days[index]?.DestinationId || "";
        //console.log("destination",destination);

        // First item
        if (index === 0) {
          return {
            ...item,
            FromDestination: destination,
            ToDestination: item?.FromDestination || "",
          };
        }

        // Middle items (normal)
        if (index < arr.length - 1 && index < days.length) {
          //console.log("indexxxxxx",index);
          return {
            ...item,
            FromDestination:
              arr[index - 1]?.ToDestination ||
              days[index - 1]?.DestinationId ||
              "",
            ToDestination: destination,
          };
        }

        // Last item (may be out of days[] range)
        return {
          ...item,
          FromDestination:
            arr[index - 1]?.ToDestination ||
            days[index - 1]?.DestinationId ||
            "",
          ToDestination: destination,
        };
      });

      // Destination display list (for sectors)
      const destinations = updatedArr?.map((transport, index) => {
        const fromName =
          destinationList.find((d) => d?.id == transport?.FromDestination)
            ?.Name || "";
        const toName =
          destinationList.find((d) => d?.id == transport?.ToDestination)
            ?.Name || "";

        if (index === 0) {
          return {
            From: transport?.FromDestination,
            To: transport?.FromDestination,
            Sector: `Arrival at ${fromName}`,
          };
        } else if (index === updatedArr.length - 1) {
          return {
            From: transport?.FromDestination,
            To: transport?.ToDestination,
            Sector: fromName === toName ? fromName : `${fromName} To ${toName}`,
          };
        } else {
          return {
            From: transport?.FromDestination,
            To: transport?.ToDestination,
            Sector: fromName === toName ? fromName : `${fromName} To ${toName}`,
          };
        }
      });
      if (updatedArr.length > 0) {
        console.log("updatedArr before set:", updatedArr);
        setTransportFormValue(updatedArr);
        setFromToDestinationList(destinations.map((d) => d.Sector || ""));
      } else {
        // console.log("updatedArr is empty, skipping state update");
      }
    }
    //console.log("updatedArr",updatedArr);

    // setIsDestinationReady(true);
    // const anyCopied = updatedArr?.some((item) => item?.isCopied);

    // if (anyCopied) {
    //   updatedArr.forEach((item, index) => {
    //     getTransportList(index, item.TransferType, item.FromDestination, item.Mode);
    //   });
    // }
  }, [
    // transportFormValue?.map((item) => item?.FromDestination).join(","),
    destinationList,
    qoutationData?.Days,

    //  qoutationData?.Days.map((item) => item?.DestinationId),
    // isManualTransportEdit,
  ]);

  const vehicleTypeLabel = vehicleTypeList?.map((vehicle) => ({
    label: vehicle?.Name,
    value: vehicle?.id,
  }));

  // storing price in vehicle type form
  const handleVehicleTypeChange = (formIndex, fieldIndex, event) => {
    const { name, value } = event.target;
    const updatedForms = [...formattedVehicleList];
    updatedForms[formIndex][fieldIndex] = {
      ...updatedForms[formIndex][fieldIndex],
      Cost: Number(value),
    };
    setFormattedVehicleList(updatedForms);
    setOriginalVehicleTypeForm(updatedForms);
    // const updatedForms = [...vehicleTypeForm];

    // const form = transportFormValue[formIndex];

    // updatedForms[formIndex][fieldIndex] = {
    //   ...updatedForms[formIndex][fieldIndex],
    //   Cost: Number(value),
    // };
    // setVehicleTypeForm(updatedForms);
    // setOriginalVehicleTypeForm(updatedForms);
  };

  const handlePaxChange = (index, e) => {
    const { name, value } = e.target;
    setPaxFormValue({ ...paxFormValue, [name]: value });
  };

  const handlePaxModalClick = (index) => {
    setModalCentered({ modalIndex: index, isShow: true });
    const form = transportFormValue?.filter((form, ind) => ind == index)[0];
    setPaxFormValue({
      Adults: form?.PaxInfo?.Adults,
      Child: form?.PaxInfo?.Child,
      Infant: form?.PaxInfo?.Infant,
    });
  };
  const handlePaxSave = () => {
    setTransportFormValue((prevForm) => {
      const newForm = [...prevForm];
      newForm[modalCentered?.modalIndex] = {
        ...newForm[modalCentered?.modalIndex],
        PaxInfo: paxFormValue,
      };
      return newForm;
    });
    setModalCentered({ modalIndex: "", isShow: false });
  };

  const handleAlternateTransport = () => {
    setIsAlternate(true);
    setTransportCopy(true);

    //  dispatch(setItineraryUpgradeFormDataButton(false));
  };
  const transportButton = useSelector(
    (state) => state.itineraryUpgradeReducer.transportButton
  );

  useEffect(() => {
    if (transportButton) {
      dispatch(
        setItineraryUpgradeFormData({
          UpgradeTransportValue: transportFormValue,
          VehicleRates: formattedVehicleList,
          selectedOptionsSecond: selectedOptions,
        })
      );
    }
  }, [transportFormValue, selectedOptions]);

  useEffect(() => {
    return () => {
      dispatch(setItineraryUpgradeFormDataButton(true));
    };
  }, []);

  useEffect(() => {
    if (
      formattedVehicleList?.length > 0 &&
      formattedVehicleList[0]?.length > 0 &&
      noOfVehicleIndex !== null &&
      noOfVehicleIndex !== undefined
    ) {
      const mainJson = [...transportFormValue];
      const vehicleJson = [...formattedVehicleList];

      mainJson.forEach((day, index) => {
        const noOfVehicles = parseInt(day.NoOfVehicle) || 1;

        if (index === Number(noOfVehicleIndex)) {
          const updated = vehicleJson[noOfVehicleIndex]?.map((vehicle) => {
            const baseCost =
              vehicle.BaseCost !== undefined
                ? parseFloat(vehicle.BaseCost)
                : parseFloat(vehicle.Cost) || 0;

            return {
              ...vehicle,
              Cost: baseCost * noOfVehicles,
              BaseCost: baseCost,
            };
          });

          vehicleJson[noOfVehicleIndex] = updated;
        }
      });
      setFormattedVehicleList(vehicleJson);
      setOriginalVehicleTypeForm(vehicleJson);
    }
  }, [transportFormValue?.map((form) => form?.NoOfVehicle).join(",")]);

  // handling vehicle type checkbox
  const handleVehicleChecboxChange = (e) => {
    const { name, value, checked } = e.target;
    const updatedVehicle = formattedVehicleList?.map((vehicle) => {
      return vehicle?.map((item) => {
        return item?.id == name
          ? { ...item, isSupplement: checked ? "Yes" : "No" }
          : item;
      });
    });

    setFormattedVehicleList(updatedVehicle);
    setOriginalVehicleTypeForm(updatedVehicle);
  };

  // console.log(orignalVehicleTypeForm,"originalformvalue");

  const handleHikeChange = (e) => {
    const { value } = e.target;
    setHikePercent(value);

    const updatedForm = orignalVehicleTypeForm?.map((form) => {
      return form?.map((vehicle) => ({
        ...vehicle,
        Cost:
          vehicle?.Cost && !isNaN(vehicle?.Cost)
            ? mathRoundHelper(
                parseFloat(vehicle?.Cost) +
                  (parseFloat(vehicle?.Cost) * value) / 100
              )
            : vehicle?.Cost,
      }));
    });
    setFormattedVehicleList(updatedForm);
  };

  useEffect(() => {
    const calculateTotalCostWithMarkup = (
      vehicleForm,
      markupPercent,
      originalForm
    ) => {
      const vehicleCostMap = {};
      const vehicleCostWithMarkup = {};

      vehicleForm?.forEach((dayVehicles) => {
        dayVehicles?.forEach((vehicle) => {
          const vehicleId = vehicle.id;
          const vehicleCost = parseFloat(vehicle.Cost) || 0;

          if (vehicleCostMap[vehicleId]) {
            vehicleCostMap[vehicleId] += vehicleCost;
          } else {
            vehicleCostMap[vehicleId] = vehicleCost;
          }
        });
      });

      originalForm?.forEach((dayVehicles) => {
        dayVehicles?.forEach((vehicle) => {
          const vehicleId = vehicle.id;
          const vehicleCost = parseFloat(vehicle.Cost) || 0;
          const totalCost = vehicleCostMap[vehicleId] || 0;
          const markup = (totalCost * markupPercent) / 100 || 0;
          vehicleCostWithMarkup[vehicleId] = {
            totalCost,
            markup,
            totalCostWithMarkup: totalCost + markup,
            markupWithHike: (totalCost * TransportData?.Value) / 100 || 0, // chnage vehicle costa value to markup value to dynmaice
          };
        });
      });

      return vehicleCostWithMarkup;
    };

    const filteredVehicleForm = transportFormValue
      ?.map((form, index) => {
        if (form?.ServiceId != "") {
          return formattedVehicleList && formattedVehicleList[index];
        } else {
          return null;
        }
      })
      .filter((form) => form != null);

    const calculatedRateWithMarkup = calculateTotalCostWithMarkup(
      filteredVehicleForm,
      hikePercent,
      // orignalVehicleTypeForm
      formattedVehicleList
    );
    setCalculatedRateDetails(calculatedRateWithMarkup);
  }, [
    hikePercent,
    formattedVehicleList,
    TransportData?.Value, // Add dependency to react to markup changes
    transportFormValue?.map((form) => form?.ServiceId).join(","),
  ]);

  // useEffect(() => {
  const totalAssistance = transportFormValue?.reduce((sum, item) => {
    return sum + (Number(item.Assitance) || 0);
  }, 0);

  const markupPercent = TransportData?.Value || 0; // Chanage to dynamice markup value
  const markupValue = totalAssistance * (markupPercent / 100 || 0);
  const grandTotal = totalAssistance + markupValue;

  const handleIsOpen = () => {
    // console.log("dataIsLoaded:", dataIsLoaded);
    if (dataIsLoaded) {
      dispatch({
        type: "SET_TRANSPORT_DATA_LOADmain",
        payload: true,
      });
      setDataIsLoaded(false);
    }

    setIsOpen({ ...isOpen, original: !isOpen.original });
  };
  useEffect(() => {
    dispatch({
      type: "SET_TRANSPORT_DATA_LOADmain",
      payload: false,
    });
  }, [dispatch]);
  // Helper function to extract unique vehicles from all non-empty arrays
  const getUniqueVehicles = (vehicleArrays) => {
    const seenIds = new Set();
    const uniqueVehicles = [];

    vehicleArrays.forEach((array) => {
      if (array && array.length > 0) {
        array.forEach((vehicle) => {
          if (!seenIds.has(vehicle.id)) {
            seenIds.add(vehicle.id);
            uniqueVehicles.push(vehicle);
          }
        });
      }
    });

    return uniqueVehicles;
  };

  // Get unique vehicles from formattedVehicleList
  const uniqueVehicles = getUniqueVehicles(formattedVehicleList);

  // ============== Copy logic

  const transportCheckbox = useSelector(
    (state) => state.itineraryServiceCopyReducer.transportCheckbox
  );

  useEffect(() => {
    // console.log("COPY67", mainHotelCheckBox);
    if (transportCheckbox.local) {
      dispatch(
        setItineraryCopyTransportFormData({
          TransportForm: transportFormValue,
          SelectedOptionVehicle: selectedOptionsSecond,
          FormattedVehicleList: formattedVehicleList,
        })
      );
    }
  }, [transportFormValue, selectedOptionsSecond, formattedVehicleList]);

  useEffect(() => {
    return () => {
      dispatch(setItineraryCopyTransportFormDataCheckbox(true));
      dispatch({
        type: "SET_TRANSPORT_DATA_LOAD",
        payload: false,
      });
    };
  }, []);

  return (
    <>
      <div className="row mt-3 m-0">
        <div
          className="col-12 px-1 py-2 d-flex justify-content-between itinerary-head-bg"
          onClick={handleIsOpen}
        >
          <div className="d-flex gap-4 align-items-center">
            <div className="d-flex gap-2">
              <img src={TransportIcon} alt="GuideIcon" />
              <label htmlFor="" className="fs-5">
                Transport
              </label>
            </div>
          </div>
          <div
            className="d-flex gap-4 align-items-center transport-select ms-auto" // Added ms-auto
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
            <div className="form-check check-sm d-flex gap-2 align-items-center">
              <input
                type="checkbox"
                className="form-check-input height-em-1 width-em-1"
                id={`transport_vehicle_type`}
                onChange={(e) =>
                  setIsVehicleType({
                    ...isVehicleType,
                    original: e.target.checked,
                  })
                }
                checked={isVehicleType?.original}
              />
              <label
                className="fontSize11px m-0 p-0 mt-1"
                htmlFor="transport_vehicle_type"
              >
                No Of Vehicle
              </label>
            </div>
            {Type == "Main" && (
              <div
                className="hike-input d-flex align-items-center cursor-pointer"
                id="copy_transport"
                name="copy_transport_form"
                checked={transportCopy}
                onClick={handleAlternateTransport}
              >
                <label
                  className="fontSize11px cursor-pointer"
                  htmlFor="copy_transport"
                >
                  <FaPlus className="m-0 p-0" /> Upgrade
                </label>
              </div>
            )}
            <div className="customLight_select">
              <Select
                isMulti
                value={selectedOptions}
                onChange={handleChange}
                options={vehicleTypeLabel}
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                hideSelectedValue={true}
                styles={transportCustomStyle}
                placeholder="Vehicle Type"
                isClearable={false}
                components={{
                  Option: ({ innerRef, innerProps, isSelected, label }) => (
                    <div
                      ref={innerRef}
                      {...innerProps}
                      className="checkbox-option"
                    >
                      <input type="checkbox" checked={isSelected} readOnly />
                      <label>{label}</label>
                    </div>
                  ),
                }}
              />
              <style jsx>{`
                .checkbox-option {
                  display: flex;
                  align-items: center;
                  padding: 8px;
                }
                .checkbox-option input {
                  margin-right: 8px;
                }
              `}</style>
            </div>
            <span className="cursor-pointer fs-5">
              {!isOpen?.original ? (
                <FaChevronCircleUp
                  className="text-primary"
                  onClick={(e) => {
                    e.stopPropagation(),
                      setIsOpen({ ...isOpen, original: !isOpen.original });
                  }}
                />
              ) : (
                <FaChevronCircleDown
                  className="text-primary"
                  onClick={(e) => {
                    e.stopPropagation(),
                      setIsOpen({ ...isOpen, original: !isOpen.original });
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
          <>
            <div className="col-12 px-0 mt-2">
              <div className={`${styles.scrollContainer}`}>
                <table class="table table-bordered itinerary-table">
                  <thead>
                    <tr>
                      <th
                        className="text-start align-middle py-1 days-width-9"
                        rowSpan={2}
                      >
                        Days
                      </th>
                      {(Type == "Local" || Type == "Foreigner") && (
                        <th rowSpan={2} className="py-1 align-middle">
                          Escort
                        </th>
                      )}
                      <th className="py-1">From</th>
                      <th className="py-1 sector-width-6">To</th>
                      <th className="py-1 sector-width-6">Sector</th>
                      <th rowSpan={2} className="align-middle py-1">
                        Program Type
                      </th>
                      <th rowSpan={2} className="align-middle py-1">
                        Program
                      </th>
                      <th
                        rowSpan={2}
                        className="align-middle py-1"
                        style={{ display: "none" }}
                      >
                        Program Details
                      </th>
                      <th rowSpan={2} className="align-middle py-1">
                        Mode
                      </th>
                      <th rowSpan={2} className="align-middle py-1">
                        Supplier
                      </th>
                      <th rowSpan={2} className="align-middle py-1">
                        Remarks
                      </th>

                      <th rowSpan={2} className="align-middle py-1">
                        Vehicle Type
                      </th>
                      <th rowSpan={2} className="align-middle py-1">
                        Cost Type
                      </th>
                      {isVehicleType?.original && (
                        <th rowSpan={2} className="align-middle py-1">
                          No of Vehicle
                        </th>
                      )}
                      <th rowSpan={2} className="align-middle py-1">
                        Assistance
                      </th>

                      {uniqueVehicles.length > 0 ? (
                        uniqueVehicles.map((form) => {
                          const isSelected = selectedOptions.some(
                            (opt) => opt.value === form.id
                          );
                          return (
                            <th
                              key={form.id}
                              rowSpan={2}
                              className={`align-middle text-center ${
                                isSelected ? "" : "d-none"
                              }`}
                              style={{ minWidth: "150px", padding: "8px" }} // Consistent width and padding
                            >
                              <div className="d-flex gap-1 justify-content-center align-items-center">
                                <div className="form-check check-sm d-flex align-items-center gap-1">
                                  <input
                                    type="checkbox"
                                    className="form-check-input height-em-1 width-em-1"
                                    id={form.id}
                                    name={form.id}
                                    onChange={handleVehicleChecboxChange}
                                  />
                                  <label
                                    htmlFor={form.id}
                                    style={{ fontSize: "11px" }}
                                    className="mt-1"
                                  >
                                    {form.Name}
                                  </label>
                                </div>
                              </div>
                            </th>
                          );
                        })
                      ) : (
                        <th
                          rowSpan={2}
                          className="align-middle text-center"
                          style={{ minWidth: "150px", padding: "8px" }} // Consistent width and padding
                        >
                          <div className="d-flex gap-1 justify-content-center align-items-center">
                            <div className="form-check check-sm d-flex align-items-center gap-1">
                              <input
                                type="checkbox"
                                className="form-check-input height-em-1 width-em-1"
                                id="placeholder"
                                name="placeholder"
                                disabled
                              />
                              <label
                                htmlFor="placeholder"
                                style={{ fontSize: "11px" }}
                                className="mt-1"
                              >
                                No Vehicle Available
                              </label>
                            </div>
                          </div>
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {transportFormValue
                      ?.map((form, index) => ({
                        item: form,
                        originalIndex: index,
                      }))
                      ?.filter(({ item }) => item?.ServiceMainType === "No")
                      ?.map(({ item, originalIndex }, index) => {
                        return (
                          <tr key={originalIndex + 1}>
                            <td>
                              <div className="d-flex gap-2 justify-content-start">
                                <div className="d-flex gap-2">
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
                                      handleTableIncrement(originalIndex)
                                    }
                                  >
                                    <i className="la la-plus border cursor-pointer bg-success text-white rounded-pill fontSize10px padding1px"></i>
                                  </span>
                                  <span
                                    onClick={() =>
                                      handleTableDecrement(originalIndex)
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
                                    {`Day ${item?.DayNo}`} <br />{" "}
                                    {` ${moment(item?.Date).format(
                                      "DD-MM-YYYY"
                                    )}`}
                                  </span>
                                ) : (
                                  <span
                                    style={{
                                      textWrap: "nowrap",
                                      marginRight: "5px",
                                    }}
                                  >{`Day ${item?.DayNo}`}</span>
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
                                    value={
                                      transportFormValue[originalIndex]?.Escort
                                    }
                                    onChange={(e) =>
                                      handleTransportChange(originalIndex, e)
                                    }
                                  />
                                </div>
                              </td>
                            )}
                            <td>
                              <div>
                                <select
                                  name="FromDestination"
                                  id=""
                                  className="formControl1"
                                  value={
                                    transportFormValue[originalIndex]
                                      ?.FromDestination
                                  }
                                  onChange={(e) =>
                                    handleTransportChange(originalIndex, e)
                                  }
                                >
                                  <option value="">Select</option>
                                  {destinationList?.map((qout, index) => {
                                    return (
                                      <option value={qout?.id} key={index + 1}>
                                        {qout?.Name}
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>
                            </td>
                            <td>
                              <div>
                                <select
                                  name="ToDestination"
                                  id=""
                                  className="formControl1"
                                  value={
                                    transportFormValue[originalIndex]
                                      ?.ToDestination
                                  }
                                  onChange={(e) =>
                                    handleTransportChange(originalIndex, e)
                                  }
                                >
                                  <option value="">Select</option>
                                  {destinationList?.map((qout, index) => {
                                    return (
                                      <option value={qout?.id} key={index + 1}>
                                        {qout?.Name}
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>
                            </td>

                            <td>
                              <div className="text-wrap sector-width-6">
                                <textarea
                                  // type="text"
                                  name="Sector"
                                  className="formControl1"
                                  value={
                                    fromToDestinationList[originalIndex] || ""
                                  }
                                  onChange={(e) =>
                                    handleSectorChange(originalIndex, e)
                                  }
                                />
                              </div>
                            </td>

                            <td>
                              <div>
                                <select
                                  name="TransferType"
                                  id=""
                                  className="formControl1"
                                  value={
                                    transportFormValue[originalIndex]
                                      ?.TransferType
                                  }
                                  onChange={(e) =>
                                    handleTransportChange(originalIndex, e)
                                  }
                                >
                                  <option value="">Select</option>
                                  {transferTypeList?.map((transfer, index) => {
                                    return (
                                      <option
                                        value={transfer?.id}
                                        key={index + "s"}
                                      >
                                        {transfer?.Name}
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
                                  value={
                                    transportFormValue[originalIndex]?.ServiceId
                                  }
                                  onChange={(e) =>
                                    handleTransportChange(originalIndex, e)
                                  }
                                >
                                  <option value="">Select</option>
                                  {transportList[index]?.map(
                                    (transport, index) => {
                                      // console.log(
                                      //   "Dropdown debug:",
                                      //   { index,originalIndex,transportList: transportList[index],form: transportFormValue[originalIndex] }
                                      // );

                                      return (
                                        <option
                                          value={transport?.id}
                                          key={index + 1}
                                        >
                                          {transport?.Name}
                                        </option>
                                      );
                                    }
                                  )}
                                </select>
                              </div>
                            </td>
                            <td style={{ display: "none" }}>
                              <div>
                                <textarea
                                  // type="text"
                                  className=" formControl1"
                                  name="TransportDetails"
                                  value={extractTextFromHTML(
                                    transportFormValue[originalIndex]
                                      ?.TransportDetails
                                  )}
                                  onChange={(e) =>
                                    handleTransportChange(originalIndex, e)
                                  }
                                />
                              </div>
                            </td>
                            <td>
                              <div>
                                <select
                                  name="Mode"
                                  id=""
                                  className="formControl1"
                                  value={
                                    transportFormValue[originalIndex]?.Mode
                                  }
                                  onChange={(e) =>
                                    handleTransportChange(originalIndex, e)
                                  }
                                >
                                  <option value="">Select</option>
                                  <option value="flight">Flight</option>
                                  <option value="train">Train</option>
                                  <option value="surface">Surface</option>
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
                                    transportFormValue[originalIndex]?.Supplier
                                  }
                                  onChange={(e) =>
                                    handleTransportChange(originalIndex, e)
                                  }
                                >
                                  <option value="">Select</option>
                                  {transportSupplierList[index]?.map(
                                    (supplier, index) => {
                                      return (
                                        <option
                                          value={supplier?.id}
                                          key={index + 1}
                                        >
                                          {supplier?.Name}
                                        </option>
                                      );
                                    }
                                  )}
                                </select>
                              </div>
                            </td>
                            <td>
                              <div>
                                <textarea
                                  name="Remarks"
                                  className="formControl1"
                                  value={extractTextFromHTML(
                                    transportFormValue[originalIndex].Remarks
                                  )}
                                  onChange={(e) =>
                                    handleTransportChange(originalIndex, e)
                                  }
                                  placeholder="Remarks"
                                />
                              </div>
                            </td>
                            <td>
                              <div>
                                <select
                                  name="AlternateVehicle"
                                  id=""
                                  className="formControl1"
                                  value={
                                    transportFormValue[originalIndex]
                                      ?.AlternateVehicle ||
                                    headerDropdown.Transfer ||
                                    ""
                                  }
                                  onChange={(e) =>
                                    handleTransportChange(originalIndex, e)
                                  }
                                >
                                  <option value="">Select</option>
                                  {vehicleTypeList?.map(
                                    (vehicleType, vehicleIndex) => {
                                      return (
                                        <option
                                          value={vehicleType?.id}
                                          key={vehicleIndex + 1}
                                          selected={
                                            vehicleType?.id ==
                                              headerDropdown.Transfer ||
                                            vehicleType?.id ==
                                              transportFormValue[originalIndex]
                                                ?.AlternateVehicle
                                          }
                                        >
                                          {vehicleType?.Name}
                                        </option>
                                      );
                                    }
                                  )}
                                </select>
                              </div>
                            </td>
                            <td>
                              <td>
                                <div>
                                  <select
                                    name="CostType"
                                    className="formControl1"
                                    value={
                                      transportFormValue[originalIndex]
                                        ?.CostType
                                    }
                                    onChange={(e) =>
                                      handleTransportChange(originalIndex, e)
                                    }
                                  >
                                    {/* <option value="Package Cost">Package Cost</option>
                        
                                        <option value="Per Day Cost">Per Day Cost</option> */}
                                    <option value="1">Package Cost</option>

                                    <option value="2">Per Day Cost</option>
                                  </select>
                                </div>
                              </td>
                            </td>
                            {isVehicleType?.original && (
                              <td>
                                <div>
                                  <input
                                    type="number"
                                    min="0"
                                    name="NoOfVehicle"
                                    className="formControl1 width50px"
                                    value={
                                      transportFormValue[originalIndex]
                                        ?.NoOfVehicle
                                    }
                                    onChange={(e) =>
                                      handleTransportChange(originalIndex, e)
                                    }
                                  />
                                </div>
                              </td>
                            )}
                            <td>
                              <div>
                                <input
                                  type="text"
                                  name="Assitance"
                                  className="formControl1 width50px"
                                  value={
                                    transportFormValue[originalIndex]?.Assitance
                                  }
                                  onChange={(e) =>
                                    handleTransportChange(originalIndex, e)
                                  }
                                />
                              </div>
                            </td>

                            {/* {vehicleTypeForm[originalIndex]?.map(
                                (form, ind) => {
                                  return (
                                    <td>
                                      <div>
                                        <input
                                          type="number"
                  min="0"
                                          className="formControl1"
                                          value={
                                            vehicleTypeForm[originalIndex][ind]
                                              ?.Cost
                                          }
                                          name={
                                            vehicleTypeForm[originalIndex]
                                              ?.id
                                          }
                                          onChange={(e) =>
                                            handleVehicleTypeChange(index, ind, e)
                                          }
                                        />
                                      </div>
                                    </td>
                                  );
                                }
                              )} */}

                            {formattedVehicleList &&
                            formattedVehicleList[originalIndex]?.length > 0 ? (
                              formattedVehicleList[originalIndex].map(
                                (vehicle, ind) => {
                                  const isSelected = selectedOptions?.some(
                                    (opt) => opt.value === vehicle.id
                                  );
                                  // console.log("Vehicle Type Form:",vehicleTypeForm,"Original Index:",originalIndex,"Vehicle:",vehicle);

                                  return (
                                    <td
                                      key={vehicle.id}
                                      className={isSelected ? "" : "d-none"}
                                    >
                                      {" "}
                                      <div>
                                        <input
                                          type="number"
                                          min="0"
                                          className="formControl1"
                                          value={vehicle.Cost || ""}
                                          name={vehicle?.id}
                                          onChange={(e) =>
                                            handleVehicleTypeChange(
                                              index,
                                              ind,
                                              e
                                            )
                                          }
                                        />
                                      </div>
                                    </td>
                                  );
                                }
                              )
                            ) : (
                              <td>
                                <div>
                                  <input
                                    type="number"
                                    min="0"
                                    className="formControl1"
                                    value=""
                                    //  name={vehicle?.id}

                                    placeholder=""
                                  />
                                </div>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    <tr className="costing-td">
                      <td
                        colSpan={
                          Type == "Local"
                            ? 11
                            : Type == "Foreigner"
                            ? isVehicleType?.original
                              ? 12
                              : 12
                            : isVehicleType?.original
                            ? 10
                            : 9
                        }
                        rowSpan={3}
                        className="text-center fs-6"
                      >
                        Total
                      </td>

                      <td colSpan={2}>Transport Cost</td>
                      <td>
                        {mathRoundHelper(
                          (totalAssistance && totalAssistance) || Assistance
                        )}
                      </td>
                      {uniqueVehicles &&
                        uniqueVehicles?.length > 0 &&
                        uniqueVehicles?.map((options, index) => {
                          const isSelected = selectedOptions?.some(
                            (opt) => opt.value === options.id
                          );
                          // console.log(options.id,selectedOptions,"selectedOptions");
                          // console.log(isSelected,"isSelected");
                          console.log(
                            calculatedRateDetails,
                            "calculatedRateDetails999999"
                          );

                          return (
                            <td
                              key={index}
                              className={isSelected ? "" : "d-none"}
                            >
                              {mathRoundHelper(
                                calculatedRateDetails[options?.id]?.totalCost
                              )}
                            </td>
                          );
                        })}
                    </tr>
                    <tr className="costing-td">
                      <td colSpan={2}>
                        Markup({TransportData?.Value}) {TransportData?.Markup}{" "}
                      </td>
                      <td>{mathRoundHelper(markupValue && markupValue)}</td>
                      {uniqueVehicles &&
                        uniqueVehicles?.length > 0 &&
                        uniqueVehicles?.map((options, index) => {
                          const isSelected = selectedOptions?.some(
                            (opt) => opt.value === options.id
                          );
                          return (
                            <td
                              key={index}
                              className={isSelected ? "" : "d-none"}
                            >
                              {mathRoundHelper(
                                calculatedRateDetails[options?.id]
                                  ?.markupWithHike
                              )}
                            </td>
                          );
                        })}
                    </tr>
                    <tr className="costing-td">
                      <td colSpan={2}>Total</td>
                      <td>{mathRoundHelper(grandTotal && grandTotal)}</td>
                      {uniqueVehicles &&
                        uniqueVehicles?.length > 0 &&
                        uniqueVehicles.map((form, index) => {
                          const isSelected = selectedOptions?.some(
                            (opt) => opt.value === form?.id
                          );
                          const totalCostWithMarkup = parseFloat(
                            calculatedRateDetails[form?.id]
                              ?.totalCostWithMarkup || 0
                          );
                          const markup = parseFloat(
                            calculatedRateDetails[form?.id]?.markupWithHike || 0
                          );
                          dispatch(
                            setTransportPrice(totalCostWithMarkup + markup)
                          );
                          //  console.log(is);

                          return (
                            <td
                              key={index}
                              className={isSelected ? "" : "d-none"}
                            >
                              {mathRoundHelper(
                                (totalCostWithMarkup + markup).toFixed(2)
                              )}
                            </td>
                          );
                        })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
      {isOpen?.original && (
        <div className="row mt-1">
          <div className="col-12 d-flex justify-content-end align-items-end">
            <button
              className="btn btn-primary py-1 px-2 radius-4 d-flex align-items-center gap-1"
              onClick={handleFinalSave}
            >
              <i className="fa-solid fa-floppy-disk fs-4"></i>Save
            </button>
          </div>
        </div>
      )}
      {transportCopy && (
        <TransportUpgrade
          headerDropdown={headerDropdown}
          headerDropdownCopy={headerDropdownCopy}
        />
      )}
      {/* {transportCopy && <>hy there</>} */}
    </>
  );
};

export default Transport;
