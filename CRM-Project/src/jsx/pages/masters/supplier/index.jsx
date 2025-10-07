import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, NavLink, Link } from "react-router-dom";
import "bootstrap-daterangepicker/daterangepicker.css";
import { Dropdown, Tab, Nav, Button } from "react-bootstrap";
import { axiosOther } from "../../../../http/axios_base_url.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
import { notifySuccess, notifyError } from "../../../../helper/notify.jsx";
import UseTable from "../../../../helper/UseTable.jsx";
import { scrollToTop } from "../../../../helper/scrollToTop.js";
import { wrap } from "highcharts";
import Model from "./Model.jsx";

import { MdNavigateNext } from "react-icons/md";
import { MdOutlineSkipNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import { MdOutlineSkipPrevious } from "react-icons/md";
import DataTable from "react-data-table-component";
import { FaEnvelope, FaPhone } from "react-icons/fa"; // Import icons
// Mine
import { table_custom_style } from "../../../../css/custom_style.js";
import { ThemeContext } from "../../../../context/ThemeContext.jsx";
import Select from "react-select";
import { useLocation } from "react-router-dom";
const Supplier = () => {
  const { background } = useContext(ThemeContext);
  const [selectBtn, setSelectBtn] = useState("Newest");
  const [destinationlist, setdestinationlist] = useState([]);
  const [initialList, setInitialList] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState("");
  const [selectSuppliername, setselectSuppliername] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [filterValue, setFilterValue] = useState([]);
  const [filterInput, setFiterInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPage, setTotalPage] = useState("");
  const [serviceimagelist, setserviceimagelist] = useState([]);
  const [supplierserviceid, setsupplierserviceid] = useState(" ");
  const [supplierserviceidlist, setsupplierserviceidlist] = useState([]);
  const [row, setRow] = useState([]);
  const [open, setopen] = useState(false);
  const [Dataview, setDataview] = useState("");
  const navigate = useNavigate();
  const { state } = useLocation();
  console.log(state, "state");

  // const handlePageChange = (page) => setCurrentPage(page - 1);
  // const handleRowsPerPageChange = (newRowsPerPage) =>
  //   setRowsPerPage(newRowsPerPage);

  const getListDataToServer = async () => {
    try {
      const states =
        state?.selectedDestination?.value === "all"
          ? " "
          : state?.selectedDestination?.value ||
          selectedDestination?.value ||
          "";
      const statess =
        state?.selectedDestination?.value === "all"
          ? " "
          : state?.selectedDestination || selectedDestination || "";
      const supplierserviceids =
        state?.supplierserviceid?.value === "all"
          ? " "
          : state?.supplierserviceid?.value || supplierserviceid?.value || " ";
      const supplierserviceidss =
        state?.supplierserviceid?.value === "all"
          ? " "
          : state?.supplierserviceid || supplierserviceid || " ";
      const selectSuppliernames =
        state?.selectSuppliername || selectSuppliername || " ";
      // const selectSuppliernamess =  state?.selectSuppliername ||  selectSuppliername
      const { data } = await axiosOther.post("supplierlist", {
        Name: selectSuppliernames,
        id: "",
        DefaultDestination: "",
        DestinationId: states,
        SupplierService: supplierserviceids,
        NotHotelShow: true,
        page: currentPage,
        perPage: rowsPerPage,
      });

      setTotalPage(data?.TotalPages);
      setInitialList(data?.DataList);
      setFilterValue(data?.DataList);

      setSelectedDestination(statess);
      setselectSuppliername(state?.selectSuppliername);
      setsupplierserviceid(supplierserviceidss);
    } catch (error) {
      console.log("supplier-error", error);
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

  useEffect(() => {
    const filteredList = initialList?.filter(
      (data) =>
        data?.Name?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
        data?.AliasName?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
        data?.Email?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
        data?.DestinationName?.name?.includes(filterInput?.toLowerCase())
    );
    setFilterValue(filteredList);
    console.log(filterInput, filteredList, "testing");
  }, [filterInput]);

  const table_columns = [
    {
      name: "Sr. No.",
      selector: (row, index) => row?.id,
      cell: (row, index) => {
        const serialNumber = (currentPage * rowsPerPage) + index + 1 - rowsPerPage;
        console.log(index, "midla");
        return <span className="font-size-11">{serialNumber}</span>;
      },
      sortable: false,
      width: "4rem",
    },
    {
      name: "Supplier Id",
      selector: (row, index) => row?.UniqueID,
      cell: (row) => (
        <span
          className="cursor-pointer text-hover-red"
          onClick={() => navigate(`/view/supplier/${row?.id}`)}
        >
          {row?.UniqueID}
        </span>
      ),
      sortable: true,
      wrap: true,
      width: "6rem",
    },

    {
      name: "Types",
      selector: (row, index) => row?.SupplierServiceName?.map((item) => item?.name).join(", ") || "",
      cell: (row) => (
        <span style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
          {row?.SupplierServiceName?.map((item) => item?.name).join(", ")}
        </span>
      ),
      sortable: true,
      wrap: true,
      width: "7rem",
    },

    {
      name: "Name",
      selector: (row, index) => row?.Name,
      cell: (row) => {
        return <span>{row?.Name}</span>;
      },
      sortable: true,
      wrap: true,
    },
    {
      name: "Alias Name",
      selector: (row, index) => row?.AliasName,
      cell: (row) => <span>{row?.AliasName}</span>,
      sortable: true,
      wrap: true,
    },
    {
      name: "Destination Name",
      selector: (row, index) => row?.DestinationName?.map((dest) => dest?.name).join(", ") || "",
      cell: (row) => (
        <span>
          {row?.DestinationName?.map((dest) => dest?.name).join(", ")}
        </span>
      ),
      sortable: true,
      wrap: true,
    },
    // {
    //   name: "Default Destination",
    //   selector: (row, index) => row?.DefaultDestination?.map((dest) => dest?.name).join(", ") || "",
    //   cell: (row) => (
    //     <span>
    //       {row?.DefaultDestination?.map((dest) => dest?.name).join(", ")}
    //     </span>
    //   ),
    //   sortable: true,
    //   wrap: true,
    // },
    {
      name: "Default Destination",
      selector: (row) =>
        row?.DefaultDestination?.map((dest) => dest?.name).join(", ") || "",
      cell: (row) => (
        <span>
          {row?.DefaultDestination?.map((dest, i) => (
            <span key={i} style={{ marginRight: "8px" }}>
              {dest?.name}
            </span>
          ))}
          {row?.DefaultDestination?.length > 0 && (
            <i
              className="mdi mdi-check-circle-outline text-success fs-4 pt-2"
              style={{ marginLeft: "5px" }}
            ></i>
          )}
        </span>
      ),
      sortable: true,
      wrap: true,
    },
    {
      name: "Contact Person",
      selector: (row, index) => row?.ContactPerson,
      cell: (row) => <span>{row?.ContactPerson}</span>,
      sortable: true,
      wrap: true,
    },
    {
      name: "Email/Phone",
      selector: (row, index) => row?.Email,
      cell: (row) => (
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {row?.Email && (
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <FaEnvelope color="#007bff" size={14} /> {/* Blue email icon */}
              {row.Email}
            </span>
          )}
          {row?.Phone && (
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <FaPhone color="#28a745" size={14} /> {/* Green phone icon */}
              {row.Phone}
            </span>
          )}
        </div>
      ),
      sortable: true,
      width: "12rem",
      wrap: true,
    },
    {
      name: "Images",
      selector: (row) => (
        <NavLink>
          <Button
            variant="dark light py-1 rounded-pill"
            onClick={() => handleimageclick(row)}
          >
            <span>Add Image</span>
          </Button>
        </NavLink>
      ),
      sortable: false,
    },
    {
      name: "Added By",
      selector: (row, index) => row?.AddedBy,
      cell: (row) => <span>{row?.AddedBy}</span>,
      sortable: true,
      wrap: true,
      width: "5rem",
    },

    {
      name: "Status",
      selector: (row, index) => row?.Status,
      cell: (row) => (
        <span
          className={`badge ${row.Status === "Yes"
            ? "badge-success light badge"
            : "badge-danger light badge"
            }`}
        >
          {row.Status === "Yes" ? "Active" : "Inactive"}
        </span>
      ),
      sortable: true,
      width: "4.5rem",
    },
    {
      name: "Action",
      selector: (row) => (
        <div className="d-flex align-items-center gap-1 sweetalert">
          <i
            className="fa-solid fa-pencil cursor-pointer text-success action-icon"
            onClick={() => handleEdit(row)}
            onChange={scrollToTop()}
          ></i>
          <i
            className="fa-solid fa-trash-can cursor-pointer text-danger action-icon sweet-confirm"
            onClick={() => handleDelete(row?.id)}
          ></i>
        </div>
      ),
      width: "4.5rem",
    },
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
      const supplierserviceids =
        supplierserviceid?.value === "all" ? " " : supplierserviceid;
      const { data } = await axiosOther.post("supplierlist", {
        Name: selectSuppliername,

        id: "",
        DefaultDestination: "",
        DestinationId: destinationsend?.value,
        SupplierService: supplierserviceids?.value,
        NotHotelShow: true,
      });
      navigate("/supplier", { replace: true });

      setInitialList(data?.DataList);
      setFilterValue(data?.DataList);
      setTotalPage(data?.TotalPages);

      // setSelectedDestination("")
    } catch (error) {
      console.log("Error fetching destination or hotel list:", error);
    }
    //     const filteredData= selectedDestination?.value === 'all'?
    //     ? data // show all data
    // : data.filter(item => item.destinationId === selectedDestination.value);
  };
  const options = [
    { value: " ", label: "All" },
    ...(destinationlist?.map((dest) => ({
      value: dest.id,
      label: dest.Name,
    })) || []),
  ];

  const optionss = [
    { value: " ", label: "All" },
    ...(supplierserviceidlist?.map((ss) => ({
      value: ss.id,
      label: ss.name,
    })) || []),
  ];

  const handleEdit = (value) => {
    const values = {
      ...value,
      selectedDestination: selectedDestination,
      selectSuppliername: selectSuppliername,
      supplierserviceid: supplierserviceid,
    };
    navigate("/add/supplier", { state: values });
  };

  const handleDelete = async (id) => {
    const confirmation = await swal({
      title: "Are you sure want to Delete?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });
    if (confirmation) {
      try {
        const { data } = await axiosOther.post("destroysupplier", { id });
        if (data?.Status === 1 || data?.status === 1) {
          notifySuccess(data?.Message || data?.message || data?.error);
          getListDataToServer();
        }
      } catch (err) {
        notifyError(err?.message || err?.Message);
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
  const getserviceimagelist = async () => {
    try {
      const response = await axiosOther.post("serviceimagelist", {
        Id: "",
        ServiceType: "Supplier",
        ServiceId: Dataview?.toString(),
      });

      setserviceimagelist(response.data.DataList);
    } catch (error) { }
  };
  useEffect(() => {
    if (row) {
      getserviceimagelist();
    }
  }, [row]);
  const handleimageclick = (row) => {
    setDataview(null);
    setRow(null);
    setTimeout(() => {
      setopen(true);
      setDataview(row.id);
      setRow(row);
      getserviceimagelist(row.id);
    }, 0);

    // navigate("/Model",{ state: row });
  };
  const handleimageDelete = async (id) => {
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
  };
  const getdestinationlist = async () => {
    try {
      const { data } = await axiosOther.post("destinationlist");

      const destinationList = data?.DataList;
      setdestinationlist(destinationList);
    } catch (error) {
      console.log("Error fetching destination or hotel list:", error);
    }
    try {
      const { data } = await axiosOther.post("listproduct");
      setsupplierserviceidlist(data?.Datalist);
    } catch (error) {
      console.log(error, "error");
    }
  };

  useEffect(() => {
    getdestinationlist();
  }, []);

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
  // console.log(optionss[0],"0001")

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
      />
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
          <div className="col-sm-1">
            <label htmlFor="" className="">
              Destination{" "}
            </label>
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
                placeholder={state?.selectedDestination?.label}
                filterOption={(option, inputValue) =>
                  option.label
                    .toLowerCase()
                    .startsWith(inputValue.toLowerCase())
                }
              />
            </div>
          </div>
          <div className="col-sm-1">
            <label htmlFor="" className="">
              Type{" "}
            </label>
            <div className="nav-item d-flex align-items-center ">
              <Select
                id="supplierserviceid"
                options={optionss}
                value={supplierserviceid || optionss[0]}
                onChange={setsupplierserviceid}
                styles={customStyles}
                isSearchable
                className="customSelectLightTheame"
                classNamePrefix="custom"
                placeholder={state?.supplierserviceid?.label}
                filterOption={(optionss, inputValue) =>
                  optionss.label
                    .toLowerCase()
                    .startsWith(inputValue.toLowerCase())
                }
              />
            </div>
          </div>
          <div className="col-md-6 col-lg-2 ">
            <div className="d-flex justify-content-between ">
              <label className="" htmlFor="Supplier">
                Supplier Name
              </label>
            </div>
            <input
              type="text"
              className="form-control form-control-sm "
              id="selectSuppliername"
              value={selectSuppliername}
              onChange={(e) => setselectSuppliername(e.target.value)}
              placeholder={state?.selectSuppliername}
            />
          </div>
          <div className="col-md-1 me-5">
            <div className="nav-item d-flex justify-content-start align-items-center">
              <button
                className="btn btn-primary btn-custom-size"
                onClick={handlefilter}
              >
                <i className="fa-brands fa-searchengin me-2"></i>Search
              </button>
            </div>
          </div>
          {/* <div className="col-md-4 d-flex justify-content-start align-items-center">
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
              <Link
                to={"/add/supplier"}
                className="btn btn-primary btn-custom-size"
              >
                Add Supplier
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
      </Tab.Container>
    </>
  );
};

export default Supplier;
