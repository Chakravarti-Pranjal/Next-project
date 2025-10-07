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
import { Mode } from "@mui/icons-material";

import styles from "../itinerary-transport/index.module.css";
import { addQueryContext } from "../../createQuery";
import { quotationData } from "../../qoutation-first/quotationdata";
// import TransportUpgrade from "./option-transport/transportUpgrade";
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
// import { addQueryContext } from "../../createQuery/index.jsx";

const Transport = ({
  Type,
  outstation,
  headerDropdown,
  transportFormValue,
  setTransportFormValue,
  TabId,
}) => {
  const {
    qoutationData,
    queryData,
    isItineraryEditing,
    dayTypeArr,
    payloadQueryData,
  } = useSelector((data) => data?.queryReducer);
  console.log(TabId, "TabId");


  const { TourSummary } = qoutationData;
  const dispatch = useDispatch();

  const [transferTypeList, setTransferTypeList] = useState([]);
  const [copyChecked, setCopyChecked] = useState(false);
  const [transportList, setTransportList] = useState([]);
  const [transportSupplierList, setTransportSupplierList] = useState([]);
  const [destinationList, setDestinationList] = useState([]);
  const [vehicleTypeList, setVehicleTypeList] = useState([]);
  const [baseFormattedList, setBaseFormattedList] = useState([]);
  const { transportFormData } = useSelector((data) => data?.itineraryReducer);
  const [rateList, setRateList] = useState([]);
  const [data, setData] = useState(false);
  const [formattedVehicleList, setFormattedVehicleList] = useState([]);
  const [isManualTransportEdit, setIsManualTransportEdit] = useState(false);

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

  const [dataIsLoaded, setDataIsLoaded] = useState(true);
  const [isDayServices, setIsDayServices] = useState(false);
  const [vehicleRateData, setVehicleRateData] = useState([]); // Store API response
  const [selectedVehicleTypes, setSelectedVehicleTypes] = useState([]); // Track checked vehicles

  const transportData = useSelector(
    (state) => state.itineraryServiceCopyReducer.transportData
  );

  const apiDataLoad = useSelector(
    (state) => state.inineraryServiceDataLoadReducer.transport
  );
  const { OptionQoutationData } = useSelector(
    (data) => data?.activeTabOperationReducer
  );
  console.log(OptionQoutationData, "OptionQoutationData");
  const hasTransportService = qoutationData?.Days?.some((day) =>
    day?.DayServices?.some((service) => service.ServiceType === "Transport")
  );
  console.log(hasTransportService, "hasTransportService2");


  useEffect(() => {

    if (OptionQoutationData?.Days) {
      const hasTransportService = OptionQoutationData?.Days?.some((day) =>
        day?.DayServices?.some((service) => service.ServiceType === "Transport")
      );


      console.log(hasTransportService, "hasTransportService");


      if (hasTransportService) {
        const initialFormValue = OptionQoutationData?.Days?.filter(
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
          const service = day?.DayServices?.find(
            (service) => service?.ServiceType === "Transport"
          );
          const dayTravelData =
            queryData?.QueryAllData?.TravelDateInfo?.TravelData?.filter(
              (travel) => travel.DayNo === day.Day
            );
          const occurrenceIndex = OptionQoutationData?.Days.slice(0, ind).filter(
            (d) => d.Day === day.Day
          ).length;
          const travelDataEntry =
            (dayTravelData && dayTravelData[occurrenceIndex]) ||
            dayTravelData?.[0] ||
            {};
          const { TimingDetails } = service?.ServiceDetails?.flat?.(1)?.[0] || {};

          return {
            id: queryData?.QueryId,
            QuatationNo: OptionQoutationData?.QuotationNumber,
            DayType: Type,
            DayNo: day.Day,
            Date: day?.Date,
            DayUniqueId: day?.DayUniqueId,
            DestinationUniqueId: day?.DestinationUniqueId,
            FromDay: "",
            ToDay: "",
            FromDestination: service?.FromDestinationId || day?.DestinationId,
            ToDestination: service?.ToDestinationId,
            TransferType: service?.TransferTypeId,
            Mode: service?.Mode,
            Escort: 1,
            Supplier: service?.SupplierId,
            TransportDetails: service?.TransportDetails,
            Remarks: service?.TransportDetails,
            AlternateVehicle: service?.AlternateVehicle,
            CostType: service?.CostType,
            NoOfVehicle: service?.NoOfVehicle != "" ? service?.NoOfVehicle : 1,
            Cost: service?.ServicePrice || "",
            AlternateVehicle: service?.AlterVehicleId,
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
              Adults: OptionQoutationData?.Pax?.AdultCount,
              Child: OptionQoutationData?.Pax?.ChildCount,
              Infant: OptionQoutationData?.Pax?.Infant,
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
        const vehicleForms = qoutationData?.Days?.map((day) => {
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
        setSelectedOptionSecond(formattedVehicles);
        setFormattedVehicleList(vehicleForms);
        setOriginalVehicleTypeForm(vehicleForms);

        const transportInitialValue = qoutationData?.Days?.map((day, ind) => {
          return {
            ...itineraryTransportInitialValue,
            id: queryData?.QueryId,
            DayType: Type,
            DayNo: day.Day,
            Date: day?.Date,
            DestinationUniqueId: day?.DestinationUniqueId,
            QuatationNo: OptionQoutationData?.QuotationNumber,
            DayUniqueId: day?.DayUniqueId,
            FromDestination: day?.DestinationId,
            ItemFromDate: OptionQoutationData?.TourSummary?.FromDate,
            ItemToDate: OptionQoutationData?.TourSummary?.ToDate,
            RateUniqueId: "",
            PaxInfo: {
              Adults: OptionQoutationData?.Pax?.AdultCount,
              Child: OptionQoutationData?.Pax?.ChildCount,
              Infant: OptionQoutationData?.Pax?.Infant,
              Infant: "",
              Escort: "",
            },
          };
        });
        setTransportFormValue(initialFormValue);

        dispatch(setTransportServiceForm(transportInitialValue));
        setIsDayServices(true);
      } else {
        console.log("HYT70", qoutationData?.Days);
        const transportInitialValue = OptionQoutationData?.Days?.map((day, ind) => {
          const dayTravelData =
            queryData?.QueryAllData?.TravelDateInfo?.TravelData.filter(
              (travel) => travel.DayNo === day.Day
            );
          // Calculate which occurrence of the day we are processing
          const occurrenceIndex = OptionQoutationData?.Days.slice(0, ind).filter(
            (d) => d.Day === day.Day
          ).length;

          // Select the corresponding TravelData entry (or fallback to first if out of bounds)
          const travelDataEntry =
            (dayTravelData && dayTravelData[occurrenceIndex]) ||
            dayTravelData ||
            {};

          return {
            ...itineraryTransportInitialValue,
            id: queryData?.QueryId,
            DayType: Type,
            DayNo: day.Day,
            Date: day?.Date,
            DestinationUniqueId: day?.DestinationUniqueId,
            QuatationNo: OptionQoutationData?.QuotationNumber,
            Mode: travelDataEntry?.Mode || "",
            // Mode:  "",
            DayUniqueId: day?.DayUniqueId,
            FromDestination: day?.DestinationId,
            ItemFromDate: OptionQoutationData?.TourSummary?.FromDate,

            ItemToDate: OptionQoutationData?.TourSummary?.ToDate,
            NoOfVehicle: 1,
            RateUniqueId: "",
            Assitance: "",
            PaxInfo: {
              Adults: OptionQoutationData?.Pax?.AdultCount,
              Child: OptionQoutationData?.Pax?.ChildCount,
              Infant: OptionQoutationData?.Pax?.Infant,
              Infant: "",
              Escort: "",
            },
          };
        });

        setIsIntialValue(true);
        setTransportFormValue(transportInitialValue);
        // console.log(transportFormValue, "YYT8");
        dispatch(setItineraryTransportData(transportInitialValue));
        dispatch(setTransportServiceForm(transportInitialValue));
      }
    }
    // }
  }, [OptionQoutationData]);
  console.log(transportFormValue, "transportformvalue");


  // set value into for it's first value from list
  // const setFirstValueIntoForm = (index) => {
  //   // const programTypeId =
  //   //   transferTypeList.length > 0 ? transferTypeList[0]?.id : "";
  //   const programId =
  //     transportList[index] && transportList[index].length > 0
  //       ? transportList[index][0]?.id
  //       : "";
  //   const supplierId =
  //     transportSupplierList[index] && transportSupplierList[index].length > 0
  //       ? transportSupplierList[index][0]?.id
  //       : "";

  //   setTransportFormValue((prevArr) => {
  //     const newArr = [...prevArr];
  //     newArr[index] = {
  //       ...newArr[index],
  //       // TransferType: programTypeId,
  //       ServiceId: programId,
  //       Supplier: supplierId,
  //     };
  //     return newArr;
  //   });
  //   // setIsFirstValueSet(true);
  // };

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
  //   let updatedIndex = null;
  //   setTransportFormValue((prevForm) => {
  //     const newForm = prevForm.map((form,index) => {
  //       const currentDay = index + 1;
  //       if (index === 0) {
  //         return { ...form,TransferType: arrivalTransfer?.id };
  //       } else if (index === prevForm.length - 1) {
  //         return { ...form,TransferType: departureTransfer?.id };
  //       } else if (fromDays.includes(currentDay)) {
  //         updatedIndex = index; // track which index was updated
  //         return { ...form,TransferType: 6 };
  //       } else {
  //         const hasDayType =
  //           dayTypeArr[index] !== undefined && dayTypeArr[index] !== "";
  //         return { ...form,TransferType: hasDayType ? 4 : "" };
  //       }
  //     });
  //     return newForm;
  //   });
  //   setTimeout(() => {
  //     if (updatedIndex !== null && fromDays !== null) {
  //       handleTransportChange(updatedIndex,"outstation");
  //     }
  //   },0);
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

      if (!isDayServices && data.DataList.length > 0) {
        // getProgramTypeForTransport(data.DataList);
      }
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
  const getTransportList = async (index) => {
    try {
      const { data } = await axiosOther.post("transportmasterlist", {
        // DestinationId: fromDestination,
        Default: "Yes",
        // TransferType: transferid,
        // TransportType: mode,
      });

      setTransportList((prevArr) => {
        const newArr = [...prevArr];
        newArr[index] = data?.DataList;
        return newArr;
      });
    } catch (error) {
      console.log("Error fetching transport list:", error);
    }
  };
  useEffect(() => {
    transportFormValue?.forEach((item, index) => {
      if (isDayServices && transportFormValue.length > 0) {
        getTransportList(
          index,
          // item?.TransferType,
          // item?.FromDestination,
          // item?.Mode
        );
      }
    });
  }, [isDayServices],);
  // useEffect(() => {
  //   let isActive = true;
  //   const loadAllTransportData = async () => {
  //     // if (!apiDataLoad) return;

  //     const allTransportLists = [];
  //     const allSupplierLists = [];
  //     const updatedForm = [...transportFormValue];

  //     for (let index = 0; index < transportFormValue.length; index++) {get
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
  //       const { data: supplierData } = await axiosOther.post("supplierlist", {
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
  //         ServiceId: programId.id,
  //         Supplier: supplierId,
  //         TransportDetails: details?.Detail || "",
  //         Remarks: details?.Detail || "",
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
  //     setTransportSupplierList(allSupplierLists); // if needed
  //     if (isActive) {
  //       setTransportFormValue(updatedForm);
  //       // setIsFirstValueSet(true)
  //     }
  //   };

  //   loadAllTransportData();
  //   return () => {
  //     isActive = false; // cleanup to cancel outdated updates
  //   };
  // }, [data]);

  // getting supplier for transport list with and without dependently it's dependent on transport city
  const getTransportSupplierList = async (index, id) => {
    try {
      const { data } = await axiosOther.post("supplierlist", {
        Name: "",
        id: "",
        SupplierService: [4],
        DestinationId: [Number(id)],
      });
      setTransportSupplierList((prevArr) => {
        const newArr = [...prevArr];
        newArr[index] = data?.DataList;
        return newArr;
      });
      console.log(data, "checkdata222");
      const supplier = data?.DataList[index]?.[0]?.id;
      console.log(supplier, "supplier111")

      setTransportFormValue((prev) => {
        const newArr = [...prev];
        newArr[index] = {
          ...newArr[index],
          Supplier: data?.DataList?.[0]?.id,
        };
        console.log(newArr, "newArr");

        return newArr;
      });
      console.log(transportFormValue, "transsportvalue");







      // updatedForm[index] = {
      //   ...updatedForm[index],

      //   Supplier: supplierId,


      // };
      // setTransportFormValue(updatedForm);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    if (!apiDataLoad) return;
    transportFormValue?.forEach((item, index) => {
      if (item?.FromDestination != "") {
        getTransportSupplierList(index, item?.FromDestination);
      }
    });
  }, [
    transportFormValue?.map((item) => item?.FromDestination)?.join(","),
    apiDataLoad,
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

  const handleTransportChange = async (ind, e, val) => {
    // console.log(ind,e,val,"ind,e,val");

    // if (data) return


    // if (!apiDataLoad) return;

    let name, value;

    if (e === "outstation" || e === "dayType" || (e?.target?.name === "TransferType")) {
      // isTransferTypeChangeRef.current = true;
    }

    // Check if it's a real event (has target), else treat as manual trigger
    if (e && e.target) {
      ({ name, value } = e.target);

      if (name === "NoOfVehicle") {
        setNoOfVehilceState(ind);
      }
      //console.log("Nammmememem811",name);
      setIsManualTransportEdit(true);

      setTransportFormValue((prevValue) => {
        const newArr = [...prevValue];
        newArr[ind] = { ...prevValue[ind], [name]: value };
        return newArr;
      });
    } else if (e === "outstation" || e === "dayType") {
      name = "TransferType"; // treat as if TransferType changed
      value = val;
    } else if (e.target.name === "FromDestination") {
      //console.log("FromDestttt",name);
      const TransferType = transportFormValue[ind]?.TransferType;
      name = "TransferType"; // treat as if TransferType changed
      value = TransferType;
    }

    if (name == "TransferType" || e == "outstation") {
      const fromDestination = transportFormValue[ind]?.FromDestination;
      const ToDestination = transportFormValue[ind]?.ToDestination;
      const DestinationUniqueId = transportFormValue[ind]?.DestinationUniqueId;
      const mode = transportFormValue[ind]?.Mode;
      // console.log("value3",value);
      const { data } = await axiosOther.post("transportmasterlist", {
        DestinationId: ToDestination,
        Default: "Yes",
        TransferType: value,
        TransportType: mode,
      });
      // console.log(data,"apicall3");

      const programList = data?.DataList || [];
      //console.log(programList,"programList");

      const firstProgramId = programList.length > 0 ? programList[0] : "";

      // const firstSupplierId = transportSupplierList[ind][0].id
      await getTransportSupplierList(ind, ToDestination);
      // const suppliersForIndex = transportSupplierList?.[ind] || [];
      // const firstSupplierId = suppliersForIndex?.[0]?.id || "";
      console.log("transportFormValue?.TransferType", transportFormValue[ind]?.TransferType == 6);
      const CostType = value == 6 ? 1 : 2;
      console.log(CostType, "costtype3");

      setTransportFormValue((prevValue) => {
        const newArr = [...prevValue];
        newArr[ind] = {
          ...newArr[ind],
          ServiceId: firstProgramId.id,
          // Supplier: firstSupplierId,
          TransportDetails: programList[0]?.Detail || "",
          Remarks: programList[0]?.Detail || "",
          CostType: CostType,

        };
        return newArr;
      });

      setTransportList((prev) => {
        const updated = [...prev];
        updated[ind] = programList;
        return updated;
      });

      setSelectedInd({ index: ind, field: name, value: firstProgramId.id });
    }

    if (name == "ServiceId") {
      mergeTransportRateJson(ind);
      await getTransportPorgramDetails(ind, value, name);
    }
    // if (name === "FromDestination") {
    //   // const fromDestination = transportFormValue[ind]?.FromDestination;
    //   await getTransportSupplierList(ind, value);

    // }
    // console.log(transportFormValue,"inhandletransportchange");


    setTimeout(() => {
      // isTransferTypeChangeRef.current = false;
      setIsManualTransportEdit(false);
    }, 100);
  };

  const handleTableIncrement = (index) => {
    const indexHotel = transportFormValue[index];

    setTransportFormValue((prevArr) => {
      const newArr = [...prevArr];
      newArr.splice(index + 1, 0, { ...indexHotel, isCopied: true });

      // Update formattedVehicleList to include the duplicated row's rate data
      setFormattedVehicleList((prevVehicleList) => {
        const newVehicleList = [...prevVehicleList];
        // Duplicate the vehicle data for the copied row
        newVehicleList.splice(index + 1, 0, [...prevVehicleList[index]]); // Deep copy to avoid reference issues
        return newVehicleList;
      });

      return newArr;
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

  const handleFinalSave = async () => {
    const vehicleTotalCost = Object.keys(calculatedRateDetails).map((key) => ({
      VehicleType: key,
      ServiceCost: mathRoundHelper(calculatedRateDetails[key].totalCost).toString(),
      MarkupValue: mathRoundHelper(calculatedRateDetails[key].markup).toString(),
      MarkupTotalValue: mathRoundHelper(calculatedRateDetails[key].markupWithHike).toString(),
      TotalServiceCost:
        mathRoundHelper(calculatedRateDetails[key].totalCostWithMarkup).toString(),
      AssitanceMarkupValue: mathRoundHelper(5),
      AssitanceServiceCost: mathRoundHelper(totalAssistance),
      AssitanceTotalMarkupValue: mathRoundHelper(markupValue),
      AssitanceTotalCost: mathRoundHelper(grandTotal),
    }));
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

    const finalForm = transportFormValue?.map((form, index) => {
      // if (form?.ServiceId != "") {
      return {
        ...form,
        ServiceMainType: "No",
        Hike: hikePercent,
        Sector: fromToDestinationList[index],
        VehicleType: completeFormattedVehicleList[index],
        DayType: Type,
        TotalVehicleType: vehicleTotalCost,
        OptionId: TabId,
        DayType: "Main",
        // ServiceDetails:[]
      };
      // } else {
      //   return null;
      // }
    });
    const filteredFinalForm = finalForm?.filter((form) => form != null);
    // const totalCost =
    // formattedVehicleList
    //     .flat()
    //     ?.reduce((sum, item) => sum + Number(item.Cost), 0) *
    //   (1 + hikePercent / 100);
    dispatch(setTotalTransportPricePax(vehicleCosts));

    try {
      const { data } = await axiosOther.post(
        "update-multiple-quatation-transport",
        filteredFinalForm
      );

      if (data?.status == 1) {
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

  useEffect(() => {
    // if (!apiDataLoad) return
    const { index, field, value } = selectedInd;
    if (index === undefined || !field) return;
    console.log(index, field, value, "index,field,value");


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
    console.log(transUID, "transUID");

    getTransportRateApi(
      form?.DestinationUniqueId,
      supplierUid?.UniqueID ?? "", // get the actual unique ID
      index,
      form?.Date,
      transUID?.UniqueId ?? "",

    );
  }, [selectedInd]);
  // getting rate data form api

  const getTransportRateApi = async (
    destination,
    supplier,
    index,
    date,
    serviceId,
    list
  ) => {
    console.log(serviceId, "serviceId");

    // const supplierUid =
    //   transportSupplierList[index] != undefined &&
    //   transportSupplierList[index]?.find((supp) => supp?.id == supplier);

    // const transUID =
    //   transportList[index] && transportList[index].length > 0
    //     ? transportList[index].find((transport) => transport?.id == serviceId)
    //     : "";
    const storedData = localStorage.getItem("token");
    const parsedData = JSON.parse(storedData);
    const companyId = parsedData?.CompanyUniqueId;
    // const vehicleTypeId = vehicleTypeForm[index][0].VehicleTypeId
    // const vehicleTypeName = vehicleTypeForm[index][0].Name
    if (serviceId && supplier && destination && companyId) {
      try {
        const { data } = await axiosOther.post("transportsearchlist", {
          id: "",
          TransportUID: serviceId,
          Destination: destination,
          //  SupplierUID: supplierUid?.UniqueID ? supplierUid?.UniqueID : "",
          SupplierUID: "",
          CurrencyId: "",
          CompanyId: companyId,
          Date: "",
          Year: queryData.QueryAllData.TravelDateInfo.SeasonYear,
          ValidFrom: queryData.QueryAllData.TravelDateInfo.FromDate,
          ValidTo: queryData.QueryAllData.TravelDateInfo.ToDate,
          //  VehicleTypeName: vehicleTypeName,
          //  VehicleTypeId: vehicleTypeId,
          QueryId: queryData?.QueryId ? queryData?.QueryId : "",
          QuatationNo: qoutationData?.QuotationNumber,
        });

        const baseFormattedList =
          vehicleTypeList &&
          vehicleTypeList.map((v) => ({
            VehicleTypeId: v.id,
            Name: v.Name,
            Cost: null, // or ''
            isSupplement: "no",
          }));

        if (data?.Status === 1 && data?.Data?.length > 0) {
          const updatedFormattedList = baseFormattedList.map((v) => {
            const matchedItem = data.Data.find(
              (item) =>
                item.RateJson.VehicleType[0]?.VehicleTypeId === v.VehicleTypeId
            );
            return {
              ...v,
              Cost: matchedItem
                ? matchedItem.RateJson.VehicleType[0]?.TotalCost || null
                : null,
              isSupplement: matchedItem ? "yes" : "no",
            };
          });
          setFormattedVehicleList((prevArr) => {
            const newArr = [...prevArr];
            for (let i = 0; i <= index; i++) {
              if (!Array.isArray(newArr[i]) || newArr[i].length === 0) {
                newArr[i] = [...baseFormattedList];
              }
            }

            newArr[index] = updatedFormattedList;
            return newArr;
          });

          setOriginalVehicleTypeForm((prevArr) => {
            const newArr = [...prevArr];
            for (let i = 0; i <= index; i++) {
              if (!Array.isArray(newArr[i]) || newArr[i].length === 0) {
                newArr[i] = [...baseFormattedList];
              }
            }
            newArr[index] = updatedFormattedList;
            return newArr;
          });
          const Assistance = data?.Data.map((item) => item.RateJson.VehicleType?.[0]?.Assistance).toString() || " ";



          // Return Assistance along with the updated vehicle list
          setTransportFormValue((prevArr) => {
            const newArr = [...prevArr];
            newArr[index] = {
              ...newArr[index],
              Assitance: Assistance,
            };
            return newArr;
          });


        } else {
          const fallbackArray = baseFormattedList.map((v) => ({
            ...v,
            Cost: "", // or null
            isSupplement: "no",
          }));

          setFormattedVehicleList((prevArr) => {
            const newArr = [...prevArr];
            for (let i = 0; i <= index; i++) {
              if (!Array.isArray(newArr[i]) || newArr[i].length === 0) {
                newArr[i] = [...baseFormattedList];
              }
            }
            newArr[index] = fallbackArray;
            return newArr;
          });

          setOriginalVehicleTypeForm((prevArr) => {
            const newArr = [...prevArr];
            for (let i = 0; i <= index; i++) {
              if (!Array.isArray(newArr[i]) || newArr[i].length === 0) {
                newArr[i] = [...baseFormattedList];
              }
            }
            newArr[index] = fallbackArray;
            return newArr;
          });
        }
      } catch (error) {
        console.log("rate-err", error);
      }
    }
  };

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
  useEffect(() => {
    const destinations = transportFormValue?.map((transport, index) => {
      if (index === 0) {
        // For the first day, set "Arrival at {FromDestination}"
        return {
          From: transport?.FromDestination,
          To: transport?.FromDestination,
          Sector: `Arrival at ${destinationList.find(
            (dests) => dests?.id == transport?.FromDestination
          )?.Name || ""
            }`,
        };
      } else if (index === transportFormValue.length - 1) {
        // For the last day, set "Departure from {ToDestination}"
        return {
          From: transport?.FromDestination,
          To: transport?.ToDestination,
          Sector: `Departure from ${destinationList.find(
            (dests) => dests?.id == transport?.ToDestination
          )?.Name || ""
            }`,
        };
      } else {
        // For all other days, check if From and To are the same
        const fromName =
          destinationList.find(
            (dests) => dests?.id == transport?.FromDestination
          )?.Name || "";
        const toName =
          destinationList.find((dests) => dests?.id == transport?.ToDestination)
            ?.Name || "";

        return {
          From: transport?.FromDestination,
          To: transport?.ToDestination,
          Sector: fromName === toName ? fromName : `${fromName} To ${toName}`,
        };
      }
    });

    const fromToDestination = destinations?.map((item) => item?.Sector || "");
    setFromToDestinationList(fromToDestination);
  }, [
    transportFormValue
      ?.map(
        (transport) => transport?.FromDestination + transport?.ToDestination
      )
      .join(","),
    destinationList,
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
      formattedVehicleList.length > 0 &&
      formattedVehicleList[0].length > 0 &&
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
          const vehicleId = vehicle.VehicleTypeId;
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
          const vehicleId = vehicle.VehicleTypeId;
          const vehicleCost = parseFloat(vehicle.Cost) || 0;
          const totalCost = vehicleCostMap[vehicleId] || 0;
          const markup = (totalCost * markupPercent) / 100;
          vehicleCostWithMarkup[vehicleId] = {
            totalCost,
            markup,
            totalCostWithMarkup: totalCost + markup,
            markupWithHike: (totalCost * 5) / 100,
          };
        });
      });

      return vehicleCostWithMarkup;
    };

    const filteredVehicleForm = transportFormValue
      ?.map((form, index) => {
        if (form?.ServiceId != "") {
          return formattedVehicleList[index];
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
    transportFormValue?.map((form) => form?.ServiceId).join(","),
  ]);

  // useEffect(() => {
  const totalAssistance = transportFormValue?.reduce((sum, item) => {
    return sum + mathRoundHelper((Number(item.Assitance) || 0));
  }, 0);

  const markupPercent = mathRoundHelper(5);
  const markupValue = mathRoundHelper(totalAssistance * (markupPercent / 100));
  const grandTotal = mathRoundHelper(totalAssistance + markupValue);
  // }, [
  //   // hikePercent,
  //   transportFormValue?.map((form) => form?.Assitance).join(","),
  // ]);

  useEffect(() => {
    if (isManualTransportEdit) return;

    const days = qoutationData?.Days || [];

    const updatedArr = transportFormValue?.map((item, index, arr) => {
      //console.log("iteememmmwmemwm",item,index,arr);
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
          FromDestination: arr[index - 1]?.ToDestination,
          ToDestination: destination,
        };
      }

      // Last item (may be out of days[] range)
      return {
        ...item,
        FromDestination: arr[index - 1]?.ToDestination || "",
        ToDestination: destination,
      };
    });

    // Destination display list (for sectors)
    const destinations = updatedArr?.map((transport, index) => {
      const fromName =
        destinationList.find((d) => d?.id == transport?.FromDestination)
          ?.Name || "";
      const toName =
        destinationList.find((d) => d?.id == transport?.ToDestination)?.Name ||
        "";

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
          Sector: `Departure from ${toName}`,
        };
      } else {
        return {
          From: transport?.FromDestination,
          To: transport?.ToDestination,
          Sector: fromName === toName ? fromName : `${fromName} To ${toName}`,
        };
      }
    });
    //console.log("updatedArr",updatedArr);
    setTransportFormValue(updatedArr);
    setFromToDestinationList(destinations?.map((d) => d.Sector || ""));
    // const anyCopied = updatedArr?.some((item) => item?.isCopied);

    // if (anyCopied) {
    //   updatedArr.forEach((item, index) => {
    //     getTransportList(index, item.TransferType, item.FromDestination, item.Mode);
    //   });
    // }
  }, [
    transportFormValue?.map((item) => item?.FromDestination).join(","),
    destinationList,
  ]);

  // useEffect(() => {
  //   if (vehicleTypeList.length > 0 && headerDropdown?.Transfer) {
  //     const defaultVehicle = vehicleTypeList.find(
  //       (vehicle) => vehicle.id === Number(headerDropdown.Transfer)
  //     );

  //     if (selectedOptionsSecond.length > 0) {
  //       setSelectedOptions(selectedOptionsSecond);
  //       dispatch(setTransTypeDropDownPax(selectedOptionsSecond));
  //     } else {
  //       if (defaultVehicle) {
  //         setSelectedOptions([
  //           {
  //             label: defaultVehicle.Name,
  //             value: defaultVehicle.id,
  //           },
  //         ]);
  //       }
  //     }
  //   }
  // }, [vehicleTypeList, headerDropdown?.Transfer]);

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

  // ============== Copy logic

  // const transportCheckbox = useSelector(
  //   (state) => state.itineraryServiceCopyReducer.transportCheckbox
  // );

  // useEffect(() => {
  //   // console.log("COPY67", mainHotelCheckBox);
  //   if (transportCheckbox) {
  //     dispatch(
  //       setItineraryCopyTransportFormData({
  //         TransportForm: transportFormValue,
  //         SelectedOptionVehicle: selectedOptionsSecond,
  //         FormattedVehicleList: formattedVehicleList,
  //       })
  //     );
  //   }
  // }, [transportFormValue, selectedOptionsSecond, formattedVehicleList]);

  useEffect(() => {
    return () => {
      dispatch(setItineraryCopyTransportFormDataCheckbox(true));
      dispatch({
        type: "SET_TRANSPORT_DATA_LOAD",
        payload: false,
      });
    };
  }, []);

  console.log(transportData, "transportDataoption");

  const handleCopyDataFromMain = (e) => {
    const { checked } = e.target;

    if (checked) {
      let newUpdateAdditional = transportFormValue?.map((item, index) => ({
        ...transportData.TransportForm[index],
        QueryId: queryData?.QueryAlphaNumId,
        OptionId: TabId,
        QuatationNo: qoutationData?.QuotationNumber,
      }));

      setTransportFormValue(newUpdateAdditional);
      setSelectedOptionSecond(transportData?.SelectedOptionVehicle);
      setFormattedVehicleList(transportData?.FormattedVehicleList);
      setCopyChecked(true);
    }
  };

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
                  onChange={(e) => handleCopyDataFromMain(e)}
                />
                <label className="fontSize11px m-0 ms-1" htmlFor="copy-guide">
                  Copy
                </label>
              </div>
            )}
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
                      <th className="py-1">From</th>
                      <th className="py-1 sector-width-6">To</th>
                      <th className="py-1 sector-width-6">Sector</th>
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
                      {isVehicleType?.original && (
                        <th rowSpan={2} className="align-middle py-1">
                          No of Vehicle
                        </th>
                      )}
                      <th rowSpan={2} className="align-middle py-1">
                        Assistance
                      </th>

                      {formattedVehicleList[0]?.length > 0 &&
                        formattedVehicleList[0]?.map((form, index) => {
                          const isSelected = selectedOptions.some(
                            (opt) => opt.value === form.VehicleTypeId
                          );
                          return (
                            <th
                              rowSpan={2}
                              className={`align-middle ${isSelected ? "" : "d-none"
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
                              {/* <div className="sector-width-6">
                                  <span>{fromToDestinationList[index]}</span>
                                </div> */}
                            </td>

                            <td>
                              <div className="text-wrap sector-width-6">
                                <span>{fromToDestinationList[index]}</span>
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
                            <td>
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
                                >  <option value="">Select</option>
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
                                  className="formControl1"
                                  value={transportFormValue[originalIndex]?.CostType}
                                  onChange={(e) => handleTransportChange(originalIndex, e)}
                                >

                                  {/* <option value="Package Cost">Package Cost</option>
                       
                                      <option value="Per Day Cost">Per Day Cost</option> */}
                                  <option value="1">Package Cost</option>

                                  <option value="2">Per Day Cost</option>

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
                                    (opt) => opt.value === vehicle.VehicleTypeId
                                  );

                                  return (
                                    <td
                                      key={vehicle.VehicleTypeId}
                                      className={isSelected ? "" : "d-none"}
                                    >
                                      <div>
                                        <input
                                          type="number"
                                          className="formControl1"
                                          value={vehicle.Cost || ""}
                                          name={vehicle?.VehicleTypeId}
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
                          Type == "Local"
                            ? 11
                            : Type == "Foreigner"
                              ? isVehicleType?.original
                                ? 13
                                : 13
                              : isVehicleType?.original
                                ? 11
                                : 10
                        }
                        rowSpan={3}
                        className="text-center fs-6"
                      >
                        Total
                      </td>

                      <td colSpan={2}>Transport Cost</td>
                      <td>{mathRoundHelper(totalAssistance && totalAssistance)}</td>
                      {formattedVehicleList?.length > 0 &&
                        formattedVehicleList[0]?.map((options, index) => {
                          const isSelected = selectedOptions?.some(
                            (opt) => opt.value === options.VehicleTypeId
                          );
                          return (
                            <td
                              key={index}
                              className={isSelected ? "" : "d-none"}
                            >
                              {
                                mathRoundHelper(calculatedRateDetails[options?.VehicleTypeId]
                                  ?.totalCostWithMarkup)
                              }
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
                            (opt) => opt.value === options.VehicleTypeId
                          );
                          return (
                            <td
                              key={index}
                              className={isSelected ? "" : "d-none"}
                            >
                              {
                                mathRoundHelper(calculatedRateDetails[options?.VehicleTypeId]
                                  ?.markupWithHike)
                              }
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
                            (opt) => opt.value === form?.VehicleTypeId
                          );
                          const totalCostWithMarkup = parseFloat(
                            calculatedRateDetails[form?.VehicleTypeId]
                              ?.totalCostWithMarkup || 0
                          );
                          const markup = parseFloat(
                            calculatedRateDetails[form?.VehicleTypeId]
                              ?.markup || 0
                          );
                          dispatch(
                            setTransportPrice(totalCostWithMarkup + markup)
                          );

                          return (
                            <td
                              key={index}
                              className={isSelected ? "" : "d-none"}
                            >
                              {mathRoundHelper((totalCostWithMarkup + markup).toFixed(2))}
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
              className="btn btn-primary py-1 px-2 radius-4"
              onClick={handleFinalSave}
            >
              <i className="fa-solid fa-floppy-disk fs-4"></i>
            </button>
          </div>
        </div>
      )}
      {/* {transportCopy && <TransportUpgrade headerDropdown={headerDropdown} />} */}
    </>
  );
};

export default React.memo(Transport);
