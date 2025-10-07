import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dropdown, Tab, Nav } from "react-bootstrap";
import { axiosOther } from "../../../../../http/axios_base_url";
import { visaCostInitialValue } from "../../masters_initial_value.js";
import { visaCostValidationSchema } from "../../master_validation.js";
import { ToastContainer } from "react-toastify";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa"; // Example using react-icons
import swal from "sweetalert";
import { notifySuccess, notifyError } from "../../../../../helper/notify.jsx";
import { scrollToTop } from "../../../../../helper/scrollToTop.js";
import UseTable from "../../../../../helper/UseTable.jsx";

const VisaCost = () => {
  const [selectBtn, setSelectBtn] = useState("Newest");
  const [initialList, setInitialList] = useState([]);
  const [formValue, setFormValue] = useState(visaCostInitialValue);
  const [validationErrors, setValidationErrors] = useState({});
  const [filterValue, setFilterValue] = useState([]);
  const [filterInput, setFiterInput] = useState("");
  const [countryList, setCountryList] = useState([]);
  const [visaList, setVisaList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0); // Page index
  const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page

  const navigate = useNavigate();
  const handlePageChange = (page) => setCurrentPage(page - 1);
  const handleRowsPerPageChange = (newRowsPerPage) => setRowsPerPage(newRowsPerPage);
  const getListDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("visacostmasterlist");
      setInitialList(data?.DataList);
      setFilterValue(data?.DataList);
    } catch (error) {
      console.log("city-error", error);
    }
  };

  useEffect(() => {
    getListDataToServer();
  }, []);

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

  const getVisaToServer = async () => {
    try {
      const VisaType = await axiosOther.post("visatypemasterlist", {
        Search: "",
        Status: 1,
      });
      setVisaList(VisaType.data.DataList);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getVisaToServer();
  }, []);

  useEffect(() => {
    getDataToServer();
  }, []);

  useEffect(() => {
    const filteredList = initialList?.filter(
      (data) =>
        data?.Name?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
        data?.CountryName?.toLowerCase()?.includes(
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
      name: "Country Name",
      selector: (row) => row?.CountryName,
      cell: (row) => <span>{row?.CountryName}</span>,
      sortable: true,
    },

    {
      name: "Visa Type",
      selector: (row) => row?.VisaTypeName,
      cell: (row) => (
        <span>{row?.VisaTypeName}</span>
      ),
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
      await visaCostValidationSchema.validate(formValue, { abortEarly: false });
      setValidationErrors({}); // Clear previous errors
      // console.log("Submitting Data: ", formValue);

      const response = await axiosOther.post("addupdatevisacostmaster", formValue);
      // console.log(response);

      if (response.data?.Status === 1) {
        getListDataToServer();
        setIsEditing(false);
        setFormValue(visaCostInitialValue);
        notifySuccess(response.data?.message || response.data?.Message);
      } else {
        // Check if the response has the specific error for VisaType
        if (response.data?.errors?.VisaType) {
          setValidationErrors({ VisaType: response.data.errors.VisaType[0] });
        } else {
          notifyError(response.data?.message || response.data?.Message);
        }
      }
    } catch (error) {
      if (error.inner) {
        const validationErrors = error.inner.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {});
        setValidationErrors(validationErrors);
      }

      if (error.response?.data?.Message) {
        notifyError(error.response?.data?.Message || "An unknown error occurred.");
      } else {
        notifyError("An unexpected error occurred.");
      }
    }
  };


  const handleEdit = (value) => {
    setFormValue({
      id: value?.id || "",
      Country: value?.Country || "",
      VisaType: value?.VisaType || "",
      CountryName: value?.CountryName || "",
      VisaTypeName: value?.VisaTypeName || "",
      Status: value?.Status === "Active" ? "1" : "0",
      AddedBy: value?.AddedBy || "0",
      UpdatedBy: value?.UpdatedBy || "0",
    });
    setIsEditing(true);
    scrollToTop();
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
        const { data } = await axiosOther.post("deletevisacost", {
          id: id,
        });
        if (data?.Status == 1 || data?.status == 1 || data?.result) {
          notifySuccess(data?.Message || data?.message || data?.result);
          getListDataToServer();
        }
      } catch (err) {
        if (err) {
          notifyError(err?.message || err?.Message);
        }
      }
    }
  };

  const handleReset = () => {
    setFormValue(visaCostInitialValue);
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

  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">{isEditing ? "Update Visa Cost" : "Add Visa Cost"}</h4>
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
                <form onSubmit={handleSubmit}>
                  <div className="col-12">
                    <div className="row form-row-gap">
                      <div className="col-md-6 col-lg-2">
                        <label className="m-0">Country </label>
                        <select
                          name="Country"
                          className="form-control form-control-sm"
                          value={formValue?.Country}
                          onChange={handleInputChange}
                        >
                          <option value="">Select</option>
                          {countryList?.map((value, index) => (
                            <option value={value.id} key={index + 1}>
                              {value.Name}
                            </option>
                          ))}
                        </select>
                        {validationErrors?.Country && (
                          <div className="invalid-feedback animated fadeInUp" style={{ display: "block" }}>
                            {validationErrors?.Country}
                          </div>
                        )}
                      </div>

                      <div className="col-md-6 col-lg-2">
                        <label htmlFor="visaType">Visa Type  <span className="text-danger">*</span></label>
                        <select
                          name="VisaType"
                          className="form-control form-control-sm"
                          value={formValue?.VisaType}
                          onChange={handleInputChange}
                        >
                          <option value="">Select</option>
                          {visaList?.map((value, index) => (
                            <option value={value.id} key={index + 1}>
                              {value.Name}
                            </option>
                          ))}
                        </select>
                        {validationErrors?.VisaType && (
                          <div className="invalid-feedback animated fadeInUp" style={{ display: "block" }}>
                            {validationErrors?.VisaType}
                          </div>
                        )}
                      </div>


                      <div className="col-md-6 col-lg-2">
                        <label htmlFor="status">Status</label>
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
                        <button type="submit" className="btn btn-primary btn-custom-size">
                          {isEditing ? "Update" : "Submit"}
                        </button>
                        <button type="button" className="btn btn-dark btn-custom-size ms-2" onClick={handleReset}>
                          Reset
                        </button>
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
                  onChange={(e) => setFiterInput(e.target.value)}
                />
                <span className="input-group-text border">
                  <i className="flaticon-381-search-2 cursor-pointer"></i>
                </span>
              </div>
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

export default VisaCost;
