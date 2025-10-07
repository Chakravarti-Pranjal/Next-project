import React, { useState } from 'react';
// import "./AuditLog.css";
import ReportTable from '../ReportTable/ReportTable';
import PaginatedDataTable from '../ReportTable/PaginatedDataTable';

function AuditLog() {
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
            name: "Module Name",
            selector: row => row.ModuleName,
            cell: row => <span>{row.ModuleName}</span>,
            sortable: true,
            width: "10rem",
        },
        {
            wrap: true,
            name: "Number",
            selector: row => row.Number,
            cell: row => <span>{row.Number}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Action",
            selector: row => row.Action,
            cell: row => <span>{row.Action}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "User Name",
            selector: row => row.UserName,
            cell: row => <span>{row.UserName}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Date Time",
            selector: row => row.DateTime,
            cell: row => <span>{row.DateTime}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "IP Address",
            selector: row => row.IPAddress,
            cell: row => <span>{row.IPAddress}</span>,
            sortable: true
        }
    ];

    const rows = [
        {
            id: 1,
            ModuleName: "Invoice",
            Number: "DB24-25/002340",
            Action: "Generated",
            UserName: "Sandy",
            DateTime: "2025-02-11 16:22:09",
            IPAddress: "152.59.96.55",
        },
        {
            id: 2,
            ModuleName: "Quotation",
            Number: "DB24-25/002341",
            Action: "Updated",
            UserName: "Admin",
            DateTime: "2025-02-12 10:00:00",
            IPAddress: "192.168.0.1",
        },
        {
            id: 3, ModuleName: "John Doe", Number: "DB24-25/002340", Action: "Generated", UserName: "Sandy", DateTime: "2025-02-11 16:22:09", IPAddress: "152.59.96.55",
        },
        {
            id: 4, ModuleName: "John Doe", Number: "DB24-25/002340", Action: "Generated", UserName: "Sandy", DateTime: "2025-02-11 16:22:09", IPAddress: "152.59.96.55",
        },
        {
            id: 5, ModuleName: "John Doe", Number: "DB24-25/002340", Action: "Generated", UserName: "Sandy", DateTime: "2025-02-11 16:22:09", IPAddress: "152.59.96.55",
        },
        {
            id: 6, ModuleName: "John Doe", Number: "DB24-25/002340", Action: "Generated", UserName: "Sandy", DateTime: "2025-02-11 16:22:09", IPAddress: "152.59.96.55",
        },
        {
            id: 7, ModuleName: "John Doe", Number: "DB24-25/002340", Action: "Generated", UserName: "Sandy", DateTime: "2025-02-11 16:22:09", IPAddress: "152.59.96.55",
        },
        {
            id: 8, ModuleName: "John Doe", Number: "DB24-25/002340", Action: "Generated", UserName: "Sandy", DateTime: "2025-02-11 16:22:09", IPAddress: "152.59.96.55",
        },
        {
            id: 9, ModuleName: "John Doe", Number: "DB24-25/002340", Action: "Generated", UserName: "Sandy", DateTime: "2025-02-11 16:22:09", IPAddress: "152.59.96.55",
        },
        {
            id: 10, ModuleName: "John Doe", Number: "DB24-25/002340", Action: "Generated", UserName: "Sandy", DateTime: "2025-02-11 16:22:09", IPAddress: "152.59.96.55",
        },
        {
            id: 12, ModuleName: "John Doe", Number: "DB24-25/002340", Action: "Generated", UserName: "Sandy", DateTime: "2025-02-11 16:22:09", IPAddress: "152.59.96.55",
        }
    ];

    const [searchInput, setSearchInput] = useState("");
    const [filteredData, setFilteredData] = useState(rows);

    const handleInputChange = (e) => {
        setSearchInput(e.target.value);
    };

    const handleSearch = (e) => {
        e.preventDefault();

        const searchTerm = searchInput.toLowerCase();

        const filteredRows = rows.filter(row =>
            row.ModuleName.toLowerCase().includes(searchTerm) ||
            row.Number.toLowerCase().includes(searchTerm) ||
            row.Action.toLowerCase().includes(searchTerm) ||
            row.UserName.toLowerCase().includes(searchTerm) ||
            row.DateTime.toLowerCase().includes(searchTerm) ||
            row.IPAddress.toLowerCase().includes(searchTerm)
        );

        setFilteredData(filteredRows);
    };

    return (
        <div className='auditlog-main'>
            <h3>Audit Log</h3>

            <div className="auditlog-main-inputs">
                {/* <div className="auditlog-main-inputs-search">
                    
                </div> */}

                <div className="auditlog-main-inputs-paramtr">
                    <form onSubmit={handleSearch} className="col-12">
                        <div className="auditlog-main-inputs-paramtr-flex row mb-3">
                            <div className="auditlog-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                <input
                                    type="text"
                                    placeholder="Search by keyword..."
                                    value={searchInput}
                                    onChange={handleInputChange}
                                    className="form-control form-control-sm"
                                />
                            </div>
                            <div className="auditlog-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                <select className="form-control form-control-sm" name="audit">
                                    <option value="">Select Module</option>
                                    <option value="query">Query</option>
                                    <option value="quotation">Quotation</option>
                                    <option value="invoice">Invoice</option>
                                    <option value="voucher">Voucher</option>
                                </select>
                            </div>

                            <div className="auditlog-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    name="agent"
                                    placeholder="Agent"
                                />
                            </div>

                            <div className="auditlog-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                <input type="date" className="form-control form-control-sm" name="start" id="start-date" />
                            </div>

                            <div className="auditlog-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                <input type="date" className="form-control form-control-sm" name="end" id="end-date" />
                            </div>

                            <div className="auditlog-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                {/* <button type="submit" className="form-control form-control-btn">Search</button> */}
                                 <button type="submit" className="btn btn-primary btn-custom-size flex-shrink-0 flex-grow-0"> <i className='fa-brands fa-searchengin me-2'></i> Search</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <PaginatedDataTable rows={filteredData} columns={columns} />
        </div>
    );
}

export default AuditLog;
