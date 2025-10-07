import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { axiosOther } from "../../../../../http/axios_base_url";
import { itineraryAdditionalInitialValue } from "../qoutation_initial_value";
import {
  notifyError,
  notifyHotError,
  notifyHotSuccess,
  notifySuccess,
} from "../../../../../helper/notify";
import {
  FaChevronCircleUp,
  FaChevronCircleDown,
  FaPlus,
  FaMinus,
} from "react-icons/fa";
import AdditionalIcon from "../../../../../images/itinerary/Additional.svg";
import { Modal, Row, Col, Button } from "react-bootstrap";
import {
  setTotalAdditionalPricePax,
  setMiscAdditionCost,
  setTogglePriceState,
} from "../../../../../store/actions/PriceAction";
import {
  setItineraryAdditionalData,
  setLocalItineraryAdditionalData,
  setItineraryUpGradeAdditionalData,
} from "../../../../../store/actions/itineraryDataAction";
import {
  setQoutationResponseData,
  setAdditionalFinalForm,
} from "../../../../../store/actions/queryAction";
import styles from "./index.module.css";
import { Toaster } from "react-hot-toast";
import { object } from "yup";
import {
  setItineraryCopyAdditionalFormData,
  setItineraryCopyAdditionalFormDataCheckbox,
} from "../../../../../store/actions/itineraryServiceCopyAction/itineraryServiceCopyAction";
import AdditionalUpgrade from "./Upgrade";
import moment from "moment";

