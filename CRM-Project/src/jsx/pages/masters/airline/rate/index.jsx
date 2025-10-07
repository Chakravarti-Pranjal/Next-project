import React, { useState, useEffect } from "react";
import { airlineRateAddInitialValue } from "../../../masters/masters_initial_value.js";
import { airlineRateValidationSchema } from "../../../masters/master_validation.js";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { axiosOther } from "../../../../../http/axios_base_url.js";
import "../../../../../scss/main.css";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  notifyHotError,
  notifyHotSuccess,
} from "../../../../../helper/notify.jsx";
import RateList from "./RateList.jsx";
import { currentDate } from "../../../../../helper/currentDate.js";
import { error } from "toastr";

const AirlineRate = () => {
  const { id } = useParams();
  const [formValue, setFormValue] = useState(airlineRateAddInitialValue);
  const [validationErrors, setValidationErrors] = useState({});
  const [rateInitialList, setRateInitialList] = useState([]);
  const [dataForUpdate, setDataForUpdate] = useState("");
  const [currencyList, setCurrencyList] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [flightClassList, setFlightClassList] = useState([]);
  const { state } = useLocation();
  // console.log(state, "state")
  const navigate = useNavigate();

  const getDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("airlineRateList", {
        id: id,
      });
      setRateInitialList(data?.DataList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDataToServer();
  }, []);

  // get data from server for dropdown
  const postDropdownDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("currencymasterlist", {
        id: "",
        Name: "",
        Status: "",
      });
      setCurrencyList(data?.DataList);
    } catch (error) {
      console.log(error);
    }

    try {
      const { data } = await axiosOther.post("flightclasslist", {
        Search: "",
        Status: "",
      });
      setFlightClassList(data?.DataList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    postDropdownDataToServer();
  }, []);

  const handleReset = () => {
    setIsUpdating(false);
    setFormValue(airlineRateAddInitialValue);
  };

  // submitting data to server
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await airlineRateValidationSchema.validate(
        {
          ...formValue,
        },
        { abortEarly: false }
      );

      setValidationErrors({});
      const { data } = await axiosOther.post(
        isUpdating ? "updateairlineratejson" : "addupdateairlinerate",
        {
          ...formValue,
          id: id,
        }
      );

      if (data?.Status == 1 || data?.status == 1) {
        setIsUpdating(false);
        getDataToServer();
        setFormValue(airlineRateAddInitialValue);
        setDataForUpdate("");
        notifyHotSuccess(data?.Message || data?.message);
      }

      if (data?.Status == 0 || data?.status == 0) {
        notifyHotError(data?.Message || data?.message);
      }
    } catch (error) {
      if (error.inner) {
        const errorMessages = error.inner.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {});
        setValidationErrors(errorMessages);
      }
      if (error.response?.data?.Errors) {
        const data = Object.entries(error.response?.data?.Errors);
        notifyHotError(data[0][1]);
      }
      console.log("error", error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (
      name.startsWith("AdultCost") ||
      name.startsWith("ChildCost") ||
      name.startsWith("InfantCost")
    ) {
      const [costType, key] = name.split(".");
      setFormValue({
        ...formValue,
        [costType]: { ...formValue[costType], [key]: parseFloat(value) || 0 },
      });
    } else {
      setFormValue({ ...formValue, [name]: value });
    }
  };

  // setting data for update
  useEffect(() => {
    if (dataForUpdate != "") {
      console.log(dataForUpdate, "dataForUpdate");
      setIsUpdating(true);
      setFormValue({
        id: id,
        RateUniqueId: dataForUpdate?.UniqueID,
        FlightNumber: dataForUpdate?.FlightNumber,
        FlightClass: dataForUpdate?.FlightClassId,
        Currency: dataForUpdate?.CurrencyId,
        CompanyId: dataForUpdate?.CompanyId,
        AdultCost: {
          base_fare: parseInt(dataForUpdate?.AdultCost?.base_fare),
          airline_tax: parseInt(dataForUpdate?.AdultCost?.airline_tax),
        },
        ChildCost: {
          base_fare: parseInt(dataForUpdate?.ChildCost?.base_fare),
          airline_tax: parseInt(dataForUpdate?.ChildCost?.airline_tax),
        },
        InfantCost: {
          base_fare: parseInt(dataForUpdate?.InfantCost?.base_fare),
          airline_tax: parseInt(dataForUpdate?.InfantCost?.airline_tax),
        },
        BaggageAllowance: dataForUpdate?.BaggageAllowance,
        CancallationPolicy: dataForUpdate?.CancellationPolicy,

        Remarks: dataForUpdate?.Remarks,
        Status: dataForUpdate?.Status,
        AddedBy: dataForUpdate?.AddedBy,
        UpdatedBy: dataForUpdate?.UpdatedBy,
        AddedDate: dataForUpdate?.AddedDate,
        UpdatedDate: currentDate(),
      });
    }
  }, [dataForUpdate]);

  // console.log(formValue, "formValue");

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <ToastContainer />
          <div className="card-header py-3 d-flex justify-content-between ">
            <h4 className="m-0 rate-heading-h4">Airline: {state?.Name} </h4>
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
              {isUpdating && (
                <button
                  onClick={handleReset}
                  className="btn btn-dark btn-custom-size"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
          <div className="card-body mt-1">
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
                      <div className="col-md-6 col-lg-4">
                        <label className="" htmlFor="name">
                          Flight Number <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="name"
                          name="FlightNumber"
                          value={formValue?.FlightNumber}
                          onChange={handleFormChange}
                          placeholder="Flight Number"
                        />
                        {validationErrors?.FlightNumber && (
                          <div
                            id="val-username1-error"
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {validationErrors?.FlightNumber}
                          </div>
                        )}
                      </div>
                      <div className="col-md-6 col-lg-4">
                        <label htmlFor="">
                          Flight Class <span className="text-danger">*</span>
                        </label>
                        <select
                          select
                          name="FlightClass"
                          id="status"
                          className="form-control form-control-sm"
                          value={formValue?.FlightClass}
                          onChange={handleFormChange}
                        >
                          <option value="">Select</option>
                          {flightClassList?.map((item) => {
                            return (
                              <option value={item?.id} key={item?.id}>
                                {item?.Name}
                              </option>
                            );
                          })}
                        </select>
                        {validationErrors?.FlightClass && (
                          <div
                            id="val-username1-error"
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {validationErrors?.FlightClass}
                          </div>
                        )}
                      </div>
                      <div className="col-md-6 col-lg-4">
                        <label className="" htmlFor="status">
                          Currency <span className="text-danger">*</span>
                        </label>
                        <select
                          name="Currency"
                          id="status"
                          className="form-control form-control-sm"
                          value={formValue?.Currency}
                          onChange={handleFormChange}
                        >
                          <option value="">Select</option>
                          {currencyList?.map((item) => {
                            return (
                              <option value={item?.id} key={item?.id}>
                                {item?.CurrencyName}
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
                      <div className="col-12 col-md-6 mt-1">
                        <div className="custom-border p-3 rounded-2 position-relative">
                          <span className="position-absolute form-label-position bg-label-border px-1">
                            Adult Cost
                          </span>
                          <div className="row">
                            <div className="col-4">
                              <div className="d-flex justify-content-between">
                                <label className="m-0" htmlFor="name">
                                  Base Fare
                                  <span className="text-danger">*</span>
                                </label>
                              </div>
                              <input
                                type="number"
                                className="form-control form-control-sm"
                                id="name"
                                name="AdultCost.base_fare"
                                value={formValue?.AdultCost?.base_fare}
                                onChange={handleFormChange}
                                placeholder="Base Fare"
                              />
                              {validationErrors?.AdultCost?.base_fare && (
                                <div
                                  id="val-username1-error"
                                  className="invalid-feedback animated fadeInUp"
                                  style={{ display: "block" }}
                                >
                                  {validationErrors?.AdultCost?.base_fare}
                                </div>
                              )}
                            </div>
                            <div className="col-4">
                              <div className="d-flex justify-content-between">
                                <label className="m-0" htmlFor="name">
                                  Airline Tax
                                </label>
                              </div>
                              <input
                                type="number"
                                className="form-control form-control-sm"
                                id="name"
                                name="AdultCost.airline_tax"
                                value={formValue?.AdultCost?.airline_tax}
                                onChange={handleFormChange}
                                placeholder="Tax"
                              />
                            </div>
                            <div className="col-4">
                              <div className="d-flex justify-content-between">
                                <label className="m-0" htmlFor="name">
                                  Total Cost
                                </label>
                              </div>
                              <input
                                type="number"
                                className="form-control form-control-sm"
                                id="name"
                                value={
                                  parseInt(formValue?.AdultCost?.base_fare) +
                                  parseInt(formValue?.AdultCost?.airline_tax)
                                }
                                onChange={handleFormChange}
                                placeholder="Total Cost"
                                readOnly
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-md-6 mt-1">
                        <div className="custom-border p-3 rounded-2 position-relative">
                          <span className="position-absolute form-label-position bg-label-border px-1">
                            Child Cost
                          </span>
                          <div className="row">
                            <div className="col-4">
                              <div className="d-flex justify-content-between">
                                <label className="m-0" htmlFor="name">
                                  Base Fare
                                </label>
                              </div>
                              <input
                                type="number"
                                className="form-control form-control-sm"
                                id="name"
                                name="ChildCost.base_fare"
                                value={formValue?.ChildCost?.base_fare}
                                onChange={handleFormChange}
                                placeholder="Base Fare"
                              />
                            </div>
                            <div className="col-4">
                              <div className="d-flex justify-content-between">
                                <label className="m-0" htmlFor="name">
                                  Airline Tax
                                </label>
                              </div>
                              <input
                                type="number"
                                className="form-control form-control-sm"
                                id="name"
                                name="ChildCost.airline_tax"
                                value={formValue?.ChildCost.airline_tax}
                                onChange={handleFormChange}
                                placeholder="Tax"
                              />
                            </div>
                            <div className="col-4">
                              <div className="d-flex justify-content-between">
                                <label className="m-0" htmlFor="name">
                                  Total Cost
                                </label>
                              </div>
                              <input
                                type="number"
                                className="form-control form-control-sm"
                                id="name"
                                name="InfantCost"
                                value={
                                  parseInt(formValue?.ChildCost?.base_fare) +
                                  parseInt(formValue?.ChildCost?.airline_tax)
                                }
                                placeholder="Total Cost"
                                readOnly
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-md-6 mt-1">
                        <div className="custom-border p-3 rounded-2 position-relative">
                          <span className="position-absolute form-label-position bg-label-border px-1">
                            Infant Cost
                          </span>
                          <div className="row">
                            <div className="col-4">
                              <div className="d-flex justify-content-between">
                                <label className="m-0" htmlFor="name">
                                  Base Fare
                                </label>
                              </div>
                              <input
                                type="number"
                                className="form-control form-control-sm"
                                id="name"
                                name="InfantCost.base_fare"
                                value={formValue?.InfantCost?.base_fare}
                                onChange={handleFormChange}
                                placeholder="Base Fare"
                              />
                            </div>
                            <div className="col-4">
                              <div className="d-flex justify-content-between">
                                <label className="m-0" htmlFor="name">
                                  Airline Tax
                                </label>
                              </div>
                              <input
                                type="number"
                                className="form-control form-control-sm"
                                id="name"
                                name="InfantCost.airline_tax"
                                value={formValue?.InfantCost?.airline_tax}
                                onChange={handleFormChange}
                                placeholder="Tax"
                              />
                            </div>
                            <div className="col-4">
                              <div className="d-flex justify-content-between">
                                <label className="m-0" htmlFor="name">
                                  Total Cost
                                </label>
                              </div>
                              <input
                                type="number"
                                className="form-control form-control-sm"
                                id="name"
                                name="InfantCost"
                                value={
                                  parseInt(formValue?.InfantCost?.base_fare) +
                                  parseInt(formValue?.InfantCost?.airline_tax)
                                }
                                placeholder="Total Cost"
                                readOnly
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="d-flex justify-content-between">
                          <label className="m-0" htmlFor="name">
                            Baggage Allowence
                          </label>
                        </div>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          id="name"
                          name="BaggageAllowance"
                          value={formValue?.BaggageAllowance}
                          placeholder="Baggage Allowence"
                          onChange={handleFormChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex justify-content-between">
                          <label className="m-0" htmlFor="name">
                            Cancellation Policy
                          </label>
                        </div>
                        <textarea
                          className="form-control form-control-sm p-2"
                          id="name"
                          name="CancallationPolicy"
                          value={formValue?.CancallationPolicy}
                          onChange={handleFormChange}
                          placeholder="Policy"
                        />
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex justify-content-between">
                          <label className="m-0" htmlFor="name">
                            Remarks
                          </label>
                        </div>
                        <textarea
                          className="form-control form-control-sm p-2"
                          id="name"
                          name="Remarks"
                          value={formValue?.Remarks}
                          onChange={handleFormChange}
                          placeholder="Remarks"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
              <RateList
                setDataUpdate={setDataForUpdate}
                setIsUpdating={setIsUpdating}
                rateInitialList={rateInitialList}
                rateList={getDataToServer}
              />
            </div>
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
              {isUpdating && (
                <button
                  onClick={handleReset}
                  className="btn btn-dark btn-custom-size"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirlineRate;
