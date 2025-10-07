import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Dropdown, Tab, Nav } from "react-bootstrap";
import { axiosOther } from "../../../../http/axios_base_url";
import { driverMasterValidationSchema } from "../master_validation";
import { driverMasterInitialValue } from "../masters_initial_value";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
import { notifySuccess, notifyError } from "../../../../helper/notify.jsx";
import UseTable from "../../../../helper/UseTable";
import { scrollToTop } from "../../../../helper/scrollToTop";

const DriverMaster = () => {
  const [selectBtn, setSelectBtn] = useState("Newest");
  const [initialList, setInitialList] = useState([]);
  const [formValue, setFormValue] = useState(driverMasterInitialValue);
  const [validationErrors, setValidationErrors] = useState({});
  const [filterValue, setFilterValue] = useState([]);
  const [filterInput, setFilterInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [countryList, setCountryList] = useState([]);
  const [imageValue, setImageValue] = useState({
    LicenseData: "",
    LicenseName: "",
  });
  const [anotherImage, setAnotherImage] = useState({
    ImageData: "",
    ImageName: "",
  });
  const navigate = useNavigate();

  const handlePageChange = (page) => setCurrentPage(page - 1);
  const handleRowsPerPageChange = (newRowsPerPage) =>
    setRowsPerPage(newRowsPerPage);

  const getListDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("drivermasterlist");
      setInitialList(data?.DataList);
      setFilterValue(data?.DataList);
    } catch (error) {
      console.log("driver-error", error);
    }
  };

  const getCountryList = async () => {
    try {
      const { data } = await axiosOther.post("countrylist", {
        Search: "",
        Status: 1,
      });
      setCountryList(data?.DataList);
    } catch (error) {
      console.log("country-error", error);
    }
  };

  useEffect(() => {
    getListDataToServer();
    getCountryList();
  }, []);

  useEffect(() => {
    const filteredList = initialList?.filter(
      (data) =>
        data?.DriverName?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
        data?.LicenseNumber?.toLowerCase()?.includes(
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
      width: "5rem",
    },
    {
      name: "Profile",  
      selector: (row) => row?.ImageName,
      cell: (row) => (
        <img
          src={row.ImageName}
          className="height-30 width-30"
          alt="profile-image"
        />
      ),
      sortable: true,
    },
    {
      name: "Document",
      selector: (row) => row?.LicenseName,
      cell: (row) => (
        <img
          src={row.LicenseName}
          className="height-30 width-30"
          alt="license-image"
        />
      ),
      sortable: true,
    },
    {
      name: "Driver Name",
      selector: (row) => row?.DriverName,
      cell: (row) => <span>{row.DriverName}</span>,
      sortable: true,
    },
    {
      name: "Country",
      selector: (row) => row?.Country,
      cell: (row) => <span>{row.Country}</span>,
      sortable: true,
    },
    {
      name: "License Number",
      selector: (row) => row?.LicenseNumber,
      cell: (row) => <span>{row.LicenseNumber}</span>,
      sortable: true,
    },
    {
      name: "Mobile Number",
      selector: (row) => row?.MobileNumber,
      cell: (row) => <span>{row.MobileNumber}</span>,
      sortable: true,
    },
    {
      name: "WhatsApp Number",
      selector: (row) => row?.WhatsappNumber,
      cell: (row) => <span>{row.WhatsappNumber}</span>,
      sortable: true,
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
      width: "4.5rem",
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

  const handleDriverChange1 = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result;
      const base64String = base64.split(",")[1];
      setImageValue({
        LicenseData: base64String,
        LicenseName: file.name,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDriverChange2 = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result;
      const base64String = base64.split(",")[1];
      setAnotherImage({
        ImageData: base64String,
        ImageName: file.name,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await driverMasterValidationSchema.validate(formValue, {
        abortEarly: false,
      });
      setValidationErrors({});
      const { data } = await axiosOther.post("addupdatedrivermaster", {
        ...formValue,
        ...imageValue,
        ...anotherImage,
      });
      if (data?.Status === 1) {
        getListDataToServer();
        setIsEditing(false);
        setFormValue(driverMasterInitialValue);
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
      DriverName: value?.DriverName,
      Country: value?.Country,
      LicenseNumber: value?.LicenseNumber,
      MobileNumber: value?.MobileNumber,
      WhatsappNumber: value?.WhatsappNumber,
      AlternateMobileNo: value?.AlternateMobileNo,
      BirthDate: value?.BirthDate,
      ValidUpto: value?.ValidUpto,
      PassportNumber: value?.PassportNumber,
      Address: value?.Address,
      Status: value?.Status === "Active" ? 1 : 0,
    });
    setImageValue({
      LicenseData: value?.LicenseName,
      LicenseName: value?.LicenseName,
    });
    setAnotherImage({
      ImageData: value?.ImageName,
      ImageName: value?.ImageName,
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
        const { data } = await axiosOther.post("deletedrivermaster", { id });
        if (data?.Status == 1 || data?.status == 1 || data?.result) {
          notifySuccess(data?.Message || data?.message || data?.result);
          getListDataToServer();
        }
      } catch (err) {
        notifySuccess(err?.message || err?.Message);
      }
    }
  };

  const handleReset = () => {
    setFormValue(driverMasterInitialValue);
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
                {isEditing ? "Update Driver " : "Add Driver"}
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
                          <label htmlFor="country">
                            Country
                            <span className="text-danger">*</span>
                          </label>
                          <select
                            name="Country"
                            className={`form-control form-control-sm ${validationErrors?.Country ? "is-invalid" : ""
                              }`}
                            value={formValue?.Country}
                            onChange={handleFormChange}
                          >
                            <option value={1}>Select Country</option>
                            {countryList.map((value, index) => (
                              <option value={value.id} key={index + 1}>
                                {value.Name}
                              </option>
                            ))}
                          </select>
                          {validationErrors?.Country && (
                            <div
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.Country}
                            </div>
                          )}
                        </div>

                        <div className="col-md-6 col-lg-2">
                          <label htmlFor="driverName">
                            Driver Name
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className={`form-control form-control-sm ${validationErrors?.DriverName ? "is-invalid" : ""
                              }`}
                            name="DriverName"
                            placeholder="Driver Name"
                            value={formValue?.DriverName}
                            onChange={handleFormChange}
                          />
                          {validationErrors?.DriverName && (
                            <div
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.DriverName}
                            </div>
                          )}
                        </div>

                        <div className="col-md-6 col-lg-2">
                          <label htmlFor="mobileNumber">
                            Mobile Number
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className={`form-control form-control-sm ${validationErrors?.MobileNumber ? "is-invalid" : ""
                              }`}
                            name="MobileNumber"
                            placeholder="Mobile Number"
                            value={formValue?.MobileNumber}
                            onChange={handleFormChange}
                          />
                          {validationErrors?.MobileNumber && (
                            <div
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.MobileNumber}
                            </div>
                          )}
                        </div>

                        <div className="col-md-6 col-lg-2">
                          <label htmlFor="whatsappNumber">
                            WhatsApp Number
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className={`form-control form-control-sm ${validationErrors?.WhatsappNumber
                                ? "is-invalid"
                                : ""
                              }`}
                            name="WhatsappNumber"
                            placeholder="WhatsApp Number"
                            value={formValue?.WhatsappNumber}
                            onChange={handleFormChange}
                          />
                          {validationErrors?.WhatsappNumber && (
                            <div
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.WhatsappNumber}
                            </div>
                          )}
                        </div>

                        <div className="col-md-6 col-lg-2">
                          <label htmlFor="licenseNumber">
                            License Number
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className={`form-control form-control-sm ${validationErrors?.LicenseNumber
                                ? "is-invalid"
                                : ""
                              }`}
                            name="LicenseNumber"
                            placeholder="License Number"
                            value={formValue?.LicenseNumber}
                            onChange={handleFormChange}
                          />
                          {validationErrors?.LicenseNumber && (
                            <div
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.LicenseNumber}
                            </div>
                          )}
                        </div>

                        <div className="col-md-6 col-lg-2">
                          <label htmlFor="licenseUpload">
                            Upload License
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="file"
                            name="LicenseData"
                            className="form-control form-control-sm"
                            onChange={handleDriverChange1}
                          />
                        </div>

                        <div className="col-md-6 col-lg-2">
                          <label htmlFor="imageUpload">
                            Upload Image
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="file"
                            name="ImageData"
                            className="form-control form-control-sm"
                            onChange={handleDriverChange2}
                          />
                        </div>

                        <div className="col-md-6 col-lg-2">
                          <label htmlFor="status">
                            Status
                            <span className="text-danger">*</span>
                          </label>
                          <select
                            name="Status"
                            className={`form-control form-control-sm ${validationErrors?.Status ? "is-invalid" : ""
                              }`}
                            value={formValue?.Status}
                            onChange={handleFormChange}
                          >
                            <option value={1}>Active</option>
                            <option value={0}>Inactive</option>
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

export default DriverMaster;
