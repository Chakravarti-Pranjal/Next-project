import React, { useState, useEffect } from "react";
import { taxValidationSchema } from "../master_validation";
import { taxInitialValue } from "../masters_initial_value";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { axiosOther } from "../../../../http/axios_base_url";
import { ToastContainer, toast } from "react-toastify";

const notifyError = (message) => {
  toast.error(`${message}`, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

const Add = () => {
  const [formValue, setFormValue] = useState(taxInitialValue);
  const [validationErrors, setValidationErrors] = useState({});
  const [productList, setProductList] = useState([]);
  const [currencyList, setCurrencyList] = useState([]);
  const [checkServiceType, setCheckServiceType] = useState("");
  const { state } = useLocation();
  const navigate = useNavigate();

  const getDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("listproduct", {
        Search: "",
        Status: 1,
      });
      setProductList(data.Datalist);
    } catch (err) {
      console.log(err);
    }

    try {
      const { data } = await axiosOther.post("currencymasterlist", {
        Status: "Active",
      });
      // console.log(data);
      setCurrencyList(data.DataList);
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
      await taxValidationSchema.validate(
        {
          ...formValue,
        },
        { abortEarly: false }
      );

      setValidationErrors({});
      // console.log("formValue", formValue);
      const { data } = await axiosOther.post("addupdatetax", {
        ...formValue,
      });

      if (data?.Status == 1) {
        navigate("/tax-master-list");
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
        ServiceType: parseInt(state?.ServiceType),
        TaxValue: state?.TaxValue,
        TaxSlabName: state?.TaxSlabName,
        PriceRangeFrom: state?.PriceRangeFrom,
        PriceRangeTo: state?.PriceRangeTo,
        Currency: state?.CurrencyID == null ? "" : state?.CurrencyID,
        SetDefault: state?.SetDefault == "Yes" ? "1" : "0",
        Status: state?.Status == "Active" ? "1" : "0",
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
            <h4 className="card-title">Add Tax</h4>
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
                    <label className="m-0">
                      Service Type <span className="text-danger">*</span>
                    </label>
                    <select
                      name="ServiceType"
                      id=""
                      className="form-control form-control-sm"
                      value={formValue?.ServiceType}
                      onChange={handleInputChange}
                    >
                      <option value="">Select</option>
                      {productList?.map((value, index) => {
                        return (
                          <option value={value.id} key={index + 1}>
                            {value.name}
                          </option>
                        );
                      })}
                    </select>
                    {validationErrors?.ServiceType && (
                      <div
                        id="val-username1-error"
                        className="invalid-feedback animated fadeInUp"
                        style={{ display: "block" }}
                      >
                        {validationErrors?.ServiceType}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6 col-lg-3">
                    <label className="m-0">
                      Currency <span className="text-danger">*</span>
                    </label>
                    <select
                      name="Currency"
                      id=""
                      className="form-control form-control-sm"
                      value={formValue?.Currency}
                      onChange={handleInputChange}
                    >
                      <option value="">Select</option>
                      {currencyList?.map((value, index) => {
                        return (
                          <option value={value.id} key={index + 1}>
                            {value.CurrencyName}
                          </option>
                        );
                      })}
                    </select>

                    {validationErrors?.Currency && (
                      <div
                        id="val-username1-error"
                        className="invalid-feedback animated fadeInUp"
                        style={{ display: "block" }}
                      >
                        {validationErrors?.Currency}
                      </div>
                    )}
                  </div>
                  {formValue?.ServiceType == "12" && (
                    <>
                      <div className="col-md-6 col-lg-3">
                        <label className="m-0">Price Range From</label>
                        <input
                          type="text"
                          placeholder="Price Range From "
                          className="form-control form-control-sm"
                          name="PriceRangeFrom"
                          value={formValue?.PriceRangeFrom}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="col-md-6 col-lg-3">
                        <label className="m-0">Price Range To</label>
                        <input
                          type="text"
                          placeholder="Price Range To "
                          className="form-control form-control-sm"
                          name="PriceRangeTo"
                          value={formValue?.PriceRangeTo}
                          onChange={handleInputChange}
                        />
                      </div>
                    </>
                  )}

                  <div className="col-md-6 col-lg-3">
                    <label className="m-0">TAX Slab Name</label>
                    <input
                      type="text"
                      placeholder="TAX Slab Name "
                      className="form-control form-control-sm"
                      name="TaxSlabName"
                      value={formValue?.TaxSlabName}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-md-6 col-lg-3">
                    <label className="m-0">
                      TAX Value(In %) <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="TAX Value(In %)"
                      className="form-control form-control-sm"
                      name="TaxValue"
                      value={formValue?.TaxValue}
                      onChange={handleInputChange}
                    />
                    {validationErrors?.TaxValue && (
                      <div
                        id="val-username1-error"
                        className="invalid-feedback animated fadeInUp"
                        style={{ display: "block" }}
                      >
                        {validationErrors?.TaxValue}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6 col-lg-3">
                    <label>Set Default</label>
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
                    <label className="m-0">Status</label>
                    <select
                      name="Status"
                      id=""
                      className="form-control form-control-sm"
                      value={formValue?.Status}
                      onChange={handleInputChange}
                    >
                      <option value="1">Active</option>
                      <option value="0">Inactive</option>
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
