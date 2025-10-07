import React, { useEffect, useRef, useMemo, memo } from "react";
import Select from "react-select";
import { parseISO } from "date-fns";
import { IoClose } from "react-icons/io5";
import JoditEditor from "jodit-react";
import HtmlReactParser from "html-react-parser";
import bg from "../../../../images/voucher/bg.png";
import DatePicker from "react-datepicker";
import sign from "../../../../images/voucher/sign.png";
import "./voucher.css";
import { useState } from "react";
import { Button, NavItem } from "react-bootstrap";
import { clientVoucherInitialValue } from "../../query-dashboard/quotation-second/qoutation_initial_value";
import { axiosOther } from "../../../../http/axios_base_url";
import { notifySuccess, notifyError } from "../../../../helper/notify";
import { ToastContainer } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import html2pdf from "html2pdf.js";

import PendingPopup from "./PendingPopup";
import { Details } from "@mui/icons-material";
import { customStylesForhotel } from "../../supplierCommunication/SupplierConfirmation/customStyle";
function Voucher(props) {
  const ArrivalDetailsarrya = [
    {
      Date: "Arrival",
      Details: "",
    },
  ];
  const ArrivalDetailsObj = {
    Date: "",
    Details: "",
  };
  const [paxName, setPaxName] = useState([]);
  const [pax, setPax] = useState([]);
  const [arrivaldetail, setArrivaldetail] = useState(ArrivalDetailsarrya);
  const [iseditable, setIsEditable] = useState(false);
  const [printArrival, setPrintArrival] = useState(true);
  const [billing, setBilling] = useState(true);
  const [clientVoucherValue, setClientVoucherValue] = useState(
    props.InitialValue || {
      PaxName: [],
    }
  );
  const [editMode, setEditMode] = useState(false);
  const [userSign, setUserSign] = useState("Mohd Rizwan");
  console.log(clientVoucherValue, "props75");

  // console.log(props.allData.ServiceDetails[0]?.DestinationName, 'voucherPropsksjfl');

  const printRef = useRef(null);
  const [content, setContent] = useState("");
  // const [voucherDate, setVoucherDate] = useState(new Date());
  const [voucherNo, setVoucherNo] = useState(null);
  const [printData, setPrintData] = useState();
  const [roomData, setRoomData] = useState({
    Single: props?.singleRoom?.RoomCost || 0,
    Twin: props?.twinRoom?.RoomCost || 0,
    Double: props?.doubleRoom?.RoomCost || 0,
    ExtraBed: props?.extraBed?.RoomCost || 0,
    MealPlan: props?.allData?.ServiceDetails?.[0]?.MealPlanName || "",
  });
  const [agentList, setAgentList] = useState([]);

  console.log(props, "prop789");

  useEffect(() => {
    setContent(`${
      props.servicetype == "Hotel"
        ? ` <table class="editable-table fs-6 mt-2 text-dark" border="1">
          <tr>
            <td class="editable-td">Check In : ${
              clientVoucherValue.CheckIn ||
              props?.allData?.ConfirmationDate ||
              " "
            }</td>
            <td class="editable-td">Check Out : ${
              clientVoucherValue.CheckOut || props?.allData?.CutOfDate || " "
            }</td>
            <td class="editable-td">Nights : ${props.totalnights}</td>
          </tr>
          <tr>
            <td class="editable-td" colspan="2">Room Type : ${
              props.roomtype
            } </tdt>
            <td colspan="1" class="editable-td">Meal Plan : ${
              props.mealPlan
            }</td>
          </tr>
        </table>`
        : `<table class="editable-table fs-6 mt-2 text-dark" border="1">
         <tr>
            <td class="editable-td">${props.date || props.arrivaldate} : ${
            props.destinantionname
          } - ${props.servicename}</td>
            </tr>
            </table>`
    }

      `);
  }, [clientVoucherValue]);

  useEffect(() => {
    const fetchVoucherNo = async () => {
      try {
        const response = await axiosOther.get("generate-voucherno");
        setVoucherNo(response.data); // Assuming response.data has the voucher number
      } catch (error) {
        console.error("Error fetching voucher number:", error);
      }
    };

    if (
      !clientVoucherValue?.VoucherNo ||
      clientVoucherValue?.VoucherNo === ""
    ) {
      fetchVoucherNo();
    }
  }, []);

  const queryQuotation = JSON.parse(localStorage.getItem("Query_Qoutation"));

  if (props.Type === "Client") {
    useEffect(() => {
      const fetchClientVoucher = async () => {
        const clientPayload = {
          QueryId: queryQuotation?.QueryID,
          QuotationNumber:
            props?.InitialValue?.QuotationNumber ||
            queryQuotation?.QoutationNum,
          CompanyId: String(props.companyid),
          HotelId: String(props.serviceid),
          // Type: "Client",
          // ServiceType: props.servicetype,
          // ServiceId: props.serviceid,
          // ServiceUniqueId: props.serviceUniqueId,
          // SupplierId: props.supplierid,
        };

        console.log(clientPayload, "clientPayload");
        try {
          const { data } = await axiosOther.post(
            "listfinalvoucher",
            clientPayload
          );
          console.log(data, "responsedjkfd");
          if (data.Status === 1 && data?.Data?.length > 0) {
            setClientVoucherValue(data?.Data);
            setVoucherNo(data?.Data?.VoucherNo);
          }
        } catch (error) {
          console.error("Error fetching client voucher data:", error);
        }
      };

      fetchClientVoucher();
    }, []);
  }

  console.log(clientVoucherValue, "clientVoucherValue74586", voucherNo);

  const addPax = (paxName) => {
    if (paxName === "") {
      alert("Pax name cannot be empty");
      return;
    }

    console.log(voucherNo.voucher_number, "propsVoucherNo");

    setClientVoucherValue((prev) => ({
      ...prev,
      PaxName: [...prev.PaxName, paxName],
    }));

    setPaxName("");
  };

  const removePax = (index) => {
    setClientVoucherValue((prev) => ({
      ...prev,
      PaxName: prev.PaxName.filter((_, i) => i !== index),
    }));
  };

  const onDownloadPDF = () => {
    const element = printRef.current;
    const opt = {
      margin: 0,
      filename: "voucher.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Voucher",
          text: "Here’s something interesting",
          url: window.location.href,
        });
        console.log("Shared successfully");
      } catch (error) {
        console.error("Sharing failed:", error);
      }
    } else {
      alert("Web Share API not supported in this browser.");
    }
  };

  const onPrint = () => {
    // const printContent = printRef.current.innerHTML;
    const printContent = printData?.VoucherHtml;
    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Voucher</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              color: #333;
            }
            .voucher-inner-1box {
              width: 100%;
              max-width: 900px;
              margin: 0 auto;
              border: 1px solid #ddd;
              padding: 20px;
              box-sizing: border-box;
            }
            .top-div {
              // background-color: #e30613; /* Red background color as seen in the screenshot */
              backgroundImage: url(${bg}) ;
              color: white;
              padding: 15px 40px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              background-size: cover;
              -webkit-print-color-adjust: exact; /* Ensure background color prints */
              print-color-adjust: exact;
            }
            .top-div img {
              max-height: 60px;
            }
            .d-flex {
              display: flex;
            }
            .justify-content-between {
              justify-content: space-between;
            }
            .justify-content-center {
              justify-content: center;
            }
            .align-items-center {
              align-items: center;
            }
            .align-items-start {
              align-items: flex-start;
            }
            .flex-column {
              flex-direction: column;
            }
            .flex-wrap {
              flex-wrap: wrap;
            }
            .text-white {
              color: white;
            }
            . {
              font-weight: 700;
              color: #333;
            }
            .fs-2 {
              font-size: 28px;
            }
            .fs-4 {
              font-size: 24px;
            }
            .fs-5 {
              font-size: 18px;
            }
            .fs-5 {
              font-size: 16px;
            }
            .fs-6 {
              font-size: 14px;
            }
            .gap-2 {
              gap: 8px;
            }
            .gap-3 {
              gap: 12px;
            }
            .gap-5 {
              gap: 20px;
            }
            .mt-2 {
              margin-top: 8px;
            }
            .mt-3 {
              margin-top: 12px;
            }
            .mt-4 {
              margin-top: 16px;
            }
            .p-1 {
              padding: 4px;
            }
            .p-2 {
              padding: 8px;
            }
            .ps-2 {
              padding-left: 8px;
            }
            .ps-5 {
              padding-left: 40px;
            }
            .pe-5 {
              padding-right: 40px;
            }
            .w-50 {
              width: 50%;
            }
            .w-100 {
              width: 100%;
            }
            .text-center {
              text-align: center;
            }
            .text-start {
              text-align: left;
            }
            .align-middle {
              vertical-align: middle;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 4px;
              text-align: left;
            }
            th {
              background-color: #f5f5f5;
              font-weight: bold;
            }
            .visually-hidden {
              display: none;
            }
            textarea {
              width: 100%;
            }
            .sign {
              max-width: 100px;
              margin-top: 8px;
              text-align: right;
            }
            .sign-block {
              width: 100%;
              text-align: right;
            }

            @media print {
              .voucher-btn-5,
              input[type="text"],
              input[type="date"],
              input[type="radio"],
              .visually-hidden {
                display: none !important; /* Hide interactive elements */
              }
                .options, .bill {
                    display: none !important;
                  }
                .note{
                  border: none;
                }
                  .sign-block {
                  width: 100%;
                  text-align: right;
                }
              /* Replace input fields with their values */
              input[type="text"][placeholder="City"],
              input[type="text"][placeholder="Transport"],
              input[type="text"][placeholder="Place"] {
                display: inline-block !important;
                border: none;
                padding: 8px;
                color: #333;
              }
              input[type="text"][placeholder="City"]::after,
              input[type="text"][placeholder="Transport"]::after,
              input[type="text"][placeholder="Place"]::after {
                content: attr(value);
              }
              input[type="date"] {
                display: inline-block !important;
                border: none;
                padding: 8px;
                color: #333;
              }

              /* Ensure table alignment */
              table{
                text-align: left;
                margin-top: 8px;
                border: 1px solid #ddd;
              }
              th, td {
                text-align: left;
              }

              /* Preserve background colors */
              .top-div {
                background-color: #e30613 !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const printOnStationery = () => {
    const printContent = printRef.current.innerHTML;
    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Voucher</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
              color: #333;
            }
            .voucher-inner-1box {
              width: 100%;
              max-width: 900px;
              margin: 0 auto;
              border: 1px solid #ddd;
              padding: 20px;
              box-sizing: border-box;
            }
            .top-div {
              // background-color: #e30613; /* Red background color as seen in the screenshot */
              backgroundImage: url(${bg}) ;
              color: white;
              padding: 15px 40px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              background-size: cover;
              -webkit-print-color-adjust: exact; /* Ensure background color prints */
              print-color-adjust: exact;
            }
            .top-div img {
              max-height: 60px;
            }
            .d-flex {
              display: flex;
            }
            .justify-content-between {
              justify-content: space-between;
            }
            .justify-content-center {
              justify-content: center;
            }
            .align-items-center {
              align-items: center;
            }
            .align-items-start {
              align-items: flex-start;
            }
            .flex-column {
              flex-direction: column;
            }
            .flex-wrap {
              flex-wrap: wrap;
            }
            .text-white {
              color: white;
            }
            . {
              font-weight: bold;
              color: #333;
            }
            .fs-2 {
              font-size: 28px;
            }
            .fs-4 {
              font-size: 24px;
            }
            .fs-5 {
              font-size: 18px;
            }
            .fs-5 {
              font-size: 16px;
            }
            .fs-6 {
              font-size: 14px;
            }
            .gap-2 {
              gap: 8px;
            }
            .gap-3 {
              gap: 12px;
            }
            .gap-5 {
              gap: 20px;
            }
            .mt-2 {
              margin-top: 8px;
            }
            .mt-3 {
              margin-top: 12px;
            }
            .mt-4 {
              margin-top: 16px;
            }
            .p-1 {
              padding: 4px;
            }
            .p-2 {
              padding: 8px;
            }
            .ps-2 {
              padding-left: 8px;
            }
            .ps-5 {
              padding-left: 40px;
            }
            .pe-5 {
              padding-right: 40px;
            }
            .w-50 {
              width: 50%;
            }
            .w-100 {
              width: 100%;
            }
            .text-center {
              text-align: center;
            }
            .text-start {
              text-align: left;
            }
            .align-middle {
              vertical-align: middle;
            }
            table
              width: 100%;
              border-collapse: collapse;
              margin-top: 8px;
            }
            th, td {
              text-align: left;
            }
            th {
              background-color: #f5f5f5;
              font-weight: bold;
              border: 1px solid #ddd;
              padding: 8px;
            }
            .visually-hidden {
              display: none;
            }
            textarea {
              width: 100%;
              min-height: 60px;
              padding: 4px;
              border: 1px solid #ddd;
              box-sizing: border-box;
            }
            .sign {
              max-width: 100px;
              margin-top: 8px;
            }
             .sign-block {
              width: 100%;
              text-align: right;
            }
            @media print {
              .voucher-btn-5,
              input[type="text"],
              input[type="date"],
              input[type="radio"],
              .visually-hidden {
                display: none !important; /* Hide interactive elements */
              }
                .options, .top-div, .bill {
                    display: none !important;
                  }
                .note{
                  border: none;
                }
                .sign-block {
                  width: 100%;
                  text-align: right;
                }
              /* Replace input fields with their values */
              input[type="text"][placeholder="City"],
              input[type="text"][placeholder="Transport"],
              input[type="text"][placeholder="Place"] {
                display: inline-block !important;
                border: none;
                padding: 8px;
                color: #333;
              }
              input[type="text"][placeholder="City"]::after,
              input[type="text"][placeholder="Transport"]::after,
              input[type="text"][placeholder="Place"]::after {
                content: attr(value);
              }
              input[type="date"] {
                display: inline-block !important;
                border: none;
                padding: 8px;
                color: #333;
              }
              /* Ensure table alignment */
              table, th, td {
                text-align: left;
                border: 1px solid #ddd;
              }
              /* Preserve background colors */
              .top-div {
                background-color: #e30613 !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const downloadDOCX = () => {
    if (!printRef?.current) return;

    const textContent = printRef.current.innerText;

    const doc = new Document({
      sections: [
        {
          children: [new Paragraph(textContent)],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "voucher.docx");
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientVoucherValue({
      ...clientVoucherValue,
      [name]: value,
    });
  };

  const handleRoomChange = (e) => {
    const { name, value } = e.target;
    setRoomData({
      ...roomData,
      [name]: value,
    });
  };

  const handleDateChange = (name, date) => {
    if (!date) return;
    setClientVoucherValue((prev) => ({
      ...prev,
      [name]: date.toISOString(),
    }));
  };

  const iframePrintRef = useRef(null);

  const handlePrint = (data) => {
    const htmlData = data;
    const iframe = iframePrintRef.current;

    if (iframe && htmlData) {
      const doc = iframe.contentWindow.document;
      doc.open();
      doc.write(htmlData);
      doc.close();
      iframe.onload = () => {
        setTimeout(() => {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
        }, 300);
      };
    } else {
      console.error("No iframe or HTML data available for printing");
    }
  };

  const handleSubmit = async () => {
    // const data = {
    //   ...clientVoucherValue,
    //   Type: "Client",
    //   ProductType: "Voucher",
    //   VoucherNo:clientVoucherValue?.VoucherNo || voucherNo?.voucher_number?.toString(),
    //   Address: props?.supplieraddress,
    //   CompanyId: props?.companyid?.toString(),
    //   CompanyLogo: props?.companylogo,
    //   CompanyName: props?.companyname,
    //   ConfirmationNo: props?.confirmationno,
    //   ContactPersonaName: props?.contactpersonname,
    //   Date: new Date().toISOString(),
    //   DestinationName: props?.destinantionname,
    //   Destinationid: props?.destinationid?.toString(),
    //   Email: props?.ClientEmail,
    //   Phone: props?.ClientMobile,
    //   QueryId: props?.queryid,
    //   QuotationNo: props?.quotationnumber,
    //   ServiceId: props?.serviceid?.toString(),
    //   ServiceName: props?.servicename,
    //   ServiceType: props?.servicetype,
    //   SupplierId: props?.supplierid?.toString(),
    //   Suppliername: props?.suppliername,
    //   TotalPax: props?.totalpax?.toString(),
    //   TourId: props?.tourid,
    //   ReservationUniqueId: props?.uniqueid,
    //   VoucherDate: new Date().toISOString(),
    //   Website: props?.website,
    //   RoomType: props?.roomtype,
    //   MealPlan: props?.mealPlan,
    //   CheckIn: clientVoucherValue?.CheckIn || props?.CheckIn || "d/mm/yyyy",
    //   CheckOut: clientVoucherValue?.CheckOut || props?.CheckOut || "d/mm/yyyy",
    //   Nights: props?.totalnights?.toString(),
    //   VoucherNo:
    //     clientVoucherValue?.VoucherNo || voucherNo?.voucher_number?.toString(),
    // };

    const payload = {
      Type: "Client",
      ProductType: "Voucher",
      VoucherNo:
        clientVoucherValue?.VoucherNo ||
        voucherNo?.voucher_number?.toString() ||
        "",
      TourCode: props?.tourid || "",
      QueryId: props?.queryid || "",
      QuotationNo: props?.quotationnumber || "",
      VoucherDataJson: {
        ReservationUniqueId: props?.uniqueid || "",
        CompanyId: props?.companyid?.toString() || "",
        CompanyName: props?.companyname || "",
        Website: props?.website || "",
        CompanyLogo: props?.companylogo || "",
        ServiceId: props?.serviceid?.toString() || "",
        ServiceName: props?.servicename || "",
        ServiceType: props?.servicetype || "",
        Address: props?.supplieraddress || "",
        ContactPersonaName: props?.contactpersonname || "",
        Email: props?.ClientEmail || "",
        Phone: props?.ClientMobile || "",
        TourId: props?.tourid || "",
        VoucherDate: new Date().toISOString(),
        TotalPax: props?.totalpax?.toString() || "",
        ConfirmationNo: props?.confirmationno || "",
        PaxName: props?.paxname || [],
        Date: new Date().toISOString(),
        SupplierId: props?.supplierid?.toString() || "",
        Suppliername: props?.suppliername || "",
        Destinationid: props?.destinationid?.toString() || "",
        DestinationName: props?.destinantionname || "",
        Nights: props?.totalnights?.toString() || "",
        ArrivalOn: props?.arrivalon || "",
        DepartureOn: props?.departureon || "",
        Fromdestination: props?.fromdestination || "",
        ToDestination: props?.todestination || "",
        ArrivalBy: props?.arrivalby || "",
        ArrivalAt: props?.arrivalat || "",
        DepartureBy: props?.departureby || "",
        DepartureAt: props?.departureat || "",
        Note: props?.note || "",
        BillingInstructions: props?.billinginstructions || "",
        AuthorisedName: props?.authorisedname || "",
        CheckIn:
          clientVoucherValue?.CheckIn ||
          props?.CheckIn ||
          new Date().toISOString(),
        CheckOut:
          clientVoucherValue?.CheckOut ||
          props?.CheckOut ||
          new Date().toISOString(),
        RoomType: [props?.roomtype] || [],
        MealPlan: [props?.mealPlan] || [],
      },
      CreatedBy: "1",
      UpdatedBy: "1",
    };

    try {
      // const isUpdate = !!clientVoucherValue?.VoucherNo;

      // console.log(isUpdate, "isUpdate");
      // console.log(clientVoucherValue, "clientVoucherValue");

      // if (!isUpdate && !voucherNo?.voucher_number) {
      //   notifyError("Voucher number is required to create a new voucher");
      //   return;
      // }

      // if (props.Type === "Client") {
      //   const endpoint = isUpdate
      //     ? "updateClientVoucherData"
      //     : "storeClientVoucherData";
      //   const response = await axiosOther.post(endpoint, payload);
      //   if (response.status === 200 || response.status === 201) {
      //     console.log(response, 'responseAfterSave');
      //     notifySuccess(
      //       isUpdate
      //         ? "Client voucher updated successfully"
      //         : "Client voucher created successfully"
      //     );
      //   }
      // } else if (props.Type === "Supplier") {
      //   const endpoint = isUpdate
      //     ? "updateSupplierVoucherData"
      //     : "storeSupplierVoucherData";
      //   const response = await axiosOther.post(endpoint, payload);
      //   if (response.status === 200 || response.status === 201) {
      //     notifySuccess(
      //       isUpdate
      //         ? "Supplier voucher updated successfully"
      //         : "Supplier voucher created successfully"
      //     );
      //   }
      // }

      const { data } = await axiosOther.post("addfinalvoucher", payload);
      console.log(data, "skfksdjkf3632");
      if (data?.Status == 1) {
        notifySuccess(data?.Message || "voucher saved successfully");
        setPrintData(data?.Data);

        handlePrint(data?.Data?.VoucherHtml);
        // Open as popup
        // const popup = window.open("", "_blank", "width=1000,height=800,scrollbars=yes,resizable=yes");
        // popup.document.write(data?.Data?.VoucherHtml);
        // popup.document.close();
        // popup.focus();
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      notifyError("An error occurred while saving the voucher");
    }
  };

  console.log(printData, "VoucherData42");

  const handleFieldClick = () => {
    setEditMode(true);
  };

  const handleFieldBlur = () => {
    setEditMode(null);
  };
  const handleArrivalIncrement = () => {
    setArrivaldetail((prev) => {
      let newarr = [...prev];
      newarr = [...newarr, ArrivalDetailsObj];
      return newarr;
    });
  };
  const handleArrivalDecrement = (index) => {
    if (arrivaldetail.length > 2) {
      let newarr = [...arrivaldetail];
      const filterform = newarr?.filter((_, ind) => ind !== index);

      setArrivaldetail(filterform);
    }
  };
  const getArrivalDOB = (index) => {
    const dateStr = arrivaldetail?.[index]?.Date;
    return dateStr ? new Date(dateStr) : null; // works because we store ISO
  };

  // ✅ Store ISO format in state (safe for JS Date)
  const handleArrivalCalender = (date, index) => {
    const isoDate = date ? date.toISOString().split("T")[0] : ""; // "2025-09-07"
    setArrivaldetail((prev) => {
      const newArr = [...prev];
      newArr[index] = { ...newArr[index], Date: isoDate };
      return newArr;
    });
  };

  const handleArrivalformForm = (e, index) => {
    const { name, value } = e.target;
    setArrivaldetail((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = { ...newArr[index], [name]: value };
      return newArr;
    });
  };

  const handleArrivalDateChange = (date, index) => {
    setArrivaldetail((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = {
        ...newArr[index],
        Date: date, // assuming "Date" is the key you use
      };
      return newArr;
    });
  };

  // const postDataToServer = async () => {
  //   try {
  //     const {data} = await axiosOther.post('listvoucherjson', {
  //       QueryId: queryData?.QueryID,
  //       QuotationNo: queryData?.QoutationNum,
  //       Type: 'Client',
  //       CompanyId: 27,
  //       TemplateType: 'Voucher'
  //     })
  //       if(data?.Status === 1){
  //         setPrintData(data?.HTML)
  //       }
  //     console.log(data, 'voucherjson');
  //   } catch (e) {
  //     console.log('Error in json', e);
  //   }

  //   // try {
  //   //   const data = await axiosOther.post('voucherwordfile', {

  //   //   })
  //   // } catch (e) {
  //   //   console.log('Error in json', e);
  //   // }

  // }

  // useEffect(() => {
  //   postDataToServer();
  // }, []);

  useEffect(() => {
    const getBillingData = async () => {
      try {
        const data = await axiosOther.post("list-billing-instruction", {
          Name: "Test Billing Instruction",
        });
        console.log(data, "billingData");
      } catch (e) {
        console.log("Error in billing data", e);
      }
    };

    getBillingData();
  }, []);

  const handledatachange = (e) => {
    const { name, value } = e.target;
    setArrivaldetail({
      ...clientVoucherValue,
      [name]: value,
    });
  };
  const serviceDetails = props?.allData?.ServiceDetails?.[0] || {};
  const roomBedTypes = serviceDetails?.RoomBedType || [];

  // extract values
  const singleRoom = roomBedTypes.find((r) => r.RoomBedTypeName == "SGL Room");
  const doubleRoom = roomBedTypes.find((r) => r.RoomBedTypeName == "DBL Room");
  const extraBed = roomBedTypes.find((r) => r.RoomBedTypeName == "ExtraBed(A)");

  const queryData = JSON.parse(localStorage.getItem("Query_Qoutation"));

  // for agent list
  // const filteringAgent = agentList?.filter((agent) => {
  //   if (formValue?.ServiceDetail?.BusinessTypeId == 14) {
  //     return agentSearch != ""
  //       ? agent?.CompanyName?.toLowerCase()?.includes(
  //           agentSearch?.toLowerCase()
  //         )
  //       : agent;
  //   } else {
  //     return agentSearch != ""
  //       ? `${agent?.FirstName} ${agent?.LastName}`
  //           ?.toLowerCase()
  //           ?.includes(agentSearch?.toLowerCase())
  //       : agent;
  //   }
  // });

  // const handleClickOutside = (event) => {
  //   if (popupRef.current && !popupRef.current.contains(event.target)) {
  //     setShowAgentPopup(false);
  //   }
  // };

  // useEffect(() => {
  //   if (showAgentPopup) {
  //     document.addEventListener("mousedown", handleClickOutside);
  //   }
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [showAgentPopup]);

  useEffect(() => {
    // setAgentList([]);

    // if (!isUpdating) {
    //   setAgentSearch("");
    //   setAgentData({
    //     Agent: "",
    //   });
    // }

    const gettingDataForDropdown = async () => {
      try {
        const { data } = await axiosOther.post("agentlist", {
          // id: "",
          // BussinessType: formValue?.ServiceDetail?.BusinessTypeId,
        });
        const agentDataList = data?.DataList?.map(
          (agent) => agent?.CompanyName
        );
        console.log(agentDataList, "agentDataList");
        setAgentList(agentDataList);
      } catch (err) {
        console.log(err);
      }
    };
    gettingDataForDropdown();
  }, []);

  // console.log(agentSearch, 'AgentSearch452')

  // New useEffect to handle API call when agentSearch.length >= 3
  // useEffect(() => {
  //   if (agentSearch?.length >= 3) {
  //     const searchAgents = async () => {
  //       // const businessId = formValue?.ServiceDetail?.BusinessTypeId;
  //       try {
  //         const { data } = await axiosOther.post("agentlist" ,{
  //             id: "",
  //             // BussinessType: formValue?.ServiceDetail?.BusinessTypeId,
  //             CompanyName: agentSearch,
  //           }
  //         );
  //         setAgentList(data?.DataList);
  //       } catch (err) {
  //         console.log(err);
  //         setAgentList([]);
  //       }
  //     };
  //     searchAgents();
  //   }
  // }, [agentSearch]);

  return (
    <>
      <div className="voucher-innerbox d-flex flex-column gap-5">
        <ToastContainer />
        <div className="Voucher-outerbox ">
          <div className="voucher-inner-1box print" ref={printRef}>
            {/*<div className="top-div d-flex justify-content-between align-items-center p-2 ps-5 text-white pe-5">
            <div className=" d-flex justify-content-center align-items-start flex-column text-white">
              <span className="fs-2">{props.companyname}</span>
              <span>Address: {props.ClientAddress}</span>
              <span>
                {props.ClientEmail} || {props.ClientMobile}
              </span>
            </div>
            <img src={props.companylogo} alt="Company Logo" />
          </div>*/}
            {/* 1st div */}
            <div className=" d-flex justify-content-between  mt-4">
              {/* ambesador part */}
              <div className="">
                <div className="d-flex text-dark gap-2 fs-4 align-items-center">
                  <span className="">Name : </span>
                  <span>
                    {/*props.Type === "Client"
                    ? props.servicename
                    : props.servicename*/}

                    <input
                      type="text"
                      placeholder="Place"
                      className="form-control form-control-sm bg-white text-dark"
                      style={{ width: "300px" }}
                      name="Place"
                      value={props.servicename}
                      onChange={handleChange}
                    />
                  </span>
                </div>
                {props?.servicetype == "Hotel" && (
                  <div className="d-flex text-dark gap-2 fs-4 align-items-center mt-1">
                    <span className="">Room Type : </span>
                    <span>
                      <input
                        type="text"
                        placeholder="Place"
                        className="form-control form-control-sm bg-white text-dark"
                        style={{ width: "300px" }}
                        name="Place"
                        value={props?.roomtype}
                        onChange={handleChange}
                      />
                    </span>
                  </div>
                )}

                {/* <div className="d-flex text-dark gap-2 fs-5 align-items-center">
                <span className="">Address : </span>
                <span className="fs-6">{props.supplieraddress}</span>
              </div>*/}
                {/*
              <div className="d-flex text-dark gap-2 fs-5 align-items-center gap-5">
                <div className="d-flex text-dark gap-2">
                  <span className="">In favour of : </span>
                  <span>{props.contactpersonname}</span>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <input
                    type="text"
                    placeholder="Pax Name"
                    className="form-control form-control-sm bg-white text-dark"
                    value={paxName}
                    onChange={(e) => setPaxName(e.target.value)}
                  />
                  <Button
                    className="voucher-btn-5"
                    onClick={() => {
                      addPax(paxName);
                    }}
                  >
                    + Add other pax
                  </Button>
                </div>
              </div>

              <div className="d-flex text-dark gap-2 fs-5 align-items-center">
                <span className="">Other Pax Details : </span>
                <ul className="d-flex gap-3 fs-5 flex-wrap w-50">
                  {clientVoucherValue?.PaxName?.length > 0 &&
                    clientVoucherValue?.PaxName?.map((p, index) => (
                      <li key={index}>
                        {p}
                        <IoClose
                          className="text-primary"
                          onClick={() => removePax(index)}
                          style={{ cursor: "pointer" }}
                        />
                      </li>
                    ))}
                </ul>
              </div> */}
              </div>

              {/* info. on 2nd end */}
              <div className="">
                <div className="d-flex text-dark gap-2 fs-5 align-items-center">
                  <span className="">Tour ID : </span>
                  <span className="">{props.tourid}</span>
                </div>

                <div className="d-flex text-dark gap-2 fs-5 align-items-center ">
                  <span className="">Voucher No : </span>
                  <span>
                    {clientVoucherValue?.VoucherNo
                      ? clientVoucherValue?.VoucherNo
                      : voucherNo?.voucher_number}
                  </span>
                </div>

                {/* <div className="d-flex text-dark gap-2 fs-5 align-items-center">
                <span className="">Voucher Date : </span>
                <span className="">
                  {new Date(Date.now()).toLocaleDateString()}
                </span>
                {/* <span className="fs-6">{voucherDate.toLocaleDateString()}</span>
                <div className="position-relative">
                  <FaCalendarAlt
                    style={{ cursor: 'pointer', fontSize: '15px', marginLeft: '6px' }}
                    onClick={() => document.getElementById('voucher-datepicker').focus()}
                  />
                  <DatePicker
                    id="voucher-datepicker"
                    selected={voucherDate}
                    onChange={(date) => setVoucherDate(date)}
                    className="form-control"
                    dateFormat="dd/MM/yyyy"
                    popperPlacement="bottom-start"
                    style={{ display: 'none' }}
                  />
                </div> */}
                {/*</div>

              <div className="d-flex text-dark gap-2 fs-5 align-items-center">
                <span className="">Total Pax : </span>
                <span>{props.totalpax}</span>
              </div>

              <div className="d-flex text-dark gap-2 fs-5 align-items-center">
                <span className="">Confirmation No : </span>
                <span>{props.confirmationno}</span>
              </div>*/}
              </div>
            </div>
            <div className="mt-3">
              <div className="d-flex text-dark gap-2 fs-4 align-items-center ">
                <span className="">Arrival/Departure Details : </span>

                <div className="d-flex align-items-center gap-3 ms-2 options">
                  <span className="d-flex align-items-center gap-2">
                    <input
                      type="radio"
                      name="print-option"
                      id="option-1"
                      value="opt-1"
                      onChange={() => setPrintArrival(true)}
                    />
                    <span>Will Print</span>
                  </span>
                  <span className="d-flex align-items-center gap-2">
                    <input
                      type="radio"
                      name="print-option"
                      id="option-2"
                      value="opt-2"
                      onChange={() => setPrintArrival(false)}
                    />
                    <span>Will Not Print</span>
                  </span>
                </div>
              </div>

              <div
                className={`${
                  printArrival ? "visible" : "visually-hidden"
                }  w-100 mt-2 table-bordered itinerary-table voucherTable`}
              >
                <table className=" text-center align-middle w-100">
                  <tbody>
                    <tr>
                      <th className="text-start  ps-2">Arrival On</th>
                      <th className="text-start  ps-2">From</th>
                      <th className="text-start  ps-2">By</th>
                      <th className="text-start  ps-2">At</th>
                    </tr>
                    <tr>
                      <td>
                        <DatePicker
                          selected={
                            clientVoucherValue.ArrivalOn
                              ? new Date(clientVoucherValue.ArrivalOn)
                              : props.arrivaldate
                              ? new Date(props.arrivaldate)
                              : new Date()
                          }
                          onChange={(date) =>
                            handleDateChange("ArrivalOn", date)
                          }
                          dateFormat="dd/MM/yyyy"
                          placeholderText="dd/mm/yyyy"
                          className="px-1 form-control form-control-sm bg-white text-dark"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="px-1 form-control form-control-sm bg-white text-dark"
                          placeholder="City"
                          value={
                            clientVoucherValue.Fromdestination ||
                            props.arrivalDestination ||
                            Date.now()
                          }
                          name="Fromdestination"
                          onChange={handleChange}
                        />
                      </td>
                      <td>
                        <select
                          type="text"
                          placeholder="Transport"
                          className="px-1 form-control form-control-sm bg-white text-dark"
                          value={clientVoucherValue.ArrivalBy}
                          name="ArrivalBy"
                          onChange={handleChange}
                        >
                          <option value="">Select</option>
                          <option value="Flight">Flight</option>
                          <option value="Train">Train</option>
                          <option value="Surface">Surface</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="text"
                          className="px-1 form-control form-control-sm bg-white text-dark"
                          placeholder="Place"
                          value={clientVoucherValue.ArrivalAt}
                          name="ArrivalAt"
                          onChange={handleChange}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table className=" text-center align-middle w-100">
                  <tbody>
                    <tr>
                      <th className="text-start  ps-2">Departure On</th>
                      <th className="text-start  ps-2">To</th>
                      <th className="text-start  ps-2">By</th>
                      <th className="text-start  ps-2">At</th>
                    </tr>
                    <tr>
                      <td>
                        {/* <input
                        type="date"
                        className="px-1 form-control form-control-sm bg-white text-dark"
                        value={
                          clientVoucherValue.DepartureOn || props.departuredate
                        }
                        name="DepartureOn"
                        onChange={handleChange}
                      />*/}
                        <DatePicker
                          selected={
                            clientVoucherValue.DepartureOn
                              ? new Date(clientVoucherValue.DepartureOn)
                              : props.departuredate
                              ? new Date(props.departuredate)
                              : new Date()
                          }
                          onChange={(date) =>
                            handleDateChange("DepartureOn", date)
                          }
                          dateFormat="dd/MM/yyyy"
                          placeholderText="dd/mm/yyyy"
                          className="px-1 form-control form-control-sm bg-white text-dark"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="px-1 form-control form-control-sm bg-white text-dark"
                          placeholder="City"
                          value={
                            clientVoucherValue.ToDestination ||
                            props.departureDestination
                          }
                          name="ToDestination"
                          onChange={handleChange}
                        />
                      </td>
                      <td>
                        <select
                          type="text"
                          placeholder="Transport"
                          className="px-1 form-control form-control-sm bg-white text-dark"
                          value={clientVoucherValue.DepartureBy}
                          name="DepartureBy"
                          onChange={handleChange}
                        >
                          <option value="">Select</option>
                          <option value="Flight">Flight</option>
                          <option value="Train">Train</option>
                          <option value="Surface">Surface</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="text"
                          className="px-1 form-control form-control-sm bg-white text-dark"
                          placeholder="Place"
                          value={clientVoucherValue.DepartureAt}
                          name="DepartureAt"
                          onChange={handleChange}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {/* 1st div ends here */}

            {/* 2nd div */}
            <div className="mt-3">
              <div className="">
                <span className=" fs-5">Service Request</span>
                <input
                  type="text"
                  value={clientVoucherValue?.ServiceRequest}
                  palceholder="Please provide the services as per the following."
                  className="w-100 p-1 note fs-6"
                />
                {/* <Button
                className="voucher-btn-5"
                onClick={() => setIsEditable(!iseditable)}
              >
                {iseditable ? "Cancel Editable" : "Make Editable"}
              </Button> */}
              </div>

              {/* <div className={`mt-4`}>
              <JoditEditor
                value={content}
                onChange={(newContent) => setContent(newContent)}
              />
            </div>
            <div className={`${iseditable ? "visually-hidden" : "visible"}`}>
              {HtmlReactParser(content)}
            </div> */}
            </div>
            {/* 2nd div ends here */}
            {props?.servicetype == "Hotel" ? (
              <div class="mt-3">
                <span className=" fs-5">Rooms Information</span>
                <table class="table table-bordered itinerary-table voucherTable ">
                  <thead>
                    <tr>
                      <th>Single</th>
                      <th>Twin</th>
                      <th>Double</th>
                      <th>Triple</th>
                      <th>Nights</th>
                      <th>Meal Plan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <input
                          type="text"
                          name="Single"
                          class="form-control form-control-sm bg-white text-dark"
                          value={roomData?.Single}
                          onChange={handleRoomChange}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="Twin"
                          value={roomData?.Twin}
                          class="form-control form-control-sm bg-white text-dark"
                          onChange={handleRoomChange}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="Double"
                          class="form-control form-control-sm bg-white text-dark"
                          value={roomData?.Double}
                          onChange={handleRoomChange}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="Triple"
                          class="form-control form-control-sm bg-white text-dark"
                          value={roomData?.Triple}
                          onChange={handleRoomChange}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="Nights"
                          class="form-control form-control-sm bg-white text-dark"
                          value={
                            clientVoucherValue?.TotalNights ||
                            props?.totalnights
                          }
                          readOnly
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="MealPlan"
                          class="form-control form-control-sm bg-white text-dark"
                          value={
                            props?.allData?.ServiceDetails?.[0]?.MealPlanName
                          }
                          readOnly
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className=""></div>
            )}

            {/* 3rd div */}
            <div className="mt-1">
              <span className="fs-5">Schedule</span>
              <table className="table table-bordered itinerary-table voucherTable">
                <thead>
                  <tr>
                    <th className="col-4">Date</th>
                    <th className="col-8">Details</th>

                    {/* <th>css</th> */}
                  </tr>
                </thead>
                <tbody>
                  {console.log(clientVoucherValue?.Schedule, "arrivaldate7563")}

                  {clientVoucherValue?.Schedule?.map((detail, index) => {
                    return (
                      <tr key={index + 1}>
                        <td>
                          <DatePicker
                            selected={
                              detail?.Date ? parseISO(detail.Date) : null
                            }
                            onChange={(date) =>
                              handleArrivalDateChange(date, index)
                            }
                            dateFormat="dd-MM-yyyy"
                            className="px-1 form-control form-control-sm bg-white text-dark"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control form-control-sm bg-white text-dark"
                            name="Details"
                            onChange={(e) => handleArrivalformForm(e, index)}
                            value={detail?.Details}
                          />
                        </td>

                        <td>
                          <div className="d-flex w-100 justify-content-center gap-2 ">
                            <span onClick={() => handleArrivalIncrement(index)}>
                              <i className="la la-plus border cursor-pointer bg-success text-white rounded-pill fontSize10px padding1px"></i>
                            </span>
                            <span onClick={() => handleArrivalDecrement(index)}>
                              <i className="la la-minus  border cursor-pointer bg-primary text-white rounded-pill fontSize10px padding1px"></i>
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* div 3 ends here */}

            {/* div 4 */}

            {/* div 4 ends here */}

            {/* div 5 */}
            <div className="mt-2">
              <div className="d-flex text-dark gap-2 fs-5 align-items-center fs-4">
                <span className=" bill fs-5">Billing Instructions :</span>

                <div className="d-flex align-items-center gap-3 ms-2 options">
                  <span className="d-flex align-items-center gap-2">
                    <input
                      type="radio"
                      name="Billing-instruction"
                      id="option-1"
                      value="opt-1"
                      onChange={() => setBilling(true)}
                    />
                    <span>Will Print</span>
                  </span>
                  <span className="d-flex align-items-center gap-2">
                    <input
                      type="radio"
                      name="Billing-instruction"
                      id="option-2"
                      value="opt-2"
                      onChange={() => setBilling(false)}
                    />
                    <span>Will Not Print</span>
                  </span>
                </div>
              </div>
              <textarea
                style={{ fontSize: "12px" }}
                className={`${
                  billing ? "visible" : "visually-hidden"
                } w-100 p-1 mt-1 note`}
                value={clientVoucherValue.BillingInstructions}
                name="BillingInstructions"
                onChange={handleChange}
              ></textarea>
            </div>

            {props?.servicetype == "Hotel" && (
              <div className="mt-1 row">
                <div className="col-6 fs-4">
                  <span className=" bill fs-5">Agent</span>
                  {/*<Select
                options={options}
                styles={customStylesForhotel(background)}
                className={`customSelectLightTheame formControl1 ${
                            isFocus == index + "c" && "focus-red"
                                                  }`}
                classNamePrefix="custom"
                placeholder="Select"
                isSearchable={true}
              />*/}
                  <select className="form-control form-control-sm">
                    <option>AG Miller</option>
                    <option>AG Miller</option>
                    <option>AG Miller</option>
                    <option>AG Miller</option>
                    <option>AG Miller</option>
                  </select>
                </div>
                <div className="col-6 fs-4">
                  <span className=" bill fs-5">Local Agent :</span>
                  <input
                    type="text"
                    placeholder="Local Agent"
                    className="form-control form-control-sm"
                  />
                </div>
              </div>
            )}

            <div className="mt-2">
              <div className="w-100 mt-1">
                <span className=" bill fs-5 text-bold">Remark</span>

                <textarea
                  style={{ fontSize: "10px" }}
                  className="w-100 p-1 note"
                  value={clientVoucherValue?.Note}
                  name="Note"
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
            {/* div 5 ends here */}

            <div className="d-flex justify-content-center mt-2">
              <span className="fs-5 fs-5  ">
                This is a system generated document and does not need any stamp
                or signature.
              </span>
            </div>

            <div className="sign-block">
              <div className="d-flex flex-column align-items-end mt-4">
                <span className="fs-5 ">Authorised Signatory</span>
                {/*<img src={sign} alt="sign" className="sign" />*/}
                <span className="fs-5" onClick={() => handleFieldClick()}>
                  {editMode ? (
                    <input
                      type="text"
                      name="userSign"
                      className=""
                      value={userSign}
                      onChange={(e) => setUserSign(e.target.value)}
                      onBlur={handleFieldBlur}
                      autoFocus
                    />
                  ) : (
                    userSign
                  )}
                </span>
              </div>
            </div>
          </div>
          {/* inner box ends here */}

          <div className="w-100 d-flex mt-4">
            <div className="d-flex gap-5 w-50">
              <button className="voucher-btn-5" onClick={handleSubmit}>
                Save
              </button>
              <button className="voucher-btn-5" onClick={handleShare}>
                Mail
              </button>
              <button className="voucher-btn-5" onClick={onDownloadPDF}>
                Download
              </button>
            </div>
            <div className=" d-flex gap-5 justify-content-end">
              {props.Type === "Client" && (
                <button className="voucher-btn-5" onClick={printOnStationery}>
                  Print on Stationary
                </button>
              )}
              <button className="voucher-btn-5" onClick={onPrint}>
                Print
              </button>
              <button className="voucher-btn-5" onClick={downloadDOCX}>
                Word Doc
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(Voucher);
