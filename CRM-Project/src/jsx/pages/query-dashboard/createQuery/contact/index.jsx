import React, { useState, useEffect, useContext, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosOther } from "../../../../../http/axios_base_url";
import "react-international-phone/style.css";
import { addQueryContext } from "..";
import { ThemeContext } from "../../../../../context/ThemeContext";
import { useSelector } from "react-redux";
import Modal from "react-bootstrap/Modal";
import useMultipleSelect from "../../../../../hooks/custom_hooks/useMultipleSelect";

const Contact = ({ validationErorrs, queryType }) => {
  const context = useContext(addQueryContext);

  const { background } = useContext(ThemeContext);
  const { formValue, setFormValue } = context?.queryObjects;
  const { agentData, setAgentData } = context?.contactData;
  const [countryList, setCountryList] = useState([]);
  const [nationalitylist, setNationalitylist] = useState([]);
  const [companytypemasterlist, setCompanytypemasterlist] = useState([]);
  const [markettypemasterlist, setMarkettypemasterlist] = useState([]);
  const [tourlist, setTourlist] = useState([]);
  const [Saleslist, setSaleslist] = useState([]);
  const { isUpdating } = context;
  const error = validationErorrs;
  const { dropdownState } = context?.dropdownObject;
  const [agentList, setAgentList] = useState([]);
  const [pereferenceList, setPereferenceList] = useState([]);
  const [showAddAgentModal, setShowAddAgentModal] = useState(false);
  const [showAgentPopup, setShowAgentPopup] = useState(false);
  const { agentSearch, setAgentSearch } = context?.searchAgent;
  const popupRef = useRef();
  const [typeName, setTypeName] = useState("");
  const { state } = useLocation();
  const navigate = useNavigate();
  const heightAutoAdjust = queryType;
  const [currencyList, setCurrencyList] = useState([]);
  const [form, setForm] = useState({
    businessType: formValue?.ServiceDetail?.BusinessTypeId,
    companyType: "",
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    contactType: "",
    contactPerson: "",
    designation: "",
    contactPhone: "",
    contactEmail: "",
    marketType: "General",
    nationality: "",
    country: "",
    category: "",
    tourType: "",
    salesPerson: "",
    operationPerson: "",
  });
  const perefernce = useSelector(
    (state) => state?.MessageReducer?.perefernceValue
  );

  const intialTourId = state?.TourTypeId;
  const tourOption = tourlist?.map((tour) => {
    return {
      value: tour?.id,
      label: tour?.Name,
    };
  });
  // console.log(state, "state");

  const {
    SelectInput: TourInput,
    selectedData: tourSelected,
    setSelectedData: setTourSelected,
  } = useMultipleSelect(tourOption, intialTourId);

  const filteringAgent = agentList?.filter((agent) => {
    if (formValue?.ServiceDetail?.BusinessTypeId == 14) {
      return agentSearch != ""
        ? agent?.CompanyName?.toLowerCase()?.includes(
          agentSearch?.toLowerCase()
        )
        : agent;
    } else {
      return agentSearch != ""
        ? `${agent?.FirstName} ${agent?.LastName}`
          ?.toLowerCase()
          ?.includes(agentSearch?.toLowerCase())
        : agent;
    }
  });

  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setShowAgentPopup(false);
    }
  };

  useEffect(() => {
    if (showAgentPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAgentPopup]);

  useEffect(() => {
    setAgentList([]);

    if (!isUpdating) {
      setAgentSearch("");
      setAgentData({
        Agent: "",
      });
    }

    const gettingDataForDropdown = async () => {
      const businessId = formValue?.ServiceDetail?.BusinessTypeId;
      // console.log();

      try {
        const { data } = await axiosOther.post(
          Number(businessId) === 14 ? "agentlist" : "directClientlist",
          {
            id: "",
            BussinessType: formValue?.ServiceDetail?.BusinessTypeId,
          }
        );
        setAgentList(data?.DataList);
      } catch (err) {
        console.log(err);
      }
      try {
        const { data } = await axiosOther.post("currencymasterlist");
        setCurrencyList(data?.DataList);
      } catch (err) {
        console.log(err);
      }
    };
    gettingDataForDropdown();
  }, [formValue?.ServiceDetail?.BusinessTypeId]);

  // console.log(agentSearch, "AgentSearch452");

  // New useEffect to handle API call when agentSearch.length >= 3
  useEffect(() => {
    if (agentSearch?.length >= 3) {
      const searchAgents = async () => {
        const businessId = formValue?.ServiceDetail?.BusinessTypeId;
        try {
          const { data } = await axiosOther.post(
            Number(businessId) === 14 ? "agentlist" : "directClientlist",
            {
              id: "",
              BussinessType: formValue?.ServiceDetail?.BusinessTypeId,
              CompanyName: agentSearch,
            }
          );
          setAgentList(data?.DataList);
        } catch (err) {
          console.log(err);
          setAgentList([]);
        }
      };
      searchAgents();
    }
  }, [agentSearch, formValue?.ServiceDetail?.BusinessTypeId]);

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
    if (pereferenceList) {
      setFormValue({
        ...formValue,
        ServiceDetail: {
          ...formValue?.ServiceDetail,
          BusinessTypeId: pereferenceList?.Preferences?.BusinessTypeId,
        },
      });
    }
  }, [pereferenceList]);

  useEffect(() => {
    // update currency filed based on agent nationality
    if (state?.CurrencyId) return;
    if (!currencyList || currencyList.length === 0 || !agentData) return;

    const currencyMap = {
      Indian: "INR",
      Foreign: "USD",
      BIMSTEC: "INR",
    };

    const currencyCode =
      currencyMap[agentData?.Agent?.NationalityName] || "USD";

    const selectedCurrency = currencyList.find(
      (c) => c.CurrencyName.toUpperCase() === currencyCode
    );

    if (selectedCurrency) {
      setFormValue((prev) => ({
        ...prev,
        CurrencyId: selectedCurrency.id,
        ConversionRate: selectedCurrency.ConversionRate || "",
      }));
    }
  }, [currencyList, agentData, state]);

  const handleSetDataToAgent = (agent, contact) => {
    if (formValue?.ServiceDetail?.BusinessTypeId == 14) {
      setAgentData({ Agent: agent, Contact: contact[0] });
      setAgentSearch(agent?.CompanyName);
      setFormValue({
        ...formValue,
        ClientName: "",
        BussinessTypeId: agent?.BussinessTypeId,
        BussinessTypeName: agent?.BussinessTypeName,
        ISOId: agent?.ISOId,
        ISOName: agent?.ISOName,
        ServiceDetail: {
          ...formValue?.ServiceDetail,
          ServiceId: agent?.id,
        },
        ContactInfo: {
          ContactId: agent?.id,
        },
      });
    } else {
      setAgentData({ Agent: agent, Contact: contact });
      setAgentSearch(`${agent?.FirstName} ${agent?.LastName}`);
      const businessType = dropdownState.businessType.find(
        (b) => b?.id == formValue?.ServiceDetail?.BusinessTypeId
      );

      setFormValue({
        ...formValue,
        BussinessTypeId: formValue?.ServiceDetail?.BusinessTypeId,
        BusinessTypeName: businessType?.Name,
        ClientName: `${agent?.FirstName} ${agent?.LastName}`,
        ServiceDetail: { ...formValue?.ServiceDetail, ServiceId: agent?.id },
        ContactInfo: {
          ContactId: agent?.id,
        },
      });
    }
  };
  console.log();

  const handleChanges = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Reset form
    setForm({
      businessType: "",
      companyType: "",
      companyName: "",
      companyEmail: "",
      companyPhone: "",
      contactType: "",
      contactPerson: "",
      designation: "",
      contactPhone: "",
      contactEmail: "",
      marketType: "General",
      nationality: "",
      country: "",
      category: "",
      salesPerson: "",
      operationPerson: "",
    });

    // Reset tour selection
    setTourSelected([]);

    // Close modal
    setShowAddAgentModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("BusinessTypeId")) {
      const filtered = dropdownState.businessType?.find(
        (item) => item?.id == value
      );
      const finalName = filtered != undefined ? filtered?.Name : undefined;
      setTypeName(finalName);
    }
    if (name === "CurrencyId") {
      const selectedCurrency = currencyList.find(
        (c) => c.id === parseInt(value)
      );
      setFormValue((prev) => ({
        ...prev,
        CurrencyId: value,
        ConversionRate: selectedCurrency?.ConversionRate || "",
      }));
    }

    if (name in formValue) {
      setFormValue((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else {
      const keys = name.split(".");
      const newFormData = { ...formValue };
      let current = newFormData;

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

  const handleAgentChange = (e) => {
    const value = e.target.value;
    setAgentSearch(e.target.value);

    if (!value) {
      const businessId = formValue?.ServiceDetail?.BusinessTypeId;
      axiosOther
        .post(Number(businessId) === 14 ? "agentlist" : "directClientlist", {
          id: "",
          BussinessType: businessId,
        })
        .then(({ data }) => setAgentList(data?.DataList))
        .catch(() => setAgentList([]));
    }
  };

  const getdata = async () => {
    try {
      const countryData = await axiosOther.post("countrylist", {
        Search: "",
        Status: 1,
      });
      setCountryList(countryData.data.DataList);
    } catch (err) {
      console.log(err);
    }
    try {
      const Data = await axiosOther.post("nationalitylist", {
        Search: "",
        Status: 1,
      });
      setNationalitylist(Data.data.DataList);
    } catch (err) {
      console.log(err);
    }
    try {
      const Data = await axiosOther.post("companytypemasterlist", {
        Search: "",
        Status: 1,
      });
      setCompanytypemasterlist(Data.data.DataList);
    } catch (err) {
      console.log(err);
    }
    try {
      const Data = await axiosOther.post("markettypemasterlist", {
        Search: "",
        Status: 1,
      });
      setMarkettypemasterlist(Data.data.DataList);
    } catch (err) {
      console.log(err);
    }
    try {
      const salaperson = await axiosOther.post("fetch-sales-person", {
        Name: "Pre Sales",
      });
      setSaleslist(salaperson?.data.SalesPersons);
    } catch (error) {
      console.log(error);
    }
    try {
      const Data = await axiosOther.post("tourlist", {
        Search: "",
        Status: 1,
      });
      setTourlist(Data.data.DataList);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getdata();
  }, []);

  return (
    <>
      <Modal
        show={showAddAgentModal}
        className="addNewAgent"
        onHide={() => setShowAddAgentModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New {typeName || "Agent"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit} className="container ">
            <div className="row g-3">
              <div className="col-md-12 col-lg-4">
                <label className="m-0 pb-1 p-0" style={{ fontSize: "10px" }}>
                  Bussiness Type
                </label>
                <span className="text-danger" style={{ fontSize: "9px" }}>
                  *
                </span>
                <select
                  name="ServiceDetail.BusinessTypeId"
                  id=""
                  className="form-control form-control-sm"
                  value={formValue?.ServiceDetail?.BusinessTypeId}
                  // onChange={handleChanges}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  {dropdownState.businessType.map((value, index) => {
                    return (
                      <option value={value.id} key={index}>
                        {value.Name}
                      </option>
                    );
                  })}
                </select>
                {error?.BusinessTypeId && (
                  <div
                    id="val-username1-error"
                    className="invalid-feedback animated fadeInUp"
                    style={{ display: "block", fontSize: "0.8rem" }}
                  >
                    {error?.BusinessTypeId}
                  </div>
                )}
              </div>

              <div className="col-md-4">
                <label className="m-0 pb-1 p-0">Company Type</label>
                <select
                  name="companyType"
                  value={form.companyType}
                  onChange={handleChanges}
                  className="form-control form-control-sm"
                >
                  <option value="">Select</option>
                  {companytypemasterlist &&
                    companytypemasterlist?.length > 0 &&
                    companytypemasterlist.map((data, index) => (
                      <option value={data?.id}>{data?.Name}</option>
                    ))}
                </select>
              </div>

              <div className="col-md-4">
                <label className="m-0 pb-1 p-0">Company Name</label>
                <input
                  name="companyName"
                  value={form.companyName}
                  onChange={handleChanges}
                  className="form-control form-control-sm"
                />
              </div>

              <div className="col-md-6">
                <label className="m-0 pb-1 p-0">Company Email</label>
                <input
                  type="email"
                  name="companyEmail"
                  value={form.companyEmail}
                  onChange={handleChanges}
                  className="form-control form-control-sm"
                />
              </div>

              <div className="col-md-6">
                <label className="m-0 pb-1 p-0">Company Phone</label>
                <input
                  type="number"
                  name="companyPhone"
                  value={form.companyPhone}
                  onChange={handleChanges}
                  className="form-control form-control-sm"
                />
              </div>

              <div className="col-md-2">
                <label className="m-0 pb-1 p-0">Contact Person Type</label>
                <select
                  name="contactType"
                  value={form.contactType}
                  onChange={handleChanges}
                  className="form-control form-control-sm"
                >
                  <option>Select</option>
                  <option>Accounts</option>
                  <option>Finance</option>
                  <option>Fit Reservation</option>
                  <option>Git Reservation</option>
                  <option>Oliver1</option>
                  <option>Operations</option>
                  <option>Sales</option>
                </select>
              </div>
              <div className="col-md-2">
                <label className="m-0 pb-1 p-0">Contact Person</label>
                <input
                  name="contactPerson"
                  value={form.contactPerson}
                  onChange={handleChanges}
                  className="form-control form-control-sm"
                />
              </div>

              <div className="col-md-2">
                <label className="m-0 pb-1 p-0">Designation</label>
                <input
                  name="designation"
                  value={form.designation}
                  onChange={handleChanges}
                  className="form-control form-control-sm"
                />
              </div>

              <div className="col-md-3">
                <label className="m-0 pb-1 p-0">Phone</label>
                <div className="input-group">
                  <span
                    className="input-group-text"
                    style={{ height: "25.8px" }}
                  >
                    +91
                  </span>
                  <input
                    type="number"
                    name="contactPhone"
                    value={form.contactPhone}
                    onChange={handleChanges}
                    className="form-control form-control-sm"
                  />
                </div>
              </div>

              <div className="col-md-3">
                <label className="m-0 pb-1 p-0">Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={form.contactEmail}
                  onChange={handleChanges}
                  className="form-control form-control-sm"
                />
              </div>

              <div className="col-md-4">
                <label className="m-0 pb-1 p-0">Market Type</label>
                <select
                  name="marketType"
                  value={form.marketType}
                  onChange={handleChanges}
                  className="form-control form-control-sm"
                >
                  <option>General</option>
                  {markettypemasterlist?.length > 0 &&
                    markettypemasterlist.map((value, index) => {
                      return (
                        <option value={value.id} key={index + 1}>
                          {value.Name}
                        </option>
                      );
                    })}
                </select>
              </div>

              <div className="col-md-4">
                <label className="m-0 pb-1 p-0">Nationality</label>
                <select
                  name="nationality"
                  value={form.nationality}
                  onChange={handleChanges}
                  className="form-control form-control-sm"
                >
                  <option value="">Select</option>
                  {nationalitylist?.length > 0 &&
                    nationalitylist.map((value, index) => {
                      return (
                        <option value={value.id} key={index + 1}>
                          {value.Name}
                        </option>
                      );
                    })}
                </select>
              </div>

              <div className="col-md-4">
                <label className="m-0 pb-1 p-0">Country</label>
                <select
                  name="country"
                  value={form.country}
                  onChange={handleChanges}
                  className="form-control form-control-sm"
                >
                  <option value="">Select</option>
                  {countryList.map((country, ind) => {
                    return (
                      <option value={country.id} key={ind + 1}>
                        {" "}
                        {country.Name}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="col-md-6">
                <label className="m-0 pb-1 p-0">Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChanges}
                  className="form-control form-control-sm"
                >
                  <option value="">Select</option>
                  <option value="big">Big</option>
                  <option value="medium">Medium</option>
                  <option value="small">Small</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="m-0 pb-1 p-0">Tour Type</label>
                <TourInput />
              </div>

              <div className="col-md-6">
                <label className="m-0 pb-1 p-0">Sales Person</label>
                <select
                  name="salesPerson"
                  value={form.salesPerson}
                  onChange={handleChanges}
                  className="form-control form-control-sm"
                >
                  <option value="">Select</option>
                  {Saleslist?.map((sales, index) => {
                    return (
                      <option value={sales.Id} key={index + 1}>
                        {sales.Name}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="col-md-6">
                <label className="m-0 pb-1 p-0">Operation Person</label>
                <select
                  name="operationPerson"
                  value={form.operationPerson}
                  onChange={handleChanges}
                  className="form-control form-control-sm"
                >
                  <option value="">Select</option>
                  <option value="Rizwan">Rizwan</option>
                </select>
              </div>

              <div className="col-12 d-flex justify-content-end gap-2 mt-3">
                <button
                  type="button"
                  className="btn btn-dark btn-custom-size"
                  onClick={() => setShowAddAgentModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-custom-size"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* Rest of your existing component code remains exactly the same */}
      <div className="row">
        <div className="col-lg-12 ">
          <div
            className="card query-box-height-main"
            style={{ minHeight: !heightAutoAdjust.includes(1) && "15rem" }}
          >
            <div className="card-header px-2 py-2">
              <h4 className="card-title query-title">Contact Information</h4>
            </div>
            <div className="card-body px-2 py-2">
              <div className="form-validation">
                <form
                  className="form-valide"
                  action="#"
                  method="post"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div className="row form-row-gap flex-wrap">
                    <div className="col-md-12 col-lg-4">
                      <label
                        className="m-0 pb-1 p-0"
                        style={{ fontSize: "10px" }}
                      >
                        Bussiness Type
                      </label>
                      <span className="text-danger" style={{ fontSize: "9px" }}>
                        *
                      </span>
                      <select
                        // name="ServiceDetail.BusinessTypeId"
                        name="ServiceDetail.BusinessTypeId"
                        id=""
                        className="form-control form-control-sm"
                        value={formValue?.ServiceDetail?.BusinessTypeId}
                        onChange={handleChange}
                      >
                        <option value="">Select</option>
                        {dropdownState.businessType.map((value, index) => {
                          return (
                            <option value={value.id} key={index}>
                              {value.Name}
                            </option>
                          );
                        })}
                      </select>
                      {error?.BusinessTypeId && (
                        <div
                          id="val-username1-error"
                          className="invalid-feedback animated fadeInUp"
                          style={{ display: "block", fontSize: "0.8rem" }}
                        >
                          {error?.BusinessTypeId}
                        </div>
                      )}
                    </div>
                    <div className="col-md-12 col-lg-8">
                      <label className="m-0 pb-1" style={{ fontSize: "10px" }}>
                        {typeName != "" ? typeName : "Agent"} Name
                      </label>
                      <span className="text-danger" style={{ fontSize: "9px" }}>
                        *
                      </span>
                      <div className="d-flex justify-content-between align-items-center gap-1">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="val-username"
                          name="agentSearch"
                          placeholder={`Enter ${typeName} Name`}
                          value={agentSearch}
                          onChange={handleAgentChange}
                          onClick={() => setShowAgentPopup(true)}
                        />

                        <button
                          className="btn btn-primary py-1 px-2 d-flex justify-content-center align-items-center"
                          style={{ borderRadius: "5px", height: "1.8rem" }}
                          onClick={() => setShowAddAgentModal(true)}
                        >
                          <i
                            class="fa-solid fa-plus"
                            style={{ fontSize: "10px" }}
                          ></i>
                        </button>
                      </div>
                      {error?.ServiceId && (
                        <div
                          id="val-username1-error"
                          className="invalid-feedback animated fadeInUp"
                          style={{ display: "block", fontSize: "0.8rem" }}
                        >
                          {error?.ServiceId}
                        </div>
                      )}
                    </div>
                  </div>
                </form>
                {agentData.Agent != "" && (
                  <div className="col-12 mt-3">
                    <div className="border d-flex justify-content-between p-1 flex-wrap gap-2">
                      <div className="d-flex justify-content-between align-items-center gap-1">
                        <i className="fa-solid fa-user font-size-12"></i>
                        <p className="m-0 pl-1 font-size-12">
                          {formValue?.ServiceDetail?.BusinessTypeId == 14
                            ? agentData?.Agent?.CompanyName
                            : agentData?.Agent?.FirstName +
                            agentData?.Agent?.LastName}
                        </p>
                      </div>
                      <div className="d-flex justify-content-between align-items-center gap-1">
                        <i className="fa-solid fa-phone-volume font-size-12"></i>
                        <p className="m-0 pl-1 font-size-12">
                          {formValue?.ServiceDetail?.BusinessTypeId == 14
                            ? agentData?.Agent?.CompanyPhoneNumber
                            : agentData?.Contact?.Mobile}
                        </p>
                      </div>
                      <div className="d-flex justify-content-between align-items-center gap-1">
                        <i className="fa-solid fa-envelope font-size-12"></i>
                        <p className="m-0 pl-1 font-size-12">
                          {formValue?.ServiceDetail?.BusinessTypeId == 14
                            ? agentData?.Agent?.CompanyEmailAddress
                            : agentData?.Contact?.Email}
                        </p>
                      </div>
                      <div className="d-flex justify-content-between align-items-center gap-1">
                        <label htmlFor="market" className="m-0 font-size-12">
                          Market Type :
                        </label>
                        <p className="m-0 pl-1 font-size-12 gap-1">
                          {formValue?.ServiceDetail?.BusinessTypeId == 14
                            ? agentData?.Agent?.MarketTypeName
                            : agentData?.Agent?.MarketType?.Name}
                        </p>
                      </div>
                      <div className="d-flex justify-content-between align-items-center gap-1">
                        <label htmlFor="market" className="m-0 font-size-12">
                          Nationalty :
                        </label>
                        <p className="m-0 pl-1 font-size-12">
                          {formValue?.ServiceDetail?.BusinessTypeId == 14
                            ? agentData?.Agent?.NationalityName
                            : agentData?.Agent?.Nationality?.Name}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {agentData.Agent == "" && (
                  <div className="col-12 mt-3">
                    <div className="border d-flex justify-content-between p-1 flex-wrap gap-2">
                      <div className="d-flex justify-content-between align-items-center  gap-1">
                        <i className="fa-solid fa-user font-size-12"></i>
                        <p className="m-0 pl-1 font-size-12">xxxx</p>
                      </div>
                      <div className="d-flex justify-content-between align-items-center  gap-1">
                        <i className="fa-solid fa-phone-volume font-size-12"></i>
                        <p className="m-0 pl-1 font-size-12">990XXXXXX</p>
                      </div>
                      <div className="d-flex justify-content-between align-items-center  gap-1">
                        <i className="fa-solid fa-envelope font-size-12"></i>
                        <p className="m-0 pl-1 font-size-12">
                          example@gmail.com
                        </p>
                      </div>
                      <div className="d-flex justify-content-between align-items-center gap-1">
                        <label htmlFor="market" className="m-0 font-size-12">
                          Market Type :
                        </label>
                        <p className="m-0 pl-1 font-size-12">General</p>
                      </div>
                      <div className="d-flex justify-content-between align-items-center  gap-1">
                        <label htmlFor="market" className="m-0 font-size-12">
                          Nationalty :
                        </label>
                        <p className="m-0 pl-1 font-size-12">Foreign</p>
                      </div>
                    </div>
                  </div>
                )}
                {formValue?.ServiceDetail?.BusinessTypeId != "" &&
                  showAgentPopup && (
                    <div
                      className="custom-search-query-dropdown"
                      ref={popupRef}
                    >
                      <div className="row w-100 align-items-center gap-1 m-0 px-1">
                        {filteringAgent?.map((agent, ind) => {
                          const b2cContct = agent?.Contactinfo?.find(
                            (item) =>
                              item?.EmailType == "Office" ||
                              item?.EmailType == "Home"
                          );

                          return (
                            <div
                              className="col-12 d-flex flex-column py-1 hover-bg p-0"
                              key={ind + 1}
                            >
                              <div
                                className="ps-2 cursor-pointer "
                                onClick={() => {
                                  handleSetDataToAgent(
                                    agent,
                                    formValue?.ServiceDetail?.BusinessTypeId ==
                                      14
                                      ? agent?.ContactList[0]?.ContactDetail
                                      : agent?.Contactinfo[0]
                                  ),
                                    setShowAgentPopup(!showAgentPopup);
                                }}
                              >
                                <p
                                  className="m-0 p-0 "
                                  style={{
                                    color:
                                      background?.value == "dark" && "#96a0af",
                                  }}
                                >
                                  {formValue?.ServiceDetail?.BusinessTypeId ==
                                    14
                                    ? agent?.CompanyName?.charAt(
                                      0
                                    ).toUpperCase() +
                                    agent?.CompanyName?.slice(1).toLowerCase()
                                    : `${agent?.FirstName} ${agent?.LastName}`}
                                </p>
                                {formValue?.ServiceDetail?.BusinessTypeId == 14 && (
                                  <p
                                    className="m-0 p-0 "
                                    style={{
                                      color:
                                        background?.value == "dark"
                                          ? "#96a0af"
                                          : "grey",
                                      fontSize: "10px",
                                    }}
                                  >
                                    {/* {console.log(formValue?.ServiceDetail?.BusinessTypeId,"formValue999")} */}

                                    {formValue?.ServiceDetail?.BusinessTypeId ==
                                      14
                                      ? agent?.CompanyEmailAddress
                                      : b2cContct?.Email}
                                    <span
                                      style={{
                                        color:
                                          background?.value == "dark" &&
                                          "#96a0af",
                                      }}
                                      className="font-size10 mx-1"
                                    >
                                      ,
                                      {formValue?.ServiceDetail?.BusinessTypeId ==
                                        14
                                        ? agent?.CompanyPhoneNumber
                                        : b2cContct?.Mobile}
                                      ,
                                      {formValue?.ServiceDetail?.BusinessTypeId ==
                                        14
                                        ? agent?.CountryName
                                        : b2cContct?.Country?.Name}
                                    </span>
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                        <div className="col-12 d-flex justify-content-center">
                          {agentList == "" && (
                            <h6 className="text-secondary">Loading Data..</h6>
                          )}
                          {filteringAgent?.length == 0 && agentList != "" && (
                            <h6 className="text-secondary">Record not found</h6>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
              </div>
              <div className="row">
                <div className="col-md-6 col-lg-5">
                  <label className="m-0 pb-1" style={{ fontSize: "10px" }}>
                    Client Name
                  </label>
                  <div className="d-flex justify-content-between align-items-center gap-1">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="val-username"
                      name="ClientName"
                      placeholder="Client Name"
                      value={formValue?.ClientName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-6 col-lg-7">
                  <div className="row">
                    <div className="col-md-6 col-lg-7">
                      <label
                        className="m-0 pb-1 p-0"
                        style={{ fontSize: "10px" }}
                      >
                        Currency
                      </label>
                      <select
                        name="CurrencyId"
                        id=""
                        className="form-control form-control-sm"
                        onChange={handleChange}
                        value={formValue?.CurrencyId}
                      >
                        <option value="">Select</option>
                        {currencyList?.map((currency, index) => {
                          return (
                            <option value={currency?.id} key={index + 1}>
                              {currency?.CurrencyName}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div className="col-1 d-flex align-items-center justify-content-center">
                      <span className="mt-4">@</span>
                    </div>
                    <div className="col-md-4 col-lg-4">
                      <label className="m-0 pb-1" style={{ fontSize: "10px" }}>
                        Value
                      </label>
                      <div className="d-flex justify-content-between align-items-center gap-1">
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          id="val-username"
                          name="ConversionRate"
                          placeholder="Value"
                          value={formValue?.ConversionRate}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
