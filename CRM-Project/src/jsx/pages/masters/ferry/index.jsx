import React, { useEffect, useState } from "react";
import { Tab, Nav} from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import DataTable from "react-data-table-component";
// import Nav from "../voucher/nav";
import { axiosOther } from "../../../../http/axios_base_url";
import { Field, ErrorMessage } from "formik";
import { ferryMasterInitialValue } from "../masters_initial_value";
import { ferryMasterValidationSchema } from "../master_validation";

import UseTable from "../../../../helper/UseTable";

const Ferry = () => {
  const [getData, setGetData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [formValue, setFormValue] = useState(ferryMasterInitialValue);
  const [editData, setEditData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [postData, setPostData] = useState({
    Search: "",
    Status: "",
  });
  const [updateData, setUpdateData] = useState(false);
  const [changeValue, setChangeValue] = useState("");
  const [ferryCompanyList, setFerryCompanyList] = useState([]);
  const [imageValue, setImageValue] = useState({
    ImageData: "",
    ImageName: "",
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();
  const handlePageChange = (page) => setCurrentPage(page - 1);
  const handleRowsPerPageChange = (newRowsPerPage) =>
    setRowsPerPage(newRowsPerPage);
  const getDataToServer = async () => {
    try {
      const ferryCompanyName = await axiosFerry.post("ferrycompanylist", {});
      setFerryCompanyList(ferryCompanyName.data.DataList);
    } catch (err) {
      console.log("Erro Occured", err);
    }
  };
  useEffect(() => {
    getDataToServer();
  }, []);

  const postDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("ferrynamelist", postData);
      setLoading(false);
      setGetData(data.DataList);
      setFilterData(data.DataList);
      setFormValue(ferryMasterInitialValue);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    postDataToServer();
  }, [updateData]);

  useEffect(() => {
    const result = getData?.filter((item) => {
      return item?.FerryCompany?.toLowerCase()?.includes(
        postData?.Search?.toLowerCase()
      );
    });

    setFilterData(result);
  }, [postData]);

  const handleEditClick = (value) => {
    setFormValue({
      id: value?.id,
      FerryCompany: value?.FerryCompanyName,
      FerryName: value?.FerryName,
      Capacity: value?.Capacity,
      ImageName: value?.ImageName,
      ImageData: value?.ImageData,
      Status:
        value?.Status == null || value?.Status === ""
          ? "Active"
          : value?.Status,
      AddedBy: value?.AddedBy,
      UpdatedBy: value?.UpdatedBy,
    });
    setIsEditing(true); // Set edit mode
  };

  const handleFerryChange = (e) => {
    const { name, value, files, type } = e.target;

    if (type === "file") {
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

  const handleDelete = async (id) => {
    // console.log("id", id);
    try {
      const { data } = await axiosOther.post("", {
        id: id,
      });
      // console.log("response", data);
      if (data) {
        postDataToServer();
      }
    } catch (err) {
      if (err) {
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
      name: "Image",
      selector: (row) => row?.ImageName,
      cell: (row) => (
        <span>
          <img
            src={row.ImageName}
            alt="image"
            className="height-5px !important width-5px !important w-25"
          ></img>
        </span>
      ),
      sortable: true,
      width: "15rem",
    },
    {
      name: "Ferry Company",
      selector: (row) => row?.FerryCompany,
      cell: (row) => <span>{row.FerryCompany}</span>,
      sortable: true,
      width: "15rem",
    },
    {
      name: "Ferry Name",
      selector: (row) => row?.FerryName,
      cell: (row) => <span>{row.FerryName} </span>,
      sortable: true,
      width: "15rem",
    },
    {
      name: "Capacity",
      selector: (row) => row?.Capacity,
      cell: (row) => <span>{row.Capacity}</span>,
      sortable: true,
      width: "12rem",
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
      width: "12rem",
    },
    {
      name: "Action",
      selector: (row) => (
        <div className="d-flex gap-1 sweetalert align-items-center">
          <i
            className="fa-solid fa-pencil cursor-pointer text-success  action-icon"
            onClick={() => handleEditClick(row)}
          ></i>
          <i
            className="fa-solid fa-trash-can cursor-pointer text-danger action-icon sweet -confirm"
            onClick={() => handleDelete(row?.id)}
          ></i>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">
                {isEditing ? "Update ferry Name" : "Add ferry Name"}
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
              <div className="form-validation">
                <ToastContainer />
                <form className="form-valide" onSubmit={postDataToServer}>
                  <div className="row">
                    <div className="col-12">
                      <div className="row form-row-gap">
                        <div className="col-md-6 col-lg-2">
                          <label>Ferry Company</label>
                          <select
                            name="FerryCompany"
                            className="form-control form-control-sm"
                            component={"select"}
                          >
                            <option value="">Select Company</option>
                            {ferryCompanyList?.map((value, index) => {
                              return (
                                <option value={value.id} key={index + 1}>
                                  {value.FerryCompanyName}
                                </option>
                              );
                            })}
                          </select>
                        </div>

                        <div className="col-md-6 col-lg-2">
                          <label htmlFor="ferryName">
                            Ferry Name
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className={`form-control form-control-sm ${validationErrors?.UploadKeyword
                              ? "is-invalid"
                              : ""
                              } highlight`}
                            name="UploadKeyword"
                            placeholder="Enter ferry Name"
                            value={postData.FerryName}
                            onChange={handleFerryChange}
                          />
                          {validationErrors?.ferryName && (
                            <div
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.ferryName}
                            </div>
                          )}
                        </div>

                        <div className="col-md-6 col-lg-2">
                          <label htmlFor="ferryName">
                            Ferry Image
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="file"
                            className={`form-control form-control-sm ${validationErrors?.ImageName ? "is-invalid" : ""
                              } highlight`}
                            name="Image"
                            placeholder="Select File"
                            value={postData.ImageName}
                            onChange={handleFerryChange}
                          />
                          {validationErrors?.ImageName && (
                            <div
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.ImageName}
                            </div>
                          )}
                        </div>

                        <div className="col-md-6 col-lg-2">
                          <label>Status</label>
                          <select
                            name="Status"
                            className="form-control form-control-sm"
                            value={postData?.Status}
                            onChange={handleFerryChange}
                          >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        </div>

                        <div className="col-md-6 col-lg-4 d-flex align-items-center mt-3">
                          <button
                            type="submit"
                            className="btn btn-primary btn-custom-size"
                          >
                            {isEditing ? "Update" : "Submit"}
                          </button>
                          <button
                            type="button"
                            className="btn btn-dark  btn-custom-size ms-2"
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
        </div>
        <UseTable
          table_columns={table_columns}
          filterValue={filterData}
          setFilterValue={setFilterData}
          rowsPerPage={rowsPerPage}
          handlePage={handlePageChange}
          handleRowsPerPage={handleRowsPerPageChange}
        />
      </Tab.Container>
    </>
  );
};

export default Ferry;
