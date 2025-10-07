import React, { useState, useEffect, useContext } from "react";
import "bootstrap-daterangepicker/daterangepicker.css";
import { Tab, Nav, Button } from "react-bootstrap";
import { axiosOther } from "../../../../http/axios_base_url";
import { NavLink, Link, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { table_custom_style } from "../../../../css/custom_style";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
import UseTable from "../../../../helper/UseTable";
import { wrap } from "framer-motion";
import { notifySuccess, notifyError } from "../../../../helper/notify";
import { formatDate, formatTime } from "../../../../helper/formatDate";
import { FaUser, FaPhone, FaEnvelope } from "react-icons/fa";
// Pagination

import { ThemeContext } from "../../../../context/ThemeContext";
import { MdNavigateNext } from "react-icons/md";
import { MdOutlineSkipNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import Select from "react-select";
import { MdOutlineSkipPrevious } from "react-icons/md";
import { useLocation } from "react-router-dom";
import Skeleton from "../../../layouts/Skeleton"
// import { setDefaults } from "sweetalert/typings/modules/options";

const Hotel = () => {
  const { background } = useContext(ThemeContext);
  const [selectedValue, setSelectedValue] = useState(null);
  const [Category, setCategory] = useState({
    HotelCategory: "",
  });
  const [initialList, setInitialList] = useState([]);
  const [filterValue, setFilterValue] = useState([]);
  const [destinationlist, setdestinationlist] = useState([]);
  const [hotelCategoryList, setHotelCategoryList] = useState([]);
   const [supplierList, setSupplierList] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState("");
  const [selecthotelname, setselecthotelname] = useState("");
  const [selectedHotel, setSelectedHotel] = useState("");
  // const [inputValue, setInputValue] = useState('');

  const [hotellist, sethotellist] = useState([]);
  const [filterInput, setFiterInput] = useState("");
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [totalPage, setTotalPage] = useState("");
  const [companydata, setcompanydata] = useState(null);
  const [userId, setUserId] = useState(null); // store to userid
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  const { state } = useLocation();

  // const handlePageChange = (page) => setCurrentPage(page - 1);
  // const handleRowsPerPageChange = (newRowsPerPage) =>
  //   setRowsPerPage(newRowsPerPage);

  // const tokenString = localStorage.getItem("token");
  // const token = JSON.parse(tokenString);
  // // setcompanydata(token?.companyKey)
  // console.log(token, "TokenData");
  // console.log(companydata, "companykey")
  useEffect(() => {
    const tokenString = localStorage.getItem("token");

    try {
      const token = JSON.parse(tokenString);
      // console.log(token, "TokenData");
      setcompanydata(token?.companyKey);
      setUserId(token?.UserID);
    } catch (e) {
      console.error("Invalid token in localStorage:", e);
    }
  }, []);
  // console.log(userId, "userId")

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  const getListDataToServer = async () => {
    try{
      setIsLoading(true);
    try {
      const destinationId =
        state?.selectedDestination?.value === "all"
          ? ""
          : state?.selectedDestination || "" || selectedDestination || " ";
      const hotelname = state?.selecthotelname || selecthotelname || "";
      // const hotelname= state?.selecthotelname || selectedHotel || '';
      const { data } = await axiosOther.post("hotellist", {
        HotelName: hotelname,
        id: "",
        Status: "",
        DestinationId: destinationId,
        HotelCategoryId: Category?.HotelCategory || state?.HotelCategoryId,
        page: currentPage,
        perPage: rowsPerPage,
      });
      setInitialList(data?.DataList);
      setFilterValue(data?.DataList);
      setCategory(prev => ({   // add to this line 
        ...prev,
        HotelCategory: state?.HotelCategoryId
      }));
      // setSelectedDestination(state?.selectedDestination);
      setSelectedDestination(destinationId);
      setselecthotelname(hotelname);

      setTotalPage(data?.TotalPages);

      // console.log(data?.DataList?.map((hotel) => hotel?.HotelCity),"All Hotel Cities");
    } catch (error) {
      console.log("error", error);
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
  }finally{
    setIsLoading(false);
  }
  };

  useEffect(() => {
    getListDataToServer();
  }, []);
  // useEffect(() => {
  //   getListDataToServer();
  // }, [filterInput]);
  useEffect(() => {
    getListDataToServer();
  }, [currentPage, rowsPerPage]);


  const getdestinationlist = async () => {
    try {
      const { data } = await axiosOther.post("destinationlist");

      const destinationList = data?.DataList;
      setdestinationlist(destinationList);
    } catch (error) {
      console.log("Error fetching destination or hotel list:", error);
    }
  };

  useEffect(() => {
    getdestinationlist();
  }, []);

  useEffect(() => {
    const filteredList = initialList?.filter(
      (data) =>
        data?.HotelName?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
        data?.SelfSupplier?.toLowerCase()?.includes(
          filterInput?.toLowerCase()
        ) ||
        data?.Status?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
        data?.HotelDestination?.Destinationame?.toLowerCase()?.includes(
          filterInput?.toLowerCase()
        ) ||
        data?.HotelCountry?.CountryName?.toLowerCase()?.includes(
          filterInput?.toLowerCase()
        ) ||
        data?.HotelCity?.CityName?.toLowerCase()?.includes(
          filterInput?.toLowerCase()
        ) ||
        data?.HotelBasicDetails?.HotelChain?.ChainName?.toLowerCase()?.includes(
          filterInput?.toLowerCase()
        ) ||
        data?.HotelBasicDetails?.HotelCategory?.HotelUploadKeyword?.toLowerCase()?.includes(
          filterInput?.toLowerCase()
        ) ||
        data?.HotelBasicDetails?.HotelRoomType?.some((room) =>
          room?.Name?.toLowerCase()?.includes(filterInput?.toLowerCase())
        ) ||
        data?.HotelUniqueID?.toLowerCase()?.includes(filterInput?.toLowerCase())
    );
    setFilterValue(filteredList);
  }, [filterInput]);
  const handlefilter = async (e) => {
    // sessionStorage.removeItem("selectedDestination");
    // e.preventDefault();
    try {
      setIsLoading(true);
      const destinationsend =
        selectedDestination?.value === "all" ? " " : selectedDestination.value;

      const { data } = await axiosOther.post("hotellist", {
        HotelName: selecthotelname,

        id: "",
        Status: "",
        DestinationId: destinationsend,
        HotelCategoryId: Category?.HotelCategory,
      });
      navigate("/hotel", { replace: true });

      setInitialList(data?.DataList);
      setFilterValue(data?.DataList);

      setSelectedDestination(selectedDestination);
      setTotalPage(data?.TotalPages);

      // setSelectedDestination("")
    } catch (error) {
      console.log("Error fetching destination or hotel list:", error);
    }finally{
      setIsLoading(false);
    }
    //     const filteredData= selectedDestination?.value === 'all'?
    //     ? data // show all data
    // : data.filter(item => item.destinationId === selectedDestination.value);
  };

  // useEffect(() => {
  //   handlefilter();
  // }, []);

  // useEffect(() => {
  //   handlefilter()
  // },[filterInput])

  const handleDelete = async (id) => {
    const confirmation = await swal({
      title: "Are you sure?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });

    if (confirmation) {
      try {
        const { data } = await axiosOther.post("deletehotel", {
          id: id,
        });
        if (data?.Status == 1 || data?.status == 1 || data?.result) {
          notifySuccess(data?.Message || data?.message || data?.result);
          getListDataToServer();
        }
      } catch (err) {
        if (err) {
          alert(err?.message || err?.Message);
        }
      }
    }
  };

  useEffect(() => {
    const getMessage = localStorage.getItem("success-message");
    if (getMessage != null) {
      notifySuccess(getMessage);
      localStorage.removeItem("success-message");
    }
  }, []);
  // useEffect(()=>{
  //   navigate("/hotel/add",{ states:selectedDestination });
  // },[selectedDestination])

  const renderContacts = (contacts) => {
    if (Array.isArray(contacts)) {
      return contacts?.map(
        (contact, index) =>
          index == 0 && (
            <div
              key={index}
              className="d-flex flex-column justify-content-center"
            >
              <span>
                {contact?.Title} {contact?.FirstName} {contact?.LastName}{" "}
                <i className="fa-solid fa-circle-check text-success"></i>
              </span>
              <span>
                <span className="fw-bold">Email:</span>{" "}
                {contact?.Email.replace(/'/g, "")
                  .split(",")
                  .map((email, index) => (
                    <React.Fragment key={index}>
                      {email}
                      <br />
                    </React.Fragment>
                  ))}
              </span>

              <span>
                <span className="fw-bold">Phone:</span> {contact?.Phone1}{" "}
              </span>
            </div>
          )
      );
    }
  };

  const handleEdit = (row) => {
    const rrow = {
      ...row,
      selectedDestination: selectedDestination,
      selecthotelname: selecthotelname,
      CompanyId: companydata,
    };
    navigate("/hotel/add", { state: rrow });
  };

  const handleviewhotel = () => {
    navigate("/view-hotel", { state: initialList });
    console.log(initialList, "checkstate");
  };

  const filterOption = ({ data }, inputValue) => {
    const searchTerm = inputValue.toLowerCase();

    const labelMatch =
      data.label && String(data.label).toLowerCase().includes(searchTerm);
    const valueMatch =
      data.value != null &&
      String(data.value).toLowerCase().includes(searchTerm);

    return labelMatch || valueMatch;
  };

  const handleRateNavigate = (row) => {
    console.log(row?.HotelBasicDetails?.HotelChain?.ChainId, "id");
    navigate(`/hotel/rate/${row?.id}`, {
      state: {
        HotelId: row?.id,
        UserId: userId, // change to pass userid
        HotelChainId: row?.HotelBasicDetails?.HotelChain?.ChainId, // change to pass hotelchain id
        Name: row.HotelName,
        destinationId: row?.HotelDestination?.DestinationId,
        hotelTypeId: row?.HotelBasicDetails?.HotelType?.TypeId,
        HotelCategoryId: row?.HotelBasicDetails?.HotelCategory?.CategoryId,
        Destination: row?.HotelDestination?.Destinationame,
        PaymentType: row?.HotelBasicDetails?.PaymentType,
        Master: "Hotel",
        selectedDestination: selectedDestination,
        selecthotelname: selecthotelname,
        companydata: companydata,
      },
    });
  };

  const table_columns = [
    {
      name: "Hotel Id",
      selector: (row) => row?.HotelUniqueID,
      cell: (row) => {
        // console.log(row, "row");
        return (
          <>
            <span
              className="cursor-pointer text-hover-red"
              onClick={() => handleEdit(row)}
            >
              {row?.HotelUniqueID}
            </span>
          </>
        );
      },
      sortable: true,
      minWidth: "100px",
    },

    {
      name: "Hotel Chain",
      selector: (row) => row?.HotelBasicDetails?.HotelChain?.ChainName,
      cell: (row) => (
        <span className="font-size-11">
          {row?.HotelBasicDetails?.HotelChain?.ChainName}
        </span>
      ),
      sortable: true,
      wrap: true,
      minWidth: "100px",
    },
    {
      name: "Hotel Name",
      selector: (row) => row?.HotelName,
      cell: (row) => (
        <span>
          {row?.HotelName}{" "}
          {row.Default == "Yes" && (
            <i className="mdi mdi-check-circle-outline text-success fs-4"></i>
          )}
        </span>
      ),
      sortable: true,
      wrap: true,
      width: "13rem",
      padding: "0px 0px 0px 5rem",
      // minWidth: "90px",
    },
    {
      name: "Location",
      selector: (row) => row?.HotelDestination?.Destinationame,
      cell: (row) => (
        <span>
          {row?.HotelDestination?.Destinationame}
          {`${row?.HotelDestination?.Destinationame != "" && " - "} `}
          {row?.HotelCountry?.CountryName}
        </span>
      ),
      sortable: true,
      wrap: true,
      minWidth: "80px",
    },

    {
      name: "Contact Person",
      selector: (row) => row?.HotelContactDetails,
      cell: (row) => {
        const contactData = row?.HotelContactDetails;

        // Normalize to array
        const contacts = Array.isArray(contactData)
          ? contactData
          : contactData
            ? [contactData]
            : [];

        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              padding: "5px 0",
            }}
          >
            {contacts.length > 0 ? (
              contacts.map((contact, index) => {
                const isLastItem =
                  contacts.length === 1 || index === contacts.length - 1;

                return (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                      paddingBottom: "6px",
                      borderBottom: isLastItem ? "none" : "1px solid #ddd",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <FaUser style={{ color: "#4a90e2", flexShrink: 0 }} />
                      {contact.FirstName || "N/A"}
                    </span>

                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <FaPhone style={{ color: "#27ae60", flexShrink: 0 }} />
                      {contact.Phone1 || "N/A"}
                    </span>

                    <span
                      style={{
                        display: "flex",
                        alignItems: "start",
                        gap: "8px",
                      }}
                    >
                      <FaEnvelope
                        style={{
                          color: "#e67e22",
                          marginTop: "2px",
                          flexShrink: 0,
                        }}
                      />
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "4px",
                        }}
                      >
                        {Array.isArray(contact.Email) ? (
                          contact.Email.map((email, i) => (
                            <span key={i}>{email}</span>
                          ))
                        ) : (
                          <span>{contact.Email || "N/A"}</span>
                        )}
                      </div>
                    </span>
                  </div>
                );
              })
            ) : (
              <span>No Contact Info</span>
            )}
          </div>
        );
      },
      sortable: true,
      wrap: true,
      width: "18rem",
    },
    {
      name: "Category",
      selector: (row) =>
        row.HotelBasicDetails?.HotelCategory?.HotelUploadKeyword,
      cell: (row) => (
        <span>{row.HotelBasicDetails?.HotelCategory?.HotelUploadKeyword}</span>
      ),
      sortable: true,
      wrap: true,
      minWidth: "80px",
    },
    {
      name: "Status",
      selector: (row) => row?.Status,
      cell: (row) => {
        return (
          <span
            className={`badge ${row.Status == "Active"
              ? "badge-success light badge"
              : "badge-danger light badge"
              }`}
          >
            {row.Status}
          </span>
        );
      },
      sortable: true,
      minWidth: "50px",
    },
    {
      name: "Time Stamp",
      selector: (row) => row.CreatedAt,
      cell: (row) => {
        const createdAt = new Date(row.CreatedAt);

        const day = String(createdAt.getDate()).padStart(2, "0");
        const month = String(createdAt.getMonth() + 1).padStart(2, "0"); // Months are 0-based
        const year = createdAt.getFullYear();

        const date = `${day}-${month}-${year}`;

        const time = createdAt.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });

        return (
          <span>
            {date} {time}
          </span>
        );
      },
      sortable: true,
      minWidth: "160px",
      wrap: true,
    },
    // {
    //   name: "Room Type",
    //   selector: (row) =>
    //     row?.HotelBasicDetails?.HotelRoomType?.map((type) => type?.Name).join(", "),
    //   cell: (row) => (
    //     <div className="">
    //       {row?.HotelBasicDetails?.HotelRoomType?.map((type, index) => (
    //         <span key={index}>
    //           {type?.Name}
    //           {index !== row?.HotelBasicDetails?.HotelRoomType.length - 1 &&
    //             ", "}
    //         </span>
    //       ))}
    //     </div>
    //   ),
    //   sortable: true,
    //   wrap: true,
    //   minWidth: "90px",
    // },
    // {
    //   name: "Room Type",
    //   selector: (row) =>
    //     Array.isArray(row?.HotelBasicDetails?.HotelRoomType)
    //       ? row?.HotelBasicDetails.HotelRoomType.map((type) => type?.Name).join(
    //           ", "
    //         )
    //       : "N/A",

    //   cell: (row) => (
    //     <div className="">
    //       {Array.isArray(row?.HotelBasicDetails?.HotelRoomType) ? (
    //         row?.HotelBasicDetails.HotelRoomType.map((type, index) => (
    //           <span key={index}>
    //             {type?.Name}
    //             {index !== row?.HotelBasicDetails.HotelRoomType.length - 1 &&
    //               ", "}
    //           </span>
    //         ))
    //       ) : (
    //         <span>N/A</span>
    //       )}
    //     </div>
    //   ),
    //   sortable: true,
    // },
    // {
    //   name: "Gallery",
    //   selector: (row) => row.Gallery,
    //   cell: (row) => row.Gallery,
    //   sortable: false,
    //   wrap: true,
    //   minWidth: "70px",
    // },
    {
      name: "Rate Sheet",
      selector: (row) => (
        <Button
          variant="dark light py-1 rounded-pill fontSize11px px-1"
          onClick={() => handleRateNavigate(row)}
        >
          View/Add
        </Button>
      ),
      sortable: false,
      wrap: true,
      minWidth: "100px",
    },
    {
      name: "Action",
      selector: (row) => {
        return (
          <div className="d-flex align-items-center gap-1 sweetalert">
            <i
              className="fa-solid fa-pencil cursor-pointer text-success action-icon"
              onClick={() => handleEdit(row)}
            ></i>
            <div className="sweetalert mt-5"></div>
            <i
              className="fa-solid fa-trash-can cursor-pointer text-danger action-icon sweet-confirm"
              onClick={() => handleDelete(row?.id)}
            ></i>
          </div>
        );
      },
      sortable: false,
      minWidth: "30px",
      style: {
        display: "flex",
        alignItems: "center",
      },
      width: "4.5rem",
    },
  ];

  // Hotel List Pagination
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
  // console.log(destinationlist,hotellist,"check")
  const options = [
    { value: "all", label: "All" },
    ...(destinationlist?.map((dest) => ({
      value: dest.id,
      label: dest.Name,
    })) || []),
  ];
  const handleChange = (selected) => {
    setSelectedValue(selected);
    console.log("Selected ID:", selected?.value);
  };

  return (
    <Tab.Container defaultActiveKey="All">
      <div className="d-flex justify-content-between align-items-center flex-wrap">
        <div className="card-action coin-tabs mb-2 d-flex gap-4">
          <Nav as="ul" className="nav nav-tabs">
            <Nav.Item as="li" className="nav-item">
              <Nav.Link className="nav-link" eventKey="All">
                All List
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </div>
        <div className="col-md-1 col-sm-1 ">
          <div className="d-flex justify-content-between">
            <label className="" htmlFor="name">
              Destination
            </label>
          </div>
          <div className="nav-item d-flex align-items-center mb-2">
            <Select
              id="destination"
              options={options}
              value={selectedDestination || options[0]}
              onChange={setSelectedDestination}
              styles={customStyles}
              isSearchable
              className="customSelectLightTheame"
              classNamePrefix="custom"
              placeholder={
                state?.selectedDestination?.label || state?.Destinationame
              }
              filterOption={(option, inputValue) =>
                option.label.toLowerCase().startsWith(inputValue.toLowerCase())
              }
            />
          </div>
        </div>
        <div className="col-md-6 col-lg-2 pb-2">
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
        </div>
        <div className="col-md-6 col-lg-2 pb-2">
          <label className="m-0">Hotel Category</label>
          <select
            className="form-control form-control-sm"
            name="HotelCategory"
            value={Category?.HotelCategory}
            onChange={handleFormChange}
          >
            <option value={""}>All</option>
            {hotelCategoryList.map((value, ind) => (
              <option value={value?.id} key={ind + 1}>
                {value.UploadKeyword}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-1 d-flex justify-content-start align-items-center">
          <div className="nav-item d-flex align-items-center">
            <button
              className="btn btn-primary btn-custom-size"
              onClick={handlefilter}
            >
              <i className="fa-brands fa-searchengin me-2"></i>Search
            </button>
          </div>
        </div>

        {/* <div className="col-md-1  ">
          <div className="nav-item d-flex align-items-center">
           
              <select name="" id="" className="form-control form-control-sm text-white" 
              value={filterInput}
              onChange={(e) => setFilterValue(e.target.value)}>
                {
                  destinationlist?.map((dest,index)=>{
                 
                    return(

                  <>  <option value="">Select</option>
                    <option value={dest.Cityid} key={index} className="text-white">{dest.CityName}</option>
                    </>  
                    
                  )
                  })
                }
              </select>
       
          </div>
        </div> */}

        {/* <div className="col-md-1  ">
          <div className="nav-item d-flex align-items-center">
           
             <button className="btn btn-primary btn-custom-size" onChange={(e) => setFiterInput(e.target.value)}> <i className="fa-brands fa-searchengin me-2"></i>Search</button>
       
          </div>
        </div> */}
        {/* <div className="col-md-3 d-flex justify-content-start align-items-center">
          <div className="nav-item d-flex align-items-center">
            <div className="input-group search-area">
              <input
                type="text"
                className="form-control border"
                placeholder="Search.."
                onChange={(e) => setFiterInput(e.target.value)}
              />
              <span className="input-group-text border">
                <i className="flaticon-381-search-2 cursor-pointer"></i>
              </span>
            </div>
          </div>
        </div> */}

        <div className=" d-flex justify-content-center align-items-center  mb-2 flex-wrap">
          <div className="guest-calendar"></div>
          <div className="">
            <button
              // to={"/view-hotel"}
              className="btn btn-primary btn-custom-size"
              onClick={handleviewhotel}
            >
              View Hotel
            </button>
          </div>
        </div>
        <div className="d-flex align-items-center mb-2 flex-wrap">
          <div className="guest-calendar"></div>
          <div className="newest ms-3 d-flex gap-2">
            <button
              className="btn btn-dark btn-custom-size"
              name="SaveButton"
              onClick={() => navigate(-1)}
            >
              <span className="me-1">Back</span>
              <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
            </button>
            <Link to={"/hotel/add"} className="btn btn-primary btn-custom-size">
              Add Hotel
            </Link>
          </div>
        </div>
      </div>
      <ToastContainer />
      {/* <UseTable
        table_columns={table_columns}
        filterValue={filterValue}
        setFilterValue={setFilterValue}
        rowsPerPage={rowsPerPage}
        handlePage={handlePageChange}
        handleRowsPerPage={handleRowsPerPageChange}
      /> */}
      {isLoading ? (
        <Skeleton />
      ) : (
        <>
          <DataTable
            columns={table_columns}
            data={initialList}
            sortIcon={<i className="fa-solid fa-sort fs-4"></i>}
            striped
            paginationServer
            highlightOnHover
            customStyles={table_custom_style(background)}
            defaultSortFieldId={1}
            paginationTotalRows={4}
            defaultSortAsc={true}
            className="custom-scrollbar"
          />
          <CustomPagination />
        </>
      )}
    </Tab.Container>
  );
};
export default Hotel;
