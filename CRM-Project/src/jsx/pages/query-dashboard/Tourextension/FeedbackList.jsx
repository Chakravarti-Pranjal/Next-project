import React, { useContext, useEffect, useState } from 'react'
import { Tab } from "react-bootstrap";
import DataTable from 'react-data-table-component';
import swal from "sweetalert";
import { table_custom_style } from '../../../../css/custom_style';
import { ThemeContext } from '../../../../context/ThemeContext';
import { notifySuccess } from "../../../../helper/notify";
import { MdOutlineSkipPrevious } from "react-icons/md";
import { MdNavigateNext } from "react-icons/md";
import { MdOutlineSkipNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import { axiosOther } from '../../../../http/axios_base_url';
import { Navigate, useNavigate } from 'react-router-dom';
import { format } from "date-fns";

function FeedbackList({ onAdd, setActiveTab }) {
    const handleDateFormatChange = (date) => {
        let formattedDate;
        if (date) {
            formattedDate = format(date, "dd-MM-yyyy");
            console.log(formattedDate);
        }
        return formattedDate;
    };
    const { background } = useContext(ThemeContext);
    const [filterValue, setFilterValue] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalPage, setTotalPage] = useState("");
    const [filters, setFilters] = useState({
        QueryId: "",
        QuotationNumber: "",
        TourId: "",
        RefrenceNo: "",
    });
    const navigate = useNavigate();
    const feedbackList = async () => {
        const datas = localStorage.getItem("Query_Qoutation");
        const parsedData = JSON.parse(datas);
        // console.log(parsedData, "parsedData")
        const { data } = await axiosOther.post("feedbackmasterlist", {
            per_page: rowsPerPage,
            page: currentPage,
            TourId: filters?.TourId || "",
            ReferenceId: filters?.RefrenceNo || "",
            QueryId: parsedData?.QueryID || "",
            QuotationNumber: parsedData?.QoutationNum || ""
            // QueryId: filters?.QueryId || "",
            // QuotationNumber: filters?.QuotationNumber || ""
        });

        setTotalPage(data.LastPage);
        setFilterValue(data.DataList);
        // console.log(filterValue, "safkjaskldf");

    };

    useEffect(() => {
        feedbackList();
    }, [rowsPerPage, currentPage]);

    const handleSearch = () => {
        setCurrentPage(1); // Reset to first page on new search
        feedbackList();
    };
    // console.log(filterValue, "ssssss")
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleFormChangeData = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };


    const handleEdit = (data) => {
        navigate("/query/tour-execution/feedback-form", {
            state: data,
        });
    };

    const handleDelete = async (id) => {
        const confirmation = await swal({
            title: "Are you sure Want to delete?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        });

        if (confirmation) {
            try {
                const { data } = await axiosOther.post("deletefeedbackform", {
                    id: id,
                });
                // console.log(data,"sdkjfh");

                if (data?.Status == "200" || data?.status == "200" || data?.result) {
                    notifySuccess(data?.message || data?.Message || data?.result);
                    feedbackList();
                }
            } catch (err) {
                if (err) {
                    notifyError(err?.message || err?.Message);
                }
            }
        }
    };

    const table_columns = [
        {
            name: "File Code",
            selector: (row) => row?.TourId,
            cell: (row) => <span>{row?.TourId} </span>,
            sortable: true,
            wrap: true,
        },
        {
            name: "Report Date",
            selector: (row) => row?.Formdetails?.ReportDate,
            cell: (row) => <span>{handleDateFormatChange(row?.Formdetails?.ReportDate)} </span>,
            sortable: true,
            wrap: true,
        },
        {
            name: "Name",
            selector: (row) => row?.Formdetails?.Name,
            cell: (row) => <span>{row?.Formdetails?.Name} </span>,
            sortable: true,
            wrap: true,
        },
        {
            name: "Phone No.",
            selector: (row) => row?.Formdetails?.ContactDetails,
            cell: (row) => <span>{row?.Formdetails?.ContactDetails} </span>,
            sortable: true,
            wrap: true,
        },
        {
            name: "Email",
            selector: (row) => row?.Formdetails?.Email,
            cell: (row) => <span>{row?.Formdetails?.Email} </span>,
            sortable: true,
            wrap: true,
        },
        {
            name: "Recomndation Trip",
            selector: (row) => row?.Formdetails?.RecomndationTrip,
            cell: (row) => <span>{row?.Formdetails?.RecomndationTrip} </span>,
            sortable: true,
            wrap: true,
        },
        {
            name: "Rate",
            selector: (row) => row?.Formdetails?.Rate,
            cell: (row) => <span>{row?.Formdetails?.Rate} </span>,
            sortable: true,
            wrap: true,
        },
        {
            name: "Action",
            selector: (row) => {
                return (
                    <span className="d-flex gap-1">
                        <i
                            className="fa-solid fa-pencil cursor-pointer action-icon text-success"
                            data-toggle="modal"
                            data-target="#modal_form_vertical"
                            onClick={() => handleEdit(row)}
                        ></i>
                        <i
                            className="fa-solid fa-trash-can cursor-pointer text-danger action-icon"
                            onClick={() => handleDelete(row?.id)}
                        ></i>
                    </span>
                );
            },
            // width: "4.5rem",
        },
    ];

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
                            setRowsPerPage(e.target.value);
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
    return (
        // <div>BriffingList</div>
        <Tab.Container defaultActiveKey="All">
            {/* <div className="d-flex justify-content-between align-items-center flex-wrap"> */}
            {/* // add more feilds */}
            <div className="row mb-1">
                <div className="col-12 d-flex gap-3 justify-content-end w-100">
                    <button className="btn btn-dark btn-custom-size" name="SaveButton"
                        onClick={() => setActiveTab("BriffingList")}
                    >
                        <span className="me-1">Back</span>
                        <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
                    </button>
                    <button
                        onClick={() => { navigate("/query/tour-execution/feedback-form") }}
                        className="btn btn-primary btn-custom-size"
                    >
                        Add New Feedback Form
                    </button>
                    <button
                        className="btn btn-primary btn-custom-size "
                        name="SaveButton"
                        onClick={() => setActiveTab("PLACard")}
                    >
                        <span className="me-1">Next</span>
                        <i className="fa-solid fa-forward text-primary bg-white p-1 rounded"></i>
                    </button>
                </div>
            </div>
            {/* <div className="col-lg-12 col-sm-12 ms-3">
                <div className="row align-items-center mt-1">
                    <div className="col-lg-2 col-md-6 mb-3">
                        <label>QueryId</label>
                        <input
                            type="text"
                            name="QueryId"
                            value={filters?.QueryId}
                            placeholder="Query Id"
                            onChange={handleFormChangeData}
                            className={`form-control form-control-sm   `}
                        />
                    </div>
                    <div className="col-lg-2 col-md-6 mb-3">
                        <label>Quotation Number</label>
                        <input
                            type="text"
                            name="QuotationNumber"
                            value={filters?.QuotationNumber}
                            placeholder="Query Id"
                            onChange={handleFormChangeData}
                            className={`form-control form-control-sm   `}
                        />
                    </div>
                    <div className="col-lg-2 col-md-6 mb-3">
                        <label>Tour Id</label>
                        <input
                            type="text"
                            name="TourId"
                            value={filters?.TourId}
                            placeholder="Tour Id"
                            onChange={handleFormChangeData}
                            className={`form-control form-control-sm   `}
                        />
                    </div>
                    <div className="col-lg-2 col-md-6 mb-3">
                        <label>Refrence No</label>
                        <input
                            type="text"
                            name="RefrenceNo"
                            value={filters?.RefrenceNo}
                            placeholder="Refrence No"
                            onChange={handleFormChangeData}
                            className={`form-control form-control-sm`}
                        />
                    </div>
                    <div
                        className="col-lg-3 col-md-6 mt-2"
                        onClick={handleSearch}
                    >
                        <div className="btn btn-primary btn-custom-size">
                            <i className="fa-solid fa-magnifying-glass pe-1"></i> Search{" "}
                        </div>
                    </div>
                </div>
            </div> */}
            {/* </div> */}
            <DataTable
                columns={table_columns}
                data={filterValue}
                sortIcon={<i className="fa-solid fa-sort fs-4"></i>}
                striped
                paginationServer
                highlightOnHover
                customStyles={table_custom_style(background)}
                paginationTotalRows={4}
                defaultSortFieldId="queryDate"
                defaultSortAsc={false}
                className="custom-scrollbar"
            />
            <CustomPagination />
        </Tab.Container >
    )
}

export default FeedbackList