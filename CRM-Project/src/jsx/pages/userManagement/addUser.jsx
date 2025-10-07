import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosOther } from "../../../http/axios_base_url";
import useMultipleSelect from "../../../hooks/custom_hooks/useMultipleSelect";
import { userIntialValue } from "./user-intial-values";
import { notifyError, notifySuccess } from "../../../helper/notify";
const AddUser = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [formValue, setFormValue] = useState(userIntialValue);
  const [languageList, setLanguageList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [reportingManagerList, setReportingManagerList] = useState([]);
  const [designationList, setDesignationList] = useState([]);
  const [UsersDepartmentList, setUsersDepartmentList] = useState([]);
  const [userType, setUserType] = useState([]);
  const [orgType, setOrgType] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [isEditing, setIsEditing] = useState(state?.data?.id ? true : false);
  const companyId = JSON.parse(localStorage.getItem("token"))?.companyKey;
  

  const languageOption = languageList?.map((lang) => ({
    value: lang?.id,
    label: lang?.Name,
  }));
  const roleOption = roleList?.map((role) => ({
    value: role?.id,
    label: role?.name,
  }));
  const reportingManagerOptions = reportingManagerList?.map((role) => ({
    value: role?.UserID,
    label: role?.UserName,
  }));

  const {
    SelectInput: LanguageInput,
    selectedData: languageSelected,
    setSelectedData: setLanguageSelected,
  } = useMultipleSelect(languageOption);
  const {
    SelectInput: ReportingManager,
    selectedData: reportingManagerSelected,
    setSelectedData: setReportingManagerSelected,
  } = useMultipleSelect(reportingManagerOptions);
  const {
    SelectInput: RoleInput,
    selectedData: roleSelected,
    setSelectedData: setRoleSelected,
  } = useMultipleSelect(roleOption);

  const getDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("designation-list");
      setDesignationList(data?.Data);
    } catch (err) {
      console.log(err);
    }
    try {
      const { data } = await axiosOther.post("departmentlist");
      setUsersDepartmentList(data?.DataList);
    } catch (err) {
      console.log(err);
    }
    try {
      const { data } = await axiosOther.post("orglistbycompanyid", {
        CompanyId: companyId,
      });
      setOrgType(data?.Datalist);
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
    try {
      const data = await axiosOther.post("roles", {
        name: "",
        company_id: companyId,
      });
      setRoleList(data?.data?.data);
    } catch (err) {
      console.log(err);
    }
    try {
      const data = await axiosOther.post("listofalluserbycompanyname", {
        CompanyId: companyId,
        OrgType: "Internal",
      });
      setReportingManagerList(data?.data?.Datalist);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getDataToServer();
  }, []);

  useEffect(() => {
    if (orgType?.length > 0 && !formValue.OrganizationId) {
      const internal = orgType.find((item) => item.name === "Internal");
      if (internal) {
        setFormValue((prev) => ({ ...prev, OrganizationId: internal.id }));
      }
    }
  }, [orgType, formValue.OrganizationId]);
  console.log(state, "state11")

  // useEffect(() => {
  //   if (state) {
  //     setFormValue({
  //       CompanyKey: state?.data?.CompanyKey,
  //       FirstName: state?.data?.FirstName,
  //       LastName: state?.data?.LastName,
  //       Profile: state?.data?.Profile,
  //       email: state?.data?.Email,
  //       password: state?.data?.password,
  //       password_confirmation: state?.data?.password_confirmation,
  //       UserCode: state?.data?.UserCode,
  //       Phone: state?.data?.Phone,
  //       Mobile: state?.data?.Mobile,
  //       Pin: state?.data?.Pin,
  //       Street: state?.data?.Street,
  //       TimeFormat: "12",
  //       Designation: state?.data?.Designation,
  //       UsersDepartment: state?.data?.UsersDepartment,
  //       ReportingManager: state?.data?.ReportingManager,
  //       UserType: state?.data?.UserType,
  //       UserLoginType: state?.data?.UserLoginType,
  //       remember_token: "some",
  //       email_verified_at: "2024-01-01T00:00:00Z",
  //       Status: 1,
  //       AddedBy: 1,
  //     });
  //     setLanguageSelected(
  //       state?.data?.LanguageKnown != null && state?.data?.LanguageKnown != ""
  //         ? state?.data?.LanguageKnown?.map((lang) => lang?.LanguageId)
  //         : []
  //     );
  //     setRoleSelected(
  //       state?.data?.role != null && state?.data?.role != ""
  //         ? state?.data?.role?.map((data) => data)
  //         : []
  //     );
  //   }
  // }, []);

  useEffect(() => {
    if (state?.data) {
      setFormValue({
        CompanyKey: state?.data?.CompanyKey || "",
        FirstName: state?.data?.FirstName || "",
        LastName: state?.data?.LastName || "",
        Profile: state?.data?.Profile || "",
        email: state?.data?.Email || "",
        password: state?.data?.password || "",
        password_confirmation: state?.data?.password_confirmation || "",
        UserCode: state?.data?.UserCode || "",
        Phone: state?.data?.Phone || "",
        Mobile: state?.data?.Mobile || "",
        Pin: state?.data?.Pin || "",
        Street: state?.data?.Street || "",
        TimeFormat: "12",
        Designation: state?.data?.Designation?.Id || "",
        UsersDepartment: state?.data?.UsersDepartment || "",
        ReportingManager: state?.data?.ReportingManager || "",
        UserType: state?.data?.UserType || "",
        UserLoginType: state?.data?.UserLoginType || "",
        remember_token: "some",
        email_verified_at: "2024-01-01T00:00:00Z",
        Status: 1,
        AddedBy: 1,
      });

      setLanguageSelected(
        console.log(state?.data?.LanguageKnown, "asas"),
        state?.data?.LanguageKnown?.length > 0
          ? state?.data?.LanguageKnown?.map((lang) => lang?.id,)
          : []
      );

      setRoleSelected(
        console.log(state?.data?.role, "ffff"),
        state?.data?.role?.length > 0 ? state?.data?.role : []
      );
    }
  }, [state]);

  // Validation function
  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formValue.OrganizationId) {
      errors.OrganizationId = "Organization Type is required";
    }
    if (!formValue.email) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(formValue.email)) {
      errors.email = "Invalid email format";
    }
    if (!isEditing && !formValue.password) {
      errors.password = "Password is required";
    } else if (!isEditing && formValue.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    if (!isEditing && !formValue.password_confirmation) {
      errors.password_confirmation = "Confirm Password is required";
    } else if (!isEditing && formValue.password !== formValue.password_confirmation) {
      errors.password_confirmation = "Passwords do not match";
    }
    if (!formValue.UserCode) {
      errors.UserCode = "User Code is required";
    }
    if (!formValue.Designation) {
      errors.Designation = "Designation is required";
    }
    if (!roleSelected || roleSelected.length === 0) {
      errors.Role = "At least one Role is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    let CompanyKey = JSON.parse(localStorage.getItem("token"))?.companyKey;
    const userKey = JSON.parse(localStorage.getItem("token")).UserID;

    // Update User Logic
    if (state?.data?.id) {
      try {
        const { data } = await axiosOther.post("updateusers", {
          id: state?.data?.id,
          ...formValue,
          CompanyKey: CompanyKey,
          UserKey: userKey,
          LanguageKnown: languageSelected,
          Role: roleSelected,
          ReportingManager: reportingManagerSelected,
        });
        if (data?.Status == 1) {
          notifySuccess("User updated successfully");
          setTimeout(() => {
            navigate("/user");
          }, 3000);
        } else {
          notifyError(data?.message || data?.Message);
        }
      } catch (error) {
        notifyError(error?.response?.data?.message || "An error occurred");
        console.log(error);
      }
      return;
    }

    // Add User Logic
    try {
      formValue.Pin = parseInt(formValue.Pin);
      const { data } = await axiosOther.post("addusers", {
        ...formValue,
        UsersDepartment: +formValue?.UsersDepartment,
        CompanyKey: String(CompanyKey),
        UserKey: String(userKey),
        LanguageKnown: languageSelected,
        Role: roleSelected,
        ReportingManagerId: reportingManagerSelected,
      });
      if (data?.Status == 1) {
        notifySuccess(data?.message || data?.Message);
        setTimeout(() => {
          navigate("/user");
        }, 2000);
      } else {
        if (data?.errors) {
          const firstErrorKey = Object.keys(data.errors)[0];
          const firstErrorMessage = data.errors[firstErrorKey][0];
          notifyError(firstErrorMessage);
        } else {
          notifyError(data?.message || data?.Message || "Something went wrong");
        }

      }
    } catch (error) {
      console.log(error, "error");
      if (error.response?.data?.Errors || error.response?.data?.errors) {
        const data = Object.entries(
          error.response?.data?.Errors || error.response?.data?.errors
        );
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
    // Clear validation error for the field being edited
    setValidationErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // reset Handler
  const handleResetData = (e) => {
    e.preventDefault();
    setFormValue(userIntialValue);
    setValidationErrors({});
    setLanguageSelected([]);
    setRoleSelected([]);
    setReportingManagerSelected([]);
  };

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header">
            <h4 className="card-title">User</h4>
            <button
              className="btn btn-dark btn-custom-size"
              name="SaveButton"
              onClick={() => navigate("/user")}
            >
              <span className="me-1">Back</span>
              <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
            </button>
          </div>
          <div className="card-body">
            <div className="form-validation">
              <ToastContainer />
              <form className="form-valide" onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-12">
                    <div className="row form-row-gap">
                      <div className="border rounded position-relative px-2 d-flex col-gap-2 flex-wrap p-2">
                        <label
                          className="mb-1 m-0 position-absolute form-label-position-1 bg-primary text-white px-1"
                          htmlFor="status"
                        >
                          Contact
                        </label>

                        {/* User Type */}
                        <div className="col-md-6 col-lg-2">
                          <label htmlFor="orgType">
                            Organization Type
                            <span className="text-danger">*</span>
                          </label>
                          <select
                            name="OrganizationId"
                            className={`form-control form-control-sm ${validationErrors.OrganizationId ? "is-invalid" : ""}`}
                            value={formValue?.OrganizationId}
                            onChange={(e) => {
                              setFormValue((prev) => ({
                                ...prev,
                                OrganizationId: String(e.target.value),
                              }));
                              setValidationErrors((prev) => ({
                                ...prev,
                                OrganizationId: "",
                              }));
                            }}
                          >
                            <option value="">Select</option>
                            {orgType?.map((data, index) => (
                              <option value={data?.id} key={index}>
                                {data?.name}
                              </option>
                            ))}
                          </select>
                          {validationErrors.OrganizationId && (
                            <div
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors.OrganizationId}
                            </div>
                          )}
                        </div>

                        <div className="col-md-6 col-lg-2">
                          <label htmlFor="name">First Name</label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            name="FirstName"
                            placeholder="Enter First Name"
                            value={formValue?.FirstName}
                            onChange={handleFormChange}
                          />
                        </div>
                        <div className="col-md-6 col-lg-2">
                          <label htmlFor="name">Last Name</label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            name="LastName"
                            placeholder="Enter Last Name"
                            value={formValue?.LastName}
                            onChange={handleFormChange}
                          />
                        </div>

                        <div className="col-md-6 col-lg-2">
                          <label htmlFor="email">
                            Email
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="email"
                            className={`form-control form-control-sm ${validationErrors.email ? "is-invalid" : ""}`}
                            name="email"
                            placeholder="Enter your Email"
                            value={formValue?.email}
                            onChange={handleFormChange}
                          />
                          {validationErrors.email && (
                            <div
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors.email}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6 col-lg-2">
                          <label htmlFor="Pin">Pin</label>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            name="Pin"
                            placeholder="Enter a Pin Code"
                            value={formValue?.Pin}
                            onChange={handleFormChange}
                          />
                        </div>
                        <div className="col-md-6 col-lg-2">
                          <label htmlFor="Password">
                            Password
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="password"
                            className={`form-control form-control-sm ${validationErrors.password ? "is-invalid" : ""}`}
                            name="password"
                            placeholder="Enter Password"
                            value={formValue?.password}
                            onChange={handleFormChange}
                          />
                          {validationErrors.password && (
                            <div
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors.password}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6 col-lg-2">
                          <label htmlFor="shortName">
                            Confirm Password
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="password"
                            className={`form-control form-control-sm ${validationErrors.password_confirmation ? "is-invalid" : ""}`}
                            name="password_confirmation"
                            placeholder="Enter Password"
                            value={formValue?.password_confirmation}
                            onChange={handleFormChange}
                          />
                          {validationErrors.password_confirmation && (
                            <div
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors.password_confirmation}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="border rounded position-relative px-2 d-flex col-gap-2 flex-wrap p-2 mt-2">
                        <label
                          className="mb-1 m-0 position-absolute form-label-position-1 bg-primary text-white px-1"
                          htmlFor="status"
                        >
                          Details
                        </label>
                        <div className="col-md-6 col-lg-2">
                          <label htmlFor="shortName">
                            User Code
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="number"
                            className={`form-control form-control-sm ${validationErrors.UserCode ? "is-invalid" : ""}`}
                            name="UserCode"
                            placeholder="Enter a UserCode"
                            value={formValue?.UserCode}
                            onChange={handleFormChange}
                          />
                          {validationErrors.UserCode && (
                            <div
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors.UserCode}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6 col-lg-2">
                          <label htmlFor="Phone">Phone</label>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            name="Phone"
                            placeholder="Enter Phone Number"
                            value={formValue?.Phone}
                            onChange={handleFormChange}
                          />
                        </div>
                        <div className="col-md-6 col-lg-2">
                          <label htmlFor="Mobile">Mobile Number</label>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            name="Mobile"
                            placeholder="Enter Mobile Number"
                            value={formValue?.Mobile}
                            onChange={handleFormChange}
                          />
                        </div>
                        <div className="col-md-6 col-lg-2">
                          <label htmlFor="Street">Street</label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            name="Street"
                            placeholder="Enter Street"
                            value={formValue?.Street}
                            onChange={handleFormChange}
                          />
                        </div>
                        <div className="col-md-6 col-lg-2">
                          <label>Time Format</label>
                          <select
                            name="TimeFormat"
                            className="form-control form-control-sm"
                            value={formValue?.TimeFormat}
                            onChange={handleFormChange}
                          >
                            <option value="12">12 Hours</option>
                            <option value="24">24 Hours</option>
                          </select>
                        </div>

                        <div className="col-md-6 col-lg-2">
                          <label htmlFor="Designation">
                            User Department
                          </label>
                          <select
                            name="UsersDepartment"
                            className={`form-control form-control-sm ${validationErrors.UsersDepartment ? "is-invalid" : ""}`}
                            value={formValue?.UsersDepartment}
                            onChange={handleFormChange}
                          >
                            <option value="">Select</option>
                            {UsersDepartmentList &&
                              UsersDepartmentList?.length > 0 &&
                              UsersDepartmentList.map((data, index) => (
                                <option value={data?.id} key={index}>
                                  {data?.Name}
                                </option>
                              ))}
                          </select>
                        </div>

                        {/* Designation Select Field */}
                        <div className="col-md-6 col-lg-2">
                          <label htmlFor="Designation">
                            Designation
                            <span className="text-danger">*</span>
                          </label>
                          <select
                            name="Designation"
                            className={`form-control form-control-sm ${validationErrors.Designation ? "is-invalid" : ""}`}
                            value={formValue?.Designation}
                            onChange={handleFormChange}
                          >
                            <option value="">Select</option>
                            {designationList &&
                              designationList?.length > 0 &&
                              designationList.map((data, index) => (
                                <option value={data?.Id} key={index}>
                                  {data?.Name}
                                </option>
                              ))}
                          </select>
                          {validationErrors.Designation && (
                            <div
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors.Designation}
                            </div>
                          )}
                        </div>

                        <div className="col-md-6 col-lg-4">
                          <label htmlFor="Language">Language</label>
                          <LanguageInput />
                        </div>
                        <div className="col-md-6 col-lg-4">
                          <label htmlFor="Role">
                            Role
                            <span className="text-danger">*</span>
                          </label>
                          <RoleInput />
                          {validationErrors.Role && (
                            <div
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors.Role}
                            </div>
                          )}
                        </div>

                        <div className="col-md-6 col-lg-4">
                          <label htmlFor="Language">Reporting Manager</label>
                          <ReportingManager />
                        </div>

                        <div className="col-md-6 col-lg-2">
                          <label>Status</label>
                          <span className="text-danger">*</span>
                          <select
                            name="Status"
                            className={`form-control form-control-sm ${validationErrors.Status ? "is-invalid" : ""}`}
                            value={formValue?.Status}
                            onChange={handleFormChange}
                          >
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                          </select>
                          {validationErrors.Status && (
                            <div
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors.Status}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-12 col-lg-12 d-flex align-items-center justify-content-end gap-2">
                        <button
                          className="btn btn-dark btn-custom-size"
                          name="SaveButton"
                          onClick={() => navigate("/user")}
                        >
                          <span className="me-1">Back</span>
                          <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
                        </button>
                        <button
                          onClick={(e) => handleResetData(e)}
                          className="btn btn-dark btn-custom-size"
                        >
                          Reset
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary btn-custom-size"
                        >
                          {isEditing ? "Update" : "Submit"}
                        </button>
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

export default AddUser;
