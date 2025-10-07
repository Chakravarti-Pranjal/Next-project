import React, { useState, useEffect, useRef } from "react";
import "bootstrap-daterangepicker/daterangepicker.css";
import { Dropdown, Tab, Nav, Button } from "react-bootstrap";
import { axiosOther } from "../../../../http/axios_base_url.js";
import { trainMasterInitialValue } from "../masters_initial_value.js";
import { trainMasterValidationSchema } from "../master_validation.js";
import DataTable from "react-data-table-component";
import { table_custom_style } from "../../../../css/custom_style";
import { NavLink, useNavigate } from "react-router-dom";
import { formatDate } from "../../../../helper/formatDate.js";
import { ToastContainer } from "react-toastify";
import { notifySuccess, notifyError } from "../../../../helper/notify.jsx";
import UseTable from "../../../../helper/UseTable.jsx";
import { scrollToTop } from "../../../../helper/scrollToTop.js";

const Train = () => {
  const [selectBtn, setSelectBtn] = useState("Newest");
  const [initialList, setInitialList] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [businessData, setBusinessData] = useState(trainMasterInitialValue);
  const [intitialList, setIntitialList] = useState([]);
  const [formValue, setFormValue] = useState(trainMasterInitialValue);
  const [destinationList, setDestintaionList] = useState([]);
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
      const { data } = await axiosOther.post("trainMasterlist");
      // console.log("train-initial-list", data);
      setIntitialList(data?.DataList);
      setFilterValue(data?.DataList);
    } catch (error) {
      console.log("country-error", error);
    }
  };

  useEffect(() => {
    getListDataToServer();
  }, []);

  // console.log(formValue);

  const handleFormChange = (e) => {
    const { name, value, file, type } = e.target;
    if (type == "file") {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result;
        const base64String = await base64.split(",")[1];
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
      await trainMasterValidationSchema.validate(formValue, {
        abortEarly: false,
      });
      setValidationErrors({});
      const { data } = await axiosOther.post("addupdatetrainmaster", formValue);
      if (data?.Status === 1) {
        getListDataToServer();
        setIsEditing(false);
        setFormValue(trainMasterInitialValue);
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
      if (error.response?.data?.Errors) {
        const data = Object.entries(error.response?.data?.Errors);
        notifyError(data[0][1]);
      }
    }
  };

  const handleEdit = (data) => {
    setFormValue({
      id: data?.id,
      Name: data?.Name,
      Status: data?.Status == "Active" ? "1" : "0",
      AddedBy: data?.AddedBy,
      ImageName: data?.ImageName,
      UpdatedBy: data?.UpdatedBy,
      cutofdayFIT: data?.cutofdayFIT,
      cutofdayGIT: data?.cutofdayGIT,
    });
    setIsEditing(true);
    formRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleReset = () => {
    setFormValue(trainMasterInitialValue);
    setValidationErrors({});
    setIsEditing(false);
  };

  const handleDelete = async (id) => {
    const confirmation = await swal({
      title: "Are you sure want to delete?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });

    if (confirmation) {
      try {
        const { data } = await axiosOther.post("deletetrain", {
          id: id,
        });
        if (data?.Status == 1 || data?.status == 1 || data?.result) {
          notifySuccess(data?.Message || data?.message || data?.result);
          getListDataToServer();
        }
      } catch (err) {
        if (err) {
          alert(err?.message || err?.Message);
        }
      }
    }
  };

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
      width: "7rem",
      // style: {
      //   display: "flex",
      //   justifyContent: "center",
      // },
    },
    {
      name: "Image",
      selector: (row) => row?.ImageName,
      cell: (row) => (
        <span>
          {" "}
          <img
            src={row.ImageName}
            alt="image"
            style={{ height: "30px", width: "auto", objectFit: "contain" }}
          ></img>
        </span>
      ),
      sortable: true,
      width: "15rem",
      wrap: true,
    },
    {
      name: "Train Name",
      selector: (row) => row?.Name,
      cell: (row) => <span>{row.Name}</span>,
      sortable: true,
      width: "20rem",
      wrap: true,
    },

    {
      name: "Rate",
      selector: (row) => (
        <NavLink
          to={`/train/rate/${row?.id}`}
          state={{ ...row, Master: "Train" }}
        >
          <Button variant="dark light py-1 rounded-pill"><span>View/Add</span></Button>
        </NavLink>
      ),
      width: "18rem",
      wrap: true,
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
      width: "20rem",
    },
    {
      name: "Action",
      selector: (row) => {
        return (
          <span className="d-flex gap-1">
            <i
              className="fa-solid fa-pencil cursor-pointer text-success action-icon"
              onClick={() => handleEdit(row)}
              onChange={scrollToTop()}
            ></i>
            <i
              className="fa-solid fa-trash-can cursor-pointer text-danger action-icon sweet-confirm"
              onClick={() => handleDelete(row?.id)}
            ></i>
          </span>
        );
      },
      // width: "4.5rem",
    },
  ];

  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">
                {" "}
                {isEditing ? "Update Train" : "Add Train"}
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
                        <div className="col-md-6 col-lg-3">
                          <label className="" htmlFor="status">
                            Train Name <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Train name"
                            name="Name"
                            id="status"
                            className="form-control form-control-sm"
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

                        <div className="col-md-6 col-lg-3">
                          <label className="" htmlFor="val-username">
                            Image
                          </label>
                          <input
                            type="file"
                            name="ImageData"
                            className="form-control form-control-sm"
                            onChange={handleFormChange}
                          />
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
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                          </select>
                        </div>

                        <div className="col-md-6 col-lg-3">
                          <label className="m-0">Cut Of Day FIT</label>
                          <input
                            type="Number"
                            className="form-control form-control-sm"
                            name="cutofdayFIT"
                            value={formValue?.cutofdayFIT}
                            onChange={handleFormChange}
                          />
                        </div>
                        <div className="col-md-6 col-lg-3">
                          <label className="m-0">Cut Of Day GIT</label>
                          <input
                            type="Number"
                            className="form-control form-control-sm"
                            name="cutofdayGIT"
                            value={formValue?.cutofdayGIT}
                            onChange={handleFormChange}
                          />
                        </div>

                        <div className="col-md-6 col-lg-1 d-flex align-items-end">
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
          <div className="card-action coin-tabs">
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
          <div className="d-flex align-items-center mb-2 flex-wrap">
            <div className="guest-calendar"></div>
            {/* <div className="newest ms-3">
              <Dropdown>
                <Dropdown.Toggle
                  as="div"
                  className=" btn-select-drop default-select btn i-false"
                >
                  {selectBtn} <i className="fas fa-angle-down ms-2 "></i>
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
            </div> */}
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
export default Train;
