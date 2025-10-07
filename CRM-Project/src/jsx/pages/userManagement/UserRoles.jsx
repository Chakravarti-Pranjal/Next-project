import React, { useEffect, useRef, useState } from "react";
import UseTable from "../../../helper/UseTable";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { axiosOther } from "../../../http/axios_base_url";
import { Dropdown, Tab, Nav, Badge, Button } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CompanyDetailsModal from "./CompanyDetailsModal.jsx";
import { notifyError, notifySuccess } from "../../../helper/notify.jsx";

const UserRoles = () => {
  const formRef = useRef(null);
  const { state } = useLocation();
  const [initialList, setInitialList] = useState([]);
  const [filterValue, setFilterValue] = useState([]);
  const [filterInput, setFiterInput] = useState("");

  const navigate = useNavigate();
  const handlePageChange = (page) => setCurrentPage(page - 1);
  const handleRowsPerPageChange = (newRowsPerPage) =>
    setRowsPerPage(newRowsPerPage);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const getListDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("listroles");
      setInitialList(data?.Datalist);
      setFilterValue(data?.Datalist);
      console.log({ data });
    } catch (error) {
      console.log("user-error", error);
    }
  };

  useEffect(() => {
    getListDataToServer();
  }, []);

  useEffect(() => {
    const filteredList = initialList?.filter((data) =>
      data?.name?.toLowerCase()?.includes(filterInput?.toLowerCase())
    );
    setFilterValue(filteredList);
  }, [filterInput]);

  // Handler Role ID
  const handleUserCode = (user) => {
    navigate("/role-permission", { state: { data: user } });
  };
  const handleEdit = (value) => {
    console.log(value, "value")
    navigate("/add-role", { state: value });
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
        const { data } = await axiosOther.post("deleteroles", { id });
        if (data?.Status == 1) {
          notifySuccess(data?.Message || data?.message || data?.result);
          getListDataToServer();
        }
      } catch (err) {
        notifyError(err?.message || err?.Message);
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
      sortable: false,
      width: "5rem",
    },

    {
      name: "Name",
      selector: (row) => row?.name,
      cell: (row) => <span>{row?.name}</span>,
      sortable: true,
      width: "20rem",
    },
    {
      name: "Company Name",
      selector: (row) => row?.
        company_name
      ,
      cell: (row) => <span>{row?.
        company_name
      }</span>,
      sortable: true,
      width: "20rem",
    },
    {
      name: "Permission",
      selector: (row) => (
        <Button
          onClick={() => handleUserCode(row)}
          variant="dark light py-1  rounded-pill"
        >
          view
        </Button>
      ),
      sortable: true,
      // width: "10rem",
    },
    {
      name: "Action",
      selector: (row) => (
        <div className="d-flex align-items-center gap-1 sweetalert">
          <i
            className="fa-solid fa-pencil cursor-pointer text-success action-icon"
            onClick={() => handleEdit(row)}
          ></i>
          <i
            className="fa-solid fa-trash-can cursor-pointer text-danger action-icon sweet-confirm"
            onClick={() => handleDelete(row?.id)}
          ></i>
        </div>
      ),
      width: "6rem",
    },
  ];

  return (
    <div className="row">
      <Tab.Container defaultActiveKey="All">
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <div className="card-action coin-tabs mb-2">
            <Nav as="ul" className="nav nav-tabs">
              <Nav.Item as="li" className="nav-item">
                <Nav.Link className="nav-link" eventKey="All">
                  Roles
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
                onClick={() => navigate("/masters")}
              >
                <span className="me-1">Back</span>
                <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
              </button>
              <Link
                to={"/add-role"}
                className="btn btn-primary btn-custom-size"
              >
                Create Roles
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
    </div>
  );
};

export default UserRoles;
