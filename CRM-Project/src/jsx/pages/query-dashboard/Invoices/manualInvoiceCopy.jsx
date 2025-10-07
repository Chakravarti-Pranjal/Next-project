import React, { useEffect, useState } from "react";
import { Row, Card, Col, Button, CardHeader, CardBody } from "react-bootstrap";
import deboxlogo from "../../../../images/logo/deboxlogo.png";
import { axiosOther } from "../../../../http/axios_base_url";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Alert } from "@mui/material";
import { notifySuccess } from "../../../../helper/notify";
import PrintInvoiceComponent from "./PrintInvoiceComponent";
import PerfectScrollbar from "react-perfect-scrollbar";
import { ceil } from "lodash";

const invoiceFormInitial = {
  ParticularName: "",
  HSN: "",
  SAC: "",
  Amount: "",
  Tcs: "",
  Tax: "",
  TotalAmount: "",
  IGST: "",
  CGST: "",
  State: "select",
  isExcludeGst: false,
  igstAmount: "0",
  cgstAmount: "0",
};

const invoiceForm2Initial = {
  Currency_Type: "",
  AccountNumber: "",
  AccountType: "",
  BeneficiaryName: "",
  BranchAddress: "",
  BranchIFSC: "",
  BankName: "",
};

const ManualInvoice = () => {
  const { state } = useLocation();
  // const isEditMode = Boolean(state?.row?.id || state?.invoiceId); // Adjusted to row.id
  const isEditMode = Boolean(
    state?.row?.InvoiceId || state?.row?.id || state?.invoiceId
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [destinationList, setDestinationList] = useState([]);
  const [invoiceForm, setInvoiceForm] = useState([invoiceFormInitial]);
  const [invoiceForm2, setInvoiceForm2] = useState([invoiceForm2Initial]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDated, setSelectedDated] = useState(new Date());
  const [formData, setFormData] = useState({
    ContactType: "Proforma Invoice",
  });
  const [guestName, setGuestName] = useState("");
  const [termCondition, setTermCondition] = useState("");
  const [paymentDes, setPaymentDesc] = useState("");
  const [taxData, setTaxData] = useState([]);
  const [selectedTax, setSelectedTax] = useState("");
  const [selectedState, setSelectedState] = useState("Same State");
  const [totalIGST, setTotalIGST] = useState("");
  const [totalCGST, setTotalCGST] = useState("");
  const [totalState, setTotalState] = useState("Same State");
  const [totalIsExcludeGst, setTotalIsExcludeGst] = useState(false);
  const [companyDetails, setCompanyDetails] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [billingData, setBillingData] = useState({
    billTo: "Ruchi Travel",
    address: "Noida sector 15, 310 A",
    phone: "9990003616",
    email: "Rachin@debox.com",
    gstin: "JKHGKJH8767HK",
    pan: "KJYU876HJGJ",
    stateCountry: "",
  });
  const [grandTotal, setGrandTotal] = useState(0);
  const [invoiceNo, setInvoiceNo] = useState("");
  const [tempData, setTempData] = useState(billingData);
  const [invoiceData, setInvoiceData] = useState({});
  const [igst, setIgst] = useState(0);
  const [igstValue, setIgstValue] = useState(0);
  const [cgst, setCgst] = useState(0);
  const [currencyName, setCurrencyName] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("INR");
  const [selectedDestination, setSelectedDestination] = useState("");
  const [hsnData, setHsnData] = useState([]);
  const [officePlace, setOfficePlace] = useState([]);
  const [bankDetailsList, setBankDetailsList] = useState([]);
  const [allCompanyList, setAllCompanyList] = useState([]);
  const { queryData, qoutationData } = useSelector(
    (data) => data?.queryReducer
  );
  const queryQuotation = JSON.parse(localStorage.getItem("Query_Qoutation"));
  const { TourId, QueryAlphaNumId, QueryAllData } = queryData || {};
  const { QuotationNumber } = qoutationData || {};
  const { ReferenceId, ServiceDetail } = QueryAllData || {};

  const [referenceId, setReferenceId] = useState(ReferenceId);
  const [tourId, setTourId] = useState(TourId);
  const [cost, setCost] = useState({
    costType: "Individual",
  });

  const [sendInvoiceType, setSendInvoiceType] = useState("StandAlone");
  const handleInvoiceTypeChange = (event) => {
    setSendInvoiceType(event.target.value);
  };

  console.log(companyDetails, "companyDetails");

  // Handle Edit Mode: Populate form with invoice data from InvoiceTableList
  useEffect(() => {
    console.log("Received state:", state); // Debug state
    console.log("isEditMode:", isEditMode); // Debug edit mode
    if (isEditMode && state?.row) {
      const invoice = state.row;
      console.log("Invoice data:", invoice); // Debug invoice data

      // Set InvoiceType based on convertToTax flag or invoice data
      setFormData((prev) => ({
        ...prev,
        ContactType: state?.convertToTax
          ? "Tax Invoice"
          : invoice?.InvoiceDetails?.InvoiceType || "Proforma Invoice",
      }));

      // Company Details
      setCompanyDetails({
        CompanyName:
          invoice?.InvoiceDetails?.CompanyName ||
          "DEBOX GLOBAL IT SOLUTION PRIVATE LIMITED",
        Address:
          invoice?.InvoiceDetails?.CompanyAddress ||
          "Sector-62 I thum tower C-319",
        Phone: invoice?.InvoiceDetails?.CompanyContact || "9898556641",
        Website:
          invoice?.InvoiceDetails?.CompanyWebsite || "www.deboxglobal.com",
        GstNo: invoice?.InvoiceDetails?.CompanyPan || "ABCDE1234F",
        Email: invoice?.InvoiceDetails?.CompanyEmail || "info@deboxglobal.com",
        Cin: invoice?.InvoiceDetails?.CompanyCIN || "09AAGCD6966P1ZP",
      });

      // Billing Data
      const billToData = {
        billTo: invoice?.InvoiceDetails?.BillToCompanyName || "",
        address: invoice?.InvoiceDetails?.BillToCompanyAddress || "",
        phone: invoice?.InvoiceDetails?.BillToCompanyContact || "-",
        email: invoice?.InvoiceDetails?.BillToCompanyEmail || "-",
        gstin: invoice?.InvoiceDetails?.BillToCompanyCIN || "",
        pan: invoice?.InvoiceDetails?.BillToCompanyPan || "",
        stateCountry: invoice?.InvoiceDetails?.BillToCompanyAddress || "",
      };
      setBillingData(billToData);
      setTempData(billToData);

      // Invoice Details
      setInvoiceNo(invoice?.InvoiceDetails?.InvoiceId || "INV/24-25/000001");
      setReferenceId(invoice?.ReferenceId || "FC0E32B7");
      setTourId(invoice?.TourId || "");
      setGuestName(invoice?.InvoiceDetails?.GuestNameorReceiptName || "");
      setTermCondition(
        invoice?.InvoiceDetails?.TermsandCondition ||
          "Payment should be made within 15 days."
      );
      setPaymentDesc(
        invoice?.InvoiceDetails?.PaymentDesc ||
          "Advance payment required before confirmation."
      );
      setSelectedTax(invoice?.InvoiceDetails?.GstType || "");
      setGrandTotal(parseFloat(invoice?.InvoiceDetails?.GrantTotal) || 0);
      setSelectedCurrency(invoice?.InvoiceDetails?.Currency || "INR");
      setTotalState(invoice?.InvoiceDetails?.TotalState || "Same State");
      setTotalIGST(invoice?.InvoiceDetails?.TotalIGST || "");
      setTotalCGST(invoice?.InvoiceDetails?.Cgst || "0.00");
      setTotalIsExcludeGst(invoice?.InvoiceDetails?.TotalIsExcludeGst || false);
      setSelectedDate(
        invoice?.InvoiceDetails?.InvoiceDate
          ? new Date(invoice.InvoiceDetails.InvoiceDate)
          : new Date()
      );
      setSelectedDated(
        invoice?.InvoiceDetails?.DueDate
          ? new Date(invoice.InvoiceDetails.DueDate)
          : new Date()
      );
      setSelectedDestination(
        invoice?.InvoiceDetails?.PlaceofDeliveryName || "New Delhi"
      );
      setIgst(parseFloat(invoice?.InvoiceDetails?.Sgst) || 0);
      setCgst(parseFloat(invoice?.InvoiceDetails?.Cgst) || 0);

      // Particulars
      if (Array.isArray(invoice?.InvoiceDetails?.Particulars)) {
        const formattedParticulars = invoice.InvoiceDetails.Particulars.map(
          (item) => ({
            ParticularName: item.ParticularName || "",
            HSN:
              item.HSN && item.SAC
                ? `${item.HSN} (${item.SAC})`
                : item.HSN || "",
            SAC: item.SAC || "",
            Amount: item.Amount || "0",
            Tcs: item.Tcs || "",
            Tax: item.Tax || "",
            TotalAmount: item.TotalAmount || "0",
            IGST: item.IGST || "",
            CGST: item.CGST || "",
            State: item.State || "select",
            isExcludeGst: item.isExcludeGst || false,
            igstAmount: item.igstAmount || "0",
            cgstAmount: item.cgstAmount || "0",
          })
        );
        setInvoiceForm(
          formattedParticulars.length
            ? formattedParticulars
            : [invoiceFormInitial]
        );
      } else {
        setInvoiceForm([invoiceFormInitial]);
      }

      // Bank Details
      if (Array.isArray(invoice?.InvoiceDetails?.BankDetails)) {
        const formattedBankData = invoice.InvoiceDetails.BankDetails.map(
          (item) => ({
            CurrencyType: item.CurrencyType || "",
            AccountNumber: item.AccountNumber || "",
            AccountType: item.AmountType || "",
            BeneficiaryName: item.baneficiaryName || "",
            BranchAddress: item.BranchAddress || "",
            BranchIFSC: item.IFSC || item.BranchSwiftCode || "",
            BankName: item.BankName || "",
          })
        );
        setInvoiceForm2(
          formattedBankData.length ? formattedBankData : [invoiceForm2Initial]
        );
      } else {
        setInvoiceForm2([invoiceForm2Initial]);
      }
    } else if (state === "TAX") {
      setFormData((prev) => ({ ...prev, ContactType: "Tax Invoice" }));
    } else if (state === "PROFORMA") {
      setFormData((prev) => ({ ...prev, ContactType: "Proforma Invoice" }));
    } else if (state === "CREDIT") {
      setFormData((prev) => ({ ...prev, ContactType: "Credit Invoice" }));
    }
  }, [state, isEditMode]);

  useEffect(() => {
    if (ServiceDetail) {
      setBillingData((prev) => ({
        ...prev,
        phone: ServiceDetail.CompanyPhone || "-",
        email: ServiceDetail.CompanyEmail || "-",
      }));
    }
  }, [ServiceDetail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempData({ ...tempData, [name]: value });
  };

  const handleFieldClick = (fieldName) => {
    setEditMode(fieldName);
  };

  const handleFieldBlur = () => {
    setBillingData(tempData);
    setEditMode(null);
  };

  const totalTourCost = invoiceForm.reduce((acc, curr) => {
    const amount = ceil(curr.TotalAmount) || 0;
    return acc + amount;
  }, 0);

  const newAmount = totalIsExcludeGst
    ? totalTourCost
    : totalTourCost +
      (totalState === "Other State"
        ? (totalTourCost * (parseFloat(totalIGST) || 0)) / 100
        : totalState === "Same State"
        ? (totalTourCost * (parseFloat(totalIGST) || 0)) / 100 +
          (totalTourCost * (parseFloat(totalCGST) || 0)) / 100
        : 0);

  useEffect(() => {
    const calculatedIgstValue = totalTourCost * (igst / 100);
    if (selectedState === "Same State") {
      setIgstValue(calculatedIgstValue);
    } else {
      setIgstValue(calculatedIgstValue);
    }
    if (totalIsExcludeGst) {
      setGrandTotal(totalTourCost);
    } else {
      setGrandTotal(totalTourCost + calculatedIgstValue);
    }
  }, [totalIsExcludeGst, totalTourCost, igst, selectedState]);

  const handleInvoiceData = async () => {
    const payload = {
      id: isEditMode ? state?.row?.id || state?.row?.id || state?.id || "" : "", // Handle both InvoiceId and id
      QueryId: QueryAlphaNumId || state?.QueryId || "",
      QuotationNo: queryQuotation?.QoutationNum || state?.QuotationNo || "",
      Type: "Regular",
      TourId: tourId || "",
      ReferenceId: referenceId || invoice?.ReferenceId || "FC0E32B7",
      PdfFileLink: "https://example.com/invoice.pdf",
      AddedBy: 1,
      UpdatedBy: 1,
      InvoiceDetails: {
        InvoiceType: formData.ContactType, // Will be 'Tax Invoice' for conversion
        FormatType: "Total Invoice",
        CostType: cost.costType,
        GstType: totalIGST || "",
        Tcs: "1%",
        TourAmount: totalTourCost.toString(),
        CompanyLogo: deboxlogo,
        CompanyName: companyDetails.CompanyName,
        CompanyAddress: companyDetails.Address,
        CompanyContact: companyDetails.Phone,
        CompanyEmail: companyDetails.Email,
        CompanyWebsite: companyDetails.Website,
        CompanyPan: companyDetails.GstNo,
        CompanyCIN: companyDetails.Cin,
        BillToCompanyName: billingData.billTo,
        BillToCompanyAddress: billingData.address,
        BillToCompanyContact: billingData.phone,
        BillToCompanyEmail: billingData.email,
        BillToCompanyWebsite: "https://abcd.com",
        BillToCompanyPan: billingData.pan,
        BillToCompanyCIN: billingData.gstin,
        InvoiceNo: state?.invoiceId || invoiceNo || "INV/24-25/000001",
        InvoiceDate: selectedDate,
        ReferenceNo: referenceId || "FC0E32B7",
        DueDate: selectedDated,
        ToutDate: "2024-03-10",
        FileNo: "FILE-001",
        Currency: selectedCurrency || "INR",
        GuestNameorReceiptName: guestName,
        PlaceofDeliveryId: "DEL-001",
        PlaceofDeliveryName: selectedDestination || "New Delhi",
        Particulars: invoiceForm.map((item) => {
          let hsnName = "";
          let sacCode = "";
          const match = item.HSN.match(/^(.+?)\s*\((\d+)\)$/);
          if (match) {
            hsnName = match[1].trim();
            sacCode = match[2];
          } else {
            hsnName = item.HSN;
            sacCode = item.SAC || "";
          }
          return {
            ParticularName: item.ParticularName,
            HSN: hsnName,
            SAC: sacCode,
            Amount: item.Amount,
            Tcs: item.Tcs,
            Tax: item.Tax,
            TotalAmount: item.TotalAmount,
            IGST: item.IGST,
            CGST: item.CGST,
            State: item.State,
            isExcludeGst: item.isExcludeGst,
            igstAmount: item.igstAmount,
            cgstAmount: item.cgstAmount,
          };
        }),
        TotalTourCost: totalTourCost,
        Cgst: totalCGST || "0",
        Sgst: totalState === "Same State" ? totalCGST || "0" : "0",
        TotalIGST: totalIGST,
        TotalState: totalState,
        TotalIsExcludeGst: totalIsExcludeGst,
        GrantTotal: newAmount,
        BankDetails: invoiceForm2.map((item) => ({
          BankName: item.BankName || "",
          AmountType: item.AccountType || "",
          baneficiaryName: item.BeneficiaryName || "",
          AccountNumber: item.AccountNumber || "",
          IFSC: item.BranchIFSC || "",
          BranchAddress: item.BranchAddress || "",
          BranchSwiftCode: item.BranchIFSC || "",
        })),
        TermsandCondition:
          termCondition || "Payment should be made within 15 days.",
        PaymentDesc:
          paymentDes || "Advance payment required before confirmation.",
      },
    };

    console.log("Saving payload:", payload);
    try {
      const { data } = await axiosOther.post("/add-update-invoice", payload);
      if (data?.Status === 1) {
        notifySuccess(data?.Message);
        setInvoiceData(data);
        // Clear states
        setTempData(billingData);
        setInvoiceData({});
        setDestinationList([]);
        setInvoiceForm([invoiceFormInitial]);
        setInvoiceForm2([invoiceForm2Initial]);
        setGuestName("");
        setTermCondition("");
        setPaymentDesc("");
        setTotalIGST("");
        setTotalCGST("");
        setTotalState("select");
        setTotalIsExcludeGst(false);
        navigate("/query/invoices");
      }
    } catch (error) {
      toast.error("Error saving invoice");
    }
  };

  const [companyList, setCompanyList] = useState([]);
  const [companyFormList, setCompanyFormList] = useState([]);
  const [companyListByCity, setCompanyListByCity] = useState([]);
  const comapnyID = JSON.parse(localStorage.getItem("token")).companyKey;
  const [selectedOfficePlace, setSelectedOfficePlace] = useState("");
  const [listFinalQuotationData, setListFinalQuotationData] = useState([]);

  console.log(companyListByCity, "selectedOfficePlace");
  console.log(listFinalQuotationData, "companyFormList");

  const postDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("companylist", {
        ID: comapnyID,
      });

      console.log(data, "DATA98");
      if (data?.Status === 200) {
        setCompanyList(data?.DataList[0]);
      }
    } catch (error) {
      console.log("user-error", error);
    }

    try {
      const { data } = await axiosOther.post("listCompanyOfc", {
        CompanyId: comapnyID,
      });
      console.log(data, "HFGS&6");

      if (data.Status === 200) {
        setCompanyListByCity(data.DataList);
      }
    } catch (error) {
      console.error("Error fetching company details:", error);
    }

    try {
      const { data } = await axiosOther.post("lisFinalQuotation", {
        QueryId: queryQuotation?.QueryID,
        QuotationNo: queryQuotation?.QoutationNum,
      });

      setListFinalQuotationData(data?.FilteredQuotations[0]);
    } catch (error) {
      console.log(error);
    }

    try {
      const { data } = await axiosOther.post("destinationlist");
      setDestinationList(data?.DataList);
    } catch (error) {
      console.log(error);
    }

    try {
      const { data } = await axiosOther.post("currencymasterlist");
      const currency = data.DataList.map((item) => ({
        id: item.id,
        currency: item.CurrencyName,
      }));
      const reorderedCurrency = [
        ...currency.filter((item) => item.currency.toUpperCase() === "INR"),
        ...currency.filter((item) => item.currency.toUpperCase() !== "INR"),
      ];
      setCurrencyName(reorderedCurrency);
    } catch (error) {
      console.log("Error fetching currency:", error);
    }

    try {
      const { data } = await axiosOther.post("hsnmasterlist");
      if (data?.Status === 200) {
        setHsnData(data?.DataList);
      }
    } catch (error) {
      console.log("Error fetching HSN data:", error);
    }

    try {
      const { data } = await axiosOther.post("taxmasterlist");
      if (data.Status === 200) {
        const taxRate = data.DataList.map((item) => ({
          type: item.TaxSlabName,
          rate: item.TaxValue,
        }));
        const uniqueTax = taxRate.filter(
          (item, index, self) =>
            index ===
            self.findIndex((t) => t.type === item.type && t.rate === item.rate)
        );
        setTaxData(uniqueTax);
      }
    } catch (error) {
      console.log("Error fetching tax data:", error);
    }

    try {
      const { data } = await axiosOther.post("bankdetailslist");
      if (data.Status === 200) {
        setBankDetailsList(data.DataList);
      }
    } catch (error) {
      console.error("Error fetching bank details:", error);
    }
  };

  useEffect(() => {
    if (!selectedOfficePlace) {
      const updatedFormData = {
        ComapnayName: companyList?.COMPANYNAME,
        City: companyList?.CITY,
        Contact: companyList?.PHONE,
        Email: companyList?.REGISTEREDEMAIL,
        Cin: companyList?.CIN,
        Pan: companyList?.PAN,
        Address: companyList?.ADDRESS1,
        ContactPerson: companyList?.ContectPerson,
      };

      setCompanyFormList(updatedFormData);
    } else {
      const filteredOffice = companyListByCity.filter(
        (office) => office.OfficeName === selectedOfficePlace
      );

      console.log(filteredOffice, "filteredOffice");

      const updatedFormData = {
        ComapnayName: filteredOffice[0]?.CompanyName,
        City: filteredOffice[0]?.CityName,
        Contact: filteredOffice[0]?.Mobile,
        Email: filteredOffice[0]?.Email,
        Cin: filteredOffice[0]?.Cin,
        Pan: filteredOffice[0]?.Pan,
        Address: filteredOffice[0]?.Address,
        Gst: filteredOffice[0]?.GstNo,
        ContactPerson: companyList?.ContacctPersonName,
      };

      setCompanyFormList(updatedFormData);
    }
  }, [companyList, selectedOfficePlace]);

  useEffect(() => {
    postDataToServer();
  }, []);

  const handleServiceCostForm = (e, index) => {
    const { name, value, type, checked } = e.target;
    setInvoiceForm((prevArr) => {
      const newArr = [...prevArr];
      const updatedRow = {
        ...newArr[index],
        [name]: type === "checkbox" ? checked : value,
      };

      const amount = parseFloat(updatedRow.Amount) || 0;
      const tcs = parseFloat(updatedRow.Tcs) || 0;
      const tax = parseFloat(updatedRow.Tax) || 0;
      const igst = parseFloat(updatedRow.IGST) || 0;

      const tcsAmount = (amount * tcs) / 100;
      const taxAmount = (amount * tax) / 100;

      let igstAmount = 0;
      let cgstAmount = 0;
      if (!updatedRow.isExcludeGst) {
        if (updatedRow.State === "Other State") {
          igstAmount = (amount * igst) / 100;
          updatedRow.CGST = "0";
        } else if (updatedRow.State === "Same State") {
          igstAmount = (amount * (igst / 2)) / 100;
          cgstAmount = (amount * (igst / 2)) / 100;
          updatedRow.CGST = (igst / 2).toFixed(2);
        }
      } else {
        updatedRow.CGST = "0";
      }

      updatedRow.igstAmount = igstAmount.toFixed(2);
      updatedRow.cgstAmount = cgstAmount.toFixed(2);
      updatedRow.TotalAmount = (
        amount +
        tcsAmount +
        taxAmount +
        igstAmount +
        cgstAmount
      ).toFixed(2);

      newArr[index] = updatedRow;
      return newArr;
    });
  };

  const handleServiceIncrement = () => {
    setInvoiceForm((prevArr) => [...prevArr, invoiceFormInitial]);
  };

  const handleServiceDecrement = (ind) => {
    if (invoiceForm?.length > 1) {
      const filteredForm = invoiceForm.filter((_, index) => index !== ind);
      setInvoiceForm(filteredForm);
    }
  };

  const handleService2CostForm = (e, index) => {
    const { name, value } = e.target;
    setInvoiceForm2((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = { ...newArr[index], [name]: value };
      return newArr;
    });
  };

  const handleService2Increment = () => {
    setInvoiceForm2((prevArr) => [...prevArr, invoiceForm2Initial]);
  };

  const handleService2Decrement = (ind) => {
    if (invoiceForm2?.length > 1) {
      const filteredForm = invoiceForm2.filter((_, index) => index !== ind);
      setInvoiceForm2(filteredForm);
    }
  };

  const handleTaxChange = (e) => {
    setSelectedTax(e.target.value);
    setIgst(e.target.value);
  };

  useEffect(() => {
    if (selectedState === "Same State") {
      let half = igst / 2;
      setIgst(half);
      setCgst(half);
    } else {
      setIgst(igst);
      setCgst(0);
    }
  }, [selectedState, selectedTax]);

  useEffect(() => {
    if (totalState === "Same State" && !totalIsExcludeGst) {
      const totalIgstValue = parseFloat(totalIGST) || 0;
      setTotalCGST((totalIgstValue / 2).toFixed(2));
      setIgst((totalIgstValue / 2).toFixed(2));
      const totalIgstAmount = (totalTourCost * (totalIgstValue / 2)) / 100;
      const totalCgstAmount = (totalTourCost * (totalIgstValue / 2)) / 100;
      setIgstValue(totalIgstAmount.toFixed(2));
      setCgst(totalCgstAmount.toFixed(2));
    } else if (totalState === "Other State" && !totalIsExcludeGst) {
      const totalIgstValue = parseFloat(totalIGST) || 0;
      setTotalCGST("0");
      setIgst(totalIgstValue.toFixed(2));
      const totalIgstAmount = (totalTourCost * totalIgstValue) / 100;
      setIgstValue(totalIgstAmount.toFixed(2));
      setCgst("0");
    } else {
      setTotalCGST("0");
      setIgst("0");
      setIgstValue("0");
      setCgst("0");
    }

    if (totalIsExcludeGst) {
      setGrandTotal(totalTourCost);
    } else {
      const calculatedIgstValue =
        (totalTourCost * (parseFloat(totalIGST) || 0)) / 100;
      setGrandTotal(totalTourCost + calculatedIgstValue);
    }
  }, [totalIsExcludeGst, totalTourCost, totalIGST, totalState]);

  const handleFormChangeData = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormChangeDatas = (e) => {
    const { name, value } = e.target;
    setCost({ ...cost, [name]: value });
  };

  // JSX remains the same as in the original code
  // For brevity, I'm not repeating the entire JSX, but it should be identical to the original
  return (
    <div className="ManualInvoice m-0 p-0">
      <Row>
        <Col md={12}>
          <Card>
            <CardHeader className="my-0 pt-0 border-0">
              <div className="col-md-12 d-flex justify-content-between align-item-center gap-1 col-sm-12">
                <div className="col-lg-2 col-md-6"></div>
                <div className="col-lg-3 col-md-6 mb-1">
                  <div className="d-flex justify-content-end align-content-center gap-1">
                    <PrintInvoiceComponent />
                    <button
                      className="btn btn-dark btn-custom-size"
                      onClick={() => navigate(-1)}
                    >
                      <span className="me-1">Back</span>
                      <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
                    </button>
                    <button
                      className="btn btn-primary btn-custom-size"
                      onClick={handleInvoiceData}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <div>
                <div className="row">
                  <div className="col-lg-3 col-md-6 mb-3">
                    <label>Contact Type</label>
                    <select
                      name="ContactType"
                      id="contactType"
                      className="form-control form-control-sm"
                      value={formData.ContactType}
                      onChange={handleFormChangeData}
                    >
                      <option value="Proforma Invoice">Proforma Invoice</option>
                      <option value="Tax Invoice">Tax Invoice</option>
                      <option value="Credit Invoice">Credit Invoice</option>
                    </select>
                  </div>
                  {/* <div className="col-lg-3 col-md-6 mb-3">
                    <label>Cost Type</label>
                    <select
                      name="costType"
                      id="costType"
                      className="form-control form-control-sm"
                      value={cost.costType}
                      onChange={handleFormChangeDatas}
                    >
                      <option value="Service Wise">Service Wise</option>
                      <option value="Consolidated">Consolidated</option>
                      <option value="Part Invoice">Part Invoice</option>
                      <option value="Pax Wise Invoice">Pax Wise Invoice</option>
                    </select>
                  </div> */}
                  <div className="d-flex gap-5 py-3">
                    {["ItemWise", "StandAlone", "FileWise"].map((type) => (
                      <div className="form-check" key={type}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="sendInvoiceType"
                          value={type}
                          id={type}
                          checked={sendInvoiceType === type}
                          onChange={handleInvoiceTypeChange}
                        />
                        <label className="form-check-label fs-5" htmlFor={type}>
                          {type === "ItemWise"
                            ? "Item Wise"
                            : type === "StandAlone"
                            ? "Standalone"
                            : "File Wise"}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {console.log(allCompanyList, "allCompanyList")}
              <div>
                <div className="row">
                  <div className="col-lg-3 col-md-6 mb-3">
                    <label>Company</label>
                    <select
                      name="Company"
                      id="Company"
                      className="form-control form-control-sm"
                    >
                      <option value="">Select</option>
                      {allCompanyList.length > 0 &&
                        allCompanyList.map((company, inx) => (
                          <option key={inx} value={company.ID}>
                            {company?.COMPANYNAME}
                          </option>
                        ))}
                    </select>
                  </div>
                  {console.log(companyListByCity, "companyListByCity")}
                  <div className="col-lg-3 col-md-6 mb-3">
                    <label>City</label>
                    <select
                      name="costType"
                      id="costType"
                      className="form-control form-control-sm"
                      value={selectedOfficePlace}
                      onChange={(e) => setSelectedOfficePlace(e.target.value)}
                    >
                      <option value="">Select</option>
                      {companyListByCity?.map((item, index) => (
                        <option key={index} value={item?.OfficeName}>
                          {item?.OfficeName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              {cost.costType === "Consolidated" && (
                <div className="row">
                  <table className="table table-bordered itinerary-table">
                    <thead>
                      <tr>
                        <th>SRN</th>
                        <th>QUOTATION ID</th>
                        <th></th>
                        <th>TOUR AMOUNT</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>{QuotationNumber}</td>
                        <td>coshsheet</td>
                        <td>4836</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td></td>
                        <td>Total</td>
                        <td>4836</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
              <div className="row mt-1">
                <div className="col-lg-12 d-flex justify-content-end align-items-center">
                  <h3>{formData?.ContactType}</h3>
                </div>
              </div>
              <div style={{ background: "var(--rgba-primary-1)" }}>
                <div className="row pt-2 pb-2 p-1">
                  <div className="col-lg-4 img col-sm-12">
                    <div className="img my-auto">
                      <img
                        src={deboxlogo}
                        alt="Logo"
                        style={{
                          height: "60px",
                          width: "auto",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-lg-8 col-sm-12 ps-2 my-auto">
                    <div className="row deboxcontact">
                      <div className="heading col-12">
                        <h6>{companyFormList?.ComapnayName}</h6>
                      </div>
                      <div className="address col-6">
                        <div className="d-flex gap-3">
                          <span>Address: </span>{" "}
                          <span>{companyFormList?.Address}</span>
                        </div>
                      </div>
                      <div className="address col-6">
                        <div className="d-flex gap-3">
                          <span>City: </span>{" "}
                          <span>{companyFormList?.City}</span>
                        </div>
                      </div>
                      <div className="Contact col-6">
                        <div className="d-flex gap-3">
                          <span>Contact : </span>{" "}
                          <span>{companyFormList?.Contact}</span>
                        </div>
                      </div>
                      <div className="Email col-6">
                        <div className="d-flex gap-3">
                          <span>Email : </span>{" "}
                          <span>{companyFormList?.Email}</span>
                        </div>
                      </div>
                      <div className="Website col-6">
                        <div className="d-flex gap-3">
                          <span>Website : </span>
                          <span>{companyFormList?.Website}</span>
                        </div>
                      </div>
                      <div className="Website col-6">
                        <div className="d-flex gap-3">
                          <span>Contact Person : </span>
                          <span>{companyFormList?.ContactPerson}</span>
                        </div>
                      </div>

                      <div className="GSTN/UIN col-6">
                        <div className="d-flex gap-1">
                          <span>GSTN/UIN: </span>{" "}
                          <span>{companyFormList?.Gst}</span>
                        </div>
                      </div>
                      <div className="CIN col-6">
                        <div className="d-flex gap-3">
                          <span>CIN: </span> <span>{companyFormList?.Cin}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border">
                <div className="row">
                  <div className="col-lg-4 billscontact ps-4">
                    <div className="row">
                      <div className="col-12">
                        <div className="row my-2 mt-3">
                          <div className="col-2">
                            <span className="billHeading">Bill To : </span>
                          </div>
                          <div
                            className="col-10"
                            onClick={() => handleFieldClick("billTo")}
                          >
                            {editMode === "billTo" ? (
                              <input
                                type="text"
                                name="billTo"
                                className="form-control form-control-sm"
                                value={tempData.billTo}
                                onChange={handleChange}
                                onBlur={handleFieldBlur}
                                autoFocus
                              />
                            ) : tempData.billTo ? (
                              tempData.billTo
                            ) : (
                              billingData.billTo
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-12 my-2">
                        <div className="row">
                          <div className="col-2">
                            <span className="billHeading">Address : </span>
                          </div>
                          <div
                            className="col-10"
                            onClick={() => handleFieldClick("address")}
                          >
                            {editMode === "address" ? (
                              <input
                                type="text"
                                name="address"
                                className="form-control form-control-sm"
                                value={tempData.address}
                                onChange={handleChange}
                                onBlur={handleFieldBlur}
                                autoFocus
                              />
                            ) : tempData.address ? (
                              tempData.address
                            ) : (
                              billingData.address
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-12 my-2">
                        <div className="row">
                          <div className="col-2">
                            <span className="billHeading">Phone : </span>
                          </div>
                          <div
                            className="col-10"
                            onClick={() => handleFieldClick("phone")}
                          >
                            {editMode === "phone" ? (
                              <input
                                type="text"
                                name="phone"
                                className="form-control form-control-sm"
                                value={tempData.phone}
                                onChange={handleChange}
                                onBlur={handleFieldBlur}
                                autoFocus
                              />
                            ) : tempData.phone ? (
                              tempData.phone
                            ) : (
                              billingData.phone
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-12 my-2">
                        <div className="row">
                          <div className="col-2">
                            <span className="billHeading">Email : </span>
                          </div>
                          <div
                            className="col-10"
                            onClick={() => handleFieldClick("email")}
                          >
                            {editMode === "email" ? (
                              <input
                                type="email"
                                name="email"
                                className="form-control form-control-sm"
                                value={tempData.email}
                                onChange={handleChange}
                                onBlur={handleFieldBlur}
                                autoFocus
                              />
                            ) : tempData.email ? (
                              tempData.email
                            ) : (
                              billingData.email
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-6 my-2">
                        <div className="row">
                          <div className="col-4">
                            <span className="billHeading">GSTIN/UIN : </span>
                          </div>
                          <div
                            className="col-8"
                            onClick={() => handleFieldClick("gstin")}
                          >
                            {editMode === "gstin" ? (
                              <input
                                type="text"
                                name="gstin"
                                className="form-control form-control-sm"
                                value={tempData.gstin}
                                onChange={handleChange}
                                onBlur={handleFieldBlur}
                                autoFocus
                              />
                            ) : billingData.gstin ? (
                              billingData.gstin
                            ) : (
                              billingData.gstin
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-6 my-2">
                        <div className="row">
                          <div className="col-2">
                            <span className="billHeading">PAN : </span>
                          </div>
                          <div
                            className="col-10"
                            onClick={() => handleFieldClick("pan")}
                          >
                            {editMode === "pan" ? (
                              <input
                                type="text"
                                name="pan"
                                className="form-control form-control-sm"
                                value={tempData.pan}
                                onChange={handleChange}
                                onBlur={handleFieldBlur}
                                autoFocus
                              />
                            ) : tempData.pan ? (
                              tempData.pan
                            ) : (
                              billingData.pan
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-12 my-2">
                        <div className="row">
                          <div className="col-3">
                            <span className="billHeading">
                              State/Country Name:{" "}
                            </span>
                          </div>
                          <div
                            className="col-9"
                            onClick={() => handleFieldClick("stateCountry")}
                          >
                            {editMode === "stateCountry" ? (
                              <input
                                type="text"
                                name="stateCountry"
                                className="form-control form-control-sm"
                                value={tempData.stateCountry}
                                onChange={handleChange}
                                onBlur={handleFieldBlur}
                                autoFocus
                              />
                            ) : (
                              billingData.stateCountry || "-"
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-8 border-left">
                    <div className="row invoicetable">
                      <div className="col-6 ps-3 pt-3 border-bottom">
                        <div className="row">
                          <div className="col-4">
                            <span className="billHeading">Invoice No: </span>
                          </div>
                          <div className="col-8">{invoiceNo}</div>
                        </div>
                      </div>
                      <div className="col-6 border-bottom">
                        <div className="row">
                          <div className="col-4 pt-3">
                            <span className="billHeading">Invoice Date: </span>
                          </div>
                          <div className="col-4">
                            <DatePicker
                              className="form-control form-control-sm my-2"
                              dateFormat="dd-MM-yyyy"
                              isClearable
                              todayButton="Today"
                              selected={selectedDate}
                              onChange={(date) => setSelectedDate(date)}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-6 ps-3 border-bottom pt-3">
                        <div className="row">
                          <div className="col-4">
                            <span className="billHeading">Reference No: </span>
                          </div>
                          <div className="col-8">
                            {queryQuotation?.ReferenceId || "- -"}
                          </div>
                        </div>
                      </div>
                      <div className="col-6 border-bottom">
                        <div className="row">
                          <div className="col-4 pt-3">
                            <span className="billHeading">Due Date: </span>
                          </div>
                          <div className="col-4">
                            <DatePicker
                              className="form-control form-control-sm my-2"
                              dateFormat="dd-MM-yyyy"
                              isClearable
                              todayButton="Today"
                              selected={selectedDated}
                              onChange={(date) => setSelectedDated(date)}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-6 ps-3 border-bottom py-2 pt-3">
                        <div className="row">
                          <div className="col-4">
                            <span className="billHeading">Tour Id: </span>
                          </div>
                          <div className="col-8">
                            {queryQuotation?.TourId || "- -"}
                          </div>
                        </div>
                      </div>
                      <div className="col-6 border-bottom py-2">
                        <div className="row">
                          <div className="col-4">
                            <span className="billHeading">Query Id: </span>
                          </div>
                          <div className="col-8">
                            <h6>{queryQuotation?.QueryID}</h6>
                          </div>
                        </div>
                      </div>
                      <div className="col-6 ps-3 border-bottom">
                        <div className="row">
                          <div className="col-4 pt-3">
                            <span className="billHeading">Currency: </span>
                          </div>
                          <div className="col-4">
                            <select
                              name="Currency"
                              className="form-control form-control-sm my-2"
                              value={selectedCurrency}
                              onChange={(e) =>
                                setSelectedCurrency(e.target.value)
                              }
                            >
                              {currencyName.map((item, index) => (
                                <option key={index} value={item.id}>
                                  {item.currency}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="col-6 border-bottom">
                        <div className="row">
                          <div className="col-4 pt-3">
                            <span className="billHeading">
                              Guest/ Client Name:{" "}
                            </span>
                          </div>
                          <div className="col-4">
                            <input
                              type="text"
                              className="form-control form-control-sm my-2"
                              name="Name"
                              value={guestName}
                              onChange={(e) => setGuestName(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-12 ps-3">
                        <div className="row items-center">
                          <div className="col-2 pt-3">
                            <span className="billHeading">
                              Place of Delivery:{" "}
                            </span>
                          </div>
                          <div className="col-3">
                            <select
                              name="Payment"
                              className="form-control form-control-sm my-2"
                              value={selectedDestination}
                              onChange={(e) =>
                                setSelectedDestination(e.target.value)
                              }
                            >
                              <option value="">Select</option>
                              {destinationList.map((place) => (
                                <option key={place.id} value={place.id}>
                                  {place.Name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <table className="table table-bordered itinerary-table mt-2">
                <thead>
                  <tr className="text-center">
                    <th className="p-1">Particulars</th>
                    <th className="p-1">HSN/SAC</th>
                    <th className="p-1">Amount</th>
                    <th className="p-1">TCS (%)</th>
                    <th className="p-1">TAX (%)</th>
                    <th className="p-1">Total Amount</th>
                    <th className="p-1"></th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceForm.map((service, index) => (
                    <React.Fragment key={index}>
                      <tr className="text-center">
                        <td className="w-100">
                          <textarea
                            name="ParticularName"
                            className="formControl1 mb-0"
                            value={service.ParticularName}
                            onChange={(e) => handleServiceCostForm(e, index)}
                            style={{
                              resize: "none",
                              width: "100%",
                              display: "block",
                            }}
                          />
                        </td>
                        <td>
                          <select
                            name="HSN"
                            className="formControl1"
                            style={{ width: "100px" }}
                            value={service.HSN}
                            onChange={(e) => handleServiceCostForm(e, index)}
                          >
                            <option value="">Select</option>
                            {hsnData.map((hsn) => (
                              <option
                                key={hsn.id}
                                value={`${hsn.name} (${hsn.code})`}
                              >
                                {`${hsn.name} (${hsn.code})`}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input
                            type="text"
                            name="Amount"
                            className="formControl1 w-100"
                            value={service.Amount}
                            onChange={(e) => handleServiceCostForm(e, index)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="Tcs"
                            className="formControl1 w-100"
                            value={service.Tcs}
                            onChange={(e) => handleServiceCostForm(e, index)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name="Tax"
                            className="formControl1 w-100"
                            value={service.Tax}
                            onChange={(e) => handleServiceCostForm(e, index)}
                          />
                        </td>
                        <td>{service.TotalAmount}</td>
                        <td>
                          <div className="d-flex w-100 justify-content-center gap-2">
                            <span onClick={() => handleServiceIncrement()}>
                              <i className="la la-plus border cursor-pointer bg-success text-white rounded-pill fontSize10px padding1px"></i>
                            </span>
                            <span onClick={() => handleServiceDecrement(index)}>
                              <i className="la la-minus border cursor-pointer bg-primary text-white rounded-pill fontSize10px padding1px"></i>
                            </span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={3}></td>
                        <td colSpan={3} className="text-start">
                          <div className="d-flex">
                            <select
                              className="formControl1"
                              style={{ marginRight: "6px", width: "100px" }}
                              name="State"
                              value={service.State}
                              onChange={(e) => handleServiceCostForm(e, index)}
                            >
                              <option value="">Select State</option>
                              <option value="Same State">Same State</option>
                              <option value="Other State">Other State</option>
                            </select>
                            <select
                              className="formControl1"
                              style={{ width: "100px" }}
                              name="IGST"
                              value={service.IGST}
                              onChange={(e) => handleServiceCostForm(e, index)}
                            >
                              <option value="select">Select GST</option>
                              {taxData.map((item, i) => (
                                <option key={i} value={item.rate}>
                                  {item.type === "IT"
                                    ? `${item.type}(${item.rate})`
                                    : item.type}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td colSpan={3}></td>
                        <td colSpan={2} className="text-start">
                          <span>
                            IGST (
                            {service.State === "Same State"
                              ? (parseFloat(service.IGST) / 2 || 0).toFixed(2)
                              : service.IGST}
                            %)
                          </span>
                        </td>
                        <td colSpan={1} className="text-start">
                          <input
                            type="text"
                            className="formControl1 width100px"
                            name="igstAmount"
                            value={service.igstAmount}
                            readOnly
                          />
                        </td>
                        <td></td>
                      </tr>
                      {service.State !== "Other State" && (
                        <tr>
                          <td colSpan={3}></td>
                          <td colSpan={2} className="text-start">
                            <span>CGST ({service.CGST}%)</span>
                          </td>
                          <td colSpan={1} className="text-start">
                            <input
                              type="text"
                              className="formControl1 width100px"
                              name="cgstAmount"
                              value={service.cgstAmount}
                              readOnly
                            />
                          </td>
                          <td></td>
                        </tr>
                      )}
                      <tr>
                        <td colSpan={2}></td>
                        <td colSpan={1} className="text-start">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            name="isExcludeGst"
                            checked={service.isExcludeGst}
                            onChange={(e) => handleServiceCostForm(e, index)}
                            style={{ marginRight: "4px", borderRadius: "50%" }}
                          />
                          <span>Excluded GST</span>
                        </td>
                        <td colSpan={2} className="text-start">
                          <span>Total Cost in (INR)</span>
                        </td>
                        <td colSpan={1} className="text-start">
                          {service.TotalAmount}
                        </td>
                        <td></td>
                      </tr>
                    </React.Fragment>
                  ))}
                  <tr style={{ height: "30px" }}></tr>
                  <tr>
                    <td colSpan={2} rowSpan={4}>
                      Total Tour Cost in (INR)
                    </td>
                    <td colSpan={3} className="text-start">
                      <select
                        className="formControl1"
                        style={{ marginRight: "6px", width: "100px" }}
                        value={totalState}
                        onChange={(e) => setTotalState(e.target.value)}
                      >
                        <option value="">Select State</option>
                        <option value="Same State">Same State</option>
                        <option value="Other State">Other State</option>
                      </select>
                      <select
                        className="formControl1"
                        style={{ width: "100px" }}
                        value={totalIGST}
                        onChange={(e) => setTotalIGST(e.target.value)}
                      >
                        <option value="select">Select GST</option>
                        {taxData.map((item, i) => (
                          <option key={i} value={item.rate}>
                            {item.type === "IT"
                              ? `${item.type}(${item.rate})`
                              : item.type}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td colSpan={2} className="text-start">
                      <span>
                        IGST (
                        {totalState === "Same State"
                          ? (parseFloat(totalIGST) / 2 || 0).toFixed(2)
                          : totalIGST}
                        %)
                      </span>
                    </td>
                    <td colSpan={1} className="text-start">
                      <input
                        type="text"
                        className="formControl1 width100px"
                        value={igstValue}
                        readOnly
                      />
                    </td>
                    <td></td>
                  </tr>
                  {totalState !== "Other State" && (
                    <tr>
                      <td colSpan={2} className="text-start">
                        <span>CGST ({totalCGST}%)</span>
                      </td>
                      <td colSpan={1} className="text-start">
                        <input
                          type="text"
                          className="formControl1 width100px"
                          value={cgst}
                          readOnly
                        />
                      </td>
                      <td></td>
                    </tr>
                  )}
                  <tr>
                    <td
                      colSpan={3}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={totalIsExcludeGst}
                        onChange={() => setTotalIsExcludeGst((prev) => !prev)}
                        style={{ marginRight: "4px", borderRadius: "50%" }}
                      />
                      <span
                        className="mb-0 mt-1"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        Excluded GST (Total)
                      </span>
                    </td>
                    <td colSpan={2} className="text-start">
                      <span>Total Tour Cost in (INR)</span>
                    </td>
                    <td colSpan={1} className="text-start">
                      {newAmount ? newAmount.toFixed(2) : ""}
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
              <table className="table table-bordered itinerary-table mt-2">
                <thead>
                  <tr className="">
                    <th className="p-1">SN</th>
                    <th className="p-1">Currency Type</th>
                    <th className="p-1">Bank Name</th>
                    <th className="p-1">Account Number</th>
                    <th className="p-1">Account Type</th>
                    <th className="p-1">Beneficiary Name</th>
                    <th className="p-1">Branch Address</th>
                    <th className="p-1">Branch IFSC</th>
                    <th className="p-1"></th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceForm2.map((value, index) => (
                    <tr key={index} className="text-center">
                      <td>{index + 1}</td>
                      <td>
                        <select
                          name="CurrencyType"
                          className="formControl1 width100px my-2"
                          value={value.CurrencyType}
                          onChange={(e) => handleService2CostForm(e, index)}
                        >
                          {currencyName.map((item, index) => (
                            <option key={index} value={item.id}>
                              {item.currency}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <select
                          name="BankName"
                          className="formControl1 width100px my-2"
                          value={value.BankName || ""}
                          onChange={(e) => {
                            const selectedBank = bankDetailsList.find(
                              (bank) => bank.BankName === e.target.value
                            );
                            if (selectedBank) {
                              setInvoiceForm2((prevArr) => {
                                const newArr = [...prevArr];
                                newArr[index] = {
                                  ...newArr[index],
                                  BankName: selectedBank.BankName || "",
                                  AccountNumber:
                                    selectedBank.AccountNumber || "",
                                  AccountType: selectedBank.Type || "",
                                  BeneficiaryName:
                                    selectedBank.BenificiryName || "",
                                  BranchAddress: selectedBank.Address || "",
                                  BranchIFSC: selectedBank.IfscCode || "",
                                };
                                return newArr;
                              });
                            }
                            handleService2CostForm(e, index);
                          }}
                        >
                          <option value="">Select Bank</option>
                          {bankDetailsList
                            .filter((bank) => bank.BankName)
                            .map((bank, idx) => (
                              <option key={idx} value={bank.BankName}>
                                {bank.BankName}
                              </option>
                            ))}
                        </select>
                      </td>
                      <td>
                        <input
                          name="AccountNumber"
                          type="text"
                          className="formControl1 width100px"
                          value={value.AccountNumber}
                          onChange={(e) => handleService2CostForm(e, index)}
                        />
                      </td>
                      <td>
                        <input
                          name="AccountType"
                          type="text"
                          className="formControl1 width100px"
                          value={value.AccountType}
                          onChange={(e) => handleService2CostForm(e, index)}
                        />
                      </td>
                      <td>
                        <input
                          name="BeneficiaryName"
                          type="text"
                          className="formControl1 width100px"
                          value={value.BeneficiaryName}
                          onChange={(e) => handleService2CostForm(e, index)}
                        />
                      </td>
                      <td>
                        <input
                          name="BranchAddress"
                          type="text"
                          className="formControl1 width100px"
                          value={value.BranchAddress}
                          onChange={(e) => handleService2CostForm(e, index)}
                        />
                      </td>
                      <td>
                        <input
                          name="BranchIFSC"
                          type="text"
                          className="formControl1 width100px"
                          value={value.BranchIFSC}
                          onChange={(e) => handleService2CostForm(e, index)}
                        />
                      </td>
                      <td>
                        <div className="d-flex w-100 justify-content-center gap-2">
                          <span onClick={() => handleService2Increment()}>
                            <i className="la la-plus border cursor-pointer bg-success text-white rounded-pill fontSize10px padding1px"></i>
                          </span>
                          <span onClick={() => handleService2Decrement(index)}>
                            <i className="la la-minus border cursor-pointer bg-primary text-white rounded-pill fontSize10px padding1px"></i>
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="border-left border-top border-right rounded-1 p-2">
                <h6>Terms & Conditions</h6>
                <textarea
                  id="name"
                  className="form-control form-control-sm"
                  name="Address"
                  placeholder="Address"
                  value={termCondition}
                  onChange={(e) => setTermCondition(e.target.value)}
                ></textarea>
              </div>
              <div className="border-left border-bottom border-right p-2">
                <h6>Payment</h6>
                <textarea
                  id="name"
                  className="form-control form-control-sm"
                  name="Address"
                  placeholder="Address"
                  value={paymentDes}
                  onChange={(e) => setPaymentDesc(e.target.value)}
                ></textarea>
              </div>
              <div className="pt-2 pb-2">
                <div className="row d-flex justify-content-end align-items-center">
                  <div className="col-3">
                    <div className="d-flex justify-content-end align-content-center gap-1">
                      <button className="btn btn-dark btn-custom-size">
                        Cancel
                      </button>
                      <button
                        className="btn btn-primary btn-custom-size"
                        onClick={handleInvoiceData}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ManualInvoice;
