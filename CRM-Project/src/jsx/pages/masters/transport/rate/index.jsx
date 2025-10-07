import React, { useState, useEffect, useCallback } from "react";
import {
  transportRateInitialValue,
  transportRateVehicleInitialValue,
} from "../../../masters/masters_initial_value.js";
import { transportRateValidationSchema } from "../../../masters/master_validation.js";
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
import { Button } from "react-bootstrap";
const languageDescObj = {
  id: "",
  description: "",
};

const TransportRate = () => {
  const { id } = useParams();
  const [formValue, setFormValue] = useState(transportRateInitialValue);
  const [validationErrors, setValidationErrors] = useState({});
  const [rateInitialList, setRateInitialList] = useState([]);
  const [dataForUpdate, setDataForUpdate] = useState("");
  const [supplierList, setSupplierList] = useState([]);
  const [descriptionForm, setDescriptionForm] = useState([languageDescObj]);
  const [currencyList, setCurrencyList] = useState([]);
  const [destinationList, setDestinationList] = useState([]);
  const [vehicleList, setVehicleList] = useState([]);
  const [languageList, setLanguageList] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [slabList, setSlabList] = useState([]);
  const [VehicleType, setLVehicleType] = useState(
    transportRateVehicleInitialValue.map((vehicle) => ({
      ...vehicle,
    }))
  );
  const [markettypemasterlist, setMarkettypemasterlist] = useState([]);
  const { state } = useLocation();
  const navigate = useNavigate();
  let companyIds = rateInitialList?.[0]?.companyId;

  const calculateTotal = useCallback(
    (vehicle) => {
      return (
        parseInt(vehicle.VehicleCost || 0) +
        parseInt(vehicle.ParkingFee || 0) +
        parseInt(vehicle.RapEntryFee || 0) +
        parseInt(vehicle.Assistance || 0) +
        parseInt(vehicle.AdtnlAllowance || 0) +
        parseInt(vehicle.InterStateToll || 0) +
        parseInt(vehicle.MiscCost || 0)
      ).toFixed(2);
    },
    [VehicleType]
  );
  const userData = JSON.parse(localStorage.getItem("token"));
  const companyId = userData?.companyKey;

  const calculateGrandTotal = useCallback(
    (vehicle) => {
      let total = (
        parseInt(vehicle.VehicleCost || 0) +
        parseInt(vehicle.ParkingFee || 0) +
        parseInt(vehicle.RapEntryFee || 0) +
        parseInt(vehicle.Assistance || 0) +
        parseInt(vehicle.AdtnlAllowance || 0) +
        parseInt(vehicle.InterStateToll || 0) +
        parseInt(vehicle.MiscCost || 0)
      ).toFixed(2);

      let findGst = slabList?.find((item) => item?.id == formValue?.TaxSlabId);

      let taxPercentage = parseInt(
        !isNaN(parseInt(findGst?.TaxValue)) ? findGst?.TaxValue : 0
      );

      let taxAmount = ((total * taxPercentage) / 100).toFixed(2);

      let grandTotal = (parseFloat(total) + parseFloat(taxAmount)).toFixed(2);

      return grandTotal;
    },
    [VehicleType, formValue?.TaxSlabId]
  );


  useEffect(() => {
    if (vehicleList.length > 0) {
      const langForm = transportRateVehicleInitialValue?.map((form, index) => {
        const vecId = vehicleList[index];
        // console.log(vecId, "vehicleList11");

        return {
          ...form,
          VehicleTypeId: vecId?.id,
        };
      });
      setLVehicleType(langForm);
      //   console.log(langForm, "langForm");
    }
  }, [vehicleList]);

  const getDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("transportratelist", {
        id: id,
      });
      setRateInitialList(data?.DataList);
    } catch (error) {
      console.log(error);
    }
    try {
      const res = await axiosOther.post("markettypemasterlist", {
        id: "",
        Name: "",
        Status: "",
      });
      setMarkettypemasterlist(res.data.DataList);
    } catch (err) {
      console.log(err);
    }
    try {
      const language = await axiosOther.post("languagelist", {
        Search: "",
        Status: 1,
      });
      setLanguageList(language.data.DataList);
    } catch (err) {
      console.log(err);
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
        SupplierService: [4],
        DestinationId: [state?.Destinations[0]?.id],
      });
      if (data?.DataList?.length > 0) {
        console.log(data?.DataList);
        setFormValue((prev) => ({
          ...prev,
          SupplierId: data?.DataList[0]?.id,
        }));
        setSupplierList(data?.DataList);
      }
    } catch (error) {
      console.log(error);
    }

    try {
      const { data } = await axiosOther.post("currencymasterlist", {
        id: "",
        Name: "",
        Status: "",
      });
      setCurrencyList(data?.DataList);

      // Set default CurrencyId to INR if it exists in the list
      const defaultCurrency = data?.DataList?.find(
        (item) => item.CurrencyName === "INR"
      );
      if (defaultCurrency) {
        setFormValue((prev) => ({
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
        ServiceType: "4",
      });
      if (data?.DataList?.length > 0) {
        console.log(data?.DataList);
        setSlabList(data?.DataList);
        setFormValue((prev) => ({
          ...prev,
          TaxSlabId: data?.DataList[0]?.id,
        }));
      } else {
        setSlabList([]);
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
    // console.log(new Date,"check")
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
    // setIsUpdating(false);
    setFormValue(transportRateInitialValue);
    setLVehicleType(
      transportRateVehicleInitialValue.map((vehicle) => ({
        ...vehicle,
        VehicleCost: "0",
        ParkingFee: "0",
        RapEntryFee: "0",
        Assistance: "0",
        GrandTotal: "0",
        AdtnlAllowance: "0",
        InterStateToll: "0",
        MiscCost: "0",
      }))
    );
  };

  // submitting data to server
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await transportRateValidationSchema.validate(
        {
          ...formValue,
          TransportId: id,
        },
        { abortEarly: false }
      );
      setValidationErrors({});
      const { data } = await axiosOther.post(
        isUpdating ? "updatetransportrate" : "addtransportrate",
        {
          ...formValue,
          TransportId: id,
          VehicleType: VehicleType,
          TransferType: state?.TransferTypeId,
          CompanyId: companyId,
        }
      );
      if (data?.Status == 1 || data?.status == 1) {
        setIsUpdating(false);
        getDataToServer();
        setFormValue(transportRateInitialValue);
        setLVehicleType(transportRateVehicleInitialValue);
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
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  console.log(formValue, "121212")
  // setting data for update
  useEffect(() => {
    if (dataForUpdate != "") {
      // console.log(dataForUpdate);
      setFormValue({
        TransportId: id,
        RateUniqueId: dataForUpdate?.UniqueID,
        SupplierId: dataForUpdate?.SupplierId,
        MarketTypeId: dataForUpdate?.MarketTypeId,
        CompanyId:
          dataForUpdate?.CompanyId == !null ? dataForUpdate?.CompanyId : "1",
        DestinationID: dataForUpdate?.DestinationID,
        DestinationName: dataForUpdate?.DestinationName,
        ValidFrom: dataForUpdate?.ValidFrom,
        ValidTo: dataForUpdate?.ValidTo,
        Type: dataForUpdate?.Type,
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
      //  setDestinationList(dataForUpdate?.DestinationID);

      let formattedLanguageArray = Array.isArray(dataForUpdate?.VehicleType)
        ? dataForUpdate.VehicleType.map((item) => ({
          VehicleTypeId: item.VehicleTypeId,
          VehicleCost: item.VehicleCost,
          ParkingFee: item.ParkingFee,
          RapEntryFee: item.RapEntryFee,
          Assistance: item.Assistance,
          AdtnlAllowance: item.AdtnlAllowance,
          InterStateToll: item.InterStateToll,
          MiscCost: item.MiscCost,
        }))
        : [];

      // Set the corrected array to state
      setLVehicleType(formattedLanguageArray);
      // if (state?.VehicleType) {
      //   const formattedLanguageArray = state.VehicleType.map((item) => ({
      //     id: item.VehicleTypeId,
      //     description: item.VehicleCost,
      //     ParkingFee: item.ParkingFee,
      //     RapEntryFee: item.RapEntryFee,
      //     Assistance: item.Assistance,
      //     AdtnlAllowance: item.AdtnlAllowance,
      //     InterStateToll: item.InterStateToll,
      //     MiscCost: item.MiscCost,
      //     // Total: item.Total,
      //   }));
      //   setLVehicleType(formattedLanguageArray)
    }
  }, [isUpdating, dataForUpdate]);

  const languageDescriptionIncrement = () => {
    setLVehicleType([...VehicleType, { Name: "" }]);
  };

  const languageDescriptionDecrement = (ind) => {
    const filteredLangDesc = VehicleType?.filter((des, index) => ind != index);
    setLVehicleType(filteredLangDesc);
  };

  const handleLanguageDescriptionChange = (index, e) => {
    const { name, value } = e.target;
    setLVehicleType((prevArr) => {
      const newArray = [...prevArr];
      newArray[index] = { ...newArray[index], [name]: value };
      return newArray;
    });
  };

  const handleDescriptionInc = () => {
    setDescriptionForm([...descriptionForm, languageDescObj]);
  };

  const handleDescriptionDec = (ind) => {
    const filteredDesc = descriptionForm?.filter((_, index) => ind != index);
    setDescriptionForm(filteredDesc);
  };

  const handleLanguageDescriptionChanges = (index, data) => {
    setDescriptionForm((prevForm) => {
      const newForm = [...prevForm];
      newForm[index] = { ...newForm[index], description: data };
      return newForm;
    });
  };

  const handleDescriptionFomChange = (index, e) => {
    const { name, value } = e.target;
    setDescriptionForm((prevForm) => {
      const newForm = [...prevForm];
      newForm[index] = { ...newForm[index], id: value };
      return newForm;
    });
  };
  useEffect(() => {
    if (destinationList?.length > 0) {
      setFormValue((prev) => ({
        ...prev,
        DestinationID: state?.Destinations[0]?.id,
      }));
    }
  }, [destinationList]);
  // console.log(formValue, "formvalue");

  useEffect(() => {
    if (supplierList?.length > 0) {
      setFormValue((prev) => ({
        ...prev,
        SupplierId: supplierList[0]?.id,
      }));
    }
  }, [supplierList]);

  useEffect(() => {
    const taxItem = slabList?.find((list) => list?.id == formValue?.TaxSlabId);
    if (taxItem) {
      setFormValue((prev) => {
        return {
          ...prev,
          CurrencyId: taxItem?.CurrencyID,
        };
      });
    } else {
      setFormValue((prev) => {
        return {
          ...prev,
          CurrencyId: "",
        };
      });
    }
  }, [formValue?.TaxSlabId]);

  // By Default Me MarketTypeId me General show hoga 

  useEffect(() => {
    if (
      markettypemasterlist &&
      markettypemasterlist.length > 0 &&
      !formValue?.MarketTypeId
    ) {
      const generalOption = markettypemasterlist.find(
        (item) => item.Name === "General"
      );
      if (generalOption) {
        setFormValue((prev) => ({
          ...prev,
          MarketTypeId: generalOption.id,
        }));
      }
    }
  }, [markettypemasterlist]);


  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <ToastContainer />
          <div className="card-header py-3  justify-content-between d-flex">
            <h4 className="m-0 rate-heading-h4">
              {state?.Master}: {state?.Name} ,{" "}
              {state?.Destinations?.length > 0 &&
                state?.Destinations.map((data, index) => (
                  <>
                    <span>{data?.Name}</span>
                    {index < state?.Destinations?.length - 1 && ","}
                  </>
                ))}
              {/* {console.log(state, "state")} */}
            </h4>
            <div className="d-flex gap-3 justify-content-end">
              <button
                className="btn btn-dark btn-custom-size"
                name="SaveButton"
                onClick={() => navigate("/transport", { state: { selectedDestination: state?.selectedDestination, selecttransfername: state?.selecttransfername, selectedTransferlist: state?.selectedTransferlist } })}
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
                      <div className="col-sm-6 col-md-3 col-lg-1">
                        <label className="m-0" htmlFor="status">
                          Market Type <span className="text-danger">*</span>
                        </label>
                        <select
                          name="MarketTypeId"
                          id="status"
                          className="form-control form-control-sm"
                          value={formValue?.MarketTypeId}
                          onChange={handleFormChange}
                        >
                          <option value="">Select</option>
                          {markettypemasterlist &&
                            markettypemasterlist?.length > 0 &&
                            markettypemasterlist.map((data, index) => (
                              <option value={data?.id}>{data?.Name}</option>
                            ))}
                        </select>
                        {validationErrors?.MarketTypeId && (
                          <div
                            id="val-username1-error"
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {validationErrors?.MarketTypeId}
                          </div>
                        )}
                      </div>
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
                          dateFormat="dd-MM-yyyy"
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
                          dateFormat="dd-MM-yyyy"
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
                      {/* <div className="col-md-6 col-lg-2">
                        <label className="" htmlFor="status">
                          Transfer Type
                        </label>
                        <select
                          name="Type"
                          id="status"
                          className="form-control form-control-sm"
                          value={formValue?.Type}
                          onChange={handleFormChange}
                        >
                          <option value="Package Cost">Package Cost</option>
                          <option value="Per Day Cost">Per Day Cost</option>
                        </select>
                      </div> */}
                      <div className="col-md-6 col-lg-1">
                        <label htmlFor="">
                          Tax Slab(%) <span className="text-danger">*</span>
                        </label>
                        <select
                          select
                          name="TaxSlabId"
                          id="TaxSlabId"
                          className="form-control form-control-sm"
                          value={formValue?.TaxSlabId}
                          onChange={handleFormChange}
                        >
                          <option value="">Select</option>
                          {slabList?.map((item) => {
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
                      <div className="col-md-6 col-lg-1">
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
                      {/* <div className="col-md-6 col-lg-1">
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

                      <div className="col-md-4 col-lg-2">
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
                      </div> */}

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
                      <div className="col-md-6 col-lg-12">
                        <label className="" htmlFor="Remarks">
                          Remarks
                        </label>
                        <textarea
                          name="Remarks"
                          id="status"
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Write your remarks"
                          value={formValue?.Remarks}
                          onChange={handleFormChange}
                          row="3"
                        ></textarea>
                      </div>
                      <div className="col-md-12 col-lg-12">
                        <table
                          style={{ border: "1px solid #c7c5c5" }}
                          className="table card-table display mb-4 shadow-hover default-table dataTablesCard dataTable no-footer mt-2"
                          id="example2"
                        >
                          <thead>
                            <tr>
                              <th>SN</th>
                              <th  colSpan="2">
                                <label htmlFor="status">
                                  Vehicle Type
                                  <span className="text-danger">*</span>
                                </label>
                              </th>
                              <th>
                                <label htmlFor="name">Vehicle Cost</label>
                              </th>
                              <th>
                                <label htmlFor="name">Parking Fee</label>
                              </th>
                              <th>
                                <label htmlFor="name">RapEntry Fee</label>
                              </th>
                              <th>
                                <label htmlFor="name">Assistance</label>
                              </th>
                              <th>
                                <label htmlFor="name">AdtnlAllowance</label>
                              </th>
                              <th>
                                <label htmlFor="name">InterStateToll</label>
                              </th>
                              <th>
                                <label htmlFor="name">Misc Cost</label>
                              </th>
                              <th>
                                <label htmlFor="name">Total</label>
                              </th>
                              <th>
                                <label htmlFor="name">Grand Total</label>
                              </th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {VehicleType?.map((des, ind) => (
                              <tr key={des.id || ind}>
                                <td>{ind + 1}</td>
                                <td colSpan="2">
                                  <select
                                    name="VehicleTypeId"
                                    className="form-control form-control-sm"
                                    value={des.VehicleTypeId}
                                    onChange={(e) =>
                                      handleLanguageDescriptionChange(ind, e)
                                    }
                                  >
                                    <option value="">Select</option>
                                    {vehicleList?.map((item) => (
                                      <option value={item?.id} key={item?.id}>
                                        {item?.Name}
                                      </option>
                                    ))}
                                  </select>
                                  {/* {console.log(vehicleList,"vehicleList11")} */}
                                </td>
                                <td>
                                  <input
                                    name="VehicleCost"
                                    value={des.VehicleCost}
                                    className="form-control form-control-sm"
                                    onChange={(e) =>
                                      handleLanguageDescriptionChange(ind, e)
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    name="ParkingFee"
                                    value={des.ParkingFee}
                                    className="form-control form-control-sm"
                                    onChange={(e) =>
                                      handleLanguageDescriptionChange(ind, e)
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    name="RapEntryFee"
                                    value={des.RapEntryFee}
                                    className="form-control form-control-sm"
                                    onChange={(e) =>
                                      handleLanguageDescriptionChange(ind, e)
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    name="Assistance"
                                    value={des.Assistance}
                                    className="form-control form-control-sm"
                                    onChange={(e) =>
                                      handleLanguageDescriptionChange(ind, e)
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    name="AdtnlAllowance"
                                    value={des.AdtnlAllowance}
                                    className="form-control form-control-sm"
                                    onChange={(e) =>
                                      handleLanguageDescriptionChange(ind, e)
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    name="InterStateToll"
                                    value={des.InterStateToll}
                                    className="form-control form-control-sm"
                                    onChange={(e) =>
                                      handleLanguageDescriptionChange(ind, e)
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    name="MiscCost"
                                    value={des.MiscCost}
                                    className="form-control form-control-sm"
                                    onChange={(e) =>
                                      handleLanguageDescriptionChange(ind, e)
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    name="Total"
                                    value={calculateTotal(des) || des.Total}
                                    className="form-control form-control-sm width5rem"
                                    onChange={(e) =>
                                      handleLanguageDescriptionChange(ind, e)
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    name="GrandTotal"
                                    value={
                                      calculateGrandTotal(des) || des.GrandTotal
                                    }
                                    className="form-control form-control-sm width5rem"
                                    onChange={(e) =>
                                      handleLanguageDescriptionChange(ind, e)
                                    }
                                  />
                                </td>

                                <td>
                                  <Button
                                    className="me-2 btn-custom-size"
                                    variant="primary"
                                    onClick={() =>
                                      ind > 0
                                        ? languageDescriptionDecrement(ind)
                                        : languageDescriptionIncrement()
                                    }
                                  >
                                    <span className="fs-4">
                                      {ind > 0 ? "-" : "+"}
                                    </span>
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
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
                onClick={() => navigate("/transport", { state: { selectedDestination: state?.selectedDestination, selecttransfername: state?.selecttransfername, selectedTransferlist: state?.selectedTransferlist } })}
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

export default TransportRate;
