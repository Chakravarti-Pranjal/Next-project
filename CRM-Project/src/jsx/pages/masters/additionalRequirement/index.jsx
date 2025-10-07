import React, { useState, useEffect } from "react";
import { Dropdown, Tab, Nav } from "react-bootstrap";
import { axiosOther } from "../../../../http/axios_base_url.js";
import { useNavigate } from "react-router-dom";
import { additionaRequirementValidationSchema } from "../master_validation.js";
import { additionalRequiremntInitialValue } from "../masters_initial_value.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
import { notifySuccess, notifyError } from "../../../../helper/notify.jsx";
import UseTable from "../../../../helper/UseTable.jsx";
import { scrollToTop } from "../../../../helper/scrollToTop.js";

const AdditionalRequirement = () => {
  const [selectBtn, setSelectBtn] = useState("Newest");
  const [getData, setGetData] = useState([]);
  const [initialList, setInitialList] = useState([]);
  const [formValue, setFormValue] = useState(additionalRequiremntInitialValue);
  const [validationErrors, setValidationErrors] = useState({});
  const [destinationList, setDestinationList] = useState([]);
  const [taxSlabList, setTaxSlabList] = useState([]);
  const [currencyList, setCurrencyList] = useState([]);
  const [filterValue, setFilterValue] = useState([]);
  const [filterInput, setFilterInput] = useState("");
  const [imageValue, setImageValue] = useState({
    ImageData: "",
    ImageName: "",
  });
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handlePageChange = (page) => setCurrentPage(page - 1);
  const handleRowsPerPageChange = (newRowsPerPage) =>
    setRowsPerPage(newRowsPerPage);

  const getListDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("additionalrequirementmasterlist");
      setInitialList(data?.DataList);
      setFilterValue(data?.DataList);
      // console.log(data);
    } catch (error) {
      console.log("visa-type-error", error);
    }
  };

  useEffect(() => {
    getListDataToServer();
  }, []);

  const getDataToServer = async () => {
    try {
      const destination = await axiosOther.post("destinationlist", {
        Search: "",
        Status: 1,
        destinationid: formValue?.DestinationId,
      });
      // console.log(destination);
      setDestinationList(destination.data.DataList);
    } catch (err) {
      console.log("Erro Occured", err);
    }

    try {
      const taxslab = await axiosOther.post("taxmasterlist", {
        Search: "",
        Status: 1,
        taxid: formValue?.TaxId,
      });

      setTaxSlabList(taxslab.data.DataList);
    } catch (err) {
      console.log("Erro Occured", err);
    }

    try {
      const currency = await axiosOther.post("currencymasterlist", {
        Search: "",
        Status: 1,
        currencyid: formValue.CurrencyId,
      });
      setCurrencyList(currency.data.DataList);
    } catch (err) {
      console.log("Erro Occured", err);
    }
  };
  useEffect(() => {
    getDataToServer();
  }, [formValue?.DestinationId]);

  useEffect(() => {
    const filteredList = getData?.filter(
      (data) =>
        data?.Name?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
        data?.Status?.toLowerCase()?.includes(filterInput?.toLowerCase())
    );
    setFilterValue(filteredList);
  }, [filterInput]);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result;
      A;
      const base64String = base64.split(",")[1];
      setImageValue({
        ImageData: base64String,
        ImageName: file.name,
      });
    };

    reader.readAsDataURL(file);
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
      name: "Image",
      selector: (row) => row?.ImageName,
      cell: (row) => (
        <span>
          <img
            src={row.ImageName}
            alt="image"
            className="height-30 width-30"
          ></img>
        </span>
      ),
      sortable: true,
    },
    {
      name: "Additional Name",
      selector: (row) => row?.Name,
      cell: (row) => row.Name,
      sortable: true,
    },
    {
      name: "Destination",
      selector: (row) => row?.DestinationName,
      cell: (row) => <span> {row.DestinationName} </span>,
      sortable: true,
    },
    {
      name: "Per Pax Cost",
      selector: (row) => row?.CostType,
      cell: (row) => {
        return <span>{row.CostType}</span>;
      },
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row?.Details,
      cell: (row) => {
        return <span>{row.Details}</span>;
      },
      // width: "8rem",
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
      width: "8rem",
    },
    {
      name: "Action",
      selector: (row) => (
        <div className="d-flex align-items-center gap-1">
          <i
            className="fa-solid fa-pencil cursor-pointer text-success action-icon"
            onClick={() => handleEdit(row)}
            onChange={scrollToTop()}
          ></i>
          <i
            className="fa-solid fa-trash-can cursor-pointer text-danger action-icon"
            onClick={() => handleDelete(row?.id)}
          ></i>
        </div>
      ),
    },
  ];
  const handleReset = () => {
    setFormValue(additionalRequiremntInitialValue);
    setValidationErrors({});
    setIsEditing(false);
  };
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await additionaRequirementValidationSchema.validate(formValue, {
        abortEarly: false,
      });
      setValidationErrors({});
      const { data } = await axiosOther.post(
        "addupdateadditionalrequirementmaster",
        formValue
      );
      if (data?.Status === 1) {
        getListDataToServer();
        setFormValue(additionalRequiremntInitialValue);
        setGetData(data.DataList);
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
      if (error.response?.data?.Errors) {
        const data = Object.entries(error.response?.data?.Errors);
        notifyError(data[0][1]);
      }
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (value) => {
    setFormValue({
      id: value?.id,
      Name: value?.Name,
      TaxSlab: value?.TaxSlab,
      DestinationId: value?.DestinationId,
      Description: value?.Details,
      Status: value?.Status === "Active" ? "1" : "0",
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
        const { data } = await axiosOther.post(
          "deleteadditionalrequirementmaster",
          { id }
        );
        if (data?.Status === 1) {
          notifySuccess(data?.Message || data?.message);
          getListDataToServer();
        }
      } catch (err) {
        notifyError(err?.message || err?.Message);
      }
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Add Additional Information</h4>
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

                          <label htmlFor="name">
                            Additional Name
                            <span className="text-danger">*</span>
                          </label>

                          <input
                            type="text"
                            className="form-control form-control-sm"
                            name="Name"
                            placeholder="Enter Visa Type"
                            value={formValue?.Name}
                            onChange={handleFormChange}
                          />
                          {validationErrors?.Name && (
                            <div
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.Name}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6 col-lg-2">
                          <label className="m-0">Pay Per Tax</label>
                          <select
                            name="TaxSlabId"
                            id=""
                            className="form-control form-control-sm"
                            value={formValue?.TaxSlabName}
                            onChange={handleInputChange}
                          >
                            <option value="">Select</option>
                            {taxSlabList?.map((value, index) => {
                              return (
                                <option value={value.id} key={index + 1}>
                                  {value.taxSlabName}
                                </option>
                              );
                            })}
                          </select>
                          {validationErrors?.TaxSlab && (
                            <div
                              id="val-username1-error"
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.DestinationId}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6 col-lg-2">
                          <label className="m-0">Destination</label>
                          <select
                            name="DestinationId"
                            id=""
                            className="form-control form-control-sm"
                            value={formValue?.DestinationId}
                            onChange={handleInputChange}
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
                          {validationErrors?.DestinationId && (
                            <div
                              id="val-username1-error"
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.DestinationId}
                            </div>
                          )}
                        </div>

                        <div className="col-md-6 col-lg-2">
                          <label htmlFor="status">Status</label>
                          <select
                            name="Status"
                            className="form-control form-control-sm"
                            value={formValue?.Status}
                            onChange={handleFormChange}
                          >
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                          </select>
                        </div>
                        <div className="col-md-6 col-lg-3 d-flex align-items-end justify-content-end">
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
            <Nav as="ul" className=" nav nav-tabs">
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
                  onChange={(e) => setFilterInput(e.target.value)}
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
export default AdditionalRequirement;
