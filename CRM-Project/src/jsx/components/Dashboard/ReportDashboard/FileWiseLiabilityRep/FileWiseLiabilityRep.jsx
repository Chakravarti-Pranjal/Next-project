import React, { useState } from 'react'
// import "./FileWiseLiabilityRep.css"
import ReportTable from '../ReportTable/ReportTable';
import PaginatedDataTable from '../ReportTable/PaginatedDataTable';


function FileWiseLiabilityRep() {
    // Table Columns
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
            name: "Tour Code",
            selector: row => row.Tourcode,
            cell: row => <span>{row.Tourcode}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Subject Name",
            selector: row => row.SubjectName,
            cell: row => <span>{row.SubjectName}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Agent",
            selector: row => row.Salesperson,
            cell: row => <span>{row.Salesperson}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Sales Person",
            selector: row => row.Salesperson,
            cell: row => <span>{row.Salesperson}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Operation Person",
            selector: row => row.Operationperson,
            cell: row => <span>{row.Operationperson}</span>,
            sortable: true,
            width: "10rem",
        },
        {
            wrap: true,
            name: "Currency",
            selector: row => row.Currency,
            cell: row => <span>{row.Currency}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Exchange Rate",
            selector: row => row.Exchangerate,
            cell: row => <span>{row.Exchangerate}</span>,
            sortable: true,
            width: "10rem",
        },
        {
            wrap: true,
            name: "P.Inv.Amount",
            selector: row => row.PInvAmount,
            cell: row => <span>{row.PInvAmount}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Tax invoice Amount",
            selector: row => row.TaxinvoiceAmount,
            cell: row => <span>{row.TaxinvoiceAmount}</span>,
            sortable: true,
            width: "11rem",
        },
        {
            wrap: true,
            name: "Operation/Supplier Cost",
            selector: row => row.OperationSupplierCost,
            cell: row => <span>{row.OperationSupplierCost}</span>,
            sortable: true,
            width: "13rem",
        },
        {
            wrap: true,
            name: "Advance Amount/Booking Amount",
            selector: row => row.AdvanceAmount,
            cell: row => <span>{row.AdvanceAmount}</span>,
            sortable: true, width: "17rem",
        },
        {
            wrap: true,
            name: "Profit/Loss Amount",
            selector: row => row.Amount,
            cell: row => <span>{row.Amount}</span>,
            sortable: true,
            width: "11rem",
        },
        {
            wrap: true,
            name: "Profit/Loss %",
            selector: row => row.ProfitLoss,
            cell: row => <span>{row.ProfitLoss}</span>,
            sortable: true,
            width: "10rem",
        }
    ];

    // Table Data
    const rows = [
        { id: 1, Tourcode: "24/04/0028/", SubjectName: "Pawan Travel India", Agent: "Travel solution", Salesperson: "Mausam Khan", Operationperson: "Mausam Khan", Currency: "INR", Exchangerate: "1.00", PInvAmount: "2.00", TaxinvoiceAmount: "2.00", OperationSupplierCost: "2120.00", AdvanceAmount: "0.00", Amount: "318.00", ProfitLoss: "15.01" },
        { id: 2, Tourcode: "24/04/0028/", SubjectName: "Pawan Travel India", Agent: "Travel solution", Salesperson: "Mausam Khan", Operationperson: "Mausam Khan", Currency: "INR", Exchangerate: "1.00", PInvAmount: "2.00", TaxinvoiceAmount: "2.00", OperationSupplierCost: "2120.00", AdvanceAmount: "0.00", Amount: "318.00", ProfitLoss: "15.01" },
        { id: 3, Tourcode: "24/04/0028/", SubjectName: "Pawan Travel India", Agent: "Travel solution", Salesperson: "Mausam Khan", Operationperson: "Mausam Khan", Currency: "INR", Exchangerate: "1.00", PInvAmount: "2.00", TaxinvoiceAmount: "2.00", OperationSupplierCost: "2120.00", AdvanceAmount: "0.00", Amount: "318.00", ProfitLoss: "15.01" },
        { id: 4, Tourcode: "24/04/0028/", SubjectName: "Pawan Travel India", Agent: "Travel solution", Salesperson: "Mausam Khan", Operationperson: "Mausam Khan", Currency: "INR", Exchangerate: "1.00", PInvAmount: "2.00", TaxinvoiceAmount: "2.00", OperationSupplierCost: "2120.00", AdvanceAmount: "0.00", Amount: "318.00", ProfitLoss: "15.01" },
        { id: 5, Tourcode: "24/04/0028/", SubjectName: "Pawan Travel India", Agent: "Travel solution", Salesperson: "Mausam Khan", Operationperson: "Mausam Khan", Currency: "INR", Exchangerate: "1.00", PInvAmount: "2.00", TaxinvoiceAmount: "2.00", OperationSupplierCost: "2120.00", AdvanceAmount: "0.00", Amount: "318.00", ProfitLoss: "15.01" },
        { id: 6, Tourcode: "24/04/0028/", SubjectName: "Pawan Travel India", Agent: "Travel solution", Salesperson: "Mausam Khan", Operationperson: "Mausam Khan", Currency: "INR", Exchangerate: "1.00", PInvAmount: "2.00", TaxinvoiceAmount: "2.00", OperationSupplierCost: "2120.00", AdvanceAmount: "0.00", Amount: "318.00", ProfitLoss: "15.01" },
        { id: 7, Tourcode: "24/04/0028/", SubjectName: "Pawan Travel India", Agent: "Travel solution", Salesperson: "Mausam Khan", Operationperson: "Mausam Khan", Currency: "INR", Exchangerate: "1.00", PInvAmount: "2.00", TaxinvoiceAmount: "2.00", OperationSupplierCost: "2120.00", AdvanceAmount: "0.00", Amount: "318.00", ProfitLoss: "15.01" },
        { id: 8, Tourcode: "24/04/0028/", SubjectName: "Pawan Travel India", Agent: "Travel solution", Salesperson: "Mausam Khan", Operationperson: "Mausam Khan", Currency: "INR", Exchangerate: "1.00", PInvAmount: "2.00", TaxinvoiceAmount: "2.00", OperationSupplierCost: "2120.00", AdvanceAmount: "0.00", Amount: "318.00", ProfitLoss: "15.01" },
        { id: 9, Tourcode: "24/04/0028/", SubjectName: "Pawan Travel India", Agent: "Travel solution", Salesperson: "Mausam Khan", Operationperson: "Mausam Khan", Currency: "INR", Exchangerate: "1.00", PInvAmount: "2.00", TaxinvoiceAmount: "2.00", OperationSupplierCost: "2120.00", AdvanceAmount: "0.00", Amount: "318.00", ProfitLoss: "15.01" },
        { id: 10, Tourcode: "24/04/0028/", SubjectName: "Pawan Travel India", Agent: "Travel solution", Salesperson: "Mausam Khan", Operationperson: "Mausam Khan", Currency: "INR", Exchangerate: "1.00", PInvAmount: "2.00", TaxinvoiceAmount: "2.00", OperationSupplierCost: "2120.00", AdvanceAmount: "0.00", Amount: "318.00", ProfitLoss: "15.01" },
        { id: 11, Tourcode: "24/04/0028/", SubjectName: "Pawan Travel India", Agent: "Travel solution", Salesperson: "Mausam Khan", Operationperson: "Mausam Khan", Currency: "INR", Exchangerate: "1.00", PInvAmount: "2.00", TaxinvoiceAmount: "2.00", OperationSupplierCost: "2120.00", AdvanceAmount: "0.00", Amount: "318.00", ProfitLoss: "15.01" },
        { id: 12, Tourcode: "24/04/0028/", SubjectName: "Pawan Travel India", Agent: "Travel solution", Salesperson: "Mausam Khan", Operationperson: "Mausam Khan", Currency: "INR", Exchangerate: "1.00", PInvAmount: "2.00", TaxinvoiceAmount: "2.00", OperationSupplierCost: "2120.00", AdvanceAmount: "0.00", Amount: "318.00", ProfitLoss: "15.01" },
    ];

    const [search, setSearch] = useState("");
    const [filteredData, setFilteredData] = useState(rows);

    // Search Filter Function
    const handleSearch = (event) => {
        const searchTerm = event.target.value.toLowerCase();
        setSearch(searchTerm);

        const filteredRows = rows.filter(row =>
            row.fullName.toLowerCase().includes(searchTerm) || row.country.toLowerCase().includes(searchTerm) || row.id.toString().toLowerCase().includes(searchTerm) || row.pax.toString().toLowerCase().includes(searchTerm) || row.excl.toString().toLowerCase().includes(searchTerm) || row.incl.toString().toLowerCase().includes(searchTerm)
        );

        setFilteredData(filteredRows);
    };

    return (
        <>
            <div className='file-wise-query-rep-main'>
                <h3 >File Wise Liability Report</h3>

                {/* Search Input */}
                <div className="file-wise-query-rep-main-inputs">
                    {/* <div className="file-wise-query-rep-main-inputs-search">
                    </div> */}
                    <div className="file-wise-query-rep-main-inputs-paramtr">
                        <form action="" className="col-12">

                            <div className="file-wise-query-rep-main-inputs-paramtr-flex row mb-3">
                                <div className='file-wise-query-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2'>
                                    <input type="text" placeholder="Search by name..." value={search} onChange={handleSearch} className="form-control form-control-sm" />

                                </div>
                                {/* <!-- Finance Year --> */}
                                <div className="file-wise-query-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    <select className="form-control form-control-sm" name="year">
                                        <option value="volvo">Finance Year</option>
                                        <option value="saab">Saab</option>
                                        <option value="mercedes">Mercedes</option>
                                        <option value="audi">Audi</option>
                                    </select>
                                </div>

                                {/* <!-- Month --> */}
                                <div className="file-wise-query-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    <select className="form-control form-control-sm" name="month">
                                        <option value="volvo">Select Month</option>
                                        <option value="saab">Saab</option>
                                        <option value="mercedes">Mercedes</option>
                                        <option value="audi">Audi</option>
                                    </select>
                                </div>

                                {/* <!-- Start Date --> */}
                                <div className="file-wise-query-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    {/* <label for="start-date" className="form-label">Start</label> */}
                                    <input type="date" className="form-control form-control-sm" name="start" id="start-date" />
                                </div>

                                {/* <!-- End Date --> */}
                                <div className="file-wise-query-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    {/* <label for="end-date" className="form-label">End</label> */}
                                    <input type="date" className="form-control form-control-sm" name="end" id="end-date" />
                                </div>

                                {/* <!-- Agent Select --> */}
                                <div className="file-wise-query-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    <select className="form-control form-control-sm" name="agent">
                                        <option value="volvo">Agents Name</option>
                                        <option value="saab">Porche</option>
                                        <option value="mercedes">Mercedes</option>
                                        <option value="audi">Audi</option>
                                    </select>
                                </div>

                                {/* <!-- Submit Button --> */}
                                <div className="file-wise-query-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    <button type="submit" className="btn btn-primary btn-custom-size flex-shrink-0 flex-grow-0"> <i className='fa-brands fa-searchengin me-2'></i> Search</button>
                                </div>
                            </div>
                        </form>
                    </div >
                </div >


                <PaginatedDataTable rows={filteredData} columns={columns} />
            </div >
        </>
    );
}

export default FileWiseLiabilityRep