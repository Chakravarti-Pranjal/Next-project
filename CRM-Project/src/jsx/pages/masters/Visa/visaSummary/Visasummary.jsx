import React, { useState, useEffect } from "react";
import { Dropdown, Tab, Nav } from "react-bootstrap";
import { axiosOther } from "../../../../../http/axios_base_url.js";
import { useNavigate } from "react-router-dom";
import { VisasummaryeValidationSchema } from "../../master_validation.js";
import { VisasummaryInitialValue } from "../../masters_initial_value.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
import { notifySuccess, notifyError } from "../../../../../helper/notify.jsx";
import UseTable from "../../../../../helper/UseTable.jsx";
import { scrollToTop } from "../../../../../helper/scrollToTop.js";

const Visasummary = () => {
  const [selectBtn, setSelectBtn] = useState("Newest");
  const [initialList, setInitialList] = useState([]);
  const [formValue, setFormValue] = useState(VisasummaryInitialValue);
  const [validationErrors, setValidationErrors] = useState({});
  const [filterValue, setFilterValue] = useState([]);
  const [filterInput, setFilterInput] = useState("");
  const [countryList, setCountryList] = useState([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isUpdating, setIsUpdating] = useState(false);

  const handlePageChange = (page) => setCurrentPage(page - 1);
  const handleRowsPerPageChange = (newRowsPerPage) =>
    setRowsPerPage(newRowsPerPage);

  const getListDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("visa-summary-list");
      setInitialList(data?.Data);
      setFilterValue(data?.Data);
    } catch (error) {
      console.log("visa-summary-error", error);
    }
  };

  const getDataToServer = async () => {
    try {
      const countryData = await axiosOther.post("countrylist", {
        Search: "",
        Status: 1,
      });
      setCountryList(countryData.data.DataList);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getDataToServer();
  }, []);

  useEffect(() => {
    getListDataToServer();
  }, []);
  useEffect(() => {
    setIsUpdating(!!formValue.Id); // True if Id exists, false if empty
  }, [formValue.Id]);

  useEffect(() => {
    const filteredList = initialList?.filter(
      (data) =>
        data?.Country?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
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
      width: "6rem",
      // style: {
      //   display: "flex",
      //   justifyContent: "center",
      // },
    },
    {
      name: "Country",
      selector: (row) => row?.CountryName,
      cell: (row) => <span>{row?.CountryName}</span>,
      sortable: true,
      width: "7rem",
    },

    {
      name: "Description",
      selector: (row) => row?.Description,
      cell: (row) => <span>{row?.Description}</span>,
      sortable: true,
      //width: "20rem",
      wrap: true,
    },
    // {
    //   name: "Status",
    //   selector: (row) => row?.Status,
    //   cell: (row) => (
    //     <span
    //       className={`badge ${row.Status === "Active"
    //           ? "badge-success light badge"
    //           : "badge-danger light badge"
    //         }`}
    //     >
    //       {row.Status}
    //     </span>
    //   ),
    //   sortable: true,
    //   width: "6rem",
    // },
    {
      name: "Action",
      selector: (row) => (
        <div className="d-flex align-items-center gap-1">
          <i
            className="fa-solid fa-pencil cursor-pointer text-success action-icon"
            onClick={() => handleEdit(row)}
            onChange={scrollToTop()}
          ></i>
          <i
            className="fa-solid fa-trash-can cursor-pointer text-danger action-icon"
            onClick={() => handleDelete(row?.Id)}
          ></i>
        </div>
      ),
      width: "6rem",
    },
  ];
  const handleReset = () => {
    setFormValue(VisasummaryInitialValue);
    setValidationErrors({});
    setIsEditing(false);
  };
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // console.log(formValue, "formValue");
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate form data
      await VisasummaryeValidationSchema.validate(formValue, {
        abortEarly: false,
      });
      setValidationErrors({});

      // Update operation
      const endpoint = isUpdating
        ? "visa-summary-update"
        : "visa-summary-store";
      const { data } = await axiosOther.post(endpoint, formValue);

      if (data?.Status === 1) {
        getListDataToServer();
        setFormValue(VisasummaryInitialValue);
        notifySuccess(data?.message || "Update successful");
        return; // Exit after successful update if that's the intent
      }
    } catch (error) {
      if (error.inner) {
        const validationErrors = error.inner.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {});
        setValidationErrors(validationErrors);
      } else if (error.response?.data?.Errors) {
        const [_, errorMessage] = Object.entries(error.response.data.Errors)[0];
        notifyError(errorMessage);
      } else {
        notifyError("An unexpected error occurred");
      }
    }
  };

  const handleEdit = (value) => {
    // console.log(value, "value");

    setFormValue({
      Id: value?.Id,
      Country: value?.CountryId,
      Description: value?.Description,
      Status: value?.Status === "Active" ? "1" : "0",
    });
  };

  const handleDelete = async (Id) => {
    // console.log("Deletingss ID:", Id);
    const confirmation = await swal({
      title: "Are you sure want to Delete?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });

    if (confirmation) {
      try {
        // console.log("Delet ID:", Id); // Debug the ID
        const { data } = await axiosOther.post("visa-summary-delete", { Id });
        // console.log("Server response:", data); // Debug the response
        if (data?.Status === 1) {
          notifySuccess(data?.Message || data?.message);
          getListDataToServer();
        } else {
          notifyError(data?.Message || "Deletion failed");
        }
      } catch (err) {
        console.error("Error:", err.response?.data || err);
        notifyError(
          err.response?.data?.Message || err.message || "An error occurred"
        );
      }
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Add Visa Type</h4>
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
                          <div className="d-flex justify-content-between">
                            <label htmlFor="Country">
                              Country
                              <span className="text-danger">*</span>
                            </label>
                          </div>
                          <select
                            name="Country"
                            id=""
                            className="form-control form-control-sm"
                            value={formValue?.Country}
                            onChange={handleFormChange}
                          >
                            <option value="">Select</option>
                            {countryList?.map((value, index) => {
                              return (
                                <option value={value.id} key={index + 1}>
                                  {value.Name}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                        <div className="col-md-6 col-lg-6">
                          <div className="d-flex justify-content-between">
                            <label htmlFor="name">
                              Description
                              <span className="text-danger">*</span>
                            </label>
                          </div>
                          <textarea
                            type="text"
                            className="form-control form-control-sm"
                            name="Description"
                            placeholder="Enter Description"
                            value={formValue?.Description}
                            onChange={handleFormChange}
                          ></textarea>
                          {validationErrors?.Description && (
                            <div
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.Description}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6 col-lg-3 d-flex align-items-end">
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
            <Nav as="ul" className=" nav nav-tabs">
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
                  onChange={(e) => setFilterInput(e.target.value)}
                />
                <span className="input-group-text border">
                  <i className="flaticon-381-search-2 cursor-pointer"></i>
                </span>
              </div>
            </div>
          </div>
          <div className="d-flex align-items-center mb-2 flex-wrap">
            <div className="newest ms-3"></div>
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

export default Visasummary;
