import React, { useEffect, useState } from "react";
import "./voucher.css";
import { axiosOther } from "../../../../http/axios_base_url";
import { useSelector } from "react-redux";
import Voucher from "./Voucher";
import { clientVoucherInitialValue } from "../../query-dashboard/quotation-second/qoutation_initial_value";

function ClientVoucher({ selectedService }) {
  const [clientVoucher, setClientVoucher] = useState(null);
  const [loading, setLoading] = useState(false);

  const { queryData } = useSelector((state) => state?.queryReducer);
  const queryQuotation = JSON.parse(localStorage.getItem("Query_Qoutation"));
  const companyId = JSON.parse(localStorage.getItem("token"));

  console.log(selectedService, "selectedServicedsjfksd");

  useEffect(() => {
    const fetchData = async () => {
      // Check minimum required fields
      if (
        !queryData?.QueryId ||
        !queryQuotation?.QoutationNum ||
        !selectedService?.SupplierId
      ) {
        console.log("Minimum validation failed:", {
          queryId: queryData?.QueryId,
          quotationNum: queryQuotation?.QoutationNum,
          supplierId: selectedService?.SupplierId,
        });
        setLoading(false);
        return;
      }

      // Log the selected service data for debugging
      console.log("Selected Service Data:", {
        ServiceId: selectedService?.ServiceId,
        ServiceName: selectedService?.ServiceName,
        ServiceUniqueId: selectedService?.ServiceUniqueId,
        SupplierId: selectedService?.SupplierId,
        UniqueId: selectedService?.UniqueId,
      });

      setLoading(true);

      try {
        // Build voucher payload
        const voucherPayload = {
          QueryId: queryQuotation?.QueryID || queryData?.QueryId,
          QuotationNumber: queryQuotation?.QoutationNum,
          Type: "Client",
          SupplierId: selectedService.SupplierId.toString(),
          ServiceId: selectedService.ServiceId
            ? selectedService.ServiceId.toString()
            : undefined,
          ServiceUniqueId: selectedService.ServiceUniqueId,
          UniqueId: selectedService?.UniqueId,
          ServiceType: selectedService.ServiceName || "LocalAgent",
        };

        // Add optional fields only for non-LocalAgent services
        if (
          selectedService.ServiceName &&
          selectedService.ServiceName !== "LocalAgent"
        ) {
          if (selectedService.ServiceUniqueId) {
            voucherPayload.ServiceUniqueId = selectedService.ServiceUniqueId;
          }

          if (companyId?.companyKey) {
            voucherPayload.CompanyId = companyId.companyKey.toString();
          }

          // Add HotelId only if it's a Hotel service with ServiceId
          // if (
          //   selectedService.ServiceName === "Hotel" &&
          //   selectedService.ServiceId
          // ) {
          //   voucherPayload.HotelId = selectedService.ServiceId.toString();
          // }
        }

        // console.log("Final voucher payload:", voucherPayload);
        // console.log(voucherPayload, "voucherPayload");
        // console.log("Sending voucher request with payload:", voucherPayload);
        const response = await axiosOther.post(
          "listfinalvoucher",
          voucherPayload
        );
        console.log("API Response:", response);

        const { data: voucherData } = response;
        // Handle both array and single object responses
        const voucherDataToSet = voucherData?.Data;

        if (voucherDataToSet) {
          console.log("Setting voucher data:", voucherDataToSet);
          setClientVoucher(voucherDataToSet);
        } else {
          console.log("No voucher data found in response:", voucherData);
          setClientVoucher(null);
        }
        console.log("Complete response data:", voucherData);
      } catch (error) {
        console.error("Error fetching client voucher data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      setClientVoucher(null);
    };
  }, [queryData, selectedService]);

  // Debug logs to check data
  console.log("ClientVoucher:", clientVoucher);

  if (loading) {
    return (
      <div className="bg-white d-flex justify-content-center align-items-center">
        Loading...
      </div>
    );
  }

  if (!clientVoucher) {
    return (
      <div className="bg-white d-flex justify-content-center align-items-center">
        No voucher found for the selected service
      </div>
    );
  }

  // Convert to array if it's a single object
  const voucherArray = Array.isArray(clientVoucher)
    ? clientVoucher
    : [clientVoucher];

  return (
    <div>
      {(Array.isArray(clientVoucher) ? clientVoucher : [clientVoucher]).map(
        (voucher, index) =>
          index === 0 && (
            <div key={index}>
              <Voucher
                InitialValue={clientVoucher || clientVoucherInitialValue}
                Type={clientVoucherInitialValue.Type}
                supplieraddress={voucher.SupplierAddress}
                companyid={voucher?.CompanyId}
                companylogo={voucher?.ClientLogo}
                companyname={voucher?.CompanyName}
                arrivaldate={voucher?.ArrivalDate}
                departuredate={voucher?.DepartureDate}
                arrivalDestination={voucher?.ArrivalDestination}
                departureDestination={voucher?.DepartureDestination}
                confirmationno={voucher.ConfirmationNo}
                contactpersonname={voucher.ContactPersonName}
                destinantionname={voucher.ServiceDetails?.[0]?.DestinationName}
                destinationid={voucher.ServiceDetails?.[0]?.DestinationId}
                email={voucher.ContactEmail}
                phone={voucher.ContactPhone}
                queryid={voucher?.QuotationNumber?.split("-")[0]}
                quotationnumber={voucher?.QuotationNumber}
                serviceid={selectedService?.ServiceId}
                serviceUniqueId={voucher.ServiceUniqueId}
                servicename={voucher.ServicesName}
                servicetype={voucher.ServiceType}
                supplierid={selectedService.SupplierId.toString()}
                suppliername={voucher.SupplierName}
                clientName={voucher?.ClientName}
                totalpax={voucher?.TotalPax}
                tourid={voucher?.TourId}
                totalnights={voucher.ServiceDetails?.[0]?.TotalNights}
                uniqueid={voucher.UniqueId}
                website={voucher?.ClientWebsite}
                mealPlan={voucher.ServiceDetails?.[0]?.MealPlanName}
                roomtype={voucher.ServiceDetails?.[0]?.RoomTypeName}
                ClientAddress={voucher?.ClientAddress}
                ClientMobile={voucher?.ClientMobile}
                ClientEmail={voucher?.ClientEmail}
                date={voucher.ServiceDetails?.[0]?.Date}
                voucherNo={selectedService?.VoucherNo}
                id={selectedService?.id}
              />
            </div>
          )
      )}
    </div>
  );
}

export default ClientVoucher;

// Voucher Component for Client and Supplier

// import React, { useEffect, useRef, useState, memo, useContext } from "react";
// import Select from "react-select";
// import { parseISO } from "date-fns";
// import { IoClose } from "react-icons/io5";
// import JoditEditor from "jodit-react";
// import HtmlReactParser from "html-react-parser";
// import DatePicker from "react-datepicker";
// import { Button } from "react-bootstrap";
// import html2pdf from "html2pdf.js";
// import { ToastContainer } from "react-toastify";
// import "react-datepicker/dist/react-datepicker.css";

// import bg from "../../../../images/voucher/bg.png";
// import sign from "../../../../images/voucher/sign.png";
// import { axiosOther } from "../../../../http/axios_base_url";
// import { notifySuccess, notifyError } from "../../../../helper/notify";
// import { clientVoucherInitialValue } from "../../query-dashboard/quotation-second/qoutation_initial_value";
// import {
//   customStylesForAutoVoucher,
//   customStylesForhotel,
// } from "../../supplierCommunication/SupplierConfirmation/customStyle";
// import "./voucher.css";
// import { ThemeContext } from "../../../../context/ThemeContext";

// // Initial Data
// const ArrivalDetailsObj = { Date: "", Details: "" };
// const initialArrivalDetails = [{ Date: "Arrival", Details: "" }];

// function Voucher(props) {
//   const date = props?.InitialValue?.Schedule;
//   const [voucherFormData, setVoucherFormData] = useState({
//     Agent: props?.InitialValue?.AgentId || "",
//     PaxName: props?.InitialValue?.PaxName || [],
//     Schedule: props?.InitialValue?.Schedule || initialArrivalDetails,
//     VoucherNo: props?.voucherNo || "",
//     TourId: props?.InitialValue?.FileNo || "",
//     QueryId: props?.queryid || "",
//     QuotationNo: props?.quotationnumber || "",
//     ReservationUniqueId: props?.uniqueid || "",
//     CompanyId: String(props?.companyid) || "",
//     CompanyName: props?.companyname || "",
//     Website: props?.website || "",
//     CompanyLogo: props?.companylogo || "",
//     ServiceId: String(props?.serviceid) || "",
//     ServiceName: props?.servicename || props?.InitialValue?.Supplier || "",
//     ServiceType: props?.servicetype || "",
//     Address: props?.supplieraddress || "",
//     ContactPersonaName: props?.contactpersonname || "",
//     Email: props?.ClientEmail || props?.Email || "",
//     Phone: props?.ClientMobile || props?.Phone || "",
//     ConfirmationNo: props?.confirmationno || "",
//     SupplierId: String(props?.supplierid) || "",
//     Suppliername: props?.suppliername || "",
//     DestinationId: String(props?.destinationid) || "",
//     DestinationName: props?.InitialValue?.Destination || "",
//     Nights: String(props?.InitialValue?.TotalNights) || "",
//     ArrivalOn: date?.[0]?.Date || props?.InitialValue?.ArrivalDate || "",
//     DepartureOn:
//       date?.[date?.length - 1]?.Date ||
//       props?.InitialValue?.DepartureDate ||
//       "",
//     Fromdestination: props?.InitialValue?.ArrivalCity || "",
//     ToDestination: props?.InitialValue?.DepartureCity || "",
//     ArrivalBy: props?.InitialValue?.ArrivalBy || "Flight",
//     ArrivalAt: props?.InitialValue?.ArrivalAt || "",
//     DepartureBy: props?.InitialValue?.DepartureBy || "Surface",
//     DepartureAt: props?.InitialValue?.DepartureAt || "",
//     Note: props?.note || "Remarks",
//     BillingInstructions: props?.billinginstructions || "1",
//     AuthorisedName: props?.authorisedname || "",
//     CheckIn: props?.CheckIn || "",
//     CheckOut: props?.CheckOut || "",
//     RoomType: [props?.InitialValue?.RoomType] || [],
//     MealPlan: [props?.InitialValue?.MealPlan] || [],
//     ServiceRequest:
//       props?.InitialValue?.ServiceRequest ||
//       "Please provide the services as per the following.",
//     SingleRoom: props?.InitialValue?.SingleRoom || "0",
//     TwinRoom: props?.InitialValue?.TwinRoom || "0",
//     DoubleRoom: props?.InitialValue?.DoubleRoom || "0",
//     TripleRoom: props?.InitialValue?.TripleRoom || "0",
//   });

//   const [paxName, setPaxName] = useState("");
//   const [arrivalDetails, setArrivalDetails] = useState(initialArrivalDetails);
//   const [isEditable, setIsEditable] = useState(true);
//   const [printArrival, setPrintArrival] = useState(true);
//   const [billing, setBilling] = useState(true);
//   const [editMode, setEditMode] = useState(false);
//   const [userSign, setUserSign] = useState(
//     props.authorisedname || "Mohd Rizwan"
//   );
//   const [voucherNo, setVoucherNo] = useState(null);
//   const [content, setContent] = useState("");
//   const [agentList, setAgentList] = useState([]);
//   const [voucherHTML, setVoucherHTML] = useState("");
//   const printRef = useRef(null);
//   const iframePreviewRef = useRef(null);
//   const [billingDataList, setBillingDataList] = useState([]);
//   const [checkSmoking, setCheckSmoking] = useState(false);
//   const [printData, setPrintData] = useState();

//   // Computed Values
//   const serviceDetails = props?.allData?.ServiceDetails?.[0] || {};
//   const roomBedTypes = serviceDetails?.RoomBedType || [];
//   const queryData = JSON.parse(localStorage.getItem("Query_Qoutation"));

//   // console.log(props?.voucherNo, "PROPDLK450");
//   // console.log(props.Type, "sfjsdkjf5484");
//   // console.log(voucherFormData, "SFsjdfksdk659");
//   // console.log(checkSmoking, "sfskfl549+624");

//   useEffect(() => {
//     const fetchClientVoucher = async () => {
//       const clientPayload = {
//         QueryId: queryData?.QueryID || voucherFormData.QueryId,
//         QuotationNumber: voucherFormData.QuotationNo || queryData?.QoutationNum,
//         TourCode: voucherFormData.TourId,
//         ServiceId: voucherFormData.ServiceId,
//         SupplierId: props?.supplierid,
//         Type: props.Type,
//         // CompanyId: voucherFormData.CompanyId,
//         // HotelId: voucherFormData.ServiceId,
//         // ProductType: voucherFormData.ServiceType,
//       };

//       try {
//         const { data } = await axiosOther.post(
//           "fetchStoredData",
//           clientPayload
//         );
//         console.log("Fetched voucher data:", data);

//         if (data.Status === 1 && data?.Data) {
//           if (Array.isArray(data.Data) && data.Data.length > 0) {
//             setVoucherFormData(data.Data[0]);
//             setVoucherNo(data.Data[0].VoucherNo);
//             return;
//           } else if (data.Data.VoucherNo) {
//             setVoucherFormData(data.Data);
//             setVoucherNo(data.Data.VoucherNo);
//             return;
//           }
//         }

//         // Only if we don't have existing data, fetch new voucher number
//         if (!voucherFormData.VoucherNo) {
//           const response = await axiosOther.get("generate-voucherno");
//           setVoucherNo(response.data);
//           setVoucherFormData((prev) => ({
//             ...prev,
//             VoucherNo: response.data?.voucher_number?.toString() || "",
//           }));
//         }
//       } catch (error) {
//         console.error("Error fetching client voucher data:", error);
//         // If error in fetching existing data, try to get new voucher number
//         if (!voucherFormData.VoucherNo) {
//           try {
//             const response = await axiosOther.get("generate-voucherno");
//             setVoucherNo(response.data);
//             setVoucherFormData((prev) => ({
//               ...prev,
//               VoucherNo: response.data?.voucher_number?.toString() || "",
//             }));
//           } catch (err) {
//             console.error("Error generating voucher number:", err);
//           }
//         }
//       }
//     };

//     fetchClientVoucher();
//   }, [props.Type]);

//   useEffect(() => {
//     const getBillingData = async () => {
//       try {
//         const { data } = await axiosOther.post("list-billing-instruction", {
//           Name: "Test Billing Instruction",
//         });
//         console.log(data, "kslflksdflks");
//         const billingData = data?.data?.map((bill) => {
//           return {
//             id: bill.id,
//             label: bill?.Description,
//           };
//         });
//         console.log(billingData, "sdkfslkd66");
//         setBillingDataList(billingData);
//       } catch (error) {
//         console.error("Error in billing data", error);
//       }
//     };
//     getBillingData();
//   }, []);

//   useEffect(() => {
//     const gettingDataForDropdown = async () => {
//       try {
//         const { data } = await axiosOther.post("agentlist", {});
//         console.log(data, "sdflsd874");
//         const agentDataList =
//           data?.DataList?.map((agent) => ({
//             id: agent?.id,
//             agentName: agent?.CompanyName,
//           })) || [];
//         setAgentList(agentDataList);
//       } catch (error) {
//         console.error("Error fetching agent list:", error);
//       }
//     };
//     gettingDataForDropdown();
//   }, []);

//   useEffect(() => {
//     setContent(
//       props.servicetype === "Hotel"
//         ? `<table class="editable-table fs-6 mt-2 text-dark" border="1">
//             <tr>
//               <td class="editable-td">Check In : ${
//                 voucherFormData.CheckIn ||
//                 props?.allData?.ConfirmationDate ||
//                 " "
//               }</td>
//               <td class="editable-td">Check Out : ${
//                 voucherFormData.CheckOut || props?.allData?.CutOfDate || " "
//               }</td>
//               <td class="editable-td">Nights : ${voucherFormData.Nights}</td>
//             </tr>
//             <tr>
//               <td class="editable-td" colspan="2">Room Type : ${
//                 voucherFormData?.RoomType?.[0] || ""
//               }</td>
//               <td colspan="1" class="editable-td">Meal Plan : ${
//                 voucherFormData.MealPlan?.[0] || ""
//               }</td>
//             </tr>
//           </table>`
//         : `<table class="editable-table fs-6 mt-2 text-dark" border="1">
//             <tr>
//               <td class="editable-td">${
//                 voucherFormData.ArrivalOn || props.arrivaldate
//               } : ${voucherFormData.DestinationName} - ${
//             voucherFormData.ServiceName
//           }</td>
//             </tr>
//           </table>`
//     );
//   }, [voucherFormData, props]);

//   // Handlers
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setVoucherFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleRoomChange = (e) => {
//     const { name, value } = e.target;
//     setVoucherFormData((prev) => ({
//       ...prev,
//       [`${name}Room`]: value,
//     }));
//   };

//   const handleDateChange = (name, date) => {
//     if (!date) return;
//     setVoucherFormData((prev) => ({
//       ...prev,
//       [name]: date.toISOString(),
//     }));
//   };

//   const handleArrivalIncrement = () => {
//     setArrivalDetails((prev) => [...prev, ArrivalDetailsObj]);
//     setVoucherFormData((prev) => ({
//       ...prev,
//       Schedule: [...prev.Schedule, ArrivalDetailsObj],
//     }));
//   };

//   const handleArrivalDecrement = (index) => {
//     // Don't remove if it's the last row
//     if (voucherFormData.Schedule.length <= 1) return;

//     setArrivalDetails((prev) => prev.filter((_, i) => i !== index));
//     setVoucherFormData((prev) => ({
//       ...prev,
//       Schedule: prev.Schedule.filter((_, i) => i !== index),
//     }));
//   };

//   const handleArrivalFormChange = (e, index) => {
//     const { name, value } = e.target;
//     setArrivalDetails((prev) => {
//       const newArr = [...prev];
//       newArr[index] = { ...newArr[index], [name]: value };
//       return newArr;
//     });
//     setVoucherFormData((prev) => {
//       const newSchedule = [...prev.Schedule];
//       newSchedule[index] = { ...newSchedule[index], [name]: value };
//       return { ...prev, Schedule: newSchedule };
//     });
//   };

//   const handleArrivalDateChange = (date, index) => {
//     const isoDate = date ? date.toISOString().split("T")[0] : "";
//     setArrivalDetails((prev) => {
//       const newArr = [...prev];
//       newArr[index] = { ...newArr[index], Date: isoDate };
//       return newArr;
//     });
//     setVoucherFormData((prev) => {
//       const newSchedule = [...prev.Schedule];
//       newSchedule[index] = { ...newSchedule[index], Date: isoDate };
//       return { ...prev, Schedule: newSchedule };
//     });
//   };

//   const addPax = (name) => {
//     if (!name.trim()) {
//       alert("Pax name cannot be empty");
//       return;
//     }
//     setVoucherFormData((prev) => ({
//       ...prev,
//       PaxName: [...prev.PaxName, name],
//     }));
//     setPaxName("");
//   };

//   const removePax = (index) => {
//     setVoucherFormData((prev) => ({
//       ...prev,
//       PaxName: prev.PaxName.filter((_, i) => i !== index),
//     }));
//   };

//   const handlePrint = (data) => {
//     if (!data) {
//       notifyError("Please save the voucher!");
//       return;
//     }
//     const htmlData = data || voucherHTML;
//     const iframe = iframePreviewRef.current;

//     if (iframe && htmlData) {
//       const doc = iframe.contentWindow.document;
//       doc.open();
//       doc.write(htmlData);
//       doc.close();

//       iframe.onload = () => {
//         setTimeout(() => {
//           iframe.contentWindow.focus();
//           iframe.contentWindow.print();
//         }, 300);
//       };
//     } else {
//       console.error("No iframe or HTML data available for printing");
//     }
//   };

//   const handleSubmit = async () => {
//     if (!voucherFormData.VoucherNo && !voucherNo?.voucher_number) {
//       notifyError("No valid voucher number available");
//       return;
//     }

//     const payload = {
//       id: props.id || "",
//       Type: props.Type,
//       ProductType: voucherFormData.ServiceType,
//       VoucherNo:
//         voucherFormData.VoucherNo || voucherNo?.voucher_number?.toString(),
//       TourCode: voucherFormData.TourId,
//       QueryId: voucherFormData.QueryId || queryData?.QueryID || "",
//       QuotationNo: voucherFormData.QuotationNo || queryData?.QoutationNum || "",
//       VoucherDataJson: {
//         ReservationUniqueId: voucherFormData.ReservationUniqueId,
//         CompanyId: voucherFormData.CompanyId,
//         CompanyName: voucherFormData.CompanyName,
//         Website: voucherFormData.Website,
//         CompanyLogo: voucherFormData.CompanyLogo,
//         ServiceId: voucherFormData.ServiceId,
//         ServiceName: voucherFormData.ServiceName,
//         ServiceType: voucherFormData.ServiceType,
//         Address: voucherFormData.Address,
//         ContactPersonaName: voucherFormData.ContactPersonaName,
//         Email: voucherFormData.Email,
//         Phone: voucherFormData.Phone,
//         TourId: voucherFormData.TourId,
//         VoucherDate: new Date().toISOString().split("T")[0],
//         TotalPax: String(voucherFormData.PaxName) || "",
//         ConfirmationNo: voucherFormData.ConfirmationNo,
//         PaxName: voucherFormData.PaxName,
//         Date: new Date().toISOString().split("T")[0],
//         SupplierId: voucherFormData.SupplierId,
//         Suppliername: voucherFormData.Suppliername,
//         Destinationid: voucherFormData.DestinationId,
//         DestinationName: voucherFormData.DestinationName,
//         Nights: voucherFormData.Nights,
//         Schedule: voucherFormData.Schedule,
//         ArrivalOn: voucherFormData.ArrivalOn,
//         DepartureOn: voucherFormData.DepartureOn,
//         Fromdestination: voucherFormData.Fromdestination,
//         ToDestination: voucherFormData.ToDestination,
//         ArrivalBy: voucherFormData.ArrivalBy,
//         ArrivalAt: voucherFormData.ArrivalAt,
//         DepartureBy: voucherFormData.DepartureBy,
//         DepartureAt: voucherFormData.DepartureAt,
//         Note: voucherFormData.Note,
//         BillingInstructions: voucherFormData.BillingInstructions,
//         AuthorisedName: userSign || voucherFormData.AuthorisedName,
//         CheckIn: voucherFormData.CheckIn,
//         CheckOut: voucherFormData.CheckOut,
//         RoomType: voucherFormData.RoomType,
//         MealPlan: voucherFormData.MealPlan,
//         ServiceRequest: voucherFormData.ServiceRequest,
//         SingleRoom: voucherFormData.SingleRoom,
//         TwinRoom: voucherFormData.TwinRoom,
//         DoubleRoom: voucherFormData.DoubleRoom,
//         TripleRoom: voucherFormData.TripleRoom,
//         AgentId: voucherFormData.Agent ? voucherFormData.Agent.toString() : " ",
//         BillingId: voucherFormData.BillingInstructions,
//       },
//       CreatedBy: "1",
//       UpdatedBy: "1",
//     };

//     try {
//       const { data } = await axiosOther.post("addfinalvoucher", payload);
//       notifySuccess(data?.Message || "Voucher saved successfully");
//       // setVoucherFormData(data?.Data);
//       setVoucherHTML(data?.Data?.VoucherHtml || printRef.current.innerHTML);
//       if (printRef.current) {
//         printRef.current.innerHTML = data?.Data?.VoucherHtml || "";
//       }
//       setPrintData(data?.Data?.VoucherHtml);
//       // handlePrint(data?.Data?.VoucherHtml);
//     } catch (error) {
//       console.error("Error in handleSubmit:", error);
//       notifyError("An error occurred while saving the voucher");
//     }
//   };

//   const onDownloadPDF = async () => {
//     if (!printData) {
//       notifyError("Please save the voucher");
//       return;
//     }
//     try {
//       const { data } = await axiosOther.post("voucherpdffile", {
//         html: printData,
//       });

//       if (data?.status === 1 && data?.pdf_url) {
//         const link = document.createElement("a");
//         link.href = data.pdf_url;

//         const filename = data.pdf_url.split("/").pop() || "voucher.pdf";
//         link.setAttribute("download", filename);
//         link.setAttribute("target", "_blank");

//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//       } else {
//         console.error("PDF URL not found in response.");
//       }
//     } catch (error) {
//       console.log("Error in download PDF", error);
//     }
//   };

//   const handleShare = async () => {
//     if (navigator.share) {
//       try {
//         await navigator.share({
//           title: "Voucher",
//           text: "Here's your voucher details",
//           url: window.location.href,
//         });
//       } catch (error) {
//         console.error("Sharing failed:", error);
//       }
//     } else {
//       alert("Web Share API not supported in this browser.");
//     }
//   };

//   const downloadDOCX = async () => {
//     if (!printData) {
//       notifyError("Please save the voucher");
//       return;
//     }
//     try {
//       const res = await axiosOther.post("voucherwordfile", {
//         html: printData,
//       });

//       if (res.data?.status === 1 && res.data?.download_url) {
//         const link = document.createElement("a");
//         link.href = res.data.download_url;
//         link.setAttribute("download", "voucher.docx");
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//       } else {
//         console.error("Download URL not found in response.");
//       }
//     } catch (error) {
//       console.log("Error in download docx", error);
//     }
//   };

//   const originalServiceRequest = useRef(voucherFormData.ServiceRequest);

//   useEffect(() => {
//     const modifyServiceRequest = (checkSmoking) => {
//       if (checkSmoking) {
//         return originalServiceRequest.current;
//       } else {
//         const roomPattern = /(Please provide .*?Room(?:, .*?Room)*?)( from)/;
//         return originalServiceRequest.current.replace(
//           roomPattern,
//           "$1 (Non Smoking)$2"
//         );
//       }
//     };

//     const updatedRequest = modifyServiceRequest(checkSmoking);

//     if (voucherFormData.ServiceRequest !== updatedRequest) {
//       setVoucherFormData((prev) => ({
//         ...prev,
//         ServiceRequest: updatedRequest,
//       }));
//     }
//   }, [checkSmoking]);

//   return (
//     <>
//       <div className="voucher-innerbox d-flex flex-column gap-5">
//         <ToastContainer />
//         <div className="Voucher-outerbox">
//           <div className="voucher-inner-1box print">
//             <div className="d-flex justify-content-between mt-4">
//               <div>
//                 <div className="d-flex text-dark gap-2 fs-4 align-items-center">
//                   <span>Name:</span>
//                   <input
//                     type="text"
//                     className="form-control form-control-sm bg-white text-dark"
//                     style={{ width: "300px" }}
//                     name="ServiceName"
//                     value={voucherFormData.ServiceName}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 {voucherFormData.ServiceType === "Hotel" && (
//                   <div className="d-flex text-dark gap-2 fs-4 align-items-center mt-1">
//                     <span>Room Type:</span>
//                     <input
//                       type="text"
//                       placeholder="Room Type"
//                       className="form-control form-control-sm bg-white text-dark"
//                       style={{ width: "300px" }}
//                       name="RoomType"
//                       value={voucherFormData.RoomType?.[0] || ""}
//                       onChange={(e) =>
//                         setVoucherFormData((prev) => ({
//                           ...prev,
//                           RoomType: [e.target.value],
//                         }))
//                       }
//                     />
//                   </div>
//                 )}
//               </div>
//               <div>
//                 <div className="d-flex text-dark gap-2 fs-5 align-items-center">
//                   <span>Tour ID:</span>
//                   <span>{voucherFormData.TourId}</span>
//                 </div>
//                 <div className="d-flex text-dark gap-2 fs-5 align-items-center">
//                   <span>Voucher No:</span>
//                   <span>
//                     {voucherFormData.VoucherNo || voucherNo?.voucher_number}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-3">
//               <div className="d-flex text-dark gap-2 fs-4 align-items-center">
//                 <span>Arrival/Departure Details:</span>
//                 <div className="d-flex align-items-center gap-3 ms-2 options">
//                   <span className="d-flex align-items-center gap-2">
//                     <input
//                       type="radio"
//                       name="print-option"
//                       id="option-1"
//                       value="opt-1"
//                       checked={printArrival}
//                       onChange={() => setPrintArrival(true)}
//                     />
//                     <span>Will Print</span>
//                   </span>
//                   <span className="d-flex align-items-center gap-2">
//                     <input
//                       type="radio"
//                       name="print-option"
//                       id="option-2"
//                       value="opt-2"
//                       checked={!printArrival}
//                       onChange={() => setPrintArrival(false)}
//                     />
//                     <span>Will Not Print</span>
//                   </span>
//                 </div>
//               </div>
//               <div
//                 className={`${
//                   printArrival ? "visible" : "visually-hidden"
//                 } w-100 mt-2 table-bordered itinerary-table voucherTable`}
//               >
//                 <table className="text-center align-middle w-100">
//                   <tbody>
//                     <tr>
//                       <th className="text-start ps-2">Arrival</th>
//                       <th className="text-start ps-2">From</th>
//                       <th className="text-start ps-2">By</th>
//                       <th className="text-start ps-2">At</th>
//                     </tr>
//                     <tr>
//                       <td>
//                         <DatePicker
//                           selected={
//                             voucherFormData.ArrivalOn
//                               ? new Date(voucherFormData.ArrivalOn)
//                               : new Date()
//                           }
//                           onChange={(date) =>
//                             handleDateChange("ArrivalOn", date)
//                           }
//                           dateFormat="dd/MM/yyyy"
//                           placeholderText="dd/mm/yyyy"
//                           className="px-1 form-control form-control-sm bg-white text-dark"
//                         />
//                       </td>
//                       <td>
//                         <input
//                           type="text"
//                           className="px-1 form-control form-control-sm bg-white text-dark"
//                           placeholder="City"
//                           value={voucherFormData.Fromdestination || ""}
//                           name="Fromdestination"
//                           onChange={handleChange}
//                         />
//                       </td>
//                       <td>
//                         <select
//                           className="px-1 form-control form-control-sm bg-white text-dark"
//                           value={voucherFormData.ArrivalBy || ""}
//                           name="ArrivalBy"
//                           style={{ width: "195px" }}
//                           onChange={handleChange}
//                         >
//                           <option value="">Select</option>
//                           <option value="Flight">Flight</option>
//                           <option value="Train">Train</option>
//                           <option value="Surface">Surface</option>
//                         </select>
//                       </td>
//                       <td>
//                         <input
//                           type="text"
//                           placeholder="00:00"
//                           className="px-1 form-control form-control-sm bg-white text-dark"
//                           style={{ width: "180px" }}
//                           value={voucherFormData.ArrivalAt || ""}
//                           name="ArrivalAt"
//                           onChange={handleChange}
//                         />
//                       </td>
//                     </tr>
//                   </tbody>
//                 </table>
//                 <table className="text-center align-middle w-100">
//                   <tbody>
//                     <tr>
//                       <th className="text-start ps-2">Departure</th>
//                       <th className="text-start ps-2">To</th>
//                       <th className="text-start ps-2">By</th>
//                       <th className="text-start ps-2">At</th>
//                     </tr>
//                     <tr>
//                       <td>
//                         <DatePicker
//                           selected={
//                             voucherFormData.DepartureOn
//                               ? new Date(voucherFormData.DepartureOn)
//                               : new Date()
//                           }
//                           onChange={(date) =>
//                             handleDateChange("DepartureOn", date)
//                           }
//                           dateFormat="dd/MM/yyyy"
//                           placeholderText="dd/mm/yyyy"
//                           className="px-1 form-control form-control-sm bg-white text-dark"
//                         />
//                       </td>
//                       <td>
//                         <input
//                           type="text"
//                           className="px-1 form-control form-control-sm bg-white text-dark"
//                           placeholder="City"
//                           value={voucherFormData.ToDestination || ""}
//                           name="ToDestination"
//                           onChange={handleChange}
//                         />
//                       </td>
//                       <td>
//                         <select
//                           className="px-1 form-control form-control-sm bg-white text-dark"
//                           value={voucherFormData.DepartureBy || ""}
//                           name="DepartureBy"
//                           style={{ width: "195px" }}
//                           onChange={handleChange}
//                         >
//                           <option value="">Select</option>
//                           <option value="Flight">Flight</option>
//                           <option value="Train">Train</option>
//                           <option value="Surface">Surface</option>
//                         </select>
//                       </td>
//                       <td>
//                         <input
//                           type="text"
//                           className="px-1 form-control form-control-sm bg-white text-dark"
//                           placeholder="00:00"
//                           style={{ width: "180px" }}
//                           value={voucherFormData.DepartureAt || ""}
//                           name="DepartureAt"
//                           onChange={handleChange}
//                         />
//                       </td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {console.log(voucherFormData, "ksljflksdkf6596")}

//             <div className="mt-3">
//               <span className="fs-5">Service Request</span>
//               <input
//                 type="text"
//                 value={voucherFormData.ServiceRequest}
//                 placeholder="Please provide the services as per the following."
//                 className="w-100 px-1 form-control form-control-sm bg-white text-dark"
//                 style={{ fontSize: "11px" }}
//                 name="ServiceRequest"
//                 onChange={handleChange}
//               />
//             </div>

//             {voucherFormData.ServiceType === "Hotel" && (
//               <div className="mt-3">
//                 <span className="fs-5">Rooms Information</span>
//                 <table className="table table-bordered itinerary-table voucherTable">
//                   <thead>
//                     <tr>
//                       <th>Single</th>
//                       <th>Twin</th>
//                       <th>Double</th>
//                       <th>Triple</th>
//                       <th>Nights</th>
//                       <th>Meal Plan</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     <tr>
//                       <td>
//                         <input
//                           type="text"
//                           name="Single"
//                           className="form-control form-control-sm bg-white text-dark"
//                           value={voucherFormData.SingleRoom || ""}
//                           onChange={handleRoomChange}
//                         />
//                       </td>
//                       <td>
//                         <input
//                           type="text"
//                           name="Twin"
//                           className="form-control form-control-sm bg-white text-dark"
//                           value={voucherFormData.TwinRoom || ""}
//                           onChange={handleRoomChange}
//                         />
//                       </td>
//                       <td>
//                         <input
//                           type="text"
//                           name="Double"
//                           className="form-control form-control-sm bg-white text-dark"
//                           value={voucherFormData.DoubleRoom || ""}
//                           onChange={handleRoomChange}
//                         />
//                       </td>
//                       <td>
//                         <input
//                           type="text"
//                           name="Triple"
//                           className="form-control form-control-sm bg-white text-dark"
//                           value={voucherFormData.TripleRoom || ""}
//                           onChange={handleRoomChange}
//                         />
//                       </td>
//                       <td>
//                         <input
//                           type="text"
//                           name="Nights"
//                           className="form-control form-control-sm bg-white text-dark"
//                           value={voucherFormData.Nights}
//                           onChange={handleChange}
//                         />
//                       </td>
//                       <td>
//                         <input
//                           type="text"
//                           name="MealPlan"
//                           className="form-control form-control-sm bg-white text-dark"
//                           value={voucherFormData.MealPlan?.[0] || ""}
//                           onChange={(e) =>
//                             setVoucherFormData((prev) => ({
//                               ...prev,
//                               MealPlan: [e.target.value],
//                             }))
//                           }
//                         />
//                       </td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>
//             )}

//             <div className="mt-1">
//               <span className="fs-5">Schedule</span>
//               <table className="table table-bordered itinerary-table voucherTable">
//                 <thead>
//                   <tr>
//                     <th className="col-4">Date</th>
//                     <th className="col-8">Details</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {voucherFormData.Schedule?.map((detail, index) => (
//                     <tr key={index}>
//                       <td>
//                         <DatePicker
//                           selected={detail?.Date ? parseISO(detail.Date) : null}
//                           onChange={(date) =>
//                             handleArrivalDateChange(date, index)
//                           }
//                           dateFormat="dd-MM-yyyy"
//                           className="px-1 form-control form-control-sm bg-white text-dark"
//                         />
//                       </td>
//                       <td>
//                         <input
//                           type="text"
//                           className="form-control form-control-sm bg-white text-dark"
//                           name="Details"
//                           value={detail?.Details || ""}
//                           onChange={(e) => handleArrivalFormChange(e, index)}
//                         />
//                       </td>
//                       <td>
//                         <div className="d-flex w-100 justify-content-center gap-2">
//                           <span onClick={handleArrivalIncrement}>
//                             <i className="la la-plus border cursor-pointer bg-success text-white rounded-pill fontSize10px padding1px"></i>
//                           </span>
//                           <span onClick={() => handleArrivalDecrement(index)}>
//                             <i className="la la-minus border cursor-pointer bg-primary text-white rounded-pill fontSize10px padding1px"></i>
//                           </span>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             <div className="mt-2">
//               <div className="d-flex text-dark gap-2 fs-5 align-items-center fs-4">
//                 <span className="bill fs-5">Billing Instructions:</span>
//                 <div className="d-flex align-items-center gap-3 ms-2 options">
//                   <span className="d-flex align-items-center gap-2">
//                     <input
//                       type="radio"
//                       name="Billing-instruction"
//                       id="billing-option-1"
//                       value="opt-1"
//                       checked={billing}
//                       onChange={() => setBilling(true)}
//                     />
//                     <span>Will Print</span>
//                   </span>
//                   <span className="d-flex align-items-center gap-2">
//                     <input
//                       type="radio"
//                       name="Billing-instruction"
//                       id="billing-option-2"
//                       value="opt-2"
//                       checked={!billing}
//                       onChange={() => setBilling(false)}
//                     />
//                     <span>Will Not Print</span>
//                   </span>
//                 </div>
//               </div>
//               <select
//                 style={{ fontSize: "10px" }}
//                 className={`${
//                   billing ? "visible" : "visually-hidden"
//                 } w-100 px-1 form-control form-control-sm bg-white text-dark`}
//                 value={voucherFormData.BillingInstructions}
//                 name="BillingInstructions"
//                 onChange={handleChange}
//               >
//                 {billingDataList?.map((bill, index) => (
//                   <option key={index} value={bill.id}>
//                     {bill.label}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {voucherFormData.ServiceType === "Hotel" && (
//               <div className="mt-1 row">
//                 <div className="col-6 fs-4">
//                   <span className="bill fs-5">Agent</span>
//                   <Select
//                     options={agentList.map((agent) => ({
//                       id: agent.id,
//                       label: agent.agentName,
//                     }))}
//                     value={
//                       agentList.find(
//                         (agent) => agent.id === voucherFormData?.Agent
//                       )
//                         ? {
//                             id: voucherFormData.Agent,
//                             label: agentList.find(
//                               (agent) => agent.id === voucherFormData.Agent
//                             )?.agentName,
//                           }
//                         : null
//                     }
//                     styles={customStylesForAutoVoucher}
//                     className="customSelectLightTheame form-control form-control-sm bg-white text-dark"
//                     classNamePrefix="custom"
//                     placeholder="Select Agent"
//                     isSearchable={true}
//                     onChange={(selected) =>
//                       setVoucherFormData((prev) => ({
//                         ...prev,
//                         Agent: selected?.id || "",
//                       }))
//                     }
//                   />
//                 </div>
//                 <div className="col-6 fs-4">
//                   <div className="d-flex mt-1 align-items-center gap-5">
//                     <span className="bill fs-5">Local Agent:</span>
//                     <span>
//                       <input
//                         type="checkbox"
//                         className="me-2"
//                         checked={checkSmoking}
//                         onChange={(e) => setCheckSmoking(e.target.checked)}
//                       />
//                       Smoking
//                     </span>
//                   </div>
//                   <input
//                     type="text"
//                     placeholder="Local Agent"
//                     className="px-1 form-control form-control-sm bg-white text-dark"
//                     name="LocalAgent"
//                     value={voucherFormData.LocalAgent || ""}
//                     onChange={handleChange}
//                   />
//                 </div>
//               </div>
//             )}

//             <div className="mt-2">
//               <span className="bill fs-5 text-bold">Remark</span>
//               <textarea
//                 style={{ fontSize: "12px" }}
//                 className="w-100 p-1 note"
//                 value={voucherFormData.Note || ""}
//                 name="Note"
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="d-flex justify-content-center mt-2">
//               <span className="fs-5">
//                 This is a system generated document and does not need any stamp
//                 or signature.
//               </span>
//             </div>

//             <div className="sign-block">
//               <div className="d-flex flex-column align-items-end mt-4">
//                 <span className="fs-5">Authorised Signatory</span>
//                 <span className="fs-5" onClick={() => setEditMode(true)}>
//                   {editMode ? (
//                     <input
//                       type="text"
//                       name="userSign"
//                       value={userSign}
//                       onChange={(e) => {
//                         setUserSign(e.target.value);
//                         setVoucherFormData((prev) => ({
//                           ...prev,
//                           AuthorisedName: e.target.value,
//                         }));
//                       }}
//                       onBlur={() => setEditMode(false)}
//                       autoFocus
//                     />
//                   ) : (
//                     userSign
//                   )}
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div
//             className="w-100 d-flex mt-4 align-items-center"
//             style={{ justifyContent: "space-between" }}
//           >
//             <div className="d-flex gap-5 w-50">
//               <button className="voucher-btn-5" onClick={handleSubmit}>
//                 Save
//               </button>
//               <button className="voucher-btn-5" onClick={handleShare}>
//                 Mail
//               </button>
//               <button className="voucher-btn-5" onClick={onDownloadPDF}>
//                 Download
//               </button>
//             </div>
//             <div className="d-flex gap-5 justify-content-end">
//               {/*props.Type === "Client" && (
//                 <button className="voucher-btn-5" onClick={handlePrint}>
//                   Print on Stationery
//                 </button>
//               ) */}
//               <button
//                 className="voucher-btn-5"
//                 onClick={() => handlePrint(printData)}
//               >
//                 Print
//               </button>
//               <button className="voucher-btn-5" onClick={downloadDOCX}>
//                 Word Download
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <iframe
//         ref={iframePreviewRef}
//         title="Voucher Preview"
//         width="100%"
//         height="500px"
//         style={{ border: "none", background: "#fff", display: "none" }}
//       ></iframe>
//     </>
//   );
// }

// export default memo(Voucher);

// // Memoized content to avoid unnecessary recomputation
//   const content = useMemo(
//     () =>
//       selectedService?.ServiceName === "Hotel"
//         ? `<table class="editable-table fs-6 mt-2 text-dark" border="1">
//             <tr>
//               <td class="editable-td">Check In: ${
//                 voucherFormData.CheckIn || " "
//               }</td>
//               <td class="editable-td">Check Out: ${
//                 voucherFormData.CheckOut || " "
//               }</td>
//               <td class="editable-td">Nights: ${
//                 voucherFormData.Nights || ""
//               }</td>
//             </tr>
//             <tr>
//               <td class="editable-td" colspan="2">Room Type: ${
//                 voucherFormData.RoomType?.[0] || ""
//               }</td>
//               <td colspan="1" class="editable-td">Meal Plan: ${
//                 voucherFormData.MealPlan?.[0] || ""
//               }</td>
//             </tr>
//           </table>`
//         : `<table class="editable-table fs-6 mt-2 text-dark" border="1">
//             <tr>
//               <td class="editable-td">${voucherFormData.ArrivalOn || ""}: ${
//             voucherFormData.DestinationName || ""
//           } - ${voucherFormData.ServiceName || ""}</td>
//             </tr>
//           </table>`,
//     [
//       selectedService?.ServiceName,
//       voucherFormData.CheckIn,
//       voucherFormData.CheckOut,
//       voucherFormData.Nights,
//       voucherFormData.RoomType,
//       voucherFormData.MealPlan,
//       voucherFormData.ArrivalOn,
//       voucherFormData.DestinationName,
//       voucherFormData.ServiceName,
//     ]
//   );
