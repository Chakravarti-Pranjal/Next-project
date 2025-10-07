import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { axiosOther } from "../../../http/axios_base_url";
import { Table } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useMultipleSelect from "../../../hooks/custom_hooks/useMultipleSelect";
import { notifySuccess, notifyError } from "../../../helper/notify.jsx";
import { permissionAddValidation } from "./user_validation.js";
import { Padding } from "@mui/icons-material";
import axios from "axios";

const renderOptions = (data, level = 0) => {
  return data.map((item) => (
    <React.Fragment key={item.id}>
      <option value={item.id}>{item.name}</option>
      {item.children?.length > 0 && renderOptions(item.children, level + 1)}
    </React.Fragment>
  ));
};

const standardPermissions = ["view", "create", "update", "delete", "import", "export"];

const UserProfile = () => {
  const [moduleList, setModuleList] = useState([]);
  const [rolePermissions, setRolePermissions] = useState([]); // Array of permission IDs assigned to the role
  const [permissionStates, setPermissionStates] = useState({});
  const [loading, setLoading] = useState(true);
  const [allSelected, setAllSelected] = useState(false);
  const navigate = useNavigate()

  const { state } = useLocation();
  const role_id = state?.data?.id;
  //console.log(state?.data?.id);

  const fetchData = async () => {
    try {
      const [moduleRes, roleRes] = await Promise.all([
        axiosOther.post("modulelist"),
        axiosOther.post("listroles", { id: role_id }),
      ]);

      const modules = moduleRes.data?.Datalist || [];
      const roleList = roleRes.data?.Datalist?.[0] || [];
      const permissionIds = roleList.permissions_ids || []; // this must be an array like [49, 50, 51]

      //console.log("Role Permission IDs:", permissionIds)
      //const rolePerms = [49, 50, 51, 52, 55, 56, 57, 58, 59, 60];

      setModuleList(modules);
      setRolePermissions(permissionIds);

      // Initialize permission states
      const initialStates = {};
      permissionIds.forEach((id) => {
        initialStates[id] = true;
      });

      setPermissionStates(initialStates);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggle = (permissionId) => {
    setPermissionStates((prev) => ({
      ...prev,
      [permissionId]: !prev[permissionId],
    }));
  };

  const toggleModulePermissions = (module) => {
    const allOn = module.Permission.every((p) => permissionStates[p.permission_id]);
    const newState = { ...permissionStates };

    module.Permission.forEach((perm) => {
      newState[perm.permission_id] = !allOn;
    });

    setPermissionStates(newState);
  };

  const togglePermissionTypeColumn = (permKey) => {
    const isAllSelected = moduleList.every((module) => {
      const perm = module.Permission?.find((p) =>
        p.permission_name.startsWith(`${permKey}_`)
      );
      return perm && permissionStates[perm.permission_id];
    });

    const newState = { ...permissionStates };

    moduleList.forEach((module) => {
      const perm = module.Permission?.find((p) =>
        p.permission_name.startsWith(`${permKey}_`)
      );
      if (perm) {
        newState[perm.permission_id] = !isAllSelected;
      }
    });

    setPermissionStates(newState);
  };

  const renderToggle = (moduleId, permissionId) => {
    const toggleId = `perm-${moduleId}-${permissionId}`;
    return (
      <div className="">
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              left: "40px",
              bottom: "0px",
              top: "0",
            }}
            className="toggle-container m-0"
          >

            <input
              type="checkbox"
              className="toggle m-0"
              checked={!!permissionStates[permissionId]}
              onChange={() => handleToggle(permissionId)}
              id={toggleId}
            //id={`perm-${module.id}-${permKey}`}
            />

            <label
              htmlFor={toggleId}
              className="toggle-label m-0"
            ></label>
          </div>
        </div>
      </div>
    );
  };

  const handleSave = async () => {
    const selectedPermissions = Object.entries(permissionStates)
      .filter(([_, value]) => value)
      .map(([key]) => {
        const id = parseInt(key);
        return isNaN(id) ? null : id;
      })
      .filter((id) => id !== null);

    const postRequest = {
      role_id: role_id,
      permissions: selectedPermissions,
    }
    //console.log("post request ", postRequest);
    try {
      await axiosOther.post("rolehaspermission", postRequest);
      //alert("Permissions updated successfully.");
      notifySuccess("Permission Updated");
    } catch (error) {
      console.error("Error saving permissions:", error);
      //alert("Failed to update permissions.");
      notifySuccess("Failed to update permissions.");
    }
  };

  return (
    <div className="row">
      <ToastContainer />
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header">
            <h4 className="card-title">Permission</h4>
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
                onClick={handleSave}
              >
                Submit
              </button>
            </div>
          </div>
          {/* Show details */}
          <div className="container mt-5">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-header bg-primary text-white rounded-top-4">
                <h5 className="mb-0">Roles Information</h5>
              </div>
              <div className="card-body px-4 py-3">
                <div className="row text-center fw-semibold border border-secondary-subtle">
                  <div className="col-sm-4 border-end border-bottom py-1">
                    Role Name : {state?.data?.name}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* End */}
          <div className="card-body">
            <Table responsive striped bordered>
              <thead className="border-1 border-top mt-1">
                <tr className="border-1">
                  <th
                    scope="col"
                    className="font-size-12 text-center border-1 p-1"
                  ></th>
                  <th
                    scope="col"
                    className="font-size-12 text-center border-1 p-1"
                  ></th>
                  {standardPermissions.map((perm) => {
                    const isAllSelected = moduleList.every((module) => {
                      const permItem = module.Permission?.find((p) =>
                        p.permission_name.startsWith(`${perm}_`)
                      );
                      return permItem && permissionStates[permItem.permission_id];
                    });
                    return (
                      <th
                        key={perm}
                        scope="col"
                        className="font-size-12 border-1"
                        style={{
                          padding: "20px 0px 0px 0px",
                          textTransform: "uppercase",
                        }}
                      >
                        <p
                          style={{
                            width: "70px",
                            margin: "-5px auto 12px auto",
                          }}
                          className="cursor-pointer"
                          onClick={() => togglePermissionTypeColumn(perm)}
                        >{isAllSelected ? "Unselect All" : "Select All"}</p>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <thead>
                <tr>
                  <th scope="col" className="font-size-12 text-start">
                    <strong>MODULE</strong>
                  </th>
                  <th scope="col" className="font-size-12 text-start"></th>
                  {standardPermissions.map((perm) => (
                    <th
                      scope="col"
                      className="font-size-12 text-center"
                      key={perm}
                    ><strong>{perm.toUpperCase()}</strong>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="text-center">
                {moduleList?.map((module) => {
                  const modulePerms = module.Permission || [];
                  return (
                    <tr key={module.id}>
                      <td className="font-size-10 text-start">
                        {module?.Name}
                      </td>

                      <td style={{
                        textTransform: "uppercase",
                        width: "120px",
                        textAlign: "center",
                        fontSize: "0.84rem",
                      }}
                        onClick={() => toggleModulePermissions(module)}
                      >
                        <span className="cursor-pointer">
                          {
                            module.Permission.every((p) => permissionStates[p.permission_id])
                              ? 'Unselect All'
                              : 'Select All'
                          }
                        </span>

                      </td>

                      {standardPermissions.map((permKey) => {
                        const perm = modulePerms.find((p) =>
                          p.permission_name.startsWith(`${permKey}_`)
                        );
                        return (
                          <td key={permKey}>
                            {perm ? renderToggle(module.id, perm.permission_id) : <span>—</span>}
                          </td>
                        );
                      })}


                      {/* {standardPermissions.map((permKey) => {
                        const permission = module.Permission?.find((p) =>
                          p.permission_name.startsWith(`${permKey}_`)
                        );

                        return (
                          <td className="font-size-12" key={permKey}>
                            {permission ? renderToggle(permission.permission_id) : <span>—</span>}
                          </td>
                        );
                      })} */}

                    </tr>
                  );
                })}
              </tbody>
            </Table>
            <div className="col-md-12 col-lg-12 d-flex align-items-center justify-content-end gap-3">
              <button type="submit" className="btn btn-dark btn-custom-size">
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary btn-custom-size"
                onClick={handleSave}
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

export default UserProfile;

