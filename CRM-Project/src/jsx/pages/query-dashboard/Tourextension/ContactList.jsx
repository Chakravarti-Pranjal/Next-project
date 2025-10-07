import { useEffect, useRef, useState } from "react";
import { HiPrinter } from "react-icons/hi2";
import { axiosOther } from "../../../../http/axios_base_url";
import { notifySuccess, notifyError } from "../../../../helper/notify.jsx";

const ContactList = ({ setActiveTab }) => {
    const contentRef = useRef(null);
    const printIframeRef = useRef(null);
    const [htmlContent, setHtmlContent] = useState("");
    const [html, setHtml] = useState("");
    const [isUpdate, setIsUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const queryQuotation = JSON.parse(localStorage.getItem("Query_Qoutation"));
    const CompanyUniqueId = JSON.parse(localStorage.getItem("token"))?.companyKey;

    const updateNewpayload = {
        QueryId: queryQuotation?.QueryID,
        QuotationNumber: queryQuotation?.QoutationNum,
        TourId: queryQuotation?.TourId,
        Type: "ContactList"
    };

    const contactListPayload = {
        QueryId: queryQuotation?.QueryID,
        QuotationNumber: queryQuotation?.QoutationNum,
        companyId: CompanyUniqueId
    };

    useEffect(() => {
        const fetchHtml = async () => {
            try {
                setLoading(true);

                const listResponse = await axiosOther.post("list-tour-execution", updateNewpayload);
                console.log(listResponse?.data?.data[0]?.id);

                if (listResponse?.data?.data[0]?.id) {
                    setHtmlContent(listResponse?.data?.data[0]?.Html);
                    setHtml(listResponse?.data?.data[0]);
                } else {
                    const generateResponse = await axiosOther.post("generateContactListHtml", contactListPayload);
                    console.log(generateResponse, "generateResponse");

                    if (generateResponse?.data) {
                        setHtmlContent(generateResponse?.data);
                        setHtml(generateResponse?.data);
                        console.log(generateResponse.data, "generateResponse.data");
                    } else {
                        setError("No HTML content received from generateContactListHtml API");
                    }
                }
            } catch (error) {
                console.error("Error loading HTML:", error);
                setError("Failed to fetch HTML content");
            } finally {
                setLoading(false);
            }
        };

        fetchHtml();
    }, [isUpdate]);

    const handlePrint = () => {
        const printFrame = printIframeRef.current;
        if (printFrame && contentRef.current) {
            const printDoc = printFrame.contentDocument || printFrame.contentWindow.document;
            printDoc.open();
            printDoc.write(`
        <html>
          <head>
            <title>Print Contact List</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; font-size: 14px; }
            </style>
          </head>
          <body>${contentRef.current.innerHTML}</body>
        </html>
      `);
            printDoc.close();
            printFrame.onload = () => {
                printFrame.contentWindow.focus();
                printFrame.contentWindow.print();
            };
        }
    };

    const handleUpdate = async () => {
        const updatedHtml = contentRef.current?.innerHTML;

        const updatePayload = {
            QueryId: queryQuotation?.QueryID,
            QuotationNumber: queryQuotation?.QoutationNum,
            TourId: queryQuotation?.TourId,
            Type: "ContactList",
            Html: updatedHtml,
            Status: 1,
        };

        try {
            const response = await axiosOther.post("save-update-tour-execution", updatePayload);
            if (response?.status === 200) {
                setIsUpdate(true);
                notifySuccess("Contact List updated successfully!");
            }
        } catch (error) {
            console.error("Error updating HTML content:", error);
            alert("Error while updating content");
        }
    };

    const handleDownloadWord = async () => {
        try {
            const content = contentRef.current?.innerHTML;

            const response = await axiosOther.post("contactlistwordfile", {
                html: content
            });

            const downloadUrl = response?.data?.download_url;

            if (downloadUrl) {
                notifySuccess("Word File Download successfully!")
                const link = document.createElement("a");
                link.href = downloadUrl;
                link.download = "Welcome_Letter.doc";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (error) {
            console.error("Error generating Word file:", error);
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-end gap-3">
                <button className="btn btn-dark btn-custom-size" onClick={() => setActiveTab("RoomingList")}>
                    <span className="me-1">Back</span>
                    <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
                </button>
                <button className="btn btn-primary btn-custom-size" onClick={() => setActiveTab("TaskScheduling")}>
                    <span className="me-1">Next</span>
                    <i className="fa-solid fa-forward text-primary bg-white p-1 rounded"></i>
                </button>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div
                ref={contentRef}
                contentEditable
                suppressContentEditableWarning={true}
                style={{
                    border: "1px solid #ccc",
                    padding: "20px",
                    margin: "10px 0",
                    borderRadius: "5px",
                    backgroundColor: "white",
                    overflowY: "auto",
                    fontSize: "0.875rem",
                    color: "#000"
                }}
                dangerouslySetInnerHTML={{ __html: htmlContent }}
            ></div>

            <div style={{ display: "flex", gap: "10px", marginTop: "10px", justifyContent:"end" }}>
                <button className="btn btn-primary btn-custom-size" onClick={handlePrint}>
                    <HiPrinter style={{ fontSize: "1.5rem", marginRight: "5px", fill: "#fff" }} />
                    Print PDF
                </button>
                <button
                    className="btn btn-primary btn-custom-size"
                    onClick={handleDownloadWord}
                >

                    <HiPrinter
                        style={{
                            fontSize: "1.5rem",
                            color: "black",
                            marginRight: "5px",
                            fill: "#fff",
                        }}
                    />
                    Download Word
                </button>
                <button className="btn btn-success btn-custom-size" onClick={handleUpdate}>
                    <i className="fa-solid fa-upload" style={{ marginRight: "5px" }}></i>
                    Save Updates
                </button>
            </div>

            <iframe ref={printIframeRef} title="hidden-print-frame" style={{ display: "none" }} />
        </div>
    );
};

export default ContactList;
