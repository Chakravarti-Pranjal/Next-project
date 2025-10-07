import React, { useEffect, useRef, useState } from "react";
import UseTable from "../../../helper/UseTable.jsx";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { axiosOther } from "../../../http/axios_base_url.js";
import { Dropdown, Tab, Nav, Badge, Modal, Row, Col, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { scrollToTop } from "../../../helper/scrollToTop.js";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { moduleIntialValue } from "../userManagement/user-intial-values.js";
import { moduleAddValidation } from "../userManagement/user_validation.js";
import swal from "sweetalert";
import { notifyError, notifySuccess } from "../../../helper/notify.jsx";

const Module = () => {
  const formRef = useRef(null);
  const [initialList, setInitialList] = useState([]);
  const [filterValue, setFilterValue] = useState([]);
  const [filterInput, setFiterInput] = useState("");
  const [formValue, setFormValue] = useState(moduleIntialValue);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [modalCentered, setModalCentered] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [menuTypeList, setMenuTypeList] = useState([])

  const getListDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("modulelist");
      setInitialList(data?.Datalist || []);
      setFilterValue(data?.Datalist || []);
    } catch (error) {
      console.error("Error fetching module list:", error);
      notifyError("Failed to fetch module list");
    }
    try {
      const { data } = await axiosOther.post("listmenutype");
      setMenuTypeList(data?.DataList)
    } catch (error) {
      console.error("Error fetching module list:", error);
      notifyError("Failed to fetch module list");
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

  const handlePageChange = (page) => setCurrentPage(page - 1);
  const handleRowsPerPageChange = (newRowsPerPage) => setRowsPerPage(newRowsPerPage);

  const handleEdit = (value) => {
    console.log("Editing module:", value);
    setFormValue({
      ...formValue,
      Name: value?.Name || "",
      DisplayName: value?.DisplayName || "",
      id: value?.id,
      Status: value?.Status === "Active" ? "1" : "0",
      // AddedBy: value.AddedBy || 1,
      UpdatedBy: value.UpdatedBy || 1,
      ParentId: value?.ParentId || 0,
      Sequence: value?.Sequence,
      Icon: value?.Icon,
      Type: value?.Type
    });
    setIsEditing(true);
    setModalCentered(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    console.log("Form change:", { name, value });
    setFormValue((prev) => ({
      ...prev,
      [name === "ISACTIVE" ? "Status" : name]:
        name === "ISACTIVE" ? (value === "Active" ? "1" : "0") : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await moduleAddValidation.validate({ ...formValue }, { abortEarly: false });
      setValidationErrors({});
      const payload = {
        ...formValue,
        Id: formValue.id,
        Status: formValue.Status,
        AddedBy: formValue.AddedBy,
        Type: +formValue.Type
      };
      const endpoint = isEditing ? "updatemodule" : "addmodule";
      const { data } = await axiosOther.post(endpoint, payload);
      if (data?.Status === 1) {
        getListDataToServer();
        setIsEditing(false);
        setFormValue(moduleIntialValue);
        setModalCentered(false);
        notifySuccess(data?.Message || "Module saved successfully");
      } else {
        notifyError(data?.Message || "Failed to save module");
      }
    } catch (error) {
      console.error("Submit error:", error);
      if (error.inner) {
        const validationErrorss = error.inner.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {});
        console.log("Validation errors:", validationErrorss);
        setValidationErrors(validationErrorss);
      }

      if (error.response?.data?.Errors || error.response?.data?.errors) {
        const data = Object.entries(
          error.response?.data?.Errors || error.response?.data?.errors
        );
        notifyError(data[0]?.[1] || "An error occurred");
      } else {
        notifyError("An unexpected error occurred");
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
        const { data } = await axiosOther.post("deletemodule", { id });
        if (data?.Status == 1) {
          notifySuccess(data?.Message || data?.message || data?.result);
          getListDataToServer();
        }
      } catch (err) {
        notifyError(err?.message || err?.Message);
      }
    }
  };

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
      style: { display: "flex", justifyContent: "center" },
    },
    {
      name: "Name",
      selector: (row) => row?.Name,
      cell: (row) => (
        <span
        // onClick={() => navigate("/user", { state: { userList: row?.id } })}
        >
          {row?.Name}
        </span>
      ),
      sortable: true,
      width: "15rem",
    },
    {
      name: "Display Name",
      selector: (row) => row?.DisplayName,
      cell: (row) => <span>{row?.DisplayName}</span>,
      sortable: true,
      width: "15rem",
    },
    {
      name: "Status",
      selector: (row) => row?.Status,
      cell: (row) => (
        <span
          className={`badge ${row.Status === "Active" ? "badge-success light badge" : "badge-danger light badge"}`}
          style={{ cursor: "pointer" }}
        >
          {row.Status}
        </span>
      ),
      sortable: true,
      // width: "6rem",
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
      // width: "6rem",
    },
  ];

  return (
    <div className="row">
      <Modal className="fade" show={modalCentered}>
        <Modal.Header>
          <ToastContainer />
          <Modal.Title>{isEditing ? "Edit Module" : "Create Module"}</Modal.Title>
          <Button
            onClick={() => {
              setModalCentered(false);
              setFormValue(moduleIntialValue);
              setValidationErrors({});
            }}
            variant=""
            className="btn-close"
          ></Button>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <div className="col-md-6 col-lg-4">
              <label htmlFor="Name">
                Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                name="Name"
                placeholder="Enter Name"
                value={formValue?.Name || ""}
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
              <label htmlFor="DisplayName">
                Display Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                name="DisplayName"
                placeholder="Enter your Display Name"
                value={formValue?.DisplayName || ""}
                onChange={handleFormChange}
              />
              {validationErrors?.DisplayName && (
                <div
                  className="invalid-feedback animated fadeInUp"
                  style={{ display: "block" }}
                >
                  {validationErrors?.DisplayName}
                </div>
              )}
            </div>
            <div className="col-md-6 col-lg-4">
              <label>
                Menu Type
                {/* <span className="text-danger">*</span> */}
              </label>
              <select
                name="Type"
                className="form-control form-control-sm"
                value={formValue.Type || ""}
                onChange={handleFormChange}
              >
                <option value="">Select</option>
                {menuTypeList.map((menu, index) => (
                  <option key={index} value={menu.id}>
                    {menu.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6 col-lg-4">
              <label>
                Status
              </label>
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
            onClick={() => {
              setModalCentered(false);
              setFormValue(moduleIntialValue);
              setValidationErrors({});
            }}
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
                  placeholder="Search..."
                  value={filterInput}
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
                  setFormValue(moduleIntialValue);
                  setIsEditing(false);
                  setModalCentered(true);
                }}
                className="btn btn-primary btn-custom-size"
              >
                Create Module
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

export default Module;
