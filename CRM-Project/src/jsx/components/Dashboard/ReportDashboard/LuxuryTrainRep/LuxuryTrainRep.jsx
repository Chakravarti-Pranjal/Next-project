import React, { useState } from 'react'
// import "./LuxuryTrainRep.css"
import ReportTable from '../ReportTable/ReportTable';


function LuxuryTrainRep() {
    const columns = [
        {
            name: "Module Name",
            selector: row => row.Module,
            cell: row => <span>{row.Module}</span>,
            wrap: true,
            sortable: true,
        },
        {
            name: "Number",
            selector: row => row.Number,
            cell: row => <span>{row.Number}</span>,
            wrap: true,
            sortable: true,
        },
        {
            name: "Action",
            selector: row => row.Action,
            cell: row => <span>{row.Action}</span>,
            wrap: true,
            sortable: true,
        },
        {
            name: "User Name",
            selector: row => row.UserName,
            cell: row => <span>{row.UserName}</span>,
            wrap: true,
            sortable: true,
        },
        {
            name: "Date Time",
            selector: row => row.Date,
            cell: row => <span>{row.Date}</span>,
            wrap: true,
            sortable: true,
        },
        {
            name: "IP Address",
            selector: row => row.IPAddress,
            cell: row => <span>{row.IPAddress}</span>,
            wrap: true,
            sortable: true,
        },
    ];


    // Table Data
    const rows = [
        { wrap: true, Module: "Voucher", Number: "DB24-25/002068", Action: "	Cancelled", UserName: "Mohd Rizwan", Date: "2024-07-27 16:21:20", IPAddress: "122.161.52.231" },
        { wrap: true, Module: "Voucher", Number: "DB24-25/002068", Action: "	Cancelled", UserName: "Mohd Rizwan", Date: "2024-07-27 16:21:20", IPAddress: "122.161.52.231" },
        { wrap: true, Module: "Voucher", Number: "DB24-25/002068", Action: "	Cancelled", UserName: "Mohd Rizwan", Date: "2024-07-27 16:21:20", IPAddress: "122.161.52.231" },
        { wrap: true, Module: "Voucher", Number: "DB24-25/002068", Action: "	Cancelled", UserName: "Mohd Rizwan", Date: "2024-07-27 16:21:20", IPAddress: "122.161.52.231" },
        { wrap: true, Module: "Voucher", Number: "DB24-25/002068", Action: "	Cancelled", UserName: "Mohd Rizwan", Date: "2024-07-27 16:21:20", IPAddress: "122.161.52.231" },
        { wrap: true, Module: "Voucher", Number: "DB24-25/002068", Action: "	Cancelled", UserName: "Mohd Rizwan", Date: "2024-07-27 16:21:20", IPAddress: "122.161.52.231" },
        { wrap: true, Module: "Voucher", Number: "DB24-25/002068", Action: "	Cancelled", UserName: "Mohd Rizwan", Date: "2024-07-27 16:21:20", IPAddress: "122.161.52.231" },
        { wrap: true, Module: "Voucher", Number: "DB24-25/002068", Action: "	Cancelled", UserName: "Mohd Rizwan", Date: "2024-07-27 16:21:20", IPAddress: "122.161.52.231" },
        { wrap: true, Module: "Voucher", Number: "DB24-25/002068", Action: "	Cancelled", UserName: "Mohd Rizwan", Date: "2024-07-27 16:21:20", IPAddress: "122.161.52.231" },
        { wrap: true, Module: "Voucher", Number: "DB24-25/002068", Action: "	Cancelled", UserName: "Mohd Rizwan", Date: "2024-07-27 16:21:20", IPAddress: "122.161.52.231" },
        { wrap: true, Module: "Voucher", Number: "DB24-25/002068", Action: "	Cancelled", UserName: "Mohd Rizwan", Date: "2024-07-27 16:21:20", IPAddress: "122.161.52.231" },
        { wrap: true, Module: "Voucher", Number: "DB24-25/002068", Action: "	Cancelled", UserName: "Mohd Rizwan", Date: "2024-07-27 16:21:20", IPAddress: "122.161.52.231" },
        { wrap: true, Module: "Voucher", Number: "DB24-25/002068", Action: "	Cancelled", UserName: "Mohd Rizwan", Date: "2024-07-27 16:21:20", IPAddress: "122.161.52.231" },
        { wrap: true, Module: "Voucher", Number: "DB24-25/002068", Action: "	Cancelled", UserName: "Mohd Rizwan", Date: "2024-07-27 16:21:20", IPAddress: "122.161.52.231" },
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
            <div className='luxury-train-rep-main'>
                <h3 >Luxury Train Report</h3>

                {/* Search Input */}
                <div className="luxury-train-rep-main-inputs">

                    <div className="luxury-train-rep-main-inputs-paramtr">
                        <form action="" className="col-12">
                            <div className="luxury-train-rep-main-inputs-paramtr-flex row mb-3">
                                <div className="luxury-train-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    <input type="text" placeholder="Search by name..." value={search} onChange={handleSearch} className="form-control form-control-sm" />

                                </div>
                                {/* <!-- Agent Select --> */}
                                <div className="luxury-train-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    <select className="form-control form-control-sm" name="audit">
                                        <option value="volvo">Select Module</option>
                                        <option value="saab">Query</option>
                                        <option value="mercedes">Quotation</option>
                                        <option value="audi">Invoice</option>
                                        <option value="audi">Voucher</option>
                                    </select>
                                </div>

                                <div className="luxury-train-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    {/* <label for="start-date" className="form-label">Start</label> */}
                                    <input type="text" className="form-control form-control-sm" name="start" placeholder='Username' />
                                </div>

                                {/* <!-- Start Date --> */}
                                <div className="luxury-train-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    {/* <label for="start-date" className="form-label">Start</label> */}
                                    <input type="date" className="form-control form-control-sm" name="start" id="start-date" />
                                </div>

                                {/* <!-- End Date --> */}
                                <div className="luxury-train-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    {/* <label for="end-date" className="form-label">End</label> */}
                                    <input type="date" className="form-control form-control-sm" name="end" id="end-date" />
                                </div>

                                {/* <!-- Submit Button --> */}
                                <div className="luxury-train-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    <button type="submit" className="btn btn-primary btn-custom-size flex-shrink-0 flex-grow-0"> <i className='fa-brands fa-searchengin me-2'></i> Search</button>
                                </div>
                            </div>
                        </form>
                    </div >
                </div >


                <ReportTable rows={filteredData} columns={columns} />
            </div >
        </>
    );
}

export default LuxuryTrainRep