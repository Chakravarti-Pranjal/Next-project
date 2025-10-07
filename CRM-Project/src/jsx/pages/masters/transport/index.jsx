import React, { useState, useRef, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap-daterangepicker/daterangepicker.css";
import { Dropdown, Tab, Nav } from "react-bootstrap";
import { axiosOther } from "../../../../http/axios_base_url";
import UseTable from "../../../../helper/UseTable.jsx";
import DataTable from "react-data-table-component";
import { table_custom_style } from "../../../../css/custom_style";
import { NavLink } from "react-router-dom";
import { Button } from "react-bootstrap";
import extractTextFromHTML from "../../../../helper/htmlParser.js";
import Select from "react-select";
import { useLocation } from "react-router-dom";
import zIndex from "@mui/material/styles/zIndex.js";
import Skeleton from "../../../layouts/Skeleton"

const DropdownBlog = ({ rowData, listFunction }) => {
  const navigate = useNavigate();
};

const Transport = () => {
  const [selectBtn, setSelectBtn] = useState("Newest");
  const [initialList, setInitialList] = useState([]);
  const [filterValue, setFilterValue] = useState([]);
  const [listLanguageTransport, setlistLanguageTransport] = useState([]);
  const [filterInput, setFiterInput] = useState("");
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handlePageChange = (page) => setCurrentPage(page - 1);
  const [destinationlist, setdestinationlist] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState("");
  const [selectedTransferlist, setselectedTransferlist] = useState("");
  const [Transferlist, setTransferlist] = useState("");
  const [selecttransfername, setselecttransfername] = useState("");
  const [selecttransfertype, setSelecttransfertype] = useState("")
  const [transfertypelist, settransftypelist] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const [totalPage, setTotalPage] = useState("");
  const { state } = useLocation();
  const handleRowsPerPageChange = (newRowsPerPage) =>
    setRowsPerPage(newRowsPerPage);

  // const getListDataToServer = async () => {
  //   try {
  //     // First API Call: Get transport master list
  //     const { data } = await axiosOther.post("transportmasterlist");

  //     // Ensure DataList exists and is an array
  //     const transportList = data?.DataList || [];
  //     setInitialList(transportList);
  //     setFilterValue(transportList);
  //     // console.log(data, "datas")
  //     // Extract transport ID (assuming we need the first item’s ID)
  //     // const transportId = transportList.length > 0 ? transportList[0].id : null;

  //     // if (transportId) {
  //     //   try {
  //     //     // Second API Call: Fetch language data using transport ID

  //     //     console.log(languageData?.DataList, "languagelist");
  //     //   } catch (error) {
  //     //     console.log("languagelist-error", error);
  //     //   }
  //     // } else {
  //     //   console.warn("No transport ID found, skipping second API call.");
  //     // }
  //   } catch (error) {
  //     console.log("country-error", error);
  //   }
  // };
  // console.log(state, "state")
  const getListDataToServer = async () => {
    try {
      setIsLoading(true);
      try {
        const states =
          state?.selectedDestination?.value === "all"
            ? " "
            : state?.selectedDestination || selectedDestination;
        const transferid =

          state?.selectedTransferlist?.value === "all"
            ? "state?.selectedTransferlist.value || selectedTransferlist" : " "
        // : state?.selectedTransferlist.value || selectedTransferlist;
        const ServiceNames = state?.selecttransfername || selecttransfername
        const { data } = await axiosOther.post("transportmasterlist", {
          ServiceName: ServiceNames,
          id: "",
          Status: "",
          DestinationId: states,
          TransferType: transferid,
          // Destination: states,
          // HotelCategoryId: "",
          page: currentPage,
          perPage: rowsPerPage,
        });
        setInitialList(data?.DataList);
        setFilterValue(data?.DataList);
        setSelectedDestination(state?.selectedDestination);
        setselectedTransferlist(state?.selectedTransferlist);
        setselecttransfername(ServiceNames);


        setTotalPage(data?.TotalPages);

        // console.log(data?.DataList?.map((hotel) => hotel?.HotelCity),"All Hotel Cities");
      } catch (error) {
        console.log("error", error);
      }
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getListDataToServer();
  }, []);
  const options = [
    { value: "all", label: "All" },
    ...(destinationlist?.map((dest) => ({
      value: dest.id,
      label: dest.Name,
    })) || []),
  ];
  const optionss = [
    { value: "all", label: "All" },
    ...(
      Array.isArray(Transferlist)
        ? Transferlist.map((dest) => ({
          value: dest.id,
          label: dest.Name,
        }))
        : []
    )
  ];

  // console.log(Transferlist,"Transferlist")

  // const option = [
  //   // { value: "all", label: "All" },
  //   ...(transfertypelist?.map((list) => ({
  //     value: list.id,
  //     label: list.Name,
  //   })) || []),
  // ];

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

  const getdestinationlist = async () => {
    // try {
    //   const { data } = await axiosOther.post("transportmasterlist");

    //   const transport = data?.DataList?.map((i)=>i.TransferType);
    //   setTransferlist(transport);
    //   console.log(transport,"transport")

    // } catch (error) {
    //   console.log("Error fetching destination or hotel list:", error);
    // }
    try {
      const { data } = await axiosOther.post("transfertypemasterlist");

      // const transfertypelist = data?.DataList;
      // settransftypelist(transfertypelist);
      const transfertypelist = data?.DataList || []; // Fallback to empty array
      setTransferlist(transfertypelist);
      // console.log(data?.DataList, "data11")

    } catch (error) {
      console.log("Error fetching destination or hotel list:", error);
    }
    try {
      const { data } = await axiosOther.post("destinationlist");

      const destinationList = data?.DataList;
      setdestinationlist(destinationList);
    } catch (error) {
      console.log("Error fetching destination or hotel list:", error);
    }
  };
  const gettransfertpelist = async () => {
    try {
      const { data } = await axiosOther.post("transfertypemasterlist");

      // const transfertypelist = data?.DataList;
      // settransftypelist(transfertypelist);
      const transfertypelist = data?.DataList || []; // Fallback to empty array
      settransftypelist(transfertypelist);
      // console.log(data?.DataList, "data11")

    } catch (error) {
      console.log("Error fetching destination or hotel list:", error);
    }
  };

  useEffect(() => {
    getdestinationlist();
    gettransfertpelist()
  }, []);
  const handlefilter = async () => {
    try {
      setIsLoading(true);
      try {
        const destinationsend =
          selectedDestination?.value === "all" ? " " : selectedDestination?.value ?? "";

        const transferid =
          selectedTransferlist?.value === "all" ? " " : selectedTransferlist?.value ?? "";

        const { data } = await axiosOther.post("transportmasterlist", {
          Name: selecttransfername,
          TransferType: transferid,
          id: "",
          Status: "",
          DestinationId: destinationsend,
        });

        navigate("/transport", { replace: true });
        setSelectedDestination(selectedDestination);

        setInitialList(data?.DataList);
        setFilterValue(data?.DataList);
        setTotalPage(data?.TotalPages);
      } catch (error) {
        console.log("Error fetching destination or transfer list:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };




  useEffect(() => {
    if (!filterInput) {
      setFilterValue(initialList);
      return;
    }

    const lowerCaseFilter = filterInput.toLowerCase();

    const filteredList = initialList?.filter((data) => {
      return (
        data?.Name?.toLowerCase()?.includes(lowerCaseFilter) ||
        data?.Destinations?.[0]?.Name?.toLowerCase()?.includes(
          lowerCaseFilter
        ) ||
        data?.NoOfDays?.DestinationName?.toLowerCase()?.includes(
          lowerCaseFilter
        ) ||
        data?.TransferType?.id?.toLowerCase()?.includes(lowerCaseFilter) ||
        data?.Detail?.toLowerCase()?.includes(lowerCaseFilter)
      );
    });

    setFilterValue(filteredList);
  }, [filterInput, initialList]); // Added `initialList` in dependencies to ensure proper updates.

  // const handleEdit = async (rowData) => {
  //   try {
  //     const { data: languageData } = await axiosOther.post(
  //       "listLanguageTransport",
  //       { id: rowData?.id }
  //     );

  //     console.log(data, "data");

  //     // Ensure the fetched data is properly passed to the next page
  //     navigate("/transport/add", {
  //       state: {
  //         rowData,
  //         listLanguageTransport: languageData?.DataList || [],
  //       },
  //     });

  //     // console.log(languageData?.DataList, "check"); // Log the correct fetched data
  //   } catch (error) {
  //     console.error("Error fetching language data:", error);
  //   }
  // };

  const handleEdit = async (rowData) => {
    try {
      const { data: languageData } = await axiosOther.post(
        "listLanguageTransport",
        { id: rowData?.id }
      );

      // Navigate to edit page with both the row data and language data
      const rowDatas = {
        ...rowData,
        selectedDestination: selectedDestination,
        selecttransfername: selecttransfername,
        selectedTransferlist: selectedTransferlist

      }
      navigate("/transport/add", {
        state: {
          rowDatas, // Pass the entire row data
          listLanguageTransport: languageData?.DataList || [],
          isEdit: true, // Add a flag to indicate edit mode
        },
      });
    } catch (error) {
      console.error("Error fetching language data:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const { data } = await axiosOther.post("deletetransportmaster", {
        id: id,
      });

      if (data?.Status == 1 || data?.status == 1) {
        alert(data?.Message || data?.message);
        getListDataToServer();
      }
    } catch (err) {
      if (err) {
        alert(err?.message || err?.Message);
      }
    }
  };

  const table_columns = [
    {
      name: "Name",
      selector: (row) => row?.Name,
      cell: (row) => <span>{row?.Name}{" "}
        {row?.Default == "Yes" && (
          <i className="mdi mdi-check-circle-outline text-success fs-4"></i>
        )}
      </span>,
      sortable: true,
      width: "15rem",
      minWidth: "180px",
      wrap: true,
    },
    {
      name: "UniqueId",
      selector: (row) => row?.UniqueId,
      cell: (row) => <span>{row?.UniqueId}</span>,
      sortable: true,
      width: "8rem",
      minWidth: "180px",
      wrap: true,
    },
    {
      name: "Destinations",
      selector: (row) => row?.Destinations[0]?.Name,
      cell: (row) => <span>{row?.Destinations[0]?.Name}</span>,
      sortable: true,
      wrap: true,
    },
    {
      name: "Transfer Type",
      selector: (row) => row?.TransferType?.Name,
      cell: (row) => <span>{row?.TransferType?.Name}</span>,

      sortable: true,
      wrap: true,
    },
    {
      name: "No Of Days",
      selector: (row) => row?.NoOfDays,
      cell: (row) => <span>{row?.NoOfDays}</span>,
      sortable: true,
      wrap: true,
    },
    {
      name: "Detail",
      selector: (row) => row?.Detail,
      cell: (row) => <span>{row?.Detail}</span>,
      sortable: true,
      wrap: true,
      minWidth: "180px",
    },
    {
      name: "Rate Sheet",
      selector: (row) => (
        <NavLink
          to={`/transport/rate/${row?.id}`}
          state={{
            // Name: row?.TransferType?.Name,
            Name: `${row?.TransferType?.Name} (${row?.Name})`,
            TransferTypeId: row?.TransferType?.id,
            Master: "Transport",
            Destinations: row?.Destinations,
            selectedDestination: selectedDestination,
            selecttransfername: selecttransfername,
            selectedTransferlist: selectedTransferlist

          }}
        >
          <Button variant="dark light py-1 rounded-pill"><span>View/Add</span></Button>
        </NavLink>
      ),
    },
    {
      name: "Date and Time",
      selector: (row) => row?.CreatedAt,
      cell: (row) => {
        if (!row?.CreatedAt) return null;

        const dateObj = new Date(row.CreatedAt);
        const formattedDate = dateObj.toLocaleDateString("en-GB"); // dd/mm/yyyy
        return <span>{formattedDate}</span>;
      },
      sortable: true,
    },

    // {
    //   name: "Date and Time ",
    //   selector: (row) => row?.CreatedAt,
    //   cell: (row) => {
    //     return <span>{row?.CreatedAt}</span>;
    //   },
    //   sortable: true,
    // },
    {
      name: "Added By",
      selector: (row) => row?.AddedBy,
      cell: (row) => {
        return <span>{row?.AddedBy}</span>;
      },
      sortable: true,
    },
    {
      name: "Updated By",
      selector: (row) => row?.UpdatedBy,
      cell: (row) => {
        return <span>{row?.UpdatedBy}</span>;
      },
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row?.Status,
      cell: (row) => {
        return (
          <span
            className={`badge ${row.Status == "1" ? "badge-success light badge" : "badge-danger light badge"
              }`}
          >
            {row.Status == 1 ? "Active" : "Inactive"}
          </span>
        );
      },
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => {
        return (
          <span className="d-flex gap-1">
            <i
              className="fa-solid fa-pencil cursor-pointer action-icon text-success"
              data-toggle="modal"
              data-target="#modal_form_vertical"
              onClick={() => handleEdit(row)}
            ></i>
            <i
              className="fa-solid fa-trash-can cursor-pointer text-danger action-icon"
              onClick={() => handleDelete(row?.id)}
            ></i>
          </span>
        );
      },
    },
  ];

  return (
    <>
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
          {/* <div className="col-md-4 d-flex  justify-content-end align-items-center">
            <div className="nav-item d-flex  align-items-center ">
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
          <div className="d-flex gap-3 align-items-start  m-auto">

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
            <div className=" ">
              <div className="d-flex justify-content-between">
                <label className="" htmlFor="name">
                  Transfer Type
                </label>
              </div>
              <div className="nav-item d-flex align-items-center mb-2 ">
                <Select
                  id="optionss"
                  options={optionss}
                  value={selectedTransferlist || optionss[0]}
                  onChange={setselectedTransferlist}
                  styles={customStyles}
                  isSearchable
                  className="customSelectLightTheame"
                  classNamePrefix="custom"
                  // placeholder={
                  //   state?.selectedDestination?.label || state?.Destinationame
                  // }
                  filterOption={(option, inputValue) =>
                    option.label.toLowerCase().startsWith(inputValue.toLowerCase())
                  }
                />
              </div>
            </div>
            <div className=" pb-2">
              <div className="d-flex justify-content-between ">
                <label className="" htmlFor="name">
                  Transport Name
                </label>
              </div>
              <input
                type="text"
                className="form-control form-control-sm "
                id="hotel name"
                value={selecttransfername}
                onChange={(e) => setselecttransfername(e.target.value)}
                placeholder="Search "
              />
            </div>
            {/* <div className=" pb-2">
              <div className="d-flex justify-content-between ">
                <label className="" htmlFor="name">
                  Transfer Type
                </label>
              </div>
              <input
                type="text"
                className="form-control form-control-sm "
                id="hotel name"
                value={selecttransfertype}
                onChange={(e) => setSelecttransfertype(e.target.value)}
                placeholder="Search Hotel"
              />
            </div> */}
            {/* <div className=" ">
              <div className="d-flex justify-content-between">
                <label className="" htmlFor="name">
                  Transfer Type
                </label>
              </div>
              <div className="nav-item d-flex align-items-center mb-2 ">
                <Select
                  id="destination"
                  options={option}
                  value={transfertypelist || option[0]}
                  onChange={settransftypelist}
                  styles={customStyles}
                  isSearchable
                  className=""
                  placeholder={
                    state?.transfertypelist?.label || state?.transfertypelist
                  }
                  filterOption={(option, inputValue) =>
                    option.label.toLowerCase().startsWith(inputValue.toLowerCase())
                  }
                />
              </div>
            </div> */}
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
          <div className=" d-flex justify-content-center align-items-center  mb-2 flex-wrap">
            <div className="guest-calendar"></div>
            <div className="">
              <Link
                to={"/view-transport"}
                className="btn btn-primary btn-custom-size"
              >
                View Transport
              </Link>
            </div>
          </div>
          <div className="d-flex align-items-center mb-2 flex-wrap flex-column flex-sm-row gap-1">
            <div className="guest-calendar"></div>
            <div className="newest ms-lg-3 d-flex gap-2">
              <button
                className="btn btn-dark btn-custom-size"
                name="SaveButton"
                onClick={() => navigate("/masters")}
              >
                <span className="me-1">Back</span>
                <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
              </button>
              <Link
                to={"/transport/add"}
                className="btn btn-primary btn-custom btn-custom-size"
              >
                Add Transport
              </Link>
            </div>
          </div>
        </div>
        {isLoading ? (
          <Skeleton />
        ) : (
          <UseTable
            table_columns={table_columns}
            filterValue={filterValue}
            setFilterValue={setFilterValue}
            rowsPerPage={rowsPerPage}
            handlePage={handlePageChange}
            handleRowsPerPage={handleRowsPerPageChange}
          />
        )}
      </Tab.Container>
    </>
  );
};
export { DropdownBlog };
export default Transport;
