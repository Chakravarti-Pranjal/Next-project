import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
import { Dropdown, Tab, Nav } from "react-bootstrap";
import { axiosOther } from "../../../../http/axios_base_url";
import { useTable, useSortBy } from "react-table";
import { passportCostValidationSchema } from "../master_validation.js";
import DataTable from "react-data-table-component";
import { table_custom_style } from "../../../../css/custom_style";
import { passportCostInitialValue } from "../masters_initial_value.js";
import { NavLink } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa"; // Example using react-icons
import swal from "sweetalert";
import { notifySuccess, notifyError } from "../../../../helper/notify.jsx";
import UseTable from "../../../../helper/UseTable.jsx";
import { scrollToTop } from "../../../../helper/scrollToTop.js";
// deleteamenities

const InsuranceType = () => {
  const [selectBtn, setSelectBtn] = useState("Newest");
  const [initialList, setInitialList] = useState([]);
  const [formValue, setFormValue] = useState(passportCostInitialValue);
  const [validationErrors, setValidationErrors] = useState({});
  const [filterValue, setFilterValue] = useState([]);
  const [filterInput, setFiterInput] = useState("");
  const [passportType, setPassportType] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // Page index
  const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page
  const navigate = useNavigate()
  const handlePageChange = (page) => setCurrentPage(page - 1);
  const handleRowsPerPageChange = (newRowsPerPage) =>
    setRowsPerPage(newRowsPerPage);
  const data = []; // Replace with your data
  const totalRows = 10; // Replace with your total rows count

  const getListDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("passport-cost-master-list");
      setInitialList(data?.DataList);
      setFilterValue(data?.DataList);
    } catch (error) {
      console.log("country-error", error);
    }
  };

  useEffect(() => {
    getListDataToServer();
  }, []);

  const getDataForDropdown = async () => {
    try {
      const { data } = await axiosOther.post("passport-type-master-list");
      setPassportType(data?.DataList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDataForDropdown();
  }, []);

  useEffect(() => {
    const filteredList = initialList?.filter(
      (data) =>
        data?.PassportTypeName?.toLowerCase()?.includes(
          filterInput?.toLowerCase()
        ) ||
        data?.PassportName?.toLowerCase()?.includes(
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
    },
    {
      name: "Passport Type",
      selector: (row) => row?.PassportTypeName,
      cell: (row) => <span>{row?.PassportTypeName} </span>,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row?.PassportName,
      cell: (row) => <span>{row?.PassportName} </span>,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row?.Status,
      cell: (row) => {
        return (
          <span
            className={`badge ${row.Status == "Active"
              ? "badge-success light badge"
              : "badge-danger light badge"
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
              onClick={() => handleEdit(row)}
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
  const handleReset = () => {
    setFormValue(passportCostInitialValue);
    setValidationErrors({});
    setIsEditing(false);
  };

  // handlign form changes
  const handleFormChange = (e) => {
    const { name, value, files, type } = e.target;

    if (type == "file") {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result;
        const base64String = base64.split(",")[1];
        setFormValue({
          ...formValue,
          ImageData: base64String,
          ImageName: file.name,
        });
      };
      reader.readAsDataURL(file);
    } else {
      setFormValue((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await passportCostValidationSchema.validate(formValue, {
        abortEarly: false,
      });
      setValidationErrors({});
      // console.log(formValue);
      const { data } = await axiosOther.post(
        "addupdate-possport-cost-master",
        formValue
      );
      if (data?.Status == 1) {
        getListDataToServer();
        setFormValue(passportCostInitialValue);
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
  const credential = localStorage.getItem("token");
  const authData = JSON.parse(credential);

  const handleEdit = (value) => {
    setFormValue({
      id: value?.id,
      PassportName: value?.PassportName,
      PassportType: value?.PassportType,
      Status: value?.Status,
      AddedBy: value?.AddedBy,
      UpdatedBy: authData?.UserID != null ? authData?.UserID?.toString() : "0",
    });
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
        const { data } = await axiosOther.post("delete-passport-cost", {
          id: id,
        });
        if (data?.Status == 1 || data?.status == 1 || data?.result) {
          notifySuccess(data?.Message || data?.message || data?.result);
          getListDataToServer();
        }
      } catch (err) {
        if (err) {
          notifyError(err?.message || err?.Message);
          //   alert(err?.message || err?.Message);
        }
      }
    }
  };
  // handlign form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Add Passport Type</h4>
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
                        <div className="col-md-6 col-lg-3">
                          <label className="" htmlFor="status">
                            Passport Type <span className="text-danger">*</span>
                          </label>
                          <select
                            name="PassportType"
                            id="status"
                            className="form-control form-control-sm"
                            value={formValue?.PassportType}
                            onChange={handleFormChange}
                          >
                            <option value="">Select</option>
                            {passportType?.map((value, index) => {
                              return (
                                <option value={value.id} key={index + 1}>
                                  {value.PassportType}
                                </option>
                              );
                            })}
                          </select>
                          {validationErrors?.PassportType && (
                            <div
                              id="val-username1-error"
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.PassportType}
                            </div>
                          )}
                        </div>

                        <div className="col-md-6 col-lg-3">
                          <label className="" htmlFor="name">
                            Name
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="val-username"
                            name="PassportName"
                            placeholder="Enter a Name"
                            value={formValue?.PassportName}
                            onChange={handleFormChange}
                          />
                          {validationErrors?.PassportName && (
                            <div
                              id="val-username1-error"
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.PassportName}
                            </div>
                          )}
                        </div>

                        <div className="col-md-6 col-lg-3">
                          <label className="" htmlFor="status">
                            Status
                          </label>
                          <select
                            name="Status"
                            id="status"
                            className="form-control form-control-sm"
                            value={formValue?.Status}
                            onChange={handleFormChange}
                          >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        </div>

                        <div className="col-md-6 col-lg-3 d-flex align-items-end">
                          <button type="submit" className="btn btn-primary btn-custom-size">
                            Submit
                          </button>
                          <button type="button" className="btn btn-dark btn-custom-size ms-2" onClick={handleReset}>Reset</button>
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
          <div className="d-flex align-items-center mb-2 flex-wrap">
            <div className="guest-calendar">
              {/* <DateRangePicker
                initialSettings={{
                  startDate: start.toDate(),
                  endDate: end.toDate(),
                  ranges: {
                    Today: [moment().toDate(), moment().toDate()],
                    Yesterday: [
                      moment().subtract(1, "days").toDate(),
                      moment().subtract(1, "days").toDate(),
                    ],
                    "Last 7 Days": [
                      moment().subtract(6, "days").toDate(),
                      moment().toDate(),
                    ],
                    "Last 30 Days": [
                      moment().subtract(29, "days").toDate(),
                      moment().toDate(),
                    ],
                    "This Month": [
                      moment().startOf("month").toDate(),
                      moment().endOf("month").toDate(),
                    ],
                    "Last Month": [
                      moment().subtract(1, "month").startOf("month").toDate(),
                      moment().subtract(1, "month").endOf("month").toDate(),
                    ],
                  },
                }}
                onCallback={handleCallback}
              >
                <div
                  id="reportrange"
                  className="pull-right reportrange"
                  style={{
                    width: "100%",
                  }}
                >
                  <span>{label}</span>{" "}
                  <i className="fas fa-chevron-down ms-3"></i>
                </div>
              </DateRangePicker> */}
            </div>
            <div className="newest ms-3">

            </div>
          </div>
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
export default InsuranceType;
