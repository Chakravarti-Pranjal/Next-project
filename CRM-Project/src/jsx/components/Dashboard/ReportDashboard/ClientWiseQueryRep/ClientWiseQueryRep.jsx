import React, { useEffect, useState } from 'react';
// import "./ClientWiseQueryRep.css";
import ReportTable from '../ReportTable/ReportTable';
import { axiosOther } from "../../../../../http/axios_base_url";

function ClientWiseQueryRep() {
    const [search, setSearch] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [clientData, setClientData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalRecords: 0,
        perPage: 100
    });

    const columns = [
        {
            wrap: true,
            name: "S.No",
            selector: row => row.id,
            cell: row => <span>{row.id}</span>,
            sortable: true,
            width: "6rem",
        },
        {
            wrap: true,
            name: "Client Name",
            selector: row => row.ClientName,
            cell: row => <span>{row.ClientName || "N/A"}</span>,
            sortable: true,
            width: "8rem",
        },
        {
            wrap: true,
            name: "Queries",
            selector: row => row.TotalQueries,
            cell: row => <span>{row.TotalQueries || 0}</span>,
            sortable: true,
            width: "9rem",
        },
        {
            wrap: true,
            name: "Confirmed",
            selector: row => row.Confirmed,
            cell: row => <span>{row.Confirmed || 0}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Reverted",
            selector: row => row.Reverted,
            cell: row => <span>{row.Reverted || 0}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Assigned",
            selector: row => row.Assigned,
            cell: row => <span>{row.Assigned || 0}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Sent",
            selector: row => row.Sent,
            cell: row => <span>{row.Sent || 0}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Follow Up",
            selector: row => row.FollupUp,
            cell: row => <span>{row.FollowUp || 0}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Lost",
            selector: row => row.Lost,
            cell: row => <span>{row.Lost || 0}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Sales",
            selector: row => row.Sales,
            cell: row => <span>{row.Sales || 0}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Margin",
            selector: row => row.Margin,
            cell: row => <span>{row.Margin || 0}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Total Pax",
            selector: row => row.TotalPax,
            cell: row => <span>{row.TotalPax || 0}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "No(s) Nights",
            selector: row => row.NoofNights,
            cell: row => <span>{row.NoofNights || 0}</span>,
            sortable: true
        },
    ];


    const getClientWiseReportData = async (page = 1) => {
        try {
            setLoading(true);
            setError(null);

            const { data } = await axiosOther.post("clientwiseReport", {
                CompanyId: "",
                ClientName: "",
                FromDate: "",
                ToDate: "",
                page: page,
                perPage: 117
            });

            if (data?.DataList) {
                const processedData = data.DataList.map((item, index) => ({
                    ...item,
                    id: ((page - 1) * 10) + index + 1,
                }));

                setClientData(processedData);
                setFilteredData(processedData);

                setPagination({
                    currentPage: data.CurrentPage || 1,
                    totalPages: data.TotalPages || 1,
                    totalRecords: data.TotalRecord || 0,
                    perPage: data.PerPage || 10
                });
            } else {
                setError("No data received from API");
                setClientData([]);
                setFilteredData([]);
            }
        } catch (error) {
            console.error("client-wise-report-error", error);
            setError("Failed to fetch data: " + error.message);
            setClientData([]);
            setFilteredData([]);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getClientWiseReportData();
    }, []);

    const handleFormSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);

        const filters = {
            client: formData.get('client'),
            startDate: formData.get('start'),
            endDate: formData.get('end'),
            searchTerm: search.trim().toLowerCase()
        };

        const filteredRows = clientData.filter(row => {
            const clientMatch = filters.client ? row.ClientName === filters.client : true;
            const searchMatch = filters.searchTerm
                ? row.ClientName?.toLowerCase().includes(filters.searchTerm) ||
                row.TotalQueries?.toString().toLowerCase().includes(filters.searchTerm) ||
                row.TotalPax?.toString().toLowerCase().includes(filters.searchTerm) ||
                row.Confirmed?.toString().toLowerCase().includes(filters.searchTerm) ||
                row.Sales?.toString().toLowerCase().includes(filters.searchTerm) ||
                row.Margin?.toString().toLowerCase().includes(filters.searchTerm)
                : true;

            return clientMatch && searchMatch;
        });

        setFilteredData(filteredRows);
    };

    const handlePageChange = (page) => {
        getClientWiseReportData(page);
    };

    return (
        <div className='client-wise-query-rep-main'>
            <h3>Client Wise Query Report</h3>

            {loading && <div className="loading-message">Loading...</div>}
            {error && <div className="error-message">{error}</div>}

            <div className="client-wise-query-rep-main-inputs">
                {/* <div className="client-wise-query-rep-main-inputs-search"> */}

                {/* </div> */}
                <div className="client-wise-query-rep-main-inputs-paramtr">
                    <form onSubmit={handleFormSubmit} className="col-12">
                        <div className="client-wise-query-rep-main-inputs-paramtr-flex row mb-3">
                            <div className="client-wise-query-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                <input
                                    type="text"
                                    placeholder="Search by client name..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="form-control form-control-sm"
                                />
                            </div>
                            <div className="client-wise-query-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                <select className="form-control form-control-sm" name="client">
                                    <option value="">All Clients</option>
                                    <option value="Imtiyaj">Imtiyaj</option>
                                    <option value="Dinesh Khari">Dinesh Khari</option>
                                    <option value="Mrs Saddam Hussain">Mrs Saddam Hussain</option>
                                    <option value="Shukla Bhai">Shukla Bhai</option>
                                    <option value="Nishank Sukla">Nishank Sukla</option>
                                </select>
                            </div>

                            <div className="client-wise-query-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                <input type="date" className="form-control form-control-sm" name="start" />
                            </div>

                            <div className="client-wise-query-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                <input type="date" className="form-control form-control-sm" name="end" />
                            </div>

                            <div className="client-wise-query-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
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
                <ReportTable
                    rows={filteredData.length > 0 ? filteredData : []}
                    columns={columns}
                />
            )}
            {/* 
            {!loading && !error && pagination.totalPages > 1 && (
                <div className="pagination-controls">
                    <span className="pagination-info">
                        Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                </div>
            )} */}
        </div>
    );
}

export default ClientWiseQueryRep;


