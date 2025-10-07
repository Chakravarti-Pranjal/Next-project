import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "bootstrap-daterangepicker/daterangepicker.css";
import { Dropdown, Tab, Nav } from "react-bootstrap";
import { axiosOther } from "../../../../http/axios_base_url";
import { destinationValidationSchema } from "../master_validation.js";
import { destinationimageInitialValue } from "../masters_initial_value.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
import { notifySuccess, notifyError } from "../../../../helper/notify.jsx";
import UseTable from "../../../../helper/UseTable.jsx";
import { scrollToTop } from "../../../../helper/scrollToTop.js";
import { wrap } from "highcharts";
import useImageContainer from "../../../../helper/useImageContainer";
import { Modal, Row, Table, Button } from "react-bootstrap";
import useSingleImageContainer from "../../../../helper/useSingleImageContainer";
import extractTextFromHTML from "../../../../helper/htmlParser.js";
import Model from "./Model.jsx";
// import { min } from "moment";

const Destination = () => {
  const [selectBtn, setSelectBtn] = useState("Newest");
  const [initialList, setInitialList] = useState([]);
  const [formValue, setFormValue] = useState(destinationimageInitialValue);
  const [validationErrors, setValidationErrors] = useState({});
  const [filterValue, setFilterValue] = useState([]);
  const [filterInput, setFiterInput] = useState("");
  const [countryList, setCountryList] = useState([]);
  const [errorFileMessage, setErrorFileMessage] = useState("");
  const [serviceimagelist, setserviceimagelist] = useState([]);
  const [row, setRow] = useState([]);
  const [open, setopen] = useState(false);
  const [Dataview, setDataview] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  const handlePageChange = (page) => setCurrentPage(page - 1);
  const handleRowsPerPageChange = (newRowsPerPage) =>
    setRowsPerPage(newRowsPerPage);

  const getListDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("destinationlist");
      setInitialList(data?.DataList);
      setFilterValue(data?.DataList);
      const dataid = data?.DataList?.id;
      // console.log(data?.DataList,"dataa")
    } catch (error) {
      console.log("destination-error", error);
    }
  };
  useEffect(() => {
    getListDataToServer();
  }, []);

  const handleimageclick = (row) => {
    setRow(null);
    setDataview(null);
    setTimeout(() => {
      setopen(true);
      setDataview(row.id);
      setRow(row);
      getserviceimagelist(row?.id);
    });

    // navigate("/Model",{ state: row });
  };
  const getserviceimagelist = async () => {
    try {
      const response = await axiosOther.post("serviceimagelist", {
        Id: "",
        ServiceType: "Destination",
        ServiceId: Dataview?.toString(),
      });
      // console.log(Dataview, "Dataview");
      setserviceimagelist(response.data.DataList);
      // console.log(response.data.DataList, "112");
    } catch (error) { }
  };
  useEffect(() => {
    if (row) {
      getserviceimagelist();
    }
  }, [row]);

  // const getStateDataToServer = async () => {
  //   if (!formValue?.CountryId) return; // Prevent API call if CountryId is not set
  //   try {
  //     const response = await axiosOther.post("listStateByCountry",{
  //       Search: "",
  //       Status: 1,
  //       countryid: formValue?.CountryId,
  //     });
  //     setStateList(response.data.DataList || []);
  //   } catch (err) {
  //     console.error("Error fetching state data:",err);
  //   }
  // };

  // useEffect(() => {
  //   getStateDataToServer();
  // },[formValue?.CountryId]);

  // const getDataToServer = async () => {
  //   try {
  //     const countryData = await axiosOther.post("countrylist",{
  //       Search: "",
  //       Status: 1,
  //     });
  //     setCountryList(countryData.data.DataList);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  // useEffect(() => {
  //   getDataToServer();
  // },[]);

  useEffect(() => {
    getListDataToServer();
  }, []);

  // useEffect(() => {
  //   const filteredList = initialList?.filter(
  //     (data) => data?.Name?.toLowerCase()?.includes(filterInput?.toLowerCase())
  //     // data?.StateName?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
  //     // data?.CountryName?.toLowerCase()?.includes(filterInput?.toLowerCase())
  //     // data?.Description?.toLowerCase()?.includes(
  //     //   filterInput?.toLowerCase()
  //     // ) ||
  //     // data?.WeatherInformation?.toLowerCase()?.includes(
  //     //   filterInput?.toLowerCase()
  //     // ) ||
  //     // data?.Status?.toLowerCase()?.includes(filterInput?.toLowerCase())
  //   );
  //   setFilterValue(filteredList);
  // }, [filterInput]);

  useEffect(() => {
    if (!filterInput) {
      setFilterValue(initialList);
      return;
    }

    const lowerInput = filterInput.toLowerCase();

    const startsWithList = initialList?.filter(
      (data) => data?.Name?.toLowerCase().startsWith(lowerInput)
    );

    const includesList = initialList?.filter(
      (data) =>
        data?.Name?.toLowerCase().includes(lowerInput) &&
        !data?.Name?.toLowerCase().startsWith(lowerInput)
    );

    setFilterValue([...startsWithList, ...includesList]);
  }, [filterInput, initialList]);

  // useEffect(() => {
  //   if (!filterInput?.trim()) {
  //     // Show all data if input is empty or only spaces
  //     setFilterValue(initialList);
  //   } else {
  //     const filteredList = initialList?.filter((data) =>
  //       data?.Name?.toLowerCase() === filterInput?.toLowerCase()
  //     );
  //     setFilterValue(filteredList);
  //   }
  // }, [filterInput, initialList]);

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
      name: "UniqueID",
      selector: (row) => row?.UniqueID,
      cell: (row) => <span>{row?.UniqueID}</span>,
      sortable: true,
      width: "10rem",
    },
    {
      name: "Country Name",
      selector: (row) => row?.CountryName,
      cell: (row) => <span>{row?.CountryName}{""}
        {row?.SetDefault == "Yes" && (
          <i className="mdi mdi-check-circle-outline text-success fs-4"></i>
        )}
      </span>,
      sortable: true,
      width: "10rem",
    },
    {
      name: "State Name",
      selector: (row) => row?.StateName,
      cell: (row) => <span>{row?.StateName}</span>,
      sortable: true,
      width: "12rem",
    },

    {
      name: "Destination Name",
      selector: (row) => row?.Name,
      cell: (row) => <span>{row?.Name}</span>,
      sortable: true,
      width: "13rem",
      wrap: true,
    },
    // {
    //   name: "Description",
    //   selector: (row) => <span>{row?.Description}</span>,
    //   sortable: true,
    //   width: "20rem",
    //   wrap: true,
    // },
    {
      name: "Weather Information",
      selector: (row) => row?.WeatherInformation,
      cell: (row) => (
        <span>{extractTextFromHTML(row?.WeatherInformation)}</span>
      ),
      sortable: true,
      width: "12rem",
      wrap: true,
    },
    {
      name: "Additional Information",
      selector: (row) => row?.AdditionalInformation,
      cell: (row) => (
        <span>{extractTextFromHTML(row?.AdditionalInformation)}</span>
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
            Add Image
          </Button>
        </NavLink>
      ),
      sortable: false,
      width: "10rem",
    },

    {
      name: "Set Default",
      selector: (row) => row?.SetDefault,
      cell: (row) => <span>{row?.SetDefault}</span>,
      sortable: true,
      // width: "18rem",
      wrap: true,
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
      width: "4.5rem",
    },
  ];

  // const handleFormChange = (e) => {
  //   const { name,value } = e.target;
  //   setFormValue((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormValue({
      ...formValue,
      [name]: value,
    });
  };

  const handleEdit = async (value) => {
    try {
      const { data: datalang } = await axiosOther.post(
        "listLanguageDestination",
        { id: value?.id }
      );
      //  console.log(datalang,"datalang")

      setInitialList({
        id: value?.id,
        Name: value?.Name,
        CountryId: value?.CountryId,
        StateId: value?.StateId,
        Description: value?.Description,
        images: value?.images,
        WeatherInformation: value?.WeatherInformation,
        AdditionalInformation: value?.AdditionalInformation,
        SetDefault: value?.SetDefault == "Yes" ? 1 : 0,
        Status: value?.Status == "Active" ? 1 : 0,
        AddedBy: value?.AddedBy,
        UpdatedBy: value?.UpdatedBy,
      });
      navigate("/destinations-add", {
        state: { value, langdes: datalang?.DataList },
      });
    } catch (error) { }

    // setIsEditing(true);
    // scrollToTop();
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
        const { data } = await axiosOther.post("deletedestination", { id });
        if (data?.Status == 1 || data?.status == 1) {
          notifySuccess(data?.Message || data?.message || data?.result);
          getListDataToServer();
        }
      } catch (err) {
        notifyError(err?.message || err?.Message);
      }
    }
  };
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

  const handleReset = () => {
    setFormValue(destinationInitialValue);
    setValidationErrors({});
    setIsEditing(false);
  };
  const {
    ImageContainer,
    multiFiles,
    setMultiFiles,
    handleFilesChange,
    setMultiImageData,
    multiImageData,
  } = useImageContainer();
  const handleSubmit = async (e, row) => {
    e.preventDefault();

    if (!multiImageData?.length) {
      notifyError("Please upload at least one image.");
      return;
    }

    try {
      const base64Images = multiImageData.map((img, index) => ({
        image_name: `Image${index + 1}`,
        image_path: img.imgString.includes(",")
          ? img.imgString.split(",")[1]
          : img.imgString,
      }));

      const { data } = await axiosOther.post("serviceimageupload", {
        images: base64Images,
        ServiceId: Dataview,
        ServiceType: "Destination",
      });

      if (data?.Status == 1 || data?.status === 1) {
        notifySuccess(data?.Message || data?.message || data?.result);
        setMultiFiles([]);
        setMultiImageData([]);
        getserviceimagelist();
      } else {
        notifySuccess(data?.message || data?.Message || "Upload failed.");
      }
    } catch (error) {
      console.error("Upload Error:", error);

      if (error.response) {
        notifyError(error.response.data?.message || "Server error occurred.");
      } else if (error.request) {
        notifyError("No response from the server. Check your connection.");
      } else {
        notifyError("An unexpected error occurred.");
      }
    }
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
      />

      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">
                {isEditing ? "Update Destination" : "Add Destination "}
              </h4>
              <div className="col-lg-4 d-flex justify-content-end align-items-center gap-2">
                <button
                  className="btn btn-dark btn-custom-size"
                  name="SaveButton"
                  onClick={() => navigate(-1)}
                >
                  <span className="me-1">Back</span>
                  <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
                </button>
                <Link
                  to="/destinations-add"
                  className="btn btn-primary btn-custom-size"
                >
                  Destination Add
                </Link>
              </div>
            </div>
            <div className="card-body">
              <div className="form-validation" ref={formRef}>
                <ToastContainer />
              </div>
            </div>
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
          <div className="col-md-4">
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
          </div>
          <div className="d-flex align-items-center mb-2 flex-wrap">
            <div className="newest ms-3"></div>
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

export default Destination;
