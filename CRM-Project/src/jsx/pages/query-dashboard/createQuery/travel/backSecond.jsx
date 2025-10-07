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
            pereferenceList?.TravelInfo === "Day wise"
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

  const selectedDayDate = (type) => {
    if (type === "From") {
      return dayWiseForm?.From ? new Date(dayWiseForm?.From) : null;
    }
    if (type === "To") {
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
    if (
      formValue?.TravelDateInfo?.FromDate &&
      formValue?.TravelDateInfo?.TotalNights >= 0 &&
      formValue?.TravelDateInfo?.ScheduleType === "Date Wise"
    ) {
      const fromDateObj = new Date(formValue?.TravelDateInfo?.FromDate);
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
    formValue?.TravelDateInfo?.FromDate,
    formValue?.TravelDateInfo?.TotalNights,
    formValue?.TravelDateInfo?.ScheduleType,
  ]);

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
      const fromDate = formValue?.TravelDateInfo?.FromDate
        ? new Date(formValue?.TravelDateInfo?.FromDate)
        : new Date();
      if (!isValid(fromDate)) {
        const today = new Date();
        setFormValue({
          ...formValue,
          TravelDateInfo: {
            ...formValue.TravelDateInfo,
            FromDate: format(today, "yyyy-MM-dd"),
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

  const handleCopyRow = (item, index) => {
    setTrackDataOfTravelInfo("NormalCopy");
    const lastNonCopiedDay = TravelDate.filter((d) => !d.copy).reduce(
      (max, d) => Math.max(max, d.DayNo),
      0
    );
    const newRow = {
      ...item,
      DayNo: lastNonCopiedDay + 1,
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
    setTravelDate(updatedTravelDate);
    setQueryTravelData(updatedTravelDate);
    setFormValue({
      ...formValue,
      TravelDateInfo: {
        ...formValue.TravelDateInfo,
        TotalNights: updatedTravelDate.filter((d) => !d.copy).length - 1,
      },
    });
  };

  const copyParticularRow = (item, index) => {
    setTrackDataOfTravelInfo("HardCopy");
    const newRow = { ...item, copy: true, DayNo: item.DayNo };
    const updatedTravelDate = [...TravelDate];
    updatedTravelDate.splice(index + 1, 0, newRow);
    setTravelDate(updatedTravelDate);
    setQueryTravelData(updatedTravelDate);
  };

  const dateDeleting = (item, index) => {
    setTrackDataOfTravelInfo("HardCopy");
    const updatedTravelDate = [...TravelDate];
    updatedTravelDate.splice(index, 1);
    setTravelDate(updatedTravelDate);
    setQueryTravelData(updatedTravelDate);
    setFormValue({
      ...formValue,
      TravelDateInfo: {
        ...formValue.TravelDateInfo,
        TotalNights: updatedTravelDate.filter((d) => !d.copy).length - 1,
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

      if (ScheduleType === "Date Wise") {
        const travel_data = TravelData?.map((data) => ({
          Date: data?.Date,
          DayNo: data?.Day,
          Destination: parseInt(data?.Destination),
          Enroute: parseInt(data?.Enroute),
          copy: false,
        }));
        setTravelDate(travel_data);
      }
      if (ScheduleType === "Day Wise") {
        const travel_data = TravelData?.map((data) => ({
          DayNo: data?.Day,
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

  const getFromDate = () => {
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
                        formValue?.TravelDateInfo?.ScheduleType === "Date Wise"
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
                        formValue?.TravelDateInfo?.ScheduleType === "Day Wise"
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
                  <div className="d-flex">
                    <span>Validity</span>
                  </div>
                  <div className="col-md-12 col-lg-3 p-0">
                    <label className="">From Date</label>
                    <DatePicker
                      className="form-control form-control-sm px-1"
                      selected={selectedDayDate("From")}
                      name="TravelDateInfo.FromDate"
                      onChange={(e) => handleDayCalendor(e, "From")}
                      dateFormat="dd-MM-yyyy"
                      autocomplete="off"
                      style={{
                        transform: "translate3d(7px, 90px, 0px)",
                        fontSize: ".5rem",
                      }}
                      isClearable
                      todayButton="Today"
                    />
                  </div>
                  <div className="col-md-12 col-lg-3 p-0">
                    <label className="">To Date</label>
                    <DatePicker
                      className="form-control form-control-sm px-1"
                      selected={selectedDayDate("To")}
                      name="TravelDateInfo.ToDate"
                      onChange={(e) => handleDayCalendor(e, "To")}
                      dateFormat="dd-MM-yyyy"
                      autocomplete="off"
                      style={{ transform: "translate3d(7px, 90px, 0px)" }}
                      isClearable
                      todayButton="Today"
                    />
                  </div>
                </div>
              </div>
              {formValue?.TravelDateInfo?.ScheduleType === "Day Wise" && (
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
                        dropdownState?.seasonList.map((season, index) => (
                          <option value={season?.id} key={index + 1}>
                            {season?.Name}
                          </option>
                        ))}
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
                      {fiftyYear &&
                        fiftyYear?.map((year, index) => (
                          <option value={year} key={index + 1}>
                            {year}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="col-4 col-md-6 col-lg-4 mt-3 mt-lg-0 pt-1">
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
                      onChange={handleTotalNights}
                    />
                  </div>
                </>
              )}
              {formValue?.TravelDateInfo?.ScheduleType === "Date Wise" && (
                <>
                  <div className="col-md-6 mt-3">
                    <label className="">From Date</label>
                    <DatePicker
                      className="form-control form-control-sm"
                      selected={getFromDate()}
                      name="TravelDateInfo.FromDate"
                      onChange={(e) => handleCalender(e)}
                      dateFormat="dd-MM-yyyy"
                      autocomplete="off"
                      style={{ transform: "translate3d(7px, 90px, 0px)" }}
                      isClearable
                      todayButton="Today"
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
                      onChange={handleTotalNights}
                    />
                  </div>
                </>
              )}
              {formValue?.TravelDateInfo?.TotalNights !== "" &&
                formValue?.TravelDateInfo?.TotalNights >= 0 &&
                formValue?.TravelDateInfo?.FromDate !== "" &&
                formValue?.TravelDateInfo?.ScheduleType === "Date Wise" && (
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
                            </th>
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
                                  <span>
                                    <i
                                      style={{ fontSize: "0.62rem" }}
                                      className="fa-solid fa-plus text-secondary pe-1 cursor-pointer"
                                      onClick={() => handleCopyRow(item, index)}
                                    ></i>
                                  </span>
                                )}
                                {TravelDate?.length > 1 && (
                                  <span>
                                    <i
                                      style={{ fontSize: "0.62rem" }}
                                      className="fa-solid fa-trash p-1 text-danger cursor-pointer"
                                      onClick={() => dateDeleting(item, index)}
                                    ></i>
                                  </span>
                                )}
                                {index !== TravelDate?.length - 1 && (
                                  <span
                                    className="cursor-pointer text-red-500 hover:text-red-700"
                                    onClick={() =>
                                      copyParticularRow(item, index)
                                    }
                                  >
                                    <i
                                      style={{
                                        fontSize: "0.62rem",
                                        marginLeft: "5px",
                                      }}
                                      className="fa-solid fa-copy text-white"
                                    ></i>
                                  </span>
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
                              style={{ fontSize: "0.8rem" }}
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
                                )}
                                {index !== TravelDate?.length - 1 && (
                                  <span
                                    className="ml-3 cursor-pointer text-red-500 hover:text-red-700"
                                    onClick={() =>
                                      copyParticularRow(item, index)
                                    }
                                  >
                                    <i className="fa-solid fa-copy text-white"></i>
                                  </span>
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
