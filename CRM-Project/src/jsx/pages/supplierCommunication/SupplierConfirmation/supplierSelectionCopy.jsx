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
  "Transport",
  "Monument",
  "Guide",
  "Restaurant",
  "Activity",
  "Flight",
  "Train",
  "Additional Service",
];

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

// Helper function to get the index of a service type in the priority order
const getServiceTypePriority = (serviceType) => {
  const index = serviceTypeOrder.indexOf(serviceType);
  return index === -1 ? serviceTypeOrder.length : index; // Place unspecified types at the end
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
    return list.reduce((acc, item) => {
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

      setAssinedsupplierSelectionList(data?.AssignedServices);
      setUnAssinedSupplierSelectionList(unassignedWithServiceId);
    } catch (err) {
      console.log(err);
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
  };

  const getSupplierList = async (serviceId, index, destinationId) => {
    try {
      const { data } = await axiosOther.post("supplierlist", {
        SupplierService: "",
        DestinationId: [destinationId],
      });
      setSupplierList((prevArr) => {
        let newArr = [...prevArr];
        newArr[index] = data?.DataList;
        return newArr;
      });
    } catch (err) {
      console.log(err);
    }
  };

  console.log(supplierList, "QSTFDTDTYD");

  useEffect(() => {
    unAssinedsupplierSelectionList?.forEach((list, index) => {
      getSupplierList(list?.serviceId, index, list?.Service?.DestinationId);
    });
  }, [unAssinedsupplierSelectionList]);

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
    const selectedSupplierId = supplier[supplierData.DayUniqueId];
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
                        <div className="col-3 borders">Service Type</div>
                        <div className="col-4 borders">Service Name</div>
                        <div className="col-2 borders">Select Supplier</div>
                        <div className="col-1 borders">Action</div>
                      </div>

                      {/* Rows */}
                      {filteredUnassigned[groupName].map(
                        (unassigned, index) => {
                          const initialOptions =
                            supplierList[index]?.map((item) => ({
                              value: item?.id,
                              label: item?.Name,
                            })) || [];
                          console.log(initialOptions, "QYSRDS7666", unassigned);
                          return (
                            <div
                              key={index}
                              className="row content text-center m-0"
                            >
                              <div className="col-1 borderss">
                                Day {unassigned?.Day || ""} <br />
                                {unassigned?.Date
                                  ? getValidDate(unassigned?.Date)
                                  : ""}
                              </div>
                              <div className="col-1 borderss">Main</div>
                              <div className="col-3 borders">
                                {unassigned?.Service?.ServiceType}
                              </div>
                              <div className="col-4 borders">
                                {
                                  unassigned?.Service?.ServiceDetails?.[0]
                                    ?.ItemName
                                }
                              </div>
                              <div className="col-2 borders px-2">
                                {console.log(
                                  supplier[unassigned?.DayUniqueId],
                                  "WATSFSFTSDHD877"
                                )}
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
                                      unassigned?.DayUniqueId
                                    )
                                  }
                                  value={
                                    supplier[unassigned?.DayUniqueId]
                                      ? initialOptions.find(
                                          (opt) =>
                                            opt.value ===
                                            supplier[unassigned?.DayUniqueId]
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

                      {/* Table header */}
                      <div className="row headingss m-0">
                        <div className="col-1 borderss">Day</div>
                        <div className="col-1 borderss">Quotation</div>
                        <div className="col-2 borders">Service Type</div>
                        <div className="col-2 borders">Type</div>
                        <div className="col-3 borders">Service Name</div>
                        <div className="col-2 borders">Supplier</div>
                        <div className="col-1 borders text-center">Action</div>
                      </div>

                      {/* Rows */}
                      {filteredAssigned[groupName].map((assigned, index) => (
                        <div key={index} className="row content m-0">
                          <div className="col-1 borderss">
                            Day {assigned?.Day || ""} <br />
                            {assigned?.Date ? getValidDate(assigned?.Date) : ""}
                          </div>
                          {console.log(assigned, "QESTSRS")}
                          <div className="col-1 borderss">Main</div>
                          <div className="col-2 borders">
                            {assigned?.Service?.ServiceType}
                          </div>
                          <div className="col-2 borders">
                            {assigned?.Service?.ServiceDetails?.[0]?.ItemName}
                          </div>
                          <div className="col-3 borders">
                            {assigned?.Service?.ServiceDetails?.[0]?.ItemName}
                          </div>
                          <div className="col-2 borders">
                            {
                              assigned?.Service?.ServiceDetails?.[0]
                                ?.ItemSupplierDetail?.ItemSupplierName
                            }
                          </div>
                          <div className="col-1 text-center borders">
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
