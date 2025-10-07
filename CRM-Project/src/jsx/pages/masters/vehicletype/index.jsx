// @ts-nocheck
import React, { useState, useRef, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap-daterangepicker/daterangepicker.css";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
import { ToastContainer } from "react-toastify";
import { notifySuccess, notifyError } from "../../../../helper/notify";
import UseTable from "../../../../helper/UseTable";
import { Tab, Nav } from "react-bootstrap";
import { axiosOther } from "../../../../http/axios_base_url";
import { vehicleTypeInitialValue } from "../masters_initial_value";
import { vehicleTypeValidationSchema } from "../master_validation";
import { scrollToTop } from "../../../../helper/scrollToTop";

const VehicleType = () => {
  const [selectBtn, setSelectBtn] = useState("Newest");
  const [initialList, setInitialList] = useState([]);
  const [formValue, setFormValue] = useState(vehicleTypeInitialValue);
  const [validationErrors, setValidationErrors] = useState({});
  const [filterValue, setFilterValue] = useState([]);
  const [filterInput, setFiterInput] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const formRef = useRef(null); // Ref for the form
  const handlePageChange = (page) => setCurrentPage(page - 1);
  const handleRowsPerPageChange = (newRowsPerPage) =>
    setRowsPerPage(newRowsPerPage);
  const navigate = useNavigate();
  const getListDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("vehicletypemasterlist");
      setInitialList(data?.DataList);
      setFilterValue(data?.DataList);
    } catch (error) {
      console.log("country-error", error);
    }
  };

  useEffect(() => {
    getListDataToServer();
  }, []);

  useEffect(() => {
    getListDataToServer();
  }, []);

  // Active data

  // use effect

  // Active pagginarion

  // Active paggination & chage data

  const handleReset = () => {
    setFormValue(vehicleTypeInitialValue);
    setValidationErrors({});
    setIsEditing(false);
  };

  // handlign form changes
  // const handleFormChange = (e) => {
  //   const { name, value, files, type } = e.target;

  //   if (type == "file") {
  //     const file = files[0];
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       const base64 = reader.result;
  //       const base64String = base64.split(",")[1];
  //       setFormValue((prev) => ({
  //         ...prev,
  //         images: [...(prev.images || []), ...fileArray], // Store File objects
  //       }));
  //     };
  //     reader.readAsDataURL(file);
  //   } else {
  //     setFormValue((prev) => ({
  //       ...prev,
  //       [name]: value,
  //     }));
  //   }
  // };
  const handleFormChange = (e) => {
    const { name, value, files, type } = e.target;

    if (type == "file") {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result;
        const base64String = base64.split(",")[1];
        setFormValue((prev) => ({
          ...prev,
          images: [...(prev.images || []), file], // Store File objects directly
          ImageData: base64String, // Also store base64 string if needed
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormValue((prev) => ({
        ...prev,
        [name]: value,
      }));
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
        const { data } = await axiosOther.post("deletevehicletypemaster", {
          id,
        });
        if (
          data?.Status === 1 ||
          data?.status === 1 ||
          data?.result ||
          data?.message
        ) {
          notifySuccess(
            data?.Message || data?.message || "Deleted successfully"
          );

          getListDataToServer();
        }
      } catch (err) {
        if (err) {
          notifyError(err?.message || err?.Message || err?.result);
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

  const handleEdit = (value) => {
    setFormValue({
      id: value?.id,
      Name: value?.Name,
      PaxCapacity: value?.PaxCapacity,
      Status: value?.Status == "Active" ? 1 : 0,
      ImageData: value?.ImageName,
      ImageName: "",
      AddedBy: value?.AddedBy,
      UpdatedBy: value?.UpdatedBy,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await vehicleTypeValidationSchema.validate(formValue, {
        abortEarly: false,
      });
      setValidationErrors({});
      // console.log("value", formValue);
      const { data } = await axiosOther.post(
        "addupdatevehicletypemaster",
        formValue
      );
      // console.log("reponse", data);
      if (data?.Status == 1 || data?.status == 1) {
        getListDataToServer();
        setFormValue(vehicleTypeInitialValue);
        notifySuccess(data?.message || data?.Message || data?.result);
      } else {
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

      if (error.response?.data?.Errors || error.response?.data?.errors) {
        const data = Object.entries(
          error.response?.data?.Errors || error.response?.data?.errors
        );
        notifyError(data[0][1]);
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
      width: "8rem",
    },
    {
      name: "Id",
      selector: (row) => row?.id,
      cell: (row) => {
        // console.log(row, "dkjidfdifj");
        return <span>{row?.id}</span>;
      },
      sortable: true,
      width: "8rem",
    },
    {
      name: "Vehicle Name",
      selector: (row) => row?.Name,
      cell: (row) => <span>{row?.Name}</span>,
      sortable: true,
    },

    {
      name: "Capacity",
      selector: (row) => row?.PaxCapacity,
      cell: (row) => <span>{row?.PaxCapacity}</span>,
      sortable: true,
    },
    {
      name: "Photo",
      selector: (row) => row?.ImageName,
      cell: (row) => (
        <img
          src={row?.ImageName}
          alt={row?.ImageData}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = fallback;
          }}
          style={{ height: "30px", width: "30px" }}
        ></img>
      ),
      sortable: true,
    },
    {
      name: "Pax Type",
      selector: (row) => row?.PaxType,
      cell: (row) => <span>{row?.PaxType}</span>,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row?.Status,
      cell: (row) => (
        <span
          className={`badge ${
            row.Status === "Active"
              ? "badge-success light badge"
              : "badge-danger light badge"
          }`}
        >
          {row.Status}
        </span>
      ),
      sortable: true,
      width: "7rem",
    },
    {
      name: "Action",
      selector: (row) => (
        <div className="d-flex gap-1 sweetalert align-items-center">
          <i
            className="fa-solid fa-pencil cursor-pointer text-success action-icon"
            onClick={() => handleEdit(row)}
            onChange={scrollToTop()}
          ></i>
          <i
            className="fa-solid fa-trash-can cursor-pointer text-danger action-icon sweet -confirm"
            onClick={() => handleDelete(row?.id)}
          ></i>
        </div>
      ),
      width: "7rem",
    },
  ];
  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Add Vehicle Type</h4>
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
                  <div className="row form-row-gap">
                    <div className="col-12">
                      <div className="row form-row-gap">
                        <div className="col-md-6 col-lg-2">
                          <div className="d-flex justify-content-between">
                            <label className="" htmlFor="name">
                              Vehicle Type
                              <span className="text-danger">*</span>
                            </label>
                          </div>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="val-username"
                            name="Name"
                            placeholder="Vehicle Type"
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
                              Capacity
                              <span className="text-danger">*</span>
                            </label>
                          </div>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            id="val-username"
                            name="PaxCapacity"
                            placeholder="Capicity"
                            value={formValue?.PaxCapacity}
                            onChange={handleFormChange}
                          />
                        </div>
                        <div className="col-md-6 col-lg-2">
                          <div className="d-flex justify-content-between">
                            <label className="" htmlFor="name">
                              Vehicle Image
                              <span className="text-danger">*</span>
                            </label>
                          </div>
                          <input
                            type="file"
                            className="form-control form-control-sm"
                            id="val-username"
                            name="ImageData"
                            placeholder="Capicity"
                            onChange={handleFormChange}
                          />
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
                        <div className="col-md-6 col-lg-2">
                          <label>Pax Type</label>
                          <div className="d-flex gap-3">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="PaxType"
                                id="GIT"
                                value="GIT"
                                checked={formValue?.PaxType === "GIT"}
                                onChange={handleFormChange}
                              />
                              <label className="form-check-label" htmlFor="GIT">
                                GIT
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="PaxType"
                                id="FIT"
                                value="FIT"
                                checked={formValue?.PaxType === "FIT"}
                                onChange={handleFormChange}
                              />
                              <label className="form-check-label" htmlFor="FIT">
                                FIT
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="PaxType"
                                id="Both"
                                value="Both"
                                checked={formValue?.PaxType === "Both"}
                                onChange={handleFormChange}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="Both"
                              >
                                BOTH
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6 col-lg-2 d-flex align-items-end">
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

export default VehicleType;
