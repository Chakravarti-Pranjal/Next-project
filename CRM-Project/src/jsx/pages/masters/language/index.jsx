import React, { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Navigate, useNavigate } from "react-router-dom";
import moment from "moment";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
import { Dropdown, Tab, Nav } from "react-bootstrap";
import { axiosOther } from "../../../../http/axios_base_url.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { languageValidationSchema } from "../master_validation.js";
import { languageInitialValue } from "../masters_initial_value.js";
import UseTable from "../../../../helper/UseTable.jsx";
import { notifySuccess, notifyError } from "../../../../helper/notify.jsx";
import { scrollToTop } from "../../../../helper/scrollToTop.js"


const Language = () => {
  const [selectBtn, setSelectBtn] = useState("Newest");
  //   const [cityList, setCityList] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [initialList, setInitialList] = useState([]);
  const [businessData, setBusinessData] = useState(languageInitialValue);
  const [filterValue, setFilterValue] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [filterInput, setFiterInput] = useState("");
  const formRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handlePageChange = (page) => setCurrentPage(page - 1);
  const handleRowsPerPageChange = (newRowsPerPage) =>
    setRowsPerPage(newRowsPerPage);
  const navigate = useNavigate();
  const getListDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("languagelist");
      setInitialList(data?.DataList);
      setFilterValue(data?.DataList);
    } catch (error) {
      console.log("country-error", error);
    }
  };

  const handleStateData = (e) => {
    setBusinessData({
      ...businessData,
      [e.target.name]: e.target.value,
    });
  };
  // const getData = (e)=>{
  //   e.preventDefault()
  //   handleSubmit()
  // }
  //console.log(validationErrors);
  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (businessData?.Status == "Inactive") {
    //   setBusinessData({ ...businessData, Status: "0" });
    // } else {
    //   setBusinessData({ ...businessData, Status: "1" });
    // }

    try {
      await languageValidationSchema.validate(
        { ...businessData },
        { abortEarly: false }
      );

      setValidationErrors({});

      const { data } = await axiosOther.post("addupdatelanguage", {
        ...businessData,
      });
      if (data?.Status == 1) {
        getListDataToServer();
        setBusinessData(languageInitialValue);
        setIsEditing(false);
        notifySuccess(data?.message || data?.Message);
      }
      if (data?.Status != 1) {
        notifyError(data?.message || data?.Message);
      }
    } catch (error) {
      if (error.inner) {
        const errorMessages = error.inner.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {});
        setValidationErrors(errorMessages);
      }
      if (error.response?.data?.Errors) {
        const data = Object.entries(error.response?.data?.Errors);
        notifyError(data[0][1]);
      }
    }
  };
  const handleEdit = (value) => {
    setBusinessData({
      id: value?.id,
      Name: value?.Name,
      Status: value?.Status == "Active" ? 1 : 0,
      AddedBy: value?.AddedBy,
      UpdatedBy: value?.UpdatedBy,
    });
  };
  const handleReset = () => {
    setBusinessData(languageInitialValue);
    setValidationErrors({});
    setIsEditing(false);
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
        const { data } = await axiosOther.post("deletelanguage", {
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
  useEffect(() => {
    getListDataToServer();
  }, []);

  // table data filtering -- with useeffect
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
    },
    {
      name: "Name",
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
          <div className="d-flex gap-1 sweetalert">
            <i
              className="fa-solid fa-pencil cursor-pointer text-success action-icon"
              onClick={() => handleEdit(row)}
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
              <h4 className="card-title">{isEditing ? "Update Language" : "Add Language"}</h4>
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
              <div className="form-validation " ref={formRef}>
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
                          <label className="" htmlFor="val-username">
                            Language Name
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="val-username"
                            name="Name"
                            placeholder="Enter language name"
                            value={businessData?.Name}
                            onChange={(e) => handleStateData(e)}
                          />{" "}
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
                          <label className="" htmlFor="status">
                            Status
                          </label>

                          <select
                            name="Status"
                            id="status"
                            className="form-control form-control-sm"
                            value={businessData?.Status}
                            onChange={(e) => handleStateData(e)}
                          >
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                          </select>
                        </div>
                        <div className="col-md-6 col-lg-3 d-flex align-items-end">
                          <button type="submit" className="btn btn-primary btn-custom-size">{isEditing ? "Update" : "Submit"}</button>
                          <button type="button" className="btn btn-dark  btn-custom-size ms-2" onClick={handleReset}>Reset</button>
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
                  onChange={(e) => setFiterInput(e.target.value)}
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
export default Language;
