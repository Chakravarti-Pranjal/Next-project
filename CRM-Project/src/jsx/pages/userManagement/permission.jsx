import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { axiosOther } from "../../../http/axios_base_url";
import { Table } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useMultipleSelect from "../../../hooks/custom_hooks/useMultipleSelect";
import { notifySuccess, notifyError } from "../../../helper/notify.jsx";
import { permissionAddValidation } from "./user_validation.js";

const renderOptions = (data, level = 0) => {
  return data.map((item) => (
    <React.Fragment key={item.id}>
      <option value={item.id}>{item.name}</option>
      {item.children?.length > 0 && renderOptions(item.children, level + 1)}
    </React.Fragment>
  ));
};

const Permission = () => {
  const [userList, setUserList] = useState([]);
  const [moduleList, setModuleList] = useState([]);
  const [permissionList, setPermissionList] = useState([]);
  const [profilePermissionList, setProfilePermissionList] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [permissionDashboardList, setPermissionDashboardList] = useState([]);
  const [dashboardpermission, setDashboardpermission] = useState([]);
  const [formValue, setFormValue] = useState({
    DashboardPermissionId: [],
    RoleId: "",
    Description: "",
  });
  const [modulePermissions, setModulePermissions] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();
  // console.log(state, "state");
  // const {
  //     SelectInput: PermissionInput,
  //     selectedData: permissionSelected,
  //     setSelectedData: setPermissionSelected,
  // } = useMultipleSelect(permissionOption);

  const getListDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("dashboard-permissions");
      setPermissionDashboardList(data);
    } catch (error) {
      console.log("user-error", error);
    }
    try {
      const { data } = await axiosOther.post("listroles");

      setUserList(data?.Datalist);
    } catch (error) {
      console.log("user-error", error);
    }
    try {
      const { data } = await axiosOther.post("modulemasterlist");

      setModuleList(data?.Datalist);
    } catch (error) {
      console.log("user-error", error);
    }
    try {
      const { data } = await axiosOther.post("listpermissions");

      setPermissionList(data?.Datalist);
    } catch (error) {
      console.log("user-error", error);
    }
    // if(state){
    //     try {
    //         const { data } = await axiosOther.post("profilelist",{
    //                id:state?.permissionViewId
    //         });

    //         setProfilePermissionList(data?.DataList)
    //     } catch (error) {
    //         console.log("user-error", error);
    //     }
    // }
  };

  console.log(formValue, profilePermissionList, "formValue");

  useEffect(() => {
    getListDataToServer();
    if (state?.permissionViewId) {
      setFormValue((prev) => ({
        ...prev,
        RoleId: state?.permissionViewId?.id,
        Description: state?.permissionViewId?.Description,
        DashboardPermissionId:
          state?.permissionViewId?.DashboardPermissions.map(
            (data) => data?.DashboardPermissionId
          ),
      }));
      const transformedPermissions = state?.permissionViewId?.Modules.map(
        (module) => ({
          ModuleId: module.ModuleId,
          Permissions: module.Permissions.filter(
            (permission) => typeof permission === "object"
          ) // Filter out invalid permission objects
            .map((permission) => permission.PermissionId), // Map to only PermissionId
        })
      );

      setModulePermissions(transformedPermissions);
    }
  }, []);

  const handleSubmit = async () => {
    try {
      await permissionAddValidation.validate(
        {
          ...formValue,
          Modules: modulePermissions,
        },
        {
          abortEarly: false,
        }
      );
      setValidationErrors({});
      const { data } = await axiosOther.post("addupdateprofile", {
        ...formValue,
        Modules: modulePermissions,
      });

      if (data?.Status === 1 || data?.Message) {
        getListDataToServer();
        setIsEditing(false);
        setFormValue({
          DashboardPermissionId: [],
          RoleId: "",
          Description: "",
        });
        setModulePermissions([]);

        notifySuccess(data?.message || data?.Message);
        navigate("/permission");
      } else {
        notifyError(data?.message || data?.Message);
      }
    } catch (error) {
      if (error.inner) {
        const validationErrorss = error.inner.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {});
        setValidationErrors(validationErrorss);
      }

      if (error.response?.data?.Errors || error.response?.data?.errors) {
        const data = Object.entries(
          error.response?.data?.Errors || error.response?.data?.errors
        );
        notifyError(data[0][1]);
      }
    }
  };

  const isPermissionSelectedForAll = (permissionId) => {
    const allModuleIds = moduleList.map((module) => module.id);
    return allModuleIds.every((moduleId) => {
      const currentModule = modulePermissions.find(
        (module) => module.ModuleId === moduleId
      );
      return currentModule?.Permissions.includes(permissionId);
    });
  };

  const hanldeColSelectAll = (permissionId) => {
    const allModules = moduleList.map((module) => module.id);

    // Check if the permission is already selected for all modules
    const isPermissionSelectedForAll = allModules.every((moduleId) => {
      const currentModule = modulePermissions.find(
        (module) => module.ModuleId === moduleId
      );
      return currentModule?.Permissions.includes(permissionId);
    });

    let updatedModulePermissions;

    if (isPermissionSelectedForAll) {
      // Deselect: Remove permissionId from each module and remove modules with empty Permissions
      updatedModulePermissions = modulePermissions
        .map((module) => ({
          ...module,
          Permissions: module.Permissions.filter((id) => id !== permissionId), // Remove permissionId
        }))
        .filter((module) => module.Permissions.length > 0); // Keep modules with non-empty Permissions
    } else {
      // Select: Add permissionId to all modules
      updatedModulePermissions = allModules.map((moduleId) => {
        const currentModule = modulePermissions.find(
          (module) => module.ModuleId === moduleId
        );

        if (currentModule) {
          // Update existing module's permissions
          const updatedPermissions = [
            ...new Set([...currentModule.Permissions, permissionId]),
          ];
          return { ...currentModule, Permissions: updatedPermissions };
        } else {
          // If module doesn't exist, add it with the selected permission
          return {
            ModuleId: moduleId,
            Permissions: [permissionId],
          };
        }
      });
    }

    // Update state with the modified permissions
    setModulePermissions(updatedModulePermissions);
  };

  const handleSelectAllRow = (moduleId) => {
    const allPermissions = permissionList.map((permission) => permission.id);
    const currentModuleIndex = modulePermissions.findIndex(
      (module) => module.ModuleId === moduleId
    );
    const isAllSelected =
      currentModuleIndex > -1 &&
      modulePermissions[currentModuleIndex].Permissions.length ===
      allPermissions.length;

    let updatedModulePermissions;

    if (currentModuleIndex > -1) {
      // Update the existing module
      updatedModulePermissions = [...modulePermissions];
      updatedModulePermissions[currentModuleIndex].Permissions = isAllSelected
        ? []
        : allPermissions;

      // Remove the module if its Permissions array is empty
      if (
        updatedModulePermissions[currentModuleIndex].Permissions.length === 0
      ) {
        updatedModulePermissions = updatedModulePermissions.filter(
          (module) => module.ModuleId !== moduleId
        );
      }
    } else {
      // Add a new module with all permissions
      updatedModulePermissions = [
        ...modulePermissions,
        { ModuleId: moduleId, Permissions: allPermissions },
      ];
    }

    setModulePermissions(updatedModulePermissions);
  };

  const handleCheckBoxInput = (moduleId, permissionId) => {
    setModulePermissions((prevState) => {
      const existingModule = prevState.find(
        (module) => module.ModuleId === moduleId
      );

      if (existingModule) {
        const isSelected = existingModule.Permissions.includes(permissionId);

        return prevState.map((module) =>
          module.ModuleId === moduleId
            ? {
              ...module,
              Permissions: isSelected
                ? module.Permissions.filter((id) => id !== permissionId)
                : [...module.Permissions, permissionId],
            }
            : module
        );
      } else {
        return [
          ...prevState,
          {
            ModuleId: moduleId,
            Permissions: [permissionId],
          },
        ];
      }
    });
  };
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      const updatedPermissions = checked
        ? [...formValue[name], +value]
        : formValue[name].filter((id) => id !== value);

      setFormValue((prev) => ({
        ...prev,
        [name]: updatedPermissions,
      }));

      setDashboardpermission(updatedPermissions);
    } else {
      setFormValue((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleRoleChange = (event) => {
    const selectedRoleId = event.target.value;
    setFormValue({
      ...formValue,
      RoleId: selectedRoleId,
    });
  };

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header">
            <h4 className="card-title">Profile Information</h4>
            <div className="d-flex justify-content-end gap-2">
              <button
                type="submit"
                className="btn btn-dark btn-custom-size"
                onClick={() => navigate(-1)}
              >
                Back
                <i className="fa-solid fa-backward text-dark bg-white p-1 rounded ms-1"></i>
              </button>

              <button
                type="submit"
                className="btn btn-primary btn-custom-size"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
          <div className="card-body">
            <div className="form-validation">
              <ToastContainer />
              <form className="form-valide" onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-12">
                    <div className="row form-row-gap mb-2">
                      <div className="col-md-6 col-lg-3 ">
                        <label>
                          Role
                          <span className="text-danger ms-1">*</span>
                        </label>
                        <select
                          className="form-control form-control-sm"
                          onChange={handleRoleChange}
                          value={formValue?.RoleId}
                        >
                          <option value="">Select</option>
                          {renderOptions(userList)}
                        </select>
                        {validationErrors?.RoleId && (
                          <div
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {validationErrors?.RoleId}
                          </div>
                        )}
                      </div>

                      <div className="col-md-6 col-lg-3">
                        <label> Profile Description</label>
                        <input
                          type="text"
                          className={`form-control form-control-sm `}
                          name="Description"
                          placeholder="Description"
                          value={formValue?.Description}
                          onChange={handleFormChange}
                        />
                      </div>
                      <div className="row">
                        <div className="col-md-6 p-0">
                          <div className="border rounded position-relative  px-2  p-2 mt-1">
                            <label className="mb-1 m-0 position-absolute form-label-position-1 bg-label-border px-1 font-weight-bold ">
                              Permission
                              <span className="text-danger ms-1">*</span>
                            </label>

                            {permissionDashboardList?.length > 0 &&
                              permissionDashboardList.map((data, index) => (
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="DashboardPermissionId"
                                    id="DashboardPermissionId"
                                    value={data?.id}
                                    onChange={handleFormChange}
                                    checked={formValue?.DashboardPermissionId?.includes(
                                      data?.id
                                    )}
                                    style={{ height: "1rem", width: "1rem" }}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="daywise"
                                  >
                                    {data?.name}
                                  </label>
                                </div>
                              ))}
                            {validationErrors?.DashboardPermissionId && (
                              <div
                                className="invalid-feedback animated fadeInUp"
                                style={{ display: "block" }}
                              >
                                {validationErrors?.DashboardPermissionId}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <Table responsive striped bordered>
              <thead className="border-0 border-top mt-1">
                <tr className="border-0">
                  <th
                    scope="col"
                    className="font-size-12 text-center border-0 p-1"
                  ></th>
                  <th
                    scope="col"
                    className="font-size-12 text-center border-0 p-1"
                  ></th>

                  {permissionList?.length > 0 &&
                    permissionList.map((permission, index) => (
                      <th
                        scope="col"
                        className="font-size-12 text-center border-0 p-1"
                      >
                        <p
                          onClick={() => hanldeColSelectAll(permission?.id)}
                          className="cursor-pointer"
                        >
                          {isPermissionSelectedForAll(permission?.id)
                            ? "Deselect All"
                            : "Select All"}
                        </p>
                      </th>
                    ))}
                </tr>
              </thead>
              <thead>
                <tr>
                  <th scope="col" className="font-size-12 text-start">
                    <strong>module</strong>
                  </th>
                  <th scope="col" className="font-size-12 text-start"></th>

                  {permissionList?.length > 0 &&
                    permissionList.map((permission, index) => (
                      <th scope="col" className="font-size-12 text-start">
                        <strong>{permission?.name}</strong>
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {moduleList?.length > 0 &&
                  moduleList?.map((data, index) => {
                    const currentModulePermissions = modulePermissions.find(
                      (modulePerm) => modulePerm.ModuleId === data.id
                    );

                    const isAllSelected =
                      currentModulePermissions?.Permissions.length ===
                      permissionList.length;
                    return (
                      <tr key={index}>
                        <td className="font-size10 text-start">{data?.Name}</td>
                        <td
                          className="font-size10 text-start cursor-pointer"
                          onClick={() => handleSelectAllRow(data?.id)}
                        >
                          {" "}
                          {isAllSelected ? "Deselect All" : "Select All"}
                        </td>
                        {permissionList?.length > 0 &&
                          permissionList.map((permission, index) => (
                            <td className="font-size-12 text-start">
                              <div className="" key={index}>
                                <div className=" d-flex gap-2 px-1 align-items-center box-shadow-1 padding-y-3 rounded">
                                  <div className="toggle-container m-0">
                                    <input
                                      type="checkbox"
                                      className="toggle m-0"
                                      value={permission?.id}
                                      checked={
                                        currentModulePermissions?.Permissions?.includes(
                                          permission.id
                                        ) || false
                                      }
                                      onChange={() =>
                                        handleCheckBoxInput(
                                          data.id,
                                          permission.id
                                        )
                                      }
                                      id={`${data?.id}-${permission?.id}-${index}`}
                                    />
                                    <label
                                      htmlFor={`${data?.id}-${permission?.id}-${index}`}
                                      className="toggle-label m-0"
                                    ></label>
                                  </div>
                                </div>
                              </div>
                            </td>
                          ))}
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
            <div className="col-md-12 col-lg-12 d-flex align-items-center justify-content-end gap-3">
              <button type="submit" className="btn btn-dark btn-custom-size">
                Cancel
              </button>
              {/* <button
                                                                type="submit"
                                                                className="btn btn-secondary btn-custom-size"
                                                            >
                                                                Reset
                                                            </button> */}
              <button
                type="submit"
                className="btn btn-primary btn-custom-size"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Permission;
