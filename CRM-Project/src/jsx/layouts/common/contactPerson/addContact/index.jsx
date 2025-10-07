import React, { useState, useEffect } from "react";
import { addContactInitialValue } from "../../../../pages/masters/masters_initial_value.js";
import { addContactPersonValidationSchema } from "../../../../pages/masters/master_validation.js";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { axiosOther } from "../../../../../http/axios_base_url";
import "../../../../../scss/main.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { notifyHotError, notifyHotSuccess } from "../../../../../helper/notify.jsx";

const AddContact = () => {
  const [formValue, setFormValue] = useState(addContactInitialValue);
  const [validationErrors, setValidationErrors] = useState({});
  const [divisionlist, setdivisionlist] = useState([]);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [showImageOne, setShowImageOne] = useState(true);
  const [showImageTwo, setShowImageTwo] = useState(true);
  const [showImageThree, setShowImageThree] = useState(true);
  const [imageOnePreview, setImageOnePreview] = useState("");
  const [imageTwoPreview, setImageTwoPreview] = useState("");
  const [imageThreePreview, setImageThreePreview] = useState("");
  const [initialFormValue, setInitialFormValue] = useState(null); // Store initial state for comparison

  const { state } = useLocation();
  const navigate = useNavigate();
  const param = useParams();
  const credential = localStorage.getItem("token");
  const authData = JSON.parse(credential);

  console.log(state, 'consontactState');
  // console.log(state.data.ImageOne, 'stateImageOne');

  // Helper function to get image source
  const getImageSrc = (imagePreview, imageData, imageUrl) => {
    if (imagePreview) {
      // New file selected
      return imagePreview;
    } else if (imageData) {
      // Base64 data
      return `data:image/jpeg;base64,${imageData}`;
    } else if (imageUrl) {
      // URL from API
      return imageUrl;
    }
    return "";
  };

  useEffect(() => {
    const getdata = async () => {
      try {
        const response = await axiosOther.post("divisionlist", {
          Search: "",
          Status: 1,
        });
        setdivisionlist(response.data.DataList);
      } catch (error) {
        console.error("Error fetching division list:", error);
      }
    };
    getdata();
  }, []);

  useEffect(() => {
    if (state) {
      setFormValue({
        id: state?.data?.id || "",
        ParentId: state?.data?.ParentId || state?.partner_payload?.Fk_partnerid,
        OfficeName: state?.data?.OfficeName || "Head Office",
        Title: state?.data?.Title || "",
        MetDuring: state?.data?.MetDuring || "",
        FirstName: state?.data?.FirstName || "",
        LastName: state?.data?.LastName || "",
        Division: state?.data?.Division || "",
        Designation: state?.data?.Designation || "",
        Newsletter: state?.data?.Newsletter || "Yes",
        CountryCode: state?.data?.CountryCode || "",
        Phone: state?.data?.Phone || "",
        MobileNo: state?.data?.MobileNo || "",
        Email: state?.data?.Email || "",
        AlternateEmail: state?.data?.AlternateEmail || "",
        DateOfBirth: state?.data?.DateOfBirth || "",
        AnniversaryDate: state?.data?.AnniversaryDate || "",
        SkypeId: state?.data?.SkypeId || "",
        MsnId: state?.data?.MsnId || "",
        FacebookProfile: state?.data?.FacebookProfile || "",
        LinkedInProfile: state?.data?.LinkedInProfile || "",
        TwitterProfile: state?.data?.TwitterProfile || "",
        InstagramProfile: state?.data?.InstagramProfile || "",
        ImageOne: state?.data?.ImageNameOne || "",
        ImageOneData: state?.data?.ImageOneData || "",
        ImageTwo: state?.data?.ImageNameTwo || "",
        ImageTwoData: state?.data?.ImageTwoData || "",
        ImageThree: state?.data?.ImageNameThree || "",
        ImageThreeData: state?.data?.ImageThreeData || "",
        Status: state?.data?.Status || "Yes",
        Remarks: state?.data?.Remarks || "",
        AddedBy:
          state?.data?.AddedBy || authData?.UserID != null
            ? authData?.UserID?.toString()
            : "0",
        UpdatedBy:
          state?.data?.UpdatedBy || authData?.UserID != null
            ? authData?.UserID?.toString()
            : "0",
      });
      setShowImageOne(!!state?.data?.ImageNameOne);
      setShowImageTwo(!!state?.data?.ImageNameTwo);
      setShowImageThree(!!state?.data?.ImageNameThree);

      if (state?.data?.ImageNameOne) {
        setImageOnePreview(state.data.ImageNameOne);
      }
      if (state?.data?.ImageNameTwo) {
        setImageTwoPreview(state.data.ImageNameTwo);
      }
      if (state?.data?.ImageNameThree) {
        setImageThreePreview(state.data.ImageNameThree);
      }
    }
  }, [state]);

  const handleFormChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "file") {
      const file = e.target.files[0];
      if (file) {
        if (name === "ImageOne") {
          setFormValue((prev) => ({
            ...prev,
            ImageOne: file, // store File object
          }));
          setImageOnePreview(URL.createObjectURL(file));
          setShowImageOne(true);
        } else if (name === "ImageTwo") {
          setFormValue((prev) => ({
            ...prev,
            ImageTwo: file,
          }));
          setImageTwoPreview(URL.createObjectURL(file));
          setShowImageTwo(true);
        } else if (name === "ImageThree") {
          setFormValue((prev) => ({
            ...prev,
            ImageThree: file,
          }));
          setImageThreePreview(URL.createObjectURL(file));
          setShowImageThree(true);
        }
      }
    } else {
      setFormValue((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // const handlePhoneChange = (phone, country, nameValue) => {
  //   setFormValue((prev) => ({
  //     ...prev,
  //     [nameValue]: phone,
  //     ...(nameValue === "Phone" && phone?.startsWith("+") && {
  //       CountryCode: country?.country?.dialCode,
  //     }),
  //   }));
  // };
  const handlePhoneChange = (e, country, nameValue) => {
    const phone = e.target.value;
    setFormValue({ ...formValue, [nameValue]: phone });
    if (nameValue == "Phone" && phone.startsWith("+")) {
      setFormValue({
        ...formValue,
        ["CountryCode"]: country?.country?.dialCode,
        [nameValue]: phone,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingBtn(true);
    try {
      await addContactPersonValidationSchema.validate(
        { ...formValue },
        { abortEarly: false }
      );

      setValidationErrors({});
      const capitalizedTypeName = state?.typeName
        ? state.typeName.charAt(0).toUpperCase() + state.typeName.slice(1)
        : "";

      const formData = new FormData();
      Object.entries(formValue).forEach(([key, value]) => {
        // Skip base64 fields if a new file is uploaded
        if (["ImageOneData", "ImageTwoData", "ImageThreeData"].includes(key)) {
          return;
        }
        // Handle image fields
        if (["ImageOne", "ImageTwo", "ImageThree"].includes(key)) {
          if (value instanceof File) {
            // New file uploaded
            formData.append(key, value);
          } else if (formValue[`${key}Data`]) {
            // Existing image (send base64 data if available)
            formData.append(`${key}Data`, formValue[`${key}Data`]);
          }
          // If no new file and no base64 data, do not append (indicates unchanged)
        } else {
          // Append non-image fields
          formData.append(key, value ?? "");
        }
      });
      formData.append("Type", capitalizedTypeName);

      const { data } = await axiosOther.post("addupdatecontact", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data && data.Status === 1) {
        notifyHotSuccess(data?.Message || data?.message);
        setFormValue((prev) => ({
          ...prev,
          ImageOne: data.Data?.ImageOne || prev.ImageOne,
          ImageOneData: data.Data?.ImageOneData || prev.ImageOneData,
          ImageTwo: data.Data?.ImageTwo || prev.ImageTwo,
          ImageTwoData: data.Data?.ImageTwoData || prev.ImageTwoData,
          ImageThree: data.Data?.ImageThree || prev.ImageThree,
          ImageThreeData: data.Data?.ImageThreeData || prev.ImageThreeData,
        }));
        setShowImageOne(!!data.Data?.ImageOne || !!formValue.ImageOne);
        setShowImageTwo(!!data.Data?.ImageTwo || !!formValue.ImageTwo);
        setShowImageThree(!!data.Data?.ImageThree || !!formValue.ImageThree);
        navigate(`/view/${state?.typeName}/${param?.id}`);
      }
    } catch (error) {
      if (error.inner) {
        const errorMessages = error.inner.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {});
        setValidationErrors(errorMessages);
        console.log("Validation errors:", errorMessages);
      }

      if (error.response?.data?.Errors) {
        const data = Object.entries(error.response?.data?.Errors);
        notifyHotError(data[0][1]);
      }

      console.log("Submit error:", error);
      console.log("Submit error response:", error.response?.data);
    } finally {
      setLoadingBtn(false);
    }
  };
  const getFromDate = () => {
    return formValue?.DateOfBirth ? new Date(formValue?.DateOfBirth) : null;
  };

  const handleCalender = (date) => {
    const formattedDate = date
      ? date.toLocaleDateString("en-GB").split("/").reverse().join("-")
      : "";
    setFormValue({
      ...formValue,
      DateOfBirth: formattedDate,
    });
  };

  const getToDate = () => {
    return formValue?.AnniversaryDate ? new Date(formValue?.AnniversaryDate) : null;
  };

  const handleExpiryCalender = (date) => {
    const formattedDate = date
      ? date.toLocaleDateString("en-GB").split("/").reverse().join("-")
      : "";
    setFormValue({
      ...formValue,
      AnniversaryDate: formattedDate,
    });
  };

  const hasFormChanged = () => {
    if (!initialFormValue) return true; // Enable submit for new contacts
    return Object.keys(formValue).some((key) => {
      if (["ImageOne", "ImageTwo", "ImageThree"].includes(key)) {
        // Handle File objects
        if (formValue[key] instanceof File) return true;
        // Compare URLs or empty strings
        return formValue[key] !== initialFormValue[key];
      }
      if (["ImageOneData", "ImageTwoData", "ImageThreeData"].includes(key)) {
        // Skip base64 data comparison if corresponding image field is a File
        const imageKey = key.replace("Data", "");
        if (formValue[imageKey] instanceof File) return false;
        return formValue[key] !== initialFormValue[key];
      }
      // Compare other fields
      return formValue[key] !== initialFormValue[key];
    });
  };


  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header py-3">
            <h4 className="card-title">
              Add Contact Detail: {state?.partner_payload?.CompanyNmae?.[0]?.CompanyName}
            </h4>
            <div className="d-flex gap-3">
              <button
                className="btn btn-dark btn-custom-size"
                onClick={() => navigate(-1)}
              >
                <span className="me-1">Back</span>
                <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
              </button>
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
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="row">
                  <div className="col-12">
                    <div className="row form-row-gap">
                      <div className="col-md-6 col-lg-2">
                        <label htmlFor="status">Office Type</label>
                        <select
                          name="OfficeName"
                          id="status"
                          className="form-control form-control-sm"
                          value={formValue?.OfficeName}
                          onChange={handleFormChange}
                        >
                          <option value="">Select</option>
                          <option value="Head Office">Head Office</option>
                          <option value="Branch Office">Branch Office</option>
                        </select>
                        {validationErrors?.OfficeName && (
                          <div
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {validationErrors?.OfficeName}
                          </div>
                        )}
                      </div>
                      <div className="col-md-6 col-lg-2">
                        <label htmlFor="status">Title</label>
                        <select
                          name="Title"
                          id="status"
                          className="form-control form-control-sm"
                          value={formValue?.Title}
                          onChange={handleFormChange}
                        >
                          <option value="">Select</option>
                          <option value="Mr">Mr</option>
                          <option value="Mrs">Mrs</option>
                          <option value="None">None</option>
                          <option value="Ms">Ms</option>
                        </select>
                        {validationErrors?.Title && (
                          <div
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {validationErrors?.Title}
                          </div>
                        )}
                      </div>
                      <div className="col-md-6 col-lg-2">
                        <label htmlFor="name">
                          First Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="name"
                          name="FirstName"
                          value={formValue?.FirstName}
                          onChange={handleFormChange}
                          placeholder="First Name"
                        />
                        {validationErrors?.FirstName && (
                          <div
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {validationErrors?.FirstName}
                          </div>
                        )}
                      </div>
                      <div className="col-md-6 col-lg-2">
                        <label htmlFor="name">Last Name</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="name"
                          name="LastName"
                          value={formValue?.LastName}
                          onChange={handleFormChange}
                          placeholder="Last Name"
                        />
                      </div>
                      <div className="col-md-6 col-lg-2">
                        <label htmlFor="status">Division</label>
                        <select
                          name="Division"
                          id="status"
                          className="form-control form-control-sm"
                          value={formValue?.Division}
                          onChange={handleFormChange}
                        >
                          <option value="">Select</option>
                          {divisionlist.map((division, index) => (
                            <option value={division.id} key={index}>
                              {division.Name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-6 col-lg-2">
                        <label htmlFor="name">Designation</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="name"
                          name="Designation"
                          value={formValue?.Designation}
                          onChange={handleFormChange}
                          placeholder="Designation"
                        />
                        {validationErrors?.Designation && (
                          <div
                            className=" invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {validationErrors?.Designation}
                          </div>
                        )}
                      </div>
                      <div className="col-md-6 col-lg-2">
                        <label htmlFor="status">News Letter</label>
                        <select
                          name="Newsletter"
                          id="status"
                          className="form-control form-control-sm"
                          value={formValue?.Newsletter}
                          onChange={handleFormChange}
                        >
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>
                      <div className="col-md-6 col-lg-2">
                        <label htmlFor="name">Phone</label>
                        {/* <PhoneInput
                          defaultCountry="us"
                          value={formValue?.Phone || ""}
                          onChange={(phone, country) => handlePhoneChange(phone, country, "Phone")}
                          inputClassName="form-control form-control-sm"
                        /> */}
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={formValue?.Phone || ""}
                          onChange={(e, country) =>
                            handlePhoneChange(e, country, "Phone")
                          }
                        />
                      </div>
                      <div className="col-md-6 col-lg-2">
                        <label htmlFor="name">Mobile</label>
                        {/* <PhoneInput
                          defaultCountry="us"
                          value={formValue?.MobileNo || ""}
                          onChange={(phone, country) => handlePhoneChange(phone, country, "MobileNo")}
                          inputClassName="form-control form-control-sm"
                        /> */}
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={formValue?.MobileNo || ""}
                          onChange={(e, country) =>
                            handlePhoneChange(e, country, "MobileNo")
                          }
                        />
                      </div>
                      <div className="col-md-6 col-lg-2">
                        <label htmlFor="name">Email</label>
                        <input
                          type="email"
                          className="form-control form-control-sm"
                          id="name"
                          name="Email"
                          value={formValue?.Email}
                          onChange={handleFormChange}
                          placeholder="Email"
                        />
                        {validationErrors?.Email && (
                          <div
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {validationErrors?.Email}
                          </div>
                        )}
                      </div>
                      <div className="col-md-6 col-lg-2">
                        <label htmlFor="name">Alternate Email</label>
                        <input
                          type="email"
                          className="form-control form-control-sm"
                          id="name"
                          name="AlternateEmail"
                          value={formValue?.AlternateEmail}
                          onChange={handleFormChange}
                          placeholder="Alternate Email"
                        />
                      </div>
                      <div className="col-md-6 col-lg-2">
                        <label htmlFor="name">DOB</label>
                        <DatePicker
                          className="form-control form-control-sm"
                          selected={getFromDate()}
                          onChange={(date) => handleCalender(date)}
                          dateFormat="dd-MM-yyyy"
                          isClearable
                          todayButton="Today"
                        />
                      </div>
                      <div className="col-md-6 col-lg-2">
                        <label htmlFor="name">Anniversary Date</label>
                        <DatePicker
                          className="form-control form-control-sm"
                          selected={getToDate()}
                          onChange={(date) => handleExpiryCalender(date)}
                          dateEntryFormat="dd-MM-yyyy"
                          isClearable
                          todayButton="Today"
                        />
                      </div>
                      <div className="col-md-6 col-lg-2">
                        <label htmlFor="name">Skype Id</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="name"
                          name="SkypeId"
                          value={formValue?.SkypeId}
                          onChange={handleFormChange}
                          placeholder="Skype Id"
                        />
                      </div>
                      <div className="col-md-6 col-lg-2">
                        <label htmlFor="name">MSN ID</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="name"
                          name="MsnId"
                          value={formValue?.MsnId}
                          onChange={handleFormChange}
                          placeholder="MSN ID"
                        />
                      </div>
                      <div className="col-md-6 col-lg-2">
                        <label htmlFor="name">Facebook Profile</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="name"
                          name="FacebookProfile"
                          value={formValue?.FacebookProfile}
                          onChange={handleFormChange}
                          placeholder="Facebook Profile"
                        />
                      </div>
                      <div className="col-md-6 col-lg-2">
                        <label htmlFor="name">LinkedIn Profile</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="name"
                          name="LinkedInProfile"
                          value={formValue?.LinkedInProfile}
                          onChange={handleFormChange}
                          placeholder="LinkedIn Profile"
                        />
                      </div>
                      <div className="col-md-6 col-lg-2">
                        <label htmlFor="name">Twitter Profile</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="name"
                          name="TwitterProfile"
                          value={formValue?.TwitterProfile}
                          onChange={handleFormChange}
                          placeholder="Twitter Profile"
                        />
                      </div>
                      <div className="col-md-6 col-lg-2">
                        <label htmlFor="name">Instagram Profile</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="name"
                          name="InstagramProfile"
                          value={formValue?.InstagramProfile}
                          onChange={handleFormChange}
                          placeholder="Instagram Profile"
                        />
                      </div>
                      <div className="col-md-6 col-lg-2">
                        <label>Status</label>
                        <select
                          name="Status"
                          className="form-control form-control-sm"
                          value={formValue?.Status}
                          onChange={handleFormChange}
                        >
                          <option value="Yes">Active</option>
                          <option value="No">Inactive"</option>
                        </select>
                      </div>
                      <div className="col-md-6 col-lg-6">
                        <label htmlFor="Remarks">Remarks</label>
                        <textarea
                          className="form-control form-control-sm"
                          id="Remarks"
                          name="Remarks"
                          value={formValue?.Remarks}
                          onChange={handleFormChange}
                          placeholder="Remarks"
                          rows="3"
                        ></textarea>
                      </div>
                      <div className="col-md-12 col-lg-12">
                        <label htmlFor="val-username">Business Card</label>
                        <div className="row">
                          <div className="col-md-6 col-lg-2 position-relative">
                            <label htmlFor="val-username">Image 1</label>
                            <input
                              type="file"
                              className="form-control form-control-sm"
                              id="val-username"
                              name="ImageOne"
                              onChange={handleFormChange}
                              accept="image/*"
                            />
                            {formValue?.ImageOne && showImageOne && (
                              <div className="mt-1 text-break position-relative d-inline-block">
                                <a
                                  href={formValue.ImageOneData || formValue.ImageOne}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <img
                                    width={120}
                                    height={120}
                                    src={getImageSrc(imageOnePreview, formValue.ImageOneData, formValue.ImageOne)}
                                    style={{ border: "1px solid #ccc", borderRadius: 4 }}
                                    onError={() => setShowImageOne(false)}
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
                                      ImageOne: "",
                                      ImageOneData: "",
                                    }));
                                    setImageOnePreview("");
                                    setShowImageOne(false);
                                  }}
                                >
                                  ✖
                                </button>
                              </div>
                            )}
                          </div>
                          <div className="col-md-6 col-lg-2 position-relative">
                            <label htmlFor="val-username">Image 2</label>
                            <input
                              type="file"
                              className="form-control form-control-sm"
                              id="val-username"
                              name="ImageTwo"
                              onChange={handleFormChange}
                              accept="image/*"
                            />
                            {formValue?.ImageTwo && showImageTwo && (
                              <div className="mt-1 text-break position-relative d-inline-block">
                                <a
                                  href={formValue.ImageTwoData || formValue.ImageTwo}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <img
                                    width={120}
                                    height={120}
                                    src={getImageSrc(imageTwoPreview, formValue.ImageTwoData, formValue.ImageTwo)}
                                    style={{ border: "1px solid #ccc", borderRadius: 4 }}
                                    onError={() => setShowImageTwo(false)}
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
                                      ImageTwo: "",
                                      ImageTwoData: "",
                                    }));
                                    setImageTwoPreview("");
                                    setShowImageTwo(false);
                                  }}
                                >
                                  ✖
                                </button>
                              </div>
                            )}
                          </div>
                          <div className="col-md-6 col-lg-2 position-relative">
                            <label htmlFor="val-username">Image 3</label>
                            <input
                              type="file"
                              className="form-control form-control-sm"
                              id="val-username"
                              name="ImageThree"
                              onChange={handleFormChange}
                              accept="image/*"
                            />
                            {formValue?.ImageThree && showImageThree && (
                              <div className="mt-1 text-break position-relative d-inline-block">
                                <a
                                  href={formValue.ImageThreeData || formValue.ImageThree}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <img
                                    width={120}
                                    height={120}
                                    src={getImageSrc(imageThreePreview, formValue.ImageThreeData, formValue.ImageThree)}
                                    style={{ border: "1px solid #ccc", borderRadius: 4 }}
                                    onError={() => setShowImageThree(false)}
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
                                      ImageThree: "",
                                      ImageThreeData: "",
                                    }));
                                    setImageThreePreview("");
                                    setShowImageThree(false);
                                  }}
                                >
                                  ✖
                                </button>
                              </div>
                            )}
                          </div>
                          <div className="col-md-6 col-lg-6">
                            <label htmlFor="name">Met During</label>
                            <textarea
                              className="form-control form-control-sm"
                              name="MetDuring"
                              value={formValue?.MetDuring}
                              onChange={handleFormChange}
                              placeholder="Met During"
                              rows="3"
                            ></textarea>
                          </div>
                        </div>
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
              onClick={() => navigate(-1)}
            >
              <span className="me-1">Back</span>
              <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
            </button>
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

export default AddContact;
