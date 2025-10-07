import React, { useEffect, useState } from "react";
import "../../../../css/new-style.css";
import { Row, Card, Col, CardHeader } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { axiosOther } from "../../../../http/axios_base_url";
import { notifySuccess } from "../../../../helper/notify";
import { useNavigate } from "react-router-dom";
import AsyncSelect from "react-select/async";
import { customStyles } from "./customStyle";
import Select from "react-select";
import { parse, isValid, format } from "date-fns";

// Define the priority order for service types
const serviceTypeOrder = [
  "Hotel",
  "Restaurant",
  "Monument",
  "Guide",
  "Transport",
  "Activity",
  "Train",
  "Flight",
  "Additional Service",
];

const ServiceTypeInclude = ["Transport", "Flight", "Train"];

// dd-MM-yyyy
const getValidDate = (dateString) => {
  if (!dateString) return "";
  const parsed = parse(dateString, "yyyy-MM-dd", new Date());
  if (!isValid(parsed)) {
    console.error("Invalid date:", dateString);
    return new Date();
  }
  return format(parsed, "dd-MM-yyyy");
};

const getServiceNameByService = (service) => {
  if (service == "Hotel") {
    return "Hotel Name";
  } else if (service == "Monument") {
    return "Program Name";
  } else if (service == "Activity") {
    return "Activity Name";
  } else if (service == "Additional") {
    return "Additional Services";
  } else if (service == "Flight") {
    return "Flight Name";
  } else if (service == "Train") {
    return "Train Name";
  } else if (service == "Transport") {
    return "Transport Name";
  } else if (service == "Restaurant") {
    return "Restaurant Name";
  } else if (service == "Guide") {
    return "Guide";
  }
};

// Helper function to get the index of a service type in the priority order
const getServiceTypePriority = (serviceType) => {
  const index = serviceTypeOrder.indexOf(serviceType);
  return index === -1 ? serviceTypeOrder.length : index;
};

