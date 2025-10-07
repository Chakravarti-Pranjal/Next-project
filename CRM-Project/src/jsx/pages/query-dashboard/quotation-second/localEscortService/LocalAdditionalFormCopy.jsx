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
import { FaChevronCircleUp, FaChevronCircleDown } from "react-icons/fa"; // Additional.svg
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
} from "../../../../../store/actions/itineraryDataAction";
import { setQoutationResponseData } from "../../../../../store/actions/queryAction";
import styles from "../itinerary-additionalService/index.module.css";

import { Toaster } from "react-hot-toast";
import { object } from "yup";
import { setItineraryCopyAdditionalFormDataCheckbox } from "../../../../../store/actions/itineraryServiceCopyAction/itineraryServiceCopyAction";
import { incrementLocalEscortCharges } from "../../../../../store/actions/createExcortLocalForeignerAction";
import moment from "moment";
import mathRoundHelper from "../../helper-methods/math.round";

const LocalEscortAdditionalForm = ({ Type }) => {
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
  const [isOpen, setIsOpen] = useState(false);
  const [hikePercent, setHikePercent] = useState(0);
  const [destinationList, setDestinationList] = useState([]);
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
  const [originalRowsPerIndex, setOriginalRowsPerIndex] = useState({});

  const dispatch = useDispatch();

  const [dataIsLoaded, setDataIsLoaded] = useState(true);
  const apiDataLoad = useSelector(
    (state) => state.inineraryServiceDataLoadReducer.transport
  );

  const qoutationDataLocal = qoutationData?.ExcortDays?.find(
    (item) => item.Type === "Local"
  );

  useEffect(() => {
    if (Type == "Main") {
      dispatch(setItineraryAdditionalData(additionaFormValue));
    } else {
      dispatch(setLocalItineraryAdditionalData(additionaFormValue));
    }
  }, [additionaFormValue]);

  useEffect(() => {
    if (qoutationDataLocal?.Days) {
      const hasTrainService = qoutationDataLocal?.Days.some((day) =>
        day?.DayServices?.some(
          (service) => service.ServiceType === "Additional"
        )
      );

      if (hasTrainService) {
        setCopyChecked(true);
        const initialFormValue = qoutationDataLocal?.Days?.map((day, index) => {
          const service = day?.DayServices?.filter(
            (service) => service?.ServiceType == "Additional"
          )[0];

          const { ItemUnitCost, TimingDetails, ItemSupplierDetail } =
            service != undefined ? service?.ServiceDetails.flat(1)[0] : "";

          if (service?.DestinationId) {
            service.DestinationId = parseInt(service.DestinationId);
          }

          // console.log("DayService", service);

          return {
            id: queryData?.QueryId,
            QuatationNo: qoutationData?.QuotationNumber,
            DayType: "Local",
            DayNo: day.Day,
            Date: day?.Date,
            Destination: service?.DestinationId,
            DestinationUniqueId: day?.DestinationUniqueId,
            DayUniqueId: day?.DayUniqueId,
            Escort: 1,
            ServiceId: service != undefined ? service?.ServiceId : "",
            CostType:
              service?.CostType != "" ? service?.CostType : "Per Person",
            PaxUpTo: service?.PaxUpto,
            AdultCost: ItemUnitCost?.AdultCost,
            ChildCost: ItemUnitCost?.ChildCost,
            ServiceMainType: "No",
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
          };
        });

        setAdditionalFormValue(initialFormValue);
        setOriginalAdditionalForm(initialFormValue);
        setItineraryAdditionalData(initialFormValue);
        const initialRows = {};

        qoutationDataLocal?.Days?.forEach((day, index) => {
          const service = day?.DayServices?.find(
            (service) => service?.ServiceType === "Additional"
          );

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

          initialRows[index] = mappedRows;
        });

        setRowsPerIndex(initialRows);
        setOriginalRowsPerIndex(initialRows);
      } else {
        const additionalInitialValue = qoutationDataLocal?.Days?.map(
          (day, ind) => {
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
              DayType: "Local",
              PaxInfo: {
                Adults: qoutationData?.Pax?.AdultCount,
                Child: qoutationData?.Pax?.ChildCount,
                Infant: qoutationData?.Pax?.Infant,
                Escort: "",
              },
            };
          }
        );

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
        ServiceId: additionalId,
      };
      return newArr;
    });
    setOriginalAdditionalForm((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = {
        ...newArr[index],
        ServiceId: additionalId,
      };
      return newArr;
    });
  };

  useEffect(() => {
    if (!isItineraryEditing) {
      additionaFormValue?.map((form, index) => {
        // setFirstValueIntoForm(index);
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

  const handleFinalSave = async () => {
    try {
      const finalForm = additionaFormValue?.map((form, index) => {
        const rows = rowsPerIndex[index] || [];

        const AdditionalCost = rows.map((row) => ({
          UpToPax: row.upTo || "",
          Rounds: row.rounds || "",
          Class: row.class || "",
          Duration: row.duration || "",
          Amount: mathRoundHelper(row.amount) || "",
          Remarks: row.remarks || "",
        }));

        const dayWiseTotalCost = dayWiseTotals[index];

        return {
          ...form,
          AdditionalCost,
          Hike: hikePercent,
          DayType: "Local",
          Sector: fromToDestinationList[index],
          TotalCosting: dayWiseTotalCost,
        };
      });

      // console.log(finalForm);

      const FilteredfinalForm = finalForm?.filter(
        (form) => form?.ServiceId != ""
      );

      console.log(FilteredfinalForm, "ADD34");

      const { data } = await axiosOther.post(
        "update-quotation-additional",
        FilteredfinalForm
      );
      // console.log(data);
      const filteredArray = additionaFormValue.map(
        ({ AdultCost, ChildCost, CostType }) => ({
          AdultCost,
          ChildCost,
          CostType,
        })
      );

      if (data?.status == 1) {
        // notifySuccess("Services Added !");
        dispatch(incrementLocalEscortCharges());
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
        // notifyError(data[0][1]);
        notifyHotError(data?.message);
      }
      if (error.response?.data) {
        const data = Object.entries(error.response?.data);
        // notifyError(data[0][1]);
        notifyHotError(data?.message);
      }
    }
  };

  const handleTableIncrement = (index) => {
    const indexHotel = additionaFormValue[index];
    setAdditionalFormValue((prevArr) => {
      const newArr = [...prevArr];
      newArr.splice(index + 1, 0, { ...indexHotel, isCopied: true });
      return newArr;
    });
    setOriginalAdditionalForm((prevArr) => {
      const newArr = [...prevArr];
      newArr.splice(index + 1, 0, { ...indexHotel, isCopied: true });
      return newArr;
    });
  };

  const handleTableDecrement = (index) => {
    const filteredTable = additionaFormValue?.filter(
      (item, ind) => ind != index
    );
    setAdditionalFormValue(filteredTable);
    setOriginalAdditionalForm(filteredTable);
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
    const value = e.target.value;
    const newHike = parseFloat(value) || 0;
    const oldHike = parseFloat(hikePercent) || 0;
    setHikePercent(newHike);

    setRowsPerIndex((prevRowsPerIndex) => {
      const updatedRowsPerIndex = { ...prevRowsPerIndex };
      Object.keys(updatedRowsPerIndex).forEach((index) => {
        updatedRowsPerIndex[index] = updatedRowsPerIndex[index].map((item) => {
          const originalAmount = parseFloat(item.amount) / (1 + oldHike / 100);
          return {
            ...item,
            amount: Math.floor(originalAmount * (1 + newHike / 100)),
          };
        });
      });
      return updatedRowsPerIndex;
    });

    setAdditionalFormValue((prevFormValue) => {
      return prevFormValue.map((form) => {
        const originalAdultCost =
          parseFloat(form.AdultCost) / (1 + oldHike / 100);
        const originalChildCost =
          parseFloat(form.ChildCost) / (1 + oldHike / 100);
        return {
          ...form,
          AdultCost: Math.floor(originalAdultCost * (1 + newHike / 100)),
          ChildCost: Math.floor(originalChildCost * (1 + newHike / 100)),
        };
      });
    });

    setOriginalAdditionalForm((prevOriginalForm) => {
      return prevOriginalForm.map((form) => {
        return {
          ...form,
          AdultCost: form.AdultCost,
          ChildCost: form.ChildCost,
        };
      });
    });
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
        Adult: (totalAdult * 5) / 100,
        Child: (totalChild * 5) / 100,
      },
    }));
  }, [
    additionaFormValue?.map((item) => item?.AdultCost).join(","),
    additionaFormValue?.map((item) => item?.ChildCost).join(","),
    additionaFormValue?.map((item) => item?.ServiceId).join(","),
    hikePercent,
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

  // calculating from destination & to destination
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

  // Service cost------------------------------------

  const [rowsPerIndex, setRowsPerIndex] = useState({});

  const [totalAmount, setTotalAmount] = useState(0);
  const [dayWiseTotals, setDayWiseTotals] = useState({});

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isHoveredDetails, setIsHoveredDetails] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  // --- CHANGE: Only reset selectedIndex if it is missing or not set ---
  useEffect(() => {
    if (additionaFormValue.length > 0) {
      const exists =
        selectedIndex !== null &&
        additionaFormValue[selectedIndex] !== undefined;
      if (selectedIndex === null || !exists) {
        const firstItem = additionaFormValue[0];
        setSelectedIndex(0);
        setSelectedRowData(firstItem);
        setShowDetails(true);

        setRowsPerIndex((prev) => {
          if (!prev[0]) {
            return {
              ...prev,
              0: [
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
    // console.log(rowsMap, "rowsMap");
    let total = 0;
    Object.values(rowsMap).forEach((rows) => {
      const selctvalue = rows?.[0];
      if (selctvalue && selctvalue.amount) {
        total += parseFloat(selctvalue.amount) || 0;
      }
    });

    setTotalAmount(total);

    // Days Wise total
    const totals = {};

    Object.entries(rowsMap).forEach(([day, rows]) => {
      let totalAmount = 0;

      rows.forEach((row) => {
        const amount = parseFloat(row.amount);
        if (!isNaN(amount)) {
          totalAmount += amount;
        }
      });

      const adultMarkupValue = mathRoundHelper(5);
      const adultMarkupTotal = mathRoundHelper(
        (totalAmount * adultMarkupValue) / 100
      );

      totals[day] = {
        AdditionalCost: mathRoundHelper(totalAmount),
        AdditionalCostMarkupValue: mathRoundHelper(adultMarkupValue),
        TotalAdditionalCostMarkup: mathRoundHelper(adultMarkupTotal),
        TotalAdditionalCost: mathRoundHelper(totalAmount + adultMarkupTotal),
      };
    });

    setDayWiseTotals(totals);
  };

  const handleChange = (index, field, value) => {
    const key = selectedIndex;
    const updatedRows = [...(rowsPerIndex[key] || [])];
    updatedRows[index][field] = value;
    setRowsPerIndex((prev) => ({
      ...prev,
      [key]: updatedRows,
    }));
  };

  const handleAddRow = () => {
    const key = selectedIndex;
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
  };

  const handleDeleteRow = (index) => {
    const key = selectedIndex;
    const updatedRows = (rowsPerIndex[key] || []).filter((_, i) => i !== index);
    setRowsPerIndex((prev) => ({
      ...prev,
      [key]: updatedRows,
    }));
  };

  const handleShowDetails = (item, index) => {
    if (selectedIndex === index) {
      setSelectedIndex(null);
      setShowDetails(false);
    } else {
      setSelectedIndex(index);
      setSelectedRowData(item);
      setShowDetails(true);

      // Initialize rows for that index if not present
      if (!rowsPerIndex[index]) {
        setRowsPerIndex((prev) => ({
          ...prev,
          [index]: [
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
        type: "SET_ACTIVITY_DATA_LOAD",
        payload: true,
      });
      setDataIsLoaded(false);
    }

    setIsOpen(!isOpen);
  };

  useEffect(() => {
    return () => {
      dispatch({
        type: "SET_ACTIVITY_DATA_LOAD",
        payload: false,
      });
    };
  }, []);
  // =========================================
  const additionalMainData = useSelector(
    (state) => state.itineraryServiceCopyReducer.additionalData
  );
  const [copyAdditionalFromValue, setCopyAdditionalFormValue] = useState([]);
  const [copyCosting, setCopyCosting] = useState([]);
  const additionalCheckbox = useSelector(
    (state) => state.itineraryServiceCopyReducer.additionalCheckbox
  );

  console.log(additionaFormValue, "ADD256");

  // Copy data from main
  const handleCopyDataFromMain = (e) => {
    const { checked } = e.target;
    setCopyAdditionalFormValue(additionaFormValue);
    setCopyCosting(rowsPerIndex);
    // checked && additionalCheckbox
    if (checked && additionalCheckbox) {
      const updatedAdditional = additionalMainData?.AdditionalForm?.map(
        (service, index) => {
          const matchedAdditional = additionaFormValue?.find(
            (add) => add?.DayNo === service?.DayNo
          );
          return {
            ...service, // spread directly from additionalMainData
            DayType: "Local",
            DayUniqueId: matchedAdditional?.DayUniqueId,
          };
        }
      );

      setAdditionalFormValue(updatedAdditional);
      const updatedCosting = JSON.parse(
        JSON.stringify(additionalMainData.Costing)
      );
      setRowsPerIndex(updatedCosting);
      setCopyChecked(true);
      dispatch(setItineraryCopyAdditionalFormDataCheckbox(false));
    } else {
      setCopyChecked(false);
      setAdditionalFormValue(copyAdditionalFromValue);
      setRowsPerIndex(copyCosting);
    }
  };

  return (
    <div className="row mt-3 m-0">
      <Toaster />
      <div
        className="col-12 px-1 py-2 d-flex justify-content-between itinerary-head-bg localEscort-head-bg"
        onClick={handleIsOpen}
      >
        <div className="d-flex gap-4 align-items-center">
          <div className="d-flex gap-2">
            <img src={AdditionalIcon} alt="AdditionalIcon" />
            <label htmlFor="" className="fs-5">
              Additional Services
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
              onChange={(e) => handleCopyDataFromMain(e)}
            />
            <label className="fontSize11px m-0 ms-1" htmlFor="copy-guide">
              Copy
            </label>
          </div>
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
      {isOpen && (
        <>
          <div className="d-flex gap-4 col-12 px-0 mt-2">
            {/* Left Table---------------------------------------------------- */}
            <div className={`${styles.scrollContainer}`}>
              <table class="table table-bordered itinerary-table">
                <thead>
                  <tr>
                    <th
                      rowSpan={2}
                      className="py-1 align-middle text-cemter days-width-9"
                    >
                      {additionaFormValue[0]?.Date ? "Day / Date" : "Day"}
                    </th>
                    {(Type == "Local" || Type == "Foreigner") && (
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

                    <th rowSpan={2} className="py-1 align-middle">
                      Cost Type
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {additionaFormValue?.map((item, index) => {
                    return (
                      <tr
                        className={
                          selectedIndex === index ? "selectedIndexActive" : ""
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
                              {/* {!item?.isCopied && (
                              )} */}
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
                              <span>{`Day ${item?.DayNo}`}</span>
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
                              {qoutationDataLocal?.Days?.map((qout, index) => {
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
                  {/* <tr className="costing-td">
                    <td
                      colSpan={Type == "Local" || Type == "Foreigner" ? 3 : 2}
                      className="text-center fs-6"
                      rowSpan={3}
                    >
                      Total
                    </td>

                    <td>Additional Cost</td>
                    <td>{mathRoundHelper(totalAmount)}</td>
                  </tr>
                  <tr className="costing-td">
                    <td>Markup(5) %</td>
                    <td>{mathRoundHelper((totalAmount * 5) / 100)}</td>
                  </tr>
                  <tr className="costing-td">
                    <td>Total</td>
                    <td>{mathRoundHelper(totalAmount + (totalAmount * 5) / 100)}</td>
                  </tr> */}
                </tbody>
              </table>
            </div>

            {/* Right Table------------------------------------------------- */}
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
                      <th>Rounds</th>
                      <th>Class</th>
                      <th>Duration</th>
                      <th>Amount</th>
                      <th>Remarks</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowsPerIndex[selectedIndex]?.map((rowData, index) => (
                      <tr key={index}>
                        <td>
                          <input
                            type="number"
                            className="formControl1"
                            value={rowData.upTo}
                            onChange={(e) =>
                              handleChange(index, "upTo", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="formControl1"
                            value={rowData.rounds}
                            onChange={(e) =>
                              handleChange(index, "rounds", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="formControl1"
                            value={rowData.class}
                            onChange={(e) =>
                              handleChange(index, "class", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="formControl1"
                            value={rowData.duration}
                            onChange={(e) =>
                              handleChange(index, "duration", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="formControl1"
                            value={rowData.amount}
                            onChange={(e) =>
                              handleChange(index, "amount", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="formControl1"
                            value={rowData.remarks}
                            onChange={(e) =>
                              handleChange(index, "remarks", e.target.value)
                            }
                          />
                        </td>
                        <td>
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

export default LocalEscortAdditionalForm;
