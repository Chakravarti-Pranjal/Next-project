import React, { useState, useEffect } from "react";
import { resturantValidationSchema } from "../master_validation";
import { resturantInitialValue } from "../masters_initial_value";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { axiosOther } from "../../../../http/axios_base_url";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { notifyHotSuccess } from "../../../../helper/notify";

const Add = () => {
  const [formValue, setFormValue] = useState(resturantInitialValue);
  const [validationErrors, setValidationErrors] = useState({});
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [destinationList, setDestinationList] = useState([]);
  const [divisionList, setDivisionList] = useState([]);
  const [phoneValue, setPhoneValue] = useState({
    Phone1: "",
    Phone2: "",
    Phone3: "",
  });

  const { state } = useLocation();
  const navigate = useNavigate();

  // get list for dropdown
  const postDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("destinationlist", {
        CountryId: "",
        StateId: "",
        Name: "",
        Default: "",
        Status: "",
      });
      setDestinationList(data?.DataList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    postDataToServer();
  }, []);

  const getDataToServer = async () => {
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
      const destination = await axiosOther.post("destinationlist", {
        Search: "",
        Status: 1,
      });
      setDestinationList(destination.data.DataList);
    } catch (err) {
      console.log(err);
    }
    try {
      const division = await axiosOther.post("divisionlist", {
        Search: "",
        Status: 1,
      });
      setDivisionList(division.data.DataList);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getDataToServer();
  }, []);

  useEffect(() => {
    const dependentStateAndCity = async () => {
      try {
        const { data } = await axiosOther.post("listStateByCountry", {
          countryid: formValue?.Country,
        });
        setStateList(data.DataList);
      } catch (err) {
        console.log(err);
      }

      try {
        const { data } = await axiosOther.post(
          "listCityByStateandCountryName",
          {
            countryid: formValue?.Country,
            stateid: formValue?.State,
          }
        );
        setCityList(data.DataList);
      } catch (err) {
        console.log(err);
      }
    };
    dependentStateAndCity();
  }, [formValue?.State, formValue?.Country]);

  // submitting data to server
  const handleSubmit = async (e) => {
    // console.log("phone-value", phoneValue);
    e.preventDefault();
    try {
      await resturantValidationSchema.validate(
        {
          ...formValue,
          ...phoneValue,
        },
        { abortEarly: false }
      );

      // console.log("form-value", {
      //   ...formValue,
      //   ...phoneValue,
      // });

      setValidationErrors({});
      const { data } = await axiosOther.post("addupdaterestaurantmaster", {
        ...formValue,
        ...phoneValue,
      });

      if (data?.Status == 1) {
        notifyHotSuccess(data?.Message || data?.message);
        navigate("/restaurant");
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
        notifyHotError(data[0][1]);
        alert(data[0][1]);
      }

      console.log("error", error);
    }
  };
  // handlign form changes
  const handleInputChange = (e) => {
    const { name, value, files, type } = e.target;

    if (type == "file") {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result;
        const base64String = await base64.split(",")[1];
        setFormValue({
          ...formValue,
          ImageData: base64String,
          ImageName: file.name,
        });
      };
      reader.readAsDataURL(file);
    } else {
      setFormValue((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // setting data to form for update
  useEffect(() => {
    if (state) {
      // console.log(state,"state")
      setFormValue({
        id: state?.Id,
        Name: state?.Name,
        Destination: state?.DestinationId,
        Address: state?.Address,
        Country: parseInt(state?.CountryId),
        State: state?.StateId,
        City: state?.CityId,
        SelfSupplier: state?.SelfSupplier,
        PinCode: state?.PinCode,
        GSTN: state?.GSTN,
        ContactType: state?.ContactType,
        ContactName: state?.ContactName,
        ContactDesignation: state?.ContactDesignation,
        ImageName: state?.ImageName,
        // ImageName: "",
        CountryCode: "+91",
        Phone1: state?.Phone1,
        Phone2: state?.Phone2,
        Phone3: state?.Phone3,
        ContactEmail: state?.ContactEmail,
        Status: state?.Status,
        Default: state?.Default,

        AddedBy: 0,
        UpdatedBy: 1,
      });
      setPhoneValue({
        Phone1: state?.Phone1?.toString(),
        Phone2: state?.Phone2?.toString(),
        Phone3: state?.Phone3?.toString(),
      });
    }
  }, [state]);

  const handlePhoneChange = (phone, nameValue) => {
    setPhoneValue({ ...phoneValue, [nameValue]: phone });
  };

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header py-3">
            <h4 className="card-title">Add Restaurant</h4>
            <div className="d-flex gap-3">
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
          </div>
          <div className="card-body">
            <div className="form-validation">
              <form
                className="form-valide"
                action="#"
                method="post"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="row form-row-gap">
                  <div className="col-md-6 col-lg-3">
                    <label className="m-0">
                      Restaurant Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Restaurant Name"
                      className="form-control form-control-sm"
                      name="Name"
                      value={formValue?.Name}
                      onChange={handleInputChange}
                    />

                    {validationErrors?.Name && (
                      <div
                        id="val-username1-error"
                        className="invalid-feedback animated fadeInUp"
                        style={{ display: "block" }}
                      >
                        {validationErrors?.Name}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <label className="m-0">Destination</label>
                    <select
                      id=""
                      name="Destination"
                      value={formValue?.Destination}
                      onChange={handleInputChange}
                      className="form-control form-control-sm"
                    >
                      <option value="">Select</option>
                      {destinationList?.map((value, index) => {
                        return (
                          <option value={value.id} key={index + 1}>
                            {value.Name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <label className="m-0">
                      Address <span className="text-danger">*</span>
                    </label>
                    <textarea
                      type="text"
                      placeholder="Address"
                      className="form-control form-control-sm"
                      name="Address"
                      value={formValue?.Address}
                      onChange={handleInputChange}
                      row="3"
                    />
                    {validationErrors?.Address && (
                      <div
                        id="val-username1-error"
                        className="invalid-feedback animated fadeInUp"
                        style={{ display: "block" }}
                      >
                        {validationErrors?.Address}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6 col-lg-3">
                    <label className="m-0">Country</label>
                    <select
                      name="Country"
                      id=""
                      className="form-control form-control-sm"
                      value={formValue?.Country}
                      onChange={handleInputChange}
                    >
                      <option value="">Select</option>
                      {countryList?.map((value, index) => {
                        return (
                          <option value={value.id} key={index + 1}>
                            {value.Name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <label className="m-0">State</label>
                    <select
                      name="State"
                      id=""
                      className="form-control form-control-sm"
                      value={formValue?.State}
                      onChange={handleInputChange}
                    >
                      <option value="">Select</option>
                      {stateList?.map((value, index) => {
                        return (
                          <option value={value.id} key={index + 1}>
                            {value.Name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <label className="m-0">City</label>
                    <select
                      name="City"
                      id=""
                      className="form-control form-control-sm"
                      value={formValue?.City}
                      onChange={handleInputChange}
                    >
                      <option value="">Select</option>
                      {cityList?.map((value, index) => {
                        return (
                          <option value={value.id} key={index + 1}>
                            {value.Name}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className="col-md-6 col-lg-3">
                    <label className="m-0">
                      Pin Code <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="PIN"
                      className="form-control form-control-sm"
                      name="PinCode"
                      value={formValue?.PinCode}
                      onChange={handleInputChange}
                    />

                    {validationErrors?.PinCode && (
                      <div
                        id="val-username1-error"
                        className="invalid-feedback animated fadeInUp"
                        style={{ display: "block" }}
                      >
                        {validationErrors?.PinCode}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <label className="m-0">
                      GSTN <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="GSTN"
                      className="form-control form-control-sm"
                      name="GSTN"
                      value={formValue?.GSTN}
                      onChange={handleInputChange}
                    />
                    {validationErrors?.GSTN && (
                      <div
                        id="val-username1-error"
                        className="invalid-feedback animated fadeInUp"
                        style={{ display: "block" }}
                      >
                        {validationErrors?.GSTN}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <label className="m-0" htmlFor="val-username">
                      Upload Image
                    </label>
                    <input
                      type="file"
                      className="form-control form-control-sm"
                      id="val-username"
                      // value={formValue?.ImageName}
                      name="ImageData"
                      placeholder="Enter a username.."
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <label className="m-0">Status</label>
                    <select
                      name="Status"
                      id=""
                      className="form-control form-control-sm"
                      value={formValue?.Status}
                      onChange={handleInputChange}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <label>Self Supplier</label>
                    <div className="d-flex gap-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="SelfSupplier"
                          value="1"
                          id="default_yes"
                          checked={formValue?.SelfSupplier == 1}
                          onChange={handleInputChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="default_yes"
                        >
                          Yes
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="SelfSupplier"
                          value="0"
                          id="default_no"
                          checked={formValue?.SelfSupplier == 0}
                          onChange={handleInputChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="default_no"
                        >
                          No
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <label>
                      Set Default <span className="text-danger">*</span>
                    </label>
                    <div className="d-flex gap-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="Default"
                          value="Yes"
                          id="default_yes"
                          checked={formValue?.Default == "Yes"}
                          onChange={handleInputChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="default_yes"
                        >
                          Yes
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="Default"
                          value="No"
                          id="default_no"
                          checked={formValue?.Default == "No"}
                          onChange={handleInputChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="default_no"
                        >
                          No
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row mt-4 form-row-gap">
                  <div className="col-12">
                    <div className="custom-bottom-border">
                      <span>Contact Information</span>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <label className="m-0">Contact Person</label>
                    <select
                      name="ContactType"
                      id=""
                      className="form-control form-control-sm"
                      value={formValue?.ContactType}
                      onChange={handleInputChange}
                    >
                      <option value="">Select</option>
                      <option value="Account">Account</option>
                      <option value="Operation">Operation</option>
                      <option value="Sales">Sales</option>
                    </select>
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <label className="m-0">Name</label>
                    <input
                      type="text"
                      placeholder="Name"
                      className="form-control form-control-sm"
                      name="ContactName"
                      value={formValue?.ContactName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <label className="m-0">Designation</label>
                    <input
                      type="text"
                      placeholder="Designation"
                      className="form-control form-control-sm"
                      name="ContactDesignation"
                      value={formValue?.ContactDesignation}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <label className="m-0">Phone 1</label>
                    <PhoneInput
                      defaultCountry="in"
                      value={phoneValue?.Phone1}
                      onChange={(phone) => handlePhoneChange(phone, "Phone1")}
                    />
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <label className="m-0">Phone 2</label>
                    <PhoneInput
                      defaultCountry="in"
                      value={phoneValue?.Phone2}
                      onChange={(phone) => handlePhoneChange(phone, "Phone2")}
                    />
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <label className="m-0">Phone 3</label>
                    <PhoneInput
                      defaultCountry="in"
                      value={phoneValue?.Phone3}
                      onChange={(phone) => handlePhoneChange(phone, "Phone3")}
                    />
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <label className="m-0">
                      Email <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Email"
                      className="form-control form-control-sm"
                      name="ContactEmail"
                      value={formValue?.ContactEmail}
                      onChange={handleInputChange}
                    />

                    {validationErrors?.ContactEmail && (
                      <div
                        id="val-username1-error"
                        className="invalid-feedback animated fadeInUp"
                        style={{ display: "block" }}
                      >
                        {validationErrors?.ContactEmail}
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>
            <div className="d-flex gap-3 justify-content-end">
              <Link to={"/restaurant"} className="btn btn-dark btn-custom-size">
                Back
              </Link>
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
  );
};

export default Add;
