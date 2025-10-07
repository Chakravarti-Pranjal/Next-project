import React, { useState, useEffect } from "react";
import { activityRateInitialValue } from "../../../masters/masters_initial_value.js";
import { activityRateValidationSchema } from "../../../masters/master_validation.js";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { axiosOther } from "../../../../../http/axios_base_url.js";
import "../../../../../scss/main.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { notifyError, notifySuccess } from "../../../../../helper/notify.jsx";
import RateList from "./RateList.jsx";

const serviceInitial = {
  UpToPax: "",
  Rounds: "",
  Class: "",
  Duration: "",
  Amount: "",
  Remarks: "",
};

const ActivityRate = () => {
  const { id } = useParams();
  const [formValue, setFormValue] = useState(activityRateInitialValue);
  const [rateFormValue, setRateFormValue] = useState(activityRateInitialValue);
  const [validationErrors, setValidationErrors] = useState({});
  const [rateInitialList, setRateInitialList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [rateValidation, setRateValidation] = useState({});
  const [currencyList, setCurrencyList] = useState([]);
  const [serviceCostForm, setServiceCostForm] = useState([serviceInitial]);
  const [guideMasterList, setGuideMasterList] = useState([]);
  const [slabList, setSlabList] = useState([]);
  const [paxRangeList, setPaxRangeList] = useState([]);
  const [dataForUpdate, setDataForUpdate] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const { state } = useLocation();
  // console.log(state, "state");
  const navigate = useNavigate();

  // console.log(serviceCostForm);

  const getDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("activityratelist", {
        id: id,
      });
      setRateInitialList(data?.data);
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
  const postDropdownDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("supplierlist", {
        Name: "",
        id: "",
        SupplierService: [3],
        DestinationId: [state?.DestinationId],
      });
      setSupplierList(data.DataList);
      if (data.DataList && data.DataList.length > 0) {
        setRateFormValue((prev) => ({
          ...prev,
          SupplierId: data.DataList[0].id,
        }));
      }
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

      const defaultCurrency = data?.DataList?.find(
        (item) => item.CurrencyName === "INR"
      );
      if (defaultCurrency) {
        setRateFormValue((prev) => ({
          ...prev,
          CurrencyId: defaultCurrency.id,
        }));
      }
    } catch (error) {
      console.log(error);
    }

    try {
      const { data } = await axiosOther.post("taxmasterlist", {
        Id: "",
        Search: "",
        Status: "",
        ServiceType: "3",
      });
      setSlabList(data);

      // Set default TaxSlabId to the 0th index if the list is not empty
      if (data.DataList && data.DataList.length > 0) {
        setRateFormValue((prev) => ({
          ...prev,
          TaxSlabId: data.DataList[0].id,
        }));
      }
    } catch (error) {
      console.log(error);
    }

    try {
      const { data } = await axiosOther.post("tourescortmasterlist", {
        Search: "",
        Status: "",
      });
      setGuideMasterList(data?.DataList);
    } catch (error) {
      console.log(error);
    }

    try {
      const { data } = await axiosOther.post("pax-range-list", {
        Search: "",
        Status: "",
      });
      setPaxRangeList(data?.DataList);
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
    return rateFormValue?.ValidFrom ? new Date(rateFormValue?.ValidFrom) : null;
  };
  const getNextDate = () => {
    return rateFormValue?.ValidTo ? new Date(rateFormValue?.ValidTo) : null;
  };

  const handleNextCalender = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    setRateFormValue({
      ...rateFormValue,
      ValidTo: formattedDate,
    });
  };
  const handleCalender = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    setRateFormValue({
      ...rateFormValue,
      ValidFrom: formattedDate,
    });
    // console.log(formattedDate, "formattedDate");
  };

  // submitting data to server
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await activityRateValidationSchema.validate(
        {
          ...rateFormValue,
          ActivityId: id,
          Service: state?.Name,
        },
        { abortEarly: false }
      );

      setRateValidation({});
      const { data } = await axiosOther.post(
        isUpdating ? "updateactivityrate" : "addactivityrate",
        {
          ...rateFormValue,
          ActivityId: id,
          DestinationID: +state?.DestinationId,
          Service: state?.Name,
          ServiceCost: serviceCostForm,
        }
      );

      if (data?.Status == 1 || data?.status == 1) {
        setIsUpdating(false);
        getDataToServer();
        setRateFormValue(activityRateInitialValue);
        setServiceCostForm([{ ...serviceInitial }]);
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
        alert(data[0][1]);
      }

      console.log("error", error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, file, type } = e.target;
    setFormValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // console.log("rate", rateInitialList);

  // console.log("activity", dataForUpdate);

  // setting data for update
  useEffect(() => {
    if (dataForUpdate != "") {
      // console.log("dataForUpdate", dataForUpdate);

      setRateFormValue({
        ActivityId: id,
        RateUniqueId: dataForUpdate?.RateUniqueId,
        DestinationID: state?.DestinatinoId, // Typo: "DestinatinoId" should be "DestinationId"?
        SupplierId: dataForUpdate?.SupplierId,
        Service: state?.Name,
        ValidFrom: dataForUpdate?.ValidFrom,
        ValidTo: dataForUpdate?.ValidTo,
        CurrencyId: dataForUpdate?.CurrencyId,
        PaxRange: dataForUpdate?.PaxRange,
        PaxCost: dataForUpdate?.PaxCost,
        TotalCost: dataForUpdate?.TotalCost,
        TaxSlabId: dataForUpdate?.TaxSlabId,
        UpToPax: dataForUpdate?.UpToPax,
        Rounds: dataForUpdate?.Rounds,
        Class: dataForUpdate?.ServiceCost?.Class, // Might need to remove this if ServiceCost is an array
        Duration: dataForUpdate?.ServiceCost?.Duration,
        Amount: dataForUpdate?.ServiceCost?.Amount,
        Remarks: dataForUpdate?.ServiceCost?.Remarks,
        CompanyId: dataForUpdate?.CurrencyId,
        ChildCost: dataForUpdate?.ChildCost,
        Status: dataForUpdate?.Status,
        AddedBy: dataForUpdate?.AddedBy,
        UpdatedBy: dataForUpdate?.UpdatedBy,
        AddedDate: dataForUpdate?.AddedDate,
        UpdatedDate: dataForUpdate?.UpdatedDate,
      });

      // Ensure ServiceCost is an array before mapping
      let ServiceCosts = Array.isArray(dataForUpdate?.ServiceCost)
        ? dataForUpdate.ServiceCost.map((desc) => ({
          UpToPax: desc?.UpToPax,
          Rounds: desc?.Rounds,
          Class: desc?.Class,
          Amount: desc?.Amount,
          Duration: desc?.Duration,
          Remarks: desc?.Remarks,
        }))
        : [];

      // Set the corrected array to state
      setServiceCostForm(ServiceCosts);
    }
  }, [isUpdating, dataForUpdate]);

  // console.log("hhhhh");

  useEffect(() => {
    const perPaxCost = formValue?.TotalCost / formValue?.PaxRange;
    setFormValue({ ...formValue, PaxCost: perPaxCost });
  }, [formValue?.PaxRange, formValue?.TotalCost]);
  const handleServiceCostForm = (e, index) => {
    const { name, value } = e.target;
    setServiceCostForm((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = { ...newArr[index], [name]: value };
      return newArr;
    });
  };

  const handleServiceIncrement = () => {
    setServiceCostForm((prevArr) => {
      let newForm = [...prevArr];
      newForm = [...newForm, serviceInitial];
      return newForm;
    });
  };

  const handleServiceDecrement = (ind) => {
    if (serviceCostForm?.length > 1) {
      const refForm = [...serviceCostForm];
      const filteredForm = refForm?.filter((_, index) => index != ind);
      setServiceCostForm(filteredForm);
    }
  };

  const handleRateFormChange = (e) => {
    const { name, value, file, type } = e.target;
    setRateFormValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // const handleCalender = (date) => {
  //   const formattedDate = date.toISOString().split("T")[0];
  //   setRateFormValue({
  //     ...rateFormValue,
  //     ValidFrom: formattedDate,
  //   });
  // };

  useEffect(() => {
    if (supplierList?.length > 0 && !rateFormValue?.SupplierId) {
      setRateFormValue((prev) => ({
        ...prev,
        SupplierId: supplierList[0].id, // Set first supplier as default
      }));
    }
  }, [supplierList]); // Runs when supplierList changes
  const handleReset = () => {
    setIsUpdating(false);
    setRateFormValue(activityRateInitialValue);
    setServiceCostForm([serviceInitial]);
  };

  useEffect(() => {
    const taxItem = slabList?.DataList?.find(
      (list) => list?.id == rateFormValue?.GstSlabid
    );
    if (taxItem) {
      setRateFormValue((prev) => {
        return {
          ...prev,
          Currency: taxItem?.CurrencyID,
        };
      });
    } else {
      setRateFormValue((prev) => {
        return {
          ...prev,
          Currency: "",
        };
      });
    }
  }, [rateFormValue?.GstSlabid]);

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
                Save <strong className="">And</strong> New
              </button>
              <button
                onClick={handleReset}
                className="btn btn-dark btn-custom-size"
              >
                <span className="me-1">Reset</span>
                <i className="fa-solid fa-refresh text-dark bg-white p-1 rounded"></i>
              </button>
              <button
                onClick={handleSubmit}
                className="btn btn-primary btn-custom-size"
              >
                Submit
              </button>

              {/* {isUpdating && (
                <button onClick={handleReset} className="btn btn-primary btn-custom-size">
                  Reset
                </button>
              )} */}
            </div>
          </div>
          {/* <div className="card-body">
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
                      <div className="col-sm-6 col-lg-1">
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
                      <div className="col-sm-6 col-lg-2">
                        <label >
                        Rate Valid From<span className="text-danger">*</span>{" "}
                        </label>
                        <DatePicker
                          className="form-control form-control-sm w-100"
                          selected={getFromDate()}
                          name="FromDate"
                          onChange={(e) => handleCalender(e)}
                          dateFormat="yyyy-MM-dd"
                        />
                        {validationErrors?.ValidFrom && (
                          <div
                            id="val-username1-error"
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {validationErrors?.ValidFrom}
                          </div>
                        )}
                      </div>
                      <div className="col-sm-6 col-lg-2">
                        <label >
                        Rate Valid To <span className="text-danger">*</span>
                        </label>
                        <DatePicker
                          className="form-control form-control-sm"
                          selected={getNextDate()}
                          name="FromDate"
                          onChange={(e) => handleNextCalender(e)}
                          dateFormat="yyyy-MM-dd"
                        />
                        {validationErrors?.ValidTo && (
                          <div
                            id="val-username1-error"
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {validationErrors?.ValidTo}
                          </div>
                        )}
                      </div>
                      <div className="col-sm-6 col-lg-2">
                        <label className="" htmlFor="status">
                          Currency <span className="text-danger">*</span>
                        </label>
                        <select
                          name="CurrencyId"
                          id="status"
                          className="form-control form-control-sm"
                          value={formValue?.CurrencyId}
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
                        {validationErrors?.CurrencyId && (
                          <div
                            id="val-username1-error"
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {validationErrors?.CurrencyId}
                          </div>
                        )}
                      </div>
                      <div className="col-sm-6 col-lg-2">
                        <label className="" htmlFor="status">
                          Service <span className="text-danger">*</span>
                        </label>
                        <select
                          name="Service"
                          id="status"
                          className="form-control form-control-sm"
                          value={formValue?.Service}
                          onChange={handleFormChange}
                        >
                          <option value={state?.Name}>{state?.Name}</option>
                        </select>
                        {validationErrors?.PaxRange && (
                          <div
                            id="val-username1-error"
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {validationErrors?.PaxRange}
                          </div>
                        )}
                      </div>
                      <div className="col-sm-6 col-lg-2">
                        <div className="d-flex justify-content-between">
                          <label className="" htmlFor="name">
                            Pax Range
                          </label>
                        </div>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          id="name"
                          name="PaxRange"
                          value={formValue?.PaxRange}
                          onChange={handleFormChange}
                          placeholder="Pax Range"
                        />
                      </div>
                      <div className="col-sm-6 col-lg-2">
                        <div className="d-flex justify-content-between">
                          <label className="" htmlFor="name">
                            Total Cost
                          </label>
                        </div>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          id="name"
                          name="TotalCost"
                          value={formValue?.TotalCost}
                          onChange={handleFormChange}
                          placeholder="Total Cost"
                        />
                      </div>
                      <div className="col-sm-6 col-lg-2">
                        <div className="d-flex justify-content-between">
                          <label className="" htmlFor="name">
                            Per Pax Cost
                          </label>
                        </div>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          id="name"
                          name="PaxCost"
                          value={formValue?.PaxCost}
                          onChange={handleFormChange}
                          placeholder="Per Pax Cost"
                          readOnly
                        />
                      </div>
                      <div className="col-sm-6 col-lg-1">
                      <div className="d-flex justify-content-between">
                      <label htmlFor="">
                          GST SLAB(%) <span className="text-danger">*</span>
                        </label>
                      </div>

                        <select
                          select
                          name="TaxSlabId"
                          id="status"
                          className="form-control form-control-sm"
                          value={formValue?.TaxSlabId}
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
                        {validationErrors?.TaxSlabId && (
                          <div
                            id="val-username1-error"
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {validationErrors?.TaxSlabId}
                          </div>
                        )}
                      </div>
                      <div className="col-sm-6 col-lg-1">
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
                      <div className="col-12">
                        <label className="" htmlFor="status">
                          Remarks
                        </label>
                        <textarea
                          name="Remarks"
                          id="status"
                          className="form-control form-control-sm"
                          placeholder="Write your remarks"
                          value={formValue?.Remarks}
                          onChange={handleFormChange}
                        ></textarea>
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
              <button onClick={handleSubmit} className="btn btn-primary btn-custom-size">
                Submit
              </button>

              {isUpdating && (
                <button onClick={handleReset} className="btn btn-primary">
                  Reset
                </button>
              )}
            </div>
          </div> */}
          <div className="card shadow border mt-4">
            <div className="card-body">
              <div className="row form-row-gap py-1">
                <div className="col-sm-6 col-lg-2">
                  <label className="" htmlFor="status">
                    Supplier Name <span className="text-danger">*</span>
                  </label>
                  <select
                    name="SupplierId"
                    id="status"
                    className="form-control form-control-sm"
                    value={rateFormValue?.SupplierId || supplierList?.[0]?.id}
                    onChange={handleRateFormChange}
                  >
                    {/* <option value=""></option> */}
                    {supplierList?.map((item) => {
                      return (
                        <option value={item?.id} key={item?.id}>
                          {item?.Name}
                        </option>
                      );
                    })}
                  </select>
                  {/* {rateValidation?.SupplierId && (
                    <div
                      id="val-username1-error"
                      className="invalid-feedback animated fadeInUp"
                      style={{ display: "block" }}
                    >
                      {rateValidation?.SupplierId}
                    </div>
                  )} */}
                </div>
                <div className="col-sm-6 col-lg-2">
                  <label>
                    Rate Valid From<span className="text-danger">*</span>{" "}
                  </label>
                  <DatePicker
                    className="form-control form-control-sm w-100"
                    selected={getFromDate()}
                    onChange={(e) => handleCalender(e)}
                    name="ValidFrom"
                    dateFormat="yyyy-MM-dd"
                    isClearable todayButton="Today"
                  />
                  {rateValidation?.ValidFrom && (
                    <div
                      id="val-username1-error"
                      className="invalid-feedback animated fadeInUp"
                      style={{ display: "block" }}
                    >
                      {rateValidation?.ValidFrom}
                    </div>
                  )}
                </div>
                <div className="col-sm-6 col-lg-2">
                  <label>
                    Rate Valid To <span className="text-danger">*</span>
                  </label>
                  <DatePicker
                    className="form-control form-control-sm"
                    selected={getNextDate()}
                    onChange={(e) => handleNextCalender(e)}
                    name="FromDate"
                    dateFormat="yyyy-MM-dd"
                    isClearable todayButton="Today"
                  />
                  {rateValidation?.ValidTo && (
                    <div
                      id="val-username1-error"
                      className="invalid-feedback animated fadeInUp"
                      style={{ display: "block" }}
                    >
                      {rateValidation?.ValidTo}
                    </div>
                  )}
                </div>
                <div className="col-sm-6 col-lg-2">
                  <label className="" htmlFor="status">
                    Currency <span className="text-danger">*</span>
                  </label>
                  <select
                    name="CurrencyId"
                    id="status"
                    className="form-control form-control-sm"
                    value={rateFormValue?.CurrencyId}
                    onChange={handleRateFormChange}
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
                  {rateValidation?.CurrencyId && (
                    <div
                      id="val-username1-error"
                      className="invalid-feedback animated fadeInUp"
                      style={{ display: "block" }}
                    >
                      {rateValidation?.CurrencyId}
                    </div>
                  )}
                </div>
                <div className="col-sm-6 col-lg-2">
                  <label className="" htmlFor="status">
                    Service <span className="text-danger">*</span>
                  </label>
                  <select
                    name="Service"
                    id="status"
                    className="form-control form-control-sm"
                    value={rateFormValue?.Service}
                    onChange={handleRateFormChange}
                  >
                    <option value={state?.Name}>{state?.Name}</option>
                  </select>
                  {rateValidation?.PaxRange && (
                    <div
                      id="val-username1-error"
                      className="invalid-feedback animated fadeInUp"
                      style={{ display: "block" }}
                    >
                      {rateValidation?.PaxRange}
                    </div>
                  )}
                </div>
                <div className="col-sm-6 col-lg-1">
                  <label htmlFor="">
                    GST Slab(%) <span className="text-danger">*</span>
                  </label>
                  <select
                    select
                    name="TaxSlabId"
                    id="status"
                    className="form-control form-control-sm"
                    value={rateFormValue?.TaxSlabId}
                    onChange={handleRateFormChange}
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
                  {rateValidation?.TaxSlabId && (
                    <div
                      id="val-username1-error"
                      className="invalid-feedback animated fadeInUp"
                      style={{ display: "block" }}
                    >
                      {validationErrors?.TaxSlabId}
                    </div>
                  )}
                </div>
                <div className="col-sm-6 col-lg-1">
                  <label className="" htmlFor="status">
                    Status
                  </label>
                  <select
                    name="Status"
                    id="status"
                    className="form-control form-control-sm"
                    value={rateFormValue?.Status}
                    onChange={handleRateFormChange}
                  >
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </div>
                <div className="col-12">
                  <table class="table table-bordered itinerary-table">
                    <thead>
                      <tr>
                        <th>S No</th>
                        <th>Upto Pax</th>
                        <th>Rounds</th>
                        <th>Class</th>
                        <th>Duration</th>
                        <th>Amounts</th>
                        <th className="text-area-width">Remarks</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {serviceCostForm?.map((serviceCostForm, index) => {
                        return (
                          <tr key={index + 1}>
                            <td>{index + 1}</td>
                            <td>
                              <div>
                                <input
                                  name="UpToPax"
                                  type="text"
                                  className="formControl1"
                                  value={serviceCostForm?.UpToPax}
                                  onChange={(e) =>
                                    handleServiceCostForm(e, index)
                                  }
                                />
                              </div>
                            </td>
                            <td>
                              <div>
                                <input
                                  name="Rounds"
                                  type="text"
                                  className="formControl1"
                                  value={serviceCostForm?.Rounds}
                                  onChange={(e) =>
                                    handleServiceCostForm(e, index)
                                  }
                                />
                              </div>
                            </td>
                            <td>
                              <div className="d-flex justify-content-center gap-2 flex-wrap">
                                <input
                                  type="text"
                                  name="Class"
                                  className="formControl1 width100px"
                                  value={serviceCostForm?.Class}
                                  onChange={(e) =>
                                    handleServiceCostForm(e, index)
                                  }
                                />
                              </div>
                            </td>
                            <td>
                              <div className="d-flex justify-content-center gap-2 flex-wrap">
                                <input
                                  type="text"
                                  name="Duration"
                                  className="formControl1 width100px"
                                  value={serviceCostForm?.Duration}
                                  onChange={(e) =>
                                    handleServiceCostForm(e, index)
                                  }
                                />
                              </div>
                            </td>
                            <td>
                              <div className="d-flex justify-content-center gap-2 flex-wrap">
                                <input
                                  type="number"
                                  name="Amount"
                                  className="formControl1 width100px"
                                  value={serviceCostForm?.Amount}
                                  onChange={(e) =>
                                    handleServiceCostForm(e, index)
                                  }
                                />
                              </div>
                            </td>
                            <td className="text-area-width">
                              <div className="d-flex justify-content-center gap-2 flex-wrap">
                                <textarea
                                  name="Remarks"
                                  className="formControl1 w-100"
                                  value={serviceCostForm?.Remarks}
                                  onChange={(e) =>
                                    handleServiceCostForm(e, index)
                                  }
                                />
                              </div>
                            </td>
                            <td>
                              <div className="d-flex w-100 justify-content-center gap-2 ">
                                <span
                                  onClick={() => handleServiceIncrement(index)}
                                >
                                  <i className="la la-plus border cursor-pointer bg-success text-white rounded-pill fontSize10px padding1px"></i>
                                </span>
                                <span
                                  onClick={() => handleServiceDecrement(index)}
                                >
                                  <i className="la la-minus  border cursor-pointer bg-primary text-white rounded-pill fontSize10px padding1px"></i>
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="">
            <div className="">
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
                Save <strong className="">And</strong> New
              </button>
              <button
                onClick={handleReset}
                className="btn btn-dark btn-custom-size"
              >
                <span className="me-1">Reset</span>
                <i className="fa-solid fa-refresh text-dark bg-white p-1 rounded"></i>
              </button>
              <button
                onClick={handleSubmit}
                className="btn btn-primary btn-custom-size"
              >
                Submit
              </button>

              {/* {isUpdating && (
                <button onClick={handleReset} className="btn btn-primary">
                  Reset
                </button>
              )} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityRate;
