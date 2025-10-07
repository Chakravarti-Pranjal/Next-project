import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  Col,
  Container,
  Dropdown,
} from "react-bootstrap";
import { Tab, Nav, Button } from "react-bootstrap";
import { axiosOther } from "../../../../http/axios_base_url.js";
import { Modal, Row, Table } from 'react-bootstrap';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import UseTable from "../../../../helper/useTable.jsx";
import { notifySuccess, notifyError } from "../../../../helper/notify.jsx";
import swal from "sweetalert";
import extractTextFromHTML from "../../../../helper/htmlParser.js";
import { color } from "highcharts";
import { Padding } from "@mui/icons-material";
import UseTable from "../../../../helper/UseTable.jsx";

const Distancelist = () => {
  const navigate = useNavigate();
  const [validationErrors, setValidationErrors] = useState({});
  const [initialList, setInitialList] = useState([]);
  const [filterValue, setFilterValue] = useState([]);
  const [filterInput, setFiterInput] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [modalCentered, setModalCentered] = useState(false);
  const [costViewData, setCostViewData] = useState([]);

  const handlePageChange = (page) => setCurrentPage(page - 1);
  const handleRowsPerPageChange = (newRowsPerPage) =>
    setRowsPerPage(newRowsPerPage);

  const getListDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("list-distance");
      // console.log("API Response:",data);
      setInitialList(data?.DataList);
      setFilterValue(data?.DataList);
      // console.log("API Responsess:",data?.Data);
    } catch (error) {
      console.log("Error fetching monument data:", error);
    }
  };

  useEffect(() => {
    getListDataToServer();
  }, []);

  //   const handleFormChange = (e) => {
  //     const { name, value } = e.target;
  //     setBusinessData((prev) => ({
  //       ...prev,
  //       [name]: value,
  //     }));
  //   };

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

  const handleDelete = async (Id) => {
    // console.log("id Response:", id);
    const confirmation = await swal({
      title: "Are you sure want to Delete?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });
    try {
      const { data } = await axiosOther.post("fit-or-gitdelete", { Id });
      // console.log("API Response:", data);
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
    // console.log(data,"data");

    setInitialList({
      id: data?.id,
      FromDestinationName: data?.FromDestinationName,
      ToDestination: data?.ToDestination, // Already an array, no need for modification
    });

    navigate("/distance-add", { state: data });
  };

  const handleCostView = (row) => {
    setModalCentered(true);
    setCostViewData(row.ToDestination);
  };
  // console.log(row,"cost")



  const table_columns = [

    {
      name: "Sr. No.",
      selector: (row, index) => (
        <span className="font-size-11">
          {currentPage * rowsPerPage + index + 1}
        </span>
      ),
      width: "15rem",

    },
    {
      name: "From Destination ",
      selector: (row) => row?.FromDestinationName,
      cell: (row) => <span>{row.FromDestinationName}</span>,
      sortable: true,
      width: "22rem",
      wrap: true,
    },
    {
      name: "To Destination ",
      selector: (row) =>
        row.ToDestination?.map(dest => dest?.ToDestinationName)
          .filter(Boolean)
          .join(", ") || "",
      cell: (row) => <span>{row.ToDestination?.map(dest => dest.ToDestinationName).join(", ")} </span>,
      sortable: true,
      // width: "12rem",
      wrap: true,
      width: "20rem",
    }, {
      name: "Distance Km/Time",

      selector: (row) => <Button variant="dark light py-1 rounded-pill" onClick={() => handleCostView(row)} ><span> View</span></Button>,
      width: "22rem",
      wrap: true,
    },

    {
      name: "Action",
      cell: (row) => (
        <span className="d-flex gap-1">
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
      // width: "4.5rem",
    },
  ];

  return (

    <>
      <Modal show={modalCentered} onHide={() => setModalCentered(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Price Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {costViewData.length > 0 ? (
            <Table striped bordered responsive>
              <thead>
                <tr>
                  <th>Distance Km</th>
                  <th>Distance Time</th>
                </tr>
              </thead>
              <tbody>
                {costViewData.map((dest, index) => (
                  <tr key={index}>
                    <td>{dest.DistanceKm || "-"}</td>
                    <td>{dest.DistanceTime || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-center">No records found!</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => setModalCentered(false)}
            variant="danger light"
            className="btn-custom-size"
          >
            Close
          </Button>
          {/* <Button variant="primary" className="btn-custom-size">
            Save
          </Button> */}
        </Modal.Footer>
      </Modal>

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
              to="/distance-add"
              className="btn btn-primary btn-custom-size"
            >
              Add Distance
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

export default Distancelist;
