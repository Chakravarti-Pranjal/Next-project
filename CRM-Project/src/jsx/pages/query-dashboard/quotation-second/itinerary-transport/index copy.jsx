import React from "react";
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

import styles from "./index.module.css";

const Transport = ({
  Type,
  outstation,
  headerDropdown,
  transportFormValue,
  setTransportFormValue,
}) => {
  const { qoutationData, queryData, isItineraryEditing, payloadQueryData } =
    useSelector((data) => data?.queryReducer);
  const { TourSummary } = qoutationData;
  const dispatch = useDispatch();

  // console.log(outstation, "outstation");
  const [transferTypeList, setTransferTypeList] = useState([]);
  const [transportList, setTransportList] = useState([]);
  const [transportSupplierList, setTransportSupplierList] = useState([]);
  const [destinationList, setDestinationList] = useState([]);
  const [vehicleTypeList, setVehicleTypeList] = useState([]);
  const { transportFormData } = useSelector((data) => data?.itineraryReducer);
  const [rateList, setRateList] = useState([]);
  const [isOpen, setIsOpen] = useState({
    copy: false,
    original: false,
  });
  const [transportCopy, setTransportCopy] = useState(false);
  const { TransportService } = useSelector(
    (data) => data?.ItineraryServiceReducer
  );
  const [selectedOptions, setSelectedOptions] = useState([]);
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
  const [isTransportListLoaded, setIsTransportListLoaded] = useState(false);
  const [isSupplierListLoaded, setIsSupplierListLoaded] = useState(false);
  const [isVehicleTypeListLoaded, setIsVehicleTypeListLoaded] = useState(false);
  const [isRateMerged, setIsRateMerged] = useState(true);
  useEffect(() => {
    if (qoutationData?.Days) {
      const data = qoutationData?.Days;
      const allDayServicesEmpty = data.every(
        (day) => day.DayServices.length === 0
      );
      if (!allDayServicesEmpty) {
        const initialFormValue = qoutationData?.Days?.map((day) => {
          const service = day?.DayServices?.filter(
            (service) => service?.ServiceType === "Transport"
          )[0];

          const { TimingDetails, ItemSupplierDetail } =
            service != undefined ? service?.ServiceDetails.flat(1)[0] : "";

          return {
            id: queryData?.QueryId,
            QuatationNo: qoutationData?.QuotationNumber,
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
            Mode:
              service?.Mode ||
              queryData?.QueryAllData?.TravelDateInfo?.TravelData[day.Day - 1]
                ?.Mode,
            Escort: 1,
            Supplier: ItemSupplierDetail?.ItemSupplierId,
            TransportDetails: service?.TransportDetails,
            Remarks: service?.TransportDetails,
            AlternateVehicle: service?.AlternateVehicle,
            CostType: service?.CostType,
            NoOfVehicle: service?.NoOfVehicle != "" ? service?.NoOfVehicle : 1,
            Cost: service?.ServicePrice || "",
            AlternateVehicle: service?.AlterVehicleId,
            AlternateVehicleCost: service?.AlternateVehicleCost,
            NoOfDay: service?.NoOfDay,
            ServiceId: service != undefined ? service?.ServiceId : "",
            ItemFromDate: TimingDetails?.ItemFromDate,
            ItemToDate: TimingDetails?.ItemToDate,
            ItemFromTime: TimingDetails?.ItemFromTime,
            ItemToTime: TimingDetails?.ItemToTime,
            ServiceMainType: "No",
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
        setVehicleTypeForm(vehicleForms);
        setOriginalVehicleTypeForm(vehicleForms);

        const transportInitialValue = qoutationData?.Days?.map((day, ind) => {
          return {
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
              Infant: "",
              Escort: "",
            },
          };
        });

        setTransportFormValue(initialFormValue);
        dispatch(setTransportServiceForm(transportInitialValue));
      } else {
        const transportInitialValue = qoutationData?.Days?.map((day, ind) => {
          return {
            ...itineraryTransportInitialValue,
            id: queryData?.QueryId,
            DayType: Type,
            DayNo: day.Day,
            Date: day?.Date,
            DestinationUniqueId: day?.DestinationUniqueId,
            QuatationNo: qoutationData?.QuotationNumber,
            Mode: queryData?.QueryAllData?.TravelDateInfo?.TravelData[
              day.Day - 1
            ]?.Mode,
            DayUniqueId: day?.DayUniqueId,
            FromDestination: day?.DestinationId,
            ItemFromDate: qoutationData?.TourSummary?.FromDate,
            ItemToDate: qoutationData?.TourSummary?.ToDate,
            NoOfVehicle: 1,
            RateUniqueId: "",
            PaxInfo: {
              Adults: qoutationData?.Pax?.AdultCount,
              Child: qoutationData?.Pax?.ChildCount,
              Infant: qoutationData?.Pax?.Infant,
              Infant: "",
              Escort: "",
            },
          };
        });
        setTransportFormValue(transportInitialValue);
        dispatch(setTransportServiceForm(transportInitialValue));
      }
    }
  }, [qoutationData]);

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
  };
  useEffect(() => {
    if (!isItineraryEditing) {
      transportFormValue?.map((item, index) => {
        setFirstValueIntoForm(index);
      });
      setIsTransportListLoaded(true);
      setIsSupplierListLoaded(true);
      setIsVehicleTypeListLoaded(true);
    }
  }, [
    transportList,
    transportSupplierList,
    transferTypeList,
    isItineraryEditing,
  ]);

  //  console.log(vehicleTypeForm,"vehicleTypeForm")

  const getProgramTypeForTransport = () => {
    if (transferTypeList.length === 0) return;

    // Find Arrival and Departure transfer types
    const arrivalTransfer = transferTypeList.find(
      (transfer) => transfer?.Name === "Arrival Transfers"
    );
    const departureTransfer = transferTypeList.find(
      (transfer) => transfer?.Name === "Departure Transfer"
    );
    const outstationTransfer =
      outstation[0].Transport != ""
        ? transferTypeList.find((transfer) => transfer?.Name === "Outstation")
        : "";

    if (!arrivalTransfer || !departureTransfer) return;

    setTransportFormValue((prevForm) => {
      return prevForm.map((form, index) => {
        if (index === 0) {
          // First entry: Arrival Transfers
          return { ...form, TransferType: arrivalTransfer?.id };
        } else if (index === prevForm.length - 1) {
          // Last entry: Departure Transfer
          return { ...form, TransferType: departureTransfer?.id };
        } else {
          // All other entries: Default to "Select" (empty value)
          return { ...form, TransferType: "" };
        }
      });
    });
  };
  useEffect(() => {
    getProgramTypeForTransport();
  }, [transferTypeList]);

  // getting transfer type list data
  const postDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("transfertypemasterlist");
      setTransferTypeList(data?.DataList);
      console.log("Rishitransfertypemasterlist", data);
      getProgramTypeForTransport();
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
          (headerDropdown.Transfer &&
            vehicletype?.id == headerDropdown.Transfer) ||
          vehicletype?.PaxType == TourSummary?.PaxTypeName
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
    postDataToServer();
  }, [headerDropdown]);

  // getting program details text for transport table
  const getTransportPorgramDetails = async (index, id) => {
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

  useEffect(() => {
    transportFormValue?.forEach((item, index) => {
      getTransportPorgramDetails(index, item?.ServiceId);
    });
  }, [transportFormValue?.map((item) => item?.ServiceId).join(",")]);

  //getting transport master with and without dependency of transfer list
  const getTransportList = async (index, transferid) => {
    try {
      const { data } = await axiosOther.post("transportmasterlist", {
        // Name: "",
        // Status: "",
        // id: "",
        // DestinationId: "",
        // Default: "Yes",
        TransferType: transferid,
      });
      // console.log("tid",transferid)

      setTransportList((prevArr) => {
        const newArr = [...prevArr];
        newArr[index] = transferid != "" ? data?.DataList : [];
        return newArr;
      });
    } catch (error) {
      console.log("Error fetching transport list:", error);
    }
  };
  useEffect(() => {
    transportFormValue?.forEach((item, index) => {
      getTransportList(index, item?.TransferType);
    });
  }, [transportFormValue?.map((item) => item?.TransferType)?.join(",")]);

  // getting supplier for transport list with and without dependently it's dependent on transport city
  const getTransportSupplierList = async (index, id) => {
    console.log(id, "id");
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
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    transportFormValue?.forEach((item, index) => {
      if (item?.FromDestination != "") {
        getTransportSupplierList(index, item?.FromDestination);
      }
    });
  }, [transportFormValue?.map((item) => item?.FromDestination)?.join(",")]);
  // here mergint vehicle price
  const mergeTransportRateJson = (serviceInd) => {
    if (isRateMerged) {
      if (vehicleTypeForm?.length > 0) {
        let updatedVehicle = vehicleTypeForm?.map((form, index) => {
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
          setVehicleTypeForm(updatedVehicle);
        }
      }
    } else {
      if (vehicleTypeForm?.length > 0) {
        // let updatedVehicle = vehicleTypeForm?.map((form, index) => {
        // });
        const vehicleForm = vehicleTypeForm[serviceInd];
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
          setVehicleTypeForm((prevForm) => {
            let newForm = [...prevForm];
            newForm[serviceInd] = mergedForm;
            return newForm;
          });
        }
      }
    }
  };
  // console.log(vehicleTypeForm,"v")

  useEffect(() => {
    if (rateList?.length == qoutationData?.Days?.length && isRateMerged) {
      mergeTransportRateJson();
    }
  }, [
    rateList,
    transportFormValue?.map((guide) => guide?.ServiceId).join(","),
    transportFormValue?.map((guide) => guide?.ServiceId).join(","),
  ]);

  const handleTransportChange = (ind, e) => {
    const { name, value } = e.target;
    if (name == "NoOfVehicle") {
      setNoOfVehilceState(ind);
    }

    if (name == "ServiceId") {
      mergeTransportRateJson(ind);
    }
    setTransportFormValue((prevValue) => {
      const newArr = [...prevValue];
      newArr[ind] = { ...transportFormValue[ind], [name]: value };
      return newArr;
    });
  };

  const handleTableIncrement = (index) => {
    const indexHotel = transportFormValue[index];
    setTransportFormValue((prevArr) => {
      const newArr = [...prevArr];
      newArr.splice(index + 1, 0, { ...indexHotel, isCopied: true });
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

    vehicleTypeForm.flat()?.forEach((form) => {
      const costValue = form?.Cost ? parseInt(form?.Cost, 10) || 0 : 0;
      costMap[form?.VehicleTypeId] =
        (costMap[form?.VehicleTypeId] || 0) + costValue;
    });

    return Object.entries(costMap).map(([VehicleTypeId, TotalCost]) => ({
      VehicleTypeId: Number(VehicleTypeId),
      TotalCost,
    }));
  }, [vehicleTypeForm]);

  const handleFinalSave = async () => {
    const vehicleTotalCost = Object.keys(calculatedRateDetails).map((key) => ({
      VehicleType: key,
      ServiceCost: calculatedRateDetails[key].totalCost.toString(),
      MarkupValue: calculatedRateDetails[key].markup.toString(),
      MarkupTotalValue: calculatedRateDetails[key].markupWithHike.toString(),
      TotalServiceCost:
        calculatedRateDetails[key].totalCostWithMarkup.toString(),
    }));

    const finalForm = transportFormValue?.map((form, index) => {
      if (form?.ServiceId != "") {
        return {
          ...form,
          Hike: hikePercent,
          Sector: fromToDestinationList[index],
          VehicleType: vehicleTypeForm[index],
          DayType: Type,
          TotalVehicleType: vehicleTotalCost,
        };
      } else {
        return null;
      }
    });

    const filteredFinalForm = finalForm?.filter((form) => form != null);

    const totalCost =
      vehicleTypeForm
        .flat()
        ?.reduce((sum, item) => sum + Number(item.Cost), 0) *
      (1 + hikePercent / 100);

    dispatch(setTotalTransportPricePax(vehicleCosts));
    dispatch(setTransTypeDropDownPax(selectedOptions));

    try {
      console.log("Final", filteredFinalForm);
      const { data } = await axiosOther.post(
        "updateTransportQuatation",
        filteredFinalForm
      );
      // console.log("Server response:", data);
      if (data?.status == 1) {
        // console.log(filteredFinalForm,"datasent")
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
        console.log(DataTransfer, "error");
        notifyError(data[0][1]);
      }
    }
    // console.log(filteredFinalForm,"sent")
  };

  useEffect(() => {
    // Calculate cost for each transport entry
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
  useEffect(() => {
    if (Type == "Main") {
      dispatch(setItineraryTransportData(transportFormValue));
    }
  }, transportFormValue);

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

  // getting rate data form api
  const getTransportRateApi = async (
    destination,
    supplier,
    index,
    date,
    serviceId
  ) => {
    const supplierUid =
      transportSupplierList[index] != undefined &&
      transportSupplierList[index]?.find((supp) => supp?.id == supplier);

    const transUID =
      transportList[index] && transportList[index].length > 0
        ? transportList[index].find((transport) => transport?.id == serviceId)
        : "";

    try {
      const { data } = await axiosOther.post("transportsearchlist", {
        id: "",
        TransportUID: transUID?.UniqueId,
        Destination: destination,
        SupplierUID:
          supplierUid?.UniqueID != undefined ? supplierUid?.UniqueID : "",
        Date: qoutationData?.TourSummary?.FromDate,
        ValidFrom: qoutationData?.TourSummary?.FromDate,
        ValidTo: qoutationData?.TourSummary?.FromDate,
        // Date: "2026-09-03",
        // ValidFrom: "2026-09-03",
        // ValidTo: "2026-09-03",
        QueryId: queryData?.QueryId,
        QuatationNo: qoutationData?.QuotationNumber,
        Year: headerDropdown?.Year,
        QuatationNo: qoutationData?.QuotationNumber,
      });

      setRateList((prevArr) => {
        const newArr = [...prevArr];
        newArr[index] = data?.Data ? data?.Data[0]?.RateJson?.VehicleType : [];
        return newArr;
      });
    } catch (error) {
      console.log("rate-err", error);
    }
  };

  useEffect(() => {
    transportFormValue?.forEach((form, index) => {
      getTransportRateApi(
        form?.DestinationUniqueId,
        form?.Supplier,
        index,
        form?.Date,
        form?.ServiceId
      );
    });
  }, [
    transportFormValue?.map((form) => form?.Destination)?.join(","),
    transportFormValue?.map((form) => form?.ServiceId)?.join(","),
    transportFormValue?.map((form) => form?.Supplier)?.join(","),
    headerDropdown?.Year,
  ]);
  // console.log(headerDropdown,"headerDropdown")

  // creating/removing vehicle form for alternate
  useEffect(() => {
    if (transportCopy) {
      if (isAlternate) {
        setTransportCopy(true);
        const supplementForm = TransportService?.map((form) => {
          return {
            ...form,
            ServiceMainType: "Yes",
          };
        });
        const newFormArr = [...transportFormValue, ...supplementForm];
        setTransportFormValue(newFormArr);

        const supplementSelectForm = TransportService?.map((item, index) => {
          return selectedOptions;
        });

        const supplementVehicleForm = supplementSelectForm?.map(
          (item, index) => {
            return item?.map((vehicle, index) => {
              return {
                VehicleTypeId: vehicle?.value,
                Cost: "",
                isSupplement: "Yes",
                Name: item?.label,
              };
            });
          }
        );

        setVehicleTypeForm([...vehicleTypeForm, ...supplementVehicleForm]);
        setOriginalVehicleTypeForm([
          ...vehicleTypeForm,
          ...supplementVehicleForm,
        ]);
      } else {
        setTransportCopy(false);
        const removedCopiedForm = transportFormValue?.filter(
          (form, index) => form?.ServiceMainType == "No"
        );
        setTransportFormValue(removedCopiedForm);

        const removedSupplmentVehicle = vehicleTypeForm?.filter(
          (form) => form?.isSupplement == "No"
        );
        setVehicleTypeForm(removedSupplmentVehicle);
        setOriginalVehicleTypeForm(removedSupplmentVehicle);

        const remvoedDestList = fromToDestinationList?.filter(
          (item, index) => index < TransportService?.length
        );
        setFromToDestinationList(remvoedDestList);
      }
    }
  }, [isAlternate]);

  const handleChange = (selected) => {
    setSelectedOptions(selected);
  };

  // creating vehicle form behalf of vehicle multi select
  useEffect(() => {
    if (selectedOptions.length > 0) {
      const selectedForm = transportFormValue.map((item, index) => {
        return selectedOptions;
      });

      const vehicleForm = selectedForm?.map((item, index) => {
        if (vehicleTypeForm.length > 0) {
          setIsVehicleForm(!isVehicleForm);
          const oneVehicleForm = vehicleTypeForm[index];
          return item?.map((vehicle, ind) => {
            const vehicleForm1 = oneVehicleForm[ind];
            if (vehicle.value == vehicleForm1?.VehicleTypeId) {
              return vehicleForm1;
            } else {
              return {
                VehicleTypeId: vehicle?.value,
                Cost: "",
                isSupplement: "No",
                Name: vehicle?.label,
              };
            }
          });
        } else {
          setIsVehicleForm(!isVehicleForm);
          return item?.map((vehicle, index) => {
            return {
              VehicleTypeId: vehicle?.value,
              Cost: "",
              isSupplement: "No",
              Name: vehicle?.label,
            };
          });
        }
      });
      setVehicleTypeForm(vehicleForm);
      setOriginalVehicleTypeForm(vehicleForm);
    } else {
      setVehicleTypeForm([]);
      setOriginalVehicleTypeForm([]);
    }
  }, [selectedOptions]);
  // console.log(destinationList,"des")

  useEffect(() => {
    if (vehicleTypeForm.length > 0) {
      // Extract selected vehicle IDs from form
      const vehicleId = transportFormValue?.map(
        (vehicle) => parseInt(vehicle?.AlternateVehicle) || ""
      );

      // Filter selected vehicles from vehicleTypeList
      const vehicle = vehicleTypeList?.filter((vehicle) =>
        vehicleId?.includes(vehicle?.id)
      );

      // Create selectedVehicle object
      const selectedVehicle = vehicle?.map((vehicle) => ({
        VehicleTypeId: vehicle?.id,
        Cost: "",
        IsSupplement: "No",
        Name: vehicle?.Name,
      }));

      const mergingVehicle = vehicleTypeForm?.map((vehicleArr) => {
        // Get the IDs of the currently selected multi-options
        const idOfMultiSelectedOption = selectedOptions?.map(
          (item) => item.value
        );

        // Get the IDs of the form's selected options
        const idOfFormSelectedOption = selectedVehicle?.map(
          (item) => item?.VehicleTypeId
        );

        // Filter out multi-selected and form-selected vehicles
        const filteredMultiForm = vehicleArr.filter((item) =>
          idOfMultiSelectedOption.includes(item.VehicleTypeId)
        );

        const filteredSingleForm = vehicleArr.filter((item) =>
          idOfFormSelectedOption.includes(item.VehicleTypeId)
        );

        // Filter new selected vehicles that aren't already in the form
        const newSingleVehicleEntry = selectedVehicle.filter(
          (item) =>
            !vehicleArr.some(
              (existingItem) =>
                existingItem.VehicleTypeId === item.VehicleTypeId
            )
        );

        // Combine the filtered arrays (removing duplicates)
        let allMergedArr = [
          ...filteredMultiForm,
          ...filteredSingleForm,
          ...newSingleVehicleEntry,
        ];

        // Now remove any vehicles that are unselected (not in selectedOptions)
        const cleanedArr = allMergedArr.filter(
          (item) =>
            idOfMultiSelectedOption.includes(item.VehicleTypeId) ||
            idOfFormSelectedOption.includes(item.VehicleTypeId)
        );

        return cleanedArr;
      });

      setVehicleTypeForm(mergingVehicle);
    }
  }, [
    transportFormValue?.map((vehicle) => vehicle?.AlternateVehicle).join(","),
    isVehicleForm,
  ]);

  // calculating from destination & to destination
  useEffect(() => {
    const destinations = transportFormValue?.map((transport, index) => {
      if (index === 0) {
        // For the first day, set "Arrival at {FromDestination}"
        return {
          From: transport?.FromDestination,
          To: transport?.FromDestination,
          Sector: `Arrival at ${
            destinationList.find(
              (dests) => dests?.id == transport?.FromDestination
            )?.Name || ""
          }`,
        };
      } else if (index === transportFormValue.length - 1) {
        // For the last day, set "Departure from {ToDestination}"
        return {
          From: transport?.FromDestination,
          To: transport?.ToDestination,
          Sector: `Departure from ${
            destinationList.find(
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
    const updatedForms = [...vehicleTypeForm];

    const form = transportFormValue[formIndex];

    updatedForms[formIndex][fieldIndex] = {
      ...updatedForms[formIndex][fieldIndex],
      Cost: value,
    };
    setVehicleTypeForm(updatedForms);
    setOriginalVehicleTypeForm(updatedForms);
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

  // handling outstation in form
  useEffect(() => {
    if (transportFormValue?.length > 0) {
      outstation?.map((outstation) => {
        if (outstation?.Transport != "") {
          let isFirst = true;

          const transportForm = transportFormValue?.map((transport) => {
            if (
              transport?.DayNo >= outstation?.From &&
              transport?.DayNo <= outstation?.To
            ) {
              if (isFirst) {
                isFirst = false;
                return { ...transport, TransferType: 18 };
              } else {
                return {
                  ...transport,
                  TransferType:
                    transportFormValue.length == transport?.DayNo ? 15 : "",
                };
              }
            } else {
              return transport;
            }
          });

          setTransportFormValue(transportForm);
        } else {
          const transportForm = transportFormValue?.map((transport) =>
            transport?.DayNo >= outstation?.From &&
            transport?.DayNo <= outstation?.To
              ? { ...transport, TransferType: "" }
              : transport
          );
          setTransportFormValue(transportForm);
        }
      });
    }
  }, [
    outstation?.map((out) => out.Transport).join(","),
    outstation?.map((out) => out.To).join(","),
    outstation?.map((out) => out.From).join(","),
  ]);

  // multiplying price to NoOfVehicle
  useEffect(() => {
    if (vehicleTypeForm.length > 0 && noOfVehicleIndex != "") {
      const mainJson = [...transportFormValue];
      const vehicleJson = [...vehicleTypeForm];
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

      setVehicleTypeForm(vehicleJson);
      setOriginalVehicleTypeForm(vehicleJson);
    }
  }, [transportFormValue?.map((form) => form?.NoOfVehicle).join(",")]);

  // handling vehicle type checkbox
  const handleVehicleChecboxChange = (e) => {
    const { name, value, checked } = e.target;
    const updatedVehicle = vehicleTypeForm?.map((vehicle) => {
      return vehicle?.map((item) => {
        return item?.VehicleTypeId == name
          ? { ...item, isSupplement: checked ? "Yes" : "No" }
          : item;
      });
    });

    setVehicleTypeForm(updatedVehicle);
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
    setVehicleTypeForm(updatedForm);
  };

  useEffect(() => {
    const calculateTotalCostWithMarkup = (
      vehicleForm,
      markupPercent,
      originalForm
    ) => {
      const vehicleCostMap = {};
      const vehicleCostWithMarkup = {};

      vehicleForm.forEach((dayVehicles) => {
        dayVehicles.forEach((vehicle) => {
          const vehicleId = vehicle.VehicleTypeId;
          const vehicleCost = parseFloat(vehicle.Cost) || 0;

          if (vehicleCostMap[vehicleId]) {
            vehicleCostMap[vehicleId] += vehicleCost;
          } else {
            vehicleCostMap[vehicleId] = vehicleCost;
          }
        });
      });

      originalForm.forEach((dayVehicles) => {
        dayVehicles.forEach((vehicle) => {
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
          return vehicleTypeForm[index];
        } else {
          return null;
        }
      })
      .filter((form) => form != null);

    const calculatedRateWithMarkup = calculateTotalCostWithMarkup(
      filteredVehicleForm,
      hikePercent,
      orignalVehicleTypeForm
    );

    setCalculatedRateDetails(calculatedRateWithMarkup);
  }, [
    hikePercent,
    vehicleTypeForm,
    transportFormValue?.map((form) => form?.ServiceId).join(","),
  ]);

  // const handleModeChange = async (e, index) => {
  //   const { value } = e.target;

  //   // Update the Redux state
  //   const updatedTourDetails = [...qoutationData.TourSummary.TourDetails];
  //   updatedTourDetails[index] = {
  //     ...updatedTourDetails[index],
  //     Mode: value,
  //   };

  //   const updatedQoutationData = {
  //     ...qoutationData,
  //     TourSummary: {
  //       ...qoutationData.TourSummary,
  //       TourDetails: updatedTourDetails,
  //     },
  //   };

  //   dispatch({
  //     type: "SET-QOUTATION-DATA",
  //     payload: updatedQoutationData,
  //   });

  // };
  // console.log(transportFormValue[1]?.FromDestination,"des")

  // console.log(headerDropdown,"head")
  // console.log(vehiclet,"tvalue"))
  useEffect(() => {
    setTransportFormValue((prevArr) => {
      const updatedArr = prevArr.map((item, index) => {
        // For all indices except the last one, set ToDestination to the next FromDestination
        if (index === 0) {
          return {
            ...item,
            FromDestination: qoutationData?.Days[index]?.DestinationId || "",
            ToDestination: item?.FromDestination || "",
          };
        } else if (index > 0 && index < prevArr.length - 1) {
          return {
            ...item,
            FromDestination: prevArr[index - 1]?.ToDestination,
            ToDestination: qoutationData?.Days[index]?.DestinationId || "",
          };
        } else {
          return {
            ...item,
            FromDestination: prevArr[0]?.ToDestination,
            ToDestination: qoutationData?.Days[index]?.DestinationId || "",
          };
        }
      });
      return updatedArr;
    });
  }, [transportFormValue?.map((item) => item?.FromDestination).join(",")]);

  useEffect(() => {
    if (vehicleTypeList.length > 0 && headerDropdown?.Transfer) {
      const defaultVehicle = vehicleTypeList.find(
        (vehicle) => vehicle.id === Number(headerDropdown.Transfer)
      );

      if (defaultVehicle) {
        setSelectedOptions([
          {
            label: defaultVehicle.Name,
            value: defaultVehicle.id,
          },
        ]);
      }
    }
  }, [vehicleTypeList, headerDropdown?.Transfer]);

  return (
    <>
      <div className="row mt-3 m-0">
        <div
          className="col-12 px-1 py-2 d-flex justify-content-between itinerary-head-bg"
          onClick={() => setIsOpen({ ...isOpen, original: !isOpen.original })}
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
            <div>
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
                      {vehicleTypeForm[0]?.map((form, index) => {
                        return (
                          <th rowSpan={2} className="align-middle">
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
                              <div className="d-flex gap-2 justify-content-start days-width-9">
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
                                <div>{`Day ${item?.DayNo}`}</div>
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
                            <td className="sector-width-6">
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
                            {vehicleTypeForm[originalIndex]?.map(
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
                      {vehicleTypeForm?.length > 0 &&
                        vehicleTypeForm[0]?.map((options, index) => {
                          return (
                            <td key={index}>
                              {
                                calculatedRateDetails[options?.VehicleTypeId]
                                  ?.totalCostWithMarkup
                              }
                            </td>
                          );
                        })}
                    </tr>
                    <tr className="costing-td">
                      <td colSpan={2}>Markup(5) %</td>
                      {vehicleTypeForm?.length > 0 &&
                        vehicleTypeForm[0]?.map((options, index) => {
                          return (
                            <td key={index}>
                              {
                                calculatedRateDetails[options?.VehicleTypeId]
                                  ?.markupWithHike
                              }
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
                        return (
                          <td key={index}>
                            {(totalCostWithMarkup + markup).toFixed(2)}
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
            className="col-12 px-1 py-2 d-flex justify-content-between itinerary-head-bg"
            onClick={() => setIsOpen({ ...isOpen, copy: !isOpen?.copy })}
          >
            <div className="d-flex gap-4 align-items-center">
              <div className="d-flex gap-2">
                <img src={TransportIcon} alt="GuideIcon" />
                <label htmlFor="" className="fs-5">
                  Transport
                </label>
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
                                <div className="d-flex gap-2 justify-content-start days-width-9">
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
                                  <div>{`Day ${item?.DayNo}`}</div>
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
                                {/* <div>
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
                                </div> */}
                                <div className="sector-width-6">
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
                                            vehicleTypeForm[originalIndex]
                                              ?.VehicleTypeId
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
                          //   Type == "Local" ? 11 : Type == "Foreigner" ? 11 : 9
                          // }
                          colSpan={
                            Type == "Local"
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
                              {
                                calculatedRateDetails[options?.value]
                                  ?.totalCostWithMarkup
                              }
                            </td>
                          );
                        })}
                      </tr>
                      <tr className="costing-td">
                        <td colSpan={2}>Markup(5) %</td>

                        {selectedOptions?.map((options, index) => {
                          return (
                            <td key={index}>
                              {calculatedRateDetails[options?.value]?.markup}
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
                            <td key={index}>{totalWithMarkup.toFixed(2)}</td>
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

export default React.memo(Transport);
