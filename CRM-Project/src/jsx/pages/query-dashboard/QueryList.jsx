import React, { useState, useEffect, useContext, useRef } from "react";
import "bootstrap-daterangepicker/daterangepicker.css";
import { Tab, Nav, Badge } from "react-bootstrap";
// import Skeleton from "react/-loading-skeleton";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { notifyError, notifySuccess } from "../../../helper/notify";
import "react-toastify/dist/ReactToastify.css";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import swal from "sweetalert";
import { axiosOther } from "../../../http/axios_base_url";
import { formatDate } from "../../../helper/formatDate";
import { useDispatch, useSelector } from "react-redux";
import UseTable from "../../../helper/UseTable";
import { ThemeContext } from "../../../context/ThemeContext";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import {
  resetQueryUpdateData,
  setHeadingShowFalse,
  setHeadingShowTrue,
  setQoutationSubject,
  setQueryData,
  setQueryUpdateData,
} from "../../../store/actions/queryAction";
import { currentDate } from "../../../helper/currentDate";
import { wrap } from "highcharts";
import Skeleton from "../../layouts/Skeleton";
import DataTable from "react-data-table-component";
import { table_custom_style } from "../../../css/custom_style";
import { MdNavigateNext } from "react-icons/md";
import { MdOutlineSkipNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import { MdOutlineSkipPrevious } from "react-icons/md";
import Select from "react-select";
import { useLocation } from "react-router-dom";
import Destination from "../masters/destination";

const QueryList = () => {
  const { queryData, qoutationData, qoutationSubject } = useSelector(
    (data) => data?.queryReducer
  );

  const dispatch = useDispatch();
  const { background } = useContext(ThemeContext);
  const [initialList, setInitialList] = useState([]);
  // const [initialListForExcel, setInitialListForExcel] = useState([]);
  const [queryStatusList, setQueryStatusList] = useState([]);
  const [filterValue, setFilterValue] = useState([]);
  //const [filterInput, setFiterInput] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPage, setTotalPage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [destinationlist, setdestinationlist] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState("");
  const isFirstRender = useRef(true);
  const [filterInput, setFilterInput] = useState("");
  const [clientName, setClientName] = useState("");
  const [agentName, setAgentName] = useState("");
  const [excelLoading, setExcelLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const [dropdownList, setDropdownList] = useState([]);
  const [type, setType] = useState("");

  const getListDataToServer = async (id) => {
    setIsLoading(true);
    try {
      const { data } = await axiosOther.post("querymasterlist", {
        QueryId: filterInput,
        QueryDate: state?.filter?.QueryDate,
        QueryMonth: state?.filter?.QueryMonth,
        Status: id || state?.filter?.status,
        Page: currentPage,
        PerPage: rowsPerPage,
        ClientName: clientName || " ",
        AgentName: agentName || " ",
        QueryType: type || " ",
      });
      // console.log(data,"filterDataasasas")
      setTotalPage(data?.TotalPages);
      setClientName(clientName);
      setAgentName(agentName);
      // setIsLoading(false);
      setInitialList(data?.DataList || []);
      setFilterValue(data?.DataList || []);
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
    // try {
    //   const { data } = await axiosOther.post("querymasterlist")
    //   setInitialListForExcel(data?.DataList || [])
    // } catch {
    //   console.log("error", error);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const [activeTab, setActiveTab] = useState("AllQuery");

  const handleNext = (currentTab) => {
    const tabOrder = ["AllSeries", "AllQuery"];
    const currentIndex = tabOrder.indexOf(currentTab);
    const nextIndex = (currentIndex + 1) % tabOrder.length;
    setActiveTab(tabOrder[nextIndex]);
  };

  useEffect(() => {
    const fetchingApiDataForDropdown = async () => {
      try {
        const { data } = await axiosOther.post("querytypelist", {
          Search: "",
          Status: "1",
        });

        if (data?.Status == 200) {
          setDropdownList(data?.DataList || []);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchingApiDataForDropdown();
  }, []);

  // console.log(initialListForExcel, "11111111")
  const getStatusCounts = async () => {
    try {
      const { data } = await axiosOther.post("status-count");
      setQueryStatusList(data);
    } catch (error) {
      console.error("Error fetching status counts:", error);
    }
  };
  const handleFilterChange = (value) => {
    setFilterInput(value);
    setCurrentPage(1); // Reset to first page when filtering
  };
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      getListDataToServer(); // Run once on mount
      return;
    }
    const delayDebounce = setTimeout(() => {
      getListDataToServer(); // Run when filter, pagination, or type changes
    }, 400); // optional debounce for filter input
    return () => clearTimeout(delayDebounce);
  }, [currentPage, rowsPerPage]);

  // useEffect(() => {
  //   if (!hasFetched.current) {
  //     getListDataToServer();
  //     hasFetched.current = true;
  //   }
  // }, [currentPage, rowsPerPage]);

  // useEffect(() => {
  //   if (isFirstRender.current) {
  //     isFirstRender.current = false;
  //     return;
  //   }

  //   getListDataToServer();
  // }, [filterInput]);

  useEffect(() => {
    getStatusCounts();
    localStorage.setItem(
      "Query_Qoutation",
      JSON.stringify({
        QoutationNum: "",
        QueryID: "",
      })
    );
    dispatch(setQueryData(null));
  }, []);
  const handleFilter = (id) => {
    getListDataToServer(id);
  };
  useEffect(() => {
    if (selectedFilter) {
      const filteredList = initialList?.filter(
        (data) =>
          data?.QueryStatus?.Name?.toLowerCase() ===
          selectedFilter.toLowerCase()
      );
      setFilterValue(filteredList);
    } else {
      setFilterValue(initialList);
    }
  }, [selectedFilter, initialList]);

  useEffect(() => {
    const filteredList = initialList?.filter((data) => {
      return (
        data?.ServiceDetail?.ServiceCompanyName?.toLowerCase()?.includes(
          filterInput?.toLowerCase()
        ) ||
        data?.ServiceDetail?.BusinessTypeName?.toLowerCase()?.includes(
          filterInput?.toLowerCase()
        ) ||
        data?.Prefrences?.Priority?.toLowerCase()?.includes(
          filterInput?.toLowerCase()
        ) ||
        data?.QueryStatus?.Name?.toLowerCase()?.includes(
          filterInput?.toLowerCase()
        ) ||
        data?.PaxInfo?.PaxTypeName?.toLowerCase()?.includes(
          filterInput?.toLowerCase()
        ) ||
        data?.QueryID?.toLowerCase() === filterInput?.toLowerCase() ||
        data?.QueryID?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
        data?.QueryDate?.Date?.toLowerCase()?.includes(
          filterInput?.toLowerCase()
        )
      );
    });

    setFilterValue(filteredList);
  }, [filterInput, initialList]);

  const handleAdd = () => {
    dispatch(resetQueryUpdateData());
    dispatch(setHeadingShowFalse());
  };

  const handleDelete = async (id) => {
    const confirmation = await swal({
      title: "Are you sure Want to delete?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });

    if (confirmation) {
      try {
        const { data } = await axiosOther.post("delete-query", {
          id: id,
        });
        if (data?.Status == 1 || data?.status == 1 || data?.result) {
          notifySuccess(data?.message || data?.Message || data?.result);
          getListDataToServer();
        }
      } catch (err) {
        if (err) {
          notifyError(err?.message || err?.Message);
        }
      }
    }
  };

  useEffect(() => {
    const getMessage = localStorage.getItem("success-message");
    if (getMessage != null) {
      notifySuccess(getMessage);
      localStorage.removeItem("success-message");
    }
  }, []);
  const customStyles = {
    control: (base) => ({
      ...base,

      background: "#2e2e40",
      color: "white",
      borderColor: "none",
      textalign: "center",
      boxShadow: "none",
      border: "none",
      height: "1rem",
      borderRadius: "0.5rem",
      width: "12rem",
      fontSize: "1em",
      // minHeight: '1.8rem',
    }),
    singleValue: (base) => ({
      ...base,
      color: "white",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#2e2e40",
      overflow: "hidden",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "white" : "white",
      color: "white",
      cursor: "pointer",
      background: "#2e2e40",
    }),
    input: (base) => ({
      ...base,
      color: "white",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#6c757d",
    }),
  };

  const handleEdit = (row) => {
    const routeNavigate = "editByList";
    const data = { ...row, routeNavigate };
    dispatch(setQueryUpdateData(row));
    dispatch(setHeadingShowTrue());
    dispatch(
      setQueryData({
        QueryId: row?.id,
        QueryAlphaNumId: row?.QueryID,
        QueryAllData: row,
      })
    );
    dispatch(
      setQoutationSubject(
        row?.ServiceDetail?.ServiceCompanyName +
        " " +
        currentDate(row?.QueryDate?.Date)
      )
    );
    navigate("/query", { state: data });
    localStorage.setItem("query-data", JSON.stringify(row));
  };

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
    localStorage.setItem(
      "Query_Type_Status",
      JSON.stringify({
        QueryType: data?.QueryType[0]?.QueryTypeId,
        QueryStatus: data?.QueryStatus?.id,
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

  const excelHeaders = [
    { header: "Query ID", key: "QueryID", width: 12 },
    { header: "Tour Id / Ref No", key: "TourRef", width: 20 },
    { header: "Type", key: "BusinessType", width: 12 },
    { header: "Agent / Client", key: "AgentClient", width: 25 },
    { header: "Query Date", key: "QueryDate", width: 18 },
    { header: "Tour Date", key: "TourDate", width: 15 },
    { header: "Destination", key: "Destination", width: 30 },
    { header: "Pax Type", key: "PaxType", width: 12 },
    { header: "Query Type", key: "QueryType", width: 25 },
    { header: "Lead Source", key: "LeadSource", width: 15 },
    { header: "Priority", key: "Priority", width: 10 },
    { header: "Assign User", key: "AssignUser", width: 15 },
    { header: "Sales Person", key: "SalesPerson", width: 15 },
    { header: "Status", key: "Status", width: 12 },
  ];

  // ✅ Helper to safely join arrays
  const joinArray = (arr, key) =>
    arr ? arr.map((x) => x[key]).join(", ") : "";

  const handleDownloadExcelForQueries = async () => {
    setExcelLoading(true);
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Query Report");

    // 👉 Set Headers
    sheet.columns = excelHeaders;

    const tableData = initialList.length > 0 ? initialList : [];

    // 👉 Add Rows
    tableData.forEach((row) => {
      sheet.addRow({
        QueryID: row?.QueryID || "",
        TourRef:
          row?.TourId +
          (row?.QueryStatus?.Name === "Confirmed"
            ? " / " + row?.ReferenceId
            : ""),
        BusinessType: row?.ServiceDetail?.BusinessTypeName || "",
        AgentClient: `${row?.ServiceDetail?.ServiceCompanyName || ""} / ${row?.ClientName || ""
          }`,
        QueryDate: row?.QueryDate?.Date
          ? `${formatDate(row?.QueryDate?.Date)} ${row?.QueryDate?.Time || ""}`
          : "",
        TourDate: row?.QueryDate?.Date ? formatDate(row?.QueryDate?.Date) : "",
        Destination: joinArray(
          row?.TravelDateInfo?.TravelData,
          "DestinationName"
        ),
        PaxType: row?.PaxInfo?.PaxTypeName || "",
        QueryType: joinArray(row?.QueryType, "QueryTypeName"),
        LeadSource: row?.LeadSourceName || "",
        Priority: row?.Prefrences?.Priority || "",
        AssignUser: row?.Prefrences?.OperationPersonName || "",
        SalesPerson: row?.Prefrences?.SalesPersonName || "",
        Status: row?.QueryStatus?.Name || "",
      });
    });

    // 👉 Style Header Row
    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF333333" },
    };
    headerRow.alignment = { horizontal: "center", vertical: "middle" };
    headerRow.height = 25;

    // 👉 Style Data Rows
    sheet.eachRow((row, idx) => {
      row.height = 50;
      row.alignment = {
        vertical: "middle",
        horizontal: "left",
        wrapText: true,
      };
      // Zebra striping
      if (idx % 2 === 0) {
        row.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF5F5F5" }, // light gray
        };
      }
    });

    // 👉 Enable AutoFilter
    sheet.autoFilter = {
      from: "A1",
      to: sheet.getRow(1).getCell(excelHeaders.length)._address,
    };

    // 👉 Download Excel
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "Query_List_Report.xlsx");
    setExcelLoading(false);
  };

  const table_columns = [
    // {
    //   name: "Query ID",
    //   selector: (row) => (
    //     <span
    //       className="text-queryList-primary cursor-pointer"
    //       onClick={() => redirectToQoutationList(row)}
    //     >
    //       {row?.QueryID}
    //     </span>
    //   ),

    //   wrap: true,
    //   sortable: true,
    //   width: "5rem",
    // },
    {
      name: "Query ID",
      selector: (row) => row?.QueryID, // ✅ raw value for sorting
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
      width: "5rem",
    },
    {
      name: "Tour Code",
      // selector: (row) => row?.TourId,
      cell: (row) => (
        <span>
          <span>{row?.FileNo}</span>
          {/* {row?.QueryStatus?.Name === "Confirmed" ? " / " : null} */}
          {/* <span>{row?.ReferenceId}</span> */}
        </span>
      ),
      wrap: true,
      sortable: true,
      width: "9rem",
    },
    {
      name: "Type",
      selector: (row) => row?.ServiceDetail?.BusinessTypeName,
      cell: (row) => <span>{row?.ServiceDetail?.BusinessTypeName}</span>,
      wrap: true,
      sortable: true,
      width: "4rem",
    },
    {
      name: "Agent Name / Client Name",
      selector: (row) => row?.ServiceDetail?.ServiceCompanyName,
      cell: (row) => (
        <span>
          {row?.ServiceDetail?.ServiceCompanyName} / {row?.ClientName}
        </span>
      ),
      wrap: true,
      sortable: true,
      width: "12rem",
    },
    {
      id: "queryDate", // ✅ unique id
      name: "Query Date",
      selector: (row) => row?.QueryDate?.Date, // ✅ raw date for sorting
      cell: (row) => (
        <div className="d-flex gap-1 flex-column">
          <span className="d-block">{formatDate(row?.QueryDate?.Date)}</span>
          <span>
            <i className="fa-clock fa-regular pe-1"></i>
            {row?.QueryDate?.Time}
          </span>
        </div>
      ),
      minWidth: "80px",
      sortable: true,
      wrap: true,
    },
    {
      name: "Tour Date",
      selector: (row) => row?.QueryDate?.Date,
      cell: (row) => (
        <span className="">{formatDate(row?.QueryDate?.Date)}</span>
      ),
      minWidth: "70px",
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
        // <span className="badge-info rounded-pill px-3">
        //   {row?.PaxInfo?.PaxTypeName}
        // </span>
        <span
          className="badge-info rounded-pill px-3"
          style={{
            backgroundColor:
              row?.PaxInfo?.PaxTypeName?.toLowerCase() == "git"
                ? "#5eead4" // light teal
                : "", // default
            color:
              row?.PaxInfo?.PaxTypeName?.toLowerCase() == "git"
                ? "black"
                : "white",
          }}
        >
          {row?.PaxInfo?.PaxTypeName}
        </span>
      ),
      minWidth: "60px",
      sortable: true,
    },
    {
      name: "Query Type",
      selector: (row) =>
        row?.QueryType?.map((query) => query?.QueryTypeName).join(", "), // ✅ plain string for sorting
      cell: (row) => (
        // <div className="d-flex flex-wrap justify-content-start gap-1">
        //   {row?.QueryType?.map((query, index) => (
        //     <span
        //       className="badge-success rounded-pill px-2 py-0"
        //       style={{ color: "black" }}
        //       key={index}
        //     >
        //       {query?.QueryTypeName}
        //     </span>
        //   ))}
        // </div>
        <div className="d-flex flex-wrap justify-content-start gap-1">
          {row?.QueryType?.map((query, index) => {
            const isSeries = query?.QueryTypeName?.toLowerCase() === "series";

            return (
              <span
                key={index}
                className={`rounded-pill px-2 py-0 ${isSeries ? "" : "badge-success"
                  }`}
                style={{
                  color: isSeries ? "black" : "black",
                  backgroundColor: isSeries ? "#5eead4" : undefined, // Light teal shade
                }}
              >
                {query?.QueryTypeName}
              </span>
            );
          })}
        </div>
      ),
      minWidth: "90px",
      sortable: true,
    },

    {
      name: "Lead Source",
      selector: (row) => row?.LeadSourceName,
      cell: (row) => <span>{row?.LeadSourceName}</span>,
      minWidth: "7rem",
      sortable: true,
    },
    {
      name: "Priority",
      selector: (row) => row?.Prefrences?.Priority,
      cell: (row) => (
        <Badge
          bg="badge-rounded"
          className={`${row?.Prefrences?.Priority === "High"
              ? "badge-outline-danger"
              : row?.Prefrences?.Priority === "Low"
                ? "badge-outline-info"
                : "badge-outline-warning"
            } `}
        >
          {row?.Prefrences?.Priority}
        </Badge>
      ),
      sortable: true,
      minWidth: "2rem",
    },
    {
      name: "Assign User",
      selector: (row) => row?.Prefrences?.OperationPersonName,
      cell: (row) => (
        // <span className="badge bg-query-list" style={{ color: "black" }}>
        <span>
          {row?.Prefrences?.OperationPersonName}
        </span>
      ),
      // minWidth: "6.5rem",
      minWidth: "7rem",
      sortable: true,
    },
    {
      name: "Sales Person",
      selector: (row) => row?.Prefrences?.SalesPersonName,
      cell: (row) => <span>{row?.Prefrences?.SalesPersonName}</span>,
      minWidth: "7rem",
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
    {
      name: "Action",
      selector: (row) => {
        return (
          <div className="d-flex align-items-center gap-1 sweetalert">
            <i
              className="text-success action-icon cursor-pointer fa-pencil fa-solid"
              onClick={() => handleEdit(row)}
            ></i>
            <div className="mt-5 sweetalert"></div>
            <i
              className="text-danger action-icon cursor-pointer fa-solid fa-trash-can sweet-confirm"
              onClick={() => handleDelete(row?.id)}
            ></i>
          </div>
        );
      },
      sortable: true,
      minWidth: "60px",
    },
  ];

  const QueryArry = [
    "Created",
    "Reverted",
    "Follow Up",
    "Quotation Generated",
    "Confirmed",
    "Quote Sent",
    "Cancelled",
    "Lost",
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
  };
  // const getdestinationlist = async () => {
  //   try {
  //     const { data } = await axiosOther.post("destinationlist");

  //     const destinationList = data?.DataList;
  //     setdestinationlist(destinationList);
  //   } catch (error) {
  //     console.log("Error fetching destination or hotel list:", error);
  //   }
  // };

  // useEffect(() => {
  //   getdestinationlist();
  // }, []);
  const options = [
    { value: "all", label: "All" },
    ...(destinationlist?.map((dest) => ({
      value: dest.id,
      label: dest.Name,
    })) || []),
  ];
  // const handlefilter = async () => {
  //   try {
  //     const destinationsend =
  //       selectedDestination?.value === "all" ? " " : selectedDestination;
  //     const { data } = await axiosOther.post("querymasterlist", {
  //       // Status: id,
  //       Destination: destinationsend?.value,
  //     });

  //     setInitialList(data?.DataList);
  //     setFilterValue(data?.DataList);

  //     // setSelectedDestination("")
  //   } catch (error) {
  //     console.log("Error fetching destination or hotel list:", error);
  //   }
  // };
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
  const queryQuotation = JSON.parse(localStorage.getItem("Query_Qoutation"));
  // console.log(queryQuotation,"local")
  // console.log(qoutationData,"testdata")
  // console.log(queryData, "qdata");
  // console.log(qoutationData, "qoutdata");
  // console.log(queryQuotation, "localstorage");

  // add extra filter data to click
  const handlefilters = async () => {
    try {
      const { data } = await axiosOther.post("querymasterlist", {
        QueryId: filterInput,
        ClientName: clientName,
        AgentName: agentName,
        QueryDate: state?.filter?.QueryDate,
        QueryMonth: state?.filter?.QueryMonth,
        QueryType: type || " ",
        // Status: id || state?.filter?.status,
        Page: currentPage,
        PerPage: rowsPerPage,
      });
      // console.log(data,"filterDataasasas")
      setTotalPage(data?.TotalPages);
      // setIsLoading(false);
      setInitialList(data?.DataList || []);
      setClientName(clientName);
      setAgentName(agentName);
      setFilterValue(data?.DataList || []);
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleFilter();
  }, [type]);

  const handleReset = async () => {
    // Step 1: Reset states
    setFilterInput("");
    setAgentName("");
    setClientName("");
    setIsLoading(true); // optional: show loading spinner

    try {
      // Step 2: Directly use empty strings in the request payload
      const { data } = await axiosOther.post("querymasterlist", {
        QueryId: "",
        ClientName: "",
        AgentName: "",
        QueryDate: state?.filter?.QueryDate || "",
        QueryMonth: state?.filter?.QueryMonth || "",
        Page: currentPage, // ya currentPage, agar 0 index based hai
        PerPage: rowsPerPage,
      });

      // Step 3: Update data
      setInitialList(data?.DataList || []);
      setTotalPage(data?.TotalPages || 0);
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="col-xl-12">
        <div className="d-flex booking-status-scroll gap-3 cardPaddingRemove">
          <div
            className="col-sm-4 col-xl-2"
            style={{ cursor: "pointer" }}
            onClick={() => handleFilter()}
          >
            <div className="card booking">
              <div className="card-body p-0">
                <div className="d-flex align-items-center booking-status booking-status-padding">
                  <span>
                    <i className="fa-brands fa-slack"></i>
                  </span>
                  <div className="ms-2">
                    <h3 className="font-w600 mb-0">
                      {queryStatusList?.["Total Queries"]?.["Total Queries"] ||
                        "0"}
                    </h3>
                    <p className="font-size12 mb-0">Total Query</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {queryStatusList?.["Status Details"] &&
            queryStatusList?.["Status Details"]?.length > 0
            ? queryStatusList?.["Status Details"].map((count, index) => {
              return (
                <div className="col-xl-12" key={index}>
                  <div className="d-flex booking-status-scroll gap-3 cardPaddingRemove">
                    {queryStatusList?.["Status Details"] &&
                      queryStatusList?.["Status Details"]?.length > 0
                      ? queryStatusList?.["Status Details"].map(
                        (count, index) => {
                          return (
                            <div
                              className="col-sm-4 col-xl-2"
                              key={index}
                              style={{ cursor: "pointer" }}
                              onClick={() => handleFilter(count.id)}
                            >
                              <div className="card booking">
                                <div className="card-body p-0">
                                  <div className="d-flex align-items-center booking-status booking-status-padding">
                                    <span>
                                      <i className="fa-brands fa-squarespace"></i>
                                    </span>
                                    <div className="ms-2">
                                      <h3 className="font-w600 mb-0">
                                        {count?.count}
                                      </h3>
                                      <p className="m-0 font-size12">
                                        {count?.name}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }
                      )
                      : QueryArry?.length > 0 &&
                      QueryArry.map((data, index) => {
                        return (
                          <div
                            key={index}
                            className={`col-xl-2 col-sm-4 ${selectedFilter === data
                                ? "selected-filter"
                                : ""
                              }`}
                            onClick={() => handleFilter(data)}
                            style={{ cursor: "pointer" }}
                          >
                            <div className="card booking">
                              <div className="card-body p-0">
                                <div className="d-flex align-items-center booking-status booking-status-padding">
                                  <span>
                                    <i className="fa-brands fa-squarespace"></i>
                                  </span>
                                  <div className="ms-2">
                                    <h3 className="font-w600 mb-0">0</h3>
                                    <p
                                      className="m-0 w-90 font-size12"
                                      style={{
                                        whiteSpace: "normal",
                                        wordWrap: "break-word",
                                        overflowWrap: "break-word",
                                      }}
                                    >
                                      {data}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              );
            })
            : QueryArry?.length > 0 &&
            QueryArry.map((data, index) => {
              return (
                <div
                  key={index}
                  className={`col-xl-2 col-sm-4 ${selectedFilter === data ? "selected-filter" : ""
                    }`}
                >
                  <div className="card booking">
                    <div className="card-body p-0">
                      <div className="d-flex align-items-center booking-status booking-status-padding">
                        <span>
                          <i className="fa-brands fa-squarespace"></i>
                        </span>
                        <div className="ms-2">
                          <h3 className="font-w600 mb-0">0</h3>
                          <p
                            className="m-0 w-90 font-size12"
                            style={{
                              whiteSpace: "normal",
                              wordWrap: "break-word",
                              overflowWrap: "break-word",
                            }}
                          >
                            {data}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      {/* <Tab.Container defaultActiveKey="All">
        

      </Tab.Container> */}

      <div className="custom-tab-1">
        <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
          <div className="d-flex flex-wrap align-items-end justify-content-start gap-2 mb-1">
            <div className="d-flex card-action coin-tabs mb-2 mb-lg-0">
              {/* <Nav as="ul" className="nav nav-tabs">
                <Nav.Item as="li" className="nav-item">
                  <Nav.Link className="nav-link" eventKey="All">
                    All List
                  </Nav.Link>
                </Nav.Item>
              </Nav> */}
              <Nav
                as="ul"
                className="nav-tabs d-flex justify-content-start custom-row-gap"
              >
                <Nav.Item as="li">
                  <Nav.Link
                    eventKey="AllQuery"
                    onClick={() => {
                      setType("");
                    }}
                  >
                    <span className="nav-name fs-4">Queries</span>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item as="li">
                  <Nav.Link
                    eventKey="AllSeries"
                    onClick={() => {
                      setType("Series");
                    }}
                  >
                    <span className="nav-name fs-4">Series</span>
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </div>
            {/* <div className="col-md-1">
            <label htmlFor="" className="fs-5 ps-1">
              Destination{" "}
            </label>
            <div className="nav-item d-flex align-items-center mb-2">
              <Select
                id="destination"
                options={options}
                value={selectedDestination}
                onChange={setSelectedDestination}
                styles={customStyles}
                isSearchable
                className=""
                placeholder={state?.label || ""}
                filterOption={(option, inputValue) =>
                  option.label
                    .toLowerCase()
                    .startsWith(inputValue.toLowerCase())
                }
              />
            </div>
          </div>
          <div className="col-md-1">
            <div className="nav-item d-flex align-items-center">
              <button
                className="btn btn-primary btn-custom-size"
                onClick={handlefilter}
              >
                <i className="fa-brands fa-searchengin me-2"></i>Search
              </button>
            </div>
          </div> */}
            {/* <div className="col-md-4 d-flex  align-items-center justify-content-start">
            <div className="d-flex nav-item align-items-center justify-content-end">
              <div className="input-group search-area">
                <input
                  type="text"
                  className="form-control border"
                  placeholder="Search.."
                  value={filterInput}
                  onChange={(e) => handleFilterChange(e.target.value)}
                />
                <span className="input-group-text border">
                  <i className="cursor-pointer flaticon-381-search-2"></i>
                </span>
              </div>
            </div>
          </div> */}
            {/* Filter data */}
            <div className="col-12 col-lg-auto">
              <div className="d-flex justify-content-between ">
                <label className="" htmlFor="Supplier">
                  Query Id
                </label>
              </div>
              <input
                type="text"
                className="form-control form-control-sm "
                id="selectSuppliername"
                value={filterInput}
                onChange={(e) => setFilterInput(e.target.value)}
                placeholder={"Enter QueryId"}
              />
            </div>
            <div className="col-12 col-lg-auto">
              <div className="d-flex justify-content-between ">
                <label className="" htmlFor="Supplier">
                  Client Name
                </label>
              </div>
              <input
                type="text"
                className="form-control form-control-sm "
                id="selectSuppliername"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder={"Enter Client Name"}
              />
            </div>
            <div className="col-12 col-lg-auto">
              <div className="d-flex justify-content-between">
                <label className="" htmlFor="Supplier">
                  Agent Name
                </label>
              </div>
              <input
                type="text"
                className="form-control form-control-sm "
                id="selectSuppliername"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                placeholder={"Enter Agent Name"}
              />
            </div>
            {/* {console.log(type, 'QuryType215')} */}
            {/* <div className="col-12 col-lg-auto">
            <div className="d-flex justify-content-between">
              <label className="" htmlFor="">
                Query Type
              </label>
            </div>
            <select className='form-control form-control-sm' value={type} onChange={(e) => setType(e.target.value)}>
              <option value=''>All</option>
              {dropdownList?.map((data, index) => (
                <option key={index} value={data?.Name}>
                  {data?.Name}
                </option>
              ))}
            </select>
          </div> */}
            <div className="">
              <button
                className="btn btn-primary btn-custom-size flex-shrink-0 flex-grow-0"
                onClick={handlefilters}
              >
                <i className="fa-brands fa-searchengin me-2"></i>Search
              </button>
            </div>
            <div className="">
              <button
                type="button"
                className="btn btn-dark btn-custom-size flex-shrink-0 flex-grow-0"
                onClick={handleReset}
              >
                <i class="fa fa-refresh me-2" aria-hidden="true"></i>Reset
              </button>
            </div>
            <div
              className="btn btn-primary btn-custom-size"
              onClick={handleDownloadExcelForQueries}
              disabled={excelLoading}
            >
              {excelLoading && (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              )}
              <i className="fa-duotone fa-solid fa-file-import text-white fs-6 me-2"></i>
              Export Excel
            </div>
            {/* <div className="d-flex flex-wrap align-items-center justify-content-center">
            <div className="">
              <Link
                to={"/crm-rate"}
                className="btn btn-custom-size btn-primary"
              >
                View Rates
              </Link>
            </div>
          </div> */}
            <div className="d-flex flex-wrap align-items-center">
              {/* <div className="guest-calendar"></div> */}
              <div className="d-flex gap-2 mt-2 mt-md-0 newest">
                <Link
                  to={"/query"}
                  className="btn btn-custom-size btn-primary"
                  onClick={handleAdd}
                >
                  Add Query
                </Link>
              </div>
            </div>
            {/* <div className="ms-md-auto d-flex flex-wrap align-items-end justify-content-end gap-2">
          
          </div> */}
          </div>
          <ToastContainer />

          <Tab.Content className="">
            <Tab.Pane eventKey="AllQuery" className="mt-2">
              {/* Hotel Content< */}
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
            </Tab.Pane>
            <Tab.Pane eventKey="AllSeries" className="mt-2">
              {/* Series Content */}
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
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>
    </>
  );
};
export default QueryList;
