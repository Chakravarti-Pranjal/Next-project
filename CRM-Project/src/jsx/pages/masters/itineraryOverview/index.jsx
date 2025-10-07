import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap-daterangepicker/daterangepicker.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Dropdown, Tab, Nav } from "react-bootstrap";
import { axiosOther } from "../../../../http/axios_base_url";
import { itenararyOverviewValidationSchema } from "../master_validation.js";
import { itenararyOverviewInitialValue } from "../masters_initial_value.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
import { notifySuccess, notifyError } from "../../../../helper/notify.jsx";
import { scrollToTop } from "../../../../helper/scrollToTop.js";
import UseTable from "../../../../helper/UseTable.jsx";

const ItenaryOverview = () => {
  const [selectBtn, setSelectBtn] = useState("Newest");
  const [initialList, setInitialList] = useState([]);
  const [formValue, setFormValue] = useState(itenararyOverviewInitialValue);
  const [validationErrors, setValidationErrors] = useState({});
  const [filterValue, setFilterValue] = useState([]);
  const [filterInput, setFiterInput] = useState("");
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0); // Page index
  const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page

  const handlePageChange = (page) => setCurrentPage(page - 1);
  const handleRowsPerPageChange = (newRowsPerPage) =>
    setRowsPerPage(newRowsPerPage);
  const data = []; // Replace with your data
  const totalRows = 10; // Replace with your total rows count
  const navigate = useNavigate();
  const postDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("itineraryoverviewlist");
      setInitialList(data?.DataList);
      setFilterValue(data?.DataList);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    postDataToServer();
  }, []);
  const handleCKEditorChange = (name, data) => {
    setFormValue((prev) => ({
      ...prev,
      [name]: data,
    }));
  };

  useEffect(() => {
    const filteredList = initialList?.filter(
      (data) =>
        data?.OverviewName?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||

        data?.Status?.toLowerCase()?.includes(filterInput?.toLowerCase())
    );
    setFilterValue(filteredList);
  }, [filterInput]);

  const handleEditClick = (value) => {
    setFormValue({
      id: value?.id || "",
      OverviewName: value?.OverviewName || "",
      OverviewInformation: value?.OverviewInformation || "",
      HighlightInformation: value?.HighlightInformation || "",
      ItineraryIntroduction: value?.ItineraryIntroduction || "",
      ItinerarySummary: value?.ItinerarySummary || "",
      Status: value?.Status === "Active" ? 1 : 0,
      AddedBy: value?.AddedBy || 1,
      UpdatedBy: value?.UpdatedBy || 1,
      LanguageData: value?.LanguageData || [],
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await itenararyOverviewValidationSchema.validate(formValue, {
        abortEarly: false,
      });
      setValidationErrors({});
      //  console.log(formValue);
      const { data } = await axiosOther.post("addupdateitineraryoverview", formValue);
      if (data?.Status == 1) {
        postDataToServer();
        setIsEditing(false);
        setFormValue(itenararyOverviewInitialValue);

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
        // console.log("response", data);
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
  const handleReset = () => {
    setFormValue(itineraryRequirementInitialValue);
    setValidationErrors({});
    setIsEditing(false);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const table_columns = [
    {
      name: "Sr. No.",
      selector: (row, index) => (
        <span className="font-size-11">
          {currentPage * rowsPerPage + index + 1}
        </span>
      ),
    },
    {
      name: "Overview Name",
      selector: (row) => row.OverviewName,
      cell: (row) => <span>{row.OverviewName}</span>,
      sortable: true,
    },
    {
      name: "Overview Information",
      selector: (row) => row.OverviewInformation,
      cell: (row) =>

        <span> {row.OverviewInformation}</span>,
      sortable: true,
    },
    {
      name: "Highlight Information",
      selector: (row) => row.HighlightInformation,
      cell: (row) =>

        <span>{row.HighlightInformation}</span>,
      sortable: true,
    },

    {
      name: "Itinerary Introduction",
      selector: (row) => row.ItineraryIntroduction,
      cell: (row) => <span>{row.ItineraryIntroduction}</span>,
      sortable: true,
    },
    {
      name: "Itinerary Summary",
      selector: (row) => row.ItinerarySummary,
      cell: (row) => <span>{row.ItinerarySummary}</span>,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.Status,
      cell: (row) => {
        return (
          <span
            className={`badge ${row.Status == "Active"
              ? "badge-success light badge "
              : "badge-danger light badge"
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
          <div className="d-flex align-items-center gap-1 sweetalert">
            <i
              className="fa-solid fa-pencil cursor-pointer text-success action-icon"
              onClick={() => {
                handleEditClick(row);
                scrollToTop();
              }}
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
  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">{isEditing ? "Update Itenerary Requirement" : "Add Itenerary Requirement"}</h4>
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
              <div className="form-validation" >
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
                          <label className="" htmlFor="name">
                              Overview Name
                              <span className="text-danger">*</span>
                            </label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="val-username"
                            name="OverviewName"
                            placeholder="Enter OverviewName"
                            value={formValue?.OverviewName}
                            onChange={handleInputChange}

                          />
                          {validationErrors?.OverviewName && (
                            <div
                              id="val-username1-error"
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.OverviewName}
                            </div>
                          )}
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
                            onChange={handleInputChange}
                          >
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                          </select>
                        </div>

                        <div className="col-md-7 col-lg-7">
                          <p> Overview Information</p>

                          <CKEditor
                            editor={ClassicEditor}

                            data={formValue?.OverviewInformation || ""}

                            onChange={(event, editor) =>
                              handleCKEditorChange("OverviewInformation", editor.getData())
                            }
                          />
                        </div>

                        <div className="col-md-5 col-lg-5">
                          <p> Highlight Information</p>

                          <CKEditor
                            editor={ClassicEditor}
                            data={formValue?.HighlightInformation || ""}

                            onChange={(event, editor) =>
                              handleCKEditorChange("HighlightInformation", editor.getData())
                            }
                          />
                        </div>
                        <div className="col-md-6 col-lg-6">
                          <p> Itinerary Introduction</p>

                          <CKEditor
                            editor={ClassicEditor}
                            data={formValue?.ItineraryIntroduction || ""}

                            onChange={(event, editor) =>
                              handleCKEditorChange("ItineraryIntroduction", editor.getData())
                            }

                          />
                        </div>
                        <div className="col-md-6 col-lg-6">
                          <p> Itinerary Summary</p>

                          <CKEditor
                            editor={ClassicEditor}

                            data={formValue?.ItinerarySummary || ""}

                            onChange={(event, editor) =>
                              handleCKEditorChange("ItinerarySummary", editor.getData())
                            }

                          />
                        </div>
                        <div className="col-md-6 col-lg-3 d-flex align-items-end justify-content-end ms-auto mt-2">
                          <button type="submit" className="btn btn-primary btn-custom-size">{isEditing ? "Update" : "Submit"}</button>
                          <button type="button" className="btn btn-dark btn-custom-size ms-2" onClick={handleReset}>Reset</button>
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

export default ItenaryOverview;
