import { useContext, useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { axiosOther } from "../../../../http/axios_base_url";
import { table_custom_style } from "../../../../css/custom_style";
import { ThemeContext } from "../../../../context/ThemeContext";

const InvoiceTableList = () => {
  const { background } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [lgShow, setLgShow] = useState(false);
  const [invoiceType, setInvoiceType] = useState("");
  const [invoiceId, setInvoiceId] = useState("");
  const [sendInvoiceType, setSendInvoiceType] = useState("");
  const [invoices, setInvoices] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);

  const queryAndQuotationNo = JSON.parse(
    localStorage.getItem("Query_Qoutation")
  );

  const handleRadioChange = (e) => {
    setSendInvoiceType(e.target.value);
  };

  const handleNext = () => {
    navigate("/query/generate-invoice", { state: sendInvoiceType });
    // navigate("/query/invoice-show", { state: sendInvoiceType });
  };

  const handleVisit = (row) => {
    console.log("BankDetails in row:", row?.InvoiceDetails?.BankDetails);
    navigate(`/query/generate-invoice`, {
      state: { row },
    });
    // navigate(`/query/invoice-show`, {
    //   state: { row },
    // });
  };

  const handleSearch = () => {
    const filtered = invoices.filter((item) => {
      const matchType = invoiceType
        ? item?.InvoiceDetails?.InvoiceType?.toLowerCase().includes(
          invoiceType.toLowerCase()
        )
        : true;
      const matchId = invoiceId
        ? item?.InvoiceId?.toString().includes(invoiceId)
        : true;
      return matchType && matchId;
    });
    setFilteredData(filtered);
  };

  const handleConvertToTax = (row) => {
    console.log("Converting to Tax for row:", row); // Debug row data
    navigate("/query/generate-invoice", {
      state: {
        row: {
          ...row,
        },
        convertToTax: true, // Flag to indicate conversion
      },
    });
  };

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const response = await axiosOther.post("list-invoice", {
          Type: invoiceType,
          InvoiceId: invoiceId,
          QueryId: queryAndQuotationNo?.QueryID || "",
        });
        if (response.data.Status === 200) {
          setInvoices(response?.data?.DataList);
          console.log(response?.data?.DataList, "RISHI766");
          setFilteredData(response?.data?.DataList);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching invoices:", error);
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  console.log(invoices, "ajsfbasf");

  const getInvoiceType = (data) => {
    if (data === "PI") return "Proforma Invoice";
    if (data === "Tax") return "Tax Invoice";
    if (data === "Credit") return "Credit Invoice";
  };

  const columns = [
    {
      name: "Invoice No.",
      selector: (row) => row.InvoiceId,
      cell: (row) => (
        <span
          className="text-queryList-primary cursor-pointer"
          onClick={() => handleVisit(row)}
        >
          {row.InvoiceId}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Query ID",
      selector: (row) => row?.QueryId,
      cell: (row) => <span>{row?.QueryId}</span>,
      sortable: true,
    },
    {
      name: "Invoice Type",
      selector: (row) => row?.InvoiceDetails?.InvoiceType,
      cell: (row) => <span>{getInvoiceType(row?.Type)}</span>,
    },
    {
      name: "Tour ID",
      selector: (row) => row?.InvoiceDetails?.TourRefNo,
      cell: (row) => <span>{row?.InvoiceDetails?.TourRefNo}</span>,
      sortable: true,
    },
    {
      name: "Invoice Date",
      selector: (row) =>
        new Date(row.InvoiceDetails.InvoiceDate).toLocaleDateString("en-GB"),
      cell: (row) => (
        <span>
          {new Date(row.InvoiceDetails.InvoiceDate).toLocaleDateString("en-GB")}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Client Name",
      selector: (row) => row.InvoiceDetails.GuestNameorReceiptName,
      cell: (row) => <span>{row.InvoiceDetails.GuestNameorReceiptName}</span>,
      sortable: true,
    },
    {
      name: "Company Name",
      selector: (row) => row.InvoiceDetails.CompanyName,
      cell: (row) => <span>{row.InvoiceDetails.CompanyName} </span>,
      sortable: true,
    },
    {
      name: "Invoice Format",
      selector: (row) => row.InvoiceDetails.FormatType,
      cell: (row) => <span>{row.InvoiceDetails.FormatType} </span>,
      sortable: true,
    },
    {
      name: "Amount",
      selector: (row) => row.InvoiceDetails.TourAmount,
      cell: (row) => <span>{`INR ${row.InvoiceDetails.TourAmount}`}</span>,
      sortable: true,
    },
    {
      name: "Status",
      selector: () => (
        <span className="badge badge-success light badge">Active</span>
      ),
    },
    {
      name: "Action",
      cell: (row) =>
        row?.Type === "PI" ? (
          <span
            className="text-queryList-primary cursor-pointer"
            onClick={() => handleConvertToTax(row)}
          >
            Convert to Tax
          </span>
        ) : null,
    },
  ];

  return (
    <>
      <div className="d-flex mb-2 align-items-end">
        <div className="col-2 me-2">
          <label>Invoice Type</label>
          <select
            value={invoiceType}
            onChange={(e) => setInvoiceType(e.target.value)}
            className="form-control form-control-sm"
          >
            <option value="">Select</option>
            <option value="Proforma Invoice">Proforma Invoice</option>
            <option value="Tax Invoice">Tax Invoice</option>
            <option value="Credit Invoice">Credit Invoice</option>
          </select>
        </div>
        <div className="col-2 me-2">
          <label>Invoice No.</label>
          <input
            className="form-control form-control-sm"
            placeholder="Invoice No"
            value={invoiceId}
            onChange={(e) => setInvoiceId(e.target.value)}
          />
        </div>
        <button
          className="btn btn-primary btn-custom-size flex-shrink-0 flex-grow-0 mt-2 d-block"
          onClick={handleSearch}
        >
          <i className="fa-brands fa-searchengin me-2"></i>Search
        </button>
        {/* <button className="btn btn-primary btn-custom-size mt-2 d-block" onClick={handleSearch}>Search</button> */}
        <button
          className="btn btn-primary btn-custom-size my-2 ms-auto d-block me-2"
          onClick={() => setLgShow(true)}
        >
          Generate Invoice
        </button>
        <div>
          <button
            className="btn btn-dark btn-custom-size me-2 my-2"
            onClick={() => navigate(-1)}
          >
            <span className="me-1">Back</span>
            <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
          </button>
          <button
            className="btn btn-primary btn-custom-size "
            name="SaveButton"
            onClick={() => navigate("/query/tour-execution")}
          >
            <span className="me-1">Next</span>
            <i className="fa-solid fa-forward text-primary bg-white p-1 rounded"></i>
          </button>
        </div>
      </div>

      <Modal
        size="md"
        show={lgShow}
        onHide={() => setLgShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Generate Invoice
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "10px" }}>
          <div className="d-flex gap-5 justify-content-center py-5">
            {["PROFORMA", "TAX", "CREDIT"].map((type) => (
              <div className="form-check" key={type}>
                <input
                  className="form-check-input"
                  type="radio"
                  name="sendInvoiceType"
                  value={type}
                  id={type}
                  checked={sendInvoiceType === type}
                  onChange={handleRadioChange}
                />
                <label className="form-check-label fs-5" htmlFor={type}>
                  {type === "PROFORMA"
                    ? "Proforma Invoice"
                    : type === "TAX"
                      ? "Tax Invoice"
                      : "Credit Note"}
                </label>
              </div>
            ))}
          </div>
        </Modal.Body>

        <Modal.Footer>
          <button
            className="btn btn-primary btn-custom-size"
            onClick={handleNext}
            disabled={!sendInvoiceType}
          >
            Generate Invoice
          </button>
        </Modal.Footer>
      </Modal>

      <DataTable
        columns={columns}
        data={filteredData}
        // pagination
        highlightOnHover
        striped
        persistTableHead
        sortIcon={<i className="fa-solid fa-sort fs-4"></i>}
        customStyles={table_custom_style(background)}
        defaultSortAsc={false} // descending = latest first
        className="custom-scrollbar"
      />
    </>
  );
};

export default InvoiceTableList;
