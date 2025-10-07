// 29-09-2025
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { ToastContainer } from "react-toastify";
import { axiosOther } from "../../../../../http/axios_base_url";
import { notifyError, notifySuccess } from "../../../../../helper/notify";
import activeCostSheet from "/assets/icons/activeIcons/Costsheet.svg";
import styles from "./index.module.css";
import { vehicleTypeInitialValue } from "../../../masters/masters_initial_value";
import { array } from "yup";
import { quotationData } from "../../qoutation-first/quotationdata";
import { useNavigate } from "react-router-dom";
import {
  foreignerRefreshKey,
  incrementMainPaxSlab,
  incrementMainPaxSlabForignerSlab,
  toggleMainPaxSlabForignerSlab,
} from "../../../../../store/actions/createExcortLocalForeignerAction";

// Custom debounce function
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// set Data which is coming from database
const setFormValueFromDB = (pax, index, activityAddtionalCost) => ({
  QueryId: pax?.QueryId,
  QuotationNumber: pax?.QuotationNumber,
  CompanyId: JSON.parse(localStorage.getItem("token"))?.companyKey,
  UserId: JSON.parse(localStorage.getItem("token"))?.UserID,
  PaxSlabId: pax?.PaxSlabId,
  Min: pax?.Min ?? 0,
  Max: pax?.Max ?? 0,
  DividingFactor: pax?.DividingFactor ?? 0,
  TransportType: pax?.TransportType || "",
  SupplimentTransferType: pax?.SupplimentTransferType || "",
  NoOfVehicle: pax?.NoOfVehicle ?? "",
  SupplimentNoOfVehicle: pax?.SupplimentNoOfVehicle ?? "",
  Transport: pax?.Transport ?? 0,
  Hotel: pax?.Hotel ?? 0,
  Meal: pax?.Meal ?? 0,
  Activity: activityAddtionalCost?.[index]?.activityCost ?? pax?.Activity ?? 0,
  Misc: activityAddtionalCost?.[index]?.additionalCost ?? pax?.Misc ?? 0,
  MFees: pax?.MFees ?? 0,
  Guide: pax?.Guide ?? 0,
  Train: pax?.Train ?? 0,
  ForeignerEscort: pax?.ForeignerEscort ? [pax.ForeignerEscort] : [],
  LocalEscort: pax?.LocalEscort,
  TopMargin: pax?.TopMargin ?? "",
  IGST: pax?.IGST ?? "",
  Air: pax?.Air ?? "",
  Nett: pax?.Nett?.toString() ?? "",
  Total: pax?.Total?.toString() ?? "0",
  Foc: pax?.Foc ?? 1,
  TotalInUSD: pax?.TotalInUSD,
  NoLocalEscort: pax?.NoLocalEscort,
});

const getLocalEscortTotal = (maxPax, min, localSlabData, divFact) => {
  if (!Array.isArray(localSlabData)) return 0;

  const exactMatch = localSlabData?.filter(
    (data) =>
      parseInt(data?.StartPax) == parseInt(min) &&
      parseInt(data?.EndPax) == parseInt(maxPax)
  );

  const rangeMatch = localSlabData?.filter(
    (item) => maxPax >= item.StartPax && maxPax <= item.EndPax
  );

  console.log(rangeMatch, "VCGDD8877");

  if (exactMatch?.length > 0) {
    const totalSum = exactMatch.reduce(
      (sum, item) => sum + Number(item.Total),
      0
    );
    const divisionFactor = divFact ? divFact : 1;
    return totalSum ? Math.ceil(totalSum / divisionFactor) : 0;
  }

  if (rangeMatch?.length > 0) {
    const totalSum = rangeMatch.reduce(
      (sum, item) => sum + Number(item.Total),
      0
    );
    const divisionFactor = divFact ? divFact : 1;
    return totalSum ? Math.ceil(totalSum / divisionFactor) : 0;
  }

  const found = localSlabData?.find(
    (item) => maxPax >= item.StartPax && maxPax <= item.EndPax
  );
  const divisionFactor = divFact ? divFact : 1;
  return found ? Math.ceil(found.Total / divisionFactor) : 0;
};

const getForeignEscortTotal = (maxPax, Min, ForeignSlabData, divFact) => {
  console.log(maxPax, ForeignSlabData, "maxPax,ForeignSlabData");

  if (!Array.isArray(ForeignSlabData)) return 0;
  const found = ForeignSlabData.find(
    (item) => Min == item.Min && maxPax == item.Max
  );
  console.log(ForeignSlabData, "ForeignSlabData");
  console.log(found, "found");

  const divisionFactor = divFact ? divFact : 1;
  return found ? Math.ceil(found.TotalPerPerson / divisionFactor) : 0;
};

const getGuideTotal = (maxPax, guidePerPaxCost, divFact) => {
  if (!Array.isArray(guidePerPaxCost)) return 0;
  const found = guidePerPaxCost.find(
    (item) => maxPax >= item.StartPax && maxPax <= item.EndPax
  );
  const divisionFactor = divFact ? divFact : 1;
  return found ? Math.ceil(found.ServiceTotalCost / divisionFactor) : 0;
};

