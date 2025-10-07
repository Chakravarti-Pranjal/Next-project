import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
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

const getLocalEscortTotal = (maxPax, localSlabData, divFact) => {
  if (!Array.isArray(localSlabData)) return 0;
  const found = localSlabData.find(
    (item) => maxPax >= item.StartPax && maxPax <= item.EndPax
  );

  const divisionFactor = divFact ? divFact : 1;
  return found ? Math.ceil(found.Total / divisionFactor) : 0;
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

  const [excortSlabData, setExcortSlabData] = useState(undefined);
  const [localSlabData, setLocalSlabData] = useState(undefined);
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
  });
  const [markupInfo, setMarkupInfo] = useState([]);
  const [gstInfo, setGstInfo] = useState([]);
  const [guidePerPaxCost, setGuidePerPaxCost] = useState([]);
  const [activityAddtionalCost, setActivityAdditionalCost] = useState([]);
  const [blockApi, setBlockApi] = useState(false);
  const [isPaxSlabSaved, setIsPaxSlabSaved] = useState(false);

  const getDefaultFormValue = (pax, index, queryData, qoutationData, costs) => {
    const dividingFactor = pax?.DividingFactor ?? 0;

    let transportType = null;
    if (Array.isArray(vehicleList)) {
      if (dividingFactor <= 3) {
        const innova = vehicleList?.find(
          (i) => i.label.trim() === "AC Innova Crysta"
        );
        transportType = innova?.value ?? null;
      } else if (dividingFactor <= 5) {
        const innova = vehicleList?.find(
          (i) => i.label.trim() === "AC Innova Crysta"
        );
        transportType = innova?.value ?? null;
      } else if (dividingFactor <= 10) {
        const tempo = vehicleList?.find(
          (i) => i.label.trim() === "AC Tempo Traveler"
        );
        transportType = tempo?.value ?? null;
      } else if (dividingFactor <= 20) {
        const miniCoach = vehicleList?.find(
          (i) => i.label.trim() === "AC Mini Coach - (18-21 Seater)"
        );
        transportType = miniCoach?.value ?? null;
      } else if (dividingFactor <= 50) {
        const largeCoach = vehicleList?.find(
          (i) => i.label.trim() === "AC Large Coach - (45 Seater)"
        );
        transportType = largeCoach?.value ?? null;
      } else if (dividingFactor <= 100) {
        const largeCoach = vehicleList?.find(
          (i) => i.label.trim() === "AC Large Coach - (45 Seater)"
        );
        transportType = largeCoach?.value ?? null;
      } else {
        const matchedVehicle = vehicleList.find((vehicle) => {
          const capacity = parseInt(vehicle.capacity, 10);
          return dividingFactor <= capacity;
        });
        transportType = matchedVehicle?.value ?? null;
      }
    }

    const maxPax = parseInt(pax?.Max) || 0;
    const foc =
      Array.isArray(excortSlabData) && excortSlabData[index]?.Foc != null
        ? parseInt(excortSlabData[index].Foc)
        : 0;

    let NoOfVehicle = "";
    if (transportType) {
      const selectedVehicle = vehicleList.find(
        (v) => String(v.value) === String(transportType)
      );
      NoOfVehicle = Math.ceil(
        (maxPax + foc) / (selectedVehicle?.capacity || 1)
      );
    }

    const transportCost =
      costs.transport.find((data) => Number(data.id) === Number(transportType))
        ?.TotalServiceCost || 0;

    const calculatedCost =
      dividingFactor > 0
        ? Math.ceil(
            (transportCost * (parseInt(NoOfVehicle) || 0)) / dividingFactor
          )
        : 0;

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
      ForeignerEscort: costs.excortSlabData || [],
      LocalEscort: costs.localSlabData || [],
      TopMargin: "",
      IGST: "",
      Air: Math.ceil(costs.fligthCost || 0),
      Nett: "",
      Total: "0",
      Foc: foc,
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
      const markup = markupInfo.find(
        (item) => item.Type === typeMapping[field]
      );

      const value =
        parseFloat(
          field === "LocalEscort"
            ? slab[field]?.[0]?.Total
            : field === "ForeignerEscort"
            ? excortSlabData?.[slabSingleFormValue.indexOf(slab)]
                ?.TotalPerPerson
            : slab[field]
        ) || 0;

      if (markup && markup.Markup === "%") {
        const margin = (value * parseFloat(markup.Value)) / 100;
        totalMargin += margin;
      }
    });

    return Math.ceil(totalMargin);
  };

  const calculateNett = (slab, calculatedTransportCost) => {
    return Math.ceil(
      [
        parseFloat(slab.Hotel) || 0,
        parseFloat(slab.Guide) || 0,
        parseFloat(slab.MFees) || 0,
        parseFloat(slab.Misc) || 0,
        parseFloat(slab.Meal) || 0,
        parseFloat(slab.Activity) || 0,
        parseFloat(calculatedTransportCost) || 0,
        parseFloat(slab.Train) / (parseFloat(slab.DividingFactor) || 1) || 0,
        parseFloat(slab.LocalEscort?.[0]?.Total) || 0,
        parseFloat(
          slab.ForeignerEscort?.[0]?.Total ||
            excortSlabData?.[slabSingleFormValue.indexOf(slab)]
              ?.TotalPerPerson ||
            0
        ),
      ].reduce((a, b) => a + b, 0)
    );
  };

  useEffect(() => {
    if (qoutationData?.PaxSlab?.length > 0) {
      const initialFormValue = qoutationData?.PaxSlab?.map((pax, index) => {
        const formValue = setFormValueFromDB(pax, index, activityAddtionalCost);
        const transportCost =
          costs.transport.find((data) => data.id === formValue.TransportType)
            ?.TotalServiceCost || 0;
        const supplimentTransportCost =
          costs.transport.find(
            (data) => data.id === formValue.SupplimentTransferType
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
          Train: Math.ceil(formValue.Train / (formValue.DividingFactor || 1)),
          LocalEscort: formValue.LocalEscort?.length
            ? [{ Total: Math.ceil(formValue.LocalEscort[0].Total) }]
            : [],
          ForeignerEscort: formValue.ForeignerEscort?.length
            ? [{ Total: Math.ceil(formValue.ForeignerEscort[0].Total) }]
            : [],
          TopMargin: Math.ceil(calculateMargins(formValue)),
          Nett: nettValue,
          IGST: Math.ceil(nettValue * (gstInfo?.Gst / 100) || 0),
          Air: Math.ceil(formValue.Air || 0),
        };
      });
      setSlabSingleFormValue(initialFormValue);
      setIsPaxSlabSaved(true);
    } else {
      const initialFormValue = initialList.map((pax, index) => {
        const formValue = getDefaultFormValue(
          pax,
          index,
          queryData,
          qoutationData,
          costs
        );
        const transportCost =
          costs.transport.find((data) => data.id === formValue.TransportType)
            ?.TotalServiceCost || 0;
        const supplimentTransportCost =
          costs.transport.find(
            (data) => data.id === formValue.SupplimentTransferType
          )?.TotalServiceCost || 0;
        const CalculatedCost =
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
        const nettValue = calculateNett(
          { ...formValue, Guide: guideTotal },
          CalculatedCost
        );
        return {
          ...formValue,
          Activity: Math.ceil(
            activityAddtionalCost?.[index]?.activityCost ?? formValue.Activity
          ),
          Misc: Math.ceil(
            activityAddtionalCost?.[index]?.additionalCost ?? formValue.Misc
          ),
          Guide: Math.ceil(guideTotal),
          TopMargin: Math.ceil(
            calculateMargins({
              ...formValue,
              Guide: guideTotal,
            })
          ),
          Nett: nettValue,
          IGST: Math.ceil(nettValue * (gstInfo?.Gst / 100) || 0),
          Air: Math.ceil(formValue.Air || 0),
        };
      });
      const singleFactor = {
        factorInd: 0,
        factor: initialList[0]?.DividingFactor || 1,
        transType: payloadQueryData?.Prefrences?.VehiclePreference || "",
      };
      const singleTransportId = {
        id: payloadQueryData?.Prefrences?.VehiclePreference || "",
        transIndex: 0,
      };
      const singleVehicle = { value: "", index: 0 };

      setSlabSingleFormValue(initialFormValue);
      setSingleDividingFactor([singleFactor]);
      setTransportId([singleTransportId]);
      setSingleVehicleNo([singleVehicle]);
      setIsPaxSlabSaved(false);
    }
  }, [
    initialList,
    qoutationData,
    costs,
    markupInfo,
    excortSlabData,
    gstInfo,
    guidePerPaxCost,
    activityAddtionalCost,
  ]);

  const getActivityAdditionalDataFromApi = async (list, index) => {
    // if (blockApi && !isPaxSlabSaved) return;
    try {
      const { data } = await axiosOther.post("activitycalculation", {
        QueryId: queryAndQuotationNo?.QueryID,
        QuotationNumber: queryAndQuotationNo?.QoutationNum,
        MaxPax: list?.Max,
        DivisionFactor: list?.DividingFactor,
      });

      if (data?.Status === 1) {
        setBlockApi(true);
        setActivityAdditionalCost((prev) => {
          const newCosts = [...prev];
          newCosts[index] = {
            activityCost: Math.ceil(data?.finalActivityAmount),
            additionalCost: Math.ceil(data?.finalAdditionalAmount),
          };
          return newCosts;
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

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
        if (quotationResponse.data?.data[0]?.ExcortDays) {
          setExcortSlabData(
            quotationResponse.data?.data[0].ExcortDays[1]?.ExcortSlabCost
          );
          setLocalSlabData(
            quotationResponse.data?.data[0].ExcortDays[0]?.FeeCharges
          );
        }
        if (quotationResponse.data?.data[0]?.Markup?.Markup?.Data.length > 0) {
          setMarkupInfo(quotationResponse.data?.data[0]?.Markup?.Markup?.Data);
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
            (service) => service.ServiceType === "Guide"
          );
          setGuidePerPaxCost(guidePerPax?.TotalCosting);
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
          services?.find((service) => service.ServiceType === type);

        const hotel = getService("Hotel");
        const transport = getService("Transport");
        const restaurant = getService("Restaurant");
        const monument = getService("Monument");

        const train = listQueryQuotationData
          .flatMap((day) => day.DayServices)
          .filter((service) => service.ServiceType === "Train");
        const flight = listQueryQuotationData
          .flatMap((day) => day.DayServices)
          .filter((service) => service.ServiceType === "Flight");
        const activity = listQueryQuotationData
          .flatMap((day) => day.DayServices)
          .filter((service) => service.ServiceType === "Activity");

        const totalActivityCostSum = activity.reduce((sum, item) => {
          return sum + (parseFloat(item.TotalCosting?.ActivityCost) || 0);
        }, 0);

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
                (service.ServiceType === "Additional" &&
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
              if (service.ServiceType === "Restaurant") {
                service.TotalCosting.forEach((cost) => {
                  totalServiceCost += parseFloat(cost.ServiceCost);
                });
              }
            });
          });

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
          trainCost: Math.ceil(
            train[0]?.TotalCosting?.TotalAdultServiceCost || 0
          ),
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
        if (idx === index) {
          let updatedItem = { ...item };

          if (name === "Max" || name === "DividingFactor") {
            const newMaxPax = name === "Max" ? Number(value) : Number(item.Max);
            const newDivFact =
              name === "DividingFactor"
                ? Number(value)
                : Number(item.DividingFactor);
            const escortTotal = getLocalEscortTotal(
              newMaxPax,
              localSlabData,
              newDivFact
            );
            const guideTotal = getGuideTotal(
              newMaxPax,
              guidePerPaxCost,
              newDivFact
            );
            updatedItem = {
              ...updatedItem,
              [name]: value,
              LocalEscort: [{ Total: escortTotal }],
              Guide: guideTotal,
            };
            if (!isPaxSlabSaved) {
              getActivityAdditionalDataFromApi(
                { Max: newMaxPax, DividingFactor: newDivFact },
                index
              );
            }
          } else if (name === "LocalEscort") {
            updatedItem = {
              ...updatedItem,
              LocalEscort: [{ Total: Math.ceil(parseFloat(value) || 0) }],
            };
          } else if (name === "Guide") {
            updatedItem = {
              ...updatedItem,
              Guide: Math.ceil(parseFloat(value) || 0),
            };
          } else if (name === "ForeignerEscort") {
            updatedItem = {
              ...updatedItem,
              ForeignerEscort: [{ Total: Math.ceil(parseFloat(value) || 0) }],
            };
          } else if (name === "Transport") {
            updatedItem = {
              ...updatedItem,
              Transport: Math.ceil(parseFloat(value) || 0),
            };
          } else if (name === "Activity") {
            updatedItem = {
              ...updatedItem,
              Activity: Math.ceil(parseFloat(value) || 0),
            };
            setActivityAdditionalCost((prev) =>
              prev.map((cost, i) =>
                i === index
                  ? { ...cost, activityCost: Math.ceil(parseFloat(value) || 0) }
                  : cost
              )
            );
          } else if (name === "Misc") {
            updatedItem = {
              ...updatedItem,
              Misc: Math.ceil(parseFloat(value) || 0),
            };
            setActivityAdditionalCost((prev) =>
              prev.map((cost, i) =>
                i === index
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

          if (["TransportType", "Max"].includes(name)) {
            const selectedVehicleId =
              name === "TransportType" ? value : updatedItem.TransportType;

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
                (v) => String(v.value) === String(selectedVehicleId)
              );
              updatedItem.NoOfVehicle = Math.ceil(
                (maxPax + foc) / (selectedVehicle?.capacity || 1)
              );
            }
          }

          if (["SupplimentTransferType", "Max"].includes(name)) {
            const selectedSupplimentVehicleId =
              name === "SupplimentTransferType"
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
                (v) => String(v.value) === String(selectedSupplimentVehicleId)
              );
              updatedItem.SupplimentNoOfVehicle = Math.ceil(
                (maxPax + foc) / (supplimentVehicle?.capacity || 1)
              );
            }
          }

          const transportCost =
            costs.transport.find(
              (data) => data.id === updatedItem.TransportType
            )?.TotalServiceCost || 0;
          const supplimentTransportCost =
            costs.transport.find(
              (data) => data.id === updatedItem.SupplimentTransferType
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

    if (name === "TransportType") {
      setTransportId((prev) =>
        prev.map((item, idx) =>
          idx === index ? { id: value, transIndex: index } : item
        )
      );
    }
    if (name === "NoOfVehicle") {
      setSingleVehicleNo((prev) =>
        prev.map((item, idx) => (idx === index ? { value, index } : item))
      );
    }
  };

  const handleIncrementTable = (index) => {
    const newItem = { ...slabSingleFormValue[index] };
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
  };

  const handleDecrementTable = (index) => {
    setSlabSingleFormValue((prev) => prev.filter((_, idx) => idx !== index));
    setSingleDividingFactor((prev) => prev.filter((_, idx) => idx !== index));
    setSingleVehicleNo((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async () => {
    const singleSlabPayload = slabSingleFormValue.map((row, idx) => {
      const lacalData = getLocalEscortTotal(
        row.Max,
        localSlabData,
        row.DividingFactor
      );
      const guideData = getGuideTotal(
        row.Max,
        guidePerPaxCost,
        row.DividingFactor
      );

      const transportCost =
        costs.transport.find((data) => data.id === row.TransportType)
          ?.TotalServiceCost || 0;
      const supplimentTransportCost =
        costs.transport.find((data) => data.id === row.SupplimentTransferType)
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
          vehicleList.find((v) => String(v.value) === String(row.TransportType))
            ?.label ?? "",
        SupplimentTransferType: row.SupplimentTransferType ?? "",
        SupplimentTransferTypeName:
          vehicleList.find(
            (v) => String(v.value) === String(row.SupplimentTransferType)
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
        Guide: Math.ceil(row.Guide ?? guideData ?? 0),
        LocalEscort: Math.ceil(row.LocalEscort?.[0]?.Total ?? lacalData ?? 0),
        ForeignerEscort: Math.ceil(
          parseFloat(
            row.ForeignerEscort?.[0]?.Total ||
              excortSlabData?.[idx]?.TotalPerPerson
          ) / (parseFloat(row.DividingFactor) || 1) || 0
        ),
        Nett: nettValue,
        TopMargin: Math.ceil(row.TopMargin ?? 0),
        IGST: Math.ceil(nettValue * (gstInfo?.Gst / 100) || 0),
        Train: Math.ceil(row.Train ?? 0),
        Total: Math.ceil(
          nettValue +
            (parseFloat(row.TopMargin) || 0) +
            parseFloat(nettValue * (gstInfo?.Gst / 100) || 0) +
            (parseFloat(row.Air) || 0)
        ),
        Air: Math.ceil(row.Air ?? 0),
      };
    });

    try {
      const { data } = await axiosOther.post(
        "store-paxSlabData",
        singleSlabPayload
      );
      if (data?.status === 1 || data?.Status === 1) {
        notifySuccess(data?.message || data?.Message);
        setIsPaxSlabSaved(true);
        setActivityAdditionalCost(
          singleSlabPayload.map((row) => ({
            activityCost: row.Activity,
            additionalCost: row.Misc,
          }))
        );
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
    const paxDetails = initialList[index];

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

      const exportButton2 = document.createElement("button");
      exportButton2.innerText = "Export";
      Object.assign(exportButton2.style, {
        padding: "0.3125rem 1.25rem",
        fontSize: "1rem",
        color: "white",
        backgroundColor: "#28a745",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginLeft: "auto",
        marginRight: "7rem",
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
      exportButtonPdf.onclick = () => exportTemplatePdf(templateUrl);
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
    const exportTemplatePdf = async (templateUrl) => {
      try {
        const response = await axiosOther.post("createViewPdf", {
          url: templateUrl,
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

        if (status === 1 && download_url) {
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
      costs.transport.find((data) => data.id === slab.TransportType)
        ?.TotalServiceCost || 0;
    const supplimentTransportCost =
      costs.transport.find((data) => data.id === slab.SupplimentTransferType)
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
    const foreignerEscortFinalCost = Math.ceil(
      parseFloat(
        slab.ForeignerEscort?.[0]?.Total ||
          excortSlabData?.[index]?.TotalPerPerson
      ) / (parseFloat(slab.DividingFactor) || 1) || 0
    );

    const nettValue = calculateNett(slab, calculatedCost);
    const igstValue = Math.ceil(nettValue * (gstInfo?.Gst / 100) || 0);
    const totalValue = Math.ceil(
      nettValue +
        (parseFloat(slab.TopMargin) || 0) +
        parseFloat(igstValue) +
        (parseFloat(slab.Air) || 0)
    );

    const activitySlabCost = activityAddtionalCost[index]?.activityCost;
    const additionalSlabCost = activityAddtionalCost[index]?.additionalCost;

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
            className="formControl1 width50px"
            value={slab.Min}
            onChange={(e) => handleFormChange(e, index)}
            style={{ fontSize: "0.7rem" }}
          />
        </td>
        <td>
          <input
            type="number"
            name="Max"
            className="formControl1 width50px"
            value={slab.Max}
            onChange={(e) => handleFormChange(e, index)}
            style={{ fontSize: "0.7rem" }}
          />
        </td>
        <td>
          <input
            type="number"
            name="Foc"
            className="formControl1 width50px"
            value={slab.Foc ? slab.Foc : excortSlabData?.[index]?.Foc}
            onChange={(e) => handleFormChange(e, index)}
            style={{ fontSize: "0.7rem" }}
          />
        </td>
        <td>
          <input
            type="number"
            name="DividingFactor"
            className="formControl1 width50px"
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
              service?.ServiceType === "Transport" &&
              service?.ServiceMainType === "Transport Suppliment"
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
            value={Math.ceil(slab.Hotel || 0)}
            onChange={(e) => {
              const input = e.target.value;
              handleFormChange(
                {
                  target: {
                    name: "Hotel",
                    value: input ? parseFloat(input) * 2 : "",
                  },
                },
                index
              );
            }}
          />
        </td>
        <td>
          <input
            type="number"
            className="formControl1 width50px"
            name="Meal"
            value={Math.ceil(slab.Meal || 0)}
            onChange={(e) => {
              const input = e.target.value;
              handleFormChange(
                {
                  target: {
                    name: "Meal",
                    value: input ? parseFloat(input) * 2 : "",
                  },
                },
                index
              );
            }}
          />
        </td>
        <td>
          <input
            type="number"
            className="formControl1 width50px"
            name="Activity"
            value={Math.ceil(
              activitySlabCost !== undefined
                ? activitySlabCost
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
              additionalSlabCost !== undefined
                ? additionalSlabCost
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
            value={Math.ceil(slab.MFees || 0)}
            onChange={(e) => {
              const input = e.target.value;
              handleFormChange(
                {
                  target: {
                    name: "MFees",
                    value: input ? parseFloat(input) * 2 : "",
                  },
                },
                index
              );
            }}
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
        <td>
          <input
            type="number"
            className="formControl1 width50px"
            name="Train"
            value={Math.ceil(
              slab.Train ? slab.Train / (slab.DividingFactor || 1) : 0
            )}
            onChange={(e) => {
              const input = e.target.value;
              handleFormChange(
                {
                  target: {
                    name: "Train",
                    value: input
                      ? parseFloat(input) * (slab.DividingFactor || 1)
                      : "",
                  },
                },
                index
              );
            }}
          />
        </td>
        <td>
          <input
            type="number"
            className="formControl1 width50px"
            name="LocalEscort"
            value={Math.ceil(
              slab.LocalEscort?.[0]?.Total !== undefined &&
                slab.LocalEscort[0].Total !== ""
                ? slab.LocalEscort[0].Total
                : getLocalEscortTotal(
                    Number(slab.Max),
                    localSlabData,
                    slab.DividingFactor
                  )
            )}
            onChange={(e) => handleFormChange(e, index)}
          />
        </td>
        <td>
          <input
            type="number"
            className="formControl1 width50px"
            name="ForeignerEscort"
            value={Math.ceil(
              slab.ForeignerEscort?.[0]?.Total !== undefined &&
                slab.ForeignerEscort[0].Total !== ""
                ? slab.ForeignerEscort[0].Total
                : foreignerEscortFinalCost
            )}
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
            name="Total"
            value={totalValue}
            readOnly
          />
        </td>
        <td>
          <input
            type="number"
            className="formControl1 width50px"
            name="Air"
            value={Math.ceil(slab.Air || 0)}
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
        <div className="d-flex justify-content-between align-items-center flex-wrap  my-1 border-1 col-lg-2 col-xs-2">
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
              <th>Div Fact</th>
              <th>Trans Type</th>
              <th>No.of Vehicle</th>
              {qoutationData?.Days?.some((day) =>
                day?.DayServices?.some(
                  (service) =>
                    service?.ServiceType === "Transport" &&
                    service?.ServiceMainType === "Transport Suppliment"
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
              <th>GST</th>
              <th>Total</th>
              <th>Air</th>
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
          className="btn btn-primary py-1 px-2 radius-4"
          onClick={handleSubmit}
        >
          <i className="fa-solid fa-floppy-disk fs-4" />
        </button>
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
                      marginLeft: idx % 2 === 0 ? "20px" : "10px",
                    }}
                    type="number"
                  />
                  {idx % 2 === 0 && idx < 8 && (
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
                    marginLeft: idx === 0 ? "10px" : "16px",
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
