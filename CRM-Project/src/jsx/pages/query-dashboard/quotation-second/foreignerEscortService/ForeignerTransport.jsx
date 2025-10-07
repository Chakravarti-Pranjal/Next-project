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
import extractTextFromHTML from "../../../../../helper/htmlParser";
import { setTransportServiceForm } from "../../../../../store/actions/ItineraryServiceAction";
import Select from "react-select";
import { useMemo } from "react";
import { transportCustomStyle } from "../../../../../css/custom_style";
import { Modal, Row, Col, Button } from "react-bootstrap";
import {
  setQoutationData,
  setQoutationResponseData,
  setQueryData,
} from "../../../../../store/actions/queryAction";
// import { Mode } from "@mui/icons-material";

import styles from "../itinerary-transport/index.module.css";
// import { addQueryContext } from "../../createQuery";
// import { quotationData } from "../../qoutation-first/quotationdata";
import { setItineraryCopyTransportFormDataCheckbox } from "../../../../../store/actions/itineraryServiceCopyAction/itineraryServiceCopyAction";
import { incrementLocalEscortCharges } from "../../../../../store/actions/createExcortLocalForeignerAction";
import moment from "moment";
import { quotationData } from "../../qoutation-first/quotationdata";
import IsDataLoading from "../IsDataLoading";
import mathRoundHelper from "../../helper-methods/math.round";
// import { addQueryContext } from "../../createQuery/index.jsx";

