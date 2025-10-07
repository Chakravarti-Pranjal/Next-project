import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

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

const usePaxSlabForm = () => {
  const [qoutationData, setQoutationData] = useState([]);

  const commissionLoad = useSelector(
    (state) => state?.activeTabOperationReducer.commissionLoad
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

  console.log(initialList, "COMSFS78777");

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

  const getDefaultFormValue = (pax, index, queryData, qoutationData, costs) => {
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
      });
      setSlabSingleFormValue(initialFormValue);
      setIsPaxSlabSaved(true);
    } else if (initialList?.length > 0) {
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
  }, [commissionLoad, isPaxSlabSaved]);

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

  return {
    slabSingleFormValue,
  };
};

export default usePaxSlabForm;
