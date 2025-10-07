import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap-daterangepicker/daterangepicker.css";
import { Tab, Nav } from "react-bootstrap";
import { axiosOther } from "../../../../http/axios_base_url";
import { paxSlabValidationSchema } from "../master_validation.js";
import { paxSlabInitialValue } from "../masters_initial_value.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
import { notifySuccess, notifyError } from "../../../../helper/notify.jsx";
import UseTable from "../../../../helper/UseTable.jsx";
import { scrollToTop } from "../../../../helper/scrollToTop.js";

const PaxSlab = () => {
  const [selectBtn, setSelectBtn] = useState("Newest");
  const [initialList, setInitialList] = useState([]);

  const [formValue, setFormValue] = useState(paxSlabInitialValue);
  const [validationErrors, setValidationErrors] = useState({});
  const [filterValue, setFilterValue] = useState([]);
  const [filterInput, setFiterInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  const handlePageChange = (page) => setCurrentPage(page - 1);
  const handleRowsPerPageChange = (newRowsPerPage) =>
    setRowsPerPage(newRowsPerPage);

  const getListDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("paxslablist");
      setInitialList(data?.DataList);
      setFilterValue(data?.DataList);
    } catch (error) {
      console.log("pax-error", error);
    }


  };

  useEffect(() => {
    getListDataToServer();
  }, []);

  useEffect(() => {
    const filteredList = initialList?.filter(
      (data) =>
        data?.Name?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
        data?.ShortName?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
        data?.Status?.toLowerCase()?.includes(filterInput?.toLowerCase())
    );
    setFilterValue(filteredList);
  }, [filterInput]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let Id = null
    try {
      const token = localStorage.getItem("token");
      const persed = JSON.parse(token)
      console.log(persed, "persed")
      Id = persed?.companyKey


      console.log(Id, "id1")

    } catch (error) {
      console.log(error, "error")

    }
    try {
      await paxSlabValidationSchema.validate(formValue, {
        abortEarly: false,
      });
      setValidationErrors({});
      const { data } = await axiosOther.post("addupdatepaxslab", {
        ...formValue,
        CompanyId: Id
      });
      if (data?.Status === 1) {
        getListDataToServer();
        setIsEditing(false);
        setFormValue(paxSlabInitialValue);
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
      CompanyId: value?.CompanyId,
      // UserId: value?.UserId,
      Min: value?.Min,
      Max: value?.Max,
      DividingFactor: value?.DividingFactor,
      Default: value?.Default,
      Type: value?.Type,
      // NoOfAdults: value?.PaxDetails?.NoOfAdults,
      // NoOfChilds: value?.PaxDetails?.NoOfChilds,
      // SingleRoom: value?.PaxDetails?.SingleRoom,
      // DoubleRoom: value?.PaxDetails?.DoubleRoom,
      // TripleRoom: value?.PaxDetails?.TripleRoom,
      // TwinRoom: value?.PaxDetails?.TwinRoom,
      // ExtraBed: value?.PaxDetails?.ExtraBed,
      // ChildWithBed: value?.PaxDetails?.ChildWithBed,
      // CnBed: value?.PaxDetails?.CnBed,
      Status: value?.Status === "Active" ? "1" : "0",
      AddedBy: value?.AddedBy,
      UpdatedBy: "1",
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
        const { data } = await axiosOther.post("deletepaxslab", { id });
        if (data?.Status == 1 || data?.status == 1 || data?.result) {
          notifySuccess(data?.Message || data?.message || data?.result);
          getListDataToServer();
        }
      } catch (err) {
        notifyError(err?.message || err?.Message);
      }
    }
  };

  const handleReset = () => {
    setFormValue(paxSlabInitialValue);
    setValidationErrors({});
    setIsEditing(false);
  };

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
      name: "Min Pax",
      selector: (row) =>row?.Min,
      cell: (row) => <span>{row?.Min}</span>,
      sortable: true,

    },
    {
      name: "Max Pax",
      selector: (row) =>row?.Max,
      cell: (row) => <span>{row?.Max}</span>,
      sortable: true,

    },
    {
      name: "Dividing Factor",
      selector: (row) =>row?.DividingFactor,
      cell: (row) => <span>{row?.DividingFactor}</span>,
      sortable: true,

    },
    {
      name: "Default",
      selector: (row) =>row?.Default,
      cell: (row) => <span>{row?.Default}</span>,
      sortable: true,

    },
    {
      name: "Type",
      selector: (row) =>row?.Type,
      cell: (row) => <span>{row?.Type}</span>,
      sortable: true,

    },

    {
      name: "Status",
      selector: (row) =>row.Status,
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

    },
  ];
  console.log(formValue, "formval")
  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">
                {isEditing ? "Update Pax Slab " : "Add Pax Slab"}
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
                    <div className="col-12 d-flex">
                      <div className="row form-row-gap">
                        <div className="col-4 col-sm-3 col-md-2">
                          <label htmlFor="name">
                            Min Pax
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="number"
                            className={`form-control form-control-sm ${validationErrors?.Name ? "is-invalid" : ""
                              }`}
                            name="Min"
                            placeholder="Min Pax"
                            value={formValue?.Min}
                            onChange={handleFormChange}
                          />
                          {validationErrors?.Min && (
                            <div
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.Min}
                            </div>
                          )}
                        </div>
                        <div className="col-4 col-sm-3 col-md-2">
                          <label htmlFor="name">
                            Max Pax
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="number"
                            className={`form-control form-control-sm ${validationErrors?.Max ? "is-invalid" : ""
                              }`}
                            name="Max"
                            placeholder="Max Pax"
                            value={formValue?.Max}
                            onChange={handleFormChange}
                          />
                          {validationErrors?.Max && (
                            <div
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.Max}
                            </div>
                          )}
                        </div>
                        <div className="col-4 col-sm-3 col-md-2">
                          <label htmlFor="name">
                            Dividing Factor
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="number"
                            className={`form-control form-control-sm ${validationErrors?.DividingFactor
                              ? "is-invalid"
                              : ""
                              }`}
                            name="DividingFactor"
                            placeholder="Factor"
                            value={formValue?.DividingFactor}
                            onChange={handleFormChange}
                          />
                          {validationErrors?.DividingFactor && (
                            <div
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.DividingFactor}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6 col-lg-2">
                          <label>Default</label>
                          <div className="d-flex gap-3">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="Default"
                                id="default_yes"
                                value="Yes"
                                checked={formValue?.Default.includes("Yes")}
                                onChange={handleFormChange}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="default_yes"
                              >
                                Yes
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="Default"
                                id="default_no"
                                value="No"
                                checked={formValue?.Default?.includes("No")}
                                onChange={handleFormChange}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="default_no"
                              >
                                No
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 col-lg-2">
                          <label>Type</label>
                          <div className="d-flex gap-3">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="Type"
                                id="default_GIT"
                                value="GIT"
                                checked={formValue?.Type.includes("GIT")}
                                onChange={handleFormChange}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="GIT"
                              >
                                GIT
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="Type"
                                id="default_FIT"
                                value="FIT"
                                checked={formValue?.Type?.includes("FIT")}
                                onChange={handleFormChange}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="FIT"
                              >
                                FIT
                              </label>
                            </div>
                          </div>
                        </div>


                        {/* <div className="col-4 col-sm-3 col-md-2">
                          <label htmlFor="name">
                            No Of Adult
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="number"
                            className={`form-control form-control-sm ${
                              validationErrors?.NoOfAdults ? "is-invalid" : ""
                            }`}
                            name="NoOfAdults"
                            placeholder="Adult"
                            value={formValue?.NoOfAdults}
                            onChange={handleFormChange}
                          />
                          {validationErrors?.NoOfAdults && (
                            <div
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.NoOfAdults}
                            </div>
                          )}
                        </div>
                        <div className="col-4 col-sm-3 col-md-2">
                          <label htmlFor="name">
                            No Of Child
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="number"
                            className={`form-control form-control-sm ${
                              validationErrors?.NoOfChilds ? "is-invalid" : ""
                            }`}
                            name="NoOfChilds"
                            placeholder="Child"
                            value={formValue?.NoOfChilds}
                            onChange={handleFormChange}
                          />
                          {validationErrors?.NoOfChilds && (
                            <div
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.NoOfChilds}
                            </div>
                          )}
                        </div>
                        <div className="col-4 col-sm-3 col-md-2">
                          <label htmlFor="name">
                            SGL Room
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="number"
                            className={`form-control form-control-sm ${
                              validationErrors?.SingleRoom ? "is-invalid" : ""
                            }`}
                            name="SingleRoom"
                            placeholder="SGL"
                            value={formValue?.SingleRoom}
                            onChange={handleFormChange}
                          />
                          {validationErrors?.SingleRoom && (
                            <div
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.SingleRoom}
                            </div>
                          )}
                        </div>
                        <div className="col-4 col-sm-3 col-md-2">
                          <label htmlFor="name">
                            DBL Room
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="number"
                            className={`form-control form-control-sm ${
                              validationErrors?.DoubleRoom ? "is-invalid" : ""
                            }`}
                            name="DoubleRoom"
                            placeholder="DBL"
                            value={formValue?.DoubleRoom}
                            onChange={handleFormChange}
                          />
                          {validationErrors?.DoubleRoom && (
                            <div
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.DoubleRoom}
                            </div>
                          )}
                        </div>
                        <div className="col-4 col-sm-3 col-md-2">
                          <label htmlFor="name">
                            TPL Room
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="number"
                            className={`form-control form-control-sm ${
                              validationErrors?.TripleRoom ? "is-invalid" : ""
                            }`}
                            name="TripleRoom"
                            placeholder="TPL"
                            value={formValue?.TripleRoom}
                            onChange={handleFormChange}
                          />
                          {validationErrors?.TripleRoom && (
                            <div
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.TripleRoom}
                            </div>
                          )}
                        </div>
                        <div className="col-4 col-sm-3 col-md-2">
                          <label htmlFor="name">
                            Twin Room
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="number"
                            className={`form-control form-control-sm ${
                              validationErrors?.TwinRoom ? "is-invalid" : ""
                            }`}
                            name="TwinRoom"
                            placeholder="Twin"
                            value={formValue?.TwinRoom}
                            onChange={handleFormChange}
                          />
                          {validationErrors?.TwinRoom && (
                            <div
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.TwinRoom}
                            </div>
                          )}
                        </div>
                        <div className="col-4 col-sm-3 col-md-2">
                          <label htmlFor="name">
                            Extra Bed(A)
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="number"
                            className={`form-control form-control-sm ${
                              validationErrors?.ExtraBed ? "is-invalid" : ""
                            }`}
                            name="ExtraBed"
                            placeholder="Extra"
                            value={formValue?.ExtraBed}
                            onChange={handleFormChange}
                          />
                          {validationErrors?.ExtraBed && (
                            <div
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.ExtraBed}
                            </div>
                          )}
                        </div>

                        <div className="col-4 col-sm-3 col-md-2">
                          <label htmlFor="name">
                            CW BED
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="number"
                            className={`form-control form-control-sm ${
                              validationErrors?.ChildWithBed ? "is-invalid" : ""
                            }`}
                            name="ChildWithBed"
                            placeholder="CW"
                            value={formValue?.ChildWithBed}
                            onChange={handleFormChange}
                          />
                          {validationErrors?.ChildWithBed && (
                            <div
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.ChildWithBed}
                            </div>
                          )}
                        </div>

                        <div className="col-4 col-sm-3 col-md-2">
                          <label htmlFor="name">
                            CN Bed
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="number"
                            className={`form-control form-control-sm ${
                              validationErrors?.CnBed ? "is-invalid" : ""
                            }`}
                            name="CnBed"
                            placeholder="CN"
                            value={formValue?.CnBed}
                            onChange={handleFormChange}
                          />
                          {validationErrors?.CnBed && (
                            <div
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.CnBed}
                            </div>
                          )}
                        </div> */}
                        <div className="col-4 col-sm-3 col-md-2">
                          <label>Status</label>
                          <select
                            name="Status"
                            className="form-control form-control-sm"
                            value={formValue?.Status}
                            onChange={handleFormChange}
                          >
                            <option value="0">Inactive</option>
                            <option value="1">Active</option>

                          </select>
                        </div>
                        {/* <div className="col-2 d-flex align-items-end">
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
                        </div> */}
                      </div>
                      <div className="col-2 d-flex align-items-end justify-content-end ms-auto">
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

export default PaxSlab;
