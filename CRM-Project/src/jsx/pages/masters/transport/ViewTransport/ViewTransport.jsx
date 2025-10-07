import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap-daterangepicker/daterangepicker.css";
import { Dropdown, Tab, Nav } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
import { notifySuccess, notifyError } from "../../../../../helper/notify.jsx";
import UseTable from "../../../../../helper/UseTable.jsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { axiosOther } from "../../../../../http/axios_base_url.js";
import DataTable from "react-data-table-component";
import { MdOutlineSkipPrevious } from "react-icons/md";
import { MdOutlineSkipNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import { MdNavigateNext } from "react-icons/md";
import { table_custom_style } from "../../../../../css/custom_style.js";
import useMultipleSelect from "../../../../../hooks/custom_hooks/useMultipleSelect.jsx";
import Select from "react-select";
import Modal from "react-bootstrap/Modal";
const ViewTransport = () => {
  const [selectBtn, setSelectBtn] = useState("Newest");
  const [initialList, setInitialList] = useState([]);
  const [formValue, setFormValue] = useState({
    ValidFrom: "",
    ValidTo: "",
    Capacity: "",
    MarketTypeId: "",
    VehicleTypeName: "",
    TransferTypeName: "",
    TaxSlabId: "",
    ParkingFee: "",
    VehicleCost: "",
    SupplierId: "",
    TransferType: ""
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [filterValue, setFilterValue] = useState([]);
  const [filterInput, setFiterInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [totalPage, setTotalPage] = useState("");
  const [destinationList, setDestinationList] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [selecthotelname, setselecthotelname] = useState("");
  const [markettypemasterlist, setMarkettypemasterlist] = useState([]);
  const [vehicleList, setVehicleList] = useState([]);
  const [slabList, setSlabList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [modalState, setModalState] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [transferTypeList, setTransferTypeList] = useState([]);
  const handleShow = (row) => {
    setSelectedRow(row);
    setModalState(true);
  };
  const Token = JSON.parse(localStorage.getItem("token"));
  console.log(Token, "Token")
  const handleClose = () => {
    setModalState(false);
    setSelectedRow(null);
  };
  const navigate = useNavigate();
  const getDataToServer = async () => {
    try {
      const destinationsend = selectedDestination?.value === "all" ? "" : selectedDestination?.label || "";
      const { data } = await axiosOther.post("transport-all-rate-list", {
        Destination: destinationsend,
        companyid: Token?.companyKey,  // change to companyId 
        MarketType: formValue?.MarketTypeId || "",
        TransportName: selecthotelname,
        TransferTypeName: formValue?.TransferTypeName,  // chnage to TransferTypeName to filter
        VehicleType: formValue?.VehicleTypeName,
        ValidFrom: formValue?.ValidFrom,
        ValidTo: formValue?.ValidTo,
        TaxSlab: formValue?.TaxSlabId,
        ParkingFee: formValue?.ParkingFee,
        VehicleCost: formValue?.VehicleCost,
        Supplier: formValue?.SupplierId,
        page: currentPage,
        per_page: rowsPerPage
      });
      // console.log(data, "API Response"); // Debug the API response
      setInitialList(data || []); // Set initialList to DataList or empty array
      setFilterValue(data?.DataList || []);
      setTotalPage(data?.total) // Set filterValue to DataList or empty array
    } catch (error) {
      console.error("Error fetching data:", error);
      notifyError("Failed to fetch transport data");
    }
  };

  const getDestinationList = async () => {
    try {
      const { data } = await axiosOther.post("destinationlist", {
        Search: "",
        Status: 1,
      });
      setDestinationList(data.DataList);
    } catch (err) {
      console.log(err);
    }
    try {
      const res = await axiosOther.post("markettypemasterlist", {
        id: "",
        Name: "",
        Status: "",
      });
      setMarkettypemasterlist(res.data.DataList || []);
    } catch (err) {
      console.error("Error fetching market types:", err);
    }
    try {
      const { data } = await axiosOther.post("vehicletypemasterlist", {
        Search: "",
        Status: "",
      });
      setVehicleList(data?.DataList);
    } catch (error) {
      console.log(error);
    }
    try {
      const { data } = await axiosOther.post("taxmasterlist", {
        Id: "",
        Search: "",
        Status: "",
        ServiceType: "4",
      });
      setSlabList(data?.DataList)
    } catch (error) {
      console.log(error);
    }
    try {
      const { data } = await axiosOther.post("supplierlist", {
        Name: "",
        id: "",
        // SupplierService: [4],

      });
      setSupplierList(data?.DataList);
    } catch (error) {
      console.log(error);
    }
    try {
      const { data } = await axiosOther.post("transfertypemasterlist", {
        Search: "",
        Status: 1,
      });
      setTransferTypeList(data.DataList);
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    getDestinationList()
  }, [])

  const options = [
    { value: "all", label: "All" },
    ...(destinationList?.map((dest) => ({
      value: dest.id,
      label: dest.Name,
    })) || []),
  ];

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
      height: "2rem", // compact height
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
      zIndex: 9999, // only number here
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

  // ========================================================

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
  };
  const CustomPagination = () => {
    return (
      <div className="d-flex align-items-center border-bottom justify-content-end shadow custom-pagination gap-3 mb-5 py-2">
        <div className="d-flex align-items-center gap-3">
          <label htmlFor="" className="fs-6">
            Rows per page
          </label>
          <select
            name="PerPage"
            id=""
            className="pagination-select"
            value={rowsPerPage}
            onChange={(e) => {
              handleRowsPerPageChange(e.target.value);
            }}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="40">40</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          <MdOutlineSkipPrevious />
        </button>
        <button
          onClick={() =>
            handlePageChange(currentPage > 1 ? currentPage - 1 : 1)
          }
          disabled={currentPage === 1}
          className="pagination-button"
        >
          <GrFormPrevious />
        </button>
        <span className="text-light">
          {currentPage} of {totalPage}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage == totalPage}
          className="pagination-button"
        >
          <MdNavigateNext />
        </button>
        <button
          onClick={() => handlePageChange(totalPage)}
          disabled={currentPage == totalPage}
          className="pagination-button"
        >
          <MdOutlineSkipNext />
        </button>
      </div>
    );
  };
  // ========================================================

  useEffect(() => {
    getDataToServer(); // Fetch data on component mount
  }, [currentPage, rowsPerPage]); // Empty dependency array to run only once on mount

  const getUniqueVehicleTypes = (data) => {
    const vehicleTypes = new Set();

    if (Array.isArray(data)) {
      data.forEach((row) => {
        row?.RateDetail?.VehicleType?.forEach((vehicle) => {
          vehicleTypes.add(vehicle?.VehicleTypeName);
        });
      });
    } else {
      console.warn("Expected an array, got:", data);
    }

    return Array.from(vehicleTypes);
  };

  // Static columns (non-vehicle related)
  const staticColumns = [
    {
      name: (<>Transfer<br />Type</>),
      //  "Program Type",
      selector: (row) => row?.RateDetail?.TransferTypeName || "",
      cell: (row) => <span>{row?.RateDetail?.TransferTypeName || ""}</span>,
      sortable: true,
      width: "7rem",
    },
    {
      name: (<>Local<br />Agent</>),
      // "Local Agent",
      selector: (row) => row?.RateDetail?.SupplierName || "",
      cell: (row) => <span>{row?.RateDetail?.SupplierName || ""}</span>,
      sortable: true,
      width: "7rem"
    },
    {
      name: (<>Destination</>),
      // "Destination",
      selector: (row) => row?.RateDetail?.DestinationName || "",
      cell: (row) => <span>{row?.RateDetail?.DestinationName || ""}</span>,
      sortable: true,
      width: "7rem"
    },
    {
      name: (<>Program<br />Name</>),
      // "Program Name",
      selector: (row) => row?.TransportName || "",
      cell: (row) => <span>{row?.TransportName || ""}</span>,
      sortable: true,
      width: "8rem"
    },
    // {
    //   name: (<>Valid<br />From</>),
    //   // "Valid From",
    //   selector: (row) => row?.RateDetail?.ValidFrom || "",
    //   cell: (row) => <span>{row?.RateDetail?.ValidFrom || ""}</span>,
    //   sortable: true,
    //   width: "7rem"
    // },
    // {
    //   name: (<>Valid <br />To</>),
    //   // "Valid To",
    //   selector: (row) => row?.RateDetail?.ValidTo || "",
    //   cell: (row) => <span>{row?.RateDetail?.ValidTo || ""}</span>,
    //   sortable: true,
    //   width: "7rem"
    // },
    // {
    //   name: (<>Cities <br />(Nights)</>),
    //   // "Cities(Nights)",
    //   selector: () => "", // Placeholder, update with actual data if available
    //   cell: () => <span></span>,
    //   sortable: true,
    //   width: "6rem"
    // },
    // {
    //   name: (<>Arrival /<br />Departure Transfer</>),
    //   // "Arrival/Departure Transfer",
    //   selector: () => "", // Placeholder, update with actual data if available
    //   cell: () => <span></span>,
    //   sortable: true,
    //   width: "7rem"
    // }
  ];
  const endStaticColumns = [
    {
      name: (<>Portages <br />(PP)</>),
      // "Portages (PP)",
      selector: () => "", // Placeholder
      cell: () => <span></span>,
      sortable: true,
      width: "6rem"
    },
    {
      name: (<>Assistance</>),
      // "Assistance",
      selector: () => "", // Placeholder
      cell: () => <span></span>,
      sortable: true,
      // width: "6rem"
    },
    {
      name: (<>Night <br />Halt Charge</>),
      // "Night Halt Charge",
      selector: () => "", // Placeholder
      cell: () => <span></span>,
      sortable: true,
      // width: "6rem"
    },
  ]

  // Generate dynamic vehicle columns
  const generateVehicleColumns = (vehicleTypes) => {
    return vehicleTypes.map((vehicleTypeName) => ({
      name: <span className="fs-8">{vehicleTypeName}</span>,
      selector: (row) => {
        const vehicle = row?.RateDetail?.VehicleType?.find(
          (v) => v.VehicleTypeName === vehicleTypeName
        );
        return vehicle ? Math.round(vehicle.GrandTotal) : "";
      },
      cell: (row) => {
        const vehicle = row?.RateDetail?.VehicleType?.find(
          (v) => v.VehicleTypeName === vehicleTypeName
        );
        return <span>{vehicle ? Math.round(vehicle.GrandTotal) : ""}</span>;
      },
      sortable: true,
      width: "8rem"
    }));
  };


  // Generate table_columns
  const vehicleTypes = getUniqueVehicleTypes(initialList?.data);
  const dynamicVehicleColumns = generateVehicleColumns(vehicleTypes);
  const table_columns = [...staticColumns, ...dynamicVehicleColumns, ...endStaticColumns];

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getFromDate = () => {
    return formValue?.ValidFrom ? new Date(formValue?.ValidFrom) : null;
  };

  const getNextDate = () => {
    return formValue?.ValidTo ? new Date(formValue?.ValidTo) : null;
  };

  const handleCalender = (date) => {
    const formattedDate = date ? date.toISOString().split("T")[0] : null;
    setFormValue({
      ...formValue,
      ValidFrom: formattedDate,
    });
  };

  const handleNextCalender = (date) => {
    const formattedDate = date ? date.toISOString().split("T")[0] : null;
    setFormValue({
      ...formValue,
      ValidTo: formattedDate,
    });
  };

  const handlefilter = async (e) => {
    e.preventDefault();
    try {
      const destinationsend = selectedDestination?.value === "all" ? "" : selectedDestination?.label || "";
      const { data } = await axiosOther.post("transport-all-rate-list", {
        Destination: destinationsend,
        companyid: Token?.companyKey,
        MarketType: formValue?.MarketTypeId || "",
        TransportName: selecthotelname,
        TransferTypeName: formValue?.TransferTypeName,
        VehicleType: formValue?.VehicleTypeName,
        ValidFrom: formValue?.ValidFrom,
        ValidTo: formValue?.ValidTo,
        TaxSlab: formValue?.TaxSlabId,
        ParkingFee: formValue?.ParkingFee,
        VehicleCost: formValue?.VehicleCost,
        Supplier: formValue?.SupplierId,
        page: 1,
        per_page: rowsPerPage,
      });
      setInitialList(data);
      setFilterValue(data?.DataList || []);
      setTotalPage(data?.total || 0);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
      notifyError("Failed to fetch filtered data");
    }
  };

  return (
    <>
      <Modal show={modalState} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Remark</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRow ? (
            <p className="text-white">{selectedRow?.RateDetail?.Remarks || "No remarks available"}</p>
          ) : (
            <p>No data selected</p>
          )}
        </Modal.Body>
      </Modal>
      <div className="row my-3 px-2 align-items-end">
        <div className="newest  d-flex gap-2 justify-content-end me-2">
          <button
            className="btn btn-dark btn-custom-size"
            name="SaveButton"
            onClick={() => navigate(-1)}
          >
            <span className="me-1">Back</span>
            <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
          </button>
        </div>
      </div>

      <div className="row mb-2">
        <div className="col-md-2 col-sm-2">
          <label className="" htmlFor="destination">
            Destination
          </label>
          <Select
            id="destination"
            options={options}
            value={selectedDestination}
            onChange={(option) => setSelectedDestination(option)}
            styles={customStyles}
            isSearchable
            className="customSelectLightTheame"
            classNamePrefix="custom"
            placeholder="Select Destination"
            filterOption={(option, inputValue) =>
              option.label.toLowerCase().startsWith(inputValue.toLowerCase())
            }
          />
        </div>
        <div className="col-md-6 col-lg-2">
          <label className="m-0">Transfer Type</label>
          <select
            name="TransferTypeName"
            id=""
            className="form-control form-control-sm"
            value={formValue?.TransferTypeName}
            onChange={handleFormChange}
          >
            <option value="">Select</option>
            {transferTypeList?.map((value, index) => {
              return (
                <option value={value.Name} key={index + 1}>
                  {value.Name}
                </option>
              );
            })}
          </select>
        </div>
        <div className="col-md-6 col-lg-2">
          <label className="" htmlFor="name">
            Transport Name
          </label>
          <input
            type="text"
            className="form-control form-control-sm "
            id="hotel name"
            value={selecthotelname}
            onChange={(e) => setselecthotelname(e.target.value)}
            placeholder="Search Transport"
          />
        </div>
        <div className="col-sm-6 col-md-3 col-lg-2">
          <label className="" htmlFor="MarketTypeId">
            Market Type
          </label>
          <select
            name="MarketTypeId"
            id="MarketTypeId"
            className="form-control form-control-sm"
            value={formValue?.MarketTypeId || ""}
            onChange={handleFormChange}
          >
            <option value="">Select</option>
            {markettypemasterlist?.map((data) => (
              <option key={data?.id} value={data?.Name}>
                {data?.Name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-sm-6 col-md-3 col-lg-2">
          <label className="">Validity From</label>
          <DatePicker
            className="form-control form-control-sm"
            selected={getFromDate()}
            onChange={handleCalender}
            dateFormat="dd-MM-yyyy"
            name="ValidFrom"
            isClearable todayButton="Today"
          />
        </div>

        <div className="col-sm-6 col-md-3 col-lg-2">
          <label className="">Validity To</label>
          <DatePicker
            className="form-control form-control-sm"
            selected={getNextDate()}
            onChange={handleNextCalender}
            dateFormat="dd-MM-yyyy"
            name="ValidTo"
            isClearable todayButton="Today"
          />
        </div>
        <div className="col-sm-6 col-md-3 col-lg-2">
          <label className="" htmlFor="MarketTypeId">
            Vehicle Type
          </label>
          <select
            name="VehicleTypeName"
            id="VehicleTypeName"
            className="form-control form-control-sm"
            value={formValue?.VehicleTypeName || ""}
            onChange={handleFormChange}
          >
            <option value="">Select</option>
            {vehicleList?.map((data) => (
              <option key={data?.id} value={data?.Name}>
                {data?.Name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6 col-lg-2">
          <label htmlFor="">
            Tax Slab(%)
          </label>
          <select
            select
            name="TaxSlabId"
            id="TaxSlabId"
            className="form-control form-control-sm"
            value={formValue?.TaxSlabId}
            onChange={handleFormChange}
          >
            <option value="">Select</option>
            {slabList?.map((item) => {
              return (
                <option value={item?.TaxSlabName} key={item?.id}>
                  {item?.TaxSlabName} ({item?.TaxValue})
                </option>
              );
            })}
          </select>
        </div>
        {/* <div className="col-md-6 col-lg-2">
          <label className="" htmlFor="parkingFee">
            Parking Fee
          </label>
          <input
            type="text"
            className="form-control form-control-sm"
            id="parkingFee"
            value={formValue.ParkingFee}
            onChange={(e) => setFormValue({ ...formValue, ParkingFee: e.target.value })}
            placeholder="Enter Parking Fee"
          />
        </div>

        <div className="col-md-6 col-lg-2">
          <label className="" htmlFor="vehicleCost">
            Vehicle Cost
          </label>
          <input
            type="text"
            className="form-control form-control-sm"
            id="vehicleCost"
            value={formValue.VehicleCost}
            onChange={(e) => setFormValue({ ...formValue, VehicleCost: e.target.value })}
            placeholder="Enter Vehicle Cost"
          />
        </div> */}
        <div className="col-md-6 col-lg-2">
          <label className="" htmlFor="status">
            Supplier Name
          </label>
          <select
            name="SupplierId"
            id="status"
            className="form-control form-control-sm"
            value={formValue?.SupplierId}
            onChange={handleFormChange}
          >
            <option value="">Select</option>
            {supplierList?.map((item) => {
              return (
                <option value={item?.Name} key={item?.id}>
                  {item?.Name}
                </option>
              );
            })}
          </select>
        </div>

        <div className="col-md-2 col-lg-2 d-flex justify-content-start align-items-end">
          <button className="btn btn-primary btn-custom-size" onClick={handlefilter}>
            <i className="fa-brands fa-searchengin me-2"></i>Search
          </button>
        </div>
      </div>

      <Tab.Container defaultActiveKey="All">
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <div className="card-action coin-tabs mb-2">
            <Nav as="ul" className="nav nav-tabs">
              <Nav.Item as="li" className="nav-item">
                <Nav.Link className="nav-link" eventKey="All">
                  All List
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </div>
        </div>
        <div className="table-responsive">
          <div id="example2_wrapper" className="dataTables_wrapper no-footer">
            <DataTable
              columns={table_columns}
              data={initialList?.data}
              sortIcon={<i className="fa-solid fa-sort fs-4"></i>}
              striped
              paginationServer
              highlightOnHover
              onRowClicked={handleShow}
              customStyles={table_custom_style}
              fixedHeader
              fixedHeaderScrollHeight="400px"
              defaultSortFieldId={1}
              paginationTotalRows={4}
              defaultSortAsc={false}
              className="custom-scrollbar"
            />
            <CustomPagination />
          </div>
        </div>
      </Tab.Container>
    </>
  );
};

export default ViewTransport;
