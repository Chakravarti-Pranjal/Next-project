import React, { useEffect, useState } from "react";
// import { axiosOther } from "../../../../../http/axios_base_url";
// import { NavLink,useLocation,useNavigate } from "react-router-dom";
import { Modal, Button, Row, Table, ToastContainer } from "react-bootstrap";
import icon3 from "../../../../images/quotation/icon3.svg";
import quotationlistimg1 from "../../../../images/quotation/quotationlistimg1.svg";
import { axiosOther } from "../../../../http/axios_base_url";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment";
import { formatDate } from "../../../../helper/formatDate";
import useQueryData from "../../../../hooks/custom_hooks/useQueryData";
import { setQoutationData } from "../../../../store/actions/queryAction";
import { useDispatch } from "react-redux";
import DestinationsCard from "../../../components/destinationsCard/DestinationsCard";
import QueryDetailedCard from "../../../components/queryDetailedCard/QueryDetailedCard";

const Costsheet = () => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const [qoutationList, setQoutationList] = useState([]);
  const [queryData, setQueryData] = useState({});
  const [templateUrl, settempurl] = useState([]);
  const [isOpen, setIsOpen] = useState({
    check: false,
    ind: "",
  });
  const { dayServicesCondition } = useSelector((data) => data?.queryReducer);

  const { QueryStatus, TourSummary, QueryInfo, Pax } =
    qoutationList[0] != undefined ? qoutationList[0] : {};
  // const openPopup = async (qoutationData, queryData) => {
  //   console.log(qoutationData?.QuotationNumber, "KJFDHGJKDF");
  //   console.log(queryData?.QueryID, "KJFDHGJKDF2");


  //   const loader = document.createElement("div");
  //   Object.assign(loader.style, {
  //     position: "fixed",
  //     top: 0,
  //     left: 0,
  //     width: "100%",
  //     height: "100%",

  //     zIndex: 9999,
  //     display: "flex",
  //     alignItems: "center",
  //     justifyContent: "center",
  //   });

  //   loader.innerHTML = `
  //       <div class="text-center">
  //         <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
  //           <span class="visually-hidden">Loading...</span>
  //         </div>
  //       </div>
  //     `;

  //   document.body.appendChild(loader);
  //   try {
  //     const response = await axiosOther.post("costsheet-template", {
  //       QueryId: queryData?.QueryID,
  //       QuotationNumber: qoutationData?.QuotationNumber,
  //       TemplateType: "FIT-Costsheet",
  //     });

  //     if (response.status !== 200) {
  //       throw new Error(`API request failed with status ${response.status}`);
  //     }

  //     const templateUrl = response.data?.TemplateUrl;
  //     if (!templateUrl) {
  //       return document.body.removeChild(loader);
  //       throw new Error("Template URL not received from API.");
  //     }

  //     // Create Popup Div
  //     const popupDiv = document.createElement("div");
  //     popupDiv.classList.add("popupWrapperForTheame");
  //     Object.assign(popupDiv.style, {
  //       position: "fixed",
  //       top: "50%",
  //       left: "50%",
  //       transform: "translate(-50%, -50%)",
  //       width: "90%",
  //       height: "90%",
  //       backgroundColor: "rgba(0, 0, 0, 0.5)",
  //       zIndex: 1000,
  //       display: "flex",
  //       flexWrap: "wrap", // Allow items to wrap if needed
  //       alignItems: "flex-start", // Align items at the top
  //       justifyContent: "center",
  //     });
  //     popupDiv.onload = () => {
  //       if (!templateUrl) {
  //         return document.body.removeChild(loader);
  //       }
  //     };

  //     // Create the iframe
  //     const iframe = document.createElement("iframe");
  //     Object.assign(iframe.style, {
  //       width: "100%",
  //       height: "100%",
  //       border: "none",
  //       borderRadius: "10px",
  //       boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
  //       backgroundColor: "white",
  //     });
  //     iframe.onload = () => {
  //       document.body.removeChild(loader);
  //     };

  //     iframe.src = templateUrl;

  //     // Close Button
  //     const closeButton = document.createElement("div");
  //     closeButton.innerHTML = "&times;";
  //     Object.assign(closeButton.style, {
  //       position: "absolute",
  //       top: "10px",
  //       right: "20px",
  //       fontSize: "2rem",
  //       fontWeight: "lighter",
  //       color: "#bd241a",
  //       cursor: "pointer",
  //       zIndex: 1001,
  //     });

  //    // Close Button (Second Version)
  //     const closeButtonAlt = document.createElement("button");
  //     closeButtonAlt.innerText = "Close";
  //     Object.assign(closeButtonAlt.style, {
  //       padding: "0.3125rem 1.25rem",
  //       fontSize: "1rem",
  //       color: "white",
  //       backgroundColor: "#bd241a",
  //       border: "none",
  //       borderRadius: "5px",
  //       cursor: "pointer",
  //       marginRight: "1rem",
  //       // marginLeft:"auto",

  //       // marginLeft: "auto",
  //       // position: "absolute",
  //       // top: "93%",
  //       // left: "92%",
  //     });

  //     // Export Button
  //     const exportButton = document.createElement("button");
  //     exportButton.innerText = "Export Excel";
  //     Object.assign(exportButton.style, {
  //       padding: "0.3125rem 1.25rem",
  //       fontSize: "1rem",
  //       color: "white",
  //       backgroundColor: "#28a745",
  //       border: "none",
  //       borderRadius: "5px",
  //       cursor: "pointer",
  //       marginLeft: "auto",
  //       marginRight: "1rem",
  //       // position: "absolute",
  //       // top: "93%",
  //       // left: "85%",
  //     });

  //     const exportButtonPdf = document.createElement("button");
  //     exportButtonPdf.innerText = "Export Pdf";
  //     Object.assign(exportButtonPdf.style, {
  //       padding: "0.3125rem 1.25rem",
  //       fontSize: "1rem",
  //       color: "white",
  //       backgroundColor: "#28a745",
  //       border: "none",
  //       borderRadius: "5px",
  //       cursor: "pointer",
  //       marginRight: "1rem",
  //       // position: "absolute",
  //       // top: "93%",
  //       // left: "85%",
  //     });

  //     // const exportButton2 = document.createElement("button");
  //     // exportButton2.innerText = "Export";
  //     // Object.assign(exportButton2.style, {
  //     //   padding: "0.3125rem 1.25rem",
  //     //   fontSize: "1rem",
  //     //   color: "white",
  //     //   backgroundColor: "#28a745",
  //     //   border: "none",
  //     //   borderRadius: "5px",
  //     //   cursor: "pointer",
  //     //   // position: "relative",
  //     //   // // display:"flex",
  //     //   // top: "25%",
  //     //   // right: "85%",
  //     // });

  //     // Close Popup Function
  //     const closePopup = () => {
  //       document.body.style.overflow = "auto";
  //       if (document.body.contains(popupDiv)) {
  //         document.body.removeChild(popupDiv);
  //       }
  //     };

  //     closeButton.onclick = closePopup;
  //     closeButtonAlt.onclick = closePopup;

  //     // exportButton.onclick = () => exportTemplate(templateUrl);
  //     // exportButton2.onclick = () => exportTemplate(templateUrl);

  //     exportButton.onclick = () => exportTemplateExcel(templateUrl);
  //     // exportButtonWord.onclick = () => exportTemplateWord(templateUrl);
  //     // exportButton2.onclick = () => exportTemplate(templateUrl);
  //     exportButtonPdf.onclick = () => exportTemplatePdf(templateUrl);

  //     // Append Elements
  //     popupDiv.appendChild(iframe);
  //     popupDiv.appendChild(closeButton);
  //     popupDiv.appendChild(closeButtonAlt);
  //     popupDiv.appendChild(exportButton);
  //     // popupDiv.appendChild(exportButton2);
  //     document.body.appendChild(popupDiv);
  //     document.body.appendChild(popupDiv);
  //     document.body.removeChild(loader);
  //     document.body.style.overflow = "hidden";

  //     // Keydown Event for ESC Key
  //     const keyDownHandler = (event) => {
  //       if (event.key === "Escape") {
  //         closePopup();
  //         document.removeEventListener("keydown", keyDownHandler);
  //       }
  //     };

  //     document.addEventListener("keydown", keyDownHandler);
  //   } catch (error) {
  //     document.body.removeChild(loader);
  //     console.error("Error:", error.response?.data || error.message);
  //     alert("Failed to generate the template. Please try again later.");
  //   }


  //   const exportTemplatePdf = async (templateUrl) => {
  //         try {
  //           const response = await axiosOther.post("createViewPdf", {
  //             url: templateUrl,
  //           });

  //           if (response.status !== 200) {
  //             throw new Error(`API request failed with status ${response.status}`);
  //           }

  //           const { status, pdf_url } = response.data;

  //           if (status && pdf_url) {
  //             // Open the PDF in a new tab
  //             window.open(pdf_url, "_blank");
  //           } else {
  //             alert("PDF generation failed. Please try again.");
  //           }
  //         } catch (error) {
  //           console.error("Error exporting HTML to PDF:", error);
  //           alert("Export failed. Please try again.");
  //         }
  //       };
  //       const exportTemplateExcel = async (templateUrl) => {
  //         try {
  //           const response = await axiosOther.post("createViewExcel", {
  //             url: templateUrl,
  //           });

  //           if (response.status !== 200) {
  //             throw new Error(`API request failed with status ${response.status}`);
  //           }

  //           const { success, excel_url } = response.data;

  //           if (success && excel_url) {
  //             // Trigger download without opening a new tab
  //             const link = document.createElement("a");
  //             link.href = excel_url;
  //             link.download = ""; // optional: specify filename if needed
  //             document.body.appendChild(link);
  //             link.click();
  //             document.body.removeChild(link);
  //           } else {
  //             alert("Excel generation failed. Please try again.");
  //           }
  //         } catch (error) {
  //           console.error("Error exporting HTML to Excel:", error);
  //           alert("Export failed. Please try again.");
  //         }
  //       };
  //   // const exportTemplate = async (templateUrl) => {
  //   //   try {
  //   //     // Send the HTML content to the API
  //   //     const response = await axiosOther.post(
  //   //       "export-html-to-excel",
  //   //       { htmlContent: templateUrl },
  //   //       { responseType: "blob" } // Ensure response is treated as a binary file
  //   //     );

  //   //     // Create a download link for the exported Excel file
  //   //     const blob = new Blob([response.data], {
  //   //       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //   //     });
  //   //     const link = document.createElement("a");
  //   //     link.href = URL.createObjectURL(blob);
  //   //     link.download = "exported_data.xlsx"; // Set the filename
  //   //     document.body.appendChild(link);
  //   //     link.click();
  //   //     document.body.removeChild(link);
  //   //   } catch (error) {
  //   //     console.error("Error exporting HTML to Excel:", error);
  //   //     alert("Export failed. Please try again.");
  //   //   }
  //   // };
  // };


  const openPopup = async (qoutationData, queryData) => {
    const loader = document.createElement("div");
    Object.assign(loader.style, {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    });

    loader.innerHTML = `
    <div class="text-center">
      <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  `;
    document.body.appendChild(loader);

    try {
      const response = await axiosOther.post("costsheet-template", {
        QueryId: queryData?.QueryID,
        QuotationNumber: qoutationData?.QuotationNumber,
        TemplateType: "FIT-Costsheet",
      });

      if (response.status !== 200) throw new Error("Failed to fetch template");

      const templateUrl = response.data?.TemplateUrl;
      settempurl(templateUrl)
      if (!templateUrl) throw new Error("Template URL missing");

      const popupDiv = document.createElement("div");
      popupDiv.classList.add("popupWrapperForTheame");
      Object.assign(popupDiv.style, {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "90%",
        height: "95vh",
        backgroundColor: "white",
        borderRadius: "2rem",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        padding: "1rem",
      });

      const iframe = document.createElement("iframe");
      Object.assign(iframe.style, {
        width: "100%",
        height: "100%",
        border: "none",
        borderRadius: "10px",
        backgroundColor: "white",
      });
      iframe.src = templateUrl;
      iframe.onload = () => document.body.removeChild(loader);

      const closeButton = document.createElement("button");
      closeButton.innerText = "Close";
      Object.assign(closeButton.style, {
        padding: "0.3125rem 1.25rem",
        fontSize: "1rem",
        color: "white",
        backgroundColor: "#bd241a",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      });
      closeButton.onclick = () => {
        document.body.style.overflow = "auto";
        popupDiv.remove();
      };

      const exportExcelBtn = createExportButton("Export Excel", "#28a745", () => exportTemplateExcel(templateUrl));
      const exportPdfBtn = createExportButton("Export PDF", "#007bff", () => exportTemplatePdf(templateUrl));
      const exportWordBtn = createExportButton("Export Word", "#6f42c1", () => exportTemplateWord(templateUrl));

      const buttonWrapper = document.createElement("div");
      Object.assign(buttonWrapper.style, {
        display: "flex",
        justifyContent: "flex-end",
        gap: "1rem",
      });
      buttonWrapper.append(exportExcelBtn, exportPdfBtn, closeButton);

      popupDiv.append(iframe, buttonWrapper);
      document.body.appendChild(popupDiv);
      document.body.style.overflow = "hidden";

      const keyDownHandler = (event) => {
        if (event.key === "Escape") {
          popupDiv.remove();
          document.removeEventListener("keydown", keyDownHandler);
          document.body.style.overflow = "auto";
        }
      };
      document.addEventListener("keydown", keyDownHandler);
    } catch (error) {
      document.body.removeChild(loader);
      console.error("Popup Error:", error.message || error);
      alert("Something went wrong while opening the popup.");
    }
  };

  const createExportButton = (text, bgColor, onClick) => {
    const button = document.createElement("button");
    button.innerText = text;
    Object.assign(button.style, {
      padding: "0.5rem 1rem",
      fontSize: "1rem",
      color: "white",
      backgroundColor: bgColor,
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    });
    button.onclick = onClick;
    return button;
  };

  const exportTemplateExcel = async (templateUrl) => {
    try {
      const response = await axiosOther.post("createViewExcel", { url: templateUrl });
      const { status, download_url } = response.data;

      if (status === 1 && download_url) {
        const link = document.createElement("a");
        link.href = download_url;
        link.download = `costsheet_${Date.now()}.xls`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert("Excel generation failed.");
      }
    } catch (error) {
      console.error("Excel Export Error:", error.message || error);
      alert("Export Excel failed.");
    }
  };

  const exportTemplatePdf = async (templateUrl) => {
    try {
      const response = await axiosOther.post("createViewPdf", { url: templateUrl });
      const { status, pdf_url } = response.data;

      if (status && pdf_url) {
        window.open(pdf_url, "_blank");
      } else {
        alert("PDF generation failed.");
      }
    } catch (error) {
      console.error("PDF Export Error:", error.message || error);
      // alert("Export PDF failed.");
    }
  };

  const exportTemplateWord = async (templateUrl) => {
    try {
      const response = await axiosOther.post("createViewWord", { url: templateUrl });
      const { status, download_url } = response.data;

      if (status && download_url) {
        const link = document.createElement("a");
        link.href = download_url;
        link.download = `document_${Date.now()}.docx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert("Word generation failed.");
      }
    } catch (error) {
      console.error("Word Export Error:", error.message || error);
      alert("Export Word failed.");
    }
  };




  const openCostsheet = async (qoutationData, queryData) => {
    try {
      const response = await axiosOther.post("costsheet-template", {
        QueryId: queryData?.QueryID,
        QuotationNumber: qoutationData?.QuotationNumber,
        TemplateType: "FIT-Costsheet",
      });

      if (response.status !== 200) throw new Error("Failed to fetch template");

      const templateUrl = response.data?.TemplateUrl;
      settempurl(templateUrl)
      if (!templateUrl) throw new Error("Template URL missing");
    } catch (error) {
      console.error("Popup Error:", error.message || error);
      // alert("Something went wrong while opening the popup.");
    }
  };

  const query = useQueryData();
  // Call this function when needed
  // useEffect(() => {
  //   openCostsheet(qoutation, queryData);
  // }, [query]);
  console.log(query, "manish1");



  const getQoutationList = async () => {
    setQueryData(query?.QueryAllData);
    try {
      const { data } = await axiosOther.post("listqueryquotation", {
        QueryId: query?.QueryAlphaNumId,
        QuotationNo: "",
      });
      if (data?.success) {
        setQoutationList(data?.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    dispatch(setQoutationData({}));
    getQoutationList();
    return () => {
      setQueryData({});
    };
  }, [query]);
  // const getQueryList = async () => {
  //     try {
  //         const { data } = await axiosOther.post("querymasterlist",{
  //             QueryId: state?.QueryData?.QueryID,

  //         });

  //         setQueryData(data?.DataList?.[0]);

  //     } catch (error) {
  //         console.log("error",error);
  //     }
  // }
  // useEffect(() => {
  //     getQueryList()
  // },[])


  return (
    <div className="mt-3 p-0 ms-1 m-0">
      <div className="row border quotatation-shadows padding-around  py-2 px-2">
        <div className="col-12 col-lg-12 col-md-12 col-sm-12">
          <Modal className="fade hotelList">
            <Modal.Header>
              <ToastContainer />
              <Modal.Title>Check Availability</Modal.Title>
              <Button
                variant="close"
                className="btn-close" // Ensure handleClose exists
              ></Button>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Table
                  responsive
                  striped
                  bordered
                  className="rate-table mt-2"
                >
                  <thead>
                    <tr>
                      <th scope="col" className="py-2 align-middle ">
                        Destination
                      </th>
                      <th scope="col" className="py-2 align-middle fs-4">
                        From
                      </th>
                      <th scope="col" className="py-2 align-middle fs-4">
                        To
                      </th>
                      <th scope="col" className="py-2 align-middle fs-4">
                        Room Type
                      </th>
                      <th scope="col" className="py-2 align-middle fs-4">
                        Meal Plan
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="fs-12">
                      <td className="text-center text-nowrap py-2"></td>
                      <td className="text-center text-nowrap py-2"></td>
                      <td className="text-center text-nowrap py-2"></td>
                      <td className="text-center text-nowrap py-2">
                        <span className="fs-12"></span>
                      </td>
                      <td className="text-center text-nowrap py-2">
                        <span className="fs-12"></span>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Row>
            </Modal.Body>
          </Modal>

          <Modal className="fade quotationList">
            <Modal.Header>
              <Modal.Title>Make Final/ Select Supplement</Modal.Title>
              <Button
                variant="close"
                className="btn-close" // Ensure handleClose exists
              ></Button>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Table className="rate-table mt-2">
                  <thead>
                    <tr>
                      <th scope="col" className="py-2 align-middle ">
                        Day
                      </th>
                      <th scope="col" className="py-2 align-middle fs-4">
                        Service Type
                      </th>
                      <th scope="col" className="py-2 align-middle fs-4">
                        Select Hotel
                      </th>
                      <th scope="col" className="py-2 align-middle fs-4">
                        Price
                      </th>
                      <th scope="col" className="py-2 align-middle fs-4">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-center text-nowrap py-2 fs-5"></td>
                      <td className="text-center text-nowrap py-2 fs-5"></td>
                      <td className="text-center text-nowrap py-2 fs-5">
                        <select
                          name="Status"
                          id="status"
                          className="form-control form-control-sm"
                        >
                          <option value="">Select</option>
                        </select>
                      </td>
                      <td className="text-center text-nowrap py-2 fs-5"></td>
                      <td className="text-center text-nowrap py-2 fs-5">
                        <button className="btn btn-primary btn-custom-size fs-14"></button>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Row>
            </Modal.Body>
          </Modal>

          {/* <div className="row quotationquery">
            <div className="col-2 col-md-2 col-lg-2 p-0">
              <p className="m-0 querydetails text-grey">Query Date:</p>
              <p className="m-0 querydetailspara text-grey">
                {" "}
                {formatDate(queryData?.QueryDate?.Date)} |
                {moment(queryData?.QueryDate?.Time, "HH:mm:ss").format(
                  "h:mm a"
                )}
              </p>
            </div>
            <div className="col-2 col-md-2 p-0 text-center">
              <p className="m-0 querydetails text-grey">Status:</p>
              <p
                className="m-0  font-weight-bold  badge py-1 px-2 text-grey"
                style={{ backgroundColor: QueryStatus?.color }}
              >
                {" "}
                {queryData?.QueryStatus?.Name}
              </p>
            </div>
            <div className="col-2 col-md-2 col-lg-2 p-0">
              <p className="m-0 querydetails text-grey">End Date:</p>
              <p className="m-0 querydetailspara text-grey">
                {" "}
                {formatDate(TourSummary?.ToDate)} | 12:46
              </p>
            </div>
            <div className="col-3 col-md-3 col-lg-3 p-0 d-flex gap-3 align-items-center">
              <div className="d-flex gap-3">
                <div className="d-flex align-items-center">
                  <i className="fa-solid fa-circle-user fs-4 text-secondary"></i>
                </div>
                <div>
                  <p className="m-0 font-size-14 font-weight-bold">
                    <b> Pawan Travel India</b>
                  </p>
                  <p className="m-0 font-weight-bold font-size-10">
                    <b>876636556</b>
                  </p>
                </div>
              </div>
              <div className="whatsapp-icon">
                <img src="/assets/icons/whatsapp.svg" alt="" />
              </div>
            </div>
            <div className="col-2 col-md-2  col-lg-3 d-flex justify-content-end align-items-center ">
              <div className="row quotationbuttons ">
                <div className="col-lg-12 col-4  d">
                  <button className="btn btn-dark btn-custom-size text-end">
                    <span className="me-1">Back</span>
                    <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
                  </button>
                </div>
              </div>
            </div>
          </div> */}

          <QueryDetailedCard />
        </div>
      </div>

      <div className="row quotation-table mt-3">
        <div
          className="col-md-12  col-lg-9 overflow  tablelist queryListHeight"
          style={{ overflowY: "auto", overflowX: "hidden" }}
        >
          <Table responsive className="quotationlist">
            <thead className="w-100 tableparahead">
              <tr className="w-100 light-gray-text ">
                <th
                  className="p-0 py-2 px-1 border-0 quotationheading"
                  scope="col"
                  style={{ width: "116px" }}
                >
                  {" "}
                  Quotation Id
                </th>
                {/* <th
                  className="p-0 py-2 px-1 border-0 quotationheading"
                  scope="col"
                  style={{ width: "116px" }}
                >
                  {" "}
                  REFERENCE ID
                </th> */}
                <th
                  className="p-0 py-2 px-1 border-0 quotationheading"
                  scope="col"
                  style={{ width: "116px" }}
                >
                  {" "}
                  Season
                </th>
                <th
                  className="p-0 py-2 px-1 border-0 quotationheading "
                  scope="col"
                  style={{ width: "100px" }}
                >
                  {" "}
                  From Date
                </th>
                {/* <th
                  className="p-0 py-2 px-1 border-0 quotationheading"
                  scope="col"
                  style={{ width: "100px" }}
                >
                  {" "}
                  TO DATE
                </th> */}
                <th
                  className="p-0 py-2 px-1 border-0 quotationheading "
                  scope="col"
                  style={{ width: "116px" }}
                >
                  {" "}
                  Duration
                </th>
                <th
                  className="p-0 py-2 px-1 border-0 quotationheading"
                  scope="col"
                  style={{ width: "116px" }}
                >
                  {" "}
                  Total Pax
                </th>
                <th
                  className="p-0 py-2 px-1 border-0  quotationheading"
                  scope="col"
                >
                  {" "}
                  Action
                </th>
              </tr>
            </thead>
            {dayServicesCondition && (
              <tbody className="w-100 tablepara">
                {qoutationList?.map((qoutation, index) => {
                  return (
                    <>
                      <tr className="w-100  my-1" key={index + 1}>
                        <td
                          className=" quotationtext p-0 py-1 px-1 border-0 "
                          onClick={() => openPopup(qoutation, queryData)}
                        >
                          <span className="text-queryList-primary cursor-pointer">
                            {qoutation?.QuotationNumber}
                          </span>
                        </td>
                        {/* <td className="quotationtexts p-0 py-2 px-1 border-0  text-light">
                          {qoutation?.ReferenceId}
                        </td> */}
                        <td className="quotationtexts p-0 py-2 px-1 border-0  text-light">
                          {qoutation?.TravelDateInfo?.SeasonType == 18
                            ? "Winter"
                            : qoutation?.TravelDateInfo?.SeasonType == 17
                              ? "Summer"
                              : ""}
                        </td>
                        <td className="quotationtexts p-0 py-2 px-1 border-0  text-light">
                          {qoutation?.TourSummary?.FromDate}
                        </td>
                        {/* <td className="quotationtexts p-0 py-2 px-1 border-0 text-light ">
                          {qoutation?.TourSummary?.ToDate}
                        </td> */}
                        <td className="quotationtexts p-0 py-2 px-1 border-0 text-light">
                          {qoutation?.TravelDateInfo?.TotalNights}N/
                          {qoutation?.TravelDateInfo?.TotalNoOfDays > 0
                            ? qoutation.TravelDateInfo.TotalNoOfDays
                            : 0}
                          D
                        </td>
                        <td className="quotationtexts p-0 py-2 px-1 border-0 text-light ">
                          {qoutation?.TourSummary?.PaxCount} Pax
                        </td>
                        <td className="p-0 py-2 px-1 fs-6 text-white pe-3">
                          <div className="d-flex gap-3 ">
                            <div
                              className="icon-container "
                            >
                              <button className="btn bg-info btn-custom-size px-1 quotation-button newQuotationIconButton" onClick={() => openPopup(qoutation, queryData)}>
                                <i className=" costsheeticon fa-sharp cursor-pointer action-iconDisable text-info fa-solid fa-eye text-white"></i>
                              </button>

                              <p className="tooltip-text py-1 px-1">view</p>
                            </div>
                            <div className="icon-container ">
                              <button
                                className="btn bg-secondary btn-custom-size px-1 quotation-button newQuotationIconButton"
                                onClick={() => {
                                  openCostsheet(qoutation, queryData);
                                  exportTemplatePdf(templateUrl);
                                }}
                              >
                                <i className=" costsheeticon fa-solid cursor-pointer action-iconDisable  text-secondary fa-download text-white"></i>
                              </button>
                              <p className="tooltip-text py-1 px-1">
                                Download
                              </p>
                            </div>
                            <div className="icon-container ">
                              <button className="btn bg-success btn-custom-size px-1 quotation-button newQuotationIconButton">
                                <i className=" costsheeticon fa-regular fa-envelope  action-iconDisable cursor-pointer text-success text-white"></i>
                              </button>

                              <p className="tooltip-text py-1 px-1">Mail</p>
                            </div>
                            <div className="icon-container ">
                              <button className="btn bg-danger btn-custom-size px-1 quotation-button newQuotationIconButton">
                                <i className=" costsheeticon fa-sharp fa-solid fa-share cursor-pointer action-iconDisable text-white"></i>
                              </button>
                              <p className="tooltip-text m-auto py-1 px-1 ">
                                Share
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                      {isOpen?.check && isOpen?.ind === index && (
                        <tr className="m-0 p-0">
                          <td colSpan="5" className="m-0 p-0"></td>
                          <td className="d-flex justify-content-start align-items-center m-1 p-0">
                            <div>
                              <div className="d-flex justify-content-center align-items-center">
                                <div className="row text-center mx-auto">
                                  <div className="col-12">
                                    <div className="gap-2 d-flex justify-content-center align-items-center">
                                      {qoutation?.PaxSlab?.length ? (
                                        qoutation.PaxSlab.map((e, index) => (
                                          <div
                                            key={index}
                                            className="badge bg-info rounded-pill cursor-pointer px-3"
                                            onClick={() =>
                                              openPopup(
                                                e.UniqueId,
                                                e.QueryId,
                                                e.QuotationNumber
                                              )
                                            }
                                          >
                                            {e.Min} - {e.Max}
                                          </div>
                                        ))
                                      ) : (
                                        <span>No data available</span>
                                      )}
                                      {console.log(
                                        qoutation?.PaxSlab?.QuotationNumber,
                                        "122"
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            )}
          </Table>
        </div>
        {/* <div className="col-md-2  col-lg-2 col-sm-2 quotatation-shadows py-2 px-1 quatationdata border-end">
          <p className="text-center Destination font-w500 fs-14 text-grey">
            Destinations
          </p>
          <div className="row quotationstateres">
            <div className="col-4 ">
              <p className="m-0 headings text-grey">From</p>
              <p className="quotationstate m-0 text-grey"> DELHI</p>
            </div>

            <div className="col-4 imagesicon text-grey">
              <img src={icon3} alt="icon3" />
            </div>

            <div className="col-4">
              <p className="m-0 headings text-grey">To</p>
              <p className="quotationstate  m-0  text-grey"> AGRA</p>
            </div>
          </div>
          <div className="row sidetables">
            <div className="mt-3 tables col-sm-12">
              <div className="tabledata m-0 p-0">
                <div className="row text-center tabless text-grey">
                  <div className="col p-0 px-1 th">Duration</div>
                  <div className="col p-0 px-1 th">Destination</div>
                  <div className="col p-0 px-1 th">Date</div>
                </div>
                {TourSummary?.TourDetails?.map((tour, index) => {
                  return (
                    <div className="row text-center  text-grey" key={index}>
                      <div className="col p-0 p-1 td">{tour?.DayNo}</div>
                      <div className="col p-0 p-1 td">
                        {tour?.DestinationName}
                      </div>
                      <div className="col p-0 p-1 td">{tour?.Date}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="my-2 ">
            <div className="row m-0 customgap ">
              <div className="width-30-percent p-0 col-4 pe-1">
                <div className="border d-flex flex-column">
                  <span className="m-0 p-0 text-center headingdata text-grey">
                    NIGHTS
                  </span>
                  <span className="number text-center text-number-quotationList">
                    3
                  </span>
                </div>
              </div>
              <div className="width-30-percent p-0 col-4 pe-1">
                <div className="border d-flex flex-column ">
                  <span className="m-0 p-0 text-center headingdata text-grey">
                    ADULTS
                  </span>
                  <span className="number text-center text-number-quotationList">
                    5
                  </span>
                </div>
              </div>
              <div className="width-30-percent p-0 col-4 pe-1">
                <div className="border d-flex flex-column">
                  <span className="m-0 text-center headingdata text-grey">
                    CHILDS
                  </span>
                  <span className="number text-center text-number-quotationList">
                    0
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="my-2 ">
            <div className="row m-0 customgap ">
              <div className="width-30-percent p-0 col-4 pe-1">
                <div className="border border-bottom-0 d-flex flex-column">
                  <span className="m-0 p-0 text-center headingdata text-grey">
                    SGL
                  </span>
                  <span className="number text-center text-number-quotationList">
                    3
                  </span>
                </div>
              </div>
              <div className="width-30-percent p-0 col-4 pe-1">
                <div className="border d-flex flex-column ">
                  <span className="m-0 p-0 text-center headingdata text-grey">
                    DBL
                  </span>
                  <span className="number text-center text-number-quotationList">
                    2
                  </span>
                </div>
              </div>
              <div className="width-30-percent p-0 col-4 pe-1">
                <div className="border d-flex flex-column">
                  <span className="m-0 text-center headingdata text-grey">
                    TPL
                  </span>
                  <span className="number text-center text-number-quotationList">
                    0
                  </span>
                </div>
              </div>
            </div>
          </div>



          <div className="my-2 ">
            <div className="row m-0">
              <div className=" col-6 p-0 ">
                <div className="border d-flex flex-column">
                  <span className="text-center m-0 headingdata text-grey">
                    BUDGET
                  </span>
                  <span className="text-center m-0 number text-number-quotationList">
                    0
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="my-2">
            <div className="row m-0">
              <div className=" col-12 p-0">
                <div className="border-bottom p-1 py-2 mt-2 border-right-0 border-left-0 ">
                  <p className="m-0  headingdata text-grey">
                    ROOM PREFERENCE :
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="my-2">
            <div className="row m-0">
              <div className=" col-12 ps-1">
                <div className="d-flex flex-column">
                  <span className="headingdata text-grey">
                    OPERATION PERSON
                  </span>
                  <b>Mohd Rizwan</b>
                </div>
              </div>
            </div>
          </div>
        </div> */}
        <DestinationsCard />

      </div>
    </div>
  );
};

export default Costsheet;
