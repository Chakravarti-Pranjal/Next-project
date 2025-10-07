import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap-daterangepicker/daterangepicker.css";
import { Dropdown, Tab, Nav, Button } from "react-bootstrap";
import { axiosOther } from "../../../../http/axios_base_url";
import { activityMasterInitialValue } from "../masters_initial_value";
import { guideServiceValidationSchema } from "../master_validation";
import { NavLink } from "react-router-dom";
import DataTable from "react-data-table-component";
import { ToastContainer } from "react-toastify";
import { table_custom_style } from "../../../../css/custom_style";
import { notifySuccess, notifyError } from "../../../../helper/notify.jsx";
import UseTable from "../../../../helper/UseTable.jsx";
import { scrollToTop } from "../../../../helper/scrollToTop.js";
import { wrap } from "highcharts";
import extractTextFromHTML from "../../../../helper/htmlParser.js";
import Model from "./Model.jsx";
import Select from "react-select";
import { useLocation } from "react-router-dom";
import zIndex from "@mui/material/styles/zIndex.js";
import Skeleton from "../../../layouts/Skeleton";

const Activity = () => {
  const [initialList, setInitialList] = useState([]);
  const [formValue, setFormValue] = useState(activityMasterInitialValue);
  const [validationErrors, setValidationErrors] = useState({});
  const [filterValue, setFilterValue] = useState([]);
  const [listLanguageActivity, setlistLanguageActivity] = useState([]);
  const [serviceimage, setserviceimage] = useState([]);
  const [filterInput, setFiterInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [serviceimagelist, setserviceimagelist] = useState([]);
  const [row, setRow] = useState([]);
  const [open, setopen] = useState(false);
  const [Dataview, setDataview] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [destinationlist, setdestinationlist] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState("");
  const [selectactivityname, setselectactivityname] = useState("");
  const [selectservicetype, setSelectservicetype] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [totalPage, setTotalPage] = useState("");
  const { state } = useLocation();

  const handlePageChange = (page) => setCurrentPage(page - 1);
  const handleRowsPerPageChange = (newRowsPerPage) =>
    setRowsPerPage(newRowsPerPage);
  const navigate = useNavigate();

  // console.log(state, "checkstate");

  const getListDataToServer = async () => {
    try {
      setIsLoading(true);
      try {
        const states =
          state?.selectedDestination?.value === "all"
            ? " "
            : selectedDestination?.value ||
              state?.selectedDestination?.value ||
              " ";
        const activityName =
          selectactivityname || state?.selectactivityname || "";
        const { data } = await axiosOther.post("activitymasterlist", {
          ServiceName: activityName,
          id: "",
          Status: "",
          DestinationId: states,
          page: currentPage,
          perPage: rowsPerPage,
        });

        setInitialList(data?.DataList);
        setFilterValue(data?.DataList);
        setSelectedDestination(
          state?.selectedDestination || selectedDestination
        );
        setselectactivityname(state?.selectactivityname || selectactivityname);
        setTotalPage(data?.TotalPages);
      } catch (error) {
        console.log("error", error);
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

  const handlefilter = async () => {
    try {
      setIsLoading(true);
      try {
        const destinationsend =
          selectedDestination?.value === "all"
            ? " "
            : selectedDestination?.value;
        const { data } = await axiosOther.post("activitymasterlist", {
          ServiceName: selectactivityname,
          ServiceType: selectservicetype,
          id: "",
          Status: "",
          DestinationId: destinationsend,
        });
        navigate("/activity", { replace: true });
        setInitialList(data?.DataList);
        setFilterValue(data?.DataList);
        setTotalPage(data?.TotalPages);
      } catch (error) {
        console.log("Error fetching destination or hotel list:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getListDataToServer();
  }, []);

  const getserviceimagelist = async () => {
    try {
      const response = await axiosOther.post("serviceimagelist", {
        Id: "",
        ServiceType: "Activity",
        ServiceId: Dataview?.toString(),
      });
      setserviceimagelist(response.data.DataList);
    } catch (error) {}
  };

  useEffect(() => {
    if (row) {
      getserviceimagelist();
    }
  }, [row]);

  const handleDelete = async (id) => {
    const confirmation = await swal({
      title: "Are you sure?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });

    if (confirmation) {
      try {
        const { data } = await axiosOther.post("deleteactivity", {
          id: id,
        });
        if (data?.Status == 1 || data?.status == 1 || data?.result) {
          notifySuccess(data?.Message || data?.message || data?.result);
          // Call getListDataToServer to refresh the list while preserving filters
          await getListDataToServer();
        }
      } catch (err) {
        if (err) {
          notifyError(err?.message || err?.Message);
        }
      }
    }
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

  const handleEdit = async (data) => {
    try {
      const { data: languageData } = await axiosOther.post(
        "listLanguageActivity",
        { id: data?.id }
      );
      const { data: ratedata } = await axiosOther.post("activityratelist", {
        id: data?.id,
      });

      navigate("/activity/add", {
        state: {
          data,
          listLanguageActivity: languageData?.DataList,
          listrate: ratedata,
          selectedDestination,
          selectactivityname,
        },
      });
    } catch (error) {
      console.log("Error fetching language data:", error);
    }
  };

  const handleReset = (activityMasterInitialValue) => {
    setFormValue([]);
    setValidationErrors({});
    setIsEditing(false);
  };

  const handleimage = (row) => {
    setRow(null);
    setDataview(null);

    setTimeout(() => {
      setRow(row);
      setDataview(row.id);
      setopen(true);
      getserviceimagelist(row.id);
    }, 100);
  };

  useEffect(() => {
    const filteredList = initialList?.filter(
      (data) =>
        data?.ServiceType?.toLowerCase()?.includes(
          filterInput?.toLowerCase()
        ) ||
        data?.ServiceName?.toLowerCase()?.includes(
          filterInput?.toLowerCase()
        ) ||
        data?.Destination?.Name?.toLowerCase()?.includes(
          filterInput?.toLowerCase()
        ) ||
        data?.Status?.toLowerCase()?.includes(filterInput?.toLowerCase())
    );

    setFilterValue(filteredList);
  }, [filterInput]);

  const table_columns = [
    {
      name: "Unique Id",
      selector: (row) => row?.UniqueId,
      cell: (row) => <span className="font-size-11">{row?.UniqueId}</span>,
      sortable: true,
      width: "10rem",
    },
    {
      name: "Name",
      selector: (row) => row?.ServiceName,
      cell: (row) => (
        <span>
          {row?.ServiceName}{" "}
          {row?.Default == 1 && (
            <i className="far fa-check-circle text-success fs-4"></i>
          )}
        </span>
      ),
      sortable: true,
      width: "25rem",
      wrap: true,
    },
    {
      name: "Type",
      selector: (row) => row?.Type,
      cell: (row) => <span>{row?.Type}</span>,
      sortable: true,
      width: "10rem",
      style: { padding: "0px 12px" },
    },
    {
      name: "Destination",
      selector: (row) => row?.DestinationName,
      cell: (row) => <span>{row?.DestinationName}</span>,
      sortable: true,
      width: "15rem",
      wrap: true,
      style: { padding: "2px 10px" },
    },
    {
      name: "Images",
      selector: (row) => (
        <NavLink>
          <Button
            variant="dark light py-1 rounded-pill"
            onClick={() => handleimage(row)}
          >
            Add Image
          </Button>
        </NavLink>
      ),
      width: "13rem",
    },
    {
      name: "Status",
      selector: (row) => row?.Status,
      cell: (row) => {
        return (
          <span
            className={`badge ${
              row.Status == "Active" ? "bg-success" : "bg-danger"
            }`}
          >
            {row.Status}
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
      width: "4.5rem",
    },
  ];

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
          <div className="card-action coin-tabs">
            <Nav as="ul" className="nav nav-tabs">
              <Nav.Item as="li" className="nav-item">
                <Nav.Link className="nav-link" eventKey="All">
                  All List
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </div>
          <div className="d-flex gap-3 align-items-start m-auto">
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
                    option.label
                      .toLowerCase()
                      .startsWith(inputValue.toLowerCase())
                  }
                />
              </div>
            </div>
            <div className=" pb-2">
              <div className="d-flex justify-content-between ">
                <label className="" htmlFor="name">
                  Activity Name
                </label>
              </div>
              <input
                type="text"
                className="form-control form-control-sm "
                id="Activity name"
                value={selectactivityname}
                onChange={(e) => setselectactivityname(e.target.value)}
                placeholder="Search Hotel"
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
          <div className="d-flex align-items-center mb-2 flex-wrap">
            <div className="guest-calendar"></div>
            <div className="newest ms-3">
              <button
                className="btn btn-dark btn-custom-size m-1"
                name="SaveButton"
                onClick={() => navigate(-1)}
              >
                <span className="me-1">Back</span>
                <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
              </button>
              <Link
                to={"/activity/add"}
                className="btn btn-primary btn-custom-size"
              >
                Add Activity
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
export default Activity;
