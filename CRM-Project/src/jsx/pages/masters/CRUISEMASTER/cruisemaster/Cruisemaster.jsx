// @ts-nocheck
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap-daterangepicker/daterangepicker.css";
import { Dropdown, Tab, Nav } from "react-bootstrap";
import { axiosOther } from "../../../../../http/axios_base_url";
import { CruisemasterValidationSchema } from "../../master_validation.js";
import { CruisemasterInitialValue } from "../../masters_initial_value.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
import { notifySuccess, notifyError } from "../../../../../helper/notify.jsx";
import UseTable from "../../../../../helper/UseTable.jsx";
import { scrollToTop } from "../../../../../helper/scrollToTop.js";
import { Padding } from "@mui/icons-material";

const Cruisemaster = () => {
  const [selectBtn, setSelectBtn] = useState("Newest");
  const [initialList, setInitialList] = useState([]);
  const [formValue, setFormValue] = useState(CruisemasterInitialValue);
  const [validationErrors, setValidationErrors] = useState({});
  const [Destinationlist, setDestinationlist] = useState([]);
  const [filterValue, setFilterValue] = useState([]);
  const [filterInput, setFiterInput] = useState("");
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
      const { data } = await axiosOther.post("cruisemasterlist");
      setInitialList(data?.DataList);
      setFilterValue(data?.DataList);
    } catch (error) {
      console.log("cruisemasterlist-error", error);
    }
  };

  useEffect(() => {
    getListDataToServer();
  }, []);

  useEffect(() => {
    const filteredList = initialList?.filter(
      (data) =>
        data?.CruisePackageName?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
        data?.Destination?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
        data?.RunningDays?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
        data?.ArrivalTime?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
        data?.DepartureTime?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
        data?.Details?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
        data?.Status?.toLowerCase()?.includes(filterInput?.toLowerCase())
    );
    setFilterValue(filteredList);
  }, [filterInput]);

  const table_columns = [
    {
      name: "Sr. No.",
      selector: (row, index) => currentPage * rowsPerPage + index + 1, // Ensure sorting works
      cell: (row, index) => (
        <span className="font-size-11 d-flex justify-content-center">
          {currentPage * rowsPerPage + index + 1}
        </span>
      ),
      width:"8rem"
    },

    {
      name: "Cruise Package Name",
      selector: (row) => row?.CruisePackageName,
      cell: (row) => <span>{row?.CruisePackageName}</span>,
      sortable: true,
    },
    {
      name: "Destination",
      selector: (row) => row?.Destination,
      cell: (row) => <span>{row?.Destination}</span>,
      sortable: true,
    },
    {
      name: "Running Days",
      selector: (row) => row?.RunningDays,
      cell: (row) => <span>{row?.RunningDays}</span>,
      sortable: true,
    },
    {
      name: "Arrival Time",
      selector: (row) => row?.ArrivalTime,
      cell: (row) => <span>{row?.ArrivalTime}</span>,
      sortable: true,
    },
    {
      name: "Departure Time",
      selector: (row) => row?.DepartureTime,
      cell: (row) => <span>{row?.DepartureTime}</span>,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row?.Status,
      cell: (row) => (
        <span
          className={`badge ${row.Status === "Active"
            ? "badge-success light badge"
            : "badge-danger light badge"
            }`}
        >
          {row.Status}
        </span>
      ),
      sortable: true,
      width: "7.5rem",
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
      await CruisemasterValidationSchema.validate(formValue, {
        abortEarly: false,
      });
      setValidationErrors({});
      const { data } = await axiosOther.post("addupdatecruisemaster", formValue);
      if (data?.Status === 1) {
        getListDataToServer();
        setIsEditing(false);
        setFormValue(CruisemasterInitialValue);
        notifySuccess(data?.message || data?.Message);
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

  const handleEdit = (value) => {
    setFormValue({
      id: value?.id,
      CruisePackageName: value?.CruisePackageName,
      Destination: value?.Destination,
      ArrivalTime: value?.ArrivalTime,
      DepartureTime: value?.DepartureTime,
      Details: value?.Details,
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
        const { data } = await axiosOther.post("", { id });
        if (data?.Status == 1 || data?.status == 1 || data?.result) {
          notifySuccess(data?.Message || data?.message || data?.result);
          getListDataToServer();
        }
      } catch (err) {
        notifyError(err?.message || err?.Message);
      }
    }
  };

  const handleReset = () => {
    setFormValue(CruisemasterInitialValue);
    setValidationErrors({});
    setIsEditing(false);
  };
  const getDropdownDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("destinationlist", {
        Search: "",
        Status: 1,
      });
      setDestinationlist(data.DataList);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getDropdownDataToServer();
  }, []);

  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">
                {isEditing ? "Update cruise master " : "Add cruise master"}
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
                        <div className="col-md-6 col-lg-3">
                          <label htmlFor="CruisePackageName">
                            Cruise Package Name
                          </label>
                          <input
                            type="text"
                            className={`form-control form-control-sm ${validationErrors?.CruisePackageName ? "is-invalid" : ""
                              }`}
                            name="CruisePackageName"
                            placeholder="Enter a Cruise Package Name"
                            value={formValue?.CruisePackageName}
                            onChange={handleFormChange}
                          />
                          {validationErrors?.CruisePackageName && (
                            <div
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.CruisePackageName}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6 col-lg-2">
                          <label htmlFor="Destination">
                            Destination
                          </label>
                          <select
                            name="Destination"
                            placeholder="Enter Destination"
                            className={`form-control form-control-sm ${validationErrors?.Destination ? "is-invalid" : ""
                              }`}
                            value={formValue?.Destination}
                            onChange={handleFormChange}
                          >
                            <option value="">select</option>
                            {Destinationlist?.map((value, index) => {
                              return (
                                <option value={value.Name} key={index + 1}>
                                  {value.Name}
                                </option>
                              );
                            })}
                          </select>

                          {validationErrors?.CruiseCompany && (
                            <div
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.CruiseCompany}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6 col-lg-2">
                          <label htmlFor="RunningDays">
                            Running Days
                          </label>
                          <select
                            name="RunningDays"
                            placeholder="Enter RunningDays"
                            className={`form-control form-control-sm ${validationErrors?.RunningDays ? "is-invalid" : ""
                              }`}
                            value={formValue?.RunningDays}
                            onChange={handleFormChange}
                          >
                            <option value="">select</option>
                            <option value={"Monday"}>Monday</option>
                            <option value={"Tuesday"}>Tuesday</option>
                            <option value={"Wednesday"}>Wednesday</option>
                            <option value={"Thirsday"}>Thirsday</option>
                            <option value={"Friday"}>Friday</option>
                            <option value={"Saturday"}>Saturday</option>
                            <option value={"Sunday"}>Sunday</option>

                          </select>
                          {validationErrors?.RunningDays && (
                            <div
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.RunningDays}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6 col-lg-2">
                          <label htmlFor="ArrivalTime">
                            Arrival Time
                          </label>
                          <input
                            type="date"
                            className={`form-control form-control-sm ${validationErrors?.ArrivalTime ? "is-invalid" : ""
                              }`}
                            name="ArrivalTime"
                            placeholder="Enter a Arrival Time"
                            value={formValue?.ArrivalTime}
                            onChange={handleFormChange}
                          />
                          {validationErrors?.ArrivalTime && (
                            <div
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.ArrivalTime}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6 col-lg-2">
                          <label htmlFor="DepartureTime">
                            Departure Time
                          </label>
                          <input
                            type="date"
                            className={`form-control form-control-sm ${validationErrors?.DepartureTime ? "is-invalid" : ""
                              }`}
                            name="DepartureTime"
                            placeholder="Enter Departure Time"
                            value={formValue?.DepartureTime}
                            onChange={handleFormChange}
                          />
                          {validationErrors?.DepartureTime && (
                            <div
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.DepartureTime}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6 col-lg-3">
                          <label htmlFor="Details">
                            Details
                          </label>
                          <input
                            type="text"
                            className={`form-control form-control-sm ${validationErrors?.Details ? "is-invalid" : ""
                              }`}
                            name="Details"
                            placeholder="Enter a Details"
                            value={formValue?.Details}
                            onChange={handleFormChange}
                          />
                          {validationErrors?.Details && (
                            <div
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.Details}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6 col-lg-3">
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

export default Cruisemaster;
