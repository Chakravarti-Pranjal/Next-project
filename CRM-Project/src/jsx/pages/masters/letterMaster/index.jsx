import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap-daterangepicker/daterangepicker.css";
import { Dropdown, Tab, Nav } from "react-bootstrap";
import { axiosOther } from "../../../../http/axios_base_url";
import { letterMasterValidationSchema } from "../master_validation.js";
import { languageInitialValue, letterMasterInitialValue } from "../masters_initial_value.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
import { notifySuccess, notifyError } from "../../../../helper/notify.jsx";
import { scrollToTop } from "../../../../helper/scrollToTop.js";
import UseTable from "../../../../helper/UseTable.jsx";

const LetterMaster = () => {

  const [selectBtn, setSelectBtn] = useState("Newest");
  const [initialList, setInitialList] = useState([]);
  const [formValue, setFormValue] = useState(letterMasterInitialValue);
  const [validationErrors, setValidationErrors] = useState({});
  const [filterValue, setFilterValue] = useState([]);
  const [filterInput, setFiterInput] = useState("");

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
      const { data } = await axiosOther.post("lettermasterlist");
      setInitialList(data?.DataList);
      setFilterValue(data?.DataList);
      // console.log("list", data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    postDataToServer();
  }, []);

  useEffect(() => {
    const filteredList = initialList?.filter(
      (data) =>
        data?.Name?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||

        data?.Status?.toLowerCase()?.includes(filterInput?.toLowerCase())
    );
    setFilterValue(filteredList);
  }, [filterInput]);


  const handleEditClick = (value) => {
    setFormValue({
      id: value?.id,
      Name: value?.Name,
      GreetingNote: value?.GreetingNote,
      WelcomeNote: value?.WelcomeNote,
      Languages: value?.Languages,
      Status: value?.Status == "Active" ? 1 : 0,
      AddedBy: value?.AddedBy,
      UpdatedBy: value?.UpdatedBy,
    });

  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await letterMasterValidationSchema.validate(formValue, {
        abortEarly: false,
      });
      setValidationErrors({});
      const { data } = await axiosOther.post("addupdatelettermaster", formValue);
      if (data?.Status === 1) {
        postDataToServer();
        setIsEditing(false);
        setFormValue(letterMasterInitialValue);
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


  const handleDelete = async (id) => {
    const confirmation = await swal({
      title: "Are you sure want to Delete?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });

    if (confirmation) {
      try {
        const { data } = await axiosOther.post("deletelettermaster", {
          id: id,
        });
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
  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setFormValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleReset = () => {
    setFormValue(letterMasterInitialValue);
    setValidationErrors({});
    setIsEditing(false);
  };

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
      name: "Name",
      selector: (row) => row?.Name,
      cell: (row) => (
        <span>
          {row?.Name}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Greeting Note",
      selector: (row) => row?.GreetingNote,
      cell: (row) => (
        <span>
          {row?.GreetingNote}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Welcome Note",
      selector: (row) => row?.WelcomeNote,
      cell: (row) => (
        <span>
          {row?.WelcomeNote}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Languages",
      selector: (row) => row?.LanguagesName,
      cell: (row) => (
        <span>
          {row?.LanguagesName}
        </span>
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
              onClick={() => handleEditClick(row)}
            ></i>
            <div className="sweetalert mt-5"></div>
            <i
              className="fa-solid fa-trash-can cursor-pointer text-danger action-icon sweet-confirm"
              onClick={() => handleDelete(row?.id)}
              onChange={scrollToTop()}
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
              <h4 className="card-title">{isEditing ? "Update City Name" : "Add City"}</h4>
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
                          <div className="d-flex justify-content-between">
                            <label className="" htmlFor="name">
                              Name
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
                          <div className="d-flex justify-content-between">
                            <label className="" htmlFor="name">
                              Greeting Note
                              <span className="text-danger">*</span>
                            </label>
                          </div>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="val-username"
                            name="GreetingNote"
                            placeholder="Enter a Name"
                            value={formValue?.GreetingNote}
                            onChange={handleFormChange}
                          />
                          {validationErrors?.GreetingNote && (
                            <div
                              id="val-username1-error"
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.GreetingNote}
                            </div>
                          )}
                        </div>




                        <div className="col-md-6 col-lg-2">
                          <div className="d-flex justify-content-between">
                            <label className="" htmlFor="name">
                              Welcome Note

                            </label>
                          </div>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="val-username"
                            name="Name"
                            placeholder="Enter a Name"
                            value={formValue?.WelcomeNote}
                            onChange={handleFormChange}
                          />
                          {validationErrors?.WelcomeNote && (
                            <div
                              id="val-username1-error"
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.WelcomeNote}
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
                          <button type="submit" className="btn btn-primary btn-custom-size">{isEditing ? "Update" : "Submit"}</button>
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
export default LetterMaster;
