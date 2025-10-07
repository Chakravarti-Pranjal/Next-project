import React, { useState, useEffect } from "react";
import "bootstrap-daterangepicker/daterangepicker.css";
import { Dropdown, Tab, Nav, Button } from "react-bootstrap";
// import { axiosOther } from "../../../../http/axios_base_url";
import { axiosOther } from "../../../../http/axios_base_url";
import { NavLink, Link, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { table_custom_style } from "../../../../css/custom_style";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa"; // Example using react-icons
import swal from "sweetalert";
import UseTable from "../../../../helper/UseTable.jsx";

const notifyTopCenter = (message) => {
  toast.success(`${message}`, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

const GuideService = () => {
  const [selectBtn, setSelectBtn] = useState("Newest");
  const [initialList, setInitialList] = useState([]);
  const [filterValue, setFilterValue] = useState([]);
  const [filterInput, setFiterInput] = useState("");
  const [currentPage, setCurrentPage] = useState(0); // Page index
  const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page

  const handlePageChange = (page) => setCurrentPage(page - 1);
  const handleRowsPerPageChange = (newRowsPerPage) =>
    setRowsPerPage(newRowsPerPage);
  const data = []; // Replace with your data
  const totalRows = 10; // Replace with your total rows count

  const navigate = useNavigate();


  const getListDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("currencymasterlist");
      setInitialList(data?.DataList);
      setFilterValue(data?.DataList);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getListDataToServer();
  }, []);

  useEffect(() => {
    const filteredList = initialList?.filter(
      (data) =>
        data?.CountryName?.toLowerCase()?.includes(
          filterInput?.toLowerCase()
        ) ||
        data?.CurrencyName?.toLowerCase()?.includes(
          filterInput?.toLowerCase()
        ) ||
        data?.CountryCode?.toLowerCase()?.includes(filterInput?.toLowerCase())
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

    if (confirmation) {
      try {
        const { data } = await axiosOther.post("deletecurrencymaster", {
          id: id,
        });
        if (data?.Status == 1 || data?.status == 1 || data?.result) {
          notifyTopCenter(data?.Message || data?.message || data?.result);
          getListDataToServer();
        }
      } catch (err) {
        if (err) {
          alert(err?.message || err?.Message);
        }
      }
    }
  };

  const SortIcon = ({ sortDirection }) => {
    if (!sortDirection) return <FaSort />; // Default unsorted state
    if (sortDirection === "asc") return <FaSortUp />; // Ascending sort
    if (sortDirection === "desc") return <FaSortDown />; // Descending sort
  };

  useEffect(() => {
    const getMessage = localStorage.getItem("success-message");
    if (getMessage != null) {
      notifyTopCenter(getMessage);
      localStorage.removeItem("success-message");
    }
    // console.log("success-message", getMessage);
  }, []);

  const handleEdit = (row) => {
    navigate("/currency/add", { state: row });
  };

  // console.log("initial-list", initialList);

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
      name: "Country Name",
      selector: (row) => row?.CountryName,
      cell: (row) => (
        <span className="font-size-11">
          {row?.CountryName}{" "}
          {row.SetDefault == "Yes" && (
            <i className="mdi mdi-check-circle-outline text-success fs-4"></i>
          )}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Currency Name",
      selector: (row) => row?.CurrencyName,
      cell: (row) => (
        <span className="font-size-11">{row.CurrencyName}</span>
      ),
      sortable: true,
    },
    {
      name: "Currency Code",
      selector: (row) => row?.CountryCode,
      cell: (row) => (
        <span className="font-size-11">{row?.CountryCode}</span>
      ),
      sortable: true,
    },
    {
      name: "Exchange Rate in INR",
      selector: (row) => row?.ConversionRate,
      cell: (row) => <span>{row?.ConversionRate}</span>,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row?.Status,
      cell: (row) => {
        // console.log(row.Status);
        return (
          <span
            className={`badge ${row.Status == "Active"
              ? "badge-success light badge"
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
              onClick={() => handleEdit(row)}
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
    <Tab.Container defaultActiveKey="All">
      <div className="d-flex justify-content-between align-items-center flex-wrap">
        <div className="card-action coin-tabs mb-2 d-flex gap-4">
          <Nav as="ul" className="nav nav-tabs">
            <Nav.Item as="li" className="nav-item">
              <Nav.Link className="nav-link" eventKey="All">
                All List
              </Nav.Link>
            </Nav.Item>
            {/* <Nav.Item as="li" className="nav-item">
              <Nav.Link className="nav-link" eventKey="Pending">
                Active
              </Nav.Link>
            </Nav.Item>
            <Nav.Item as="li" className="nav-item">
              <Nav.Link className="nav-link" eventKey="Booked">
                Inactive
              </Nav.Link>
            </Nav.Item> */}
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
            {/* <Dropdown>
              <Dropdown.Toggle
                as="div"
                className=" btn-select-drop default-select btn i-false"
              >
                {selectBtn} <i className="fas fa-angle-down ms-2 "></i>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => setSelectBtn("Oldest")}
                  eventKey="All"
                >
                  Oldest
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => setSelectBtn("Newest")}
                  eventKey="All"
                >
                  Newest
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown> */}
            <button
              className="btn btn-dark btn-custom-size"
              name="SaveButton"
              onClick={() => navigate(-1)}
            >
              <span className="me-1">Back</span>
              <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
            </button>
            <Link to={"/currency/add"} className="btn btn-primary btn-custom-size">
              Add Currency
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
  );
};
export default GuideService;
