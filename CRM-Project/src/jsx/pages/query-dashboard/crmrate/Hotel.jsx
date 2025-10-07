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

const Hotel = () => {
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
            HotelName: "Trident Agra",
            City: "Agra",
            CategoryType: "5 Star",
            Validity: "31-12-2024 TO 31-12-2024",
            MKTType: "FIT",
            PaxType: "General",
            RoomType: "Deluxe Room Garden View",
            MealType: "CP",
            Currency: "INR",
            RoomGst: "gst18",
            Single: 10050,
            ExtraBed: 0,
            ChildWithBed: 0,
            MealGST: 0,
            Breakfast: 500,
            Lunch: 1000,
            Dinner: 1200,
            TC: "Special conditions apply",
            Attachment: "View Docs"
        },
        {
            SR: 2,
            HotelName: "Oberoi Udaivilas",
            City: "Udaipur",
            CategoryType: "Luxury",
            Validity: "01-01-2025 TO 05-01-2025",
            MKTType: "GIT",
            PaxType: "VIP",
            RoomType: "Luxury Suite Lake View",
            MealType: "MAP",
            Currency: "INR",
            RoomGst: "gst18",
            Single: 25000,
            ExtraBed: 5000,
            ChildWithBed: 3000,
            MealGST: 500,
            Breakfast: 1200,
            Lunch: 2500,
            Dinner: 2800,
            TC: "Advance booking required",
            Attachment: "View Docs"
        },
        {
            SR: 3,
            HotelName: "Taj Mahal Palace",
            City: "Mumbai",
            CategoryType: "5 Star Deluxe",
            Validity: "15-12-2024 TO 20-12-2024",
            MKTType: "Corporate",
            PaxType: "Business",
            RoomType: "Executive Suite",
            MealType: "EP",
            Currency: "INR",
            RoomGst: "gst18",
            Single: 18000,
            ExtraBed: 4000,
            ChildWithBed: 2500,
            MealGST: 300,
            Breakfast: 1000,
            Lunch: 2200,
            Dinner: 2500,
            TC: "Non-refundable",
            Attachment: "View Docs"
        }
    ];


    const table_columns = [
        {
            name: "SR",
            selector: (row) => (
                <span
                    className="cursor-pointer text-hover-red fs-12"
                >
                    {row.SR}
                </span>
            ),
            sortable: true,
            minWidth: "50px",
        },

        {
            name: "Hotel Name",
            selector: (row) => (
                <span className="fs-12">
                    {row?.HotelName}
                </span>
            ),
            sortable: true,
            wrap: true,
            minWidth: "90px",
        },
        {
            name: "City",
            selector: (row) => <span className="fs-12">{row.City}</span>,
            sortable: true,
            wrap: true,
            minWidth: "50px",
        },
        {
            name: "Category Type",
            selector: (row) => (
                <span className="fs-12">
                    {row?.CategoryType}
                </span>
            ),
            sortable: true,
            wrap: true,
            minWidth: "100px",
        },
        {
            name: "Validity",
            selector: (row) => (
                <span className="fs-12">
                    {row?.Validity}
                </span>
            ),
            sortable: true,
            wrap: true,
            minWidth: "80px",
        },
        {
            name: "MKT Type",
            selector: (row) => (
                <span className="fs-12">{row.MKTType}</span>
            ),
            sortable: true,
            wrap: true,
            minWidth: "80px",
        },
        {
            name: "Pax Type",
            selector: (row) => (
                <span className="fs-12">{row.PaxType}</span>
            ),
            sortable: true,
            wrap: true,
            minWidth: "80px",
        },
        {
            name: "Room Type",
            selector: (row) => (
                <span className="fs-12">{row.RoomType}</span>
            ),
            sortable: true,
            wrap: true,
            minWidth: "80px",
        },
        {
            name: "Meal Type",
            selector: (row) => (
                <span className="fs-12">{row.MealType}</span>
            ),
            sortable: true,
            wrap: true,
            minWidth: "80px",
        },
        {
            name: "Currency",
            selector: (row) => (
                <span className="fs-12">{row.Currency}</span>
            ),
            sortable: true,
            wrap: true,
            minWidth: "80px",
        },
        {
            name: "Room Gst",
            selector: (row) => (
                <span className="fs-12">{row.RoomGst}</span>
            ),
            sortable: true,
            wrap: true,
            minWidth: "80px",
        },
        {
            name: "MKT Type",
            selector: (row) => (
                <span className="fs-12">{row.MKTType}</span>
            ),
            sortable: true,
            wrap: true,
            minWidth: "80px",
        },
        {
            name: "Single",
            selector: (row) => (
                <span className="fs-12">{row.Single}</span>
            ),
            sortable: true,
            wrap: true,
            minWidth: "50px",
        },
        {
            name: "Extra Bed",
            selector: (row) => (
                <span className="fs-12">{row.ExtraBed}</span>
            ),
            sortable: true,
            wrap: true,
            minWidth: "50px",
        },
        {
            name: "Child With Bed",
            selector: (row) => (
                <span className="fs-12">{row.ChildWithBed}</span>
            ),
            sortable: true,
            wrap: true,
            minWidth: "100px",
        },
        {
            name: "Meal GST",
            selector: (row) => (
                <span className="fs-12">{row.MealGST}</span>
            ),
            sortable: true,
            wrap: true,
            minWidth: "50px",
        },
        {
            name: "Breakfast",
            selector: (row) => (
                <span className="fs-12">{row.Breakfast}</span>
            ),
            sortable: true,
            wrap: true,
            minWidth: "50px",

        },
        {
            name: "Lunch",
            selector: (row) => (
                <span>{row.Lunch}</span>
            ),
            sortable: true,
            wrap: true,
            minWidth: "50px",
        },
        {
            name: "Dinner",
            selector: (row) => (
                <span className="fs-12">{row.Lunch}</span>
            ),
            sortable: true,
            wrap: true,
            minWidth: "30px",
        },
        {
            name: "T&C",
            selector: (row) => (
                <span className="fs-12">{row.Lunch}</span>
            ),
            sortable: true,
            wrap: true,
            minWidth: "30px",
        },
        {
            name: "Attachment",
            selector: (row) => (
                <span className="fs-12">{row.Attachment}</span>
            ),
            sortable: true,
            wrap: true,
            minWidth: "30px",
        },



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
                                                        <option value={""}>All hotel</option>
                                                    </select>
                                                </div>

                                                <div className="col">
                                                    <select
                                                        className="form-control form-control-sm"
                                                        name="HotelChain"
                                                    >
                                                        <option value={""}>Select city</option>
                                                    </select>
                                                </div>
                                                <div className="col">
                                                    <select
                                                        className="form-control form-control-sm"
                                                        name=""
                                                    >
                                                        <option value={""}>All</option>
                                                    </select>
                                                </div>
                                                <div className="col">
                                                    <select className="form-control form-control-sm" value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
                                                        {Array.from({ length: endYear - startYear + 1 },(_,i) => (
                                                            <option key={i} value={startYear + i}>
                                                                {startYear + i}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="col">
                                                    <DatePicker className="form-control form-control-sm z-[10000000]"  name="FromDate" dateFormat="yyyy-MM-dd" isClearable todayButton="Today" />
                                                </div>
                                                <div className="col">
                                                    <DatePicker className="form-control form-control-sm"  name="FromDate" dateFormat="yyyy-MM-dd" isClearable todayButton="Today" />

                                                </div>
                                                <div className="col">
                                                    <select
                                                        className="form-control form-control-sm"
                                                        name=""
                                                    >
                                                        <option value={""}>General</option>
                                                    </select>
                                                </div>
                                                <div className="col">
                                                    <select
                                                        className="form-control form-control-sm"
                                                        name=""
                                                    >
                                                        <option value={""}>All Type Room</option>
                                                    </select>
                                                </div>
                                                <div className="col">
                                                    <select
                                                        className="form-control form-control-sm"
                                                        name=""
                                                    >
                                                        <option value={""}>All Meal Type</option>
                                                    </select>
                                                </div>
                                                <div className="col m-0 ">
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
export default Hotel;
