import React, { useContext, useState } from 'react'
import "./ReportTable.css"
import DataTable from 'react-data-table-component';
import { CSVLink } from "react-csv";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { table_custom_style } from '../../../../../css/custom_style';
import { ThemeContext } from '../../../../../context/ThemeContext';

function ReportTable({ rows, columns }) {
    const { background } = useContext(ThemeContext);

    const customStyles = {
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

    // console.log(rows, "row")
    // Custom Styles for Dark Theme
    // const customStyles = {
    //     table: {
    //         style: {
    //             backgroundColor: "#000",
    //             color: "#fff",
    //         },
    //     },
    //     headCells: {
    //         style: {
    //             backgroundColor: "#222",
    //             color: "#fff",
    //         },
    //     },
    //     // columns:{
    //     //     style: {
    //     //         backgroundColor: "#111",
    //     //         color: "#fff",
    //     //         transition: "background-color 0.3s ease-in-out",
    //     //         minHeight: "30px",  // Set a minimum height for rows
    //     //         // height: "30px", // Adjust height
    //     //         padding: "5px 10px",  // Reduce padding for a more compact row
    //     //         "&:hover": {
    //     //             backgroundColor: "#fff",
    //     //             color: "#000",
    //     //         },
    //     //     },

    //     // },
    //     rows: {
    //         style: {
    //             backgroundColor: "#111",
    //             color: "#fff",
    //             transition: "background-color 0.3s ease-in-out",
    //             minHeight: "30px",  // Set a minimum height for rows
    //             // height: "30px", // Adjust height
    //             padding: "5px 10px",  // Reduce padding for a more compact row
    //             "&:hover": {
    //                 backgroundColor: "#fff",
    //                 color: "#000",
    //             },
    //         },
    //     },
    //     pagination: {
    //         style: {
    //             backgroundColor: "#222",
    //             color: "#fff",
    //         },
    //     },
    // };

    // const csvHeaders = [
    //     { label: "S.NO", key: "id" },
    //     { label: "Country", key: "fullName" },
    //     { label: "Pax", key: "pax" },
    //     { label: "Amount In INR (Incl. Tax)", key: "incl" },
    //     { label: "Amount In INR (Excl. St)", key: "excl" }
    // ];

    // CSV Data (rows ensures search results are downloadable)
    // const csvData = rows.length > 0 ? rows : rows;


    const generateCSVHeaders = (data) => {
        if (!data || data.length === 0) return [];

        return Object.keys(data[0]).map((key) => ({
            label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()), // Format nicely
            key: key,
        }));
    };
    const csvHeaders = generateCSVHeaders(rows);  // rows = your data array
    const csvData = rows.length > 0 ? rows : [];



    // // ✅ COPY Table Data
    // const handleCopy = () => {
    //     const textData = rows.map(row => `${row.id}\t${row.fullName}\t${row.country}\t${row.pax}\t${row.excl}\t${row.incl}`).join("\n");
    //     navigator.clipboard.writeText(`ID\tFull Name\tcountry\tpay\texcl\tincl\n${textData}`)
    //         .then(() => alert("Table data copied to clipboard!"))
    // };

    const handleCopy = () => {
        if (!rows || rows.length === 0) return;

        const keys = Object.keys(rows[0]);

        // 🔹 Generate header row
        const header = keys.map(key =>
            key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())
        ).join("\t");

        // 🔹 Generate row values
        const textData = rows
            .map(row => keys.map(key => row[key]).join("\t"))
            .join("\n");

        // 🔹 Copy to clipboard
        navigator.clipboard
            .writeText(`${header}\n${textData}`)
            .then(() => alert("Table data copied to clipboard!"))
            .catch(err => alert("Failed to copy: " + err));
    };


    // { id: 1, fullName: "John Doe", country: "USA", pax: 2, excl: 41500, incl: 59500 },


    // // ✅ DOWNLOAD PDF Table
    // const handleDownloadPDF = () => {
    //     const doc = new jsPDF();
    //     doc.text("Agent Turnover Report", 14, 10);
    //     doc.autoTable({
    //         head: [["S.No", "Full Name", "country", "pax", "Amount In INR (Incl. TAX)", "Amount In INR (Excl. St)"]],
    //         body: rows.map(row => [row.id, row.fullName, row.country, row.pax, row.excl, row.incl]),
    //         startY: 20
    //     });
    //     doc.save("Agent_Turnover_Report.pdf");
    // };
    const handleDownloadPDF = () => {
        if (!rows || rows.length === 0) return;

        const doc = new jsPDF();
        doc.text("Agent Turnover Report", 14, 10);

        // 🔹 Generate dynamic headers
        const keys = Object.keys(rows[0]);
        const head = [keys.map(key =>
            key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())
        )];

        // 🔹 Generate dynamic rows
        const body = rows.map(row => keys.map(key => row[key]));

        doc.autoTable({
            head,
            body,
            startY: 20
        });

        doc.save("Report.pdf");
    };


    return (
        <>

            < DataTable
                columns={columns}
                data={rows}
                // title="Agent Turnover Report"
                pagination
                customStyles={table_custom_style(background)}// Apply Dark Theme
                className="data-table-wrapper"
                // paginationPerPage={}
             paginationRowsPerPageOptions={[
                        10, 15, 20, 25, 30, 50, 100,
                      ]}
            />


            <div className="agentTurnover-main-downld-btns">
                <div className="btn btn-primary btn-custom-size d-flex justify-content-between align-items-center gap-2" onClick={handleCopy}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" width="18" viewBox="0 0 448 512"><path d="M208 0L332.1 0c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9L448 336c0 26.5-21.5 48-48 48l-192 0c-26.5 0-48-21.5-48-48l0-288c0-26.5 21.5-48 48-48zM48 128l80 0 0 64-64 0 0 256 192 0 0-32 64 0 0 48c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 176c0-26.5 21.5-48 48-48z" /></svg> <span className="text-white">Copy</span>
                </div>
                <div className="btn btn-primary btn-custom-size d-flex justify-content-between align-items-center gap-3">
                    <CSVLink
                        data={csvData}
                        headers={csvHeaders}
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
        </>
    )
}

export default ReportTable