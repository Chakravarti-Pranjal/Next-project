import React, { useState } from 'react'
// import "./FixDepartureRep.css"
import ReportTable from '../ReportTable/ReportTable';
import PaginatedDataTable from '../ReportTable/PaginatedDataTable';


function FixDepartureRep() {
    // Table Columns
    const columns = [
        {
            wrap: true,
            name: "SN",
            selector: row => row.SN,
            cell: row => <span>{row.SN}</span>,
            sortable: true,
            width: "6rem",

        },
        {
            wrap: true,
            name: "Fixed Departure Name",
            selector: row => row.FixedDepartureName,
            cell: row => <span>{row.FixedDepartureName}</span>,
            sortable: true,
            width: "12rem",
        },
        {
            wrap: true,
            name: "Fixed Departure Id",
            selector: row => row.FixedDepartureId,
            cell: row => <span>{row.FixedDepartureId}</span>,
            sortable: true,
            width: "12rem",
        },
        {
            wrap: true,
            name: "From Date",
            selector: row => row.FromDate,
            cell: row => <span>{row.FromDate}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "To Date",
            selector: row => row.ToDate,
            cell: row => <span>{row.ToDate}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Room Type",
            selector: row => row.RoomType,
            cell: row => <span>{row.RoomType}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Total Rooms",
            selector: row => row.TotalRooms,
            cell: row => <span>{row.TotalRooms}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Booked Rooms",
            selector: row => row.BookedRooms,
            cell: row => <span>{row.BookedRooms}</span>,
            sortable: true,
            width: "10rem",
        },
        {
            wrap: true,
            name: "Remaining Rooms",
            selector: row => row.RemainingRooms,
            cell: row => <span>{row.RemainingRooms}</span>,
            sortable: true,
            width: "11rem",
        },
        {
            wrap: true,
            name: "Total Pax",
            selector: row => row.TotalPax,
            cell: row => <span>{row.TotalPax}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Booked Pax",
            selector: row => row.BookedPax,
            cell: row => <span>{row.BookedPax}</span>,
            sortable: true,
            width: "10rem",
        },
        {
            wrap: true,
            name: "Remaining Pax",
            selector: row => row.RemainingPax,
            cell: row => <span>{row.RemainingPax}</span>,
            sortable: true,
            width: "10rem",
        },
        {
            wrap: true,
            name: "Status",
            selector: row => row.Status,
            cell: row => <span>{row.Status}</span>,
            sortable: true
        }
    ];

    // Table Data
    const rows = [
        { SN: 1, FixedDepartureName: "aa", FixedDepartureId: "aa ", FromDate: "aa", ToDate: "aa", RoomType: "aa", TotalRooms: "aa", BookedRooms: "aa", RemainingRooms: "aa", TotalPax: "aa", BookedPax: "aa", RemainingPax: "aa", Status: "aa", },
        { SN: 2, FixedDepartureName: "aa", FixedDepartureId: "aa ", FromDate: "aa", ToDate: "aa", RoomType: "aa", TotalRooms: "aa", BookedRooms: "aa", RemainingRooms: "aa", TotalPax: "aa", BookedPax: "aa", RemainingPax: "aa", Status: "aa", },
        { SN: 3, FixedDepartureName: "aa", FixedDepartureId: "aa ", FromDate: "aa", ToDate: "aa", RoomType: "aa", TotalRooms: "aa", BookedRooms: "aa", RemainingRooms: "aa", TotalPax: "aa", BookedPax: "aa", RemainingPax: "aa", Status: "aa", },
        { SN: 4, FixedDepartureName: "aa", FixedDepartureId: "aa ", FromDate: "aa", ToDate: "aa", RoomType: "aa", TotalRooms: "aa", BookedRooms: "aa", RemainingRooms: "aa", TotalPax: "aa", BookedPax: "aa", RemainingPax: "aa", Status: "aa", },
        { SN: 5, FixedDepartureName: "aa", FixedDepartureId: "aa ", FromDate: "aa", ToDate: "aa", RoomType: "aa", TotalRooms: "aa", BookedRooms: "aa", RemainingRooms: "aa", TotalPax: "aa", BookedPax: "aa", RemainingPax: "aa", Status: "aa", },
        { SN: 6, FixedDepartureName: "aa", FixedDepartureId: "aa ", FromDate: "aa", ToDate: "aa", RoomType: "aa", TotalRooms: "aa", BookedRooms: "aa", RemainingRooms: "aa", TotalPax: "aa", BookedPax: "aa", RemainingPax: "aa", Status: "aa", },
        { SN: 7, FixedDepartureName: "aa", FixedDepartureId: "aa ", FromDate: "aa", ToDate: "aa", RoomType: "aa", TotalRooms: "aa", BookedRooms: "aa", RemainingRooms: "aa", TotalPax: "aa", BookedPax: "aa", RemainingPax: "aa", Status: "aa", },
        { SN: 8, FixedDepartureName: "aa", FixedDepartureId: "aa ", FromDate: "aa", ToDate: "aa", RoomType: "aa", TotalRooms: "aa", BookedRooms: "aa", RemainingRooms: "aa", TotalPax: "aa", BookedPax: "aa", RemainingPax: "aa", Status: "aa", },
        { SN: 9, FixedDepartureName: "aa", FixedDepartureId: "aa ", FromDate: "aa", ToDate: "aa", RoomType: "aa", TotalRooms: "aa", BookedRooms: "aa", RemainingRooms: "aa", TotalPax: "aa", BookedPax: "aa", RemainingPax: "aa", Status: "aa", },
        { SN: 10, FixedDepartureName: "aa", FixedDepartureId: "aa ", FromDate: "aa", ToDate: "aa", RoomType: "aa", TotalRooms: "aa", BookedRooms: "aa", RemainingRooms: "aa", TotalPax: "aa", BookedPax: "aa", RemainingPax: "aa", Status: "aa", },
        { SN: 11, FixedDepartureName: "aa", FixedDepartureId: "aa ", FromDate: "aa", ToDate: "aa", RoomType: "aa", TotalRooms: "aa", BookedRooms: "aa", RemainingRooms: "aa", TotalPax: "aa", BookedPax: "aa", RemainingPax: "aa", Status: "aa", },
        { SN: 12, FixedDepartureName: "aa", FixedDepartureId: "aa ", FromDate: "aa", ToDate: "aa", RoomType: "aa", TotalRooms: "aa", BookedRooms: "aa", RemainingRooms: "aa", TotalPax: "aa", BookedPax: "aa", RemainingPax: "aa", Status: "aa", },
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
            <div className='fix-departure-rep-main'>
                <h3 >Fixed Departure Report</h3>

                {/* Search Input */}
                <div className="fix-departure-rep-main-inputs">
                    {/* <div className="fix-departure-rep-main-inputs-search">
                    </div> */}
                    <div className="fix-departure-rep-main-inputs-paramtr">
                        <form action="" className="col-12">
                            <div className="fix-departure-rep-main-inputs-paramtr-flex row mb-3">

                                <div className="fix-departure-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    <input type="text" placeholder="Search by name..." value={search} onChange={handleSearch} className="form-control form-control-sm" />

                                </div>
                                {/* <!-- Agent Select --> */}
                                <div className="fix-departure-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    <select className="form-control form-control-sm" name="audit">
                                        <option value="volvo">All Fix Departure</option>
                                        <option value="saab">Query</option>
                                        <option value="mercedes">Quotation</option>
                                        <option value="audi">Invoice</option>
                                        <option value="audi">Voucher</option>
                                    </select>
                                </div>

                                <div className="fix-departure-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    {/* <label for="start-date" className="form-label">Start</label> */}
                                    <input type="text" className="form-control form-control-sm" name="start" placeholder='Fix Departure' />
                                </div>

                                {/* <!-- Start Date --> */}
                                <div className="fix-departure-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    {/* <label for="start-date" className="form-label">Start</label> */}
                                    <input type="date" className="form-control form-control-sm" name="start" id="start-date" />
                                </div>

                                {/* <!-- End Date --> */}
                                <div className="fix-departure-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                    {/* <label for="end-date" className="form-label">End</label> */}
                                    <input type="date" className="form-control form-control-sm" name="end" id="end-date" />
                                </div>

                                {/* <!-- Submit Button --> */}
                                <div className="fix-departure-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
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

export default FixDepartureRep