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
// const [iframeSrc, setIframeSrc] = useState(""); // State to store the iframe source

import AsyncSelect from "react-select/async";
import Select from "react-select";
import { customStyles } from "./customStyle";

import styles from "./ServiceCard.module.css";

import moment from "moment";
import { useNavigate } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";

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
  ConfirmationDate: "",
  CutOfDate: "",
  ConfirmedNote: "",
  Date: "",
};

const Reservationrequest = () => {
  const supplierSectionStatus = useSelector(
    (state) => state.supplierStateReducer.supplierSectionChange
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
  console.log(reservationList, "reservationList");

  const [listFinalQuotationData, setListFinalQuotationData] = useState([]);
  const [editingIndexes, setEditingIndexes] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const [vehicleTypeList, setVehicleTypeList] = useState([]);
  const [specialRequest, setSpecialRequest] = useState("");
  const display = () => {
    // if(!hasModalShown){
    setLgShow(true);
    // setHasModalShown(true)
    // }
  };

  const queryQuotation = JSON.parse(localStorage.getItem("Query_Qoutation"));
  const handleUpdateTableEdit = (index) => {
    // setEditingIndexes((prev) => [...prev, index]);
    if (!editingIndexes.includes(index)) {
      setEditingIndexes((prev) => [...prev, index]);
    }
  };

  const handleCancelEdit = (index) => {
    setEditingIndexes((prev) => prev.filter((i) => i !== index));
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
      // Show All List
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
        setReservationList(data?.AssignedServices);
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
        // console.log(options, "skjdh");

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
      // setSupplierList(options2);
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

  const QuotationList = async () => {
    try {
      const { data } = await axiosOther.post("lisFinalQuotation", {
        QueryId: quotationDataOperation?.QueryId,
        QuotationNo: quotationDataOperation?.QuotationNumber,
        Status: status,
        ServiceType: service,
        SupplierName: supplier,
      });

      console.log(data?.FilteredQuotations[0], "HGJ78");

      if (data?.Success) {
        setListFinalQuotationData(
          data?.FilteredQuotations[0]?.ReservationRequest
        );
      }
    } catch (error) {
      console.log(error);
      console.log("error", error);
    }
  };

  useEffect(() => {
    QuotationList();
  }, [service, supplier, status]);

  useEffect(() => {
    getAPIToServer();
  }, []);

  useEffect(() => {
    getAPIToServer();
    QuotationList();
  }, []);

  useEffect(() => {
    if (reservationList?.length > 0) {
      const initilaForm = reservationList?.map(({ ServiceType }) => {
        if (ServiceType) {
          return confirstStatusInitial;
        }
      });

      setConfirmStatusForm(initilaForm);
    }
  }, [reservationList]);

  const parseDDMMYYYY = (str) => {
    if (typeof str !== "string") return null;

    const date = moment(str, "DD-MM-YYYY").toDate(); // <-- specify the format here
    return isNaN(date.getTime()) ? null : date;
  };

  const handleConfirmDate = (date, index) => {
    if (!date || isNaN(date.getTime())) {
      // Set to null if user clears the date or it's invalid
      setConfirmStatusForm((prevArr) => {
        const newArr = [...prevArr];
        newArr[index] = { ...newArr[index], ConfirmationDate: null };
        return newArr;
      });
      return;
    }

    // Format date to dd-MM-yyyy (e.g., 18-12-2024)
    const formattedDate = date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .split("/")
      .join("-");

    setConfirmStatusForm((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = { ...newArr[index], ConfirmationDate: formattedDate };
      return newArr;
    });
  };

  const handleCutoffCalender = (date, index) => {
    if (!date || isNaN(date.getTime())) {
      setConfirmStatusForm((prevArr) => {
        const newArr = [...prevArr];
        newArr[index] = { ...newArr[index], CutOfDate: null };
        return newArr;
      });
      return;
    }
    // Format date to dd-MM-yyyy (e.g., 18-12-2024)
    const formattedDate = date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .split("/")
      .join("-");

    setConfirmStatusForm((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = { ...newArr[index], CutOfDate: formattedDate };
      return newArr;
    });
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

  const handleRemarksSave = async (item, index) => {
    const payload = {
      ReservationStatus: confirmStatusForm[index]?.ReservationStatus,
      ConfirmedNote: specialRequest,
      id: quotationDataOperation?.id || "",
      QuotationNumber: quotationDataOperation?.QuotationNumber || "",
      ServiceId: item?.Service?.ServiceId || "",
      ServiceType: item?.Service?.ServiceType || "",
      SupplierId:
        item?.Service?.ServiceDetails[0]?.ItemSupplierDetail?.ItemSupplierId ||
        "",
      SupplierName:
        item?.Service?.ServiceDetails[0]?.ItemSupplierDetail
          ?.ItemSupplierName || "",
      ApproveBy: "1",
    };
    console.log(payload, "LL7", confirmStatusForm[index]);

    try {
      const { data } = await axiosOther.post("add-reservation-quotation", [
        payload,
      ]);

      if (data[0]?.Success) {
        notifySuccess("Data is updated!!");

        if (type === "single") {
          setEditingIndexes((prev) => prev.filter((i) => i !== index));
        } else {
          setEditingIndexes([]);
        }
      }
    } catch (error) {
      console.log("error", error);
      if (error?.status == 402) {
        notifyError("All Field Required");
      }
    }
  };

  const handleSave = async (item, index, type) => {
    console.log("ServiceId:", item?.Service?.ServiceId);
    let payload = {};
    if (type == "single") {
      payload = confirmStatusForm?.map((form) => {
        return {
          ...form,
          id: quotationDataOperation?.id || "",
          QuotationNumber: quotationDataOperation?.QuotationNumber || "",
          ServiceId: item?.Service?.ServiceId || "",
          // ServiceName: item?.Service?.ServiceType || "",
          ServiceType: item?.Service?.ServiceType || "",
          SupplierId:
            item?.Service?.ServiceDetails[0]?.ItemSupplierDetail
              ?.ItemSupplierId || "",
          SupplierName:
            item?.Service?.ServiceDetails[0]?.ItemSupplierDetail
              ?.ItemSupplierName || "",
          // SupplierUniqueId:
          //   ServiceDetails[0]?.ItemSupplierDetail?.ItemSupplierId || "",
          ApproveBy: "1",
        };
      });
    }

    if (type == "multiple") {
      payload = confirmStatusForm?.map((form, ind) => {
        return {
          ...form,
          id: quotationDataOperation?.id || "",
          QuotationNumber: quotationDataOperation?.QuotationNumber || "",
          ServiceId: item[ind]?.Service?.ServiceId || "",
          // ServiceName: item[ind]?.Service?.ServiceType || "",
          ServiceType: item[ind]?.Service?.ServiceType || "",
          SupplierId:
            item[ind]?.Service?.ServiceDetails[0]?.ItemSupplierDetail
              ?.ItemSupplierId || "",
          SupplierName:
            item[ind]?.Service?.ServiceDetails[0]?.ItemSupplierDetail
              ?.ItemSupplierName || "",
          // SupplierUniqueId:
          //   ServiceDetails[0]?.ItemSupplierDetail?.ItemSupplierId || "",
          ApproveBy: "1",
        };
      });
    }

    try {
      const url = confirmStatusForm[index]?.UniqueId
        ? "update-reservation-quotation"
        : "add-reservation-quotation";
      const { data } = await axiosOther.post(
        url,
        type == "single" ? [payload[index]] : payload
      );

      if (data[0]?.Success) {
        notifySuccess("Data is updated!!");

        if (type === "single") {
          setEditingIndexes((prev) => prev.filter((i) => i !== index));
        } else {
          setEditingIndexes([]);
        }
      }
    } catch (error) {
      console.log("error", error);
      if (error?.status == 402) {
        notifyError("All Field Required");
      }
    }
  };

  const handleConfirmStatusForm = (e, index, service) => {
    const { name, value } = e.target;
    setConfirmStatusForm((prevArr) => {
      let newArr = [...prevArr];
      newArr[index] = { ...newArr[index], [name]: value };
      return newArr;
    });
  };

  useEffect(() => {
    if (reservationList.length && listFinalQuotationData.length) {
      const initialForm = reservationList.map((service) => {
        const matched = listFinalQuotationData.find(
          (sId) => sId.ServiceId === service?.Service?.ServiceId
        );
        return {
          ConfirmationNo: matched?.ConfirmationNo || "",
          ConfirmationDate: matched?.ConfirmationDate || null,
          CutOfDate: matched?.CutOfDate || null,
          ConfirmedBy: matched?.ConfirmedBy || "",
          ConfirmedNote: matched?.ConfirmedNote || "",
          ReservationStatus: matched?.ReservationStatus || "Pending",
          UniqueId: matched?.UniqueId,
          VehicleType: matched?.VehicleType,
          StartTime: matched?.StartTime,
          PickupTime: matched?.PickupTime,
          DropTime: matched?.DropTime,
          EndTime: matched?.EndTime,
          PickupAddress: matched?.PickupAddress,
          DropAddress: matched?.DropAddress,
        };
      });
      setConfirmStatusForm(initialForm);
    }
  }, [reservationList, listFinalQuotationData, refreshKey]);

  // Handler Search Display List
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
    console.log(data, "ReReq");
    dispatch({
      type: "SET_SERVICE_DATA",
      payload: data,
    });
    dispatch({
      type: "CHANGE_TAB",
      payload: "communication",
    });
  };

  // Rishi Changes
  console.log(listFinalQuotationData, "L1");
  console.log(copyReservationList, "R1");
  console.log(reservationList, "C1");

  const statusOptionsNew = [
    "Pending",
    "Cancelled",
    "Requested",
    "Confirmed",
    "Rejected",
    "Waitlist",
  ];

  const vehicleOptionsNew = ["Sedan", "SUV", "Tempo Traveller", "Bus"];

  const statusColorsNew = {
    Pending: "rgba(255, 193, 7, 0.2)", // light yellow
    Cancelled: "rgba(220, 53, 69, 0.2)", // light red
    Requested: "rgba(13, 202, 240, 0.2)", // light cyan
    Confirmed: "rgba(40, 167, 69, 0.2)", // light green
    Rejected: "rgba(108, 117, 125, 0.2)", // light gray
    Waitlist: "rgba(102, 16, 242, 0.2)", // light purple
  };

  const [rows, setRows] = useState([
    {
      type: "Hotel",
      supplier: "XYZ Travels",
      checkIn: "2025-07-10",
      checkOut: "2025-07-12",
      nights: 2,
      validity: "2025-07-01",
      status: "Confirmed",
      confirmationNo: "CN123",
      confirmationDate: "2025-07-09",
      cutOffDate: "2025-07-08",
      confirmedBy: "John",
      confirmedNote: "N/A",
      vehicleType: "SUV",
    },
    {
      type: "Hotel",
      supplier: "XYZ Travels",
      checkIn: "2025-07-10",
      checkOut: "2025-07-12",
      nights: 2,
      validity: "2025-07-01",
      status: "Rejected",
      confirmationNo: "CN123",
      confirmationDate: "2025-07-09",
      cutOffDate: "2025-07-08",
      confirmedBy: "John",
      confirmedNote: "N/A",
      vehicleType: "SUV",
    },
    {
      type: "Hotel",
      supplier: "XYZ Travels",
      checkIn: "2025-07-10",
      checkOut: "2025-07-12",
      nights: 2,
      validity: "2025-07-01",
      status: "Cancelled",
      confirmationNo: "CN123",
      confirmationDate: "2025-07-09",
      cutOffDate: "2025-07-08",
      confirmedBy: "John",
      confirmedNote: "N/A",
      vehicleType: "SUV",
    },
    {
      type: "Hotel",
      supplier: "XYZ Travels",
      checkIn: "2025-07-10",
      checkOut: "2025-07-12",
      nights: 2,
      validity: "2025-07-01",
      status: "Waitlist",
      confirmationNo: "CN123",
      confirmationDate: "2025-07-09",
      cutOffDate: "2025-07-08",
      confirmedBy: "John",
      confirmedNote: "N/A",
      vehicleType: "SUV",
    },
  ]);

  const [editIndex, setEditIndex] = useState(null);
  const tableRefNew = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tableRefNew.current && !tableRefNew.current.contains(event.target)) {
        setEditableRows({}); // remove edit mode
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleRowClickNew = (index) => {
    setEditIndex(index);
  };

  const handleChangeNew = (e, index) => {
    const { name, value } = e.target;
    const updatedRows = [...rows];
    updatedRows[index][name] = value;
    setRows(updatedRows);
  };

  return (
    <div className="Reservationrequest m-0 p-0">
      <Row>
        <Col style={{ padding: "0px", margin: "0px" }} md={12}>
          <Card>
            <div className="heading mb-2 mx-1 border-0 p-1">
              <div className="row">
                <div className="col-lg-12 d-flex justify-content-end align-item-center gap-3">
                  <div className=" d-flex ">
                    <button
                      className="btn btn-dark btn-custom-size"
                      onClick={() => navigate(-1)}
                    >
                      <span className="me-1">Back</span>
                      <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
                    </button>
                  </div>
                  <button className="btn btn-primary btn-custom-size">
                    Submit
                  </button>
                </div>
              </div>
              <div className="col-lg-2 col-md-6 mb-3 fs-12 d-flex align-items-center justify-content-start">
                <label className="fs-12 querydetails text-grey">
                  Quotations :
                </label>
                <span className="fs-12 ms-1 querydetails text-white">
                  {quotationDataOperation?.QuotationNumber}
                </span>
              </div>
              <div className="row align-items-center mt-1">
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
                <div className="col-lg-2 col-md-6 mb-3">
                  <label className="querydetails text-grey">Suppliers</label>
                  <AsyncSelect
                    cacheOptions
                    defaultOptions={supplierList}
                    loadOptions={loadOptions}
                    placeholder="Select Supplier"
                    onChange={(selectedOption) =>
                      handleFilter({ type: "supplier", opt: selectedOption })
                    }
                    value={supplier}
                    styles={customStyles}
                    className="customSelectLightTheame"
                    classNamePrefix="custom"
                    isClearable
                    todayButton="Today"
                    isSearchable
                  />
                </div>

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
                <div className="col-lg-3 col-md-12 ">
                  <button
                    onClick={handleFilterSearch}
                    className="btn btn-primary btn-custom-size "
                  >
                    Search
                  </button>
                </div>
              </div>
              <div className="col-12">
                <div className="headingtable mt-2 p-1 col-lg-12">
                  <div className="row d-flex border p-1 headingss">
                    <div className="col font-second-rem">Suppliers</div>
                    <div className="col font-second-rem"> Services </div>
                    <div className="col font-second-rem"> Pending</div>
                    <div className="col font-second-rem"> Cancelled</div>
                    <div className="col font-second-rem"> Requested</div>
                    <div className="col font-second-rem">Confirmed </div>
                    <div className="col font-second-rem"> Rejected</div>
                    <div className="col font-second-rem">Waitlist </div>
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
            </div>
            <Toaster />
            <Card.Body className="m-0  p-0 fullbody">
              {/* New Table ------ Start */}
              <div className="px-2">
                <PerfectScrollbar>
                  <table
                    ref={tableRefNew}
                    className="table table-bordered itinerary-table mt-2"
                  >
                    <thead>
                      <tr className="text-center ">
                        <th className=" p-1">#</th>
                        <th className=" p-1" style={{ minWidth: "140px" }}>
                          Type
                        </th>
                        <th className=" p-1" style={{ minWidth: "140px" }}>
                          Supplier
                        </th>
                        <th className=" p-1" style={{ minWidth: "140px" }}>
                          CheckIn
                        </th>
                        <th className=" p-1" style={{ minWidth: "140px" }}>
                          CheckOut
                        </th>
                        <th className=" p-1" style={{ minWidth: "140px" }}>
                          Nights
                        </th>
                        <th className=" p-1" style={{ minWidth: "140px" }}>
                          Date(Validity)
                        </th>
                        <th className=" p-1" style={{ minWidth: "140px" }}>
                          Status
                        </th>
                        <th className=" p-1" style={{ minWidth: "140px" }}>
                          Confirmation No
                        </th>
                        <th className=" p-1" style={{ minWidth: "140px" }}>
                          Confirmation Date
                        </th>
                        <th className=" p-1" style={{ minWidth: "140px" }}>
                          Cut Off Date
                        </th>
                        <th className=" p-1" style={{ minWidth: "140px" }}>
                          Confirmed By
                        </th>
                        <th className=" p-1" style={{ minWidth: "140px" }}>
                          Confirmed Note
                        </th>
                        <th className=" p-1" style={{ minWidth: "140px" }}>
                          Vehicle Type
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, index) => (
                        <tr
                          key={index}
                          onClick={() => handleRowClickNew(index)}
                          style={{
                            backgroundColor:
                              statusColorsNew[row.status] || "transparent",
                            cursor: "pointer",
                          }}
                        >
                          {editIndex === index ? (
                            <>
                              <td>
                                <div class="form-check check-sm d-flex align-items-center">
                                  <input
                                    type="checkbox"
                                    class="form-check-input height-em-1 width-em-1"
                                  />
                                </div>
                              </td>
                              <td>
                                <input
                                  className="form-control form-control-sm text-center"
                                  name="type"
                                  value={row.type}
                                  onChange={(e) => handleChangeNew(e, index)}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control form-control-sm text-center"
                                  name="supplier"
                                  value={row.supplier}
                                  onChange={(e) => handleChangeNew(e, index)}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control form-control-sm text-center"
                                  type="date"
                                  name="checkIn"
                                  value={row.checkIn}
                                  onChange={(e) => handleChangeNew(e, index)}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control form-control-sm text-center"
                                  type="date"
                                  name="checkOut"
                                  value={row.checkOut}
                                  onChange={(e) => handleChangeNew(e, index)}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control form-control-sm text-center"
                                  type="number"
                                  name="nights"
                                  value={row.nights}
                                  onChange={(e) => handleChangeNew(e, index)}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control form-control-sm text-center"
                                  name="validity"
                                  value={row.validity}
                                  onChange={(e) => handleChangeNew(e, index)}
                                />
                              </td>
                              <td>
                                <select
                                  className="form-control form-control-sm text-center"
                                  name="status"
                                  value={row.status}
                                  onChange={(e) => handleChangeNew(e, index)}
                                >
                                  {statusOptionsNew.map((status) => (
                                    <option key={status} value={status}>
                                      {status}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td>
                                <input
                                  className="form-control form-control-sm text-center"
                                  name="confirmationNo"
                                  value={row.confirmationNo}
                                  onChange={(e) => handleChangeNew(e, index)}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control form-control-sm text-center"
                                  type="date"
                                  name="confirmationDate"
                                  value={row.confirmationDate}
                                  onChange={(e) => handleChangeNew(e, index)}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control form-control-sm text-center"
                                  type="date"
                                  name="cutOffDate"
                                  value={row.cutOffDate}
                                  onChange={(e) => handleChangeNew(e, index)}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control form-control-sm text-center"
                                  name="confirmedBy"
                                  value={row.confirmedBy}
                                  onChange={(e) => handleChangeNew(e, index)}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control form-control-sm text-center"
                                  name="confirmedNote"
                                  value={row.confirmedNote}
                                  onChange={(e) => handleChangeNew(e, index)}
                                />
                              </td>
                              <td>
                                <select
                                  className="form-control form-control-sm text-center"
                                  name="vehicleType"
                                  value={row.vehicleType}
                                  onChange={(e) => handleChangeNew(e, index)}
                                >
                                  {vehicleOptionsNew.map((vehicle) => (
                                    <option key={vehicle} value={vehicle}>
                                      {vehicle}
                                    </option>
                                  ))}
                                </select>
                              </td>
                            </>
                          ) : (
                            <>
                              <td>
                                <div class="form-check check-sm d-flex align-items-center">
                                  <input
                                    type="checkbox"
                                    class="form-check-input height-em-1 width-em-1"
                                  />
                                </div>
                              </td>
                              <td>
                                <span>{row.type}</span>
                              </td>
                              <td>
                                <span>{row.supplier}</span>
                              </td>
                              <td>
                                <span>{row.checkIn}</span>
                              </td>
                              <td>
                                <span>{row.checkOut}</span>
                              </td>
                              <td>
                                <span>{row.nights}</span>
                              </td>
                              <td>
                                <span>{row.validity}</span>
                              </td>
                              <td>
                                <span>{row.status}</span>
                              </td>
                              <td>
                                <span>{row.confirmationNo}</span>
                              </td>
                              <td>
                                <span>{row.confirmationDate}</span>
                              </td>
                              <td>
                                <span>{row.cutOffDate}</span>
                              </td>
                              <td>
                                <span>{row.confirmedBy}</span>
                              </td>
                              <td>
                                <span>{row.confirmedNote}</span>
                              </td>
                              <td>
                                <span>{row.vehicleType}</span>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </PerfectScrollbar>
              </div>

              {/* New Table----------- End */}
              <div className="row m-2 mt-0 flex justify-content-center">
                {reservationList &&
                  reservationList.length > 0 &&
                  reservationList?.map((service, index) => {
                    return service?.Service?.ServiceType == "Hotel" ? (
                      <div className={`${styles.cardContainer} mt-4`}>
                        <div className={styles.serviceCard}>
                          <div className={styles.serviceHead}>
                            <span className={styles.supplierText}>
                              {service?.Service?.ServiceType}
                            </span>
                            <div className={styles.supplierInfo}>
                              <span className={styles.supplierName}>
                                Supplier :{" "}
                                <span className={styles.supplierDetails}>
                                  {
                                    service?.Service?.ServiceDetails[0]
                                      ?.ItemSupplierDetail?.ItemSupplierName
                                  }
                                </span>
                              </span>
                            </div>
                            <div className={styles.paymentInfo}>
                              <span className={styles.paymentTerms}>
                                Payment Terms :{" "}
                                <span className={styles.supplierDetails}></span>
                              </span>
                            </div>
                            <div className={styles.reservationButtonContainer}>
                              <button
                                onClick={() =>
                                  handleSendReservationRequest(service?.Service)
                                }
                                className="border-0 reservation-button"
                              >
                                SEND RESERVATION REQUEST
                              </button>
                            </div>
                          </div>
                          <div className={styles.serviceBody}>
                            <div className={styles.tableContainer}>
                              <Table
                                responsive
                                bordered
                                className={`${styles.serviceTable} mb-2`}
                              >
                                <tbody>
                                  <tr>
                                    <td className={styles.tableCell}>
                                      <span className={styles.supplierDetails}>
                                        {
                                          service?.Service?.ServiceDetails[0]
                                            .ItemName
                                        }
                                      </span>
                                    </td>
                                    <td className={styles.tableCell}>
                                      <span className={styles.supplierName}>
                                        CheckIn :{" "}
                                        <span
                                          className={styles.supplierDetails}
                                        >
                                          {service?.Service?.ServiceDetails[0]
                                            ?.TimingDetails?.ItemFromDate &&
                                            new Date(
                                              service.Service.ServiceDetails[0].TimingDetails.ItemFromDate
                                            ).toLocaleDateString("en-GB", {
                                              day: "2-digit",
                                              month: "short",
                                              year: "numeric",
                                            })}
                                        </span>
                                      </span>
                                    </td>
                                    <td className={styles.tableCell}>
                                      <span className={styles.supplierName}>
                                        CheckOut :{" "}
                                        <span
                                          className={styles.supplierDetails}
                                        >
                                          {service?.Service?.ServiceDetails[0]
                                            ?.TimingDetails?.ItemToDate &&
                                            new Date(
                                              service.Service.ServiceDetails[0].TimingDetails.ItemToDate
                                            ).toLocaleDateString("en-GB", {
                                              day: "2-digit",
                                              month: "short",
                                              year: "numeric",
                                            })}
                                        </span>
                                      </span>
                                    </td>
                                    <td className={styles.tableCell}>
                                      <span className={styles.supplierDetails}>
                                        {service?.TotalNights} Night(s)
                                      </span>
                                    </td>
                                    <td
                                      className={`${styles.statusSelect} ${styles.tableCell}`}
                                    >
                                      <select
                                        name="ReservationStatus"
                                        className={`${styles.statusDropdown} form-control form-control-sm `}
                                        value={
                                          confirmStatusForm[index]
                                            ?.ReservationStatus
                                        }
                                        onChange={(e) =>
                                          handleConfirmStatusForm(
                                            e,
                                            index,
                                            service
                                          )
                                        }
                                      >
                                        <option value="Pending">Pending</option>
                                        <option value="Cancelled">
                                          Cancelled
                                        </option>
                                        <option value="Requested">
                                          Requested
                                        </option>
                                        <option value="Confirmed">
                                          Confirmed
                                        </option>
                                        <option value="Rejected">
                                          Rejected
                                        </option>
                                        <option value="Waitlist">
                                          Waitlist
                                        </option>
                                      </select>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className={styles.tableCell}>
                                      <div className={styles.dateRoomInfo}>
                                        <div>
                                          <span
                                            className={styles.supplierDetails}
                                          >
                                            {service?.Service?.ServiceDetails[0]
                                              ?.TimingDetails?.ItemFromDate &&
                                              new Date(
                                                service.Service.ServiceDetails[0].TimingDetails.ItemFromDate
                                              ).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                              })}
                                          </span>{" "}
                                          -{" "}
                                          <span
                                            className={styles.supplierDetails}
                                          >
                                            {service?.Service?.ServiceDetails[0]
                                              ?.TimingDetails?.ItemToDate &&
                                              new Date(
                                                service.Service.ServiceDetails[0].TimingDetails.ItemToDate
                                              ).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                              })}
                                          </span>
                                        </div>
                                      </div>
                                    </td>
                                    <td className={styles.tableCell}>
                                      <span className={styles.supplierDetails}>
                                        {service?.Service?.RoomCategoryName}
                                      </span>
                                    </td>
                                    <td
                                      colSpan={3}
                                      className={styles.tableCell}
                                    >
                                      <span className={styles.supplierDetails}>
                                        {service?.Service?.MealPlanName}
                                      </span>
                                    </td>
                                  </tr>
                                </tbody>
                              </Table>
                              <div className={styles.specialRequest}>
                                <input
                                  type="text"
                                  className="form-control form-control-sm m-0"
                                  style={{ height: "25px", width: "15rem" }}
                                  placeholder="Special Request and Remarks"
                                  value={specialRequest}
                                  onChange={(e) =>
                                    setSpecialRequest(e.target.value)
                                  }
                                />

                                <button
                                  onClick={() =>
                                    handleRemarksSave(service, index)
                                  }
                                  className={styles.editButton}
                                >
                                  Save
                                </button>
                              </div>

                              <div className={styles.confirmationSection}>
                                <div className={styles.confirmationRow}>
                                  {/* Label View: always show, but hide via class if editing */}
                                  <div
                                    className={`${styles.confirmationRow} ${
                                      editingIndexes.includes(index) &&
                                      confirmStatusForm[index]
                                        ?.ReservationStatus === "Confirmed"
                                        ? "d-none"
                                        : ""
                                    }`}
                                  >
                                    <div className={styles.confirmationField}>
                                      <label>Confirmation No:</label>
                                      <span>
                                        {confirmStatusForm[index]
                                          ?.ConfirmationNo || "-"}
                                      </span>
                                    </div>
                                    <div className={styles.confirmationField}>
                                      <label>Confirmation Date:</label>
                                      <span>
                                        {confirmStatusForm[index]
                                          ?.ConfirmationDate || "-"}
                                      </span>
                                    </div>
                                    <div className={styles.confirmationField}>
                                      <label>Cut Off Date:</label>
                                      <span>
                                        {confirmStatusForm[index]?.CutOfDate ||
                                          "-"}
                                      </span>
                                    </div>
                                    <div className={styles.confirmationField}>
                                      <label>Confirmed By:</label>
                                      <span>
                                        {confirmStatusForm[index]
                                          ?.ConfirmedBy || "-"}
                                      </span>
                                    </div>
                                    <div className={styles.confirmationField}>
                                      <label>Confirmed Note:</label>
                                      <span>
                                        {confirmStatusForm[index]
                                          ?.ConfirmedNote || "-"}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Input View: only show if editing and status is Confirmed */}
                                  {editingIndexes.includes(index) &&
                                    confirmStatusForm[index]
                                      ?.ReservationStatus === "Confirmed" && (
                                      <div className={styles.confirmationRow}>
                                        <div
                                          className={styles.confirmationField}
                                        >
                                          <label>Confirmation No:</label>
                                          <input
                                            type="text"
                                            className={`${styles.formInput} form-control form-control-sm`}
                                            name="ConfirmationNo"
                                            value={
                                              confirmStatusForm[index]
                                                ?.ConfirmationNo || ""
                                            }
                                            onChange={(e) =>
                                              handleConfirmStatusForm(e, index)
                                            }
                                          />
                                        </div>
                                        <div
                                          className={styles.confirmationField}
                                        >
                                          <label>Confirmation Date:</label>
                                          <DatePicker
                                            isClearable
                                            todayButton="Today"
                                            selected={parseDDMMYYYY(
                                              confirmStatusForm[index]
                                                ?.ConfirmationDate
                                            )}
                                            onChange={(date) =>
                                              handleConfirmDate(date, index)
                                            }
                                            className={`${styles.datePicker} form-control form-control-sm`}
                                            dateFormat="dd-MM-yyyy"
                                            autoComplete="off"
                                          />
                                        </div>
                                        <div
                                          className={styles.confirmationField}
                                        >
                                          <label>Cut Off Date:</label>
                                          <DatePicker
                                            className={`${styles.datePicker} form-control form-control-sm`}
                                            dateFormat="dd-MM-yyyy"
                                            autoComplete="off"
                                            isClearable
                                            todayButton="Today"
                                            selected={parseDDMMYYYY(
                                              confirmStatusForm[index]
                                                ?.CutOfDate
                                            )}
                                            onChange={(date) =>
                                              handleCutoffCalender(date, index)
                                            }
                                          />
                                        </div>
                                        <div
                                          className={styles.confirmationField}
                                        >
                                          <label>Confirmed By:</label>
                                          <input
                                            type="text"
                                            className={`${styles.formInput} form-control form-control-sm`}
                                            name="ConfirmedBy"
                                            value={
                                              confirmStatusForm[index]
                                                ?.ConfirmedBy || ""
                                            }
                                            onChange={(e) =>
                                              handleConfirmStatusForm(e, index)
                                            }
                                          />
                                        </div>
                                        <div
                                          className={styles.confirmationField}
                                        >
                                          <label>Confirmed Note:</label>
                                          <input
                                            type="text"
                                            className={`${styles.formInput} form-control form-control-sm`}
                                            name="ConfirmedNote"
                                            value={
                                              confirmStatusForm[index]
                                                ?.ConfirmedNote || ""
                                            }
                                            onChange={(e) =>
                                              handleConfirmStatusForm(e, index)
                                            }
                                          />
                                        </div>
                                      </div>
                                    )}
                                </div>

                                {/* Buttons section (same as before) */}
                                {confirmStatusForm[index]?.ReservationStatus ===
                                  "Confirmed" && (
                                  <div
                                    className={`${styles.buttonGroup} mt-2 d-flex align-items-center justify-content-end gap-2`}
                                  >
                                    {!editingIndexes.includes(index) ? (
                                      <button
                                        className={styles.editButton}
                                        onClick={() =>
                                          handleUpdateTableEdit(index)
                                        }
                                        aria-label="Edit confirmation details"
                                      >
                                        Edit
                                      </button>
                                    ) : (
                                      <>
                                        <button
                                          className={styles.cancelButton}
                                          onClick={() =>
                                            handleCancelEdit(index)
                                          }
                                          aria-label="Cancel editing confirmation details"
                                        >
                                          Cancel
                                        </button>
                                        <button
                                          className={styles.saveButton}
                                          onClick={() =>
                                            handleSave(service, index, "single")
                                          }
                                          aria-label="Save confirmation details"
                                        >
                                          Save
                                        </button>
                                      </>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : service?.Service?.ServiceType == "Monument" ? (
                      <div className={`${styles.cardContainer} mt-4`}>
                        <div className={styles.serviceCard}>
                          <div className={styles.serviceHead}>
                            <span className={styles.supplierText}>
                              {service?.Service?.ServiceType}
                            </span>
                            <div className={styles.supplierInfo}>
                              <span className={styles.supplierName}>
                                Supplier :{" "}
                                <span className={styles.supplierDetails}>
                                  {
                                    service?.Service?.ServiceDetails[0]
                                      ?.ItemSupplierDetail?.ItemSupplierName
                                  }
                                </span>
                              </span>
                            </div>
                            <div className={styles.paymentInfo}>
                              <span className={styles.paymentTerms}>
                                Payment Terms :{" "}
                                <span className={styles.supplierDetails}></span>
                              </span>
                            </div>
                            <div className={styles.reservationButtonContainer}>
                              <button
                                className="border-0 reservation-button"
                                onClick={() => {
                                  display();
                                }}
                              >
                                SEND RESERVATION REQUEST
                              </button>
                            </div>
                          </div>
                          <div className={styles.serviceBody}>
                            <div className={styles.tableContainer}>
                              <Table
                                responsive
                                bordered
                                className={`${styles.serviceTable} mb-2`}
                              >
                                <tbody>
                                  <tr>
                                    <td className={styles.tableCell}>
                                      <span className={styles.supplierDetails}>
                                        {
                                          service?.Service?.ServiceDetails[0]
                                            .ItemName
                                        }
                                      </span>
                                    </td>
                                    <td className={styles.tableCell}>
                                      <span className={styles.supplierName}>
                                        CheckIn :{" "}
                                        <span
                                          className={styles.supplierDetails}
                                        >
                                          {
                                            service?.Service?.ServiceDetails[0]
                                              .TimingDetails?.ItemFromDate
                                          }
                                        </span>
                                      </span>
                                    </td>
                                    <td className={styles.tableCell}>
                                      <span className={styles.supplierName}>
                                        CheckOut :{" "}
                                        <span
                                          className={styles.supplierDetails}
                                        >
                                          {
                                            service?.Service?.ServiceDetails[0]
                                              .TimingDetails?.ItemToDate
                                          }
                                        </span>
                                      </span>
                                    </td>
                                    <td className={styles.tableCell}>
                                      <span className={styles.supplierDetails}>
                                        {service?.TotalNights} Night(s)
                                      </span>
                                    </td>
                                    <td
                                      className={`${styles.statusSelect} ${styles.tableCell}`}
                                    >
                                      <select
                                        name="ReservationStatus"
                                        className={`${styles.statusDropdown} form-control form-control-sm `}
                                        value={
                                          confirmStatusForm[index]
                                            ?.ReservationStatus
                                        }
                                        onChange={(e) =>
                                          handleConfirmStatusForm(
                                            e,
                                            index,
                                            service
                                          )
                                        }
                                      >
                                        <option value="Pending">Pending</option>
                                        <option value="Cancelled">
                                          Cancelled
                                        </option>
                                        <option value="Requested">
                                          Requested
                                        </option>
                                        <option value="Confirmed">
                                          Confirmed
                                        </option>
                                        <option value="Rejected">
                                          Rejected
                                        </option>
                                        <option value="Waitlist">
                                          Waitlist
                                        </option>
                                      </select>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className={styles.tableCell}>
                                      <div className={styles.dateRoomInfo}>
                                        <div>
                                          <span
                                            className={styles.supplierDetails}
                                          >
                                            {service?.Service?.ServiceDetails[0]
                                              ?.TimingDetails?.ItemFromDate &&
                                              new Date(
                                                service.Service.ServiceDetails[0].TimingDetails.ItemFromDate
                                              ).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                              })}
                                          </span>{" "}
                                          -{" "}
                                          <span
                                            className={styles.supplierDetails}
                                          >
                                            {service?.Service?.ServiceDetails[0]
                                              ?.TimingDetails?.ItemToDate &&
                                              new Date(
                                                service.Service.ServiceDetails[0].TimingDetails.ItemToDate
                                              ).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                              })}
                                          </span>
                                        </div>
                                        {/* <span>
                                          {service?.Service?.RoomCategoryName}
                                        </span>
                                        <span>
                                          {service?.Service?.MealPlanName}
                                        </span> */}
                                      </div>
                                    </td>
                                    <td className={styles.tableCell}>
                                      <span className={styles.supplierDetails}>
                                        {service?.Service?.RoomCategoryName}
                                      </span>
                                    </td>
                                    <td
                                      colSpan={3}
                                      className={styles.tableCell}
                                    >
                                      <span className={styles.supplierDetails}>
                                        {service?.Service?.MealPlanName}
                                      </span>
                                    </td>
                                  </tr>
                                </tbody>
                              </Table>
                              <div className={styles.specialRequest}>
                                <input
                                  type="text"
                                  className="form-control form-control-sm m-0"
                                  style={{ height: "25px", width: "15rem" }}
                                  placeholder="Special Request and Remarks"
                                />
                              </div>

                              <div className={styles.confirmationSection}>
                                <div className={styles.confirmationRow}>
                                  {/* Label View */}
                                  <div
                                    className={`${styles.confirmationRow} ${
                                      editingIndexes.includes(index) &&
                                      confirmStatusForm[index]
                                        ?.ReservationStatus === "Confirmed"
                                        ? "d-none"
                                        : ""
                                    }`}
                                  >
                                    <div className={styles.confirmationField}>
                                      <label>Confirmation No:</label>
                                      <span>
                                        {confirmStatusForm[index]
                                          ?.ConfirmationNo || "-"}
                                      </span>
                                    </div>
                                    <div className={styles.confirmationField}>
                                      <label>Confirmation Date:</label>
                                      <span>
                                        {confirmStatusForm[index]
                                          ?.ConfirmationDate || "-"}
                                      </span>
                                    </div>
                                    <div className={styles.confirmationField}>
                                      <label>Cut Off Date:</label>
                                      <span>
                                        {confirmStatusForm[index]?.CutOfDate ||
                                          "-"}
                                      </span>
                                    </div>
                                    <div className={styles.confirmationField}>
                                      <label>Confirmed By:</label>
                                      <span>
                                        {confirmStatusForm[index]
                                          ?.ConfirmedBy || "-"}
                                      </span>
                                    </div>
                                    <div className={styles.confirmationField}>
                                      <label>Confirmed Note:</label>
                                      <span>
                                        {confirmStatusForm[index]
                                          ?.ConfirmedNote || "-"}
                                      </span>
                                    </div>
                                    <div className={styles.confirmationField}>
                                      <label>Vehicle Type:</label>
                                      <span>
                                        {confirmStatusForm[index]
                                          ?.VehicleType || "-"}
                                      </span>
                                    </div>
                                    <div className={styles.confirmationField}>
                                      <label>Start Time:</label>
                                      <span>
                                        {confirmStatusForm[index]?.StartTime ||
                                          "-"}
                                      </span>
                                    </div>
                                    <div className={styles.confirmationField}>
                                      <label>End Time:</label>
                                      <span>
                                        {confirmStatusForm[index]?.EndTime ||
                                          "-"}
                                      </span>
                                    </div>
                                    <div className={styles.confirmationField}>
                                      <label>Pickup Time:</label>
                                      <span>
                                        {confirmStatusForm[index]?.PickupTime ||
                                          "-"}
                                      </span>
                                    </div>
                                    <div className={styles.confirmationField}>
                                      <label>Drop Time:</label>
                                      <span>
                                        {confirmStatusForm[index]?.DropTime ||
                                          "-"}
                                      </span>
                                    </div>
                                    <div className={styles.confirmationField}>
                                      <label>Pickup Address:</label>
                                      <span>
                                        {confirmStatusForm[index]
                                          ?.PickupAddress || "-"}
                                      </span>
                                    </div>
                                    <div className={styles.confirmationField}>
                                      <label>Drop Address:</label>
                                      <span>
                                        {confirmStatusForm[index]
                                          ?.DropAddress || "-"}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Input View */}
                                  {editingIndexes.includes(index) &&
                                    confirmStatusForm[index]
                                      ?.ReservationStatus === "Confirmed" && (
                                      <div className={styles.confirmationRow}>
                                        <div
                                          className={styles.confirmationField}
                                        >
                                          <label>Confirmation No:</label>
                                          <input
                                            type="text"
                                            className={`${styles.formInput} form-control form-control-sm`}
                                            name="ConfirmationNo"
                                            value={
                                              confirmStatusForm[index]
                                                ?.ConfirmationNo || ""
                                            }
                                            onChange={(e) =>
                                              handleConfirmStatusForm(e, index)
                                            }
                                          />
                                        </div>
                                        <div
                                          className={styles.confirmationField}
                                        >
                                          <label>Confirmation Date:</label>
                                          <DatePicker
                                            isClearable
                                            todayButton="Today"
                                            selected={parseDDMMYYYY(
                                              confirmStatusForm[index]
                                                ?.ConfirmationDate
                                            )}
                                            onChange={(date) =>
                                              handleConfirmDate(date, index)
                                            }
                                            className={`${styles.datePicker} form-control form-control-sm`}
                                            dateFormat="dd-MM-yyyy"
                                            autoComplete="off"
                                          />
                                        </div>
                                        <div
                                          className={styles.confirmationField}
                                        >
                                          <label>Cut Off Date:</label>
                                          <DatePicker
                                            className={`${styles.datePicker} form-control form-control-sm`}
                                            dateFormat="dd-MM-yyyy"
                                            autoComplete="off"
                                            isClearable
                                            todayButton="Today"
                                            selected={parseDDMMYYYY(
                                              confirmStatusForm[index]
                                                ?.CutOfDate
                                            )}
                                            onChange={(date) =>
                                              handleCutoffCalender(date, index)
                                            }
                                          />
                                        </div>
                                        <div
                                          className={styles.confirmationField}
                                        >
                                          <label>Confirmed By:</label>
                                          <input
                                            type="text"
                                            className={`${styles.formInput} form-control form-control-sm`}
                                            name="ConfirmedBy"
                                            value={
                                              confirmStatusForm[index]
                                                ?.ConfirmedBy || ""
                                            }
                                            onChange={(e) =>
                                              handleConfirmStatusForm(e, index)
                                            }
                                          />
                                        </div>
                                        <div
                                          className={styles.confirmationField}
                                        >
                                          <label>Confirmed Note:</label>
                                          <input
                                            type="text"
                                            className={`${styles.formInput} form-control form-control-sm`}
                                            name="ConfirmedNote"
                                            value={
                                              confirmStatusForm[index]
                                                ?.ConfirmedNote || ""
                                            }
                                            onChange={(e) =>
                                              handleConfirmStatusForm(e, index)
                                            }
                                          />
                                        </div>
                                        <div
                                          className={styles.confirmationField}
                                        >
                                          <label>Vehicle Type:</label>
                                          <select
                                            name="VehicleType"
                                            className={`${styles.statusDropdown} form-control form-control-sm`}
                                            value={
                                              confirmStatusForm[index]
                                                ?.VehicleType || ""
                                            }
                                            onChange={(e) =>
                                              handleConfirmStatusForm(e, index)
                                            }
                                          >
                                            <option value="">
                                              Select Vehicle Type
                                            </option>
                                            {vehicleTypeList.map(
                                              (vehicle, idx) => (
                                                <option
                                                  key={idx}
                                                  value={vehicle.value}
                                                >
                                                  {vehicle.label}
                                                </option>
                                              )
                                            )}
                                          </select>
                                        </div>
                                        <div
                                          className={styles.confirmationField}
                                        >
                                          <label>Start Time:</label>
                                          <input
                                            type="time"
                                            className={`${styles.timePicker} form-control form-control-sm`}
                                            name="StartTime"
                                            value={
                                              confirmStatusForm[index]
                                                ?.StartTime || ""
                                            }
                                            onChange={(e) =>
                                              handleConfirmStatusForm(e, index)
                                            }
                                          />
                                        </div>
                                        <div
                                          className={styles.confirmationField}
                                        >
                                          <label>End Time:</label>
                                          <input
                                            type="time"
                                            className={`${styles.timePicker} form-control form-control-sm`}
                                            name="EndTime"
                                            value={
                                              confirmStatusForm[index]
                                                ?.EndTime || ""
                                            }
                                            onChange={(e) =>
                                              handleConfirmStatusForm(e, index)
                                            }
                                          />
                                        </div>
                                        <div
                                          className={styles.confirmationField}
                                        >
                                          <label>Pickup Time:</label>
                                          <input
                                            type="time"
                                            className={`${styles.timePicker} form-control form-control-sm`}
                                            name="PickupTime"
                                            value={
                                              confirmStatusForm[index]
                                                ?.PickupTime || ""
                                            }
                                            onChange={(e) =>
                                              handleConfirmStatusForm(e, index)
                                            }
                                          />
                                        </div>
                                        <div
                                          className={styles.confirmationField}
                                        >
                                          <label>Drop Time:</label>
                                          <input
                                            type="time"
                                            className={`${styles.timePicker} form-control form-control-sm`}
                                            name="DropTime"
                                            value={
                                              confirmStatusForm[index]
                                                ?.DropTime || ""
                                            }
                                            onChange={(e) =>
                                              handleConfirmStatusForm(e, index)
                                            }
                                          />
                                        </div>
                                        <div
                                          className={styles.confirmationField}
                                        >
                                          <label>Pickup Address:</label>
                                          <textarea
                                            className={`${styles.formTextarea} form-control form-control-sm`}
                                            name="PickupAddress"
                                            value={
                                              confirmStatusForm[index]
                                                ?.PickupAddress || ""
                                            }
                                            onChange={(e) =>
                                              handleConfirmStatusForm(e, index)
                                            }
                                          />
                                        </div>
                                        <div
                                          className={styles.confirmationField}
                                        >
                                          <label>Drop Address:</label>
                                          <textarea
                                            className={`${styles.formTextarea} form-control form-control-sm`}
                                            name="DropAddress"
                                            value={
                                              confirmStatusForm[index]
                                                ?.DropAddress || ""
                                            }
                                            onChange={(e) =>
                                              handleConfirmStatusForm(e, index)
                                            }
                                          />
                                        </div>
                                      </div>
                                    )}
                                </div>

                                {/* Button group - only if status is Confirmed */}
                                {confirmStatusForm[index]?.ReservationStatus ===
                                  "Confirmed" && (
                                  <div
                                    className={`${styles.buttonGroup} mt-2 d-flex align-items-center justify-content-end gap-2`}
                                  >
                                    {!editingIndexes.includes(index) ? (
                                      <button
                                        className={styles.editButton}
                                        onClick={() =>
                                          handleUpdateTableEdit(index)
                                        }
                                        aria-label="Edit confirmation details"
                                      >
                                        Edit
                                      </button>
                                    ) : (
                                      <>
                                        <button
                                          className={styles.cancelButton}
                                          onClick={() =>
                                            handleCancelEdit(index)
                                          }
                                          aria-label="Cancel editing confirmation details"
                                        >
                                          Cancel
                                        </button>
                                        <button
                                          className={styles.saveButton}
                                          onClick={() =>
                                            handleSave(service, index, "single")
                                          }
                                          aria-label="Save confirmation details"
                                        >
                                          Save
                                        </button>
                                      </>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : service?.Service?.ServiceType == "Activity" ? (
                      <div className={`${styles.cardContainer} mt-4`}>
                        <div className={styles.serviceCard}>
                          <div className={styles.serviceHead}>
                            <span className={styles.supplierText}>
                              {service?.Service?.ServiceType}
                            </span>
                            <div className={styles.supplierInfo}>
                              <span className={styles.supplierName}>
                                Supplier :{" "}
                                <span className={styles.supplierDetails}>
                                  {
                                    service?.Service?.ServiceDetails[0]
                                      ?.ItemSupplierDetail?.ItemSupplierName
                                  }
                                </span>
                              </span>
                            </div>
                            <div className={styles.paymentInfo}>
                              <span className={styles.paymentTerms}>
                                Payment Terms :{" "}
                                <span className={styles.supplierDetails}></span>
                              </span>
                            </div>
                            <div className={styles.reservationButtonContainer}>
                              <button
                                className="border-0 reservation-button"
                                onClick={() => {
                                  display();
                                }}
                              >
                                SEND RESERVATION REQUEST
                              </button>
                            </div>
                          </div>
                          <div className={styles.serviceBody}>
                            <div className={styles.tableContainer}>
                              <Table
                                responsive
                                bordered
                                className={`${styles.serviceTable} mb-2`}
                              >
                                <tbody>
                                  <tr>
                                    <td className={styles.tableCell}>
                                      <span className={styles.supplierDetails}>
                                        {
                                          service?.Service?.ServiceDetails[0]
                                            .ItemName
                                        }
                                      </span>
                                    </td>
                                    <td className={styles.tableCell}>
                                      <span className={styles.supplierName}>
                                        CheckIn :{" "}
                                        <span
                                          className={styles.supplierDetails}
                                        >
                                          {
                                            service?.Service?.ServiceDetails[0]
                                              .TimingDetails?.ItemFromDate
                                          }
                                        </span>
                                      </span>
                                    </td>
                                    <td className={styles.tableCell}>
                                      <span className={styles.supplierName}>
                                        CheckOut :{" "}
                                        <span
                                          className={styles.supplierDetails}
                                        >
                                          {" "}
                                          {
                                            service?.Service?.ServiceDetails[0]
                                              .TimingDetails?.ItemToDate
                                          }
                                        </span>
                                      </span>
                                    </td>
                                    <td className={styles.tableCell}>
                                      <span className={styles.supplierDetails}>
                                        {service?.TotalNights} Night(s)
                                      </span>
                                    </td>
                                    <td
                                      className={`${styles.statusSelect} ${styles.tableCell}`}
                                    >
                                      <select
                                        name="ReservationStatus"
                                        className={`${styles.statusDropdown} form-control form-control-sm `}
                                        value={
                                          confirmStatusForm[index]
                                            ?.ReservationStatus
                                        }
                                        onChange={(e) =>
                                          handleConfirmStatusForm(
                                            e,
                                            index,
                                            service
                                          )
                                        }
                                      >
                                        <option value="Pending">Pending</option>
                                        <option value="Cancelled">
                                          Cancelled
                                        </option>
                                        <option value="Requested">
                                          Requested
                                        </option>
                                        <option value="Confirmed">
                                          Confirmed
                                        </option>
                                        <option value="Rejected">
                                          Rejected
                                        </option>
                                        <option value="Waitlist">
                                          Waitlist
                                        </option>
                                      </select>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className={styles.tableCell}>
                                      <div className={styles.dateRoomInfo}>
                                        <div>
                                          <span
                                            className={styles.supplierDetails}
                                          >
                                            {service?.Service?.ServiceDetails[0]
                                              ?.TimingDetails?.ItemFromDate &&
                                              new Date(
                                                service.Service.ServiceDetails[0].TimingDetails.ItemFromDate
                                              ).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                              })}
                                          </span>{" "}
                                          -{" "}
                                          <span
                                            className={styles.supplierDetails}
                                          >
                                            {service?.Service?.ServiceDetails[0]
                                              ?.TimingDetails?.ItemToDate &&
                                              new Date(
                                                service.Service.ServiceDetails[0].TimingDetails.ItemToDate
                                              ).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                              })}
                                          </span>
                                        </div>
                                        {/* <span>
                                          {service?.Service?.RoomCategoryName}
                                        </span>
                                        <span>
                                          {service?.Service?.MealPlanName}
                                        </span> */}
                                      </div>
                                    </td>
                                    <td className={styles.tableCell}>
                                      <span className={styles.supplierDetails}>
                                        {service?.Service?.RoomCategoryName}
                                      </span>
                                    </td>
                                    <td
                                      colSpan={3}
                                      className={styles.tableCell}
                                    >
                                      <span className={styles.supplierDetails}>
                                        {service?.Service?.MealPlanName}
                                      </span>
                                    </td>
                                  </tr>
                                </tbody>
                              </Table>
                              <div className={styles.specialRequest}>
                                <input
                                  type="text"
                                  className="form-control form-control-sm m-0"
                                  style={{ height: "25px", width: "15rem" }}
                                  placeholder="Special Request and Remarks"
                                />
                              </div>

                              <div className={styles.confirmationSection}>
                                <div className={styles.confirmationRow}>
                                  {/* Label View */}
                                  <div
                                    className={`${styles.confirmationRow} ${
                                      editingIndexes.includes(index) &&
                                      confirmStatusForm[index]
                                        ?.ReservationStatus === "Confirmed"
                                        ? "d-none"
                                        : ""
                                    }`}
                                  >
                                    <div className={styles.confirmationField}>
                                      <label>Confirmation No:</label>
                                      <span>
                                        {confirmStatusForm[index]
                                          ?.ConfirmationNo || "-"}
                                      </span>
                                    </div>
                                    <div className={styles.confirmationField}>
                                      <label>Confirmation Date:</label>
                                      <span>
                                        {confirmStatusForm[index]
                                          ?.ConfirmationDate || "-"}
                                      </span>
                                    </div>
                                    <div className={styles.confirmationField}>
                                      <label>Cut Off Date:</label>
                                      <span>
                                        {confirmStatusForm[index]?.CutOfDate ||
                                          "-"}
                                      </span>
                                    </div>
                                    <div className={styles.confirmationField}>
                                      <label>Confirmed By:</label>
                                      <span>
                                        {confirmStatusForm[index]
                                          ?.ConfirmedBy || "-"}
                                      </span>
                                    </div>
                                    <div className={styles.confirmationField}>
                                      <label>Confirmed Note:</label>
                                      <span>
                                        {confirmStatusForm[index]
                                          ?.ConfirmedNote || "-"}
                                      </span>
                                    </div>
                                    <div className={styles.confirmationField}>
                                      <label>Vehicle Type:</label>
                                      <span>
                                        {confirmStatusForm[index]
                                          ?.VehicleType || "-"}
                                      </span>
                                    </div>
                                    <div className={styles.confirmationField}>
                                      <label>Start Time:</label>
                                      <span>
                                        {confirmStatusForm[index]?.StartTime ||
                                          "-"}
                                      </span>
                                    </div>
                                    <div className={styles.confirmationField}>
                                      <label>End Time:</label>
                                      <span>
                                        {confirmStatusForm[index]?.EndTime ||
                                          "-"}
                                      </span>
                                    </div>
                                    <div className={styles.confirmationField}>
                                      <label>Pickup Time:</label>
                                      <span>
                                        {confirmStatusForm[index]?.PickupTime ||
                                          "-"}
                                      </span>
                                    </div>
                                    <div className={styles.confirmationField}>
                                      <label>Drop Time:</label>
                                      <span>
                                        {confirmStatusForm[index]?.DropTime ||
                                          "-"}
                                      </span>
                                    </div>
                                    <div className={styles.confirmationField}>
                                      <label>Pickup Address:</label>
                                      <span>
                                        {confirmStatusForm[index]
                                          ?.PickupAddress || "-"}
                                      </span>
                                    </div>
                                    <div className={styles.confirmationField}>
                                      <label>Drop Address:</label>
                                      <span>
                                        {confirmStatusForm[index]
                                          ?.DropAddress || "-"}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Input View */}
                                  {editingIndexes.includes(index) &&
                                    confirmStatusForm[index]
                                      ?.ReservationStatus === "Confirmed" && (
                                      <div className={styles.confirmationRow}>
                                        <div
                                          className={styles.confirmationField}
                                        >
                                          <label>Confirmation No:</label>
                                          <input
                                            type="text"
                                            className={`${styles.formInput} form-control form-control-sm`}
                                            name="ConfirmationNo"
                                            value={
                                              confirmStatusForm[index]
                                                ?.ConfirmationNo || ""
                                            }
                                            onChange={(e) =>
                                              handleConfirmStatusForm(e, index)
                                            }
                                          />
                                        </div>
                                        <div
                                          className={styles.confirmationField}
                                        >
                                          <label>Confirmation Date:</label>
                                          <DatePicker
                                            isClearable
                                            todayButton="Today"
                                            selected={parseDDMMYYYY(
                                              confirmStatusForm[index]
                                                ?.ConfirmationDate
                                            )}
                                            onChange={(date) =>
                                              handleConfirmDate(date, index)
                                            }
                                            className={`${styles.datePicker} form-control form-control-sm`}
                                            dateFormat="dd-MM-yyyy"
                                            autoComplete="off"
                                          />
                                        </div>
                                        <div
                                          className={styles.confirmationField}
                                        >
                                          <label>Cut Off Date:</label>
                                          <DatePicker
                                            className={`${styles.datePicker} form-control form-control-sm`}
                                            dateFormat="dd-MM-yyyy"
                                            autoComplete="off"
                                            isClearable
                                            todayButton="Today"
                                            selected={parseDDMMYYYY(
                                              confirmStatusForm[index]
                                                ?.CutOfDate
                                            )}
                                            onChange={(date) =>
                                              handleCutoffCalender(date, index)
                                            }
                                          />
                                        </div>
                                        <div
                                          className={styles.confirmationField}
                                        >
                                          <label>Confirmed By:</label>
                                          <input
                                            type="text"
                                            className={`${styles.formInput} form-control form-control-sm`}
                                            name="ConfirmedBy"
                                            value={
                                              confirmStatusForm[index]
                                                ?.ConfirmedBy || ""
                                            }
                                            onChange={(e) =>
                                              handleConfirmStatusForm(e, index)
                                            }
                                          />
                                        </div>
                                        <div
                                          className={styles.confirmationField}
                                        >
                                          <label>Confirmed Note:</label>
                                          <input
                                            type="text"
                                            className={`${styles.formInput} form-control form-control-sm`}
                                            name="ConfirmedNote"
                                            value={
                                              confirmStatusForm[index]
                                                ?.ConfirmedNote || ""
                                            }
                                            onChange={(e) =>
                                              handleConfirmStatusForm(e, index)
                                            }
                                          />
                                        </div>
                                        <div
                                          className={styles.confirmationField}
                                        >
                                          <label>Vehicle Type:</label>
                                          <select
                                            name="VehicleType"
                                            className={`${styles.statusDropdown} form-control form-control-sm`}
                                            value={
                                              confirmStatusForm[index]
                                                ?.VehicleType || ""
                                            }
                                            onChange={(e) =>
                                              handleConfirmStatusForm(e, index)
                                            }
                                          >
                                            <option value="">
                                              Select Vehicle Type
                                            </option>
                                            {vehicleTypeList.map(
                                              (vehicle, idx) => (
                                                <option
                                                  key={idx}
                                                  value={vehicle.value}
                                                >
                                                  {vehicle.label}
                                                </option>
                                              )
                                            )}
                                          </select>
                                        </div>
                                        <div
                                          className={styles.confirmationField}
                                        >
                                          <label>Start Time:</label>
                                          <input
                                            type="time"
                                            className={`${styles.timePicker} form-control form-control-sm`}
                                            name="StartTime"
                                            value={
                                              confirmStatusForm[index]
                                                ?.StartTime || ""
                                            }
                                            onChange={(e) =>
                                              handleConfirmStatusForm(e, index)
                                            }
                                          />
                                        </div>
                                        <div
                                          className={styles.confirmationField}
                                        >
                                          <label>End Time:</label>
                                          <input
                                            type="time"
                                            className={`${styles.timePicker} form-control form-control-sm`}
                                            name="EndTime"
                                            value={
                                              confirmStatusForm[index]
                                                ?.EndTime || ""
                                            }
                                            onChange={(e) =>
                                              handleConfirmStatusForm(e, index)
                                            }
                                          />
                                        </div>
                                        <div
                                          className={styles.confirmationField}
                                        >
                                          <label>Pickup Time:</label>
                                          <input
                                            type="time"
                                            className={`${styles.timePicker} form-control form-control-sm`}
                                            name="PickupTime"
                                            value={
                                              confirmStatusForm[index]
                                                ?.PickupTime || ""
                                            }
                                            onChange={(e) =>
                                              handleConfirmStatusForm(e, index)
                                            }
                                          />
                                        </div>
                                        <div
                                          className={styles.confirmationField}
                                        >
                                          <label>Drop Time:</label>
                                          <input
                                            type="time"
                                            className={`${styles.timePicker} form-control form-control-sm`}
                                            name="DropTime"
                                            value={
                                              confirmStatusForm[index]
                                                ?.DropTime || ""
                                            }
                                            onChange={(e) =>
                                              handleConfirmStatusForm(e, index)
                                            }
                                          />
                                        </div>
                                        <div
                                          className={styles.confirmationField}
                                        >
                                          <label>Pickup Address:</label>
                                          <textarea
                                            className={`${styles.formTextarea} form-control form-control-sm`}
                                            name="PickupAddress"
                                            value={
                                              confirmStatusForm[index]
                                                ?.PickupAddress || ""
                                            }
                                            onChange={(e) =>
                                              handleConfirmStatusForm(e, index)
                                            }
                                          />
                                        </div>
                                        <div
                                          className={styles.confirmationField}
                                        >
                                          <label>Drop Address:</label>
                                          <textarea
                                            className={`${styles.formTextarea} form-control form-control-sm`}
                                            name="DropAddress"
                                            value={
                                              confirmStatusForm[index]
                                                ?.DropAddress || ""
                                            }
                                            onChange={(e) =>
                                              handleConfirmStatusForm(e, index)
                                            }
                                          />
                                        </div>
                                      </div>
                                    )}
                                </div>

                                {/* Button group - only if status is Confirmed */}
                                {confirmStatusForm[index]?.ReservationStatus ===
                                  "Confirmed" && (
                                  <div
                                    className={`${styles.buttonGroup} mt-2 d-flex align-items-center justify-content-end gap-2`}
                                  >
                                    {!editingIndexes.includes(index) ? (
                                      <button
                                        className={styles.editButton}
                                        onClick={() =>
                                          handleUpdateTableEdit(index)
                                        }
                                        aria-label="Edit confirmation details"
                                      >
                                        Edit
                                      </button>
                                    ) : (
                                      <>
                                        <button
                                          className={styles.cancelButton}
                                          onClick={() =>
                                            handleCancelEdit(index)
                                          }
                                          aria-label="Cancel editing confirmation details"
                                        >
                                          Cancel
                                        </button>
                                        <button
                                          className={styles.saveButton}
                                          onClick={() =>
                                            handleSave(service, index, "single")
                                          }
                                          aria-label="Save confirmation details"
                                        >
                                          Save
                                        </button>
                                      </>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className={`${styles.cardContainer} mt-4`}>
                        <div className={styles.serviceCard}>
                          <div className={styles.serviceHead}>
                            <span className={styles.supplierText}>
                              {service?.Service?.ServiceType}
                            </span>
                            <div className={styles.supplierInfo}>
                              <span className={styles.supplierName}>
                                Supplier :{" "}
                                <span className={styles.supplierDetails}>
                                  {
                                    service?.Service?.ServiceDetails[0]
                                      ?.ItemSupplierDetail?.ItemSupplierName
                                  }
                                </span>
                              </span>
                            </div>
                            <div className={styles.paymentInfo}>
                              <span className={styles.paymentTerms}>
                                Payment Terms :{" "}
                                <span className={styles.supplierDetails}></span>
                              </span>
                            </div>
                            <div className={styles.reservationButtonContainer}>
                              <button
                                className="border-0 reservation-button"
                                onClick={() => {
                                  display();
                                }}
                              >
                                SEND RESERVATION REQUEST
                              </button>
                            </div>
                          </div>
                          <div className={styles.serviceBody}>
                            <div className={styles.tableContainer}>
                              <Table
                                responsive
                                bordered
                                className={`${styles.serviceTable} mb-2`}
                              >
                                <tbody>
                                  <tr>
                                    <td className={styles.tableCell}>
                                      <span className={styles.supplierDetails}>
                                        {
                                          service?.Service?.ServiceDetails[0]
                                            .ItemName
                                        }
                                      </span>
                                    </td>
                                    <td className={styles.tableCell}>
                                      <span className={styles.supplierName}>
                                        CheckIn :{" "}
                                        <span
                                          className={styles.supplierDetails}
                                        >
                                          {
                                            service?.Service?.ServiceDetails[0]
                                              .TimingDetails?.ItemFromDate
                                          }
                                        </span>
                                      </span>
                                    </td>
                                    <td className={styles.tableCell}>
                                      <span className={styles.supplierName}>
                                        CheckOut :{" "}
                                        <span
                                          className={styles.supplierDetails}
                                        >
                                          {
                                            service?.Service?.ServiceDetails[0]
                                              .TimingDetails?.ItemToDate
                                          }
                                        </span>
                                      </span>
                                    </td>
                                    <td className={styles.tableCell}>
                                      <span className={styles.supplierDetails}>
                                        {service?.TotalNights} Night(s)
                                      </span>
                                    </td>
                                    <td
                                      className={`${styles.statusSelect} ${styles.tableCell}`}
                                    >
                                      <select
                                        name="ReservationStatus"
                                        className={`${styles.statusDropdown} form-control form-control-sm `}
                                        value={
                                          confirmStatusForm[index]
                                            ?.ReservationStatus
                                        }
                                        onChange={(e) =>
                                          handleConfirmStatusForm(
                                            e,
                                            index,
                                            service
                                          )
                                        }
                                      >
                                        <option value="Pending">Pending</option>
                                        <option value="Cancelled">
                                          Cancelled
                                        </option>
                                        <option value="Requested">
                                          Requested
                                        </option>
                                        <option value="Confirmed">
                                          Confirmed
                                        </option>
                                        <option value="Rejected">
                                          Rejected
                                        </option>
                                        <option value="Waitlist">
                                          Waitlist
                                        </option>
                                      </select>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className={styles.tableCell}>
                                      <div className={styles.dateRoomInfo}>
                                        <div>
                                          <span
                                            className={styles.supplierDetails}
                                          >
                                            {service?.Service?.ServiceDetails[0]
                                              ?.TimingDetails?.ItemFromDate &&
                                              new Date(
                                                service.Service.ServiceDetails[0].TimingDetails.ItemFromDate
                                              ).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                              })}
                                          </span>{" "}
                                          -{" "}
                                          <span
                                            className={styles.supplierDetails}
                                          >
                                            {service?.Service?.ServiceDetails[0]
                                              ?.TimingDetails?.ItemToDate &&
                                              new Date(
                                                service.Service.ServiceDetails[0].TimingDetails.ItemToDate
                                              ).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                              })}
                                          </span>
                                        </div>
                                        {/* <span>
                                          {service?.Service?.RoomCategoryName}
                                        </span>
                                        <span>
                                          {service?.Service?.MealPlanName}
                                        </span> */}
                                      </div>
                                    </td>
                                    <td className={styles.tableCell}>
                                      <span className={styles.supplierDetails}>
                                        {service?.Service?.RoomCategoryName}
                                      </span>
                                    </td>
                                    <td
                                      colSpan={3}
                                      className={styles.tableCell}
                                    >
                                      <span className={styles.supplierDetails}>
                                        {service?.Service?.MealPlanName}
                                      </span>
                                    </td>
                                  </tr>
                                </tbody>
                              </Table>
                              <div className={styles.specialRequest}>
                                <input
                                  type="text"
                                  className="form-control form-control-sm m-0"
                                  style={{ height: "25px", width: "15rem" }}
                                  placeholder="Special Request and Remarks"
                                />
                              </div>

                              <div className={styles.confirmationSection}>
                                <div className={styles.confirmationRow}>
                                  {/* Label View: always show, but hide via class if editing */}
                                  <div
                                    className={`${styles.confirmationRow} ${
                                      editingIndexes.includes(index) &&
                                      confirmStatusForm[index]
                                        ?.ReservationStatus === "Confirmed"
                                        ? "d-none"
                                        : ""
                                    }`}
                                  >
                                    <div className={styles.confirmationField}>
                                      <label>Confirmation No:</label>
                                      <span>
                                        {confirmStatusForm[index]
                                          ?.ConfirmationNo || "-"}
                                      </span>
                                    </div>
                                    <div className={styles.confirmationField}>
                                      <label>Confirmation Date:</label>
                                      <span>
                                        {confirmStatusForm[index]
                                          ?.ConfirmationDate || "-"}
                                      </span>
                                    </div>
                                    <div className={styles.confirmationField}>
                                      <label>Cut Off Date:</label>
                                      <span>
                                        {confirmStatusForm[index]?.CutOfDate ||
                                          "-"}
                                      </span>
                                    </div>
                                    <div className={styles.confirmationField}>
                                      <label>Confirmed By:</label>
                                      <span>
                                        {confirmStatusForm[index]
                                          ?.ConfirmedBy || "-"}
                                      </span>
                                    </div>
                                    <div className={styles.confirmationField}>
                                      <label>Confirmed Note:</label>
                                      <span>
                                        {confirmStatusForm[index]
                                          ?.ConfirmedNote || "-"}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Input View: only show if editing and status is Confirmed */}
                                  {editingIndexes.includes(index) &&
                                    confirmStatusForm[index]
                                      ?.ReservationStatus === "Confirmed" && (
                                      <div className={styles.confirmationRow}>
                                        <div
                                          className={styles.confirmationField}
                                        >
                                          <label>Confirmation No:</label>
                                          <input
                                            type="text"
                                            className={`${styles.formInput} form-control form-control-sm`}
                                            name="ConfirmationNo"
                                            value={
                                              confirmStatusForm[index]
                                                ?.ConfirmationNo || ""
                                            }
                                            onChange={(e) =>
                                              handleConfirmStatusForm(e, index)
                                            }
                                          />
                                        </div>
                                        <div
                                          className={styles.confirmationField}
                                        >
                                          <label>Confirmation Date:</label>
                                          <DatePicker
                                            isClearable
                                            todayButton="Today"
                                            selected={parseDDMMYYYY(
                                              confirmStatusForm[index]
                                                ?.ConfirmationDate
                                            )}
                                            onChange={(date) =>
                                              handleConfirmDate(date, index)
                                            }
                                            className={`${styles.datePicker} form-control form-control-sm`}
                                            dateFormat="dd-MM-yyyy"
                                            autoComplete="off"
                                          />
                                        </div>
                                        <div
                                          className={styles.confirmationField}
                                        >
                                          <label>Cut Off Date:</label>
                                          <DatePicker
                                            className={`${styles.datePicker} form-control form-control-sm`}
                                            dateFormat="dd-MM-yyyy"
                                            autoComplete="off"
                                            isClearable
                                            todayButton="Today"
                                            selected={parseDDMMYYYY(
                                              confirmStatusForm[index]
                                                ?.CutOfDate
                                            )}
                                            onChange={(date) =>
                                              handleCutoffCalender(date, index)
                                            }
                                          />
                                        </div>
                                        <div
                                          className={styles.confirmationField}
                                        >
                                          <label>Confirmed By:</label>
                                          <input
                                            type="text"
                                            className={`${styles.formInput} form-control form-control-sm`}
                                            name="ConfirmedBy"
                                            value={
                                              confirmStatusForm[index]
                                                ?.ConfirmedBy || ""
                                            }
                                            onChange={(e) =>
                                              handleConfirmStatusForm(e, index)
                                            }
                                          />
                                        </div>
                                        <div
                                          className={styles.confirmationField}
                                        >
                                          <label>Confirmed Note:</label>
                                          <input
                                            type="text"
                                            className={`${styles.formInput} form-control form-control-sm`}
                                            name="ConfirmedNote"
                                            value={
                                              confirmStatusForm[index]
                                                ?.ConfirmedNote || ""
                                            }
                                            onChange={(e) =>
                                              handleConfirmStatusForm(e, index)
                                            }
                                          />
                                        </div>
                                      </div>
                                    )}
                                </div>

                                {/* Buttons section (same as before) */}
                                {confirmStatusForm[index]?.ReservationStatus ===
                                  "Confirmed" && (
                                  <div
                                    className={`${styles.buttonGroup} mt-2 d-flex align-items-center justify-content-end gap-2`}
                                  >
                                    {!editingIndexes.includes(index) ? (
                                      <button
                                        className={styles.editButton}
                                        onClick={() =>
                                          handleUpdateTableEdit(index)
                                        }
                                        aria-label="Edit confirmation details"
                                      >
                                        Edit
                                      </button>
                                    ) : (
                                      <>
                                        <button
                                          className={styles.cancelButton}
                                          onClick={() =>
                                            handleCancelEdit(index)
                                          }
                                          aria-label="Cancel editing confirmation details"
                                        >
                                          Cancel
                                        </button>
                                        <button
                                          className={styles.saveButton}
                                          onClick={() =>
                                            handleSave(service, index, "single")
                                          }
                                          aria-label="Save confirmation details"
                                        >
                                          Save
                                        </button>
                                      </>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                <div className="col-12 mt-3 d-flex justify-content-end">
                  <button
                    className="btn btn-primary d-flex justify-content-center align-items-center"
                    style={{
                      height: "25px",
                      width: "50px",
                      borderRadius: "0.3rem",
                    }}
                    onClick={() => handleSave(reservationList, "", "multiple")}
                  >
                    Save
                  </button>
                </div>
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
          <iframe
            src="/templates/reservationRequest.html"
            title="HTML Popup"
            width="100%"
            height="500px"
            style={{ border: "none" }}
          ></iframe>
          <hr />
          <div className="d-flex justify-content-end">
            {/* <Button onClick={() => setLgShow(false)} className="voucher-btn-5">
              Close
            </Button> */}
            <button
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => {
                const subject = encodeURIComponent("My Travel Proposal");
                // const body = encodeURIComponent(`
                //     <html>
                //     <body>
                //     <p>Hi,</p>
                //     <p>Please find the attached travel proposal.</p>
                //     <table border="1" cellpadding="5" cellspacing="0" style="font-family: Arial, sans-serif; font-size: 14px;">
                //       <tr bgcolor="#f2f2f2">
                //         <th>Destination</th>
                //         <th>Duration</th>
                //         <th>Price (INR)</th>
                //       </tr>
                //       <tr>
                //         <td>Kashmir</td>
                //         <td>5 Nights / 6 Days</td>
                //         <td>25,000</td>
                //       </tr>
                //       <tr>
                //         <td>Manali</td>
                //         <td>3 Nights / 4 Days</td>
                //         <td>15,500</td>
                //       </tr>
                //     </table>
                //     <p>Thanks,<br>Your Name</p>
                //     </body>
                //     </html>
                // `);
                // const mailtoLink = `mailto:someone@example.com?subject=${subject}&body=${body}`;
                const mailtoLink = `mailto:someone@example.com?subject=${subject}`;

                window.location.href = mailtoLink;
              }}
            >
              <img width={30} src={OutlookLogo} alt="OutlookLogo" />
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Reservationrequest;
