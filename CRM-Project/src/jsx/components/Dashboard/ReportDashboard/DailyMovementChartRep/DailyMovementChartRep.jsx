import React, { useEffect, useState } from 'react';
// import "./DailyMovementChartRep.css";
import ReportTable from '../ReportTable/ReportTable';
import { axiosOther } from "../../../../../http/axios_base_url";

function DailyMovementChartRep() {
    const [search, setSearch] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [movementData, setMovementData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalRecords: 0,
        perPage: 10
    });

    const [filters, setFilters] = useState({
        city: "",
        type: "",
    });

    const columns = [
        {
            wrap: true,
            name: "S.No",
            selector: (row, index) => index,
            cell: (row, index) => (
                <span>{index + 1}</span>
            ),
            sortable: true,
            width: "6rem",
        },
        {
            wrap: true,
            name: "Query ID",
            selector: row => row.BusinessTypeName,
            cell: row => <span>{row.BusinessTypeName || "N/A"}</span>,
            sortable: true,
            width: "8rem",
        },
        {
            wrap: true,
            name: "Tour ID",
            selector: row => row.Destination,
            cell: row => <span>{row.Destination || 0}</span>,
            sortable: true,
            width: "7rem",
        },
        {
            wrap: true,
            name: "From Date",
            selector: row => row.Confirmed,
            cell: row => <span>{row.Confirmed || 0}</span>,
            sortable: true,
            width: "8rem",
        },
        {
            wrap: true,
            name: "To Date",
            selector: row => row.Reverted,
            cell: row => <span>{row.Reverted || 0}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "City",
            selector: row => row.Assigned,
            cell: row => <span>{row.Assigned || 0}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Type",
            selector: row => row.FollowUp,
            cell: row => <span>{row.FollowUp || 0}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Agent Name",
            selector: row => row.Lost,
            cell: row => <span>{row.Lost || 0}</span>,
            sortable: true,
            width: "5rem",
        },
        {
            wrap: true,
            name: "Lead Pax Name",
            selector: row => row.Sales,
            cell: row => <span>{row.Sales || 0}</span>,
            sortable: true,
            width: "6rem",
        },
        {
            wrap: true,
            name: "Total Pax",
            selector: row => row.TotalPax,
            cell: row => (
                <span>{row.TotalPax}</span>
            ),
            sortable: true
        },
        {
            wrap: true,
            name: "Stay/Activity",
            selector: row => row.TotalNights,
            cell: row => <span>{row.TotalNights || 0}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Tour Manager/Escort",
            selector: row => row.TotalNights,
            cell: row => <span>{row.TotalNights || 0}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Status",
            selector: row => row.TotalNights,
            cell: row => <span>{row.TotalNights || 0}</span>,
            sortable: true
        },
    ];

    const getDailyMovementChartData = async (page = 1) => {
        try {
            setLoading(true);
            setError(null);

            const perPage = 10;
            const res = await axiosOther.post("dailyMovementChart", {
                ClientName: "",
                Destination: "",
                ServiceType: "",
                Year: "",
                per_page: perPage.toString(),
                page: page,
                Month: ""
            });

            console.log(res?.data, 'DAdkflksd4');

            if (res?.data && res?.status === 200) {
                const apiData = res?.data?.data || [];

                const processedData = apiData.map((item, index) => ({
                    ...item,
                    id: ((page - 1) * perPage) + index + 1,
                }));

                setMovementData(processedData);
                setFilteredData(processedData);

                setPagination({
                    currentPage: res.data.current_page || 1,
                    totalPages: res.data.TotalPages || 1,
                    totalRecords: res.data.TotalRecord || 0,
                    perPage: res.data.PerPage || perPage
                });
            } else {
                setError("No data received from API");
                setMovementData([]);
                setFilteredData([]);
            }
        } catch (error) {
            console.log("daily-movement-chart-error", error);
            setError("Failed to fetch data: " + error.message);
            setMovementData([]);
            setFilteredData([]);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        getDailyMovementChartData();
    }, []);

    const handleFormSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const filters = {
            city: formData.get('city'),
            type: formData.get('type'),
            agent: formData.get('agent'),
            financeYear: formData.get('year'),
            month: formData.get('month'),
            startDate: formData.get('start'),
            endDate: formData.get('end'),
            searchTerm: search.trim().toLowerCase()
        };

        const filteredRows = movementData.filter(row => {
            const clientMatch = filters.searchTerm
                ? row.ClientName?.toLowerCase().includes(filters.searchTerm)
                : true;

            const agentMatch = filters.agent
                ? row.Agent?.toLowerCase().includes(filters.agent.toLowerCase())
                : true;

            // You can add more filters for city/type/month/etc. if data has such fields

            return clientMatch && agentMatch;
        });

        setFilteredData(filteredRows);
    };

    const handlePageChange = (page) => {
        getDailyMovementChartData(page);
    };

    return (
        <div className='daily-movement-chart-rep-main'>
            <h3>Daily Movement Chart Report</h3>

            {loading && <div className="loading-message">Loading...</div>}
            {error && <div className="error-message">{error}</div>}

            <div className="daily-movement-chart-rep-main-inputs">
                {/* <div className="daily-movement-chart-rep-main-inputs-search">
                   
                </div> */}
                <div className="daily-movement-chart-rep-main-inputs-paramtr">
                    <form onSubmit={handleFormSubmit} className="col-12">
                        <div className="daily-movement-chart-rep-main-inputs-paramtr-flex row mb-3">
                            <div className="daily-movement-chart-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                <input
                                    type="text"
                                    placeholder="Search by client name..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="form-control form-control-sm"
                                />
                            </div>
                            <div className="daily-movement-chart-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                <select className="form-control form-control-sm" name="city">
                                    <option value="">City</option>
                                    <option value="delhi">Delhi</option>
                                    <option value="agra">Agra</option>
                                    <option value="mumbai">Mumbai</option>
                                    <option value="jaipur">Jaipur</option>
                                </select>
                            </div>
                            <div className="daily-movement-chart-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                <select className="form-control form-control-sm" name="type">
                                    <option value="">Type</option>
                                    <option value="stay">Stay</option>
                                    <option value="transfer">Transfer</option>
                                    <option value="flight">Flight</option>
                                    <option value="train">Train</option>
                                </select>
                            </div>
                            <div className="daily-movement-chart-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                <input type="text" className="form-control form-control-sm" name="agent" placeholder='Agent' />
                            </div>
                            <div className="daily-movement-chart-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                <select className="form-control form-control-sm" name="year">
                                    <option value="">Finance Year</option>
                                    <option value="2024-25">2024-25</option>
                                    <option value="2023-24">2023-24</option>
                                    <option value="2022-23">2022-23</option>
                                </select>
                            </div>
                            <div className="daily-movement-chart-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                <select className="form-control form-control-sm" name="month">
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
                            <div className="daily-movement-chart-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                <input type="date" className="form-control form-control-sm" name="start" />
                            </div>
                            <div className="daily-movement-chart-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                <input type="date" className="form-control form-control-sm" name="end" />
                            </div>
                            <div className="daily-movement-chart-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                <button type="submit" className="btn btn-primary btn-custom-size flex-shrink-0 flex-grow-0"> <i className='fa-brands fa-searchengin me-2'></i> Search</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* {!loading && !error && (
                <div className="pagination-info">
                    <p>Showing {filteredData.length} of {pagination.totalRecords} records
                        (Page {pagination.currentPage} of {pagination.totalPages})</p>
                </div>
            )} */}

            {!loading && !error && (
                <ReportTable rows={filteredData} columns={columns} />
            )}

            {/* {!loading && !error && pagination.totalPages > 1 && (
                <div className="pagination-controls">
                    <span className="pagination-info">
                        Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                </div>
            )} */}
        </div>
    );
}

export default DailyMovementChartRep;
