import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, NavLink, Link, useLocation } from "react-router-dom";
import "bootstrap-daterangepicker/daterangepicker.css";
import { Dropdown, Tab, Nav } from "react-bootstrap";
import { axiosOther } from "../../../../../http/axios_base_url";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
import { notifySuccess, notifyError } from "../../../../../helper/notify.jsx";
import { scrollToTop } from "../../../../../helper/scrollToTop.js";
import { wrap } from "highcharts";
import Select from "react-select";
import { MdNavigateNext } from "react-icons/md";
import { MdOutlineSkipNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import { MdOutlineSkipPrevious } from "react-icons/md";
import DataTable from "react-data-table-component";
import { table_custom_style } from "../../../../../css/custom_style.js";
import { ThemeContext } from "../../../../../context/ThemeContext.jsx";
// import Skeleton from "../../layouts/Skeleton";
import Skeleton from "../../../../../jsx/layouts/Skeleton.jsx";

const Agent = () => {
  const { background } = useContext(ThemeContext);
  const [selectBtn, setSelectBtn] = useState("Newest");
  const [initialList, setInitialList] = useState([]);
  //const [formValue, setFormValue] = useState(countryInitialValue);
  const [validationErrors, setValidationErrors] = useState({});
  const [filterValue, setFilterValue] = useState([]);
  const [filterInput, setFiterInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef(null);
  const [countryList, setCountryList] = useState([]);
  const [businesstypelist, setBusinesstypelist] = useState([]);
  const [selectedBussinessType, setselectedBussinessType] = useState("");
  const [selectedCountry, setselectedCountry] = useState("");
  const [selectUniqueId, setselectUniqueId] = useState("");
  const [selectCompanyName, setselectCompanyName] = useState("");
  const [totalPage, setTotalPage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // const handlePageChange = (page) => setCurrentPage(page - 1);
  // const handlePageChange = (page) => setCurrentPage(page + 1);

  // const handleRowsPerPageChange = (newRowsPerPage) =>
  //   setRowsPerPage(newRowsPerPage);
  const { state } = useLocation()
  // console.log(currentPage, "current")

  const getListDataToServer = async () => {
    setIsLoading(true);

    const BussinessType =
      state?.selectedBussinessType?.value === 'all'
        ? ''
        : state?.selectedBussinessType || '' || selectedBussinessType || " ";
    const Country =
      state?.selectedCountry?.value === 'all'
        ? ''
        : state?.selectedCountry || '' || selectedCountry || " ";
    const UniqueId = state?.selectUniqueId || selectUniqueId || '';
    const CompanyName = state?.selectCompanyName || selectCompanyName || '';
    try {
      const { data } = await axiosOther.post("agentlist", {
        id: "",
        BussinessType: BussinessType,
        Country: Country,
        UniqueId: UniqueId,
        CompanyName: CompanyName,
        page: currentPage,
        perPage: rowsPerPage,
      });
      console.log(data?.DataList, 'data?.DataList');

      setInitialList(data?.DataList);
      setFilterValue(data?.DataList);
      setselectedBussinessType(BussinessType)
      setselectedCountry(Country)
      setselectUniqueId(UniqueId)
      setselectCompanyName(CompanyName)
      setTotalPage(data?.TotalPages);
    } catch (error) {
      console.log("agent-error", error);
    } finally {
      setIsLoading(false);
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
      width: "100% !important",
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


  useEffect(() => {
    getListDataToServer();
  }, []);

  useEffect(() => {
    getListDataToServer();
  }, [currentPage, rowsPerPage]);

  useEffect(() => {
    const filteredList = initialList?.filter(
      (data) =>
        data?.CompanyName?.toLowerCase()?.includes(
          filterInput?.toLowerCase()
        ) ||
        data?.BussinessType?.toLowerCase()?.includes(
          filterInput?.toLowerCase()
        ) ||
        data?.Nationality?.toLowerCase()?.includes(
          filterInput?.toLowerCase()
        ) ||
        data?.Country?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
        data?.CompanyPhoneNumber?.toLowerCase()?.includes(
          filterInput?.toLowerCase()
        ) ||
        data?.CompanyEmailAddress?.toLowerCase()?.includes(
          filterInput?.toLowerCase()
        )
    );
    setFilterValue(filteredList);
  }, [filterInput]);
  const table_columns = [
    // {
    //   name: "Sr. No.",
    //   selector: (row, index) => {
    //     const serialNumber = (currentPage * rowsPerPage) + index + 1 - rowsPerPage;
    //     // console.log(index, "midla");
    //     return <span className="font-size-11">{serialNumber}</span>;
    //   },
    //   sortable: true,
    //   width: "5rem",
    // },
    {
      name: "Sr. No.",
      selector: (row, index) => row?.UniqueID, // Just return index here (if needed)
      cell: (row, index) => {
        const serialNumber = (currentPage * rowsPerPage) + index + 1 - rowsPerPage;
        return <span className="font-size-11">{serialNumber}</span>;
      },
      sortable: false, // Sorting on Sr. No. usually doesn't make sense
      width: "5rem",
    },
    {
      name: "Agent Id",
      selector: (row) => row?.UniqueID,
      cell: (row) => <span
        onClick={() => navigate(`/view/agent/${row?.id}`)}
        className="cursor-pointer"
      >
        {row?.UniqueID}
      </span>,
      sortable: true,
      width: "6rem",
      wrap: true,
    },
    {
      name: "Company Name",
      selector: (row) => row?.CompanyName,
      cell: (row) => <span>{row?.CompanyName}</span>,
      sortable: true,
      wrap: true,
      width: "10rem",
    },
    {
      name: "Bussiness Type",
      selector: (row) => row?.UniqueID,
      cell: (row) => <span>{row?.BussinessTypeName}</span>,
      sortable: true,
      wrap: true,
      width: "9rem",
    },
    {
      name: "Email",
      selector: (row) => row?.CompanyEmailAddress,
      cell: (row) => <span>{row?.CompanyEmailAddress}</span>,
      sortable: true,
      width: "11rem",
      wrap: true,
    },
    {
      name: "Phone",
      selector: (row) => row?.CompanyPhoneNumber,
      cell: (row) => <span>{row?.CompanyPhoneNumber}</span>,
      sortable: true,
      width: "6rem",
      wrap: true,
    },
    {
      name: "Nationality",
      selector: (row) => row?.NationalityName,
      cell: (row) => <span>{row?.NationalityName}</span>,

      sortable: true,
      width: "7rem",
      wrap: true,
    },
    {
      name: "Country",
      selector: (row) => row?.CountryName,
      cell: (row) => <span>{row?.CountryName}</span>,
      sortable: true,
      width: "7rem",
      wrap: true,
    },
    {
      name: "City",
      selector: (row) => row?.CountryName,

      cell: (row) => <span>{row?.CountryName}
        {/* {console.log(row, "row")
      } */}
      </span>,
      sortable: true,
      width: "7rem",
      wrap: true,
    },
    {
      name: "Market Type",
      selector: (row) => row?.MarketTypeName,
      cell: (row) => <span>{row?.MarketTypeName}</span>,
      sortable: true,
      width: "8rem",
      wrap: true,
    },
    {
      name: "Assign Person",
      selector: (row) => row?.SalesPersonName,
      cell: (row) => <span>{row?.SalesPersonName}</span>,
      sortable: true,
      width: "8rem",
      wrap: true,
    },
    {
      name: "Department",
      selector: (row) => row?.MarketTypeName,
      cell: (row) => <span>{row?.MarketTypeName}</span>,
      sortable: true,
      width: "8rem",
      wrap: true,
    },
    {
      name: "Status",
      selector: (row) => row?.status,
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
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleEdit = (value) => {
    const values = {
      ...value,
      selectedBussinessType: selectedBussinessType,
      selectedCountry: selectedCountry,
      selectUniqueId: selectUniqueId,
      selectCompanyName: selectCompanyName,
    }
    navigate("/add/agent", { state: values });
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
        const { data } = await axiosOther.post("destroyagent", { id });
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
      // notifySuccess(getMessage);
      localStorage.removeItem("success-message");
    }
  }, []);
  const getDataToServer = async () => {
    try {
      const countryData = await axiosOther.post("countrylist", {
        Search: "",
        Status: 1,
      });
      setCountryList(countryData.data.DataList);
    } catch (err) {
      console.log(err);
    }

    try {
      const Data = await axiosOther.post("businesstypelist", {
        Search: "",
        Status: 1,
      });
      setBusinesstypelist(Data.data.DataList);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getDataToServer();
  }, []);
  const options = [
    { value: "all", label: "All" },
    ...(businesstypelist?.map((dest) => ({
      value: dest.id,
      label: dest.Name,
    })) || []),
  ];
  const optionss = [
    { value: "all", label: "All" },
    ...(countryList?.map((dest) => ({
      value: dest.id,
      label: dest.Name,
    })) || []),
  ];
  const handlefilter = async (e) => {
    try {

      const BussinessType = selectedBussinessType?.value === 'all'
        ? ' '
        : selectedBussinessType.value || " "
      const Country = selectedCountry?.value === 'all'
        ? ' '
        : selectedCountry.value || " "

      const { data } = await axiosOther.post("agentlist", {
        id: "",
        BussinessType: BussinessType,
        Country: Country,
        UniqueId: selectUniqueId,
        CompanyName: selectCompanyName,
      });
      navigate("/agent", { replace: true });

      setInitialList(data?.DataList);
      setFilterValue(data?.DataList);
      setTotalPage(data?.TotalPages);
    } catch (error) {
      console.log("Error fetching destination or hotel list:", error);
    } finally {
      setIsLoading(false);
    }
  };
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
  return (
    <Tab.Container defaultActiveKey="All">
      <div className="row align-items-end flex-wrap mb-2 gap-2">
        <div className="col-12 col-md-2 col-lg-1 card-action coin-tabs">
          <Nav as="ul" className="nav nav-tabs">
            <Nav.Item as="li" className="nav-item">
              <Nav.Link className="nav-link" eventKey="All" style={{ whiteSpace: "nowrap" }}>
                All List
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </div>
        <div className="col-12 col-md-3 col-lg-2">
          <div className="d-flex justify-content-between">
            <label className="" htmlFor="name">
              BussinessType
            </label>
          </div>
          <div className="nav-item">
            <Select
              id="Bussiness"
              options={options}
              value={selectedBussinessType || options[0]}
              onChange={setselectedBussinessType}
              className="customSelectLightTheame"
              classNamePrefix="custom"
              styles={customStyles}
              isSearchable
              // placeholder={
              //   state?.selectedDestination?.label || state?.Destinationame
              // }
              filterOption={(option, inputValue) =>
                option.label.toLowerCase().startsWith(inputValue.toLowerCase())
              }
            />
          </div>
        </div>
        <div className="col-12 col-md-3 col-lg-2">
          <div className="d-flex justify-content-between">
            <label className="" htmlFor="name">
              Country
            </label>
          </div>
          <div className="nav-item">
            <Select
              id="Country"
              options={optionss}
              value={selectedCountry || optionss[0]}
              onChange={setselectedCountry}
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
        <div className="col-12 col-md-2 col-lg-2">
          <div className="d-flex justify-content-between ">
            <label className="" htmlFor="name">
              UniqueId
            </label>
          </div>
          <input
            type="text"
            className="form-control form-control-sm "
            id="UniqueId "
            value={selectUniqueId}
            onChange={(e) => setselectUniqueId(e.target.value)}
            placeholder="Search UniqueId"
          />
        </div>
        <div className="col-12 col-md-2 col-lg-2">
          <div className="d-flex justify-content-between ">
            <label className="" htmlFor="name">
              Company Name
            </label>
          </div>
          <input
            type="text"
            className="form-control form-control-sm "
            id=" Company Name"
            value={selectCompanyName}
            onChange={(e) => setselectCompanyName(e.target.value)}
            placeholder="Company Name"
          />
        </div>
        <div className="col-2 col-md-2 col-lg-1 d-flex me-1">
          <button
            className="btn btn-primary btn-custom-size flex-shrink-0 flex-grow-0"
            onClick={handlefilter}
          >
            <i className="fa-brands fa-searchengin me-2"></i>Search
          </button>
        </div>
        <div className="col-2 col-md-2 col-lg-1 d-flex me-1">
          <button
            className="btn btn-dark btn-custom-size flex-shrink-0 flex-grow-0"
            name="SaveButton"
            onClick={() => navigate(-1)}
          >
            <span className="me-1">Back</span>
            <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
          </button>
        </div>
        <div className="col-2 col-md-2 col-lg-1 d-flex me-1">
          <Link
            to={"/add/agent"}
            className="btn btn-primary btn-custom-size flex-shrink-0 flex-grow-0"
          >
            Add Agent
          </Link>
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
        {/* <div className="col-12 d-flex align-items-center mb-2 flex-wrap">
          <div className="guest-calendar"></div>

        </div> */}
      </div>
      <ToastContainer />
      {/* <DataTable
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
        /> */}
      {isLoading ? (
        <Skeleton />
      ) : (
        <>
          <div className="table-responsive">
            <div
              id="example2_wrapper"
              className="dataTables_wrapper no-footer"
            >
              <DataTable
                columns={table_columns}
                data={initialList}
                sortIcon={<i className="fa-solid fa-sort fs-4"></i>}
                striped
                paginationServer
                highlightOnHover
                customStyles={table_custom_style(background)}
                paginationTotalRows={4}
                defaultSortFieldId="queryDate" // this is the id from above
                defaultSortAsc={false} // descending = latest first
                className="custom-scrollbar"
              />
              {/* <CustomPagination /> */}
            </div>
          </div>
        </>
      )}
      <CustomPagination />
    </Tab.Container>
  );
};

export default Agent;

