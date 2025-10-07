import React,{ useState,useEffect } from "react";
import "bootstrap-daterangepicker/daterangepicker.css";
import { Tab,Nav,Button } from "react-bootstrap";
import { axiosOther } from "../../../../http/axios_base_url";
import { NavLink,Link,useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { table_custom_style } from "../../../../css/custom_style";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
import UseTable from "../../../../helper/UseTable";
import { wrap } from "framer-motion";
import { notifySuccess,notifyError } from "../../../../helper/notify";

import DatePicker from "react-datepicker";
import { array } from "yup";

const Transfer = () => {
    const [initialList,setInitialList] = useState([]);
    const [filterValue,setFilterValue] = useState([]);
    const [filterInput,setFiterInput] = useState("");
    const navigate = useNavigate();

    const [currentPage,setCurrentPage] = useState(0);
    const [rowsPerPage,setRowsPerPage] = useState(10);


    const handlePageChange = (page) => setCurrentPage(page - 1);
    const handleRowsPerPageChange = (newRowsPerPage) =>
        setRowsPerPage(newRowsPerPage);

    const startYear = 2015;
    const endYear = 2035;
    const currentYear = new Date().getFullYear();
    const [selectedYear,setSelectedYear] = useState(currentYear);


    const tableData = [
      {
          SR: 1,
          TransferName: "Airport to Hotel",
          VehicleType: "Sedan",
          VehicleName: "Toyota Etios",
          Destination: "Delhi",
          Validity: "07-02-2024 TO 31-12-2024",
          MarketType: "All",
          Supplier: "Peter Parker PVT LTD",
          GSTSlab: 0,
          VehicleCost: "INR 1000",
          Parking: "INR 0"
      },
      {
          SR: 2,
          TransferName: "Airport to Hotel",
          VehicleType: "SUV",
          VehicleName: "Toyota Innova",
          Destination: "Delhi",
          Validity: "27-05-2024 TO 31-12-2025",
          MarketType: "All",
          Supplier: "DeBox Global IT",
          GSTSlab: 0,
          VehicleCost: "INR 20000",
          Parking: "INR 0"
      },
      {
          SR: 3,
          TransferName: "Airport to Hotel",
          VehicleType: "Luxury",
          VehicleName: "Mercedes-Benz E-Class",
          Destination: "Delhi",
          Validity: "27-05-2024 TO 31-12-2025",
          MarketType: "All",
          Supplier: "DeBox Global IT",
          GSTSlab: 0,
          VehicleCost: "INR 35000",
          Parking: "INR 0"
      }
  ];




  const table_columns = [
    {
        name: "SR",
        selector: (row) => (
            <span className="cursor-pointer text-hover-red fs-12">
                {row.SR}
            </span>
        ),
        sortable: true,
        minWidth: "50px",
    },
    {
        name: "Transfer Name",
        selector: (row) => (
            <span className="cursor-pointer text-hover-red fs-12">
                {row.TransferName}
            </span>
        ),
        sortable: true,
        minWidth: "50px",
    },
    {
        name: "Vehicle Type",
        selector: (row) => <span className="fs-12">{row.VehicleType}</span>,
        sortable: true,
        wrap: true,
        minWidth: "50px",
    },
    {
        name: "Vehicle Name",
        selector: (row) => <span className="fs-12">{row.VehicleName}</span>,
        sortable: true,
        wrap: true,
        minWidth: "50px",
    },
    {
        name: "Destination",
        selector: (row) => <span className="fs-12">{row.Destination}</span>,
        sortable: true,
        wrap: true,
        minWidth: "50px",
    },
    {
        name: "Validity",
        selector: (row) => <span className="fs-12">{row.Validity}</span>,
        sortable: true,
        wrap: true,
        minWidth: "80px",
    },
    {
        name: "Market Type",
        selector: (row) => <span className="fs-12">{row.MarketType}</span>,
        sortable: true,
        wrap: true,
        minWidth: "80px",
    },
    {
        name: "Supplier",
        selector: (row) => <span className="fs-12">{row.Supplier}</span>,
        sortable: true,
        wrap: true,
        minWidth: "100px",
    },
    {
        name: "GST SLAB",
        selector: (row) => <span className="fs-12">{row.GSTSlab}</span>,
        sortable: true,
        wrap: true,
        minWidth: "80px",
    },
    {
        name: "Vehicle Cost",
        selector: (row) => <span className="fs-12">{row.VehicleCost}</span>,
        sortable: true,
        wrap: true,
        minWidth: "50px",
    },
    {
        name: "Parking",
        selector: (row) => <span className="fs-12">{row.Parking}</span>,
        sortable: true,
        wrap: true,
        minWidth: "100px",
    }
];

    return (
        <>
            <div className="row mt-3">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-body">
                            <div className="form-validation">
                                <ToastContainer />
                                <form className="form-valide" >
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="row form-row-gap">
                                                <div className=" col">
                                                    <select
                                                        className="form-control form-control-sm"
                                                        name=""
                                                    >
                                                        <option value={""}>All Transfer</option>
                                                    </select>
                                                </div>

                                                <div className="col">
                                                    <select
                                                        className="form-control form-control-sm"
                                                        name="HotelChain"
                                                    >
                                                        <option value={""}>Destination</option>
                                                    </select>
                                                </div>
                                                <div className="col">
                                                    <select
                                                        className="form-control form-control-sm"
                                                        name=""
                                                    >
                                                        <option value={""}>All Market Type</option>
                                                    </select>
                                                </div>
                                                <div className="col">
                                                    <select className="form-control form-control-sm" value="" >

                                                            <option >
                                                                All Supplier
                                                            </option>

                                                    </select>
                                                </div>
                                                <div className="col">
                                                    <DatePicker className="form-control form-control-sm z-[10000000]"  name="FromDate" dateFormat="yyyy-MM-dd" isClearable todayButton="Today" />
                                                </div>
                                                <div className="col">
                                                    <DatePicker className="form-control form-control-sm"  name="FromDate" dateFormat="yyyy-MM-dd" isClearable todayButton="Today" />

                                                </div>
                                                <div className="col m-0 mb-4">
                                                    <button className="btn btn-primary btn-custom-size">Search</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Tab.Container defaultActiveKey="All">
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                    {/* <div className="card-action coin-tabs mb-2 d-flex gap-4">
          <Nav as="ul" className="nav nav-tabs">
            <Nav.Item as="li" className="nav-item">
              <Nav.Link className="nav-link" eventKey="All">
                All List
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </div> */}
                    {/* <div className="col-md-4">
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
        </div> */}
                </div>
                <ToastContainer />
                <UseTable
                    table_columns={table_columns}
                    filterValue={tableData}
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
