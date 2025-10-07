import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { axiosOther } from "../../../../http/axios_base_url";
import { fleetValidationSchema } from "../master_validation";
import { fleetInitialValue } from "../masters_initial_value";
import { ToastContainer, toast } from "react-toastify";
import { Dropdown, Tab, Nav } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
import UseTable from "../../../../helper/UseTable";
import { scrollToTop } from "../../../../helper/scrollToTop";

const FleetMaster = () => {
  const [selectBtn, setSelectBtn] = useState("Newest");
  const [initialList, setInitialList] = useState([]);
  const [formValue, setFormValue] = useState(fleetInitialValue);
  const [validationErrors, setValidationErrors] = useState({});
  const [filterValue, setFilterValue] = useState([]);
  const [filterInput, setFilterInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  const handlePageChange = (page) => setCurrentPage(page - 1);
  const handleRowsPerPageChange = (newRowsPerPage) =>
    setRowsPerPage(newRowsPerPage);

  const getListDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("fleetmasterlist");
      setInitialList(data?.DataList);
      setFilterValue(data?.DataList);
    } catch (error) {
      console.log("fleet-error", error);
    }
  };

  useEffect(() => {
    getListDataToServer();
  }, []);

  useEffect(() => {
    const filteredList = initialList?.filter(
      (data) =>
        data?.VehicleType?.toLowerCase()?.includes(
          filterInput?.toLowerCase()
        ) ||
        data?.RegistrationNumber?.toLowerCase()?.includes(
          filterInput?.toLowerCase()
        ) ||
        data?.Status?.toLowerCase()?.includes(filterInput?.toLowerCase())
    );
    setFilterValue(filteredList);
  }, [filterInput]);

  const table_columns = [
    {
      name: "Sr. No.",
      selector: (row, index) => (
        <span className="font-size-11">
          {currentPage * rowsPerPage + index + 1}
        </span>
      ),
      width: "5rem",
      // style: {
      //   display: "flex",
      //   justifyContent: "center",
      // },
    },
    {
      name: "Vehicle Type",
      selector: (row) => row?.VehicleType,
      cell: (row) => <span>{row?.VehicleType}</span>,
      sortable: true,
      width: "10rem",
    },
    {
      name: "Registration Number",
      selector: (row) => row?.RegistrationNumber,
      cell: (row) => <span>{row?.RegistrationNumber}</span>,
      sortable: true,
      width: "10rem",
    },
    {
      name: "Colour",
      selector: (row) => row?.Colour,
      cell: (row) => <span>{row.Colour}</span>,
      sortable: true,
    },
    {
      name: "Fule Type",
      selector: (row) => row?.FuelType,
      cell: (row) => <span>{row.FuelType}</span>,
      sortable: true,
    },
    {
      name: "Assigned Driver",
      selector: (row) => row?.AssignedDriver,
      cell: (row) => <span>{row.AssignedDriver}</span>,
      sortable: true,
    },
    {
      name: "Insurance",
      selector: (row) => row?.Insurance,
      cell: (row) => <span>{row.Insurance}</span>,
      sortable: true,
    },
    {
      name: "Insurance Date",
      selector: (row) => row?.IssueDate,
      cell: (row) => <span>{row.IssueDate}</span>,
      sortable: true,
    },
    {
      name: "Permits",
      selector: (row) => row?.Permits,
      cell: (row) => <span>{row.Permits}</span>,
      sortable: true,
    },
    {
      name: "Permits Expiry",
      selector: (row) => row?.PollutionPermitsExpiry,
      cell: (row) => <span>{row.PollutionPermitsExpiry}</span>,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row?.Status,
      cell: (row) => (
        <span
          className={`badge ${row.Status == 1
              ? "badge-success light badge"
              : "badge-danger light badge"
            }`}
        >
          {row.Status == 1 ? "Active" : "Inactive"}
        </span>
      ),
      sortable: true,
      width: "4.5rem",
    },
    {
      name: "Action",
      selector: (row) => (
        <div className="d-flex align-items-center gap-1 sweetalert">
          <i
            className="fa-solid fa-pencil cursor-pointer text-success action-icon"
            onClick={() => handleEdit(row)}
            onChange={scrollToTop()}
          ></i>
          <i
            className="fa-solid fa-trash-can cursor-pointer text-danger action-icon sweet-confirm"
            onClick={() => handleDelete(row?.id)}
          ></i>
        </div>
      ),
      width: "4.5rem",
    },
  ];

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
      await fleetValidationSchema.validate(formValue, {
        abortEarly: false,
      });
      setValidationErrors({});
      const { data } = await axiosOther.post("addupdatefleetmaster", formValue);
      if (data?.Status === 1) {
        getListDataToServer();
        setIsEditing(false);
        setFormValue(fleetInitialValue);
        toast.success(data?.message || data?.Message);
      } else {
        toast.error(data?.message || data?.Message);
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
        toast.error(data[0][1]);
      }
    }
  };

  const handleEdit = (value) => {
    setFormValue({
      id: value?.id,
      VehicleType: value?.VehicleType,
      RegistrationNumber: value?.RegistrationNumber,
      SetDefault: value?.SetDefault === "Yes" ? "1" : "0",
      Status: value?.Status === "Active" ? 1 : 0,
      AddedBy: value?.AddedBy,
      UpdatedBy: value?.UpdatedBy,
    });
    setIsEditing(true);
    formRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmation = await swal({
      title: "Are you sure want to Delete?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });
    if (confirmation) {
      try {
        const { data } = await axiosOther.post("deletefleetmaster", { id });
        if (data?.Status == 1 || data?.status == 1 || data?.result) {
          toast.success(data?.Message || data?.message || data?.result);
          getListDataToServer();
        }
      } catch (err) {
        toast.error(err?.message || err?.Message);
      }
    }
  };

  const handleReset = () => {
    setFormValue(fleetInitialValue);
    setValidationErrors({});
    setIsEditing(false);
  };

  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">
                {isEditing ? "Update Fleet " : "Add Fleet"}
              </h4>
              <button
                className="btn btn-dark btn-custom-size"
                name="SaveButton"
                onClick={() => navigate(-1)}
              >
                <span className="me-1">Back</span>
                <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
              </button>
            </div>
            <div className="card-body">
              <div className="form-validation" ref={formRef}>
                <ToastContainer />
                <form className="form-valide" onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-12">
                      <div className="row form-row-gap">
                        <div className="col-md-6 col-lg-2">
                          <label htmlFor="vehicleType">
                            Vehicle Type
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className={`form-control form-control-sm ${validationErrors?.VehicleType ? "is-invalid" : ""
                              }`}
                            name="VehicleType"
                            placeholder="Enter Vehicle Type"
                            value={formValue?.VehicleType}
                            onChange={handleFormChange}
                          />
                          {validationErrors?.VehicleType && (
                            <div
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.VehicleType}
                            </div>
                          )}
                        </div>

                        <div className="col-md-6 col-lg-2">
                          <label htmlFor="registrationNumber">
                            Registration Number
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className={`form-control form-control-sm ${validationErrors?.RegistrationNumber
                                ? "is-invalid"
                                : ""
                              }`}
                            name="RegistrationNumber"
                            placeholder="Enter Registration Number"
                            value={formValue?.RegistrationNumber}
                            onChange={handleFormChange}
                          />
                          {validationErrors?.RegistrationNumber && (
                            <div
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.RegistrationNumber}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6 col-lg-2">
                          <label htmlFor="registrationNumber">
                            Chechis Number
                          </label>
                          <input
                            type="text"
                            className={`form-control form-control-sm ${validationErrors?.RegistrationNumber
                                ? "is-invalid"
                                : ""
                              }`}
                            name="RegistrationNumber"
                            placeholder="Enter Registration Number"
                            value={formValue?.RegistrationNumber}
                            onChange={handleFormChange}
                          />
                          {validationErrors?.RegistrationNumber && (
                            <div
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.RegistrationNumber}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6 col-lg-2">
                          <label htmlFor="registrationNumber">
                            Registration Number
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className={`form-control form-control-sm ${validationErrors?.RegistrationNumber
                                ? "is-invalid"
                                : ""
                              }`}
                            name="RegistrationNumber"
                            placeholder="Enter Registration Number"
                            value={formValue?.RegistrationNumber}
                            onChange={handleFormChange}
                          />
                          {validationErrors?.RegistrationNumber && (
                            <div
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.RegistrationNumber}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6 col-lg-2">
                          <label htmlFor="registrationNumber">
                            Registration Number
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className={`form-control form-control-sm ${validationErrors?.RegistrationNumber
                                ? "is-invalid"
                                : ""
                              }`}
                            name="RegistrationNumber"
                            placeholder="Enter Registration Number"
                            value={formValue?.RegistrationNumber}
                            onChange={handleFormChange}
                          />
                          {validationErrors?.RegistrationNumber && (
                            <div
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.RegistrationNumber}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6 col-lg-2">
                          <label htmlFor="registrationNumber">
                            Registration Number
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className={`form-control form-control-sm ${validationErrors?.RegistrationNumber
                                ? "is-invalid"
                                : ""
                              }`}
                            name="RegistrationNumber"
                            placeholder="Enter Registration Number"
                            value={formValue?.RegistrationNumber}
                            onChange={handleFormChange}
                          />
                          {validationErrors?.RegistrationNumber && (
                            <div
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.RegistrationNumber}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6 col-lg-2">
                          <label htmlFor="registrationNumber">
                            Registration Number
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className={`form-control form-control-sm ${validationErrors?.RegistrationNumber
                                ? "is-invalid"
                                : ""
                              }`}
                            name="RegistrationNumber"
                            placeholder="Enter Registration Number"
                            value={formValue?.RegistrationNumber}
                            onChange={handleFormChange}
                          />
                          {validationErrors?.RegistrationNumber && (
                            <div
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.RegistrationNumber}
                            </div>
                          )}
                        </div>

                        <div className="col-md-6 col-lg-2">
                          <label>Status</label>
                          <select
                            name="Status"
                            className="form-control form-control-sm"
                            value={formValue?.Status}
                            onChange={handleFormChange}
                          >
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                          </select>
                        </div>

                        <div className="col-md-6 col-lg-2">
                          <label>Default</label>
                          <div className="d-flex gap-3">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="SetDefault"
                                value="1"
                                id="default_yes"
                                checked={formValue?.SetDefault === "1"}
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
                                name="SetDefault"
                                value="0"
                                id="default_no"
                                checked={formValue?.SetDefault === "0"}
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

                        <div className="col-md-6 col-lg-2 d-flex align-items-center m-3">
                          <button
                            type="submit"
                            className="btn btn-primary btn-custom-size"
                          >
                            {isEditing ? "Update" : "Submit"}
                          </button>
                          <button
                            type="button"
                            className="btn btn-dark btn-custom-size ms-2"
                            onClick={handleReset}
                          >
                            Reset
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
      <Tab.Container defaultActiveKey="All">
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <div className="card-action coin-tabs mb-2">
            <Nav as="ul" className="nav nav-tabs">
              <Nav.Item as="li" className="nav-item">
                <Nav.Link className="nav-link" eventKey="All">
                  All List
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </div>
          <div className="col-md-4">
            <div className="nav-item d-flex align-items-center">
              <div className="input-group search-area">
                <input
                  type="text"
                  className="form-control border"
                  placeholder="Search.."
                  onChange={(e) => setFiterInput(e.target.value)}
                />
                <span className="input-group-text border">
                  <i className="flaticon-381-search-2 cursor-pointer"></i>
                </span>
              </div>
            </div>
          </div>
          <div className="d-flex align-items-center mb-2 flex-wrap"></div>
        </div>
        <UseTable
          table_columns={table_columns}
          filterValue={filterValue}
          setFilterValue={setFilterValue}
          rowsPerPage={rowsPerPage}
          handlePage={handlePageChange}
          handleRowsPerPage={handleRowsPerPageChange}
        />
      </Tab.Container>
    </>
  );
};

export default FleetMaster;
