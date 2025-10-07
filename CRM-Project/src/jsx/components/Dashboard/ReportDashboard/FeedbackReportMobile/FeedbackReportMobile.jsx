
// import "./FeedbackReportMobile.css"
import ReportTable from '../ReportTable/ReportTable';
import React, { useEffect, useState } from 'react';
import { axiosOther } from "../../../../../http/axios_base_url";
import PaginatedDataTable from '../ReportTable/PaginatedDataTable';

function FeedbackReportMobile() {

    const [reportShow, setReportShow] = useState(false)
    const [AgentTurn, setAgentTurn] = useState([])
    const [search, setSearch] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalPage, setTotalPage] = useState(0);

    // console.log(AgentTurn,"AgentTurn");

     const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleRowsPerPageChange = (newRowsPerPage) => {
        setRowsPerPage(newRowsPerPage);
        setCurrentPage(1);
    };
    const getListDataToServer = async () => {
        try {
            setLoading(true);
            setError(null);

            const { data } = await axiosOther.post("feedbackReport",{
                page: currentPage ,
                per_page: rowsPerPage,
                search: search,
                FromDate: "",
                ToDate: ""
            });
            console.log("API Response:", data); // Debug log

            if (data?.DataList) {
                // Add serial numbers and process data
                const processedData = data.DataList.map((item, index) => ({
                    ...item,
                    id: index + 1,
                }));

                setAgentTurn(processedData);
                setFilteredData(processedData);
                setTotalPage(data.TotalPages || 10);
            } else {
                setError("No data received from API");
                setAgentTurn([]);
                setFilteredData([]);
            }
        } catch (error) {
            console.log("feedback-error", error);
            setError("Failed to fetch data: " + error.message);
            setAgentTurn([]);
            setFilteredData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getListDataToServer();
    }, [rowsPerPage, currentPage]);

    // Table Columns - Updated to match API response field names
    const columns = [
        {
            wrap: true,
            name: "S.No",
            selector: (row, index) => index,
            cell: (row, index) => (
                <span>{(currentPage - 1) * rowsPerPage + index + 1}</span>
            ),
            sortable: false,
            width: "40px"
        },
        {
            wrap: true,
            name: "Query Id",
            selector: row => row.QueryId,
            cell: row => <span>{row.QueryId || "N/A"}</span>,
            sortable: true,
            width: "7rem",
        },
        {
            wrap: true,
            name: "Travel Date",
            selector: row => row.TravelDate,
            cell: row => <span>{row.TravelDate || "N/A"}</span>,
            sortable: true,
            width: "8rem",
        },
        {
            wrap: true,
            name: "Service Name",
            selector: row => row.ServiceName,
            cell: row => <span>{row.ServiceName || "N/A"}</span>,
            sortable: true,
            width: "9rem",
        },
        {
            wrap: true,
            name: "Feedback Date",
            selector: row => row.FeedbackDate,
            cell: row => <span>{row.FeedbackDate || "N/A"}</span>,
            sortable: true,
            width: "10rem",
        },
        {
            wrap: true,
            name: "Client Rating",
            selector: row => row.ClientRating,
            cell: row => <span>{row.ClientRating || "N/A"}</span>,
            sortable: true,
            width: "10rem",
        },
        {
            wrap: true,
            name: "Client Experience",
            selector: row => row.ClientRating,
            cell: row => <span>{row.ClientRating || "N/A"}</span>,
            sortable: true,
            width: "10rem",
        },
        {
            wrap: true,
            name: "Image",
            selector: row => row.Image,
            cell: row => <span>{row.Image || "N/A"}</span>,
            sortable: true,
            width: "6rem",
        },
        {
            wrap: true,
            name: "Full Name",
            selector: row => row.FullName,
            cell: row => <span>{row.FullName || "N/A"}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Contact Number",
            selector: row => row.Phone,
            cell: row => <span>{row.Phone || "N/A"}</span>,
            sortable: true,
            width: "10rem",
        },
        {
            wrap: true,
            name: "Email",
            selector: row => row.Email,
            cell: row => <span>{row.Email || "N/A"}</span>,
            sortable: true,
            width: "10rem",
        },
        {
            wrap: true,
            name: "Operation Person",
            selector: row => row.OperationPerson,
            cell: row => <span>{row.OperationPerson || "N/A"}</span>,
            sortable: true,
            width: "10rem",
        },
        {
            wrap: true,
            name: "Destination",
            selector: row => row.Destination,
            cell: row => <span>{row.Destination || "N/A"}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Source",
            selector: row => row.Source,
            cell: row => <span>{row.Source || "N/A"}</span>,
            sortable: true
        }
    ];


    // Form submission handler
    const handleFormSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const filters = {
            startDate: formData.get('start'),
            endDate: formData.get('end')
        };

        console.log("Applied filters:", filters);
        // You can send these filters to your API
        // getListDataToServer(filters);
    };

    return (
        <>
            <div className='feedback-report-mobile-main'>
                <h3>Feedback Report Mobile</h3>

                {/* Loading State */}
                {loading && <div className="loading-message">Loading...</div>}

                {/* Error State */}
                {error && <div className="error-message">{error}</div>}

                {/* Search Input */}
                <div className="feedback-report-mobile-main-inputs">
                    {/* <div className="feedback-report-mobile-main-inputs-search">
                       
                    </div> */}
                    <div className="feedback-report-mobile-main-inputs-paramtr">
                        <form onSubmit={handleFormSubmit} className="col-12">
                            <div className="feedback-report-mobile-main-inputs-paramtr-flex row mb-3">

                                <div className="feedback-report-mobile-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    <input
                                        type="text"
                                        placeholder="Search by name..."
                                        value={search}
                                        // onChange={handleSearch}
                                        className="form-control form-control-sm"
                                    />
                                </div>

                                {/* Start Date */}
                                <div className="feedback-report-mobile-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    <input type="date" className="form-control form-control-sm" name="start" id="start-date" />
                                </div>

                                {/* End Date */}
                                <div className="feedback-report-mobile-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    <input type="date" className="form-control form-control-sm" name="end" id="end-date" />
                                </div>

                                {/* Submit Button */}
                                <div className="feedback-report-mobile-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                     <button type="submit" className="btn btn-primary btn-custom-size flex-shrink-0 flex-grow-0"> <i className='fa-brands fa-searchengin me-2'></i> Search</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Table */}
                {!loading && !error && (
                    <PaginatedDataTable
                                        columns={columns}
                                        rows={filteredData}
                                        paginationTotalRows={100}
                                        rowsPerPage={rowsPerPage}
                                        currentPage={currentPage}
                                        totalPage={totalPage}
                                        onRowsPerPageChange={handleRowsPerPageChange}
                                        onPageChange={handlePageChange}
                                    />
                )}
            </div>
        </>
    );
}

export default FeedbackReportMobile;