import React, { useEffect, useState } from 'react'
// import "./TourRegistrationRep.css"
import PaginatedDataTable from '../ReportTable/PaginatedDataTable';
import { axiosOther } from '../../../../../http/axios_base_url';

function TourRegistrationRep() {
    const columns = [
        {
            name: "S.No",
            selector: (row, index) => index,
            cell: (row, index) => (
                <span>{(currentPage - 1) * rowsPerPage + index + 1}</span>
            ),
            sortable: true,
            wrap: true
        },
        {
            name: "TOUR Ref No.",
            selector: row => row.TourId,
            cell: row => <span>{row.TourId || " "}</span>,
            sortable: true,
            wrap: true
        },
        {
            name: "Client Name",
            selector: row => row.ClientName,
            cell: row => <span>{row.ClientName || " "}</span>,
            sortable: true,
            wrap: true
        },
        {
            name: "Pax",
            selector: row => row.TotalPax,
            cell: row => <span>{row.TotalPax || " "}</span>,
            sortable: true,
            wrap: true
        },
        {
            name: "Invoice Date",
            selector: row => row.InvoiceDate,
            cell: row => <span>{row.InvoiceDate || " "}</span>,
            sortable: true,
            wrap: true
        },
        {
            name: "Arrival Date",
            selector: row => row.ArrivalDate,
            cell: row => <span>{row.ArrivalDate || " "}</span>,
            sortable: true,
            wrap: true
        },
        {
            name: "Dept. Date",
            selector: row => row.DepartureDate,
            cell: row => <span>{row.DepartureDate || " "}</span>,
            sortable: true,
            wrap: true
        },
        {
            name: "Day",
            selector: row => row.Day,
            cell: row => <span>{row.Day || " "}</span>,
            sortable: true,
            wrap: true
        },
        {
            name: "Lead Pax",
            selector: row => row.LeadPaxName,
            cell: row => <span>{row.LeadPaxName || " "}</span>,
            sortable: true,
            wrap: true
        },
        {
            name: "Invoice No.",
            selector: row => row.InvoiceNo,
            cell: row => <span>{row.InvoiceNo || " "}</span>,
            sortable: true,
            wrap: true
        },
        {
            name: "Exchange Rate",
            selector: row => row.Exchange,
            cell: row => <span>{row.Exchange || " "}</span>,
            sortable: true,
            wrap: true
        },
        {
            name: "Currency Amount",
            selector: row => row.Currency,
            cell: row => <span>{row.Currency || " "}</span>,
            sortable: true,
            wrap: true
        },
        {
            name: "Total Amount (INR)",
            selector: row => row.Total,
            cell: row => <span>{row.Total || " "}</span>,
            sortable: true,
            wrap: true
        },
        {
            name: "Net Amount (INR)",
            selector: row => row.Net,
            cell: row => <span>{row.Net || " "}</span>,
            sortable: true,
            wrap: true
        }
    ];

    const [filters, setFilters] = useState({
        clientName: "",
        destination: '',
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

    const getListDataToServer = async (page = currentPage) => {
        try {
            setLoading(true);
            setError(null);

            const { data } = await axiosOther.post("tourRegistrationReport", {
                ClientName: filters.clientName,
                FromDate: filters.fromDate,
                ToDate: filters.toDate,
                Destination: filters.destination,
                per_page: rowsPerPage,
                page: page
            });

            if (data?.data) {
                const processedData = data.data.map((item, index) => ({
                    ...item,
                    id: ((page - 1) * rowsPerPage) + index + 1,
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
            console.log("tourRegistrationReport-error", error);
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

    // Client-side search on API-filtered data
    const displayedRows = filteredData.filter(row =>
        Object.values(row).some(val =>
            String(val ?? "").toLowerCase().includes(search.toLowerCase())
        )
    );

    return (
        <div className='tour-registration-rep-main'>
            <h3>Tour Registration Report</h3>

            {/* Search + Filters */}
            <div className="tour-registration-rep-main-inputs">
                {/* Global Search */}
                {/* <div className="tour-registration-rep-main-inputs-search">
                    
                </div> */}

                {/* Filters */}
                <div className="tour-registration-rep-main-inputs-paramtr">
                    <form onSubmit={handleSearch} className="col-12">
                        <div className="tour-registration-rep-main-inputs-paramtr-flex row mb-3">

                            <div className='tour-registration-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2'>
                                <input
                                    type="text"
                                    placeholder="Search in all fields"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="form-control form-control-sm"
                                />
                            </div>

                            {/* Agent/Client Name */}
                            <div className="tour-registration-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    name="clientName"
                                    value={filters.clientName}
                                    onChange={handleChange}
                                    placeholder="Agent/Client"
                                />
                            </div>

                            {/* Start Date */}
                            <div className="tour-registration-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                <input
                                    type="date"
                                    className="form-control form-control-sm"
                                    name="fromDate"
                                    value={filters.fromDate}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* End Date */}
                            <div className="tour-registration-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                <input
                                    type="date"
                                    className="form-control form-control-sm"
                                    name="toDate"
                                    value={filters.toDate}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Submit */}
                            <div className="tour-registration-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                 <button type="submit" className="btn btn-primary btn-custom-size flex-shrink-0 flex-grow-0"> <i className='fa-brands fa-searchengin me-2'></i> Search</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <PaginatedDataTable
                columns={columns}
                rows={displayedRows}
                paginationTotalRows={totalRows}
                rowsPerPage={rowsPerPage}
                currentPage={currentPage}
                totalPage={totalPages}
                onRowsPerPageChange={handleRowsPerPageChange}
                onPageChange={handlePageChange}
            />
        </div>
    );
}

export default TourRegistrationRep;
