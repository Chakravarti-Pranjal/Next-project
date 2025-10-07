import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { axiosOther } from "../../../../../http/axios_base_url";
import { itineraryFlightInitialValue } from "../qoutation_initial_value";
import { notifyError, notifySuccess } from "../../../../../helper/notify";
import { ToastContainer } from "react-toastify";
import flightIcon from "../../../../../images/itinerary/flight.svg";
import {
  setFlightPrice,
  setTogglePriceState,
} from "../../../../../store/actions/PriceAction";
import { setItineraryFlightData } from "../../../../../store/actions/itineraryDataAction";
import { checkPrice } from "../../../../../helper/checkPrice";
import { FaChevronCircleUp, FaChevronCircleDown } from "react-icons/fa";
import { Modal, Row, Col, Button } from "react-bootstrap";
import { setQoutationResponseData } from "../../../../../store/actions/queryAction";
import { incrementLocalEscortCharges } from "../../../../../store/actions/createExcortLocalForeignerAction";
import moment from "moment";
import mathRoundHelper from "../../helper-methods/math.round";

const LocalEscortFlightForm = ({ Type, transportFormValue }) => {
  const { qoutationData, queryData, isItineraryEditing, headerDropdown } =
    useSelector((data) => data?.queryReducer);
  const [flightOriginalForm, setFlightOriginalForm] = useState([]);
  const [copyChecked, setCopyChecked] = useState(false);
  const [flightFormValue, setFlightFormValue] = useState([]);
  const [flightList, setFlightList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const { flightFormData } = useSelector((data) => data?.itineraryReducer);
  const [rateList, setRateList] = useState([]);
  const [flightRateList, setFlightRateList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const [flightTypeList, setFlightTypeList] = useState([]);
  const [flightClassList, setFlightClassList] = useState([]);
  const [hikePercent, setHikePercent] = useState(0);
  const [isMergeRate, setIsMergeRate] = useState(true);
  const [paxFormValue, setPaxFormValue] = useState({
    Adults: "",
    Child: "",
    Infant: "",
  });
  const [modalCentered, setModalCentered] = useState({
    modalIndex: "",
    isShow: false,
  });
  const [flightPriceCalculation, setFlightPriceCalculation] = useState({
    Price: {
      Adult: 0,
      Child: 0,
      Service: 0,
      Handling: 0,
      Guide: 0,
    },
    Markup: {
      Adult: 0,
      Child: 0,
      Service: 0,
      Handling: 0,
      Guide: 0,
    },
    MarkupOfCost: {
      Adult: 0,
      Child: 0,
      Service: 0,
      Handling: 0,
      Guide: 0,
    },
  });
  const [fromToDestinationList, setFromToDestinationList] = useState([]);
  const [destinationList, setDestinationList] = useState([]);

  const [dataIsLoaded, setDataIsLoaded] = useState(true);
  const apiDataLoad = useSelector(
    (state) => state.inineraryServiceDataLoadReducer.flight
  );

  const qoutationDataLocal = qoutationData?.ExcortDays?.find(
    (item) => item.Type === "Local"
  );

  // flight table form initial value
  useEffect(() => {
    if (!apiDataLoad) return;
    if (qoutationDataLocal?.Days) {
      const hasTrainService = qoutationDataLocal?.Days.some((day) =>
        day?.DayServices?.some((service) => service.ServiceType === "Flight")
      );

      if (hasTrainService) {
        setCopyChecked(true);
        const initialFormValue = qoutationDataLocal?.Days?.filter((day) => {
          const hasFlightTransport = transportFormValue?.some(
            (transport) =>
              transport?.DayNo === day?.Day &&
              transport?.Mode?.toLowerCase() === "flight"
          );
          return hasFlightTransport;
        })?.map((day) => {
          const service = day?.DayServices?.find(
            (service) => service?.ServiceType === "Flight"
          );
          const { ItemUnitCost, TimingDetails, ItemSupplierDetail } =
            service?.ServiceDetails?.flat?.(1)?.[0] || {};

          return {
            id: queryData?.QueryId || "",
            QuatationNo: qoutationData?.QuotationNumber || "",
            DayType: "Local" || "",
            DayNo: day?.Day || "",
            Date: day?.Date || "",
            Destination: day?.DestinationId || "",
            DestinationUniqueId: day?.DestinationUniqueId || "",
            DayUniqueId: day?.DayUniqueId || "",
            ServiceId: service?.ServiceId || "",
            Escort: 1,
            GuideCharges: service?.GuideCharges,
            HandlingCharges: service?.HandlingCharges,
            ServiceCharges: service?.ServiceCharges,
            TypeName: service?.AirType,
            Type: service?.ServiceId || "1",
            Supplier: ItemSupplierDetail?.ItemSupplierId || "",
            DepartureTime: TimingDetails?.ItemFromTime || "",
            AdultCost: service?.TotalCosting?.ServiceAdultCost || "",
            ChildCost: service?.TotalCosting?.ServiceChildCost || "",
            InfantCost: ItemUnitCost?.Infant || "",
            ArrivalTime: TimingDetails?.ItemToTime || "",
            Remarks: TimingDetails?.Remark || "",
            FlightNumber: service?.FlightNumber || "",
            FlightClass: service?.FlightClassId || "",
            FromDestination: day?.DestinationId || "",
            ToDestination: service?.ToDestinationId || "",
            ServiceMainType: "No",
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

        setFlightFormValue(initialFormValue);
        setFlightOriginalForm(initialFormValue);
      } else {
        // Render only days with Mode === "flight" in transportFormValue
        const flightInitialValue = transportFormValue
          ?.filter((transport) => transport?.Mode?.toLowerCase() === "flight")
          ?.map((transport) => {
            const day = qoutationDataLocal?.Days?.find(
              (day) => day?.Day === transport?.DayNo
            );

            return {
              ...itineraryFlightInitialValue,
              id: queryData?.QueryId,
              DayNo: transport?.DayNo || "",
              Date: day?.Date || "",
              FromDestination: transport?.FromDestination || "",
              ToDestination: transport?.ToDestination || "",
              DestinationUniqueId: day?.DestinationUniqueId || "",
              QuatationNo: qoutationData?.QuotationNumber,
              DayUniqueId: day?.DayUniqueId,
              ItemFromDate: qoutationData?.TourSummary?.FromDate,
              ItemToDate: qoutationData?.TourSummary?.ToDate,
              RateUniqueId: "",
              DayType: "Local",
              Type: "1",
              PaxInfo: {
                Adults: qoutationData?.Pax?.AdultCount,
                Child: qoutationData?.Pax?.ChildCount,
                Infant: qoutationData?.Pax?.Infant,
                Escort: "",
              },
            };
          });

        // if (Type === "Local") {
        //   const initialLocalData = flightInitialValue?.map((form) => ({
        //     id: form?.QueryId,
        //     DayNo: form.DayNo || "",
        //     Escort: form.Escort || "",
        //     FromDestination: form.FromDestination || "",
        //     ToDestination: form.ToDestination || "",
        //     ServiceId: form.ServiceId || "",
        //   }));

        //   setFlightFormValue(initialLocalData);
        // } else if (Type === "Foreigner") {
        //   const initialForeignData = flightInitialValue?.map((form) => ({
        //     id: form?.QueryId,
        //     DayNo: form.DayNo || "",
        //     Escort: form.Escort || "",
        //     FromDestination: form.FromDestination || "",
        //     ToDestination: form.ToDestination || "",
        //     ServiceId: form.ServiceId || "",
        //   }));
        //   setFlightFormValue(initialForeignData);
        // } else {
        // }
        setFlightFormValue(flightInitialValue);
        setFlightOriginalForm(flightInitialValue);
      }
    }
  }, [qoutationData, transportFormValue, isItineraryEditing, apiDataLoad]);

  const postDataToServer = async (index) => {
    try {
      const { data } = await axiosOther.post("flightclasslist");
      setFlightClassList((prevArr) => {
        const newArr = [...prevArr];
        newArr[index] = data?.DataList;
        return newArr;
      });
    } catch (error) {
      console.log("error", error);
    }
    try {
      const { data } = await axiosOther.post("airlinemasterlist");
      setFlightList((prevArr) => {
        const newArr = [...prevArr];
        newArr[index] = data?.DataList;
        return newArr;
      });
    } catch (error) {
      console.log("error", error);
    }
    try {
      const { data } = await axiosOther.post("airtypelist");
      setFlightTypeList((prevArr) => {
        const newArr = [...prevArr];
        newArr[index] = data?.Data;
        return newArr;
      });
    } catch (error) {
      console.log("flight-err", error);
    }

    try {
      const { data } = await axiosOther.post("destinationlist");
      setDestinationList(data?.DataList);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    if (!apiDataLoad) return;
    flightFormValue?.forEach((_, index) => {
      postDataToServer(index);
    });
  }, [
    flightFormValue?.map((flight) => flight?.DayUniqueId).join(","),
    apiDataLoad,
  ]);

  const getSupplierDependentOnDestination = async (destination, index) => {
    try {
      const { data } = await axiosOther.post("supplierlist", {
        Name: "",
        id: "",
        SupplierService: "",
        DestinationId: [destination],
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
    if (!apiDataLoad) return;
    flightFormValue?.forEach((flight, index) => {
      getSupplierDependentOnDestination(flight?.FromDestination, index);
    });
  }, [
    flightFormValue?.map((flight) => flight?.FromDestination).join(","),
    apiDataLoad,
  ]);

  // set first value into form
  const setFirstValueIntoForm = (index) => {
    const flightClassId =
      flightClassList[index]?.length > 0 ? flightClassList[index][0]?.id : "";

    const flightId =
      flightList[index]?.length > 0 ? flightList[index][0]?.id : "";

    const supplierId =
      supplierList[index]?.length > 0 ? supplierList[index][0]?.id : "";

    const airlineTypeId =
      flightTypeList[0]?.length > 0 ? flightTypeList[0][0]?.Id : "";

    setFlightFormValue((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = {
        ...newArr[index],
        FlightClass: flightClassId,
        ServiceId: flightId,
        Supplier: supplierId,
        TypeName: airlineTypeId,
      };
      return newArr;
    });

    setFlightOriginalForm((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = {
        ...newArr[index],
        FlightClass: flightClassId,
        ServiceId: flightId,
        Supplier: supplierId,
        TypeName: airlineTypeId,
      };
      return newArr;
    });
  };
  useEffect(() => {
    if (!isItineraryEditing) {
      flightFormValue?.forEach((_, index) => {
        setFirstValueIntoForm(index);
      });
    }
  }, [
    flightClassList,
    supplierList,
    flightTypeList,
    flightList,
    fromToDestinationList,
  ]);

  const handleTableIncrement = (index) => {
    const indexHotel = flightFormValue[index];
    setFlightFormValue((prevArr) => {
      const newArr = [...prevArr];
      newArr.splice(index + 1, 0, { ...indexHotel, isCopied: true });
      return newArr;
    });
    setFlightOriginalForm((prevArr) => {
      const newArr = [...prevArr];
      newArr.splice(index + 1, 0, { ...indexHotel, isCopied: true });
      return newArr;
    });
  };

  const handleTableDecrement = (index) => {
    const filteredTable = flightFormValue?.filter((item, ind) => ind != index);
    setFlightFormValue(filteredTable);
    setFlightOriginalForm(filteredTable);
  };

  // merge rate
  const mergeFlightRateJson = (indx, serviceId) => {
    if (isMergeRate) {
      const flightRate = flightFormValue?.map((flight, index) => {
        // Find the rate where AirlineId matches flight.ServiceId
        const rate = rateList?.find((rate) => rate.AirlineId === 7);

        // Determine findedRate based on RateJson
        const findedRate =
          rate && Array.isArray(rate.RateJson) && rate.RateJson.length > 0
            ? rate.RateJson[0]
            : null;

        if (!findedRate) {
          // If no valid rate is found or ServiceId doesn't match, set costs to 0
          return {
            ...flight,
            AdultCost: 0,
            ChildCost: 0,
            ServiceCharges: 0,
            HandlingCharges: 0,
            GuideCharges: 0,
          };
        } else {
          // If valid rate is found, update costs using checkPrice
          return {
            ...flight,
            AdultCost: checkPrice(findedRate.AdultCost?.base_fare || 0),
            ChildCost: checkPrice(findedRate.ChildCost?.base_fare || 0),
            ServiceCharges: checkPrice(0),
            HandlingCharges: checkPrice(0),
            GuideCharges: checkPrice(0),
          };
        }
      });

      if (flightFormValue.length > 0) {
        setIsMergeRate(false);
        setFlightFormValue(flightRate);
        setFlightOriginalForm(flightRate);
      }
    } else {
      // Find the rate where AirlineId matches serviceId
      const rate = rateList?.find((rate) => rate.AirlineId === serviceId);

      // Determine findedRate based on RateJson
      const findedRate =
        rate && Array.isArray(rate.RateJson) && rate.RateJson.length > 0
          ? rate.RateJson[0]
          : null;

      if (!findedRate) {
        // If no valid rate is found or serviceId doesn't match, set costs to 0
        setFlightFormValue((prevArr) => {
          let newArr = [...prevArr];
          newArr[indx] = {
            ...newArr[indx],
            AdultCost: 0,
            ChildCost: 0,
            ServiceCharges: 0,
            HandlingCharges: 0,
            GuideCharges: 0,
          };
          return newArr;
        });
      } else {
        // If valid rate is found, update costs using checkPrice
        setFlightFormValue((prevArr) => {
          let newArr = [...prevArr];
          newArr[indx] = {
            ...newArr[indx],
            AdultCost: checkPrice(findedRate.AdultCost?.base_fare || 0),
            ChildCost: checkPrice(findedRate.ChildCost?.base_fare || 0),
            ServiceCharges: checkPrice(0),
            HandlingCharges: checkPrice(0),
            GuideCharges: checkPrice(0),
          };
          return newArr;
        });
      }
    }
  };

  useEffect(() => {
    if (isMergeRate) {
      mergeFlightRateJson();
    }
  }, [rateList, flightFormValue?.map((train) => train?.DayUniqueId).join(",")]);

  const handleFlightChange = (ind, e) => {
    let { name, value } = e.target;
    // console.log(name, value, "value22");

    if (name == "ServiceId") {
      value = parseInt(value);
    }

    setFlightFormValue((prevForm) => {
      const newArr = [...prevForm];
      newArr[ind] = { ...newArr[ind], [name]: value };
      return newArr;
    });

    setFlightOriginalForm((prevForm) => {
      const newArr = [...prevForm];
      newArr[ind] = { ...newArr[ind], [name]: value };
      return newArr;
    });

    // if (name == "ServiceId") {
    //   mergeFlightRateJson(ind, value);
    // }
  };

  const handleFinalSave = async () => {
    const totalPriceForPax = () => {
      let firstPrice =
        parseInt(flightPriceCalculation?.Price?.Adult) +
        parseInt(flightPriceCalculation?.MarkupOfCost?.Adult);

      let secondPrice =
        parseInt(flightPriceCalculation?.Price?.Child) +
        parseInt(flightPriceCalculation?.MarkupOfCost?.Child);

      let thirdPrice =
        parseInt(flightPriceCalculation?.Price?.Service) +
        parseInt(flightPriceCalculation?.MarkupOfCost?.Service);

      let fourthPrice =
        parseInt(flightPriceCalculation?.Price?.Handling) +
        parseInt(flightPriceCalculation?.MarkupOfCost?.Handling);

      let fivthPrice =
        parseInt(flightPriceCalculation?.Price?.Guide) +
        parseInt(flightPriceCalculation?.MarkupOfCost?.Guide);

      let allPrice =
        firstPrice + secondPrice + thirdPrice + fourthPrice + fivthPrice;
      return allPrice;
    };

    try {
      const finalForm = flightFormValue?.map((form, index) => {
        return {
          ...form,
          Hike: hikePercent,
          Sector: fromToDestinationList[index],
          DayType: "Local",
          TotalCosting: {
            ServiceAdultCost: flightPriceCalculation?.Price?.Adult,
            ServiceChildCost: flightPriceCalculation?.Price?.Child,
            AdultMarkupValue: 5,
            ChildMarkupValue: 5,
            AdultMarkupTotal: flightPriceCalculation?.MarkupOfCost?.Adult,
            ChildMarkupTotal: flightPriceCalculation?.MarkupOfCost?.Adult,
            TotalAdultServiceCost:
              flightPriceCalculation?.Price?.Adult +
              flightPriceCalculation?.MarkupOfCost?.Adult,
            TotalChildServiceCost:
              flightPriceCalculation?.Price?.Child +
              flightPriceCalculation?.MarkupOfCost?.Child,
          },
        };
      });

      const filteredFinalForm = finalForm?.filter(
        (form) => form?.ServiceId != ""
      );
      const updatedJsonData = filteredFinalForm?.map((item) => {
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

      const { data } = await axiosOther.post(
        "update-quotation-flight",
        // filteredFinalForm
        updatedJsonData
      );
      if (data?.status == 1) {
        dispatch(incrementLocalEscortCharges());
        notifySuccess("Services Added !");
        dispatch(setFlightPrice(totalPriceForPax()));
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
    const costArr = flightFormValue?.map((flight) => {
      if (flight?.ServiceId != "") {
        let arr = [flight?.AdultCost, flight?.ChildCost, flight?.InfantCost];

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
    flightFormValue
      ?.map(
        (flight) => flight?.AdultCost + flight?.ChildCost + flight?.InfantCost
      )
      ?.join(","),
    flightFormValue?.map((item) => item?.ServiceId).join(","),
  ]);

  const getFlightRateApi = async () => {
    try {
      const { data } = await axiosOther.post("flightPriceList", {
        FlightId: "",
        Name: "",
        QueryId: "",
        QuatationNo: "",
        // QueryId: queryData?.QueryId,
        // QuatationNo: qoutationData?.QuotationNumber,
        // Year: headerDropdown?.Year,
      });

      // setRateList((prevArr) => {
      //   const newArr = [...prevArr];
      //   newArr[index] = data?.Data;
      //   return newArr;
      // });

      const list = data?.Data || data?.DataList;

      setRateList([]);
    } catch (error) {
      console.log("rate-err", error);
    }
  };

  // useEffect(() => {
  //   flightFormValue?.forEach((form, index) => {
  //     getFlightRateApi(index, form?.ServiceId);
  //   });
  // }, [
  //   flightFormValue?.map((form) => form?.Destination)?.join(","),
  //   flightFormValue?.map((form) => form?.ServiceId)?.join(","),
  // ]);

  useEffect(() => {
    getFlightRateApi();
  }, []);

  //calculating from destination & to destination
  useEffect(() => {
    const destinations = flightFormValue?.map((flight) => {
      return {
        From: flight?.FromDestination,
        To: flight?.ToDestination,
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
    flightFormValue?.map((flight) => flight?.FromDestination).join(","),
    flightFormValue?.map((flight) => flight?.ToDestination).join(","),
    destinationList,
  ]);
  const handlePaxChange = (index, e) => {
    const { name, value } = e.target;
    setPaxFormValue({ ...paxFormValue, [name]: value });
  };

  const handlePaxModalClick = (index) => {
    setModalCentered({ modalIndex: index, isShow: true });

    const form = flightFormValue?.filter((form, ind) => ind == index)[0];
    setPaxFormValue({
      Adults: form?.PaxInfo?.Adults,
      Child: form?.PaxInfo?.Child,
      Infant: form?.PaxInfo?.Infant,
    });
  };

  const handlePaxSave = () => {
    setFlightFormValue((prevForm) => {
      const newForm = [...prevForm];
      newForm[modalCentered?.modalIndex] = {
        ...newForm[modalCentered?.modalIndex],
        PaxInfo: paxFormValue,
      };
      return newForm;
    });
    setFlightOriginalForm((prevForm) => {
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

  //   const updatedData = flightOriginalForm?.map((item) => {
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
  //   setFlightFormValue(updatedData);
  // };

  //  Change here
  const handleHikeChange = (e) => {
    const { value } = e.target;
    const hikePercent = parseFloat(value) || "";
    setHikePercent(hikePercent);

    const updatedData = flightOriginalForm?.map((item, idx) => {
      // Safely access rateList, default to empty object if undefined
      const rate = rateList?.[idx]?.[0]?.RateJson
        ? Array.isArray(rateList[idx][0].RateJson)
          ? rateList[idx][0].RateJson[0]
          : rateList[idx][0].RateJson
        : {};

      const getHikedValue = (cost, fallbackCost) => {
        const base = parseFloat(cost ?? fallbackCost ?? 0);
        if (isNaN(base)) return parseFloat(fallbackCost) || 0;
        return Math.floor(base + (base * hikePercent) / 100);
      };

      return {
        ...item,
        Hike: hikePercent,
        AdultCost: getHikedValue(rate.AdultCost, item.AdultCost),
        ChildCost: getHikedValue(rate.ChildCost, item.ChildCost),
        InfantCost: getHikedValue(rate.InfantCost, item.InfantCost),
        GuideCharges: getHikedValue(rate.GuideCharges, item.GuideCharges),
        ServiceCharges: getHikedValue(rate.ServiceCharges, item.ServiceCharges),
        HandlingCharges: getHikedValue(
          rate.HandlingCharges,
          item.HandlingCharges
        ),
      };
    });

    setFlightFormValue(updatedData);
    // Do not update flightOriginalForm to preserve original values
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

    const flightFilterForm = flightFormValue?.filter(
      (form) => form?.ServiceId != ""
    );

    let finalPrice = priceKey.map((key) => {
      return {
        Name: key.Name,
        Price: calculatePrice(flightFilterForm, key.Name),
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

    setFlightPriceCalculation((prevData) => ({
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
    flightFormValue?.map((item) => item?.AdultCost).join(","),
    flightFormValue?.map((item) => item?.ChildCost).join(","),
    flightFormValue?.map((item) => item?.ServiceCharges).join(","),
    flightFormValue?.map((item) => item?.HandlingCharges).join(","),
    flightFormValue?.map((item) => item?.GuideCharges).join(","),
    hikePercent,
    flightFormValue,
  ]);

  const handleIsOpen = () => {
    if (dataIsLoaded) {
      dispatch({
        type: "SET_FLIGHT_DATA_LOAD",
        payload: true,
      });
      setDataIsLoaded(false);
    }

    setIsOpen(!isOpen);
  };

  useEffect(() => {
    return () => {
      dispatch({
        type: "SET_FLIGHT_DATA_LOAD",
        payload: false,
      });
    };
  }, []);

  const flightData = useSelector(
    (state) => state.itineraryServiceCopyReducer.flightData
  );
  const flightCheckbox = useSelector(
    (state) => state.itineraryServiceCopyReducer.flightCheckbox
  );

  // const handleCopy = (e) => {
  //   if (!flightCheckbox.local) return;

  //   const { checked } = e.target;

  //   if (checked && flightCheckbox) {
  //     const newTrain = flightFormValue?.map((train, index) => {
  //       return {
  //         ...flightData.FlightFormValue[index],
  //         DayType: "Local",
  //         DayUniqueId: train?.DayUniqueId,
  //       };
  //     });

  //     setFlightFormValue(newTrain);

  //     setCopyChecked(true);
  //     dispatch(setItineraryCopyFlightFormDataCheckbox({ local: false }));
  //   } else {
  //     setCopyChecked(false);
  //   }
  // };

  // const handleCopy = (e) => {
  //   const { checked } = e.target;

  //   if (checked && flightCheckbox.local && flightData.FlightFormValue) {
  //     const newFlightData = flightFormValue?.map((flight, index) => {
  //       const sourceFlight = flightData.FlightFormValue[index] || {};
  //       return {
  //         ...flight,
  //         ...sourceFlight,
  //         DayType: "Local",
  //         DayUniqueId: flight?.DayUniqueId,
  //         Date: flight?.Date,
  //         FromDestination: flight?.FromDestination,
  //         ToDestination: flight?.ToDestination,
  //         QuatationNo: qoutationData?.QuotationNumber,
  //         id: queryData?.QueryId,
  //         PaxInfo: {
  //           Adults: sourceFlight?.PaxInfo?.Adults || flight?.PaxInfo?.Adults,
  //           Child: sourceFlight?.PaxInfo?.Child || flight?.PaxInfo?.Child,
  //           Infant: sourceFlight?.PaxInfo?.Infant || flight?.PaxInfo?.Infant,
  //           Escort: sourceFlight?.PaxInfo?.Escort || flight?.PaxInfo?.Escort,
  //         },
  //         ForiegnerPaxInfo: sourceFlight?.ForiegnerPaxInfo || flight?.ForiegnerPaxInfo,
  //       };
  //     });

  //     setFlightFormValue(newFlightData);
  //     setFlightOriginalForm(newFlightData);
  //     setCopyChecked(true);
  //     dispatch(setItineraryCopyFlightFormDataCheckbox({ local: false }));
  //   } else {
  //     setCopyChecked(false);
  //     setFlightFormValue(flightOriginalForm);
  //   }
  // };

  // const handleCopy = (e) => {
  //   if (!flightCheckbox.local) return;

  //   const { checked } = e.target;

  //   if (checked && flightCheckbox) {
  //     const newFlight = flightFormValue?.map((flight, index) => {
  //       return {
  //         ...flightData.FlightFormValue[index],
  //         DayType: "Local",
  //         DayUniqueId: flight?.DayUniqueId,
  //       };
  //     });

  //     setFlightFormValue(newFlight);
  //     setCopyChecked(true);
  //     dispatch(setItineraryCopyFlightFormDataCheckbox({ local: false }));
  //   } else {
  //     setCopyChecked(false);
  //   }
  // };
  const handleCopy = (e) => {
    const { checked } = e.target;

    if (!flightCheckbox.local) return;

    if (checked && flightData.FlightFormValue) {
      // console.log(flightData.FlightFormValue, 'FLY785', flightData);

      const newFlightData = flightData?.FlightFormValue?.map((sourceFlight) => {
        const matchedFlight = flightFormValue?.find(
          (flight) => flight?.DayNo === sourceFlight?.DayNo
        );

        return {
          ...sourceFlight,
          DayType: "Local",
          DayUniqueId: matchedFlight?.DayUniqueId,
          QuatationNo: qoutationData?.QuotationNumber,
          id: queryData?.QueryId,
        };
      });

      setFlightFormValue(newFlightData);
      setFlightOriginalForm(newFlightData);
      setCopyChecked(true);
      dispatch(setItineraryCopyFlightFormDataCheckbox({ local: false }));
    } else {
      setCopyChecked(false);
      setFlightFormValue(flightOriginalForm); // Reset to original
    }
  };

  return (
    <div className="row mt-3 m-0">
      <ToastContainer />
      <div
        className="col-12 px-1 py-2 d-flex justify-content-between itinerary-head-bg localEscort-head-bg"
        onClick={handleIsOpen}
      >
        <div className="d-flex gap-4 align-items-center">
          <div className="d-flex gap-2">
            <img src={flightIcon} alt="flightIcon" />
            <label htmlFor="" className="fs-5">
              Flight
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
                      className="py-1 align-middle text-center  days-width-9"
                      rowSpan={2}
                    >
                      {flightFormValue[0]?.Date ? "Day / Date" : "Day"}
                    </th>
                    {(Type == "Local" || Type == "Foreigner") && (
                      <th className="py-1 align-middle" rowSpan={2}>
                        Escort
                      </th>
                    )}
                    <th className="py-1 align-middle">From</th>
                    <th className="py-1 align-middle sector-width-6">To</th>
                    <th
                      className="py-1 align-middle sector-width-6"
                      colSpan={1}
                    >
                      Sector
                    </th>
                    <th className="py-1 align-middle" rowSpan={2}>
                      Airline Name
                    </th>
                    <th className="py-1 align-middle" rowSpan={2}>
                      Airline Number
                    </th>
                    <th className="py-1 align-middle" rowSpan={2}>
                      Class
                    </th>
                    {/* <th className="py-1 align-middle" rowSpan={2}>
                      Class
                    </th> */}
                    <th className="py-1 align-middle" rowSpan={2}>
                      Supplier
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
                  {flightFormValue?.map((item, index) => {
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
                                value={flightFormValue[index]?.Escort}
                                onChange={(e) => handleFlightChange(index, e)}
                              />
                            </div>
                          </td>
                        )}
                        <td>
                          <div>
                            <select
                              id=""
                              className="formControl1"
                              name="FromDestination"
                              value={flightFormValue[index].FromDestination}
                              onChange={(e) => handleFlightChange(index, e)}
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
                              value={flightFormValue[index]?.ToDestination}
                              onChange={(e) => handleFlightChange(index, e)}
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
                              value={flightFormValue[index]?.ServiceId}
                              onChange={(e) => handleFlightChange(index, e)}
                              id=""
                              className="formControl1"
                            >
                              <option value="">Select</option>
                              {flightList[index]?.map((item, index) => {
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
                              name="FlightNumber"
                              value={flightFormValue[index]?.FlightNumber}
                              onChange={(e) => handleFlightChange(index, e)}
                              className="formControl1"
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <select
                              id=""
                              className="formControl1"
                              name="TypeName"
                              value={flightFormValue[index]?.TypeName}
                              onChange={(e) => handleFlightChange(index, e)}
                            >
                              <option value="">Select</option>
                              {flightTypeList[0]?.map((flight, index) => {
                                return (
                                  <option key={index} value={flight?.Id}>
                                    {flight?.TypeName}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        </td>
                        {/* comment class */}
                        {/* <td>
                          <div>
                            <select
                              name="FlightClass"
                              value={flightFormValue[index]?.FlightClass}
                              onChange={(e) => handleFlightChange(index, e)}
                              id=""
                              className="formControl1"
                            >
                              <option value="">Select</option>
                              {flightClassList[index]?.map((item, index) => {
                                return (
                                  <option value={item?.id} key={index + 1}>
                                    {item?.Name}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        </td> */}
                        <td>
                          <div>
                            <select
                              name="Supplier"
                              value={flightFormValue[index]?.Supplier}
                              onChange={(e) => handleFlightChange(index, e)}
                              id=""
                              className="formControl1"
                            >
                              <option value="">Select</option>
                              {supplierList[index]?.map((item, index) => {
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
                              placeholder="00:00"
                              id=""
                              name="DepartureTime"
                              value={flightFormValue[index]?.DepartureTime}
                              onChange={(e) => handleFlightChange(index, e)}
                              className="formControl1"
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <input
                              type="text"
                              placeholder="00:00"
                              id=""
                              name="ArrivalTime"
                              value={flightFormValue[index]?.ArrivalTime}
                              onChange={(e) => handleFlightChange(index, e)}
                              className="formControl1"
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <input
                              type="number"
                              name="AdultCost"
                              value={flightFormValue[index]?.AdultCost}
                              onChange={(e) => handleFlightChange(index, e)}
                              className="formControl1"
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <input
                              type="number"
                              name="ChildCost"
                              value={flightFormValue[index]?.ChildCost}
                              onChange={(e) => handleFlightChange(index, e)}
                              className="formControl1"
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <input
                              id=""
                              name="GuideCharges"
                              value={flightFormValue[index]?.GuideCharges}
                              onChange={(e) => handleFlightChange(index, e)}
                              className="formControl1"
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <input
                              id=""
                              name="ServiceCharges"
                              value={flightFormValue[index]?.ServiceCharges}
                              onChange={(e) => handleFlightChange(index, e)}
                              className="formControl1"
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <input
                              id=""
                              name="HandlingCharges"
                              value={flightFormValue[index]?.HandlingCharges}
                              onChange={(e) => handleFlightChange(index, e)}
                              className="formControl1"
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <input
                              id=""
                              name="Remarks"
                              value={flightFormValue[index]?.Remarks}
                              onChange={(e) => handleFlightChange(index, e)}
                              className="formControl1"
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="costing-td">
                    <td
                      colSpan={Type == "Local" || Type == "Foreigner" ? 11 : 9}
                      rowSpan={3}
                      className="text-center fs-6"
                    >
                      Total
                    </td>

                    <td>Flight Cost</td>
                    <td>
                      {mathRoundHelper(flightPriceCalculation?.Price?.Adult)}
                    </td>
                    <td>
                      {mathRoundHelper(flightPriceCalculation?.Price?.Child)}
                    </td>
                    <td>
                      {mathRoundHelper(flightPriceCalculation?.Price?.Guide)}
                    </td>
                    <td>
                      {mathRoundHelper(flightPriceCalculation?.Price?.Service)}
                    </td>
                    <td>
                      {mathRoundHelper(flightPriceCalculation?.Price?.Handling)}
                    </td>
                    <td></td>
                  </tr>
                  <tr className="costing-td">
                    <td>Markup(5) %</td>
                    <td>
                      {mathRoundHelper(
                        flightPriceCalculation?.MarkupOfCost?.Adult
                      )}
                    </td>
                    <td>
                      {mathRoundHelper(
                        flightPriceCalculation?.MarkupOfCost?.Child
                      )}
                    </td>
                    <td>
                      {mathRoundHelper(
                        flightPriceCalculation?.MarkupOfCost?.Guide
                      )}
                    </td>
                    <td>
                      {mathRoundHelper(
                        flightPriceCalculation?.MarkupOfCost?.Service
                      )}
                    </td>
                    <td>
                      {mathRoundHelper(
                        flightPriceCalculation?.MarkupOfCost?.Handling
                      )}
                    </td>
                    <td></td>
                  </tr>
                  <tr className="costing-td">
                    <td>Total</td>
                    <td>
                      {mathRoundHelper(flightPriceCalculation?.Price?.Adult) +
                        mathRoundHelper(
                          flightPriceCalculation?.MarkupOfCost?.Adult
                        )}
                    </td>
                    <td>
                      {mathRoundHelper(flightPriceCalculation?.Price?.Child) +
                        mathRoundHelper(
                          flightPriceCalculation?.MarkupOfCost?.Child
                        )}
                    </td>
                    <td>
                      {mathRoundHelper(flightPriceCalculation?.Price?.Guide) +
                        mathRoundHelper(
                          flightPriceCalculation?.MarkupOfCost?.Guide
                        )}
                    </td>
                    <td>
                      {mathRoundHelper(flightPriceCalculation?.Price?.Service) +
                        mathRoundHelper(
                          flightPriceCalculation?.MarkupOfCost?.Service
                        )}
                    </td>
                    <td>
                      {mathRoundHelper(
                        flightPriceCalculation?.Price?.Handling
                      ) +
                        mathRoundHelper(
                          flightPriceCalculation?.MarkupOfCost?.Handling
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

export default LocalEscortFlightForm;
