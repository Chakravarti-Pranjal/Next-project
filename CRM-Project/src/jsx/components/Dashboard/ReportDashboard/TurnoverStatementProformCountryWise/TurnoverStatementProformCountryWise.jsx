import React, { useEffect, useState } from 'react';
// import "./TurnoverStatementProformCountryWise.css";
import ReportTable from '../ReportTable/ReportTable';
import PaginatedDataTable from '../ReportTable/PaginatedDataTable';
import { axiosOther } from '../../../../../http/axios_base_url';

function TurnoverStatementProformCountryWise() {

    const [filters, setFilters] = useState({
        userName: "",
        fromDate: "",
        toDate: "",
        month: ""
    });
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState(""); // For debounce
    const [filteredData, setFilteredData] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [countries, setCountries] = useState([]);

    const uniqueMonths = [...new Set(filteredData.map(item => item.MonthYear))];

    const columns = [
        {
            name: "S.No",
            selector: (row, index) => index,
            cell: (row, index) => <span>{(currentPage - 1) * rowsPerPage + index + 1}</span>,
            wrap: true,
            sortable: true,
            width: "80px"
        },
        {
            name: "Country",
            selector: row => row.Country || "N/A",
            cell: row => <span>{row.Country || "N/A"}</span>,
            wrap: true,
            sortable: true,
        },
        {
            name: "Type",
            selector: row => row.TYPE || "N/A",
            cell: row => <span>{row.TYPE || "N/A"}</span>,
            wrap: true,
            sortable: true,
        },
        ...uniqueMonths.map(monthYear => ({
            name: monthYear, // e.g., "NOV 2024"
            selector: row => row[monthYear] || 0,
            cell: row => <span>{row[monthYear] || 0}</span>,
            wrap: true,
            sortable: true,
        })),
    ];

    const getListDataToServer = async (page = currentPage) => {
        try {
            setLoading(true);
            setError(null);

            const { data } = await axiosOther.post("countryWiseTurnOverReport", {
                UserName: filters.userName,
                FromDate: filters.fromDate,
                ToDate: filters.toDate,
                Month: filters.month,
                per_page: rowsPerPage,
                page,
                search: debouncedSearch // send debounced value
            });

            if (data?.data) {
                const processedData = data.data.map((item, index) => ({
                    ...item,
                    id: ((page - 1) * rowsPerPage) + index + 1,
                }));
                const uniqueCountries = [...new Set(processedData.map(item => item.Country).filter(Boolean))];
                setCountries(uniqueCountries);

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

    // Debounce search input (delay API call until user stops typing)
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500); // 500ms delay
        return () => clearTimeout(timer);
    }, [search]);

    // Fetch data when filters, pagination, or debounced search changes
    useEffect(() => {
        getListDataToServer(currentPage);
    }, [rowsPerPage, currentPage, filters, debouncedSearch]);

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

    // Client-side filtering after API response
    const displayedRows = filteredData.filter(row =>
        Object.values(row).some(val =>
            String(val).toLowerCase().includes(search.toLowerCase())
        )
    );

    return (
        <>
            <div className='turnover-statement-per-country-wise-main'>
                <h3>Turnover Statement - Proforma Invoice Country Wise</h3>

                {/* Search Input */}
                <div className="turnover-statement-per-country-wise-main-inputs">
                    {/* <div className="turnover-statement-per-country-wise-main-inputs-search">
                        
                    </div> */}
                    <div className="turnover-statement-per-country-wise-main-inputs-paramtr">
                        <form onSubmit={handleSearch} className="col-12">
                            <div className="turnover-statement-per-country-wise-main-inputs-paramtr-flex row mb-3">
                                {/* Select Country */}

                                <div className="turnover-statement-per-country-wise-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    <input
                                        type="text"
                                        placeholder="Agent/Client/B2B"
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        className="form-control form-control-sm"
                                    />
                                </div>
                                <div className="turnover-statement-per-country-wise-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    <select className="form-control form-control-sm" name="country" onChange={handleChange} value={filters.country}>
                                        <option value="">All Country</option>
                                        {countries.map(country => (
                                            <option key={country} value={country}>{country}</option>
                                        ))}
                                    </select>
                                </div>
                                {/* Start Date */}
                                <div className="turnover-statement-per-country-wise-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    <input type="date" className="form-control form-control-sm" name="start" id="start-date" />
                                </div>
                                {/* End Date */}
                                <div className="turnover-statement-per-country-wise-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    <input type="date" className="form-control form-control-sm" name="end" id="end-date" />
                                </div>
                                {/* Submit Button */}
                                <div className="turnover-statement-per-country-wise-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                     <button type="submit" className="btn btn-primary btn-custom-size flex-shrink-0 flex-grow-0"> <i className='fa-brands fa-searchengin me-2'></i> Search</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {loading ? (
                    <div>Loading...</div>
                ) : (
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
                )}
            </div>
        </>
    );
}

export default TurnoverStatementProformCountryWise;
