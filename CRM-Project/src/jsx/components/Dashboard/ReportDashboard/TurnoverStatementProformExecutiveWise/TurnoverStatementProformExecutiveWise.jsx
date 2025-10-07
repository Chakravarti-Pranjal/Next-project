import React, { useState } from 'react'
// import "./TurnoverStatementProformExecutiveWise.css"
import ReportTable from '../ReportTable/ReportTable';


function TurnoverStatementProformExecutiveWise() {
    const columns = [
        {
            name: "S.No",
            selector: row => row.id,
            cell: row => <span>{row.id}</span>,
            wrap: true,
            sortable: true,
        },
        {
            name: "Executive",
            selector: row => row.EXECUTIVEe,
            cell: row => <span>{row.EXECUTIVEe}</span>,
            wrap: true,
            sortable: true,
        },
        {
            name: "Type",
            selector: row => row.TYPE,
            cell: row => <span>{row.TYPE}</span>,
            wrap: true,
            sortable: true,
        },
        {
            name: "Feb 2024",
            selector: row => row.Feb,
            cell: row => <span>{row.Feb}</span>,
            wrap: true,
            sortable: true,
        },
        {
            name: "Mar 2024",
            selector: row => row.Mar,
            cell: row => <span>{row.Mar}</span>,
            wrap: true,
            sortable: true,
        },
        {
            name: "Apr 2024",
            selector: row => row.Apr,
            cell: row => <span>{row.Apr}</span>,
            wrap: true,
            sortable: true,
        },
        {
            name: "May 2024",
            selector: row => row.May,
            cell: row => <span>{row.May}</span>,
            wrap: true,
            sortable: true,
        },
        {
            name: "Jun 2024",
            selector: row => row.Jun,
            cell: row => <span>{row.Jun}</span>,
            wrap: true,
            sortable: true,
        },
        {
            name: "Jul 2024",
            selector: row => row.Jul,
            cell: row => <span>{row.Jul}</span>,
            wrap: true,
            sortable: true,
        },
        {
            name: "Aug 2024",
            selector: row => row.Aug,
            cell: row => <span>{row.Aug}</span>,
            wrap: true,
            sortable: true,
        },
        {
            name: "Sep 2024",
            selector: row => row.Sep,
            cell: row => <span>{row.Sep}</span>,
            wrap: true,
            sortable: true,
        },
        {
            name: "Oct 2024",
            selector: row => row.Oct,
            cell: row => <span>{row.Oct}</span>,
            wrap: true,
            sortable: true,
        },
        {
            name: "Nov 2024",
            selector: row => row.Nov,
            cell: row => <span>{row.Nov}</span>,
            wrap: true,
            sortable: true,
        },
        {
            name: "Dec 2024",
            selector: row => row.Dec,
            cell: row => <span>{row.Dec}</span>,
            wrap: true,
            sortable: true,
        },
        {
            name: "Jan 2025",
            selector: row => row.Jan25,
            cell: row => <span>{row.Jan25}</span>,
            wrap: true,
            sortable: true,
        },
        {
            name: "Feb 2025",
            selector: row => row.Feb25,
            cell: row => <span>{row.Feb25}</span>,
            wrap: true,
            sortable: true,
        },
    ];


    // Table Data
    const rows = [
        { wrap: true, id: 1, EXECUTIVEe: "John Doe", TYPE: "USA", Feb: 2, Mar: 41500, Apr: 59500, May: 59500, Jun: 59500, Jul: 59500, Aug: 59500, Sep: 59500, Oct: 59500, Nov: 59500, Dec: 59500, Jan25: 59500, Feb25: 59500, },
        { wrap: true, id: 2, EXECUTIVEe: "John Doe", TYPE: "USA", Feb: 2, Mar: 41500, Apr: 59500, May: 59500, Jun: 59500, Jul: 59500, Aug: 59500, Sep: 59500, Oct: 59500, Nov: 59500, Dec: 59500, Jan25: 59500, Feb25: 59500, },
        { wrap: true, id: 3, EXECUTIVEe: "John Doe", TYPE: "USA", Feb: 2, Mar: 41500, Apr: 59500, May: 59500, Jun: 59500, Jul: 59500, Aug: 59500, Sep: 59500, Oct: 59500, Nov: 59500, Dec: 59500, Jan25: 59500, Feb25: 59500, },
        { wrap: true, id: 4, EXECUTIVEe: "John Doe", TYPE: "USA", Feb: 2, Mar: 41500, Apr: 59500, May: 59500, Jun: 59500, Jul: 59500, Aug: 59500, Sep: 59500, Oct: 59500, Nov: 59500, Dec: 59500, Jan25: 59500, Feb25: 59500, },
        { wrap: true, id: 5, EXECUTIVEe: "John Doe", TYPE: "USA", Feb: 2, Mar: 41500, Apr: 59500, May: 59500, Jun: 59500, Jul: 59500, Aug: 59500, Sep: 59500, Oct: 59500, Nov: 59500, Dec: 59500, Jan25: 59500, Feb25: 59500, },
        { wrap: true, id: 6, EXECUTIVEe: "John Doe", TYPE: "USA", Feb: 2, Mar: 41500, Apr: 59500, May: 59500, Jun: 59500, Jul: 59500, Aug: 59500, Sep: 59500, Oct: 59500, Nov: 59500, Dec: 59500, Jan25: 59500, Feb25: 59500, },
        { wrap: true, id: 7, EXECUTIVEe: "John Doe", TYPE: "USA", Feb: 2, Mar: 41500, Apr: 59500, May: 59500, Jun: 59500, Jul: 59500, Aug: 59500, Sep: 59500, Oct: 59500, Nov: 59500, Dec: 59500, Jan25: 59500, Feb25: 59500, },
        { wrap: true, id: 8, EXECUTIVEe: "John Doe", TYPE: "USA", Feb: 2, Mar: 41500, Apr: 59500, May: 59500, Jun: 59500, Jul: 59500, Aug: 59500, Sep: 59500, Oct: 59500, Nov: 59500, Dec: 59500, Jan25: 59500, Feb25: 59500, },
        { wrap: true, id: 9, EXECUTIVEe: "John Doe", TYPE: "USA", Feb: 2, Mar: 41500, Apr: 59500, May: 59500, Jun: 59500, Jul: 59500, Aug: 59500, Sep: 59500, Oct: 59500, Nov: 59500, Dec: 59500, Jan25: 59500, Feb25: 59500, },
        { wrap: true, id: 10, EXECUTIVEe: "John Doe", TYPE: "USA", Feb: 2, Mar: 41500, Apr: 59500, May: 59500, Jun: 59500, Jul: 59500, Aug: 59500, Sep: 59500, Oct: 59500, Nov: 59500, Dec: 59500, Jan25: 59500, Feb25: 59500, },
        { wrap: true, id: 11, EXECUTIVEe: "John Doe", TYPE: "USA", Feb: 2, Mar: 41500, Apr: 59500, May: 59500, Jun: 59500, Jul: 59500, Aug: 59500, Sep: 59500, Oct: 59500, Nov: 59500, Dec: 59500, Jan25: 59500, Feb25: 59500, },
        { wrap: true, id: 12, EXECUTIVEe: "John Doe", TYPE: "USA", Feb: 2, Mar: 41500, Apr: 59500, May: 59500, Jun: 59500, Jul: 59500, Aug: 59500, Sep: 59500, Oct: 59500, Nov: 59500, Dec: 59500, Jan25: 59500, Feb25: 59500, },
        { wrap: true, id: 13, EXECUTIVEe: "John Doe", TYPE: "USA", Feb: 2, Mar: 41500, Apr: 59500, May: 59500, Jun: 59500, Jul: 59500, Aug: 59500, Sep: 59500, Oct: 59500, Nov: 59500, Dec: 59500, Jan25: 59500, Feb25: 59500, },
        { wrap: true, id: 14, EXECUTIVEe: "John Doe", TYPE: "USA", Feb: 2, Mar: 41500, Apr: 59500, May: 59500, Jun: 59500, Jul: 59500, Aug: 59500, Sep: 59500, Oct: 59500, Nov: 59500, Dec: 59500, Jan25: 59500, Feb25: 59500, },
        { wrap: true, id: 15, EXECUTIVEe: "John Doe", TYPE: "USA", Feb: 2, Mar: 41500, Apr: 59500, May: 59500, Jun: 59500, Jul: 59500, Aug: 59500, Sep: 59500, Oct: 59500, Nov: 59500, Dec: 59500, Jan25: 59500, Feb25: 59500, },
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
            <div className='turnover-statement-per-executive-wise-main'>
                <h3 >Turnover Statement - Proforma Invoice Executive Wise</h3>

                {/* Search Input */}
                <div className="turnover-statement-per-executive-wise-main-inputs">
                    {/* <div className="turnover-statement-per-executive-wise-main-inputs-search">
                    </div> */}
                    <div className="turnover-statement-per-executive-wise-main-inputs-paramtr">
                        <form action="" className="col-12">
                            <div className="turnover-statement-per-executive-wise-main-inputs-paramtr-flex row mb-3">

                                <div className="turnover-statement-per-executive-wise-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    <input type="text" placeholder="Executive Name" value={search} onChange={handleSearch} className="form-control form-control-sm" />
                                </div>

                                {/* <!-- Select Country --> */}
                                <div className="turnover-statement-per-executive-wise-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    <select className="form-control form-control-sm" name="user">
                                        <option value="volvo">All Users</option>
                                        <option value="saab">Afatab</option>
                                        <option value="saab">Imtiaz</option>
                                        <option value="saab">Shadab</option>
                                        <option value="saab">Abhishek</option>
                                        <option value="saab">Shahzad</option>
                                    </select>
                                </div>

                                {/* <!-- Start Date --> */}
                                <div className="turnover-statement-per-executive-wise-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    {/* <label for="start-date" className="form-label">Start</label> */}
                                    <input type="date" className="form-control form-control-sm" name="start" id="start-date" />
                                </div>

                                {/* <!-- End Date --> */}
                                <div className="turnover-statement-per-executive-wise-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    {/* <label for="end-date" className="form-label">End</label> */}
                                    <input type="date" className="form-control form-control-sm" name="end" id="end-date" />
                                </div>

                                {/* <!-- Submit Button --> */}
                                <div className="turnover-statement-per-executive-wise-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
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

export default TurnoverStatementProformExecutiveWise