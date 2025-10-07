import React, { useState, useRef, useEffect, useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "bootstrap-daterangepicker/daterangepicker.css";
import { Dropdown, Tab, Nav, Button, ToastContainer } from "react-bootstrap";
import { useTable, useSortBy } from "react-table";
import { airlineMasterInitialValue } from "../masters_initial_value";
import { airlineMasterValidationSchema } from "../master_validation";
import { axiosOther } from "../../../../http/axios_base_url";
import { table_custom_style } from "../../../../css/custom_style";
import DataTable from "react-data-table-component";
import { notifyError, notifySuccess } from "../../../../helper/notify";
import UseTable from "../../../../helper/UseTable.jsx";
import { scrollToTop } from "../../../../helper/scrollToTop.js";

const Airline = () => {
  const [selectBtn, setSelectBtn] = useState("Newest");
  const [validationErrors, setValidationErrors] = useState({});
  const [formValue, setFormValue] = useState(airlineMasterInitialValue);
  const [initialList, setInitialList] = useState([]);
  const [filterValue, setFilterValue] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [filterInput, setFiterInput] = useState("");
  const [currentPage, setCurrentPage] = useState(0); // Page index
  const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const handlePageChange = (page) => setCurrentPage(page - 1);
  const handleRowsPerPageChange = (newRowsPerPage) =>
    setRowsPerPage(newRowsPerPage);
  const data = []; // Replace with your data
  const totalRows = 10; // Replace with your total rows count
  const getListDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("airlinemasterlist");
      setInitialList(data?.DataList);
      setFilterValue(data?.DataList);
    } catch (error) {
      console.log("country-error", error);
    }
  };

  useEffect(() => {
    getListDataToServer();
  }, []);

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
      setFormValue({
        ...formValue,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await airlineMasterValidationSchema.validate(
        { ...formValue },
        { abortEarly: false }
      );
      // console.log(formValue);
      setValidationErrors({});
      try {
        const { data } = await axiosOther.post("addupdateairlinemaster", {
          ...formValue,
        });

        if (data?.Status == 1 || data?.status == 1) {
          notifySuccess(data?.Message || data?.message);
          setFormValue(airlineMasterInitialValue);
          setIsEditing(false);
          getListDataToServer();
          handleResetImageValue();
        }
      } catch (error) {
        console.log("country-error", error);
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

  const handleEditData = (rowData) => {
    // console.log(rowData);
    setFormValue({
      id: rowData?.id,
      Name: rowData?.Name,
      // ImageName: rowData?.ImageName,
      ImageData: rowData?.ImageName,
      Status: rowData?.Status === "Active" ? "1" : "0",
      UpdatedBy: rowData?.UpdatedBy,
      AddedBy: rowData?.AddedBy,
      cutofdayFIT: rowData?.cutofdayFIT,
      cutofdayGIT: rowData?.cutofdayGIT,
    });
    setIsEditing(true);
  };

  // const handleDeleteData = (id) => {
  //   const deleteData = window.confirm("Are you sure you want to delete?");
  //   if (deleteData) {
  //     handleDelete(id);
  //   }
  // };
  useEffect(() => {
    const filteredList = initialList?.filter(
      (data) =>
        data?.Name?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
        //  data?.SetDefault?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
        data?.Status?.toLowerCase()?.includes(filterInput?.toLowerCase())
    );
    setFilterValue(filteredList);
  }, [filterInput]);
  // const handleDelete = async (id) => {
  //   try {
  //     const { data } = await axiosOther.post("deleteairline", {
  //       id: id,
  //     });
  //     // console.log("delete-response", data);
  //     if (data) {
  //       alert(data?.result);
  //       getListDataToServer();
  //     }
  //   } catch (err) {
  //     if (err) {
  //       alert(err?.message);
  //     }
  //   }
  // };
   const handleDelete = async (id) => {
      const confirmation = await swal({
        title: "Are you sure want to Delete?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      });
  
      if (confirmation) {
        try {
          const { data } = await axiosOther.post("deleteairline", {
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
      name: "Image",
      selector: (row) => row?.ImageName,
      cell: (row) => (
        <span>
          <img
            src={row.ImageName}
            style={{ height: "50px", width: "50px", objectFit: "contain" }}
            alt="image"
            className="height-30 width-30"
          ></img>
        </span>
      ),
      sortable: true,
    },
    {
      name: "Airline Name",
      selector: (row) => row?.Name,
      cell: (row) => <span>{row.Name}</span>,
      sortable: true,
    },
    {
      name: "Rate",
      selector: (row) => (
        <NavLink to={`/airline/rate/${row?.id}`} state={{ Name: row?.Name }}>
          <Button variant="dark light py-1 rounded-pill"><span>View/Add</span></Button>
        </NavLink>
      ),
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
          <span className="d-flex gap-1">
            <i
              className="fa-solid fa-pencil cursor-pointer action-icon text-success"
              data-toggle="modal"
              data-target="#modal_form_vertical"
              onClick={() => handleEditData(row)}
              onChange={scrollToTop()}
            ></i>
            <i
              className="fa-solid fa-trash-can cursor-pointer text-danger action-icon"
              onClick={() => handleDelete(row?.id)}
            ></i>
          </span>
        );
      },
    },
  ];

  const handleResetImageValue = () => {
    fileInputRef.current.value = "";
  };
  const handleReset = () => {
    fileInputRef.current.value = "";
    setFormValue(airlineMasterInitialValue);
    setValidationErrors({});
    handleResetImageValue();
    setIsEditing(false);
  };

  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">
                {isEditing ? "Update Airline" : "Add Airline"}
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
              <ToastContainer />
              <div className="form-validation">
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
                            Airline Name
                            <span className="text-danger">*</span>
                          </label>

                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="val-username"
                            name="Name"
                            placeholder="Enter a username.."
                            value={formValue?.Name}
                            onChange={handleFormChange}
                          />
                          {validationErrors?.Name && (
                            <span className="text-danger font-size-10">
                              {validationErrors?.Name}
                            </span>
                          )}
                        </div>
                        <div className="col-md-6 col-lg-3">
                          <label className="" htmlFor="val-username">
                            Photo
                          </label>
                          <input
                            ref={fileInputRef}
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

                        <div className="col-md-6 col-lg-3 d-flex align-items-end">
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
          <div className="d-flex align-items-center mb-2 flex-wrap">
            <div className="newest ms-3"></div>
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
export default Airline;
