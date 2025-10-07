import React, { useState, useEffect, useRef } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "bootstrap-daterangepicker/daterangepicker.css";
import { Dropdown, Tab, Nav } from "react-bootstrap";
import { axiosOther } from "../../../../http/axios_base_url.js";
import { hotelAditionalListValidaitionSchema } from "../master_validation.js";
import { hotelAditionalListInitialValue } from "../masters_initial_value.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
import { notifySuccess, notifyError } from "../../../../helper/notify.jsx";
import UseTable from "../../../../helper/UseTable.jsx";
import { scrollToTop } from "../../../../helper/scrollToTop.js";
import extractTextFromHTML from "../../../../helper/htmlParser.js";

const HotelAdditional = () => {
  const [initialList, setInitialList] = useState([]);
  const [formValue, setFormValue] = useState(hotelAditionalListInitialValue);
  const [validationErrors, setValidationErrors] = useState({});
  const [filterValue, setFilterValue] = useState([]);
  const [filterInput, setFiterInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const formRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handlePageChange = (page) => setCurrentPage(page - 1);
  const handleRowsPerPageChange = (newRowsPerPage) =>
    setRowsPerPage(newRowsPerPage);
  const navigate = useNavigate();
  const getListDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("hoteladditionlist");
      setInitialList(data?.DataList);
      setFilterValue(data?.DataList);
    } catch (error) {
      console.log("hotel-type-error", error);
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
  }, [filterInput]);

  const table_columns = [
    {
      name: "Sr. No.",
      selector: (row, index) => (
        <span className="font-size-11">
          {currentPage * rowsPerPage + index + 1}
        </span>
      ),
      sortable: false,
      width: "7rem",
    },

    {
      name: "id",
      selector: (row) => row?.id,
      cell: (row) => <span>{row?.id}</span>,
      sortable: true,
      width: "9rem",
    },
    {
      name: "Name",
      selector: (row) => row?.Name,
      cell: (row) => <span>{row?.Name}</span>,
      sortable: true,
      width: "12rem",
    },
    {
      name: "Image",
      selector: (row) => row?.ImageName,
      cell: (row) => (
        <img
          src={row?.ImageName}
          alt={row?.Name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = fallback;
          }}
          style={{ height: "30px", width: "50px" }}
        ></img>
      ),
      sortable: true,
      width: "15rem",
    },
    {
      name: "Details",
      selector: (row) => row?.Details,
      cell: (row) => <span>{row?.Details}</span>,
      sortable: true,
      width: "15rem",
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
      width: "12rem",
    },
    {
      name: "Action",
      selector: (row) => (
        <div className="d-flex gap-1 sweetalert align-items-center">
          <i
            className="fa-solid fa-pencil cursor-pointer text-success action-icon"
            onClick={() => handleEdit(row)}
            onChange={scrollToTop()}
          ></i>
          <i
            className="fa-solid fa-trash-can cursor-pointer text-danger action-icon sweet -confirm"
            onClick={() => handleDelete(row?.id)}
          ></i>
        </div>
      ),
    },
  ];

  const handleFormChange = (e) => {
    const { name, value, files, type } = e.target;

    if (type === "file") {
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
      await hotelAditionalListValidaitionSchema.validate(formValue, {
        abortEarly: false,
      });
      setValidationErrors({});
      const { data } = await axiosOther.post(
        "addupdatehoteladdition",
        formValue
      );
      if (data?.Status == 1) {
        getListDataToServer();
        setFormValue(hotelAditionalListInitialValue);
        setIsEditing(false);
        notifySuccess(data?.message || data?.Message || data?.result);
      } else {
        notifyError(data?.message || data?.Message || data?.result);
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
      Details: value?.Details,
      Images: value?.ImageName,
      Status:
        value?.Status == "1" || value?.Status === "0"
          ? "Active"
          : value?.Status,
      AddedBy: 1,
      UpdatedBy: value?.UpdatedBy,
    });
    setIsEditing(true); // Set edit mode
    formRef.current.scrollIntoTop({ behavior: "smooth" });
    highlightInputFields();
  };

  const highlightInputFields = () => {
    const inputs = formRef.current.querySelectorAll("input, select");
    inputs.forEach((input) => {
      input.classList.add("highlight");
      setTimeout(() => {
        input.classList.remove("highlight");
      }, 2000);
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
        const { data } = await axiosOther.post("deletehoteladdition", { id });
        if (data?.Status === 1 || data?.status === 1 || data?.result) {
          notifySuccess(data?.Message || data?.message || data?.result);
          getListDataToServer();
        }
      } catch (err) {
        notifyError(err?.message || err?.Message);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReset = () => {
    setFormValue(hotelAditionalListInitialValue);
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
                {isEditing ? "Update Hotel Additional" : "Add Hotel Additional"}
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
                          <label htmlFor="name">
                            Name
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className={`form-control form-control-sm ${validationErrors?.Name ? "is-invalid" : ""
                              } highlight`}
                            name="Name"
                            placeholder="Enter Hotel Additional Name"
                            value={formValue?.Name}
                            onChange={handleFormChange}
                          />
                          {validationErrors?.Name && (
                            <div
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.Name}
                            </div>
                          )}
                        </div>

                        <div className="col-md-6 col-lg-2">
                          <label htmlFor="Details">
                            Details
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className={`form-control form-control-sm ${validationErrors?.Details ? "is-invalid" : ""
                              } highlight`}
                            name="Details"
                            placeholder="Enter Description"
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
                        <div className="col-md-6 col-lg-2">
                          <label className="" htmlFor="val-username">
                            Add Image
                          </label>
                          <input
                            type="file"
                            className="form-control form-control-sm"
                            id="val-username"
                            name="image"
                            onChange={handleFormChange}
                          />
                        </div>
                        <div className="col-md-6 col-lg-2">
                          <label>Status</label>
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

                        <div className="col-md-6 col-lg-4 d-flex align-items-center mt-3">
                          <button
                            type="submit"
                            className="btn btn-primary btn-custom-size"
                          >
                            {isEditing ? "Update" : "Submit"}
                          </button>
                          <button
                            type="button"
                            className="btn btn-dark  btn-custom-size ms-2"
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
      <Tab.Container
        defaultActiveKey="All"
        style={{ margin: "-30px -10px -20px -30px" }}
      >
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
          <div className="col-md-4 mx-auto">
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

export default HotelAdditional;
