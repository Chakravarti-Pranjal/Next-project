import React, { useState, useEffect } from "react";
import { currencyValidationSchema } from "../master_validation";
import { currencyInitialValue } from "../masters_initial_value";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { axiosOther } from "../../../../http/axios_base_url";
import { ToastContainer, toast } from "react-toastify";

const Add = () => {
  const [formValue, setFormValue] = useState(currencyInitialValue);
  const [validationErrors, setValidationErrors] = useState({});
  const [countryList, setCountryList] = useState([]);

  const { state } = useLocation();
  const navigate = useNavigate();

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
  };
  useEffect(() => {
    getDataToServer();
  }, []);

  // submitting data to server
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await currencyValidationSchema.validate(
        {
          ...formValue,
        },
        { abortEarly: false }
      );

      setValidationErrors({});
      const { data } = await axiosOther.post("addupdatecurrencymaster", {
        ...formValue,
      });

      if (data?.Status == 1) {
        navigate("/currency-list");
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

      console.log("error", error);
    }
  };

  // handlign form changes
  const handleInputChange = (e) => {
    const { name, value, files, type } = e.target;

    if (type == "file") {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result;
        const base64String = base64.split(",")[1];
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
      setFormValue({
        id: state?.id,
        CountryId: parseInt(state?.CountryId),
        CountryCode: state?.CountryCode,
        Name: state?.CurrencyName,
        ConversionRate: state?.ConversionRate,
        SetDefault: state?.SetDefault == "Yes" ? "1" : "0",
        Status: state?.Status,
        AddedBy: state?.AddedBy,
        UpdatedBy: state?.UpdatedBy,
      });
    }
  }, [state]);

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header py-3">
            <h4 className="card-title">Add Currency</h4>
            <div className="d-flex gap-3">
              <ToastContainer />
              <button
                className="btn btn-dark btn-custom-size"
                name="SaveButton"
                onClick={() => navigate(-1)}
              >
                <span className="me-1">Back</span>
                <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
              </button>
              <button onClick={handleSubmit} className="btn btn-primary btn-custom-size">
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
                    <label className="m-0">Country</label>
                    <select
                      name="CountryId"
                      id=""
                      className="form-control form-control-sm"
                      value={formValue?.CountryId}
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
                    <label className="m-0">
                      Currency Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Currency Name"
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
                    <label className="m-0">
                      Currency Code <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Currency Code"
                      className="form-control form-control-sm"
                      name="CountryCode"
                      value={formValue?.CountryCode}
                      onChange={handleInputChange}
                    />
                    {validationErrors?.CountryCode && (
                      <div
                        id="val-username1-error"
                        className="invalid-feedback animated fadeInUp"
                        style={{ display: "block" }}
                      >
                        {validationErrors?.CountryCode}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6 col-lg-3">
                    <label>Default</label>
                    <div className="d-flex gap-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="SetDefault"
                          value="1"
                          id="default_yes"
                          checked={formValue?.SetDefault.includes("1")}
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
                          name="SetDefault"
                          value="0"
                          id="default_no"
                          checked={formValue?.SetDefault.includes("0")}
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
                    <label className="m-0">
                      Rate of Exchange <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Rate of Exchange"
                      className="form-control form-control-sm"
                      name="ConversionRate"
                      value={formValue?.ConversionRate}
                      onChange={handleInputChange}
                    />
                    {validationErrors?.ConversionRate && (
                      <div
                        id="val-username1-error"
                        className="invalid-feedback animated fadeInUp"
                        style={{ display: "block" }}
                      >
                        {validationErrors?.ConversionRate}
                      </div>
                    )}
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
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add;
