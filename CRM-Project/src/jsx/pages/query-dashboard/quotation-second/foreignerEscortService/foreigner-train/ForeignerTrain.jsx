import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { axiosOther } from "../../../../../../http/axios_base_url";
import { itinerariesTrainInitialValue } from "../../qoutation_initial_value";
import "./index.css";
import { notifyError, notifySuccess } from "../../../../../../helper/notify";
import trainIcon from "../../../../../../images/itinerary/train.svg";
import {
  setTogglePriceState,
  setTrainPrice,
} from "../../../../../../store/actions/PriceAction";
import { setItineraryTrainData } from "../../../../../../store/actions/itineraryDataAction";
import { checkPrice } from "../../../../../../helper/checkPrice";
import { FaChevronCircleUp, FaChevronCircleDown } from "react-icons/fa";
import { Modal, Row, Col, Button } from "react-bootstrap";
import { setQoutationResponseData } from "../../../../../../store/actions/queryAction";
import { setItineraryCopyTrainFormDataCheckbox } from "../../../../../../store/actions/itineraryServiceCopyAction/itineraryServiceCopyAction";
import { incrementForeignEscortCharges } from "../../../../../../store/actions/createExcortLocalForeignerAction";
import moment from "moment";
import mathRoundHelper from "../../../helper-methods/math.round";
import DarkCustomTimePicker from "../../../helper-methods/TimePicker";

