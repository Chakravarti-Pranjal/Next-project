import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap-daterangepicker/daterangepicker.css";
import { Dropdown, Tab, Nav, Button } from "react-bootstrap";
import { axiosOther } from "../../../../../http/axios_base_url";
import { sightseeingValidationSchema } from "../../master_validation.js";
import { sightseeingInitialValue } from "../../masters_initial_value.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
import { notifySuccess, notifyError } from "../../../../../helper/notify.jsx";
import UseTable from "../../../../../helper/UseTable.jsx";
import { wrap } from "framer-motion";
import "react-international-phone/style.css";
import useMultipleSelect from "../../../../../hooks/custom_hooks/useMultipleSelect";
import { scrollToTop } from "../../../../../helper/scrollToTop.js";
import extractTextFromHTML from "../../../../../helper/htmlParser.js";

const Sightseeing = () => {
  const [initialList, setInitialList] = useState([]);
  const [formValue, setFormValue] = useState(sightseeingInitialValue);
  const [validationErrors, setValidationErrors] = useState({});
  const [filterValue, setFilterValue] = useState([]);
  const [filterInput, setFiterInput] = useState("");
  const [destinationList, setDestinationList] = useState([]);

  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();
  const handlePageChange = (page) => setCurrentPage(page - 1);
  const handleRowsPerPageChange = (newRowsPerPage) =>
    setRowsPerPage(newRowsPerPage);

  const postDataToServer = async () => {
    // console.log(postDataToServer, "asas");
    try {
      const { data } = await axiosOther.post("destinationlist", {
        CountryId: "",
        StateId: "",
        Name: "",
        Default: "",
        Status: "",
      });
      setDestinationList(data?.DataList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    postDataToServer();
  }, []);

  // multi select option value
  const destinationOption = destinationList?.map((item) => {
    return {
      value: item?.id,
      label: item?.Name,
    };
  });

  // multi select input
  const {
    SelectInput: DestinatinoInput,
    selectedData: destinationData,
    setSelectedData: setDestinationData,
  } = useMultipleSelect(destinationOption);

  const getListDataToServer = async () => {
    // console.log(getListDataToServer);
    try {
      const { data } = await axiosOther.post("sightseeingmasterlist");
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
        data?.SightseeingName?.toLowerCase()?.includes(
          filterInput?.toLowerCase()
        ) || data?.Status?.toLowerCase()?.includes(filterInput?.toLowerCase())
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
      name: "Id",
      selector: (row) => row?.id,
      cell: (row) => <span>{row?.id} </span>,
      sortable: true,
      width: "4rem",
    },
    {
      name: "Sightseeing Name",
      selector: (row) => row?.SightseeingName,
      cell: (row) => <span>{row?.SightseeingName} </span>,
      sortable: true,
      width: "10rem",
    },
    {
      name: "Destination",
      selector: (row) =>
        row?.Destination?.map((data) => data?.DestinationName).join(", ") || "",
      cell: (row) => (
        <span>
          {row?.Destination?.map((data) => data?.DestinationName).join(", ")}{" "}
          {/* Join with a comma and space */}
        </span>
      ),
      sortable: true,
      width: "13rem",
      wrap: true,
    },
    {
      name: "Transfer Type",
      selector: (row) => row?.TransferType,
      cell: (row) => <span>{row?.TransferType}</span>,
      sortable: true,
      width: "8rem",
    },
    {
      name: "Description",
      selector: (row) => row?.Description,
      cell: (row) => <span>{row?.Description}</span>,
      sortable: true,
      width: "15rem",
      wrap: true,
    },
    {
      name: "Inclusions Exclusions",
      selector: (row) => row?.InclusionsExclusionsTiming,
      cell: (row) => <span>{row?.InclusionsExclusionsTiming}</span>,
      sortable: true,
      width: "12rem",
      wrap: true,
    },
    {
      name: "Important Note",
      selector: (row) => row?.ImportantNote,
      cell: (row) => <span>{row?.ImportantNote}</span>,
      sortable: true,
      width: "12rem",
      wrap: true,
    },
    {
      name: "Default Quotation",
      selector: (row) => row?.DefaultQuotation,
      cell: (row) => <span>{row?.DefaultQuotation}</span>,
      sortable: true,
    },
    {
      name: "Default Purposal",
      selector: (row) => row?.DefaultProposal,
      cell: (row) => <span>{row?.DefaultProposal}</span>,
      sortable: true,
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
      width: "7rem",
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
      width: "7rem",
    },
  ];
  const handleReset = () => {
    setFormValue(sightseeingInitialValue);
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
  // console.log(formValue);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sightseeingValidationSchema.validate(formValue, {
        abortEarly: false,
      });
      setValidationErrors({});

      const payload = {
        ...formValue,
        Destination: destinationData.map((item) => item.value), // Ensure this matches the API's expected format
      };

      // console.log("Payload:", payload); // Debugging

      const { data } = await axiosOther.post(
        "addupdatesightseeingmaster",
        payload
      );

      if (data?.Status === 1) {
        getListDataToServer();
        setFormValue(sightseeingInitialValue);
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
      SightseeingName: value?.SightseeingName,
      DefaultQuotation: value?.DefaultQuotation === "1" ? "Yes" : "No",
      DefaultProposal: value?.DefaultProposal === "1" ? "Yes" : "No",
      Status:
        value?.Status == null || value?.Status == "1"
          ? "Active"
          : value?.Status,
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
        const { data } = await axiosOther.post("delete-sightseing", {
          id: id,
        });
        if (data?.Status == 1 || data?.status == 1 || data?.result) {
          notifySuccess(data?.Message || data?.message || data?.result);
          getListDataToServer();
        }
      } catch (err) {
        if (err) {
          notifyError(err?.message || err?.Message || err?.result);
        }
      }
    }
  };
  // handlign form change
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
              <h4 className="card-title">Sightseeing Master</h4>
              <div className="d-flex gap-3">
                <button
                  className="btn btn-dark btn-custom-size"
                  name="SaveButton"
                  onClick={() => navigate(-1)}
                >
                  <span className="me-1">Back</span>
                  <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
                </button>

                <ToastContainer />
              </div>
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
                        <div className="col-md-6 col-lg-2">
                          <div className="d-flex justify-content-between">
                            <label className="" htmlFor="name">
                              Sightseeing Name
                              <span className="text-danger">*</span>
                            </label>
                          </div>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="val-username"
                            name="SightseeingName"
                            placeholder="Enter Sightseeing Name"
                            value={formValue?.SightseeingName}
                            onChange={handleFormChange}
                          />

                          {validationErrors?.SightseeingName && (
                            <div
                              id="val-username1-error"
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.SightseeingName}
                            </div>
                          )}
                        </div>

                        <div className="col-md-6 col-lg-2">
                          <div className="d-flex justify-content-between">
                            <label className="" htmlFor="name">
                              Transfer Type
                              <span className="text-danger">*</span>
                            </label>
                          </div>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="val-username"
                            name="TransferType"
                            placeholder="Enter Transfer Type"
                            value={formValue?.TransferType}
                            onChange={handleFormChange}
                          />

                          {validationErrors?.TransferType && (
                            <div
                              id="val-username1-error"
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.TransferType}
                            </div>
                          )}
                        </div>

                        <div className="col-md-6 col-lg-3">
                          <div className="d-flex justify-content-between">
                            <label className="" htmlFor="status">
                              Destination <span className="text-danger">*</span>
                            </label>
                          </div>

                          <DestinatinoInput />
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

                        <div className="col-md-6 col-lg-3">
                          <label>Default Quatation</label>
                          <div className="d-flex gap-3">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="Default Quatation"
                                value="Yes"
                                id="default_yes"
                                checked={formValue?.DefaultQuotation === "1"}
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
                                name="SetDefault"
                                value="No"
                                id="default_no"
                                checked={formValue?.DefaultQuotation === "0"}
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
                          <label>Default Purposal</label>
                          <div className="d-flex gap-3">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="Default Purposal"
                                value="Yes"
                                id="default_yes"
                                checked={formValue?.DefaultProposal === "1"}
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
                                name="SetDefault"
                                value="No"
                                id="default_no"
                                checked={formValue?.DefaultProposal === "0"}
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

                        <div className="col-md-6 col-lg-3">
                          <div className="d-flex justify-content-between">
                            <label className="" htmlFor="status">
                              Description
                            </label>
                          </div>
                          <input
                            type="text"
                            placeholder="Description"
                            className="form-control form-control-sm"
                            name="Description"
                            value={formValue?.Description}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="col-md-6 col-lg-2">
                          <div className="d-flex justify-content-between">
                            <label className="" htmlFor="status">
                              Important Note
                            </label>
                          </div>

                          <input
                            type="text"
                            placeholder="Important Note"
                            className="form-control form-control-sm"
                            name="ImportantNote"
                            value={formValue?.ImportantNote}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="col-md-6 col-lg-2">
                          <div className="d-flex justify-content-between">
                            <label className="" htmlFor="status">
                              Inclusion Exclusion Timing
                            </label>
                          </div>

                          <input
                            type="text"
                            placeholder="Inclusion Exclusion Timing "
                            className="form-control form-control-sm"
                            name="InclusionsExclusionsTiming"
                            value={formValue?.InclusionsExclusionsTiming}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="text-end">
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
export default Sightseeing;
