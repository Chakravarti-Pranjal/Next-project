import React, { useContext, useEffect, useState } from "react";
// import "./InvoiceTurnOverReport.css";
import PaginatedDataTable from "../ReportTable/PaginatedDataTable";
import Skeleton from "../../../../layouts/Skeleton";
import Select from "react-select";
import { axiosOther } from "../../../../../http/axios_base_url";
import { ThemeContext } from "../../../../../context/ThemeContext";
import { format } from "date-fns";

const InvoiceTurnOverReport = () => {
    const [search, setSearch] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [allTableData, setAllTableData] = useState([]); // full table data
    const [agentList, setAgentList] = useState([]);
    const [currencyList, setCurrencyList] = useState([]);
    const [departmentList, setDepartmentList] = useState([]);
    const [isomasterlist, setIsomasterlist] = useState([]);
    const [countryList, setCountryList] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalPage, setTotalPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [selectedDateType, setSelectedDateType] = useState("ArrivalDate"); // Add this state
    const { background } = useContext(ThemeContext);


    const [filters, setFilters] = useState({
        fromDate: "",
        toDate: "",
        invoiveDate: "",
        agent: "",
        currency: "",
        paxType: "",
        iso: "",
        department: "",
        country: "",
        dateType: "ArrivalDate", // Add this to filters
    });
    const handleDateFormatChange = (date) => {
        let formattedDate;
        if (date) {
            formattedDate = format(date, "dd-MM-yyyy");
            console.log(formattedDate);
        }
        return formattedDate;
    };

    console.log(departmentList, "departmentList");

    const columns = [
        {
            wrap: true,
            name: "S.No",
            selector: (row, index) => index,
            cell: (row, index) => (
                <span>{(currentPage - 1) * rowsPerPage + index + 1}</span>
            ),
            sortable: false,
            width: "50px",
        },
        {
            wrap: true,
            name: "Tour Code",
            selector: row => row.TourCode,
            cell: row => <span>{row.TourCode}</span>,
            sortable: true,
            width: "100px",
        },
        {
            wrap: true,
            name: "Client",
            selector: row => row.Client,
            cell: row => <span>{row.Client}</span>,
            sortable: true,
            width: "100px",
        },
        {
            wrap: true,
            name: "Pax",
            selector: row => row.PaxTypeName,
            cell: row => <span>{row.PaxTypeName}</span>,
            sortable: true,
            width: "80px",
        },
        {
            wrap: true,
            name: "P. Inv. Date",
            selector: row => row.InoviceDate,
            cell: row => <span>{row.InoviceDate}</span>,
            sortable: true,
            width: "120px",
        },
        {
            wrap: true,
            name: "Arr. Date",
            selector: row => row.ArrivalDate,
            cell: row => <span>{row.ArrivalDate}</span>,
            sortable: true,
            width: "100px",
        },
        {
            wrap: true,
            name: "Dep. Date",
            selector: row => row.DepartureDate,
            cell: row => <span>{row.DepartureDate}</span>,
            sortable: true,
            width: "100px",
        },
        {
            wrap: true,
            name: "Agent",
            selector: row => row.AgentName,
            cell: row => <span>{row.AgentName}</span>,
            sortable: true,
            width: "100px",
        },
        {
            wrap: true,
            name: "Country",
            selector: row => row?.Country,
            cell: row => <span>{row?.Country}</span>,
            sortable: true,
            width: "100px",
        },
        {
            wrap: true,
            name: "Inv. No",
            selector: row => row.InoviceNo,
            cell: row => <span>{row.InoviceNo}</span>,
            sortable: true,
            width: "100px",
        },
        {
            wrap: true,
            name: "P. Inv. No",
            selector: row => row.PInoviceNo,
            cell: row => <span>{row.PInoviceNo}</span>,
            sortable: true,
            width: "100px",
        },
        {
            wrap: true,
            name: "Operator",
            selector: row => row.Operator,
            cell: row => <span>{row.Operator}</span>,
            sortable: true,
            width: "100px",
        },
        {
            wrap: true,
            name: "ROE",
            selector: row => row.ROE,
            cell: row => <span>{row.ROE}</span>,
            sortable: true,
            width: "80px",
        },
        {
            wrap: true,
            name: "Currency",
            selector: row => row.Currency,
            cell: row => <span>{row.Currency}</span>,
            sortable: true,
            width: "100px",
        },
        {
            wrap: true,
            name: "Currency Amount",
            selector: row => row.Amount,
            cell: row => <span>{row.Amount}</span>,
            sortable: true,
            width: "100px",
        },
        {
            wrap: true,
            name: "INR Amount",
            selector: row => row.INRAmount,
            cell: row => <span>{row.INRAmount}</span>,
            sortable: true,
            width: "120px",
        },
        {
            wrap: true,
            name: "Status",
            selector: row => row.Status,
            cell: row => (
                <span className={row.Status === "Cancelled" ? "badge-danger light badge" : "badge-success light badge"}>
                    {row.Status || "Active"}
                </span>
            ),
            sortable: true,
        },
    ];

    const getDataToServer = async () => {
        try {
            const countryData = await axiosOther.post("countrylist", {
                Search: "",
                Status: 1,
            });
            setCountryList(countryData.data.DataList);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getDataToServer();
    }, []);

    const getListDataToServer = async () => {
        try {
            setLoading(true);
            const { data } = await axiosOther.post("invoiceturnoverreport", {
                Search: search,
                FromDate: filters.fromDate || "",
                ToDate: filters.toDate || "",
                InvoiveDate: filters.invoiveDate || "",
                Agent: filters.agent || "",
                Currency: filters.currency || "",
                PaxType: filters.paxType || "",
                ISO: filters.iso || "",
                DepartmentId: filters.department || "",
                Country: filters.country || "",
                DateType: filters.dateType || "ArrivalDate", // Add this to API call
                page: currentPage,
                per_page: rowsPerPage,
            });

            setTotalPage(data?.total || "");
            setRowsPerPage(data?.per_page || rowsPerPage);

            if (data?.status == true) {
                setLoading(false);
                setFilteredData(data?.data || []);


                const fullDataRes = await axiosOther.post("invoiceturnoverreport", {
                    Search: "",
                    FromDate: "",
                    ToDate: "",
                    InvoiveDate: "",
                    Agent: "",
                    Currency: "",
                    PaxType: "",
                    ISO: "",
                    DepartmentId: "",
                    Country: "",
                    DateType: "",
                    page: "",
                    per_page: "",
                });

                if (fullDataRes?.data?.status === true) {
                    setAllTableData(fullDataRes?.data?.data || []);
                }


            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };

    const fetchList = async () => {
        try {
            const { data } = await axiosOther.post("agentlist", {
                id: "",
                page: "",
                perPage: "",
            });
            console.log(data?.DataList, 'data?.DataList');
            setAgentList(data?.DataList);
        } catch (error) {
            console.log("agent-error", error);
        }
        try {
            const { data } = await axiosOther.post("currencymasterlist");
            setCurrencyList(data?.DataList || []);
        } catch (err) {
            console.log(err);
        }
        try {
            const { data } = await axiosOther.post("departmentlist");
            setDepartmentList(data?.DataList || []);
        } catch (err) {
            console.log(err);
        }
        try {
            const { data } = await axiosOther.post("isomasterlist", {
                Search: "",
                Status: 1,
            });
            setIsomasterlist(data?.DataList || []);
        } catch (err) {
            console.error("Error fetching ISO master list:", err);
        }
    }

    useEffect(() => {
        fetchList();
    }, []);

    useEffect(() => {
        getListDataToServer();
    }, [rowsPerPage, currentPage]); // Add dateType to dependencies

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        getListDataToServer();
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    // Add this handler for radio button change
    const handleDateTypeChange = (e) => {
        const dateType = e.target.value;
        setSelectedDateType(dateType);
        setFilters(prev => ({
            ...prev,
            dateType: dateType,
            // Reset date fields when switching between date types
            ...(dateType === "ArrivalDate" ? { invoiveDate: "" } : { fromDate: "", toDate: "" })
        }));
        // setCurrentPage(1);
        // getListDataToServer();
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleRowsPerPageChange = (newRowsPerPage) => {
        setRowsPerPage(newRowsPerPage);
        setCurrentPage(1);
    };

    // Demo JSON data
    const displayedRows = [
        {
            "id": 3,
            "QueryId": "GEC5RVN4",
            "PInoviceNo": "INV/25-26/000003",
            "InoviceNo": "INV/25-26/000003",
            "InoviceDate": "25-06-2025",
            "TourCode": "456",
            "Pax": null,
            "Client": null,
            "ArrivalDate": "25-06-2025",
            "DepartureDate": null,
            "Operator": "",
            "Currency": "INR",
            "ROE": null,
            "Amount": 0,
            "INRAmount": 0,
            "Status": "",
            "InvoiceType": null,
            "FinalPayment": null,
            "PaxTypeName": null,
            "AgentName": "Test Agent",
            "Country": "India"
        },
        // ... rest of your demo data
    ];

    return (
        <div className="invoiceTurnover-main">
            <h3>Invoice Turnover Report</h3>

            <div className="invoiceTurnOver-main-inputs row mb-2">
                <div className="invoiceTurnOver-main-inputs-paramtr col-12">
                    <form onSubmit={handleFormSubmit} className="">
                        <div className="invoiceTurnOver-main-inputs-paramtr-flex row align-items-end">
                            <div className="invoiceTurnOver-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                <input
                                    type="text"
                                    placeholder="Search by Tour/Inv. No."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="form-control form-control-sm"
                                />
                            </div>
                            <div className="invoiceTurnOver-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                <Select
                                    name="agent"
                                    value={
                                        agentList
                                            .map((agent) => ({ value: agent?.id, label: agent?.CompanyName }))
                                            .find((a) => a.value === filters.agent) || null
                                    }
                                    placeholder="Select Agent"
                                    onChange={(selectedOption) =>
                                        handleFilterChange({
                                            target: {
                                                name: "agent",
                                                value: selectedOption ? selectedOption.value : "",
                                            },
                                        })
                                    }
                                    options={agentList.map((agent) => ({
                                        value: agent?.id,
                                        label: agent?.CompanyName,
                                    }))}
                                    isSearchable
                                    isClearable
                                    styles={customStyles}
                                    className="customSelectLightTheame"
                                    classNamePrefix="custom"
                                />
                            </div>
                            <div className="invoiceTurnOver-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                <select
                                    className="form-control form-control-sm"
                                    name="currency"
                                    value={filters.currency}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Select Currency</option>
                                    {currencyList.length > 0 ? (
                                        currencyList.map((currency) => (
                                            <option key={currency.id} value={currency.CurrencyName}>
                                                {currency.CurrencyName}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="">Loading...</option>
                                    )}
                                </select>
                            </div>
                            <div className="invoiceTurnOver-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                <select
                                    className="form-control form-control-sm"
                                    name="paxType"
                                    value={filters.paxType}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Select Pax Type</option>
                                    <option value="FIT">FIT</option>
                                    <option value="GIT">GIT</option>
                                </select>
                            </div>
                            <div className="invoiceTurnOver-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                <select
                                    className="form-control form-control-sm"
                                    name="iso"
                                    value={filters.iso}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Select ISO</option>
                                    {isomasterlist?.length > 0 &&
                                        isomasterlist.map((value, index) => (
                                            <option value={value.id.toString()} key={index + 1}>
                                                {value.Name}
                                            </option>
                                        ))}
                                </select>
                            </div>
                            <div className="invoiceTurnOver-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                <select
                                    className="form-control form-control-sm"
                                    name="department"
                                    value={filters.department}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Select Department</option>
                                    {departmentList.length > 0 ? (
                                        departmentList.map((department) => (
                                            <option key={department?.id} value={department?.id}>
                                                {department?.Name}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="">Loading...</option>
                                    )}
                                </select>
                            </div>
                            <div className="invoiceTurnOver-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                <select
                                    name="country"
                                    id=""
                                    className="form-control form-control-sm"
                                    value={filters.country} // Fixed: was filters.Country
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Select Country</option>
                                    {countryList?.map((value, index) => (
                                        <option value={value.id} key={index + 1}>
                                            {value.Name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Date Selection Radio Buttons */}
                            <div className="position-relative col-md-12 col-lg-3 mt-3">
                                <span
                                    className="position-absolute px-2 dateCardFeildSet"
                                    style={{
                                        top: '-0.7rem',
                                        left: '1rem',
                                        fontSize: '0.5rem',
                                        zIndex: 1,
                                        background: background?.value === "dark" ? "#171717" : "#f8f8f8"
                                    }}
                                >
                                    Select Date
                                </span>
                                <div className="row border rounded px-2 py-2 pe-3 me-2">
                                    <div className="col-6">
                                        <div className="form-check check-sm d-flex align-items-center">
                                            <input
                                                type="radio"
                                                className="form-check-input height-em-1 width-em-1"
                                                id="ArrivalDate"
                                                value="ArrivalDate"
                                                name="selectdate"
                                                checked={selectedDateType === "ArrivalDate"}
                                                onChange={handleDateTypeChange}
                                            />
                                            <label className="fontSize11px m-0 ms-1 mt-1" htmlFor="ArrivalDate">
                                                Arrival Date
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="form-check check-sm d-flex align-items-center">
                                            <input
                                                type="radio"
                                                className="form-check-input height-em-1 width-em-1"
                                                id="InvoiceDate"
                                                value="InvoiceDate"
                                                name="selectdate"
                                                checked={selectedDateType === "InvoiceDate"}
                                                onChange={handleDateTypeChange}
                                            />
                                            <label className="fontSize11px m-0 ms-1 mt-1" htmlFor="InvoiceDate">
                                                Invoice Date
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Conditional Date Inputs */}
                            {selectedDateType === "ArrivalDate" ? (
                                <>
                                    <div className="invoiceTurnOver-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                        <input
                                            type="date"
                                            className="form-control form-control-sm"
                                            name="fromDate"
                                            value={filters.fromDate}
                                            onChange={handleFilterChange}
                                            placeholder="From Date"
                                        />
                                    </div>
                                    <div className="invoiceTurnOver-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                        <input
                                            type="date"
                                            className="form-control form-control-sm"
                                            name="toDate"
                                            value={filters.toDate}
                                            onChange={handleFilterChange}
                                            placeholder="To Date"
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="invoiceTurnOver-main-inputs-paramtr-flex-slct col-12 col-lg-2 mt-2">
                                    <input
                                        type="date"
                                        className="form-control form-control-sm"
                                        name="invoiveDate"
                                        value={filters.invoiveDate}
                                        onChange={handleFilterChange}
                                        placeholder="Invoice Date"
                                    />
                                </div>
                            )}

                            <div className="invoiceTurnOver-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-custom-size flex-shrink-0 flex-grow-0"
                                >
                                    <i className="fa-brands fa-searchengin me-2"></i> Search
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {loading ? (
                <Skeleton />
            ) : (
                <PaginatedDataTable
                    columns={columns}
                    rows={filteredData.length > 0 ? filteredData : displayedRows} // Use real data if available, else demo data
                    allRows={allTableData.length > 0 ? allTableData : displayedRows}
                    reportName="Invoice_Turnover_Report.csv"
                    paginationTotalRows={totalPage * rowsPerPage}
                    rowsPerPage={rowsPerPage}
                    currentPage={currentPage}
                    totalPage={totalPage}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
};

export default InvoiceTurnOverReport;

export const customStyles = {
    control: (base, state) => ({
        ...base,
        backgroundColor: "#2e2e40",
        color: "white",
        border: "1px solid #2e2e40", // light gray border
        boxShadow: "none",
        borderRadius: "0.5rem",
        width: "100%",
        height: "26px",
        minHeight: "26px",
        fontSize: "0.8rem",
        padding: "0 4px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        cursor: "pointer",
        "&:hover": {
            borderColor: "#2e2e40",
        },
    }),

    singleValue: (base) => ({
        ...base,
        color: "white",
        fontSize: "0.8rem",
    }),

    input: (base) => ({
        ...base,
        color: "white",
        fontSize: "0.8rem",
        margin: 0,
        padding: 0,
    }),

    placeholder: (base) => ({
        ...base,
        color: "#aaa",
        fontSize: "0.8rem",
    }),

    dropdownIndicator: (base) => ({
        ...base,
        color: "#ccc",
        padding: "0 4px",
    }),

    clearIndicator: (base) => ({
        ...base,
        color: "#ccc",
        padding: "0 4px",
    }),

    indicatorSeparator: () => ({
        display: "none",
    }),

    menu: (base) => ({
        ...base,
        backgroundColor: "#2e2e40",
        zIndex: 9999,
        borderRadius: "0.5rem",
        overflow: "hidden",
    }),

    option: (base, state) => ({
        ...base,
        backgroundColor: state.isFocused ? "#444" : "#2e2e40",
        color: "white",
        fontSize: "0.8rem",
        padding: "6px 10px",
        cursor: "pointer",
    }),

    indicatorsContainer: (base) => ({
        ...base,
        height: "26px",
    }),
};