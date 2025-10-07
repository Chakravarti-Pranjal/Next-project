import React,{ useContext, useEffect,useState } from 'react';
// import "./CityWiseBookingRep.css";
import ReportTable from '../ReportTable/ReportTable';
import { axiosOther } from '../../../../../http/axios_base_url';
import { ThemeContext } from '../../../../../context/ThemeContext';
import { table_custom_style } from '../../../../../css/custom_style';
import { CSVLink } from "react-csv";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import DataTable from 'react-data-table-component';
import { MdNavigateNext, MdOutlineSkipNext, MdOutlineSkipPrevious } from 'react-icons/md';
import { GrFormPrevious } from 'react-icons/gr';

function CityWiseBookingRep() {
    const [reportShow,setReportShow] = useState(false)
    const [AgentTurn,setAgentTurn] = useState([])
    const { background } = useContext(ThemeContext);
    const [search,setSearch] = useState("");
    const [filteredData,setFilteredData] = useState([]);
    const [loading,setLoading] = useState(true);
    const [filterValue,setFilterValue] = useState([]);
    const [totalPage,setTotalPage] = useState("");
    const [error,setError] = useState(null);
    const [currentPage,setCurrentPage] = useState(1);
    const [rowsPerPage,setRowsPerPage] = useState(10);
    const [destOption, setDestOption] = useState([])

    const getListDataToServer = async () => {
        try {
            setLoading(true);
            setError(null);

            const { data } = await axiosOther.post("citywiseReport",{
                QuotationNumber: "",
                DestinationName: "",
                FromDate: "",
                ToDate: "",
                page: currentPage,
                perPage: rowsPerPage,
            });
            console.log("222",data);
            setTotalPage(data.TotalPages || 10);
            setFilteredData(data.DataList);
            setFilterValue(data.DataList);
            setRowsPerPage(data.PerPage);

            if (data?.DataList) {
                // Add serial numbers and process data
                const processedData = data.DataList.map((item,index) => ({
                    ...item,
                    id: index + 1,
                }));

            } else {
                setError("No data received from API");
                setAgentTurn([]);
                setFilteredData([]);
            }
        } catch (error) {
            console.log("feedback-error",error);
            setError("Failed to fetch data: " + error.message);
            setAgentTurn([]);
            setFilteredData([]);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        getListDataToServer();
    },[rowsPerPage,currentPage]);


    const table_columns = [
        {
            wrap: true,
            name: "S.No",
            selector: (row,index) => index,
            cell: (row,index) => (
                <span>{(currentPage - 1) * rowsPerPage + index + 1}</span>
            ),
            sortable: false
        }
        ,
        {
            wrap: true,
            name: "Tour Id",
            selector: row => row.TOURID,
            cell: row => <span>{row.TourId}</span>,
            sortable: true,
            width: "6rem",
        },
        {
            wrap: true,
            name: "Date",
            selector: row => row.DATe,
            cell: row => <span>{row.Date}</span>,
            sortable: true,
            width: "8rem",
        },
        {
            wrap: true,
            name: "Mode",
            selector: row => row.MODe,
            cell: row => <span>{row.Mode}</span>,
            sortable: true,
            width: "6rem",
        },
        {
            wrap: true,
            name: "Vehicle Type",
            selector: row => row.VehicleType,
            cell: row => <span>{row.VehicleType}</span>,
            sortable: true,
            width: "10rem",
        },
        {
            wrap: true,
            name: "Destination",
            selector: row => row.DestinationName,
            cell: row => <span>{row.DestinationName}</span>,
            sortable: true
        },
        {
            wrap: true,
            name: "Lead Pax Name",
            selector: row => row.LeadPax,
            cell: row => <span>{row.LeadPax}</span>,
            sortable: true,
            width: "10rem",
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
            name: "Ope Person",
            selector: row => row.TotalPax,
            cell: row => <span>{row.TotalPax}</span>,
            sortable: true
        },
   
    ];


    const [searchInput, setSearchInput] = useState("");
    // const [filteredData, setFilteredData] = useState(rows);
    const [destination, setDestination] = useState("");

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const searchTerm = searchInput.toLowerCase();

        const filteredRows = filteredData.filter(row => {
            const matchesSearch = row.TOURID.toLowerCase().includes(searchTerm) ||
                row.DATe.toLowerCase().includes(searchTerm) ||
                row.MODe.toLowerCase().includes(searchTerm) ||
                row.VEHICLETYPe.toLowerCase().includes(searchTerm) ||
                row.DESTINATIOn.toLowerCase().includes(searchTerm) ||
                row.LEADPAXNAMe.toLowerCase().includes(searchTerm) ||
                row.OperationPerson.toLowerCase().includes(searchTerm) ||
                row.TotalPax.toString().includes(searchTerm);

            const matchesDestination = destination ? row.DESTINATIOn === destination : true;
            console.log("matchesSearch:", matchesSearch, "matchesDestination:", matchesDestination);
            

            return matchesSearch && matchesDestination;
        });

        setFilteredData(filteredRows);
    };
    const CustomPagination = () => {
        return (
            <div className="d-flex align-items-center border-bottom justify-content-end shadow custom-pagination gap-3 mb-5 py-2">
                <div className="d-flex align-items-center gap-3">
                    <label htmlFor="" className="fs-6">
                        Rows per page
                    </label>
                    <select
                        name="PerPage"
                        id=""
                        className="pagination-select"
                        value={rowsPerPage}
                        onChange={(e) => {
                            handleRowsPerPageChange(e.target.value);
                        }}
                    >
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="30">30</option>
                        <option value="40">40</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                </div>
                <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="pagination-button"
                >
                    <MdOutlineSkipPrevious />
                </button>
                <button
                    onClick={() =>
                        handlePageChange(currentPage > 1 ? currentPage - 1 : 1)
                    }
                    disabled={currentPage === 1}
                    className="pagination-button"
                >
                    <GrFormPrevious />
                </button>
                <span className="text-light">
                    {currentPage} of {totalPage}
                </span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage == totalPage}
                    className="pagination-button"
                >
                    <MdNavigateNext />
                </button>
                <button
                    onClick={() => handlePageChange(totalPage)}
                    disabled={currentPage == totalPage}
                    className="pagination-button"
                >
                    <MdOutlineSkipNext />
                </button>
            </div>
        );
    };
    const handleRowsPerPageChange = (newRowsPerPage) => {
        setRowsPerPage(newRowsPerPage);
    };
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    const handleDownloadPDF = () => {
        // if (!rows || rows.length === 0) return;

        // const doc = new jsPDF();
        // doc.text("Agent Turnover Report", 14, 10);

        // // 🔹 Generate dynamic headers
        // const keys = Object.keys(rows[0]);
        // const head = [keys.map(key =>
        //     key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())
        // )];

        // // 🔹 Generate dynamic rows
        // const body = rows.map(row => keys.map(key => row[key]));

        // doc.autoTable({
        //     head,
        //     body,
        //     startY: 20
        // });

        // doc.save("Report.pdf");
    };
    const handleCopy = () => {
        // if (!rows || rows.length === 0) return;

        // const keys = Object.keys(rows[0]);

        // // 🔹 Generate header row
        // const header = keys.map(key =>
        //     key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())
        // ).join("\t");

        // // 🔹 Generate row values
        // const textData = rows
        //     .map(row => keys.map(key => row[key]).join("\t"))
        //     .join("\n");

        // // 🔹 Copy to clipboard
        // navigator.clipboard
        //     .writeText(`${header}\n${textData}`)
        //     .then(() => alert("Table data copied to clipboard!"))
        //     .catch(err => alert("Failed to copy: " + err));
    };


    return (
        <>
            <div className='city-wise-book-rep-main'>
                <h3>City Wise Booking Report</h3>

                <div className="city-wise-book-rep-main-inputs">
                    <form className="col-12" onSubmit={handleFormSubmit}>
                        <div className="city-wise-book-rep-main-inputs-paramtr-flex row mb-3">

                            {/* Search Input */}
                            <div className="city-wise-book-rep-main-inputs-search col-6 col-lg-2 mt-2">
                                <input
                                    type="text"
                                    placeholder="Search by name..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    className="form-control form-control-sm"
                                />
                            </div>
                            <div className="city-wise-book-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                <select
                                    className="form-control form-control-sm"
                                    name="audit"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)} // ✅ handle change
                                >
                                    <option value="">Destination</option>
                                    <option value="Delhi">Delhi</option>
                                    <option value="Agra">Agra</option>
                                    <option value="Mumbai">Mumbai</option>
                                    <option value="Jaipur">Jaipur</option>
                                </select>
                            </div>

                            {/* Start Date */}
                            <div className="city-wise-book-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                <input type="date" className="form-control form-control-sm" name="start" id="start-date" />
                            </div>

                            {/* End Date */}
                            <div className="city-wise-book-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                <input type="date" className="form-control form-control-sm" name="end" id="end-date" />
                            </div>

                            {/* Submit Button */}
                            <div className="city-wise-book-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                                <button type="submit" className="btn btn-primary btn-custom-size flex-shrink-0 flex-grow-0"> <i className='fa-brands fa-searchengin me-2'></i> Search</button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* <ReportTable rows={filteredData} columns={columns} /> */}
                {/* paginationRowsPerPageOptions={[5,10,15,20,25]} /> */}
                <DataTable
                    columns={table_columns}
                    data={filterValue}
                    sortIcon={<i className="fa-solid fa-sort fs-4"></i>}
                    striped
                    paginationServer
                    highlightOnHover
                    customStyles={table_custom_style(background)}
                    paginationTotalRows={4}
                    defaultSortFieldId="queryDate" // this is the id from above
                    defaultSortAsc={false} // descending = latest first
                    className="custom-scrollbar"
                />
                <CustomPagination />
                <div className="agentTurnover-main-downld-btns">
                    <div className="btn btn-primary btn-custom-size d-flex justify-content-between align-items-center gap-2" onClick={handleCopy}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" width="18" viewBox="0 0 448 512"><path d="M208 0L332.1 0c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9L448 336c0 26.5-21.5 48-48 48l-192 0c-26.5 0-48-21.5-48-48l0-288c0-26.5 21.5-48 48-48zM48 128l80 0 0 64-64 0 0 256 192 0 0-32 64 0 0 48c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 176c0-26.5 21.5-48 48-48z" /></svg> <span className="text-white">Copy</span>
                    </div>
                    <div className="btn btn-primary btn-custom-size d-flex justify-content-between align-items-center gap-3">
                        <CSVLink
                            data={[]}
                            headers={[]}
                            filename="Agent_Turnover_Report.csv"
                            className=""
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" width="17" viewBox="0 0 384 512">
                                <path d="M48 448L48 64c0-8.8 7.2-16 16-16l160 0 0 80c0 17.7 14.3 32 32 32l80 0 0 288c0 8.8-7.2 16-16 16L64 464c-8.8 0-16-7.2-16-16zM64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-293.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0L64 0zm90.9 233.3c-8.1-10.5-23.2-12.3-33.7-4.2s-12.3 23.2-4.2 33.7L161.6 320l-44.5 57.3c-8.1 10.5-6.3 25.5 4.2 33.7s25.5 6.3 33.7-4.2L192 359.1l37.1 47.6c8.1 10.5 23.2 12.3 33.7 4.2s12.3-23.2 4.2-33.7L222.4 320l44.5-57.3c8.1-10.5 6.3-25.5-4.2-33.7s-25.5-6.3-33.7 4.2L192 280.9l-37.1-47.6z" />
                            </svg> <span className="text-white ">Excel</span>
                        </CSVLink>
                    </div>
                    <div className="btn btn-primary btn-custom-size d-flex justify-content-between align-items-center gap-3" onClick={handleDownloadPDF}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" width="20" viewBox="0 0 512 512"><path d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 144-208 0c-35.3 0-64 28.7-64 64l0 144-48 0c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128zM176 352l32 0c30.9 0 56 25.1 56 56s-25.1 56-56 56l-16 0 0 32c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-48 0-80c0-8.8 7.2-16 16-16zm32 80c13.3 0 24-10.7 24-24s-10.7-24-24-24l-16 0 0 48 16 0zm96-80l32 0c26.5 0 48 21.5 48 48l0 64c0 26.5-21.5 48-48 48l-32 0c-8.8 0-16-7.2-16-16l0-128c0-8.8 7.2-16 16-16zm32 128c8.8 0 16-7.2 16-16l0-64c0-8.8-7.2-16-16-16l-16 0 0 96 16 0zm80-112c0-8.8 7.2-16 16-16l48 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0 0 32 32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0 0 48c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-64 0-64z" /></svg>
                        <span className="text-white">Pdf</span>
                    </div>
                    <div className="btn btn-primary btn-custom-size d-flex justify-content-between align-items-center gap-3" onClick={handleDownloadPDF}>
                        <i className="fa-solid fa-print text-white fs-4"></i>
                        <span className="text-white">Print</span>
                    </div>
                    <div className="btn btn-primary btn-custom-size d-flex justify-content-between align-items-center gap-3">
                        <a
                            href="https://wa.me/YOUR_PHONE_NUMBER?text=Hello!"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <i className="fa-brands fa-whatsapp text-white me-1 fs-4 "></i>
                            <span className="text-white">Whatsapp</span>
                        </a>
                    </div>
                    <div
                        className="btn btn-primary btn-custom-size d-flex justify-content-between align-items-center gap-2"
                        role="button"
                        tabIndex={0}
                        aria-label="Send email"
                        onClick={() => window.location.href = "mailto:?subject=Your Subject Here&body=Your message here"}
                    >
                        <i className="fa-solid fa-envelope text-white fs-4"></i>
                        <span>Email</span>
                    </div>

                </div>
            </div>
        </>
    );
}

export default CityWiseBookingRep;
