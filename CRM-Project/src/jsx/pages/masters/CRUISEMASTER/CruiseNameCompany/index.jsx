// @ts-nocheck
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap-daterangepicker/daterangepicker.css";
import { Dropdown, Tab, Nav } from "react-bootstrap";
import { axiosOther } from "../../../../../http/axios_base_url";
import { CruisenamecompanyValidationSchema } from "../../master_validation.js";
import { CruisenamecompanyInitialValue } from "../../masters_initial_value.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
import { notifySuccess, notifyError } from "../../../../../helper/notify.jsx";
import UseTable from "../../../../../helper/UseTable.jsx";
import { scrollToTop } from "../../../../../helper/scrollToTop.js";

const Cruisenamecompany = () => {
  const [selectBtn, setSelectBtn] = useState("Newest");
  const [initialList, setInitialList] = useState([]);
 const [cruisenamemasterlist, setcruisenamemasterlist] = useState([]);
  const [formValue, setFormValue] = useState(CruisenamecompanyInitialValue);
  const [validationErrors, setValidationErrors] = useState({});
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
      const { data } = await axiosOther.post("cruisenamemasterlist");
      setInitialList(data?.DataList);
      setFilterValue(data?.DataList);
    } catch (error) {
      console.log("cruisenamemaster-error", error);
    }
  };

  useEffect(() => {
    getListDataToServer();
  }, []);

  useEffect(() => {
    const filteredList = initialList?.filter(
      (data) =>
        data?.CruiseCompany?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
        data?.CruiseName?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
        data?.Status?.toLowerCase()?.includes(filterInput?.toLowerCase())
    );
    setFilterValue(filteredList);
  }, [filterInput]);

  const table_columns = [
    {
      name: "Image",
      selector: (row) => row?.ImageName,
      cell: (row, index) => (
        <img
          src={row?.ImageName}
          alt={row?.ImageData}
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = fallback;
          }}
          style={{ height: "30px", width: "30px" }}
        ></img>
      ),
      sortable: true,
    },
    {
      name: "Cruise Company",
      selector: (row) => row?.CruiseCompany,
      cell: (row) => <span>{row?.CruiseCompany}</span>,
      sortable: true,
    },
    {
      name: "Cruise Name",
      selector: (row) => row?.CruiseName,
      cell: (row) => <span>{row?.CruiseName}</span>,
      sortable: true,
      width: "16rem",
    },
    {
      name: "Added By",
      selector: (row) => row?.AddedBy,
      cell: (row) => <span>{row?.AddedBy}</span>,
      sortable: true,
      width: "16rem",
    },
    {
      name: "Updated By",
      selector: (row) => row?.UpdatedBy,
      cell: (row) => <span>{row?.UpdatedBy}</span>,
      sortable: true,
      width: "12rem",
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
      width: "10rem",
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
      await CruisenamecompanyValidationSchema.validate(formValue, {
        abortEarly: false,
      });
      setValidationErrors({});
      const { data } = await axiosOther.post("addupdatecruisenamemaster", formValue);
      if (data?.Status === 1) {
        getListDataToServer();
        setIsEditing(false);
        setFormValue(CruisenamecompanyInitialValue);
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
      CruiseCompany: value?.CruiseCompany,
      CruiseName: value?.CruiseName,
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
        const { data } = await axiosOther.post("delatecruisenamemaster", { id });
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
    setFormValue(CruisenamecompanyInitialValue);
    setValidationErrors({});
    setIsEditing(false);
  };
    const getDropdownDataToServer = async () => {
      try {
        const { data } = await axiosOther.post("cruisenamemasterlist", {
          Search: "",
          Status: 1,
        });
        setcruisenamemasterlist(data.DataList);
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
                {isEditing ? "Update Cruise Company " : "Add Cruise Company"}
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
                          <label htmlFor="CruiseCompany">
                          Cruise Name Comapany
                          </label>
                          <select
                            name="CruiseCompany"
                            placeholder="Enter Cruise Company"
                            className={`form-control form-control-sm ${validationErrors?.CruiseCompany ? "is-invalid" : ""
                            }`}
                            value={formValue?.CruiseCompany}
                            onChange={handleFormChange}
                          >
                            <option value="">select</option>
                            {cruisenamemasterlist?.map((cruisenamemaster) => {
                              return (
                                <option value={cruisenamemaster.id} key={cruisenamemaster.id}>
                                  {cruisenamemaster.CruiseCompany}
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
                          <label htmlFor="shortName">
                          Cruise Name
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className={`form-control form-control-sm ${validationErrors?.CruiseName ? "is-invalid" : ""
                              }`}
                            name="CruiseName"
                            placeholder="Enter a CruiseName "
                            value={formValue?.CruiseName}
                            onChange={handleFormChange}
                          />
                          {validationErrors?.CruiseName && (
                            <div
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.CruiseName}
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
                          <label htmlFor="ImageName">
                          Cruise Image
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="file"
                            className={`form-control form-control-sm ${validationErrors?.ImageName ? "is-invalid" : ""
                              }`}
                            name="ImageName"
                            placeholder="Enter a Country Code"
                            value={formValue?.ImageName}
                            onChange={handleFormChange}
                          />
                          {validationErrors?.ImageName && (
                            <div
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.ImageName}
                            </div>
                          )}
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

export default Cruisenamecompany;
