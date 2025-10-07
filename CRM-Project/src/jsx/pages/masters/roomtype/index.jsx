import React, { useState, useEffect } from "react";
import "bootstrap-daterangepicker/daterangepicker.css";
import { Dropdown, Tab, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { axiosOther } from "../../../../http/axios_base_url";
import { roomTypeValidationSchema } from "../master_validation.js";
import { roomTypeInitialValue } from "../masters_initial_value.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
import { notifySuccess, notifyError } from "../../../../helper/notify.jsx";
import UseTable from "../../../../helper/UseTable.jsx";
import { wrap } from "framer-motion";

const HotelRoomType = () => {
  const [selectBtn, setSelectBtn] = useState("Newest");
  const [initialList, setInitialList] = useState([]);
  const [formValue, setFormValue] = useState(roomTypeInitialValue);
  const [validationErrors, setValidationErrors] = useState({});
  const [filterValue, setFilterValue] = useState([]);
  const [filterInput, setFiterInput] = useState("");

  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();
  const handlePageChange = (page) => setCurrentPage(page - 1);
  const handleRowsPerPageChange = (newRowsPerPage) =>
    setRowsPerPage(newRowsPerPage);

  const getListDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("roomtypelist");
      setInitialList(data?.DataList);
      setFilterValue(data?.DataList);
    } catch (error) {
      console.log("country-error", error);
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
        data?.MaximumOccupancy?.toLowerCase()?.includes(
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
      sortable: false,
      wrap: true,
      width: "6rem",
    },
    {
      name: "Name",
      selector: (row) => row?.Name,
      cell: (row) => <span>{row?.Name} </span>,
      sortable: true,
    },
    {
      name: "Maximum Occupancy",
      selector: (row) => row?.MaximumOccupancy,
      cell: (row) => <span>{row?.MaximumOccupancy}</span>,
      sortable: true,
      // width: "10rem",
    },
    {
      name: "Bedding",
      selector: (row) => row?.Bedding,
      cell: (row) => <span>{row?.Bedding}</span>,
      sortable: true,
      // minWidth: "6rem",
    },
    {
      name: "Size",
      selector: (row) => row?.Size,
      cell: (row) => <span>{row?.Size}</span>,
      sortable: true,
      // minWidth: "4rem",
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
      // minWidth: "7rem",
    },
    {
      name: "Action",
      selector: (row) => {
        return (
          <div className="d-flex gap-1 sweetalert align-items-center">
            <i
              className="fa-solid fa-pencil cursor-pointer text-success action-icon"
              onClick={() => handleEdit(row)}
            ></i>
            <div className="sweetalert mt-5"></div>
            <i
              className="fa-solid fa-trash-can cursor-pointer text-danger action-icon sweet-confirm"
              onClick={() => handleDelete(row?.id)}
            ></i>
          </div>
        );
      },
      // minWidth: "7rem",
    },
  ];

  // handlign form changes
  const handleFormChange = (e) => {
    const { name, value, files, type } = e.target;

    if (type == "file") {
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

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     await roomTypeValidationSchema.validate(formValue, {
  //       abortEarly: false,
  //     });
  //     setValidationErrors({});
  //     //  console.log(formValue);
  //     const { data } = await axiosOther.post("addupdateroomtype", formValue);
  //     console.log(data, "data1111")
  //     if (data?.Status == 1) {
  //       getListDataToServer();
  //       setFormValue(roomTypeInitialValue);
  //       notifySuccess(data?.message || data?.Message);
  //     }
  //     if (data?.status === "0") {
  //       notifyError(data?.errors || data?.Errors);
  //     }
  //   } catch (error) {
  //     if (error.inner) {
  //       const validationErrorss = error.inner.reduce((acc, curr) => {
  //         acc[curr.path] = curr.message;
  //         return acc;
  //       }, {});
  //       setValidationErrors(validationErrorss);
  //     }

  //     if (error.response?.data?.Errors) {
  //       const data = Object.entries(error.response?.data?.Errors);
  //       notifyError(data[0][1]);
  //     }
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await roomTypeValidationSchema.validate(formValue, {
        abortEarly: false,
      });
      setValidationErrors({});

      const { data } = await axiosOther.post("addupdateroomtype", formValue);
      console.log(data, "data1111");

      if (data?.Status == 1) {
        getListDataToServer();
        setFormValue(roomTypeInitialValue);
        notifySuccess(data?.message || data?.Message);
      }

      if (data?.status === "0") {
        const errorValues = Object.values(data?.errors || data?.Errors || {});
        if (errorValues.length > 0) {
          notifyError(errorValues[0][0]); // ✅ show first error
        } else {
          notifyError("Something went wrong!");
        }
      }
    } catch (error) {
      if (error.inner) {
        const validationErrorss = error.inner.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {});
        setValidationErrors(validationErrorss);
      }

      if (error.response?.data?.errors || error.response?.data?.Errors) {
        const errorValues = Object.values(
          error.response?.data?.errors || error.response?.data?.Errors
        );
        if (errorValues.length > 0) {
          notifyError(errorValues[0][0]); // ✅ show backend error message
        } else {
          notifyError("Something went wrong!");
        }
      }
    }
  };

  const handleEdit = (state) => {
    setFormValue({
      id: state?.id,
      Name: state?.Name,
      MaximumOccupancy: state?.MaximumOccupancy,
      Bedding: state?.Bedding,
      Size: state?.Size,
      Status:
        state?.Status == null || state?.Status == "" ? "Active" : state?.Status,
      AddedBy: state?.AddedBy,
      UpdatedBy: state?.UpdatedBy,
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
        const { data } = await axiosOther.post("deleteroomtype", {
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
  // handlign form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleReset = () => {
    setFormValue(roomTypeInitialValue);
    setValidationErrors({});
    setIsEditing(false);
  };
  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Add Room Type</h4>
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
                      <div className="row form-row-gap align-items-center">
                        <div className="col-md-6 col-lg-2">
                          <div className="d-flex justify-content-between">
                            <label className="" htmlFor="name">
                              Room Name <span className="text-danger">*</span>

                            </label>
                          </div>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="val-username"
                            name="Name"
                            placeholder="Enter Room Name"
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
                            <label className="m-0">
                              Maximum Occupancy{" "}
                              {/* <span className="text-danger">*</span> */}
                            </label>
                          </div>
                          <input
                            type="text"
                            placeholder="Enter  Ocuupancy"
                            className="form-control form-control-sm"
                            name="MaximumOccupancy"
                            value={formValue?.MaximumOccupancy}
                            onChange={handleInputChange}
                          />
                          {/* {validationErrors?.MaximumOccupancy && (
                            <div
                              id="val-username1-error"
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.MaximumOccupancy}
                            </div>
                          )} */}
                        </div>
                        <div className="col-md-6 col-lg-2">
                          <div className="d-flex justify-content-between">
                            <label className="m-0">
                              Bedding 
                              {/* <span className="text-danger">*</span> */}
                            </label>
                          </div>
                          <input
                            type="number"
                            placeholder="Enter Bedding"
                            className="form-control form-control-sm"
                            name="Bedding"
                            value={formValue?.Bedding}
                            onChange={handleInputChange}
                          />
                          {/* {validationErrors?.Bedding && (
                            <div
                              id="val-username1-error"
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.Bedding}
                            </div>
                          )} */}
                        </div>
                        <div className="col-md-6 col-lg-2">
                          <div className="d-flex justify-content-between">
                            <label className="m-0">
                              Size 
                              {/* <span className="text-danger">*</span> */}
                            </label>
                          </div>
                          <input
                            type="number"
                            placeholder="Enter Bedding"
                            className="form-control form-control-sm"
                            name="Size"
                            value={formValue?.Size}
                            onChange={handleInputChange}
                          />
                          {/* {validationErrors?.Size && (
                            <div
                              id="val-username1-error"
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.Size}
                            </div>
                          )} */}
                        </div>
                        <div className="col-md-6 col-lg-2">
                          <div className="d-flex justify-content-between">
                            <label className="" htmlFor="status">
                              Status
                            </label>
                          </div>
                          <select
                            name="Status"
                            id="status"
                            className="form-control form-control-sm"
                            value={formValue?.Status}
                            onChange={handleFormChange}
                          >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        </div>

                        <div className="col-md-6 col-lg-2 d-flex align-items-center mt-3">
                          <button
                            type="submit"
                            className="btn btn-primary btn-custom-size"
                          >
                            Submit
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
export default HotelRoomType;
