import React, { useState, useEffect } from "react";
import "bootstrap-daterangepicker/daterangepicker.css";
import { useNavigate } from "react-router-dom";
import { Dropdown, Tab, Nav } from "react-bootstrap";
import { axiosOther } from "../../../../http/axios_base_url";
import { amentiesValidationSchema } from "../master_validation.js";
import { amentiesInitialValue } from "../masters_initial_value.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
import { notifySuccess, notifyError } from "../../../../helper/notify.jsx";
import UseTable from "../../../../helper/UseTable.jsx";
import { wrap } from "framer-motion";
import { scrollToTop } from "../../../../helper/scrollToTop.js";

const HotelCategory = () => {
  const [selectBtn, setSelectBtn] = useState("Newest");
  const [initialList, setInitialList] = useState([]);
  const [formValue, setFormValue] = useState(amentiesInitialValue);
  const [validationErrors, setValidationErrors] = useState({});
  const [filterValue, setFilterValue] = useState([]);
  const [filterInput, setFiterInput] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handlePageChange = (page) => setCurrentPage(page - 1);
  const handleRowsPerPageChange = (newRowsPerPage) =>
    setRowsPerPage(newRowsPerPage);

  const getListDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("amenitieslist");
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
        data?.SetDefault?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
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
      width: "16rem",
    },
    {
      name: "Name",
      selector: (row) => row?.Name,
      cell: (row) => (
        <span>
          {row?.Name}{" "}
          {row.SetDefault == "Yes" && (
            <i className="mdi mdi-check-circle-outline text-success fs-4"></i>
          )}{" "}
        </span>
      ),
      sortable: true,
      wrap: true,
      width: "16rem",
    },
    {
      name: "Image",
      selector: (row) => row?.ImageName,
      cell: (row) => (
        <span>
          <img
            src={row?.ImageName}
            alt=""
            style={{ height: "30px", width: "30px" }}
          />{" "}
        </span>
      ),
      width: "16rem",
      sortable: true,

    },

    {
      name: "Status",
      selector: (row) => row?.Status,
      cell: (row) => {
        return (
          <span
            className={`badge ${
              row.Status == "Active"
                ? "badge-success light badge"
                : "badge-danger light badge"
            }`}
          >
            {row.Status}
          </span>
        );
      },
      sortable: true,
      width: "15rem",
    },
    {
      name: "Action",
      selector: (row) => {
        return (
          <div className="d-flex gap-1 sweetalert align-items-center">
            <i
              className="fa-solid fa-pencil cursor-pointer text-success action-icon"
              onClick={() => handleEdit(row)}
              onChange={scrollToTop()}
            ></i>
            <div className="sweetalert mt-5"></div>
            <i
              className="fa-solid fa-trash-can cursor-pointer text-danger action-icon sweet-confirm"
              onClick={() => handleDelete(row?.id)}
            ></i>
          </div>
        );
      },
    },
  ];
  const handleReset = () => {
    setFormValue(amentiesInitialValue);
    setValidationErrors({});
    setIsEditing(false);
  };
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
      await amentiesValidationSchema.validate(formValue, {
        abortEarly: false,
        context: { isEditMode: isUpdating },
      });
      setValidationErrors({});
      //  console.log(formValue);
      const { data } = await axiosOther.post("addupdateamenities", formValue);
      if (data?.Status == 1) {
        getListDataToServer();
        setFormValue(amentiesInitialValue);
        setIsUpdating(false);
        notifySuccess(data?.message || data?.Message);
        //   alert(data?.Message || data?.message);
      }

      if (data?.Status != 1) {
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

      if (error.response?.data?.Errors) {
        const data = Object.entries(error.response?.data?.Errors);
        notifyError(data[0][1]);
      }
    }
  };
  const credential = localStorage.getItem("token");
  const authData = JSON.parse(credential);
  const handleEdit = (rowData) => {
    setIsUpdating(true);
    setFormValue({
      id: rowData?.id,
      Name: rowData?.Name,
      SetDefault: rowData?.SetDefault == "Yes" ? "1" : "0",
      ImageName: rowData?.ImageName,
      ImageData: "",
      Status:
        rowData?.Status == null || rowData?.Status == ""
          ? "Active"
          : rowData?.Status,
      AddedBy: rowData?.AddedBy,
      UpdatedBy: authData?.UserID != null ? authData?.UserID?.toString() : "0",
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
        const { data } = await axiosOther.post("deleteamenities", {
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

  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Add Amenities</h4>
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
                      <div className="row form-row-gap">
                        <div className="col-md-6 col-lg-3">
                          <div className="d-flex justify-content-between">
                            <label className="" htmlFor="name">
                              Category Name
                              <span className="text-danger">*</span>
                            </label>
                          </div>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="val-username"
                            name="Name"
                            placeholder="Enter Ameties Name"
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
                          <div className="d-flex justify-content-between">
                            <label className="" htmlFor="name">
                              Amenities Image
                              <span className="text-danger">*</span>
                            </label>
                          </div>
                          <input
                            type="file"
                            className="form-control form-control-sm"
                            id="val-username"
                            name="ImageData"
                            onChange={handleFormChange}
                          />
                          {validationErrors?.ImageData && (
                            <div
                              id="val-username1-error"
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.ImageData}
                            </div>
                          )}
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
export default HotelCategory;
