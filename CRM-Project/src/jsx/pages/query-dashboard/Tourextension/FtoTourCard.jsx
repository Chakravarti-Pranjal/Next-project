// import { useRef, useEffect } from "react";
// import { HiPrinter } from "react-icons/hi2";

// const FtotourCard = ({ opentab }) => {
//   const iframeRef = useRef(null);

//   useEffect(() => {
//     const iframe = iframeRef.current;
//     if (iframe && iframe.contentWindow) {
//       const adjustIframeHeight = () => {
//         const contentHeight = iframe.contentWindow.document.body.scrollHeight;
//         iframe.style.height = `${contentHeight}px`;
//       };

//       iframe.addEventListener("load", adjustIframeHeight);
//       window.addEventListener("resize", adjustIframeHeight);
//       adjustIframeHeight();

//       return () => {
//         iframe.removeEventListener("load", adjustIframeHeight);
//         window.removeEventListener("resize", adjustIframeHeight);
//       };
//     }
//   }, [opentab]);

//   const fullHtml = `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <title>FTO Tour Card - Indo Asia Tours</title>
//     <style>
//         @media print {
//             @page {
//                 size: A4;
//                 margin: 0;
//             }
//             body {
//                 -webkit-print-color-adjust: exact;
//                 print-color-adjust: exact;
//             }
//             .print-button {
//                 display: none;
//             }
//         }
//         html {
//             font-size: 16px;
//         }
//         body {
//             word-wrap: break-word;
//             line-height: 1.5;
//             font-family: 'arial', sans-serif;
//             font-size: 0.875rem;
//             margin: 0;
//             padding: 10px;
//             background-color: white; /* Light peach background */
//         }
//         .container {
//             display: flex;
//             flex-direction: column;
//             align-items: center;
//             gap: 10px;
//         }
//         table {
//             // table-layout: fixed;
//             border-collapse: collapse;
//             font-family: 'Outfit', sans-serif;
//             font-size: 0.875rem;
//             // width: 42rem;
//             max-width: 794px;
//             margin: 0 auto;
//             border: 1px solid #000;
//         }
//         th, td {
//             border: 1px solid #000;
//             padding: 18px;
//             text-align: center;
//         }
//         th {
//             background-color: #f2f2f2;
//         }
//         .highlight {
//             color: purple;
//         }
//         .print-button {
//             padding: 10px 20px;
//             font-size: 1rem;
//             background-color: white;
//             border: 1px solid black;
//             border-radius: 5px;
//             cursor: pointer;
//             margin-bottom: 10px;
//             transition: background-color 0.3s, border-color 0.3s;
//             align-self: flex-end;
//             margin-right: 55px;
//         }
//         .print-button:hover {
//             background-color: #f0f0f0;
//             border-color: #da1e4d;
//         }
//         .print-icon::before {
//             content: "\\1F5A8";
//             font-size: 1.5rem;
//             color: black;
//         }
//         @media screen and (max-width: 600px) {
//             table {
//                 max-width: 100%;
//                 padding: 0 10px;
//             }
//             p {
//                 font-size: 0.8rem;
//             }
//         }
//     </style>
// </head>
// <body>
//     <div class="container">
//         <h5 style="text-align: center; font-weight: normal; font-size: 1.5rem; color: #da1e4d; margin: 0; font-style: italic; color:#d03fa1; margin-top: 10px; ">Booking Status for <br/> Rohit</h5>
//         <p style="text-align: center; font-size: 1rem; font-weight: bold; margin: 0px 0 13px 0; font-style: italic; ">India: 16th December 2024 - 24th December 2024</p>
//         <div style="text-align:cneter;">
//         <p class="highlight" style="font-size: 0.9rem; margin: 0; text-decoration: underline; font-weight: 600px;">Hotel Status: (Selected Rooms) 1 Single, 1 Double</p>

