import React, { useEffect, useState } from 'react'
// import "./IncomingTourStatusRep.css"
import PaginatedDataTable from '../ReportTable/PaginatedDataTable';
import { axiosOther } from '../../../../../http/axios_base_url';


function IncomingTourStatusRep() {
    const columns = [
        {
            wrap: true,
            name: "S.No",
            selector: (row, index) => index,
            cell: (row, index) => (
                <span>{(currentPage - 1) * rowsPerPage + index + 1}</span>
            ),
            sortable: true
        },
        {
            wrap: true,
            name: "TOUR Code",
            selector: row => row.TourId,
            cell: row => <span>{row.TourId}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Agent Name",
            selector: row => row.BusinessTypeName,
            cell: row => <span>{row.BusinessTypeName}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Pax",
            selector: row => row.Pax,
            cell: row => <span>{row.Pax}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Days",
            selector: row => row.Days,
            cell: row => <span>{row.Days}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Query.Date",
            selector: row => row.FromDate,
            cell: row => <span>{row.FromDate}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Tour Date",
            selector: row => row.TourDate,
            cell: row => <span>{row.TourDate}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Hotel",
            selector: row => row.Hotel,
            cell: row => <span>{row.Hotel}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Meal",
            selector: row => row.Meal,
            cell: row => <span>{row.Meal}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Guide",
            selector: row => row.Guide,
            cell: row => <span>{row.Guide}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Transfer",
            selector: row => row.Transfer,
            cell: row => <span>{row.Transfer}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Transportation",
            selector: row => row.Transport,
            cell: row => <span>{row.Transport}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Activity",
            selector: row => row.Activity,
            cell: row => <span>{row.Activity}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Air Res.",
            selector: row => row.Flight,
            cell: row => <span>{row.Flight}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Train Res.",
            selector: row => row.Train,
            cell: row => <span>{row.Train}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Other",
            selector: row => row.Others,
            cell: row => <span>{row.Others}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Status",
            selector: row => row.Status,
            cell: row => <span>{row.Status}</span>,
            sortable: true
        }
    ];

    const [filteredData, setFilteredData] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState({
        ClientName: "",
        TravelDate: "",
    });


    const getListDataToServer = async (page = 1) => {
        try {
            setLoading(true);
            setError(null);

            const { data } = await axiosOther.post("incomingTourStatus", {
                ClientName: filters.ClientName,
                TravelDate: filters.TravelDate,
                per_page: rowsPerPage,
                page: page
            });

            if (data?.data) {
                // Add serial numbers and process data
                const processedData = data.data.map((item, index) => ({
                    ...item,
                    id: ((page - 1) * rowsPerPage) + index + 1,
                }));

                console.log(processedData, 'processedData')

                setFilteredData(processedData);
                setTotalPages(data.last_page || 0);
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


    // Search Filter Function
    const handleSearch = (event) => {
        e.preventDefault();
        setCurrentPage(1);
        getListDataToServer(1);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    // Pagination handlers
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleRowsPerPageChange = (newRowsPerPage) => {
        setRowsPerPage(newRowsPerPage);
        setCurrentPage(1);
    };

    return (
        <>
            <div className='incoming-tour-status-rep-main'>
                <h3 >Incoming Tour Status Report - Summary</h3>

                {/* Search Input */}
                <div className="incoming-tour-status-rep-main-inputs">
                    {/* <div className="incoming-tour-status-rep-main-inputs-search">
                    </div> */}
                    <div className="incoming-tour-status-rep-main-inputs-paramtr">
                        <form action="" className="col-12">
                            <div className="incoming-tour-status-rep-main-inputs-paramtr-flex row mb-3">
                                <div className="incoming-tour-status-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    <input type="text" placeholder="Search by name..." value={filters.ClientName} onChange={handleSearch} className="form-control form-control-sm" />
                                </div>

                                {/* <!-- Agent Select --> */}
                                <div className="incoming-tour-status-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    <select className="form-control form-control-sm" name="ClientName" value={filters.ClientName} onChange={handleChange}>
                                        <option value="volvo">Ajay Bahal</option>
                                        <option value="saab">Sameer</option>
                                        <option value="saab">Rihaan Khan</option>
                                    </select>
                                </div>


                                {/* <!-- Start Date --> */}
                                <div className="incoming-tour-status-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    {/* <label for="start-date" className="form-label">Start</label> */}
                                    <input type="date" className="form-control form-control-sm" name="startDate" id="start-date" value={filters.startDate} onChange={handleChange} />
                                </div>

                                {/* <!-- End Date --> */}
                                <div className="incoming-tour-status-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    {/* <label for="end-date" className="form-label">End</label> */}
                                    <input type="date" className="form-control form-control-sm" name="end" id="end-date" />
                                </div>

                                {/* <!-- Submit Button --> */}
                                <div className="incoming-tour-status-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                     <button type="submit" className="btn btn-primary btn-custom-size flex-shrink-0 flex-grow-0"> <i className='fa-brands fa-searchengin me-2'></i> Search</button>
                                </div>
                            </div>
                        </form>
                    </div >
                </div >


                <PaginatedDataTable
                    columns={columns}
                    rows={filteredData}
                    paginationTotalRows={100}
                    rowsPerPage={rowsPerPage}
                    currentPage={currentPage}
                    totalPage={totalPages}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    onPageChange={handlePageChange}
                />
            </div >
        </>
    );
}

export default IncomingTourStatusRep