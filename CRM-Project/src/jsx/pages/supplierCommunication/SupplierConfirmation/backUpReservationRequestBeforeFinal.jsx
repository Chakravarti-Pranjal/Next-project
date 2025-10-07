import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Row, Card, Col } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "../../../../css/new-style.css";
import DatePicker from "react-datepicker";
import { axiosOther } from "../../../../http/axios_base_url";
import { useDispatch, useSelector } from "react-redux";
import { notifyError, notifySuccess } from "../../../../helper/notify";
import { Toaster } from "react-hot-toast";
import OutlookLogo from "../../../../images/outlookLogo.svg";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import { customStyles } from "./customStyle";
import styles from "./ServiceCard.module.css";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { format } from "date-fns";
import { Editor } from "@tinymce/tinymce-react";
import DarkCustomTimePicker from "../../query-dashboard/helper-methods/TimePicker";
import { FaChevronCircleDown, FaChevronCircleUp } from "react-icons/fa";

const handleDateFormatChange = (date) => {
  let formattedDate;
  if (date) {
    formattedDate = format(date, "dd-MM-yyyy");
  }
  return formattedDate;
};

const IsDataLoading = () => {
  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.7)",
        position: "fixed",
        top: "0",
        left: "0",
        zIndex: "99999",
      }}
    >
      <span
        className="spinner-border spinner-border-sm me-2"
        role="status"
        aria-hidden="true"
        style={{ width: "30px", height: "30px" }}
      ></span>
    </div>
  );
};

const confirstStatusInitial = {
  id: "",
  QuotationNumber: "",
  ServiceId: "",
  ServiceType: "",
  SupplierId: "",
  SupplierName: "",
  SupplierUniqueId: "",
  ApproveBy: "",
  ConfirmedBy: "",
  ReservationStatus: "Pending",
  DestinationId: "",
  DestinationName: "",
  ReservationNotes: "",
  ConfirmationNo: "",
  ConfirmationDate: null,
  CutOfDate: null,
  ConfirmedNote: "",
  Date: "",
  VehicleType: "",
  StartTime: "",
  EndTime: "",
  PickupTime: "",
  DropTime: "",
  PickupAddress: "",
  DropAddress: "",
};

