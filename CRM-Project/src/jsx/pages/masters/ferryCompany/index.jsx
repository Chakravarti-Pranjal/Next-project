import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap-daterangepicker/daterangepicker.css";
import { Dropdown, Tab, Nav } from "react-bootstrap";
import { axiosOther } from "../../../../http/axios_base_url";
import { ferryCompanyInitialValue } from "../masters_initial_value.js";
import { ferryCompanyValidationSchema } from "../master_validation.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
import { notifySuccess, notifyError } from "../../../../helper/notify.jsx";
import { scrollToTop } from "../../../../helper/scrollToTop.js";
import UseTable from "../../../../helper/UseTable.jsx";

const FerryCompany = () => {
  const [initialList, setInitialList] = useState([]);
  const [formValue, setFormValue] = useState(ferryCompanyInitialValue);
  const [validationErrors, setValidationErrors] = useState({});
  const [filterValue, setFilterValue] = useState([]);
  const [filterInput, setFiterInput] = useState("");
  const [updateData, setUpdateData] = useState(false);
  const [changeValue, setChangeValue] = useState("");
  const [destinationList, setDestinationList] = useState([]);
  const [devisioinList, setDevisionList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0); // Page index
  const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page

  const handlePageChange = (page) => setCurrentPage(page - 1);
  const handleRowsPerPageChange = (newRowsPerPage) =>
    setRowsPerPage(newRowsPerPage);
  const data = []; // Replace with your data
  const totalRows = 10; // Replace with your total rows count
  const navigate = useNavigate();

  const getDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("destinationlist", {
        CountryId: "",
        StateId: "",
        Name: "",
        Default: "",
        Status: "",
      });

      setDestinationList(data?.DataList);
    } catch (err) {
      console.log("Erro Occured", err);
    }

    try {
      const devision = await axiosOther.post("devisionlist", {
        Search: "",
        Status: 1,
      });
      setDevisionList(devision.data.DataList);
    } catch (err) {
      console.log("Erro Occured", err);
    }
  };
  useEffect(() => {
    getDataToServer();
  }, []);

  const postDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("ferrycompanylist");
      setInitialList(data?.DataList);
      setFilterValue(data?.DataList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    postDataToServer();
  }, []);

  useEffect(() => {
    const filteredList = initialList?.filter(
      (data) =>
        data?.FerryCompanyName?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
        data?.Status?.toLowerCase()?.includes(filterInput?.toLowerCase())
    );
    setFilterValue(filteredList);
  }, [filterInput]);
  const handleEditClick = (value) => {
    setFormValue({
      id: value?.id,
      FerryCompanyName: value?.FerryCompanyName,
      Destination: value?.Destination,
      Website: value?.Website,
      SelfSupplier: value?.SelfSupplier,
      Type: value?.Type,
      ContactPers: value?.ContactPers,
      Designation: value?.Designation,
      Phone: value?.Phone,
      Email: value?.Email,
      Status: value?.Status == "Active" ? 1 : 0,
      AddedBy: value?.AddedBy,
      UpdatedBy: value?.UpdatedBy,
    });

  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await ferryCompanyValidationSchema.validate(formValue, {
        abortEarly: false,
      });
      setValidationErrors({});
      const { data } = await axiosOther.post("addupdateferrycompany", formValue);
      if (data?.Status === 1) {
        postDataToServer();
        setIsEditing(false);
        setFormValue(CruisemasterInitialValue);
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


  const handleDelete = async (id) => {
    const confirmation = await swal({
      title: "Are you sure want to Delete?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });

    if (confirmation) {
      try {
        const { data } = await axiosOther.post("", {
          id: id,
        });
        if (data?.Status == 1 || data?.status == 1 || data?.result) {
          notifySuccess(data?.Message || data?.message || data?.result);
          postDataToServer();
        }
      } catch (err) {
        if (err) {
          notifyError(err?.message || err?.Message);
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
      )
    },
    , {
      name: "Ferry Country",
      selector: (row) => row?.FerryCompanyName,
      cell: (row) => <span>{row.FerryCompanyName}</span>,
      sortable: true,
    },
    {
      name: "Destination",
      selector: (row) => row?.Destination,
      cell: (row) => <span>{row.Destination}</span>,
      sortable: true,
    },
    {
      name: "Ferry Website",
      selector: (row) => row?.Website,
      cell: (row) => <span>{row.Website}</span>,
      sortable: true,
    },
    {
      name: "Self Supplier",
      selector: (row) => row?.SelfSupplier,
      cell: (row) => {
        return <span>{row.SelfSupplier}</span>;
      },
      sortable: true,
    },
    {
      name: "Contact Person",
      selector: (row) => row?.ContactPers,
      cell: (row) => {
        return <span>{row.ContactPers}</span>;
      },
      sortable: true,
    },

    {
      name: "Status",
      selector: (row) => row?.Status,
      cell: (row) => {
        return (
          <span
            className={`badge ${row.Status == "Active" ? "badge-success light badge" : "badge-danger light badge"
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
              onClick={() => handleEditClick(row)}
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
  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Ferry Company</h4>
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
                        <div className="col-md-6 col-lg-2">
                          <label className="m-0">Ferry Company Name</label>
                          <span className="text-danger">*</span>
                          <input
                            type="text"

                            className={`form-control form-control-sm ${validationErrors?.FerryCompanyName ? "is-invalid" : ""
                              }`}
                            name="FerryCompanyName"
                            placeholder="Enter ferry company"
                            value={formValue?.FerryCompanyName}

                          />
                          {validationErrors?.FerryCompanyName && (
                            <div

                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >

                              {validationErrors?.FerryCompanyName}
                            </div>
                          )}
                        </div>

                        <div className="col-md-6 col-lg-2">
                          <label className="m-0">Destination</label>
                          <select
                            name="Destination"
                            id=""
                            className="form-control form-control-sm"
                            value={formValue?.Destination}

                          >
                            <option value="">Select</option>
                            {destinationList?.map((value, index) => {
                              return (
                                <option value={value.id} key={index + 1}>
                                  {value.Name}
                                </option>
                              );
                            })}
                          </select>

                        </div>



                        <div className="col-md-6 col-lg-2">
                          <label className="m-0">
                            Website

                          </label>
                          <input
                            type="text"
                            className="form-control form-control-sm"

                            name="Website"
                            placeholder="Website"
                            value={formValue?.Website}

                          />
                          {validationErrors?.Website && (
                            <div

                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.Website}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6 col-lg-2">
                          <label className="" htmlFor="name">
                            Contact

                          </label>
                          <input
                            type="email"
                            className="form-control form-control-sm"
                            id="val-username"
                            name="Email"
                            placeholder="Email"
                            value={formValue?.Email}

                          />
                          {validationErrors?.Email && (
                            <div
                              id="val-username1-error"
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.Email}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6 col-lg-2">
                          <label className="" htmlFor="name">
                            Phone

                          </label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="val-username"
                            name="phone"
                            placeholder="phone"
                            value={formValue?.Phone}

                          />
                          {validationErrors?.Phone && (
                            <div
                              id="val-username1-error"
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.Phone}
                            </div>
                          )}
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

                          >
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                          </select>
                        </div>

                        <div className="col-md-6 col-lg-3 d-flex justify-content-end align-items-end mt-2 ms-auto">
                          <button type="submit" className="btn btn-primary btn-custom-size ms-2">Submit</button>
                          <button type="button" className="btn btn-dark btn-custom-size ms-2" >Reset</button>
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

export default FerryCompany;
