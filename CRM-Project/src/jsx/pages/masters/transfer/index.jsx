import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tab, Nav, Button } from "react-bootstrap";
import { axiosOther } from "../../../../http/axios_base_url.js";
import { transferMasterInitialValue } from "../masters_initial_value.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import UseTable from "../../../../helper/useTable.jsx";
import { notifySuccess, notifyError } from "../../../../helper/notify.jsx";
import swal from "sweetalert";
import UseTable from "../../../../helper/UseTable.jsx";

const Transfer = () => {
  const navigate = useNavigate();
  const [intialData, setIntitialData] = useState(transferMasterInitialValue);
  const [intitialList, setIntitialList] = useState([]);
  const [filterValue, setFilterValue] = useState([]);
  const [filterInput, setFiterInput] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handlePageChange = (page) => setCurrentPage(page - 1);
  const handleRowsPerPageChange = (newRowsPerPage) =>
    setRowsPerPage(newRowsPerPage);

  const getListDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("transfermasterlist");

      setIntitialList(data?.DataList);
      setFilterValue(data?.DataList);
    } catch (error) {
      console.log("Error fetching monument data:", error);
    }
  };

  useEffect(() => {
    getListDataToServer();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setIntitialData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  useEffect(() => {
    const filteredList = intitialList?.filter(
      (data) =>
        data?.TransferName?.toLowerCase()?.includes(
          filterInput?.toLowerCase()
        ) ||
        data?.Destinations?.toLowerCase()?.includes(
          filterInput?.toLowerCase()
        ) ||
        data?.Details?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
        data?.TransferType?.toLowerCase()?.includes(filterInput?.toLowerCase())
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
      const { data } = await axiosOther.post("deletetransfermaster", { id });
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
    setIntitialData({
      id: data?.id,
      TransferName: data?.TransferName,
      Destinations: data?.Destinations,
      Detail: data?.Detail,
      Status: data?.Status == "Active" ? "1" : "0",
    });
    navigate("/transfer/add", { state: data });
  };

  const table_columns = [
    {
      name: "Sr. No.",
      selector: (row, index) => (
        <span className="font-size-11">
          {currentPage * rowsPerPage + index + 1}
        </span>
      ),
      width: "6rem",
    },
    {
      name: "Transfer Name",
      selector: (row) => row?.TransferName,
      cell: (row) => <span>{row.TransferName}</span>,
      sortable: true,
      width: "12rem",
      wrap: true,
    },
    {
      name: "Destination",
      selector: (row) =>
        row?.DestinationId?.map((dest) => dest?.DestinationName)
          .filter((name) => name)
          .join(", ") || "",
      cell: (row) => (
        <span>
          {" "}
          {row?.DestinationId?.map((dest) => dest?.DestinationName)
            .filter((name) => name) // Filter out blank or undefined values
            .join(", ")}
        </span>
      ),
      sortable: true,
      width: "12rem",
      wrap: true,
    },
    {
      name: "Transfer Type",
      selector: (row) => row?.TransferTypeName,
      cell: (row) => <span>{row.TransferTypeName}</span>,
      sortable: true,
      width: "12rem",
      wrap: true,
    },
    {
      name: "Details",
      selector: (row) => row?.Details,
      cell: (row) => <span>{row?.Details}</span>,
      sortable: true,
      width: "20rem",
    },

    {
      name: "Rate Sheet",
      selector: (row) => (
        <Link
          to={`/transfer/rate/${row?.id}`}
          state={{ ...row, Master: "Transfer" }}
        >
          <Button variant="dark light py-1 rounded-pill"><span>View/Add</span></Button>
        </Link>
      ),
      width: "10rem",
    },
    {
      name: "Status",
      selector: (row) => row?.Status,
      cell: (row) => (
        <span
          className={`badge ${row.Status == "1" ? "bg-success" : "bg-danger"}`}
        >
          {row.Status == 1 ? "Active" : "Inactive"}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <span className="d-flex gap-1">
          <i
            className="fa fa-pencil cursor-pointer action-icon text-success"
            data-toggle="modal"
            data-target="#modal_form_vertical"
            onClick={() => handleEdit(row)}
          ></i>
          <i
            className="fa fa-trash cursor-pointer action-icon text-danger"
            onClick={() => handleDelete(row?.id)}
          ></i>
        </span>
      ),
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
              to="/transfer/add"
              className="btn btn-primary btn-custom-size"
            >
              Add Transfer
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

export default Transfer;
