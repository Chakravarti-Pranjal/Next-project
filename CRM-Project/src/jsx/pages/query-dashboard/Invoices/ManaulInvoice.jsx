import React, { useEffect, useState } from "react";
import { Row, Card, Col, Button, CardHeader, CardBody } from "react-bootstrap";
import deboxlogo from "../../../../images/logo/deboxlogo.png";
import { axiosOther } from "../../../../http/axios_base_url";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Alert } from "@mui/material";
import { notifyError, notifySuccess } from "../../../../helper/notify";
import PrintInvoiceComponent from "./PrintInvoiceComponent";
import PerfectScrollbar from "react-perfect-scrollbar";
import { ceil } from "lodash";
import { format } from "date-fns";

const initialFormValue = {
  invoiceDetails: [
    {
      ParticularName: "",
      Pax: "", // Add Pax field here
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
      gstInclusiveTotal: "0",
    },
  ],
  bankDetails: [
    {
      Currency_Type: "",
      AccountNumber: "",
      AccountType: "",
      BeneficiaryName: "",
      BranchAddress: "",
      BranchIFSC: "",
      BankName: "",
    },
  ],
  contactType: "Proforma Invoice",
  selectedDate: new Date(),
  selectedDueDate: new Date(),
  guestName: "",
  termCondition: "",
  paymentDesc: "",
  selectedTax: "",
  selectedState: "Same State",
  totalIGST: "",
  totalCGST: "0",
  totalState: "Same State",
  totalIsExcludeGst: false,
  billingData: {
    billTo: "",
    address: "",
    phone: "",
    email: "",
    gstin: "",
    pan: "",
    stateCountry: "",
  },
  invoiceNo: "",
  selectedCurrency: "INR",
  selectedDestination: "",
  costType: "Individual",
  id: "",
  igst: "0",
  cgst: "0",
  igstValue: "0",
  grandTotal: "0",
  taxData: [],
};