// Utility function to generate a unique ID (if uuid library is not available)
const generateUniqueId = () => {
  return `service-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const Additional = ({ Type }) => {
  const { qoutationData, queryData, isItineraryEditing } = useSelector(
    (data) => data?.queryReducer
  );

  const additionalFormData = useSelector(
    (state) => state.itineraryReducer.additionalFormData
  );
  const [originalAdditionalForm, setOriginalAdditionalForm] = useState([]);
  const [additionaFormValue, setAdditionalFormValue] = useState([]);
  const [copyChecked, setCopyChecked] = useState(false);
  const [backupAdditionalForms, setBackupAdditionalForms] = useState([]);
  const [additionalPrice, setAdditionalPrice] = useState([]);
  const [additionalList, setAdditionaList] = useState([]);

  const [rowsPerIndex, setRowsPerIndex] = useState({});

  const [totalAmount, setTotalAmount] = useState(0);
  const [dayWiseTotals, setDayWiseTotals] = useState({});

  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isHoveredDetails, setIsHoveredDetails] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [additionalCopy, setAdditionalCopy] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hikePercent, setHikePercent] = useState(0);
  const [destinationList, setDestinationList] = useState([]);
  const [originalRowsPerIndex, setOriginalRowsPerIndex] = useState({});
  const [paxFormValue, setPaxFormValue] = useState({
    Adults: "",
    Child: "",
    Infant: "",
  });
  const [modalCentered, setModalCentered] = useState({
    modalIndex: "",
    isShow: false,
  });
  const [additionalPriceCalculation, setAdditionalPriceCalculation] = useState({
    Price: {
      Adult: "",
      Child: "",
    },
    Markup: {
      Adult: "",
      Child: "",
    },
    MarkupOfCost: {
      Adult: "",
      Child: "",
    },
  });
  const [fromToDestinationList, setFromToDestinationList] = useState([]);
  const dispatch = useDispatch();

  const [dataIsLoaded, setDataIsLoaded] = useState(true);
  const apiDataLoad = useSelector(
    (state) => state.inineraryServiceDataLoadReducer.additional
  );

  const [markupArray, setMarkupArray] = useState({
    Markup: { Data: [] },
  });
  const AdditionalData = markupArray?.Markup?.Data?.find(
    (item) => item.Type === "Additional"
  );

  useEffect(() => {
    if (Type === "Main") {
      dispatch(setItineraryAdditionalData(additionaFormValue));
    } else {
      dispatch(setLocalItineraryAdditionalData(additionaFormValue));
    }
  }, [additionaFormValue]);

  useEffect(() => {
    if (qoutationData?.Days) {
      const hasTrainService = qoutationData?.Days.some((day) =>
        day?.DayServices?.some(
          (service) => service.ServiceType === "Additional"
        )
      );

      if (hasTrainService) {
        const initialFormValue = qoutationData?.Days?.flatMap((day, index) => {
          const services =
            day?.DayServices?.filter(
              (service) =>
                service?.ServiceType === "Additional" &&
                service.ServiceMainType === "Guest"
            ) || [];

          return services.map((service) => {
            const { ItemUnitCost, TimingDetails, ItemSupplierDetail } =
              service?.ServiceDetails?.flat(1)[0] || {};

            if (service?.DestinationId) {
              service.DestinationId = parseInt(service.DestinationId);
            }

            return {
              id: queryData?.QueryId,
              QuatationNo: qoutationData?.QuotationNumber,
              DayType: Type,
              DayNo: day.Day,
              Date: day?.Date,
              Destination: service?.DestinationId,
              DestinationUniqueId: day?.DestinationUniqueId,
              DayUniqueId: day?.DayUniqueId,
              Escort: 1,
              ServiceId: service?.ServiceId || "",
              CostType: service?.CostType || "Per Person",
              PaxUpTo: service?.PaxUpto,
              AdultCost: ItemUnitCost?.AdultCost,
              ChildCost: ItemUnitCost?.ChildCost,
              ServiceMainType: "No",
              Suppliment: "No",
              ItemFromDate: TimingDetails?.ItemFromDate,
              ItemToDate: TimingDetails?.ItemToDate,
              ItemFromTime: TimingDetails?.ItemFromTime,
              ItemToTime: TimingDetails?.ItemToTime,
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
              ServiceUniqueId: service?.ServiceUniqueId,
            };
          });
        });

        setAdditionalFormValue(initialFormValue);
        setOriginalAdditionalForm(initialFormValue);
        setItineraryAdditionalData(initialFormValue);
        const initialRows = {};

        qoutationData?.Days?.forEach((day) => {
          const additionalServices = day?.DayServices?.filter(
            (service) => service?.ServiceType === "Additional"
          );

          additionalServices?.forEach((service) => {
            const mappedRows =
              Array.isArray(service?.AdditionalCost) &&
              service.AdditionalCost.length > 0
                ? service.AdditionalCost.map((cost) => ({
                    upTo: cost?.UpToPax ?? "",
                    rounds: cost?.Rounds ?? "",
                    class: cost?.Class ?? "",
                    duration: cost?.Duration ?? "",
                    amount: cost?.Amount ?? "",
                    remarks: cost?.Remarks ?? "",
                  }))
                : [
                    {
                      upTo: "",
                      rounds: "",
                      class: "",
                      duration: "",
                      amount: "",
                      remarks: "",
                    },
                  ];
            initialRows[service.ServiceUniqueId] = mappedRows;
          });
        });

        setRowsPerIndex(initialRows);
        setOriginalRowsPerIndex(initialRows);
      } else {
        const additionalInitialValue = qoutationData?.Days?.map((day, ind) => {
          return {
            ...itineraryAdditionalInitialValue,
            id: queryData?.QueryId,
            DayNo: day.Day,
            Date: day?.Date,
            Destination: day.DestinationId || "",
            DestinationUniqueId: day?.DestinationUniqueId,
            QuatationNo: qoutationData?.QuotationNumber,
            DayUniqueId: day?.DayUniqueId,
            ItemFromDate: qoutationData?.TourSummary?.FromDate,
            ItemToDate: qoutationData?.TourSummary?.ToDate,
            RateUniqueId: "",
            DayType: Type,
            PaxInfo: {
              Adults: qoutationData?.Pax?.AdultCount,
              Child: qoutationData?.Pax?.ChildCount,
              Infant: qoutationData?.Pax?.Infant,
              Escort: "",
            },
            ServiceUniqueId: generateUniqueId(), // Add unique ID for new forms
          };
        });
        setAdditionalFormValue(additionalInitialValue);
        setOriginalAdditionalForm(additionalInitialValue);
      }
    }
  }, [qoutationData]);

  const getDestinationList = async () => {
    try {
      const { data } = await axiosOther.post("destinationlist");
      setDestinationList(data?.DataList);
    } catch (error) {
      console.log("error", error);
    }
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
  };

  useEffect(() => {
    if (!apiDataLoad) return;
    getDestinationList();
  }, [apiDataLoad]);

  const postDataToServer = async (index) => {
    try {
      const { data } = await axiosOther.post("additionalrequirementmasterlist");
      setAdditionaList((prevArr) => {
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
    additionaFormValue?.forEach((_, index) => {
      postDataToServer(index);
    });
  }, [apiDataLoad]);

  const setFirstValueIntoForm = (index) => {
    const additionalId =
      additionalList[index] != undefined ||
      (additionalList[index] != null && additionalList?.length > 0)
        ? additionalList[index][5]?.id
        : "";
    setAdditionalFormValue((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = {
        ...newArr[index],
        ServiceId: " ",
      };
      return newArr;
    });
    setOriginalAdditionalForm((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = {
        ...newArr[index],
        ServiceId: " ",
      };
      return newArr;
    });
  };

  useEffect(() => {
    if (!isItineraryEditing) {
      additionaFormValue?.map((form, index) => {
        setFirstValueIntoForm(index);
      });
    }
  }, [additionalList]);

  const handleAdditionalChange = (index, e) => {
    const { name, value } = e.target;
    if (name == "AdultCost" || name == "ChildCost" || name == "CostType") {
      setAdditionalPrice((prevArr) => {
        const newArr = [...prevArr];
        newArr[index] = { ...newArr[index], [name]: value };
        return newArr;
      });
    }

    setAdditionalFormValue((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = { ...newArr[index], [name]: value };
      return newArr;
    });
    setOriginalAdditionalForm((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = { ...newArr[index], [name]: value };
      return newArr;
    });
  };

  const FilteredfinalForm = () => {
    const finalFormData = additionaFormValue?.map((form, index) => {
      const rows = rowsPerIndex[form.ServiceUniqueId] || [];
      const AdditionalCost = rows.map((row) => ({
        UpToPax: row.upTo || "",
        Rounds: row.rounds || "",
        Class: row.class || "",
        Duration: row.duration || "",
        Amount: row.amount || "",
        Remarks: row.remarks || "",
      }));
      const dayWiseTotalCost = dayWiseTotals[form.ServiceUniqueId];
      return {
        ...form,
        AdditionalCost,
        Hike: hikePercent,
        DayType: Type,
        Sector: fromToDestinationList[index],
        TotalCosting: dayWiseTotalCost,
      };
    });
    const filteredForm = finalFormData?.filter((form) => form?.ServiceId != "");
    dispatch(
      setAdditionalFinalForm({ filteredForm, additionalPriceCalculation })
    );
    return filteredForm;
  };

  useEffect(() => {
    FilteredfinalForm();
  }, [
    additionaFormValue,
    rowsPerIndex,
    dayWiseTotals,
    hikePercent,
    fromToDestinationList,
    Type,
  ]);

  const handleFinalSave = async () => {
    try {
      const finalForm = additionaFormValue?.map((form, index) => {
        const rows = rowsPerIndex[form.ServiceUniqueId] || [];
        const AdditionalCost = rows.map((row) => ({
          UpToPax: row.upTo || "",
          Rounds: row.rounds || "",
          Class: row.class || "",
          Duration: row.duration || "",
          Amount: row.amount || "",
          Remarks: row.remarks || "",
        }));
        const dayWiseTotalCost = dayWiseTotals[form.ServiceUniqueId];
        return {
          ...form,
          AdditionalCost,
          Hike: hikePercent,
          DayType: Type,
          Sector: fromToDestinationList[index],
          TotalCosting: dayWiseTotalCost,
          DivisionFactor: 2,
          MaxPax: "2",
        };
      });

      // const FilteredfinalForm = finalForm?.filter(
      //   (form) => form?.ServiceId != ""
      // );

      const { data } = await axiosOther.post(
        "update-quotation-additional",
        finalForm
      );
      const filteredArray = additionaFormValue.map(
        ({ AdultCost, ChildCost, CostType }) => ({
          AdultCost,
          ChildCost,
          CostType,
        })
      );

      if (data?.status == 1) {
        notifyHotSuccess(data?.message);
        dispatch(
          setMiscAdditionCost(
            additionalPriceCalculation?.Price?.Adult +
              additionalPriceCalculation?.MarkupOfCost?.Adult +
              (additionalPriceCalculation?.Price?.Child +
                additionalPriceCalculation?.MarkupOfCost?.Child)
          )
        );
        dispatch(setTogglePriceState());
        dispatch(setTotalAdditionalPricePax(filteredArray));
        dispatch(setQoutationResponseData(data?.data));
      }
    } catch (error) {
      if (error.response?.data?.Errors || error.response?.data?.errors) {
        const data = Object.entries(
          error.response?.data?.Errors || error.response?.data?.errors
        );
        notifyHotError(data?.message);
      }
      if (error.response?.data) {
        const data = Object.entries(error.response?.data);
        notifyHotError(data?.message);
      }
    }
  };

  const handleTableIncrement = (index) => {
    const indexHotel = additionaFormValue[index];
    const newServiceUniqueId = generateUniqueId(); // Generate a unique ID for the copied service
    const newFormEntry = {
      ...indexHotel,
      isCopied: true,
      ServiceUniqueId: newServiceUniqueId, // Assign new ServiceUniqueId
    };

    setAdditionalFormValue((prevArr) => {
      const newArr = [...prevArr];
      newArr.splice(index + 1, 0, newFormEntry);
      return newArr;
    });
    setOriginalAdditionalForm((prevArr) => {
      const newArr = [...prevArr];
      newArr.splice(index + 1, 0, newFormEntry);
      return newArr;
    });

    // Initialize rowsPerIndex for the new ServiceUniqueId
    setRowsPerIndex((prev) => ({
      ...prev,
      [newServiceUniqueId]: [
        {
          upTo: "",
          rounds: "",
          class: "",
          duration: "",
          amount: "",
          remarks: "",
        },
      ],
    }));
    setOriginalRowsPerIndex((prev) => ({
      ...prev,
      [newServiceUniqueId]: [
        {
          upTo: "",
          rounds: "",
          class: "",
          duration: "",
          amount: "",
          remarks: "",
        },
      ],
    }));
  };

  const handleTableDecrement = (index) => {
    const filteredTable = additionaFormValue?.filter(
      (item, ind) => ind != index
    );
    setAdditionalFormValue(filteredTable);
    setOriginalAdditionalForm(filteredTable);

    // Optionally clean up rowsPerIndex for the removed service
    const serviceUniqueId = additionaFormValue[index]?.ServiceUniqueId;
    if (serviceUniqueId) {
      setRowsPerIndex((prev) => {
        const newRows = { ...prev };
        delete newRows[serviceUniqueId];
        return newRows;
      });
      setOriginalRowsPerIndex((prev) => {
        const newRows = { ...prev };
        delete newRows[serviceUniqueId];
        return newRows;
      });
    }
  };

  const handlePaxChange = (index, e) => {
    const { name, value } = e.target;
    setPaxFormValue({ ...paxFormValue, [name]: value });
  };

  const handlePaxModalClick = (index) => {
    setModalCentered({ modalIndex: index, isShow: true });
    const form = additionaFormValue?.filter((form, ind) => ind == index)[0];
    setPaxFormValue({
      Adults: form?.PaxInfo?.Adults,
      Child: form?.PaxInfo?.Child,
      Infant: form?.PaxInfo?.Infant,
    });
  };

  const handlePaxSave = () => {
    setAdditionalFormValue((prevForm) => {
      const newForm = [...prevForm];
      newForm[modalCentered?.modalIndex] = {
        ...newForm[modalCentered?.modalIndex],
        PaxInfo: paxFormValue,
      };
      return newForm;
    });
    setOriginalAdditionalForm((prevForm) => {
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
    const hikePercent = parseFloat(value) || 0;
    setHikePercent(value);

    const list = originalRowsPerIndex[selectedServiceId];
    if (Array.isArray(list)) {
      const updatedRows = list.map((item) => {
        const upTo = parseFloat(item?.upTo) || 0;
        const rounds = parseFloat(item?.rounds) || 0;
        const classes = parseFloat(item?.class) || 0;
        const duration = parseFloat(item?.duration) || 0;
        const amount = parseFloat(item?.amount) || 0;

        return {
          ...item,
          Hike: hikePercent,
          upTo: Math.floor(upTo + (upTo * hikePercent) / 100),
          rounds: Math.floor(rounds + (rounds * hikePercent) / 100),
          class: Math.floor(classes + (classes * hikePercent) / 100),
          duration: Math.floor(duration + (duration * hikePercent) / 100),
          amount: Math.floor(amount + (amount * hikePercent) / 100),
        };
      });

      setRowsPerIndex((prev) => ({
        ...prev,
        [selectedServiceId]: updatedRows,
      }));
    }
  };

  useEffect(() => {
    const filteredForm = additionaFormValue?.filter(
      (form) => form?.ServiceId != ""
    );
    const calculateAdultPrice = (data) => {
      let adultPrice = 0;
      data.forEach((item) => {
        adultPrice += parseFloat(item.AdultCost) || 0;
      });
      return adultPrice;
    };

    const totalAdult = calculateAdultPrice(filteredForm);

    const calculateChildPrice = (data) => {
      let childPrice = 0;
      data.forEach((item) => {
        childPrice += parseFloat(item.ChildCost) || 0;
      });
      return childPrice;
    };

    const totalChild = calculateChildPrice(filteredForm);

    setAdditionalPriceCalculation((prevData) => ({
      ...prevData,
      Price: {
        Adult: totalAdult,
        Child: totalChild,
      },
      MarkupOfCost: {
        Adult: (totalAdult * AdditionalData?.Value) / 100 || 0,
        Child: (totalChild * AdditionalData?.Value) / 100 || 0,
      },
    }));
  }, [
    additionaFormValue?.map((item) => item?.AdultCost).join(","),
    additionaFormValue?.map((item) => item?.ChildCost).join(","),
    additionaFormValue?.map((item) => item?.ServiceId).join(","),
    hikePercent,
    AdditionalData?.Value,
  ]);

  useEffect(() => {
    const calculateAdultPrice = (data) => {
      let adultPrice = 0;
      data.forEach((item) => {
        adultPrice += parseFloat(item.AdultCost) || 0;
      });
      return adultPrice;
    };

    const totalAdult = calculateAdultPrice(additionaFormValue);

    const calculateChildPrice = (data) => {
      let childPrice = 0;
      data.forEach((item) => {
        childPrice += parseFloat(item.ChildCost) || 0;
      });
      return childPrice;
    };
    const totalChild = calculateChildPrice(additionaFormValue);

    setAdditionalPriceCalculation((prevData) => ({
      ...prevData,
      Markup: {
        Adult: (totalAdult * hikePercent) / 100,
        Child: (totalChild * hikePercent) / 100,
      },
    }));
  }, [
    hikePercent,
    additionaFormValue?.map((item) => item?.AdultCost).join(","),
    additionaFormValue?.map((item) => item?.ChildCost).join(","),
  ]);

  useEffect(() => {
    const destinations = additionaFormValue?.map(
      (restaurant, index, restaurantArr) => {
        return {
          From: restaurant?.Destination,
          To: restaurantArr[index + 1]?.Destination,
        };
      }
    );

    const currAndPrevDest = destinations?.map((dest, ind) => {
      const currentAndPrev =
        dest?.From == destinations[ind - 1]?.From
          ? { From: dest?.From, To: "" }
          : { From: dest?.From, To: destinations[ind - 1]?.From };
      return currentAndPrev;
    });

    const FromToDestination = currAndPrevDest?.map((item) => {
      const filteredFromDest = destinationList.find(
        (dests) => dests?.id == item?.From
      );
      const filteredToDest = destinationList.find(
        (dests) => dests?.id == item?.To
      );

      if (filteredToDest != undefined) {
        return `${filteredToDest?.Name} To ${filteredFromDest?.Name}`;
      } else {
        return filteredFromDest?.Name;
      }
    });

    setFromToDestinationList(FromToDestination);
  }, [
    additionaFormValue?.map((restaurant) => restaurant?.Destination).join(","),
    destinationList,
  ]);

  const handleAlternateTransport = (e) => {
    e.stopPropagation();
    setAdditionalCopy(!additionalCopy);
  };

  // --- CHANGE: Only reset selectedServiceId if it is missing or not set ---
  useEffect(() => {
    if (additionaFormValue.length > 0) {
      // Check if current selectedServiceId exists in the new form value
      const exists = additionaFormValue.some(
        (item) => item.ServiceUniqueId === selectedServiceId
      );
      if (!selectedServiceId || !exists) {
        const firstItem = additionaFormValue[0];
        setSelectedServiceId(firstItem.ServiceUniqueId);
        setSelectedRowData(firstItem);
        setShowDetails(true);

        setRowsPerIndex((prev) => {
          if (!prev[firstItem.ServiceUniqueId]) {
            return {
              ...prev,
              [firstItem.ServiceUniqueId]: [
                {
                  upTo: "",
                  rounds: "",
                  class: "",
                  duration: "",
                  amount: "",
                  remarks: "",
                },
              ],
            };
          }
          return prev;
        });
      }
    }
  }, [additionaFormValue]);
  // --- END CHANGE ---

  useEffect(() => {
    if (Object.keys(rowsPerIndex).length > 0) {
      calculateTotalAmount(rowsPerIndex);
    }
  }, [rowsPerIndex]);

  const calculateTotalAmount = (rowsMap) => {
    let total = 0;
    const allRows = Object.values(rowsMap).flat();

    total = allRows.reduce((acc, row) => {
      if (!row) return acc;

      const upTo = parseFloat(row.upTo) || 0;
      const rounds = parseFloat(row.rounds) || 0;
      const duration = parseFloat(row.duration) || 0;
      const classVal = parseFloat(row.class) || 0;
      const amount = parseFloat(row.amount) || 0;

      return acc + upTo + rounds + duration + classVal + amount;
    }, 0);

    setTotalAmount(total);

    const totals = Object.fromEntries(
      Object.entries(rowsMap).map(([serviceId, rows]) => {
        const dayAmount = rows.reduce((sum, row) => {
          return (
            sum +
            (parseFloat(row?.upTo) || 0) +
            (parseFloat(row?.rounds) || 0) +
            (parseFloat(row?.duration) || 0) +
            (parseFloat(row?.class) || 0) +
            (parseFloat(row?.amount) || 0)
          );
        }, 0);

        const markup = parseFloat(AdditionalData?.Value) || 0;
        const markupAmount = (dayAmount * markup) / 100;

        return [
          serviceId,
          {
            AdditionalCost: dayAmount,
            AdditionalCostMarkupValue: markup,
            TotalAdditionalCostMarkup: markupAmount,
            TotalAdditionalCost: dayAmount + markupAmount,
          },
        ];
      })
    );

    setDayWiseTotals(totals);
  };

  const handleChange = (index, field, value) => {
    const key = selectedServiceId;
    const updatedRows = [...(rowsPerIndex[key] || [])];
    updatedRows[index] = { ...updatedRows[index], [field]: value };

    if (field === "rounds" || field === "class") {
      const rounds = parseFloat(updatedRows[index].rounds) || 0;
      const classAmount = parseFloat(updatedRows[index].class) || 0;
      updatedRows[index].amount = (rounds * classAmount).toString();
    }

    setRowsPerIndex((prev) => ({
      ...prev,
      [key]: updatedRows,
    }));
    setOriginalRowsPerIndex((prev) => ({
      ...prev,
      [key]: updatedRows.map((row, i) =>
        i === index
          ? {
              ...row,
              [field]: value,
            }
          : row
      ),
    }));
  };

  const handleAddRow = () => {
    const key = selectedServiceId;
    const newRow = {
      upTo: "",
      rounds: "",
      class: "",
      duration: "",
      amount: "",
      remarks: "",
    };
    setRowsPerIndex((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), newRow],
    }));
    setOriginalRowsPerIndex((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), newRow],
    }));
  };

  const handleDeleteRow = (index) => {
    const key = selectedServiceId;
    const updatedRows = (rowsPerIndex[key] || []).filter((_, i) => i !== index);
    setRowsPerIndex((prev) => ({
      ...prev,
      [key]: updatedRows,
    }));
    setOriginalRowsPerIndex((prev) => ({
      ...prev,
      [key]: updatedRows,
    }));
  };

  const handleShowDetails = (item, index) => {
    if (selectedServiceId === item.ServiceUniqueId) {
      setSelectedServiceId(null);
      setShowDetails(false);
    } else {
      setSelectedServiceId(item.ServiceUniqueId);
      setSelectedRowData(item);
      setShowDetails(true);

      if (!rowsPerIndex[item.ServiceUniqueId]) {
        setRowsPerIndex((prev) => ({
          ...prev,
          [item.ServiceUniqueId]: [
            {
              upTo: "",
              rounds: "",
              class: "",
              duration: "",
              amount: "",
              remarks: "",
            },
          ],
        }));
      }
    }
  };

  const handleIsOpen = () => {
    if (dataIsLoaded) {
      dispatch({
        type: "SET_ADDITIONAL_DATA_LOAD",
        payload: true,
      });
      setDataIsLoaded(false);
    }
    setIsOpen(!isOpen);
  };

  const additionalCheckbox = useSelector(
    (state) => state.itineraryServiceCopyReducer.additionalCheckbox
  );

  useEffect(() => {
    if (additionalCheckbox) {
      dispatch(
        setItineraryCopyAdditionalFormData({
          AdditionalForm: additionaFormValue,
          Costing: rowsPerIndex,
        })
      );
      dispatch(
        setItineraryUpGradeAdditionalData({
          AdditionalForm: additionaFormValue,
          Costing: rowsPerIndex,
        })
      );
    }
  }, [additionaFormValue, rowsPerIndex]);

  const handleCheckboxChange = (index) => {
    const updatedForm = [...additionaFormValue];
    updatedForm[index].Suppliment =
      updatedForm[index].Suppliment === "Yes" ? "No" : "Yes";
    setAdditionalFormValue(updatedForm);
  };

  useEffect(() => {
    return () => {
      dispatch(setItineraryCopyAdditionalFormDataCheckbox(true));
    };
  }, []);

  return (
    <div className="row mt-3 m-0">
      <Toaster />
      <div
        className="col-12 px-1 py-2 d-flex justify-content-between itinerary-head-bg"
        onClick={handleIsOpen}
      >
        <div className="d-flex gap-4 align-items-center">
          <div className="d-flex gap-2">
            <img src={AdditionalIcon} alt="AdditionalIcon" />
            <label htmlFor="" className="fs-5">
              Additional Services
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
          {Type === "Main" && (
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
          {Type === "Main" && (
            <div
              className="hike-input d-flex align-items-center cursor-pointer"
              id="copy_transport"
              name="copy_transport_form"
              checked={additionalCopy}
              onClick={handleAlternateTransport}
            >
              <label
                className="fontSize11px cursor-pointer"
                htmlFor="copy_transport"
              >
                {additionalCopy ? (
                  <>
                    <FaMinus className="m-0 p-0" /> Upgrade
                  </>
                ) : (
                  <>
                    <FaPlus className="m-0 p-0" /> Upgrade
                  </>
                )}
              </label>
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
      {isOpen && (
        <>
          <div className="d-flex gap-2 col-12 px-0 mt-2">
            <div className={`${styles.scrollContainer}`}>
              <table className="table table-bordered itinerary-table">
                <thead>
                  <tr>
                    <th
                      rowSpan={2}
                      className="py-1 align-middle text-center days-width-9"
                    >
                      {additionaFormValue[0]?.Date ? "Day / Date" : "Day"}
                    </th>
                    {(Type === "Local" || Type === "Foreigner") && (
                      <th rowSpan={2} className="py-1 align-middle">
                        Escort
                      </th>
                    )}
                    <th rowSpan={2} className="py-1 align-middle">
                      Destination
                    </th>
                    <th rowSpan={2} className="py-1 align-middle">
                      Particulars
                    </th>
                    <th>s</th>
                    <th
                      rowSpan={2}
                      className="py-1 align-middle"
                      style={{ width: "90px" }}
                    >
                      Cost Type
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {additionaFormValue?.map((item, index) => {
                    return (
                      <tr
                        className={
                          selectedServiceId === item.ServiceUniqueId
                            ? "selectedIndexActive"
                            : ""
                        }
                        key={index + 1}
                      >
                        <td
                          onClick={() => handleShowDetails(item, index)}
                          onMouseEnter={() => setHoveredIndex(index)}
                          onMouseLeave={() => setHoveredIndex(null)}
                          className="days-width-9"
                        >
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
                                <i className="la la-minus border cursor-pointer bg-primary text-white rounded-pill fontSize10px padding1px"></i>
                              </span>
                            </div>
                            {item?.Date ? (
                              <span
                                style={{
                                  textWrap: "nowrap",
                                  marginRight: "5px",
                                }}
                              >
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
                          </div>
                        </td>
                        {(Type === "Local" || Type === "Foreigner") && (
                          <td style={{ width: "30px" }}>
                            <div>
                              <input
                                name="Escort"
                                type="number"
                                min="0"
                                style={{ width: "30px" }}
                                className={`formControl1`}
                                value={additionaFormValue[index]?.Escort}
                                onChange={(e) =>
                                  handleAdditionalChange(index, e)
                                }
                              />
                            </div>
                          </td>
                        )}
                        <td>
                          <div>
                            <select
                              id=""
                              className="formControl1"
                              name="Destination"
                              value={additionaFormValue[index]?.Destination}
                              onChange={(e) => handleAdditionalChange(index, e)}
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
                            <input
                              name="ServiceId"
                              type="text"
                              className={`formControl1 w-100`}
                              value={additionaFormValue[index]?.ServiceId}
                              onChange={(e) => handleAdditionalChange(index, e)}
                            />
                          </div>
                        </td>
                        <td>
                          <div className="form-check check-sm d-flex align-items-center justify-content-center">
                            <input
                              name="Suppliment"
                              type="checkbox"
                              className="form-check-input height-em-1 width-em-1"
                              id={`no_of_activity_${index}`}
                              checked={
                                additionaFormValue[index].Suppliment === "Yes"
                              }
                              onChange={() => handleCheckboxChange(index)}
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <select
                              name="CostType"
                              id=""
                              className="formControl1"
                              value={additionaFormValue[index]?.CostType}
                              onChange={(e) => handleAdditionalChange(index, e)}
                            >
                              <option value="Per Person">Per Person</option>
                              <option value="Group">Group</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {showDetails ? (
              <div className={`${styles.tableRight} ${styles.scrollContainer}`}>
                <table className="table table-bordered itinerary-table text-center">
                  <thead>
                    <tr>
                      <th colSpan={7} className="align-middle text-center">
                        Day {selectedRowData?.DayNo} Service Cost
                      </th>
                    </tr>
                    <tr>
                      <th>Up to</th>
                      <th>No. of Days</th>
                      <th>Amount</th>
                      <th>Duration</th>
                      <th>Total</th>
                      <th>Remarks</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowsPerIndex[selectedServiceId]?.map((rowData, index) => (
                      <tr key={index}>
                        <td className="customInputWidth">
                          <input
                            type="number"
                            min="0"
                            className="formControl1"
                            value={rowData.upTo}
                            onChange={(e) =>
                              handleChange(index, "upTo", e.target.value)
                            }
                          />
                        </td>
                        <td className="customInputWidth">
                          <input
                            type="number"
                            min="0"
                            className="formControl1"
                            value={rowData.rounds}
                            onChange={(e) =>
                              handleChange(index, "rounds", e.target.value)
                            }
                          />
                        </td>
                        <td className="customInputWidth">
                          <input
                            type="number"
                            min="0"
                            className="formControl1"
                            value={rowData.class}
                            onChange={(e) =>
                              handleChange(index, "class", e.target.value)
                            }
                          />
                        </td>
                        <td className="customInputWidth">
                          <input
                            type="text"
                            className="formControl1"
                            value={rowData.duration}
                            onChange={(e) =>
                              handleChange(index, "duration", e.target.value)
                            }
                          />
                        </td>
                        <td className="customInputWidth">
                          <input
                            type="number"
                            min="0"
                            className="formControl1"
                            value={rowData.amount}
                            onChange={(e) =>
                              handleChange(index, "amount", e.target.value)
                            }
                          />
                        </td>
                        <td className="customInputWidthAmount">
                          <input
                            type="text"
                            className="formControl1"
                            value={rowData.remarks}
                            onChange={(e) =>
                              handleChange(index, "remarks", e.target.value)
                            }
                          />
                        </td>
                        <td className="customInputWidth">
                          {index === 0 ? (
                            <span className="fs-4" onClick={handleAddRow}>
                              +
                            </span>
                          ) : (
                            <span
                              className="fs-4"
                              onClick={() => handleDeleteRow(index)}
                            >
                              -
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              ""
            )}
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
      )}
      {additionalCopy && <AdditionalUpgrade Type={Type} />}
    </div>
  );
};

export default Additional;
