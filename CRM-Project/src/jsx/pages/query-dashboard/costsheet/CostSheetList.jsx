import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosOther } from "../../../../http/axios_base_url";
import { formatDate } from "../../../../helper/formatDate";
import { useDispatch, useSelector } from "react-redux";
import { ThemeContext } from "../../../../context/ThemeContext";
import {
  resetQueryUpdateData,
  setHeadingShowFalse,
  setHeadingShowTrue,
  setQoutationSubject,
  setQueryData,
  setQueryUpdateData,
} from "../../../../store/actions/queryAction";
import { currentDate } from "../../../../helper/currentDate";
import Skeleton from "../../../layouts/Skeleton";
import DataTable from "react-data-table-component";
import { MdNavigateNext } from "react-icons/md";
import { MdOutlineSkipNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import { MdOutlineSkipPrevious } from "react-icons/md";
import { useLocation } from "react-router-dom";
import { table_custom_style } from "../../../../css/custom_style";

const CostSheetList = () => {
  const { queryData, qoutationData, qoutationSubject } = useSelector(
    (data) => data?.queryReducer
  );

  const dispatch = useDispatch();
  const { background } = useContext(ThemeContext);
  const [initialList, setInitialList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPage, setTotalPage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const isFirstRender = useRef(true);
  const [clientName, setClientName] = useState("");
  const [agentName, setAgentName] = useState("");
  const navigate = useNavigate();
  const { state } = useLocation();

  const getListDataToServer = async (id) => {
    setIsLoading(true);
    try {
      const { data } = await axiosOther.post("querymasterlist", {
        Page: currentPage,
        PerPage: rowsPerPage,
      });
      console.log(data, 'QUERY435')
      setTotalPage(data?.TotalPages);
      setInitialList(data?.DataList || []);
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      getListDataToServer(); // Run once on mount
      return;
    }
    const delayDebounce = setTimeout(() => {
      getListDataToServer(); // Run when filter or pagination changes
    }, 400); // optional debounce for filter input
    return () => clearTimeout(delayDebounce);
  }, [currentPage, rowsPerPage]);


  const redirectToQoutationList = (data) => {
    localStorage.setItem("quotationList", "-list");
    navigate("/query/quotation-list", { state: { QueryData: data } });
    // console.log(data, "data");
    dispatch(setHeadingShowTrue());
    localStorage.setItem(
      "Query_Qoutation",
      JSON.stringify({
        QoutationNum: data?.QuotationNumber || "",
        QueryID: data?.QueryID,
      })
    );
    dispatch(
      setQueryData({
        QueryId: data?.id,
        QueryAlphaNumId: data?.QueryID,
        QueryAllData: data,
      })
    );
    dispatch(
      setQoutationSubject(
        data?.ServiceDetail?.ServiceCompanyName +
        " " +
        currentDate(data?.QueryDate?.Date)
      )
    );
  };

   const openPopup = async (quotation, uniqueId) => {
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
      // console.log(quotation?.QuotationNumber,"sldhgfkd")
  
      try {
        const response = await axiosOther.post("costsheet-template", {
          QueryId: state?.QueryData?.QueryID ?? queryData?.QueryAlphaNumId,
          QuotationNumber: quotation?.QuotationNumber,
          // UniqueId: uniqueId,
          TemplateType: "FIT-Costsheet",
        });
  
        if (response.status !== 200) {
          throw new Error(`API request failed with status ${response.status}`);
        }
  
        let templateUrl = response.data?.TemplateUrl;
  
        if (!templateUrl) {
          document.body.removeChild(loader);
          throw new Error("Template URL not received from API.");
        }
  
        // Create Popup Div
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
          // backgroundColor: "rgba(0, 0, 0, 0.5)",
          borderRadius: "2rem",
          zIndex: 1000,
          display: "flex",
          flexWrap: "wrap", // Allow items to wrap if needed
          alignItems: "flex-start", // Align items at the top
          justifyContent: "center",
          padding: "1rem",
          paddingBottom: 0,
        });
  
        // Create the iframe
        const iframe = document.createElement("iframe");
        Object.assign(iframe.style, {
          width: "100%",
          height: "93%",
          border: "none",
          backgroundColor: "white",
        });
        iframe.onload = () => {
          document.body.removeChild(loader);
          iframe.style.width = "2000px";
          iframe.contentWindow.document.querySelector("table").style.width =
            "2000px";
        };
  
        // iframe.onload = () => {
        //   document.body.removeChild(loader);
  
        //   try {
        //     const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
  
        //     const mainTable = iframeDoc.querySelector("table");
  
        //     if (mainTable) {
        //       mainTable.style.width = "2000px";
        //       console.log("Table width set to 2000px");
        //     } else {
        //       console.warn("No table found inside iframe.");
        //     }
        //   } catch (err) {
        //     console.warn("Cannot access iframe content due to cross-origin restriction.");
        //     // Optional: Visual zoom fallback
        //     // iframe.style.zoom = "1.3"; // Visual only, won't affect export
        //     iframe.style.width = "2000px"
        //     iframe.contentWindow.document.querySelector("table").style.width = "2000px";
        //   }
        // };
  
        iframe.src = templateUrl;
  
        // Close Button
        const closeButton = document.createElement("div");
        closeButton.innerHTML = "&times;";
        Object.assign(closeButton.style, {
          // position: "absolute",
          top: "10px",
          right: "20px",
          fontSize: "2rem",
          fontWeight: "lighter",
          color: "#bd241a",
          cursor: "pointer",
          zIndex: 1001,
          marginRight: "2rem",
        });
  
        // Close Button (Second Version)
        const closeButtonAlt = document.createElement("button");
        closeButtonAlt.innerText = "Close";
        Object.assign(closeButtonAlt.style, {
          padding: "0.3125rem 1.25rem",
          fontSize: "1rem",
          color: "white",
          backgroundColor: "#bd241a",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginRight: "1rem",
          // marginLeft:"auto",
  
          // marginLeft: "auto",
          // position: "absolute",
          // top: "93%",
          // left: "92%",
        });
  
        // Export Button
        const exportButton = document.createElement("button");
        exportButton.innerText = "Export Excel";
        Object.assign(exportButton.style, {
          padding: "0.3125rem 1.25rem",
          fontSize: "1rem",
          color: "white",
          backgroundColor: "#28a745",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginLeft: "auto",
          marginRight: "1rem",
          // position: "absolute",
          // top: "93%",
          // left: "85%",
        });
  
        const exportButtonPdf = document.createElement("button");
        exportButtonPdf.innerText = "Export Pdf";
        Object.assign(exportButtonPdf.style, {
          padding: "0.3125rem 1.25rem",
          fontSize: "1rem",
          color: "white",
          backgroundColor: "#007bff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginRight: "1rem",
          // position: "absolute",
          // top: "93%",
          // left: "85%",
        });
  
        const exportButtonWord = document.createElement("button");
        exportButtonWord.innerText = "Export Word";
        Object.assign(exportButtonWord.style, {
          padding: "0.3125rem 1.25rem",
          fontSize: "1rem",
          color: "white",
          backgroundColor: "#28a745",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginRight: "1rem",
          // position: "absolute",
          // top: "93%",
          // left: "85%",
        });
  
        const exportButton2 = document.createElement("button");
        exportButton2.innerText = "Export";
        Object.assign(exportButton2.style, {
          padding: "0.3125rem 1.25rem",
          fontSize: "1rem",
          color: "white",
          backgroundColor: "#28a745",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          // alignSelf:"end"
          marginLeft: "auto",
          marginRight: "7rem",
          // position: "absolute",
          // display:"flex",
          // top: "3%",
          // left: "90%",
        });
  
        // Close Popup Function
        const closePopup = () => {
          document.body.style.overflow = "auto";
          if (document.body.contains(popupDiv)) {
            document.body.removeChild(popupDiv);
          }
        };
  
        closeButton.onclick = closePopup;
        closeButtonAlt.onclick = closePopup;
  
        exportButton.onclick = () => exportTemplateExcel(templateUrl);
        exportButtonWord.onclick = () => exportTemplateWord(templateUrl);
        // exportButton2.onclick = () => exportTemplate(templateUrl);
        exportButtonPdf.onclick = () => exportTemplatePdf(templateUrl);
  
        // Append Elements
        // popupDiv.appendChild(exportButton2); hide cause dual export btn
        // popupDiv.appendChild(closeButton); hide cause dual close btn
        popupDiv.appendChild(iframe);
        popupDiv.appendChild(exportButton);
        popupDiv.appendChild(exportButtonPdf);
        // popupDiv.appendChild(exportButtonWord);
        popupDiv.appendChild(closeButtonAlt);
  
        document.body.appendChild(popupDiv);
        document.body.style.overflow = "hidden";
  
        // Keydown Event for ESC Key
        const keyDownHandler = (event) => {
          if (event.key === "Escape") {
            closePopup();
            document.removeEventListener("keydown", keyDownHandler);
          }
        };
  
        document.addEventListener("keydown", keyDownHandler);
      } catch (error) {
        document.body.removeChild(loader);
        console.error("Error:", error.response?.data || error.message);
        alert("Failed to generate the template. Please try again later.");
      }

      const exportTemplatePdf = async (templateUrl) => {
        try {
          const response = await axiosOther.post("createViewPdf", {
            url: templateUrl,
          });
  
          if (response.status !== 200) {
            throw new Error(`API request failed with status ${response.status}`);
          }
  
          const { status, pdf_url } = response.data;
  
          if (status && pdf_url) {
            // Open the PDF in a new tab
            window.open(pdf_url, "_blank");
          } else {
            alert("PDF generation failed. Please try again.");
          }
        } catch (error) {
          console.error("Error exporting HTML to PDF:", error);
          alert("Export failed. Please try again.");
        }
      };
      const exportTemplateExcel = async (templateUrl) => {
        try {
          const response = await axiosOther.post("createViewExcel", {
            url: templateUrl,
          });
  
          if (response.status !== 200) {
            throw new Error(`API request failed with status ${response.status}`);
          }
  
          const { status, download_url, message } = response.data;
  
          // Make sure status is explicitly 1
          if (status === 1 && download_url) {
            const link = document.createElement("a");
            link.href = download_url;
  
            // Set a default filename using current timestamp if needed
            const fileName = `costsheet_${Date.now()}.xls`;
            link.setAttribute("download", fileName);
  
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else {
            alert(message || "Excel generation failed. Please try again.");
          }
        } catch (error) {
          console.error("Error exporting HTML to Excel:", error);
          alert("Export failed. Please try again.");
        }
      };
  
      const exportTemplateWord = async (templateUrl) => {
        try {
          const response = await axiosOther.post("createViewWord", {
            url: templateUrl,
          });
  
          if (response.status !== 200) {
            throw new Error(`API request failed with status ${response.status}`);
          }
  
          const { status, download_url } = response.data;
  
          if (status && download_url) {
            // Trigger download automatically
            const link = document.createElement("a");
            link.href = download_url;
            link.download = ""; // Optional: "filename.doc" if you want to set filename
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else {
            alert("Word generation failed. Please try again.");
          }
        } catch (error) {
          console.error("Error exporting HTML to Word:", error);
          alert("Export failed. Please try again.");
        }
      };
    };

  const table_columns = [
    {
      name: "Query ID",
      selector: (row) => row?.QueryID, 
      cell: (row) => (
        <span
          className="text-queryList-primary cursor-pointer"
          onClick={() => redirectToQoutationList(row)}
        >
          {row?.QueryID}
        </span>
      ),
      sortable: true,
      wrap: true,
      width: "7rem",
    },

    {
      name: "Type",
      selector: (row) => row?.ServiceDetail?.BusinessTypeName,
      cell: (row) => <span>{row?.ServiceDetail?.BusinessTypeName}</span>,
      wrap: true,
      sortable: true,
      width: "6rem",
    },
    {
      name: "Quotation No",
    //   selector: (row) => row?.ServiceDetail?.ServiceCompanyName,
    //   cell: (row) => (
    //     <span>
    //       {row?.ServiceDetail?.ServiceCompanyName} / {row?.ClientName}
    //     </span>
    //   ),
      minWidth: "80px",
    },
    {
      name: "Tour Date",
      selector: (row) => row?.QueryDate?.Date,
      cell: (row) => (
        <span className="">{formatDate(row?.QueryDate?.Date)}</span>
      ),
      minWidth: "50px",
      sortable: true,
    },
    {
      name: "Destination",
      selector: (row) =>
        row?.TravelDateInfo?.TravelData?.map(
          (destination) => destination?.DestinationName
        ).join(", "), // ✅ plain string for sorting
      cell: (row) => (
        <span>
          {row?.TravelDateInfo?.TravelData?.map(
            (destination) => destination?.DestinationName
          ).join(", ")}
        </span>
      ),
      sortable: true,
      wrap: true,
    },
    {
      name: "Pax Type",
      selector: (row) => row?.PaxInfo?.PaxTypeName,
      cell: (row) => (
        <span className="badge-info rounded-pill px-3">
          {row?.PaxInfo?.PaxTypeName}
        </span>
      ),
      minWidth: "80px",
      sortable: true,
    },
    {
      name: "Costsheet",
      cell: (row) => (
        <button
        className="btn btn-primary btn-custom-size px-1 quotation-button newQuotationIconButton"
        onClick={() => openPopup(row.qoutation)}
      >
        <i className="fas fa-dollar-sign fs-4"></i>
      </button>
      ),
      minWidth: "40px",
      sortable: true,
    },
     {
      name: "Status",
      selector: (row) => row?.QueryStatus?.Name,
      cell: (row) => {
        return (
          <span
            style={{
              background: `${row?.QueryStatus?.ColorCode}`,
              color: "black",
            }}
            className="badge px-2 py-1 query-stts"
          >
            {row?.QueryStatus?.Name}
          </span>
        );
      },
      sortable: true,
      width: "90px",
    },
  ];


  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
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

  return (
    <>

        {isLoading ? (
          <Skeleton />
        ) : (

          <div className="table-responsive">
            <div
              id="example2_wrapper"
              className="dataTables_wrapper no-footer"
            >
              <DataTable
                columns={table_columns}
                data={initialList}
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
            </div>
          </div>

        )}
    </>
  );
};
export default CostSheetList;
