import React, { useState, useEffect } from "react";
import { guideMasterValidationSchema } from "../master_validation";
import { guideMasterInitialValue } from "../masters_initial_value";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useMultipleSelect from "../../../../hooks/custom_hooks/useMultipleSelect";
import { axiosOther } from "../../../../http/axios_base_url";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { notifyHotSuccess } from "../../../../helper/notify";

const AddGuide = () => {
  const [formValue, setFormValue] = useState(guideMasterInitialValue);
  const [validationErrors, setValidationErrors] = useState({});
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [destinationList, setDestinationList] = useState([]);
  const [languageList, setLanguageList] = useState([]);

  const [phoneValue, setPhoneValue] = useState({
    MobileNumber: "",
    WhatsappNumber: "",
    AlternateNumber: "",
  });
  const { state } = useLocation();
  const navigate = useNavigate();
  // get list for dropdown
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
      const language = await axiosOther.post("languagelist", {
        Search: "",
        Status: 1,
      });
      setLanguageList(language.data.DataList);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getDataToServer();
  }, []);

  useEffect(() => {
    if (formValue?.Country != "") {
      const dependentState = async () => {
        try {
          const { data } = await axiosOther.post("listStateByCountry", {
            countryid: formValue?.Country,
          });
          setStateList(data.DataList);
        } catch (err) {
          console.log(err);
        }
      };
      dependentState();
    }
  }, [formValue?.Country]);

  useEffect(() => {
    if (formValue?.State != "") {
      const dependentCity = async () => {
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
      dependentCity();
    }
  }, [formValue?.State]);

  const languageOption = languageList?.map((lang) => {
    return {
      value: lang?.id,
      label: lang?.Name,
    };
  });

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

  const {
    SelectInput: LanguageInput,
    selectedData: languageSelected,
    setSelectedData: setLanguageSelected,
  } = useMultipleSelect(languageOption);

  // submitting data to server
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await guideMasterValidationSchema.validate(
        {
          ...formValue,
          ...phoneValue,
          Destination: destinationSelected,
          Languages: languageSelected,
        },
        { abortEarly: false }
      );

      setValidationErrors({});
      const { data } = await axiosOther.post("addupdateguide", {
        ...formValue,
        ...phoneValue,
        Destination: destinationSelected,
        Languages: languageSelected,
      });

      if (data?.Status == 1) {
        notifyHotSuccess(data?.Message || data?.message);
        navigate("/guide");
      }
    } catch (error) {
      if (error.inner) {
        const errorMessages = error.inner.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {});
        setValidationErrors(errorMessages);
        
      }

      if (error.response?.data?.Errors || error.response?.data?.errors) {
        const data = Object.entries(
          error.response?.data?.Errors || error.response?.data?.errors
        );
        alert(data[0][1]);
      }
    }
  };
  const handlePhoneChange = (phone, nameValue) => {
    setPhoneValue({ ...phoneValue, [nameValue]: phone });
  };

  // handlign form changes
  const handleFormChange = (e) => {
    const { name, value, file, type } = e.target;

    if (type == "file") {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result;
        const base64String = base64.split(",")[1];
        setFormValue({
          ...formValue,
          ImageData: base64String,
          guide_image: file.name,
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

  useEffect(() => {
    if (state) {
      setFormValue({
        id: state?.id,
        Name: state?.Name,
        ServiceType: state?.ServiceType,
        Rating: state?.Rating,
        Email: state?.Email,
        Address: state?.Address,
        Phone: "",
        GuideLicense: state?.GuideLicense,
        LicenseExpiry: state?.LicenseExpiry,
        PAN: state?.PAN,
        GST: state?.GST,
        guide_image: state?.guide_image,
        ImageData: "",
        Supplier: state?.Supplier,
        ContactPerson: state?.ContactPerson,
        Designation: state?.Designation,
        Country: state?.CountryId,
        State: state?.StateId,
        City: state?.CityId,
        Pincode: state?.Pincode,
        Remark: state?.Remark,
        Feedback: state?.Feedback,
        Default:
          state?.Default == null || state?.Default == ""
            ? "0"
            : state?.Default?.toString(),
        VaccinationStatus: state?.VaccinationStatus,
        Details: state?.Details,
        Status: state?.Status === "Active" ? "1" : "0",
        AddedBy: state?.AddedBy,
        UpdatedBy: state?.UpdatedBy,
      });
      setLanguageSelected(
        state.Languages != null || state?.Languages != ""
          ? state?.Languages?.map((lang) => lang?.LanguageId)
          : []
      );
      setDestinationSelected(
        state?.Destination?.length > 0
          ? state?.Destination.map((dest) => dest?.["DestinationId"])
          : []
      );

      setPhoneValue({
        MobileNumber: state?.MobileNumber?.toString(),
        WhatsappNumber: state?.WhatsappNumber?.toString(),
        AlternateNumber: state?.AlternateNumber?.toString(),
      });
    }
  }, []);

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header py-3">
            <h4 className="card-title">Add Guide</h4>
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
                <div className="row">
                  <div className="col-12">
                    <div className="row form-row-gap">
                      <div className="col-md-6 col-lg-3">
                        <label className="" htmlFor="status">
                          Service Type
                        </label>
                        <select
                          name="ServiceType"
                          id="status"
                          value={formValue?.ServiceType}
                          onChange={handleFormChange}
                          className="form-control form-control-sm"
                        >
                          <option value="Guide">Guide</option>
                          <option value="Porter">Porter</option>
                          <option value="Tour Manager">Tour Manager</option>
                        </select>
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <div className="d-flex justify-content-between">
                          <label className="" htmlFor="name">
                            Name
                            <span className="text-danger">*</span>
                          </label>
                        </div>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="name"
                          name="Name"
                          value={formValue?.Name}
                          onChange={handleFormChange}
                          placeholder="Name"
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
                        <div className="d-flex justify-content-between">
                          <label className="" htmlFor="mobile_number">
                            Mobile Number
                            <span className="text-danger">*</span>
                          </label>
                        </div>
                        {/* <input
                          type="number"
                          className="form-control form-control-sm"
                          id="mobile_number"
                          name="MobileNumber"
                          value={formValue?.MobileNumber}
                          placeholder="Mobile"
                          onChange={handleFormChange}
                        /> */}
                        <PhoneInput
                          defaultCountry="in"
                          value={phoneValue?.MobileNumber}
                          onChange={(phone) =>
                            handlePhoneChange(phone, "MobileNumber")
                          }
                        />
                        {validationErrors?.MobileNumber && (
                          <div
                            id="val-username1-error"
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {validationErrors?.MobileNumber}
                          </div>
                        )}
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <label className="" htmlFor="val-username">
                          Whatsapp Number
                        </label>
                        {/* <input
                          type="number"
                          className="form-control form-control-sm"
                          id="val-username"
                          name="WhatsappNumber"
                          value={formValue?.WhatsappNumber}
                          placeholder="Whatsapp"
                          onChange={handleFormChange}
                        /> */}
                        <PhoneInput
                          defaultCountry="in"
                          value={phoneValue?.WhatsappNumber}
                          onChange={(phone) =>
                            handlePhoneChange(phone, "WhatsappNumber")
                          }
                        />
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <label className="" htmlFor="val-username">
                          Alternate Number
                        </label>
                        {/* <input
                          type="number"
                          className="form-control form-control-sm"
                          id="val-username"
                          name="AlternateNumber"
                          value={formValue?.AlternateNumber}
                          placeholder="Alternate"
                          onChange={handleFormChange}
                        /> */}
                        <PhoneInput
                          defaultCountry="in"
                          value={phoneValue?.AlternateNumber}
                          onChange={(phone) =>
                            handlePhoneChange(phone, "AlternateNumber")
                          }
                        />
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <label className="" htmlFor="val-username">
                          Email
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="val-username"
                          name="Email"
                          value={formValue?.Email}
                          placeholder="Email"
                          onChange={handleFormChange}
                        />
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <label className="" htmlFor="val-username">
                          Guide License
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="val-username"
                          name="GuideLicense"
                          value={formValue?.GuideLicense}
                          placeholder="Guide License"
                          onChange={handleFormChange}
                        />
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <label className="" htmlFor="val-username">
                          License Expiry
                        </label>
                        <input
                          type="date"
                          className="form-control form-control-sm"
                          id="val-username"
                          name="LicenseExpiry"
                          placeholder="date"
                          value={formValue?.LicenseExpiry}
                          onChange={handleFormChange}
                        />
                      </div>
                      <div className="col-md-6 col-lg-6">
                        <div className="d-flex justify-content-between">
                          <label className="" htmlFor="destination">
                            Destination
                            <span className="text-danger">*</span>
                          </label>
                        </div>
                        <DestinationInput />
                        {validationErrors?.Destination && (
                          <div
                            id="val-username1-error"
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {validationErrors?.Destination}
                          </div>
                        )}
                      </div>
                      <div className="col-md-6 col-lg-6">
                        <label className="" htmlFor="status">
                          Language
                        </label>
                        <LanguageInput />
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <label className="" htmlFor="val-username">
                          Pan No
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="val-username"
                          name="PAN"
                          value={formValue?.PAN}
                          placeholder="Pan"
                          onChange={handleFormChange}
                        />
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <label className="" htmlFor="val-username">
                          GST No
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="val-username"
                          name="GST"
                          value={formValue?.GST}
                          placeholder="GST"
                          onChange={handleFormChange}
                        />
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <label className="" htmlFor="val-username">
                          Guide/Tour Manager Image
                        </label>
                        <input
                          type="file"
                          className="form-control form-control-sm"
                          id="val-username"
                          name="ImageData"
                          onChange={handleFormChange}
                        />
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <label className="" htmlFor="status">
                          Supplier
                        </label>
                        <select
                          name="Supplier"
                          id="status"
                          className="form-control form-control-sm"
                          value={formValue?.Supplier}
                          onChange={handleFormChange}
                        >
                          <option value="1">Yes</option>
                          <option value="0">No</option>
                        </select>
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <label className="" htmlFor="val-username">
                          Contact Person
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="val-username"
                          name="ContactPerson"
                          placeholder="Contact Person"
                          value={formValue?.ContactPerson}
                          onChange={handleFormChange}
                        />
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <label className="" htmlFor="val-username">
                          Designation
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="val-username"
                          name="Designation"
                          value={formValue?.Designation}
                          placeholder="Designation"
                          onChange={handleFormChange}
                        />
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <div className="d-flex justify-content-between">
                          <label className="" htmlFor="country">
                            Country
                            <span className="text-danger">*</span>
                          </label>
                        </div>
                        <select
                          name="Country"
                          id="country"
                          className="form-control form-control-sm"
                          value={formValue?.Country}
                          onChange={handleFormChange}
                        >
                          <option value="">Select</option>
                          {countryList.map((value, index) => {
                            return (
                              <option value={value.id} key={index + 1}>
                                {value.Name}
                              </option>
                            );
                          })}
                        </select>
                        {validationErrors?.Country && (
                          <div
                            id="val-username1-error"
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {validationErrors?.Country}
                          </div>
                        )}
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <label className="" htmlFor="status">
                          State
                        </label>
                        <select
                          name="State"
                          id="status"
                          className="form-control form-control-sm"
                          value={formValue?.State}
                          onChange={handleFormChange}
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
                        <label className="" htmlFor="status">
                          City
                        </label>
                        <select
                          name="City"
                          id="status"
                          className="form-control form-control-sm"
                          value={formValue?.City}
                          onChange={handleFormChange}
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
                        <label className="" htmlFor="val-username">
                          Pin Code
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="val-username"
                          name="Pincode"
                          placeholder="Pin"
                          value={formValue?.Pincode}
                          onChange={handleFormChange}
                        />
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <label className="" htmlFor="val-username">
                          Details
                        </label>
                        <textarea
                          type="text"
                          className="form-control form-control-sm"
                          id="val-username"
                          name="Details"
                          placeholder="Details"
                          value={formValue?.Details}
                          onChange={handleFormChange}
                        ></textarea>
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <label className="" htmlFor="val-username">
                          Address
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="val-username"
                          name="Address"
                          placeholder="Address"
                          value={formValue?.Address}
                          onChange={handleFormChange}
                        />
                      </div>

                      <div className="col-md-6 col-lg-3">
                        <label className="" htmlFor="val-username">
                          Feedback
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="val-username"
                          name="Feedback"
                          placeholder="Feedback"
                          value={formValue?.Feedback}
                          onChange={handleFormChange}
                        />
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <label className="" htmlFor="status">
                          Status <span className="text-danger">*</span>
                        </label>
                        <select
                          name="Status"
                          id="status"
                          className="form-control form-control-sm"
                          value={formValue?.Status}
                          onChange={handleFormChange}
                        >
                          <option value="1">Active</option>
                          <option value="0">Inactive</option>
                        </select>
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <label className="" htmlFor="status">
                          Guide Rating
                        </label>
                        <select
                          name="Rating"
                          id="status"
                          className="form-control form-control-sm"
                          value={formValue?.Rating}
                          onChange={handleFormChange}
                        >
                          <option value="1">1 Star</option>
                          <option value="1.5">1.5 Star</option>
                          <option value="2">2 Star</option>
                          <option value="2.5">2.5 Star</option>
                          <option value="3">3 Star</option>
                          <option value="3.5">3.5 Star</option>
                        </select>
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <label className="" htmlFor="status">
                          Vaccination
                        </label>
                        <select
                          name="VaccinationStatus"
                          id="status"
                          className="form-control form-control-sm"
                          value={formValue?.VaccinationStatus}
                          onChange={handleFormChange}
                        >
                          <option value="1">Yes</option>
                          <option value="0">No</option>
                        </select>
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <label>
                          Default <span className="text-danger">*</span>
                        </label>
                        <div className="d-flex gap-3">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="Default"
                              value="1"
                              id="default_yes"
                              checked={formValue?.Default?.includes("1")}
                              onChange={handleFormChange}
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
                              value="0"
                              id="default_no"
                              checked={formValue?.Default?.includes("0")}
                              onChange={handleFormChange}
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
                        <label className="" htmlFor="val-username">
                          Remark
                        </label>
                        <textarea
                          type="text"
                          className="form-control form-control-sm"
                          id="val-username"
                          name="Remark"
                          placeholder="Remark"
                          value={formValue?.Remark}
                          onChange={handleFormChange}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="row">
              <div className="col-12 d-flex gap-3 justify-content-end">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddGuide;
