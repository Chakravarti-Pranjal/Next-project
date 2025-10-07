import React, { useEffect, useState } from 'react';
// import "./HotelBookingRep.css";
import { axiosOther } from '../../../../../http/axios_base_url';
import PaginatedDataTable from '../ReportTable/PaginatedDataTable';
import { Person } from '@mui/icons-material';



function HotelBookingRep() {

    // Table Columns
    const columns = [
        {
            wrap: true,
            name: "TourCode",
            selector: row => row.id,
            cell: row => <span>{row.id}</span>,
            sortable: true,
            width: "7rem",
        },
        {
            wrap: true,
            name: "Query ID",
            selector: row => row.QueryId,
            cell: row => <span>{row.QueryId}</span>,
            sortable: true,
            width: "8rem",
        },
        {
            wrap: true,
            name: "QuotationId",
            selector: row => row.QuotationNumber,
            cell: row => <span>{row.QuotationNumber}</span>,
            sortable: true,
            width: "8rem",
        },
        {
            wrap: true,
            name: "LeadPax Name",
            selector: row => row.LeadPaxName,
            cell: row => <span>{row.LeadPaxName}</span>,
            sortable: true,
            width: "10rem",
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
            name: "Hotel Name",
            selector: row => row.HotelName,
            cell: row => <span>{row.HotelName}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Check In Date",
            selector: row => row.CheckInDate,
            cell: row => <span>{row.CheckInDate}</span>,
            sortable: true,
            width: "10rem",
        },
        {
            wrap: true,
            name: "Check Out Date",
            selector: row => row.CheckOutDate,
            cell: row => <span>{row.CheckOutDate}</span>,
            sortable: true, width: "10rem",
        },
        {
            wrap: true,
            name: "Cut-off Date",
            selector: row => row.CutOffDate,
            cell: row => <span>{row.CutOffDate}</span>,
            sortable: true, width: "10rem",
        },
        {
            wrap: true,
            name: "Amount",
            selector: row => row.TotalAmount,
            cell: row => <span>{row.TotalAmount}</span>,
            sortable: true,
            width: "7rem",
        },
        {
            wrap: true,
            name: "Status",
            selector: row => row.HotelStatus,
            cell: row => <span>{row.HotelStatus}</span>,
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
        Destination: "",
        Hotel: "",
        FromDate: "",
        ToDate: "",
        Person: ""
    });

    const getListDataToServer = async (page = 1) => {
        try {
            setLoading(true);
            setError(null);

            const { data } = await axiosOther.post("hotelBookingReport", {
                ClientName: filters.ClientName,
                Destination: filters.Destination,
                Hotel: filters.Hotel,
                FromDate: filters.FromDate,
                ToDate: filters.ToDate,
                per_page: rowsPerPage,
                page: page
            });

            console.log(data.data, 'kdsfk5468')

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
            <div className='hotel-booking-rep-main'>
                <h3 >Hotel Booking Report</h3>

                {/* Search Input */}
                <div className="hotel-booking-rep-main-inputs">
                    {/* <div className="hotel-booking-rep-main-inputs-search">
                    </div> */}
                    <div className="hotel-booking-rep-main-inputs-paramtr">
                        <form onSubmit={handleSearch} className="col-12">
                            <div className="hotel-booking-rep-main-inputs-paramtr-flex row mb-3">

                                <div className="hotel-booking-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    <input type="text" placeholder="Search by name..." value={filters.ClientName} onChange={handleSearch} className="form-control form-control-sm" />

                                </div>
                                {/* <!-- Destination Select --> */}
                                <div className="hotel-booking-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    <select className="form-control form-control-sm" name="Destination"
                                        value={filters.Destination} onChange={handleChange}>
                                        <option value="volvo">Destination</option>
                                        <option value="saab">Agra</option>
                                        <option value="mercedes">Delhi</option>
                                        <option value="audi">Mumbai</option>
                                        <option value="audi">Jaipur</option>
                                    </select>
                                </div>

                                {/* <!-- Sales Select --> */}
                                <div className="hotel-booking-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    <select className="form-control form-control-sm" name="Person"
                                        value={filters.Person} onChange={handleChange}
                                    >
                                        <option value="volvo">Person</option>
                                        <option value="saab">Saab</option>
                                        <option value="mercedes">Mercedes</option>
                                        <option value="audi">Audi</option>
                                    </select>
                                </div>

                                {/* <!-- Agent Select --> */}
                                <div className="hotel-booking-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    <select className="form-control form-control-sm" name="Agent" value={filters.Agent} onChange={handleChange}>
                                        <option value="volvo">Agent</option>
                                        <option value="saab">Anand Travel</option>
                                        <option value="mercedes">Aaftab Travel</option>
                                        <option value="audi">Imtiaz Travel</option>
                                        <option value="audi">Volvo</option>
                                    </select>
                                </div>

                                {/* <!-- Operation Select --> */}
                                <div className="hotel-booking-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    <select className="form-control form-control-sm" name="Operation" value={filters.Operation} onChange={handleChange}>
                                        <option value="volvo">Operation</option>
                                        <option value="saab">Ansul Sharma</option>
                                        <option value="mercedes">Aazam Khan</option>
                                        <option value="audi">Mohd Rafiq</option>
                                        <option value="audi">Rashid Ali</option>
                                    </select>
                                </div>

                                {/* <!-- Finance Year --> */}
                                <div className="hotel-booking-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    <select className="form-control form-control-sm" name="FinanceYear" value={filters.FinanceYear} onChange={handleChange}>
                                        <option value="volvo">Finance Year</option>
                                        <option value="saab">Saab</option>
                                        <option value="mercedes">Mercedes</option>
                                        <option value="audi">Audi</option>
                                    </select>
                                </div>


                                {/* <!-- Month --> */}
                                <div className="hotel-booking-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    <select className="form-control form-control-sm" name="Month" value={filters.Month} onChange={handleChange}>
                                        <option value="volvo">Month</option>
                                        <option value="saab">Saab</option>
                                        <option value="mercedes">Mercedes</option>
                                        <option value="audi">Audi</option>
                                    </select>
                                </div>

                                {/* <!-- Start Date --> */}
                                <div className="hotel-booking-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    {/* <label for="start-date" className="form-label">Start</label> */}
                                    <input type="date" className="form-control form-control-sm" id="start-date" name="FromDate" value={filters.FromDate} onChange={handleChange} />
                                </div>

                                {/* <!-- End Date --> */}
                                <div className="hotel-booking-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    {/* <label for="end-date" className="form-label">End</label> */}
                                    <input type="date" className="form-control form-control-sm" id="end-date" name="ToDate" value={filters.ToDate} onChange={handleChange} />
                                </div>

                                {/* <!-- Submit Button --> */}
                                <div className="hotel-booking-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
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

export default HotelBookingRep;
