import { useRef, useEffect, useState } from "react";
import { HiPrinter } from "react-icons/hi2";
import { axiosOther } from "../../../../http/axios_base_url";

const TourStatus = ({ opentab }) => {
    const iframeRef = useRef(null);
    const [iframeUrl, setIframeUrl] = useState("");
    const queryQuotation = JSON.parse(localStorage.getItem("Query_Qoutation"));

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

                const response = await axiosOther.post("tourStatusTemplate", payload);
                if (response?.data?.Status === 1 && response?.data?.TemplateUrl) {
                    setIframeUrl(response.data.TemplateUrl);
                } else {
                    console.error("URL not found in API response", response.data);
                }
            } catch (error) {
                console.error("Error fetching iframe URL:", error);
            }
        };

        fetchTourStatusUrl();
    }, []);

    const handlePrint = async () => {
        if (!iframeUrl) return;

        try {
            const response = await fetch(iframeUrl);
            const htmlContent = await response.text();

            const printWindow = window.open("", "", "width=900,height=700");
            printWindow.document.open();
            printWindow.document.write(htmlContent);
            printWindow.document.close();
            printWindow.focus();

            printWindow.onload = () => {
                printWindow.print();
                printWindow.close();
            };
        } catch (error) {
            console.error("Failed to print:", error);
        }
    };

    return (
        <div>
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
            {iframeUrl && (
                <button
                    className="print-button"
                    onClick={handlePrint}
                    style={{
                        padding: "10px 20px",
                        fontSize: "1rem",
                        backgroundColor: "white",
                        border: "1px solid black",
                        borderRadius: "5px",
                        cursor: "pointer",
                        marginBottom: "10px",
                        marginTop: "0px",
                        display: "block",
                        transition: "background-color 0.3s, border-color 0.3s",
                    }}
                >
                    <HiPrinter style={{ fontSize: "1.5rem", color: "black" }} />
                </button>
            )}
        </div>
    );
};

export default TourStatus;

