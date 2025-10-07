import React, { useEffect, useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './TransportAllocationChart.module.css';
import { axiosOther } from '../../../../http/axios_base_url';
import { MdNavigateNext, MdOutlineSkipNext, MdOutlineSkipPrevious } from 'react-icons/md';
import { GrFormPrevious } from 'react-icons/gr';
import { notifyError, notifySuccess } from '../../../../helper/notify';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import PerfectScrollbar from 'react-perfect-scrollbar';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Utility function to format date to dd/mm/yyyy
const formatDateToDisplay = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date)) return dateString;
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Utility function to parse dd-mm-yyyy or dd/mm/yyyy to Date object
const parseDate = (dateString) => {
  if (!dateString) return null;
  const separator = dateString.includes('-') ? '-' : '/';
  const [day, month, year] = dateString.split(separator);
  const date = new Date(year, month - 1, day);
  return isNaN(date) ? null : date;
};

const GuideAllocationChart = ({ setActiveTab }) => {
  const [formvalue, setFormValue] = useState({
    FromDate: '',
    ToDate: '',
    City: '',
    TourType: '',
    GuideDropDown: '',
  });

  const [rows, setRows] = useState([
    {
      id: null, // Initialize id as null for new rows
      sn: 1,
      Reply: '',
      ReferenceId: '',
      groupName: '',
      dept: '',
      fileNo: '',
      DayType: '',
      tourType: '',
      operationDates: '',
      pax: '',
      type: '',
      language: '',
      escortGuide: '',
      program: '',
      agentRef: '',
      remarks: '',
    },
  ]);

  const row = {
    id: null, // Initialize id as null for new rows
    sn: '',
    Reply: '',
    ReferenceId: '',
    groupName: '',
    dept: '',
    fileNo: '',
    DayType: '',
    tourType: '',
    operationDates: '',
    pax: '',
    type: '',
    language: '',
    escortGuide: '',
    program: '',
    agentRef: '',
    remarks: '',
  };

  const [selectedRow, setSelectedRow] = useState(null);
  const [editingRow, setEditingRow] = useState(null);
  const rowRefs = useRef([]);
  const queryQuotation = JSON.parse(localStorage.getItem('Query_Qoutation'));
  const [totalPage, setTotalPage] = useState('');
  const [QoutationData, setQoutationData] = useState({});
  const [dayWiseForm, setDayWiseForm] = useState({ From: '', To: '' });
  const [datas, setData] = useState([]);
  const [paxlist, setpaxlist] = useState([]);
  const [GuideName, setGuideNamelist] = useState([]);
  const [Page, setPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [destinationList, setDestinationList] = useState([]);
  const data = localStorage.getItem('Query_Qoutation');
  const parsedData = JSON.parse(data);

  // Table headers
  const tableHeaders = [
    { label: 'S.N', key: 'sn' },
    { label: 'Reply', key: 'Reply' },
    // { label: 'Agent Reference', key: 'ReferenceId' },
    { label: 'NAME OF THE GROUP', key: 'groupName' },
    { label: 'Dept.', key: 'dept' },
    { label: 'FILE No.', key: 'fileNo' },
    { label: 'Day', key: 'DayType' },
    { label: 'Tour Type', key: 'tourType' },
    { label: 'Operation Dates', key: 'operationDates' },
    { label: 'PAX', key: 'pax' },
    { label: 'Type', key: 'type' },
    { label: 'Language', key: 'language' },
    { label: 'Escort', key: 'escortGuide' },
    { label: 'Program', key: 'program' },
    { label: 'Agent Ref.', key: 'agentRef' },
    { label: 'Remarks', key: 'remarks' },
  ];

  // PDF headers
  const pdfHeaders = [
    { header: 'S.N', key: 'sn', width: 8 },
    { header: 'Reply', key: 'Reply', width: 8 },
    { header: 'Agent Reference', key: 'ReferenceId', width: 10 },
    { header: 'Name of the Group', key: 'groupName', width: 20 },
    { header: 'Dept.', key: 'dept', width: 12 },
    { header: 'File No.', key: 'fileNo', width: 12 },
    { header: 'Day', key: 'DayType', width: 8 },
    { header: 'Tour Type', key: 'tourType', width: 12 },
    { header: 'Operation Dates', key: 'operationDates', width: 15 },
    { header: 'PAX', key: 'pax', width: 8 },
    { header: 'Type', key: 'type', width: 12 },
    { header: 'Language', key: 'language', width: 12 },
    { header: 'Escort/Guide', key: 'escortGuide', width: 15 },
    { header: 'Program', key: 'program', width: 15 },
    { header: 'Agent Ref.', key: 'agentRef', width: 15 },
    { header: 'Remarks', key: 'remarks', width: 20 },
  ];

  // Handle date picker changes for FromDate and ToDate
  const getFromDate = () => {
    return parseDate(formvalue.FromDate);
  };

  const getToDate = () => {
    return parseDate(formvalue.ToDate);
  };

  const handleCalender = (date) => {
    const formattedDate = date
      ? date.toLocaleDateString('en-GB').split('/').join('-')
      : '';
    setFormValue((prev) => ({
      ...prev,
      FromDate: formattedDate,
    }));
  };

  const handleToCalender = (date) => {
    const formattedDate = date
      ? date.toLocaleDateString('en-GB').split('/').join('-')
      : '';
    setFormValue((prev) => ({
      ...prev,
      ToDate: formattedDate,
    }));
  };

  // Handle cell value change
  const handleCellChange = (rowIndex, key, value) => {
    const updatedRows = [...rows];
    if (key === 'operationDates') {
      const formattedDate = value
        ? value.toLocaleDateString('en-GB').split('/').join('-')
        : '';
      updatedRows[rowIndex][key] = formattedDate;
    } else {
      updatedRows[rowIndex][key] = value;
    }
    if (key === 'sn' && rowIndex === updatedRows.length - 1) {
      updatedRows[rowIndex].sn = rowIndex + 1;
    }
    setRows(updatedRows);
  };

  const fetchQueryQuotation = async () => {
    try {
      const { data } = await axiosOther.post('lisFinalQuotation', {
        QueryId: queryQuotation?.QueryID,
        QuotationNo: queryQuotation?.QoutationNum,
      });
      setQoutationData(data?.FilteredQuotations[0] || {});
    } catch (error) {
      console.error('Error fetching quotation:', error);
    }
  };

  useEffect(() => {
    fetchQueryQuotation();
  }, [queryQuotation?.QueryID]);

  // Add new row
  const handletIncrement = () => {
    setRows((prev) => {
      let news = [...prev];
      news = [...news, { ...row, sn: prev.length + 1, Reply: '', ReferenceId: '', DayType: '' }];
      return news;
    });
  };

  const handleDecrement = (index) => {
    if (rows.length > 1) {
      setRows((prev) => {
        let delaterows = [...prev];
        delaterows = rows.filter((_, i) => i !== index);
        delaterows = delaterows.map((row, i) => ({ ...row, sn: i + 1 }));
        return delaterows;
      });
    }
  };

  const deleteRow = () => {
    if (selectedRow !== null) {
      const updatedRows = rows.filter((_, index) => index !== selectedRow);
      setRows(updatedRows.map((row, i) => ({ ...row, sn: i + 1 })));
      setSelectedRow(null);
    }
  };

  const posttogetdata = async () => {
    try {
      const { data } = await axiosOther.post('destinationlist');
      setDestinationList(data?.DataList);
    } catch (error) {
      console.log('error', error);
    }
    try {
      const { data } = await axiosOther.post('paxlist');
      setpaxlist(data?.DataList);
    } catch (error) {
      console.log('error', error);
    }
    try {
      const { data } = await axiosOther.post('guidelist');
      setGuideNamelist(data?.DataList);
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    posttogetdata();
  }, []);

  const handleSearch = async (e) => {
    try {
      const response = await axiosOther.post('list-guide-chart', {
        ...formvalue,
        per_page: rowsPerPage,
        page: currentPage,
        QueryId: parsedData?.QueryID,
      });
      setData(response?.data?.data || []);
      setTotalPage(response?.data?.total);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [rowsPerPage, currentPage]);

  const mergechart = () => {
    const datachart = datas?.map((item, index) => ({
      id: item?.id || null, // Preserve the ID from backend data
      sn: index + 1,
      Reply: item?.Reply || '',
      ReferenceId: item?.ReferenceId || '',
      groupName: item?.NameOfGroup || '',
      dept: item?.Department || '',
      fileNo: item?.FileNo || '',
      DayType: item?.DayType || '',
      tourType: item?.TourType || '',
      operationDates: formatDateToDisplay(item?.OperationDate) || '',
      pax: item?.Pax || '',
      type: item?.Type || '',
      language: item?.Language || '',
      escortGuide: item?.ExcortType || '',
      program: item?.Program || '',
      agentRef: item?.AgentRef || '',
      remarks: item?.Remarks || '',
    }));
    setRows(datachart);
  };

  useEffect(() => {
    mergechart();
  }, [datas]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (editingRow !== null) {
        const currentRow = rowRefs.current[editingRow];
        if (currentRow && !currentRow.contains(event.target)) {
          setEditingRow(null);
        }
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [editingRow]);

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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
  };

  const handleReset = async () => {
    try {
      const response = await axiosOther.post('list-guide-chart', {
        ...formvalue,
        per_page: rowsPerPage,
        page: currentPage,
        QueryId: parsedData?.QueryID,
      });
      setData(response?.data?.data || []);
      setTotalPage(response?.data?.total);
    } catch (error) {
      console.error(error);
    }
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    const transformedRows = rows.map((row) => {
      const rowData = {
        NameOfGroup: row.groupName || '',
        Department: row.dept || '',
        FileNo: row.fileNo || '',
        TourType: row.tourType || '',
        OperationDate: row.operationDates || '',
        Pax: String(row.pax) || '',
        Type: row.type || '',
        Language: row.language || '',
        ReferenceId: row.ReferenceId || '',
        GuideDropDown: row.escortGuide || '',
        Program: row.program || '',
        AgentRef: row.agentRef || '',
        Remarks: row.remarks || '',
        Reply: row.Reply || '',
        DayType: row.DayType || '',
        Status: 1,
        AddedBy: 101,
        UpdatedBy: 101,
        QueryId: parsedData?.QueryID,
      };

      // Include id only if it exists (for existing rows)
      if (row.id) {
        rowData.id = row.id;
      }

      return rowData;
    });

    console.log(transformedRows, 'transformedRows');

    try {
      const { data } = await axiosOther.post('store-guide-chart', transformedRows);
      if (data?.status === true || data?.Status == 1) {
        notifySuccess(data?.Message);
        // Refresh data after successful save
        handleSearch();
      } else {
        notifyError(data?.message || 'Failed to save data');
      }
    } catch (error) {
      console.error('Error saving guide chart:', error);
      notifyError(error?.response?.data?.message || 'An error occurred while saving');
    }
  };

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF('portrait', 'mm', 'a4');

      const tableColumn = pdfHeaders.map((header) => header.header);
      const tableRows = rows.map((row, index) => [
        index + 1,
        row.Reply || '',
        row.ReferenceId || '',
        row.groupName || '',
        row.dept || '',
        row.fileNo || '',
        row.DayType || '',
        row.tourType || '',
        row.operationDates || '',
        row.pax || '',
        row.type || '',
        row.language || '',
        row.escortGuide || '',
        row.program || '',
        row.agentRef || '',
        row.remarks || '',
      ]);

      doc.setFontSize(14);
      doc.text('Guide Allocation Chart', 14, 15);

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        theme: 'grid',
        headStyles: {
          fillColor: '#f9f9f9',
          textColor: '#000',
          fontSize: 8,
          halign: 'center',
          valign: 'middle',
          lineWidth: 0.1,
          lineColor: '#ccc',
        },
        bodyStyles: {
          fontSize: 7,
          halign: 'center',
          valign: 'middle',
          lineWidth: 0.1,
          lineColor: '#ccc',
        },
        margin: { left: 10, right: 10 },
        columnStyles: pdfHeaders.reduce((acc, header, index) => {
          acc[index] = { cellWidth: header.width * 0.7 };
          return acc;
        }, {}),
        styles: {
          cellPadding: 1,
          overflow: 'linebreak',
        },
        didParseCell: (data) => {
          data.cell.styles.cellWidth = 'auto';
          if (data.section === 'body') {
            data.cell.styles.minCellHeight = 10;
          }
        },
      });

      doc.save('Guide_Allocation.pdf');
    } catch (error) {
      console.error('Error generating PDF file:', error);
      notifyError('Failed to generate PDF file');
    }
  };

  return (
    <form onSubmit={handlesubmit}>
      <div className="col-12 d-flex gap-3 justify-content-end w-100">
        <button className="btn btn-primary btn-custom-size" name="SaveButton" type="submit">
          <span className="me-1">Save</span>
          <i className="fa-solid fa-upload"></i>
        </button>
        <button
          className="btn btn-primary btn-custom-size"
          name="SaveButton"
          type="button"
          onClick={handleDownloadPDF}
        >
          <span className="me-1">Print</span>
          <i className="fa-solid fa-print"></i>
        </button>
        <button
          className="btn btn-dark btn-custom-size"
          name="SaveButton"
          onClick={() => setActiveTab('TransportAllocationChart')}
          type="button"
        >
          <span className="me-1">Back</span>
          <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
        </button>
        <button
          className="btn btn-primary btn-custom-size"
          name="SaveButton"
          onClick={() => setActiveTab('GuideAllocationChart')}
          type="button"
        >
          <span className="me-1">Next</span>
          <i className="fa-solid fa-forward text-primary bg-white p-1 rounded"></i>
        </button>
      </div>
      <div className="px-2">
        <div className="row form-row-gap mb-2 align-items-end">
          <div className="position-relative col-md-12 col-lg-3">
            <span
              className="position-absolute px-2 dateCardFeildSet"
              style={{
                top: '-0.7rem',
                left: '1rem',
                fontSize: '0.75rem',
                zIndex: 1,
              }}
            >
              Date Filter
            </span>
            <div className="row border rounded px-2 py-2 pe-3 me-3">
              <div className="col-md-12 col-lg-6">
                <label className="">From Date</label>
                <DatePicker
                  popperProps={{
                    strategy: "fixed", // Ensures the popper is positioned relative to the viewport
                  }}
                  className="form-control form-control-sm"
                  selected={getFromDate()}
                  onChange={handleCalender}
                  dateFormat="dd-MM-yyyy"
                  name="FromDate"
                  isClearable
                  todayButton="Today"
                  placeholderText="Tour Start Date"
                />
              </div>
              <div className="col-md-12 col-lg-6">
                <label className="">To Date</label>
                <DatePicker
                  popperProps={{
                    strategy: "fixed", // Ensures the popper is positioned relative to the viewport
                  }}
                  className="form-control form-control-sm"
                  selected={getToDate()}
                  onChange={handleToCalender}
                  dateFormat="dd-MM-yyyy"
                  name="ToDate"
                  isClearable
                  todayButton="Today"
                  placeholderText="Tour End Date"
                />
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <label className="m-0">Escort / Guide Name</label>
            <select
              className="form-control form-control-sm"
              name="GuideDropDown"
              onChange={(e) =>
                setFormValue({ ...formvalue, GuideDropDown: e.target.value })
              }
            >
              <option value={''}>Select</option>
              {GuideName?.map((agent, index) => (
                <option value={agent?.id} key={index + 1}>
                  {agent?.Name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6 col-lg-2">
            <label className="m-0">City</label>
            <select
              className="form-control form-control-sm"
              name="City"
              onChange={(e) => setFormValue({ ...formvalue, City: e.target.value })}
            >
              <option value={''}>All</option>
              {destinationList?.map((qout, index) => (
                <option value={qout?.id} key={index + 1}>
                  {qout?.Name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6 col-lg-2">
            <label className="m-0">Type</label>
            <select
              className="form-control form-control-sm"
              name="TourType"
              onChange={(e) =>
                setFormValue({ ...formvalue, TourType: e.target.value })
              }
            >
              <option value={''}>Select</option>
              {paxlist?.map((agent, index) => (
                <option value={agent?.Paxtype} key={index + 1}>
                  {agent?.Paxtype}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-1 h-10">
            <div className="d-flex justify-content-between align-items-end h-90 mt-3 px-2 gap-2">
              <button
                type="button"
                className="btn btn-dark btn-custom-size flex-shrink-0 flex-grow-0"
                onClick={handleReset}
              >
                <i className="fa fa-refresh me-2" aria-hidden="true"></i>Sync
              </button>
              <button
                type="button"
                onClick={handleSearch}
                className="btn btn-primary btn-custom-size"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Editable Table */}
      <div className="mt-3">
        <div className="d-flex w-100 justify-content-end gap-2 mb-2">
          <button
            type="button"
            className="btn btn-primary btn-custom-size"
            style={{
              padding: '0 3px',
              borderRadius: '4px',
              fontSize: '11px',
            }}
            onClick={() => handletIncrement()}
          >
            Add
            <i className="fa-solid fa-plus ms-2" />
          </button>
          <button
            type="button"
            className="btn btn-primary btn-custom-size"
            onClick={() => handleDecrement(rows.length - 1)}
            style={{
              padding: '0 3px',
              borderRadius: '4px',
              fontSize: '11px',
            }}
          >
            Remove
            <i className="fa-solid fa-minus ms-2" />
          </button>
        </div>
        <PerfectScrollbar className="dlabnav-scroll d-flex flex-column justify-content-between">
          <table className="table table-bordered itinerary-table">
            <thead>
              <tr>
                {tableHeaders.map((header, index) => (
                  <th key={index}>{header.label}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={index}
                  ref={(el) => (rowRefs.current[index] = el)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingRow(index);
                  }}
                >
                  {tableHeaders.map((header, colIndex) => (
                    <td key={colIndex}>
                      {index === editingRow ? (
                        header.key === 'Reply' ? (
                          <input
                            type="checkbox"
                            checked={row[header.key] === 'yes'}
                            onChange={(e) =>
                              handleCellChange(
                                index,
                                header.key,
                                e.target.checked ? 'yes' : ''
                              )
                            }
                            style={{ width: '20px', height: '20px' }}
                          />
                        ) : header.key === 'tourType' ? (
                          <select
                            value={row[header.key] || ''}
                            onChange={(e) =>
                              handleCellChange(index, header.key, e.target.value)
                            }
                            className="form-control form-control-sm"
                            style={{ width: '130px' }}
                          >
                            <option value="">Select</option>
                            {paxlist?.map((agent, idx) => (
                              <option value={agent?.Paxtype} key={idx + 1}>
                                {agent?.Paxtype}
                              </option>
                            ))}
                          </select>
                        ) : header.key === 'escortGuide' ? (
                          <select
                            value={row[header.key] || ''}
                            onChange={(e) =>
                              handleCellChange(index, header.key, e.target.value)
                            }
                            className="form-control form-control-sm"
                            style={{ width: '130px' }}
                          >
                            <option value="">Select</option>
                            {GuideName?.map((guide, idx) => (
                              <option value={guide?.Name} key={idx + 1}>
                                {guide?.Name}
                              </option>
                            ))}
                          </select>
                        ) : header.key === 'operationDates' ? (
                          <DatePicker
                            popperProps={{
                              strategy: "fixed", // Ensures the popper is positioned relative to the viewport
                            }}
                            className="form-control form-control-sm"
                            selected={parseDate(row[header.key])}
                            onChange={(date) =>
                              handleCellChange(index, header.key, date)
                            }
                            dateFormat="dd-MM-yyyy"
                            placeholderText="Select Date"
                            isClearable
                            style={{ width: '130px' }}
                          />
                        ) : (
                          <input
                            type="text"
                            value={row[header.key] || ''}
                            onChange={(e) =>
                              handleCellChange(index, header.key, e.target.value)
                            }
                            className="form-control form-control-sm"
                            style={{ width: '130px' }}
                          />
                        )
                      ) : (
                        <span>
                          {header.key === 'operationDates'
                            ? formatDateToDisplay(row[header.key])
                            : row[header.key] || ''}
                        </span>
                      )}
                    </td>
                  ))}
                  <td>
                    <div className="d-flex w-100 justify-content-center gap-2">
                      <span onClick={() => handletIncrement()}>
                        <i className="la la-plus border cursor-pointer bg-success text-white rounded-pill fontSize10px padding1px"></i>
                      </span>
                      <span onClick={() => handleDecrement(index)}>
                        <i className="la la-minus border cursor-pointer bg-primary text-white rounded-pill fontSize10px padding1px"></i>
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </PerfectScrollbar>
        <CustomPagination />
      </div>
    </form>
  );
};

export default GuideAllocationChart;