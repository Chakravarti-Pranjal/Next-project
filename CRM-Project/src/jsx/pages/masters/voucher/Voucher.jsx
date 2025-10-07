import React, {
  useEffect,
  useRef,
  useState,
  memo,
  useMemo,
  useCallback,
  useContext,
} from "react";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { parseISO, isValid } from "date-fns";
import DatePicker from "react-datepicker";
import { ToastContainer } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";

import { axiosOther } from "../../../../http/axios_base_url";
import { notifySuccess, notifyError } from "../../../../helper/notify";
import { customStylesForAutoVoucher } from "../../supplierCommunication/SupplierConfirmation/customStyle";
import "./voucher.css";
import { useSelector } from "react-redux";
import { Button, Modal } from "react-bootstrap";
import { ThemeContext } from "../../../../context/ThemeContext";
import OutlookLogo from "../../../../images/outlookLogo.svg";

// Initial Data
const ArrivalDetailsObj = { Date: "", Details: "" };
const initialArrivalDetails = [{ Date: "Arrival", Details: "" }];
const initialFormData = {
  Agent: "",
  PaxName: [],
  Schedule: initialArrivalDetails,
  VoucherNo: "",
  TourId: "",
  QueryId: "",
  QuotationNo: "",
  ReservationUniqueId: "",
  CompanyId: "",
  CompanyName: "",
  Website: "",
  CompanyLogo: "",
  ServiceId: "",
  ServiceName: "",
  ServiceType: "",
  Address: "",
  ContactPersonaName: "",
  Email: "",
  Phone: "",
  ConfirmationNo: "",
  SupplierId: "",
  Suppliername: "",
  DestinationId: "",
  DestinationName: "",
  Nights: "",
  ArrivalOn: "",
  DepartureOn: "",
  Fromdestination: "",
  ToDestination: "",
  ArrivalBy: "Flight",
  ArrivalAt: "",
  DepartureBy: "Surface",
  DepartureAt: "",
  Note: "Remarks",
  BillingInstructions: "1",
  AuthorisedName: "Mohd Rizwan",
  CheckIn: "",
  CheckOut: "",
  RoomType: [],
  MealPlan: [],
  ServiceRequest: "Please provide the services as per the following.",
  SingleRoom: "0",
  TwinRoom: "0",
  DoubleRoom: "0",
  TripleRoom: "0",
  LocalAgent: "",
};

