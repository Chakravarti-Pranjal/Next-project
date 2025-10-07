import React, { useState, useEffect } from "react";
import { guideServiceRateInitialValue } from "../../../masters/masters_initial_value.js";
import { gudieServiceRateValidationSchema } from "../../../masters/master_validation.js";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { axiosOther } from "../../../../../http/axios_base_url.js";
import "../../../../../scss/main.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { notifyError, notifySuccess } from "../../../../../helper/notify.jsx";
import { guideServiceCostInitial } from "../../masters_initial_value.js";

const GuideRate = () => {
  const { id } = useParams();
  const [rateFormValue, setRateFormValue] = useState(guideServiceRateInitialValue);
  const [serviceCostForm, setServiceCostForm] = useState([guideServiceCostInitial]);
  const [validationErrors, setValidationErrors] = useState({});
  const [rateInitialList, setRateInitialList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [currencyList, setCurrencyList] = useState([]);
  const [guideMasterList, setGuideMasterList] = useState([]);
  const [slabList, setSlabList] = useState([]);
  const [paxRangeList, setPaxRangeList] = useState([]);
  const [rateValidation, setRateValidation] = useState({});
  const [dataForUpdate, setDataForUpdate] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const { state } = useLocation();
  const navigate = useNavigate();

  // console.log(state, "statecheck")

  // Fetch initial rate data
  const getDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("guideservicelist", { id });
      if (data?.DataList) {
        setRateInitialList(data.DataList);
      } else {
        setRateInitialList([]);
      }
    } catch (error) {
      console.error("Error fetching rate data:", error);
      notifyError("Failed to fetch rate data");
    }
  };

  useEffect(() => {
    getDataToServer();
  }, []);

  // Display success message from localStorage
  useEffect(() => {
    const getMessage = localStorage.getItem("success-message");
    if (getMessage) {
      notifySuccess(getMessage);
      localStorage.removeItem("success-message");
    }
  }, []);

  // Fetch dropdown data
  const postDropdownDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("supplierlist", {
        Name: "",
        id: "",
        SupplierService: [1],
        DestinationId: [state?.Destination?.id],
      });
      setSupplierList(data.DataList);
      if (data.DataList && data.DataList.length > 0) {
        setRateFormValue((prev) => ({
          ...prev,
          SupplierId: data.DataList[0].id,
        }));
      }
    } catch (err) {
      console.error("Error fetching supplier list:", err);
    }

    try {
      const { data } = await axiosOther.post("currencymasterlist", {
        id: "",
        Name: "",
        Status: "",
      });
      setCurrencyList(data?.DataList);
    } catch (error) {
      console.error("Error fetching currency list:", error);
    }

    try {
      const { data } = await axiosOther.post("taxmasterlist", {
        Id: "",
        Search: "",
        Status: "",
        ServiceType: "1",
      });
      setSlabList(data);
      if (data.DataList && data.DataList.length > 0) {
        setRateFormValue((prev) => ({
          ...prev,
          GstSlabid: data.DataList[0].id,
        }));
      }
    } catch (error) {
      console.error("Error fetching tax slab list:", error);
    }

    try {
      const { data } = await axiosOther.post("tourescortmasterlist", {
        Search: "",
        Status: "",
      });
      setGuideMasterList(data?.DataList);
    } catch (error) {
      console.error("Error fetching guide master list:", error);
    }

    try {
      const { data } = await axiosOther.post("pax-range-list", {
        Search: "",
        Status: "",
      });
      setPaxRangeList(data?.DataList);
    } catch (error) {
      console.error("Error fetching pax range list:", error);
    }
  };

  useEffect(() => {
    postDropdownDataToServer();
  }, []);

  // Populate form data for editing or initial load
  useEffect(() => {
    if (dataForUpdate && dataForUpdate !== "") {
      // console.log("Populating form with dataForUpdate:", dataForUpdate);
      setIsUpdating(true);
      const updatedValue = {
        id,
        RateUniqueId: dataForUpdate.UniqueID || "",
        DestinationID: state?.Destination?.id || dataForUpdate.DestinationID || "",
        CompanyId: state?.CompanyId || dataForUpdate.CompanyId || "",
        SupplierId: dataForUpdate.SupplierId || "",
        ValidFrom: dataForUpdate.ValidFrom || "",
        ValidTo: dataForUpdate.ValidTo || "",
        PaxRange: dataForUpdate.PaxRange || "",
        DayType: dataForUpdate.DayType || "Full Day",
        UniversalCost: dataForUpdate.UniversalCost || "No",
        GuideId: dataForUpdate.GuideId || "",
        Currency: dataForUpdate.CurrencyId || "",
        LangAllowance: dataForUpdate.LangAllowance || "",
        OtherCost: dataForUpdate.OtherCost || "",
        GstSlabid: dataForUpdate.GstSlabid || "",
        Status: dataForUpdate.Status || "1",
        AddedBy: dataForUpdate.AddedBy || "",
        UpdatedBy: dataForUpdate.UpdatedBy || "",
        AddedDate: dataForUpdate.AddedDate || "",
        UpdatedDate: dataForUpdate.UpdatedDate || "",
      };
      setRateFormValue(updatedValue);
      setServiceCostForm(
        Array.isArray(dataForUpdate.ServiceCost) && dataForUpdate.ServiceCost.length > 0
          ? dataForUpdate.ServiceCost.map((cost) => ({
            StartPax: cost.StartPax || "",
            EndPax: cost.EndPax || "",
            GuideFullDayFee: cost.GuideFullDayFee || "",
            GuideHalfDayFee: cost.GuideHalfDayFee || "",
            LAFullDayFee: cost.LAFullDayFee || "",
            LAHalfDayFee: cost.LAHalfDayFee || "",
            OthersFullDayFee: cost.OthersFullDayFee || "",
            OthersHalfDayFee: cost.OthersHalfDayFee || "",
            Remarks: cost.Remarks || "",
          }))
          : [guideServiceCostInitial]
      );
    } else if (rateInitialList?.length > 0 && rateInitialList[0]?.Ratejson?.Data[0]?.RateDetails[0]) {
      // console.log("Populating form with rateInitialList:", rateInitialList);
      setIsUpdating(true)
      const rateDetails = rateInitialList[0].Ratejson.Data[0].RateDetails[0];
      // console.log(rateDetails.SupplierId);
      const updatedRateFormValue = {
        id,
        RateUniqueId: rateDetails.UniqueID || "",
        DestinationID: rateInitialList[0].Ratejson.DestinationID || state?.Destination?.id || "",
        CompanyId: rateInitialList[0].CompanyId || state?.CompanyId || "",
        SupplierId: rateDetails.SupplierId || "",
        ValidFrom: rateDetails.ValidFrom || "",
        ValidTo: rateDetails.ValidTo || "",
        PaxRange: rateInitialList[0].PaxRange || "",
        DayType: rateDetails.DayTime || "Full Day",
        UniversalCost: rateDetails.UniversalCost || "No",
        GuideId: rateDetails.GuideId || "",
        Currency: rateDetails.CurrencyId || "",
        LangAllowance: rateDetails.LangAllowance || "",
        OtherCost: rateDetails.OtherCost || "",
        GstSlabid: rateDetails.GstSlabid || "",
        Status: rateDetails.Status || "1",
        AddedBy: rateDetails.AddedBy || "",
        UpdatedBy: rateDetails.UpdatedBy || "",
        AddedDate: rateDetails.AddedDate || "",
        UpdatedDate: rateDetails.UpdatedDate || "",
      };
      setRateFormValue(updatedRateFormValue);
      setServiceCostForm(
        Array.isArray(rateDetails.ServiceCost) && rateDetails.ServiceCost.length > 0
          ? rateDetails.ServiceCost.map((cost) => ({
            StartPax: cost.StartPax || "",
            EndPax: cost.EndPax || "",
            GuideFullDayFee: cost.GuideFullDayFee || "",
            GuideHalfDayFee: cost.GuideHalfDayFee || "",
            LAFullDayFee: cost.LAFullDayFee || "",
            LAHalfDayFee: cost.LAHalfDayFee || "",
            OthersFullDayFee: cost.OthersFullDayFee || "",
            OthersHalfDayFee: cost.OthersHalfDayFee || "",
            Remarks: cost.Remarks || "",
          }))
          : [guideServiceCostInitial]
      );
    }
  }, [rateInitialList, dataForUpdate, id, state]);

  // Update Currency based on GstSlabid
  useEffect(() => {
    const taxItem = slabList?.DataList?.find((list) => list?.id == rateFormValue?.GstSlabid);
    if (taxItem) {
      setRateFormValue((prev) => ({
        ...prev,
        Currency: taxItem?.CurrencyID || "",
      }));
    } else {
      setRateFormValue((prev) => ({
        ...prev,
        Currency: "",
      }));
    }
  }, [rateFormValue?.GstSlabid, slabList]);

  // Reset form
  const handleReset = () => {
    setIsUpdating(false);
    setRateFormValue(guideServiceRateInitialValue);
    setServiceCostForm([guideServiceCostInitial]);
    setDataForUpdate("");
    setRateValidation({});
  };

  // Handle form submission
  const handleSubmit = async (e, saveAndNew = false) => {
    e.preventDefault();
    try {
      await gudieServiceRateValidationSchema.validate(
        {
          ...rateFormValue,
          ServiceCost: serviceCostForm,
          ServiceId: id,
        },
        { abortEarly: false }
      );

      setRateValidation({});
      const payload = {
        ...rateFormValue,
        ServiceCost: serviceCostForm,
        ServiceId: state?.id,
        GuideId: state?.id?.toString() || rateFormValue.GuideId,
        DestinationID: state?.Destination?.id?.toString() || rateFormValue.DestinationID,
        CompanyId: state?.CompanyId || rateFormValue.CompanyId,
        RateUniqueId: rateFormValue.RateUniqueId || "",
        id: id
      };

      // console.log("Submitting payload:", JSON.stringify(payload, null, 2));
      const endpoint = isUpdating ? "updateguideratejson" : "addupdateguiderate";
      const { data } = await axiosOther.post(endpoint, payload);

      // console.log("API Response:", data);
      if (data?.Status === 1 || data?.status === 1) {
        notifySuccess(data?.Message || data?.message);
        if (saveAndNew) {
          setIsUpdating(false);
          setRateFormValue(guideServiceRateInitialValue);
          setServiceCostForm([guideServiceCostInitial]);
          setDataForUpdate("");
        }
        // getDataToServer()
        navigate("/guide-service")
      } else {
        notifyError(data?.Message || data?.message);
      }
    } catch (error) {
      if (error.inner) {
        const errorMessages = error.inner.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {});
        setRateValidation(errorMessages);
        console.log("Validation errors:", errorMessages);
      }
      if (error.response?.data?.Errors) {
        const data = Object.entries(error.response?.data?.Errors);
        notifyError(data[0]?.[1] || "An error occurred");
      }
      console.error("Submission error:", error);
    }
  };
  

  // Date handling
  const getFromDate = () => {
    return rateFormValue?.ValidFrom ? new Date(rateFormValue?.ValidFrom) : null;
  };

  const getNextDate = () => {
    return rateFormValue?.ValidTo ? new Date(rateFormValue?.ValidTo) : null;
  };

  const handleCalender = (date) => {
    const formattedDate = date ? date.toISOString().split("T")[0] : "";
    setRateFormValue((prev) => ({
      ...prev,
      ValidFrom: formattedDate,
    }));
  };

  const handleNextCalender = (date) => {
    const formattedDate = date ? date.toISOString().split("T")[0] : "";
    setRateFormValue((prev) => ({
      ...prev,
      ValidTo: formattedDate,
    }));
  };

  // Service cost form handling
  const handleServiceIncrement = () => {
    setServiceCostForm((prevArr) => [...prevArr, guideServiceCostInitial]);
  };

  const handleServiceDecrement = (index) => {
    if (serviceCostForm.length > 1) {
      setServiceCostForm((prevArr) => prevArr.filter((_, i) => i !== index));
    }
  };

  const handleServiceCostForm = (e, index) => {
    const { name, value } = e.target;
    setServiceCostForm((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = { ...newArr[index], [name]: value };
      return newArr;
    });
  };

  const handleRateFormChange = (e) => {
    const { name, value } = e.target;
    setRateFormValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <ToastContainer />
          <div className="card-header py-3 justify-content-between d-flex">
            <h4 className="m-0 rate-heading-h4">
              {state?.Master}: {state?.Ratejson?.ServiceId}, {state?.ServiceName}, {state?.Destination?.Name}
            </h4>
            <div className="d-flex gap-3 justify-content-end">
              <button className="btn btn-dark btn-custom-size" onClick={() => navigate("/guide-service", {
                state: {
                  selectedDestination: state?.selectedDestination,
                  selectguidename: state?.selectguidename,
                },
              })}>
                <span className="me-1">Back</span>
                <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
              </button>
              {/*<button onClick={(e) => handleSubmit(e, true)} className="btn btn-primary btn-custom-size">
                Save <strong className="">And</strong> New
              </button>*/}
              <button onClick={handleReset} className="btn btn-dark btn-custom-size">
                <span className="me-1">Reset</span>
                <i className="fa-solid fa-refresh text-dark bg-white p-1 rounded"></i>
              </button>
              <button onClick={handleSubmit} className="btn btn-primary btn-custom-size">
                Submit
              </button>
            </div>
          </div>
          <div className="card-body">
            <div className="form-validation">
              <form className="form-valide" onSubmit={(e) => e.preventDefault()}>
                <div className="row">
                  <div className="col-12">
                    <div className="card shadow border mt-4">
                      <div className="card-body">
                        <div className="row form-row-gap py-1">
                          <div className="col-md-6 col-lg-1">
                            <label className="" htmlFor="SupplierId">
                              Supplier Name <span className="text-danger">*</span>
                            </label>
                            <select
                              name="SupplierId"
                              id="SupplierId"
                              className="form-control form-control-sm"
                              value={rateFormValue.SupplierId}
                              onChange={handleRateFormChange}
                            >
                              <option value="">Select</option>
                              {supplierList?.map((item) => (
                                <option value={item?.id} key={item?.id}>
                                  {item?.Name}
                                </option>
                              ))}
                            </select>
                            {rateValidation?.SupplierId && (
                              <div
                                className="invalid-feedback animated fadeInUp"
                                style={{ display: "block" }}
                              >
                                {rateValidation.SupplierId}
                              </div>
                            )}
                          </div>
                          <div className="col-md-6 col-lg-2">
                            <label className="">
                              Rate Valid From <span className="text-danger">*</span>
                            </label>
                            <DatePicker
                              className="form-control form-control-sm w-100"
                              selected={getFromDate()}
                              name="ValidFrom"
                              onChange={handleCalender}
                              dateFormat="dd-MM-yyyy"
                              isClearable todayButton="Today"
                            />
                            {rateValidation?.ValidFrom && (
                              <div
                                className="invalid-feedback animated fadeInUp"
                                style={{ display: "block" }}
                              >
                                {rateValidation.ValidFrom}
                              </div>
                            )}
                          </div>
                          <div className="col-md-6 col-lg-2">
                            <label className="">
                              Rate Valid To <span className="text-danger">*</span>
                            </label>
                            <DatePicker
                              className="form-control form-control-sm"
                              selected={getNextDate()}
                              name="ValidTo"
                              onChange={handleNextCalender}
                              dateFormat="dd-MM-yyyy"
                              isClearable todayButton="Today"
                            />
                            {rateValidation?.ValidTo && (
                              <div
                                className="invalid-feedback animated fadeInUp"
                                style={{ display: "block" }}
                              >
                                {rateValidation.ValidTo}
                              </div>
                            )}
                          </div>
                          <div className="col-md-6 col-lg-2">
                            <label>
                              Universal Cost <span className="text-danger">*</span>
                            </label>
                            <div className="d-flex gap-3">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="UniversalCost"
                                  id="universal_yes"
                                  value="Yes"
                                  checked={rateFormValue.UniversalCost === "Yes"}
                                  onChange={handleRateFormChange}
                                />
                                <label className="form-check-label" htmlFor="universal_yes">
                                  Yes
                                </label>
                              </div>
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="UniversalCost"
                                  id="universal_no"
                                  value="No"
                                  checked={rateFormValue.UniversalCost === "No"}
                                  onChange={handleRateFormChange}
                                />
                                <label className="form-check-label" htmlFor="universal_no">
                                  No
                                </label>
                              </div>
                            </div>
                          </div>
                          {rateFormValue.UniversalCost === "No" && (
                            <div className="col-md-6 col-lg-2">
                              <label className="">SELECT GUIDE/PORTER</label>
                              <select
                                name="GuideId"
                                className="form-control form-control-sm"
                                value={rateFormValue.GuideId}
                                onChange={handleRateFormChange}
                              >
                                <option value="">Select Guide</option>
                                {guideMasterList?.map((item) => (
                                  <option value={item?.id} key={item?.id}>
                                    {item?.Name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                          <div className="col-md-6 col-lg-1">
                            <label className="" htmlFor="Currency">
                              CURRENCY <span className="text-danger">*</span>
                            </label>
                            <select
                              name="Currency"
                              id="Currency"
                              className="form-control form-control-sm"
                              value={rateFormValue.Currency}
                              onChange={handleRateFormChange}
                            >
                              <option value="">Select</option>
                              {currencyList?.map((item) => (
                                <option value={item?.id} key={item?.id}>
                                  {item?.CurrencyName}
                                </option>
                              ))}
                            </select>
                            {rateValidation?.Currency && (
                              <div
                                className="invalid-feedback animated fadeInUp"
                                style={{ display: "block" }}
                              >
                                {rateValidation.Currency}
                              </div>
                            )}
                          </div>
                          <div className="col-md-6 col-lg-1">
                            <label htmlFor="GstSlabid">GST SLAB(%)</label>
                            <select
                              name="GstSlabid"
                              id="GstSlabid"
                              className="form-control form-control-sm"
                              value={rateFormValue.GstSlabid}
                              onChange={handleRateFormChange}
                            >
                              <option value="">Select</option>
                              {slabList?.DataList?.map((item) => (
                                <option value={item?.id} key={item?.id}>
                                  {item?.TaxSlabName} ({item?.TaxValue})
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="col-md-6 col-lg-1">
                            <label className="" htmlFor="Status">
                              Status
                            </label>
                            <select
                              name="Status"
                              id="Status"
                              className="form-control form-control-sm"
                              value={rateFormValue.Status}
                              onChange={handleRateFormChange}
                            >
                              <option value="1">Active</option>
                              <option value="0">InActive</option>
                            </select>
                          </div>
                          <div className="col-12">
                            <table className="table table-bordered itinerary-table mt-3">
                              <thead>
                                <tr>
                                  <th colSpan={2}>Particulars</th>
                                  <th colSpan={2}>Guide Fee</th>
                                  <th colSpan={2}>Language Allowance</th>
                                  <th colSpan={2}>Other Cost</th>
                                  <th rowSpan={2} className="align-middle text-area-width">
                                    Remarks
                                  </th>
                                  <th rowSpan={2} className="align-middle">
                                    Action
                                  </th>
                                </tr>
                                <tr>
                                  <th>Start Pax</th>
                                  <th>End Pax</th>
                                  <th>Full Day</th>
                                  <th>Half Day</th>
                                  <th>Full Day</th>
                                  <th>Half Day</th>
                                  <th>Full Day</th>
                                  <th>Half Day</th>
                                </tr>
                              </thead>
                              <tbody>
                                {serviceCostForm?.map((service, index) => (
                                  <tr key={index}>
                                    <td>
                                      <input
                                        name="StartPax"
                                        type="text"
                                        className="formControl1"
                                        value={service.StartPax}
                                        onChange={(e) => handleServiceCostForm(e, index)}
                                      />
                                    </td>
                                    <td>
                                      <input
                                        name="EndPax"
                                        type="text"
                                        className="formControl1"
                                        value={service.EndPax}
                                        onChange={(e) => handleServiceCostForm(e, index)}
                                      />
                                    </td>
                                    <td>
                                      <input
                                        name="GuideFullDayFee"
                                        type="text"
                                        className="formControl1"
                                        value={service.GuideFullDayFee}
                                        onChange={(e) => handleServiceCostForm(e, index)}
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        name="GuideHalfDayFee"
                                        className="formControl1 width100px"
                                        value={service.GuideHalfDayFee}
                                        onChange={(e) => handleServiceCostForm(e, index)}
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        name="LAFullDayFee"
                                        className="formControl1 width100px"
                                        value={service.LAFullDayFee}
                                        onChange={(e) => handleServiceCostForm(e, index)}
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        name="LAHalfDayFee"
                                        className="formControl1 width100px"
                                        value={service.LAHalfDayFee}
                                        onChange={(e) => handleServiceCostForm(e, index)}
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        name="OthersFullDayFee"
                                        className="formControl1 width100px"
                                        value={service.OthersFullDayFee}
                                        onChange={(e) => handleServiceCostForm(e, index)}
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        name="OthersHalfDayFee"
                                        className="formControl1 width100px"
                                        value={service.OthersHalfDayFee}
                                        onChange={(e) => handleServiceCostForm(e, index)}
                                      />
                                    </td>
                                    <td className="text-area-width">
                                      <textarea
                                        name="Remarks"
                                        className="formControl1 w-100"
                                        value={service.Remarks}
                                        onChange={(e) => handleServiceCostForm(e, index)}
                                      />
                                    </td>
                                    <td>
                                      <div className="d-flex w-100 justify-content-center gap-2">
                                        <span onClick={() => handleServiceIncrement()}>
                                          <i className="la la-plus border cursor-pointer bg-success text-white rounded-pill fontSize10px padding1px"></i>
                                        </span>
                                        <span onClick={() => handleServiceDecrement(index)}>
                                          <i className="la la-minus border cursor-pointer bg-primary text-white rounded-pill fontSize10px padding1px"></i>
                                        </span>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
              {/* Uncomment and implement RateList if needed */}
              {/* <RateList
                id={id}
                setDataUpdate={setDataForUpdate}
                setIsUpdating={setIsUpdating}
                rateInitialList={rateInitialList}
                rateList={getDataToServer}
              /> */}
            </div>
            <div className="d-flex gap-3 justify-content-end mt-5">
              <button className="btn btn-dark btn-custom-size" onClick={() => navigate("/guide-service", {
                state: {
                  selectedDestination: state?.selectedDestination,
                  selectguidename: state?.selectguidename,
                },
              })}>
                <span className="me-1">Back</span>
                <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
              </button>
              {/*<button onClick={(e) => handleSubmit(e, true)} className="btn btn-primary btn-custom-size">
                Save <strong className="">And</strong> New
              </button>*/}
              <button onClick={handleReset} className="btn btn-dark btn-custom-size">
                <span className="me-1">Reset</span>
                <i className="fa-solid fa-refresh text-dark bg-white p-1 rounded"></i>
              </button>
              <button onClick={handleSubmit} className="btn btn-primary btn-custom-size">
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideRate;