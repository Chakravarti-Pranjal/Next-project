import React, { useEffect, useState } from 'react';
// import "./AgentTurnOverRep.css";
import ReportTable from '../ReportTable/ReportTable';
import { axiosOther } from '../../../../../http/axios_base_url';
import PaginatedDataTable from '../ReportTable/PaginatedDataTable';
import Skeleton from '../../../../layouts/Skeleton';

function AgentTurnOverRep() {

    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [totalPage, setTotalPage] = useState()
    const [hasMore, setHasMore] = useState(true);
    const [agents, setAgents] = useState([]);
    const [page, setPage] = useState(1);

    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        search: "",
        agent: "",
        b2c: "",
        year: "",
        month: "",
        startDate: "",
        endDate: "",
    });

    const columns = [
        {
            wrap: true,
            name: "S.No",
            selector: (row, index) => index,
            cell: (row, index) => (
                <span>{(currentPage - 1) * rowsPerPage + index + 1}</span>
            ),
            sortable: false
        },
        {
            wrap: true,
            name: "Agent Name",
            selector: row => row.AgentName,
            sortable: true,
            cell: row => <span>{row.AgentName}</span>,
        },
        {
            wrap: true,
            name: "Country",
            selector: row => row.Country,
            sortable: true,
            cell: row => <span>{row.Country}</span>,
        },
        {
            wrap: true,
            name: "Currency",
            selector: row => row.Country,
            sortable: true,
            cell: row => <span>INR</span>,
        },
        {
            wrap: true,
            name: "Pax",
            selector: row => row.Pax,
            sortable: true,
            cell: row => <span>{row.Pax}</span>,
        },
        {
            wrap: true,
            name: "Tax",
            selector: row => row.Tax,
            sortable: true,
            cell: row => <span>{row.Tax}</span>,
        },
        {
            wrap: true,
            name: "Amount(Incl. Tax)",
            selector: row => row.TotalAmount_Inclusive,
            sortable: true,
            cell: row => <span>₹{row.TotalAmount_Inclusive}</span>,
        },
        {
            wrap: true,
            name: "Amount(Excl. St)",
            selector: row => row.PaymentValue_Exclusive,
            sortable: true,
            cell: row => <span>₹{row.PaymentValue_Exclusive}</span>
        },
    ];

    const getListDataToServer = async () => {
        try {
            setLoading(true);
            const { data } = await axiosOther.post("turnoverReport", {
                AgentName: filters.agent || filters.search || "",
                B2C: filters.b2c || "",
                Year: filters.year || "",
                Month: filters.month || "",
                StartDate: filters.startDate || "",
                EndDate: filters.endDate || "",
                page: currentPage,
                per_page: rowsPerPage
            })
            setTotalPage(data.TotalPages || 10);
            setRowsPerPage(data.PerPage);
            if (data?.Status === 1) {
                setLoading(false);
                setFilteredData(data?.DataList)
                // const agentsList = data?.DataList.map(item => item.AgentName);
                // setAgents([...new Set(agentsList)]);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    const getAgentsList = async (page = 1) => {
        try {
            setLoading(true);
              const { data } = await axiosOther.post("agentlist",{
                        page: page,
                        per_page: 10
                    });
        
                    const newAgents = data?.DataList || [];
                    setAgents((prev) =>
                        page === 1 ? newAgents : [...prev, ...newAgents]
                    );
                } catch (error) {
                    console.log("agent-error",error);
                } finally {
                    setLoading(false);
                }
    }

    useEffect(() => {
        getListDataToServer(currentPage)
    }, [rowsPerPage, currentPage]);

        useEffect(() => {
        getAgentsList(1);
    }, []);

    const handleScroll = (e) => {
        const target = e.target;
        if (
        target.scrollTop + target.offsetHeight >= target.scrollHeight - 10 &&
        !loading &&
        hasMore
        ) {
        const nextPage = page + 1;
        setPage(nextPage);
        getAgentsList(nextPage);
        }
    };

    const handleFormSubmit = (e) => {
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


    return (
        <div className='agentTurnover-main'>
            <h3>Agent Turnover Report</h3>

            <div className="agentTurnover-main-inputs row mb-2">
                {/* <div className="agentTurnover-main-inputs-search col-6 col-lg-2 mt-2">

                </div> */}

                <div className="agentTurnover-main-inputs-paramtr col-12">
                    <form onSubmit={handleFormSubmit} className="">
                        <div className="agentTurnover-main-inputs-paramtr-flex row">

                            <div className="agentTurnover-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                <input
                                    type="text"
                                    name="search"
                                    placeholder="Search by name..."
                                    value={filters.search}
                                    onChange={handleFilterChange}
                                    className="form-control form-control-sm"
                                />
                            </div>

                            <div className="agentTurnover-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                <select className="form-control form-control-sm " name="agent"
                                    value={filters.agent}
                                    onChange={handleFilterChange}
                                    onPopupScroll={handleScroll}
                                    notFoundContent={loading ? <div className="text-center p-2">
                                                                <div className="spinner-border spinner-border-sm"
                                                                     role="status"
                                                                >
                                                                    <span className="sr-only">Loading...</span>
                                                                </div>
                                                                </div> : null}
                                    >
                                    <option value="">Select Agent</option>
                                    {agents.map((agent, index) => (
                                        <option key={index+1} value={agent?.CompanyName}>{agent?.CompanyName}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="agentTurnover-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                <select className="form-control form-control-sm " name="b2c"
                                    value={filters.b2c}
                                    onChange={handleFilterChange}>
                                    <option value="">Select B2C</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>
                        {/*
                            <div className="agentTurnover-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                <select className="form-control form-control-sm " name="year"
                                    value={filters.year}
                                    onChange={handleFilterChange}>
                                    <option value="">Finance Year</option>
                                    <option value="2025">2025</option>
                                    <option value="2024">2024</option>
                                    <option value="2023">2023</option>
                                </select>
                            </div>

                            <div className="agentTurnover-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                <select className="form-control form-control-sm " name="month"
                                    value={filters.month}
                                    onChange={handleFilterChange}>
                                    <option value="">Select Month</option>
                                    <option value="01">January</option>
                                    <option value="02">February</option>
                                    <option value="03">March</option>
                                    <option value="04">April</option>
                                </select>
                            </div>
                        */}

                            <div className="agentTurnover-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                <input type="date" className="form-control form-control-sm " name="startDate"
                                    value={filters.startDate}
                                    onChange={handleFilterChange} />
                            </div>

                            <div className="agentTurnover-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                <input type="date" className="form-control form-control-sm " name="endDate"
                                    value={filters.endDate}
                                    onChange={handleFilterChange} />
                            </div>

                            <div className="agentTurnover-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                <button type="submit" className="btn btn-primary btn-custom-size flex-shrink-0 flex-grow-0"> <i className='fa-brands fa-searchengin me-2'></i> Search</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {loading ? <Skeleton /> :
                <PaginatedDataTable
                    columns={columns}
                    rows={filteredData}
                    paginationTotalRows={100}
                    rowsPerPage={rowsPerPage}
                    currentPage={currentPage}
                    totalPage={totalPage}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    onPageChange={handlePageChange}
                />
            }
        </div>
    );
}

export default AgentTurnOverRep;

