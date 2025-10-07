import React, { useState, useEffect } from "react";
import { monumentRateInitialValue } from "../../../../masters/masters_initial_value.js";
import { monumnetRateValidationSchema } from "../../../../masters/master_validation.js";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
// import useDestinationSelect from "../../../../../hooks/custom_hooks/useDestinationSelect";
import { axiosOther } from "../../../../../../http/axios_base_url.js";
import "../../../../../../scss/main.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-toastify/dist/ReactToastify.css";
import {
  notifyError,
  notifyHotError,
  notifyHotSuccess,
  notifySuccess,
} from "../../../../../../helper/notify.jsx";
import RateList from "./monumentList/index.jsx";
import { currentDate } from "../../../../../../helper/currentDate.js";

const RateMonument = () => {
  const [formValue, setFormValue] = useState(monumentRateInitialValue);
  const [currencymasterlist, setCurrencymasterlist] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [nationalitylist, setNationalitylist] = useState([]);
  const [rateInitialList, setRateInitialList] = useState([]);
  const [isupdateData, setIsUpdateData] = useState(false);
  const [dataForUpdate, setDataForUpdate] = useState("");
  const [supplierList, setSupplierList] = useState([]);
  const [remarksEditorValue, setRemarksEditorValue] = useState("");
  const [tacEditorValue, setTacEditorValue] = useState("");
  const [policyEditorValue, setPolicyEditorValue] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [taxSlab, setTaxSlab] = useState([]);
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  const monumentRateList = async () => {
    try {
      const { data } = await axiosOther.post("monumentlist", {
        id: id,
      });
      setRateInitialList(data?.DataList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    monumentRateList();
  }, []);

  const getDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("taxmasterlist", {
        // "Id": "12",
        Search: "",
        Status: "1",
        ServiceType: "3",
      });
      if (data?.DataList?.length > 0) {
        setFormValue((prev) => {
          return {
            ...prev,
            TaxSlabId: data?.DataList[0]?.id,
          };
        });
        setTaxSlab(data.DataList);
      }
    } catch (err) {
      console.log(err);
    }
    try {
      const res = await axiosOther.post("currencymasterlist", {
        id: "",
        Name: "",
        Status: "",
      });
      setCurrencymasterlist(res.data.DataList);
    } catch (err) {
      console.log(err);
    }
    try {
      const res = await axiosOther.post("nationalitylist", {
        Search: "",
        Status: 1,
      });
      setNationalitylist(res.data.DataList);
    } catch (err) {
      console.log(err);
    }
    try {
      const { data } = await axiosOther.post("supplierlist", {
        Name: "",
        id: "",
        SupplierService: [5],
        DestinationId: [state?.DestinationId],
      });
      setSupplierList(data.DataList);
      if (data.DataList && data.DataList.length > 0) {
        setFormValue((prev) => ({
          ...prev,
          SupplierId: data.DataList[0].id,
        }));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getDataToServer();
  }, []);

  const getFromDate = () => {
    return formValue?.ValidFrom ? new Date(formValue?.ValidFrom) : null;
  };

  const getNextDate = () => {
    return formValue?.ValidTo ? new Date(formValue?.ValidTo) : null;
  };

  const handleNextCalender = (date) => {
    const formattedDate = date
      ? date.toLocaleDateString("en-GB").split("/").reverse().join("-")
      : "";
    setFormValue({
      ...formValue,
      ValidTo: formattedDate,
    });
  };

  const handleCalender = (date) => {
    const formattedDate = date
      ? date.toLocaleDateString("en-GB").split("/").reverse().join("-")
      : "";

    setFormValue({
      ...formValue,
      ValidFrom: formattedDate,
    });
  };

  const handleReset = () => {
    setIsUpdating(false);
    setFormValue(monumentRateInitialValue);
    setTacEditorValue("");
    setRemarksEditorValue("");
    setPolicyEditorValue("");
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await monumnetRateValidationSchema.validate(
        {
          ...formValue,
          MonumentId: id,
          DestinationID: state?.DestinationId,
        },
        { abortEarly: false }
      );

      // setValidationErrors({});
      const { data } = await axiosOther.post(
        isUpdating ? "updatemonumentrate" : "addmonumentrate",
        {
          ...formValue,
          MonumentId: id,
          DestinationID: state?.DestinationId,
          Remarks: remarksEditorValue,
          TAC: tacEditorValue,
          Policy: policyEditorValue,
        }
      );

      if (data?.Status == 1) {
        setFormValue(monumentRateInitialValue);
        setTacEditorValue("");
        setPolicyEditorValue("");
        setRemarksEditorValue("");
        notifyHotSuccess(data?.Message || data?.message);
        setIsUpdating(false);
        monumentRateList();
      } else {
        notifyHotError(data?.message || data?.Message);
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
    }
  };

  const handleTacEditorChange = (event, editor) => {
    const data = editor.getData();
    setTacEditorValue(data);
  };
  const handlePolicyEditorChange = (event, editor) => {
    const data = editor.getData();
    setPolicyEditorValue(data);
  };
  const handleRemarksEditorChange = (event, editor) => {
    const data = editor.getData();
    setRemarksEditorValue(data);
  };
  console.log(dataForUpdate, "formvalue1")
  useEffect(() => {
    console.log(dataForUpdate?.TaxSlabId, "dataForUpdate")
    if (dataForUpdate != "") {
      setIsUpdateData(true);
      setFormValue({
        RateUniqueId: dataForUpdate?.UniqueID,
        MonumentId: id,
        DestinationID: state?.DestinationId,
        ValidFrom: dataForUpdate?.ValidFrom,
        ValidTo: dataForUpdate?.ValidTo,
        CurrencyId: dataForUpdate?.CurrencyId,
        SupplierId: dataForUpdate?.SupplierId,
        IndianAdultEntFee: dataForUpdate?.IndianAdultEntFee,
        IndianChildEntFee: dataForUpdate?.IndianChildEntFee,
        ForeignerAdultEntFee: dataForUpdate?.ForeignerAdultEntFee,
        ForeignerChildEntFee: dataForUpdate?.ForeignerChildEntFee,
        TaxSlabId: dataForUpdate?.TaxSlabId,
        // TaxSlabId: ,
        CompanyId: dataForUpdate?.companyId,
        AddedDate: dataForUpdate?.AddedDate,
        UpdatedDate: currentDate(),
        Status: dataForUpdate?.Status == "1" ? "1" : "0",
        AddedBy: dataForUpdate?.AddedBy,
        UpdatedBy: dataForUpdate?.UpdatedBy,
      });
      setPolicyEditorValue(
        dataForUpdate?.Policy != null ? dataForUpdate?.Policy : ""
      );
      setTacEditorValue(dataForUpdate?.TAC != null ? dataForUpdate?.TAC : "");
      setRemarksEditorValue(
        dataForUpdate?.Remarks != null ? dataForUpdate?.Remarks : ""
      );
    }
  }, [dataForUpdate]);

  // useEffect(() => {
  //   const taxItem = taxSlab?.find((list) => list?.id == formValue?.TaxSlabId);
  //   if (taxItem) {
  //     setFormValue((prev) => {
  //       return {
  //         ...prev,
  //         CurrencyId: taxItem?.CurrencyID,
  //       };
  //     });
  //   } else {
  //     setFormValue((prev) => {
  //       return {
  //         ...prev,
  //         CurrencyId: "",
  //       };
  //     });
  //   }
  // }, [formValue?.TaxSlabId]);

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header py-3 justify-content-between d-flex">
            <h4 className="m-0 rate-heading-h4">
              {state?.Master}: {state?.MonumentName} , {state?.DestinationName}
            </h4>

            <div className="d-flex gap-3 justify-content-end">
              <button
                className="btn btn-dark btn-custom-size"
                name="SaveButton"
                onClick={() => navigate("/monument", {
                  state: {
                    selectedDestination: state?.selectedDestination,
                    selectmonumentname: state?.selectmonumentname,
                  },
                })}
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
              {/* {isupdateData && (
                <button onClick={handleReset} className="btn btn-primary">
                  Reset
                </button>
              )} */}
            </div>
          </div>
          <div className="card-body">
            <div className="form-validation">
              <form
                className="form-valide"
                action="#"
                method="post"
                onSubmit={handleSubmit}
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
                          {supplierList &&
                            supplierList?.length > 0 &&
                            supplierList.map((data, index) => (
                              <option value={data?.id}>{data?.Name}</option>
                            ))}
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
                        <label>Rate Valid From </label>
                        <DatePicker
                          className="form-control form-control-sm"
                          selected={getFromDate()}
                          name="FromDate"
                          onChange={(e) => handleCalender(e)}
                          dateFormat="dd-MM-yyyy"
                          isClearable todayButton="Today"
                        />
                      </div>
                      <div className="col-md-6 col-lg-2">
                        <label>Rate Valid To</label>
                        <DatePicker
                          className="form-control form-control-sm"
                          selected={getNextDate()}
                          name="FromDate"
                          onChange={(e) => handleNextCalender(e)}
                          dateFormat="dd-MM-yyyy"
                          isClearable todayButton="Today"
                        />
                      </div>
                      <div className="col-md-6 col-lg-2">
                        <label>
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
                          {currencymasterlist &&
                            currencymasterlist?.length > 0 &&
                            currencymasterlist.map((data, index) => (
                              <option value={data?.id}>
                                {data?.CurrencyName}
                              </option>
                            ))}
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
                      <div className="col-md-6 col-lg-2">
                        <div>
                          <label className="" htmlFor="name">
                            Adult (Indian)
                          </label>
                        </div>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          id="name"
                          name="IndianAdultEntFee"
                          value={formValue?.IndianAdultEntFee}
                          onChange={handleFormChange}
                          placeholder=" Adult (Indian)"
                        />
                      </div>
                      <div className="col-md-6 col-lg-2">
                        <div>
                          <label className="" htmlFor="name">
                            Child (Indian)
                          </label>
                        </div>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          id="name"
                          name="IndianChildEntFee"
                          value={formValue?.IndianChildEntFee}
                          onChange={handleFormChange}
                          placeholder=" Child (Indian)"
                        />
                      </div>
                      <div className="col-md-6 col-lg-2">
                        <div>
                          <label className="" htmlFor="name">
                            Adult (Foreigner)
                          </label>
                        </div>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          id="name"
                          name="ForeignerAdultEntFee"
                          value={formValue?.ForeignerAdultEntFee}
                          onChange={handleFormChange}
                          placeholder="  Adult (Foreigner)"
                        />
                      </div>
                      <div className="col-md-6 col-lg-2">
                        <div>
                          <label className="" htmlFor="name">
                            Child (Foreigner)
                          </label>
                        </div>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          id="name"
                          name="ForeignerChildEntFee"
                          value={formValue?.ForeignerChildEntFee}
                          onChange={handleFormChange}
                          placeholder=" Child (Foreigner)"
                        />
                      </div>

                      <div className="col-md-6 col-lg-2">
                        <label className="" htmlFor="status">
                          Tax Slab(TAX %) <span className="text-danger">*</span>
                        </label>
                        <select
                          name="TaxSlabId"
                          id="status"
                          className="form-control form-control-sm"
                          value={formValue?.TaxSlabId}
                          onChange={handleFormChange}
                        >
                          <option value="">Select</option>
                          {taxSlab &&
                            taxSlab?.length > 0 &&
                            taxSlab.map((data, index) => (
                              <option value={data?.id}>
                                {data?.TaxSlabName} ({data?.TaxValue})
                              </option>
                            ))}
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
                          <option value="0">InActive</option>
                        </select>
                      </div>
                    </div>
                    <div className="row mt-3 form-row-gap">
                      <div className="col-md-4 col-12">
                        <span className="m-0"> Policy</span>
                        <CKEditor
                          editor={ClassicEditor}
                          data={policyEditorValue}
                          onChange={handlePolicyEditorChange}
                        />
                      </div>
                      <div className="col-md-4 col-12">
                        <span className="m-0"> T&C</span>
                        <CKEditor
                          editor={ClassicEditor}
                          data={tacEditorValue}
                          onChange={handleTacEditorChange}
                        />
                      </div>
                      <div className="col-md-4 col-12">
                        <span className="m-0">Remarks</span>
                        <CKEditor
                          editor={ClassicEditor}
                          data={remarksEditorValue}
                          onChange={handleRemarksEditorChange}
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
                rateList={monumentRateList}
              />
            </div>
            <div className="d-flex gap-3 justify-content-end">
              <button
                className="btn btn-dark btn-custom-size"
                name="SaveButton"
                onClick={() => navigate("/monument", {
                  state: {
                    selectedDestination: state?.selectedDestination,
                    selectmonumentname: state?.selectmonumentname,
                  },
                })}
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
              {/* {isupdateData && (
                <button onClick={handleReset} className="btn btn-dark">
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

export default RateMonument;
