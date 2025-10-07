import React, { useState, useRef, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap-daterangepicker/daterangepicker.css";
import { Dropdown, Tab, Nav } from "react-bootstrap";
import { axiosOther } from "../../../../http/axios_base_url";
import { useTable, useSortBy } from "react-table";
import "react-toastify/dist/ReactToastify.css";
import { vehicleMasterInitialValue } from "../masters_initial_value";
import { vehicleMasterValidationSchema } from "../master_validation";
import { ToastContainer } from "react-toastify";
import UseTable from "../../../../helper/UseTable";
import swal from "sweetalert";
import { notifySuccess, notifyError } from "../../../../helper/notify.jsx";

//Images
import pic1 from "../../../../images/avatar/1.jpg";
import pic2 from "../../../../images/avatar/2.jpg";
import pic3 from "../../../../images/avatar/3.jpg";
import pic4 from "../../../../images/avatar/4.jpg";
import pic5 from "../../../../images/avatar/5.jpg";
import pic6 from "../../../../images/avatar/6.jpg";
// deleteamenities

const Vehicle = () => {
  const [selectBtn, setSelectBtn] = useState("Newest");
  const [initialList, setInitialList] = useState([]);
  const [formValue, setFormValue] = useState(vehicleMasterInitialValue);
  const [validationErrors, setValidationErrors] = useState({});
  const [vehicleTypeList, setVehicleTypeList] = useState([]);
  const [vehicleBrandList, setVehicleBrandList] = useState([]);
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
      const { data } = await axiosOther.post("vehiclemasterlist");
      // console.log("initial-list", data);
      setInitialList(data?.DataList);
      setFilterValue(data?.DataList);
    } catch (error) {
      console.log("country-error", error);
    }
  };

  useEffect(() => {
    getListDataToServer();
  }, []);

  const getDropdownDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("vehicletypemasterlist", {
        Search: "",
        Status: 1,
      });
      setVehicleTypeList(data.DataList);
    } catch (err) {
      console.log(err);
    }

    try {
      const { data } = await axiosOther.post("vehiclebrandmasterlist", {
        Search: "",
        Status: 1,
      });
      setVehicleBrandList(data.DataList);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getDropdownDataToServer();
  }, []);

  const handleReset = () => {
    setFormValue(vehicleMasterInitialValue);
    setValidationErrors({});
    setIsEditing(false);
  };

  useEffect(() => {
    getListDataToServer();
  }, []);

  // Active data

  // use effect

  // Active pagginarion

  // Active paggination & chage data

  // console.log(document.querySelectorAll(".sorting_1 input")[0].checked);

  const handleEdit = (value) => {
    setFormValue({
      id: value?.id,
      Name: value?.Name,
      VehicleType: value?.VehicleTypeId,
      Capacity: value?.Capacity,
      VehicleBrand: value?.VehicleBrandId,
      ImageName: "",
      ImageData: value?.ImageName,
      Status: value?.Status == "Active" ? 1 : 0,
      AddedBy: value?.AddedBy,
      UpdatedBy: value?.UpdatedBy,
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
        const { data } = await axiosOther.post("deletevehiclemaster", {
          id,
        });
        if (
          data?.Status == 1 ||
          data?.status == 1 ||
          data?.result ||
          data?.message
        ) {
          notifySuccess(data?.Message || data?.message || data?.result);
          getListDataToServer();
        }
      } catch (err) {
        if (err) {
          notifyError(err?.message || err?.Message);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await vehicleMasterValidationSchema.validate(formValue, {
        abortEarly: false,
      });
      setValidationErrors({});
      // console.log("value", formValue);
      const { data } = await axiosOther.post(
        "addupdatevehiclemaster",
        formValue
      );
      // console.log("reponse", data);
      if (data?.Status == 1 || data?.status == 1) {
        getListDataToServer();
        setFormValue(vehicleMasterInitialValue);
        notifySuccess(data?.message || data?.Message);
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
      sortable: false,
      width: "6rem",
    },
    {
      name: "Id",
      selector: (row) => row?.id,
      cell: (row) => <span>{row?.id}</span>,
      sortable: true,
      width: "5rem",
    },
    {
      name: "Vehicle Name",
      selector: (row) => row?.Name,
      cell: (row) => <span>{row?.Name}</span>,
      sortable: true,
    },
    {
      name: "Vehicle Type",
      selector: (row) => row?.VehicleType,
      cell: (row) => <span>{row?.VehicleType}</span>,
      sortable: true,
    },
    {
      name: "Capacity",
      selector: (row) => row?.Capacity,
      cell: (row) => <span>{row?.Capacity}</span>,
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
      name: "Vehicle Brand",
      selector: (row) => row?.VehicleBrand,
      cell: (row) => <span>{row?.VehicleBrand}</span>,
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
      width: "7rem",
    },
    {
      name: "Action",
      selector: (row) => (
        <div className="d-flex gap-1 sweetalert align-items-center">
          <i
            className="fa-solid fa-pencil cursor-pointer text-success action-icon"
            onClick={() => handleEdit(row)}
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
              <h4 className="card-title">Add Vehicle</h4>
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
                        <div className="col-md-6 col-lg-3">
                          <label className="" htmlFor="name">
                            Vehicle Name
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="val-username"
                            name="Name"
                            placeholder="Vehicle Name"
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
                        <div className="col-md-6 col-lg-3">
                          <label className="" htmlFor="">
                            Vehicle Type
                          </label>
                          <select
                            name="VehicleType"
                            id="status"
                            className="form-control form-control-sm"
                            value={formValue?.VehicleType}
                            onChange={handleFormChange}
                          >
                            <option value="">Select</option>
                            {vehicleTypeList?.map((vehicle) => {
                              return (
                                <option value={vehicle.id} key={vehicle.id}>
                                  {vehicle.Name}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                        <div className="col-md-6 col-lg-3">
                          <label className="" htmlFor="name">
                            Capacity
                          </label>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            id="val-username"
                            name="Capacity"
                            placeholder="Capacity"
                            value={formValue?.Capacity}
                            onChange={handleFormChange}
                          />
                        </div>
                        <div className="col-md-6 col-lg-3">
                          <label className="" htmlFor="status">
                            Vehicle Brand
                          </label>
                          <select
                            name="VehicleBrand"
                            id="status"
                            className="form-control form-control-sm"
                            value={formValue?.VehicleBrand}
                            onChange={handleFormChange}
                          >
                            <option value="">Select</option>
                            {vehicleBrandList?.map((vehicle) => {
                              return (
                                <option value={vehicle.id} key={vehicle.id}>
                                  {vehicle.Name}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                        <div className="col-md-6 col-lg-3">
                          <label className="" htmlFor="name">
                            Vehicle Image
                          </label>
                          <input
                            type="file"
                            className="form-control form-control-sm"
                            id="val-username"
                            name="ImageData"
                            placeholder="Capicity"
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

                        <div className="col-md-6 col-lg-3 d-flex align-items-end">
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

export default Vehicle;
