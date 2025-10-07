import React, { useEffect, useState } from 'react'
// import "./GuestListRep.css"
import ReportTable from '../ReportTable/ReportTable';
import PaginatedDataTable from '../ReportTable/PaginatedDataTable';
import { axiosOther } from '../../../../../http/axios_base_url';


function GuestListRep() {
    // Table Columns
    const columns = [
        {
            wrap: true,
            name: "S.N",
            selector: (row, index) => index,
            cell: (row, index) => (
                <span>{(currentPage - 1) * rowsPerPage + index + 1}</span>
            ),
            sortable: true,
            width: "6rem",

        },
        {
            wrap: true,
            name: "Tour Id",
            selector: row => row.TourId,
            cell: row => <span>{row.TourId}</span>,
            sortable: true,
            width: "7rem",
        },
        {
            wrap: true,
            name: "Tour Date",
            selector: row => row.FromDate,
            cell: row => <span>{row.FromDate}</span>,
            sortable: true,
            width: "8rem",
        },
        {
            wrap: true,
            name: "Name",
            selector: row => row.FirstName,
            cell: row => <span>{row.FirstName}</span>,
            sortable: true,
            width: "6rem",
        },
        {
            wrap: true,
            name: "Address",
            selector: row => row.Address,
            cell: row => <span>{row.Address}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Contact Information",
            selector: row => row.ContactInformation,
            cell: row => <span>{row.ContactInformation}</span>,
            sortable: true,
            width: "11rem",
        },
        {
            wrap: true,
            name: "Address Proof",
            selector: row => row.AddressProof,
            cell: row => <span>{row.AddressProof}</span>,
            sortable: true,
            width: "10rem",
        },
        {
            wrap: true,
            name: "Passport",
            selector: row => row.PassportNumber,
            cell: row => <span>{row.PassportNumber}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "VISA",
            selector: row => row.VISA,
            cell: row => <span>{row.VISA}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Other",
            selector: row => row.Other,
            cell: row => <span>{row.Other}</span>,
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

    const [filters, setFilters] = useState({
        Status: ""
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

            const { data } = await axiosOther.post("listGuests", {
                Status: filters.Status,
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
            <div className='guest-list-rep-main'>
                <h3 >Guest List Report</h3>

                {/* Search Input */}
                <div className="guest-list-rep-main-inputs">
                    {/* <div className="guest-list-rep-main-inputs-search">
                    </div> */}
                    <div className="guest-list-rep-main-inputs-paramtr">
                        <form onSubmit={handleSearch} className="col-12">
                            <div className="guest-list-rep-main-inputs-paramtr-flex row mb-3">
                                <div className="guest-list-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    <input type="text" placeholder="Search by name..." value={search} onChange={(e) => setSearch(e.target.value)} className="form-control form-control-sm" />

                                </div>

                                {/* <!-- Agent Select --> */}
                                <div className="guest-list-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    <select className="form-control form-control-sm" name="audit">
                                        <option value="volvo">Status</option>
                                        <option value="saab">Completed</option>
                                        <option value="saab">Pending</option>
                                    </select>
                                </div>


                                {/* <!-- Start Date --> */}
                                <div className="guest-list-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    {/* <label for="start-date" className="form-label">Start</label> */}
                                    <input type="date" className="form-control form-control-sm" name="start" id="start-date" />
                                </div>

                                {/* <!-- End Date --> */}
                                <div className="guest-list-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    {/* <label for="end-date" className="form-label">End</label> */}
                                    <input type="date" className="form-control form-control-sm" name="end" id="end-date" />
                                </div>

                                {/* <!-- Submit Button --> */}
                                <div className="guest-list-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                     <button type="submit" className="btn btn-primary btn-custom-size flex-shrink-0 flex-grow-0"> <i className='fa-brands fa-searchengin me-2'></i> Search</button>
                                </div>
                            </div>
                        </form>
                    </div >
                </div >

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

            </div >
        </>
    );
}

export default GuestListRep