import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap-daterangepicker/daterangepicker.css";
import { Dropdown, Tab, Nav } from "react-bootstrap";
import { axiosOther } from "../../../../http/axios_base_url.js";
import { itineraryRequirementValidationSchema } from "../master_validation.js";
import { itineraryRequirementInitialValue } from "../masters_initial_value.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
import { notifySuccess, notifyError } from "../../../../helper/notify.jsx";
import { scrollToTop } from "../../../../helper/scrollToTop.js";
import UseTable from "../../../../helper/UseTable.jsx";

const ItenaryRequirement = () => {
  const [initialList, setInitialList] = useState([]);
  const [formValue, setFormValue] = useState(itineraryRequirementInitialValue);
  const [validationErrors, setValidationErrors] = useState({});
  const [filterValue, setFilterValue] = useState([]);
  const [filterInput, setFiterInput] = useState("");
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0); // Page index
  const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page

  const handlePageChange = (page) => setCurrentPage(page - 1);
  const handleRowsPerPageChange = (newRowsPerPage) =>
    setRowsPerPage(newRowsPerPage);
  const data = []; // Replace with your data
  const totalRows = 10; // Replace with your total rows count
  const navigate = useNavigate();

  const postDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("itineraryrequirementmasterlist");
      // console.log(data);
      setInitialList(data.ItineraryInfoMaster);
      setFilterValue(data.ItineraryInfoMaster);
    } catch (error) {
      console.log(error);
    }
  };
  // console.log(postDataToServer);

  useEffect(() => {
    postDataToServer();
  }, []);

  useEffect(() => {
    const filteredList = initialList?.filter(
      (data) =>
        data?.ToDestination?.toLowerCase()?.includes(
          filterInput?.toLowerCase()
        ) || data?.Status?.toLowerCase()?.includes(filterInput?.toLowerCase())
    );
    setFilterValue(filteredList);
  }, [filterInput]);
  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setFormValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditClick = (value) => {
    setFormValue({
      id: value?.id,
      FromDestination: value?.FromDestination,
      ToDestination: value?.ToDestination,
      TransferMode: value?.TransferMode,
      Title: value?.Title,
      Description: value?.Description,
      DrivingDistance: value?.DrivingDistance,
      Status: value?.Status == "Active" ? 1 : 0,
      AddedBy: value?.AddedBy,
      UpdatedBy: value?.UpdatedBy,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await itineraryRequirementValidationSchema.validate(formValue, {
        abortEarly: false,
      });
      setValidationErrors({});
      //  console.log(formValue);
      const { data } = await axiosOther.post(
        "addupdateitineraryrequirementmaster",
        formValue
      );
      if (data?.Status == 1) {
        postDataToServer();
        setIsEditing(false);
        setFormValue(itineraryRequirementInitialValue);
        notifySuccess(data?.message || data?.Message);
        //   alert(data?.Message || data?.message);
      }

      if (data?.Status != 1) {
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

      if (error.response?.data?.Errors) {
        const data = Object.entries(error.response?.data?.Errors);
        notifyError(data[0][1]);
      }
    }
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
        const { data } = await axiosOther.post("", {
          id: id,
        });
        // console.log("response", data);
        if (data?.Status == 1 || data?.status == 1 || data?.result) {
          notifySuccess(data?.Message || data?.message || data?.result);
          postDataToServer();
        }
      } catch (err) {
        if (err) {
          notifyError(err?.message || err?.Message);
        }
      }
    }
  };
  const handleReset = () => {
    setFormValue(itineraryRequirementInitialValue);
    setValidationErrors({});
    setIsEditing(false);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const table_columns = [
    {
      name: "Sr. No.",
      selector: (row, index) => (
        <span className="font-size-11">
          {currentPage * rowsPerPage + index + 1}
        </span>
      ),
      width:"6rem"
    },
    {
      name: "From Destination",
      selector: (row) => row.FromDestination,
      cell: (row) => <span>{row.FromDestination}</span>,
      sortable: true,
    },
    {
      name: "To Destination",
      selector: (row) => row.ToDestination,
      cell: (row) => <span>{row.ToDestination}</span>,
      sortable: true,
      width: "10rem",
      wrap: true,
    },
    {
      name: "Transfer Mode",
      selector: (row) => row.TransferMode,
      cell: (row) => <span>{row.TransferMode}</span>,
      sortable: true,
    },
    {
      name: "Title",
      selector: (row) => row.Title,
      cell: (row) => <span>{row.Title}</span>,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.Description,
      cell: (row) => <span>{row.Description}</span>,
      sortable: true,
    },
    {
      name: "Driving Distance",
      selector: (row) => row.DrivingDistance,
      cell: (row) => <span>{row.DrivingDistance}</span>,
      sortable: true,
    },

    {
      name: "Status",
      selector: (row) => row.Status,
      cell: (row) => {
        return (
          <span
            className={`badge ${row.Status == "Active" ? "bg-success" : "bg-danger"
              }`}
          >
            {row.Status}
          </span>
        );
      },
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => {
        return (
          <div className="d-flex align-items-center gap-1 sweetalert">
            <i
              className="fa-solid fa-pencil cursor-pointer text-success action-icon"
              onClick={() => handleEditClick(row)}
              onChange={scrollToTop()}
            ></i>
            <div className="sweetalert mt-5"></div>
            <i
              className="fa-solid fa-trash-can cursor-pointer text-danger action-icon sweet-confirm"
              onClick={() => handleDelete(row?.id)}
            ></i>
          </div>
        );
      },
    },
  ];
  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">
                {isEditing
                  ? "Update Itenerary Requirement"
                  : "Add Itenerary Requirement"}
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
              <div className="form-validation">
                <ToastContainer />
                <form
                  className="form-valide"
                  action="#"
                  method="post"
                  onSubmit={handleSubmit}
                >
                  <div className="row">
                    <div className="col-12">
                      <div className="row form-row-gap">
                        <div className="col-md-6 col-lg-2">
                          <div className="d-flex justify-content-between">
                            <label className="" htmlFor="name">
                              From Destination
                              <span className="text-danger">*</span>
                            </label>
                          </div>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="val-username"
                            name="FromDestination"
                            placeholder="Enter FromDestination"
                            value={formValue?.FromDestination}
                            onChange={handleInputChange}
                          />
                          {validationErrors?.FromDestination && (
                            <div
                              id="val-username1-error"
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.FromDestination}
                            </div>
                          )}
                        </div>

                        <div className="col-md-6 col-lg-2">
                          <div className="d-flex justify-content-between">
                            <label className="" htmlFor="name">
                              To Destination
                              <span className="text-danger">*</span>
                            </label>
                          </div>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="val-username"
                            name="ToDestination"
                            placeholder="Enter ToDestination"
                            value={formValue?.ToDestination}
                            onChange={handleInputChange}
                          />
                          {validationErrors?.ToDestination && (
                            <div
                              id="val-username1-error"
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.ToDestination}
                            </div>
                          )}
                        </div>

                        <div className="col-md-6 col-lg-2">
                          <div className="d-flex justify-content-between">
                            <label className="" htmlFor="name">
                              Transfer Mode
                              <span className="text-danger">*</span>
                            </label>
                          </div>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="val-username"
                            name="TransferMode"
                            placeholder="Enter TransferMode"
                            value={formValue?.TransferMode}
                            onChange={handleInputChange}
                          />
                          {validationErrors?.TransferMode && (
                            <div
                              id="val-username1-error"
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.TransferMode}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6 col-lg-2">
                          <div className="d-flex justify-content-between">
                            <label className="" htmlFor="name">
                              Title
                              <span className="text-danger">*</span>
                            </label>
                          </div>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="val-username"
                            name="Title"
                            placeholder="Enter Title"
                            value={formValue?.Title}
                            onChange={handleInputChange}
                          />
                          {validationErrors?.Title && (
                            <div
                              id="val-username1-error"
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.Title}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6 col-lg-2">
                          <div className="d-flex justify-content-between">
                            <label className="" htmlFor="name">
                              Description
                              <span className="text-danger">*</span>
                            </label>
                          </div>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="val-username"
                            name="Description"
                            placeholder="Enter Description"
                            value={formValue?.Description}
                            onChange={handleInputChange}
                          />
                          {validationErrors?.Description && (
                            <div
                              id="val-username1-error"
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.Description}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6 col-lg-2">
                          <div className="d-flex justify-content-between">
                            <label className="" htmlFor="name">
                              Driving Distance
                              <span className="text-danger">*</span>
                            </label>
                          </div>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="val-username"
                            name="DrivingDistance"
                            placeholder="Enter DrivingDistance"
                            value={formValue?.DrivingDistance}
                            onChange={handleInputChange}
                          />
                          {validationErrors?.DrivingDistance && (
                            <div
                              id="val-username1-error"
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.DrivingDistance}
                            </div>
                          )}
                        </div>

                        <div className="col-md-6 col-lg-2">
                          <label className="" htmlFor="status">
                            Status
                          </label>
                          <select
                            name="Status"
                            id="status"
                            className="form-control form-control-sm"
                            value={formValue?.Status}
                            onChange={handleInputChange}
                          >
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                          </select>
                        </div>

                        <div className="col-md-6 col-lg-3 d-flex align-items-end">
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
              {/* <Nav.Item as="li" className="nav-item">
                <Nav.Link className="nav-link" eventKey="Pending">
                  Active
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as="li" className="nav-item">
                <Nav.Link className="nav-link" eventKey="Booked">
                  Inactive
                </Nav.Link>
              </Nav.Item> */}
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

export default ItenaryRequirement;