//         <table>
//             <tr style="color:#d03fa1; background-color: ededed;">
//                 <th>City</th>
//                 <th>Hotel</th>
//                 <th>Check-in</th>
//                 <th>Check-out</th>
//                 <th>Status</th>
//             </tr>
//             <tr>
//                 <td>Delhi</td>
//                 <td>Crowne Plaza New Delhi Okhla <br/> <strong>(Deluxe room)</strong></td>
//                 <td>16 Dec 2024</td>
//                 <td>17 Dec 2024</td>
//                 <td> <strong>Confirmed</strong> </td>
//             </tr>
//             <tr>
//                 <td>Delhi</td>
//                 <td>Crowne Plaza New Delhi Okhla <br/> <strong>(Deluxe room)</strong></td>
//                 <td>17 Dec 2024</td>
//                 <td>18 Dec 2024</td>
//                 <td> <strong>Confirmed</strong> </td>
//             </tr>
//             <tr>
//                 <td>Ranthambore</td>
//                 <td>Anuraga Palace Luxury Resort & <br/> Spa <strong>(Deluxe room)</strong></td>
//                 <td>18 Dec 2024</td>
//                 <td>19 Dec 2024</td>
//                 <td> <strong>Pending</strong> </td>
//             </tr>
//             <tr>
//                 <td>Ranthambore</td>
//                 <td>Anuraga Palace Luxury Resort & <br/> Spa <strong>(Deluxe room)</strong></td>
//                 <td>19 Dec 2024</td>
//                 <td>20 Dec 2024</td>
//                 <td><strong>Pending</strong></td>
//             </tr>
//             <tr>
//                 <td>Jaipur</td>
//                 <td>Alsisar Haveli <br/> <strong>(Standard Room)</strong></td>
//                 <td>20 Dec 2024</td>
//                 <td>21 Dec 2024</td>
//                 <td><strong>Confirmed</strong> </td>
//             </tr>
//             <tr>
//                 <td>Jaipur</td>
//                 <td>Alsisar Haveli <br/> <strong>(Standard Room)</strong></td>
//                 <td>21 Dec 2024</td>
//                 <td>22 Dec 2024</td>
//                 <td><strong>Confirmed</strong></td>
//             </tr>
//             <tr>
//                 <td>Agra</td>
//                 <td>Atulya Taj <br/> <strong>(Deluxe Room)</strong></td>
//                 <td>22 Dec 2024</td>
//                 <td>23 Dec 2024</td>
//                 <td><strong>Confirmed</strong></td>
//             </tr>
//             <tr>
//                 <td>Delhi</td>
//                 <td>Ahuja Residency DELHI <br/> <strong>(Deluxe Room)</strong></td>
//                 <td>23 Dec 2024</td>
//                 <td>24 Dec 2024</td>
//                 <td><strong>Confirmed</strong></td>
//             </tr>
//             <tr>
//                 <td>Delhi</td>
//                 <td>Ahuja Residency DELHI <br/> <strong>(Deluxe Room)</strong></td>
//                 <td>24 Dec 2024</td>
//                 <td>25 Dec 2024</td>
//                 <td> <strong>Confirmed</strong> </td>
//             </tr>
//         </table>
//         <div style="display: flex; flex-direction: column; align-items: end;">
//         <ul style="list-style-type: disc; width: 650px;">
//         <li >Accommodation in a double room on room with breakfast at all hotels <span style="font-weight: bold;" >(buffet or fixed menu breakfast in the restaurant)</span></li>
//         <li>Transfers, sightseeing and excursions as per programme using an air-conditioned Toyota Innova at all places</li>
//         </ul>
//         </div>
//         </div>
//         <p style="font-weight: bold; text-align: center;">PLEASE NOTE ALL FLIGHT/TRAIN TIMINGS ARE SUBJECT TO CHANGE.</p>
//     </div>
// </body>
// </html>
// `;

//   return (
//     <div>
//       <iframe
//         ref={iframeRef}
//         title="Booking Status"
//         style={{
//           width: "100%",
//           border: "none",
//           background: "#fff5e6",
//         }}
//         srcDoc={fullHtml}
//       />

//       <button
//         className="print-button"
//         onClick={() => iframeRef.current.contentWindow.print()}
//         style={{
//           padding: "10px 20px",
//           fontSize: "1rem",
//           backgroundColor: "white",
//           border: "1px solid black",
//           borderRadius: "5px",
//           cursor: "pointer",
//           marginBottom: "10px",
//           marginTop: "0px",
//           marginRight: "0",
//           display: "block",
//           transition: "background-color 0.3s, border-color 0.3s",
//         }}
//       >
//         <HiPrinter style={{ fontSize: "1.5rem", color: "black" }} />
//       </button>
//     </div>
//   );
// };

// export default FtotourCard;

import { useRef, useEffect, useState } from "react";
import { HiPrinter } from "react-icons/hi2";
import { axiosOther } from "../../../../http/axios_base_url";

const FtotourCard = ({ opentab }) => {
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

                const response = await axiosOther.post("bookingStatusTemplate", payload);
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

export default FtotourCard;
