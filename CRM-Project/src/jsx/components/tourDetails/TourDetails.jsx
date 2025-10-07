import { useEffect, useLayoutEffect, useState } from "react";
import DatePicker from "react-datepicker";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import { axiosOther } from "../../../http/axios_base_url";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { quotationData } from "../../pages/query-dashboard/qoutation-first/quotationdata";
import { Card, Tab, Nav, Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import ArrivalDeparture from "./ArrivalDeparture";
import Select from "react-select";
import PaxDetails from "./PaxDetails";
import { notifyError, notifySuccess } from "../../../helper/notify";
import { error } from "highcharts";
// import { TourDetailsValidation } from "../masterValidation/masterValidation";
import DarkCustomTimePicker from "../../pages/query-dashboard/helper-methods/TimePicker";
import * as yup from "yup";
export const TourDetailsValidation = yup.object().shape({
  PaxSlab: yup.string().required("PaxSlab is required"),
  TourEndDate: yup.string().required("Tour End Date is required"),
  // .test(
  //   "is-valid-end-date",
  //   "Tour End Date is not correct",
  //   function (value, context) {
  //     const { TourStartDate, NoOfDays } = context.parent;

  //     // Skip validation if TourStartDate or NoOfDays is missing
  //     if (!TourStartDate || !NoOfDays || isNaN(Number(NoOfDays))) {
  //       return true; // Let required validation handle empty fields
  //     }

  //     try {
  //       // Parse TourStartDate (format: dd-MM-yyyy)
  //       const [startDay, startMonth, startYear] =
  //         TourStartDate.split("-").map(Number);
  //       const startDate = new Date(startYear, startMonth - 1, startDay);

  //       // Parse TourEndDate (format: dd-MM-yyyy)
  //       const [endDay, endMonth, endYear] = value.split("-").map(Number);
  //       const endDate = new Date(endYear, endMonth - 1, endDay);

  //       // Validate dates
  //       if (isNaN(startDate) || isNaN(endDate)) {
  //         return false; // Invalid date format
  //       }

  //       // Calculate expected end date
  //       const expectedEndDate = new Date(startDate);
  //       expectedEndDate.setDate(startDate.getDate() + Number(NoOfDays));

  //       // Compare dates (ignoring time)
  //       return (
  //         endDate.getFullYear() === expectedEndDate.getFullYear() &&
  //         endDate.getMonth() === expectedEndDate.getMonth() &&
  //         endDate.getDate() === expectedEndDate.getDate()
  //       );
  //     } catch (error) {
  //       console.error("Error validating TourEndDate:", error);
  //       return false;
  //     }
  //   }
  // ),
});

const TourDetails = () => {
  const initialTourDetails = {
    QueryId: "",
    AgentId: null,
    AgentName: "",
    TourName: "",
    TourStartDate: "",
    TourEndDate: "",
    SeriesDate: "",
    TourCode: "",
    HandledBy: "",
    DepartmentBy: "",
    NoOfDays: "",
    ExecutiveISO: "",
    MealType: "",
    TransportCategory: "",
    PaxSlab: "",
    PaxDetails: {
      Total: 0,
      TWN: 0,
      DBL: 0,
      TPL: 0,
      SGL: 0,
    },
    FOCDetails: {
      FOC: 0,
      DBL: 0,
      SGL: 0,
    },
    ChildDetails: {
      Child: 0,
      CWB: 0,
      CNB: 0,
      ADTRoom: 0,
    },
    ArrivalDetails: [
      {
        Type: "",
        Agent: "",
        AgentReferenceNo: "",
        Pax: "",
        Date: "",
        Mode: "",
        CityId: "",
        Time: "",
        Details: "",
        PaxDetails: "",
        FlightNo: "",
        CountryId: "",
      },
    ],
    FlightDetails: [
      {
        PaxType: "",
        Title: "",
        Gender: "",
        FirstName: "",
        LastName: "",
        DOB: "",
        PassportNo: "",
      },
    ],
  };
  const ArrivalDetailsarrya = [
    {
      Type: "Arrival",
      Agent: "",
      AgentReferenceNo: "",
      Pax: "",
      Date: "",
      Mode: "",
      CityId: "",
      Time: "",
      Details: "",
      PaxDetails: "",
      FlightNo: "",
    },
    {
      Type: "Departure",
      Agent: "",
      AgentReferenceNo: "",
      Pax: "",
      Date: "",
      Mode: "",
      CityId: "",
      Time: "",
      Details: "",
      PaxDetails: "",
      FlightNo: "",
    },
  ];
  const ArrivalDetailsObj = {
    Type: "",
    Agent: "",
    AgentReferenceNo: "",
    Pax: "",
    Date: "",
    Mode: "",
    CityId: "",
    Time: "",
    Details: "",
    PaxDetails: "",
    FlightNo: "",
  };
  const Flightobj = {
    PaxType: "",
    Title: "",
    Gender: "",
    FirstName: "",
    LastName: "",
    DOB: "",
    PassportNo: "",
  };

  const [arrivaldetail, setArrivaldetail] = useState(ArrivalDetailsarrya);
  const [flightdetail, setflightdetail] = useState([Flightobj]);
  const [isomasterlist, setIsomasterlist] = useState([]);
  const [Listusers, setListusers] = useState([]);
  const [responseData, setResponseData] = useState([]);
  const [Departmentlist, setDepartmentlist] = useState([]);

  const [mealPlanList, setMealPlanList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [destinationList, setDestinationList] = useState([]);
  const [Agentlist, setAgentlist] = useState([]);

  const [businesstypelist, setBusinesstypelist] = useState([]);
  const [CityList, setCityList] = useState([]);
  const [Countryid, setcountryid] = useState("");
  const [formValue, setFormValue] = useState(initialTourDetails);
  const [PaxSlablist, setPaxSlablist] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});

  const [QoutationData, setQoutationData] = useState({});
  const [vehicleTypeList, setVehicleTypeList] = useState([]);
  const { state } = useLocation();
  const { queryData, qoutationData } = useSelector(
    (state) => state?.queryReducer
  );
  const [lgShow, setLgShow] = useState(false);
  const Navigate = useNavigate();

  // console.log(arrivaldetail, "statestate");

  const companyId = JSON.parse(localStorage.getItem("token"))?.companyKey;

  const queryAndQuotationNo =
    JSON.parse(localStorage.getItem("Query_Qoutation")) || {};

  //    const renderTables = () => {
  // const selectedValue = selectedProductlist?.label?.toLowerCase() ? selectedProductlist?.label?.toLowerCase() : "";

  // return (

  // );
  // };

  console.log(queryAndQuotationNo, "state123");

  const fetchQueryQuotation = async () => {
    console.log(
      queryAndQuotationNo?.QueryID,
      state?.quotationnumber,
      "state?.quotationnumber"
    );

    try {
      const { data } = await axiosOther.post("lisFinalQuotation", {
        QueryId: state?.queryId,
        QuotationNo: state?.quotationNumber,
        // TourId: queryData?.QueryAllData?.TourId,
      });

      setQoutationData(data?.FilteredQuotations[0] || {});
    } catch (error) {
      console.error("Error fetching quotation:", error);
    }
  };

  useEffect(() => {
    fetchQueryQuotation();
  }, [queryAndQuotationNo?.QueryID]);
  const customStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#2e2e40",
      color: "white",
      border: "1px solid transparent",
      boxShadow: "none",
      borderRadius: "0.5rem",
      width: "100%",
      minWidth: "10rem",
      height: "2rem",
      minHeight: "2rem",
      fontSize: "1em",
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
    menu: (base) => ({
      ...base,
      backgroundColor: "#2e2e40",
      zIndex: 9999,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#444" : "#2e2e40",
      color: "white",
      cursor: "pointer",
      fontSize: "0.85em",
      padding: "6px 10px",
    }),
  };

  const tourfunction = async () => {
    try {
      const { data } = await axiosOther.post("generate-tour-code", {
        QueryId: queryAndQuotationNo?.QueryID,
        TourId: QoutationData?.TourId,
      });

      setFormValue((prev) => ({
        ...prev,
        TourCode: data?.TourCode,
      }));

      // setTourData(data?.FilteredQuotations[0] || {});
    } catch (error) {
      console.error("Error fetching quotation:", error);
    }
  };
  useEffect(() => {
    tourfunction();
  }, [queryAndQuotationNo?.QueryID, QoutationData?.TourId]);
  const posttogetdata = async () => {
    try {
      const { data } = await axiosOther.post("hotelmealplanlist", {
        Search: "",
        Status: "",
      });
      setMealPlanList(data?.DataList);
      //   console.log(data?.DataList, "data?.DataList");
    } catch (error) {
      console.log(error);
    }
    try {
      const { data } = await axiosOther.post("vehicletypemasterlist", {
        // PaxType: TourSummary?.PaxTypeName,
      });

      setVehicleTypeList(data?.DataList);
    } catch (error) {
      console.log("error", error);
    }

    try {
      const { data } = await axiosOther.post("citybycountry", {
        // Page: currentPage,
        // PerPage: rowsPerPage,
        // countryId: selectedCountry,
        // stateId: selectedStateId
      });
      setCityList(data?.DataList);
    } catch (error) {
      console.log("Error fetching destination or hotel list:", error);
    }
    try {
      const Data = await axiosOther.post("businesstypelist", {
        Search: "",
        Status: 1,
      });
      setBusinesstypelist(Data.data.DataList);
    } catch (err) {
      console.log(err);
    }
    try {
      // Fetch country list
      const countryResponse = await axiosOther.post("countrylist", {
        Search: "",
        Status: 1,
      });

      const countryListData = countryResponse.data.DataList;
      setCountryList(countryListData);
    } catch (err) {
      console.error("Error fetching data:", err);
    }

    try {
      const { data } = await axiosOther.post("destinationlist");
      setDestinationList(data?.DataList);
    } catch (error) {
      console.log("error", error);
    }
    try {
      const Data = await axiosOther.post("isomasterlist", {
        Search: "",
        Status: 1,
      });
      setIsomasterlist(Data.data.DataList);
    } catch (err) {
      console.log(err);
    }
    try {
      const Data = await axiosOther.post("listusers", {
        // Search: "",
        // Status: 1,
      });

      setListusers(Data?.data?.Datalist);
    } catch (err) {
      console.log(err);
    }
    try {
      const Data = await axiosOther.post("departmentlist", {
        // Search: "",
        // Status: 1,
      });
      // console.log(Data, "Data11");

      setDepartmentlist(Data?.data?.DataList);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    posttogetdata();
  }, []);
  const getpaxdata = async () => {
    if (!state?.queryId) return;
    try {
      const data = await axiosOther.post("fetch-paxslab-data", {
        QueryId: state?.queryId,
        QuotationNumber: state?.quotationNumber,
      });
      console.log(data?.data, "DataList");
      setPaxSlablist(data?.data?.Data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getpaxdata();
  }, [state?.queryId, state?.quotationNumber]);
  console.log(PaxSlablist, "PaxSlablist");

  const agentlistFunction = async () => {
    const contactId = QoutationData?.QueryInfo?.ContactInfo?.ContactId;
    const businessTypeId = QoutationData?.BusinessTypeId;

    if (!contactId) return;

    try {
      const { data } = await axiosOther.post("agentlist", {
        id: contactId,
        BussinessType: businessTypeId || "",
        // You can add other params here if needed
      });

      setAgentlist(data?.DataList || []);
    } catch (error) {
      console.log("agent-error", error);
    }
  };

  useEffect(() => {
    agentlistFunction();
  }, [
    QoutationData?.BusinessTypeId,
    QoutationData?.QueryInfo?.ContactInfo?.ContactId,
  ]);

  // console.log(PaxSlablist, "DataList");
  useEffect(() => {
    const dependentStateAndCity = async (Countryid) => {
      try {
        const { data } = await axiosOther.post("citybycountry", {
          CountryId: Countryid,
        });
        setCityList(data.DataList);
      } catch (err) {
        console.log(err);
      }
    };
    arrivaldetail.map((data, index) => {
      dependentStateAndCity(data?.CountryId);
    });
  }, [arrivaldetail?.map((data) => data?.CountryId).join(",")]);

  const handleSubmit = async (e) => {
    // console.log(formValue, "VCBHDHU8777");
    e.preventDefault();
    try {
      await TourDetailsValidation.validate(formValue, {
        abortEarly: false,
      });
      setValidationErrors({});
      const { data } = await axiosOther.post("update-tour-details", {
        ...formValue,
        QueryId: queryAndQuotationNo?.QueryID,
        QuotationNumber: queryAndQuotationNo?.QoutationNum,
        ArrivalDetails: arrivaldetail,
        FlightDetails: flightdetail,
      });

      if (data?.status == 1) {
        // notifySuccess(data?.message);
        notifySuccess("Tour Details Saved Succesfully");

        setTimeout(() => {
          Navigate("/query/quotation-list");
        }, 500);
      }
    } catch (error) {
      notifyError(error?.message);
      if (error.inner) {
        const validationErrorss = error.inner.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {});
        setValidationErrors(validationErrorss);
        // notifyError(validationErrorss[Object.keys(validationErrorss)[0]]); // Notify first error
      }

      if (error?.response?.data?.Errors || error?.response?.data?.errors) {
        const data = Object.entries(
          error?.response?.data?.Errors || error?.response?.data?.errors
        );
        notifyError(data[0][1]);
        setValidationErrors(data[0][1]);
      }

      if (error?.response?.data) {
        const data = Object.entries(error?.response?.data);
        notifyError(data[0][1]);
      }
    }
  };

  const getFromDate = () => {
    if (!formValue?.TourStartDate) return null;

    // Expected format: dd-MM-yyyy
    const [day, month, year] = formValue.TourStartDate.split("-");
    const date = new Date(year, month - 1, day); // month 0-based

    return isNaN(date) ? null : date;
  };

  const getToDate = () => {
    if (!formValue?.TourEndDate) return null;

    // Agar string format "dd-MM-yyyy" hai
    const [day, month, year] = formValue.TourEndDate.split("-");
    const date = new Date(year, month - 1, day); // month 0-based hota hai

    return isNaN(date) ? null : date;
  };

  const getSeriesDate = () => {
    if (!formValue?.SeriesDate) return null;

    const [day, month, year] = formValue.SeriesDate.split("-");
    const date = new Date(year, month - 1, day);

    return isNaN(date) ? null : date;
  };

  // const getArrivalDOB = (index) => {
  //   if (!arrivaldetail?.[index]?.Date) return null;

  //   console.log(arrivaldetail[0].Date, "ARRskfjdlk2548");
  //   console.log(arrivaldetail[1].Date, "ARRskfjdlk2548");

  //   const [day, month, year] = arrivaldetail[index].Date.split("-");
  //   const date = new Date(year, month - 1, day);

  //   return isNaN(date) ? null : date;
  // };

  console.log(arrivaldetail, "ADSFSDFSD454");

  const getArrivalDOB = (index) => {
    if (!arrivaldetail?.[index]?.Date) return null;

    let dateString = arrivaldetail[index].Date;

    // Check if date is in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month, day] = dateString.split("-");
      dateString = `${day}-${month}-${year}`;
    }

    // Process DD-MM-YYYY format
    const [day, month, year] = dateString.split("-");
    const date = new Date(year, month - 1, day);

    return isNaN(date) ? null : date;
  };

  const getFlightDOB = (index) => {
    // console.log(index,"index")

    return flightdetail?.[index]?.DOB
      ? new Date(flightdetail?.[index]?.DOB)
      : null;
  };
  const handleCalender = (date) => {
    const formattedDate = date
      ? date.toLocaleDateString("en-GB").split("/").join("-")
      : "";

    setFormValue((prev) => ({
      ...prev,
      TourStartDate: formattedDate,
    }));
  };

  const handleToCalender = (date) => {
    if (!date) return;

    const formattedDate = date
      ? date.toLocaleDateString("en-GB").split("/").join("-") // dd-MM-yyyy
      : "";
    setFormValue({
      ...formValue,
      TourEndDate: formattedDate,
    });
  };
  const handleSeriesCalender = (date) => {
    const formattedDate = date
      ? date.toLocaleDateString("en-GB").split("/").join("-") // dd-MM-yyyy
      : "";
    setFormValue({
      ...formValue,
      SeriesDate: formattedDate,
    });
  };
  const handleArrivalCalender = (date, index) => {
    const formattedDate = date
      ? date.toLocaleDateString("en-GB").split("/").join("-") // dd-MM-yyyy
      : "";
    setArrivaldetail((prev) => {
      const newarr = [...prev];
      newarr[index] = {
        ...newarr[index],
        Date: formattedDate,
      };
      return newarr;
    });
  };
  const handleflightCalender = (date, index) => {
    const formattedDate = date
      ? date.toLocaleDateString("en-GB").split("/").join("-") // dd-MM-yyyy
      : "";
    setflightdetail((prev) => {
      const newarr = [...prev];
      newarr[index] = {
        ...newarr[index],
        DOB: formattedDate,
      };
      return newarr;
    });
  };
  // console.log(Departmentlist, "Departmentlist");

  const handlechange = (e) => {
    const { name, value } = e.target;

    // Pax multiplier mapping for total calculation
    // const paxMultiplier = {
    //   "SGL Room": 1,
    //   "DBL Room": 2,
    //   "TPL Room": 3,
    //   "TWIN Room": 2,
    // };

    // Convert value to number for numeric fields, default to 0 if invalid
    const parsedValue =
      name.includes("PaxDetails") ||
        name.includes("FOCDetails") ||
        name.includes("ChildDetails")
        ? parseInt(value) || 0 // Changed from " " to 0 for numeric consistency
        : value;

    // Create a copy of the current formValue
    let updatedFormValue = { ...formValue };
    if (name === "PaxSlab") {
      // Find the matching slab in PaxSlablist
      const selectedSlab = PaxSlablist.find(
        (slab) => `${slab.Min} - ${slab.Max}` === value
      );
      if (selectedSlab) {
        updatedFormValue = {
          ...updatedFormValue,
          PaxSlab: value,
          TransportCategory: selectedSlab.TransportType.toString(), // Set TransportCategory to TransportType
        };
      } else {
        updatedFormValue = {
          ...updatedFormValue,
          PaxSlab: value,
          TransportCategory: "", // Reset if no matching slab
        };
      }
    }

    // Handle nested fields (e.g., PaxDetails.Total, PaxDetails.SGL, etc.)
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      updatedFormValue = {
        ...updatedFormValue,
        [parent]: {
          ...updatedFormValue[parent],
          [child]: parsedValue,
        },
      };

      // If the changed field is within PaxDetails (SGL, DBL, TPL, TWN), recalculate Total
      // if (
      //   parent === "PaxDetails" &&
      //   ["SGL", "DBL", "TPL", "TWN"].includes(child)
      // ) {
      //   // Calculate total based on multipliers
      //   const newTotal =
      //     (updatedFormValue.PaxDetails.SGL || 0) * paxMultiplier["SGL Room"] +
      //     (updatedFormValue.PaxDetails.DBL || 0) * paxMultiplier["DBL Room"] +
      //     (updatedFormValue.PaxDetails.TPL || 0) * paxMultiplier["TPL Room"] +
      //     (updatedFormValue.PaxDetails.TWN || 0) * paxMultiplier["TWIN Room"];

      //   updatedFormValue = {
      //     ...updatedFormValue,
      //     PaxDetails: {
      //       ...updatedFormValue.PaxDetails,
      //       Total: newTotal,
      //     },
      //   };
      // }
    } else {
      // Handle non-nested fields
      updatedFormValue = {
        ...updatedFormValue,
        [name]: parsedValue,
      };
    }

    // Update state with the new form value
    setFormValue(updatedFormValue);
  };
  useEffect(() => {
    if (formValue.NoOfDays > 0 && formValue.TourStartDate) {
      try {
        // console.log("Calculating TourEndDate...");
        // console.log("TourStartDate:", formValue.TourStartDate);
        // console.log("NoOfDays (raw):", formValue.NoOfDays);
        // console.log("NoOfDays (type):", typeof formValue.NoOfDays);

        // Ensure NoOfDays is a number
        const days = Number(formValue.NoOfDays);
        if (isNaN(days) || days <= 0) {
          console.error("Invalid NoOfDays:", formValue.NoOfDays);
          setFormValue((prev) => ({
            ...prev,
            TourEndDate: "",
          }));
          return;
        }

        // Parse TourStartDate (format: dd-MM-yyyy)
        const [day, month, year] =
          formValue.TourStartDate.split("-").map(Number);
        // console.log("Parsed start date components:", { day, month, year });

        const startDate = new Date(year, month - 1, day); // Month is 0-based
        if (isNaN(startDate)) {
          console.error("Invalid TourStartDate:", formValue.TourStartDate);
          setFormValue((prev) => ({
            ...prev,
            TourEndDate: "",
          }));
          return;
        }

        // Calculate end date
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + (days - 1)); // Add NoOfDays
        const formattedEndDate = endDate
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
          .split("/")
          .join("-"); // Format to dd-MM-yyyy
        // console.log("New TourEndDate:", formattedEndDate);

        setFormValue((prev) => ({
          ...prev,
          TourEndDate: formattedEndDate,
        }));
      } catch (error) {
        console.error("Error calculating TourEndDate:", error);
        setFormValue((prev) => ({
          ...prev,
          TourEndDate: "",
        }));
      }
    } else {
      // console.log("Clearing TourEndDate due to invalid inputs:", {
      //   NoOfDays: formValue.NoOfDays,
      //   TourStartDate: formValue.TourStartDate,
      // });
      setFormValue((prev) => ({
        ...prev,
        TourEndDate: "",
      }));
    }
  }, [formValue.NoOfDays, formValue.TourStartDate]);

  const handleArrivalIncrement = () => {
    setArrivaldetail((prev) => {
      let newarr = [...prev];
      newarr = [...newarr, ArrivalDetailsObj];
      return newarr;
    });
  };
  const handleArrivalDecrement = (index) => {
    if (arrivaldetail.length > 2) {
      let newarr = [...arrivaldetail];
      const filterform = newarr?.filter((_, ind) => ind !== index);

      setArrivaldetail(filterform);
    }
  };
  const handleArrivalformForm = (e, index) => {
    const { name, value } = e.target;
    setArrivaldetail((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = { ...newArr[index], [name]: value };
      return newArr;
    });
  };
  const handleFlightIncrement = () => {
    setflightdetail((prev) => {
      let newarr = [...prev];
      newarr = [...newarr, Flightobj];
      return newarr;
    });
  };
  const handleFlightDecrement = (index) => {
    if (flightdetail.length > 1) {
      let newarr = [...flightdetail];
      const filterform = newarr?.filter((_, ind) => ind !== index);

      setflightdetail(filterform);
    }
  };
  const handleFlightChange = (e, index) => {
    const { name, value } = e.target;
    setflightdetail((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = { ...newArr[index], [name]: value };
      return newArr;
    });
  };
  // console.log(responseData, "responseData?.Data");

  useEffect(() => {
    // Agar Data ek object hai → skip
    if (responseData?.QueryId) return;

    // console.log(responseData?.Data, "responseData?.Data");

    if (!QoutationData) return;
    // console.log("function clllass");

    const roomData = QoutationData?.RoomInfo || []; // Adjust path if needed

    // Pax multiplier mapping for total calculation only
    const paxMultiplier = {
      "SGL Room": 1,
      "DBL Room": 2,
      "TPL Room": 3,
      "TWIN Room": 2,
    };

    // Initialize counters
    let PaxDetails = {
      Total: 0,
      SGL: 0,
      DBL: 0,
      TPL: 0,
      TWN: 0,
    };

    roomData.forEach((room) => {
      const { RoomType, NoOfPax } = room;
      const count = NoOfPax || " ";

      // Add to individual room-type count (no multiplier)
      if (RoomType === "SGL Room") PaxDetails.SGL += count;
      if (RoomType === "DBL Room") PaxDetails.DBL += count;
      if (RoomType === "TPL Room") PaxDetails.TPL += count;
      if (RoomType === "TWIN Room") PaxDetails.TWN += count;

      // Calculate total using multiplier
      const multiplier = paxMultiplier[RoomType] || 0;
      PaxDetails.Total += count * multiplier;
    });
    const NoOfDays =
      [...new Set(QoutationData?.Days?.map((item) => item.Day))]?.length ?? 0;

    setFormValue((prev) => {
      const formattedStart = QoutationData?.TravelDateInfo?.FromDateDateWise
        ? QoutationData?.TravelDateInfo?.FromDateDateWise.split("-")
          .reverse()
          .join("-")
        : QoutationData?.TravelDateInfo?.FromDateDateWise.split("-")
          .reverse()
          .join("-") || null;

      let formattedEnd = QoutationData?.TravelDateInfo?.ToDateWise
        ? QoutationData?.TravelDateInfo?.ToDateWise.split("-")
          .reverse()
          .join("-")
        : QoutationData?.TravelDateInfo?.ToDateWise?.split("-")
          .reverse()
          .join("-") || null;
      // console.log(QoutationData, "QoutationData?.TravelDateInfo?.ToDateWise");

      if (!formattedEnd && formattedStart && NoOfDays > 0) {
        const [day, month, year] = formattedStart.split("-").map(Number);
        const startDate = new Date(year, month - 1, day);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + (NoOfDays - 1)); // inclusive of start day
        formattedEnd = endDate.toLocaleDateString("en-GB").split("/").join("-");
      }

      // Optional optimization: avoid update if no change
      // if (
      //   prev.AgentId === QoutationData?.BusinessTypeId &&
      //   prev.TourStartDate === formattedStart &&
      //   prev.TourEndDate === formattedEnd
      // ) {
      //   return prev; // skip update
      // }
      // console.log(formattedEnd,"formattedEnd");
      const firstMealPlanId = QoutationData?.Days?.flatMap((day) =>
        Array.isArray(day?.DayServices)
          ? day.DayServices.filter(
            (service) =>
              service?.ServiceType === "Hotel" &&
              service?.ServiceMainType === "Guest"
          ).map((service) => service?.MealPlanId)
          : []
      )[0];
      // console.log(firstMealPlanId,"firstMealPlanId")
      const token = localStorage.getItem("token");
      const persed = JSON.parse(token);
      // console.log(persed,"persed")
      const Id = persed?.UserID;
      // console.log(formattedEnd, "formattedEnd");
      let UserDepartmentId = JSON.parse(localStorage.getItem("token"));
      // console.log(UserDepartmentId, "UserDepartmentId");
      const today = new Date();
      const SeriesDate =
        today.getDate().toString().padStart(2, "0") +
        "-" +
        (today.getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        today.getFullYear();

      return {
        ...prev,
        AgentId: QoutationData?.QueryInfo?.ContactInfo?.ContactId,
        AgentName: QoutationData?.QueryInfo?.ContactInfo?.ContactPersonName,
        TourName: QoutationData?.LeadPax,
        TourStartDate:
          QoutationData?.TravelDateInfo?.ScheduleType != "Day Wise"
            ? formattedStart
            : null,
        HandledBy: Id.toString(),
        NoOfDays: NoOfDays,
        MealType: firstMealPlanId || "",
        TourEndDate:
          QoutationData?.TravelDateInfo?.ScheduleType != "Day Wise"
            ? formattedEnd
            : null,
        DepartmentBy: UserDepartmentId,
        SeriesDate: SeriesDate,
        ExecutiveISO: QoutationData?.ISOId,
        PaxDetails: PaxDetails,
        TransportCategory: QoutationData?.VehiclePreferenceId,
        FOCDetails: {
          FOC: "",
          DBL: "",
          SGL: "",
        },
        ChildDetails: {
          Child: "",
          CWB: "",
          CNB: "",
          ADTRoom: "",
        },
      };
    });
  }, [QoutationData]);
  // console.log(QoutationData, "3333333333");
  // console.log(formValue, "formvaluee");

  const Arrivalmerge = (AgentReferenceNo, Mode, index) => {
    // if (responseData?.Data && responseData?.Data?.length > 0) return;
    if (QoutationData && Array.isArray(QoutationData?.Days)) {
      // console.log(QoutationData?.Days, "📦 QoutationData Days");

      // 1. Find day with Guest Transport
      const matchedDay = QoutationData.Days.filter((day, i) => {
        const hasGuestTransport = day?.DayServices?.some((service) => {
          const match =
            service?.ServiceType === "Transport" &&
            service?.ServiceMainType === "Guest";

          if (match) console.log(`✅ [Transport] in Day ${i}:`, service);
          return match;
        });

        if (!hasGuestTransport) {
          console.log(`🚫 No guest transport in Day ${i}`);
        }

        return hasGuestTransport; // <-- important, return true if found
      });

      console.log(matchedDay, "matchedDay");

      // 2. Find day with Guest Flight
      const matchedFlightDay = QoutationData.Days.filter((day, i) => {
        const hasGuestFlight = day?.DayServices?.some((service) => {
          const match =
            service?.ServiceType === "Flight" &&
            service?.ServiceMainType === "Guest";

          if (match) console.log(`✈️ [Flight] in Day ${i}:`, service);
          return match;
        });

        if (!hasGuestFlight) console.log(`🛑 No guest flight in Day ${i}`);
        return hasGuestFlight;
      });

      console.log(matchedFlightDay, "Mfakdskfds544");

      // 3. Find day with Guest Train (only if flight not found)
      const matchedTrainDay = !matchedFlightDay
        ? QoutationData.Days.find((day, i) => {
          const hasGuestTrain = day?.DayServices?.some((service) => {
            const match =
              service?.ServiceType === "Train" &&
              service?.ServiceMainType === "Guest";

            if (match) console.log(`🚆 [Train] in Day ${i}:`, service);
            return match;
          });

          if (!hasGuestTrain) console.log(`🛑 No guest train in Day ${i}`);
          return hasGuestTrain;
        })
        : null;

      // 4. Find matched services
      console.log(matchedTrainDay, "matchedDay");

      const matchedService = matchedDay[0]?.DayServices?.find(
        (service) =>
          service?.ServiceType === "Transport" &&
          service?.ServiceMainType === "Guest"
      );
      console.log(matchedDay, "matchedService");

      const matchedServices = matchedDay[
        matchedDay.length - 1
      ]?.DayServices?.find(
        (service) =>
          service?.ServiceType === "Transport" &&
          service?.ServiceMainType === "Guest"
      );

      const matchedFlightService = matchedFlightDay[0]?.DayServices?.find(
        (service) =>
          service?.ServiceType === "Flight" &&
          service?.ServiceMainType === "Guest"
      );
      const matchedFlightlastService = matchedFlightDay[
        matchedFlightDay.length - 1
      ]?.DayServices?.find(
        (service) =>
          service?.ServiceType === "Flight" &&
          service?.ServiceMainType === "Guest"
      );
      console.log(matchedFlightlastService, "matchedFlightlastService");
      console.log(
        matchedFlightlastService?.ServiceDetails[0]?.TimingDetails
          ?.ItemFromDate,
        "matchedFlightlastService"
      );

      const matchedTrainService = matchedTrainDay?.DayServices?.find(
        (service) =>
          service?.ServiceType === "Train" &&
          service?.ServiceMainType === "Guest"
      );

      // console.log("🚍 Transport Service:", matchedService);
      // console.log("✈️ Flight Service:", matchedFlightService);
      // console.log("🚆 Train Service:", matchedTrainService);

      // 5. Extract fields
      const mode = matchedService?.Mode || "";
      const modes = matchedServices?.Mode || "";
      const from = matchedService?.FromDestinationId || "";
      const To = matchedServices?.ToDestinationId || "";
      const datefrom =
        matchedDay[0]?.Date ||
        matchedFlightlastService?.ServiceDetails[0]?.TimingDetails
          ?.ItemFromDate ||
        "";
      const dateTo =
        matchedDay[matchedDay.length - 1]?.Date ||
        matchedFlightlastService?.ServiceDetails[0]?.TimingDetails
          ?.ItemToDate ||
        "";
      console.log(dateTo, "DATETO75", datefrom);
      const flightFrom =
        matchedFlightService?.FlightNumber ||
        matchedTrainService?.TrainNumber ||
        "";
      const flightlastFrom =
        matchedFlightlastService?.FlightNumber ||
        matchedTrainService?.TrainNumber ||
        "";
      const Timefrom =
        matchedFlightService?.ServiceDetails[0]?.TimingDetails?.ItemFromTime ||
        " ";
      const TimeTo =
        matchedFlightlastService?.ServiceDetails[0]?.TimingDetails
          ?.ItemToTime || " ";
      console.log(matchedService, To, "matchedService");

      // console.log(matchedFlightlastService?.FlightNumber, "flightlastFrom");
      // console.log(matchedService,"matchedService")

      // 6. Update arrival details
      const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [year, month, day] = dateStr.split("-");
        return `${day}-${month}-${year}`;
      };

      const formattedFromDate = formatDate(datefrom);
      const formattedToDate = formatDate(dateTo);

      // console.log("From:", formattedFromDate);
      console.log("datefrom", datefrom);

      setArrivaldetail((prev) => {
        const newArr = [...prev];
        newArr[0] = {
          ...newArr[0],
          AgentReferenceNo: QoutationData?.ReferenceId,
          Mode: mode,
          CityId: from,
          FlightNo: flightFrom,
          Type: "Arrival",
          Date: datefrom,
          Time: Timefrom,
          Agent: QoutationData?.QueryInfo?.ContactInfo?.ContactId,
        };
        return newArr;
      });
      setArrivaldetail((prev) => {
        const newArr = [...prev];
        newArr[1] = {
          ...newArr[1],
          AgentReferenceNo: QoutationData?.ReferenceId,
          Mode: modes,
          CityId: To,
          FlightNo: flightlastFrom,
          Type: "Departure",
          Date: dateTo,
          Time: TimeTo,
          Agent: QoutationData?.QueryInfo?.ContactInfo?.ContactId,
        };
        return newArr;
      });
    } else {
      console.log("🚫 QoutationData.Days is missing or invalid.", error);
    }
  };

  useEffect(() => {
    if (responseData?.QueryId) return;
    if (QoutationData && Array.isArray(arrivaldetail)) {
      arrivaldetail.forEach((arrival, index) => {
        Arrivalmerge(arrival?.AgentReferenceNo, arrival?.Mode, index);
      });
    }
  }, [QoutationData?.Days]);
  const getDataformDb = async () => {
    try {
      const res = await axiosOther.post("fetch-tour-details", {
        QueryId: queryAndQuotationNo?.QueryID,
      });

      console.log(res?.data, "API Response");

      const apiData = res?.data?.Data ?? res?.data; // prefer Data if exists

      // ✅ Only set if it's not an empty string and not null/undefined
      if (apiData && apiData !== "") {
        setResponseData(apiData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(responseData, "responseData");

  useEffect(() => {
    getDataformDb();
  }, [queryAndQuotationNo?.QueryID, queryData]);

  const setResponseDataToFormValue = (responseData) => {
    console.log("function calls3333333");
    console.log(responseData, "responseData222");

    if (!responseData) return;
    console.log("function calls22");

    const data = responseData;

    // Format dates to dd-MM-yyyy if necessary
    const formatDate = (dateStr) => {
      if (!dateStr) return "";

      const parts = dateStr.split("-");
      if (parts.length !== 3) return dateStr;

      // yyyy-MM-dd
      if (parts[0].length === 4) {
        const [year, month, day] = parts;
        return `${day}-${month}-${year}`;
      }

      // dd-MM-yyyy (already correct)
      return dateStr;
    };

    setFormValue({
      ...formValue,
      QueryId: data.QueryId || "",
      AgentId: data.AgentId || null,
      AgentName: data.AgentName || "",
      TourName: data.TourName || "",
      NoOfDays: data.NoOfDays || "",
      TourStartDate: formatDate(data.TourStartDate) || "",

      TourEndDate: formatDate(data.TourEndDate) || "",
      SeriesDate: data.SeriesDate || "",
      TourCode: data.TourCode || "",
      HandledBy: data.HandledBy || "",
      DepartmentBy: data.DepartmentBy || "",
      ExecutiveISO: data.ExecutiveISO || "",
      MealType: data.MealType || "",
      TransportCategory: data.TransportCategory || "",
      PaxSlab: data.PaxSlab || "",
      PaxDetails: {
        Total: data.PaxDetails?.Total || 0,
        SGL: data.PaxDetails?.SGL || 0,
        DBL: data.PaxDetails?.DBL || 0,
        TPL: data.PaxDetails?.TPL || 0,
        TWN: data.PaxDetails?.TWN || 0,
      },
      FOCDetails: {
        FOC: data.FOCDetails?.FOC || 0,
        DBL: data.FOCDetails?.DBL || 0,
        SGL: data.FOCDetails?.SGL || 0,
      },
      ChildDetails: {
        Child: data.ChildDetails?.Child || 0,
        CWB: data.ChildDetails?.CWB || 0,
        CNB: data.ChildDetails?.CNB || 0,
        ADTRoom: data.ChildDetails?.ADTRoom || 0,
      },
    });

    // Update arrival details
    if (data.ArrivalDetails && Array.isArray(data.ArrivalDetails)) {
      setArrivaldetail(
        data.ArrivalDetails.map((detail) => ({
          Type: detail.Type || "",
          Agent: detail.Agent || "",
          AgentReferenceNo: detail.AgentReferenceNo || "",
          Pax: data.PaxDetails?.Total || "",
          Date: formatDate(detail.Date) || "",
          Mode: detail.Mode || "",
          CityId: detail.CityId || "",
          Time: detail.Time || "",
          Details: detail.Details || "",
          PaxDetails: detail.PaxDetails || "",
          FlightNo: detail.FlightNo || "",
          CityName: detail.CityName || "",
          CountryId: detail.CountryId || "",
        }))
      );
    }

    // Update flight details
    if (data.FlightDetails && Array.isArray(data.FlightDetails)) {
      setflightdetail(
        data.FlightDetails.map((detail) => ({
          PaxType: detail.PaxType || "",
          Title: detail.Title || "",
          Gender: detail.Gender || "",
          FirstName: detail.FirstName || "",
          LastName: detail.LastName || "",
          DOB: formatDate(detail.DOB) || "",
          PassportNo: detail.PassportNo || "",
        }))
      );
    }
  };

  useEffect(() => {
    setResponseDataToFormValue(responseData);
  }, [responseData, queryData]);
  console.log(arrivaldetail, "responseData");

  return (
    <>
      <div className="card">
        <div className="card-body">
          <div className="card-header mb-2">
            <div className="d-flex align-items-center gap-4">
              <h3 className="mb-0">Tour Details</h3>
            </div>
            <div className="d-flex gap-3">
              <button
                className="btn btn-dark btn-custom-size"
                onClick={() => Navigate(-1)}
              // onClick={() =>
              //     navigate("/hotel", {
              //         state: {
              //             selectedDestination: state?.selectedDestination,
              //             selecthotelname: state?.selecthotelname,
              //         },
              //     })
              // }
              >
                <span className="me-1">Back</span>
                <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
              </button>
              <div className=" d-flex justify-content-end align-item-end">
                <button
                  onClick={handleSubmit}
                  className="btn btn-primary btn-custom-size"
                >
                  Submit
                </button>
              </div>
              {/* <ToastContainer /> */}
            </div>
          </div>{" "}
          <div className="form-validation">
            <form
              className="form-valide"
              action="#"
              method="post"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="row form-row-gap mb-3">
                <div className="col-md-6 col-lg-2">
                  <label className="fs-7" htmlFor="status">
                    Business Type
                    {/* <span className="text-danger">*</span> */}
                  </label>
                  <select
                    // name="AgentId"
                    id="status"
                    className="form-control form-control-sm"
                    value={QoutationData?.BusinessTypeId}
                  >
                    <option value="">Select</option>
                    {businesstypelist &&
                      businesstypelist?.length > 0 &&
                      businesstypelist.map((data, index) => (
                        <option value={data?.id}>{data?.Name}</option>
                      ))}
                  </select>
                </div>
                <div className="col-md-6 col-lg-2">
                  <label style={{ whiteSpace: "nowrap", fontSize: "11px" }}>
                    Agent Name
                  </label>
                  <select
                    name="AgentId"
                    id="status"
                    className="form-control form-control-sm"
                    value={formValue?.AgentId}
                    onChange={handlechange}
                  >
                    <option value="">select</option>

                    {Agentlist?.map((agent, index) => {
                      return (
                        <option value={agent?.id} key={index + 1}>
                          {agent?.CompanyName}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="col-md-6 col-lg-2">
                  <label className="m-0">Tour Name / Client Name</label>
                  <input
                    type="text"
                    placeholder="Tour Name / Client Name"
                    className="form-control form-control-sm"
                    name="TourName"
                    onChange={handlechange}
                    value={formValue?.TourName}
                  />
                  {/* <select
                                        className="form-control form-control-sm"
                                        name="HotelChain"
                                    >
                                        <option value={""}>Select</option>
                                    </select> */}
                </div>

                <div className="col-md-6 col-lg-2">
                  <label className="m-0">No of Days</label>
                  <input
                    type="text"
                    placeholder="NoOfDays"
                    className="form-control form-control-sm"
                    name="NoOfDays"
                    onChange={handlechange}
                    value={formValue?.NoOfDays || ""}
                  />
                  {/* <select
                                        className="form-control form-control-sm"
                                        name="HotelChain"
                                    >
                                        <option value={""}>Select</option>
                                    </select> */}
                </div>
                <div className="col-md-6 col-lg-2">
                  <label className="m-0">Tour Start Date</label>
                  <DatePicker
                    className="form-control form-control-sm"
                    selected={getFromDate()}
                    onChange={handleCalender}
                    dateFormat="dd-MM-yyyy"
                    value={formValue?.TourStartDate || ""}
                    name="TourStartDate"
                    isClearable
                    todayButton="Today"
                    placeholderText="Tour Start Date"
                  />
                </div>
                <div className="col-md-6 col-lg-2">
                  <label className="m-0">Tour End Date</label>
                  <DatePicker
                    className="form-control form-control-sm"
                    selected={getToDate()}
                    onChange={handleToCalender}
                    value={formValue.TourEndDate || ""}
                    dateFormat="dd-MM-yyyy"
                    name="TourEndDate"
                    isClearable
                    todayButton="Today"
                    placeholderText="Tour End Date"
                  />
                  {validationErrors?.TourEndDate && (
                    <div
                      id="val-tourenddate-error"
                      className="invalid-feedback animated fadeInUp"
                      style={{ display: "block" }}
                    >
                      {validationErrors.TourEndDate}
                    </div>
                  )}
                </div>

                <div className="col-md-6 col-lg-2">
                  <label className="m-0">Tour Creation Date</label>
                  <DatePicker
                    className="form-control form-control-sm"
                    selected={getSeriesDate()}
                    onChange={handleSeriesCalender}
                    // value={formValue.SeriesDate}
                    dateFormat="dd-MM-yyyy"
                    name="SeriesDate"
                    isClearable
                    todayButton="Today"
                    placeholderText="Tour Creation Date"
                  />
                </div>
                <div className="col-md-6 col-lg-2">
                  <label className="m-0">
                    Tour Code
                    {/* <span className="text-danger">*</span> */}
                  </label>
                  <input
                    type="text"
                    placeholder="Tour Code"
                    className="form-control form-control-sm"
                    name="TourCode"
                    onChange={handlechange}
                    value={formValue?.TourCode}
                  />
                </div>
                <div className="col-md-6 col-lg-2">
                  <label className="m-0">Handled By</label>
                  <select
                    className="form-control form-control-sm"
                    name="HandledBy"
                    onChange={handlechange}
                    value={formValue?.HandledBy}
                  >
                    <option value="">Select</option>
                    {Listusers?.map((user, index) => (
                      <option key={index + 1} value={user?.id}>
                        {user?.Name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6 col-lg-2">
                  <label className="m-0">Department By</label>
                  <select
                    className="form-control form-control-sm"
                    name="DepartmentBy"
                    onChange={handlechange}
                    value={formValue?.DepartmentBy}
                  >
                    <option value="">Select</option>
                    {Departmentlist?.map((user, index) => (
                      <option key={index + 1} value={user?.id}>
                        {user?.Name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6 col-lg-2">
                  <label className="m-0">Executive (ISO)</label>

                  <select
                    className="form-control form-control-sm"
                    name="ExecutiveISO"
                    value={formValue?.ExecutiveISO}
                    onChange={handlechange}
                  >
                    <option value="">Select</option>
                    {isomasterlist?.length > 0 &&
                      isomasterlist.map((value, index) => {
                        return (
                          <option value={value.id} key={index + 1}>
                            {value.Name}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <div className="col-md-6 col-lg-2">
                  <label className="m-0">Meal Type</label>
                  <select
                    className="form-control form-control-sm"
                    name="MealType"
                    value={formValue?.MealType}
                    onChange={handlechange}
                  >
                    {" "}
                    { }
                    <option value={""}>Select</option>
                    {mealPlanList &&
                      mealPlanList.length > 0 &&
                      mealPlanList?.map((meal, index) => {
                        return (
                          <option value={meal?.id} key={index + 1}>
                            {meal?.Name}
                          </option>
                        );
                      })}
                  </select>
                </div>
              </div>
              <div className="row form-row-gap mb-2">
                <div className="position-relative col-5 mt-2">
                  <span
                    className="position-absolute px-2 dateCardFeildSet"
                    style={{
                      top: "-0.55rem",
                      left: "1rem",
                      fontSize: "0.75rem",
                      zIndex: 1,
                    }}
                  ></span>
                  <div className="row border rounded px-2 py-2 pe-3 me-3">
                    <div className="col-2">
                      <label className="m-0">Total</label>
                      <input
                        type="number"
                        // placeholder="0"
                        className="form-control form-control-sm"
                        name="PaxDetails.Total"
                        value={formValue?.PaxDetails?.Total}
                        onChange={handlechange}
                      />
                    </div>
                    <div className="col-2">
                      <label className="m-0">TWN</label>
                      <input
                        type="number"
                        placeholder="0"
                        className="form-control form-control-sm"
                        name="PaxDetails.TWN"
                        value={formValue?.PaxDetails?.TWN}
                        onChange={handlechange}
                      />
                    </div>
                    <div className="col-2">
                      <label className="m-0">DBL</label>
                      <input
                        type="number"
                        placeholder="0"
                        className="form-control form-control-sm"
                        name="PaxDetails.DBL"
                        value={formValue?.PaxDetails?.DBL}
                        onChange={handlechange}
                      />
                    </div>
                    <div className="col-2">
                      <label className="m-0">TPL</label>
                      <input
                        type="number"
                        placeholder="0"
                        className="form-control form-control-sm"
                        name="PaxDetails.TPL"
                        value={formValue?.PaxDetails?.TPL}
                        onChange={handlechange}
                      />
                    </div>
                    <div className="col-2">
                      <label className="m-0">SGL</label>
                      <input
                        type="number"
                        placeholder="0"
                        className="form-control form-control-sm"
                        name="PaxDetails.SGL"
                        value={formValue?.PaxDetails?.SGL}
                        onChange={handlechange}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-lg-2">
                  <label className="m-0">Transport Category</label>
                  <select
                    className="form-control form-control-sm"
                    name="TransportCategory"
                    value={formValue?.TransportCategory}
                    onChange={handlechange}
                  >
                    {" "}
                    <option value={""}>Select</option>
                    {vehicleTypeList.map((vechle, index) => {
                      return (
                        <option value={vechle?.id} key={index + 1}>
                          {vechle.Name}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="col-md-6 col-lg-2">
                  <label className="m-0">Pax Slab</label>
                  <select
                    className="form-control form-control-sm"
                    name="PaxSlab"
                    value={formValue?.PaxSlab || ""}
                    onChange={handlechange}
                  >
                    {" "}
                    <option value={""}>Select</option>
                    {PaxSlablist?.map((paxslab, index) => {
                      console.log(paxslab, "paxslab");

                      return (
                        <option
                          value={`${paxslab.Min} - ${paxslab.Max}`}
                          key={index + 1}
                        >
                          {" "}
                          {paxslab.Min} - {paxslab.Max}
                        </option>
                      );
                    })}
                  </select>
                  {validationErrors?.PaxSlab && (
                    <div
                      id="val-username1-error"
                      className="invalid-feedback animated fadeInUp"
                      style={{ display: "block" }}
                    >
                      {validationErrors?.PaxSlab}
                    </div>
                  )}
                </div>
              </div>

              <div className="row form-row-gap">
                <div className="position-relative col-3 mt-2">
                  <span
                    className="position-absolute px-2 dateCardFeildSet"
                    style={{
                      top: "-0.55rem",
                      left: "1rem",
                      fontSize: "0.75rem",
                      zIndex: 1,
                    }}
                  >
                    FOC Details
                  </span>
                  <div className="row border rounded px-2 py-2 pe-3 me-3">
                    <div className="col-4">
                      <label className="m-0">FOC</label>
                      <input
                        type="number"
                        placeholder="0"
                        className="form-control form-control-sm"
                        name="FOCDetails.FOC"
                        value={formValue?.FOCDetails?.FOC}
                        onChange={handlechange}
                      />
                    </div>
                    <div className="col-4">
                      <label className="m-0">DBL</label>
                      <input
                        type="number"
                        placeholder="0"
                        className="form-control form-control-sm"
                        name="FOCDetails.DBL"
                        value={formValue?.FOCDetails?.DBL}
                        onChange={handlechange}
                      />
                    </div>

                    <div className="col-4">
                      <label className="m-0">SGL</label>
                      <input
                        type="number"
                        placeholder="0"
                        className="form-control form-control-sm"
                        name="FOCDetails.SGL"
                        value={formValue?.FOCDetails?.SGL}
                        onChange={handlechange}
                      />
                    </div>
                  </div>
                </div>
                <div className="position-relative col-4 mt-2">
                  <span
                    className="position-absolute px-2 dateCardFeildSet"
                    style={{
                      top: "-0.55rem",
                      left: "1rem",
                      fontSize: "0.75rem",
                      zIndex: 1,
                    }}
                  >
                    Child Details
                  </span>
                  <div className="row border rounded px-2 py-2 pe-3 me-3">
                    <div className="col-3">
                      <label className="m-0">Child</label>
                      <input
                        type="number"
                        placeholder="0"
                        className="form-control form-control-sm"
                        name="ChildDetails.Child"
                        value={formValue?.ChildDetails?.Child}
                        onChange={handlechange}
                      />
                    </div>
                    <div className="col-3">
                      <label className="m-0">CWB</label>
                      <input
                        type="number"
                        placeholder="0"
                        className="form-control form-control-sm"
                        name="ChildDetails.CWB"
                        value={formValue?.ChildDetails?.CWB}
                        onChange={handlechange}
                      />
                    </div>

                    <div className="col-3">
                      <label className="m-0">CNB</label>
                      <input
                        type="number"
                        placeholder="0"
                        className="form-control form-control-sm"
                        name="ChildDetails.CNB"
                        value={formValue?.ChildDetails?.CNB}
                        onChange={handlechange}
                      />
                    </div>
                    <div className="col-3">
                      <label className="m-0">Adult</label>
                      <input
                        type="number"
                        placeholder="0"
                        className="form-control form-control-sm"
                        name="ChildDetails.ADTRoom"
                        value={formValue?.ChildDetails?.ADTRoom}
                        onChange={handlechange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          {/* <div className="col-md-12 col-lg-12 overflow tablelist" style={{ overflowY: 'auto',overflowX: 'hidden' }}>
                        <h5 className="">Hotel</h5>
                        <table className="table table-bordered itinerary-table">
                            <thead>
                                <tr>
                                    <th>S.No.</th>
                                    <th>Entry</th>
                                    <th>From</th>
                                    <th>To</th>
                                    <th>Hotel</th>
                                    <th>Nights</th>
                                    <th>Double Rooms</th>
                                    <th>Double Amount</th>
                                    <th>Twin Rooms</th>
                                    <th>Twin Amount</th>
                                    <th>Single Rooms</th>
                                    <th>Single Amount</th>
                                    <th>Triple Rooms</th>
                                    <th>Triple Amount</th>
                                    <th>Voucher No</th>
                                    <th>Client Conf</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>

                            </tbody>
                        </table>
                        <h5 className="">Restaurant</h5>
                        <table className="table table-bordered itinerary-table">
                            <thead>
                                <tr>
                                    <th>S.No.</th>
                                    <th>Entry</th>
                                    <th>Restaurant / Hotel</th>
                                    <th>Date</th>
                                    <th>Pax</th>
                                    <th>Breakfast Amount</th>
                                    <th>Lunch Amount</th>
                                    <th>Dinner Amount</th>
                                    <th>Voucher No</th>
                                    <th>Status</th>

                                </tr>
                            </thead>
                            <tbody>

                            </tbody>
                        </table>
                    </div> */}
          <div className="custom-tab-1">
            <Tab.Container defaultActiveKey="ArrivalDeparture">
              <>
                <Nav
                  as="ul"
                  className="nav-tabs"
                  style={{ backgroundColor: "var(--rgba-primary-1)" }}
                >
                  <Nav.Item as="li">
                    <Nav.Link eventKey="ArrivalDeparture">
                      <span className="nav-name">
                        Arrival / Departure Details
                      </span>
                    </Nav.Link>
                  </Nav.Item>
                  {/* <Nav.Item as="li">
                    <Nav.Link eventKey="FlightTrain">
                      <span className="nav-name">Flight / Train Details</span>
                    </Nav.Link>
                  </Nav.Item> */}
                  {/* <Nav.Item as="li">
                                        <Nav.Link eventKey="PaxDetails">
                                            <span className="nav-name">Pax Details</span>
                                        </Nav.Link>               //  remove here
                                    </Nav.Item> */}
                  <button
                    type="button"
                    className="btn edit-query-button-bg  py-1 font-size-10 rounded-1"
                    style={{
                      marginLeft: "auto",
                      marginTop: "6px",
                      marginBottom: "6px",
                      marginRight: "6px",
                    }}
                    onClick={() => setLgShow(true)}
                  >
                    CUTOFF PEROID
                  </button>
                </Nav>

                <Tab.Content className="pt-2">
                  <Tab.Pane eventKey="ArrivalDeparture">
                    <table className="table table-bordered itinerary-table">
                      <thead>
                        <tr>
                          <th>Type</th>
                          <th>Agent</th>
                          <th>Agent Ref No</th>
                          <th>Pax</th>
                          <th>Date</th>
                          <th>Mode</th>
                          <th>Country </th>
                          <th> City</th>
                          {/* <th> </th> */}
                          {/* <th>Flight / Train No.</th> */}
                          <th>FlightNo / TrainNo</th>
                          <th>Time</th>
                          <th>Details</th>
                          <th>Pax Details</th>

                          {/* <th>css</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {arrivaldetail?.map((detail, index) => {
                          return (
                            <tr key={index + 1}>
                              <td>
                                <select
                                  className="formControl1"
                                  name="Type"
                                  style={{ width: "100%" }}
                                  value={detail?.Type}
                                  onChange={(e) =>
                                    handleArrivalformForm(e, index)
                                  }
                                >
                                  <option value={""}>Select</option>
                                  <option value="Arrival">Arrival</option>
                                  <option value={"Departure"}>Departure</option>
                                </select>
                              </td>

                              <td>
                                <Select
                                  id={`Agent-${index}`}
                                  options={[
                                    { value: "", label: "Select" },
                                    ...(Agentlist?.map((agent) => ({
                                      value: agent?.id,
                                      label: agent?.CompanyName,
                                    })) || []),
                                  ]}
                                  value={(() => {
                                    const selectedOption = Agentlist?.find(
                                      (agent) => agent?.id == detail?.Agent
                                    ) || { value: "", label: "Select" };
                                    return {
                                      value: selectedOption?.id,
                                      label: selectedOption?.CompanyName,
                                    };
                                  })()}
                                  onChange={(option) =>
                                    handleArrivalformForm(
                                      {
                                        target: {
                                          name: "Agent",
                                          value: option?.value || "",
                                        },
                                      },
                                      index
                                    )
                                  }
                                  styles={customStyles}
                                  isSearchable
                                  className="customSelectLightTheame"
                                  classNamePrefix="custom"
                                  placeholder="Select Agent"
                                  filterOption={(option, inputValue) =>
                                    option.label
                                      .toLowerCase()
                                      .startsWith(inputValue.toLowerCase())
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="formControl1"
                                  name="AgentReferenceNo"
                                  value={detail?.AgentReferenceNo}
                                  onChange={(e) =>
                                    handleArrivalformForm(e, index)
                                  }
                                  style={{ width: "100%", textAlign: "center" }}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="formControl1"
                                  name="Pax"
                                  value={
                                    detail?.Pax || formValue?.PaxDetails?.Total
                                  }
                                  onChange={(e) =>
                                    handleArrivalformForm(e, index)
                                  }
                                  style={{ width: "100%", textAlign: "center" }}
                                />
                              </td>
                              <td>
                                <DatePicker
                                  style={{ width: "100%", textAlign: "center" }}
                                  className="formControl1"
                                  selected={getArrivalDOB(index)}
                                  onChange={(date) =>
                                    handleArrivalCalender(date, index)
                                  }
                                  dateFormat="dd-MM-yyyy"
                                  name="Date"
                                  // value={detail?.Date}
                                  // isClearable
                                  todayButton="Today"
                                  placeholderText="13-12-2025"
                                />
                              </td>
                              <td>
                                <select
                                  className="formControl1"
                                  name="Mode"
                                  onChange={(e) =>
                                    handleArrivalformForm(e, index)
                                  }
                                  style={{ width: "100%" }}
                                  value={detail?.Mode}
                                >
                                  <option value="">Select</option>
                                  <option value="flight">Flight</option>
                                  <option value="train">Train</option>
                                  <option value="surface">Surface</option>
                                </select>
                              </td>
                              <td>
                                <select
                                  name="CountryId"
                                  id="status"
                                  className="form-control form-control-sm"
                                  // value={formValue?.CountryId}
                                  value={detail?.CountryId}
                                  onChange={(e) =>
                                    handleArrivalformForm(e, index)
                                  }
                                // onChange={(e) => setcountryid(e.target.value)}
                                >
                                  <option value="">Select</option>
                                  {countryList &&
                                    countryList?.length > 0 &&
                                    countryList.map((data, index) => (
                                      <option value={data?.id}>
                                        {data?.Name}
                                      </option>
                                    ))}
                                </select>
                              </td>
                              <td>
                                <select
                                  className="formControl1"
                                  name="CityId"
                                  onChange={(e) =>
                                    handleArrivalformForm(e, index)
                                  }
                                  style={{ width: "100%" }}
                                  value={detail?.CityId}
                                >
                                  <option value={""}>Select</option>
                                  {destinationList?.map((qout, index) => {
                                    return (
                                      <option value={qout?.id} key={index + 1}>
                                        {qout?.Name}
                                      </option>
                                    );
                                  })}
                                </select>
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="formControl1"
                                  name="FlightNo"
                                  value={detail?.FlightNo}
                                  onChange={(e) =>
                                    handleArrivalformForm(e, index)
                                  }
                                  style={{ width: "100%", textAlign: "center" }}
                                />
                              </td>
                              <td>
                                {/* 
                                                                        className="formControl1"
                                                                        name="Time"
                                                                        onChange={(e) =>
                                                                            handleArrivalformForm(e,index)
                                                                        }
                                                                        value={detail?.Time}
                                                                        style={{ width: "100%",textAlign: "center" }} /> */}
                                {console.log(detail?.Time, "detail?.Time")}
                                <input
                                  type="text"
                                  name="Time"
                                  value={detail?.Time || ""}
                                  className="formControl1"
                                  onChange={(e) =>
                                    handleArrivalformForm(e, index)
                                  }
                                // style={{
                                //   width: "100%",
                                //   textAlign: "center",
                                //   padding: "5px",
                                //   borderRadius: "4px",
                                //   border: "1px solid #ccc",
                                // }}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="formControl1"
                                  name="Details"
                                  onChange={(e) =>
                                    handleArrivalformForm(e, index)
                                  }
                                  value={detail?.Details}
                                  style={{ width: "100%", textAlign: "center" }}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="formControl1"
                                  name="PaxDetails"
                                  value={detail?.PaxDetails}
                                  onChange={(e) =>
                                    handleArrivalformForm(e, index)
                                  }
                                  style={{ width: "100%", textAlign: "center" }}
                                />
                              </td>

                              <td>
                                <div className="d-flex w-100 justify-content-center gap-2 ">
                                  <span
                                    onClick={() =>
                                      handleArrivalIncrement(index)
                                    }
                                  >
                                    <i className="la la-plus border cursor-pointer bg-success text-white rounded-pill fontSize10px padding1px"></i>
                                  </span>
                                  <span
                                    onClick={() =>
                                      handleArrivalDecrement(index)
                                    }
                                  >
                                    <i className="la la-minus  border cursor-pointer bg-primary text-white rounded-pill fontSize10px padding1px"></i>
                                  </span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </Tab.Pane>
                  <Tab.Pane eventKey="FlightTrain">
                    <table className="table table-bordered itinerary-table">
                      <thead>
                        <tr>
                          <th>PaxType</th>
                          <th>Title</th>
                          <th>Gender</th>
                          <th>FirstName</th>
                          <th>LastName</th>
                          <th>DOB</th>
                          <th>PassportNo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {flightdetail?.map((detail, index) => {
                          return (
                            <tr key={index + 1}>
                              <td>
                                <select
                                  className="formControl1"
                                  name="PaxType"
                                  style={{ width: "100%" }}
                                  value={detail?.Type}
                                  onChange={(e) => handleFlightChange(e, index)}
                                >
                                  {/* <option value={""}>Select</option> */}
                                  <option value={"Arrival"}>Arrival</option>
                                  <option value={"Departure"}>Departure</option>
                                </select>
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="formControl1"
                                  name="Title"
                                  value={detail?.Title}
                                  onChange={(e) => handleFlightChange(e, index)}
                                  style={{ width: "100%", textAlign: "center" }}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="formControl1"
                                  name="Gender"
                                  value={detail?.Gender}
                                  onChange={(e) => handleFlightChange(e, index)}
                                  style={{ width: "100%", textAlign: "center" }}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="formControl1"
                                  name="FirstName"
                                  value={detail?.FirstName}
                                  onChange={(e) => handleFlightChange(e, index)}
                                  style={{ width: "100%", textAlign: "center" }}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="formControl1"
                                  name="LastName"
                                  value={detail?.LastName}
                                  onChange={(e) => handleFlightChange(e, index)}
                                  style={{ width: "100%", textAlign: "center" }}
                                />
                              </td>
                              <td>
                                <DatePicker
                                  style={{ width: "100%", textAlign: "center" }}
                                  className="formControl1"
                                  selected={getFlightDOB(index)}
                                  onChange={(date) =>
                                    handleflightCalender(date, index)
                                  }
                                  dateFormat="dd-MM-yyyy"
                                  name="DOB"
                                  todayButton="Today"
                                  placeholderText="13-12-2025"
                                />
                              </td>
                              <td>
                                <select
                                  className="formControl1"
                                  name="PassportNo"
                                  value={detail?.DOB}
                                  style={{ width: "100%" }}
                                  onChange={(e) => handleFlightChange(e, index)}
                                >
                                  <option value={""}>None</option>
                                </select>
                              </td>

                              <td>
                                <div className="d-flex w-100 justify-content-center gap-2 ">
                                  <span
                                    onClick={() => handleFlightIncrement(index)}
                                  >
                                    <i className="la la-plus border cursor-pointer bg-success text-white rounded-pill fontSize10px padding1px"></i>
                                  </span>
                                  <span
                                    onClick={() => handleFlightDecrement(index)}
                                  >
                                    <i className="la la-minus  border cursor-pointer bg-primary text-white rounded-pill fontSize10px padding1px"></i>
                                  </span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </Tab.Pane>
                  <Tab.Pane eventKey="PaxDetails">
                    <PaxDetails />
                  </Tab.Pane>
                </Tab.Content>
              </>
            </Tab.Container>
          </div>
          <Modal
            size="md"
            show={lgShow}
            onHide={() => setLgShow(false)}
            aria-labelledby="example-modal-sizes-title-lg"
          >
            <Modal.Header closeButton>
              <Modal.Title id="example-modal-sizes-title-lg">
                CUTOFF PEROID
              </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ padding: "10px" }}>
              <div className="row form-row-gap mb-3 w-50 mx-auto">
                <div className="col-12 d-flex align-items-center gap-3">
                  <label
                    style={{
                      whiteSpace: "nowrap",
                      fontSize: "11px",
                      minWidth: "80px",
                    }}
                  >
                    Hotel :
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    className="form-control form-control-sm"
                    name="HotelName"
                  />
                  <div className="form-check check-sm d-flex align-items-center">
                    <input
                      type="checkbox"
                      className="form-check-input height-em-1 width-em-1"
                    />
                  </div>
                </div>
                <div className="col-12 d-flex align-items-center gap-3">
                  <label
                    style={{
                      whiteSpace: "nowrap",
                      fontSize: "11px",
                      minWidth: "80px",
                    }}
                  >
                    Flight :
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    className="form-control form-control-sm"
                    name="Flight"
                  />
                  <div className="form-check check-sm d-flex align-items-center">
                    <input
                      type="checkbox"
                      className="form-check-input height-em-1 width-em-1"
                    />
                  </div>
                </div>
                <div className="col-12 d-flex align-items-center gap-3">
                  <label
                    style={{
                      whiteSpace: "nowrap",
                      fontSize: "11px",
                      minWidth: "80px",
                    }}
                  >
                    Transport :
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    className="form-control form-control-sm"
                    name="Transport"
                  />
                  <div className="form-check check-sm d-flex align-items-center">
                    <input
                      type="checkbox"
                      className="form-check-input height-em-1 width-em-1"
                    />
                  </div>
                </div>
                <div className="col-12 d-flex align-items-center gap-3">
                  <label
                    style={{
                      whiteSpace: "nowrap",
                      fontSize: "11px",
                      minWidth: "80px",
                    }}
                  >
                    General Train :
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    className="form-control form-control-sm"
                    name="General Train"
                  />
                  <div className="form-check check-sm d-flex align-items-center">
                    <input
                      type="checkbox"
                      className="form-check-input height-em-1 width-em-1"
                    />
                  </div>
                </div>
                <div className="col-12 d-flex align-items-center gap-3">
                  <label
                    style={{
                      whiteSpace: "nowrap",
                      fontSize: "11px",
                      minWidth: "80px",
                    }}
                  >
                    Luxury Train :
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    className="form-control form-control-sm"
                    name="Luxury Train"
                  />
                  <div className="form-check check-sm d-flex align-items-center">
                    <input
                      type="checkbox"
                      className="form-check-input height-em-1 width-em-1"
                    />
                  </div>
                </div>
              </div>
            </Modal.Body>
          </Modal>
          <div className=" d-flex justify-content-end gap-2 align-item-end">
            <button
              className="btn btn-dark btn-custom-size"
              onClick={() => Navigate(-1)}
            >
              <span className="me-1">Back</span>
              <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
            </button>
            <button
              onClick={handleSubmit}
              className="btn btn-primary btn-custom-size"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default TourDetails;
