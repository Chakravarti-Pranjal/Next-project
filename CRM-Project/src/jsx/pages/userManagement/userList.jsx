import React, { useEffect, useRef, useState } from "react";
import UseTable from "../../../helper/UseTable";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { axiosOther } from "../../../http/axios_base_url";
import { Dropdown, Tab, Nav, Badge, Button } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { scrollToTop } from "../../../helper/scrollToTop.js";
import CompanyDetailsModal from "./CompanyDetailsModal.jsx";
import { notifyError, notifySuccess } from "../../../helper/notify.jsx";
// import { ToastContainer } from "react-toastify";

const UserList = () => {
  const formRef = useRef(null);
  const { state } = useLocation();
  const [initialList, setInitialList] = useState([]);
  const [filterValue, setFilterValue] = useState([]);
  const [filterInput, setFiterInput] = useState("");
  const [formValue, setFormValue] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const handlePageChange = (page) => setCurrentPage(page - 1);
  const handleRowsPerPageChange = (newRowsPerPage) =>
    setRowsPerPage(newRowsPerPage);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  //   User Details Modal

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const [isDeleteData, setIsDeleteData] = useState(false);

  const handleUserDetailsModal = (row) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRow(null);
  };

  // End Details Modal

  const getListDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("listusers");

      // if (state?.data?.name) {
      //   setInitialList(data?.Datalist);
      //   const filteredList = initialList?.filter((data) =>
      //     data?.Name?.toLowerCase()?.includes(state?.data?.name.toLowerCase())
      //   );

      //   setFilterValue(filteredList);
      //   return;
      // }

      setInitialList(data?.Datalist);
      setFilterValue(data?.Datalist);
      console.log(data?.Datalist, "datalisttt")
    } catch (error) {
      console.log("user-error", error);
    }
  };

  useEffect(() => {
    getListDataToServer();
  }, []);
  // useEffect(() => {
  //   getListDataToServer();
  // }, [filterValue]);
  useEffect(() => {
    getListDataToServer();
  }, [isDeleteData]);
  useEffect(() => {
    if (state?.userList) {
      const filteredList = initialList?.filter(
        (data) => data?.CompanyId == state?.userList
      );
      setFilterValue(filteredList);
    }
  }, [state?.userList]);

  useEffect(() => {
    const filteredList = initialList?.filter(
      (data) =>
        data?.Name?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
        data?.ShortName?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
        data?.Status?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
        data?.Email?.toLowerCase()?.includes(filterInput?.toLowerCase())
    );
    setFilterValue(filteredList);
  }, [filterInput]);

  // Handler User Code
  // const handleUserCode = (user) => {
  //   navigate("/profile", { state: { data: user } });
  // };
  const handleUserCode = (user) => {
    navigate("/user-permission", { state: { data: user } });
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
    // {
    //   name: "User Code",
    //   selector: (row) => (
    //     <span
    //       onClick={() => handleUserCode(row)}
    //       className="text-success custom-hover-userList custom-color-userList"
    //     >
    //       {row?.UserCode}
    //     </span>
    //   ),
    //   sortable: true,
    //   width: "6rem",
    // },
    {
      name: "Phone",
      selector: (row) => row?.Phone,
      cell: (row) => <span>{row?.Phone}</span>,
      sortable: true,
      width: "10rem",
    },
    {
      name: "Name",
      selector: (row) => row?.Name,
      cell: (row) => <span>{row?.Name}</span>,
      sortable: true,
      width: "10rem",
    },
    {
      name: "Email",
      selector: (row) => row?.Email,
      cell: (row) => <span>{row?.Email}</span>,
      sortable: true,
    },
    {
      name: "Company Name",
      selector: (row) => row?.CompanyKey,
      cell: (row) => <span>{row?.CompanyKey}</span>,
      sortable: true,
    },
    {
      name: "Permissions",
      selector: (row) => (
        <Button
          onClick={() => handleUserCode(row)}
          variant="dark light py-1  rounded-pill"
        >
          view
        </Button>
      ),
      sortable: true,
      width: "10rem",
    },
    {
      name: "Role",
      selector: (row) => row?.role?.join(", "),
      cell: (row) => (
        <>
          {row?.role.map((data, index) => (
            <span
              class="badge text-white py-1 px-2"
              style={{ background: "rgb(44, 161, 204)" }}
            >
              {data}
            </span>
          ))}
        </>
      ),
      sortable: true,
      width: "10.5rem",
    },
    {
      name: "Details",
      selector: (row) => (
        <Button
          onClick={() => handleUserDetailsModal(row)}
          variant="dark light py-1  rounded-pill"
        >
          show
        </Button>
      ),
      sortable: false,
      width: "10rem",
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
      selector: (row) => (
        <div className="d-flex align-items-center gap-1 sweetalert">
          <i
            className="fa-solid fa-pencil cursor-pointer text-success action-icon"
            onClick={() => handleEdit(row)}
          //    onChange={scrollToTop()}
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
  const handleEdit = (value) => {
    console.log(value, "value")
    navigate("/create-user", { state: { data: value } });
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
        const { data } = await axiosOther.post("deleteusers", { id });

        if (data?.Status === 1) {
          notifySuccess("User deleted successfully");
          getListDataToServer();
          setIsDeleteData(true);
        }
      } catch (err) {
        console.log(err);
        notifyError(err?.message || err?.Message);
      }
    }
  };

  return (
    <div className="row">
      <CompanyDetailsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        rowData={selectedRow}
      />
      <ToastContainer />
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
                to={"/create-user"}
                className="btn btn-primary btn-custom-size"
              >
                Create User
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

export default UserList;
