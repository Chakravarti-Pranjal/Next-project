import React, { useEffect, useState, useRef } from "react";
import { saveAs } from "file-saver";
import { Dropdown, Tab, Nav } from "react-bootstrap";
import { scrollToTop } from "../../../../helper/scrollToTop";
import UseTable from "../../../../helper/UseTable";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { excelFormatAddInitialValue } from "../masters_initial_value";
import { axiosOther } from "../../../../http/axios_base_url";
import { ToastContainer } from "react-toastify";
import { notifySuccess, notifyError } from "../../../../helper/notify.jsx";

const formObject = {
  ServiceName: "",
  ServiceSize: "",
  ServiceDataType: "",
  ServiceFormat: "",
  ServiceRegex: "",
};

const AddRateUploadField = () => {
  const [dynamicForm, setDynamicForm] = useState([formObject]);
  const [staticForm, setStaticForm] = useState(excelFormatAddInitialValue);
  const [isUpdating, setIsUpdating] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [getData, setGetData] = useState([]);
  const [filterValue, setFilterValue] = useState([]);
  const [filterInput, setFiterInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const formRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  const handlePageChange = (page) => setCurrentPage(page - 1);
  const handleRowsPerPageChange = (newRowsPerPage) =>
    setRowsPerPage(newRowsPerPage);

  const postDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("ExcelServiceTemplateList");
      setLoading(false);
      setGetData(data.DataList);
      setFilterValue(data.DataList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    postDataToServer();
  }, []);

  useEffect(() => {
    const result = getData?.filter((item) => {
      return item?.ServiceType?.toLowerCase()?.includes(
        filterInput?.toLowerCase()
      );
    });
    setFilterValue(result);
  }, [filterInput]);

  const handleDelete = async (id) => {
    try {
      const { data } = await axiosOther.post("deleteExcelServiceTemplate", {
        id: id,
      });
      if (data) {
        notifySuccess(data?.result);
        postDataToServer();
      }
    } catch (err) {
      notifyError(err?.message);
    }
  };

  const handleDownload = async (template) => {
    try {
      const response = await axiosOther.get(template, { responseType: "blob" });
      saveAs(response.data, "template.xlsx");
    } catch (error) {
      notifyError(error?.message);
    }
  };

  const handleUpdate = (value) => {
    setStaticForm({
      id: value?.id,
      ServiceType: value?.ServiceType,
      Title: value?.Title,
      TemplateName: value?.TemplateName,
    });
    setDynamicForm(value?.Data || [formObject]);
    setIsEditing(true);
    formRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleFormIncrement = () => {
    setDynamicForm([...dynamicForm, formObject]);
  };

  const handleFormDecrement = (index) => {
    const deletingForm = dynamicForm.filter((_, ind) => ind !== index);
    setDynamicForm(deletingForm);
  };

  const handleStaticFormChange = (e) => {
    const { name, value } = e.target;
    setStaticForm({ ...staticForm, [name]: value });
  };

  const handleDynamicFormChange = (e, ind) => {
    const { name, value } = e.target;
    setDynamicForm((prevArr) => {
      let newArray = [...prevArr];
      newArray[ind] = { ...newArray[ind], [name]: value };
      return newArray;
    });
  };

  const handleSubmit = async () => {
    try {
      const { data } = await axiosOther.post(
        !isUpdating ? "ExcelServiceTemplate" : "updateExcelServiceTemplate",
        {
          ...staticForm,
          Data: dynamicForm,
        }
      );

      if (data.Status == 1) {
        notifySuccess(data?.Message || data?.message);
        setStaticForm(excelFormatAddInitialValue);
        setDynamicForm([formObject]);
        setIsUpdating(false);

        const blob = await fetch(
          `http://127.0.0.1:8000${data?.file_path}`
        ).then((res) => res.blob());
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "download.xlsx";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        notifyError(data?.Message || data?.message);
      }
    } catch (error) {
      if (error?.response) {
        notifyError(
          error?.response?.data?.message || error?.response?.data?.Message
        );
      }
      console.log("error", error);
    }
  };

  useEffect(() => {
    if (state) {
      setIsUpdating(true);
      setStaticForm({
        ServiceType: state?.ServiceType,
        Title: state?.Title,
        Data: [],
        AddedBy: "1",
      });
      setDynamicForm([state?.Data]);
    }
  }, [state]);

  const table_columns = [
    {
      name: "Sr. No.",
      selector: (row, index) => (
        <span className="font-size-11">
          {currentPage * rowsPerPage + index + 1}
        </span>
      ),
      width: "10rem",
    },
    {
      name: "Service Type",
      selector: (row) => row?.ServiceType,
      cell: (row) => <span>{row?.ServiceType}</span>,
      sortable: true,
      width: "18rem",
    },
    {
      name: "Title",
      selector: (row) => row?.Title,
      cell: (row) => <span>{row.Title}</span>,
      sortable: true,
    },
    {
      name: "Download",
      selector: (row) => row?.TemplateName,
      cell: (row) => (
        <span
          className="text-primary cursor-pointer"
          onClick={() => handleDownload(row?.TemplateName)}
        >
          <i className="fa-solid fa-cloud-arrow-down fs-6"></i>
        </span>
      ),
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => (
        <div className="d-flex align-items-center gap-1">
          <i
            className="fa-solid fa-pencil cursor-pointer text-success action-icon"
            onClick={() => handleUpdate(row)}
          ></i>
          <i
            className="fa-solid fa-trash-can cursor-pointer text-danger action-icon"
            onClick={() => handleDelete(row.id)}
          ></i>
        </div>
      ),
      width: "18rem",
    },
  ];

  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">
                {isEditing
                  ? "Update Rate Field Template"
                  : "Add Rate Field Template"}
              </h4>
              <button
                className="btn btn-dark btn-custom-size"
                onClick={() => navigate(-1)}
              >
                <span className="me-1">Back</span>
                <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
              </button>
            </div>
            <div className="card-body">
              <div className="form-validation" ref={formRef}>
                <ToastContainer />
                <form className="form-valide">
                  <div className="row">
                    <div className="col-12">
                      <div className="row form-row-gap">
                        <div className="col-md-6 col-lg-2">
                          <label htmlFor="serviceType">Service Type</label>
                          <select
                            name="ServiceType"
                            value={staticForm.ServiceType}
                            onChange={handleStaticFormChange}
                            className="form-control form-control-sm"
                          >
                            <option value="">Select</option>
                            <option value="Monument">Monument</option>
                            <option value="Hotel">Hotel</option>
                            <option value="Guide">Guide</option>
                            <option value="Activity">Activity</option>
                            <option value="Transport">Transport</option>
                            <option value="Transfer">Transfer</option>
                            <option value="Restaurant">Restaurant</option>
                            <option value="Train">Train</option>
                            <option value="Visa">Visa</option>
                            <option value="Insurance">Insurance</option>
                            <option value="Tourescort">TourEscort</option>
                            <option value="Porter">Porter</option>
                            <option value="Flight">Flight</option>
                          </select>
                        </div>
                        <div className="col-md-6 col-lg-2">
                          <label htmlFor="title">Title</label>
                          <input
                            type="text"
                            placeholder="Title"
                            className="form-control form-control-sm"
                            name="Title"
                            value={staticForm.Title}
                            onChange={handleStaticFormChange}
                          />
                        </div>
                      </div>
                      {dynamicForm?.map((_, ind) => (
                        <div className="row mt-2" key={ind}>
                          <div className="col-md-6 col-lg-2">
                            <label htmlFor="serviceName">Service Name</label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="Service Name"
                              name="ServiceName"
                              value={dynamicForm[ind]?.ServiceName}
                              onChange={(e) => handleDynamicFormChange(e, ind)}
                            />
                          </div>
                          <div className="col-md-6 col-lg-2">
                            <label htmlFor="serviceDataType">
                              Service Type
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="Service Type"
                              name="ServiceDataType"
                              value={dynamicForm[ind]?.ServiceDataType}
                              onChange={(e) => handleDynamicFormChange(e, ind)}
                            />
                          </div>
                          <div className="col-md-6 col-lg-2">
                            <label htmlFor="serviceSize">Service Size</label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="Service Size"
                              name="ServiceSize"
                              value={dynamicForm[ind]?.ServiceSize}
                              onChange={(e) => handleDynamicFormChange(e, ind)}
                            />
                          </div>
                          <div className="col-md-6 col-lg-2">
                            <label htmlFor="serviceFormat">Format</label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="Format"
                              name="ServiceFormat"
                              value={dynamicForm[ind]?.ServiceFormat}
                              onChange={(e) => handleDynamicFormChange(e, ind)}
                            />
                          </div>
                          <div className="col-md-6 col-lg-2">
                            <label htmlFor="serviceRegex">Regex</label>
                            <div className="d-flex align-items-center gap-1">
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Regex"
                                name="ServiceRegex"
                                value={dynamicForm[ind]?.ServiceRegex}
                                onChange={(e) =>
                                  handleDynamicFormChange(e, ind)
                                }
                              />
                              {ind === 0 && (
                                <span onClick={handleFormIncrement}>
                                  <i className="fa-solid fa-plus font-weight-bold text-primary cursor-pointer"></i>
                                </span>
                              )}
                              {ind > 0 && (
                                <span onClick={() => handleFormDecrement(ind)}>
                                  <i className="fa-solid fa-trash font-weight-bold text-danger cursor-pointer"></i>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="row mt-3">
                        <div className="col-md-6 col-lg-2">
                          <button
                            type="button"
                            className="btn btn-primary btn-custom-size"
                            onClick={handleSubmit}
                          >
                            {isEditing ? "Update" : "Submit"}
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

export default AddRateUploadField;
