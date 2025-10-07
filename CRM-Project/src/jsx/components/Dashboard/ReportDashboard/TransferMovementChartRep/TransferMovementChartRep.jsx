import React, { useEffect, useState } from 'react';
// import "./TransferMovementChartRep.css";
import ReportTable from '../ReportTable/ReportTable';



function TransferMovementChartRep() {

    // Table Columns
    const columns = [
        {
            wrap: true,
            name: "S.No",
            selector: row => row.id,
            cell: row => <span>{row.id}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Country",
            selector: row => row.COUNTRY,
            cell: row => <span>{row.COUNTRY}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Type",
            selector: row => row.TYPE,
            cell: row => <span>{row.TYPE}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Feb 2024",
            selector: row => row.Feb,
            cell: row => <span>{row.Feb}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Mar 2024",
            selector: row => row.Mar,
            cell: row => <span>{row.Mar}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Apr 2024",
            selector: row => row.Apr,
            cell: row => <span>{row.Apr}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "May 2024",
            selector: row => row.May,
            cell: row => <span>{row.May}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Jun 2024",
            selector: row => row.Jun,
            cell: row => <span>{row.Jun}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Jul 2024",
            selector: row => row.Jul,
            cell: row => <span>{row.Jul}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Aug 2024",
            selector: row => row.Aug,
            cell: row => <span>{row.Aug}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Sep 2024",
            selector: row => row.Sep,
            cell: row => <span>{row.Sep}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Oct 2024",
            selector: row => row.Oct,
            cell: row => <span>{row.Oct}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Nov 2024",
            selector: row => row.Nov,
            cell: row => <span>{row.Nov}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Dec 2024",
            selector: row => row.Dec,
            cell: row => <span>{row.Dec}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Jan 2025",
            selector: row => row.Jan25,
            cell: row => <span>{row.Jan25}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Feb 2025",
            selector: row => row.Feb25,
            cell: row => <span>{row.Feb25}</span>,
            sortable: true
        }
    ];

    // Table Data
    const rows = [
        { id: 1, COUNTRY: "John Doe", TYPE: "USA", Feb: 2, Mar: 41500, Apr: 59500, May: 59500, Jun: 59500, Jul: 59500, Aug: 59500, Sep: 59500, Oct: 59500, Nov: 59500, Dec: 59500, Jan25: 59500, Feb25: 59500, },
        { id: 2, COUNTRY: "John Doe", TYPE: "USA", Feb: 2, Mar: 41500, Apr: 59500, May: 59500, Jun: 59500, Jul: 59500, Aug: 59500, Sep: 59500, Oct: 59500, Nov: 59500, Dec: 59500, Jan25: 59500, Feb25: 59500, },
        { id: 3, COUNTRY: "John Doe", TYPE: "USA", Feb: 2, Mar: 41500, Apr: 59500, May: 59500, Jun: 59500, Jul: 59500, Aug: 59500, Sep: 59500, Oct: 59500, Nov: 59500, Dec: 59500, Jan25: 59500, Feb25: 59500, },
        { id: 4, COUNTRY: "John Doe", TYPE: "USA", Feb: 2, Mar: 41500, Apr: 59500, May: 59500, Jun: 59500, Jul: 59500, Aug: 59500, Sep: 59500, Oct: 59500, Nov: 59500, Dec: 59500, Jan25: 59500, Feb25: 59500, },
        { id: 5, COUNTRY: "John Doe", TYPE: "USA", Feb: 2, Mar: 41500, Apr: 59500, May: 59500, Jun: 59500, Jul: 59500, Aug: 59500, Sep: 59500, Oct: 59500, Nov: 59500, Dec: 59500, Jan25: 59500, Feb25: 59500, },
        { id: 6, COUNTRY: "John Doe", TYPE: "USA", Feb: 2, Mar: 41500, Apr: 59500, May: 59500, Jun: 59500, Jul: 59500, Aug: 59500, Sep: 59500, Oct: 59500, Nov: 59500, Dec: 59500, Jan25: 59500, Feb25: 59500, },
        { id: 7, COUNTRY: "John Doe", TYPE: "USA", Feb: 2, Mar: 41500, Apr: 59500, May: 59500, Jun: 59500, Jul: 59500, Aug: 59500, Sep: 59500, Oct: 59500, Nov: 59500, Dec: 59500, Jan25: 59500, Feb25: 59500, },
        { id: 8, COUNTRY: "John Doe", TYPE: "USA", Feb: 2, Mar: 41500, Apr: 59500, May: 59500, Jun: 59500, Jul: 59500, Aug: 59500, Sep: 59500, Oct: 59500, Nov: 59500, Dec: 59500, Jan25: 59500, Feb25: 59500, },
        { id: 9, COUNTRY: "John Doe", TYPE: "USA", Feb: 2, Mar: 41500, Apr: 59500, May: 59500, Jun: 59500, Jul: 59500, Aug: 59500, Sep: 59500, Oct: 59500, Nov: 59500, Dec: 59500, Jan25: 59500, Feb25: 59500, },
        { id: 10, COUNTRY: "John Doe", TYPE: "USA", Feb: 2, Mar: 41500, Apr: 59500, May: 59500, Jun: 59500, Jul: 59500, Aug: 59500, Sep: 59500, Oct: 59500, Nov: 59500, Dec: 59500, Jan25: 59500, Feb25: 59500, },
        { id: 11, COUNTRY: "John Doe", TYPE: "USA", Feb: 2, Mar: 41500, Apr: 59500, May: 59500, Jun: 59500, Jul: 59500, Aug: 59500, Sep: 59500, Oct: 59500, Nov: 59500, Dec: 59500, Jan25: 59500, Feb25: 59500, },
        { id: 12, COUNTRY: "John Doe", TYPE: "USA", Feb: 2, Mar: 41500, Apr: 59500, May: 59500, Jun: 59500, Jul: 59500, Aug: 59500, Sep: 59500, Oct: 59500, Nov: 59500, Dec: 59500, Jan25: 59500, Feb25: 59500, },
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
            <div className='transfer-movement-chart-rep-main'>
                <h3 >Transfer Movement Chart Report</h3>

                {/* Search Input */}
                <div className="transfer-movement-chart-rep-main-inputs">
                    <div className="transfer-movement-chart-rep-main-inputs-paramtr">
                        <form action="" className="col-12">
                            <div className="transfer-movement-chart-rep-main-inputs-paramtr-flex row mb-3">
                                {/* <!-- Agent Select --> */}
                                <div className="transfer-movement-chart-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    <select className="form-control form-control-sm" name="agent">
                                        <option value="volvo">Transfer Type</option>
                                        <option value="saab">Arrival</option>
                                        <option value="mercedes">Departure</option>
                                        <option value="audi">Drives</option>
                                        <option value="audi">Excersion</option>
                                        <option value="audi">Full day city tour</option>
                                        <option value="audi">Full day trip</option>
                                        <option value="audi">One way trip</option>
                                        <option value="audi">Outstation</option>
                                        <option value="audi">SightSeeing</option>
                                    </select>
                                </div>


                                <div className="transfer-movement-chart-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    {/* <label for="start-date" className="form-label">Start</label> */}
                                    <input type="text" className="form-control form-control-sm" name="start" placeholder='Agent/FTO Name' />
                                </div>

                                {/* <!-- B2C Select --> */}
                                <div className="transfer-movement-chart-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    <select className="form-control form-control-sm" name="b2c">
                                        <option value="volvo">Driver</option>
                                        <option value="saab">Aamir</option>
                                        <option value="mercedes">Aaftab</option>
                                        <option value="audi">Imtiaz</option>
                                        <option value="audi">Shadab</option>
                                    </select>
                                </div>

                                {/* <!-- City Select --> */}
                                <div className="transfer-movement-chart-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    <select className="form-control form-control-sm" name="city">
                                        <option value="volvo">City</option>
                                        <option value="saab">Delhi</option>
                                        <option value="mercedes">Agra</option>
                                        <option value="audi">Mumbai</option>
                                        <option value="audi">Jaipur</option>
                                    </select>
                                </div>

                                {/* <!-- Status Select --> */}
                                <div className="transfer-movement-chart-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    <select className="form-control form-control-sm" name="status">
                                        <option value="volvo">Select Status</option>
                                        <option value="saab">Assigned</option>
                                        <option value="mercedes">Rejected</option>
                                        <option value="audi">Completed</option>
                                    </select>
                                </div>


                                {/* <!-- Finance Year --> */}
                                <div className="transfer-movement-chart-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    <select className="form-control form-control-sm" name="year">
                                        <option value="volvo">Finance Year</option>
                                        <option value="saab">Saab</option>
                                        <option value="mercedes">Mercedes</option>
                                        <option value="audi">Audi</option>
                                    </select>
                                </div>

                                {/* <!-- Month --> */}
                                <div className="transfer-movement-chart-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    <select className="form-control form-control-sm" name="month">
                                        <option value="volvo">Select Month</option>
                                        <option value="saab">Saab</option>
                                        <option value="mercedes">Mercedes</option>
                                        <option value="audi">Audi</option>
                                    </select>
                                </div>

                                {/* <!-- Start Date --> */}
                                <div className="transfer-movement-chart-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    {/* <label for="start-date" className="form-label">Start</label> */}
                                    <input type="date" className="form-control form-control-sm" name="start" id="start-date" />
                                </div>

                                {/* <!-- End Date --> */}
                                <div className="transfer-movement-chart-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    {/* <label for="end-date" className="form-label">End</label> */}
                                    <input type="date" className="form-control form-control-sm" name="end" id="end-date" />
                                </div>

                                {/* <!-- Submit Button --> */}
                                <div className="transfer-movement-chart-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
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

export default TransferMovementChartRep;
