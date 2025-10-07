import React, { useState, useEffect } from "react";
import { Dropdown, Tab, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
import { notifySuccess, notifyError } from "../../../../helper/notify.jsx";
import UseTable from "../../../../helper/UseTable.jsx";
import { scrollToTop } from "../../../../helper/scrollToTop.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { axiosOther } from "../../../../http/axios_base_url.js";

// ✅ Helper function to get default form values
const getDefaultFormValue = () => {
  const queryData = JSON.parse(localStorage.getItem("Query_Qoutation") || "{}");
  const quotationList = JSON.parse(localStorage.getItem("qoutationList") || "[]")[0] || {};
  const token = JSON.parse(localStorage.getItem("token") || "{}");

  return {
    id: "",
    PaxType: "Adult", // Default
    QueryId: queryData?.QueryID || "",
    QuotationNumber: queryData?.QoutationNum || "",
    Title: "",
    FileCode: "F1111N", // Default as per your payload
    Gender: "",
    FirstName: "",
    LastName: "",
    TourId: quotationList?.TourId || queryData?.TourId,
    DateOfBirth: "",
    PassportNumber: ""
  };
};

const GuestListEntry = () => {
  const [formValue, setFormValue] = useState(getDefaultFormValue());
  const [validationErrors, setValidationErrors] = useState({});
  const [initialList, setInitialList] = useState([]);
  const [filterValue, setFilterValue] = useState([]);
  const [filterInput, setFilterInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20); // As per your API

  const handlePageChange = (page) => setCurrentPage(page - 1);
  const handleRowsPerPageChange = (newRowsPerPage) => setRowsPerPage(newRowsPerPage);

  const queryQuotation = JSON.parse(localStorage.getItem("Query_Qoutation"));

  const getListDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("index-guests-lists", {
        id: "",
        QueryId: queryQuotation?.QueryID || "",
        QuotationNumber: queryQuotation?.QoutationNum || "",
        per_page: "20"
      });
      setInitialList(data?.Data || []);
      setFilterValue(data?.Data || []);
    } catch (error) {
      console.log("guestlist-error", error);
      notifyError("Failed to fetch guest list");
    }
  };

  console.log(filterValue, "filterValue");

  useEffect(() => {
    getListDataToServer();
  }, []);

  useEffect(() => {
    const filteredList = initialList?.filter(
      (data) =>
        data?.FirstName?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
        data?.LastName?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
        data?.PassportNumber?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
        data?.Title?.toLowerCase()?.includes(filterInput?.toLowerCase())
    );
    setFilterValue(filteredList);
  }, [filterInput, initialList]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateOfBirth = (date) => {
    if (!date) {
      setFormValue((prev) => ({ ...prev, DateOfBirth: "" }));
      return;
    }

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const formattedDate = `${day}-${month}-${year}`;

    setFormValue((prev) => ({
      ...prev,
      DateOfBirth: formattedDate,
    }));
  };


  // Function to convert YYYY-MM-DD to Excel serial number (correcting for Excel 1900 leap year bug)
  // const dateToExcelSerial = (dateString) => {
  //   if (!dateString) return "";
  //   const date = new Date(dateString);
  //   const timeDiff = date.getTime() - new Date('1900-01-01').getTime();
  //   let days = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1; // +1 for Jan 1, 1900 = 1
  //   // Subtract 1 for the fake Feb 29, 1900 (Excel bug)
  //   if (days > 60) {
  //     days -= 1;
  //   }
  //   return days.toString();
  // };

  // // Function to convert Excel serial to YYYY-MM-DD for display
  // const excelSerialToDate = (serial) => {
  //   if (!serial) return null;
  //   const days = parseInt(serial, 10);
  //   if (isNaN(days)) return null;
  //   // Add back the adjustment for Excel bug
  //   let adjustedDays = days - 1; // -1 for Jan 1 = 1
  //   if (adjustedDays > 59) {
  //     adjustedDays += 1; // Add back the fake day
  //   }
  //   const baseDate = new Date('1899-12-30'); // Standard base for calculation
  //   const date = new Date(baseDate.getTime() + adjustedDays * 86400000);
  //   return date.toISOString().split('T')[0];
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!formValue.PaxType) errors.PaxType = "Pax Type is required.";
    if (!formValue.Title) errors.Title = "Title is required.";
    if (!formValue.Gender) errors.Gender = "Gender is required.";
    if (!formValue.FirstName.trim()) errors.FirstName = "First Name is required.";
    if (!formValue.LastName.trim()) errors.LastName = "Last Name is required.";
    if (!formValue.DateOfBirth) errors.DateOfBirth = "Date of Birth is required.";
    if (!formValue.PassportNumber.trim()) errors.PassportNumber = "Passport Number is required.";

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      notifyError("Please fill in all required fields.");
      return;
    }

    try {
      const payload = { ...formValue };
      // Convert DateOfBirth to Excel serial number for API
      // payload.DateOfBirth = dateToExcelSerial(formValue.DateOfBirth);
      console.log("Payload DateOfBirth:", payload.DateOfBirth); // Debug log

      // Single endpoint for both create and update
      const { data } = await axiosOther.post("store-guests-lists", payload);

      if (data?.status == 1 || data?.Status == 200) {
        getListDataToServer();
        setFormValue(getDefaultFormValue());
        setIsEditing(false);
        setValidationErrors({});
        notifySuccess(data?.Message || data?.message || "Guest saved successfully");
      } else {
        notifyError(data?.Message || data?.message || "Failed to save guest");
      }
    } catch (error) {
      console.log(error);
      notifyError(error?.response?.data?.message || error?.message || "An error occurred");
    }
  };

  const handleEdit = (row) => {
    console.log(row, "ldjfhsdkf");

    setFormValue({
      id: row.id || "",
      PaxType:
        row.PaxType === "FIT"
          ? "1"
          : row.PaxType === "GIT"
            ? "2"
            : row.PaxType === "BHOT"
              ? "3"
              : "",
      QueryId: row.QueryId || queryQuotation?.QueryID || "",
      QuotationNumber: row.QuotationNumber || queryQuotation?.QoutationNum || "",
      Title: row.Title || "",
      FileCode: row.FileCode || "",
      Gender: row.Gender || "",
      FirstName: row.FirstName || "",
      LastName: row.LastName || "",
      TourId: row.TourId || queryQuotation?.TourId || "",
      DateOfBirth: row.DateOfBirth || "",
      PassportNumber: row.PassportNumber || ""
    });
    setIsEditing(true);
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
        const { data } = await axiosOther.post("delete-guests-lists", { id });
        if (data?.Status == 1 || data?.Status == 200) {
          notifySuccess(data?.Message || data?.message || "Guest deleted successfully");
          getListDataToServer();
        } else {
          notifyError(data?.message || data?.Message || "Failed to delete guest");
        }
      } catch (err) {
        console.log(err);
        notifyError(err?.response?.data?.message || err?.message || "An error occurred while deleting");
      }
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsImporting(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('QueryId', queryQuotation?.QueryID || "");
    formData.append('QuotationNumber', queryQuotation?.QoutationNum || "");
    formData.append('FileCode', "F1111N"); // Default or adjust as needed
    formData.append('TourId', queryQuotation?.TourId || "");

    try {
      const { data } = await axiosOther.post("import-guests", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (data?.Status == 1 || data?.status == 1 || data?.Status == 200) {
        notifySuccess(data?.Message || "Guests imported successfully");
        getListDataToServer(); // Refresh the list
        e.target.value = ""; // Reset file input
      } else {
        notifyError(data?.Message || "Failed to import guests");
      }
    } catch (error) {
      console.log(error);
      notifyError(error?.response?.data?.message || "An error occurred while importing");
    } finally {
      setIsImporting(false);
    }
  };

  const handleDownloadSample = async () => {
    try {
      const { data } = await axiosOther.post("sampletourlistexcel");
      if (data?.status == 1 && data?.url) {
        // Create temporary link for download
        const link = document.createElement('a');
        link.href = data.url;
        link.download = 'guestList.xlsx'; // Suggested filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        notifySuccess("Sample file downloaded successfully");
      } else {
        notifyError("Failed to fetch sample file");
      }
    } catch (error) {
      console.log(error);
      notifyError("An error occurred while downloading sample");
    }
  };

  const table_columns = [
    {
      name: "Sr. No.",
      selector: (row, index) => (
        <span className="font-size-11">{currentPage * rowsPerPage + index + 1}</span>
      ),
      sortable: false,
      width: "5rem",
    },
    {
      name: "Pax Type",
      selector: (row) => row?.PaxType,
      cell: (row) => <span>{row?.PaxType}</span>,
      sortable: true,
      minWidth: "8rem",
    },
    {
      name: "Title",
      selector: (row) => row?.Title,
      cell: (row) => <span>{row?.Title}</span>,
      sortable: true,
      minWidth: "8rem",
    },
    {
      name: "Gender",
      selector: (row) => row?.Gender,
      cell: (row) => <span>{row?.Gender}</span>,
      sortable: true,
      minWidth: "8rem",
    },
    {
      name: "First Name",
      selector: (row) => row?.FirstName,
      cell: (row) => <span>{row?.FirstName}</span>,
      sortable: true,
      minWidth: "12rem",
    },
    {
      name: "Last Name",
      selector: (row) => row?.LastName,
      cell: (row) => <span>{row?.LastName}</span>,
      sortable: true,
      minWidth: "12rem",
    },
    {
      name: "Date of Birth",
      selector: (row) => row?.DateOfBirth,
      cell: (row) => {
        const displayDate = row?.DateOfBirth || "";
        return <span>{displayDate}</span>;
      },
      sortable: true,
      minWidth: "10rem",
    },
    {
      name: "Passport Number",
      selector: (row) => row?.PassportNumber,
      cell: (row) => <span>{row?.PassportNumber}</span>,
      sortable: true,
      minWidth: "12rem",
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
    },
  ];

  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header border-0">
              <h4 className="card-title ">Create New Guest</h4>
              {/* Import Button */}
              <div className="d-flex justify-content-end">
                <button className="btn btn-success btn-custom-size me-2" onClick={handleDownloadSample}>
                  <i className="fa-solid fa-download me-1"></i>
                  Download Formate
                </button>
                <input
                  id="import-file"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleImport}
                  style={{ display: 'none' }}
                  disabled={isImporting}
                />
                <label htmlFor="import-file" className="btn btn-success btn-custom-size me-2">
                  {isImporting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1"></span>
                      Importing...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-upload me-1"></i>
                      Import Guests
                    </>
                  )}
                </label>
                <input
                  id="import-file"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleImport}
                  style={{ display: 'none' }}
                  disabled={isImporting}
                />
              </div>
            </div>
            <div className="card-body">
              <div className="form-validation">
                <ToastContainer />
                <form className="form-valide" onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-12">
                      <div className="row form-row-gap">
                        {/* Pax Type - Updated options as per your code */}
                        <div className="col-md-6 col-lg-2">
                          <label htmlFor="PaxType">Pax Type <span className="text-danger">*</span></label>
                          <select
                            className="form-control form-control-sm"
                            name="PaxType"
                            value={formValue.PaxType}
                            onChange={handleFormChange}
                          >
                            <option value="">Select Pax Type</option>
                            <option value="1">FIT</option>
                            <option value="2">GIT</option>
                            <option value="3">BOTH</option>
                          </select>
                          {validationErrors.PaxType && (
                            <small className="text-danger">{validationErrors.PaxType}</small>
                          )}
                        </div>

                        {/* Title */}
                        <div className="col-md-6 col-lg-2">
                          <label htmlFor="Title">Title <span className="text-danger">*</span></label>
                          <select
                            className="form-control form-control-sm"
                            name="Title"
                            value={formValue.Title}
                            onChange={handleFormChange}
                          >
                            <option value="">Select Title</option>
                            <option value="MR">MR</option>
                            <option value="MRS">MRS</option>
                            <option value="MS">MS</option>
                          </select>
                          {validationErrors.Title && (
                            <small className="text-danger">{validationErrors.Title}</small>
                          )}
                        </div>

                        {/* Gender */}
                        <div className="col-md-6 col-lg-2">
                          <label htmlFor="Gender">Gender <span className="text-danger">*</span></label>
                          <select
                            className="form-control form-control-sm"
                            name="Gender"
                            value={formValue.Gender}
                            onChange={handleFormChange}
                          >
                            <option value="">Select Gender</option>
                            <option value="MALE">MALE</option>
                            <option value="FEMALE">FEMALE</option>
                          </select>
                          {validationErrors.Gender && (
                            <small className="text-danger">{validationErrors.Gender}</small>
                          )}
                        </div>

                        {/* First Name */}
                        <div className="col-md-6 col-lg-2">
                          <label htmlFor="FirstName">First Name <span className="text-danger">*</span></label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            name="FirstName"
                            value={formValue.FirstName}
                            onChange={handleFormChange}
                          />
                          {validationErrors.FirstName && (
                            <small className="text-danger">{validationErrors.FirstName}</small>
                          )}
                        </div>

                        {/* Last Name */}
                        <div className="col-md-6 col-lg-2">
                          <label htmlFor="LastName">Last Name <span className="text-danger">*</span></label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            name="LastName"
                            value={formValue.LastName}
                            onChange={handleFormChange}
                          />
                          {validationErrors.LastName && (
                            <small className="text-danger">{validationErrors.LastName}</small>
                          )}
                        </div>

                        {/* Date of Birth */}
                        <div className="col-md-6 col-lg-2">
                          <label htmlFor="DateOfBirth">Date of Birth <span className="text-danger">*</span></label>
                          <DatePicker
                            className="form-control form-control-sm"
                            selected={
                              formValue.DateOfBirth
                                ? new Date(formValue.DateOfBirth.split("-").reverse().join("-"))
                                : null
                            }
                            name="DateOfBirth"
                            onChange={handleDateOfBirth}
                            dateFormat="dd-MM-yyyy"   // Proper display
                            isClearable
                            todayButton="Today"
                            dropdownMode="select"
                            maxDate={new Date()}
                          />

                          {validationErrors.DateOfBirth && (
                            <small className="text-danger">{validationErrors.DateOfBirth}</small>
                          )}
                        </div>

                        {/* Passport Number */}
                        <div className="col-md-6 col-lg-2">
                          <label htmlFor="PassportNumber">Passport Number <span className="text-danger">*</span></label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            name="PassportNumber"
                            value={formValue.PassportNumber}
                            onChange={handleFormChange}
                          />
                          {validationErrors.PassportNumber && (
                            <small className="text-danger">{validationErrors.PassportNumber}</small>
                          )}
                        </div>

                        {/* Buttons */}
                        <div className="col-md-6 col-lg-2 d-flex align-items-end mt-3">
                          <button type="submit" className="btn btn-primary btn-custom-size">
                            {isEditing ? "Update" : "Submit"}
                          </button>
                          <button
                            type="button"
                            className="btn btn-dark btn-custom-size ms-2"
                            onClick={() => {
                              setFormValue(getDefaultFormValue());
                              setIsEditing(false);
                              setValidationErrors({});
                            }}
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

export default GuestListEntry;