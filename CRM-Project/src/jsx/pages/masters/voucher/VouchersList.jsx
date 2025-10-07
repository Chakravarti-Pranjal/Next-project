import React, { useEffect, useState } from "react";
import { Card, Tab, Nav, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  setQoutationData,
  setQoutationSubject,
  setQueryData,
} from "../../../../store/actions/queryAction";
import { axiosOther } from "../../../../http/axios_base_url";
import useQueryData from "../../../../hooks/custom_hooks/useQueryData";
import PerfectScrollbar from "react-perfect-scrollbar";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import ClientVoucher from "./ClientVoucher";
import SupplierVoucher from "./SupplierVoucher";
import "./voucher.css";
import { useNavigate } from "react-router-dom";
import Voucher from "./Voucher";

function VouchersList() {
  const { qoutationData } = useSelector((data) => data?.queryReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showTabs, setShowTabs] = useState(false);
  const [qoutationList, setQoutationList] = useState([]);
  const [queryData, setQueryData] = useState({});
  const [supplier, setSupplier] = useState(null);
  const [service, setService] = useState(null);
  const [serviceList, setServiceList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const query = useQueryData();
  const [queryDataSet, setQueryDataSet] = useState(null);
  const [productList, setProductList] = useState([]);
  const [listFinalQuotationData, setListFinalQuotationData] = useState([]);
  const [localAgentList, setLocalAgentList] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedProductlist, setselectedProductlist] = useState({
    value: "all",
    label: "All",
  });
  const [type, setType] = useState("Client");
  const [baseData, setBaseData] = useState();
  const [voucherOpen, setVoucherOpen] = useState(false);

  const fetchAPI = async () => {
    try {
      const { data } = await axiosOther.post("listproduct");
      const allowedLabels = [
        "Hotel",
        "Restaurant",
        "Transport",
        "Monument",
        "Train",
        "Airlines",
        "Guide",
        "Activity",
      ];

      const options = data?.Datalist?.map((item) => ({
        value: item?.id,
        label: item?.name,
      }))?.filter((option) => allowedLabels.includes(option.label));

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
      setSupplierList(options);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchAPI();
  }, []);

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

  const handleFilter = (selectedOpt) => {
    const { type, Find, opt } = selectedOpt;
    switch (type) {
      case "service":
        setService(opt);
        break;
      case "supplier":
        setSupplier(opt);
        break;
      default:
    }
  };

  const customStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#2e2e40",
      color: "white",
      border: "1px solid transparent",
      boxShadow: "none",
      borderRadius: "0.5rem",
      width: "100%",
      minWidth: "10rem",
      height: "2rem",
      minHeight: "2rem",
      fontSize: "1em",
      zIndex: 0,
    }),
    singleValue: (base) => ({
      ...base,
      color: "white",
      fontSize: "0.85em",
    }),
    input: (base) => ({
      ...base,
      color: "white",
      fontSize: "0.85em",
      margin: 0,
      padding: 0,
    }),
    placeholder: (base) => ({
      ...base,
      color: "#6c757d",
      fontSize: "0.85em",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: "#ccc",
      padding: "0 6px",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#2e2e40",
      zIndex: 9999,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#444" : "#2e2e40",
      color: "white",
      cursor: "pointer",
      fontSize: "0.85em",
      padding: "6px 10px",
    }),
  };

  const queryQuotation = JSON.parse(localStorage.getItem("Query_Qoutation"));
  console.log(queryQuotation, "queryQuotation25");

  const getQoutationList = async () => {
    setQueryData(queryDataSet?.QueryAllData);
    try {
      const { data } = await axiosOther.post("listqueryquotation", {
        QueryId: queryDataSet?.QueryAlphaNumId,
        QuotationNo: queryQuotation?.QoutationNum,
      });
      console.log(data, "SDFSDFSD5484");
      if (data?.success) {
        setQoutationList(data?.data);
      }
    } catch (error) {
      console.log("Error fetching quotation list:", error);
    }
  };

  useEffect(() => {
    if (queryDataSet) {
      getQoutationList();
      dispatch(setQoutationData({}));
    }
    setQueryDataSet(query);
  }, [queryDataSet]);

  console.log(qoutationList, "queryDataSet");

  const getDataFromApi = async () => {
    const payload = {
      QueryId: queryQuotation?.QueryID,
    };
    try {
      const { data } = await axiosOther.post("querymasterlist", payload);
      dispatch(
        setQueryData({
          QueryData: {
            QueryId: data?.DataList[0]?.ServiceId,
            QueryAlphaNumId: data?.DataList[0]?.QueryID,
            QueryAllData: data?.DataList[0],
          },
        })
      );
    } catch (e) {
      console.log(e);
    }
    try {
      const payload = {
        QueryId: queryQuotation?.QueryID,
        QuotationNumber: queryQuotation?.QoutationNum,
        Status: "Confirmed",
        Type: type,
      };
      const { data } = await axiosOther.post("fetchStoredData", {
        QueryId: queryQuotation?.QueryID,
        QuotationNo: queryQuotation?.QoutationNum,
        TourCode: qoutationList?.QueryAllData?.FileNo,
        Type: type,
      });
      console.log(data?.DataList, "sfksdfksd8787+");
      setListFinalQuotationData(data?.DataList);
      setBaseData(data?.DataList);
    } catch (error) {
      console.log("Error fetching final quotation:", error);
    }

    try {
      const { data } = await axiosOther.post("fetchStoredData", {
        QueryId: queryQuotation?.QueryID,
        QuotationNo: queryQuotation?.QoutationNum,
        TourCode: qoutationList?.QueryAllData?.FileNo,
        Type: type,
        ProductType: "LocalAgent",
      });
      if (data?.Status == 200) {
        setLocalAgentList(data?.DataList);
      }
    } catch (error) {
      console.log(error, "Error");
    }
  };

  useEffect(() => {
    getDataFromApi();
  }, [type, queryDataSet, showTabs]);

  function dateFormat(date) {
    if (!date) return "";

    const d = new Date(date);
    if (isNaN(d)) return "";

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = d.getFullYear();

    return `${day}-${month}-${year}`;
  }

  const handleSelectAll = () => {};

  const redirectToItinerary = (data, service) => {
    dispatch(setQoutationSubject(data?.Header?.Subject));
    dispatch(setQoutationData(data));
    setSelectedService({
      ...service,
      tourCode: qoutationList?.[0]?.FileNo,
    });
    setShowTabs(true);
  };

  const renderTables = () => {
    const filteredServices = listFinalQuotationData
      ?.filter((item) => {
        const serviceData =
          item?.ListConfiremdReservationForVoucher?.List?.[0] ||
          item?.VoucherDataJson;
        const matchesService = service
          ? serviceData?.ServiceType?.toLowerCase() ===
            service.label?.toLowerCase()
          : true;
        const matchesSupplier = supplier
          ? serviceData?.SupplierId === supplier.value
          : true;
        const matchesType = item?.Type === type; // Filter by Client/Supplier
        return (
          (serviceData?.ReservationStatus === "Confirmed" ||
            item?.Type === type) &&
          matchesService &&
          matchesSupplier &&
          matchesType
        );
      })
      ?.map((item) => ({
        id: item?.id,
        ...item,
      }));

    // Get unique services by ServiceUniqueId for a specific service type
    const uniqueServices = (serviceType = null) => {
      const seen = new Set();
      return (
        filteredServices?.reduce((acc, item) => {
          const service =
            item?.ListConfiremdReservationForVoucher?.List?.[0] ||
            item?.VoucherDataJson;
          const isConfirmed =
            service?.ReservationStatus === "Confirmed" || item?.Type === type;
          const matchesServiceType = serviceType
            ? service?.ServiceType?.toLowerCase() === serviceType.toLowerCase()
            : true;
          const serviceUniqueId = service?.ServiceUniqueId || service?.UniqueId;
          const isUnique = !seen.has(serviceUniqueId);
          if (
            isConfirmed &&
            matchesServiceType &&
            isUnique &&
            serviceUniqueId
          ) {
            seen.add(serviceUniqueId);
            acc.push({
              ...service,
              id: item?.id,
              Type: item.Type,
              VoucherNo: item?.VoucherNo || service?.VoucherNo || "",
            });
          }
          return acc;
        }, []) || []
      );
    };

    // Define custom order for service types
    const serviceTypeOrder = {
      Hotel: 1,
      Restaurant: 2,
      Flight: 3,
      Train: 4,
    };

    // Get unique service types and sort by custom order
    const services = [];
    const seenServiceTypes = new Set();
    filteredServices?.forEach((item) => {
      const serviceType =
        item?.ListConfiremdReservationForVoucher?.List?.[0]?.ServiceType ||
        item?.VoucherDataJson?.ServiceType;
      if (
        (item?.ListConfiremdReservationForVoucher?.List?.[0]
          ?.ReservationStatus === "Confirmed" ||
          item?.Type === type) &&
        !seenServiceTypes.has(serviceType) &&
        serviceType
      ) {
        seenServiceTypes.add(serviceType);
        services.push({ ...item, ServiceType: serviceType });
      }
    });

    // Sort services by custom order
    services.sort((a, b) => {
      const orderA = serviceTypeOrder[a.ServiceType] || 999; // Unknown types go last
      const orderB = serviceTypeOrder[b.ServiceType] || 999;
      return orderA - orderB;
    });

    return (
      <div
        className="col-md-12 col-lg-12 overflow tablelist"
        style={{ overflowY: "auto", overflowX: "hidden" }}
      >
        {services?.length > 0 || localAgentList.length > 0 ? (
          <>
            {services?.map((list, idx) => (
              <div key={idx}>
                {list.ServiceType === "Hotel" && (
                  <div>
                    <h5 className="">Hotel</h5>
                    <table className="table table-bordered itinerary-table">
                      <thead>
                        <tr>
                          <th className="p-1">
                            <div className="form-check check-sm d-flex align-items-center">
                              <input
                                type="checkbox"
                                className="form-check-input height-em-1 width-em-1"
                                onChange={handleSelectAll}
                              />
                            </div>
                          </th>
                          <th>S.No.</th>
                          <th>Entity</th>
                          <th>From</th>
                          <th>To</th>
                          <th>Hotel</th>
                          <th>Nts</th>
                          <th>DBL Rooms</th>
                          <th>DBL Amount</th>
                          <th>Twin Rooms</th>
                          <th>Twin Amount</th>
                          <th>SGL Rooms</th>
                          <th>SGL Amount</th>
                          <th>TPL Rooms</th>
                          <th>TPL Amount</th>
                          <th>Voucher No</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {uniqueServices("Hotel").map((item, index) => (
                          <tr key={index}>
                            <td className="p-1">
                              <div className="form-check check-sm d-flex align-items-center">
                                <input
                                  type="checkbox"
                                  className="form-check-input height-em-1 width-em-1"
                                  onChange={handleSelectAll}
                                />
                              </div>
                            </td>
                            <td>
                              <span>{index + 1}</span>
                            </td>
                            <td>
                              <span>Pax</span>
                            </td>
                            <td>
                              <span>
                                {dateFormat(
                                  item?.ServiceDetails?.[0]?.FromDate
                                ) ||
                                  dateFormat(item?.ArrivalOn) ||
                                  "DD-MM-YYYY"}
                              </span>
                            </td>
                            <td>
                              <span>
                                {dateFormat(
                                  item?.ServiceDetails?.[0]?.ToDate
                                ) ||
                                  dateFormat(item?.DepartureOn) ||
                                  "DD-MM-YYYY"}
                              </span>
                            </td>
                            <td
                              className="cursor-pointer text-primary"
                              onClick={() =>
                                redirectToItinerary(listFinalQuotationData, {
                                  id: item?.id,
                                  UniqueId: item?.UniqueId,
                                  ServiceId: item?.ServiceId,
                                  ServiceUniqueId: item?.ServiceUniqueId,
                                  SupplierId: item?.SupplierId,
                                  VoucherNo: item?.VoucherNo,
                                  Servicetype: item?.ServiceType,
                                  ServiceName: item?.ServiceName,
                                })
                              }
                            >
                              <span>{item?.ServicesName || "-"}</span>
                            </td>
                            <td>
                              <span>
                                {item?.ServiceDetails?.[0]?.TotalNights ||
                                  item?.Nights ||
                                  "0"}
                              </span>
                            </td>
                            <td>
                              <span>
                                {item?.ServiceDetails?.[0]?.Rooms?.find(
                                  (r) => r.RoomType === "DBL Room"
                                )?.Count ||
                                  item?.DoubleRoom ||
                                  "0"}
                              </span>
                            </td>
                            <td>
                              <span>
                                {item?.ServiceDetails?.[0]?.Rooms?.find(
                                  (r) => r.RoomType === "DBL Room"
                                )?.Cost || "0"}
                              </span>
                            </td>
                            <td>
                              <span>
                                {item?.ServiceDetails?.[0]?.Rooms?.find(
                                  (r) => r.RoomType === "TWIN Room"
                                )?.Count ||
                                  item?.TripleRoom ||
                                  "0"}
                              </span>
                            </td>
                            <td>
                              <span>
                                {item?.ServiceDetails?.[0]?.Rooms?.find(
                                  (r) => r.RoomType === "TWIN Room"
                                )?.Cost || "0"}
                              </span>
                            </td>
                            <td>
                              <span>
                                {item?.ServiceDetails?.[0]?.Rooms?.find(
                                  (r) => r.RoomType === "SGL Room"
                                )?.Count ||
                                  item?.SingleRoom ||
                                  "0"}
                              </span>
                            </td>
                            <td>
                              <span>
                                {item?.ServiceDetails?.[0]?.Rooms?.find(
                                  (r) => r.RoomType === "SGL Room"
                                )?.Cost || "0"}
                              </span>
                            </td>
                            <td>
                              <span>
                                {item?.ServiceDetails?.[0]?.Rooms?.find(
                                  (r) => r.RoomType === "TPL Room"
                                )?.Count ||
                                  item?.TripleRoom ||
                                  "0"}
                              </span>
                            </td>
                            <td>
                              <span>
                                {item?.ServiceDetails?.[0]?.Rooms?.find(
                                  (r) => r.RoomType === "TPL Room"
                                )?.Cost || "0"}
                              </span>
                            </td>
                            <td>
                              <span>{item?.VoucherNo || ""}</span>
                            </td>
                            <td>
                              <span>{item?.VoucherNo ? "✔" : ""}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {list.ServiceType === "Restaurant" && (
                  <div>
                    <h5 className="">Restaurant</h5>
                    <table className="table table-bordered itinerary-table">
                      <thead>
                        <tr>
                          <th className="p-1">
                            <div className="form-check check-sm d-flex align-items-center">
                              <input
                                type="checkbox"
                                className="form-check-input height-em-1 width-em-1"
                                onChange={handleSelectAll}
                              />
                            </div>
                          </th>
                          <th>S.No.</th>
                          <th>Entity</th>
                          <th>From</th>
                          <th>To</th>
                          <th>Type</th>
                          <th>Destination</th>
                          <th>Supplier</th>
                          <th>Restaurant</th>
                          <th>Pax</th>
                          <th>Breakfast amount</th>
                          <th>Lunch amount</th>
                          <th>Dinner amount</th>
                          <th>Voucher No</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {uniqueServices("Restaurant").map((item, index) => (
                          <tr
                            key={item.UniqueId}
                            className="cursor-pointer text-primary"
                            onClick={() =>
                              redirectToItinerary(listFinalQuotationData, {
                                id: item?.id,
                                UniqueId: item?.UniqueId,
                                ServiceId: item?.ServiceId,
                                ServiceUniqueId: item?.ServiceUniqueId,
                                SupplierId: item?.SupplierId,
                                VoucherNo: item?.VoucherNo,
                                Servicetype: item?.ServiceType,
                                ServiceName:
                                  item?.ServiceDetails[0]?.ServiceName,
                              })
                            }
                          >
                            <td className="p-1">
                              <div className="form-check check-sm d-flex align-items-center">
                                <input
                                  type="checkbox"
                                  className="form-check-input height-em-1 width-em-1"
                                  onChange={handleSelectAll}
                                />
                              </div>
                            </td>
                            <td>
                              <span>{index + 1}</span>
                            </td>
                            <td>
                              <span>Pax</span>
                            </td>
                            <td>
                              <span>
                                {dateFormat(
                                  item?.ServiceDetails?.[0]?.FromDate
                                )}
                              </span>
                            </td>
                            <td>
                              <span>
                                {dateFormat(item?.ServiceDetails?.[0]?.ToDate)}
                              </span>
                            </td>
                            <td
                              className="cursor-pointer text-primary"
                              onClick={() =>
                                redirectToItinerary(listFinalQuotationData, {
                                  id: item?.id,
                                  UniqueId: item?.UniqueId,
                                  ServiceId: item?.ServiceId,
                                  ServiceUniqueId: item?.ServiceUniqueId,
                                  SupplierId: item?.SupplierId,
                                  VoucherNo: item?.VoucherNo,
                                  Servicetype: item?.ServiceType,
                                  ServiceName:
                                    item?.ServiceDetails[0]?.ServiceName,
                                })
                              }
                            >
                              <span>{item?.ServiceType || ""}</span>
                            </td>
                            <td>
                              <span>
                                {item?.ServiceDetails?.[0]?.DestinationName ||
                                  item?.DestinationName ||
                                  "-"}
                              </span>
                            </td>
                            <td>
                              <span>{item?.SupplierName || "-"}</span>
                            </td>
                            <td>
                              <span>
                                {item?.ServiceDetails?.[0]?.ServiceName ||
                                  item?.ServiceName ||
                                  "-"}
                              </span>
                            </td>
                            <td>
                              <span>
                                {list?.ListConfiremdReservationForVoucher
                                  ?.TotalPax || "-"}
                              </span>
                            </td>
                            <td>
                              <span>
                                {item?.ServiceDetails?.[0]?.Meals?.find(
                                  (m) =>
                                    m.MealTypeName?.toLowerCase() ===
                                    "breakfast"
                                )?.MealCost || "0"}
                              </span>
                            </td>
                            <td>
                              <span>
                                {item?.ServiceDetails?.[0]?.Meals?.find(
                                  (m) =>
                                    m.MealTypeName?.toLowerCase() === "lunch"
                                )?.MealCost || "0"}
                              </span>
                            </td>
                            <td>
                              <span>
                                {item?.ServiceDetails?.[0]?.Meals?.find(
                                  (m) =>
                                    m.MealTypeName?.toLowerCase() === "dinner"
                                )?.MealCost || "0"}
                              </span>
                            </td>
                            <td>
                              <span>{item?.VoucherNo || ""}</span>
                            </td>
                            <td>
                              <span>{item?.VoucherNo ? "✔" : ""}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {list.ServiceType === "Flight" && (
                  <div>
                    <h5 className="">Flight</h5>
                    <table className="table table-bordered itinerary-table">
                      <thead>
                        <tr>
                          <th className="p-1">
                            <div className="form-check check-sm d-flex align-items-center">
                              <input
                                type="checkbox"
                                className="form-check-input height-em-1 width-em-1"
                                onChange={handleSelectAll}
                              />
                            </div>
                          </th>
                          <th>S.No.</th>
                          <th>From</th>
                          <th>To</th>
                          <th>Type</th>
                          <th>Destination</th>
                          <th>Service Name</th>
                          <th>Supplier Name</th>
                          <th>Voucher No</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {uniqueServices("Flight").map((item, index) => (
                          <tr
                            key={item.UniqueId}
                            className="cursor-pointer text-primary"
                            onClick={() =>
                              redirectToItinerary(listFinalQuotationData, {
                                id: item?.id,
                                UniqueId: item?.UniqueId,
                                ServiceId: item?.ServiceId,
                                ServiceUniqueId: item?.ServiceUniqueId,
                                SupplierId: item?.SupplierId,
                                VoucherNo: item?.VoucherNo,
                                Servicetype: item?.ServiceType,
                                ServiceName: item?.ServiceName,
                              })
                            }
                          >
                            <td className="p-1">
                              <div className="form-check check-sm d-flex align-items-center">
                                <input
                                  type="checkbox"
                                  className="form-check-input height-em-1 width-em-1"
                                  onChange={handleSelectAll}
                                />
                              </div>
                            </td>
                            <td>
                              <span>{index + 1}</span>
                            </td>
                            <td>
                              <span>
                                {dateFormat(
                                  item?.ServiceDetails?.[0]?.FromDate
                                )}
                              </span>
                            </td>
                            <td>
                              <span>
                                {dateFormat(item?.ServiceDetails?.[0]?.ToDate)}
                              </span>
                            </td>
                            <td
                              className="cursor-pointer text-primary"
                              onClick={() =>
                                redirectToItinerary(listFinalQuotationData, {
                                  id: item?.id,
                                  UniqueId: item?.UniqueId,
                                  ServiceId: item?.ServiceId,
                                  ServiceUniqueId: item?.ServiceUniqueId,
                                  SupplierId: item?.SupplierId,
                                  VoucherNo: item?.VoucherNo,
                                  Servicetype: item?.ServiceType,
                                  ServiceName: item?.ServiceName,
                                })
                              }
                            >
                              <span>{item?.ServiceType || "-"}</span>
                            </td>
                            <td>
                              <span>
                                {item?.ServiceDetails?.[0]?.DestinationName ||
                                  item?.DestinationName ||
                                  "-"}
                              </span>
                            </td>
                            <td>
                              <span>
                                {item?.ServiceDetails?.[0]?.ServiceName ||
                                  item?.ServiceName ||
                                  "-"}
                              </span>
                            </td>
                            <td>
                              <span>{item?.SupplierName || "-"}</span>
                            </td>
                            <td>
                              <span>{item?.VoucherNo || ""}</span>
                            </td>
                            <td>
                              <span>{item?.VoucherNo ? "✔" : ""}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {list.ServiceType === "Train" && (
                  <div>
                    <h5 className="">Train</h5>
                    <table className="table table-bordered itinerary-table">
                      <thead>
                        <tr>
                          <th className="p-1">
                            <div className="form-check check-sm d-flex align-items-center">
                              <input
                                type="checkbox"
                                className="form-check-input height-em-1 width-em-1"
                                onChange={handleSelectAll}
                              />
                            </div>
                          </th>
                          <th>S.No.</th>
                          <th>From</th>
                          <th>To</th>
                          <th>Type</th>
                          <th>Destination</th>
                          <th>Service Name</th>
                          <th>Supplier Name</th>
                          <th>Voucher No</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {uniqueServices("Train").map((item, index) => (
                          <tr
                            key={item.UniqueId}
                            className="cursor-pointer text-primary"
                            onClick={() =>
                              redirectToItinerary(listFinalQuotationData, {
                                id: item?.id,
                                UniqueId: item?.UniqueId,
                                ServiceId: item?.ServiceId,
                                ServiceUniqueId: item?.ServiceUniqueId,
                                SupplierId: item?.SupplierId,
                                VoucherNo: item?.VoucherNo,
                                Servicetype: item?.ServiceType,
                                ServiceName: item?.ServiceName,
                              })
                            }
                          >
                            <td className="p-1">
                              <div className="form-check check-sm d-flex align-items-center">
                                <input
                                  type="checkbox"
                                  className="form-check-input height-em-1 width-em-1"
                                  onChange={handleSelectAll}
                                />
                              </div>
                            </td>
                            <td>
                              <span>{index + 1}</span>
                            </td>
                            <td>
                              <span>
                                {dateFormat(
                                  item?.ServiceDetails?.[0]?.FromDate
                                )}
                              </span>
                            </td>
                            <td>
                              <span>
                                {dateFormat(item?.ServiceDetails?.[0]?.ToDate)}
                              </span>
                            </td>
                            <td
                              className="cursor-pointer text-primary"
                              onClick={() =>
                                redirectToItinerary(listFinalQuotationData, {
                                  id: item?.id,
                                  UniqueId: item?.UniqueId,
                                  ServiceId: item?.ServiceId,
                                  ServiceUniqueId: item?.ServiceUniqueId,
                                  SupplierId: item?.SupplierId,
                                  VoucherNo: item?.VoucherNo,
                                  Servicetype: item?.ServiceType,
                                  ServiceName: item?.ServiceName,
                                })
                              }
                            >
                              <span>{item?.ServiceType || "-"}</span>
                            </td>
                            <td>
                              <span>
                                {item?.ServiceDetails?.[0]?.DestinationName ||
                                  item?.DestinationName ||
                                  "-"}
                              </span>
                            </td>
                            <td>
                              <span>
                                {item?.ServiceDetails?.[0]?.ServiceName ||
                                  item?.ServiceName ||
                                  "-"}
                              </span>
                            </td>
                            <td>
                              <span>{item?.SupplierName || "-"}</span>
                            </td>
                            <td>
                              <span>{item?.VoucherNo || ""}</span>
                            </td>
                            <td>
                              <span>{item?.VoucherNo ? "✔" : ""}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
            {localAgentList.length > 0 && (
              <div>
                <h5 className="">Local Agents</h5>
                <table className="table table-bordered itinerary-table">
                  <thead>
                    <tr>
                      <th className="p-1">
                        <div className="form-check check-sm d-flex align-items-center">
                          <input
                            type="checkbox"
                            className="form-check-input height-em-1 width-em-1"
                            onChange={handleSelectAll}
                          />
                        </div>
                      </th>
                      <th>S.No.</th>
                      <th>From Date</th>
                      <th>To Date</th>
                      <th>Destination</th>
                      <th>Supplier</th>
                      <th>Voucher No</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {localAgentList.map((item, index) => {
                      const firstService =
                        item.ListConfiremdReservationForVoucher.List[0] || {};
                      return (
                        <tr key={index} className="cursor-pointer text-primary">
                          <td className="p-1">
                            <div className="form-check check-sm d-flex align-items-center">
                              <input
                                type="checkbox"
                                className="form-check-input height-em-1 width-em-1"
                                onChange={handleSelectAll}
                              />
                            </div>
                          </td>
                          <td>
                            <span>{index + 1}</span>
                          </td>
                          <td>
                            <span>
                              {firstService.ServiceDetails?.[0]?.FromDate ||
                                "DD-MM-YYYY"}
                            </span>
                          </td>
                          <td>
                            <span>
                              {firstService.ServiceDetails?.[0]?.ToDate ||
                                "DD-MM-YYYY"}
                            </span>
                          </td>
                          <td
                            className="cursor-pointer text-primary"
                            onClick={() =>
                              redirectToItinerary(listFinalQuotationData, {
                                id: item.id,
                                ServiceType: "LocalAgent",
                                SupplierId: firstService.SupplierId || "",
                                VoucherNo: item.VoucherNo || "",
                              })
                            }
                          >
                            <span>
                              {firstService.ServiceDetails?.[0]
                                ?.DestinationName || ""}
                            </span>
                          </td>
                          <td
                            className="cursor-pointer text-primary"
                            onClick={() =>
                              redirectToItinerary(listFinalQuotationData, {
                                id: item.id,
                                ServiceType: "LocalAgent",
                                SupplierId: firstService.SupplierId || "",
                                VoucherNo: item.VoucherNo || "",
                              })
                            }
                          >
                            <span>{firstService.SupplierName || ""}</span>
                          </td>
                          <td>
                            <span>{item.VoucherNo || ""}</span>
                          </td>
                          <td>
                            <span>{item.VoucherNo ? "✔" : ""}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : (
          <div>Vouchers not available!</div>
        )}
      </div>
    );
  };

  return (
    <Card>
      <Card.Body className="pt-0 ps-0 pe-0">
        {!showTabs && (
          <>
            {" "}
            <div className="d-flex align-items-center mb-2">
              <div className="d-flex align-items-center gap-1 w-100">
                <h3>Generate Voucher </h3>
              </div>
              <div className="d-flex gap-3 justify-content-end align-items-center w-100">
                <button
                  className="btn btn-dark btn-custom-size"
                  name="SaveButton"
                  onClick={() => navigate("/query/payments")}
                >
                  <span className="me-1">Back</span>
                  <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
                </button>

                <button
                  className="btn btn-primary btn-custom-size "
                  name="SaveButton"
                  onClick={() => navigate("/query/invoices")}
                >
                  <span className="me-1">Next</span>
                  <i className="fa-solid fa-forward text-primary bg-white p-1 rounded"></i>
                </button>
              </div>
            </div>
            {/*<div className="d-flex align-items-center mb-2 gap-1">
              <span>Reference Id : </span>
              <span className="querydetails text-grey">
                {queryQuotation?.ReferenceId}
              </span>
            </div>*/}
            <div className="nav-item d-flex align-items-center mb-2 gap-3">
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
              {/*<div className="col-lg-2 col-md-6 mb-3">
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
              </div>*/}
            </div>
          </>
        )}

        <div className="custom-tab-1">
          {!showTabs ? (
            renderTables()
          ) : (
            <div>
              <div
                className="d-flex align-items-center"
                style={{
                  backgroundColor: "var(--rgba-primary-1)",
                  padding: "10px",
                }}
              >
                <h5 className="m-0">
                  {type === "Client" ? "Client Voucher" : "Supplier Voucher"}
                </h5>
                <Button
                  className="btn btn-dark btn-custom-size ms-auto me-5"
                  onClick={() => setShowTabs(false)}
                >
                  <span className="me-1">Back</span>
                  <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
                </Button>
              </div>
              <div className="pt-2">
                {/*type === "Client" && (
                  <ClientVoucher
                    selectedService={selectedService}
                    setVoucherOpen={setVoucherOpen}
                  />
                )*/}
                {/*type === "Supplier" && (
                  <SupplierVoucher
                    selectedService={selectedService}
                    setVoucherOpen={setVoucherOpen}
                  />
                )*/}

                {console.log(selectedService, "kdkssdfjdsj")}

                <Voucher
                  selectedService={selectedService}
                  setVoucherOpen={setVoucherOpen}
                />
              </div>
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

export default VouchersList;
