import React, { useEffect, useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './TransportAllocationChart.module.css';
import { tr } from 'date-fns/locale';
import { axiosOther } from '../../../../http/axios_base_url';
import { MdNavigateNext, MdOutlineSkipNext, MdOutlineSkipPrevious } from 'react-icons/md';
import { GrFormPrevious } from 'react-icons/gr';
import { notifyError, notifySuccess } from '../../../../helper/notify';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import DarkCustomTimePicker from '../helper-methods/TimePicker';
import PerfectScrollbar from "react-perfect-scrollbar";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const TransportAllocationChart = ({ setActiveTab }) => {
  const [formvalue, setFormValue] = useState({
    FromDate: "",
    ToDate: "",
    City: "",
    Agent: "",
    TransferType: [],
    LocalAgent: "",
    ChartCode: ""
  });

  const [rows, setRows] = useState([
    {
      date: '',
      FileNo: '',
      localAgent: '',
      type: '',
      department: '',
      clientName: '',
      pickupDrop: '',
      pax: '',
      hotel: '',
      flightNo: '',
      flightTime: '',
      FlightName: '',
      program: '',
      rptTime: '',
      vehicle: '',
      representative: '',
      driver: '',
    },
  ]);
  const row = {
    date: '',
    FileNo: '',
    localAgent: '',
    type: '',
    department: '',
    clientName: '',
    pickupDrop: '',
    pax: '',
    hotel: '',
    flightNo: '',
    flightTime: '',
    FlightName: '',
    program: '',
    rptTime: '',
    vehicle: '',
    representative: '',
    driver: '',
    AgentName: ''
  };
  const [selectedRow, setSelectedRow] = useState(null);
  const [editingRow, setEditingRow] = useState(null);
  const rowRefs = useRef([]);
  const queryQuotation = JSON.parse(localStorage.getItem("Query_Qoutation"));
  const [totalPage, setTotalPage] = useState("");
  const [QoutationData, setQoutationData] = useState({});
  const [dayWiseForm, setDayWiseForm] = useState({ From: '', To: '' });
  const [datas, setData] = useState([]);
  const [Agentlist, setAgentlist] = useState([]);
  const [Page, setPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [destinationList, setDestinationList] = useState([]);
  const [supllierList, setsupllierList] = useState([]);
  const [vehicletypeList, setvehicletypeList] = useState([]);
  const [transferTypeList, setTransferTypeList] = useState([]);
  const [diverlistList, setdiverlistList] = useState([]);
  const [chartcodeList, setchartcodeList] = useState([]);

  const data = localStorage.getItem("Query_Qoutation");
  const parsedData = JSON.parse(data);

  const tableHeaders = [
    { label: 'Date', key: 'date' },
    { label: 'File No.', key: 'FileNo' },
    { label: 'Dept.', key: 'department' },
    { label: 'Client', key: 'clientName' },
    { label: 'Pax', key: 'pax' },
    { label: 'Type', key: 'type' },
    { label: 'Hotel', key: 'hotel' },
    { label: 'Flight No', key: 'flightNo' },
    { label: 'Flight Time', key: 'flightTime' },
    { label: 'PickUp Time', key: 'pickupDrop' },
    { label: 'Program', key: 'program' },
    { label: 'RPT TIME', key: 'rptTime' },
    { label: 'Vehicle', key: 'vehicle' },
    { label: 'Representative', key: 'representative' },
    { label: 'Driver', key: 'driver' },
  ];

  const getFromDate = () => {
    const [day, month, year] = formvalue.FromDate.split("-");
    const date = new Date(year, month - 1, day);
    return isNaN(date) ? null : date;
  };

  const getToDate = () => {
    const [day, month, year] = formvalue.ToDate.split("-");
    const date = new Date(year, month - 1, day);
    return isNaN(date) ? null : date;
  };

  const handleCalender = (date) => {
    const formattedDate = date
      ? date.toLocaleDateString("en-GB").split("/").join("-")
      : "";
    setFormValue((formvalue) => ({
      ...formvalue,
      FromDate: formattedDate,
    }));
  };

  const handleToCalender = (date) => {
    const formattedDate = date
      ? date.toLocaleDateString("en-GB").split("/").join("-")
      : "";
    setFormValue((formvalue) => ({
      ...formvalue,
      ToDate: formattedDate,
    }));
  };

  const selectedDayDate = (type) => {
    if (type === 'FromDate') {
      return dayWiseForm?.FromDate ? new Date(dayWiseForm.FromDate) : null;
    }
    if (type === 'ToDate') {
      return dayWiseForm?.ToDate ? new Date(dayWiseForm.ToDate) : null;
    }
    return null;
  };

  const handleCellChange = (rowIndex, key, value) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex][key] = value;
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

  const handletIncrement = () => {
    setRows((prev) => {
      let news = [...prev];
      news = [...news, row];
      return news;
    });
  };

  const handleDecrement = (index) => {
    if (rows.length > 1) {
      setRows((prev) => {
        let delaterows = [...prev];
        delaterows = rows.filter((_, i) => i !== index);
        return delaterows;
      });
    }
  };

  const deleteRow = () => {
    if (selectedRow !== null) {
      const updatedRows = rows.filter((_, index) => index !== selectedRow);
      setRows(updatedRows);
      setSelectedRow(null);
    }
  };

  const posttogetdata = async () => {
    try {
      const { data } = await axiosOther.post("agentlist", {
        id: "",
        BussinessType: QoutationData?.BusinessTypeId || " ",
      });
      setAgentlist(data?.DataList);
    } catch (error) {
      console.log("agent-error", error);
    }
    try {
      const { data } = await axiosOther.post("destinationlist");
      setDestinationList(data?.DataList);
    } catch (error) {
      console.log("error", error);
    }
    try {
      const { data } = await axiosOther.post("supplierlist", {
        SupplierService: [4]
      });
      setsupllierList(data?.DataList);
    } catch (error) {
      console.log("error", error);
    }
    try {
      const { data } = await axiosOther.post("vehicletypemasterlist", {
        SupplierService: [4]
      });
      setvehicletypeList(data?.DataList);
    } catch (error) {
      console.log("error", error);
    }
    try {
      const { data } = await axiosOther.post("transfertypemasterlist");
      setTransferTypeList(data?.DataList);
    } catch (error) {
      console.log("error", error);
    }
    try {
      const { data } = await axiosOther.post("drivermasterlist");
      setdiverlistList(data?.DataList);
    } catch (error) {
      console.log("error", error);
    }
    try {
      const { data } = await axiosOther.post("chartcodelist", {
        QueryId: parsedData?.QueryID
      });
      setchartcodeList(data?.Data);
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    posttogetdata();
  }, []);

  const handleSearch = async (e) => {
    try {
      const response = await axiosOther.post("transportchart", {
        ...formvalue,
        transferTypeIds: formvalue.TransferType,
        per_page: rowsPerPage,
        page: currentPage,
        QueryId: parsedData?.QueryID
      });
      setData(response?.data?.data || []);
      setTotalPage(response?.data?.total);
    } catch (error) {
      console.error(error);
      console.error('Error fetching transport chart:', error);
      notifyError("Failed to fetch transport chart data");
    }
  };

  useEffect(() => {
    handleSearch();
  }, [rowsPerPage, currentPage]);

  const mergechart = () => {
    const datachart = datas?.map((item, index) => ({
      ...item,
      date: item?.Date,
      FileNo: item?.FileNo || '',
      localAgent: item?.ClienName,
      type: item?.Type,
      department: item?.Department || '',
      clientName: item?.ClienName || '',
      pickupDrop: item?.PickUpTime || '',
      pax: item?.Pax || '',
      hotel: item?.HotelName || '',
      flightNo: item?.FlightNumber || '',
      flightTime: item?.FlightTime || '',
      FlightName: item?.FlightName || '',
      program: item?.Program || '',
      rptTime: item?.RptTime || '',
      vehicle: item?.Vehicle || '',
      representative: item?.Representative || '',
      driver: item?.Driver || '',
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

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = rows.map((row) => ({
        id: row.id,
        Date: row.date || '',
        FileNo: row.FileNo || '',
        Department: row.department || '',
        AgentName: row.AgentName || '',
        ClienName: row.clientName || '',
        Pax: row.pax || '',
        Type: row.type || '',
        HotelName: row.hotel || '',
        FlightNumber: row.flightNo || '',
        FlightName: row.FlightName || '',
        FlightTime: row.flightTime || '',
        PickUpTime: row.pickupDrop || '',
        Program: row.program || '',
        RptTime: row.rptTime || '',
        Vehicle: row.vehicle || '',
        Representative: row.representative || '',
        Driver: row.driver || '',
        QueryId: parsedData?.QueryID || '',
        ChartCode: formvalue.ChartCode || ''
      }));

      const { data } = await axiosOther.post("addtransportchart", payload);
      if (data?.Status === 1 || data?.Status === 0) {
        notifySuccess(data?.message || 'Transport chart saved successfully');
      }
    } catch (error) {
      console.error("error", error);
      notifyError(error?.message || 'Failed to save transport chart');
    }
  };

  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split("-");
    return new Date(`${year}-${month}-${day}`);
  };

  const formatDate = (dateObj) => {
    if (!dateObj) return "";
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const excelHeaders = [
    { header: 'Date', key: 'date', width: 11 },
    { header: 'File No.', key: 'FileNo', width: 5 },
    { header: 'Dept.', key: 'department', width: 10 },
    { header: 'Client', key: 'clientName', width: 15 },
    { header: 'Pax', key: 'pax', width: 5 },
    { header: 'Type', key: 'type', width: 10 },
    { header: 'Hotel', key: 'hotel', width: 15 },
    { header: 'Flight No', key: 'flightNo', width: 10 },
    { header: 'Flight Time', key: 'flightTime', width: 10 },
    { header: 'PickUp Time', key: 'pickupDrop', width: 10 },
    { header: 'Program', key: 'program', width: 15 },
    { header: 'RPT TIME', key: 'rptTime', width: 10 },
    { header: 'Vehicle', key: 'vehicle', width: 10 },
    { header: 'Representative', key: 'representative', width: 15 },
    { header: 'Driver', key: 'driver', width: 15 },
  ];

  const handleDownloadExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet('Transport Allocation');

      sheet.columns = excelHeaders;

      rows.forEach((row, index) => {
        sheet.addRow({
          sno: index + 1,
          date: row.date || '',
          FileNo: row.FileNo || '',
          department: row.department || '',
          clientName: row.clientName || '',
          pax: row.pax || '',
          type: row.type || '',
          hotel: row.hotel || '',
          flightNo: row.flightNo || '',
          flightTime: row.flightTime || '',
          pickupDrop: row.pickupDrop || '',
          program: row.program || '',
          rptTime: row.rptTime || '',
          vehicle: row.vehicle || '',
          representative: row.representative || '',
          driver: row.driver || '',
        });
      });

      const headerRow = sheet.getRow(1);
      headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF333333' },
      };
      headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
      headerRow.height = 25;

      sheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          row.height = 20;
          row.alignment = { vertical: 'middle', horizontal: 'center' };
        }
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, 'Transport_Allocation.xlsx');
    } catch (error) {
      console.error('Error generating Excel file:', error);
      notifyError('Failed to generate Excel file');
    }
  };

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF('portrait', 'mm', 'a4');

      const tableColumn = excelHeaders.map(header => header.header);

      const tableRows = rows.map((row, index) => [
        row.date || '',
        row.FileNo || '',
        row.department || '',
        row.clientName || '',
        row.pax || '',
        row.type || '',
        row.hotel || '',
        row.flightNo || '',
        row.flightTime || '',
        row.pickupDrop || '',
        row.program || '',
        row.rptTime || '',
        row.vehicle || '',
        row.representative || '',
        row.driver || '',
      ]);

      doc.setFontSize(14);
      doc.text('Transport Allocation Chart', 14, 15);

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        theme: 'grid', // Ensures grid lines are drawn
        headStyles: {
          fillColor: '#f9f9f9', // Background color for header
          textColor: '#000', // Text color for header
          fontSize: 8,
          halign: 'center',
          valign: 'middle',
          lineWidth: 0.1, // Border width for header
          lineColor: '#ccc', // Border color for header
        },
        bodyStyles: {
          fontSize: 7,
          halign: 'center',
          valign: 'middle',
          lineWidth: 0.1, // Border width for body cells
          lineColor: '#ccc', // Border color for body cells
        },
        margin: { left: 10, right: 10 },
        columnStyles: excelHeaders.reduce((acc, header, index) => {
          acc[index] = { cellWidth: header.width * 0.6 };
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

      doc.save('Transport_Allocation.pdf');
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
          onClick={handleDownloadPDF}
          type='button'
        >
          <span className="me-1">Print</span>
          <i className="fa-solid fa-print"></i>
        </button>
        <button
          type='button'
          className="btn btn-dark btn-custom-size"
          name="SaveButton"
          onClick={() => setActiveTab('PLACard')}
        >
          <span className="me-1">Back</span>
          <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
        </button>
        <button
          type='button'
          className="btn btn-primary btn-custom-size"
          name="SaveButton"
          onClick={() => setActiveTab('GuideAllocationChart')}
        >
          <span className="me-1">Next</span>
          <i className="fa-solid fa-forward text-primary bg-white p-1 rounded"></i>
        </button>
      </div>
      <div className='px-2'>
        <div className="row form-row-gap mb-2 mb-lg-4">
          <div className="col-md-2">
            <label className="m-0">Chart Code</label>
            <select className="form-control form-control-sm" name="ChartCode" onChange={(e) => setFormValue({ ...formvalue, ChartCode: e.target.value })}>
              <option value={''}>Select</option>
              {chartcodeList?.map((agent, index) => (
                <option value={agent?.ChartCode} key={index + 1}>{agent?.ChartCode}</option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <label className="m-0">Local Agent</label>
            <select className="form-control form-control-sm" name="LocalAgent" onChange={(e) => setFormValue({ ...formvalue, LocalAgent: e.target.value })}>
              <option value={''}>Select</option>
              {supllierList?.map((agent, index) => (
                <option value={agent?.id} key={index + 1}>{agent?.Name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6 col-lg-2">
            <label className="m-0">City</label>
            <select className="form-control form-control-sm" name="City" onChange={(e) => setFormValue({ ...formvalue, City: e.target.value })}>
              <option value={''}>All</option>
              {destinationList?.map((qout, index) => (
                <option value={qout?.id} key={index + 1}>{qout?.Name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6 col-lg-2">
            <label className="m-0">Agent</label>
            <select className="form-control form-control-sm" name="Agent" onChange={(e) => setFormValue({ ...formvalue, Agent: e.target.value })}>
              <option value={''}>Select</option>
              {Agentlist?.map((agent, index) => (
                <option value={agent?.id} key={index + 1}>{agent?.CompanyName}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="row form-row-gap mb-2">
          <div className="position-relative col-md-12 col-lg-3 mt-2">
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
                  isClearable todayButton="Today"
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
                  isClearable todayButton="Today"
                  placeholderText="Tour End Date"
                />
              </div>
            </div>
          </div>
          <div className="position-relative col-md-12 col-lg-2 mt-2">
            <span
              className="position-absolute px-2 dateCardFeildSet"
              style={{
                top: '-0.7rem',
                left: '1rem',
                fontSize: '0.75rem',
                zIndex: 1,
              }}
            >
              Get Transport Data By
            </span>
            <div className="row border rounded px-2 py-2 pe-3 me-3">
              <div className="col-md-12 col-lg-12">
                <div className="form-check check-sm d-flex align-items-center">
                  <input
                    type="radio"
                    className="form-check-input height-em-1 width-em-1"
                    id="DefaultTransport"
                    value="DefaultTransport"
                    name="transportData"
                    defaultChecked
                  />
                  <label className="fontSize11px m-0 ms-1 mt-1" htmlFor="DefaultTransport">Default Transport</label>
                </div>
              </div>
              <div className="col-md-12 col-lg-12">
                <div className="form-check check-sm d-flex align-items-center">
                  <input
                    type="radio"
                    className="form-check-input height-em-1 width-em-1"
                    id="AllTransport"
                    value="AllTransport"
                    name="transportData"
                  />
                  <label className="fontSize11px m-0 ms-1 mt-1" htmlFor="AllTransport">All Transport</label>
                </div>
              </div>
            </div>
          </div>
          <div className="position-relative col-md-12 col-lg-6 mt-2">
            <span
              className="position-absolute px-2 dateCardFeildSet"
              style={{
                top: "-0.7rem",
                left: "1rem",
                fontSize: "0.75rem",
                zIndex: 1,
              }}
            >
              Report Data Filter Box
            </span>
            <div className="row border rounded px-2 py-2 pe-3 me-3">
              <div className="col-md-12 col-lg-3">
                <div className="form-check check-sm d-flex align-items-center">
                  <input
                    type="checkbox"
                    className="form-check-input height-em-1 width-em-1"
                    id="All"
                    value="All"
                    name="reportData"
                    checked={formvalue.TransferType.length === 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormValue({
                          ...formvalue,
                          TransferType: [],
                        });
                      }
                    }}
                  />
                  <label className="fontSize11px m-0 ms-1 mt-1" htmlFor="All">
                    All
                  </label>
                </div>
              </div>

              {transferTypeList.map((type) => (
                <div className="col-md-12 col-lg-3" key={type.id}>
                  <div className="form-check check-sm d-flex align-items-center">
                    <input
                      type="checkbox"
                      className="form-check-input height-em-1 width-em-1"
                      id={type.Name}
                      value={type.id}
                      name="reportData"
                      checked={formvalue.TransferType.includes(type.id)}
                      onChange={(e) => {
                        const value = type.id;
                        setFormValue((prev) => {
                          const newTransferTypes = e.target.checked
                            ? [...prev.TransferType, value]
                            : prev.TransferType.filter((typeId) => typeId !== value);
                          return {
                            ...prev,
                            TransferType: newTransferTypes,
                          };
                        });
                      }}
                    />
                    <label className="fontSize11px m-0 ms-1 mt-1" htmlFor={type.Name}>
                      {type.Name}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-md-1 h-10">
            <div className="d-flex justify-content-between align-items-end h-90 mt-3 px-1">
              <button
                type='button'
                onClick={handleSearch}
                className="btn btn-primary btn-custom-size"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <div className="mb-2 d-flex gap-2">
        </div>
        <div className="d-flex w-100 justify-content-end gap-2 mb-2">
          <button
            type="button"
            className="btn btn-primary btn-custom-size"
            style={{
              padding: "0 3px",
              borderRadius: "4px",
              fontSize: "11px",
            }}
            onClick={() => handletIncrement()}
          >
            {" "}
            Add
            <i className="fa-solid fa-plus ms-2" />
          </button>
          <button
            type="button"
            className="btn btn-primary btn-custom-size"
            onClick={() => handleDecrement(rows.length - 1)}
            style={{
              padding: "0 3px",
              borderRadius: "4px",
              fontSize: "11px",
            }}
          >
            {" "}
            Remove
            <i className="fa-solid fa-minus ms-2" />
          </button>
        </div>
        <PerfectScrollbar className="dlabnav-scroll d-flex flex-column justify-content-between">
          <table className="table table-bordered itinerary-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>File No.</th>
                <th>Dept.</th>
                <th>Client</th>
                <th>Pax</th>
                <th>Type</th>
                <th>Hotel</th>
                <th>Flight No</th>
                <th>Flight Time</th>
                <th>PickUp Time</th>
                <th>Program</th>
                <th>RPT TIME</th>
                <th>Vehicle</th>
                <th>Representative</th>
                <th>Driver</th>
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
                  <td>
                    {index === editingRow ? (
                      <DatePicker
                        popperProps={{
                          strategy: "fixed", // Ensures the popper is positioned relative to the viewport
                        }}
                        selected={row.date ? parseDate(row.date) : null}
                        onChange={(date) =>
                          handleCellChange(index, "date", formatDate(date))
                        }
                        dateFormat="dd-MM-yyyy"
                        className="form-control form-control-sm custom-date-pickerForW"
                        style={{ width: "120px" }}
                        placeholderText="Select Date"
                      />
                    ) : (
                      <span>{row.date}</span> || ""
                    )}
                  </td>
                  <td>
                    {index === editingRow ? (
                      <input
                        type="text"
                        value={row.FileNo || ''}
                        onChange={(e) => handleCellChange(index, 'FileNo', e.target.value)}
                        className="form-control form-control-sm"
                        style={{ width: "120px" }}
                      />
                    ) : (
                      <span>{row.FileNo}</span> || ''
                    )}
                  </td>
                  <td>
                    {index === editingRow ? (
                      <input
                        type="text"
                        value={row.department || ''}
                        onChange={(e) => handleCellChange(index, 'department', e.target.value)}
                        className="form-control form-control-sm"
                        style={{ width: "120px" }}
                      />
                    ) : (
                      <span>{row.department}</span> || ''
                    )}
                  </td>
                  <td>
                    {index === editingRow ? (
                      <input
                        type="text"
                        value={row.clientName || ''}
                        onChange={(e) => handleCellChange(index, 'clientName', e.target.value)}
                        className="form-control form-control-sm"
                        style={{ width: "120px" }}
                      />
                    ) : (
                      <span>{row.clientName}</span> || ''
                    )}
                  </td>
                  <td>
                    {index === editingRow ? (
                      <input
                        type="text"
                        value={row.pax || ''}
                        onChange={(e) => handleCellChange(index, 'pax', e.target.value)}
                        className="form-control form-control-sm"
                        style={{ width: "120px" }}
                      />
                    ) : (
                      <span>{row.pax}</span> || ''
                    )}
                  </td>
                  <td>
                    {index === editingRow ? (
                      <input
                        type="text"
                        value={row.type || ''}
                        onChange={(e) => handleCellChange(index, 'type', e.target.value)}
                        className="form-control form-control-sm"
                        style={{ width: "120px" }}
                      />
                    ) : (
                      <span>{row.type}</span> || ''
                    )}
                  </td>
                  <td>
                    {index === editingRow ? (
                      <input
                        type="text"
                        value={row.hotel || ''}
                        onChange={(e) => handleCellChange(index, 'hotel', e.target.value)}
                        className="form-control form-control-sm"
                        style={{ width: "120px" }}
                      />
                    ) : (
                      <span>{row.hotel}</span> || ''
                    )}
                  </td>
                  <td>
                    {index === editingRow ? (
                      <input
                        type="text"
                        value={row.flightNo || ''}
                        onChange={(e) => handleCellChange(index, 'flightNo', e.target.value)}
                        className="form-control form-control-sm"
                        style={{ width: "120px" }}
                      />
                    ) : (
                      <span>{row.flightNo}</span> || ''
                    )}
                  </td>
                  <td>
                    {index === editingRow ? (
                      <input
                        type="text"
                        value={row.flightTime || ''}
                        onChange={(e) => handleCellChange(index, 'flightTime', e.target.value)}
                        className="form-control form-control-sm"
                        style={{ width: "120px" }}
                      />
                    ) : (
                      <span>{row.flightTime}</span> || ''
                    )}
                  </td>
                  <td>
                    {index === editingRow ? (
                      <input
                        type="text"
                        value={row.pickupDrop || ''}
                        onChange={(e) => handleCellChange(index, 'pickupDrop', e.target.value)}
                        className="form-control form-control-sm"
                        style={{ width: "120px" }}
                      />
                    ) : (
                      <span>{row.pickupDrop}</span> || ''
                    )}
                  </td>
                  <td>
                    {index === editingRow ? (
                      <select
                        value={row.program || ""}
                        onChange={(e) => handleCellChange(index, "program", e.target.value)}
                        className="form-control form-control-sm"
                        style={{ width: "120px" }}
                      >
                        <option value="">Select Program</option>
                        {transferTypeList.map((item) => (
                          <option key={item.id} value={item.Name}>
                            {item.Name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span>{row.program}</span> || ""
                    )}
                  </td>
                  <td>
                    {index === editingRow ? (
                      <input
                        type="text"
                        value={row.rptTime || ''}
                        onChange={(e) => handleCellChange(index, 'rptTime', e.target.value)}
                        className="form-control form-control-sm"
                        style={{ width: "120px" }}
                      />
                    ) : (
                      <span>{row.rptTime}</span> || ''
                    )}
                  </td>
                  <td>
                    {index === editingRow ? (
                      <select
                        value={row.vehicle || ""}
                        onChange={(e) => handleCellChange(index, "vehicle", e.target.value)}
                        className="form-control form-control-sm"
                        style={{ width: "120px" }}
                      >
                        <option value="">Select Vehicle</option>
                        {vehicletypeList.map((item) => (
                          <option key={item.id} value={item.Name}>
                            {item.Name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span>{row.vehicle}</span> || ""
                    )}
                  </td>
                  <td>
                    {index === editingRow ? (
                      <input
                        type="text"
                        value={row.representative || ''}
                        onChange={(e) => handleCellChange(index, 'representative', e.target.value)}
                        className="form-control form-control-sm"
                        style={{ width: "120px" }}
                      />
                    ) : (
                      <span>{row.representative}</span> || ''
                    )}
                  </td>
                  {/* <td>
                    {index === editingRow ? (
                      <select
                        value={row.driver || ""}
                        onChange={(e) => handleCellChange(index, "driver", e.target.value)}
                        className="form-control form-control-sm"
                        style={{ width: "120px" }}
                      >
                        <option value="">Select Driver</option>
                        {diverlistList.map((item) => (
                          <option key={item.id} value={item.DriverName}>
                            {item.DriverName}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span>{row.driver}</span> || ""
                    )}
                  </td> */}
                  <td>
                    {index === editingRow ? (
                      <input
                        type="text"
                        value={row.driver || ""}
                        onChange={(e) => handleCellChange(index, "driver", e.target.value)}
                        className="form-control form-control-sm"
                        style={{ width: "120px" }}
                        placeholder="Enter Driver"
                      />
                    ) : (
                      <span>{row.driver}</span> || ""
                    )}
                  </td>

                  <td>
                    <div className="d-flex w-100 justify-content-center gap-2 ">
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

export default TransportAllocationChart;