const ManualInvoice = () => {
  const { state } = useLocation();
  const isEditMode = Boolean(
    state?.row?.InvoiceId || state?.row?.id || state?.invoiceId
  );

  console.log(state, "HFGt677");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formValue, setFormValue] = useState(initialFormValue);
  const [destinationList, setDestinationList] = useState([]);
  const [companyDetails, setCompanyDetails] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [tempData, setTempData] = useState(initialFormValue.billingData);
  const [currencyName, setCurrencyName] = useState([]);
  const [hsnData, setHsnData] = useState([]);
  const [officePlace, setOfficePlace] = useState([]);
  const [bankDetailsList, setBankDetailsList] = useState([]);
  const [allCompanyList, setAllCompanyList] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [companyFormList, setCompanyFormList] = useState([]);
  const [companyListByCity, setCompanyListByCity] = useState([]);
  const [listFinalQuotationData, setListFinalQuotationData] = useState([]);
  const [itemWisePaymentList, setItemWisePaymentList] = useState([]);
  const [isUpdatingInvoiceData, setIsUpdatingInvoiceData] = useState([]);
  const [fileWisePaymentList, setFileWisePaymentList] = useState([]);
  const [sendInvoiceType, setSendInvoiceType] = useState(
    isEditMode && state?.row?.InvoiceType ? state.row.InvoiceType : "StandAlone"
  );
  const [displayOptions, setDisplayOptions] = useState({
    displayTaxRate: true, // For "Display Tax Rate"
    displayGstNo: true, // For "Display GST No"
    displayCinNo: true, // For "Display CIN No"
    displayPlaceOfSupply: true, // For "Display Place of Supply"
    displayClientGstin: true, // For "Display Agent/Client's GSTIN"
    displaySacCode: true, // For "Display SAC Code"
    displayArnNo: true, // For "Display ARN No"
  });
  //   setDisplayOptions({
  //   displayTaxRate: state.row.InvoiceDetails?.DisplayTaxRate === "yes" || false,
  //   displayGstNo: state.row.InvoiceDetails?.DisplayGSTNo === "yes" || false,
  //   displayCinNo: state.row.InvoiceDetails?.DisplayCINNo === "yes" || false,
  //   displayPlaceOfSupply: state.row.InvoiceDetails?.DisplayPlaceOfSupply === "yes" || false,
  //   displayClientGstin: state.row.InvoiceDetails?.DisplayClientGSTIN === "yes" || false,
  //   displaySacCode: state.row.InvoiceDetails?.DisplaySACCode === "yes" || false,
  //   displayArnNo: state.row.InvoiceDetails?.DisplayARNNo === "yes" || false,
  // });

  const [htmlResponse, setHtmlResponse] = useState("");

  const { queryData, qoutationData } = useSelector(
    (data) => data?.queryReducer
  );
  const queryQuotation = JSON.parse(localStorage.getItem("Query_Qoutation"));
  const { TourId, QueryAlphaNumId, QueryAllData } = queryData || {};
  const { QuotationNumber } = qoutationData || {};
  const { ReferenceId, ServiceDetail } = QueryAllData || {};
  const comapnyID = JSON.parse(localStorage.getItem("token")).companyKey;

  useEffect(() => {
    if (isEditMode && state?.row) {
      const invoiceDetails = state.row.InvoiceDetails;
      console.log(state, "GFHD&66");
      const particulars = invoiceDetails.Particulars.map((item) => ({
        ParticularName: item.ParticularName || "",
        Pax: item.Pax || "", // Add Pax field here
        HSN: item.HSN || "",
        SAC: item.SAC || "",
        Amount: item.Amount || "",
        Tcs: item.Tcs.replace("%", "") || "",
        Tax: item.Tax.replace("%", "") || "",
        TotalAmount: item.TotalAmount || "",
        IGST: item.GSTId || "",
        CGST: item.Cgst || "",
        State: item.StateChange || "select",
        isExcludeGst: item.ExcludeGstorNot === "Yes",
        igstAmount: item.Igst || "0",
        cgstAmount: item.Cgst || "0",
        gstInclusiveTotal: item.TotalTourCost || "0",
      }));

      const bankDetails = invoiceDetails.BankDetails.map((item) => ({
        Currency_Type: item.CurrencyType || "",
        AccountNumber: item.AccountNumber || "",
        AccountType: item.AccountType || "",
        BeneficiaryName: item.baneficiaryName || "",
        BranchAddress: item.BranchAddress || "",
        BranchIFSC: item.IFSC || "",
        BankName: item.BankName || "",
      }));

      setFormValue({
        ...initialFormValue,
        id: state.row.id || "",
        invoiceDetails:
          particulars.length > 0
            ? particulars
            : initialFormValue.invoiceDetails,
        bankDetails:
          bankDetails.length > 0 ? bankDetails : initialFormValue.bankDetails,
        contactType: state.convertToTax
          ? "Tax Invoice"
          : invoiceDetails.InvoiceType || initialFormValue.contactType,
        selectedDate: invoiceDetails.InvoiceDate
          ? new Date(invoiceDetails.InvoiceDate)
          : new Date(),
        selectedDueDate: invoiceDetails.DueDate
          ? new Date(invoiceDetails.DueDate)
          : new Date(),
        guestName: invoiceDetails.GuestNameorReceiptName || "",
        termCondition: invoiceDetails.TermsandCondition || "",
        paymentDesc: invoiceDetails.PaymentDesc || "",
        selectedTax: invoiceDetails.GSTId,
        selectedState: invoiceDetails.Sgst > 0 ? "Same State" : "Other State",
        totalIGST: invoiceDetails.GSTId || "",
        totalCGST: invoiceDetails.Sgst || "0",
        totalState: invoiceDetails.Sgst > 0 ? "Same State" : "Other State",
        totalIsExcludeGst:
          state.row.InvoiceDetails?.ExcludeGstorNot === "Yes" ? true : false,
        grandTotal: invoiceDetails.GrantTotal,
        billingData: {
          billTo:
            invoiceDetails.BillToCompanyName ||
            initialFormValue.billingData.billTo,
          address:
            invoiceDetails.BillToCompanyAddress ||
            initialFormValue.billingData.address,
          phone:
            invoiceDetails.BillToCompanyContact ||
            initialFormValue.billingData.phone,
          email:
            invoiceDetails.BillToCompanyEmail ||
            initialFormValue.billingData.email,
          gstin:
            invoiceDetails.BillToCompanyCIN ||
            initialFormValue.billingData.gstin,
          pan:
            invoiceDetails.BillToCompanyPan || initialFormValue.billingData.pan,
          stateCountry: "",
        },
        invoiceNo: invoiceDetails.InvoiceNo || "",
        selectedCurrency: invoiceDetails.Currency || "INR",
        selectedDestination: invoiceDetails.PlaceofDeliveryId || "",
        costType: invoiceDetails.CostType || "Individual",
      });

      setTempData({
        billTo:
          invoiceDetails.BillToCompanyName ||
          initialFormValue.billingData.billTo,
        address:
          invoiceDetails.BillToCompanyAddress ||
          initialFormValue.billingData.address,
        phone:
          invoiceDetails.BillToCompanyContact ||
          initialFormValue.billingData.phone,
        email:
          invoiceDetails.BillToCompanyEmail ||
          initialFormValue.billingData.email,
        gstin:
          invoiceDetails.BillToCompanyCIN || initialFormValue.billingData.gstin,
        pan:
          invoiceDetails.BillToCompanyPan || initialFormValue.billingData.pan,
        stateCountry: "",
      });
    }
  }, [state]);

  console.log(formValue?.grandTotal, "HFGF766");

  useEffect(() => {
    if (listFinalQuotationData) {
      setFormValue((prev) => ({
        ...prev,
        billingData: {
          billTo:
            listFinalQuotationData?.QueryInfo?.ContactInfo?.ContactPersonName,
          address:
            listFinalQuotationData?.QueryInfo?.ContactInfo?.ContactAddress ||
            "",
          phone: listFinalQuotationData?.QueryInfo?.ContactInfo?.ContactNumber,
          email: listFinalQuotationData?.QueryInfo?.ContactInfo?.ContactEmail,
          gstin: listFinalQuotationData?.CompanyGST,
          pan: listFinalQuotationData?.CompanyPAN,
          stateCountry: listFinalQuotationData?.Country,
        },
      }));
    }
  }, [listFinalQuotationData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempData({ ...tempData, [name]: value });
  };

  const handleFieldClick = (fieldName) => {
    setEditMode(fieldName);
  };

  const handleFieldBlur = () => {
    setFormValue((prev) => ({ ...prev, billingData: tempData }));
    setEditMode(null);
  };

  useEffect(() => {
    if (state?.convertToTax) {
      setFormValue((prev) => ({ ...prev, contactType: "Tax Invoice" }));
    } else if (state === "TAX") {
      setFormValue((prev) => ({ ...prev, contactType: "Tax Invoice" }));
    } else if (state === "PROFORMA") {
      setFormValue((prev) => ({ ...prev, contactType: "Proforma Invoice" }));
    } else if (state === "CREDIT") {
      setFormValue((prev) => ({ ...prev, contactType: "Credit Invoice" }));
    }
  }, [state]);

  const totalTourCost = formValue.invoiceDetails?.reduce((acc, curr) => {
    const amount = ceil(curr.TotalAmount) || 0;
    return acc + amount;
  }, 0);

  const getTaxValue = (taxId) => {
    if (!taxId || !formValue.taxData.length) return 0;
    const tax = formValue.taxData.find((item) => item.id == taxId);
    return tax ? parseFloat(tax.taxValue) || 0 : 0;
  };

  const newAmount = formValue.totalIsExcludeGst
    ? totalTourCost
    : totalTourCost +
      (formValue.totalState === "Same State"
        ? (totalTourCost * getTaxValue(formValue.totalIGST)) / 100
        : formValue.totalState === "Other State"
        ? (totalTourCost * getTaxValue(formValue.totalIGST)) / 100
        : 0);

  useEffect(() => {
    if (isEditMode) return;
    const totalTaxValue = getTaxValue(formValue.totalIGST);
    let sgstAmount = 0;
    let cgstAmount = 0;
    let igstAmount = 0;

    if (formValue.totalState === "Same State" && totalTaxValue > 0) {
      sgstAmount = (totalTourCost * (totalTaxValue / 2)) / 100;
      cgstAmount = (totalTourCost * (totalTaxValue / 2)) / 100;
    } else if (formValue.totalState === "Other State" && totalTaxValue > 0) {
      igstAmount = (totalTourCost * totalTaxValue) / 100;
    }

    const calculatedGrandTotal = formValue.totalIsExcludeGst
      ? totalTourCost.toFixed(2)
      : (totalTourCost + sgstAmount + cgstAmount + igstAmount).toFixed(2);

    setFormValue((prev) => ({
      ...prev,
      igst: totalTaxValue.toFixed(2),
      cgst: (totalTaxValue / 2).toFixed(2),
      igstValue: (formValue.totalState === "Other State"
        ? igstAmount
        : sgstAmount
      ).toFixed(2),
      totalCGST: (formValue.totalState === "Same State"
        ? cgstAmount
        : 0
      ).toFixed(2),
      grandTotal: calculatedGrandTotal,
    }));
  }, [
    formValue.totalIsExcludeGst,
    totalTourCost,
    formValue.totalIGST,
    formValue.totalState,
    isEditMode,
  ]);

  const postDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("companylist", {
        ID: comapnyID,
      });
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
      console.log(data?.FilteredQuotations[0], "HFGD76");
      setListFinalQuotationData(data?.FilteredQuotations[0]);
    } catch (error) {
      console.log(error);
    }

    try {
      const { data } = await axiosOther.post("list-final-payment", {
        QueryId: queryQuotation?.QueryID,
        QuotationNumber: queryQuotation?.QoutationNum,
      });
      const allServices = data?.Data[0]?.PaymentInfo?.PaymentBreakup.flatMap(
        (supplier) => supplier.PaymentSupplierBreakup || []
      );
      setFileWisePaymentList([data?.Data[0]?.PaymentInfo?.TotalPaymentInfo]);
    } catch (error) {
      console.log(error);
    }

    try {
      const { data } = await axiosOther.post("fetch-service-details", {
        QueryId: queryQuotation?.QueryID,
        QuotationNo: queryQuotation?.QoutationNum,
        TourId: queryQuotation?.TourId,
      });
      if (data?.status) {
        setItemWisePaymentList(data?.ServiceDetails);
      }
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
      const { data } = await axiosOther.post("taxmasterlist", {
        Search: "",
        Status: "",
        ServiceType: "13",
        Id: "",
      });
      if (data.Status === 200) {
        const taxData = data?.DataList?.map((tax) => ({
          id: tax?.id,
          name: tax?.TaxSlabName,
          taxValue: tax?.TaxValue,
        }));
        setFormValue((prev) => ({ ...prev, taxData: taxData }));
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
    if (!formValue.selectedOfficePlace) {
      const updatedFormData = {
        ComapnayName: companyList?.COMPANYNAME,
        City: companyList?.CITY,
        Contact: companyList?.PHONE,
        Email: companyList?.REGISTEREDEMAIL,
        Cin: companyList?.CIN,
        Pan: companyList?.PAN,
        Address: companyList?.ADDRESS1,
        ContactPerson: companyList?.ContectPerson,
        ComapnyLogo: companyList?.CompanyLogoImageData,
        CompanyWebsite: "",
      };
      setCompanyFormList(updatedFormData);
    } else {
      const filteredOffice = companyListByCity.filter(
        (office) => office.OfficeName === formValue.selectedOfficePlace
      );
      const updatedFormData = {
        ComapnayName: filteredOffice[0]?.CompanyName,
        City: filteredOffice[0]?.CityName,
        Contact: filteredOffice[0]?.Mobile,
        Email: filteredOffice[0]?.Email,
        Cin: filteredOffice[0]?.Cin,
        Pan: filteredOffice[0]?.Pan,
        Address: filteredOffice[0]?.Address,
        Gst: filteredOffice[0]?.GstNo,
        ContactPerson: filteredOffice?.ContacctPersonName,
        ComapnyLogo: "",
        CompanyWebsite: "",
      };
      setCompanyFormList(updatedFormData);
    }
  }, [companyList, formValue.selectedOfficePlace]);

  useEffect(() => {
    postDataToServer();
  }, []);

  useEffect(() => {
    if (isEditMode) return;

    if (sendInvoiceType === "FileWise" && fileWisePaymentList?.length > 0) {
      const updatedForm = fileWisePaymentList.map((list) => {
        const amount = parseFloat(list?.SellAmount) || 0;
        const tcs = parseFloat(list?.TCSAmount) || 0;
        const tax = parseFloat(list?.TaxAmount) || 0;
        const totalAmount = (amount + tcs + tax).toFixed(2);
        return {
          ParticularName: "Particular Toward The Cost Of Tour Package",
          Pax: "1",
          HSN: "",
          SAC: "",
          Amount: amount.toString(),
          Tcs: tcs.toString(),
          Tax: tax.toString(),
          TotalAmount: totalAmount.toString(),
          IGST: "",
          CGST: "",
          State: "",
          isExcludeGst: false,
          igstAmount: "0",
          cgstAmount: "0",
          gstInclusiveTotal: totalAmount.toString(),
        };
      });
      setFormValue((prev) => ({ ...prev, invoiceDetails: updatedForm }));
    } else if (
      sendInvoiceType === "ItemWise" &&
      itemWisePaymentList.length > 0
    ) {
      const updatedForm = itemWisePaymentList.map((item) => {
        const amount = parseFloat(item?.ServiceTotalCost) || 0;
        const tcs = parseFloat(item?.ServiceTCSvalue) || 0;
        const tax = parseFloat(item?.ServiceTaxValue) || 0;
        const totalAmount = amount + tcs + tax;
        const filteredHSN = hsnData.find((item2) => {
          return item2.name
            .toLowerCase()
            .includes(item?.ServiceType?.toLowerCase());
        });
        return {
          ParticularName: `Towards Cost for ${item?.ServiceType} in ${item?.ServiceName}`,
          Pax: "1", // Set default Pax or fetch from item if available
          HSN: filteredHSN?.code,
          SAC: "",
          Amount: amount.toString(),
          Tcs: tcs.toString(),
          Tax: tax.toString(),
          TotalAmount: totalAmount.toString(),
          IGST: "",
          CGST: "",
          State: "",
          isExcludeGst: false,
          igstAmount: "0",
          cgstAmount: "0",
          gstInclusiveTotal: totalAmount.toString(),
        };
      });
      setFormValue((prev) => ({ ...prev, invoiceDetails: updatedForm }));
    } else {
      setFormValue((prev) => ({
        ...prev,
        invoiceDetails: [initialFormValue.invoiceDetails[0]],
      }));
    }
  }, [sendInvoiceType, fileWisePaymentList, itemWisePaymentList, isEditMode]);

  // const handleChangeServiceCostFrom = (e, index) => {
  //   const { name, value, type, checked } = e.target;
  //   setFormValue((prev) => {
  //     const newInvoiceDetails = [...prev.invoiceDetails];
  //     const updatedRow = {
  //       ...newInvoiceDetails[index],
  //       [name]: type === "checkbox" ? checked : value,
  //     };

  //     const amount = parseFloat(updatedRow.Amount) || 0;
  //     let tcsAmount = 0;
  //     let taxAmount = 0;

  //     if (sendInvoiceType === "FileWise" || sendInvoiceType === "ItemWise") {
  //       tcsAmount = parseFloat(updatedRow.Tcs) || 0;
  //       taxAmount = parseFloat(updatedRow.Tax) || 0;
  //     } else {
  //       const tcs = parseFloat(updatedRow.Tcs) || 0;
  //       const tax = parseFloat(updatedRow.Tax) || 0;
  //       tcsAmount = (amount * tcs) / 100;
  //       taxAmount = (amount * tax) / 100;
  //     }

  //     updatedRow.TotalAmount = (amount + tcsAmount + taxAmount).toFixed(2);

  //     const igst = getTaxValue(updatedRow.IGST);
  //     let igstAmount = 0;
  //     let cgstAmount = 0;
  //     if (!updatedRow.isExcludeGst && updatedRow.State !== "select") {
  //       if (updatedRow.State === "Other State") {
  //         igstAmount = (amount * igst) / 100;
  //         updatedRow.CGST = "0";
  //         updatedRow.cgstAmount = "0";
  //       } else if (updatedRow.State === "Same State") {
  //         igstAmount = (amount * (igst / 2)) / 100;
  //         cgstAmount = (amount * (igst / 2)) / 100;
  //         updatedRow.CGST = (igst / 2).toFixed(2);
  //       }
  //     } else {
  //       updatedRow.CGST = updatedRow.IGST ? (igst / 2).toFixed(2) : "0";
  //       igstAmount = parseFloat(updatedRow.igstAmount) || 0;
  //       cgstAmount = parseFloat(updatedRow.cgstAmount) || 0;
  //     }

  //     updatedRow.igstAmount = igstAmount.toFixed(2);
  //     updatedRow.cgstAmount = cgstAmount.toFixed(2);
  //     updatedRow.gstInclusiveTotal = updatedRow.isExcludeGst
  //       ? updatedRow.TotalAmount
  //       : (
  //           parseFloat(updatedRow.TotalAmount) +
  //           parseFloat(updatedRow.igstAmount) +
  //           parseFloat(updatedRow.cgstAmount)
  //         ).toFixed(2);

  //     newInvoiceDetails[index] = updatedRow;
  //     return { ...prev, invoiceDetails: newInvoiceDetails };
  //   });
  // };

  const handleChangeServiceCostFrom = (e, index) => {
    const { name, value, type, checked } = e.target;
    setFormValue((prev) => {
      const newInvoiceDetails = [...prev.invoiceDetails];
      const updatedRow = {
        ...newInvoiceDetails[index],
        [name]: type === "checkbox" ? checked : value,
      };

      // Parse Amount and Pax
      const baseAmount = parseFloat(updatedRow.Amount) || 0;
      const pax = parseFloat(updatedRow.Pax) || 1; // Default to 1 if Pax is empty or invalid
      const effectiveAmount = baseAmount * pax; // Multiply Amount by Pax

      let tcsAmount = 0;
      let taxAmount = 0;

      if (sendInvoiceType === "FileWise" || sendInvoiceType === "ItemWise") {
        tcsAmount = parseFloat(updatedRow.Tcs) || 0;
        taxAmount = parseFloat(updatedRow.Tax) || 0;
      } else {
        const tcs = parseFloat(updatedRow.Tcs) || 0;
        const tax = parseFloat(updatedRow.Tax) || 0;
        tcsAmount = (effectiveAmount * tcs) / 100; // Use effectiveAmount for TCS
        taxAmount = (effectiveAmount * tax) / 100; // Use effectiveAmount for Tax
      }

      updatedRow.TotalAmount = (
        effectiveAmount +
        tcsAmount +
        taxAmount
      ).toFixed(2);

      const igst = getTaxValue(updatedRow.IGST);
      let igstAmount = 0;
      let cgstAmount = 0;
      if (!updatedRow.isExcludeGst && updatedRow.State !== "select") {
        if (updatedRow.State === "Other State") {
          igstAmount = (effectiveAmount * igst) / 100; // Use effectiveAmount for IGST
          updatedRow.CGST = "0";
          updatedRow.cgstAmount = "0";
        } else if (updatedRow.State === "Same State") {
          igstAmount = (effectiveAmount * (igst / 2)) / 100; // Use effectiveAmount for SGST
          cgstAmount = (effectiveAmount * (igst / 2)) / 100; // Use effectiveAmount for CGST
          updatedRow.CGST = (igst / 2).toFixed(2);
        }
      } else {
        updatedRow.CGST = updatedRow.IGST ? (igst / 2).toFixed(2) : "0";
        igstAmount = parseFloat(updatedRow.igstAmount) || 0;
        cgstAmount = parseFloat(updatedRow.cgstAmount) || 0;
      }

      updatedRow.igstAmount = igstAmount.toFixed(2);
      updatedRow.cgstAmount = cgstAmount.toFixed(2);
      updatedRow.gstInclusiveTotal = updatedRow.isExcludeGst
        ? updatedRow.TotalAmount
        : (
            parseFloat(updatedRow.TotalAmount) +
            parseFloat(updatedRow.igstAmount) +
            parseFloat(updatedRow.cgstAmount)
          ).toFixed(2);

      newInvoiceDetails[index] = updatedRow;
      return { ...prev, invoiceDetails: newInvoiceDetails };
    });
  };

  const handleServiceIncrement = () => {
    setFormValue((prev) => ({
      ...prev,
      invoiceDetails: [
        ...prev.invoiceDetails,
        initialFormValue.invoiceDetails[0],
      ],
    }));
  };

  const handleServiceDecrement = (index) => {
    if (formValue.invoiceDetails?.length > 1) {
      setFormValue((prev) => ({
        ...prev,
        invoiceDetails: prev.invoiceDetails.filter((_, i) => i !== index),
      }));
    }
  };

  const handleService2CostForm = (e, index) => {
    const { name, value } = e.target;
    setFormValue((prev) => {
      const newBankDetails = [...prev.bankDetails];
      newBankDetails[index] = { ...newBankDetails[index], [name]: value };
      return { ...prev, bankDetails: newBankDetails };
    });
  };

  const handleService2Increment = () => {
    setFormValue((prev) => ({
      ...prev,
      bankDetails: [...prev.bankDetails, initialFormValue.bankDetails[0]],
    }));
  };

  const handleService2Decrement = (index) => {
    if (formValue.bankDetails?.length > 1) {
      setFormValue((prev) => ({
        ...prev,
        bankDetails: prev.bankDetails.filter((_, i) => i !== index),
      }));
    }
  };

  const handleTaxChange = (e) => {
    const selectedTaxId = e.target.value;
    setFormValue((prev) => ({
      ...prev,
      selectedTax: selectedTaxId,
    }));
  };

  useEffect(() => {
    const taxValue = getTaxValue(formValue.selectedTax);
    let igst = taxValue;
    let cgst = 0;
    if (formValue.selectedState === "Same State" && taxValue > 0) {
      igst = taxValue / 2;
      cgst = igst;
    }
    setFormValue((prev) => ({
      ...prev,
      igst: igst.toFixed(2),
      cgst: cgst.toFixed(2),
    }));
  }, [formValue.selectedState, formValue.selectedTax]);

  const handleFormChangeData = (e) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormChangeDatas = (e) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({ ...prev, costType: value }));
  };

  function matchInvoiceFormData(formData) {
    return formData.map((item) => ({
      ParticularName: item.ParticularName,
      Pax: item.Pax, // Add Pax to the payload
      HSN: item.HSN,
      SAC: item.SAC,
      Amount: item.Amount,
      Tcs: item.Tcs + "%",
      Tax: item.Tax + "%",
      TotalAmount: item.TotalAmount,
      GSTId: item.IGST || "",
      StateChange: item.State === "select" ? "" : item.State,
      Igst: item.igstAmount,
      Cgst: item.cgstAmount,
      ExcludeGstorNot: item.isExcludeGst ? "Yes" : "No",
      TotalTourCost: item.gstInclusiveTotal,
    }));
  }

  console.log(formValue.totalCGST, "GHD^77");

  function transformBankFormData(data) {
    return data.map((item) => ({
      BankName: item.BankName,
      AmountType: "NEFT",
      baneficiaryName: item.BeneficiaryName,
      AccountNumber: item.AccountNumber,
      IFSC: item.BranchIFSC,
      BranchAddress: item.BranchAddress,
      BranchSwiftCode: item.BranchSwiftCode || "",
    }));
  }

  const handleFinalSubmit = async () => {
    const formatedInvoiceDate = formValue.selectedDate
      ? format(formValue.selectedDate, "yyyy-MM-dd")
      : null;
    const formatedDueDate = formValue.selectedDueDate
      ? format(formValue.selectedDueDate, "yyyy-MM-dd")
      : null;

    let typeData;
    if (formValue.contactType === "Proforma Invoice") {
      typeData = "PI";
    } else if (formValue.contactType === "Tax Invoice") {
      typeData = "Tax";
    } else if (formValue.contactType === "Credit Invoice") {
      typeData = "Credit";
    }
    const isTaxType = state?.convertToTax ? true : false;
    const payload = {
      id: isTaxType ? null : formValue.id || isUpdatingInvoiceData?.id || "",
      QueryId: queryQuotation?.QueryID,
      QuotationNo: queryQuotation?.QoutationNum,
      CompanyId: comapnyID,
      OperationId: "1",
      DepartmentId: "1",
      FinalPayment: newAmount,
      TourId: queryQuotation?.TourId,
      Type: typeData,
      ReferenceId: queryQuotation?.ReferenceId,
      InvoiceType: sendInvoiceType,
      AddedBy: 1,
      UpdatedBy: 1,
      InvoiceDetails: {
        InvoiceType: formValue.contactType,
        FormatType: "Total Invoice",
        CostType: formValue.costType,
        GstType: "",
        Tcs: "",
        TourAmount: newAmount.toString(),
        CompanyLogo: companyFormList?.ComapnyLogo,
        CompanyName: companyFormList?.ComapnayName,
        CompanyAddress: companyFormList?.Address,
        CompanyContact: companyFormList?.Contact,
        CompanyEmail: companyFormList?.Email,
        CompanyWebsite: companyFormList?.CompanyWebsite,
        CompanyPan: companyFormList?.Pan,
        CompanyCIN: companyDetails?.Cin,
        BillToCompanyName: formValue.billingData.billTo,
        BillToCompanyAddress: formValue.billingData.address,
        BillToCompanyContact: formValue.billingData.phone,
        BillToCompanyEmail: formValue.billingData.email,
        BillToCompanyWebsite: "",
        BillToCompanyPan: formValue.billingData.pan,
        BillToCompanyCIN: formValue.billingData.gstin,
        InvoiceNo: formValue.invoiceNo,
        InvoiceDate: formatedInvoiceDate,
        ReferenceNo: queryQuotation?.ReferenceId,
        DueDate: formatedDueDate,
        ToutDate: "",
        FileNo: queryQuotation?.TourId,
        Currency: formValue.selectedCurrency,
        GuestNameorReceiptName: formValue.guestName,
        PlaceofDeliveryId: formValue.selectedDestination,
        PlaceofDeliveryName: formValue.selectedDestination,
        Particulars: matchInvoiceFormData(formValue.invoiceDetails),
        TotalTourCost: totalTourCost,
        Cgst:
          formValue.totalState === "Same State" && formValue.totalIGST
            ? (getTaxValue(formValue.totalIGST) / 2).toFixed(2)
            : "0",
        Sgst:
          formValue.totalState === "Same State" && formValue.totalIGST
            ? (getTaxValue(formValue.totalIGST) / 2).toFixed(2)
            : "0",
        GSTId: formValue.totalIGST,
        GrantTotal: newAmount,
        ExcludeGstorNot: formValue.totalIsExcludeGst === true ? "Yes" : "No",
        BankDetails: transformBankFormData(formValue.bankDetails),
        TermsandCondition: formValue.termCondition || "",
        PaymentDesc: formValue.paymentDesc || "",
        DisplayTaxRate: displayOptions.displayTaxRate ? "yes" : "no",
        DisplayGSTNo: displayOptions.displayGstNo ? "yes" : "no",
        DisplayCINNo: displayOptions.displayCinNo ? "yes" : "no",
        DisplayPlaceOfSupply: displayOptions.displayPlaceOfSupply
          ? "yes"
          : "no",
        DisplayClientGSTIN: displayOptions.displayClientGstin ? "yes" : "no",
        DisplaySACCode: displayOptions.displaySacCode ? "yes" : "no",
        DisplayARNNo: displayOptions.displayArnNo ? "yes" : "no",
      },
    };

    try {
      const { data } = await axiosOther.post("/add-update-invoice", payload);
      if (data?.Status === 1) {
        notifySuccess(data?.Message);
        console.log(data, "HFGDY67");
        setHtmlResponse(data?.html);
        setIsUpdatingInvoiceData({ id: data?.Id, InvoiceId: data?.InvoiceId });
        // setFormValue(initialFormValue);
        // setTempData(initialFormValue.billingData);
        // setDestinationList([]);
        // navigate("/query/invoices");
      }
    } catch (error) {
      console.log(error, "HFGFG78");
      notifyError(error?.response?.data?.message);
    }
  };

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
                    <PrintInvoiceComponent
                      state={state}
                      htmlResponse={htmlResponse}
                    />
                    <button
                      className="btn btn-dark btn-custom-size"
                      onClick={() => navigate(-1)}
                    >
                      <span className="me-1">Back</span>
                      <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
                    </button>

                    <button
                      className="btn btn-primary btn-custom-size"
                      onClick={handleFinalSubmit}
                    >
                      {state?.row?.id || isUpdatingInvoiceData?.id
                        ? "Update"
                        : "Save"}
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
                      name="contactType"
                      id="contactType"
                      className="form-control form-control-sm"
                      value={formValue.contactType}
                      onChange={handleFormChangeData}
                    >
                      <option value="Proforma Invoice">Proforma Invoice</option>
                      <option value="Tax Invoice">Tax Invoice</option>
                      <option value="Credit Invoice">Credit Invoice</option>
                    </select>
                  </div>
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
                          onChange={(e) => setSendInvoiceType(e.target.value)}
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
                  <div className="col-lg-3 col-md-6 mb-3">
                    <label>City</label>
                    <select
                      name="selectedOfficePlace"
                      id="costType"
                      className="form-control form-control-sm"
                      value={formValue.selectedOfficePlace}
                      onChange={(e) =>
                        setFormValue((prev) => ({
                          ...prev,
                          selectedOfficePlace: e.target.value,
                        }))
                      }
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
              {formValue.costType === "Consolidated" && (
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
                  <h3>{formValue.contactType}</h3>
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
                              formValue.billingData.billTo
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
                              formValue.billingData.address
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
                              formValue.billingData.phone
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
                              formValue.billingData.email
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
                            ) : formValue.billingData.gstin ? (
                              formValue.billingData.gstin
                            ) : (
                              formValue.billingData.gstin
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
                              formValue.billingData.pan
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
                              formValue.billingData.stateCountry
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
                          <div className="col-8">
                            {state?.row?.InvoiceId ||
                              isUpdatingInvoiceData?.invoiceId ||
                              ""}
                          </div>
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
                              selected={formValue.selectedDate}
                              onChange={(date) =>
                                setFormValue((prev) => ({
                                  ...prev,
                                  selectedDate: date,
                                }))
                              }
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
                              selected={formValue.selectedDueDate}
                              onChange={(date) =>
                                setFormValue((prev) => ({
                                  ...prev,
                                  selectedDueDate: date,
                                }))
                              }
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
                              name="selectedCurrency"
                              className="form-control form-control-sm my-2"
                              value={formValue.selectedCurrency}
                              onChange={(e) =>
                                setFormValue((prev) => ({
                                  ...prev,
                                  selectedCurrency: e.target.value,
                                }))
                              }
                            >
                              {currencyName.map((item, index) => (
                                <option key={index} value={item.currency}>
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
                              name="guestName"
                              value={formValue.guestName}
                              onChange={(e) =>
                                setFormValue((prev) => ({
                                  ...prev,
                                  guestName: e.target.value,
                                }))
                              }
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
                              name="selectedDestination"
                              className="form-control form-control-sm my-2"
                              value={formValue.selectedDestination}
                              onChange={(e) =>
                                setFormValue((prev) => ({
                                  ...prev,
                                  selectedDestination: e.target.value,
                                }))
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
                    <th className="p-1">Pax</th>
                    <th className="p-1">HSN/SAC</th>
                    <th className="p-1">Amount</th>
                    <th className="p-1">TCS (%)</th>
                    <th className="p-1">TAX (%)</th>
                    <th className="p-1">Total Amount</th>
                    <th className="p-1"></th>
                  </tr>
                </thead>
                <tbody>
                  {formValue.invoiceDetails.map((service, index) => (
                    <React.Fragment key={index}>
                      <tr className="text-center">
                        <td className="w-100">
                          <textarea
                            name="ParticularName"
                            className="formControl1 mb-0"
                            value={service.ParticularName}
                            onChange={(e) =>
                              handleChangeServiceCostFrom(e, index)
                            }
                            style={{
                              resize: "none",
                              width: "100%",
                              display: "block",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name="Pax"
                            className="formControl1 w-100"
                            value={service.Pax}
                            onChange={(e) =>
                              handleChangeServiceCostFrom(e, index)
                            }
                          />
                        </td>
                        <td>
                          <select
                            name="HSN"
                            className="formControl1"
                            style={{ width: "100px" }}
                            value={service.HSN}
                            onChange={(e) =>
                              handleChangeServiceCostFrom(e, index)
                            }
                          >
                            <option value="">Select</option>
                            {service.HSN &&
                              !hsnData.some(
                                (hsn) => hsn.code === service.HSN
                              ) && (
                                <option value={service.HSN}>
                                  {service.HSN} (Custom)
                                </option>
                              )}
                            {hsnData.map((hsn) => (
                              <option key={hsn.id} value={hsn.code}>
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
                            onChange={(e) =>
                              handleChangeServiceCostFrom(e, index)
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="Tcs"
                            className="formControl1 w-100"
                            value={service.Tcs}
                            onChange={(e) =>
                              handleChangeServiceCostFrom(e, index)
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name="Tax"
                            className="formControl1 w-100"
                            value={service.Tax}
                            onChange={(e) =>
                              handleChangeServiceCostFrom(e, index)
                            }
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
                              onChange={(e) =>
                                handleChangeServiceCostFrom(e, index)
                              }
                            >
                              <option value="select">Select State</option>
                              <option value="Same State">Same State</option>
                              <option value="Other State">Other State</option>
                            </select>
                            <select
                              className="formControl1"
                              style={{ width: "100px" }}
                              name="IGST"
                              value={service.IGST}
                              onChange={(e) =>
                                handleChangeServiceCostFrom(e, index)
                              }
                            >
                              <option value="">Select GST</option>
                              {formValue?.taxData?.map((item) => (
                                <option key={item.id} value={item.id}>
                                  {item.name} ({item.taxValue}%)
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
                            {service.State === "Same State" ? "SGST" : "IGST"} (
                            {service.State === "Same State" && service.IGST
                              ? (getTaxValue(service.IGST) / 2).toFixed(2)
                              : getTaxValue(service.IGST)}
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
                      {service.State === "Same State" && (
                        <tr>
                          <td colSpan={3}></td>
                          <td colSpan={2} className="text-start">
                            <span>
                              CGST (
                              {service.IGST
                                ? (getTaxValue(service.IGST) / 2).toFixed(2)
                                : "0"}
                              %)
                            </span>
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
                            onChange={(e) =>
                              handleChangeServiceCostFrom(e, index)
                            }
                            style={{ marginRight: "4px", borderRadius: "50%" }}
                          />
                          <span>Excluded GST</span>
                        </td>
                        <td colSpan={2} className="text-start">
                          <span>Total Cost in (INR)</span>
                        </td>
                        <td colSpan={1} className="text-start">
                          {service.gstInclusiveTotal}
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
                        value={formValue.totalState}
                        onChange={(e) =>
                          setFormValue((prev) => ({
                            ...prev,
                            totalState: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select State</option>
                        <option value="Same State">Same State</option>
                        <option value="Other State">Other State</option>
                      </select>
                      {console.log(formValue.totalIGST, "HFGDT67")}
                      <select
                        className="formControl1"
                        style={{ width: "100px" }}
                        value={formValue.totalIGST}
                        onChange={(e) =>
                          setFormValue((prev) => ({
                            ...prev,
                            totalIGST: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select GST</option>
                        {formValue?.taxData?.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
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
                        {formValue.totalState === "Same State"
                          ? "SGST"
                          : "IGST"}{" "}
                        (
                        {formValue.totalState === "Same State" &&
                        formValue.totalIGST
                          ? (getTaxValue(formValue.totalIGST) / 2).toFixed(2)
                          : getTaxValue(formValue.totalIGST)}
                        %)
                      </span>
                    </td>
                    <td colSpan={1} className="text-start">
                      <input
                        type="text"
                        className="formControl1 width100px"
                        value={
                          formValue.totalState === "Same State"
                            ? (
                                totalTourCost *
                                (getTaxValue(formValue.totalIGST) / 2 / 100)
                              ).toFixed(2)
                            : (
                                totalTourCost *
                                (getTaxValue(formValue.totalIGST) / 100)
                              ).toFixed(2)
                        }
                        readOnly
                      />
                    </td>
                    <td></td>
                  </tr>
                  {formValue.totalState === "Same State" && (
                    <tr>
                      <td colSpan={2} className="text-start">
                        <span>
                          CGST (
                          {formValue.totalIGST
                            ? (getTaxValue(formValue.totalIGST) / 2).toFixed(2)
                            : "0"}
                          %)
                        </span>
                      </td>
                      <td colSpan={1} className="text-start">
                        <input
                          type="text"
                          className="formControl1 width100px"
                          value={(
                            totalTourCost *
                            (getTaxValue(formValue.totalIGST) / 2 / 100)
                          ).toFixed(2)}
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
                        checked={formValue.totalIsExcludeGst}
                        onChange={() =>
                          setFormValue((prev) => ({
                            ...prev,
                            totalIsExcludeGst: !prev.totalIsExcludeGst,
                          }))
                        }
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
                      {formValue.grandTotal}
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
                  {formValue.bankDetails.map((value, index) => (
                    <tr key={index} className="text-center">
                      <td>{index + 1}</td>
                      <td>
                        <select
                          name="Currency_Type"
                          className="formControl1 width100px my-2"
                          value={value.Currency_Type}
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
                              setFormValue((prev) => {
                                const newBankDetails = [...prev.bankDetails];
                                newBankDetails[index] = {
                                  ...newBankDetails[index],
                                  BankName: selectedBank.BankName || "",
                                  AccountNumber:
                                    selectedBank.AccountNumber || "",
                                  AccountType: selectedBank.Type || "",
                                  BeneficiaryName:
                                    selectedBank.BenificiryName || "",
                                  BranchAddress: selectedBank.Address || "",
                                  BranchIFSC: selectedBank.IfscCode || "",
                                };
                                return { ...prev, bankDetails: newBankDetails };
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

              <ul className="p-2 mb-2 d-flex gap-4 justify-content-end">
                <li>
                  <div class="form-check check-sm d-flex align-items-center">
                    <input
                      type="checkbox"
                      class="form-check-input height-em-1 width-em-1"
                      id="Tax"
                      value="Tax"
                      checked={displayOptions.displayTaxRate}
                      onChange={(e) =>
                        setDisplayOptions((prev) => ({
                          ...prev,
                          displayTaxRate: e.target.checked,
                        }))
                      }
                    />
                    <label className="fontSize11px m-0 ms-1 mt-1" for="Tax">
                      Display Tax Rate
                    </label>
                  </div>
                </li>
                <li>
                  <div class="form-check check-sm d-flex align-items-center">
                    <input
                      type="checkbox"
                      class="form-check-input height-em-1 width-em-1"
                      id="GST"
                      value="GST"
                      checked={displayOptions.displayGstNo}
                      onChange={(e) =>
                        setDisplayOptions((prev) => ({
                          ...prev,
                          displayGstNo: e.target.checked,
                        }))
                      }
                    />
                    <label className="fontSize11px m-0 ms-1 mt-1" for="GST">
                      Display GST No
                    </label>
                  </div>
                </li>
                <li>
                  <div class="form-check check-sm d-flex align-items-center">
                    <input
                      type="checkbox"
                      class="form-check-input height-em-1 width-em-1"
                      id="CIN"
                      value="CIN"
                      checked={displayOptions.displayCinNo}
                      onChange={(e) =>
                        setDisplayOptions((prev) => ({
                          ...prev,
                          displayCinNo: e.target.checked,
                        }))
                      }
                    />
                    <label className="fontSize11px m-0 ms-1 mt-1" for="CIN">
                      Display CIN No
                    </label>
                  </div>
                </li>
                <li>
                  <div class="form-check check-sm d-flex align-items-center">
                    <input
                      type="checkbox"
                      class="form-check-input height-em-1 width-em-1"
                      id="Supply"
                      value="Supply"
                      checked={displayOptions.displayPlaceOfSupply}
                      onChange={(e) =>
                        setDisplayOptions((prev) => ({
                          ...prev,
                          displayPlaceOfSupply: e.target.checked,
                        }))
                      }
                    />
                    <label className="fontSize11px m-0 ms-1 mt-1" for="Supply">
                      Display Place of Supply
                    </label>
                  </div>
                </li>
                <li>
                  <div class="form-check check-sm d-flex align-items-center">
                    <input
                      type="checkbox"
                      class="form-check-input height-em-1 width-em-1"
                      id="GSTIN"
                      value="GSTIN"
                      checked={displayOptions.displayClientGstin}
                      onChange={(e) =>
                        setDisplayOptions((prev) => ({
                          ...prev,
                          displayClientGstin: e.target.checked,
                        }))
                      }
                    />
                    <label className="fontSize11px m-0 ms-1 mt-1" for="GSTIN">
                      Display Agent/Client's GSTIN
                    </label>
                  </div>
                </li>
                <li>
                  <div class="form-check check-sm d-flex align-items-center">
                    <input
                      type="checkbox"
                      class="form-check-input height-em-1 width-em-1"
                      id="SAC"
                      value="SAC"
                      checked={displayOptions.displaySacCode}
                      onChange={(e) =>
                        setDisplayOptions((prev) => ({
                          ...prev,
                          displaySacCode: e.target.checked,
                        }))
                      }
                    />
                    <label className="fontSize11px m-0 ms-1 mt-1" for="SAC">
                      Display SAC Code
                    </label>
                  </div>
                </li>
                <li>
                  <div class="form-check check-sm d-flex align-items-center">
                    <input
                      type="checkbox"
                      class="form-check-input height-em-1 width-em-1"
                      id="ARN"
                      value="ARN"
                      checked={displayOptions.displayArnNo}
                      onChange={(e) =>
                        setDisplayOptions((prev) => ({
                          ...prev,
                          displayArnNo: e.target.checked,
                        }))
                      }
                    />
                    <label className="fontSize11px m-0 ms-1 mt-1" for="ARN">
                      Display ARN No
                    </label>
                  </div>
                </li>
              </ul>

              <div className="border-left border-top border-right rounded-1 p-2">
                <h6>Terms & Conditions</h6>
                <textarea
                  id="termCondition"
                  className="form-control form-control-sm"
                  name="termCondition"
                  placeholder="Terms & Conditions"
                  value={formValue.termCondition}
                  onChange={(e) =>
                    setFormValue((prev) => ({
                      ...prev,
                      termCondition: e.target.value,
                    }))
                  }
                ></textarea>
              </div>
              <div className="border-left border-bottom border-right p-2">
                <h6>Payment</h6>
                <textarea
                  id="paymentDesc"
                  className="form-control form-control-sm"
                  name="paymentDesc"
                  placeholder="Payment Description"
                  value={formValue.paymentDesc}
                  onChange={(e) =>
                    setFormValue((prev) => ({
                      ...prev,
                      paymentDesc: e.target.value,
                    }))
                  }
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
                        onClick={handleFinalSubmit}
                      >
                        {state?.row?.id || isUpdatingInvoiceData?.id
                          ? "Update"
                          : "Save"}
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
