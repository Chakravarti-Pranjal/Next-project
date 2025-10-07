import React, { useEffect, useState } from 'react';
// import "./GuideAllocationRep.css";
import { axiosOther } from '../../../../../http/axios_base_url';
import PaginatedDataTable from '../ReportTable/PaginatedDataTable';

function GuideAllocationRep() {
    const columns = [
        {
            wrap: true,
            name: "SN",
            selector: (row, index) => index,
            cell: (row, index) => (
                <span>{(currentPage - 1) * rowsPerPage + index + 1}</span>
            ),
            sortable: true,
            width: "7rem",
        },
        {
            wrap: true,
            name: "Tour Id",
            selector: row => row.TourId,
            cell: row => <span>{row.TourId || "-"}</span>,
            sortable: true,
            width: "7rem",
        },
        {
            wrap: true,
            name: "Service Date",
            selector: row => row.GuideServiceDate,
            cell: row => <span>{row.GuideServiceDate}</span>,
            sortable: true,
            width: "10rem",
        },
        {
            wrap: true,
            name: "Tour Duration",
            selector: row => row.TourDateRange,
            cell: row => <span>{row.TourDateRange || "-"}</span>,
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
            name: "Agent/FTO Name",
            selector: row => row.AgentName,
            cell: row => {
                console.log("Agent/FTOName:", row.AgentName);
                return <span>{row.AgentName}</span>;
            },
            sortable: true,
            width: "10rem",
        },
        {
            wrap: true,
            name: "Lead Pax Name",
            selector: row => row.LeadPaxName,
            cell: row => <span>{row.LeadPaxName}</span>,
            sortable: true,
            width: "10rem",
        },
        {
            wrap: true,
            name: "Status",
            selector: row => row.STATUS,
            cell: row => <span>{row.STATUS}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Guide",
            selector: row => row.GuideService,
            cell: row => <span>{row.GuideService}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Agent Reference",
            selector: row => row.AGENtREFERENCE,
            cell: row => <span>{row.AGENtREFERENCE}</span>,
            sortable: true,
            width: "10rem",
        },
        {
            wrap: true,
            name: "Guide Service",
            selector: row => row.GuideServiceDate,
            cell: row => <span>{row.GuideServiceDate}</span>,
            sortable: true,
            width: "10rem",
        },
        {
            wrap: true,
            name: "Day Type",
            selector: row => row.DayType,
            cell: row => <span>{row.DayType}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Start Time",
            selector: row => row.StartTime,
            cell: row => <span>{row.StartTime}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "End Time",
            selector: row => row.EndTime,
            cell: row => <span>{row.EndTime}</span>,
            sortable: true
        },
    ];

    const [filters, setFilters] = useState({
        agentName: "",
        startDate: "",
        endDate: "",
        city: "",
        guide: "",
        status: ""
    });
    const [filteredData, setFilteredData] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getListDataToServer = async (page = 1) => {
        try {
            setLoading(true);
            setError(null);

            const { data } = await axiosOther.post("guideAllocationReport", {
                ClientName: filters.agentName,
                Destination: filters.city,
                Guide: filters.guide,
                FromDate: filters.startDate,
                ToDate: filters.endDate,
                Status: filters.status,
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSearchSubmit = (e) => {
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

    return (
        <div className='guide-allocation-rep-main'>
            <h3>Guide Allocation Report</h3>

            <div className="guide-allocation-rep-main-inputs">
                <form className="col-12" onSubmit={handleSearchSubmit}>
                    <div className="guide-allocation-rep-main-inputs-paramtr-flex row mb-3">
                        <div className='col-6 col-lg-2 mt-2'>
                            <input type="text" name="agentName" placeholder='Agent/FTO Name'
                                className="form-control form-control-sm"
                                value={filters.agentName} onChange={handleInputChange} />
                        </div>
                        <div className='col-6 col-lg-2 mt-2'>
                            <input type="date" name="startDate"
                                className="form-control form-control-sm"
                                value={filters.startDate} onChange={handleInputChange} />
                        </div>
                        <div className='col-6 col-lg-2 mt-2'>
                            <input type="date" name="endDate"
                                className="form-control form-control-sm"
                                value={filters.endDate} onChange={handleInputChange} />
                        </div>
                        <div className='col-6 col-lg-2 mt-2'>
                            <select name="city" className="form-control form-control-sm"
                                value={filters.city} onChange={handleInputChange}>
                                <option value="">Select City</option>
                                <option value="Delhi">Delhi</option>
                                <option value="Agra">Agra</option>
                                <option value="Mumbai">Mumbai</option>
                                <option value="Jaipur">Jaipur</option>
                            </select>
                        </div>
                        <div className='col-6 col-lg-2 mt-2'>
                            <select name="guide" className="form-control form-control-sm"
                                value={filters.guide} onChange={handleInputChange}>
                                <option value="">Select Guide</option>
                                <option value="Aamir">Aamir</option>
                                <option value="Aaftab">Aaftab</option>
                                <option value="Imtiaz">Imtiaz</option>
                                <option value="Shadab">Shadab</option>
                            </select>
                        </div>
                        <div className='col-6 col-lg-2 mt-2'>
                            <select name="status" className="form-control form-control-sm"
                                value={filters.status} onChange={handleInputChange}>
                                <option value="">Status</option>
                                <option value="Assigned">Assigned</option>
                                <option value="Rejected">Rejected</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                        <div className='col-6 col-lg-2 mt-2'>
                            <button type="submit" className="btn btn-primary btn-custom-size flex-shrink-0 flex-grow-0"> <i className='fa-brands fa-searchengin me-2'></i> Search</button>
                        </div>
                    </div>
                </form>
            </div>

            <PaginatedDataTable
                columns={columns}
                rows={filteredData}
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

export default GuideAllocationRep;
