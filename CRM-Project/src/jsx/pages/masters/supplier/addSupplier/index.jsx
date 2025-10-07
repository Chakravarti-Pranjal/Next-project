import React, { useState, useEffect } from "react";
import { supplierValidationSchema } from "../../master_validation";
import { supplierAddInitialValue } from "../../masters_initial_value";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useMultipleSelect from "../../../../../hooks/custom_hooks/useMultipleSelect";
import useDestinationSelect from "../../../../../hooks/custom_hooks/useDestinationSelect";
import { axiosOther } from "../../../../../http/axios_base_url";
import "../../../../../scss/main.css";
import { string } from "yup";
import { notifySuccess } from "../../../../../helper/notify";

const AddSupplier = () => {
  const [formValue, setFormValue] = useState(supplierAddInitialValue);
  const [validationErrors, setValidationErrors] = useState({});
  const [countryList, setCountryList] = useState([]);
  const [languageList, setLanguageList] = useState([]);
  const [businesstypelist, setBusinesstypelist] = useState([]);
  const [consortiamasterlist, setConsortiamasterlist] = useState([]);
  const [isomasterlist, setIsomasterlist] = useState([]);
  const [markettypemasterlist, setMarkettypemasterlist] = useState([]);
  const [companytypemasterlist, setCompanytypemasterlist] = useState([]);
  const [nationalitylist, setNationalitylist] = useState([]);
  const [tourlist, setTourlist] = useState([]);
  const [destinationList, setDestinationList] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [checkBoxArray, setCheckBoxArray] = useState([]);
  const [productList, setProductList] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false); // true in edit mode
  const { state } = useLocation();
  const navigate = useNavigate();

  const postDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("listproduct");
      setProductList(data?.Datalist);
      const allServicesId = data?.Datalist?.map((services) => services?.id);
      setCheckBoxArray(allServicesId);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    postDataToServer();
  }, []);
  // console.log(formValue, "formValue")

  const getDataToServer = async () => {
    try {
      const destination = await axiosOther.post("destinationlist", {
        Search: "",
        Status: 1,
      });
      setDestinationList(destination.data.DataList);
    } catch (err) {
      console.log(err);
    }
    try {
      const countryData = await axiosOther.post("countrylist", {
        Search: "",
        Status: 1,
      });
      setCountryList(countryData.data.DataList);
    } catch (err) {
      console.log(err);
    }
    try {
      const Data = await axiosOther.post("businesstypelist", {
        Search: "",
        Status: 1,
      });
      setBusinesstypelist(Data.data.DataList);
    } catch (err) {
      console.log(err);
    }
    try {
      const Data = await axiosOther.post("consortiamasterlist", {
        Search: "",
        Status: 1,
      });
      setConsortiamasterlist(Data.data.DataList);
    } catch (err) {
      console.log(err);
    }
    try {
      const Data = await axiosOther.post("isomasterlist", {
        Search: "",
        Status: 1,
      });
      setIsomasterlist(Data.data.DataList);
    } catch (err) {
      console.log(err);
    }
    try {
      const Data = await axiosOther.post("markettypemasterlist", {
        Search: "",
        Status: 1,
      });
      setMarkettypemasterlist(Data.data.DataList);
    } catch (err) {
      console.log(err);
    }
    try {
      const Data = await axiosOther.post("companytypemasterlist", {
        Search: "",
        Status: 1,
      });
      setCompanytypemasterlist(Data.data.DataList);
    } catch (err) {
      console.log(err);
    }
    try {
      const Data = await axiosOther.post("nationalitylist", {
        Search: "",
        Status: 1,
      });
      setNationalitylist(Data.data.DataList);
    } catch (err) {
      console.log(err);
    }
    try {
      const Data = await axiosOther.post("tourlist", {
        Search: "",
        Status: 1,
      });
      setTourlist(Data.data.DataList);
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

  const tourOption = tourlist?.map((tour) => {
    return {
      value: tour?.id,
      label: tour?.Name,
    };
  });

  // submitting data to server
  // const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     console.log("formValue", formValue)
  //     try {
  //         await supplierValidationSchema.validate(
  //             {
  //                 ...formValue,
  //                 Destination: selectedDestination,
  //                 DefaultDestination: selectedDefaultDestination,
  //             },
  //             { abortEarly: false }
  //         );

  //         setValidationErrors({});
  //         const { data } = await axiosOther.post("addupdatesupplier",
  //             {
  //                 ...formValue,
  //                 Destination: selectedDestination,
  //                 DefaultDestination: selectedDefaultDestination,

  //             });

  //         if (data?.Status == 1) {
  //             if (data?.SupplireId) {
  //                 navigate(`/view/supplier/${data?.SupplireId}`);
  //             }
  //             else {
  //                 navigate(`/view/supplier/${formValue?.id}`);
  //             }
  //             localStorage.setItem("success-message", data?.Message || data?.message);

  //         }
  //         if (data?.Status != 1) {
  //             notifyError(data?.message || data?.Message);
  //         }
  //     } catch (error) {
  //         if (error.inner) {
  //             const errorMessages = error.inner.reduce((acc, curr) => {
  //                 acc[curr.path] = curr.message;
  //                 return acc;
  //             }, {});
  //             setValidationErrors(errorMessages);
  //         }

  //         if (error.response?.data?.Errors) {
  //             const data = Object.entries(error.response?.data?.Errors);
  //             alert(data[0][1]);
  //         }

  //         console.log("error", error);
  //     }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate the form data
      await supplierValidationSchema.validate(
        {
          ...formValue,
          Destination: selectedDestination,
          DefaultDestination: selectedDefaultDestination,
          // Status: statusMapped,
        },
        { abortEarly: false }
      );

      setValidationErrors({});

      // Log the payload being sent to the API
      // console.log("Payload being sent to API:", {
      //   ...formValue,
      //   Destination: selectedDestination,
      //   DefaultDestination: selectedDefaultDestination,
      // });

      // Call the API
      const { data } = await axiosOther.post("addupdatesupplier", {
        ...formValue,
        Destination: selectedDestination,
        DefaultDestination: selectedDefaultDestination,
        // Status: statusMapped,
      });

      // Log the API response
      // console.log("API Response:", data);

      if (data?.Status == 1) {
        notifySuccess(data?.Message || data?.message)
        if (data?.SupplireId) {
          console.log(data?.SupplireId)
          navigate(`/view/supplier/${data?.SupplireId}`);
        } else {
          navigate(`/view/supplier/${formValue?.id}`);
        }
        // localStorage.setItem("success-message", data?.Message || data?.message);
      }

      if (data?.Status != 1) {
        notifyError(data?.message || data?.Message);
      }
    } catch (error) {
      // console.log(error);
      // console.log(error.inner);
      if (error.inner) {
        const errorMessages = error.inner.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {});
        setValidationErrors(errorMessages);

        // Log validation errors
        console.log("Validation Errors:", errorMessages);
      }

      if (error.response?.data?.Errors) {
        const data = Object.entries(error.response?.data?.Errors);
        alert(data[0][1]);

        // Log server errors
        console.log("Server Errors:", error.response?.data?.Errors);
      }

      // Log the full error object
      console.log("Error:", error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, file, type } = e.target;
    // console.log(name, value, "168");
    if (type == "file") {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result;
        const base64String = base64.split(",")[1];
        if (name === "AgreementTwoImageName") {
          setFormValue({
            ...formValue,
            AgreementTwoImageData: base64String,
            AgreementTwoImageName: file.name,
          });
        }
        if (name === "AgreementOneImageName") {
          setFormValue({
            ...formValue,
            AgreementOneImageData: base64String,
            AgreementOneImageName: file.name,
          });
        }
      };
      reader.readAsDataURL(file);
    } else {
      setFormValue((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  // console.log(state, "state");

  const {
    SelectInput: DestinatinoSelectInput,
    selectedDestination,
    setSelectedDestination,
  } = useDestinationSelect();
  const {
    SelectInput: DefaultDestinationSelectInput,
    selectedDestination: selectedDefaultDestination,
    setSelectedDestination: setSelectedDefaultDestination,
  } = useDestinationSelect();
  // setting data to form for update
  useEffect(() => {
    console.log(state, "state")
    if (state) {
      setFormValue({
        ...formValue,
        id: state?.id,
        Name: state?.Name,
        AliasName: state?.AliasName,
        Gst: state?.Gst,
        Status: state?.Status,
        PanInformation: state?.PanInformation,
        SupplierService: state?.SupplierServiceName?.map((item) => item?.id),

        DestinationName: [],
        PaymentTerm: state?.PaymentTerm,
        ConfirmationType: state?.ConfirmationType,
        DefaultDestination: [],
        LocalAgent: state?.LocalAgent,
        Agreement: state?.Agreement,
        Remarks: state?.Remarks,
        AddedBy: "0",
        UpdatedBy: "1",
        AgreementOneImageName: state?.AgreementOneImageName,
        AgreementOneImageData: "",
        AgreementTwoImageName: state?.AgreementTwoImageName,
        AgreementTwoImageData: "",
      });
      setSelectedServices(state?.SupplierServiceName?.map((item) => Number(item?.id)));

      setSelectedDestination(state?.DestinationName?.map((item) => item?.id));
      setSelectedDefaultDestination(
        state?.DefaultDestination.map((item) => item.id)
      );
    }
  }, [state]);
  // console.log(state, "state")

  const intialTourId = state?.TourTypeId;

  // console.log(formValue, "236");
  const handleAgentInfo = (data) => {
    const cleanedData = data.replace(/<[^>]*>/g, "");
    setFormValue((prevState) => ({
      ...prevState,
      AgentInfo: cleanedData, // Update Description field in state
    }));
  };
  const handleRemarks = (data) => {
    const cleanedData = data.replace(/<[^>]*>/g, "");
    setFormValue((prevState) => ({
      ...prevState,
      Remarks: cleanedData, // Update Description field in state
    }));
  };
  const {
    SelectInput: TourInput,
    selectedData: tourSelected,
    setSelectedData: setTourSelected,
  } = useMultipleSelect(tourOption, intialTourId);

  // console.log(selectedServices, "72");
  const handleEveryCheck = (element) => selectedServices?.includes(element);

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;

    if (checked && value != "allSelected") {
      // Add the checked value to the array
      setSelectedServices([...selectedServices, Number(value)]);
      setFormValue({
        ...formValue,
        SupplierService: [...selectedServices, String(value)],
      });
    } else if (value == "allSelected" && checked) {
      // set all check box
      setSelectedServices(checkBoxArray);
      setFormValue({ ...formValue, SupplierService: [...checkBoxArray] });
    } else if (value == "allSelected" && !checked) {
      //remove al checkbox
      setSelectedServices([]);
      setFormValue({ ...formValue, SupplierService: [] });
    } else {
      // Remove the unchecked value from the array
      setSelectedServices(
        selectedServices.filter((service) => service !== Number(value))
      );
      setFormValue({
        ...formValue,
        SupplierService: [
          ...selectedServices.filter((service) => service !== Number(value)),
        ],
      });
    }
    // selectedServices.join(',');
    // console.log(selectedServices.join(","), "103");
  };


  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header py-3">
            <h4 className="card-title">Add Supplier</h4>
            <div className="d-flex gap-3">
              <button
                className="btn btn-dark btn-custom-size"
                name="SaveButton"
                onClick={() => navigate("/supplier", { state: { selectedDestination: state?.selectedDestination, selectSuppliername: state?.selectSuppliername, supplierserviceid: state?.supplierserviceid } })}
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
                <div className="row">
                  <div className="col-12">
                    <div className="row form-row-gap">
                      <div className="col-md-6 col-lg-3 mt-2">
                        <div className="d-flex justify-content-between">
                          <label className="" htmlFor="name">
                            Supplier Name
                            <span className="text-danger fs-6">*</span>
                          </label>
                        </div>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="name"
                          name="Name"
                          value={formValue?.Name}
                          onChange={handleFormChange}
                          placeholder="Supplier Name"
                        />
                        {validationErrors?.Name && (
                          <span className="font-size-12 text-danger">
                            {validationErrors?.Name}
                          </span>
                        )}
                      </div>
                      <div className="col-md-6 col-lg-3 mt-2">
                        <div className="d-flex justify-content-between">
                          <label className="" htmlFor="name">
                            Alias Name  <span className="text-danger fs-6">*</span>
                          </label>
                        </div>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="name"
                          name="AliasName"
                          value={formValue?.AliasName}
                          onChange={handleFormChange}
                          placeholder="Alias Name
"
                        />
                        {validationErrors?.AliasName && (
                          <span className="font-size-12 text-danger">
                            {validationErrors?.AliasName}
                          </span>
                        )}
                      </div>
                      <div className="col-md-6 col-lg-3 mt-2">
                        <div className="d-flex justify-content-between">
                          <label className="" htmlFor="Gst">
                            GST
                          </label>
                        </div>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="Gst"
                          name="Gst"
                          value={formValue?.Gst}
                          onChange={handleFormChange}
                          placeholder="Gst
"
                        />
                      </div>
                      <div className="col-md-6 col-lg-3 mt-2">
                        <div className="d-flex justify-content-between">
                          <label className="" htmlFor="name">
                            PAN Information
                          </label>
                        </div>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="name"
                          name="PanInformation"
                          value={formValue?.PanInformation}
                          onChange={handleFormChange}
                          placeholder="PAN Information"
                        />
                      </div>

                      <div className="col-md-6 col-lg-3">
                        <label htmlFor="destionation">
                          Destination
                          <span className="text-danger fs-6">*</span>
                        </label>
                        <DestinatinoSelectInput />
                        {validationErrors?.Destination && (
                          <span className="font-size-12 text-danger">
                            {validationErrors?.Destination}
                          </span>
                        )}
                      </div>
                      <div className="col-md-6 col-lg-3">
                        {/* <div className="d-flex justify-content-between "> */}
                        <label className="" htmlFor="status">
                          Default Destination
                          {/* <span className="text-danger fs-6">*</span> */}
                        </label>
                        <DefaultDestinationSelectInput />
                      </div>

                      <div className="col-md-6 col-lg-3">
                        <label className="" htmlFor="status">
                          Status
                          {/* <span className="text-danger">*</span> */}
                        </label>
                        <select
                          name="Status"
                          id="status"
                          className="form-control form-control-sm"
                          value={formValue?.Status}
                          onChange={handleFormChange}
                        >
                          <option value="Yes">Active</option>
                          <option value="No">Inactive</option>
                        </select>
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <label>Payment Term</label>
                        <div className="d-flex gap-3">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="PaymentTerm"
                              value="Cash"
                              id="default_yes"
                              checked={formValue?.PaymentTerm === "Cash"}
                              onChange={handleFormChange}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="default_yes"
                            >
                              Cash
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="PaymentTerm"
                              value="Credit"
                              id="default_no"
                              checked={formValue?.PaymentTerm === "Credit"}
                              onChange={handleFormChange}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="default_no"
                            >
                              Credit
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <label>Confirmation Type</label>
                        <div className="d-flex gap-3">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="ConfirmationType"
                              value="Auto"
                              id="default_yes"
                              checked={formValue?.ConfirmationType == "Auto"}
                              onChange={handleFormChange}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="default_yes"
                            >
                              Auto
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="ConfirmationType"
                              value="Manual"
                              id="default_no"
                              checked={formValue?.ConfirmationType == "Manual"}
                              onChange={handleFormChange}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="default_no"
                            >
                              Manual
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <label>Agreement</label>
                        <div className="d-flex gap-3">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="Agreement"
                              value="Yes"
                              id="default_yes"
                              checked={formValue?.Agreement == "Yes"}
                              onChange={handleFormChange}
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
                              name="Agreement"
                              value="No"
                              id="default_no"
                              checked={formValue?.Agreement == "No"}
                              onChange={handleFormChange}
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
                      {formValue.Agreement == "Yes" && (
                        <>
                          <div className="col-md-6 col-lg-3">
                            <label className="" htmlFor="val-username">
                              1. Agreement Attachment
                            </label>

                            <input
                              type="file"
                              className="form-control form-control-sm"
                              id="val-username"
                              name="AgreementOneImageName"
                              accept=".pdf, .doc, .docx, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/pdf"
                              onChange={handleFormChange}
                              placeholder="1 Agreement Attachment"
                            />
                          </div>
                          <div className="col-md-6 col-lg-3">
                            <div className="">
                              <label className="" htmlFor="val-username">
                                2. Agreement Attachment
                              </label>
                              <input
                                type="file"
                                className="form-control form-control-sm"
                                id="val-username"
                                name="AgreementTwoImageName"
                                accept=".pdf, .doc, .docx, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/pdf"
                                onChange={handleFormChange}
                              />
                            </div>
                          </div>
                        </>
                      )}

                      <div className="col-md-6 col-lg-3">
                        <label>Local Agent</label>
                        <div className="d-flex gap-3">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="LocalAgent"
                              value="Yes"
                              id="default_yes"
                              checked={formValue?.LocalAgent == "Yes"}
                              onChange={handleFormChange}
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
                              name="LocalAgent"
                              value="No"
                              id="default_no"
                              checked={formValue?.LocalAgent == "No"}
                              onChange={handleFormChange}
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
                        <label className="" htmlFor="val-username">
                          Remarks
                        </label>
                        <textarea
                          type="text"
                          className="form-control form-control-sm"
                          id="val-username"
                          name="Remarks"
                          placeholder="Remarks"
                          value={formValue?.Remarks}
                          onChange={handleFormChange}
                        ></textarea>
                      </div>
                      <div className="col-md-12 col-lg-12">
                        <div className="d-flex justify-content-between">
                          <label htmlFor="supplierservices" className="m-0">
                            Supplier Services
                            <span className="text-danger fs-6">*</span>
                          </label>
                        </div>
                        <div className="border p-2 rounded d-flex flex-column gap-1">
                          <div className="check-box d-flex gap-2 alin-items-center">
                            <input
                              type="checkbox"
                              id="allselect"
                              name="SupplierService"
                              value={"allSelected"}
                              onChange={handleCheckboxChange}
                              checked={checkBoxArray.every(handleEveryCheck)}
                            />
                            <label htmlFor="allselect" className="m-0">
                              All Select Services
                            </label>
                          </div>
                          {productList.map((services, index) => {
                            return (
                              <div
                                className="check-box d-flex gap-2 alin-items-center"
                                key={index + 1}
                              >
                                <input
                                  type="checkbox"
                                  id={services?.name + index}
                                  name="SupplierServices"
                                  onChange={handleCheckboxChange}
                                  value={services?.id}
                                  checked={selectedServices?.includes(
                                    Number(services?.id)
                                  )}
                                />

                                <label
                                  htmlFor={services?.name + index}
                                  className="m-0"
                                >
                                  {services?.name}
                                </label>
                              </div>
                            );
                          })}
                        </div>
                        {validationErrors?.SupplierService && (
                          <span className="text-danger font-size-12">
                            {validationErrors.SupplierService}
                          </span>
                        )}
                      </div>
                    </div>
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

export default AddSupplier;
