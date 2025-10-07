import React, { useState, useEffect } from "react";
import {
  activityMasterValidationSchema,
  activityRateValidationSchema,
} from "../master_validation";
import {
  activityMasterInitialValue,
  activityRateInitialValue,
} from "../masters_initial_value";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { axiosOther } from "../../../../http/axios_base_url";
import "react-international-phone/style.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer } from "react-toastify";
import { set } from "date-fns";
import { notifyHotError, notifyHotSuccess } from "../../../../helper/notify";
import { id } from "date-fns/locale";

const languageDescObj = [
  {
    id: 1,
    Description: "",
  },
  {
    id: 2,
    Description: "",
  },
  {
    id: 4,
    Description: "",
  },
];
const serviceInitial = {
  UpToPax: "",
  Rounds: "",
  Class: "",
  Duration: "",
  Amount: "",
  Remarks: "",
};
const weekendDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const Add = () => {
  const [formValue, setFormValue] = useState(activityMasterInitialValue);
  const [rateFormValue, setRateFormValue] = useState(activityRateInitialValue);
  const [validationErrors, setValidationErrors] = useState({});
  const [weekendDaysValue, setWeekendDaysValue] = useState([]);
  const [rateValidation, setRateValidation] = useState({});
  const [destinationList, setDestinationList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [editorData, setEditorData] = useState("");
  const [descriptionForm, setDescriptionForm] = useState(languageDescObj);
  const [languageList, setLanguageList] = useState([]);
  const [serviceCostForm, setServiceCostForm] = useState([serviceInitial]);
  const [currencyList, setCurrencyList] = useState([]);
  const [slabList, setSlabList] = useState([]);
  const [activityId, setActivityId] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [dataForUpdate, setDataForUpdate] = useState("");

  // console.log(activityId, "activityId")
  const { state } = useLocation();
  const navigate = useNavigate();
  const getDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("supplierlist", {
        Search: "",
        Status: 1,
        SupplierService: [3],
        DestinationId: [state?.data?.DestinationId],
      });
      setSupplierList(data.DataList);
    } catch (err) {
      console.log(err);
    }
    try {
      const { data } = await axiosOther.post("destinationlist", {
        Search: "",
        Status: 1,
      });
      setDestinationList(data.DataList);
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
        ServiceType: "3",
      });
      setSlabList(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getDataToServer();
  }, []);

  const fetchLanguages = async () => {
    const language = await axiosOther.post("languagelist", {
      Search: "",
      Status: 1,
    });
    setLanguageList(language.data.DataList);
  };
  useEffect(() => {
    fetchLanguages();
  }, []);

  useEffect(() => {
    if (!isUpdating) {  // Only run on add, not update
      const defaultCurrency = currencyList.find(
        (item) => item.CurrencyName === "INR"
      );
      if (defaultCurrency) {
        setRateFormValue((prev) => ({
          ...prev,
          CurrencyId: defaultCurrency.id,
        }));
      }
    }
  }, [currencyList, isUpdating]);

  const userDataString = localStorage.getItem("token");
  const userData = JSON.parse(userDataString);
  console.log(rateFormValue, "userData")
  // console.log(state, "state");
  // submitting data to server
  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasRateData =
      Array.isArray(state?.listrate?.data) &&
      state?.listrate?.data.some((item) => item !== null);

    setValidationErrors({});
    setRateValidation({});

    try {
      await activityMasterValidationSchema.validate(formValue, {
        abortEarly: false,
      });
      await activityRateValidationSchema.validate(rateFormValue, {
        abortEarly: false,
      });

      const { data } = await axiosOther.post("addupdateactivitymaster", {
        ...formValue,
        ServiceCost: serviceCostForm,
        ClosingDay: weekendDaysValue,
      });

      if (data?.Status == 1) {
        console.log(data, "data11")
        try {
          const payload =
          {
            ...rateFormValue,
            ActivityId: data?.Id || state?.data?.id,
            DestinationID: formValue?.Destination || state?.data?.DestinationId || " ",
            // Destination: formValue?.Destination || state?.data?.DestinationId || " ",
            SupplierId: data?.Id || state?.data?.SupplierId,
            ServiceCost: serviceCostForm,
            CompanyId: userData?.CompanyUniqueId || state?.companyId,
          }
          const rateURL = hasRateData ? "updateactivityrate" : "addactivityrate";
          const rateResp = await axiosOther.post(rateURL, payload);

          const descResp = await axiosOther.post("updateActivityLanguageDescription", {
            ...descriptionForm,
            Id: data?.Id || formValue.id,
            LanguageDescription: descriptionForm,
          });

          if (descResp) {
            setDescriptionForm(descResp?.data?.LanguageDescription);
          }

          if (rateResp?.data?.Status == 1 || data?.status == 1) {
            setFormValue(activityMasterInitialValue);
            setIsUpdating(false);
            setRateFormValue(activityRateInitialValue);
            setDataForUpdate("");
          }

          notifyHotSuccess(data?.Message || data?.message);
          navigate("/activity");

          if (data?.Status == 0 || data?.status == 0) {
            notifyHotSuccess(data?.Message || data?.message);
          }
        } catch (error) {
          console.log("rate-err", error);
          if (error.inner) {
            const errorMessages = error.inner.reduce((acc, curr) => {
              acc[curr.path] = curr.message;
              return acc;
            }, {});
            setRateValidation(errorMessages);
          }
          if (error.response?.data?.Errors) {
            const data = Object.entries(error.response?.data?.Errors);
            notifyHotError(data[0][1]);
          }
        }
      }
    } catch (error) {
      if (error.inner) {
        const validationErrorss = error.inner.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {});
        if (
          Object.keys(validationErrorss).some((key) =>
            Object.keys(rateFormValue).includes(key)
          )
        ) {
          setRateValidation(validationErrorss);
        } else {
          setValidationErrors(validationErrorss);
        }
      }

      if (error.response?.data?.Errors || error.response?.data?.errors) {
        const data = Object.entries(
          error.response?.data?.Errors || error.response?.data?.errors
        );
        notifyHotError(data[0][1]);
      }
      console.log("error", error);
    }
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;

    setFormValue((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "ServiceName") {
      setRateFormValue((pre) => ({ ...pre, Service: value }));
    }

    if (name === "Destination") {
      try {
        const payload = {
          Search: "",
          Status: 1,
          SupplierService: [3],
          DestinationId: value ? [Number(value)] : "",
        };
        const { data } = await axiosOther.post("supplierlist", payload);
        setSupplierList(data.DataList);
        if (data.DataList?.length > 0) {
          setFormValue((prev) => ({
            ...prev,
            Supplier: data.DataList[0]?.id,
          }));
        } else {
          setFormValue((prev) => ({
            ...prev,
            Supplier: "",
          }));
        }
      } catch (err) {
        console.log("Error fetching suppliers:", err);
      }
    }
  };

  useEffect(() => {
    if (state?.data) {
      setFormValue({
        id: state?.data?.id,
        Destination: state?.data?.DestinationId,
        Default: state?.data?.Default,
        Status: state?.data?.Status == "Active" ? "1" : "0",
        Type: state?.data?.Type,
        ServiceName: state?.data?.ServiceName,
        UniqueID: "",
        Supplier: state?.data?.SupplierId,
        cutofdayFIT: state?.data?.cutofdayFIT,
        cutofdayGIT: state?.data?.cutofdayGIT,
      });

      if (state?.data) {
        setWeekendDaysValue(state?.data?.ClosingDay || []);
      }
      setEditorData(
        state?.data?.Description != null ? state?.data?.Description : ""
      );
    }
  }, [state]);

  useEffect(() => {
    if (Array.isArray(languageList) && languageList.length) {
      const updatedList = languageList.map((item, index) => {
        const update =
          state?.listLanguageActivity?.[0]?.LanguageDescription?.[index];
        if (update) {
          return {
            ...item,
            id: update.LanguageId,
            Name: update.LanguageName,
          };
        }
        return item;
      });

      setLanguageList(updatedList);
      setDescriptionForm((prev) =>
        prev.map((desc, i) => {
          const lang = updatedList[i];
          return {
            ...desc,
            id: lang?.id ?? desc.id,
            LanguageName: lang?.Name ?? desc.LanguageName,
          };
        })
      );
    }

    return () => {
      setLanguageList([]);
    };
  }, [state?.listLanguageActivity, languageList.length]);

  useEffect(() => {
    if (
      Array.isArray(state?.listLanguageActivity) &&
      state.listLanguageActivity.length > 0
    ) {
      const newDescriptionForm = state.listLanguageActivity.flatMap((item) =>
        Array.isArray(item?.LanguageDescription) &&
          item.LanguageDescription.length > 0
          ? item.LanguageDescription.map((lang) => ({
            id: lang?.LanguageId || "",
            Description: lang?.LanguageDescription || "",
          }))
          : []
      );

      setDescriptionForm(newDescriptionForm);
    }
  }, [state]);

  useEffect(() => {

    if (state?.listrate?.data?.length > 0) {
      setIsUpdating(true);
      const firstValidTo = state.listrate.data[0]?.Data?.[0]?.RateDetails?.[0]?.ValidTo || "";
      const firstValidFrom = state.listrate.data[0]?.Data?.[0]?.RateDetails?.[0]?.ValidFrom || "";
      const CurrencyId = state.listrate.data[0]?.Data?.[0]?.RateDetails?.[0]?.CurrencyId || "";
      const ChildCost = state.listrate.data[0]?.Data?.[0]?.RateDetails?.[0]?.ChildCost || "";
      const TaxSlabId = state.listrate.data[0]?.Data?.[0]?.RateDetails?.[0]?.TaxSlabId || "";
      const UpdatedDate = state.listrate.data[0]?.Data?.[0]?.RateDetails?.[0]?.UpdatedDate || "";

      const dataForUpdate = state.listrate.data[0]?.Data?.[0]?.RateDetails?.[0]?.ServiceCost || "";
      // const TaxSlabId = state.listrate.data[0]?.Data?.[0]?.RateDetails?.[0]?.TaxSlabId || "";
      console.log(state?.listrate?.data, "222");

      let ServiceCosts = Array.isArray(dataForUpdate)

        ? dataForUpdate.map((desc) => ({
          UpToPax: desc?.UpToPax,
          Rounds: desc?.Rounds,
          Class: desc?.Class,
          Amount: desc?.Amount,
          Duration: desc?.Duration,
          Remarks: desc?.Remarks,
        }))
        : [];
      setServiceCostForm(ServiceCosts)


      setRateFormValue(prev => ({
        ...prev,
        ValidTo: firstValidTo,
        ValidFrom: firstValidFrom,
        CurrencyId: CurrencyId,
        ChildCost: ChildCost,
        TaxSlabId: TaxSlabId,
        RateUniqueId: state.listrate.data[0]?.Data?.[0]?.RateDetails?.[0]?.UniqueID || "",
        UpdatedDate: UpdatedDate,
        CompanyId: state?.companyId,
        SupplierId: state.listrate.data[0]?.Data?.[0]?.RateDetails?.[0]?.SupplierId,
        Service: state.listrate.data[0]?.Data?.[0]?.RateDetails?.[0]?.Service
      }));

    }
    else {
      setIsUpdating(false)
    }
  }, [state]);

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setEditorData(data);
  };
  // const handleServiceCostForm = (e, index) => {
  //   const { name, value } = e.target;
  //   setServiceCostForm((prevArr) => {
  //     const newArr = [...prevArr];
  //     newArr[index] = { ...newArr[index], [name]: value };
  //     return newArr;
  //   });
  // };
  const handleServiceCostForm = (e, index) => {
  const { name, value } = e.target;
  setServiceCostForm((prevArr) => {
    const newArr = [...prevArr];
    newArr[index] = { ...newArr[index], [name]: value };

    // Calculate Total Amount (Adult) if Rounds or Class is changed
    if (name === "Rounds" || name === "Class") {
      const rounds = parseFloat(newArr[index].Rounds) || 0;
      const classAmount = parseFloat(newArr[index].Class) || 0;
      newArr[index].Amount = (rounds * classAmount).toString(); // Calculate Total Amount
    }

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

  const getFromDate = () => {
    return rateFormValue?.ValidFrom ? new Date(rateFormValue?.ValidFrom) : null;
  };
  const getNextDate = () => {
    return rateFormValue?.ValidTo ? new Date(rateFormValue?.ValidTo) : null;
  };

  const handleNextCalender = (date) => {
    const formattedDate = date
      ? date.toLocaleDateString("en-GB").split("/").reverse().join("-")
      : ""; // empty if cleared

    setRateFormValue({
      ...rateFormValue,
      ValidTo: formattedDate,
    });
  };

  const handleCalender = (date) => {
    const formattedDate = date
      ? date.toLocaleDateString("en-GB") // dd/mm/yyyy
        .split("/")
        .reverse()
        .join("-") : "";
    setRateFormValue({
      ...rateFormValue,
      ValidFrom: formattedDate,
    });
  };

  const handleWeekendDaysValue = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setWeekendDaysValue([...weekendDaysValue, value]);
    } else {
      const filteredDays = weekendDaysValue.filter((day) => day !== value);
      setWeekendDaysValue(filteredDays);
    }
  };
  const handleDescriptionInc = () => {
    setDescriptionForm([...descriptionForm, languageDescObj]);
  };

  const handleDescriptionDec = (ind) => {
    const filteredDesc = descriptionForm?.filter((_, index) => ind != index);
    setDescriptionForm(filteredDesc);
  };

  const handleLanguageDescriptionChanges = (e, ind) => {
    const { name, value } = e.target;

    setDescriptionForm((prevArr) => {
      let newArr = [...prevArr];

      // Ensure the index exists
      newArr[ind] = { ...(newArr[ind] || {}), [name]: value };

      return newArr;
    });
  };

  const handleDescriptionFomChange = (index, e) => {
    const { name, value } = e.target;
    setDescriptionForm((prevForm) => {
      const newForm = [...prevForm];
      newForm[index] = { ...newForm[index], id: +value };
      return newForm;
    });
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

  useEffect(() => {
    if (slabList?.DataList?.length > 0) {
      setRateFormValue((prev) => ({
        ...prev,
        TaxSlabId: slabList.DataList[0]?.id,
      }));
    }
  }, [slabList]);

  // console.log(serviceCostForm, "check11")

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <ToastContainer />
          <div className="card-header py-3">
            <h4 className="card-title">Add Activity</h4>
            <div className="d-flex gap-3">
              <button
                className="btn btn-dark btn-custom-size"
                name="SaveButton"
                onClick={() => navigate("/activity", {
                  state: {
                    selectedDestination: state?.selectedDestination,
                    selectactivityname: state?.selectactivityname,
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
                    <label className="m-0">Destination<span className="text-danger">*</span></label>
                    <select
                      name="Destination"
                      id=""
                      className="form-control form-control-sm"
                      value={formValue?.Destination}
                      onChange={handleInputChange}
                    >
                      <option value="">Select</option>
                      {destinationList?.map((value, index) => {
                        return (
                          <option value={value.id} key={index + 1}>
                            {value.Name}
                          </option>
                        );
                      })}
                    </select>
                    {validationErrors?.Destination && (
                      <div
                        id="val-username1-error"
                        className="invalid-feedback animated fadeInUp"
                        style={{ display: "block" }}
                      >
                        {validationErrors?.Destination}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <label className="m-0">
                      Service Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Service Name"
                      className="form-control form-control-sm"
                      name="ServiceName"
                      value={formValue?.ServiceName}
                      onChange={handleInputChange}
                    />

                    {validationErrors?.ServiceName && (
                      <div
                        id="val-username1-error"
                        className="invalid-feedback animated fadeInUp"
                        style={{ display: "block" }}
                      >
                        {validationErrors?.ServiceName}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <label className="m-0">Type</label>
                    <select
                      name="Type"
                      id=""
                      className="form-control form-control-sm"
                      value={formValue?.Type}
                      onChange={handleInputChange}
                    >
                      <option value="Activity">Activity</option>
                      <option value="Experience">Experience</option>
                    </select>
                  </div>

                  {/*
                  <div className="col-md-6 col-lg-3">
                    <label className="m-0">Self Supplier</label>
                    <select
                      name="Supplier"
                      id=""
                      className="form-control form-control-sm"
                      // value={formValue?.Supplier}
                      // onChange={handleInputChange}
                    >
                      <option value="">Select</option>
                      <option value="1">YES</option>
                      <option value="2">NO</option>

                    </select>
                  </div> */}
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
                  <div className="col-md-6 col-lg-3">
                    <label>Set Default</label>
                    <div className="d-flex gap-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="Default"
                          value="1"
                          id="default_yes"
                          checked={formValue?.Default == "1"}
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
                          name="Default"
                          value="0"
                          id="default_no"
                          // checked={formValue?.Default?.includes("0")}
                          checked={formValue?.Default == "0"}
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
                  <div className="col-md-6 col-lg-3 d-flex flex-column gap-2">
                    <label className="m-0">Closing Days</label>
                    <div className="d-flex gap-3">
                      {weekendDays.map((day, index) => (
                        <div className="d-flex gap-1" key={index}>
                          <label htmlFor={day} className="m-0">
                            {day.slice(0, 3)}
                          </label>
                          <input
                            type="checkbox"
                            name={day}
                            value={day}
                            className="form-check-input height-em-1 width-em-1 me-1"
                            checked={weekendDaysValue.includes(day)}
                            onChange={handleWeekendDaysValue}
                            id={day}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <label className="m-0">Cut Of Day FIT</label>
                    <input
                      type="Number"
                      className="form-control form-control-sm"
                      name="cutofdayFIT"
                      value={formValue?.cutofdayFIT}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <label className="m-0">Cut Of Day GIT</label>
                    <input
                      type="Number"
                      className="form-control form-control-sm"
                      name="cutofdayGIT"
                      value={formValue?.cutofdayGIT}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="card shadow border mt-4">
                  <div className="card-body">
                    <div className="row form-row-gap py-1">
                      <div className="col-sm-6 col-lg-2">
                        <label className="" htmlFor="status">
                          Supplier Name
                          {/* <span className="text-danger">*</span> */}
                        </label>
                        <select
                          name="Supplier"
                          id=""
                          className="form-control form-control-sm"
                          value={formValue?.Supplier}
                          onChange={handleInputChange}
                        >
                          <option value="">Select</option>
                          {supplierList?.map((supplier, index) => (
                            <option value={supplier.id} key={index}>
                              {supplier.Name}
                            </option>
                          ))}
                        </select>
                        {rateValidation?.SupplierId && (
                          <div
                            id="val-username1-error"
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {rateValidation?.SupplierId}
                          </div>
                        )}
                      </div>
                      <div className="col-sm-6 col-lg-2">
                        <label>
                          Rate Valid From<span className="text-danger">*</span>{" "}
                        </label>
                        <DatePicker
                          className="form-control form-control-sm w-100"
                          selected={getFromDate()}
                          onChange={(e) => handleCalender(e)}
                          name="FromDate"
                          dateFormat="dd-MM-yyy"
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
                          dateFormat="dd-MM-yyy"
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
                          Currency
                          {/* <span className="text-danger">*</span> */}
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
                        {/* {rateValidation?.CurrencyId && (
                          <div
                            id="val-username1-error"
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {rateValidation?.CurrencyId}
                          </div>
                        )} */}
                      </div>

                      <div className="col-sm-6 col-lg-2">
                        <label className="" htmlFor="childCost">
                          ChildCost

                        </label>
                        <input
                          type="text"
                          name="ChildCost"
                          id="childCost"
                          className="form-control form-control-sm"
                          value={rateFormValue?.ChildCost}
                          onChange={handleRateFormChange}
                        ></input>
                        {/* 
                        {rateValidation?.PaxRange && (
                          <div
                            id="val-username1-error"
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {rateValidation?.PaxRange}
                          </div>
                        )} */}
                      </div>
                      <div className="col-sm-6 col-lg-2">
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
                        {/* {rateValidation?.TaxSlabId && (
                          <div
                            id="val-username1-error"
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {validationErrors?.TaxSlabId}
                          </div>
                        )} */}
                      </div>
                      {/* <div className="col-sm-6 col-lg-1">
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
                      </div> */}
                      <div className="col-12">
                        <table class="table table-bordered itinerary-table">
                          <thead>
                            <tr>
                              <th>S No</th>
                              <th>Upto Pax</th>
                              <th>No. of Days</th>
                              <th>Amount</th>
                              <th>Duration</th>
                              <th>Total Amount (Adult)</th>
                              <th className="text-area-width">Remarks</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          {/* <tbody>
                            {serviceCostForm?.map((service, index) => {
                              return (
                                <tr key={index + 1}>
                                  <td>{index + 1}</td>
                                  <td>
                                    <div>
                                      <input
                                        name="UpToPax"
                                        type="text"
                                        className="formControl1"
                                        value={service?.UpToPax || " "}
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
                                        value={service?.Rounds}
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
                                        value={service?.Class}
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
                                        value={service?.Duration}
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
                                        value={service?.Amount}
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
                                        value={service?.Remarks}
                                        onChange={(e) =>
                                          handleServiceCostForm(e, index)
                                        }
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    <div className="d-flex w-100 justify-content-center gap-2 ">
                                      <span
                                        onClick={() =>
                                          handleServiceIncrement(index)
                                        }
                                      >
                                        <i className="la la-plus border cursor-pointer bg-success text-white rounded-pill fontSize10px padding1px"></i>
                                      </span>
                                      <span
                                        onClick={() =>
                                          handleServiceDecrement(index)
                                        }
                                      >
                                        <i className="la la-minus  border cursor-pointer bg-primary text-white rounded-pill fontSize10px padding1px"></i>
                                      </span>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody> */}
                          <tbody>
                            {serviceCostForm && serviceCostForm.length > 0 ? (
                              serviceCostForm.map((service, index) => (
                                <tr key={index + 1}>
                                  <td>{index + 1}</td>
                                  <td>
                                    <div>
                                      <input
                                        name="UpToPax"
                                        type="text"
                                        className="formControl1"
                                        value={service?.UpToPax || ""}
                                        onChange={(e) => handleServiceCostForm(e, index)}
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    <div>
                                      <input
                                        name="Rounds"
                                        type="text"
                                        className="formControl1"
                                        value={service?.Rounds || ""}
                                        onChange={(e) => handleServiceCostForm(e, index)}
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    <div className="d-flex justify-content-center gap-2 flex-wrap">
                                      <input
                                        type="text"
                                        name="Class"
                                        className="formControl1 width100px"
                                        value={service?.Class || ""}
                                        onChange={(e) => handleServiceCostForm(e, index)}
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    <div className="d-flex justify-content-center gap-2 flex-wrap">
                                      <input
                                        type="text"
                                        name="Duration"
                                        className="formControl1 width100px"
                                        value={service?.Duration || ""}
                                        onChange={(e) => handleServiceCostForm(e, index)}
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    <div className="d-flex justify-content-center gap-2 flex-wrap">
                                      <input
                                        type="number"
                                        name="Amount"
                                        className="formControl1 width100px"
                                        value={service?.Amount || ""}
                                        onChange={(e) => handleServiceCostForm(e, index)}
                                      />
                                    </div>
                                  </td>
                                  <td className="text-area-width">
                                    <div className="d-flex justify-content-center gap-2 flex-wrap">
                                      <textarea
                                        name="Remarks"
                                        className="formControl1 w-100"
                                        value={service?.Remarks || ""}
                                        onChange={(e) => handleServiceCostForm(e, index)}
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    <div className="d-flex w-100 justify-content-center gap-2 ">
                                      <span onClick={() => handleServiceIncrement(index)}>
                                        <i className="la la-plus border cursor-pointer bg-success text-white rounded-pill fontSize10px padding1px"></i>
                                      </span>
                                      <span onClick={() => handleServiceDecrement(index)}>
                                        <i className="la la-minus border cursor-pointer bg-primary text-white rounded-pill fontSize10px padding1px"></i>
                                      </span>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td>1</td>
                                <td>
                                  <div>
                                    <input
                                      name="UpToPax"
                                      type="text"
                                      className="formControl1"
                                      onChange={(e) => handleServiceCostForm(e, 0)}
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div>
                                    <input
                                      name="Rounds"
                                      type="text"
                                      className="formControl1"
                                      onChange={(e) => handleServiceCostForm(e, 0)}
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div className="d-flex justify-content-center gap-2 flex-wrap">
                                    <input
                                      type="text"
                                      name="Class"
                                      className="formControl1 width100px"
                                      onChange={(e) => handleServiceCostForm(e, 0)}
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div className="d-flex justify-content-center gap-2 flex-wrap">
                                    <input
                                      type="text"
                                      name="Duration"
                                      className="formControl1 width100px"
                                      onChange={(e) => handleServiceCostForm(e, 0)}
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div className="d-flex justify-content-center gap-2 flex-wrap">
                                    <input
                                      type="number"
                                      name="Amount"
                                      className="formControl1 width100px"
                                      onChange={(e) => handleServiceCostForm(e, 0)}
                                    />
                                  </div>
                                </td>
                                <td className="text-area-width">
                                  <div className="d-flex justify-content-center gap-2 flex-wrap">
                                    <textarea
                                      name="Remarks"
                                      className="formControl1 w-100"
                                      onChange={(e) => handleServiceCostForm(e, 0)}
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div className="d-flex w-100 justify-content-center gap-2 ">
                                    <span onClick={() => handleServiceIncrement(0)}>
                                      <i className="la la-plus border cursor-pointer bg-success text-white rounded-pill fontSize10px padding1px"></i>
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card shadow border">
                  <div className="card shadow border">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-12 col-lg-12">
                          <table
                            className="table card-table display mb-4 shadow-hover default-table dataTablesCard dataTable no-footer mt-2"
                            id="example2"
                          >
                            <thead>
                              <tr>
                                <th>Sr. No.</th>
                                <th>Language</th>
                                <th>Description</th>
                                <th></th>
                              </tr>
                            </thead>
                            {/* <tbody>
                              {descriptionForm?.map((description, ind) => {
                                return (
                                  <tr key={ind + 1}>
                                    <td>{ind + 1}</td>
                                    <td>
                                      <select
                                        name="id"
                                        id="status"
                                        className="form-control form-control-sm"
                                        value={description?.id}
                                        onChange={(e) =>
                                          handleDescriptionFomChange(ind, e)
                                        }
                                      >
                                        <option value="">Select</option>
                                        {languageList?.map((lang, index) => (
                                          <option key={index} value={lang.id}>
                                            {lang.Name}
                                          </option>
                                        ))}
                                      </select>
                                    </td>
                                    <td>
                                      <div className="customheight-editor">
                                        <textarea
                                          type="text"
                                          className="form-control form-control-sm"
                                          name={"Description"}
                                          placeholder="Enter" // Dynamic placeholder
                                          value={description?.Description || ""}
                                          style={{ scrollbarWidth: "thin" }}
                                          onChange={(e) =>
                                            handleLanguageDescriptionChanges(
                                              e,
                                              ind
                                            )
                                          }
                                        ></textarea>
                                      </div>
                                    </td>
                                    <td>
                                      {ind == 0 ? (
                                        <button
                                          className="btn btn-primary btn-custom-size"
                                          onClick={handleDescriptionInc}
                                        >
                                          +
                                        </button>
                                      ) : (
                                        <button
                                          className="btn btn-primary btn-custom-size"
                                          onClick={() =>
                                            handleDescriptionDec(ind)
                                          }
                                        >
                                          -
                                        </button>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody> */}
                            <tbody>
                              {(descriptionForm && descriptionForm.length > 0 ? descriptionForm : [{}]).map(
                                (description, ind) => (
                                  <tr key={ind + 1}>
                                    <td>{ind + 1}</td>
                                    <td>
                                      <select
                                        name="id"
                                        id="status"
                                        className="form-control form-control-sm"
                                        value={description?.id || ""}
                                        onChange={(e) => handleDescriptionFomChange(ind, e)}
                                      >
                                        <option value="">Select</option>
                                        {languageList?.map((lang, index) => (
                                          <option key={index} value={lang.id}>
                                            {lang.Name}
                                          </option>
                                        ))}
                                      </select>
                                    </td>
                                    <td>
                                      <div className="customheight-editor">
                                        <textarea
                                          type="text"
                                          className="form-control form-control-sm"
                                          name="Description"
                                          placeholder="Enter"
                                          value={description?.Description || ""}
                                          style={{ scrollbarWidth: "thin" }}
                                          onChange={(e) => handleLanguageDescriptionChanges(e, ind)}
                                        ></textarea>
                                      </div>
                                    </td>
                                    <td>
                                      {ind === 0 ? (
                                        <button
                                          className="btn btn-primary btn-custom-size"
                                          onClick={handleDescriptionInc}
                                        >
                                          +
                                        </button>
                                      ) : (
                                        <button
                                          className="btn btn-primary btn-custom-size"
                                          onClick={() => handleDescriptionDec(ind)}
                                        >
                                          -
                                        </button>
                                      )}
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="d-flex gap-3 justify-content-end mt-1">
              <button
                className="btn btn-dark btn-custom-size"
                name="SaveButton"
                onClick={() => navigate("/activity", {
                  state: {
                    selectedDestination: state?.selectedDestination,
                    selectactivityname: state?.selectactivityname,
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
                Submit
              </button>
            </div>

            {/* <div className="d-flex gap-3 justify-content-end mt-1">
              <button
                onClick={handleDescriptionSubmit}
                className="btn btn-primary btn-custom-size"
              >
                Add
              </button>
            </div> */}
            {/* {descriptionList?.length > 0 && (
              <div className="col-md-12">
                <table
                  className="table card-table display mb-4 shadow-hover default-table dataTablesCard dataTable no-footer mt-2"
                  id="example3"
                >
                  <thead>
                    <tr>
                      <th>S. No.</th>
                      <th>Language</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {descriptionList?.map((list, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{list.languageName}</td>
                        <td>{htmlParser(list?.languageDescription)}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(index)}
                          >
                            <i className="fa fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add;
