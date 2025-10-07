import React, { useState, useEffect } from "react";
import { agentMasterValidationSchema } from "../../../master_validation";
import { agentMasterInitialValue } from "../../../masters_initial_value";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useMultipleSelect from "../../../../../../hooks/custom_hooks/useMultipleSelect";
import { axiosOther } from "../../../../../../http/axios_base_url";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "../../../../../../scss/main.css";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { notifyError, notifySuccess } from "../../../../../../helper/notify";

const AddAgent = () => {
  const [formValue, setFormValue] = useState(agentMasterInitialValue);
  const [validationErrors, setValidationErrors] = useState({});
  const [countryList, setCountryList] = useState([]);
  const [languageList, setLanguageList] = useState([]);
  const [businesstypelist, setBusinesstypelist] = useState([]);
  const [consortiamasterlist, setConsortiamasterlist] = useState([]);
  const [isomasterlist, setIsomasterlist] = useState([]);
  const [Saleslist, setSaleslist] = useState([]);
  const [markettypemasterlist, setMarkettypemasterlist] = useState([]);
  const [companytypemasterlist, setCompanytypemasterlist] = useState([]);
  const [nationalitylist, setNationalitylist] = useState([]);
  const [tourlist, setTourlist] = useState([]);
  const [urlError, setUrlError] = useState("");
  const [showEmailInfo, setShowEmailInfo] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [showImage, setShowImage] = useState(true);
  const [showAgentHeaderImage, setShowAgentHeaderImage] = useState(true);
  const [showAgentFooterImage, setShowAgentFooterImage] = useState(true);

  const { state } = useLocation();
  const navigate = useNavigate();
  const getDataToServer = async () => {
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
      const salaperson = await axiosOther.post("fetch-sales-person", {
        Name: "Sales",
      });
      setSaleslist(salaperson?.data.SalesPersons);
    } catch (error) { }
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
      console.log(language.data.DataList, "language.data.DataList")
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getDataToServer();
  }, []);
  console.log(formValue, "formValue")

  const tourOption = tourlist?.map((tour) => {
    return {
      value: tour?.id,
      label: tour?.Name,
    };
  });

  useEffect(() => {
    if (companytypemasterlist?.length > 0 && !formValue.CompanyType) {
      const privateLimited = companytypemasterlist.find(
        (item) => item?.Name?.toLowerCase() === "private limited"
      );
      if (privateLimited) {
        setFormValue((prev) => ({
          ...prev,
          CompanyType: privateLimited.id,
        }));
      }
    }

    if (businesstypelist?.length > 0 && !formValue?.BussinessType) {
      const agent = businesstypelist.find(
        (item) => item?.Name?.toLowerCase() === "agent"
      );
      if (agent) {
        setFormValue((prev) => ({
          ...prev,
          BussinessType: agent.id,
        }));
      }
    }
  }, [companytypemasterlist, businesstypelist]);
  const handlePhoneChange = (phone, nameValue) => {
    setFormValue({ ...formValue, [nameValue]: phone });
  };
  // submitting data to server
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingBtn(true)
    try {
      await agentMasterValidationSchema.validate(
        {
          ...formValue,
          TourType: tourSelected,
        },
        { abortEarly: false }
      );
      setValidationErrors({});
      const { data } = await axiosOther.post("addupdateagent", {
        ...formValue,
        TourType: tourSelected,
        Country: +(formValue?.Country)

      });

      if (data?.Status === 1) {
        notifySuccess(data?.Message || data?.message || data?.error);
        navigate(`/view/agent/${data?.AgentId}`);
        localStorage.setItem("success-message", data?.Message || data?.message);
      }
      if (data?.Status != 1) {
        notifyError(data?.message || data?.Message);
      }
    } catch (error) {
      if (error.inner) {
        const errorMessages = error.inner.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {});
        setValidationErrors(errorMessages);
      }

      if (error.response?.data?.Errors || error.response?.data?.errors) {
        const data = Object.entries(
          error.response?.data?.Errors || error.response?.data?.errors
        );
        notifyError(data[0][1]);
        // alert(data[0][1]);
      }
    }
    finally {
      setLoadingBtn(false)
    }
  };

  const handleFormChange = (e) => {
    const { name, value, file, type } = e.target;
    // Check for valid URL
    if (name === "WebsiteUrl") {
      const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;

      if (value.trim() === "" || urlRegex.test(value)) {
        setUrlError(""); // valid or empty
      } else {
        setUrlError("Please enter a valid URL https://example.com");
      }
    }
    // if (name === "Country") {
    //   setFormValue({
    //     ...formValue,
    //     Country: parseInt(formValue?.Country)
    //   })

    // }
    //  Check for Image 
    if (type == "file") {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result;
        const base64String = base64.split(",")[1];
        if (name === "AgentHeaderImageName") {
          setFormValue({
            ...formValue,
            AgentHeaderImageData: base64String,
            AgentHeaderImageName: file.name,
          });
        } else if (name === "AgentFooterImageName") {
          setFormValue({
            ...formValue,
            AgentFooterImageData: base64String,
            AgentFooterImageName: file.name,
          });
        } else {
          setFormValue({
            ...formValue,
            CompanyLogoImageData: base64String,
            CompanyLogoImageName: file.name,
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
  // setting data to form for update
  useEffect(() => {
    if (state) {
      setFormValue({
        ...formValue,
        id: state?.id,
        BussinessType: state?.BussinessTypeId,
        WebsiteUrl: state?.WebsiteUrl,
        SalesPerson: state?.SalesPersonId,
        OperationsPerson: state?.OperationsPersonId,
        CompanyName: state?.CompanyName,
        CompanyType: state?.CompanyTypeId,
        Consortia: state?.ConsortiaId,
        ISO: state?.ISOId,
        CompanyEmailAddress: state?.CompanyEmailAddress,
        CompanyPhoneNumber: state?.CompanyPhoneNumber,
        Competitor: state?.Competitor,
        MarketType: state?.MarketTypeId,
        LocalAgent: state?.LocalAgent,
        Nationality: state?.NationalityId,
        Country: parseInt(state?.CountryId),
        Category: state?.Category,
        PreferredLanguage: state?.PreferredLanguageId,
        Status: state?.Status === "Active" ? "1" : "0",
        Remarks: state?.Remarks,
        AgentInfo: state?.AgentInfo,
        CompanyLogoImageName: state?.CompanyLogoImageName,
        AgentFooterImageName: state?.AgentFooterImageName,
        AgentHeaderImageName: state?.AgentHeaderImageName,
        // AgentFooterImageName: state?.AgentFooterImageName,
        // AgentHeaderImageName: state?.AgentHeaderImageName,
      });
    }
  }, [state]);
  const intialTourId = state?.TourTypeId;

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
  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header py-3">
            <h4 className="card-title">Company Information</h4>
            <div className="d-flex gap-3 ">
              <button
                className="btn btn-dark btn-custom-size"
                name="SaveButton"
                onClick={() => navigate("/agent", {
                  state: {
                    selectedBussinessType: state?.selectedBussinessType,
                    selectedCountry: state?.selectedCountry,
                    selectUniqueId: state?.selectUniqueId,
                    selectCompanyName: state?.selectCompanyName
                  }
                })}
              >
                <span className="me-1">Back</span>
                <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
              </button>
              {/* <button
                onClick={handleSubmit}
                className="btn btn-primary btn-custom-size"
              >
                Submit
              </button> */}
              <button
                type="button"
                className="btn btn-primary btn-custom-size d-flex align-items-center gap-1"
                style={{
                  cursor: loadingBtn ? "no-drop" : "pointer",
                  opacity: loadingBtn ? 0.7 : 1,
                }}
                disabled={loadingBtn}
                onClick={handleSubmit}
              >
                {loadingBtn && (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                )}
                {loadingBtn ? "Submitting..." : "Submit"}
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
                      <div className="col-md-6 col-lg-3">
                        <label className="fs-7" htmlFor="status">
                          Business Type
                          {/* <span className="text-danger">*</span> */}
                        </label>
                        <select
                          name="BussinessType"
                          id="status"
                          className="form-control form-control-sm"
                          value={formValue?.BussinessType}
                          onChange={handleFormChange}
                        >
                          <option value="">Select</option>
                          {businesstypelist &&
                            businesstypelist?.length > 0 &&
                            businesstypelist.map((data, index) => (
                              <option value={data?.id}>{data?.Name}</option>
                            ))}
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
                      <div className="col-md-6 col-lg-3 mt-2">
                        <div className="d-flex justify-content-between">
                          <label className="fs-7" htmlFor="name">
                            Website Url
                          </label>
                        </div>
                        <input
                          type="text"
                          // className="form-control form-control-sm"
                          className={`form-control form-control-sm ${urlError ? "is-invalid" : ""}`}
                          id="name"
                          name="WebsiteUrl"
                          value={formValue?.WebsiteUrl}
                          onChange={handleFormChange}
                          placeholder="Website Url"
                        />
                        {urlError && <div className="invalid-feedback">{urlError}</div>}
                      </div>

                      <div className="col-md-6 col-lg-3 mt-2">
                        <div className="d-flex justify-content-between">
                          <label className="fs-7" htmlFor="country">
                            Sales Person
                            <span className="text-danger">*</span>
                          </label>
                        </div>
                        <select
                          name="SalesPerson"
                          id="country"
                          className="form-control form-control-sm"
                          value={formValue?.SalesPerson}
                          onChange={handleFormChange}
                        >
                          <option value="">Select</option>
                          {Saleslist?.map((sales, index) => {
                            return (
                              <option value={sales.Id} key={index + 1}>
                                {sales.Name}
                              </option>
                            );
                          })}
                        </select>
                        {validationErrors?.SalesPerson && (
                          <div
                            id="val-username1-error"
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {validationErrors?.SalesPerson}
                          </div>
                        )}
                      </div>
                      <div className="col-md-6 col-lg-3 mt-2">
                        <div className="d-flex justify-content-between">
                          <label className="fs-7" htmlFor="country">
                            Operation Person
                          </label>
                        </div>
                        <select
                          name="OperationsPerson"
                          id="country1"
                          className="form-control form-control-sm"
                          value={formValue?.OperationsPerson}
                          onChange={handleFormChange}
                        >
                          <option value="">Select</option>
                          <option value={1}>Rizwan</option>
                        </select>
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <div className="d-flex justify-content-between">
                          <label className="" htmlFor="name">
                            Company Name
                            <span className="text-danger">*</span>
                          </label>
                        </div>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="name"
                          name="CompanyName"
                          value={formValue?.CompanyName}
                          onChange={handleFormChange}
                          placeholder="Name"
                        />

                        {validationErrors?.CompanyName && (
                          <div
                            id="val-username1-error"
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {validationErrors?.CompanyName}
                          </div>
                        )}
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <label className="" htmlFor="status">
                          Company Type
                        </label>
                        <select
                          name="CompanyType"
                          id="status"
                          className="form-control form-control-sm"
                          value={formValue?.CompanyType}
                          onChange={handleFormChange}
                        >
                          <option value="">Select</option>
                          {companytypemasterlist &&
                            companytypemasterlist?.length > 0 &&
                            companytypemasterlist.map((data, index) => (
                              <option value={data?.id}>{data?.Name}</option>
                            ))}
                        </select>
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <label className="" htmlFor="status">
                          Consortia
                        </label>
                        <select
                          name="Consortia"
                          id="status"
                          className="form-control form-control-sm"
                          value={formValue?.Consortia}
                          onChange={handleFormChange}
                        >
                          <option value="">Select</option>
                          {consortiamasterlist &&
                            consortiamasterlist?.length > 0 &&
                            consortiamasterlist.map((data, index) => (
                              <option value={data?.id}>{data?.Name}</option>
                            ))}
                        </select>
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <label className="" htmlFor="status">
                          ISO
                        </label>
                        <select
                          name="ISO"
                          id="status"
                          className="form-control form-control-sm"
                          value={formValue?.ISO}
                          onChange={handleFormChange}
                        >
                          <option value="">Select</option>
                          {isomasterlist?.length > 0 &&
                            isomasterlist.map((value, index) => {
                              return (
                                <option value={value.id} key={index + 1}>
                                  {value.Name}
                                </option>
                              );
                            })}
                        </select>
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <div className="d-flex justify-content-between">
                          <label className="" htmlFor="name">
                            Company Phone Number
                            <span className="text-danger">*</span>
                          </label>
                        </div>

                        {/* <PhoneInput
                          defaultCountry="in"
                          value={formValue?.CompanyPhoneNumber}
                          onChange={(phone) =>
                            handlePhoneChange(phone, "CompanyPhoneNumber")
                          }
                        /> */}
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          id="name"
                          name="CompanyPhoneNumber"
                          value={formValue?.CompanyPhoneNumber}
                          onChange={handleFormChange}
                          placeholder="Phone Number"
                        />

                        {validationErrors?.CompanyPhoneNumber && (
                          <div
                            id="val-username1-error"
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {validationErrors?.CompanyPhoneNumber}
                          </div>
                        )}
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <div className="d-flex justify-content-between">
                          <label className="" htmlFor="name">
                            Company Email Address
                            <span className="text-danger">*</span>
                            <i
                              className="fa-solid fa-circle-info m-0 text-warning cursor-pointer ms-1"
                              onClick={() => setShowEmailInfo(!showEmailInfo)}
                            ></i>
                          </label>
                          {showEmailInfo && (
                            <span className="text-warning invalid-feedback animated fadeInUp d-block ms-1">
                              Email should be comma separated
                            </span>
                          )}
                        </div>
                        <input
                          type="email"
                          className="form-control form-control-sm"
                          id="name"
                          name="CompanyEmailAddress"
                          value={formValue?.CompanyEmailAddress}
                          onChange={handleFormChange}
                          placeholder="Email"
                        />

                        {validationErrors?.CompanyEmailAddress && (
                          <div
                            id="val-username1-error"
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {validationErrors?.CompanyEmailAddress}
                          </div>
                        )}
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <div className="d-flex justify-content-between">
                          <label className="" htmlFor="name">
                            Competitor
                          </label>
                        </div>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="name"
                          name="Competitor"
                          value={formValue?.Competitor}
                          onChange={handleFormChange}
                          placeholder="Name"
                        />
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <label className="" htmlFor="status">
                          Market Type
                          {/* <span className="text-danger">*</span> */}
                        </label>
                        <select
                          name="MarketType"
                          id="status"
                          className="form-control form-control-sm"
                          value={formValue?.MarketType}
                          onChange={handleFormChange}
                        >
                          <option value="">Select</option>
                          {markettypemasterlist?.length > 0 &&
                            markettypemasterlist.map((value, index) => {
                              return (
                                <option value={value.id} key={index + 1}>
                                  {value.Name}
                                </option>
                              );
                            })}
                        </select>
                        {validationErrors?.MarketType && (
                          <div
                            id="val-username1-error"
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {validationErrors?.MarketType}
                          </div>
                        )}
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <label className="" htmlFor="status">
                          Category
                        </label>
                        <select
                          name="Category"
                          id="status"
                          className="form-control form-control-sm"
                          value={formValue?.Category}
                          onChange={handleFormChange}
                        >
                          <option value="">Select</option>
                          <option value="big">Big</option>
                          <option value="medium">Medium</option>
                          <option value="small">Small</option>
                        </select>
                      </div>
                      <div className="col-md-6 col-lg-6">
                        <label className="" htmlFor="status">
                          Tour Type
                        </label>
                        <TourInput />
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <label className="" htmlFor="status">
                          Nationality
                          {/* <span className="text-danger">*</span> */}
                        </label>
                        <select
                          name="Nationality"
                          id="status"
                          className="form-control form-control-sm"
                          value={formValue?.Nationality}
                          onChange={handleFormChange}
                        >
                          <option value="">Select</option>
                          {/* <option value="Local">Local</option>
                          <option value="Foreign">Foreign</option>
                          <option value="Indian">Indian</option>
                          <option value="Bimstec">Bimstec</option> */}
                          {nationalitylist?.length > 0 &&
                            nationalitylist.map((value, index) => {
                              return (
                                <option value={value.id} key={index + 1}>
                                  {value.Name}
                                </option>
                              );
                            })}
                        </select>
                        {validationErrors?.Nationality && (
                          <div
                            id="val-username1-error"
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {validationErrors?.Nationality}
                          </div>
                        )}
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <label className="" htmlFor="status">
                          Country
                          <span className="text-danger">*</span>
                        </label>
                        <select
                          name="Country"
                          id="status"
                          className="form-control form-control-sm"
                          value={formValue?.Country}
                          onChange={handleFormChange}
                        >
                          <option value="">Select</option>
                          {countryList?.length > 0 &&
                            countryList.map((value, index) => {
                              return (
                                <option value={value.id} key={index + 1}>
                                  {value.Name}
                                </option>
                              );
                            })}
                        </select>

                        {validationErrors?.Country && (
                          <div
                            id="val-username1-error"
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {validationErrors?.Country}
                          </div>
                        )}
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <label className="" htmlFor="status">
                          Preferred Language
                        </label>
                        <select
                          name="PreferredLanguage"
                          id="status"
                          className="form-control form-control-sm"
                          value={formValue?.PreferredLanguage}
                          onChange={handleFormChange}
                        >
                          <option value="">Select</option>
                          {languageList?.length > 0 &&
                            languageList.map((value, index) => {
                              return (
                                <option value={value.id} key={index + 1}>
                                  {value.Name}
                                </option>
                              );
                            })}
                        </select>
                      </div>

                      <div className="col-md-6 col-lg-3">
                        <label htmlFor="val-username">Company Logo</label>
                        <input
                          type="file"
                          className="form-control form-control-sm"
                          id="val-username"
                          name="CompanyLogoImageName"
                          onChange={handleFormChange}
                          accept="image/*"
                        />

                        {formValue?.CompanyLogoImageName && showImage && (
                          <div className="mt-1 text-break position-relative d-inline-block">
                            <a
                              href={formValue.CompanyLogoImageName}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                width={120}
                                height={120}
                                src={formValue.CompanyLogoImageName}
                                onError={() => setShowImage(false)}
                                style={{ border: "1px solid #ccc", borderRadius: 4 }}
                              />
                            </a>
                            <button
                              type="button"
                              className="btn btn-sm btn-danger position-absolute"
                              style={{
                                top: "3px",
                                right: "3px",
                                padding: "0px 4px",
                              }}
                              onClick={() => {
                                setFormValue((prev) => ({
                                  ...prev,
                                  CompanyLogoImageName: "",
                                }));
                                setShowImage(false);
                              }}
                            >
                              ✖
                            </button>
                          </div>
                        )}
                      </div>

                      {/* <div className="col-md-6 col-lg-3">
                        <label className="" htmlFor="val-username">
                          Company Logo
                        </label>
                        <input
                          type="file"
                          className="form-control form-control-sm"
                          id="val-username"
                          name="CompanyLogoImageName"
                          onChange={handleFormChange}
                          accept="image/*"  // only image select 
                        />
                        {state?.CompanyLogoImageName && (
                          <div className="mt-1 text-break"
                          >
                            <img width={190} src={state?.CompanyLogoImageName} alt={state?.CompanyLogoImageName} />
                          </div>
                        )}
                      </div> */}
                      <div className="col-md-6 col-lg-3">
                        <label className="" htmlFor="val-username">
                          Agent Header
                          {/* <span className="text-danger">*</span> */}
                        </label>
                        <input
                          type="file"
                          className="form-control form-control-sm"
                          id="val-username"
                          name="AgentHeaderImageName"
                          onChange={handleFormChange}
                          accept="image/*" // only image select
                        />

                        {formValue?.AgentHeaderImageName && showAgentHeaderImage && (
                          <div className="mt-1 text-break position-relative d-inline-block">
                            <a
                              href={formValue.AgentHeaderImageName}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                width={120}
                                height={120}
                                src={formValue.AgentHeaderImageName}
                                style={{ border: "1px solid #ccc", borderRadius: 4 }}
                                onError={() => setShowAgentHeaderImage(false)} // hide on error
                              />
                            </a>
                            <button
                              type="button"
                              className="btn btn-sm btn-danger position-absolute"
                              style={{
                                top: "3px",
                                right: "3px",
                                padding: "0px 4px",
                              }}
                              onClick={() => {
                                setFormValue((prev) => ({
                                  ...prev,
                                  AgentHeaderImageName: "",
                                }));
                                setShowAgentHeaderImage(false);
                              }}
                            >
                              ✖
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="col-md-6 col-lg-3">
                        <label className="" htmlFor="val-username">
                          Agent Footer
                          {/* <span className="text-danger">*</span> */}
                        </label>
                        <input
                          type="file"
                          className="form-control form-control-sm"
                          id="val-username"
                          name="AgentFooterImageName"
                          onChange={handleFormChange}
                          accept="image/*" // only image select
                        />

                        {formValue?.AgentFooterImageName && showAgentFooterImage && (
                          <div className="mt-1 text-break position-relative d-inline-block">
                            <a
                              href={formValue.AgentFooterImageName}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                width={120}
                                height={120}
                                src={formValue.AgentFooterImageName}
                                style={{ border: "1px solid #ccc", borderRadius: 4 }}
                                onError={() => setShowAgentFooterImage(false)}
                              />
                            </a>
                            <button
                              type="button"
                              className="btn btn-sm btn-danger position-absolute"
                              style={{
                                top: "3px",
                                right: "3px",
                                padding: "0px 4px",
                              }}
                              onClick={() => {
                                setFormValue((prev) => ({
                                  ...prev,
                                  AgentFooterImageName: "",
                                }));
                                setShowAgentFooterImage(false);
                              }}
                            >
                              ✖
                            </button>
                          </div>
                        )}
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
                          <option value="1">Active</option>
                          <option value="0">Inactive</option>
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

                      <div className="col-md-12 col-lg-12">
                        <p> Agent Info</p>

                        <CKEditor
                          editor={ClassicEditor}
                          value={formValue?.AgentInfo}
                          name="AgentInfo"
                          onChange={(event, editor) => {
                            const data = editor.getData();
                            handleAgentInfo(data);
                          }}
                        />
                      </div>
                      <div className="col-md-12 col-lg-12">
                        <p>Remarks</p>

                        <CKEditor
                          editor={ClassicEditor}
                          value={formValue?.Remarks}
                          name="Remarks"
                          onChange={(event, editor) => {
                            const data = editor.getData();
                            handleRemarks(data);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="d-flex gap-3 justify-content-end my-1">
            <button
              className="btn btn-dark btn-custom-size"
              name="SaveButton"
              onClick={() => navigate(-1)}
            >
              <span className="me-1">Back</span>
              <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
            </button>
            {/* <button
              onClick={handleSubmit}
              className="btn btn-primary btn-custom-size"
            >
              Submit
            </button> */}
            <button
              type="button"
              className="btn btn-primary btn-custom-size d-flex align-items-center gap-1"
              style={{
                cursor: loadingBtn ? "no-drop" : "pointer",
                opacity: loadingBtn ? 0.7 : 1,
              }}
              disabled={loadingBtn}
              onClick={handleSubmit}
            >
              {loadingBtn && (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              )}
              {loadingBtn ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAgent;