const PaxSlab = ({ paxSlab }) => {
  const [qoutationData, setQoutationData] = useState([]);
  const { queryData, payloadQueryData } = useSelector(
    (state) => state?.queryReducer
  );
  const paxSlabType = useSelector((state) => state?.queryReducer.qoutationData);
  const loadSlabApi = useSelector(
    (state) => state?.activeTabOperationReducer.paxSlabApiLoad
  );
  const hotelprice = useSelector((state) => state?.priceReducer);
  const { PaxSlab, TourSummary } = qoutationData;
  const queryAndQuotationNo = JSON.parse(
    localStorage.getItem("Query_Qoutation")
  );

  console.log(qoutationData, "VDYWTGSS8777");

  const [excortSlabData, setExcortSlabData] = useState(undefined);
  const [localSlabData, setLocalSlabData] = useState(undefined);
  const [ForeignSlabData, setForeignSlabData] = useState(undefined);
  const [slabSingleFormValue, setSlabSingleFormValue] = useState([]);
  const [transportId, setTransportId] = useState([]);
  const [singleDividingFactor, setSingleDividingFactor] = useState([]);
  const [singleVehicleNo, setSingleVehicleNo] = useState([]);
  const [initialList, setInitialList] = useState([]);
  const [vehicleList, setVehicleList] = useState([]);
  const [listQueryQuotationData, setListQueryQuotationData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [costs, setCosts] = useState({
    hotelCost: 0,
    transport: [],
    restaurantCost: 0,
    activityCost: 0,
    monumentCost: 0,
    guideCost: 0,
    trainCost: 0,
    additionalCost: 0,
    fligthCost: 0,
    excortSlabData,
    localSlabData,
    ForeignSlabData,
    // Foreignslabdata,
  });
  const [markupInfo, setMarkupInfo] = useState([]);
  const [gstInfo, setGstInfo] = useState([]);
  const [guidePerPaxCost, setGuidePerPaxCost] = useState([]);
  const [activityAddtionalCost, setActivityAdditionalCost] = useState([]);
  const [isPaxSlabSaved, setIsPaxSlabSaved] = useState(false);
  const [clientCommision, setClientCommision] = useState(null);
  const [currencyValue, setCurrencyValue] = useState("");
  const [currencyType, setCurrencyType] = useState("");
  const dispatch = useDispatch();

  console.log(currencyValue, "COMSFS78777", currencyType);

  const navigate = useNavigate();
  console.log(localSlabData, ForeignSlabData, "ForeignSlabData");

  function calculateAssistanceSumAndCheckTransport(data) {
    let totalAssistance = 0;
    let transportFound = false;
    data?.forEach((day) => {
      if (day.DayServices && Array.isArray(day.DayServices)) {
        day.DayServices.forEach((service) => {
          if (service.ServiceType == "Transport") {
            transportFound = true;
            const assistanceValue = parseFloat(service.Assitance) || 0;
            totalAssistance += assistanceValue;
          }
        });
      }
    });
    return {
      totalAssistance: totalAssistance,
      transportFound: transportFound,
    };
  }

  const getDefaultFormValue = (pax, index, queryData, qoutationData, costs) => {
    console.log(costs, "costs", currencyValue);
    let airInUSD;
    if (currencyValue) {
      airInUSD = Math.ceil(costs?.fligthCost / currencyValue);
    }

    const dividingFactor = pax?.DividingFactor ?? 0;

    const maxPax = parseInt(pax?.Max) || 0;
    const foc =
      Array.isArray(excortSlabData) && excortSlabData[index]?.Foc != null
        ? parseInt(excortSlabData[index].Foc)
        : 0;

    const localEscortFoc = getLocalFocNumber(localSlabData, maxPax);
    const totoalPaxFoc = maxPax + foc + Number(localEscortFoc);

    let transportType = null;

    const getVehicleByCapacity = (vehicles, requiredCapacity) => {
      const sorted = vehicles
        .map((v) => ({ ...v, capacity: Number(v.capacity) }))
        .sort((a, b) => a.capacity - b.capacity);

      const exact = sorted.find((v) => v.capacity == requiredCapacity);
      if (exact) return exact;

      const higher = sorted.find((v) => v.capacity > requiredCapacity);
      return higher || null;
    };

    let vehicleListObject = getVehicleByCapacity(vehicleList, totoalPaxFoc);
    transportType = vehicleListObject?.value;

    let NoOfVehicle = "";
    if (transportType) {
      const selectedVehicle = vehicleList.find(
        (v) => String(v.value) == String(transportType)
      );
      NoOfVehicle = Math.ceil(
        (maxPax + foc) / (selectedVehicle?.capacity || 1)
      );
    }

    const transportCost =
      costs.transport.find((data) => Number(data.id) == Number(transportType))
        ?.TotalServiceCost || 0;

    const calculatedCost =
      dividingFactor > 0
        ? Math.ceil(
            (NoOfVehicle * (transportCost + assistance)) / dividingFactor
          )
        : 0;
    console.log(transportCost, "WRWRW8777");

    return {
      QueryId: queryData?.QueryAlphaNumId,
      QuotationNumber: qoutationData?.QuotationNumber,
      CompanyId: JSON.parse(localStorage.getItem("token"))?.companyKey,
      UserId: JSON.parse(localStorage.getItem("token"))?.UserID,
      PaxSlabId: pax?.id,
      Min: pax?.Min ?? 0,
      Max: pax?.Max ?? 0,
      DividingFactor: dividingFactor,
      TransportType: transportType,
      SupplimentTransferType: "",
      NoOfVehicle: NoOfVehicle,
      SupplimentNoOfVehicle: "",
      Transport: calculatedCost,
      Hotel: Math.ceil(costs.hotelCost),
      Meal: Math.ceil(costs.restaurantCost),
      Activity: Math.ceil(costs.activityCost),
      Misc: Math.ceil(costs.additionalCost),
      MFees: Math.ceil(costs.monumentCost),
      Guide: 0,
      Train: Math.ceil(costs.trainCost),
      ForeignerEscort: [],
      LocalEscort: "",
      TopMargin: "",
      IGST: "",
      Air: airInUSD || Math.ceil(costs.fligthCost || 0),
      Nett: "",
      Total: "0",
      Foc: foc,
      // ForeignerEscort:10,
    };
  };

  const calculateMargins = (slab) => {
    const typeMapping = {
      Transport: "Transport",
      Hotel: "Hotel",
      Meal: "Restaurant",
      Activity: "Activity",
      Misc: "Additional",
      MFees: "Monument",
      Guide: "Guide",
      Train: "Train",
      LocalEscort: "Local Escort",
      ForeignerEscort: "Foreign Escort",
    };

    let totalMargin = 0;

    Object.keys(typeMapping).forEach((field) => {
      const markup = markupInfo?.find(
        (item) => item.Type == typeMapping[field]
      );

      let rawValue;

      if (field == "LocalEscort") {
        rawValue = slab[field];
        console.log(rawValue, "WTSFFS");
      } else if (field == "ForeignerEscort") {
        rawValue = slab[field]?.[0]?.Total;
      } else {
        rawValue = slab[field];
      }

      const value = parseFloat(rawValue) || 0;

      if (markup && markup.Markup == "%") {
        const margin = (value * parseFloat(markup.Value)) / 100;
        totalMargin += margin;
      }
    });

    return Math.ceil(totalMargin);
  };

  const calculateNett = (slab, additionalSlabCost) => {
    // Removed unused additionalCost calculation
    console.log(slab, "VCGDGDGGDGDGDG", additionalSlabCost);
    return Math.ceil(
      [
        parseFloat(slab.Hotel) || 0,
        parseFloat(slab.Guide) || 0,
        parseFloat(slab.MFees) || 0,
        parseFloat(additionalSlabCost) || 0,
        parseFloat(slab.Meal) || 0,
        parseFloat(slab.Activity) || 0,
        parseFloat(slab.Transport) || 0,
        parseFloat(slab.Train),
        parseFloat(slab.LocalEscort) || 0,
        parseFloat(slab.ForeignerEscort?.[0]?.Total) || 0,
      ].reduce((a, b) => a + b, 0)
    );
  };

  const getLocalFocNumber = (localSlab, maxPax) => {
    console.log(localSlabData, "matchSlab", paxSlab);
    const matchSlab = localSlab?.find(
      (slab) => maxPax >= Number(slab.StartPax) && maxPax <= Number(slab.EndPax)
    );
    console.log(matchSlab, "DGATTS", maxPax);

    return matchSlab?.Foc || 0;
  };

  const onNext = () => {
    navigate("/query/costsheet-list");
  };

  const getActivityAdditionalDataFromApi = async (list, index) => {
    try {
      const { data } = await axiosOther.post("activitycalculation", {
        QueryId: queryAndQuotationNo?.QueryID,
        QuotationNumber: queryAndQuotationNo?.QoutationNum,
        MaxPax: list?.Max,
        DivisionFactor: list?.DividingFactor,
      });

      if (data?.Status == 1) {
        setActivityAdditionalCost((prev) => {
          const newCosts = [...prev];
          newCosts[index] = {
            activityCost: Math.ceil(data?.finalActivityAmount),
            additionalCost: Math.ceil(data?.finalAdditionalAmount),
          };
          return newCosts;
        });

        setSlabSingleFormValue((prev) =>
          prev.map((item, idx) =>
            idx == index
              ? {
                  ...item,
                  Activity: Math.ceil(data?.finalActivityAmount),
                  Misc: Math.ceil(data?.finalAdditionalAmount),
                }
              : item
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Debounced version of getActivityAdditionalDataFromApi
  const debouncedGetActivityAdditionalData = useCallback(
    debounce((list, index) => {
      getActivityAdditionalDataFromApi(list, index);
    }, 500),
    [queryAndQuotationNo]
  );
  console.log(ForeignSlabData, "ForeignSlabData");

  // Initialize slabSingleFormValue only when initialList or qoutationData changes
  useEffect(() => {
    console.log(qoutationData?.PaxSlab, "BCVCHDJJD8777");
    if (qoutationData?.PaxSlab?.length > 0) {
      console.log("VCHDG9888");
      const initialFormValue = qoutationData?.PaxSlab?.map((pax, index) => {
        const formValue = setFormValueFromDB(pax, index, activityAddtionalCost);
        const transportCost =
          costs.transport.find((data) => data.id == formValue.TransportType)
            ?.TotalServiceCost || 0;
        const supplimentTransportCost =
          costs.transport.find(
            (data) => data.id == formValue.SupplimentTransferType
          )?.TotalServiceCost || 0;
        const noVehicles = parseInt(formValue.NoOfVehicle) || 0;
        const noSuppliment = parseInt(formValue.SupplimentNoOfVehicle) || 0;
        const calculatedCost =
          formValue.DividingFactor > 0
            ? Math.ceil(
                (noVehicles * (transportCost + assistance) +
                  noSuppliment * (supplimentTransportCost + assistance)) /
                  formValue.DividingFactor
              )
            : 0;
        const nettValue = calculateNett(formValue, calculatedCost);
        const topMargin = Math.ceil(calculateMargins(formValue));
        return {
          ...formValue,
          Transport: Math.ceil(formValue.Transport),
          Hotel: Math.ceil(formValue.Hotel),
          Meal: Math.ceil(formValue.Meal),
          Activity: Math.ceil(formValue.Activity),
          Misc: Math.ceil(formValue.Misc),
          MFees: Math.ceil(formValue.MFees),
          Guide: Math.ceil(formValue.Guide),
          Train: Math.ceil(formValue.Train),
          LocalEscort: Math.ceil(formValue.LocalEscort),
          ForeignerEscort: [{ Total: Math.ceil(formValue.ForeignerEscort) }],
          TopMargin: topMargin,
          Nett: nettValue,
          IGST: Math.ceil(
            (nettValue + topMargin) * (gstInfo?.GstValue / 100) || 0
          ),
          Air: Math.ceil(formValue.Air || 0),
          TotalInUSD: Math.ceil(formValue?.TotalInUSD || 0),
        };
      });
      setSlabSingleFormValue(initialFormValue);
      setIsPaxSlabSaved(true);
    } else if (initialList?.length > 0) {
      console.log(qoutationData, "VCHDHGDGDGGDGD");
      const initialFormValue = initialList.map((pax, index) => {
        const formValue = getDefaultFormValue(
          pax,
          index,
          queryData,
          qoutationData,
          costs
        );
        const transportCost =
          costs.transport.find((data) => data.id == formValue.TransportType)
            ?.TotalServiceCost || 0;
        const supplimentTransportCost =
          costs.transport.find(
            (data) => data.id == formValue.SupplimentTransferType
          )?.TotalServiceCost || 0;
        const noVehicles = parseInt(formValue.NoOfVehicle) || 0;
        const noSuppliment = parseInt(formValue.SupplimentNoOfVehicle) || 0;
        const calculatedCost =
          formValue.DividingFactor > 0
            ? Math.ceil(
                (noVehicles * (transportCost + assistance) +
                  noSuppliment * (supplimentTransportCost + assistance)) /
                  formValue.DividingFactor
              )
            : 0;
        const guideTotal = getGuideTotal(
          parseInt(formValue.Max) || 0,
          guidePerPaxCost,
          formValue.DividingFactor
        );
        const localEscortTotal = getLocalEscortTotal(
          parseInt(formValue.Max) || 0,
          parseInt(formValue.Min) || 0,
          localSlabData,
          formValue.DividingFactor
        );
        const ForeignEscortTotal = getForeignEscortTotal(
          parseInt(formValue.Max) || 0,
          parseInt(formValue.Min) || 0,
          ForeignSlabData,
          formValue.DividingFactor
        );

        console.log(ForeignEscortTotal, "ForeignEscortTotal");
        const nettValue = calculateNett({
          ...formValue,
          Guide: guideTotal,
          LocalEscort: localEscortTotal,
        });
        console.log(localEscortTotal, "localSlabData");

        const topMargin = Math.ceil(
          calculateMargins({
            ...formValue,
            Guide: guideTotal,
            LocalEscort: localEscortTotal,
          })
        );

        const localEscortFoc = getLocalFocNumber(localSlabData, pax?.Max);

        return {
          ...formValue,
          Activity: Math.ceil(
            activityAddtionalCost?.[index]?.activityCost ?? formValue.Activity
          ),
          Misc: Math.ceil(
            activityAddtionalCost?.[index]?.additionalCost ?? formValue.Misc
          ),
          Guide: Math.ceil(guideTotal),
          LocalEscort: localEscortTotal,
          ForeignerEscort: [{ Total: ForeignEscortTotal }],
          TopMargin: topMargin,
          Nett: nettValue,
          IGST: Math.ceil(
            (nettValue + topMargin) * (gstInfo?.GstValue / 100) || 0
          ),
          Air: Math.ceil(formValue.Air || 0),
          CurrencyName: qoutationData?.CurrencyName,
          ConversionValue: qoutationData?.ConversionValue,
          NoLocalEscort: localEscortFoc,
          // ForeignerEscort:10,
        };
      });
      console.log(initialFormValue, "initialFormValue");

      setSlabSingleFormValue(initialFormValue);
      setSingleDividingFactor([
        {
          factorInd: 0,
          factor: initialList[0]?.DividingFactor || 1,
          transType: payloadQueryData?.Prefrences?.VehiclePreference || "",
        },
      ]);
      setTransportId([
        {
          id: payloadQueryData?.Prefrences?.VehiclePreference || "",
          transIndex: 0,
        },
      ]);
      setSingleVehicleNo([{ value: "", index: 0 }]);
      setIsPaxSlabSaved(false);
    }
  }, [
    initialList,
    qoutationData,
    costs,
    markupInfo,
    excortSlabData,
    localSlabData,
    ForeignSlabData,
    gstInfo,
    guidePerPaxCost,
  ]);

  const [assistance, setAssistance] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [paxResponse, vehicleResponse, quotationResponse] =
          await Promise.all([
            axiosOther.post("paxslablist", {
              Type: paxSlabType?.TourSummary?.PaxTypeName,
              Default: "Yes",
            }),
            axiosOther.post("vehicletypemasterlist"),
            axiosOther.post("listqueryquotation", {
              QueryId: queryAndQuotationNo?.QueryID,
              QuotationNo: queryAndQuotationNo?.QoutationNum,
            }),
          ]);
        setQoutationData(quotationResponse.data?.data[0]);
        const assistance = calculateAssistanceSumAndCheckTransport(
          quotationResponse.data?.data[0]?.Days
        );
        setAssistance(assistance?.totalAssistance);
        if (quotationResponse.data?.data[0]?.ExcortDays) {
          setExcortSlabData(
            quotationResponse.data?.data[0].ExcortDays[1]?.ExcortSlabCost
          );
          setLocalSlabData(
            quotationResponse.data?.data[0].ExcortDays[0]?.FeeCharges
          );
          setForeignSlabData(
            quotationResponse.data?.data[0].ExcortDays[1]?.ExcortSlabCost
          );

          console.log(quotationResponse.data?.data[0], "localSlabData");
        }
        if (quotationResponse.data?.data[0]?.Markup?.Markup?.Data.length > 0) {
          setMarkupInfo(quotationResponse?.data?.data[0]?.Markup?.Markup?.Data);
          setClientCommision(
            quotationResponse?.data?.data[0]?.SupplimentSelection
              ?.ClientCommision
          );
        }
        if (quotationResponse.data?.data[0]?.OthersInfo) {
          console.log(quotationResponse.data?.data[0], "QYSTSTS9887");
          setGstInfo(quotationResponse.data?.data[0]?.OthersInfo);
          setCurrencyValue(quotationResponse.data?.data[0]?.ConversionValue);
          setCurrencyType(quotationResponse.data?.data[0]?.CurrencyName);
        }
        setInitialList(paxResponse.data?.DataList);

        if (paxResponse.data?.DataList?.length > 0) {
          setActivityAdditionalCost(
            new Array(paxResponse.data.DataList.length).fill({})
          );
          if (!isPaxSlabSaved) {
            paxResponse.data?.DataList.forEach((list, idx) => {
              getActivityAdditionalDataFromApi(list, idx);
            });
          }
        }

        if (quotationResponse.data?.data[0]?.Days[0]?.DayServices.length > 0) {
          const services =
            quotationResponse.data?.data[0]?.Days[0]?.DayServices;
          const guidePerPax = services?.find(
            (service) => service.ServiceType == "Guide"
          );

          if (guidePerPax?.Suppliment == "No" && guidePerPax?.TotalCosting) {
            console.log(guidePerPax, "guidePerPax");
            setGuidePerPaxCost(guidePerPax?.TotalCosting);
          } else {
            setGuidePerPaxCost([]);
          }
        } else {
          setGuidePerPaxCost([]);
        }
        setVehicleList(
          vehicleResponse.data?.DataList.map((item) => ({
            value: item?.id,
            label: item?.Name,
            capacity: item?.PaxCapacity,
          }))
        );
        setListQueryQuotationData(quotationResponse.data?.data[0]?.Days);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [loadSlabApi, isPaxSlabSaved]);

  useEffect(() => {
    if (listQueryQuotationData.length) {
      const calculateServiceCosts = () => {
        const services = listQueryQuotationData[0]?.DayServices;
        const getService = (type) =>
          services?.find((service) => service.ServiceType == type);

        const hotel = getService("Hotel");
        const transport = getService("Transport");
        const restaurant = getService("Restaurant");
        const monument = getService("Monument");

        const train = listQueryQuotationData
          .flatMap((day) => day.DayServices)
          .filter((service) => service.ServiceType == "Train");
        const flight = listQueryQuotationData
          .flatMap((day) => day.DayServices)
          .filter((service) => service.ServiceType == "Flight");
        const activity = listQueryQuotationData
          .flatMap((day) => day.DayServices)
          .filter((service) => service.ServiceType == "Activity");

        const totalActivityCostSum = activity.reduce((sum, item) => {
          return sum + (parseFloat(item.TotalCosting?.ActivityCost) || 0);
        }, 0);

        console.log(train, "VCBH987");

        const trainTotalCost = (trainData) => {
          if (!Array.isArray(trainData)) return 0;

          return trainData.reduce((grandTotal, service) => {
            const {
              ServiceCharges = 0,
              HandlingCharges = 0,
              GuideCharges = 0,
            } = service;

            const unitCost = service.ServiceDetails?.[0]?.ItemUnitCost || {};

            const adultCost = Number(unitCost.Adult) || 0;
            const childCost = Number(unitCost.Child) || 0;

            const total =
              adultCost +
              childCost +
              ServiceCharges +
              HandlingCharges +
              GuideCharges;

            return grandTotal + total;
          }, 0);
        };

        console.log(trainTotalCost(train), "GFBVDH877");

        function calculateFlightTotalCost(services) {
          let total = 0;
          services.forEach((service) => {
            const detail = service.ServiceDetails?.[0];
            const adultCost = parseFloat(detail?.ItemUnitCost?.Adult || 0);
            const childCost = parseFloat(detail?.ItemUnitCost?.Child || 0);
            const guideCharges = parseFloat(service.GuideCharges || 0);
            const handlingCharges = parseFloat(service.HandlingCharges || 0);
            const serviceCharges = parseFloat(service.ServiceCharges || 0);
            total +=
              adultCost +
              childCost +
              guideCharges +
              handlingCharges +
              serviceCharges;
          });
          return Math.ceil(total);
        }

        const sumAdditionalCost = listQueryQuotationData.reduce(
          (sum, day) =>
            sum +
            day.DayServices.reduce(
              (daySum, service) =>
                daySum +
                (service.ServiceType == "Additional" &&
                service.TotalCosting?.TotalAdditionalCost
                  ? parseFloat(service.TotalCosting.TotalAdditionalCost)
                  : 0),
              0
            ),
          0
        );

        function calculateRestaurantServiceCost(data) {
          let totalServiceCost = 0;

          data.forEach((day) => {
            day.DayServices.forEach((service) => {
              if (service.ServiceType == "Restaurant") {
                console.log(service, "Restaurant Service");

                if (service.MealPlan?.length > 0) {
                  service.MealPlan.forEach((cost) => {
                    if (cost?.Supplement == "No") {
                      console.log(cost, "Cost Data");
                      totalServiceCost += parseFloat(cost.Amount) || 0;
                    }
                  });
                } else {
                  totalServiceCost += 0; // redundant but kept, since you had it
                }
              }
            });
          });

          console.log("Total Service Cost:", totalServiceCost);

          return Math.ceil(totalServiceCost);
        }

        setCosts((prev) => ({
          ...prev,
          hotelCost: Math.ceil(
            hotel?.TotalCosting?.[0]?.HotelRoomBedType?.[0]?.ServiceCost / 2 ||
              0
          ),
          transport:
            transport?.TotalCosting[0]?.TotalVehicle?.map((trans) => ({
              id: trans?.VehicleType,
              TotalServiceCost: Math.ceil(trans?.TotalServiceCost),
            })) || [],
          restaurantCost: Math.ceil(
            calculateRestaurantServiceCost(listQueryQuotationData) || 0
          ),
          activityCost: Math.ceil(totalActivityCostSum / 2),
          monumentCost: Math.ceil(
            monument?.TotalCosting?.TotalAdultServiceCost || 0
          ),
          trainCost: Math.ceil(trainTotalCost(train)),
          additionalCost: Math.ceil(sumAdditionalCost),
          fligthCost: calculateFlightTotalCost(flight) || 0,
        }));
      };
      calculateServiceCosts();
    }
  }, [listQueryQuotationData]);

  const handleFormChange = (e, index) => {
    const { name, value } = e.target;
    setSlabSingleFormValue((prev) =>
      prev.map((item, idx) => {
        if (idx == index) {
          let updatedItem = { ...item };

          if (
            name == "Min" ||
            name == "Max" ||
            name == "DividingFactor" ||
            name == "Foc" ||
            name == "NoLocalEscort"
          ) {
            const newMinPax = name == "Min" ? Number(value) : Number(item.Min);
            const newMaxPax = name == "Max" ? Number(value) : Number(item.Max);
            const newDivFact =
              name == "DividingFactor"
                ? Number(value)
                : Number(item.DividingFactor);
            const escortTotal = getLocalEscortTotal(
              newMaxPax,
              newMinPax,
              localSlabData,
              newDivFact
            );
            const forgineEscortCost = getForeignEscortTotal(
              newMaxPax,
              newMinPax,
              ForeignSlabData,
              newDivFact
            );

            const guideTotal = getGuideTotal(
              newMaxPax,
              guidePerPaxCost,
              newDivFact
            );
            let transportType = null;
            const newFoc = name == "Foc" ? Number(value) : Number(item.Foc);

            // get local escort foc
            const localEscortFoc =
              name == "NoLocalEscort"
                ? value
                : Number(getLocalFocNumber(localSlabData, newMaxPax));

            const totalPaxFoc = newMaxPax + newFoc + Number(localEscortFoc);

            console.log(totalPaxFoc, "dggdgd36363", localEscortFoc);

            // Get vehicle by capacity
            const getVehicleByCapacity = (vehicles, requiredCapacity) => {
              const sorted = vehicles
                .map((v) => ({ ...v, capacity: Number(v.capacity) }))
                .sort((a, b) => a.capacity - b.capacity);
              const exact = sorted.find((v) => v.capacity == requiredCapacity);
              if (exact) return exact;
              const higher = sorted.find((v) => v.capacity > requiredCapacity);
              return higher || null;
            };

            const vehicleListObject = getVehicleByCapacity(
              vehicleList,
              totalPaxFoc
            );
            transportType = vehicleListObject?.value || "";

            let noOfVehicle = "";
            if (transportType) {
              const selectedVehicle = vehicleList.find(
                (v) => String(v.value) == String(transportType)
              );
              noOfVehicle = Math.ceil(
                totalPaxFoc / (selectedVehicle?.capacity || 1)
              );
            }

            const transportCost =
              costs.transport.find((data) => data.id == transportType)
                ?.TotalServiceCost || 0;
            const supplimentTransportCost =
              costs.transport.find(
                (data) => data.id == updatedItem.SupplimentTransferType
              )?.TotalServiceCost || 0;
            const noVehicles = parseInt(noOfVehicle) || 0;
            const noSuppliment =
              parseInt(updatedItem.SupplimentNoOfVehicle) || 0;
            const calculatedCost =
              newDivFact > 0
                ? Math.ceil(
                    (noVehicles * (transportCost + assistance) +
                      noSuppliment * (supplimentTransportCost + assistance)) /
                      newDivFact
                  )
                : 0;
            console.log(transportCost, "WRWRW8777");

            updatedItem = {
              ...updatedItem,
              [name]: value,
              Guide: guideTotal,
              LocalEscort: escortTotal,
              TransportType: transportType,
              NoOfVehicle: noOfVehicle,
              Transport: calculatedCost,
              ForeignerEscort: [{ Total: forgineEscortCost }],
              NoLocalEscort: localEscortFoc,
            };

            debouncedGetActivityAdditionalData(
              { Max: newMaxPax, DividingFactor: newDivFact },
              index
            );
          } else if (name == "LocalEscort") {
            updatedItem = {
              ...updatedItem,
              LocalEscort: Math.ceil(parseFloat(value)) || 0,
            };
          } else if (name == "ForeignerEscort") {
            updatedItem = {
              ...updatedItem,
              ForeignerEscort: [{ Total: Math.ceil(parseFloat(value) || 0) }],
            };
          } else if (name == "Transport") {
            updatedItem = {
              ...updatedItem,
              Transport: Math.ceil(parseFloat(value) || 0),
            };
          } else if (name == "Activity") {
            updatedItem = {
              ...updatedItem,
              Activity: Math.ceil(parseFloat(value) || 0),
            };
            setActivityAdditionalCost((prev) =>
              prev.map((cost, i) =>
                i == index
                  ? { ...cost, activityCost: Math.ceil(parseFloat(value) || 0) }
                  : cost
              )
            );
          } else if (name == "Misc") {
            updatedItem = {
              ...updatedItem,
              Misc: Math.ceil(parseFloat(value) || 0),
            };
            setActivityAdditionalCost((prev) =>
              prev.map((cost, i) =>
                i == index
                  ? {
                      ...cost,
                      additionalCost: Math.ceil(parseFloat(value) || 0),
                    }
                  : cost
              )
            );
          } else if (
            ["Hotel", "Meal", "MFees", "Train", "Air"].includes(name)
          ) {
            updatedItem = {
              ...updatedItem,
              [name]: parseFloat(value) || 0,
            };
          } else {
            updatedItem = { ...item, [name]: value };
          }

          if (name == "TransportType" || name == "Max") {
            const selectedVehicleId =
              name == "TransportType" ? value : updatedItem.TransportType;
            if (!selectedVehicleId) {
              updatedItem.NoOfVehicle = "";
            } else {
              const maxPax = parseInt(updatedItem.Max) || 0;
              const foc =
                Array.isArray(excortSlabData) &&
                excortSlabData[index]?.Foc != null
                  ? parseInt(excortSlabData[index].Foc)
                  : 0;
              const selectedVehicle = vehicleList.find(
                (v) => String(v.value) == String(selectedVehicleId)
              );
              updatedItem.NoOfVehicle = Math.ceil(
                (maxPax + foc) / (selectedVehicle?.capacity || 1)
              );
            }
          }

          if (name == "SupplimentTransferType" || name == "Max") {
            const selectedSupplimentVehicleId =
              name == "SupplimentTransferType"
                ? value
                : updatedItem.SupplimentTransferType;
            if (!selectedSupplimentVehicleId) {
              updatedItem.SupplimentNoOfVehicle = "";
            } else {
              const maxPax = parseInt(updatedItem.Max) || 0;
              const foc =
                Array.isArray(excortSlabData) &&
                excortSlabData[index]?.Foc != null
                  ? parseInt(excortSlabData[index].Foc)
                  : 0;
              const supplimentVehicle = vehicleList.find(
                (v) => String(v.value) == String(selectedSupplimentVehicleId)
              );
              updatedItem.SupplimentNoOfVehicle = Math.ceil(
                (maxPax + foc) / (supplimentVehicle?.capacity || 1)
              );
            }
          }

          const transportCost =
            costs.transport.find((data) => data.id == updatedItem.TransportType)
              ?.TotalServiceCost || 0;
          const supplimentTransportCost =
            costs.transport.find(
              (data) => data.id == updatedItem.SupplimentTransferType
            )?.TotalServiceCost || 0;
          const noVehicles = parseInt(updatedItem.NoOfVehicle) || 0;
          const noSuppliment = parseInt(updatedItem.SupplimentNoOfVehicle) || 0;
          const calculatedCost =
            updatedItem.DividingFactor > 0
              ? Math.ceil(
                  (noVehicles * (transportCost + assistance) +
                    noSuppliment * (supplimentTransportCost + assistance)) /
                    updatedItem.DividingFactor
                )
              : 0;

          if (
            [
              "TransportType",
              "NoOfVehicle",
              "SupplimentTransferType",
              "SupplimentNoOfVehicle",
              "DividingFactor",
            ].includes(name)
          ) {
            updatedItem.Transport = calculatedCost;
          }

          const nettValue = calculateNett(updatedItem, calculatedCost);
          const totalMargin = calculateMargins(updatedItem);

          return {
            ...updatedItem,
            Nett: nettValue,
            IGST: Math.ceil(
              (nettValue + totalMargin) * (gstInfo?.GstValue / 100) || 0
            ),
            TopMargin: totalMargin,
          };
        }
        return item;
      })
    );

    if (name == "TransportType") {
      setTransportId((prev) =>
        prev.map((item, idx) =>
          idx == index ? { id: value, transIndex: index } : item
        )
      );
    }
    if (name == "NoOfVehicle") {
      setSingleVehicleNo((prev) =>
        prev.map((item, idx) => (idx == index ? { value, index } : item))
      );
    }
  };

  const handleIncrementTable = (index) => {
    const currentSlab = slabSingleFormValue[index];
    const transportCost =
      costs.transport.find((data) => data.id == currentSlab.TransportType)
        ?.TotalServiceCost || 0;
    const supplimentTransportCost =
      costs.transport.find(
        (data) => data.id == currentSlab.SupplimentTransferType
      )?.TotalServiceCost || 0;
    const noVehicles = parseInt(currentSlab.NoOfVehicle) || 0;
    const noSuppliment = parseInt(currentSlab.SupplimentNoOfVehicle) || 0;
    const calculatedTransport =
      currentSlab.DividingFactor > 0
        ? Math.ceil(
            (noVehicles * (transportCost + assistance) +
              noSuppliment * (supplimentTransportCost + assistance)) /
              currentSlab.DividingFactor
          )
        : 0;

    const newItem = {
      ...currentSlab,
      PaxSlabId: "",
      Transport: calculatedTransport,
    };
    setSlabSingleFormValue((prev) => [
      ...prev.slice(0, index + 1),
      newItem,
      ...prev.slice(index + 1),
    ]);

    setSingleDividingFactor((prev) => [
      ...prev,
      {
        factorInd: prev.length,
        factor: parseInt(currentSlab?.DividingFactor || 1),
        transType: currentSlab?.TransportType,
      },
    ]);

    setSingleVehicleNo((prev) => [...prev, { value: "", index: prev.length }]);
    setActivityAdditionalCost((prev) => [
      ...prev.slice(0, index + 1),
      {},
      ...prev.slice(index + 1),
    ]);

    // Call API for the new row
    const newIndex = index + 1;
    debouncedGetActivityAdditionalData(
      {
        Max: parseInt(newItem.Max) || 0,
        DividingFactor: parseInt(newItem.DividingFactor) || 1,
      },
      newIndex
    );
  };

  const handleDecrementTable = (index) => {
    if (slabSingleFormValue.length > 1) {
      setSlabSingleFormValue((prev) => prev.filter((_, idx) => idx !== index));
      setSingleDividingFactor((prev) => prev.filter((_, idx) => idx !== index));
      setSingleVehicleNo((prev) => prev.filter((_, idx) => idx !== index));
      setActivityAdditionalCost((prev) =>
        prev.filter((_, idx) => idx !== index)
      );
    }
  };

  const handleSubmit = async () => {
    const singleSlabPayload = slabSingleFormValue.map((row, idx) => {
      const transportCost =
        costs.transport.find((data) => data.id == row.TransportType)
          ?.TotalServiceCost || 0;
      const supplimentTransportCost =
        costs.transport.find((data) => data.id == row.SupplimentTransferType)
          ?.TotalServiceCost || 0;
      const noVehicles = parseInt(row.NoOfVehicle) || 0;
      const noSuppliment = parseInt(row.SupplimentNoOfVehicle) || 0;
      const calculatedTransportCost =
        row.DividingFactor > 0
          ? Math.ceil(
              (noVehicles * (transportCost + assistance) +
                noSuppliment * (supplimentTransportCost + assistance)) /
                row.DividingFactor
            )
          : 0;

      const nettValue = calculateNett(row, row.Misc);

      const totalMargin = Math.ceil(calculateMargins(row));
      const totalGst = Math.ceil(
        (nettValue + totalMargin) * (gstInfo?.GstValue / 100) || 0
      );
      const totalValue = Math.ceil(nettValue + totalMargin + totalGst);

      let commissionBase = 0;
      let commissionValue = 0;
      if (clientCommision) {
        commissionBase = Math.ceil(
          totalValue / ((100 - clientCommision) / 100)
        );
        commissionValue = Math.ceil(commissionBase * (clientCommision / 100));
      }

      const finalTotal = Math.ceil(totalValue + commissionValue);
      const totalUSD = Math.ceil(finalTotal / (row?.ConversionValue || 1));

      return {
        QueryId: row.QueryId ?? "",
        QuotationNumber: row.QuotationNumber ?? "",
        CompanyId: row.CompanyId ?? "",
        UserId: row.UserId ?? "",
        PaxSlabId: row.PaxSlabId ?? "",
        Min: row.Min ?? "",
        Max: row.Max ?? "",
        DividingFactor: row.DividingFactor ?? "",
        Foc: row.Foc ?? "",
        TransportType: row.TransportType ?? "",
        TransportTypeName:
          vehicleList.find((v) => String(v.value) == String(row.TransportType))
            ?.label ?? "",
        SupplimentTransferType: row.SupplimentTransferType ?? "",
        SupplimentTransferTypeName:
          vehicleList.find(
            (v) => String(v.value) == String(row.SupplimentTransferType)
          )?.label ?? "",
        NoOfVehicle: row.NoOfVehicle ?? "",
        SupplimentNoOfVehicle: row.SupplimentNoOfVehicle ?? "",
        Transport: Math.ceil(row.Transport ?? calculatedTransportCost),
        Hotel: Math.ceil(row.Hotel ?? 0),
        Meal: Math.ceil(row.Meal ?? 0),
        Activity: Math.ceil(row.Activity ?? 0),
        Misc: Math.ceil(row.Misc ?? 0),
        MFees: Math.ceil(row.MFees ?? 0),
        Guide: Math.ceil(row.Guide ?? 0),
        LocalEscort: Math.ceil(row.LocalEscort ?? 0),
        ForeignerEscort: Math.ceil(row.ForeignerEscort?.[0]?.Total ?? 0),
        Nett: nettValue,
        TopMargin: totalMargin,
        IGST: totalGst,
        Train: Math.ceil(row.Train ?? 0),
        Total: finalTotal,
        Commission: commissionValue,
        Air: Math.ceil(row.Air ?? 0),
        TotalInUSD: totalUSD,
        NoLocalEscort: row?.NoLocalEscort ?? 0,
      };
    });

    console.log(singleSlabPayload, "singleSlabPayload25");

    try {
      const { data } = await axiosOther.post(
        "store-paxSlabData",
        singleSlabPayload
      );
      if (data?.status == 1 || data?.Status == 1) {
        notifySuccess(data?.message || data?.Message);
        setIsPaxSlabSaved(true);
        // dispatch(toggleMainPaxSlabForignerSlab(2));
        // dispatch(incrementMainPaxSlabForignerSlab(4));
        // dispatch(incrementMainPaxSlab(singleSlabPayload));
        dispatch(foreignerRefreshKey());
      }
    } catch (error) {
      const errors =
        error.response?.data?.Errors || error.response?.data?.errors;
      if (errors) {
        notifyError(Object.values(errors)[0]);
      } else if (error.response?.data) {
        notifyError(Object.values(error.response.data)[0]);
      }
    }
  };

  const openPopup = async (index) => {
    const paxDetails = slabSingleFormValue[index]; // Use slabSingleFormValue instead of initialList
    const loader = document.createElement("div");
    Object.assign(loader.style, {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    });

    loader.innerHTML = `
      <div class="text-center">
        <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    `;

    document.body.appendChild(loader);

    try {
      const response = await axiosOther.post("costsheet-template", {
        QueryId: queryData?.QueryID ?? queryData?.QueryAlphaNumId,
        QuotationNumber: qoutationData?.QuotationNumber,
        TemplateType: "FIT-Costsheet",
        Min: paxDetails?.Min,
        Max: paxDetails?.Max,
      });
      if (response.status !== 200) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const templateUrl = response.data?.TemplateUrl;
      const templateSlab = response.data?.Slab;
      if (!templateUrl) {
        document.body.removeChild(loader);
        throw new Error("Template URL not received from API.");
      }

      const popupDiv = document.createElement("div");
      popupDiv.classList.add("popupWrapperForTheame");

      Object.assign(popupDiv.style, {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "90%",
        height: "95vh",
        backgroundColor: "white",
        borderRadius: "2rem",
        zIndex: 1000,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "1rem",
        paddingBottom: 0,
      });

      const iframe = document.createElement("iframe");
      Object.assign(iframe.style, {
        width: "100%",
        height: "93%",
        border: "none",
        backgroundColor: "white",
      });
      iframe.onload = () => {
        document.body.removeChild(loader);
        iframe.style.width = "2000px";
        iframe.contentWindow.document.querySelector("table").style.width =
          "2000px";
      };
      iframe.src = templateUrl;

      const closeButton = document.createElement("div");
      closeButton.innerHTML = "×";
      Object.assign(closeButton.style, {
        top: "10px",
        right: "20px",
        fontSize: "2rem",
        fontWeight: "lighter",
        color: "#bd241a",
        cursor: "pointer",
        zIndex: 1001,
        marginRight: "2rem",
      });

      const closeButtonAlt = document.createElement("button");
      closeButtonAlt.innerText = "Close";
      Object.assign(closeButtonAlt.style, {
        padding: "0.3125rem 1.25rem",
        fontSize: "1rem",
        color: "white",
        backgroundColor: "#bd241a",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginRight: "1rem",
      });

      const exportButton = document.createElement("button");
      exportButton.innerText = "Export Excel";
      Object.assign(exportButton.style, {
        padding: "0.3125rem 1.25rem",
        fontSize: "1rem",
        color: "white",
        backgroundColor: "#28a745",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginLeft: "auto",
        marginRight: "1rem",
      });

      const exportButtonPdf = document.createElement("button");
      exportButtonPdf.innerText = "Export Pdf";
      Object.assign(exportButtonPdf.style, {
        padding: "0.3125rem 1.25rem",
        fontSize: "1rem",
        color: "white",
        backgroundColor: "#007bff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginRight: "1rem",
      });

      const exportButtonWord = document.createElement("button");
      exportButtonWord.innerText = "Export Word";
      Object.assign(exportButtonWord.style, {
        padding: "0.3125rem 1.25rem",
        fontSize: "1rem",
        color: "white",
        backgroundColor: "#28a745",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginRight: "1rem",
      });

      const closePopup = () => {
        document.body.style.overflow = "auto";
        if (document.body.contains(popupDiv)) {
          document.body.removeChild(popupDiv);
        }
      };

      closeButton.onclick = closePopup;
      closeButtonAlt.onclick = closePopup;

      exportButton.onclick = () => exportTemplateExcel(templateUrl);
      exportButtonPdf.onclick = () =>
        exportTemplatePdf(templateUrl, templateSlab);
      exportButtonWord.onclick = () => exportTemplateWord(templateUrl);

      popupDiv.appendChild(iframe);
      popupDiv.appendChild(exportButton);
      popupDiv.appendChild(exportButtonPdf);
      popupDiv.appendChild(closeButtonAlt);
      document.body.appendChild(popupDiv);
      document.body.style.overflow = "hidden";
    } catch (error) {
      document.body.removeChild(loader);
      console.error("Error:", error.response?.data || error.message);
      alert("Failed to generate the template. Please try again later.");
    }

    const exportTemplatePdf = async (templateUrl, templateSlab) => {
      try {
        const response = await axiosOther.post("createViewPdf", {
          url: templateUrl,
          QueryId: queryAndQuotationNo?.QueryID,
          Slab: templateSlab,
        });
        if (response.status !== 200) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        const { status, pdf_url } = response.data;
        if (status && pdf_url) {
          window.open(pdf_url, "_blank");
        } else {
          alert("PDF generation failed. Please try again.");
        }
      } catch (error) {
        console.error("Error exporting HTML to PDF:", error);
        alert("Export failed. Please try again.");
      }
    };

    const exportTemplateExcel = async (templateUrl) => {
      try {
        const response = await axiosOther.post("createViewExcel", {
          url: templateUrl,
        });
        if (response.status !== 200) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        const { status, download_url, message } = response.data;
        if (status == 1 && download_url) {
          const link = document.createElement("a");
          link.href = download_url;
          const fileName = `costsheet_${Date.now()}.xls`;
          link.setAttribute("download", fileName);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          alert(message || "Excel generation failed. Please try again.");
        }
      } catch (error) {
        console.error("Error exporting HTML to Excel:", error);
        alert("Export failed. Please try again.");
      }
    };

    const exportTemplateWord = async (templateUrl) => {
      try {
        const response = await axiosOther.post("createViewWord", {
          url: templateUrl,
        });
        if (response.status !== 200) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        const { status, download_url } = response.data;
        if (status && download_url) {
          const link = document.createElement("a");
          link.href = download_url;
          link.download = "";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          alert("Word generation failed. Please try again.");
        }
      } catch (error) {
        console.error("Error exporting HTML to Word:", error);
        alert("Export failed. Please try again.");
      }
    };
  };

  const renderTableRow = (slab, index) => {
    const transportCost =
      costs.transport.find((data) => data.id == slab.TransportType)
        ?.TotalServiceCost || 0;
    const supplimentTransportCost =
      costs.transport.find((data) => data.id == slab.SupplimentTransferType)
        ?.TotalServiceCost || 0;
    const noVehicles = parseInt(slab.NoOfVehicle) || 0;
    const noSuppliment = parseInt(slab.SupplimentNoOfVehicle) || 0;
    const calculatedCost =
      slab.DividingFactor > 0
        ? Math.ceil(
            (noVehicles * (transportCost + assistance) +
              noSuppliment * (supplimentTransportCost + assistance)) /
              slab.DividingFactor
          )
        : 0;

    const additionalSlabCost = slab?.Misc
      ? slab?.Misc
      : activityAddtionalCost[index]?.additionalCost || 0;

    console.log(calculatedCost, "WRWRW8777");

    const nettValue = calculateNett(slab, additionalSlabCost);
    const igstValue = Math.ceil(
      (nettValue + parseFloat(slab.TopMargin)) *
        (parseFloat(gstInfo?.GstValue || 0) / 100)
    );

    const activitySlabCost = activityAddtionalCost[index]?.activityCost;

    activityAddtionalCost[index]?.additionalCost + assistance;

    console.log(nettValue, "additionalSlabCost", slab?.Transport);

    let commissionBase = 0;
    let commissionValue = 0;

    const totalSum = nettValue + igstValue + slab.TopMargin; // totoal 10000
    let beforeFinal;
    if (clientCommision) {
      beforeFinal = (100 - parseInt(clientCommision)) / 100; // cilennt commison is 10 (100-10) / 100 = 0.9
    }

    const beforeFinalTwo = totalSum / beforeFinal; // 10000 / 0.9

    if (parseInt(clientCommision)) {
      commissionBase = Math.ceil(
        (beforeFinalTwo * parseInt(clientCommision)) / 100
      );
      commissionValue = commissionBase;
    }

    const totalValue = Math.ceil(
      nettValue +
        (parseFloat(slab.TopMargin) || 0) +
        parseFloat(igstValue) +
        parseInt(commissionValue)
    );

    const totalUSD = Math.ceil(totalValue / parseInt(currencyValue));

    console.log(slab?.Transport, "EWRSDDSDS");

    return (
      <tr key={index}>
        <td>
          <div className="icon-container">
            <button
              className="badge bg-info rounded-pill quotation-button newQuotationIconButton"
              onClick={() => {
                openPopup(index);
              }}
              style={{ width: "21px", height: "20px" }}
            >
              <img
                src={activeCostSheet}
                alt="icon"
                style={{
                  width: "0.7rem",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />
            </button>
            <p className="tooltip-text py-1 px-1" style={{ fontSize: "7px" }}>
              Costsheet
            </p>
          </div>
        </td>
        <td>
          <div className="d-flex gap-2 justify-content-center">
            <span onClick={() => handleIncrementTable(index)}>
              <i className="la la-plus border cursor-pointer bg-success text-white rounded-pill fontSize10px padding1px" />
            </span>
            <span onClick={() => handleDecrementTable(index)}>
              <i className="la la-minus border cursor-pointer bg-primary text-white rounded-pill fontSize10px padding1px" />
            </span>
          </div>
        </td>
        <td>
          <input
            type="number"
            name="Min"
            className="formControl1 width30px"
            value={slab.Min}
            onChange={(e) => handleFormChange(e, index)}
            style={{ fontSize: "0.7rem" }}
          />
        </td>
        <td>
          <input
            type="number"
            name="Max"
            className="formControl1 width30px"
            value={slab.Max}
            onChange={(e) => handleFormChange(e, index)}
            style={{ fontSize: "0.7rem" }}
          />
        </td>
        <td>
          <input
            type="number"
            name="Foc"
            className="formControl1 width30px"
            value={slab.Foc ? slab.Foc : excortSlabData?.[index]?.Foc}
            onChange={(e) => handleFormChange(e, index)}
            style={{ fontSize: "0.7rem" }}
          />
        </td>
        <td>
          <input
            type="number"
            name="NoLocalEscort"
            className="formControl1 width30px"
            value={slab.NoLocalEscort}
            onChange={(e) => handleFormChange(e, index)}
            style={{ fontSize: "0.7rem" }}
          />
        </td>
        <td>
          <input
            type="number"
            name="DividingFactor"
            className="formControl1 width30px"
            value={slab.DividingFactor}
            onChange={(e) => handleFormChange(e, index)}
          />
        </td>
        <td>
          <select
            name="TransportType"
            className="formControl1"
            value={slab.TransportType ?? ""}
            onChange={(e) => handleFormChange(e, index)}
          >
            <option value="">Select</option>
            {vehicleList.map((data, idx) => (
              <option key={idx} value={data.value}>
                {data.label}
              </option>
            ))}
          </select>
        </td>
        <td>
          <input
            type="number"
            name="NoOfVehicle"
            value={slab.NoOfVehicle ?? ""}
            onChange={(e) => handleFormChange(e, index)}
            className="formControl1 width50px"
            style={{ fontSize: "0.7rem" }}
          />
        </td>
        {qoutationData?.Days?.some((day) =>
          day?.DayServices?.some(
            (service) =>
              service?.ServiceType == "Transport" &&
              service?.ServiceMainType == "Transport Suppliment"
          )
        ) && (
          <>
            <td>
              <select
                name="SupplimentTransferType"
                className="formControl1"
                value={slab.SupplimentTransferType ?? ""}
                onChange={(e) => handleFormChange(e, index)}
              >
                <option value="">Select</option>
                {vehicleList.map((data, idx) => (
                  <option key={idx} value={data.value}>
                    {data.label}
                  </option>
                ))}
              </select>
            </td>
            <td>
              <input
                type="number"
                name="SupplimentNoOfVehicle"
                value={slab.SupplimentNoOfVehicle ?? ""}
                onChange={(e) => handleFormChange(e, index)}
                className="formControl1 width50px"
                style={{ fontSize: "0.7rem" }}
              />
            </td>
          </>
        )}
        <td>
          <input
            type="number"
            name="Transport"
            className="formControl1 width50px"
            value={Math.ceil(slab.Transport || 0)}
            onChange={(e) => handleFormChange(e, index)}
          />
        </td>
        <td>
          <input
            type="number"
            className="formControl1 width50px"
            name="Hotel"
            value={slab.Hotel || 0}
            onChange={(e) => handleFormChange(e, index)}
          />
        </td>
        <td>
          <input
            type="number"
            className="formControl1 width50px"
            name="Meal"
            value={slab.Meal || 0}
            onChange={(e) => handleFormChange(e, index)}
          />
        </td>
        <td>
          <input
            type="number"
            className="formControl1 width50px"
            name="Activity"
            value={Math.ceil(
              activityAddtionalCost[index]?.activityCost !== undefined
                ? activityAddtionalCost[index]?.activityCost
                : slab.Activity || 0
            )}
            onChange={(e) => handleFormChange(e, index)}
          />
        </td>
        <td>
          <input
            type="number"
            className="formControl1 width50px"
            name="Misc"
            value={Math.ceil(
              activityAddtionalCost[index]?.additionalCost !== undefined
                ? activityAddtionalCost[index]?.additionalCost // removed + assistance
                : slab.Misc || 0
            )}
            onChange={(e) => handleFormChange(e, index)}
          />
        </td>
        <td>
          <input
            type="number"
            className="formControl1 width50px"
            name="MFees"
            value={slab.MFees || 0}
            onChange={(e) => handleFormChange(e, index)}
          />
        </td>
        <td>
          <input
            type="number"
            className="formControl1 width50px"
            name="Guide"
            value={Math.ceil(slab.Guide !== undefined ? slab.Guide : 0)}
            onChange={(e) => handleFormChange(e, index)}
          />
        </td>
        {console.log(Math.ceil(""), "GFBVCJFH8777")}
        <td>
          <input
            type="number"
            className="formControl1 width50px"
            name="Train"
            value={slab.Train || ""}
            onChange={(e) => handleFormChange(e, index)}
          />
        </td>
        <td>
          <input
            type="number"
            className="formControl1 width50px"
            name="LocalEscort"
            value={Math.ceil(slab.LocalEscort || 0)}
            onChange={(e) => handleFormChange(e, index)}
          />
        </td>
        <td>
          <input
            type="number"
            className="formControl1 width50px"
            name="ForeignerEscort"
            value={Math.ceil(slab.ForeignerEscort?.[0]?.Total || 0)}
            onChange={(e) => handleFormChange(e, index)}
          />
        </td>
        <td>
          <input
            type="number"
            className="formControl1 width50px"
            name="Nett"
            value={nettValue}
            readOnly
          />
        </td>
        <td>
          <input
            type="number"
            className="formControl1 width50px"
            name="TopMargin"
            value={Math.ceil(slab.TopMargin || calculateMargins(slab))}
            onChange={(e) => handleFormChange(e, index)}
          />
        </td>
        <td>
          <input
            type="number"
            className="formControl1 width50px"
            name="IGST"
            value={igstValue}
            readOnly
          />
        </td>

        <td>
          <input
            type="number"
            className="formControl1 width50px"
            name="Commission"
            value={commissionValue || ""}
            readOnly
          />
        </td>
        <td>
          <input
            type="number"
            className="formControl1 width50px"
            name="Total"
            value={totalValue}
            readOnly
          />
        </td>
        <td>
          <input
            type="number"
            className="formControl1 width50px"
            name="TotalUSD"
            value={totalUSD}
            readOnly
          />
        </td>
        <td>
          <input
            type="number"
            className="formControl1 width50px"
            name="Air"
            value={slab.Air || ""}
            onChange={(e) => handleFormChange(e, index)}
          />
        </td>
      </tr>
    );
  };

  return (
    <div className="row m-0">
      <div className="col-12 mt-2">
        <ToastContainer />
        <div className="d-flex justify-content-between align-items-center flex-wrap my-1 border-1 col-lg-2 col-xs-2">
          <div
            className="d-flex align-items-center p-1 gap-1"
            style={{ border: "1px solid grey" }}
          >
            <label>Pax</label>
            <input
              type="number"
              name="Pax"
              className="formControl1 width50px"
              value={
                qoutationData?.Pax?.ChildCount + qoutationData?.Pax?.AdultCount
              }
              style={{ fontSize: "0.7rem" }}
              readOnly
            />
          </div>
        </div>
      </div>
      <div className={`${styles.scrollContainer} col-12`}>
        <table className="table table-bordered itinerary-table table-first-child">
          <thead>
            <tr>
              <th></th>
              <th></th>
              <th>Min Pax</th>
              <th>Max Pax</th>
              <th>FOC</th>
              <th>L.No.</th>
              <th>Div Fact</th>
              <th>Trans Type</th>
              <th>No.of Vehicle</th>
              {qoutationData?.Days?.some((day) =>
                day?.DayServices?.some(
                  (service) =>
                    service?.ServiceType == "Transport" &&
                    service?.ServiceMainType == "Transport Suppliment"
                )
              ) && (
                <>
                  <th>alternate vehicle</th>
                  <th>No.of Vehicle</th>
                </>
              )}
              <th>Transport</th>
              <th>Hotel</th>
              <th>Meal</th>
              <th>Activity</th>
              <th>Misc</th>
              <th>M. Fees</th>
              <th>Guide</th>
              <th>Train</th>
              <th>L.Escort</th>
              <th>F.Escort</th>
              <th>Nett</th>
              <th>Top Margin</th>
              <th>GST({gstInfo?.GstValue}%)</th>
              <th>Comm({clientCommision}%)</th>
              <th>Total</th>
              <th>
                Total in {currencyType}
                <br />@{currencyValue}
              </th>
              <th>
                Air in {currencyType}
                <br />@{currencyValue}
              </th>
            </tr>
          </thead>
          <tbody>
            {slabSingleFormValue.map((slab, index) =>
              renderTableRow(slab, index)
            )}
          </tbody>
        </table>
      </div>
      <div className="col-12 d-flex justify-content-end align-items-end mt-2">
        <button
          className="btn btn-primary py-1 px-2 radius-4 me-2 d-flex align-items-center gap-1"
          onClick={handleSubmit}
        >
          <i className="fa-solid fa-floppy-disk fs-4" /> Save
        </button>
        <div className="row mt-3">
          <div className="col-12 d-flex justify-content-end align-items-end">
            <button
              className="btn btn-primary btn-custom-size"
              name="SaveButton"
              onClick={onNext}
            >
              <span className="me-1">Next</span>
              <i className="fa-solid fa-forward text-primary bg-white p-1 rounded"></i>
            </button>
          </div>
        </div>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <div
          style={{
            border: "2px solid white",
            backgroundColor: "#202020",
            width: "300px",
            color: "#fffa",
            padding: "10px",
          }}
        >
          <h4 style={{ textAlign: "center", marginBottom: "10px" }}>
            Option 1
          </h4>
          <div style={{ border: "0.5px solid white", padding: "10px" }}>
            <p
              style={{
                margin: "0 0 10px 0",
                color: "white",
                backgroundColor: "#202020",
              }}
            >
              Top Margin By Per
            </p>
            <div style={{ border: "0.5px solid white", padding: "10px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <input type="checkbox" />
                <label style={{ marginLeft: "5px" }}>Package</label>
                <input
                  type="number"
                  style={{
                    width: "45px",
                    height: "18px",
                    color: "white",
                    backgroundColor: "#2e2e40",
                    marginLeft: "10px",
                    outline: "none",
                  }}
                />
                <div
                  style={{
                    border: "0.5px solid white",
                    marginLeft: "20px",
                    padding: "5px",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 5px 0",
                      color: "white",
                      backgroundColor: "#202020",
                    }}
                  >
                    On
                  </p>
                  <div>
                    <input type="radio" name="On" />
                    <label>Cost</label>
                    <input type="radio" name="On" />
                    <label>Sale</label>
                  </div>
                </div>
              </div>
              {[
                "Hotel",
                "Transport",
                "Meal",
                "Guide",
                "Activity",
                "Escort",
                "Menu",
                "D Act",
                "Misc",
              ].map((label, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "5px",
                  }}
                >
                  <input type="radio" name={label} />
                  <label>{label}</label>
                  <input
                    style={{
                      width: "45px",
                      height: "18px",
                      color: "white",
                      backgroundColor: "#2e2e40",
                      marginLeft: idx % 2 == 0 ? "20px" : "10px",
                    }}
                    type="number"
                  />
                  {idx % 2 == 0 && idx < 8 && (
                    <>
                      <input type="radio" name={label + "_2"} />
                      <label>
                        {["Transport", "Guide", "Escort", "D Act"][idx / 2]}
                      </label>
                      <input
                        style={{
                          width: "45px",
                          height: "18px",
                          backgroundColor: "#2e2e40",
                          marginLeft: "10px",
                        }}
                        type="number"
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              border: "0.5px solid white",
              padding: "10px",
              marginTop: "10px",
            }}
          >
            <p
              style={{
                margin: "0 0 10px 0",
                color: "white",
                backgroundColor: "#202020",
              }}
            >
              F.Escort
            </p>
            <div style={{ display: "flex", alignItems: "center" }}>
              <input type="radio" name="F.Escort" />
              <label>Hotel</label>
              <input
                style={{
                  width: "45px",
                  height: "18px",
                  color: "white",
                  backgroundColor: "#2e2e40",
                  marginLeft: "10px",
                }}
                type="number"
              />
            </div>
          </div>
          <div
            style={{
              border: "0.5px solid white",
              padding: "10px",
              margin: "10px 0",
            }}
          >
            <p
              style={{
                margin: "0 0 10px 0",
                color: "white",
                backgroundColor: "#202020",
              }}
            >
              Top Margin Amount
            </p>
            {["On Amount", "On Amount (PKG)"].map((label, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <input type="checkbox" />
                <label style={{ marginLeft: "5px" }}>{label}</label>
                <input
                  type="number"
                  style={{
                    marginLeft: idx == 0 ? "10px" : "16px",
                    color: "white",
                    backgroundColor: "#2e2e40",
                    flex: 1,
                  }}
                />
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <input type="radio" name="On" />
            <label style={{ marginLeft: "5px" }}>MU</label>
            <input
              type="range"
              style={{
                marginLeft: "10px",
                color: "white",
                backgroundColor: "#2e2e40",
                flex: 1,
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <input type="radio" name="On" />
            <label style={{ marginLeft: "5px" }}>Comm</label>
          </div>
          <div
            style={{
              border: "0.5px solid white",
              padding: "10px",
              margin: "10px 0",
            }}
          >
            <p style={{ margin: "0 0 10px 0", backgroundColor: "#202020" }}>
              Commission
            </p>
            <div className="d-flex align-items-center gap-2">
              <input
                type="number"
                style={{ backgroundColor: "#2e2e40" }}
                defaultValue="0"
                className="w-25 h-25 text-center text-white"
              />
              <div className="d-flex justify-content-start gap-2">
                <label>%On</label>
                <input type="radio" name="com" />
                <label>Cost</label>
                <input type="radio" name="com" />
                <label>Sale</label>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button className="btn btn-primary btn-custom-size">
              Calculate
            </button>
            <button
              className="btn btn-dark btn-custom-size"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PaxSlab;
