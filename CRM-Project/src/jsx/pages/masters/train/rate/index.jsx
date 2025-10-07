import React, { useState, useEffect } from "react";
import { trainRateAddInitialValue } from "../../../masters/masters_initial_value.js";
import { trainRateValidationShema } from "../../../masters/master_validation.js";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { axiosOther } from "../../../../../http/axios_base_url.js";
import "../../../../../scss/main.css";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { notifyError, notifySuccess } from "../../../../../helper/notify.jsx";
import RateList from "./RateList.jsx";

const TrainRate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formValue, setFormValue] = useState(trainRateAddInitialValue);
  const [validationErrors, setValidationErrors] = useState({});
  const [rateInitialList, setRateInitialList] = useState([]);
  const [dataForUpdate, setDataForUpdate] = useState("");
  const [supplierList, setSupplierList] = useState([]);
  const [currencyList, setCurrencyList] = useState([]);
  const [vehicleList, setVehicleList] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [slabList, setSlabList] = useState([]);
  const [mealPlanList, setMealPlanList] = useState([]);
  const [trainClassList, setTrainClassList] = useState([]);
  const { state } = useLocation();

  const getDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("trainratelist", {
        id: id,
      });
      setRateInitialList(data?.DataList);
      setFormValue((pre) => ({ ...pre, SupplierId: 4957 }))
      // setFormValue((pre) => ({ ...pre, SupplierId: supplierList?.data.DataList?.id?.[0] }))
      console.log(supplierList, "sagar")
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDataToServer();
  }, []);

  useEffect(() => {
    const getMessage = localStorage.getItem("success-message");
    if (getMessage != null) {
      notifySuccess(getMessage);
      localStorage.removeItem("success-message");
    }
  }, []);

  // get data from server for dropdown
  // console.log(state,"pleasecheck")
  const postDropdownDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("supplierlist", {
        Name: "",
        id: "",
        SupplierService: [6],
        DestinationId: "",
      });
      // console.log(data,"Data ll");
      setSupplierList(data.DataList);
      // setFormValue((pre) => ({ ...pre, SupplierId: 4957 }))
      // console.log(formValue, "sagar")
    } catch (err) {
      console.log(err);
    }
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
      const { data } = await axiosOther.post("taxmasterlist", {
        Id: "",
        Search: "",
        Status: "",
      });
      setSlabList(data);
    } catch (error) {
      console.log(error);
    }
    try {
      const { data } = await axiosOther.post("trainclasslist", {
        Search: "",
        Status: "",
      });
      setTrainClassList(data?.DataList);
    } catch (error) {
      console.log(error);
    }
    try {
      const { data } = await axiosOther.post("vehicletypemasterlist", {
        Search: "",
        Status: "",
      });
      setVehicleList(data?.DataList);
    } catch (error) {
      console.log(error);
    }

    try {
      const { data } = await axiosOther.post("restaurantmeallist", {
        Search: "",
        Status: "",
      });
      setMealPlanList(data?.DataList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    postDropdownDataToServer();

  }, []);

  const getYearForSeason = () => {
    const currentYear = new Date().getFullYear();
    const tenYearArr = [];

    for (let i = 0; i < 10; i++) {
      tenYearArr.push(currentYear + i);
    }
    return tenYearArr;
  };

  const YearList = getYearForSeason();

  const getFromDate = () => {
    return formValue?.ValidFrom ? new Date(formValue?.ValidFrom) : null;
  };
  const getNextDate = () => {
    return formValue?.ValidTo ? new Date(formValue?.ValidTo) : null;
  };

  const handleNextCalender = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    setFormValue({
      ...formValue,
      ValidTo: formattedDate,
    });
  };

  const handleCalender = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    setFormValue({
      ...formValue,
      ValidFrom: formattedDate,
    });
  };

  const handleReset = () => {
    setIsUpdating(false);
    setFormValue(guideServiceRateInitialValue);
  };

  // submitting data to server
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await trainRateValidationShema.validate(
        {
          ...formValue,
        },
        { abortEarly: false }
      );

      setValidationErrors({});
      const { data } = await axiosOther.post(
        isUpdating ? "updatetrainrate" : "addtrainrate",
        {
          ...formValue,
          TrainId: id,
        }
      );

      if (data?.Status == 1 || data?.status == 1) {
        setIsUpdating(false);
        getDataToServer();
        setFormValue(trainRateAddInitialValue);
        setDataForUpdate("");
        notifySuccess(data?.Message || data?.message);
      }

      if (data?.Status == 0 || data?.status == 0) {
        notifyError(data?.Message || data?.message);
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
        notifyError(data[0][1]);
      }
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // setting data for update
  useEffect(() => {
    if (dataForUpdate != "") {
      console.log(dataForUpdate);
      setFormValue({
        TrainId: id,
        RateUniqueId: dataForUpdate?.UniqueID,
        companyId: dataForUpdate?.companyId,
        SupplierId: dataForUpdate?.SupplierId,
        TrainNumber: dataForUpdate?.TrainNumber,
        JourneyType: dataForUpdate?.JourneyType,
        TrainClassId: dataForUpdate?.TrainClassId,
        Currency: dataForUpdate?.CurrencyId,
        AdultCost: dataForUpdate?.AdultCost,
        ChildCost: dataForUpdate?.ChildCost,
        InfantCost: dataForUpdate?.InfantCost,
        Remarks: dataForUpdate?.Remarks,
        Status: dataForUpdate?.Status,
        AddedBy: dataForUpdate?.AddedBy,
        UpdatedBy: dataForUpdate?.UpdatedBy,
      });
    }
  }, [isUpdating, dataForUpdate]);

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <ToastContainer />
          <div className="card-header py-3">
            <h4 className="m-0 rate-heading-h4">
              {state?.Master}: {state?.Name}{" "}
            </h4>
            <div className="d-flex gap-3 justify-content-end">
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
                <button onClick={handleReset} className="btn btn-dark">
                  Reset
                </button>
              )}
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
                          Supplier Name <span className="text-danger">*</span>
                        </label>
                        <select
                          name="SupplierId"
                          id="status"
                          className="form-control form-control-sm"
                          value={formValue?.SupplierId}
                          onChange={handleFormChange}
                        >
                          <option value="">Select</option>
                          {supplierList?.map((item) => {
                            return (
                              <option value={item?.id} key={item?.id}>
                                {item?.Name}
                              </option>
                            );
                          })}
                        </select>
                        {validationErrors?.SupplierId && (
                          <div
                            id="val-username1-error"
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {validationErrors?.SupplierId}
                          </div>
                        )}
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <label className="" htmlFor="name">
                          Train Number <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="name"
                          name="TrainNumber"
                          value={formValue?.TrainNumber}
                          onChange={handleFormChange}
                          placeholder="Train Number"
                        />
                        {validationErrors?.TrainNumber && (
                          <div
                            id="val-username1-error"
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {validationErrors?.TrainNumber}
                          </div>
                        )}
                      </div>

                      <div className="col-md-6 col-lg-3">
                        <label htmlFor="">
                          Journey Type <span className="text-danger">*</span>
                        </label>
                        <select
                          select
                          name="JourneyType"
                          id="status"
                          className="form-control form-control-sm"
                          value={formValue?.JourneyType}
                          onChange={handleFormChange}
                        >
                          <option value="day_journey">Day Journey</option>
                          <option value="overnigh_journey">
                            Overnight Journey
                          </option>
                        </select>
                        {validationErrors?.JourneyType && (
                          <div
                            id="val-username1-error"
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {validationErrors?.JourneyType}
                          </div>
                        )}
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <label htmlFor="">
                          Train Class <span className="text-danger">*</span>
                        </label>
                        <select
                          select
                          name="TrainClassId"
                          id="status"
                          className="form-control form-control-sm"
                          value={formValue?.TrainClassId}
                          onChange={handleFormChange}
                        >
                          <option value="">Select</option>
                          {trainClassList?.map((item) => {
                            return (
                              <option value={item?.id} key={item?.id}>
                                {item?.Name}
                              </option>
                            );
                          })}
                        </select>
                        {validationErrors?.TrainClassId && (
                          <div
                            id="val-username1-error"
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {validationErrors?.TrainClassId}
                          </div>
                        )}
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <label className="" htmlFor="status">
                          CURRENCY <span className="text-danger">*</span>
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

                      <div className="col-md-6 col-lg-3">

                        <label className="" htmlFor="name">
                          Adult Cost <span className="text-danger">*</span>
                        </label>

                        <input
                          type="number"
                          className="form-control form-control-sm"
                          id="name"
                          name="AdultCost"
                          value={formValue?.AdultCost}
                          onChange={handleFormChange}
                          placeholder="Adult Cost"
                        />
                        {validationErrors?.AdultCost && (
                          <div
                            id="val-username1-error"
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {validationErrors?.AdultCost}
                          </div>
                        )}
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <label className="" htmlFor="name">
                          Child Cost
                        </label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          id="name"
                          name="ChildCost"
                          value={formValue?.ChildCost}
                          onChange={handleFormChange}
                          placeholder="Child Cost"
                        />
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <label className="" htmlFor="name">
                          Infant Cost
                        </label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          id="name"
                          name="InfantCost"
                          value={formValue?.InfantCost}
                          onChange={handleFormChange}
                          placeholder="Infant Cost"
                        />
                      </div>
                      <div className="col-12">
                        <div className="d-flex justify-content-between">
                          <label className="" htmlFor="name">
                            Remarks
                          </label>
                        </div>
                        <textarea
                          className="form-control form-control-sm"
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
            <div className="d-flex gap-3 justify-content-end">
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
                <button onClick={handleReset} className="btn btn-dark">
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

export default TrainRate;
