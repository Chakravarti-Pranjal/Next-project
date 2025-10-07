import React, { useState, useEffect } from 'react';
// import "./AgentWiseQueryRep.css";
import PaginatedDataTable from './ReportTable/PaginatedDataTable';
import { axiosOther } from '../../../../http/axios_base_url';

function LogingLog() {

  const columns = [
    {
      wrap: true,
      name: "S.No",
      selector: (row, index) => index,
      cell: (row, index) => (
        <span>{(currentPage - 1) * rowsPerPage + index + 1}</span>
      ),
      sortable: true,
      width: "6rem",
    },
    {
      wrap: true,
      name: "User Agent",
      selector: row => row.user_agent,
      cell: row => <span>{row.user_agent}</span>,
      sortable: true,
      // width: "8rem",
    },
    {
      wrap: true,
      name: "Date Time",
      selector: row => row.logged_in_at,
      cell: row => <span>{row.logged_in_at}</span>,
      sortable: true,
      width: "12rem",
    },
    {
      wrap: true,
      name: "IP Address",
      selector: row => row.ip_address,
      cell: row => <span>{row.ip_address}</span>,
      sortable: true,
      width: "12rem",
    },
  ];

  const [AgentTurn, setAgentTurn] = useState([]);
  // const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [agents, setAgents] = useState([]);

  const data = localStorage.getItem("token");
  const parsedData = data ? JSON.parse(data) : null;
  const getListDataToServer = async (params = filters) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axiosOther.post("loginhistory", {
        // CompanyId: "",
        user_id: parsedData?.UserID,
        page: currentPage,
        perPage: rowsPerPage,
      });

      if (data?.history) {
        const processedData = data.history.map((item, index) => ({
          ...item,
          id: (currentPage - 1) * rowsPerPage + (index + 1),
        }));

        setAgentTurn(processedData);
        const agentsList = data?.history.map(item => item.ClientName);
        setAgents([...new Set(agentsList)]);
        setTotalPages(data.TotalPages);
        setTotalRows(data.TotalRecord);
        setRowsPerPage(data.per_page || rowsPerPage);
      } else {
        setError("No data received from API");
        setAgentTurn([]);
      }
    } catch (error) {
      console.log("agentwise-error", error);
      setError("Failed to fetch data: " + error.message);
      setAgentTurn([]);
    } finally {
      setLoading(false);
    }
  };
  console.log(AgentTurn, "sxxx")

  useEffect(() => {
    getListDataToServer(currentPage);
  }, [currentPage, rowsPerPage]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    getListDataToServer(filters);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  };

  return (
    <div className='agentwise-query-rep-main'>
      <h3>Loging Log</h3>
      {loading && <div>Loading...</div>}
      {error && <div className="error">{error}</div>}

      <PaginatedDataTable
        columns={columns}
        rows={AgentTurn}
        paginationTotalRows={totalRows}
        rowsPerPage={rowsPerPage}
        currentPage={currentPage}
        totalPage={totalPages}
        onRowsPerPageChange={handleRowsPerPageChange}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default LogingLog;