const Reservationrequest = ({ handleNext }) => {
  const supplierSectionStatus = useSelector(
    (state) => state.supplierStateReducer.supplierSectionChange
  );

  const apiLoadCount = useSelector(
    (state) => state.operationSupplierConfirmationReducer.count
  );

  const [reservationList, setReservationList] = useState([]);
  const [copyReservationList, setCopyReservationList] = useState([]);
  const [confirmStatusForm, setConfirmStatusForm] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [supplier, setSupplier] = useState(null);
  const [service, setService] = useState(null);
  const [status, setStatus] = useState(null);
  const [showTable, setShowTable] = useState(true);
  const [lgShow, setLgShow] = useState(false);
  const quotationDataOperation = useSelector(
    (state) => state.queryReducer?.quotationDataOperation
  );
  const navigate = useNavigate();
  const [editingIndexes, setEditingIndexes] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [vehicleTypeList, setVehicleTypeList] = useState([]);
  const [specialRequest, setSpecialRequest] = useState("");
  const [reservationFormData, setReservationFormData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([0]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [confirmedReservationsList, setConfirmedReservationsList] = useState(
    {}
  );
  const [queryJson, setQueryJson] = useState([]);
  const [htmlString, setHtmlString] = useState("");
  const [isOpen, setIsOpen] = useState({ original: false });
  const [isItineraryRequest, setIsItineraryRequest] = useState(false);
  const queryQuotation = JSON.parse(localStorage.getItem("Query_Qoutation"));
  const companyId = JSON.parse(localStorage.getItem("token"))?.companyKey;
  const htmlRef = useRef(null);
  const [editIndex, setEditIndex] = useState(null);

  const [isTableVisible, setIsTableVisible] = useState(false); // Different state name for checkbox toggle
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [clickedRowIndex, setClickedRowIndex] = useState(null); // State for selected row index
  const [demoDataState, setDemoDataState] = useState([
    {
      sNo: 1,
      reqNo: "REQ001",
      from: "2025-09-12",
      to: "2025-09-15",
      serviceBy: "Hotel Booking",
      city: "New York",
      serviceProvider: "Hotel ABC",
      status: "Pending",
      dated: "2025-09-11",
      confirmationNo: "CONF001",
      remarks: "Awaiting confirmation",
    },
    {
      sNo: 2,
      reqNo: "REQ002",
      from: "2025-09-16",
      to: "2025-09-18",
      serviceBy: "Flight",
      city: "Los Angeles",
      serviceProvider: "Delta Airlines",
      status: "Confirmed",
      dated: "2025-09-10",
      confirmationNo: "CONF002",
      remarks: "Tickets issued",
    },
    {
      sNo: 3,
      reqNo: "REQ003",
      from: "2025-09-19",
      to: "2025-09-21",
      serviceBy: "Transport",
      city: "Chicago",
      serviceProvider: "Uber Rentals",
      status: "Cancelled",
      dated: "2025-09-09",
      confirmationNo: "CONF003",
      remarks: "Cancelled due to weather",
    },
    {
      sNo: 4,
      reqNo: "REQ004",
      from: "2025-09-22",
      to: "2025-09-25",
      serviceBy: "Guide Service",
      city: "Miami",
      serviceProvider: "Miami Tours",
      status: "Requested",
      dated: "2025-09-08",
      confirmationNo: "CONF004",
      remarks: "Pending approval",
    },
  ]);
  const [editTableRowIndex, setEditTableRowIndex] = useState(null);

  const demoData = [
    {
      sNo: 1,
      reqNo: "REQ001",
      from: "2025-09-12",
      to: "2025-09-15",
      serviceBy: "Hotel Booking",
      city: "New York",
      serviceProvider: "Hotel ABC",
      status: "Pending",
      dated: "2025-09-11",
      confirmationNo: "CONF001",
      remarks: "Awaiting confirmation",
    },
    {
      sNo: 2,
      reqNo: "REQ002",
      from: "2025-09-16",
      to: "2025-09-18",
      serviceBy: "Flight",
      city: "Los Angeles",
      serviceProvider: "Delta Airlines",
      status: "Confirmed",
      dated: "2025-09-10",
      confirmationNo: "CONF002",
      remarks: "Tickets issued",
    },
    {
      sNo: 3,
      reqNo: "REQ003",
      from: "2025-09-19",
      to: "2025-09-21",
      serviceBy: "Transport",
      city: "Chicago",
      serviceProvider: "Uber Rentals",
      status: "Cancelled",
      dated: "2025-09-09",
      confirmationNo: "CONF003",
      remarks: "Cancelled due to weather",
    },
    {
      sNo: 4,
      reqNo: "REQ004",
      from: "2025-09-22",
      to: "2025-09-25",
      serviceBy: "Guide Service",
      city: "Miami",
      serviceProvider: "Miami Tours",
      status: "Requested",
      dated: "2025-09-08",
      confirmationNo: "CONF004",
      remarks: "Pending approval",
    },
  ];

  const demoData2 = [
    {
      sNo: 1,
      from: "2025-02-02",
      to: "2025-02-02",
      city: "Delhi",
      service: "Guide",
      serviceDetail: "Guide - Full Day",
      pax: 3,
      amount: 1266.7,
      total: 3800,
    },
    {
      sNo: 2,
      from: "2025-02-02",
      to: "2025-02-02",
      city: "Delhi",
      service: "Add Ons",
      serviceDetail: "Lunch in restaurant",
      pax: 3,
      amount: 3500,
      total: 10500,
    },
    {
      sNo: 3,
      from: "2025-02-02",
      to: "2025-02-02",
      city: "Delhi",
      service: "Add Ons",
      serviceDetail: "Rickshaw Ride in Old Delhi",
      pax: 3,
      amount: 150,
      total: 450,
    },
    {
      sNo: 4,
      from: "2025-02-03",
      to: "2025-02-03",
      city: "Agra",
      service: "Monument",
      serviceDetail: "Taj Mahal, Agra Fort",
      pax: 3,
      amount: 1950,
      total: 5850,
    },
    {
      sNo: 5,
      from: "2025-02-03",
      to: "2025-02-03",
      city: "Agra",
      service: "Guide",
      serviceDetail: "Guide - Full Day",
      pax: 3,
      amount: 1266.7,
      total: 3800,
    },
  ];

  const handleRowClick = (index) => {
    setClickedRowIndex(index);
    setIsModalOpen(true);
  };

  // Handler for table input changes
  const handleTableInputChange = (e, index) => {
    const { name, value } = e.target;
    setDemoDataState((prevData) => {
      const updatedData = [...prevData];
      updatedData[index] = { ...updatedData[index], [name]: value };
      return updatedData;
    });
  };

  // Handler for date changes in the table
  const handleTableDateChange = (date, name, index) => {
    const formattedDate = date ? date.toISOString().split("T")[0] : "";
    setDemoDataState((prevData) => {
      const updatedData = [...prevData];
      updatedData[index] = { ...updatedData[index], [name]: formattedDate };
      return updatedData;
    });
  };

  // Handler to save edited row
  const handleSaveTableRow = (index) => {
    setEditTableRowIndex(null); // Exit edit mode
    notifySuccess("Row saved successfully");
    // Optional: Add API call here to persist changes to the backend
  };

  // Handler to cancel editing
  const handleCancelTableRow = () => {
    setEditTableRowIndex(null); // Exit edit mode without saving
  };

  // Handler to toggle edit mode for table row
  const handleEditTableRow = (index) => {
    setEditTableRowIndex(index);
  };

  const handleCopy = () => {
    const range = document.createRange();
    range.selectNode(htmlRef.current);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    try {
      document.execCommand("copy");
      alert("Copied to clipboard!");
    } catch (err) {
      alert("Failed to copy.");
    }
    selection.removeAllRanges();
  };

  const status_array = [
    "Pending",
    "Confirmed",
    "Cancelled",
    "Requested",
    "Rejected",
    "WaitList",
  ];

  const getAPIToServer = async () => {
    try {
      const { data } = await axiosOther.post(
        "listofservicesforsupplierselection",
        {
          QueryId: quotationDataOperation?.QueryId || queryQuotation?.QueryID,
          QuotationNo:
            quotationDataOperation?.QuotationNumber ||
            queryQuotation?.QoutationNum,
        }
      );
      if (data?.success) {
        console.log(data?.AssignedServices, "VCHGDJD8877");
        setReservationList(data?.AssignedServices);
        setQueryJson(data?.QueryJson?.RoomInfo);
        const options = [
          ...new Map(
            data?.AssignedServices.map((item) => [
              item.Service.ServiceDetails[0].ItemSupplierDetail.ItemSupplierId,
              {
                value:
                  item.Service.ServiceDetails[0].ItemSupplierDetail
                    .ItemSupplierId,
                label:
                  item.Service.ServiceDetails[0].ItemSupplierDetail
                    .ItemSupplierName,
              },
            ])
          ).values(),
        ];
        setSupplierList(options);
        setCopyReservationList(data?.AssignedServices);
        setRefreshKey((prev) => prev + 1);
      } else {
        setReservationList([]);
      }
    } catch (error) {
      console.log("error", error);
    }

    try {
      const { data } = await axiosOther.post("listproduct");
      const options = data?.Datalist?.map((item) => ({
        value: item?.id,
        label: item?.name,
      }));
      setServiceList(options);
    } catch (error) {
      console.log("error", error);
    }

    try {
      const { data } = await axiosOther.post("supplierlist");
      const options = data?.DataList?.map((item) => ({
        value: item?.id,
        label: item?.Name,
      }));
    } catch (error) {
      console.log("error", error);
    }
    try {
      const { data } = await axiosOther.post("vehicletypemasterlist");
      const options = data?.DataList?.map((item) => ({
        value: item?.id,
        label: item?.Name,
      }));
      setVehicleTypeList(options);
    } catch (error) {
      console.log("error", error);
    }
  };

  const getConfirmedReservationsData = async (ServiceUniqueId) => {
    try {
      const { data } = await axiosOther.post("getConfirmedReservations", {
        QueryId: quotationDataOperation?.id || queryQuotation?.QueryNumId,
        QuotationNumber:
          quotationDataOperation?.QuotationNumber ||
          queryQuotation?.QoutationNum,
        Status: "",
        ServiceId: "",
        ServiceType: "",
        ServiceUniqueId: ServiceUniqueId,
      });
      setConfirmedReservationsList((prev) => ({
        ...prev,
        [ServiceUniqueId]: data.List,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (reservationList?.length > 0) {
      reservationList?.forEach((list, index) => {
        getConfirmedReservationsData(list?.Service?.ServiceUniqueId);
      });
    }
  }, [reservationList]);

  useEffect(() => {
    getAPIToServer();
  }, [apiLoadCount]);

  const [isDataLoad, setIsDataLoad] = useState(false);

  useEffect(() => {
    // if (isDataLoad) return;
    if (reservationList?.length > 0) {
      const initialFormData = reservationList?.map((item, idx) => {
        const confirmedData =
          confirmedReservationsList[item?.Service?.ServiceUniqueId]?.[0] || {};
        console.log(confirmedData, "confirmedData", idx);
        const form = {
          Day: item?.Day,
          ServiceUniqueId: item?.Service?.ServiceUniqueId,
          id: quotationDataOperation?.id || queryQuotation?.QueryNumId,
          QuotationNumber:
            quotationDataOperation?.QuotationNumber ||
            queryQuotation?.QoutationNum,
          ServiceId: item?.Service?.ServiceId || "",
          ServiceType: item?.Service?.ServiceType || "",
          SupplierId:
            item?.Service?.ServiceDetails[0]?.ItemSupplierDetail
              ?.ItemSupplierId || "",
          SupplierName:
            item?.Service?.ServiceDetails[0]?.ItemSupplierDetail
              ?.ItemSupplierName || "",
          ReservationStatus: confirmedData.ReservationStatus || "Pending",
          ConfirmationNo: confirmedData.ConfirmationNo || "",
          ConfirmationDate: confirmedData.ConfirmationDate || null,
          CutOfDate: confirmedData.CutOfDate || null,
          ConfirmedBy: confirmedData.ConfirmedBy || "",
          ConfirmedNote: confirmedData.ConfirmedNote || "",
          VehicleType: confirmedData.VehicleType || "",
          StartTime: confirmedData.StartTime || "",
          EndTime: confirmedData.EndTime || "",
          PickupTime: confirmedData.PickupTime || "",
          DropTime: confirmedData.DropTime || "",
          PickupAddress: confirmedData.PickupAddress || "",
          DropAddress: confirmedData.DropAddress || "",
          ApproveBy: "1",
          DestinationId: confirmedData.ServiceDetails?.[0]?.DestinationId || "",
          DestinationName:
            confirmedData.ServiceDetails?.[0]?.DestinationName || "",
        };
        if (item?.Service?.ServiceType === "Hotel") {
          const roomBedTypeArray =
            item?.Service?.ServiceDetails[0]?.ItemUnitCost?.RoomBedType;
          const mapRoomName = (name) => {
            if (!name) return null;
            if (name.includes("DBL")) return "DBL";
            if (name.includes("SGL")) return "SGL";
            if (name.includes("TPL")) return "TPL";
            if (name.includes("TWIN")) return "TWIN";
            return null;
          };
          const roomCostObj = roomBedTypeArray?.reduce((acc, item) => {
            const shortName = mapRoomName(item.RoomBedTypeName);
            acc[shortName] = item.RoomCost;
            return acc;
          }, {});
          const roomPaxObj = queryJson?.reduce((acc, item) => {
            const shortName = mapRoomName(item.RoomType);
            if (shortName && item.NoOfPax) {
              acc[shortName] = Number(item.NoOfPax);
            }
            return acc;
          }, {});
          form.regNo = "";
          form.entity = "Pax";
          form.fromDate =
            item?.Service?.ServiceDetails[0]?.TimingDetails?.ItemFromDate ||
            null;
          form.toDate =
            item?.Service?.ServiceDetails[0]?.TimingDetails?.ItemToDate ||
            form.fromDate;
          form.roomType = "Deluxe";
          form.mealPlan = "CP";
          form.dbl = roomPaxObj?.DBL;
          form.dblAmount = roomCostObj?.DBL;
          form.twn = roomPaxObj?.TWIN;
          form.twnAmount = roomCostObj?.TWIN;
          form.sgl = roomPaxObj?.SGL;
          form.sglAmount = roomCostObj?.SGL;
          form.tpl = roomPaxObj?.TPL;
          form.tplAmount = roomCostObj?.TPL;
          form.totalAmount = 0;
          form.altst = "";
          form.dated = "";
          form.refno = "";
          form.remarks = "";
          form.DestinationName = item?.Service?.DestinationName;
          form.DestinationId = item?.Service?.DestinationId;
        }
        return form;
      });
      console.log(initialFormData, "initialFormData");
      setReservationFormData(initialFormData);
      setSelectedRows(reservationList.map((_, index) => index));
      setConfirmStatusForm(initialFormData);
      setIsDataLoad(true);
    }
  }, [
    reservationList,
    confirmedReservationsList,
    quotationDataOperation,
    queryJson,
  ]);

  const parseYYYYMMDD = (str) => {
    if (typeof str !== "string") return null;
    const date = moment(str, "YYYY-MM-DD").toDate();
    return isNaN(date.getTime()) ? null : date;
  };

  const handleConfirmDate = (date, index) => {
    if (!date || isNaN(date.getTime())) {
      setReservationFormData((prevArr) => {
        const newArr = [...prevArr];
        newArr[index] = { ...newArr[index], ConfirmationDate: null };
        return newArr;
      });
      return;
    }
    const formattedDate = moment(date).format("YYYY-MM-DD");
    setReservationFormData((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = { ...newArr[index], ConfirmationDate: formattedDate };
      return newArr;
    });
  };

  const handleCutoffCalender = (date, index) => {
    if (!date || isNaN(date.getTime())) {
      setReservationFormData((prevArr) => {
        const newArr = [...prevArr];
        newArr[index] = { ...newArr[index], CutOfDate: null };
        return newArr;
      });
      return;
    }
    const formattedDate = moment(date).format("YYYY-MM-DD");
    setReservationFormData((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = { ...newArr[index], CutOfDate: formattedDate };
      return newArr;
    });
  };

  const handleFromDate = (date, index) => {
    setReservationFormData((prevData) => {
      const updatedData = [...prevData];
      updatedData[index] = {
        ...updatedData[index],
        fromDate: date ? date.toISOString().split("T")[0] : null,
      };
      return updatedData;
    });
  };

  const handleToDate = (date, index) => {
    setReservationFormData((prevData) => {
      const updatedData = [...prevData];
      updatedData[index] = {
        ...updatedData[index],
        toDate: date ? date.toISOString().split("T")[0] : null,
      };
      return updatedData;
    });
  };

  const handleSelectChange = (name, value, index) => {
    setReservationFormData((prevData) => {
      const updatedData = [...prevData];
      updatedData[index] = { ...updatedData[index], [name]: value };
      return updatedData;
    });
  };

  const calculateTotal = (index) => {
    const f = reservationFormData[index];
    if (!f) return 0;
    return (
      (f.dbl || 0) * (f.dblAmount || 0) +
      (f.twn || 0) * (f.twnAmount || 0) +
      (f.sgl || 0) * (f.sglAmount || 0) +
      (f.tpl || 0) * (f.tplAmount || 0)
    );
  };

  const handleFilter = (selectedOpt) => {
    const { type, opt } = selectedOpt;
    switch (type) {
      case "status":
        setStatus(opt);
        break;
      case "service":
        setService(opt);
        break;
      case "supplier":
        setSupplier(opt);
        break;
      default:
    }
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    setReservationFormData((prevData) => {
      const updatedData = [...prevData];
      updatedData[index] = {
        ...updatedData[index],
        [name]: value === "" ? "" : Number(value),
      };
      return updatedData;
    });
  };

  const handleCheckboxChange = (index) => {
    setSelectedRows((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      }
      return [...prev, index];
    });
  };

  const handleFilterSearch = () => {
    if (!service && !supplier) {
      setReservationList(copyReservationList);
      return;
    }
    const filterList = copyReservationList.filter((item) => {
      let matchesService = true;
      let matchesSupplier = true;
      if (service) {
        matchesService = item.Service?.ServiceType === service.label;
      }
      if (supplier) {
        matchesSupplier = item.Service?.ServiceDetails?.some(
          (detail) =>
            detail.ItemSupplierDetail?.ItemSupplierName === supplier.label
        );
      }
      return matchesService && matchesSupplier;
    });
    setReservationList(filterList);
  };

  const loadOptions = async (inputValue, callback) => {
    try {
      const { data } = await axiosOther.post("supplierlist", {
        Name: inputValue,
      });
      const options = data?.DataList?.map((item) => ({
        value: item?.id,
        label: item?.Name,
      }));
      callback(options);
    } catch (err) {
      console.error("Error loading options:", err);
      callback([]);
    }
  };

  const statusOptions = [
    ...status_array.map((status, index) => ({
      value: index,
      label: status,
    })),
  ];

  const dispatch = useDispatch();

  const handleSendReservationRequest = (data) => {
    dispatch({
      type: "SET_SERVICE_DATA",
      payload: data,
    });
    dispatch({
      type: "CHANGE_TAB",
      payload: "communication",
    });
  };

  const statusOptionsNew = [
    "Pending",
    "Cancelled",
    "Requested",
    "Confirmed",
    "Rejected",
    "Waitlist",
  ];

  const statusColorsNew = {};

  const handleRowClickNew = (index) => {
    setEditIndex(index);
  };

  const addRow = () => {
    const newItem = {
      Service: {
        ServiceType: "Hotel",
        ServiceUniqueId: Math.random().toString(36).substr(2, 9),
        ServiceId: "",
        ServiceDetails: [
          {
            ItemName: "",
            ItemSupplierDetail: {
              ItemSupplierId: "",
              ItemSupplierName: "",
            },
            TimingDetails: {
              ItemFromDate: null,
              ItemToDate: null,
            },
          },
        ],
      },
      isExternal: true,
    };

    const newForm = {
      ServiceUniqueId: newItem.Service.ServiceUniqueId,
      Day: "",
      id: quotationDataOperation?.QueryId || queryQuotation?.QueryID,
      QuotationNumber:
        quotationDataOperation?.QuotationNumber || queryQuotation?.QoutationNum,
      ServiceId: "",
      ServiceType: "Hotel",
      SupplierId: "",
      SupplierName: "",
      ReservationStatus: "Pending",
      ConfirmationNo: "",
      ConfirmationDate: null,
      CutOfDate: null,
      ConfirmedBy: "",
      ConfirmedNote: "",
      VehicleType: "",
      StartTime: "",
      EndTime: "",
      PickupTime: "",
      DropTime: "",
      PickupAddress: "",
      DropAddress: "",
      ApproveBy: "",
      DestinationId: "",
      DestinationName: "",
      regNo: "",
      entity: "Pax",
      fromDate: null,
      toDate: null,
      roomType: "",
      mealPlan: "",
      dbl: "",
      dblAmount: "",
      twn: "",
      twnAmount: "",
      sgl: "",
      sglAmount: "",
      tpl: "",
      tplAmount: "",
      totalAmount: 0,
      altst: "",
      dated: "",
      refno: "",
      remarks: "",
    };

    setReservationList([...reservationList, newItem]);
    setReservationFormData([...reservationFormData, newForm]);
    setSelectedRows([...selectedRows, reservationList.length]);
  };

  const removeRow = () => {
    const externalHotelIndices = reservationList
      .map((item, index) => ({ item, index }))
      .filter(
        ({ item }) => item.Service.ServiceType === "Hotel" && item.isExternal
      )
      .map(({ index }) => index);

    if (externalHotelIndices.length > 0) {
      const lastExternalHotelIndex =
        externalHotelIndices[externalHotelIndices.length - 1];
      setReservationList(
        reservationList.filter((_, i) => i !== lastExternalHotelIndex)
      );
      setReservationFormData(
        reservationFormData.filter((_, i) => i !== lastExternalHotelIndex)
      );
      setSelectedRows(
        selectedRows
          .filter((i) => i !== lastExternalHotelIndex)
          .map((i) => (i > lastExternalHotelIndex ? i - 1 : i))
      );
    } else {
      notifyError("There is no alternate data");
    }
  };

  const handleDayChange = (e, index) => {
    const selectedDay = parseInt(e.target.value, 10);
    console.log(selectedDay, "selectedDay84747");
    setReservationFormData((prevData) => {
      const updatedData = [...prevData];
      updatedData[index] = { ...updatedData[index], Day: selectedDay };
      const matchingHotelIndex = reservationList.findIndex(
        (item) =>
          item?.Day === selectedDay &&
          item?.Service?.ServiceType === "Hotel" &&
          !item.isExternal
      );

      if (matchingHotelIndex !== -1 && matchingHotelIndex !== index) {
        const matchingHotel = reservationList[matchingHotelIndex];
        const matchingForm = reservationFormData[matchingHotelIndex];
        console.log(matchingHotel, "VCHGDG8777");
        updatedData[index] = {
          ...updatedData[index],
          ServiceId: matchingHotel.Service.ServiceId || "",
          SupplierId:
            matchingHotel.Service.ServiceDetails[0]?.ItemSupplierDetail
              ?.ItemSupplierId || "",
          SupplierName:
            matchingHotel.Service.ServiceDetails[0]?.ItemSupplierDetail
              ?.ItemSupplierName || "",
          DestinationName: matchingHotel.Service.DestinationName || "",
          ServiceUniqueId: matchingHotel?.Service?.ServiceUniqueId,

          roomType: matchingForm?.roomType || "Deluxe",
          mealPlan: matchingForm?.mealPlan || "CP",
          dbl: matchingForm?.dbl || 0,
          dblAmount: matchingForm?.dblAmount || 0,
          twn: matchingForm?.twn || 0,
          twnAmount: matchingForm?.twnAmount || 0,
          sgl: matchingForm?.sgl || 0,
          sglAmount: matchingForm?.sglAmount || 0,
          tpl: matchingForm?.tpl || 0,
          tplAmount: matchingForm?.tplAmount || 0,
          extraBedA: matchingForm?.extraBedA || 0,
          extraBedAAmount: matchingForm?.extraBedAAmount || 0,
          extraBedC: matchingForm?.extraBedC || 0,
          extraBedCAmount: matchingForm?.extraBedCAmount || 0,
          mealPlanAmount: matchingForm?.mealPlanAmount || 0,
          entity: matchingForm?.entity || "Pax",
          fromDate: matchingForm?.fromDate || null,
          toDate: matchingForm?.toDate || null,
          altst: 1,
        };

        updatedData[matchingHotelIndex] = {
          ...updatedData[matchingHotelIndex],
          altst: 1,
        };

        setReservationList((prevList) => {
          const updatedList = [...prevList];
          updatedList[index] = {
            ...updatedList[index],
            Day: selectedDay,
            Service: {
              ...updatedList[index]?.Service,
              ServiceId: matchingHotel.Service.ServiceId || "",
              ServiceType: "Hotel",
              DestinationName: matchingHotel.Service.DestinationName || "",
              MealPlanName: matchingForm?.mealPlan || "",
              RoomCategoryName: matchingForm?.roomType || "",
              ServiceDetails: [
                {
                  ...updatedList[index]?.Service?.ServiceDetails?.[0],
                  ItemName:
                    matchingHotel.Service.ServiceDetails[0]?.ItemName || "",
                  ItemSupplierDetail: {
                    ItemSupplierId:
                      matchingHotel.Service.ServiceDetails[0]
                        ?.ItemSupplierDetail?.ItemSupplierId || "",
                    ItemSupplierName:
                      matchingHotel.Service.ServiceDetails[0]
                        ?.ItemSupplierDetail?.ItemSupplierName || "",
                  },
                  TimingDetails: {
                    ItemFromDate: matchingForm?.fromDate || null,
                    ItemToDate: matchingForm?.toDate || null,
                  },
                  ItemUnitCost: {
                    RoomBedType: [
                      {
                        RoomBedTypeName: "DBL",
                        RoomCost: matchingForm?.dblAmount || 0,
                      },
                      {
                        RoomBedTypeName: "TWIN",
                        RoomCost: matchingForm?.twnAmount || 0,
                      },
                      {
                        RoomBedTypeName: "SGL",
                        RoomCost: matchingForm?.sglAmount || 0,
                      },
                      {
                        RoomBedTypeName: "TPL",
                        RoomCost: matchingForm?.tplAmount || 0,
                      },
                    ],
                    MealType: [
                      {
                        MealTypeName: matchingForm?.mealPlan || "CP",
                        MealCost: matchingForm?.mealPlanAmount || 0,
                      },
                    ],
                  },
                },
              ],
            },
          };
          return updatedList;
        });
      } else {
        updatedData[index] = {
          ...updatedData[index],
          ServiceId: "",
          SupplierId: "",
          SupplierName: "",
          DestinationName: "",
          roomType: "",
          mealPlan: "",
          dbl: 0,
          dblAmount: 0,
          twn: 0,
          twnAmount: 0,
          sgl: 0,
          sglAmount: 0,
          tpl: 0,
          tplAmount: 0,
          extraBedA: 0,
          extraBedAAmount: 0,
          extraBedC: 0,
          extraBedCAmount: 0,
          mealPlanAmount: 0,
          entity: "",
          fromDate: null,
          toDate: null,
          altst: 1,
        };
      }
      return updatedData;
    });
  };

  const handleSubmit = async () => {
    let payload = reservationFormData.filter((_, index) =>
      selectedRows.includes(index)
    );
    if (isItineraryRequest) {
      payload = payload.map((p) => ({ ...p, ItineraryRequest: true }));
    }
    try {
      const url = "add-reservation-quotation";
      const { data } = await axiosOther.post(url, payload);
      if (data?.Success) {
        notifySuccess(
          data?.Message || "ReservationRequest added successfully."
        );
        await getAPIToServer();
        handleNext();
      }
    } catch (error) {
      notifyError(error.message);
      console.error(error);
    }
  };

  const handleSave = async (row, index, type) => {
    const payload = [reservationFormData[index]];
    try {
      const url = "add-reservation-quotation";
      const { data } = await axiosOther.post(url, payload);
      if (data?.Success) {
        notifySuccess(data?.Message || "Added Successfully");
        await getAPIToServer();
      }
    } catch (error) {
      notifyError(error.message);
      console.error(error);
    }
  };

  const handleSaveHotel = async (row, index, type) => {
    console.log(row, "row47474");

    return;
    const form = reservationFormData[index];
    const reservation = reservationList[index];
    const payload = [
      {
        id: form?.id,
        QuatationNo: form?.QuotationNumber || null,
        DayType:
          form?.DayType || reservation?.Service?.ServiceMainType || "Escort",
        DayNo: form?.Day || reservation?.Day || null,
        AlternateService: form?.altst ? "Alternate" : "",
        Destination:
          form?.Destination || reservation?.Service?.DestinationId || null,
        HotelCategory:
          form?.HotelCategory || reservation?.Service?.HotelCategoryId || null,
        RoomCategory:
          form?.RoomCategory || reservation?.Service?.RoomCategoryId || null,
        MealPlan: form?.MealPlan || reservation?.Service?.MealPlanId || null,
        OverNight: form?.OverNight || reservation?.Service?.OvernightId || null,
        ServiceId: form?.ServiceId || reservation?.Service?.ServiceId || null,
        ItemFromDate:
          form?.fromDate ||
          reservation?.Service?.ServiceDetails[0]?.TimingDetails
            ?.ItemFromDate ||
          null,
        ItemFromTime:
          form?.ItemFromTime ||
          reservation?.Service?.ServiceDetails[0]?.TimingDetails
            ?.ItemFromTime ||
          "",
        ItemToDate:
          form?.toDate ||
          reservation?.Service?.ServiceDetails[0]?.TimingDetails?.ItemToDate ||
          null,
        ItemToTime:
          form?.ItemToTime ||
          reservation?.Service?.ServiceDetails[0]?.TimingDetails?.ItemToTime ||
          "",
        ServiceUniqueId:
          form?.ServiceUniqueId ||
          reservation?.Service?.ServiceUniqueId ||
          null,
        Supplier:
          form?.Supplier ||
          reservation?.Service?.ServiceDetails[0]?.ItemSupplierDetail
            ?.ItemSupplierId ||
          null,
        PaxSlab:
          form?.PaxSlab ||
          reservation?.Service?.PaxDetails?.TotalNoOfPax?.toString() ||
          "0",
        ServiceMainType:
          form?.ServiceMainType ||
          reservation?.Service?.ServiceMainType ||
          "No",
        RoomBedType:
          form?.RoomBedType ||
          (
            reservation?.Service?.ServiceDetails[0]?.ItemUnitCost
              ?.RoomBedType || []
          ).map((room) => ({
            RoomBedTypeId: room.RoomBedTypeId.toString(),
            RoomCost: room.RoomCost.toString(),
          })) ||
          [],
        MealType:
          form?.MealType ||
          (
            reservation?.Service?.ServiceDetails[0]?.ItemUnitCost?.MealType ||
            []
          ).map((meal) => ({
            MealTypeId: meal.MealTypeId.toString(),
            MealCost: meal.MealCost.toString(),
          })) ||
          [],
        PaxInfo: form?.PaxInfo || {
          Adults:
            reservation?.Service?.PaxDetails?.PaxInfo?.Adults?.toString() ||
            "0",
          Child:
            reservation?.Service?.PaxDetails?.PaxInfo?.Child?.toString() || "0",
          Infant:
            reservation?.Service?.PaxDetails?.PaxInfo?.Infant?.toString() ||
            "0",
          Escort:
            reservation?.Service?.PaxDetails?.PaxInfo?.Escort?.toString() ||
            "0",
        },
        ForiegnerPaxInfo: form?.ForiegnerPaxInfo || {
          Adults:
            reservation?.Service?.PaxDetails?.ForiegnerPaxInfo?.Adults?.toString() ||
            "0",
          Child:
            reservation?.Service?.PaxDetails?.ForiegnerPaxInfo?.Child?.toString() ||
            "0",
          Infant:
            reservation?.Service?.PaxDetails?.ForiegnerPaxInfo?.Infant?.toString() ||
            "0",
          Escort:
            reservation?.Service?.PaxDetails?.ForiegnerPaxInfo?.Escort?.toString() ||
            "0",
        },
      },
    ];
    try {
      const url = "update-alternate-quotation-hotel";
      const { data } = await axiosOther.post(url, payload);
      if (data?.status === 1) {
        notifySuccess(data?.Message || "Added Successfully");
        await getAPIToServer();
      }
    } catch (error) {
      notifyError(error.message);
      console.error(error);
    }
  };

  const getVehicleName = (id) => {
    const vehicle = vehicleTypeList?.find(
      (v) => v.value == id || v.label == id
    );
    return vehicle?.label || id;
  };

  const getStatusTooltip = (serviceUniqueId) => {
    const statuses =
      confirmedReservationsList[serviceUniqueId]
        ?.map((res) => res.ReservationStatus)
        .join(", ") || "No status available";
    return (
      <Tooltip id={`status-tooltip-${serviceUniqueId}`}>{statuses}</Tooltip>
    );
  };

  const getStatusIcon = (status) => {
    if (status === "Confirmed") {
      return <i className="fa-solid fa-check" style={{ color: "green" }} />;
    } else if (status === "Cancelled" || status === "Rejected") {
      return <i className="fa-solid fa-times" style={{ color: "red" }} />;
    }
    return null;
  };

  const handleReservationRequest = async (selectedService) => {
    console.log(selectedService, "VCUEYHHDHHDHDD");
    try {
      setIsDataLoading(true);
      const { data } = await axiosOther.post("generateHtml", {
        TemplateName: selectedService?.Service?.ServiceType + "Template",
        QueryId: queryQuotation?.QueryID,
        QuotationNumber: queryQuotation?.QoutationNum,
        CompanyId: companyId,
        TourId: queryQuotation?.TourId,
        ReferenceId: queryQuotation?.ReferenceId,
        Type: selectedService?.Service?.ServiceType,
        HotelId: selectedService?.Service?.ServiceId,
        SupplierId:
          selectedService?.Service?.ServiceDetails?.[0]?.ItemSupplierDetail
            ?.ItemSupplierId,
      });
      if (data?.status) {
        setHtmlString(data?.html);
        setLgShow(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsDataLoading(false);
    }
  };

  const handleReservationRequestForSeries = async (selectedService) => {
    try {
      const storedSeries = localStorage.getItem("Query_Qoutation");
      const seriesData = storedSeries ? JSON.parse(storedSeries) : null;
      if (!seriesData) {
        console.warn("Series data not found in localStorage");
        return;
      }
      setIsDataLoading(true);
      const { data } = await axiosOther.post("generateHtml", {
        TemplateName: selectedService?.Service?.ServiceType + "SeriesTemplate",
        QueryId: seriesData?.QueryID,
        QuotationNumber: seriesData?.QoutationNum,
        CompanyId: companyId,
        SupplierId:
          selectedService?.Service?.ServiceDetails[0]?.ItemSupplierDetail
            ?.ItemSupplierId || "",
        TourId: seriesData?.TourId,
        ReferenceId: seriesData?.ReferenceId,
        Type: selectedService?.Service?.ServiceType + "Series",
        HotelId: "",
      });
      if (data?.status) {
        setHtmlString(data?.html);
        setLgShow(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsDataLoading(false);
    }
  };

  const handleButtonClick = (row) => {
    const storedQueryType = localStorage.getItem("Query_Type_Status");
    const queryTypeData = storedQueryType ? JSON.parse(storedQueryType) : null;
    if (queryTypeData?.QueryType == 3) {
      handleReservationRequestForSeries(row);
    } else {
      handleReservationRequest(row);
    }
  };

  const handleToggle = () => {
    setIsOpen({ ...isOpen, original: !isOpen.original });
  };

  const order = [
    "Hotel",
    "Transport",
    "Monument",
    "Guide",
    "Restaurant",
    "Activity",
    "Flight",
    "Train",
    "AdditionalService",
  ];

  const orderedGroups = useMemo(() => {
    const groups = {};
    reservationList.forEach((item, index) => {
      const type = item.Service.ServiceType;
      if (!groups[type]) groups[type] = [];
      groups[type].push({ item, index });
    });
    const ordered = order
      .filter((t) => groups[t])
      .map((t) => ({ type: t, items: groups[t] }));
    const otherTypes = Object.keys(groups).filter((t) => !order.includes(t));
    otherTypes.forEach((t) => ordered.push({ type: t, items: groups[t] }));
    return ordered;
  }, [reservationList]);

  const handleUpdateHotelData = async () => {
    // Find indices of new hotel rows (isExternal === true)
    const newHotelIndices = reservationList
      .map((item, idx) =>
        item.Service.ServiceType === "Hotel" && item.isExternal ? idx : null
      )
      .filter((idx) => idx !== null);

    const newHotelRowsData = newHotelIndices.map(
      (idx) => reservationFormData[idx]
    );

    const updatedData = newHotelRowsData?.map((service) => {
      const newData = reservationList?.find(
        (list) => list?.Service?.ServiceUniqueId == service?.ServiceUniqueId
      );

      const findIdAndQuatationNo = reservationFormData?.find(
        (list) => list?.ServiceUniqueId == service?.ServiceUniqueId
      );

      const roomMapping = [
        { type: "sgl", id: "1", amountKey: "sglAmount" },
        { type: "dbl", id: "2", amountKey: "dblAmount" },
        { type: "twn", id: "3", amountKey: "twnAmount" },
        { type: "tpl", id: "4", amountKey: "tplAmount" },
      ];

      console.log(newData, "GCBJDD8777", service);
      console.log(findIdAndQuatationNo, "VCBJDKDI9888");
      const roomBedTypeArray = roomMapping
        .filter((m) => service[m.type] > 0)
        .map((m) => ({
          RoomBedTypeId: m.id,
          RoomCost: String(service[m.amountKey] ?? 0),
        }));

      console.log(service?.fromDate, "roomBedTypeArray4646");

      const mealPlan = newData?.Service?.TotalCosting?.[0]?.HotelMealType?.map(
        (list) => {
          return {
            MealTypeId: list?.id,
            MealCost: list?.ServiceCost,
          };
        }
      );

      const sigleData = {
        id: findIdAndQuatationNo?.id,
        QuatationNo: findIdAndQuatationNo?.QuotationNumber,
        DayType: "Main",
        DayNo: newData?.Day,
        AlternateService: "Alternate",
        DayUniqueId: newData?.DayUniqueId,
        Destination: newData?.Service?.DestinationId,
        HotelCategory: newData?.Service?.HotelCategoryId,
        RoomCategory: newData?.Service?.RoomCategoryId,
        MealPlan: newData?.Service?.MealPlanId,
        OverNight: newData?.Service?.OvernightId,
        ServiceId: newData?.Service?.ServiceId,
        ItemFromDate: service?.fromDate,
        ItemFromTime: "",
        ItemToDate: service?.toDate,
        ServiceUniqueId: "",
        Supplier:
          newData?.Service?.ServiceDetails?.[0]?.ItemSupplierDetail
            ?.ItemSupplierId,
        ItemToTime: "",
        PaxSlab: "",
        ServiceMainType: "No",
        RateUniqueId: "",
        RoomBedType: roomBedTypeArray,
        MealType: mealPlan,
        HotelRoomBedType: [],
        PaxInfo: newData?.PaxDetails?.PaxInfo,
        ForiegnerPaxInfo: newData?.PaxDetails?.ForiegnerPaxInfo,
      };
      return sigleData;
    });
    console.log(updatedData, "newHotelRowsData");

    try {
      const url = "update-alternate-quotation-hotel";
      const { data } = await axiosOther.post(url, updatedData);
      if (data?.status === 1) {
        notifySuccess(data?.Message || "Added Successfully");
        await getAPIToServer();
      }
    } catch (error) {
      notifyError(error.message);
      console.error(error);
    }
  };

  return (
    <div className="Reservationrequest m-0 p-0">
      {isDataLoading ? <IsDataLoading /> : ""}

      <Row>
        <Col style={{ padding: "0px", margin: "0px" }} md={12}>
          <Card>
            <div className="heading mb-2 mx-1 border-0 p-1">
              <div
                className="row justify-content-between align-item-center itinerary-head-bg px-1 py-2 "
                style={{ cursor: "pointer" }}
                onClick={handleToggle}
              >
                <div className="col-lg-2 col-md-6  fs-12 d-flex align-items-center justify-content-start">
                  <label className="fs-12 querydetails text-grey">
                    Quotations :
                  </label>
                  <span className="fs-12 ms-1 querydetails text-white">
                    {quotationDataOperation?.QuotationNumber}
                  </span>
                </div>

                <div className="col-lg-3 d-flex justify-content-end align-item-center gap-3">
                  {/* Submit button */}
                  <button
                    className="btn btn-primary btn-custom-size"
                    onClick={handleSubmit}
                  >
                    Reservation Send
                  </button>
                  {/* Icon toggle */}
                  <span className="cursor-pointer fs-5">
                    {!isOpen.original ? (
                      <FaChevronCircleDown
                        className="text-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsOpen({ ...isOpen, original: !isOpen.original });
                        }}
                      />
                    ) : (
                      <FaChevronCircleUp
                        className="text-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsOpen({ ...isOpen, original: !isOpen.original });
                        }}
                      />
                    )}
                  </span>
                </div>
              </div>
              <div className="row align-items-center mt-1">
                {/* Service Type */}
                <div className="col-lg-2 col-md-6 mb-3">
                  <label className="querydetails text-grey">Service Type</label>
                  <Select
                    name="service"
                    value={service}
                    placeholder="Select Service"
                    onChange={(selectedOption) =>
                      handleFilter({ type: "service", opt: selectedOption })
                    }
                    options={serviceList}
                    isSearchable
                    isClearable
                    todayButton="Today"
                    styles={customStyles}
                    className="customSelectLightTheame"
                    classNamePrefix="custom"
                  />
                </div>

                {isOpen.original && (
                  <>
                    {/* Suppliers */}
                    <div className="col-lg-2 col-md-6 mb-3">
                      <label className="querydetails text-grey">
                        Suppliers
                      </label>
                      <AsyncSelect
                        cacheOptions
                        defaultOptions={supplierList}
                        loadOptions={loadOptions}
                        placeholder="Select Supplier"
                        onChange={(selectedOption) =>
                          handleFilter({
                            type: "supplier",
                            opt: selectedOption,
                          })
                        }
                        value={supplier}
                        styles={customStyles}
                        className="customSelectLightTheame"
                        classNamePrefix="custom"
                        isClearable
                        todayButton="Today"
                        isACTION
                      />
                    </div>

                    {/* Status */}
                    <div className="col-lg-2 col-md-6 mb-3">
                      <label className="querydetails text-grey">Status</label>
                      <Select
                        name="status"
                        value={status}
                        onChange={(selectedOption) =>
                          handleFilter({ type: "status", opt: selectedOption })
                        }
                        options={statusOptions}
                        isSearchable
                        isClearable
                        todayButton="Today"
                        styles={customStyles}
                        className="customSelectLightTheame"
                        classNamePrefix="custom"
                      />
                    </div>
                  </>
                )}
                {/* Search Button */}
                <div className="col-lg-1 col-md-12">
                  <button
                    onClick={handleFilterSearch}
                    className="btn btn-primary btn-custom-size"
                  >
                    Search
                  </button>
                </div>
                <div className="col-lg-2 col-md-6 mb-3 mt-2">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="showTableCheckbox"
                    checked={isTableVisible}
                    onChange={(e) => setIsTableVisible(e.target.checked)}
                  />
                  {/* <label className="form-check-label" htmlFor="showTableCheckbox">
                    Show Table
                  </label> */}
                </div>
              </div>
              {isOpen.original && (
                <>
                  {/* Table */}
                  <div className="col-12">
                    <div className="headingtable mt-2 p-1 col-lg-12">
                      <div className="row d-flex border p-1 headingss">
                        <div className="col font-second-rem">Suppliers</div>
                        <div className="col font-second-rem">Services</div>
                        <div className="col font-second-rem">Pending</div>
                        <div className="col font-second-rem">Cancelled</div>
                        <div className="col font-second-rem">Requested</div>
                        <div className="col font-second-rem">Confirmed</div>
                        <div className="col font-second-rem">Rejected</div>
                        <div className="col font-second-rem">Waitlist</div>
                      </div>
                      <div className="row border p-2 text-between">
                        <div className="content col font-second-rem">0</div>
                        <div className="content col font-second-rem">
                          {reservationList.length}
                        </div>
                        <div className="content col font-second-rem">0</div>
                        <div className="content col font-second-rem">0</div>
                        <div className="content col font-second-rem">0</div>
                        <div className="content col font-second-rem">0</div>
                        <div className="content col font-second-rem">0</div>
                        <div className="content col font-second-rem">0</div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            <Toaster />
            <Card.Body className="m-0 p-0 fullbody">
              {isTableVisible && (
                <PerfectScrollbar options={{ suppressScrollY: true }}>
                  <table
                    className="table table-bordered itinerary-table mt-2"
                    style={{ fontSize: "0.8em" }}
                  >
                    <thead>
                      <tr>
                        <th></th>
                        <th>S No</th>
                        <th>Req No</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Service By</th>
                        <th>City</th>
                        <th>Service Provider</th>
                        <th>Status</th>
                        <th>Dated</th>
                        <th>Confirmation No</th>
                        <th>Remarks</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {demoDataState.map((row, index) => (
                        <tr
                          key={index}
                          style={{ cursor: "pointer" }}
                          onClick={() => handleEditTableRow(index)}
                        >
                          <td>
                            <div className="icon-container">
                              <button
                                type="button"
                                className="btn btn-primary"
                                style={{
                                  padding: "0 3px",
                                  borderRadius: "4px",
                                  fontSize: "11px",
                                }}
                              >
                                <span>
                                  <i class="fa-regular fa-paper-plane"></i>
                                </span>
                              </button>
                              <p class="tooltip-text py-1 px-1">Send</p>
                            </div>
                          </td>
                          <td>{row.sNo}</td>
                          <td>
                            {editTableRowIndex === index ? (
                              <input
                                className="formControl1 width50px"
                                style={{ fontSize: "0.6em" }}
                                name="reqNo"
                                value={row.reqNo}
                                onChange={(e) =>
                                  handleTableInputChange(e, index)
                                }
                              />
                            ) : (
                              <span>{row.reqNo}</span>
                            )}
                          </td>
                          <td>
                            {editTableRowIndex === index ? (
                              <DatePicker
                                popperProps={{ strategy: "fixed" }}
                                className="formControl1 width50px"
                                selected={row.from ? new Date(row.from) : null}
                                onChange={(date) =>
                                  handleTableDateChange(date, "from", index)
                                }
                                dateFormat="yyyy-MM-dd"
                                placeholderText="YYYY-MM-DD"
                              />
                            ) : (
                              <span>
                                {handleDateFormatChange(new Date(row.from))}
                              </span>
                            )}
                          </td>
                          <td>
                            {editTableRowIndex === index ? (
                              <DatePicker
                                popperProps={{ strategy: "fixed" }}
                                className="formControl1 width50px"
                                selected={row.to ? new Date(row.to) : null}
                                onChange={(date) =>
                                  handleTableDateChange(date, "to", index)
                                }
                                dateFormat="yyyy-MM-dd"
                                placeholderText="YYYY-MM-DD"
                              />
                            ) : (
                              <span>
                                {handleDateFormatChange(new Date(row.to))}
                              </span>
                            )}
                          </td>
                          <td>
                            {editTableRowIndex === index ? (
                              <input
                                className="formControl1 width50px"
                                style={{ fontSize: "0.6em" }}
                                name="serviceBy"
                                value={row.serviceBy}
                                onChange={(e) =>
                                  handleTableInputChange(e, index)
                                }
                              />
                            ) : (
                              <span>{row.serviceBy}</span>
                            )}
                          </td>
                          <td>
                            {editTableRowIndex === index ? (
                              <input
                                className="formControl1 width50px"
                                style={{ fontSize: "0.6em" }}
                                name="city"
                                value={row.city}
                                onChange={(e) =>
                                  handleTableInputChange(e, index)
                                }
                              />
                            ) : (
                              <span>{row.city}</span>
                            )}
                          </td>
                          <td>
                            {editTableRowIndex === index ? (
                              <input
                                className="formControl1 width50px"
                                style={{ fontSize: "0.6em" }}
                                name="serviceProvider"
                                value={row.serviceProvider}
                                onChange={(e) =>
                                  handleTableInputChange(e, index)
                                }
                              />
                            ) : (
                              <span>{row.serviceProvider}</span>
                            )}
                          </td>
                          <td>
                            {editTableRowIndex === index ? (
                              <select
                                className="formControl1 width50px"
                                style={{ fontSize: "0.6em" }}
                                name="status"
                                value={row.status}
                                onChange={(e) =>
                                  handleTableInputChange(e, index)
                                }
                              >
                                {status_array.map((status) => (
                                  <option key={status} value={status}>
                                    {status}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <span>{row.status}</span>
                            )}
                          </td>
                          <td>
                            {editTableRowIndex === index ? (
                              <DatePicker
                                popperProps={{ strategy: "fixed" }}
                                className="formControl1 width50px"
                                selected={
                                  row.dated ? new Date(row.dated) : null
                                }
                                onChange={(date) =>
                                  handleTableDateChange(date, "dated", index)
                                }
                                dateFormat="yyyy-MM-dd"
                                placeholderText="YYYY-MM-DD"
                              />
                            ) : (
                              <span>
                                {handleDateFormatChange(new Date(row.dated))}
                              </span>
                            )}
                          </td>
                          <td>
                            {editTableRowIndex === index ? (
                              <input
                                className="formControl1 width50px"
                                style={{ fontSize: "0.6em" }}
                                name="confirmationNo"
                                value={row.confirmationNo}
                                onChange={(e) =>
                                  handleTableInputChange(e, index)
                                }
                              />
                            ) : (
                              <span>{row.confirmationNo}</span>
                            )}
                          </td>
                          <td>
                            {editTableRowIndex === index ? (
                              <input
                                className="formControl1 width50px"
                                style={{ fontSize: "0.6em" }}
                                name="remarks"
                                value={row.remarks}
                                onChange={(e) =>
                                  handleTableInputChange(e, index)
                                }
                              />
                            ) : (
                              <span>{row.remarks}</span>
                            )}
                          </td>
                          <td className="d-flex gap-1 justify-content-evenly align-items-center">
                            <div className="icon-container">
                              <button
                                type="button"
                                className="btn btn-primary"
                                style={{
                                  padding: "0 3px",
                                  borderRadius: "4px",
                                  fontSize: "11px",
                                }}
                                onClick={() => handleSaveTableRow(index)}
                              >
                                <i className="fa-solid fa-floppy-disk fs-4"></i>
                              </button>
                              <p className="tooltip-text py-1 px-1">Save</p>
                            </div>
                            <div className="icon-container">
                              <button
                                type="button"
                                className="btn btn-primary"
                                style={{
                                  padding: "0 3px",
                                  borderRadius: "4px",
                                  fontSize: "11px",
                                }}
                                onClick={() => handleRowClick(index)}
                              >
                                <i className="fa-solid fa-circle-info fs-4"></i>
                              </button>
                              <p className="tooltip-text py-1 px-1">Details</p>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </PerfectScrollbar>
              )}

              {/* Modal to show clicked row index */}
              <Modal
                show={isModalOpen}
                onHide={() => setIsModalOpen(false)}
                size="lg"
              >
                <Modal.Header closeButton>
                  <Modal.Title>Row Details</Modal.Title>
                </Modal.Header>
                <Modal.Body className="px-3 py-2">
                  {/* <p>Clicked Row Index: {clickedRowIndex}</p> */}
                  <table
                    className="table table-bordered itinerary-table mt-2"
                    style={{ fontSize: "0.8em" }}
                  >
                    <thead>
                      <tr>
                        <th>S No</th>
                        <th>From</th>
                        <th>To</th>
                        <th>City</th>
                        <th>Service</th>
                        <th>Service Details</th>
                        <th>Pax</th>
                        <th>Amount</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {demoData2.map((row, index) => (
                        <tr key={index} style={{ cursor: "pointer" }}>
                          <td>{row.sNo}</td>
                          <td>{row.from}</td>
                          <td>{row.to}</td>
                          <td>{row.city}</td>
                          <td>{row.service}</td>
                          <td>{row.serviceDetail}</td>
                          <td>{row.pax}</td>
                          <td>{row.amount}</td>
                          <td>{row.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Modal.Body>
                <Modal.Footer>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Close
                  </button>
                </Modal.Footer>
              </Modal>

              <div className="px-2">
                {orderedGroups.map((group, index) => (
                  <div key={group.type || index}>
                    <div className="d-flex justify-content-between align-items-center">
                      <h4>{group.type}</h4>
                      {group?.type === "Hotel" && (
                        <div className="d-flex gap-2 ">
                          <div className="d-flex gap-1 align-items-center">
                            <span>SGL</span>
                            <input
                              className="formControl1 width50px"
                              name="DestinationName"
                              style={{ fontSize: "0.6em" }}
                            />
                          </div>
                          <div className="d-flex gap-1 align-items-center">
                            <span>DBL</span>
                            <input
                              className="formControl1 width50px "
                              name="DestinationName"
                              style={{ fontSize: "0.6em" }}
                            />
                          </div>
                          <div className="d-flex gap-1 align-items-center">
                            <span>TWIN</span>
                            <input
                              className="formControl1 width50px "
                              name="DestinationName"
                              style={{ fontSize: "0.6em" }}
                            />
                          </div>
                          <div className="d-flex gap-1 align-items-center">
                            <span>TPL</span>
                            <input
                              className="formControl1 width50px"
                              name="DestinationName"
                              style={{ fontSize: "0.6em" }}
                            />
                          </div>
                          <button className="btn btn-primary btn-custom-size">
                            Apply To All
                          </button>
                        </div>
                      )}
                    </div>
                    <PerfectScrollbar options={{ suppressScrollY: true }}>
                      <table className="table table-bordered itinerary-table mt-2">
                        <thead>
                          <tr className="text-center ">
                            <th className="p-1" style={{ minWidth: "6px" }}>
                              <div className="form-check check-sm d-flex align-items-center">
                                <input
                                  type="checkbox"
                                  className="form-check-input height-em-1 width-em-1"
                                  checked={group.items.every(({ index }) =>
                                    selectedRows.includes(index)
                                  )}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedRows((prev) => [
                                        ...new Set([
                                          ...prev,
                                          ...group.items.map(
                                            ({ index }) => index
                                          ),
                                        ]),
                                      ]);
                                    } else {
                                      setSelectedRows((prev) =>
                                        prev.filter(
                                          (i) =>
                                            !group.items.some(
                                              ({ index }) => index === i
                                            )
                                        )
                                      );
                                    }
                                  }}
                                />
                              </div>
                            </th>
                            {group?.type === "Hotel" ? (
                              <>
                                <th
                                  className="p-1"
                                  style={{ fontSize: "10px", minWidth: "10px" }}
                                >
                                  Status
                                </th>
                                {/* <th className="p-1" style={{ fontSize: "10px", minWidth: "10px" }}>S.No</th>*/}
                                <th
                                  className="p-1"
                                  style={{ fontSize: "10px", minWidth: "20px" }}
                                >
                                  Day No
                                </th>
                                <th
                                  className="p-1"
                                  style={{ fontSize: "10px", minWidth: "20px" }}
                                >
                                  Dest.
                                </th>
                                <th
                                  className="p-1"
                                  style={{ fontSize: "10px", minWidth: "50px" }}
                                >
                                  Entity
                                </th>
                                <th
                                  className="p-1"
                                  style={{ fontSize: "10px", minWidth: "60px" }}
                                >
                                  From Date*
                                </th>
                                <th
                                  className="p-1"
                                  style={{ fontSize: "10px", minWidth: "60px" }}
                                >
                                  To Date*
                                </th>
                                <th
                                  className="p-1"
                                  style={{ fontSize: "10px", minWidth: "60px" }}
                                >
                                  City*
                                </th>
                                <th
                                  className="p-1"
                                  style={{
                                    fontSize: "10px",
                                    minWidth: "100px",
                                  }}
                                >
                                  Hotel*
                                </th>
                                <th
                                  className="p-1"
                                  style={{ fontSize: "10px", minWidth: "60px" }}
                                >
                                  Room Type
                                </th>
                                <th
                                  className="p-1"
                                  style={{ fontSize: "10px", minWidth: "60px" }}
                                >
                                  Meal Plan*
                                </th>
                                <th
                                  className="p-1"
                                  style={{ fontSize: "10px", minWidth: "40px" }}
                                >
                                  DBL
                                </th>
                                <th
                                  className="p-1"
                                  style={{ fontSize: "10px", minWidth: "40px" }}
                                >
                                  Amount
                                </th>
                                <th
                                  className="p-1"
                                  style={{ fontSize: "10px", minWidth: "40px" }}
                                >
                                  TWIN
                                </th>
                                <th
                                  className="p-1"
                                  style={{ fontSize: "10px", minWidth: "40px" }}
                                >
                                  Amount
                                </th>
                                <th
                                  className="p-1"
                                  style={{ fontSize: "10px", minWidth: "40px" }}
                                >
                                  SGL
                                </th>
                                <th
                                  className="p-1"
                                  style={{ fontSize: "10px", minWidth: "40px" }}
                                >
                                  Amount
                                </th>
                                <th
                                  className="p-1"
                                  style={{ fontSize: "10px", minWidth: "40px" }}
                                >
                                  TPL
                                </th>
                                <th
                                  className="p-1"
                                  style={{ fontSize: "10px", minWidth: "40px" }}
                                >
                                  Amount
                                </th>
                                <th
                                  className="p-1"
                                  style={{ fontSize: "10px", minWidth: "60px" }}
                                >
                                  Total Amount
                                </th>
                                <th
                                  className="p-1"
                                  style={{ fontSize: "10px", minWidth: "30px" }}
                                >
                                  Alt
                                </th>
                                <th
                                  className="p-1"
                                  style={{ fontSize: "10px", minWidth: "50px" }}
                                >
                                  Status
                                </th>
                                <th
                                  className="p-1"
                                  style={{ fontSize: "10px", minWidth: "50px" }}
                                >
                                  Dated
                                </th>
                                <th
                                  className="p-1"
                                  style={{ fontSize: "10px", minWidth: "50px" }}
                                >
                                  Ref NO.
                                </th>
                                <th
                                  className="p-1"
                                  style={{ fontSize: "10px", minWidth: "50px" }}
                                >
                                  Remarks
                                </th>
                                <th
                                  className="p-1"
                                  style={{ fontSize: "10px", minWidth: "60px" }}
                                >
                                  Action
                                </th>
                              </>
                            ) : (
                              <>
                                <th
                                  className="p-1"
                                  style={{ fontSize: "10px", minWidth: "50px" }}
                                >
                                  Type
                                </th>
                                <th
                                  className="p-1"
                                  style={{ fontSize: "10px", minWidth: "90px" }}
                                >
                                  Name
                                </th>
                                <th
                                  className="p-1"
                                  style={{ fontSize: "10px", minWidth: "50px" }}
                                >
                                  CheckIn
                                </th>
                                <th
                                  className="p-1"
                                  style={{ fontSize: "10px", minWidth: "50px" }}
                                >
                                  CheckOut
                                </th>
                                <th
                                  className="p-1"
                                  style={{ fontSize: "10px", minWidth: "40px" }}
                                >
                                  Nights
                                </th>
                                <th
                                  className="p-1"
                                  style={{ fontSize: "10px", minWidth: "50px" }}
                                >
                                  Status
                                </th>
                                <th
                                  className="p-1"
                                  style={{ fontSize: "10px", minWidth: "70px" }}
                                >
                                  Confirmation No
                                </th>
                                <th
                                  className="p-1"
                                  style={{ fontSize: "10px", minWidth: "70px" }}
                                >
                                  Confirmation Date
                                </th>
                                <th
                                  className="p-1"
                                  style={{ fontSize: "10px", minWidth: "60px" }}
                                >
                                  Cut Off Date
                                </th>
                                <th
                                  className="p-1"
                                  style={{ fontSize: "10px", minWidth: "60px" }}
                                >
                                  Confirmed By
                                </th>
                                <th
                                  className="p-1"
                                  style={{ fontSize: "10px", minWidth: "70px" }}
                                >
                                  Confirmed Note
                                </th>
                                <th
                                  className="p-1"
                                  style={{ fontSize: "10px", minWidth: "60px" }}
                                >
                                  Vehicle Type
                                </th>
                                <th
                                  className="p-1"
                                  style={{ fontSize: "10px", minWidth: "55px" }}
                                >
                                  Start Time
                                </th>
                                <th
                                  className="p-1"
                                  style={{ fontSize: "10px", minWidth: "55px" }}
                                >
                                  End Time
                                </th>
                                <th
                                  className="p-1"
                                  style={{ fontSize: "10px", minWidth: "55px" }}
                                >
                                  Pickup Time
                                </th>
                                <th
                                  className="p-1"
                                  style={{ fontSize: "10px", minWidth: "55px" }}
                                >
                                  Drop Time
                                </th>
                                <th
                                  className="p-1"
                                  style={{ fontSize: "10px", minWidth: "80px" }}
                                >
                                  Pickup Address
                                </th>
                                <th
                                  className="p-1"
                                  style={{ fontSize: "10px", minWidth: "80px" }}
                                >
                                  Drop Address
                                </th>
                                <th
                                  className="p-1"
                                  style={{ fontSize: "10px", minWidth: "60px" }}
                                >
                                  Action
                                </th>
                              </>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {group.items.map(
                            ({ item: row, index: globalIndex }, localIndex) => (
                              <tr
                                key={globalIndex}
                                onClick={() => handleRowClickNew(globalIndex)}
                                style={{
                                  backgroundColor:
                                    statusColorsNew[
                                      reservationFormData[globalIndex]
                                        ?.ReservationStatus
                                    ] || "transparent",
                                  cursor: "pointer",
                                }}
                              >
                                <td>
                                  <div className="form-check check-sm d-flex align-items-center">
                                    <input
                                      type="checkbox"
                                      className="form-check-input height-em-1 width-em-1"
                                      checked={selectedRows.includes(
                                        globalIndex
                                      )}
                                      onChange={() =>
                                        handleCheckboxChange(globalIndex)
                                      }
                                    />
                                  </div>
                                </td>
                                {group.type === "Hotel" ? (
                                  <>
                                    <td className="text-center">
                                      {getStatusIcon(
                                        reservationFormData[globalIndex]
                                          ?.ReservationStatus
                                      )}
                                    </td>

                                    <td>
                                      {editIndex === globalIndex ? (
                                        <select
                                          className="formControl1 width50px"
                                          name="Day"
                                          style={{ fontSize: "0.6em" }}
                                          value={
                                            reservationFormData[globalIndex]
                                              ?.Day || ""
                                          }
                                          onChange={(e) =>
                                            handleDayChange(e, globalIndex)
                                          }
                                        >
                                          {[
                                            ...new Set(
                                              reservationFormData.map(
                                                (item) => item.Day
                                              )
                                            ),
                                          ]
                                            .sort((a, b) => a - b)
                                            .map((day) => (
                                              <option key={day} value={day}>
                                                {day}
                                              </option>
                                            ))}
                                        </select>
                                      ) : (
                                        <nav style={{ fontSize: "0.6em" }}>
                                          {reservationFormData[globalIndex]
                                            ?.Day || ""}
                                        </nav>
                                      )}
                                    </td>
                                    <td>
                                      {editIndex === globalIndex ? (
                                        <span>
                                          {
                                            reservationFormData[globalIndex]
                                              ?.DestinationName
                                          }
                                        </span>
                                      ) : (
                                        <nav style={{ fontSize: "0.6em" }}>
                                          {
                                            reservationFormData[globalIndex]
                                              ?.DestinationName
                                          }
                                        </nav>
                                      )}
                                    </td>
                                    <td>
                                      {editIndex === globalIndex ? (
                                        <select
                                          className="formControl1 width50px"
                                          name="entity"
                                          style={{ fontSize: "0.6em" }}
                                          value={
                                            reservationFormData[globalIndex]
                                              ?.entity || ""
                                          }
                                          onChange={(e) =>
                                            handleSelectChange(
                                              "entity",
                                              e.target.value,
                                              globalIndex
                                            )
                                          }
                                        >
                                          {["Pax", "Escort"].map((entity) => (
                                            <option key={entity} value={entity}>
                                              {entity}
                                            </option>
                                          ))}
                                        </select>
                                      ) : (
                                        <nav style={{ fontSize: "0.6em" }}>
                                          {reservationFormData[globalIndex]
                                            ?.entity || "Pax"}
                                        </nav>
                                      )}
                                    </td>

                                    <td>
                                      {editIndex === globalIndex ? (
                                        <DatePicker
                                          popperProps={{
                                            strategy: "fixed",
                                          }}
                                          className="formControl1 width50px"
                                          selected={
                                            reservationFormData[globalIndex]
                                              ?.fromDate
                                              ? new Date(
                                                  reservationFormData[
                                                    globalIndex
                                                  ]?.fromDate
                                                )
                                              : null
                                          }
                                          style={{ fontSize: "0.6em" }}
                                          onChange={(date) =>
                                            handleFromDate(date, globalIndex)
                                          }
                                          dateFormat="dd-MM-yyyy"
                                          placeholderText="DD-MM-YYYY"
                                        />
                                      ) : (
                                        <nav style={{ fontSize: "0.6em" }}>
                                          {handleDateFormatChange(
                                            reservationFormData[globalIndex]
                                              ?.fromDate
                                          )}
                                        </nav>
                                      )}
                                    </td>
                                    <td>
                                      {editIndex === globalIndex ? (
                                        <DatePicker
                                          popperProps={{
                                            strategy: "fixed",
                                          }}
                                          className="formControl1 width50px"
                                          selected={
                                            reservationFormData[globalIndex]
                                              ?.toDate
                                              ? new Date(
                                                  reservationFormData[
                                                    globalIndex
                                                  ]?.toDate
                                                )
                                              : null
                                          }
                                          style={{ fontSize: "0.6em" }}
                                          onChange={(date) =>
                                            handleToDate(date, globalIndex)
                                          }
                                          dateFormat="dd-MM-yyyy"
                                          placeholderText="DD-MM-YYYY"
                                        />
                                      ) : (
                                        <nav style={{ fontSize: "0.6em" }}>
                                          {handleDateFormatChange(
                                            reservationFormData[globalIndex]
                                              ?.toDate
                                          )}
                                        </nav>
                                      )}
                                    </td>
                                    <td>
                                      {editIndex === globalIndex ? (
                                        <input
                                          className="formControl1 width50px"
                                          name="DestinationName"
                                          style={{ fontSize: "0.6em" }}
                                          value={
                                            reservationFormData[globalIndex]
                                              ?.DestinationName || ""
                                          }
                                          onChange={(e) =>
                                            handleInputChange(e, globalIndex)
                                          }
                                        />
                                      ) : (
                                        <nav style={{ fontSize: "0.6em" }}>
                                          {reservationFormData[globalIndex]
                                            ?.DestinationName || ""}
                                        </nav>
                                      )}
                                    </td>
                                    <td>
                                      {editIndex === globalIndex ? (
                                        <input
                                          className="formControl1 width50px"
                                          name="ItemName"
                                          style={{ fontSize: "0.6em" }}
                                          value={
                                            row?.Service?.ServiceDetails[0]
                                              ?.ItemName || ""
                                          }
                                          onChange={(e) =>
                                            handleInputChange(e, globalIndex)
                                          }
                                        />
                                      ) : (
                                        <nav style={{ fontSize: "0.6em" }}>
                                          {row?.Service?.ServiceDetails[0]
                                            ?.ItemName || ""}
                                        </nav>
                                      )}
                                    </td>
                                    <td>
                                      {editIndex === globalIndex ? (
                                        <input
                                          className="formControl1 width50px"
                                          name="roomType"
                                          style={{ fontSize: "0.6em" }}
                                          value={
                                            reservationFormData[globalIndex]
                                              ?.roomType || ""
                                          }
                                          onChange={(e) =>
                                            handleInputChange(e, globalIndex)
                                          }
                                        />
                                      ) : (
                                        <nav style={{ fontSize: "0.6em" }}>
                                          {reservationFormData[globalIndex]
                                            ?.roomType || ""}
                                        </nav>
                                      )}
                                    </td>
                                    <td>
                                      {editIndex === globalIndex ? (
                                        <input
                                          className="formControl1 width50px"
                                          name="mealPlan"
                                          style={{ fontSize: "0.6em" }}
                                          value={
                                            reservationFormData[globalIndex]
                                              ?.mealPlan || "CP"
                                          }
                                          onChange={(e) =>
                                            handleInputChange(e, globalIndex)
                                          }
                                        />
                                      ) : (
                                        <nav style={{ fontSize: "0.6em" }}>
                                          {reservationFormData[globalIndex]
                                            ?.mealPlan || "CP"}
                                        </nav>
                                      )}
                                    </td>
                                    <td>
                                      {editIndex === globalIndex ? (
                                        <input
                                          type="number"
                                          className="formControl1 width50px"
                                          name="dbl"
                                          style={{ fontSize: "0.6em" }}
                                          value={
                                            reservationFormData[globalIndex]
                                              ?.dbl || 0
                                          }
                                          onChange={(e) =>
                                            handleInputChange(e, globalIndex)
                                          }
                                        />
                                      ) : (
                                        <nav style={{ fontSize: "0.6em" }}>
                                          {reservationFormData[globalIndex]
                                            ?.dbl || 0}
                                        </nav>
                                      )}
                                    </td>
                                    <td>
                                      {editIndex === globalIndex ? (
                                        <input
                                          type="number"
                                          className="formControl1 width50px"
                                          style={{ fontSize: "0.6em" }}
                                          name="dblAmount"
                                          value={
                                            reservationFormData[globalIndex]
                                              ?.dblAmount || 0
                                          }
                                          onChange={(e) =>
                                            handleInputChange(e, globalIndex)
                                          }
                                        />
                                      ) : (
                                        <nav style={{ fontSize: "0.6em" }}>
                                          {reservationFormData[globalIndex]
                                            ?.dblAmount || 0}
                                        </nav>
                                      )}
                                    </td>
                                    <td>
                                      {editIndex === globalIndex ? (
                                        <input
                                          type="number"
                                          className="formControl1 width50px"
                                          style={{ fontSize: "0.6em" }}
                                          name="twn"
                                          value={
                                            reservationFormData[globalIndex]
                                              ?.twn || 0
                                          }
                                          onChange={(e) =>
                                            handleInputChange(e, globalIndex)
                                          }
                                        />
                                      ) : (
                                        <nav style={{ fontSize: "0.6em" }}>
                                          {reservationFormData[globalIndex]
                                            ?.twn || 0}
                                        </nav>
                                      )}
                                    </td>
                                    <td>
                                      {editIndex === globalIndex ? (
                                        <input
                                          type="number"
                                          className="formControl1 width50px"
                                          style={{ fontSize: "0.6em" }}
                                          name="twnAmount"
                                          value={
                                            reservationFormData[globalIndex]
                                              ?.twnAmount || 0
                                          }
                                          onChange={(e) =>
                                            handleInputChange(e, globalIndex)
                                          }
                                        />
                                      ) : (
                                        <nav style={{ fontSize: "0.6em" }}>
                                          {reservationFormData[globalIndex]
                                            ?.twnAmount || 0}
                                        </nav>
                                      )}
                                    </td>
                                    <td>
                                      {editIndex === globalIndex ? (
                                        <input
                                          type="number"
                                          className="formControl1 width50px"
                                          style={{ fontSize: "0.6em" }}
                                          name="sgl"
                                          value={
                                            reservationFormData[globalIndex]
                                              ?.sgl || 0
                                          }
                                          onChange={(e) =>
                                            handleInputChange(e, globalIndex)
                                          }
                                        />
                                      ) : (
                                        <nav style={{ fontSize: "0.6em" }}>
                                          {reservationFormData[globalIndex]
                                            ?.sgl || 0}
                                        </nav>
                                      )}
                                    </td>
                                    <td>
                                      {editIndex === globalIndex ? (
                                        <input
                                          type="number"
                                          className="formControl1 width50px"
                                          style={{ fontSize: "0.6em" }}
                                          name="sglAmount"
                                          value={
                                            reservationFormData[globalIndex]
                                              ?.sglAmount || 0
                                          }
                                          onChange={(e) =>
                                            handleInputChange(e, globalIndex)
                                          }
                                        />
                                      ) : (
                                        <nav style={{ fontSize: "0.6em" }}>
                                          {reservationFormData[globalIndex]
                                            ?.sglAmount || 0}
                                        </nav>
                                      )}
                                    </td>
                                    <td>
                                      {editIndex === globalIndex ? (
                                        <input
                                          type="number"
                                          className="formControl1 width50px"
                                          style={{ fontSize: "0.6em" }}
                                          name="tpl"
                                          value={
                                            reservationFormData[globalIndex]
                                              ?.tpl || 0
                                          }
                                          onChange={(e) =>
                                            handleInputChange(e, globalIndex)
                                          }
                                        />
                                      ) : (
                                        <nav style={{ fontSize: "0.6em" }}>
                                          {reservationFormData[globalIndex]
                                            ?.tpl || 0}
                                        </nav>
                                      )}
                                    </td>
                                    <td>
                                      {editIndex === globalIndex ? (
                                        <input
                                          type="number"
                                          className="formControl1 width50px"
                                          style={{ fontSize: "0.6em" }}
                                          name="tplAmount"
                                          value={
                                            reservationFormData[globalIndex]
                                              ?.tplAmount || 0
                                          }
                                          onChange={(e) =>
                                            handleInputChange(e, globalIndex)
                                          }
                                        />
                                      ) : (
                                        <nav style={{ fontSize: "0.6em" }}>
                                          {reservationFormData[globalIndex]
                                            ?.tplAmount || 0}
                                        </nav>
                                      )}
                                    </td>
                                    <td>
                                      <input
                                        type="number"
                                        className="formControl1 width50px"
                                        style={{ fontSize: "0.6em" }}
                                        value={calculateTotal(globalIndex)}
                                        disabled
                                      />
                                    </td>
                                    {console.log(
                                      reservationFormData[globalIndex]?.altst,
                                      "VCHGD877",
                                      globalIndex
                                    )}
                                    <td>
                                      {editIndex === globalIndex ? (
                                        <input
                                          type="checkbox"
                                          className="form-check-input height-em-1 width-em-1"
                                          style={{ fontSize: "0.6em" }}
                                          name="altst"
                                          checked={
                                            reservationFormData[globalIndex]
                                              ?.altst || 0
                                          }
                                          onChange={(e) =>
                                            handleInputChange(
                                              {
                                                target: {
                                                  name: "altst",
                                                  value: e.target.checked,
                                                },
                                              },
                                              globalIndex
                                            )
                                          }
                                        />
                                      ) : (
                                        <nav style={{ fontSize: "0.6em" }}>
                                          {reservationFormData[globalIndex]
                                            ?.altst
                                            ? "✔️"
                                            : ""}
                                        </nav>
                                      )}
                                    </td>

                                    {/* <td>
                                    {editIndex === globalIndex ? (
                                      <input
                                        className="formControl1 width50px"
                                        name="altst"
                                        value={reservationFormData[globalIndex]?.altst || ""}
                                        onChange={(e) => handleInputChange(e, globalIndex)}
                                      />
                                    ) : (
                                      <nav style={{fontSize: "0.6em"}}>{reservationFormData[globalIndex]?.altst || ""}</nav>
                                    )}
                                  </td> */}
                                    {console.log(
                                      reservationFormData[globalIndex]
                                        ?.ReservationStatus,
                                      "VCGDHDYHD988"
                                    )}
                                    <td>
                                      {editIndex === globalIndex ? (
                                        <select
                                          className="formControl1 width50px"
                                          name="ReservationStatus"
                                          value={
                                            reservationFormData[globalIndex]
                                              ?.ReservationStatus
                                          }
                                          onChange={(e) =>
                                            handleSelectChange(
                                              "ReservationStatus",
                                              e.target.value,
                                              globalIndex
                                            )
                                          }
                                        >
                                          {statusOptionsNew.map((status) => (
                                            <option key={status} value={status}>
                                              {status}
                                            </option>
                                          ))}
                                        </select>
                                      ) : (
                                        <nav style={{ fontSize: "0.6em" }}>
                                          {
                                            reservationFormData[globalIndex]
                                              ?.ReservationStatus
                                          }
                                        </nav>
                                      )}
                                    </td>
                                    <td>
                                      {editIndex === globalIndex ? (
                                        <DatePicker
                                          popperProps={{
                                            strategy: "fixed",
                                          }}
                                          className="formControl1 width50px"
                                          selected={
                                            reservationFormData[globalIndex]
                                              ?.dated
                                              ? new Date(
                                                  reservationFormData[
                                                    globalIndex
                                                  ]?.dated
                                                )
                                              : null
                                          }
                                          onChange={(date) =>
                                            handleInputChange(
                                              {
                                                target: {
                                                  name: "dated",
                                                  value: date
                                                    ? date
                                                        .toISOString()
                                                        .split("T")[0]
                                                    : "",
                                                },
                                              },
                                              globalIndex
                                            )
                                          }
                                          dateFormat="yyyy-MM-dd"
                                          placeholderText="YYYY-MM-DD"
                                        />
                                      ) : (
                                        <nav style={{ fontSize: "0.6em" }}>
                                          {reservationFormData[globalIndex]
                                            ?.dated || ""}
                                        </nav>
                                      )}
                                    </td>

                                    {/* <td>
                                    {editIndex === globalIndex ? (
                                      <DatePicker
                                        className="formControl1 width50px"
                                        selected={parseYYYYMMDD(reservationFormData[globalIndex]?.fromDate)}
                                        onChange={(date) => handleFromDate(date, globalIndex)}
                                        dateFormat="yyyy-MM-dd"
                                        placeholderText="YYYY-MM-DD"
                                      />
                                    ) : (
                                      <nav style={{fontSize: "0.6em"}}>{reservationFormData[globalIndex]?.dated || ""}</nav>
                                    )}
                                  </td> */}
                                    <td>
                                      {editIndex === globalIndex ? (
                                        <input
                                          className="formControl1 width50px"
                                          name="refno"
                                          value={
                                            reservationFormData[globalIndex]
                                              ?.refno || ""
                                          }
                                          onChange={(e) =>
                                            handleInputChange(e, globalIndex)
                                          }
                                        />
                                      ) : (
                                        <nav style={{ fontSize: "0.6em" }}>
                                          {reservationFormData[globalIndex]
                                            ?.refno || ""}
                                        </nav>
                                      )}
                                    </td>
                                    <td>
                                      {editIndex === globalIndex ? (
                                        <input
                                          className="formControl1 width50px"
                                          name="remaks"
                                          value={
                                            reservationFormData[globalIndex]
                                              ?.remaks || ""
                                          }
                                          onChange={(e) =>
                                            handleInputChange(e, globalIndex)
                                          }
                                        />
                                      ) : (
                                        <nav style={{ fontSize: "0.6em" }}>
                                          {reservationFormData[globalIndex]
                                            ?.remaks || ""}
                                        </nav>
                                      )}
                                    </td>
                                    <td className="d-flex gap-1 justify-content-evenly align-items-center">
                                      <div className="icon-container">
                                        <button
                                          type="button"
                                          className="btn btn-primary"
                                          style={{
                                            padding: "0 3px",
                                            borderRadius: "4px",
                                            fontSize: "11px",
                                          }}
                                          onClick={() =>
                                            handleSave(
                                              row,
                                              globalIndex,
                                              "single"
                                            )
                                          }
                                        >
                                          <span>
                                            <i class="fa-solid fa-floppy-disk fs-4"></i>
                                          </span>
                                        </button>
                                        <p class="tooltip-text py-1 px-1">
                                          Save
                                        </p>
                                      </div>

                                      {/* <div className="icon-container">
                                        <button
                                          type="button"
                                          className="btn btn-primary"
                                          style={{
                                            padding: "0 3px",
                                            borderRadius: "4px",
                                            fontSize: "11px",
                                          }}
                                          onClick={() =>
                                            handleSaveHotel(
                                              row,
                                              globalIndex,
                                              "single"
                                            )
                                          }
                                        >
                                          <span>
                                            <i class="fa-solid fa-floppy-disk fs-4"></i>
                                          </span>
                                        </button>
                                        <p class="tooltip-text py-1 px-1">
                                          Save Hotel
                                        </p>
                                      </div> */}

                                      <div className="icon-container">
                                        <button
                                          type="button"
                                          className="btn btn-primary"
                                          style={{
                                            padding: "0 3px",
                                            borderRadius: "4px",
                                            fontSize: "11px",
                                          }}
                                          onClick={() => handleButtonClick(row)}
                                        >
                                          <span>
                                            <i class="fa-regular fa-paper-plane"></i>
                                          </span>
                                        </button>
                                        <p class="tooltip-text py-1 px-1">
                                          Send Reservation Request
                                        </p>
                                      </div>

                                      <OverlayTrigger
                                        placement="top"
                                        overlay={getStatusTooltip(
                                          row.Service?.ServiceUniqueId
                                        )}
                                      >
                                        <span>
                                          <i className="fa-solid fa-circle-info"></i>
                                        </span>
                                      </OverlayTrigger>
                                    </td>
                                  </>
                                ) : (
                                  // Hotel End
                                  <>
                                    <td>
                                      {editIndex === globalIndex ? (
                                        <input
                                          className="formControl1 width50px"
                                          name="type"
                                          value={row.Service?.ServiceType}
                                          disabled
                                        />
                                      ) : (
                                        <nav style={{ fontSize: "0.6em" }}>
                                          {row.Service?.ServiceType}
                                        </nav>
                                      )}
                                    </td>
                                    <td>
                                      {editIndex === globalIndex ? (
                                        <input
                                          style={{ fontSize: "0.6em" }}
                                          className="formControl1 width50px"
                                          name="service"
                                          value={
                                            row?.Service?.ServiceDetails[0]
                                              .ItemName
                                          }
                                          disabled
                                        />
                                      ) : (
                                        <nav style={{ fontSize: "0.6em" }}>
                                          {
                                            row?.Service?.ServiceDetails[0]
                                              .ItemName
                                          }
                                        </nav>
                                      )}
                                    </td>
                                    <td>
                                      {editIndex === globalIndex ? (
                                        <input
                                          className="formControl1 width50px"
                                          style={{ fontSize: "0.6em" }}
                                          type="date"
                                          name="checkIn"
                                          value={
                                            row?.Service?.ServiceDetails[0]
                                              ?.TimingDetails?.ItemFromDate
                                          }
                                          disabled
                                        />
                                      ) : (
                                        <nav style={{ fontSize: "0.6em" }}>
                                          {
                                            row?.Service?.ServiceDetails[0]
                                              ?.TimingDetails?.ItemFromDate
                                          }
                                        </nav>
                                      )}
                                    </td>
                                    <td>
                                      {editIndex === globalIndex ? (
                                        <input
                                          className="formControl1 width50px"
                                          style={{ fontSize: "0.6em" }}
                                          type="date"
                                          name="checkOut"
                                          value={
                                            row?.Service?.ServiceDetails[0]
                                              ?.TimingDetails?.ItemFromDate
                                          }
                                          disabled
                                        />
                                      ) : (
                                        <nav style={{ fontSize: "0.6em" }}>
                                          {
                                            row?.Service?.ServiceDetails[0]
                                              ?.TimingDetails?.ItemFromDate
                                          }
                                        </nav>
                                      )}
                                    </td>
                                    <td>
                                      {editIndex === globalIndex ? (
                                        <input
                                          className="formControl1 width50px"
                                          style={{ fontSize: "0.6em" }}
                                          type="number"
                                          name="nights"
                                          value={row.nights}
                                          disabled
                                        />
                                      ) : (
                                        <nav style={{ fontSize: "0.6em" }}>
                                          {row.nights}
                                        </nav>
                                      )}
                                    </td>
                                    <td>
                                      {editIndex === globalIndex ? (
                                        <select
                                          className="formControl1 width50px"
                                          name="ReservationStatus"
                                          style={{ fontSize: "0.6em" }}
                                          value={
                                            reservationFormData[globalIndex]
                                              ?.ReservationStatus
                                          }
                                          onChange={(e) =>
                                            handleSelectChange(
                                              "ReservationStatus",
                                              e.target.value,
                                              globalIndex
                                            )
                                          }
                                        >
                                          {statusOptionsNew.map((status) => (
                                            <option key={status} value={status}>
                                              {status}
                                            </option>
                                          ))}
                                        </select>
                                      ) : (
                                        <nav style={{ fontSize: "0.6em" }}>
                                          {
                                            reservationFormData[globalIndex]
                                              ?.ReservationStatus
                                          }
                                        </nav>
                                      )}
                                    </td>
                                    <td>
                                      {editIndex === globalIndex ? (
                                        <input
                                          className="formControl1 width50px"
                                          name="ConfirmationNo"
                                          style={{ fontSize: "0.6em" }}
                                          value={
                                            reservationFormData[globalIndex]
                                              ?.ConfirmationNo
                                          }
                                          onChange={(e) =>
                                            handleInputChange(e, globalIndex)
                                          }
                                        />
                                      ) : (
                                        <nav style={{ fontSize: "0.6em" }}>
                                          {
                                            reservationFormData[globalIndex]
                                              ?.ConfirmationNo
                                          }
                                        </nav>
                                      )}
                                    </td>
                                    <td>
                                      {editIndex === globalIndex ? (
                                        <DatePicker
                                          popperProps={{
                                            strategy: "fixed", // Ensures the popper is positioned relative to the viewport
                                          }}
                                          className="formControl1 width50px"
                                          selected={
                                            reservationFormData[globalIndex]
                                              ?.ConfirmationDate
                                              ? parseYYYYMMDD(
                                                  reservationFormData[
                                                    globalIndex
                                                  ]?.ConfirmationDate
                                                )
                                              : null
                                          }
                                          onChange={(date) =>
                                            handleConfirmDate(date, globalIndex)
                                          }
                                          dateFormat="yyyy-MM-dd"
                                          placeholderText="YYYY-MM-DD"
                                        />
                                      ) : (
                                        <span>
                                          {
                                            reservationFormData[globalIndex]
                                              ?.ConfirmationDate
                                          }
                                        </span>
                                      )}
                                    </td>
                                    <td>
                                      {editIndex === globalIndex ? (
                                        <DatePicker
                                          popperProps={{
                                            strategy: "fixed", // Ensures the popper is positioned relative to the viewport
                                          }}
                                          className="formControl1 width50px"
                                          selected={
                                            reservationFormData[globalIndex]
                                              ?.CutOfDate
                                              ? parseYYYYMMDD(
                                                  reservationFormData[
                                                    globalIndex
                                                  ]?.CutOfDate
                                                )
                                              : null
                                          }
                                          onChange={(date) =>
                                            handleCutoffCalender(
                                              date,
                                              globalIndex
                                            )
                                          }
                                          dateFormat="yyyy-MM-dd"
                                          placeholderText="YYYY-MM-DD"
                                        />
                                      ) : (
                                        <span>
                                          {
                                            reservationFormData[globalIndex]
                                              ?.CutOfDate
                                          }
                                        </span>
                                      )}
                                    </td>
                                    <td>
                                      {editIndex === globalIndex ? (
                                        <input
                                          className="formControl1 width50px"
                                          name="ConfirmedBy"
                                          value={
                                            reservationFormData[globalIndex]
                                              ?.ConfirmedBy
                                          }
                                          onChange={(e) =>
                                            handleInputChange(e, globalIndex)
                                          }
                                        />
                                      ) : (
                                        <span>
                                          {
                                            reservationFormData[globalIndex]
                                              ?.ConfirmedBy
                                          }
                                        </span>
                                      )}
                                    </td>
                                    <td>
                                      {editIndex === globalIndex ? (
                                        <input
                                          className="formControl1 width50px"
                                          name="ConfirmedNote"
                                          value={
                                            reservationFormData[globalIndex]
                                              ?.ConfirmedNote
                                          }
                                          onChange={(e) =>
                                            handleInputChange(e, globalIndex)
                                          }
                                        />
                                      ) : (
                                        <span>
                                          {
                                            reservationFormData[globalIndex]
                                              ?.ConfirmedNote
                                          }
                                        </span>
                                      )}
                                    </td>
                                    <td>
                                      {editIndex === globalIndex ? (
                                        <select
                                          className="formControl1 width50px"
                                          name="VehicleType"
                                          value={
                                            reservationFormData[globalIndex]
                                              ?.VehicleType
                                          }
                                          onChange={(e) =>
                                            handleSelectChange(
                                              "VehicleType",
                                              e.target.value,
                                              globalIndex
                                            )
                                          }
                                        >
                                          <option value="">
                                            Select Vehicle
                                          </option>
                                          {vehicleTypeList.map((vehicle) => (
                                            <option
                                              key={vehicle.value}
                                              value={vehicle.value}
                                            >
                                              {vehicle.label}
                                            </option>
                                          ))}
                                        </select>
                                      ) : (
                                        <span>
                                          {getVehicleName(
                                            reservationFormData[globalIndex]
                                              ?.VehicleType
                                          )}
                                        </span>
                                      )}
                                    </td>
                                    <td>
                                      {editIndex === globalIndex ? (
                                        // <input
                                        //   className="formControl1 width50px"
                                        //   type="time"
                                        //   name="StartTime"
                                        //   value={
                                        //     reservationFormData[globalIndex]
                                        //       ?.StartTime
                                        //   }
                                        //   onChange={(e) =>
                                        //     handleInputChange(e, globalIndex)
                                        //   }
                                        // />
                                        <DarkCustomTimePicker
                                          className="formControl1 width50px"
                                          name="StartTime"
                                          onChange={(e) =>
                                            handleInputChange(e, globalIndex)
                                          }
                                          value={
                                            reservationFormData[globalIndex]
                                              ?.StartTime
                                          }
                                        />
                                      ) : (
                                        <span>
                                          {
                                            reservationFormData[globalIndex]
                                              ?.StartTime
                                          }
                                        </span>
                                      )}
                                    </td>
                                    <td>
                                      {editIndex === globalIndex ? (
                                        // <input
                                        //   className="formControl1 width50px"
                                        //   type="time"
                                        //   name="EndTime"
                                        //   value={
                                        //     reservationFormData[globalIndex]
                                        //       ?.EndTime
                                        //   }
                                        //   onChange={(e) =>
                                        //     handleInputChange(e, globalIndex)
                                        //   }
                                        // />
                                        <DarkCustomTimePicker
                                          className="formControl1 width50px"
                                          name="EndTime"
                                          value={
                                            reservationFormData[globalIndex]
                                              ?.EndTime
                                          }
                                          onChange={(e) =>
                                            handleInputChange(e, globalIndex)
                                          }
                                        />
                                      ) : (
                                        <span>
                                          {
                                            reservationFormData[globalIndex]
                                              ?.EndTime
                                          }
                                        </span>
                                      )}
                                    </td>
                                    <td>
                                      {editIndex === globalIndex ? (
                                        // <input
                                        //   className="formControl1 width50px"
                                        //   type="time"
                                        //   name="PickupTime"
                                        //   value={
                                        //     reservationFormData[globalIndex]
                                        //       ?.PickupTime
                                        //   }
                                        //   onChange={(e) =>
                                        //     handleInputChange(e, globalIndex)
                                        //   }
                                        // />
                                        <DarkCustomTimePicker
                                          className="formControl1 width50px"
                                          name="PickupTime"
                                          value={
                                            reservationFormData[globalIndex]
                                              ?.PickupTime
                                          }
                                          onChange={(e) =>
                                            handleInputChange(e, globalIndex)
                                          }
                                        />
                                      ) : (
                                        <span>
                                          {
                                            reservationFormData[globalIndex]
                                              ?.PickupTime
                                          }
                                        </span>
                                      )}
                                    </td>
                                    <td>
                                      {editIndex === globalIndex ? (
                                        // <input
                                        //   className="formControl1 width50px"
                                        //   type="time"
                                        //   name="DropTime"
                                        //   value={
                                        //     reservationFormData[globalIndex]
                                        //       ?.DropTime
                                        //   }
                                        //   onChange={(e) =>
                                        //     handleInputChange(e, globalIndex)
                                        //   }
                                        // />
                                        <DarkCustomTimePicker
                                          className="formControl1 width50px"
                                          name="DropTime"
                                          value={
                                            reservationFormData[globalIndex]
                                              ?.DropTime
                                          }
                                          onChange={(e) =>
                                            handleInputChange(e, globalIndex)
                                          }
                                        />
                                      ) : (
                                        <span>
                                          {
                                            reservationFormData[globalIndex]
                                              ?.DropTime
                                          }
                                        </span>
                                      )}
                                    </td>
                                    <td>
                                      {editIndex === globalIndex ? (
                                        <input
                                          className="formControl1 width50px"
                                          name="PickupAddress"
                                          value={
                                            reservationFormData[globalIndex]
                                              ?.PickupAddress
                                          }
                                          onChange={(e) =>
                                            handleInputChange(e, globalIndex)
                                          }
                                        />
                                      ) : (
                                        <span>
                                          {
                                            reservationFormData[globalIndex]
                                              ?.PickupAddress
                                          }
                                        </span>
                                      )}
                                    </td>
                                    <td>
                                      {editIndex === globalIndex ? (
                                        <input
                                          className="formControl1 width50px"
                                          name="DropAddress"
                                          value={
                                            reservationFormData[globalIndex]
                                              ?.DropAddress
                                          }
                                          onChange={(e) =>
                                            handleInputChange(e, globalIndex)
                                          }
                                        />
                                      ) : (
                                        <span>
                                          {
                                            reservationFormData[globalIndex]
                                              ?.DropAddress
                                          }
                                        </span>
                                      )}
                                    </td>
                                    <td className="d-flex gap-1 justify-content-evenly align-items-center">
                                      <div className="icon-container">
                                        <button
                                          type="button"
                                          className="btn btn-primary"
                                          style={{
                                            padding: "0 3px",
                                            borderRadius: "4px",
                                            fontSize: "11px",
                                          }}
                                          onClick={() =>
                                            handleSave(
                                              row,
                                              globalIndex,
                                              "single"
                                            )
                                          }
                                        >
                                          <span>
                                            <i class="fa-solid fa-floppy-disk fs-4"></i>
                                          </span>
                                        </button>
                                        <p class="tooltip-text py-1 px-1">
                                          Save
                                        </p>
                                      </div>

                                      <div className="icon-container">
                                        <button
                                          type="button"
                                          className="btn btn-primary"
                                          style={{
                                            padding: "0 3px",
                                            borderRadius: "4px",
                                            fontSize: "11px",
                                          }}
                                          onClick={() => handleButtonClick(row)}
                                        >
                                          <span>
                                            <i class="fa-regular fa-paper-plane"></i>
                                          </span>
                                        </button>
                                        <p class="tooltip-text py-1 px-1">
                                          Send Reservation Request
                                        </p>
                                      </div>

                                      <OverlayTrigger
                                        placement="top"
                                        overlay={getStatusTooltip(
                                          row.Service?.ServiceUniqueId
                                        )}
                                      >
                                        <span>
                                          <i className="fa-solid fa-circle-info"></i>
                                        </span>
                                      </OverlayTrigger>
                                    </td>
                                  </>
                                )}
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </PerfectScrollbar>
                    {group.type === "Hotel" && (
                      <div className="d-flex justify-content-between">
                        <div className="d-flex gap-2 mb-3">
                          <button
                            type="button"
                            className="btn btn-primary btn-custom-size"
                            style={{
                              padding: "0 3px",
                              borderRadius: "4px",
                              fontSize: "11px",
                            }}
                            onClick={addRow}
                          >
                            {" "}
                            Add
                            <i className="fa-solid fa-plus ms-2" />
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary btn-custom-size"
                            onClick={removeRow}
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

                        <div>
                          <button
                            type="button"
                            onClick={handleUpdateHotelData}
                            className="btn btn-primary btn-custom-size"
                            style={{
                              padding: "0 3px",
                              borderRadius: "4px",
                              fontSize: "11px",
                            }}
                          >
                            {" "}
                            Update Alternate Hotel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="col-12 mt-3 d-flex justify-content-end align-items-center gap-3">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="itineraryRequest"
                    checked={isItineraryRequest}
                    onChange={(e) => setIsItineraryRequest(e.target.checked)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="itineraryRequest"
                  >
                    Itinerary Request
                  </label>
                </div>
                <button
                  className="btn btn-primary btn-custom-size"
                  onClick={handleSubmit}
                >
                  Reservation Send
                </button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal
        size="lg"
        show={lgShow}
        onHide={() => setLgShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Send Reservation Request
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "10px" }}>
          <div
            ref={htmlRef}
            style={{ backgroundColor: "#fff" }}
            dangerouslySetInnerHTML={{ __html: htmlString }}
          />
          <hr />
          <div className="d-flex justify-content-end gap-3">
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
            <button
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => {
                const subject = encodeURIComponent("My Travel Proposal");
                const body = encodeURIComponent(
                  htmlRef.current?.innerText || ""
                );

                const mailtoLink = `mailto:someone@example.com?subject=${subject}&body=${body}`;
                window.location.href = mailtoLink;
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
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Reservationrequest;
