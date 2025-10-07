import React, { useContext, useEffect, useState } from "react";
import { addQueryContext } from ".";
import { ToastContainer, Modal, Row, Col, Button } from "react-bootstrap";
import { axiosOther } from "../../../../http/axios_base_url";
import { Link } from "react-router-dom";
import Select from "react-select";
import { addPereferenceInitialValue } from "../query_intial_value";
import { select_customStyles } from "../../../../css/custom_style";
import { ThemeContext } from "../../../../context/ThemeContext";
import { toast } from "react-toastify";
import { updatePreferenceValidation } from "../query_validation";
import { setPereferenceToggle } from "../../../../store/actions/MessageAction";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { notifySuccess } from "../../../../helper/notify";
const Addperference = ({ onSuccess, preference }) => {
  // const { dropdownObject } =
  //     useContext(addQueryContext);
  // const { dropdownState } = dropdownObject;
  // console.log(preference,"preference")
  const dispatch = useDispatch();
  const { background } = useContext(ThemeContext);
  const [validationErrors, setValidationErrors] = useState({});
  const [businessType, setBusinessType] = useState([]);
  const [queryTypeList, setQueryTypeList] = useState([]);
  const [hotelList, setHotelList] = useState([]);
  const [vehicleList, setVehicleList] = useState([]);
  const [paxList, setPaxList] = useState([]);
  const [iSOList, setISOList] = useState([]);
  const [consortiaList, setConsortiaList] = useState([]);
  const [hotelTypeList, setHotelTypeList] = useState([]);
  const [formValue, setFormValue] = useState(addPereferenceInitialValue);
  const navigate = useNavigate();
  const [salesPersonOptionList, setSalesPersonOptionList] = useState([]);
  const [contractPersonOptionList, setContractPersonOptionList] = useState([]);
  const compId = JSON.parse(localStorage.getItem("token"))?.companyKey;

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
      height: "2rem", // compact height
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
      zIndex: 9999, // only number here
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

  const salesPersonOption = salesPersonOptionList?.map((salesPerson) => ({
    value: salesPerson?.id,
    label: salesPerson?.name,
  }));

  const contractPersonOption = contractPersonOptionList?.map(
    (contractPerson) => ({
      value: contractPerson?.id,
      label: contractPerson?.name,
    })
  );

  // const salesPersonOption = [
  //   {
  //     value: 1,
  //     label: "Rizwan",
  //   },
  //   {
  //     value: 2,
  //     label: "Ansar",
  //   },
  // ];
  // const contractPersonOption = [
  //   {
  //     value: 1,
  //     label: "Samay",
  //   },
  //   {
  //     value: 2,
  //     label: "Mausam",
  //   },
  // ];
  const getAPIToServer = async () => {
    try {
      const { data } = await axiosOther.post("businesstypelist", {
        Search: "",
        Status: "1",
      });
      setBusinessType(data?.DataList);
    } catch (err) {
      console.log(err);
    }
    try {
      const { data } = await axiosOther.post("querytypelist", {
        Search: "",
        Status: "1",
      });
      setQueryTypeList(data?.DataList);
    } catch (err) {
      console.log(err);
    }
    try {
      const { data } = await axiosOther.post("hotelcategorylist", {
        Search: "",
        Status: "1",
      });
      //   dropdownDispatch({
      //     type: "HOTEL-CATEGORY",
      //     payload: data?.DataList,
      //   });
      setHotelList(data?.DataList);
    } catch (err) {
      console.log(err);
    }
    try {
      const { data } = await axiosOther.post("paxlist", {
        Search: "",
        Status: "1",
      });
      setPaxList(data?.DataList);
    } catch (err) {
      console.log(err);
    }
    try {
      const { data } = await axiosOther.post("hotel-type-by-id", {
        Search: "",
        Status: "1",
      });
      setHotelTypeList(data);
    } catch (err) {
      console.log(err);
    }
    try {
      const { data } = await axiosOther.post("isomasterlist", {
        Search: "",
        Status: "1",
      });
      setISOList(data?.DataList);
    } catch (err) {
      console.log(err);
    }
    try {
      const { data } = await axiosOther.post("consortiamasterlist", {
        Search: "",
        Status: "1",
      });
      setConsortiaList(data?.DataList);
    } catch (err) {
      console.log(err);
    }
    try {
      const { data } = await axiosOther.post("vehicletypemasterlist", {
        Search: "",
        Status: "1",
      });
      setVehicleList(data?.DataList);
    } catch (err) {
      console.log(err);
    }

    // API calling for sales Person
    try {
      const { data } = await axiosOther.post("users/by-role", {
        role: "Pre Sales",
        company_id: compId,
      });
      // console.log(data?.data, "presalesdata");
      setSalesPersonOptionList(data?.data);
    } catch (error) {
      console.log(error);
    }
    // API calling for Contracting Person
    try {
      const { data } = await axiosOther.post("users/by-role", {
        role: "Pre Sales",
        company_id: compId,
      });
      // console.log(data?.data, "presalesdata");
      setContractPersonOptionList(data?.data);
    } catch (error) {
      console.log(error);
    }
  };
  const vehiclePrefOption = vehicleList?.map((vehicl) => ({
    value: vehicl?.id,
    label: vehicl.Name,
  }));
  useEffect(() => {
    getAPIToServer();
    if (preference) {
      setFormValue({
        ...formValue,
        Email: preference?.Email,
        TravelInfo: preference?.TravelInfo,
        Preview: preference?.Preview,
        SetPreference: preference?.SetPreference,
        VehiclePreferenceId: preference?.VehiclePreferenceId,
        Preferences: {
          ...formValue?.Preferences,
          PaxTypeId: preference?.Preferences?.PaxTypeId,
          BusinessTypeId: preference?.Preferences?.BusinessTypeId,
          QueryTypeId: preference?.Preferences?.QueryTypeId,
          HotelCategoryId: preference?.Preferences?.HotelCategoryId,
          HotelTypeId: preference?.Preferences?.HotelTypeId,

          Assignment: {
            ...formValue?.Preferences?.Assignment,
            ContractingPersonId: preference?.Preferences?.ContractingPersonId,
            SalesPersonId: preference?.Preferences?.SalesPersonId,
          },
          SalesPerson: {
            ...formValue?.Preferences?.SalesPerson,
            IsoId: preference?.Preferences?.IsoId,
            ConsortiaId: preference?.Preferences?.ConsortiaId,
          },
        },
      });
    }
  }, [preference]);
  const handleSelectChange = (input, actionMeta) => {
    const { name, type } = actionMeta || input.target;
    // console.log(name, type);
    if (type === undefined) {
      setFormValue({
        ...formValue,
        Preferences: {
          ...formValue?.Preferences,
          Assignment: {
            ...formValue?.Preferences?.Assignment,
            [name]: input ? input.value : "",
          },
        },
      });
    }
  };
  const handleSelectVehicleChange = (input, actionMeta) => {
    const { name, type } = actionMeta || input.target;
    if (type === undefined) {
      setFormValue({
        ...formValue,
        [name]: input ? input.value : "",
      });
    }
  };
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (
      name == "SetPreference" ||
      name == "Preview" ||
      name == "TravelInfo" ||
      name == "Email"
    ) {
      setFormValue({
        ...formValue,
        [name]: value,
      });
    } else if (name == "IsoId" || name == "ConsortiaId") {
      setFormValue({
        ...formValue,
        Preferences: {
          ...formValue?.Preferences,
          SalesPerson: {
            ...formValue?.Preferences?.SalesPerson,
            [name]: value,
          },
        },
      });
    } else {
      setFormValue({
        ...formValue,
        Preferences: {
          ...formValue?.Preferences,
          [name]: value,
        },
      });
    }
  };
  // console.log(formValue, "109");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePreferenceValidation.validate(
        {
          ...formValue,
        },
        { abortEarly: false }
      );

      setValidationErrors({});
      let companyKey = JSON.parse(localStorage.getItem("token"))?.companyKey;
      let userKey = JSON.parse(localStorage.getItem("token"))?.UserID;

      const { data } = await axiosOther.post("addupdatequerypref", {
        ...formValue,
        CompanyId: companyKey,
        UserId: userKey,
      });

      if (data?.Status == 1) {
        dispatch(setPereferenceToggle());
        // navigate("/hotel");
        if (onSuccess) {
          onSuccess();
        }

        // toast.success(data?.Message || data?.message);
        notifySuccess(data?.Message || data?.message);
        localStorage.setItem("success-message", data?.Message || data?.message);
      }
      if (data?.Status != 1) {
        notifyError(data?.message || data?.Message);
      }
    } catch (error) {
      if (error.inner) {
        const validationErrorss = error.inner.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {});
        setValidationErrors(validationErrorss);
      }

      if (error.response?.data?.Errors) {
        const data = Object.entries(error.response?.data?.Errors);
        notifyError(data[0][1]);
      }
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Update Preferences</h4>
              {!onSuccess && (
                <div className="d-flex justify-content-end gap-2">
                  <button
                    className="btn btn-dark btn-custom-size"
                    name="SaveButton"
                    onClick={() => navigate(-1)}
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
              )}
            </div>
            <div className="card-body">
              <div className="form-validation">
                <div className="row mt-2">
                  <div className="col-lg-2 col-md-3">
                    <div
                      className="border rounded position-relative  px-2  p-2 mt-2"
                      style={{ minHeight: "6rem" }}
                    >
                      <label
                        class
                        Name="mb-1 m-0 position-absolute form-label-position-1 bg-label-border px-1 font-weight-bold "
                      >
                        Business Type
                      </label>
                      <div className="d-flex gap-2">
                        {businessType?.length > 0 &&
                          businessType.map((data, index) => (
                            <div className="form-check">
                              <label
                                className="form-check-label"
                                htmlFor="daywise"
                              >
                                {data?.Name}
                              </label>
                              <input
                                className="form-check-input"
                                type="radio"
                                name="BusinessTypeId"
                                id="businessType"
                                value={data?.id}
                                onChange={handleFormChange}
                                checked={
                                  formValue?.Preferences?.BusinessTypeId ==
                                  data?.id
                                }
                                style={{ height: "1rem", width: "1rem" }}
                              />
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-9 ">
                    <div
                      className="border rounded position-relative  px-2  p-2 mt-2"
                      style={{ minHeight: "6rem" }}
                    >
                      <label className="mb-1 m-0 position-absolute form-label-position-1 bg-label-border px-1 font-weight-bold ">
                        Query Type
                        <span className="text-danger ms-1">*</span>
                      </label>
                      <div className="d-flex gap-2 flex-wrap">
                        {queryTypeList?.length > 0 &&
                          queryTypeList.map((data, index) => (
                            <div className="form-check">
                              <label
                                className="form-check-label"
                                htmlFor="daywise"
                              >
                                {data?.Name}
                              </label>
                              <input
                                className="form-check-input"
                                type="radio"
                                name="QueryTypeId"
                                id="businessType"
                                value={data?.id}
                                onChange={handleFormChange}
                                checked={
                                  formValue?.Preferences?.QueryTypeId ==
                                  data?.id
                                }
                                style={{ height: "1rem", width: "1rem" }}
                              />
                            </div>
                          ))}
                      </div>
                      {validationErrors?.["Preferences.QueryTypeId"] && (
                        <div
                          className="invalid-feedback animated fadeInUp"
                          style={{ display: "block" }}
                        >
                          {validationErrors?.["Preferences.QueryTypeId"]}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-1 col-md-5">
                    <div
                      className="border rounded position-relative  px-2  p-2 mt-2"
                      style={{ minHeight: "6rem" }}
                    >
                      <label className="mb-1 m-0 position-absolute form-label-position-1 bg-label-border px-1 font-weight-bold ">
                        Preview
                        <span className="text-danger ms-1">*</span>
                      </label>
                      <div className="d-flex justify-content-start gap-1 flex-wrap">
                        <div className="form-check ">
                          <label className="form-check-label" htmlFor="daywise">
                            Yes
                          </label>
                          <input
                            className="form-check-input"
                            type="radio"
                            name="Preview"
                            id="businessType"
                            value="Yes"
                            onChange={handleFormChange}
                            checked={formValue?.Preview == "Yes"}
                            style={{ height: "1rem", width: "1rem" }}
                          />
                        </div>

                        <div className="form-check">
                          <label className="form-check-label" htmlFor="daywise">
                            No
                          </label>
                          <input
                            className="form-check-input"
                            type="radio"
                            name="Preview"
                            id="businessType"
                            value="No"
                            onChange={handleFormChange}
                            checked={formValue?.Preview == "No"}
                            style={{ height: "1rem", width: "1rem" }}
                          />
                        </div>
                      </div>
                      {validationErrors?.Preview && (
                        <div
                          className="invalid-feedback animated fadeInUp"
                          style={{ display: "block" }}
                        >
                          {validationErrors?.Preview}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-1 col-md-5">
                    <div
                      className="border rounded position-relative  px-2  p-2 mt-2"
                      style={{ minHeight: "6rem" }}
                    >
                      <label className="mb-1 m-0 position-absolute form-label-position-1 bg-label-border px-1 font-weight-bold ">
                        Email
                        <span className="text-danger ms-1">*</span>
                      </label>
                      <div className="d-flex justify-content-start gap-1 flex-wrap">
                        <div className="form-check ">
                          <label className="form-check-label" htmlFor="daywise">
                            Yes
                          </label>
                          <input
                            className="form-check-input"
                            type="radio"
                            name="Email"
                            id="businessType"
                            value="Yes"
                            onChange={handleFormChange}
                            checked={formValue?.Email == "Yes"}
                            style={{ height: "1rem", width: "1rem" }}
                          />
                        </div>

                        <div className="form-check">
                          <label className="form-check-label" htmlFor="daywise">
                            No
                          </label>
                          <input
                            className="form-check-input"
                            type="radio"
                            name="Email"
                            id="businessType"
                            value="No"
                            onChange={handleFormChange}
                            checked={formValue?.Email == "No"}
                            style={{ height: "1rem", width: "1rem" }}
                          />
                        </div>
                      </div>
                      {validationErrors?.Email && (
                        <div
                          className="invalid-feedback animated fadeInUp"
                          style={{ display: "block" }}
                        >
                          {validationErrors?.Email}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-2 col-md-5">
                    <div
                      className="border rounded position-relative  px-2  p-2 mt-2"
                      style={{ minHeight: "6rem" }}
                    >
                      <label className="mb-1 m-0 position-absolute form-label-position-1 bg-label-border px-1 font-weight-bold ">
                        Travel Info
                        <span className="text-danger ms-1">*</span>
                      </label>
                      <div className="d-flex justify-content-start gap-1 flex-wrap">
                        <div className="form-check ">
                          <label className="form-check-label" htmlFor="daywise">
                            Day Wise
                          </label>
                          <input
                            className="form-check-input"
                            type="radio"
                            name="TravelInfo"
                            id="businessType"
                            value="Day wise"
                            onChange={handleFormChange}
                            checked={formValue?.TravelInfo == "Day wise"}
                            style={{ height: "1rem", width: "1rem" }}
                          />
                        </div>

                        <div className="form-check">
                          <label className="form-check-label" htmlFor="daywise">
                            Date Wise
                          </label>
                          <input
                            className="form-check-input"
                            type="radio"
                            name="TravelInfo"
                            id="businessType"
                            value="Date wise"
                            onChange={handleFormChange}
                            checked={formValue?.TravelInfo == "Date wise"}
                            style={{ height: "1rem", width: "1rem" }}
                          />
                        </div>
                      </div>
                      {validationErrors?.TravelInfo && (
                        <div
                          className="invalid-feedback animated fadeInUp"
                          style={{ display: "block" }}
                        >
                          {validationErrors?.TravelInfo}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-2 col-md-4">
                    <div
                      className="border rounded position-relative  px-2  p-2 mt-2"
                      style={{ minHeight: "6rem" }}
                    >
                      <label className="mb-1 m-0 position-absolute form-label-position-1 bg-label-border px-1 font-weight-bold ">
                        Pax Type
                      </label>
                      <div></div>
                      <div className="d-flex gap-2 flex-wrap">
                        {paxList?.length > 0 &&
                          paxList.map((data, index) => (
                            <div className="form-check">
                              <label
                                className="form-check-label"
                                htmlFor="daywise"
                              >
                                {data?.Paxtype}
                              </label>
                              <input
                                className="form-check-input"
                                type="radio"
                                name="PaxTypeId"
                                id="businessType"
                                value={data?.id}
                                onChange={handleFormChange}
                                checked={
                                  formValue?.Preferences?.PaxTypeId == data?.id
                                }
                                style={{ height: "1rem", width: "1rem" }}
                              />
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                  {/* <div className="col-lg-3 col-md-4">
                                    <div className="border rounded position-relative  px-2  p-2 mt-2" style={{minHeight:'6rem'}}>
                                        <label className="mb-1 m-0 position-absolute form-label-position-1 bg-label-border px-1 font-weight-bold ">Travel Type
                                            <span className='text-danger ms-1' >*</span>
                                        </label>
                                        <div className="d-flex gap-2 flex-wrap">

                                          
                                            <div className="form-check">
                                                <label className="form-check-label" htmlFor="daywise">
                                                    Value Added Services
                                                </label>
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="businessType"
                                                    id="businessType"
                                                    value="Value Added Services"
                                                    onChange={handleFormChange}
                                                    

                                                    style={{ height: "1rem", width: "1rem" }}
                                                />

                                            </div>
                                            <div className="form-check">
                                                <label className="form-check-label" htmlFor="daywise">
                                                    Inbound
                                                </label>
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="businessType"
                                                    id="businessType"
                                                    value="Inbound"
                                                    onChange={handleFormChange}
                                                    

                                                    style={{ height: "1rem", width: "1rem" }}
                                                />

                                            </div>
                                        
                                        </div>
                                        

                                    </div>
                                </div> */}
                  <div className="col-lg-2 col-md-4">
                    <div
                      className="border rounded position-relative  px-2  p-2 mt-2"
                      style={{ minHeight: "6rem" }}
                    >
                      <label className="mb-1 m-0 position-absolute form-label-position-1 bg-label-border px-1 font-weight-bold ">
                        Priority
                        <span className="text-danger ms-1">*</span>
                      </label>
                      <div className="d-flex gap-2 flex-wrap">
                        {/* {dropdownState?.paxList?.length > 0 && dropdownState?.paxList.map((data, index) => ( */}

                        <div className="form-check">
                          <label className="form-check-label" htmlFor="daywise">
                            High
                          </label>
                          <input
                            className="form-check-input"
                            type="radio"
                            name="SetPreference"
                            id="businessType"
                            value="High"
                            onChange={handleFormChange}
                            checked={formValue?.SetPreference == "High"}
                            style={{ height: "1rem", width: "1rem" }}
                          />
                        </div>
                        <div className="form-check">
                          <label className="form-check-label" htmlFor="daywise">
                            Low
                          </label>
                          <input
                            className="form-check-input"
                            type="radio"
                            name="SetPreference"
                            id="businessType"
                            value="Low"
                            onChange={handleFormChange}
                            checked={formValue?.SetPreference == "Low"}
                            style={{ height: "1rem", width: "1rem" }}
                          />
                        </div>
                        <div className="form-check">
                          <label className="form-check-label" htmlFor="daywise">
                            Medium
                          </label>
                          <input
                            className="form-check-input"
                            type="radio"
                            name="SetPreference"
                            id="businessType"
                            value="Medium"
                            onChange={handleFormChange}
                            checked={formValue?.SetPreference == "Medium"}
                            style={{ height: "1rem", width: "1rem" }}
                          />
                        </div>
                        {/* ))} */}
                      </div>
                      {validationErrors?.SetPreference && (
                        <div
                          className="invalid-feedback animated fadeInUp"
                          style={{ display: "block" }}
                        >
                          {validationErrors?.SetPreference}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-4">
                    <div
                      className="border rounded position-relative  px-2  p-2 mt-2 "
                      style={{ minHeight: "6rem" }}
                    >
                      <label className="mb-1 m-0 position-absolute form-label-position-1 bg-label-border px-1 font-weight-bold ">
                        Hotel Category
                      </label>
                      <div className="row align-items-center">
                        <div className="col-xl-3 col-lg-6 float-right d-flex justify-content-end flex-column">
                          <label className="form-check-label" htmlFor="daywise">
                            Hotel Type
                          </label>
                          <select
                            name="HotelTypeId"
                            id=""
                            className="form-control form-control-sm form-query "
                            value={formValue?.Preferences?.HotelTypeId}
                            onChange={handleFormChange}
                            // style={{ height: '2rem' }}
                            autocomplete="off"
                          >
                            <option value="">Select</option>
                            {hotelTypeList?.length > 0 &&
                              hotelTypeList.map((data) => {
                                return (
                                  <option value={data?.id}>{data?.Name}</option>
                                );
                              })}
                          </select>
                        </div>
                        <div className="col-xl-9 col-lg-12">
                          <label className="form-check-label" htmlFor="daywise">
                            Hotel Category
                          </label>
                          <div className="d-flex gap-1 mt-1 ">
                            {hotelList?.length > 0 &&
                              hotelList.map((data, index) => (
                                <div className="form-check">
                                  <label
                                    className="form-check-label  me-2 ms-0"
                                    htmlFor="daywise"
                                  >
                                    {data?.Name}*
                                  </label>
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name="HotelCategoryId"
                                    id="businessType"
                                    value={data?.id}
                                    onChange={handleFormChange}
                                    checked={
                                      formValue?.Preferences?.HotelCategoryId ==
                                      data?.id
                                    }
                                    style={{ height: "1rem", width: "1rem" }}
                                  />
                                </div>
                              ))}
                            <div className="form-check">
                              <label
                                className="form-check-label  me-2 ms-0"
                                htmlFor="daywise"
                              >
                                All*
                              </label>
                              <input
                                className="form-check-input"
                                type="radio"
                                // name="businessType"
                                name="HotelCategoryId"
                                id="businessType"
                                value="0"
                                onChange={handleFormChange}
                                // checked={formValue?.DashboardPermissionId?.includes(data?.id)}

                                style={{ height: "1rem", width: "1rem" }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {console.log(formValue, "checkformvalueeeeeee")}
                  <div className="col-lg-4 col-md-7">
                    <div
                      className="border rounded position-relative  px-2  p-2 mt-2"
                      style={{ minHeight: "6rem" }}
                    >
                      <label className="mb-1 m-0 position-absolute form-label-position-1 bg-label-border px-1 font-weight-bold ">
                        Assignment
                      </label>
                      <div className="row">
                        <div className="col-lg-6">
                          <label className="m-0 setPreference-font-10 ">
                            Sales Person
                          </label>

                          <Select
                            name="SalesPersonId"
                            id=""
                            options={salesPersonOption}
                            onChange={handleSelectChange}
                            value={salesPersonOption?.find(
                              (option) =>
                                option.value ===
                                formValue?.Preferences?.Assignment
                                  ?.SalesPersonId
                            )}
                            className="customSelectLightTheame"
                            classNamePrefix="custom"
                            styles={customStyles}
                            placeholder="Select"
                            autocomplete="off"
                          ></Select>
                        </div>

                        <div className="col-lg-6">
                          <label className="m-0 setPreference-font-10">
                            Contracting Person
                          </label>

                          <Select
                            name="ContractingPersonId"
                            id=""
                            options={contractPersonOption}
                            onChange={handleSelectChange}
                            value={contractPersonOption?.find(
                              (option) =>
                                option.value ===
                                formValue?.Preferences?.Assignment
                                  ?.ContractingPersonId
                            )}
                            className="customSelectLightTheame"
                            classNamePrefix="custom"
                            styles={customStyles}
                            placeholder="Select"
                            autocomplete="off"
                          ></Select>
                        </div>
                        <div className="col-12 mt-2">
                          <label className="m-0 setPreference-font-10">
                            Vehicle Preference
                          </label>
                          <Select
                            name="VehiclePreferenceId"
                            id=""
                            options={vehiclePrefOption}
                            onChange={handleSelectVehicleChange}
                            value={
                              vehiclePrefOption?.find(
                                (option) =>
                                  option.value ===
                                  (formValue?.VehiclePreferenceId || 16)
                              ) || null
                            }
                            className="customSelectLightTheame"
                            classNamePrefix="custom"
                            styles={customStyles}
                            placeholder="Select"
                            autocomplete="off"
                            menuPlacement="top"
                          ></Select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-5">
                    <div
                      className="border rounded position-relative  px-2  p-2 mt-2"
                      style={{ minHeight: "6rem" }}
                    >
                      <label className="mb-1 m-0 position-absolute form-label-position-1 bg-label-border px-1 font-weight-bold ">
                        ISO
                      </label>
                      <div className="row">
                        <div className="col-lg-5">
                          <label className="form-check-label" htmlFor="daywise">
                            ISO
                          </label>
                          <select
                            name="IsoId"
                            id=""
                            className="form-control form-control-sm form-query "
                            value={formValue?.Preferences?.SalesPerson?.IsoId}
                            onChange={handleFormChange}
                            // style={{ height: '2rem' }}
                            autocomplete="off"
                          >
                            <option value="">Select</option>
                            {iSOList?.length > 0 &&
                              iSOList.map((data) => {
                                return (
                                  <option value={data?.id}>{data?.Name}</option>
                                );
                              })}
                          </select>
                        </div>
                        <div className="col-lg-7">
                          <label className="form-check-label" htmlFor="daywise">
                            Consortia Person
                          </label>
                          <select
                            name="ConsortiaId"
                            id=""
                            className="form-control form-control-sm form-query "
                            value={
                              formValue?.Preferences?.SalesPerson?.ConsortiaId
                            }
                            onChange={handleFormChange}
                            // style={{ height: '2rem' }}
                            autocomplete="off"
                          >
                            <option value="">Select</option>
                            {consortiaList?.length > 0 &&
                              consortiaList.map((data) => {
                                return (
                                  <option value={data?.id}>{data?.Name}</option>
                                );
                              })}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-flex gap-3 justify-content-end mt-3">
                {!onSuccess && (
                  <button
                    className="btn btn-dark btn-custom-size"
                    name="SaveButton"
                    onClick={() => navigate(-1)}
                  >
                    <span className="me-1">Back</span>
                    <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
                  </button>
                )}

                <button
                  onClick={handleSubmit}
                  className="btn btn-primary btn-custom-size"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Addperference;
