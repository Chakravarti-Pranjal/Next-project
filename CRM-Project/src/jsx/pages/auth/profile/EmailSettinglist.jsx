import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Dropdown, Tab, Nav, Badge, Modal, Row, Col, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-international-phone/style.css";
import * as Yup from "yup"; // Added for validation
import UseTable from "../../../../helper/UseTable.jsx";
import { axiosOther } from "../../../../http/axios_base_url.js";
import { notifyError, notifySuccess } from "../../../../helper/notify.jsx";

// Define initial form values
const EmailSettingIntialValue = {
  id: "",
  Name: "",
  Email: "",
  Password: "",
  SMTPServer: "",
  OutgoingPort: "",
  IncomingPort: "",
  SecurityType: "",
  UpdatedBy: 1,
};

// Define Yup validation schema
const EmailSettingAddValidation = Yup.object().shape({
  Name: Yup.string().required("Name is required"),
  Email: Yup.string().email("Invalid email format").required("Email is required"),
  Password: Yup.string().required("Password is required"),
  // SMTPServer: Yup.string(),
  // OutgoingPort: Yup.string(),
  // IncomingPort: Yup.string(),
  // SecurityType: Yup.string(),
  // Status: Yup.string().required("Status is required"),
});

const EmailSettinglist = () => {
  const formRef = useRef(null);
  const [initialList, setInitialList] = useState([]);
  const [filterValue, setFilterValue] = useState([]);
  const [filterInput, setFiterInput] = useState("");
  const [formValue, setFormValue] = useState(EmailSettingIntialValue);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [modalCentered, setModalCentered] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const getListDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("modulemasterlist");
      // setInitialList(data?.Datalist || []);
      // setFilterValue(data?.Datalist || []);
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
      id: value?.id || "",
      Name: value?.Name || "",
      Email: value?.Email || "", // Adjusted to match form field
      Password: value?.Password || "",
      SMTPServer: value?.SMTPServer || "",
      OutgoingPort: value?.OutgoingPort || "",
      IncomingPort: value?.IncomingPort || "",
      SecurityType: value?.SecurityType || "",
      Status: value?.Status === "Active" ? "1" : "0",
      UpdatedBy: value?.UpdatedBy || 1,
    });
    setIsEditing(true);
    setModalCentered(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    console.log("Form change:", { name, value });
    setFormValue((prev) => ({
      ...prev,
      [name]: value, // Dynamically update the field
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(formValue, "222222")
    try {
      await EmailSettingAddValidation.validate(formValue, { abortEarly: false });
      setValidationErrors({});
      const payload = {
        ...formValue,
        id: formValue.id || undefined, // Ensure id is not sent for new records
        Status: formValue.Status === "1" ? "Active" : "Inactive", // Convert to API format
      };
      const { data } = await axiosOther.post("addupdatemodulemaster", payload);
      if (data?.Status === 1) {
        getListDataToServer();
        setIsEditing(false);
        setFormValue(EmailSettingIntialValue);
        setModalCentered(false);
        notifySuccess(data?.Message || "Module saved successfully");
      } else {
        notifyError(data?.Message || "Failed to save module");
      }
    } catch (error) {
      console.error("Submit error:", error);
      if (error.name === "ValidationError") {
        const validationErrorss = error.inner.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {});
        console.log("Validation errors:", validationErrorss);
        setValidationErrors(validationErrorss);
      } else if (error.response?.data?.Errors || error.response?.data?.errors) {
        const data = Object.entries(
          error.response?.data?.Errors || error.response?.data?.errors
        );
        notifyError(data[0]?.[1] || "An error occurred");
      } else {
        notifyError("An unexpected error occurred");
      }
    }
  };

  const table_columns = [
    {
      name: "Sr. No.",
      // selector: (row, index) => (
      //   <span className="font-size-11">
      //     {currentPage * rowsPerPage + index + 1}
      //   </span>
      // ),
      sortable: false,
      width: "5rem",
      style: { display: "flex", justifyContent: "center" },
    },
    {
      name: "Name",
      // selector: (row) => row?.Name,
      // cell: (row) => <span>{row?.Name}</span>,
      sortable: true,
      width: "8rem",
    },
    {
      name: "Email",
      // selector: (row) => row?.Email,
      // cell: (row) => <span>{row?.Email}</span>,
      sortable: true,
    },
    {
      name: "Status",
      // selector: (row) => row?.Status,
      // cell: (row) => (
      //   <span
      //     className={`badge ${row.Status === "Active" ? "badge-success light badge" : "badge-danger light badge"}`}
      //     style={{ cursor: "pointer" }}
      //   >
      //     {row.Status}
      //   </span>
      // ),
      sortable: true,
      width: "6rem",
    },
    {
      name: "Action",
      // selector: (row) => (
      //   <div className="d-flex align-items-center gap-1 sweetalert">
      //     <i
      //       className="fa-solid fa-pencil cursor-pointer text-success action-icon"
      //       onClick={() => handleEdit(row)}
      //     ></i>
      //   </div>
      // ),
      width: "6rem",
    },
  ];

  return (
    <div className="row">
      <Modal className="fade" show={modalCentered}>
        <Modal.Header>
          <ToastContainer />
          <Modal.Title>{isEditing ? "Edit Email Settings" : "Create Email Settings"}</Modal.Title>
          <Button
            onClick={() => {
              setModalCentered(false);
              setFormValue(EmailSettingIntialValue);
              setValidationErrors({});
            }}
            variant=""
            className="btn-close"
          ></Button>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <div className="col-md-6 col-lg-6">
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
            <div className="col-md-6 col-lg-6">
              <label htmlFor="Email">
                Email <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                className="form-control form-control-sm"
                name="Email"
                placeholder="Enter Email"
                value={formValue?.Email || ""}
                onChange={handleFormChange}
              />
              {validationErrors?.Email && (
                <div
                  className="invalid-feedback animated fadeInUp"
                  style={{ display: "block" }}
                >
                  {validationErrors?.Email}
                </div>
              )}
            </div>
            <div className="col-md-6 col-lg-6">
              <label htmlFor="Password">
                Password <span className="text-danger">*</span>
              </label>
              <input
                type="password"
                className="form-control form-control-sm"
                name="Password"
                placeholder="Enter Password"
                value={formValue?.Password || ""}
                onChange={handleFormChange}
              />
              {validationErrors?.Password && (
                <div
                  className="invalid-feedback animated fadeInUp"
                  style={{ display: "block" }}
                >
                  {validationErrors?.Password}
                </div>
              )}
            </div>
            <div className="col-md-6 col-lg-6">
              <label htmlFor="SMTPServer">
                SMTP Server
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                name="SMTPServer"
                placeholder="Enter SMTP Server"
                value={formValue?.SMTPServer || ""}
                onChange={handleFormChange}
              />
              {validationErrors?.SMTPServer && (
                <div
                  className="invalid-feedback animated fadeInUp"
                  style={{ display: "block" }}
                >
                  {validationErrors?.SMTPServer}
                </div>
              )}
            </div>
            <div className="col-md-6 col-lg-6">
              <label htmlFor="OutgoingPort">
                Outgoing Port
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                name="OutgoingPort"
                placeholder="Enter Outgoing Port"
                value={formValue?.OutgoingPort || ""}
                onChange={handleFormChange}
              />
              {validationErrors?.OutgoingPort && (
                <div
                  className="invalid-feedback animated fadeInUp"
                  style={{ display: "block" }}
                >
                  {validationErrors?.OutgoingPort}
                </div>
              )}
            </div>
            <div className="col-md-6 col-lg-6">
              <label htmlFor="IncomingPort">
                Incoming Port
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                name="IncomingPort"
                placeholder="Enter Incoming Port"
                value={formValue?.IncomingPort || ""}
                onChange={handleFormChange}
              />
              {validationErrors?.IncomingPort && (
                <div
                  className="invalid-feedback animated fadeInUp"
                  style={{ display: "block" }}
                >
                  {validationErrors?.IncomingPort}
                </div>
              )}
            </div>
            <div className="col-md-6 col-lg-6">
              <label htmlFor="SecurityType">
                Security Type
              </label>
              <select
                className="form-control form-control-sm"
                name="SecurityType"
                value={formValue?.SecurityType || "1"}
                onChange={handleFormChange}
              >
                <option value="TTL">TTL</option>
                <option value="SSL">SSL</option>
              </select>
              {validationErrors?.SecurityType && (
                <div
                  className="invalid-feedback animated fadeInUp"
                  style={{ display: "block" }}
                >
                  {validationErrors?.SecurityType}
                </div>
              )}
            </div>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              setModalCentered(false);
              setFormValue(EmailSettingIntialValue);
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
                  setFormValue(EmailSettingIntialValue);
                  setIsEditing(false);
                  setModalCentered(true);
                }}
                className="btn btn-primary btn-custom-size"
              >
                Create Email Settings
              </Link>
            </div>
          </div>
        </div>
        {/* </Tab.Container> */}
        <UseTable
          table_columns={table_columns}
          // filterValue={filterValue}
          setFilterValue={setFilterValue}
          rowsPerPage={rowsPerPage}
          handlePage={handlePageChange}
          handleRowsPerPage={handleRowsPerPageChange}
        />
      </Tab.Container>
    </div >
  );
};

export default EmailSettinglist;