import React, { useState, useEffect, useRef } from "react";
import { useNavigate, NavLink, Link } from "react-router-dom";
import "bootstrap-daterangepicker/daterangepicker.css";
import { Dropdown, Tab, Nav } from "react-bootstrap";
import { axiosOther } from "../../../../http/axios_base_url.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
import { notifyError, notifySuccess } from "../../../../helper/notify.jsx";
import UseTable from "../../../../helper/UseTable.jsx";
import { scrollToTop } from "../../../../helper/scrollToTop.js";
import { wrap } from "highcharts";

const Client = () => {
  const [selectBtn, setSelectBtn] = useState("Newest");
  const [initialList, setInitialList] = useState([]);
  //const [formValue, setFormValue] = useState(countryInitialValue);
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
      const { data } = await axiosOther.post("directClientlist");
      setInitialList(data?.DataList);
      setFilterValue(data?.DataList);
      // console.log(data?.DataList, "dataDataList");
    } catch (error) {
      console.log("agent-error", error);
    }
  };

  useEffect(() => {
    getListDataToServer();
  }, []);

  useEffect(() => {
    const filteredList = initialList?.filter(
      (data) =>
        data?.FirstName?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
        data?.Mobile?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
        data?.Address?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
        data?.Country?.Name?.toLowerCase()?.includes(
          filterInput?.toLowerCase()
        ) ||
        data?.State?.Name?.toLowerCase()?.includes(
          filterInput?.toLowerCase()
        ) ||
        data?.MiddleName?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
        data?.LastName?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
        data?.Gender?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
        data?.AnniversaryDate?.toLowerCase()?.includes(
          filterInput?.toLowerCase()
        ) ||
        data?.CompanyPhoneNumber?.toLowerCase()?.includes(
          filterInput?.toLowerCase()
        ) ||
        data?.CompanyEmailAddress?.toLowerCase()?.includes(
          filterInput?.toLowerCase()
        )
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
      width: "5rem",
    },

    {
      name: "Name",
      selector: (row) => row?.FirstName,
      cell: (row) => (
        <span
          onClick={() => navigate(`/view/client/${row?.id}`)}
          className="cursor-pointer"
        >
          {row?.FirstName} {row?.MiddleName} {row?.LastName}
        </span>
      ),
      sortable: true,
      wrap: true,
      width: "12rem",
    },
    {
      name: "Address",
      selector: (row) => row?.Address,
      cell: (row) => <span>{row?.Address}</span>,
      sortable: true,
      width: "8rem",
      wrap: true,
    },
    {
      name: "Gender",
      selector: (row) => row?.Gender,
      cell: (row) => <span>{row?.Gender}</span>,
      sortable: true,
      width: "8rem",
      wrap: true,
    },
    {
      name: "DOB",
      selector: (row) => row?.DOB,
      cell: (row) => <span>{row?.DOB}</span>,
      sortable: true,
      width: "8rem",
      wrap: true,
    },
    {
      name: "Anniversary Date",
      selector: (row) => row?.AnniversaryDate,
      cell: (row) => <span>{row?.AnniversaryDate}</span>,
      sortable: true,
      width: "9rem",
      wrap: true,
    },
    // {
    //   name: "Contactinfo",
    //   selector: (row) => <span>{row?.Contactinfo}</span>,
    //   sortable: true,
    //   width: "8rem",
    //   wrap: true,
    // },
    {
      name: "Country",
      selector: (row) => row?.Country?.Name,
      cell: (row) => <span>{row?.Country?.Name || "N/A"}</span>,
      sortable: true,
      width: "8rem",
      wrap: true,
    },
    {
      name: "State",
      selector: (row) => row?.State?.Name,
      cell: (row) => <span>{row?.State?.Name || "N/A"}</span>,
      sortable: true,
      width: "8rem",
      wrap: true,
    },
    {
      name: "Contact Info",
      selector: (row) =>
        row?.Contactinfo?.map((data) => data?.Mobile).filter(Boolean).join(", ") || "",
      cell: (row) => (
        <div>
          {row?.Contactinfo &&
            row?.Contactinfo.map((data, index) => <span>{data?.Mobile},</span>)}
        </div>
      ),
      sortable: true,
      width: "12rem",
      wrap: true,
    },
    {
      name: "Email",
      selector: (row) =>
        row?.Contactinfo?.map((data) => data?.Email).join(", ") || "",
      cell: (row) => (
        <div>
          {row?.Contactinfo &&
            row?.Contactinfo.map((data, index) => <span>{data?.Email},</span>)}
        </div>
      ),
      sortable: true,
      width: "12rem",
      wrap: true,
    },

    {
      name: "Accomodation Preference",
      selector: (row) =>row?.AccomodationPreference?.Name ,
      cell: (row) => (
        <span>{row?.AccomodationPreference?.Name || "N/A"}</span>
      ),
      sortable: true,
      width: "13rem",
      wrap: true,
    },
    {
      name: "Market Type",
      selector: (row) =>row?.MarketType?.Name,
      cell: (row) => <span>{row?.MarketType?.Name || "N/A"}</span>,
      sortable: true,
      width: "8rem",
      wrap: true,
    },

    // {
    //   name: "Facebook",
    //   selector: (row) => <span>{row.Facebook || "N/A"}</span>,
    //   sortable: true,
    //   wrap: true,
    //   width: "5rem",
    // },
    // {
    //   name: "Twitter",
    //   selector: (row) => <span>{row.Twitter || "N/A"}</span>,
    //   sortable: true,
    //   wrap: true,
    //   width: "5rem",
    // },
    // {
    //   name: "LinkedIn",
    //   selector: (row) => <span>{row.LinkedIn || "N/A"}</span>,
    //   sortable: true,
    //   wrap: true,
    //   width: "5rem",
    // },
    // {
    //   name: "Instagram",
    //   selector: (row) => <span>{row.Instagram || "N/A"}</span>,
    //   sortable: true,
    //   wrap: true,
    //   width: "5rem",
    // },
    // {
    //   name: "Skype",
    //   selector: (row) => <span>{row.Skype || "N/A"}</span>,
    //   sortable: true,
    //   wrap: true,
    //   width: "5rem",
    // },
    // {
    //   name: "MSN ID",
    //   selector: (row) => <span>{row.MSN_Id || "N/A"}</span>,
    //   sortable: true,
    //   wrap: true,
    //   width: "5rem",
    // },
    // {
    //   name: "Remark 1",
    //   selector: (row) => <span>{row.Remark1 || "N/A"}</span>,
    //   sortable: true,
    //   wrap: true,
    //   width: "5rem",
    // },
    // {
    //   name: "Remark 2",
    //   selector: (row) => <span>{row.Remark2 || "N/A"}</span>,
    //   sortable: true,
    //   wrap: true,
    //   width: "5rem",
    // },
    // {
    //   name: "Remark 3",
    //   selector: (row) => <span>{row.Remark3 || "N/A"}</span>,
    //   sortable: true,
    //   wrap: true,
    //   width: "5rem",
    // },
    // {
    //   name: "Sales Person",
    //   selector: (row) => <span>{row.SalesPerson || "N/A"}</span>,
    //   sortable: true,
    //   wrap: true,
    //   width: "5rem",
    // },
    // // {
    // //   name: "Status",
    // //   selector: (row) => <span>{row.Status || "Inactive"}</span>,
    // //   sortable: true,
    // //   wrap: true,
    // //   width: "8rem",
    // // },
    // {
    //   name: "Family Code",
    //   selector: (row) => <span>{row.FamilyCode || "N/A"}</span>,
    //   sortable: true,
    //   wrap: true,
    //   width: "5rem",
    // },

    // {
    //   name: "Covid Vaccinated",
    //   selector: (row) => <span>{row.CovidVaccinated || "N/A"}</span>,
    //   sortable: true,
    //   wrap: true,
    //   width: "5rem",
    // },
    // {
    //   name: "DocumentTitle",
    //   selector: (row) =>
    //     row.Documentation?.[0]?.DocumentTitle || "N/A",
    //   sortable: true,
    //   wrap: true,
    //   width: "5rem",
    // },
    // {
    //   name: "DocumentType",
    //   selector: (row) =>
    //     row.Documentation?.[0]?.DocumentType?.Name || "N/A",
    //   sortable: true,
    //   wrap: true,
    //   width: "5rem",
    // },
    // {
    //   name: "DocumentNo",
    //   selector: (row) =>
    //     row.Documentation?.[0]?.DocumentNo || "N/A",
    //   sortable: true,
    //   wrap: true,
    //   width: "5rem",
    // },
    // {
    //   name: "IssueDate",
    //   selector: (row) =>
    //     row.Documentation?.[0]?.IssueDate || "N/A",
    //   sortable: true,
    //   wrap: true,
    //   width: "5rem",
    // },
    // {
    //   name: "ExpiryDate",
    //   selector: (row) =>
    //     row.Documentation?.[0]?.ExpiryDate || "N/A",
    //   sortable: true,
    //   wrap: true,
    //   width: "5rem",
    // },
    // {
    //   name: "IssueCountry",
    //   selector: (row) =>
    //     row.Documentation?.[0]?.IssueCountry?.Name || "N/A",
    //   sortable: true,
    //   wrap: true,
    //   width: "5rem",
    // },
    // // {
    // //   name: "Doc",
    // //   selector: (row) =>
    // //     row.Documentation?.[0]?.UploadDocument ? (
    // //       <a
    // //         href={row.Documentation[0].UploadDocument}
    // //         target="_blank"
    // //         rel="noopener noreferrer"
    // //       >
    // //         View
    // //       </a>
    // //     ) : (
    // //       "No Doc"
    // //     ),
    // //   sortable: false,
    // //   wrap: true,
    // //   width: "5rem",
    // // },

    // {
    //   name: "Newsletter",
    //   selector: (row) => <span>{row.NewsLetter || "N/A"}</span>,
    //   sortable: true,
    //   wrap: true,
    //   width: "5rem",
    // },
    // {
    //   name: "Emergency Contact Name",
    //   selector: (row) => <span>{row.EmergencyContactName || "N/A"}</span>,
    //   sortable: true,
    //   wrap: true,
    //   width: "5rem",
    // },
    // {
    //   name: "Relation",
    //   selector: (row) => <span>{row.Relation || "N/A"}</span>,
    //   sortable: true,
    //   wrap: true,
    //   width: "5rem",
    // },
    // {
    //   name: "Emergency Contact Number",
    //   selector: (row) => <span>{row.EmergencyContactNumber || "N/A"}</span>,
    //   sortable: true,
    //   wrap: true,
    //   width: "5rem",
    // },
    // {
    //   name: "Query ID",
    //   selector: (row) => <span>{row.QueryId || "N/A"}</span>,
    //   sortable: true,
    //   wrap: true,
    //   width: "5rem",
    // },
    // {
    //   name: "Tour ID",
    //   selector: (row) => <span>{row.TourId || "N/A"}</span>,
    //   sortable: true,
    //   wrap: true,
    //   width: "5rem",
    // },
    // {
    //   name: "Reference ID",
    //   selector: (row) => <span>{row.ReferenceId || "N/A"}</span>,
    //   sortable: true,
    //   wrap: true,
    //   width: "5rem",
    // },
    // {
    //   name: "Agent",
    //   selector: (row) => <span>{row.Agent || "N/A"}</span>,
    //   sortable: true,
    //   wrap: true,
    //   width: "5rem",
    // },
    {
      name: "Status",
      selector: (row) =>row?.Status,
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
      width: "4.5rem",
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
      width: "4.5rem",
    },
  ];

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (value) => {
    navigate("/add-client", { state: value });
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
        const { data } = await axiosOther.post("deletedirectClient", { id });
        if (data?.Status === 1 || data?.status === 1) {
          notifySuccess(data?.Message || data?.message || data?.error);
          getListDataToServer();
        }
      } catch (err) {
        notifyError(err?.message || err?.Message);
      }
    }
  };
  useEffect(() => {
    const getMessage = localStorage.getItem("success-message");
    if (getMessage != null) {
      notifySuccess(getMessage);
      localStorage.removeItem("success-message");
    }
  }, []);

  return (
    <>
      <Tab.Container defaultActiveKey="All">
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <div className="card-action coin-tabs mb-2 d-flex gap-4">
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
            <div className="guest-calendar"></div>
            <div className="newest ms-3 d-flex gap-2">
              <button
                className="btn btn-dark btn-custom-size"
                name="SaveButton"
                onClick={() => navigate(-1)}
              >
                <span className="me-1">Back</span>
                <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
              </button>
              <Link
                to={"/add-client"}
                className="btn btn-primary btn-custom-size"
              >
                Add Direct Client
              </Link>
            </div>
          </div>
        </div>
        <ToastContainer />
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

export default Client;
