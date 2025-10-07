import React, {
  useState,
  useEffect,
  useContext,
  useReducer,
  useRef,
} from "react";
import { eachDayOfInterval, format, addDays, parseISO } from "date-fns";
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
import { m, transform } from "framer-motion";
import { ThemeContext } from "../../../../../context/ThemeContext";
import { useDispatch, useSelector } from "react-redux";

const TravelInfo = ({ queryType }) => {
  const location = useLocation();
  const FormPreviousData = location.state;

  const travelModes = [
    { value: "flight", label: "Flight" },
    { value: "train", label: "Train" },
    { value: "surface", label: "Surface" },
  ];

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
  const [selectedSeason, setSelectedSeason] = useState(17);
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
  // const [dayWiseForm, setDayWiseForm] = useState({
  //   From: "",
  //   To: "",
  // });

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
  useEffect(() => {
    setFormValue({
      ...formValue,
      TravelDateInfo: {
        ...formValue.TravelDateInfo,
        SeasonType: dropdownState?.seasonList?.[0]?.id,
      },
    });
  }, [formValue?.TravelDateInfo?.ScheduleType]);

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
    if (pereferenceList?.TravelInfo) {
      setFormValue({
        ...formValue,
        TravelDateInfo: {
          ...formValue?.TravelDateInfo,
          ScheduleType:
            pereferenceList?.TravelInfo == "Day wise"
              ? "Day Wise"
              : "Date Wise",
        },
      });
    }
  }, [pereferenceList]);

  const [errors, setErrors] = useState();
  const fiftyYear = [];
  const handleDayCalendor = (date, type) => {
    const formattedDate = date.toISOString().split("T")[0];

    if (type == "From") {
      setDayWiseForm({ ...dayWiseForm, From: formattedDate });
    }
    if (type == "To") {
      setDayWiseForm({ ...dayWiseForm, To: formattedDate });
    }
  };

  const selectedDayDate = (type) => {
    if (type == "From") {
      return dayWiseForm?.From ? new Date(dayWiseForm?.From) : null;
    }
    if (type == "To") {
      return dayWiseForm?.To ? new Date(dayWiseForm?.To) : null;
    }
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
      height: "2rem", // compact height
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
      zIndex: 9999, // only number here
    }),
    menuList: (base) => ({
      ...base,
      paddingTop: 0,
      paddingBottom: 0,
      maxHeight: "150px",
      overflowY: "scroll",

      // Scrollbar hidden CSS
      scrollbarWidth: "none", // Firefox
      msOverflowStyle: "none", // IE 10+
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

  // const days = [
  //   "Sunday",
  //   "Monday",
  //   "Tuesday",
  //   "Wednesday",
  //   "Thursday",
  //   "Friday",
  //   "Saturday",
  // ];

  // date.setDate(
  //   date.getDate() + parseInt(formValue?.TravelDateInfo?.TotalNights)
  // );

  // const date = new Date();
  // const formattedToDate = date.toISOString()?.split("T")[0];
  // setFormValue({
  //   ...formValue,
  //   TravelDateInfo: {
  //     ...formValue?.TravelDateInfo,
  //     FromDate: formattedToDate,
  //     ToDate: "",
  //   },
  // });

  // const dayWiseArray = [];

  // for (
  //   let i = 1;
  //   i <= parseInt(formValue?.TravelDateInfo?.TotalNights) + 1;
  //   i++
  // ) {
  //   dayWiseArray.push(i);
  // }

  // const arrayOfDay = dayWiseArray.map((day, index) => {
  //   // Check if travelDate already has a value at this index
  //   const existingDateEntry = TravelDate[index] || {};

  //   return {
  //     DayNo: day,
  //     // Country: parseInt(existingDateEntry.Country) || "", // Retain existing Country if available
  //     Destination: parseInt(existingDateEntry.Destination) || "", // Retain existing Destination if available
  //     Enroute: parseInt(existingDateEntry.Enroute) || "",
  //   };
  // });

  // setTravelDate(arrayOfDay);

  // useEffect(() => {
  //   const { ScheduleType, FromDate, ToDate } = formValue?.TravelDateInfo || {};

  //   if (ScheduleType !== "Date Wise") return;

  //   const fromDate = FromDate
  //     ? new Date(FromDate.split("/").reverse().join("/"))
  //     : null;
  //   const toDate = ToDate
  //     ? new Date(ToDate.split("/").reverse().join("/"))
  //     : null;

  //   if (!fromDate || !toDate || fromDate > toDate) return;

  //   // Don't regenerate if the change came from Copy/Delete/Manual Add
  //   if (
  //     TrackDataOfTravelInfo === "ManualAdd" ||
  //     TrackDataOfTravelInfo === "Copy"
  //   ) {
  //     setTrackDataOfTravelInfo(""); // Reset flag
  //     return;
  //   }

  //   const dateArray = eachDayOfInterval({ start: fromDate, end: toDate }).map(
  //     (date) => format(date, "yyyy-MM-dd")
  //   );

  //   const newTravelDate = dateArray.map((date, index) => {
  //     const existingDateEntry = TravelDate[index] || {};

  //     if (TrackDataOfTravelInfo === "NormalCopy") {
  //       return existingDateEntry;
  //     }

  //     const isFirstOrLast = index === 0 || index === dateArray.length - 1;
  //     const modeValue = isFirstOrLast
  //       ? "flight"
  //       : existingDateEntry?.Mode || TravelDate[index]?.Mode || "surface";

  //     return {
  //       ...existingDateEntry,
  //       Date:
  //         TrackDataOfTravelInfo === "HardCopy" ? existingDateEntry?.Date : date,
  //       DayNo:
  //         TrackDataOfTravelInfo === "HardCopy"
  //           ? existingDateEntry?.DayNo
  //           : index + 1,
  //       Destination: existingDateEntry?.Destination || "",
  //       Enroute: existingDateEntry?.Enroute || "",
  //       IsEnroute: existingDateEntry?.IsEnroute || false,
  //       Mode: modeValue,
  //     };
  //   });

  //   if (TrackDataOfTravelInfo === "NormalCopy") {
  //     const lastIndex = newTravelDate.length - 1;
  //     if (lastIndex > 0) {
  //       newTravelDate[lastIndex].DayNo =
  //         newTravelDate[lastIndex - 1]?.DayNo + 1;
  //     }
  //   }

  //   const previousTravelData = FormPreviousData?.TravelDateInfo?.TravelData;

  //   if (TakingLength > 1 && previousTravelData) {
  //     setTravelDate(newTravelDate);
  //     setQueryTravelData(newTravelDate);
  //   } else if (previousTravelData) {
  //     if (
  //       newTravelDate.length > previousTravelData.length ||
  //       TrackDataOfTravelInfo
  //     ) {
  //       setTravelDate(newTravelDate);
  //       setQueryTravelData(newTravelDate);
  //     } else {
  //       setTravelDate(previousTravelData);
  //       setQueryTravelData(previousTravelData);
  //     }
  //   } else {
  //     setTravelDate(newTravelDate);
  //     setQueryTravelData(newTravelDate);
  //   }

  //   setTrackDataOfTravelInfo("");
  // }, [formValue?.TravelDateInfo?.FromDate, formValue?.TravelDateInfo?.ToDate]);

  // useEffect(() => {
  //   const { ScheduleType, FromDate, ToDate } = formValue?.TravelDateInfo || {};

  //   if (ScheduleType !== "Date Wise") return;

  //   const fromDate = FromDate
  //     ? new Date(FromDate.split("/").reverse().join("/"))
  //     : null;
  //   const toDate = ToDate
  //     ? new Date(ToDate.split("/").reverse().join("/"))
  //     : null;

  //   if (!fromDate || !toDate || fromDate > toDate) return;

  //   // Skip regeneration for Copy, ManualAdd, or HardCopy
  //   if (
  //     TrackDataOfTravelInfo === "ManualAdd" ||
  //     TrackDataOfTravelInfo === "Copy" ||
  //     TrackDataOfTravelInfo === "HardCopy"
  //   ) {
  //     setTrackDataOfTravelInfo("");
  //     return;
  //   }

  //   const dateArray = eachDayOfInterval({ start: fromDate, end: toDate }).map(
  //     (date) => format(date, "yyyy-MM-dd")
  //   );

  //   const newTravelDate = dateArray.map((date, index) => {
  //     const existingDateEntry = TravelDate[index] || {};
  //     const isFirstOrLast = index === 0 || index === dateArray.length - 1;
  //     const modeValue = isFirstOrLast
  //       ? "flight"
  //       : existingDateEntry?.Mode || TravelDate[index]?.Mode || "surface";

  //     return {
  //       // ...existingDateEntry,
  //       Date: existingDateEntry?.date || date,
  //       DayNo:
  //         TrackDataOfTravelInfo === "HardCopy"
  //           ? existingDateEntry?.DayNo
  //           : index + 1,
  //       Destination: existingDateEntry?.Destination || "",
  //       Enroute: existingDateEntry?.Enroute || "",
  //       IsEnroute: existingDateEntry?.IsEnroute || false,
  //       Mode: modeValue,
  //     };
  //   });

  //   const previousTravelData = FormPreviousData?.TravelDateInfo?.TravelData;

  //   if (TakingLength > 1 && previousTravelData) {
  //     setTravelDate(newTravelDate);
  //     setQueryTravelData(newTravelDate);
  //   } else if (previousTravelData) {
  //     if (newTravelDate.length > previousTravelData.length) {
  //       setTravelDate(newTravelDate);
  //       setQueryTravelData(newTravelDate);
  //     } else {
  //       setTravelDate(previousTravelData);
  //       setQueryTravelData(previousTravelData);
  //     }
  //   } else {
  //     setTravelDate(newTravelDate);
  //     setQueryTravelData(newTravelDate);
  //   }

  //   setTrackDataOfTravelInfo("");
  // }, [formValue?.TravelDateInfo?.FromDate, formValue?.TravelDateInfo?.ToDate]);

  // function createDateArray() {
  //   if (formValue?.TravelDateInfo?.ScheduleType === "Date Wise") {
  //     const fromDate = formValue?.TravelDateInfo?.FromDate
  //       ? new Date(
  //           formValue.TravelDateInfo.FromDate.split("/").reverse().join("/")
  //         )
  //       : null;

  //     const lastDate = formValue?.TravelDateInfo?.ToDate
  //       ? new Date(
  //           formValue.TravelDateInfo.ToDate.split("/").reverse().join("/")
  //         )
  //       : null;

  //     if (fromDate && lastDate && fromDate <= lastDate) {
  //       const dateArray = eachDayOfInterval({
  //         start: fromDate,
  //         end: lastDate,
  //       }).map((date) => format(date, "yyyy-MM-dd"));

  //       const arrayOfDate = dateArray.map((date, index) => {
  //         const existingDateEntry = TravelDate[index] || {};

  //         if (TrackDataOfTravelInfo === "NormalCopy") {
  //           return existingDateEntry;
  //         }

  //         // Determine Mode: First and last dates should be "Flight", others use existing or empty
  //         const isFirstOrLast = index === 0 || index === dateArray.length - 1;
  //         const modeValue = isFirstOrLast
  //           ? "flight"
  //           : existingDateEntry?.Mode || TravelDate[index]?.Mode || "";

  //         return {
  //           Date:
  //             TrackDataOfTravelInfo === "HardCopy"
  //               ? existingDateEntry?.Date
  //               : date,
  //           DayNo:
  //             TrackDataOfTravelInfo === "HardCopy"
  //               ? existingDateEntry?.DayNo
  //               : index + 1,
  //           Destination: parseInt(existingDateEntry?.Destination) || "",
  //           Enroute: parseInt(existingDateEntry?.Enroute) || "",
  //           Mode: modeValue,
  //           isEnroute: false,
  //         };
  //       });

  //       setTravelDate(arrayOfDate);
  //     }
  //   }
  // }

  useEffect(() => {
    if (
      formValue?.TravelDateInfo?.FromDate &&
      formValue?.TravelDateInfo?.TotalNights > 0 &&
      formValue?.TravelDateInfo?.ScheduleType == "Date Wise"
    ) {
      const date = new Date(formValue?.TravelDateInfo?.FromDate);
      date.setDate(
        date.getDate() + parseInt(formValue?.TravelDateInfo?.TotalNights)
      );
      const formattedToDate = date.toISOString()?.split("T")[0];
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

    if (
      formValue?.TravelDateInfo?.TotalNights > 0 &&
      formValue?.TravelDateInfo?.ScheduleType == "Day Wise"
    ) {
      const date = new Date(
        dayWiseForm?.From != "" ? dayWiseForm?.From : new Date()
      );

      date.setDate(
        date.getDate() + parseInt(formValue?.TravelDateInfo?.TotalNights)
      );

      const formattedToDate = date?.toISOString()?.split("T")[0];

      // setDayWiseForm({ ...dayWiseForm, To: formattedToDate });
      // strop to update automate when total night increase
    }

    // createDateArray();
  }, [
    formValue?.TravelDateInfo?.FromDate,
    formValue?.TravelDateInfo?.ToDate,
    formValue?.TravelDateInfo?.TotalNights,
    formValue?.TravelDateInfo?.ScheduleType,
    // dayWiseForm?.To,
    dayWiseForm?.From,
  ]);

  // useEffect(() => {
  //   setFormValue({
  //     ...formValue,
  //     TravelDateInfo: {
  //       ...formValue?.TravelDateInfo,

  //       ToDate: "",
  //       TotalNights: 0,
  //     },
  //   });
  // }, [formValue?.TravelDateInfo?.ScheduleType]);

  // useEffect(() => {
  //   const checkDropdownPosition = () => {
  //     console.log(window.innerHeight , rect.top,"164")
  //     if (menuRef.current) {
  //       const rect = menuRef.current.getBoundingClientRect();
  //       const spaceBelow = window.innerHeight ;
  //       const spaceAbove = rect.top;
  //       if (spaceBelow > spaceAbove) {
  //         setMenuPlacement("bottom");
  //       } else {
  //         setMenuPlacement("top");
  //       }
  //     }
  //   };
  //   checkDropdownPosition();
  //   window.addEventListener("resize", checkDropdownPosition);
  //   return () => {
  //     window.removeEventListener("resize", checkDropdownPosition);
  //   };
  // }, [destinationOption]);

  //CURRENT YEAR + 50 YEAR DATA
  if (formValue?.TravelDateInfo?.ScheduleType == "Day Wise") {
    const currentYear = new Date().getFullYear();
    for (let i = 0; i <= 5; i++) {
      fiftyYear.push(currentYear + i);
    }
  }

  const handleTotalNights = (e) => {
    const { name, value } = e.target;

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
    setTakingLength((pre) => pre + 1);

    //   if (fromDate) {
    //     let toDateCalc = new Date(fromDate);
    //     console.log(toDateCalc.getDate() + parseInt(value), "281")
    //     const currentYear = new Date().getFullYear();
    //     const currentMonth = new Date().getMonth();
    //     const currentDate = toDateCalc.getDate() + parseInt(value);

    //     const fullDate = `${currentYear}/${currentMonth}/${currentDate}`

    //     console.log(fullDate , "fullDate")

    //     setToDate(fullDate);
    // }
  };

  // handling form value
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

      // setDayWiseForm({
      //   ...dayWiseForm,
      //   From: newFormData.TravelDateInfo.FromDate,
      //   To: newFormData.TravelDateInfo,
      // });
      // setFormValue({

      //   TravelDateInfo: {
      //     ...formValue.TravelDateInfo,
      //     FromDate: new Date(),
      //   },
      // });
    }
  };

  const handleCopyRow = (item, index) => {
    setTrackDataOfTravelInfo("NormalCopy");
    const newRow = { ...item };
    const updatedTravelDate = [...TravelDate];
    updatedTravelDate.splice(index + 1, 0, newRow);
    setFormValue({
      ...formValue, // Spread the existing form values
      TravelDateInfo: {
        ...formValue.TravelDateInfo, // Spread the existing TravelDateInfo
        TotalNights: TravelDate.length, // Update TotalNights properly
      },
    });
    setTravelDate(updatedTravelDate);
  };

  const copyParticularRow = (item, index) => {
    setTrackDataOfTravelInfo("HardCopy");
    const newRow = { ...item, copy: true }; // Copy all fields exactly
    const updatedTravelDate = [...TravelDate];
    updatedTravelDate.splice(index + 1, 0, newRow);
    setTravelDate(updatedTravelDate);
    setQueryTravelData(updatedTravelDate);
    // setFormValue({
    //   ...formValue,
    //   TravelDateInfo: {
    //     ...formValue.TravelDateInfo,
    //     TotalNights: updatedTravelDate.length - 1,
    //   },
    // });
  };

  const dateDeleting = (item, index) => {
    setTrackDataOfTravelInfo("HardCopy");
    const updatedTravelDate = [...TravelDate];
    console.log(updatedTravelDate, "updatedTravelDate");
    updatedTravelDate.splice(index, 1);
    // updatedTravelDate.filter((item) => item.copy !== true);
    // console.log(newUpdate, "updatedTravelDate");
    if (updatedTravelDate.length > 1) {
      setFormValue({
        ...formValue,
        TravelDateInfo: {
          ...formValue.TravelDateInfo,
          TotalNights:
            updatedTravelDate.filter((item) => item.copy !== true).length - 1,
        },
      });
    }
    setTravelDate(updatedTravelDate); // Update state
  };

  let count = 0;
  const handleCopyData = (item, index) => {
    return `Day${item?.Date === TravelDate[index - 1]?.Date ? count : ++count}`;
  };

  // country value stted into TravelDate Country coulmn
  const handleCountrChange = (selectedOption, index) => {
    const updatedTravelDate = [...TravelDate];
    updatedTravelDate[index].Country = selectedOption.value;
    setTravelDate(updatedTravelDate);
  };

  const dispatchTravel = useDispatch();
  const selectorTravel = useSelector((state) => state?.queryTravelData || []);
  const [queryTravelData, setQueryTravelData] = useState([]);
  // destination value stted into TravelDate destination coulmn
  const handleDestinationChange = (selectedOption, index) => {
    const updatedTravelDate = [...TravelDate];
    updatedTravelDate[index].Destination = selectedOption.value;
    setTravelDate(updatedTravelDate);
    setQueryTravelData(updatedTravelDate);
  };
  const handleEnrouteChange = (selectedOption, index) => {
    // updating isEnroute according to Enroute
    const updatedTravelDate = [...TravelDate];
    updatedTravelDate[index].Enroute = selectedOption.value;
    updatedTravelDate[index].IsEnroute = selectedOption.value ? true : false;
    setTravelDate(updatedTravelDate);
    setQueryTravelData(updatedTravelDate);
  };

  // =============================================================

  // Date Wise Code

  useEffect(() => {
    const { ScheduleType, FromDate, FromDateDateWise, ToDate } =
      formValue?.TravelDateInfo || {};

    if (ScheduleType !== "Date Wise") return;

    const fromDate = FromDate
      ? new Date(FromDate.split("/").reverse().join("/"))
      : null;
    const toDate = ToDate
      ? new Date(ToDate.split("/").reverse().join("/"))
      : null;

    if (!fromDate || !toDate || fromDate > toDate) return;

    // Don't regenerate if the change came from Copy/Delete/Manual Add
    if (
      TrackDataOfTravelInfo === "ManualAdd" ||
      TrackDataOfTravelInfo === "Copy"
    ) {
      setTrackDataOfTravelInfo(""); // Reset flag
      return;
    }

    const dateArray = eachDayOfInterval({ start: fromDate, end: toDate }).map(
      (date) => format(date, "yyyy-MM-dd")
    );

    const newTravelDate = dateArray.map((date, index) => {
      const existingDateEntry = TravelDate[index] || {};

      if (TrackDataOfTravelInfo === "NormalCopy") {
        return existingDateEntry;
      }

      return {
        ...existingDateEntry,
        Date:
          TrackDataOfTravelInfo === "HardCopy" ? existingDateEntry?.Date : date,
        DayNo:
          TrackDataOfTravelInfo === "HardCopy"
            ? existingDateEntry?.DayNo
            : index + 1,
        Destination: existingDateEntry?.Destination || "",
        Enroute: existingDateEntry?.Enroute || "",
        IsEnroute: existingDateEntry?.IsEnroute || false,

        Mode:
          index === 0 || index === dateArray.length - 1 ? "flight" : "surface",
      };
    });

    if (TrackDataOfTravelInfo === "NormalCopy") {
      const lastIndex = newTravelDate.length - 1;
      if (lastIndex > 0) {
        newTravelDate[lastIndex].DayNo =
          newTravelDate[lastIndex - 1]?.DayNo + 1;
        // copy date
        const prevDate = parseISO(newTravelDate[lastIndex - 1]?.Date);

        // add 1 day
        const nextDate = addDays(prevDate, 1);

        // format back to 'yyyy-MM-dd'
        newTravelDate[lastIndex].Date = format(nextDate, "yyyy-MM-dd");
      }
    }

    const previousTravelData = FormPreviousData?.TravelDateInfo?.TravelData;

    if (TakingLength > 1 && previousTravelData) {
      setTravelDate(newTravelDate);
      setQueryTravelData(newTravelDate);
    } else if (previousTravelData) {
      if (
        newTravelDate.length > previousTravelData.length ||
        TrackDataOfTravelInfo
      ) {
        setTravelDate(newTravelDate);
        setQueryTravelData(newTravelDate);
      } else {
        setTravelDate(previousTravelData);
        setQueryTravelData(previousTravelData);
      }
    } else {
      setTravelDate(newTravelDate);
      setQueryTravelData(newTravelDate);
    }

    setTrackDataOfTravelInfo("");
  }, [
    formValue?.TravelDateInfo?.FromDate,
    formValue?.TravelDateInfo?.ToDate,
    formValue?.TravelDateInfo?.ScheduleType,
  ]);

  // =============================================================

  // Day Wise Code

  useEffect(() => {
    const { ScheduleType } = formValue?.TravelDateInfo || {};
    if (ScheduleType === "Date Wise") return;

    const nights = Number(formValue?.TravelDateInfo?.TotalNights) + 1;
    if (!nights || isNaN(nights)) return;

    // Don't regenerate if the change came from Copy/Delete/Manual Add
    if (
      TrackDataOfTravelInfo === "ManualAdd" ||
      TrackDataOfTravelInfo === "Copy"
    ) {
      setTrackDataOfTravelInfo(""); // Reset flag
      return;
    }

    const newTravelDate = Array.from({ length: nights }, (_, i) => {
      const existingItem = TravelDate[i] || {};

      if (TrackDataOfTravelInfo === "NormalCopy") return existingItem;

      return {
        ...existingItem,
        DayNo:
          TrackDataOfTravelInfo === "HardCopy" ? existingItem?.DayNo : i + 1,
        Destination: existingItem?.Destination || "",
        Enroute: existingItem?.Enroute || "",
        IsEnroute: existingItem?.IsEnroute || false,
        Mode: i === 0 || i === nights - 1 ? "flight" : "surface",
        copy: false,
      };
    });

    if (TrackDataOfTravelInfo === "NormalCopy") {
      const lastIndex = newTravelDate.length - 1;
      if (lastIndex > 0) {
        newTravelDate[lastIndex].DayNo =
          newTravelDate[lastIndex - 1]?.DayNo + 1;
      }
    }

    const previousTravelData = FormPreviousData?.TravelDateInfo?.TravelData;

    if (TakingLength > 1 && previousTravelData) {
      setTravelDate(newTravelDate);
      setQueryTravelData(newTravelDate);
    } else if (previousTravelData) {
      if (
        newTravelDate.length > previousTravelData.length ||
        TrackDataOfTravelInfo
      ) {
        setTravelDate(newTravelDate);
        setQueryTravelData(newTravelDate);
      } else {
        setTravelDate(previousTravelData);
        setQueryTravelData(previousTravelData);
      }
    } else {
      setTravelDate(newTravelDate);
      setQueryTravelData(newTravelDate);
    }

    setTrackDataOfTravelInfo("");
  }, [formValue?.TravelDateInfo?.TotalNights]);

  // =============================================================

  const handleModeChange = (selectedValue, index) => {
    const updatedTravelDate = [...TravelDate];
    updatedTravelDate[index].Mode = selectedValue.value; // Use selectedValue directly
    setTravelDate(updatedTravelDate);
    setQueryTravelData(updatedTravelDate);
  };

  // setting value inside TravelInfo from destination template
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
      } = TravelDataJson;

      setFormValue({
        ...formValue,
        TravelDateInfo: {
          ...formValue?.TravelDateInfo,
          ScheduleType: ScheduleType,
          SeasonType: SeasonType,
          SeasonYear: SeasonYear,
          FromDate: FromDate,
          ToDate: ToDate,
          TotalNights: TotalNights,
        },
      });

      if (ScheduleType == "Date Wise") {
        const travel_data = TravelData?.map((data) => {
          return {
            Date: data?.Date,
            Day: data?.Day,
            Destination: parseInt(data?.Destination),
            Enroute: parseInt(data?.Enroute),
          };
        });
        setTravelDate(travel_data);
      }
      if (ScheduleType == "Day Wise") {
        const travel_data = TravelData?.map((data) => {
          return {
            Day: data?.Day,
            // Date: data?.Date,
            // Country: parseInt(data?.Country),
            Destination: parseInt(data?.Destination),
            Enroute: parseInt(data?.Enroute),
            Mode: parseInt(data?.Mode),
          };
        });
        setTravelDate(travel_data);
      }
    }
  }, [editDestinationTemplate]);

  useEffect(() => {
    if (FormPreviousData) {
      setDayWiseForm({
        From: FormPreviousData?.TravelDateInfo?.FromDate,
        To: FormPreviousData?.TravelDateInfo?.ToDate,
      });
    }

    const selectedData = dropdownState?.seasonList?.find(
      (season) => season.id === selectedSeason
    );

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
        return {
          ...state,
          [action.counter]: (state[action.counter] = action.value),
        };
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

  const getFromDate = () => {
    // if (FormPreviousData) {
    //   return new Date(FormPreviousData?.TravelDateInfo?.FromDateDateWise);
    // } else {
    //   return formValue?.TravelDateInfo?.FromDate
    //     ? new Date(formValue?.TravelDateInfo?.FromDate)
    //     : null;
    // }

    return formValue?.TravelDateInfo?.FromDate
      ? new Date(formValue?.TravelDateInfo?.FromDate)
      : null;
  };

  const handleCalender = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    setFormValue({
      ...formValue,
      TravelDateInfo: {
        ...formValue.TravelDateInfo,
        FromDate: formattedDate,
        FromDateDateWise: formattedDate,
      },
    });
  };

  return (
    <div className="row travel">
      <div className="col-lg-12">
        <div
          className="card m-0 query-box-height-main"
          style={{ minHeight: !heightAutoAdjust.includes(1) && "16.5rem" }}
        >
          <div className="card-header px-2 py-2 d-flex justify-content-between align-items-center gap-1">
            <h4 className="card-title query-title">Travel Information</h4>
            <div className="d-flex justify-content-center align-items-center gap-2 w-50">
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
                  className={`d-flex ${
                    formValue?.TravelDateInfo?.ScheduleType === "Day Wise"
                      ? "justify-content-between flex-wrap align-items-end gap-3"
                      : "justify-content-between flex-wrap align-items-end gap-3"
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
                        formValue?.TravelDateInfo?.ScheduleType == "Date Wise"
                      }
                      style={{ height: "1rem", width: "1rem" }}
                    />
                    <label
                      className="form-check-label mt-1 ms-0"
                      htmlFor="datewise"
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
                        formValue?.TravelDateInfo?.ScheduleType == "Day Wise"
                      }
                      style={{ height: "1rem", width: "1rem" }}
                    />
                    <label
                      className="form-check-label mt-1 ms-0"
                      htmlFor="daywise"
                    >
                      Day Wise
                    </label>
                  </div>

                  <>
                    <div className="d-flex">
                      {/* <label className="mb-1" style={{fontSize:'0.8rem'}}>
                          Validity
                        </label> */}
                      <span>Validity</span>
                    </div>
                    <div className="col-md-12 col-lg-3 p-0 ">
                      <label className="">From Date</label>
                      <DatePicker
                        className="form-control form-control-sm px-1"
                        selected={selectedDayDate("From")}
                        name="TravelDateInfo.FromDate"
                        onChange={(e) => handleDayCalendor(e, "From")}
                        dateFormat="dd-MM-yyyy"
                        autocomplete="off"
                        style={{
                          transform: " translate3d(7px, 90px, 0px)",
                          fontSize: ".5rem",
                        }}
                        isClearable todayButton="Today"
                      />
                    </div>
                    <div className="col-md-12 col-lg-3 p-0">
                      <label className="">To Date </label>
                      <DatePicker
                        className="form-control form-control-sm px-1"
                        selected={selectedDayDate("To")}
                        name="TravelDateInfo.FromDate"
                        onChange={(e) => handleDayCalendor(e, "To")}
                        dateFormat="dd-MM-yyyy"
                        autocomplete="off"
                        style={{
                          transform: " translate3d(7px, 90px, 0px)",
                        }}
                        isClearable todayButton="Today"
                      />
                    </div>
                  </>
                </div>
              </div>
              {formValue?.TravelDateInfo?.ScheduleType == "Day Wise" && (
                <>
                  <div className="col-md-12 col-lg-4 pt-3">
                    <select
                      name="TravelDateInfo.SeasonType"
                      id=""
                      className="form-control form-control-sm"
                      value={formValue?.TravelDateInfo?.SeasonType}
                      onChange={handleChange}
                    >
                      <option value="">Select Season</option>
                      {dropdownState?.seasonList &&
                        dropdownState?.seasonList.map((season, index) => {
                          return (
                            <option value={season?.id} key={index + 1}>
                              {season?.Name}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                  <div className="col-md-12 col-lg-4 mt-sm-2 mt-lg-0 pt-3">
                    <select
                      name="TravelDateInfo.SeasonYear"
                      id=""
                      className="form-control form-control-sm"
                      value={formValue?.TravelDateInfo?.SeasonYear}
                      onChange={handleChange}
                    >
                      {/* <option value="">Select Year</option> */}
                      {fiftyYear &&
                        fiftyYear?.map((year, index) => {
                          return (
                            <option value={year} key={index + 1}>
                              {year}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                  <div className="col-4 col-md-6  col-lg-4 mt-3 mt-lg-0 pt-1">
                    <div className="d-flex gap-2">
                      <label htmlFor="totalnights" className="m-0">
                        Total Nights
                        <span className="text-danger">*</span>
                      </label>
                      {errors?.TotalNights && (
                        <span className="text-danger font-size-10">
                          {errors?.TotalNights}
                        </span>
                      )}
                    </div>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      placeholder="0"
                      name="TravelDateInfo.TotalNights"
                      value={formValue?.TravelDateInfo?.TotalNights}
                      // onChange={handleChange}
                      onChange={handleTotalNights}
                    />
                  </div>
                </>
              )}
              {formValue?.TravelDateInfo?.ScheduleType == "Date Wise" && (
                <>
                  <div className="col-md-6 mt-3">
                    <label className="">From Date </label>
                    <DatePicker
                      className="form-control form-control-sm"
                      selected={getFromDate()}
                      name="TravelDateInfo.FromDate"
                      onChange={(e) => handleCalender(e)}
                      dateFormat="dd-MM-yyyy"
                      autocomplete="off"
                      style={{
                        transform: " translate3d(7px, 90px, 0px)",
                      }}
                      isClearable todayButton="Today"
                    />
                  </div>

                  <div className="col-4 col-md-6 mt-4">
                    <div className="d-flex gap-2">
                      <label htmlFor="totalnights">
                        Total Nights
                        <span className="text-danger">*</span>
                      </label>
                      {errors?.TotalNights && (
                        <span className="text-danger font-size-10">
                          {errors?.TotalNights}
                        </span>
                      )}
                    </div>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      name="TravelDateInfo.TotalNights"
                      value={formValue?.TravelDateInfo?.TotalNights}
                      // onChange={handleChange}
                      onChange={handleTotalNights}
                    />
                  </div>
                </>
              )}
              {formValue?.TravelDateInfo?.TotalNights !== "" &&
                formValue?.TravelDateInfo?.TotalNights > 0 &&
                formValue?.TravelDateInfo?.FromDate !== "" &&
                formValue?.TravelDateInfo?.ScheduleType == "Date Wise" && (
                  <div className="col-12 p-2">
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
                            </th>{" "}
                            <th
                              className="p-2 border font-semibold"
                              style={{ fontSize: "0.8rem" }}
                            >
                              Mode
                            </th>
                            <th
                              className="p-2 border font-semibold"
                              style={{ fontSize: "0.8rem" }}
                            >
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {TravelDate?.map((item, index) => {
                            return (
                              <tr key={index} className="font-size10">
                                <td className="p-2 border text-start text-black font-size10">
                                  {moment(item?.Date).format("DD-MM-YYYY")}/Day{" "}
                                  {/* {index + 1} */}
                                  {item?.DayNo}
                                </td>

                                <td className="p-2 border text-black font-size10">
                                  <Select
                                    options={destinationOption}
                                    // ref={selectRef}
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
                                    // styles={select_customStyles(background)}
                                    // className="font-size10"
                                    className="customSelectLightTheame"
                                    classNamePrefix="custom"
                                    styles={customStyles}
                                    components={{
                                      DropdownIndicator: () => null,
                                    }} // ← icon removed here
                                    placeholder="Select"
                                    menuPlacement="top" // 👈 Force dropdown to open upwards
                                    menuPosition="fixed" // 👈 Prevent clipping inside scrollable div
                                    // menuPortalTarget={document.body} // 👈 Render dropdown outside scrollable area
                                    // menuPlacement={menuPlacement}
                                    // menuRef={menuRef}
                                    filterOption={(option, inputValue) =>
                                      option.label
                                        .toLowerCase()
                                        .startsWith(inputValue.toLowerCase())
                                    }
                                  />
                                </td>
                                <td>
                                  {/* <span>
                                    <i
                                      class="fa-solid fa-plus text-secondary pe-1 cursor-pointer"
                                      onClick={() => handleCopyRow(item, index)}
                                    ></i>
                                  </span>
                                  {
                                    TravelDate?.length > 1 && (
                                      <span>
                                        <i
                                          className="fa-solid fa-trash pr-1
                                        text-danger cursor-pointer w-25 cursor-pointer"
                                        onClick={()=>dateDeleting(item,index)}
                                        ></i>
                                      </span>
                                    )} */}
                                </td>
                                <td className="p-2 border text-black font-size10">
                                  <Select
                                    options={enrouteOption}
                                    ref={selectRef}
                                    value={enrouteOption?.find(
                                      (option) =>
                                        option?.value === item?.Enroute
                                    )}
                                    onChange={(selectedOption) =>
                                      handleEnrouteChange(selectedOption, index)
                                    }
                                    // styles={select_customStyles(background)}
                                    // className="font-size10"
                                    className="customSelectLightTheame"
                                    classNamePrefix="custom"
                                    styles={customStyles}
                                    components={{
                                      DropdownIndicator: () => null,
                                    }} // ← icon removed here
                                    placeholder="Select"
                                    menuPlacement="top" // 👈 Force dropdown to open upwards
                                    menuPosition="fixed" // 👈 Prevent clipping inside scrollable div
                                    // menuPortalTarget={document.body} // 👈 Render dropdown outside scrollable area
                                    // menuPlacement={menuPlacement}
                                    menuRef={menuRef}
                                  />
                                </td>
                                <td className="p-2 border">
                                  <Select
                                    // styles={select_customStyles(background)} // Assuming background is defined
                                    // className="text-sm"
                                    className="customSelectLightTheame"
                                    classNamePrefix="custom"
                                    styles={customStyles}
                                    components={{
                                      DropdownIndicator: () => null,
                                    }} // ← icon removed here
                                    menuPlacement="top" // 👈 Force dropdown to open upwards
                                    menuPosition="fixed" // 👈 Prevent clipping inside scrollable div
                                    // menuPortalTarget={document.body} // 👈 Render dropdown outside scrollable area
                                    placeholder="Select"
                                    value={travelModes.find(
                                      (mode) => mode.value == item?.Mode
                                    )}
                                    options={travelModes} // Pass the options directly
                                    onChange={(selectedOption) =>
                                      handleModeChange(selectedOption, index)
                                    } // Pass the selected option directly
                                  />
                                </td>
                                <td className="p-2 text-center border">
                                  {index === TravelDate?.length - 1 && (
                                    <span>
                                      <j
                                        style={{ fontSize: "0.62rem" }}
                                        class="fa-solid fa-plus text-secondary pe-1 cursor-pointer"
                                        onClick={() =>
                                          handleCopyRow(item, index)
                                        }
                                      ></j>
                                    </span>
                                  )}
                                  {TravelDate?.length > 1 && (
                                    <span>
                                      <j
                                        style={{ fontSize: "0.62rem" }}
                                        className="fa-solid fa-trash p-1 s
                                        text-danger cursor-pointer cursor-pointer"
                                        onClick={() =>
                                          dateDeleting(item, index)
                                        }
                                      ></j>
                                    </span>
                                  )}
                                  {index !== TravelDate?.length - 1 && (
                                    <span
                                      className="cursor-pointer text-red-500 hover:text-red-700"
                                      onClick={() =>
                                        copyParticularRow(item, index)
                                      }
                                    >
                                      <j
                                        style={{
                                          fontSize: "0.62rem",
                                          marginLeft: "5px",
                                        }}
                                        class="fa-solid fa-copy text-white"
                                      ></j>
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              {formValue?.TravelDateInfo?.ScheduleType == "Day Wise" &&
                formValue?.TravelDateInfo?.TotalNights !== "" &&
                formValue?.TravelDateInfo?.TotalNights > 0 && (
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
                              style={{ fontSize: "0.8rem" }}
                              className="p-2 border font-semibold"
                            >
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {TravelDate?.map((item, index) => {
                            return (
                              <tr key={index} className="text-sm text-gray-700">
                                <td className="p-2 border text-center">
                                  {/* {index + 1} */}
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
                                    // styles={select_customStyles(background)}
                                    className="customSelectLightTheame"
                                    classNamePrefix="custom"
                                    styles={customStyles}
                                    components={{
                                      DropdownIndicator: () => null,
                                    }} // ← icon removed here
                                    // className="text-sm"
                                    placeholder="Select"
                                    menuPlacement="top" // 👈 Force dropdown to open upwards
                                    menuPosition="fixed" // 👈 Prevent clipping inside scrollable div
                                    // menuPortalTarget={document.body} // 👈 Render dropdown outside scrollable area
                                    // menuPlacement={menuPlacement}
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
                                      (option) =>
                                        option?.value === item?.Enroute
                                    )}
                                    onChange={(selectedOption) =>
                                      handleEnrouteChange(selectedOption, index)
                                    }
                                    // styles={select_customStyles(background)}
                                    // className="text-sm"
                                    className="customSelectLightTheame"
                                    classNamePrefix="custom"
                                    styles={customStyles}
                                    components={{
                                      DropdownIndicator: () => null,
                                    }} // ← icon removed here
                                    placeholder="Select"
                                    menuPlacement="top" // 👈 Force dropdown to open upwards
                                    menuPosition="fixed" // 👈 Prevent clipping inside scrollable div
                                    // menuPortalTarget={document.body} // 👈 Render dropdown outside scrollable area
                                    // menuPlacement={menuPlacement}
                                  />
                                </td>
                                <td className="p-2 border">
                                  <Select
                                    // styles={select_customStyles(background)}
                                    // className="text-sm"
                                    className="customSelectLightTheame"
                                    classNamePrefix="custom"
                                    styles={customStyles}
                                    components={{
                                      DropdownIndicator: () => null,
                                    }} // ← icon removed here
                                    placeholder="Select"
                                    value={travelModes.find(
                                      (mode) => mode.value === item?.Mode
                                    )}
                                    options={travelModes}
                                    onChange={(selectedOption) =>
                                      handleModeChange(selectedOption, index)
                                    }
                                    menuPlacement="top" // 👈 Force dropdown to open upwards
                                    menuPosition="fixed" // 👈 Prevent clipping inside scrollable div
                                    // menuPortalTarget={document.body} // 👈 Render dropdown outside scrollable area
                                  />
                                </td>
                                <td className="p-2 border text-center">
                                  {index === TravelDate?.length - 1 && (
                                    <span
                                      className="cursor-pointer text-gray-500 hover:text-gray-700"
                                      onClick={() => handleCopyRow(item, index)}
                                    >
                                      <i className="fa-solid fa-plus"></i>
                                    </span>
                                  )}
                                  {TravelDate?.length > 1 && (
                                    <span
                                      className="ml-3 cursor-pointer text-red-500 hover:text-red-700"
                                      onClick={() => dateDeleting(item, index)}
                                    >
                                      <i className="fa-solid text-danger p-2 fa-trash" />
                                    </span>
                                  )}{" "}
                                  {index !== TravelDate?.length - 1 && (
                                    <span
                                      className="ml-3 cursor-pointer text-red-500 hover:text-red-700"
                                      onClick={() =>
                                        copyParticularRow(item, index)
                                      }
                                    >
                                      {/* <i className="fa-solid text-danger p-2 fa-trash" /> */}
                                      <i class="fa-solid fa-copy text-white"></i>
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
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
