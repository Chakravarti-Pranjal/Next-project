import React, { useEffect, useRef, useState } from "react";
import UseTable from "../../../helper/UseTable";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { axiosOther } from "../../../http/axios_base_url";
import { Dropdown, Tab, Nav, Badge, Button } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { scrollToTop } from "../../../helper/scrollToTop.js";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import CompanyDetailsModal from "./CompanyDetailsModal.jsx";
import { notifySuccess } from "../../../helper/notify.jsx";
const CompanyList = () => {
  const formRef = useRef(null);
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

  // Details Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isCompanyDelete, setIsCompanyDelete] = useState(false);

  const handleDetailsModal = (row) => {
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
      const { data } = await axiosOther.post("companylist", {
        ID: "",
        Search: "",
      });
      console.log("Comapny log data", data);
      setInitialList(data?.DataList);
      setFilterValue(data?.DataList);
      console.log(data?.DataList[1].REGISTEREDEMAIL);
    } catch (error) {
      console.log("user-error", error);
    }
  };

  useEffect(() => {
    getListDataToServer();
  }, []);

  useEffect(() => {
    getListDataToServer();
  }, [isCompanyDelete]);
  useEffect(() => {
    console.log("API data: ", { initialList });
    const filteredList = initialList?.filter(
      (data) =>
        data?.COMPANYNAME?.toLowerCase()?.includes(
          filterInput?.toLowerCase()
        ) ||
        data?.REGISTEREDEMAIL?.toLowerCase()?.includes(
          filterInput?.toLowerCase()
        ) ||
        data?.ISACTIVE?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
        String(data?.PHONE || "")
          .toLowerCase()
          .includes(filterInput.toLowerCase())
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

      style: {},
    },

    // {
    //   name: "Id",
    //   selector: (row) => row?.ID,
    //   cell: (row, index) => <span className="font-size-11">{row?.ID}</span>,
    //   sortable: true,
    //   width: "4rem",
    //   style: { gap: "1rem" },
    // },

    {
      name: "Name",
      selector: (row) => row?.COMPANYNAME,
      cell: (row) => (
        <span
          onClick={() => navigate("/user", { state: { userList: row?.ID } })}
        >
          {row?.COMPANYNAME}
        </span>
      ),
      sortable: true,
      width: "10rem",
    },
    {
      name: "Email",
      selector: (row) => row?.REGISTEREDEMAIL,
      cell: (row) => <span>{row?.REGISTEREDEMAIL}</span>,
      sortable: true,
      width: "14rem",
    },

    {
      name: "Phone",
      selector: (row) => row?.PHONE,
      cell: (row) => <span>{row?.PHONE}</span>,
      sortable: true,
      width: "8rem",
    },
    {
      name: "License Key",
      selector: (row) => row?.LICENSEKEY,
      cell: (row) => <span>{row?.LICENSEKEY}</span>,
      sortable: true,
      width: "8rem",
    },
    {
      name: "Address",
      selector: (row) => row?.ADDRESS1,
      cell: (row) => <span>{row?.ADDRESS1}</span>,
      sortable: true,
      width: "14rem",
    },
    {
      name: "PAN",
      selector: (row) => row?.PAN,
      cell: (row) => <span>{row?.PAN}</span>,
      sortable: true,
      width: "8rem",
    },
    {
      name: "CIN",
      selector: (row) => row?.CIN,
      cell: (row) => <span>{row?.CIN}</span>,
      sortable: true,
      width: "8rem",
    },
    {
      name: "Details",
      selector: (row) => (
        <div className="d-flex gap-3">
          <Button
            onClick={() => handleDetailsModal(row)}
            variant="dark light py-1  rounded-pill fs-6"
          >
            show
          </Button>
          <Button
            onClick={() => navigate("/add-edit-office", { state: { data: row } })}
            variant="dark light py-1  rounded-pill fs-6"
          >
            Add/Edit Office
          </Button>
        </div>
      ),
      width: "16rem",
    },
    {
      name: "Add",
      selector: (row) => (
        <div className="d-flex gap-3">
          <Button
            onClick={() => navigate("/create-user", { state: { data: row } })}
            variant="dark light py-1  rounded-pill fs-6"
          >
            Add user
          </Button>
          <Button
            onClick={() => navigate("/user", { state: { data: row } })}
            variant="dark light py-1  rounded-pill fs-6"
          >
            view
          </Button>
        </div>
      ),
      width: "16rem",
    },

    {
      name: "Status",
      selector: (row) => row?.ISACTIVE,
      cell: (row) => (
        <span
          className={`badge ${row.ISACTIVE === "Active"
            ? "badge-success light badge"
            : "badge-danger light badge"
            }`}
        >
          {row.ISACTIVE}
        </span>
      ),
      sortable: true,
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
            onClick={() => handleDelete(row?.ID)}
          ></i>
        </div>
      ),
    },
  ];

  const handleEdit = (value) => {
    console.log(value);
    navigate("/create-company", { state: value });
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
        const { data } = await axiosOther.post("deletecompany", { id });
        console.log(data);
        if (data?.Status == 1) {
          notifySuccess(data?.Message || data?.message || data?.result);
          setIsCompanyDelete(true);
          getListDataToServer();
        }
      } catch (err) {
        notifyError(err?.message || err?.Message);
      }
    }
  };

  // Seach Functionality
  const handleSeach = () => {
    const filteredList = initialList?.filter(
      (data) =>
        data?.COMPANYNAME?.toLowerCase()?.includes(
          filterInput?.toLowerCase()
        ) ||
        data?.REGISTEREDEMAIL?.toLowerCase()?.includes(
          filterInput?.toLowerCase()
        ) ||
        data?.ISACTIVE?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
        String(data?.PHONE || "")
          .toLowerCase()
          .includes(filterInput.toLowerCase())
    );
    console.log(filteredList);
    setFilterValue(filteredList);
  };

  return (
    <div className="row">
      <CompanyDetailsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        rowData={selectedRow}
      />
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
                  placeholder="Search..."
                  onChange={(e) => setFiterInput(e.target.value)}
                />
                <span
                  onClick={handleSeach}
                  className="input-group-text border cursor-pointer"
                >
                  <i className="flaticon-381-search-2"></i>
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
                to={"/create-company"}
                className="btn btn-primary btn-custom-size"
              >
                Create Company
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

export default CompanyList;
