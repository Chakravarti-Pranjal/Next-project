import React, { useEffect, useState } from 'react';
// import "./SalesRep.css";
import { axiosOther } from '../../../../../http/axios_base_url';
import PaginatedDataTable from '../ReportTable/PaginatedDataTable';

function SalesRep() {
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    userName: "",
    fromDate: "",
    toDate: "",
    month: ""
  });
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getListDataToServer = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await axiosOther.post("salesReport", {
        UserName: filters.userName,
        FromDate: filters.fromDate,
        ToDate: filters.toDate,
        Month: filters.month,
        per_page: rowsPerPage,
        page: currentPage
      });

      if (data?.data) {
        const processedData = data.data.map((item, index) => ({
          ...item,
          id: ((currentPage - 1) * rowsPerPage) + index + 1,
        }));

        setFilteredData(processedData);
        setTotalPages(data.last_page || 0);
        setTotalRows(data.total || 0);
        setRowsPerPage(data.per_page);
      } else {
        setError("No data received from API");
        setFilteredData([]);
        setTotalPages(0);
      }
    } catch (error) {
      console.error("salesReport-error", error);
      setError("Failed to fetch data: " + error.message);
      setFilteredData([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getListDataToServer();
  }, [rowsPerPage, currentPage, filters]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    getListDataToServer();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
  };

  // Transform filteredData → tableData (matching your columns)
  const tableData = filteredData.flatMap(entry => {
    return Object.entries(entry.months || {}).flatMap(([year, monthsData]) => {
      return [
        {
          Name: entry.Name,
          status: "Total Query",
          Year: year,
          ...monthNames.reduce((acc, m) => {
            acc[m] = monthsData[m.toUpperCase()]?.total_queries || 0;
            return acc;
          }, {})
        },
        {
          Name: entry.Name,
          status: "Total Confirm Query",
          Year: year,
          ...monthNames.reduce((acc, m) => {
            acc[m] = monthsData[m.toUpperCase()]?.confirmed_queries || 0;
            return acc;
          }, {})
        }
      ];
    });
  });

  // Columns definition
  const columns = [
    {
      name: "Name",
      selector: row => row.Name,
      cell: row => <span>{row.Name}</span>,
      sortable: true,
      wrap: true
    },
    {
      name: "Status",
      selector: row => row.status,
      cell: row => <span>{row.status}</span>,
      sortable: true,
      wrap: true
    },
    {
      name: "Year",
      selector: row => row.Year,
      cell: row => <span>{row.Year}</span>,
      sortable: true,
      wrap: true
    },
    ...monthNames.map(month => ({
      name: month.toUpperCase(),
      selector: row => row[month],
      cell: row => <span>{row[month]}</span>,
      sortable: true,
      wrap: true
    }))
  ];

  // Client-side search filter (searches tableData, not raw API data)
  const displayedRows = tableData.filter(row =>
    Object.values(row).some(val =>
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className='sales-rep-main'>
      <h3>Sales Report</h3>

      {/* Search / Filters */}
      <div className="sales-rep-main-inputs">
        <div className="sales-rep-main-inputs-paramtr">
          <form onSubmit={handleSearch}>
            <div className="sales-rep-main-inputs-paramtr-flex row mb-3">
              <div className="sales-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                <select
                  className="form-control form-control-sm"
                  name="userName"
                  value={filters.userName}
                  onChange={handleChange}
                >
                  <option value="">All User</option>
                  <option value="Imtiaz">Imtiaz</option>
                  <option value="Aaftab">Aaftab</option>
                  <option value="Sannavar">Sannavar</option>
                </select>
              </div>

              <div className="sales-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                <select
                  className="form-control form-control-sm"
                  name="year"
                  value={filters.year}
                  onChange={handleChange}
                >
                  <option value="">Select Year</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
              </div>

              <div className="sales-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                <select
                  className="form-control form-control-sm"
                  name="month"
                  value={filters.month}
                  onChange={handleChange}
                >
                  <option value="">Select Month</option>
                  {monthNames.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div className="sales-rep-main-inputs-paramtr-flex-slct col-6 col-lg-2 mt-2">
                <button type="submit" className="btn btn-primary btn-custom-size flex-shrink-0 flex-grow-0"> <i className='fa-brands fa-searchengin me-2'></i> Search</button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <PaginatedDataTable
        columns={columns}
        rows={displayedRows}
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

export default SalesRep;
