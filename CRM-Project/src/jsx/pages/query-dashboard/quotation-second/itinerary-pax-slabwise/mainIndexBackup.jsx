// 15-09-2025

import { useSelector } from "react-redux";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useCallback, useEffect, useState } from "react";
import { axiosOther } from "../../../../../http/axios_base_url";
import { notifyError, notifySuccess } from "../../../../../helper/notify";

// ============================= Main PaxSlab Logic Start

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
  LocalEscort: pax?.LocalEscort ? [pax.LocalEscort] : [],
  TopMargin: pax?.TopMargin ?? "",
  IGST: pax?.IGST ?? "",
  Air: pax?.Air ?? "",
  Nett: pax?.Nett?.toString() ?? "",
  Total: pax?.Total?.toString() ?? "0",
  Foc: pax?.Foc ?? 1,
});

const getLocalEscortTotal = (maxPax, min, localSlabData, divFact) => {
  if (!Array.isArray(localSlabData)) return 0;

  const exactMatch = localSlabData?.filter(
    (data) =>
      parseInt(data?.StartPax) == parseInt(min) &&
      parseInt(data?.EndPax) == parseInt(maxPax)
  );

  if (exactMatch?.length > 0) {
    const totalSum = exactMatch.reduce(
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

// ========================= Main PaxSLab Logic End

const activityAdditionalCost = async (
  QueryQuotation,
  maxPax,
  dividingFactor
) => {
  try {
    const { data } = await axiosOther.post("activitycalculation", {
      QueryId: QueryQuotation?.QueryID,
      QuotationNumber: QueryQuotation?.QoutationNum,
      MaxPax: maxPax,
      DivisionFactor: dividingFactor,
      Type: "Foreigner",
    });

    console.log(data, "DATAYBDF76");
  } catch (error) {
    console.log(error);
  }
};

function calculateMealPlanCosts(hotel) {
  let totalMealCostAcrossAll = 0;

  hotel?.forEach((hotel) => {
    const destination = hotel.DestinationName || "Unknown";
    let totalMealCost = 0;
    const itemName = hotel.ServiceDetails[0]?.ItemName || "Unnamed Hotel";

    // Check if ServicePrice is 0 or ItemName is empty, treat as invalid
    if (hotel.ServicePrice === 0 || !itemName) {
      return;
    }

    // Get MealType array from ItemUnitCost
    const mealTypes = hotel.ServiceDetails[0]?.ItemUnitCost?.MealType || [];

    // Calculate total meal cost where MealTypePackage is "No"
    mealTypes.forEach((meal) => {
      if (meal.MealTypePackage === "No") {
        totalMealCost += meal.MealCost || 0;
      }
    });

    totalMealCostAcrossAll += totalMealCost;
  });

  return totalMealCostAcrossAll || 0;
}

const PaxSlab = ({ Type }) => {
  const { qoutationData, queryData } = useSelector(
    (data) => data?.queryReducer
  );

  const { UpdateForeignEscortCharges } = useSelector(
    (data) => data?.activeTabOperationReducer
  );

  const QueryQuotation = JSON.parse(localStorage.getItem("Query_Qoutation"));

  const [slabFormValue, setSlabFormValue] = useState([]);
  const [QoutationData, setQoutationData] = useState({});
  const [paxslabList, setPaxslabList] = useState([]);
  const [serviceCost, setServiceCost] = useState({});

  useEffect(() => {
    if (!QoutationData?.Days) return;

    const foreignerSlabData = QoutationData?.ExcortDays?.find(
      (item) => item.Type == "Foreigner"
    );

    console.log(foreignerSlabData?.ExcortSlabCost, "BCHHDGD*77", QoutationData);

    if (paxslabList?.length > 0 && slabFormValue?.length === 0) {
      if (foreignerSlabData?.ExcortSlabCost?.length > 0) {
        setSlabFormValue(foreignerSlabData.ExcortSlabCost);
      } else {
        console.log("VCHDGGD*777");
        const initialList = paxslabList.map((pax) => ({
          Min: pax?.Min || 0,
          Max: pax?.Max || 0,
          DividingFactor: pax?.DividingFactor,
          Escort: 0,
          SingleSelectType: "SPercent",
          DoubleSelectType: "DPercent",
          Double: 0,
          Foc: 0,
          Single: 0,
          Activity: 0,
          SglHotel: 0,
          Meal: 0,
          Fee: 0,
          Train: 0,
          Additional: 0,
          Air: 0,
          QueryId: QueryQuotation?.QueryID,
          QuotationNumber: QueryQuotation?.QoutationNum,
          ExcortType: "Foreigner",
          Hotel: 0,
          TotalPerPerson: 0,
        }));
        setSlabFormValue(initialList);
      }
    }
  }, [paxslabList, QueryQuotation, QoutationData]);

  // ================================== Main PaxSlab Logic Start ==============================

  const [QoutationDataMainPaxSlab, setQoutationDataMainPaxSlab] = useState([]);
  const commissionLoad = useSelector(
    (state) => state?.activeTabOperationReducer.commissionLoad
  );

  console.log(commissionLoad, "commissionLoad4747");
  const paxSlabType = useSelector(
    (state) => state?.queryReducer.QoutationDataMainPaxSlab
  );
  const { payloadQueryData } = useSelector((state) => state?.queryReducer);
  const loadSlabApi = useSelector(
    (state) => state?.activeTabOperationReducer.paxSlabApiLoad
  );
  const hotelprice = useSelector((state) => state?.priceReducer);
  const { PaxSlab, TourSummary } = QoutationDataMainPaxSlab;
  const queryAndQuotationNo = JSON.parse(
    localStorage.getItem("Query_Qoutation")
  );

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

  const [paxSlabSaveCounter, setPaxSlabSaveCounter] = useState(0);

  console.log(slabSingleFormValue, "COMSFS78777");

  // const navigate = useNavigate();
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

  const getDefaultFormValue = (
    pax,
    index,
    queryData,
    QoutationDataMainPaxSlab,
    costs
  ) => {
    console.log(costs, "costs");

    const dividingFactor = pax?.DividingFactor ?? 0;

    const maxPax = parseInt(pax?.Max) || 0;
    const foc =
      Array.isArray(excortSlabData) && excortSlabData[index]?.Foc != null
        ? parseInt(excortSlabData[index].Foc)
        : 0;

    const totoalPaxFoc = maxPax + foc;

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
            (transportCost * (parseInt(NoOfVehicle) || 0)) / dividingFactor
          )
        : 0;
    console.log(foc, "foc");

    return {
      QueryId: queryData?.QueryAlphaNumId,
      QuotationNumber: QoutationDataMainPaxSlab?.QuotationNumber,
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
      LocalEscort: [],
      TopMargin: "",
      IGST: "",
      Air: Math.ceil(costs.fligthCost || 0),
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

      const value =
        parseFloat(
          field == "LocalEscort"
            ? slab[field]?.[0]?.Total
            : field == "ForeignerEscort"
            ? slab[field]?.[0]?.Total
            : slab[field]
        ) || 0;

      if (markup && markup.Markup == "%") {
        const margin = (value * parseFloat(markup.Value)) / 100;
        totalMargin += margin;
      }
    });

    return Math.ceil(totalMargin);
  };

  const calculateNett = (slab, calculatedTransportCost, additionalSlabCost) => {
    const additionalCost =
      parseFloat(slab.Misc) + parseFloat(additionalSlabCost);
    return Math.ceil(
      [
        parseFloat(slab.Hotel) || 0,
        parseFloat(slab.Guide) || 0,
        parseFloat(slab.MFees) || 0,
        parseFloat(additionalSlabCost) || 0,
        parseFloat(slab.Meal) || 0,
        parseFloat(slab.Activity) || 0,
        parseFloat(calculatedTransportCost) || 0,
        parseFloat(slab.Train) / (parseFloat(slab.DividingFactor) || 1) || 0,
        parseFloat(slab.LocalEscort?.[0]?.Total) || 0,
        parseFloat(slab.ForeignerEscort?.[0]?.Total) || 0,
      ].reduce((a, b) => a + b, 0)
    );
  };

  // const onNext = () => {
  //   navigate("/query/costsheet-list");
  // };

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

  // Initialize slabSingleFormValue only when initialList or QoutationDataMainPaxSlab changes
  useEffect(() => {
    if (QoutationDataMainPaxSlab?.PaxSlab?.length > 0) {
      console.log("VCHDG9888");
      const initialFormValue = QoutationDataMainPaxSlab?.PaxSlab?.map(
        (pax, index) => {
          const formValue = setFormValueFromDB(
            pax,
            index,
            activityAddtionalCost
          );
          const transportCost =
            costs.transport.find((data) => data.id == formValue.TransportType)
              ?.TotalServiceCost || 0;
          const supplimentTransportCost =
            costs.transport.find(
              (data) => data.id == formValue.SupplimentTransferType
            )?.TotalServiceCost || 0;
          const calculatedCost =
            formValue.DividingFactor > 0
              ? Math.ceil(
                  (transportCost * (parseInt(formValue.NoOfVehicle) || 0) +
                    supplimentTransportCost *
                      (parseInt(formValue.SupplimentNoOfVehicle) || 0)) /
                    formValue.DividingFactor
                )
              : 0;
          const nettValue = calculateNett(formValue, calculatedCost);
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
            LocalEscort: [{ Total: Math.ceil(formValue.LocalEscort) }],
            ForeignerEscort: [{ Total: Math.ceil(formValue.ForeignerEscort) }],
            TopMargin: Math.ceil(calculateMargins(formValue)),
            Nett: nettValue,
            IGST: Math.ceil(nettValue * (gstInfo?.Gst / 100) || 0),
            Air: Math.ceil(formValue.Air || 0),
          };
        }
      );
      setSlabSingleFormValue(initialFormValue);
      setIsPaxSlabSaved(true);
    } else if (initialList?.length > 0) {
      const initialFormValue = initialList.map((pax, index) => {
        const formValue = getDefaultFormValue(
          pax,
          index,
          queryData,
          QoutationDataMainPaxSlab,
          costs
        );
        const transportCost =
          costs.transport.find((data) => data.id == formValue.TransportType)
            ?.TotalServiceCost || 0;
        const supplimentTransportCost =
          costs.transport.find(
            (data) => data.id == formValue.SupplimentTransferType
          )?.TotalServiceCost || 0;
        const calculatedCost =
          formValue.DividingFactor > 0
            ? Math.ceil(
                (transportCost * (parseInt(formValue.NoOfVehicle) || 0) +
                  supplimentTransportCost *
                    (parseInt(formValue.SupplimentNoOfVehicle) || 0)) /
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
        const nettValue = calculateNett(
          {
            ...formValue,
            Guide: guideTotal,
            LocalEscort: [{ Total: localEscortTotal }],
          },
          calculatedCost
        );
        console.log(localEscortTotal, "localSlabData");

        return {
          ...formValue,
          Activity: Math.ceil(
            activityAddtionalCost?.[index]?.activityCost ?? formValue.Activity
          ),
          Misc: Math.ceil(
            activityAddtionalCost?.[index]?.additionalCost ?? formValue.Misc
          ),
          Guide: Math.ceil(guideTotal),
          LocalEscort: [{ Total: localEscortTotal }],
          ForeignerEscort: [{ Total: ForeignEscortTotal }],
          TopMargin: Math.ceil(
            calculateMargins({
              ...formValue,
              Guide: guideTotal,
              LocalEscort: [{ Total: localEscortTotal }],
            })
          ),
          Nett: nettValue,
          IGST: Math.ceil(nettValue * (gstInfo?.Gst / 100) || 0),
          Air: Math.ceil(formValue.Air || 0),
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
    QoutationDataMainPaxSlab,
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
              Type:
                qoutationData?.TourSummary?.PaxTypeName ||
                QoutationData?.TourSummary?.PaxTypeName,
              Default: "Yes",
            }),
            axiosOther.post("vehicletypemasterlist"),
            axiosOther.post("listqueryquotation", {
              QueryId: queryAndQuotationNo?.QueryID,
              QuotationNo: queryAndQuotationNo?.QoutationNum,
            }),
          ]);
        setQoutationDataMainPaxSlab(quotationResponse.data?.data[0]);
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
          setGstInfo(quotationResponse.data?.data[0]?.OthersInfo);
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
  }, [paxSlabSaveCounter]);

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

          if (name == "Min" || name == "Max" || name == "DividingFactor") {
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
            const guideTotal = getGuideTotal(
              newMaxPax,
              guidePerPaxCost,
              newDivFact
            );

            // Recalculate TransportType and NoOfVehicle similar to getDefaultFormValue
            const foc =
              Array.isArray(excortSlabData) &&
              excortSlabData[index]?.Foc != null
                ? parseInt(excortSlabData[index].Foc)
                : 0;
            const totalPaxFoc = newMaxPax + foc;

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
            const transportType = vehicleListObject?.value || "";

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
            const calculatedCost =
              newDivFact > 0
                ? Math.ceil(
                    (transportCost * (parseInt(noOfVehicle) || 0) +
                      supplimentTransportCost *
                        (parseInt(updatedItem.SupplimentNoOfVehicle) || 0)) /
                      newDivFact
                  )
                : 0;
            console.log(transportType, "calculatedCost646", costs.transport);
            updatedItem = {
              ...updatedItem,
              [name]: value,
              Guide: guideTotal,
              LocalEscort: [{ Total: escortTotal }],
              TransportType: transportType,
              NoOfVehicle: noOfVehicle,
              Transport: calculatedCost, // Ensure Transport is updated
            };

            if (!isPaxSlabSaved) {
              debouncedGetActivityAdditionalData(
                { Max: newMaxPax, DividingFactor: newDivFact },
                index
              );
            }
          } else if (name == "LocalEscort") {
            updatedItem = {
              ...updatedItem,
              LocalEscort: [{ Total: Math.ceil(parseFloat(value) || 0) }],
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
              [name]: Math.ceil(parseFloat(value) || 0),
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
          const calculatedCost =
            updatedItem.DividingFactor > 0
              ? Math.ceil(
                  (transportCost * (parseInt(updatedItem.NoOfVehicle) || 0) +
                    supplimentTransportCost *
                      (parseInt(updatedItem.SupplimentNoOfVehicle) || 0)) /
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
            IGST: Math.ceil(nettValue * (gstInfo?.Gst / 100) || 0),
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
    const newItem = { ...slabSingleFormValue[index], PaxSlabId: "" }; // Ensure new row has unique or empty ID
    setSlabSingleFormValue((prev) => [
      ...prev.slice(0, index + 1),
      newItem,
      ...prev.slice(index + 1),
    ]);

    setSingleDividingFactor((prev) => [
      ...prev,
      {
        factorInd: prev.length,
        factor: parseInt(slabSingleFormValue[index]?.DividingFactor || 1),
        transType: slabSingleFormValue[index]?.TransportType,
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
    setSlabSingleFormValue((prev) => prev.filter((_, idx) => idx !== index));
    setSingleDividingFactor((prev) => prev.filter((_, idx) => idx !== index));
    setSingleVehicleNo((prev) => prev.filter((_, idx) => idx !== index));
    setActivityAdditionalCost((prev) => prev.filter((_, idx) => idx !== index));
  };

  const renderTableRow = (slab, index) => {
    const transportCost =
      costs.transport.find((data) => data.id == slab.TransportType)
        ?.TotalServiceCost || 0;
    const supplimentTransportCost =
      costs.transport.find((data) => data.id == slab.SupplimentTransferType)
        ?.TotalServiceCost || 0;
    const calculatedCost =
      slab.DividingFactor > 0
        ? Math.ceil(
            (transportCost * (parseInt(slab.NoOfVehicle) || 0) +
              supplimentTransportCost *
                (parseInt(slab.SupplimentNoOfVehicle) || 0)) /
              slab.DividingFactor
          )
        : 0;

    const additionalSlabCost =
      (activityAddtionalCost[index]?.additionalCost || 0) + assistance;

    const nettValue = calculateNett(slab, calculatedCost, additionalSlabCost);
    const igstValue = Math.ceil(nettValue * (gstInfo?.Gst / 100) || 0);
    const totalValue = Math.ceil(
      nettValue + (parseFloat(slab.TopMargin) || 0) + parseFloat(igstValue)
    );

    const activitySlabCost = activityAddtionalCost[index]?.activityCost;

    activityAddtionalCost[index]?.additionalCost + assistance;

    console.log(additionalSlabCost, "additionalSlabCost");

    let commissionBase = 0;
    let commissionValue = 0;
    if (clientCommision) {
      commissionBase = Math.ceil(totalValue / ((100 - clientCommision) / 100));
      commissionValue = Math.ceil(commissionBase / clientCommision);
    }
  };

  // ================================= Main PaxSlab Logic End ================================

  useEffect(() => {
    const getDataToServer = async () => {
      try {
        const { data } = await axiosOther.post("paxslablist", {
          Type:
            qoutationData?.TourSummary?.PaxTypeName ||
            QoutationData?.TourSummary?.PaxTypeName,
          Default: "Yes",
        });
        if (data?.Status === 200) {
          const updatedList = data?.DataList?.map((list) => {
            return {
              Min: list?.Min,
              Max: list?.Max,
              DividingFactor: list?.DividingFactor,
            };
          });
          setPaxslabList(updatedList);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getDataToServer();
  }, [qoutationData, QoutationData]);

  const fetchQueryQuotationData = async () => {
    try {
      const { data } = await axiosOther.post("listqueryquotation", {
        QueryId: QueryQuotation?.QueryID,
        QuotationNo: QueryQuotation?.QoutationNum,
      });

      setQoutationData(data?.data[0]);
    } catch (error) {
      console.log(error, "error occurred");
    }
  };

  useEffect(() => {
    fetchQueryQuotationData();
  }, [UpdateForeignEscortCharges]);

  const trainFlightCost = (service) => {
    let totalAdultCost = 0;
    let totalChildCost = 0;
    let totalGuideCharges = 0;
    let totalHandlingCharges = 0;
    let totalServiceCharges = 0;

    service?.forEach((service) => {
      const adultCost = service.ServiceDetails[0].ItemUnitCost.Adult || 0;
      const childCost = service.ServiceDetails[0].ItemUnitCost.Child || 0;
      const guideCharges = service.GuideCharges || 0;
      const handlingCharges = service.HandlingCharges || 0;
      const serviceCharges = service.ServiceCharges || 0;

      totalAdultCost += adultCost;
      totalChildCost += childCost;
      totalGuideCharges += guideCharges;
      totalHandlingCharges += handlingCharges;
      totalServiceCharges += serviceCharges;
    });

    const totoalCost =
      totalAdultCost +
      totalChildCost +
      totalGuideCharges +
      totalHandlingCharges +
      totalServiceCharges;

    return totoalCost;
  };

  useEffect(() => {
    if (QoutationData?.ExcortDays?.length > 0) {
      const foreignerQuotationData = QoutationData?.ExcortDays?.find(
        (data) => data.Type === "Foreigner"
      );

      console.log(foreignerQuotationData, "foreignerQuotationData");

      const hotel = foreignerQuotationData?.Days?.[0]?.DayServices?.find(
        (service) => service?.ServiceType === "Hotel"
      );

      const hotelMealPlan = foreignerQuotationData?.Days?.flatMap((day) =>
        day.DayServices.filter((service) => service.ServiceType === "Hotel")
      );

      const monument = foreignerQuotationData?.Days?.[0]?.DayServices?.find(
        (service) => service?.ServiceType === "Monument"
      );

      console.log(hotelMealPlan, "hotel4746");

      const restaurent = foreignerQuotationData?.Days?.flatMap((day) =>
        day.DayServices.filter(
          (service) => service.ServiceType === "Restaurant"
        )
      );

      const train = foreignerQuotationData?.Days?.flatMap((day) =>
        day.DayServices.filter((service) => service.ServiceType === "Train")
      );
      const flight = foreignerQuotationData?.Days?.flatMap((day) =>
        day.DayServices.filter((service) => service.ServiceType === "Flight")
      );

      let trainCost = 0;
      if (train?.length > 0) {
        trainCost = trainFlightCost(train);
      }

      let flightCost = 0;
      if (flight?.length > 0) {
        flightCost = trainFlightCost(flight);
      }

      const hotelMealPlanCost = calculateMealPlanCosts(hotelMealPlan);

      // Restaurent Cost
      let restaurentCost = 0;
      if (restaurent?.length > 0) {
        restaurent?.forEach((service) => {
          const supplementStatus = {};
          service.MealPlan.forEach((meal) => {
            supplementStatus[meal.MealType] = meal.Supplement;
          });

          service.TotalCosting.forEach((cost) => {
            if (supplementStatus[cost.MealType] === "No") {
              restaurentCost += cost.ServiceCost;
            }
          });
        });
      }

      const hotelDoubleServiceCost =
        hotel?.TotalCosting[0]?.HotelRoomBedType?.find(
          (roomType) => roomType?.RoomBedType === 4
        )?.ServiceCost;

      const hotelSingleServiceCost =
        hotel?.TotalCosting[0]?.HotelRoomBedType?.find(
          (roomType) => roomType?.RoomBedType === 3
        )?.ServiceCost;

      setServiceCost((prev) => ({
        ...prev,
        Single: Math.ceil(hotelSingleServiceCost) || 0,
        Double: Math.ceil(hotelDoubleServiceCost) || 0,
        Fee: Math.ceil(monument?.TotalCosting?.ServiceAdultCost) || 0,
        Meal: Math.ceil(restaurentCost + hotelMealPlanCost) || 0,
        Train: Math.ceil(trainCost) || 0,
        Air: Math.ceil(flightCost) || 0,
      }));
    }
  }, [QoutationData]);

  console.log(UpdateForeignEscortCharges, "GDVCIW7877");

  // Update Hotel and TotalPerPerson when serviceCost changes
  useEffect(() => {
    if (slabFormValue?.length > 0) {
      const updatedList = slabFormValue.map((slab) => {
        let hotelCost = 0;
        const doubleValue = parseFloat(slab.Double) || 0;
        const singleValue = parseFloat(slab.Single) || 0;
        const doubleType = slab.DoubleSelectType;
        const singleType = slab.SingleSelectType;

        // Calculate Double cost
        if (doubleType === "DPercent" && doubleValue > 0) {
          hotelCost += doubleValue * (serviceCost.Double || 0);
        } else if (doubleType === "DFlat") {
          hotelCost += doubleValue;
        }

        // Calculate Single cost
        if (singleType === "SPercent" && singleValue > 0) {
          hotelCost += singleValue * (serviceCost.Single || 0);
        } else if (singleType === "SFlat") {
          hotelCost += singleValue;
        }
        console.log(slab.Meal, "BCVDHD&77", serviceCost.Meal);
        const hotel = Math.ceil(hotelCost);
        const totalPerPerson = Math.ceil(
          hotel +
            (parseFloat(slab.Fee) || serviceCost.Fee || 0) +
            (serviceCost.Meal || 0) +
            (parseFloat(slab.Activity) || 0) +
            (parseFloat(slab.Additional) || 0) +
            (parseFloat(slab.Train) || serviceCost.Train || 0) +
            (parseFloat(slab.Air) || serviceCost.Air || 0)
        );

        return {
          ...slab,
          Hotel: hotel,
          TotalPerPerson: totalPerPerson,
          Fee: serviceCost.Fee,
          Meal: serviceCost.Meal,
          Train: serviceCost.Train,
          Air: serviceCost.Air,
        };
      });
      setSlabFormValue(updatedList);
    }
  }, [serviceCost]);

  console.log(slabFormValue, "slabFormValue8474");

  // Handle input changes and calculate Hotel and TotalPerPerson
  const handleInputChange = async (index, field, value) => {
    setSlabFormValue((prev) => {
      const updatedList = [...prev];
      updatedList[index] = { ...updatedList[index], [field]: value };

      // Calculate Hotel cost based on DBL and SGL
      let hotelCost = 0;
      const doubleValue = parseFloat(updatedList[index].Double) || 0;
      const singleValue = parseFloat(updatedList[index].Single) || 0;
      const doubleType = updatedList[index].DoubleSelectType;
      const singleType = updatedList[index].SingleSelectType;

      if (field === "Double" || field === "Single") {
        // Calculate Double cost
        if (doubleType === "DPercent" && doubleValue > 0) {
          hotelCost += doubleValue * (serviceCost.Double || 0);
        } else if (doubleType === "DFlat") {
          hotelCost += doubleValue;
        }

        // Calculate Single cost
        if (singleType === "SPercent" && singleValue > 0) {
          hotelCost += singleValue * (serviceCost.Single || 0);
        } else if (singleType === "SFlat") {
          hotelCost += singleValue;
        }

        // If Hotel is directly edited, use its value
        updatedList[index].Hotel = Math.ceil(hotelCost);
      }

      // Calculate TotalPerPerson
      updatedList[index].TotalPerPerson = Math.ceil(
        (parseFloat(updatedList[index].Hotel) || 0) +
          (parseFloat(updatedList[index].Fee) || 0) +
          (parseFloat(updatedList[index].Meal) || 0) +
          (parseFloat(updatedList[index].Activity) || 0) +
          (parseFloat(updatedList[index].Additional) || 0) +
          (parseFloat(updatedList[index].Train) || 0) +
          (parseFloat(updatedList[index].Air) || 0)
      );

      return updatedList;
    });
  };

  // Handle select type changes
  const handleSelectChange = (index, field, value) => {
    setSlabFormValue((prev) => {
      const updatedList = [...prev];
      updatedList[index] = { ...updatedList[index], [field]: value };

      // Recalculate Hotel cost when select type changes
      let hotelCost = 0;
      const doubleValue = parseFloat(updatedList[index].Double) || 0;
      const singleValue = parseFloat(updatedList[index].Single) || 0;
      const doubleType =
        field === "DoubleSelectType"
          ? value
          : updatedList[index].DoubleSelectType;
      const singleType =
        field === "SingleSelectType"
          ? value
          : updatedList[index].SingleSelectType;

      // Calculate Double cost
      if (doubleType === "DPercent" && doubleValue > 0) {
        hotelCost += doubleValue * (serviceCost.Double || 0);
      } else if (doubleType === "DFlat") {
        hotelCost += doubleValue;
      }

      // Calculate Single cost
      if (singleType === "SPercent" && singleValue > 0) {
        hotelCost += singleValue * (serviceCost.Single || 0);
      } else if (singleType === "SFlat") {
        hotelCost += singleValue;
      }

      updatedList[index].Hotel = Math.ceil(hotelCost);

      // Calculate TotalPerPerson
      updatedList[index].TotalPerPerson = Math.ceil(
        (parseFloat(updatedList[index].Hotel) || 0) +
          (parseFloat(updatedList[index].Fee) || 0) +
          (parseFloat(updatedList[index].Meal) || 0) +
          (parseFloat(updatedList[index].Activity) || 0) +
          (parseFloat(updatedList[index].Additional) || 0) +
          (parseFloat(updatedList[index].Train) || 0) +
          (parseFloat(updatedList[index].Air) || 0)
      );

      return updatedList;
    });
  };

  // Handle adding a new row
  const handleAddRow = () => {
    setSlabFormValue((prev) => {
      const newRow = {
        Min: 0,
        Max: 0,
        Escort: 0,
        SingleSelectType: "SPercent",
        DoubleSelectType: "DPercent",
        Double: 0,
        Foc: 0,
        Single: 0,
        Activity: 0,
        SglHotel: 0,
        Meal: 0,
        Fee: 0,
        Train: 0,
        Additional: 0,
        Air: 0,
        QueryId: QueryQuotation?.QueryID,
        QuotationNumber: QueryQuotation?.QoutationNum,
        ExcortType: "Foreigner",
        Hotel: 0,
        TotalPerPerson: 0,
      };
      return [...prev, newRow];
    });
  };

  // Handle removing a row
  const handleRemoveRow = (index) => {
    setSlabFormValue((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit handler
  const handleFinalSubmit = async () => {
    const singleSlabPayload = slabSingleFormValue.map((row, idx) => {
      const transportCost =
        costs.transport.find((data) => data.id == row.TransportType)
          ?.TotalServiceCost || 0;
      const supplimentTransportCost =
        costs.transport.find((data) => data.id == row.SupplimentTransferType)
          ?.TotalServiceCost || 0;
      const calculatedTransportCost =
        row.DividingFactor > 0
          ? Math.ceil(
              (transportCost * (parseInt(row.NoOfVehicle) || 0) +
                supplimentTransportCost *
                  (parseInt(row.SupplimentNoOfVehicle) || 0)) /
                row.DividingFactor
            )
          : 0;

      const nettValue = calculateNett(row, calculatedTransportCost);
      const totalValue = Math.ceil(
        nettValue +
          (parseFloat(row.TopMargin) || 0) +
          parseFloat(nettValue * (gstInfo?.Gst / 100) || 0)
      );

      let commissionBase = 0;
      let commissionValue = 0;
      if (clientCommision) {
        commissionBase = Math.ceil(
          totalValue / ((100 - clientCommision) / 100)
        );
        commissionValue = Math.ceil(commissionBase / clientCommision);
      }

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
        Transport: Math.ceil(row?.Transport ?? 0),
        Hotel: Math.ceil(row.Hotel ?? 0),
        Meal: Math.ceil(row.Meal ?? 0),
        Activity: Math.ceil(
          activityAddtionalCost[idx]?.activityCost ?? row.Activity ?? 0
        ),
        Misc: Math.ceil(
          activityAddtionalCost[idx]?.additionalCost ?? row.Misc ?? 0
        ),
        MFees: Math.ceil(row.MFees ?? 0),
        Guide: Math.ceil(row.Guide ?? 0),
        LocalEscort: Math.ceil(row.LocalEscort?.[0]?.Total ?? 0),
        ForeignerEscort: Math.ceil(row.ForeignerEscort?.[0]?.Total ?? 0),
        Nett: nettValue,
        TopMargin: Math.ceil(row.TopMargin ?? 0),
        IGST: Math.ceil(nettValue * (gstInfo?.Gst / 100) || 0),
        Train: Math.ceil(row.Train ?? 0),
        Total: Math.ceil(
          nettValue +
            (parseFloat(row.TopMargin) || 0) +
            parseFloat(nettValue * (gstInfo?.Gst / 100) || 0)
        ),
        Commission: commissionValue || 0,
        Air: Math.ceil(row.Air ?? 0),
      };
    });

    console.log(singleSlabPayload, "46464HDHDH");

    try {
      if (QoutationDataMainPaxSlab?.PaxSlab?.length === undefined) {
        const { data } = await axiosOther.post(
          "store-paxSlabData",
          singleSlabPayload
        );
        notifySuccess(data?.message || data?.Message);
        setPaxSlabSaveCounter((prev) => prev + 1);
      }

      const { data } = await axiosOther.post(
        "add-slabcost-excort-days",
        slabFormValue
      );

      if (data?.Status == 1) {
        notifySuccess(data?.Message);
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

  return (
    <div className="row mt-3 m-0">
      <div className="col-12 px-1 py-2 d-flex justify-content-between itinerary-head-bg">
        <div className="d-flex gap-2 align-items-center">
          <p className="m-0 text-dark">Foreign Escort Slabwise Cost</p>
        </div>
      </div>
      <div className="col-12 px-0 mt-2">
        <PerfectScrollbar>
          <table className="table table-bordered itinerary-table">
            <thead>
              <tr>
                <th></th>
                <th>Min</th>
                <th>Max</th>
                <th>FOC</th>
                <th>DBL</th>
                <th>SGL</th>
                <th>Hotel</th>
                <th>M.Fee</th>
                <th>Meal</th>
                <th>Activity</th>
                <th>Additional</th>
                <th>Train</th>
                <th>Air</th>
                <th>Total Per Person</th>
              </tr>
            </thead>
            <tbody>
              {slabFormValue?.length > 0 &&
                slabFormValue.map((item, index) => (
                  <tr key={index + 1}>
                    <td>
                      <div className="d-flex gap-2 justify-content-center align-items-center">
                        <div>
                          {index > 0 ? (
                            <span
                              onClick={() => handleRemoveRow(index)}
                              className="cursor-pointer"
                            >
                              <i className="la la-minus border bg-primary text-white rounded-pill fontSize10px padding1px"></i>
                            </span>
                          ) : (
                            <span
                              onClick={handleAddRow}
                              className="cursor-pointer"
                            >
                              <i className="la la-plus border bg-success text-white rounded-pill fontSize10px padding1px"></i>
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <input
                          type="number"
                          min="0"
                          name="Min"
                          className="formControl1 width50px"
                          value={slabFormValue[index]?.Min || ""}
                          onChange={(e) =>
                            handleInputChange(index, "Min", e.target.value)
                          }
                        />
                      </div>
                    </td>
                    <td>
                      <div>
                        <input
                          type="number"
                          min="0"
                          name="Max"
                          className="formControl1 width50px"
                          value={slabFormValue[index]?.Max || ""}
                          onChange={(e) =>
                            handleInputChange(index, "Max", e.target.value)
                          }
                        />
                      </div>
                    </td>
                    <td>
                      <div>
                        <input
                          type="number"
                          min="0"
                          name="Foc"
                          className="formControl1 width50px"
                          value={slabFormValue[index]?.Foc || 0}
                          onChange={(e) =>
                            handleInputChange(index, "Foc", e.target.value)
                          }
                        />
                      </div>
                    </td>
                    <td>
                      <div className="d-flex gap-2 justify-content-center">
                        <select
                          style={{ width: "4rem" }}
                          className="formControl1"
                          value={
                            slabFormValue[index]?.DoubleSelectType || "DPercent"
                          }
                          name="DoubleSelectType"
                          onChange={(e) =>
                            handleSelectChange(
                              index,
                              "DoubleSelectType",
                              e.target.value
                            )
                          }
                        >
                          <option value="DPercent">%</option>
                          <option value="DFlat">FLAT</option>
                        </select>
                        <input
                          type="number"
                          min="0"
                          name="Double"
                          className="formControl1 width50px"
                          value={slabFormValue[index]?.Double || 0}
                          onChange={(e) =>
                            handleInputChange(index, "Double", e.target.value)
                          }
                        />
                      </div>
                    </td>
                    <td>
                      <div className="d-flex gap-2 justify-content-center">
                        <select
                          style={{ width: "4rem" }}
                          className="formControl1"
                          name="SingleSelectType"
                          value={
                            slabFormValue[index]?.SingleSelectType || "SPercent"
                          }
                          onChange={(e) =>
                            handleSelectChange(
                              index,
                              "SingleSelectType",
                              e.target.value
                            )
                          }
                        >
                          <option value="SPercent">%</option>
                          <option value="SFlat">FLAT</option>
                        </select>
                        <input
                          type="number"
                          min="0"
                          name="Single"
                          className="formControl1 width50px"
                          value={slabFormValue[index]?.Single || 0}
                          onChange={(e) =>
                            handleInputChange(index, "Single", e.target.value)
                          }
                        />
                      </div>
                    </td>
                    <td>
                      <div>
                        <input
                          type="number"
                          min="0"
                          name="Hotel"
                          className="formControl1 width50px"
                          value={slabFormValue[index]?.Hotel || 0}
                          onChange={(e) =>
                            handleInputChange(index, "Hotel", e.target.value)
                          }
                        />
                      </div>
                    </td>
                    <td>
                      <div>
                        <input
                          type="number"
                          min="0"
                          name="Fee"
                          className="formControl1 width50px"
                          value={slabFormValue[index]?.Fee || 0}
                          onChange={(e) =>
                            handleInputChange(index, "Fee", e.target.value)
                          }
                        />
                      </div>
                    </td>
                    <td>
                      <div>
                        <input
                          type="number"
                          min="0"
                          name="Meal"
                          className="formControl1 width50px"
                          value={slabFormValue[index]?.Meal || 0}
                          onChange={(e) =>
                            handleInputChange(index, "Meal", e.target.value)
                          }
                        />
                      </div>
                    </td>
                    <td>
                      <div>
                        <input
                          type="number"
                          min="0"
                          name="Activity"
                          className="formControl1 width50px"
                          value={slabFormValue[index]?.Activity || 0}
                          onChange={(e) =>
                            handleInputChange(index, "Activity", e.target.value)
                          }
                        />
                      </div>
                    </td>
                    <td>
                      <div>
                        <input
                          type="number"
                          min="0"
                          name="Additional"
                          className="formControl1 width50px"
                          value={slabFormValue[index]?.Additional || 0}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "Additional",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </td>
                    <td>
                      <div>
                        <input
                          type="number"
                          min="0"
                          name="Train"
                          className="formControl1 width50px"
                          value={slabFormValue[index]?.Train || 0}
                          onChange={(e) =>
                            handleInputChange(index, "Train", e.target.value)
                          }
                        />
                      </div>
                    </td>
                    <td>
                      <div>
                        <input
                          type="number"
                          min="0"
                          name="Air"
                          className="formControl1 width50px"
                          value={slabFormValue[index]?.Air || 0}
                          onChange={(e) =>
                            handleInputChange(index, "Air", e.target.value)
                          }
                        />
                      </div>
                    </td>
                    <td>
                      <div>
                        <input
                          type="number"
                          min="0"
                          name="TotalPerPerson"
                          className="formControl1 width50px"
                          value={slabFormValue[index]?.TotalPerPerson || 0}
                          readOnly
                        />
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </PerfectScrollbar>
      </div>
      <div className="col-12 d-flex justify-content-end align-items-end">
        <button
          onClick={handleFinalSubmit}
          className="btn btn-primary py-1 px-2 radius-4"
        >
          <i className="fa-solid fa-floppy-disk fs-4"></i>
        </button>
      </div>
    </div>
  );
};

export default PaxSlab;
