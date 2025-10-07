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
import activeProposal from "/assets/icons/activeIcons/Proposal.svg";
import { useLocation } from "react-router-dom";
import { table_custom_style } from "../../../../css/custom_style";

const ProposalList = () => {
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
        Status: 5,
        Page: currentPage,
        PerPage: rowsPerPage,
      });
      console.log(data, 'QUERY435')
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

   const openwordfile = async () => {
    try {
      localStorage.setItem("qoutationList", JSON.stringify(qoutationList));
      localStorage.setItem("query", JSON.stringify(query));
      // const url = `${import.meta.env.VITE_BASE_URL
      //   }/Proposals?${encodeURIComponent(query?.QueryAlphaNumId)}`;
      const url = `Proposals?${encodeURIComponent(query?.QueryAlphaNumId)}`;
      window.open(
        url,
        "_blank",
        "noopener,noreferrer",
        "PopupWindow",
        "width=100%,height=100%,top=100,left=100"
      );
    } catch (err) {
      console.error("Error generating Word file:", err);
    }
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
      name: "Proposal",
      cell: (row) => (
        <div className="icon-container ">
            <button
                 className="btn btn-primary btn-custom-size px-1 quotation-button newQuotationIconButton"
                 onClick={()=>openwordfile}
                 >
                {/* Proposal */}
                <img
                  src={activeProposal}
                  alt="icon"
                  className="icons newQuotationIcon"
                />
            </button>
            <p className="tooltip-text py-1 px-1">Proposal</p>
        </div>
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
export default ProposalList;
