import React, { useState, useEffect } from "react";
import { bankValidationSchema } from "../master_validation";
import { bankInitialValue } from "../masters_initial_value";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { axiosOther } from "../../../../http/axios_base_url";
import { ToastContainer, toast } from "react-toastify";
import { notifyError, notifySuccess } from "../../../../helper/notify";
const Add = () => {
  const [formValue, setFormValue] = useState(bankInitialValue);
  const [validationErrors, setValidationErrors] = useState({});
  const [productList, setProductList] = useState([]);
  const [currencyList, setCurrencyList] = useState([]);
  const [checkServiceType, setCheckServiceType] = useState("");
  const { state } = useLocation();
  const navigate = useNavigate();

  const getDataToServer = async () => {
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
      await bankValidationSchema.validate(
        {
          ...formValue,
        },
        { abortEarly: false }
      );

      setValidationErrors({});
      //  console.log("formValue", formValue);
      const { data } = await axiosOther.post("addupdatebank", {
        ...formValue,
      });
      //  console.log("Da", data);
      if (data?.Status == 1 || data?.status == 1) {
        navigate("/bank-list");
        localStorage.setItem("success-message", data?.Message || data?.message);
      }
      if (data?.Status != 1) {
        notifyError(data?.message || data?.Message);
      }
    } catch (error) {
      console.log("error", error);
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
        UpiId: state?.UpiId,
        BankName: state?.BankName,
        purpose: state?.purpose,
        AccountNumber: state?.AccountNumber,
        BranchAddress: state?.BranchAddress,
        AccountType: state?.AccountType,
        BeneficiaryName: state?.BeneficiaryName,
        BranchIfsc: state?.BranchIfsc,
        BranchSwiftCode: state?.BranchSwiftCode,
        ShowHide: state?.ShowHide,
        currencyid: state?.currencyid == null ? "" : state?.currencyid,
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
                      Currency Type<span className="text-danger">*</span>
                    </label>
                    <select
                      name="currencyid"
                      id=""
                      className="form-control form-control-sm"
                      value={formValue?.currencyid}
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

                    {validationErrors?.currencyid && (
                      <div
                        id="val-username1-error"
                        className="invalid-feedback animated fadeInUp"
                        style={{ display: "block" }}
                      >
                        {validationErrors?.currencyid}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6 col-lg-3">
                    <label className="m-0">
                      Account Type<span className="text-danger">*</span>
                    </label>
                    <select
                      name="AccountType"
                      id=""
                      className="form-control form-control-sm"
                      value={formValue?.AccountType}
                      onChange={handleInputChange}
                    >
                      <option value="">Select</option>
                      <option value="Saving" key={2}>
                        Saving
                      </option>
                      <option value="Current" key={1}>
                        Current
                      </option>
                    </select>

                    {validationErrors?.AccountType && (
                      <div
                        id="val-username1-error"
                        className="invalid-feedback animated fadeInUp"
                        style={{ display: "block" }}
                      >
                        {validationErrors?.AccountType}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6 col-lg-3">
                    <label className="m-0">
                      Bank Name<span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Bank Name "
                      className="form-control form-control-sm"
                      name="BankName"
                      value={formValue?.BankName}
                      onChange={handleInputChange}
                    />
                    {validationErrors?.BankName && (
                      <div
                        id="val-username1-error"
                        className="invalid-feedback animated fadeInUp"
                        style={{ display: "block" }}
                      >
                        {validationErrors?.BankName}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6 col-lg-3">
                    <label className="m-0">
                      Beneficiary Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Beneficiary Name"
                      className="form-control form-control-sm"
                      name="BeneficiaryName"
                      value={formValue?.BeneficiaryName}
                      onChange={handleInputChange}
                    />
                    {validationErrors?.BeneficiaryName && (
                      <div
                        id="val-username1-error"
                        className="invalid-feedback animated fadeInUp"
                        style={{ display: "block" }}
                      >
                        {validationErrors?.BeneficiaryName}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6 col-lg-3">
                    <label className="m-0">
                      Account Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      placeholder="Enter Account Number"
                      className="form-control form-control-sm"
                      name="AccountNumber"
                      value={formValue?.AccountNumber}
                      onChange={handleInputChange}
                    />
                    {validationErrors?.AccountNumber && (
                      <div
                        id="val-username1-error"
                        className="invalid-feedback animated fadeInUp"
                        style={{ display: "block" }}
                      >
                        {validationErrors?.AccountNumber}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6 col-lg-3">
                    <label className="m-0">
                      Branch IFSC <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Branch IFSC code"
                      className="form-control form-control-sm"
                      name="BranchIfsc"
                      value={formValue?.BranchIfsc}
                      onChange={handleInputChange}
                    />
                    {validationErrors?.BranchIfsc && (
                      <div
                        id="val-username1-error"
                        className="invalid-feedback animated fadeInUp"
                        style={{ display: "block" }}
                      >
                        {validationErrors?.BranchIfsc}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6 col-lg-3">
                    <label className="m-0">
                      Branch Address <span className="text-danger">*</span>
                    </label>

                    <textarea
                      placeholder="Enter Branch Address"
                      className="form-control form-control-sm"
                      name="BranchAddress"
                      value={formValue?.BranchAddress}
                      onChange={handleInputChange}
                    />
                    {validationErrors?.BranchAddress && (
                      <div
                        id="val-username1-error"
                        className="invalid-feedback animated fadeInUp"
                        style={{ display: "block" }}
                      >
                        {validationErrors?.BranchAddress}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6 col-lg-3">
                    <label className="m-0">
                      Branch Swift Code <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Branch Swift code"
                      className="form-control form-control-sm"
                      name="BranchSwiftCode"
                      value={formValue?.BranchSwiftCode}
                      onChange={handleInputChange}
                    />
                    {validationErrors?.BranchSwiftCode && (
                      <div
                        id="val-username1-error"
                        className="invalid-feedback animated fadeInUp"
                        style={{ display: "block" }}
                      >
                        {validationErrors?.BranchSwiftCode}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6 col-lg-3">
                    <label className="m-0">Purpose of Remittance </label>
                    <input
                      type="text"
                      placeholder="Enter Purpose of Remittance"
                      className="form-control form-control-sm"
                      name="purpose"
                      value={formValue?.purpose}
                      onChange={handleInputChange}
                    />
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
