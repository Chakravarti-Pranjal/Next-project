import React, { useState, useEffect } from "react";
import "bootstrap-daterangepicker/daterangepicker.css";
import { Dropdown, Tab, Nav } from "react-bootstrap";
import { axiosOther } from "../../../../http/axios_base_url";
import { useNavigate } from "react-router-dom";
import { weekendValidationSchema } from "../master_validation.js";
import { weekendInitialValue } from "../masters_initial_value.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
import { notifySuccess, notifyError } from "../../../../helper/notify.jsx";
import UseTable from "../../../../helper/UseTable.jsx";
import { scrollToTop } from "../../../../helper/scrollToTop.js";

const weekendDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const Weekend = () => {
  const [selectBtn, setSelectBtn] = useState("Newest");
  const [initialList, setInitialList] = useState([]);
  const [formValue, setFormValue] = useState(weekendInitialValue);
  const [validationErrors, setValidationErrors] = useState({});
  const [weekendDaysValue, setWeekendDaysValue] = useState([]);
  const [filterValue, setFilterValue] = useState([]);
  const [filterInput, setFilterInput] = useState("");
  const [currentPage, setCurrentPage] = useState(0); // Page index
  const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page
  const navigate = useNavigate();

  const data = [];
  const totalRows = 10;
  const handlePageChange = (page) => setCurrentPage(page - 1);
  const handleRowsPerPageChange = (newRowsPerPage) =>
    setRowsPerPage(newRowsPerPage);

  const getListDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("weekendlist");
      setInitialList(data?.DataList);
      setFilterValue(data?.DataList);
    } catch (error) {
      console.log("weekend-error", error);
    }
  };

  useEffect(() => {
    getListDataToServer();
  }, []);

  useEffect(() => {
    const filteredList = initialList?.filter(
      (data) =>
        data?.Name?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
        data?.Status?.toLowerCase()?.includes(filterInput?.toLowerCase())
    );
    setFilterValue(filteredList);
  }, [filterInput, initialList]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleWeekendDaysValue = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setWeekendDaysValue([...weekendDaysValue, value]);
    } else {
      const filteredDays = weekendDaysValue.filter((day) => day !== value);
      setWeekendDaysValue(filteredDays);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await weekendValidationSchema.validate(
        { ...formValue, WeekendDays: weekendDaysValue },
        { abortEarly: false }
      );
      setValidationErrors({});
      const { data } = await axiosOther.post("addupdateweekend", {
        ...formValue,
        WeekendDays: weekendDaysValue,
      });
      if (data?.Status === 1) {
        getListDataToServer();
        setFormValue(weekendInitialValue);
        setWeekendDaysValue([]);
        notifySuccess(data?.Message || data?.message);
      }
    } catch (error) {
      if (error.inner) {
        const validationErrors = error.inner.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {});
        setValidationErrors(validationErrors);
      }
      if (error.response?.data?.Errors) {
        notifyError(error.response.data.Errors[0]);
      }
    }
  };

  const handleEdit = (value) => {
    setFormValue({
      id: value?.id,
      Name: value?.Name,
      WeekendDays: value?.WeekendDays,
      Status: value?.Status,
      AddedBy: value?.AddedBy,
      UpdatedBy: value?.UpdatedBy,
    });
    setWeekendDaysValue(value?.WeekendDays || []);
  };

  const handleDelete = async (id) => {
    const confirmation = await swal({
      title: "Are you sure you want to delete?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });

    if (confirmation) {
      try {
        const { data } = await axiosOther.post("deleteweekend", { id });
        if (data?.Status === 1) {
          notifySuccess(data?.Message || data?.message);
          getListDataToServer();
        }
      } catch (err) {
        notifyError(err?.message || err?.Message);
      }
    }
  };

  const table_columns = [
    {
      name: "Sr. No.",
      selector: (row, index) => (
        <span className="font-size-11">{index + 1}</span>
      ),
      sortable: false,
      width: "16rem",
    },
    {
      name: "Name",
      selector: (row) => row?.Name,
      cell: (row) => <span>{row?.Name}</span>,
      sortable: true,
      minWidth: "15rem",
    },
    {
      name: "Weekend Days",
      selector: (row) => row?.WeekendDays,
      cell: (row) => <span>{row?.WeekendDays}</span>,
      sortable: true,
      minWidth: "13rem",
    },
    {
      name: "Status",
      selector: (row) => row?.Status,
      cell: (row) => (
        <span
          className={`badge ${
            row.Status === "Active"
              ? "badge-success light badge"
              : "badge-danger light badge"
          }`}
        >
          {row.Status}
        </span>
      ),
      sortable: true,
      width: "10rem",
    },
    {
      name: "Action",
      selector: (row) => (
        <div className="d-flex gap-1 sweetalert">
          <i
            className="fa-solid fa-pencil cursor-pointer text-success action-icon"
            onClick={() => handleEdit(row)}
            onChange={scrollToTop()}
          ></i>
          <div className="sweetalert mt-5"></div>
          <i
            className="fa-solid fa-trash-can cursor-pointer text-danger action-icon sweet-confirm"
            onClick={() => handleDelete(row?.id)}
          ></i>
        </div>
      ),
    },
  ];
  const handleReset = () => {
    setFormValue(weekendInitialValue);
    setValidationErrors({});
    setIsEditing(false);
  };
  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Add Weekend</h4>
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
                <form className="form-valide" onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-12">
                      <div className="row form-row-gap">
                        <div className="col-md-6 col-lg-3">
                          <label className="m-0">Weekend Name</label>
                          <input
                            type="text"
                            className="form-control form-control-sm "
                            name="Name"
                            placeholder="Enter Weekend Name"
                            value={formValue?.Name}
                            onChange={handleFormChange}
                          />
                          {validationErrors?.Name && (
                            <div className="invalid-feedback animated fadeInUp">
                              {validationErrors?.Name}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6 col-lg-3">
                          <label className="m-0">Status</label>
                          <select
                            name="Status"
                            className="form-control form-control-sm"
                            value={formValue?.Status}
                            onChange={handleFormChange}
                          >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        </div>
                        <div className="col-md-6 col-lg-4 d-flex flex-column gap-2">
                          <label className="m-0">Weekend Days</label>
                          <div className="d-flex gap-3">
                            {weekendDays.map((day, index) => (
                              <div className="d-flex gap-1" key={index}>
                                <label htmlFor={day} className="m-0">
                                  {day.slice(0, 3)}
                                </label>
                                <input
                                  type="checkbox"
                                  name={day}
                                  value={day}
                                  checked={weekendDaysValue.includes(day)}
                                  onChange={handleWeekendDaysValue}
                                  id={day}
                                  className="form-check-input height-em-1 width-em-1 me-1"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="col-md-6 col-lg-2 d-flex align-items-end">
                          <button
                            type="submit"
                            className="btn btn-primary btn-custom-size"
                          >
                            Submit
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
          <div className="col-md-8">
            <div className="nav-item d-flex align-items-center">
              <div className="input-group search-area">
                <input
                  type="text"
                  className="form-control border"
                  placeholder="Search.."
                  onChange={(e) => setFilterInput(e.target.value)}
                />
                <span className="input-group-text border">
                  <i className="flaticon-381-search-2 cursor-pointer"></i>
                </span>
              </div>
            </div>
          </div>
          {/* <div className="d-flex align-items-center mb-2 flex-wrap">
            <div className="newest ms-3">
              <Dropdown>
                <Dropdown.Toggle
                  as="div"
                  className="btn-select-drop default-select btn i-false"
                >
                  {selectBtn} <i className="fas fa-angle-down ms-2"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => setSelectBtn("Oldest")}
                    eventKey="All"
                  >
                    Oldest
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => setSelectBtn("Newest")}
                    eventKey="All"
                  >
                    Newest
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div> */}
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

export default Weekend;
