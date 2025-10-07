import React, { useEffect, useState } from 'react'
// import "./HotelWaitListRep.css"
import PaginatedDataTable from '../ReportTable/PaginatedDataTable';
import { axiosOther } from '../../../../../http/axios_base_url';


function HotelWaitListRep() {
    // Table Columns
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
            name: "Tour Code",
            selector: row => row.TourId,
            cell: row => <span>{row.TourId}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Hotel",
            selector: row => row.HotelName,
            cell: row => <span>{row.HotelName}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Destination",
            selector: row => row.Destination,
            cell: row => <span>{row.Destination}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Nights",
            selector: row => row.Nights,
            cell: row => <span>{row.Nights}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Total Pax",
            selector: row => row.TotalPax,
            cell: row => <span>{row.TotalPax}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Single Room",
            selector: row => row.SingleRoom,
            cell: row => <span>{row.SingleRoom}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Double Room",
            selector: row => row.DoubleRoom,
            cell: row => <span>{row.DoubleRoom}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Triple Room",
            selector: row => row.TripleRoom,
            cell: row => <span>{row.TripleRoom}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Twin Room",
            selector: row => row.TwinRoom,
            cell: row => <span>{row.TwinRoom}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "EBed Adult",
            selector: row => row.EBedAdult,
            cell: row => <span>{row.EBedAdult}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "CWB Room",
            selector: row => row.CWBRoom,
            cell: row => <span>{row.CWBRoom}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "CNB Room",
            selector: row => row.CNBRoom,
            cell: row => <span>{row.CNBRoom}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Total Rooms",
            selector: row => row.TotalRooms,
            cell: row => <span>{row.TotalRooms}</span>,
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
        Destination: "",
        Hotel: "",
        FromDate: "",
        ToDate: "",
        ClientName: ""
    });

    const getListDataToServer = async (page = 1) => {
        try {
            setLoading(true);
            setError(null);

            const { data } = await axiosOther.post("hotelWaitList", {
                ClientName: filters.ClientName,
                Destination: filters.Destination,
                Hotel: filters.Hotel,
                FromDate: filters.FromDate,
                ToDate: filters.ToDate,
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
            <div className='hotel-wait-list-rep-main'>
                <h3 >Hotel Wait List Report</h3>

                {/* Search Input */}
                <div className="hotel-wait-list-rep-main-inputs">
                    {/* <div className="hotel-wait-list-rep-main-inputs-search">
                    </div> */}
                    <div className="hotel-wait-list-rep-main-inputs-paramtr">
                        <form onSubmit={handleSearch} className="col-12">
                            <div className="hotel-wait-list-rep-main-inputs-paramtr-flex row mb-3">

                                <div className="hotel-wait-list-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    <input type="text" placeholder="Search by name..." name='Destination' value={filters.Destination} onChange={handleSearch} className="form-control form-control-sm" />

                                </div>

                                {/* <!-- Destination Select --> */}
                                <div className="hotel-wait-list-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    <select className="form-control form-control-sm" name="Destination" value={filters.Destination} onChange={handleChange}>
                                        <option value="volvo">Destinations</option>
                                        <option value="saab">Agra</option>
                                        <option value="mercedes">Delhi</option>
                                        <option value="audi">Jaipur</option>
                                        <option value="audi">Mumbai</option>
                                    </select>
                                </div>


                                {/* <!-- Hotel Chain Select --> */}
                                <div className="hotel-wait-list-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    <select className="form-control form-control-sm" name="Hotel" value={filters.Hotel} onChange={handleChange}>
                                        <option value="volvo">All Hotels</option>
                                        <option value="saab">The Taj</option>
                                        <option value="mercedes">The Leela Hotel</option>
                                        <option value="audi">Sagar Ratna</option>
                                        <option value="audi">5 Star Hotel</option>
                                    </select>
                                </div>

                                {/* <!-- Start Date --> */}
                                <div className="hotel-wait-list-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    {/* <label for="start-date" className="form-label">Start</label> */}
                                    <input type="date" className="form-control form-control-sm" id="start-date" name="FromDate" value={filters.FromDate} onChange={handleChange} />
                                </div>

                                {/* <!-- End Date --> */}
                                <div className="hotel-wait-list-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    {/* <label for="end-date" className="form-label">End</label> */}
                                    <input type="date" className="form-control form-control-sm" id="end-date" name="ToDate" value={filters.ToDate} onChange={handleChange} />
                                </div>

                                {/* <!-- Submit Button --> */}
                                <div className="hotel-wait-list-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
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

export default HotelWaitListRep