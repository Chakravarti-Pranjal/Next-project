import React, { useState } from 'react'
// import "./TourExtensionRep.css"
import ReportTable from '../ReportTable/ReportTable';
import PaginatedDataTable from '../ReportTable/PaginatedDataTable';


function TourExtensionRep() {
    const columns = [
        {
            name: "S.No",
            selector: row => row.id,
            cell: row => <span>{row.id}</span>,
            sortable: true,
            wrap: true
        },
        {
            name: "Country",
            selector: row => row.Country,
            cell: row => <span>{row.Country}</span>,
            sortable: true,
            wrap: true
        },
        {
            name: "Tour Name",
            selector: row => row.TourName,
            cell: row => <span>{row.TourName}</span>,
            sortable: true,
            wrap: true
        },
        {
            name: "Tour Code",
            selector: row => row.TourCode,
            cell: row => <span>{row.TourCode}</span>,
            sortable: true,
            wrap: true
        },
        {
            name: "Agent",
            selector: row => row.Agent,
            cell: row => <span>{row.Agent}</span>,
            sortable: true,
            wrap: true
        },
        {
            name: "Ref No.",
            selector: row => row.RefNo,
            cell: row => <span>{row.RefNo}</span>,
            sortable: true,
            wrap: true
        },
        {
            name: "Operation Person",
            selector: row => row.OperationPerson,
            cell: row => <span>{row.OperationPerson}</span>,
            sortable: true,
            wrap: true
        },
        {
            name: "Query Type",
            selector: row => row.QueryType,
            cell: row => <span>{row.QueryType}</span>,
            sortable: true,
            wrap: true
        },
        {
            name: "Query Date",
            selector: row => row.QueryDate,
            cell: row => <span>{row.QueryDate}</span>,
            sortable: true,
            wrap: true
        },
        {
            name: "From Date",
            selector: row => row.FromDate,
            cell: row => <span>{row.FromDate}</span>,
            sortable: true,
            wrap: true
        },
        {
            name: "Status",
            selector: row => row.Status,
            cell: row => <span>{row.Status}</span>,
            sortable: true,
            wrap: true
        },
        {
            name: "Pre/Post Extension",
            selector: row => row.PrePostExtension,
            cell: row => <span>{row.PrePostExtension}</span>,
            sortable: true,
            wrap: true
        },
    ];


    // Table Data
    const rows = [
        { id: 1, Country: "India", TourName: "08-06-2022 Pawan Travel India", TourCode: "22/04/0006/MR", Agent: "22/06/0001/AD", RefNo: "R20220009", OperationPerson: "Mausam Khan", QueryType: "FIT", QueryDate: "	02-07-2022", FromDate: "02-07-2022", Status: "Confirmed", PrePostExtension: "Pre(0)  Post(0)", },
        { id: 2, Country: "India", TourName: "08-06-2022 Pawan Travel India", TourCode: "22/04/0006/MR", Agent: "22/06/0001/AD", RefNo: "R20220009", OperationPerson: "Mausam Khan", QueryType: "FIT", QueryDate: "	02-07-2022", FromDate: "02-07-2022", Status: "Confirmed", PrePostExtension: "Pre(0)  Post(0)", },
        { id: 3, Country: "India", TourName: "08-06-2022 Pawan Travel India", TourCode: "22/04/0006/MR", Agent: "22/06/0001/AD", RefNo: "R20220009", OperationPerson: "Mausam Khan", QueryType: "FIT", QueryDate: "	02-07-2022", FromDate: "02-07-2022", Status: "Confirmed", PrePostExtension: "Pre(0)  Post(0)", },
        { id: 4, Country: "India", TourName: "08-06-2022 Pawan Travel India", TourCode: "22/04/0006/MR", Agent: "22/06/0001/AD", RefNo: "R20220009", OperationPerson: "Mausam Khan", QueryType: "FIT", QueryDate: "	02-07-2022", FromDate: "02-07-2022", Status: "Confirmed", PrePostExtension: "Pre(0)  Post(0)", },
        { id: 5, Country: "India", TourName: "08-06-2022 Pawan Travel India", TourCode: "22/04/0006/MR", Agent: "22/06/0001/AD", RefNo: "R20220009", OperationPerson: "Mausam Khan", QueryType: "FIT", QueryDate: "	02-07-2022", FromDate: "02-07-2022", Status: "Confirmed", PrePostExtension: "Pre(0)  Post(0)", },
        { id: 6, Country: "India", TourName: "08-06-2022 Pawan Travel India", TourCode: "22/04/0006/MR", Agent: "22/06/0001/AD", RefNo: "R20220009", OperationPerson: "Mausam Khan", QueryType: "FIT", QueryDate: "	02-07-2022", FromDate: "02-07-2022", Status: "Confirmed", PrePostExtension: "Pre(0)  Post(0)", },
        { id: 7, Country: "India", TourName: "08-06-2022 Pawan Travel India", TourCode: "22/04/0006/MR", Agent: "22/06/0001/AD", RefNo: "R20220009", OperationPerson: "Mausam Khan", QueryType: "FIT", QueryDate: "	02-07-2022", FromDate: "02-07-2022", Status: "Confirmed", PrePostExtension: "Pre(0)  Post(0)", },
        { id: 8, Country: "India", TourName: "08-06-2022 Pawan Travel India", TourCode: "22/04/0006/MR", Agent: "22/06/0001/AD", RefNo: "R20220009", OperationPerson: "Mausam Khan", QueryType: "FIT", QueryDate: "	02-07-2022", FromDate: "02-07-2022", Status: "Confirmed", PrePostExtension: "Pre(0)  Post(0)", },
        { id: 9, Country: "India", TourName: "08-06-2022 Pawan Travel India", TourCode: "22/04/0006/MR", Agent: "22/06/0001/AD", RefNo: "R20220009", OperationPerson: "Mausam Khan", QueryType: "FIT", QueryDate: "	02-07-2022", FromDate: "02-07-2022", Status: "Confirmed", PrePostExtension: "Pre(0)  Post(0)", },
        { id: 10, Country: "India", TourName: "08-06-2022 Pawan Travel India", TourCode: "22/04/0006/MR", Agent: "22/06/0001/AD", RefNo: "R20220009", OperationPerson: "Mausam Khan", QueryType: "FIT", QueryDate: "	02-07-2022", FromDate: "02-07-2022", Status: "Confirmed", PrePostExtension: "Pre(0)  Post(0)", },
        { id: 11, Country: "India", TourName: "08-06-2022 Pawan Travel India", TourCode: "22/04/0006/MR", Agent: "22/06/0001/AD", RefNo: "R20220009", OperationPerson: "Mausam Khan", QueryType: "FIT", QueryDate: "	02-07-2022", FromDate: "02-07-2022", Status: "Confirmed", PrePostExtension: "Pre(0)  Post(0)", },
        { id: 12, Country: "India", TourName: "08-06-2022 Pawan Travel India", TourCode: "22/04/0006/MR", Agent: "22/06/0001/AD", RefNo: "R20220009", OperationPerson: "Mausam Khan", QueryType: "FIT", QueryDate: "	02-07-2022", FromDate: "02-07-2022", Status: "Confirmed", PrePostExtension: "Pre(0)  Post(0)", },

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
            <div className='tour-extension-rep-main'>
                <h3 >Tour Extention Report</h3>

                {/* Search Input */}
                <div className="tour-extension-rep-main-inputs">
                    {/* <div className="tour-extension-rep-main-inputs-search">
                    </div> */}
                    <div className="tour-extension-rep-main-inputs-paramtr">
                        <form action="" className="col-12">
                            <div className="tour-extension-rep-main-inputs-paramtr-flex row mb-3">

                                <div className="tour-extension-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    <input type="text" placeholder="Agent/Client/B2B" value={search} onChange={handleSearch} className="form-control form-control-sm" />

                                </div>

                                {/* <!-- Start Date --> */}
                                <div className="tour-extension-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    {/* <label for="start-date" className="form-label">Start</label> */}
                                    <input type="date" className="form-control form-control-sm" name="start" id="start-date" />
                                </div>

                                {/* <!-- End Date --> */}
                                <div className="tour-extension-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    {/* <label for="end-date" className="form-label">End</label> */}
                                    <input type="date" className="form-control form-control-sm" name="end" id="end-date" />
                                </div>

                                {/* <!-- Select Operation Person --> */}
                                <div className="tour-extension-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    <select className="form-control form-control-sm" name="operation">
                                        <option value="volvo">Select Operation Person</option>
                                        <option value="saab">Sameer</option>
                                        <option value="saab">Rihaan Khan</option>
                                    </select>
                                </div>

                                {/* <!-- Select Agent Name --> */}
                                <div className="tour-extension-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    <select className="form-control form-control-sm" name="operation">
                                        <option value="volvo">Agent Name</option>
                                        <option value="saab">Sameer</option>
                                        <option value="saab">Rihaan Khan</option>
                                    </select>
                                </div>

                                {/* <!-- Submit Button --> */}
                                <div className="tour-extension-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
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

export default TourExtensionRep