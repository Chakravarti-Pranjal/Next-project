import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap-daterangepicker/daterangepicker.css";
import Modal from "react-bootstrap/Modal";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { notifySuccess, notifyError } from "../../../../../helper/notify.jsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { axiosOther } from "../../../../../http/axios_base_url.js";
import { ThemeContext } from "../../../../../context/ThemeContext.jsx";
import { table_custom_style } from "../../../../../css/custom_style.js";
import DataTable from "react-data-table-component";
import {
  MdOutlineSkipPrevious,
  MdOutlineSkipNext,
  MdNavigateNext,
} from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import Select from "react-select";
import { wrap } from "lodash";
import { Dropdown, Tab, Nav } from "react-bootstrap";
import { parseISO, format } from "date-fns";

function formatToDDMMYYYY(dateString) {
  if (!dateString) return "";
  try {
    const date = parseISO(dateString); // safely parses "2025-04-01"
    return format(date, "dd-MM-yyyy");
  } catch (error) {
    console.error("Invalid date:", dateString);
    return "";
  }
}

const Viewhotel = () => {
  const [selectBtn, setSelectBtn] = useState("Newest");
  const [initialList, setInitialList] = useState([]);
  const [formValue, setFormValue] = useState({
    MarketTypeId: "",
    PaxTypeId: "",
    RoomTypeID: "",
    MealPlanId: "",
    ValidFrom: "",
    ValidTo: "",
    HotelCategory: "",
    CurrencyId: "",
    HotelChain: "",
    HotelType: "",
    HotelName: ""
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [filterValue, setFilterValue] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [totalPage, setTotalPage] = useState(0);
  const [destinationList, setDestinationList] = useState([]);
  const [modalState, setModalState] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [markettypemasterlist, setMarkettypemasterlist] = useState([]);
  const [paxTypeList, setPaxTypeList] = useState([]);
  const [roomTypeList, setRoomTypeList] = useState([]);
  const [mealPlanList, setMealPlanList] = useState([]);
  const [hotelCategoryList, setHotelCategoryList] = useState([]);
  const [currencymasterlist, setCurrencymasterlist] = useState([]);
  const [hotelTypeList, setHotelTypeList] = useState([]);
  const [HotelNameList, setHotelNameList] = useState([]);
  const [showCityColumn, setShowCityColumn] = useState(false); // New state for city column visibility
  const [showHotelgroup, setShowHotelgroup] = useState(false); // New state for Hotelgroup column visibility
  const [showMarketType, setShowMarketType] = useState(false); // New State for MarketType column Visiblity
  const [showCurrency, setShowCurrency] = useState(false); // New State for Currenecy column Visiblity
  const [showAmenities, setShowAmenities] = useState(false); // New State for Currenecy column Visiblity
  const [showRemarks, setShowRemarks] = useState(false); // New State for Currenecy column Visiblity
  const [showLastModified, setShowLastModified] = useState(false); // New State for Currenecy column Visiblity
  const [showModifiedBy, setShowModifiedBy] = useState(false); // New State for Currenecy column Visiblity
  const [showFit, setShowFit] = useState(true); // New State for Currenecy column Visiblity
  const [showGit, setShowGit] = useState(false); // New State for Currenecy column Visiblity
  const [hotelChainList, setHotelChainList] = useState([]);
  const { state } = useLocation();
  const navigate = useNavigate();

  const tokenString = localStorage.getItem("token");
  const token = JSON.parse(tokenString);
  console.log(selectedDestination, "1111")

  const options = [
    { value: "all", label: "All" },
    ...(destinationList?.map((dest) => ({
      value: dest.id,
      label: dest.Name,
    })) || []),
  ];
  console.log(initialList, "state");

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

  const getDestinationList = async () => {
    try {
      const { data } = await axiosOther.post("destinationlist", {
        Search: "",
        Status: 1,
      });
      setDestinationList(data?.DataList || []);
    } catch (err) {
      console.error("Error fetching destinations:", err);
      notifyError("Failed to fetch destinations");
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
      const { data } = await axiosOther.post("paxlist", { PaxType: "" });
      setPaxTypeList(data?.DataList || []);
    } catch (error) {
      console.error("Error fetching pax types:", error);
    }
    try {
      const { data } = await axiosOther.post("roomtypelist", {
        Search: "",
        Status: "",
      });
      if (data?.Status === 200) {
        const updatedList = [
          { value: "", label: "All" },
          ...(data?.DataList?.map((data) => ({
            value: data?.id,
            label: data?.Name,
          })) || []),
        ];
        setRoomTypeList(updatedList);
      }
    } catch (error) {
      console.error("Error fetching room types:", error);
    }
    try {
      const { data } = await axiosOther.post("hotelmealplanlist", {
        Search: "",
        Status: "",
      });
      setMealPlanList(data?.DataList || []);
    } catch (error) {
      console.error("Error fetching meal plans:", error);
    }
    try {
      const { data } = await axiosOther.post("hotelcategorylist", {
        Search: "",
        Status: "",
      });
      setHotelCategoryList(data?.DataList);
    } catch (error) {
      console.log(error);
    }
    try {
      const res = await axiosOther.post("currencymasterlist", {
        id: "",
        Name: "",
        Status: "",
      });
      setCurrencymasterlist(res.data.DataList);
    } catch (error) {
      console.log(error);
    }
    try {
      const { data } = await axiosOther.post("hotelchainlist", {
        Search: "",
        Status: "",
      });
      if (data?.Status === 200) {
        const updatedList = [
          { value: "", label: "All" },
          ...(data?.DataList?.map((data) => ({
            value: data?.Name,
            label: data?.Name,
          })) || []),
        ];
        setHotelChainList(updatedList);
      }
    } catch (error) {
      console.log(error);
    }
    try {
      const { data } = await axiosOther.post("hoteltypelist", {
        Search: "",
        Status: "",
      });
      setHotelTypeList(data?.DataList);
    } catch (error) {
      console.log(error);
    }
    try {
      const { data } = await axiosOther.post("hotellist", {
        Search: "",
        Status: "",
      });
      setHotelNameList(data?.DataList);
    } catch (error) {
      console.log(error);
    }
  };
  const getDataToServer = async () => {
    try {
      const destinationsend =
        selectedDestination?.value === "all"
          ? ""
          : selectedDestination?.label || "";
      const { data } = await axiosOther.post("hotel-all-rate-list", {
        Destination: destinationsend,
        companyid: token?.companyKey.toString(), // chnage to filter to CompanyId
        MarketType: formValue?.MarketTypeId || "",
        // HotelName: selecthotelname,
        Category: formValue?.HotelCategory,
        ValidFrom: formValue?.ValidFrom,
        ValidTo: formValue?.ValidTo,
        RoomType: formValue?.RoomTypeID,
        MealPlan: formValue?.MealPlanId,
        Currency: formValue?.CurrencyId,
        PaxTypeName: formValue?.PaxTypeId,
        HotelChain: formValue?.HotelChain,
        HotelType: formValue?.HotelType,
        HotelName: formValue?.HotelName,
        page: currentPage,
        per_page: rowsPerPage,
      });
      setInitialList(data);
      setFilterValue(data?.DataList || []);
      setTotalPage(data?.total || 0);
    } catch (error) {
      console.error("Error fetching data:", error);
      notifyError("Failed to fetch data");
    }
  };

  const getAllHotelNameFromDB = async () => {
    try {
      const { data } = await axiosOther.post("hotel-all-rate-list", {
        Destination: "",
        companyid: token?.companyKey.toString(),
        MarketType: "",
        HotelName: "",
        Category: "",
        ValidFrom: "",
        ValidTo: "",
        RoomType: "",
        MealPlan: "",
        Currency: "",
        PaxTypeName: "",
        HotelChain: "",
        HotelType: "",
        HotelName: "",
        page: "",
        per_page: "",
      });

      console.log(data, "WARDSSTT");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDataToServer();
  }, [currentPage, rowsPerPage]);

  useEffect(() => {
    getDestinationList();
    getAllHotelNameFromDB();
  }, []);

  const handleShow = (row) => {
    setSelectedRow(row);
    setModalState(true);
  };

  const handleClose = () => {
    setModalState(false);
    setSelectedRow(null);
  };
  console.log(
    state?.[0]?.HotelBasicDetails?.HotelChain?.ChainName,
    "checkstatee2"
  );

  const table_columns = [
    ...(showCityColumn
      ? [
        {
          name: (
            <>
              City
              <br />
              Name
            </>
          ),
          selector: (row) => row?.DestinationName,
          cell: (row) => <span>{row?.DestinationName}</span>,
          sortable: true,
        },
      ]
      : []),
    ...(showHotelgroup
      ? [
        {
          name: (
            <>
              Hotel
              <br />
              Group
            </>
          ),
          selector: (row) => row?.RateDetail?.HotelChainName,
          cell: (row) => <span>{row?.RateDetail?.HotelChainName}</span>,
          sortable: false,
        },
      ]
      : []),
    {
      name: (
        <>
          Hotel <br />
          Name
        </>
      ),
      selector: (row) => row?.HotelName,
      cell: (row) => <span>{row?.HotelName}</span>,
      sortable: true,
    },
    ...(showCurrency
      ? [
        {
          name: <>Currency</>,
          selector: (row) => <span>{row?.RateDetail?.CurrencyName}</span>,
          sortable: true,
        },
      ]
      : []),
    {
      name: (
        <>
          Hotel <br /> Cat
        </>
      ),
      selector: (row) => <span>{row?.RateDetail?.HotelCategoryName}</span>,
      sortable: true,
      wrap: true,
      width: "5rem",
    },
    {
      name: <>Hotel Type</>,
      selector: (row) => <span>{row?.RateDetail?.RoomTypeName}</span>,
      sortable: true,
      wrap: true,
    },
    ...(showMarketType
      ? [
        {
          name: (
            <>
              Market
              <br />
              Name
            </>
          ),
          selector: (row) => <span>{row?.RateDetail?.MarketTypeName}</span>,
          sortable: true,
        },
      ]
      : []),
    {
      name: (
        <>
          Validty <br />
          From
        </>
      ),
      selector: (row) => (
        <span>{formatToDDMMYYYY(row?.RateDetail?.ValidFrom)}</span>
      ),
      sortable: true,
    },
    {
      name: (
        <>
          Validty
          <br />
          To
        </>
      ),
      selector: (row) => (
        <span>{formatToDDMMYYYY(row?.RateDetail?.ValidTo)}</span>
      ),
      sortable: true,
    },
    {
      name: (
        <>
          Room <br />
          Type
        </>
      ),
      selector: (row) => <span>{row?.RateDetail?.RoomTypeName}</span>,
      sortable: true,
      width: "6rem",
      wrap: true,
    },
    {
      name: (
        <>
          Meal <br />
          Plan
        </>
      ),
      selector: (row) => <span>{row?.RateDetail?.MealPlanName}</span>,
      sortable: true,
      width: "6rem",
    },
    {
      name: <>Tax</>,
      selector: (row) => <span>{row?.RateDetail?.MealSlabName}</span>,
      sortable: true,
      width: "5rem",
    },
    {
      name: (
        <>
          Plan
          <br />
          Type
        </>
      ),
      selector: (row) => <span>{row?.RateDetail?.MealPlanName}</span>,
      sortable: true,
      width: "5rem",
    },
    ...(showFit
      ? [
        {
          name: (
            <>
              FIT
              <br />
              SGL
            </>
          ),
          selector: (row) => (
            <span>
              {row?.RateDetail?.RoomBedType?.map((data, index) =>
                data?.RoomBedTypeName === "SGL Room" ? (
                  <div key={index}>{data?.RoomCost}</div>
                ) : null
              )}
            </span>
          ),
          sortable: true,
          width: "6rem",
        },
        {
          name: (
            <>
              FIT
              <br />
              DBL
            </>
          ),
          selector: (row) => (
            <span>
              {row?.RateDetail?.RoomBedType?.map((data, index) =>
                data?.RoomBedTypeName === "DBL Room" ? (
                  <div key={index}>{data?.RoomCost}</div>
                ) : null
              )}
            </span>
          ),
          sortable: true,
        },
        {
          name: (
            <>
              FIT
              <br />
              Extra Bed
            </>
          ),
          selector: (row) => (
            <span>
              {row?.RateDetail?.RoomBedType?.map((data, index) =>
                data?.RoomBedTypeName === "ExtraBed(A)" ? (
                  <div key={index}>{data?.RoomCost}</div>
                ) : null
              )}
            </span>
          ),
          sortable: true,
        },
      ]
      : []),
    ...(showGit
      ? [
        {
          name: (
            <>
              GIT
              <br />
              SGL
            </>
          ),
          selector: (row) => (
            <span>
              {row?.RateDetail?.RoomBedType?.map((data, index) =>
                data?.RoomBedTypeName === "SGL Room" ? (
                  <div key={index}>{data?.RoomCost}</div>
                ) : null
              )}
            </span>
          ),
          sortable: true,
        },
        {
          name: (
            <>
              GIT
              <br />
              DBL
            </>
          ),
          selector: (row) => (
            <span>
              {row?.RateDetail?.RoomBedType?.map((data, index) =>
                data?.RoomBedTypeName === "DBL Room" ? (
                  <div key={index}>{data?.RoomCost}</div>
                ) : null
              )}
            </span>
          ),
          sortable: true,
        },
        {
          name: (
            <>
              GIT
              <br />
              Extra Bed
            </>
          ),
          selector: (row) => (
            <span>
              {row?.RateDetail?.RoomBedType?.map((data, index) =>
                data?.RoomBedTypeName === "ExtraBed(A)" ? (
                  <div key={index}>{data?.RoomCost}</div>
                ) : null
              )}
            </span>
          ),
          sortable: true,
        },
      ]
      : []),
    {
      name: (
        <>
          Break
          <br />
          Fast
        </>
      ),
      selector: (row) => (
        <span>
          {row?.RateDetail?.MealType?.map((data, index) =>
            data?.MealTypeName === "Breakfast" ? (
              <div key={index}>{data?.MealCost}</div>
            ) : null
          )}
        </span>
      ),
      sortable: true,
    },
    {
      name: <>Lunch</>,
      selector: (row) => (
        <span>
          {row?.RateDetail?.MealType?.map((data, index) =>
            data?.MealTypeName === "Lunch" ? (
              <div key={index}>{data?.MealCost}</div>
            ) : null
          )}
        </span>
      ),
      sortable: true,
    },
    {
      name: <>Dinner</>,
      selector: (row) => (
        <span>
          {row?.RateDetail?.MealType?.map((data, index) =>
            data?.MealTypeName === "Dinner" ? (
              <div key={index}>{data?.MealCost}</div>
            ) : null
          )}
        </span>
      ),
      sortable: true,
    },
    ...(showLastModified
      ? [
        {
          name: (
            <>
              Last
              <br />
              Modfied Date
            </>
          ),
          selector: (row) => <span>{row?.RateDetail?.AddedDate}</span>,
          sortable: true,
        },
      ]
      : []),
    ...(showModifiedBy
      ? [
        {
          name: (
            <>
              Last <br />
              Modfied By
            </>
          ),
          selector: () => <span>{token?.UserID}</span>,
          sortable: true,
        },
      ]
      : []),
    ...(showAmenities
      ? [
        {
          name: <>Amenities</>,
          selector: (row) => <span>{row?.CurrencyName}</span>,
          sortable: true,
        },
      ]
      : []),
    ...(showRemarks
      ? [
        {
          name: <>Remark</>,
          selector: (row) => <span>{row?.RateDetail?.Remarks}</span>,
          sortable: true,
        },
      ]
      : []),
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  };

  const CustomPagination = () => {
    return (
      <div className="d-flex align-items-center border-bottom justify-content-end shadow custom-pagination gap-3 mb-5 py-2">
        <div className="d-flex align-items-center gap-3">
          <label htmlFor="PerPage" className="fs-6">
            Rows per page
          </label>
          <select
            name="PerPage"
            id="PerPage"
            className="pagination-select"
            value={rowsPerPage}
            onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
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
          disabled={currentPage === totalPage}
          className="pagination-button"
        >
          <MdNavigateNext />
        </button>
        <button
          onClick={() => handlePageChange(totalPage)}
          disabled={currentPage === totalPage}
          className="pagination-button"
        >
          <MdOutlineSkipNext />
        </button>
      </div>
    );
  };
  const handlefilter = async (e) => {
    e.preventDefault();
    try {
      const destinationsend =
        selectedDestination?.value === "all"
          ? ""
          : selectedDestination?.value || "";
      const { data } = await axiosOther.post("hotel-all-rate-list", {
        Destination: destinationsend,
        companyid: token?.companyKey.toString(), // chnage to filter to CompanyId
        MarketType: formValue?.MarketTypeId || "",
        // HotelName: selecthotelname,
        Category: formValue?.HotelCategory,
        ValidFrom: formValue?.ValidFrom,
        ValidTo: formValue?.ValidTo,
        RoomType: formValue?.RoomTypeID,
        MealPlan: formValue?.MealPlanId,
        Currency: formValue?.CurrencyId,
        PaxTypeName: formValue?.PaxTypeId,
        HotelChain: formValue?.HotelChain,
        HotelType: formValue?.HotelType,
        HotelName: formValue?.HotelName,
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

  const handleNextCalender = (date) => {
    // const formattedDate = date.toISOString().split("T")[0];
    // setFormValue((prev) => ({
    //   ...prev,
    //   ValidTo: formattedDate,
    // }));
    const formattedDate = date
      ? date.toLocaleDateString("en-GB").split("/").reverse().join("-")
      : "";
    setFormValue({
      ...formValue,
      ValidTo: formattedDate,
    });
  };

  const handleCalender = (date) => {
    // const formattedDate = date.toISOString().split("T")[0];
    // setFormValue((prev) => ({
    //   ...prev,
    //   ValidFrom: formattedDate,
    // }));
    const formattedDate = date
      ? date.toLocaleDateString("en-GB").split("/").reverse().join("-")
      : "";
    setFormValue({
      ...formValue,
      ValidFrom: formattedDate,
    });
  };
  const { background } = useContext(ThemeContext);

  return (
    <>
      <Modal
        show={modalState}
        onHide={handleClose}
        className="vehicle-details modalForRemark"
      >
        <Modal.Header closeButton>
          <Modal.Title>Remark</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRow ? (
            <p className="text-white">
              {selectedRow?.RateDetail?.Remarks || "No remarks available"}
            </p>
          ) : (
            <p>No data selected</p>
          )}
        </Modal.Body>
      </Modal>
      <div className="card-body">
        <div className="container-fluid px-3 py-2">
          <div className="row gx-3 gy-2 align-items-end">
            <div className="newest d-flex gap-2 justify-content-end mt-2">
              <button
                className="btn btn-dark btn-custom-size"
                onClick={() => navigate(-1)}
              >
                <span className="me-1">Back</span>
                <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
              </button>
            </div>
          </div>
          {/* checkbox  */}
          <div className="row mt-4">
            <div className="col ">
              <div class="form-check check-sm d-flex align-items-center">
                <input
                  type="checkbox"
                  checked={showCityColumn}
                  onChange={(e) => setShowCityColumn(e.target.checked)}
                  className="form-check-input height-em-1 width-em-1"
                />
                <label class="fontSize11px m-0 ms-1 mt-1">City</label>
              </div>
            </div>
            <div className="col">
              <div class="form-check check-sm d-flex align-items-center">
                <input
                  type="checkbox"
                  checked={showHotelgroup}
                  onChange={(e) => setShowHotelgroup(e.target.checked)}
                  className="form-check-input height-em-1 width-em-1"
                />
                <label class="fontSize11px m-0 ms-1 mt-1">Hotel Group</label>
              </div>
            </div>
            <div className="col">
              <div class="form-check check-sm d-flex align-items-center">
                <input
                  type="checkbox"
                  checked={showMarketType}
                  onChange={(e) => setShowMarketType(e.target.checked)}
                  className="form-check-input height-em-1 width-em-1"
                />
                <label class="fontSize11px m-0 ms-1 mt-1">Market Name</label>
              </div>
            </div>
            <div className="col">
              <div class="form-check check-sm d-flex align-items-center">
                <input
                  type="checkbox"
                  checked={showCurrency}
                  onChange={(e) => setShowCurrency(e.target.checked)}
                  className="form-check-input height-em-1 width-em-1"
                />
                <label class="fontSize11px m-0 ms-1 mt-1">Currency</label>
              </div>
            </div>
            <div className="col">
              <div class="form-check check-sm d-flex align-items-center">
                <input
                  type="checkbox"
                  checked={showFit}
                  onChange={(e) => setShowFit(e.target.checked)}
                  className="form-check-input height-em-1 width-em-1"
                />
                <label class="fontSize11px m-0 ms-1 mt-1">FIT</label>
              </div>
            </div>
            <div className="col">
              <div class="form-check check-sm d-flex align-items-center">
                <input
                  type="checkbox"
                  checked={showGit}
                  onChange={(e) => setShowGit(e.target.checked)}
                  className="form-check-input height-em-1 width-em-1"
                />
                <label class="fontSize11px m-0 ms-1 mt-1">GIT</label>
              </div>
            </div>
            <div className="col">
              <div class="form-check check-sm d-flex align-items-center">
                <input
                  type="checkbox"
                  checked={showAmenities}
                  onChange={(e) => setShowAmenities(e.target.checked)}
                  className="form-check-input height-em-1 width-em-1"
                />
                <label class="fontSize11px m-0 ms-1 mt-1">Amenities</label>
              </div>
            </div>
            <div className="col">
              <div class="form-check check-sm d-flex align-items-center">
                <input
                  type="checkbox"
                  checked={showRemarks}
                  onChange={(e) => setShowRemarks(e.target.checked)}
                  className="form-check-input height-em-1 width-em-1"
                />
                <label class="fontSize11px m-0 ms-1 mt-1">Remarks</label>
              </div>
            </div>
            <div className="col">
              <div class="form-check check-sm d-flex align-items-center">
                <input
                  type="checkbox"
                  checked={showLastModified}
                  onChange={(e) => setShowLastModified(e.target.checked)}
                  className="form-check-input height-em-1 width-em-1"
                />
                <label class="fontSize11px m-0 ms-1 mt-1">Last ModiFied</label>
              </div>
            </div>
            <div className="col">
              <div class="form-check check-sm d-flex align-items-center">
                <input
                  type="checkbox"
                  checked={showModifiedBy}
                  onChange={(e) => setShowModifiedBy(e.target.checked)}
                  className="form-check-input height-em-1 width-em-1"
                />
                <label class="fontSize11px m-0 ms-1 mt-1">Modified By</label>
              </div>
            </div>
          </div>

          {/* Filter Inputs */}
          <div className="row gx-3 gy-2 align-items-end mt-3">
            <div className="col-md-2 col-sm-2">
              <label className="mb-1" htmlFor="destination">
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
                  option.label
                    .toLowerCase()
                    .startsWith(inputValue.toLowerCase())
                }
              />
            </div>

            <div className="col-sm-6 col-md-3 col-lg-2">
              <label className="mb-1" htmlFor="MarketTypeId">
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
              {validationErrors?.MarketTypeId && (
                <div
                  className="invalid-feedback animated fadeInUp"
                  style={{ display: "block" }}
                >
                  {validationErrors?.MarketTypeId}
                </div>
              )}
            </div>

            <div className="col-sm-6 col-md-3 col-lg-2">
              <label className="mb-1" htmlFor="PaxTypeId">
                Pax Type
              </label>
              <select
                name="PaxTypeId"
                id="PaxTypeId"
                className="form-control form-control-sm"
                value={formValue?.PaxTypeId || ""}
                onChange={handleFormChange}
              >
                <option value="">All</option>
                {paxTypeList?.map((data) => (
                  <option key={data?.id} value={data?.Paxtype}>
                    {data?.Paxtype}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-sm-6 col-md-3 col-lg-2">
              {console.log(roomTypeList, "WYSGSGS")}
              <label className="mb-1" htmlFor="RoomTypeID">
                Room Type
              </label>
              <Select
                id="RoomTypeID"
                name="RoomTypeID"
                options={roomTypeList}
                value={roomTypeList?.find(
                  (option) => option.value === formValue?.RoomTypeID
                )}
                onChange={(selectedOption) =>
                  handleFormChange({
                    target: {
                      name: "RoomTypeID",
                      value: selectedOption?.value,
                    },
                  })
                }
                styles={customStyles}
                isSearchable
                className="customSelectLightTheame"
                classNamePrefix="custom"
                placeholder="Select Room Type"
                filterOption={(option, inputValue) =>
                  option.label
                    .toLowerCase()
                    .startsWith(inputValue.toLowerCase())
                }
              />
              {validationErrors?.RoomTypeID && (
                <div
                  className="invalid-feedback animated fadeInUp"
                  style={{ display: "block" }}
                >
                  {validationErrors?.RoomTypeID}
                </div>
              )}
            </div>
            <div className="col-md-6 col-lg-2">
              <label className="m-0">Hotel Type</label>
              <select
                className="form-control form-control-sm"
                name="HotelType"
                value={formValue?.HotelType}
                onChange={handleFormChange}
              >
                <option value={""}>All</option>
                {hotelTypeList.map((value, ind) => (
                  <option value={value?.id} key={ind + 1}>
                    {value.Name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6 col-lg-2">
              <label className="m-0">Hotel Category</label>
              <select
                className="form-control form-control-sm"
                name="HotelCategory"
                value={formValue?.HotelCategory}
                onChange={handleFormChange}
              >
                <option value={""}>All</option>
                {hotelCategoryList.map((value, ind) => (
                  <option value={value?.Name} key={ind + 1}>
                    {value.UploadKeyword}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6 col-lg-2">
              <label className="m-0">Hotel Chain</label>
              <Select
                id="HotelChain"
                name="HotelChain"
                options={hotelChainList}
                value={hotelChainList?.find(
                  (option) => option.value === formValue?.HotelChain
                )}
                onChange={(selectedOption) =>
                  handleFormChange({
                    target: {
                      name: "HotelChain",
                      value: selectedOption?.value,
                    },
                  })
                }
                className="customSelectLightTheame"
                classNamePrefix="custom"
                placeholder="Select Hotel Chain"
                styles={customStyles}
                isSearchable
                filterOption={(option, inputValue) =>
                  option.label
                    .toLowerCase()
                    .startsWith(inputValue.toLowerCase())
                }
              />
            </div>
            {/* <div className="col-md-6 col-lg-2 ">
              <div className="d-flex justify-content-between ">
                <label className="" htmlFor="name">
                  Hotel Name
                </label>
              </div>
              <input
                type="text"
                className="form-control form-control-sm "
                id="hotel name"
                value={selecthotelname}
                onChange={(e) => setselecthotelname(e.target.value)}
                placeholder="Search Hotel"
              />
            </div> */}
            <div className="col-md-6 col-lg-2">
              <label className="m-0">Hotel Name</label>
              <select
                className="form-control form-control-sm"
                name="HotelName"
                value={formValue?.HotelName}
                onChange={handleFormChange}
              >
                <option value={""}>All</option>
                {HotelNameList.map((value, ind) => (
                  <option value={value?.id} key={ind + 1}>
                    {value.HotelName}
                  </option>
                ))}
              </select>
            </div>
            {/* Validity Dates */}
            <div className="col-lg-2 col-md-3">
              <label className="mb-1">Validity From</label>
              <DatePicker
                className="form-control form-control-sm"
                selected={getFromDate()}
                onChange={handleCalender}
                dateFormat="dd-mm-yyy"
                name="ValidFrom"
                isClearable
                todayButton="Today"
              />
            </div>
            <div className="col-lg-2 col-md-3">
              <label className="mb-1">Validity To</label>
              <DatePicker
                className="form-control form-control-sm"
                selected={getNextDate()}
                onChange={handleNextCalender}
                dateFormat="yyyy-MM-dd"
                name="ValidTo"
                isClearable
                todayButton="Today"
              />
            </div>
            <div className="col-sm-6 col-md-3 col-lg-2">
              <label className="mb-1" htmlFor="MealPlanId">
                Meal Plan Type
              </label>
              <select
                name="MealPlanId"
                id="MealPlanId"
                className="form-control form-control-sm"
                value={formValue?.MealPlanId || ""}
                onChange={handleFormChange}
              >
                <option value="">All</option>
                {mealPlanList?.map((data) => (
                  <option key={data?.id} value={data?.Name}>
                    {data?.Name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-sm-6 col-md-3 col-lg-2">
              <label className="m-0" htmlFor="status">
                Currency
              </label>
              <select
                name="CurrencyId"
                id="status"
                className="form-control form-control-sm"
                value={formValue?.CurrencyId}
                onChange={handleFormChange}
              >
                <option value="">Select</option>
                {currencymasterlist &&
                  currencymasterlist?.length > 0 &&
                  currencymasterlist.map((data, index) => (
                    <option value={data?.CurrencyName}>
                      {data?.CurrencyName} ({data?.CountryCode})
                    </option>
                  ))}
              </select>
            </div>

            <div className="col-md-2 col-lg-2 d-flex justify-content-start align-items-end">
              <button
                className="btn btn-primary btn-custom-size"
                onClick={handlefilter}
              >
                <i className="fa-brands fa-searchengin me-2"></i>Search
              </button>
            </div>
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
                data={initialList?.data || []}
                sortIcon={<i className="fa-solid fa-sort fs-4"></i>}
                striped
                paginationServer
                highlightOnHover
                customStyles={table_custom_style}
                defaultSortFieldId={1}
                defaultSortAsc={false}
                className="custom-scrollbar"
                fixedHeader
                fixedHeaderScrollHeight="400px"
                onRowClicked={handleShow}
                paginationTotalRows={totalPage}
                paginationPerPage={rowsPerPage}
                onChangePage={handlePageChange}
                onChangeRowsPerPage={handleRowsPerPageChange}
                paginationComponent={CustomPagination}
              />
              <CustomPagination />
            </div>
          </div>
        </Tab.Container>
      </div>
      {/* <ToastContainer /> */}
    </>
  );
};

export default Viewhotel;