function Voucher({ selectedService }) {
  const companyId = useMemo(
    () => JSON.parse(localStorage.getItem("token") || "{}"),
    []
  );
  const [voucherFormData, setVoucherFormData] = useState(initialFormData);
  const [printArrival, setPrintArrival] = useState(true);
  const [billing, setBilling] = useState(true);
  const [arrivalDetails, setArrivalDetails] = useState(initialArrivalDetails);
  const [editMode, setEditMode] = useState(false);
  const [userSign, setUserSign] = useState(companyId.UserName || "Mohd Rizwan");
  const [voucherNo, setVoucherNo] = useState(null);
  const [agentList, setAgentList] = useState([]);
  const [localAgentList, setLocalAgentList] = useState([]);
  const [voucherHTML, setVoucherHTML] = useState();
  const printRef = useRef(null);
  const iframePreviewRef = useRef(null);
  const [billingDataList, setBillingDataList] = useState([]);
  const [checkSmoking, setCheckSmoking] = useState(false);
  const [printData, setPrintData] = useState();
  const [pdfUrl, setPdfUrl] = useState();
  const [clientVoucher, setClientVoucher] = useState();
  const [loading, setLoading] = useState({
    main: false,
    billing: false,
    agents: false,
  });
  const [modalCentered, setModalCentered] = useState(false);
  const { background } = useContext(ThemeContext);
  const [mailTemplate, setMailTemplate] = useState();
  const [outlookEmails, setOutlookEmails] = useState();

  const [type, setType] = useState("Client");
  const { queryData } = useSelector((state) => state?.queryReducer);
  const queryQuotation = useMemo(
    () => JSON.parse(localStorage.getItem("Query_Qoutation") || "{}"),
    []
  );

  const isFetching = useRef(false);
  const originalServiceRequest = useRef(null);
  const htmlRef = useRef(null);

  // Fetch data concurrently
  useEffect(() => {
    const fetchData = async () => {
      if (isFetching.current) return;
      isFetching.current = true;
      setLoading((prev) => ({
        ...prev,
        main: true,
        billing: true,
        agents: true,
      }));

      try {
        const [billingResponse, agentResponse, localAgentRes, voucherResponse] =
          await Promise.all([
            axiosOther
              .post("list-billing-instruction", {
                Name: "Test Billing Instruction",
              })
              .catch(() => ({ data: { data: [] } })),
            axiosOther
              .post("agentlist", { perPage: 100 })
              .catch(() => ({ data: { DataList: [] } })),
            axiosOther
              .post("supplierlist", {
                SupplierService: 4,
                NotHotelShow: true,
                page: 1,
                perPage: "500",
              })
              .catch(() => ({ data: { DataList: [] } })),
            queryData?.QueryId &&
            queryQuotation?.QoutationNum &&
            selectedService?.SupplierId
              ? axiosOther
                  .post("listfinalvoucher", {
                    QueryId: queryQuotation?.QueryID || queryData?.QueryId,
                    QuotationNumber: queryQuotation?.QoutationNum,
                    Type: type,
                    SupplierId: selectedService.SupplierId.toString(),
                    ServiceId: selectedService.ServiceId
                      ? selectedService.ServiceId.toString()
                      : undefined,
                    ServiceUniqueId: selectedService.ServiceUniqueId,
                    UniqueId: selectedService?.UniqueId,
                    ServiceType: selectedService.Servicetype || "LocalAgent",
                    ...(selectedService.Servicetype &&
                      selectedService.Servicetype !== "LocalAgent" && {
                        ServiceUniqueId: selectedService.ServiceUniqueId,
                        CompanyId: companyId?.companyKey?.toString(),
                      }),
                  })
                  .catch(() => ({ data: { Data: null } }))
              : Promise.resolve({ data: { Data: null } }),
          ]);

        // Process billing instructions
        const billingData =
          billingResponse.data?.data?.map((bill) => ({
            id: bill.id,
            label: bill?.Description,
          })) || [];
        setBillingDataList(billingData);
        setLoading((prev) => ({ ...prev, billing: false }));

        // Process agent list
        const agentDataList =
          agentResponse.data?.DataList?.map((agent) => ({
            id: agent?.id,
            agentName: agent?.CompanyName,
          })) || [];
        setAgentList(agentDataList);
        setLoading((prev) => ({ ...prev, agents: false }));

        // Process agent list
        const localAgentDataList =
          localAgentRes.data?.DataList?.map((agent) => ({
            id: agent?.id,
            agentName: agent?.Name,
          })) || [];
        setLocalAgentList(localAgentDataList);

        // Process voucher data
        if (voucherResponse.data?.Data) {
          const voucherDataToSet = voucherResponse.data.Data;
          setClientVoucher(voucherDataToSet);
          setVoucherFormData((prev) => ({
            ...prev,
            // Agent: voucherDataToSet.AgentId || "",
            Agent: "",
            PaxName: [],
            Schedule: voucherDataToSet.Schedule || initialArrivalDetails,
            VoucherNo:
              voucherDataToSet.VoucherNo || selectedService?.VoucherNo || "",
            TourId: selectedService?.tourCode || "",
            QueryId: queryQuotation?.QueryID || queryData?.QueryId || "",
            QuotationNo: queryQuotation?.QoutationNum || "",
            ReservationUniqueId: "",
            CompanyId: voucherDataToSet.CompanyId?.toString() || "",
            CompanyName: voucherDataToSet.CompanyName || "",
            Website: voucherDataToSet.Website || "",
            CompanyLogo: voucherDataToSet.CompanyLogo || "",
            ServiceId: selectedService.ServiceId?.toString() || "",
            ServiceName:
              voucherDataToSet.ServiceType == "LocalAgent"
                ? voucherDataToSet.Supplier
                : selectedService?.ServiceName ||
                  voucherDataToSet.Supplier ||
                  "",
            ServiceType: voucherDataToSet.ServiceType || "",
            Address: voucherDataToSet.Address || "",
            ContactPersonaName: voucherDataToSet.ContactPersonaName || "",
            Email: voucherDataToSet.Email || "",
            Phone: voucherDataToSet.Phone || "",
            ConfirmationNo: "",
            SupplierId: selectedService.SupplierId?.toString() || "",
            Suppliername: voucherDataToSet.Supplier || "",
            DestinationId: "",
            DestinationName: voucherDataToSet.Destination || "",
            Nights: voucherDataToSet.TotalNights?.toString() || "",
            ArrivalOn: voucherDataToSet.Schedule?.[0]?.Date || "",
            DepartureOn:
              voucherDataToSet.Schedule?.[voucherDataToSet.Schedule.length - 1]
                ?.Date || "",
            Fromdestination: voucherDataToSet.ArrivalCity || "",
            ToDestination: voucherDataToSet.DepartureCity || "",
            ArrivalBy:
              voucherDataToSet.ArrivalBy ||
              (selectedService?.Servicetype == "Train" ? "Train" : "Flight"),
            ArrivalAt: voucherDataToSet.ArrivalAt || "",
            DepartureBy: voucherDataToSet.DepartureBy || "Surface",
            DepartureAt: voucherDataToSet.DepartureAt || "",
            Note: "Remarks",
            BillingInstructions: "1",
            AuthorisedName: "",
            CheckIn: voucherDataToSet.ArrivalDate || "",
            CheckOut: voucherDataToSet.DepartureDate || "",
            RoomType: [voucherDataToSet.RoomType] || [],
            MealPlan: [voucherDataToSet.MealPlan] || [],
            ServiceRequest:
              voucherDataToSet.ServiceRequest ||
              "Please provide the services as per the following.",
            SingleRoom: voucherDataToSet.SingleRoom || "0",
            TwinRoom: voucherDataToSet.TWINRoom || "0",
            DoubleRoom: voucherDataToSet.DoubleRoom || "0",
            TripleRoom: voucherDataToSet.TPLRoom || "0",
          }));

          // Set originalServiceRequest after fetching voucher data
          originalServiceRequest.current =
            voucherDataToSet.ServiceRequest ||
            "Please provide the services as per the following.";
        }

        // Fetch stored data only if VoucherNo exists
        const hasVoucherNo =
          voucherFormData.VoucherNo || selectedService?.VoucherNo;
        if (hasVoucherNo) {
          const clientPayload = {
            QueryId: queryQuotation?.QueryID || queryData?.QueryId,
            QuotationNumber: queryQuotation?.QoutationNum,
            TourCode: selectedService?.tourCode || "",
            ServiceId: selectedService.ServiceId?.toString() || "",
            SupplierId: selectedService?.SupplierId,
            Type: "Client",
          };

          const { data } = await axiosOther.post(
            "fetchStoredData",
            clientPayload
          );
          if (
            data.Status === 200 &&
            data?.DataList &&
            Array.isArray(data.DataList) &&
            data.DataList.length > 0
          ) {
            // Find the storedData matching selectedService.VoucherNo
            const matchingStoredData = data.DataList.find(
              (item) => item.VoucherNo === selectedService.VoucherNo
            );

            if (matchingStoredData) {
              const parsedVoucherData = JSON.parse(
                matchingStoredData.VoucherDataJson || "{}"
              );
              const confirmedReservation =
                matchingStoredData.ListConfiremdReservationForVoucher || {};
              const serviceDetails =
                confirmedReservation.List?.[0]?.ServiceDetails?.[0] || {};

              setVoucherFormData((prev) => ({
                ...prev,
                ...parsedVoucherData,
                // Override with selectedService fields if available
                ServiceId:
                  selectedService.ServiceId?.toString() ||
                  parsedVoucherData.ServiceId ||
                  "",
                SupplierId: parsedVoucherData.SupplierId || "",
                ServiceName: parsedVoucherData.ServiceName || "",
                ServiceType: parsedVoucherData.ServiceType || "",
                TourId: parsedVoucherData.TourId || "",
                VoucherNo:
                  selectedService.VoucherNo ||
                  parsedVoucherData.VoucherNo ||
                  "",
                QueryId:
                  queryQuotation?.QueryID ||
                  queryData?.QueryId ||
                  parsedVoucherData.QueryId ||
                  "",
                QuotationNo:
                  queryQuotation?.QoutationNum ||
                  parsedVoucherData.QuotationNo ||
                  "",
                // Additional fields from ListConfiremdReservationForVoucher
                ClientName: confirmedReservation.ClientName || "",
                TotalPax:
                  confirmedReservation.TotalPax?.toString() ||
                  parsedVoucherData.TotalPax ||
                  "0",
                CompanyLogo:
                  confirmedReservation.ClientLogo ||
                  parsedVoucherData.CompanyLogo ||
                  "",
                ClientEmail:
                  confirmedReservation.ClientEmail ||
                  parsedVoucherData.Email ||
                  "",
                ClientAddress:
                  confirmedReservation.ClientAddress ||
                  parsedVoucherData.Address ||
                  "",
                ClientMobile:
                  confirmedReservation.ClientMobile ||
                  parsedVoucherData.Phone ||
                  "",
                // ServiceDetails fields, overriding VoucherDataJson where applicable
                DestinationId:
                  serviceDetails.DestinationId?.toString() ||
                  parsedVoucherData.DestinationId ||
                  "",
                DestinationName:
                  serviceDetails.DestinationName ||
                  parsedVoucherData.DestinationName ||
                  "",
                // LocalAgent-specific fields from VoucherDataJson
                Agent: parsedVoucherData.Agent || "",
                PaxName: parsedVoucherData.PaxName || [],
                Schedule: parsedVoucherData.Schedule || [],
                ConfirmationNo: parsedVoucherData.ConfirmationNo || "",
                Suppliername:
                  parsedVoucherData.Suppliername ||
                  confirmedReservation.List?.[0]?.SupplierName ||
                  "",
                ArrivalOn:
                  parsedVoucherData.ArrivalOn || serviceDetails.FromDate || "",
                DepartureOn:
                  parsedVoucherData.DepartureOn || serviceDetails.ToDate || "",
                Fromdestination: parsedVoucherData.FromDestination || "",
                ToDestination: parsedVoucherData.ToDestination || "",
                ArrivalBy: parsedVoucherData.ArrivalBy || "",
                ArrivalAt: parsedVoucherData.ArrivalAt || "",
                DepartureBy: parsedVoucherData.DepartureBy || "",
                DepartureAt: parsedVoucherData.DepartureAt || "",
                Note: parsedVoucherData.Note || "",
                BillingInstructions:
                  parsedVoucherData.BillingInstructions || "",
                AuthorisedName: parsedVoucherData.AuthorisedName || "",
                ServiceRequest:
                  parsedVoucherData.ServiceRequest ||
                  "Please provide the services as per the following.",
                // LocalAgent-specific: set defaults for irrelevant hotel fields
                Nights: parsedVoucherData.Nights || "0",
                CheckIn:
                  parsedVoucherData.CheckIn || serviceDetails.FromDate || "",
                CheckOut:
                  parsedVoucherData.CheckOut || serviceDetails.ToDate || "",
                RoomType: parsedVoucherData.RoomType || [],
                MealPlan: parsedVoucherData.MealPlan || [],
                SingleRoom: parsedVoucherData.SingleRoom || "0",
                TwinRoom: parsedVoucherData.TwinRoom || "0",
                DoubleRoom: parsedVoucherData.DoubleRoom || "0",
                TripleRoom: parsedVoucherData.TripleRoom || "0",
              }));
              setVoucherNo(matchingStoredData.VoucherNo || "");
              setVoucherHTML({
                VoucherHtml: matchingStoredData.VoucherHtml || "",
                VoucherHtmlWithlogo:
                  matchingStoredData.VoucherHtmlWithlogo || "",
              });
              setPrintData(matchingStoredData.VoucherHtml);
              setClientVoucher(parsedVoucherData || {});
              // Update originalServiceRequest if stored data has a new ServiceRequest
              if (parsedVoucherData.ServiceRequest) {
                originalServiceRequest.current =
                  parsedVoucherData.ServiceRequest;
              }
            } else {
              notifyError(
                "No stored voucher data found for the provided voucher number"
              );
              setClientVoucher({});
              setVoucherFormData((prev) => ({
                ...prev,
                VoucherNo: selectedService.VoucherNo || "",
              }));
            }
          }
        } else {
          // Generate new voucher number if no VoucherNo exists
          const voucherNoResponse = await axiosOther.get("generate-voucherno");
          const newVoucherNo =
            voucherNoResponse.data?.voucher_number?.toString() || "";
          setVoucherNo(newVoucherNo);
          setVoucherFormData((prev) => ({
            ...prev,
            VoucherNo: newVoucherNo,
          }));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        notifyError("Failed to fetch voucher data");
      } finally {
        setLoading((prev) => ({ ...prev, main: false }));
        isFetching.current = false;
      }
    };

    fetchData();

    return () => {
      setClientVoucher(null);
    };
  }, [queryData, queryQuotation, selectedService, companyId]);

  // Handle smoking preference for ServiceRequest
  useEffect(() => {
    if (originalServiceRequest.current === null) return;

    const modifyServiceRequest = (checkSmoking) => {
      if (!checkSmoking) {
        const roomPattern = /(Please provide .*?Room(?:, .*?Room)*?)( from)/;
        return originalServiceRequest.current.replace(
          roomPattern,
          "$1 (Non Smoking)$2"
        );
      } else {
        return originalServiceRequest.current;
      }
    };

    const updatedRequest = modifyServiceRequest(checkSmoking);

    if (voucherFormData.ServiceRequest !== updatedRequest) {
      setVoucherFormData((prev) => ({
        ...prev,
        ServiceRequest: updatedRequest,
      }));
    }
  }, [checkSmoking]);

  const loadOptions = async (inputValue) => {
    if (!inputValue) return [];

    try {
      const { data } = await axiosOther.post("agentlist", {
        perPage: 10,
        CompanyName: inputValue,
      });

      return data?.DataList?.map((agent) => ({
        id: agent.id,
        label: agent.CompanyName,
      }));
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  // handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setVoucherFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoomChange = (e) => {
    const { name, value } = e.target;
    setVoucherFormData((prev) => ({
      ...prev,
      [`${name}Room`]: value,
    }));
  };

  const handleDateChange = (name, date) => {
    if (!date) return;
    setVoucherFormData((prev) => ({
      ...prev,
      [name]: date.toISOString(),
    }));
  };

  const handleArrivalIncrement = () => {
    setArrivalDetails((prev) => [...prev, ArrivalDetailsObj]);
    setVoucherFormData((prev) => ({
      ...prev,
      Schedule: [...prev.Schedule, ArrivalDetailsObj],
    }));
  };

  const handleArrivalDecrement = (index) => {
    // Don't remove if it's the last row
    if (voucherFormData.Schedule.length <= 1) return;

    setArrivalDetails((prev) => prev.filter((_, i) => i !== index));
    setVoucherFormData((prev) => ({
      ...prev,
      Schedule: prev.Schedule.filter((_, i) => i !== index),
    }));
  };

  const handleArrivalFormChange = (e, index) => {
    const { name, value } = e.target;
    setArrivalDetails((prev) => {
      const newArr = [...prev];
      newArr[index] = { ...newArr[index], [name]: value };
      return newArr;
    });
    setVoucherFormData((prev) => {
      const newSchedule = [...prev.Schedule];
      newSchedule[index] = { ...newSchedule[index], [name]: value };
      return { ...prev, Schedule: newSchedule };
    });
  };

  const handleArrivalDateChange = (date, index) => {
    const isoDate = date ? date.toISOString().split("T")[0] : "";
    setArrivalDetails((prev) => {
      const newArr = [...prev];
      newArr[index] = { ...newArr[index], Date: isoDate };
      return newArr;
    });
    setVoucherFormData((prev) => {
      const newSchedule = [...prev.Schedule];
      newSchedule[index] = { ...newSchedule[index], Date: isoDate };
      return { ...prev, Schedule: newSchedule };
    });
  };

  const handlePrint = useCallback(
    (data) => {
      if (!data) {
        notifyError("Please save the voucher!");
        return;
      }
      const htmlData = data || voucherHTML;
      const iframe = iframePreviewRef.current;

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
        notifyError("No data available for printing");
      }
    },
    [voucherHTML]
  );

  const handleSubmit = useCallback(async () => {
    if (!voucherFormData.VoucherNo && !voucherNo?.voucher_number) {
      notifyError("No valid voucher number available");
      return;
    }

    const payload = {
      id: selectedService?.id || "",
      Type: "Client",
      ProductType: voucherFormData.ServiceType,
      VoucherNo:
        voucherFormData.VoucherNo ||
        voucherNo?.voucher_number?.toString() ||
        "",
      TourCode: voucherFormData.TourId,
      QueryId: voucherFormData.QueryId || queryQuotation?.QueryID || "",
      QuotationNo:
        voucherFormData.QuotationNo || queryQuotation?.QoutationNum || "",
      VoucherDataJson: {
        ...voucherFormData,
        TotalPax: String(voucherFormData.PaxName.length) || "0",
        VoucherDate: new Date().toISOString().split("T")[0],
        Date: new Date().toISOString().split("T")[0],
        AuthorisedName: userSign || voucherFormData.AuthorisedName,
        AgentId: voucherFormData.Agent ? voucherFormData.Agent.toString() : "",
        BillingId: voucherFormData.BillingInstructions,
      },
      CreatedBy: companyId?.userId || "1",
      UpdatedBy: companyId?.userId || "1",
    };

    try {
      const { data } = await axiosOther.post("addfinalvoucher", payload);
      notifySuccess(data?.Message || "Voucher saved successfully");
      setVoucherHTML(data?.Data);
      if (printRef.current) {
        printRef.current.innerHTML = data?.Data?.VoucherHtml || "";
      }
      setPrintData(data?.Data?.VoucherHtml);
    } catch (error) {
      console.error("Error saving voucher:", error);
      notifyError("An error occurred while saving the voucher");
    }
  }, [
    voucherFormData,
    voucherNo,
    queryQuotation,
    companyId,
    userSign,
    type,
    selectedService,
  ]);

  console.log(selectedService, "SERKDJFK54885");

  const getEmailFromApiForHotel = async (hotelId) => {
    try {
      const { data } = await axiosOther.post("hotellist", {
        HotelName: "",
        id: hotelId,
        Status: "",
        DestinationId: "",
        page: 1,
        perPage: 100,
      });

      if (data?.Status == 200) {
        return data?.DataList[0]?.HotelContactDetails;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getEmailListForRestaurant = async (restaurantId) => {
    try {
      const { data } = await axiosOther.post("restaurantmasterlist", {
        id: restaurantId,
      });

      if (data?.Status == 200) {
        return data?.DataList[0]?.ContactEmail;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getEmailListForLocalAgentFlightTrain = async (supplierId) => {
    try {
      const { data } = await axiosOther.post("supplierlist", {
        Name: "",
        id: supplierId,
        DefaultDestination: "",
        DestinationId: "",
        SupplierService: "",
        page: 1,
        perPage: 10,
      });

      console.log(data, "WTSSTSFS655");

      if (data?.Status == 200) {
        return data?.DataList[0]?.Email;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleMailRequest = useCallback(async () => {
    if (selectedService?.Servicetype == "Hotel") {
      const emailList = await await getEmailFromApiForHotel(
        selectedService?.ServiceId
      );
      const emails = emailList?.map((item) => item.Email).join(",");
      setOutlookEmails(emails);
    }

    if (selectedService?.Servicetype == "Restaurant") {
      const findEmailList = await getEmailListForRestaurant(
        selectedService?.ServiceId
      );
      setOutlookEmails(findEmailList);
    }

    if (
      selectedService?.Servicetype == "Flight" ||
      selectedService?.Servicetype == "Train" ||
      selectedService?.Servicetype == "LocalAgent"
    ) {
      const findEmail = await getEmailListForLocalAgentFlightTrain(
        selectedService?.SupplierId
      );
      setOutlookEmails(findEmail);
    }

    try {
      const { data } = await axiosOther.post("queryfinalmailtemplate", {
        QueryId: queryQuotation?.QueryID,
        emailkey: "FinalVoucher",
      });
      if (data?.Status == 1) {
        setMailTemplate(data?.Data);
      }
    } catch (error) {
      console.log("error", error);
    }
  }, []);

  useEffect(() => {
    if (type == "Client") {
      setPrintData(voucherHTML?.VoucherHtml);
    } else {
      setPrintData(voucherHTML?.VoucherHtmlWithlogo);
    }
  }, [type]);

  const onDownloadPDF = useCallback(async () => {
    if (!printData) {
      notifyError("Please save the voucher");
      return;
    }
    try {
      const { data } = await axiosOther.post("voucherpdffile", {
        html: printData,
      });
      if (data?.status === 1 && data?.pdf_url) {
        setPdfUrl(data?.pdf_url);
        const link = document.createElement("a");
        link.href = data.pdf_url;
        link.setAttribute(
          "download",
          data.pdf_url.split("/").pop() || "voucher.pdf"
        );
        link.setAttribute("target", "_blank");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        notifyError("PDF URL not found in response");
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
      notifyError("Failed to download PDF");
    }
  }, [printData]);

  // const handleShare = useCallback(() => {
  //   try {
  //     window.location.href = `mailto:?subject=Your Voucher&body=Download your voucher here:`;
  //   } catch (error) {
  //     console.error("Sharing failed:", error);
  //     notifyError("Failed to share voucher");
  //   }
  // }, []);

  const downloadDOCX = useCallback(async () => {
    if (!printData) {
      notifyError("Please save the voucher");
      return;
    }
    try {
      const res = await axiosOther.post("voucherwordfile", { html: printData });
      if (res.data?.status === 1 && res.data?.download_url) {
        const link = document.createElement("a");
        link.href = res.data.download_url;
        link.setAttribute("download", "voucher.docx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        notifyError("DOCX URL not found in response");
      }
    } catch (error) {
      console.error("Error downloading DOCX:", error);
      notifyError("Failed to download DOCX");
    }
  }, [printData]);

  const handleCopy = () => {
    if (htmlRef.current) {
      const htmlContent = htmlRef.current.innerHTML;
      const textContent = htmlRef.current.innerText;

      navigator.clipboard
        .write([
          new ClipboardItem({
            "text/html": new Blob([htmlContent], { type: "text/html" }),
            "text/plain": new Blob([textContent], { type: "text/plain" }),
          }),
        ])
        .then(() => {
          alert("Copied with styles!");
        })
        .catch(() => {
          alert("Failed to copy.");
        });
    }
  };

  // Skeleton UI component for loading state
  const SkeletonInput = () => (
    <div
      className="skeleton"
      style={{
        width: "100%",
        height: "30px",
        background: "#e0e0e0",
        animation: "pulse 1.5s infinite",
      }}
    />
  );

  return (
    <>
      <style>{`
        @keyframes pulse {
          0% { background-color: #e0e0e0; }
          50% { background-color: #f0f0f0; }
          100% { background-color: #e0e0e0; }
        }
      `}</style>
      <ToastContainer />
      <div className="voucher-innerbox d-flex flex-column gap-5">
        <Modal className="fade" size="lg" show={modalCentered}>
          <Modal.Header>
            <ToastContainer />
            <Modal.Title>Send Email</Modal.Title>
            <Button
              onClick={() => setModalCentered(false)}
              variant=""
              className="btn-close"
            ></Button>
          </Modal.Header>
          <Modal.Body style={{ padding: "10px", paddingTop: "0px" }}>
            <div>
              <div
                ref={htmlRef}
                contentEditable={true}
                style={{
                  color: background?.value === "dark" ? "#fff" : "#000",
                }}
                dangerouslySetInnerHTML={{
                  __html: `${mailTemplate}`,
                }}
              />
              <hr />
              <div className="d-flex justify-content-end gap-3">
                {/* Copy Button */}
                <button
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={handleCopy}
                >
                  <img
                    width={30}
                    src="https://static.vecteezy.com/system/resources/previews/000/423/339/non_2x/copy-icon-vector-illustration.jpg"
                    alt="Copy"
                    title="Copy"
                  />
                </button>

                {/* Outlook Email Button */}

                <button
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    const subject = encodeURIComponent(
                      selectedService?.ServiceType + " Voucher"
                    );
                    const body = encodeURIComponent(
                      htmlRef.current?.innerText || ""
                    );

                    const mailtoLink = `mailto:${outlookEmails}?subject=${subject}&body=${body}`;

                    // Open the mail client reliably
                    window.open(mailtoLink, "_self");
                  }}
                >
                  <img
                    width={30}
                    src={OutlookLogo}
                    alt="OutlookLogo"
                    title="Send via Outlook"
                  />
                </button>
              </div>
            </div>
          </Modal.Body>
          {/*<Modal.Footer>
                                <Button
                                  onClick={() => setModalCentered(false)}
                                  variant="danger light"
                                  className="btn-custom-size"
                                >
                                  Close
                                </Button>
                              </Modal.Footer>*/}
        </Modal>

        {loading.main && !clientVoucher ? (
          <div className="bg-white d-flex justify-content-center align-items-center">
            Loading...
          </div>
        ) : !clientVoucher ? (
          <div className="bg-white d-flex justify-content-center align-items-center">
            No voucher found for the selected service
          </div>
        ) : (
          <div className="Voucher-outerbox">
            <div className="voucher-inner-1box print">
              <div className="d-flex justify-content-between mt-4">
                <div>
                  <div className="d-flex text-dark gap-2 fs-4 align-items-center">
                    <span style={{ width: "80px" }}>Name:</span>
                    {loading.main ? (
                      <SkeletonInput />
                    ) : (
                      <input
                        type="text"
                        className="form-control form-control-sm bg-white text-dark"
                        style={{ width: "300px" }}
                        name="ServiceName"
                        value={voucherFormData.ServiceName}
                        onChange={handleChange}
                      />
                    )}
                  </div>
                  {voucherFormData.ServiceType === "Hotel" && (
                    <div className="d-flex text-dark gap-2 fs-4 align-items-center mt-1">
                      <span style={{ width: "80px" }}>Room Type:</span>
                      {loading.main ? (
                        <SkeletonInput />
                      ) : (
                        <input
                          type="text"
                          placeholder="Room Type"
                          className="form-control form-control-sm bg-white text-dark"
                          style={{ width: "300px" }}
                          name="RoomType"
                          value={voucherFormData.RoomType?.[0] || ""}
                          onChange={(e) =>
                            setVoucherFormData((prev) => ({
                              ...prev,
                              RoomType: [e.target.value],
                            }))
                          }
                        />
                      )}
                    </div>
                  )}
                </div>
                <div>
                  <div className="d-flex text-dark gap-2 fs-5 align-items-center">
                    <span style={{ width: "80px" }}>Tour ID:</span>
                    <span>{voucherFormData.TourId}</span>
                  </div>
                  <div className="d-flex text-dark gap-2 fs-5 align-items-center">
                    <span style={{ width: "80px" }}>Voucher No:</span>
                    <span>
                      {voucherFormData.VoucherNo || voucherNo?.voucher_number}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <div className="d-flex text-dark gap-2 fs-4 align-items-center">
                  <span>Arrival/Departure Details:</span>
                  {/*<div className="d-flex align-items-center gap-3 ms-2 options">
                    <span className="d-flex align-items-center gap-2">
                      <input
                        type="radio"
                        name="print-option"
                        id="option-1"
                        value="opt-1"
                        checked={printArrival}
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
                        checked={!printArrival}
                        onChange={() => setPrintArrival(false)}
                      />
                      <span>Will Not Print</span>
                    </span>
                  </div>*/}
                </div>
                <div
                  className={`${
                    printArrival ? "visible" : "visually-hidden"
                  } w-100 mt-2`}
                >
                  <table className="text-center align-middle w-100">
                    <tbody>
                      <tr>
                        <th className="text-start ps-2 w-25">Arrival</th>
                        <th className="text-start ps-2 w-25">From</th>
                        <th className="text-start ps-2 w-25">By</th>
                        <th className="text-start ps-2 w-25">At</th>
                      </tr>
                      <tr>
                        <td className="pe-2">
                          {loading.main ? (
                            <SkeletonInput />
                          ) : (
                            <DatePicker
                              selected={
                                voucherFormData.ArrivalOn &&
                                isValid(parseISO(voucherFormData.ArrivalOn))
                                  ? parseISO(voucherFormData.ArrivalOn)
                                  : null
                              }
                              onChange={(date) =>
                                handleDateChange("ArrivalOn", date)
                              }
                              dateFormat="dd/MM/yyyy"
                              placeholderText="dd/mm/yyyy"
                              className="px-1 form-control form-control-sm bg-white text-dark"
                            />
                          )}
                        </td>
                        <td className="pe-2">
                          {loading.main ? (
                            <SkeletonInput />
                          ) : (
                            <input
                              type="text"
                              className="px-1 form-control form-control-sm bg-white text-dark"
                              placeholder="City"
                              value={voucherFormData.Fromdestination || ""}
                              name="Fromdestination"
                              onChange={handleChange}
                            />
                          )}
                        </td>
                        <td className="pe-2">
                          {loading.main ? (
                            <SkeletonInput />
                          ) : (
                            <select
                              className="px-1 form-control form-control-sm bg-white text-dark"
                              value={voucherFormData.ArrivalBy || ""}
                              name="ArrivalBy"
                              // style={{ width: "195px" }}
                              onChange={handleChange}
                            >
                              <option value="">Select</option>
                              <option value="Flight">Flight</option>
                              <option value="Train">Train</option>
                              <option value="Surface">Surface</option>
                            </select>
                          )}
                        </td>
                        <td>
                          {loading.main ? (
                            <SkeletonInput />
                          ) : (
                            <input
                              type="text"
                              placeholder="00:00"
                              className="px-1 form-control form-control-sm bg-white text-dark"
                              // style={{ width: "180px" }}
                              value={voucherFormData.ArrivalAt || ""}
                              name="ArrivalAt"
                              onChange={handleChange}
                            />
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table className="text-center align-middle w-100">
                    <tbody>
                      <tr>
                        <th className="text-start ps-2 w-25">Departure</th>
                        <th className="text-start ps-2 w-25">To</th>
                        <th className="text-start ps-2 w-25">By</th>
                        <th className="text-start ps-2 w-25">At</th>
                      </tr>
                      <tr>
                        <td className="pe-2">
                          {loading.main ? (
                            <SkeletonInput />
                          ) : (
                            <DatePicker
                              selected={
                                voucherFormData.DepartureOn &&
                                isValid(parseISO(voucherFormData.DepartureOn))
                                  ? parseISO(voucherFormData.DepartureOn)
                                  : null
                              }
                              onChange={(date) =>
                                handleDateChange("DepartureOn", date)
                              }
                              dateFormat="dd/MM/yyyy"
                              placeholderText="dd/mm/yyyy"
                              className="px-1 form-control form-control-sm bg-white text-dark"
                            />
                          )}
                        </td>
                        <td className="pe-2">
                          {loading.main ? (
                            <SkeletonInput />
                          ) : (
                            <input
                              type="text"
                              className="px-1 form-control form-control-sm bg-white text-dark"
                              placeholder="City"
                              value={voucherFormData.ToDestination || ""}
                              name="ToDestination"
                              onChange={handleChange}
                            />
                          )}
                        </td>
                        <td className="pe-2">
                          {loading.main ? (
                            <SkeletonInput />
                          ) : (
                            <select
                              className="px-1 form-control form-control-sm bg-white text-dark"
                              value={voucherFormData.DepartureBy || ""}
                              name="DepartureBy"
                              // style={{ width: "195px" }}
                              onChange={handleChange}
                            >
                              <option value="">Select</option>
                              <option value="Flight">Flight</option>
                              <option value="Train">Train</option>
                              <option value="Surface">Surface</option>
                            </select>
                          )}
                        </td>
                        <td>
                          {loading.main ? (
                            <SkeletonInput />
                          ) : (
                            <input
                              type="text"
                              className="px-1 form-control form-control-sm bg-white text-dark"
                              placeholder="00:00"
                              // style={{ width: "180px" }}
                              value={voucherFormData.DepartureAt || ""}
                              name="DepartureAt"
                              onChange={handleChange}
                            />
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-3">
                <span className="fs-5">Service Request</span>
                {loading.main ? (
                  <SkeletonInput />
                ) : (
                  <input
                    type="text"
                    value={voucherFormData.ServiceRequest}
                    placeholder="Please provide the services as per the following."
                    className="w-100 px-1 form-control form-control-sm bg-white text-dark"
                    style={{ fontSize: "11px" }}
                    name="ServiceRequest"
                    onChange={handleChange}
                  />
                )}
              </div>

              {voucherFormData.ServiceType === "Hotel" && (
                <div className="mt-3">
                  <span className="fs-5">Rooms Information</span>
                  <table className="table table-bordered itinerary-table voucherTable">
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
                          {loading.main ? (
                            <SkeletonInput />
                          ) : (
                            <input
                              type="text"
                              name="Single"
                              className="form-control form-control-sm bg-white text-dark"
                              value={voucherFormData.SingleRoom || ""}
                              onChange={handleRoomChange}
                            />
                          )}
                        </td>
                        <td>
                          {loading.main ? (
                            <SkeletonInput />
                          ) : (
                            <input
                              type="text"
                              name="Twin"
                              className="form-control form-control-sm bg-white text-dark"
                              value={voucherFormData.TwinRoom || ""}
                              onChange={handleRoomChange}
                            />
                          )}
                        </td>
                        <td>
                          {loading.main ? (
                            <SkeletonInput />
                          ) : (
                            <input
                              type="text"
                              name="Double"
                              className="form-control form-control-sm bg-white text-dark"
                              value={voucherFormData.DoubleRoom || ""}
                              onChange={handleRoomChange}
                            />
                          )}
                        </td>
                        <td>
                          {loading.main ? (
                            <SkeletonInput />
                          ) : (
                            <input
                              type="text"
                              name="Triple"
                              className="form-control form-control-sm bg-white text-dark"
                              value={voucherFormData.TripleRoom || ""}
                              onChange={handleRoomChange}
                            />
                          )}
                        </td>
                        <td>
                          {loading.main ? (
                            <SkeletonInput />
                          ) : (
                            <input
                              type="text"
                              name="Nights"
                              className="form-control form-control-sm bg-white text-dark"
                              value={voucherFormData.Nights}
                              onChange={handleChange}
                            />
                          )}
                        </td>
                        <td>
                          {loading.main ? (
                            <SkeletonInput />
                          ) : (
                            <input
                              type="text"
                              name="MealPlan"
                              className="form-control form-control-sm bg-white text-dark"
                              value={voucherFormData.MealPlan?.[0] || ""}
                              onChange={(e) =>
                                setVoucherFormData((prev) => ({
                                  ...prev,
                                  MealPlan: [e.target.value],
                                }))
                              }
                            />
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              <div className="mt-1">
                <span className="fs-5">Schedule</span>
                <table className="table table-bordered itinerary-table voucherTable">
                  <thead>
                    <tr>
                      <th className="col-4">Date</th>
                      <th className="col-8">Details</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {voucherFormData.Schedule?.map((detail, index) => (
                      <tr key={index}>
                        <td>
                          {loading.main ? (
                            <SkeletonInput />
                          ) : (
                            <DatePicker
                              selected={
                                detail?.Date && isValid(parseISO(detail.Date))
                                  ? parseISO(detail.Date)
                                  : null
                              }
                              onChange={(date) =>
                                handleArrivalDateChange(date, index)
                              }
                              dateFormat="dd-MM-yyyy"
                              className="px-1 form-control form-control-sm bg-white text-dark"
                            />
                          )}
                        </td>
                        <td>
                          {loading.main ? (
                            <SkeletonInput />
                          ) : (
                            <input
                              type="text"
                              className="form-control form-control-sm bg-white text-dark"
                              name="Details"
                              value={detail?.Details || ""}
                              onChange={(e) =>
                                handleArrivalFormChange(e, index)
                              }
                            />
                          )}
                        </td>
                        <td>
                          <div className="d-flex w-100 justify-content-center gap-2">
                            <span onClick={handleArrivalIncrement}>
                              <i className="la la-plus border cursor-pointer bg-success text-white rounded-pill fontSize10px padding1px"></i>
                            </span>
                            <span onClick={() => handleArrivalDecrement(index)}>
                              <i className="la la-minus border cursor-pointer bg-primary text-white rounded-pill fontSize10px padding1px"></i>
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-2">
                <div className="d-flex text-dark gap-2 fs-5 align-items-center fs-4">
                  <span className="bill fs-5">Billing Instructions:</span>
                  {/*<div className="d-flex align-items-center gap-3 ms-2 options">
                    <span className="d-flex align-items-center gap-2">
                      <input
                        type="radio"
                        name="Billing-instruction"
                        id="billing-option-1"
                        value="opt-1"
                        checked={billing}
                        onChange={() => setBilling(true)}
                      />
                      <span>Will Print</span>
                    </span>
                    <span className="d-flex align-items-center gap-2">
                      <input
                        type="radio"
                        name="Billing-instruction"
                        id="billing-option-2"
                        value="opt-2"
                        checked={!billing}
                        onChange={() => setBilling(false)}
                      />
                      <span>Will Not Print</span>
                    </span>
                  </div>*/}
                </div>
                {loading.billing ? (
                  <SkeletonInput />
                ) : (
                  <select
                    style={{ fontSize: "10px" }}
                    className={`${
                      billing ? "visible" : "visually-hidden"
                    } w-100 px-1 form-control form-control-sm bg-white text-dark`}
                    value={voucherFormData.BillingInstructions}
                    name="BillingInstructions"
                    onChange={handleChange}
                  >
                    {billingDataList?.map((bill, index) => (
                      <option key={index} value={bill.id}>
                        {bill.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {voucherFormData.ServiceType === "Hotel" && (
                <div className="mt-1 row">
                  <div className="col-6 fs-4">
                    <span className="bill fs-5">Agent</span>
                    {loading.agents ? (
                      <SkeletonInput />
                    ) : (
                      <AsyncSelect
                        cacheOptions
                        defaultOptions={[
                          { id: "", label: "Select" },
                          ...agentList.map((agent) => ({
                            id: agent.id,
                            label: agent.agentName,
                          })),
                        ]}
                        loadOptions={loadOptions}
                        value={
                          agentList.find(
                            (agent) => agent.id === voucherFormData?.Agent
                          )
                            ? {
                                id: voucherFormData.Agent,
                                label: agentList.find(
                                  (agent) => agent.id === voucherFormData.Agent
                                )?.agentName,
                              }
                            : null
                        }
                        styles={customStylesForAutoVoucher}
                        className="customSelectLightTheame form-control form-control-sm bg-white text-dark"
                        classNamePrefix="custom"
                        placeholder="Select Agent"
                        isSearchable
                        onChange={(selected) =>
                          setVoucherFormData((prev) => ({
                            ...prev,
                            Agent: selected?.id || "",
                          }))
                        }
                      />
                    )}
                  </div>
                  <div className="col-6 fs-4">
                    <div className="d-flex mt-1 align-items-center gap-5">
                      <span className="bill fs-5">Local Agent:</span>
                      <span>
                        <input
                          type="checkbox"
                          className="me-2"
                          checked={checkSmoking}
                          onChange={(e) => setCheckSmoking(e.target.checked)}
                        />
                        Smoking
                      </span>
                    </div>
                    {loading.main ? (
                      <SkeletonInput />
                    ) : (
                      <Select
                        options={[
                          { id: "", label: "Select" },
                          ...localAgentList.map((agent) => ({
                            id: agent.id,
                            label: agent.agentName,
                          })),
                        ]}
                        value={
                          localAgentList.find(
                            (agent) => agent.id === voucherFormData?.LocalAgent
                          )
                            ? {
                                id: voucherFormData.LocalAgent,
                                label: localAgentList.find(
                                  (agent) =>
                                    agent.id === voucherFormData.LocalAgent
                                )?.agentName,
                              }
                            : null
                        }
                        styles={customStylesForAutoVoucher}
                        className="customSelectLightTheame form-control form-control-sm bg-white text-dark"
                        classNamePrefix="custom"
                        name="LocalAgent"
                        placeholder="Select Local Agent"
                        isSearchable={true}
                        onChange={(selected) =>
                          setVoucherFormData((prev) => ({
                            ...prev,
                            LocalAgent: selected?.id || "",
                          }))
                        }
                      />
                    )}
                  </div>
                </div>
              )}

              <div className="mt-2">
                <span className="bill fs-5 text-bold">Remarks</span>
                {loading.main ? (
                  <SkeletonInput />
                ) : (
                  <textarea
                    style={{ fontSize: "12px" }}
                    className="w-100 p-1 note"
                    value={voucherFormData.Note || ""}
                    name="Note"
                    onChange={handleChange}
                  />
                )}
              </div>

              <div className="d-flex justify-content-center mt-2">
                <span className="fs-5">
                  This is a system generated document and does not need any
                  stamp or signature.
                </span>
              </div>

              <div className="sign-block">
                <div className="d-flex flex-column align-items-end mt-4">
                  <span className="fs-5">Authorised Signatory</span>
                  <span className="fs-5" onClick={() => setEditMode(true)}>
                    {editMode ? (
                      <input
                        type="text"
                        name="userSign"
                        value={userSign}
                        onChange={(e) => {
                          setUserSign(e.target.value);
                          setVoucherFormData((prev) => ({
                            ...prev,
                            AuthorisedName: e.target.value,
                          }));
                        }}
                        onBlur={() => setEditMode(false)}
                        autoFocus
                      />
                    ) : (
                      userSign || voucherFormData.AuthorisedName
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div
              className="w-100 d-flex mt-4 align-items-center"
              style={{ justifyContent: "space-between" }}
            >
              <div className="d-flex gap-5 w-50">
                <button className="voucher-btn-5" onClick={handleSubmit}>
                  Save
                </button>
                <button
                  className="voucher-btn-5"
                  onClick={() => {
                    setModalCentered(true);
                    handleMailRequest();
                  }}
                >
                  Mail
                </button>
                <button className="voucher-btn-5" onClick={onDownloadPDF}>
                  Download
                </button>
              </div>
              <div className="d-flex gap-5 justify-content-end">
                <div className="d-flex align-items-center gap-3 ms-2 options">
                  <span className="d-flex align-items-center gap-2">
                    <input
                      type="radio"
                      name="type"
                      id="type-1"
                      value="Client"
                      checked={type === "Client"}
                      onChange={() => setType("Client")}
                    />
                    <span>Client</span>
                  </span>
                  <span className="d-flex align-items-center gap-2">
                    <input
                      type="radio"
                      name="type"
                      id="type-2"
                      value="Supplier"
                      checked={type === "Supplier"}
                      onChange={() => setType("Supplier")}
                    />
                    <span>Supplier</span>
                  </span>
                </div>

                <button
                  className="voucher-btn-5"
                  onClick={() => handlePrint(printData)}
                >
                  Print
                </button>
                <button className="voucher-btn-5" onClick={downloadDOCX}>
                  Word Download
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <iframe
        ref={iframePreviewRef}
        title="Voucher Preview"
        width="100%"
        height="500px"
        style={{ border: "none", background: "#fff", display: "none" }}
      ></iframe>
    </>
  );
}

export default memo(Voucher);