const ForeignerTrain = ({ Type, transportFormValue }) => {
  const { qoutationData, queryData, isItineraryEditing, headerDropdown } =
    useSelector((data) => data?.queryReducer);
  const { trainFormData } = useSelector((data) => data?.itineraryReducer);
  const [originalTrainForm, setOriginalTrainForm] = useState([]);
  const [copyChecked, setCopyChecked] = useState(false);
  const [backupTrainForms, setBackupTrainForms] = useState([]);
  const [trainFormValue, setTrainFormValue] = useState([]);
  const [trainClassList, setTrainClassList] = useState([]);
  const [trainList, setTrainList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [rateList, setRateList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [trainTypeList, setTrainTypeList] = useState([]);
  const dispatch = useDispatch();
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
  const [destinationList, setDestinationList] = useState([]);
  const [fromToDestinationList, setFromToDestinationList] = useState([]);
  const [trainPriceCalculation, setTrainPriceCalculation] = useState({
    Price: {
      Adult: "",
      Child: "",
      ServiceCharges: "",
      HandlingCharges: "",
      GuideCharges: "",
    },
    Markup: {
      Adult: "",
      Child: "",
      ServiceCharges: "",
      HandlingCharges: "",
      GuideCharges: "",
    },
    MarkupOfCost: {
      Adult: "",
      Child: "",
      ServiceCharges: "",
      HandlingCharges: "",
      GuideCharges: "",
    },
  });
  const [isRateMerge, setIsRateMerge] = useState(true);
  const [dataIsLoaded, setDataIsLoaded] = useState(true);
  const apiDataLoad = useSelector(
    (state) => state.inineraryServiceDataLoadReducer.train
  );
  const qoutationDataForeigner = qoutationData?.ExcortDays?.find(
    (item) => item.Type === "Foreigner"
  );

  useEffect(() => {
    if (qoutationDataForeigner?.Days) {
      const hasTrainService = qoutationDataForeigner?.Days?.some((day) =>
        day.DayServices.some((service) => service.ServiceType === "Train")
      );
      if (hasTrainService) {
        const initialFormValue = qoutationDataForeigner?.Days?.filter((day) => {
          //   const hasTrainService = day?.DayServices?.some(
          //     (service) => service?.ServiceType === "Train"
          //   );
          const hasTrainTransport = transportFormValue?.some(
            (transport) =>
              transport?.DayNo === day?.Day &&
              transport?.Mode?.toLowerCase() === "train"
          );
          return hasTrainTransport;
        })?.map((day) => {
          const service = day?.DayServices?.find(
            (service) => service?.ServiceType === "Train"
          );
          const { ItemUnitCost, TimingDetails, ItemSupplierDetail } =
            service?.ServiceDetails?.flat(1)?.[0] || {};

          return {
            id: queryData?.QueryId || "",
            QuatationNo: qoutationData?.QuotationNumber || "",
            DayType: "Foreigner" || "",
            DayNo: day?.Day || "",
            Date: day?.Date || "",
            // Destination: day?.DestinationId || "",
            // DestinationUniqueId: day?.DestinationUniqueId || "",
            GuideCharges: service?.GuideCharges || "",
            // TypeName: service?.TrainType || "",
            HandlingCharges: service?.HandlingCharges || "",
            ServiceCharges: service?.ServiceCharges || "",
            DayUniqueId: day?.DayUniqueId || "",
            ServiceId: service?.ServiceId || "",
            Supplier:
              service?.ServiceDetails[0]?.ItemSupplierDetail?.ItemSupplierId ||
              "",
            Escort: 1,
            Type:
              TimingDetails?.ModeType === "Day Journey"
                ? "Day Journey"
                : "Overnight Journey",
            DepartureTime: TimingDetails?.ItemFromTime || "",
            AdultCost: ItemUnitCost?.Adult || "",
            ChildCost: ItemUnitCost?.Child || "",
            ArrivalTime: TimingDetails?.ItemToTime || "",
            Remarks: TimingDetails?.Remark || "",
            TrainNumber: service?.TrainNumber || "",
            TrainClass: service?.TrainClassId || "",
            FromDestination: service?.FromDestinationId || "",
            ToDestination: service?.ToDestinationId || "",
            // ServiceMainType: "No",
            ItemFromDate: TimingDetails?.ItemFromDate || "",
            ItemToDate: TimingDetails?.ItemToDate || "",
            ItemFromTime: TimingDetails?.ItemFromTime || "",
            ItemToTime: TimingDetails?.ItemToTime || "",
            RateUniqueId: "",
            PaxInfo: {
              Adults: qoutationData?.Pax?.AdultCount || "",
              Child: qoutationData?.Pax?.ChildCount || "",
              Infant: qoutationData?.Pax?.Infant || "",
              Escort: service?.PaxDetails?.PaxInfo?.Escort || "",
            },
            ForiegnerPaxInfo: {
              Adults: service?.ForiegnerPaxInfo?.PaxInfo?.Adults || "",
              Child: service?.ForiegnerPaxInfo?.PaxInfo?.Child || "",
              Infant: service?.ForiegnerPaxInfo?.PaxInfo?.Infant || "",
              Escort: service?.ForiegnerPaxInfo?.PaxInfo?.Escort || "",
            },
          };
        });

        setTrainFormValue(initialFormValue);
        setOriginalTrainForm(initialFormValue);
      } else {
        // Render only days with Mode === "train" in transportFormValue
        const trainInitialValue = transportFormValue
          ?.filter((transport) => transport?.Mode?.toLowerCase() === "train")
          ?.map((transport) => {
            const day = qoutationDataForeigner?.Days?.find(
              (day) => day?.Day === transport?.DayNo
            );

            return {
              ...itinerariesTrainInitialValue,
              id: queryData?.QueryId || "",
              DayType: "Foreigner" || "",
              DayNo: transport?.DayNo || "",
              Date: day?.Date || "",
              FromDestination: transport?.FromDestination || "",
              ToDestination: transport?.ToDestination || "",
              DestinationUniqueId: day?.DestinationUniqueId || "",
              QuatationNo: qoutationData?.QuotationNumber || "",
              DayUniqueId: day?.DayUniqueId || "",
              ItemFromDate: qoutationData?.TourSummary?.FromDate || "",
              ItemToDate: qoutationData?.TourSummary?.ToDate || "",
              RateUniqueId: "",
              PaxInfo: {
                Adults: qoutationData?.Pax?.AdultCount || "",
                Child: qoutationData?.Pax?.ChildCount || "",
                Infant: qoutationData?.Pax?.Infant || "",
                Escort: "",
              },
            };
          });
        setTrainFormValue(trainInitialValue);
        setOriginalTrainForm(trainInitialValue);
      }
    }
  }, [qoutationData, transportFormValue, isItineraryEditing]);

  const postDataToServer = async (index) => {
    try {
      const { data } = await axiosOther.post("trainclasslist");
      setTrainClassList((prevArr) => {
        const newArr = [...prevArr];
        newArr[index] = data?.DataList;
        return newArr;
      });
    } catch (error) {
      console.log("error", error);
    }
    try {
      const { data } = await axiosOther.post("trainMasterlist");
      setTrainList((prevArr) => {
        const newArr = [...prevArr];
        newArr[index] = data?.DataList;
        return newArr;
      });
    } catch (error) {
      console.log("error", error);
    }
    try {
      const { data } = await axiosOther.post("traintypelist");
      setTrainTypeList((prevArr) => {
        const newArr = [...prevArr];
        newArr[index] = data?.Data;
        return newArr;
      });
    } catch (error) {
      console.log("train", error);
    }
    try {
      const { data } = await axiosOther.post("destinationlist");
      setDestinationList(data?.DataList);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    trainFormValue?.forEach((_, index) => {
      postDataToServer(index);
    });
  }, [trainFormValue?.map((train) => train?.DayUniqueId).join(",")]);

  const getSupplierDependentOnDestination = async (destination, index) => {
    try {
      const { data } = await axiosOther.post("supplierlist", {
        Name: "",
        id: "",
        SupplierService: [6],
        DestinationId: "",
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
    trainFormValue?.forEach((train, index) => {
      getSupplierDependentOnDestination(train?.FromDestination, index);
    });
  }, [trainFormValue?.map((train) => train?.FromDestination).join(",")]);

  // set value into for it's first value from list
  const setFirstValueIntoForm = (index) => {
    const trainClassId =
      trainClassList[index]?.length > 0 ? trainClassList[index][0]?.id : "";

    const trainId = trainList[index]?.length > 0 ? trainList[index][0]?.id : "";

    const supplierId =
      supplierList[index]?.length > 0 ? supplierList[index][0]?.id : "";

    const trainTypeId =
      trainTypeList[index]?.length > 0 ? trainTypeList[index][0]?.Id : "";

    setTrainFormValue((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = {
        ...newArr[index],
        TrainClass: trainClassId,
        ServiceId: trainId,
        Supplier: supplierId,
        TypeName: trainTypeId,
      };
      return newArr;
    });

    // Update the original train form value
    setOriginalTrainForm((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = {
        ...newArr[index],
        TrainClass: trainClassId,
        ServiceId: trainId,
        Supplier: supplierId,
        TypeName: trainTypeId,
      };
      return newArr;
    });
  };
  useEffect(() => {
    if (!isItineraryEditing) {
      trainFormValue?.forEach((item, index) => {
        setFirstValueIntoForm(index);
      });
    }
  }, [
    trainClassList,
    trainList,
    supplierList,
    trainTypeList,
    fromToDestinationList,
  ]);

  const handleTableIncrement = (index) => {
    const indexHotel = trainFormValue[index];
    setTrainFormValue((prevArr) => {
      const newArr = [...prevArr];
      newArr.splice(index + 1, 0, { ...indexHotel, isCopied: true });
      return newArr;
    });
    setOriginalTrainForm((prevArr) => {
      const newArr = [...prevArr];
      newArr.splice(index + 1, 0, { ...indexHotel, isCopied: true });
      return newArr;
    });
  };

  const handleTableDecrement = (index) => {
    const filteredTable = trainFormValue?.filter((item, ind) => ind != index);
    setTrainFormValue(filteredTable);
    setOriginalTrainForm(filteredTable);
  };

  const mergeTrainRateJson = (serviceInd) => {
    if (isRateMerge) {
      const trainRate = trainFormValue?.map((train, index) => {
        const rate = rateList[index];

        if (rate != undefined) {
          const findedRate = Array.isArray(rate[0]?.RateJson)
            ? rate[0]?.RateJson[0]
            : rate[0]?.RateJson;

          return {
            ...train,
            AdultCost: checkPrice(findedRate?.AdultCost),
            ChildCost: checkPrice(findedRate?.ChildCost),
            ServiceCharges: checkPrice(findedRate?.AdultCost),
            HandlingCharges: checkPrice(findedRate?.ChildCost),
            GuideCharges: checkPrice(findedRate?.AdultCost),
          };
        } else {
          return {
            ...train,
            AdultCost: 0,
            ChildCost: 0,
            ServiceCharges: 0,
            HandlingCharges: 0,
            GuideCharges: 0,
          };
        }
      });

      if (trainFormValue?.length > 0) {
        setIsRateMerge(false);
        setTrainFormValue(trainRate);
        setOriginalTrainForm(trainRate);
      }
    } else {
      const rate = rateList[serviceInd];
      const trainForm = trainFormValue[serviceInd];
      let mergeRateForm = {};

      if (rate != undefined) {
        const findedRate = Array.isArray(rate[0]?.RateJson)
          ? rate[0]?.RateJson[0]
          : rate[0]?.RateJson;

        mergeRateForm = {
          ...trainForm,
          AdultCost: checkPrice(findedRate?.AdultCost),
          ChildCost: checkPrice(findedRate?.ChildCost),
          ServiceCharges: checkPrice(findedRate?.AdultCost),
          HandlingCharges: checkPrice(findedRate?.ChildCost),
          GuideCharges: checkPrice(findedRate?.AdultCost),
        };
      } else {
        mergeRateForm = {
          ...trainForm,
          AdultCost: 0,
          ChildCost: 0,
          ServiceCharges: 0,
          HandlingCharges: 0,
          GuideCharges: 0,
        };
      }

      if (trainFormValue?.length > 0) {
        setTrainFormValue((prevArr) => {
          let newArr = [...prevArr];
          newArr[serviceInd] = mergeRateForm;
          return newArr;
        });
        setOriginalTrainForm((prevArr) => {
          let newArr = [...prevArr];
          newArr[serviceInd] = mergeRateForm;
          return newArr;
        });
      }
    }
  };

  useEffect(() => {
    if (
      rateList?.length == qoutationDataForeigner?.Days?.length &&
      isRateMerge
    ) {
      mergeTrainRateJson();
    }
  }, [
    rateList,
    trainFormValue?.map((train) => train?.DayUniqueId).join(","),
    trainFormValue?.map((train) => train?.ServiceId).join(","),
  ]);

  const handleTrainFormChange = (ind, e) => {
    const { name, value } = e.target;

    setTrainFormValue((prevForm) => {
      const newArr = [...prevForm];
      newArr[ind] = { ...newArr[ind], [name]: value };
      return newArr;
    });

    setOriginalTrainForm((prevForm) => {
      const newArr = [...prevForm];
      newArr[ind] = { ...newArr[ind], [name]: value };
      return newArr;
    });
  };

  const handleFinalSave = async () => {
    const totalPriceForPax = () => {
      let firstPrice =
        parseInt(trainPriceCalculation?.Price?.Adult) +
        parseInt(trainPriceCalculation?.MarkupOfCost?.Adult);

      let secondPrice =
        parseInt(trainPriceCalculation?.Price?.Child) +
        parseInt(trainPriceCalculation?.MarkupOfCost?.Child);

      let thirdPrice =
        parseInt(trainPriceCalculation?.Price?.Service) +
        parseInt(trainPriceCalculation?.MarkupOfCost?.Service);

      let fourthPrice =
        parseInt(trainPriceCalculation?.Price?.Handling) +
        parseInt(trainPriceCalculation?.MarkupOfCost?.Handling);

      let fivthPrice =
        parseInt(trainPriceCalculation?.Price?.Guide) +
        parseInt(trainPriceCalculation?.MarkupOfCost?.Guide);

      let allPrice =
        firstPrice + secondPrice + thirdPrice + fourthPrice + fivthPrice;
      return allPrice;
    };
    try {
      const finalForm = trainFormValue?.map((form, index) => {
        return {
          ...form,
          Sector: fromToDestinationList[index],
          // TimingDetails: {
          //   PickupTime: form.DepartureTime,
          //   ServiceDropTime: form.ArrivalTime,
          //   Remark: form.Remarks,
          //   ItemFromDate: form.ItemFromDate,
          //   ItemToDate: form.ItemToDate,
          //   ItemFromTime: form.ItemFromTime,
          //   ItemToTime: form.ItemToDate,
          //   ModeType: form.Type
          // },
          ToDestination: form.ToDestination,
          TrainNumber: form.TrainNumber,
          hike: hikePercent,
          Sector: fromToDestinationList[index],
          DayType: "Foreigner",
          TotalCosting: {
            ServiceAdultCost: trainPriceCalculation?.Price?.Adult,
            ServiceChildCost: trainPriceCalculation?.Price?.Child,
            AdultMarkupValue: 5,
            ChildMarkupValue: 5,
            AdultMarkupTotal: trainPriceCalculation?.MarkupOfCost?.Adult,
            ChildMarkupTotal: trainPriceCalculation?.MarkupOfCost?.Adult,
            TotalAdultServiceCost:
              trainPriceCalculation?.Price?.Adult +
              trainPriceCalculation?.MarkupOfCost?.Adult,
            TotalChildServiceCost:
              trainPriceCalculation?.Price?.Child +
              trainPriceCalculation?.MarkupOfCost?.Child,
          },
        };
      });

      // const filteredFinalJson = finalForm?.filter(
      //   (form) => form?.ServiceId != ""
      // );
      const updatedJsonData = finalForm?.map((item) => {
        const costing = item.TotalCosting || {};

        const roundedCosting = {
          ...costing,
          ServiceAdultCost: mathRoundHelper(costing.ServiceAdultCost),
          ServiceChildCost: mathRoundHelper(costing.ServiceChildCost),
          AdultMarkupValue: mathRoundHelper(costing.AdultMarkupValue),
          ChildMarkupValue: mathRoundHelper(costing.ChildMarkupValue),
          AdultMarkupTotal: mathRoundHelper(costing.AdultMarkupTotal),
          ChildMarkupTotal: mathRoundHelper(costing.ChildMarkupTotal),
          TotalAdultServiceCost: mathRoundHelper(costing.TotalAdultServiceCost),
          TotalChildServiceCost: mathRoundHelper(costing.TotalChildServiceCost),
        };

        return {
          ...item,
          TotalCosting: roundedCosting,
          AdultCost: mathRoundHelper(item.AdultCost),
          ChildCost: mathRoundHelper(item.ChildCost),
          GuideCharges: mathRoundHelper(item.GuideCharges),
          ServiceCharges: mathRoundHelper(item.ServiceCharges),
          HandlingCharges: mathRoundHelper(item.HandlingCharges),
        };
      });

      console.log(updatedJsonData, "updatedJsonDataWA36");

      const { data } = await axiosOther.post(
        "update-quotation-train",
        // filteredFinalJson
        updatedJsonData
      );
      if (data?.status == 1) {
        dispatch(incrementForeignEscortCharges());
        notifySuccess("Services Added !");
        // dispatch(setTrainPrice(totalPriceForPax()));
        // dispatch(setQoutationResponseData(data?.data));
        // dispatch(setTogglePriceState());
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
    const costArr = trainFormValue?.map((train) => {
      if (train?.ServiceId != "") {
        let arr = [train?.AdultCost, train?.ChildCost, train?.InfantCost];
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
    trainFormValue
      ?.map((train) => train?.AdultCost + train?.ChildCost + train?.InfantCost)
      ?.join(","),
    trainFormValue?.map((item) => item?.ServiceId).join(","),
  ]);

  const getTrainRateApi = async (index, srvcId) => {
    try {
      const { data } = await axiosOther.post("trainsearchlist", {
        TrainId: srvcId,
        Name: "",
        QueryId: queryData?.QueryId,
        QuatationNo: qoutationData?.QuotationNumber,
        Year: headerDropdown?.Rate,
      });

      setRateList((prevArr) => {
        const newArr = [...prevArr];
        newArr[index] = data?.DataList || [];
        return newArr;
      });
    } catch (error) {
      console.log("rate-err", error);
    }
  };

  useEffect(() => {
    trainFormValue?.forEach((form, index) => {
      getTrainRateApi(index, form?.ServiceId);
    });
  }, [
    trainFormValue?.map((form) => form?.Destination)?.join(","),
    trainFormValue?.map((form) => form?.ServiceId)?.join(","),
  ]);

  const addPercentage = (amount, percent) => {
    const percentageValue = (amount * percent) / 100;
    return amount + percentageValue;
  };

  //calculating from destination & to destination
  useEffect(() => {
    const destinations = trainFormValue?.map((train) => {
      return {
        From: train?.FromDestination,
        To: train?.ToDestination,
      };
    });

    const FromToDestination = destinations?.map((item) => {
      const filteredFromDest = destinationList.find(
        (dests) => dests?.id == item?.From
      );
      const filteredToDest = destinationList.find(
        (dests) => dests?.id == item?.To
      );

      if (filteredFromDest && filteredToDest) {
        if (filteredFromDest?.id === filteredToDest?.id) {
          return filteredFromDest?.Name;
        } else {
          return `${filteredFromDest?.Name} To ${filteredToDest?.Name}`;
        }
      } else if (filteredFromDest) {
        return filteredFromDest?.Name;
      } else {
        return "";
      }
    });

    setFromToDestinationList(FromToDestination);
  }, [
    trainFormValue?.map((train) => train?.FromDestination).join(","),
    trainFormValue?.map((train) => train?.ToDestination).join(","),
    destinationList,
  ]);
  const handlePaxChange = (index, e) => {
    const { name, value } = e.target;
    setPaxFormValue({ ...paxFormValue, [name]: value });
  };

  const handlePaxModalClick = (index) => {
    setModalCentered({ modalIndex: index, isShow: true });

    const form = trainFormValue?.filter((form, ind) => ind == index)[0];
    setPaxFormValue({
      Adults: form?.PaxInfo?.Adults,
      Child: form?.PaxInfo?.Child,
      Infant: form?.PaxInfo?.Infant,
    });
  };

  const handlePaxSave = () => {
    setTrainFormValue((prevForm) => {
      const newForm = [...prevForm];
      newForm[modalCentered?.modalIndex] = {
        ...newForm[modalCentered?.modalIndex],
        PaxInfo: paxFormValue,
      };
      return newForm;
    });
    setOriginalTrainForm((prevForm) => {
      const newForm = [...prevForm];
      newForm[modalCentered?.modalIndex] = {
        ...newForm[modalCentered?.modalIndex],
        PaxInfo: paxFormValue,
      };
      return newForm;
    });
    setModalCentered({ modalIndex: "", isShow: false });
  };

  // const handleHikeChange = (e) => {
  //   const { value } = e.target;
  //   setHikePercent(value);

  //   const updatedData = originalTrainForm?.map((item) => {
  //     return {
  //       ...item,
  //       Hike: value,
  //       AdultCost:
  //         item?.AdultCost && !isNaN(item?.AdultCost)
  //           ? Math.floor(
  //             parseFloat(item?.AdultCost) +
  //             (parseFloat(item?.AdultCost) * value) / 100
  //           )
  //           : item?.AdultCost,
  //       ChildCost:
  //         item?.ChildCost && !isNaN(item?.ChildCost)
  //           ? Math.floor(
  //             parseFloat(item?.ChildCost) +
  //             (parseFloat(item?.ChildCost) * value) / 100
  //           )
  //           : item?.ChildCost,
  //       GuideCharges:
  //         item?.GuideCharges && !isNaN(item?.GuideCharges)
  //           ? Math.floor(
  //             parseFloat(item?.GuideCharges) +
  //             (parseFloat(item?.GuideCharges) * value) / 100
  //           )
  //           : item?.GuideCharges,
  //       ServiceCharges:
  //         item?.ServiceCharges && !isNaN(item?.ServiceCharges)
  //           ? Math.floor(
  //             parseFloat(item?.ServiceCharges) +
  //             (parseFloat(item?.ServiceCharges) * value) / 100
  //           )
  //           : item?.ServiceCharges,
  //       HandlingCharges:
  //         item?.HandlingCharges && !isNaN(item?.HandlingCharges)
  //           ? Math.floor(
  //             parseFloat(item?.HandlingCharges) +
  //             (parseFloat(item?.HandlingCharges) * value) / 100
  //           )
  //           : item?.HandlingCharges,
  //     };
  //   });
  //   setTrainFormValue(updatedData);
  // };

  // change to this line
  // const handleHikeChange = (e) => {
  //   const { value } = e.target;
  //   const hikePercent = parseFloat(value) || "";
  //   setHikePercent(hikePercent);

  //   // Update trainFormValue while preserving all non-cost fields
  //   setTrainFormValue((prevTrainForm) =>
  //     prevTrainForm.map((item) => {
  //       const originalAdult = parseFloat(item.AdultCost) || 0;
  //       const originalChild = parseFloat(item.ChildCost) || 0;
  //       const originalGuide = parseFloat(item.GuideCharges) || 0;
  //       const originalService = parseFloat(item.ServiceCharges) || 0;
  //       const originalHandling = parseFloat(item.HandlingCharges) || 0;

  //       return {
  //         ...item, // Preserve all existing fields
  //         Hike: hikePercent,
  //         AdultCost: Math.floor(originalAdult + (originalAdult * hikePercent) / 100),
  //         ChildCost: Math.floor(originalChild + (originalChild * hikePercent) / 100),
  //         GuideCharges: Math.floor(originalGuide + (originalGuide * hikePercent) / 100),
  //         ServiceCharges: Math.floor(originalService + (originalService * hikePercent) / 100),
  //         HandlingCharges: Math.floor(originalHandling + (originalHandling * hikePercent) / 100),
  //       };
  //     })
  //   );

  //   // Optionally, update originalTrainForm to keep it in sync
  //   setOriginalTrainForm((prevOriginalForm) =>
  //     prevOriginalForm.map((item) => {
  //       const originalAdult = parseFloat(item.AdultCost) || 0;
  //       const originalChild = parseFloat(item.ChildCost) || 0;
  //       const originalGuide = parseFloat(item.GuideCharges) || 0;
  //       const originalService = parseFloat(item.ServiceCharges) || 0;
  //       const originalHandling = parseFloat(item.HandlingCharges) || 0;

  //       return {
  //         ...item, // Preserve all existing fields
  //         Hike: hikePercent,
  //         AdultCost: Math.floor(originalAdult + (originalAdult * hikePercent) / 100),
  //         ChildCost: Math.floor(originalChild + (originalChild * hikePercent) / 100),
  //         GuideCharges: Math.floor(originalGuide + (originalGuide * hikePercent) / 100),
  //         ServiceCharges: Math.floor(originalService + (originalService * hikePercent) / 100),
  //         HandlingCharges: Math.floor(originalHandling + (originalHandling * hikePercent) / 100),
  //       };
  //     })
  //   );
  // };

  // const handleHikeChange = (e) => {
  //   const { value } = e.target;
  //   setHikePercent(value);

  //   const updatedData = originalTrainForm?.map((item, idx) => {
  //     // Extract rate from rateList
  //     const rate = rateList[idx] && rateList[idx][0] && rateList[idx][0].RateJson
  //       ? Array.isArray(rateList[idx][0].RateJson)
  //         ? rateList[idx][0].RateJson[0]
  //         : rateList[idx][0].RateJson
  //       : {};

  //     // Use rate values if available; otherwise fallback to item values
  //     const adultCostRaw = rate.AdultCost !== undefined ? rate.AdultCost : item.AdultCost;
  //     const childCostRaw = rate.ChildCost !== undefined ? rate.ChildCost : item.ChildCost;
  //     const guideChargesRaw = rate.AdultCost !== undefined ? rate.AdultCost : item.GuideCharges;
  //     const serviceChargesRaw = rate.AdultCost !== undefined ? rate.AdultCost : item.ServiceCharges;
  //     const handlingChargesRaw = rate.ChildCost !== undefined ? rate.ChildCost : item.HandlingCharges;

  //     return {
  //       ...item,
  //       Hike: value,
  //       AdultCost:
  //         adultCostRaw && !isNaN(adultCostRaw)
  //           ? Math.floor(parseFloat(adultCostRaw) + (parseFloat(adultCostRaw) * value) / 100)
  //           : adultCostRaw,
  //       ChildCost:
  //         childCostRaw && !isNaN(childCostRaw)
  //           ? Math.floor(parseFloat(childCostRaw) + (parseFloat(childCostRaw) * value) / 100)
  //           : childCostRaw,
  //       GuideCharges:
  //         guideChargesRaw && !isNaN(guideChargesRaw)
  //           ? Math.floor(parseFloat(guideChargesRaw) + (parseFloat(guideChargesRaw) * value) / 100)
  //           : guideChargesRaw,
  //       ServiceCharges:
  //         serviceChargesRaw && !isNaN(serviceChargesRaw)
  //           ? Math.floor(parseFloat(serviceChargesRaw) + (parseFloat(serviceChargesRaw) * value) / 100)
  //           : serviceChargesRaw,
  //       HandlingCharges:
  //         handlingChargesRaw && !isNaN(handlingChargesRaw)
  //           ? Math.floor(parseFloat(handlingChargesRaw) + (parseFloat(handlingChargesRaw) * value) / 100)
  //           : handlingChargesRaw,
  //     };
  //   });

  //   setTrainFormValue(updatedData);
  // };

  const handleHikeChange = (e) => {
    const { value } = e.target;
    const hikePercent = parseFloat(value);
    setHikePercent(value);

    let updatedData;

    if (!value || isNaN(hikePercent)) {
      // 🔁 Reset to originalTrainForm if hike is empty or invalid
      updatedData = originalTrainForm;
    } else {
      updatedData = originalTrainForm?.map((item) => {
        return {
          ...item,
          Hike: hikePercent,
          AdultCost:
            item?.AdultCost && !isNaN(item?.AdultCost)
              ? Math.floor(
                  parseFloat(item?.AdultCost) +
                    (parseFloat(item?.AdultCost) * hikePercent) / 100
                )
              : item?.AdultCost,
          ChildCost:
            item?.ChildCost && !isNaN(item?.ChildCost)
              ? Math.floor(
                  parseFloat(item?.ChildCost) +
                    (parseFloat(item?.ChildCost) * hikePercent) / 100
                )
              : item?.ChildCost,
          GuideCharges:
            item?.GuideCharges && !isNaN(item?.GuideCharges)
              ? Math.floor(
                  parseFloat(item?.GuideCharges) +
                    (parseFloat(item?.GuideCharges) * hikePercent) / 100
                )
              : item?.GuideCharges,
          ServiceCharges:
            item?.ServiceCharges && !isNaN(item?.ServiceCharges)
              ? Math.floor(
                  parseFloat(item?.ServiceCharges) +
                    (parseFloat(item?.ServiceCharges) * hikePercent) / 100
                )
              : item?.ServiceCharges,
          HandlingCharges:
            item?.HandlingCharges && !isNaN(item?.HandlingCharges)
              ? Math.floor(
                  parseFloat(item?.HandlingCharges) +
                    (parseFloat(item?.HandlingCharges) * hikePercent) / 100
                )
              : item?.HandlingCharges,
        };
      });
    }

    setTrainFormValue(updatedData);
  };

  useEffect(() => {
    let priceKey = [
      { Name: "AdultCost", Price: 0 },
      { Name: "ChildCost", Price: 0 },
      { Name: "ServiceCharges", Price: 0 },
      { Name: "HandlingCharges", Price: 0 },
      { Name: "GuideCharges", Price: 0 },
    ];

    const calculatePrice = (data, key) => {
      let Price = 0;

      data.forEach((item) => {
        Price += parseFloat(item[key]) || 0;
      });

      return Price;
    };

    // const filteredTrainForm = trainFormValue?.filter(
    //   (form) => form?.ServiceId != ""
    // );

    let finalPrice = priceKey.map((key) => {
      return {
        Name: key.Name,
        Price: calculatePrice(trainFormValue, key.Name),
      };
    });

    let AdultPrice = finalPrice?.find(
      (price) => price?.Name == "AdultCost"
    )?.Price;
    let ChildPrice = finalPrice?.find(
      (price) => price?.Name == "ChildCost"
    )?.Price;
    let ServicePrice = finalPrice?.find(
      (price) => price?.Name == "ServiceCharges"
    )?.Price;
    let HandlingPrice = finalPrice?.find(
      (price) => price?.Name == "HandlingCharges"
    )?.Price;
    let GuidePrice = finalPrice?.find(
      (price) => price?.Name == "GuideCharges"
    )?.Price;

    setTrainPriceCalculation((prevData) => ({
      ...prevData,
      Price: {
        Adult: AdultPrice,
        Child: ChildPrice,
        Service: ServicePrice,
        Handling: HandlingPrice,
        Guide: GuidePrice,
      },
      MarkupOfCost: {
        Adult: (AdultPrice * 5) / 100,
        Child: (ChildPrice * 5) / 100,
        Service: (ServicePrice * 5) / 100,
        Handling: (HandlingPrice * 5) / 100,
        Guide: (GuidePrice * 5) / 100,
      },
    }));
  }, [
    trainFormValue?.map((item) => item?.AdultCost).join(","),
    trainFormValue?.map((item) => item?.ChildCost).join(","),
    trainFormValue?.map((item) => item?.ServiceCharges).join(","),
    trainFormValue?.map((item) => item?.HandlingCharges).join(","),
    trainFormValue?.map((item) => item?.GuideCharges).join(","),
    trainFormValue?.map((item) => item?.ServiceId).join(","),
    hikePercent,
  ]);

  const handleIsOpen = () => {
    if (dataIsLoaded) {
      dispatch({
        type: "SET_TRAIN_DATA_LOAD",
        payload: true,
      });
      setDataIsLoaded(false);
    }

    setIsOpen(!isOpen);
  };

  useEffect(() => {
    return () => {
      dispatch({
        type: "SET_TRAIN_DATA_LOAD",
        payload: false,
      });
    };
  }, []);

  // =========================================

  const trainData = useSelector(
    (state) => state.itineraryServiceCopyReducer.trainData
  );
  const trainCheckbox = useSelector(
    (state) => state.itineraryServiceCopyReducer.trainCheckbox
  );

  const handleCopy = (e) => {
    const { checked } = e.target;

    if (checked && trainCheckbox) {
      const newTrain = trainData?.TrainFormValue?.map((sourceTrain) => {
        const matchedTrain = trainFormValue?.find(
          (train) => train?.DayNo == sourceTrain?.DayNo
        );

        console.log(matchedTrain, "WATSTTDT", trainData);

        return {
          ...sourceTrain,
          DayType: "Foreigner",
          DayUniqueId: matchedTrain?.DayUniqueId,
        };
      });

      setTrainFormValue(newTrain);
      setOriginalTrainForm(newTrain);

      setCopyChecked(true);
      dispatch(setItineraryCopyTrainFormDataCheckbox({ foreigner: false }));
    } else {
      setCopyChecked(false);
    }
  };

  return (
    <div className="row mt-3 m-0">
      <div
        className="col-12 px-1 py-2 d-flex justify-content-between itinerary-head-bg foreignerEscort-head-bg"
        onClick={handleIsOpen}
      >
        <div className="d-flex gap-4 align-items-center">
          <div className="d-flex gap-2">
            <img src={trainIcon} alt="trainIcon" />
            <label htmlFor="" className="fs-5">
              Train
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
              onChange={(e) => handleCopy(e)}
            />
            <label className="fontSize11px m-0 ms-1" htmlFor="copy-guide">
              Copy
            </label>
          </div>
        </div>
        {/* <div className="d-flex gap-4 align-items-center ms-auto">
          {" "}
          {Type == "Main" && (
            <div
              className="d-flex gap-2 align-items-center hike-input"
              onClick={(e) => e.stopPropagation()}
            >
              <label htmlFor="" className="fs-6 align-se">
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
          <span className="cursor-pointer fs-5">
            {!isOpen ? (
              <FaChevronCircleUp
                className="text-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(!isOpen);
                }}
              />
            ) : (
              <FaChevronCircleDown
                className="text-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(!isOpen);
                }}
              />
            )}
          </span>
        </div> */}
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
      {isOpen && (
        <>
          <div className="col-12 px-0 mt-2">
            <PerfectScrollbar>
              <table class="table table-bordered itinerary-table">
                <thead>
                  <tr>
                    <th
                      className="text-center align-middle py-1 days-width-9"
                      rowSpan={2}
                    >
                      {trainFormValue[0]?.Date ? "Day / Date" : "Day"}
                    </th>
                    {(Type == "Local" || Type == "Foreigner") && (
                      <th className="py-1 align-middle" rowSpan={2}>
                        Escort
                      </th>
                    )}
                    <th className="py-1 align-middle">From</th>
                    <th className="py-1 align-middle sector-width-6">To</th>
                    <th className="py-1 align-middle sector-width-6">Sector</th>
                    <th className="py-1 align-middle" rowSpan={2}>
                      Train Name
                    </th>
                    <th className="py-1 align-middle" rowSpan={2}>
                      Train Number
                    </th>
                    <th className="py-1 align-middle" rowSpan={2}>
                      Type
                    </th>
                    <th className="py-1 align-middle" rowSpan={2}>
                      Supplier
                    </th>
                    <th className="py-1 align-middle" rowSpan={2}>
                      Class
                    </th>
                    <th className="py-1 align-middle" rowSpan={2}>
                      Departure Time
                    </th>
                    <th className="py-1 align-middle" rowSpan={2}>
                      Arrival Time
                    </th>
                    <th className="py-1 align-middle" rowSpan={2}>
                      Adult
                    </th>
                    <th className="py-1 align-middle" rowSpan={2}>
                      Child
                    </th>
                    <th className="py-1 align-middle" rowSpan={2}>
                      Guide
                    </th>
                    <th className="py-1 align-middle" rowSpan={2}>
                      Service Charge
                    </th>
                    <th className="py-1 align-middle" rowSpan={2}>
                      Handling Charge
                    </th>
                    <th className="py-1 align-middle" rowSpan={2}>
                      Remarks
                    </th>
                  </tr>
                  <tr></tr>
                </thead>
                <tbody>
                  {trainFormValue?.map((item, index) => {
                    return (
                      <tr key={index + 1}>
                        <td className="days-width-9">
                          <div className="d-flex gap-1 justify-content-start">
                            <div className="d-flex gap-1">
                              <div
                                className="d-flex align-items-center pax-icon"
                                onClick={() => handlePaxModalClick(index)}
                              >
                                <i className="fa-solid fa-person"></i>
                              </div>
                              <span onClick={() => handleTableIncrement(index)}>
                                <i className="la la-plus border cursor-pointer bg-success text-white rounded-pill fontSize10px padding1px"></i>
                              </span>

                              <span onClick={() => handleTableDecrement(index)}>
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
                                value={trainFormValue[index]?.Escort}
                                onChange={(e) =>
                                  handleTrainFormChange(index, e)
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
                              value={trainFormValue[index]?.FromDestination}
                              onChange={(e) => handleTrainFormChange(index, e)}
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
                              value={trainFormValue[index]?.ToDestination}
                              onChange={(e) => handleTrainFormChange(index, e)}
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
                          <div className="sector-width-6">
                            <span>{fromToDestinationList[index]}</span>
                          </div>
                        </td>
                        <td>
                          <div>
                            <select
                              name="ServiceId"
                              value={trainFormValue[index]?.ServiceId}
                              onChange={(e) => handleTrainFormChange(index, e)}
                              className="formControl1"
                            >
                              <option value="">Select</option>
                              {trainList[index] != undefined &&
                                trainList[index]?.map((item, index) => {
                                  return (
                                    <option value={item?.id} key={index + 1}>
                                      {item?.Name}
                                    </option>
                                  );
                                })}
                            </select>
                          </div>
                        </td>
                        <td>
                          <div>
                            <input
                              type="text"
                              id=""
                              className="formControl1 "
                              name="TrainNumber"
                              value={trainFormValue[index]?.TrainNumber}
                              onChange={(e) => handleTrainFormChange(index, e)}
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <select
                              name="TypeName"
                              value={trainFormValue[index]?.TypeName}
                              onChange={(e) => handleTrainFormChange(index, e)}
                              id=""
                              className="formControl1"
                            >
                              <option value="">Select</option>
                              {trainTypeList[index]?.map((type, index) => {
                                return (
                                  <option value={type?.Id} key={index + 1}>
                                    {type?.TypeName}
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
                              value={trainFormValue[index]?.Supplier}
                              onChange={(e) => handleTrainFormChange(index, e)}
                              className="formControl1"
                            >
                              <option value="">Select</option>
                              {supplierList[index] != undefined &&
                                supplierList[index].map((item, index) => {
                                  return (
                                    <option value={item?.id} key={index + 1}>
                                      {item?.Name}
                                    </option>
                                  );
                                })}
                            </select>
                          </div>
                        </td>
                        <td>
                          <div>
                            <select
                              name="TrainClass"
                              value={trainFormValue[index]?.TrainClass}
                              onChange={(e) => handleTrainFormChange(index, e)}
                              className="formControl1"
                            >
                              <option value="">Select</option>
                              {trainClassList[index] != undefined &&
                                trainClassList[index].map((item, index) => {
                                  return (
                                    <option value={item?.id} key={index + 1}>
                                      {item?.Name}
                                    </option>
                                  );
                                })}
                            </select>
                          </div>
                        </td>
                        <td>
                          <div className="" style={{ zIndex: "0" }}>
                            {/* <DarkCustomTimePicker
                              name="DepartureTime"
                              value={trainFormValue[index]?.DepartureTime}
                              onChange={(e) => handleTrainFormChange(index, e)}
                            />*/}
                            <input
                              type="text"
                              id=""
                              placeholder="00:00"
                              name="DepartureTime"
                              value={trainFormValue[index]?.DepartureTime}
                              onChange={(e) => handleTrainFormChange(index, e)}
                              className="formControl1"
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            {/*<DarkCustomTimePicker
                              name="ArrivalTime"
                              value={trainFormValue[index]?.ArrivalTime}
                              onChange={(e) => handleTrainFormChange(index, e)}
                            />*/}
                            <input
                              type="text"
                              id=""
                              placeholder="00:00"
                              name="ArrivalTime"
                              value={trainFormValue[index]?.ArrivalTime}
                              onChange={(e) => handleTrainFormChange(index, e)}
                              className="formControl1"
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <input
                              id=""
                              className="formControl1"
                              name="AdultCost"
                              value={trainFormValue[index]?.AdultCost}
                              onChange={(e) => handleTrainFormChange(index, e)}
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <input
                              id=""
                              name="ChildCost"
                              value={trainFormValue[index]?.ChildCost}
                              onChange={(e) => handleTrainFormChange(index, e)}
                              className="formControl1"
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <input
                              id=""
                              name="GuideCharges"
                              value={trainFormValue[index]?.GuideCharges}
                              onChange={(e) => handleTrainFormChange(index, e)}
                              className="formControl1"
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <input
                              id=""
                              name="ServiceCharges"
                              value={trainFormValue[index]?.ServiceCharges}
                              onChange={(e) => handleTrainFormChange(index, e)}
                              className="formControl1"
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <input
                              id=""
                              name="HandlingCharges"
                              value={trainFormValue[index]?.HandlingCharges}
                              onChange={(e) => handleTrainFormChange(index, e)}
                              className="formControl1"
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <input
                              id=""
                              className="formControl1"
                              name="Remarks"
                              value={trainFormValue[index]?.Remarks}
                              onChange={(e) => handleTrainFormChange(index, e)}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="costing-td">
                    <td
                      colSpan={Type == "Local" || Type == "Foreigner" ? 11 : 10}
                      rowSpan={3}
                      className="text-center fs-6"
                    >
                      Total
                    </td>
                    <td>Train Cost</td>
                    <td>
                      {mathRoundHelper(trainPriceCalculation?.Price?.Adult)}
                    </td>
                    <td>
                      {mathRoundHelper(trainPriceCalculation?.Price?.Child)}
                    </td>
                    <td>
                      {mathRoundHelper(trainPriceCalculation?.Price?.Guide)}
                    </td>
                    <td>
                      {mathRoundHelper(trainPriceCalculation?.Price?.Service)}
                    </td>
                    <td>
                      {mathRoundHelper(trainPriceCalculation?.Price?.Handling)}
                    </td>
                    <td></td>
                  </tr>
                  <tr className="costing-td">
                    <td>Markup(5) %</td>
                    <td>
                      {mathRoundHelper(
                        trainPriceCalculation?.MarkupOfCost?.Adult
                      )}
                    </td>
                    <td>
                      {mathRoundHelper(
                        trainPriceCalculation?.MarkupOfCost?.Child
                      )}
                    </td>
                    <td>
                      {mathRoundHelper(
                        trainPriceCalculation?.MarkupOfCost?.Guide
                      )}
                    </td>
                    <td>
                      {mathRoundHelper(
                        trainPriceCalculation?.MarkupOfCost?.Service
                      )}
                    </td>
                    <td>
                      {mathRoundHelper(
                        trainPriceCalculation?.MarkupOfCost?.Handling
                      )}
                    </td>
                    <td></td>
                  </tr>
                  <tr className="costing-td">
                    <td>Total</td>
                    <td>
                      {mathRoundHelper(
                        parseInt(trainPriceCalculation?.Price?.Adult) +
                          parseInt(trainPriceCalculation?.MarkupOfCost?.Adult)
                      )}
                    </td>
                    <td>
                      {mathRoundHelper(
                        parseInt(trainPriceCalculation?.Price?.Child) +
                          parseInt(trainPriceCalculation?.MarkupOfCost?.Child)
                      )}
                    </td>
                    <td>
                      {mathRoundHelper(
                        parseInt(trainPriceCalculation?.Price?.Guide) +
                          parseInt(trainPriceCalculation?.MarkupOfCost?.Guide)
                      )}
                    </td>
                    <td>
                      {mathRoundHelper(
                        parseInt(trainPriceCalculation?.Price?.Service) +
                          parseInt(trainPriceCalculation?.MarkupOfCost?.Service)
                      )}
                    </td>
                    <td>
                      {mathRoundHelper(
                        parseInt(trainPriceCalculation?.Price?.Handling) +
                          parseInt(
                            trainPriceCalculation?.MarkupOfCost?.Handling
                          )
                      )}
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </PerfectScrollbar>
          </div>
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

export default ForeignerTrain;
