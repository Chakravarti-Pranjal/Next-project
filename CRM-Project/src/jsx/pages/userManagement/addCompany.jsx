import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosOther } from "../../../http/axios_base_url";
import useMultipleSelect from "../../../hooks/custom_hooks/useMultipleSelect";
import { companyIntialValue } from "./user-intial-values";
import Select from "react-select";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { ThemeContext } from "../../../context/ThemeContext";
import { select_customStyles } from "../../../css/custom_style";
import { companyAddValidation } from "./user_validation";
import {
  notifySuccess,
  notifyError,
  notifyErrorCustom,
} from "../../../helper/notify";

const customStyles = {
  control: (provided) => ({
    width: "auto", // Set to 'auto' for responsive width
    // Minimum height
    height: "1.8rem", // Fixed height
    padding: "0px", // Remove default padding
    border: "1px solid #ccc7c7", // Border to define control
    borderRadius: "0.5rem",
    "&:hover": {
      border: "1px solid #aaa",
    },
  }),
  valueContainer: (provided) => ({
    // ...provided,
    padding: "0px", // Remove padding
    paddingLeft: "4px",
    height: "20px", // Match height
    display: "flex",
    alignItems: "center", // Center content vertically
    justifyContent: "center", // Center content horizontally
    textAlign: "center",
  }),
  placeholder: (provided) => ({
    // ...provided,
    margin: "0", // Adjust placeholder margin
    fontSize: "0.76562rem", // Adjust font size as needed
    textAlign: "center", // Center text horizontally
    flex: 1, // Allow placeholder to take available space
    color: "#6e6e6e",
  }),
  singleValue: (provided) => ({
    // ...provided,
    margin: "0", // Adjust single value margin
    fontSize: "0.76562rem", // Adjust font size as needed
    textAlign: "center",
  }),
  dropdownIndicator: (provided) => ({
    // ...provided,
    display: "none", // Hide the dropdown indicator (icon)
  }),
  option: (provided) => ({
    ...provided,
    padding: "4px 1px", // Padding for options
    fontSize: "0.76562rem", // Adjust font size as needed
    overflow: "hidden", // Prevent overflow
    paddingLeft: "4px",
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999, // Ensure the dropdown appears above other elements
    overflowY: "hidden", // Hide vertical scrollbar
    overflowX: "hidden", // Hide horizontal scrollbar
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: "150px", // Set maximum height for list
    overflowY: "auto",
    "&::-webkit-scrollbar": {
      display: "none", // Hide scrollbar for Chrome/Safari
      width: "2px",
    },
  }),
};
const AddCompany = () => {
  const { background } = useContext(ThemeContext);
  const { state } = useLocation();

  const navigate = useNavigate();
  const [formValue, setFormValue] = useState(companyIntialValue);
  const [languageList, setLanguageList] = useState([]);
  const [destinationList, setDestinationList] = useState([]);

  const [countryList, setCountryList] = useState([]);
  const [country, setCountry] = useState("");
  const [stateList, setStateList] = useState([]);
  const [stateListPerCountry, setStateListPerCountry] = useState([]);
  const [stateCity, setStateCity] = useState("");
  const [stateData, setStateData] = useState("");
  const [cityListPerState, setCityListPerState] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [city, setCity] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [phoneValue, setPhoneValue] = useState({
    PHONE: "",
    ALTERNATEPHONE: "",
  });
  const [GSTarray, setGSTarray] = useState([
    {
      StateId: "",
      GSTNo: "",
    },
  ]);

  const [registeredEmails, setRegisteredEmails] = useState([]); // Store registered emails
  const [emailError, setEmailError] = useState("");
  const [isEditing, setIsEditing] = useState(state?.ID ? true : false);

  const countryOptions = countryList.map((item) => ({
    value: item.id,
    label: item.Name,
  }));
  const stateOptions = stateList.map((item) => ({
    value: item.id,
    label: item.Name,
  }));
  // State per Country
  const stateOptionsPerCountry = stateListPerCountry.map((item) => ({
    value: item.id,
    label: item.Name,
  }));
  const cityOptions = cityList.map((item) => ({
    value: item.id,
    label: item.Name,
  }));

  // City per State
  const cityOptionPerState = cityListPerState.map((item) => ({
    value: item.id,
    label: item.Name,
  }));
  const destinationOption = destinationList?.map((dest) => {
    return {
      value: dest?.id,
      label: dest?.Name,
    };
  });

  const {
    SelectInput: DestinationInput,
    selectedData: destinationSelected,
    setSelectedData: setDestinationSelected,
  } = useMultipleSelect(destinationOption);

  const getStateAndCityData = async () => {
    try {
      const { data } = await axiosOther.post("listStateByCountry", {
        countryid: country,
      });

      setStateListPerCountry(data?.DataList);
    } catch (error) {
      console.log(error);
    }
    try {
      const { data } = await axiosOther.post("listCityByStateandCountryName", {
        stateid: stateCity,
      });

      setCityListPerState(data?.DataList);
    } catch (error) {
      console.log(error);
    }
  };

  const getDataToServer = async () => {
    try {
      const language = await axiosOther.post("destinationlist", {
        Search: "",
        Status: 1,
      });
      setDestinationList(language.data.DataList);
    } catch (err) {
      console.log(err);
    }
    try {
      const { data } = await axiosOther.post("countrylist", {
        Search: "",
        Status: 1,
      });

      setCountryList(data?.DataList);

      console.log(data?.DataList);
    } catch (err) {
      console.log(err);
    }
    try {
      const { data } = await axiosOther.post("statelist", {
        Search: "",
        Status: 1,
      });

      setStateList(data?.DataList);
    } catch (err) {
      console.log(err);
    }

    try {
      const { data } = await axiosOther.post("citylist", {
        Search: "",
        Status: 1,
      });

      setCityList(data?.DataList);
    } catch (err) {
      console.log(err);
    }
  };
  useCallback(() => { }, []);

  const handleGSTArray = () => {
    setGSTarray([
      ...GSTarray,
      {
        StateId: "",
        GSTNo: "",
      },
    ]);
  };

  const handleDeleteGSTArray = (index) => {
    const updatedGSTarray = GSTarray.filter((_, idx) => idx !== index);
    setGSTarray(updatedGSTarray);
  };

  useEffect(() => {
    const num =
      state?.DESTINATION?.length > 0
        ? state?.DESTINATION.map((dest) => dest?.["DestinationName"])
        : [];
    console.log({ num }, "state");

    getDataToServer();

    if (state) {
      console.log({ state });
      setFormValue({
        FK_PARENTID: state?.FK_PARENTID,
        COMPANYNAME: state?.COMPANYNAME,
        REGISTEREDEMAIL: state?.REGISTEREDEMAIL,
        ALTERNATEEMAIL: state?.ALTERNATEEMAIL,
        FirstName: state?.FirstName,
        LastName: state?.LastName,

        LICENSEKEY: state?.LICENSEKEY,
        PAN: state?.PAN,
        TAN: state?.TAN,
        CIN: state?.CIN,
        LUT: state?.LUT,
        GST: state?.GST,
        DESTINATION: [],
        ZIP: state?.ZIP,
        ADDRESS1: state?.ADDRESS1,
        ADDRESS2: state?.ADDRESS2,
        ISACTIVE: 1,
        ACTIONDATE: state?.ACTIONDATE,
        RoleName: state?.RoleName,
        GuardName: state?.GuardName,
        OrgName: state?.OrgName,
        ReportingManagerId: [],
        AddedBy: "1",
        email_key_id: "4",
      });
      setCountry(state?.COUNTRYID);
      console.log({ country });
      setStateCity(state?.STATEID);
      setCity(state?.CITYID);
      setPhoneValue({
        PHONE: state?.PHONE,
        ALTERNATEPHONE: state?.ALTERNATEPHONE,
      });
      setGSTarray(state?.GST);
      setDestinationSelected(
        state?.DESTINATION?.length > 0
          ? state?.DESTINATION.map((dest) => dest?.["DestinationName"])
          : []
      );
    }
  }, []);

  useEffect(() => {
    if (state && country && stateCity) {
      getStateAndCityData();
    }
  }, [state, country, stateCity]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let key = JSON.parse(localStorage.getItem("token"))?.companyKey;

    if (state?.ID) {
      console.log(state?.ID);
      try {
        // await companyAddValidation.validate(
        //   {
        //     ...formValue,
        //     ...phoneValue,
        //     COMPANYKEY: key,
        //     DESTINATION: destinationSelected,
        //     COUNTRY: country,
        //     STATE: stateCity,
        //     CITY: city,
        //     GST: GSTarray,
        //   },
        //   {
        //     abortEarly: false,
        //   }
        // );

        // setValidationErrors({});

        const {
          COMPANYNAME,
          REGISTEREDEMAIL,
          ALTERNATEEMAIL,
          LastName,
          ADDRESS1,
          ADDRESS2,
          LICENSEKEY,
          PAN,
          TAN,
          CIN,
          LUT,
          ZIP,
          ISACTIVE,
          AddedBy,
        } = formValue;

        const temp = {
          id: parseInt(state.ID),
          COMPANYNAME,
          REGISTEREDEMAIL,
          ALTERNATEEMAIL,
          FirstName: COMPANYNAME,
          LastName,
          ADDRESS1,
          ADDRESS2,
          LICENSEKEY,
          PAN,
          TAN,
          CIN,
          LUT,
          ZIP,
          ISACTIVE,
          AddedBy,
          ...phoneValue,
          COMPANYKEY: `${key}`,
          DESTINATION: destinationSelected,
          COUNTRY: country,
          STATE: stateCity,
          CITY: city,
          GST: GSTarray,
        };

        console.log("DESTINATION: ", temp);

        const { data } = await axiosOther.post("updateCompany", {
          id: parseInt(state.ID),
          COMPANYNAME,
          REGISTEREDEMAIL,
          ALTERNATEEMAIL,
          FirstName: COMPANYNAME,
          LastName,
          ADDRESS1,
          ADDRESS2,
          LICENSEKEY,
          PAN,
          TAN,
          CIN,
          LUT,
          ZIP,
          ISACTIVE,
          AddedBy,
          ...phoneValue,
          COMPANYKEY: `${key}`,
          DESTINATION: destinationSelected,
          COUNTRY: country,
          STATE: stateCity,
          CITY: city,
          GST: GSTarray,
        });

        if (data?.Status === 1) {
          // setFormValue(companyIntialValue);
          // setPhoneValue({ PHONE: "", ALTERNATEPHONE: "" });
          setTimeout(() => {
            navigate("/company");
          }, 3000);
          notifySuccess(data?.message || data?.Message);
        } else {
          // console.log(data.errors);
          notifyErrorCustom(data.errors);
        }
      } catch (error) {
        console.log(error);
        if (error.inner) {
          const validationErrorss = error.inner.reduce((acc, curr) => {
            acc[curr.path] = curr.message;
            return acc;
          }, {});
          setValidationErrors(validationErrorss);
        }

        if (error.response?.data?.Errors || error.response?.data?.errors) {
          const data = Object.entries(
            error.response?.data?.Errors || error.response?.data?.errors
          );
          notifyError(data[0][1]);
        }
      }

      return;
    }

    try {
      await companyAddValidation.validate(
        {
          ...formValue,
          ...phoneValue,
          COMPANYKEY: key,
          DESTINATION: destinationSelected,
          COUNTRY: country,
          STATE: stateCity,
          CITY: city,
          GST: GSTarray,
        },
        {
          abortEarly: false,
        }
      );

      setValidationErrors({});
      const {
        COMPANYNAME,
        REGISTEREDEMAIL,
        ALTERNATEEMAIL,
        LastName,
        ADDRESS1,
        ADDRESS2,
        LICENSEKEY,
        PAN,
        TAN,
        CIN,
        LUT,
        ZIP,
        ISACTIVE,
        AddedBy,
      } = formValue;

      const { data } = await axiosOther.post("companycreate", {
        COMPANYNAME,
        REGISTEREDEMAIL,
        ALTERNATEEMAIL,
        FirstName: COMPANYNAME,
        LastName,
        ADDRESS1,
        ADDRESS2,
        LICENSEKEY,
        PAN,
        TAN,
        CIN,
        LUT,
        ZIP,
        ISACTIVE,
        AddedBy,
        ...phoneValue,
        COMPANYKEY: `${key}`,
        DESTINATION: destinationSelected,
        COUNTRY: country,
        STATE: stateCity,
        CITY: city,
        GST: GSTarray,
      });
      console.log("Data", data);

      if (data?.Status === 1) {
        // getListDataToServer();
        // setIsEditing(false);
        setFormValue(companyIntialValue);
        setPhoneValue({ PHONE: "", ALTERNATEPHONE: "" });
        setTimeout(() => {
          navigate("/company");
        }, 3000);
        notifySuccess(data?.message || data?.Message);
      } else {
        console.log(data.errors);
        notifyErrorCustom(data.errors);
      }
    } catch (error) {
      console.log(error);
      if (error.inner) {
        const validationErrorss = error.inner.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {});
        setValidationErrors(validationErrorss);
      }

      if (error.response?.data?.Errors || error.response?.data?.errors) {
        const data = Object.entries(
          error.response?.data?.Errors || error.response?.data?.errors
        );
        notifyError(data[0][1]);
      }
    }
  };

  // Handler Select change
  const handleSelectChange = (selectedOption, name) => {
    switch (name) {
      case "country":
        setCountry(selectedOption.value);
        setStateCity(""); // Reset state selection
        setStateListPerCountry([]); // Clear state options
        setCity(""); // Reset city selection
        setCityListPerState([]); // Clear city options

        // Fetch states for the selected country
        axiosOther
          .post("listStateByCountry", { countryid: selectedOption.value })
          .then(({ data }) => {
            setStateListPerCountry(data?.DataList || []);
          })
          .catch((error) => console.log(error));

        break;

      case "stateCity":
        setStateCity(selectedOption.value);
        setCity(""); // Reset city selection when state changes
        setCityListPerState([]); // Clear city options

        console.log("Selected State:", selectedOption);

        // Fetch cities for the selected state
        axiosOther
          .post("listCityByStateandCountryName", {
            stateid: selectedOption.value,
          })
          .then(({ data }) => {
            setCityListPerState(data?.DataList || []);
          })
          .catch((error) => console.log(error));

        break;

      case "city":
        setCity(selectedOption.value);
        break;

      default:
        console.log("No valid selection");
    }
  };

  const handlePhoneChange = (phone, nameValue) => {
    setPhoneValue({ ...phoneValue, [nameValue]: phone });
  };

  const handleGSTChange = (index, event) => {
    console.log(index, event);
    const { name, value } = event.target;
    const updatedGSTarray = [...GSTarray];
    updatedGSTarray[index][name] = value;
    setGSTarray(updatedGSTarray);
    console.log(GSTarray, "GSTarray11");
  };
  const handleSelectStateChange = (selectedOption, name, index) => {
    const updatedGSTarray = [...GSTarray];
    updatedGSTarray[index].StateId = selectedOption ? selectedOption.value : "";
    setGSTarray(updatedGSTarray);
  };

  // Check emial useEffact
  useEffect(() => {
    const fetchRegisteredEmails = async () => {
      try {
        const { data } = await axiosOther.post("companylist");
        const emails =
          data?.DataList?.map((item) => item.REGISTEREDEMAIL) || [];
        setRegisteredEmails(emails);
      } catch (error) {
        console.error("Error fetching registered emails:", error);
      }
    };

    fetchRegisteredEmails();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    // Check if the email is already registered
    if (name === "REGISTEREDEMAIL" && registeredEmails.includes(value)) {
      setEmailError("This email is already registered.");
    } else {
      setEmailError("");
    }

    setFormValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler Reset From Data
  const handleResetFormData = async (e) => {
    e.preventDefault();
    setFormValue(companyIntialValue);
    setPhoneValue({ PHONE: "", ALTERNATEPHONE: "" });
  };

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header">
            <h4 className="card-title">Company</h4>
            <button
              className="btn btn-dark btn-custom-size"
              name="SaveButton"
              onClick={() => navigate("/company")}
            >
              <span className="me-1">Back</span>
              <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
            </button>
          </div>
          <div className="card-body">
            <div className="form-validation">
              <ToastContainer />
              <form className="form-valide" onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-12">
                    <div className="row form-row-gap">
                      <div className="col-md-6 col-lg-2">
                        <label htmlFor="name">
                          Company Name
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control form-control-sm `}
                          name="COMPANYNAME"
                          placeholder="Enter Company Name"
                          value={formValue?.COMPANYNAME}
                          onChange={handleFormChange}
                        />
                        {validationErrors?.COMPANYNAME && (
                          <div
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {validationErrors?.COMPANYNAME}
                          </div>
                        )}
                      </div>
                      <div className="col-md-6 col-lg-2">
                        <label htmlFor="email">
                          Email<span className="text-danger">*</span>
                        </label>
                        <input
                          type="email"
                          className="form-control form-control-sm"
                          name="REGISTEREDEMAIL"
                          placeholder="Enter your Email"
                          value={formValue?.REGISTEREDEMAIL}
                          onChange={handleFormChange}
                        />
                        {emailError && (
                          <p className="text-danger small">{emailError}</p>
                        )}
                        {validationErrors?.REGISTEREDEMAIL && (
                          <div
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {validationErrors?.REGISTEREDEMAIL}
                          </div>
                        )}
                      </div>

                      <div className="col-md-6 col-lg-2">
                        <label htmlFor="email">Alternate Email</label>
                        <input
                          type="email"
                          className={`form-control form-control-sm `}
                          name="ALTERNATEEMAIL"
                          placeholder="Enter your Email"
                          value={formValue?.ALTERNATEEMAIL}
                          onChange={handleFormChange}
                        />
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <label htmlFor="Phone">
                          Phone
                          <span className="text-danger">*</span>
                        </label>

                        <PhoneInput
                          defaultCountry="in"
                          value={phoneValue?.PHONE}
                          onChange={(phone) =>
                            handlePhoneChange(phone, "PHONE")
                          }
                          style={{ height: "1.8rem" }}
                        />
                        {validationErrors?.PHONE && (
                          <div
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {validationErrors?.PHONE}
                          </div>
                        )}
                      </div>

                      <div className="col-md-6 col-lg-3">
                        <label htmlFor="Mobile">Alternate Phone</label>
                        <PhoneInput
                          defaultCountry="in"
                          value={phoneValue?.ALTERNATEPHONE}
                          onChange={(phone) =>
                            handlePhoneChange(phone, "ALTERNATEPHONE")
                          }
                        />
                      </div>
                      <div className="col-md-6 col-lg-2">
                        <label htmlFor="Pin">Zip</label>
                        <input
                          type="number"
                          className={`form-control form-control-sm`}
                          name="ZIP"
                          placeholder="Enter a Zip Code"
                          value={formValue?.ZIP}
                          onChange={handleFormChange}
                        />
                      </div>
                      <div className="col-md-6 col-lg-2">
                        <label htmlFor="LICENSEKEY">
                          License Key
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control form-control-sm`}
                          name="LICENSEKEY"
                          placeholder="Enter License Key"
                          value={formValue?.LICENSEKEY}
                          onChange={handleFormChange}
                        />
                        {validationErrors?.LICENSEKEY && (
                          <div
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {validationErrors?.LICENSEKEY}
                          </div>
                        )}
                      </div>
                      <div className="col-md-6 col-lg-2">
                        <label htmlFor="shortName">
                          PAN
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control form-control-sm ${validationErrors?.PAN ? "is-invalid" : ""
                            }`}
                          name="PAN"
                          placeholder="Enter PAN"
                          value={formValue?.PAN}
                          onChange={handleFormChange}
                        />
                        {validationErrors?.PAN && (
                          <div
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {validationErrors?.PAN}
                          </div>
                        )}
                      </div>

                      <div className="col-md-6 col-lg-2">
                        <label htmlFor="TAN">
                          TAN
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control form-control-sm ${validationErrors?.TAN ? "is-invalid" : ""
                            }`}
                          name="TAN"
                          placeholder="Enter TAN"
                          value={formValue?.TAN}
                          onChange={handleFormChange}
                        />
                        {validationErrors?.TAN && (
                          <div
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {validationErrors?.TAN}
                          </div>
                        )}
                      </div>
                      <div className="col-md-6 col-lg-2">
                        <label htmlFor="CIN">
                          CIN
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control form-control-sm ${validationErrors?.CIN ? "is-invalid" : ""
                            }`}
                          name="CIN"
                          placeholder="Enter CIN"
                          value={formValue?.CIN}
                          onChange={handleFormChange}
                        />
                        {validationErrors?.CIN && (
                          <div
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {validationErrors?.CIN}
                          </div>
                        )}
                      </div>
                      <div className="col-md-6 col-lg-2">
                        <label htmlFor="LUT">
                          LUT
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control form-control-sm ${validationErrors?.LUT ? "is-invalid" : ""
                            }`}
                          name="LUT"
                          placeholder="Enter LUT"
                          value={formValue?.LUT}
                          onChange={handleFormChange}
                        />
                        {validationErrors?.LUT && (
                          <div
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {validationErrors?.LUT}
                          </div>
                        )}
                      </div>

                      {/* Hour */}
                      <div className="col-md-6 col-lg-2">
                        <label>Time Format</label>
                        <select
                          name="TimeFormat"
                          className="form-control form-control-sm"
                          value={formValue?.TimeFormat}
                          onChange={handleFormChange}
                        >
                          <option value="12">12 Hours</option>
                          <option value="24">24 Hours</option>
                        </select>
                      </div>

                      {/* Country */}
                      <div className="col-md-6 col-lg-2">
                        <label>Country</label>
                        <Select
                          name="country"
                          options={countryOptions}
                          onChange={(selectedOption) =>
                            handleSelectChange(selectedOption, "country")
                          }
                          value={countryOptions.find(
                            (option) => option.value === country
                          )}
                          styles={select_customStyles(background)}
                          placeholder="Select"
                          autocomplete="off"
                          className="w-100 m-auto"
                        />
                      </div>
                      {/* State */}
                      <div className="col-md-6 col-lg-2">
                        <label htmlFor="State">State</label>
                        <Select
                          name="stateCity"
                          options={stateOptionsPerCountry}
                          onChange={(selectedOption) =>
                            handleSelectChange(selectedOption, "stateCity")
                          }
                          value={stateOptionsPerCountry.find(
                            (option) => option.value === stateCity
                          )}
                          styles={select_customStyles(background)}
                          placeholder="Select"
                          autoComplete="off"
                          className="w-100 m-auto"
                        />
                      </div>

                      {/* City */}
                      <div className="col-md-6 col-lg-2">
                        <label htmlFor="Designation">City</label>
                        <Select
                          name="city"
                          id=""
                          options={cityOptionPerState}
                          onChange={(selectedOption) =>
                            handleSelectChange(selectedOption, "city")
                          }
                          value={cityOptionPerState?.find(
                            (option) => option.value === city
                          )}
                          styles={select_customStyles(background)}
                          placeholder="Select"
                          autocomplete="off"
                          className="w-100 m-auto"
                        ></Select>
                      </div>

                      {/* Address-1 and Address-2 */}
                      <div className="col-md-6 col-lg-2">
                        <label htmlFor="Address">Address-1</label>
                        <textarea
                          className="form-control form-control-sm"
                          name="ADDRESS1"
                          placeholder="Enter Address"
                          cols="10"
                          value={formValue?.ADDRESS1}
                          onChange={handleFormChange}
                        />
                      </div>

                      <div className="col-md-6 col-lg-2">
                        <label htmlFor=" Address">Address-2</label>
                        <textarea
                          className="form-control form-control-sm"
                          name="ADDRESS2"
                          placeholder="Enter Address"
                          cols="10"
                          value={formValue?.ADDRESS2}
                          onChange={handleFormChange}
                        />
                      </div>

                      <div className="col-md-6 col-lg-4">
                        <label htmlFor="Language">Destination</label>
                        <DestinationInput />
                      </div>

                      <div className="col-md-6 col-lg-2">
                        <label>Status</label>
                        <span className="text-danger">*</span>
                        <select
                          name="ISACTIVE"
                          className="form-control form-control-sm"
                          value={formValue?.ISACTIVE}
                          onChange={handleFormChange}
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                      {validationErrors?.ISACTIVE && (
                        <div
                          className="invalid-feedback animated fadeInUp"
                          style={{ display: "block" }}
                        >
                          {validationErrors?.ISACTIVE}
                        </div>
                      )}
                      <div className="col-12">
                        {GSTarray.map((data, index) => {
                          return (
                            <div className="row" key={index}>
                              <div className="col-md-6 col-lg-2">
                                <label htmlFor="GST">
                                  GST
                                  <span className="text-danger">*</span>
                                </label>
                                <input
                                  type="text"
                                  className={`form-control form-control-sm `}
                                  name="GSTNo"
                                  placeholder="Enter GST"
                                  value={data?.GSTNo}
                                  onChange={(e) => handleGSTChange(index, e)}
                                />
                              </div>
                              <div className="col-md-5 col-lg-2">
                                <label htmlFor="Designation">State</label>
                                <Select
                                  name="state"
                                  classNames="form-control.form-control-sm "
                                  id=""
                                  options={stateOptions}
                                  onChange={(selectedOption) =>
                                    handleSelectStateChange(
                                      selectedOption,
                                      "stateCity",
                                      index
                                    )
                                  }
                                  value={stateOptions?.find(
                                    (option) => option.value === data.StateId
                                  )}
                                  styles={select_customStyles(background)}
                                  placeholder="Select"
                                  autocomplete="off"
                                  className="w-100 m-auto"
                                ></Select>
                              </div>
                              <div className="col-md-1 d-flex align-items-center gap-1">
                                <i
                                  class="fa-solid fa-plus text-secondary fs-xs mt-4 cursor-pointer"
                                  onClick={handleGSTArray}
                                ></i>
                                {index >= 1 && (
                                  <i
                                    className="fa-solid fa-trash-can cursor-pointer text-danger fs-xs mt-4"
                                    onClick={() => handleDeleteGSTArray(index)}
                                  ></i>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="col-md-12 col-lg-12 d-flex align-items-center justify-content-end gap-3">
                        <button
                          className="btn btn-dark btn-custom-size"
                          name="SaveButton"
                          onClick={() => navigate("/company")}
                        >
                          <span className="me-1">Back</span>
                          <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
                        </button>
                        <button
                          type="button"
                          className="btn btn-dark btn-custom-size"
                          onClick={handleResetFormData}
                        >
                          Reset
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary btn-custom-size"
                          onClick={handleSubmit}
                        >
                          {isEditing ? "Update" : "Submit"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCompany;
