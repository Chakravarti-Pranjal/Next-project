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
  const [editingIndexes, setEditingIndexes] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [vehicleTypeList, setVehicleTypeList] = useState([]);
  const [specialRequest, setSpecialRequest] = useState("");
  const [reservationFormData, setReservationFormData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([0]);
  const [confirmedReservationsList, setConfirmedReservationsList] = useState(
    {}
  );

  const display = () => {
    setLgShow(true);
  };

  const queryQuotation = JSON.parse(localStorage.getItem("Query_Qoutation"));
  const handleUpdateTableEdit = (index) => {
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
        QueryId: quotationDataOperation?.id,
        QuotationNumber: quotationDataOperation?.QuotationNumber,
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
  console.log(confirmedReservationsList, "setConfirmedReservationsList455");
  useEffect(() => {
    if (reservationList?.length > 0) {
      reservationList?.forEach((list, index) => {
        getConfirmedReservationsData(list?.Service?.ServiceUniqueId);
      });
    }
  }, [reservationList]);

  useEffect(() => {
    getAPIToServer();
  }, []);

  useEffect(() => {
    if (reservationList?.length > 0) {
      const initialFormData = reservationList.map((item) => {
        const confirmedData =
          confirmedReservationsList[item?.Service?.ServiceUniqueId]?.[0] || {};
        return {
          ServiceUniqueId: item?.Service?.ServiceUniqueId,
          id: quotationDataOperation?.id || "",
          QuotationNumber: quotationDataOperation?.QuotationNumber || "",
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
      });

      // Set selectedRows based on whether confirmedReservationsList has data at index 0
      const initialSelectedRows = reservationList
        .map((item, index) =>
          confirmedReservationsList[item?.Service?.ServiceUniqueId]?.[0]
            ? index
            : -1
        )
        .filter((index) => index !== -1);

      setReservationFormData(initialFormData);
      setSelectedRows(
        initialSelectedRows.length > 0 ? initialSelectedRows : [0]
      );
      setConfirmStatusForm(initialFormData);
    }
  }, [reservationList, confirmedReservationsList, quotationDataOperation]);

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

  const handleFilter = (selectedOpt) => {
    const { type, Find, opt } = selectedOpt;
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
    setReservationFormData((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = { ...newArr[index], [name]: value };
      return newArr;
    });
  };

  const handleSelectChange = (name, value, index) => {
    setReservationFormData((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = { ...newArr[index], [name]: value };
      return newArr;
    });
  };

  const handleCheckboxChange = (index) => {
    setSelectedRows((prev) => {
      if (prev.includes(index)) {
        if (prev.length === 1) {
          notifyError("Invalid action");
          return prev;
        }
        return prev.filter((i) => i !== index);
      }
      return [...prev, index];
    });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(reservationList.map((_, index) => index));
    } else {
      setSelectedRows([0]);
    }
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

  const [editIndex, setEditIndex] = useState(null);

  const handleRowClickNew = (index) => {
    setEditIndex(index);
  };

  const handleSubmit = async () => {
    const payload = reservationFormData.filter((_, index) =>
      selectedRows.includes(index)
    );
    console.log(payload, "PAYLOAD");
    try {
      const url = "add-reservation-quotation";
      const { data } = await axiosOther.post(url, payload);

      if (data?.Success) {
        notifySuccess(data?.Message || "ReservationRequest added successfully");
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
                  <button
                    className="btn btn-primary btn-custom-size"
                    onClick={handleSubmit}
                  >
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
                    isACTION
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
            <Card.Body className="m-0 p-0 fullbody">
              <PerfectScrollbar>
                <div className="px-2">
                  <table className="table table-bordered itinerary-table mt-2">
                    <thead>
                      <tr className="text-center ">
                        <th className="p-1">
                          <div className="form-check check-sm d-flex align-items-center">
                            <input
                              type="checkbox"
                              className="form-check-input height-em-1 width-em-1"
                              checked={
                                selectedRows.length === reservationList.length
                              }
                              onChange={handleSelectAll}
                            />
                          </div>
                        </th>
                        <th className="p-1" style={{ minWidth: "140px" }}>
                          Action
                        </th>
                        <th className="p-1" style={{ minWidth: "140px" }}>
                          Type
                        </th>
                        <th className="p-1" style={{ minWidth: "140px" }}>
                          Supplier
                        </th>
                        <th className="p-1" style={{ minWidth: "140px" }}>
                          Service
                        </th>
                        <th className="p-1" style={{ minWidth: "140px" }}>
                          CheckIn
                        </th>
                        <th className="p-1" style={{ minWidth: "140px" }}>
                          CheckOut
                        </th>
                        <th className="p-1" style={{ minWidth: "140px" }}>
                          Nights
                        </th>
                        <th className="p-1" style={{ minWidth: "140px" }}>
                          Status
                        </th>
                        <th className="p-1" style={{ minWidth: "140px" }}>
                          Confirmation No
                        </th>
                        <th className="p-1" style={{ minWidth: "140px" }}>
                          Confirmation Date
                        </th>
                        <th className="p-1" style={{ minWidth: "140px" }}>
                          Cut Off Date
                        </th>
                        <th className="p-1" style={{ minWidth: "140px" }}>
                          Confirmed By
                        </th>
                        <th className="p-1" style={{ minWidth: "140px" }}>
                          Confirmed Note
                        </th>
                        <th className="p-1" style={{ minWidth: "140px" }}>
                          Vehicle Type
                        </th>
                        <th className="p-1" style={{ minWidth: "140px" }}>
                          Start Time
                        </th>
                        <th className="p-1" style={{ minWidth: "140px" }}>
                          End Time
                        </th>
                        <th className="p-1" style={{ minWidth: "140px" }}>
                          Pickup Time
                        </th>
                        <th className="p-1" style={{ minWidth: "140px" }}>
                          Drop Time
                        </th>
                        <th className="p-1" style={{ minWidth: "140px" }}>
                          Pickup Address
                        </th>
                        <th className="p-1" style={{ minWidth: "140px" }}>
                          Drop Address
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservationList?.map((row, index) => (
                        <tr
                          key={index}
                          onClick={() => handleRowClickNew(index)}
                          style={{
                            backgroundColor:
                              statusColorsNew[
                                reservationFormData[index]?.ReservationStatus
                              ] || "transparent",
                            cursor: "pointer",
                          }}
                        >
                          {editIndex === index ? (
                            <>
                              <td>
                                <div className="form-check check-sm d-flex align-items-center">
                                  <input
                                    type="checkbox"
                                    className="form-check-input height-em-1 width-em-1"
                                    checked={selectedRows.includes(index)}
                                    onChange={() => handleCheckboxChange(index)}
                                  />
                                </div>
                              </td>
                              <td className="d-flex gap-2 justify-content-center align-items-center">
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  style={{
                                    padding: "0 6px",
                                    borderRadius: "4px",
                                  }}
                                  onClick={() =>
                                    handleSave(row, index, "single")
                                  }
                                >
                                  <span>Save</span>
                                </button>

                                {/* Open popup */}
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  style={{
                                    padding: "0 6px",
                                    borderRadius: "4px",
                                  }}
                                  onClick={() =>
                                    handleSave(row, index, "single")
                                  }
                                >
                                  <span>Req.</span>
                                </button>

                                {/* Eye Icon */}
                                <OverlayTrigger
                                  placement="top"
                                  overlay={getStatusTooltip(
                                    row.Service?.ServiceUniqueId
                                  )}
                                >
                                  <span>show</span>
                                </OverlayTrigger>
                              </td>
                              <td>
                                <input
                                  className="form-control form-control-sm text-center"
                                  name="type"
                                  value={row.Service?.ServiceType}
                                  disabled
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control form-control-sm text-center"
                                  name="supplier"
                                  value={
                                    row?.Service?.ServiceDetails[0]
                                      ?.ItemSupplierDetail?.ItemSupplierName
                                  }
                                  disabled
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control form-control-sm text-center"
                                  name="service"
                                  value={
                                    row?.Service?.ServiceDetails[0].ItemName
                                  }
                                  disabled
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control form-control-sm text-center"
                                  type="date"
                                  name="checkIn"
                                  value={
                                    row?.Service?.ServiceDetails[0]
                                      ?.TimingDetails?.ItemFromDate
                                  }
                                  disabled
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control form-control-sm text-center"
                                  type="date"
                                  name="checkOut"
                                  value={
                                    row?.Service?.ServiceDetails[0]
                                      ?.TimingDetails?.ItemFromDate
                                  }
                                  disabled
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control form-control-sm text-center"
                                  type="number"
                                  name="nights"
                                  value={row.nights}
                                  disabled
                                />
                              </td>
                              <td>
                                <select
                                  className="form-control form-control-sm text-center"
                                  name="ReservationStatus"
                                  value={
                                    reservationFormData[index]
                                      ?.ReservationStatus
                                  }
                                  onChange={(e) =>
                                    handleSelectChange(
                                      "ReservationStatus",
                                      e.target.value,
                                      index
                                    )
                                  }
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
                                  name="ConfirmationNo"
                                  value={
                                    reservationFormData[index]?.ConfirmationNo
                                  }
                                  onChange={(e) => handleInputChange(e, index)}
                                />
                              </td>
                              <td>
                                <DatePicker
                                  className="form-control form-control-sm text-center"
                                  selected={
                                    reservationFormData[index]?.ConfirmationDate
                                      ? parseYYYYMMDD(
                                          reservationFormData[index]
                                            ?.ConfirmationDate
                                        )
                                      : null
                                  }
                                  onChange={(date) =>
                                    handleConfirmDate(date, index)
                                  }
                                  dateFormat="yyyy-MM-dd"
                                  placeholderText="YYYY-MM-DD"
                                />
                              </td>
                              <td>
                                <DatePicker
                                  className="form-control form-control-sm text-center"
                                  selected={
                                    reservationFormData[index]?.CutOfDate
                                      ? parseYYYYMMDD(
                                          reservationFormData[index]?.CutOfDate
                                        )
                                      : null
                                  }
                                  onChange={(date) =>
                                    handleCutoffCalender(date, index)
                                  }
                                  dateFormat="yyyy-MM-dd"
                                  placeholderText="YYYY-MM-DD"
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control form-control-sm text-center"
                                  name="ConfirmedBy"
                                  value={
                                    reservationFormData[index]?.ConfirmedBy
                                  }
                                  onChange={(e) => handleInputChange(e, index)}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control form-control-sm text-center"
                                  name="ConfirmedNote"
                                  value={
                                    reservationFormData[index]?.ConfirmedNote
                                  }
                                  onChange={(e) => handleInputChange(e, index)}
                                />
                              </td>
                              <td>
                                <select
                                  className="form-control form-control-sm text-center"
                                  name="VehicleType"
                                  value={
                                    reservationFormData[index]?.VehicleType
                                  }
                                  onChange={(e) =>
                                    handleSelectChange(
                                      "VehicleType",
                                      e.target.value,
                                      index
                                    )
                                  }
                                >
                                  <option value="">Select Vehicle</option>
                                  {vehicleTypeList.map((vehicle) => (
                                    <option
                                      key={vehicle.value}
                                      value={vehicle.value}
                                    >
                                      {vehicle.label}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td>
                                <input
                                  className="form-control form-control-sm text-center"
                                  type="time"
                                  name="StartTime"
                                  value={reservationFormData[index]?.StartTime}
                                  onChange={(e) => handleInputChange(e, index)}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control form-control-sm text-center"
                                  type="time"
                                  name="EndTime"
                                  value={reservationFormData[index]?.EndTime}
                                  onChange={(e) => handleInputChange(e, index)}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control form-control-sm text-center"
                                  type="time"
                                  name="PickupTime"
                                  value={reservationFormData[index]?.PickupTime}
                                  onChange={(e) => handleInputChange(e, index)}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control form-control-sm text-center"
                                  type="time"
                                  name="DropTime"
                                  value={reservationFormData[index]?.DropTime}
                                  onChange={(e) => handleInputChange(e, index)}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control form-control-sm text-center"
                                  name="PickupAddress"
                                  value={
                                    reservationFormData[index]?.PickupAddress
                                  }
                                  onChange={(e) => handleInputChange(e, index)}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control form-control-sm text-center"
                                  name="DropAddress"
                                  value={
                                    reservationFormData[index]?.DropAddress
                                  }
                                  onChange={(e) => handleInputChange(e, index)}
                                />
                              </td>
                            </>
                          ) : (
                            <>
                              <td>
                                <div className="form-check check-sm d-flex align-items-center">
                                  <input
                                    type="checkbox"
                                    className="form-check-input height-em-1 width-em-1"
                                    checked={selectedRows.includes(index)}
                                    onChange={() => handleCheckboxChange(index)}
                                  />
                                </div>
                              </td>
                              <td className="d-flex justify-content-center gap-2">
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  style={{
                                    padding: "0 6px",
                                    borderRadius: "4px",
                                  }}
                                  onClick={() =>
                                    handleSave(row, index, "single")
                                  }
                                >
                                  <span>Save</span>
                                </button>
                                <OverlayTrigger
                                  placement="top"
                                  overlay={getStatusTooltip(
                                    row.Service?.ServiceUniqueId
                                  )}
                                >
                                  <span>show</span>
                                </OverlayTrigger>
                              </td>
                              <td>
                                <span>{row.Service?.ServiceType}</span>
                              </td>
                              <td>
                                <span>
                                  {
                                    row?.Service?.ServiceDetails[0]
                                      ?.ItemSupplierDetail?.ItemSupplierName
                                  }
                                </span>
                              </td>
                              <td>
                                <span>
                                  {row?.Service?.ServiceDetails[0].ItemName}
                                </span>
                              </td>
                              <td>
                                <span>
                                  {
                                    row?.Service?.ServiceDetails[0]
                                      ?.TimingDetails?.ItemFromDate
                                  }
                                </span>
                              </td>
                              <td>
                                <span>
                                  {
                                    row?.Service?.ServiceDetails[0]
                                      ?.TimingDetails?.ItemFromDate
                                  }
                                </span>
                              </td>
                              <td>
                                <span>{row.nights}</span>
                              </td>
                              <td>
                                <span>
                                  {
                                    reservationFormData[index]
                                      ?.ReservationStatus
                                  }
                                </span>
                              </td>
                              <td>
                                <span>
                                  {reservationFormData[index]?.ConfirmationNo}
                                </span>
                              </td>
                              <td>
                                <span>
                                  {reservationFormData[index]?.ConfirmationDate}
                                </span>
                              </td>
                              <td>
                                <span>
                                  {reservationFormData[index]?.CutOfDate}
                                </span>
                              </td>
                              <td>
                                <span>
                                  {reservationFormData[index]?.ConfirmedBy}
                                </span>
                              </td>
                              <td>
                                <span>
                                  {reservationFormData[index]?.ConfirmedNote}
                                </span>
                              </td>
                              <td>
                                <span>
                                  {getVehicleName(
                                    reservationFormData[index]?.VehicleType
                                  )}
                                </span>
                              </td>
                              <td>
                                <span>
                                  {reservationFormData[index]?.StartTime}
                                </span>
                              </td>
                              <td>
                                <span>
                                  {reservationFormData[index]?.EndTime}
                                </span>
                              </td>
                              <td>
                                <span>
                                  {reservationFormData[index]?.PickupTime}
                                </span>
                              </td>
                              <td>
                                <span>
                                  {reservationFormData[index]?.DropTime}
                                </span>
                              </td>
                              <td>
                                <span>
                                  {reservationFormData[index]?.PickupAddress}
                                </span>
                              </td>
                              <td>
                                <span>
                                  {reservationFormData[index]?.DropAddress}
                                </span>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </PerfectScrollbar>

              <div className="col-12 mt-3 d-flex justify-content-end">
                <button
                  className="btn btn-primary btn-custom-size"
                  onClick={handleSubmit}
                >
                  Submit
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
          <iframe
            src="/templates/reservationRequest.html"
            title="HTML Popup"
            width="100%"
            height="500px"
            style={{ border: "none" }}
          ></iframe>
          <hr />
          <div className="d-flex justify-content-end">
            <button
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => {
                const subject = encodeURIComponent("My Travel Proposal");
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
