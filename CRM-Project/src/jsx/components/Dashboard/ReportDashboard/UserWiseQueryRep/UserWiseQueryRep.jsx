// import "./UserWiseQueryRep.css"
import ReportTable from '../ReportTable/ReportTable';
import React, { createContext, useEffect, useState } from 'react';
import { axiosOther } from "../../../../../http/axios_base_url";

function UserWiseQueryRep() {
    const columns = [
        {
            name: "S.No",
            selector: (row, index) => index,
            cell: (row, index) => <span>{(currentPage - 1) * rowsPerPage + index + 1}</span>,
            wrap: true,
            sortable: true,
        },
        {
            name: "User Name",
            selector: row => row.UserName || "N/A",
            cell: row => <span>{row.UserName || "N/A"}</span>,
            wrap: true,
            sortable: true,
        },
        {
            name: "Department",
            selector: row => row.UserName || "N/A",
            cell: row => <span>{row.UserName || "N/A"}</span>,
            wrap: true,
            sortable: true,
        },
        {
            name: "Total Queries",
            selector: row => row.TotalQueries || 0,
            cell: row => <span>{row.TotalQueries || 0}</span>,
            wrap: true,
            sortable: true,
        },
        {
            name: "Confirmed",
            selector: row => row.Confirmed || 0,
            cell: row => <span>{row.Confirmed || 0}</span>,
            wrap: true,
            sortable: true,
        },
        {
            name: "Reverted",
            selector: row => row.Reverted || 0,
            cell: row => <span>{row.Reverted || 0}</span>,
            wrap: true,
            sortable: true,
        },
        {
            name: "Sent",
            selector: row => row.Sent || 0,
            cell: row => <span>{row.Sent || 0}</span>,
            wrap: true,
            sortable: true,
        },
        {
            name: "Follow Up",
            selector: row => row.FollowUp || 0,
            cell: row => <span>{row.FollowUp || 0}</span>,
            wrap: true,
            sortable: true,
        },
        {
            name: "Lost",
            selector: row => row.Lost || 0,
            cell: row => <span>{row.Lost || 0}</span>,
            wrap: true,
            sortable: true,
        },
        {
            name: "MAT(%)",
            selector: row => row.MA || "0%",
            cell: row => <span>{row.MA || "0%"}</span>,
            wrap: true,
            sortable: true,
        },
        {
            name: "Sales",
            selector: row => row.SellAmount || 0,
            cell: row => <span>{row.SellAmount || 0}</span>,
            wrap: true,
            sortable: true,
        },
        {
            name: "Margin",
            selector: row => row.NetMargin || 0,
            cell: row => <span>{row.NetMargin || 0}</span>,
            wrap: true,
            sortable: true,
        },
        {
            name: "Total Pax",
            selector: row => row.TotalPax || 0,
            cell: row => <span>{row.TotalPax || 0}</span>,
            wrap: true,
            sortable: true,
        },
        {
            name: "Total Nights",
            selector: row => row.TotalNights || 0,
            cell: row => <span>{row.TotalNights || 0}</span>,
            wrap: true,
            sortable: true,
        },
    ];

    const [filters, setFilters] = useState({
        userName: "",
        fromDate: "",
        toDate: "",
        month: ""
    });
    const [search, setSearch] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getListDataToServer = async () => {
        try {
            setLoading(true);
            setError(null);

            const { data } = await axiosOther.post("userWiseReport", {
                UserName: filters.userName,
                FromDate: filters.fromDate,
                ToDate: filters.toDate,
                Month: filters.month,
                per_page: rowsPerPage,
                page: currentPage
            });

            if (data?.data) {
                const processedData = data.data.map((item, index) => ({
                    ...item,
                    id: ((currentPage - 1) * rowsPerPage) + index + 1,
                }));

                setFilteredData(processedData);
                setTotalPages(data.last_page || 0);
                setTotalRows(data.total || 0);
                setRowsPerPage(data.per_page);
            } else {
                setError("No data received from API");
                setFilteredData([]);
                setTotalPages(0);
            }
        } catch (error) {
            console.log("newsletter-error", error);
            setError("Failed to fetch data: " + error.message);
            setFilteredData([]);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getListDataToServer(currentPage);
    }, [rowsPerPage, currentPage, filters]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        getListDataToServer(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleRowsPerPageChange = (newRowsPerPage) => {
        setRowsPerPage(newRowsPerPage);
    };

    // Client-side search filter
    const displayedRows = filteredData.filter(row =>
        Object.values(row).some(val =>
            String(val).toLowerCase().includes(search.toLowerCase())
        )
    );

    return (
        <>
            <div className='userwise-query-rep-main'>
                <h3>User Wise Query Report</h3>

                {/* Search and Filter Section */}
                <div className="userwise-query-rep-main-inputs">


                    <div className="userwise-query-rep-main-inputs-paramtr">
                        <form onSubmit={handleSearch} className="col-12">
                            <div className="userwise-query-rep-main-inputs-paramtr-flex row mb-3">
                                {/* Agent Select */}

                                <div className="userwise-query-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    <input
                                        type="text"
                                        placeholder="Search by name, queries, or ID..."
                                        value={search}
                                        onChange={handleSearch}
                                        className="form-control form-control-sm"
                                    />
                                </div>
                                <div className="userwise-query-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    <select className="form-control form-control-sm" name="agent">
                                        <option value="all">All Users</option>
                                        {filteredData.map((agent, index) => (
                                            <option key={index} value={agent.UserName}>
                                                {agent.UserName || `User ${index + 1}`}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Finance Year */}
                                <div className="userwise-query-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    <select className="form-control form-control-sm" name="year">
                                        <option value="">Finance Year</option>
                                        <option value="2024">2024</option>
                                        <option value="2023">2023</option>
                                        <option value="2022">2022</option>
                                    </select>
                                </div>

                                {/* Month */}
                                <div className="userwise-query-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    <select className="form-control form-control-sm" name="month">
                                        <option value="">Select Month</option>
                                        <option value="01">January</option>
                                        <option value="02">February</option>
                                        <option value="03">March</option>
                                        <option value="04">April</option>
                                        <option value="05">May</option>
                                        <option value="06">June</option>
                                        <option value="07">July</option>
                                        <option value="08">August</option>
                                        <option value="09">September</option>
                                        <option value="10">October</option>
                                        <option value="11">November</option>
                                        <option value="12">December</option>
                                    </select>
                                </div>

                                {/* Start Date */}
                                <div className="userwise-query-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    <input type="date" className="form-control form-control-sm" name="start" id="start-date" />
                                </div>

                                {/* End Date */}
                                <div className="userwise-query-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    <input type="date" className="form-control form-control-sm" name="end" id="end-date" />
                                </div>

                                {/* Submit Button */}
                                <div className="userwise-query-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                     <button type="submit" className="btn btn-primary btn-custom-size flex-shrink-0 flex-grow-0"> <i className='fa-brands fa-searchengin me-2'></i> Search</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Use ReportTable component with pagination */}
                <ReportTable
                    rows={filteredData}
                    columns={columns}
                    pagination={true}
                    paginationPerPage={rowsPerPage}
                    paginationDefaultPage={currentPage + 1}
                    paginationTotalRows={filteredData.length}
                    onChangeRowsPerPage={handleRowsPerPageChange}
                    onChangePage={handlePageChange}
                />
            </div>
        </>
    );
}

export default UserWiseQueryRep;