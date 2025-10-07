import React, { useState, useEffect } from "react";
import { restaurantRateAddInitialValue } from "../../../masters/masters_initial_value.js";
import { restaurantRateValidationSchema } from "../../../masters/master_validation.js";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { axiosOther } from "../../../../../http/axios_base_url.js";
import "../../../../../scss/main.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { notifyError, notifySuccess } from "../../../../../helper/notify.jsx";
import RateList from "./RateList.jsx";
import { currentDate } from "../../../../../helper/currentDate.js";

const RestaurantRate = () => {
  const { id } = useParams();
  const [formValue, setFormValue] = useState(restaurantRateAddInitialValue);
  const [validationErrors, setValidationErrors] = useState({});
  const [rateInitialList, setRateInitialList] = useState([]);
  const [dataForUpdate, setDataForUpdate] = useState("");
  const [supplierList, setSupplierList] = useState([]);
  const [currencyList, setCurrencyList] = useState([]);
  const [destinationList, setDestinationList] = useState([]);
  const [vehicleList, setVehicleList] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [slabList, setSlabList] = useState([]);
  const [mealPlanList, setMealPlanList] = useState([]);
  const { state } = useLocation();

  const navigate = useNavigate();
  const getDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("restaurantmasterRatelist", {
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

  useEffect(() => {
    const getMessage = localStorage.getItem("success-message");
    if (getMessage != null) {
      notifySuccess(getMessage);
      localStorage.removeItem("success-message");
    }
  }, []);

  const postDropdownDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("supplierlist", {
        Name: "",
        id: "",
        SupplierService: [2],
        DestinationId: [state?.DestinatinoId],
      });
      setSupplierList(data.DataList);
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
      if (data?.DataList?.length > 0) {
        setFormValue((prev) => {
          return {
            ...prev,
            GstSlabId: data?.DataList[0]?.id,
          };
        });
        setSlabList(data);
      }
    } catch (error) {
      console.log(error);
    }
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
    setFormValue(restaurantRateAddInitialValue);
  };

  // submitting data to server
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await restaurantRateValidationSchema.validate(
        {
          ...formValue,
          RestaurantId: id,
        },
        { abortEarly: false }
      );

      setValidationErrors({});
      const { data } = await axiosOther.post(
        isUpdating ? "updaterestaurantrate" : "addrestaurantrate",
        {
          ...formValue,
          RestaurantId: id,
          DestinationID: +state?.destinationId,
        }
      );

      if (data?.Status == 1 || data?.status == 1) {
        setIsUpdating(false);
        getDataToServer();
        setFormValue(restaurantRateAddInitialValue);
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
      setFormValue({
        RestaurantId: id,
        RateUniqueId: dataForUpdate?.UniqueID,
        DestinationID: state?.DestinatinoId,
        SupplierId: dataForUpdate?.SupplierId,
        MealTypeId: dataForUpdate?.MealTypeId,
        Currency: dataForUpdate?.CurrencyId,
        AdultCost: dataForUpdate?.AdultCost,
        ChildCost: dataForUpdate?.ChildCost,
        GstSlabId: dataForUpdate?.GstSlabId,
        Status: dataForUpdate?.Status,
        AddedBy: dataForUpdate?.AddedBy,
        UpdatedBy: dataForUpdate?.UpdatedBy,
        AddedDate: dataForUpdate?.AddedDate,
        UpdatedDate: currentDate(),
      });
    }
  }, [isUpdating, dataForUpdate]);

  useEffect(() => {
    const taxItem = slabList?.DataList?.find(
      (list) => list?.id == formValue?.GstSlabId
    );
    if (taxItem) {
      setFormValue((prev) => {
        return {
          ...prev,
          Currency: taxItem?.CurrencyID,
        };
      });
    } else {
      setFormValue((prev) => {
        return {
          ...prev,
          Currency: "",
        };
      });
    }
  }, [formValue?.GstSlabId]);

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <ToastContainer />
          <div className="card-header py-3 justify-content-between d-flex">
            <h4 className="m-0 rate-heading-h4">
              {state?.Master}: {state?.Name} , {state?.Destination}
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
                      <div className="col-md-6 col-lg-1">
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
                      <div className="col-md-6 col-lg-2">
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

                      <div className="col-md-6 col-lg-1">
                        <label htmlFor="">
                          Meal List <span className="text-danger">*</span>
                        </label>
                        <select
                          select
                          name="MealTypeId"
                          id="status"
                          className="form-control form-control-sm"
                          value={formValue?.MealTypeId}
                          onChange={handleFormChange}
                        >
                          <option value="">Select</option>
                          {mealPlanList?.map((item) => {
                            return (
                              <option value={item?.id} key={item?.id}>
                                {item?.Name}
                              </option>
                            );
                          })}
                        </select>
                        {validationErrors?.MealTypeId && (
                          <div
                            id="val-username1-error"
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {validationErrors?.MealTypeId}
                          </div>
                        )}
                      </div>
                      <div className="col-md-6 col-lg-2">
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
                      <div className="col-md-6 col-lg-2">
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
                      <div className="col-md-6 col-lg-1">
                        <label htmlFor="">
                          Tax Slab(%) <span className="text-danger">*</span>
                        </label>
                        <select
                          select
                          name="GstSlabId"
                          id="status"
                          className="form-control form-control-sm"
                          value={formValue?.GstSlabId}
                          onChange={handleFormChange}
                        >
                          <option value="">Select</option>
                          {slabList?.DataList?.map((item) => {
                            return (
                              <option value={item?.id} key={item?.id}>
                                {item?.TaxSlabName} ({item?.TaxValue})
                              </option>
                            );
                          })}
                        </select>
                        {validationErrors?.GstSlabId && (
                          <div
                            id="val-username1-error"
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {validationErrors?.GstSlabId}
                          </div>
                        )}
                      </div>
                      <div className="col-md-6 col-lg-1">
                        <label className="" htmlFor="status">
                          Status
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
            <div className="d-flex gap-3 justify-content-end ">
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

export default RestaurantRate;
