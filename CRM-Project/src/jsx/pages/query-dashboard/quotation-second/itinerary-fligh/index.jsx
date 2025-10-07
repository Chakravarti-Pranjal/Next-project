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
import {
  setQoutationResponseData,
  setFightFinaldata,
} from "../../../../../store/actions/queryAction";
import {
  setItineraryCopyFlightFormData,
  setItineraryCopyFlightFormDataCheckbox,
} from "../../../../../store/actions/itineraryServiceCopyAction/itineraryServiceCopyAction";
import moment from "moment";
import IsDataLoading from "../IsDataLoading";
import mathRoundHelper from "../../helper-methods/math.round";
import DarkCustomTimePicker from "../../helper-methods/TimePicker";

const Flight = ({ Type, transportFormValue }) => {
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
  const [isDataLoading, setIsDataLoading] = useState(true);
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
  // state to markup value
  const [markupArray, setMarkupArray] = useState({
    Markup: { Data: [] },
  });
  // console.log(markupArray, "markupArray111");
  const AirlinesData = markupArray?.Markup?.Data?.find(
    (item) => item.Type === "Airlines"
  );
  // console.log(AirlinesData, "AirlinesData")

  const [isTrainDataSaved, setIsTrainDataSaved] = useState(false);

  // flight table form initial value
  useEffect(() => {
    // console.log(isTrainDataSaved, "isTrainDataSaved");
    if (isTrainDataSaved) return;
    if (qoutationData?.Days) {
      const hasTrainService = qoutationData?.Days.some((day) =>
        day?.DayServices?.some((service) => service.ServiceType === "Flight")
      );
      // console.log();

      if (hasTrainService) {
        const initialFormValue = qoutationData?.Days?.filter((day) => {
          const hasFlightTransport = transportFormValue?.some(
            (transport) =>
              transport?.DayNo === day?.Day &&
              transport?.Mode?.toLowerCase() === "flight"
          );
          return hasFlightTransport;
        })?.flatMap((day) => {
          // Map over all flight services in the day
          return (day?.DayServices ?? [])
            .filter(
              (service) => service?.ServiceType?.toLowerCase() === "flight"
            )
            .map((service) => {
              const detailsArray = Array.isArray(service?.ServiceDetails)
                ? service.ServiceDetails
                : [];
              const firstDetail = detailsArray?.[0] ?? {};
              const { ItemUnitCost, TimingDetails, ItemSupplierDetail } =
                firstDetail;

              const paxInfo = service?.PaxDetails?.PaxInfo ?? {};
              const foreignPax = service?.PaxDetails?.ForiegnerPaxInfo ?? {};

              return {
                id: queryData?.QueryId || "",
                QuatationNo: qoutationData?.QuotationNumber || "",
                DayType: Type || "",
                DayNo: day?.Day || "",
                Date: day?.Date || "",
                Destination: day?.DestinationId || "",
                DestinationUniqueId: day?.DestinationUniqueId || "",
                DayUniqueId: day?.DayUniqueId || "",
                ServiceId: service?.ServiceId || "",
                Escort: 1,
                GuideCharges: service?.GuideCharges || "",
                HandlingCharges: service?.HandlingCharges || "",
                ServiceCharges: service?.ServiceCharges || "",
                TypeName: service?.AirType || "", // Use AirType for flight type
                Type: service?.ServiceId || "1",
                Supplier: ItemSupplierDetail?.ItemSupplierId || "",
                DepartureTime: TimingDetails?.ItemFromTime || "",
                AdultCost: ItemUnitCost?.Adult || "",
                ChildCost: ItemUnitCost?.Child || "",
                InfantCost: ItemUnitCost?.Infant || "",
                ArrivalTime: TimingDetails?.ItemToTime || "",
                Remarks: TimingDetails?.Remark || "",
                FlightNumber: service?.FlightNumber || "",
                FlightClass: service?.FlightClassId || "",
                FromDestination: service?.FromDestinationId || "",
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
                  Escort: paxInfo?.Escort || "",
                },
                ForiegnerPaxInfo: {
                  Adults: foreignPax?.Adults || "",
                  Child: foreignPax?.Child || "",
                  Infant: foreignPax?.Infant || "",
                  Escort: foreignPax?.Escort || "",
                },
              };
            });
        });

        setFlightFormValue(initialFormValue);
        setFlightOriginalForm(initialFormValue);
      } else {
        // Render only days with Mode === "flight" in transportFormValue
        const flightInitialValue = transportFormValue
          ?.filter((transport) => transport?.Mode?.toLowerCase() === "flight")
          ?.map((transport) => {
            const day = qoutationData?.Days?.find(
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
              DayType: Type,
              Type: "1",
              PaxInfo: {
                Adults: qoutationData?.Pax?.AdultCount,
                Child: qoutationData?.Pax?.ChildCount,
                Infant: qoutationData?.Pax?.Infant,
                Escort: "",
              },
            };
          });
        setFlightFormValue(flightInitialValue);
        setFlightOriginalForm(flightInitialValue);
      }
    }
  }, [qoutationData, transportFormValue]);

  const postDataToServer = async (index) => {
    try {
      setIsDataLoading(true);
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
        setFlightTypeList(data?.Data);
        // console.log(data?.Data, "data?.Data");
      } catch (error) {
        console.log("flight-err", error);
      }

      try {
        const { data } = await axiosOther.post("destinationlist");
        setDestinationList(data?.DataList);
      } catch (error) {
        console.log("error", error);
      }
      // call api to Markup value
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
    } finally {
      setIsDataLoading(false);
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

  const getSupplierDependentOnDestination = async (
    destination,
    ToDestination,
    index,
    length
  ) => {
    const destinations = index == length - 1 ? ToDestination : destination;
    // console.log(destination, ToDestination, index, "destinations");

    try {
      const { data } = await axiosOther.post("supplierlist", {
        Name: "",
        id: "",
        SupplierService: [9],
        DestinationId: "",
      });
      // console.log(data?.DataList, "supplierlist");

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
      getSupplierDependentOnDestination(
        flight?.FromDestination,
        flight?.ToDestination,
        index,
        flightFormValue.length
      );
    });
  }, [
    flightFormValue?.map((flight) => flight?.FromDestination).join(","),
    flightFormValue?.map((flight) => flight?.ToDestination).join(","),
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

    const airlineTypeId = flightTypeList[0]?.Id || " ";
    // console.log(supplierId, "supplierId");

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
    const allDaysEmpty =
      Array.isArray(qoutationData?.Days) &&
      qoutationData.Days.every((day) => {
        if (!Array.isArray(day.DayServices)) return true;
        const guideServices = day.DayServices.filter(
          (service) =>
            service.ServiceType === "Flight" &&
            service?.ServiceMainType === "Guest"
        );
        return guideServices.length === 0;
      });
    // console.log("All days empty:",allDaysEmpty);

    if (!allDaysEmpty) return;

    flightFormValue?.forEach((_, index) => {
      setFirstValueIntoForm(index);
      // setIsMergeRate(false);
    });
  }, [
    flightClassList,
    supplierList,
    flightTypeList,
    flightList,
    fromToDestinationList,
    qoutationData.Days,
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
    // if (typeof setFirstValueIntoForm === "function") {
    //   setFirstValueIntoForm(indx);
    //   setIsMergeRate(false);
    // }

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

  // useEffect(() => {
  //   if (isMergeRate) {
  //     mergeFlightRateJson();
  //   }
  // },[rateList,flightFormValue?.map((train) => train?.DayUniqueId).join(",")]);

  const handleFlightChange = (ind, e) => {
    let { name, value } = e.target;

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

  const updatedJsonData = (filteredFinalForm) => {
    return filteredFinalForm?.map((item) => {
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
  };

  useEffect(() => {
    // Compute finalForm as in the original handleFinalSave
    const finalForm = flightFormValue?.map((form, index) => {
      return {
        ...form,
        Hike: hikePercent,
        Sector: fromToDestinationList[index],
        DayType: Type,
        TotalCosting: {
          ServiceAdultCost: flightPriceCalculation?.Price?.Adult,
          ServiceChildCost: flightPriceCalculation?.Price?.Child,
          AdultMarkupValue: Number(AirlinesData?.Value),
          ChildMarkupValue: Number(AirlinesData?.Value),
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

    // Filter to get filteredFinalForm
    const filteredFinalForm = finalForm?.filter(
      (form) => form?.ServiceId !== ""
    );

    // Compute updatedJsonData
    const updatedData = updatedJsonData(filteredFinalForm);

    // Dispatch to Redux

    dispatch(setFightFinaldata({ updatedData, flightPriceCalculation }));
  }, [
    flightFormValue,
    flightPriceCalculation,
    hikePercent,
    fromToDestinationList,
    Type,
    AirlinesData?.Value,
  ]);

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
          DayType: Type,
          TotalCosting: {
            ServiceAdultCost: flightPriceCalculation?.Price?.Adult,
            ServiceChildCost: flightPriceCalculation?.Price?.Child,
            AdultMarkupValue: Number(AirlinesData?.Value), // chnage markupvalue to dynamice
            ChildMarkupValue: Number(AirlinesData?.Value), // chnage markupvalue to dynamice
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

      const totalsCostingObject = finalForm?.reduce(
        (acc, item) => {
          acc.AdultCost += Number(item.AdultCost) || 0;
          acc.ChildCost += Number(item.ChildCost) || 0;
          acc.GuideCharges += Number(item.GuideCharges) || 0;
          acc.HandlingCharges += Number(item.HandlingCharges) || 0;
          acc.ServiceCharges += Number(item.ServiceCharges) || 0;
          return acc;
        },
        {
          AdultCost: 0,
          ChildCost: 0,
          GuideCharges: 0,
          HandlingCharges: 0,
          ServiceCharges: 0,
        }
      );

      // console.log(totalsCostingObject, "totalsCostingObject");

      const filteredFinalForm = finalForm?.filter(
        (form) => form?.ServiceId != ""
      );
      const updatedJsonData = filteredFinalForm?.map((item) => {
        const costing = item.TotalCosting || {};

        const roundedCosting = {
          ...costing,
          ServiceAdultCost: mathRoundHelper(totalsCostingObject.AdultCost),
          AdultMarkupValue: mathRoundHelper(
            totalsCostingObject.AdultMarkupValue
          ),
          AdultMarkupTotal: mathRoundHelper(costing.AdultMarkupTotal),
          TotalAdultServiceCost: mathRoundHelper(costing.TotalAdultServiceCost),

          ServiceChildCost: mathRoundHelper(totalsCostingObject.ChildCost),
          ChildMarkupValue: mathRoundHelper(costing.ChildMarkupValue),
          ChildMarkupTotal: mathRoundHelper(costing.ChildMarkupTotal),
          TotalChildServiceCost: mathRoundHelper(costing.TotalChildServiceCost),

          ServiceGuideCharges: mathRoundHelper(
            totalsCostingObject?.ServiceCharges
          ),
          GuideMarkupCharges: 0,
          GuideMarkupTotalCharges: 0,
          TotalServiceGuideCharges: 0,

          ServiceHandlingCharges: mathRoundHelper(
            totalsCostingObject?.HandlingCharges
          ),
          MarkupHandlingCharges: 0,
          TotalMarkupHandlingCharges: 0,
          TotalServiceHandlingCharges: 0,

          ServiceCharges: mathRoundHelper(totalsCostingObject?.ServiceCharges),
          MarkupServiceCharges: 0,
          TotalMarkupServiceCharges: 0,
          TotalServiceCost: 0,
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
        // notifySuccess("Services Added !");
        notifySuccess(data.message);
        setIsTrainDataSaved(true);
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

      setRateList(list);
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
    if (!apiDataLoad) return;
    getFlightRateApi();
  }, [apiDataLoad]);
  // console.log(apiDataLoad,"apiDataLoadcheck");

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

  const handleHikeChange = (e) => {
    const { value } = e.target;
    setHikePercent(value);

    const updatedData = flightOriginalForm?.map((item) => {
      return {
        ...item,
        Hike: value,
        AdultCost:
          item?.AdultCost && !isNaN(item?.AdultCost)
            ? Math.floor(
                parseFloat(item?.AdultCost) +
                  (parseFloat(item?.AdultCost) * value) / 100
              )
            : item?.AdultCost,
        ChildCost:
          item?.ChildCost && !isNaN(item?.ChildCost)
            ? Math.floor(
                parseFloat(item?.ChildCost) +
                  (parseFloat(item?.ChildCost) * value) / 100
              )
            : item?.ChildCost,
        GuideCharges:
          item?.GuideCharges && !isNaN(item?.GuideCharges)
            ? Math.floor(
                parseFloat(item?.GuideCharges) +
                  (parseFloat(item?.GuideCharges) * value) / 100
              )
            : item?.GuideCharges,
        ServiceCharges:
          item?.ServiceCharges && !isNaN(item?.ServiceCharges)
            ? Math.floor(
                parseFloat(item?.ServiceCharges) +
                  (parseFloat(item?.ServiceCharges) * value) / 100
              )
            : item?.ServiceCharges,
        HandlingCharges:
          item?.HandlingCharges && !isNaN(item?.HandlingCharges)
            ? Math.floor(
                parseFloat(item?.HandlingCharges) +
                  (parseFloat(item?.HandlingCharges) * value) / 100
              )
            : item?.HandlingCharges,
      };
    });
    setFlightFormValue(updatedData);
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
        Adult: (AdultPrice * Number(AirlinesData?.Value)) / 100 || 0, // chnage markupvalue to dynamice
        Child: (ChildPrice * Number(AirlinesData?.Value)) / 100 || 0, // chnage markupvalue to dynamice
        Service: (ServicePrice * Number(AirlinesData?.Value)) / 100 || 0, // chnage markupvalue to dynamice
        Handling: (HandlingPrice * Number(AirlinesData?.Value)) / 100 || 0, // chnage markupvalue to dynamice
        Guide: (GuidePrice * Number(AirlinesData?.Value)) / 100 || 0, // chnage markupvalue to dynamice
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
    AirlinesData?.Value, // chnage markupvalue to dynamice
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

  // ==============================================

  const flightCheckbox = useSelector(
    (state) => state.itineraryServiceCopyReducer.flightCheckbox
  );

  useEffect(() => {
    if (flightCheckbox) {
      dispatch(
        setItineraryCopyFlightFormData({
          FlightFormValue: flightFormValue,
        })
      );
    }
  }, [flightFormValue, flightCheckbox]);

  useEffect(() => {
    return () => {
      dispatch(
        setItineraryCopyFlightFormDataCheckbox({ local: true, foreigner: true })
      );
    };
  }, []);

  // console.log(flightFormValue, "flightFormValue452");

  return (
    <div className="row mt-3 m-0">
      <ToastContainer />
      <div
        className="col-12 px-1 py-2 d-flex justify-content-between itinerary-head-bg"
        onClick={handleIsOpen}
      >
        <div className="d-flex gap-4 align-items-center">
          <div className="d-flex gap-2">
            <img src={flightIcon} alt="flightIcon" />
            <label htmlFor="" className="fs-5">
              Flight
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
                onChange={(e) => setCopyChecked(e.target.checked)}
              />
              <label className="fontSize11px m-0 ms-1" htmlFor="copy-guide">
                Copy
              </label>
            </div>
          )}
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
                                <span
                                  onClick={() => handleTableIncrement(index)}
                                >
                                  <i className="la la-plus border cursor-pointer bg-success text-white rounded-pill fontSize10px padding1px"></i>
                                </span>
                                <span
                                  onClick={() => handleTableDecrement(index)}
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
                                {flightTypeList?.map((flight, index) => {
                                  return (
                                    <option key={index} value={flight?.Id}>
                                      {flight?.TypeName}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </td>
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
                              {/* <DarkCustomTimePicker
                                name="DepartureTime"
                                value={flightFormValue[index]?.DepartureTime}
                                onChange={(e) => handleFlightChange(index, e)}
                              />*/}
                              <input
                                type="text"
                                id=""
                                placeholder="00:00"
                                name="DepartureTime"
                                value={flightFormValue[index]?.DepartureTime}
                                onChange={(e) => handleFlightChange(index, e)}
                                className="formControl1"
                              />
                            </div>
                          </td>
                          <td>
                            <div>
                              {/* <DarkCustomTimePicker
                                name="ArrivalTime"
                                value={flightFormValue[index]?.ArrivalTime}
                                onChange={(e) => handleFlightChange(index, e)}
                              />*/}
                              <input
                                type="text"
                                id=""
                                placeholder="00:00"
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
                                min="0"
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
                                min="0"
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
                        colSpan={
                          Type == "Local" || Type == "Foreigner" ? 11 : 9
                        }
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
                        {mathRoundHelper(
                          flightPriceCalculation?.Price?.Service
                        )}
                      </td>
                      <td>
                        {mathRoundHelper(
                          flightPriceCalculation?.Price?.Handling
                        )}
                      </td>
                      <td></td>
                    </tr>
                    <tr className="costing-td">
                      <td>
                        Markup({AirlinesData?.Value}) {AirlinesData?.Markup}
                      </td>
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
                        {mathRoundHelper(
                          mathRoundHelper(
                            flightPriceCalculation?.Price?.Adult
                          ) +
                            mathRoundHelper(
                              flightPriceCalculation?.MarkupOfCost?.Adult
                            )
                        )}
                      </td>
                      <td>
                        {mathRoundHelper(
                          mathRoundHelper(
                            flightPriceCalculation?.Price?.Child
                          ) +
                            mathRoundHelper(
                              flightPriceCalculation?.MarkupOfCost?.Child
                            )
                        )}
                      </td>
                      <td>
                        {mathRoundHelper(
                          mathRoundHelper(
                            flightPriceCalculation?.Price?.Guide
                          ) +
                            mathRoundHelper(
                              flightPriceCalculation?.MarkupOfCost?.Guide
                            )
                        )}
                      </td>
                      <td>
                        {mathRoundHelper(
                          mathRoundHelper(
                            flightPriceCalculation?.Price?.Service
                          ) +
                            mathRoundHelper(
                              flightPriceCalculation?.MarkupOfCost?.Service
                            )
                        )}
                      </td>
                      <td>
                        {mathRoundHelper(
                          mathRoundHelper(
                            flightPriceCalculation?.Price?.Handling
                          ) +
                            mathRoundHelper(
                              flightPriceCalculation?.MarkupOfCost?.Handling
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

export default Flight;