const SupplierSelection = ({ handleNext }) => {
  const [supplierList, setSupplierList] = useState([]);
  const [supplier, setSupplier] = useState({});
  const [assinedSupplierSelectionList, setAssinedsupplierSelectionList] =
    useState([]);
  const [unAssinedsupplierSelectionList, setUnAssinedSupplierSelectionList] =
    useState([]);
  const [productList, setProductList] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // input value
  const [serviceList, setServiceList] = useState([]);
  const [selectedService, setSelectedService] = useState(null); // dropdown value
  const [appliedFilters, setAppliedFilters] = useState({
    service: null,
    search: "",
  }); // 🔹 filter state

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const quotationDataOperation = useSelector(
    (state) => state.queryReducer?.quotationDataOperation
  );

  const storedData = JSON.parse(localStorage.getItem("Query_Qoutation"));

  // ---------------------- GROUP FUNCTION ----------------------
  const groupByServiceType = (list) => {
    return list?.reduce((acc, item) => {
      const type = item?.Service?.ServiceType || "Other";
      if (!acc[type]) acc[type] = [];
      acc[type].push(item);
      return acc;
    }, {});
  };

  // ---------------------- UNASSIGNED + ASSIGNED GROUP ----------------------
  const groupedUnassigned = groupByServiceType(unAssinedsupplierSelectionList);
  const groupedAssigned = groupByServiceType(assinedSupplierSelectionList);

  // ---------------------- FILTER FUNCTION ----------------------
  const filterGroups = (groups) => {
    let filtered = groups;

    // 🔹 Search filter (service type groupName)
    if (appliedFilters.search) {
      filtered = Object.keys(filtered)
        .filter((key) =>
          key.toLowerCase().includes(appliedFilters.search.toLowerCase())
        )
        .reduce((obj, key) => {
          obj[key] = filtered[key];
          return obj;
        }, {});
    }

    // 🔹 Service dropdown filter
    if (appliedFilters.service) {
      filtered = Object.keys(filtered)
        .filter((key) => key === appliedFilters.service.label)
        .reduce((obj, key) => {
          obj[key] = filtered[key];
          return obj;
        }, {});
    }

    return filtered;
  };

  const filteredUnassigned = filterGroups(groupedUnassigned);
  const filteredAssigned = filterGroups(groupedAssigned);

  // ---------------------- APPLY + RESET FILTER ----------------------
  const handleFilterSearch = () => {
    setAppliedFilters({
      service: selectedService,
      search: searchTerm,
    });
  };

  // const handleClearFilters = () => {
  //   setSearchTerm("");
  //   setSelectedService(null);
  //   setAppliedFilters({ service: null, search: "" });
  // };

  // Method to discard Local And Foreigner Services

  const getAssignedServicesFilterList = (services) => {
    const updatedList = services?.filter((item) => {
      if (
        item.SourceType === "ExcortDay" &&
        (item.EscortType === "Local" || item.EscortType === "Foreigner")
      ) {
        if (
          item.Service?.ServiceType === "Hotel" &&
          item.EscortType === "Local"
        ) {
          return true;
        }
        return false;
      }

      return true;
    });

    return updatedList;
  };
  const getUnassignedServicesFilterList = (services) => {
    const updatedList = services?.filter((item) => {
      if (
        item.SourceType === "ExcortDay" &&
        (item.EscortType === "Local" || item.EscortType === "Foreigner")
      ) {
        if (
          item.Service?.ServiceType === "Hotel" &&
          item.EscortType === "Local"
        ) {
          return true;
        }
        return false;
      }

      return true;
    });

    return updatedList;
  };

  // ---------------------- API Calls ----------------------
  const getServerApi = async () => {
    try {
      const { data } = await axiosOther.post(
        "listofservicesforsupplierselection",
        {
          QueryId: quotationDataOperation?.QueryId || storedData?.QueryID,
          QuotationNo:
            quotationDataOperation?.QuotationNumber || storedData?.QoutationNum,
        }
      );

      const unassignedWithServiceId = data?.UnAssignedServices?.map(
        (service) => {
          const temp = productList.find(
            (item) => item.name === service?.Service?.ServiceType
          );
          return { ...service, serviceId: temp?.id };
        }
      );

      console.log(data?.AssignedServices, "WATSDTS766");

      const updatedAssignServices = getAssignedServicesFilterList(
        data?.AssignedServices
      );

      const updatedUnassignServices = getUnassignedServicesFilterList(
        unassignedWithServiceId
      );

      setAssinedsupplierSelectionList(updatedAssignServices);
      setUnAssinedSupplierSelectionList(updatedUnassignServices);
    } catch (err) {
      console.log(err);
    }
    try {
      const { data } = await axiosOther.post("listproduct");
      const options = data?.Datalist?.map((item) => ({
        value: item?.id,
        label: item?.name,
      }));

      const serviceName = [
        "Foreign Escort",
        "Insurance",
        "Invoice",
        "Local Escort",
        "Meal",
        "Tour Package",
        "Visa",
      ];

      if (data?.Status == 200) {
        const updatedList = data?.Datalist?.filter(
          (list) => !serviceName.includes(list?.name)
        )?.map((list) => {
          return {
            value: list?.id,
            label: list?.name == "Airlines" ? "Flight" : list?.name,
          };
        });
        setServiceList(updatedList);
      }
      console.log(data, "WATFDTTD");
    } catch (error) {
      console.log("error", error);
    }
  };

  const getSupplierList = async (ServiceUniqueId, ServiceType, list) => {
    console.log(ServiceType, "WATDFDT");

    let supplierService = "";
    let destination = list?.Service?.DestinationId;

    if (ServiceType == "Hotel") {
      supplierService = 12;
    } else if (ServiceType == "Restaurant") {
      supplierService = "";
      destination = "";
    } else if (ServiceType == "Monument") {
      supplierService = 5;
      destination = "";
    } else if (ServiceType == "Guide") {
      supplierService = 1;
      destination = "";
    } else if (ServiceType == "Transport") {
      supplierService = 4;
      destination = "";
      destination = list?.Service?.ToDestinationId;
    } else if (ServiceType == "Activity") {
      supplierService = 3;
      destination = "";
    } else if (ServiceType == "Train") {
      supplierService = 6;
      destination = "";
    } else if (ServiceType == "Flight") {
      supplierService = 9;
      destination = "";
    } else if (ServiceType == "Additional") {
      supplierService = "";
      destination = "";
    }

    try {
      const { data } = await axiosOther.post("supplierlist", {
        Name: "",
        id: "",
        SupplierService: supplierService,
        DestinationId: destination ? [Number(destination)] : "",
      });
      console.log(ServiceUniqueId, "AGSFSFFS");
      setSupplierList((prevObj) => ({
        ...prevObj,
        [ServiceUniqueId]: data?.DataList,
      }));
    } catch (err) {
      console.log(err);
    }
  };

  console.log(supplierList, "QSTFDTDTYD");

  useEffect(() => {
    unAssinedsupplierSelectionList?.forEach((list, index) => {
      console.log(list, "WATSDDS766");
      getSupplierList(
        list?.Service?.ServiceUniqueId,
        list?.Service?.ServiceType,
        list
      );
    });
  }, [unAssinedsupplierSelectionList]);

  console.log(unAssinedsupplierSelectionList, "unAssinedsupplierSelectionList");

  const loadProductList = async () => {
    try {
      const { data } = await axiosOther.post("listproduct");
      setProductList(data?.Datalist);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadProductList();
  }, []);

  useEffect(() => {
    if (productList.length > 0) {
      getServerApi();
    }
  }, [productList]);

  const handleSupplierChange = async (service) => {
    try {
      const { data } = await axiosOther.post("supplierRemovefromQuotation", {
        QueryId: quotationDataOperation?.QueryId || storedData?.QueryID,
        QuotationNo:
          quotationDataOperation?.QuotationNumber || storedData?.QoutationNum,
        ServiceId: service?.Service?.ServiceId,
        ServiceType: service?.Service?.ServiceType,
        DayUniqueId: service?.DayUniqueId,
        SupplierId:
          service?.Service?.ServiceDetails?.[0]?.ItemSupplierDetail
            ?.ItemSupplierId,
      });

      if (data?.success) {
        notifySuccess("Supplier Changed Successfully");
        dispatch({ type: "SUPPLIER_CHANGE_STATE" });
        getServerApi();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSupplierSelect = async (supplierData) => {
    const selectedSupplierId = supplier[supplierData?.Service?.ServiceUniqueId];
    if (!selectedSupplierId) {
      alert("Please select supplier");
      return;
    }

    try {
      const { data } = await axiosOther.post(
        "supplierselectionchangesupplier",
        {
          QueryId: quotationDataOperation?.QueryId || storedData?.QueryID,
          QuotationNo:
            quotationDataOperation?.QuotationNumber || storedData?.QoutationNum,
          ServiceId: supplierData?.Service?.ServiceId,
          ServiceType: supplierData?.Service?.ServiceType,
          DayUniqueId: supplierData?.DayUniqueId,
          SupplierId: selectedSupplierId,
        }
      );
      if (data?.success) {
        notifySuccess("Supplier Changed Successfully");
        dispatch({ type: "SUPPLIER_CHANGE_STATE" });
        getServerApi();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSupplier = (value, dayUniqueId) => {
    setSupplier((prev) => ({
      ...prev,
      [dayUniqueId]: value,
    }));
  };

  const loadOptions = (destinationId) => async (inputValue, callback) => {
    try {
      const { data } = await axiosOther.post("supplierlist", {
        Name: inputValue,
        DestinationId: [destinationId],
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

  return (
    <div className="SupplierSelection m-0 p-0">
      <Row>
        <Col md={12}>
          <Card>
            <CardHeader className="my-0 border-0">
              <div className="d-flex justify-content-between align-items-center w-100">
                <div className="row align-items-center w-100">
                  <div className="col-lg-2 col-md-6 mb-3">
                    <label className="querydetails text-grey">
                      Service Type
                    </label>
                    <Select
                      name="service"
                      value={selectedService}
                      placeholder="Select Service"
                      onChange={(selectedOption) =>
                        setSelectedService(selectedOption)
                      }
                      options={serviceList}
                      isSearchable
                      isClearable
                      styles={customStyles}
                      className="customSelectLightTheame"
                      classNamePrefix="custom"
                    />
                  </div>
                  {/* <div className="col-lg-4 col-md-6 mb-3">
                    <label className="querydetails text-grey">Search</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Search by Service Type"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div> */}
                  <div className="col-lg-4 d-flex align-items-end ">
                    <button
                      onClick={handleFilterSearch}
                      className="btn btn-primary btn-custom-size me-2"
                    >
                      Search
                    </button>
                    {/* <button
                      onClick={handleClearFilters}
                      className="btn btn-secondary btn-custom-size me-2"
                    >
                      Reset
                    </button> */}
                    <button
                      className="btn btn-dark btn-custom-size me-2"
                      onClick={() => navigate(-1)}
                    >
                      <span className="me-1">Back</span>
                    </button>
                    <button
                      onClick={handleNext}
                      className="btn btn-primary btn-custom-size"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </CardHeader>

            <Card.Body className="m-0 p-0 fullbody">
              {/* ---------------- UNASSIGNED GROUPS ---------------- */}
              <div>
                <div className="row headings px-1 py-2 m-0">
                  <span className="col-12 text-start textaddnew">
                    Unassigned Services
                  </span>
                </div>

                {Object.keys(filteredUnassigned)
                  .sort(
                    (a, b) =>
                      getServiceTypePriority(a) - getServiceTypePriority(b)
                  )
                  .map((groupName, gIndex) => (
                    <div key={gIndex} className="mb-3">
                      {/* Group Name */}
                      <div className="bg-light p-2 fw-bold">{groupName}</div>

                      {/* Table header */}
                      <div className="row headingss m-0">
                        <div className="col-1 borderss">Day</div>
                        <div className="col-1 borderss">Quotation</div>
                        <div className="col-1 borders">Service Type</div>
                        <div className="col-2 borderss">City</div>
                        <div className="col-4 borders">
                          {getServiceNameByService(groupName)}
                        </div>
                        <div className="col-2 borders">Select Supplier</div>
                        <div className="col-1 borders">Action</div>
                      </div>

                      {/* Rows */}
                      {filteredUnassigned[groupName].map(
                        (unassigned, index) => {
                          const initialOptions =
                            supplierList[
                              unassigned?.Service?.ServiceUniqueId
                            ]?.map((item) => ({
                              value: item?.id,
                              label: item?.Name,
                            })) || [];

                          return (
                            <div
                              key={index}
                              className="row content text-center m-0"
                            >
                              <div className="col-1 borderss">
                                Day {unassigned?.Day || ""} <br />
                                {unassigned?.CheckInDate
                                  ? getValidDate(unassigned?.CheckInDate)
                                  : ""}{" "}
                                <br />
                                {unassigned?.CheckInDate
                                  ? getValidDate(unassigned?.CheckOutDate)
                                  : ""}
                              </div>
                              <div className="col-1 borderss">
                                {unassigned?.SourceType == "Day"
                                  ? "Main"
                                  : unassigned?.EscortType}
                              </div>
                              {console.log(unassigned, "WSTTDTTDTD")}

                              <div className="col-1 borders">
                                {unassigned?.Service?.ServiceType}
                              </div>
                              <div className="col-2 borderss">
                                {ServiceTypeInclude.includes(
                                  unassigned?.Service?.ServiceType
                                )
                                  ? `${unassigned?.Service?.FromDestinationName} - ${unassigned?.Service?.ToDestinationName}`
                                  : unassigned?.Service?.DestinationName}
                              </div>
                              <div className="col-4 borders">
                                {unassigned?.Service?.ServiceType == "Guide"
                                  ? `${unassigned?.Service?.DayType} - ${unassigned?.Service?.LanguageName} Speaking Guide`
                                  : unassigned?.Service?.ServiceDetails?.[0]
                                      ?.ItemName}
                              </div>

                              <div className="col-2 borders px-2">
                                <AsyncSelect
                                  cacheOptions
                                  defaultOptions={initialOptions}
                                  loadOptions={loadOptions(
                                    unassigned?.Service?.DestinationId
                                  )}
                                  placeholder="Select Supplier"
                                  onChange={(selectedOption) =>
                                    handleSupplier(
                                      selectedOption?.value,
                                      unassigned?.Service?.ServiceUniqueId
                                    )
                                  }
                                  value={
                                    supplier[
                                      unassigned?.Service?.ServiceUniqueId
                                    ]
                                      ? initialOptions.find(
                                          (opt) =>
                                            opt.value ==
                                            supplier[
                                              unassigned?.Service
                                                ?.ServiceUniqueId
                                            ]
                                        )
                                      : null
                                  }
                                  styles={customStyles}
                                  className="customSelectLightTheame"
                                  classNamePrefix="custom"
                                  isClearable
                                  isSearchable
                                />
                              </div>
                              <div className="col-1 borders">
                                <button
                                  className="btn btn-primary btn-custom-size"
                                  onClick={() =>
                                    handleSupplierSelect(unassigned)
                                  }
                                >
                                  Select
                                </button>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  ))}
              </div>

              {/* ---------------- ASSIGNED GROUPS ---------------- */}
              <div className="my-3">
                <div className="row headings px-1 py-2 m-0">
                  <span className="col-12 text-start textaddnew">
                    Assigned Services
                  </span>
                </div>

                {Object.keys(filteredAssigned)
                  .sort(
                    (a, b) =>
                      getServiceTypePriority(a) - getServiceTypePriority(b)
                  )
                  .map((groupName, gIndex) => (
                    <div key={gIndex} className="mb-3">
                      {/* Group Name */}
                      <div className="bg-light p-2 fw-bold">{groupName}</div>
                      {console.log(groupName, "WSTSTST")}
                      {/* Table header */}
                      <div className="row headingss m-0">
                        <div className="col-1 borderss">Day</div>
                        <div className="col-1 borderss">Quotation</div>
                        <div className="col-1 borders">Service Type</div>
                        <div className="col-2 borderss">City</div>
                        {/* <div className="col-2 borders">Type</div> */}
                        <div className="col-3 borders">
                          {getServiceNameByService(groupName)}
                        </div>
                        <div className="col-2 borders">Supplier</div>
                        <div className="col-2 borders text-center">Action</div>
                      </div>

                      {/* Rows */}
                      {filteredAssigned[groupName].map((assigned, index) => (
                        <div key={index} className="row content m-0">
                          {console.log(assigned, "WATSFDTAST")}
                          <div className="col-1 borderss">
                            Day {assigned?.Day || ""} <br />
                            {assigned?.CheckInDate
                              ? getValidDate(assigned?.CheckInDate)
                              : ""}{" "}
                            <br />
                            {assigned?.CheckInDate
                              ? getValidDate(assigned?.CheckOutDate)
                              : ""}
                          </div>

                          <div className="col-1 borderss">
                            {assigned?.SourceType == "Day"
                              ? "Main"
                              : assigned?.EscortType}
                          </div>

                          <div className="col-1 borders">
                            {assigned?.Service?.ServiceType}
                          </div>

                          <div className="col-2 borderss">
                            {ServiceTypeInclude.includes(
                              assigned?.Service?.ServiceType
                            )
                              ? `${assigned?.Service?.FromDestinationName} - ${assigned?.Service?.ToDestinationName}`
                              : assigned?.Service?.DestinationName}
                          </div>

                          {/* <div className="col-2 borders">
                            {console.log(assigned, "WATSRDF87")}
                            {assigned?.Service?.ServiceDetails?.[0]?.ItemName}
                          </div> */}
                          <div className="col-3 borders">
                            {assigned?.Service?.ServiceType == "Guide"
                              ? `${assigned?.Service?.DayType} - ${assigned?.Service?.LanguageName} Speaking Guide`
                              : assigned?.Service?.ServiceDetails?.[0]
                                  ?.ItemName}
                          </div>
                          <div className="col-2 borders">
                            {
                              assigned?.Service?.ServiceDetails?.[0]
                                ?.ItemSupplierDetail?.ItemSupplierName
                            }
                          </div>
                          <div className="col-2 text-center borders">
                            <button
                              className="btn btn-primary btn-custom-size"
                              onClick={() => handleSupplierChange(assigned)}
                            >
                              Change
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SupplierSelection;
