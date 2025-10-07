import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Tab, Nav, Button } from "react-bootstrap";
import { axiosOther } from "../../../../../http/axios_base_url.js";
import { visaTypeValidationSchema } from "../../master_validation.js";
import { visaTypeInitialValue } from "../../masters_initial_value.js";
import "react-toastify/dist/ReactToastify.css";
import { notifySuccess, notifyError } from "../../../../../helper/notify.jsx";
import swal from "sweetalert";
import extractTextFromHTML from "../../../../../helper/htmlParser.js";
import Model from "./Model.jsx";
import UseTable from "../../../../../helper/UseTable.jsx";
import Select from "react-select";
import { useLocation } from "react-router-dom";
import Destination from "../../destination/index.jsx";
import zIndex from "@mui/material/styles/zIndex.js";
const Monument = () => {
  const navigate = useNavigate();
  const [validationErrors, setValidationErrors] = useState({});
  const [businessData, setBusinessData] = useState(visaTypeInitialValue);
  const [businessList, setBusinessList] = useState([]);
  const [filterValue, setFilterValue] = useState([]);
  const [filterInput, setFiterInput] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [serviceimagelist, setserviceimagelist] = useState([]);
  const [row, setRow] = useState([]);
  const [open, setopen] = useState(false);
  const [Dataview, setDataview] = useState("");
  const [destinationlist, setdestinationlist] = useState([]);
  const [initialList, setInitialList] = useState([]);
  // const location = useLocation();
  const [selectedDestination, setSelectedDestination] = useState("");
  const [selectmonumentname, setselectmonumentname] = useState("");
  const [totalPage, setTotalPage] = useState("");
  const [isDataLoading, setIsDataLoading] = useState(true);

  const { state } = useLocation();
  // console.log(state, "state");

  const handlePageChange = (page) => setCurrentPage(page - 1);
  const handleRowsPerPageChange = (newRowsPerPage) =>
    setRowsPerPage(newRowsPerPage);

  // const getListDataToServer = async () => {
  //   try {
  //     const { data } = await axiosOther.post("monumentmasterlist");
  //     setBusinessList(data?.DataList);
  //     setFilterValue(data?.DataList);
  //     // console.log(data, "list")
  //   } catch (error) {
  //     console.log("Error fetching monument data:", error);
  //   }
  // };
  const getListDataToServer = async () => {
    try {
      const states =
        state?.selectedDestination?.value === "all"
          ? " "
          : state?.selectedDestination;
      const { data } = await axiosOther.post("monumentmasterlist", {
        MonumentName: filterInput || state?.selectmonumentname,
        id: "",
        Status: "",
        // DestinationId: states,
        Destination: states,
        // HotelCategoryId: "",
        page: currentPage,
        perPage: rowsPerPage,
      });
      setInitialList(data?.DataList);
      setFilterValue(data?.DataList);
      setSelectedDestination(state?.selectedDestination);
      setselectmonumentname(state?.selectmonumentname);

      setTotalPage(data?.TotalPages);

      // console.log(data?.DataList?.map((hotel) => hotel?.HotelCity),"All Hotel Cities");
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getListDataToServer();
  }, []);
  // useEffect(() => {
  //   const filteredList = initialList?.filter(
  //     (data) =>
  //       data?.MonumentName?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
  //       data?.SelfSupplier?.toLowerCase()?.includes(
  //         filterInput?.toLowerCase()
  //       ) ||
  //       data?.Status?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
  //       data?.HotelDestination?.Destinationame?.toLowerCase()?.includes(
  //         filterInput?.toLowerCase()
  //       ) ||
  //       data?.HotelCountry?.CountryName?.toLowerCase()?.includes(
  //         filterInput?.toLowerCase()
  //       ) ||
  //       data?.HotelCity?.CityName?.toLowerCase()?.includes(
  //         filterInput?.toLowerCase()
  //       ) ||
  //       data?.HotelBasicDetails?.HotelChain?.ChainName?.toLowerCase()?.includes(
  //         filterInput?.toLowerCase()
  //       ) ||
  //       data?.HotelBasicDetails?.HotelCategory?.HotelUploadKeyword?.toLowerCase()?.includes(
  //         filterInput?.toLowerCase()
  //       ) ||
  //       data?.HotelBasicDetails?.HotelRoomType?.some((room) =>
  //         room?.Name?.toLowerCase()?.includes(filterInput?.toLowerCase())
  //       ) ||
  //       data?.HotelUniqueID?.toLowerCase()?.includes(filterInput?.toLowerCase())
  //   );
  //   setFilterValue(filteredList);
  // }, [filterInput]);


  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setBusinessData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const getserviceimagelist = async (id) => {
    try {

      setIsDataLoading(true)
      const response = await axiosOther.post("serviceimagelist", {
        Id: "",
        ServiceType: "Monument",
        // ServiceId: Dataview?.toString(),
        ServiceId: id?.toString(),
      });
      setserviceimagelist(response.data.DataList);
    } catch (error) { } finally {
      setIsDataLoading(false)
    }
  };

  //chnage here to image
  useEffect(() => {
    if (row.id) {
      getserviceimagelist(row.id);
    }
  }, [row.id]);


  useEffect(() => {
    const filteredList = initialList?.filter(
      (data) =>
        data?.MonumentName?.toLowerCase()?.includes(
          filterInput?.toLowerCase()
        ) ||
        data?.DestinationName?.toLowerCase()?.includes(
          filterInput?.toLowerCase()
        ) ||
        data?.Status?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
        data?.Description?.toLowerCase()?.includes(filterInput?.toLowerCase())
    );
    setFilterValue(filteredList);
  }, [filterInput]);

  const handleDelete = async (id) => {
    const confirmation = await swal({
      title: "Are you sure want to Delete?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });
    try {
      const { data } = await axiosOther.post("deletemonument", { id });
      if (data?.Status == 1 || data?.status == 1) {
        notifySuccess(data?.Message || data?.message || data?.result);
        getListDataToServer();
      }
    } catch (err) {
      if (err) {
        alert(err?.message || err?.Message);
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
  // const handleimageclick = (row) => {
  //   setDataview(null);
  //   setRow(null);
  //   setTimeout(() => {
  //     setopen(true);
  //     setDataview(row.id);
  //     setRow(row);
  //     getserviceimagelist(row?.id);
  //   });
  // };

  // chnage here to click image
  const handleimageclick = (row) => {
    setserviceimagelist([]); // Clear previous image list to avoid stale data
    setDataview(row.id);
    setRow(row);
    setopen(true);
    getserviceimagelist(row.id); // Call API immediately
  };

  const handleEdit = async (data) => {
    try {
      const { data: languageData } = await axiosOther.post(
        "listLanguageMonument",
        { id: data?.id }
      );

      setBusinessData({
        id: data?.id,
        MonumentName: data?.MonumentName,
        DestinationName: data?.DestinationName,
        Description: data?.Description,
        Status: data?.Status === "Active" ? "1" : "0",
      });

      navigate("/add/monument", {
        state: {
          data,
          listLanguageMonument: languageData?.DataList,
          selectedDestination,
          selectmonumentname,
        },
      });
    } catch (error) {
      console.log("Error fetching language data:", error);
    }
  };

  // Restore filters from navigation state if present
  // useEffect(() => {
  //   if (state?.selectedDestination || state?.selectmonumentname) {
  //     setSelectedDestination(state?.selectedDestination || null);
  //     setselectmonumentname(state?.selectmonumentname || "");
  //     setTimeout(() => {
  //       handlefilter();
  //     }, 0);
  //   } else {
  //     getListDataToServer();
  //   }
  //   // eslint-disable-next-line
  // }, []);

  const table_columns = [
    {
      name: "Sr. No.",
      selector: (row, index) => (
        <span className="font-size-11">
          {currentPage * rowsPerPage + index + 1}
        </span>
      ),
      sortable: false,
      width: "5rem",
    },
    {
      name: "Monument Name",
      selector: (row) => row?.MonumentName,
      cell: (row) => {
        // console.log(row, "Hotakisijsi")
        return (
          <span>{row?.MonumentName}{" "}
            {row?.Default == "Yes" && (
              <i className="mdi mdi-check-circle-outline text-success fs-4"></i>
            )}
          </span>
        )
      },
      sortable: true,
      width: "23rem",
      wrap: true,
      style: { padding: "3px  0px" },
    },
    {
      name: "Destination Name",
      selector: (row) => row?.DestinationName,
      cell: (row) => <span>{row?.DestinationName}</span>,

      sortable: true,
      width: "18rem",
      style: { padding: "0px  0px 0px 13px" },
      wrap: true,
    },
    // {
    //   name: "Description",
    //   sortable: true,
    //   width: "17rem",
    //   wrap: true,
    //   style: { padding: "2px 8px 2px 0px" },
    //   selector: (row) => {
    //     console.log(row, "row");
    //     return (
    //       <>
    //         {
    //           row?.languageDescription?.map((item, index) => (
    //             <span key={index}>
    //               {/* {item?.languageDescription} */}
    //               {item?.languageDescription}{index < row.languageDescription.length - 1 ? ', ' : ''}

    //             </span>
    //           ))
    //         }
    //       </>
    //     );
    //   },
    // },
    {
      name: "Image Count",
      selector: (row) => row?.ImageCount,
      cell: (row) => <span>{row.ImageCount}</span>,
      sortable: true,
      width: "4.5 rem",
    },
    // {
    //   name: "Language",
    //   // selector: (row) => <span>{row.Language}</span>,
    //   sortable: true,
    //   width: "8rem",
    //   selector: (row) => {
    //     // { row?.languageDescription?.map(item => item?.languageName).join(', ') }
    //     console.log(row, "row");
    //     return (
    //       <>
    //         {/* {
    //           row?.languageDescription?.map((item, index) => (
    //             <span key={index}>
    //               {item?.languageName}
    //             </span>
    //           ))
    //         } */}
    //         {
    //           row?.languageDescription?.map((item, index) => (
    //             <span key={index}>
    //               {item?.languageName}{index < row.languageDescription.length - 1 ? ', ' : ''}
    //             </span>
    //           ))
    //         }

    //       </>
    //     );
    //   },
    // },

    {
      name: "Images",

      selector: (row) => (
        <NavLink>
          <Button
            variant="dark light py-1 rounded-pill"
            onClick={() => handleimageclick(row)}
          >
            Add Image
          </Button>
        </NavLink>
      ),
      sortable: false,
    },
    {
      name: "Rate Sheet",
      selector: (row) => (
        <Link
          to={`/monument/rate/${row?.id}`}
          state={{
            ...row, Master: "Monument",
            selectedDestination,
            selectmonumentname,
          }}
        >
          <Button variant="dark light py-1 rounded-pill">View/Add</Button>
        </Link>
      ),
      sortable: false,
      width: "8rem",
    },
    {
      name: "Status",
      selector: (row) => row?.Status,
      cell: (row) => (
        <span
          className={`badge ${row.Status === "Active"
            ? "badge-success light badge"
            : "badge-danger light badge"
            }`}
        >
          {row.Status}
        </span>
      ),
      sortable: true,
      width: "4.5rem",
    },
    {
      name: "Action",
      cell: (row) => (
        <span className="d-flex gap-1">
          <i
            className="fa fa-pencil cursor-pointer action-icon text-success"
            onClick={() => handleEdit(row)}
          ></i>
          <i
            className="fa fa-trash cursor-pointer action-icon text-danger"
            onClick={() => handleDelete(row?.id)}
          ></i>
        </span>
      ),
      width: "4.5rem",
    },
  ];
  console.log(serviceimagelist, "serviceimagelist")
  const handleimageDelete = async (id) => {
    // console.log(id, "id");
    const confirmation = await swal({
      title: "Are you sure want to Delete Image?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });
    if (confirmation) {
      try {
        const { data } = await axiosOther.post("serviceimagedelete", { id });
        if (data?.Status == 1 || data?.status == 1) {
          notifySuccess(data?.Message || data?.message || data?.result);
          getserviceimagelist();
        }
      } catch (err) {
        notifyError(err?.message || err?.Message);
      }
    }
  };
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
  const options = [
    { value: "all", label: "All" },
    ...(destinationlist?.map((dest) => ({
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

  const handlefilter = async () => {
    try {
      const destinationsend =
        selectedDestination?.value === "all" ? " " : selectedDestination;
      const { data } = await axiosOther.post("monumentmasterlist", {
        MonumentName: selectmonumentname,

        id: "",
        Status: "",
        Destination: destinationsend?.value,
        // HotelCategoryId: "",
      });
      navigate("/monument", { replace: true });

      setInitialList(data?.DataList);
      setFilterValue(data?.DataList);
      setTotalPage(data?.TotalPages);

      // setSelectedDestination("")
    } catch (error) {
      console.log("Error fetching destination or hotel list:", error);
    }
    //     const filteredData= 
    // ?.value === 'all'?
    //     ? data // show all data
    // : data.filter(item => item.destinationId === selectedDestination.value);
  };


  return (
    <>
      <Model
        setDataview={setDataview}
        serviceimagelist={serviceimagelist}
        handleimageDelete={handleimageDelete}
        row={row}
        open={open}
        Dataview={Dataview}
        getserviceimagelist={getserviceimagelist}
        setopen={setopen}
        isDataLoading={isDataLoading}
      />
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
          {/* <div className="col-md-4">
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
          <div className="d-flex gap-3 align-items-start">

            <div className=" ">
              <div className="d-flex justify-content-between">
                <label className="" htmlFor="name">
                  Destination
                </label>
              </div>
              <div className="nav-item d-flex align-items-center mb-2 ">
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
            <div className=" pb-2">
              <div className="d-flex justify-content-between ">
                <label className="" htmlFor="name">
                  Monument Name
                </label>
              </div>
              <input
                type="text"
                className="form-control form-control-sm "
                id="hotel name"
                value={selectmonumentname}
                onChange={(e) => setselectmonumentname(e.target.value)}
                placeholder="Search Monument"
              />
            </div>
            <div className="d-flex justify-content-start align-items-center">
              <div className="nav-item d-flex align-items-center">
                <button
                  className="btn btn-primary btn-custom-size mt-3"
                  onClick={handlefilter}
                >
                  <i className="fa-brands fa-searchengin me-2"></i>Search
                </button>
              </div>
            </div>
          </div>
          <div className="d-flex gap-3">
            <button
              className="btn btn-dark btn-custom-size"
              name="SaveButton"
              onClick={() => navigate(-1)}
            >
              <span className="me-1">Back</span>
              <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
            </button>
            <Link
              to="/add/monument"
              className="btn btn-primary btn-custom-size"
            >
              Add Monument
            </Link>
          </div>
        </div>
        <UseTable
          table_columns={table_columns}
          filterValue={filterValue}
          setFilterValue={setFilterValue}
          rowsPerPage={rowsPerPage}
          handlePage={handlePageChange}
          handleRowsPerPage={handleRowsPerPageChange}
        />
      </Tab.Container>
    </>
  );
};

export default Monument;
