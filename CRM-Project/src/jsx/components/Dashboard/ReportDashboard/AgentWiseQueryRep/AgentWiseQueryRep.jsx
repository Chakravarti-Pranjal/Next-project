import React, { useState, useEffect } from 'react';
// import "./AgentWiseQueryRep.css";
import { axiosOther } from "../../../../../http/axios_base_url";
import PaginatedDataTable from '../ReportTable/PaginatedDataTable';
import Skeleton from '../../../../layouts/Skeleton';

function AgentWiseQueryRep() {

    const columns = [
        {
            wrap: true,
            name: "S.No",
            selector: (row, index) => index,
            cell: (row, index) => (
                <span>{(currentPage - 1) * rowsPerPage + index + 1}</span>
            ),
            sortable: true,
            width: "6rem",
        },
        {
            wrap: true,
            name: "Agent Name",
            selector: row => row.ClientName,
            cell: row => <span>{row.ClientName}</span>,
            sortable: true,
            width: "12rem",
        },
        {
            wrap: true,
            name: "Department",
            selector: row => row.TotalQueries,
            cell: row => <span>{ }</span>,
            sortable: true,
            width: "8rem",
        },
        {
            wrap: true,
            name: "Queries",
            selector: row => row.TotalQueries,
            cell: row => <span>{row.TotalQueries}</span>,
            sortable: true,
            width: "8rem",
        },
        {
            wrap: true,
            name: "Confirmed",
            selector: row => row.Confirmed,
            cell: row => <span>{row.Confirmed}</span>,
            sortable: true,
            width: "8rem",
        },
        {
            wrap: true,
            name: "Quotation Generated",
            selector: row => row.Confirmed,
            cell: row => <span>{ }</span>,
            sortable: true,
            width: "8rem",
        },
        {
            wrap: true,
            name: "Reverted",
            selector: row => row.Reverted,
            cell: row => <span>{row.Reverted}</span>,
            sortable: true,
            width: "8rem",
        },
        {
            wrap: true,
            name: "Assigned",
            selector: row => row.Assigned,
            cell: row => <span>{row.Assigned || 0}</span>,
            sortable: true,
            width: "8rem",
        },
        {
            wrap: true,
            name: "Sent",
            selector: row => row.Sent,
            cell: row => <span>{row.Sent || 0}</span>,
            sortable: true,
            width: "8rem",
        },
        {
            wrap: true,
            name: "Follow Up",
            selector: row => row.FollowUp,
            cell: row => <span>{row.FollowUp}</span>,
            sortable: true,
            width: "8rem",
        },
        {
            wrap: true,
            name: "Lost",
            selector: row => row.Lost,
            cell: row => <span>{row.Lost}</span>,
            sortable: true,
            width: "8rem",
        },
        {
            wrap: true,
            name: "Sales",
            selector: row => row.Sales,
            cell: row => <span>{row.Sales}</span>,
            sortable: true,
            width: "8rem",
        },
        {
            wrap: true,
            name: "Margin",
            selector: row => row.Margin,
            cell: row => <span>{row.Margin}</span>,
            sortable: true,
            width: "8rem",
        },
        {
            wrap: true,
            name: "Total Pax",
            selector: row => row.TotalPax,
            cell: row => <span>{row.TotalPax}</span>,
            sortable: true,
            width: "8rem",
        },
        {
            wrap: true,
            name: "No(s) Nights",
            selector: row => row.TotalNights,
            cell: row => <span>{row.TotalNights}</span>,
            sortable: true,
            width: "8rem",
        }
    ];

    const [AgentTurn, setAgentTurn] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [agents, setAgents] = useState([]);
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({
        agent: "",
        year: "",
        month: "",
        startDate: "",
        endDate: "",
        search: "",
    });

    const getListDataToServer = async () => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axiosOther.post("agentWiseReport", {
                CompanyId: "",
                ClientName: filters.search || filters.agent || "",
                FromDate: filters.startDate || "",
                ToDate: filters.endDate || "",
                Year: filters.year || "",
                Month: filters.month || "",
                page: currentPage,
                perPage: rowsPerPage,
            });

            if (data?.DataList) {
                const processedData = data.DataList.map((item, index) => ({
                    ...item,
                    id: (currentPage - 1) * rowsPerPage + (index + 1),
                }));

                setAgentTurn(processedData);
                setOriginalData(processedData); // store unfiltered data
                // const agentsList = data?.DataList.map(item => item.ClientName);
                // setAgents([...new Set(agentsList)]);
                setTotalPages(data.TotalPages);
                setTotalRows(data.TotalRecord);
                setRowsPerPage(data.per_page || rowsPerPage);
            } else {
                setError("No data received from API");
                setAgentTurn([]);
            }
        } catch (error) {
            console.log("agentwise-error", error);
            setError("Failed to fetch data: " + error.message);
            setAgentTurn([]);
        } finally {
            setLoading(false);
        }
    };

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
        getListDataToServer(currentPage);
    }, [currentPage, rowsPerPage]);

    useEffect(() => {
            getAgentsList(1);
        }, []);

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

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleRowsPerPageChange = (newRowsPerPage) => {
        setRowsPerPage(newRowsPerPage);
        setCurrentPage(1);
    };

    return (
        <div className='agentwise-query-rep-main'>
            <h3>Agent Wise Query Report</h3>

            <div className="agentwise-query-rep-main-inputs">
                {/* <div className="agentwise-query-rep-main-inputs-search">
                    
                </div> */}
                <div className="agentwise-query-rep-main-inputs-paramtr">
                    <form onSubmit={handleFormSubmit} className="col-12">
                        <div className="agentwise-query-rep-main-inputs-paramtr-flex row mb-2">
                            <div className="agentwise-query-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                <input
                                    type="text"
                                    name='search'
                                    placeholder="Search by name..."
                                    value={filters.search}
                                    onChange={handleFilterChange}
                                    className="agentwise-query-rep-main-inputs-search-inp form-control form-control-sm"
                                />
                            </div>
                            <div className="agentwise-query-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                <select className="form-control form-control-sm" name="agent" value={filters.agent} onChange={handleFilterChange}>
                                    <option value="">All Agents</option>
                                    {agents.map((agent, index) => (
                                        <option key={index+1} value={agent?.CompanyName}>{agent?.CompanyName}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="agentwise-query-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                <select className="form-control form-control-sm" name="year" value={filters.year} onChange={handleFilterChange}>
                                    <option value="">Finance Year</option>
                                    <option value="22-23">22-23</option>
                                    <option value="23-24">23-24</option>
                                    <option value="24-25">24-25</option>
                                    <option value="25-26">25-26</option>
                                    <option value="26-27">26-27</option>
                                </select>
                            </div>

                            <div className="agentwise-query-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                <select className="form-control form-control-sm" name="month" value={filters.month} onChange={handleFilterChange}>
                                    <option value="">Select Month</option>
                                    <option value="01">January</option>
                                    <option value="02">February</option>
                                    <option value="03">March</option>
                                    <option value="04">April</option>
                                    <option value="05">May</option>
                                    <option value="06">June</option>
                                    <option value="07">July</option>
                                    <option value="08">August</option>
                                    <option value="09">September</option>
                                    <option value="10">October</option>
                                    <option value="11">November</option>
                                    <option value="12">December</option>
                                </select>
                            </div>

                            <div className="agentwise-query-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                <input type="date" className="form-control form-control-sm" name="startDate" value={filters.startDate} onChange={handleFilterChange} />
                            </div>

                            <div className="agentwise-query-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                <input type="date" className="form-control form-control-sm" name="endDate" value={filters.endDate} onChange={handleFilterChange} />
                            </div>

                            <div className="agentwise-query-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                {/* <button type="submit" className="form-control form-control-btn">Search</button> */}
                                 <button type="submit" className="btn btn-primary btn-custom-size flex-shrink-0 flex-grow-0"> <i className='fa-brands fa-searchengin me-2'></i> Search</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {loading && <Skeleton />}
            {error && <div className="error">{error}</div>}

            <PaginatedDataTable
                columns={columns}
                rows={AgentTurn}
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

export default AgentWiseQueryRep;
