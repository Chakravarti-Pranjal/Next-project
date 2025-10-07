import React, { useState, useEffect } from "react";
import { transferRateAddInitialValue } from "../../../masters/masters_initial_value.js";
import { transferRateValidationSchema } from "../../../masters/master_validation.js";
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

const TransportRate = () => {
  const { id } = useParams();
  const [formValue, setFormValue] = useState(transferRateAddInitialValue);
  const [validationErrors, setValidationErrors] = useState({});
  const [rateInitialList, setRateInitialList] = useState([]);
  const [dataForUpdate, setDataForUpdate] = useState("");
  const [supplierList, setSupplierList] = useState([]);
  const [currencyList, setCurrencyList] = useState([]);
  const [destinationList, setDestinationList] = useState([]);
  const [vehicleList, setVehicleList] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [slabList, setSlabList] = useState([]);
  const { state } = useLocation();
  const navigate = useNavigate();

  const getDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("transferratelist", {
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

  const postDropdownDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("supplierlist", {
        Name: "",
        id: "",
        SupplierService: [4],
        DestinationId: state?.DestinationId?.map((dest) => dest?.DestinationId),
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
      setSlabList(data);
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
      await transferRateValidationSchema.validate(
        {
          ...formValue,
          TransferId: id,
        },
        { abortEarly: false }
      );

      // console.log("form-value",{
      //   ...formValue,
      //   TransferId: id,
      // });

      setValidationErrors({});
      const { data } = await axiosOther.post(
        isUpdating ? "updatetransferrate" : "addtransferrate",
        {
          ...formValue,
          TransferId: id,
          DestinationID: +state?.DestinationId,
        }
      );

      if (data?.Status == 1 || data?.status == 1) {
        setIsUpdating(false);
        getDataToServer();
        setFormValue(transferRateAddInitialValue);
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

  // console.log("upate-data",dataForUpdate);

  // setting data for update
  useEffect(() => {
    if (dataForUpdate != "") {
      setFormValue({
        TransferId: id,
        RateUniqueId: dataForUpdate?.UniqueID,
        SupplierId: dataForUpdate?.SupplierId.toString(),
        CompanyId:
          dataForUpdate?.companyId == !null ? dataForUpdate?.companyId : "1",
        DestinationID: dataForUpdate?.DestinationID,
        ValidFrom: dataForUpdate?.ValidFrom,
        ValidTo: dataForUpdate?.ValidTo,
        VehicleTypeId: dataForUpdate?.VehicleTypeId,
        TaxSlabId: dataForUpdate?.TaxSlabId,
        CurrencyId: dataForUpdate?.CurrencyId,
        VehicleCost:
          dataForUpdate?.VehicleCost == !undefined
            ? dataForUpdate?.VehicleCost
            : "",
        ParkingFee:
          dataForUpdate?.ParkingFee != undefined
            ? dataForUpdate?.ParkingFee
            : "",
        RapEntryFee:
          dataForUpdate?.RapEntryFee != undefined
            ? dataForUpdate?.RapEntryFee
            : "",
        Assistance:
          dataForUpdate?.Assistance != undefined
            ? dataForUpdate?.Assistance
            : "",
        AdtnlAllowance:
          dataForUpdate?.AdtnlAllowance != undefined
            ? dataForUpdate?.AdtnlAllowance
            : "",
        InterStateToll:
          dataForUpdate?.InterStateToll != undefined
            ? dataForUpdate?.InterStateToll
            : "",
        MiscCost:
          dataForUpdate?.MiscCost != undefined ? dataForUpdate?.MiscCost : "",
        Remarks: dataForUpdate?.Remarks,
        Status: dataForUpdate?.Status,
        AddedBy: dataForUpdate?.AddedBy,
        UpdatedBy: dataForUpdate?.UpdatedBy,
        UpdatedDate: currentDate(),
      });
    }
  }, [isUpdating, dataForUpdate]);

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <ToastContainer />
          <div className="card-header py-3 d-flex justify-content-between align-items-center">
            <h4 className="m-0 rate-heading-h4">
              {state?.Master}: {state?.TransferName} ,{" "}
              {state?.DestinationId?.length > 0 &&
                state?.DestinationId.map((data, index) => (

                  <>
                    <span>{data?.DestinationName}</span>
                    {index < state?.DestinationId?.length - 1 && ","}
                  </>
                ))}
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
                <button onClick={handleReset} className="btn btn-primary">
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

                          {supplierList?.length > 0 && supplierList?.map((item) => {

                            { console.log(item, "pleasechekkk") };
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
                          Destination <span className="text-danger">*</span>
                        </label>
                        <select
                          name="DestinationID"
                          id="status"
                          className="form-control form-control-sm"
                          value={formValue?.DestinationID}
                          onChange={handleFormChange}
                        >
                          <option value="">Select</option>
                          {destinationList?.map((item) => {
                            return (
                              <option value={item?.id} key={item?.id}>
                                {item?.Name}
                              </option>
                            );
                          })}
                        </select>
                        {validationErrors?.DestinationID && (
                          <div
                            id="val-username1-error"
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {validationErrors?.DestinationID}
                          </div>
                        )}
                      </div>
                      <div className="col-md-6 col-lg-2">
                        <label>
                          Rate Valid From <span className="text-danger">*</span>{" "}
                        </label>
                        <DatePicker
                          className="form-control form-control-sm w-100"
                          selected={getFromDate()}
                          name="FromDate"
                          onChange={(e) => handleCalender(e)}
                          dateFormat="yyyy-MM-dd"
                          isClearable todayButton="Today"
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
                      <div className="col-md-6 col-lg-2">
                        <label>
                          Rate Valid To <span className="text-danger">*</span>{" "}
                        </label>
                        <DatePicker
                          className="form-control form-control-sm"
                          selected={getNextDate()}
                          name="FromDate"
                          onChange={(e) => handleNextCalender(e)}
                          dateFormat="yyyy-MM-dd"
                          isClearable todayButton="Today"
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
                      <div className="col-md-6 col-lg-2">
                        <label htmlFor="">
                          Tax Slab(%) <span className="text-danger">*</span>
                        </label>
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
                      <div className="col-md-6 col-lg-2">
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
                      <div className="col-md-6 col-lg-1">
                        <label className="" htmlFor="status">
                          Vehicle Type <span className="text-danger">*</span>
                        </label>
                        <select
                          name="VehicleTypeId"
                          id="status"
                          className="form-control form-control-sm"
                          value={formValue?.VehicleTypeId}
                          onChange={handleFormChange}
                        >
                          <option value="">Select</option>
                          {vehicleList?.map((item) => {
                            return (
                              <option value={item?.id} key={item?.id}>
                                {item?.Name}
                              </option>
                            );
                          })}
                        </select>
                        {validationErrors?.VehicleTypeId && (
                          <div
                            id="val-username1-error"
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {validationErrors?.VehicleTypeId}
                          </div>
                        )}
                      </div>

                      <div className="col-md-6 col-lg-2">
                        <div className="d-flex justify-content-between">
                          <label className="" htmlFor="name">
                            Vehicle Cost
                          </label>
                        </div>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          id="name"
                          name="VehicleCost"
                          value={formValue?.VehicleCost}
                          onChange={handleFormChange}
                          placeholder="Vehicle Cost"
                        />
                      </div>
                      <div className="col-md-4 col-lg-2">
                        <div className="d-flex justify-content-between">
                          <label className="" htmlFor="name">
                            Parking Fee
                          </label>
                        </div>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          id="name"
                          name="ParkingFee"
                          value={formValue?.ParkingFee}
                          onChange={handleFormChange}
                          placeholder="Parking Fee"
                        />
                      </div>
                      <div className="col-md-4 col-lg-2">
                        <div className="d-flex justify-content-between">
                          <label className="" htmlFor="name">
                            No of Vehicle
                          </label>
                        </div>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          id="name"
                          name="NoOfVehicle"
                          value={formValue?.NoOfVehicle}
                          onChange={handleFormChange}
                          placeholder="Vehicle No"
                        />
                      </div>
                      <div className="col-md-4 col-lg-2">
                        <div className="d-flex justify-content-between">
                          <label className="" htmlFor="name">
                            Rep Entry Fee
                          </label>
                        </div>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          id="name"
                          name="RapEntryFee"
                          value={formValue?.RapEntryFee}
                          onChange={handleFormChange}
                          placeholder="Entry Fee"
                        />
                      </div>
                      <div className="col-md-4 col-lg-2">
                        <div className="d-flex justify-content-between">
                          <label className="" htmlFor="name">
                            Assistance
                          </label>
                        </div>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          id="name"
                          name="Assistance"
                          value={formValue?.Assistance}
                          onChange={handleFormChange}
                          placeholder="Assistance"
                        />
                      </div>
                      <div className="col-md-4 col-lg-2">
                        <div className="d-flex justify-content-between">
                          <label className="" htmlFor="name">
                            Additional Allowence
                          </label>
                        </div>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          id="name"
                          name="AdtnlAllowance"
                          value={formValue?.AdtnlAllowance}
                          onChange={handleFormChange}
                          placeholder="Additional Allowence"
                        />
                      </div>
                      <div className="col-md-4 col-lg-2">
                        <div className="d-flex justify-content-between">
                          <label className="" htmlFor="name">
                            Inter State & Toll
                          </label>
                        </div>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          id="name"
                          name="InterStateToll"
                          value={formValue?.InterStateToll}
                          onChange={handleFormChange}
                          placeholder="Toll"
                        />
                      </div>
                      <div className="col-md-4 col-lg-2">
                        <div className="d-flex justify-content-between">
                          <label className="" htmlFor="name">
                            MISC Cost
                          </label>
                        </div>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          id="name"
                          name="MiscCost"
                          value={formValue?.MiscCost}
                          onChange={handleFormChange}
                          placeholder="MISC Cost"
                        />
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
                      <div className="col-lg-12 d-flex flex-column">
                        <label className="" htmlFor="status">
                          Remarks
                        </label>

                        <textarea
                          name="Remarks"
                          id="status"
                          className="custom-textarea"
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
              <button
                onClick={handleSubmit}
                className="btn btn-primary btn-custom-size"
              >
                Submit
              </button>
              {isUpdating && (
                <button onClick={handleReset} className="btn btn-primary">
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

export default TransportRate;
