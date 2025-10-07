
import { useRef, useEffect, useState } from "react";
import { HiPrinter } from "react-icons/hi2";
import { axiosOther } from "../../../../http/axios_base_url";

const CompactToiurCard = ({ setActiveTab }) => {
    const iframeRef = useRef(null);
    const [iframeUrl, setIframeUrl] = useState("");
    const [iframeHtml, setIframeHtml] = useState("");
    const queryQuotation = JSON.parse(localStorage.getItem("Query_Qoutation"));

    console.log(iframeUrl, "iframeUrl");


    useEffect(() => {
        const fetchTourStatusUrl = async () => {
            try {
                const QuotationNumber = queryQuotation?.QoutationNum?.trim().endsWith("Final")
                    ? queryQuotation.QoutationNum
                    : `${queryQuotation.QoutationNum} Final`;

                const payload = {
                    QueryId: queryQuotation?.QueryID,
                    QuotationNumber: QuotationNumber
                };

                const response = await axiosOther.post("compactTourStatusTemplate", payload);
                if (response?.data?.Status === 1 && response?.data?.TemplateUrl) {
                    setIframeUrl(response.data.TemplateUrl);
                    setIframeHtml(response.data.TemplateHtml);
                } else {
                    console.error("URL not found in API response", response.data);
                }
            } catch (error) {
                console.error("Error fetching iframe URL:", error);
            }
        };

        fetchTourStatusUrl();
    }, []);

    // const handlePrint = async () => {
    //     if (!iframeUrl) return;

    //     try {
    //         const response = await fetch(iframeUrl);
    //         const htmlContent = await response.text();

    //         const printWindow = window.open("", "", "width=900,height=700");
    //         printWindow.document.open();
    //         printWindow.document.write(htmlContent);
    //         printWindow.document.close();
    //         printWindow.focus();

    //         printWindow.onload = () => {
    //             printWindow.print();
    //             printWindow.close();
    //         };
    //     } catch (error) {
    //         console.error("Failed to print:", error);
    //     }
    // };

    const handlePrint = async () => {
        if (!iframeUrl) return;

        try {
            // Send HTML content to the compacttourcardpdffile endpoint
            const payload = { html: iframeHtml };
            const pdfResponse = await axiosOther.post("compacttourcardpdffile", payload);

            if (pdfResponse?.data?.status && pdfResponse?.data?.pdf_url) {
                // Open PDF in a new tab
                window.open(pdfResponse.data.pdf_url, "_blank");
            } else {
                console.error("PDF URL not found in API response", pdfResponse.data);
            }
        } catch (error) {
            console.error("Failed to open PDF:", error);
        }
    };



    return (
        <div>
            <div className="d-flex justify-content-end gap-3 mb-2">
                <button className="btn btn-dark btn-custom-size" name="SaveButton"
                    onClick={() => setActiveTab("AgentWelcomeLetter")}
                >
                    <span className="me-1">Back</span>
                    <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
                </button>
                <button
                    className="btn btn-primary btn-custom-size "
                    name="SaveButton"
                    onClick={() => setActiveTab("BriffingList")}
                >
                    <span className="me-1">Next</span>
                    <i className="fa-solid fa-forward text-primary bg-white p-1 rounded"></i>
                </button>
            </div>
            {/* Iframe Preview */}
            <iframe
                ref={iframeRef}
                title="Tour Status Document"
                style={{
                    width: "100%",
                    border: "none",
                    background: "#f5f5f5",
                    minHeight: "600px",
                }}
                src={iframeUrl}
            />

            {/* Print Button */}
            <div
                style={{
                    display: "flex",
                    gap: "10px",
                    justifyContent: "end"
                }}
            >
                {iframeUrl && (
                    <button
                        className="btn btn-primary btn-custom-size me-2"
                        onClick={handlePrint}
                    >
                        <HiPrinter style={{ fontSize: "1.5rem", color: "white" }} /> Download Pdf
                    </button>
                )}
            </div>
        </div>
    );
};

export default CompactToiurCard;
