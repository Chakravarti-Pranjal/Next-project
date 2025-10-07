import React, { useContext } from "react";
import DataTable from "react-data-table-component";
import { MdOutlineSkipPrevious, MdNavigateNext, MdOutlineSkipNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { table_custom_style } from "../../../../../css/custom_style";
import { ThemeContext } from "../../../../../context/ThemeContext";

const CustomPagination = ({
    rowsPerPage,
    currentPage,
    totalPage,
    onRowsPerPageChange,
    onPageChange,
}) => {
    return (
        <div className="d-flex align-items-center border-bottom justify-content-end shadow custom-pagination gap-3 mb-2 py-2">
            {/* Rows per page */}
            <div className="d-flex align-items-center gap-3">
                <label className="fs-6">Rows per page</label>
                <select
                    className="pagination-select"
                    value={rowsPerPage}
                    onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
                >
                    {[10, 20, 30, 40, 50, 100].map((size) => (
                        <option key={size} value={size}>
                            {size}
                        </option>
                    ))}
                </select>
            </div>

            {/* First */}
            <button
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
                className="pagination-button"
            >
                <MdOutlineSkipPrevious />
            </button>

            {/* Prev */}
            <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="pagination-button"
            >
                <GrFormPrevious />
            </button>

            {/* Page info */}
            <span className="text-light">
                {currentPage} of {totalPage}
            </span>

            {/* Next */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPage}
                className="pagination-button"
            >
                <MdNavigateNext />
            </button>

            {/* Last */}
            <button
                onClick={() => onPageChange(totalPage)}
                disabled={currentPage === totalPage}
                className="pagination-button"
            >
                <MdOutlineSkipNext />
            </button>
        </div>
    );
};

const PaginatedDataTable = ({
    columns,
    rows,
    allRows,
    reportName,
    paginationTotalRows,
    rowsPerPage,
    currentPage,
    totalPage,
    onPageChange,
    onRowsPerPageChange,
    onCopy,
    onDownloadPDF,
    csvData = [],
    csvHeaders = [],
    whatsappNumber = "YOUR_PHONE_NUMBER",
    emailSubject = "Your Subject Here",
    emailBody = "Your message here",
}) => {
    const { background } = useContext(ThemeContext);

    // 📌 PDF Download
    const handleDownloadPDF = () => {
        if (!rows || rows.length === 0) return;

        const doc = new jsPDF();
        doc.text("Agent Turnover Report", 14, 10);

        const keys = Object.keys(rows[0]);
        const head = [
            keys.map((key) =>
                key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
            ),
        ];
        const body = rows.map((row) => keys.map((key) => row[key]));

        doc.autoTable({
            head,
            body,
            startY: 20,
        });

        doc.save("Report.pdf");
    };

    // 📌 Print Function
    const handlePrint = () => {
        if (!rows || rows.length === 0) return;

        const doc = new jsPDF();
        doc.text("Agent Turnover Report", 14, 10);

        const keys = Object.keys(rows[0]);
        const head = [
            keys.map((key) =>
                key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
            ),
        ];
        const body = rows.map((row) => keys.map((key) => row[key]));

        doc.autoTable({
            head,
            body,
            startY: 20,
        });

        // Open in new tab for printing
        const pdfBlob = doc.output("bloburl");
        const printWindow = window.open(pdfBlob, "_blank");
        if (printWindow) {
            printWindow.onload = () => {
                printWindow.focus();
                printWindow.print();
            };
        }
    };

    // 📌 Copy
    const handleCopy = () => {
        if (!rows || rows.length === 0) return;

        const keys = Object.keys(rows[0]);
        const header = keys
            .map((key) =>
                key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
            )
            .join("\t");

        const textData = rows
            .map((row) => keys.map((key) => row[key]).join("\t"))
            .join("\n");

        navigator.clipboard
            .writeText(`${header}\n${textData}`)
            .then(() => alert("Table data copied to clipboard!"))
            .catch((err) => alert("Failed to copy: " + err));
    };

    // 📌 CSV Headers Generator
    const generateCSVHeaders = (data) => {
        if (!data || data.length === 0) return [];
        return Object.keys(data[0]).map((key) => ({
            label: key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()),
            key: key,
        }));
    };

    const csvHeadersFinal = generateCSVHeaders(rows);
    const csvFinalData = allRows ? (allRows.length > 0 ? allRows : []) : (rows.length > 0 ? rows : []);

    // console.log(csvFinalData,"csvHeadersFinal")

    return (
        <>
            <DataTable
                columns={columns}
                data={rows}
                sortIcon={<i className="fa-solid fa-sort fs-4"></i>}
                striped
                paginationServer
                highlightOnHover
                customStyles={table_custom_style(background)}
                paginationTotalRows={paginationTotalRows}
                defaultSortFieldId="queryDate"
                defaultSortAsc={false}
                className="custom-scrollbar"
            />

            {/* Pagination */}
            <CustomPagination
                rowsPerPage={rowsPerPage}
                currentPage={currentPage}
                totalPage={totalPage}
                onRowsPerPageChange={onRowsPerPageChange}
                onPageChange={onPageChange}
            />

            {/* Action Buttons */}
            <div className="agentTurnover-main-downld-btns d-flex align-items-center flex-wrap justify-content-center gap-3 py-2">
                {/* Copy */}
                <div
                    className="btn btn-primary btn-custom-size d-flex justify-content-between align-items-center gap-2"
                    onClick={onCopy || handleCopy}
                >
                    <i className="fa-regular fa-copy text-white fs-5"></i>
                    Copy
                </div>

                {/* CSV */}
                <div className="btn btn-primary btn-custom-size flex-shrink-0 flex-grow-0 ">
                    <CSVLink
                        data={csvFinalData || csvData}
                        headers={csvHeadersFinal || csvHeaders}
                        filename={reportName || "Report.csv"}
                        className="d-flex justify-content-between align-items-center gap-3"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" width="17" viewBox="0 0 384 512">
                            <path d="M48 448L48 64c0-8.8 7.2-16 16-16l160 0 0 80c0 17.7 14.3 32 32 32l80 0 0 288c0 8.8-7.2 16-16 16L64 464c-8.8 0-16-7.2-16-16zM64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-293.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0L64 0zm90.9 233.3c-8.1-10.5-23.2-12.3-33.7-4.2s-12.3 23.2-4.2 33.7L161.6 320l-44.5 57.3c-8.1 10.5-6.3 25.5 4.2 33.7s25.5 6.3 33.7-4.2L192 359.1l37.1 47.6c8.1 10.5 23.2 12.3 33.7 4.2s12.3-23.2 4.2-33.7L222.4 320l44.5-57.3c8.1-10.5 6.3-25.5-4.2-33.7s-25.5-6.3-33.7 4.2L192 280.9l-37.1-47.6z" />
                        </svg> <p style={{ fontSize: "12px", display: "inline" }} className="mb-0 text-white">Excel</p>
                    </CSVLink>
                </div>
                {/* PDF */}
                <div
                    className="btn btn-primary btn-custom-size d-flex justify-content-between align-items-center gap-2"
                    onClick={onDownloadPDF || handleDownloadPDF}
                >
                    <i className="fa-solid fa-file-pdf text-white fs-5"></i>
                    Pdf
                </div>

                {/* Print */}
                <div
                    className="btn btn-primary btn-custom-size d-flex justify-content-between align-items-center gap-2"
                    onClick={handlePrint}
                >
                    <i className="fa-solid fa-print text-white fs-5"></i>
                    Print
                </div>

                {/* WhatsApp */}
                <div className="btn btn-primary btn-custom-size">
                    <a
                        href={`https://wa.me/${whatsappNumber}?text=Hello!`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="d-flex justify-content-between align-items-center gap-2 text-white"
                    >
                        <i className="fa-brands fa-whatsapp fs-4"></i>
                        Whatsapp
                    </a>
                </div>

                {/* Email */}
                <div
                    className="btn btn-primary btn-custom-size d-flex justify-content-between align-items-center gap-2"
                    role="button"
                    tabIndex={0}
                    onClick={() =>
                    (window.location.href = `mailto:?subject=${encodeURIComponent(
                        emailSubject
                    )}&body=${encodeURIComponent(emailBody)}`)
                    }
                >
                    <i className="fa-solid fa-envelope text-white fs-5"></i>
                    Email
                </div>
            </div>
        </>
    );
};

export default PaginatedDataTable;

