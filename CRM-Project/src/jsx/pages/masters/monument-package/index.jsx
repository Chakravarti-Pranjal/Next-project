import React, { useState, useEffect } from "react";
import "bootstrap-daterangepicker/daterangepicker.css";
import { Tab, Nav } from "react-bootstrap";
import { axiosOther } from "../../../../http/axios_base_url";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import UseTable from "../../../../helper/UseTable.jsx";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
import Select from "react-select";
import Skeleton from "../../../layouts/Skeleton"

const notifyTopCenter = (message) => {
  toast.success(`${message}`, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

const MonumentPackage = () => {
  const [initialList, setInitialList] = useState([]);
  const [filterValue, setFilterValue] = useState([]);
  const [filterInput, setFiterInput] = useState("");
  const [listLanguageMonumentPackage, setlistLanguageMonumentPackage] = useState([]);
  const [listPost, setListPost] = useState({
    id: "",
    PackageName: "",
    destination: "",
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [selectedDestination, setSelectedDestination] = useState(null); // Initialize as null
  const [destinationlist, setdestinationlist] = useState([]);
  const [selectpackagename, setselectpackagename] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { state } = useLocation();
  const navigate = useNavigate();

  const handlePageChange = (page) => setCurrentPage(page - 1);
  const handleRowsPerPageChange = (newRowsPerPage) => setRowsPerPage(newRowsPerPage);

  const getListDataToServer = async (filter = {}) => {
    try {
      setIsLoading(true);
      try {
        const { data } = await axiosOther.post("monument-package-list", {
          ...listPost,
          ...filter,
        });
        setInitialList(data?.DataList);
        setFilterValue(data?.DataList);
      } catch (error) {
        console.log("error", error);
      }
      try {
        const { data: langdata } = await axiosOther.post("listLanguageMonumentPackage");
        setlistLanguageMonumentPackage(langdata?.DataList);
      } catch (error) {
        console.log("error", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getdestinationlist = async () => {
    try {
      const { data } = await axiosOther.post("destinationlist");
      setdestinationlist(data?.DataList);
    } catch (error) {
      console.log("Error fetching destination list:", error);
    }
  };

  // Restore filter state when component mounts or when navigating back
  useEffect(() => {
    getdestinationlist();
    if (state?.selectedDestination || state?.selectpackagename) {
      // Restore filter values from state
      setSelectedDestination(state?.selectedDestination || null);
      setselectpackagename(state?.selectpackagename || "");
      // Fetch filtered data based on restored values
      getListDataToServer({
        PackageName: state?.selectpackagename || "",
        Destination: state?.selectedDestination?.value === "all" ? "" : state?.selectedDestination?.value || "",
      });
    } else {
      // Fetch default data if no filter state is present
      getListDataToServer();
    }
  }, []);

  useEffect(() => {
    const filteredList = initialList?.filter(
      (data) =>
        data?.PackageName?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
        data?.monument?.name?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
        data?.DestinationName?.toLowerCase()?.includes(filterInput?.toLowerCase())
    );
    setFilterValue(filteredList);
  }, [filterInput, initialList]);

  useEffect(() => {
    const getMessage = localStorage.getItem("success-message");
    if (getMessage != null) {
      notifyTopCenter(getMessage);
      localStorage.removeItem("success-message");
    }
  }, []);

  const handleDelete = async (id) => {
    const confirmation = await swal({
      title: "Are you sure?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });

    if (confirmation) {
      try {
        const { data } = await axiosOther.post("monument-package-destroy", { id });
        if (data?.Status === 1 || data?.status === 1 || data?.result) {
          notifyTopCenter(data?.Message || data?.message || data?.result);
          getListDataToServer({
            PackageName: selectpackagename,
            Destination: selectedDestination?.value === "all" ? "" : selectedDestination?.value || "",
          });
        }
      } catch (err) {
        alert(err?.message || err?.Message);
      }
    }
  };

  const handleEdit = async (row) => {
    try {
      const { data: languageData } = await axiosOther.post("listLanguageMonumentPackage", { id: row?.id });
      navigate("/monument-package/add", {
        state: {
          row,
          listLanguagemonumentpackage: languageData?.DataList || [],
          selectedDestination, // Pass filter criteria
          selectpackagename, // Pass filter criteria
        },
      });
    } catch (error) {
      console.error("Error fetching language data:", error);
    }
  };

  const handlefilter = async () => {
    try {
      setIsLoading(true);
      try {
        const destinationsend = selectedDestination?.value === "all" ? "" : selectedDestination?.value || "";
        await getListDataToServer({
          PackageName: selectpackagename,
          Destination: destinationsend,
        });
      } catch (error) {
        console.log("Error fetching filtered data:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const options = [
    { value: "all", label: "All" },
    ...(destinationlist?.map((dest) => ({
      value: dest.id,
      label: dest.Name,
    })) || []),
  ];

  const table_columns = [
    {
      name: "Sr. No.",
      selector: (row, index) => (
        <span className="font-size-11">{currentPage * rowsPerPage + index + 1}</span>
      ),
      sortable: false,
      width: "7rem",
    },
    {
      name: "Photo",
      selector: (row) => row?.ImagePath,
      cell: (row) =>
        row?.ImagePath && (
          <img
            src={row?.ImagePath}
            alt={row?.PackageName}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = fallback;
            }}
            style={{ height: "30px", width: "30px" }}
          />
        ),
      sortable: true,
      width: "8rem",
    },
    {
      name: "Package Name",
      selector: (row) => row?.PackageName,
      cell: (row) => (
        <span className="font-size-11">
          {row?.PackageName}{" "}
          {row?.Default === "Yes" && (
            <i className="mdi mdi-check-circle-outline text-success fs-4"></i>
          )}
        </span>
      ),
      sortable: true,
      width: "15rem",
      wrap: true,
    },

    {
      name: "Destination Name",
      selector: (row) => row?.DestinationName,
      cell: (row) => <span className="font-size-11">{row?.DestinationName}</span>,
      sortable: true,
    },
    {
      name: "Day Type",
      selector: (row) => row?.DayType,
      cell: (row) => <span className="font-size-11">{row?.DayType}</span>,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row?.Status,
      cell: (row) => (
        <span
          className={`badge ${row.Status === "Active" ? "badge-success light badge" : "badge-danger light badge"
            }`}
        >
          {row.Status}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => (
        <div className="d-flex align-items-center gap-1 sweetalert">
          <i
            className="fa-solid fa-pencil cursor-pointer text-success action-icon"
            onClick={() => handleEdit(row)}
          ></i>
          <i
            className="fa-solid fa-trash-can cursor-pointer text-danger action-icon sweet-confirm"
            onClick={() => handleDelete(row?.id)}
          ></i>
        </div>
      ),
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
        <div className="col-md-1 col-sm-1">
          <div className="d-flex justify-content-between">
            <label htmlFor="destination">Destination</label>
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
              placeholder={state?.selectedDestination?.label || "Select Destination"}
              filterOption={(option, inputValue) =>
                option.label.toLowerCase().startsWith(inputValue.toLowerCase())
              }
            />
          </div>
        </div>
        <div className="pb-2">
          <div className="d-flex justify-content-between">
            <label htmlFor="package-name">Package Name</label>
          </div>
          <input
            type="text"
            className="form-control form-control-sm"
            id="package-name"
            value={selectpackagename}
            onChange={(e) => setselectpackagename(e.target.value)}
            placeholder="Search Package"
          />
        </div>
        <div className="col-md-1 d-flex justify-content-start align-items-center">
          <button className="btn btn-primary btn-custom-size" onClick={handlefilter}>
            <i className="fa-brands fa-searchengin me-2"></i>Search
          </button>
        </div>
        <div className="d-flex align-items-center mb-2 flex-wrap">
          <div className="guest-calendar"></div>
          <div className="newest ms-3 d-flex gap-2">
            <button
              className="btn btn-dark btn-custom-size"
              onClick={() => navigate(-1, { state: { selectedDestination, selectpackagename } })}
            >
              <span className="me-1">Back</span>
              <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
            </button>
            <Link to="/monument-package/add" className="btn btn-primary btn-custom-size">
              Add Package
            </Link>
          </div>
        </div>
      </div>
      {isLoading ? (
        <Skeleton />
      ) : (
        <>
          <UseTable
            table_columns={table_columns}
            filterValue={filterValue}
            setFilterValue={setFilterValue}
            rowsPerPage={rowsPerPage}
            handlePage={handlePageChange}
            handleRowsPerPage={handleRowsPerPageChange}
          />
          <ToastContainer />
        </>
      )}
    </Tab.Container>
  );
};
export default MonumentPackage;