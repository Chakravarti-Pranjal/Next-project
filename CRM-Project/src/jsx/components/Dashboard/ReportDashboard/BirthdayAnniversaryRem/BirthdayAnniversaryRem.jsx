import React, { useState, useEffect } from 'react';
// import "./BirthdayAnniversaryRem.css";
import ReportTable from '../ReportTable/ReportTable';
import { axiosOther } from "../../../../../http/axios_base_url";
import PaginatedDataTable from '../ReportTable/PaginatedDataTable';

function BirthdayAnniversaryRem() {
    const [birthdayAnniversaryData, setBirthdayAnniversaryData] = useState([]);
    const [search, setSearch] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [perPage, setPerPage] = useState(10);

    // Filter state
    const [selectedEventType, setSelectedEventType] = useState("");

    // console.log(totalPages, "totalPages");

    // Function to map API response to expected format
    const mapApiDataToTableFormat = (apiData) => {
        return apiData.map((item, index) => {
            const contactPersonName = [item.FirstName, item.LastName]
                .filter(name => name && name.trim() !== '')
                .join(' ') || 'N/A';

            let eventType = 'N/A';
            let eventDate = 'N/A';

            if (item.DateOfBirth && item.AnniversaryDate) {
                eventType = 'Birthday & Anniversary';
                eventDate = `Birth: ${item.DateOfBirth}, Anniversary: ${item.AnniversaryDate}`;
            } else if (item.DateOfBirth) {
                eventType = 'Birthday';
                eventDate = item.DateOfBirth;
            } else if (item.AnniversaryDate) {
                eventType = 'Anniversary';
                eventDate = item.AnniversaryDate;
            }

            return {
                id: ((currentPage - 1) * perPage) + index + 1,
                ContactPersonName: contactPersonName,
                ContactEmailId: item.Email || 'N/A',
                PhoneNo: item.Phone || 'N/A',
                EventType: eventType,
                EventDate: eventDate,
                Type: item.Type || 'N/A',
                FirstName: item.FirstName,
                LastName: item.LastName,
                DateOfBirth: item.DateOfBirth,
                AnniversaryDate: item.AnniversaryDate
            };
        });
    };

    const getListDataToServer = async () => {
        try {
            setLoading(true);
            setError(null);

            // Build the request payload
            const requestData = {
                page: currentPage,
                PerPage: perPage,
                FirstName: search,
                BirthDay: '',
                Anniversary: ''
            };

            const { data } = await axiosOther.post("dateofBirthReport", requestData);
            // console.log("API Response:", data);

            if (data?.DataList) {
                // Map API data to expected format
                const processedData = mapApiDataToTableFormat(data.DataList);

                setBirthdayAnniversaryData(processedData);
                setFilteredData(processedData);
                setTotalPages(data?.TotalPages || 0);
                setTotalRecords(data?.TotalRecord || 0 ); 
            } else {
                setError("No data received from API");
                setBirthdayAnniversaryData([]);
                setFilteredData([]);
                setTotalPages(0);
                setTotalRecords(0);
            }
        } catch (error) {
            console.log("birthday-anniversary-error", error);
            setError("Failed to fetch data: " + error.message);
            setBirthdayAnniversaryData([]);
            setFilteredData([]);
            setTotalPages(0);
            setTotalRecords(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getListDataToServer();
    }, [perPage, currentPage]);

    // Table Columns
    const columns = [
        {
            wrap: true,
            name: "S.No",
            selector: row => row.id,
            cell: row => <span>{row.id}</span>,
            sortable: true,
            width: "6rem"
        },
        {
            wrap: true,
            name: "Contact Person Name",
            selector: row => row.ContactPersonName,
            cell: row => <span>{row.ContactPersonName || "N/A"}</span>,
            sortable: true,
            width: "12rem",
        },
        {
            wrap: true,
            name: "Contact Email Id",
            selector: row => row.ContactEmailId,
            cell: row => <span>{row.ContactEmailId || "N/A"}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Phone No",
            selector: row => row.PhoneNo,
            cell: row => <span>{row.PhoneNo || "N/A"}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Type",
            selector: row => row.Type,
            cell: row => <span>{row.Type || "N/A"}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Event Type",
            selector: row => row.EventType,
            cell: row => <span>{row.EventType || "N/A"}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Event Date",
            selector: row => row.EventDate,
            cell: row => <span>{row.EventDate || "N/A"}</span>,
            sortable: true
        }
    ];

    // // Search Filter Function
    // const handleSearch = (event) => {
    //     const searchTerm = event.target.value.toLowerCase();
    //     setSearch(searchTerm);

    //     if (birthdayAnniversaryData.length > 0) {
    //         const filteredRows = birthdayAnniversaryData.filter(row =>
    //             row.ContactPersonName?.toLowerCase().includes(searchTerm) ||
    //             row.ContactEmailId?.toLowerCase().includes(searchTerm) ||
    //             row.PhoneNo?.toLowerCase().includes(searchTerm) ||
    //             row.EventType?.toLowerCase().includes(searchTerm) ||
    //             row.EventDate?.toLowerCase().includes(searchTerm) ||
    //             row.Type?.toLowerCase().includes(searchTerm) ||
    //             row.id?.toString().toLowerCase().includes(searchTerm)
    //         );
    //         setFilteredData(filteredRows);
    //     }
    // };

    // Form submission handler
    const handleFormSubmit = (event) => {
        event.preventDefault();
        setCurrentPage(1); // Reset to first page
        getListDataToServer(1, search, selectedEventType);
    };

    const handlePageChange = (page) => {
    setCurrentPage(page);
};

const handleRowsPerPageChange = (newRowsPerPage) => {
    console.log(newRowsPerPage, 'newRowsPerPage753')
    setPerPage(newRowsPerPage);
    setCurrentPage(1);
    getListDataToServer(1, search, selectedEventType);  
};

    return (
        <>
            <div className='birthday-anni-rep-main'>
                <h3>Birthday & Anniversary Reminder Report</h3>

                {/* Search Input */}
                <div className="birthday-anni-rep-main-inputs">
                    {/* <div className="birthday-anni-rep-main-inputs-search">
                        
                    </div> */}
                    <div className="birthday-anni-rep-main-inputs-paramtr">
                        <form onSubmit={handleFormSubmit} className="col-12">
                            <div className="birthday-anni-rep-main-inputs-paramtr-flex row mb-3">
                                <div className="birthday-anni-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    <input
                                        type="text"
                                        placeholder="Search by name, email, phone, event type..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="form-control form-control-sm"
                                    />
                                </div>

                                {/* Event Type Select */}
                                <div className="birthday-anni-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    <select
                                        className="form-control form-control-sm"
                                        name="eventType"
                                        value={selectedEventType}
                                        onChange={(e) => setSelectedEventType(e.target.value)}
                                    >
                                        <option value="">All Events</option>
                                        <option value="birthday">Birthday</option>
                                        <option value="anniversary">Anniversary</option>
                                    </select>
                                </div>

                                {/* Submit Button */}
                                <div className="birthday-anni-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    {/* <button
                                        type="submit"
                                        className="form-control form-control-btn"
                                        disabled={loading}
                                    >
                                        {loading ? 'Searching...' : 'Search'}
                                    </button> */}
                                    {/* <button type="submit" className="form-control form-control-btn">Search</button> */}
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


                {/* Report Table */}
                {!loading && !error && (
                     <PaginatedDataTable
                    columns={columns}
                    rows={filteredData}
                    paginationTotalRows={100}
                    rowsPerPage={perPage}
                    currentPage={currentPage}
                    totalPage={totalPages}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    onPageChange={handlePageChange}
                />
                )}

            </div>
        </>
    );
}

export default BirthdayAnniversaryRem;