import React, { useState, useEffect } from 'react';
import PaginatedDataTable from '../ReportTable/PaginatedDataTable';
import { axiosOther } from "../../../../../http/axios_base_url";

function NewsLetterRep() {
    const [newsLetterData, setNewsLetterData] = useState([]);
    const [search, setSearch] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedAgent, setSelectedAgent] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const getListDataToServer = async (page = 1, searchTerm = "", agent = "", start = "", end = "") => {
        try {
            setLoading(true);
            setError(null);

            // Format dates to yyyy-mm-dd
            const formattedStartDate = start ? new Date(start).toISOString().split('T')[0] : "";
            const formattedEndDate = end ? new Date(end).toISOString().split('T')[0] : "";

            const requestData = {
                page: page,
                per_page: rowsPerPage,
                Type: searchTerm,
                FromDate: formattedStartDate,
                ToDate: formattedEndDate,
            };

            const { data } = await axiosOther.post("newslatterReport", requestData);

            if (data?.DataList) {
                const processedData = data.DataList.map((item, index) => ({
                    ...item,
                    id: ((page - 1) * rowsPerPage) + index + 1,
                }));

                setNewsLetterData(processedData);
                setFilteredData(processedData);
                setTotalPages(data.TotalPages || 0);
                setTotalRecords(data.TotalRecords || 0);
                setRowsPerPage(data.PerPage || rowsPerPage);
                setCurrentPage(data.CurrentPage || page);
            } else {
                setError("No data received from API");
                setNewsLetterData([]);
                setFilteredData([]);
                setTotalPages(0);
                setTotalRecords(0);
            }
        } catch (error) {
            console.error("newsletter-error", error);
            setError("Failed to fetch data: " + error.message);
            setNewsLetterData([]);
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
            name: "Contact Person Name",
            selector: row => row.FullName || "N/A",
            cell: row => <span>{row.FullName || "N/A"}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Contact Email Id",
            selector: row => row.Email || "N/A",
            cell: row => <span>{row.Email || "N/A"}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Phone No",
            selector: row => row.Phone || "N/A",
            cell: row => <span>{row.Phone || "N/A"}</span>,
            sortable: true
        }
    ];

    // Local search filter (client-side)
    const handleSearch = (event) => {
        const searchTerm = event.target.value.toLowerCase();
        setSearch(searchTerm);

        if (newsLetterData.length > 0) {
            const filteredRows = newsLetterData.filter(row =>
                row.FullName?.toLowerCase().includes(searchTerm) ||
                row.Email?.toLowerCase().includes(searchTerm) ||
                row.Phone?.toLowerCase().includes(searchTerm) ||
                row.id?.toString().toLowerCase().includes(searchTerm)
            );
            setFilteredData(filteredRows);
        }
    };

    // Form submission handler for server-side filtering
    const handleFormSubmit = (event) => {
        event.preventDefault();
        setCurrentPage(1);
        getListDataToServer(1, search, selectedAgent, startDate, endDate);
        // setStartDate("");
        // setEndDate("");
    };

    // Pagination handlers
    const handlePageChange = (page) => {
        setCurrentPage(page);
        getListDataToServer(page, search, selectedAgent, startDate, endDate);
    };

    const handleRowsPerPageChange = (newRowsPerPage) => {
        setRowsPerPage(newRowsPerPage);
        setCurrentPage(1);
        getListDataToServer(1, search, selectedAgent, startDate, endDate);
    };

    return (
        <div className='news-letter-rep-main'>
            <h3>News Letter Report</h3>

            <div className="news-letter-rep-main-inputs">
                <div className="news-letter-rep-main-inputs-paramtr">
                    <form onSubmit={handleFormSubmit} className="col-12">
                        <div className="news-letter-rep-main-inputs-paramtr-flex row mb-3">
                            <div className="news-letter-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                <input
                                    type="text"
                                    placeholder="Search by name, email, or phone..."
                                    value={search}
                                    onChange={handleSearch}
                                    className="form-control form-control-sm"
                                />
                            </div>

                            <div className="news-letter-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                <input
                                    type="date"
                                    className="form-control form-control-sm"
                                    name="start"
                                    id="start-date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>

                            <div className="news-letter-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                <input
                                    type="date"
                                    className="form-control form-control-sm"
                                    name="end"
                                    id="end-date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>

                            <div className="news-letter-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                <button 
                                    type="submit" 
                                    className="btn btn-primary btn-custom-size flex-shrink-0 flex-grow-0"
                                    disabled={loading}
                                >
                                    <i className='fa-brands fa-searchengin me-2'></i> 
                                    {loading ? 'Searching...' : 'Search'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {loading && (
                <div className="loading-state">
                    <p>Loading data...</p>
                </div>
            )}

            {error && (
                <div className="error-state">
                    <p>{error}</p>
                </div>
            )}

            {!loading && !error && (
                <PaginatedDataTable
                    columns={columns}
                    rows={filteredData}
                    paginationTotalRows={totalRecords}
                    rowsPerPage={rowsPerPage}
                    currentPage={currentPage}
                    totalPage={totalPages}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    onPageChange={handlePageChange}
                />
            )}

            
        </div>
    );
}

export default NewsLetterRep;