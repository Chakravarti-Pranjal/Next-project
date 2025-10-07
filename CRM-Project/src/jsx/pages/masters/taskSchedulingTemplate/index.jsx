import React, { useState, useEffect, useContext } from "react";
import "bootstrap-daterangepicker/daterangepicker.css";
import { Tab, Nav, Button } from "react-bootstrap";
import { axiosOther } from "../../../../http/axios_base_url";
import { NavLink, Link, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { table_custom_style } from "../../../../css/custom_style";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeContext } from "../../../../context/ThemeContext";
import { MdNavigateNext } from "react-icons/md";
import { MdOutlineSkipNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import Select from "react-select";
import { MdOutlineSkipPrevious } from "react-icons/md";
import { useLocation } from "react-router-dom";

const TaskSchedulingTemplate = () => {
  const { background } = useContext(ThemeContext);
  const [selectedValue, setSelectedValue] = useState(null);
  const [Category, setCategory] = useState({
    HotelCategory: "",
  });
  const [initialList, setInitialList] = useState([]);
  const [filterValue, setFilterValue] = useState([]);
  const [destinationlist, setdestinationlist] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState("");
  const [selecthotelname, setselecthotelname] = useState("");
  const [selectedHotel, setSelectedHotel] = useState("");
  const [hotellist, sethotellist] = useState([]);
  const [filterInput, setFiterInput] = useState("");
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPage, setTotalPage] = useState("");
  const [companydata, setcompanydata] = useState(null);
  const [userId, setUserId] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const location = useLocation();

  const getListDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("list-taskscheduling", {
        page: currentPage,
        perPage: rowsPerPage,
        search: filterInput,
      });
      setInitialList(data?.DataList || []);
      setFilterValue(data?.DataList || []);
      setTotalPage(data?.TotalRecord ? Math.ceil(data.TotalRecord / rowsPerPage) : 1);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getListDataToServer();
  }, [currentPage, rowsPerPage, filterInput]);

  const handleEdit = (row) => {
    navigate("/task-scheduling-template/add", { state: row });
  };

  const handleTemplateClick = (row) => {
    navigate("/task-scheduling-template/view", { state: row });
  };

  const table_columns = [
    {
      name: "Template Name",
      selector: (row) => row?.Name,
      cell: (row) => (
        <span
          className="cursor-pointer text-hover-red"
          onClick={() => handleTemplateClick(row)}
        >
          {row?.Name}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row?.Status,
      cell: (row) => (
        <span
          className={`badge ${row.Status === "Active" ? "badge-success light badge" : "badge-danger light badge"}`}
        >
          {row.Status}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => {
        return (
          <div className="d-flex align-items-center gap-1 sweetalert">
            <i
              className="fa-solid fa-pencil cursor-pointer text-success action-icon"
              onClick={() => handleEdit(row)}
            ></i>
            <div className="sweetalert mt-5"></div>
            {/* <i
              className="fa-solid fa-trash-can cursor-pointer text-danger action-icon sweet-confirm"
              onClick={() => handleDelete(row?.id)}
            ></i> */}
          </div>
        );
      },
    },
  ];

  const serviceTableColumns = [
    {
      name: "Service Name",
      selector: (service) => service?.ServiceName || "N/A",
      sortable: true,
      width: "200px",
    },
    {
      name: "Travel Start Days",
      selector: (service) => service?.TravleStartDaysType || "N/A",
      sortable: true,
      width: "200px",
    },
    {
      name: "Travel Complete Days",
      selector: (service) => service?.TravelCompeleteDaysType || "N/A",
      sortable: true,
      width: "200px",
    },
    {
      name: "Booking Start Days",
      selector: (service) => service?.BookingStartDaysType || "N/A",
      sortable: true,
      width: "200px",
    },
    {
      name: "Booking Complete Days",
      selector: (service) => service?.BookingCompeleteDaysType || "N/A",
      sortable: true,
      width: "200px",
    },
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
  };

  const CustomPagination = () => {
    return (
      <div className="d-flex align-items-center border-bottom justify-content-end shadow custom-pagination gap-3 mb-5 py-2">
        <div className="d-flex align-items-center gap-3">
          <label htmlFor="" className="fs-6">
            Rows per page
          </label>
          <select
            name="PerPage"
            id=""
            className="pagination-select"
            value={rowsPerPage}
            onChange={(e) => {
              handleRowsPerPageChange(e.target.value);
            }}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="40">40</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          <MdOutlineSkipPrevious />
        </button>
        <button
          onClick={() =>
            handlePageChange(currentPage > 1 ? currentPage - 1 : 1)
          }
          disabled={currentPage === 1}
          className="pagination-button"
        >
          <GrFormPrevious />
        </button>
        <span className="text-light">
          {currentPage} of {totalPage}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage == totalPage}
          className="pagination-button"
        >
          <MdNavigateNext />
        </button>
        <button
          onClick={() => handlePageChange(totalPage)}
          disabled={currentPage == totalPage}
          className="pagination-button"
        >
          <MdOutlineSkipNext />
        </button>
      </div>
    );
  };

  const options = [
    { value: "all", label: "All" },
    ...(destinationlist?.map((dest) => ({
      value: dest.id,
      label: dest.Name,
    })) || []),
  ];

  const handleChange = (selected) => {
    setSelectedValue(selected);
  };

  return (
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
            <Button
              className="btn btn-primary btn-custom-size"
              onClick={() => navigate("/task-scheduling-template/add")}
            >
              Add New
            </Button>
          </div>
        </div>
      </div>
      <ToastContainer />
      <DataTable
        columns={table_columns}
        data={filterValue}
        sortIcon={<i className="fa-solid fa-sort fs-4"></i>}
        striped
        paginationServer
        highlightOnHover
        customStyles={table_custom_style(background)}
        defaultSortFieldId={1}
        paginationTotalRows={totalPage * rowsPerPage}
        defaultSortAsc={true}
        className="custom-scrollbar"
        paginationComponent={CustomPagination}
      />
      {location.state && location.state.Name && (
        <div className="mt-4">
          <h4>Service Details for {location.state.Name}</h4>
          <DataTable
            columns={serviceTableColumns}
            data={location.state.ServiceDetails || []}
            sortIcon={<i className="fa-solid fa-sort fs-4"></i>}
            striped
            highlightOnHover
            customStyles={table_custom_style(background)}
            className="custom-scrollbar"
          />
          <button
            className="btn btn-secondary mt-2"
            onClick={() => navigate("/task-scheduling-template/view")}
          >
            Close
          </button>
        </div>
      )}
    </Tab.Container>
  );
};

export default TaskSchedulingTemplate;