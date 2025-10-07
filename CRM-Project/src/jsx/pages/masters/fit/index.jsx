import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tab, Nav, Button } from "react-bootstrap";
import { axiosOther } from "../../../../http/axios_base_url.js";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UseTable from "../../../../helper/useTable.jsx";
import { notifySuccess, notifyError } from "../../../../helper/notify.jsx";
import swal from "sweetalert";
import extractTextFromHTML from "../../../../helper/htmlParser.js";

const Fit = () => {
  const navigate = useNavigate();
  const [validationErrors, setValidationErrors] = useState({});
  const [initialList, setInitialList] = useState([]);
  const [filterValue, setFilterValue] = useState([]);
  const [filterInput, setFiterInput] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handlePageChange = (page) => setCurrentPage(page - 1);
  const handleRowsPerPageChange = (newRowsPerPage) =>
    setRowsPerPage(newRowsPerPage);

  const getListDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("fitmasterlist");
      // console.log("API Response:", data); 
      setInitialList(data.ItineraryInfoMaster);
      setFilterValue(data.ItineraryInfoMaster);
    } catch (error) {
      console.log("Error fetching monument data:", error);
    }
  };

  useEffect(() => {
    getListDataToServer();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setBusinessData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const filteredList = initialList?.filter(
      (data) =>

        data?.DestinationName?.toLowerCase()?.includes(
          filterInput?.toLowerCase()
        ) ||
        data?.Status?.toLowerCase()?.includes(filterInput?.toLowerCase())
    );
    setFilterValue(filteredList);
  }, [filterInput]);

  const handleDelete = async (id) => {
    const confirmation = await swal({
      title: "Are you sure want to Delete?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });
    try {
      const { data } = await axiosOther.post("deletefit", { id });
      if (data?.Status == 1 || data?.status == 1) {
        notifySuccess(data?.Message || data?.message || data?.result);
        getListDataToServer();
      }
    } catch (err) {
      if (err) {
        alert(err?.message || err?.Message);
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

  const handleEdit = (data) => {
    setInitialList({
      id: data?.id,
      DestinationId: [1, 2],
      SetDefault: data.SetDefault === "Yes" ? 1 : 0,
      Status: data.Status === "Active" ? 1 : 0,
    });
    navigate("/fit/add", { state: data });
  };

  const table_columns = [
    {
      name: "Sr. No.",
      selector: (row, index) => (
        <span className="font-size-11">
          {currentPage * rowsPerPage + index + 1}
        </span>
      ),
      width: "4rem",
      // style: {
      //   display: "flex",
      //   justifyContent: "center",
      // },
    },
    {
      name: "Name",
      selector: (row) => row.Name,
      cell: (row) => <span>{row.Name}</span>,
      sortable: true,
      width: "12rem",
      wrap: true,
    },
    {
      name: "Destination ",
      selector: (row) => row.DestinationName,
      cell: (row) => <span>{row.DestinationName}</span>,
      sortable: true,
      width: "12rem",
      wrap: true,
    },
    {
      name: "Inclusion",
      selector: (row) => row.Inclusion,
      cell: (row) => extractTextFromHTML(row.Inclusion),
      sortable: true,
      width: "15rem",
      wrap: true,
    },
    {
      name: "Exclusion",
      selector: (row) => row.Exclusion,
      cell: (row) => extractTextFromHTML(row.Exclusion),
      sortable: true,
      width: "4.5 rem",

    },


    {
      name: "Status",
      selector: (row) => row.Status,
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
      cell: (row) => (
        <span className="d-flex align-items-center gap-1">
          <i
            className="fa fa-pencil cursor-pointer action-icon text-success"
            onClick={() => handleEdit(row)}
          ></i>
          <i
            className="fa fa-trash cursor-pointer action-icon text-danger"
            onClick={() => handleDelete(row?.id)}
          ></i>
        </span>
      ),
      width: "4.5rem",
    },
  ];

  return (
    <>
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
          <div className="d-flex gap-3">
            <button
              className="btn btn-dark btn-custom-size"
              name="SaveButton"
              onClick={() => navigate(-1)}
            >
              <span className="me-1">Back</span>
              <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
            </button>
            <Link
              to="/fit/add"
              className="btn btn-primary btn-custom-size"
            >
              Add Fit
            </Link>
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

export default Fit;
