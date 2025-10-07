import React, {
  useState,
  useEffect,
  useContext,
  useReducer,
  useRef,
} from "react";
import {
  eachDayOfInterval,
  format,
  addDays,
  parseISO,
  isValid,
  parse,
} from "date-fns";
import { useLocation } from "react-router-dom";
import { axiosOther } from "../../../../../http/axios_base_url";
import { addQueryContext } from "..";
import "../../../../../css/style.css";
import Counter from "../counter";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import {
  multiSelect_custom_style,
  select_customStyles,
} from "../../../../../css/custom_style";
import "../../../../../css/new-style.css";
import moment from "moment";
import { m } from "framer-motion";
import { ThemeContext } from "../../../../../context/ThemeContext";
import { useDispatch, useSelector } from "react-redux";

const TravelInfo = ({ queryType }) => {
  const location = useLocation();
  const FormPreviousData = location.state;

  // console.log(FormPreviousData, "FormPreviousData7464");

  const { background } = useContext(ThemeContext);
  const {
    queryObjects,
    travelObject,
    dropdownObject,
    TravelDateObject,
    destinationObject,
  } = useContext(addQueryContext);
  const selectRef = useRef(null);
  const menuRef = useRef(null);
  const [scrollbar, setScrollbar] = useState(false);
  const { TravelDate, setTravelDate } = travelObject;
  const { dayWiseForm, setDayWiseForm } = TravelDateObject;
  const { formValue, setFormValue } = queryObjects;
  const { dropdownState } = dropdownObject;
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [TakingLength, setTakingLength] = useState(0);
  const [TakingIndexOfDateWise, setTakingIndexOfDateWise] = useState(0);
  const { editDestinationTemplate, setEditDestinationTemplate } =
    destinationObject;
  const [isUpdatingDeletingDate, setIsUpdatingDeletingDate] = useState(false);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState();
  const [pereferenceList, setPereferenceList] = useState([]);
  const [TrackDataOfTravelInfo, setTrackDataOfTravelInfo] = useState("");
  const heightAutoAdjust = queryType;
  const [menuPlacement, setMenuPlacement] = useState(
    !heightAutoAdjust.includes(1) ? "bottom" : "top"
  );

  const travelModes = [
    { value: "", label: "Select" },
    { value: "flight", label: "Flight" },
    { value: "train", label: "Train" },
    { value: "surface", label: "Surface" },
  ];

  const destinationOption = [
    { value: "", label: "Select" },
    ...dropdownState?.destinationList?.map((destination) => ({
      value: destination?.id,
      label: destination?.Name,
    })),
  ];
  const enrouteOption = [
    { value: "", label: "Select" },
    ...dropdownState?.destinationList?.map((enroute) => ({
      value: enroute?.id,
      label: enroute?.Name,
    })),
  ];

  // console.log(TravelDate, "HJDGDY787");
  // console.log(formValue, "formValue123");
  // console.log(
  //   dropdownState?.seasonList?.[0]?.id,
  //   "dropdownState?.seasonList?.[0]?.id"
  // );

  useEffect(() => {
    if (!dropdownState?.seasonList?.[0]?.id) return;
    setSelectedSeason(dropdownState?.seasonList?.[0]?.id);
    setFormValue({
      ...formValue,
      TravelDateInfo: {
        ...formValue.TravelDateInfo,
        SeasonType: dropdownState?.seasonList?.[0]?.id,
      },
    });
  }, [formValue?.TravelDateInfo?.ScheduleType, dropdownState]);

  const perefernce = useSelector(
    (state) => state?.MessageReducer?.perefernceValue
  );
  const getPerefernceApi = async () => {
    try {
      const { data } = await axiosOther.post("querypreflist", {
        CompanyId: JSON.parse(localStorage.getItem("token"))?.companyKey,
        UserId: JSON.parse(localStorage.getItem("token"))?.UserID,
      });
      setPereferenceList(data?.DataList?.[0]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getPerefernceApi();
  }, [perefernce]);

  useEffect(() => {
    // console.log(
    //   formValue?.TravelDateInfo?.ScheduleType,
    //   "HFGY76",
    //   pereferenceList?.TravelInfo
    // );
    if (pereferenceList?.TravelInfo) {
      setFormValue({
        ...formValue,
        // TravelDateInfo: {
        //   ...formValue?.TravelDateInfo,
        //   ScheduleType:
        //     pereferenceList?.TravelInfo === "Day wise"
        //       ? "Day Wise"
        //       : "Date Wise",
        // },
      });
    }
  }, [pereferenceList]);

  const [errors, setErrors] = useState();
  const fiftyYear = [];
  const handleDayCalendor = (date, type) => {
    const formattedDate = date ? date.toISOString().split("T")[0] : "";
    if (type === "From") {
      setDayWiseForm({ ...dayWiseForm, From: formattedDate });
      setFormValue({
        ...formValue,
        TravelDateInfo: {
          ...formValue.TravelDateInfo,
          FromDate: formattedDate,
        },
      });
    }
    if (type === "To") {
      setDayWiseForm({ ...dayWiseForm, To: formattedDate });
      setFormValue({
        ...formValue,
        TravelDateInfo: {
          ...formValue.TravelDateInfo,
          ToDate: formattedDate,
        },
      });
    }
  };

  // console.log(dayWiseForm, "dayWiseForm.From");

  const selectedDayDate = (type) => {
    if (type === "From") {
      return dayWiseForm?.From ? new Date(dayWiseForm.From) : null;
    }
    if (type === "To") {
      return dayWiseForm?.To ? new Date(dayWiseForm.To) : null;
    }
    return null;
  };

  const customStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#2e2e40",
      color: "white",
      border: "1px solid transparent",
      boxShadow: "none",
      borderRadius: "0.5rem",
      width: "100%",
      minWidth: "70px",
      height: "2rem",
      minHeight: "2rem",
      fontSize: "13px",
      zIndex: 0,
    }),
    singleValue: (base) => ({
      ...base,
      color: "white",
      fontSize: "0.85em",
    }),
    input: (base) => ({
      ...base,
      color: "white",
      fontSize: "0.85em",
      margin: 0,
      padding: 0,
    }),
    placeholder: (base) => ({
      ...base,
      color: "#6c757d",
      fontSize: "0.85em",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: "#ccc",
      padding: "0 6px",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    clearIndicator: () => ({
      display: "none",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#2e2e40",
      zIndex: 9999,
    }),
    menuList: (base) => ({
      ...base,
      paddingTop: 0,
      paddingBottom: 0,
      maxHeight: "150px",
      overflowY: "scroll",
      scrollbarWidth: "none",
      msOverflowStyle: "none",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#444" : "#2e2e40",
      color: "white",
      cursor: "pointer",
      fontSize: "12px",
      padding: "6px 10px",
    }),
  };

  useEffect(() => {
    // console.log("this function callls");

    if (
      formValue?.TravelDateInfo?.FromDateDateWise &&
      formValue?.TravelDateInfo?.TotalNights >= 0 &&
      formValue?.TravelDateInfo?.ScheduleType === "Date Wise"
    ) {
      const fromDateObj = parseISO(formValue?.TravelDateInfo?.FromDateDateWise);
      if (isValid(fromDateObj)) {
        const date = addDays(
          fromDateObj,
          parseInt(formValue?.TravelDateInfo?.TotalNights || 0)
        );
        const formattedToDate = format(date, "yyyy-MM-dd");
        setFormValue({
          ...formValue,
          TravelDateInfo: {
            ...formValue?.TravelDateInfo,
            ToDate: formattedToDate,
            SeasonType: "",
            SeasonYear: "",
          },
        });
      }
    }
  }, [
    formValue?.TravelDateInfo?.FromDateDateWise,
    formValue?.TravelDateInfo?.TotalNights,
    formValue?.TravelDateInfo?.ScheduleType,
  ]);
  // console.log(formValue, "this function callls2");

  if (formValue?.TravelDateInfo?.ScheduleType === "Day Wise") {
    const currentYear = new Date().getFullYear();
    for (let i = 0; i <= 5; i++) {
      fiftyYear.push(currentYear + i);
    }
  }

  const handleTotalNights = (e) => {
    const { value } = e.target;
    if (parseInt(value) <= 0) return;
    const nights = parseInt(value) >= 0 ? parseInt(value) : parseInt(value);
    setTakingLength((prev) => prev + 1);

    if (formValue?.TravelDateInfo?.ScheduleType === "Day Wise") {
      const newTravelDate = Array.from({ length: nights + 1 }, (_, i) => {
        const existingItem = TravelDate[i] || {};
        return {
          DayNo: i + 1,
          Destination: existingItem?.Destination || "",
          Enroute: existingItem?.Enroute || "",
          IsEnroute: existingItem?.IsEnroute || false,
          Mode: i === 0 || i === nights ? "flight" : "surface",
          copy: false,
        };
      });
      setTravelDate(newTravelDate);
      setQueryTravelData(newTravelDate);
    } else {
      const fromDate = formValue?.TravelDateInfo?.FromDateDateWise
        ? parseISO(formValue?.TravelDateInfo?.FromDateDateWise)
        : new Date();
      let toDateWise = "";
      if (isValid(fromDate) && nights >= 0) {
        toDateWise = format(addDays(fromDate, nights), "yyyy-MM-dd");
      }
      if (!isValid(fromDate)) {
        const today = new Date();
        setFormValue({
          ...formValue,
          TravelDateInfo: {
            ...formValue.TravelDateInfo,
            FromDateDateWise: format(today, "yyyy-MM-dd"),
            ToDateWise: format(addDays(today, nights), "yyyy-MM-dd"),
          },
        });
        return;
      }
      const dateArray = eachDayOfInterval({
        start: fromDate,
        end: addDays(fromDate, nights),
      }).map((date) => format(date, "yyyy-MM-dd"));

      const newTravelDate = dateArray.map((date, i) => {
        const existingItem = TravelDate[i] || {};
        return {
          Date: date,
          DayNo: i + 1,
          Destination: existingItem?.Destination || "",
          Enroute: existingItem?.Enroute || "",
          IsEnroute: existingItem?.IsEnroute || false,
          Mode: i === 0 || i === nights ? "flight" : "surface",
          copy: false,
        };
      });
      setTravelDate(newTravelDate);
      setQueryTravelData(newTravelDate);
    }

    setFormValue({
      ...formValue,
      TravelDateInfo: {
        ...formValue.TravelDateInfo,
        TotalNights: nights,
        // ToDateWise: toDateWise,
      },
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedSeason(Number(value));
    if (name in formValue) {
      setFormValue((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else {
      const keys = name?.split(".");
      const newFormData = { ...formValue };
      let current = { ...newFormData };
      keys.forEach((key, index) => {
        if (index === keys.length - 1) {
          current[key] = value;
        } else {
          current = current[key];
        }
      });
      setFormValue(newFormData);
    }
  };

  // const handleCopyRow = (item, index) => {
  //   setTrackDataOfTravelInfo("NormalCopy");
  //   const lastNonCopiedDay = TravelDate.filter((d) => !d.copy).reduce(
  //     (max, d) => Math.max(max, d.DayNo),
  //     0
  //   );
  //   const newRow = {
  //     DayNo: lastNonCopiedDay + 1,
  //     Destination: "",
  //     Enroute: "",
  //     IsEnroute: false,
  //     Mode: "flight",
  //     Date:
  //       formValue?.TravelDateInfo?.ScheduleType === "Date Wise"
  //         ? format(
  //             addDays(parseISO(TravelDate[TravelDate.length - 1].Date), 1),
  //             "yyyy-MM-dd"
  //           )
  //         : undefined,
  //     copy: false,
  //   };
  //   const updatedTravelDate = [...TravelDate, newRow].map((row, i) => ({
  //     ...row,
  //     Mode: i === 0 || i === TravelDate.length ? "flight" : "surface",
  //   }));
  //   setTravelDate(updatedTravelDate);
  //   setQueryTravelData(updatedTravelDate);
  //   setFormValue({
  //     ...formValue,
  //     TravelDateInfo: {
  //       ...formValue.TravelDateInfo,
  //       TotalNights: updatedTravelDate.filter((d) => !d.copy).length - 1,
  //     },
  //   });
  // };

  const handleCopyRow = (item, index) => {
    setTrackDataOfTravelInfo("NormalCopy");
    const lastNonCopiedDay = TravelDate.filter((d) => !d.copy).reduce(
      (max, d) => Math.max(max, d.DayNo),
      0
    );

    const newRow = {
      DayNo: lastNonCopiedDay + 1,
      Destination: "",
      Enroute: "",
      IsEnroute: false,
      Mode: "surface", // Default mode for new rows should be surface
      Date:
        formValue?.TravelDateInfo?.ScheduleType === "Date Wise"
          ? format(
            addDays(parseISO(TravelDate[TravelDate.length - 1].Date), 1),
            "yyyy-MM-dd"
          )
          : undefined,
      copy: false,
    };

    const updatedTravelDate = [...TravelDate, newRow];

    // Correct mode assignment for first and last rows
    const finalTravelDate = updatedTravelDate.map((row, i) => ({
      ...row,
      Mode: i === 0 || i === updatedTravelDate.length - 1 ? "flight" : row.Mode || "surface",
    }));

    setTravelDate(finalTravelDate);
    setQueryTravelData(finalTravelDate);
    setFormValue({
      ...formValue,
      TravelDateInfo: {
        ...formValue.TravelDateInfo,
        TotalNights: finalTravelDate.filter((d) => !d.copy).length - 1,
      },
    });
  };

  // const copyParticularRow = (item, index) => {
  //   setTrackDataOfTravelInfo("HardCopy");
  //   const newRow = { ...item, copy: true, DayNo: item.DayNo };
  //   const updatedTravelDate = [...TravelDate];
  //   updatedTravelDate.splice(index + 1, 0, newRow);
  //   const finalTravelDate = updatedTravelDate.map((row, i) => ({
  //     ...row,
  //     Mode:
  //       i === 0 || i === updatedTravelDate.length - 1 ? "flight" : "surface",
  //   }));
  //   setTravelDate(finalTravelDate);
  //   setQueryTravelData(finalTravelDate);
  // };

  const copyParticularRow = (item, index) => {
    setTrackDataOfTravelInfo("HardCopy");
    const newRow = {
      ...item,
      copy: true,
      DayNo: item.DayNo,
      // Keep the same mode as the original row
      Mode: item.Mode
    };

    const updatedTravelDate = [...TravelDate];
    updatedTravelDate.splice(index + 1, 0, newRow);

    // Correct mode assignment while preserving existing modes
    const finalTravelDate = updatedTravelDate.map((row, i) => ({
      ...row,
      Mode: i === 0 || i === updatedTravelDate.length - 1 ? "flight" : row.Mode,
    }));

    setTravelDate(finalTravelDate);
    setQueryTravelData(finalTravelDate);
  };

  // const dateDeleting = (item, index) => {
  //   setTrackDataOfTravelInfo("HardCopy");
  //   const updatedTravelDate = [...TravelDate];
  //   updatedTravelDate.splice(index, 1);
  //   const finalTravelDate = updatedTravelDate.map((row, i) => ({
  //     ...row,
  //     Mode:
  //       i === 0 || i === updatedTravelDate.length - 1 ? "flight" : "surface",
  //   }));
  //   setTravelDate(finalTravelDate);
  //   setQueryTravelData(finalTravelDate);
  //   setFormValue({
  //     ...formValue,
  //     TravelDateInfo: {
  //       ...formValue.TravelDateInfo,
  //       TotalNights: finalTravelDate.filter((d) => !d.copy).length - 1,
  //     },
  //   });
  // };

  const dateDeleting = (item, index) => {
    setTrackDataOfTravelInfo("HardCopy");
    const updatedTravelDate = [...TravelDate];
    updatedTravelDate.splice(index, 1);

    // Correct mode assignment after deletion
    const finalTravelDate = updatedTravelDate.map((row, i) => ({
      ...row,
      Mode: i === 0 || i === updatedTravelDate.length - 1 ? "flight" : row.Mode,
    }));

    setTravelDate(finalTravelDate);
    setQueryTravelData(finalTravelDate);
    setFormValue({
      ...formValue,
      TravelDateInfo: {
        ...formValue.TravelDateInfo,
        TotalNights: finalTravelDate.filter((d) => !d.copy).length - 1,
      },
    });
  };

  const handleCountrChange = (selectedOption, index) => {
    const updatedTravelDate = [...TravelDate];
    updatedTravelDate[index].Country = selectedOption.value;
    setTravelDate(updatedTravelDate);
  };

  const dispatchTravel = useDispatch();
  const selectorTravel = useSelector((state) => state?.queryTravelData || []);
  const [queryTravelData, setQueryTravelData] = useState([]);

  const handleDestinationChange = (selectedOption, index) => {
    const updatedTravelDate = [...TravelDate];
    updatedTravelDate[index].Destination = selectedOption.value;
    setTravelDate(updatedTravelDate);
    setQueryTravelData(updatedTravelDate);
  };

  const handleEnrouteChange = (selectedOption, index) => {
    const updatedTravelDate = [...TravelDate];
    updatedTravelDate[index].Enroute = selectedOption.value;
    updatedTravelDate[index].IsEnroute = selectedOption.value ? true : false;
    setTravelDate(updatedTravelDate);
    setQueryTravelData(updatedTravelDate);
  };

  const handleModeChange = (selectedValue, index) => {
    const updatedTravelDate = [...TravelDate];
    updatedTravelDate[index].Mode = selectedValue.value;
    setTravelDate(updatedTravelDate);
    setQueryTravelData(updatedTravelDate);
  };

  useEffect(() => {
    if (editDestinationTemplate) {
      setIsUpdatingDeletingDate(true);
      const { TravelDataJson } = editDestinationTemplate;
      const {
        ScheduleType,
        SeasonType,
        SeasonYear,
        FromDate,
        ToDate,
        TotalNights,
        TravelData,
        FromDateDateWise,
      } = TravelDataJson;
      // console.log(SeasonType, "SeasonType");

      // Normalize date formats to YYYY-MM-DD
      let normalizedFromDateDateWise = FromDateDateWise || FromDate;
      if (normalizedFromDateDateWise) {
        // Try parsing as dd-MM-yyyy
        let parsedDate = parse(
          normalizedFromDateDateWise,
          "dd-MM-yyyy",
          new Date()
        );
        if (!isValid(parsedDate)) {
          // Try parsing as YYYY-MM-DD
          parsedDate = parseISO(normalizedFromDateDateWise);
        }
        if (isValid(parsedDate)) {
          normalizedFromDateDateWise = format(parsedDate, "yyyy-MM-dd");
        } else {
          normalizedFromDateDateWise = "";
        }
      }

      let normalizedToDate = ToDate;
      if (normalizedToDate) {
        let parsedDate = parse(normalizedToDate, "dd-MM-yyyy", new Date());
        if (!isValid(parsedDate)) {
          parsedDate = parseISO(normalizedToDate);
        }
        if (isValid(parsedDate)) {
          normalizedToDate = format(parsedDate, "yyyy-MM-dd");
        } else {
          normalizedToDate = "";
        }
      }

      let normalizedFromDate = FromDate;
      if (normalizedFromDate) {
        let parsedDate = parse(normalizedFromDate, "dd-MM-yyyy", new Date());
        if (!isValid(parsedDate)) {
          parsedDate = parseISO(normalizedFromDate);
        }
        if (isValid(parsedDate)) {
          normalizedFromDate = format(parsedDate, "yyyy-MM-dd");
        } else {
          normalizedFromDate = "";
        }
      }

      setFormValue({
        ...formValue,
        TravelDateInfo: {
          ...formValue?.TravelDateInfo,
          ScheduleType: ScheduleType,
          SeasonType: SeasonType,
          SeasonYear: SeasonYear,
          FromDate: normalizedFromDate,
          ToDate: normalizedToDate,
          TotalNights: TotalNights,
          FromDateDateWise: normalizedFromDateDateWise,
        },
      });

      if (ScheduleType === "Date Wise") {
        const travel_data = TravelData?.map((data) => ({
          Date: data?.Date,
          DayNo: data?.DayNo,
          Destination: parseInt(data?.Destination),
          Enroute: parseInt(data?.Enroute),
          copy: false,
        }));
        setTravelDate(travel_data);
      }
      if (ScheduleType === "Day Wise") {
        const travel_data = TravelData?.map((data) => ({
          DayNo: data?.DayNo,
          Destination: parseInt(data?.Destination),
          Enroute: parseInt(data?.Enroute),
          Mode: data?.Mode,
          copy: false,
        }));
        setTravelDate(travel_data);
      }
    }
  }, [editDestinationTemplate]);

  useEffect(() => {
    // console.log("HFGGDYD88");
    if (FormPreviousData) {
      setDayWiseForm({
        From: FormPreviousData?.TravelDateInfo?.FromDate,
        To: FormPreviousData?.TravelDateInfo?.ToDate,
      });
    }
    if (!selectedSeason) return;

    const selectedData = dropdownState?.seasonList?.find(
      (season) => season.id === selectedSeason
    );
    // if (!selectedData)
    // console.log(selectedData, "selectedData");

    if (selectedData && !FormPreviousData) {
      setDayWiseForm({
        From: selectedData?.FromDate,
        To: selectedData?.ToDate,
      });
    }
  }, [selectedSeason, dropdownState]);

  const reducer = (state, action) => {
    switch (action.type) {
      case "INCREMENT":
        return { ...state, [action.counter]: state[action.counter] + 1 };
      case "DECREMENT":
        return {
          ...state,
          [action.counter]: Math.max(0, state[action.counter] - 1),
        };
      case "SET":
        return { ...state, [action.counter]: action.value };
      default:
        return state;
    }
  };

  const initialState = {
    counter1: 0,
    counter2: 0,
    counter3: 0,
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const { counter1, counter2, counter3 } = state;
    setFormValue({
      ...formValue,
      PaxInfo: {
        ...formValue?.PaxInfo,
        Adult: counter1,
        Child: counter2,
        Infant: counter3,
        TotalPax: counter1 + counter2 + counter3,
      },
    });
  }, [state]);

  const getFromDateDateWise = () => {
    const dateStr = formValue?.TravelDateInfo?.FromDateDateWise;
    if (!dateStr) return null;

    // Try parsing as YYYY-MM-DD
    let date = parseISO(dateStr);
    if (isValid(date)) return date;

    // Try parsing as dd-MM-yyyy
    date = parse(dateStr, "dd-MM-yyyy", new Date());
    if (isValid(date)) return date;

    return null;
  };

  const handleCalender = (date) => {
    // console.log(date, "datedate");

    const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
    const nights = parseInt(formValue?.TravelDateInfo?.TotalNights || 0);
    let toDateWise = "";

    if (date && isValid(date) && nights >= 0) {
      // Calculate ToDateWise directly from the selected date and TotalNights
      toDateWise = format(addDays(date, nights), "yyyy-MM-dd");
    } else if (!date || !isValid(date)) {
      // Handle case where date is invalid or cleared
      toDateWise = "";
    }
    setFormValue({
      ...formValue,
      TravelDateInfo: {
        ...formValue.TravelDateInfo,
        FromDateDateWise: formattedDate,
        ToDateWise: toDateWise,
      },
    });

    if (
      formValue?.TravelDateInfo?.ScheduleType === "Date Wise" &&
      formValue?.TravelDateInfo?.TotalNights >= 0
    ) {
      const fromDate = date ? date : new Date();
      // console.log(
      //   TravelDate[TravelDate.length - 1]?.Date,
      //   "TravelDate[TravelDate.length - 1]?.Date"
      // );

      if (!isValid(fromDate)) {
        const today = new Date();
        setFormValue({
          ...formValue,
          TravelDateInfo: {
            ...formValue.TravelDateInfo,
            FromDateDateWise: format(today, "yyyy-MM-dd"),
            ToDateWise: TravelDate[TravelDate.length - 1]?.Date,
          },
        });
        return;
      }

      const nights = parseInt(formValue?.TravelDateInfo?.TotalNights || 0);
      const dateArray = eachDayOfInterval({
        start: fromDate,
        end: addDays(fromDate, nights),
      }).map((date) => format(date, "yyyy-MM-dd"));

      const newTravelDate = dateArray.map((date, i) => {
        const existingItem = TravelDate[i] || {};
        return {
          Date: date,
          DayNo: i + 1,
          Destination: existingItem?.Destination || "",
          Enroute: existingItem?.Enroute || "",
          IsEnroute: existingItem?.IsEnroute || false,
          Mode: i === 0 || i === nights ? "flight" : "surface",
          copy: existingItem?.copy || false,
        };
      });

      setTravelDate(newTravelDate);
      setQueryTravelData(newTravelDate);
    }
  };
  // console.log(formValue, "formValue8888");

  return (
    <div className="row travel">
      <div className="col-lg-12">
        <div
          className="card m-0 query-box-height-main"
          style={{ minHeight: !heightAutoAdjust.includes(1) && "16.5rem" }}
        >
          <div className="card-header px-2 py-2 d-flex justify-content-between align-items-center gap-1">
            <h4 className="card-title query-title">Travel Information</h4>
            <div className="d-flex justify-content-end align-items-center gap-2 w-50">
              <label className="m-0 fw-normal">Budget</label>
              <input
                type="text"
                className="form-control form-control-sm w-50"
                id="val-username"
                name="Budget"
                value={formValue?.Budget}
                placeholder="Budget"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="card-body px-2 pb-3 pt-1">
            <div className="row">
              <div className="col-12">
                <div
                  className={`d-flex ${formValue?.TravelDateInfo?.ScheduleType === "Day Wise"
                    ? "justify-content-between align-items-end gap-2"
                    : "justify-content-between align-items-end gap-2"
                    }`}
                >
                  <div className="form-check m-0">
                    <input
                      className="form-check-input me-0"
                      id="datewise"
                      name="TravelDateInfo.ScheduleType"
                      type="radio"
                      value="Date Wise"
                      onChange={handleChange}
                      checked={
                        formValue?.TravelDateInfo?.ScheduleType === "Date Wise"
                      }
                      style={{ height: "1rem", width: "1rem" }}
                    />
                    <label
                      className="form-check-label mt-1 ms-0"
                      htmlFor="datewise"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Date Wise
                    </label>
                  </div>
                  <div className="form-check m-0">
                    <input
                      className="form-check-input me-0"
                      type="radio"
                      name="TravelDateInfo.ScheduleType"
                      id="daywise"
                      value="Day Wise"
                      onChange={handleChange}
                      checked={
                        formValue?.TravelDateInfo?.ScheduleType === "Day Wise"
                      }
                      style={{ height: "1rem", width: "1rem" }}
                    />
                    <label
                      className="form-check-label mt-1 ms-0"
                      htmlFor="daywise"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Day Wise
                    </label>
                  </div>
                  <div className="position-relative col-lg-8 mt-2">
                    <span
                      className="position-absolute px-2 dateCardFeildSet"
                      style={{
                        top: "-0.55rem",
                        left: "1rem",
                        fontSize: "0.75rem",
                        zIndex: 1,
                      }}
                    >
                      Validity
                    </span>
                    <div className="row border rounded px-2 py-2">
                      <div className="col-md-12 col-lg-6">
                        <label className="">From Date</label>
                        <DatePicker
                          // menuPortalTarget={document.body}
                          // menuPlacement="top"
                          popperProps={{
                            strategy: "fixed", // Ensures the popper is positioned relative to the viewport
                          }}
                          className="form-control form-control-sm px-1"
                          selected={selectedDayDate("From")}
                          name="TravelDateInfo.FromDate"
                          onChange={(e) => handleDayCalendor(e, "From")}
                          dateFormat="dd-MM-yyyy"
                          autoComplete="off"
                          isClearable
                          todayButton="Today"
                          maxDate={selectedDayDate("To")}
                        />
                      </div>
                      <div className="col-md-12 col-lg-6">
                        <label className="">To Date</label>
                        <DatePicker
                          popperProps={{
                            strategy: "fixed", // Ensures the popper is positioned relative to the viewport
                          }}
                          className="form-control form-control-sm px-1"
                          selected={selectedDayDate("To")}
                          name="TravelDateInfo.ToDate"
                          onChange={(e) => handleDayCalendor(e, "To")}
                          dateFormat="dd-MM-yyyy"
                          autoComplete="off"
                          isClearable
                          todayButton="Today"
                          minDate={selectedDayDate("From")}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {formValue?.TravelDateInfo?.ScheduleType === "Day Wise" && (
                <>
                  <div className="col-md-6 col-lg-6 mt-2">
                    <label htmlFor="totalnights" className="m-0"></label>
                    <select
                      name="TravelDateInfo.SeasonType"
                      id=""
                      className="form-control form-control-sm"
                      value={formValue?.TravelDateInfo?.SeasonType}
                      onChange={handleChange}
                    >
                      <option value="">Select Season</option>
                      {dropdownState?.seasonList &&
                        dropdownState?.seasonList.map((season, index) => (
                          <option value={season?.id} key={index + 1}>
                            {season?.Name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="col-4 col-md-6 col-lg-6 mt-2">
                    <label htmlFor="totalnights" className="m-0">
                      Total Nights
                      <span className="text-danger">*</span>
                    </label>
                    {errors?.TotalNights && (
                      <span className="text-danger font-size-10">
                        {errors?.TotalNights}
                      </span>
                    )}
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      placeholder="0"
                      name="TravelDateInfo.TotalNights"
                      value={formValue?.TravelDateInfo?.TotalNights}
                      onChange={handleTotalNights}
                    />
                  </div>
                </>
              )}
              {formValue?.TravelDateInfo?.ScheduleType === "Date Wise" && (
                <>
                  <div className="col-md-6 mt-2">
                    <label className="">From Date</label>
                    <DatePicker
                      className="form-control form-control-sm"
                      selected={getFromDateDateWise()}
                      name="TravelDateInfo.FromDateDateWise"
                      onChange={(e) => handleCalender(e)}
                      dateFormat="dd-MM-yyyy"
                      autoComplete="off"
                      isClearable
                      todayButton="Today"
                    />
                  </div>
                  <div className="col-4 col-md-6 mt-2">
                    <label htmlFor="totalnights">
                      Total Nights
                      <span className="text-danger">*</span>
                    </label>
                    {errors?.TotalNights && (
                      <span className="text-danger font-size-10">
                        {errors?.TotalNights}
                      </span>
                    )}
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      name="TravelDateInfo.TotalNights"
                      value={formValue?.TravelDateInfo?.TotalNights}
                      onChange={handleTotalNights}
                    />
                  </div>
                </>
              )}
              {/* {console.log(formValue?.TravelDateInfo?.ScheduleType, "GFHD87")} */}
              {formValue?.TravelDateInfo?.TotalNights !== "" &&
                formValue?.TravelDateInfo?.TotalNights >= 0 &&
                formValue?.TravelDateInfo?.FromDateDateWise !== "" &&
                formValue?.TravelDateInfo?.ScheduleType === "Date Wise" && (
                  <div className="col-12">
                    <div className="row m-2">
                      <table className="w-full border border-gray-300 rounded-lg">
                        <thead>
                          <tr>
                            <th
                              className="p-2 border font-semibold"
                              style={{ fontSize: "0.8rem" }}
                            >
                              Date/Day
                            </th>
                            <th
                              className="p-2 border font-semibold"
                              style={{ fontSize: "0.8rem" }}
                            >
                              Destination
                            </th>
                            <th></th>
                            <th
                              className="p-2 border font-semibold"
                              style={{ fontSize: "0.8rem" }}
                            >
                              Enroute
                            </th>
                            <th
                              className="p-2 border font-semibold"
                              style={{ fontSize: "0.8rem" }}
                            >
                              Mode
                            </th>
                            <th
                              className="p-2 border font-semibold"
                              style={{ fontSize: "0.8rem", width: "70px" }}
                            >
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {TravelDate?.map((item, index) => (
                            <tr key={index} className="font-size10">
                              <td className="p-2 border text-start text-black font-size10">
                                {moment(item?.Date).format("DD-MM-YYYY")}/Day{" "}
                                {item?.DayNo}
                              </td>
                              <td className="p-2 border text-black font-size10">
                                <Select
                                  options={destinationOption}
                                  value={destinationOption?.find(
                                    (option) =>
                                      option?.value === item?.Destination
                                  )}
                                  onChange={(selectedOption) =>
                                    handleDestinationChange(
                                      selectedOption,
                                      index
                                    )
                                  }
                                  className="customSelectLightTheame"
                                  classNamePrefix="custom"
                                  styles={customStyles}
                                  components={{ DropdownIndicator: () => null }}
                                  placeholder="Select"
                                  menuPlacement="top"
                                  menuPosition="fixed"
                                  filterOption={(option, inputValue) =>
                                    option.label
                                      .toLowerCase()
                                      .startsWith(inputValue.toLowerCase())
                                  }
                                />
                              </td>
                              <td></td>
                              <td className="p-2 border text-black font-size10">
                                <Select
                                  options={enrouteOption}
                                  ref={selectRef}
                                  value={enrouteOption?.find(
                                    (option) => option?.value === item?.Enroute
                                  )}
                                  onChange={(selectedOption) =>
                                    handleEnrouteChange(selectedOption, index)
                                  }
                                  className="customSelectLightTheame"
                                  classNamePrefix="custom"
                                  styles={customStyles}
                                  components={{ DropdownIndicator: () => null }}
                                  placeholder="Select"
                                  menuPlacement="top"
                                  menuPosition="fixed"
                                  menuRef={menuRef}
                                />
                              </td>
                              <td className="p-2 border">
                                <Select
                                  className="customSelectLightTheame"
                                  classNamePrefix="custom"
                                  styles={customStyles}
                                  components={{ DropdownIndicator: () => null }}
                                  menuPlacement="top"
                                  menuPosition="fixed"
                                  placeholder="Select"
                                  value={travelModes.find(
                                    (mode) => mode.value === item?.Mode
                                  )}
                                  options={travelModes}
                                  onChange={(selectedOption) =>
                                    handleModeChange(selectedOption, index)
                                  }
                                />
                              </td>
                              <td className="p-2 text-center border">
                                {index === TravelDate?.length - 1 && (
                                  <i
                                    className="fa-solid fa-plus text-secondary pe-1 cursor-pointer travaliconFont"
                                    onClick={() => handleCopyRow(item, index)}
                                  ></i>
                                )}
                                {(item.copy ||
                                  index === TravelDate?.length - 1) &&
                                  TravelDate?.length > 1 && (
                                    <i
                                      className="fa-solid fa-trash p-1 text-danger cursor-pointer travaliconFont"
                                      onClick={() => dateDeleting(item, index)}
                                    ></i>
                                  )}
                                {!item.copy &&
                                  index !== TravelDate?.length - 1 && (
                                    <i
                                      className="fa-solid fa-copy cursor-pointer text-red-500 hover:text-red-700 travaliconFont"
                                      onClick={() =>
                                        copyParticularRow(item, index)
                                      }
                                    ></i>
                                  )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              {formValue?.TravelDateInfo?.ScheduleType === "Day Wise" &&
                formValue?.TravelDateInfo?.TotalNights !== "" &&
                formValue?.TravelDateInfo?.TotalNights >= 0 && (
                  <div className="col-12 p-1">
                    <div className="row m-2">
                      <table className="w-full border border-gray-300 rounded-lg">
                        <thead>
                          <tr>
                            <th
                              style={{ fontSize: "0.8rem" }}
                              className="p-2 border font-semibold"
                            >
                              Day
                            </th>
                            <th
                              style={{ fontSize: "0.8rem" }}
                              className="p-2 border font-semibold"
                            >
                              Destination
                            </th>
                            <th
                              style={{ fontSize: "0.8rem" }}
                              className="p-2 border font-semibold"
                            >
                              Enroute
                            </th>
                            <th
                              style={{ fontSize: "0.8rem" }}
                              className="p-2 border font-semibold"
                            >
                              Mode
                            </th>
                            <th
                              style={{ fontSize: "0.8rem", width: "70px" }}
                              className="p-2 border font-semibold"
                            >
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {TravelDate?.map((item, index) => (
                            <tr key={index} className="text-sm text-gray-700">
                              <td className="p-2 border text-center">
                                {item?.DayNo}
                              </td>
                              <td className="p-2 border">
                                <Select
                                  options={destinationOption}
                                  value={destinationOption?.find(
                                    (option) =>
                                      option?.value === item?.Destination
                                  )}
                                  onChange={(selectedOption) =>
                                    handleDestinationChange(
                                      selectedOption,
                                      index
                                    )
                                  }
                                  className="customSelectLightTheame"
                                  classNamePrefix="custom"
                                  styles={customStyles}
                                  components={{ DropdownIndicator: () => null }}
                                  placeholder="Select"
                                  menuPlacement="top"
                                  menuPosition="fixed"
                                  filterOption={(option, inputValue) =>
                                    option.label
                                      .toLowerCase()
                                      .startsWith(inputValue.toLowerCase())
                                  }
                                />
                              </td>
                              <td className="p-2 border">
                                <Select
                                  options={enrouteOption}
                                  value={enrouteOption?.find(
                                    (option) => option?.value === item?.Enroute
                                  )}
                                  onChange={(selectedOption) =>
                                    handleEnrouteChange(selectedOption, index)
                                  }
                                  className="customSelectLightTheame"
                                  classNamePrefix="custom"
                                  styles={customStyles}
                                  components={{ DropdownIndicator: () => null }}
                                  placeholder="Select"
                                  menuPlacement="top"
                                  menuPosition="fixed"
                                />
                              </td>
                              <td className="p-2 border">
                                <Select
                                  className="customSelectLightTheame"
                                  classNamePrefix="custom"
                                  styles={customStyles}
                                  components={{ DropdownIndicator: () => null }}
                                  placeholder="Select"
                                  value={travelModes.find(
                                    (mode) => mode.value === item?.Mode
                                  )}
                                  options={travelModes}
                                  onChange={(selectedOption) =>
                                    handleModeChange(selectedOption, index)
                                  }
                                  menuPlacement="top"
                                  menuPosition="fixed"
                                />
                              </td>
                              <td className="p-2 border text-center">
                                {index === TravelDate?.length - 1 && (
                                  <i
                                    className="fa-solid fa-plus text-secondary pe-1 cursor-pointer travaliconFont"
                                    onClick={() => handleCopyRow(item, index)}
                                  ></i>
                                )}
                                {(item.copy ||
                                  index === TravelDate?.length - 1) &&
                                  TravelDate?.length > 1 && (
                                    <i
                                      className="fa-solid fa-trash p-1 text-danger cursor-pointer travaliconFont"
                                      onClick={() => dateDeleting(item, index)}
                                    ></i>
                                  )}
                                {!item.copy &&
                                  index !== TravelDate?.length - 1 && (
                                    <i
                                      className="fa-solid fa-copy ml-3 cursor-pointer text-red-500 hover:text-red-700 travaliconFont"
                                      onClick={() =>
                                        copyParticularRow(item, index)
                                      }
                                    ></i>
                                  )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(TravelInfo);
