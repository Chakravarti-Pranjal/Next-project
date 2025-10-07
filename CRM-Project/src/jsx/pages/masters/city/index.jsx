import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap-daterangepicker/daterangepicker.css";
import { Tab, Nav } from "react-bootstrap";
import { axiosOther } from "../../../../http/axios_base_url";
import { cityValidationSchema } from "../master_validation.js";
import { cityInitialValue } from "../masters_initial_value.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
import { notifySuccess, notifyError } from "../../../../helper/notify.jsx";
import { scrollToTop } from "../../../../helper/scrollToTop.js";
import { MdNavigateNext } from "react-icons/md";
import { MdOutlineSkipNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import { MdOutlineSkipPrevious } from "react-icons/md";
import DataTable from "react-data-table-component";
import { table_custom_style } from "../../../../css/custom_style.js";
import { ThemeContext } from "styled-components";

const City = () => {
  // const { background } = useContext(ThemeContext);
  const [initialList, setInitialList] = useState([]);
  const [formValue, setFormValue] = useState(cityInitialValue);
  const [validationErrors, setValidationErrors] = useState({});
  const [filterValue, setFilterValue] = useState([]);
  const [filterInput, setFiterInput] = useState("");
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPage, setTotalPage] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [cityname, setCityName] = useState("");
  const [selectedStateId, setSelectedStateId] = useState("");
  const [filterState, setFilterState] = useState([]);



  const navigate = useNavigate();
  const getListDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("citylist", {
        countryId: selectedCountry,
        stateId: selectedStateId,
        Page: currentPage,
        PerPage: rowsPerPage,
        Search: cityname
      });
      setTotalPage(data?.TotalPages);
      setInitialList(data?.DataList);
      setFilterValue(data?.DataList);
    } catch (error) {
      console.log("city-error", error);
    }
  };

  useEffect(() => {
    getListDataToServer();
  }, [rowsPerPage, currentPage]);

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



  const getStateDataToServer = async () => {
    if (!formValue?.CountryId) return
    try {
      const stateData = await axiosOther.post("listStateByCountry", {
        Search: "",
        Status: 1,
        countryid: formValue?.CountryId,
      });
      // console.log("try code ")
      setStateList(stateData.data.DataList);
    } catch (err) {
      console.log(err);
      // console.log("cath code ")
    }
  };

  const getFilterStateDataToServer = async () => {
    try {
      const stateData = await axiosOther.post("statelist", {
        Search: "",
        // Page: currentPage,
        // PerPage: rowsPerPage,
      });
      setFilterState(stateData.data.DataList);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getStateDataToServer();
  }, [formValue?.CountryId]);
  useEffect(() => {
    getFilterStateDataToServer();
  }, [selectedCountry]);
  useEffect(() => {
    const filteredList = initialList?.filter(
      (data) =>
        data?.Name?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
        data?.CountryName?.toLowerCase()?.includes(
          filterInput?.toLowerCase()
        ) ||
        data?.StateName?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
        data?.Status?.toLowerCase()?.includes(filterInput?.toLowerCase())
    );
    setFilterValue(filteredList);
  }, [filterInput]);
  const table_columns = [
    {
      name: "Country Name",
      selector: (row) => row?.CountryName,
      cell: (row) => <span>{row?.CountryName}</span>,
      sortable: true,
    },
    {
      name: "State Name",
      selector: (row) => row?.StateName,
      cell: (row) => <span>{row?.StateName}</span>,
      sortable: true,
    },
    {
      name: "City Name",
      selector: (row) => row?.Name,
      cell: (row) => (
        <span>
          {row?.Name}{" "}
          {row.SetDefault == "Yes" && (
            <i className="mdi mdi-check-circle-outline text-success fs-4"></i>
          )}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.Status,
      cell: (row) => {
        return (
          <span
            className={`badge ${row.Status == "Active"
              ? "badge-success light badge "
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
  // handlign form changes
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
      await cityValidationSchema.validate(formValue, {
        abortEarly: false,
      });
      setValidationErrors({});
      //  console.log(formValue);
      const { data } = await axiosOther.post("addupdatecity", formValue);
      if (data?.Status == 1) {
        getListDataToServer();
        setIsEditing(false);
        setFormValue(cityInitialValue);
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
  const handleEdit = (value) => {
    setFormValue({
      id: value?.id,
      Name: value?.Name,
      CountryId: value?.CountryId,
      StateId: value?.StateId,
      Status: value?.Status == "Active" ? 1 : 0,
      AddedBy: value?.AddedBy,
      UpdatedBy: value?.UpdatedBy,
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
        const { data } = await axiosOther.post("deletecity", {
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
  const handleReset = () => {
    setFormValue(cityInitialValue);
    setValidationErrors({});
    setIsEditing(false);
  };
  // handlign form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
  };
  const handlefilter = async (e) => {
    try {
      const { data } = await axiosOther.post("citylist", {
        Page: currentPage,
        PerPage: rowsPerPage,
        countryId: selectedCountry,
        stateId: selectedStateId,
        Search: cityname
      });
      setInitialList(data?.DataList);
      setFilterValue(data?.DataList);
      setTotalPage(data?.TotalPages);
    } catch (error) {
      console.log("Error fetching destination or hotel list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (column, direction) => {
    // Perform sorting manually or adjust your filterValue based on the sort direction
    const sortedData = [...filterValue].sort((a, b) => {
      const valueA = column.selector(a);
      const valueB = column.selector(b);
      if (direction === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

    // Update your data with sorted results (assuming you manage the sorted data in state)
    setFilterValue(sortedData);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
  };

  const CustomPagination = () => {
    return (
      <div className="custom-pagination d-flex gap-3 py-2 justify-content-end align-items-center mb-5 shadow border-bottom">
        <div className="d-flex gap-3 align-items-center">
          <label htmlFor="" className="fs-6">
            Rows per page
          </label>
          <select
            name="PerPage"
            id=""
            className="pagination-select"
            value={rowsPerPage}
            onChange={(e) => {
              handleRowsPerPageChange(e.target.value);
            }}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="40">40</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          <MdOutlineSkipPrevious />
        </button>
        <button
          onClick={() =>
            handlePageChange(currentPage > 1 ? currentPage - 1 : 1)
          }
          disabled={currentPage === 1}
          className="pagination-button"
        >
          <GrFormPrevious />
        </button>
        <span className="text-light">
          {currentPage} of {totalPage}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage == totalPage}
          className="pagination-button"
        >
          <MdNavigateNext />
        </button>
        <button
          onClick={() => handlePageChange(totalPage)}
          disabled={currentPage == totalPage}
          className="pagination-button"
        >
          <MdOutlineSkipNext />
        </button>
      </div>
    );
  };

  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">
                {isEditing ? "Update City Name" : "Add City"}
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
                          <label className="m-0">Country</label>
                          <select
                            name="CountryId"
                            id=""
                            className="form-control form-control-sm"
                            value={formValue?.CountryId}
                            onChange={handleInputChange}
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
                          {validationErrors?.CountryId && (
                            <div
                              id="val-username1-error"
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.CountryId}
                            </div>
                          )}
                        </div>

                        <div className="col-md-6 col-lg-2">
                          <label className="m-0">State</label>
                          <select
                            name="StateId"
                            id=""
                            className="form-control form-control-sm"
                            value={formValue?.StateId}
                            onChange={handleInputChange}
                          >
                            <option value="">Select</option>
                            {stateList?.map((value, index) => {
                              return (
                                <option value={value.id} key={index + 1}>
                                  {value.Name}
                                </option>
                              );
                            })}
                          </select>
                          {validationErrors?.StateId && (
                            <div
                              id="val-username1-error"
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.StateId}
                            </div>
                          )}
                        </div>

                        <div className="col-md-6 col-lg-2">
                          <div>
                            <label className="" htmlFor="name">
                              City Name
                              <span className="text-danger">*</span>
                            </label>
                          </div>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="val-username"
                            name="Name"
                            placeholder="Enter a Name"
                            value={formValue?.Name}
                            onChange={handleFormChange}
                          />
                          {validationErrors?.Name && (
                            <div
                              id="val-username1-error"
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.Name}
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
                            onChange={handleFormChange}
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
        <div className="d-flex justify-content-between align-items-center flex-wrap mb-lg-2">
          <div className="card-action coin-tabs mb-2">
            <Nav as="ul" className="nav nav-tabs">
              <Nav.Item as="li" className="nav-item">
                <Nav.Link className="nav-link" eventKey="All">
                  All List
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </div>

          {/* <div className="col-md-4">
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
          </div> */}

          {/* filter */}
          <div className="d-flex justify-content-center align-items-end gap-3">
            <div className="col-md-6 col-lg-3 mb-2 mb-lg-0">
              <label className="m-0">Country</label>
              <select
                name="CountryId"
                className="form-control form-control-sm"
                value={selectedCountry}
                onChange={handleCountryChange}
              >
                <option value="">All</option>
                {countryList?.map((value, index) => {
                  return (
                    <option value={value.id} key={index + 1}>
                      {value.Name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="col-md-6 col-lg-3">
              <label className="m-0">City Name</label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Search.."
                onChange={(e) => setCityName(e.target.value)}
              />
            </div>
            <div className="col-md-6 col-lg-3">
              <label className="m-0">State</label>
              <select
                name="StateId"
                className="form-control form-control-sm"
                value={selectedStateId}
                onChange={(e) => setSelectedStateId(e.target.value)}
              >
                <option value="">All</option>
                {filterState?.map((value, index) => (
                  <option value={value.id} key={index}>
                    {value.Name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-1 d-flex justify-content-start align-items-center">
              <div className="nav-item d-flex align-items-center">
                <button
                  className="btn btn-primary btn-custom-size flex-shrink-0"
                  onClick={handlefilter}
                >
                  <i className="fa-brands fa-searchengin me-2"></i>Search
                </button>
              </div>
            </div>
          </div>
          <div className="d-flex align-items-center mb-2 flex-wrap"></div>
        </div>
        <div className="table-responsive">
          <div id="example2_wrapper" className="dataTables_wrapper no-footer">
            <DataTable
              columns={table_columns}
              data={filterValue}
              sortIcon={<i className="fa-solid fa-sort fs-4"></i>}
              striped
              paginationServer
              highlightOnHover
              customStyles={table_custom_style}
              defaultSortFieldId={1}
              paginationTotalRows={4}
              defaultSortAsc={true}
              className="custom-scrollbar"
            />
            <CustomPagination />
          </div>
        </div>
      </Tab.Container >
    </>
  );
};
export default City;
