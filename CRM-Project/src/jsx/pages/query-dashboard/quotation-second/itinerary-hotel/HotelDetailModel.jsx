import React, { useEffect, useState, useRef, useContext } from "react";
import { Modal, Nav, Tab } from "react-bootstrap";
import { axiosOther } from "../../../../../http/axios_base_url";
import DataTable from "react-data-table-component";
import { table_custom_style } from "../../../../../css/custom_style";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ThemeContext } from "../../../../../context/ThemeContext.jsx";
import { notifyError } from "../../../../../helper/notify.jsx";

const HotelDetailModel = ({
  showModal,
  onClose,
  onSave,
  destination,
  category,
  mealPlan,
  paxType,
  fromDate,
  toDate,
  currency,
}) => {
  // const [initialList, setInitialList] = useState([]);
  const [initialList, setInitialList] = useState({ data: [], total: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [selectedRow, setSelectedRow] = useState(null);
  const [hotelTypeList, setHotelTypeList] = useState([]);
  const [formValue, setFormValue] = useState({
    MarketType: 1,
    PaxTypeId: paxType?.id || "",
    RoomTypeID: "",
    MealPlanId: mealPlan?.MealPlanId || "",
    ValidFrom: fromDate || "",
    ValidTo: toDate || "",
    HotelCategory: category || "",
    CurrencyId: 1,
    HotelChain: "",
    HotelType: "",
    // HotelName: destination?.hotel?.value || "",
  });
  useEffect(() => {
    setFormValue((meal) => ({
      ...meal,
      MealPlanId: mealPlan?.MealPlanId,
      HotelName: destination?.hotel?.value || "",
      PaxTypeId: paxType?.id || "",
      HotelCategory: category || "",
      ValidFrom: fromDate || "",
      ValidTo: toDate || "",
      RoomTypeID: "",
    }));
  }, [
    mealPlan?.MealPlanId,
    destination?.hotel?.value,
    paxType?.id,
    category,
    fromDate,
    toDate,
  ]);

  // console.log(mealPlan?.MealPlanId, "mealPlan9999");
  console.log(destination, "formvalueeeee");

  const [validationErrors, setValidationErrors] = useState({});
  const [filterValue, setFilterValue] = useState([]);
  const [destinationList, setDestinationList] = useState([]);
  const [markettypemasterlist, setMarkettypemasterlist] = useState([]);
  const [paxTypeList, setPaxTypeList] = useState([]);
  const [roomTypeList, setRoomTypeList] = useState([]);
  const [mealPlanList, setMealPlanList] = useState([]);
  const [hotelCategoryList, setHotelCategoryList] = useState([]);
  const [currencymasterlist, setCurrencymasterlist] = useState([]);
  const [hotelChainList, setHotelChainList] = useState([]);
  const [selecthotelname, setSelectHotelName] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState(
    destination?.value
  );
  const [showCityColumn, setShowCityColumn] = useState(true);
  const [showHotelgroup, setShowHotelgroup] = useState(true);
  const [showMarketType, setShowMarketType] = useState(false);
  const [showCurrency, setShowCurrency] = useState(true);
  const [showAmenities, setShowAmenities] = useState(false);
  const [showRemarks, setShowRemarks] = useState(false);
  const [showLastModified, setShowLastModified] = useState(false);
  const [showModifiedBy, setShowModifiedBy] = useState(false);
  const [showfiterData, setshowfiterData] = useState(false);
  const [showFit, setShowFit] = useState(true);
  const [showGit, setShowGit] = useState(false);
  const [modalState, setModalState] = useState(false);
  console.log(destination, "destination");

  const tokenString = localStorage.getItem("token");
  const token = JSON.parse(tokenString);
  const { background } = useContext(ThemeContext);

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
        name: "",
        id: "",
        status: 1,
      });
      setRoomTypeList(data?.DataList || []);
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
      setHotelChainList(data?.DataList);
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
  };

  console.log(destination?.destId, "destination?.destId");

  useEffect(() => {
    // Fetch all master lists ONCE
    getDestinationList();
  }, [destination?.destId]);
  const getHotellist = async () => {
    try {
      const { data } = await axiosOther.post("hotellist", {
        Search: "",
        Status: "",
        DestinationId: destination?.destId,
        HotelCategoryId: "",
        perPage: 5300,
      });
      console.log(data, "hotelname452");
      setSelectHotelName(data?.DataList);

      // If we have destination.hotel.label, make sure it exists in the list
      if (
        destination?.hotel?.label &&
        !data?.DataList?.some(
          (hotel) => hotel.HotelName === destination.hotel.label
        )
      ) {
        // Add the selected hotel to the list if it's not there
        setSelectHotelName((prev) => [
          ...prev,
          { HotelName: destination.hotel.value },
        ]);
      }
    } catch (error) {
      console.log(error);
      // Even if API fails, ensure the selected hotel is in the list
      if (destination?.hotel?.label) {
        setSelectHotelName((prev) => [
          ...prev,
          { HotelName: destination.hotel.value },
        ]);
      }
    }
  };
  useEffect(() => {
    getHotellist();
  }, [destination?.destId, destination?.hotel?.value]);

  // Update formValue when destination changes
  useEffect(() => {
    if (destination?.hotel?.label) {
      setFormValue((prev) => ({
        ...prev,
        HotelName: destination.hotel.value,
      }));
    }
  }, [destination?.hotel?.label]);
  console.log(selectedDestination, "selectedDestination");

  useEffect(() => {
    if (destination?.selectedName && destinationList.length > 0) {
      const matchingDestination = destinationList.find(
        (dest) => dest.Name === destination.selectedName
      );

      if (matchingDestination) {
        setSelectedDestination({
          value: matchingDestination.id,
          label: matchingDestination.Name,
        });
      } else {
        setSelectedDestination({
          value: destination.id || "",
          label: destination.selectedName,
        });
      }
    } else if (destination?.selectedName) {
      setSelectedDestination({
        value: destination.id || "",
        label: destination.selectedName,
      });
    } else {
      setSelectedDestination({ value: "", label: "All" });
    }
  }, [destination, destinationList]);

  const getDataToServer = async () => {
    try {
      const destinationsend = destination?.destId || "";
      console.log(destination?.destId, "SFSD545");
      const { data } = await axiosOther.post("hotel-all-rate-list", {
        Destination: destinationsend || destination?.destId,
        companyid: token?.companyKey.toString(),
        MarketType: formValue?.MarketType || "",
        HotelName: destination?.hotel?.value,
        Category: formValue?.HotelCategory,
        ValidFrom: formValue?.ValidFrom,
        ValidTo: formValue?.ValidTo,
        RoomType: formValue?.RoomTypeID,
        MealPlan: formValue?.MealPlanId,
        Currency: formValue?.CurrencyId,
        PaxType: formValue?.PaxTypeId,
        HotelChain: formValue?.HotelChain,
        HotelType: formValue?.HotelType,
        // page: page, // Include page parameter
        // per_page: perPage,
      });
      setInitialList(data);
      setFilterValue(data?.DataList || []);
      // setTotalRows(data?.total || 0);
    } catch (error) {
      console.error("Error fetching data:", error);
      notifyError("Failed to fetch data");
    }
  };
  const getDataToServers = async (page) => {
    try {
      const destinationsend = destination?.destId || "";
      console.log(destination?.destId, "SFSD545");
      const { data } = await axiosOther.post("hotel-all-rate-list", {
        Destination: destinationsend || destination?.destId,
        companyid: token?.companyKey.toString(),
        MarketType: formValue?.MarketType || "",
        HotelName: formValue?.HotelName,
        Category: formValue?.HotelCategory,
        ValidFrom: formValue?.ValidFrom,
        ValidTo: formValue?.ValidTo,
        RoomType: formValue?.RoomTypeID,
        MealPlan: formValue?.MealPlanId,
        Currency: formValue?.CurrencyId,
        PaxType: formValue?.PaxTypeId,
        HotelChain: formValue?.HotelChain,
        HotelType: formValue?.HotelType,
        page: page,
        per_page: perPage,
      });
      setInitialList(data);
      setFilterValue(data?.DataList || []);
      setTotalRows(data?.total || 0);
    } catch (error) {
      console.error("Error fetching data:", error);
      notifyError("Failed to fetch data");
    }
  };

  useEffect(() => {
    getDataToServer();
  }, [
    destination,
    category,
    destination?.hotel?.value,
    // destination?.RoomCategory,
  ]);
  useEffect(() => {
    if (showfiterData) {
      getDataToServers(currentPage);
    }
  }, [currentPage, perPage, showfiterData]);

  const handleRowClick = (row) => {
    setSelectedRow(row);
  };

  const handlePlusIconClick = (row) => {
    setSelectedRow(row);
    if (row) {
      onSave?.(row);
      onClose();
    } else {
      alert("Please select a row before saving.");
    }
  };

  const handleShow = (row) => {
    setSelectedRow(row);
    setModalState(true);
  };

  const handleClose = () => {
    setModalState(false);
    setSelectedRow(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value, " name, value");
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
    const formattedDate = date
      ? date.toLocaleDateString("en-GB").split("/").reverse().join("-")
      : "";
    setFormValue({
      ...formValue,
      ValidFrom: formattedDate,
    });
  };

  const handleNextCalender = (date) => {
    const formattedDate = date
      ? date.toLocaleDateString("en-GB").split("/").reverse().join("-")
      : "";
    setFormValue({
      ...formValue,
      ValidTo: formattedDate,
    });
  };

  const handleFilter = async (e) => {
    e.preventDefault();
    console.log(formValue, "PaxTypeId");

    try {
      const destinationsend =
        selectedDestination?.value === "all"
          ? ""
          : selectedDestination?.value || destination?.selectedName || "";
      console.log(destinationsend, "destinationsend");

      const { data } = await axiosOther.post("hotel-all-rate-list", {
        Destination: destinationsend,
        companyid: token?.companyKey.toString(),
        MarketType: formValue?.MarketType || "",
        HotelName: formValue?.HotelName,
        Category: formValue?.HotelCategory,
        ValidFrom: formValue?.ValidFrom,
        ValidTo: formValue?.ValidTo,
        RoomType: formValue?.RoomTypeID,
        MealPlan: formValue?.MealPlanId,
        Currency: formValue?.CurrencyId,
        PaxType: formValue?.PaxTypeId,
        HotelChain: formValue?.HotelChain,
        HotelType: formValue?.HotelType,
        page: currentPage,
        per_page: perPage,
      });
      console.log(data, "SDFSDFkj55");
      setInitialList(data);
      setFilterValue(data?.DataList || []);
      setTotalRows(data?.total || 0);
      setshowfiterData(true);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
      notifyError("Failed to fetch filtered data");
    }
  };

  function formatDate(dateStr) {
    if (!dateStr) return "";

    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  }

  const table_columns = [
    {
      name: "",
      cell: (row) => (
        <span
          onClick={() => handlePlusIconClick(row)}
          className="cursor-pointer"
        >
          <i className="la la-plus border bg-success text-white rounded-pill fs-5"></i>
        </span>
      ),
      sortable: false,
      width: "3rem",
    },
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
            selector: (row) => {
              console.log("City Column Row:", row); // Debug row structure
              return row?.DestinationName || "-";
            },
            cell: (row) => <span>{row?.DestinationName}</span>,
            sortable: true,
            width: "7rem",
          },
        ]
      : []),
    {
      name: (
        <>
          Hotel
          <br />
          Name
        </>
      ),
      selector: (row) => {
        console.log("Hotel Name Row:", row); // Debug row structure
        return row?.HotelName || "-";
      },
      cell: (row) => <span>{row?.HotelName || "-"}</span>,
      sortable: true,
      width: "7rem",
    },
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
            width: "7rem",
          },
        ]
      : []),
    {
      name: (
        <>
          Hotel
          <br />
          Type
        </>
      ),
      selector: (row) => row?.RateDetail?.HotelTypeName,
      cell: (row) => <span>{row?.RateDetail?.HotelTypeName}</span>,
      sortable: true,
      width: "5rem",
      wrap: true,
    },
    ...(showCurrency
      ? [
          {
            name: <>Curr</>,
            selector: (row) => row?.RateDetail?.CurrencyName,
            cell: (row) => <span>{row?.RateDetail?.CurrencyName}</span>,
            sortable: true,
            width: "6rem",
          },
        ]
      : []),
    {
      name: (
        <>
          Hotel
          <br />
          Cat
        </>
      ),
      selector: (row) => row?.RateDetail?.HotelCategoryName,
      cell: (row) => <span>{row?.RateDetail?.HotelCategoryName} Star</span>,
      sortable: true,
      width: "5rem",
      wrap: true,
    },
    // {
    //   name: (
    //     <>
    //       Hotel
    //       <br />
    //       Type
    //     </>
    //   ),
    //   selector: (row) => row?.RateDetail?.HotelTypeName,
    //   cell: (row) => <span>{row?.RateDetail?.HotelTypeName}</span>,
    //   sortable: true,
    //   width: "6rem",
    //   wrap: true,
    // },
    // ...(showMarketType
    //   ? [
    //       {
    //         name: (
    //           <>
    //             Market
    //             <br />
    //             Name
    //           </>
    //         ),
    //         selector: (row) => row?.RateDetail?.MarketTypeName,
    //         cell: (row) => <span>{row?.RateDetail?.MarketTypeName}</span>,
    //         sortable: true,
    //         width: "6rem",
    //       },
    //     ]
    //   : []),
    {
      name: (
        <>
          Validity
          <br />
          From
        </>
      ),
      selector: (row) => row?.RateDetail?.ValidFrom,
      cell: (row) => <span>{formatDate(row?.RateDetail?.ValidFrom)}</span>,
      sortable: true,
      width: "7rem",
    },
    {
      name: (
        <>
          Validity
          <br />
          To
        </>
      ),
      selector: (row) => row?.RateDetail?.ValidTo,
      cell: (row) => <span>{formatDate(row?.RateDetail?.ValidTo)}</span>,
      sortable: true,
      width: "7rem",
    },
    {
      name: (
        <>
          Room
          <br />
          Type
        </>
      ),
      selector: (row) => row?.RateDetail?.RoomTypeName,
      cell: (row) => <span>{row?.RateDetail?.RoomTypeName}</span>,
      sortable: true,
      width: "7rem",
    },
    {
      name: (
        <>
          Meal
          <br />
          Plan
        </>
      ),
      selector: (row) => row?.RateDetail?.MealPlanName,
      cell: (row) => <span>{row?.RateDetail?.MealPlanName}</span>,
      sortable: true,
      width: "6rem",
    },
    {
      name: <>Tax</>,
      selector: (row) => row?.RateDetail?.MealSlabName,
      cell: (row) => <span>{row?.RateDetail?.MealSlabName}</span>,
      sortable: true,
      width: "6rem",
    },
    {
      name: (
        <>
          Plan
          <br />
          Type
        </>
      ),
      selector: (row) => row?.RateDetail?.MealPlanName,
      cell: (row) => <span>{row?.RateDetail?.MealPlanName}</span>,
      sortable: true,
      width: "6rem",
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
            selector: (row) =>
              row?.RateDetail?.RoomBedType?.find(
                (data) => data?.RoomBedTypeName === "SGL Room"
              )?.RoomCost || "-",
            cell: (row) => (
              <span>
                {row?.RateDetail?.RoomBedType?.find(
                  (data) => data?.RoomBedTypeName === "SGL Room"
                )?.RoomCost || "-"}
              </span>
            ),
            sortable: true,
            width: "5rem",
          },
          {
            name: (
              <>
                FIT
                <br />
                DBL
              </>
            ),
            selector: (row) =>
              row?.RateDetail?.RoomBedType?.find(
                (data) => data?.RoomBedTypeName === "DBL Room"
              )?.RoomCost || "-",
            cell: (row) => (
              <span>
                {row?.RateDetail?.RoomBedType?.find(
                  (data) => data?.RoomBedTypeName === "DBL Room"
                )?.RoomCost || "-"}
              </span>
            ),
            sortable: true,
            width: "5rem",
          },
          {
            name: (
              <>
                FIT
                <br />
                Extra Bed
              </>
            ),
            selector: (row) =>
              row?.RateDetail?.RoomBedType?.find(
                (data) => data?.RoomBedTypeName === "ExtraBed(A)"
              )?.RoomCost || "-",
            cell: (row) => (
              <span>
                {row?.RateDetail?.RoomBedType?.find(
                  (data) => data?.RoomBedTypeName === "ExtraBed(A)"
                )?.RoomCost || "-"}
              </span>
            ),
            sortable: true,
            width: "5rem",
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
            selector: (row) =>
              row?.RateDetail?.RoomBedType?.find(
                (data) => data?.RoomBedTypeName === "SGL Room"
              )?.RoomCost || "-",
            cell: (row) => (
              <span>
                {row?.RateDetail?.RoomBedType?.find(
                  (data) => data?.RoomBedTypeName === "SGL Room"
                )?.RoomCost || "-"}
              </span>
            ),
            sortable: true,
            width: "5rem",
          },
          {
            name: (
              <>
                GIT
                <br />
                DBL
              </>
            ),
            selector: (row) =>
              row?.RateDetail?.RoomBedType?.find(
                (data) => data?.RoomBedTypeName === "DBL Room"
              )?.RoomCost || "-",
            cell: (row) => (
              <span>
                {row?.RateDetail?.RoomBedType?.find(
                  (data) => data?.RoomBedTypeName === "DBL Room"
                )?.RoomCost || "-"}
              </span>
            ),
            sortable: true,
            width: "5rem",
          },
          {
            name: (
              <>
                GIT
                <br />
                Extra Bed
              </>
            ),
            selector: (row) =>
              row?.RateDetail?.RoomBedType?.find(
                (data) => data?.RoomBedTypeName === "ExtraBed(A)"
              )?.RoomCost || "-",
            cell: (row) => (
              <span>
                {row?.RateDetail?.RoomBedType?.find(
                  (data) => data?.RoomBedTypeName === "ExtraBed(A)"
                )?.RoomCost || "-"}
              </span>
            ),
            sortable: true,
            width: "6rem",
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
      selector: (row) =>
        row?.RateDetail?.MealType?.find(
          (data) => data?.MealTypeName === "Breakfast"
        )?.MealCost || "-",
      cell: (row) => (
        <span>
          {row?.RateDetail?.MealType?.find(
            (data) => data?.MealTypeName === "Breakfast"
          )?.MealCost || "-"}
        </span>
      ),
      sortable: true,
      width: "5rem",
    },
    {
      name: <>Lunch</>,
      selector: (row) =>
        row?.RateDetail?.MealType?.find(
          (data) => data?.MealTypeName === "Lunch"
        )?.MealCost || "-",
      cell: (row) => (
        <span>
          {row?.RateDetail?.MealType?.find(
            (data) => data?.MealTypeName === "Lunch"
          )?.MealCost || "-"}
        </span>
      ),
      sortable: true,
      width: "6rem",
    },
    {
      name: <>Dinner</>,
      selector: (row) =>
        row?.RateDetail?.MealType?.find(
          (data) => data?.MealTypeName === "Dinner"
        )?.MealCost || "-",
      cell: (row) => (
        <span>
          {row?.RateDetail?.MealType?.find(
            (data) => data?.MealTypeName === "Dinner"
          )?.MealCost || "-"}
        </span>
      ),
      sortable: true,
      width: "6rem",
    },
    ...(showLastModified
      ? [
          {
            name: (
              <>
                Last
                <br />
                Modified Date
              </>
            ),
            selector: (row) => row?.RateDetail?.AddedDate,
            cell: (row) => <span>{row?.RateDetail?.AddedDate}</span>,
            sortable: true,
            width: "7rem",
          },
        ]
      : []),
    ...(showModifiedBy
      ? [
          {
            name: (
              <>
                Last
                <br />
                Modified By
              </>
            ),
            selector: () => token?.UserID,
            cell: () => <span>{token?.UserID}</span>,
            sortable: true,
            width: "6rem",
          },
        ]
      : []),
    ...(showAmenities
      ? [
          {
            name: <>Amenities</>,
            selector: (row) => row?.CurrencyName,
            cell: (row) => <span>{row?.CurrencyName}</span>,
            sortable: true,
            width: "6rem",
          },
        ]
      : []),
    ...(showRemarks
      ? [
          {
            name: <>Remark</>,
            selector: (row) => row?.RateDetail?.Remarks,
            cell: (row) => <span>{row?.RateDetail?.Remarks}</span>,
            sortable: true,
            width: "6rem",
          },
        ]
      : []),
  ];

  const conditionalRowStyles = [
    {
      when: (row) => selectedRow && row === selectedRow,
      style: {
        backgroundColor: "#4a90e2",
        color: "#fff",
        cursor: "pointer",
        border: "2px solid #004aad",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
        "&:hover": {
          backgroundColor: "#357abd",
        },
      },
    },
    {
      when: (row) => !selectedRow || row !== selectedRow,
      style: {
        cursor: "pointer",
      },
    },
  ];
  const roomTypeOptions = [
    { value: "", label: "All" },
    ...(roomTypeList?.map((item) => ({
      value: item.id,
      label: item.Name,
    })) || []),
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
  };

  return (
    <Modal fullscreen show={showModal} onHide={onClose} centered>
      <Modal.Header closeButton onClick={onClose}>
        <Modal.Title>Hotel Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container-fluid px-3 py-2">
          <div className="row">
            <div className="col">
              <div className="form-check check-sm d-flex align-items-center">
                <input
                  type="checkbox"
                  checked={showCityColumn}
                  onChange={(e) => setShowCityColumn(e.target.checked)}
                  className="form-check-input height-em-1 width-em-1"
                />
                <label className="fontSize11px m-0 ms-1 mt-1">City</label>
              </div>
            </div>
            <div className="col">
              <div className="form-check check-sm d-flex align-items-center">
                <input
                  type="checkbox"
                  checked={showHotelgroup}
                  onChange={(e) => setShowHotelgroup(e.target.checked)}
                  className="form-check-input height-em-1 width-em-1"
                />
                <label className="fontSize11px m-0 ms-1 mt-1">
                  Hotel Group
                </label>
              </div>
            </div>
            <div className="col">
              <div className="form-check check-sm d-flex align-items-center">
                <input
                  type="checkbox"
                  checked={showMarketType}
                  onChange={(e) => setShowMarketType(e.target.checked)}
                  className="form-check-input height-em-1 width-em-1"
                />
                <label className="fontSize11px m-0 ms-1 mt-1">
                  Market Name
                </label>
              </div>
            </div>
            <div className="col">
              <div className="form-check check-sm d-flex align-items-center">
                <input
                  type="checkbox"
                  checked={showCurrency}
                  onChange={(e) => setShowCurrency(e.target.checked)}
                  className="form-check-input height-em-1 width-em-1"
                />
                <label className="fontSize11px m-0 ms-1 mt-1">Currency</label>
              </div>
            </div>
            <div className="col">
              <div className="form-check check-sm d-flex align-items-center">
                <input
                  type="checkbox"
                  checked={showFit}
                  onChange={(e) => setShowFit(e.target.checked)}
                  className="form-check-input height-em-1 width-em-1"
                />
                <label className="fontSize11px m-0 ms-1 mt-1">FIT</label>
              </div>
            </div>
            <div className="col">
              <div className="form-check check-sm d-flex align-items-center">
                <input
                  type="checkbox"
                  checked={showGit}
                  onChange={(e) => setShowGit(e.target.checked)}
                  className="form-check-input height-em-1 width-em-1"
                />
                <label className="fontSize11px m-0 ms-1 mt-1">GIT</label>
              </div>
            </div>
            <div className="col">
              <div className="form-check check-sm d-flex align-items-center">
                <input
                  type="checkbox"
                  checked={showAmenities}
                  onChange={(e) => setShowAmenities(e.target.checked)}
                  className="form-check-input height-em-1 width-em-1"
                />
                <label className="fontSize11px m-0 ms-1 mt-1">Amenities</label>
              </div>
            </div>
            <div className="col">
              <div className="form-check check-sm d-flex align-items-center">
                <input
                  type="checkbox"
                  checked={showRemarks}
                  onChange={(e) => setShowRemarks(e.target.checked)}
                  className="form-check-input height-em-1 width-em-1"
                />
                <label className="fontSize11px m-0 ms-1 mt-1">Remarks</label>
              </div>
            </div>
            <div className="col">
              <div className="form-check check-sm d-flex align-items-center">
                <input
                  type="checkbox"
                  checked={showLastModified}
                  onChange={(e) => setShowLastModified(e.target.checked)}
                  className="form-check-input height-em-1 width-em-1"
                />
                <label className="fontSize11px m-0 ms-1 mt-1">
                  Last Modified
                </label>
              </div>
            </div>
            <div className="col">
              <div className="form-check check-sm d-flex align-items-center">
                <input
                  type="checkbox"
                  checked={showModifiedBy}
                  onChange={(e) => setShowModifiedBy(e.target.checked)}
                  className="form-check-input height-em-1 width-em-1"
                />
                <label className="fontSize11px m-0 ms-1 mt-1">
                  Modified By
                </label>
              </div>
            </div>
          </div>

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
            {/* {console.log(formValue?.MarketTypeId, "formValue452")} */}
            <div className="col-sm-6 col-md-3 col-lg-2">
              <label className="mb-1" htmlFor="MarketType">
                Market Type
              </label>
              <select
                name="MarketType"
                id="MarketType"
                className="form-control form-control-sm"
                value={formValue?.MarketType || ""}
                onChange={handleFormChange}
              >
                <option value="">Select</option>
                {markettypemasterlist?.map((data, ind) => (
                  <option key={ind + 1} value={data?.id}>
                    {data?.Name}
                  </option>
                ))}
              </select>
              {/* {validationErrors?.MarketTypeId && (
                <div
                  className="invalid-feedback animated fadeInUp"
                  style={{ display: "block" }}
                >
                  {validationErrors?.MarketTypeId}
                </div>
              )} */}
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
                {paxTypeList
                  ?.filter((item) => item?.id !== 3) // 👈 id=3 waala hata diya
                  .map((data, index) => (
                    <option key={index} value={data?.id}>
                      {data?.Paxtype}
                    </option>
                  ))}
              </select>
            </div>
            <div className="col-sm-6 col-md-3 col-lg-2">
              <label className="mb-1" htmlFor="RoomTypeID">
                Room Type
              </label>
              <Select
                id="RoomTypeID"
                options={roomTypeOptions}
                value={(() => {
                  const selectedOption = roomTypeOptions.find(
                    (option) => option.value == formValue?.RoomTypeID
                  ) || { value: "", label: "All" };
                  console.log("formValue.RoomTypeID:", formValue?.RoomTypeID);
                  console.log("selectedOption for Select:", selectedOption);
                  return selectedOption;
                })()}
                onChange={(option) =>
                  setFormValue((prev) => ({
                    ...prev,
                    RoomTypeID: option?.value || "",
                  }))
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
                <option value="">All</option>

                {hotelCategoryList.map((value, ind) => (
                  <option value={value?.id} key={ind + 1}>
                    {value.UploadKeyword}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6 col-lg-2">
              <label className="m-0">Hotel Chain</label>
              <select
                className="form-control form-control-sm"
                name="HotelChain"
                value={formValue?.HotelChain}
                onChange={handleFormChange}
              >
                <option value="">All</option>

                {hotelChainList?.map((item, ind) => (
                  <option value={item?.Id} key={ind + 1}>
                    {item?.Name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6 col-lg-2">
              <label className="mb-1" htmlFor="HotelName">
                Hotel Name
              </label>
              <Select
                id="HotelName"
                options={[
                  { value: "", label: "All" },
                  ...(selecthotelname?.map((item) => ({
                    value: item?.id,
                    label: item?.HotelName,
                  })) || []),
                ]}
                value={
                  formValue?.HotelName
                    ? {
                        value: formValue?.HotelName,
                        label:
                          selecthotelname?.find(
                            (item) => item?.id === formValue?.HotelName
                          )?.HotelName || formValue?.HotelName,
                      }
                    : { value: "", label: "All" }
                }
                onChange={(option) =>
                  setFormValue((prev) => ({
                    ...prev,
                    HotelName: option?.value || "",
                  }))
                }
                styles={customStyles}
                isSearchable
                className="customSelectLightTheame"
                classNamePrefix="custom"
                placeholder="Select Hotel"
                filterOption={(option, inputValue) =>
                  option.label
                    .toLowerCase()
                    .startsWith(inputValue.toLowerCase())
                }
              />
            </div>
            <div className="col-lg-2 col-md-3">
              <label className="mb-1">Validity From</label>
              <DatePicker
                className="form-control form-control-sm"
                selected={getFromDate()}
                onChange={handleCalender}
                dateFormat="dd-MM-yyyy"
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
                dateFormat="dd-MM-yyyy"
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
                {console.log(formValue, "formValue")}
                <option value="">All</option>
                {mealPlanList?.map((data) => (
                  <option key={data?.id} value={data?.id}>
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
                    <option value={data?.id} key={index}>
                      {data?.CurrencyName} ({data?.CountryCode})
                    </option>
                  ))}
              </select>
            </div>
            <div className="col-md-2 col-lg-2 d-flex justify-content-start align-items-end">
              <button
                className="btn btn-primary btn-custom-size"
                onClick={handleFilter}
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
                highlightOnHover
                customStyles={table_custom_style}
                defaultSortFieldId={1}
                className="custom-scrollbar"
                fixedHeader
                fixedHeaderScrollHeight="400px"
                onRowClicked={handleShow}
                conditionalRowStyles={conditionalRowStyles} // Assumed defined
                pagination
                paginationServer
                // paginationTotalRows={initialList?.total}
                paginationTotalRows={totalRows}
                paginationDefaultPage={currentPage}
                paginationPerPage={perPage}
                onChangePage={handlePageChange}
                onChangeRowsPerPage={handlePerRowsChange}
                paginationRowsPerPageOptions={[10, 25, 50, 100]}
              />
            </div>
          </div>
        </Tab.Container>
      </Modal.Body>
    </Modal>
  );
};

export default HotelDetailModel;