const ForeignerTransport = ({
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
  // console.log(transportFormValue,"transportFormValueupper")
  console.log(qoutationData, "qoutationData111");

  const { TourSummary } = qoutationData;
  const dispatch = useDispatch();

  const [transferTypeList, setTransferTypeList] = useState([]);
  const [transportList, setTransportList] = useState([]);
  const [transportSupplierList, setTransportSupplierList] = useState([]);
  const [destinationList, setDestinationList] = useState([]);
  const [vehicleTypeList, setVehicleTypeList] = useState([]);
  const { transportFormData } = useSelector((data) => data?.itineraryReducer);
  const [selectedInd, setSelectedInd] = useState({});
  const [rateList, setRateList] = useState([]);
  const [data, setData] = useState(false);
  const [formattedVehicleList, setFormattedVehicleList] = useState([]);
  const [isManualTransportEdit, setIsManualTransportEdit] = useState(false);
  const [dayUniqueIds, setDayUniqueIds] = useState([]);

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
  const [hikePercent, setHikePercent] = useState(0);
  const [vehicleTypeForm, setVehicleTypeForm] = useState([]);
  const [orignalVehicleTypeForm, setOriginalVehicleTypeForm] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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
  const [isTransportListLoaded, setIsTransportListLoaded] = useState(false);
  const [isSupplierListLoaded, setIsSupplierListLoaded] = useState(false);
  const [isVehicleTypeListLoaded, setIsVehicleTypeListLoaded] = useState(false);
  const [isRateMerged, setIsRateMerged] = useState(true);
  const [isFirstValueSet, setIsFirstValueSet] = useState(false);

  const [dataIsLoaded, setDataIsLoaded] = useState(true);
  const [isDayServices, setIsDayServices] = useState(false);
  const [vehicleRateData, setVehicleRateData] = useState([]);
  const [selectedVehicleTypes, setSelectedVehicleTypes] = useState([]);
  const apiDataLoad = useSelector(
    (state) => state.inineraryServiceDataLoadReducer.transport
  );

  const hasInitialized = useRef(3);

  const qoutationDataLocal = qoutationData?.ExcortDays?.find(
    (item) => item.Type === "Foreigner"
  );
  const { QueryAlphaNumId } = queryData || {};
  const { QuotationNumber } = qoutationData || {};
  const [markupArray, setMarkupArray] = useState({
    Markup: { Data: [] },
  });
  //console.log(markupArray,"markupArray111");
  const TransportData = markupArray?.Markup?.Data?.find(
    (item) => item.Type === "Transport"
  );

  const [quotationData, setQoutationData] = useState({});
  // const [hasFetched, setHasFetched] = useState(false);
  console.log(selectedOptions, "selectedOptions2");

  useEffect(() => {
    console.log("Triggered useEffect with:", {
      QueryAlphaNumId,
      QuotationNumber,
    });

    if (QueryAlphaNumId && QuotationNumber) {
      axiosOther
        .post("listqueryquotation", {
          QueryId: QueryAlphaNumId,
          QuotationNo: QuotationNumber,
        })
        .then(({ data }) => {
          console.log("API response:", data);

          if (data?.success && data.data?.[0]) {
            setQoutationData(data.data[0]);
            // console.log("Quotation data set successfully:", data.data[0]);
          } else {
            // console.warn("No valid data received or success flag false.");
          }
        })
        .catch((error) => {
          console.error("API error:", error);
        });
    } else {
      // console.warn("QueryAlphaNumId or QuotationNumber missing.");
    }

    console.log("useEffect execution finished");
  }, [QueryAlphaNumId, QuotationNumber]);
  // console.log(quotationData,"quotationdata");

  useEffect(() => {
    if (qoutationDataLocal?.Days.length) {
      if (hasInitialized.current === 0) return;
      const hasTransportService = qoutationDataLocal?.Days?.some((day) =>
        day?.DayServices?.some((service) => service.ServiceType === "Transport")
      );

      if (hasTransportService) {
        // setTransportCopy(true);
        const initialFormValue = qoutationDataLocal?.Days?.map((day, ind) => {
          const service = day?.DayServices?.filter(
            (service) => service?.ServiceType === "Transport"
          )[0];
          const { TimingDetails, ItemSupplierDetail } =
            service != undefined ? service?.ServiceDetails.flat(1)[0] : "";

          if (service?.TransferTypeId) {
            service.TransferTypeId = parseInt(service.TransferTypeId);
          }
          const dayTravelData =
            queryData?.QueryAllData?.TravelDateInfo?.TravelData.filter(
              (travel) => travel.DayNo === day.Day
            );

          // Calculate which occurrence of the day we are processing
          const occurrenceIndex = qoutationDataLocal?.Days.slice(0, ind).filter(
            (d) => d.Day === day.Day
          ).length;
          // Select the corresponding TravelData entry (or fallback to first if out of bounds)
          const travelDataEntry =
            (dayTravelData && dayTravelData[occurrenceIndex]) ||
            dayTravelData ||
            {};

          return {
            id: queryData?.QueryId,
            QuatationNo: qoutationData?.QuotationNumber,
            DayType: "Foreigner",
            DayNo: day.Day,
            Date: day?.Date,
            DayUniqueId: day?.DayUniqueId,
            DestinationUniqueId: day?.DestinationUniqueId,
            FromDay: "",
            ToDay: "",
            FromDestination: service?.FromDestinationId || day?.DestinationId,
            ToDestination: service?.ToDestinationId,
            TransferType: service?.TransferTypeId,
            Mode: service?.Mode || travelDataEntry.Mode,
            Escort: 1,
            Supplier: ItemSupplierDetail?.ItemSupplierId,
            TransportDetails: service?.TransportDetails,
            Remarks: service?.TransportDetails,
            AlternateVehicle: service?.AlternateVehicle,
            CostType: service?.CostType,
            NoOfVehicle: service?.NoOfVehicle != "" ? service?.NoOfVehicle : 1,
            Cost: service?.ServicePrice || "",
            Sector: service?.Sector,
            AlternateVehicleId: service?.AlterVehicleId,
            AlternateVehicleCost: service?.AlternateVehicleCost,
            NoOfDay: service?.NoOfDay,
            ServiceId: service?.ServiceId ? service?.ServiceId : "",
            ItemFromDate: TimingDetails?.ItemFromDate,
            ItemToDate: TimingDetails?.ItemToDate,
            ItemFromTime: TimingDetails?.ItemFromTime,
            ItemToTime: TimingDetails?.ItemToTime,
            ServiceMainType: "No",
            RateUniqueId: "",
            Assitance: service?.Assitance ? service?.Assitance : "",
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
        // Set vehicle type form with costs from service data
        const vehicleForms = qoutationDataLocal?.Days?.map((day) => {
          const service = day?.DayServices?.filter(
            (service) => service?.ServiceType === "Transport"
          )[0];

          if (service && service?.VehicleType) {
            return service.VehicleType.map((vehicle) => ({
              VehicleTypeId: vehicle?.VehicleTypeId,
              Cost: vehicle?.Cost,
              isSupplement: vehicle?.isSupplement,
              Name: vehicle?.VehicleTypeName || vehicle.Name,
            }));
          }
          return [];
        });

        const formattedVehicles = vehicleForms[0].map((vehicle) => ({
          label: vehicle.Name,
          value: vehicle.VehicleTypeId,
          Cost: vehicle.Cost,
        }));
        console.log(formattedVehicles, vehicleForms, "formattedVehicles");

        setSelectedOptionSecond(formattedVehicles);

        setFormattedVehicleList(vehicleForms);
        setOriginalVehicleTypeForm(vehicleForms);

        const transportInitialValue = qoutationDataLocal?.Days?.map(
          (day, ind) => {
            return {
              ...itineraryTransportInitialValue,
              id: queryData?.QueryId,
              DayType: "Foreigner",
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
            };
          }
        );
        console.log(initialFormValue, "initialFormValuecheckkkkk");

        setTransportFormValue(initialFormValue);

        dispatch(setTransportServiceForm(transportInitialValue));
        setIsDayServices(true);
      } else {
        const transportInitialValue = qoutationDataLocal?.Days?.map(
          (day, ind) => {
            const dayTravelData =
              queryData?.QueryAllData?.TravelDateInfo?.TravelData.filter(
                (travel) => travel.DayNo === day.Day
              );
            // Calculate which occurrence of the day we are processing
            const occurrenceIndex = qoutationDataLocal?.Days.slice(
              0,
              ind
            ).filter((d) => d.Day === day.Day).length;

            // Select the corresponding TravelData entry (or fallback to first if out of bounds)
            const travelDataEntry =
              (dayTravelData && dayTravelData[occurrenceIndex]) ||
              dayTravelData ||
              {};
            console.log(day?.DayUniqueId, "day111");
            setDayUniqueIds(
              qoutationDataLocal?.Days?.map((day) => day?.DayUniqueId)
            );

            return {
              ...itineraryTransportInitialValue,
              id: queryData?.QueryId,
              DayType: "Foreigner",
              DayNo: day.Day,
              Date: day?.Date,
              DestinationUniqueId: day?.DestinationUniqueId,
              QuatationNo: qoutationData?.QuotationNumber,
              Mode: travelDataEntry?.Mode || "",
              DayUniqueId: day?.DayUniqueId,
              FromDestination: day?.DestinationId,
              // ItemFromDate: qoutationData?.TourSummary?.FromDate,
              // ItemToDate: qoutationData?.TourSummary?.ToDate,
              // NoOfVehicle: 1,
              // RateUniqueId: "",
              // Assitance: "",
              // PaxInfo: {
              //   Adults: qoutationData?.Pax?.AdultCount,
              //   Child: qoutationData?.Pax?.ChildCount,
              //   Infant: qoutationData?.Pax?.Infant,
              //   Escort: "",
              // },
            };
          }
        );

        setIsIntialValue(true);
        setTransportFormValue(transportInitialValue);
        // console.log(transportFormValue, "YYT8");
        dispatch(setItineraryTransportData(transportInitialValue));
        dispatch(setTransportServiceForm(transportInitialValue));
      }
      hasInitialized.current -= 1;
    }
  }, [qoutationData, transportFormValue]);

  useEffect(() => {
    if (qoutationDataLocal?.Days) {
      setDayUniqueIds(qoutationDataLocal.Days.map((day) => day?.DayUniqueId));
    }
  }, [qoutationDataLocal]);
  console.log(transportFormValue, "transportFormValue99990");

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
  // useEffect(() => {
  //   if (transportList.length > 0 && transportSupplierList.length > 0) {
  //     if (isIntialValue) {
  //       transportFormValue?.map((item, index) => {
  //         setFirstValueIntoForm(index);
  //       });
  //     }
  //     // setIsTransportListLoaded(true);
  //     // setIsSupplierListLoaded(true);
  //     // setIsVehicleTypeListLoaded(true);
  //   }
  // }, [
  //   transportList,
  //   transportSupplierList,
  //   // transferTypeList,
  //   // isItineraryEditing,
  // ]);
  // const isFirstRun = useRef(true);
  // const getProgramTypeForTransport = (list) => {
  //   const data = transferTypeList.length > 0 ? transferTypeList : list;

  //   const fromDays =
  //     outstation
  //       ?.filter(
  //         (entry) =>
  //           entry?.isOutstationChanged === true &&
  //           entry?.From &&
  //           entry?.Transport !== undefined &&
  //           entry?.Transport !== null &&
  //           String(entry?.Transport).trim() !== ""
  //       )
  //       .map((entry) => parseInt(entry.From)) || [];
  //   const arrivalTransfer = data?.find(
  //     (transfer) => transfer?.Name === "Arrival Transfers"
  //   );
  //   const departureTransfer = data?.find(
  //     (transfer) => transfer?.Name === "Departure Transfer"
  //   );

  //   if (!arrivalTransfer || !departureTransfer) return;

  //   setTransportFormValue((prevForm) => {
  //     const newForm = prevForm.map((form, index) => {
  //       const currentDay = index + 1;
  //       if (index === 0) {
  //         return { ...form, TransferType: arrivalTransfer?.id };
  //       } else if (index === prevForm.length - 1) {
  //         return { ...form, TransferType: departureTransfer?.id };
  //       } else if (fromDays.includes(currentDay)) {
  //         return { ...form, TransferType: 6 };
  //       } else {
  //         const hasDayType =
  //           dayTypeArr[index] !== undefined && dayTypeArr[index] !== "";
  //         return { ...form, TransferType: hasDayType ? 4 : "" };
  //       }
  //     });
  //     return newForm;
  //   });
  //   setData(true);
  // };

  useEffect(() => {
    // getProgramTypeForTransport();
  }, [dayTypeArr, JSON.stringify(outstation)]);

  // getting transfer type list data
  const postDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("transfertypemasterlist");
      setTransferTypeList(data?.DataList);

      // if (!isDayServices && data.DataList.length > 0) {
      //   getProgramTypeForTransport(data.DataList);
      // }
    } catch (error) {
      console.log("error", error);
    }
    try {
      const { data } = await axiosOther.post("destinationlist");
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
    if (!apiDataLoad) return;
    postDataToServer();
  }, [headerDropdown, apiDataLoad]);

  useEffect(() => {
    const getVehicleList = async () => {
      try {
        const { data } = await axiosOther.post("vehicletypemasterlist", {
          // PaxType: TourSummary?.PaxTypeName,
        });

        setVehicleTypeList(data?.DataList);
        const defaultVehicleLabel = data?.DataList?.filter(
          (vehicletype) =>
            headerDropdown.Transfer &&
            vehicletype?.id == headerDropdown.Transfer
        ).map((list) => ({
          label: list?.Name,
          value: list?.id,
        }));
        console.log(defaultVehicleLabel, "defaultVehicleLabel");

        setSelectedOptions(defaultVehicleLabel);
      } catch (error) {
        console.log("error", error);
      }
    };
    getVehicleList();
  }, []);
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
      // setGetMonumentProgram(false)
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
    // if (isTransferTypeChangeRef.current) return;
    //console.log("transLLISSSttt",index,transferid,ToDestination,mode);
    //console.log("iamreaching to list");
    // console.log(transferid,"value2");
    // console.log("getTransportList called",{ index,transferid,ToDestination,mode });
    // console.log(
    //   "getTransportList called",
    //   index,
    //   transferid,
    //   ToDestination,
    //   mode,
    //   FromDestination
    // );

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
    // if (!apiDataLoad) return;
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
    // apiDataLoad,
  ]);
  // useEffect(() => {
  //   let isActive = true;
  //   const loadAllTransportData = async () => {
  //     // if (!apiDataLoad) return;

  //     const allTransportLists = [];
  //     const allSupplierLists = [];
  //     const updatedForm = [...transportFormValue];

  //     for (let index = 0; index < transportFormValue.length; index++) {
  //       const item = transportFormValue[index];

  //       // Step 1: Get transport list
  //       try {
  //         const { data: transportData } = await axiosOther.post(
  //           "transportmasterlist",
  //           {
  //             DestinationId: item?.FromDestination,
  //             Default: "Yes",
  //             TransferType: item?.TransferType,
  //             TransportType: item?.Mode,
  //           }
  //         );
  //         allTransportLists[index] =
  //           item?.TransferType !== "" ? transportData?.DataList : [];
  //       } catch (error) {
  //         console.error(
  //           `Error fetching transport list for index ${index}:`,
  //           error
  //         );
  //         allTransportLists[index] = [];
  //       }

  //       // Step 2: Get supplier list
  //       const { data: supplierData } = await axiosOther.post("supplierlist",{
  //         Name: "",
  //         id: "",
  //         SupplierService: [4],
  //         DestinationId: [Number(item?.FromDestination)],
  //       });
  //       const supplierList = supplierData?.DataList || [];
  //       allSupplierLists[index] = supplierList;

  //       // Step 2: Set first program + supplier
  //       const programId = allTransportLists[index]?.[0] || "";
  //       const supplierId = allSupplierLists[index]?.[0]?.id || "";

  //       // Step 3: Set program details
  //       const details = allTransportLists[index]?.find(
  //         (el) => el.id === programId.id
  //       );
  //       updatedForm[index] = {
  //         ...updatedForm[index],
  //         // ServiceId: programId.id,
  //         // Supplier: supplierId,
  //         // TransportDetails: details?.Detail || "",
  //         // Remarks: details?.Detail || "",
  //       };

  //       if (vehicleTypeList.length > 0) {
  //         getTransportRateApi(
  //           item?.DestinationUniqueId,
  //           supplierId,
  //           index,
  //           "",
  //           programId.UniqueId
  //           // data.DataList
  //         );
  //       }
  //     }
  //     setTransportList(allTransportLists);
  //     setTransportSupplierList(allSupplierLists);
  //     if (isActive) {
  //       setTransportFormValue(updatedForm);
  //       // setIsFirstValueSet(true)
  //     }
  //   };

  //   loadAllTransportData();
  //   return () => {
  //     isActive = false; // cleanup to cancel outdated updates
  //   };
  // },[data]);

  // getting supplier for transport list with and without dependently it's dependent on transport city
  const getTransportSupplierList = async (index, id) => {
    try {
      const { data } = await axiosOther.post("supplierlist", {
        Name: "",
        id: "",
        SupplierService: [4],
        DestinationId: [Number(id)],
      });
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
    // if (!apiDataLoad) return;

    transportFormValue?.forEach((item, index) => {
      //console.log("supplLidhjdsfjdsjfdfdhfhffj725",item,index);
      if (item?.ToDestination != "") {
        getTransportSupplierList(index, item?.ToDestination);
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
              (rate) => rate?.VehicleTypeId == subForm?.VehicleTypeId
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
            (rate) => rate?.VehicleTypeId == subForm?.VehicleTypeId
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

  //console.log(formattedVehicleList, 'formattedVehicleList');

  useEffect(() => {
    if (rateList?.length == qoutationDataLocal?.Days?.length && isRateMerged) {
      mergeTransportRateJson();
    }
  }, [
    rateList,
    transportFormValue?.map((guide) => guide?.ServiceId).join(","),
    transportFormValue?.map((guide) => guide?.ServiceId).join(","),
  ]);

  const handleTransportChange = async (ind, e) => {
    const { name, value } = e.target;
    if (name == "NoOfVehicle") {
      setNoOfVehilceState(ind);
    }
    setIsManualTransportEdit(true);
    setTransportFormValue((prevValue) => {
      const newArr = [...prevValue];
      newArr[ind] = { ...prevValue[ind], [name]: value };

      return newArr;
    });
    if (name == "TransferType") {
      const fromDestination = transportFormValue[ind]?.FromDestination;
      const ToDestination = transportFormValue[ind]?.ToDestination;
      const DestinationUniqueId = transportFormValue[ind]?.DestinationUniqueId;
      // const mode = transportFormValue[ind]?.Mode;
      const DestinationId =
        value == 6 || value == 2
          ? Number(fromDestination)
          : Number(ToDestination);

      const mode = transportFormValue[ind]?.Mode;

      const { data } = await axiosOther.post("transportmasterlist", {
        DestinationId: DestinationId,
        Default: "Yes",
        TransferType: value,
        TransportType: mode,
      });

      const programList = data?.DataList || [];
      const firstProgramId = programList.length > 0 ? programList[0] : "";

      // const firstSupplierId = transportSupplierList[ind][0].id
      await getTransportSupplierList(ind, ToDestination);
      const suppliersForIndex = transportSupplierList?.[ind] || [];
      const firstSupplierId = suppliersForIndex?.[0]?.id || "";

      setTransportFormValue((prevValue) => {
        const newArr = [...prevValue];
        newArr[ind] = {
          ...newArr[ind],
          ServiceId: firstProgramId.id,
          Supplier: firstSupplierId,
          TransportDetails: programList[0]?.Detail || "",
          Remarks: programList[0]?.Detail || "",
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

    if (name == "ServiceId") {
      // mergeTransportRateJson(ind);
      await getTransportPorgramDetails(ind, value, name);
    }
    // setTransportFormValue((prevValue) => {
    //   const newArr = [...prevValue];
    //   newArr[ind] = { ...transportFormValue[ind], [name]: value };
    //   return newArr;
    // });

    setTimeout(() => {
      setIsManualTransportEdit(false);
    }, 100);
  };

  const handleTableIncrement = (index) => {
    const template = transportFormValue[index];
    const transportlist = transportList[index];
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
    setTransportList((prevList) => {
      const newList = [...prevList];
      newList.splice(index + 1, 0, transportlist); // Set Sector to ToDestination name
      return newList;
    });
  };

  const handleTableDecrement = (index) => {
    const filteredTable = transportFormValue?.filter(
      (item, ind) => ind != index
    );
    setTransportFormValue(filteredTable);
  };

  const vehicleCosts = useMemo(() => {
    const costMap = {};

    formattedVehicleList.flat()?.forEach((form) => {
      const costValue = form?.Cost ? parseInt(form?.Cost, 10) || 0 : 0;
      costMap[form?.VehicleTypeId] =
        (costMap[form?.VehicleTypeId] || 0) + costValue;
    });

    return Object.entries(costMap).map(([VehicleTypeId, TotalCost]) => ({
      VehicleTypeId: Number(VehicleTypeId),
      TotalCost,
    }));
  }, [formattedVehicleList]);

  console.log(calculatedRateDetails, "calculatedRateDetails");

  const handleFinalSave = async () => {
    const vehicleTotalCost = Object.keys(calculatedRateDetails).map((key) => ({
      VehicleType: key == "undefined" ? "" : key,
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
    }));
    console.log(vehicleTotalCost, "VEHIskd15");
    const baseVehicleList = vehicleTypeList.map((v) => ({
      VehicleTypeId: v.id,
      Name: v.Name,
      Cost: null,
      isSupplement: "no",
    }));

    const completeFormattedVehicleList = formattedVehicleList.map((list, i) => {
      if (Array.isArray(list) && list.length > 0) {
        // already has vehicle list, return as is
        return list;
      } else {
        // no vehicle data → return full base list with empty cost
        return [...baseVehicleList];
      }
    });

    // console.log(completeFormattedVehicleList,'completeFormattedVehicleList')

    // console.log(transportFormValue, 'transportFormValue')

    const finalForm = transportFormValue?.map((form, index) => {
      if (form?.ServiceId != "") {
        return {
          ...form,
          Hike: hikePercent,
          Sector: fromToDestinationList[index],
          VehicleType: completeFormattedVehicleList[index],
          DayType: "Foreigner",
          TotalVehicleType: vehicleTotalCost,
          DayUniqueId: dayUniqueIds[index] || "",
        };
      } else {
        return null;
      }
    });

    // console.log(finalForm,'finalForm');

    const filteredFinalForm = finalForm?.filter((form) => form != null);

    // console.log(filteredFinalForm, 'filteredFinalForm');
    // const totalCost =
    // formattedVehicleList
    //     .flat()
    //     ?.reduce((sum, item) => sum + Number(item.Cost), 0) *
    //   (1 + hikePercent / 100);

    dispatch(setTotalTransportPricePax(vehicleCosts));

    // console.log(filteredFinalForm, 'filteredFinalForm');

    console.log(filteredFinalForm, "filteredFinalForm3636");

    const updatedVehicleList = filteredFinalForm?.some((day) =>
      day.VehicleType?.some((v) => v?.id)
    )
      ? filteredFinalForm.map((day) => ({
          ...day,
          VehicleType: day.VehicleType.map((v) => {
            const { id, ...rest } = v;
            return { VehicleTypeId: id, ...rest };
          }),
        }))
      : filteredFinalForm;

    try {
      const { data } = await axiosOther.post(
        "updateTransportQuatation",
        updatedVehicleList
      );

      if (data?.status == 1) {
        dispatch(incrementLocalEscortCharges());
        notifySuccess("Services Added !");
        dispatch(setTransportPrice(calculatedRateDetails));
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
  const handleSectorChange = (index, e) => {
    const { value } = e.target;
    setFromToDestinationList((prev) => {
      const newList = [...prev];
      newList[index] = value; // Update Sector with user input
      return newList;
    });
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
  //   console.log("entering itenary dispatch")
  //   if (Type == "Main") {
  //     dispatch(setItineraryTransportData(transportFormValue));
  //   }
  //   console.log("ending itenary dispatch")
  // }, [transportFormValue]);

  function settigCopyFormData(transportForm, passedForm) {
    if (passedForm?.length > 0) {
      setTransportFormValue(passedForm);
    } else {
      setTransportFormValue(transportForm);
    }
  }

  useEffect(() => {
    if (Type != "Main" && transportFormData?.length > 0) {
      settigCopyFormData(transportFormValue, transportFormData);
    }
  }, [Type, transportFormData]);

  const isDataReady =
    transportList.length > 0 &&
    transportSupplierList.length > 0 &&
    vehicleTypeList.length > 0 &&
    transportFormValue.length > 0;

  // useEffect(() => {
  //   if (isFirstValueSet && transportFormValue.length  > 0) {
  //     transportFormValue?.forEach((form, index) => {
  //       console.log("forooror",form,index)
  //         const supplierUid =
  //     transportSupplierList[index] != undefined &&
  //     transportSupplierList[index]?.find((supp) => supp?.id == form?.Supplier);

  //   const transUID =
  //     transportList[index] && transportList[index].length > 0
  //       ? transportList[index].find((transport) => transport?.id == form?.ServiceId )
  //       : "";
  //       getTransportRateApi(
  //         form?.DestinationUniqueId,
  //         supplierUid?.UniqueId ?? "",  // get the actual unique ID
  //         index,
  //         form?.Date,
  //         transUID?.UniqueId ?? ""
  //       );
  //     });
  //   }
  // }, [isFirstValueSet]);

  // getting rate data form api
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
  // console.log();

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
    console.log(
      ToDestination,
      FromDestination,
      TransferType,
      index,
      date,
      serviceId,
      "checkkkkk112333"
    );

    const baseFormattedList = vehicleTypeList.map((v) => ({
      id: v.id,
      Name: v.Name,
      Cost: null,
      isSupplement: "no",
    }));
    console.log(baseFormattedList, vehicleTypeList, "checkvechlist");

    if (serviceId && destination && companyId) {
      const DestinationId =
        TransferType == 6 || TransferType == 2
          ? [Number(FromDestination)]
          : [Number(ToDestination)];
      console.log(DestinationId, serviceId);
      const unqiueid = destinationList?.find(
        (item) => item?.id == DestinationId
      )?.UniqueID;

      try {
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
              Cost: matchedVehicle?.GrandTotal || null,
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

        setTransportFormValue((prevArr) => {
          const newArr = [...prevArr];
          newArr[index] = {
            ...newArr[index],
            Assitance: Assistance,
          };
          return newArr;
        });

        return { updatedList, Assistance };
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

  // useEffect(() => {
  //   transportFormValue?.forEach((form, index) => {
  //     getTransportRateApi(
  //       form?.DestinationUniqueId,
  //       form?.Supplier,
  //       index,
  //       form?.Date,
  //       form?.ServiceId
  //     );
  //   });
  // }, [
  //   transportFormValue?.map((form) => form?.TransferType)?.join(","),
  //   transportFormValue?.map((form) => form?.Destination)?.join(","),
  //   transportFormValue?.map((form) => form?.ServiceId)?.join(","),
  //   transportFormValue?.map((form) => form?.Supplier)?.join(","),
  //   headerDropdown?.Year,
  // ]);

  // creating/removing vehicle form for alternate
  // useEffect(() => {
  //   if (transportCopy) {
  //     if (isAlternate) {
  //       setTransportCopy(true);
  //       const supplementForm = TransportService?.map((form) => {
  //         return {
  //           ...form,
  //           ServiceMainType: "Yes",
  //         };
  //       });
  //       const newFormArr = [...transportFormValue, ...supplementForm];
  //       setTransportFormValue(newFormArr);

  //       const supplementSelectForm = TransportService?.map((item, index) => {
  //         return selectedOptions;
  //       });

  //       const supplementVehicleForm = supplementSelectForm?.map(
  //         (item, index) => {
  //           return item?.map((vehicle, index) => {
  //             return {
  //               VehicleTypeId: vehicle?.value,
  //               Cost: "",
  //               isSupplement: "Yes",
  //               Name: item?.label,
  //             };
  //           });
  //         }
  //       );

  //       setVehicleTypeForm([...vehicleTypeForm, ...supplementVehicleForm]);
  //       setOriginalVehicleTypeForm([
  //         ...vehicleTypeForm,
  //         ...supplementVehicleForm,
  //       ]);
  //     } else {
  //       setTransportCopy(false);
  //       const removedCopiedForm = transportFormValue?.filter(
  //         (form, index) => form?.ServiceMainType == "No"
  //       );
  //       setTransportFormValue(removedCopiedForm);

  //       const removedSupplmentVehicle = vehicleTypeForm?.filter(
  //         (form) => form?.isSupplement == "No"
  //       );
  //       setVehicleTypeForm(removedSupplmentVehicle);
  //       setOriginalVehicleTypeForm(removedSupplmentVehicle);

  //       const remvoedDestList = fromToDestinationList?.filter(
  //         (item, index) => index < TransportService?.length
  //       );
  //       setFromToDestinationList(remvoedDestList);
  //     }
  //   }
  // }, [isAlternate]);

  const handleChange = (selected) => {
    setSelectedOptions(selected);
  };

  // creating vehicle form behalf of vehicle multi select
  //   useEffect(() => {
  //     if (selectedOptions.length > 0) {
  //       const selectedForm = transportFormValue.map((item, index) => {
  //         return selectedOptions;
  //       });

  //       const vehicleForm = selectedForm?.map((item, index) => {
  //         if (vehicleTypeForm.length > 0) {
  //           setIsVehicleForm(!isVehicleForm);
  //           const oneVehicleForm = vehicleTypeForm[index];
  //           return item?.map((vehicle, ind) => {
  //             const vehicleForm1 = oneVehicleForm[ind];
  //             if (vehicle.value == vehicleForm1?.VehicleTypeId) {
  //               return vehicleForm1;
  //             } else {
  //               return {
  //                 VehicleTypeId: vehicle?.value,
  //                 Cost: "",
  //                 isSupplement: "No",
  //                 Name: vehicle?.label,
  //               };
  //             }
  //           });
  //         } else {
  //           setIsVehicleForm(!isVehicleForm);
  //           return item?.map((vehicle, index) => {
  //             return {
  //               VehicleTypeId: vehicle?.value,
  //               Cost: "",
  //               isSupplement: "No",
  //               Name: vehicle?.label,
  //             };
  //           });
  //         }
  //       });
  // console.log("vehicleForm",vehicleForm)
  //       setVehicleTypeForm(vehicleForm);
  //       setOriginalVehicleTypeForm(vehicleForm);
  //     } else {
  //       setVehicleTypeForm([]);
  //       setOriginalVehicleTypeForm([]);
  //     }
  //   }, [selectedOptions]);

  // useEffect(() => {
  //   if (vehicleTypeForm.length > 0) {
  //     // Extract selected vehicle IDs from form
  //     const vehicleId = transportFormValue?.map(
  //       (vehicle) => parseInt(vehicle?.AlternateVehicle) || ""
  //     );

  //     // Filter selected vehicles from vehicleTypeList
  //     const vehicle = vehicleTypeList?.filter((vehicle) =>
  //       vehicleId?.includes(vehicle?.id)
  //     );

  //     // Create selectedVehicle object
  //     const selectedVehicle = vehicle?.map((vehicle) => ({
  //       VehicleTypeId: vehicle?.id,
  //       Cost: "",
  //       IsSupplement: "No",
  //       Name: vehicle?.Name,
  //     }));

  //     const mergingVehicle = vehicleTypeForm?.map((vehicleArr) => {
  //       // Get the IDs of the currently selected multi-options
  //       const idOfMultiSelectedOption = selectedOptions?.map(
  //         (item) => item.value
  //       );

  //       // Get the IDs of the form's selected options
  //       const idOfFormSelectedOption = selectedVehicle?.map(
  //         (item) => item?.VehicleTypeId
  //       );

  //       // Filter out multi-selected and form-selected vehicles
  //       const filteredMultiForm = vehicleArr.filter((item) =>
  //         idOfMultiSelectedOption.includes(item.VehicleTypeId)
  //       );

  //       const filteredSingleForm = vehicleArr.filter((item) =>
  //         idOfFormSelectedOption.includes(item.VehicleTypeId)
  //       );

  //       // Filter new selected vehicles that aren't already in the form
  //       const newSingleVehicleEntry = selectedVehicle.filter(
  //         (item) =>
  //           !vehicleArr.some(
  //             (existingItem) =>
  //               existingItem.VehicleTypeId === item.VehicleTypeId
  //           )
  //       );

  //       // Combine the filtered arrays (removing duplicates)
  //       let allMergedArr = [
  //         ...filteredMultiForm,
  //         ...filteredSingleForm,
  //         ...newSingleVehicleEntry,
  //       ];

  //       // Now remove any vehicles that are unselected (not in selectedOptions)
  //       const cleanedArr = allMergedArr.filter(
  //         (item) =>
  //           idOfMultiSelectedOption.includes(item.VehicleTypeId) ||
  //           idOfFormSelectedOption.includes(item.VehicleTypeId)
  //       );

  //       return cleanedArr;
  //     });

  //     // setVehicleTypeForm(mergingVehicle);
  //   }
  // }, [
  //   transportFormValue?.map((vehicle) => vehicle?.AlternateVehicle).join(","),
  //   isVehicleForm,
  // ]);

  // calculating from destination & to destination
  // useEffect(() => {
  //   const destinations = transportFormValue?.map((transport, index) => {
  //     if (index === 0) {
  //       // For the first day, set "Arrival at {FromDestination}"
  //       return {
  //         From: transport?.FromDestination,
  //         To: transport?.FromDestination,
  //         Sector: `Arrival at ${
  //           destinationList.find(
  //             (dests) => dests?.id == transport?.FromDestination
  //           )?.Name || ""
  //         }`,
  //       };
  //     } else if (index === transportFormValue.length - 1) {
  //       // For the last day, set "Departure from {ToDestination}"
  //       return {
  //         From: transport?.FromDestination,
  //         To: transport?.ToDestination,
  //         Sector: `Departure from ${
  //           destinationList.find(
  //             (dests) => dests?.id == transport?.ToDestination
  //           )?.Name || ""
  //         }`,
  //       };
  //     } else {
  //       // For all other days, check if From and To are the same
  //       const fromName =
  //         destinationList.find(
  //           (dests) => dests?.id == transport?.FromDestination
  //         )?.Name || "";
  //       const toName =
  //         destinationList.find((dests) => dests?.id == transport?.ToDestination)
  //           ?.Name || "";

  //       return {
  //         From: transport?.FromDestination,
  //         To: transport?.ToDestination,
  //         Sector: fromName === toName ? fromName : `${fromName} To ${toName}`,
  //       };
  //     }
  //   });

  //   const fromToDestination = destinations?.map((item) => item?.Sector || "");
  //   setFromToDestinationList(fromToDestination);
  // }, [
  //   transportFormValue
  //     ?.map(
  //       (transport) => transport?.FromDestination + transport?.ToDestination
  //     )
  //     .join(","),
  //   destinationList,
  // ]);
  useEffect(() => {
    console.log("this functioncalls");

    if (
      isManualTransportEdit ||
      transportFormValue?.some((item) => item?.isCopied)
    ) {
      return;
    }
    console.log("functioncalls");
    const hasTransportService = qoutationDataLocal?.Days?.some((day) =>
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
    qoutationDataLocal?.Days,

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
  };

  console.log(formattedVehicleList, "formattedVehicleList");

  // multiplying price to NoOfVehicle
  useEffect(() => {
    if (formattedVehicleList.length > 0 && noOfVehicleIndex != "") {
      const mainJson = [...transportFormValue];
      const vehicleJson = [...formattedVehicleList];
      mainJson.forEach((day, index) => {
        const noOfVehicles = parseInt(day.NoOfVehicle) || 1;
        if (index == noOfVehicleIndex) {
          let updated = orignalVehicleTypeForm[noOfVehicleIndex].map(
            (vehicle) => {
              const vehicleCost = parseFloat(vehicle.Cost) || 0;
              let cost = noOfVehicles * vehicleCost;
              return {
                ...vehicle,
                Cost: cost,
              };
            }
          );
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
        return item?.VehicleTypeId == name
          ? { ...item, isSupplement: checked ? "Yes" : "No" }
          : item;
      });
    });

    setFormattedVehicleList(updatedVehicle);
    setOriginalVehicleTypeForm(updatedVehicle);
  };

  const handleHikeChange = (e) => {
    const { value } = e.target;
    setHikePercent(value);

    const updatedForm = orignalVehicleTypeForm?.map((form) => {
      return form?.map((vehicle) => ({
        ...vehicle,
        Cost:
          vehicle?.Cost && !isNaN(vehicle?.Cost)
            ? Math.floor(
                parseFloat(vehicle?.Cost) +
                  (parseFloat(vehicle?.Cost) * value) / 100
              )
            : vehicle?.Cost,
      }));
    });
    setFormattedVehicleList(updatedForm);
    // setOriginalVehicleTypeForm(updatedForm);
  };

  // useEffect(() => {
  //   const calculateTotalCostWithMarkup = (
  //     vehicleForm,
  //     markupPercent,
  //     originalForm
  //   ) => {
  //     const vehicleCostMap = {};
  //     const vehicleCostWithMarkup = {};

  //     vehicleForm?.forEach((dayVehicles) => {
  //       dayVehicles?.forEach((vehicle) => {
  //         const vehicleId = vehicle.VehicleTypeId || vehicle.id;
  //         const vehicleCost = parseFloat(vehicle.Cost) || 0;

  //         console.log(vehicleCost, "vehicleCost");

  //         if (vehicleCostMap[vehicleId]) {
  //           vehicleCostMap[vehicleId] += vehicleCost;
  //         } else {
  //           vehicleCostMap[vehicleId] = vehicleCost;
  //         }
  //       });
  //     });
  //     console.log(vehicleCostMap, "vehicleCostMap");

  //     originalForm?.forEach((dayVehicles) => {
  //       dayVehicles?.forEach((vehicle) => {
  //         const vehicleId = vehicle.VehicleTypeId || vehicle.id;
  //         const vehicleCost = parseFloat(vehicle.Cost) || 0;
  //         const totalCost = vehicleCostMap[vehicleId] || 0;
  //         const markup = (totalCost * markupPercent) / 100;
  //         vehicleCostWithMarkup[vehicleId] = {
  //           totalCost,
  //           markup,
  //           totalCostWithMarkup: totalCost + markup,
  //           markupWithHike: (totalCost * 5) / 100,
  //         };
  //       });
  //     });
  //     console.log(vehicleForm, "vehicleForm");

  //     return vehicleCostWithMarkup;
  //   };

  //   const filteredVehicleForm = transportFormValue
  //     ?.map((form, index) => {
  //       if (form?.ServiceId != "") {
  //         return formattedVehicleList[index];
  //       } else {
  //         return null;
  //       }
  //     })
  //     .filter((form) => form != null);

  //   const calculatedRateWithMarkup = calculateTotalCostWithMarkup(
  //     filteredVehicleForm,
  //     hikePercent,
  //     // orignalVehicleTypeForm
  //     formattedVehicleList
  //   );
  //   console.log(calculatedRateWithMarkup, "calculatedRateWithMarkup");

  //   setCalculatedRateDetails(calculatedRateWithMarkup);
  // }, [
  //   hikePercent,
  //   formattedVehicleList,
  //   transportFormValue?.map((form) => form?.ServiceId).join(","),
  // ]);
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
  console.log(calculatedRateDetails, "calculatedRateDetails");

  // useEffect(() => {
  const totalAssistance = transportFormValue?.reduce((sum, item) => {
    return sum + (Number(item.Assitance) || 0);
  }, 0);

  const markupPercent = 5;
  const markupValue = totalAssistance * (markupPercent / 100);
  const grandTotal = totalAssistance + markupValue;
  // }, [
  //   // hikePercent,
  //   transportFormValue?.map((form) => form?.Assitance).join(","),
  // ]);

  // useEffect(() => {
  //   if (isManualTransportEdit) return;
  //   setTransportFormValue((prevArr) => {
  //     const updatedArr = prevArr?.map((item, index) => {
  //       // For all indices except the last one, set ToDestination to the next FromDestination
  //       if (index === 0) {
  //         return {
  //           ...item,
  //           FromDestination:
  //             qoutationDataLocal?.Days[index]?.DestinationId || "",
  //           ToDestination: item?.FromDestination || "",
  //         };
  //       } else if (index > 0 && index < prevArr.length - 1) {
  //         return {
  //           ...item,
  //           FromDestination: prevArr[index - 1]?.ToDestination,
  //           ToDestination: qoutationDataLocal?.Days[index]?.DestinationId || "",
  //         };
  //       } else {
  //         return {
  //           ...item,
  //           FromDestination: prevArr[0]?.ToDestination,
  //           ToDestination: qoutationDataLocal?.Days[index]?.DestinationId || "",
  //         };
  //       }
  //     });
  //     return updatedArr;
  //   });
  // }, [transportFormValue?.map((item) => item?.FromDestination).join(",")]);

  const handleIsOpen = () => {
    if (dataIsLoaded) {
      dispatch({
        type: "SET_TRANSPORT_DATA_LOAD",
        payload: true,
      });
      setDataIsLoaded(false);
    }

    setIsOpen({ ...isOpen, original: !isOpen.original });
  };

  // ============ Copy logic
  const [copyChecked, setCopyChecked] = useState(false);

  const transportData = useSelector(
    (state) => state.itineraryServiceCopyReducer.transportData
  );
  console.log(transportData, "transportData1");

  const [copyTransportFormValue, setCopyTransportFormValue] = useState([]);

  const additionalCheckbox = useSelector(
    (state) => state.itineraryServiceCopyReducer.additionalCheckbox
  );

  // console.log(transportData, 'transportFormValue')

  // Copy data from main
  // console.log(qoutationData?.Days,"qoutationData?.Days");

  const handleCopyDataFromMain = async (e) => {
    const { checked } = e.target;
    // if(!checked) return

    // Step 1: Build initial form value and vehicle forms
    const initialFormValue = [];
    const vehicleForms = [];
    const transportInitialValue = [];

    quotationData?.Days?.forEach((day, ind) => {
      const transportServices = day?.DayServices?.filter(
        (service) =>
          service?.ServiceType === "Transport" &&
          service.ServiceMainType === "Guest"
      );

      const dayTravelData =
        queryData?.QueryAllData?.TravelDateInfo?.TravelData?.filter(
          (travel) => travel.DayNo === day.Day
        );

      const occurrenceIndex = quotationData?.Days.slice(0, ind).filter(
        (d) => d.Day === day.Day
      ).length;

      const travelDataEntry =
        (dayTravelData && dayTravelData[occurrenceIndex]) ||
        dayTravelData?.[0] ||
        {};

      transportServices?.forEach((service) => {
        const { TimingDetails, ItemSupplierDetail } =
          service?.ServiceDetails?.flat?.(1)?.[0] || {};

        const transferTypeId = service?.TransferTypeId
          ? parseInt(service.TransferTypeId)
          : "";
        // console.log(service?.TransferTypeId,transferTypeId,"transferTypeId");

        initialFormValue.push({
          id: queryData?.QueryId,
          QuatationNo: quotationData?.QuotationNumber,
          DayType: Type,
          DayNo: day.Day,
          Date: day?.Date,
          DestinationUniqueId: day?.DestinationUniqueId,
          FromDay: "",
          ToDay: "",
          FromDestination: service?.FromDestinationId || day?.DestinationId,
          ToDestination: service?.ToDestinationId,
          TransferType: transferTypeId,
          Mode: service?.Mode || travelDataEntry?.Mode || "",
          Escort: 1,
          Supplier: ItemSupplierDetail?.ItemSupplierId || "",
          TransportDetails: service?.TransportDetails || "",
          Remarks: service?.TransportDetails || "",
          AlternateVehicle: service?.AlternateVehicle || "",
          CostType: service?.CostType || "",
          NoOfVehicle: service?.NoOfVehicle !== "" ? service?.NoOfVehicle : 1,
          Cost: service?.ServicePrice || "",
          AlternateVehicleId: service?.AlterVehicleId || "",
          AlternateVehicleCost: service?.AlternateVehicleCost || "",
          NoOfDay: service?.NoOfDay || "",
          ServiceId: service?.ServiceId || "",
          ItemFromDate: TimingDetails?.ItemFromDate || "",
          ItemToDate: TimingDetails?.ItemToDate || "",
          ItemFromTime: TimingDetails?.ItemFromTime || "",
          ItemToTime: TimingDetails?.ItemToTime || "",
          ServiceMainType: "No",
          RateUniqueId: "",
          Assitance: service?.Assitance || "",
          PaxInfo: {
            Adults: quotationData?.Pax?.AdultCount || 0,
            Child: quotationData?.Pax?.ChildCount || 0,
            Infant: quotationData?.Pax?.Infant || 0,
            Escort: service?.PaxDetails?.PaxInfo?.Escort || "",
          },
          ForiegnerPaxInfo: {
            Adults: service?.ForiegnerPaxInfo?.PaxInfo?.Adults || 0,
            Child: service?.ForiegnerPaxInfo?.PaxInfo?.Child || 0,
            Infant: service?.ForiegnerPaxInfo?.PaxInfo?.Infant || 0,
            Escort: service?.ForiegnerPaxInfo?.PaxInfo?.Escort || "",
          },
        });

        if (service?.VehicleType?.length) {
          vehicleForms.push(
            service.VehicleType.map((vehicle) => ({
              id: vehicle?.VehicleTypeId || "",
              Cost: vehicle?.Cost || "",
              isSupplement: vehicle?.isSupplement || false,
              Name: vehicle?.VehicleTypeName || vehicle.Name || "",
              VehicleTypeId: vehicle?.VehicleTypeId || "",
            }))
          );
        } else {
          vehicleForms.push([]);
        }

        transportInitialValue.push({
          ...itineraryTransportInitialValue,
          id: queryData?.QueryId,
          DayType: Type,
          DayNo: day.Day,
          Date: day?.Date,
          DestinationUniqueId: day?.DestinationUniqueId,
          QuatationNo: quotationData?.QuotationNumber,
          FromDestination: day?.DestinationId,
          ItemFromDate: quotationData?.TourSummary?.FromDate,
          ItemToDate: quotationData?.TourSummary?.ToDate,
          RateUniqueId: "",
          PaxInfo: {
            Adults: quotationData?.Pax?.AdultCount || 0,
            Child: quotationData?.Pax?.ChildCount || 0,
            Infant: quotationData?.Pax?.Infant || 0,
            Escort: "",
          },
        });
      });
    });

    // Step 2: Update transportFormValue and copyTransportFormValue
    setTransportFormValue(initialFormValue);
    setCopyTransportFormValue(initialFormValue);

    // Step 3: Handle checkbox logic
    if (checked) {
      console.log(initialFormValue, "initialFormValue");

      const updatedAdditional = initialFormValue?.map((service, index) => {
        const transportDataItem = transportData?.TransportForm?.[index] || {};
        const { DayUniqueId, ...restTransportData } = transportDataItem;
        console.log(
          service?.TransferType,
          restTransportData?.TransferType,
          "restTransportData?.TransferType"
        );

        return {
          ...restTransportData,
          DayType: "Foreigner",
          TransferType:
            service?.TransferType || restTransportData?.TransferType || "",
          ServiceId: service?.ServiceId || restTransportData?.ServiceId || "",
          FromDestination:
            service?.FromDestination ||
            restTransportData?.FromDestination ||
            "",
          Mode: service?.Mode || restTransportData?.Mode || "",
        };
      });

      // Step 4: Fetch transportList for dropdowns with loader
      setIsLoading(true); // Start loader
      try {
        const allTransportLists = [];
        const allSupplierLists = [];

        for (let index = 0; index < updatedAdditional.length; index++) {
          const item = updatedAdditional[index];
          console.log(item?.ToDestination, "ToDestination");
          console.log(item?.TransferType, "TransferType11");

          // if(!item?.ToDestination) return
          const { data } = await axiosOther.post("transportmasterlist", {
            DestinationId: item?.ToDestination || "",
            Default: "Yes",
            TransferType: item?.TransferType || "",
            TransportType: item?.Mode || "",
          });
          allTransportLists[index] = item?.TransferType
            ? data?.DataList || []
            : [];

          const { data: supplierData } = await axiosOther.post("supplierlist", {
            Name: "",
            id: "",
            SupplierService: [4],
            DestinationId: [Number(item?.ToDestination) || 0],
          });
          allSupplierLists[index] = supplierData?.DataList || [];
        }

        setTransportList(allTransportLists);
        setTransportSupplierList(allSupplierLists);
      } catch (error) {
        console.error("Error fetching transport lists:", error);
        notifyError("Failed to fetch transport data");
      } finally {
        setIsLoading(false); // Stop loader
      }

      setTransportFormValue(updatedAdditional);

      const formattedVehicles =
        vehicleForms?.[0]?.length > 0
          ? vehicleForms[0].map((vehicle) => ({
              label: vehicle?.Name || "",
              value: vehicle?.VehicleTypeId || vehicle?.id || "",
              Cost: vehicle?.Cost || "",
            }))
          : transportData?.FormattedVehicleList?.[0]?.length > 0
          ? transportData.FormattedVehicleList[0].map((vehicle) => ({
              label: vehicle?.Name || "",
              value: vehicle?.id || "",
              Cost: vehicle?.Cost || "",
            }))
          : [];

      setSelectedOptionSecond(
        transportData?.SelectedOptionVehicle?.length > 0
          ? transportData.SelectedOptionVehicle
          : formattedVehicles
      );

      setFormattedVehicleList(
        transportData?.FormattedVehicleList || vehicleForms
      );
      setOriginalVehicleTypeForm(
        transportData?.FormattedVehicleList || vehicleForms
      );

      setCopyChecked(true);
      dispatch(setItineraryCopyTransportFormDataCheckbox({ Foreigner: false }));
    } else {
      setCopyChecked(false);
    }

    setData((prev) => !prev);
  };

  // Loader Component
  const Loader = () => (
    <div className="loader-container">
      <div className="spinner"></div>
      <p>Loading transport data...</p>
    </div>
  );
  console.log(selectedOptionsSecond, "selectedOptionsSecondcheck11");
  console.log(formattedVehicleList, "selectedOptionsSecondcheck");
  // console.log(selectedOptionsSecond,"");

  // useEffect(()=>{
  //   console.log(quotationData,"0011");

  //      handleCopyDataFromMain()

  // },[quotationData,transportFormValue,queryData?.QueryId])
  console.log(transportFormValue, "transportFormValueout");

  return (
    <>
      {isLoading && <IsDataLoading />}
      <div className="row mt-3 m-0">
        <div
          className="col-12 px-1 py-2 d-flex justify-content-between itinerary-head-bg foreignerEscort-head-bg"
          onClick={handleIsOpen}
        >
          <div className="d-flex gap-4 align-items-center">
            <div className="d-flex gap-2">
              <img src={TransportIcon} alt="GuideIcon" />
              <label htmlFor="" className="fs-5">
                Transport
              </label>
            </div>
            <div
              className="d-flex gap-1 form-check"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="checkbox"
                className="form-check-input check-md"
                id="copy-guide"
                checked={copyChecked}
                onChange={(e) => handleCopyDataFromMain(e)}
              />
              <label className="fontSize11px m-0 ms-1" htmlFor="copy-guide">
                Copy
              </label>
            </div>
          </div>
          <div
            className="d-flex gap-4 align-items-center transport-select ms-auto"
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
                        className="text-center align-middle py-1 days-width-9 "
                        rowSpan={2}
                        style={{ width: "100px" }}
                      >
                        {transportFormValue[0]?.Date ? "Day / Date" : "Day"}
                      </th>
                      {(Type == "Foreigner" || Type == "Foreigner") && (
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
                      {/* <th rowSpan={2} className="align-middle py-1">
                        Program Details
                      </th> */}
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
                      {console.log(
                        formattedVehicleList,
                        "formattedVehicleListinhtml"
                      )}

                      {formattedVehicleList[0]?.length > 0 &&
                        formattedVehicleList[0].map((form, index) => {
                          const isSelected = selectedOptions.some(
                            (opt) => opt.Name === form.label
                          );

                          console.log("selectedOptions:", selectedOptions);
                          console.log("current form:", form);
                          console.log(
                            "isSelected:",
                            isSelected,
                            "for index:",
                            index
                          );

                          return (
                            <th
                              rowSpan={2}
                              className={`align-middle ${
                                isSelected ? "" : "d-none"
                              }`}
                            >
                              <div className="d-flex gap-1 justify-content-center align-items-center">
                                <div className="form-check check-sm d-flex align-items-center gap-1">
                                  <input
                                    type="checkbox"
                                    className="form-check-input height-em-1 width-em-1"
                                    id={form?.VehicleTypeId}
                                    name={form?.VehicleTypeId}
                                    // checked={form?.VehicleTypeId == headerDropdown.Transfer?true:false}
                                    // onChange={(e) => handleHotelCheckBox(e, "original")}
                                    onChange={handleVehicleChecboxChange}
                                  />
                                  <label
                                    htmlFor={form?.VehicleTypeId}
                                    style={{ fontSize: "11px" }}
                                    className="mt-1"
                                  >
                                    {form?.Name}
                                  </label>
                                </div>
                              </div>
                            </th>
                          );
                        })}
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
                              {/* <div className="sector-width-6">
                                  <span>{fromToDestinationList[index]}</span>
                                </div> */}
                            </td>

                            <td className="sector-width-6">
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
                            {/* <td>
                              <div>
                                <input
                                  type="text"
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
                            </td> */}
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
                              <div>
                                <select
                                  name="CostType"
                                  id=""
                                  className="formControl1"
                                  value={
                                    transportFormValue[originalIndex]?.CostType
                                  }
                                  onChange={(e) =>
                                    handleTransportChange(originalIndex, e)
                                  }
                                >
                                  <option value="Package Cost">
                                    Package Cost
                                  </option>
                                  <option value="Per Day Cost">
                                    Per Day Cost
                                  </option>
                                </select>
                              </div>
                            </td>
                            {isVehicleType?.original && (
                              <td>
                                <div>
                                  <input
                                    type="number"
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
                                  type="number"
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
                                        className="formControl1"
                                        value={
                                          vehicleTypeForm[originalIndex][ind]
                                            ?.Cost
                                        }
                                        name={
                                          vehicleTypeForm[originalIndex]
                                            ?.VehicleTypeId
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
                              formattedVehicleList[originalIndex]?.map(
                                (vehicle, ind) => {
                                  const isSelected = selectedOptions?.some(
                                    (opt) => opt.Name == vehicle.label
                                  );
                                  console.log(originalIndex, "originalIndex");

                                  console.log(
                                    formattedVehicleList[originalIndex]?.map(
                                      (vehicle, ind) => vehicle
                                    ),
                                    "vehicle.VehicleTypeId"
                                  );

                                  console.log(
                                    vehicle.VehicleTypeId,
                                    selectedOptions,
                                    isSelected,
                                    "checkselected"
                                  );

                                  return (
                                    <td
                                      key={vehicle.id}
                                      className={isSelected ? "" : "d-none"}
                                    >
                                      <div>
                                        <input
                                          type="number"
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
                              )}
                          </tr>
                        );
                      })}
                    <tr className="costing-td">
                      <td
                        colSpan={
                          Type == "Foreigner"
                            ? 10
                            : Type == "Local"
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
                        {mathRoundHelper(totalAssistance && totalAssistance)}
                      </td>
                      {formattedVehicleList?.length > 0 &&
                        formattedVehicleList[0]?.map((options, index) => {
                          const isSelected = selectedOptions?.some(
                            (opt) => opt.Name === options.label
                          );
                          console.log(calculatedRateDetails, "checkoptionssss");

                          return (
                            <td
                              key={index}
                              className={isSelected ? "" : "d-none"}
                            >
                              {mathRoundHelper(
                                calculatedRateDetails[
                                  options?.VehicleTypeId || options?.id
                                ]?.totalCost
                              )}
                            </td>
                          );
                        })}
                    </tr>
                    <tr className="costing-td">
                      <td colSpan={2}>Markup(5) %</td>
                      <td>{mathRoundHelper(markupValue && markupValue)}</td>
                      {formattedVehicleList?.length > 0 &&
                        formattedVehicleList[0]?.map((options, index) => {
                          const isSelected = selectedOptions?.some(
                            (opt) => opt.Name == options.label
                          );
                          return (
                            <td
                              key={index}
                              className={isSelected ? "" : "d-none"}
                            >
                              {mathRoundHelper(
                                calculatedRateDetails[
                                  options?.VehicleTypeId || options?.id
                                ]?.markupWithHike
                              )}
                            </td>
                          );
                        })}
                    </tr>
                    <tr className="costing-td">
                      <td colSpan={2}>Total</td>
                      <td>{mathRoundHelper(grandTotal && grandTotal)}</td>
                      {formattedVehicleList[0]?.length > 0 &&
                        formattedVehicleList[0].map((form, index) => {
                          const isSelected = selectedOptions?.some(
                            (opt) => opt.Name == form?.label
                          );
                          const totalCostWithMarkup = parseFloat(
                            calculatedRateDetails[
                              form?.VehicleTypeId || form?.id
                            ]?.totalCostWithMarkup || 0
                          );
                          const markup = parseFloat(
                            calculatedRateDetails[
                              form?.VehicleTypeId || form?.id
                            ]?.markup || 0
                          );
                          dispatch(
                            setTransportPrice(totalCostWithMarkup + markup)
                          );

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
      {transportCopy && (
        <div className="row mt-3 m-0">
          <div
            className="col-12 px-1 py-2 d-flex justify-content-between itinerary-head-bg foreignerEscort-head-bg"
            onClick={() => setIsOpen({ ...isOpen, copy: !isOpen?.copy })}
          >
            <div className="d-flex gap-4 align-items-center">
              <div className="d-flex gap-2">
                <img src={TransportIcon} alt="GuideIcon" />
                <label htmlFor="" className="fs-5">
                  Transport Upgrade
                </label>
              </div>
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
                  value={hikePercent}
                  className={`formControl3`}
                />
                <span className="fs-6">%</span>
              </div>
            </div>

            <div className="d-flex gap-4">
              <div className="form-check check-sm d-flex gap-2 align-items-center">
                <input
                  type="checkbox"
                  className="form-check-input height-em-1 width-em-1"
                  id={`transport_vehicle_types`}
                  onChange={(e) =>
                    setIsVehicleType({
                      ...isVehicleType,
                      copy: e.target.checked,
                    })
                  }
                  checked={isVehicleType?.copy}
                />
                <label
                  className="fontSize11px m-0 p-0 mt-1"
                  htmlFor="transport_vehicle_types"
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
                  onClick={() => setIsAlternate(false)}
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
                {!isOpen?.copy ? (
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
              <div className="col-12 px-0 mt-2">
                <div className={`${styles.scrollContainer}`}>
                  <table class="table table-bordered itinerary-table">
                    <thead>
                      <tr>
                        <th
                          className="text-center align-middle py-1 days-width-9"
                          rowSpan={2}
                        >
                          {transportFormValue[0]?.Date ? "Day / Date" : "Day"}
                        </th>
                        {(Type == "Local" || Type == "Foreigner") && (
                          <th rowSpan={2} className="py-1 align-middle">
                            Escort
                          </th>
                        )}
                        <th colSpan={2} className="py-1 sector-width-6">
                          Sector
                        </th>
                        <th rowSpan={2} className="align-middle py-1">
                          Program Type
                        </th>
                        <th rowSpan={2} className="align-middle py-1">
                          Program
                        </th>
                        <th rowSpan={2} className="align-middle py-1">
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
                        {isVehicleType?.copy && (
                          <th rowSpan={2} className="align-middle py-1">
                            No of Vehicle
                          </th>
                        )}
                        {selectedOptions?.map((select) => {
                          return (
                            <th rowSpan={2} className="align-middle">
                              {select?.label}
                            </th>
                          );
                        })}
                      </tr>
                      <tr>
                        <th className="py-1">From</th>
                        <th className="py-1 sector-width-6">To</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transportFormValue
                        ?.map((form, index) => ({
                          item: form,
                          originalIndex: index,
                        }))
                        ?.filter(({ item }) => item?.ServiceMainType === "Yes")
                        ?.map(({ item, originalIndex }, index) => {
                          return (
                            <tr key={index + 1}>
                              <td>
                                <div className="d-flex gap-1 justify-content-start days-width-9">
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
                                      // onFocus={() => handleFocus(index + "a")}
                                      // onBlur={handleBlur}
                                      value={
                                        transportFormValue[originalIndex]
                                          ?.Escort
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
                                    {destinationList?.map((dest, index) => {
                                      return (
                                        <option
                                          value={dest?.id}
                                          key={index + 1}
                                        >
                                          {dest?.Name}
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
                                    {destinationList?.map((dest, index) => {
                                      return (
                                        <option
                                          value={dest?.id}
                                          key={index + 1}
                                        >
                                          {dest?.Name}
                                        </option>
                                      );
                                    })}
                                  </select>
                                </div>
                                {/* <div className="sector-width-6">
                                  <span>{fromToDestinationList[index]}</span>
                                </div> */}
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
                                    {transferTypeList?.map(
                                      (transfer, index) => {
                                        return (
                                          <option
                                            value={transfer?.id}
                                            key={index + "s"}
                                          >
                                            {transfer?.Name}
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
                                    name="ServiceId"
                                    id=""
                                    className="formControl1"
                                    value={
                                      transportFormValue[originalIndex]
                                        ?.ServiceId
                                    }
                                    onChange={(e) =>
                                      handleTransportChange(originalIndex, e)
                                    }
                                  >
                                    <option value="">Select</option>
                                    {transportList[index]?.map(
                                      (transport, index) => {
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
                              <td>
                                <div>
                                  <input
                                    type="text"
                                    className="formControl1"
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
                                      transportFormValue[originalIndex]
                                        ?.Supplier
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
                                    name="VehicleType"
                                    id=""
                                    className="formControl1"
                                    value={
                                      transportFormValue[originalIndex]
                                        ?.VehicleType
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
                                <div>
                                  <select
                                    name="CostType"
                                    id=""
                                    className="formControl1"
                                    value={
                                      transportFormValue[originalIndex]
                                        ?.CostType
                                    }
                                    onChange={(e) =>
                                      handleTransportChange(originalIndex, e)
                                    }
                                  >
                                    <option value="Package Cost">
                                      Package Cost
                                    </option>
                                    <option value="Per Day Cost">
                                      Per Day Cost
                                    </option>
                                  </select>
                                </div>
                              </td>
                              {isVehicleType?.copy && (
                                <td>
                                  <div>
                                    <input
                                      type="number"
                                      name="NoOfVehicle"
                                      className="formControl1"
                                      value={
                                        transportFormValue[originalIndex]
                                          ?.NoOfVehicle
                                      }
                                      onChange={(e) =>
                                        handleTransportChange(
                                          originalIndex,
                                          ind,
                                          e
                                        )
                                      }
                                    />
                                  </div>
                                </td>
                              )}
                              {vehicleTypeForm[originalIndex]?.map(
                                (form, ind) => {
                                  return (
                                    <td>
                                      <div>
                                        <input
                                          type="number"
                                          className="formControl1"
                                          value={
                                            transportFormValue[originalIndex]
                                              ?.NoOfVehicle *
                                            vehicleTypeForm[originalIndex][ind]
                                              ?.Cost
                                          }
                                          name={
                                            vehicleTypeForm[originalIndex]?.id
                                          }
                                          onChange={(e) =>
                                            handleVehicleTypeChange(
                                              originalIndex,
                                              ind,
                                              e
                                            )
                                          }
                                        />
                                      </div>
                                    </td>
                                  );
                                }
                              )}
                            </tr>
                          );
                        })}
                      <tr className="costing-td">
                        <td
                          // colSpan={
                          //   Type == "Foreigner" ? 11 : Type == "Foreigner" ? 11 : 9
                          // }
                          colSpan={
                            Type == "Foreigner"
                              ? 11
                              : Type == "Foreigner"
                              ? isVehicleType?.copy
                                ? 12
                                : 11
                              : isVehicleType?.copy
                              ? 10
                              : 9
                          }
                          rowSpan={3}
                          className="text-center fs-6"
                        >
                          Total
                        </td>
                        <td colSpan={2}>Transport Cost</td>
                        {selectedOptions?.map((options, index) => {
                          return (
                            <td key={index}>
                              {mathRoundHelper(
                                calculatedRateDetails[options?.value]?.totalCost
                              )}
                            </td>
                          );
                        })}
                      </tr>
                      <tr className="costing-td">
                        <td colSpan={2}>Markup(5) %</td>

                        {selectedOptions?.map((options, index) => {
                          return (
                            <td key={index}>
                              {mathRoundHelper(
                                calculatedRateDetails[options?.value]?.markup
                              )}
                            </td>
                          );
                        })}
                      </tr>
                      <tr className="costing-td">
                        <td colSpan={2}>Total</td>
                        {selectedOptions?.map((options, index) => {
                          const totalCostWithMarkup = parseFloat(
                            calculatedRateDetails[options?.value]
                              ?.totalCostWithMarkup || 0
                          );
                          const markup = parseFloat(
                            calculatedRateDetails[options?.value]?.markup || 0
                          );

                          const totalWithMarkup = totalCostWithMarkup + markup;

                          return (
                            <td key={index}>
                              {mathRoundHelper(totalWithMarkup.toFixed(2))}
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
      )}

      {isOpen?.original && (
        <div className="row mt-1">
          <div className="col-12 d-flex justify-content-end align-items-end">
            <button
              className="btn btn-primary py-1 px-2 radius-4"
              onClick={handleFinalSave}
            >
              <i className="fa-solid fa-floppy-disk fs-4"></i>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(ForeignerTransport);
