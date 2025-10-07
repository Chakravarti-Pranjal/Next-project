import React, { useState, useEffect } from 'react'
// import "./LoginRep.css"
import ReportTable from '../ReportTable/ReportTable';
import { axiosOther } from "../../../../../http/axios_base_url";
import PaginatedDataTable from '../ReportTable/PaginatedDataTable';

function LoginRep() {
    const [LoginData, setLoginData] = useState([]);
    const [search, setSearch] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [perPage] = useState(10);

    // Filter state
    const [selectedAgent, setSelectedAgent] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // console.log(LoginData, "LoginData");

    const getListDataToServer = async (page = 1, searchTerm = "", agent = "", start = "", end = "") => {
        try {
            setLoading(true);
            setError(null);

            // Build the request payload
            const requestData = {
                page: page,
                PerPage: perPage,
                ...(searchTerm && { search: searchTerm }),
                ...(agent && { agent: agent }),
                ...(start && { start_date: start }),
                ...(end && { end_date: end })
            };

            // console.log("Request payload:", requestData);

            // Try the API call with better error handling
            const response = await axiosOther.post("logindetailReport", requestData);
            // console.log("Full API Response:", response);
            // console.log("Response Data:", response.data);
            // console.log("Response Status:", response.status);

            const { data } = response;

            // Check if the response structure is what we expect
            if (data) {
                console.log("Data structure:", {
                    hasDataList: !!data.DataList,
                    dataListLength: data.DataList ? data.DataList.length : 0,
                    totalPages: data.TotalPages,
                    totalRecords: data.TotalRecords,
                    currentPage: data.CurrentPage
                });

                if (data.DataList && Array.isArray(data.DataList)) {
                    // Add serial numbers and process data
                    const processedData = data.DataList.map((item, index) => ({
                        ...item,
                        id: ((page - 1) * perPage) + index + 1,
                    }));

                    setLoginData(processedData);
                    setFilteredData(processedData);
                    setTotalPages(data.TotalPages || 0);
                    setTotalRecords(data.TotalRecords || 0);
                    setCurrentPage(data.CurrentPage || page);
                } else if (data.DataList === null || data.DataList === undefined) {
                    // Handle case where DataList is null/undefined but response is successful
                    console.log("DataList is null/undefined - no records found");
                    setLoginData([]);
                    setFilteredData([]);
                    setTotalPages(0);
                    setTotalRecords(0);
                    setCurrentPage(1);
                } else {
                    // Handle unexpected data structure
                    console.error("Unexpected data structure:", data);
                    setError("Unexpected data structure received from API");
                    setLoginData([]);
                    setFilteredData([]);
                    setTotalPages(0);
                    setTotalRecords(0);
                }
            } else {
                console.error("No data in response");
                setError("No data received from API");
                setLoginData([]);
                setFilteredData([]);
                setTotalPages(0);
                setTotalRecords(0);
            }
        } catch (error) {
            console.error("API Error Details:", {
                message: error.message,
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                config: error.config
            });

            let errorMessage = "Failed to fetch data";

            if (error.response) {
                // Server responded with error status
                errorMessage = `Server Error: ${error.response.status} - ${error.response.statusText}`;
                if (error.response.data?.message) {
                    errorMessage += ` - ${error.response.data.message}`;
                }
            } else if (error.request) {
                // Request was made but no response received
                errorMessage = "No response from server. Please check your connection.";
            } else {
                // Something else happened
                errorMessage = `Request Error: ${error.message}`;
            }

            setError(errorMessage);
            setLoginData([]);
            setFilteredData([]);
            setTotalPages(0);
            setTotalRecords(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getListDataToServer();
    }, []);

    const columns = [
        {
            wrap: true,
            name: "S.No",
            selector: row => row.id,
            cell: row => <span>{row.id}</span>,
            sortable: true,
            width: "80px"
        },
        {
            wrap: true,
            name: "Company Name",
            selector: row => row.CompanyName || "N/A",
            cell: row => <span>{row.CompanyName || "N/A"}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Emp Name",
            selector: row => row.CompanyName || "N/A",
            cell: row => <span>{row.CompanyName || "N/A"}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Role",
            selector: row => row.Role || "N/A",
            cell: row => <span>{row.Role || "N/A"}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Login Date",
            selector: row => row.LoginDate || "N/A",
            cell: row => <span>{row.LoginDate || "N/A"}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Login Time",
            selector: row => row.LoginTime || "N/A",
            cell: row => <span>{row.LoginTime || "N/A"}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "IP Address",
            selector: row => row.IPAddress || "N/A",
            cell: row => <span>{row.IPAddress || "N/A"}</span>,
            sortable: true
        }
    ];


    // Search Filter Function
    const handleSearch = (event) => {
        const searchTerm = event.target.value.toLowerCase();
        setSearch(searchTerm);

        if (LoginData.length > 0) {
            const filteredRows = LoginData.filter(row =>
                row.CompanyName?.toLowerCase().includes(searchTerm) ||
                row.Role?.toLowerCase().includes(searchTerm) ||
                row.LoginDate?.toLowerCase().includes(searchTerm) ||
                row.LoginTime?.toLowerCase().includes(searchTerm) ||
                row.IPAddress?.toLowerCase().includes(searchTerm) ||
                row.id?.toString().toLowerCase().includes(searchTerm)
            );
            setFilteredData(filteredRows);
        }
    };

    // Form submission handler
    const handleFormSubmit = (event) => {
        event.preventDefault();
        setCurrentPage(1); // Reset to first page
        getListDataToServer(1, search, selectedAgent, startDate, endDate);
    };

    // Pagination handlers
    const handlePageChange = (page) => {
        setCurrentPage(page);
        getListDataToServer(page, search, selectedAgent, startDate, endDate);
    };

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            const start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
            const end = Math.min(totalPages, start + maxVisiblePages - 1);

            if (start > 1) {
                pages.push(1);
                if (start > 2) pages.push('...');
            }

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (end < totalPages) {
                if (end < totalPages - 1) pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    return (
        <>
            <div className='login-rep-main'>
                <h3>Login Report</h3>

                {/* Search Input */}
                <div className="login-rep-main-inputs">
                    {/* <div className="login-rep-main-inputs-search">
                       
                    </div> */}
                    <div className="login-rep-main-inputs-paramtr">
                        <form onSubmit={handleFormSubmit} className="col-12">
                            <div className="login-rep-main-inputs-paramtr-flex row mb-3">

                                <div className='login-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2'>
                                    <input
                                        type="text"
                                        placeholder="Search by company, role, date, time, or IP..."
                                        value={search}
                                        onChange={handleSearch}
                                        className="form-control form-control-sm"
                                    />
                                </div>

                                {/* Agent Select */}
                                <div className="login-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    <select
                                        className="form-control form-control-sm"
                                        name="agent"
                                        value={selectedAgent}
                                        onChange={(e) => setSelectedAgent(e.target.value)}
                                    >
                                        <option value="">All Agents</option>
                                        <option value="ajay-bahal">Ajay Bahal</option>
                                        <option value="sameer">Sameer</option>
                                        <option value="rihaan-khan">Rihaan Khan</option>
                                    </select>
                                </div>

                                {/* Start Date */}
                                <div className="login-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    <input
                                        type="date"
                                        className="form-control form-control-sm"
                                        name="start"
                                        id="start-date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </div>

                                {/* End Date */}
                                <div className="login-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    <input
                                        type="date"
                                        className="form-control form-control-sm"
                                        name="end"
                                        id="end-date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </div>

                                {/* Submit Button */}
                                <div className="login-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    {/* <button
                                        type="submit"
                                        className="form-control form-control-btn"
                                        disabled={loading}
                                    >
                                        {loading ? 'Searching...' : 'Search'}
                                    </button> */}
                                     <button type="submit" className="btn btn-primary btn-custom-size flex-shrink-0 flex-grow-0"> <i className='fa-brands fa-searchengin me-2'></i> Search</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Loading and Error States */}
                {loading && (
                    <div className="loading-state">
                        <p>Loading data...</p>
                    </div>
                )}

                {error && (
                    <div className="error-state">
                        <p>Error: {error}</p>
                        <button onClick={() => getListDataToServer(currentPage)}>
                            Retry
                        </button>
                    </div>
                )}

                {/* Data Info */}
                {/* {!loading && !error && totalRecords > 0 && (
                    <div className="data-info">
                        <p>
                            Showing {((currentPage - 1) * perPage) + 1} to {Math.min(currentPage * perPage, totalRecords)} of {totalRecords} entries
                        </p>
                    </div>
                )} */}

                {/* Report Table */}
                {!loading && !error && (
                    <PaginatedDataTable
                        rows={filteredData}
                        columns={columns}
                        pagination={false}  // Disable built-in pagination completely
                        paginationServer={false}
                        paginationTotalRows={0}
                    />
                )}

                {/* Custom Pagination */}
                {/* {!loading && !error && totalPages > 1 && (
                    <div className="pagination-container">


                        <div className="pagination-info">
                            <span>
                                Page {currentPage} of {totalPages}
                            </span>
                        </div>
                    </div>
                )} */}

                {/* No Data Message */}
                {!loading && !error && totalRecords === 0 && (
                    <div className="no-data">
                        <p>There are no records to display</p>
                    </div>
                )}
            </div>
        </>
    );
}

export default LoginRep