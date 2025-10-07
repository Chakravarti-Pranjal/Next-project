import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { axiosOther } from "../../../../http/axios_base_url";
import { notifyHotError, notifyHotSuccess } from "../../../../helper/notify";
import DatePicker from "react-datepicker";
import useMultipleSelect from "../../../../hooks/custom_hooks/useMultipleSelect";
import { format } from "date-fns";
import { AddGuestValidation } from "./Tourextension_validation";
import { useSelector } from "react-redux";

function AddGuest() {
  const [validationErrors, setValidationErrors] = useState({});
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [nationalitylist, setNationalitylist] = useState([]);
  const [holidaypreferencelist, setHolidaypreferencelist] = useState([]);
  const [markettypemasterlist, setMarkettypemasterlist] = useState([]);
  const navigate = useNavigate();
  const { queryData } = useSelector((state) => state?.queryReducer);
  const companyId = JSON.parse(localStorage.getItem("token"))?.companyKey;

  const initialData = {
    ContactType: "Guest List",
    CompanyId: companyId,
    TourId: queryData?.QueryAllData?.TourId || "",
    QueryId: queryData?.QueryAlphaNumId,
    RefrenceNo: queryData?.QueryAllData?.ReferenceId || "",
    AgentName: queryData?.QueryAllData?.ServiceDetail?.ServiceCompanyName || "",
    Nationality: "",
    Title: "",
    FirstName: "",
    MiddleName: "",
    LastName: "",
    Gender: "",
    DOB: "",
    AnniversaryDate: "",
    Country: "",
    State: "",
    City: "",
    Pin_Zip: "",
    Address: "",
    Remark1: "",
    Remark2: "",
    Remark3: "",
    Status: "1",
    MarketType: "",
    HolidayPreference: [],
    EmergencyContactName: "",
    Relation: "",
    EmergencyContactNumber: "",
    AddedBy: 101,
    Contactinfo: {
      email: "",
      phone: "",
      alt_phone: "",
    },
    Documentation: [
      {
        DocumentType: "",
        DocumentRequired: "",
        DocumentNo: "",
        IssueDate: "",
        ExpiryDate: "",
        IssueCountry: "",
        DocumentTitle: "",
        ImageData: "",
      },
      {
        DocumentType: "",
        DocumentRequired: "",
        DocumentNo: "",
        IssueDate: "",
        ExpiryDate: "",
        IssueCountry: "",
        DocumentTitle: "",
        ImageData: "",
      },
    ],
  };

  const [formData, setFormData] = useState({});
  const { state } = useLocation();

  // ============================================================
  useEffect(() => {
    if (state) {
      setFormData({
        ...state,
        id: state?.id,
        Nationality: state?.NationalityId,
        Country: state?.CountryId,
        State: state?.StateId,
        City: state?.CityId,
        Status: state?.Status === "Active" ? "1" : "0",
        Contactinfo: {
          email: state?.Contactinfo?.email,
          phone: state?.Contactinfo?.phone,
          alt_phone: state?.Contactinfo?.alt_phone,
        },
        Documentation:
          state?.Documentation?.length > 0
            ? state.Documentation.map((doc) => ({
              ...doc,
              ImageData: doc?.UploadDocument || "",
            }))
            : [
              {
                DocumentType: "",
                DocumentRequired: "",
                DocumentNo: "",
                IssueDate: "",
                ExpiryDate: "",
                IssueCountry: "",
                DocumentTitle: "",
                ImageData: "",
              },
              {
                DocumentType: "",
                DocumentRequired: "",
                DocumentNo: "",
                IssueDate: "",
                ExpiryDate: "",
                IssueCountry: "",
                DocumentTitle: "",
                ImageData: "",
              },
            ],
      });

      setHoliDayData(
        state?.HolidayPreference?.map((item) =>
          Number(item?.HolidayPreferenceId)
        )
      );
      // setFormData(state);
    } else {
      setFormData(initialData);
      setHoliDayData([]);
    }
  }, [state]);
  // ============================================================
  const TitleOptions = {
    options: ["Mr", "Ms", "Mrs"],
  };

  const GenderOptions = {
    options: ["Male", "Female", "Other"],
  };

  const getFromDate = (Type, index = null) => {
    if (Type === "DOB") {
      return formData?.DOB ? new Date(formData?.DOB) : null;
    } else if (Type === "AnniversaryDate") {
      return formData?.AnniversaryDate
        ? new Date(formData?.AnniversaryDate)
        : null;
    } else if (Type === "IssueDate" && index !== null) {
      return formData?.Documentation?.[index]?.IssueDate
        ? new Date(formData.Documentation[index].IssueDate)
        : null;
    } else if (Type === "ExpiryDate" && index !== null) {
      return formData?.Documentation?.[index]?.ExpiryDate
        ? new Date(formData.Documentation[index].ExpiryDate)
        : null;
    }
    return null;
  };

  // ============================================================

  const handleCalender = (date, Type, index = null) => {
    const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
    if (Type === "DOB") {
      setFormData({
        ...formData,
        DOB: formattedDate,
      });
    } else if (Type === "AnniversaryDate") {
      setFormData({
        ...formData,
        AnniversaryDate: formattedDate,
      });
    } else if (Type === "IssueDate" && index !== null) {
      setFormData((prev) => {
        const updatedDocumentation = [...prev.Documentation];
        updatedDocumentation[index] = {
          ...updatedDocumentation[index],
          IssueDate: formattedDate,
        };
        return { ...prev, Documentation: updatedDocumentation };
      });
    } else if (Type === "ExpiryDate" && index !== null) {
      setFormData((prev) => {
        const updatedDocumentation = [...prev.Documentation];
        updatedDocumentation[index] = {
          ...updatedDocumentation[index],
          ExpiryDate: formattedDate,
        };
        return { ...prev, Documentation: updatedDocumentation };
      });
    }
  };
  // ============================================================

  const getListDataOfCountry = async () => {
    try {
      const { data } = await axiosOther.post("countrylist");

      setCountryList(data?.DataList);
    } catch (error) {
      console.log(error);
    }
  };

  const getListDataOfSatae = async () => {
    try {
      const { data } = await axiosOther.post("listStateByCountry", {
        Status: 1,
        countryid: formData?.Country,
      });
      setStateList(data?.DataList);
    } catch (error) {
      console.log("country-error", error);
    }
  };
  const getListDataOfCity = async () => {
    try {
      const { data } = await axiosOther.post("listCityByStateandCountryName", {
        Status: 1,
        stateid: formData?.State,
        countryid: formData?.Country,
      });

      setCityList(data?.DataList);
    } catch (error) {
      console.log("country-error", error);
    }
  };

  // ============================================================

  const getListDataOfNationality = async () => {
    try {
      const { data } = await axiosOther.post("nationalitylist", {
        Search: "",
        Status: 1,
      });
      setNationalitylist(data.DataList);
    } catch (err) {
      console.log(err);
    }
  };

  // ============================================================

  const getListDataOfHoliday = async () => {
    try {
      const { data } = await axiosOther.post("holidaypreferencelist", {
        id: "",
        Name: "",
      });
      setHolidaypreferencelist(data.DataList);
    } catch (err) {
      console.log(err);
    }
  };

  // ============================================================

  const getListDataOfMarket = async () => {
    try {
      const { data } = await axiosOther.post("markettypemasterlist", {
        id: "",
        Search: "",
        Status: "",
      });
      setMarkettypemasterlist(data.DataList);
    } catch (err) {
      console.log(err);
    }
  };

  // ======================================================

  const holidaypreferencelistOption = holidaypreferencelist?.map((item) => ({
    value: item?.id,
    label: item?.Name,
  }));

  const {
    SelectInput: HolidayPreference,
    selectedData: HolidayData,
    setSelectedData: setHoliDayData,
  } = useMultipleSelect(holidaypreferencelistOption);

  useEffect(() => {
    const selectedIds = HolidayData?.map((item) => String(item));
    setFormData((prev) => ({
      ...prev,
      HolidayPreference: selectedIds,
    }));
  }, [HolidayData]);

  // ======================================================

  useEffect(() => {
    getListDataOfCountry();
    getListDataOfNationality();
    getListDataOfHoliday();
    getListDataOfMarket();
  }, []);

  // ======================================================

  useEffect(() => {
    if (formData?.Country) {
      getListDataOfSatae();
    }
    if (formData?.State) {
      getListDataOfCity();
    }
  }, [formData?.Country, formData?.State]);

  // ======================================================

  const handleInputChange = (e, group = null, index = null) => {
    const { name, value } = e.target;

    if (group === "Contactinfo") {
      setFormData((prev) => ({
        ...prev,
        Contactinfo: {
          ...prev.Contactinfo,
          [name]: value,
        },
      }));
    } else if (group && typeof index === "number") {
      setFormData((prev) => {
        const updatedGroup = [...prev[group]];
        updatedGroup[index] = { ...updatedGroup[index], [name]: value };
        return { ...prev, [group]: updatedGroup };
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          Documentation: prev.Documentation.map((item, i) =>
            i === index ? { ...item, ImageData: event.target.result } : item
          ),
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addDocument = () => {
    setFormData((prev) => ({
      ...prev,
      Documentation: [
        ...prev.Documentation,
        {
          DocumentType: "",
          DocumentRequired: "Yes",
          DocumentNo: "",
          IssueDate: "",
          ExpiryDate: "",
          IssueCountry: "",
          DocumentTitle: "",
          ImageData: "",
        },
      ],
    }));
  };

  // ===================================================

  const handleSave = async () => {
    try {
      await AddGuestValidation.validate(formData, { abortEarly: false });
      setValidationErrors({});

      const { data } = await axiosOther.post("addupdateguestmaster", formData);
      notifyHotSuccess(data?.Message);
      if (data?.Status === 1) {
        navigate("/query/tour-execution");
      }
    } catch (error) {
      notifyHotError(error?.message);
      if (error.inner) {
        const errorMessages = error.inner.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {});
        setValidationErrors(errorMessages);
      }
    }
  };

  // ============================================================

  return (
    <div
      style={{
        padding: "6px",
      }}
    >
      {/* Contact Information Section */}
      <section>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              fontSize: "15px",
              fontWeight: "600",
              color: "#1f2937",
            }}
          >
            Guest Information
          </h2>
        </div>
        <hr />

        <div className="col-12">
          <div className="row form-row-gap">
            {/* Contact Type */}
            <div className="col-md-6 col-lg-3">
              <label className="fs-7" htmlFor="ContactType">
                Contact Type
              </label>
              <select
                name="ContactType"
                id="contactType"
                className="form-control form-control-sm"
                value={formData.ContactType}
                onChange={handleInputChange}
              >
                <option value="" disabled hidden>
                  Select Contact Type
                </option>
                <option value="GuestList">Guest List</option>
                <option value="B2C">B2C</option>
                <option value="Employee">Employee</option>
              </select>
            </div>

            {/* Tour Id */}
            <div className="col-md-6 col-lg-3">
              <label className="fs-7" htmlFor="TourId">
                Tour Id
              </label>
              <input
                type="text"
                name="TourId"
                value={formData.TourId}
                onChange={handleInputChange}
                className="form-control form-control-sm"
                placeholder="Enter Tour ID"
              />
            </div>

            {/* Query Id */}
            <div className="col-md-6 col-lg-3">
              <label className="fs-7" htmlFor="QueryId">
                Query Id
              </label>
              <input
                type="text"
                name="QueryId"
                value={formData.QueryId}
                onChange={handleInputChange}
                className="form-control form-control-sm"
                placeholder="Enter Query ID"
              />
            </div>

            {/* Reference No. */}
            <div className="col-md-6 col-lg-3">
              <label className="fs-7" htmlFor="RefrenceNo">
                Reference No.
              </label>
              <input
                type="text"
                name="RefrenceNo"
                value={formData.RefrenceNo}
                onChange={handleInputChange}
                className="form-control form-control-sm"
                placeholder="Enter Reference No."
              />
            </div>

            {/* Agent Name */}
            <div className="col-md-6 col-lg-3">
              <label className="fs-7" htmlFor="AgentName">
                Agent Name
              </label>
              <input
                type="text"
                name="AgentName"
                value={formData.AgentName}
                onChange={handleInputChange}
                className="form-control form-control-sm"
                placeholder="Enter Agent Name"
              />
            </div>

            {/* Added By Section */}
            <div className="col-md-6 col-lg-3">
              <label className="fs-7" htmlFor="AddedBy">
                Added By
              </label>
              <input
                type="text"
                name="AddedBy"
                value="Admin"
                onChange={handleInputChange}
                className="form-control form-control-sm"
                readOnly
                placeholder="Admin"
              />
            </div>

            {/* Status */}
            <div className="col-md-6 col-lg-3">
              <label className="fs-7" htmlFor="Status">
                Status
              </label>
              <select
                name="Status"
                value={formData.Status}
                onChange={handleInputChange}
                className="form-control form-control-sm"
              >
                <option value="" disabled hidden>
                  Select Status
                </option>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>

            {/* Market Type */}
            <div className="col-md-6 col-lg-3">
              <label className="fs-7" htmlFor="MarketType">
                Market Type
              </label>
              <select
                name="MarketType"
                value={formData.MarketType}
                onChange={handleInputChange}
                className="form-control form-control-sm"
              >
                <option value="" disabled hidden>
                  Select Market Type
                </option>
                {markettypemasterlist?.map((item) => (
                  <option key={item?.id} value={item?.id}>
                    {item?.Name}
                  </option>
                ))}
              </select>
            </div>

            {/* Email */}
            <div className="col-md-6 col-lg-3">
              <label className="fs-7" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData?.Contactinfo?.email}
                onChange={(e) => handleInputChange(e, "Contactinfo")}
                className="form-control form-control-sm"
                placeholder="Enter email address"
              />
            </div>

            {/* Phone */}
            <div className="col-md-6 col-lg-3">
              <label className="fs-7" htmlFor="phone">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData?.Contactinfo?.phone}
                onChange={(e) => handleInputChange(e, "Contactinfo")}
                className="form-control form-control-sm"
                placeholder="Enter phone number"
              />
            </div>

            {/* Alternate Phone */}
            <div className="col-md-6 col-lg-3">
              <label className="fs-7" htmlFor="alt_phone">
                Alternate Phone
              </label>
              <input
                type="tel"
                name="alt_phone"
                value={formData?.Contactinfo?.alt_phone}
                onChange={(e) => handleInputChange(e, "Contactinfo")}
                className="form-control form-control-sm"
                placeholder="Enter alternate phone number"
              />
            </div>

            {/* Emergency Contact Name */}
            <div className="col-md-6 col-lg-3">
              <label className="fs-7" htmlFor="EmergencyContactName">
                Emergency Contact Name
              </label>
              <input
                type="text"
                name="EmergencyContactName"
                value={formData.EmergencyContactName}
                onChange={handleInputChange}
                className="form-control form-control-sm"
                placeholder="Enter emergency contact name"
              />
            </div>

            {/* Relation */}
            <div className="col-md-6 col-lg-3">
              <label className="fs-7" htmlFor="Relation">
                Relation
              </label>
              <input
                type="text"
                name="Relation"
                value={formData.Relation}
                onChange={handleInputChange}
                className="form-control form-control-sm"
                placeholder="Enter relation"
              />
            </div>

            {/* Emergency Contact Number */}
            <div className="col-md-6 col-lg-3">
              <label className="fs-7" htmlFor="EmergencyContactNumber">
                Emergency Contact Number
              </label>
              <input
                type="tel"
                name="EmergencyContactNumber"
                value={formData.EmergencyContactNumber}
                onChange={handleInputChange}
                className="form-control form-control-sm"
                placeholder="Enter emergency contact number"
              />
            </div>

            {/* Title */}
            <div className="col-md-6 col-lg-3">
              <label className="fs-7" htmlFor="Title">
                Title
              </label>
              <select
                name="Title"
                value={formData?.Title}
                onChange={handleInputChange}
                className="form-control form-control-sm"
              >
                <option value="" disabled hidden>
                  Select Title
                </option>
                {TitleOptions.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {validationErrors?.Title && (
                <div
                  id="val-username1-error"
                  className="invalid-feedback animated fadeInUp"
                  style={{ display: "block" }}
                >
                  {validationErrors?.Title}
                </div>
              )}
            </div>

            {/* FirstName */}
            <div className="col-md-6 col-lg-3">
              <label className="fs-7" htmlFor="FirstName">
                First Name
              </label>
              <input
                type="text"
                name="FirstName"
                value={formData?.FirstName}
                onChange={handleInputChange}
                className="form-control form-control-sm"
                placeholder="Enter first name"
              />
              {validationErrors?.FirstName && (
                <div
                  id="val-username1-error"
                  className="invalid-feedback animated fadeInUp"
                  style={{ display: "block" }}
                >
                  {validationErrors?.FirstName}
                </div>
              )}
            </div>

            {/* MiddleName */}
            <div className="col-md-6 col-lg-3">
              <label className="fs-7" htmlFor="MiddleName">
                Middle Name
              </label>
              <input
                type="text"
                name="MiddleName"
                value={formData?.MiddleName}
                onChange={handleInputChange}
                className="form-control form-control-sm"
                placeholder="Enter middle name"
              />
            </div>

            {/* LastName */}
            <div className="col-md-6 col-lg-3">
              <label className="fs-7" htmlFor="LastName">
                Last Name
              </label>
              <input
                type="text"
                name="LastName"
                value={formData?.LastName}
                onChange={handleInputChange}
                className="form-control form-control-sm"
                placeholder="Enter last name"
              />
              {validationErrors?.LastName && (
                <div
                  id="val-username1-error"
                  className="invalid-feedback animated fadeInUp"
                  style={{ display: "block" }}
                >
                  {validationErrors?.LastName}
                </div>
              )}
            </div>

            {/* Gender */}
            <div className="col-md-6 col-lg-3">
              <label className="fs-7" htmlFor="Gender">
                Gender
              </label>
              <select
                name="Gender"
                value={formData?.Gender}
                onChange={handleInputChange}
                className="form-control form-control-sm"
              >
                <option value="" disabled hidden>
                  Select Gender
                </option>
                {GenderOptions.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {validationErrors?.Gender && (
                <div
                  id="val-username1-error"
                  className="invalid-feedback animated fadeInUp"
                  style={{ display: "block" }}
                >
                  {validationErrors?.Gender}
                </div>
              )}
            </div>

            {/* Date of Birth */}
            <div className="col-md-6 col-lg-3">
              <label className="fs-7" htmlFor="DOB">
                Date of Birth
              </label>
              <DatePicker
                className="form-control form-control-sm"
                selected={getFromDate("DOB")}
                name="DOB"
                onChange={(e) => handleCalender(e, "DOB")}
                dateFormat="dd-MM-yyyy"
                isClearable
                todayButton="Today"
                placeholderText="Select date of birth"
              />
              {validationErrors?.DOB && (
                <div
                  id="val-username1-error"
                  className="invalid-feedback animated fadeInUp"
                  style={{ display: "block" }}
                >
                  {validationErrors?.DOB}
                </div>
              )}
            </div>

            {/* Anniversary Date */}
            <div className="col-md-6 col-lg-3">
              <label className="fs-7" htmlFor="AnniversaryDate">
                Anniversary Date
              </label>
              <DatePicker
                className="form-control form-control-sm"
                selected={getFromDate("AnniversaryDate")}
                name="AnniversaryDate"
                onChange={(e) => handleCalender(e, "AnniversaryDate")}
                dateFormat="dd-MM-yyyy"
                isClearable
                todayButton="Today"
                placeholderText="Select anniversary date"
              />
            </div>

            {/* Nationality */}
            <div className="col-md-6 col-lg-3">
              <label className="fs-7" htmlFor="Nationality">
                Nationality
              </label>
              <select
                name="Nationality"
                value={formData?.Nationality}
                onChange={handleInputChange}
                className="form-control form-control-sm"
              >
                <option value="" disabled hidden>
                  Select Nationality
                </option>
                {nationalitylist?.map((option) => (
                  <option key={option?.id} value={option?.id}>
                    {option?.Name}
                  </option>
                ))}
              </select>
              {validationErrors?.Nationality && (
                <div
                  id="val-username1-error"
                  className="invalid-feedback animated fadeInUp"
                  style={{ display: "block" }}
                >
                  {validationErrors?.Nationality}
                </div>
              )}
            </div>

            {/* Holiday Preference */}
            <div className="col-md-6 col-lg-6">
              <label className="fs-7" htmlFor="HolidayPreference">
                Holiday Preference
              </label>
              <HolidayPreference />
            </div>
          </div>
        </div>
      </section>

      {/* Address Information Section */}
      <section>
        <div className="col-12">
          <div className="row form-row-gap">
            {/* Country */}
            <div className="col-md-6 col-lg-3">
              <label className="fs-7" htmlFor="Country">
                Country
              </label>
              <select
                name="Country"
                value={formData?.Country}
                onChange={handleInputChange}
                className="form-control form-control-sm"
              >
                <option value="" disabled hidden>
                  Select Country
                </option>
                {countryList?.map((item) => (
                  <option key={item?.id} value={item?.id}>
                    {item?.Name}
                  </option>
                ))}
              </select>
            </div>

            {/* State */}
            <div className="col-md-6 col-lg-3">
              <label className="fs-7" htmlFor="State">
                State
              </label>
              <select
                name="State"
                value={formData?.State}
                onChange={handleInputChange}
                className="form-control form-control-sm"
              >
                <option value="" disabled hidden>
                  Select State
                </option>
                {stateList?.map((item) => (
                  <option key={item?.id} value={item?.id}>
                    {item?.Name}
                  </option>
                ))}
              </select>
            </div>

            {/* City */}
            <div className="col-md-6 col-lg-3">
              <label className="fs-7" htmlFor="City">
                City
              </label>
              <select
                name="City"
                value={formData?.City}
                onChange={handleInputChange}
                className="form-control form-control-sm"
              >
                <option value="" disabled hidden>
                  Select City
                </option>
                {cityList?.map((item) => (
                  <option key={item?.id} value={item?.id}>
                    {item?.Name}
                  </option>
                ))}
              </select>
            </div>

            {/* Pin Code */}
            <div className="col-md-6 col-lg-3">
              <label className="fs-7" htmlFor="Pin_Zip">
                Pin Code
              </label>
              <input
                name="Pin_Zip"
                value={formData?.Pin_Zip}
                onChange={handleInputChange}
                className="form-control form-control-sm"
                placeholder="Enter pin code"
              />
            </div>

            {/* Address */}
            <div className="col-md-6 col-lg-12">
              <label className="fs-7" htmlFor="Address">
                Address
              </label>
              <textarea
                name="Address"
                value={formData?.Address}
                onChange={handleInputChange}
                rows={4}
                className="form-control form-control-sm"
                placeholder="Enter full address"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Documentation Section */}
      <section>
        <div
          style={{ padding: "18px 0", display: "flex", justifyContent: "end" }}
        >
          <button
            onClick={addDocument}
            className="btn btn-primary btn-custom-size"
          >
            + Add More Document
          </button>
        </div>

        {formData?.Documentation?.map((doc, index) => (
          <div
            key={index}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
              marginBottom: "15px",
              padding: "15px",
              border: "1px solid #504e4e",
              borderRadius: "6px",
            }}
          >
            {/* Document Type */}
            <div>
              <label className="fs-7" htmlFor="DocumentType">
                Document Type
              </label>
              <select
                name="DocumentType"
                value={doc?.DocumentType}
                onChange={(e) => handleInputChange(e, "Documentation", index)}
                className="form-control form-control-sm"
              >
                <option value="" disabled hidden>
                  Select Document Type
                </option>
                <option value="Passport">Passport</option>
                <option value="Visa">Visa</option>
                <option value="ID Card">ID Card</option>
              </select>
            </div>

            {/* Document Required */}
            <div>
              <label className="fs-7" htmlFor="DocumentRequired">
                Required
              </label>
              <select
                name="DocumentRequired"
                value={doc?.DocumentRequired}
                onChange={(e) => handleInputChange(e, "Documentation", index)}
                className="form-control form-control-sm"
              >
                <option value="" disabled hidden>
                  Select Requirement
                </option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            {/* Document No */}
            <div>
              <label className="fs-7" htmlFor="DocumentNo">
                Document No.
              </label>
              <input
                type="text"
                name="DocumentNo"
                value={doc?.DocumentNo}
                onChange={(e) => handleInputChange(e, "Documentation", index)}
                className="form-control form-control-sm"
                placeholder="Enter document number"
              />
            </div>

            {/* Issue Date */}
            <div>
              <label className="fs-7" htmlFor="IssueDate">
                Issue Date
              </label>
              <DatePicker
                className="form-control form-control-sm"
                selected={getFromDate("IssueDate", index)}
                name="IssueDate"
                onChange={(date) => handleCalender(date, "IssueDate", index)}
                dateFormat="dd-MM-yyyy"
                isClearable
                todayButton="Today"
                placeholderText="Select issue date"
              />
            </div>

            {/* Expiry Date */}
            <div>
              <label className="fs-7" htmlFor="ExpiryDate">
                Expiry Date
              </label>
              <DatePicker
                className="form-control form-control-sm"
                selected={getFromDate("ExpiryDate", index)}
                name="ExpiryDate"
                onChange={(date) => handleCalender(date, "ExpiryDate", index)}
                dateFormat="dd-MM-yyyy"
                isClearable
                todayButton="Today"
                placeholderText="Select expiry date"
              />
            </div>

            {/* Issue Country */}
            <div>
              <label className="fs-7" htmlFor="IssueCountry">
                Issue Country
              </label>
              <input
                type="text"
                name="IssueCountry"
                value={doc.IssueCountry}
                onChange={(e) => handleInputChange(e, "Documentation", index)}
                className="form-control form-control-sm"
                placeholder="Enter issue country"
              />
            </div>

            {/* Document Title */}
            <div>
              <label className="fs-7" htmlFor="DocumentTitle">
                Document Title
              </label>
              <input
                type="text"
                name="DocumentTitle"
                value={doc.DocumentTitle}
                onChange={(e) => handleInputChange(e, "Documentation", index)}
                className="form-control form-control-sm"
                placeholder="Enter document title"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="fs-7" htmlFor="file">
                Upload Document
              </label>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, index)}
                className="form-control form-control-sm"
                placeholder="Choose file"
              />
              {doc.UploadDocument && (
                <a className="fs-6" href={doc.UploadDocument} target="_blank" rel="noreferrer">
                  View Uploaded Document
                </a>
                )}
            </div>
          </div>
        ))}
      </section>

      {/* Remarks Section */}
      <section>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          {/* Remark 1 */}
          <div>
            <label className="fs-7" htmlFor="Remark1">
              Remark 1
            </label>
            <textarea
              name="Remark1"
              value={formData.Remark1}
              onChange={handleInputChange}
              rows={4}
              className="form-control form-control-sm"
              placeholder="Enter remark 1"
            />
          </div>

          {/* Remark 2 */}
          <div>
            <label className="fs-7" htmlFor="Remark2">
              Remark 2
            </label>
            <textarea
              name="Remark2"
              value={formData.Remark2}
              onChange={handleInputChange}
              rows={4}
              className="form-control form-control-sm"
              placeholder="Enter remark 2"
            />
          </div>

          {/* Remark 3 */}
          <div>
            <label className="fs-7" htmlFor="Remark3">
              Remark 3
            </label>
            <textarea
              name="Remark3"
              value={formData.Remark3}
              onChange={handleInputChange}
              rows={4}
              className="form-control form-control-sm"
              placeholder="Enter remark 3"
            />
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "15px",
          marginTop: "20px",
        }}
      >
        <Link to="/query/tour-execution">
          <button className="btn btn-dark btn-custom-size text-end">
            <span className="me-1">Back</span>
          </button>
        </Link>

        <button
          onClick={handleSave}
          className="btn btn-primary btn-custom-size"
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default AddGuest;
