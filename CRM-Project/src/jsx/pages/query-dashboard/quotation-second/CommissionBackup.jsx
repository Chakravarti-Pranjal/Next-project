import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { axiosOther } from "../../../../http/axios_base_url";
import Select from "react-select";
import { useSelector } from "react-redux";
import { quotationIntialValue } from "./qoutation_initial_value";
import { Row, Card, Col, Button, Modal, Container } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeContext } from "../../../../context/ThemeContext";
import { select_customStyles } from "../../../../css/custom_style";
import { color } from "highcharts";
import { notifyError, notifySuccess } from "../../../../helper/notify";
import { quotationData } from "../qoutation-first/quotationdata";
import {
  customStylesForAuto,
  customStylesForhotel,
} from "../../supplierCommunication/SupplierConfirmation/customStyle";

const notifyTopCenter = (message) => {
  toast.success(`${message}`, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

const customStyles = {
  control: (provided) => ({
    width: "auto",
    minHeight: "20px",
    height: "20px",
    padding: "0px",
    border: "none",
    background: "#2e2e40",
    color: "white",
    textalign: "center",
    borderRadius: "0.5rem",
    "&:hover": {
      border: "1px solid #aaa",
      background: "#2e2e40",
    },
  }),
  valueContainer: (provided) => ({
    padding: "0px",
    paddingLeft: "4px",
    height: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  }),
  placeholder: (provided) => ({
    margin: "0",
    fontSize: "0.76562rem",
    textAlign: "center",
    flex: 1,
    color: "#6e6e6e",
  }),
  singleValue: (provided) => ({
    margin: "0",
    fontSize: "0.76562rem",
    textAlign: "center",
  }),
  dropdownIndicator: (provided) => ({
    display: "none",
  }),
  option: (provided) => ({
    ...provided,
    padding: "0px",
    fontSize: "0.76562rem",
    overflow: "hidden",
    paddingLeft: "4px",
    color: "black",
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
    overflowY: "hidden",
    overflowX: "hidden",
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: "150px",
    overflowY: "auto",
    "&::-webkit-scrollbar": {
      display: "none",
      width: "2px",
    },
  }),
};

const Commission = ({ onNext, onBack }) => {
  const [serviceMarkupArray, setServiceMarkupArray] = useState([]);
  const { background } = useContext(ThemeContext);
  const [formValue, setFormValue] = useState(quotationIntialValue);
  const [mealList, setMealList] = useState([]);
  const [currencyList, setCurrencyList] = useState([]);
  const [meal, setMeal] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [currencyId, setCurrencyId] = useState("");
  const [markupArray, setMarkupArray] = useState({
    Markup: { MarkupType: "Service Wise", Data: [] },
  });

  const [gstTax, setGstTax] = useState([]);
  const { queryData, policyData } = useSelector((data) => data?.queryReducer);
  const { payloadQueryData } = useSelector((state) => state?.queryReducer);

  const { summaryIncAndExc, summaryVisa, SubjectProgramName } = useSelector(
    (data) => data?.queryReducer
  );
  console.log(policyData, "policyData");

  console.log(markupArray, "markupArray");
  /////////////////////////////////////// paxlab data /////////////////////////////////////////////////
  //////////////////////////////////////  paxlab data /////////////////////////////////////////////////
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
  const [qoutationData, setQoutationData] = useState([]);
  // const { queryData, payloadQueryData } = useSelector(
  //   (state) => state?.queryReducer
  // );
  const commissionLoad = useSelector(
    (state) => state?.activeTabOperationReducer.commissionLoad
  );
  console.log(commissionLoad, "commissionLoad");

  const paxSlabType = useSelector((state) => state?.queryReducer.qoutationData);
  console.log(qoutationData, "paxSlabTypecheckthis");

  const hotelprice = useSelector((state) => state?.priceReducer);
  const { PaxSlab, TourSummary } = qoutationData;

  const queryAndQuotationNo = JSON.parse(
    localStorage.getItem("Query_Qoutation")
  );
  console.log(queryAndQuotationNo, "queryAndQuotationNo");

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
            ? slab[field]?.[0]?.Total
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
        parseFloat(slab.ForeignerEscort?.[0]?.Total) || 0,
      ].reduce((a, b) => a + b, 0)
    );
  };
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
  // console.log(initialList,"initialList");

  useEffect(() => {
    console.log("This useffect call");

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
      const localEscortTotal = getLocalEscortTotal(
        parseInt(formValue.Max) || 0,
        localSlabData,
        formValue.DividingFactor
      );
      const nettValue = calculateNett(
        {
          ...formValue,
          Guide: guideTotal,
          LocalEscort: [{ Total: localEscortTotal }],
        },
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
        LocalEscort: [{ Total: localEscortTotal }],
        ForeignerEscort: [{ Total: 0 }],
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
    console.log(initialFormValue, "initialFormValue");

    setSlabSingleFormValue(initialFormValue);
    setSingleDividingFactor([singleFactor]);
    setTransportId([singleTransportId]);
    setSingleVehicleNo([singleVehicle]);
    setIsPaxSlabSaved(false);
  }, [
    initialList,
    qoutationData,
    costs,
    markupInfo,
    excortSlabData,
    localSlabData,
    gstInfo,
    guidePerPaxCost,
    activityAddtionalCost,
  ]);
  const getDefaultFormValue = (pax, index, queryData, qoutationData, costs) => {
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

      const exact = sorted.find((v) => v.capacity === requiredCapacity);
      if (exact) return exact;

      const higher = sorted.find((v) => v.capacity > requiredCapacity);
      return higher || null;
    };

    let vehicleListObject = getVehicleByCapacity(vehicleList, totoalPaxFoc);
    transportType = vehicleListObject?.value;

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
      ForeignerEscort: [], // Initialize empty, to be set by API or user input
      LocalEscort: [], // Initialize empty, to be set by API or user input
      TopMargin: "",
      IGST: "",
      Air: Math.ceil(costs.fligthCost || 0),
      Nett: "",
      Total: "0",
      Foc: foc,
    };
  };
  const getActivityAdditionalDataFromApi = async (list, index) => {
    if (blockApi && !isPaxSlabSaved) return;
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
  console.log(
    paxSlabType?.TourSummary?.PaxTypeName,
    queryAndQuotationNo?.QueryID,
    queryAndQuotationNo?.QoutationNum,
    isPaxSlabSaved,
    getActivityAdditionalDataFromApi,
    "checkkkusefffect"
  );

  useEffect(() => {
    console.log("this useffect runs:");

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
  }, [
    commissionLoad,
    // paxSlabType?.TourSummary?.PaxTypeName,
    // queryAndQuotationNo?.QueryID,
    // queryAndQuotationNo?.QoutationNum,
    // isPaxSlabSaved,
    // getActivityAdditionalDataFromApi
  ]);

  // console.log(listQueryQuotationData,"listQueryQuotationData2")

  useEffect(() => {
    console.log(listQueryQuotationData, "listQueryQuotationData");

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
  // console.log(listQueryQuotationData,"listQueryQuotationData")

  // const handleSubmit = async () => {

  // };
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
  };
  //////////////////////////////////////  paxlab data /////////////////////////////////////////////////
  //////////////////////////////////////  paxlab data /////////////////////////////////////////////////

  const dropdownArray = [
    { id: "Percentage", name: "%" },
    { id: "Flat", name: "Flat" },
  ];

  const dropdownMarkupArray = [
    { id: "Percentage", name: "%" },
    { id: "Flat", name: "FlatPP" },
  ];

  const dropdownFlight = [
    { id: "1", name: "Supplement Cost" },
    { id: "2", name: "Package Cost" },
  ];

  const dropdownTCS = [
    { id: "1", name: "Inclusive (0)" },
    { id: "2", name: "GST5 (7)" },
  ];

  const dropdownGSTType = [
    { id: "1", name: "Same State" },
    { id: "2", name: "Other State" },
  ];

  const dropdownGST = [
    { id: "1", name: "GST Inclusi. (0)" },
    { id: "2", name: "TAX-5 (5)" },
    { id: "3", name: "GST Tax (15)" },
    { id: "4", name: "TAX-18 (18)" },
  ];

  const dropdownSRS = [
    { id: "1", name: "None" },
    { id: "2", name: "Both" },
    { id: "3", name: "SRS" },
    { id: "4", name: "TRR" },
  ];

  useEffect(() => {
    if (qoutationData && Object.keys(qoutationData).length > 0) {
      const GstType = qoutationData?.OthersInfo?.GstType;
      const Gst = qoutationData?.OthersInfo?.Gst;
      const TCS = qoutationData?.OthersInfo?.TCS;
      const DiscountType = qoutationData?.OthersInfo?.DiscountType;
      const Discount = qoutationData?.OthersInfo?.Discount;
      const SrsandTrr = qoutationData?.OthersInfo?.SrsandTrr;
      const CurrencyId =
        qoutationData?.CurrencyId || qoutationData?.OthersInfo?.CurrencyId;
      const ROE =
        qoutationData?.ConversionValue || qoutationData?.OthersInfo?.ROE;
      const MarkupType = qoutationData?.Markup?.Markup?.MarkupType;
      const Data = qoutationData?.Markup?.Markup?.Data || [];

      setCurrencyId(String(CurrencyId));

      console.log(Data, "MarkupType");

      setFormValue((formValue) => ({
        ...formValue,
        SupplimentSelection: {
          ...formValue.SupplimentSelection,
          FlightCost: qoutationData?.SupplimentSelection?.FlightCost,
          TourEscort: qoutationData?.SupplimentSelection?.TourEscort,
          ClientCommision: qoutationData?.SupplimentSelection?.ClientCommision,
        },
        OthersInfo: {
          ...formValue.OthersInfo,
          GstType: GstType,
          Gst: Gst,
          TCS: TCS,
          DiscountType: DiscountType,
          Discount: Discount,
          SrsandTrr: SrsandTrr,
          CurrencyId: CurrencyId,
          ROE: ROE,
        },
        Markup: {
          ...formValue.Markup,
          MarkupType: MarkupType || "Service Wise",
        },
      }));
      // Set markupArray state with API data
      setMarkupArray({
        Markup: {
          MarkupType: MarkupType || "Service Wise",
          Data: Data,
        },
      });
    }
  }, [qoutationData]);

  useEffect(() => {
    if (policyData?.length > 0) {
      setFormValue((prevFormValue) => ({
        ...prevFormValue,
        FitId: policyData?.fit[0]?.id,
        OverviewId: policyData?.overviewId,
        OverviewIncExcTc: {
          TourHeighligts: policyData?.overView[0]?.Highlights,
          Overview: policyData?.overView[0]?.OverviewName,
          ItineraryIntroduction: policyData?.overView[0]?.ItineraryIntroduction,
          ItinerarySummary: policyData?.overView[0]?.ItinerarySummary,
        },
        FitIncExc: {
          Inclusion: policyData?.fit[0]?.Exclusion,
          Exclusion: policyData?.fit[0]?.Inclusion,
          TermsNCondition: policyData?.fit[0]?.TermsCondition,
          CancellationPolicy: policyData?.fit[0]?.Cancelation,
          PaymentPolicy: policyData?.fit[0]?.PaymentPolicy,
          Remarks: policyData?.fit[0]?.Remarks,
        },
      }));
    }
  }, [policyData]);

  // console.log(currencyId, "setCurrencyId");

  const mealOptions = mealList?.map((item) => ({
    value: item.id,
    label: item.Name,
  }));
  const currencyOptions = currencyList.map((item) => ({
    // value: item.CountryId,
    value: String(item.id),
    label: item.CountryCode,
  }));
  // console.log(currencyOptions, "currencyList");
  // console.log(
  //   "Matching option:",
  //   currencyOptions?.find(
  //     (option) => option.value === String(qoutationData?.CurrencyId)
  //   )
  // );

  const handleSelectChange = (selectedOption, name) => {
    switch (name) {
      case "meal":
        setMeal(selectedOption.value);
        setModalOpen(true);
        break;
      case "currency":
        setFormValue({
          ...formValue,
          OthersInfo: {
            ...formValue.OthersInfo,
            CurrencyId: selectedOption.value,
            CurrencyName: selectedOption.label,
          },
        });
        setCurrencyId(selectedOption.value);
        break;
      default:
        console.log("nothing");
    }
  };

  const handleCheckboxChange = (e) => {
    const { value } = e.target;
    setFormValue({
      ...formValue,
      Markup: {
        MarkupType: value,
      },
    });
  };

  const handleChange = (e, serviceName) => {
    const { value, type } = e.target;

    setMarkupArray((prev) => {
      const prevData = prev?.Markup?.Data || [];

      const existingIndex = prevData.findIndex(
        (item) => item.Type === serviceName
      );

      const updatedData = [...prevData];

      if (existingIndex !== -1) {
        // Update existing entry
        updatedData[existingIndex] = {
          ...updatedData[existingIndex],
          [type === "number" ? "Value" : "Markup"]: value,
        };
      } else {
        // Add new entry
        updatedData.push({
          Type: serviceName,
          Markup: type === "number" ? "Percentage" : value,
          Value: type === "number" ? value : "",
        });
      }

      return {
        ...prev,
        Markup: {
          ...prev.Markup,
          Data: updatedData,
        },
      };
    });
  };

  const hanldeSupplimentSelectionChange = (e) => {
    const { name, value } = e.target;
    setFormValue({
      ...formValue,
      SupplimentSelection: {
        ...formValue.SupplimentSelection,
        [name]: value,
      },
    });
  };

  const hanldeOtherInfo = (e) => {
    const { name, value } = e.target;
    if (name === "GstType") {
      setFormValue({
        ...formValue,
        OthersInfo: {
          ...formValue.OthersInfo,
          GstType: value,
        },
      });
    } else if (name === "Gst") {
      const selectedGst = gstTax.find((item) => item.id === value);
      setFormValue({
        ...formValue,
        OthersInfo: {
          ...formValue.OthersInfo,
          Gst: value,
        },
      });
    } else {
      setFormValue({
        ...formValue,
        OthersInfo: {
          ...formValue.OthersInfo,
          [name]: value,
        },
      });
    }
  };

  const getListDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("hotelmealplanlist");
      setMealList(data?.DataList);
    } catch (error) {
      console.log("meal-error", error);
    }
    try {
      const { data } = await axiosOther.post("currencymasterlist");
      setCurrencyList(data?.DataList);
    } catch (error) {
      console.log("meal-error", error);
    }
    try {
      const { data } = await axiosOther.post("listofproductquo", {
        name: "",
        status: "",
      });
      const service = data?.Datalist?.map((srv) => ({
        id: srv.id,
        name: srv.name,
      }));
      console.log(data, "data");

      setServiceMarkupArray(service);
    } catch (error) {
      console.log("service-markup-error", error);
    }

    try {
      const { data } = await axiosOther.post("taxmasterlist", {
        Id: "",
        Search: "",
        Status: "",
        ServiceType: "20",
      });
      // console.log(data, "KUY54");
      const gstData = data?.DataList?.map((list) => {
        return {
          id: list.id,
          name: list.TaxSlabName,
          value: list.TaxValue,
        };
      });
      setGstTax(gstData);
      // console.log(gstData, "KUY54");
    } catch (error) {
      console.error(error);
    }
    try {
      let CompanyUniqueId = JSON.parse(
        localStorage.getItem("token")
      )?.companyKey;
      const { data } = await axiosOther.post("listCompanySetting", {
        id: "",
        CompanyId: CompanyUniqueId,
        Key: "markup",
      });

      const rawData = data?.DataList?.[0]?.Value;
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

      //console.log(value, "value222");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getListDataToServer();
  }, []);

  const handleMealSubmit = async () => {
    try {
      const { data } = await axiosOther.post("updateHotelMealQuatation", {
        id: 40,
        QuatationNo: qoutationData?.QuotationNumber,
        Type: "Local",
        DayNo: "3",
        DayUniqueId: "0b1b7738-d3a5-4c2f-9906-b013f55f4cce",
        ServiceId: 2,
        ServiceType: "Hotel",
        HotelMealType: [1, 2, 3],
      });
      toast.error(data?.Error || data?.Error);
      if (
        data?.Status == 1 ||
        data?.status == 1 ||
        data?.result ||
        data?.Status === 200
      ) {
        notifyTopCenter(data?.Message || data?.message || data?.result);
        setModalOpen(false);
        getListDataToServer();
      }
    } catch (error) {
      toast.error(error || error);
    }
  };
  console.log(slabSingleFormValue, "slabSingleFormValue2");

  const handleSubmit = async () => {
    try {
      const { data } = await axiosOther.post("submit_quotation", {
        ...formValue,
        QueryId: queryData?.QueryAlphaNumId,
        QuotationNumber: qoutationData?.QuotationNumber,
        Markup: markupArray,
        VisaSummary: summaryVisa,
        Inclusion: summaryIncAndExc?.Inclusion,
        Exclusion: summaryIncAndExc?.Exclusion,
        SubjectProgramName: SubjectProgramName,
      });

      if (data?.status == 1 || data?.Status == 1 || data?.Success) {
        notifySuccess(data?.message || data?.Message);
        setTimeout(() => {
          onNext();
        }, 1000);
      }
    } catch (error) {
      if (error.response?.data) {
        const data = Object.entries(error.response?.data);
        notifyError(data[0][1]);
      }
      console.log("submit-error", error);
    }
    console.log(slabSingleFormValue, "slabSingleFormValue");

    const singleSlabPayload = slabSingleFormValue.map((row, idx) => {
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
            parseFloat(nettValue * (gstInfo?.Gst / 100) || 0) +
            (parseFloat(row.Air) || 0)
        ),
        Air: Math.ceil(row.Air ?? 0),
      };
    });
    // console.log(singleSlabPayload,"singleSlabPayload")

    try {
      // const { data } = await axiosOther.post(
      //   "store-paxSlabData",
      //   singleSlabPayload
      // );
      if (data?.status === 1 || data?.Status === 1) {
        // notifySuccess(data?.message || data?.Message);
        // setIsPaxSlabSaved(true);
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

  return (
    <>
      <Modal className="fade" show={modalOpen}>
        <Modal.Header>
          <Modal.Title>Update Hotel Meal Supplement Cost</Modal.Title>
          <Button
            onClick={() => setModalOpen(false)}
            variant=""
            className="btn-close"
          ></Button>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <Table responsive striped bordered>
              <thead>
                <tr>
                  <th scope="col" className="font-size-12">
                    <strong>S.No</strong>
                  </th>
                  <th scope="col" className="font-size-12">
                    <strong>Hotel</strong>
                  </th>
                  <th scope="col" className="font-size-12">
                    <strong>Destination</strong>
                  </th>
                  <th scope="col" className="font-size-12">
                    <strong>Meal</strong>
                  </th>
                  <th scope="col" className="font-size-12">
                    <strong>Currency</strong>
                  </th>
                  <th scope="col" className="font-size-12">
                    <strong>Single</strong>
                  </th>
                </tr>
              </thead>
              <tbody></tbody>
            </Table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="dark light"
            className="btn-custom-size"
            onClick={handleMealSubmit}
          >
            Save
          </Button>
          <Button
            onClick={() => setModalOpen(false)}
            variant="danger light"
            className="btn-custom-size"
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="container-fluid mt-3 m-0 p-0 commission">
        <ToastContainer />
        <div className="d-flex justify-content-end m-1 my-2 gap-1">
          <button
            className="btn btn-dark btn-custom-size"
            name="SaveButton"
            onClick={onBack}
          >
            <span className="me-1">Back</span>
            <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
          </button>
          <button
            className="btn btn-primary btn-custom-size"
            name="SaveButton"
            onClick={handleSubmit}
          >
            <span className="me-1">Submit</span>
            <i className="fa-solid fa-forward text-primary bg-white p-1 rounded"></i>
          </button>
        </div>
        <div
          className="row text-black py-1 mt-2 m-0"
          style={{ background: "var(--rgba-primary-1) !important" }}
        >
          <div className="col-12 ms-5 d-flex gap-2 font-size-12">
            <span>
              <i className="fa-solid fa-circle" style={{ color: "red" }}></i>
            </span>
            <span className="font-size-12 font-weight-bold">Add Markup</span>
          </div>
        </div>
        <div className="px-5 mt-1">
          <div className="row">
            <div className="col-12 d-flex gap-4 py-2 p-0">
              <div className="d-flex gap-2 my-2 align-items-end font-size10">
                <input
                  type="radio"
                  id="universel"
                  name="MarkupType"
                  className="form-check-input"
                  onChange={handleCheckboxChange}
                  style={{ height: "0.9rem", width: "0.9rem" }}
                  value="Universal"
                  checked={formValue?.Markup?.MarkupType === "Universal"}
                />
                <label htmlFor="universel" className="m-0">
                  Universel
                </label>
              </div>
              <div className="d-flex gap-2 my-2 align-items-end">
                <input
                  type="radio"
                  id="service"
                  name="MarkupType"
                  value="Service Wise"
                  className="form-check-input"
                  style={{ height: "0.9rem", width: "0.9rem" }}
                  onChange={handleCheckboxChange}
                  checked={formValue?.Markup?.MarkupType === "Service Wise"}
                />
                <label htmlFor="service" className="m-0">
                  Service Wise
                </label>
              </div>
            </div>
          </div>
          <div className="row row-gap-2">
            {formValue?.Markup?.MarkupType === "Universal" && (
              <div className="col-lg-3 p-xs-0">
                <div className="row">
                  <div className="col-12">
                    <table className="border table-responsive">
                      <thead>
                        <tr>
                          <th className="px-3 border-bottom text-center py-1 border-right">
                            Mark Up Type
                          </th>
                          <th className="px-1 border-bottom text-center py-1 border-right">
                            Mark Up
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="px-1 text-center py-2 border-right">
                            <select
                              name="Markup"
                              id=""
                              className="px-2 w-75 formControl1"
                              style={{ fontSize: "0.6rem" }}
                              onChange={handleChange}
                            >
                              {dropdownMarkupArray?.length > 0 &&
                                dropdownMarkupArray.map((data, index) => (
                                  <option
                                    value={data?.id}
                                    className="font-size10"
                                    key={index}
                                  >
                                    {data?.name}
                                  </option>
                                ))}
                            </select>
                          </td>
                          <td className="p-0 d-flex justify-content-center align-item-center py-2">
                            <input
                              type="number" // change to valur type
                              name="Markup"
                              className="table-input w-50 form-control form-control-sm"
                              placeholder="0"
                              onChange={handleChange}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            {console.log(markupArray, "formValue")}
            {formValue?.Markup?.MarkupType === "Service Wise" && (
              <div className="col-lg-12">
                <div className="row m-1">
                  {serviceMarkupArray.map((item, index) => {
                    const serviceData = markupArray?.Markup?.Data?.find(
                      (data) => data.Type === item.name
                    );

                    return (
                      <div className="col-4 col-sm-2 col-md-1 p-0" key={index}>
                        <table className="border table-responsive">
                          <thead>
                            <tr>
                              <th className="p-0 text-center border-bottom">
                                {item?.name}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="p-0 text-center py-2">
                                <div className="col-12 d-flex flex-column gap-1">
                                  <div>
                                    <select
                                      name={item?.name}
                                      className="px-2 w-75 formControl1"
                                      onChange={(e) =>
                                        handleChange(e, item.name)
                                      }
                                      value={
                                        serviceData?.Markup || "Percentage"
                                      } // FIXED
                                      style={{ fontSize: "0.6rem" }}
                                    >
                                      {dropdownArray?.map((data) => (
                                        <option value={data?.id} key={data.id}>
                                          {data?.name}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  <div className="d-flex justify-content-center">
                                    <input
                                      type="number"
                                      name={item?.name}
                                      className="table-input w-75 form-control form-control-sm"
                                      placeholder="0"
                                      value={serviceData?.Value || ""} // FIXED
                                      onChange={(e) =>
                                        handleChange(e, item.name)
                                      }
                                    />
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          className="py-2 mt-2"
          style={{ background: "var(--rgba-primary-1) !important" }}
        >
          <div className="row ms-5 text-black m-0 flex-wrap">
            <div className="col-md-4 col-lg-4 d-flex gap-2">
              <span>
                <i className="fa-solid fa-circle" style={{ color: "red" }}></i>
              </span>
              <span>Add Commision</span>
            </div>
          </div>
        </div>
        <div className="ms-0 mt-1">
          <div className="row mt-3 ms-5 m-0 justify-content-between">
            <div className="col-md-4 col-lg-2 p-0">
              <table className="border table-responsive">
                <thead>
                  <tr>
                    <th className="font-size-10 border-bottom text-center py-1 px-2">
                      Client Commision
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="d-flex justify-content-center py-1 px-2">
                      <input
                        type="number"
                        className="form-control form-control-sm w-75"
                        placeholder="0"
                        name="ClientCommision"
                        value={formValue?.SupplimentSelection?.ClientCommision}
                        onChange={hanldeSupplimentSelectionChange}
                      />{" "}
                      %
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div
          className="py-2 mt-2"
          style={{ background: "var(--rgba-primary-1) !important" }}
        >
          <div className="row ms-5 text-black m-0 flex-wrap">
            <div className="col-md-4 col-lg-4 d-flex gap-2">
              <span>
                <i className="fa-solid fa-circle" style={{ color: "red" }}></i>
              </span>
              <span>Supplement Selection</span>
            </div>
            <div className="col-md-4 col-lg-4 d-flex gap-2">
              <span>
                <i className="fa-solid fa-circle" style={{ color: "red" }}></i>
              </span>
              <span>Meal Supplement</span>
            </div>
          </div>
        </div>
        <div className="ms-0 mt-1">
          <div className="row mt-3 ms-5 m-0 ">
            <div className="col-md-4 col-lg-4">
              <table className="border table-responsive">
                <thead>
                  <tr>
                    <th className="font-size-10 p-0 text-center border-bottom border-right py-1 px-2">
                      Flight Cost
                    </th>
                    <th className="font-size-10 p-0 text-center border-bottom py-1 px-2">
                      Tour Escort
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-0 text-center py-1 px-2 border-right">
                      <select
                        name="FlightCost"
                        id=""
                        className="w-75 font-size10 text-center text-truncate formControl1"
                        onChange={hanldeSupplimentSelectionChange}
                        value={formValue?.SupplimentSelection?.FlightCost}
                      >
                        {dropdownFlight.map((data, index) => (
                          <option key={index} value={data?.name}>
                            {data?.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="text-center py-1 px-2">
                      <select
                        name="TourEscort"
                        id=""
                        className="w-75 font-size10 text-center text-truncate formControl1"
                        onChange={hanldeSupplimentSelectionChange}
                        value={formValue?.SupplimentSelection?.TourEscort}
                      >
                        {dropdownFlight.map((data, index) => (
                          <option key={index} value={data?.name}>
                            {data?.name}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col-md-4 col-lg-4">
              <table className="border table-responsive">
                <thead>
                  <tr>
                    <th className="font-size-10 p-0 text-center border-bottom py-1 px-4">
                      Current Meal Plan()
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-0 text-center py-1 p1-2">
                      <Select
                        name="meal"
                        id=""
                        options={mealOptions}
                        onChange={(selectedOption) =>
                          handleSelectChange(selectedOption, "meal")
                        }
                        value={mealOptions?.find(
                          (option) => option.value === meal
                        )}
                        styles={customStylesForAuto(background)}
                        className="w-75 mx-auto customSelectLightTheame"
                        classNamePrefix="custom"
                        autocomplete="off"
                      ></Select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div
          className="py-2 mt-2"
          style={{ background: "var(--rgba-primary-1) !important" }}
        >
          <div className="row ms-5 text-black m-0">
            <div className="col-4 d-flex gap-2">
              <span>
                <i className="fa-solid fa-circle" style={{ color: "red" }}></i>
              </span>
              <span>Other Information</span>
            </div>
          </div>
        </div>
        <div className="px-5 mt-1">
          <div className="row mt-3 ml-1 row-gap-2 m-0">
            <div className="col-6 col-sm-3 col-lg-2 p-0">
              <table className="border table-responsive">
                <thead>
                  <tr>
                    <th className="font-size-10 p-0 text-center border-bottom">
                      GST Type
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-0 text-center py-2 px-3">
                      <select
                        name="GstType"
                        id=""
                        className="px-1 table-select-1 w-75 text-truncate font-size10 formControl1"
                        onChange={hanldeOtherInfo}
                        value={formValue?.OthersInfo?.GstType || ""}
                      >
                        <option value="" disabled>
                          Select GST Type
                        </option>
                        {dropdownGSTType.map((data, index) => (
                          <option value={data?.id} key={data?.id}>
                            {data?.name}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col-6 col-sm-3 col-lg-1 p-0">
              <table className="border table-responsive">
                <thead>
                  <tr>
                    <th className="font-size-10 p-0 text-center border-bottom px-2">
                      GST(%)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-0 text-center py-2">
                      <select
                        name="Gst"
                        id=""
                        className="px-2 table-select-1 w-75 text-truncate font-size10 formControl1"
                        onChange={hanldeOtherInfo}
                        value={formValue?.OthersInfo?.Gst || ""}
                      >
                        <option value="" disabled>
                          Select GST
                        </option>
                        {gstTax?.map((data) => (
                          <option value={data.value} key={data.id}>
                            {data.name} ({data.value})
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col-6 col-sm-3 col-lg-1 p-0">
              <table className="border table-responsive">
                <thead>
                  <tr>
                    <th className="font-size-10 p-0 text-center border-bottom">
                      TCS(%)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-0 text-center py-2">
                      <select
                        name="TCS"
                        id=""
                        className="px-2 table-select-1 w-75 text-truncate font-size10 formControl1"
                        onChange={hanldeOtherInfo}
                        value={formValue?.OthersInfo?.TCS}
                      >
                        {dropdownTCS.map((data, index) => (
                          <option value={data?.name} key={index}>
                            {data?.name}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col-6 col-sm-3 col-lg-2 col-xl-1 p-0">
              <table className="border table-responsive">
                <thead>
                  <tr>
                    <th className="font-size-10 p-0 text-center border-bottom px-2">
                      Discount Type
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-0 text-center py-2 px-2">
                      <select
                        name="DiscountType"
                        id=""
                        className="px-2 table-select-1 text-truncate font-size10 formControl1"
                        onChange={hanldeOtherInfo}
                        value={formValue?.OthersInfo?.DiscountType}
                      >
                        {dropdownArray?.map((data, index) => (
                          <option value={data?.name} key={index}>
                            {data?.name}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col-6 col-sm-3 col-lg-1 p-0">
              <table className="border table-responsive">
                <thead>
                  <tr>
                    <th className="font-size-10 p-0 text-center px-1 border-bottom">
                      Discount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-0 text-center py-1 pb-2 pt-1 d-flex justify-content-between align-items-center ps-3">
                      <input
                        type="number" // change to valur type
                        name="Discount"
                        className="table-input-1 w-75 form-control form-control-sm"
                        style={{ height: "20px" }}
                        onChange={hanldeOtherInfo}
                        value={formValue?.OthersInfo?.Discount}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col-6 col-sm-3 col-lg-1 p-0">
              <table className="border table-responsive">
                <thead>
                  <tr>
                    <th className="font-size-10 p-0 text-center border-bottom px-4">
                      SRS & TRR
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-0 text-center py-2 px-2">
                      <select
                        name="SrsandTrr"
                        id=""
                        className="px-2 table-select-1 w-75 text-truncate font-size10 formControl1"
                        onChange={hanldeOtherInfo}
                        value={formValue?.OthersInfo?.SrsandTrr}
                      >
                        {dropdownSRS.map((data, index) => (
                          <option value={data?.name} key={index}>
                            {data?.name}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col-6 col-sm-3 col-lg-1 p-0">
              <table className="border table-responsive">
                <thead>
                  <tr>
                    <th className="font-size-10 p-0 text-center border-bottom px-4">
                      Currency
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-0 text-center py-2">
                      <Select
                        name="CurrencyId"
                        id=""
                        options={currencyOptions}
                        onChange={(selectedOption) =>
                          handleSelectChange(selectedOption, "currency")
                        }
                        value={currencyOptions?.find(
                          (option) =>
                            option.value === currencyId ||
                            option.value === formValue?.OthersInfo?.CurrencyId
                        )}
                        styles={customStylesForAuto(background)}
                        className="w-75 mx-auto customSelectLightTheame"
                        classNamePrefix="custom"
                        autocomplete="off"
                      ></Select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col-6 col-sm-3 col-lg-2">
              <table className="border table-responsive me-4">
                <thead>
                  <tr>
                    <th className="font-size-10 p-0 text-center border-bottom pt-1">
                      ROE (For 1INR)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-0 text-center py-1 pb-1 d-flex justify-content-center">
                      <input
                        type="number" // change to valur type
                        name="ROE"
                        className="table-input-1 w-75 form-control form-control-sm"
                        placeholder="0"
                        style={{ height: "20px" }}
                        onChange={hanldeOtherInfo}
                        value={formValue?.OthersInfo?.ROE}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="row mt-3 float-end">
            <div className="col d-flex gap-3">
              <button
                className="btn btn-dark btn-custom-size"
                name="SaveButton"
                onClick={onBack}
              >
                <span className="me-1">Back</span>
                <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-custom-size"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Commission;
