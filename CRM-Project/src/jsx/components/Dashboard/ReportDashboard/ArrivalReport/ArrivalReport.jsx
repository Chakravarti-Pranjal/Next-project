import React, { useEffect, useState } from 'react';
// import "./ArrivalReport.css";
import ReportTable from '../ReportTable/ReportTable';
import { axiosOther } from '../../../../../http/axios_base_url';
import PaginatedDataTable from '../ReportTable/PaginatedDataTable';

function ArrivalReport() {
    const columns = [
        {
            wrap: true,
            name: "S.No",
            selector: row => row.id,
            cell: (row, index) => <span>{index + 1}</span>,
            sortable: true,
            width: "6rem",
        },
        {
            wrap: true,
            name: "Query Id",
            selector: row => row.QueryID,
            cell: row => <span>{row.QueryID}</span>,
            sortable: true,
            width: "8rem",
        },
        {
            wrap: true,
            name: "Tour Id",
            selector: row => row.TourID,
            cell: row => <span>{row.TourID}</span>,
            sortable: true,
            width: "8rem",
        },
        {
            wrap: true,
            name: "LeadPax Name",
            selector: row => row.LeadPax,
            cell: row => <span>{row.LeadPax}</span>,
            sortable: true,
            width: "10rem",
        },
        {
            wrap: true,
            name: "Pax",
            selector: row => row.Pax,
            cell: row => <span>{row.Pax}</span>,
            sortable: true,
            width: "6rem",
        },
        {
            wrap: true,
            name: "Arrival Date",
            selector: row => row.ArrivalDate,
            cell: row => <span>{row.ArrivalDate}</span>,
            sortable: true,
            width: "8rem",
        },
        {
            wrap: true,
            name: "Arrival City",
            selector: row => row.ArrivalCity,
            cell: row => <span>{row.ArrivalCity}</span>,
            sortable: true,
            width: "8rem",
        },
        {
            wrap: true,
            name: "Dept. Date",
            selector: row => row.DeptDate,
            cell: row => <span>{row.DeptDate}</span>,
            sortable: true,
            width: "8rem",
        },
        {
            wrap: true,
            name: "Dept. City",
            selector: row => row.DeptCity,
            cell: row => <span>{row.DeptCity}</span>,
            sortable: true,
            width: "8rem",
        },
        {
            wrap: true,
            name: "Ops. Person",
            selector: row => row.OpsPerson,
            cell: row => <span>{row.OpsPerson}</span>,
            sortable: true,
            width: "9rem",
        },
        {
            wrap: true,
            name: "Sales Person",
            selector: row => row.SalesPerson,
            cell: row => <span>{row.SalesPerson}</span>,
            sortable: true,
            width: "9rem",
        },
        {
            wrap: true,
            name: "Agent Name",
            selector: row => row.Agent_Name,
            cell: row => <span>{row.Agent_Name}</span>,
            sortable: true,
            width: "9rem",
        },
        {
            wrap: true,
            name: "Nationality",
            selector: row => row.Nationality,
            cell: row => <span>{row.Nationality}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Vehicle",
            selector: row => row.Vehicle,
            cell: row => <span>{row.Vehicle}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Remarks",
            selector: row => row.Remarks,
            cell: row => <span>{row.Remarks}</span>
        }
    ];

    const [filters, setFilters] = useState({
        QuotationNumber: "",
        QueryId: "",
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

            const { data } = await axiosOther.post("arrivalsReport", {
                QuotationNumber: filters.QuotationNumber,
                QueryId: filters.QueryId,
                per_page: rowsPerPage,
                page: currentPage
            });

            if (data?.DataList) {
                const processedData = data?.DataList?.map((item, index) => ({
                    ...item,
                    id: ((currentPage - 1) * rowsPerPage) + index + 1,
                }));

                setFilteredData(processedData);
                setTotalPages(data.TotalPages || 0);
                setTotalRows(data.TotalRecord || 0);
                setRowsPerPage(data.PerPage);
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
        <div className='arrival-rep-main'>
            <h3>Arrival Report</h3>

            <div className="arrival-rep-main-inputs">
                {/* <div className="arrival-rep-main-inputs-search"> */}
                {/* <input
                    type="text"
                    placeholder="Search by name..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="arrival-rep-main-inputs-search-inp"
                /> */}
                {/* </div> */}

                <div className="arrival-rep-main-inputs-paramtr">
                    <form onSubmit={handleSearch} className="">
                        <div className="arrival-rep-main-inputs-paramtr-flex row ">

                            <div className="arrival-rep-main-inputs-paramtr-flex-slct col-6 col-md-2 col-lg-2 mb-2">
                                <input
                                    type="text"
                                    placeholder="Search by name..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="form-control form-control-sm"
                                />
                            </div>

                            <div className="arrival-rep-main-inputs-paramtr-flex-slct col-6 col-md-2 col-lg-2 mb-2">
                                <input type="text" className="form-control form-control-sm" name="agent" placeholder='Agent' />
                            </div>

                            <div className="arrival-rep-main-inputs-paramtr-flex-slct col-6 col-md-2 col-lg-2 mb-2">
                                <input type="date" className="form-control form-control-sm" name="start" id="start-date" />
                            </div>

                            <div className="arrival-rep-main-inputs-paramtr-flex-slct col-6 col-md-2 col-lg-2 mb-2">
                                <input type="date" className="form-control form-control-sm" name="end" id="end-date" />
                            </div>

                            <div className="arrival-rep-main-inputs-paramtr-flex-slct col-6 col-md-2 col-lg-2 mb-2">
                                <button type="submit" className="btn btn-primary btn-custom-size flex-shrink-0 flex-grow-0"> <i className='fa-brands fa-searchengin me-2'></i> Search</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <PaginatedDataTable rows={filteredData} columns={columns} />
        </div>
    );
}

export default ArrivalReport;
