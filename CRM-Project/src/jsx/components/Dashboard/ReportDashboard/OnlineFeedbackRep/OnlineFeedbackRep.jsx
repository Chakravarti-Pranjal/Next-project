import React, { useEffect, useState } from 'react'
// import "./OnlineFeedbackRep.css"
import ReportTable from '../ReportTable/ReportTable';
import { axiosOther } from '../../../../../http/axios_base_url';
import PaginatedDataTable from '../ReportTable/PaginatedDataTable';


function OnlineFeedbackRep() {
    // Table Columns
    const columns = [
        {
            wrap: true,
            name: "Tour Id",
            selector: (row, index) => index,
            cell: (row, index) => (
                <span>{(currentPage - 1) * rowsPerPage + index + 1}</span>
            ),
            sortable: true,
            width: "6rem",
        },
        {
            wrap: true,
            name: "Tour Date",
            selector: row => row.TravelDate,
            cell: row => <span>{row.TravelDate}</span>,
            sortable: true,
            width: "7rem",
        },
        {
            wrap: true,
            name: "Agent Name",
            selector: row => row.FullName,
            cell: row => <span>{row.FullName}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Overall Rating",
            selector: row => row.OVERALLRATINg,
            cell: row => <span>{row.OVERALLRATINg || " "}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Operation Person",
            selector: row => row.OperationPerson,
            cell: row => <span>{row.OperationPerson}</span>,
            sortable: true,
            width: "10rem",
        },
        {
            wrap: true,
            name: "Sales Person",
            selector: row => row.SALESpERSON,
            cell: row => <span>{row.SALESpERSON}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Feedback Date",
            selector: row => row.FEEDBACKdATE,
            cell: row => <span>{row.FEEDBACKdATE}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "View Feedback",
            selector: row => row.VIEWfEEDBACK,
            cell: row => <span>{row.VIEWfEEDBACK}</span>,
            sortable: true
        }
    ];

    const [search, setSearch] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [totalPage, setTotalPage] = useState()
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        fromDate: "",
        toDate: "",
    });

    const getListDataToServer = async () => {
        try {
            setLoading(true);
            const { data } = await axiosOther.post("feedbackReport", {
                FromDate: filters.fromDate || "",
                ToDate: filters.toDate || "",
                page: currentPage,
                per_page: rowsPerPage
            })
            setTotalPage(data.TotalPages || 10);
            setRowsPerPage(data.PerPage);
            if (data?.Status === 1) {
                setLoading(false);
                setFilteredData(data?.DataList)
                const agentsList = data?.DataList.map(item => item.AgentName);
                setAgents([...new Set(agentsList)]);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    useEffect(() => {
        getListDataToServer(currentPage)
    }, [rowsPerPage, currentPage]);

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        getListDataToServer(1);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Pagination handlers
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleRowsPerPageChange = (newRowsPerPage) => {
        setRowsPerPage(newRowsPerPage);
        setCurrentPage(1);
    };

    const displayedRows = filteredData.filter(row =>
        Object.values(row).some(val =>
            String(val).toLowerCase().includes(search.toLowerCase())
        )
    );

    return (
        <>
            <div className='online-feedback-report-mobile-main'>
                <h3 >Online Feedback Report</h3>

                {/* Search Input */}
                <div className="online-feedback-report-mobile-main-inputs">
                    {/* <div className="online-feedback-report-mobile-main-inputs-search">
                    </div> */}
                    <div className="online-feedback-report-mobile-main-inputs-paramtr">
                        <form action="" className="col-12">
                            <div className="online-feedback-report-mobile-main-inputs-paramtr-flex row mb-3">


                                <div className="online-feedback-report-mobile-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    <input type="text" placeholder="Search by name..." value={search} onChange={handleSearch} className="form-control form-control-sm" />
                                </div>

                                {/* <!-- Start Date --> */}
                                <div className="online-feedback-report-mobile-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    {/* <label for="start-date" className="form-label">Start</label> */}
                                    <input type="date" className="form-control form-control-sm" name="start" id="start-date" />
                                </div>

                                {/* <!-- End Date --> */}
                                <div className="online-feedback-report-mobile-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    {/* <label for="end-date" className="form-label">End</label> */}
                                    <input type="date" className="form-control form-control-sm" name="end" id="end-date" />
                                </div>



                                {/* <!-- Submit Button --> */}
                                <div className="online-feedback-report-mobile-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                     <button type="submit" className="btn btn-primary btn-custom-size flex-shrink-0 flex-grow-0"> <i className='fa-brands fa-searchengin me-2'></i> Search</button>
                                </div>
                            </div>
                        </form>
                    </div >
                </div >

                {loading ? <div>Loading...</div> :
                    <PaginatedDataTable
                        columns={columns}
                        rows={displayedRows}
                        paginationTotalRows={100}
                        rowsPerPage={rowsPerPage}
                        currentPage={currentPage}
                        totalPage={totalPage}
                        onRowsPerPageChange={handleRowsPerPageChange}
                        onPageChange={handlePageChange}
                    />
                }

            </div >
        </>
    )
}
export default OnlineFeedbackRep