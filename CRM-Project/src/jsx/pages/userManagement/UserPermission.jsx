import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosOther } from "../../../http/axios_base_url";
import { Table } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { notifySuccess, notifyError } from "../../../helper/notify.jsx";
import axios from "axios";

const standardPermissions = ["view", "create", "update", "delete", "import", "export"];

const UserPermission = () => {
  const [moduleList, setModuleList] = useState([]);
  const [rolePermissions, setRolePermissions] = useState([]);
  const [permissionStates, setPermissionStates] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { state } = useLocation();
  const role_id = state?.data?.id;

  const fetchData = async () => {
    try {
      if (!role_id) {
        console.error("Error: role_id is undefined");
        notifyError("Role ID is missing");
        setLoading(false);
        return;
      }

      const [moduleRes, roleRes] = await Promise.all([
        axiosOther.post("modulelist"),
        axiosOther.post("listusers", { id: role_id }),
      ]);

      const modules = moduleRes.data?.Datalist || [];
      const roleList = roleRes.data?.Datalist?.[0] || {};
      // Extract PermissionId values from Permissions array
      const permissionIds = Array.isArray(roleList?.Permissions)
        ? roleList.Permissions.map((perm) => perm.PermissionId)
        : [];

      console.log("Fetched Permission IDs:", permissionIds);
      console.log("Module List:", modules);

      setModuleList(modules);
      setRolePermissions(permissionIds);

      // Initialize permission states
      const initialStates = {};
      permissionIds.forEach((id) => {
        initialStates[id] = true;
      });

      console.log("Initial Permission States:", initialStates);
      setPermissionStates(initialStates);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      notifyError("Failed to fetch data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [role_id]);

  const handleToggle = (permissionId) => {
    setPermissionStates((prev) => {
      const newState = {
        ...prev,
        [permissionId]: !prev[permissionId],
      };
      console.log("Updated Permission States:", newState);
      return newState;
    });
  };

  const toggleModulePermissions = (module) => {
    const allOn = module.Permission.every((p) => permissionStates[p.permission_id]);
    const newState = { ...permissionStates };

    module.Permission.forEach((perm) => {
      newState[perm.permission_id] = !allOn;
    });

    console.log("Toggled Module Permissions:", newState);
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

    console.log("Toggled Column Permissions:", newState);
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
            />
            <label htmlFor={toggleId} className="toggle-label m-0"></label>
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
      user_id: role_id,
      permissions: selectedPermissions,
    };

    try {
      await axiosOther.post("givepermissiontouser", postRequest);
      notifySuccess("Permission Updated");
    } catch (error) {
      console.error("Error saving permissions:", error);
      notifyError("Failed to update permissions");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="row">
      <ToastContainer />
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header">
            <h4 className="card-title">User Permission</h4>
            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-dark btn-custom-size"
                onClick={() => navigate(-1)}
              >
                Back
                <i className="fa-solid fa-backward text-dark bg-white p-1 rounded ms-1"></i>
              </button>
              <button
                type="button"
                className="btn btn-primary btn-custom-size"
                onClick={handleSave}
              >
                Submit
              </button>
            </div>
          </div>
          <div className="container mt-5">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-header bg-primary text-white rounded-top-4">
                <h5 className="mb-0">Roles Information</h5>
              </div>
              <div className="card-body px-4 py-3">
                <div className="row text-center fw-semibold border border-secondary-subtle">
                  <div className="col-sm-4 border-end border-bottom py-1">
                    User Name: {state?.data?.Name || "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card-body">
            <Table responsive striped bordered>
              <thead className="border-1 border-top mt-1">
                <tr className="border-1">
                  <th scope="col" className="font-size-12 text-center border-1 p-1"></th>
                  <th scope="col" className="font-size-12 text-center border-1 p-1"></th>
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
                        >
                          {isAllSelected ? "Unselect All" : "Select All"}
                        </p>
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
                    <th scope="col" className="font-size-12 text-center" key={perm}>
                      <strong>{perm.toUpperCase()}</strong>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-center">
                {moduleList?.map((module) => {
                  const modulePerms = module.Permission || [];
                  return (
                    <tr key={module.id}>
                      <td className="font-size-10 text-start">{module?.Name}</td>
                      <td
                        style={{
                          textTransform: "uppercase",
                          width: "120px",
                          textAlign: "center",
                          fontSize: "0.84rem",
                        }}
                        onClick={() => toggleModulePermissions(module)}
                      >
                        <span className="cursor-pointer">
                          {module.Permission.every((p) => permissionStates[p.permission_id])
                            ? "Unselect All"
                            : "Select All"}
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
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            <div className="col-md-12 col-lg-12 d-flex align-items-center justify-content-end gap-3">
              <button type="button" className="btn btn-dark btn-custom-size">
                Cancel
              </button>
              <button
                type="button"
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

export default UserPermission;

