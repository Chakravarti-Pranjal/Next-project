import React, { useEffect, useRef, useState } from "react";
import UseTable from "../../../helper/UseTable.jsx";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { axiosOther } from "../../../http/axios_base_url.js";
import { Dropdown, Tab, Nav, Badge } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { scrollToTop } from "../../../helper/scrollToTop.js";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { Modal, Row, Col, Button } from "react-bootstrap";
import { departmentIntialValue } from "../userManagement/user-intial-values.js";
import { departmentAddValidation } from "../userManagement/user_validation.js";
import { notifyError, notifySuccess } from "../../../helper/notify.jsx";

const UserDepartmentList = () => {
  const formRef = useRef(null);
  const [initialList, setInitialList] = useState([]);
  const [filterValue, setFilterValue] = useState([]);
  const [filterInput, setFiterInput] = useState("");
  const [formValue, setFormValue] = useState(departmentIntialValue);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [modalCentered, setModalCentered] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const handlePageChange = (page) => setCurrentPage(page - 1);
  const handleRowsPerPageChange = (newRowsPerPage) =>
    setRowsPerPage(newRowsPerPage);

  const getListDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("departmentlist");
      console.log(data, "data");
      setInitialList(data?.DataList);
      setFilterValue(data?.DataList);
    } catch (error) {
      console.log("user-error", error);
    }
  };

  useEffect(() => {
    getListDataToServer();
  }, []);

  useEffect(() => {
    const filteredList = initialList?.filter(
      (data) =>
        data?.Name?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
        data?.DisplayName?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
        data?.Status?.toLowerCase()?.includes(filterInput?.toLowerCase())
    );
    setFilterValue(filteredList);
  }, [filterInput, initialList]);

  const table_columns = [
    {
      name: "Sr. No.",
      selector: (row, index) => (
        <span className="font-size-11">
          {currentPage * rowsPerPage + index + 1}
        </span>
      ),
      sortable: false,
      width: "5rem",
      // style: { display: "flex", justifyContent: "center" },
    },
    {
      name: "Department Name",
      selector: (row) => row?.Name,
      cell: (row) => (
        <span onClick={() => navigate("/user", { state: { userList: row?.ID } })}>
          {row?.Name}
        </span>
      ),
      sortable: true,
      width: "30rem",
    },
    {
      name: "Department Code",
      selector: (row) => row?.Code,
      cell: (row) => (
        <span onClick={() => navigate("/user", { state: { userList: row?.ID } })}>
          {row?.Code}
        </span>
      ),
      sortable: true,
      width: "30rem",
    },
    {
      name: "Status",
      selector: (row) => row?.Status,
      cell: (row) => (
        <span
          className={`badge ${row.Status === "Active" ? "badge-success light badge" : "badge-danger light badge"
            }`}
        >
          {row.Status}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => (
        <div className="d-flex align-items-center gap-1 sweetalert">
          <i
            className="fa-solid fa-pencil cursor-pointer text-success action-icon"
            onClick={() => handleEdit(row)}
          ></i>
          <i
            className="fa-solid fa-trash-can cursor-pointer text-danger action-icon sweet-confirm"
            onClick={() => handleDelete(row?.id)}
          ></i>
        </div>
      ),
      width: "6rem",
    },
  ];

  const handleEdit = (value) => {
    console.log(value, "value");
    setFormValue({
      Name: value?.Name || "",
      id: value?.id || value?.ID || "",
      Status: value?.Status === "Active" ? "1" : "0",
      AddedBy: 1,
      UpdatedBy: 1,
      Code: value?.Code
    });
    setIsEditing(true);
    setModalCentered(true);
  };

  const handleDelete = async (id) => {
    // console.log(id, "id");
    const confirmation = await swal({
      title: "Are you sure you want to Delete?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });
    if (confirmation) {
      try {
        const { data } = await axiosOther.post("deletedepartment", { id });
        // isEditing.log(data);
        if (data?.Status === 1 || data?.status === 1 || data?.result) {
          notifySuccess(data?.Message || data?.message || data?.result);
          getListDataToServer();
        }
      } catch (err) {
        notifyError(err?.message || err?.Message);
      }
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({
      ...prev,
      [name === "ISACTIVE" ? "Status" : name]:
        name === "ISACTIVE" ? (value === "Active" ? "1" : "0") : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await departmentAddValidation.validate(
        { ...formValue, isEditing },
        { abortEarly: false }
      );
      setValidationErrors({});
      // console.log("Payload sent to API:", formValue);
      const { data } = await axiosOther.post("addupdatedepartment", {
        Name: formValue.Name,
        id: formValue.id,
        Status: formValue.Status,
        AddedBy: formValue.AddedBy || 1,
        Code: formValue.Code,
        UpdatedBy: formValue.UpdatedBy || 1
      });
      if (data?.Status === 1) {
        getListDataToServer();
        setIsEditing(false);
        setFormValue(departmentIntialValue);
        setModalCentered(false);
        notifySuccess(data?.message || data?.Message);
      } else {
        notifyError(data?.Message || data?.message);
      }
    } catch (error) {
      console.error("Error:", error);
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

  return (
    <div className="row">
      <Modal className="fade" show={modalCentered}>
        <Modal.Header>
          <ToastContainer />
          <Modal.Title>{isEditing ? "Edit Department" : "Create Department"}</Modal.Title>
          <Button
            onClick={() => setModalCentered(false)}
            variant=""
            className="btn-close"
          ></Button>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <div className="col-md-6 col-lg-4">
              <label htmlFor="name">
                Department Name
                <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                name="Name"
                placeholder="Enter Name"
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
            <div className="col-md-6 col-lg-4">
              <label htmlFor="name">
                Department Code
                <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                name="Code"
                placeholder="Enter Code"
                value={formValue?.Code}
                onChange={handleFormChange}
              />
              {validationErrors?.Code && (
                <div
                  className="invalid-feedback animated fadeInUp"
                  style={{ display: "block" }}
                >
                  {validationErrors?.Code}
                </div>
              )}
            </div>
            <div className="col-md-6 col-lg-4">
              <label>Status</label>
              {/* <span className="text-danger">*</span> */}
              <select
                name="ISACTIVE"
                className="form-control form-control-sm"
                value={formValue.Status === "1" ? "Active" : "Inactive"}
                onChange={handleFormChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              {validationErrors?.Status && (
                <div
                  className="invalid-feedback animated fadeInUp"
                  style={{ display: "block" }}
                >
                  {validationErrors?.Status}
                </div>
              )}
            </div>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => setModalCentered(false)}
            variant="danger light"
            className="btn-custom-size"
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            className="btn-custom-size"
          >
            Save changes
          </Button>
        </Modal.Footer>
      </Modal>
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
          <div className="d-flex align-items-center mb-2 flex-wrap">
            <div className="guest-calendar"></div>
            <div className="newest ms-3 d-flex gap-2">
              <button
                className="btn btn-dark btn-custom-size"
                name="SaveButton"
                onClick={() => navigate("/masters")}
              >
                <span className="me-1">Back</span>
                <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
              </button>
              <Link
                onClick={() => {
                  setFormValue(departmentIntialValue);
                  setIsEditing(false);
                  setModalCentered(true);
                }}
                className="btn btn-primary btn-custom-size"
              >
                Create Department
              </Link>
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
    </div>
  );
};

export default UserDepartmentList;