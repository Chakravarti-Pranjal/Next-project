import React, { useState, useEffect, useRef } from "react";
import { useNavigate, NavLink, Link } from "react-router-dom";
import "bootstrap-daterangepicker/daterangepicker.css";
import { Dropdown, Tab, Nav } from "react-bootstrap";
import { axiosOther } from "../../../../http/axios_base_url";
import swal from "sweetalert";
import { notifySuccess, notifyError } from "../../../../helper/notify.jsx";
import UseTable from "../../../../helper/UseTable.jsx";
import { scrollToTop } from "../../../../helper/scrollToTop.js";
import { wrap } from "highcharts";

const Country = () => {
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
      const { data } = await axiosOther.post("guidelist");
      setInitialList(data?.DataList);
      setFilterValue(data?.DataList);
    } catch (error) {
      console.log("country-error", error);
    }
  };

  useEffect(() => {
    getListDataToServer();
  }, []);

  useEffect(() => {
    const filteredList = initialList?.filter(
      (data) =>
        data?.Name?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
        data?.ServiceType?.toLowerCase()?.includes(
          filterInput?.toLowerCase()
        ) ||
        data?.MobileNumber?.toLowerCase()?.includes(
          filterInput?.toLowerCase()
        ) ||
        data?.Email?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
        data?.GuideLicense?.toLowerCase()?.includes(
          filterInput?.toLowerCase()
        ) ||
        data?.ContactPerson?.toLowerCase()?.includes(
          filterInput?.toLowerCase()
        ) ||
        data?.Designation?.toLowerCase()?.includes(filterInput?.toLowerCase())
    );
    setFilterValue(filteredList);
  }, [filterInput]);
  // console.log("in", initialList);

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
      // style: {
      //   display: "flex",
      //   justifyContent: "center",
      // },
    },
    {
      name: "Guide Name",
      selector: (row) => row?.Name,
      cell: (row) => <span>{row?.Name}{" "}
        {row?.Default == 1 && (
          <i className="mdi mdi-check-circle-outline text-success fs-4"></i>
        )}
      </span>,
      sortable: true,
      wrap: true,
    },
    {
      name: "Service Type",
      selector: (row) => row?.ServiceType,
      cell: (row) => <span>{row?.ServiceType}</span>,
      sortable: true,
      width: "7rem",
    },
    {
      name: "Destination",
      selector: (row) =>
        row?.Destination?.map((dest) => dest?.DestinationName).join(",") || "",
      cell: (row) => (
        <span>{row?.Destination?.map((dest) => dest?.DestinationName).join(",")}</span>
      ),
      sortable: true,
      width: "10rem",
      wrap: true,
    },
    {
      name: "Email/Phone",
      selector: (row) => row?.Email,
      cell: (row) => (
        <span>
          {row?.Email} {row?.MobileNumber}
        </span>
      ),
      sortable: true,
      style: { padding: "2px 10px" },
      width: "13rem",
      wrap: true,
    },
    {
      name: "Rating",
      selector: (row) => row?.Rating,
      cell: (row) => <span>{row?.Rating} Star</span>,
      sortable: true,
      width: "4rem",
      wrap: true,
    },
    {
      name: "Address",
      selector: (row) => row?.Address,
      cell: (row) => <span>{row?.Address}</span>,
      sortable: true,
      style: { padding: "2px 10px" },
      width: "12rem",
      wrap: true,
    },
    {
      name: "Language",
      selector: (row) =>
        row?.Languages?.map((language) => language?.LanguageName)
          .filter((name) => name)
          .join(", ") || "",
      cell: (row) => (
        <span>
          {" "}
          {row?.Languages?.map((language) => language?.LanguageName)
            .filter((name) => name) // Filter out blank or undefined values
            .join(", ")}
        </span>
      ),
      sortable: true,
      width: "10rem",
      wrap: true,
    },
    {
      name: "Details",
      selector: (row) => row?.Details,
      cell: (row) => <span>{row?.Details}</span>,
      sortable: true,
      width: "8rem",
      wrap: true,
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
    navigate("/guide/add", { state: value });
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
        const { data } = await axiosOther.post("deleteguide", { id });
        if (data?.Status === 1 || data?.status === 1) {
          notifySuccess(data?.Message || data?.message || data?.error);
          getListDataToServer();
        }
      } catch (err) {
        notifyError(err?.message || err?.Message);
      }
    }
  };

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
                to={"/guide/add"}
                className="btn btn-primary btn-custom-size"
              >
                Add Guide
              </Link>
            </div>
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

export default Country;
